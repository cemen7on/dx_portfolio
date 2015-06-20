<?php
namespace models;

use components;

class Pictures extends ActiveRecord{
    /**
     * Columns description. Is used for building dataTables requests
     *
     * @var array
     */
    private static $_DT_COLUMNS=array();

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
                    'name'=>'smallThumb',
                    'caption'=>'Preview',
                    'formatter'=>function($thumbIndex, $data){
                        $smallThumb=isset($data->smallThumb->name)?$data->smallThumb->name:'';
                        $bigThumb=isset($data->bigThumb->name)?$data->bigThumb->name:'';

                        return \CHtml::image(components\CPictures::createSmallThumbUrl($smallThumb), '', array('data-big-thumb'=>$bigThumb));
                    }
                ),
                array(
                    'index'=>6,
                    'name'=>'cover',
                    'caption'=>'Cover',
                    'formatter'=>function($thumbIndex, $data){
                        $html=null;
                        if(isset($data->cover->name)){
                            $html=\Html::cover(components\CPictures::createCoverUrl($data->cover->name));
                        }

                        return $html;
                    }
                ),
                array(
                    'index'=>7,
                    'name'=>'cover_order',
                    'caption'=>'Display on start',
                    'formatter'=>function($order, $data){
                        $key=$data->typeId==PicturesType::PICTURES_2D
                            ? 'pictures2d'
                            : 'art3d';

                        return \Html::coverOrder($order, \Yii::app()->params['covers'][$key]['count']);
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
	 * @param string $className
	 * @return Pictures
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
     * Validation rules list
     *
     * @return array
     */
    public function rules(){
        return array(
            array('typeId, title', 'required', 'on'=>'input'),
            array('description', 'safe', 'on'=>'input'),
            array('created', 'required', 'on'=>'create'),
            array('description, bigThumb', 'safe', 'on'=>'create'),
            array('src', 'file', 'types'=>'jpg, jpeg, gif, png', 'maxSize'=>1024*1024*100),
            array('cover', 'file', 'allowEmpty'=>true, 'types'=>'jpg, jpeg, gif, png', 'maxSize'=>1024*1024*100),
            array('cover', 'safe')
        );
    }

    /**
     * Model's relations list
     *
     * @return array
     */
    public function relations(){
        return array(
            'data'=>array(
                self::BELONGS_TO,
                'models\Media',
                array('mediaId'=>'id'),
                'with'=>array('src', 'smallThumb', 'bigThumb', 'cover')
            )
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

        $relations=array('data');

        $criteria->with=$relations;
        $criteria->condition='typeId=:typeId';
        $criteria->params=array('typeId'=>$typeId);

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
}
