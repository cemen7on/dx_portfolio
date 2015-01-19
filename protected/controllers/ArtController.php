<?php
class ArtController extends CController{
    /**
     * Records per page limit
     */
    const RECORDS_LIMIT=9;

    /**
     * Default view's layout
     *
     * @var string
     */
    public $layout='art';

    /**
     * Default controller's action
     *
     * @var string
     */
    public $defaultAction='2d';

    /**
     * Default page title
     *
     * @var string
     */
    public $pageTitle='DiMaX Portfolio';

    /**
     * Aside nav menu class name
     *
     * @var null|string
     */
    public $asideClass=null;

    /**
     * Caption for aside nav menu
     *
     * @var string
     */
    public $asideCaption='';

    /**
     * Items list for aside nav menu
     *
     * @var array
     */
    public $asideItems=array();

    /**
     * CPagination object
     *
     * @var null|CPagination
     */
    public $pages=null;

    /**
     * Returns render in JSON format
     *
     * @param string $view. View path
     * @param array $data. Data for render
     */
    protected function renderJson($view, $data=array()){
        $aside=new AsideNavMenu();
        $aside->items=$data;

        REST::successResponse(array(
            'aside'=>$aside->render('aside_item', null, true),
            'preview'=>$this->renderPartial($view, array('works'=>$data), true)
        ));
    }

	/**
	 * Action for /art/animation request
	 * Displays animations
	 */
	public function actionAnimation(){
		$this->pageTitle.=' - animations';

        $vModel=new Videos();
        $criteria=new CDbCriteria();

        $this->pages=new CPagination($vModel->count());
        $this->pages->pageSize=self::RECORDS_LIMIT;
        $this->pages->applyLimit($criteria);

        $works=$vModel->findRecords($criteria);

        if(Yii::app()->request->isAjaxRequest){
            $this->renderJson('videos', $works);
        }
        else{
            $this->asideCaption=TopNavMenu::CAPTION_ANIMATION;
            $this->asideItems=$works;

            $this->render('videos', array('works'=>$works));
        }
	}

	/**
	 * Action for /art/2d request
	 * Displays 2d pictures
	 */
	public function action2d(){
		$this->pageTitle.=' - 2d pictures';

        $pModel=new Pictures();
        $criteria=new CDbCriteria();

        $this->pages=new CPagination($pModel->countAllByTypeId(PicturesType::PICTURES_2D));
        $this->pages->pageSize=self::RECORDS_LIMIT;
        $this->pages->applyLimit($criteria);

		$works=$pModel->findAllByTypeId(PicturesType::PICTURES_2D, $criteria);

        if(Yii::app()->request->isAjaxRequest){
            $this->renderJson('pictures', $works);
        }
        else{
            $this->asideCaption=TopNavMenu::CAPTION_PICTURES_2D;
            $this->asideItems=$works;

            $this->render('pictures', array('works'=>$works));
        }
	}

	/**
	 * Action for /art/3d request
	 * Displays 3d art
	 */
	public function action3d(){
		$this->pageTitle.=' - 3d art';

        $pModel=new Pictures();
        $criteria=new CDbCriteria();

        $this->pages=new CPagination($pModel->countAllByTypeId(PicturesType::ART_3D));
        $this->pages->pageSize=self::RECORDS_LIMIT;
        $this->pages->applyLimit($criteria);

        $works=$pModel->findAllByTypeId(PicturesType::ART_3D, $criteria);

        if(Yii::app()->request->isAjaxRequest){
            $this->renderJson('pictures', $works);
        }
        else{
            $this->asideCaption=TopNavMenu::CAPTION_ART_3D;
            $this->asideItems=$works;

            $this->render('pictures', array('works'=>$works));
        }
	}
}
