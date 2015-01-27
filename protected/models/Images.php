<?php
class Images extends ActiveRecord{
    /**
     * Small thumb's width
     */
    const SMALL_THUMB_WIDTH=300;

    /**
     * Small thumb's height
     */
    const SMALL_THUMB_HEIGHT=210;

    /**
     * Big thumb's max width
     */
    const BIG_THUMB_MAX_WIDTH=1280;

    /**
     * Big thumb's max height
     */
    const BIG_THUMB_MAX_HEIGHT=1024;

    /**
     * Cover's image width
     */
    const COVER_WIDTH=170;

    /**
     * Returns model's instance
     *
     * @param string $className. Model's class name
     * @return Images|CActiveRecord
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
        return 'images';
    }

    /**
     * Validation rules list
     *
     * @return array
     */
    public function rules(){
        return array(
            array('name, width, height', 'required')
        );
    }

    /**
     * Saves SRC image
     *
     * @param string $destination. Picture destination path
     * @return int
     * @throws Exception
     */
    public function saveSrc($destination){
        $fileName=basename($destination);
        if(empty($fileName)){
            throw new Exception('Failed to fetch file name from destination path');
        }

        $size=getimagesize($destination);
        return $this->create($fileName, $size[0], $size[1]);
    }

    /**
     * Created small thumb image from source path and saved it in destination path
     *
     * @param string $source. Picture source path
     * @param string $destination. Picture destination path
     * @return mixed
     * @throws Exception
     */
    public function saveSmallThumb($source, $destination){
        $size=getimagesize($source);
        $width=$size[0];
        $height=$size[1];

        if($width<=($height+self::SMALL_THUMB_WIDTH) && $width>self::SMALL_THUMB_WIDTH){
            $ratio=self::SMALL_THUMB_WIDTH/$width;
            $width=self::SMALL_THUMB_WIDTH;
            $height=$height*$ratio;
        }
        elseif($height<$width && $height>self::SMALL_THUMB_HEIGHT){
            $ratio=self::SMALL_THUMB_HEIGHT/$height;
            $width=$width*$ratio;
            $height=self::SMALL_THUMB_HEIGHT;
        }

        $image=Yii::app()->image->load($source);

        if($width!=$size[0] || $height!=$size[1]){
            $image->resize($width, $height);
            $image->crop(self::SMALL_THUMB_WIDTH, self::SMALL_THUMB_HEIGHT);
        }

        $image->save($destination);

        $fileName=basename($destination);
        if(empty($fileName)){
            throw new Exception('Failed to fetch file name from destination path');
        }

        return $this->create($fileName, self::SMALL_THUMB_WIDTH, self::SMALL_THUMB_HEIGHT);
    }

    /**
     * Created big thumb image from source path and saved it in destination path
     *
     * @param string $source. Picture source path
     * @param string $destination. Picture destination path
     * @return mixed
     * @throws Exception
     */
    public function saveBigThumb($source, $destination){
        $size=getimagesize($source);
        $width=$size[0];
        $height=$size[1];

        if($width>self::BIG_THUMB_MAX_WIDTH){
            $ratio=self::BIG_THUMB_MAX_WIDTH/$width;
            $width=$width*$ratio;
            $height=$height*$ratio;
        }

        if($height>self::BIG_THUMB_MAX_HEIGHT){
            $ratio=self::BIG_THUMB_MAX_HEIGHT/$height;
            $width=$width*$ratio;
            $height=$height*$ratio;
        }

        $image=Yii::app()->image->load($source);

        if($width!=$size[0] || $height!=$size[1]){
            $image->resize($width, $height);
        }

        $fileName=basename($destination);
        if(empty($fileName)){
            throw new Exception('Failed to fetch file name from destination path');
        }

        $image->save($destination);

        return $this->create($fileName, $width, $height);
    }

    /**
     * Crops cover image from source and saves it
     *
     * @param string $source. Picture source path
     * @param string $destination. Picture destination path
     * @param int|string $left. Left start crop coordinate in px
     * @return mixed
     * @throws Exception
     */
    public function cropCover($source, $destination, $left='center'){
        $size=getimagesize($source);
        $height=$size[1]; // full height

        if(is_numeric($left)){
            $left=floor($left);
        }

        $image=Yii::app()->image->load($source);
        $image->crop(self::COVER_WIDTH, $height, 0, $left);

        $fileName=basename($destination);
        if(empty($fileName)){
            throw new Exception('Failed to fetch file name from destination path');
        }

        $image->save($destination);

        return $this->create($fileName, self::COVER_WIDTH, $height);
    }

    /**
     * Creates new record
     *
     * @param string $name. Image's name
     * @param int $width. Image's width
     * @param int $height. Image's height
     * @return mixed
     * @throws Exception
     */
    public function create($name, $width, $height){
        $this->setAttributes(array(
            'id'=>null,
            'name'=>$name,
            'width'=>$width,
            'height'=>$height
        ), false);


        if(!$this->save()){
            throw new Exception('Failed to create record');
        }

        $this->setIsNewRecord(true);

        return $this->id;
    }

    /**
     * Removes current image record.
     * Removes file
     *
     * @param string $imagePath. Image path
     * @return bool
     * @throws Exception
     */
    public function remove($imagePath){
        $this->delete();
        @unlink($imagePath);

        return true;
    }
} 