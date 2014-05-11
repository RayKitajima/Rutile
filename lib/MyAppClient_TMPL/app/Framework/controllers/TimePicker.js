
// usage: 
//     
//     var controller = Alloy.createController('Framework/DatePicker');
//     controller.setListener(self);
//     controller.showPickerIn(view);
//     

var self = exports;
var parent;
var listener;

var DISPLAY_WIDTH  = Ti.Platform.displayCaps.platformWidth;
var DISPLAY_HEIGHT = Ti.Platform.displayCaps.platformHeight;

var STATUS_BAR_HEIGHT = 20; // iOS status bar height
var TOP_BAR_HEIGHT    = 44; // navigation bar height

var ANIM_DURATION = 300;

var WRAPPER_WIDTH  = DISPLAY_WIDTH;
var WRAPPER_HEIGHT = (DISPLAY_HEIGHT - STATUS_BAR_HEIGHT) * 2;

$.Wrapper.top    = WRAPPER_HEIGHT / 2;
$.Wrapper.width  = WRAPPER_WIDTH;
$.Wrapper.height = WRAPPER_HEIGHT;

// delgate object should have listenTimePicker()
exports.setListener = function(obj){
	listener = obj;
};

exports.showPickerIn = function(view){
	parent = view;
	parent.add($.Container);
	$.Wrapper.animate(
		Ti.UI.createAnimation({
			top      : -1 * WRAPPER_HEIGHT / 2,
			duration : ANIM_DURATION,
		}),
		function(){}
	);
};

function hidePicker(){
	listener.listenTimePicker($.Picker.value);
	$.Wrapper.animate(
		Ti.UI.createAnimation({
			top      : WRAPPER_HEIGHT / 2,
			duration : ANIM_DURATION,
		}),
		function(){
			parent.remove($.Container);
		}
	);
}

exports.setValue = function(date){
	$.Picker.setValue(date);
};
