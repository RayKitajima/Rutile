
// {{entity}} basic logic (collection)

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

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// 
// methods
// 

// context is jsee logic context

// no search method for collection

// context tag : "{{segment}}/{{entity}}.launch"
var launch = function(context,app){
	var tag = methods.launch.tag;
	context.response.push({ apptag:tag, result:new {{entity}}Model.getClass(), serial:app.serial });
};

// context tag : "{{segment}}/{{entity}}.get"
var get = function(app){
	var tag = methods.get.tag;
	var ids = app.params; // pick up responsible ids
	var instances = [];
	for( var i=0, len=ids.length; i<len; i++ ){
		instances.push( {{entity}}Model.instance(ids[i]) );
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
var register = function(context,app){
	var tag = methods.register.tag;
	var {{#Lc_first}}{{entity}}{{/Lc_first}}s = app.params; // pick up responsible objects
	var results = [];
	for( var i=0, len={{#Lc_first}}{{entity}}{{/Lc_first}}s.length; i<len; i++ ){
		var {{#Lc_first}}{{entity}}{{/Lc_first}} = {{#Lc_first}}{{entity}}{{/Lc_first}}s[i];
		var target = {{entity}}Model.instance({{#Lc_first}}{{entity}}{{/Lc_first}}.{{collectorID}});
		if( {{#Lc_first}}{{entity}}{{/Lc_first}}.collection ){ 
			target.collection = {{#Lc_first}}{{entity}}{{/Lc_first}}.collection;
			if( !target.valid("collection") ){
				results.push({ target:target, exception:"invalid collection" });
				continue;
				//console.log(tag+':'+"invalid collection");
				//throw(tag+':'+"invalid collection");
			}
		}
		if( target.valid() ){
			target.save();
			results.push({ target:target.primaryKey });
		}else{
			results.push({ target:target, exception:"unexpected validation error" });
			//throw(tag+"unexpected validation error");
		}
	}
	context.response.push({ apptag:tag, result:results, serial:app.serial });
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

var methods = {
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

