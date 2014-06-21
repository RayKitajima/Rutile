
// Selectby{{#Uc_first}}{{field}}{{/Uc_first}}Date
// 
// segment : {{segment}}
// entity  : {{entity}}
// field   : {{field}}
// type    : {{search_type}}
// 

// usage:
//     
//     var Selectby = require('Constraint/SEGMENT/ENTITY/SelectbyField');
//     var selector = new Selectby({ values:[{from:"ISO8601",to:"ISO8601"},{from:"ISO8601",to:"ISO8601"}], logic:"or" });
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
			var from  = value.from;
			var to    = value.to;
			
			var date_from;
			var date_to;
			
			if( from ){
				date_from = new Date(from);
				from = date_from.toDateString();
				if( from === 'Invalid Date' ){
					from = null;
				}
			}else{
				from = null;
			}
			if( to ){
				date_to = new Date(to);
				to = date_to.toDateString();
				if( to === 'Invalid Date' ){
					to = null;
				}
			}else{
				to = null;
			}
			
			if( !from && !to ){ continue; }
			
			if( from && to ){
				if( date_from > date_to ){
					var tmp = to;
					to = from;
					from = tmp;
				}
			}
			
			this.values.push({ 'from':from,'to':to });
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
		var from = this.values[i].from;
		var to   = this.values[i].to;
		
		if( !from && to ){
			// less than to
			var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{field}} <= ?";
			clauses.push(constraint);
			params.push(to);
		}
		else if( from && !to ){
			// greater than from
			var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{field}} >= ?";
			clauses.push(constraint);
			params.push(from);
		}
		else{
			// between from and to
			var constraint = "{{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{field}} between ? and ?";
			clauses.push(constraint);
			params.push(from);
			params.push(to);
		}
	}
	var connector = ' or ';
	if( this.logic == LOGIC_AND ){
		connector = ' and ';
	}
	clause = clauses.join(connector);
	
	var limiter = '';
	if( this.limit > 0 ){ limiter = " limit " + this.limit; }
	
	sql = " ( select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where " + clause + limiter + " ) ";
	
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
		var from = this.values[i].from;
		var to   = this.values[i].to;
		if( from ){ item.push("from:"+from); }
		if( to   ){ item.push("to:"+to);     }
		var str = item.join(",");
		strs.push(str);
	}
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.{{field}}(date):" + strs.join("/");
	return str;
};


