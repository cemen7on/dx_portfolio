<?php
    /**
     * @var \admin\controllers\PicturesController $this
     * @var \models\Pictures $picturesModel
     * @var \models\Media $mediaModel
     * @var CActiveForm $form
     */
    $form=$this->beginWidget('CActiveForm', array(
        'action'=>'/admin/pictures/upload',
        'htmlOptions'=>array(
            'enctype'=>'multipart/form-data',
            'class'=>'upload-form'
        )
    )); ?>

    <div><?php echo $form->fileField($mediaModel, 'src');?></div>
    <div><?php echo $form->dropDownList($picturesModel, 'typeId', models\PicturesType::model()->findAllIndexByPk());?></div>
    <div><?php echo $form->textField($mediaModel, 'title', array('placeholder'=>'File name'));?></div>
    <!--div><?php // echo $form->textArea($mediaModel, 'description', array('placeholder'=>'File description'));?></div-->
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