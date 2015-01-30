<?php
class PicNavMenu extends CWidget{
	/**
	 * Returns html string with animation pic nav menu
	 *
	 * @return string
	 */
	public function animation(){
        $criteria=new CDbCriteria();
        $criteria->limit=Yii::app()->params['covers']['animation']['count'];
        $criteria->order='ISNULL(cover_order), cover_order ASC, t.id DESC';

		return $this->render('animation', array('items'=>Videos::model()->findRecords($criteria)), true);
	}

	/**
	 * Returns html string with pictures 2d pic nav menu
	 *
	 * @return string
	 */
	public function pictures2d(){
        $criteria=new CDbCriteria();
        $criteria->limit=Yii::app()->params['covers']['pictures2d']['count'];
        $criteria->order='ISNULL(cover_order), cover_order ASC, t.id DESC';

		return $this->render('pictures', array('items'=>Pictures::model()->findAllByTypeId(PicturesType::PICTURES_2D, $criteria)), true);
	}

	/**
	 * Returns html string with art 3d pic nav menu
	 *
	 * @return string
	 */
	public function art3d(){
        $criteria=new CDbCriteria();
        $criteria->limit=Yii::app()->params['covers']['art3d']['count'];
        $criteria->order='ISNULL(cover_order), cover_order ASC, t.id DESC';

		return $this->render('art', array('items'=>Pictures::model()->findAllByTypeId(PicturesType::ART_3D, $criteria)), true);
	}
}
