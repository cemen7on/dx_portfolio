<?php
namespace models;

class Media extends ActiveRecord{
    /**
     * Returns model's instance by it's class name
     *
     * @param string $className. Model's class name
     * @return static
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
        return 'Media';
    }

    /**
     * Returns models' relations list
     *
     * @return array
     */
    public function relations(){
        return array(
            'src'=>array(self::BELONGS_TO, 'models\Images', array('srcId'=>'id')),
            'smallThumb'=>array(self::BELONGS_TO, 'models\Images', array('smallThumbId'=>'id')),
            'bigThumb'=>array(self::BELONGS_TO, 'models\Images', array('bigThumbId'=>'id')),
            'cover'=>array(self::BELONGS_TO, 'models\Images', array('coverId'=>'id'))
        );
    }
} 