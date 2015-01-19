<?php
function autoloader($className){
    $root=__DIR__.DS.'sdk'.DS.'src';

    $alias=explode('_', $className);

    // If loaded class in not part of google sdk
    if($alias[0]!='Google'){
        return false;
    };

    if(!isset($alias[1])){
        print_r($alias); exit;
    }

    if(isset($alias[2])){
        $root.=DS.$alias[1];

        $fileName=$alias[2];
    }
    else{
        $fileName=$alias[1];
    }

    $path=$root.DS.$fileName.'.php';

    return require_once $path;
}

spl_autoload_register('autoloader', true, true);