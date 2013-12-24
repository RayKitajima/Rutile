
console.log("start client generator");

var fs = require('fs');
var path = require('path');

var program_file = process.argv[1];

var LIB_PATH = path.resolve(program_file,"../../lib/node_modules/rutile/lib");
var WORKING_DIR = process.cwd();

var tools = require(path.resolve(LIB_PATH,'tools.js'));
var Generator = require(path.resolve(LIB_PATH,'Generator_client'));

// $ rutile generate server ./Config.js
var config_file = process.argv[4];
if( config_file.match(/^\./) ){
	config_file = path.resolve(WORKING_DIR,config_file);
}else{
	throw new Error("invalid config file: "+config_file);
}
var MyAppConfig = require(config_file);

var CONFIG_PATH = path.resolve(config_file,'..');

var incject_autosetter;
var incject_autosetter_file = path.resolve(WORKING_DIR,'Inject/Autosetter.js');
if( fs.existsSync(incject_autosetter_file) ){
	incject_autosetter = require(incject_autosetter_file);
}

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

console.log("loading config...");

var APP_NAME = MyAppConfig.APP_NAME;
var CLIENT_NAME = APP_NAME + "Client";
console.log("APP_NAME    : "+APP_NAME);
console.log("CLIENT_NAME : "+CLIENT_NAME);

var Segments = [];
var SegmentMap = {};
for( var i=0; i<MyAppConfig.segments.length; i++ ){
	var SegmentDef = MyAppConfig.segments[i];
	var SegmentModule = require(path.resolve(CONFIG_PATH,SegmentDef.file));
	Segments.push({
		name    : SegmentModule.name,
		segment : SegmentModule.name, // alias
		module  : SegmentModule.Entities,
		ui_segmentName : SegmentModule.ui_segmentName,
	});
	SegmentMap[SegmentModule.name] = {
		module : SegmentModule.Entities
	};
	console.log("segment name  :"+SegmentModule.name);
	console.log("segment module:"+SegmentModule);
}
Segments[Segments.length-1].last = true;

var Entities = [];               // list of all entities
var SegmentedEntities = [];      // list of entities organized by segment
var SegmentedEntities_pure = []; // list of entities organized by segment without Collection
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	var this_entities = [];
	var this_entities_pure = [];
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		Entities.push({
			segment : segmentName,
			entity  : entityName,
		});
		this_entities.push({
			entity : entityName,
		});
		var entityDef = segmentDef[entityName];
		if( entityDef.type === 'Entity' ){
			this_entities_pure.push({
				entity : entityName,
			});
		}
	}
	this_entities[this_entities.length-1].lastOfEntities = true;
	this_entities_pure[this_entities_pure.length-1].lastOfEntities = true;
	
	SegmentedEntities.push({
		segment  : segmentName,
		Entities : this_entities
	});
	SegmentedEntities_pure.push({
		segment  : segmentName,
		Entities : this_entities_pure
	});
	
	if( i == Segments.length-1 ){
		this_entities[this_entities.length-1].lastOfSegmentedEntities = true;
	}
}
Entities[Entities.length-1].last = true;
SegmentedEntities[SegmentedEntities.length-1].lastOfSegments = true;
SegmentedEntities_pure[SegmentedEntities_pure.length-1].lastOfSegments = true;

var config = {
	APP_NAME     : APP_NAME,
	CLIENT_NAME  : CLIENT_NAME,
	template_dir : LIB_PATH,
	output_dir   : WORKING_DIR,
	tools        : tools,
};

console.log("start generating "+CLIENT_NAME);

// 
// prepare titanium project
// 
// auto generated titanium project by 'titanium create PROJECT' and 'alloy new'
// 

// 
// prepare generation
// 
// at first prepare generated files in to the temporary directory, 
// those should be installed into the appropriate location in Titanium Mobile Project
//     
//     app      : includes index.js, static Framework, generated Component and KitchenSink app
//     i18n     : i18n files
//     lib      : includes static libraries and Rutile Models
//     modules  : includes tipm-socket.io
//     Resource : includes FontAwesome
// 

// ********** Component/EditForm **********

// EditForm/Segment/Entity/fieldName,Collection

var FieldTypeEditorMap = {
	primaryKey     : "Component/EditForm/Segment/Entity/PrimaryKey",
	int            : "Component/EditForm/Segment/Entity/Number",
	int2           : "Component/EditForm/Segment/Entity/Number",
	int4           : "Component/EditForm/Segment/Entity/Number",
	text           : "Component/EditForm/Segment/Entity/TextField",
	textArea       : "Component/EditForm/Segment/Entity/TextArea",
	textField      : "Component/EditForm/Segment/Entity/TextField",
	date           : "Component/EditForm/Segment/Entity/Date",
	timestamp      : "Component/EditForm/Segment/Entity/Timestamp",
	extkey         : "Component/EditForm/Segment/Entity/Extkey",
	image          : "Component/EditForm/Segment/Entity/Image",
	geography      : "Component/EditForm/Segment/Entity/Geography",
	collection     : "Component/EditForm/Segment/Entity/Collection",
	collection_img : "Component/EditForm/Segment/Entity/Collection_Img",
};

// predefined autosetters
var EditFormAutosetter = {
	"imageSelected" : {
		type     : fs.readFileSync(path.resolve(LIB_PATH,"MyAppClient_TMPL/snippet/EditFormAutosetter/ImageSelectedMimeType.js")).toString(),
		mimeType : fs.readFileSync(path.resolve(LIB_PATH,"MyAppClient_TMPL/snippet/EditFormAutosetter/ImageSelectedMimeType.js")).toString(),
		width    : fs.readFileSync(path.resolve(LIB_PATH,"MyAppClient_TMPL/snippet/EditFormAutosetter/ImageSelectedWidth.js")).toString(),
		height   : fs.readFileSync(path.resolve(LIB_PATH,"MyAppClient_TMPL/snippet/EditFormAutosetter/ImageSelectedHeight.js")).toString(),
		length   : fs.readFileSync(path.resolve(LIB_PATH,"MyAppClient_TMPL/snippet/EditFormAutosetter/ImageSelectedLength.js")).toString(),
	},
};

