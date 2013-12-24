
// Selectby{{#Uc_first}}{{field_jnx}}{{/Uc_first}}
// 
// segment                     : {{segment}}
// entity (id search target)   : {{entity}}
// primary key of base entity  : {{primary_key}}
// 
// junction                    : {{junction}}
// 
// joined segment              : {{segment_jnx}} (not yet supported)
// joined entity               : {{entity_jnx}}
// joined entity's primary_key : {{primary_key_jnx}}
// search field                : {{field_jnx}}
// search type                 : {{search_type_jnx}}
// 

// usage:
//     
//     var Selectby = require('Constraint/SEGMENT/ENTITY/SelectbyField');
//     var selector = new Selectby({ values : [1,2,3], logic : "and" });
//     

var LOGIC_OR  = 'or';
var LOGIC_AND = 'and'

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function Constructor(query){
	this.values = [];
	this.logic  = LOGIC_OR;
	this.valid  = false;
	
	if( query.logic ){
		this.logic = query.logic.toLowerCase();
		if( this.logic != LOGIC_OR || this.logic != LOGIC_AND ){
			this.logic = LOGIC_OR;
		}
	}
	
	for( var i=0; i<query.values.length; i++ ){
		if( query.values[i] ){
			this.values.push(query.values[i]);
		}
	}
	
	if( this.values.length > 0 ){
		this.valid = true;
	}
}

module.exports = Constructor;

var Selectby = Constructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public apis

Selectby.responsible = function(){
	return this.valid;
};

Selectby.makeConstraint = function(){
	var sql     = '';
	var params  = [];
	var clauses = [];
	var clause  = '';
	
	for( var i=0; i<this.values.length; i++ ){
		var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}.{{field_jnx}} = ?";
		clauses.push(constraint);
		params.push(this.values[i]);
	}
	var connector = ' or ';
	if( this.logic == LOGIC_AND ){
		connector = ' and ';
	}
	clause = clauses.join(connector);
	
	sql = " ( select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}},{{#Escape_reserved}}{{#Lc_first}}{{junction}}{{/Lc_first}}{{/Escape_reserved}},{{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}} where {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} = {{#Escape_reserved}}{{#Lc_first}}{{junction}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} and {{#Escape_reserved}}{{#Lc_first}}{{junction}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_jnx}} = {{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_jnx}} and " + clause + " ) ";
	
	return {
		"sql"             : sql,
		"params"          : params,
		"parameterizable" : true
	};
};

Selectby.stringify = function(){
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field_joined}}(key):" + this.values.join(",") + "/" + logic;
	return str;
};

