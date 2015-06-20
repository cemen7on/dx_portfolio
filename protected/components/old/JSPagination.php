<?php
class JSPagination extends CComponent{
    /**
     * Total number of records
     *
     * @var null|int
     */
    public $total=null;

    /**
     * Number of records per page
     *
     * @var null|int
     */
    public $limit=null;

    /**
     * Current page number
     *
     * @var int|null
     */
    public $page=null;

    /**
     * Class constructor
     *
     * @param int|null $total. Total number of record
     * @param int|null $limit. Number of records per page
     */
    public function __construct($total=null, $limit=null){
        if(!empty($total)){
            $this->total=$total;
        }

        if(!empty($limit)){
            $this->limit=$limit;
        }

        $this->page=Yii::app()->request->getQuery('page', 1);
    }

    /**
     * Applies pagination settings to db criteria
     *
     * @param CDbCriteria $criteria, Criteria to math records
     * @return $this
     * @throws CException
     */
    public function apply(CDbCriteria $criteria){
        if(!isset($this->limit)){
            throw new CException('$limit should be defined first');
        }

        $criteria->limit=$this->limit;
        $criteria->offset=($this->page-1)*$this->limit;

        return $this;
    }
} 