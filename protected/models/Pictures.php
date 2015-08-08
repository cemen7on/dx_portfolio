<?php
namespace models;

use components;

class Pictures extends Media{
    /**
     * Sources directory name
     */
    const SOURCES_DIRECTORY='sources';

    /**
     * Source picture path
     *
     * @var null|string
     */
    public $src=null;

    /**
     * Columns description. Is used for building dataTables requests
     *
     * @var array
     */
    private static $_DT_COLUMNS=array();

    /**
     * Returns model's instance
     *
     * @param string $className. Model's class name
     * @return Pictures|ActiveRecord
     */
    public static function model($className=__CLASS__){
        return parent::model($className);
    }

    /**
     * Returns model's table name
     *
     * @return string
     */
    public function tableName(){
        return 'Pictures';
    }

    /**
     * Returns models' relations list
     *
     * @return array
     */
    public function relations(){
        $relations=parent::relations();
        $relations['source']=array(self::BELONGS_TO, 'models\Images', array('srcId'=>'id'));

        return $relations;
    }

    /**
     * Returns dataTables columns configuration
     *
     * @return array
     */
    public static function DT_COLUMNS(){
        if(empty(self::$_DT_COLUMNS)){
            self::$_DT_COLUMNS=array(
                array('index'=>0, 'name'=>'id', 'alias'=>'t.id', 'caption'=>'Id'),
                array(
                    'index'=>1,
                    'name'=>'created',
                    'alias'=>'created',
                    'caption'=>'Created',
                    'formatter'=>function($date){
                        return date('d F Y H:i', strtotime($date));
                    }
                ),
                array(
                    'index'=>2,
                    'name'=>'typeId',
                    'caption'=>'Type',
                    'formatter'=>function($typeId){
                        return \CHtml::dropDownList('typeId', $typeId, PicturesType::model()->findAllIndexByPk(), array('class'=>'dropdown-type'));
                    }
                ),
                array('index'=>3, 'name'=>'title', 'caption'=>'Title'),
                array('index'=>4, 'name'=>'description', 'caption'=>'Description'),
                array(
                    'index'=>5,
                    'name'=>'smallThumbId',
                    'caption'=>'Preview',
                    'formatter'=>function($smallThumbId, $data){
                        return \CHtml::image(
                            self::createSmallThumbUrl($data['smallThumb']['name']),
                            '',
                            array('data-big-thumb'=>self::createBigThumbUrl($data['bigThumb']['name']))
                        );
                    }
                ),
                array(
                    'index'=>6,
                    'name'=>'coverId',
                    'caption'=>'Cover',
                    'formatter'=>function($coverId, $data){
                        return \CHtml::image(
                            self::createCoverUrl($data['cover']['name']),
                            '',
                            array('data-big-thumb'=>self::createBigThumbUrl($data['bigThumb']['name']))
                        );
                    }
                ),
                array(
                    'index'=>7,
                    'name'=>'facadeIndex',
                    'caption'=>'Display on start',
                    'formatter'=>function($order, $data){
                        $key=$data['typeId']==PicturesType::PICTURES_2D
                        ? 'pictures2d'
                        : 'art3d';

                        return \Html::facadeOrder($order, \Yii::app()->params['facade'][$key]['count']);
                    }
                ),
                array(
                    'index'=>8,
                    'name'=>'id',
                    'caption'=>'Delete',
                    'formatter'=>function($id){
                        return \CHtml::link('Remove', \Yii::app()->createAbsoluteUrl('/admin/pictures/'.$id), array('class'=>'remove-link'));
                    }
                )
            );
        }

        return self::$_DT_COLUMNS;
    }

    /**
     * Validation rules list
     *
     * @return array
     */
    public function rules(){
        return array(
            array('typeId, title', 'required', 'on'=>'input'),
            array('description', 'safe', 'on'=>'input'),
            array('created', 'required', 'on'=>'create'),
            array('description, bigThumbId', 'safe', 'on'=>'create'),
            array('src', 'file', 'types'=>'jpg, jpeg, gif, png', 'maxSize'=>1024*1024*100),
            array('cover', 'file', 'allowEmpty'=>true, 'types'=>'jpg, jpeg, gif, png', 'maxSize'=>1024*1024*100),
            array('cover', 'safe')
        );
    }

	/**
	 * Returns records number with specific type_id
	 *
	 * @param int $typeId. Picture type id
	 * @return int
	 */
	public function countAllByTypeId($typeId){
		return $this->count('typeId=:typeId', array('typeId'=>$typeId));
	}

    /**
     * Returns records with specific type_id by specific criteria
     *
     * @param int $typeId. Picture type id
     * @param \CDbCriteria $criteria. Query criteria
     * @return Pictures[]
     */
    public function findAllByTypeId($typeId, \CDbCriteria $criteria=null){
        if(is_null($criteria)){
            $criteria=new \CDbCriteria();
        }

        $criteria->with=array('source', 'smallThumb', 'bigThumb', 'cover');
        $criteria->addCondition("typeId={$typeId}");

        return $this->findAll($criteria);
    }

    /**
     * Saves record in db
     *
     * @return bool
     */
    public function create(){
        $this->setAttribute('created', new \CDbExpression('NOW()'));

        return $this->save();
    }

    /**
     * Returns upload src url
     *
     * @param string $filename. File's name create url for
     * @param bool $isAbsolute. Whether return absolute or relative url
     * @return mixed
     */
    public static function createSourceUrl($filename, $isAbsolute=true){
        return self::createUrl(self::SOURCES_DIRECTORY, $filename, $isAbsolute);
    }

    /**
     * Returns upload src path
     *
     * @param string $filename. File name
     * @return string
     */
    public static function createSourcePath($filename){
        return self::createPath(self::SOURCES_DIRECTORY, $filename);
    }
}
