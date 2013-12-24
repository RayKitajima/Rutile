
// 
// model provider
// 
// usage:
//     
//     var ModelFactory = require('Model/ModelFactory');
//     var Model = ModelFactory.getModel('SEGMENT/ENTITY');
//     
//     

var ModelManifest = require('Model/ModelManifest');

var models = {};

var getModel = function(segment_entity){
	if( models[segment_entity] ){
		return models[segment_entity];
	}
	var module = ModelManifest[segment_entity];
	if( module ){
		models[segment_entity] = require(module);
		return models[segment_entity];
	}else{
		return false;
	}
};

module.exports = {
	getModel : getModel,
};

