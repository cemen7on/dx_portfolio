<?php
require_once __DIR__.'/src/Client.php';

class Client extends CApplicationComponent{
    /**
     * App's client id
     *
     * @var string
     */
    public $clientId=null;

    /**
     * App's client secret
     *
     * @var string
     */
    public $clientSecret=null;

    /**
     * App's redirect url
     *
     * @var string
     */
    public $redirectUrl=null;

    /**
     * Google Client instance
     *
     * @var Client
     */
    private $_client=null;

    /**
     * $_client property getter method
     *
     * @return Client
     */
    public function getClient(){
        return $this->_client;
    }

    /**
     * Initialization method.
     * Sets client instance
     */
    public function init(){
        parent::init();

        $this->_client=new Google_Client();

        $this->_client->setClientId($this->clientId);
        $this->_client->setClientSecret($this->clientSecret);
        $this->_client->setAccessType('offline');
        $this->_client->setRedirectUri(Yii::app()->createAbsoluteUrl($this->redirectUrl));
    }
} 