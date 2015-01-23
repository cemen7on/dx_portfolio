/**
 * Event object.
 * Registers an event, enable or disable
 *
 * @param trigger
 * @param type
 * @param handler
 * @constructor
 */
function WindowEvent(trigger, type, handler){
    /**
     * Event pointer
     *
     * @type {Event}
     * @private
     */
    var _this=this;

    /**
     * Event trigger jQuery object
     *
     * @type {jQuery}
     * @private
     */
    var _$trigger=null;

    /**
     * Event type
     *
     * @type {String}
     * @private
     */
    var _type=null;

    /**
     * Event handler
     *
     * @type {function}
     * @private
     */
    var _handler=null;

    /**
     * Sets trigger object
     *
     * @param trigger
     * @private
     */
    var _setTrigger=function(trigger){
        _$trigger=$(trigger);
    };

    /**
     * Sets event type
     *
     * @param type
     * @private
     */
    var _setType=function(type){
        _type=type;
    };

    /**
     * Sets event handler
     *
     * @param handler
     * @private
     */
    var _setHandler=function(handler){
        if(!Object.isFunction(handler)){
            throw new Error('Invalid argument type: handler expected to be a function');
        }

        _handler=handler;
    };

    /**
     * Binds event listener
     *
     * @returns {Event}
     */
    _this.on=function(){
        _$trigger.bind(_type, _handler);

        return _this;
    };

    /**
     * Unbinds event listener
     *
     * @returns {Event}
     */
    _this.off=function(){
        _$trigger.unbind(_type);

        return _this;
    };

    /**
     *
     *
     * @param trigger
     * @param type
     * @param handler
     * @private
     */
    var __construct=function(trigger, type, handler){
        _setTrigger(trigger);
        _setType(type);
        _setHandler(handler);
    };

    __construct(trigger, type, handler);
}

/**
 * Modal window object
 *
 * @param data
 * @constructor
 */
