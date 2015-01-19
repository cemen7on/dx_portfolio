<?php
	/**
     * @var ArtController $this
     * @var string $content
     */

    Yii::app()->clientScript->registerScriptFile('/js/components/modal/Modal.js');
    Yii::app()->clientScript->registerScriptFile('/js/components/modal/Gallery.js');
    Yii::app()->clientScript->registerCssFile('/css/modal/styles.css');

    Yii::app()->clientScript->registerScriptFile('/js/art.js');
    Yii::app()->clientScript->registerCssFile('/css/art.css');

	// Use main layout
	$this->beginContent('/layouts/main');

	// include top nav menu
	$this->widget('TopNavMenu', array(
		'htmlOptions'=>array(
			'class'=>'absolute'
		)
	));

	// include aside nav menu
	$this->widget('AsideNavMenu', array(
		'caption'=>$this->asideCaption,
		'items'=>$this->asideItems
	));?>

	<!-- Centric content -->

	<div class="absolute-size vertical-align" id="art">
		<div class="center">
			<div class="inline">
                <div class="art-medium">
                    <div class="art-medium-preview">
                        <?php echo $content; ?>
                    </div>

                    <div class="float-clear"></div>

                    <?php
                        if(!empty($this->pages)){
                            $this->widget('Pagination', array('pages'=>$this->pages));
                        }
                    ?>
                </div>
			</div>
		</div>
	</div><?php

	$this->endContent();