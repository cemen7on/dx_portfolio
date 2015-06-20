use('Views.Art').AsideCollection=Core.ViewCollection.extend(function(){
    /**
     * View constructor to create collection of
     *
     * @type {Views.Art.Aside}
     */
    this.view=Views.Art.Aside;

    /**
     * Appends HTML to DOM.
     *
     * @param {Core.Region} region. Region instance to display current view in
     */
    this.display=function(region){
        for(var i=0, end=this.Views.length; i<end; i++){
            region.append(this.Views[i]);
        }

        return this;
    };
});
