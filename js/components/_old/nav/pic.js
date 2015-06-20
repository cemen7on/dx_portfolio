$(document).ready(function(){
    $('.nav-menu-item-pic-container')
        // Register pic items on mouseenter/mouseleave to highlight associative menu item
        .bind('mouseenter mouseleave', function(){
            $(this).siblings('a').toggleClass('active');
        })
        // Add to each menu item .smooth class, so highlighting would be transitioned
        .siblings('a').addClass('smooth');

    /*
    TopNavMenu.init(function(){
        PicNavMenu.init();
    });
    */
});

/**
 * Top navigation menu object
 */
var TopNavMenu=new function(){
    /**
     * Object pointer
     *
     * @type {TopNavMenu}
     * @private
     */
    var _this=this;

    /**
     * Top navigation menu jquery  object
     *
     * @type {null|jQuery}
     */
    _this.$element=null;

    /**
     * Object fading duration in milliseconds
     *
     * @type {number}
     */
    var FADE_DURATION=800;

    /**
     * Sets object
     */
    var set=function(){
        _this.$element=$('#topNavMenu');
    };

    /**
     * Shows object
     *
     * @param callback
     */
    var show=function(callback){
        callback=callback || function(){};

        _this.$element.fadeTo(FADE_DURATION, 1, callback);
    };

    /**
     * Initialization method
     */
    _this.init=function(callback){
        set();
        show(callback);
    };
};

/**
 * Pictures navigation menu object
 */
var PicNavMenu=new function(){
    /**
     * Object pointer
     *
     * @type {PicNavMenu}
     * @private
     */
    var _this=this;

    /**
     * Pic Nav Menu Elements array
     *
     * @type {Array}
     */
    _this.elements=[];

    /**
     * Sets elements array
     */
    var set=function(){
        $('.nav-menu-item-pic').each(function(){
            _this.elements.push(new PicNavElement($(this)));
        });
    };

    /**
     * Slides down menu elements
     */
    var slideDown=function(){
        var shownElementsNumber=0;

        $.each(_this.elements, function(i, element){
            element.$object.animate(
                {height:element.css().end.height},
                {
                    duration:element.css().dropDuration,
                    complete:function(){
                        shownElementsNumber++;

                        if(shownElementsNumber==_this.elements.length){
                            _this.onInitialize(); // Trigger initialize callback function
                        }
                    }
                }
            );
        });
    };

    /**
     * Initialization method
     */
    _this.init=function(){
        set();
        slideDown();
    };

    /**
     * On initialize method.
     * Is triggered when all images have slid down.
     * Registers event listeners
     */
    _this.onInitialize=function(){
        $.each(_this.elements, function(i, element){
            element.$object
                .mouseenter(function(){
                    element.toFullWidth();
                })
                .mouseleave(function(){
                    element.toDefaultWidth();
                })
                .click(function(){
                    location.href=$(this).data('href');
                });
        });
    };
};

