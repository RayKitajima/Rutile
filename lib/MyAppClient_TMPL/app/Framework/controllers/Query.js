
var query;
var constraintTexts;
var logicText;

var ELEMENT_HEIGHT = 20;
var DEFAULT_HEIGHT = 40;

// you should return current view height(rect.height), calculated by actual layout of info objects.
exports.getContentHeight = function(){
	var contentHeight = 0;
	var children = $.QueryElements.getChildren();
	for( var i=0; i<children.length; i++ ){
		var child = children[i];
//console.log("[Query.getContentHeight] ***** element height:"+child.rect.height);
		contentHeight += child.rect.height;
	}
	if( contentHeight == 0 ){ contentHeight = DEFAULT_HEIGHT; }
	
	return contentHeight;
};

exports.getQuery = function(){
	return query;
};

exports.getConstraintTexts = function(){
	return constraintTexts;
};

exports.getLogicText = function(){
	return logicText;
};

exports.setQuery = function(obj){
	query           = obj.query; // object set for searching
	constraintTexts = obj.constraintTexts; // array
	logicText       = obj.logicText; // string
	
	for( var i=0; i<constraintTexts.length; i++ ){
		var element = Alloy.createController('Framework/QueryElement');
		element.setText(constraintTexts[i]);
		$.QueryElements.add(element.getView());
	}
	
	if( logicText ){
		var element = Alloy.createController('Framework/QueryElement');
		element.setText(logicText);
		$.QueryElements.add(element.getView());
	}
	
	if( (constraintTexts.length <= 0) && !logicText ){
		var element = Alloy.createController('Framework/QueryElement');
		element.setText(L('FrameworkTextExpSelectAll'));
		$.QueryElements.add(element.getView());
	}
};
