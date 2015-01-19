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