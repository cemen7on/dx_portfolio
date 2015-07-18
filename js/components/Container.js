use('Components').Container=function(){
    /**
     * Container object, that contains specified data
     *
     * @type {{object}
     * @private
     */
    var _container={};

    /**
     * Adds specified value by specified key
     *
     * @param {string} key. Key name to lable value
     * @param {string} value. Value to add
     * @returns {*}
     */
    this.add=function(key, value){
        _container[key]=value;

        return this;
    };

    /**
     * Returns whether container contains data by specified key
     *
     * @param {string} key. Data's key
     * @returns {boolean}
     */
    this.has=function(key){
        return _container.hasOwnProperty(key);
    };

    /**
     * Returns data by specified key, or default value if data was not found
     *
     * @param {string} key. Data's key
     * @param {*} defaultValue. Default value to return if data was not found
     * @returns {*}
     */
    this.get=function(key, defaultValue){
        defaultValue=defaultValue || undefined;

        return _container[key] || defaultValue;
    };
};
