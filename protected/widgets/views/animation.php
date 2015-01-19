<?php /** @var array $items */ ?>
<div class="nav-menu-item-pic-container">
	<?php foreach($items as $animation){?>
		<div data-href="<?php echo TopNavMenu::URI_ANIMATION;?>"
			 class="nav-menu-item-pic"
             style="background-image:url(<?php echo CVideos::createBigThumbUrl($animation->thumbBig->name);?>);">
		</div><?php
	}?>
</div>