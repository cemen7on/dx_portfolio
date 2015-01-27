<?php /** @var array $items */ ?>
<div class="nav-menu-item-pic-container">
	<?php foreach($items as $art){
        $cover=isset($art->imageCover->name)
            ? CPictures::createCoverUrl($art->imageCover->name)
            : CPictures::createBigThumbUrl($art->thumbBig->name); ?>

		<div data-href="<?php echo TopNavMenu::URI_ART_3D;?>"
			 class="nav-menu-item-pic"
             style="background-image:url(<?php echo $cover; ?>);">
		</div><?php
	}?>
</div>