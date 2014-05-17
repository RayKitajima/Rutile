
console.log("start server generator");

var path = require('path');

var program_file = process.argv[1];

var LIB_PATH = path.resolve(program_file,"../../lib/node_modules/rutile/lib");
var WORKING_DIR = process.cwd();

console.log("program_file:"+program_file);
console.log("LIB_PATH:"+LIB_PATH);

var tools = require(path.resolve(LIB_PATH,'tools.js'));
var Generator = require(path.resolve(LIB_PATH,'Generator_server'));

// $ rutile generate server ./Config.js
var config_file = process.argv[4];
if( config_file.match(/^\./) ){
	config_file = path.resolve(WORKING_DIR,config_file);
}else{
	throw new Error("invalid config file: "+config_file);
}
var MyAppConfig = require(config_file);

var CONFIG_PATH = path.resolve(config_file,'..');

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

console.log("loading config...");

var APP_NAME = MyAppConfig.APP_NAME;
var SERVER_NAME = APP_NAME + "Server";
console.log("APP_NAME    : "+APP_NAME);
console.log("SERVER_NAME : "+SERVER_NAME);

var Protocol  = MyAppConfig.Protocol  || 'websocket';
var AppHost   = MyAppConfig.AppHost   || '127.0.0.1';
var AppPort   = MyAppConfig.AppPort   || 3000;
var DBHost    = MyAppConfig.DBHost    || '127.0.0.1';
var DBPort    = MyAppConfig.DBPort    || 5432;
var DBUser    = MyAppConfig.DBUser;
var DBPass    = MyAppConfig.DBPass;
var CacheHost = MyAppConfig.CacheHost || '127.0.0.1';
var CachePort = MyAppConfig.CachePort || 6379;

var SelectAllLimit = MyAppConfig.SelectAllLimit || 1000; // default select all limit is 1000
console.log("Application select all limit:"+SelectAllLimit);

var MaxExpandLevel = MyAppConfig.MaxExpandLevel || 2; // default recursive expand() is set to 2
console.log("Application recursive expand limit:"+MaxExpandLevel);

var Segments = [];
var SegmentMap = {};
for( var i=0; i<MyAppConfig.segments.length; i++ ){
	var SegmentDef = MyAppConfig.segments[i];
	var SegmentModule = require(path.resolve(CONFIG_PATH,SegmentDef.file));
	Segments.push({
		name    : SegmentModule.name,
		segment : SegmentModule.name, // alias
		module  : SegmentModule.Entities,
	});
	SegmentMap[SegmentModule.name] = {
		module : SegmentModule.Entities,
	};
	console.log("segment name  :"+SegmentModule.name);
	console.log("segment module:"+SegmentModule);
}
Segments[Segments.length-1].last = true;

var config = {
	APP_NAME     : APP_NAME,
	SERVER_NAME  : SERVER_NAME,
	Protocol     : Protocol,
	template_dir : LIB_PATH,
	output_dir   : WORKING_DIR,
	tools        : tools,
};

console.log("start generating "+APP_NAME);


// ********** General **********

// MyApp.js
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating " + APP_NAME + ".js ...");
Generator.generate("MyApp",config);

// package.json
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating package.json");
Generator.generate("package",config);


// ********** Container **********

// Container/ContainerFactory
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating Container/ContainerFactory.js ...");
Generator.generate("Container/ContainerFactory",config);

// Container/ContainerManifest
config.view = {
	APP_NAME : APP_NAME,
	Segments : Segments,
};
console.log("generating Container/ContainerManifest.js ...");
Generator.generate("Container/ContainerManifest",config);

// Container/Container
config.view = {
	APP_NAME : APP_NAME,
};
console.log("generating Container/Container.js ...");
Generator.generate("Container/Container",config);

// Container/Transaction
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating Container/Transaction.js ...");
Generator.generate("Container/Transaction",config);

// Container/ContainerFacade
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating Container/ContainerFacade.js ...");
Generator.generate("Container/ContainerFacade",config);

// Container/TransactionFacade
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating Container/TransactionFacade.js ...");
Generator.generate("Container/TransactionFacade",config);


// ********** Model **********

// make Entities
var Entities = [];
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		Entities.push({
			segment : segmentName,
			entity  : entityName,
		});
	}
}
Entities[Entities.length-1].last = true;

// Model/ModelFacade
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating Model/ModelFactory.js ...");
Generator.generate("Model/ModelFactory",config);

// Model/ModelManifest
config.view = {
	APP_NAME : APP_NAME,
	Entities : Entities, //  [{ segment:, entity:, last:0|1 }],
};
console.log("generating Model/ModelManifest.js ...");
Generator.generate("Model/ModelManifest",config);

// Model/Segment
config.view = {
	APP_NAME : APP_NAME,
	Segments : Segments, 
};
console.log("generating Model/Segment folders...");
Generator.generate("Model/Segment",config);

