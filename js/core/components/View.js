/**
 * Base View constructor
 *
 * @type {constructor}
 */
use('Core').View=Backbone.View.extend(function(){
    /**
     * Add a single event listener to the view's element (or a child element
     * using `selector`). This only works for delegate-able events: not `focus`,
     * `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
     *
     * Besides event object pass view instance
     *
     * @overload
     */
    this.delegate=function(eventName, selector, listener){
        var view=this;

        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, function(event){
            listener(event, view);
        });
    };
});

// Extend view with Backbone.Events
// for triggering custom events
_.extend(Core.View, Backbone.Events);

/**
 * Base Views collection constructor
 *
 * @type {constructor}
 */
Core.ViewCollection=Core.View.extend(function(){
    /**
     * View constructor
     *
     * @type {null|constructor}
     */
    this.view=null;

    /**
     * Initialization function.
     * Defines properties;
     * Fills up collection
     */
    this.initialize=function(){
        this.Views=[];

        this.fillCollection();
    };

    /**
     * Creates view instance
     *
     * @param {*} model. Model to create view for
     * @returns {view}
     */
    this.createViewInstance=function(model){
        return new this.view({model:model});
    };

    /**
     * Adds view to collection
     *
     * @param {*} view. View to add to collection
     * @returns {*}
     */
    this.addView=function(view){
        this.Views.push(view);

        return this;
    };

    /**
     * Fills views collection, based on current model collections
     *
     * @returns {*}
     */
    this.fillCollection=function(){
        for(var i=0, end=this.collection.length; i<end; i++){
            this.addView(this.createViewInstance(this.collection.models[i]));
        }

        return this;
    };

    /**
     * On collection remove callback.
     * Removes all collection's views
     *
     * @returns {*}
     */
    this.remove=function(){
        // Remove all views
        for(var i=0, end=this.Views.length; i<end; i++){
            this.Views[i].remove();
        }

        // Remove current element (if exist)
        if(this.el && this.el.parentNode){
            this.el.parentNode.removeChild(this.el);
        }

        return this;
    };
});

/**
 * Base Layout View constructor
 *
 * @type {constructor}
 */
Core.ViewLayout=Backbone.View.extend();

/**
 * Extends passed object from basic layout
 *
 * @param {object} properties. Object to extend
 * @returns {*|void|Object}
 */
Core.ViewLayout.extend=function(properties){
    return new (Backbone.View.extend.call(this, properties));
};