<?php
class ActiveRecord extends CActiveRecord{
	/**
	 * Returns attributes array for specific array of objects
	 *
	 * @param array $array
	 * @return array
	 */
	public static function toArrayAll(array $array){
		$response=array();

		/** @var ActiveRecord $record */
		foreach($array as $record){
			$response[]=$record->toArray();
		}

		return $response;
	}

	/**
	 * Returns attributes array of $this object
	 *
	 * @return array
	 */
	public function toArray(){
		return $this->_toArray($this);
	}

	/**
	 * Returns specified model's attributes array with relations
	 *
	 * @param ActiveRecord $model
	 * @return array
	 */
	private function _toArray($model){
        if(!$model){
            return array();
        }

		if(is_array($model)){
			return $this->toArrayAll($model);
		}

		$attributes=$model->getAttributes();
		$relations=array();
		foreach($model->relations() as $key=>$related){
			if($model->hasRelated($key)){
				$relations[$key]=$this->_toArray($model->$key);
			}
		}

		return array_merge($attributes, $relations);
	}

}