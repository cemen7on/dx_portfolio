<?php
namespace admin\controllers;

use admin\api\Pictures;
use models;
use components\REST;

class PicturesController extends UploadController{
    /**
     * Picture api component instance
     *
     * @var null|Pictures
     */
    protected $api=null;

    /**
     * Initialization method.
     * Initializes picture api component
     */
    public function init(){
        parent::init();

        $this->api=new Pictures();
    }

    /**
     * Handles usual request for pictures.
     */
    public function actionIndex(){
        $this->render('index', array(
            'picturesModel'=>new models\Pictures()
        ));
    }

    /**
     * Handles POST request.
     * Uploads picture
     */
    public function actionUpload(){
        REST::execute($this->api, 'upload');
    }

    /**
     * Handles crop request for big thumb.
     * Crops big thumb for front preview
     */
    public function actionCrop(){
        REST::execute($this->api, 'crop', array(
            \Yii::app()->RestRequest->requireQuery('id'),
            \Yii::app()->RestRequest->requirePost('left')
        ));
    }

    /**
     * Handles ajax pictures request.
     * Returns json encoded content for pictures table
     */
    public function actionContent(){
        REST::execute($this->api, 'content');
    }

    /**
     * Updates record by specific key
     *
     * @get int id. Record id
     * @put int type_id. New picture's type
     * @put string title. New picture's title
     * @put string description. New picture's description
     */
    public function actionUpdate(){
        $pictureId=\Yii::app()->RestRequest->requireQuery('id');

        $facadeIndex=\Yii::app()->RestRequest->getPut('facadeIndex');
        if(isset($facadeIndex)){
            REST::execute($this->api, 'updateFacadeIndex', array($pictureId, $facadeIndex));
        }

        $typeId=\Yii::app()->RestRequest->getPut('typeId');
        if(isset($typeId)){
            REST::execute($this->api, 'updateType', array($pictureId, $typeId));
        }

        $attributes=array();
        $title=\Yii::app()->RestRequest->getPut('title');
        $description=\Yii::app()->RestRequest->getPut('description');

        if(isset($title)){
            if(empty($title)){
                throw new \exceptions\Rest('Title can not be blank');
            }

            $attributes['title']=$title;
        }

        if(isset($description)){
            $attributes['description']=$description;
        }

        REST::execute($this->api, 'update', array($pictureId, $attributes));
    }

    /**
     * Updates cover of specified record
     *
     * @get int id. Picture id to update cover of
     * @files cover. Uploaded cover
     */
    public function actionCover(){
        REST::execute($this->api, 'updateCover', array(
            \Yii::app()->RestRequest->requireQuery('id')
        ));
    }

    /**
     * Removes picture record
     *
     * @get int id. Picture id
     */
    public function actionDelete(){
        REST::execute($this->api, 'delete', array(
            \Yii::app()->RestRequest->requireQuery('id'))
        );
    }
}