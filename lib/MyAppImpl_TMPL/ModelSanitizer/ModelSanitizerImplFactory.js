
// ModelSanitizerImplFactory

// usage;
//     
//     var ModelSanitizerImplFactory = require('MyAppImpl').getModelSanitizerImplFactory();
//     
//     var EntitySanitizer = ModelSanitizerImplFactory.getImplementation('Segment/Entity');
//     
//     var safe_valueA = EntitySanitizer.sanitize("fieldA",valueA);
//     
//     

var sanitizers = {};

var getImplementation = function(segment_entity){
	return sanitizers[segment_entity];
};

module.exports = {
	getImplementation : getImplementation
};

/*

var module_caches = {};

sanitizers.__defineGetter__('Segment/Entity', function(){
	if( module_caches['Segment/Entity'] ){
		return module_caches['Segment/Entity'];
	}
	module_caches['Segment/Entity'] = require('./Segment/Entity');
	return module_caches['Segment/Entity'];
});

*/

