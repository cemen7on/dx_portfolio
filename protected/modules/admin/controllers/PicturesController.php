<?php
class PicturesController extends UploadController{
    /**
     * Picture api component instance
     *
     * @var null|SPictures
     */
    protected $api=null;

    /**
     * Initialization method.
     * Initializes picture api component
     */
    public function init(){
        parent::init();

        $this->api=new SPictures();
    }

    /**
     * Handles usual request for pictures.
     * Renders and processes form
     *
     * @throws Exception
     */
    public function actionIndex(){
        $this->render('index', array('model'=>new Pictures()));
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
            Yii::app()->rest->requireQuery('id'),
            Yii::app()->rest->requirePost('left')
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
        $pictureId=Yii::app()->rest->requireQuery('id');

        $typeId=Yii::app()->rest->getPut('type_id');
        $title=Yii::app()->rest->getPut('title');
        $description=Yii::app()->rest->getPut('description');

        $attributes=array();

        if(isset($typeId)){
            $attributes['type_id']=$typeId;
        }

        if(isset($title)){
            if(empty($title)){
                throw new RestException('Title can not be blank');
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
            Yii::app()->rest->requireQuery('id')
        ));
    }

    /**
     * Removes picture record
     *
     * @get int id. Picture id
     */
    public function actionDelete(){
        REST::execute($this->api, 'delete', array(
            Yii::app()->rest->requireQuery('id'))
        );
    }

    /**
     * Removes picture's cover
     *
     * @get int id. Picture id
     */
    public function actionDeleteCover(){
        REST::execute($this->api, 'deleteCover', array(
            Yii::app()->rest->requireQuery('id')
        ));
    }
} 