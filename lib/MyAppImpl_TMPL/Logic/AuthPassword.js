
var unixtime = require('unixtime');
var jws = require('jws');

var {{APP_NAME}} = require('{{APP_NAME}}');

var {{APP_NAME}}Config = require('{{APP_NAME}}Config');
var cert = {{APP_NAME}}Config.JWSCert;

var ModelFactory = {{APP_NAME}}.getModelFactory();
var {{auth_entity}}Model = ModelFactory.getModel('{{auth_segment}}/{{auth_entity}}');

var authorize_error = function(context,app,message){
	if( !context.Error ){ context.Error={}; }
	context.Error.AuthPassword = {};
	context.Error.AuthPassword.authorize = { 'message' : message };
	context.response.push({
		apptag : methods.authorize.tag,
		result : false,
		serial : app.serial
	});
};

var authenticate_error = function(context,app,message){
	if( !context.Error ){ context.Error={}; }
	context.Error.AuthPassword = {};
	context.Error.AuthPassword.authenticate = { message : message };
	delete context.token;
	delete context.decoded_token;
};

// authorize method is called as a normal app
var authorize = function(context,app){
	var id   = app.params.id;
	var pass = app.params.pass;
	if( !id || !pass ){
		authorize_error(context,app,'authorization failed');
		return false;
	}
	
	var query = {
		constraint: {
			"{{auth_segment}}/{{auth_entity}}.{{auth_id_field}}(key)" : { values:[id] },
		}
	};
	var instances = {{auth_entity}}Model.search(query);
	var instance = instances[0];
	if( !instance ){
		authorize_error(context,app,'authorization failed');
		return false;
	}
	
	var profile;
	if( instance.{{auth_pass_field}} === pass ){
		profile = {
			authorized : true,
			id : instance.{{auth_id_field}},
			{{auth_id_field}} : instance.{{auth_id_field}}, // alias
			expires : unixtime() + {{token_lifetime}},
		};
	}else{
		authorize_error(context,app,'authorization failed');
		return false;
	}
	var signed_token = jws.sign({ header:{ type:'JWT', alg:'HS256' }, payload:profile, secret:cert });
	context.response.push({
		apptag : methods.authorize.tag,
		result : signed_token, // should be stored in client
		serial : app.serial
	});
	return true;
};

// authenticate method is called as wrapper, so you dont need to pass the app in your argument
var authenticate = function(context,app){
	var token = context.token;
	var valid = jws.verify(token,cert);
	if( !valid ){
		if( !app ){ app = {}; }
		authenticate_error(context,app,'invalid token');
		return false;
	}
	var decoded_token = jws.decode(token,{json:true});
	if( unixtime() > decoded_token.payload.expires ){
		if( !app ){ app = {}; }
		authenticate_error(context,app,'token expired');
		return false;
	}
	context.volatile.decoded_token = decoded_token; // will be cleared at the end of this session
	return true;
};

var methods = {
	authorize    : { method:authorize,    tag:"AuthPassword.authorize"    },
	authenticate : { method:authenticate, tag:"AuthPassword.authenticate" }
};

var getMethod = function(name){
	return methods[name].method;
};

module.exports = {
	getMethod : getMethod
};
