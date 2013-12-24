
// Selectby{{#Uc_first}}{{field_joined}}{{/Uc_first}}Num
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

		if( max && min ){
			// between min and max
			var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}} between ? and ?";
			clauses.push(constraint);
			params.push(min);
			params.push(max);
		}
		else if( max && !min ){
			// less than max
			var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}} < ?";
			clauses.push(constraint);
			params.push(max);
		}
		else if( !max && min ){
			// greater than min
			var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field_joined}} > ?";
			clauses.push(constraint);
			params.push(min);
		}
	}
	var connector = ' or ';
	if( this.logic == LOGIC_AND ){
		connector = ' and ';
	}
	clause = clauses.join(connector);
	
	sql = " ( select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}},{{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}} where {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{field}} = {{#Escape_reserved}}{{#Lc_first}}{{entity_joined}}{{/Lc_first}}{{/Escape_reserved}}.{{field}} and " + clause + " ) ";
	
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
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field}}(num):" + strs.join("/");
	return str;
};

