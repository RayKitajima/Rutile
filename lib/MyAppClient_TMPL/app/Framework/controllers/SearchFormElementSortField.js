
var self = exports;

var index;
var sortfield = {};

// value contains title(i18n ready),fieldName,segmentName,entityName
exports.listenSortFieldPicker = function(value){
	sortfield = value;
	$.SortField.text = sortfield.title;
	$.SortField.color = '#55c';
};

exports.setFields = function(data){
	fields = data;
};

function openSortFieldPicker(e){
	var controller = Alloy.createController('Framework/SortFieldPicker');
	controller.setData(fields);
	controller.setListener(self);
	
	var navi = Alloy.Globals.navigationControllerStack[0];
	var win = navi.getRootWindow();
	
	controller.showPickerIn(win);
}

exports.initForm = function(){
	$.SortField.text = L('FrameworkSearchFormElementSortFieldHint');
	$.SortField.color = '#aaa';
};

exports.setIndex = function(idx){
	index = idx;
};

exports.getIndex = function(){
	return index;
};

exports.getTextExpression = function(){
	var text = '';
	if( sortfield.fieldName ){
		var array = [sortfield.segmentName,sortfield.entityName,sortfield.fieldName];
		var key = array.join('_');
		text = L(key);
	}
	return text;
};

exports.getValue = function(){
	return sortfield;
};

// usage:
// searchElementSortField.setValue({ title:str, fieldName:str, segmentName:str, entityName:str });
exports.setValue = function(value){
	sortfield = value;
};

exports.getSortField = function(){
	return sortfield.fieldName;
	// might be
	// return [sortfield.entityName,sortfield.fieldName].join('.');
};

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};

