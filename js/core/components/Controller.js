use('Core').Controller=new function(){
    /**
     * Extends passed child object with base controller functionality
     *
     * @param {null|object} child. Extendable object
     * @return {object}
     */
    this.extend=function(child){
        child=child || {};

        return child;
    }
};
