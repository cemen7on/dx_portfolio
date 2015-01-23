<?php
class SPictures{
    /**
     * Returns content for pictures table content
     *
     * @return array
     */
    public function content(){
        $criteria=new CDbCriteria();
        $criteria->with=array(
            'thumbSmall'=>array('select'=>'thumbSmall.name')
        );

        $dataTable=new DataTables(Pictures::DT_COLUMNS(), new Pictures(), $criteria);

        return $dataTable->request()->format();
    }

    /**
     * Updates picture's attributes
     *
     * @param int $pictureId. Picture's to update id
     * @param int $attributes. Attributes to update
     * @return bool
     * @throws Exception
     */
    public function update($pictureId, $attributes){
        $pModel=new Pictures();

        $result=$pModel->updateByPk($pictureId, $attributes);
        if(!$result){
            throw new Exception('Failed to update record');
        }

        return true;
    }

    /**
     * Removes picture
     *
     * @param int $pictureId. Picture's to delete id
     * @return bool
     * @throws Exception
     */
    public function delete($pictureId){
        $vModel=new Pictures();
        $result=$vModel->deleteByPk($pictureId);
        if(!$result){
            throw new Exception('Failed to remove record');
        }

        return true;
    }
} 