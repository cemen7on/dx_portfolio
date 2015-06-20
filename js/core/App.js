var App=new function(){
    /**
     * Object pointer
     *
     * @type {App}
     * @private
     */
    var _this=this;

    /**
     * Whether application has already been run
     *
     * @type {boolean}
     */
    var _inited=false;

    /**
     * Backbone router instance property
     *
     * @type {Backbone.Router}
     * @readonly
     */
    Object.defineProperty(_this, 'Router', {
        configurable:true,
        get:function(){ return null; },
        set:function(Router){
            if(!Router instanceof Backbone.Router){
                throw new Error('Invalid argument type: Router must be Backbone.Router instance');
            }

            // Mark property as read-only
            Object.defineProperty(_this, 'Router', {
                writable:false,
                value:Router
            });
        }
    });

    /**
     * Parses handler and retrieves execution environment
     *
     * @param {*} handler. Handler to parse
     * @returns {object}
     * @private
     */
    var _retrieveHandlerExecutionEnvironment=function(handler){
        var environment={
            behalf:window,
            method:handler
        };

        if(!Object.isString(handler) || !handler.length){
            return environment;
        }

        var handlerPathArr=handler.split('.'),
            handlerMethodName,
            handlerObject;

        if(handlerPathArr.length==1){
            environment.method=handlerPathArr[0];

            return environment;
        }

        handlerMethodName=handlerPathArr.pop();
        handlerObject=new Core.Reflection(handlerPathArr.join('.')).get();

        if(!handlerObject || !Object.isFunction(handlerObject[handlerMethodName])){
            return environment;
        }

        environment.behalf=handlerObject;
        environment.method=handlerObject[handlerMethodName];

        return environment;
    };

    /**
     * Application run method.
     * Initializes router with passed route rules.
     * Routes by current state
     *
     * @param {Array} routes. Array routes
     * @param {null|object} data. Data to start application with (passed to initialized action)
     */
    _this.run=function(routes, data){
        if(_inited){
            throw new Error('Application has already been run');
        }

        data=data || null;

        _this.Router=new (Backbone.Router.extend(new function(){
            /**
             * Initialization function.
             *
             * In order to pass initialization data to first route -
             * define routes handler as anonymous function, so thanks for the closure
             * data would be passed. After first route sends data to handler -
             * erase data, so no future handlers would be triggered with initialization data object
             */
            this.initialize=function(){
                for(var path in routes){
                    if(!routes.hasOwnProperty(path)){
                        continue ;
                    }

                    (function(){
                        var environment=_retrieveHandlerExecutionEnvironment(routes[path]);

                        this.route(path, function(){
                            if(data){
                                Array.prototype.push.call(arguments, data);
                            }

                            environment.method.apply(environment.behalf, arguments);

                            data=null;
                        });
                    }.bind(this))();
                }
            };
        }));

        _inited=true;

        // Starts routing:
        // If success - execute given callback
        // otherwise - 404 error
        if(!Backbone.history.start({pushState:true})){
            // If no routes were matched
            // TODO: change to some appropriate error view
            alert('HTTP 404: Unknown path');
        }
    };

    /**
     * Defines whether passed url absolute or not
     *
     * @param {string} url. URL to check
     * @returns {bool}
     * @private
     */
    var _isAbsoluteUrl=function(url){
        var components=_parseUrl(url);

        return Boolean(components.host);
    };

    /**
     * Parses specified url's components.
     * Returns components object
     *
     * @param {string} url. ULR to parse
     * @returns {object}
     * @private
     */
    var _parseUrl=function(url){
        // Usual link element parses it's url into components
        var helper=document.createElement('a');
        helper.href=url;

        return {
            protocol:helper.protocol,
            host:helper.host,
            hostname:helper.hostname,
            port:helper.port,
            pathname:helper.pathname,
            hash:helper.hash,
            search:helper.search
        };
    };

    /**
     * Redirects to specified url
     *
     * @param {String} url. Url to redirect
     * @param {Object} custom. Additional redirect params
     */
    _this.redirect=function(url, custom){
        if(!_inited){
            throw new Error('App has not been run. Use App.run method');
        }

        var params={trigger:true},
            redirectPathName;

        if(_isAbsoluteUrl(url)){
            redirectPathName=_parseUrl(url).pathname;
        }
        else{
            redirectPathName=url;
        }

        _this.Router.navigate(redirectPathName, $.extend(params, custom));
    };
};
