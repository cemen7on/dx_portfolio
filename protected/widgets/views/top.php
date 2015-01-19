<?php
	/** @var TopNavMenu $this */
	Yii::app()->clientScript->registerCssFile('/css/nav/top.css');
?>

<nav id="topNavMenu" <?php echo $this->serializeHtmlOptions($this->htmlOptions);?>>
    <ul>
		<?php
            /** @var array $sections */
			foreach($sections as $section){?>
				<li
					class="float-left"
					<?php
						echo isset($section['htmlOptions'])
							? $this->serializeHtmlOptions($section['htmlOptions'])
							: null;
					?>
				>
					<a href="<?php echo $section['uri'];?>"><?php echo $section['caption'];?></a>

					<?php echo isset($section['html'])?$section['html']:null;?>
				</li><?php
			}
		?>
    </ul>
</nav>