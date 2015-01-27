<?php
class DataTables{
    /**
     * Table columns info array
     *
     * @var array
     */
    protected $columns=array();

    /**
     * Model instance to fetch records from
     *
     * @var CActiveRecord|null
     */
    protected $model=null;

    /**
     * Query criteria object
     *
     * @var CDbCriteria|null
     */
    protected $criteria=null;

    /**
     * HTTP Request object alias
     *
     * @var CHttpRequest
     */
    protected $request=null;

    /**
     * Fetched data
     *
     * @var array
     */
    protected $data=array();

    /**
     * Class constructor
     *
     * @param array $columns. Data table columns info array
     * @param CActiveRecord $model. Model instance to fetch records from
     * @param CDbCriteria $criteria. Query criteria
     */
    public function __construct($columns, CActiveRecord $model=null, CDbCriteria $criteria=null){
        $this->request=Yii::app()->request;

        $this->columns=$columns;
        $this->model=$model;

        $this->criteria=is_null($criteria)
                        ? new CDbCriteria()
                        : $criteria;
    }

    /**
     * Applies filters for request and executes it
     *
     * @return $this
     */
    public function request(){
        $this->applySelect()
             ->applyLimit()
             ->applyOrder();

        $this->data=$this->model->findAll($this->criteria);

        return $this;
    }

    /**
     * Formats response for dataTables
     *
     * @return array
     */
    public function format(){
        $total=$this->model->count();

        return array(
            'draw'=>$this->request->getQuery('draw'),
            'recordsTotal'=>$total,
            'recordsFiltered'=>$total, // No filtering is used
            'data'=>$this->formatData($this->data)
        );
    }

    /**
     * Applies select condition for criteria object
     *
     * @return $this
     */
    public function applySelect(){
        $this->criteria->select=$this->pluck($this->columns, 'name');

        return $this;
    }

    /**
     * Applies limit condition for criteria object
     *
     * @return $this
     */
    public function applyLimit(){
        $offset=$this->request->getQuery('start');
        $limit=$this->request->getQuery('length', -1);

        if(isset($offset) && $limit!=-1){
            $this->criteria->offset=$offset;
            $this->criteria->limit=$limit;
        }

        return $this;
    }

    /**
     * Applies order condition for criteria object
     *
     * @return $this
     */
    public function applyOrder(){
        $orderColumns=$this->request->getQuery('order', array());
        $requestColumns=$this->request->getQuery('columns', array());

        if(empty($orderColumns) || empty($requestColumns)){
            return $this;
        }

        $orderBy=[];
        $columnsIndex=$this->pluck($this->columns, 'index');

        // For each ordered columns find it's actual index
        // Using actual index find particular index from $this->columns array
        // Using found column build order query
        for($i=0, $max=count($orderColumns); $i<=$max-1; $i++){
            $columnIdx=intval($orderColumns[$i]['column']);
            $requestColumn=$requestColumns[$columnIdx];

            $columnIdx=array_search($requestColumn['data'], $columnsIndex);
            $column=$this->columns[$columnIdx];

            if($requestColumn['orderable']=='true'){
                $orderColumn=isset($column['alias'])?$column['alias']:$column['name'];
                $orderDirection=strtolower($orderColumns[$i]['dir'])==='asc'?'ASC':'DESC';

                $orderBy[]=$orderColumn.' '.$orderDirection;
            }
        }

        $this->criteria->order=implode(', ', $orderBy);

        return $this;
    }

    /**
     * Formats data in a necessary way
     *
     * @param array $data. Data to format
     * @return array
     */
    public function formatData($data){
        $out=array();

        for($i=0, $imax=count($data); $i<=$imax-1; $i++){
            $row=array();

            for($j=0, $jmax=count($this->columns); $j<=$jmax-1; $j++){
                $column=$this->columns[$j];

                if(isset($column['formatter'])){
                    // Execute formatter callback
                    $row[$column['index']]=$column['formatter']($data[$i][$column['name']], $data[$i]);
                }
                else{
                    $row[$column['index']]=$data[$i][$column['name']];
                }
            }

            $out[]=$row;
        }

        return $out;
    }

    /**
     * Pull a particular property from each assoc. array in a numeric array,
     * returning and array of the property values from each item.
     *
     */
    protected function pluck(array $haystack, $needle){
        $out=array();

        for($i=0, $length=count($haystack); $i<=$length-1; $i++){
            $out[]=$haystack[$i][$needle];
        }

        return $out;
    }
} 