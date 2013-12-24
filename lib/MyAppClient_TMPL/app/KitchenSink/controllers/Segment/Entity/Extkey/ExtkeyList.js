
var self = exports;
var navi; // current navigation controller, NavigationGroup|ModalContoller
var listener;

var query = {};

var Dispatch = require('CentralDispatch');

// entity

var {{entity_joined}}Model = require("Model/{{segment_joined}}/{{entity_joined}}");

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

function onItemClick(e){
	var section = $.SearchResultList.sections[e.sectionIndex];
	var item = section.getItemAt(e.itemIndex);
	listener.listenEntitySelect(item.model,"{{featuredFieldName_joined}}");
	navi.close();
}

// delgate object should have listenEntitySelect() with featuredField option
exports.setListener = function(obj){
	listener = obj;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var updateView = function(){
	{{entity_joined}}Model.search({
		query    : query,
		callback : function({{#Lc_first}}{{entity_joined}}{{/Lc_first}}s){
			var listView = $.SearchResultList;
			var section = Ti.UI.createListSection();
			var items = [];
			for( var i=0; i<{{#Lc_first}}{{entity_joined}}{{/Lc_first}}s.length; i++ ){
				var item = {
					template : "myTemplate",
					properties : {
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
					},
					label : {
						text : {{#Lc_first}}{{entity_joined}}{{/Lc_first}}s[i].entity.{{featuredFieldName_joined}}, // featured field
					},
					model : {{#Lc_first}}{{entity_joined}}{{/Lc_first}}s[i],
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
	title.setTitle(String.format(L('FrameworkTitleFormatListView'),L('{{segment_joined}}_{{entity_joined}}')));
	navi.setTitleView(title.getView());
	
	updateView();
};

exports.viewWillAppear = function(){
};

exports.viewWillDisappear = function(){
};


