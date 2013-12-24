
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
	$.SearchElementMin.setValue('');
	$.SearchElementMax.setValue('');
};

exports.getTextExpression = function(){
	var min;
	var max;
	if( String($.SearchElementMin.value).length > 0 ){
		var num = new Number($.SearchElementMin.getValue());
		min = num.valueOf();
	}
	if( String($.SearchElementMax.value).length > 0 ){
		var num = new Number($.SearchElementMax.getValue());
		max = num.valueOf();
	}
	
	var text = '';
	if( min || max ){
		if( min ){ text += min; }
		text += L('FrameworkTextExpNumberBetween');
		if( max ){ text += max; }
	}
	return text;
};

exports.getValue = function(){
	var min;
	var max;
	if( String($.SearchElementMin.value).length > 0 ){
		var num = new Number($.SearchElementMin.getValue());
		min = num.valueOf();
	}
	if( String($.SearchElementMax.value).length > 0 ){
		var num = new Number($.SearchElementMax.getValue());
		max = num.valueOf();
	}
	return { "min":min, "max":max };
};

// usage: 
// searchElementNum.setValue({ min:MIN, max:MAX });
exports.setValue = function(min_max){
	var min = min_max.min;
	var max = min_max.max;
	$.SearchElementMin.setValue(min);
	$.SearchElementMax.setValue(max);
};

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};
