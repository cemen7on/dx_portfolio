use('Views.Art').ThumbsCollection=Core.ViewCollection.extend(function(){
    /**
     * Pointer to ThumbsCollection view instance
     *
     * @type {*}
     * @private
     */
    var self=this;

    /**
     * Flag, shows whether thumbs should be rolled down
     *
     * @type {boolean}
     */
    this.rollDown=true;

    /**
     * Object initialization method.
     * Parses initialization params
     *
     * @param {object} params. Object initialization params
     */
    this.initialize=function(params){
        self.__super__.initialize.apply(this, arguments);

        if(params.hasOwnProperty('rollDown')){
            this.rollDown=params.rollDown;
        }
    };

    /**
     * Appends HTML to DOM.
     *
     * @param {Core.Region} region. Region instance to display current view in
     */
    this.display=function(region){
        var view;

        for(var i=0, end=this.Views.length; i<end; i++){
            view=this.Views[i];

            region.append(view);

            if(this.rollDown){
                view.rollDown();
            }
            else{
                view.show();
            }
        }

        return this;
    };
});
