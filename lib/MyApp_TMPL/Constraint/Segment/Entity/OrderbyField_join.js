
// Orderby{{#Uc_first}}{{field}}{{/Uc_first}}
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
//     var OrderbyField = require('Constraint/SEGMENT/ENTITY/OrderbyModule');
//     var orderby = new OrderbyField('desc');
//     

// static variables

var ASC  = 'asc';
var DESC = 'desc';

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function Constructor(ascdesc){
	this.scend = ascdesc.toLowerCase();
	
	if( this.scend == ASC || this.scend == DESC ){
		this.valid = true;
	}
}

module.exports = Constructor;

var Orderby = Constructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public apis

Orderby.responsible = function(){
	return this.valid;
};

Orderby.wrap = function(sql){
	var wrapped = "select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} in " + sql + " and {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{field}} = {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}} order by {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}} " + this.scend;
	return wrapped;
};

Orderby.stringify = function(){
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field}}:" + this.scend;
	return str;
};

