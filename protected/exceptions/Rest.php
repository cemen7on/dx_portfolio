<?php
namespace exceptions;

use components;

class Rest extends \Exception{
    public function __construct(){
        components\REST::error($this);
    }
} 