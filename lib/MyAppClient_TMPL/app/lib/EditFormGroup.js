
// 
// make group of edit form elements
// 
// note:
//     
//     * you should assign unique name in your application instance.
//     
//     * dont change the name of group while being in startInteraction and endInteraction,
//       otherwise, registered callbacks will be leaked.
//     
// structure:
//     
//     Model
//     
// usage:
//     
//     var EditFormGroup = require('EditFormGroup');
//     
//     var group = EditFormGroup.makeGroup(UNIQUE_NAME);
//     
//     // usually the name of element is its field name
//     group.setForms([$.FORM,$.FORM2]);
//     
//     // to start cross element interaction
//     group.startInteraction();
//     
//     // you should end interaction when you close your edit form to release callbacks
//     group.endInteraction();
//     
// in element
//     
//     group.listen(EVENT_NAME,callback);
//     
//     group.notify(EVENT_NAME,object);
//     
//     

var Notifier = require('NotificationCenter');

var ModelFactory = require('./Model/ModelFactory');

function EditFormGroupConstructor(name){
	this.name    = name;
	this.bindkey = "EditFormGroup/"+name;
	
	// forms
	// {
	//     model_name : {
	//         field_name : form_object
	//     }
	// }
	// 
	// note:
	//     if the field represent aggregation, field_name will be named as without suffix 'ID'
	// 
	this.forms = {};
	
	// models
	// {
	//     model_name : model_instance
	// }
	this.models = {};
	
	this.interactions = [];
	this.interactive  = false; // whether cross form interaction is working
	this.binding      = false; // whether form entity biding is working
};

var Group = EditFormGroupConstructor.prototype;

Group.assignName = function(name){
	this.name    = name;
	this.bindkey = "EditFormGroup/"+name;
};

Group.getName = function(){
	return this.name;
};

Group.getBindKey = function(){
	return this.bindkey;
};

Group.__defineGetter__('active', function(){
	return this.interactive && this.binding;
});

Group.__defineGetter__('ready', function(){
	var forms  = Object.keys(this.forms);
	var models = Object.keys(this.models);
	return ( (forms.length > 0) && (models.length > 0) ); // whether set form and entity
});

// manually synchronize form value to the appropriate entity
Group.syncEntityToForm = function(){
	var modelNames = Object.keys(this.forms);
	for( var i=0; i<modelNames.length; i++ ){
		var modelName  = modelNames[i];
		var fieldNames = Object.keys(this.forms[modelName]);
		var instance   = this.models[modelName]; // this is instance
		
		for( var j=0; j<fieldNames.length; j++ ){
			var fieldName = fieldNames[j];
			var form = this.forms[modelName][fieldName];
			
			var Model = ModelFactory.getModel(modelName);
			if( Model.inspectField(fieldName) ){
				fieldName = Model.inspectField(fieldName); // convert fieldName if it can be expanded or it represent aggregation
			}
			
			form.setValue(instance[fieldName]); // model[fieldName] sometimes might be objects
		}
	}
};

// manually synchronize entity data to the appropriate form value
Group.syncFormToEntity = function(){
	var modelNames = Object.keys(this.models);
	for( var i=0; i<modelNames.length; i++ ){
		var modelName  = modelNames[i];
		var fieldNames = Object.keys(this.forms[modelName]);
		var instance   = this.models[modelName]; // this is instance
		
		for( var j=0; j<fieldNames.length; j++ ){
			var fieldName = fieldNames[j];
			var form = this.forms[modelName][fieldName];
			instance[fieldName] = form.getValue(); // form.getValue() returns really the field value
		}
	}
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// cross element interaction

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
	this.interactive = true;
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
	this.interactive = false;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// form entity binding

Group.addModels = function(elements){
	for( var i=0; i<elements.length; i++ ){
		var model = elements[i];
		var name  = model.getName();
		this.models[name] = model;
	}
};

Group.setModels = function(elements){
	this.models = [];
	this.addModels(elements);
};

Group.addForms = function(elements){
	for( var i=0; i<elements.length; i++ ){
		var form      = elements[i];
		var formName  = form.getName();
		var res       = formName.split(/\./);
		var modelName = res[0];
		var fieldName = res[1];
		if( !this.forms[modelName] ){
			this.forms[modelName] = {};
		}
		this.forms[modelName][fieldName] = form;
		form.setFormGroup(this);
	}
};

Group.setForms = function(elements){
	this.forms = {};
	this.addForms(elements);
};

Group.startBinding = function(){
	var modelNames = Object.keys(this.forms);
	for( var i=0; i<modelNames.length; i++ ){
		var modelName  = modelNames[i];
		var fieldNames = Object.keys(this.forms[modelName]);
		var model      = this.models[modelName];
		for( var j=0; j<fieldNames.length; j++ ){
			var fieldName = fieldNames[j];
			var form = this.forms[modelName][fieldName];
			model.addObserver(form,fieldName);
			form.addObserver(model);
		}
	}
	this.binding = true;
};

Group.endBinding = function(){
	var modelNames = Object.keys(this.forms);
	for( var i=0; i<modelNames.length; i++ ){
		var modelName  = modelNames[i];
		var fieldNames = Object.keys(this.forms[modelName]);
		var model      = this.models[modelName];
		for( var j=0; j<fieldNames.length; j++ ){
			var fieldName = fieldNames[j];
			var form = this.forms[modelName][fieldName];
			model.removeObserver(form,fieldName);
			form.removeObserver(model);
		}
	}
	this.binding = false;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

Group.activate = function(){
	this.startInteraction();
	this.startBinding();
};

Group.deactivate = function(){
	this.endInteraction();
	this.endBinding();
};

Group.enableEditing = function(){
	var modelNames = Object.keys(this.forms);
	for( var i=0; i<modelNames.length; i++ ){
		var modelName  = modelNames[i];
		var fieldNames = Object.keys(this.forms[modelName]);
		var model      = this.models[modelName];
		for( var j=0; j<fieldNames.length; j++ ){
			var fieldName = fieldNames[j];
			var form = this.forms[modelName][fieldName];
			form.enableEditing();
		}
	}
};

Group.disableEditing = function(){
	var modelNames = Object.keys(this.forms);
	for( var i=0; i<modelNames.length; i++ ){
		var modelName  = modelNames[i];
		var fieldNames = Object.keys(this.forms[modelName]);
		var model      = this.models[modelName];
		for( var j=0; j<fieldNames.length; j++ ){
			var fieldName = fieldNames[j];
			var form = this.forms[modelName][fieldName];
			form.disableEditing();
		}
	}
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var makeGroup = function(config){
	return new EditFormGroupConstructor(config);
};

module.exports = {
	makeGroup : makeGroup
};

