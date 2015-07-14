
// 
// {{entity}} Model
// 
//     segment : {{segment}}
//     entity  : {{entity}} (collection)
//     collect : {{collectedID}}
// 

// represent junction table

// case:
//     
//     var order = new OrderModel.getClass()
//     
//     var product1 = ProductModel.instance(pid1);
//     var product2 = ProductModel.instance(pid2);
//     
//     var orderItem1        = new orderItem.getClass();
//     orderItem.productID   = product1.productID;
//     orderItem.productName = product1.productName;
//     orderItem.price       = product1.price;
//     
//     var orderItem2        = new orderItem.getClass();
//     orderItem.productID   = product2.productID;
//     orderItem.productName = product2.productName;
//     orderItem.price       = product2.price;
//     
//     var orderOrderItem = OrderOrderItem.instance(order.getID());
//     
//     // check instance type and collect its id
//     orderOrderItem.add(orderItem1); 
//     orderOrderItem.add(orderItem2); // check instance type and collect its id
//     
//     // loading only ids
//     var orderItemIDs = OrderOrderItem.ids(orderID);
//     var orderIDs     = OrderOrderItem.reverse(orderItemID);
//     
//     order.save();
//     orderOrderItem.save();
//     orderItem1.save();
//     orderItem2.save();
//     
// case:
//     
//     var user = UserModel.instance(userID);
//     var userGroup = UserGroup.instance(userID);
//     
//     var group1 = GroupModel.instance(gid1);
//     var group2 = GruopModel.instance(gid2);
//     
//     userGroup.add(group1);
//     userGroup.add(group2);
//     
//     userGroup.save();
//     
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

// singleton instance of the Container for this segment
var ContainerFactory = {{APP_NAME}}.getContainerFactory();
var container = ContainerFactory.getContainer('{{segment}}'); 

// no search for collection

// sanitizer
var ModelSanitizerFactory = {{APP_NAME}}.getModelSanitizerFactory();
var Sanitizer = ModelSanitizerFactory.getSanitizer('{{segment}}/{{entity}}');

// validator
var ModelValidatorFactory = {{APP_NAME}}.getModelValidatorFactory();
var Validator = ModelValidatorFactory.getValidator('{{segment}}/{{entity}}');

