<?php
class Pictures extends CActiveRecord{
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
            array('type_id, title', 'required'),
            array('src', 'file', 'types'=>'jpg, jpeg, gif, png', 'maxSize'=>1024*1024*100),
            array('description, thumb_big', 'safe')
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
}
