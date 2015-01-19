<?php
class Admins extends CFormModel{
    /**
     * Account's login
     *
     * @var string
     */
    public $login;

    /**
     * Account's password
     *
     * @var string
     */
    public $password;

    /**
     * Model rules
     *
     * @return array
     */
    public function rules(){
        return array(
            array('login, password', 'required')
        );
    }
} 