<?php
    /** * @var ModuleController $this */

    $this->registerRootCssFile('/css/main.css');

    Yii::app()->clientScript->registerCoreScript('jquery'); ?>

<!DOCTYPE html>
<html>
    <head>
        <title>DiMaX Portfolio - Admin</title>
    </head>

    <body>
        <?php
            /** @var $content */
            echo $content;
        ?>
    </body>
</html>