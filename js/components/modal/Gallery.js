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
     * Current window width value
     *
     * @type {number}
     * @private
     */
    var _width=0;

    /**
     * Current window height value
     *
     * @type {number}
     * @private
     */
    var _height=0;

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
        var modal=new Modal();

        // Specify created modal window
        modal.window().attr('id', OBJECT_ID);
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
                _this.goTo(--_item);
            },
            setNext=function(){
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

        width=Math.max(width, _this.default.minWidth, _width);
        height=Math.max(height, _this.default.minHeight, _height);

        _width=width;
        _height=height;

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
                        _this.toModal().window().show();

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
                    _this.toModal().window().hide();
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
            _this.size($thumb.data('width'), $thumb.data('height'));
            _this.picture(src.replace('thumb_small', 'thumb_big'));

            _this.source(src.replace('thumb_small', 'src'));

            callback();

            // If item index is closed to end(item is in the second half) - load next page
            if(_item>(MAX_ITEMS_NUMBER-1)/2){
                _pagination.load(_page+1);
            }

            // Load next picture in browser cache
            if(Image && _items[item+1]){
                var nextSrc=$(_items[item+1]).find('img').attr('src') || '',
                    nextImage=new Image();

                nextImage.src=nextSrc.replace('thumb_small', 'thumb_big');
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
        if($modal.size()){
            _setModal(new Modal($modal));
            _setControls(
                _modal.window().children('.prev'),
                _modal.window().children('.next')
            );
            _setSource(_modal.window().children('.external-link'));
        }
        else{
            _compile();
        }

        // Add event listeners
        addDefaultsEvents();

        // Save pagination object
        _pagination=pagination;

        // Load current page
        loadPage(_pagination.currentPage);

        return _this;
    })(pagination);
}