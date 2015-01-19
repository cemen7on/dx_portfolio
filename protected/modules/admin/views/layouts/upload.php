<?php
    /**
     * @var UploadController $this
     * @var string $content
     */

    $this->beginContent('/layouts/main'); ?>

    <ul class="breadcrumbs">
        <li><a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/upload/pictures');?>">Pictures</a></li>

        <li><a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/upload/videos');?>">Videos</a></li>

        <li><a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/auth/logout');?>">Logout</a></li>
    </ul><?php

    echo $content;

    $this->endContent();