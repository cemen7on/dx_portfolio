<?php
$serverAddress=$_SERVER['SERVER_ADDR'];
define('PRODUCTION_IP', '127.5.5.1');
define('IS_PRODUCTION', $serverAddress==PRODUCTION_IP);

ini_set('display_errors', true);
ini_set('error_reporting', E_ALL);

defined('YII_DEBUG') or define('YII_DEBUG', !IS_PRODUCTION);

defined('URL_SEPARATOR') or define('URL_SEPARATOR', '/');
defined('DS') or define('DS', DIRECTORY_SEPARATOR);
defined('US') or define('US', URL_SEPARATOR);

$dbConfigName=IS_PRODUCTION?'production':'local';
$config=__DIR__.'/protected/config/'.$dbConfigName.'.php';
$yii=IS_PRODUCTION
     ? __DIR__.'/../../../yii/1.1.16/framework/yii.php'
     : __DIR__.'/../yii/1.1.16/framework/yii.php';

require_once $yii;
Yii::createWebApplication($config)->run();