// Model/Segment/Entity,Collection
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		// Model/Segment/Entity
		if( entityDef.type === 'Entity' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var Fields  = []; // [{ field:, holder:$N, last:0|1 }],
			var Holders = []; // holders for primary key and all fields [ '$1','$2',...'$field.length+1' ],
			
			var Aggregation = []; // aggretation resolve external key and collection
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				var helper    = fieldDef.helper;
				var holder    = '$'+(k+1);
				Fields.push({
					field     : fieldName,
					holder    : holder,
					helper    : helper,
					geography : fieldDef.type == "geography" ? true : false, // is this a geography field?
				});
				Holders.push({
					holder : holder 
				});
				if( helper ){
					// helper should 
					var helper_segment_entity = helper.split('/');
					var helper_segmentName    = helper_segment_entity[0];
					var helper_entityName     = helper_segment_entity[1];
					Aggregation.push({
						aggregation_segmentName : '',
						aggregation_entityName  : '',
						aggregated_segmentName  : helper_segmentName,
						aggregated_entityName   : helper_entityName,
					});
				}
			}
			var primary_key_holder = '$' + (Fields.length+1);
			Holders.push({
				holder : primary_key_holder 
			});
			
			Fields[Fields.length-1].last = true;
			Holders[Holders.length-1].last = true;
			
			var sequence = '';
			if( entityDef.sequence ){ sequence = entityDef.sequence.name; }
			
			// expand
			var Collection = [];
			if( entityDef.aggregate ){
				var aggregate_segment_entities = entityDef.aggregate.split(',');
				for( var k=0; k<aggregate_segment_entities.length; k++ ){
					var aggregate_segment_entity       = aggregate_segment_entities[k];
					var array_aggregate_segment_entity = aggregate_segment_entity.split('/');
					var aggregate_segmentName          = array_aggregate_segment_entity[0];
					var aggregate_entityName           = array_aggregate_segment_entity[1];
					var aggregate_segmentDef           = SegmentMap[aggregate_segmentName].module;
					var aggregate_entityDef            = aggregate_segmentDef[aggregate_entityName];
					
					if( aggregate_entityDef.type === 'Collection' ){
						var collector_segment_entity = aggregate_entityDef.collector.entity.split('/');
						var collector_segment        = collector_segment_entity[0];
						var collector_entity         = collector_segment_entity[1];
						var collected_segment_entity = aggregate_entityDef.collected.entity.split('/');
						var collected_segment        = collected_segment_entity[0];
						var collected_entity         = collected_segment_entity[1];
						Collection.push({
							collection_segment : aggregate_segmentName,
							collection_entity  : aggregate_entityName,
							collectorSegment   : collector_segment,
							collectorEntity    : collector_entity,
							collectorID        : aggregate_entityDef.collector.primary_key,
							collectedSegment   : collected_segment,
							collectedEntity    : collected_entity,
							collectedID        : aggregate_entityDef.collected.primary_key,
						});
						Aggregation.push({
							aggregation_segmentName : aggregate_segmentName, // segment of  junction table
							aggregation_entityName  : aggregate_entityName,  // entity(collection) of junction table
							aggregated_segmentName  : collected_segment,
							aggregated_entityName   : collected_entity,
						});
					}
				}
			}
			
			config.view = {
				APP_NAME           : APP_NAME,
				segment            : segmentName,
				entity             : entityName,
				sequence           : sequence,
				primary_key        : entityDef.primary_key.field,
				primary_key_holder : primary_key_holder,
				Fields             : Fields,
				Holders            : Holders,
				Aggregation        : Aggregation,
				Collection         : Collection,
			};
			console.log("generating Model for " + entityName + " ...");
			Generator.generate("Model/Segment/Entity",config);
		}
		
		// Model/Segment/Collection
		else if( entityDef.type === 'Collection' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var Fields  = [];
			var Holders = [];
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var holder    = '$'+(k+1);
				Fields.push({
					field  : fieldName,
					holder : holder
				});
				Holders.push(holder);
			}
			
			Fields[Fields.length-1].last = true;
			
			config.view = {
				APP_NAME        : APP_NAME,
				segment         : segmentName,
				entity          : entityName,
				collectorEntity : entityDef.collector.entity,
				collectorID     : entityDef.collector.primary_key,
				collectedEntity : entityDef.collected.entity,
				collectedID     : entityDef.collected.primary_key,
			};
			console.log("generating Model for " + entityName + " (collection) ...");
			Generator.generate("Model/Segment/Collection",config);
		}
	}
}


// ********** ModelSanitizer **********

// make Entities
var Entities = [];
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		Entities.push({
			segment : segmentName,
			entity  : entityName
		});
	}
}
Entities[Entities.length-1].last = true;

// ModelSanitizer/ModelSanitizerFactory
config.view = {
	APP_NAME : APP_NAME,
};
console.log("generating ModelSanitizer/ModelSanitizerFactory.js ...");
Generator.generate("ModelSanitizer/ModelSanitizerFactory",config);

// ModelSanitizer/ModelSanitizerManifest
config.view = {
	APP_NAME : APP_NAME,
	Entities : Entities,
};
console.log("generating ModelSanitizer/ModelSanitizerManifest.js ...");
Generator.generate("ModelSanitizer/ModelSanitizerManifest",config);

// ModelSanitizer/GenericSanitizer
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating ModelSanitizer/GenericSanitizer.js ...");
Generator.generate("ModelSanitizer/GenericSanitizer",config);

// ModelSanitizer/Segment
config.view = {
	APP_NAME : APP_NAME,
	Segments : Segments,
};
console.log("generating ModelSanitizer/Segment folders ...");
Generator.generate("ModelSanitizer/Segment",config);

// ModelSanitizer/Segment/Entity,Collection

var SanitizerMap = {
	int       : "simpleNumber",
	int2      : "simpleNumber",
	int4      : "simpleNumber",
	text      : "simpleText",
	date      : "simpleDate",
	timestamp : "simpleTimestamp",
	geography : "simpleText", // geography value should be a text representing postgis geography type by point : POINT(lon lat)
};

