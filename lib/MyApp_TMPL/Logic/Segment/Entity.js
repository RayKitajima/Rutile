
// {{segment}}/{{entity}} basic logic

// json request and response:
//     
//     all logics will be triggered by appropriate json objects. (usually defined as 'app' varialbe in this system.)
//     calling multiple logics by array is invoked in the same transaction.
//     
//     * search
//     
//         (request)
//         
//         context.request = [
//             {
//                 apptag : "SegmentA/EntityA.search",
//                 params : {
//                     constraint : {
//                         entityA.fieldA(key) : { values : [valueA,valueB], logic : 'OR' },
//                         entityA.fieldB(num) : { min : min_value, max : max_value }
//                     },
//                     logic : 'AND',
//                     orderby : {
//                         field : 'desc', // | asc
//                     }
//                 },
//             },
//             {
//                 apptag : "SegmentB/EntityB.search",
//                 params : {
//                     constraint : {
//                         entityA.propertyA(key) : { values : [valueA] },
//                         entityC.propertyB(key) : valueB, // aggregation
//                     }
//                 }
//             }
//         ];
//         
//         (response)
//         
//         context.response = [
//             {
//                 apptag : "Segment/EntityA.search",
//                 params : [
//                     instance1, instance2,
//                 ],
//             },
//             {
//                 apptag : "Segment/EntityB.search",
//                 params : [
//                     instance1, instance2, 
//                 ]
//             }
//         ];
//     
//     * get
//         
//         (request)
//         
//         context.request = [
//             {
//                 apptag : "Segment/EntityA.get",
//                 params : [
//                     entityID_1, entityID_2,
//                 ],
//             },
//             {
//                 apptag : "Segment/EntityB.get",
//                 params : [
//                     entityID,
//                 ],
//             }
//         ];
//         
//         (response)
//         
//         context.response = [
//             {
//                 apptag : "Segment/EntityA.get",
//                 params : [
//                     instance1, instance2, 
//                 ],
//             },
//             {
//                 apptag : "Segment/EntityB.get",
//                 params : [
//                     instance
//                 ],
//             }
//         ];
//         
//     * registration:
//         
//         (request)
//         
//         context.requests = [
//             {
//                 apptag : "Segment/EntityA.register",
//                 params : [
//                     {
//                         entityA_ID : id,
//                         property   : value,
//                            :
//                     },
//                     {
//                         entityA_ID : id,
//                         property   : value,
//                            :
//                     },
//                 ],
//             },
//             {
//                 apptag : "Segment/EntityB.register",
//                 params : [
//                     {
//                         entityB_ID : id,
//                         property   : value,
//                            :
//                     },
//                 ],
//             }
//         ];
//         
//         (response)
//         
//         context.response = [
//             { apptag:"Segment/EntityA.register", result:registered_instanceA },
//             { apptag:"Segment/EntityB.register", result:registered_instanceB },
//         ];
//         
// usage:
//     
//     var tx = container.getTransaction();
//     tx.begin();
//     
//     var LogicFactory = MyApp.getLogicFactory();
//     var method = LogicFactory.getLogic('Segment/Entity.method');
//     method(context);
//     
//     tx.commit();
//     

// static variables

var {{APP_NAME}} = require('{{APP_NAME}}');
var ModelFactory = {{APP_NAME}}.getModelFactory();
var {{entity}}Model = ModelFactory.getModel('{{segment}}/{{entity}}');

// you should add a path to the {{APP_NAME}}Config into your NODE_PATH
var config = require('{{APP_NAME}}Config');

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// 
// methods
// 

// context is jsee logic context

// context tag : "{{segment}}/{{entity}}.search"
var search = function(context,app){
	var tag = methods.search.tag;
	var query = app.params; // pick up responsible query
	var instances = {{entity}}Model.search(query);
	if( query.expand ){
		var level = query.expand <= config.MaxExpandLevel ? query.expand : config.MaxExpandLevel;
		instances.map( function(instance){ instance.expand(level); } );
	}
	context.response.push({ apptag:tag, result:instances, serial:app.serial });
};

// context tag : "{{segment}}/{{entity}}.launch"
var launch = function(context,app){
	var tag = methods.launch.tag;
	context.response.push({ apptag:tag, result:new {{entity}}Model.getClass(), serial:app.serial });
};

