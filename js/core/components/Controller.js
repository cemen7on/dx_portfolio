use('Core').Controller=new function(){
    /**
     * Prototype for container object
     *
     * @type {object}
     */
    var PContainer=new function(){
        /**
         * Container object
         *
         * @type {*}
         */
        this._container={};

        /**
         * Add item to container
         *
         * @param {string} key. Item key
         * @param {*} value. Item value
         */
        this.set=function(key, value){
            this._container[key]=value;

            return this;
        };

        /**
         * Checks whether container has particular item
         *
         * @param {string} key. Item key
         * @returns {boolean}
         */
        this.has=function(key){
            return this._container.hasOwnProperty(key);
        };

        /**
         * Returns item by specified key.
         * If item was not found - sets item with defaultValue
         *
         * @param {string} key. Item key
         * @param {*} defaultValue. Default value for item
         */
        this.get=function(key, defaultValue){
            if(!this.has(key)){
                this.set(key, defaultValue);
            }

            return this._container[key];
        };
    };

    /**
     * Extends passed child object with base controller functionality
     *
     * @param {null|object} child. Extendable object
     * @return {object}
     */
    this.extend=function(child){
        child=child || {};

        /*
        // Views container
        child.Views=Object.create(PContainer);
        // Models container
        child.Models=Object.create(PContainer);
        // Collections container
        child.Collections=Object.create(PContainer);
        */

        return child;
    }
};
