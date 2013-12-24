
var self = exports;
var navi; // current navigationController
var listener;

var SearchFormGroup = require('SearchFormGroup');

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// search form group

var formGroup = SearchFormGroup.makeGroup({
	'name'    : "{{segment_joined}}/{{entity_joined}}",
	'segment' : "{{segment_joined}}",
	'entity'  : "{{entity_joined}}",
});

formGroup.addElements({ {{#Align_colon}}
{{#PrimaryKeySearches_joined}}{{#search_types}}
	'{{fieldName}}({{search_type}})' : $.{{segment_joined}}_{{entity_joined}}_{{fieldName}}_{{search_type}}_SearchForm,
{{/search_types}}{{/PrimaryKeySearches_joined}}
{{#Fields_joined}}{{#search_types}}
	'{{fieldName}}({{search_type}})' : $.{{segment_joined}}_{{entity_joined}}_{{fieldName}}_{{search_type}}_SearchForm,
{{/search_types}}{{/Fields_joined}}
{{/Align_colon}}
});
formGroup.setLogicSelector($.SearchForm_LogicSelector);
formGroup.setOrderbys($.SearchForm_Orderbys);
formGroup.setSubmitAction({
	'form'    : $.SearchForm_Submit,
	'handler' : function(){
		var controller = Alloy.createController('KitchenSink/{{segment}}/{{entity}}/{{entity_joined}}/List');
		controller.setListener(listener);
		controller.setQuery(self.getQuery());
		navi.open(controller);
	}
});

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

exports.getQuery = function(){
	var query = formGroup.getQuery();
	query["expand"] = 2;
	return query;
};

var initSearchForm = function(){
	formGroup.init();
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// delgate object should have listenEntitySelect()
exports.setListener = function(obj){
	listener = obj;
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
	title.setTitle(String.format(L('FrameworkTitleFormatSearchFormView'),L('{{segment_joined}}_{{entity_joined}}')));
	navi.setTitleView(title.getView());
	
	initSearchForm();
};

exports.viewWillAppear = function(){
};

exports.viewWillDisappear = function(){
};
