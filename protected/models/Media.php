<?php
namespace models;

abstract class Media extends ActiveRecord{
    /**
     * Returns models' relations list
     *
     * @return array
     */
    public function relations(){
        return array(
            'smallThumb'=>array(self::BELONGS_TO, 'models\Images', array('smallThumbId'=>'id')),
            'bigThumb'=>array(self::BELONGS_TO, 'models\Images', array('bigThumbId'=>'id')),
            'cover'=>array(self::BELONGS_TO, 'models\Images', array('coverId'=>'id'))
        );
    }

    /**
     * Formats media record
     *
     * @param array $records. Records to format
     * @return mixed
     */
    public static function format(&$records){
        // If array in indexed
        if(isset($records[0])){
            foreach($records as &$record){
                self::_format($record);
            }
        }
        else{
            self::_format($records);
        }

        return $records;
    }

    /**
     * Formats record
     *
     * @param array $record. Record to to format
     * @return mixed
     */
    private static function _format(&$record){
        $relations=array('src', 'smallThumb', 'bigThumb', 'cover');
        $methods=array(
            'src'=>'source',
            'smallThumb'=>'smallThumb',
            'bigThumb'=>'bigThumb',
            'cover'=>'cover'
        );

        foreach($relations as $relation){
            if(empty($record[$relation])){
                continue;
            }

            $methodName='create'.ucfirst($methods[$relation]).'Url';
            $record[$relation]['url']=static::$methodName($record[$relation]['name']);
        }

        return $record;
    }

    /**
     * Upload directory name
     */
    const UPLOAD_DIRECTORY='upload';

    /**
     * Media upload directory
     */
    const MEDIA_DIRECTORY='media';

    /**
     * Small thumbs directory name
     */
    const SMALL_THUMBS_DIRECTORY='smallThumbs';

    /**
     * Big thumbs directory name
     */
    const BIG_THUMBS_DIRECTORY='bigThumbs';

    /**
     * Cover directory name
     */
    const COVERS_DIRECTORY='covers';

    /**
     * Returns path string with given delimiter
     *
     * @return string
     * @throws \Exception
     */
    protected static function toString(){
        $arguments=func_get_args();
        $delimiter=array_shift($arguments);

        // Add 2 base directories
        array_unshift($arguments, static::MEDIA_DIRECTORY);
        array_unshift($arguments, static::UPLOAD_DIRECTORY);

        return implode($delimiter, $arguments);
    }

    /**
     * Returns root upload url
     *
     * @param string $directory. Directory name
     * @param string $filename. File name
     * @param bool $isAbsolute. Whether return absolute or relative url
     * @return string
     */
    protected static function createUrl($directory, $filename, $isAbsolute=true){
        $url=self::toString(US, $directory, $filename);

        return $isAbsolute
            ? \Yii::app()->createAbsoluteUrl($url)
            : $url;
    }

    /**
     * Returns upload small thumb url
     *
     * @param string $filename. File's name create url for
     * @param bool $isAbsolute. Whether return absolute or relative url
     * @return mixed
     */
    public static function createSmallThumbUrl($filename, $isAbsolute=true){
        return self::createUrl(self::SMALL_THUMBS_DIRECTORY, $filename, $isAbsolute);
    }

    /**
     * Returns upload big thumb url
     *
     * @param string $filename. File's name create url for
     * @param bool $isAbsolute. Whether return absolute or relative url
     * @return mixed
     */
    public static function createBigThumbUrl($filename, $isAbsolute=true){
        return self::createUrl(self::BIG_THUMBS_DIRECTORY, $filename, $isAbsolute);
    }

    /**
     * Returns upload cover url
     *
     * @param string $filename. File's name create url for
     * @param bool $isAbsolute. Whether return absolute or relative url
     * @return string
     */
    public static function createCoverUrl($filename, $isAbsolute=true){
        return self::createUrl(self::COVERS_DIRECTORY, $filename, $isAbsolute);
    }

    /**
     * Creates root file path
     *
     * @param string $directory. Directory name
     * @param string $filename. File name
     * @return string
     */
    protected static function createPath($directory, $filename){
        $path=self::toString(DS, $directory, $filename);

        return \Yii::getPathOfAlias('webroot').DS.$path;
    }

    /**
     * Returns upload small thumb path
     *
     * @param string $filename. File name
     * @return string
     */
    public static function createSmallThumbPath($filename){
        return self::createPath(self::SMALL_THUMBS_DIRECTORY, $filename);
    }

    /**
     * Returns upload big thumb path
     *
     * @param string $filename. File name
     * @return string
     */
    public static function createBigThumbPath($filename){
        return self::createPath(self::BIG_THUMBS_DIRECTORY, $filename);
    }

    /**
     * Returns upload cover path
     *
     * @param string $filename. File name
     * @return string
     */
    public static function createCoverPath($filename){
        return self::createPath(self::COVERS_DIRECTORY, $filename);
    }
} 