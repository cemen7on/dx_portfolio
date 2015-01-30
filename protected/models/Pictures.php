<?php
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
                    'name'=>'creation_date',
                    'caption'=>'Created',
                    'formatter'=>function($date){
                        return date('d F Y H:i', strtotime($date));
                    }
                ),
                array(
                    'index'=>2,
                    'name'=>'type_id',
                    'caption'=>'Type',
                    'formatter'=>function($typeId){
                        return CHtml::dropDownList('type_id', $typeId, PicturesType::model()->findAllIndexByPk(), array('class'=>'dropdown-type'));
                    }
                ),
                array('index'=>3, 'name'=>'title', 'caption'=>'Title'),
                array('index'=>4, 'name'=>'description', 'caption'=>'Description'),
                array(
                    'index'=>5,
                    'name'=>'thumb_small',
                    'caption'=>'Preview',
                    'formatter'=>function($thumbIndex, $data){
                            $smallThumb=isset($data->thumbSmall->name)?$data->thumbSmall->name:'';
                            $bigThumb=isset($data->thumbBig->name)?$data->thumbBig->name:'';

                        return CHtml::image(CPictures::createSmallThumbUrl($smallThumb), '', array('data-big-thumb'=>$bigThumb));
                    }
                ),
                array(
                    'index'=>6,
                    'name'=>'cover',
                    'caption'=>'Cover',
                    'formatter'=>function($thumbIndex, $data){
                        $html=null;
                        if(isset($data->imageCover->name)){
                            $html=Html::cover(CPictures::createCoverUrl($data->imageCover->name));
                        }

                        return $html;
                    }
                ),
                array(
                    'index'=>7,
                    'name'=>'cover_order',
                    'caption'=>'Display on start',
                    'formatter'=>function($order, $data){
                        $key=$data->type_id==PicturesType::PICTURES_2D
                            ? 'pictures2d'
                            : 'art3d';

                        return Html::coverOrder($order, Yii::app()->params['covers'][$key]['count']);
                    }
                ),
                array(
                    'index'=>8,
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
            'imageSrc'=>array(self::BELONGS_TO, 'Images', array('src'=>'id')),
            'thumbSmall'=>array(self::BELONGS_TO, 'Images', array('thumb_small'=>'id')),
            'thumbBig'=>array(self::BELONGS_TO, 'Images', array('thumb_big'=>'id')),
            'imageCover'=>array(self::BELONGS_TO, 'Images', array('cover'=>'id')),
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

        $criteria->with=array('thumbSmall', 'thumbBig', 'imageCover');
        $criteria->condition='type_id=:type_id';
        $criteria->params=array('type_id'=>$typeId);

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
