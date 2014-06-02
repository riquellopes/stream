'use strict';
	
	var Chat = function(urlStream){
		this.ready = false;
		this.source = new EventSource(urlStream);
		this.source.addEventListener('message', this.message, false);
		this.source.addEventListener('error', this.error, false);
		this.source.addEventListener('open', this.open, false);
		
		this.bind()
	};
	
	Chat.prototype.message = function(e){	
		var data = JSON.parse(e.data);	
		var source = $('#message-template').html();
		var template = Handlebars.compile(source);
		
		$("#message").append( template(data) );
	}
	
	Chat.prototype.error = function(){
		//Method utilized for situations by error.
		console.log(">>> Error process.")
	}
	
	Chat.prototype.open = function(){
		console.log(">>> Open process.")
	}
	
	Chat.prototype.close = function(){
		this.source.close();
		console.log(">>> Close process.")
	}
	
	Chat.prototype.bind = function(){
		$(":button").on('click', function(){
			var message = $(":text").val().trim();
			if( message.length > 0 ){
				$.post('/post', {'message':message});
				$(':text').val("");
			}else{
				alert('Write a message!');
				$(':text').focus();
			}
		});
		
		$(":text").on('keyup', function(e){
			if( e.keyCode == 13 ){
				$(":button").click();
			}
		});	
	}
	
	Handlebars.registerHelper("gravatar", function(o) {
		var avatar = o.hash.src.replace('?', '');
		return 'src=http://www.gravatar.com/avatar/'.concat(avatar).concat("?s=").concat(o.hash.s);
	});
	
	Handlebars.registerHelper("data_format", function(date) {
		var d = new Date( Date.parse(date) );
		if( !isNaN( d.getMonth() ) ){
			return ( d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear()+" "+d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		}
	});
	
$(function(){
	new Chat('/stream');
});