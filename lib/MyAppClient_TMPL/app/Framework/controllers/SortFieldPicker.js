
// usage: 
//     
//     var controller = Alloy.createController('Framework/SortFieldPicker');
//     var data = [];
//     data.push({ segmentName:sname, entityName:ename, fieldName:fname });
//     controller.setData(data);
//     controller.setListener(self);
//     controller.showPickerIn(view);
//     

var self = exports;

var fields = []; // field data set to picker
var parent;      // parent view
var listener;    // delegate
var value;       // selected row object

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

$.CancelButton.getView().top  = 0;
$.CancelButton.getView().left = 10;
$.OkButton.getView().top      = 0;
$.OkButton.getView().right    = 10;

$.CancelButton.setButtonHandler(function(e){
	$.Wrapper.animate(
		Ti.UI.createAnimation({
			top      : WRAPPER_HEIGHT / 2,
			duration : ANIM_DURATION,
		}),
		function(){
			parent.remove($.Container);
		}
	);
});

$.OkButton.setButtonHandler(function(e){
	listener.listenSortFieldPicker(value);
	$.Wrapper.animate(
		Ti.UI.createAnimation({
			top      : WRAPPER_HEIGHT / 2,
			duration : ANIM_DURATION,
		}),
		function(){
			parent.remove($.Container);
		}
	);
});

exports.setData = function(data){
	fields = data;
	$.Picker.add(fields);
};

// delgate object should have listenSortFieldPicker()
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
			$.Picker.addEventListener('change',function(e){
				value = e.row;
			});
			var mid = Math.floor(fields.length/2);
			var selected = mid > 0 ? mid-1 : mid;
			$.Picker.setSelectedRow(0,selected,true);
		}
	);
};