for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		// Segment/Entity
		if( entityDef.type === 'Entity' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			// editor for primarykey (read only ui)
			config.view = {
				APP_NAME                 : APP_NAME,
				CLIENT_NAME              : CLIENT_NAME,
				segment                  : segmentName,
				entity                   : entityName,
				primary_key              : entityDef.primary_key.field,
				fieldName                : entityDef.primary_key.field,
				segment_joined           : '',
				entity_joined            : '',
				featuredFieldName_joined : '',
			};
			// force generate read only editor element for primarykey
			console.log("generating EditForm for " + segmentName + '/' + entityName + "." + entityDef.primary_key.field);
			Generator.generate(FieldTypeEditorMap["primaryKey"], "controllers", config);
			Generator.generate(FieldTypeEditorMap["primaryKey"], "styles",      config);
			Generator.generate(FieldTypeEditorMap["primaryKey"], "views",       config);
			
			// editor for fields
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				var helper    = fieldDef.helper;
				var editor    = fieldDef.editor || fieldDef.type;
				
				var segment_joined;
				var entity_joined;
				var featuredFieldName_joined;
				if( helper ){ // type:extkey
					var helper_segment_entity = helper.split('/');
					segment_joined    = helper_segment_entity[0];
					entity_joined     = helper_segment_entity[1];
					var joined_segmentDef = SegmentMap[segment_joined].module;
					var joined_entityDef  = joined_segmentDef[entity_joined];
					featuredFieldName_joined = joined_entityDef.featuredFields[0]; // multiple featured fields allowed
					
					editor = "extkey";
				}
				
				var autoset_event = '';
				var autosetter = '';
				if( fieldDef.autoset ){
					autoset_event = fieldDef.autoset;
					if( incject_autosetter && incject_autosetter[autoset_event] && incject_autosetter[autoset_event][segmentName+'/'+entityName+'.'+fieldName] ){
						// prioritize user injection
						autosetter = incject_autosetter[autoset_event][segmentName+'/'+entityName+'.'+fieldName];
					}else{
						// preset
						autosetter = EditFormAutosetter[fieldDef.autoset][fieldName];
					}
				}
				
				config.view = {
					APP_NAME                 : APP_NAME,
					CLIENT_NAME              : CLIENT_NAME,
					segment                  : segmentName,
					entity                   : entityName,
					primary_key              : entityDef.primary_key.field,
					fieldName                : fieldName,
					autoset_event            : autoset_event,
					autosetter               : autosetter,
					segment_joined           : segment_joined,
					entity_joined            : entity_joined,
					featuredFieldName_joined : featuredFieldName_joined,
				};
				
				console.log("generating EditForm for " + segmentName + '/' + entityName + "." + fieldName + ", editor:"+editor);
				Generator.generate(FieldTypeEditorMap[editor], "controllers", config);
				Generator.generate(FieldTypeEditorMap[editor], "styles",      config);
				Generator.generate(FieldTypeEditorMap[editor], "views",       config);
			}
			
			// editor for collection
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
						
						var collected_segmentDef = SegmentMap[segment_joined].module;
						var collected_entityDef  = joined_segmentDef[collected_entity];
						var featuredFieldName_collected = collected_entityDef.featuredFields[0]; // multiple featured fields allowed
						
						if( collected_entityDef.featuringImage ){
							config.view = {
								APP_NAME                    : APP_NAME,
								CLIENT_NAME                 : CLIENT_NAME,
								segment                     : segmentName,
								entity                      : entityName,
								primary_key                 : entityDef.primary_key.field,
								fieldName                   : collected_entityDef.primary_key.field, // pseudo field for colleciton
								segment_collected           : collector_segment,
								entity_collected            : collected_entity,
								imageFieldName_collected    : collected_entityDef.imageFields[0], // multiple image fields allowed
								featuredFieldName_collected : featuredFieldName_collected,
							};
							console.log("generating EditForm(collection) for " + segmentName + '/' + entityName + "." + collected_entityDef.primary_key.field + " [featuringImage]");
							Generator.generate(FieldTypeEditorMap["collection_img"], "controllers", config);
							Generator.generate(FieldTypeEditorMap["collection_img"], "styles",      config);
							Generator.generate(FieldTypeEditorMap["collection_img"], "views",       config);
						}else{
							config.view = {
								APP_NAME                    : APP_NAME,
								CLIENT_NAME                 : CLIENT_NAME,
								segment                     : segmentName,
								entity                      : entityName,
								primary_key                 : entityDef.primary_key.field,
								fieldName                   : collected_entityDef.primary_key.field, // pseudo field for colleciton
								segment_collected           : collector_segment,
								entity_collected            : collected_entity,
								featuredFieldName_collected : featuredFieldName_collected,
							};
							console.log("generating EditForm(collection) for " + segmentName + '/' + entityName + "." + collected_entityDef.primary_key.field);
							Generator.generate(FieldTypeEditorMap["collection"], "controllers", config);
							Generator.generate(FieldTypeEditorMap["collection"], "styles",      config);
							Generator.generate(FieldTypeEditorMap["collection"], "views",       config);
						}
						
					}
				}
			}
		}
		
		// no Editor for Collection itself
		else if( entityDef.type === 'Collection' ){
			console.log("no Editor for Collection itself:"+entityName);
		}
	}
}


// ********** Component/SearchForm **********

// SearchForm/Segment/Entity/fieldName,Collection

var SearchTypeSearchFormMap = {
	key       : "Component/SearchForm/Segment/Entity/SelectbyKey",
	like      : "Component/SearchForm/Segment/Entity/SelectbyLike",
	num       : "Component/SearchForm/Segment/Entity/SelectbyNum",
	date      : "Component/SearchForm/Segment/Entity/SelectbyDate",
	timestamp : "Component/SearchForm/Segment/Entity/SelectbyTimestamp",
	area      : "Component/SearchForm/Segment/Entity/SelectbyArea",
	nearby    : "Component/SearchForm/Segment/Entity/SelectbyNearby",
};

