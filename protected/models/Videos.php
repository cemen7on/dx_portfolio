<?php
namespace models;

class Videos extends ActiveRecord{
    /**
     * YouTube video link
     *
     * @var null|string
     */
    public $link=null;

    /**
     * Columns description. Is used for building dataTables requests
     *
     * @var array
     */
    private static $_DT_COLUMNS=array();

    /**
     * Returns dataTables columns configuration
     *
     * @return array
     */
    public static function DT_COLUMNS(){
        if(empty(self::$_DT_COLUMNS)){
            self::$_DT_COLUMNS=array(
                array('index'=>0, 'name'=>'id', 'alias'=>'t.id', 'caption'=>'Id'),
                array(
                    'index'=>1,
                    'name'=>'creation_date',
                    'caption'=>'Created',
                    'formatter'=>function($date){
                        return date('d F Y H:i', strtotime($date));
                    }
                ),
                array(
                    'index'=>2,
                    'name'=>'youtube_id',
                    'caption'=>'Link',
                    'formatter'=>function($youtubeId){
                        $link='https://youtube.com/watch?v='.$youtubeId;

                        return CHtml::link($link, $link, array('target'=>'_blank'));
                    }
                ),
                array('index'=>3, 'name'=>'title', 'caption'=>'Title'),
                array('index'=>4, 'name'=>'description', 'caption'=>'Description'),
                array(
                    'index'=>5,
                    'name'=>'thumb_small',
                    'caption'=>'Preview',
                    'formatter'=>function($thumbIndex, $data){
                        $smallThumb=isset($data->thumbSmall->name)?$data->thumbSmall->name:'';

                        return CHtml::image(CVideos::createSmallThumbUrl($smallThumb));
                    }
                ),
                array(
                    'index'=>6,
                    'name'=>'cover',
                    'caption'=>'Cover',
                    'formatter'=>function($thumbIndex, $data){
                        $html=null;
                        if(isset($data->imageCover->name)){
                            $html=Html::cover(CVideos::createCoverUrl($data->imageCover->name));
                        }

                        return $html;
                    }
                ),
                array(
                    'index'=>7,
                    'name'=>'cover_order',
                    'caption'=>'Display on start',
                    'formatter'=>function($order){
                        return Html::coverOrder($order, Yii::app()->params['covers']['animation']['count']);
                    }
                ),
                array(
                    'index'=>8,
                    'name'=>'id',
                    'caption'=>'Delete',
                    'formatter'=>function($id){
                        return CHtml::link('Remove', Yii::app()->createAbsoluteUrl('/admin/videos/'.$id), array('class'=>'remove-link'));
                    }
                )
            );
        }

        return self::$_DT_COLUMNS;
    }

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
		return 'Videos';
	}

    /**
     * Validation rules
     *
     * @return array
     */
    public function rules(){
        return array(
            array('link', 'required', 'on'=>'input'),
            array('ytId, title, created', 'required', 'on'=>'create'),
            array('description', 'safe', 'on'=>'create'),
            array('cover', 'file', 'allowEmpty'=>true, 'types'=>'jpg, jpeg, gif, png', 'maxSize'=>1024*1024*100),
            array('cover', 'safe')
        );
    }

    /**
     * Model's relations list
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
	 * Returns records
	 *
	 * @param null|\CDbCriteria $criteria. Query criteria
	 * @return Videos[]
	 */
	public function findRecords(\CDbCriteria $criteria=null){
		if(is_null($criteria)){
            $criteria=new \CDbCriteria();
        }

        $criteria->with=array('smallThumb', 'bigThumb', 'cover');

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
     * @param string $ytId. YouTube video id
     * @param string $title. YouTube video title
     * @param string|null $description. YouTube video description
     * @return bool
     * @throws \CException
     */
    public function create($ytId, $title, $description){
        $this->setAttributes(array(
            'youtube_id'=>$ytId,
            'title'=>$title,
            'description'=>$description,
            'created'=>new \CDbExpression('NOW()')
        ));

        return $this->save();
    }
}
