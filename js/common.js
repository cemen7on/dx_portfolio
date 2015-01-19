// shows background radial gradient
$('#substrate').ready(function(){
	$('#substrate').height($(this).width()/2);
});

$(window).resize(function(){
    $('#substrate').height($(this).width()/2);
});