<?php
namespace components;

class CPictures extends CUpload{
    /**
     * Upload directory name for pictures
     */
    const UPLOAD_DIRECTORY='pictures';

    /**
     * Upload src directory
     */
    const SRC_DIR_DIRECTORY='src';

    /**
     * Returns upload src url
     *
     * @param string $filename. File's name create url for
     * @param bool $isAbsolute. Whether return absolute or relative url
     * @return mixed
     */
    public static function createSrcUrl($filename, $isAbsolute=true){
        return self::createUrl(self::SRC_DIR_DIRECTORY, $filename, $isAbsolute);
    }

    /**
     * Returns upload src path
     *
     * @param string $filename. File name
     * @return string
     */
    public static function createSrcPath($filename){
        return self::createPath(self::SRC_DIR_DIRECTORY, $filename);
    }
}
