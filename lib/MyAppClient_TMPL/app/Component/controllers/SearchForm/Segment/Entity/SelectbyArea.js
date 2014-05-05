
// area

var self = exports;

exports.getName = function(){
	return "{{constraint_segment}}/{{constraint_entity}}.{{constraint_fieldName}}({{search_type}})"; // Selectby module key in the server side
};

var formGroup;
exports.setFormGroup = function(group){
	formGroup = group;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var items = [];
var separators = [];

var updateView = function(){
	return; // deprecated
};

var addItem = function(item){
	if( !item ){
		item = Alloy.createController('Framework/SearchFormElementArea');
	}
	item.setClearButtonHandler(function(){
		if( item.getValue() ){
			item.setValue({ "centroid":null, "distance":0 });
		}else{
			removeItem(item);
			updateView();
		}
	});
	item.initForm();
	items.push(item);
	
	var container = $.Elements;
	if( items.length > 1 ){
		var separator = Alloy.createController('Framework/FormElementSeparator');
		separators.push(separator);
		container.add(separator.getView());
	}
	container.add(item.getView());
};

var removeItem = function(item){
	var container = $.Elements;
	if( items.length > 1 ){
		var items_alive = [];
		var loc = 0;
		for( var i=0; i<items.length; i++ ){
			if( items[i] != item ){
				items_alive.push(items[i]);
			}else{
				loc = i;
			}
		}
		items = items_alive;
		container.remove(item.getView());
		var removed_separators;
		if( loc != 0 ){
			removed_separators = separators.splice(loc-1,1);
		}else{
			removed_separators = separators.splice(0,1);
		}
		container.remove(removed_separators[0].getView());
	}
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

$.AddButton.setButtonHandler(function(){
	addItem();
	updateView();
});

exports.updateView = function(){
	updateView();
};

// for internal program, adding Framework/SearchFormElementKey instance without ui
exports.addItem = function(item){
	addItem(item);
};

// for internal program, adding Framework/SearchFormElementKey instance without ui
exports.removeItem = function(item){
	removeItem(item);
};

exports.initForm = function(){
	items = [];
	addItem();
	updateView();
};

exports.getTextExpression = function(){
	var texts = [];
	for( var i=0; i<items.length; i++ ){
		var text = items[i].getTextExpression();
		if( text ){
			texts.push(text);
		}
	}
	var textExp = '';
	if( texts.length > 0 ){
		var logic = $.LogicSelector.getTextExpression();
		textExp += L("{{constraint_segment}}_{{constraint_entity}}_{{constraint_fieldName}}");
		textExp += ' (' + L('FrameworkTextExpSearchTypeArea') + ')';
		textExp += ' : ';
		textExp += texts.join(', ');
		if( texts.length > 0 ){
			textExp += ' (' + logic + ')';
		}
	}
	return textExp;
};

exports.getQuery = function(){
	var constraint;
	
	var values = [];
	for( var i=0; i<items.length; i++ ){
		var value = items[i].getValue();
		if( value ){
			values.push(value);
		}
	}
	if( values.length > 0 ){
		var logic = $.LogicSelector.getLogic();
		constraint = { "values":values, "logic":logic };
	}
	
	return constraint;
};

