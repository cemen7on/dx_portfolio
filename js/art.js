// When top nav menu loads - set current menu item
$('#topNavMenu').ready(function(){
    $('#topNavMenu').find('a[href*="'+window.location.pathname+'"]').addClass('active');
});

/**
 * Global environment object.
 * Contains properties indicating on current state of environment.
 *
 * @type {object}
 */
Environment={
    loading:false // Shows if content is loading at the moment (simulation of web page loading)
};

/**
 * When DOM is ready do not immediately execute javascript code - this will lead to animation slowdown.
 * That is why next code waits until css animation complete and then fire event to dispatch js code execution.
 */
$(document).ready(function(){
    var MIN_DROP_DURATION=300,
        MAX_DROP_DURATION=700,
        images=document.querySelectorAll('.art-medium-preview > .thumb > .image'),
        total=images.length,
        animated=0;

    // Enable previews slide down animation
    for(var i=0; i<=total-1; i++){
        $(images[i]).animate(
            {height:140},
            {
                duration:Math.random()*(MAX_DROP_DURATION-MIN_DROP_DURATION)+MIN_DROP_DURATION,
                complete:function(){
                    this.classList.add('animated');

                    if(++animated==total){
                        // Animation was commented
                        $(document).trigger('animated');
                    }
                }
            }
        );
    }
});

// Register common event listeners
$(document)
    // Register event handler for hovering preview thumb.
    // Highlights thumb name from aside menu
    .on('mouseenter mouseleave', '.art-medium-preview .thumb', function(){
        $('#asideNavMenu').find('[data-target=\''+$(this).attr('id')+'\']').toggleClass('hover');
    })
    // Register event handler for hovering, preview thumb
    // Highlights preview thumb
    .on('mouseenter mouseleave', '#asideNavMenu a', function(){
        $('.art-medium-preview .thumb[id='+$(this).data('target')+']').toggleClass('hover');
    })
    // Clicking preview thumb
    .on('click', '#asideNavMenu a', function(){
        $('.art-medium-preview .thumb[id='+$(this).data('target')+']').click();
    });