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
     * @get bool redirect. Whether to redirect to picture or return JSON
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

        $redirect=filter_var(\Yii::app()->request->getQuery('redirect', true), FILTER_VALIDATE_BOOLEAN);

        $mediaModel=new models\Media;
        $imageRelation=$this->typeToRelation($pictureType);
        $mediaRecord=$mediaModel->with($imageRelation)->findByPk($mediaId);
        if(empty($mediaRecord)){
            throw new \CHttpException(400, 'Invalid request: Requested media was not found');
        }

        $imageRecord=$mediaRecord->{$imageRelation};

        if(empty($imageRecord) || empty($imageRecord->name)){
            throw new \CHttpException(400, 'Invalid request: Requested media was not found');
        }

        $imageUrl=\Yii::app()->createAbsoluteUrl("/upload/media/{$this->typeToFolderName($pictureType)}/{$imageRecord->name}");

        if($redirect===true){
            $this->redirect($imageUrl);

            return ;
        }

        // add media info
        echo \CJSON::encode(array(
            'src'=>$imageUrl
        ));
    }

    public function actionPrev(){
        $mediaId=\Yii::app()->request->getQuery('mediaId');
        if(empty($mediaId)){
            throw new \CHttpException(400, "Invalid request: Parameter GET['mediaId'] was not found");
        }

        $mediaModel=new models\Pictures();
        $criteria=new \CDbCriteria();
        $criteria->order='mediaId ASC';
        $criteria->limit=1;
        $criteria->condition='mediaId>:mediaId AND typeId=typeId';
        $criteria->params=array('mediaId'=>$mediaId);

        $record=$mediaModel->with('data')->find($criteria);
        if(empty($record)){
            $success=array();
        }
        else{
            $success=$record->data->toArray();
            models\Media::format($success);
        }

        echo json_encode(array(
            'success'=>$success
        ));
    }

    public function actionNext(){
        $mediaId=\Yii::app()->request->getQuery('mediaId');
        if(empty($mediaId)){
            throw new \CHttpException(400, "Invalid request: Parameter GET['mediaId'] was not found");
        }

        $mediaModel=new models\Pictures();
        $criteria=new \CDbCriteria();
        $criteria->order='mediaId DESC';
        $criteria->limit=1;
        $criteria->condition='mediaId<:mediaId AND typeId=typeId';
        $criteria->params=array('mediaId'=>$mediaId);

        $record=$mediaModel->with('data')->find($criteria);
        if(empty($record)){
            $success=array();
        }
        else{
            $success=$record->data->toArray();
            models\Media::format($success);
        }

        echo json_encode(array(
            'success'=>$success
        ));
    }
} 