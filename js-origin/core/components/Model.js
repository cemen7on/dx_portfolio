/**
 * Base Model constructor
 *
 * @type {object}
 */
use('Core').Model=Backbone.Model.extend(function(){
    /**
     * If model is empty - requests it from server.
     * Returns promise
     *
     * @param {object} custom. Custom ajax params object
     * @returns {Core.Promise}
     * @override
     */
    this.fetch=function(custom){
        custom=custom || {};

        var _this=this;

        return new Core.Promise(function(resolve, reject){
            var customSuccessCallback,
                customErrorCallback;

            if(_this.isEmpty()){
                // Modify custom ajax params object
                // so that it will call promise callbacks
                customSuccessCallback=custom.success || function(){};
                customErrorCallback=custom.error || function(){};

                custom.success=function(){
                    customSuccessCallback.apply(this, arguments);
                    resolve();
                };

                custom.error=function(jXHR, status, statusMessage){
                    var errorObject;

                    try{
                        errorObject=JSON.parse(jXHR.responseText);
                    }
                    catch(e){
                        errorObject=jXHR.responseText;
                    }

                    customErrorCallback(errorObject, jXHR.status, statusMessage);
                    reject(errorObject, jXHR.status, statusMessage);
                };

                Backbone.Model.prototype.fetch.call(_this, custom);
            }
            else{
                resolve();
            }
        });
    }
});