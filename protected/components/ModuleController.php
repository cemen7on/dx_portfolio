<?php
class ModuleController extends CController{
    /**
     * Client script object instance
     *
     * @var CClientScript
     */
    protected $clientScript=null;

    /**
     * Asset manager object instance
     *
     * @var CAssetManager
     */
    protected $assetManager=null;

    /**
     * Root assets directory path
     *
     * @var string
     */
    private $_rootAssetsDirectory='';

    /**
     * Assets directory path in current module
     *
     * @var string
     */
    private $_moduleAssetsDirectory='';

    /**
     * Initialization method
     */
    public function init(){
        parent::init();

        $this->clientScript=Yii::app()->clientScript;
        $this->assetManager=Yii::app()->assetManager;

        $this->_initAssetsDirectories();
    }

    /**
     * Initializes assets directories paths
     */
    private function _initAssetsDirectories(){
        $this->_rootAssetsDirectory=Yii::getPathOfAlias('webroot');

        $module=Yii::app()->controller->module;
        if(!empty($module)){
            $this->_moduleAssetsDirectory=Yii::getPathOfAlias('application.modules.'.$module->id.'.assets');
        }
    }

    /**
     * Returns root assets directory path
     *
     * @return string
     */
    protected function rootAssetsDirectory(){
        return $this->_rootAssetsDirectory;
    }

    /**
     * Returns current module's assets directory path
     *
     * @return string
     */
    protected function moduleAssetsDirectory(){
        return $this->_moduleAssetsDirectory;
    }

    /**
     * Register css file
     *
     * @param string $url. Css file path
     * @param string $media. Media that the CSS file should be applied to. If empty, it means all media types.
     * @return $this
     */
    protected function registerCssFile($url, $media=''){
        $this->clientScript->registerCssFile($this->assetManager->publish($url), $media);

        return $this;
    }

    /**
     * Register script file
     *
     * @param string $url. Script file path
     * @param null|int $position. Script tag position
     * @param array $htmlOptions. Script tag additional attributes list
     * @return $this
     */
    protected function registerScriptFile($url, $position=null, array $htmlOptions=array()){
        $this->clientScript->registerScriptFile($this->assetManager->publish($url), $position, $htmlOptions);

        return $this;
    }

    /**
     * Register css file from root directory
     *
     * @param string $url. Css file path
     * @param string $media. Media that the CSS file should be applied to. If empty, it means all media types.
     * @return $this
     */
    public function registerRootCssFile($url, $media=''){
        return $this->registerCssFile($this->rootAssetsDirectory().$url, $media);
    }

    /**
     * Register script file from root directory
     *
     * @param string $url. Script file path
     * @param null|int $position. Script tag position
     * @param array $htmlOptions. Script tag additional attributes list
     * @return $this
     */
    public function registerRootScriptFile($url, $position=null, array $htmlOptions=array()){
        return $this->registerScriptFile($this->rootAssetsDirectory().$url, $position, $htmlOptions);
    }

    /**
     * Register css file from module's asset directory
     *
     * @param string $url. Css relative file path in asset directory
     * @param string $media. Media that the CSS file should be applied to. If empty, it means all media types.
     * @return $this
     */
    public function registerModuleCssFile($url, $media=''){
        return $this->registerCssFile($this->moduleAssetsDirectory().$url, $media);
    }

    /**
     * Register script file from module's asset directory
     *
     * @param string $url. Script relative file path in asset directory
     * @param null|int $position. Script tag position
     * @param array $htmlOptions. Script tag additional attributes list
     * @return $this
     */
    public function registerModuleScriptFile($url, $position=null, array $htmlOptions=array()){
        return $this->registerScriptFile($this->moduleAssetsDirectory().$url, $position, $htmlOptions);
    }
} 