for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		// no component for collection
		if( entityDef.type === 'Collection' ){ continue; }
		
		// prep manifest
		var Selectbys = []; // [{ field:field name, search_type:search type, key,like,num,timestamp etc, last:0|1 }],
		var Orderbys  = []; // [{ field:field name, last:0|1, } ],
		
		// search form for primary_key
		var primary_key_search_def = entityDef.primary_key.search;
		if( primary_key_search_def ){
			var primary_key_searches = primary_key_search_def.split(',');
			
			for( var k=0; k<primary_key_searches.length; k++ ){
				var search_type = primary_key_searches[k];
				
				if( search_type === 'orderby' ){
					Orderbys.push({
						segment_orderby   : segmentName,
						entity_orderby    : entityName,
						fieldName_orderby : entityDef.primary_key.field,
					});
				}else{
					// 
					// segment and entity defines module location and module name
					// 
					// ex)
					//     searching Product/Product with Product/ProductProduct.productName as like type
					//     module location : Component/SearchForm/Product/Product/
					//     module name     : SelectbyProductProductProductNameLike.js
					// 
					// * module location : Component/SearchForm/<target segment>/<target entity>/
					// * module name     : Selectby<constrain segment><constrain entity><constrain field><search type>.js
					// 
					
					config.view = {
						APP_NAME             : APP_NAME,
						CLIENT_NAME          : CLIENT_NAME,
						
						segment              : segmentName,
						entity               : entityName,
						primary_key          : entityDef.primary_key.field,
						
						constraint_segment   : segmentName,
						constraint_entity    : entityName,
						constraint_fieldName : entityDef.primary_key.field,
						search_type          : search_type,
					};
					console.log("generating SearchForm(primaryKey) for " + segmentName + '/' + entityName + "." + entityDef.primary_key.field);
					Generator.generate(SearchTypeSearchFormMap[search_type], "controllers", config);
					Generator.generate(SearchTypeSearchFormMap[search_type], "styles",      config);
					Generator.generate(SearchTypeSearchFormMap[search_type], "views",       config);
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
				
				if( search_type == 'join' ){
					
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
							
							if( joined_search_type === 'join' ){ continue; }
							
							if( joined_search_type === 'orderby' ){
								Orderbys.push({
									segment_orderby   : joined_segmentName,
									entity_orderby    : joined_entityName,
									fieldName_orderby : joined_fieldName,
								});
							}else{
								// 
								// segment_joined,entity_joined,field_joined,search_type_joined 
								// should be re-mapped to segment,entity,field,search_type in concrete generaotr
								// 
								// segment and entity defines module location,
								// segment_joined,entity_joined,field_joined,searh_type_joined defeines module name.
								// 
								// ex)
								//     searching Product/Product with Product/ProductClass.productClassCode as key type
								//     module location : Component/SearchForm/Product/Product/
								//     module name     : SelectbyProductClassProductClassProductClassCodeKey.js
								// 
								// * module location : Component/SearchForm/<target segment>/<target entity>/
								// * module name     : Selectby<constrain segment><constrain entity><constrain field><search type>.js
								// 
								
								config.view = {
									APP_NAME             : APP_NAME,
									CLIENT_NAME          : CLIENT_NAME,
									
									segment              : segmentName,
									entity               : entityName,
									primary_key          : entityDef.primary_key.field,
									
									constraint_segment   : joined_segmentName,          // segment of the joined entity,
									constraint_entity    : joined_entityName,           // joined entity,
									constraint_fieldName : joined_fieldName,            // field of the joined entity,
									search_type          : joined_search_type,          // search type of the joined field,
								};
								console.log("generating SearchForm(join) for " + segmentName + '/' + entityName + "." + entityDef.primary_key.field + " by " + joined_segmentName + '/' + joined_entityName + '.' + joined_fieldName);
								Generator.generate(SearchTypeSearchFormMap[joined_search_type], "controllers", config);
								Generator.generate(SearchTypeSearchFormMap[joined_search_type], "styles",      config);
								Generator.generate(SearchTypeSearchFormMap[joined_search_type], "views",       config);
							}
						}
					}
				}
				else{
					if( search_type === 'orderby' ){
						Orderbys.push({
							segment_orderby   : segmentName,
							entity_orderby    : entityName,
							fieldName_orderby : fieldName,
						});
					}else{
						// 
						// segment and entity defines module location and module name
						// 
						// ex)
						//     searching Product/Product with Product/ProductProduct.price as number
						//     module location : Component/SearchForm/Product/Product/
						//     module name     : SelectbyProductProductPriceNum.js
						// 
						// * module location : Component/SearchForm/<target segment>/<target entity>/
						// * module name     : Selectby<constrain segment><constrain entity><constrain field><search type>.js
						// 
						
						config.view = {
							APP_NAME             : APP_NAME,
							CLIENT_NAME          : CLIENT_NAME,
							
							segment              : segmentName,
							entity               : entityName,
							primary_key          : entityDef.primary_key.field,
							
							constraint_segment   : segmentName,
							constraint_entity    : entityName,
							constraint_fieldName : fieldName,
							search_type          : search_type,
						};
						console.log("generating SearchForm(plain) for " + segmentName + '/' + entityName + "." + entityDef.primary_key.field);
						Generator.generate(SearchTypeSearchFormMap[search_type], "controllers", config);
						Generator.generate(SearchTypeSearchFormMap[search_type], "styles",      config);
						Generator.generate(SearchTypeSearchFormMap[search_type], "views",       config);
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
						
						if( col_search_type === 'join' ){ continue; }
						if( col_search_type === 'orderby' ){ continue; } // orderby via junction is not supported
						
						if( col_search_type === 'orderby' ){
							// orderby via junction is not supported
						}else{
							// 
							// segment_jnx,entity_jnx,field_jnx,search_type_jnx 
							// should be re-mapped to segment,entity,field,search_type in concrete generaotr
							// 
							// segment and entity defines module location,
							// segment_jnx,entity_jnx,field_jnx,searh_type_jnx defeines module name.
							// ex)
							//     searching Product/Product with Product/ProductImage.width as number connected by ProductProductImage
							//     module location : Component/SearchForm/Product/Product/
							//     module name     : SelectbyProductProductImageWidthNum.js
							// 
							// * module location : Component/SearchForm/<target segment>/<target entity>/
							// * module name     : Selectby<constrain segment><constrain entity><constrain field><search type>.js
							// 
							
							// there is no info about junction table in SearchForm that creates query,
							// it is matter of server side, and is defined in ConstraintManifest for each target entity.
							
							config.view = {
								APP_NAME             : APP_NAME,
								CLIENT_NAME          : CLIENT_NAME,
								
								segment              : segmentName,
								entity               : entityName,
								primary_key          : entityDef.primary_key.field,
								
								//junction             : jnx_entityName,                   // might be not used
								//primary_key_jnx      : col_entityDef.primary_key.field,  // primary key of collected entity
								
								constraint_segment   : col_segmentName,                  // segment of the collected entity,
								constraint_entity    : col_entityName,                   // collected entity,
								constraint_fieldName : col_fieldName,                    // field of the collected entity,
								search_type          : col_search_type,                  // search type of the field,
							};
							console.log("generating SearchForm(jnx) for " + segmentName + '/' + entityName + "." + collected_entity.primary_key);
							Generator.generate(SearchTypeSearchFormMap[col_search_type], "controllers", config);
							Generator.generate(SearchTypeSearchFormMap[col_search_type], "styles",      config);
							Generator.generate(SearchTypeSearchFormMap[col_search_type], "views",       config);
						}
					}
				}
			}
		}
		
		// orderbys
		
		if( Orderbys.length > 0  ){ Orderbys[Orderbys.length-1].last   = true; }
		
		config.view = {
			APP_NAME    : APP_NAME,
			CLIENT_NAME : CLIENT_NAME,
			segment     : segmentName,
			entity      : entityName,
			primary_key : entityDef.primary_key.field, // pk of this entity,
			Orderbys    : Orderbys, 
		};
		console.log("generating SearchForm(orderby) for " + segmentName + '/' + entityName);
		Generator.generate("Component/SearchForm/Segment/Entity/Orderbys", "controllers", config);
		Generator.generate("Component/SearchForm/Segment/Entity/Orderbys", "styles",      config);
		Generator.generate("Component/SearchForm/Segment/Entity/Orderbys", "views",       config);
	}
}


