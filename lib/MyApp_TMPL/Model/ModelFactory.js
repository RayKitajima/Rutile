
// ModelFactory

// usage;
//     
//     var ModelFactory = require('ModelFactory');
//     var model = ModelFactory.getModel('SEGMENT/MODEL');
//     
//     var instance = Model.instance(id);
//     

var {{APP_NAME}}Impl = require('{{APP_NAME}}Impl');
var ModelImplFactory = {{APP_NAME}}Impl.getModelImplFactory();

var ModelManifest = require('./ModelManifest');

var models = {};

var util = require('util');

var getModel = function(segment_entity,plain){ // plain flag to get pure generated logic
	if( models[segment_entity] ){
		return models[segment_entity];
	}
	var impl = ModelImplFactory.getImplementation(segment_entity);
	if( impl && !plain ){
		models[segment_entity] = impl;
		return impl;
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
	getModel : getModel
};

