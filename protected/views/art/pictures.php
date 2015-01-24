<?php
    /**
     * @var ArtController $this
     * @var array $works
     * @var Pagination $pagination
     */

    Yii::app()->clientScript->registerScriptFile('/js/pictures.js');

    foreach($works as $key=>$work){?>
        <div class="button thumb picture"
             id="art<?php echo $work->id;?>" data-width="<?php echo $work->thumbBig->width;?>"
             data-height="<?php echo $work->thumbBig->height;?>">

            <div class="image <?php echo Yii::app()->request->isAjaxRequest?'animated':null; ?>">
                <img src="<?php echo CPictures::createSmallThumbUrl($work->thumbSmall->name);?>" />
            </div>
        </div><?php
    }