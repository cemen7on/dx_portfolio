use('Views.Art').Video=Views.Art.Thumb.extend(function(){
    /**
     * Current element's attribute list
     *
     * @type {{class: string}}
     */
    this.attributes={
        class:'button thumb video'
    };

    /**
     * Events list
     *
     * @type {object}
     */
    this.events={
        'click':Controllers.Art.play
    };
});
