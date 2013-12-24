
// ModelValidatorImplFactory

// usage;
//     
//     var ModelValidatorImplFactory = require('MyAppImpl').getModelValidatorImplFactory();
//     
//     var EntityValidator = ModelValidatorImplFactory.getImplementation('Segment/Entity');
//     
//     var safe_valueA = EntityValidator.sanitize("fieldA",valueA);
//     
//     

var validators = {};

var getImplementation = function(segment_entity){
	return validators[segment_entity];
};

module.exports = {
	getImplementation : getImplementation
};

/*

var module_caches = {};

validators.__defineGetter__('Segment/Entity', function(){
	if( module_caches['Segment/Entity'] ){
		return module_caches['Segment/Entity'];
	}
	module_caches['Segment/Entity'] = require('./Segment/Entity');
	return module_caches['Segment/Entity'];
});

*/

