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
        $pModel=new Pictures();

        if(!empty($_POST)){
            $pModel=new Pictures('input');
            $pModel->attributes=$_POST['Pictures'];

            if($pModel->validate()){
                try{
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

                    $this->refresh();
                }
                catch(Exception $e){
                    $pModel->addError('src', $e->getMessage());
                }
            }

        }

        $this->render('index', array('model'=>$pModel));
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
     * Removes picture record
     *
     * @get int id. Picture id
     */
    public function actionDelete(){
        REST::execute($this->api, 'delete', array(
            Yii::app()->rest->requireQuery('id'))
        );
    }
} 