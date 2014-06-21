
// 
// {{entity}} Model
// 
//     segment : {{segment}}
//     entity  : {{entity}}
// 

// 
// idioms for enduser:
// 
//     var MyApp = require('MyApp');
//     
//     // usual case
//     var Model = MyApp.model('Segment/Model');
//     var instance = Model.instance(id);
//     
//     // explicitly with new, but...
//     // THIS  IS NOT SUPPORTED BY INSTENCE POOLING
//     // USE Model.instance(id) to instantiate by id.
//     var instance = new Model.getClass(id); 
//     
//     // or,
//     var Model = MyApp.model('Segment/Model').getClass();
//     var instance = new Model(id);
//     
//     // or,
//     var instance = new MyApp.model('Segment/Model').getClass(id);
//     
//     // persistent
//     instance.save();
//     instance.save_cache();
//     
//     // etc,
//     var instance = Model.restore(instance.json());
//     
// validation:
//     
//     if( instance.valid() ){
//         instance.save();
//     }else{
//         throw("invalid instance");
//     }
//     
//     if( instance.valid(field) ){
//         console.log("field is valid");
//     }
//     
//     * field nullability is checked by Validator
//     
// serach:
//     
//     var query = { segment/entity.propertyA:VALUE, segment/entity.propertyB:VALUE };
//     
//     var instances = Model.search(query);
//     for( var i=0; i<instances.length; i++ ){
//         var instance = instances[i];
//     }
//     
//     var ids = Model.ids(query);
//     for( var i=0; i<ids.length; i++ ){
//         var instance = Model.instance(i);
//     }
//     
// usage for framework:
//     
//     var ModelFactory = require('Model/ModelFactory');
//     var Model = ModelFactory.getModel('Segment/Model');
//     
//     // or, directly
//     var Model = require('/Model/Segment/Entity');
//     
//     // empty new
//     var instance = new Model.getClass();
//     var id = instance.entityID; // automatically published when empty new
//     
//     // get new id
//     var id = Model.publishID();
//     
//     // get new instance for the id
//     var instance = new Model.getClass(id);
//     
//     // or, instantiate by static method
//     var instance = Model.instance(id);
//     
//     // ignore cache (directly from db)
//     var instance = Model.instance(id,{ignoreCache:1});
//     
//     // restore from json elsewhere serialized
//     // the json should be made by instance.json().
//     // no over write for fresh and id property
//     instance.restore(json);
// 
// accessing entity field:
//     
//     if you modify property of the entity, transaction will be managed automatically.
//     
// 

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// static vriables

// cache identifyer prefix
var MODEL_NAME = 'Model/{{segment}}/{{entity}}';

// {{APP_NAME}}
var {{APP_NAME}} = require('{{APP_NAME}}');

// Utils
var Utils = {{APP_NAME}}.getUtils();

// model factory
var ModelFactory = {{APP_NAME}}.getModelFactory();

// singleton instance of the Container for this segment
var ContainerFactory = {{APP_NAME}}.getContainerFactory();
var container = ContainerFactory.getContainer('{{segment}}'); 

// sqlmaker module for this model
var ConstraintFactory = {{APP_NAME}}.getConstraintFactory();
var SQLMaker = ConstraintFactory.getSQLMaker('{{segment}}/{{entity}}');

// sanitizer
var ModelSanitizerFactory = {{APP_NAME}}.getModelSanitizerFactory();
var Sanitizer = ModelSanitizerFactory.getSanitizer('{{segment}}/{{entity}}');

// validator
var ModelValidatorFactory = {{APP_NAME}}.getModelValidatorFactory();
var Validator = ModelValidatorFactory.getValidator('{{segment}}/{{entity}}');

