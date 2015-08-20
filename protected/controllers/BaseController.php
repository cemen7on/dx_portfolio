<?php
namespace controllers;

use Yii;
use components\REST;

class BaseController extends \CController{
    /**
     * Page's title
     *
     * @var string
     */
    public $pageTitle='DiMaX Portfolio';

    /**
     * JS scripts' path map
     *
     * @var array
     */
    protected $scriptMap=array(
        '/js-origin/backbone'=>array(
            'underscore.js',
        ),
        '/js-origin/core'=>array(
            'define.js',
            'Core.js'
        ),
        '/js-origin/extensions'=>array(
            'youtube/youtube.js'
        ),
        '/js-origin/components'=>array(
            'Container.js',
            'Modal.js',
        ),
        '/js-origin/models',
        '/js-origin/collections'=>array(
            'ArtCollection.js'
        ),
        '/js-origin/controllers',
        '/js-origin/views'=>array(
            'art/Thumb.js',
            'art/ThumbsCollection.js'
        ),
        '/js-origin/index.js'
    );

    /**
     * CSS files path map
     *
     * @var array
     */
    protected $cssMap=array(
        '/css-origin/nav',
        '/css-origin/modal',
        '/css-origin/pagination',
        '/css-origin/common.css',
        '/css-origin/main.css',
        '/css-origin/art.css',
        '/css-origin/contacts.css'
    );

    /**
     * Controller initialization method.
     * Registers script files.
     */
    public function init(){
        Yii::app()->clientScript->registerCoreScript('jquery');

        if(YII_DEBUG){
            Yii::app()->ScriptRegister->publish($this->scriptMap);
            Yii::app()->CssRegister->publish($this->cssMap);

            Yii::app()->clientScript->registerCssFile('/css-origin/font-awesome/css/font-awesome.min.css');
        }
        else{
            Yii::app()->ScriptRegister->publish('/js/application.js');
            Yii::app()->CssRegister->publish('/css/styles.css');

            Yii::app()->clientScript->registerCssFile('/css/font-awesome/css/font-awesome.min.css');
        }
    }

    /**
     * Sends data to client
     *
     * @param array $data. Data to send
     */
    protected function sendData(array $data){
        if(Yii::app()->request->isAjaxRequest){
            REST::success($data);
        }
        else{
            $this->render('/base/data', array('data'=>$data));
        }
    }
} 