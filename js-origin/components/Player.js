use('Components').Player=Backbone.View.extend(function(){
    /**
     * Player's HTML Element id
     *
     * @type {string}
     */
    var PLAYER_EL_ID='player';

    /**
     * YouTube API player instance
     *
     * @type {null|YT.Player}
     * @private
     */
    var _YTPlayer=null;

    /**
     * YouTube player ready promise instance.
     * It is needed because video could be loaded before player is ready
     *
     * @type {null|Core.Promise}
     * @private
     */
    var _YTPlayerReadyPromise=null;

    /**
     * Modal window instance
     *
     * @type {null|Components.Modal}
     */
    this.modal=null;

    /**
     * Initializes modal window instance.
     * Defines size
     *
     * @private
     */
    var _initializeModalWindow=function(){
        this.modal=new Components.Modal();

        this.modal.width=window.innerWidth-300;
        this.modal.height=window.innerHeight-100;

        this.modal.content='<div id="'+PLAYER_EL_ID+'"></div>';

        // When window modal is closed - stop video playing
        this.modal.onhide=function(){
            if(_YTPlayer){
                _YTPlayer.stopVideo();
            }
        };
    }.bind(this);

    /**
     * Creates YT player instance
     *
     * @private
     */
    var _initializeYTPlayer=function(){
        if(!this.modal){
            throw new Error('Cant create YT player instance. Modal window instance should be created first');
        }

        _YTPlayerReadyPromise=new Core.Promise(function(resolve){
            _YTPlayer=new YT.Player(PLAYER_EL_ID, {
                width:this.modal.width,
                height:this.modal.height,
                events:{
                    onReady:function(){
                        resolve();
                    }
                }
            })
        }.bind(this));
    }.bind(this);

    /**
     * Object initialization function
     */
    this.initialize=function(){
        _initializeModalWindow();

        // When youtube player has been loaded
        Extensions.Youtube.onload=_initializeYTPlayer;
    };

    /**
     * Loads video in player, player plays it immediately
     *
     * @param videoId
     * @returns {*}
     */
    this.play=function(videoId){
        _YTPlayerReadyPromise.then(function(){
            _YTPlayer.loadVideoById(videoId);
        });

        this.modal.show();

        return this;
    };
});
