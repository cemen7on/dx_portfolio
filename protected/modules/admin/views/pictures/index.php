<?php
    /**
     * @var \admin\controllers\PicturesController $this
     * @var \models\Pictures $picturesModel
     * @var CActiveForm $form
     */
    $form=$this->beginWidget('CActiveForm', array(
        'action'=>'/admin/pictures/upload',
        'htmlOptions'=>array(
            'enctype'=>'multipart/form-data',
            'class'=>'upload-form'
        )
    )); ?>

    <div><?php echo $form->fileField($picturesModel, 'src');?></div>
    <div><?php echo $form->dropDownList($picturesModel, 'typeId', models\PicturesType::model()->findAllIndexByPk());?></div>
    <div><?php echo $form->textField($picturesModel, 'title', array('placeholder'=>'File name'));?></div>
    <div><?php echo $form->textArea($picturesModel, 'description', array('placeholder'=>'File description'));?></div>
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