<?php
ini_set('display_errors', true);
ini_set('error_reporting', E_ALL);

defined('YII_DEBUG') or define('YII_DEBUG', true);

defined('URL_SEPARATOR') or define('URL_SEPARATOR', '/');
defined('DS') or define('DS', DIRECTORY_SEPARATOR);
defined('US') or define('US', URL_SEPARATOR);

$config=__DIR__.'/protected/config/main.php';
require_once __DIR__.'/../yii/1.1.16/framework/yii.php';

Yii::createWebApplication($config)->run();
