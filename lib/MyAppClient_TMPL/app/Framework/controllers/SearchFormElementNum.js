
var index; // DEPRECATED

var doneBtn_min = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.DONE});
doneBtn_min.addEventListener('click',function(e){$.SearchElementMin.blur();});
var flexSpace = Titanium.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE});
var toolbar = Ti.UI.iOS.createToolbar({
	items     : [flexSpace, doneBtn_min],
	tintColor : '#fff',
	barColor  : '#85d031'
});
$.SearchElementMin.keyboardToolbar = toolbar;

var doneBtn_max = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.DONE});
doneBtn_max.addEventListener('click',function(e){$.SearchElementMax.blur();});
var toolbar = Ti.UI.iOS.createToolbar({
	items     : [flexSpace, doneBtn_max],
	tintColor : '#fff',
	barColor  : '#85d031'
});
$.SearchElementMax.keyboardToolbar = toolbar;

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
