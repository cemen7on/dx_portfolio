use('Components').Modal=Backbone.View.extend(function(){
    /**
     * Events container
     *
     * @type {Array}
     * @private
     */
    var _Events=[];

    /**
     * Whether modal window is hidden field
     *
     * @type {boolean}
     * @private
     */
    var _isHidden=true;

    /**
     * Whether modal window is hidden property
     *
     * @type {boolean}
     * @readonly
     */
    Object.defineProperty(this, 'isHidden', {
        get:function(){
            return _isHidden;
        }
    });

    /**
     * Modal windows' container HTML element
     *
     * @type {null|HTMLElement}
     */
    this.containerEl=null;

    /**
     * Modal windows' overlay HTML element
     *
     * @type {null|HTMLElement}
     */
    this.overlayEl=null;

    /**
     * Current modal window HTML element
     *
     * @type {null|HTMLElement}
     */
    this.windowEl=null;

    /**
     * Current modal window's title HTML element
     *
     * @type {null|HTMLElement}
     */
    this.titleEl=null;

    /**
     * Current modal window's content HTML element
     *
     * @type {null|HTMLElement}
     */
    this.contentEl=null;

    /**
     * Current modal window's close button HTML element
     *
     * @type {null|HTMLElement}
     */
    this.closeEl=null;

    /**
     * Model's window width value property
     *
     * @type {int}
     */
    Object.defineProperty(this, 'width', {
        get:function(){
            return this.contentEl.clientWidth;
        },
        set:function(value){
            return this.contentEl.style.width=value+'px';
        }
    });

    /**
     * Model's window height value property
     *
     * @type {int}
     */
    Object.defineProperty(this, 'height', {
        get:function(){
            return this.contentEl.clientHeight;
        },
        set:function(value){
            this.contentEl.style.height=value+'px';
        }
    });

    /**
     * Model's window content property
     *
     * @type {*}
     */
    Object.defineProperty(this, 'content', {
        get:function(){
            return this.contentEl;
        },
        set:function(value){
            $(this.contentEl).html(value);
        }
    });

    /**
     * On modal window show callback function
     *
     * @type {function}
     */
    this.onshow=function(){};

    /**
     * On modal window hide callback function
     *
     * @type {function}
     */
    this.onhide=function(){};

    /**
     * On instance creation.
     * Creates HTML structure
     */
    this.initialize=function(){
        _createHTMLStructure();
        _addDefaultEvents();
    };

    /**
     * Returns container HTML element.
     *
     * @returns {HTMLElement}
     * @private
     */
    var _getContainerEl=function(){
        var el=document.getElementById('modal');

        if(!el){
            el=document.createElement('div');
            el.id='modal';
            el.className='vertical-align absolute-size hidden';

            document.body.appendChild(el);
        }

        return el;
    };

    /**
     * Returns overlay HTML element
     *
     * @type {HTMLElement}
     * @private
     */
    var _getOverlayEl=function(){
        var el=this.containerEl.querySelector('.overlay');

        if(!el){
            el=document.createElement('div');
            el.className='overlay absolute-size';

            this.containerEl.appendChild(el);
        }

        return el;
    }.bind(this);

    /**
     * Returns window HTML element
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createWindowEl=function(){
        var el=document.createElement('div');

        el.className='window inline hidden';

        return el;
    };

    /**
     * Returns title HTML element
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createTitleEl=function(){
        var el=document.createElement('div');
        el.className='title';

        return el;
    };

    /**
     * Returns content HTML element
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createContentEl=function(){
        var el=document.createElement('div');
        el.className='content';

        return el;
    };

    /**
     * Returns close HTML element
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createCloseEl=function(){
        var el=document.createElement('a');
        el.href='javascript:void(0)';
        el.className='close';

        var icon=document.createElement('i');
        icon.className='fa fa-times';

        el.appendChild(icon);

        return el;
    };

    /**
     * Creates modal window's structure HTML elements
     *
     * @private
     */
    var _createHTMLStructure=function(){
        this.containerEl=_getContainerEl();

        this.overlayEl=_getOverlayEl();

        var centerEl=this.containerEl.querySelector('.center');
        if(!centerEl){
            centerEl=document.createElement('div');
            centerEl.className='center align-center';

            this.containerEl.appendChild(centerEl);
        }

        this.windowEl=_createWindowEl();
        this.titleEl=_createTitleEl();
        this.contentEl=_createContentEl();
        this.closeEl=_createCloseEl();

        this.windowEl.appendChild(this.titleEl);
        this.windowEl.appendChild(this.contentEl);
        this.windowEl.appendChild(this.closeEl);

        centerEl.appendChild(this.windowEl);
    }.bind(this);

    /**
     * Add default events to current modal window
     *
     * @private
     */
    var _addDefaultEvents=function(){
        _Events.push(new ModalEvent(this.overlayEl, 'click', this.hide.bind(this)));
        _Events.push(new ModalEvent(this.closeEl, 'click', this.hide.bind(this)));

        var _this=this;
        _Events.push(new ModalEvent(document, 'keydown', function(event){
            if(event.which!=27){
                return ;
            }

            _this.hide();
        }));
    }.bind(this);

    /**
     * Shows modal window
     *
     * @returns {*}
     */
    this.show=function(){
        if(!_isHidden){
            return this;
        }

        this.containerEl.classList.remove('hidden');
        this.windowEl.classList.remove('hidden');

        for(var i=0, end=_Events.length; i<end; i++){
            _Events[i].on();
        }

        this.onshow();

        _isHidden=false;

        return this;
    };

    /**
     * Hides modal window
     *
     * @returns {*}
     */
    this.hide=function(){
        if(_isHidden){
            return this;
        }

        this.containerEl.classList.add('hidden');
        this.windowEl.classList.add('hidden');

        for(var i=0, end=_Events.length; i<end; i++){
            _Events[i].off();
        }

        this.onhide();

        _isHidden=true;

        return this;
    };

    /**
     * Event object.
     * Registers an event, enable or disable
     *
     * @param {HTMLElement|string|*} target. Event target
     * @param {string} type. Event type
     * @param {function} handler. Event handler
     * @constructor
     */
    function ModalEvent(target, type, handler){
        /**
         * Event target field
         *
         * @type {null|HTMLElement}
         * @private
         */
        var _target=null;

        /**
         * Event target property
         *
         * @type {null|HTMLElement}
         */
        Object.defineProperty(this, 'target', {
            get:function(){
                return _target;
            },
            set:function(value){
                _target=$(value)[0];
            }
        });

        /**
         * Event type field
         *
         * @type {string}
         * @private
         */
        var _type=null;

        /**
         * Event type property
         *
         * @type {string}
         */
        Object.defineProperty(this, 'type', {
            get:function(){
                return _type;
            },
            set:function(value){
                if(!Object.isString(value)){
                    throw new Error('Invalid property type: Event.type must be a string');
                }

                _type=value;
            }
        });

        /**
         * Event handler field
         *
         * @type {function}
         * @private
         */
        var _handler=function(){};

        /**
         * Event handler property
         *
         * @type {function}
         */
        Object.defineProperty(this, 'handler', {
            get:function(){
                return _handler;
            },
            set:function(value){
                if(!Object.isFunction(value)){
                    throw new Error('Invalid property type: Event.handler must be a function');
                }

                _handler=value;
            }
        });

        /**
         * Binds event listener
         *
         * @returns {Event}
         */
        this.on=function(){
            this.target.addEventListener(this.type, this.handler);

            return this;
        };

        /**
         * Unbinds event listener
         *
         * @returns {Event}
         */
        this.off=function(){
            this.target.removeEventListener(this.type, this.handler);

            return this;
        };

        /**
         * Object initialization function
         */
        (function init(){
            this.target=target;
            this.type=type;
            this.handler=handler;
        }.bind(this)());
    }
});
