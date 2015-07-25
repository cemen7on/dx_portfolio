/**
 * Contains all commons function
 * Contains all common variables
 * Extends classes
 */

/** Extend Object class **/

/**
 * Checks is object is jQuery instance
 *
 * @param object
 * @returns {boolean}
 */
Object.isJquery=function(object){
    return object instanceof jQuery;
};

/**
 * Returns type of specific value
 *
 * @param value
 * @returns {string}
 */
Object.getType=function(value){
    return String(typeof(value)).toLowerCase();
};

/**
 * Checks is value not null or undefined
 *
 * @param object
 * @return {Boolean}
 */
Object.isset=function(object){
    return !this.isNull(object) && !this.isUndefined(object);
};

/**
 * Checks is value null
 *
 * @param object
 * @return {Boolean}
 */
Object.isNull=function(object){
    return object===null;
};

/**
 * Checkes is value undefined
 *
 * @param object
 * @return {Boolean}
 */
Object.isUndefined=function(object){
    return object===undefined;
};

/**
 * Checks is value object
 *
 * @param object
 * @return {Boolean}
 */
Object.isObject=function(object){
    return !this.isNull(object) && this.getType(object)=='object';
};

/**
 * Checks is value string
 *
 * @param value
 * @returns {boolean}
 */
Object.isString=function(value){
    return this.getType(value)=='string';
};

/**
 * Checks is value number
 *
 * @param value
 * @returns {boolean}
 */
Object.isNumber=function(value){
    return !isNaN(value);
};

/**
 * Checks is value a function
 *
 * @param value
 * @returns {boolean}
 */
Object.isFunction=function(value){
    return this.getType(value)=='function';
};

/**
 * Converts first char of to string to upper case
 *
 * @returns {string}
 */
String.prototype.firstToUpper=function(){
    var f=this.charAt(0).toUpperCase();

    return f+this.substr(1, this.length-1);
};

/**
 * Flag, shows that object has to be called without initialization method
 *
 * @type {number}
 */
var NO_INITIALIZE=1;

(function(){
    var backboneModules=['Model', 'Collection', 'Router', 'View', 'History'];

    /**
     * Returns Backbone base class for specified object
     *
     * @param {object} object. Object to get Backbone base class for
     * @returns {*}
     */
    var getBaseClass=function(object){
        for(var i=0, end=backboneModules.length; i<end; i++){
            if(object instanceof Backbone[backboneModules[i]]){
                return Backbone[backboneModules[i]];
            }
        }

        return null;
    };

    /**
     * Returns whether passed constructor is Backbone base class
     *
     * @param {function} constructor. Constructor to check
     * @returns {boolean}
     */
    var isBaseClass=function(constructor){
        for(var i=0, end=backboneModules.length; i<end; i++){
            if(constructor===Backbone[backboneModules[i]]){
                return true;
            }
        }

        return false;
    };

    var extendObject=function(object){
        var parent=this,
            child;

        object=object || {};

        child=function(arg){
            if(arg!==NO_INITIALIZE){
                Object.defineProperty(this, '__super__', {
                    configurable:false,
                    enumerable:false,
                    writable:false,
                    value:Object.getPrototypeOf(this)
                });

                var __initialize=getBaseClass(this);

                return __initialize.apply(this, arguments);
            }
            else{
                return Object.getPrototypeOf(this);
            }
        };

        var prototype;

        if(isBaseClass(parent)){
            prototype=parent.prototype;
        }
        else{
            prototype=new parent(NO_INITIALIZE);
        }

        var Surrogate=function(){};
        Surrogate.prototype=prototype;
        child.prototype=new Surrogate;
        _.extend(child.prototype, object);

        _.extend(child, parent);

        return child;
    };

    var extendConstructor=function(constructor){
        var parent=this,
            child;

        constructor=constructor || function(){};

        child=function(arg){
            constructor.call(this);

            Object.defineProperty(this, '__super__', {
                configurable:false,
                enumerable:false,
                writable:false,
                value:Object.getPrototypeOf(this)
            });

            if(arg!==NO_INITIALIZE){
                var __initialize=getBaseClass(this);

                __initialize.apply(this, arguments);
            }
        };

        var prototype;
        if(isBaseClass(parent)){
            prototype=parent.prototype;
        }
        else{
            prototype=new parent(NO_INITIALIZE);
        }

        child.prototype=prototype;
        _.extend(child, parent);

        return child;
    };

    var extend=function(child){
        if(Object.isFunction(child)){
            return extendConstructor.call(this, child);
        }

        return extendObject.call(this, child);
    };

    Backbone.Model.extend=Backbone.Collection.extend=Backbone.Router.extend=Backbone.View.extend=Backbone.History.extend=extend;
}());

/**
 * Parses query string and returns object
 *
 * @param {string} queryStr. Query string to parse
 * @returns {{}}
 */
function parseQueryString(queryStr){
    if(queryStr[0]=='?'){
        queryStr=queryStr.substr(1);
    }

    var queryPairs=queryStr.split(','),
        queryPair,
        queryObj={};

    for(var i=0, end=queryPairs.length; i<end; i++){
        queryPair=queryPairs[i].split('=');

        if(queryPair[0] && queryPair[1]){
            queryObj[queryPair[0]]=queryPair[1];
        }
    }

    return queryObj;
}