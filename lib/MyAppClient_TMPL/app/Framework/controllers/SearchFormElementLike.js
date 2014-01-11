
var index;

var doneBtn = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.DONE});
doneBtn.addEventListener('click',function(e){$.FormElementTextField.blur();});
var flexSpace = Titanium.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE});
var toolbar = Ti.UI.iOS.createToolbar({
	items     : [flexSpace, doneBtn],
	tintColor : '#fff',
	barColor  : '#85d031'
});
$.FormElementTextField.keyboardToolbar = toolbar;

function closeKeyboard(e) {
	e.source.blur();
}

exports.setIndex = function(idx){
	index = idx;
};

exports.getIndex = function(){
	return index;
};

exports.initForm = function(){
	$.FormElementTextField.setValue('');
};

exports.getTextExpression = function(){
	if( String($.FormElementTextField.value).length > 0 ){
		return $.FormElementTextField.getValue();
	}
};

exports.getValue = function(){
	if( String($.FormElementTextField.value).length > 0 ){
		return $.FormElementTextField.getValue();
	}
};

exports.setValue = function(value){
	$.FormElementTextField.setValue(value);
};

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};

