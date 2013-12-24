
// variables

var buttonHandler = function(){};

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

// setup ok button

$.ExecButtonSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.ExecButtonSymbol.setText(fontawesome.icon('fa-check'));

exports.setButtonHandler = function(handler){
	buttonHandler = handler;
};

function clickButton(e){
	buttonHandler(e);
}

exports.showButton = function(){
	$.ExecButtonSymbol.visible = true;
};

exports.hideButton = function(){
	$.ExecButtonSymbol.visible = false;
};

