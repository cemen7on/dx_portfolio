<?php
namespace components;

class CVideos extends CUpload{
    /**
     * Upload directory name for videos
     */
    const UPLOAD_DIRECTORY='videos';

    /**
     * Temporary upload directory
     */
    const TMP_DIRECTORY='tmp';

    /**
     * Returns upload tmp path
     *
     * @param string $filename. File name
     * @return string
     */
    public static function createTmpPath($filename){
        return self::createPath(self::TMP_DIRECTORY, $filename);
    }
}
