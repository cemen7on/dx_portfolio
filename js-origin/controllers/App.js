use('Controllers').App=Core.Controller.extend(new function(){
    /**
     * Handles all app's redirects
     *
     * @param event
     */
    this.captureRedirect=function(event){
        if(!event){
            return ;
        }

        if(!event.currentTarget.href){
            return ;
        }

        event.preventDefault();
        App.redirect(event.currentTarget.href);
    };
});
