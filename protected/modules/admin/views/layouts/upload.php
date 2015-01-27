<?php
    /**
     * @var UploadController $this
     * @var string $content
     */

    $this->beginContent('/layouts/main');

    Yii::app()->clientScript->registerCssFile('/css/font-awesome/css/font-awesome.min.css');

    $this->registerRootScriptFile('/js/components/define.js');
    $this->registerRootScriptFile('/js/components/Core.js');

    $this->registerRootScriptFile('/js/components/modal/Modal.js');
    $this->registerRootCssFile('/css/modal/styles.css');

    $this->registerModuleScriptFile('/js/upload.js');
    $this->registerModuleCssFile('/css/upload.css');

    $this->registerModuleScriptFile('/js/extensions/jquery.dataTables.min.js');
    $this->registerModuleCssFile('/css/extensions/jquery.dataTables.min.css'); ?>

    <ul class="breadcrumbs">
        <li><?php
            if($this->id=='pictures'){ ?>
                Pictures<?php
            }
            else{ ?>
                <a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/pictures');?>">Pictures</a><?php
            } ?>
        </li>

        <li class="divider">|</li>

        <li><?php
            if($this->id=='videos'){ ?>
                Videos<?php
            }
            else{ ?>
                <a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/videos');?>">Videos</a><?php
            } ?>
        </li>

        <li class="divider">|</li>

        <li><a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/auth/logout');?>">Logout</a></li>
    </ul><?php

    echo $content;

    $this->endContent();