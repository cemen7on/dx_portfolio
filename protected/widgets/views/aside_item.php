<?php
    foreach($this->items as $key=>$work){?>
        <li>
            <a href="javascript:void(0);" title="<?php echo $work->title;?>"
               data-target="art<?php echo $work->id;?>">
                <?php echo $work->title;?>
            </a>
        </li><?php
    }
?>