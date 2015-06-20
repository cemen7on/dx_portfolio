<?php
	/** * @var SiteController $this */
	Yii::app()->clientScript->registerScriptFile('/js/extensions/jquery/fn-animate-clip.js');
	Yii::app()->clientScript->registerScriptFile('/js/components/nav/pic.js');

	Yii::app()->clientScript->registerCssFile('/css/nav/pic.css');

    /** @var PicNavMenu $picNavMenu */
    $picNavMenu=$this->beginWidget('PicNavMenu');

	$this->widget('TopNavMenu', array(
        'animation'=>array('html'=>$picNavMenu->animation()),
        'pictures2d'=>array('html'=>$picNavMenu->pictures2d()),
        'art3d'=>array('html'=>$picNavMenu->art3d()),
        'htmlOptions'=>array('style'=>'opacity:0;')
	));

    $this->endWidget('PicNavMenu');
?>