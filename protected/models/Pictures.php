<?php
class Pictures extends CActiveRecord{
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
                    'name'=>'creation_date',
                    'caption'=>'Created',
                    'formatter'=>function($date){
                        return date('d F Y H:i', strtotime($date));
                    }
                ),
                array('index'=>2, 'name'=>'type_id', 'caption'=>'Type'),
                array('index'=>3, 'name'=>'title', 'caption'=>'Title'),
                array('index'=>4, 'name'=>'description', 'caption'=>'Description'),
                array(
                    'index'=>5,
                    'name'=>'thumb_small',
                    'caption'=>'Preview',
                    'formatter'=>function($thumbIndex, $data){
                        return CHtml::image(CPictures::createSmallThumbUrl($data->thumbSmall->name));
                    }
                ),
                array(
                    'index'=>6,
                    'name'=>'id',
                    'caption'=>'Delete',
                    'formatter'=>function($id){
                        return CHtml::link('Remove', Yii::app()->createAbsoluteUrl('/admin/pictures/'.$id), array('class'=>'remove-link'));
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
		return 'pictures';
	}

    /**
     * Validation rules list
     *
     * @return array
     */
    public function rules(){
        return array(
            array('type_id, title', 'required', 'on'=>'input'),
            array('description', 'safe', 'on'=>'input'),
            array('creation_date', 'required', 'on'=>'create'),
            array('description, thumb_big', 'safe', 'on'=>'create'),
            array('src', 'file', 'types'=>'jpg, jpeg, gif, png', 'maxSize'=>1024*1024*100)
        );
    }

    /**
     * Model's relations list
     *
     * @return array
     */
    public function relations(){
        return array(
            'src'=>array(self::BELONGS_TO, 'Images', array('src'=>'id')),
            'thumbSmall'=>array(self::BELONGS_TO, 'Images', array('thumb_small'=>'id')),
            'thumbBig'=>array(self::BELONGS_TO, 'Images', array('thumb_big'=>'id')),
        );
    }

	/**
	 * Returns records number with specific type_id
	 *
	 * @param int $typeId. Picture type id
	 * @return int
	 */
	public function countAllByTypeId($typeId){
		return $this->count('type_id=:type_id', array('type_id'=>$typeId));
	}

    /**
     * Returns records with specific type_id by specific criteria
     *
     * @param int $typeId. Picture type id
     * @param CDbCriteria $criteria. Query criteria
     * @return Pictures[]
     */
    public function findAllByTypeId($typeId, CDbCriteria $criteria=null){
        if(is_null($criteria)){
            $criteria=new CDbCriteria();
        }

        $criteria->with=array('src', 'thumbSmall', 'thumbBig');
        $criteria->condition='type_id=:type_id';
        $criteria->params=array('type_id'=>$typeId);
        $criteria->order='t.id DESC';

        return $this->findAll($criteria);
    }

    /**
     * Saves record in db
     *
     * @return bool
     */
    public function create(){
        $this->setAttribute('creation_date', new CDbExpression('NOW()'));

        return $this->save();
    }
}
