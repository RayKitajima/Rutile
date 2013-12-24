
// represent title of name expression of the ext-entity

var self = exports;

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var model;
var featureField;

exports.setExtentity = function(extentity){
	model = extentity;
};

exports.getExtentity = function(){
	return model;
};

exports.setFeatureField = function(field_name){
	featureField = field_name;
};

exports.getFeatureField = function(){
	return featureField;
};

var updateView = function(){
	$.Title.text = model.entity[featureField];
};

exports.updateView = function(){
	updateView();
};
