
// variables

var self = exports;

var rootWindow;
var viewContainer;
var navigationStack = [];
var backButtonEnabled = true;

var currentComponent;
var appearingComponent;
var disappearingComponent;

var ANIM_DURATION = 300;

var DISPLAY_WIDTH  = Ti.Platform.displayCaps.platformWidth;
var DISPLAY_HEIGHT = Ti.Platform.displayCaps.platformHeight;

var STATUS_BAR_HEIGHT = 20; // iOS status bar height
var TOP_BAR_HEIGHT    = 44; // navigation bar height

var CONTAINER_HEIGHT = DISPLAY_HEIGHT - STATUS_BAR_HEIGHT - TOP_BAR_HEIGHT;

// whether the navigation group is in modal, see Framework/ModalWindow
var isModal = false;
exports.isModal = function(flag){
	if( !flag ){ return isModal; }
	else{ isModal = flag; }
};

// sub menu
// you must prepend any page transit action while you open submenu

var MENU_ANIM_DURATION_1 = 225;
var MENU_ANIM_DURATION_2 = 200;
var MENU_ANIM_DELAY      = 15;

//var MENU_ANIM_DURATION_1 = 450;
//var MENU_ANIM_DURATION_2 = 400;
//var MENU_ANIM_DELAY      = 30;

$.MainMenu.height = 44;
$.SubMenu.height = 1;
$.SubMenu.visible = false;

$.MainMenuMask.visible = false;
$.SubMenuMask.visible = true;

exports.showSubMenu = function(){
	// main menu
	$.MainMenuMask.opacity = 0.01;
	$.MainMenuMask.visible = true;
	$.MainMenuMask.animate(
		Ti.UI.createAnimation({
			duration        : MENU_ANIM_DURATION_1,
			delay           : MENU_ANIM_DELAY,
			opacity         : 0.70,
		}),
		function(){
			$.MainMenuMask.visible = false;
		}
	);
	$.MainMenu.animate(
		Ti.UI.createAnimation({
			top             : 44,
			height          : 1,
			duration        : MENU_ANIM_DURATION_1,
			delay           : MENU_ANIM_DELAY,
		}),
		function(){
			$.MainMenu.visible = false;
		}
	);
	// sub menu
	$.SubMenu.visible = true;
	$.SubMenuMask.visible = true;
	$.SubMenuMask.opacity = 0.70;
	$.SubMenuMask.animate(
		Ti.UI.createAnimation({
			duration        : MENU_ANIM_DURATION_2,
			opacity         : 0.01,
		}),
		function(){
			
		}
	);
	$.SubMenu.animate(
		Ti.UI.createAnimation({
			height          : 44,
			duration        : MENU_ANIM_DURATION_2,
		}),
		function(){
			$.SubMenuMask.visible = false;
		}
	);
}

exports.hideSubMenu = function(){
	// main menu
	$.MainMenuMask.opacity = 0.70;
	$.MainMenuMask.visible = true;
	$.MainMenu.visible = true;
	$.MainMenuMask.animate(
		Ti.UI.createAnimation({
			duration        : MENU_ANIM_DURATION_2,
			opacity         : 0.01,
		}),
		function(){
		}
	);
	$.MainMenu.animate(
		Ti.UI.createAnimation({
			top             : 0,
			height          : 44,
			duration        : MENU_ANIM_DURATION_2,
		}),
		function(){
		}
	);
	// sub menu
	$.SubMenuMask.visible = true;
	$.SubMenuMask.animate(
		Ti.UI.createAnimation({
			duration        : MENU_ANIM_DURATION_1,
			delay           : MENU_ANIM_DELAY,
			opacity         : 0.70,
		}),
		function(){
		}
	);
	$.SubMenu.animate(
		Ti.UI.createAnimation({
			height          : 1,
			duration        : MENU_ANIM_DURATION_1,
			delay           : MENU_ANIM_DELAY,
		}),
		function(){
			$.SubMenu.visible = false;
		}
	);
}

// setup container

viewContainer = Ti.UI.createView({
	top    : TOP_BAR_HEIGHT,
	left   : 0,
	width  : Ti.UI.SIZE,
	height : DISPLAY_HEIGHT
});

// title

var transitTitleView = function(){
	$.TitleView.animate(
		Ti.UI.createAnimation({
			opacity  : 0.25,
			duration : ANIM_DURATION / 2,
		}),
		function(){
			if( disappearingComponent ){ $.TitleView.remove(disappearingComponent.titleView); }
			appearingComponent.titleView.center = $.TitleView.center;
			$.TitleView.add(appearingComponent.titleView);
			$.TitleView.animate(
				Ti.UI.createAnimation({
					opacity  : 1.0,
					duration : ANIM_DURATION / 2,
				}),
				function(){}
			);
		}
	);
};

