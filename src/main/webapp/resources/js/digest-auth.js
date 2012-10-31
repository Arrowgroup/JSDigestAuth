/*
 * A JavaScript implementation of the Digest Authentication
 * Digest Authentication, as defined in RFC 2617.
 * Version 1.0 Copyright (C) Maricn Michalski (http://marcin-michalski.pl) 
 * Distributed under the BSD License
 * 
 * site: http://arrowgroup.eu
 */

$.Class("pl.arrowgroup.DigestAuthentication", {
	MAX_ATTEMPTS : 1,
	AUTHORIZATION_HEADER : "Authorization",
	WWW_AUTHENTICATE_HEADER : 'WWW-Authenticate',
	NC : "00000001", //currently nc value is fixed it is not incremented
	HTTP_METHOD : "GET",
	/**
	 * settings json:
	 *  - onSuccess - on success callback
	 *  - onFailure - on failure callback
	 *  - username - user name
	 *  - password - user password
	 *  - cnonce - client nonce
	 */
	init : function(settings) {
		this.settings = settings;
	},
	setCredentials: function(username, password){
		this.settings.username = username;
		this.settings.password = password;
	},
	call : function(uri){
		this.attempts = 0;
		this.invokeCall(uri);
	},
	invokeCall: function(uri,authorizationHeader){
		var digestAuth = this;
		$.ajax({
		        url: uri,
		        type: this.HTTP_METHOD,
		        beforeSend: function(request){
		        	if(typeof authorizationHeader != 'undefined'){
		        		request.setRequestHeader(digestAuth.AUTHORIZATION_HEADER, authorizationHeader); 		        		
		        	}
		        },
		        success: function(response) {
		        	digestAuth.settings.onSuccess(response);		        	
		        },
		        error: function(response) { 
		        	if(digestAuth.attempts == digestAuth.MAX_ATTEMPTS){
			    		digestAuth.settings.onFailure(response);
			    		return;
			    	}
		        	var paramParser = new pl.arrowgroup.HeaderParamsParser(response.getResponseHeader(digestAuth.WWW_AUTHENTICATE_HEADER));
		        	var nonce = paramParser.getParam("nonce");
		        	var realm = paramParser.getParam("realm");
		        	var qop = paramParser.getParam("qop");
		        	var response = digestAuth.calculateResponse(uri, nonce, realm, qop);
		        	var authorizationHeaderValue = digestAuth.generateAuthorizationHeader(paramParser.headerValue, response, uri); 
		        	digestAuth.attempts++;
		        	digestAuth.invokeCall(uri, authorizationHeaderValue);
		        }	    		       
		    });
	},
	calculateResponse : function(uri, nonce, realm, qop){
		var a2 = this.HTTP_METHOD + ":" + uri;
		var a2Md5 = hex_md5(a2);
		var a1Md5 = hex_md5(this.settings.username + ":" + realm + ":" + this.settings.password);
		var digest = a1Md5 + ":" + nonce + ":" + this.NC + ":" + this.settings.cnonce + ":" + qop + ":" +a2Md5;
		return hex_md5(digest);
	},
	generateAuthorizationHeader : function(wwwAuthenticationHeader, response, uri){
		return wwwAuthenticationHeader+', username="'+this.settings.username+'", uri="'+
			   uri+'", response="'+response+'", nc='+
			   this.NC+', cnonce="'+this.settings.cnonce+'"';
	}
});
$.Class("pl.arrowgroup.HeaderParamsParser",{
	init : function(headerValue) {
		this.headerValue = headerValue;
		this.headerParams = this.headerValue.split(",");
	},
	getParam: function(paramName){
		var paramVal = null;
		$.each(this.headerParams, function(index, value){
    		if(value.indexOf(paramName)>0){
    			paramVal = value.split(paramName+"=")[1];
    			paramVal = paramVal.substring(1, paramVal.length-1);
    		}
    	});
		return paramVal;
	}
});

