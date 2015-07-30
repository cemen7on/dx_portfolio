<?php
namespace admin\components;

class AdminIdentity extends \CUserIdentity{
    /**
     * Authenticates a user.
     *
     * @return boolean
     */
    public function authenticate(){
        $admin=\Yii::app()->params['admin'];

        if($admin['login']!=$this->username){
            $this->errorCode=self::ERROR_USERNAME_INVALID;
        }
        elseif($admin['password']!=sha1($this->password)) {
            $this->errorCode=self::ERROR_PASSWORD_INVALID;
        }
        else{
            $this->errorCode=self::ERROR_NONE;
        }

        return !$this->errorCode;
    }
}