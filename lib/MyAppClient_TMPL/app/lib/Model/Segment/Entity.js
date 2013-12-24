
// 
// {{entity}} Model
// 
//     segment : {{segment}}
//     entity  : [{entity}}
// 
// pseudo field:
//     
//     Collection is defined as a pseudo field according to its collecting primarykey.
//     
//     ex) Editor having primary key editorID collectiong Article having primary articleID:
//         Editor.articleIDs will be defined as pseudo field.
// 
// expandable field:
//     
//     Fields linked to the external key are expandable,
//     and the external object is held in a field named as its filed without ID.
//     
//     ex) Editor having companyID as its field:
//         Editor.company will be defined as expanded field.
//     
//     ex) Editor collecting articleID having articleIDs as its pseudo field:
//         Editor articles will be defined as expanded field.
//         In this case, articles is a array of Article object.
// 
// usage:
//     
//     * client side model is a simple barebone object, no persistent method implemented.
//     * this model object is not alloy's model.
//     
//     var EntityModel = require('Model/Segment/Entity');
//     var instance = new EntityModel.getClass();
//     instance.entity.field = new_value;
//     

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

var Container = require('Container');
var Dispatch = require('CentralDispatch');

var ModelSanitizerFactory = require('ModelSanitizer/ModelSanitizerFactory');
var Sanitizer = ModelSanitizerFactory.getSanitizer('{{segment}}/{{entity}}');

var MODEL_NAME = 'Model/{{segment}}/{{entity}}';