function Modal(data){
    /**
     * Object pointer
     *
     * @type {*}
     * @private
     */
    var _this=this;

    /**
     * Modal window's jQuery object
     *
     * @type {jQuery}
     * @private
     */
    var _$container=null;

    /**
     * Modal window's overlay jQuery object
     *
     * @type {jQuery}
     * @private
     */
    var _$overlay=null;

    /**
     * Structure of a single modal window jQuery element
     *
     * @type {jQuery}
     * @private
     */
    var _$window=null;

    /**
     * jQuery title object
     *
     * @type {jQuery}
     * @private
     */
    var _$title=null;

    /**
     * jQuery content object
     *
     * @type {jQuery}
     * @private
     */
    var _$content=null;


    /**
     * jQuery close btn
     *
     * @type {jQuery}
     * @private
     */
    var _$closeBtn=null;

    /**
     * On hide custom event handler
     *
     * @type function
     */
    _this.onHide=function(){};

    /**
     * Events object.
     * Defines all window's events.
     *
     * @type {object}
     */
    var events=[];

    /**
     * Registers default modal window's event listeners
     */
    var addDefaultEvents=function(){
        events.push(
            new WindowEvent(_this.overlay(), 'click', function(){
                _this.hide();
            })
        );

        events.push(
            new WindowEvent(_this.closeBtn(), 'click', function(){
                _this.hide();
            })
        );

        events.push(
            new WindowEvent($(document), 'keydown', function(event){
                if(event.which!=27){
                    return ;
                }

                _this.hide();
            })
        );
    };

    /**
     * Register's new event for modal window's children
     *
     * @param {jQuery} $subject. Modal window's children. Event subject
     * @param {string} type. Event type
     * @param {function} handler. Event handler
     * @returns {WindowEvent}
     */
    _this.addEventListener=function($subject, type, handler){
        var event=new WindowEvent($subject, type, handler);

        events.push(event);

        return event;
    };

    /**
     * Returns container jQuery object
     *
     * @returns {jQuery}
     */
    _this.container=function(){ return _$container; };

    /**
     * Sets container object
     *
     * @param $container
     * @private
     */
    var _setContainer=function($container){
        _$container=$container;
    };

    /**
     * Returns overlay jQuery object
     *
     * @returns {jQuery}
     */
    _this.overlay=function(){ return _$overlay; };

    /**
     * Sets overlay object
     *
     * @param $overlay
     * @private
     */
    var _setOverlay=function($overlay){
        _$overlay=$overlay;
    };

    /**
     * Returns window jQuery object
     *
     * @returns {jQuery}
     */
    _this.window=function(){ return _$window; };

    /**
     * Sets window object
     *
     * @param $window
     * @private
     */
    var _setWindow=function($window){
        _$window=$window;
    };

    /**
     * Returns title jQuery object
     *
     * @returns {jQuery}
     */
    _this.title=function(){ return _$title; };

    /**
     * Sets title object
     *
     * @param $title
     * @private
     */
    var _setTitle=function($title){
        _$title=$title;
    };

    /**
     * Returns content jQuery object
     *
     * @returns {jQuery}
     */
    _this.content=function(){ return _$content; };

    /**
     * Sets content object
     *
     * @param $content
     * @private
     */
    var _setContent=function($content){
        _$content=$content;
    };

    /**
     * Sets close button object
     *
     * @param $closeBtn
     * @private
     */
    var _setCloseBtn=function($closeBtn){
        _$closeBtn=$closeBtn;
    };

    /**
     * Returns close btn jQuery object
     *
     * @returns {jQuery}
     */
    _this.closeBtn=function(){ return _$closeBtn; };

    /**
     * Creates and compiles modal window's objects
     *
     * @private
     */
    var _compile=function(){
        // Define container
        var $container=$('#modal');
        Boolean($container.size())
            ? _setContainer($container)
            : _setContainer($('<div id="modal" class="vertical-align absolute-size"><div class="center"></div></div>'));

        // Define overlay
        var $overlay=_$container.children('.overlay');
        if(!Boolean($overlay.size())){
            _setOverlay($('<div class="overlay absolute-size"></div>'));

            _$container.append(_$overlay);
        }
        else{
            _setOverlay($overlay);
        }

        // Set window
        _setWindow($('<div class="window inline"></div>'));

        // Set window's title
        _setTitle($('<div class="title"></div>'));

        // Set window's content
        _setContent($('<div class="content"></div>'));

        // Set window's close btn
        _setCloseBtn($('<a class="close" href="javascript:void(0);"><i class="fa fa-times"></i></a>'));

        // Set structure
        _$window.append(_$title).append(_$content).append(_$closeBtn);
        _$container.children('.center').append(_$window);
    };

    /**
     * Append modal window's to DOM
     *
     * @private
     */
    var _append=function(){
        // Hide container and window jQuery elements,
        // until user shows it
        _this.container().hide();
        _this.window().hide();

        $('body').append(_this.container());

        return _this;
    };

    /**
     * Parses passed modal window jQuery object
     *
     * @param selector
     * @private
     */
    var _parse=function(selector){
        var $window=$(selector);

        // Set container object
        _setContainer($('#modal'));
        // Set overlay object
        _setOverlay(_this.container().children('.overlay'));
        // Set window object
        _setWindow($window);
        // Set title object
        _setTitle($window.children('.title'));
        // Set content object
        _setContent($window.children('.content'));
        // Set close button
        _setCloseBtn($window.children('.close'));
    };

    /**
     * Sets modals window params
     *
     * @param data
     */
    _this.data=function(data){
        if(Object.isset(data)){
            return _getData();
        }

        return _setData(data);
    };

    /**
     * Returns current window's data
     *
     * @returns {{title: *, content: *}}
     * @private
     */
    var _getData=function(){
        return {
            title:_this.title().html(),
            content:_this.content().html()
        };
    };

    /**
     * Sets current window's data
     *
     * @param data
     * @private
     */
    var _setData=function(data){
        if(!data){
            return ;
        }

        // Set content
        data.title?_this.title().html(data.title):null;
        data.content?_this.content().html(data.content):null;

        // Set width
        data.width?_this.width(data.width):null;
        data.height?_this.height(data.height):null;
    };

    /**
     * Sets/gets modal window's width
     *
     * @param value
     * @returns {*}
     */
    _this.width=function(value){
        if(Object.isUndefined(value)){
            return _this.content().width();
        }

        _this.content().width(value);

        return _this;
    };

    /**
     * Sets/gets modal window's height
     *
     * @param value
     * @returns {*}
     */
    _this.height=function(value){
        if(Object.isUndefined(value)){
            return _this.content().height();
        }

        _this.content().height(value);

        return _this;
    };

    /**
     * Shows modal window
     *
     * @returns {*}
     */
    _this.show=function(){
        // Show modal window
        _this.container().show();
        _this.window().show();

        for(var i=0; i<=events.length-1; i++){
            // enable event
            events[i].on();
        }

        return _this;
    };

    /**
     * Hides modal window
     *
     * @returns {*}
     */
    _this.hide=function(){
        _this.container().hide();
        _this.window().hide();

        for(var i=0; i<=events.length-1; i++){
            // enable event
            events[i].off();
        }

        _this.onHide();

        return _this;
    };

    (function construct(data){
        // If selector or jQuery instance was passed
        // parse existing object
        if(Object.isString(data) || Object.isJquery(data)){
            _parse(data);
        }
        else if(!Object.isset(data) || Object.isObject(data)){
            // Object property contains either
            // window jquery object or string selector
            if(!Object.isUndefined(data) && data.object){
                _parse(data.object);
            }
            else{
                // Compile and append new modal window object
                _compile();
                _append();
            }

            // Set data
            _setData(data);
        }

        addDefaultEvents();

        return _this;
    })(data);
}