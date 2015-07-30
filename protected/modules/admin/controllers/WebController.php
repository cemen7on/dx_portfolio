<?php
namespace admin\controllers;

class WebController extends \CController{
    public function init(){
        parent::init();

        \Yii::app()->clientScript->registerCssFile('/css/font-awesome/css/font-awesome.min.css');

        \Yii::app()->clientScript->registerScriptFile(
            \Yii::app()->assetManager->publish(\Yii::app()->basePath.'/modules/admin/assets/js/extensions/cropper.js')
        );

        \Yii::app()->clientScript->registerCssFile(
            \Yii::app()->assetManager->publish(\Yii::app()->basePath.'/modules/admin/assets/css/extensions/cropper.css')
        );

        \Yii::app()->clientScript->registerScriptFile(
            \Yii::app()->assetManager->publish(\Yii::app()->basePath.'/modules/admin/assets/js/pictures.js')
        );

        \Yii::app()->clientScript->registerScriptFile(
            \Yii::app()->assetManager->publish(\Yii::app()->basePath.'/modules/admin/assets/js/upload.js')
        );

        \Yii::app()->clientScript->registerCssFile(
            \Yii::app()->assetManager->publish(\Yii::app()->basePath.'/modules/admin/assets/css/upload.css')
        );

        \Yii::app()->clientScript->registerScriptFile(
            \Yii::app()->assetManager->publish(\Yii::app()->basePath.'/modules/admin/assets/js/extensions/jquery.dataTables.min.js')
        );

        \Yii::app()->clientScript->registerCssFile(
            \Yii::app()->assetManager->publish(\Yii::app()->basePath.'/modules/admin/assets/css/extensions/jquery.dataTables.min.css')
        );
    }
} 