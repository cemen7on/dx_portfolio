$(document).ready(function(){
    // Bind event listeners
    var $document=$(document);

    (function createHiddenForm(){
        var $coverInput=$('<input id="coverInput" type="file" name="'+$('table.content').attr('id').firstToUpper()+'[cover]" />'),
            $coverForm=$('<form id="coverForm" enctype="multipart/form-data"></form>');

        $('body').append($coverForm.append($coverInput));
    }());

    // Save previous value for select boxes
    $document.on('focusin', 'select', function(){
        this.previousValue=this.value; // Save current value as previous for future select
    });

    // Submit upload form asynchronously
    $('.upload-form').submit(function(event){
        event.preventDefault();

        var _this=this,
            $this=$(_this),
            data=new FormData(_this),
            submitBtn=$this.find('[type=submit]')[0],
            $contentTable=$('table.content'),
            contentTable=$contentTable.data('dataTable');

        Core.Request.send({
            url:this.action,
            type:this.method,
            data:data,
            beforeSend:function(){
                submitBtn.setAttribute('disabled', 'disabled');
            },
            success:function(response){
                if(!response.row || !response.data){
                    throw new Error('Invalid response. response.row and response.data must be specified');
                }

                // Add row to table
                contentTable.row.add(response.row).draw();

                $this.trigger('file.upload', response.data);

                _this.reset();
            },
            error:function(message, code, data){
                alert('Upload failed. Reason: '+message+'. Look console for more information');
                console.log(data);
            },
            complete:function(){
                submitBtn.removeAttribute('disabled');
            },
            // Options to tell jQuery not to process data or worry about content-type
            cache:false,
            contentType:false,
            processData:false
        });
    });

    /**
     * Enables dataTables plugin for passed table jQuery object
     *
     * @param {jQuery} $table. jQuery object
     */
    function configureDataTable($table){
        var instance;

        instance=$table.DataTable({
            processing:true,
            serverSide:true,
            searching:false,
            columnDefs:[
                {targets:[5, 6, 8], orderable:false}, // Disable order in "Preview", "Cover" and "Delete" columns
                {targets:[3], className:'editable-title'},
                {targets:[4], className:'editable-description'},
                {targets:[6], className:'editable-cover'}
            ],
            order:[[0, 'desc']], // set default DESC sort by id
            ajax:'/admin/'+$table.attr('id')+'/content',
            fnCreatedRow:function(row, data){
                var id=Number(data[0]);

                $(row).data('id', id)
                      .attr('id', 'contentRow'+id);

            }
        });

        // Save dataTable instance
        $table.data('dataTable', instance);
    }

    configureDataTable($('#pictures'));
    configureDataTable($('#videos'));

    // Remove item
    $document.on('click', '.remove-link', function(event){
        event.preventDefault(); // Escape from following a link

        if(!confirm('Are you sure?')){
            return ;
        }

        var $this=$(this),
            table=$this.parents('table').data('dataTable'),
            $row=$this.parents('tr');

        Core.Request.send({
            type:'DELETE',
            url:this.href,
            success:function(){
                // Destroy removed item and redraw table
                table.row($row).remove().draw(false);
            }
        });
    });

    /**
     * Creates edit field instead of content
     *
     * @param {HTMLElement|jQuery|string|*} parent. Parent element
     * @param {HTMLElement|jQuery|string|*} field. Field to replace by
     */
    function createField(parent, field){
        var $parent=$(parent),
            $field=$(field),
            text=$parent.text();

        // If field already exist - just focus it
        if($parent.children($field[0].nodeName.toLowerCase()).size()){
            $field=$parent.children();
            $field.focus();

            return ;
        }

        $field[0].startValue=text;

        $field.addClass('edit-field');
        $field.val(text);

        $parent.html($field);
        $field.focus();
    }

    $document.on('click', 'tbody .editable-title', function(){
        createField(this, $('<input type="text" />'));
    });

    $document.on('click', 'tbody .editable-description', function(){
        createField(this, $('<textarea></textarea>'));
    });

    /**
     * Saves value of edited field and reverts it to usual state
     *
     * @param {HTMLElement} field. Editable field html element
     */
    function editField(field){
        var $field=$(field),
            $parent=$field.parents('td'),
            recordId=$field.parents('tr').data('id'),
            value=$field.val(),
            data={};

        if($parent.hasClass('editable-title')){
            data.title=value;
        }
        else if($parent.hasClass('editable-description')){
            data.description=value;
        }
        else{
            throw new Error('Invalid edit type');
        }

        // If value has not changed - do not send request
        if(value==field.startValue){
            $parent.html(value);

            return ;
        }

        Core.Request.send({
            url:location.pathname+'/'+recordId,
            type:'PUT',
            data:data,
            beforeSend:function(){
                $field.attr('disabled', 'disabled');
            },
            error:function(){
                value=field.startValue;
            },
            complete:function(){
                $parent.html(value);
            }
        });
    }

    // Update value
    $document.on('focusout', 'tbody .edit-field', function(){
            editField(this);
        })
        .on('click', 'tbody .edit-field', function(event){
            event.stopImmediatePropagation();
        });

    // Change on cover hidden form input
    $document.on('change', '#coverInput', function(){
        var recordId=$(this).data('record_id'),
            coverForm=$('#coverForm')[0],
            data=new FormData(coverForm);

        Core.Request.send({
            url:location.pathname+'/'+recordId+'/cover',
            data:data,
            success:function(data){
                var $td=$('#contentRow'+recordId).children(':nth-child(7)');

                // Update table with received content
                $td.html(data.html);
            },
            error:function(message, code, data){
                alert('Upload failed. Reason: '+message+'. Look console for more information');
                console.log(data);
            },
            complete:function(){
                coverForm.reset();
            },

            // Options to tell jQuery not to process data or worry about content-type
            cache:false,
            contentType:false,
            processData:false
        });
    });

    // Changes cover order
    $document.on('change', 'tbody .cover-order', function(){
        var _this=this,
            $this=$(_this),
            coverOrder=$this.val(),
            id=$this.parents('tr').data('id');

        Core.Request.send({
            url:location.pathname+'/'+id,
            type:'PUT',
            data:{cover_order:coverOrder},
            success:function(){
                // Update table content
                $this.parents('table').data('dataTable').draw(false);
            },
            error:function(){
                $this.val(_this.previousValue); // Go back to the previous state
            }
        });
    });

    // Remove record's cover
    $document.on('click', '.remove-cover', function(event){
        event.stopImmediatePropagation();

        if(!confirm('Are you sure?')){
            return ;
        }

        var $this=$(this),
            $td=$this.parents('td'),
            recordId=$td.parent().data('id');

        Core.Request.send({
            url:location.pathname+'/'+recordId+'/cover',
            type:'DELETE',
            success:function(){
                $td.empty();
            }
        });
    });
});