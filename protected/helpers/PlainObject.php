<?php
class PlainObject extends StdClass{
    /**
     * Class constructor. Sets class properties from array
     *
     * @param array $attributes. Class properties array
     */
    public function __construct($attributes=array()){
        foreach($attributes as $property=>$value){
            $this->{$property}=$value;
        }
    }
} 