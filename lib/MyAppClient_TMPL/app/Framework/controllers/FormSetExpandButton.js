
// declare as right button

exports.isRightButton = true;

// variables

var buttonHandler = function(){};

// setup button

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

$.OpenButtonSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.OpenButtonSymbol.setText(fontawesome.icon('fa-caret-down'));

$.CloseButtonSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.CloseButtonSymbol.setText(fontawesome.icon('fa-caret-right'));

$.OpenButtonSymbol.visible = false;
$.CloseButtonSymbol.visible = true;

exports.toggleButton = function(){
	if( $.OpenButtonSymbol.visible ){
		// close
		$.OpenButtonSymbol.visible = false;
		$.CloseButtonSymbol.visible = true;
	}else{
		// open
		$.OpenButtonSymbol.visible = true;
		$.CloseButtonSymbol.visible = false;
	}
};

exports.setButtonHandler = function(handler){
	buttonHandler = handler;
};

function clickButton(e){
	buttonHandler(e);
}

exports.showButton = function(){
	$.ButtonView.visible = true;
};

exports.hideButton = function(){
	$.ButtonView.visible = false;
};

