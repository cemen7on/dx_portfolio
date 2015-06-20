use('Views.Layouts').Art=Core.ViewLayout.extend(function(){
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
        previewEl.className='art-medium-preview';

        var mediumEl=document.createElement('div');
        mediumEl.className='art-medium clearfix';
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

    this.render=function(){
        if(this.rendered){
            return this;
        }

        var thumbsStructureEl=_createThumbsStructure();
        Views.Layouts.Main.el.appendChild(thumbsStructureEl.structureEl);

        var asideStructure=_createAsideStructure();
        Views.Layouts.Main.el.appendChild(asideStructure.structureEl);
        _asideCaptionEl=asideStructure.captionEl;

        // Create regions
        this.ThumbsRegion=new Core.Region(thumbsStructureEl.previewEl);
        this.AsideRegion=new Core.Region(asideStructure.listEl);

        this.rendered=true;

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
