
// {{entity}} validator

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
//     // to know field validity, you should call validator for each field
//     if( !Validator.validate(instance,"field") ){
//         throw("the field is invalid!");
//     }
//     
//     

// static variables

var GenericValidator = require('../GenericValidator');

var {{APP_NAME}} = require('{{APP_NAME}}');
var ModelFactory = {{APP_NAME}}.getModelFactory();

// true to allow null value
var FieldNullability = { {{#Align_colon}}
	{{primary_key}} : false,
{{#Fields}}
	{{field}} : {{#notNull}}false{{/notNull}}{{^notNull}}true{{/notNull}}{{^last}},{{/last}}
{{/Fields}}
{{/Align_colon}}
};

var isNullableField = function(field){
	return FieldNullability[field];
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// 
// validators
// 

var {{primary_key}}Validators = [];
{{primary_key}}Validators.push(function(instance){
	return GenericValidator.{{primary_key_valid}}(instance.{{primary_key}});
});

{{#Align_equals}}{{#Fields}}
var {{field}}Validators = [];
{{/Fields}}
{{/Align_equals}}

{{#Fields}}
{{#helper}}
{{field}}Validators.push(function(instance){
	var {{#Uc_first}}{{#Cut_trail_id}}{{field}}{{/Cut_trail_id}}{{/Uc_first}}Model = ModelFactory.getModel('{{{helper}}}');
	var {{field}} = instance.{{field}};
	var {{#Cut_trail_id}}{{field}}{{/Cut_trail_id}} = {{#Uc_first}}{{#Cut_trail_id}}{{field}}{{/Cut_trail_id}}{{/Uc_first}}Model.instance({{field}});
	if( {{#Cut_trail_id}}{{field}}{{/Cut_trail_id}}.valid() ){
		return true;
	}else{
		return false;
	}
});

{{/helper}}
{{#valids}}
{{field}}Validators.push(function(instance){
	return GenericValidator.{{valid}}(instance.{{field}});
});
{{/valids}}

{{/Fields}}
var validators = { {{#Align_colon}}
	{{primary_key}} : {{primary_key}}Validators,
{{#Fields}}
	{{field}} : {{field}}Validators{{^last}},{{/last}}
{{/Fields}}
{{/Align_colon}}
};

var getValidator = function(field){
	return validators[field];
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

var validate = function(instance,field){
	if( isNullableField(field) && !instance.entity[field] ){ return true; }
	var fieldValidators = getValidator(field);
	var valid = true;
	for( var i=0; i<fieldValidators.length; i++ ){
		var fieldValidator = fieldValidators[i];
		if( fieldValidator(instance) ){
			valid = true;
		}else{
			valid = false;
			//console.log("[{{entity}} validator] got invalid for field:"+field);
			break;
		}
	};
	return valid;
};

module.exports = {
	validate : validate
};



