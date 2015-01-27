<?php
class CUpload extends CComponent{
    /**
     * Upload root directory name
     */
    const ROOT_DIRECTORY='upload';

    /**
     * Upload thumb small directory name
     */
    const THUMB_SMALL_DIRECTORY='thumb_small';


    /**
     * Upload thumb big directory name
     */
    const THUMB_BIG_DIRECTORY='thumb_big';

    /**
     * Upload cover directory name
     */
    const COVER_DIRECTORY='cover';

    /**
     * Upload directory name
     */
    const UPLOAD_DIRECTORY=null;

    /**
     * Returns path string with given delimiter
     *
     * @return string
     * @throws Exception
     */
    protected static function toString(){
        $arguments=func_get_args();
        $delimiter=array_shift($arguments);

        if(is_null(static::UPLOAD_DIRECTORY)){
            throw new Exception('Upload directory must be defined');
        }

        // Add 2 base directories
        array_unshift($arguments, static::UPLOAD_DIRECTORY);
        array_unshift($arguments, static::ROOT_DIRECTORY);

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
               ? Yii::app()->createAbsoluteUrl($url)
               : $url;
	}

    /**
     * Returns upload big thumb url
     *
     * @param string $filename. File's name create url for
     * @param bool $isAbsolute. Whether return absolute or relative url
     * @return mixed
     */
    public static function createBigThumbUrl($filename, $isAbsolute=true){
        return self::createUrl(self::THUMB_BIG_DIRECTORY, $filename, $isAbsolute);
    }

    /**
     * Returns upload small thumb url
     *
     * @param string $filename. File's name create url for
     * @param bool $isAbsolute. Whether return absolute or relative url
     * @return mixed
     */
    public static function createSmallThumbUrl($filename, $isAbsolute=true){
        return self::createUrl(self::THUMB_SMALL_DIRECTORY, $filename, $isAbsolute);
    }

    /**
     * Returns upload cover url
     *
     * @param string $filename. File's name create url for
     * @param bool $isAbsolute. Whether return absolute or relative url
     * @return string
     */
    public static function createCoverUrl($filename, $isAbsolute=true){
        return self::createUrl(self::COVER_DIRECTORY, $filename, $isAbsolute);
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

        return Yii::getPathOfAlias('webroot').DS.$path;
    }

    /**
     * Returns upload big thumb path
     *
     * @param string $filename. File name
     * @return string
     */
    public static function createBigThumbPath($filename){
        return self::createPath(self::THUMB_BIG_DIRECTORY, $filename);
    }

    /**
     * Returns upload small thumb path
     *
     * @param string $filename. File name
     * @return string
     */
    public static function createSmallThumbPath($filename){
        return self::createPath(self::THUMB_SMALL_DIRECTORY, $filename);
    }

    /**
     * Returns upload cover path
     *
     * @param string $filename. File name
     * @return string
     */
    public static function createCoverPath($filename){
        return self::createPath(self::COVER_DIRECTORY, $filename);
    }
}