// ********** Framework **********

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
console.log("generating(writing) Framework");
Generator.generate("Framework", "controllers", config);
Generator.generate("Framework", "styles",      config);
Generator.generate("Framework", "views",       config);


// ********** KitchenSink/index **********

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
if( MyAppConfig.GeoTools ){
	config.view.GeoTools                              = true;
	config.view.GeoTools_DefaultRegion_longitude      = MyAppConfig.GeoTools.DefaultRegion.longitude;
	config.view.GeoTools_DefaultRegion_longitudeDelta = MyAppConfig.GeoTools.DefaultRegion.longitudeDelta;
	config.view.GeoTools_DefaultRegion_latitude       = MyAppConfig.GeoTools.DefaultRegion.latitude;
	config.view.GeoTools_DefaultRegion_latitudeDelta  = MyAppConfig.GeoTools.DefaultRegion.latitudeDelta;
	config.view.GeoTools_DefaultLongitudeDelta        = MyAppConfig.GeoTools.DefaultLongitudeDelta;
	config.view.GeoTools_DefaultLatitudeDelta         = MyAppConfig.GeoTools.DefaultLatitudeDelta;
}
console.log("generating KitchenSink index");
Generator.generate("KitchenSink/index", "controllers", config);
Generator.generate("KitchenSink/index", "styles",      config);
Generator.generate("KitchenSink/index", "views",       config);


// ********** KitchenSink/EntityList **********

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
	SegmentsDef : SegmentedEntities_pure, // [{ segment:, Entities:, last:0|1 }] without collection
};
console.log("generating KitchenSink index");
Generator.generate("KitchenSink/EntityList", "controllers", config);
Generator.generate("KitchenSink/EntityList", "styles",      config);
Generator.generate("KitchenSink/EntityList", "views",       config);


// ********** KitchenSink logics **********

// KitchenSink/Segment/Entity/*

