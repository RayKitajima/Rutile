
// full screen module based on NavigationGroup

// usage: 
//     
//     var controller = Alloy.createController('Framework/AuthPassword');
//     controller.setBatchTag('AuthBatch');
//     controller.setListener(self);
//     
//     modalWindow.getView().open();
//     modalWindow.navigationGroup.open(controller);
//     
//     

var self = exports;
var navi; // current navigationController
var listener;

var Dispatch = require('CentralDispatch');

var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});
$.SignInSymbol.setFont({fontSize:"20dp", fontFamily:fontawesome.fontfamily()});
$.SignInSymbol.setText(fontawesome.icon('fa-sign-in'));
$.SignInSymbol.setColor("#fff");

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var batchtag;

exports.setBatchTag = function(tag){
	batchtag = tag;
};

exports.authorize = function(){
	var app = {
		apptag : 'AuthPassword.authorize',
		params : {
			id   : $.AuthPassword_id.getValue(),
			pass : $.AuthPassword_pass.getValue()
		},
		callback : function(result){
			listener.listenAuthorized(result);
			if( navi.isModal() ){ // close navigation if this is modal
				navi.close();
			}
		}
	};
	if( !batchtag ){
		Dispatch.sync(app);
	}else{
		Dispatch.push(batchtag,app);
	}
};

function clickAuthButton(e){
	self.authorize(e);
};

function closeKeyboard(e) {
	e.source.blur();
}

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// delgate object should have listenAuthorized()
exports.setListener = function(obj){
	listener = obj;
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// navigation protocol

exports.viewDidLoad = function(){
	navi = Alloy.Globals.navigationControllerStack[0];
	
	// set left buttons if this view is called in modal
	if( navi.isModal() ){
		var cancelButton = Alloy.createController('Framework/NaviCancelButton');
		cancelButton.setButtonHandler(function(e){
			navi.close();
		});
		navi.setLeftButton(cancelButton.getView());
	}
	
	// define title
	var title = Alloy.createController('Framework/NaviTitle');
	title.setTitle(L('CLIENT_NAME'));
	navi.setTitleView(title.getView());
};

exports.viewWillAppear = function(){
};

exports.viewWillDisappear = function(){
};

