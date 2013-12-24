
// represent thumbnail of image type field of the ext-entity

var self = exports;

var ImageTools = require('ImageTools');

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
	var image = ImageTools.getImageFromBase64String(model.entity[featureField]);
	var thumb = ImageTools.makeThumbnailImage(image);
	$.SelectedImage.image = thumb;
};

exports.updateView = function(){
	updateView();
};
