<?php
namespace controllers;

use models;

class ArtController extends BaseController{
    /**
     * Records per page limit
     */
    const RECORDS_LIMIT=9;

    /**
     * Returns records for pictures section specified by type id.
     *
     * @param {int} $typeId. Pictures type id
     */
    protected function fetchPictures($typeId){
        $picturesModel=new models\Pictures();
        $criteria=new \CDbCriteria();

        // TODO: pagination
        /*
        $this->pages=new CPagination($pModel->countAllByTypeId(PicturesType::PICTURES_2D));
        $this->pages->pageSize=self::RECORDS_LIMIT;
        $this->pages->applyLimit($criteria);
        */

        $criteria->limit=self::RECORDS_LIMIT;
        $criteria->order='mediaId DESC';

        $records=$picturesModel->findAllByTypeId($typeId, $criteria);

        $this->sendData(models\ActiveRecord::toArrayAll($records));
    }

    /**
     * Returns records for Pictures 2d section.
     *
     * @get int offset. DB request offset
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