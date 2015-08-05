<?php
namespace components;

/**
 * Class for REST functionality.
 *
 * Class REST
 */
class REST{
    /**
     * Executes method and returns JSON-formatted response
     *
     * @param $object. Class instance
     * @param $method. Instance's method name
     * @param $args. Arguments passed to method
     */
    public static function execute($object, $method, $args=array()){
        try{
            if(!method_exists($object, $method)){
                throw new \Exception("Method {$method} was not found in passed object");
            }

            $response=call_user_func_array(array($object, $method), $args);

            self::response($response);
        }
        catch(\Exception $e){
            self::error($e);
        }
    }

    /**
     * Sends response
     *
     * @param {*} $data. Response data
     * @param int $status. HTTP status code
     */
    public static function response($data, $status=200){
        $response=new Response($status, array(), $data);

        $response->send();
    }

    /**
     * Success response formatted method
     *
     * @param {*} $data. Data to send
     */
    public static function success($data){
        self::response(array('success'=>$data));
    }

    /**
     * Error response formatted method
     */
    public static function error(){
        $first=func_get_arg(0);
        if($first instanceof \Exception){
            self::errorException($first);

            return ;
        }

        $arguments=func_get_args();
        $message=$arguments[0];
        $code=isset($arguments[1])?$arguments[1]:0;
        $type=isset($arguments[2])?$arguments[2]:null;

        self::errorArgumentsList($message, $code, $type);
    }

    /**
     * Error response formatted method which takes exception as argument
     *
     * @param \Exception $exception. Exception to parse
     */
    protected static function errorException($exception){
        $message=$exception->getMessage();
        $code=$exception->getCode();
        $type=get_class($exception);

        self::errorArgumentsList($message, $code, $type);
    }

    /**
     * Error response formatted method which takes arguments list
     *
     * @param string $message. Error message
     * @param int $code. Error code
     * @param null $type. Error type
     */
    protected static function errorArgumentsList($message, $code=0, $type=null){
        $response=array(
            'error'=>array(
                'message'=>$message
            )
        );

        if(!empty($code)){
            $response['error']['code']=$code;
        }

        if(!empty($type)){
            $response['error']['type']=$type;
        }

        self::response($response);
    }
}

class Response{
    /**
     * Status code list
     *
     * @var array
     */
    public static $STATUS_CODES=array(
        200=>'OK',
        400=>'Bad Request',
        401=>'Unauthorized',
        402=>'Payment Required',
        403=>'Forbidden',
        404=>'Not Found',
        500=>'Internal Server Error',
        501=>'Not Implemented',
    );

    /**
     * Response status code
     *
     * @var int
     */
    private $_statusCode;

    /**
     * Response status message
     *
     * @var string
     */
    private $_statusMessage;
    /**
     * Response headers
     *
     * @var array
     */
    private $_headers=array();

    /**
     * Response body
     *
     * @var string
     */
    private $_body='';

    /**
     * Response type
     *
     * @var string
     */
    private $_type;

    public function __construct($status=200, $headers=array(), $body='', $type=HTTPContentType::JSON){
        if(isset($status)){
            $this->setStatus($status);
        }

        if(!empty($headers)){
            $this->setHeaders($headers);
        }

        $this->setBody($body);

        if(isset($type)){
            $this->setType($type);
        }
    }

    /**
     * Sets response status code
     *
     * @param $status
     * @return $this
     * @throws \Exception
     */
    public function setStatus($status){
        if(!is_numeric($status)){
            throw new \Exception('Invalid argument type: $status must be a numeric value');
        }

        $this->_statusCode=$status;

        $this->_statusMessage=isset(self::$STATUS_CODES[$this->_statusCode])
            ? self::$STATUS_CODES[$this->_statusCode]
            : '';

        return $this;
    }

    /**
     * Returns response status code
     *
     * @return int
     */
    public function getStatusCode(){ return $this->_statusCode; }

    /**
     * Returns response status message
     *
     * @return string
     */
    public function getStatusMessage(){ return $this->_statusMessage; }

    /**
     * Sets response headers
     *
     * @param array $headers
     */
    public function setHeaders(array $headers=array()){
        $this->_headers=$headers;
    }

    /**
     * Returns response headers
     *
     * @return array
     */
    public function getHeaders(){ return $this->_headers; }

    /**
     * Sets response body
     *
     * @param string $body
     */
    public function setBody($body=''){
        $this->_body=$body;
    }

    /**
     * Returns response body
     *
     * @return string
     */
    public function getBody(){ return $this->_body; }

    /**
     * Sets response type
     *
     * @param $type
     * @throws \Exception
     */
    public function setType($type){
        if(!is_string($type)){
            throw new \Exception('Invalid argument type: $type must be a string');
        }

        $this->_type=$type;
    }

    /**
     * Returns response type
     *
     * @return string
     */
    public function getType(){ return $this->_type; }

    /**
     * Send HTTP response
     */
    public function send(){
        $headers=array_merge(
            array(
                "HTTP/1.1 {$this->getStatusCode()} {$this->getStatusMessage()}",
                "Content-Type: {$this->getType()}; charset=utf-8"
            ),
            $this->_headers
        );

        $body=$this->getType()==HTTPContentType::JSON
            ? \CJSON::encode($this->getBody())
            : $this->getBody();

        header(implode(' ', $headers));

        // Handle special cases
        $body===true?$body='true':null;
        $body===false?$body='false':null;
        $body===null?$body='null':null;

        echo $body;

        \Yii::app()->end();
    }
}

/**
 * Contains http content types strings
 *
 * Class HTTPContentType
 * @package social\components
 */
class HTTPContentType{
    const TEXT='text/plain';
    const HTML='text/html';
    const JSON='application/json';
}