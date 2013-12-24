
// type : extentity (collected element)

var self = exports;

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var index;

exports.setIndex = function(idx){
	index = idx;
};

exports.getIndex = function(){
	return index;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var newControllerName;
var searchControllerName;
var listControllerName;

exports.setControllerNames = function(controllerNames){
	newControllerName    = controllerNames['new'];
	searchControllerName = controllerNames['search'];
	listControllerName   = controllerNames['list'];
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var batchtag;
exports.setBatchtag = function(tag){
	batchtag = tag;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var orig_model; // also used as a initialization checker
var prev_model;
var curr_model;

var editable = true;

var extentityHandler = function(){};

exports.setExtentityHandler = function(handler){
	extentityHandler = handler;
};

function openExtentity(e){
	if( !editable ){ return; }
	extentityHandler(e);
}

var compareModel = function(a,b){
	var same = true;
	var keys = Object.keys(a);
	for( var i=0; i<keys.length; i++ ){
		var key = keys[i];
		if( b[key] != a[key] ){
			same = false;
			break;
		}
	}
	return same;
};

// add/set elements
// 
// example:
//     
//     var element_image = Alloy.createController('Framework/ExtentityElementImage');
//     element_image.setFeatureField('image');
//     
//     var element_label = Alloy.createController('Framework/ExtentityElementLabel');
//     element_label.setFeatureField('name');
//     
//     item.addElements([element_image,element_label]);
// 
var elements = {};
exports.addElements = function(elms){
	for( var i=0; i<elms.length; i++ ){
		var elm = elms[i];
		elements[elm.getFeatureField()] = elm;
		$.Container.add(elm.getView());
	}
};
exports.setElements = function(elms){
	elements = {};
	self.addElements(elms);
};
var propagateEntityChange = function(){
	var keys = Object.keys(elements);
	for( var i=0; i<keys.length; i++ ){
		var element = elements[keys[i]];
		element.setExtentity(curr_model);
		element.updateView();
	}
};

exports.hasSelectedEntity = function(){
	if( curr_model && curr_model.primaryKey ){
		return true;
	}else{
		return false;
	}
};

// * you should tell me field name of image and sub-title
exports.listenEntitySelect = function(picked_model){
	curr_model = picked_model;
	
	if( !orig_model ){
		orig_model = curr_model;
		prev_model = curr_model;
		curr_model = curr_model;
	}
	
	if( !compareModel(picked_model,curr_model) ){
		prev_model = curr_model;
		curr_model = picked_model;
		// changed
	}
	
	if( compareModel(curr_model,orig_model) ){
		// not changed
	}
	
	propagateEntityChange();
	changeHandler(curr_model);
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

exports.setValue = function(new_model){
	if( !new_model ){
		new_model = {entity:{}};
	}
	
	if( !orig_model ){
		orig_model = new_model;
		prev_model = new_model;
		curr_model = new_model;
	}
	
	prev_model = curr_model;
	curr_model = new_model;
	
	propagateEntityChange();
	changeHandler(curr_model);
};

// collection always collect primaryKey, return null if still not have any entity
exports.getValue = function(){
	return curr_model ? curr_model.primaryKey : null;
};

exports.getModel = function(){
	return curr_model;
};

// hintText is managed by elements, so i can delete following codes

// hintText

var hintTexts = [];

var showHintTexts = function(){
	// show hint in children
};

var hideHintTexts = function(){
	// hide hitn in children
	//$.SelectedItemName.hintText = '';
};

exports.setHintTexts = function(texts){
	// this texts is effective if only having one child element
	hintTexts = texts;
};

// enable and disable editing

exports.enableEditing = function(){
	editable = true;
	$.ClearButton.getView().visible = true;
};

exports.disableEditing = function(){
	editable = false;
	$.ClearButton.getView().visible = false;
};

// clear field

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};

