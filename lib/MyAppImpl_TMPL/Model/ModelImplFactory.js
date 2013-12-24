
// ModelImplFactory

// usage;
//     
//     var ModelImplFactory = require('MyAppImpl').getModelImplFactory();
//     
//     var model = ModelImplFactory.getImplementation('Segment/Entity');
//     var instance = Model.instance(id);
//     
//     

var models = {};

var getImplementation = function(segment_entity){
	return models[segment_entity];
};

module.exports = {
	getImplementation : getImplementation
};

/*

define your implementation here.

var module_caches = {};

models.__defineGetter__('Segment/Entity', function(){
	if( module_caches['Segment/Entity'] ){
		return module_caches['Segment/Entity'];
	}
	module_caches['Segment/Entity'] = require('./Segment/Entity');
	return module_caches['Segment/Entity'];
});

*/

