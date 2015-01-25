/**
 * Global environment object.
 * Contains properties indicating on current state of environment.
 *
 * @type {object}
 */
var Environment={
    loading:false // Shows if content is loading at the moment (simulation of web page loading)
};

/**
 * Global Art object.
 * Contains common methods for art controller
 *
 * @type {object}
 */
var Art={
    /**
     * Getter for thumb width
     *
     * @returns {number}
     */
    get thumbWidth(){
        var WIDTH_RATIO=0.15;

        return Math.floor($(window).width()*WIDTH_RATIO);
    },

    /**
     * Getter for thumb height
     *
     * @returns {number}
     */
    get thumbHeight(){
        var HEIGHT_RATIO=0.7;

        return Math.floor(this.thumbWidth*HEIGHT_RATIO);
    },

    /**
     * Adjusts thumbs size to current window size
     *
     * @param {HTMLCollection} thumbs. Thumbs HTML elements to adjust
     * @returns {Art}
     */
    adjustSize:function(thumbs){
        for(var i=0, total=thumbs.length; i<=total-1; i++){
            thumbs[i].style.width=this.thumbWidth+'px';
            thumbs[i].style.height=this.thumbHeight+'px';
        }

        return this;
    },

    /**
     * Animates images slow down
     *
     * @param {HTMLCollection} images. Images HTML elements to adjust
     * @param {function} callback. Animation complete callback function
     */
    animate:function(images, callback){
        callback=callback || function(){};

        var MIN_DROP_DURATION=300,
            MAX_DROP_DURATION=1000,
            total=images.length,
            animated=0;

        // When DOM is ready do not immediately execute javascript code - this will lead to animation slowdown.
        // That is why next code waits until css animation complete and then fire event to dispatch js code execution.
        for(var i=0; i<=total-1; i++){
            $(images[i]).animate(
                {height:'100%'},
                {
                    duration:Math.random()*(MAX_DROP_DURATION-MIN_DROP_DURATION)+MIN_DROP_DURATION,
                    complete:function(){
                        this.classList.add('animated');

                        if(++animated==total){
                            // Animation was completed
                            callback();
                        }
                    }
                }
            );
        }
    }
};

// On DOM ready - adjust and animate current elements
$(document).ready(function(){
    // Adjust current previews
    Art.adjustSize(document.querySelectorAll('.art-medium-preview > .thumb'));

    // Animate it
    Art.animate(document.querySelectorAll('.art-medium-preview > .thumb > .image'), function(){
        $(document).trigger('animated')
    });
});

// When window is resized - also resize displayed elements
$(window).resize(function(){
    Art.adjustSize(document.querySelectorAll('.art-medium-preview > .thumb'));
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

// When top nav menu loads - set current menu item
$('#topNavMenu').ready(function(){
    $('#topNavMenu').find('a[href*="'+window.location.pathname+'"]').addClass('active');
});