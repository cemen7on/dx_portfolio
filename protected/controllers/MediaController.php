<?php
namespace controllers;

use models;

class MediaController extends \CController{
    protected $pictureTypes=array('source', 'small', 'big', 'cover');

    /**
     * Returns whether picture type param is valid
     *
     * @param string $type. Picture type
     * @return bool
     */
    protected function isValidType($type){
        return in_array($type, $this->pictureTypes);
    }

    /**
     * Converts specific picture's type to folder name in OS
     *
     * @param string $type. Picture's type
     * @return mixed
     */
    protected function typeToFolderName($type=''){
        $aliases=array(
            'source'=>'sources',
            'small'=>'smallThumbs',
            'big'=>'bigThumbs',
            'cover'=>'covers'
        );

        return isset($aliases[$type])?$aliases[$type]:false;
    }

    /**
     * Converts file to byte code
     *
     * @param string $path. File path
     * @return bool
     */
    protected function toByteCode($path){
        $mimeType=\CFileHelper::getMimeType($path);
        header("Content-Type: {$mimeType}");

        $handle=fopen($path, 'r');
        if($handle){
            $chunkSize=8192; // 8 kB chunks
            while(!feof($handle)){
                echo fread($handle, $chunkSize);
                flush();
            }

            return true;
        }

        return false;
    }

    /**
     * Converts specific picture's type to relation in database
     *
     * @param string $type. Picture's type
     * @return bool
     */
    protected function typeToRelation($type=''){
        $aliases=$this->pictureTypes;

        $aliases['source']='source';
        $aliases['small']='smallThumb';
        $aliases['big']='bigThumb';
        $aliases['cover']='cover';

        return isset($aliases[$type])?$aliases[$type]:false;
    }

    /**
     * Returns media's image byte's code
     *
     * @get int mediaId. Media's id to find image of
     * @get string type. Picture's type. Describes image size: small, big, source or cover
     *
     * @throws \CHttpException
     */
    public function actionPicture(){
        $mediaId=\Yii::app()->request->getQuery('mediaId');
        if(empty($mediaId)){
            throw new \CHttpException(400, "Invalid request: Parameter GET['mediaId'] was not found");
        }

        $pictureType=\Yii::app()->request->getQuery('type', 'source');
        if(!$this->isValidType($pictureType)){
            throw new \CHttpException(400, "Invalid request: Invalid GET['type'] parameter value");
        }

        $mediaModel=new models\Media;
        $imageRelation=$this->typeToRelation($pictureType);
        $mediaRecord=$mediaModel->with($imageRelation)->findByPk($mediaId);
        if(empty($mediaRecord)){
            throw new \CHttpException(400, 'Invalid request: Requested media was not found');
        }

        $imageRecord=$mediaRecord->{$imageRelation};

        if(empty($imageRecord) || empty($imageRecord->name)){
            // TODO: Return default image (byte code)
            throw new \CHttpException(400, 'Invalid request: Requested media was not found');
        }

        //TODO: Create normal path component
        $imagePath=\Yii::getPathOfAlias("webroot.upload.media.{$this->typeToFolderName($pictureType)}").DS.$imageRecord->name;

        if(!$this->toByteCode($imagePath)){
            throw new \CHttpException(400, 'Invalid request: Requested media was not found');
        }
    }
} 