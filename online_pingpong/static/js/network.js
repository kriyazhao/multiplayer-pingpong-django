function queryUsers(){
	var username = $(".userquery").val();
	$.ajax({
		url:"/queryUsers?username="+username,
		success:function(data){
			var json = eval(data);
			var str = "<table class=\"reference\"><tbody><tr><th>Username</th><th>Score</th><th>Club</th><th>Action</th></tr>";
			for(var i=0;i<json.length; i++){
				str += "<tr><td class=\"first_name_"+i.toString()+"\" id=\""+json[i].name+"\">"+ json[i].name +"</td>";
				str += "<td class=\"second_score_"+i.toString()+"\" id=\""+json[i].score+"\">"+ json[i].score +"</td>";
				str += "<td class=\"third_club_"+i.toString()+"\" id=\""+json[i].club+"\">"+ json[i].club +"</td>";
				str += "<td><button class="+i.toString()+" onclick=\"deleteUsers(this)\">Delete</button></td></tr>";
			};
			str += "</tbody></table>";
			$(".sqlresult").html(str);
		}
	});
}

function addUsers(){
	var username = $(".username").val();
	var birthday = $(".birthday").val();
	var email = $(".email").val();
	var clubname = $(".clubname").val();
	var score = $(".adduser .score").val();
	
	$.ajax({
		url:"/addUsers?username="+username.toString()+"&birthday="+birthday.toString()+"&email="+email.toString()+"&clubname="+clubname.toString()+"&score="+score,
		success:function(data){
			if(data.length==0){
				$(".sqlresult").html("Couldn't add user, please fill in all the required fields!");
			}
			else{
				var class_id = $(".reference tr").length-1;
				var class_id_last = class_id-1;
				var str = "<tr><td class=\"first_name_"+class_id+"\" id=\""+username+"\">"+ username +"</td>";
				str += "<td class=\"second_score_"+class_id+"\" id=\""+score+"\">"+ score +"</td>";
				str += "<td class=\"third_club_"+class_id+"\" id=\""+clubname+"\">"+ clubname +"</td>";
				str += "<td><button class="+class_id+" onclick=\"deleteUsers(this)\">Delete</button></td></tr>";
				$('tbody').append(str);
			}
		}
	});
}

function deleteUsers(button){
	var class_id = button.className;
	var username = $(".first_name_"+class_id).attr("id");
	var score = $(".second_score_"+class_id).attr("id");
	var clubname = $(".third_club_"+class_id).attr("id");
	//console.log(username,score,clubname)
	$.ajax({
		url:"/deleteUsers?username="+username+"&score="+score+"&clubname="+clubname,
		success:function(data){
			var str = "";
			if(data =="success"){
				$(".first_name_"+class_id).parent('tr').slideUp(1000);
				setTimeout(function(){
					$(".first_name_"+class_id).parent('tr').remove();
				}, 1000);
			}
			
		}
	});
}

/*display current member lists with random chosen image.*/
var memberTimer = window.setInterval(function() {
	updateOnlineMember()
},3000);

function updateOnlineMember(){
	$.ajax({
		url:"/updateOnlineMember",
		success:function(data){
			var json = eval(data);
			if(json.length==0)
				$(".member_list").html("Sorry, no members are online...");
			else{
				var str = "";
				for(var i=0;i<json.length; i++){
					str += "<li><img src='/static/img/"+json[i].url+"'<span>"+json[i].userName+"</span><span>*"+json[i].score+"</span></li>";
				}
				$(".member_list").html(str);
			}
		}
	});
}

