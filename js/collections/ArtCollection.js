use('Collections').ArtCollection=Core.Collection.extend(function(){
    this.model=Models.Media;
    this.url=function(){
        return Core.createAbsoluteUrl(location.pathname);
    };

    /**
     * Total records number
     *
     * @type {number}
     */
    this.total=0;

    /**
     * Initialize collection from passed data
     *
     * @param {object} data. Data to set
     * @returns {*}
     */
    this.init=function(data){
        this.total=data.total;

        return this.set(data.data);
    };

    /**
     * Parses response from server before
     *
     * @param {object} response. Response to parse
     * @returns {object}
     * @override
     */
    this.parse=function(response){
        this.total=response.total;

        return response.data;
    };
});
