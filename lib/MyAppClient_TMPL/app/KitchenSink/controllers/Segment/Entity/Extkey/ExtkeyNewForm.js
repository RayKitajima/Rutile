
var self = exports;
var navi; // current navigation controller, NavigationGroup|ModalContoller
var listener;

var Dispatch = require('CentralDispatch');
var EditFormGroup = require('EditFormGroup');

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// event handlers

function closeKeyboard(e) {
	e.source.blur();
}

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// entity

var {{entity_joined}}Model = require("Model/{{segment_joined}}/{{entity_joined}}");
var {{primary_key_joined}};
var {{#Lc_first}}{{entity_joined}}{{/Lc_first}};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// edit form group

var formGroup = EditFormGroup.makeGroup(); // start with empty name. you should assign group name before start interaction.

formGroup.setForms([
	$.{{segment_joined}}_{{entity_joined}}_{{primary_key_joined}}_EditForm,
{{#Fields_joined}}
	$.{{segment_joined}}_{{entity_joined}}_{{fieldName}}_EditForm{{^last}},{{/last}}
{{/Fields_joined}}
]);

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var updateView = function(){
	formGroup.assignName("{{segment_joined}}/{{entity_joined}}."+{{primary_key_joined}}); // should be unique in this app
	formGroup.setModels([{{#Lc_first}}{{entity_joined}}{{/Lc_first}}]);
	formGroup.syncEntityToForm();
	formGroup.activate(); // start 'form and model(entity) binding' and 'cross form interaction', requires name/forms/models
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// to edit entity, you should set primary key before open this controller
exports.set{{#Uc_first}}{{primary_key_joined}}{{/Uc_first}} = function(id){
	{{primary_key_joined}} = id;
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
		listener.listenEntitySelect({{#Lc_first}}{{entity_joined}}{{/Lc_first}},"{{featuredFieldName_joined}}");
		{{#Lc_first}}{{entity_joined}}{{/Lc_first}}.save({batchtag:"{{segment}}/{{entity}}/{{entity}}EditForm"}); // delegate saving to the EditForm belonging in
		navi.close();
	});
	navi.setRightButton(okButton.getView());
	
	// define title
	
	if( {{primary_key_joined}} ){
		var title = Alloy.createController('Framework/NaviTitle');
		title.setTitle(String.format(L('FrameworkTitleFormatEditForm'),L('{{segment_joined}}_{{entity_joined}}'))); // title for edit
		navi.setTitleView(title.getView());
	}else{
		var title = Alloy.createController('Framework/NaviTitle');
		title.setTitle(String.format(L('FrameworkTitleFormatNewForm'),L('{{segment_joined}}_{{entity_joined}}'))); // title for new
		navi.setTitleView(title.getView());
	}
	
	// get instance and update view
	
	{{entity_joined}}Model.instantiate({
		primaryKeys : [{{primary_key_joined}}], // the id can be null. class method 'instantiate' requires array
		callback    : function(instances){
			{{#Lc_first}}{{entity_joined}}{{/Lc_first}} = instances[0]; // returns array of instances
			{{primary_key_joined}} = {{#Lc_first}}{{entity_joined}}{{/Lc_first}}.primaryKey;
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

