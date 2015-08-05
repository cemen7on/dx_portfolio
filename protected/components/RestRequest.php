<?php
namespace components;

use exceptions;

class RestRequest extends HttpRequest{
    /**
     * OVERWRITTEN. Returns exception instance
     *
     * @param string $message. Exception message
     * @param int $code. Exception code
     * @return exceptions\Rest
     */
    protected function getException($message, $code=0){
        return new exceptions\Rest($message, $code);
    }
} 