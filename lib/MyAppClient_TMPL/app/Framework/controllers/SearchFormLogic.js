
var selection = 'AND';
var selectedColor = '#555';
var unselectedColor = '#aaa';

function selectAND(){
	selection = 'AND';
	$.LogicAND.color = selectedColor;
	$.LogicOR.color = unselectedColor;
}

function selectOR(){
	selection = 'OR';
	$.LogicAND.color = unselectedColor;
	$.LogicOR.color = selectedColor;
}

exports.getTextExpression = function(){
	if( selection === 'AND' ){
		return L('FrameworkSearchFormElementSearchLogicAND');
	}else{
		return L('FrameworkSearchFormElementSearchLogicOR');
	}
};

exports.getLogic = function(){
	return selection;
};

// usage:
// searchFormElementLogic.setLogic(logic);
// logic should be: 'AND' or 'OR'
exports.setLogic = function(logic){
	return selection;
};
