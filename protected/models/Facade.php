<?php
namespace models;

class Facade extends ActiveRecord{
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
        return 'Facade';
    }

    /**
     * Returns facade data
     *
     * @return array
     */
    public static function retrieve(){
        $record=self::model()->find();

        if(!empty($record)){
            return json_decode($record['data'], true);
        }

        return array();
    }
} 