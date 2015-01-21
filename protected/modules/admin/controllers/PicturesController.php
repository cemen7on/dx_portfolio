<?php
class PicturesController extends UploadController{
    /**
     * Handles usual request for pictures.
     * Renders and processes form
     *
     * @throws Exception
     */
    public function actionIndex(){
        $pModel=new Pictures();

        if(!empty($_POST)){
            $pModel=new Pictures('input');
            $pModel->attributes=$_POST['Pictures'];

            if($pModel->validate()){
                try{
                    $pModel->setScenario('create');
                    if(!$pModel->create()){
                        throw new Exception('Failed to save picture record');
                    }

                    // Save as image source
                    $upload=CUploadedFile::getInstance($pModel, 'src');
                    $fileName="{$pModel->id}.{$upload->getExtensionName()}";
                    $src=CPictures::createSrcPath($fileName);
                    $upload->saveAs($src);

                    $iModel=new Images();

                    $pModel->src=$iModel->saveSrc($src);
                    $pModel->thumb_small=$iModel->saveSmallThumb($src, CPictures::createSmallThumbPath($fileName));
                    $pModel->thumb_big=$iModel->saveBigThumb($src, CPictures::createBigThumbPath($fileName));

                    if(!$pModel->save()){
                        throw new Exception('Failed to update record with images');
                    }

                    $this->refresh();
                }
                catch(Exception $e){
                    $pModel->addError('src', $e->getMessage());
                }
            }

        }

        $this->render('index', array('model'=>$pModel));
    }

    /**
     * Handles ajax pictures request.
     * Returns json encoded content for pictures table
     */
    public function actionContent(){
        $criteria=new CDbCriteria();
        $criteria->with=array(
            'thumbSmall'=>array('select'=>'thumbSmall.name')
        );

        $dataTable=new DataTables(Pictures::DT_COLUMNS(), new Pictures(), $criteria);

        REST::sendResponse($dataTable->request()->format());
    }

    /**
     * Removes picture record
     *
     * @get int id. Picture id
     */
    public function actionDelete(){
        try{
            $id=Yii::app()->request->getQuery('id');

            if(!$id){
                throw new Exception('$_GET[id] was not received');
            }

            $vModel=new Pictures();
            $result=$vModel->deleteByPk($id);
            if(!$result){
                throw new Exception('Failed to remove record');
            }

            REST::successResponse(true);
        }
        catch(Exception $e){
            REST::errorResponse($e);
        }
    }
} 