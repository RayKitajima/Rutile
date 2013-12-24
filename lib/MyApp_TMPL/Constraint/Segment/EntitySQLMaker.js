
// {{entity}}SQLMaker

// usage:
//     
//     * search logic
// 
//         (request)
//         
//         context.request = {
//             "SegmentA/EntityA.search" : {
//                 constraint : {
//                     entity.fieldA(key) : { values : [valueA,valueB], logic : 'OR' },
//                     entity.fieldB(num) : { min : min_value, max : max_value }
//                 },
//                 logic : 'AND',
//                 orderby : {
//                     field : 'desc', // | asc
//                 },
//                 scope : {
//                     constraint : {
//                         entity.fieldC(key) : { values : [shouldbe1,shouldbe2], logic : 'AND' }
//                     },
//                     logic : 'AND'
//                 }
//             },
//             "SegmentB/EntityB.search" : {
//                 constraint : {
//                     entity.fieldA(key)       : { values : [valueA] },
//                     entity.fieldC(timestamp) : { from : 'ISO8601' to : 'ISO8601' }
//                 }
//             }
//         };
//         
//         (response)
//         
//         context.response = {
//             "Segment/EntityA.search" : [
//                 instance1, instance2,
//             ],
//             "Segment/EntityB.search" : [
//                 instance1, instance2, 
//             ]
//         };
//         
// idiom:
//     
//     var EntitySQLMaker = require('Segment/EntitySQLMaker');
//     var entity_sqlmaker = new EntitySQLMaker();
//     
//     entity_sqlmaker.setup({
//         constarint : {
//             entityID(key)    : { values : [53243,34948], logic : 'OR' },
//             entityName(like) : { values : ["Apple","Orange"], logic : 'AND' },
//             numbers(num)     : { min : 100, max : 200 },
//         },
//         logic : 'AND',
//         orderby : {
//             numbers : 'desc'
//         }
//     });
//     
//     var constraint = entity_sqlmaker.makeConstraint();
//     var sql = constraint.sql;
//     var params = constraint.params;
//     
// 

var {{APP_NAME}}Impl = require('{{APP_NAME}}Impl');
var SelectbyImplFactory = {{APP_NAME}}Impl.getSelectbyImplFactory();
var OrderbyImplFactory = {{APP_NAME}}Impl.getOrderbyImplFactory();

// static variables

var UNION     = ' union ';
var INTERSECT = ' intersect ';

// manifest

var Manifest = require('./{{entity}}Manifest');
var SelectbyManifest = Manifest["selectby"];
var OrderbyManifest  = Manifest["orderby"];

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// selectby modules

var selectby_modules = {};

var getSelectbyModule = function(entity_field_type){
	if( selectby_modules[entity_field_type] ){
		return selectby_modules[entity_field_type];
	}
	var impl = SelectbyImplFactory.getImplementation('{{segment}}/{{entity}}',entity_field_type);
	if( impl ){
		selectby_modules[entity_field_type] = impl;
		return impl;
	}
	var module = SelectbyManifest[entity_field_type];
	if( module ){
		selectby_modules[entity_field_type] = require(module);
		return selectby_modules[entity_field_type];
	}else{
		return false;
	}
};

// orderby modules

var orderby_modules = {};

