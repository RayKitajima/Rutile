
// usage: 
//     
//     var controller = Alloy.createController('Framework/TimestampPicker');
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

var WRAPPER_WIDTH  = DISPLAY_WIDTH * 2;
var WRAPPER_HEIGHT = (DISPLAY_HEIGHT - STATUS_BAR_HEIGHT) * 2;

$.Wrapper.top    = WRAPPER_HEIGHT / 2;
$.Wrapper.width  = WRAPPER_WIDTH;
$.Wrapper.height = WRAPPER_HEIGHT;

var cancelButton = Alloy.createController('Framework/NaviCancelButton');
var nextButton   = Alloy.createController('Framework/NaviNextButton');
var backButton   = Alloy.createController('Framework/NaviBackButton');
var okButton     = Alloy.createController('Framework/NaviOkButton');

// delgate object should have listenDatePicker() and listenTimePicker()
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
		function(){
			// setup button functions
			cancelButton.setButtonHandler(cancelPicker);
			nextButton.setButtonHandler(gotoTimePicker);
			backButton.setButtonHandler(gobackDatePicker);
			okButton.setButtonHandler(hidePicker);
			
			// then show the init 
			$.LeftButtonsView.add(cancelButton.getView());
			$.RightButtonsView.add(nextButton.getView());
		}
	);
};

var cancelPicker = function(){
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

function hidePicker(){
	listener.listenDatePicker($.DatePicker.value);
	listener.listenTimePicker($.TimePicker.value);
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

var gotoTimePicker = function(){
	$.LeftButtonsView.animate(
		Ti.UI.createAnimation({
			opacity  : 0.25,
			duration : ANIM_DURATION / 2,
		}),
		function(){
			$.LeftButtonsView.remove(cancelButton.getView());
			$.LeftButtonsView.add(backButton.getView());
			$.LeftButtonsView.animate(
				Ti.UI.createAnimation({
					opacity  : 1.0,
					duration : ANIM_DURATION / 2,
				}),
				function(){}
			);
		}
	);
	$.RightButtonsView.animate(
		Ti.UI.createAnimation({
			opacity  : 0.25,
			duration : ANIM_DURATION / 2,
		}),
		function(){
			$.RightButtonsView.remove(nextButton.getView());
			$.RightButtonsView.add(okButton.getView());
			$.RightButtonsView.animate(
				Ti.UI.createAnimation({
					opacity  : 1.0,
					duration : ANIM_DURATION / 2,
				}),
				function(){}
			);
		}
	);
	$.Body.animate(
		Ti.UI.createAnimation({
			left     : -1 * WRAPPER_WIDTH / 2,
			duration : ANIM_DURATION,
		}),
		function(){
			;
		}
	);
};

var gobackDatePicker = function(){
	$.LeftButtonsView.animate(
		Ti.UI.createAnimation({
			opacity  : 0.25,
			duration : ANIM_DURATION / 2,
		}),
		function(){
			$.LeftButtonsView.remove(backButton.getView());
			$.LeftButtonsView.add(cancelButton.getView());
			$.LeftButtonsView.animate(
				Ti.UI.createAnimation({
					opacity  : 1.0,
					duration : ANIM_DURATION / 2,
				}),
				function(){}
			);
		}
	);
	$.RightButtonsView.animate(
		Ti.UI.createAnimation({
			opacity  : 0.25,
			duration : ANIM_DURATION / 2,
		}),
		function(){
			$.RightButtonsView.remove(okButton.getView());
			$.RightButtonsView.add(nextButton.getView());
			$.RightButtonsView.animate(
				Ti.UI.createAnimation({
					opacity  : 1.0,
					duration : ANIM_DURATION / 2,
				}),
				function(){}
			);
		}
	);
	$.Body.animate(
		Ti.UI.createAnimation({
			left     : 0,
			duration : ANIM_DURATION,
		}),
		function(){
			;
		}
	);
};

exports.setValue = function(date){
	$.DatePicker.setValue(date);
	$.TimePicker.setValue(date);
};

