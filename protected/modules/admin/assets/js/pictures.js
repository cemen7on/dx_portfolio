$(document).ready(function(){
    var $document=$(document);

    // When data is uploaded in form - crop cover image
    $('.upload-form').on('file.upload', function(event, data){
        // Show image
        var modal=new Modal(),
            $window=$(window),
            $cropper=$('<div class="cropper"></div>'),
            $image=$('<img src="'+data.thumb_big+'" />'),
            $form=$('<div class="cropper-form"></div>'),
            $submitBtn=$('<button class="cropper-submit">Submit</button>');

        // Set bounds for preview image
        $cropper.css('max-width', ($window.width()-100)+'px');
        $cropper.css('max-height', ($window.height()-200)+'px');

        modal.content().html($cropper.append($image).after($form.append($submitBtn)));
        modal.show();

        // When image is loaded - configure image cropper,
        // because we use image size
        $image.load(function(){
            var cropWidth=170,
                cropData=null;

            $image.cropper({
                data:{
                    width:cropWidth,
                    x:data.thumbBig.width/2-cropWidth/2 // center of image
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
                Core.Request.send({
                    url:'/admin/pictures/'+data.id+'/crop',
                    data:{left:Math.floor(cropData.x)},
                    success:function(data){
                        // Update table with received content
                        $('table.content').find('tbody > tr:first').children('td:nth-child(7)').html(data.html);

                        modal.hide();
                    }
                });
            });
        });
    });

    // Change picture type.
    // Save previous value
    $document.on('focusin', '.dropdown-type', function(){
        this.previousValue=this.value; // Save current value as previous for future select
    });
    // Change value
    $document.on('change', '.dropdown-type', function(){
        var _this=this,
            $this=$(_this),
            typeId=$this.val(),
            id=parseInt($this.parents('td').siblings('td:first').text()); // Id of record

        Core.Request.send({
            type:'PUT',
            url:'/admin/pictures/'+id,
            data:{type_id:typeId},
            error:function(){
                $this.val(_this.previousValue); // Go back to the previous state
            }
        });
    });
});