var getOrderbyModule = function(field){
	if( orderby_modules[field] ){
		return orderby_modules[field];
	}
	var impl = OrderbyImplFactory.getImplementation('{{segment}}/{{entity}}',field);
	if( impl ){
		orderby_modules[field] = impl;
		return impl;
	}
	var module = OrderbyManifest[field];
	if( module ){
		orderby_modules[field] = require(module);
		return orderby_modules[field];
	}else{
		return false;
	}
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function Constructor(){
	this.user_constraints  = [];
	this.orderbys          = [];
	this.scope_constraints = [];
	this.user_logic        = '';
	this.scope_logic       = '';
	this.parameterizable   = true;
}

module.exports = Constructor;

var SQLMaker = Constructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

SQLMaker.setup = function(query)
{
	// selectby
	if( query.constraint ){
		var raw_constraints = Object.keys(query.constraint);
		for( var i=0; i<raw_constraints.length; i++ ){
			var entity_field_type = raw_constraints[i];
			var SelectbyModule = getSelectbyModule(entity_field_type);
			var selectby = new SelectbyModule(query.constraint[entity_field_type]);
			if( selectby.responsible() ){
				this.user_constraints.push(selectby);
			}
		}
	}
	
	// user constraint logic
	if( query.logic && query.logic.toLowerCase() == 'or' ){
		this.user_logic = UNION;
	}else{
		this.user_logic = INTERSECT;
	}
	
	// orderby
	if( query.orderby ){
		var raw_orderbys = Object.keys(query.orderby);
		for( var i=0; i<raw_orderbys.length; i++ ){
			var field = raw_orderbys[i];
			var OrderbyModule = getOrderbyModule(field);
			var orderby = new OrderbyModule(query.orderby[field]);
			if( orderby.responsible() ){
				this.orderbys.push(orderby);
			}
		}
	}
	
	// scope
	if( query.scope ){
		var scopes = Object.keys(query.scope.constraint);
		for( var i=0; i<scopes.length; i++ ){
			var field = scopes[i];
			var SelectbyModule = getSelectbyModule(entity_field_type);
			var selectby = new SelectbyModule(query.scope[entity_field_type]);
			if( selectby.responsible() ){
				this.scope_constraints.push(selectby);
			}
		}
		// scope constraint logic
		if( query.scope.logic && query.scope.logic.toLowerCase() == 'or' ){
			this.scope_logic = UNION;
		}else{
			this.scope_logic = INTERSECT;
		}
	}
	
	// select all, without any constraint
	if( (this.user_constraints.length == 0) && (this.scope_constraints.length == 0) ){
		var SelectAllModule = getSelectbyModule("selectAll");
		var selectall = new SelectAllModule();
		this.user_constraints.push(selectall);
	}
};

SQLMaker.makeConstraint = function()
{
	// user query
	var user_query_sqls = [];
	var user_query_params = [];
	for( var i=0; i<this.user_constraints.length; i++ ){
		var user_constraint = this.user_constraints[i];
		var constraint = user_constraint.makeConstraint();
		var sql = constraint.sql;
		var params = constraint.params;
		user_query_sqls.push(sql);
		if( params.length > 0 ){
			for( var j=0; j<params.length; j++ ){
				user_query_params.push(params[j]);
			}
		}
		if( !constraint.parameterizable ){ this.parameterizable = false; }
	}
	var user_query_sql = user_query_sqls.join(this.user_logic);
	
	// scope query
	var scope_query_sqls = [];
	var scope_query_params = [];
	for( var i=0; i<this.scope_constraints.length; i++ ){
		var scope_constraint = this.scope_constraints[i];
		var constraint = scope_constraint.makeConstraint();
		var sql = constraint.sql;
		var params = constraint.params;
		scope_query_sqls.push(sql);
		if( params.length > 0 ){
			for( var j=0; j<params.length; j++ ){
				scope_query_params.push(params[j]);
			}
		}
		if( !constraint.parameterizable ){ this.parameterizable = false; }
	}
	var scope_query_sql = scope_query_sqls.join(this.scope_logic);
	
	// make sql and params
	var sql = '';
	var params = [];
	
	if( scope_query_sql && user_query_sql ){
		sql = "( ( " + scope_query_sql + " ) INTERSECT ( " + user_query_sql + " ) )"; // scope represent INTERSECT
		if( scope_query_params.length > 0 ){
			for( var i=0; i<scope_query_params.length; i++ ){
				params.push(scope_query_params[i]);
			}
		}
		if( user_query_params.length > 0 ){
			for( var i=0; i<user_query_params.length; i++ ){
				params.push(user_query_params[i]);
			}
		}
	}
	else if( !scope_query_sql && user_query_sql ){
		sql = "( " + user_query_sql + " )";
		if( user_query_params.length > 0 ){
			for( var i=0; i<user_query_params.length; i++ ){
				params.push(user_query_params[i]);
			}
		}
	}
	
	// orderby
	for( var i=0; i<this.orderbys.length; i++ ){
		sql = this.orderbys[i].wrap(sql);
	}
	
	// convert place holders for libpq
	var holder_pattern = /\?/g;
	var result = [];
	var first = 0;
	var last = 0;
	var pqsql = '';
	var i = 1;
	while( (result = holder_pattern.exec(sql)) != null ){
		var holder = '$' + i;
		last = result.index;
		pqsql += sql.substring(first,last);
		pqsql += holder;
		first = result.index+1;
		i++;
	}
	pqsql += sql.substring(first,sql.length);
	
	return { "sql" : pqsql, "params" : params, "parameterizable" : this.parameterizable };
};

SQLMaker.stringify = function()
{
	// user query
	var user_query_strs = [];
	var user_constriant_keys = Object.keys(this.user_constraints).sort();
	for( var i=0; i<user_constriant_keys.length; i++ ){
		var key = user_constriant_keys[i];
		var module = this.user_constraints[key];
		user_query_strs.push( module.stringify() );
	}
	var user_query_str = user_query_sqls.join(',');
	
	// orderby
	var orderby_strs = [];
	var orderby_keys = Object.keys(this.orderbys).sort();
	for( var i=0; i<orderby_keys.length; i++ ){
		var key = orderby_keys[i];
		var module = this.orderbys[key];
		orderby_strs.push( module.stringify() );
	}
	var orderby_str = user_query_sqls.join(',');
	
	// scope
	var scope_strs = [];
	var scope_constriant_keys = Object.keys(this.scope_constraints).sort();
	for( var i=0; i<scope_constriant_keys.length; i++ ){
		var key = scope_constriant_keys[i];
		var module = this.scope_constraints[key];
		scope_strs.push( module.stringify() );
	}
	var scope_str = scope_strs.join(',');
	
	return (user_query_str,orderby_str,scope_str).join();
};

