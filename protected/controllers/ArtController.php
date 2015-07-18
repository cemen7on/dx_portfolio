<?php
namespace controllers;

use models;

class ArtController extends BaseController{
    /**
     * Records per page limit
     */
    const RECORDS_LIMIT=1;

    /**
     * Returns records for pictures section specified by type id.
     *
     * @param {int} $typeId. Pictures type id
     */
    protected function fetchPictures($typeId){
        $page=\Yii::app()->request->getQuery('id', 1);

        $picturesModel=new models\Pictures();
        $criteria=new \CDbCriteria();
        $criteria->offset=($page-1)*self::RECORDS_LIMIT;
        $criteria->limit=self::RECORDS_LIMIT;
        $criteria->order='mediaId DESC';

        $totalRecordsNumber=$picturesModel->countAllByTypeId($typeId);
        $recordsObject=$picturesModel->findAllByTypeId($typeId, $criteria);
        $recordsArray=models\ActiveRecord::toArrayAll($recordsObject);

        $response=array(
            'data'=>models\Pictures::format($recordsArray),
            'total'=>$totalRecordsNumber
        );

        $this->sendData($response);
    }

    /**
     * Returns records for Pictures 2d section.
     *
     * @get int page. Page number to show
     */
    public function action2d(){
        $this->fetchPictures(models\PicturesType::PICTURES_2D);
    }

    /**
     * Returns records for Art 3d section.
     *
     * @get int offset. DB request offset
     */
    public function action3d(){
        $this->fetchPictures(models\PicturesType::ART_3D);
    }
} 