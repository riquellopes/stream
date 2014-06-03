#coding: utf-8
try:
	from local_config import *
except ImportError:
	from os import path, environ
	MONGO_HOST = environ.get('MONGO_HOST')
	MONGO_USER = environ.get('MONGO_USER')
	MONGO_PASS = environ.get('MONGO_PASS')
	MONGO_SOURCE = environ.get('MONGO_SOURCE')
SECRET_KEY='sp1mF6eusUS5kPN71IlQ4EoUvQoR8z0q'
CONSUMER_SECRET='621413ddea2bcc5b2e83d42fc40495de'
CONSUMER_KEY=188477911223606