// field manifest (also used as case convert tool)
// lower case : original definition
var FieldManifest = { {{#Align_colon}}
	"{{#Lc_all}}{{collectorID}}{{/Lc_all}}" : "{{collectorID}}",
	"{{#Lc_all}}{{collectedID}}{{/Lc_all}}" : "{{collectedID}}"
{{/Align_colon}}
};
var normalizeField = function(raw_results){
	return Utils.normalizeField(FieldManifest,raw_results);
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// static services
// you should call these method by 'apply' when using from instance(,prototype) method.

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

var insert = function(){
	var sql = "insert into {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} values ($1,$2)";
	var collection = Object.keys(this.entity.collection);
	var count = 0;
	for( var i=0, len=collection.length; i<len; i++ ){
		var result = container.db_sync_query(
			sql,
			[
				this.entity.{{collectorID}},
				collection[i]
			]
		);
		count++;
	}
	return count;
};

var remove = function(){
	var sql = "delete from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where {{collectorID}}=$1";
	var result = container.db_sync_query(
		sql,
		[this.entity.{{collectorID}}]
	);
	return result;
};

var load = function(){
	var sql = "select * from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where {{collectorID}}=$1";
	var results = container.db_sync_query(
		sql,
		[this.entity.{{collectorID}}]
	);
	results = normalizeField(results);
	for( var i=0, len=results.length; i<len; i++ ){
		this.entity.collection[results[i].{{collectedID}}]=1;
	}
};

var collectors = function(collectedID){
	if( !collectedID ){ return; }
	var sql = "select * from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where {{collectedID}}=$1";
	var results = container.db_sync_query(
		sql,[collectedID]
	);
	results = normalizeField(results);
	var tempHash = {};
	for( var i=0, len=results.length; i<len; i++ ){
		tempHash[results[i].{{collectorID}}]=1;
	}
	var collectorIDs = Object.keys(tempHash);
	return collectorIDs;
};

var collections = function(collectorID){
	if( !collectorID ){ return; }
	var sql = "select * from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} where {{collectorID}}=$1";
	var results = container.db_sync_query(
		sql,[collectorID]
	);
	results = normalizeField(results);
	var tempHash = {};
	for( var i=0, len=results.length; i<len; i++ ){
		tempHash[results[i].{{collectedID}}]=1;
	}
	var collectedIDs = Object.keys(tempHash);
	return collectedIDs;
};

var retrieve = function(options){
	if( options.ignoreCache == true ){
		load.apply(this); // retrieve from db
	}else{
		var cacheKey = MODEL_NAME + '/' + this.entity.{{collectorID}};
		var json = container.cache_sync_get(cacheKey); // retrieve from cache
		if( !json ){
			load.apply(this);
			this.save_cache(); // cache myself
		}else{
			var parsed = JSON.parse(json);
			this.entity.collection = parsed.collection;
			this.fresh = parsed.fresh;
		}
	}
};

// tell the container to commit current transaction
var requestCommit = function(){
	this.modified = true;
	container.requestCommit();
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function ModelConstructor(){
	// instance variables
	this.entity   = {};    // raw instance of model entity, ensures name space
	this.fresh    = false; // true, if this entity is loaded from DB, false to be inserted when save()
	this.modified = false; // when you modify model property, turn ture and commit requests alises to the container
	
	this.entity.collection = {};
	
	var id = arguments[0];
	if( id )
	{
		// if an argument is defined, that should be an id.
		this.entity.{{collectorID}} = id;
		
		var options = {};
		if( arguments[1] ){ options = arguments[1]; }
		retrieve.apply(this,[{ignoreCache:options.ignoreCache}]); // call private method
	}
	else
	{
		// collection always requires key id
		return false;
	}
	
	// pool this instance
	container.setPooledInstance(MODEL_NAME,this.entity.{{collectorID}},this);
}

var Model = ModelConstructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// instance validation 

Model.valid = function(){
	return Validator.validate(this);
};

Model.isInstanceOf = function(name){
	if( name == MODEL_NAME ){
		return true;
	}else{
		return false;
	}
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public data access and mutate api

// (read only) primary key
Model.__defineGetter__('{{collectorID}}', function(){
	return this.entity.{{collectorID}};
});

Model.__defineGetter__('collection', function(){
	return Object.keys(this.entity.collection);
});

Model.__defineSetter__('collection', function(collection){
	this.entity.collection = {}; // init
	var this_collection = this.entity.collection;
	collection.map(
		function({{collectedID}}){
			var safe_{{collectedID}} = Sanitizer.sanitize('{{collectedID}}',{{collectedID}});
			if( safe_{{collectedID}} ){
				this_collection[safe_{{collectedID}}]=1;
			}
		}
	);
	requestCommit.apply(this);
});

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public collection api

Model.addID = function(id){
	this.entity.collection[id]=1;
	requestCommit.apply(this);
};

Model.addEntity = function(entity){
	if( entity.isInstanceOf('Model/{{{collectedEntity}}}') ){
		this.entity.collection[entity.{{collectedID}}]=1;
		requestCommit.apply(this);
	}
};

Model.removeID = function(id){
	delete this.entity.collection[id];
	requestCommit.apply(this);
};

Model.removeEntity = function(entity){
	if( entity.isInstanceOf('Model/{{{collectedEntity}}}') ){
		delete this.entity.collection[entity.{{collectedID}}];
		requestCommit.apply(this);
	}
};

// bulk setter (id array)
Model.restore = function(json){
	this.entity.collection = {}; // init
	var collection = json.collection;
	var this_collection = this.entity.collection;
	collection.map(
		function(id){
			this_collection[id]=1;
		}
	);
	requestCommit.apply(this);
};

// bulk setter (entity array)
Model.restoreByEntities = function(items){
	this.entity.collection = {}; // init
	var this_collection = this.entity.collection;
	items.map(
		function(item){
			if( item.isInstanceOf('Model/{{{collectedEntity}}}') ){
				this_collection[item.{{collectedID}}]=1;
			}
		}
	);
	requestCommit.apply(this);
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public data persistent api

Model.save = function(){
	this.save_cache();
	if( this.fresh ){
		insert.apply(this);
	}else{
		// db should be refreshed
		remove.apply(this);
		insert.apply(this);
	}
};

// remove all collection
Model.remove = function(){
	this.remove_cache();
	if( !this.fresh ){
		remove.apply(this);
	}
};

Model.save_cache = function(){
	var cacheKey = MODEL_NAME + '/' + this.entity.{{collectorID}};
	container.cache_sync_set(cacheKey,JSON.stringify(this.json()));
};

Model.remove_cache = function(){
	var cacheKey = MODEL_NAME + '/' + this.entity.{{collectorID}};
	container.cache_sync_del(cacheKey);
};

Model.json = function(){
	var json = { collection : this.entity.collection };
	json.fresh = this.fresh;
	return json;
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

module.exports = {
	getClass    : ModelConstructor, // provide constructor
	instance    : instantiate,      // create new instance
	collections : collections,      // forward id loader
	collectors  : collectors,       // backward id loader
	remove      : remove,           // remove entity from the collection
};



