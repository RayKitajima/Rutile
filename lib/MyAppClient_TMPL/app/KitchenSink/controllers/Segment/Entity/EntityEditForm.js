
var self = exports;
var navi; // current navigationController

var Dispatch = require('CentralDispatch');
var Notifier = require('NotificationCenter');
var EditFormGroup = require('EditFormGroup');

var batchtag = "{{segment}}/{{entity}}/{{entity}}EditForm"; // batchtag is a cross logic contract 

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
$.{{segment}}_{{entity}}_{{fieldName}}_EditForm.setBatchtag(batchtag);
{{/aggregation_joins}}

{{#aggregation_junctions}}
// collection : branch for {{#Lc_first}}{{entity_collected}}{{/Lc_first}}IDs pseudo field
$.{{segment}}_{{entity}}_{{entity_collected}}_EditForm.setControllerNames({
	'new'    : "KitchenSink/{{segment_collected}}/{{entity_collected}}/EditFormReusable",
	'edit'   : "KitchenSink/{{segment_collected}}/{{entity_collected}}/EditFormReusable",
	'search' : "KitchenSink/{{segment_collected}}/{{entity_collected}}/SearchFormReusable",
	'list'   : "KitchenSink/{{segment_collected}}/{{entity_collected}}/ListReusable",
});
$.{{segment}}_{{entity}}_{{entity_collected}}_EditForm.setBatchtag(batchtag);
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

var enableEditing = function(){
	navi.showSubMenu();
	formGroup.enableEditing();
};

var disableEditing = function(){
	navi.hideSubMenu();
	formGroup.disableEditing();
};

var updateView = function(){
	formGroup.assignName("{{segment}}/{{entity}}."+{{primary_key}}); // should be unique in this app
	formGroup.setModels([{{#Lc_first}}{{entity}}{{/Lc_first}}]);
	formGroup.syncEntityToForm();
	formGroup.activate(); // start 'form and model(entity) binding' and 'cross form interaction', this requires name/forms/models
};

var save = function(callback){

	var dialog = Ti.UI.createAlertDialog({
		title       : L('FrameworkMessageSave'),
		message     : L('FrameworkMessageSaveConfirmationText'),
		buttonNames : [L('FrameworkMessageCancel'),L('FrameworkMessageSave')],
		cancel      : 0,
	});
	
	dialog.addEventListener('click', function(e){
		if( e.index == 0 ){
			return;
		}
		
		var rootWin = navi.getRootWindow();
		rootWin.touchEnabled = false;
		
		var indicator = Alloy.createController('Framework/Indicator');
		indicator.getView().center = rootWin.center;
		indicator.setMessage(L('FrameworkIndicatorSavingMessage'));
		indicator.showIndicator();
		
		rootWin.add(indicator.getView());
		
		var internal_callback = function(result){
			callback();
			
			indicator.hideIndicator();
			rootWin.remove(indicator.getView());
			
			// search the saved entity
			var searchElement = Alloy.createController('Framework/SearchFormElementKey');
			searchElement.setValue({{#Lc_first}}{{entity}}{{/Lc_first}}.entity.{{primary_key}});
			
			// then show the saved entity
			var selectby = Alloy.createController('Component/SearchForm/{{segment}}/{{entity}}/Selectby{{entity}}{{#Uc_first}}{{primary_key}}{{/Uc_first}}Key');
			selectby.addItem(searchElement);
			var query = {};
			query["constraint"] = {};
			query["constraint"]["{{segment}}/{{entity}}.{{primary_key}}(key)"] = selectby.getQuery();
			query["expand"] = 2;
			var texts = [];
			texts.push(selectby.getTextExpression());
			Notifier.notify('{{segment}}/{{entity}}.searchQueryChanged',{
				query           : query,
				constraintTexts : texts,
				logicText       : L('FrameworkSearchFormElementSearchLogicAND'),
			});
			
			//formGroup.deactivate(); // clear callbacks
			disableEditing(); // retrieve main menu
			rootWin.touchEnabled = true;
		};
		
		// 
		// * collection should be saved by base entity
		// * collected entity should be saved by its creator
		// 
		{{#Lc_first}}{{entity}}{{/Lc_first}}.save({ 
			batchtag : batchtag,
			callback : internal_callback,
		});
		Dispatch.sync(batchtag);
	});
	
	dialog.show();
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// to edit entity, you should set primary key before open this controller
exports.set{{#Uc_first}}{{primary_key}}{{/Uc_first}} = function(id){
	{{primary_key}} = id;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// navigation protocol

exports.viewDidLoad = function(){
	navi = Alloy.Globals.navigationControllerStack[0];
	
	var cancelButton = Alloy.createController('Framework/NaviCancelButton');
	var editButton   = Alloy.createController('Framework/NaviEditButton');
	var okButton     = Alloy.createController('Framework/NaviOkButton');
	
	// define title and instance expandation level
	var expand_level; // expand level, new should be 0, 2 is default for edit
	
	if( {{primary_key}} ){
		// mode VIEW and EDIT
		
		editButton.setButtonHandler(function(e){
			enableEditing();
		});
		navi.addRightButton(editButton.getView());
		
		cancelButton.setButtonHandler(function(e){
			disableEditing();
		});
		navi.addSubLeftButton(cancelButton.getView());
		
		okButton.setButtonHandler(function(e){
			save(function(){
				navi.back();
			});
		});
		navi.addSubRightButton(okButton.getView());
		
		// title
		var title = Alloy.createController('Framework/NaviTitle');
		title.setTitle(String.format(L('FrameworkTitleFormatEditFormReadonly'),L('{{segment}}_{{entity}}'))); // title for edit
		navi.setTitleView(title.getView());
		
		// sub title
		var subTitle = Alloy.createController('Framework/NaviTitle');
		subTitle.setTitle(String.format(L('FrameworkTitleFormatEditFormEditable'),L('{{segment}}_{{entity}}')));
		navi.setSubTitleView(subTitle.getView());
		
		expand_level = 2;
	}else{
		// mode NEW
		
		cancelButton.setButtonHandler(function(e){
			navi.close();
		});
		navi.setLeftButton(cancelButton.getView());
		
		okButton.setButtonHandler(function(e){
			save(function(){
				navi.close();
			});
		});
		navi.addRightButton(okButton.getView());
		
		// title
		var title = Alloy.createController('Framework/NaviTitle');
		title.setTitle(String.format(L('FrameworkTitleFormatNewForm'),L('{{segment}}_{{entity}}'))); // title for new
		navi.setTitleView(title.getView());
		
		expand_level = 0;
		
		formGroup.enableEditing(); // start from editing mode for new entity
	}
	
	// get instance and update view
	{{entity}}Model.instantiate({
		primaryKeys : [{{primary_key}}], // the id can be null. class method 'instantiate' requires array
		callback    : function(instances){
			{{#Lc_first}}{{entity}}{{/Lc_first}} = instances[0]; // returns array of instances
			{{primary_key}} = {{#Lc_first}}{{entity}}{{/Lc_first}}.primaryKey;
			updateView();
		},
		expand : expand_level,
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
