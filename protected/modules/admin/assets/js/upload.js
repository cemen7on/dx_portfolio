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
            columnDefs:[{targets:5, orderable:false}, {targets:6, orderable:false}], // Disable order in "Preview" and "Delete" columns
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

        $.ajax({
            type:'DELETE',
            url:this.href,
            success:function(){
                // Destroy removed item and redraw table
                table.row($row).remove().draw(false);
            },
            error:function(){
                alert('Error');
            }
        });
    });
});