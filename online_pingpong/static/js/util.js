function changeHintPosition(content, x, y){
	$(".hint").show();
	$(".hint").html(content);
	$(".hint").css("left", x);
	$(".hint").css("top", y);
}

function hideHint(){
	$(".hint").fadeOut(800);
}