for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		// ModelSanitizer/Segment/Entity
		if( entityDef.type === 'Entity' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var Fields = []; // [ { field:, sanitizeMethod:auto generated by field type, last:0|1 }],
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				var fieldType = fieldDef.type;
				
				// field based sanitization
				var typedSanitizeMethod = SanitizerMap[fieldType] || SanitizerMap['text'];
				
				// user defined sanitization
				var field_sanitize_def = fieldDef.sanitize;
				var sanitizeMethods = [];
				if( field_sanitize_def ){
					var field_sinitizes = field_sanitize_def.split(',');
					for( var l=0; l<field_sinitizes.length; l++ ){
						var field_sinitize = field_sinitizes[l];
						var sanitizeMethod = SanitizerMap[field_sinitize];
						if( sanitizeMethod ){
							sanitizeMethods.push({ sanitize:sanitizeMethods });
						}
					}
				}
				
				// null checker, null means 0 in int field, and so on...
				var notNull = false;
				var field_validate_def = fieldDef.validate;
				if( !field_validate_def ){
					notNull = false; // allow null
				}else{
					var field_validates = field_validate_def.split(',');
					for( var l=0; l<field_validates.length; l++ ){
						var field_validate = field_validates[l];
						if( field_validate == 'notNull' ){ notNull = true; } // dont allow null
					}
				}
				
				Fields.push({
					field               : fieldName,
					typedSanitizeMethod : typedSanitizeMethod,
					sanitizes           : sanitizeMethods,
					notNull             : notNull,
				});
			}
			
			Fields[Fields.length-1].last = true;
			
			config.view = {
				APP_NAME     : APP_NAME,
				segment      : segmentName,
				entity       : entityName,
				primary_key  : entityDef.primary_key.field,    // primary key of this entity,
				Fields       : Fields,
			};
			console.log("generating Sanitizer for model:" + entityName + " ...");
			Generator.generate("ModelSanitizer/Segment/Entity",config);
		}
		
		// ModelSanitizer/Segment/Collection (same as entity)
		else if( entityDef.type === 'Collection' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var Fields = []; // [{ field:, sanitizeMethod:auto generated by field type, last:0|1 }],
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				var fieldType = fieldDef.type;
				
				var sanitizeMethod = SanitizerMap[fieldType] || SanitizerMap['text'];
				
				Fields.push({
					field          : fieldName,
					sanitizeMethod : sanitizeMethod
				});
			}
			
			Fields[Fields.length-1].last = true;
			
			config.view = {
				APP_NAME : APP_NAME,
				segment  : segmentName,
				entity   : entityName,
				Fields   : Fields,
			};
			console.log("generating Sanitizer for model:" + entityName + " (collection) ...");
			Generator.generate("ModelSanitizer/Segment/Collection",config);
		}
	}
}


// ********** ModelValidator **********

// make Entities
var Entities = [];
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		Entities.push({
			segment : segmentName,
			entity  : entityName
		});
	}
}
Entities[Entities.length-1].last = true;

// ModelValidator/ModelValidatorFactory
config.view = {
	APP_NAME : APP_NAME,
};
console.log("generating ModelValidator/ModelValidatorFactory.js ...");
Generator.generate("ModelValidator/ModelValidatorFactory",config);

// ModelValidator/ModelValidatorManifest
config.view = {
	APP_NAME : APP_NAME,
	Entities : Entities,
};
console.log("generating ModelValidator/ModelValidatorManifest.js ...");
Generator.generate("ModelValidator/ModelValidatorManifest",config);

// ModelValidator/GenericValidator
config.view = {
	APP_NAME : APP_NAME,
};
console.log("generating ModelValidator/GenericValidator.js ...");
Generator.generate("ModelValidator/GenericValidator",config);

// ModelValidator/Segment
config.view = {
	APP_NAME : APP_NAME,
	Segments : Segments,
};
console.log("generating ModelValidator segment folders ...");
Generator.generate("ModelValidator/Segment",config);

// ModelValidator/Segment/Entity,Collection

var ValidatorMap = {
	empty           : "empty",
	notNull         : "notNull",
	positiveValue   : "positiveValue",
	negativeValue   : "negativeValue",
	timestampString : "timestampString",
	dateString      : "dateString",
	emailString     : "emailString",
	escapedHtmlTag  : "escapedHtmlTag",
	geographyPoint  : "geographyPoint", // postgis geography type by point : POINT(lon lat)
};