for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		// Segment/Entity
		
		var PrimaryKeySearches = [];
		var Fields = [];
		var Fields_joined_all = [];
		var Fields_joined_all_grouped = [];
		var Fields_collected_all = [];
		var Fields_collected_all_grouped = [];
		
		var Orderbys = [];
		var Orderbys_joined_all = [];
		// orderby collected item is not allowed
		
		if( entityDef.type === 'Entity' ){
			
			// primaykey of this entity
			var pk_search_def = entityDef.primary_key.search;
			var pk_search_types = [];
			var pk_searches = pk_search_def.split(',');
			for( var l=0; l<pk_searches.length; l++ ){
				var search_type_pk = pk_searches[l];
				if( search_type_pk == 'orderby' ){
					Orderbys.push({
						segment_orderby   : segment,
						entity_orderby    : entity,
						fieldName_orderby : primary_key.field,
					});
				}else{
					pk_search_types.push({
						search_type : search_type_pk,
					});
				}
			}
			PrimaryKeySearches.push({
				fieldName      : entityDef.primary_key.field,
				search_types   : pk_search_types,
				is_primary_key : true,
			});
			
			// seek fields
			
			var featuredFieldName = entityDef.featuredFields[0]; // multiple featured fields allowed
			
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var aggregation_joins = [];
			var aggregation_junctions = [];
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				var helper    = fieldDef.helper;
				
				var field_search_def = fieldDef.search;
				var search_types = [];
				if( field_search_def ){
					var field_searches = field_search_def.split(',');
					for( var l=0; l<field_searches.length; l++ ){
						var search_type = field_searches[l];
						if( search_type == 'join' ){ continue; }
						if( search_type == 'orderby' ){
							Orderbys.push({
								segment_orderby   : segmentName,
								entity_orderby    : entityName,
								fieldName_orderby : fieldName,
							});
						}else{
							search_types.push({
								search_type : search_type
							});
						}
					}
				}
				Fields.push({
					fieldName    : fieldName,
					helper       : helper,
					search_types : search_types,
				});
				
				if( helper ){ // type:extkey
					var helper_segment_entity    = helper.split('/');
					var segment_joined           = helper_segment_entity[0];
					var entity_joined            = helper_segment_entity[1];
					var joined_segmentDef        = SegmentMap[segment_joined].module;
					var joined_entityDef         = joined_segmentDef[entity_joined];
					var primary_key_joined       = joined_entityDef.primary_key;
					var featuredFieldName_joined = joined_entityDef.featuredFields[0]; // multiple featured fields allowed
					aggregation_joins.push({
						fieldName      : fieldName,
						segment_joined : segment_joined,
						entity_joined  : entity_joined,
					});
					
					var PrimaryKeySearches_joined = [];
					var Fields_joined = [];
					var Orderbys_joined = [];
					
					// primaykey of joined entity

					var pk_search_def_joined = joined_entityDef.primary_key.search;
					var pk_search_types_joined = [];
					var pk_searches_joined = pk_search_def_joined.split(',');
					for( var l=0; l<pk_searches_joined.length; l++ ){
						var search_type_joined_pk = pk_searches_joined[l];
						if( search_type_joined_pk == 'orderby' ){
							Orderbys_joined.push({
								segment_orderby   : segment_joined,
								entity_orderby    : entity_joined,
								fieldName_orderby : primary_key_joined.field,
							});
							Orderbys_joined_all.push({
								segment_orderby   : segment_joined,
								entity_orderby    : entity_joined,
								fieldName_orderby : primary_key_joined.field,
							});
						}else{
							pk_search_types_joined.push({
								search_type        : search_type_joined_pk, // for selecting joined item
								search_type_joined : search_type_joined_pk, // for searching base entity
							});
						}
					}
					PrimaryKeySearches_joined.push({
						fieldName      : primary_key_joined.field,
						search_types   : pk_search_types_joined,
					});
					
					// fields of joined entity
					var fieldsDef_joined  = joined_entityDef.fields;
					var fieldNames_joined = Object.keys(fieldsDef_joined);
					for( var l=0; l<fieldNames_joined.length; l++ ){
						var fieldName_joined = fieldNames_joined[l];
						var fieldDef_joined = fieldsDef_joined[fieldName_joined];
						
						var field_search_def_joined = fieldDef_joined.search;
						if( !field_search_def_joined ){ continue; }
						
						var search_types_joined = [];
						
						var field_searches_joined = field_search_def_joined.split(',');
						for( var m=0; m<field_searches_joined.length; m++ ){
							var search_type_joined = field_searches_joined[m];
							if( search_type_joined == 'join' ){ continue; }
							if( search_type_joined == 'orderby' ){
								Orderbys_joined.push({
									segment_orderby   : segment_joined,
									entity_orderby    : entity_joined,
									fieldName_orderby : fieldName_joined,
								});
								Orderbys_joined_all.push({
									segment_orderby   : segment_joined,
									entity_orderby    : entity_joined,
									fieldName_orderby : primary_key_joined.field,
								});
							}else{
								search_types_joined.push({
									search_type        : search_type_joined, // for selecting joined item
									search_type_joined : search_type_joined, // for searching base entity
								});
							}
						}
						
						Fields_joined.push({
							fieldName           : fieldName_joined,
							search_types        : search_types_joined,
							fieldName_joined    : fieldName_joined,
							search_types_joined : search_types_joined,
						});
						Fields_joined_all.push({
							segment_joined      : segment_joined,
							entity_joined       : entity_joined,
							fieldName_joined    : fieldName_joined,
							search_types_joined : search_types_joined,
						});
					}
					Fields_joined[Fields_joined.length-1].last = true;
					
					Fields_joined_all_grouped.push({
						segment_joined : segment_joined,
						entity_joined  : entity_joined,
						Fields         : Fields_joined,
					});
					
					// generate extkey selector for this field
					config.view = {
						APP_NAME                  : APP_NAME,
						CLIENT_NAME               : CLIENT_NAME,
						segment                   : segmentName,
						entity                    : entityName,
						primary_key               : entityDef.primary_key.field,
						segment_joined            : segment_joined,
						entity_joined             : entity_joined,
						primary_key_joined        : primary_key_joined.field,
						PrimaryKeySearches_joined : PrimaryKeySearches_joined,
						featuredFieldName_joined  : featuredFieldName_joined,
						Fields_joined             : Fields_joined,
						Orderbys_joined           : Orderbys_joined,
						hasOrderbys               : Orderbys_joined.length > 0 ? true : false,
					};
/*
					console.log("generating Extkey SearchForm for " + segmentName + '/' + entityName + '.' + fieldName);
					Generator.generate("KitchenSink/Segment/Entity/Extkey/SearchForm", "controllers", config);
					Generator.generate("KitchenSink/Segment/Entity/Extkey/SearchForm", "styles",      config);
					Generator.generate("KitchenSink/Segment/Entity/Extkey/SearchForm", "views",       config);
					
					console.log("generating Extkey List view for " + segmentName + '/' + entityName + '.' + fieldName);
					Generator.generate("KitchenSink/Segment/Entity/Extkey/List", "controllers", config);
					Generator.generate("KitchenSink/Segment/Entity/Extkey/List", "styles",      config);
					Generator.generate("KitchenSink/Segment/Entity/Extkey/List", "views",       config);
					
					console.log("generating Extkey New Editor for " + segmentName + '/' + entityName + '.' + fieldName);
					Generator.generate("KitchenSink/Segment/Entity/Extkey/NewForm", "controllers", config);
					Generator.generate("KitchenSink/Segment/Entity/Extkey/NewForm", "styles",      config);
					Generator.generate("KitchenSink/Segment/Entity/Extkey/NewForm", "views",       config);
*/
				}
			}
			Fields[Fields.length-1].last = true;
			if( Fields_joined_all.length > 0 ){
				Fields_joined_all[Fields_joined_all.length-1].last = true;
			}
			
			// editor for collection
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
						var collector_segment_entity    = aggregate_entityDef.collector.entity.split('/');
						var collector_segment           = collector_segment_entity[0];
						var collector_entity            = collector_segment_entity[1];
						var collected_segment_entity    = aggregate_entityDef.collected.entity.split('/');
						var collected_segment           = collected_segment_entity[0];
						var collected_entity            = collected_segment_entity[1];
						var collected_segmentDef        = SegmentMap[collected_segment].module;
						var collected_entityDef         = collected_segmentDef[collected_entity];
						var primary_key_collected       = collected_entityDef.primary_key;
						var featuredFieldName_collected = collected_entityDef.featuredFields[0]; // multiple featured fields allowed
						
						aggregation_junctions.push({
							segment_collected : collected_segment,
							entity_collected  : collected_entity,
						});
						
						var PrimaryKeySearches_collected = [];
						var Fields_collected = [];
						var Orderbys_collected = [];
						
						// primaykey of collected entity
						var pk_search_def_collected = collected_entityDef.primary_key.search;
						var pk_search_types_collected = [];
						var pk_searches_collected = pk_search_def_collected.split(',');
						for( var l=0; l<pk_searches_collected.length; l++ ){
							var search_type_collected_pk = pk_searches_collected[l];
							if( search_type_collected_pk == 'orderby' ){
								Orderbys_collected.push({
									segment_orderby   : collected_segment,
									entity_orderby    : collected_entity,
									fieldName_orderby : primary_key_collected.field,
								});
							}else{
								pk_search_types_collected.push({
									search_type           : search_type_collected_pk, // for selecting collected item
									search_type_collected : search_type_collected_pk, // for searching base entity
								});
							}
						}
						PrimaryKeySearches_collected.push({
							fieldName      : primary_key_collected.field,
							search_types   : pk_search_types_collected,
						});
						
						// fields of collected entity
						var fieldsDef_collected  = collected_entityDef.fields;
						var fieldNames_collected = Object.keys(fieldsDef_collected);
						for( var l=0; l<fieldNames_collected.length; l++ ){
							var fieldName_collected = fieldNames_collected[l];
							var fieldDef_collected  = fieldsDef_collected[fieldName_collected];
							
							var field_search_def_collected = fieldDef_collected.search;
							//if( !field_search_def_collected ){ continue; }
							
							var search_types_collected = [];
							
							if( field_search_def_collected ){
								var field_searches_collected = field_search_def_collected.split(',');
								for( var m=0; m<field_searches_collected.length; m++ ){
									var search_type_collected = field_searches_collected[m];
									if( search_type_collected == 'join' ){ continue; }
									if( search_type_collected == 'orderby' ){
										Orderbys_collected.push({
											segment_orderby   : collected_segment,
											entity_orderby    : collected_entity,
											fieldName_orderby : fieldName_collected,
										});
									}else{
										search_types_collected.push({
											search_type           : search_type_collected, // for selecting collected item
											search_type_collected : search_type_collected, // for searching base entity
										});
									}
								}
							}
							Fields_collected.push({
								fieldName    : fieldName_collected,
								search_types : search_types_collected,
								fieldName_collected    : fieldName_collected,
								search_types_collected : search_types_collected,
							});
							Fields_collected_all.push({
								fieldName_collected    : fieldName_collected,
								segment_collected      : collected_segment,
								entity_collected       : collected_entity,
								search_types_collected : search_types_collected,
							});
						}
						
						Fields_collected[Fields_collected.length-1].last = true;
						
						Fields_collected_all_grouped.push({
							segment_collected : collected_segment,
							entity_collected  : collected_entity,
							Fields            : Fields_collected,
						});
						
						config.view = {
							APP_NAME                     : APP_NAME,
							CLIENT_NAME                  : CLIENT_NAME,
							segment                      : segmentName,
							entity                       : entityName,
							primary_key                  : entityDef.primary_key.field,
							segment_collected            : collected_segment,
							entity_collected             : collected_entity,
							primary_key_collected        : collected_entityDef.primary_key.field,
							PrimaryKeySearches_collected : PrimaryKeySearches_collected,
							featuredFieldName_collected  : featuredFieldName_collected,
							Fields_collected             : Fields_collected,
							Orderbys_collected           : Orderbys_collected,
							hasOrderbys                  : Orderbys_collected.length > 0 ? true : false,
						};
						
