
// usage:
//     
//     var okButton = Alloy.createContoller('Framework/NavigationButton',{type:'ok',size:'20dp'});
//     $.view.add(okButton.getView());
//     

var TypeFontMap = {
	'ok'     : 'fa-check',
	'back'   : 'fa-chevron-left',
	'add'    : 'fa-plus',
	'search' : 'fa-search',
	'cancel' : 'fa-times',
};

var args = arguments[0];
var fontName = TypeFontMap(args.type) || 'OK';
var fontSize = args.size || '20dp';

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

$.ButtonSymbol.setFont({fontSize:fontSize, fontFamily:fontawesome.fontfamily()});
$.ButtonSymbol.setText(fontawesome.icon(fontName));

var buttonHandler = function(){};

exports.setButtonHandler = function(handler){
	buttonHandler = handler;
};

function clickButton(e){
	buttonHandler(e);
}

function showButtonFlame(e){
	$.OkButtonFlame.visible = true;
}

function hideButtonFlame(e){
	$.OkButtonFlame.visible = false;
}

exports.showButton = function(){
	$.OkButtonView.visible = true;
};

exports.hideButton = function(){
	$.OkButtonView.visible = false;
};

exports.isRightButton = true; // left or right, true to right.

