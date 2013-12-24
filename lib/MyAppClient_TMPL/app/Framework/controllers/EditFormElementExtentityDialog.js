
// usage:
// var dialog = Alloy.createController('Framework/EditFormElementExtkeyDialog',{segment:SEGMENT,entity:ENTITY});

var args = arguments[0] || {};
var segment = args.segment;
var entity = args.entity;

var self = exports;

var newControllerName;
var searchControllerName;
var listControllerName;

var entity_name_string =segment + '_' + entity;
var entity_name = L(entity_name_string);
$.DescLabel.setText(String.format(Ti.Locale.getString('FrameworkSelectorBranchDescLabel'),entity_name));

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

$.NewSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.NewSymbol.setText(fontawesome.icon('fa-plus'));

$.SearchSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.SearchSymbol.setText(fontawesome.icon('fa-search'));

$.ListSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.ListSymbol.setText(fontawesome.icon('fa-list'));

// batchtag

var batchtag;
exports.setBatchtag = function(tag){
	batchtag = tag;
};

// listener

var listener;
exports.setListener = function(obj){
	listener = obj;
};

// new

exports.setNewControllerName = function(controllerName){
	newControllerName = controllerName;
};

function clickNew(e){
	var controller = Alloy.createController(newControllerName);
	controller.setListener(listener);
	controller.enableEditing();
	controller.setBatchtag(batchtag);
	var modalWindow = Alloy.createController('Framework/ModalWindow');
	modalWindow.getView().open();
	modalWindow.navigationGroup.enableBackButton();
	modalWindow.navigationGroup.open(controller);
	self.hideDialog();
}

function downNewView(){
	$.NewView.backgroundColor = '#d0d0d0';
}

function upNewView(){
	$.NewView.backgroundColor = '#f0f0f0';
}

// search

exports.setSearchControllerName = function(controllerName){
	searchControllerName = controllerName;
};

function clickSearch(e){
	var controller = Alloy.createController(searchControllerName);
	controller.setListener(listener);
	var modalWindow = Alloy.createController('Framework/ModalWindow');
	modalWindow.getView().open();
	modalWindow.navigationGroup.enableBackButton();
	modalWindow.navigationGroup.open(controller);
	self.hideDialog();
}

function downSearchView(){
	$.SearchView.backgroundColor = '#d0d0d0';
}

function upSearchView(){
	$.SearchView.backgroundColor = '#f0f0f0';
}

// list

exports.setListControllerName = function(controllerName){
	listControllerName = controllerName;
};

function clickList(e){
	var controller = Alloy.createController(listControllerName);
	controller.setListener(listener);
	var modalWindow = Alloy.createController('Framework/ModalWindow');
	modalWindow.getView().open();
	modalWindow.navigationGroup.enableBackButton();
	modalWindow.navigationGroup.open(controller);
	self.hideDialog();
}

function downListView(){
	$.ListView.backgroundColor = '#d0d0d0';
}

function upListView(){
	$.ListView.backgroundColor = '#f0f0f0';
}

// cancel

function clickCancel(e){
	self.hideDialog();
}

function downCancelView(){
	$.CancelView.backgroundColor = '#ced518';
}

function upCancelView(){
	$.CancelView.backgroundColor = '#dbe140';
}

// show, hide

exports.showDialog = function(){
	$.Container.visible = true;
};

exports.hideDialog = function(){
	$.Container.visible = false;
	$.getView().getParent().remove($.getView());
};



