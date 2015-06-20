<?php
    /**
     * @var PicturesController $this
     * @var Pictures $model
     * @var CActiveForm $form
     */

    $this->registerModuleScriptFile('/js/extensions/cropper.js');
    $this->registerModuleCssFile('/css/extensions/cropper.css');

    $this->registerModuleScriptFile('/js/pictures.js');

    $form=$this->beginWidget('CActiveForm', array(
        'action'=>'/admin/pictures/upload',
        'htmlOptions'=>array(
            'enctype'=>'multipart/form-data',
            'class'=>'upload-form'
        )
    )); ?>

    <div><?php echo $form->fileField($model, 'src');?></div>
    <div><?php echo $form->dropDownList($model, 'typeId', models\PicturesType::model()->findAllIndexByPk());?></div>
    <div><?php echo $form->textField($model, 'title', array('placeholder'=>'File name'));?></div>
    <div><?php echo $form->textArea($model, 'description', array('placeholder'=>'File description'));?></div>
    <div><?php echo CHtml::submitButton('Submit');?></div><?php

    $this->endWidget(); ?>

    <table id="pictures" class="content">
        <thead>
            <tr><?php
                foreach(models\Pictures::DT_COLUMNS() as $column){ ?>
                    <th><?php echo $column['caption'];?></th><?php
                } ?>
            </tr>
        </thead>

        <tbody></tbody>
    </table>