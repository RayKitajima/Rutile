
// type : extkey

var self = exports;

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var listeners = [];

exports.listen = function(eventName,callback){
	listeners.push({ name:eventName,callback:callback });
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var args = arguments[0] || {};
var segment = args.segment;
var entity = args.entity;

var orig_color   = $.SelectedItemName.color;
var curr_color   = $.SelectedItemName.color;
var edited_color = '#d10404';

var orig_model; // also used as a initialization checker
var prev_model;
var curr_model;

var editable = true;

var extkeyHandler = function(){};

exports.setExtkeyHandler = function(handler){
	extkeyHandler = handler;
};

function openExtkey(e){
	if( !editable ){ return; }
	extkeyHandler(e);
}

// * you should tell me your featuring field
exports.listenEntitySelect = function(picked_model,featureField){
	if( !orig_model ){
		orig_model = picked_model;
		prev_model = picked_model;
		curr_model = picked_model;
	}
	
	if( picked_model.primaryKey != curr_model.primaryKey ){
		prev_model = curr_model;
		curr_model = picked_model;
		curr_color = edited_color;
	}
	if( curr_model.primaryKey == orig_model.primaryKey ){
		curr_color = orig_color;
	}
	
	$.SelectedItemName.text = curr_model.entity[featureField] + " ("+curr_model.primaryKey+")";
	$.SelectedItemName.color = curr_color;
	
	for( var i=0; i<listeners.length; i++ ){
		var listener = listeners[i];
		if( listener.name == "entitySelected" ){
			listener.callback(picked_model);
		}
	}
	
	changeHandler(curr_model);
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// 
// TODO: can I run without expand:2? 
//     * requires expand level more than 2
// 
// * you should tell me your featuring field
exports.setValue = function(new_model,featureField){
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
	
	if( !curr_model.entity[featureField] ){
		showHintTexts();
	}else{
		$.SelectedItemName.text = curr_model.entity[featureField] + " ("+curr_model.primaryKey+")";
	}
};

exports.getValue = function(){
	return curr_model.primaryKey;
};

exports.getModel = function(){
	return curr_model;
};

// hintText

var hintTexts = [];

var showHintTexts = function(){
	$.SelectedItemName.text = hintTexts.join(' ');
	$.SelectedItemName.color = '#aaa';
};

var hideHintTexts = function(){
	$.SelectedItemName.hintText = '';
};

exports.setHintTexts = function(texts){
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

