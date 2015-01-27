<?php /** @var array $items */ ?>
<div class="nav-menu-item-pic-container">
	<?php foreach($items as $picture){
        $cover=isset($picture->imageCover->name)
            ? CPictures::createCoverUrl($picture->imageCover->name)
            : CPictures::createBigThumbUrl($picture->thumbBig->name); ?>

		<div data-href="<?php echo TopNavMenu::URI_PICTURES_2D;?>"
			 class="nav-menu-item-pic"
             style="background-image:url(<?php echo $cover; ?>);">
		</div><?php
	}?>
</div>