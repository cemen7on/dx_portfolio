<?php
namespace components;

class ScriptRegister extends AssetsRegister{
    /**
     * Scripts' position number
     *
     * @var int
     */
    public $position=\CClientScript::POS_END;

    /**
     * Sets scripts' position number
     *
     * @param int $position. Scripts' position number
     * @return $this
     */
    public function setPosition($position){
        $this->position=$position;

        return $this;
    }

    /**
     * Register JavaScript file by its absolute path
     *
     * @param string $path. Script absolute path
     * @return $this
     */
    protected function importFile($path){
        \Yii::app()->clientScript->registerScriptFile(
            \Yii::app()->assetManager->publish($path),
            $this->position
        );

        return $this;
    }
} 