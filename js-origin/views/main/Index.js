use('Views.Main').Index=Core.View.extend(function(){
    /**
     * Folding elements array
     *
     * @type {Array}
     * @private
     */
    var _foldingElements=[];

    /**
     * Sections' HTML Elements
     *
     * @type {HTMLElement}
     */
    var animationsEl,
        pictures2dEl,
        art3dEl;

    /**
     * Returns caption element of specified section
     *
     * @param {HTMLElement} sectionEl. Section element to find caption of
     * @returns {Node}
     * @private
     */
    var _getSectionCaptionEl=function(sectionEl){
        return sectionEl.parentNode.querySelector('.caption');
    };

    /**
     * Toggles section caption
     *
     * @param {Event} event. Event object
     * @private
     */
    var _highlightSectionCaption=function(event){
        _getSectionCaptionEl(event.currentTarget).classList.toggle('active')
    };

    /**
     * Events list
     *
     * @type {object}
     */
    this.events={
        'mouseenter .nav-menu-item-pic-container':_highlightSectionCaption,
        'mouseleave .nav-menu-item-pic-container':_highlightSectionCaption,
        'click .nav-menu-item-pic-container':Controllers.App.captureRedirect
    };

    /**
     * Appends HTML to DOM.
     *
     * @param {Core.Region} region. Region instance to display current view in
     * @returns {*}
     */
    this.display=function(region){
        // Set views element, so event delegation will work
        this.setElement(region.el);

        // Create DOM Elements
        // P.S.: creation was not executed on initialization method,
        // because creation does not take a lot of time
        animationsEl=_createSectionHtmlElement(this.model.get('animations'), '/art/animations');
        pictures2dEl=_createSectionHtmlElement(this.model.get('pictures2d'), '/art/2d');
        art3dEl=_createSectionHtmlElement(this.model.get('art3d'), '/art/3d');

        // Append it
        region.el.querySelector('li:nth-child(1)').appendChild(animationsEl);
        region.el.querySelector('li:nth-child(2)').appendChild(pictures2dEl);
        region.el.querySelector('li:nth-child(3)').appendChild(art3dEl);

        // After HTML has been built - create folding elements instances
        // (calculation of position may take some time, so do not display
        // anything, until all preparations are done)
        _createFoldingElements();

        // Display elements
        _displayFoldingElements();

        return this;
    };

    /**
     * Returns whether passed value is HTMLElement
     *
     * @param {*} value. Value to check
     * @returns {boolean}
     */
    var isHTMLElement=function(value){
        return value instanceof HTMLElement;
    };

    /**
     * Removes current view's elements from DOM
     *
     * @returns {*}
     */
    this.remove=function(){
        if(isHTMLElement(animationsEl)){
            animationsEl.parentNode.removeChild(animationsEl);
        }

        if(isHTMLElement(pictures2dEl)){
            pictures2dEl.parentNode.removeChild(pictures2dEl);
        }

        if(isHTMLElement(art3dEl)){
            art3dEl.parentNode.removeChild(art3dEl);
        }

        return this;
    };

    /**
     * Creates HTML element for section
     *
     * @param {Array} images. Images in section
     * @param {string} href. Section hyper reference
     * @returns {HTMLElement}
     * @private
     */
    var _createSectionHtmlElement=function(images, href){
        var section=document.createElement('a'),
            image;

        section.classList.add('nav-menu-item-pic-container');
        section.href=href;

        for(var i=0, end=images.length; i<end; i++){
            image=document.createElement('div');
            image.classList.add('nav-menu-item-pic');
            image.style.backgroundImage='url('+images[i].cover.url+')';

            section.appendChild(image);
        }

        return section;
    };

    /**
     * Creates folding elements instances
     *
     * @private
     */
    var _createFoldingElements=function(){
        var foldingHtmlElements=document.querySelectorAll('.nav-menu-item-pic');

        for(var i=0, end=foldingHtmlElements.length; i<end; i++){
            _foldingElements.push(new FoldingElement(foldingHtmlElements[i]));
        }
    };

    /**
     * Displays folding elements
     *
     * @private
     */
    var _displayFoldingElements=function(){
        for(var i=0, end=_foldingElements.length; i<end; i++){
            _foldingElements[i].toFullHeight().then(function(){

            });
        }
    };

    /**
     * Pictures navigation menu's element class (folding elements)
     *
     * @param {HTMLElement|jQuery} element. Image element
     * @constructor
     */
    function FoldingElement(element){
        /**
         * Object pointer
         *
         * @type {FoldingElement}
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
         * Image HTMLElement
         *
         * @type {null|HTMLElement}
         */
        var _el=null;

        /**
         * Image jQuery object
         *
         * @type {null|jQuery}
         */
        var _$el=null;

        /**
         * CSS position field
         *
         * @type {object}
         * @private
         */
        var _position={};

        /**
         * Whether event listeners were bound to element
         *
         * @type {boolean}
         * @private
         */
        var _areEventsBound=false;

        /**
         * CSS position property
         *
         * @type {object}
         */
        Object.defineProperty(_this, 'position', {
            get:function(){
                return _position;
            }
        });

        /**
         * Sets object
         *
         * @param {jQuery|HTMLElement} value. Image element to set
         * @returns {FoldingElement}
         */
        _this.set=function(value){
            var element=$(value)[0];

            if(!element){
                throw new Error('Invalid argument type: element must be an existing HTMLElement');
            }

            if(!element.classList.contains('nav-menu-item-pic')){
                throw new Error('Invalid argument type: element must be an folding html element');
            }

            _el=element;
            _$el=$(_el);

            _calculatePosition();

            return _this;
        };

        /**
         * Calculates element's css properties
         */
        var _calculatePosition=function(){
            var $parent=_$el.parent(),
                elements=_$el.siblings().size()+1, // Total elements number for current _this.$parent element
                startWidth=$parent.width()/elements, // _this.$object start width value
                endWidth=$parent.width(), // _this.$object end width value
                startHeight=0, // _this.$object start height value
                endHeight=window.innerHeight-$parent.offset().top; // _this.$object end height value

            /**
             * Returns css properties object
             *
             * @param width
             * @param height
             * @param clipY1
             * @param clipX1
             * @param clipY2
             * @param clipX2
             * @returns {object}
             */
            var _toObject=function(width, height, clipY1, clipX1, clipY2, clipX2){
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

            var start=_toObject(startWidth, startHeight, 0, startWidth*(_$el.index()+1), endHeight, startWidth*_$el.index());

            _position={
                start:start,
                end:_toObject(endWidth, endHeight, 0, endWidth, endHeight, 0),
                dropDuration:_getRandDropDuration()
            };
            _$el.data('position', _position);

            // Set start css value
            _$el.css('clip', FoldingElement.clipToString(
                start.clip.y1,
                start.clip.x1,
                start.clip.y2,
                start.clip.x2
            ));
        };

        /**
         * Adds event listeners to current HTML Element
         *
         * @private
         */
        var _addEventListeners=function(){
            if(_areEventsBound){
                return ;
            }

            _el.addEventListener('mouseenter', _this.toFullWidth);
            _el.addEventListener('mouseleave', _this.toDefaultWidth);

            _areEventsBound=true;
        };

        /**
         * Animates image to full height
         *
         * @returns {Core.Promise}
         */
        _this.toFullHeight=function(){
            return new Core.Promise(function(resolve){
                _$el.animate(
                    {height:_this.position.end.height},
                    {
                        duration:_this.position.dropDuration,
                        complete:function(){
                            _addEventListeners();

                            resolve();
                        }
                    }
                );
            });
        };

        /**
         * Animates current element to full size width
         *
         * @returns {FoldingElement}
         */
        _this.toFullWidth=function(){
            _stopCurrentAnimation();

            var duration=_getRandClipDuration();

            // Animate all previous siblings
            var prevItemsSumWidth=0;
            _$el.prevAll().reverse().each(function(index){
                var $this=$(this),
                    css=$this.data('position'),
                    clipX1Value=HIDDEN_ELEMENT_WIDTH*(index+1),
                    clipX2Value=HIDDEN_ELEMENT_WIDTH*index;

                prevItemsSumWidth+=clipX1Value-clipX2Value;

                FoldingElement.animate($this, duration, css.start.clip.y1, clipX1Value, css.start.clip.y2, clipX2Value);
            });

            // Animate all next siblings
            var nextItemsSumWidth=0;
            _$el.nextAll().reverse().each(function(index){
                var $this=$(this),
                    css=$this.data('position'),
                    clipX1Value=css.start.clip.x1+(css.start.width-HIDDEN_ELEMENT_WIDTH)*index,
                    clipX2Value=css.start.clip.x2+(css.start.width-HIDDEN_ELEMENT_WIDTH)*(index+1);

                nextItemsSumWidth+=clipX1Value-clipX2Value;

                FoldingElement.animate($this, duration, css.start.clip.y1, clipX1Value, css.start.clip.y2, clipX2Value);
            });

            // Animate current element
            FoldingElement.animate(_$el, duration, _this.position.start.clip.y1, _this.position.end.clip.x1-nextItemsSumWidth,
                _this.position.start.clip.y2, _this.position.end.clip.x2+prevItemsSumWidth);

            return _this;
        };

        /**
         * Animates current element to default size width
         *
         * @returns {FoldingElement}
         */
        _this.toDefaultWidth=function(){
            _stopCurrentAnimation();

            var duration=_getRandClipDuration(),

            $elements=_$el.siblings(); // Define self container elements collection
            $elements.push(_$el[0]);

            $.each($elements, function(i, element){
                var $element=$(element),
                    css=$element.data('position');

                FoldingElement.animate($element, duration, css.start.clip.y1, css.start.clip.x1, css.start.clip.y2, css.start.clip.x2);
            });

            return _this;
        };

        /**
         * Returns rand drop duration value
         *
         * @returns {number}
         * @private
         */
        var _getRandDropDuration=function(){
            return Math.floor(
                Math.random()*(MAX_DROP_DURATION-MIN_DROP_DURATION)+MIN_DROP_DURATION
            );
        };

        /**
         * Returns rand clip duration value
         *
         * @return {Number}
         */
        var _getRandClipDuration=function(){
            return Math.floor(
                Math.random()*(MAX_CLIP_DURATION-MIN_CLIP_DURATION)+MIN_CLIP_DURATION
            );
        };

        /**
         * Stops animation in current container
         */
        var _stopCurrentAnimation=function(){
            var $parent=_$el.parent();

            $parent.children().stop(true);
        };

        /**
         * Initialization method.
         *
         * Sets element object
         * @param {HTMLElement|jQuery} element. Image element
         */
        (function init(element){
            _this.set(element);
        })(element);
    }

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
    FoldingElement.clipToString=function(y1, x1, y2, x2){
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
    FoldingElement.animate=function(element, duration, y1, x1, y2, x2){
        $(element).animate(
            {clip:FoldingElement.clipToString(y1, x1, y2, x2)},
            {
                duration:duration,
                easing:'linear'
            }
        );
    };
});