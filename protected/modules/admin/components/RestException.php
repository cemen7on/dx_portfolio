<?php
class RestException extends Exception{
    /**
     * Class constructor
     *
     * @param string $message
     * @param int $code
     */
    public function __construct($message='', $code=0){
        REST::errorResponse($message, $code);
    }
} 