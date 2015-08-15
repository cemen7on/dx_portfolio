use('Models').Facade=Core.Model.extend(function(){
    this.url=function(){
        return Core.createAbsoluteUrl(location.pathname);
    };

    /**
     * Parses response from server before setting it
     *
     * @param {object} response. Response to parse
     * @returns {object}
     * @override
     */
    this.parse=function(response){
        return response.success;
    };
});
