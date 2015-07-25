<?php
Yii::setPathOfAlias('components', realpath(__DIR__.'/../components/'));
Yii::setPathOfAlias('controllers', realpath(__DIR__.'/../controllers/'));
Yii::setPathOfAlias('models', realpath(__DIR__.'/../models/'));

return array(
	'basePath'=>realpath(__DIR__.'/../'),
	'name'=>'DiMaX Portfolio',

	'import'=>array(
        'components.*',
        'models.*',
        'application.helpers.*',
        'application.widgets.*'
	),

	'defaultController'=>'main',
    'controllerNamespace'=>'\controllers',

    'modules'=>array(
        'admin',
        'oauth'
    ),

	'components'=>array(
        'db'=>$db,
        'ScriptRegister'=>array(
            'class'=>'\components\ScriptRegister',
            'rootPath'=>'webroot.js',
            'position'=>CClientScript::POS_HEAD
        ),
        'CssRegister'=>array(
            'class'=>'\components\CssRegister',
            'rootPath'=>'webroot.css'
        ),

        /*
        'request'=>array(
            'class'=>'\components\HttpRequest'
        ),
        */
        /*
        'rest'=>array(
            'class'=>'\components\RestRequest'
        ),
        */

        'image'=>array(
            'class'=>'ext.image.CImageComponent',
            'driver'=>'GD'
        ),
        'google'=>array(
            'class'=>'ext.google.sdk.Client',
            'clientId'=>'164940990608-oiigtb4idpcvcdaf9q757a76b36c33lh.apps.googleusercontent.com',
            'clientSecret'=>'Sw_xAewbDB0AoXWWHnKvqlpm',
            'redirectUrl'=>'/oauth/google/callback'
        ),
        'youtube'=>array(
            'class'=>'ext.google.sdk.Youtube'
        ),

		'user'=>array(
			'allowAutoLogin'=>true,
            'loginUrl'=>array('/admin/auth')
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