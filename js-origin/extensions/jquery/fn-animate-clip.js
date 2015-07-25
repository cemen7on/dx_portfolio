(function($){
    $.fn.reverse=[].reverse;

    $.fx.step.clip=function(fx){
        if(fx.pos===0){
            var clipValuePattern=/^rect\((\d+\.?\d*)(?:px|em)?,?\s+(\d+\.?\d*)(?:px|em)?,?\s+(\d+\.?\d*)(?:px|em)?,?\s+(\d+\.?\d*)(?:px|em)?\)$/,
                startClipValue=$(fx.elem).css('clip');

            var startClipValuesArray=clipValuePattern.exec(startClipValue);
            if(startClipValuesArray){
                fx.start=[
                    parseInt(startClipValuesArray[1]),
                    parseInt(startClipValuesArray[2]),
                    parseInt(startClipValuesArray[3]),
                    parseInt(startClipValuesArray[4])
                ];

                var endClipValuesArray=clipValuePattern.exec(fx.end);
                if(endClipValuesArray){
                    fx.end=[
                        parseInt(endClipValuesArray[1]),
                        parseInt(endClipValuesArray[2]),
                        parseInt(endClipValuesArray[3]),
                        parseInt(endClipValuesArray[4])
                    ];
                }
            }
        }

        if($.isArray(fx.start) && $.isArray(fx.end)){
            var y1=Math.round(((fx.end[0]-fx.start[0])*fx.pos)+fx.start[0]),
                x1=Math.round(((fx.end[1]-fx.start[1])*fx.pos)+fx.start[1]),
                y2=Math.round(((fx.end[2]-fx.start[2])*fx.pos)+fx.start[2]),
                x2=Math.round(((fx.end[3]-fx.start[3])*fx.pos)+fx.start[3]);

            fx.elem.style.clip='rect('+y1+'px, '+x1+'px, '+y2+'px, '+x2+'px)';
        }
    }
})(jQuery);