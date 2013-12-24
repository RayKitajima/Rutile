
// 
// !!!!! CAUTION !!!!!
// 
// * Usually collection(junction) should be managed by base model, with using instance expanding.
//   So you dont need this module.
// 
// 
// 
// Collection : {{entity}} Model
// 
//     segment : {{segment}}
//     entity  : {{entity}}
// 
// usage:
//     
//     * client side model is simple barebone object, no persistent method implemented.
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

var fieldManifest = [
	'collection'
];

var expandableFields = {};

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
	var apptag = "{{segment}}/{{entity}}.remove";
	var params = { ids:ids };
	var app = {apptag:apptag,params:params,callback:callback};
	if( !batchtag ){
		Dispatch.sync(app);
	}else{
		Dispatch.push(batchtag,app);
	}
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
	this.observers  = {};
}

var Model = ModelConstructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// 
// public data access and mutate api
// 

// (read only) primary key
Model.__defineGetter__('{{collector_primary_key}}', function(){
	return this.entity.{{collector_primary_key}};
});

Model.__defineGetter__('collection', function(){
	return Object.keys(this.entity.collection);
});

Model.__defineSetter__('collection', function(collection){
	this.entity.collection = {};
	collection.map(
		function({{collected_primary_key}}){
			var safe_{{collected_primary_key}} = Sanitizer.sanitize('{{collected_primary_key}}',{{collected_primary_key}});
			if( safe_{{collected_primary_key}} ){
				this.entity.collection[safe_{{collected_primary_key}}]=1;
			}
		}
	);
	requestCommit.apply(this);
	notify.apply(this,['collection',Object.keys(this.entity.collection)]);
});

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

Model.getName = function(){
	return "{{segment}}/{{entity}}"; // SEGMENT/ENTITY (not MODEL_NAME)
};

Model.save = function(options){
	var batchtag = options.batchtag;
	var callback = options.callback;
	var apptag = "{{segment}}/{{entity}}.register";
	var params = {
		entities : [this.entity],
		bulk     : true,
	};
	var app = {apptag:apptag,params:params,callback:callback};
	if( !batchtag ){
		Dispatch.sync(app);
	}else{
		Dispatch.push(batchtag,app);
	}
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

