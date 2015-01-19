<?php
    /** @var Pagination $this*/

    Yii::app()->clientScript->registerScriptFile('/js/extensions/underscore.js');
    Yii::app()->clientScript->registerScriptFile('/js/extensions/backbone.js');

    Yii::app()->clientScript->registerScriptFile('/js/components/pagination.js');
    Yii::app()->clientScript->registerCssFile('/css/pagination/pagination.css');

    if($this->pages->getPageCount()>1){ ?>
        <div class="pagination" data-count="<?php echo $this->pages->pageCount;?>">
            <div class="loader float-left" style="display:none;">Loading...</div>

            <?php
            $this->widget('CLinkPager', array(
                    'pages'=>$this->pages,
                    'maxButtonCount'=>4,
                    'header'=>'',
                    'selectedPageCssClass'=>'active',
                    'nextPageCssClass'=>'hidden',
                    'previousPageCssClass'=>'hidden',
                    'firstPageCssClass'=>'hidden',
                    'lastPageCssClass'=>'hidden',
                    'htmlOptions'=>array(
                        'class'=>'float-left'
                    )
                ));
            ?>
        </div><?php
    }

