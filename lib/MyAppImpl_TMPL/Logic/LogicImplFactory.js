
// LogicImplFactory

// usage;
//     
//     var LogicImplFactory = require('MyAppImpl').getLogicImplFactory();
//     
//     var logic = LogicImplFactory.getLogicImplementation('Logic_tag');
//     
//     var method = LogicImplFactory.getMethodImplementation('Logic.method');
//     method(context);
//     
//     

var tag_pattern = /(.*)\.(.*)/;

var LogicImplManifest = require('./LogicImplManifest');

var logics = {};

var getLogicImplementation = function(logic_tag){
	var match = logic_tag.match(tag_pattern);
	if( match ){
		logic_tag = match[1];
	}
	var logic;
	if( logics[logic_tag] ){
		logic = logics[logic_tag];
	}else{
		var module = LogicImplManifest[logic_tag];
		logic = require(module);
		logics[logic_tag] = logic;
	}
	return logic;
};

var getMethodImplementation = function(logic_tag){
	var match = logic_tag.match(tag_pattern);
	var segment_entity = match[1];
	var method = match[2];
	if( logics[segment_entity] ){
		var logic = logics[segment_entity];
		return logic.getMethod(method);
	}else{
		var module = LogicImplManifest[segment_entity];
		if( module ){
			var logic = require(module);
			logics[segment_entity] = logic;
			return logic.getMethod(method);
		}
	}
};

module.exports = {
	getLogicImplementation  : getLogicImplementation,
	getMethodImplementation : getMethodImplementation
};


