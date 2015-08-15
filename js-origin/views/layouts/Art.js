use('Views.Layouts').Art=Core.ViewLayout.extend(function(){
    /**
     * Thumbs container HTML element
     *
     * @type {null|HTMLElement}
     */
    this.thumbsEl=null;

    /**
     * Aside menu HTML element
     *
     * @type {null|HTMLElement}
     */
    this.asideEl=null;

    /**
     * Aside menu caption element
     *
     * @type {null|HTMLElement}
     * @private
     */
    var _asideCaptionEl=null;

    /**
     * Creates thumbs box HTML structure
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createThumbsStructure=function(){
        var previewEl=document.createElement('div');
        previewEl.className='art-medium-preview clearfix';

        var mediumEl=document.createElement('div');
        mediumEl.className='art-medium';
        mediumEl.appendChild(previewEl);

        var inlineEl=document.createElement('div');
        inlineEl.className='inline';
        inlineEl.appendChild(mediumEl);

        var centerEl=document.createElement('div');
        centerEl.className='center';
        centerEl.appendChild(inlineEl);

        var structureEl=document.createElement('div');
        structureEl.id='art';
        structureEl.className='absolute-size vertical-align';

        structureEl.appendChild(centerEl);

        return {
            structureEl:structureEl,
            mediumEl:mediumEl,
            previewEl:previewEl
        };
    };

    /**
     * Creates Aside menu HTML structure
     *
     * @returns {object}
     * @private
     */
    var _createAsideStructure=function(){
        var captionEl=document.createElement('div');
        captionEl.className='caption';

        var listEl=document.createElement('ul');
        listEl.className='align-left';

        var centerEl=document.createElement('div');
        centerEl.className='center align-left';
        centerEl.appendChild(captionEl);
        centerEl.appendChild(listEl);

        var structureEl=document.createElement('aside');
        structureEl.id='asideNavMenu';
        structureEl.className='absolute-height vertical-align';
        structureEl.appendChild(centerEl);

        return {
            structureEl:structureEl,
            captionEl:captionEl,
            listEl:listEl
        };
    };

    /**
     * Creates pagination element
     *
     * @returns {HTMLElement}
     * @private
     */
    var _createPaginationEl=function(){
        var el=document.createElement('div');
        el.className='pagination';

        return el;
    };

    this.render=function(){
        if(this.rendered){
            return this;
        }

        Views.Layouts.Main.render()
                          .BodyRegion.display(this);

        this.rendered=true;

        return this;
    };

    /**
     * Appends HTML to DOM.
     *
     * @param {Core.Region} region. Region instance to display current view in
     */
    this.display=function(region){
        var thumbsStructureEl=_createThumbsStructure();
        region.el.appendChild(thumbsStructureEl.structureEl);

        this.thumbsEl=thumbsStructureEl.structureEl;

        var asideStructure=_createAsideStructure();
        region.el.appendChild(asideStructure.structureEl);
        _asideCaptionEl=asideStructure.captionEl;

        this.asideEl=asideStructure.structureEl;

        var paginationEl=_createPaginationEl();
        thumbsStructureEl.mediumEl.appendChild(paginationEl);

        // Create regions
        this.ThumbsRegion=new Core.Region(thumbsStructureEl.previewEl);
        this.AsideRegion=new Core.Region(asideStructure.listEl);
        this.PaginationRegion=new Core.Region(paginationEl);
    };

    /**
     * Removes view from DOM.
     * Resets object state
     *
     * @returns {*}
     */
    this.remove=function(){
        this.thumbsEl.remove();
        this.asideEl.remove();

        this.rendered=false;

        return this;
    };

    /**
     * Sets caption to aside menu
     *
     * @param {string} caption. Caption to set
     * @returns {*}
     */
    this.setAsideCaption=function(caption){
        _asideCaptionEl.textContent=caption;

        return this;
    };
});
