
// type : text (base64 encoded image)

var self = exports;

exports.getName = function(){
	return "{{segment}}/{{entity}}.{{fieldName}}";
};
{{{autosetter}}}
var formGroup;
exports.setFormGroup = function(group){
	formGroup = group;{{#autoset_event}}
	formGroup.listen("{{autoset_event}}",autosetter);{{/autoset_event}}
};

// Form/Entity bindings supports
var observers = [];
exports.addObserver = function(observer){
	observers.push(observer);
};
exports.removeObserver = function(observer){
	var index = observers.indexOf(observer);
	if( index > 0 ){
		observers.splice(index,1);
	}
};
var notify = function(){
	for( var i=0; i<observers.length; i++ ){
		var observer = observers[i];
		observer.observeValue({
			name  : self.getName(),
			field : "{{fieldName}}",
			value : $.{{segment}}_{{entity}}_{{fieldName}}.getValue(), // getValue returns text (base64 encoded image)
		});
	}
};
$.{{segment}}_{{entity}}_{{fieldName}}.putEventListener('change',function(value){
	notify(); // get changed value via getValue()
});

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// hint text
var validate_strings = [];
validate_strings.push(L('FrameworkEditFormValidateNotNull'));
$.{{segment}}_{{entity}}_{{fieldName}}.setHintTexts(validate_strings);

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// Framework/EditFormElementImage fires imageSelected event,
// catch it and propagate to the form group.
$.{{segment}}_{{entity}}_{{fieldName}}.listen("imageSelected",function(blob){
	formGroup.notify("imageSelected",blob);
});

$.{{segment}}_{{entity}}_{{fieldName}}.setClearButtonHandler(function(){
	$.{{segment}}_{{entity}}_{{fieldName}}.clear();
});

exports.setValue = function(value){
	$.{{segment}}_{{entity}}_{{fieldName}}.setValue(value); // set base64 encoded string
};

exports.getValue = function(){
	return $.{{segment}}_{{entity}}_{{fieldName}}.getValue(); // get base64 encoded string
};

// enable and disable editing

exports.enableEditing = function(){
	$.{{segment}}_{{entity}}_{{fieldName}}.enableEditing();
};

exports.disableEditing = function(){
	$.{{segment}}_{{entity}}_{{fieldName}}.disableEditing();
};


