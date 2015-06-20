<?php
namespace components;

class HttpRequest extends \CHttpRequest{
    /**
     * Returns exception instance
     *
     * @param string $message. Exception message
     * @param int $code. Exception code
     * @return \RestException
     */
    protected function getException($message, $code=0){
        return new \Exception($message, $code);
    }

    /**
     * Returns $_REQUEST value specified by $key. If was not found - returns $default
     *
     * @param $key
     * @param null $default
     * @return mixed|null
     */
    public function getParam($key, $default=null){
        $get=$this->getQuery($key);
        $post=$this->getPost($key);

        return isset($get)?$get:isset($post)?$post:$default;
    }

    /**
     * Returns $_REQUEST value specified by $key if was found.
     *
     * @param $key
     * @return mixed
     * @throws \Exception
     */
    public function requireParam($key){
        $value=$this->getParam($key);
        if(is_null($value)){
            throw $this->getException('Parameter REQUEST['.$key.'] was not received', 400);
        }

        return $value;
    }

    /**
     * Returns $_GET value specified by $key if was found.
     *
     * @param $key
     * @return mixed
     * @throws \Exception
     */
    public function requireQuery($key){
        $value=$this->getQuery($key);
        if(is_null($value)){
            throw $this->getException('Parameter GET['.$key.'] was not received', 400);
        }

        return $value;
    }

    /**
     * Returns $_POST value specified by $key if was found.
     *
     * @param $key
     * @return mixed
     * @throws \Exception
     */
    public function requirePost($key){
        $value=$this->getPost($key);
        if(is_null($value)){
            throw $this->getException('Parameter POST['.$key.'] was not received', 400);
        }

        return $value;
    }

    /**
     * Returns $_PUT value specified by $key if was found.
     *
     * @param $key
     * @return mixed
     * @throws \Exception
     */
    public function requirePut($key){
        $value=$this->getPut($key);
        if(is_null($value)){
            throw $this->getException('Parameter PUT['.$key.'] was not received', 400);
        }

        return $value;
    }

    /**
     * Returns $_DELETE value specified by $key if was found.
     *
     * @param $key
     * @return mixed
     * @throws \Exception
     */
    public function requireDelete($key){
        $value=$this->getDelete($key);
        if(is_null($value)){
            throw $this->getException('Parameter DELETE['.$key.'] was not received', 400);
        }

        return $value;
    }
} 