<?php
class MainController extends CController{
    /**
     * Page's title
     *
     * @var string
     */
    public $pageTitle='DiMaX Portfolio';

	/**
	 * Action for /main/index request. Default page.
	 */
	public function actionIndex(){
		$this->render('index');
	}

	/**
	 * Action is triggered when error occurred.
	 */
	public function actionError(){
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
	}
}
