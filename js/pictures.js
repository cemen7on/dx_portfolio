$(document).bind('animated', function(){
    // Create preview gallery instance for picture
    // and configure it
    var pagination=new Pagination(),
        picture=new Gallery(pagination),
        $window=$(window);

    /**
     * Adjusts bound values for modal sizes
     */
    function adjustDefaults(){
        picture.default.maxWidth=$window.width()-100;
        picture.default.maxHeight=$window.height()-100;
    }

    adjustDefaults();
    $window.resize(adjustDefaults);

    // Register event handler for clicking picture preview thumb.
    // Shows big thumb in modal window
    $(document).on('click', '.art-medium-preview .thumb.picture', function(){
        if(Environment.loading){ // Do nothing if content is being loaded at the moment
            return ;
        }

        picture.goTo($(this).index(), pagination.currentPage, function(){
            picture.show();
        });
    });
});