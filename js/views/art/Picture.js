use('Views.Art').Picture=Views.Art.Thumb.extend(function(){
    /**
     * Current element's attribute list
     *
     * @type {{class: string}}
     */
    this.attributes={
        class:'button thumb picture'
    };

    /**
     * Events list
     *
     * @type {object}
     */
    this.events={
        'click':Controllers.Art.modal
    };
});
