<?php
namespace admin\api;

class VideosException extends \Exception{}

use admin\components;
use models;

class Videos{
    /**
     * Finds record by pk.
     *
     * @param int $id. PK of record
     * @param string|array $with. Relations for record
     * @return models\ActiveRecord|models\Videos
     * @throws VideosException
     */
    protected function findRecordById($id, $with=array()){
        if(is_string($with)){
            $with=array($with);
        }

        $pModel=new models\Videos();
        $record=$pModel->with($with)->findByPk($id);

        if(empty($record)){
            throw new VideosException("Record #{$id} was not found");
        }

        return $record;
    }

    /**
     * Uploads video to server from $_POST
     *
     * @return array. Saved pictures paths array
     * @throws VideosException
     */
    public function upload(){
        if(empty($_POST['models_Videos'])){
            throw new VideosException('Invalid $_POST request. $_POST[\'models_Videos\'] is missing');
        }

        $videoModel=new models\Videos('input');
        $videoModel->attributes=$_POST['models_Videos'];

        if(!$videoModel->validate()){
            throw new VideosException('Form validation failed. Check all fields');
        }

        $videoId=$videoModel->getIdFromLink();
        if(empty($videoId)){
            throw new VideosException('Invalid link format. Failed to fetch video id');
        }

        \Yii::app()->google->client->setAccessToken(\Yii::app()->session->get('oauthToken'));

        $videos=\Yii::app()->youtube->sdk->videos->listVideos('snippet', array('id'=>$videoId));

        if(!isset($videos['items'][0])){
            throw new VideosException('Video was not found!');
        }

        $video=$videos['items'][0];
        if(!isset($video['snippet']['thumbnails']['maxres'])){
            throw new VideosException('Videos quality is too low for fetching big thumb!');
        }

        if(!isset($video['snippet']['title'])){
            throw new VideosException('Video must have a title');
        }

        $title=$video['snippet']['title'];
        $description=isset($video['snippet']['description'])?$video['snippet']['description']:null;
        $source=$video['snippet']['thumbnails']['maxres']['url'];
        $extension=pathinfo($source, PATHINFO_EXTENSION);

        $videoModel=new models\Videos('create');

        // Copy source to temp directory.
        // It is needed, because Image extension only works with files on local machine
        $temp=models\Videos::createTmpPath(time().'.'.$extension);
        copy($source, $temp);

        // Save small thumb image from src image
        $image=models\Images::blank();
        $videoModel->smallThumbId=$image->saveSmallThumb($temp, models\Videos::createSmallThumbPath($image->getFileName($extension)));

        // Save big thumb image from src image
        $image=models\Images::blank();
        $videoModel->bigThumbId=$image->saveBigThumb($temp, models\Videos::createBigThumbPath($image->getFileName($extension)));

        // Remove temporary file
        @unlink($temp);

        if(!$videoModel->create($videoId, $title, $description)){
            throw new VideosException('Failed to create record');
        }

        // Save cover
        $this->crop($videoModel->id);

        $dataTable=new components\DataTables(models\Videos::DT_COLUMNS());
        $videoModel->with(array('smallThumb', 'bigThumb', 'cover'))->refresh();
        $videoModelArray=$videoModel->toArray();

        return array(
            'row'=>$dataTable->formatData(array($videoModel))[0],
            'data'=>models\Pictures::format($videoModelArray)
        );
    }

