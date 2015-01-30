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

    /**
     * Returns cover order drop down list
     *
     * @param int $default. Default value for dropdown
     * @param int $count. Maximum serial number of cover
     * @return string
     */
    public static function coverOrder($default, $count){
        $data=array(0=>'No order');

        for($i=1; $i<=$count; $i++){
            $data[$i]=$i;
        }

        if(empty($default)){
            $default=0;
        }

        return CHtml::dropDownList('coverOrder', $default, $data, array('class'=>'cover-order'));
    }
} 