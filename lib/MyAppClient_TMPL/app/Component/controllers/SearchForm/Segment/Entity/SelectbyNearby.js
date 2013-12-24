
// nearby

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

var updateView = function(){
	var container = $.Elements;
	container.removeAllChildren();
	for( var i=0; i<items.length; i++ ){
		items[i].setIndex(i);
		container.add(items[i].getView());
		if( i < items.length - 1 ){
			var separator = Alloy.createController('Framework/FormElementSeparator');
			container.add(separator.getView());
		}
	}
};

var addItem = function(){
	var item = Alloy.createController('Framework/SearchFormElementNearby');
	item.setIndex(items.length);
	item.setClearButtonHandler(function(){
		if( item.getValue() ){
			item.setValue({ "centroid":null, "distance":0 });
			item.initForm();
		}else{
			removeItem(item.getIndex());
			updateView();
		}
	});
	item.initForm();
	items.push(item);
};

var removeItem = function(index){
	if( items.length > 1 ){
		items.splice(index,1);
	}
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

$.AddButton.setButtonHandler(function(){
	addItem();
	updateView();
});

// for internal program, adding Framework/SearchFormElementNearby instance without ui
exports.addItem = function(item){
	items.push(item);
};

// for internal program, removing Framework/SearchFormElementNearby instance without ui
exports.removeItem = function(item){
	var index = items.indexOf(item);
	items.splice(index,1);
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
		textExp += ' (' + L('FrameworkTextExpSearchTypeNearby') + ')';
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