/*
						if( collected_entityDef.featuringImage ){
							// generate collection item selector for this field (case: image oriented item)
							console.log("generating image oriented collected item SearchForm for " + segmentName + '/' + entityName + '.' + fieldName);
							Generator.generate("KitchenSink/Segment/Entity/Collection_Img/SearchForm", "controllers", config);
							Generator.generate("KitchenSink/Segment/Entity/Collection_Img/SearchForm", "styles",      config);
							Generator.generate("KitchenSink/Segment/Entity/Collection_Img/SearchForm", "views",       config);
							
							console.log("generating image oriented collected item List view for " + segmentName + '/' + entityName + '.' + fieldName);
							Generator.generate("KitchenSink/Segment/Entity/Collection_Img/List", "controllers", config);
							Generator.generate("KitchenSink/Segment/Entity/Collection_Img/List", "styles",      config);
							Generator.generate("KitchenSink/Segment/Entity/Collection_Img/List", "views",       config);
							
							console.log("generating image oriented collected item New Editor for " + segmentName + '/' + entityName + '.' + fieldName);
							Generator.generate("KitchenSink/Segment/Entity/Collection_Img/NewForm", "controllers", config);
							Generator.generate("KitchenSink/Segment/Entity/Collection_Img/NewForm", "styles",      config);
							Generator.generate("KitchenSink/Segment/Entity/Collection_Img/NewForm", "views",       config);
						}
						else{
							// generate collection item selector for this field (case: ordinary item)
							console.log("generating collected item SearchForm for " + segmentName + '/' + entityName + '.' + fieldName);
							Generator.generate("KitchenSink/Segment/Entity/Collection/SearchForm", "controllers", config);
							Generator.generate("KitchenSink/Segment/Entity/Collection/SearchForm", "styles",      config);
							Generator.generate("KitchenSink/Segment/Entity/Collection/SearchForm", "views",       config);
							
							console.log("generating collected item List view for " + segmentName + '/' + entityName + '.' + fieldName);
							Generator.generate("KitchenSink/Segment/Entity/Collection/List", "controllers", config);
							Generator.generate("KitchenSink/Segment/Entity/Collection/List", "styles",      config);
							Generator.generate("KitchenSink/Segment/Entity/Collection/List", "views",       config);
							
							console.log("generating collected item New Editor for " + segmentName + '/' + entityName + '.' + fieldName);
							Generator.generate("KitchenSink/Segment/Entity/Collection/NewForm", "controllers", config);
							Generator.generate("KitchenSink/Segment/Entity/Collection/NewForm", "styles",      config);
							Generator.generate("KitchenSink/Segment/Entity/Collection/NewForm", "views",       config);
						}
*/
					}
				}
			}
			if( Fields_collected_all.length > 0 ){
				Fields_collected_all[Fields_collected_all.length-1].last = true;
			}
			
			config.view = {
				APP_NAME                 : APP_NAME,
				CLIENT_NAME              : CLIENT_NAME,
				segment                  : segmentName,
				entity                   : entityName,
				primary_key              : entityDef.primary_key.field,
				featuredFieldName        : featuredFieldName,
				aggregation_joins        : aggregation_joins,
				aggregation_junctions    : aggregation_junctions,
				PrimaryKeySearches       : PrimaryKeySearches,
				Fields                   : Fields,
				Fields_joined            : Fields_joined_all,
				Fields_joined_grouped    : Fields_joined_all_grouped,
				Fields_collected         : Fields_collected_all,
				Fields_collected_grouped : Fields_collected_all_grouped,
				Orderbys                 : Orderbys,
				Orderbys_joined          : Orderbys_joined_all,
				hasOrderbys              : (Orderbys.length + Orderbys_joined_all.length) > 0 ? true : false,
			};
			
			// full ui modules
			
			console.log("generating EditForm for " + segmentName + '/' + entityName);
			Generator.generate("KitchenSink/Segment/Entity/EditForm", "controllers", config);
			Generator.generate("KitchenSink/Segment/Entity/EditForm", "styles",      config);
			Generator.generate("KitchenSink/Segment/Entity/EditForm", "views",       config);
			
			console.log("generating SearchForm for " + segmentName + '/' + entityName);
			Generator.generate("KitchenSink/Segment/Entity/SearchForm", "controllers", config);
			Generator.generate("KitchenSink/Segment/Entity/SearchForm", "styles",      config);
			Generator.generate("KitchenSink/Segment/Entity/SearchForm", "views",       config);
			
			if( entityDef.featuringImage ){
				console.log("generating List(Img) for " + segmentName + '/' + entityName);
				Generator.generate("KitchenSink/Segment/Entity/List_Img", "controllers", config);
				Generator.generate("KitchenSink/Segment/Entity/List_Img", "styles",      config);
				Generator.generate("KitchenSink/Segment/Entity/List_Img", "views",       config);
			}else{
				console.log("generating List for " + segmentName + '/' + entityName);
				Generator.generate("KitchenSink/Segment/Entity/List", "controllers", config);
				Generator.generate("KitchenSink/Segment/Entity/List", "styles",      config);
				Generator.generate("KitchenSink/Segment/Entity/List", "views",       config);
			}
			
			// reusable simple ui modules
			
			console.log("generating Reusable EditForm for " + segmentName + '/' + entityName);
			Generator.generate("KitchenSink/Segment/Entity/EditFormReusable", "controllers", config);
			Generator.generate("KitchenSink/Segment/Entity/EditFormReusable", "styles",      config);
			Generator.generate("KitchenSink/Segment/Entity/EditFormReusable", "views",       config);
			
			console.log("generating Reusable SearchForm for " + segmentName + '/' + entityName);
			Generator.generate("KitchenSink/Segment/Entity/SearchFormReusable", "controllers", config);
			Generator.generate("KitchenSink/Segment/Entity/SearchFormReusable", "styles",      config);
			Generator.generate("KitchenSink/Segment/Entity/SearchFormReusable", "views",       config);
			
			if( entityDef.featuringImage ){
				console.log("generating Reusable List(Img) for " + segmentName + '/' + entityName);
				Generator.generate("KitchenSink/Segment/Entity/ListReusable_Img", "controllers", config);
				Generator.generate("KitchenSink/Segment/Entity/ListReusable_Img", "styles",      config);
				Generator.generate("KitchenSink/Segment/Entity/ListReusable_Img", "views",       config);
			}else{
				console.log("generating Reusable List for " + segmentName + '/' + entityName);
				Generator.generate("KitchenSink/Segment/Entity/ListReusable", "controllers", config);
				Generator.generate("KitchenSink/Segment/Entity/ListReusable", "styles",      config);
				Generator.generate("KitchenSink/Segment/Entity/ListReusable", "views",       config);
			}
		}
		
		// no UI for Collection itself
		else if( entityDef.type === 'Collection' ){
			console.log("no Editor for Collection itself:"+entityName);
		}
	}
}


