
var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

$.HeaderSymbol.setFont({fontSize:"12dp", fontFamily:fontawesome.fontfamily()});
$.HeaderSymbol.setText(fontawesome.icon('fa-info-circle'));

var DISPLAY_HEIGHT         = Ti.Platform.displayCaps.platformHeight;
var STATUS_BAR_HEIGHT      = 20;
var HEADER_HEIGHT          = 28;
var CONTENTS_TOP_MARGIN    = 10;
var CONTENTS_BOTTOM_MARGIN = 20;
var RESUMED_TOP_POSITION   = DISPLAY_HEIGHT - STATUS_BAR_HEIGHT;

var panelOpened      = false;
var waitingAutoClose = false;
var animating        = false;

var closeContainer = function(){
	if( animating ){ return; }
	animating = true;
	RESUMED_TOP_POSITION = DISPLAY_HEIGHT - STATUS_BAR_HEIGHT;
	$.Container.animate(
		Ti.UI.createAnimation({
			top      : RESUMED_TOP_POSITION,
			duration : 250,
		}),
		function(){
			panelOpened = false;
			animating = false;
		}
	);
};

var openContainer = function(){
	if( animating ){ return; }
	animating = true;
	var content_height = $.InfoContainer.getContentHeight();
	$.InfoContainer.getView().height = content_height;
	RESUMED_TOP_POSITION = DISPLAY_HEIGHT - HEADER_HEIGHT - STATUS_BAR_HEIGHT - content_height - CONTENTS_TOP_MARGIN - CONTENTS_BOTTOM_MARGIN;
	$.Container.animate(
		Ti.UI.createAnimation({
			top      : RESUMED_TOP_POSITION,
			duration : 250,
		}),
		function(){
			panelOpened = true;
			animating = false;
		}
	);
};

$.InfoContainer.getView().addEventListener('contentChanged',function(e){
	if( !panelOpened ){ return; }
	animating = true;
	var content_height = e.info.getContentHeight();
	RESUMED_TOP_POSITION = DISPLAY_HEIGHT - HEADER_HEIGHT - STATUS_BAR_HEIGHT - content_height - CONTENTS_TOP_MARGIN - CONTENTS_BOTTOM_MARGIN;
	$.Container.animate(
		Ti.UI.createAnimation({
			top      : RESUMED_TOP_POSITION,
			duration : 250,
		}),
		function(){
			panelOpened = true;
			animating = false;
		}
	);
});

exports.initPosition = function(){
	panelOpened = false;
	animating = false;
	$.Container.top = DISPLAY_HEIGHT - STATUS_BAR_HEIGHT;
};

exports.resumePosition = function(){};

exports.restorePosition = function(){
	if( animating ){ return; }
	animating = true;
	$.Container.animate(
		Ti.UI.createAnimation({
			top      : RESUMED_TOP_POSITION,
			duration : 250,
		}),
		function(){
			panelOpened = true;
			animating = false;
		}
	);
};

exports.closeContainer = function(){
	closeContainer();
};

exports.openContainer = function(){
	openContainer();
};

exports.push = function(info){
	$.InfoContainer.push(info);
	waitingAutoClose = true;
};

exports.getCurrentInfo = function(){
	return $.InfoContainer.getCurrentInfo();
};

exports.setHeaderText = function(text){
	$.HeaderText.text = text;
};


