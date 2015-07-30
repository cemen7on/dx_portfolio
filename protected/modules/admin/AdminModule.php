<?php
namespace admin;

class AdminModule extends \CWebModule{
    /**
     * Module's default controller name
     *
     * @var string
     */
    public $defaultController='auth';

    /**
     * Module's controllers namespace.
     * Is used for autoload.
     *
     * @var string
     */
    public $controllerNamespace='admin\controllers';

    /**
     * Initialization method.
     * Sets import routes for module
     */
    protected function init(){
        parent::init();

        // Import the module-level models and components
        $this->setImport(array(
            'admin.api.*',
            'admin.components.*',
            'admin.controllers.*',
            'admin.models.*',
        ));
    }
} 