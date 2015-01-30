<?php
class SVideos{
    /**
     * Finds record by pk.
     *
     * @param int $id. PK of record
     * @param string|array $with. Relations for record
     * @return CActiveRecord|CVideos
     * @throws Exception
     */
    protected function findRecordById($id, $with=array()){
        if(is_string($with)){
            $with=array($with);
        }

        $pModel=new Videos();
        $record=$pModel->with($with)->findByPk($id);

        if(empty($record)){
            throw new Exception("Record #{$id} was not found");
        }

        return $record;
    }

    /**
     * Formats data in model
     *
     * @param CPictures $model. Model containing data to format
     * @return ActiveRecord|CVideos
     */
    protected function format($model){
        if(isset($model->thumbSmall->name)){
            $model->thumb_small=CVideos::createSmallThumbUrl($model->thumbSmall->name);
        }

        if(isset($model->thumbBig->name)){
            $model->thumb_big=CVideos::createBigThumbUrl($model->thumbBig->name);
        }

        return $model;
    }

    /**
     * Uploads video to server from $_POST
     *
     * @return array. Saved pictures paths array
     * @throws Exception
     */
    public function upload(){
        if(empty($_POST['Videos'])){
            throw new Exception('Invalid $_POST request. $_POST[\'Videos\'] is missing');
        }

        $vModel=new Videos('input');
        $vModel->attributes=$_POST['Videos'];

        if(!$vModel->validate()){
            throw new ApiException('Form validation failed. Check all fields', $vModel->getErrors());
        }

        $videoId=$vModel->getIdFromLink();

        if(empty($videoId)){
            throw new Exception('Invalid link format. Failed to fetch video id');
        }

        Yii::app()->google->client->setAccessToken(Yii::app()->session->get('oauthToken'));

        $videos=Yii::app()->youtube->sdk->videos->listVideos('snippet', array('id'=>$videoId));

        if(!isset($videos['items'][0])){
            throw new Exception('Video was not found!');
        }

        $video=$videos['items'][0];
        if(!isset($video['snippet']['thumbnails']['maxres'])){
            throw new Exception('Videos quality is too low for fetching big thumb!');
        }

        if(!isset($video['snippet']['title'])){
            throw new Exception('Video must have a title');
        }

        $title=$video['snippet']['title'];
        $description=isset($video['snippet']['description'])?$video['snippet']['description']:null;
        $source=$video['snippet']['thumbnails']['maxres']['url'];
        $extension=pathinfo($source, PATHINFO_EXTENSION);

        $vModel=new Videos('create');

        // Copy source to temp directory.
        // It is needed, because Image extension only works with files on local machine
        $temp=CVideos::createTmpPath(time().'.'.$extension);
        copy($source, $temp);

        // Save small thumb image from src image
        $image=Images::blank();
        $vModel->thumb_small=$image->saveSmallThumb($temp, CVideos::createSmallThumbPath($image->getFileName($extension)));

        // Save big thumb image from src image
        $image=Images::blank();
        $vModel->thumb_big=$image->saveBigThumb($temp, CVideos::createBigThumbPath($image->getFileName($extension)));

        // Remove temporary file
        @unlink($temp);

        if(!$vModel->create($videoId, $title, $description)){
            throw new Exception('Failed to create record');
        }

        $dataTable=new DataTables(Videos::DT_COLUMNS());
        $vModel->with(array('thumbSmall', 'thumbBig'))->refresh();

        return array(
            'row'=>$dataTable->formatData(array($vModel))[0],
            'data'=>$this->format($vModel)->toArray()
        );
    }

    /**
     * Returns content for videos table content
     *
     * @return array
     */
    public function content(){
        $criteria=new CDbCriteria();
        $criteria->with=array('thumbSmall', 'thumbBig', 'imageCover');

        $dataTable=new DataTables(Videos::DT_COLUMNS(), new Videos(), $criteria);

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

    /**
     * Removes cover of specific record
     *
     * @param int $videoId. Video id to remove cover of
     * @return bool
     * @throws Exception
     */
    public function deleteCover($videoId){
        $video=$this->findRecordById($videoId, 'imageCover');
        $video->cover=new CDbExpression('NULL');

        $video->imageCover->remove(CVideos::createCoverPath($video->imageCover->name));

        if(!$video->save()){
            throw new Exception('Failed to remove cover');
        }

        return true;
    }
} 