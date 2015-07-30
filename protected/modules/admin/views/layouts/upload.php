<?php
    /**
     * @var \admin\controllers\UploadController $this
     * @var string $content
     */

    $this->beginContent('/layouts/main'); ?>

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