
// Constraint Implementation Factory
// 
// usage:
//     
//     * sqlmaker implementation
//     
//     var MyAppImpl = require('MyAppImpl');
//     var ConstraintImplFactory = MyAppImpl.getConstraintImplFactory();
//     
//     var impl = ConstraintImplFactory.getImplementation(segment_entity);
//     if( impl ){
//         return impl;
//     }else{
//         return generated_sqlmaker;
//     }
//     
//     

var constraints = {};

var getImplementation= function(segment_entity){
	return constraints[segment_entity];
};

module.exports = {
	getImplementation : getImplementation,
};

/*

define your implementation here.

var module_caches = {};

constraints.__defineGetter__('Segment/Entity', function(){
	if( module_caches['Segment/Entity'] ){
		return module_caches['Segment/Entity'];
	}
	module_caches['Segment/Entity'] = require('./Segment/EntitySQLMaker');
	return module_caches['Segment/Entity'];
});

*/


