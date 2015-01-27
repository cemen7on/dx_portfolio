<?php
class PicturesType extends ActiveRecord{
    /**
     * Id of "2d Picture" type
     */
    const PICTURES_2D=1;

    /**
     * Id of "3d Art" type
     */
    const ART_3D=2;

    /**
     * Returns model's instance
     *
     * @param string $className
     * @return PicturesType|CActiveRecord
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
        return 'pictures_type';
    }

    /**
     * Returns all types array indexed by pk
     *
     * @return array
     */
    public function findAllIndexByPk(){
        $response=array();
        foreach($this->findAll() as $type){
            $response[$type->id]=$type->caption;
        }

        return $response;
    }
} 