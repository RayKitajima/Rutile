
// Selectby{{#Uc_first}}{{field_joined}}{{/Uc_first}}Like
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
//     var selector = new Selectby({ values : ["foo","bar","baz"], logic : "and" });
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
			var str = '%' + query.values[i].toString() + '%';
			this.values.push(str);
		}
	}
	
	if( this.values.length > 0 ){
		this.valid = true;
	}
}

module.exports = Constructor;

var Selectby = Constructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public api

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
		var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}} like \'\'?\'\'";
		
		clauses.push(constraint);
		params.push(this.values[i]);
	}
	var connector = ' or ';
	if( this.logic == LOGIC_AND ){
		connector = ' and ';
	}
	clause = clauses.join(connector);
	
	sql = " ( select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}, dblink('dbname={{#Lc_first}}{{segment_joined}}{{/Lc_first}}','select {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_joined}} from {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}} where " + clause + "') as {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}({{primary_key_joined}} int) where {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_joined}}={{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_joined}} ) ";
	
	return {
		"sql"             : sql,
		"params"          : params,
		"parameterizable" : false
	};
};

Selectby.stringify = function(){
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field_joined}}(like):" + this.values.join(",") + "/" + this.logic;
	return str;
};
