
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

var getMethod = function(logic_tag){
	// logic implementation allows non Segment/Entity.method format,
	// that might be implemented in impl.
	var impl = LogicImplFactory.getImplementation(logic_tag);
	if( impl ){
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
	getMethod : getMethod
};


