<?php
    /**
     * @var PicturesController $this
     * @var Pictures $model
     * @var CActiveForm $form
     */

    $form=$this->beginWidget('CActiveForm', array('htmlOptions'=>array(
        'action'=>'/admin/pictures',
        'enctype'=>'multipart/form-data'
    )));

    echo $form->errorSummary($model); ?>

    <div><?php echo $form->fileField($model, 'src');?></div>
    <div><?php echo $form->dropDownList($model, 'type_id', PicturesType::model()->findAllIndexByPk());?></div>
    <div><?php echo $form->textField($model, 'title', array('placeholder'=>'File name'));?></div>
    <div><?php echo $form->textArea($model, 'description', array('placeholder'=>'File description'));?></div>
    <div><?php echo CHtml::submitButton('Submit');?></div><?php

    $this->endWidget(); ?>

    <table id="pictures" class="content">
        <thead>
            <tr><?php
                foreach(Pictures::DT_COLUMNS() as $column){ ?>
                    <th><?php echo $column['caption'];?></th><?php
                } ?>
            </tr>
        </thead>

        <tbody></tbody>
    </table>