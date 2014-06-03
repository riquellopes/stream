'use strict';
	
	var Chat = function(urlStream){
		this.ready = false;
		this.source = new EventSource(urlStream);
		this.source.addEventListener('message', this.message, false);
		this.source.addEventListener('error', this.error, false);
		this.source.addEventListener('open', this.open, false);
		
		this.bind()
	};
	
	var uid = null;
	
	Chat.prototype.message = function(e){	
		var data = JSON.parse(e.data);	
		var source = $('#message-template').html();
		var template = Handlebars.compile(source);
			
			if( uid ){
				data['uid'] = uid;
			}
			
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
	
	Chat.prototype.setUid = function(value){
		uid = value
	}
	
	Chat.prototype.getUid = function(){
		return uid;
	}
	
	Chat.prototype.bind = function(){
		$("#send").on('click', function(){
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
				$("button").click();
			}
		});	
		
		$("form").on("submit", function(){		
			var email = $("#email").val().trim();
			$.post("/login", {'email':email}).
			  done(function(){
				window.location.reload();
			});
			
			$('form').submit(false);
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
	
	Handlebars.registerHelper("direction", function(email) {
		return email == uid ? 'right' : 'left';
	});
	
	Handlebars.registerHelper("pull_right", function(email) {
		return email != uid ? 'pull-right' : '';
	});