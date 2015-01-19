<?php
class AsideNavMenu extends CWidget{
    /**
     * Instance's caption
     *
     * @var string
     */
    public $caption='Side Bar Menu';

    /**
     * Instance's items array
     *
     * @var array
     */
    public $items=array();

    /**
     * Widget run method
     */
    public function run(){
        $this->render('aside');
	}
}
