/**
 * Reflection object class
 * Contains methods to work with global objects
 *
 * @type {Object}
 */
function ReflectionObject(object){
    /**
     * Object pointer
     *
     * @type {*}
     * @private
     */
    var _this=this;

    /**
     * Object instance
     *
     * @type {*}
     * @private
     */
    var _instance=null;

    /**
     * Sets object's instance
     *
     * @param name
     * @return {*}
     * @private
     */
    var _setInstance=function(name){
        if(!Object.isString(name)){
            throw new Error('Invalid argument type: name expected to be a string');
        }

        for(property in window){
            if(String(property).toLowerCase()==name.toLowerCase()){
                _instance=window[property];

                break;
            }
        }

        return _this;
    };

    /**
     * Returns current object's instance
     *
     * @return {*}
     */
    _this.getInstance=function(){ return _instance; };

    /**
     * Checks if instance was found
     *
     * @return {Boolean}
     */
    _this.hasInstance=function(){ return Boolean(_instance); };

    /**
     * Checks if current instance has property
     *
     * @param name
     * @return {Boolean}
     */
    _this.hasProperty=function(name){
        return _instance.hasOwnProperty(name);
    };


    /**
     * Class constructor
     *
     * @param name
     * @private
     */
    var __construct=function(name){
        _setInstance(name);

        return _this;
    };

    __construct(object);
}

function ReflectionProperty(object, property){
    /**
     * Object pointer
     *
     * @type {ReflectionProperty}
     * @private
     */
    var _this=this;

    /**
     * Object, property is searched from.
     *
     * @type {object}
     * @private
     */
    var _object=null;

    /**
     * Searched property instance
     *
     * @type {undefined|*}
     * @private
     */
    var _property=undefined;

    /**
     * Sets object
     *
     * @param object
     * @private
     */
    var _setObject=function(object){
        if(Object.isString(object)){
            var reflection=new ReflectionObject(object);

            if(!reflection.hasInstance()){
                throw new Error('Object was not found');
            }

            _object=reflection.getInstance();
        }
        else if(Object.isObject(object)){
            _object=object;
        }
        else{
            throw new Error('Invalid argument type: object expected to be an object or a string');
        }
    };

    /**
     * Sets property
     *
     * @param property
     * @private
     */
    var _setProperty=function(property){
        if(!Object.isString(property)){
            throw new Error('Invalid argument type. Property expected to be a string, '+
                typeof(property)+' was given');
        }

        for(key in _object){
            if(key.toLowerCase()==property.toLowerCase()){
                _property=key;
            }
        }
    };

    /**
     * Returns property existence
     *
     * @returns {Boolean}
     */
    _this.isset=function(){
        return Object.isUndefined(_property);
    };

    /**
     * Returns current property
     *
     * @returns {undefined|*}
     */
    _this.value=function(){
        return _property;
    };

    /**
     * Class constructor
     *
     * @param object
     * @param property
     * @returns {ReflectionProperty}
     * @private
     */
    var __constructor=function(object, property){
        _setObject(object);
        _setProperty(property);

        return _this;
    };

    __constructor(object, property);
}