
// {{APP_NAME}}

var getUtils = function(){
	return require('./Utils/Utils');
};

var getLogicFactory = function(){
	return require('./Logic/LogicFactory');
};

var getContainerFactory = function(){
	return require('./Container/ContainerFactory');
};

var getModelFactory = function(){
	return require('./Model/ModelFactory');
};

var getModelSanitizerFactory = function(){
	return require('./ModelSanitizer/ModelSanitizerFactory');
};

var getModelValidatorFactory = function(){
	return require('./ModelValidator/ModelValidatorFactory');
};

var getConstraintFactory = function(){
	return require('./Constraint/ConstraintFactory');
};

module.exports = {
	getUtils                 : getUtils,
	getLogicFactory          : getLogicFactory,
	getContainerFactory      : getContainerFactory,
	getModelFactory          : getModelFactory,
	getModelSanitizerFactory : getModelSanitizerFactory,
	getModelValidatorFactory : getModelValidatorFactory,
	getConstraintFactory     : getConstraintFactory
};

