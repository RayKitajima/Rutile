
var self = exports;
var navi; // current navigationController

var infoPanel = Alloy.createController('Framework/InfoPanel'); // stack and view of queries

var updatingView  = false; // true while updating listview
var removingItems = false; // true while removing remote data

var enableItemSelection = true;
var checkedItems = {};

var Dispatch = require('CentralDispatch');
var Notifier = require('NotificationCenter');
var ImageTools = require('ImageTools');

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

// entity

var {{entity}}Model = require("Model/{{segment}}/{{entity}}");

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var selectItem = function(sectionIndex,section,itemIndex,item){
	checkedItems[item.entity.{{primary_key}}] = { sectionIndex:sectionIndex, section:section, itemIndex:itemIndex, item:item };
	item.check.text = fontawesome.icon('fa-check-square-o');
	item.check.color = "#4d771f",
	item.properties.backgroundColor = "#e9ffd0";
	section.replaceItemsAt(itemIndex,1,[item]);
};

var deselectItem = function(sectionIndex,section,itemIndex,item){
	delete checkedItems[item.entity.{{primary_key}}];
	item.check.text = fontawesome.icon('fa-square-o');
	item.check.color = "#aaa",
	item.properties.backgroundColor = "#fff";
	section.replaceItemsAt(itemIndex,1,[item]);
};

