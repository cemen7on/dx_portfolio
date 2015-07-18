/**
 * Base Collection constructor
 *
 * @type {object}
 */
use('Core').Collection=Backbone.Collection.extend(function(){
    /**
     * Default options for `Collection#set`.
     *
     * @type {object}
     */
    var setOptions = {add: true, remove: true, merge: true};

    /**
     * Update a collection by `set`-ing a new list of models, adding new ones,
     * removing models that are no longer present, and merging models that already exist
     * in the collection, as necessary. Similar to **Model#set**, the core operation
     * for updating the data contained by the collection.
     *
     * @param {*} models. Models to set
     * @param {*} options. Additional options
     * @returns {*}
     */
    this.set=function(models, options) {
        options = _.defaults({}, options, setOptions);
        if (options.parse) models = this.parse(models, options);

        // IMPORTANT!!!!!
        // After collection has been parsed set options.parse to false,
        // because this options are used for creation models
        // and models attributes are being parsed!!!!!
        options.parse=false;

        var singular = !_.isArray(models);
        models = singular ? (models ? [models] : []) : models.slice();
        var id, model, attrs, existing, sort;
        var at = options.at;
        var sortable = this.comparator && (at == null) && options.sort !== false;
        var sortAttr = _.isString(this.comparator) ? this.comparator : null;
        var toAdd = [], toRemove = [], modelMap = {};
        var add = options.add, merge = options.merge, remove = options.remove;
        var order = !sortable && add && remove ? [] : false;

        // Turn bare objects into model references, and prevent invalid models
        // from being added.
        for (var i = 0, length = models.length; i < length; i++) {
            attrs = models[i];

            // If a duplicate is found, prevent it from being added and
            // optionally merge it into the existing model.
            if (existing = this.get(attrs)) {
                if (remove) modelMap[existing.cid] = true;
                if (merge && attrs !== existing) {
                    attrs = this._isModel(attrs) ? attrs.attributes : attrs;
                    if (options.parse) attrs = existing.parse(attrs, options);
                    existing.set(attrs, options);
                    if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
                }
                models[i] = existing;

                // If this is a new, valid model, push it to the `toAdd` list.
            } else if (add) {
                model = models[i] = this._prepareModel(attrs, options);
                if (!model) continue;
                toAdd.push(model);
                this._addReference(model, options);
            }

            // Do not add multiple models with the same `id`.
            model = existing || model;
            if (!model) continue;
            id = this.modelId(model.attributes);
            if (order && (model.isNew() || !modelMap[id])) order.push(model);
            modelMap[id] = true;
        }

        // Remove nonexistent models if appropriate.
        if (remove) {
            for (var i = 0, length = this.length; i < length; i++) {
                if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
            }
            if (toRemove.length) this.remove(toRemove, options);
        }

        // See if sorting is needed, update `length` and splice in new models.
        if (toAdd.length || (order && order.length)) {
            if (sortable) sort = true;
            this.length += toAdd.length;
            if (at != null) {
                for (var i = 0, length = toAdd.length; i < length; i++) {
                    this.models.splice(at + i, 0, toAdd[i]);
                }
            } else {
                if (order) this.models.length = 0;
                var orderedModels = order || toAdd;
                for (var i = 0, length = orderedModels.length; i < length; i++) {
                    this.models.push(orderedModels[i]);
                }
            }
        }

        // Silently sort the collection if appropriate.
        if (sort) this.sort({silent: true});

        // Unless silenced, it's time to fire all appropriate add/sort events.
        if (!options.silent) {
            var addOpts = at != null ? _.clone(options) : options;
            for (var i = 0, length = toAdd.length; i < length; i++) {
                if (at != null) addOpts.index = at + i;
                (model = toAdd[i]).trigger('add', model, this, addOpts);
            }
            if (sort || (order && order.length)) this.trigger('sort', this, options);
        }

        // Return the added (or merged) model (or models).
        return singular ? models[0] : models;
    };

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

                Backbone.Collection.prototype.fetch.call(_this, custom);
            }
            else{
                resolve();
            }
        });
    }
});