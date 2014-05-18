from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import Context, loader
from django.db import connection
from django.db import transaction
from random import Random
import random
import string
import MySQLdb
import json

# query user information
def queryUsers(request):
	username = request.GET.get('username')
	cursor = connection.cursor()
	if username == "":
		cursor.execute('SELECT users.name,users.score,clubs.name FROM users,clubs,users_clubs WHERE users.id=users_clubs.users_id AND clubs.id=users_clubs.clubs_id ORDER BY users.name')
	else:
		cursor.execute('SELECT users.name,users.score,clubs.name FROM users,clubs,users_clubs WHERE users.id=users_clubs.users_id AND clubs.id=users_clubs.clubs_id AND users.name="'+username+'" ORDER BY users.name')
	users = []
	for row in cursor.fetchall():
		users.append({'name':row[0], 'score':row[1], 'club':row[2]})
	cursor.close()
	return HttpResponse(json.dumps(users),  content_type="application/json")

# add users
def addUsers(request):
	username = request.GET.get('username')
	birthday = request.GET.get('birthday')
	email = request.GET.get('email')
	clubname = request.GET.get('clubname')
	score = request.GET.get('score')
	
	cursor = connection.cursor()
	
	if username == "" or birthday == "" or email == "" or clubname == "" or score == "":
		return HttpResponse(json.dumps(''),  content_type="application/json")
	else:
		cursor.execute('SELECT COUNT(id) FROM users')
		user_num = cursor.fetchone()[0]+1
		cursor.execute('SELECT COUNT(id) FROM users_clubs')
		relation_num = cursor.fetchone()[0]+1
		cursor.execute('SELECT id FROM clubs WHERE name="'+clubname+'"')
		club_id = cursor.fetchone()[0]
		
		cursor.execute('INSERT INTO users VALUES('+str(user_num)+',"'+username+'","'+birthday+'","'+email+'",'+score+')')
		cursor.execute('INSERT INTO users_clubs VALUES('+str(relation_num)+','+str(user_num)+','+str(club_id)+')')
		transaction.commit_unless_managed()
		
		#cursor.execute('SELECT users.name,users.score,clubs.name FROM users,clubs,users_clubs WHERE users.id=users_clubs.users_id AND clubs.id=users_clubs.clubs_id AND users.id='+str(user_num))
		#users=[]
		#row = cursor.fetchone()
		#users.append({'name':row[0], 'score':row[1], 'club':row[2]})
		cursor.close()
		return HttpResponse(json.dumps('success'),  content_type="application/json")
	
# delete users
def deleteUsers(request):
	username = request.GET.get('username')
	score = request.GET.get('score')
	clubname = request.GET.get('clubname')
	
	cursor = connection.cursor()
	
	cursor.execute('SELECT id FROM users WHERE name="'+username+'" AND score='+str(score))
	user_id = cursor.fetchone()[0]
	cursor.execute('SELECT id FROM clubs WHERE name="'+clubname+'"')
	club_id = cursor.fetchone()[0]

	cursor.execute('DELETE FROM users_clubs WHERE users_id='+str(user_id)+' AND clubs_id='+str(club_id))
	#cursor.execute('DELETE FROM users WHERE id='+str(user_id))
	transaction.commit_unless_managed()
	cursor.close()
	return HttpResponse(json.dumps('success'),  content_type="application/json")



# a sample member list : [{'userName':'fakeUser1', 'url':'1.jpg','score':2013, 'left':0, 'top':0}]
memberList = []
curPair = []
ballStatus = {'left':0, 'top':0, 'x':0, 'y':0}
startGameCount = {'count':0}

# type in http://localhost/play, which will redirect to index.html
def play(request):
	return render_to_response("index.html")

# login
def loginPage(request):
	return render_to_response("login.html");
	

# respond to startGame request
def startGame(request):
	startGameCount['count'] += 1
	if startGameCount['count']==1:
		return HttpResponse(json.dumps("wait"),  content_type="application/json")
	elif startGameCount['count']==2:
		return HttpResponse(json.dumps("start"),  content_type="application/json")

# players send the position of their own pad, and get update about rival's pad position 
def exchange(request):
    padLeft = request.GET.get('left')
    padTop = request.GET.get('top')
    otherInfo = None
    pos = request.session['pos']
    if pos=='down':
	    curPair[0]['left'] = padLeft
	    curPair[0]['top'] = padTop
	    otherInfo = curPair[1]
    elif pos=='up':
	    curPair[1]['left'] = padLeft
	    curPair[1]['top'] = padTop
	    otherInfo = curPair[0]
    return HttpResponse(json.dumps([otherInfo,startGameCount['count']]),  content_type="application/json")

# update current member lists
def updateOnlineMember(request):	
	return HttpResponse(json.dumps(memberList),  content_type="application/json")

# create dict object for each player and assign a unique session
def joinGame(request):
	#generate a random user name
	username = "Play_"+random_str(2)
	newData = {'userName':username, 'url':str(random.randint(0,6))+'.jpg','score':0, 'left':0, 'top':0}
	curPair.append(newData)

	# the first player is signed to the table at the bottom
	if len(curPair)==1:
		memberList.append(newData)
		request.session['userName'] = username
		request.session['pos'] = 'down'
		
	# the second player is signed to the table at the top
	elif len(curPair)==2:
		memberList.append(newData)
		request.session['userName'] = username
		request.session['pos'] = 'up'
		
	return HttpResponse(json.dumps([newData, curPair]),  content_type="application/json")

# respond to request that if the game can start
def requestPairPlayers(request):
	return HttpResponse(json.dumps(curPair),  content_type="application/json")

# empty current member list and clear the number of players
def emptyPairPlayer(request):
	del memberList[:]
	del curPair[:]
	startGameCount['count'] = 0
	return HttpResponse(json.dumps(["success"]),  content_type="application/json")

# a function that returns a random string for user name
def random_str(randomlength=8):
    str = ''
    chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
    length = len(chars) - 1
    random = Random()
    for i in range(randomlength):
        str+=chars[random.randint(0, length)]
    return str