    /**
     * Crops cover from big thumb of created video
     *
     * @param int $videoId. Video id to create crop for
     * @param int|string $left. Left start crop coordinate in px
     * @return bool
     * @throws VideosException
     */
    public function crop($videoId, $left='center'){
        $video=$this->findRecordById($videoId, array('bigThumb', 'cover'));

        if($video->cover){
            $video->cover->remove(models\Videos::createCoverPath($video->cover->name));
        }

        $source=models\Videos::createBigThumbPath($video->bigThumb->name);
        $extension=pathinfo($source, PATHINFO_EXTENSION);

        $image=models\Images::blank();
        $video->coverId=$image->cropCover(
            $source,
            models\Videos::createCoverPath($image->getFileName($extension)),
            $left
        );

        if(!$video->save(false)){
            throw new VideosException('Failed to update record with cover image');
        }

        return array('html'=>\CHtml::image(
            models\Videos::createCoverUrl($image->name),
            '',
            array('data-big-thumb'=>models\Videos::createBigThumbUrl($video->bigThumb->name))
        ));
    }

    /**
     * Returns content for videos table content
     *
     * @return array
     */
    public function content(){
        $criteria=new \CDbCriteria();
        $criteria->with=array('smallThumb', 'bigThumb', 'cover');

        $dataTable=new components\DataTables(models\Videos::DT_COLUMNS(), new models\Videos(), $criteria);
        return $dataTable->request()->format();
    }

    /**
     * Updates video's attributes
     *
     * @param int $videoId. Video's to update id
     * @param array $attributes. Attributes to update
     * @param bool $force. Force update
     * @return bool
     * @throws VideosException
     */
    public function update($videoId, $attributes, $force=true){
        $videosModel=new models\Videos();

        $result=$videosModel->updateByPk($videoId, $attributes);
        if($force && !$result){
            throw new VideosException('Failed to update record');
        }

        return true;
    }

    /**
     * Updates record's cover.
     * Source images gets from $_FILES array
     *
     * @param int $videoId. Video id to update record of
     * @return string
     * @throws VideosException
     */
    public function updateCover($videoId){
        $video=$this->findRecordById($videoId, 'cover');
        $video->cover->remove(models\Videos::createCoverPath($video->cover->name));

        $image=models\Images::blank();
        $upload=\CUploadedFile::getInstance($video, 'cover');
        $extension=$upload->getExtensionName();

        $video->coverId=$image->cropCover($upload->getTempName(), models\Videos::createCoverPath($image->getFileName($extension)));
        if(!$video->save(false)){
            throw new VideosException('Failed to update record cover');
        }

        return array('html'=>\CHtml::image(
            models\Videos::createCoverUrl($image->name),
            '',
            array('data-big-thumb'=>models\Pictures::createBigThumbUrl($video->bigThumb->name))
        ));
    }

    /**
     * Updates cover order of specific record
     *
     * @param int $videoId. Video's id to update cover order
     * @param mixed $facadeIndex. New value to set
     * @param bool $force. Force update or not
     * @return bool
     */
    public function updateFacadeIndex($videoId, $facadeIndex, $force=true){
        $video=$this->findRecordById($videoId);

        // Cast value type
        if(empty($facadeIndex)){
            $facadeIndex=new \CDbExpression('NULL');
        }

        // Value has not been changed
        if($video->facadeIndex==$facadeIndex){
            return false;
        }

        if(!empty($facadeIndex)){
            $videosModel=new models\Videos();
            $videosModel->updateAll(
                array('facadeIndex'=>new \CDbExpression('NULL')),
                'facadeIndex=:facadeIndex',
                array('facadeIndex'=>$facadeIndex)
            );
        }

        return $this->update($videoId, array('facadeIndex'=>$facadeIndex), $force);
    }

    /**
     * Removes video
     *
     * @param int $videoId. Video's to delete id
     * @return bool
     * @throws VideosException
     */
    public function delete($videoId){
        $video=$this->findRecordById($videoId, array('smallThumb', 'bigThumb', 'cover'));

        $video->smallThumb->remove(models\Videos::createSmallThumbPath($video->smallThumb->name));
        $video->bigThumb->remove(models\Videos::createBigThumbPath($video->bigThumb->name));
        $video->cover->remove(models\Videos::createCoverPath($video->cover->name));

        if(!$video->delete()){
            throw new VideosException('Failed to remove record');
        }

        return true;
    }
} 