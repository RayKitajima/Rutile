
// {{entity}} sanitizer

// idioms:
//     
//     var instance = Model.instance(id);
//     
//     // this will call EntitySanitizer.sanitize("fieldA",valueA) automatically
//     instance.fieldA = valueA;
//     
//     instance.validate();
//     
//     instance.save();
//     
// 
// usage:
//     
//     * instance data comming from outside should be automatically sanitized
//     
//     var ModelSanitizerFactory = require('MyAppImpl').getModelSanitizerFactory();
//     var EntitySanitizer = ModelSanitizerFactory.getSanitizer('Segment/Entity');
//     
//     Model.__defineSetter__('fieldName', function(value){
//         var safe_value = EntitySanitizer.sanitize("fieldName",value);
//         this.entity.fieldName = safe_value;
//         requestCommit.apply(this);
//     });
//     
//     

var GenericSanitizer = require('../GenericSanitizer');

// true to allow null value
var FieldNullability = { {{#Align_colon}}
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
// sanitizers
// 

{{#Align_equals}}{{#Fields}}
var {{field}}Sanitizers = [];
{{/Fields}}
{{/Align_equals}}

// based on field type

{{#Fields}}
{{field}}Sanitizers.push(function(value,nullability){
	return GenericSanitizer.{{typedSanitizeMethod}}(value,nullability);
});

{{/Fields}}
// user defiend
{{#Fields}}
{{#sanitizes}}
{{field}}Sanitizers.push(function(value,nullability){
	return GenericSanitizer.{{sanitize}}(instance.{{field}});
});
{{/sanitizes}}
{{/Fields}}

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

var sanitizers = { {{#Align_colon}}
{{#Fields}}
	{{field}} : {{field}}Sanitizers{{^last}},{{/last}}
{{/Fields}}
{{/Align_colon}}
};

var getSanitizer = function(field){
	return sanitizers[field];
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

var sanitize = function(field,value){
	var sanitized;
	var fieldSanitizers = getSanitizer(field);
	for( var i=0; i<fieldSanitizers.length; i++ ){
		var fieldSanitizer = fieldSanitizers[i];
		sanitized = fieldSanitizer(value,isNullableField(field));
	};
	return sanitized;
};

module.exports = {
	sanitize : sanitize
};