var firstPlayer = false;
/**/
function joinGame(){
	hideHint();
	/*if you have already joined the game*/
	if(joined){
		popup("You are already in the game!");
		return;
	}
	/*send AJAX request to back-end, and return json object*/
	/*Json{
	 * name:
	 * Num_of_player:
	 * }*/
	$.ajax({
		url : "/joinGame",
		success : function(data){
			var json = eval(data);
			
			/*if not logged in*/
			if (json == "not login"){
				popup("Please login in first")
				window.location.href='/loginpage';
			}
			/*change the player's name*/
			if(json[1].length <=2){
				ME = json[0];
				$(".my_score .name").html(ME.userName+" (Me)");
			}
						
			/*if the number of players online is less than 2. keep waiting for the second player to join*/
			if(json[1].length<2){
				firstPlayer = true;
			}
			/*if the number of players online is 2. the game can start*/
			else if(json[1].length==2){
				playersComplete = true;
			}
			/*if the number of players online is more than 2. you cannot join the game*/
			else{
				popup("There are already 2 players joined the game, you cannot join now.)");
			}
			/*change the status from "Join Game" to "Joined"*/
			joined = true;
			$(".btn1").html("Already Joined");
		}
	});
}

function startGame(){
	 /*if you have not joined the game*/ 
	 if(!joined){ 
		 popup("Please join game first!");
		 return;
	 }
	 /*if you are still waiting for the second player*/
	 if(!canStart){
		 popup("Can't start for now, pleasewait!");
		 return;
	 } 
	 /*if the game can be started*/
	 $(".btn2").html("Started");
	 $(".table_info").html("Starting!");
	 $(".status_cnt").html("Started");
	 $(".table_info").animate({
		width: "70%",
		opacity: 0,
		marginLeft: "0.6in",
		fontSize: "10em",
		borderWidth: "10px"
	 }, 1500 );
	 /*change mouse to a ping pong bar, and start exchange*/
	 click_stat=true;
	 bindMouseToPad();
	 startExchange();
	 
	 /*pop up hint near the ball's original position*/
	 var hintx = $(".ball").position().left;
	 var hinty = $(".ball").position().top;
	  
	 changeHintPosition("movie your pad behind ball and hit it!", hintx+56, hinty-62)
	 informServerStartGame();
}

var pairTimer = window.setInterval(function() {
	requestPairPlayers()
},1000);

function requestPairPlayers(){
	$.ajax({
		url:"/requestPairPlayers",
		success:function(data){
			var json = eval(data);
			if(json.length<1)
				$(".status_cnt").html("Sorry, no one is available...");
			else if((json.length==1)){
				$(".status_cnt").html("Waiting for other player to join...");
			}
			else if(json.length==2){
				canStart = true;
				
				if(ME==null)
					return;
				for(var i=0;i<2;i++){
					if(json[i].userName==ME.userName) continue;
					else{
						$(".oppo_score .name").html(json[i].userName);
					}
				}
				if(!playersComplete)
					$(".status_cnt").html("2 players OK, Preass Start!!");
				playersComplete = true;
				
			}
			//else if(json.length>2){
			//	popup("System error...(players >2)")
			//}
		}
	});
}

function informServerStartGame(){
	$.ajax({
		url:"/startGame",
		success:function(data){
			if(data=="wait"){
				$(".status_cnt").html("Waiting for rival to press start...");
			}else if(data=="start"){
			}
			
			//$(".btn1").html("Join Game");
			//$(".btn2").html("Start Game");
		}
	});
}

var exchangeTimer;
function startExchange(){
	exchangeTimer = window.setInterval(function() {
		var left = $(".my_pad").position().left;
		var top = $(".my_pad").position().top;
		
		$.ajax({
			url:"/exchange?left="+left+"&top="+top,
			success:function(data){
				var data = eval(data);
				
				$(".rival_pad").css('left',data[0].left)
				$(".rival_pad").css('top',data[0].top)
				
				if(!started){
					if(data[1]==2){
						started = true;
						$(".status_cnt").html("Attention, Game starts in 3 seonds");
						setTimeout(function(){
							getTopOffset.tOffset = -5;
						},3000)
					}
				}
			}
		});
	},300);
}

function endGame(){
	$.ajax({
		url:"/emptyPairPlayer",
		success:function(data){
			var json = eval(data);
			popup(json);
		}
	});
	
	joined = false;
	window.clearInterval(exchangeTimer)
	window.clearInterval(pairTimer)
	$(".btn1").html("Join Game");
	$(".btn2").html("Start Game");
	$(".name").html("__");
	changeHintPosition("Click to Join our Game!!", $(".btn1").position().left+220, $(".btn1").position().top-30)
}

