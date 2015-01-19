<?php
class UploadController extends CController{
    /**
     * Controller's default action name
     *
     * @var string
     */
    public $defaultAction='picture';

    /**
     * Shows form and process add-picture-form request.
     *
     * @throws Exception
     */
    public function actionPicture(){
        $pModel=new Pictures();

        if(!empty($_POST)){
            $pModel->attributes=$_POST['Pictures'];

            if(!$pModel->validate(null, false)){
                return $this->render('picture', array('model'=>$pModel));
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

                return $this->render('picture', array('model'=>$pModel));
            }

        }

        return $this->render('picture', array('model'=>$pModel));
    }

    /**
     * Shows form and process add-video-form request.
     *
     * @throws Exception
     */
    public function actionVideo(){
        if(!empty($_POST)){
            $vModel=new Videos('input');

            $vModel->attributes=$_POST['Videos'];

            if(!$vModel->validate()){
                return $this->render('video', array('model'=>$vModel));
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

                return $this->render('video', array('model'=>$vModel));
            }
        }

        $vModel=new Videos();

        return $this->render('video', array('model'=>$vModel));
    }

    /**
     * Add video on youtube.
     * Устаревший! Загруженное видео долго обрабатывается и нельзя сразу получить скриншоты выскоого качества.
     * Поэтому обрабатывать нужно только загруженные видео и наверняка уже обработанные видео !!!
     */
    public function addVideo(){
        if(!empty($_POST)){
            Yii::app()->google->client->setAccessToken(Yii::app()->session->get('oauthToken'));

            $videoPath=$_FILES['src']['tmp_name'];

            ini_set("max_execution_time", "600");

            // Create a snippet with title, description, tags and category ID
            // Create an asset resource and set its snippet metadata and type.
            // This example sets the video's title, description, keyword tags, and
            // video category.
            $snippet=new Google_Service_YouTube_VideoSnippet();
            $snippet->setTitle(Yii::app()->request->getPost('title'));
            $snippet->setDescription(Yii::app()->request->getPost('description'));

            // Numeric video category. See
            // https://developers.google.com/youtube/v3/docs/videoCategories/list
            $snippet->setCategoryId("22");

            // Set the video's status to "public". Valid statuses are "public",
            // "private" and "unlisted".
            $status=new Google_Service_YouTube_VideoStatus();
            $status->privacyStatus = "public";

            // Associate the snippet and status objects with a new video resource.
            $video=new Google_Service_YouTube_Video();
            $video->setSnippet($snippet);
            $video->setStatus($status);

            // Specify the size of each chunk of data, in bytes. Set a higher value for
            // reliable connection as fewer chunks lead to faster uploads. Set a lower
            // value for better recovery on less reliable connections.
            $chunkSizeBytes=1*1024*1024;

            // Setting the defer flag to true tells the client to return a request which can be called
            // with ->execute(); instead of making the API call immediately.
            Yii::app()->google->client->setDefer(true);

            // Create a request for the API's videos.insert method to create and upload the video.
            $insertRequest=Yii::app()->youtube->sdk->videos->insert("status, snippet", $video);

            // Create a MediaFileUpload object for resumable uploads.
            $media=new Google_Http_MediaFileUpload(
                Yii::app()->google->client,
                $insertRequest,
                'video/*',
                null,
                true,
                $chunkSizeBytes
            );
            $media->setFileSize(filesize($videoPath));


            // Read the media file and upload it chunk by chunk.
            $status=false;
            $handle=fopen($videoPath, "rb");
            while(!$status && !feof($handle)) {
                $chunk=fread($handle, $chunkSizeBytes);
                $status=$media->nextChunk($chunk);
            }

            fclose($handle);

            // If you want to make other calls after the file upload, set setDefer back to false
            Yii::app()->google->client->setDefer(false);

            // TODO: server sdk does not return big thumb nail !!!! js returns. разобраться

            echo '<pre>';
            print_r($status);
            echo '</pre>';

            echo '**************************************************';

            $record=Yii::app()->youtube->sdk->videos->listVideos('snippet', array('id'=>$status['id']));

            echo '<pre>';
            print_r($record);
            echo '</pre>'; exit;

            // $vModel->create();
        }
    }
}