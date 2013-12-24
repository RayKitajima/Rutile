
var self = exports;

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var orig_color   = $.FormElementTimestamp.color;
var curr_color   = $.FormElementTimestamp.color;
var edited_color = '#d10404';

var orig_timestamp; // also used as a initialization checker
var prev_timestamp;
var curr_timestamp;

var editable = true;

var alignDigit = function(num){
	var str = new String(num);
	if( str.length < 2 ){
		str = '0' + str;
	}
	return str;
};

var toSimpleISOString = function(dateObj){
	var year     = dateObj.getFullYear();
	var month    = dateObj.getMonth();
	var date     = dateObj.getDate();
	var iso_date = [year,(month+1),date].join('/');
	
	var hour     = alignDigit(dateObj.getHours());
	var minute   = alignDigit(dateObj.getMinutes());
	var iso_time = [hour,minute].join(':');
	
	var iso = iso_date + ' ' + iso_time;
	
	return iso;
};

exports.toSimpleISOString = function(dateObj){
	return toSimpleISOString(dateObj);
}

exports.listenDatePicker = function(edited_date){
	if( !orig_timestamp ){
		orig_timestamp = edited_date;
		prev_timestamp = edited_date;
		curr_timestamp = edited_date;
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
	
	var orig_year  = orig_timestamp.getFullYear();
	var orig_month = orig_timestamp.getMonth();
	var orig_date  = orig_timestamp.getDate();
	
	if( (edited_year != curr_year) || (edited_month != curr_month) || (edited_date != curr_date) ){
		prev_timestamp = curr_timestamp;
		
		if( !curr_timestamp ){ curr_timestamp = new Date(); }
		curr_timestamp.setFullYear( edited_year );
		curr_timestamp.setMonth(    edited_month );
		curr_timestamp.setDate(     edited_date );
		
		curr_year  = edited_year;
		curr_month = edited_month;
		curr_date  = edited_date;
		
		curr_color = edited_color;
	}
	if( (curr_year == orig_year) && (curr_month == orig_month) && (curr_date == orig_date) ){
		curr_color = orig_color;
	}
	
	$.FormElementTimestamp.text = toSimpleISOString(curr_timestamp);
	$.FormElementTimestamp.color = curr_color;
	
	changeHandler(curr_timestamp);
};

exports.listenTimePicker = function(edited_time){
	if( !orig_timestamp ){
		orig_timestamp = edited_time;
		prev_timestamp = edited_time;
		curr_timestamp = edited_time;
	}
	
	var edited_hours   = edited_time.getHours();
	var edited_minutes = edited_time.getMinutes();
	
	var curr_hours,curr_minutes;
	if( curr_timestamp ){
		curr_hours   = curr_timestamp.getHours();
		curr_minutes = curr_timestamp.getMinutes();
	}
	
	var orig_hours   = orig_timestamp.getHours();
	var orig_minutes = orig_timestamp.getMinutes();
	
	if( (edited_hours != curr_hours) || (edited_minutes != curr_minutes) ){
		prev_timestamp  = curr_timestamp;
		
		if( !curr_timestamp ){ curr_timestamp = new Date(); }
		curr_timestamp.setHours(   edited_hours   );
		curr_timestamp.setMinutes( edited_minutes );
		
		curr_color = edited_color;
	}
	if( (edited_hours == orig_hours) && (edited_minutes == orig_minutes) ){
		curr_color = orig_color;
	}
	
	$.FormElementTimestamp.text = toSimpleISOString(curr_timestamp);
	$.FormElementTimestamp.color = curr_color;
	
	changeHandler(curr_timestamp);
};

function openTimestampPicker(e){
	if( !editable ){ return; }
	
	var controller = Alloy.createController('Framework/TimestampPicker');
	controller.setListener(self);
	controller.setValue(curr_timestamp);
	
	var navi = Alloy.Globals.navigationControllerStack[0];
	var win = navi.getRootWindow();
	
	controller.showPickerIn(win);
}

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// get and set iso string

exports.setValue = function(new_time_iso){
	if( !new_time_iso ){
		if( !orig_timestamp ){
			// start with no data
			orig_color = edited_color;
		}
		prev_timestamp = curr_timestamp;
		curr_timestamp = null;
		showHintTexts();
		return;
	}
	
	var new_timestamp = new Date(new_time_iso);
	
	if( !orig_timestamp ){
		orig_timestamp = new_timestamp;
		prev_timestamp = new_timestamp;
		curr_timestamp = new_timestamp;
	}
	
	prev_timestamp = curr_timestamp;
	curr_timestamp = new_timestamp;
	
	$.FormElementTimestamp.text = toSimpleISOString(curr_timestamp);
};

exports.getValue = function(){
	return curr_timestamp;
};

// hintText

var hintTexts = [];

var showHintTexts = function(){
	$.FormElementTimestamp.text = hintTexts.join(' ');
	$.FormElementTimestamp.color = '#aaa';
};

var hideHintTexts = function(){
	$.FormElementTimestamp.hintText = '';
};

exports.setHintTexts = function(texts){
	hintTexts = texts;
};

exports.setHintTextsDate = function(text){
	$.FormElementTimestamp.text = text;
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

