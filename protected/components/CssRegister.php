<?php
namespace components;

class CssRegister extends AssetsRegister{
    /**
     * Register CSS file by its absolute path
     *
     * @param string $path. CSS file absolute path
     * @return $this
     */
    protected function importFile($path){
        \Yii::app()->clientScript->registerCssFile(
            \Yii::app()->assetManager->publish($path)
        );

        return $this;
    }
} 