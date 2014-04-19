var meScore = 0;
var rivalScore = 0

function addScoreForMe(){
	meScore++;
	$(".my_score .number").html(meScore);
}

function addScoreForRival(){
	rivalScore++;
	$(".oppo_score .number").html(rivalScore);
}