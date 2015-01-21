<?php
class AdminModule extends CWebModule{
    /**
     * Module's default controller name
     *
     * @var string
     */
    public $defaultController='auth';

    /**
     * Initialization method.
     * Sets import routes for module
     */
    protected function init(){
        // import the module-level models and components
        $this->setImport(array(
            'admin.components.*',
            'admin.controllers.*',
            'admin.models.*',
        ));

        parent::init();
    }
} 