// context tag : "{{segment}}/{{entity}}.get"
var get = function(context,app){
	var tag = methods.get.tag;
	var ids = app.params.ids; // pick up responsible ids
	var instances = [];
	for( var i=0, len=ids.length; i<len; i++ ){
		instances.push( {{entity}}Model.instance(ids[i]) );
	}
	if( app.params.expand ){
		var level = app.params.expand <= config.MaxExpandLevel ? app.params.expand : config.MaxExpandLevel;
		instances.map( function(instance){ instance.expand(level); } );
	}
	context.response.push({ apptag:tag, result:instances, serial:app.serial });
};

// context tag : "{{segment}}/{{entity}}.remove"
var remove = function(context,app){
	var tag = methods.remove.tag;
	var ids = app.params.ids; // pick up responsible ids
	for( var i=0, len=ids.length; i<len; i++ ){
		var instance = {{entity}}Model.instance(ids[i]);
		instance.remove(); // db
		instance.remove_cache(); // cache
	}
	context.response.push({ apptag:tag, result:ids, serial:app.serial });
};

// context tag : "{{segment}}/{{entity}}.register"
// 
// valid() will call appropriate field validation method.
// it prioritize {{APP_NAME}}Impl/ModelValidator/{{segment}}/{{entity}}.fieldValidator() if defined.
// 
// if you define bulk flag, you should define all fields,
// therefore, undefined field that is not allowed to be empty causes exception.
// 
var register = function(context,app){
	var tag = methods.register.tag;
	var {{#Lc_first}}{{entity}}{{/Lc_first}}s = app.params.entities; // pick up responsible objects
	var bulk = app.params.bulk; // save entire entity or individual fields
	var results = [];
	for( var i=0, len={{#Lc_first}}{{entity}}{{/Lc_first}}s.length; i<len; i++ ){
		var {{#Lc_first}}{{entity}}{{/Lc_first}} = {{#Lc_first}}{{entity}}{{/Lc_first}}s[i];
		var target = {{entity}}Model.instance({{#Lc_first}}{{entity}}{{/Lc_first}}.{{primary_key}});
{{#Fields}}
		if( {{#Lc_first}}{{entity}}{{/Lc_first}}.{{field}} ){ 
			target.{{field}} = {{#Lc_first}}{{entity}}{{/Lc_first}}.{{field}};
			if( !target.valid("{{field}}") ){
				results.push({ target:target, exception:"invalid:{{field}}" });
				continue;
				//console.log(tag+':'+"invalid : {{field}}");
				//throw(tag+':'+"invalid : {{field}}");
			}
		}else{
			if( bulk ){ {{#notNull}}
				// notNull field, null not allowed
				results.push({ target:target, exception:"null:{{field}}" });
				continue;
				//console.log(tag+':'+"invalid : {{field}}");
				//throw(tag+':'+"invalid : {{field}}"); {{/notNull}}{{^notNull}}
				// nullable field, make it null
				target.{{field}} = null;
				if( !target.valid("{{field}}") ){ // double check
					results.push({ target:target, exception:"invalid:{{field}}" });
					continue;
					//console.log(tag+':'+"invalid : {{field}}");
					//throw(tag+':'+"invalid : {{field}}");
				}{{/notNull}}
			} 
		}
{{/Fields}}
		if( target.valid() ){
			target.save();
			results.push({ target:target.primaryKey });
		}else{
			results.push({ target:target.primaryKey, exception:"unexpected validation error" });
			//throw(tag+"unexpected validation error");
		}
	}
	context.response.push({ apptag:tag, result:results, serial:app.serial });
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

var methods = {
	search   : { method:search,   tag:"{{segment}}/{{entity}}.search"   },
	launch   : { method:launch,   tag:"{{segment}}/{{entity}}.launch"   },
	get      : { method:get,      tag:"{{segment}}/{{entity}}.get"      },
	remove   : { method:remove,   tag:"{{segment}}/{{entity}}.remove"   },
	register : { method:register, tag:"{{segment}}/{{entity}}.register" },
};

var getMethod = function(name){
	return methods[name].method;
};

module.exports = {
	getMethod : getMethod
};

