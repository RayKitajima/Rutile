
var self = exports;

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

exports.setValue = function(value){
	$.FormElementLabel.text = value;
};

exports.getValue = function(){
	return $.FormElementLabel.text;
};

// enable and disable editing

exports.enableEditing = function(){
	// do nothing
};

exports.disableEditing = function(){
	// do nothing
};

