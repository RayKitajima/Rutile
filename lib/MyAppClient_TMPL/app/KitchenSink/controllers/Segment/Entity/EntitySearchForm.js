
var self = exports;
var navi; // current navigationController

var Notifier = require('NotificationCenter');
var SearchFormGroup = require('SearchFormGroup');

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// search form group

var formGroup = SearchFormGroup.makeGroup({
	'name'    : "{{segment}}/{{entity}}",
	'segment' : "{{segment}}",
	'entity'  : "{{entity}}",
});

formGroup.addElements([ {{#Align_colon}}
{{#PrimaryKeySearches}}{{#search_types}}
	$.{{segment}}_{{entity}}_{{primary_key}}_{{search_type}}_SearchForm,
{{/search_types}}{{/PrimaryKeySearches}}
{{#Fields}}{{#search_types}}
	$.{{segment}}_{{entity}}_{{fieldName}}_{{search_type}}_SearchForm,
{{/search_types}}{{/Fields}}
{{#Fields_joined}}{{#search_types_joined}}
	$.{{segment_joined}}_{{entity_joined}}_{{fieldName_joined}}_{{search_type_joined}}_SearchForm,
{{/search_types_joined}}{{/Fields_joined}}
{{#Fields_collected}}{{#search_types_collected}}
	$.{{segment_collected}}_{{entity_collected}}_{{fieldName_collected}}_{{search_type_collected}}_SearchForm,
{{/search_types_collected}}{{/Fields_collected}}
{{/Align_colon}}
]);
formGroup.setLogicSelector($.SearchForm_LogicSelector);
formGroup.setOrderbys($.SearchForm_Orderbys);
formGroup.setSubmitAction({
	'form'    : $.SearchForm_Submit,
	'handler' : function(){
		Notifier.notify('{{segment}}/{{entity}}.searchQueryChanged',{
			'query'           : getQuery(),
			'constraintTexts' : getTextExpressionOfConstraint(),
			'logicText'       : getTextExpressionOfLogic()
		});
		navi.close();
	}
});

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// show and hide search form set for joined and collected fields

{{#Fields_joined_grouped}}
$.Set_{{entity_joined}}.height = 1;
var Set_{{entity_joined}}_on = false;
function toggle_Set_{{entity_joined}}(){
	if( Set_{{entity_joined}}_on == true ){
		// hide
		$.Set_{{entity_joined}}.animate(
			Ti.UI.createAnimation({
				height   : 1,
				duration : 300,
				delay    : 0,
			}),
			function(){
				$.btn_Set_{{entity_joined}}.toggleButton();
				Set_{{entity_joined}}_on = false;
			}
		);
	}else{
		// show
		$.Set_{{entity_joined}}.animate(
			Ti.UI.createAnimation({
				height   : Ti.UI.SIZE,
				duration : 300,
				delay    : 0,
			}),
			function(){
				$.btn_Set_{{entity_joined}}.toggleButton();
				Set_{{entity_joined}}_on = true;
			}
		);
	}
}

{{/Fields_joined_grouped}}
{{#Fields_collected_grouped}}
$.Set_{{entity_collected}}.height = 1;
var Set_{{entity_collected}}_on = false;
function toggle_Set_{{entity_collected}}(){
	if( Set_{{entity_collected}}_on == true ){
		// hide
		$.Set_{{entity_collected}}.animate(
			Ti.UI.createAnimation({
				height   : 1,
				duration : 300,
				delay    : 0,
			}),
			function(){
				$.btn_Set_{{entity_collected}}.toggleButton();
				Set_{{entity_collected}}_on = false;
			}
		);
	}else{
		// show
		$.Set_{{entity_collected}}.animate(
			Ti.UI.createAnimation({
				height   : Ti.UI.SIZE,
				duration : 300,
				delay    : 0,
			}),
			function(){
				$.btn_Set_{{entity_collected}}.toggleButton();
				Set_{{entity_collected}}_on = true;
			}
		);
	}
}

{{/Fields_collected_grouped}}
// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var getTextExpressionOfConstraint = function(){
	return formGroup.getTextExpressionOfConstraint();
};

var getTextExpressionOfLogic = function(){
	return formGroup.getTextExpressionOfLogic();
};

var getQuery = function(){
	var query = formGroup.getQuery();
	query["expand"] = 2;
	return query;
};

var initSearchForm = function(){
	formGroup.init();
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// navigation protocol

exports.viewDidLoad = function(){
	navi = Alloy.Globals.navigationControllerStack[0];
	
	// left buttons
	
	var cancelButton = Alloy.createController('Framework/NaviCancelButton');
	cancelButton.setButtonHandler(function(e){
		navi.close();
	});
	navi.setLeftButton(cancelButton.getView());
	
	// no right buttons
	
	// title
	var title = Alloy.createController('Framework/NaviTitle');
	title.setTitle(String.format(L('FrameworkTitleFormatSearchFormView'),L('{{segment}}_{{entity}}')));
	navi.setTitleView(title.getView());
	
	initSearchForm();
};

exports.viewWillAppear = function(){
	formGroup.updateView();
};

exports.viewWillDisappear = function(){
};
