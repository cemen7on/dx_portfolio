use('Core').Controller=new function(){
    /**
     * Setups default properties
     *
     * @param {function} controller. controller object
     * @private
     */
    var _setDefaults=function(controller){
        controller.blur=controller.blur || function(){};
    };

    /**
     * Extends passed child object with base controller functionality
     *
     * @param {null|object} child. Extendable object
     * @return {object}
     */
    this.extend=function(child){
        child=child || {};

        _setDefaults(child);

        return child;
    }
};
