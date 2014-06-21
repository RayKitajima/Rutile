
// Orderby{{#Uc_first}}{{field}}{{/Uc_first}} with limiter
// 
// segment : {{segment}}
// entity  : {{entity}}
// field   : {{field}}
// 
// joined
// segment : {{segment_joined}}
// entity  : {{entity_joined}}
// field   : {{field_joined}}
// 

// usage:
//     
//     var OrderbyFieldWithLimit = require('Constraint/SEGMENT/ENTITY/OrderbyFieldWithLimit');
//     var orderby = new OrderbyFieldWithLimit('desc',100);
//     

// static variables

var ASC  = 'asc';
var DESC = 'desc';

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function Constructor(ascdesc,limit){
	this.scend = ascdesc.toLowerCase();
	this.limit = parseInt(limit);
	
	if( (this.limit > 0) &&  (this.scend == ASC || this.scend == DESC) ){
		this.valid = true;
	}
}

module.exports = Constructor;

var OrderbyWithLimit = Constructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public apis

OrderbyWithLimit.responsible = function(){
	return this.valid;
};

OrderbyWithLimit.wrap = function(sql){
	var wrapped = "select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} in " + sql + " and {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{field}} = {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}} order by {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}} " + this.scend + " limit " + this.limit;
	return wrapped;
};

OrderbyWithLimit.stringify = function(){
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field}}:" + this.scend + " limit:" + this.limit;
	return str;
};

