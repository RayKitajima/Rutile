
var self = exports;
var navi; // current navigation controller, NavigationGroup|ModalContoller
var listener;

var query = {};

var Dispatch = require('CentralDispatch');
var ImageTools = require('ImageTools');

// entity

var ProductImageModel = require("Model/Product/ProductImage");

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

function onItemClick(e){
	var section = $.SearchResultList.sections[e.sectionIndex];
	var item = section.getItemAt(e.itemIndex);
	listener.listenEntitySelect(item.model);
	navi.close();
}

// delgate object should have listenEntitySelect()
exports.setListener = function(obj){
	listener = obj;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// image featured list
var updateView = function(){
	{{entity_collected}}Model.search({
		query : query,
		callback : function({{#Lc_first}}{{entity_collected}}{{/Lc_first}}s){
			var listView = $.SearchResultList;
			var section = Ti.UI.createListSection();
			var items = [];
			for( var i=0; i<{{#Lc_first}}{{entity_collected}}{{/Lc_first}}s.length; i++ ){
				var image = ImageTools.getImageFromBase64String({{#Lc_first}}{{entity_collected}}{{/Lc_first}}s[i].entity.{{#Lc_first}}{{entity_collected}}{{/Lc_first}});
				var thumb = ImageTools.makeThumbnailImage(image);
				var item = {
					template : "myTemplate",
					properties : {
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
					},
					image : {
						image : thumb,
					},
					label : {
						text : {{#Lc_first}}{{entity_collected}}{{/Lc_first}}s[i].entity.{{featuredFieldName_collected}}, // featured field
						//properties : { left : ImageTools.thumbnailSize() + 50 }, // BUG: not works
					},
					model : {{#Lc_first}}{{entity_collected}}{{/Lc_first}}s[i],
				};
				items.push(item);
			}
			section.setItems(items);
			listView.setSections([section]);
		},
	});
};

exports.setQuery = function(requrest_query){
	query = requrest_query;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// navigation protocol

exports.viewDidLoad = function(){
	navi = Alloy.Globals.navigationControllerStack[0];
	
	// left buttons
	
	var cancelButton = Alloy.createController('Framework/NaviCancelButton');
	cancelButton.setButtonHandler(function(e){
		navi.close();
	});
	navi.setLeftButton(cancelButton.getView());
	
	// no right buttons
	
	// title
	var title = Alloy.createController('Framework/NaviTitle');
	title.setTitle(String.format(L('FrameworkTitleFormatListView'),L('{{segment_collected}}_{{entity_collected}}')));
	navi.setTitleView(title.getView());
	
	updateView();
};

exports.viewWillAppear = function(){
};

exports.viewWillDisappear = function(){
};


