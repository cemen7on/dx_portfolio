use('Views.Art').Aside=Core.View.extend(function(){
    /**
     * Element's tag name
     *
     * @type {string}
     */
    this.tagName='li';

    /**
     * Events list
     *
     * @type {object}
     */
    this.events={
        click:'triggerClickState',
        mouseenter:'triggerEnterState',
        mouseleave:'triggerLeaveState'
    };

    /**
     * Link HTML element
     *
     * @type {null|HTMLElement}
     */
    this.linkEl=null;

    /**
     * View's initialization
     */
    this.initialize=function(){
        // Register events for linking between views
        this.listenTo(this.model, 'preview.enter', this.toggleHighlight);
        this.listenTo(this.model, 'preview.leave', this.toggleHighlight);

        this.render();
    };

    /**
     * Creates aside menu element
     *
     * @returns {*}
     */
    this.render=function(){
        if(!this.model){
            return this;
        }

        this.linkEl=document.createElement('a');

        this.linkEl.href='javascript:void(0)';
        this.linkEl.title=this.model.get('title');
        this.linkEl.textContent=this.model.get('title');

        this.el.appendChild(this.linkEl);

        return this;
    };

    /**
     * Triggers click state event in model.
     * It is used for linking events between different views objects.
     * Currently this event is used for opening current thumb in modal window
     */
    this.triggerClickState=function(){
        this.model.trigger('aside.click');
    };

    /**
     * Toggles highlight state
     */
    this.toggleHighlight=function(){
        if(!this.linkEl){
            return ;
        }

        var methodName=this.linkEl.classList.contains('hover')?'remove':'add';
        this.linkEl.classList[methodName]('hover');
    };

    /**
     * Triggers select state event in model.
     * It is used for linking events between different views objects.
     * Currently this event is used for highlighting current thumb's in art-preview box
     */
    this.triggerEnterState=function(){
        this.model.trigger('aside.enter');
    };

    /**
     * Triggers unselect state event in model.
     * It is used for linking events between different views objects.
     * Currently this event is used for removing highlight from current thumb in art-preview box
     */
    this.triggerLeaveState=function(){
        this.model.trigger('aside.leave');
    };
});
