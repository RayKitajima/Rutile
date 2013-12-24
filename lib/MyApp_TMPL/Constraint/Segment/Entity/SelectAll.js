
// SelectAll
// 
// segment : {{segment}}
// entity  : {{entity}}
// type    : all
// limit   : {{limit}}
// 

// usage:
//     
//     var SelectAll = require('Constraint/SEGMENT/ENTITY/SelectAll');
//     var selector = new SelectAll();
//     

// you should add a path to the {{APP_NAME}}Config into your NODE_PATH
var config = require('{{APP_NAME}}Config');

var selectall_limit = config.SelectAllLimit;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function Constructor(){
	this.valid = true;
}

module.exports = Constructor;

var SelectAll = Constructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public apis

SelectAll.responsible = function(){
	return this.valid;
};

SelectAll.makeConstraint = function(){
	var sql     = '';
	var params  = [];
	
	sql = " ( select {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}}.{{primary_key}} from {{#Escape_reserved}}{{#Lc_first}}{{entity}}{{/Lc_first}}{{/Escape_reserved}} limit " + selectall_limit + " ) ";
	
	return {
		"sql"             : sql,
		"params"          : params,
		"parameterizable" : true
	};
};

SelectAll.stringify = function(){
	var str = "{{#Lc_first}}{{entity}}{{/Lc_first}}.*:";
	return str;
};

