use('Views.Layouts').TopNav=Core.ViewLayout.extend(function(){
    /**
     * Element's tag name
     *
     * @type {string}
     */
    this.tagName='nav';

    /**
     * Attributes list of element
     *
     * @type {object}
     */
    this.attributes={
        id:'topNavMenu'
    };

    /**
     * Events list
     *
     * @type {object}
     */
    this.events={
        'click .caption':Controllers.App.captureRedirect
    };

    /**
     * Layout's initialization method.
     * Creates region element
     */
    this.initialize=function(){
        this.PictureNavRegion=new Core.Region(this.el);
    };

    /**
     * Active navigation element
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _activeNavEl=null;

    /**
     * Animations navigation element
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _animationsEl=null;

    /**
     * Pictures 2d navigation element
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _pictures2d=null;

    /**
     * Art 3d navigation element
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _art3d=null;

    /**
     * Element's fading duration in milliseconds
     *
     * @type {number}
     */
    var FADE_DURATION=800;

    /**
     * Returns navigation menu HTML Element
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createNavEl=function(){
        var list=document.createElement('ul'),
            createLiEl=function(url, caption){
                var liEl=document.createElement('li'),
                    linkEl=document.createElement('a');

                liEl.className='float-left';

                linkEl.className='caption smooth';
                linkEl.href=url;
                linkEl.textContent=caption;

                liEl.appendChild(linkEl);

                return liEl;
            };

        _animationsEl=createLiEl(Core.createAbsoluteUrl('/art/animations'), 'Animations');
        _pictures2d=createLiEl(Core.createAbsoluteUrl('/art/2d'), 'Pictures 2d');
        _art3d=createLiEl(Core.createAbsoluteUrl('/art/3d'), 'Art 3d');

        list.appendChild(_animationsEl);
        list.appendChild(_pictures2d);
        list.appendChild(_art3d);

        return list;
    }.bind(this);

    /**
     * Render method
     *
     * @returns {*}
     */
    this.render=function(){
        if(this.rendered){
            return this;
        }

        Views.Layouts.Main.render();
        this.el.appendChild(_createNavEl());

        Views.Layouts.Main.el.appendChild(this.el);

        this.rendered=true;

        return this;
    };

    /**
     * Displays navigation menu element
     *
     * @returns {Core.Promise}
     */
    this.display=function(){
        return new Core.Promise(function(resolve){
            this.$el.fadeTo(FADE_DURATION, 1, resolve);
        }.bind(this));
    };


    /**
     * Adds to element "absolute" css class,
     * so that z-index of element increases
     *
     * @returns {*}
     */
    this.toTopLayer=function(){
        this.el.classList.add('absolute');

        return this;
    };

    /**
     * Highlights caption element
     *
     * @param {HTMLElement} captionEl. Caption element to highlight
     * @private
     */
    var _highlightCaption=function(captionEl){
        if(!captionEl){
            return ;
        }

        if(_activeNavEl){
            _activeNavEl.firstChild.classList.remove('active');
        }

        _activeNavEl=captionEl;
        captionEl.firstChild.classList.add('active');
    };

    /**
     * Highlights "Animation" caption
     *
     * @returns {*}
     */
    this.highlightAnimationsCaption=function(){
        _highlightCaption(_animationsEl);

        return this;
    };

    /**
     * Highlights "2d Pictures" caption
     *
     * @returns {*}
     */
    this.highlightPictures2dCaption=function(){
        _highlightCaption(_pictures2d);

        return this;
    };

    /**
     * Highlights "3d Art" caption
     *
     * @returns {*}
     */
    this.highlightArt3dCaption=function(){
        _highlightCaption(_art3d);

        return this;
    };
});