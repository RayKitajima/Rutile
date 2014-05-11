
var self = exports;
var navi; // current navigation controller, NavigationGroup|ModalContoller

var segmentsDef = { {{#Align_colon}}
{{#SegmentsDef}}
	"{{segment}}" : [{{#Entities}}"{{entity}}"{{^lastOfEntities}},{{/lastOfEntities}}{{/Entities}}]{{^lastOfSegments}},{{/lastOfSegments}}
{{/SegmentsDef}}
{{/Align_colon}}};

var EntityListViewManifest = { {{#Align_colon}}
{{#SegmentsDef}}
	// {{segment}}
{{#Entities}}
	"{{segment}}/{{entity}}" : "KitchenSink/{{segment}}/{{entity}}/List"{{^lastOfSegmentedEntities}},{{/lastOfSegmentedEntities}}
{{/Entities}}{{/SegmentsDef}}
{{/Align_colon}}};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var updateListView = function(){
	var listView = $.EntityListView;
	var sections = [];
	var segments = Object.keys(segmentsDef);
	for( var i=0; i<segments.length; i++ ){
		var segment = segments[i];
		var section = Ti.UI.createListSection({
			headerTitle : L(segment)
		});
		sections.push(section);
		var entities = segmentsDef[segment];
		var items = [];
		for( var j=0; j<entities.length; j++ ){
			var entity = entities[j];
			var item = {
				template : "myTemplate",
				properties : {
					title                   : entity,
					selectedBackgroundColor : '#e9ffd0',
					accessoryType           : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
				},
				label : {
					text : L( segment + '_' + entity ),
				},
				entityName : segment + '/' + entity,
			};
			items.push(item);
		}
		section.setItems(items);
	}
	listView.setSections(sections);
};

exports.updateListView = function(){
	updateListView();
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

function onItemClick(e) {
	var section = $.EntityListView.sections[e.sectionIndex];
	var item = section.getItemAt(e.itemIndex);
	
	var ViewName = EntityListViewManifest[item.entityName];
	var controller = Alloy.createController(ViewName);
	navi.open(controller);
	
	$.EntityListView.deselectItem(e.sectionIndex,e.itemIndex);
}

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

exports.viewDidLoad = function(){
	navi = Alloy.Globals.navigationControllerStack[0];
	
	var title = Alloy.createController('Framework/NaviTitle');
	title.setTitle(L('FrameworkTitleEntity'));
	navi.setTitleView(title.getView());
	
	updateListView();
};

exports.viewWillAppear = function(){
};

exports.viewWillDisappear = function(){
};

