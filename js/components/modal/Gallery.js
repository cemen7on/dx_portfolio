function Gallery(pagination){
    /**
     * Preview modal window id attribute
     *
     * @type {string}
     */
    var OBJECT_ID='preview';

    /**
     * Maximum items om page number
     *
     * @type {number}
     */
    var MAX_ITEMS_NUMBER=9;

    /**
     * Object pointer
     *
     * @type {Gallery}
     * @private
     */
    var _this=this;

    /**
     * Array of thumb jQuery elements
     *
     * @type {Array}
     * @private
     */
    var _items=[];

    /**
     * Current page index
     *
     * @type {number}
     * @private
     */
    var _page=1;

    /**
     * Current item index
     *
     * @type {number}
     * @private
     */
    var _item=0;

    /**
     * Pagination object
     *
     * @type {Pagination}
     * @private
     */
    var _pagination=null;

    /**
     * Default modal window's data
     *
     * @type {{minWidth: number, minHeight: number, maxWidth: number, maxHeight: number}}
     */
    _this.default={
        minWidth:550,
        minHeight:550,

        maxWidth:1024,
        maxHeight:768
    };

    /**
     * Modal window instance
     *
     * @type {Modal}
     * @private
     */
    var _modal=null;

    /**
     * Sibling image object
     *
     * @type {Image}
     * @private
     */
    var _siblingImage=new Image();

    /**
     * Images switching direction.
     * Possible values +1 or -1
     *
     * @type {number}
     * @private
     */
    var _direction=1;

    /**
     * Current picture jQuery object
     *
     * @type {jQuery}
     * @private
     */
    var _$picture=null;

    /**
     * Previous control button
     *
     * @type {jQuery}
     * @private
     */
    var _$prev=null;

    /**
     * Next control button
     *
     * @type {jQuery}
     * @private
     */
    var _$next=null;

    /**
     * Picture source link jQuery element
     *
     * @type {jQuery}
     * @private
     */
    var _$source=null;

    /**
     * Sets modal object
     *
     * @param modal
     * @private
     */
    var _setModal=function(modal){
        if(!modal instanceof Modal){
            throw new Error('Invalid argument type: modal expected to be an Modal instance');
        }

        _modal=modal;
    };

    /**
     * Parses modal window object
     *
     * @private
     */
    var _parse=function(){
        _setModal(new Modal(OBJECT_ID));

        _setControls(
            _modal.window().children('.prev'),
            _modal.window().children('.next')
        );

        _setSource(_modal.window().children('.external-link'));
    };

    /**
     * Compiles new modal window object.
     * Sets all necessary content
     *
     * @private
     */
    var _compile=function(){
        // Create blank picture object
        _setPicture($('<img />'));
        // Create control buttons
        _setControls(
            $('<a class="controls prev" href="javascript:void(0);"><i class="fa fa-angle-left"></i></a>'),
            $('<a class="controls next" href="javascript:void(0);"><i class="fa fa-angle-right"></i></a>')
        );
        // Create external link
        _setSource(
            $('<a class="source" href="javascript:void(0);" target="_blank"><i class="fa fa-expand"></i></a>')
        );

        // Create new modal window
        var modal=new Modal(OBJECT_ID);

        modal.content().html(_$picture);
        modal.window().append(_$prev).append(_$next).append(_$source);

        _setModal(modal);
    };

    /**
     * Returns modal window
     *
     * @returns {Modal}
     */
    _this.toModal=function(){ return _modal; };

    /**
     * Sets picture jQuery object
     *
     * @param $picture
     * @private
     */
    var _setPicture=function($picture){
        _$picture=$picture;
    };

    /**
     * Sets control buttons
     *
     * @param $prev
     * @param $next
     * @private
     */
    var _setControls=function($prev, $next){
        _$prev=$prev;
        _$next=$next;
    };

    /**
     * Sets pictures source jQuery element
     *
     * @param {jQuery} $source. External link jQuery element
     * @private
     */
    var _setSource=function($source){
        _$source=$source;
    };

    /**
     * Registers default events for preview modal window
     */
    var addDefaultsEvents=function(){
        var setPrevious=function(){
                setDirection('backward');

                _this.goTo(--_item);
            },
            setNext=function(){
                setDirection('forward');

                _this.goTo(++_item);
            };

        // Register control events for buttons
        _this.toModal().addEventListener(_$prev, 'click', setPrevious);
        _this.toModal().addEventListener(_$next, 'click', setNext);

        // Register control events for keyboard
        _this.toModal().addEventListener(document, 'keydown', function(event){
            if(event.which!=37){
                return ;
            }

            setPrevious();
        });
        _this.toModal().addEventListener(document, 'keydown', function(event){
            if(event.which!=39){
                return ;
            }

            setNext();
        });
    };

    /**
     * Initialization method for sibling image object.
     * Setups properties, registers callbacks
     */
    var initSiblingImage=function(){
        /**
         * Shows whether sibling image has be loaded already or not.
         *
         * @type {boolean}
         */
        _siblingImage.isLoaded=false;
        _siblingImage.addEventListener('load', function(){
            _siblingImage.isLoaded=true;
        });
    };

    /**
     * Sets switching direction by value
     *
     * @param {*} value. Value to define direction by
     */
    var setDirection=function(value){
        var dir;
        if(value=='forward' || (value && value>0)){
            dir=1;
        }
        else if(value=='backward' || (value && value<=0) || !value){
            dir=-1;
        }
        else{
            throw new Error('Undefined direction index');
        }

        _direction=dir;
    };

    /**
     * Sets/Gets current object picture url
     *
     * @param {string} url. Url to set up
     * @returns {*}
     */
    _this.picture=function(url){
        if(Object.isUndefined(url)){
            return _$picture.attr('src');
        }

        if(Object.isNull(url)){
            _$picture.removeAttr('src').hide();
        }

        _$picture.attr('src', url).show();

        return _this;
    };

    /**
     * Sets/Gets current source link
     *
     * @param {string} url. Url to set up
     * @returns {*}
     */
    _this.source=function(url){
        if(Object.isUndefined(url)){
            return _$source.attr('href');
        }

        _$source.attr('href', url);

        return _this;
    };

    /**
     * Sets preview box's size
     *
     * @param {int} width. Box width
     * @param {int} height. Box height
     * @returns {Gallery}
     */
    _this.size=function(width, height){
        var ratio;

        if(width>_this.default.maxWidth){
            ratio=_this.default.maxWidth/width;

            width=_this.default.maxWidth;
            height=height*ratio;
        }

        if(height>_this.default.maxHeight){
            ratio=_this.default.maxHeight/height;

            height=_this.default.maxHeight;
            width=width*ratio;
        }

        _this.toModal().width(width);
        _this.toModal().height(height);
        _this.toModal().content().css('line-height', height+'px');

        return _this;
    };

    /**
     * Loads specific page.
     * Saves page index and received items
     *
     * @param {int} index. Page index to load
     * @param {object} custom. Additional request params
     */
    var loadPage=function(index, custom){
        var params={
            success:function(data){
                // Save specified page index as current and received items
                _page=index;
                _items=$(data.preview).filter('.thumb');
            }
        };

        _pagination.load(index, Core.Object.extend(params, custom));
    };

    /**
     * Replace small thumb url with given needle and value
     *
     * @param {String} haystack. Small thumb url
     * @param {String} needle. Picture size to replace by
     * @param {String} value. New picture name
     * @returns {string}
     */
    var replaceUrl=function(haystack, needle, value){
        var url;

        url=haystack.substr(0, haystack.indexOf('thumb_small'));
        url+=needle+'/'+value;

        return url;
    };

    /**
     * Shows image at current index
     *
     * @param {int} item. Thumb's index to load
     * @param {int|undefined} page. Page's index to load thumb from.
     * @param {function|undefined} callback. Callback function, is triggered when image is loaded in gallery
     *  If not defined - use current page
     * @returns {Gallery}
     */
    _this.goTo=function(item, page, callback){
        item=item || 0;
        callback=callback || function(){};

        // If page number is defined - load page and then go to specific item
        if(Object.isset(page)){
            // If page index is below or equal zero or more than last-page index - close preview gallery
            if(page<=0 || page>_pagination.lastPage){
                _this.hide();

                return _this;
            }

            var params={
                success:function(){
                    _this.goTo(item, null, function(){
                        _this.toModal().showWindow();

                        callback();
                    });
                },
                error:function(){
                    _this.hide(); // Something went wrong...
                }
            };

            // If data is in cache there is no need to hide window,
            // just set new picture
            if(!_pagination.inCache(page)){
                params.beforeSend=function(){
                    _this.toModal().hideWindow();
                };
            }

            loadPage(page, params);
        }
        // Else - go to specific item from current page
        else{
            if(item<0){
                // If specific item index is below zero
                // then load previous page and display last picture
                _this.goTo(MAX_ITEMS_NUMBER-1, --_page);

                return _this;
            }

            // If specific item index is more than items-on-page number
            // then load next page and display first picture
            if(item>_items.length-1){
                _this.goTo(0, ++_page);

                return _this;
            }

            // Item index is normal.
            // Save specific item as current.
            _item=item;

            // Display picture with this index.
            var $thumb=$(_items[item]),
                src=$thumb.find('img').attr('src') || '';

            // Set new picture

            // If sibling image has not been loaded yet
            // remove whole picture object in order to show picture loading process
            if(!_siblingImage.isLoaded){
                _this.picture(null);
            }

            _this.size($thumb.data('width'), $thumb.data('height'));

            _this.picture(replaceUrl(src, 'thumb_big', $thumb.data('big-thumb')));
            _this.source(replaceUrl(src, 'src', $thumb.data('src')));

            callback();

            // If item index is closed to end(item is in the second half) - load next page
            if(_item>(MAX_ITEMS_NUMBER-1)/2){
                _pagination.load(_page+1);
            }

            // Load next or previous picture (depending on direction) in browser cache
            _siblingImage.isLoaded=false;
            if(_items[item+1*_direction]){
                var nextSrc=$(_items[item+1*_direction]).find('img').attr('src') || '';

                _siblingImage.src=nextSrc.replace('thumb_small', 'thumb_big');
            }
        }

        return _this;
    };

    /**
     * Shows current modal window
     *
     * @returns {Gallery}
     */
    _this.show=function(){
        _this.toModal().show();

        return _this;
    };

    /**
     * Hides current modal window
     *
     * @returns {Gallery}
     */
    _this.hide=function(){
        _this.toModal().hide();

        return _this;
    };

    /**
     * Class constructor
     * Fetches preview modal window.
     *  If exist - find one
     *  If no exist - compile
     * Set data
     *
     * @param {null|string} picture
     * @returns {Gallery}
     * @private
     */
    (function construct(pagination){
        // Init modal window object
        var $modal=$('#'+OBJECT_ID);
        $modal.size()
            ? _parse()
            : _compile();

        addDefaultsEvents();

        initSiblingImage();

        // Save pagination object
        _pagination=pagination;

        // Load current page
        loadPage(_pagination.currentPage);

        return _this;
    })(pagination);
}