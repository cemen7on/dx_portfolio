<?php
    Yii::app()->clientScript->registerScriptFile('/js/videos.js');

    /** @var array $works */
    foreach($works as $key=>$work){?>
        <div id="art<?php echo $work->id;?>" class="button thumb video"
             style="<?php echo isset($width)?"width:{$width}px; ":null; echo isset($height)?"height:{$height}px;":null;?>"
             data-video-id="<?php echo $work->youtube_id;?>">

            <div class="image <?php echo Yii::app()->request->isAjaxRequest?'animated':null; ?>">
                <img src="<?php echo CVideos::createSmallThumbUrl($work->thumbSmall->name);?>" />
            </div>
        </div><?php
    }