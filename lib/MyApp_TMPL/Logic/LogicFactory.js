
// LogicFactory

// usage;
//     
//     var LogicFactory = require('MyApp').getLogicFactory();
//     
//     var method = LogicFactory.getMethod('Segment/Entity.method');
//     
//     method(context);
//     
//     

var tag_pattern = /(.*)\.(.*)/;

var {{APP_NAME}}Impl = require('{{APP_NAME}}Impl');
var LogicImplFactory = {{APP_NAME}}Impl.getLogicImplFactory();

var LogicManifest = require('./LogicManifest');

var logics = {};

var getLogic = function(logic_tag,plain){ // plain flag to get pure generated logic
	var impl = LogicImplFactory.getLogicImplementation(logic_tag);
	if( impl && !plain ){
		return impl;
	}else{
		var match = logic_tag.match(tag_pattern);
		if( match ){
			logic_tag = match[1];
		}
		var logic;
		if( logics[logic_tag] ){
			logic = logics[logic_tag];
		}else{
			var module = LogicManifest[logic_tag];
			logic = require(module);
			logics[logic_tag] = logic;
		}
		return logic;
	}
};

var getMethod = function(logic_tag,plain){ // plain flag to get pure generated logic
	var impl = LogicImplFactory.getMethodImplementation(logic_tag);
	if( impl && !plain ){
		return impl;
	}else{
		var match = logic_tag.match(tag_pattern);
		var segment_entity = match[1];
		var method = match[2];
		if( logics[segment_entity] ){
			var logic = logics[segment_entity];
			return logic.getMethod(method);
		}else{
			var module = LogicManifest[segment_entity];
			var logic = require(module);
			logics[segment_entity] = logic;
			return logic.getMethod(method);
		}
	}
};

module.exports = {
	getLogic  : getLogic,
	getMethod : getMethod
};


