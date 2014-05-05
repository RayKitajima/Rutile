
var self = exports;
var index; // DEPRECATED

var dateFrom;
var dateTo;
var target_date;
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
}

exports.listenDatePicker = function(selected_date){
	target_date.setFullYear( selected_date.getFullYear() );
	target_date.setMonth(    selected_date.getMonth()    );
	target_date.setDate(     selected_date.getDate()     );
	
	target_view.text = toSimpleISOString(target_date);
	target_view.color = '#55c';
};

var openDatePicker = function(e){
	var controller = Alloy.createController('Framework/DatePicker');
	controller.setListener(self);
	controller.setValue(target_date);
	
	var navi = Alloy.Globals.navigationControllerStack[0];
	var win = navi.getRootWindow();
	
	controller.showPickerIn(win);
};

function openDatePickerFrom(e){
	if( !dateFrom ){ dateFrom = new Date(); }
	
	target_date = dateFrom;
	target_view = $.DateFrom;
	openDatePicker();
};

function openDatePickerTo(e){
	if( !dateTo ){ dateTo = new Date(); }
	
	target_date = dateTo;
	target_view = $.DateTo;
	openDatePicker();
};

exports.initForm = function(){
	$.DateFrom.text = L('FrameworkSearchFormElementDateFrom');
	$.DateFrom.color = '#aaa';
	
	$.DateTo.text = L('FrameworkSearchFormElementDateTo');
	$.DateTo.color = '#aaa';
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
	if( dateFrom ){
		from = toSimpleISOString(dateFrom);
	}
	if( dateTo ){
		to = toSimpleISOString(dateTo);
	}
	
	var text = '';
	if( from || to ){
		if( from ){ text += from; }
		text += L('FrameworkTextExpDateBetween');
		if( to ){ text += to; }
	}
	return text;
};

exports.getValue = function(){
	var from;
	var to;
	if( dateFrom ){
		from = toSimpleISOString(dateFrom);
	}
	if( dateTo ){
		to = toSimpleISOString(dateTo);
	}
	return { "from":from, "to":to };
};

// usage: 
// searchElementDate.setValue({ from:date, to:date });
exports.setValue = function(from_to){
	var from = from_to.from;
	var to   = from_to.to;
	dateFrom = from;
	dateTo = to;
};

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};



