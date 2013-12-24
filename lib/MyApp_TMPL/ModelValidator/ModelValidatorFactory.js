
// ModelValidatorFactory

// usage;
//     
//     var ModelValidatorFactory = require('MyAppImpl').getModelValidatorFactory();
//     var ModelValidatorFactory = require('ModelValidatorFactory');
//     
//     var EntityValidator = ModelValidatorFactory.getValidator('Segment/Entity');
//     
//     var safe_valueA = EntityValidator.validate("fieldA",valueA);
//     
//     

var {{APP_NAME}}Impl = require('{{APP_NAME}}Impl');
var ModelValidatorImplFactory = {{APP_NAME}}Impl.getModelValidatorImplFactory();

var ModelValidatorManifest = require('./ModelValidatorManifest');

var validators = {};

var getValidator = function(segment_entity){
	if( validators[segment_entity] ){
		return validators[segment_entity];
	}
	var impl = ModelValidatorImplFactory.getImplementation(segment_entity);
	if( impl ){
		validators[segment_entity] = impl;
		return impl;
	}
	var module = ModelValidatorManifest[segment_entity];
	if( module ){
		validators[segment_entity] = require(module);
		return validators[segment_entity];
	}else{
		return false;
	}
};

module.exports = {
	getValidator : getValidator
};