for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		// ModelValidator/Segment/Entity
		if( entityDef.type === 'Entity' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			// [{ 
			//     field   : FIELD, 
			//     valids  : auto generated genric validator according to user definition, 
			//     notNull : field nullability (special valid)
			//     helper  : external entity (segment/entity), 
			//     last    : 0|1 
			// }],
			var Fields = [];
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				var helper    = fieldDef.helper;
				
				var field_validate_def = fieldDef.validate;
				
				var validateMethods = [];
				var notNull = false;
				
				if( !field_validate_def ){
					validateMethods.push({ valid:ValidatorMap['empty'] });
				}else{
					var field_validates = field_validate_def.split(',');
					for( var l=0; l<field_validates.length; l++ ){
						var field_validate = field_validates[l];
						var validateMethod = ValidatorMap[field_validate] || ValidatorMap['empty'];
						validateMethods.push({ valid:validateMethod });
						if( field_validate == 'notNull' ){ notNull = true; }
					}
				}
				
				Fields.push({
					field   : fieldName,
					valids  : validateMethods,
					notNull : notNull,
					helper  : helper,
				});
			}
			
			Fields[Fields.length-1].last = true;
			
			config.view = {
				APP_NAME          : APP_NAME,
				segment           : segmentName,
				entity            : entityName,
				primary_key       : entityDef.primary_key.field,    // primary key of this entity,
				primary_key_valid : entityDef.primary_key.validate, // validator of the primary key,
				Fields            : Fields, 
			};
			console.log("generating Validator for model:" + entityName + " ...");
			Generator.generate("ModelValidator/Segment/Entity",config);
		}
		
		// ModelValidator/Segment/Collection
		else if( entityDef.type === 'Collection' ){
			var collector_segment_entity = entityDef.collector.entity.split('/');
			var collector_segment        = collector_segment_entity[0];
			var collector_entity         = collector_segment_entity[1];
			var collected_segment_entity = entityDef.collected.entity.split('/');
			var collected_segment        = collected_segment_entity[0];
			var collected_entity         = collected_segment_entity[1];
			
			config.view = {
				APP_NAME         : APP_NAME,
				segment          : segmentName,
				entity           : entityName,
				collectorSegment : collector_segment,                // segment of collector (not needed)
				collectorEntity  : collector_entity,                 // collector entity (not needed)
				collectorID      : entityDef.collector.primary_key,  // primary key of collector entity (not needed)
				collectedSegment : collected_segment,                // segment of collected item
				collectedEntity  : collected_entity,                 // collected entity
				collectedID      : entityDef.collected.primary_key,  // primary key of collected entity
			};
			console.log("generating Validator for model:" + entityName + " (collection) ...");
			Generator.generate("ModelValidator/Segment/Collection",config);
		}
	}
}


// ********** Constarint **********

// make Entities
var Entities = [];
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityDef  = segmentDef[entityNames[j]];
		var entityName = entityNames[j];
		
		// [{
		//     collection : type of this entity, skip collection, 0|1, 
		//     segment    : the segmet of this entity, 
		//     entity     : entity, 
		//     last       : 0|1 
		// }],
		Entities.push({
			collection : entityDef.type === 'Collection' ? true : false,
			segment    : segmentName,
			entity     : entityName,
		});
	}
}
Entities[Entities.length-1].last = true;

// Constraint/ConstraintFactory
config.view = {
	APP_NAME : APP_NAME,
};
console.log("generating Constraint/ConstraintFactory.js ...");
Generator.generate("Constraint/ConstraintFactory",config);

// Constraint/ConstraintManifest
config.view = {
	APP_NAME : APP_NAME,
	Entities : Entities, 
};
console.log("generating Constraint/ConstraintManifest.js ...");
Generator.generate("Constraint/ConstraintManifest",config);

// Constraint/Segment
config.view = {
	APP_NAME : APP_NAME,
	Segments : Segments,
};
console.log("generating Constraint/Segment folders ...");
Generator.generate("Constraint/Segment",config);

// Constraint/Entity
config.view = {
	APP_NAME : APP_NAME,
	Entities : Entities,
};
console.log("generating Constraint/Entity folders ...");
Generator.generate("Constraint/Entity",config);

// Constraint/EntityManifest
// Constraint/Segment/Entity/Slectby*,Orderby*

var ConstraintMap = {
	key       : "Constraint/Segment/Entity/SelectbyField_Key",
	num       : "Constraint/Segment/Entity/SelectbyField_Num",
	like      : "Constraint/Segment/Entity/SelectbyField_Like",
	date      : "Constraint/Segment/Entity/SelectbyField_Date",
	timestamp : "Constraint/Segment/Entity/SelectbyField_Timestamp",
	nearby    : "Constraint/Segment/Entity/SelectbyField_Nearby",
	area      : "Constraint/Segment/Entity/SelectbyField_Area",
	orderby   : "Constraint/Segment/Entity/OrderbyField"
};
var ConstraintMapForJoin = {
	key       : "Constraint/Segment/Entity/SelectbyField_Key_join",
	num       : "Constraint/Segment/Entity/SelectbyField_Num_join",
	like      : "Constraint/Segment/Entity/SelectbyField_Like_join",
	date      : "Constraint/Segment/Entity/SelectbyField_Date_join",
	timestamp : "Constraint/Segment/Entity/SelectbyField_Timestamp_join",
	nearby    : "Constraint/Segment/Entity/SelectbyField_Nearby_join",
	area      : "Constraint/Segment/Entity/SelectbyField_Area_join",
	orderby   : "Constraint/Segment/Entity/OrderbyField_join"
};
var ConstraintMapForJoinExt = { // join to a remote database entity
	key       : "Constraint/Segment/Entity/SelectbyField_Key_join_ext",
	num       : "Constraint/Segment/Entity/SelectbyField_Num_join_ext",
	like      : "Constraint/Segment/Entity/SelectbyField_Like_join_ext",
	date      : "Constraint/Segment/Entity/SelectbyField_Date_join_ext",
	timestamp : "Constraint/Segment/Entity/SelectbyField_Timestamp_join_ext",
	nearby    : "Constraint/Segment/Entity/SelectbyField_Nearby_join_ext",
	area      : "Constraint/Segment/Entity/SelectbyField_Area_join_ext",
//	orderby   : "Constraint/Segment/Entity/OrderbyField_join_ext" // order by remote data field is not supported
};
var ConstraintMapForJnx = {
	key       : "Constraint/Segment/Entity/SelectbyField_Key_jnx",
	num       : "Constraint/Segment/Entity/SelectbyField_Num_jnx",
	like      : "Constraint/Segment/Entity/SelectbyField_Like_jnx",
	date      : "Constraint/Segment/Entity/SelectbyField_Date_jnx",
	timestamp : "Constraint/Segment/Entity/SelectbyField_Timestamp_jnx",
	nearby    : "Constraint/Segment/Entity/SelectbyField_Nearby_jnx",
	area      : "Constraint/Segment/Entity/SelectbyField_Area_jnx",
	orderby   : "Constraint/Segment/Entity/OrderbyField_jnx"
};
var ConstraintMapForJnxExt = { // collecting remote database entity
	key       : "Constraint/Segment/Entity/SelectbyField_Key_jnx_ext",
	num       : "Constraint/Segment/Entity/SelectbyField_Num_jnx_ext",
	like      : "Constraint/Segment/Entity/SelectbyField_Like_jnx_ext",
	date      : "Constraint/Segment/Entity/SelectbyField_Date_jnx_ext",
	timestamp : "Constraint/Segment/Entity/SelectbyField_Timestamp_jnx_ext",
	nearby    : "Constraint/Segment/Entity/SelectbyField_Nearby_jnx_ext",
	area      : "Constraint/Segment/Entity/SelectbyField_Area_jnx_ext",
//	orderby   : "Constraint/Segment/Entity/OrderbyField_jnx_ext" // order by remote data field is not supported
};

