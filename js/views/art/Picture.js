use('Views.Art').Picture=Core.View.extend(function(){
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
        class:'button thumb picture'
    };

    /**
     * Thumb's image HTML element instance field
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _imageEl=null;

    /**
     * Thumb's image HTML element instance property
     *
     * @type {null|HTMLElement}
     */
    Object.defineProperty(this, 'imageEl', {
        get:function(){
            return _imageEl;
        },
        set:function(value){
            _imageEl=value;
            this.$imageEl=$(value);
        }
    });

    /**
     * Events list
     *
     * @type {object}
     */
    this.events={
        'click':Controllers.Art.modal
    };

    /**
     * View's initialization.
     * Render current collection
     */
    this.initialize=function(){
        this.render();
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

        var mediaId=this.model.get('mediaId'),
            data=this.model.get('data');

        if(!mediaId || !data || (Array.isArray(data) && !data.length)){
            return this;
        }

        this.el.id='art'+mediaId;
        this.adjustSize();

        // Create thumb's image
        this.imageEl=document.createElement('div');
        this.imageEl.classList.add('image');
        // this.imageEl.classList.add('animated');
        this.imageEl.innerHTML='<img src="'+data.smallThumb.url+'" />';
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
});
