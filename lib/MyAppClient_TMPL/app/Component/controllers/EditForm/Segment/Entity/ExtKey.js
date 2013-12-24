
// type : int (extkey)

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
			value : $.{{segment}}_{{entity}}_{{fieldName}}.getValue(), // getValue returns int
			model : $.{{segment}}_{{entity}}_{{fieldName}}.getModel(), // value of aggregation resolved
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

var batchtag;
exports.setBatchtag = function(tag){
	batchtag = tag;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var newControllerName;
var editControllerName;
var searchControllerName;
var listControllerName;

$.{{segment}}_{{entity}}_{{fieldName}}.setExtkeyHandler(function(){
	var model = $.{{segment}}_{{entity}}_{{fieldName}}.getModel();
	if( model.fresh ){
		var controller = Alloy.createController(editControllerName);
		controller.set{{#Uc_first}}{{fieldName}}{{/Uc_first}}($.{{segment}}_{{entity}}_{{fieldName}}.getValue());
		controller.setListener($.{{segment}}_{{entity}}_{{fieldName}});
		controller.setBatchtag(batchtag);
		var modalWindow = Alloy.createController('Framework/ModalWindow');
		modalWindow.getView().open();
		modalWindow.navigationGroup.enableBackButton();
		modalWindow.navigationGroup.open(controller);
	}else{
		var dialog = Alloy.createController('Framework/EditFormElementExtkeyDialog',{segment:"{{segment_joined}}",entity:"{{entity_joined}}"});
		dialog.setNewControllerName(newControllerName);
		dialog.setSearchControllerName(searchControllerName);
		dialog.setListControllerName(listControllerName);
		
		dialog.setListener($.{{segment}}_{{entity}}_{{fieldName}});
		dialog.setBatchtag(batchtag);
		
		var currentNavigationController = Alloy.Globals.navigationControllerStack[0];
		var root = currentNavigationController.getRootWindow();
		
		dialog.getView().center = root.center;
		currentNavigationController.getRootWindow().add(dialog.getView());
		dialog.showDialog();
	}
});

exports.setControllerNames = function(controllerNames){
	newControllerName    = controllerNames['new'];
	editControllerName   = controllerNames['edit'];
	searchControllerName = controllerNames['search'];
	listControllerName   = controllerNames['list'];
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// Framework/EditFormElementExtkey fires entitySelected event,
// catch it and propagate to the form group.
$.{{segment}}_{{entity}}_{{fieldName}}.listen("entitySelected",function(model){
	formGroup.notify("entitySelected",model);
});

$.{{segment}}_{{entity}}_{{fieldName}}.setClearButtonHandler(function(){
	$.{{segment}}_{{entity}}_{{fieldName}}.setValue('');
});

// type:extkey, value should be a instance of target Model, or json representing the Model
exports.setValue = function(value){
	$.{{segment}}_{{entity}}_{{fieldName}}.setValue(value,"{{featuredFieldName_joined}}");
};

// returns primaryKey
exports.getValue = function(){
	return $.{{segment}}_{{entity}}_{{fieldName}}.getValue();
};

// enable and disable editing

exports.enableEditing = function(){
	$.{{segment}}_{{entity}}_{{fieldName}}.enableEditing();
};

exports.disableEditing = function(){
	$.{{segment}}_{{entity}}_{{fieldName}}.disableEditing();
};

