use('Components').Gallery=Backbone.View.extend(function(){
    /**
     * Default values for modal window
     *
     * @type {object}
     */
    var _defaults={
        minWidth:550,
        minHeight:550,

        maxWidth:window.innerWidth-100,
        maxHeight:window.innerHeight-100
    };

    /**
     * Modal window instance
     *
     * @type {null|Components.Modal}
     */
    this.modal=null;

    /**
     * Currently displayed model
     *
     * @type {null|Models.Picture}
     */
    this.model=null;

    /**
     * Sibling image model instance
     *
     * @type {null|Models.Media}
     * @private
     */
    var _siblingModel=null;

    /**
     * Sibling image fetching promise object
     *
     * @type {null|Core.Promise}
     * @private
     */
    var _siblingLoadedPromise=null;

    /**
     * Siblings cache object
     *
     * @type {object}
     * @private
     */
    var _SiblingCache=new Components.Container();

    /**
     * Direction of moving throw gallery.
     * IS either 1 (next) or -1 (prev)
     *
     * @type {number}
     * @private
     */
    var _moveDirection=1;

    /**
     * Disabled or not control by keyboard
     *
     * @type {boolean}
     * @private
     */
    var _offKeyboard=false;

    /**
     * Image element HTML element field
     *
     * @type {null|HTMLElement}
     */
    var _imageEl=null;

    Object.defineProperty(this, 'imageEl', {
        get:function(){
            return _imageEl;
        },
        set:function(value){
            // Remove existing image if exist
            if(_imageEl){
                this.modal.contentEl.removeChild(_imageEl);
            }

            // Only remove
            if(!value){
                return ;
            }

            _imageEl=value;

            // Add new image element
            this.modal.contentEl.appendChild(_imageEl);
        }
    });

    /**
     * Previous control button HTML Element
     *
     * @type {null|HTMLElement}
     */
    this.prevButtonEl=null;

    /**
     * Next control button HTML Element
     *
     * @type {null|HTMLElement}
     */
    this.nextButtonEl=null;

    /**
     * Source button HTML Element
     *
     * @type {null|HTMLElement}
     */
    this.sourceButtonEl=null;

    /**
     * Gallery image property
     *
     * @type {string}
     */
    Object.defineProperty(this, 'image', {
        get:function(){
            return this.imageEl.src;
        },
        set:function(value){
            this.imageEl.src=value;
        }
    });

    /**
     * Gallery source link property
     *
     * @type {string}
     */
    Object.defineProperty(this, 'source', {
        get:function(){
            return this.sourceButtonEl.href;
        },
        set:function(value){
            this.sourceButtonEl.href=value;
        }
    });

    /**
     * Computes window size according to window size, based on specified image size
     *
     * @param {number} width. Specified window width
     * @param {number} height. Specified window height
     * @returns {object}
     * @private
     */
    var _setWindowSize=function(width, height){
        var ratio;

        if(width>_defaults.maxWidth){
            ratio=_defaults.maxWidth/width;

            width=_defaults.maxWidth;
            height=height*ratio;
        }

        if(height>_defaults.maxHeight){
            ratio=_defaults.maxHeight/height;

            height=_defaults.maxHeight;
            width=width*ratio;
        }

        this.modal.width=width;
        this.modal.height=height;
        this.modal.contentEl.style.lineHeight=height+'px';
    }.bind(this);

    /**
     * Create image HTML Element
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createImageEl=function(){
        return document.createElement('img');
    };

    /**
     * Returns control button, specified by type
     *
     * @param {string} type. Control button type
     * @returns {HTMLElement}
     * @private
     */
    var _createControlEl=function(type){
        var typeToCssClass={
                prev:'prev',
                next:'next'
            },
            typeToIcon={
                prev:'left',
                next:'right'
            };

        var buttonEl=document.createElement('button');
        buttonEl.className='controls '+typeToCssClass[type];

        var iconEl=document.createElement('i');
        iconEl.className='fa fa-angle-'+typeToIcon[type];

        buttonEl.appendChild(iconEl);

        return buttonEl;
    };

    /**
     * Returns source button HTML Element
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createSourceEl=function(){
        var linkEl=document.createElement('a');

        linkEl.href='javascript:void(0)';
        linkEl.className='source';
        linkEl.target='_blank';

        var iconEl=document.createElement('i');
        iconEl.className='fa fa-expand';

        linkEl.appendChild(iconEl);

        return linkEl;
    };

    /**
     * Creates and controls modal window for displaying
     *
     * @private
     */
    var _controlModalWindow=function(){
        this.modal=new Components.Modal();

        this.imageEl=_createImageEl();
        this.prevButtonEl=_createControlEl('prev');
        this.nextButtonEl=_createControlEl('next');
        this.sourceButtonEl=_createSourceEl();

        _addEventListeners();

        this.modal.windowEl.appendChild(this.prevButtonEl);
        this.modal.windowEl.appendChild(this.nextButtonEl);
        this.modal.windowEl.appendChild(this.sourceButtonEl);
    }.bind(this);

    /**
     * Object initialization method.
     */
    this.initialize=function(){
        _controlModalWindow();
    };

    /**
     * Add event listeners to gallery elements
     *
     * @private
     */
    var _addEventListeners=function(){
        var _this=this;
        this.prevButtonEl.addEventListener('click', function(){
            _this.switchOver(-1);
        });

        this.nextButtonEl.addEventListener('click', function(){
            _this.switchOver(1);
        });

        document.addEventListener('keydown', function(e){
            if(_offKeyboard){
                return ;
            }

            if(e.keyCode==37){
                this.switchOver(-1);

                e.preventDefault();
            }
            else if(e.keyCode==39){
                this.switchOver(1);

                e.preventDefault();
            }
        }.bind(this));
    }.bind(this);

    /**
     * Load current model's sibling model data
     *
     * @private
     */
    var _loadSibling=function(){
        if(!this.model){
            return ;
        }

        var mediaId=this.model.get('id');
        if(!mediaId){
            return ;
        }

        var siblingType=_moveDirection==1?'next':'prev',
            cache=_SiblingCache.get(mediaId),
            cachedModel=cache[siblingType];

        // cachedModel can contain boolean false value,
        // that is why we have to do comparing with undefined value
        // P.S. cachedModel===false when server returned no data, so there is no data further
        if(cachedModel!==undefined){
            _siblingLoadedPromise=new Core.Promise(function(resolve){
                _siblingModel=cachedModel;

                resolve();
            });
        }
        else{
            _siblingModel=new Models.Media();
            _siblingLoadedPromise=_siblingModel.fetch({url:Core.createAbsoluteUrl('/media/'+mediaId+'/'+siblingType)});

            _siblingLoadedPromise.then(
                function resolve(){
                    if(_siblingModel.isEmpty()){
                        _siblingModel=null;

                        cache[siblingType]=false;
                    }
                    else{
                        // Save object in cache
                        cache[siblingType]=_siblingModel;

                        // Save image in browser cache
                        var data=_siblingModel.attributes,
                            cachedThumb=new Image();

                        if(data.bigThumb.url){
                            cachedThumb.src=data.bigThumb.url;

                            _siblingModel.bigThumbLoaded=false;
                            cachedThumb.onload=function(){
                                _siblingModel.bigThumbLoaded=true;
                            }
                        }
                    }
                },

                function reject(){
                    _siblingModel=null;
                    cache[siblingType]=false;
                }
            );
        }
    }.bind(this);

    /**
     * Saves, displays passed model
     *
     * @private
     */
    var _setModel=function(model){
        this.model=model;

        _displayModel(model);
    }.bind(this);

    /**
     * Adds specified model in siblings cache
     *
     * @param {Models.Media} model. Model to add
     * @param {undefined|Models.Media} prev. Previous sibling model
     * @param {undefined|Models.Media} next. Next sibling model
     * @private
     */
    var _addToCache=function(model, prev, next){
        var modelId=model.get('id');

        if(!_SiblingCache.has(modelId)){
            _SiblingCache.add(modelId, {
                prev:undefined,
                model:model,
                next:undefined
            });
        }

        var cache=_SiblingCache.get(modelId);

        if(prev){
            cache.prev=prev;
        }

        if(next){
            cache.next=next;
        }
    };

    /**
     * Displays model data
     *
     * @private
     */
    var _displayModel=function(model){
        var data=model.attributes;

        if(!data){
            return ;
        }

        _setWindowSize(data.bigThumb.width, data.bigThumb.height);

        // If big thumb is being loaded at the moment,
        // but not completed yet - re create image element,
        // so old thumb will be deleted
        if(model.bigThumbLoaded===false){
            this.imageEl=_createImageEl();
        }

        this.image=data.bigThumb.url;
        this.source=data.source.url;
    }.bind(this);

    /**
     * Enables gallery control
     *
     * @private
     */
    var _enableControl=function(){
        _offKeyboard=false;

        this.prevButtonEl.removeAttribute('disabled');
        this.nextButtonEl.removeAttribute('disabled');
    }.bind(this);

    /**
     * Disables gallery control
     *
     * @private
     */
    var _disableControl=function(){
        _offKeyboard=true;

        this.prevButtonEl.setAttribute('disabled', 'disabled');
        this.nextButtonEl.setAttribute('disabled', 'disabled');
    }.bind(this);

    /**
     * Shows gallery object
     *
     * @returns {*}
     */
    this.show=function(model){
        _setModel(model);
        _addToCache(model);
        _loadSibling();

        _enableControl();

        this.modal.show();

        return this;
    };

    /**
     * Hides gallery objects
     *
     * @returns {*}
     */
    this.hide=function(){
        this.modal.hide();

        // Re create image element, so old thumb will not appear again
        this.imageEl=_createImageEl();

        _disableControl();

        return this;
    };

    /**
     * Switches to sibling specified by direction
     *
     * @param {*} direction. Direction of moving
     * @returns {*}
     */
    this.switchOver=function(direction){
        var directionInt;

        if(direction==='next' || direction===1){
            directionInt=1;
        }
        else if(direction==='prev' || direction===-1){
            directionInt=-1;
        }
        else{
            throw new Error('Invalid argument value: invalid [direction] value');
        }

        // If direction was changed
        // load sibling with new direction
        if(_moveDirection!==directionInt){
            _moveDirection=directionInt;

            _loadSibling();
        }

        // Disable control until image is loaded
        _disableControl();

        // When sibling is loaded
        _siblingLoadedPromise.then(
            function resolve(){
                _enableControl();

                if(!_siblingModel){
                    this.hide();

                    return ;
                }

                // Save link to previous model
                var oldModel=this.model;
                _setModel(_siblingModel);

                var args=[_siblingModel];
                if(directionInt===1){
                    args.push(oldModel);
                }
                else{
                    args.push(null);
                    args.push(oldModel);
                }

                _addToCache.apply(null, args);

                _loadSibling();
            }.bind(this),

            function reject(){
                alert('error occurred');

                this.hide();
            }.bind(this)
        );

        return this;
    };

    /**
     * Sets data to default value in current object
     *
     * @returns {*}
     */
    this.clearState=function(){
        this.model=null;

        _siblingModel=null;
        _siblingLoadedPromise=null;

        _SiblingCache.clear();

        _moveDirection=1;
        _offKeyboard=false;

        return this;
    };
});