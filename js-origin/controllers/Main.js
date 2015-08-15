use('Controllers').Main=Core.Controller.extend(new function(){
    /**
     * Default action for main controller
     *
     * @param {*} queryString. Query string
     * @param {null|object} data. Action data. Could be passed as object if
     *  action is called by sync browser page load (not ajax load)
     */
    this.index=function(queryString, data){
        var facadeModel=new Models.Facade(),
            facadeView;

        if(data){
            facadeModel.set(data);
        }

        facadeModel.fetch().then(function(){
            facadeView=new Views.Main.Index({model:facadeModel});

            Views.Layouts.Main.render()
                              .BodyRegion.empty();

            Views.Layouts.TopNav.render()
                                .reset()
                                .PictureNavRegion.display(facadeView);
        });
    };
});
