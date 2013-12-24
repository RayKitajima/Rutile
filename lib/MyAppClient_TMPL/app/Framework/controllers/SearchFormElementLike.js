
var index;

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

