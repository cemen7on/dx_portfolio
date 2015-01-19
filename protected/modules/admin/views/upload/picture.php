<h1 style="float:left;">Add Picture</h1>
<h1 style="float:left; margin-left:10px; margin-right:10px;">|</h1>
<h1 style="float:left;">
    <a href="<?php echo Yii::app()->createAbsoluteUrl('/admin/upload/video')?>">Add Video</a>
</h1>
<div style="clear:left;"></div>

<?php
    /** @var $model Pictures */

    echo CHtml::errorSummary($model);

    echo CHtml::beginForm('/admin/upload/picture', 'POST', array('enctype'=>'multipart/form-data')); ?>

    <div>
        <?php echo CHtml::activeFileField($model, 'src'); ?>
    </div>

    <div>
        <?php echo CHtml::activeDropDownList($model, 'type_id', PicturesType::model()->findAllIndexByPk()); ?>
    </div>

    <div>
        <?php echo CHtml::activeTextField($model, 'title', array('placeholder'=>'File name')); ?>
    </div>

    <div>
        <?php echo CHtml::activeTextArea($model, 'description', array('placeholder'=>'File description')); ?>
    </div>

    <div>
        <?php echo CHtml::submitButton('Submit'); ?>
    </div><?php

    echo CHtml::endForm();