for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		// no constraint for collection
		if( entityDef.type === 'Collection' ){ continue; }
		
		// Constraint/Segment/EntitySQLMaker
		config.view = {
			APP_NAME : APP_NAME,
			segment  : segmentName,
			entity   : entityName,
		};
		console.log("generating SQLMaker for model:" + entityName + " ...");
		Generator.generate("Constraint/Segment/EntitySQLMaker",config);
		
		// Constraint/Segment/Entity/SelectAll
		// special constraint, selectAll
		config.view = {
			APP_NAME    : APP_NAME,
			segment     : segmentName,
			entity      : entityName,
			limit       : SelectAllLimit,
			primary_key : entityDef.primary_key.field,
		};
		console.log("generating select all module for the entity " + entityName);
		Generator.generate("Constraint/Segment/Entity/SelectAll",config);
		
		// prep manifest
		var Selectbys = []; // [{ field:field name, search_type:search type, key,like,num,timestamp etc, last:0|1 }],
		var Orderbys  = []; // [{ field:field name, last:0|1, } ],
		
		var primary_key_search_def = entityDef.primary_key.search;
		if( primary_key_search_def ){
			var primary_key_searches = primary_key_search_def.split(',');
			
			for( var k=0; k<primary_key_searches.length; k++ ){
				var search_type = primary_key_searches[k];
				var target      = ConstraintMap[search_type];
				
				config.view = {
					APP_NAME    : APP_NAME,
					segment     : segmentName,
					entity      : entityName,
					field       : entityDef.primary_key.field,
					search_type : search_type,
					primary_key : entityDef.primary_key.field,
				};
				console.log("generating Constraint for " + entityName + "." + entityDef.primary_key.field + " (" + search_type + ") ...");
				Generator.generate(target,config);
				
				if( joined_search_type === 'orderby' ){
					Orderbys.push({
						field : entityDef.primary_key.field,
					});
				}else{
					Selectbys.push({
						search_segment : segmentName,
						search_entity  : entityName,
						search_field   : entityDef.primary_key.field,
						search_type    : search_type,
					});
				}
			}
		}
		
		var fieldsDef  = entityDef.fields;
		var fieldNames = Object.keys(fieldsDef);
		
		for( var k=0; k<fieldNames.length; k++ ){
			var fieldName = fieldNames[k];
			var fieldDef  = fieldsDef[fieldName];
			
			var field_search_def = fieldDef.search;
			if( !field_search_def ){ continue; }
			
			var field_searches = field_search_def.split(',');
			for( var l=0; l<field_searches.length; l++ ){
				var search_type = field_searches[l];
				
				if( search_type === 'join' ){
					
					// get joined entity info and loop the field,
					var joined_segment_entity = fieldDef.helper;
					var array_segment_entity  = joined_segment_entity.split('/');
					var joined_segmentName    = array_segment_entity[0];
					var joined_entityName     = array_segment_entity[1];
					var joined_segmentDef     = SegmentMap[joined_segmentName].module;
					var joined_entityDef      = joined_segmentDef[joined_entityName];
					var joined_fieldsDef      = joined_entityDef.fields;
					var joined_fieldNames     = Object.keys(joined_fieldsDef);
					
					for( var m=0; m<joined_fieldNames.length; m++ ){
						var joined_fieldName = joined_fieldNames[m];
						var joined_fieldDef  = joined_fieldsDef[joined_fieldName];
						
						var joined_field_search_def = joined_fieldDef.search;
						if( !joined_field_search_def ){ continue; }
						
						var joined_field_searches = joined_field_search_def.split(',');
						for( var n=0; n<joined_field_searches.length; n++ ){
							var joined_search_type = joined_field_searches[n];
							
							if( joined_search_type === 'join' ){ continue; } // recursive join not supported
							
							var target;
							if( segmentName == joined_segmentName ){
								target = ConstraintMapForJoin[joined_search_type];
							}else{
								target = ConstraintMapForJoinExt[joined_search_type];
							}
							if( !target ){ continue; } // unsupported type, might be a orderby remote field
							
							config.view = {
								APP_NAME           : APP_NAME,
								segment            : segmentName,
								entity             : entityName,
								field              : fieldName,
								search_type        : search_type,                        // might be 'join'
								primary_key        : entityDef.primary_key.field,        // pk of the entity, the target field is belonging in,
								segment_joined     : joined_segmentName,                 // segment of the joined entity,
								entity_joined      : joined_entityName,                  // joined entity,
								field_joined       : joined_fieldName,                   // field of the joined entity,
								primary_key_joined : joined_entityDef.primary_key.field, // primary key of joined entity
								search_type_joined : joined_search_type,                 // search type of the joined field,
							};
							console.log("generating Constraint for " + entityName + "." + fieldName + " (join) ...");
							Generator.generate(target,config);
							
							if( joined_search_type === 'orderby' ){
								Orderbys.push({
									field : joined_fieldName,
								});
							}else{
								Selectbys.push({
									search_segment : joined_segmentName,
									search_entity  : joined_entityName,
									search_field   : joined_fieldName,
									search_type    : joined_search_type,
								});
							}
						}
					}
				}
				else{
					var target = ConstraintMap[search_type];
					
					config.view = {
						APP_NAME    : APP_NAME,
						segment     : segmentName, // segment of the entity,
						entity      : entityName, // entity of the field,
						field       : fieldName, // field,
						search_type : search_type, // search type, key,like,num,timestamp etc,							
						primary_key : entityDef.primary_key.field, // pk of the entity, the target field is belonging in,
					};
					console.log("generating Constraint for " + entityName + "." + fieldName + " (" + search_type + ") ...");
					Generator.generate(target,config);
					
					if( search_type === 'orderby' ){
						Orderbys.push({
							field : fieldName,
						});
					}else{
						Selectbys.push({
							search_segment : segmentName,
							search_entity  : entityName,
							search_field   : fieldName,
							search_type    : search_type,
						});
					}
				}
			}
		}
		
		// junction table
		if( entityDef.aggregate ){
			var jnx_segment_entities = entityDef.aggregate.split(',');
			for( var k=0; k<jnx_segment_entities.length; k++ ){
				var jnx_segment_entity   = jnx_segment_entities[k];
				var array_segment_entity = jnx_segment_entity.split('/');
				var jnx_segmentName      = array_segment_entity[0];
				var jnx_entityName       = array_segment_entity[1];
				var jnx_segmentDef       = SegmentMap[jnx_segmentName].module;
				var jnx_entityDef        = jnx_segmentDef[jnx_entityName];
				var col_segment_entity   = jnx_entityDef.collected.entity;
				var array_segment_entity = col_segment_entity.split('/');
				var col_segmentName      = array_segment_entity[0];
				var col_entityName       = array_segment_entity[1];
				var col_segmentDef       = SegmentMap[col_segmentName].module;
				var col_entityDef        = col_segmentDef[col_entityName];
				var col_fieldsDef        = col_entityDef.fields;
				var col_fieldNames       = Object.keys(col_fieldsDef);
				var col_primary_key      = col_entityDef.primary_key.field;
				
				for( var l=0; l<col_fieldNames.length; l++ ){
					var col_fieldName = col_fieldNames[l];
					var col_fieldDef  = col_fieldsDef[col_fieldName];
					
					var col_field_search_def = col_fieldDef.search;
					if( !col_field_search_def ){ continue; }
					
					var col_field_searches = col_field_search_def.split(',');
					for( var m=0; m<col_field_searches.length; m++ ){
						var col_search_type = col_field_searches[m];
						
						if( col_search_type === 'join' ){ continue; } // recursive join not supported
						if( col_search_type === 'orderby' ){ continue; } // orderby via junction is not supported
						
						var target;
						if( segmentName == col_segmentName ){
							target = ConstraintMapForJnx[col_search_type];
						}else{
							target = ConstraintMapForJnxExt[col_search_type];
						}
						
						config.view = {
							APP_NAME        : APP_NAME,
							segment         : segmentName,
							entity          : entityName,
							primary_key     : entityDef.primary_key.field,
							junction        : jnx_entityName,
							segment_jnx     : col_segmentName,
							entity_jnx      : col_entityName,
							primary_key_jnx : col_entityDef.primary_key.field,
							field_jnx       : col_fieldName,
							search_type_jnx : col_search_type,
						};
						console.log("generating Constraint for " + entityName + "." + col_fieldName + " (" + col_search_type + ") (junction) ...");
						Generator.generate(target,config);
						
						Selectbys.push({
							search_segment : col_segmentName,
							search_entity  : col_entityName,
							search_field   : col_fieldName,
							search_type    : col_search_type,
						});
					}
				}
			}
		}
		
		if( Selectbys.length > 0 ){ Selectbys[Selectbys.length-1].last = true; }
		if( Orderbys.length > 0  ){ Orderbys[Orderbys.length-1].last   = true; }
		
		config.view = {
			APP_NAME    : APP_NAME,
			segment     : segmentName,
			entity      : entityName,
			primary_key : entityDef.primary_key.field, // pk of this entity,
			Selectbys   : Selectbys, 
			Orderbys    : Orderbys, 
		};
		console.log("generating Constraint manifest for " + entityName + " ...");
		Generator.generate("Constraint/Segment/EntityManifest",config);
	}
}


