<?php
class Videos extends CActiveRecord{
    /**
     * YouTube video link
     *
     * @var null|string
     */
    public $link=null;

	/**
	 * @param string $className
	 * @return Videos
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
		return 'videos';
	}

    /**
     * Validation rules
     *
     * @return array
     */
    public function rules(){
        return array(
            array('link', 'required', 'on'=>'input'),
            array('youtube_id, title', 'required', 'on'=>'create'),
            array('description', 'safe', 'on'=>'create')
        );
    }

    /**
     * Model's relations list
     *
     * @return array
     */
    public function relations(){
        return array(
            'thumbSmall'=>array(self::BELONGS_TO, 'Images', array('thumb_small'=>'id')),
            'thumbBig'=>array(self::BELONGS_TO, 'Images', array('thumb_big'=>'id')),
        );
    }

	/**
	 * Returns records
	 *
	 * @param null|CDbCriteria $criteria. Query criteria
	 * @return Videos[]
	 */
	public function findRecords(CDbCriteria $criteria=null){
		if(is_null($criteria)){
            $criteria=new CDbCriteria();
        }

		$criteria->order='t.id DESC';
        $criteria->with=array('thumbSmall', 'thumbBig');

		return $this->findAll($criteria);
	}

    /**
     * Returns id from YouTube video link
     *
     * @return null|string
     */
    public function getIdFromLink(){
        if(empty($this->link)){
            return null;
        }

        $template='/^(?:http[s]?:\/\/)?(?:www.)?youtube.com\/watch\?v=([\w-]{11}).*$/';

        preg_match($template, $this->link, $result);

        return isset($result[1])?$result[1]:null;
    }

    /**
     * Creates video record
     *
     * @param string $videoId. YouTube video id
     * @param string $title. YouTube video title
     * @param string|null $description. YouTube video description
     * @return bool
     * @throws Exception
     */
    public function create($videoId, $title, $description){
        $this->setAttributes(array(
            'youtube_id'=>$videoId,
            'title'=>$title,
            'description'=>$description
        ));

        if(!$this->save()){
            throw new Exception('Failed to create record');
        }

        return $this->id;
    }
}
