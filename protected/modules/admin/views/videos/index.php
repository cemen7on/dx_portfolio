<button>
    <a href="<?php echo Yii::app()->createAbsoluteUrl('/oauth/google/authorize')?>">Authorize in YouTube</a>
</button>

<?php
    $oauthToken=Yii::app()->session->get('oauthToken');
    if(!empty($oauthToken)){ ?>
        <div style="color:green;">You are authorized in YouTube</div><?php
    }

    /**
     * @var VideosController $this
     * @var Videos $model
     * @var CActiveForm $form
     */

    $form=$this->beginWidget('CActiveForm', array('htmlOptions'=>array(
        'action'=>'/admin/videos',
        'enctype'=>'multipart/form-data'
    )));

    echo $form->errorSummary($model); ?>

    <div><?php echo $form->textField($model, 'link', array('placeholder'=>'Link to video on YouTube'));?></div>
    <div><?php echo CHtml::submitButton('Submit');?></div><?php

    $this->endWidget(); ?>

    <table id="videos" class="content">
        <thead>
            <tr><?php
                foreach(Videos::DT_COLUMNS() as $column){ ?>
                    <th><?php echo $column['caption'];?></th><?php
                } ?>
            </tr>
        </thead>

        <tbody></tbody>
    </table>