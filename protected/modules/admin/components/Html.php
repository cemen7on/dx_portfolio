<?php
class Html extends CHtml{
    /**
     * Returns cover html
     *
     * @param string $source. Image's source
     * @return string
     */
    public static function cover($source){
        return
            '<div class="cover">
                <img src="'.$source.'" />
                <a href="javascript:void(0);" class="remove-cover"><i class="fa fa-times"></i></a>
            </div>';
    }
} 