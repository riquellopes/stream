#coding: utf-8
import datetime
import time
from flask import Flask, render_template, Response, request, session, redirect, url_for
from pymongo import MongoClient, DESCENDING

#http://www.html5rocks.com/en/tutorials/eventsource/basics/
#http://peter-hoffmann.com/stackoverflow/12236019.html
#http://jwage.com/post/30490196727/mongodb-tailable-cursors
#http://www.w3.org/TR/eventsource/
#https://github.com/jakubroztocil/chat

app = Flask(__name__)
app.config.from_object("settings")
client = MongoClient(app.config['MONGO_HOST'])
client.the_database.authenticate(app.config['MONGO_USER'], app.config['MONGO_PASS'], source=app.config['MONGO_SOURCE'])
db = client['pubsub']

def event_stream():
	"""
		Creating an alternative for pupsub by redis.
		Mongo commands:
		 	users pubsub
			db.createCollection('messages', {capped:true, size: 100000})
	"""
	cursor =  db.messages.find(tailable=True)
	while cursor.alive:
		try:
			doc = cursor.next()
			data = []
			data.append('data:{\n')
			data.append('data: "message": "{0}",\n'.format(doc['message']))
			data.append('data: "date": "{0}",\n'.format(doc['time']))
			data.append('data: "avatar": "{0}",\n'.format(doc.get('avatar', "00000000000000000000000000000000") ) )
			data.append('data: "user": "{0}"\n'.format(doc.get('user', "user@site.com") ) )
			data.append('data:}\n\n')
			yield "".join(data)
		except StopIteration:
			time.sleep(1)
			
@app.route("/")
def home():
	return render_template("index.html")

@app.route("/post", methods=['post'])
def post():
	user = session['user']['email']
	time = datetime.datetime.utcnow()
	db.messages.insert({'message':request.form['message'], 'user':user, "time":time, "avatar":gravatar(user)})
	return Response(status=200)
	
@app.route("/stream")
def stream():
	return Response(event_stream(), mimetype="text/event-stream")

def gravatar(email="user@site.com"):
	"""
		https://pt.gravatar.com/site/implement/images/python/
	"""
	import hashlib
	gravatar_url = "{0}".format(hashlib.md5(email.lower()).hexdigest())
	return gravatar_url

@app.route("/login", methods=['post'])
def login():
	session['user'] = dict(email=request.form['email'])
	return Response(status=200)

@app.route('/logout')
def logout():
	session.clear()
	return redirect(url_for('home'))
	
@app.context_processor
def user_loggend():
	return dict(user_loggend=session.get('user'))