var setTitleView = function(view){
	currentComponent.titleView = view;
};

exports.setTitleView = function(view){
	setTitleView(view);
};

// titile (sub menu)

var transitSubTitleView = function(){
	if( disappearingComponent ){
		$.SubTitleView.remove(disappearingComponent.subTitleView);
	}
	appearingComponent.subTitleView.center = $.SubTitleView.center;
	$.SubTitleView.add(appearingComponent.subTitleView);
};

var setSubTitleView = function(view){
	currentComponent.subTitleView = view;
};

exports.setSubTitleView = function(view){
	setSubTitleView(view);
};

// left buttons

var transitLeftButton = function(){
	$.LeftButtonsView.animate(
		Ti.UI.createAnimation({
			opacity  : 0.25,
			duration : ANIM_DURATION / 2,
		}),
		function(){
			if( disappearingComponent ){
				for( var i=0; i<disappearingComponent.leftButtons.length; i++){
					$.LeftButtonsView.remove(disappearingComponent.leftButtons[i]);
				}
			}
			for( var i=0; i<appearingComponent.leftButtons.length; i++){
				appearingComponent.leftButtons[i].left = i * (44-10);
				$.LeftButtonsView.add(appearingComponent.leftButtons[i]);
			}
			$.LeftButtonsView.animate(
				Ti.UI.createAnimation({
					opacity  : 1.0,
					duration : ANIM_DURATION / 2,
				}),
				function(){}
			);
		}
	);
};

var addLeftButton = function(button){
	appearingComponent.leftButtons.push(button);
};

exports.addLeftButton = function(button){
	addLeftButton(button);
};

exports.setLeftButton = function(button){
	addLeftButton(button);
};

// left buttons (sub menu)

var transitSubLeftButton = function(){
	if( disappearingComponent ){
		for( var i=0; i<disappearingComponent.subLeftButtons.length; i++){
			$.SubLeftButtonsView.remove(disappearingComponent.subLeftButtons[i]);
		}
	}
	for( var i=0; i<appearingComponent.subLeftButtons.length; i++){
		appearingComponent.subLeftButtons[i].left = i * (44-10);
		$.SubLeftButtonsView.add(appearingComponent.subLeftButtons[i]);
	}
};

var addSubLeftButton = function(button){
	appearingComponent.subLeftButtons.push(button);
};

exports.addSubLeftButton = function(button){
	addSubLeftButton(button);
};

exports.setSubLeftButton = function(button){
	addSubLeftButton(button);
};

// right buttons

var transitRightButton = function(){
	$.RightButtonsView.animate(
		Ti.UI.createAnimation({
			opacity  : 0.25,
			duration : ANIM_DURATION / 2,
		}),
		function(){
			if( disappearingComponent ){
				for( var i=0; i<disappearingComponent.rightButtons.length; i++){
					$.RightButtonsView.remove(disappearingComponent.rightButtons[i]);
				}
			}
			for( var i=0; i<appearingComponent.rightButtons.length; i++){
				appearingComponent.rightButtons[i].right = i * (44-10);
				$.RightButtonsView.add(appearingComponent.rightButtons[i]);
			}
			$.RightButtonsView.animate(
				Ti.UI.createAnimation({
					opacity  : 1.0,
					duration : ANIM_DURATION / 2,
				}),
				function(){}
			);
		}
	);
};

var addRightButton = function(button){
	appearingComponent.rightButtons.push(button);
};

exports.addRightButton = function(button){
	addRightButton(button);
};

exports.setRightButton = function(button){
	addRightButton(button);
};

// right buttons (sub menu)

var transitSubRightButton = function(){
	if( disappearingComponent ){
		for( var i=0; i<disappearingComponent.subRightButtons.length; i++){
			$.SubRightButtonsView.remove(disappearingComponent.subRightButtons[i]);
		}
	}
	for( var i=0; i<appearingComponent.subRightButtons.length; i++){
		appearingComponent.subRightButtons[i].right = i * (44-10);
		$.SubRightButtonsView.add(appearingComponent.subRightButtons[i]);
	}
};

var addSubRightButton = function(button){
	appearingComponent.subRightButtons.push(button);
};

exports.addSubRightButton = function(button){
	addSubRightButton(button);
};

exports.setSubRightButton = function(button){
	addSubRightButton(button);
};

// navigation

exports.setRootWindow = function(view){
	rootWindow = view;
	rootWindow.add(viewContainer);
};

exports.getRootWindow = function(){
	return rootWindow;
};

