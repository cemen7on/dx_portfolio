<?php
namespace admin\controllers;

class UploadController extends WebController{
    /**
     * Controller view's layout name
     *
     * @var string
     */
    public $layout='upload';

    /**
     * Returns list of filters applied to controller
     *
     * @return array
     */
    public function filters(){
        return array(
            'accessControl',
        );
    }

    /**
     * Returns access rules applied to user.
     * Denies all anonymous users.
     *
     * @return array
     */
    public function accessRules(){
        return array(
            array('allow',
                'users'=>array('@')
            ),
            array('deny',
                'users'=>array('*')
            )
        );
    }
}