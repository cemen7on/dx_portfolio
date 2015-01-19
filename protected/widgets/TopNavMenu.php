<?php
class TopNavMenu extends CWidget{
    /**
     * Animation section caption
     */
    const CAPTION_ANIMATION='Animation';

    /**
     * Animation section uri
     */
    const URI_ANIMATION='/art/animation';

    /**
     * Animation section options
     *
     * @var array
     */
    public $animation=array();

    /**
     * 2d pictures section caption
     */
    const CAPTION_PICTURES_2D='2D Pictures';

    /**
     * 2d pictures section uri
     */
    const URI_PICTURES_2D='/art/2d';

    /**
     * 2d pictures section options
     *
     * @var array
     */
    public $pictures2d=array();

    /**
     * 3d art section caption
     *
     * @var array
     */
    const CAPTION_ART_3D='3D Art';

    /**
     * 3d art section uri
     *
     * @var array
     */
    const URI_ART_3D='/art/3d';

    /**
     * 3d art section options
     *
     * @var array
     */
    public $art3d=array();

	/**
	 * htmlAttributes for <nav> elements
	 *
	 * @var array
	 */
	public $htmlOptions=array();

	/**
	 * Widget's run method
	 */
	public function run(){
        $sections=array(
            array_merge(array(
                'uri'=>self::URI_ANIMATION,
                'caption'=>self::CAPTION_ANIMATION
            ), $this->animation),
            array_merge(array(
                'uri'=>self::URI_PICTURES_2D,
                'caption'=>self::CAPTION_PICTURES_2D
            ), $this->pictures2d),
            array_merge(array(
                'uri'=>self::URI_ART_3D,
                'caption'=>self::CAPTION_ART_3D
            ), $this->art3d)
        );

		$this->render('top', array('sections'=>$sections));
	}

	/**
	 * Serializes htmlOptions array into string
	 *
	 * @param $options
	 * @return string
	 */
	public function serializeHtmlOptions($options){
		$attributes=array();

		foreach($options as $attributeName=>$attributeValue){
			$attributes[]="{$attributeName}=\"$attributeValue\"";
		}

		return implode(' ', $attributes);
	}
}