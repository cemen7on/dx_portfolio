<?php
namespace components;

class RestRequest extends HttpRequest{
    /**
     * OVERWRITTEN. Returns exception instance
     *
     * @param string $message. Exception message
     * @param int $code. Exception code
     * @return RestException
     */
    protected function getException($message, $code=0){
        return new RestException($message, $code);
    }
} 