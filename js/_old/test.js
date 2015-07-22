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

var View1=Backbone.View.extend(function(){
    this.hello=function(){
        console.log('hello');
    };

    this.initialize=function(){
        console.log('View1');
    };
});

var View2=View1.extend(function(){
    this.method=function(){
        console.log('method');
    };

    this.initialize=function(){
        console.log('View2');

        console.log(this.__super__);
    };
});

new View2;
/*

var View3=View2.extend({
    a:'hello',

    initialize:function(){
        console.log('View3');
    }
});
*/

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
/*
var extend = function(protoProps, staticProps) {
    var parent = this;
    var child,
        need=false;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if(!need){
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }
    }
    else{
        child=function(){};
        need=false;
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    //Surrogate.prototype = parent.prototype;
    Surrogate.prototype = new parent;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    child.extend=function(){
        need=true;
        mix.apply(this, arguments);
    };

    return child;
};
*/

/*
Backbone.View.extend=function(child){
    child=child || function(){};
    var parent=this,
        isPrototypeObject=false;

    // TODO: replace by original Backbone.View.apply ....
    var __initialize=function(){
        this.cid = _.uniqueId('view');
        // options || (options = {});
        //_.extend(this, _.pick(options, viewOptions));
        this._ensureElement();
        this.initialize.apply(this, arguments);
    };

    var extendable=function(flag){
        child.call(this);

        if(!isPrototypeObject){
            __initialize.apply(this, arguments);
        }
        else{
            isPrototypeObject=false;
        }
    };

    // "new parent" here is the same "extendable" function from previous call
    extendable.prototype=new parent;
    extendable.extend=function(child){
        isPrototypeObject=true;
        return Backbone.View.extend.call(this, child);
    };

    return extendable;
};

CoreView=Backbone.View.extend(function(){
    this.delegate=function(eventName, selector, listener){
        var view=this;

        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, function(event){
            listener(event, view);
        });
    };

    this.initialize=function(){
        console.log('CoreView');
    };
});

View1=CoreView.extend(function(){
    this.method=function(d,a){
        console.log('method');
    };

    this.initialize=function(){
        console.log('View1');
    };
});

View2=View1.extend(function(){
    this.property='a';

    this.initialize=function(){
        console.log('View2');
    };
});

new View2();

*/

/*
var View1=Backbone.View.extend({
    hello:function(){
        console.log('hello');
    }
});

var View2=View1.extend({
    method:function(){
        console.log('method');
    }
});

var View3=View2.extend({
    a:'hello'
});

console.log(new View3());
*/