// ********** Logic **********

// make Entities
var Entities = [];
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		Entities.push({
			segment : segmentName,
			entity  : entityName,
		});
	}
}
Entities[Entities.length-1].last = true;

// Logic/LogicFactory
config.view = {
	APP_NAME : APP_NAME,
};
console.log("generating Logic/LogicFactory.js ...");
Generator.generate("Logic/LogicFactory",config);

// Logic/LogicManifest
config.view = {
	APP_NAME : APP_NAME,
	Entities : Entities,
};
console.log("generating Logic/LogicManifest.js ...");
Generator.generate("Logic/LogicManifest",config);

// Logic/Segment
config.view = {
	APP_NAME : APP_NAME,
	Segments : Segments,
};
console.log("generating Logic/Segment folders ...");
Generator.generate("Logic/Segment",config);

// Logic/Segment/Entity,Collection
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityDef  = segmentDef[entityNames[j]];
		var entityName = entityNames[j];
		
		// Logic/Segment/Entity
		if( entityDef.type === 'Entity' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var Fields = []; // [{ field:FIELD, last:0|1 }]
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				
				var notNull = false;
				var field_validate_def = fieldDef.validate;
				if( !field_validate_def ){
					notNull = false; // allow null
				}else{
					var field_validates = field_validate_def.split(',');
					for( var l=0; l<field_validates.length; l++ ){
						var field_validate = field_validates[l];
						if( field_validate == 'notNull' ){ notNull = true; } // dont allow null
					}
				}
				
				Fields.push({
					field   : fieldName,
					notNull : notNull,
				});
			}
			
			Fields[Fields.length-1].last = true;
			
			config.view = {
				APP_NAME    : APP_NAME,
				segment     : segmentName,
				entity      : entityName,
				primary_key : entityDef.primary_key.field, // primary key of this entity,
				Fields      : Fields, 
			};
			console.log("generating logic for model:" + entityName + " ...");
			Generator.generate("Logic/Segment/Entity",config);
		}
		// Logic/Segment/Collection
		else if( entityDef.type === 'Collection' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var Fields = [];
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				
				Fields.push({
					field : fieldNames[k],
				});
			}
			
			Fields[Fields.length-1].last = true;
			
			config.view = {
				APP_NAME    : APP_NAME,
				segment     : segmentName,
				entity      : entityName,
				collectorID : entityDef.collector.primary_key,  // pk of collector entity
			};
			console.log("generating logic for model:" + entityName + " (collection) ...");
			Generator.generate("Logic/Segment/Collection",config);
		}
	}
}

