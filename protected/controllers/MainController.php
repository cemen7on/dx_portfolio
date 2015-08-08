<?php
namespace controllers;

use components\REST;
use models\Facade;

class MainController extends BaseController{
    /**
	 * Start page
	 */
	public function actionIndex(){
        $this->sendData(Facade::compile());
    }

	/**
	 * Action is triggered when error occurred.
	 */
	public function actionError(){
        $error=array();
        if(!empty(\Yii::app()->errorHandler->error)){
            $error=\Yii::app()->errorHandler->error;
        }

        $message=isset($error['message'])?$error['message']:'Internal server error';
        $code=isset($error['errorCode'])?$error['errorCode']:0;
        $exception=\Yii::app()->errorHandler->getException();

        if(\Yii::app()->request->isAjaxRequest){
            if(!empty($exception)){
                REST::error($exception);
            }
            else{
                REST::error($message, $code);
            }
        }
        else{
            if(YII_DEBUG){
                print_r($error);
            }
            else{
                echo 'Oooops, Error :(. '.$message.'. That\'s all we know';
            }
        }
	}
}