// models for aggregation
{{#Align_equals}}{{#Aggregation}}
var {{#Uc_first}}{{aggregation_entityName}}{{/Uc_first}}Model = require('Model/{{aggregation_segmentName}}/{{aggregation_entityName}}');
{{/Aggregation}}
{{/Align_equals}}
{{^Aggregation}}
// (no aggregation)
{{/Aggregation}}

var fieldManifest = [
	'{{primary_key}}',
{{#Fields}}
	'{{fieldName}}'{{^lastOfFieldJoiningField}},{{/lastOfFieldJoiningField}}
{{/Fields}}
{{#Fields_collected}}
	'{{primary_key_collected}}s'{{^lastOfFieldJoiningField}},{{/lastOfFieldJoiningField}} // pseudo field for collection
{{/Fields_collected}}
];

var expandableFields = { {{#Align_dslash}}{{#Align_colon}}
{{#Fields_joining}}
	'{{fieldName}}' : '{{#Lc_first}}{{entity_joined}}{{/Lc_first}}'{{^lastOfJoiningCollectedFields}},{{/lastOfJoiningCollectedFields}} // extkey
{{/Fields_joining}}
{{#Fields_collected}}
	'{{primary_key_collected}}s' : '{{#Cut_trail_id}}{{primary_key_collected}}{{/Cut_trail_id}}s'{{^lastOfJoiningCollectedFields}},{{/lastOfJoiningCollectedFields}} // collection
{{/Fields_collected}}
{{/Align_colon}}{{/Align_dslash}}
{{^Fields_joining}}{{^Fields_collected}}
// (no expandable field)
{{/Fields_collected}}{{/Fields_joining}}
};

var getFields = function(){
	return fieldManifest;
};

var inspectField = function(fieldName){
	if( expandableFields[fieldName] ){
		return expandableFields[fieldName];
	}else{
		return null;
	}
};

var instantiate = function(options){
	var batchtag    = options.batchtag;
	var primaryKeys = options.primaryKeys || options.ids || [];
	var callback    = options.callback || function(){};
	var expand      = options.expand || 0;
	// check pooled instances
	var pooled_instances = [];
	var unpooled_primaryKeys = [];
	for( var i=0; i<primaryKeys.length; i++ ){
		var pooled_instance = Container.getPooledInstance(MODEL_NAME,primaryKeys[i]);
		if( pooled_instance ){
			pooled_instances.push(pooled_instance);
		}else{
			unpooled_primaryKeys.push(primaryKeys[i]);
		}
	}
	primaryKeys = unpooled_primaryKeys;
	if( (pooled_instances.length > 0) && (primaryKeys.length == 0) ){
		// all of requested instances has been pooled
		callback(pooled_instances);
		return;
	}
	// load remote entity
	var app;
	var local_callback = function(result){
		// normalize launch and get return
		if( Array.isArray(result) ){
			// get
			var instances = [];
			for( var i=0; i<result.length; i++ ){
				var instance = new ModelConstructor();
				instance.buildByRemote(result[i]);
				instances.push(instance);
				Container.setPooledInstance(MODEL_NAME,instance.primaryKey,instance); // pool
			}
			instances = instances.concat(pooled_instances); // merge pooled instances
			callback(instances);
		}else{
			// launch
			var instances = [];
			var instance = new ModelConstructor();
			instance.buildByRemote(result[i]);
			instances.push(instance);
			Container.setPooledInstance(MODEL_NAME,instance.primaryKey,instance); // pool
			instances.concat(pooled_instances); // merge pooled instances
			callback(instances);
		}
	};
	if( primaryKeys.length > 0 ){
		var apptag = "{{segment}}/{{entity}}.get";
		var params = { ids:primaryKeys, expand:expand };
		app = {apptag:apptag,params:params,callback:local_callback};
	}else{
		var apptag = "{{segment}}/{{entity}}.launch";
		app = {apptag:apptag,params:{},callback:local_callback};
	}
	if( !batchtag ){
		Dispatch.sync(app);
	}else{
		Dispatch.push(batchtag,app);
	}
};

var search = function(options){
	var batchtag = options.batchtag;
	var callback = options.callback;
	var query    = options.query;
	var apptag = "{{segment}}/{{entity}}.search";
	var app = {apptag:apptag,params:query,callback:callback};
	if( !batchtag ){
		Dispatch.sync(app);
	}else{
		Dispatch.push(batchtag,app);
	}
};

var remove = function(options){
	var batchtag = options.batchtag;
	var callback = options.callback;
	var ids      = options.ids; // array
	
	// remove pooled instances
	for( var i=0; i<ids.length; i++ ){
		Container.delPooledInstance(MODEL_NAME,ids[i]);
	}
	
	// remove remote data
	var apptag = "{{segment}}/{{entity}}.remove";
	var params = { ids:ids };
	var app = {apptag:apptag,params:params,callback:callback};
	if( !batchtag ){
		Dispatch.sync(app);
	}else{
		Dispatch.push(batchtag,app);
	}
	
	// aggregation 
	// remove from jucntion table
{{#Aggregation}}
	// remove remote data : {{aggregation_entityName}} (collection)
	var apptag_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}} = "{{aggregation_segmentName}}/{{aggregation_entityName}}.remove";
	var params_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}} = { ids : ids };
	var app_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}} = {apptag:apptag_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}},params:params_{{#Lc_first}}{{aggregation_entityName}}}{{/Lc_first}};
	if( !batchtag ){
		Dispatch.sync(app_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}});
	}else{
		Dispatch.push(batchtag,app_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}});
	}
{{/Aggregation}}
{{^Aggregation}}
	// (no aggregation)
{{/Aggregation}}
};

// Form/Entity bindings supports
var notify = function(field,value){
	var observers = this.observers[field];
	for( var i=0; i<observers.length; i++ ){
		observer.observeValue({
			name  : MODEL_NAME,
			field : field,
			value : value
		});
	}
};

var requestCommit = function(){
	this.modified = true;
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

function ModelConstructor(){
	this.entity     = {};
	this.fresh      = true;
	this.modified   = false;
	this.primaryKey = null;
	this.listeners  = [];
	this.observers  = {};
}

var Model = ModelConstructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// 
// public data access and mutate api
// 

// (read only) primary key
Model.__defineGetter__('{{primary_key}}', function(){
	return this.entity.{{primary_key}};
});

{{#Fields}}
Model.__defineGetter__('{{fieldName}}', function(){
	return this.entity.{{fieldName}};
});
Model.__defineSetter__('{{fieldName}}', function({{fieldName}}){
	this.entity.{{fieldName}} = Sanitizer.sanitize('{{fieldName}}',{{fieldName}});
	requestCommit.apply(this);
	notify.apply(this,['{{fieldName}}',this.entity.{{fieldName}}]);
});
{{/Fields}}

// aggregation resolvers

{{^Fields_joining}}{{^Fields_collected}}
// (no aggregation)
{{/Fields_collected}}{{/Fields_joining}}
{{#Fields_joining}}
// expander for {{fieldName}}
Model.__defineGetter__('{{#Lc_first}}{{entity_joined}}{{/Lc_first}}', function(){
	return this.entity.{{#Lc_first}}{{entity_joined}}{{/Lc_first}};
});
Model.__defineSetter__('{{#Lc_first}}{{entity_joined}}{{/Lc_first}}', function({{#Lc_first}}{{entity_joined}}{{/Lc_first}}){
	this.entity.{{#Lc_first}}{{entity_joined}}{{/Lc_first}} = {{#Lc_first}}{{entity_joined}}{{/Lc_first}};
	notify.apply(this,['{{#Lc_first}}{{entity_joined}}{{/Lc_first}}',this.entity.{{#Lc_first}}{{entity_joined}}{{/Lc_first}}]);
});
{{/Fields_joining}}

{{#Fields_collected}}
// pseudo field for {{primary_key_collected}} collection
Model.__defineGetter__('{{primary_key_collected}}s', function(){
	return this.entity.{{primary_key_collected}}s;
});
Model.__defineSetter__('{{primary_key_collected}}s', function({{primary_key_collected}}s){
	this.entity.{{primary_key_collected}}s = {{primary_key_collected}}s;
	notify.apply(this,['{{primary_key_collected}}s',this.entity.{{primary_key_collected}}s]);
});

// expander for {{primary_key_collected}}s pseudo field
Model.__defineGetter__('{{#Lc_first}}{{entity_collected}}{{/Lc_first}}s', function(){
	return this.entity.{{#Lc_first}}{{entity_collected}}{{/Lc_first}}s;
});
Model.__defineSetter__('{{#Lc_first}}{{entity_collected}}{{/Lc_first}}s', function({{#Lc_first}}{{entity_collected}}{{/Lc_first}}s){
	this.entity.{{#Lc_first}}{{entity_collected}}{{/Lc_first}}s = {{#Lc_first}}{{entity_collected}}{{/Lc_first}}s;
	notify.apply(this,['{{#Lc_first}}{{entity_collected}}{{/Lc_first}}s',this.entity.{{#Lc_first}}{{entity_collected}}{{/Lc_first}}s]);
});
{{/Fields_collected}}

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

Model.getName = function(){
	return "{{segment}}/{{entity}}"; // SEGMENT/ENTITY (not MODEL_NAME)
};

Model.save = function(options){
	// send entity without extracted field
	var pure_entity = {};
	for( var i=0; i<fieldManifest.length; i++ ){
		var field = fieldManifest[i];
		pure_entity[field] = this.entity[field];
	}
	var batchtag = options.batchtag;
	var callback = options.callback;
	var apptag = "{{segment}}/{{entity}}.register";
	var params = {
		entities : [pure_entity],
		bulk     : true,
	};
	var app = {apptag:apptag,params:params,callback:callback};
	if( !batchtag ){
		Dispatch.sync(app);
	}else{
		Dispatch.push(batchtag,app);
	}
	
	// aggregation
	// saving junction table
{{#Aggregation}}
	// save {{aggregation_entityName}} (collection)
	var apptag_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}} = "{{aggregation_segmentName}}/{{aggregation_entityName}}.register";
	var params_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}} = [{
		{{primary_key}}  : this.primaryKey,
		collection : this.entity.{{primary_key_collected}}s,
	}];
	var app_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}} = {apptag:apptag_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}},params:params_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}}};
	if( !batchtag ){
		Dispatch.sync(app_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}});
	}else{
		Dispatch.push(batchtag,app_{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}});
	}
{{/Aggregation}}
{{^Aggregation}}
	// (no aggregation)
{{/Aggregation}}
};

// Form/Entity bindings supports
Model.addObserver = function(observer,field){
	var observers = this.observers[field];
	if( observers ){
		observers.push(observer);
	}else{
		observers = [];
		observers.push(observer);
		this.observers[field] = observers;
	}
};
Model.removeObserver = function(observer,field){
	var observers = this.observers[field];
	if( observers ){
		var index = observers.indexOf(observer);
		if( index > 0 ){
			observers.splice(index,1);
		}
	}
};
Model.observeValue = function(obj){
	var field = obj.field;
	// set field value
	this.entity[field] = obj.value;
	// set aggregation pseudo field
	var expandedField = inspectField(field);
	if( expandedField ){
		this.entity[expandedField] = obj.model;
	}
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

Model.buildByRemote = function(obj){
	this.entity     = obj.entity;
	this.fresh      = obj.fresh;
	this.modified   = obj.modified;
	this.primaryKey = obj.primaryKey;
	
	// aggregation
	// resolve remote expanded collection
	// this is assumed as a filed of this model by EditForm
{{#Aggregation}}
	if( this.entity.{{#Lc_first}}{{entity_collected}}{{/Lc_first}}s ){
		this.{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}} = new {{aggregation_entityName}}Model.getClass();
		this.{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}}.buildByRemote(this.entity.{{#Lc_first}}{{entity_collected}}{{/Lc_first}}s);
	}else{
		this.{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}} = new {{aggregation_entityName}}Model.getClass();
		this.{{#Lc_first}}{{aggregation_entityName}}{{/Lc_first}}.primaryKey = this.primaryKey;
	}
{{/Aggregation}}
{{^Aggregation}}
	// (no aggregation)
{{/Aggregation}}
	
	return this;
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

module.exports = {
	getClass     : ModelConstructor, // provide constructor
	instantiate  : instantiate,      // bulk instantiation
	search       : search,           // search entity (with batchtag and callback)
	remove       : remove,           // bulk remove (with batchtag and callback)
	getFields    : getFields,        // provide field manifest
	inspectField : inspectField,     // check the field expandability
};

