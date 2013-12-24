
// FieldClearButton

var focusLevel = 0; // 0:inactive, 1:active

var buttonHandler = function(){};

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

$.ButtonSymbol.setColor('#ccc');
$.ButtonSymbol.setFont({fontSize:"14dp", fontFamily:fontawesome.fontfamily()});
$.ButtonSymbol.setText(fontawesome.icon('fa-times'));

exports.setButtonHandler = function(handler){
	buttonHandler = handler;
};

function clickButton(e){
	if( focusLevel == 0 ){
		focusLevel++;
		focusButton();
	}else{
		buttonHandler(e);
		blurButton();
		focusLevel = 0;
	}
}

var focusButton = function(){
	$.ButtonSymbol.setColor('#a00');
	$.ButtonSymbol.setFont({fontSize:"14dp", fontFamily:fontawesome.fontfamily()});
	$.ButtonSymbol.setText(fontawesome.icon('fa-times-circle'));
};

var blurButton = function(){
	$.ButtonSymbol.setColor('#ccc');
	$.ButtonSymbol.setFont({fontSize:"14dp", fontFamily:fontawesome.fontfamily()});
	$.ButtonSymbol.setText(fontawesome.icon('fa-times'));
};

