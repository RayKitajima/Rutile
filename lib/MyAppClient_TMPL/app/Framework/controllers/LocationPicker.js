
// full screen module based on NavigationGroup

// usage: 
//     
//     var controller = Alloy.createController('Framework/LocationPicker');
//     controller.setListener(self);
//     controller.setRegion(region);
//     
//     modalWindow.getView().open();
//     modalWindow.navigationGroup.open(controller);
//     
//     

var self = exports;
var listener;

var mapInitialized = false;

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

$.UpSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.UpSymbol.setText(fontawesome.icon('fa-plus'));

$.DownSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.DownSymbol.setText(fontawesome.icon('fa-minus'));

$.MarkerSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.MarkerSymbol.setText(fontawesome.icon('fa-plus'));
$.MarkerSymbol.setColor("#f00");

function zoomUp(){
	$.MapView.zoom(+1);
};
function zoomDown(){
	$.MapView.zoom(-1);
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var crr_region = {};

exports.setRegion = function(region){
	crr_region = region;
};

// delgate object should have listenLocationPicker()
exports.setListener = function(obj){
	listener = obj;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// navigation protocol

exports.viewDidLoad = function(){
	navi = Alloy.Globals.navigationControllerStack[0];
	
	// left buttons
	
	var cancelButton = Alloy.createController('Framework/NaviCancelButton');
	cancelButton.setButtonHandler(function(e){
		navi.close();
	});
	navi.setLeftButton(cancelButton.getView());
	
	// right buttons
	
	var okButton = Alloy.createController('Framework/NaviOkButton');
	okButton.setButtonHandler(function(e){
		listener.listenLocationPicker($.MapView.region);
		navi.close();
	});
	navi.setRightButton(okButton.getView());
	
	// define title
	
	var title = Alloy.createController('Framework/NaviTitle');
	title.setTitle(String.format(L('FrameworkTitleFormatPicker'),L('FrameworkTextExpNearbyCentroid')));
	navi.setTitleView(title.getView());
	
	// setup map
	$.MapView.region = crr_region;
};

exports.viewWillAppear = function(){
};

exports.viewWillDisappear = function(){
};

