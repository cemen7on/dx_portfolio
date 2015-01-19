<a href="<?php echo Yii::app()->createAbsoluteUrl('/oauth/google/authorize')?>">Authorize in YouTube</a>

<?php
    $oauthToken=Yii::app()->session->get('oauthToken');
    if(!empty($oauthToken)){ ?>
        <div style="color:green;">You are authorized in YouTube</div><?php
    }

    /** @var $model Videos */

    echo CHtml::errorSummary($model);

    echo CHtml::beginForm('/admin/upload/videos', 'POST', array('enctype'=>'multipart/form-data')); ?>

<div>
    <?php echo CHtml::activeTextField($model, 'link', array('placeholder'=>'Link to video on YouTube')); ?>
</div>

<div>
    <?php echo CHtml::submitButton('Submit'); ?>
</div><?php

echo CHtml::endForm();