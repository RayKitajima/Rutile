
var self = exports;
var index; // DEPRECATED

var timestampFrom;
var timestampTo;
var target_timestamp;
var target_view;

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
};

exports.listenDatePicker = function(selected_date){
	target_timestamp.setFullYear( selected_date.getFullYear() );
	target_timestamp.setMonth(    selected_date.getMonth()    );
	target_timestamp.setDate(     selected_date.getDate()     );
	
	target_view.text = toSimpleISOString(target_timestamp);
	target_view.color = '#55c';
};

exports.listenTimePicker = function(selected_time){
	target_timestamp.setHours(   selected_time.getHours()   );
	target_timestamp.setMinutes( selected_time.getMinutes() );
	
	target_view.text = toSimpleISOString(target_timestamp);
	target_view.color = '#55c';
};

var openTimestampPicker = function(e){
	var controller = Alloy.createController('Framework/TimestampPicker');
	controller.setListener(self);
	controller.setValue(target_timestamp);
	
	var navi = Alloy.Globals.navigationControllerStack[0];
	var win = navi.getRootWindow();
	
	controller.showPickerIn(win);
};

function openTimestampPickerFrom(e){
	if( !timestampFrom ){ timestampFrom = new Date(); }
	
	target_timestamp = timestampFrom;
	target_view = $.TimestampFrom;
	openTimestampPicker();
};

function openTimestampPickerTo(e){
	if( !timestampTo ){ timestampTo = new Date(); }
	
	target_timestamp = timestampTo;
	target_view = $.TimestampTo;
	openTimestampPicker();
};

exports.initForm = function(){
	$.TimestampFrom.text = L('FrameworkSearchFormElementTimestampFrom');
	$.TimestampFrom.color = '#aaa';
	timestampFrom = null;
	
	$.TimestampTo.text = L('FrameworkSearchFormElementTimestampTo');
	$.TimestampTo.color = '#aaa';
	timestampTo = null;
};

exports.setIndex = function(idx){
	index = idx;
};

exports.getIndex = function(){
	return index;
};

exports.getTextExpression = function(){
	var from;
	var to;
	if( timestampFrom ){
		from = toSimpleISOString(timestampFrom);
	}
	if( timestampTo ){
		to = toSimpleISOString(timestampTo);
	}
	
	var text = '';
	if( from || to ){
		if( from ){ text += from; }
		text += L('FrameworkTextExpTimestampBetween');
		if( to ){ text += to; }
	}
	return text;
};

exports.getValue = function(){
	var from;
	var to;
	if( timestampFrom ){
		from = toSimpleISOString(timestampFrom);
	}
	if( timestampTo ){
		to = toSimpleISOString(timestampTo);
	}
	return { "from":from, "to":to };
};

// usage: 
// searchElementTimestamp.setValue({ from:date, to:date });
exports.setValue = function(from_to){
	var from = from_to.from;
	var to   = from_to.to;
	timestampFrom = from;
	timestampTo = to;
};

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};


