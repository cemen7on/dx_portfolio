/**
 * Promise constructor.
 *
 * @constructor
 * @type {Promise}
 */
use('Core').Promise=function Promise(callback){
    /**
     * On resolve callbacks list.
     * Defines by user, using "then" method.
     * Are called when resolve function was called.
     */
    var onResolve=[];

    /**
     * Promise resolve callback.
     * Called when operation was done successfully
     *
     * @type {Function}
     */
    var resolve=function(){
        for(var i=0, max=onResolve.length; i<max; i++){
            try{
                onResolve[i].apply(null, arguments);
            }
            catch(e){}
        }
    };

    /**
     * On reject callbacks list.
     * Defines by user, using "then" method.
     * Are called when reject function was called.
     */
    var onReject=[];

    /**
     * Promise reject callback.
     * Called when operation was done with errors
     *
     * @type {Function}
     */
    var reject=function(){
        for(var i=0, max=onReject.length; i<max; i++){
            try{
                onReject[i].apply(null, arguments);
            }
            catch(e){}
        }
    };

    /**
     * Checks whether passed value is function
     *
     * @param {*} value. Value to check
     * @returns {boolean}
     */
    var isFunction=function(value){
        return String(typeof value).toLowerCase()=='function';
    };

    /**
     * Registers resolve and reject callbacks
     *
     * @param {Function} _onResolve. Custom resolve callback
     * @param {Function} _onReject. Custom resolve callback
     */
    this.then=function(_onResolve, _onReject){
        if(isFunction(_onResolve)){
            onResolve.push(_onResolve);
        }

        if(isFunction(_onReject)){
            onReject.push(_onReject);
        }
    };

    setTimeout(function(){
        callback(resolve, reject)
    }, 0);
};
