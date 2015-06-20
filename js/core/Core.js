var Core=new function(){
    /**
     * Returns object reference, specified by chain.
     * If object in chain does not exist creates new one.
     *
     * @param {string} chain. Nested objects chain separated by dots(e.g. Object1.Object2.Object3)
     * @returns {object}
     */
    this.use=function(chain){
        var objects=!Array.isArray(chain)?chain.split('.'):chain,
            current={};

        if(!objects.length){
            return current;
        }

        /**
         * Return object's property is exist else - returns plain object
         *
         * @param {object} object. Object to find property of
         * @param {string} property. Property ro find in object
         * @returns {*}
         */
        var getObjectProperty=function(object, property){
            if(!object.hasOwnProperty(property)){
                object[property]={};
            }

            return object[property];
        };

        current=getObjectProperty(window, objects.shift());
        for(var i=0, max=objects.length; i<max; i++){
            current=getObjectProperty(current, objects[i]);
        }

        return current;
    };

    /**
     * Creates absolute url for current path
     *
     * @param {string} path. Request path
     * @returns {string}
     */
    this.createAbsoluteUrl=function(path){
        path=path || '';

        return location.origin+(path[0]!='/'?'/':'')+path;
    };
};

// Short alias
var use=Core.use;
