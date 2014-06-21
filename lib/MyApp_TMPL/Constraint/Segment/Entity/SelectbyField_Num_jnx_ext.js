
// Selectby{{#Uc_first}}{{field_jnx}}{{/Uc_first}}Num
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
//     var selector = new Selectby({ values:[{min:NUM,max:NUM},{min:NUM,max:NUM}], logic:"or" });
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
			var value = query.values[i];
			var min = value.min;
			var max = value.max;
			
			if( max ){
				var num = new Number(max);
				max = num.valueOf();
			}else{
				max = null;
			}
			if( min ){
				var num = new Number(min);
				min = num.valueOf();
			}else{
				min = null;
			}
			
			if( !min && !max ){ continue; }
			
			if( max && min ){
				if( max < min ){
					var tmp = max;
					max = min;
					min = tmp;
				}
			}
			
			this.values.push({ 'min':min,'max':max });
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
		var min = this.values[i].min;
		var max = this.values[i].max;
		
		// 
		// * dblink query cannon be parameterized, the param should be escaped by escapeStringConn
		// 
		if( max && min ){
			// between min and max
			var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}.{{field_jnx}} between \'\'?\'\' and \'\'?\'\'";
			clauses.push(constraint);
			params.push(min);
			params.push(max);
		}
		else if( max && !min ){
			// less than max
			var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}.{{field_jnx}} < \'\'?\'\'";
			clauses.push(constraint);
			params.push(max);
		}
		else if( !max && min ){
			// greater than min
			var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}.{{field_jnx}} > \'\'?\'\'";
			clauses.push(constraint);
			params.push(min);
		}
	}
	var connector = ' or ';
	if( this.logic == LOGIC_AND ){
		connector = ' and ';
	}
	clause = clauses.join(connector);
	
	var limiter = '';
	if( this.limit > 0 ){ limiter = " limit " + this.limit; }
	
	sql = " ( select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}},{{#Escape_reserved}}{{#Lc_first}}{{junction}}{{/Lc_first}}{{/Escape_reserved}}, dblink('dbname={{#Lc_first}}{{segment_jnx}}{{/Lc_first}}','select {{primary_key_joined}} from {{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}} where " + clause + limiter + "') as {{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}({{primary_key_joined}} int) where {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}}={{#Escape_reserved}}{{#Lc_first}}{{junction}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} and {{#Escape_reserved}}{{#Lc_first}}{{junction}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_joined}}={{#Escape_reserved}}{{#Lc_first}}{{entity_jnx}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key_joined}} group by {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} ) ";
	
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
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field}}(num):" + strs.join("/");
	return str;
};

