use('Core').Reflection=function Reflection(name){
    /**
     * Reflection entity
     *
     * @type {*}
     * @private
     */
    var _entity=null;

    /**
     * Sets object's entity by it's name
     *
     * @param {string} name. Object name. Searched object can be nested, ex: Parent.Child.[object]
     * @private
     */
    var _setEntity=function(name){
        if(!Object.isString(name)){
            throw new Error('Invalid argument type: name must be a string');
        }

        var nestedObjectChain=name.split('.'),
            nested=window;

        for(var i=0, end=nestedObjectChain.length; i<end; i++){
            if(Object.isObject(nested) && nested[nestedObjectChain[i]]){
                nested=nested[nestedObjectChain[i]];
            }
            else{
                return ;
            }
        }

        _entity=nested;
    };

    /**
     * Returns current object's instance
     *
     * @return {*}
     */
    this.get=function(){ return _entity; };

    /**
     * Checks if instance was found
     *
     * @return {Boolean}
     */
    this.has=function(){ return Boolean(_entity); };

    /**
     * Object initialization method.
     * Sets object instance.
     *
     * @param {string} name. Entity's name
     */
    (function init(name){
        _setEntity(name);
    }(name));

    return this;
};