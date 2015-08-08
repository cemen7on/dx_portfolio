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
     * Returns base criteria instance for compile request
     *
     * @return \CDbCriteria
     */
    private static function _createCompileCriteria(){
        $criteria=new \CDbCriteria();
        $criteria->order='facadeIndex ASC';
        $criteria->condition='facadeIndex IS NOT NULL';

        return $criteria;
    }

    /**
     * Compiles new facade object
     *
     * @return bool
     */
    public static function compile(){
        $facadeConfig=\Yii::app()->params['facade'];

        $videosModels=new Videos();
        $picturesModels=new Pictures();

        $criteria=self::_createCompileCriteria();
        $criteria->limit=$facadeConfig['animations']['count'];
        $videos=ActiveRecord::toArrayAll($videosModels->findRecords($criteria));

        $criteria=self::_createCompileCriteria();
        $criteria->limit=$facadeConfig['pictures2d']['count'];
        $pictures2d=ActiveRecord::toArrayAll($picturesModels->findAllByTypeId(PicturesType::PICTURES_2D, $criteria));

        $criteria=self::_createCompileCriteria();
        $criteria->limit=$facadeConfig['art3d']['count'];
        $art3d=ActiveRecord::toArrayAll($picturesModels->findAllByTypeId(PicturesType::ART_3D, $criteria));

        $response=array(
            'animations'=>Videos::format($videos),
            'pictures2d'=>Pictures::format($pictures2d),
            'art3d'=>Pictures::format($art3d)
        );

        return $response;
    }
} 