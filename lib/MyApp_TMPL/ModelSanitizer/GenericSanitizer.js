
// generic sanitizers

// usage:
//     
//     var Sanitizers = require('GenericSanitizer');
//     
//     var mySanitizer = function(value){
//         return Sanitizers.someSanitizer(value);
//     };
//     
//     

var Sanitizer = {};

module.exports = Sanitizer;

// 
// be a number
// 
Sanitizer.simpleNumber = function(value,nullable){
	if( nullable && !value ){
		return 0;
	}
	var num = new Number(value);
	return num.valueOf();
};

// 
// be a text
// 
Sanitizer.simpleText = function(value,nullable){
	if( nullable && !value ){
		return '';
	}
	var string = new String(value);
	return string.toString();
};

// 
// be a date string
// 
Sanitizer.simpleDate = function(value,nullable){
	if( nullable && !value ){
		return null;
	}
	var date = new Date(value);
	return date.toISOString();
};

// 
// be a timestamp
// 
Sanitizer.simpleTimestamp = function(value,nullable){
	if( nullable && !value ){
		return null;
	}
	var date = new Date(value);
	return date.toISOString();
};


