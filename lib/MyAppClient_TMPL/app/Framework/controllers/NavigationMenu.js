
var self = exports;

var rootWindow;    // root window
var viewContainer; // contents view
var menuContainer; // menu view

// list of items definition : {
//     name      : <name of navigationStack>
//     firstpage : <controller instance of its first page>,
// }
var navigationStacks = [];

// instance cache
// key : {
//     "config" : <config stacked in navigationStacks>
//     "navi"   : <navigationStack instance>,
//     "stack"  : <array for Alloy.Globals.navigationControllerStack>,
// }
var navigationStacksMap = {};

var current_navigationStack;

var ANIM_DURATION = 300;

var DISPLAY_WIDTH  = Ti.Platform.displayCaps.platformWidth;
var DISPLAY_HEIGHT = Ti.Platform.displayCaps.platformHeight;
var SIDEMENU_WIDTH = DISPLAY_WIDTH * 0.8;

// container

viewContainer = Ti.UI.createView({
	top     : 0,
	left    : 0,
	width   : DISPLAY_WIDTH,
	height  : DISPLAY_HEIGHT,
	visible : true,
});

menuContainer = $.SideMenu;
menuContainer.getView().width  = SIDEMENU_WIDTH;
menuContainer.getView().height = DISPLAY_HEIGHT;

exports.setRootWindow = function(view){
	rootWindow = view;
	rootWindow.add(viewContainer);
};

exports.getRootWindow = function(){
	return rootWindow;
};

// sidemenu support

var showSideMenuOf = function(name){
	var new_navigationStack = navigationStacksMap[name];
	
	if( current_navigationStack ){
		current_navigationStack.navi.makeUnvisible();
	}
	new_navigationStack.navi.makeVisible();
	
	Alloy.Globals.navigationControllerStack = new_navigationStack.stack; // switch the stack!
	
	//if( !new_navigationStack.navi.isActive() ){ // bug
		new_navigationStack.navi.openFirstPage();
	//}
	current_navigationStack = new_navigationStack;
	
	//return new_navigationStack; // returns currently shown navigationStack object
};

var addSideMenu = function(config){
	navigationStacks.push(config);
	
	var navigationStack = Alloy.createController('Framework/NavigationGroup');
	navigationStack.setSideMenu(self);
	navigationStack.enableBackButton();
	navigationStack.enableSideMenu();
	navigationStack.setFirstPage(config.firstpage);
	navigationStack.setRootWindow(viewContainer);
	navigationStack.makeUnvisible();
	
	var menuItem = Alloy.createController('Framework/NaviSideMenuItem');
	menuItem.setLabel(L(config.name)); // lookup i18n
	menuItem.setSelectMenuHandler(function(){
		showSideMenuOf(config.name);
		hideSideMenu();
	});
	menuContainer.addMenuItem(menuItem);
	
	navigationStacksMap[config.name] = {
		config : config,
		navi   : navigationStack,
		stack  : [navigationStack],
	};
};

exports.addSideMenu = function(config){
	return addSideMenu(config);
};

exports.showSideMenuOf = function(name){
	return showSideMenuOf(name);
};

exports.getNavigationStackFor = function(name){
	return navigationStacksMap[name];
};

// show and hide sidemenu

var navigationStackMask = Ti.UI.createView({
	left            : 0,
	top             : 0,
	width           : DISPLAY_WIDTH,
	height          : DISPLAY_HEIGHT,
	backgroundColor : '#000',
	opacity         : 0.3,
	visible         : false,
});;

var disableNavigationStackInteraction = function(){
	rootWindow.add(navigationStackMask);
	navigationStackMask.visible = true;
};

var enableNavigationStackInteraction = function(){
	rootWindow.remove(navigationStackMask);
	navigationStackMask.visible = false;
};

var showSideMenu = function(){
	disableNavigationStackInteraction(); // prevent main view's interaction
	
	menuContainer.getView().left = -1 * SIDEMENU_WIDTH,
	menuContainer.getView().visible = true;
	rootWindow.add(menuContainer.getView());
	
	menuContainer.getView().visible = true;
	
	// show it
	menuContainer.getView().animate(
		Ti.UI.createAnimation({
			left     : 0,
			duration : ANIM_DURATION,
		}),
		function(){
		}
	);
};

var hideSideMenu = function(){
	// hide it
	menuContainer.getView().animate(
		Ti.UI.createAnimation({
			left     : -1 * SIDEMENU_WIDTH,
			duration : ANIM_DURATION,
		}),
		function(){
			enableNavigationStackInteraction(); // then make the main view's interaction available
			menuContainer.getView().visible = false;
			rootWindow.remove(menuContainer.getView());
		}
	);
};

menuContainer.setCloseButtonHandler(hideSideMenu);

exports.showSideMenu = function(){
	showSideMenu();
};

exports.hideSideMenu = function(){
	hideSideMenu();
};

// build view of sidemenu items
/*
var build = function(){
	for( var i=0; i<navigationStacks.length; i++ ){
		var config = navigationStacks[i];
		var name = config.name;
		var menuItem = Alloy.createController('Framework/NaviSideMenuItem');
		menuItem.setLabel(L(name)); // lookup i18n
		menuItem.setSelectMenuHandler(function(){
			showSideMenuOf(name);
			hideSideMenu();
		});
		menuContainer.addMenuItem(menuItem);
	}
};

exports.build = function(){
	build();
};
*/

