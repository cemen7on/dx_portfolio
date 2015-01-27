function Pagination(){
    /**
     * Object pointer
     *
     * @type {Pagination}
     * @private
     */
    var _this=this;

    /**
     * Maximum number of pagination buttons
     *
     * @type {number}
     */
    var MAX_BUTTON_COUNT=4;

    /**
     * Backbone router object
     *
     * @type {null|Backbone.Router}
     */
    var router=null;

    /**
     * Cache object, containing page content
     *
     * @type {Array}
     */
    var cache=[];

    /**
     * Current page index
     *
     * @type {null|int}
     */
    var currentPage=null;

    /**
     * Last page index
     *
     * @type {null|int}
     */
    var lastPage=null;

    /**
     * Total number of pages
     *
     * @type {null|int}
     */
    var pageCount=null;

    /**
     * Read-only property for getting current page index
     */
    Object.defineProperty(_this, 'currentPage', {
        get:function(){
            return currentPage;
        }
    });

    /**
     * Read-only property for getting last page index
     */
    Object.defineProperty(_this, 'lastPage', {
        get:function(){
            return lastPage;
        }
    });

    /**
     * Pagination object jQuery element
     *
     * @type {HTMLElement|jQuery}
     */
    Object.defineProperty(_this, '$object', {
        is_writable:false,
        value:$('.pagination')
    });

    /**
     * Aside menu jquery element
     *
     * @type {*|jQuery}
     */
    var $aside=$('#asideNavMenu').find('ul');

    /**
     * Preview container jquery element
     *
     * @type {*|jQuery|HTMLElement}
     */
    var $preview=$('.art-medium-preview');

    /**
     * Caches data for specific page
     *
     * @param {int} index. Number of page to cache
     * @param {object} data. Data ro cache
     */
    var addToCache=function(index, data){
        if(!Object.isObject(data) && !data.aside || !data.preview){
            throw new Error('Invalid argument: data must contain both aside and preview properties');
        }

        cache[index]=data;

        return _this;
    };

    /**
     * Returns whether page is in cache
     *
     * @param {int} index. Page index
     * @returns {Boolean}
     */
    _this.inCache=function(index){
        return Object.isset(cache[index]);
    };

    /**
     * Returns data from cache for specific page
     *
     * @param {int} index. Page index to get data from
     * @returns {*}
     */
    _this.fromCache=function(index){
        return cache[index];
    };

    /**
     * Loads particular page specified by index
     *
     * @param {int} index. Page number to load
     * @returns {Pagination}
     */
    _this.goTo=function(index){
        if(!Object.isNumber(index) && index<=0){
            throw new Error('Invalid argument type: index must be a positive number');
        }

        // Redirect to specific page
        router.navigate('?page='+index, {trigger: true});

        // Save new current page index
        currentPage=index;

        // Update active page HTML element
        var $buttons=_this.$object.find('li.page'),
            $links=$buttons.children('a');

        $buttons.removeClass('active');

        if(index>=lastPage){
            $links.filter(':contains('+lastPage+')').parent().addClass('active');

            return _this;
        }

        var linkTemplate=location.origin+location.pathname+'?page=',
            $link1=$($links[0]),
            $link2=$($links[1]),
            $link3=$($links[2]),
            $link4=$($links[3]);

        if(index>=MAX_BUTTON_COUNT){
            $link1.text(index-2).attr('href', linkTemplate+(index-2));
            $link2.text(index-1).attr('href', linkTemplate+(index-1));
            $link3.text(index).attr('href', linkTemplate+index);
            $link4.text(index+1).attr('href', linkTemplate+(index+1));

            $($buttons[2]).addClass('active');
        }
        else{
            if(!$links.filter(':contains(1)').size()){
                $link1.text(1).attr('href', linkTemplate+1);
                $link2.text(2).attr('href', linkTemplate+2);
                $link3.text(3).attr('href', linkTemplate+3);
                $link4.text(4).attr('href', linkTemplate+4);
            }

            $links.filter(':contains('+index+')').parent().addClass('active');
        }

        return _this;
    };

    /**
     * On page navigate callback function.
     * Id triggered when page href was changed to new page
     *
     * @param {int} index. Navigated page index
     */
    var onNavigate=function(index){
        _this.load(index, {
            beforeSend:function(){
                Environment.loading=true;

                _this.$object.find('.loader').show();
            },
            success:function(data){
                $aside.html(data.aside);
                $preview.html(data.preview);
            },
            complete:function(){
                Environment.loading=false;

                _this.$object.find('.loader').hide();
            }
        });
    };

    /**
     * Loads page content specified by id
     *
     * @param {int} index. Number of page to load
     * @param {object} custom. Additional request params
     */
    _this.load=function(index, custom){
        if(!Object.isNumber(index) && index<=0){
            throw new Error('Invalid argument type: index must be a positive number');
        }

        index=Number(index);
        custom=custom || {};

        // If loaded page index is more than last page index - do nothing
        if(index>_this.lastPage){
            return ;
        }

        // If request page is in cache
        // We don't need to call ajax method, so trigger all sync function
        // then simulate async call for success callback
        if(cache[index]){
            // Trigger sync beforeSend callback
            custom.beforeSend=custom.beforeSend || function(){};
            custom.beforeSend();

            // simulate async call for callbacks functions
            custom.success=custom.success || function(){};
            custom.complete=custom.complete || function(){};
            setTimeout(function(){
                custom.success(cache[index]);
                custom.complete();
            }, 0);
        }
        else{
            var params={
                url:location.origin+location.pathname+'?page='+index,
                data:{
                    width:Art.thumbWidth,
                    height:Art.thumbHeight
                },
                type:'GET',
                dataType:'json',
                success:function(data){
                    addToCache(index, data);
                }
            };

            Core.Request.send(Core.Object.extend(params, custom));
        }
    };

    /**
     * Object constructor.
     * Configures router object for async pagination
     */
    (function construct(){
        /**
         * Parses specified url and returns page index
         *
         * @param {string} url. Url to parse
         * @returns {*}
         */
        function parsePageIndex(url){
            var template=new RegExp('^.*\/?'+location.pathname.replace(/\//g, '\\/')+'\\?page=(\\d+)$'),
                matches=template.exec(url);

            return matches && !isNaN(matches[1])?Number(matches[1]):1;
        }

        /* CONFIGURE ROUTER */
        if(_this.$object.size()){
            var Routeable=Backbone.Router.extend({
                initialize:function(){
                    this.route(/^\/?\?page=(\d+)$/, onNavigate);
                }
            });

            router=new Routeable();

            Backbone.history.start({root:location.pathname, pushState:true});

            /* BIND EVENT LISTENERS */
            // Register event listener for page clicking.
            // Parse given url for page number and navigate to that page
            _this.$object.find('a').click(function(event){
                if(!Environment.loading){
                    _this.goTo(parsePageIndex($(this).attr('href')));
                }

                event.preventDefault();
            });
        }

        /* INIT PROPERTIES */
        pageCount=_this.$object.data('count') || 1;
        currentPage=parsePageIndex(_this.$object.find('.page.active').children('a').attr('href'));
        lastPage=pageCount;

        /**
         * Fetches from jQuery elements collection outerHTML
         *
         * @param {Array} $collection. jQuery elements collection
         * @returns {string}
         */
        function outerHtml($collection){
            var response='';

            $collection.each(function(){
                response+=this.outerHTML || '';
            });

            return response;
        }

        // Cache init data
        addToCache(currentPage, {
            aside:outerHtml($aside.children()),
            preview:outerHtml($preview.children())
        });
    })();
}