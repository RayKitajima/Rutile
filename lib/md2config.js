
// usage:
//    
//    $ rutile md2config ./Config.txt
//    

console.log("md2config");

var fs = require('fs');
var path = require('path');
var util = require('util');

var mdfile = process.argv[3];

var mdfile_data = fs.readFileSync(mdfile);
var mdfile_lines = mdfile_data.toString().split('\n');

var root = {
	segments : [],
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var trim = function(string){
	if( !string ){ return; }
	string = string.replace(/^\s+/,"");
	string = string.replace(/\s+$/,"");
	return string;
};

var GeoTools = {
	DefaultRegion : {},
};

var PredefinedMapRegion = {
	tokyo : { 
		DefaultRegion : {"longitudeDelta":0.439453125,"longitude":139.78317260742188,"latitude":35.65126037597656,"latitudeDelta":0.46421724557876587},
		DefaultLongitudeDelta : 0.003433227539,
		DefaultLatitudeDelta : 0.003635423956,
	},
	london : {
		DefaultRegion:{"longitudeDelta":0.23178240656852722,"longitude":-0.12657129764556885,"latitude":51.499481201171875,"latitudeDelta":0.2272561639547348},
		DefaultLongitudeDelta : 0.003433227539,
		DefaultLatitudeDelta : 0.003635423956,
	},
	warsaw : {
		DefaultRegion:{"longitudeDelta":0.46396636962890625,"longitude":20.99720573425293,"latitude":52.24742889404297,"latitudeDelta":0.4474026560783386},
		DefaultLongitudeDelta : 0.003433227539,
		DefaultLatitudeDelta : 0.003635423956,
	},
	newyork : {
		DefaultRegion:{"longitudeDelta":0.9280297160148621,"longitude":-73.9920883178711,"latitude":40.72378921508789,"latitudeDelta":1.1077243089675903},
		DefaultLongitudeDelta : 0.003433227539,
		DefaultLatitudeDelta : 0.003635423956,
	}
};

var parse_command = function(command,value,root){
	switch ( command ) {
		case "APP_NAME":
			root[command] = value;
			break;
			
		case "SelectAllLimit":
			root[command] = value;
			break;
			
		case "DefaultLanguage":
			root[command] = value;
			break;
			
		case "GeoTools_DefaultRegion_longitude":
			GeoTools.DefaultRegion.longitude = value;
			break;
			
		case "GeoTools_DefaultRegion_latitude":
			GeoTools.DefaultRegion.latitude = value;
			break;
			
		case "GeoTools_DefaultRegion_longitudeDelta":
			GeoTools.DefaultRegion.longitudeDelta = value;
			break;
			
		case "GeoTools_DefaultRegion_latitudeDelta":
			GeoTools.DefaultRegion.latitudeDelta = value;
			break;
			
		case "GeoTools_DefaultLongitudeDelta":
			GeoTools.DefaultLongitudeDelta = value;
			break;
			
		case "GeoTools_DefaultLatitudeDelta":
			GeoTools.DefaultLatitudeDelta = value;
			break;
			
		case "Map":
			if( PredefinedMapRegion[value.toString().toLowerCase()] ){
				root.GeoTools = PredefinedMapRegion[value.toString().toLowerCase()];
			}
			break;
		
		case "TokenLifetime":
			root[command] = value;
			break;
			
		case "AuthPassword":
			root[command] = value;
			break;
			
		case "UIGenerateOption":
			root[command] = value;
			break;
		
		case "Protocol":
			root[command] = value;
			break;
		
		case "AppHost":
			root[command] = value;
			break;
		
		case "AppPort":
			root[command] = value;
			break;
		
		case "DBHost":
			root[command] = value;
			break;
		
		case "DBPort":
			root[command] = value;
			break;
		
		case "CacheHost":
			root[command] = value;
			break;
		
		case "CachePort":
			root[command] = value;
			break;
		
	}
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var parse_segment = function(schema_name){
	console.log("parsing schema definition : " + schema_name);
	var schema_dir = path.resolve(mdfile,"..");
	var schema_loc = path.resolve(mdfile,"..",schema_name);
	
	var schema_file = fs.readFileSync(schema_loc);
	var lines = schema_file.toString().split('\n');
	
	var segment = {};
	var segmentName = '';
	var ui_segmentName = '';
	
	var in_segment;
	var in_entity;
	var in_collection;
	
	var curr_entity;
	var fields_line = 0;
	
	for( var i=0; i<lines.length; i++ ){
		var line = lines[i];
		
		if( line.match(/^\/\//) ){
			// comment
			continue;
		}
		else if( line.match(/^=/) ){
			// segment start point
			line = line.replace(/^=+/,"");
			line = line.replace(/=+$/,"");
			if( line.indexOf('//') >= 0 ){ line = line.substr(0,line.indexOf('//')); }
			line = trim(line);
			if( !line ){ continue; } // just ignore empty line
			var match = line.match(/(.*)\((.*)\)/);
			segmentName = trim(match[1]);
			ui_segmentName = trim(match[2]);
			if( !segmentName || !ui_segmentName ){ throw new Error("invalid segment definition : "+line); }
			
			// init
			in_segment = true;
			in_entity = false;
			in_collection = false;
		}
		else if( line.match(/^\*/) ){
			// collection start point
			line = line.replace(/^\*+/,"");
			line = line.replace(/\*+$/,"");
			if( line.indexOf('//') >= 0 ){ line = line.substr(0,line.indexOf('//')); }
			line = trim(line);
			if( !line ){ continue; } // just ignore empty line
			var match = line.match(/(.*)\((.*)\)/);
			var collectionName = trim(match[1]);
			var ui_collectionName = trim(match[2]);
			if( !collectionName || !ui_collectionName ){ throw new Error("invalid collection definition : "+line); }
			// init new collection
			segment[collectionName] = {};
			curr_entity = segment[collectionName];
			curr_entity.name = ui_collectionName;
			curr_entity.type = "Collection";
			curr_entity.fields = {};
			curr_entity.collector = {};
			curr_entity.collected = {};
			
			fields_line = 0;
			in_segment = false;
			in_entity = false;
			in_collection = true;
		}
		else if( line.match(/^#/) ){
			// entity start point
			line = line.replace(/^#+/,"");
			line = line.replace(/#+$/,"");
			if( line.indexOf('//') >= 0 ){ line = line.substr(0,line.indexOf('//')); }
			line = trim(line);
			if( !line ){ continue; } // just ignore empty line
			var match = line.match(/(.*)\((.*)\)/);
			var entityName = trim(match[1]);
			var ui_entityName = trim(match[2]);
			if( !entityName || !ui_entityName ){ throw new Error("invalid entity definition : "+line); }
			// init new entity
			segment[entityName] = {};
			curr_entity = segment[entityName];
			curr_entity.name = ui_entityName;
			curr_entity.type = "Entity";
			curr_entity.fields = {};
			curr_entity.featuredFields = [];
			curr_entity.imageFields = [];
			
			fields_line = 0;
			in_segment = false;
			in_entity = true;
			in_collection = false;
		}
		else if( line.match(/^\t/) ){
			if( in_entity ){
				// field definition
				line = line.replace(/^\t+/,"");
				line = line.replace(/\t+$/,"");
				line = line.replace(/\t+/g,"\t");
				if( line.indexOf('//') >= 0 ){ line = line.substr(0,line.indexOf('//')); }
				line = trim(line);
				if( !line ){ continue; } // just ignore empty line
				fields_line++;
				if( fields_line < 3 ){ continue; } // first two lines are ignored
				var elements = line.split(/\t/);
				if( elements.length < 5 ){
					throw new Error("invalid field definition, needs at least 5 elements : "+line);
				}
				var field    = trim(elements[0]);
				var type     = trim(elements[1]);
				var name     = trim(elements[2]);
				var search   = trim(elements[3]);
				var validate = trim(elements[4]);
				var tag      = trim(elements[5]);
				// check null
				if( name     == "-" ){ name     = null; }
				if( search   == "-" ){ search   = null; }
				if( validate == "-" ){ validate = null; }
				// check featured field and image field
				var field_check;
				if( field_check = field.match(/\(\*\)/) ){
					field = field.substring(0,field_check["index"]);
					curr_entity.featuredFields.push(field);
				}
				if( field_check = field.match(/\(i\)/) ){
					field = field.substring(0,field_check["index"]);
					curr_entity.imageFields.push(field);
				}
				// check tags
				var tag_obj = {};
				if( tag ){
					tag_obj = {};
					var tags = tag.split(/,/);
					for( var j=0; j<tags.length; j++ ){
						var keyval = tags[j].split(/:/);
						var tag_key = keyval[0];
						var tag_val = keyval[1];
						tag_key = trim(tag_key);
						tag_val = trim(tag_val);
						tag_obj[tag_key] = tag_val;
						// auto detect : helper makes search tag:join
						if( tag_key == 'helper' ){
							if( search ){
								search += ',join';
							}else{
								search = 'join';
							}
						}
					}
				}
				
				if( fields_line == 3 ){
					// first field is primary key definition
					curr_entity.primary_key = {
						field    : field,
						type     : type,
						name     : name,
						search   : search,
						validate : validate,
					};
					if( tag_obj ){
						Object.keys(tag_obj).map(function(k){ curr_entity.primary_key[k]=tag_obj[k]; });
					}
				}else{
					// rest is normal field
					curr_entity.fields[field] = {
						type     : type,
						name     : name,
						search   : search,
						validate : validate,
					};
					if( tag_obj ){
						Object.keys(tag_obj).map(function(k){ curr_entity.fields[field][k]=tag_obj[k]; });
					}
				}
			}
			else if( in_collection ){
				// collection definition
				line = line.replace(/^\t+/,"");
				line = line.replace(/\t+$/,"");
				line = line.replace(/\t+/g,"\t");
				if( line.indexOf('//') >= 0 ){ line = line.substr(0,line.indexOf('//')); }
				line = trim(line);
				if( !line ){ continue; } // just ignore empty line
				fields_line++;
				if( fields_line < 3 ){ continue; } // first two lines are ignored
				var elements = line.split(/\t/);
				if( elements.length < 2 ){
					throw new Error("invalid collection definition, needs at least 3 elements : "+line);
				}
				var target   = trim(elements[0]);
				var type     = trim(elements[1]);
				var name     = trim(elements[2]) || null;
				var validate = trim(elements[3]) || null;
				var match = target.match(/(.*)\.(.*)/);
				var target_entity = trim(match[1]);
				var target_pk = trim(match[2]);
				
				if( fields_line == 3 ){
					// collector entity
					curr_entity.collector.entity = target_entity;
					curr_entity.collector.primary_key = target_pk;
				}
				else if( fields_line == 4 ){
					// collected entity
					curr_entity.collected.entity = target_entity;
					curr_entity.collected.primary_key = target_pk;
					curr_entity.fields[target_pk] = {
						name     : name,
						type     : type,
						validate : validate,
					};
				}
				else{
					throw new Error("unexpected field line : "+line);
				}
			}
		}
		else{
			if( in_entity ){
				// entity attributes
				if( line.indexOf('//') >= 0 ){ line = line.substr(0,line.indexOf('//')); }
				line = trim(line);
				if( !line ){ continue; } // just ignore empty line
				var keyval = line.split(/:/);
				var key = keyval[0];
				var val = keyval[1];
				
				if( key == "sequence" ){
					// sequence definition
					var match = val.match(/(.*)\((\d+)\)/);
					curr_entity.sequence = {
						name  : match[1],
						start : match[2],
					};
				}
				else{
					curr_entity[key] = val;
				}
			}
		}
	}
	
	// write out
	var out_file = schema_name.replace(/\.txt$/,".js");
	var out_path = path.resolve(schema_dir,out_file);
	
	var formatted = util.inspect(segment,false,null);
	
	var out_data = "\n";
	out_data += "var Entities = " + formatted + ";\n\n";
	out_data += "module.exports = {\n";
	out_data += "	name : " + "\'" + segmentName + "\',\n";
	out_data += "	ui_segmentName : " + "\'" + ui_segmentName + "\',\n";
	out_data += "	Entities : Entities,\n";
	out_data += "};\n\n";
	
	fs.writeFileSync(out_path,out_data);
	
	root.segments.push({ file:out_file });
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

for( var i=0; i<mdfile_lines.length; i++ ){
	var line = mdfile_lines[i];
	if( !line ){ continue; }
	
	var match;
	
	if( match = line.match(/^\/\//) ){
		// comment
		continue;
	}
	else if( match = line.match(/^@/) ){
		// parse segment file
		var segment_file = line.substring(match["index"]+1);
		parse_segment(segment_file);
	}
	else{
		// cmd:value definition
		line = trim(line);
		if( !line ){ continue; }
		var array = line.split(/:/);
		var command = trim(array[0]);
		var value = trim(array[1]);
		if( !command || !value ){ continue; }
		// set root[command] = value;
		parse_command(command,value,root);
	}
}

if( GeoTools.DefaultRegion.longitude ){ // user requires custom region
	root.GeoTools = GeoTools;
}

var config_file = mdfile.replace(/\.txt$/,".js");
var config_path = path.resolve(mdfile,"..",config_file);
var formatted_config = util.inspect(root,false,null);

console.log("writing config file");
var config_data = "\n";
config_data += "module.exports = " + formatted_config + ";\n\n";
fs.writeFileSync(config_path,config_data);

console.log("done");


