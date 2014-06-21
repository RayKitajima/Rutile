
// Limiter for this entity
// 
// segment : {{segment}}
// entity  : {{entity}}
// 

// usage:
//     
//     var Limit = require('Constraint/SEGMENT/ENTITY/Limit');
//     var limiter = new Limit(max);
//     

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function Constructor(limit){
	this.limit = parseInt(limit);
	
	if( this.limit > 0 ){
		this.valid = true;
	}
}

module.exports = Constructor;

var Limit = Constructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public apis

Limit.responsible = function(){
	return this.valid;
};

Limit.wrap = function(sql){
	var wrapped = "select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} in " + sql + " limit " + this.limit;
	return wrapped;
};

Limit.stringify = function(){
	var str = "limit:" + this.limit;
	return str;
};

