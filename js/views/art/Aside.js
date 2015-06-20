use('Views.Art').Aside=Core.View.extend(function(){
    /**
     * Element's tag name
     *
     * @type {string}
     */
    this.tagName='li';

    /**
     * View's initialization
     */
    this.initialize=function(){
        this.render();
    };

    /**
     * Creates aside menu element
     *
     * @returns {*}
     */
    this.render=function(){
        var linkEl=document.createElement('a'),
            data=this.model.get('data');

        linkEl.href='javascript:void(0)';
        linkEl.title=data.title;
        linkEl.textContent=data.title;

        this.el.appendChild(linkEl);

        return this;
    };
});
