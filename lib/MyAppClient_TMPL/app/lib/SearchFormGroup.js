
// 
// make group of search form elements
// 
// note:
//     
//     * you should assign unique name in your application instance.
//     
//     * dont change the name of group while being in startInteraction and endInteraction,
//       otherwise, registered callbacks will be leaked.
// 
// usage:
//     
//     var SearchFormGroup = require('SearchFormGroup');
//     
//     var group = SearchFormGroup.makeGroup(UNIQUE_NAME);
//     
//     // usually the name of element is its search name like field(type), like 'productID(key)'
//     // var match = name_type.match(/(\w*)\((\w*)\)/);
//     // var field = match[1];
//     // var type  = match[2];
//     group.addElements({name1:$.FORM1,name1:$.FORM2});
//     
//     group.setLogicSelector($.LOGIC);
//     group.setOrderbys($.ORDERBYS);
//     group.setSubmitActionHandler({form:$.SUBMIT,handler:function});
//     
//     var query = formGroup.getQuery();
//     Dispatch.sync({apptag:apptag,params:query,callback:callback});
//     
//     

var logic;
var orderby;

var Notifier = require('NotificationCenter');

function SearchFormGroupConstructor(name){
	this.name          = name; // used as bindkey
	this.elements      = {};
	this.orderbys      = null,
	this.logicSelector = null,
	this.formAction    = null,
	this.interactions  = [];
};

var Group = SearchFormGroupConstructor.prototype;

Group.getName = function(){
	return this.name;
};

Group.getBindKey = function(){
	return this.name;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

Group.listen = function(eventName,callback){
	this.interactions.push({ name:eventName,callback:callback });
};

Group.notify = function(eventName,event){
	var bindkey = this.getBindKey();
	var actual_eventName = [bindkey,eventName].join('/');
	Notifier.notify(actual_eventName,event);
};

Group.startInteraction = function(){
	var bindkey = this.getBindKey();
	// register callbacks
	for( var i=0; i<this.interactions.length; i++ ){
		var interaction = this.interactions[i];
		var actual_eventName = [bindkey,interaction.name].join('/');
		Notifier.listen(actual_eventName,interaction.callback);
	}
};

Group.endInteraction = function(){
	var bindkey = this.getBindKey();
	// clear callbacks
	for( var i=0; i<this.interactions.length; i++ ){
		var interaction = this.interactions[i];
		var actual_eventName = [bindkey,interaction.name].join('/');
		Notifier.remove(actual_eventName,interaction.callback);
	}
	this.interaction = [];
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

Group.addElements = function(elements){
	for( var i=0; i<elements.length; i++ ){
		var form = elements[i];
		var name = form.getName();
		this.elements[name] = form;
		form.setFormGroup(this);
	}
//	var names = Object.keys(elements);
//	for( var i=0; i<names.length; i++ ){
//		var name = names[i];
//		var form = elements[name];
//		this.elements[name] = form;
//		form.setFormGroup(this);
//	}
};

Group.setOrderbys = function(orderbys){
	this.orderbys = orderbys;
};

Group.setLogicSelector = function(selector){
	this.logicSelector = selector;
};

Group.setSubmitAction = function(action){
	this.formAction = action;
	this.formAction.form.setButtonHandler(action.handler);
};

Group.init = function(){
	var names = Object.keys(this.elements);
	for( var i=0; i<names.length; i++ ){
		var name = names[i];
		var form = this.elements[name];
		form.initForm();
	}
	if( this.orderbys ){
		this.orderbys.initForm();
	}
};

Group.updateView = function(){
	var names = Object.keys(this.elements);
	for( var i=0; i<names.length; i++ ){
		var name = names[i];
		var form = this.elements[name];
		form.updateView();
	}
	if( this.orderbys ){
		//this.orderbys.updateView();
	}
};

Group.getQuery = function(){
	var query = {};
	query["constraint"] = {};
	query["orderby"]    = {};
	query["expand"]     = 0; // will be set by application implementation
	
	// constraint
	var names = Object.keys(this.elements);
	for( var i=0; i<names.length; i++ ){
		var name = names[i];
		var form = this.elements[name];
		var constraint = form.getQuery();
		if( constraint ){
			query["constraint"][form.getName()] = constraint;
		}
	}
	
	// logic
	if( this.logicSelector ){
		query["logic"] = this.logicSelector.getLogic();
	}
	
	// orderby
	if( this.orderbys ){
		var sortfield  = this.orderbys.getSortField();
		var sortmethod = this.orderbys.getSortMethod();
		if( sortfield && sortmethod ){
			query["orderby"][sortfield] = sortmethod;
		}
	}
	
	return query;
};

Group.getTextExpressionOfConstraint = function(){
	var texts = [];
	
	// constraint
	var names = Object.keys(this.elements);
	for( var i=0; i<names.length; i++ ){
		var name = names[i];
		var form = this.elements[name];
		var text = form.getTextExpression();
		if( text ){
			texts.push(text);
		}
	}
	
	// orderby
	if( this.orderbys ){
		var text  = this.orderbys.getTextExpression();
		if( text ){
			texts.push(text);
		}
	}
	
	return texts;
};

Group.getTextExpressionOfLogic = function(){
	return this.logicSelector.getTextExpression();
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var makeGroup = function(config){
	return new SearchFormGroupConstructor(config);
};

module.exports = {
	makeGroup : makeGroup
};

