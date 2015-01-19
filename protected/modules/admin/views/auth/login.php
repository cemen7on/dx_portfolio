<?php
/**
 * @var AuthController $this
 * @var Admins $model
 * @var CActiveForm $form
 */

$form=$this->beginWidget('CActiveForm');

echo $form->errorSummary($model);

echo $form->textField($model, 'login', array('placeholder'=>'Login'));
echo $form->passwordField($model, 'password', array('placeholder'=>'Password')); ?>

<button type="submit">
    <span>Log in</span>
</button><?php

$this->endWidget();