var doBack = function(){
	disappearingComponent = navigationStack.pop(); // = currentComponent
	appearingComponent = navigationStack[navigationStack.length-1];
	currentComponent = appearingComponent;
	disappearingComponent.controller.viewWillDisappear();
			
	transitTitleView();
	transitLeftButton();
	transitRightButton();
	
	transitSubTitleView();
	transitSubLeftButton();
	transitSubRightButton();
	
	viewContainer.animate(
		Ti.UI.createAnimation({
			left     : viewContainer.left - DISPLAY_WIDTH * navigationStack.length,
			duration : ANIM_DURATION,
		}),
		function(){
			appearingComponent.controller.viewWillAppear(); // will add title and right buttons
		}
	);
};

var applyBackButton = function(){
	var backButton = Alloy.createController('Framework/NaviBackButton');
	backButton.setButtonHandler(doBack);
	addLeftButton(backButton.getView());
};

exports.enableBackButton = function(){
	backButtonEnabled = true;
};

exports.back = function(){
	doBack();
};

exports.close = function(){
	rootWindow.close();
	Alloy.Globals.navigationControllerStack.shift();
};

exports.init = function(){
	var mainMenu = $.MainMenu;
	var subMenu = $.SubMenu;
	navigationStack = [];
	currentComponent = null;
	appearingComponent = null;
	disappearingComponent = null;
	viewContainer.left = 0;
	viewContainer.removeAllChildren();
	rootWindow.removeAllChildren();
	rootWindow.add(mainMenu);
	rootWindow.add(subMenu);
	rootWindow.add(viewContainer);
	rootWindow.touchEnabled = true;
	$.TitleView.removeAllChildren();
	$.SubTitleView.removeAllChildren();
	$.LeftButtonsView.removeAllChildren();
	$.SubLeftButtonsView.removeAllChildren();
	$.RightButtonsView.removeAllChildren();
	$.SubRightButtonsView.removeAllChildren();
	var navigationControllerStack = Alloy.Globals.navigationControllerStack;
	var alive_navi;
	for( var i=0; i<navigationControllerStack.length; i++ ){
		if( i == navigationControllerStack.length-1 ){
			alive_navi = navigationControllerStack[i];
			continue;
		}else{
			var close_navi = navigationControllerStack[i];
			close_navi.close();
		}
	}
	Alloy.Globals.navigationControllerStack = [alive_navi];
};

exports.open = function(controller){
	if( !Alloy.Globals.navigationControllerStack ){
		Alloy.Globals.navigationControllerStack=[];
	}
	var navigationControllerStack = Alloy.Globals.navigationControllerStack;
	var currentNavigationController = navigationControllerStack[0];
	if( currentNavigationController != self ){
		Alloy.Globals.navigationControllerStack.unshift(self);
	}
	
	appearingComponent = {
		controller      : controller,
		titleView       : '',
		leftButtons     : [],
		rightButtons    : [],
		subTitleView    : Ti.UI.createView(),
		subLeftButtons  : [],
		subRightButtons : [],
	};
	currentComponent = appearingComponent;
	disappearingComponent = '';
	if( backButtonEnabled && navigationStack.length > 0 ){ // back button is prior to user defined buttons
		applyBackButton();
	}
	
	// here, the actual controller sets title and buttons
	controller.viewDidLoad();
	
	// prep page transition
	if( navigationStack.length > 0 ){
		disappearingComponent = navigationStack[navigationStack.length-1];
	}
	
	// prepare new view
	var view = controller.getView();
	view.width   = DISPLAY_WIDTH;
	view.height  = CONTAINER_HEIGHT;
	view.top     = 0;
	view.left    = DISPLAY_WIDTH * (navigationStack.length+1);
	view.visible = true;
	
	// stack and add
	navigationStack.push(appearingComponent);
	
	// do transit
	viewContainer.add(view);
	
	transitTitleView();
	transitLeftButton();
	transitRightButton();
	
	transitSubTitleView();
	transitSubLeftButton();
	transitSubRightButton();
	
	if( disappearingComponent ){
		disappearingComponent.controller.viewWillDisappear();
	}
	viewContainer.animate(
		// Note that when you animate a view's size or position, 
		// the actual layout properties (such as top, left, width, height) are not changed 
		// by the animation. See the description of the animate method for more information.
		// see: http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.View-method-animate
		Ti.UI.createAnimation({
			left     : viewContainer.left - DISPLAY_WIDTH * navigationStack.length,
			duration : navigationStack.length <= 1 ? 0 : ANIM_DURATION,
		}),
		function(){
			controller.viewWillAppear();
		}
	);
};

