
var self = exports;

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// 
// apply toolbar, cant code in alloy
// 
// BUG: SDK3.2 still cant handle keyboardToolbar correctly
// 
var kbToolbar = Ti.UI.createView({
	backgroundColor : "#85d031",
});
var kbDoneBtn = Alloy.createController('Framework/NaviCancelButton');
//kbDoneBtn.top = "0dp";
kbDoneBtn.right = "10dp";
//kbDoneBtn.addEventListener('click',function(e){ $.FormElementTextArea.blur(); });
kbDoneBtn.setButtonHandler(function(e){
	$.FormElementTextArea.blur();
});
kbToolbar.add(kbDoneBtn.getView());
$.FormElementTextArea.keyboardToolbar = kbToolbar;
/*
var toolbar = Alloy.createController('Framework/KBToolbar');
toolbar.setButtonHandler(function(e){ $.FormElementTextArea.blur(); });
$.FormElementTextArea.keyboardToolbar = toolbar.getView();
*/

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

