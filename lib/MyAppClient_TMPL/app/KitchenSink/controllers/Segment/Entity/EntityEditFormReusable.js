
var self = exports;
var navi; // current navigationController
var listener;
var batchtag;

var EditFormGroup = require('EditFormGroup');

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// entity

var {{entity}}Model = require("Model/{{segment}}/{{entity}}");
var {{primary_key}};
var {{#Lc_first}}{{entity}}{{/Lc_first}};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

{{#aggregation_joins}}
// extkey : branch for {{fieldName}}
$.{{segment}}_{{entity}}_{{fieldName}}_EditForm.setControllerNames({
	'new'    : "KitchenSink/{{segment_joined}}/{{entity_joined}}/EditFormReusable",
	'edit'   : "KitchenSink/{{segment_joined}}/{{entity_joined}}/EditFormReusable",
	'search' : "KitchenSink/{{segment_joined}}/{{entity_joined}}/SearchFormReusable",
	'list'   : "KitchenSink/{{segment_joined}}/{{entity_joined}}/ListReusable",
});
{{/aggregation_joins}}

{{#aggregation_junctions}}
// collection : branch for {{#Lc_first}}{{entity_collected}}{{/Lc_first}}IDs pseudo field
$.{{segment}}_{{entity}}_{{entity_collected}}_EditForm.setControllerNames({
	'new'    : "KitchenSink/{{segment_collected}}/{{entity_collected}}/EditFormReusable",
	'edit'   : "KitchenSink/{{segment_collected}}/{{entity_collected}}/EditFormReusable",
	'search' : "KitchenSink/{{segment_collected}}/{{entity_collected}}/SearchFormReusable",
	'list'   : "KitchenSink/{{segment_collected}}/{{entity_collected}}/ListReusable",
});
{{/aggregation_junctions}}

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var formGroup = EditFormGroup.makeGroup(); // start with empty name. you should assign group name before start interaction.

formGroup.setForms([
	$.{{segment}}_{{entity}}_{{primary_key}}_EditForm,
{{#Fields}}
	$.{{segment}}_{{entity}}_{{fieldName}}_EditForm,
{{/Fields}}
{{#aggregation_junctions}}
	$.{{segment}}_{{entity}}_{{entity_collected}}_EditForm, // collection of {{segment_collected}}/{{entity_collected}} binded by {{#Lc_first}}{{entity_collected}}{{/Lc_first}}s. (3rd elm Uc first)
{{/aggregation_junctions}}
]);
formGroup.disableEditing(); // editing disabled at start

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

exports.setBatchtag = function(tag){
	batchtag = tag;
};

exports.enableEditing = function(){
	formGroup.enableEditing();
};

exports.disableEditing = function(){
	formGroup.disableEditing();
};

var updateView = function(){
	formGroup.assignName("{{segment}}/{{entity}}."+{{primary_key}}); // should be unique in this app
	formGroup.setModels([{{#Lc_first}}{{entity}}{{/Lc_first}}]);
	formGroup.syncEntityToForm();
	formGroup.activate(); // start 'form and model(entity) binding' and 'cross form interaction', this requires name/forms/models
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// to edit entity, you should set primary key before open this controller
exports.set{{#Uc_first}}{{primary_key}}{{/Uc_first}} = function(id){
	{{primary_key}} = id;
};

// delgate object should have listenEntitySelect() with featuredField option
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
	
	// right buttons
	
	var okButton = Alloy.createController('Framework/NaviOkButton');
	okButton.setButtonHandler(function(e){
		// no need to call instance.syncFormToEntity(), form input should be already notifyed to the entity
		listener.listenEntitySelect({{#Lc_first}}{{entity}}{{/Lc_first}},"{{featuredFieldName}}");
		{{#Lc_first}}{{entity}}{{/Lc_first}}.save({batchtag:batchtag}); // delegate saving to the source of batchtag
		navi.close();
	});
	navi.setRightButton(okButton.getView());
	
	// define title
	
	if( {{primary_key}} ){
		var title = Alloy.createController('Framework/NaviTitle');
		title.setTitle(String.format(L('FrameworkTitleFormatEditForm'),L('{{segment}}_{{entity}}'))); // title for edit
		navi.setTitleView(title.getView());
	}else{
		var title = Alloy.createController('Framework/NaviTitle');
		title.setTitle(String.format(L('FrameworkTitleFormatNewForm'),L('{{segment}}_{{entity}}'))); // title for new
		navi.setTitleView(title.getView());
	}
	
	// get instance and update view
	
	{{entity}}Model.instantiate({
		primaryKeys : [{{primary_key}}], // the id can be null. class method 'instantiate' requires array
		callback    : function(instances){
			{{#Lc_first}}{{entity}}{{/Lc_first}} = instances[0]; // returns array of instances
			{{primary_key}} = {{#Lc_first}}{{entity}}{{/Lc_first}}.primaryKey;
			updateView();
		},
	});
};

exports.viewWillAppear = function(){
	if( formGroup.ready && !formGroup.active ){
		formGroup.activate();
	}
};

exports.viewWillDisappear = function(){
	if( formGroup.active ){
		formGroup.deactivate();
	}
};
