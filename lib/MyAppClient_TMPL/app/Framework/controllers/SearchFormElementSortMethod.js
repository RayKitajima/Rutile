
var self = exports;

var index; // DEPRECATED
var sortmethod = '';

// value contains title(i18n ready),method
exports.listenSortMethodPicker = function(value){
	sortmethod = value;
	$.SortMethod.text = sortmethod.title;
	$.SortMethod.color = '#55c';
};

function openSortMethodPicker(e){
	var controller = Alloy.createController('Framework/SortMethodPicker');
	controller.setListener(self);
	
	var navi = Alloy.Globals.navigationControllerStack[0];
	var win = navi.getRootWindow();
	
	controller.showPickerIn(win);
}

exports.initForm = function(){
	$.SortMethod.text = L('FrameworkSearchFormElementSortMethodHint');
	$.SortMethod.color = '#aaa';
};

exports.setIndex = function(idx){
	index = idx;
};

exports.getIndex = function(){
	return index;
};

exports.getTextExpression = function(){
	var text = '';
	if( sortmethod.method ){
		text = L(sortmethod.method);
	}
	return text;
};

exports.getValue = function(){
	return sortmethod;
};

// usage:
// searchFormElementSortForm.setValue(value);
// value should be 
//     { "title":L('FrameworkSearchFormElementSortMethodDesc'), "method":'FrameworkSearchFormElementSortMethodDesc' }, 
//     or
//     { "title":L('FrameworkSearchFormElementSortMethodAsc'), "method":'FrameworkSearchFormElementSortMethodAsc' }
exports.setValue = function(value){
	sortmethod = value;
};

exports.getSortMethod = function(){
	var method = sortmethod.method;
	if( method == 'FrameworkSearchFormElementSortMethodAsc' ){
		return 'asc';
	}else{
		return 'desc';
	}
};

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};

