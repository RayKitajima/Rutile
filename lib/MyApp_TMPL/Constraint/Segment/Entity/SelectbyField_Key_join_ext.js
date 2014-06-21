
// Selectby{{#Uc_first}}{{field_joined}}{{/Uc_first}}
// 
// segment : {{segment}}
// entity  : {{entity}}
// field   : {{field}}
// type    : join
// 
// joined
// segment : {{segment_joined}}
// entity  : {{entity_joined}}
// field   : {{field_joined}}
// type    : {{search_type_joined}}
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
	this.limit  = 0;
	
	if( query.limit ){
		this.limit = parseInt(query.limit);
	}
	
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
		// 
		// * dblink query cannon be parameterized, the param should be escaped by escapeStringConn
		// 
		var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}} = \'\'?\'\'";
		
		clauses.push(constraint);
		params.push(this.values[i]);
	}
	var connector = ' or ';
	if( this.logic == LOGIC_AND ){
		connector = ' and ';
	}
	clause = clauses.join(connector);
	
	var limiter = '';
	if( this.limit > 0 ){ limiter = " limit " + this.limit; }
	
	sql = " ( select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}, dblink('dbname={{#Lc_first}}{{segment_joined}}{{/Lc_first}}','select {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_joined}} from {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}} where " + clause + limiter + "') as {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}({{primary_key_joined}} int) where {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_joined}}={{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_joined}} ) ";
	
	return {
		"sql"             : sql,
		"params"          : params,
		"parameterizable" : false
	};
};

Selectby.stringify = function(){
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field_joined}}(key):" + this.values.join(",") + "/" + logic;
	return str;
};

