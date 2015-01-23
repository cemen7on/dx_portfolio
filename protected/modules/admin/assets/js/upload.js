$(document).ready(function(){
    /**
     * Enables dataTables plugin for passed table jQuery object
     *
     * @param {jQuery} $table. jQuery object
     */
    function configureDataTable($table){
        var instance,
            id=$table.attr('id');

        instance=$table.DataTable({
            processing:true,
            serverSide:true,
            searching:false,
            columnDefs:[
                {targets:[5, 6], orderable:false}, // Disable order in "Preview" and "Delete" columns
                {targets:[3], className:'editable-title'},
                {targets:[4], className:'editable-description'}
            ],
            order:[[0, 'desc']], // set default DESC sort by id
            ajax:'/admin/'+id+'/content'
        });

        // Save dataTable instance
        $table.data('dataTable', instance);
    }

    configureDataTable($('#pictures'));
    configureDataTable($('#videos'));

    // Bind event listeners
    var $document=$(document);
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

    $document.on('click', '.editable-title', function(){
        createField(this, $('<input type="text" />'));
    });

    $document.on('click', '.editable-description', function(){
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
            recordId=parseInt($field.parents('td').siblings('td:first').text()), // Id of record
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
    $document.on('focusout', '.edit-field', function(){
            editField(this);
        })
        /*
        .on('keydown', '.edit-field', function(event){
            if(event.which!=13 || !event.ctrlKey){
                return ;
            }

            editField(this);

            event.preventDefault();
        })
        */
        .on('click', '.edit-field', function(event){
            event.stopImmediatePropagation();
        });
});