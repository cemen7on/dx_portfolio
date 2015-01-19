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
 * In case browser do not support neither of animation-end property - set up timeout for approximate number of seconds
 * when animation should be done
 */
$(document).ready(function(){
    // Set delay for animated thumb appearance
    // (animated css class)
    // TODO: WARNING: Code is saved on case if css delay (0.1s) would be not enough
    /*
    var thumbs=$('.art-medium-preview .thumb'),
        max=thumbs.length-1;
    for(var i=0; i<=max; i++){
        (function(){
            var j=i;

            setTimeout(function(){
                $(thumbs[j]).addClass('animated');

                if(j>=max){
                    // After animation complete - create youtube player if it's ready
                    // Or set up a flag
                    if(isIframeReady){
                        createYouTubePlayer();
                    }
                    else{
                        isAnimated=true;
                    }
                }
            }, 50*i);
        })();
    }
    */

    var $lastThumb=$('.art-medium-preview .thumb:last'),
        lastThumb=$lastThumb[0],
        supportedEvents={
            animation:'animationend',
            MSAnimation:'MSAnimationEnd',
            OAnimation:'oTransitionEnd',
            MozAnimation:'animationend',
            WebkitAnimation:'webkitAnimationEnd'
        },
        eventName;

    // No previews on page
    if(!lastThumb){
        return ;
    }

    for(property in supportedEvents){
        if(!lastThumb.style.hasOwnProperty(property)){
            continue;
        }

        eventName=supportedEvents[property];
    }

    if(eventName){
        $lastThumb.bind(eventName, function(){
            $(document).trigger('animated');
        });
    }
    else{
        setTimeout(function(){
            $(document).trigger('animated');
        }, ($lastThumb.index()+1)*100);
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