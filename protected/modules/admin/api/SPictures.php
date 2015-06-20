<?php
class SPictures{
    /**
     * Finds record by pk.
     *
     * @param int $id. PK of record
     * @param string|array $with. Relations for record
     * @return CActiveRecord|CPictures
     * @throws Exception
     */
    protected function findRecordById($id, $with=array()){
        if(is_string($with)){
            $with=array($with);
        }

        $pModel=new models\Pictures();
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
     * @return ActiveRecord|CPictures
     */
    protected function format($model){
        if(isset($model->imageSrc->name)){
            $model->src=components\CPictures::createSrcUrl($model->imageSrc->name);
        }

        if(isset($model->thumbSmall->name)){
            $model->thumb_small=components\CPictures::createSmallThumbUrl($model->thumbSmall->name);
        }

        if(isset($model->thumbBig->name)){
            $model->thumb_big=components\CPictures::createBigThumbUrl($model->thumbBig->name);
        }

        return $model;
    }

    /**
     * Uploads picture to server from $_POST
     *
     * @return array. Saved pictures paths array
     * @throws Exception
     */
    public function upload(){
        if(empty($_POST['Pictures'])){
            throw new Exception('Invalid $_POST request. $_POST[\'Pictures\'] is missing');
        }

        $pModel=new models\Pictures('input');
        $pModel->attributes=$_POST['Pictures'];

        if(!$pModel->validate()){
            throw new ApiException('Form validation failed. Check all fields', $pModel->getErrors());
        }

        $upload=CUploadedFile::getInstance($pModel, 'src');
        $extension=$upload->getExtensionName();

        // Save src image
        $image=models\Images::blank();
        $src=components\CPictures::createSrcPath($image->getFileName($extension));
        $upload->saveAs($src);
        $pModel->src=$image->saveSrc($src);

        // Save small thumb image from src image
        $image=models\Images::blank();
        $pModel->thumb_small=$image->saveSmallThumb($src, components\CPictures::createSmallThumbPath($image->getFileName($extension)));

        // Save big thumb image from src image
        $image=models\Images::blank();
        $pModel->thumb_big=$image->saveBigThumb($src, components\CPictures::createBigThumbPath($image->getFileName($extension)));

        $pModel->setScenario('create');
        if(!$pModel->create()){
            throw new Exception('Failed to update record with images');
        }

        $dataTable=new DataTables(models\Pictures::DT_COLUMNS());
        $pModel->with(array('imageSrc', 'thumbSmall', 'thumbBig', 'imageCover'))->refresh();

        return array(
            'row'=>$dataTable->formatData(array($pModel))[0],
            'data'=>$this->format($pModel)->toArray()
        );
    }

    /**
     * Crops cover from big thumb of created picture
     *
     * @param int $pictureId. Picture id to create crop for
     * @param int $left. Left start crop coordinate in px
     * @return bool
     * @throws Exception
     */
    public function crop($pictureId, $left){
        $picture=$this->findRecordById($pictureId, array('thumbBig', 'imageCover'));

        if($picture->imageCover){
            $picture->imageCover->remove(components\CPictures::createCoverPath($picture->imageCover->name));
        }

        $source=components\CPictures::createBigThumbPath($picture->thumbBig->name);
        $extension=pathinfo($source, PATHINFO_EXTENSION);

        $image=models\Images::blank();
        $picture->cover=$image->cropCover(
            $source,
            components\CPictures::createCoverPath($image->getFileName($extension)),
            $left
        );

        if(!$picture->save(false)){
            throw new Exception('Failed to update record with cover image');
        }

        return array('html'=>Html::cover(components\CPictures::createCoverUrl($image->name)));
    }

    /**
     * Returns content for pictures table content
     *
     * @return array
     */
    public function content(){
        $criteria=new CDbCriteria();
        $criteria->with=array('thumbSmall', 'thumbBig', 'imageCover');

        $dataTable=new DataTables(models\Pictures::DT_COLUMNS(), new models\Pictures(), $criteria);

        return $dataTable->request()->format();
    }

    /**
     * Updates picture's attributes
     *
     * @param int $pictureId. Picture's to update id
     * @param array $attributes. Attributes to update
     * @param bool $force. Force update
     * @return bool
     * @throws Exception
     */
    public function update($pictureId, $attributes, $force=true){
        $pModel=new models\Pictures();

        $result=$pModel->updateByPk($pictureId, $attributes);
        if($force && !$result){
            throw new Exception('Failed to update record');
        }

        return true;
    }

    /**
     * Updates picture's type
     *
     * @param int $pictureId. Picture's id to update
     * @param int $typeId. New type id
     * @return bool
     */
    public function updateType($pictureId, $typeId){
        $this->updateCoverOrder($pictureId, null, false);
        return $this->update($pictureId, array('type_id'=>$typeId));
    }

    /**
     * Updates record's cover.
     * Source images gets from $_FILES array
     *
     * @param int $pictureId. Picture id to update record of
     * @return string
     * @throws Exception
     */
    public function updateCover($pictureId){
        $pModel=$this->findRecordById($pictureId, 'imageCover');

        if($pModel->imageCover){
            $pModel->imageCover->remove(components\CPictures::createCoverPath($pModel->imageCover->name));
        }

        $image=models\Images::blank();
        $upload=CUploadedFile::getInstance($pModel, 'cover');
        $extension=$upload->getExtensionName();

        $pModel->cover=$image->cropCover($upload->getTempName(), components\CPictures::createCoverPath($image->getFileName($extension)));

        if(!$pModel->save(false)){
            throw new Exception('Failed to update record cover');
        }

        return array('html'=>Html::cover(components\CPictures::createCoverUrl($image->name)));
    }

    /**
     * Updates cover order of specific record
     *
     * @param int $pictureId. Picture's id to update cover order
     * @param mixed $coverOrder. New value to update
     * @param bool $force. Force update or not
     * @return bool
     */
    public function updateCoverOrder($pictureId, $coverOrder, $force=true){
        $picture=$this->findRecordById($pictureId);

        $value=!empty($coverOrder)?(int)$coverOrder:new CDbExpression('NULL');

        // Value has not been changed
        if($picture->cover_order==$value){
            return false;
        }

        if(!empty($coverOrder)){
            // Reset old cover's order value
            $pModel=new models\Pictures();
            $pModel->updateAll(
                array('cover_order'=>new CDbExpression('NULL')),
                'cover_order=:cover_order AND type_id=:type_id',
                array('type_id'=>$picture->type_id, 'cover_order'=>$coverOrder)
            );
        }

        return $this->update($pictureId, array('cover_order'=>$value), $force);
    }

    /**
     * Removes picture
     *
     * @param int $pictureId. Picture's to delete id
     * @return bool
     * @throws Exception
     */
    public function delete($pictureId){
        $picture=$this->findRecordById($pictureId, array('imageSrc', 'thumbSmall', 'thumbBig', 'imageCover'));

        $picture->imageSrc->remove(components\CPictures::createSrcPath($picture->imageSrc->name));
        $picture->thumbSmall->remove(components\CPictures::createSmallThumbPath($picture->thumbSmall->name));
        $picture->thumbBig->remove(components\CPictures::createBigThumbPath($picture->thumbBig->name));

        isset($picture->imageCover)
            ? $picture->imageCover->remove(components\CPictures::createCoverPath($picture->imageCover->name)):null;

        if(!$picture->delete()){
            throw new Exception('Failed to remove record');
        }

        return true;
    }

    /**
     * Removes cover of specific record
     *
     * @param int $pictureId. Picture id to remove cover of
     * @return bool
     * @throws Exception
     */
    public function deleteCover($pictureId){
        $picture=$this->findRecordById($pictureId, 'imageCover');
        $picture->cover=new CDbExpression('NULL');

        $picture->imageCover->remove(components\CPictures::createCoverPath($picture->imageCover->name));

        if(!$picture->save(false)){
            throw new Exception('Failed to remove cover');
        }

        return true;
    }
} 