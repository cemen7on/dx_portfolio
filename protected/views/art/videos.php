<?php
    Yii::app()->clientScript->registerScriptFile('/js/videos.js');

    /** @var array $works */
    foreach($works as $key=>$work){?>
        <div class="button thumb video float-left <?php echo !Yii::app()->request->isAjaxRequest?'animated':null;?>"
             id="art<?php echo $work->id;?>" data-video-id="<?php echo $work->youtube_id;?>">

            <div class="image">
                <img src="<?php echo CVideos::createSmallThumbUrl($work->thumbSmall->name);?>" />
            </div>
        </div><?php
    }