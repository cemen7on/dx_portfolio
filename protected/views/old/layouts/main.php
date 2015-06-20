<?php
    header('Content-type:text/html; charset=utf-8');

    Yii::app()->clientScript->registerCssFile('/css/font-awesome/css/font-awesome.min.css');
    Yii::app()->clientScript->registerCssFile('/css/main.css');
    Yii::app()->clientScript->registerCssFile('/css/common.css');

	Yii::app()->clientScript->registerCoreScript('jquery');
	Yii::app()->clientScript->registerScriptFile('/js/components/define.js');
	Yii::app()->clientScript->registerScriptFile('/js/components/Core.js');
	Yii::app()->clientScript->registerScriptFile('/js/common.js');
?>

<!DOCTYPE html>
<html>
	<head>
        <meta charset="utf-8" />
		<title><?php echo $this->pageTitle;?></title>
	</head>

	<body>
    	<div id="substrate"></div>

        <div id="content">
			<?php echo $content;?>
		</div>
	</body>
</html>