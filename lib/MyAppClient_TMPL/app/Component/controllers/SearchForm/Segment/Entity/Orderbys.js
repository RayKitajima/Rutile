
// orderby

var self = exports;

var formGroup;
exports.setFormGroup = function(group){
	formGroup = group;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var fields = [ 
{{#Orderbys}}
	{
		"title"       : L("{{segment_orderby}}_{{entity_orderby}}_{{fieldName_orderby}}"),
		"segmentName" : "{{segment_orderby}}",
		"entityName"  : "{{entity_orderby}}",
		"fieldName"   : "{{fieldName_orderby}}"
	}{{^last}},{{/last}}
{{/Orderbys}}
];

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

exports.initForm = function(){
	$.SearchForm_SortFieldSelector.setFields(fields);
	
	$.SearchForm_SortFieldSelector.initForm();
	$.SearchForm_SortFieldSelector.setClearButtonHandler(function(){
		$.SearchForm_SortFieldSelector.initForm();
	});
	
	$.SearchForm_SortMethodSelector.initForm();
	$.SearchForm_SortMethodSelector.setClearButtonHandler(function(){
		$.SearchForm_SortMethodSelector.initForm();
	});
};

exports.getTextExpression = function(){
	var text = '';
	
	var fieldExp = $.SearchForm_SortFieldSelector.getTextExpression();
	var methodExp = $.SearchForm_SortMethodSelector.getTextExpression();
	if( fieldExp && methodExp ){
		text = methodExp + ' (' +  fieldExp + ')';
	}
	
	return text;
};

exports.getSortField = function(){
	return $.SearchForm_SortFieldSelector.getSortField();
};

exports.getSortMethod = function(){
	return $.SearchForm_SortMethodSelector.getSortMethod();
};
