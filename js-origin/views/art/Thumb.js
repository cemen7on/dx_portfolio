use('Views.Art').Thumb=Core.View.extend(function(){
    /**
     * Minimum previews' roll down duration value
     *
     * @type {number}
     */
    var ROLL_DOWN_DURATION_MIN=300;

    /**
     * Maximum previews' roll down duration value
     *
     * @type {number}
     */
    var ROLL_DOWN_DURATION_MAX=1000;

    /**
     * Current element's attribute list
     *
     * @type {{class: string}}
     */
    this.attributes={
        class:'button thumb'
    };

    /**
     * Events list
     *
     * @type {object}
     */
    this.events={
        mouseenter:'triggerEnterState',
        mouseleave:'triggerLeaveState'
    };

    /**
     * Thumb's image HTML element instance property
     *
     * @type {null|HTMLElement}
     */
    this.imageEl=null;

    /**
     * Thumb's image jQuery object
     *
     * @type {null|HTMLElement}
     */
    this.$imageEl=null;

    /**
     * View's initialization.
     * Render current collection
     */
    this.initialize=function(){
        this.render();

        // Add on click event
        if(this.onclick){
            this.events.click=this.onclick;

            // Call delegateEvents, so click event will be bound
            this.delegateEvents();
        }

        // Register events for linking between views
        this.listenTo(this.model, 'aside.enter', this.toggleHighlight);
        this.listenTo(this.model, 'aside.leave', this.toggleHighlight);

        // Trigger click of thumb preview
        this.listenTo(this.model, 'aside.click', function(){
            this.$el.click();
        });
    };

    /**
     * Computes thumb sizes according to current window size
     *
     * @returns {object}
     * @private
     */
    var _computeThumbSize=function(){
        var WIDTH_RATIO=0.15,
            width=Math.floor(window.innerWidth*WIDTH_RATIO);

        var HEIGHT_RATIO=0.7,
            height=Math.floor(width*HEIGHT_RATIO);

        return {width:width, height:height};
    };

    /**
     * Returns drop duration value
     *
     * @returns {number}
     * @private
     */
    var _computeDropDuration=function(){
        return Math.random()*(ROLL_DOWN_DURATION_MAX-ROLL_DOWN_DURATION_MIN)+ROLL_DOWN_DURATION_MIN;
    };

    /**
     * Creates HTML element.
     *
     * @return {*}
     */
    this.render=function(){
        if(!this.model){
            return this;
        }

        this.adjustSize();

        // Create thumb's image
        this.imageEl=document.createElement('div');
        this.imageEl.classList.add('image');
        // this.imageEl.classList.add('animated');
        this.imageEl.innerHTML='<img src="'+this.model.get('smallThumb').url+'" />';
        this.$imageEl=$(this.imageEl);

        this.el.appendChild(this.imageEl);

        // Add event listener on window resize
        // for changing previews size
        var _this=this;
        window.addEventListener('resize', function(){
            _this.adjustSize();
        });

        return this;
    };

    /**
     * Adjust size of current thumb according to size of window
     *
     * @returns {*}
     */
    this.adjustSize=function(){
        var previewSize=_computeThumbSize();

        this.el.style.width=previewSize.width+'px';
        this.el.style.height=previewSize.height+'px';

        return this;
    };

    /**
     * Rolls down current thumb element
     *
     * @return {*}
     */
    this.rollDown=function(){
        if(!this.$imageEl){
            return this;
        }

        this.$imageEl.animate(
            {height:'100%'},
            {
                duration:_computeDropDuration(),
                complete:function(){
                    this.classList.add('animated');
                }
            }
        );

        return this;
    };

    /**
     * Shows current thumb element
     *
     * @returns {*}
     */
    this.show=function(){
        if(!this.imageEl){
            return ;
        }

        this.imageEl.classList.add('animated');

        return this;
    };

    /**
     * Toggles highlight state
     */
    this.toggleHighlight=function(){
        if(!this.el){
            return ;
        }

        var methodName=this.el.classList.contains('hover')?'remove':'add';
        this.el.classList[methodName]('hover');
    };

    /**
     * Triggers select state event in model.
     * It is used for linking events between different views objects.
     * Currently this event is used for highlighting current thumb's title in aside menu
     */
    this.triggerEnterState=function(){
        this.model.trigger('preview.enter');
    };

    /**
     * Triggers unselect state event in model.
     * It is used for linking events between different views objects.
     * Currently this event is used for removing highlight from current thumb title in aside menu
     */
    this.triggerLeaveState=function(){
        this.model.trigger('preview.leave');
    };
});
