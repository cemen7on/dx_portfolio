$(document).ready(function(){
    $('.nav-menu-item-pic-container')
        // Register pic items on mouseenter/mouseleave to highlight associative menu item
        .bind('mouseenter mouseleave', function(){
            $(this).siblings('a').toggleClass('active');
        })
        // Add to each menu item .smooth class, so highlighting would be transitioned
        .siblings('a').addClass('smooth');

    TopNavMenu.init(function(){
        PicNavMenu.init();
    });
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

/**
 * Pictures navigation menu's element class
 *
 * @param $object
 * @constructor
 */
var PicNavElement=function($object){
    /**
     * Object pointer
     *
     * @type {PicNavElement}
     * @private
     */
    var _this=this;

    /**
     * Element dropping duration min border
     *
     * @type {number}
     */
    var MIN_DROP_DURATION=700;

    /**
     * Element dropping duration max border
     *
     * @type {number}
     */
    var MAX_DROP_DURATION=1000;

    /**
     * Element clip animation duration min border
     *
     * @type {number}
     */
    var MIN_CLIP_DURATION=1200;

    /**
     * Element clip animation duration max border
     *
     * @type {number}
     */
    var MAX_CLIP_DURATION=1700;

    /**
     * Hidden element width in pixels
     *
     * @type {number}
     */
    var HIDDEN_ELEMENT_WIDTH=10;

    /**
     * Pic Navigation jQuery object
     *
     * @type {null|jQuery}
     */
    _this.$object=null;

    /**
     * Sets object
     *
     * @param {jQuery|HTMLElement} $object. Object to set
     * @returns {PicNavElement}
     */
    _this.set=function($object){
        if($object.hasClass('.nav-menu-item-pic')){
            return _this;
        }

        _this.$object=$object;

        init();

        return _this;
    };

    /**
     * Object initialize css properties
     */
    var init=function(){
        var $parent=_this.$object.parent(),
            elements=_this.$object.siblings().size()+1, // Total elements number for current _this.$parent element
            startWidth=$parent.width()/elements, // _this.$object start width value
            endWidth=$parent.width(), // _this.$object end width value
            startHeight=0, // _this.$object start height value
            endHeight=$(window).height()-$parent.offset().top; // _this.$object end height value

        /**
         * Returns css properties object
         *
         * @param width
         * @param height
         * @param clipY1
         * @param clipX1
         * @param clipY2
         * @param clipX2
         * @returns {{width: (*|number), height: (*|number), clip: {y1: (*|number), x1: (*|number), y2: (*|number), x2: (*|number)}}}
         */
        var toObject=function(width, height, clipY1, clipX1, clipY2, clipX2){
            return {
                width:width || 0,
                height:height || 0,
                clip:{
                    y1:clipY1 || 0,
                    x1:clipX1 || 0,
                    y2:clipY2 || 0,
                    x2:clipX2 || 0
                }
            };
        };

        var start=toObject(startWidth, startHeight, 0, startWidth*(_this.$object.index()+1), endHeight, startWidth*_this.$object.index());

        _this.$object.data('nav', {
            start:start,
            end:toObject(endWidth, endHeight, 0, endWidth, endHeight, 0),
            dropDuration:Math.random()*(MAX_DROP_DURATION-MIN_DROP_DURATION)+MIN_DROP_DURATION
        });

        // Set start css value
        _this.$object.css('clip', PicNavElement.clipToString(
            start.clip.y1,
            start.clip.x1,
            start.clip.y2,
            start.clip.x2
        ));
    };

    /**
     * Returns defined css properties for current object
     *
     * @returns {*}
     */
    _this.css=function(){
        return _this.$object.data('nav');
    };

    /**
     * Animates current element to full size width
     *
     * @returns {PicNavElement}
     */
    _this.toFullWidth=function(){
        stopCurrentAnimation();

        var duration=getRandClipDuration();

        // Animate all previous siblings
        var prevItemsSumWidth=0;
        _this.$object.prevAll().reverse().each(function(index){
            var $this=$(this),
                css=$this.data('nav'),
                clipX1Value=HIDDEN_ELEMENT_WIDTH*(index+1),
                clipX2Value=HIDDEN_ELEMENT_WIDTH*index;

            prevItemsSumWidth+=clipX1Value-clipX2Value;

            PicNavElement.animate($this, duration, css.start.clip.y1, clipX1Value, css.start.clip.y2, clipX2Value);
        });

        // Animate all next siblings
        var nextItemsSumWidth=0;
        _this.$object.nextAll().reverse().each(function(index){
            var $this=$(this),
                css=$this.data('nav'),
                clipX1Value=css.start.clip.x1+(css.start.width-HIDDEN_ELEMENT_WIDTH)*index,
                clipX2Value=css.start.clip.x2+(css.start.width-HIDDEN_ELEMENT_WIDTH)*(index+1);

            nextItemsSumWidth+=clipX1Value-clipX2Value;

            PicNavElement.animate($this, duration, css.start.clip.y1, clipX1Value, css.start.clip.y2, clipX2Value);
        });

        var css=_this.$object.data('nav');

        // Animate current element
        PicNavElement.animate(_this.$object, duration, css.start.clip.y1, css.end.clip.x1-nextItemsSumWidth,
            css.start.clip.y2, css.end.clip.x2+prevItemsSumWidth);

        return _this;
    };

    /**
     * Animates current element to default size width
     *
     * @returns {PicNavElement}
     */
    _this.toDefaultWidth=function(){
        stopCurrentAnimation();

        var duration=getRandClipDuration(),

            $elements=_this.$object.siblings(); // Define self container elements collection
            $elements.push(_this.$object[0]);

        $.each($elements, function(i, element){
            var $element=$(element),
                css=$element.data('nav');

            PicNavElement.animate($element, duration, css.start.clip.y1, css.start.clip.x1, css.start.clip.y2, css.start.clip.x2);
        });

        return _this;
    };

    /**
     * Returns rand clip duration value
     *
     * @return {Number}
     */
    var getRandClipDuration=function(){
        return Math.floor(
            Math.random()*(MAX_CLIP_DURATION-MIN_CLIP_DURATION)+MIN_CLIP_DURATION
        );
    };

    /**
     * Stops animation in current container
     */
    var stopCurrentAnimation=function(){
        var $parent=_this.$object.parent();

        $parent.children().stop(true);
    };

    /**
     * Initialization method.
     *
     * Sets element object
     */
    (function construct($object){
        _this.set($object);
    })($object);
};

/**
 * Returns css clip value
 *
 * @param y1
 * @param x1
 * @param y2
 * @param x2
 * @returns {string}
 * @static
 */
PicNavElement.clipToString=function(y1, x1, y2, x2){
    return 'rect('+y1+'px, '+x1+'px, '+y2+'px, '+x2+'px)';
};

/**
 * Executes clip animation on specific element
 *
 * @param element
 * @param duration
 * @param y1
 * @param x1
 * @param y2
 * @param x2
 */
PicNavElement.animate=function(element, duration, y1, x1, y2, x2){
    $(element).animate(
        {clip:PicNavElement.clipToString(y1, x1, y2, x2)},
        {
            duration:duration,
            easing:'linear'
        }
    );
};