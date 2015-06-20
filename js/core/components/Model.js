/**
 * Base Model constructor
 *
 * @type {object}
 */
use('Core').Model=Backbone.Model.extend(new function(){
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

        return new Core.Promise(function(resolve){
            var customSuccessCallback;

            if(_this.isEmpty()){
                // Modify custom ajax params object
                // so that it will call promise callbacks
                customSuccessCallback=custom.success || function(){};

                custom.success=function(){
                    customSuccessCallback.apply(this, arguments);
                    resolve();
                };

                Backbone.Model.prototype.fetch.call(_this, custom);
            }
            else{
                resolve();
            }
        });
    }
});