/**
 * Base Collection constructor
 *
 * @type {object}
 */
use('Core').Collection=Backbone.Collection.extend(new function(){
    /**
     * If collection is empty - requests it from server.
     * Returns promise
     *
     * @param {object} custom. Custom ajax call params
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

                Backbone.Collection.prototype.fetch.call(_this, custom);
            }
            else{
                resolve();
            }
        });
    }
});