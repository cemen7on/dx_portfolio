use('Controllers').Main=Core.Controller.extend(new function(){
    /**
     * Default action for main controller
     *
     * @param {*} match. Query string match
     * @param {null|object} data. Action data. Could be passed as object if
     *  action is called by sync browser page load (not ajax load)
     */
    this.index=function(match, data){
        var facadeModel=new Models.Facade(),
            facadeView;

        if(data){
            facadeModel.set(data);
        }

        facadeModel.fetch().then(function(){
            facadeView=new Views.Main.Index({model:facadeModel});

            Views.Layouts.TopNav.render()
                         .PictureNavRegion.display(facadeView);
        });
    };
});
