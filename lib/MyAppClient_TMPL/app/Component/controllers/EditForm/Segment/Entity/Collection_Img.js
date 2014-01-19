
// collection

var self = exports;

var editable = true;

exports.getName = function(){
	return "{{segment}}/{{entity}}.{{fieldName}}s"; // pseudo field for colleciton
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
	var ids = [];
	var models = [];
	for( var i=0; i<items.length; i++ ){
		if( items[i].hasSelectedEntity() ){
			ids.push(items[i].getValue());
			models.push(items[i].getModel());
		}
	}
	for( var i=0; i<observers.length; i++ ){
		var observer = observers[i];
		observer.observeValue({
			name  : self.getName(),
			field : "{{fieldName}}s", // pseudo field for colleciton
			value : ids,
			model : models, // value of aggregation resolved
		});
	}
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var newControllerName;
var searchControllerName;
var listControllerName;
var editControllerName;

exports.setControllerNames = function(controllerNames){
	newControllerName    = controllerNames['new'];
	searchControllerName = controllerNames['search'];
	listControllerName   = controllerNames['list'];
	editControllerName   = controllerNames['edit'];
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var batchtag;
exports.setBatchtag = function(tag){
	batchtag = tag;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var items = [];

var updateView = function(){
	var container = $.Elements;
	container.removeAllChildren();
	for( var i=0; i<items.length; i++ ){
		items[i].setIndex(i);
		container.add(items[i].getView());
		if( i < items.length - 1 ){
			var separator = Alloy.createController('Framework/FormElementSeparator');
			container.add(separator.getView());
		}
	}
};

var addItem = function(model){
	var item = Alloy.createController('Framework/EditFormElementExtentity');
	
	var element_{{imageFieldName_collected}} = Alloy.createController('Framework/ExtentityElementImage');
	element_{{#Cut_trail_id}}{{fieldName}}{{/Cut_trail_id}}.setFeatureField("{{imageFieldName_collected}}");
	
	var element_{{featuredFieldName_collected}} = Alloy.createController('Framework/ExtentityElementLabel');
	element_{{featuredFieldName_collected}}.setFeatureField("{{featuredFieldName_collected}}");
	
	item.addElements([element_{{imageFieldName_collected}},element_{{featuredFieldName_collected}}]);
	
	item.setIndex(items.length);
	item.setClearButtonHandler(function(){
		clearItem(item.getIndex());
		updateView();
	});
	item.putEventListener('change',function(value){ // Form/Entity bindings
		notify();
	});
	item.setExtentityHandler(function(){
		if( item.hasSelectedEntity() ){
			var controller = Alloy.createController(editControllerName);
			controller.set{{#Uc_first}}{{fieldName}}{{/Uc_first}}(item.getValue());
			controller.setListener(item); // item listen entity selection
			controller.setBatchtag(batchtag);
			var modalWindow = Alloy.createController('Framework/ModalWindow');
			modalWindow.getView().open();
			modalWindow.navigationGroup.enableBackButton();
			modalWindow.navigationGroup.open(controller);
		}else{
			var dialog = Alloy.createController('Framework/EditFormElementExtentityDialog',{segment:"{{segment_collected}}",entity:"{{entity_collected}}"});
			dialog.setNewControllerName(newControllerName);
			dialog.setSearchControllerName(searchControllerName);
			dialog.setListControllerName(listControllerName);
			dialog.setListener(item); // item listen entity selection, that will be passed to the actual controller(new/search/list)
			dialog.setBatchtag(batchtag);
			var currentNavigationController = Alloy.Globals.navigationControllerStack[0];
			var root = currentNavigationController.getRootWindow();
			dialog.getView().center = root.center;
			currentNavigationController.getRootWindow().add(dialog.getView());
			dialog.showDialog();
		}
	});
	
	if( model ){ item.setValue(model); }
	
	if( !editable ){
		item.disableEditing();
	}
	
	items.push(item);
};

var removeItem = function(index){
	//var index = e.source.getIndex();
	if( items.length > 1 ){
		items.splice(index,1);
	}
};

var clearItem = function(index){
	if( items[index].hasSelectedEntity() ){
		items[index].setValue();
	}else{
		removeItem(index);
	}
};

// for internal program, adding Framework/EditFormElementExtentity instance without ui
exports.addItem = function(item){
	items.push(item);
};

// for internal program, adding Framework/EditFormElementExtentity instance without ui
exports.removeItem = function(item){
	var index = items.indexOf(item);
	items.splice(index,1);
};

exports.initForm = function(){
	items = [];
	addItem();
	updateView();
};

$.AddButton.setButtonHandler(function(){
	addItem();
	updateView();
});

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// type:collection, value should be array of JSON representing instance of target Model
exports.setValue = function(value){
	if( value && value.length > 0 ){
		for( var i=0; i<value.length; i++ ){
			var json = value[i];
			addItem(json);
		}
		updateView();
	}else{
		self.initForm();
	}
};

exports.getValue = function(){
	var ids = [];
	for( var i=0; i<items.length; i++ ){
		ids.push(item.getValue());
	}
	return ids;
};

// enable and disable editing

exports.enableEditing = function(){
	editable = true;
	$.AddButton.getView().visible = true;
	for( var i=0; i<items.length; i++ ){
		items[i].enableEditing();
	}
};

exports.disableEditing = function(){
	editable = false;
	$.AddButton.getView().visible = false;
	for( var i=0; i<items.length; i++ ){
		items[i].disableEditing();
	}
};


