Core={};

Core.Notification=new function(){
    /**
     * Object pointer
     *
     * @type {Core.Notification}
     * @private
     */
    var _this=this;

    /**
     * Info notification
     *
     * @param {string} message. Notification message
     * @returns {Core.Notification}
     */
    _this.info=function(message){
        alert('Info: '+message);

        return _this;
    };

    /**
     * Success notification
     *
     * @param {string} message. Notification message
     * @returns {Core.Notification}
     */
    _this.success=function(message){
        alert('Success: '+message);

        return _this;
    };

    /**
     * Error notification
     *
     * @param {string} message. Notification message
     * @returns {Core.Notification}
     */
    _this.error=function(message){
        console.error(message);

        return _this;
    };
};

/**
 * Ajax request object
 */
Core.Request=new function(){
    /**
     * Object pointer
     *
     * @type {Core.Request}
     * @private
     */
    var _this=this;

    /**
     * Sends ajax request
     *
     * @param {object} custom. Custom ajax params
     * @returns {*}
     */
    _this.send=function(custom){
        var params=$.extend({
            type:'POST',
            dataType:'json',
            errorType:'notify'
        }, custom);

        custom.success=custom.success || function(){};
        custom.error=custom.error || function(){};

        var call=function(context, func, arguments){
                $.proxy(func, context).apply(context, arguments);
            },
            error=function(message, code, data, status, jXHR){
                // If ajax request was cancelled - do not trigger error handler
                if(status=='abort'){
                    return ;
                }

                if(params.errorType=='notify'){
                    Core.Notification.error(message);
                }

                call(this, custom.error, [message, code || 0, data || null, status, jXHR]);
            };

        params.success=function(response, status, jXHR){
            if(Object.isUndefined(response)){
                call(this, error, ['No data was received', 500, null, status, jXHR]);
            }
            else if(response.error){
                call(this, error, [response.error.message, response.error.code || 500, response.error.data || null, status, jXHR]);
            }
            else{
                call(this, custom.success, [response, status, jXHR]);
            }
        };

        params.error=function(jXHR, status, message){
            call(this, error, [message, jXHR.status, null, status, jXHR]);
        };

        return $.ajax(params);
    };
};

/**
 * Object for managing plain objects
 */
Core.Object=new function(){
    /**
     * Object pointer
     *
     * @type {Core.Object}
     * @private
     */
    var _this=this;

    /**
     * Extends two objects
     *
     * @param {object} parent. Extendable object
     * @param {object} child. Extender object
     * @returns {*}
     */
    _this.extend=function(parent, child){
        for(var key in child){
            if(!child.hasOwnProperty(key)){
                continue;
            }

            (function extender(){
                if(!parent[key]){
                    parent[key]=child[key];

                    return ;
                }

                if(typeof(child[key])!='function'){
                    parent[key]=child[key] && typeof(child[key])=='object'
                        ? $.extend(parent[key], child[key])
                        : child[key];

                    return ;
                }

                var _parent=parent[key],
                    _child=child[key];

                parent[key] = function () {
                    _parent.apply(this, arguments);
                    _child.apply(this, arguments);
                };
            })();
        }

        return parent;
    };
};