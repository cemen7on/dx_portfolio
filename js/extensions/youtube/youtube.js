use('Extensions').Youtube=new function(){
    /**
     * Whether Iframe API script has been loaded
     * and object has been created
     *
     * @type {boolean}
     * @private
     */
    var _isIframeAPIReady=false;

    /**
     * Iframe API ready callback function
     *
     * @private
     */
    var _onIframeAPIReady=function(){};

    /**
     * Registers global onYouTubeIframeAPIReady callback
     *
     * @private
     */
    var _registerGlobalReadyAPICallback=function(){
        window.onYouTubeIframeAPIReady=function(){
            _isIframeAPIReady=true;

            _onIframeAPIReady();
        };
    };

    var _onload=function(){};

    /**
     * Getter/Setter for youtube api load callback
     *
     * @type {function}
     */
    Object.defineProperty(this, 'onload', {
        get:function(){
            return _onload;
        },
        set:function(callback){
            _onload=callback;

            if(_isIframeAPIReady){
                _onload();
            }
            else{
                _onIframeAPIReady=function(){
                    _onload();
                };
            }
        }
    });

    /**
     * Object initialization
     */
    (function __init__(){
        _registerGlobalReadyAPICallback();
    }());
};