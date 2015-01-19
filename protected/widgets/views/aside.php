<?php
	Yii::app()->clientScript->registerCssFile('/css/nav/aside.css');
?>

<aside id="asideNavMenu" class="absolute-height vertical-align">
    <div class="center">
        <div class="caption"><?php echo $this->caption;?></div>

        <ul class="align-left">
            <?php echo $this->render('aside_item');?>
        </ul>
    </div>
</aside>