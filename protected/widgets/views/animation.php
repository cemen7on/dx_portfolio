<?php /** @var array $items */ ?>
<div class="nav-menu-item-pic-container">
	<?php foreach($items as $video){
        $cover=isset($video->imageCover->name)
            ? CVideos::createCoverUrl($video->imageCover->name)
            : CVideos::createBigThumbUrl($video->thumbBig->name); ?>

		<div data-href="<?php echo TopNavMenu::URI_ANIMATION;?>"
			 class="nav-menu-item-pic"
             style="background-image:url(<?php echo $cover; ?>);">
		</div><?php
	}?>
</div>