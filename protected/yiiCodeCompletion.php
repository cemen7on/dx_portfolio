<?php

/**
 * Created by PhpStorm.
 * User: max
 * Date: 26.01.14
 * Time: 21:25
 *
 * If you want get access to auto completion code for static "Yii::app()->user-><Ctrl+Space>"
 * Go to framework/yii.php, inside class Yii extends YiiBase add following code
 *
 * @return CApplication|CWebApplication|CConsoleApplication
 * public static function app()
 * {
 * return parent::app();
 * }
 *
 * Add below the properties extensions for automatic code completion in the IDE
 *
 * @property CImageComponent $image
 */
class CApplication
{
}