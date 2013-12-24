
var self = exports;

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var orig_color   = $.FormElementTextField.color;
var curr_color   = $.FormElementTextField.color;
var edited_color = '#d10404';

var orig_value;
var prev_value;
var curr_value;

var pullValue = function(){
	var edited_value = $.FormElementTextField.getValue();
	if( edited_value != curr_value ){
		prev_value = curr_value;
		curr_value = edited_value;
		curr_color = edited_color;
	}
	if( curr_value == orig_value ){
		curr_color = orig_color;
	}
	$.FormElementTextField.color = curr_color;
	
	changeHandler(curr_value);
};

function closeKeyboard(e) {
	e.source.blur();
	pullValue();
}

$.FormElementTextField.addEventListener('blur',function(){
	pullValue();
});

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// get and set Integer object

exports.setValue = function(new_value){
	if( !new_value ){
		$.FormElementTextField.setValue('');
		curr_value = '';
		showHintTexts();
		return;
	}
	
	if( !curr_value && !prev_value ){ orig_value = new_value; }
	prev_value = curr_value;
	curr_value = new_value;
	
	$.FormElementTextField.setValue(curr_value);
};

exports.getValue = function(){
	return curr_value;
};

// hintText

var hintTexts = [];

var showHintTexts = function(){
	$.FormElementTextField.hintText = hintTexts.join(' ');;
};

var hideHintTexts = function(){
	$.FormElementTextField.hintText = '';
};

exports.setHintTexts = function(texts){
	hintTexts = texts;
};

// enable and disable editing

exports.enableEditing = function(){
	$.FormElementTextField.enabled = true;
	$.ClearButton.getView().visible = true;
};

exports.disableEditing = function(){
	$.FormElementTextField.enabled = false;
	$.ClearButton.getView().visible = false;
};

// clear field

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};
