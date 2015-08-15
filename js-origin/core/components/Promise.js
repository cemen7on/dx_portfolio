/**
 * Promise constructor.
 *
 * @constructor
 * @type {Promise}
 */
use('Core').Promise=function Promise(callback){
    /**
     * Whether resolve method has been executed already
     *
     * @type {boolean}
     * @private
     */
    var _isResolveExecuted=false;

    /**
     * Whether reject method has been executed already
     *
     * @type {boolean}
     * @private
     */
    var _isRejectExecuted=false;

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
        _isResolveExecuted=true;

        for(var i=0, max=onResolve.length; i<max; i++){
            onResolve[i].apply(null, arguments);
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
        _isRejectExecuted=true;

        for(var i=0, max=onReject.length; i<max; i++){
            onReject[i].apply(null, arguments);
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
     * Executes passed function deferred
     *
     * @param {function} callback. Callback function to execute
     * @param {array} args. Arguments to pass to callback
     * @param {*} thisArg. Argument to apply callback call to
     * @private
     */
    var _deferredCall=function(callback, args, thisArg){
        args=args || [];
        thisArg=thisArg || window;

        setTimeout(function(){
            callback.apply(thisArg, args);
        }, 0);
    };

    /**
     * Registers resolve and reject callbacks
     *
     * @param {Function} _onResolve. Custom resolve callback
     * @param {Function} _onReject. Custom resolve callback
     */
    this.then=function(_onResolve, _onReject){
        if(isFunction(_onResolve)){
            if(_isResolveExecuted){
                _deferredCall(_onResolve);
            }
            else{
                onResolve.push(_onResolve);
            }
        }

        if(isFunction(_onReject)){
            if(_isRejectExecuted){
                _deferredCall(_onReject);
            }
            else{
                onReject.push(_onReject);
            }
        }
    };

    _deferredCall(callback, [resolve, reject]);
};