// ********** Utils **********

// Utils/Utils
config.view = {
	APP_NAME : APP_NAME,
};
console.log("generating Utils/Utils.js ...");
Generator.generate("Utils/Utils",config);


// ********** Implementation **********

// MyAppImpl.js
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating " + APP_NAME + ".js ...");
Generator.generate("MyAppImpl",config);

// MyAppImpl/package.json
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating package.json");
Generator.generate("MyAppImpl/package",config);

// ***** Model implementation *****

var hasAutoModelImpl = false;
var ImplePermissionCheck = false;

if( MyAppConfig.Permission ){
	hasAutoModelImpl = true;
	ImplePermissionCheck = true;
}

// ModelImpl/ModelImplFactory
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating ModelImplFactory");
Generator.generate("ModelImpl/ModelImplFactory",config);

// ModelSanitizerImpl/ModelSanitizerImplFactory
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating ModelSanitizerImplFactory");
Generator.generate("ModelSanitizerImpl/ModelSanitizerImplFactory",config);

// ModelValidatorImpl/ModelValidatorImplFactory
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating ModelValidatorImplFactory");
Generator.generate("ModelValidatorImpl/ModelValidatorImplFactory",config);

// ConstraintImpl/ConstraintImplFactory
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating ConstraintImplFactory");
Generator.generate("ConstraintImpl/ConstraintImplFactory",config);

// ConstraintImpl/SelectbyImplFactory
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating SelectbyImplFactory");
Generator.generate("ConstraintImpl/SelectbyImplFactory",config);

// ConstraintImpl/OrderbyImplFactory
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating OrderbyImplFactory");
Generator.generate("ConstraintImpl/OrderbyImplFactory",config);

// ***** Logic implementation *****

// 
// precheck
// 
var hasAutoLogicImpl = false;
var ImplAuthLogic = false;
var AuthPassword = false;
if( MyAppConfig.AuthPassword ){
	hasAutoLogicImpl = true;
	ImplAuthLogic = true;
	AuthPassword = true;
}
var TokenLifetime = eval(MyAppConfig.TokenLifetime) || 60*60*24*365; // default token lifetime is 1year

// LogicImpl/LogicImplFactory
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating LogicImplFactory");
Generator.generate("LogicImpl/LogicImplFactory",config);

// LogicImpl/LogicImplManifest
config.view = {
	APP_NAME         : APP_NAME,
	Entities         : Entities,
	hasAutoLogicImpl : hasAutoLogicImpl,
	ImplAuthLogic    : ImplAuthLogic,
	AuthPassword     : AuthPassword,
};
console.log("generating Logic/LogicImplManifest.js ...");
Generator.generate("LogicImpl/LogicImplManifest",config);

// LogicImpl/Auth
if( MyAppConfig.AuthPassword ){
	var auth_elements = MyAppConfig.AuthPassword.match(/(\w+)\/(\w+)\.(\w+),(\w+)/); // format: Segment/Entity.id_field,pass_field
	if( !auth_elements ){
		throw new Error("invalid AuthPassword definition");
	}
	var auth_segment    = auth_elements[1];
	var auth_entity     = auth_elements[2];
	var auth_id_field   = auth_elements[3];
	var auth_pass_field = auth_elements[4];
	config.view = {
		APP_NAME        : APP_NAME,
		Segments        : Segments,
		auth_segment    : auth_segment,
		auth_entity     : auth_entity,
		auth_id_field   : auth_id_field,
		auth_pass_field : auth_pass_field,
		token_lifetime  : TokenLifetime,
	};
	console.log("generating LogicImpl/AuthPassword ...");
	Generator.generate("LogicImpl/AuthPassword",config);
}

