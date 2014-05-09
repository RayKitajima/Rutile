
var fs = require('fs');

// ***** functions for mustache *****

var Align_dslash = function(){
	return function(text,render){
		var rendered_text = render(text);
		var lines = rendered_text.split('\n');
		
		var index = 0;
		for( var i=0; i<lines.length; i++ ){
			var res = lines[i].match('//');
			if( !res ){ continue; }
			if( res['index'] > index ){
				index = res['index'];
			}
		}
		
		var new_lines = [];
		for( var i=0; i<lines.length; i++ ){
			var key_val = lines[i].split('//');
			if( key_val[1] ){
				var key = key_val[0];
				var val = key_val[1];
				var dif = index - key.length;
				var sep = '';
				for( var j=0; j<dif; j++ ){
					sep = sep + ' ';
				}
				sep += '//';
				var new_line = key + sep + val;
				new_lines.push(new_line);
			}else{
				new_lines.push(lines[i]);
			}
		}
		var new_text = new_lines.join('\n');
		return new_text;
	};
};

var Align_colon = function(){
	return function(text,render){
		var rendered_text = render(text);
		var lines = rendered_text.split('\n');
		
		var index = 0;
		for( var i=0; i<lines.length; i++ ){
			var res = lines[i].match(':');
			if( !res ){ continue; }
			if( res['index'] > index ){
				index = res['index'];
			}
		}
		
		var new_lines = [];
		for( var i=0; i<lines.length; i++ ){
			var key_val = lines[i].split(':');
			if( key_val[1] ){
				var key = key_val[0];
				var val = key_val[1];
				var dif = index - key.length;
				var sep = '';
				for( var j=0; j<dif; j++ ){
					sep = sep + ' ';
				}
				sep += ':';
				var new_line = key + sep + val;
				new_lines.push(new_line);
			}else{
				new_lines.push(lines[i]);
			}
		}
		var new_text = new_lines.join("\n");
		return new_text;
	};
};

var Align_equals = function(){
	return function(text,render){
		var rendered_text = render(text);
		var lines = rendered_text.split('\n');
		
		var index = 0;
		for( var i=0; i<lines.length; i++ ){
			var res = lines[i].match('=');
			if( !res ){ continue; }
			if( res['index'] > index ){
				index = res['index'];
			}
		}
		
		var new_lines = [];
		for( var i=0; i<lines.length; i++ ){
			var key_val = lines[i].split('=');
			if( key_val[1] ){
				var key = key_val[0];
				var val = key_val[1];
				var dif = index - key.length;
				var sep = '';
				for( var j=0; j<dif; j++ ){
					sep = sep + ' ';
				}
				sep += '=';
				var new_line = key + sep + val;
				new_lines.push(new_line);
			}else{
				new_lines.push(lines[i]);
			}
		}
		var new_text = new_lines.join('\n');
		return new_text;
	};
};

var Lc_all = function(){
	return function(text,render){
		var rendered_text = render(text);
		return rendered_text.toLowerCase();
	};
};

var Lc_first = function(){
	return function(text,render){
		var rendered_text = render(text);
		var f = rendered_text.charAt(0).toLowerCase();
		return f + rendered_text.substr(1);
	};
};

var Uc_first = function(){
	return function(text,render){
		var rendered_text = render(text);
		var f = rendered_text.charAt(0).toUpperCase();
		return f + rendered_text.substr(1);
	};
};

var Cut_trail_id = function(){
	return function(text,render){
		var rendered_text = render(text);
		var id = rendered_text.substr(rendered_text.length-2,2);
		if( id === 'ID' || id === 'Id' ){
			return rendered_text.substr(0,rendered_text.length-2);
		}else{
			return rendered_text;
		}
	};
};

var pg_reserved_words = [
	"all", "analyse", "analyze", "and", "any", "are", "array", "as", "asc",
	"asymmetric", "authorization", "binary", "both", "case", "cast", "check",
	"collate", "collation", "column", "concurrently", "constraint", "create",
	"cross", "current_catalog", "current_date", "current_role", "current_schema",
	"current_time", "current_timestamp", "current_user", "default", "deferrable",
	"desc", "distinct", "do", "else", "end", "except", "false", "fetch", "for",
	"foreign", "freeze", "from", "full", "grant", "group", "having", "ilike", "in",
	"initially", "inner", "intersect", "into", "is", "isnull", "join", "lateral",
	"leading", "left", "like", "limit", "localtime", "localtimestamp", "natural",
	"not", "notnull", "null", "offset", "on", "only", "or", "order", "outer", "over",
	"overlaps", "placing", "primary", "references", "returning", "right", "select",
	"session_user", "similar", "some", "symmetric", "table", "then", "to", "trailing",
	"true", "union", "unique", "user", "using", "variadic", "verbose", "when", "where",
	"window", "with"
];
var pg_reserved_map = {};
pg_reserved_words.map( function(item){ pg_reserved_map[item]=1; } );

var Escape_reserved = function(){
	return function(text,render){
		var rendered_text = render(text);
		var rendered_text_lc = rendered_text.toLowerCase();
		if( pg_reserved_map[rendered_text_lc] ){
			return '\\"' + rendered_text + '\\"';
		}else{
			return rendered_text;
		}
	};
};

var Escape_reserved_raw = function(){
	return function(text,render){
		var rendered_text = render(text);
		var rendered_text_lc = rendered_text.toLowerCase();
		if( pg_reserved_map[rendered_text_lc] ){
			return '\"' + rendered_text + '\"';
		}else{
			return rendered_text;
		}
	};
};

var applyFunctionsForMustache = function(obj){
	obj.Align_dslash        = Align_dslash;
	obj.Align_colon         = Align_colon;
	obj.Align_equals        = Align_equals;
	obj.Lc_all              = Lc_all;
	obj.Lc_first            = Lc_first;
	obj.Uc_first            = Uc_first;
	obj.Cut_trail_id        = Cut_trail_id;
	obj.Escape_reserved     = Escape_reserved;
	obj.Escape_reserved_raw = Escape_reserved_raw;
};

// ***** functions for generator *****

var ucfirst = function(text){
	var f = text.charAt(0).toUpperCase();
	return f + text.substr(1);
};

var confirmPath = function(path){
	var dir = '';
	if( path.match(/^\//) ){
		dir = '/';
	}
	var elements = path.split('/');
	for( var i=1; i<elements.length; i++ ){
		if( dir ){
			dir = dir + '/' + elements[i];
		}else{
			dir = elements[i];
		}
		if( !fs.existsSync(dir) ){
			//console.log("[tools] making dir : "+ dir);
			fs.mkdirSync(dir);
		}
	}
};

module.exports = {
	apply           : applyFunctionsForMustache,
	Align_dslash    : Align_dslash,
	Align_colon     : Align_colon,
	Align_equals    : Align_equals,
	Lc_all          : Lc_all,
	Lc_first        : Lc_first,
	Uc_first        : Uc_first,
	Cut_trail_id    : Cut_trail_id,
	Escape_reserved : Escape_reserved,
	confirmPath     : confirmPath,
	ucfirst         : ucfirst,
};



