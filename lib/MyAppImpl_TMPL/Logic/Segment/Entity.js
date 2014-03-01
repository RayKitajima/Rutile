
var {{APP_NAME}} = require('{{APP_NAME}}');
var LogicFactory = {{APP_NAME}}.getLogicFactory();
var {{entity}}Logic = LogicFactory.getLogic("{{segment}}/{{entity}}",true); // pass true to get pure generated logic

{{#ImplAuthLogic}}
{{#AuthPassword}}
var Auth = require('../AuthPassword');
{{/AuthPassword}}
{{/ImplAuthLogic}}

var search_impl = function(context,app){
	{{#ImplAuthLogic}}
	// requires authentication
	var authenticate = Auth.getMethod('authenticate');
	if( !authenticate(context) ){
		return; // message will be sent with context.Error.<AuthImpl>.authenticate
	}
	{{/ImplAuthLogic}}
	var method = {{entity}}Logic.getMethod('search');
	method(context,app);
};

var launch_impl = function(context,app){
	{{#ImplAuthLogic}}
	// requires authentication
	var authenticate = Auth.getMethod('authenticate');
	if( !authenticate(context) ){
		return; // message will be sent with context.Error.<AuthImpl>.authenticate
	}
	{{/ImplAuthLogic}}
	var method = {{entity}}Logic.getMethod('launch');
	method(context,app);
};

var get_impl = function(context,app){
	{{#ImplAuthLogic}}
	// requires authentication
	var authenticate = Auth.getMethod('authenticate');
	if( !authenticate(context) ){
		return; // message will be sent with context.Error.<AuthImpl>.authenticate
	}
	{{/ImplAuthLogic}}
	var method = {{entity}}Logic.getMethod('get');
	method(context,app);
};

var remove_impl = function(context,app){
	{{#ImplAuthLogic}}
	// requires authentication
	var authenticate = Auth.getMethod('authenticate');
	if( !authenticate(context) ){
		return; // message will be sent with context.Error.<AuthImpl>.authenticate
	}
	{{/ImplAuthLogic}}
	var method = {{entity}}Logic.getMethod('remove');
	method(context,app);
};

var register_impl = function(context,app){
	{{#ImplAuthLogic}}
	// requires authentication
	var authenticate = Auth.getMethod('authenticate');
	if( !authenticate(context) ){
		return; // message will be sent with context.Error.<AuthImpl>.authenticate
	}
	{{/ImplAuthLogic}}
	var method = {{entity}}Logic.getMethod("register");
	method(context,app);
};

var methods = {
	search   : { method:search_impl,   tag:"{{segment}}/{{entity}}.search"   },
	launch   : { method:launch_impl,   tag:"{{segment}}/{{entity}}.launch"   },
	get      : { method:get_impl,      tag:"{{segment}}/{{entity}}.get"      },
	remove   : { method:remove_impl,   tag:"{{segment}}/{{entity}}.remove"   },
	register : { method:register_impl, tag:"{{segment}}/{{entity}}.register" },
};

var getMethod = function(name){
	return methods[name].method;
};

module.exports = {
	getMethod : getMethod
};

