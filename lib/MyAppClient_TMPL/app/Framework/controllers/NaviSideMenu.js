
var closeButtonHandler = function(){};

exports.setCloseButtonHandler = function(handler){
	closeButtonHandler = handler;
};

function clickCloseButton(e){
	closeButtonHandler(e);
}

exports.addMenuItem = function(item){ // the item is a controller
	$.SideMenuItems.add(item.getView());
};

function swipeHandler(e){
	if( e.direction == "right" ){
		// do nothing
	}else{
		closeButtonHandler(e);
	}
}

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});
$.CloseButtonSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.CloseButtonSymbol.setText(fontawesome.icon('fa-times'));

function showCloseButtonFlame(e){
	$.CloseButtonFlame.visible = true;
}

function hideCloseButtonFlame(e){
	$.CloseButtonFlame.visible = false;
}

