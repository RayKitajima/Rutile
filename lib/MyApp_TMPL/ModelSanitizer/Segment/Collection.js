
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

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// 
// sanitizers
// 

{{#Fields}}
var {{field}}Sanitizer = function(value){
	return GenericSanitizer.{{sanitizeMethod}}(value);
};

{{/Fields}}
var sanitizers = { {{#Align_colon}}
{{#Fields}}
	{{field}} : {{field}}Sanitizer{{^last}},{{/last}}
{{/Fields}}
{{/Align_colon}}
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

var sanitize = function(field,value){
	var fieldSanitizer = sanitizers[field];
	return fieldSanitizer(value);
};

module.exports = {
	sanitize : sanitize
};

