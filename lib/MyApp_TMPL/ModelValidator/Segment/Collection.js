
// {{entity}} validator

// (collection validator)

// idioms:
//     
//     var instance = Model.instance(id);
//     if( instance.valid() ){
//         console.log("it is valid instance");
//     }
//     
//     

// usage:
//     
//     var ModelValidatorFactory = require('ModelValidatorFactory');
//     var Validator = ModelValidatorFactory.getValidator('Segment/Entity');
//     
//     // bulk test, returns false if any invalid field,
//     // you cant know which field is invalid.
//     if( Validator.validate(instance) ){
//         instance.save();
//     }
//     
//     

// static variables

var GenericValidator = require('../GenericValidator');

var {{APP_NAME}} = require('{{APP_NAME}}');
var ModelFactory = {{APP_NAME}}.getModelFactory();

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

var validate = function(instance){
	var {{collectedEntity}}Model = ModelFactory.getModel('{{collectedSegment}}/{{collectedEntity}}');
	var collection = instance.collection;
	for( var i=0, len=collection.length; i<len; i++ ){
		var {{collectedID}} = collection[i];
		var {{#Lc_first}}{{collectedEntity}}{{/Lc_first}} = {{collectedEntity}}Model.instance({{collectedID}});
		if( !{{#Lc_first}}{{collectedEntity}}{{/Lc_first}}.valid() ){
			return false;
		}
	}
	return true;
};

module.exports = {
	validate : validate
};


