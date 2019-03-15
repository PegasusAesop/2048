function showNumberWithAnimation(i,j,randomNum){
	var numberCell=$('#number-cell-'+i+'-'+j);
	numberCell.text(randomNum);
	numberCell.css('background-color',getNumberBackgroundColor(randomNum));
	numberCell.css('color',getNumberColor(randomNum));
	
	numberCell.animate({
		width:'100px',
		height:'100px',
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},500); 
}
//通过动画显示移动效果
function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell = $('#number-cell-'+fromx+'-'+fromy);
	
	numberCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},500);
}