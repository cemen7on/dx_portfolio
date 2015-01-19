<?php
class Pagination extends CWidget{
    /**
     * Pagination component
     *
     * @var CPagination
     */
    public $pages;

    /**
     * Run method
     */
    public function run(){
        $this->render('pagination');
    }
} 