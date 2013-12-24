
// postgis geography field

// Selectby{{#Uc_first}}{{field}}{{/Uc_first}}Nearby
// 
// segment : {{segment}}
// entity  : {{entity}}
// field   : {{field}}
// type    : {{search_type}}
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
		
		var constraint = "ST_Intersects( {{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}.{{field_jnx}}, ST_GeometryFromText(?) )";
		clauses.push(constraint);
		params.push(polygon);
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

