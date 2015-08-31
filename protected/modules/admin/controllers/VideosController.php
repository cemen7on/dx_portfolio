<?php
namespace admin\controllers;

use admin\api\Videos;
use models;
use components\REST;

class VideosController extends UploadController{
    /**
     * Video api component instance
     *
     * @var null|Videos
     */
    protected $api=null;

    /**
     * Initialization method.
     * Initializes video api component
     */
    public function init(){
        parent::init();

        $this->api=new Videos();
    }

    /**
     * Handles usual request for videos.
     * Renders and processes form
     */
    public function actionIndex(){
        $this->render('index', array('videoModel'=>new models\Videos()));
    }

    /**
     * Handles POST request.
     * Uploads video
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
     * Returns json encoded content for videos table
     */
    public function actionContent(){
        REST::execute($this->api, 'content');
    }

    /**
     * Updates record by specific key
     *
     * @get int id. Record id
     * @put string title. New picture's title
     * @put string description. New picture's description
     */
    public function actionUpdate(){
        $videoId=\Yii::app()->RestRequest->requireQuery('id');

        $facadeIndex=\Yii::app()->RestRequest->getPut('facadeIndex');
        if(isset($facadeIndex)){
            REST::execute($this->api, 'updateFacadeIndex', array($videoId, $facadeIndex));
        }

        $title=\Yii::app()->RestRequest->getPut('title');
        $description=\Yii::app()->RestRequest->getPut('description');

        $attributes=array();

        if(isset($title)){
            if(empty($title)){
                throw new \exceptions\Rest('Title can not be blank');
            }

            $attributes['title']=$title;
        }

        if(isset($description)){
            $attributes['description']=$description;
        }

        REST::execute($this->api, 'update', array($videoId, $attributes));
    }

    /**
     * Updates cover of specified record
     *
     * @get int id. Video id to update cover of
     * @files cover. Uploaded cover
     */
    public function actionCover(){
        REST::execute($this->api, 'updateCover', array(
            \Yii::app()->RestRequest->requireQuery('id')
        ));
    }

    /**
     * Removes video record
     *
     * @get int id. Video id
     */
    public function actionDelete(){
        REST::execute($this->api, 'delete', array(
            \Yii::app()->RestRequest->requireQuery('id'))
        );
    }

} 