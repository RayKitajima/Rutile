
var self = exports;

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var orig_color   = $.FormElementDate.color;
var curr_color   = $.FormElementDate.color;
var edited_color = '#d10404';

var orig_date; // also used as a initialization checker
var prev_date;
var curr_date;

var editable = true;

exports.listenDatePicker = function(edited_date){
	if( !orig_date ){
		orig_date = edited_date;
		prev_date = edited_date;
		curr_date = edited_date;
	}
	
	var edited_year  = edited_date.getFullYear();
	var edited_month = edited_date.getMonth();
	var edited_date  = edited_date.getDate();
	
	var curr_year,curr_month,curr_date;
	if( curr_timestamp ){
		curr_year  = curr_timestamp.getFullYear();
		curr_month = curr_timestamp.getMonth();
		curr_date  = curr_timestamp.getDate();
	}
	
	var orig_year  = orig_date.getFullYear();
	var orig_month = orig_date.getMonth();
	var orig_date  = orig_date.getDate();
	
	if( (edited_year != curr_year) || (edited_month != curr_month) || (edited_date != curr_date) ){
		prev_date  = curr_date;
		curr_date  = edited_date;
		curr_color = edited_color;
		
		curr_year  = edited_year;
		curr_month = edited_month;
		curr_date  = edited_date;
	}
	if( (curr_year == orig_year) && (curr_month == orig_month) && (curr_date == orig_date) ){
		curr_color = orig_color;
	}
	
	var iso = [curr_year,(curr_month+1),curr_date].join('/');
	$.FormElementDate.text = iso;
	$.FormElementDate.color = curr_color;
	
	changeHandler(curr_date);
};

function openDatePicker(e){
	if( !editable ){ return; }
	
	var controller = Alloy.createController('Framework/DatePicker');
	controller.setListener(self);
	controller.setValue(curr_date);
	
	var navi = Alloy.Globals.navigationControllerStack[0];
	var win = navi.getRootWindow();
	
	controller.showPickerIn(win);
}

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// get and set Date object

exports.setValue = function(new_date){
	if( !new_date ){
		if( !orig_date ){
			// start with no data
			orig_color = edited_color;
		}
		$.FormElementDate.text = '';
		prev_date = curr_date;
		curr_date = '';
		showHintTexts();
		return;
	}
	
	if( !orig_date ){
		orig_date = new_date;
		prev_date = new_date;
		curr_date = new_date;
	}
	
	prev_date = curr_date;
	curr_date = new_date;
	
	var curr_year  = curr_date.getFullYear();
	var curr_month = curr_date.getMonth();
	var curr_date  = curr_date.getDate();
	var iso = [curr_year,(curr_month+1),curr_date].join('/');
	
	$.FormElementDate.text = iso;
};

exports.getValue = function(){
	return curr_date;
};

// hintText

var hintTexts = [];

var showHintTexts = function(){
	$.FormElementDate.hintText = hintTexts.join(' ');
	$.FormElementDate.color = '#aaa';
};

var hideHintTexts = function(){
	$.FormElementDate.hintText = '';
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

