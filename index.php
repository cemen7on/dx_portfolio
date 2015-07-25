<?php
$serverAddress=$_SERVER['SERVER_ADDR'];
define('PRODUCTION_IP', '185.28.20.70');
define('IS_PRODUCTION', $serverAddress==PRODUCTION_IP);

ini_set('display_errors', IS_PRODUCTION);
ini_set('error_reporting', E_ALL);

defined('YII_DEBUG') or define('YII_DEBUG', IS_PRODUCTION);

defined('URL_SEPARATOR') or define('URL_SEPARATOR', '/');
defined('DS') or define('DS', DIRECTORY_SEPARATOR);
defined('US') or define('US', URL_SEPARATOR);

$DBConfigName=IS_PRODUCTION?'production':'local';
$db=__DIR__.'/protected/config/db/'.$DBConfigName.'.php';

$config=__DIR__.'/protected/config/main.php';
if(IS_PRODUCTION){
    $yii=__DIR__.'/yii/yii.php';
}
else{
    $yii=__DIR__.'/../yii/1.1.16/framework/yii.php';
}


require_once $yii;
Yii::createWebApplication($config)->run();
