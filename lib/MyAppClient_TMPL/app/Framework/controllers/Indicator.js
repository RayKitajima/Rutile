
exports.setMessage = function(message){
	$.ActivityIndicator.message = message;
};

exports.showIndicator = function(){
	$.Container.visible = true;
	$.ActivityIndicatorBack.visible = true;
	$.ActivityIndicator.show();
};

exports.hideIndicator = function(){
	$.Container.visible = false;
	$.ActivityIndicatorBack.visible = false;
	$.ActivityIndicator.hide();
};
