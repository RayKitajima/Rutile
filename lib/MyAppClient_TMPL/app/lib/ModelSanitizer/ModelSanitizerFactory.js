
// ModelSanitizerFactory

// usage;
//     
//     var ModelSanitizerFactory = require('ModelSanitizerFactory');
//     
//     var EntitySanitizer = ModelSanitizerFactory.getSanitizer('Segment/Entity');
//     
//     var safe_valueA = EntitySanitizer.sanitize("fieldA",valueA);
//     
//     

var ModelSanitizerManifest = require('./ModelSanitizerManifest');

var sanitizers = {};

/*
var getSanitizer = function(segment_entity){
	if( sanitizers[segment_entity] ){
		return sanitizers[segment_entity];
	}
	var module = ModelSanitizerManifest[segment_entity];
	if( module ){
		sanitizers[segment_entity] = require(module);
		return sanitizers[segment_entity];
	}else{
		return false;
	}
};
*/

// not yet implemented
var dummy = require('./DummySanitizer');
var getSanitizer = function(segment_entity){
	return dummy;
};

module.exports = {
	getSanitizer : getSanitizer
};

