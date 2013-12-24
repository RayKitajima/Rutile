
var stack  = [];
var cursor = 0;

exports.getContentHeight = function(){
	var info = stack[cursor];
	return info.getContentHeight();
};

exports.getCurrentInfo = function(){
	return stack[cursor];
};

exports.push = function(info){
	stack.push(info);
	cursor = stack.length - 1;
	$.Container.addView(info.getView());
	$.Container.setCurrentPage(cursor);
};

$.Container.addEventListener('scrollend',function(e){
	cursor = $.Container.getCurrentPage();
	var info = stack[cursor];
	var new_height = info.getContentHeight();
	$.Container.animate(
		Ti.UI.createAnimation({
			height   : new_height,
			duration : 250,
		}),
		function(){
		}
	);
	$.Container.fireEvent('contentChanged',{info:info});
});
