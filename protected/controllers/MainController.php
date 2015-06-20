<?php
namespace controllers;

use models\Facade;

class MainController extends BaseController{
    /**
	 * Start page
	 */
	public function actionIndex(){
        $this->sendData(Facade::retrieve());
    }

	/**
	 * Action is triggered when error occurred.
	 */
	public function actionError(){
        $error=\Yii::app()->errorHandler->error;

        echo '<pre>';
        print_r($error);
        /*
        $error=array();
        if(!empty(Yii::app()->errorHandler->error)){
            $error=Yii::app()->errorHandler->error;
        }

        $message=isset($error['message'])?$error['message']:'Internal server error';
        $code=isset($error['errorCode'])?$error['errorCode']:0;

        if(Yii::app()->request->isAjaxRequest){
            REST::errorResponse($message, $code);
        }
        else{
            echo 'Oooops, Error :(. '.$message.'. That\'s all we know';
        }
        */
	}
}