// ********** i18n **********
// 
// at first, i18n files are created only for the primary language,
// according to the "name" definition for each elements.
// after generation, copy the i18n files then edit for your language.
// 

// modding Segments array
for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	var Entities = [];
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		var Fields = [];
		
		if( entityDef.type === 'Entity' ){
			Fields.push({
				fieldName    : entityDef.primary_key.field,
				ui_fieldName : entityDef.primary_key.name,
			});
			
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				
				Fields.push({
					fieldName    : fieldName,
					ui_fieldName : fieldDef.name,
				});
			}
		}
		// no Editor for Collection itself
		else if( entityDef.type === 'Collection' ){
			console.log("no UI name for Collection itself:"+entityName);
		}
		
		Entities.push({
			segmentName   : segmentName,
			entityName    : entityName,
			ui_entityName : entityDef.name,
			Fields        : Fields,
		});
	}
	
	// * ui_segmentName is defined in the start of this script
	Segments[i].Entities = Entities;
}

config.view = {
	APP_NAME     : APP_NAME,
	CLIENT_NAME  : CLIENT_NAME,
	language     : MyAppConfig.DefaultLanguage, // this will define template language
	Segments     : Segments,
};
console.log("generating i18n files for the default language : " + MyAppConfig.DefaultLanguage);
Generator.generate("i18n", "common", config);



