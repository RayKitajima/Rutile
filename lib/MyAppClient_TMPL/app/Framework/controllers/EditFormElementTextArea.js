
var self = exports;

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var doneBtn = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.DONE});
doneBtn.addEventListener('click',function(e){$.FormElementTextArea.blur();});
var flexSpace = Titanium.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE});
var toolbar = Ti.UI.iOS.createToolbar({
	items     : [flexSpace, doneBtn],
	tintColor : '#fff',
	barColor  : '#85d031'
});
$.FormElementTextArea.keyboardToolbar = toolbar;

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var orig_color   = $.FormElementTextArea.color;
var curr_color   = $.FormElementTextArea.color;
var edited_color = '#d10404';

var orig_value;
var prev_value;
var curr_value;

var pullValue = function(){
	var edited_value = $.FormElementTextArea.getValue();
	if( edited_value != curr_value ){
		prev_value = curr_value;
		curr_value = edited_value;
		curr_color = edited_color;
	}
	if( curr_value == orig_value ){
		curr_color = orig_color;
	}
	$.FormElementTextArea.color = curr_color;
	
	changeHandler(curr_value);
};

function closeKeyboard(e) {
	e.source.blur();
	pullValue();
}

$.FormElementTextArea.addEventListener('blur',function(){
	pullValue();
});

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// get and set String object

exports.setValue = function(new_value){
	if( !new_value ){
		$.FormElementTextArea.setValue('');
		curr_value = '';
		showHintTexts();
		return;
	}
	
	if( !curr_value && !prev_value ){ orig_value = new_value; }
	prev_value = curr_value;
	curr_value = new_value;
	
	$.FormElementTextArea.setValue(curr_value);
};

exports.getValue = function(){
	return curr_value;
};

// hintText

var hintTexts = [];

var showHintTexts = function(){
	$.FormElementTextArea.hintText = hintTexts.join(' ');;
};

var hideHintTexts = function(){
	$.FormElementTextArea.hintText = '';
};

exports.setHintTexts = function(texts){
	hintTexts = texts;
};

// enable and disable editing

exports.enableEditing = function(){
	$.FormElementTextArea.enabled = true;
	$.ClearButton.getView().visible = true;
};

exports.disableEditing = function(){
	$.FormElementTextArea.enabled = false;
	$.ClearButton.getView().visible = false;
};

// clear field

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};

