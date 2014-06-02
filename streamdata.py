#coding: utf-8
class StreamData(list):
	
	def append(self, name, value):
		data = ("data: {0}:{1}".format(name, value))
		super(StreamData, self).append(data)
	
	def yields(self):
		pass