function onItemClick(e){
	var section = $.SearchResultList.sections[e.sectionIndex]; // get the clicked section
	var item = section.getItemAt(e.itemIndex); // get the clicked item from that section
	
	if( e.bindId === 'check' || e.bindId === 'checkWrapper' ){
		if( checkedItems[item.entity.{{primary_key}}] ){
			deselectItem(e.sectionIndex,section,e.itemIndex,item);
			if( Object.keys(checkedItems).length == 0 ){
				enableItemSelection = true; // allow page navigation
				navi.hideSubMenu();
			}
		}else{
			selectItem(e.sectionIndex,section,e.itemIndex,item);
			if( Object.keys(checkedItems).length == 1 ){
				enableItemSelection = false; // prevent page navigation
				navi.showSubMenu();
			}
		}
	}else{
		if( !enableItemSelection ){
			$.SearchResultList.deselectItem(e.sectionIndex,e.itemIndex); // prevent item select action while checkbox selection
			return;
		}
		var controller = Alloy.createController('KitchenSink/{{segment}}/{{entity}}/EditForm');
		controller.set{{#Uc_first}}{{primary_key}}{{/Uc_first}}(item.entity.{{primary_key}});
		navi.open(controller);
		
		$.SearchResultList.deselectItem(e.sectionIndex,e.itemIndex);
	}
}

var deselectAllItems = function(){
	var itemIDs = Object.keys(checkedItems);
	for( var i=0; i<itemIDs.length; i++ ){
		var sectionIndex = checkedItems[itemIDs[i]].sectionIndex;
		var section      = checkedItems[itemIDs[i]].section;
		var itemIndex    = checkedItems[itemIDs[i]].itemIndex;
		var item         = checkedItems[itemIDs[i]].item;
		deselectItem(sectionIndex,section,itemIndex,item);
	}
	navi.hideSubMenu();
};

var removeItems = function(){
	var dialog = Ti.UI.createOptionDialog({
		cancel      : 1,
		options     : [ L('FrameworkMessageRemove'), L('FrameworkMessageCancel') ],
		destructive : 0,
		title       : L('FrameworkMessageRemoveConfirmationText') + ' ' + L('FrameworkMessageNoticeCollectionRemoval'),
	});
	dialog.addEventListener('click',function(e){
		if( removingItems ){
			return;
		}
		removingItems = true;
		if(e.index === 0){
			{{entity}}Model.remove({
				ids      : Object.keys(checkedItems),
				callback : function({{#Lc_first}}{{entity}}{{/Lc_first}}s){
					checkedItems = {};
					navi.hideSubMenu();
					updateView();
					removingItems = false;
					enableItemSelection = true;
				},
			});
		}
	});
	dialog.show();
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// pull down event handling
$.SearchResultList.pullView = Ti.UI.createView(); // dummy
$.SearchResultList.addEventListener('pull',function(e){
	if( e.active == true ){
		infoPanel.openContainer();
	}else{
		infoPanel.closeContainer();
	}
});

var updateView = function(){
	if( updatingView ){ return; }
	updatingView = true;
	
	var info = infoPanel.getCurrentInfo();
	var query = info.getQuery();
	
	// show indicator
	var rootWin = navi.getRootWindow();
	rootWin.touchEnabled = false;
	var indicator = Alloy.createController('Framework/Indicator');
	indicator.getView().center = rootWin.center;
	indicator.setMessage(L('FrameworkIndicatorLoadingMessage'));
	indicator.showIndicator();
	rootWin.add(indicator.getView());
	
	{{entity}}Model.search({
		query    : query,
		callback : function({{#Lc_first}}{{entity}}{{/Lc_first}}s){
			var listView = $.SearchResultList;
			var section = Ti.UI.createListSection();
			var items = [];
			for( var i=0; i<{{#Lc_first}}{{entity}}{{/Lc_first}}s.length; i++ ){
				var {{#Lc_first}}{{entity}}{{/Lc_first}} = {{#Lc_first}}{{entity}}{{/Lc_first}}s[i].entity;
				var image = ImageTools.getImageFromBase64String({{#Lc_first}}{{entity}}{{/Lc_first}}s[i].entity.{{#Lc_first}}{{entity}}{{/Lc_first}});
				var thumb = ImageTools.makeThumbnailImage(image);
				var item = {
					template : "ListTemplate",
					properties : {
						backgroundColor         : "#fff",
						selectedBackgroundColor : "#e9ffd0",
						accessoryType           : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
					},
					checkWrapper : {
					},
					check : {
						color : "#aaa",
						font  : {fontSize:"14dp", fontFamily:fontawesome.fontfamily()},
						text  : fontawesome.icon('fa-square-o'),
					},
					image : {
						image : thumb,
					},
					label : {
						text : {{#Lc_first}}{{entity}}{{/Lc_first}}.{{featuredFieldName}}, // featured field
					},
					entity : {{#Lc_first}}{{entity}}{{/Lc_first}},
				};
				items.push(item);
			}
			section.setItems(items);
			listView.setSections([section]);
			
			// hide indicator
			indicator.hideIndicator();
			rootWin.remove(indicator.getView());
			rootWin.touchEnabled = true;
			
			updatingView = false;
		},
	});
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// navigation protocol

exports.viewDidLoad = function(){
	navi = Alloy.Globals.navigationControllerStack[0];
	
	// no left buttons (using default left button, back)
	
	// sub left buttons
	var cancelButton = Alloy.createController('Framework/NaviCancelButton');
	cancelButton.setButtonHandler(function(e){
		deselectAllItems();
	});
	navi.addSubLeftButton(cancelButton.getView());
	
	// right buttons
	var addButton    = Alloy.createController('Framework/NaviAddButton');
	var searchButton = Alloy.createController('Framework/NaviSearchButton');
	addButton.setButtonHandler(function(e){
		var controller = Alloy.createController('KitchenSink/{{segment}}/{{entity}}/EditForm');
		var modalWindow = Alloy.createController('Framework/ModalWindow');
		modalWindow.getView().open();
		modalWindow.navigationGroup.enableBackButton();
		modalWindow.navigationGroup.open(controller);
	});
	searchButton.setButtonHandler(function(e){
		var controller = Alloy.createController('KitchenSink/{{segment}}/{{entity}}/SearchForm');
		var modalWindow = Alloy.createController('Framework/ModalWindow');
		modalWindow.getView().open();
		modalWindow.navigationGroup.enableBackButton();
		modalWindow.navigationGroup.open(controller);
	});
	navi.addRightButton(addButton.getView());
	navi.addRightButton(searchButton.getView());
	
	// sub right buttons
	var trashButton = Alloy.createController('Framework/NaviTrashButton');
	trashButton.setButtonHandler(function(e){
		removeItems();
	});
	navi.addSubRightButton(trashButton.getView());
	
	// title
	var title = Alloy.createController('Framework/NaviTitle');
	title.setTitle(String.format(L('FrameworkTitleFormatListView'),L('{{segment}}_{{entity}}')));
	navi.setTitleView(title.getView());
	
	// sub title
	var subTitle = Alloy.createController('Framework/NaviTitle');
	subTitle.setTitle(String.format(L('FrameworkSubTitleFormatListView'),L('{{segment}}_{{entity}}')));
	navi.setSubTitleView(subTitle.getView());
	
	// info panel
	infoPanel.setHeaderText(L('FrameworkQuerySummaryHeaderText'));
	infoPanel.initPosition();
	infoPanel.getView().addEventListener('contentChanged',function(e){
		updateView();
	});
	
	// start listen query
	Notifier.listen('{{segment}}/{{entity}}.searchQueryChanged',function(query){
		var info = Alloy.createController('Framework/Query');
		info.setQuery(query);
		infoPanel.push(info);
		infoPanel.openContainer();
		updateView();
	});
	
	// start with empty query
	var info = Alloy.createController('Framework/Query');
	info.setQuery({ query:{}, constraintTexts:[], logicText:'' });
	infoPanel.push(info);
	updateView();
};

exports.viewWillAppear = function(){
	var rootWin = navi.getRootWindow();
	rootWin.add(infoPanel.getView());
	infoPanel.restorePosition();
};

exports.viewWillDisappear = function(){
	var rootWin = navi.getRootWindow();
	rootWin.remove(infoPanel.getView());
	infoPanel.resumePosition();
};

