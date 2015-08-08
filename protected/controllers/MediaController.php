<?php
namespace controllers;

use components;
use models;

class MediaController extends \CController{
    /**
     * Loads sibling of current media.
     *
     * @param int $direction. Direction of sibling
     * @throws \CHttpException
     *
     * @get int mediaId. Media to load sibling for
     */
    protected function loadSibling($direction){
        $mediaId=\Yii::app()->request->getQuery('mediaId');
        if(empty($mediaId)){
            throw new \CHttpException(400, "Invalid request: Parameter GET['mediaId'] was not found");
        }

        $orderDirection=$direction<0?'ASC':'DESC';
        $comparisonSign=$direction<0?'>':'<';

        $mediaModel=new models\Pictures();
        $criteria=new \CDbCriteria();
        $criteria->order="t.id {$orderDirection}";
        $criteria->limit=1;
        $criteria->condition="t.id{$comparisonSign}:id AND typeId=typeId";
        $criteria->params=array('id'=>$mediaId);

        $record=$mediaModel->with('source', 'smallThumb', 'bigThumb', 'cover')->find($criteria);
        if(empty($record)){
            $success=array();
        }
        else{
            $success=$record->toArray();
            models\Pictures::format($success);
        }

        components\REST::success($success);
    }

    /**
     * Returns previous sibling of specified media
     *
     * @get int mediaId. Media to load sibling for
     */
    public function actionPrev(){
        $this->loadSibling(-1);
    }

    /**
     * Returns next sibling of specified media
     *
     * @get int mediaId. Media to load sibling for
     */
    public function actionNext(){
        $this->loadSibling(1);
    }
} 