<?php
namespace admin\api;

class PicturesException extends \Exception{}

use admin\components;
use models;

class Pictures{
    /**
     * Finds record by pk.
     *
     * @param int $id. PK of record
     * @param string|array $with. Relations for record
     * @return models\ActiveRecord|models\Pictures
     * @throws PicturesException
     */
    protected function findRecordById($id, $with=array()){
        if(is_string($with)){
            $with=array($with);
        }

        $pModel=new models\Pictures();
        $record=$pModel->with($with)->findByPk($id);

        if(empty($record)){
            throw new PicturesException("Record #{$id} was not found");
        }

        return $record;
    }

    /**
     * Uploads picture to server from $_POST
     *
     * @return array. Saved pictures paths array
     * @throws PicturesException
     */
    public function upload(){
        if(empty($_POST['models_Pictures'])){
            throw new PicturesException('Invalid $_POST request. $_POST[\'models_Pictures\'] is missing');
        }

        $pictureModel=new models\Pictures('input');
        $pictureModel->attributes=$_POST['models_Pictures'];

        if(!$pictureModel->validate()){
            throw new PicturesException('Form validation failed. Check all fields');
        }

        $upload=\CUploadedFile::getInstance($pictureModel, 'src');
        $extension=$upload->getExtensionName();

        // Save src image
        $image=models\Images::blank();
        $src=models\Pictures::createSourcePath($image->getFileName($extension));
        $upload->saveAs($src);
        $pictureModel->srcId=$image->saveSrc($src);

        // Save small thumb image from src image
        $image=models\Images::blank();
        $pictureModel->smallThumbId=$image->saveSmallThumb($src, models\Pictures::createSmallThumbPath($image->getFileName($extension)));

        // Save big thumb image from src image
        $image=models\Images::blank();
        $pictureModel->bigThumbId=$image->saveBigThumb($src, models\Pictures::createBigThumbPath($image->getFileName($extension)));

        $pictureModel->setScenario('create');
        if(!$pictureModel->create()){
            throw new PicturesException('Failed to update record with images');
        }

        // Create cover
        $this->crop($pictureModel->id);

        $dataTable=new components\DataTables(models\Pictures::DT_COLUMNS());
        $pictureModel=$pictureModel->with(array('smallThumb', 'bigThumb', 'source', 'cover'))->findByPk($pictureModel->id);
        $pictureModelArray=$pictureModel->toArray();

        return array(
            'row'=>$dataTable->formatData(array($pictureModel))[0],
            'data'=>models\Pictures::format($pictureModelArray)
        );
    }

    /**
     * Crops cover from big thumb of created picture
     *
     * @param int $pictureId. Picture id to create crop for
     * @param int|string $left. Left start crop coordinate in px
     * @return bool
     * @throws PicturesException
     */
    public function crop($pictureId, $left='center'){
        $picture=$this->findRecordById($pictureId, array('bigThumb', 'cover'));

        if($picture->cover){
            $picture->cover->remove(models\Pictures::createCoverPath($picture->cover->name));
        }

        $source=models\Pictures::createBigThumbPath($picture->bigThumb->name);
        $extension=pathinfo($source, PATHINFO_EXTENSION);

        $image=models\Images::blank();
        $picture->coverId=$image->cropCover(
            $source,
            models\Pictures::createCoverPath($image->getFileName($extension)),
            $left
        );

        if(!$picture->save(false)){
            throw new PicturesException('Failed to update record with cover image');
        }

        return array('html'=>\CHtml::image(
            models\Pictures::createCoverUrl($image->name),
            '',
            array('data-big-thumb'=>models\Pictures::createBigThumbUrl($picture->bigThumb->name))
        ));
    }

    /**
     * Returns content for pictures table content
     *
     * @return array
     */
    public function content(){
        $criteria=new \CDbCriteria();
        $criteria->with=array('source', 'smallThumb', 'bigThumb', 'cover');

        $dataTable=new components\DataTables(models\Pictures::DT_COLUMNS(), new models\Pictures(), $criteria);
        return $dataTable->request()->format();
    }

    /**
     * Updates picture's attributes
     *
     * @param int $pictureId. Picture's to update id
     * @param array $attributes. Attributes to update
     * @param bool $force. Force update
     * @return bool
     * @throws PicturesException
     */
    public function update($pictureId, $attributes, $force=true){
        $picturesModel=new models\Pictures();

        $result=$picturesModel->updateByPk($pictureId, $attributes);
        if($force && !$result){
            throw new PicturesException('Failed to update record');
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
        $this->updateFacadeIndex($pictureId, null, false);

        return $this->update($pictureId, array('typeId'=>$typeId));
    }

    /**
     * Updates record's cover.
     * Source images gets from $_FILES array
     *
     * @param int $pictureId. Picture id to update record of
     * @return string
     * @throws PicturesException
     */
    public function updateCover($pictureId){
        $pictureModel=$this->findRecordById($pictureId, 'cover');

        if($pictureModel->cover){
            $pictureModel->cover->remove(models\Pictures::createCoverPath($pictureModel->cover->name));
        }

        $image=models\Images::blank();
        $upload=\CUploadedFile::getInstance($pictureModel, 'cover');
        $extension=$upload->getExtensionName();

        $pictureModel->coverId=$image->cropCover($upload->getTempName(), models\Pictures::createCoverPath($image->getFileName($extension)));

        if(!$pictureModel->save(false)){
            throw new PicturesException('Failed to update record cover');
        }

        return array('html'=>\CHtml::image(
            models\Pictures::createCoverUrl($image->name),
            '',
            array('data-big-thumb'=>models\Pictures::createBigThumbUrl($pictureModel->bigThumb->name))
        ));
    }

    /**
     * Updates cover order of specific record
     *
     * @param int $pictureId. Picture's id to update cover order
     * @param mixed $facadeIndex. New value to set
     * @param bool $force. Force update or not
     * @return bool
     */
    public function updateFacadeIndex($pictureId, $facadeIndex, $force=true){
        $picture=$this->findRecordById($pictureId);

        // Cast value type
        if(empty($facadeIndex)){
            $facadeIndex=new \CDbExpression('NULL');
        }

        // Value has not been changed
        if($picture->facadeIndex==$facadeIndex){
            return false;
        }

        if(!empty($facadeIndex)){
            $picturesModel=new models\Pictures();
            $picturesModel->updateAll(
                array('facadeIndex'=>new \CDbExpression('NULL')),
                'facadeIndex=:facadeIndex AND typeId=:typeId',
                array('typeId'=>$picture->typeId, 'facadeIndex'=>$facadeIndex)
            );
        }

        return $this->update($pictureId, array('facadeIndex'=>$facadeIndex), $force);
    }

    /**
     * Removes picture
     *
     * @param int $pictureId. Picture's to delete id
     * @return bool
     * @throws PicturesException
     */
    public function delete($pictureId){
        $picture=$this->findRecordById($pictureId, array('smallThumb', 'bigThumb', 'source', 'cover'));

        $picture->smallThumb->remove(models\Pictures::createSmallThumbPath($picture->smallThumb->name));
        $picture->bigThumb->remove(models\Pictures::createBigThumbPath($picture->bigThumb->name));
        $picture->source->remove(models\Pictures::createSourcePath($picture->source->name));
        $picture->cover->remove(models\Pictures::createCoverPath($picture->cover->name));

        if(!$picture->delete()){
            throw new PicturesException('Failed to remove record');
        }

        return true;
    }
}