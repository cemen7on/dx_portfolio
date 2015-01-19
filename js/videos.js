var video, // Modal window for video object
    player, // YouTube video player object
    deferred=function(){}; // Deferred action that should be executed after youtube player is initialized

/**
 * On YouTube player ready callback
 * Function is triggered when /components/youtube.js script is executed.
 *
 * Either waits until animation id ready by setting up a flag, or if animation already done
 * creates youtube player instance
 */
function onYouTubeIframeAPIReady(){
    // The <iframe> (and video player) will replace this <div> tag
    video.content().html('<div id="player"></div>');

    player=new YT.Player('player', {
        width:video.width(),
        height:video.height(),
        events:{
            onReady:function(){
                deferred();
            }
        }
    });

    // Register on modal window hide callback.
    // Stops playing current video
    video.onHide=function(){
        player.stopVideo();
    };
}

$(document).bind('animated', function(){
    // Define pagination object
    var pagination=new Pagination(),
        $window=$(window);

    // Create and configure video modal window instance
    video=new Modal();
    video.width($window.width()-300);
    video.height($window.height()-100);

    // Load youtube components in async way
    // So this would not interrupt thu,b animation
    var tag=document.createElement('script');
    tag.src=location.origin+'/js/components/youtube.js';
    var firstScriptTag=document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Register event handler for clicking video preview thumb.
    // Shows video in modal window
    $(document).on('click', '.art-medium-preview .thumb.video', function(){
        if(Environment.loading){ // Do nothing if content is being loaded at the moment
            return ;
        }

        var $this=$(this);

        // If youtube player has not been loaded yet
        // overwrite deferred callback, so when player is ready,
        // player would load a video
        if(!player || !player.hasOwnProperty('loadVideoById')){
            deferred=function(){
                player.loadVideoById($this.data('video-id'));
            }
        }
        // Otherwise load video immediately
        else{
            player.loadVideoById($this.data('video-id'));
        }

        video.show();
    });
});