// LogicImpl/Segment
config.view = {
	APP_NAME : APP_NAME,
	Segments : Segments,
};
console.log("generating Logic/Segment folders ..."); // unless no need to make folders
Generator.generate("LogicImpl/Segment",config);

// LogicImpl/Segment/Entity,Collection
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityDef  = segmentDef[entityNames[j]];
		var entityName = entityNames[j];
		
		// Logic/Segment/Entity
		if( entityDef.type === 'Entity' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var Fields = []; // [{ field:FIELD, last:0|1 }]
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				
				var notNull = false;
				var field_validate_def = fieldDef.validate;
				if( !field_validate_def ){
					notNull = false; // allow null
				}else{
					var field_validates = field_validate_def.split(',');
					for( var l=0; l<field_validates.length; l++ ){
						var field_validate = field_validates[l];
						if( field_validate == 'notNull' ){ notNull = true; } // dont allow null
					}
				}
				
				Fields.push({
					field   : fieldName,
					notNull : notNull,
				});
			}
			
			Fields[Fields.length-1].last = true;
			
			config.view = {
				APP_NAME      : APP_NAME,
				segment       : segmentName,
				entity        : entityName,
				primary_key   : entityDef.primary_key.field, // primary key of this entity,
				Fields        : Fields, 
				ImplAuthLogic : ImplAuthLogic,
				AuthPassword  : AuthPassword,
			};
			console.log("generating logic for model:" + entityName + " ...");
			Generator.generate("LogicImpl/Segment/Entity",config);
		}
		// Logic/Segment/Collection
		else if( entityDef.type === 'Collection' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var Fields = [];
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				
				Fields.push({
					field : fieldNames[k],
				});
			}
			
			Fields[Fields.length-1].last = true;
			
			config.view = {
				APP_NAME      : APP_NAME,
				segment       : segmentName,
				entity        : entityName,
				collectorID   : entityDef.collector.primary_key,  // pk of collector entity
				ImplAuthLogic : ImplAuthLogic,
				AuthPassword  : AuthPassword,
			};
			console.log("generating logic for model:" + entityName + " (collection) ...");
			Generator.generate("LogicImpl/Segment/Collection",config);
		}
	}
}


// ********** schem **********
// 
// current version supports postgresql/postgis
// 

var FieldTypePgTypeMap = {
	int       : "int",
	int2      : "int2",
	int4      : "int4",
	text      : "text",
	date      : "date",
	timestamp : "timestamp",
	image     : "text",
	geography : "geography(point)",
};

for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	var Entities = [];
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		if( entityDef.type === 'Entity' ){
			var Fields = [];
			
			Fields.push({
				fieldName : entityDef.primary_key.field,
				type      : FieldTypePgTypeMap[entityDef.primary_key.type],
			});
			
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				
				Fields.push({
					fieldName : fieldName,
					type      : FieldTypePgTypeMap[fieldDef.type],
				});
			}
			
			Fields[Fields.length-1].last = true;
			
			var sequenceName = '';
			var start = '';
			if( entityDef.sequence ){
				sequenceName = entityDef.sequence.name;
				start        = entityDef.sequence.start;
			}
			
			Entities.push({
				entityName   : entityName,
				primary_key  : entityDef.primary_key.field,
				Fields       : Fields,
				isEntity     : true,
				sequenceName : sequenceName,
				start        : start,
			});
		}
		else if( entityDef.type === 'Collection' ){
			Entities.push({
				segmentName           : segmentName,
				entityName            : entityName,
				ui_entityName         : entityDef.name,
				collector_primary_key : entityDef.collector.primary_key,
				collected_primary_key : entityDef.collected.primary_key,
				isCollection          : true,
			});
		}
	}
	
	config.view = {
		APP_NAME    : APP_NAME,
		SERVER_NAME : SERVER_NAME,
		segmentName : segmentName,
		Entities    : Entities,
	};
	console.log("generating schema files for postgresql/postgis for segment:"+segmentName);
	Generator.generate("schema/postgresql", config);
}


// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// MyAppConfig
config.view = {
	APP_NAME       : APP_NAME,
	Segments       : Segments,
	SelectAllLimit : SelectAllLimit,
	MaxExpandLevel : MaxExpandLevel,
	ImplAuthLogic  : ImplAuthLogic,
	Protocol       : Protocol,
	AppHost        : AppHost,
	AppPort        : AppPort,
	DBHost         : DBHost,
	DBPort         : DBPort,
	DBUser         : DBUser,
	DBPass         : DBPass,
	CacheHost      : CacheHost,
	CachePort      : CachePort,
};
console.log("generating MyAppConfig ...");
Generator.generate("MyAppConfig",config);

// MyAppConfig/package.json
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating package.json");
Generator.generate("MyAppConfig/package",config);

// MyAppConfig/README.md
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating README.md");
Generator.generate("MyAppConfig/README",config);

// MyAppConfig/SSLDefaultCert
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating default cert for ssl");
Generator.generate("MyAppConfig/SSLDefaultCert",config);

// MyAppConfig/JWSDefaultCert
config.view = {
	APP_NAME : APP_NAME
};
console.log("generating default cert for jws");
Generator.generate("MyAppConfig/JWSDefaultCert",config);


// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// server.js
config.view = {
	APP_NAME : APP_NAME,
	Segments : Segments,
	Protocol : Protocol,
	AppHost  : AppHost,
	AppPort  : AppPort,
};
console.log("generating server.js ...");
Generator.generate("Server",config);


console.log("done.");




