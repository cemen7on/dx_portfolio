<?php
class ApiException extends Exception{
    /**
     * Api error data
     *
     * @var array
     */
    protected $data=null;

    /**
     * Class constructor
     *
     * @param string $message. Exception message
     * @param array $data. Exception data
     * @param int $code. Exception code
     */
    public function __construct($message='', $data=null, $code=0){
        parent::__construct($message, $code);

        $this->data=$data;
    }

    /**
     * Returns api error data
     *
     * @return array
     */
    public function getData(){
        return $this->data;
    }
} 