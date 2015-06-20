use('Views.Art').PicturesCollection=Core.ViewCollection.extend(function(){
    /**
     * View constructor to create collection of
     *
     * @type {Views.Art.Picture}
     */
    this.view=Views.Art.Picture;

    /**
     * Flag, shows whether thumbs should be rolled down
     *
     * @type {boolean}
     * @private
     */
    var _rollDown=true;

    /**
     * Object initialization method.
     * Parses initialization params
     *
     * @param {object} params. Object initialization params
     */
    this.initialize=function(params){
        this.__super__.initialize.apply(this, arguments);

        if(params.hasOwnProperty('rollDown')){
            _rollDown=params.rollDown;
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

            /*
            if(_rollDown){
                view.rollDown();
            }
            else{
                view.show();
            }
            */

            view.rollDown();
        }

        return this;
    };
});
