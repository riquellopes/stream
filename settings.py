#coding: utf-8
try:
	from local_config import *
except ImportError:
	from os import path, environ
	MONGO_HOST = environ.get('MONGO_HOST')
	MONGO_USER = environ.get('MONGO_USER')
	MONGO_PASS = environ.get('MONGO_PASS')
	MONGO_SOURCE = environ.get('MONGO_SOURCE')
	SECRET_KEY=environ.get('SECRET_KEY')
	CONSUMER_SECRET=environ.get('CONSUMER_SECRET')
	CONSUMER_KEY=environ.get('CONSUMER_KEY')
