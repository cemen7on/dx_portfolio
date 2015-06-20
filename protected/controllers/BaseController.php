<?php
namespace controllers;

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
        'backbone'=>array(
            'underscore.js',
        ),
        'core'=>array(
            'define.js',
            'Core.js'
        ),
        'extensions',
        'components/Modal.js',
        'models',
        'collections',
        'controllers',
        'views',
        'index.js'
    );

    /**
     * CSS files path map
     *
     * @var array
     */
    protected $cssMap=array(
        'nav',
        'modal',
        'common.css',
        'main.css',
        'art.css'
    );

    /**
     * Controller initialization method.
     * Registers script files.
     */
    public function init(){
        \Yii::app()->clientScript->registerCoreScript('jquery');

        \Yii::app()->ScriptRegister->publish($this->scriptMap);
        \Yii::app()->CssRegister->publish($this->cssMap);

        \Yii::app()->clientScript->registerCssFile('/css/font-awesome/css/font-awesome.min.css');
    }

    /**
     * Sends data to client
     *
     * @param array $data. Data to send
     */
    protected function sendData(array $data){
        if(\Yii::app()->request->isAjaxRequest){
            echo \CJSON::encode($data);
        }
        else{
            $this->render('/base/data', array('data'=>$data));
        }
    }
} 