// field manifest (also used as case convert tool)
// lower case : original definition
var FieldManifest = { {{#Align_colon}}
	"{{#Lc_all}}{{primary_key}}{{/Lc_all}}" : "{{primary_key}}",
{{#Fields}}
	"{{#Lc_all}}{{field}}{{/Lc_all}}" : "{{field}}"{{^last}},{{/last}}
{{/Fields}}
{{/Align_colon}}
};
var normalizeField = function(raw_results){
	return Utils.normalizeField(FieldManifest,raw_results);
};

// models for aggregation
{{#Align_equals}}{{#Aggregation}}
{{#aggregation_entityName}}
var {{#Uc_first}}{{aggregation_entityName}}{{/Uc_first}}Model = ModelFactory.getModel('{{aggregation_segmentName}}/{{aggregation_entityName}}');
{{/aggregation_entityName}}
var {{#Uc_first}}{{aggregated_entityName}}{{/Uc_first}}Model = ModelFactory.getModel('{{aggregated_segmentName}}/{{aggregated_entityName}}');
{{/Aggregation}}
{{/Align_equals}}
{{^Aggregation}}
// no aggregation
{{/Aggregation}}

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// static services
// you should call these method by 'apply' when using from instance(,prototype) method.

// 
// search service
// 

var search = function(query){
	var maker = new SQLMaker();
	maker.setup(query);
	var constraint = maker.makeConstraint();
	var sql = constraint.sql;
	var params = constraint.params;
	var parameterizable = constraint.parameterizable;
	var results;
	if( parameterizable ){
		results = container.db_sync_query(sql,params);
	}else{
		results = container.db_sync_query_prebind(sql,params);
	}
	results = normalizeField(results);
	var instances = [];
	for( var i=0, len=results.length; i<len; i++ ){
		instances.push( new ModelConstructor(results[i].{{primary_key}}) );
	}
	return instances;
};

var ids = function(query){
	var maker = new SQLMaker();
	maker.setup(query);
	var constraint = maker.makeConstraint();
	var sql = constraint.sql;
	var params = constraint.params;
	var parameterizable = constraint.parameterizable;
	var results;
	if( parameterizable ){
		results = container.db_sync_query(sql,params);
	}else{
		results = container.db_sync_query_prebind(sql,params);
	}
	results = normalizeField(results);
	return results;
};

// 
// instance service
// 

var instantiate = function(id,options){
	// check pooled instance in this context,
	var instance = container.getPooledInstance(MODEL_NAME,id);
	if( instance ){
		return instance;
	}
	// create new for this context
	var obj = new ModelConstructor(id,options);
	return obj;
};

// 
// data persistent implementations. 
// 

var publishID = function(){
{{#sequence}}
	var sql = "select nextval('{{sequence}}')";
	var result = container.db_sync_query(sql);
	return result[0].nextval;
{{/sequence}}
{{^sequence}}
	// no sequence generator defined, you should publish manually
	return null;
{{/sequence}}
};

var insert = function(){
	var sql = "insert into {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} ({{primary_key}},{{#Fields}}{{field}}{{^last}},{{/last}}{{/Fields}}) values ({{#Holders}}{{holder}}{{^last}},{{/last}}{{/Holders}})";
	var result = container.db_sync_query(
		sql,
		[
			this.entity.{{primary_key}},
{{#Fields}}
			this.entity.{{field}}{{^last}},{{/last}}
{{/Fields}}
		]
	);
	return result;
};

var update = function(){
	var sql = "update {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} set {{#Fields}}{{field}}={{holder}}{{^last}},{{/last}} {{/Fields}}where {{primary_key}}={{primary_key_holder}}";
	var result = container.db_sync_query(
		sql,
		[
{{#Fields}}
			this.entity.{{field}},
{{/Fields}}
			this.entity.{{primary_key}}
		]
	);
	return result;
};

var remove = function(){
	var sql = "delete from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where {{primary_key}}=$1";
	var result = container.db_sync_query(
		sql,
		[this.entity.{{primary_key}}]
	);
	return result;
};

var load = function(){
	var sql = "select {{primary_key}},{{#Fields}}{{#geography}}ST_AsText({{field}}) as {{/geography}}{{field}}{{^last}},{{/last}}{{/Fields}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where {{primary_key}}=$1";
	var results = container.db_sync_query(
		sql,
		[this.entity.{{primary_key}}]
	);
	results = normalizeField(results);
	var result = results[0];
	if( !result ){
		this.fresh = true;
		return;
	}
{{#Fields}}
	this.entity.{{field}} = result.{{field}};
{{/Fields}}
};

var retrieve = function(options){
	if( options.ignoreCache == true ){
		load.apply(this); // retrieve from db
	}else{
		var cacheKey = MODEL_NAME + '/' + this.entity.{{primary_key}};
		var json = container.cache_sync_get(cacheKey); // retrieve from cache
		if( !json ){
			load.apply(this);
			this.save_cache(); // cache myself
		}else{
			var parsed = JSON.parse(json);
			this.entity = parsed.entity;
			this.fresh  = parsed.fresh;
		}
	}
};

// tell the container to commit current transaction
var requestCommit = function(){
	this.modified = true;
	container.requestCommit();
};

// 
// field manifest service
// 

var getFieldManifest = function(){
	return FieldManifest;
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function ModelConstructor(){
	// instance variables
	this.entity   = {};    // raw instance of model entity, ensures name space
	this.fresh    = false; // true, if this entity is loaded from DB, false to be inserted when save()
	this.modified = false; // when you modify model property, turn ture and commit requests alises to the container
	
	var id = arguments[0];
	if( id )
	{
		// if an argument is defined, that should be an id.
		this.entity.{{primary_key}} = id;
		
		var options = {};
		if( arguments[1] ){ options = arguments[1]; }
		retrieve.apply(this,[{ignoreCache:options.ignoreCache}]); // call private method
	}
	else
	{
		// otherwise, just create a new empty one
		this.fresh = true;
		this.entity.{{primary_key}} = publishID.apply(this); // call private method
		this.save_cache(); // cache myself
	}
	
	this.primaryKey = this.entity.{{primary_key}};
	
	// pool this instance
	container.setPooledInstance(MODEL_NAME,this.entity.{{primary_key}},this);
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
Model.__defineGetter__('{{field}}', function(){
	return this.entity.{{field}};
});

Model.__defineSetter__('{{field}}', function({{field}}){
	this.entity.{{field}} = Sanitizer.sanitize('{{field}}',{{field}});
	requestCommit.apply(this);
});
{{/Fields}}

// bulk setter
Model.restore = function(json){
{{#Fields}}
	this.entity.{{field}} = json.{{field}};
{{/Fields}}
	requestCommit.apply(this);
};

// 
// public data persistent api
// 

Model.save = function(){
	if( this.fresh ){
		insert.apply(this);
	}else{
		update.apply(this);
	}
	this.fresh = false;
	this.save_cache();
};

Model.remove = function(){
	this.remove_cache();
	if( !this.fresh ){
		remove.apply(this);
	}
};

Model.save_cache = function(){
	var cacheKey = MODEL_NAME + '/' + this.entity.{{primary_key}};
	container.cache_sync_set( cacheKey,JSON.stringify(this.json()) );
};

Model.remove_cache = function(){
	var cacheKey = MODEL_NAME + '/' + this.entity.{{primary_key}};
	container.cache_sync_del(cacheKey);
};

Model.json = function(){
	return {
		"entity" : this.entity,
		"fresh"  : this.fresh,
	};
};

// 
// instance validation 
// 

Model.valid = function(field){
	if( field ){
		return Validator.validate(this,field);
	}else{
		var fields = Object.keys(FieldManifest);
		for( var i=0, len=fields.length; i<len; i++ ){
			var field = FieldManifest[fields[i]];
			var validation = Validator.validate(this,field);
			if( !validation ){
				return false;
			}
		}
		return true;
	}
};

Model.isInstanceOf = function(name){
	if( name == MODEL_NAME ){
		return true;
	}else{
		return false;
	}
};

// 
// resolve relation
// 

Model.expand = function(level){
	if( !level ){ return; }
	if( level <= 0 ){ return; }
	level--;
	// expand external key
{{#Fields}}{{#helper}}
	this.entity.{{#Cut_trail_id}}{{field}}{{/Cut_trail_id}} = {{#Uc_first}}{{#Cut_trail_id}}{{field}}{{/Cut_trail_id}}{{/Uc_first}}Model.instance(this.entity.{{field}});
	this.entity.{{#Cut_trail_id}}{{field}}{{/Cut_trail_id}}.expand(level);
{{/helper}}
{{/Fields}}
	// expand collection
{{#Collection}}
	var {{#Lc_first}}{{collection_entity}}{{/Lc_first}} = {{#Uc_first}}{{collection_entity}}{{/Uc_first}}Model.instance(this.entity.{{collectorID}});
	var {{#Lc_first}}{{collectedID}}{{/Lc_first}}s = {{#Lc_first}}{{collection_entity}}{{/Lc_first}}.collection;
	var {{#Lc_first}}{{collectedEntity}}{{/Lc_first}}s = [];
	for( var i=0; i<{{#Lc_first}}{{collectedID}}{{/Lc_first}}s.length; i++ ){
		var instance = {{#Uc_first}}{{collectedEntity}}{{/Uc_first}}Model.instance({{#Lc_first}}{{collectedID}}{{/Lc_first}}s[i]);
		instance.expand(level);
		{{#Lc_first}}{{collectedEntity}}{{/Lc_first}}s.push(instance);
	}
	this.entity.{{#Lc_first}}{{collection_entity}}{{/Lc_first}} = {{#Lc_first}}{{collection_entity}}{{/Lc_first}};
	this.entity.{{#Lc_first}}{{collectedID}}{{/Lc_first}}s = {{#Lc_first}}{{collectedID}}{{/Lc_first}}s;
	this.entity.{{#Lc_first}}{{collectedEntity}}{{/Lc_first}}s = {{#Lc_first}}{{collectedEntity}}{{/Lc_first}}s;
{{/Collection}}
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

module.exports = {
	getClass      : ModelConstructor, // provide constructor
	publishID     : publishID,        // publish new id
	instance      : instantiate,      // create new instance
	search        : search,           // search entity and returns instance set
	ids           : ids,              // search entity and returns only ids
	fieldManifest : getFieldManifest, // provide field manifest (lower caset to original)
};


