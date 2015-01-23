<?php
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'DiMaX Portfolio',

	// autoloading model and component classes
	'import'=>array(
        'application.components.*',
        'application.models.*',
        'application.helpers.*',
        'application.widgets.*'
	),

	'defaultController'=>'main',

    'modules'=>array(
        'admin',
        'oauth'
    ),

	// application components
	'components'=>array(
        'google'=>array(
            'class'=>'ext.google.sdk.Client',
            'clientId'=>'164940990608-oiigtb4idpcvcdaf9q757a76b36c33lh.apps.googleusercontent.com',
            'clientSecret'=>'Sw_xAewbDB0AoXWWHnKvqlpm',
            'redirectUrl'=>'/oauth/google/callback'
        ),
        'youtube'=>array(
            'class'=>'ext.google.sdk.Youtube'
        ),
        'image'=>array(
            'class'=>'ext.image.CImageComponent',
            'driver'=>'GD'
        ),
		'user'=>array(
			'allowAutoLogin'=>true,
            'loginUrl'=>array('/admin/auth')
		),
        'admin'=>array(
            'class'=>'CWebUser',
            'loginUrl'=>array('/admin/auth'),
        ),
		'db'=>array(
			'connectionString'=>'mysql:host=localhost;dbname=dx_portfolio',
			'emulatePrepare'=>true,
			'username'=>'root',
			'password'=>'',
			'charset'=>'utf8',
		),
		'errorHandler'=>array(
			'errorAction'=>'main/error',
		),
        'request'=>array(
            'class'=>'HttpRequest'
        ),
        'rest'=>array(
            'class'=>'RestRequest'
        ),
		'urlManager'=>array(
			'urlFormat'=>'path',
            'showScriptName'=>false,
			'rules'=>array(
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
        )
    ),
);