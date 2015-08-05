<?php
Yii::setPathOfAlias('components', realpath(__DIR__.'/../components/'));
Yii::setPathOfAlias('exceptions', realpath(__DIR__.'/../exceptions/'));
Yii::setPathOfAlias('controllers', realpath(__DIR__.'/../controllers/'));
Yii::setPathOfAlias('models', realpath(__DIR__.'/../models/'));

Yii::setPathOfAlias('admin', realpath(__DIR__.'/../modules/admin'));

return array(
    'basePath'=>realpath(__DIR__.'/../'),
    'name'=>'DiMaX Portfolio',

    'import'=>array(
        'components.*',
        'models.*',
        'exceptions.*',
        'application.helpers.*',
    ),

    'defaultController'=>'main',
    'controllerNamespace'=>'\controllers',

    'modules'=>array(
        'admin'=>array(
            'class'=>'admin\AdminModule'
        ),
        'oauth'
    ),

    'components'=>array(
        'ScriptRegister'=>array(
            'class'=>'\components\ScriptRegister',
            'position'=>CClientScript::POS_HEAD
        ),
        'CssRegister'=>array(
            'class'=>'\components\CssRegister'
        ),

        'Request'=>array(
            'class'=>'\components\HttpRequest'
        ),

        'RestRequest'=>array(
            'class'=>'\components\RestRequest'
        ),

        'image'=>array(
            'class'=>'ext.image.CImageComponent',
            'driver'=>'GD'
        ),

        'youtube'=>array(
            'class'=>'ext.google.sdk.Youtube'
        ),

        'admin'=>array(
            'class'=>'CWebUser',
            'loginUrl'=>array('/admin/auth'),
        ),

        'errorHandler'=>array(
            'errorAction'=>'main/error',
        ),

        'urlManager'=>array(
            'urlFormat'=>'path',
            'showScriptName'=>false,
            'rules'=>array(
                'media/<mediaId:\d+>/<action:\w+>'=>'media/<action>',

                array(
                    'admin/<controller>/delete',
                    'pattern'=>'admin/<controller:(pictures|videos)>/<id:\d+>',
                    'verb'=>'DELETE'
                ),
                array(
                    'admin/<controller>/update',
                    'pattern'=>'admin/<controller:(pictures|videos)>/<id:\d+>',
                    'verb'=>'PUT'
                ),
                array(
                    'admin/<controller>/deleteCover',
                    'pattern'=>'admin/<controller:(pictures|videos)>/<id:\d+>/cover',
                    'verb'=>'DELETE'
                ),
                'admin/<controller:(pictures|videos)>/<id:\d+>/<action:\w+>'=>'admin/<controller>/<action>',

                '<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
                '<controller:\w+>/<action:\w+>'=>'<controller>/<action>',

                '<module:\w+>/<controller:\w+>'=>'<module>/<controller>',
                '<module:\w+>/<controller:\w+>/<action:\w+>'=>'<module>/<controller>/<action>',
            ),
        ),
    ),

    'params'=>array(
        'admin'=>array(
            'login'=>'root',
            'password'=>sha1('root')
        ),
        'covers'=>array(
            'animation'=>array('count'=>2),
            'pictures2d'=>array('count'=>2),
            'art3d'=>array('count'=>4)
        )
    ),
);