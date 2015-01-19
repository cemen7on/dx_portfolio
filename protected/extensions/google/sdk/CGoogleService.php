<?php
abstract class CGoogleService extends CApplicationComponent{
    /**
     * YouTube service sdk instance
     *
     * @var mixed
     */
    public $sdk=null;

    /**
     * Google SDK service class name
     */
    const SERVICE_CLASSNAME=null;

    /**
     * Initialization method
     * Initializes google client component
     */
    public function init(){
        Yii::app()->getComponent('google');

        $this->sdk=$this->getSdkInstance();

        parent::init();
    }

    /**
     * Returns service class instance
     *
     * @return mixed|object
     * @throws Exception
     */
    public function getSdkInstance(){
        if(is_null(static::SERVICE_CLASSNAME)){
            throw new Exception('Service class name can not be empty');
        }

        $reflection=new ReflectionClass(static::SERVICE_CLASSNAME);
        return $reflection->newInstanceArgs(array(Yii::app()->google->client));
    }
} 