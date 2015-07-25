use('Core').Region=function Region(el){
    /**
     * Region's current view object
     *
     * @type {null}
     * @private
     */
    var _CurrentView=null;

    /**
     * Region's HTML Element field
     *
     * @type {HTMLElement}
     * @private
     */
    var _el=null;

    /**
     * Region's HTML Element property
     *
     * @type {HTMLElement}
     */
    Object.defineProperty(this, 'el', {
        set:function(value){
            if(value instanceof HTMLElement){
                _el=value;

                return ;
            }

            if(Object.isString(value)){
                _el=document.querySelector(value);

                return ;
            }

            throw new Error('Invalid argument type: Region.el must be either valid selector or HTMLElement');
        },
        get:function(){ return _el; }
    });

    /**
     * Displays specified view in current region.
     * Removes previous
     *
     * @param {Core.View} view. View object to display
     * @returns {*}
     */
    this.display=function(view){
        if(_CurrentView){
            // Trigger remove method of current view,
            // so it remove itself from DOM
            _CurrentView.remove();
        }

        _CurrentView=view;

        // Tell view that it has been displayed:
        // 1.By event
        view.trigger('display');

        // 2.By callback call
        if(view.display){
            return view.display(this);
        }

        return null;
    };

    /**
     * Removes current view
     *
     * @returns this
     */
    this.empty=function(){
        if(_CurrentView){
            _CurrentView.remove();
            _CurrentView=null;
        }

        return this;
    };

    /**
     * Appends specified view instance to current region
     *
     * @param {object} view. View to append to region
     */
    this.append=function(view){
        if(!view.el){
            return this;
        }

        this.el.appendChild(view.el);

        return true;
    };

    /** Initialization block **/
    this.el=el;
};