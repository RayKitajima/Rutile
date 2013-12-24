
// ModelSanitizerFactory

// usage;
//     
//     var ModelSanitizerFactory = require('MyAppImpl').getModelSanitizerFactory();
//     var ModelSanitizerFactory = require('ModelSanitizerFactory');
//     
//     var EntitySanitizer = ModelSanitizerFactory.getSanitizer('Segment/Entity');
//     
//     var safe_valueA = EntitySanitizer.sanitize("fieldA",valueA);
//     
//     

var {{APP_NAME}}Impl = require('{{APP_NAME}}Impl');
var ModelSanitizerImplFactory = {{APP_NAME}}Impl.getModelSanitizerImplFactory();

var ModelSanitizerManifest = require('./ModelSanitizerManifest');

var sanitizers = {};

var getSanitizer = function(segment_entity){
	if( sanitizers[segment_entity] ){
		return sanitizers[segment_entity];
	}
	var impl = ModelSanitizerImplFactory.getImplementation(segment_entity);
	if( impl ){
		sanitizers[segment_entity] = impl;
		return impl;
	}
	var module = ModelSanitizerManifest[segment_entity];
	if( module ){
		sanitizers[segment_entity] = require(module);
		return sanitizers[segment_entity];
	}else{
		return false;
	}
};

module.exports = {
	getSanitizer : getSanitizer
};

