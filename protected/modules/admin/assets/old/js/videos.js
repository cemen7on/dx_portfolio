$(document).on('click', '.editable-cover', function(){
    var $coverInput=$('#coverInput');

    $coverInput.data('record_id', $(this).parent().data('id'));
    $coverInput.click();
});