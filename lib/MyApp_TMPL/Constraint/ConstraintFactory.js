
// Constraint Factory

// usage:
//     
//     var ConstraintFactory = require('MyApp').getConstraintFactory();
//     
//     // get sqlmaker module for the model
//     var sqlmaker = ContainerFactory.getSQLMaker('Segment/Entity');
//     
//     

var {{APP_NAME}}Impl = require('{{APP_NAME}}Impl');
var ConstraintImplFactory = {{APP_NAME}}Impl.getConstraintImplFactory();

var ConstraintManifest = require('./ConstraintManifest');

var constraints = {};

var getSQLMaker = function(segment_entity){
	if( constraints[segment_entity] ){
		return new constraints[segment_entity];
	}
	var impl = ConstraintImplFactory.getImplementation(segment_entity);
	if( impl ){
		constraints[segment_entity] = impl;
		return impl;
	}
	var module = ConstraintManifest[segment_entity];
	if( module ){
		constraints[segment_entity] = require(module);
		return constraints[segment_entity];
	}else{
		return false;
	}
};

module.exports = {
	getSQLMaker : getSQLMaker
};


