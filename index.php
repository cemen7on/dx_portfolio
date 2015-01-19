<?php
ini_set('display_errors', true);
ini_set('error_reporting', E_ALL);

defined('YII_DEBUG') or define('YII_DEBUG', true);

defined('URL_SEPARATOR') or define('URL_SEPARATOR', '/');
defined('DS') or define('DS', DIRECTORY_SEPARATOR);
defined('US') or define('US', URL_SEPARATOR);

$config=dirname(__FILE__).'/protected/config/main.php';
require_once dirname(__FILE__).'/framework/yii.php';

Yii::createWebApplication($config)->run();
