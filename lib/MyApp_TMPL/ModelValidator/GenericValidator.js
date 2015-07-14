
// generic validators

// usage:
//     
//     var Validator = require('GenericValidator');
//     
//     var myValidator = function(value){
//         return Validator.someValidator(value); // true or false
//     };
//     
//     

var Validator = {};

module.exports = Validator;

// 
// empty, pass through
// 
Validator.empty = function(){ return true; };

// 
// not null
// 
Validator.notNull = function(value){
	if( value ){
		return true;
	}else{
		return false;
	}
};

// 
// positive value
// 
Validator.positiveValue = function(value){
	if( value > 0 ){
		return true;
	}else{
		return false;
	}
};

// 
// negative value
// 
Validator.negativeValue = function(value){
	if( value < 0 ){
		return true;
	}else{
		return false;
	}
};

// 
// timestamp string
// 
Validator.timestampString = function(value){
	if( !value ){ return false; }
	var date = new Date(value);
	if( date.toISOString() === 'Invalid Date' ){
		return false;
	}else{
		return true;
	}
};

// 
// date string
// 
Validator.dateString = function(value){
	if( !value ){ return false; }
	var date = new Date(value);
	if( date.toISOString() === 'Invalid Date' ){
		return false;
	}else{
		return true;
	}
};

// 
// email string
// 
Validator.emailString = function(value){
	if( value.match(/^[\w\d_\-\.]+@[\w\d_\-]+\.[\w\d._\-]+/) ){
		return true;
	}else{
		return false;
	}
};

// 
// simple html tags escape
// 
Validator.escapedHtmlTag = function(value){
	var string = new String(value);
	var unescaped = string.toString();
	
	var pattern = /[&<>"']/g;
	
	return value.replace(pattern, function($0){
		return {
			'&'  : '&amp;',
			'<'  : '&lt;',
			'>'  : '&gt;',
			'"'  : '&quot;',
			'\'' : '&apos;'
		}[$0];
	});
};

// 
// postgis geography(point)
// 
Validator.geographyPoint = function(value){
	if( value.match(/POINT\(\d+\.*\d* \d+\.*\d*\)/) ){
		return true;
	}else{
		return false;
	}
};


