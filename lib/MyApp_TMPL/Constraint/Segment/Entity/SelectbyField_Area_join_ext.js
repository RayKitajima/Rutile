
// postgis geography field

// Selectby{{#Uc_first}}{{field}}{{/Uc_first}}Nearby
// 
// segment : {{segment}}
// entity  : {{entity}}
// field   : {{field}}
// type    : {{search_type}}
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
//     var selector = new Selectby({ values:[{area:'POLYGON((LON_lefttop LAT_lefttop, LON_righttop LAT_righttop, LON_rightbottom LAT_rightbottom, LON_leftbottom LAT_leftbottom, LON_lefttop LAT_lefttop))'}], logic:"or" });
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
			var value   = query.values[i];
			var polygon = value.polygon;
			
			if( polygon ){
				// requires at least four points
				if( !polygon.match(/POLYGON\(\((\d+\.*\d* \d+\.*\d*[,\s]*)(\d+\.*\d* \d+\.*\d*[,\s]*)(\d+\.*\d* \d+\.*\d*[,\s]*)(\d+\.*\d* \d+\.*\d*[,\s]*).*\)\)/) ){
					polygon  = null;
				}
			}
			
			if( !polygon ){ continue; }
			
			this.values.push({ 'polygon':polygon });
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
		var polygon = this.values[i].polygon;
		
		// 
		// * dblink query cannon be parameterized, the param should be escaped by escapeStringConn
		// 
		var constraint = "ST_Intersects( {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}}, ST_GeometryFromText(\'\'?\'\') )";
		
		clauses.push(constraint);
		params.push(polygon);
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
	var strs = [];
	for( var i=0; i<this.values.length; i++ ){
		var item = [];
		var min = this.values[i].min;
		var max = this.values[i].min;
		if( min ){ item.push("min:"+min); }
		if( max ){ item.push("max:"+max); }
		var str = item.join(",");
		strs.push(str);
	}
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field}}(area):" + strs.join("/");
	return str;
};

