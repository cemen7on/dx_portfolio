(function($){
    $.fx.step.rotateY=function(fx){
        if(fx.pos===0){
            var cssPropertyPattern=/^rotateY\((\d+)deg\)$/,
                cssPropertyValueString=fx.elem.style.webkitTransform;

            var cssPropertyValueArray=cssPropertyPattern.exec(cssPropertyValueString);

            if(cssPropertyValueArray){
                fx.start=parseInt(cssPropertyValueArray[1]);

                // fx.end is normal
            }
        }

        if(fx.start!==null && fx.end!==null){
            var degree=Math.round(((fx.end-fx.start)*fx.pos)+fx.start);

            fx.elem.style.webkitTransform='rotateY('+degree+'deg)';
        }
    }
})(jQuery);