use('Views.Art').Pagination=Core.View.extend(function(){
    /**
     * Visible pages number
     *
     * @type {number}
     * @private
     */
    var _visiblePages=4;

    /**
     * Total number of records field
     *
     * @type {number}
     * @private
     */
    var _total=0;

    /**
     * Total number of records property
     *
     * @type {number}
     */
    Object.defineProperty(this, 'total', {
        get:function(){
            return _total;
        },
        set:function(value){
            _total=value;
            this.pagesNumber=Math.ceil(value/this.perPage);
        }
    });

    /**
     * Total number of pages field
     *
     * @type {number}
     * @private
     */
    var _pagesNumber=0;

    /**
     * Total number of pages property
     *
     * @type {number}
     */
    Object.defineProperty(this, 'pagesNumber', {
        get:function(){
            return _pagesNumber;
        },
        set:function(value){
            _pagesNumber=value;
        }
    });

    /**
     * Items number per page
     *
     * @type {number}
     */
    this.perPage=9;

    /**
     * Pagination list element field
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _listEl=null;

    /**
     * Pagination list element property
     *
     * @type {null|HTMLElement}
     */
    Object.defineProperty(this, 'listEl', {
        get:function(){
            return _listEl;
        },
        set:function(value){
            _listEl=value;
            this.$listEl=$(value);
        }
    });

    /**
     * Pagination loader element field
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _loaderEl=null;

    /**
     * Pagination loader element property
     *
     * @type {null|HTMLElement}
     */
    Object.defineProperty(this, 'loaderEl', {
        get:function(){
            return _loaderEl;
        },
        set:function(value){
            _loaderEl=value;
            this.$loaderEl=$(value);
        }
    });

    /**
     * Active page HTML Element field
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _activePageEl=null;

    /**
     * Active page HTML Element field
     *
     * @type {null|HTMLElement}
     */
    Object.defineProperty(this, 'activePageEl', {
        get:function(){
            return _activePageEl;
        },
        set:function(value){
            _activePageEl=value;
            this.$activePageEl=$(value);
        }
    });

    this.tagName='ul';
    this.attributes={
        class:'float-left'
    };

    this.events={
        'click a':function(event){
            if(this.activePageEl){
                this.activePageEl.classList.remove('active');
            }

            this.activePageEl=event.currentTarget.parentNode;
            this.activePageEl.classList.add('active');

            _calculateVisibleSet();

            Controllers.App.captureRedirect(event);
        }
    };

    /**
     * View's initialization
     */
    this.initialize=function(params){
        this.total=params.total || 0;

        this.render();
    };

    /**
     * Creates pagination list element
     *
     * @private
     */
    var _createListEl=function(){
        var pageEl=null,
            linkEl=null,
            pathname=_parsePathName(location.pathname);

        if(this.pagesNumber<=1){
            return ;
        }

        for(var i=1; i<=this.pagesNumber; i++){
            pageEl=document.createElement('li');
            pageEl.className='page';

            if(i==pathname.pageId){
                pageEl.classList.add('active');
                this.activePageEl=pageEl;
            }

            linkEl=document.createElement('a');

            linkEl.href=location.origin+pathname.origin+'/'+i;
            linkEl.textContent=i;

            pageEl.appendChild(linkEl);
            this.el.appendChild(pageEl);
        }

        _calculateVisibleSet();
    };

    /**
     * Since number of pages could be infinitive,
     * we should display only certain number of pages.
     * This method calculates visible set of page elements.
     * Hides all elements, that are not in that set
     *
     * @private
     */
    var _calculateVisibleSet=function(){
        // Do not need to hide anything
        if(this.pagesNumber==_visiblePages){
            return ;
        }

        // Define indexes of pages to display
        var index=this.$activePageEl.index()+1,
            i,
            startIndex=index-1,
            lastIndex,
            lastIndexCalculated,
            selector='';

        // If there is no previous page - start with first one
        if(startIndex<1){
            startIndex=1;
        }

        lastIndexCalculated=startIndex-1+_visiblePages;
        lastIndex=lastIndexCalculated;

        // From start index to calculated end - check for page existence
        for(i=startIndex;  i<=lastIndexCalculated; i++){
            // If page does not exist - move start index to one position back
            // (and last index also)
            if(i>this.pagesNumber){
                startIndex--;
                lastIndex--;
            }
        }

        // Hide pages outside of calculated indexes range
        for(i=startIndex;  i<=lastIndex; i++){
            selector+=':not(:nth-child('+(i)+'))';
        }

        // Clear from previous state
        this.$el.children().removeClass('hidden').removeClass('last');

        // Hide calculated elements
        this.$el.children(selector).addClass('hidden');

        // Mark last non hidden page with css class
        this.$el.children(':not(.hidden):last').addClass('last');
    }.bind(this);

    /**
     * Creates loader element
     *
     * @private
     */
    var _createLoaderEl=function(){
        this.loaderEl=document.createElement('div');
        this.loaderEl.className='float-left loader hidden';
        this.loaderEl.textContent='Loading...';
    }.bind(this);

    /**
     * Parses pathname and returns its components
     *
     * @param {string} pathname. Pathname to parse
     * @returns {object}
     * @private
     */
    var _parsePathName=function(pathname){
        var match=pathname.match(/^(\/art\/(?:animations|2d|3d))(?:\/(\d+))?$/) || [];

        return {
            origin:match[1] || '',
            pageId:match[2] || 1
        };
    };

    /**
     * Creates aside menu element
     *
     * @returns {*}
     */
    this.render=function(){
        _createListEl.bind(this)();
        _createLoaderEl();

        return this;
    };

    /**
     * Appends HTML to DOM.
     *
     * @param {Core.Region} region. Region instance to display current view in
     * @returns {*}
     */
    this.display=function(region){
        region.el.appendChild(this.loaderEl);
        region.el.appendChild(this.el);

        return this;
    };
});

