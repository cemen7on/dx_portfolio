<?php
    /**
     * @var UploadController $this
     * @var string $content
     */

    $this->beginContent('/layouts/main');

    $this->registerModuleCssFile('/css/upload.css'); ?>

    <ul class="breadcrumbs">
        <li><?php
            if($this->action->id=='pictures'){ ?>
                Pictures<?php
            }
            else{ ?>
                <a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/upload/pictures');?>">Pictures</a><?php
            } ?>
        </li>

        <li class="divider">|</li>

        <li><?php
            if($this->action->id=='videos'){ ?>
                Videos<?php
            }
            else{ ?>
                <a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/upload/videos');?>">Videos</a><?php
            } ?>
        </li>

        <li class="divider">|</li>

        <li><a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/auth/logout');?>">Logout</a></li>
    </ul><?php

    echo $content;

    $this->endContent();