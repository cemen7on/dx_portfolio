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

        $pModel=new Pictures();
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
        if(isset($model->src->name)){
            $model->src=CPictures::createSrcUrl($model->src->name);
        }

        if(isset($model->thumbSmall->name)){
            $model->thumb_small=CPictures::createSmallThumbUrl($model->thumbSmall->name);
        }

        if(isset($model->thumbBig->name)){
            $model->thumb_big=CPictures::createBigThumbUrl($model->thumbBig->name);
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

        $pModel=new Pictures('input');
        $pModel->attributes=$_POST['Pictures'];

        if(!$pModel->validate()){
            throw new ApiException('Form validation failed. Check all fields', $pModel->getErrors());
        }

        $pModel->setScenario('create');
        if(!$pModel->create()){
            throw new Exception('Failed to save picture record');
        }

        // Save as image source
        $upload=CUploadedFile::getInstance($pModel, 'src');
        $fileName="{$pModel->id}.{$upload->getExtensionName()}";
        $src=CPictures::createSrcPath($fileName);
        $upload->saveAs($src);

        $iModel=new Images();

        $pModel->src=$iModel->saveSrc($src);
        $pModel->thumb_small=$iModel->saveSmallThumb($src, CPictures::createSmallThumbPath($fileName));
        $pModel->thumb_big=$iModel->saveBigThumb($src, CPictures::createBigThumbPath($fileName));

        if(!$pModel->save()){
            throw new Exception('Failed to update record with images');
        }

        $dataTable=new DataTables(Pictures::DT_COLUMNS());
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
        $picture=$this->findRecordById($pictureId, 'thumbBig');

        $iModel=new Images();
        $picture->cover=$iModel->cropCover(
            CPictures::createBigThumbPath($picture->thumbBig->name),
            CPictures::createCoverPath($picture->thumbBig->name),
            $left
        );

        if(!$picture->save(false)){
            throw new Exception('Failed to update record with cover image');
        }

        return array('html'=>Html::cover(CPictures::createCoverUrl($iModel->findByPk($picture->cover)->name)));
    }

    /**
     * Returns content for pictures table content
     *
     * @return array
     */
    public function content(){
        $criteria=new CDbCriteria();
        $criteria->with=array('thumbSmall', 'imageCover');

        $dataTable=new DataTables(Pictures::DT_COLUMNS(), new Pictures(), $criteria);

        return $dataTable->request()->format();
    }

    /**
     * Updates picture's attributes
     *
     * @param int $pictureId. Picture's to update id
     * @param int $attributes. Attributes to update
     * @return bool
     * @throws Exception
     */
    public function update($pictureId, $attributes){
        $pModel=new Pictures();

        $result=$pModel->updateByPk($pictureId, $attributes);
        if(!$result){
            throw new Exception('Failed to update record');
        }

        return true;
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
            $pModel->imageCover->remove(CPictures::createCoverPath($pModel->imageCover->name));
        }

        $upload=CUploadedFile::getInstance($pModel, 'cover');
        $fileName="{$pModel->id}.{$upload->getExtensionName()}";

        $images=new Images();
        $pModel->cover=$images->cropCover($upload->getTempName(), CPictures::createCoverPath($fileName));

        if(!$pModel->save(false)){
            throw new Exception('Failed to update record cover');
        }

        return array('html'=>Html::cover(CPictures::createCoverUrl($fileName)));
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

        $picture->imageSrc->remove(CPictures::createSrcPath($picture->imageSrc->name));
        $picture->thumbSmall->remove(CPictures::createSmallThumbPath($picture->thumbSmall->name));
        $picture->thumbBig->remove(CPictures::createBigThumbPath($picture->thumbBig->name));

        if($picture->imageCover){
            $picture->imageCover->remove(CPictures::createCoverPath($picture->imageCover->name));
        }

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

        $picture->imageCover->remove(CPictures::createCoverPath($picture->imageCover->name));

        if(!$picture->save(false)){
            throw new Exception('Failed to remove cover');
        }

        return true;
    }
} 