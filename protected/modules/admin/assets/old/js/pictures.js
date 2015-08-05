$(document).ready(function(){
    var $document=$(document),
        MODAL_ID='cropCoverModal';

    // When data is uploaded in form - crop cover image
    $('.upload-form').on('file.upload', function(event, data){
        // Show image
        var modal=new Modal(MODAL_ID),
            $window=$(window),
            $cropper=$('<div class="cropper"></div>'),
            $image=$('<img src="'+data.thumb_big+'" />'),
            $container=$('<div class="cropper-controls"></div>'),
            $submitBtn=$('<button class="float-right cropper-submit">Crop</button>'),
            $loadBtn=$('<button class="float-left cropper-load">Load another</button>'),
            recordId=data.id;

        // Set bounds for preview image
        $cropper.css('max-width', ($window.width()-100)+'px');
        $cropper.css('max-height', ($window.height()-200)+'px');

        modal.content().html($cropper.append($image).after($container.append($submitBtn).append($loadBtn)));
        modal.show();

        // When image is loaded - configure image cropper,
        // because we use image size
        $image.load(function(){
            var cropWidth=170,
                cropData=null;

            $image.cropper({
                data:{
                    width:cropWidth,
                    x:this.naturalWidth/2-cropWidth/2 // center of image
                },
                minHeight:$image.height(),
                resizable:false,
                dashed:false,
                dragCrop:false,
                done:function(data){
                    cropData=data;
                }
            });

            $submitBtn.click(function(){
                $submitBtn.attr('disabled', 'disabled');
                $loadBtn.attr('disabled', 'disabled');

                Core.Request.send({
                    url:'/admin/pictures/'+data.id+'/crop',
                    data:{left:Math.floor(cropData.x)},
                    success:function(data){
                        var $td=$('#contentRow'+recordId).children(':nth-child(7)');

                        // Update table with received content
                        $td.html(data.html);

                        modal.hide();
                    }
                });
            });

            // Trigger hidden form file input click
            $loadBtn.click(function(){
                $submitBtn.attr('disabled', 'disabled');
                $loadBtn.attr('disabled', 'disabled');

                $('#coverInput').data('record_id', recordId)
                                .trigger('click');

                modal.hide();
            });
        });
    });

    // Change picture type.
    $document.on('change', '.dropdown-type', function(){
        var _this=this,
            $this=$(_this),
            typeId=$this.val(),
            id=$this.parents('tr').data('id');

        Core.Request.send({
            type:'PUT',
            url:'/admin/pictures/'+id,
            data:{type_id:typeId},
            success:function(){
                // Update table content
                $this.parents('table').data('dataTable').draw(false);
            },
            error:function(){
                $this.val(_this.previousValue); // Go back to the previous state
            }
        });
    });
});