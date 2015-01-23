<?php
class VideosController extends UploadController{
    /**
     * Video api component instance
     *
     * @var null|SVideos
     */
    protected $api=null;

    /**
     * Initialization method.
     * Initializes video api component
     */
    public function init(){
        parent::init();

        $this->api=new SVideos();
    }

    /**
     * Handles usual request for videos.
     * Renders and processes form
     *
     * @throws Exception
     */
    public function actionIndex(){
        $vModel=new Videos();

        if(!empty($_POST)){
            $vModel=new Videos('input');

            $vModel->attributes=$_POST['Videos'];

            if($vModel->validate()){
                try{
                    $videoId=$vModel->getIdFromLink();

                    if(empty($videoId)){
                        throw new Exception('Invalid link format. Failed to fetch video id');
                    }

                    Yii::app()->google->client->setAccessToken(Yii::app()->session->get('oauthToken'));

                    $videos=Yii::app()->youtube->sdk->videos->listVideos('snippet', array('id'=>$videoId));

                    if(!isset($videos['items'][0])){
                        throw new Exception('Video was not found!');
                    }

                    $video=$videos['items'][0];
                    if(!isset($video['snippet']['thumbnails']['maxres'])){
                        throw new Exception('Videos quality is too low for fetching big thumb!');
                    }

                    if(!isset($video['snippet']['title'])){
                        throw new Exception('Video must have a title');
                    }

                    $title=$video['snippet']['title'];
                    $description=isset($video['snippet']['description'])?$video['snippet']['description']:null;
                    $source=$video['snippet']['thumbnails']['maxres']['url'];

                    $vModel=new Videos('create');
                    $id=$vModel->create($videoId, $title, $description);

                    $fileName="{$id}.jpg";
                    $temp=CVideos::createTmpPath($fileName);

                    // Copy source to temp directory.
                    // It is needed, because Image extension only works with files on local machine
                    copy($source, $temp);

                    $iModel=new Images();
                    $vModel->thumb_small=$iModel->saveSmallThumb($temp, CVideos::createSmallThumbPath($fileName));
                    $vModel->thumb_big=$iModel->saveBigThumb($temp, CVideos::createBigThumbPath($fileName));

                    // Remove temporary file
                    @unlink($temp);

                    if(!$vModel->save()){
                        throw new Exception('Failed to update record with images');
                    }

                    $this->refresh();
                }
                catch(Exception $e){
                    $vModel->addError('link', $e->getMessage());
                }
            }
        }

        $this->render('index', array('model'=>$vModel));
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
        $videoId=Yii::app()->rest->requireQuery('id');

        $title=Yii::app()->rest->getPut('title');
        $description=Yii::app()->rest->getPut('description');

        $attributes=array();

        if(isset($title)){
            if(empty($title)){
                throw new RestException('Title can not be blank');
            }

            $attributes['title']=$title;
        }

        if(isset($description)){
            $attributes['description']=$description;
        }

        REST::execute($this->api, 'update', array($videoId, $attributes));
    }

    /**
     * Removes video record
     *
     * @get int id. Video id
     */
    public function actionDelete(){
        REST::execute($this->api, 'delete', array(
            Yii::app()->rest->requireQuery('id'))
        );
    }
} 