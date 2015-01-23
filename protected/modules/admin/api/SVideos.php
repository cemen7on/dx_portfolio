<?php
class SVideos{
    /**
     * Returns content for videos table content
     *
     * @return array
     */
    public function content(){
        $criteria=new CDbCriteria();
        $criteria->with='thumbSmall';

        $dataTable=new DataTables(Videos::DT_COLUMNS(), new Videos(), $criteria);

        return $dataTable->request()->format();
    }

    /**
     * Updates video's attributes
     *
     * @param int $videoId. Video's to update id
     * @param int $attributes. Attributes to update
     * @return bool
     * @throws Exception
     */
    public function update($videoId, $attributes){
        $vModel=new Videos();

        $result=$vModel->updateByPk($videoId, $attributes);
        if(!$result){
            throw new Exception('Failed to update record');
        }

        return true;
    }

    /**
     * Removes video
     *
     * @param int $videoId. Video's to delete id
     * @return bool
     * @throws Exception
     */
    public function delete($videoId){
        $vModel=new Videos();
        $result=$vModel->deleteByPk($videoId);
        if(!$result){
            throw new Exception('Failed to remove record');
        }

        return true;
    }
} 