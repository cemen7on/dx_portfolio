<?php
class AuthController extends CController{
    /**
     * Default action name
     *
     * @var string
     */
    public $defaultAction='login';

    /**
     * Controller view's layout name
     *
     * @var string
     */
    public $layout='main';

    /**
     * Login action.
     * Shows and process authorization form
     */
    public function actionLogin(){
        if(!Yii::app()->admin->isGuest){
            $this->redirect('/admin/upload');
        }

        $aModel=new Admins();

        if(!empty($_POST['Admins'])){
            $aModel->attributes=$_POST['Admins'];

            if($aModel->validate()){
                $identity=new AdminIdentity($aModel->login, $aModel->password);

                if($identity->authenticate()){
                    Yii::app()->admin->login($identity);

                    // Authorization succeeded. Quit point
                    $this->redirect('/admin/upload');
                }
                else{
                    switch($identity->errorCode){
                        case AdminIdentity::ERROR_USERNAME_INVALID:
                            $aModel->addError('login', 'Invalid login');
                            break;
                        case AdminIdentity::ERROR_PASSWORD_INVALID:
                            $aModel->addError('password', 'Invalid password');
                            break;
                        default:
                            $aModel->addError('login', 'Unknown error');
                            break;
                    }
                }
            }
        }

        $this->render('login', array('model'=>$aModel));
    }

    /**
     * Logout action.
     * Destroys admin authorization
     */
    public function actionLogout(){
        Yii::app()->admin->logout();

        $this->redirect('/admin/auth');
    }
} 