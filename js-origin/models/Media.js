use('Models').Media=Core.Model.extend(function(){
    /**
     * Parses response from server
     *
     * @param {object} response. Response to parse
     * @returns {object}
     * @override
     */
    this.parse=function(response){
        return response.success;
    };
});