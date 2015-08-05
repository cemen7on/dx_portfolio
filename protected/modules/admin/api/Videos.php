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

        // Save cover
        $image=models\Images::blank();
        $videoModel->coverId=$image->cropCover($temp, models\Videos::createCoverPath($image->getFileName($extension)));

        // Remove temporary file
        @unlink($temp);

        if(!$videoModel->create($videoId, $title, $description)){
            throw new VideosException('Failed to create record');
        }

        $dataTable=new components\DataTables(models\Videos::DT_COLUMNS());
        $videoModel->with(array('smallThumb', 'bigThumb', 'cover'))->refresh();
        $videoModelArray=$videoModel->toArray();

        return array(
            'row'=>$dataTable->formatData(array($videoModel))[0],
            'data'=>models\Pictures::format($videoModelArray)
        );
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
     * @param int $attributes. Attributes to update
     * @return bool
     * @throws Exception
     */
    public function update($videoId, $attributes){
        $vModel=new Videos();

        $result=$vModel->updateByPk($videoId, $attributes);
        if(!$result){
            throw new Exception('Failed to update record');
        }

        return true;
    }

    /**
     * Updates record's cover.
     * Source images gets from $_FILES array
     *
     * @param int $videoId. Video id to update record of
     * @return string
     * @throws Exception
     */
    public function updateCover($videoId){
        $vModel=$this->findRecordById($videoId, 'imageCover');

        if($vModel->imageCover){
            $vModel->imageCover->remove(CVideos::createCoverPath($vModel->imageCover->name));
        }

        $image=Images::blank();
        $upload=CUploadedFile::getInstance($vModel, 'cover');
        $extension=$upload->getExtensionName();

        $vModel->cover=$image->cropCover($upload->getTempName(), CVideos::createCoverPath($image->getFileName($extension)));

        if(!$vModel->save(false)){
            throw new Exception('Failed to update record cover');
        }

        return array('html'=>Html::cover(CVideos::createCoverUrl($image->name)));
    }

    /**
     * Updates cover order of specific record
     *
     * @param int $videoId. Video's id to update cover order
     * @param mixed $coverOrder. New value to update
     * @return bool
     */
    public function updateCoverOrder($videoId, $coverOrder){
        $this->findRecordById($videoId);

        if(!empty($coverOrder)){
            // Reset old cover's order value
            $vModel=new Videos();
            $vModel->updateAll(
                array('cover_order'=>new CDbExpression('NULL')),
                'cover_order=:cover_order',
                array('cover_order'=>$coverOrder)
            );
        }

        $value=!empty($coverOrder)?(int)$coverOrder:new CDbExpression('NULL');

        return $this->update($videoId, array('cover_order'=>$value));
    }

    /**
     * Removes video
     *
     * @param int $videoId. Video's to delete id
     * @return bool
     * @throws Exception
     */
    public function delete($videoId){
        $video=$this->findRecordById($videoId, array('thumbSmall', 'thumbBig', 'imageCover'));

        $video->thumbSmall->remove(CVideos::createSmallThumbPath($video->thumbSmall->name));
        $video->thumbBig->remove(CVideos::createBigThumbPath($video->thumbBig->name));

        if($video->imageCover){
            $video->imageCover->remove(CVideos::createCoverPath($video->imageCover->name));
        }

        if(!$video->delete()){
            throw new Exception('Failed to remove record');
        }

        return true;
    }
} 