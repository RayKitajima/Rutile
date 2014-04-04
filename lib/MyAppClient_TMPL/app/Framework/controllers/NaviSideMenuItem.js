
// variables

var selectMenuHandler = function(){};

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});
$.ItemIconSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.ItemIconSymbol.setText(fontawesome.icon('fa-caret-right'));

exports.setSelectMenuHandler = function(handler){
	selectMenuHandler = handler;
};

function selectMenuItem(e){
	selectMenuHandler(e);
}

exports.setIcon = function(faIconName){
	$.ItemIconSymbol.setText(fontawesome.icon(faIconName));
};

exports.setLabel = function(text){
	$.ItemLabel.text = text;
};

