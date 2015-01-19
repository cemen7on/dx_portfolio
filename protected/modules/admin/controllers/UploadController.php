<?php
class UploadController extends ModuleController{
    /**
     * Controller's default action name
     *
     * @var string
     */
    public $defaultAction='pictures';

    /**
     * Controller view's layout name
     *
     * @var string
     */
    public $layout='upload';

    /**
     * Returns list of filters applied to controller
     *
     * @return array
     */
    public function filters(){
        return array(
            'accessControl',
        );
    }

    /**
     * Returns access rules applied to user.
     * Denies all anonymous users.
     *
     * @return array
     */
    public function accessRules(){
        return array(
            array('allow',
                'users'=>array('@')
            ),
            array('deny',
                'users'=>array('*')
            )
        );
    }

    /**
     * Shows form and process add-picture-form request.
     *
     * @throws Exception
     */
    public function actionPictures(){
        $pModel=new Pictures();

        if(!empty($_POST)){
            $pModel->attributes=$_POST['Pictures'];

            if(!$pModel->validate(null, false)){
                return $this->render('pictures', array('model'=>$pModel));
            }

            try{
                if(!$pModel->save()){
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

                return $this->render('pictures', array('model'=>$pModel));
            }

        }

        return $this->render('pictures', array('model'=>$pModel));
    }

    /**
     * Shows form and process add-video-form request.
     *
     * @throws Exception
     */
    public function actionVideos(){
        if(!empty($_POST)){
            $vModel=new Videos('input');

            $vModel->attributes=$_POST['Videos'];

            if(!$vModel->validate()){
                return $this->render('videos', array('model'=>$vModel));
            }

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

                return $this->render('videos', array('model'=>$vModel));
            }
        }

        $vModel=new Videos();

        return $this->render('videos', array('model'=>$vModel));
    }
}