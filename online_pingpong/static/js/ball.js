var click_stat=false;

//Code to move bar
function bindMouseToPad(){
	$(document).mousemove(function(m){
		setTimeout(hideHint,2000);
		$("#body").css('cursor', 'none');
		if(m.pageX>10&&m.pageX<window.innerWidth-180)
		{
			$(".my_pad").css({"left":m.pageX-50, "top":m.pageY-10});
		}
	});
}
		
var ballTimer = window.setInterval(function() {
	if(judgeBallValid()==1){
		 window.clearInterval(ballTimer)
		 if(confirm("Out of upper bound! Press to Continue"))
		 {
			 continueGame(1);
			 popup("auto-continue in 3 seconds");
		 }else{
			 popup("Game over!");
			 emptyPairPlayers();
		 }
		 return;
	}else if(judgeBallValid()==2){
		 window.clearInterval(ballTimer)
		 if(confirm("Out of lower bound!Press to Continue"))
		 {
			 continueGame(2);
			 popup("auto-continue in 3 seconds");
		 }else{
			 popup("Game over!");
			 emptyPairPlayers();
		 }
		 return;
	}
	
	if(click_stat==true){
	
		var p = $(".ball");
		var position = p.position();
		var status=getStatus();
		
		if(status==1)
		{
			var tadd=getTopOffset();
			var ladd=getLeftOffset();
			$(".ball").css({"top":position.top+tadd,"left":position.left+ladd});
		}
	}
},40);


function getLeftOffset()
{
	var lOffset=0;
	var pball = $(".ball");
	var pad1 = $(".my_pad");
	var bar1_position = pad1.position();
	var pad2 = $(".rival_pad");
	var bar2_position = pad2.position();
	var ball_position = pball.position();
	if(Math.abs(ball_position.top-bar1_position.top)<=5||
			Math.abs(ball_position.top-bar2_position.top)<=5)//when ball near the pad
	{
		if((ball_position.left-bar1_position.left>=-10 && 
				ball_position.left-bar1_position.left<=65)||
			(ball_position.left-bar2_position.left>=-10 && 
				ball_position.left-bar2_position.left<=65))//left diff [10, 100]
		{
			lOffset=-2; 
		}
		if((ball_position.left-bar1_position.left<=140 && 
				ball_position.left-bar1_position.left>65)||
			(ball_position.left-bar2_position.left<=140 && 
					ball_position.left-bar2_position.left>65) )//left diff [90, 190]
		{
			lOffset=2;		
		}
	}

	if(lOffset==0){lOffset=getLeftOffset.lOffset;}//keep the same
	if(ball_position.left<=$(".play_ground").position().left|| //the two sides of table
			ball_position.left>=$(".play_ground").position().left+500){
		lOffset=-lOffset;
	}
		

	getLeftOffset.lOffset=lOffset;
	return lOffset;
}

function getTopOffset()
{
	var tOffset=0;
	var pball = $(".ball");
	var pad1 = $(".my_pad");
	var ball_position = pball.position();
	var bar1_position = pad1.position();
	var pad2 = $(".rival_pad");
	var bar2_position = pad2.position();
	
	if( (ball_position.left-bar1_position.left>=-10 && 
		ball_position.left-bar1_position.left<=140 &&
		ball_position.top-bar1_position.top>=0 && 
		ball_position.top-bar1_position.top<=10)||
		(ball_position.left-bar2_position.left>=-10 && 
		ball_position.left-bar2_position.left<=140 &&
		ball_position.top-bar2_position.top>=0 && 
		ball_position.top-bar2_position.top<=10)) {
		tOffset=5;
		/*changeBallStatus(ball_position.left,ball_position.top,0,tOffset);
		TOPoffset = 5;*/
	}
		
	if( (ball_position.left-bar1_position.left>=-10 && 
		ball_position.left-bar1_position.left<=140 &&
		ball_position.top-bar1_position.top>=-10 && 
		ball_position.top-bar1_position.top<=0)||
		(ball_position.left-bar2_position.left>=-10 && 
		ball_position.left-bar2_position.left<=140 &&
		ball_position.top-bar2_position.top>=-10 && 
		ball_position.top-bar2_position.top<=0)) {
		tOffset=-5;
		/*changeBallStatus(ball_position.left,ball_position.top,0,tOffset);
		TOPoffset = -5;*/
	}
	
	if(tOffset==0){
		tOffset=getTopOffset.tOffset;
	}
	getTopOffset.tOffset=tOffset;
	
	return tOffset;
}

function getStatus()
{
	return 1;
}


function judgeBallValid(){
	var pball = $(".ball");
	var ball_position = pball.position();
	if(ball_position.top<60){//out of upper bound
		addScoreForMe()
		return 1;
	} 
	else if(ball_position.top>600+80)// out of lower bound
	{
		addScoreForRival()
		return 2;
	}
	else
		return 0;
}

function continueGame(flag){
	if(flat==1){//upper, give ball to upper person
		$(".ball").css("left",400);
		$(".ball").css("top",200);
		setTimeout(function(){
			getTopOffset.tOffset = 5;
		},3000)
	}else if(flat==2){
		$(".ball").css("left",400);
		$(".ball").css("top",600);
		setTimeout(function(){
			getTopOffset.tOffset = -5;
		},3000)
	}
}