// ********** lib **********

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
console.log("generating(writing) lib");
Generator.generate("lib", "common", config);


// ********** ModelFactory,ModelManifest **********

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
console.log("generating ModelFactory");
Generator.generate("ModelFactory", "common", config);

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
	SegmentsDef : SegmentedEntities, //  [{ segment:, Entities:, last:0|1 }],
};
console.log("generating ModelManifest");
Generator.generate("ModelManifest", "common", config);


// ********** Model **********

for( var i=0; i<Segments.length; i++ ){
	var segmentName = Segments[i].segment;
	var segmentDef  = Segments[i].module;
	var entityNames = Object.keys(segmentDef);
	
	for( var j=0; j<entityNames.length; j++ ){
		var entityName = entityNames[j];
		var entityDef  = segmentDef[entityName];
		
		// Segment/Entity
		
		if( entityDef.type === 'Entity' ){
			var fieldsDef  = entityDef.fields;
			var fieldNames = Object.keys(fieldsDef);
			
			var Fields = [];
			var Fields_joining = [];
			var Fields_collected = [];
			
			// seek fields
			for( var k=0; k<fieldNames.length; k++ ){
				var fieldName = fieldNames[k];
				var fieldDef  = fieldsDef[fieldName];
				var helper    = fieldDef.helper;
				
				var segment_joined;
				var entity_joined;
				var featuredFieldName_joined;
				if( helper ){ // type:extkey
					var helper_segment_entity = helper.split('/');
					segment_joined    = helper_segment_entity[0];
					entity_joined     = helper_segment_entity[1];
					Fields_joining.push({
						segment_joined : segment_joined,
						entity_joined   : entity_joined,
						fieldName      : fieldName,
					});
				}
				Fields.push({
					fieldName : fieldName,
				});
			}
			Fields[Fields.length-1].last = true;
			if( Fields_joining.length > 0 ){
				Fields_joining[Fields_joining.length-1].last = true;
				Fields_joining[Fields_joining.length-1].lastOfFieldJoiningField = true;
			}else{
				Fields[Fields.length-1].lastOfFieldJoiningField = true;
			}
			
			// editor for collection
			var Aggregation = [];
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
						var collector_segment_entity    = aggregate_entityDef.collector.entity.split('/');
						var collector_segment           = collector_segment_entity[0];
						var collector_entity            = collector_segment_entity[1];
						var collected_segment_entity    = aggregate_entityDef.collected.entity.split('/');
						var collected_segment           = collected_segment_entity[0];
						var collected_entity            = collected_segment_entity[1];
						var collected_segmentDef        = SegmentMap[collected_segment].module;
						var collected_entityDef         = collected_segmentDef[collected_entity];
						var featuredFieldName_collected = collected_entityDef.featuredFields[0]; // multiple featured fields allowed
						
						Aggregation.push({
							aggregation_segmentName : aggregate_segmentName,
							aggregation_entityName  : aggregate_entityName,
							segment_collected       : collected_segment,
							entity_collected        : collected_entity,
							primary_key_collected   : collected_entityDef.primary_key.field,
						});
						
						Fields_collected.push({
							primary_key_collected : collected_entityDef.primary_key.field,
							segment_collected     : collected_segment,
							entity_collected      : collected_entity,
						});
					}
				}
			}
			if( Fields_collected.length > 0 ){
				Fields_collected[Fields_collected.length-1].last = true;
				Fields_collected[Fields_collected.length-1].lastOfJoiningCollectedFields = true;
			}
			
			if( Fields_joining.length > 0 && Fields_collected.length == 0 ){
				Fields_joining[Fields_joining.length-1].lastOfJoiningCollectedFields = true;
			}
			
			config.view = {
				APP_NAME         : APP_NAME,
				CLIENT_NAME      : CLIENT_NAME,
				segment          : segmentName,
				entity           : entityName,
				primary_key      : entityDef.primary_key.field,
				Fields           : Fields,
				Fields_joining   : Fields_joining,
				Fields_collected : Fields_collected,
				Aggregation      : Aggregation,
			};
			console.log("generating Model(Entity) for " + segmentName + '/' + entityName);
			Generator.generate("Model/Entity", "common", config);
		}
		
		// no UI for Collection itself
		else if( entityDef.type === 'Collection' ){
			config.view = {
				APP_NAME              : APP_NAME,
				CLIENT_NAME           : CLIENT_NAME,
				segment               : segmentName,
				entity                : entityName,
				collector_primary_key : entityDef.collector.primary_key,
				collected_primary_key : entityDef.collected.primary_key,
			};
			console.log("generating Model(Collection) for " + segmentName + '/' + entityName);
			Generator.generate("Model/Collection", "common", config);
		}
	}
}


// ********** ModelSanitizer **********

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
console.log("generating ModelSanitizerFactory");
Generator.generate("ModelSanitizerFactory", "common", config);

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
	SegmentsDef : SegmentedEntities, //  [{ segment:, Entities:, last:0|1 }],
};
console.log("generating ModelSanitizerManifest");
Generator.generate("ModelSanitizerManifest", "common", config);

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
console.log("generating DummySanitizer");
Generator.generate("DummySanitizer", "common", config);


// ********** etc static files, modules, Resouces **********

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
console.log("generating modules");
Generator.generate("modules", "common", config);

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
console.log("generating resouces");
Generator.generate("Resources", "common", config);

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
console.log("setting up Titanium");
Generator.generate("setup", "common", config);

config.view = {
	APP_NAME    : APP_NAME,
	CLIENT_NAME : CLIENT_NAME,
};
console.log("generating tools");
Generator.generate("tools/tiappmaker", "common", config);
Generator.generate("tools/tiappxmlfixer", "common", config);

console.log("done.");




