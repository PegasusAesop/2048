var nums = new Array();
var score=0;
//记录每一个移动只做一次叠加操作，8,4,2,2==>>8,4,
var hasCoflicted = new Array();

//移动端起始、终点位置初始值：
var startx=0;
var starty=0;
var endx=0;
var endy=0;

$(function(){
	newgame();
});

//开始新游戏
function newgame(){
	//是否是移动端
	if(documentWidth<500){
		//设置移动端尺寸
		settingForMobile();
	}else{
		containerWidth=500;
		cellWidth=100;
		cellSpace=20;
	}
	init();
	//随机的在两个单元格中生成一个数字；
	generateOneNumber();
	generateOneNumber();
	
}

function settingForMobile(){
	$('#header .wrapper').css('width',containerWidth);
	$('#grid-container').css('width',containerWidth-cellSpace*2);
	$('#grid-container').css('height',containerWidth-cellSpace*2);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',containerWidth*0.02);
	
	$('.grid-cell').css('width',cellWidth);
	$('.grid-cell').css('height',cellWidth);
	$('.grid-cell').css('border-radius',cellWidth*0.06);
	
}

//初始化页面
function init(){
	//初始化单元格位置(下层，不动)；
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$('#grid-cell-'+i+'-'+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}
	
	//初始化数组
	for(var i=0;i<4;i++){
		nums[i]=new Array();
		hasCoflicted[i]=new Array();
		for(var j=0;j<4;j++){
			nums[i][j] = 0;
			hasCoflicted[i][j]=false;//未曾叠加过
		}
	}
	//nums[0][2]=2;
	//nums[2][3]=8;
	//nums[2][2]=16;
	
	//动态创建上层单元格并初始化；
	updateView();
	score=0;
	updateScore(score);
}
//更新上层单元格视图
function updateView(){
	//将上层所有单元格清空，然后重新初始化创建；
	$('.number-cell').remove();
	
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var numberCell = $('#number-cell-'+i+'-'+j);
			if(nums[i][j]==0){
				numberCell.css('width','0px');
				numberCell.css('height','0px');
				//numberCell.css('top',getPosTop(i,j)+50);
				numberCell.css('top',getPosTop(i,j)+cellWidth*0.5);
				//numberCell.css('left',getPosLeft(i,j)+50);
				numberCell.css('left',getPosLeft(i,j)+cellWidth*0.5);
			}else{
				//numberCell.css('width','100px');
				numberCell.css('width',cellWidth);
				//numberCell.css('height','100px');
				numberCell.css('height',cellWidth);
				numberCell.css('top',getPosTop(i,j));
				numberCell.css('left',getPosLeft(i,j));
				numberCell.css('background-color',getNumberBackgroundColor(nums[i][j]));
				numberCell.css('color',getNumberColor(nums[i][j]));
				numberCell.text(nums[i][j]);
			}
			//每次更新后初始化
			hasCoflicted[i][j]=false;
			
			//移动端尺寸
			$('.number-cell').css('border-radus',cellWidth*0.06);
			$('.number-cell').css('font-size',cellWidth*0.5);
			$('.number-cell').css('line-height',cellWidth+'px');
		}
	}
}

//在随机的空余的单元格中生成一个随机数；
//1.空余的单元格随机的找一个；
//2.随机产生2或4的数字并显示在单元格上；
function generateOneNumber(){
	//判断是否还有空间，如果没有则直接返回；
	if(noSpace(nums)){
		return;
	}
	//随机一个位置
	var count=0;
	var temp=new Array();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(nums[i][j]==0){
				//var x=i*4+j;  //1 3  =7  7/4=1  7%4=3
				temp[count]=i*4+j;
				count++;
			}
		}
	}
	
	var pos=Math.floor(Math.random()*count);//[0,1)->[0,count]整数值;
	var randx = Math.floor(temp[pos]/4);
	var randy = Math.floor(temp[pos]%4);
	//随机一个2或4数字
	var randomNum = Math.random()<0.5?2:4;
	//在随机的位置上显示随机数字
	nums[randx][randy]=randomNum;
	showNumberWithAnimation(randx,randy,randomNum);
}

//实现键盘的响应;
$(document).keydown(function(event){
	//console.log(event);
	//阻止事件的默认动作；
	event.preventDefault();

	switch(event.keyCode){
		case 37: //left
			//判断是否可以向左移动：
			if(canMoveLeft(nums)){
				//左移
				moveLeft();
				//产生新的数字;
				setTimeout(generateOneNumber,200);
				setTimeout('isGameOver(nums)',500);
				
			}
			break;
		case 38: //top
			if(canMoveUp(nums)){
				//上移
				moveUp();
				//产生新的数字;
				setTimeout(generateOneNumber,200);
				setTimeout('isGameOver(nums)',500);
			}
			break;
		case 39: //rigth
			if(canMoveRigth(nums)){
				//右移
				moveRight();
				//产生新的数字;
				setTimeout(generateOneNumber,200);
				setTimeout('isGameOver(nums)',500);
			}
			break;
		case 40: //down
			if(canMoveDown(nums)){
				//下移
				moveDown();
				//产生新的数字;
				setTimeout(generateOneNumber,200);
				setTimeout('isGameOver(nums)',500);
			}
			break;
		default:
			break;
	}
});

//实现触摸滑动响应
document.addEventListener('touchstart',function(event){
	//console.log(event);
	event.preventDefault();
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
	
});

document.addEventListener('touchend',function(event){
	//console.log(event);
	event.preventDefault();
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	//方向判断
	var deltax=endx-startx;
	var deltay=endy-starty;
	//判断当滑动距离小于一定的阈值时不做任何操作
	if(Math.abs(deltax)<documentWidth*0.1 && Math.abs(deltay)<documentWidth*0.1){
		return;
	} 
	
	if(Math.abs(deltax)>=Math.abs(deltay)){
		
		if(deltax>0){//右
			if(canMoveRigth(nums)){
				//右移
				moveRight();
				//产生新的数字;
				setTimeout(generateOneNumber,200);
				setTimeout('isGameOver(nums)',500);
			}
		}else{//左
			if(canMoveLeft(nums)){
				//左移
				moveLeft();
				//产生新的数字;
				setTimeout(generateOneNumber,200);
				setTimeout('isGameOver(nums)',500);
				
			}
		}
		
	}else{
		if(deltay>0){//下
			if(canMoveDown(nums)){
				//下移
				moveDown();
				//产生新的数字;
				setTimeout(generateOneNumber,200);
				setTimeout('isGameOver(nums)',500);
			}
		}else{//上
			if(canMoveUp(nums)){
				//上移
				moveUp();
				//产生新的数字;
				setTimeout(generateOneNumber,200);
				setTimeout('isGameOver(nums)',500);
			}
		}
	}
});

//向左移动
//需要对每一个数字的左边进行判断，选择落脚点，落脚点有两种情况：
//1落角点没有数字，并且移动路径中没有障碍物；if(nums[i][k]==0 && noBlockHorizontal(i,k,j,nums))
//2落脚点数字和自己相同，并且移动路径中没有障碍物；
function moveLeft(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(nums[i][j]!=0){
				for(var k=0;k<j;k++){
					if(nums[i][k]==0 && noBlockHorizontal(i,k,j,nums)){//第i行的第k-j间是否有数字?
						//移动操作；
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
					}
					else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,k,j,nums) && !hasCoflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];//相同数值叠加；
						nums[i][j]=0;
						//统计分数；
						score+=nums[i][k];
						//更新分数的显示；
						updateScore(score);
						hasCoflicted[i][k]=true;
						break;
					}
				}
			}
		}
	}
	//setTimeout(updateView,500);
	setTimeout('updateView()',500);
}
//向右移动
function moveRight(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(nums[i][j]!=0){
				for(var k=3;k>j;k--){
					if(nums[i][k]==0 && noBlockHorizontal(i,j,k,nums)){//第i行的第j-k间是否有数字?
						//移动操作；
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
					}
					//注意此处最后一个条件：!hasCoflicted[i][j]
					else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,j,k,nums) && !hasCoflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];//相同数值叠加；
						nums[i][j]=0;
						//统计分数；
						score+=nums[i][k];
						//更新分数的显示；
						updateScore(score);
						hasCoflicted[i][k]=true;
						break;
					}
				}
			}
		}
	}
	//setTimeout(updateView,500);
	setTimeout('updateView()',500);
}

//向上移动
function moveUp(){
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(nums[i][j]!=0){
				for(var k=0;k<i;k++){
					if(nums[k][j]==0 && noBlockVertical(j,k,i,nums)){//第j列的第k-i行之间没有数字障碍;
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}
					else if(nums[k][j]==nums[i][j] &&noBlockVertical(j,k,i,nums) && !hasCoflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];//相同数值叠加；
						nums[i][j]=0;
						score+=nums[k][j];
						updateScore(score);
						
						hasCoflicted[k][j]=true;
						break;
					}
				}
			}
		}
	}
	setTimeout('updateView()',500);
}

//向下移动
function moveDown(){
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(nums[i][j]!=0){
				for(var k=3;k>i;k--){
					if(nums[k][j]==0 && noBlockVertical(j,i,k,nums)){//第j列的第i-k行之间没有数字障碍;
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}
					else if(nums[k][j]==nums[i][j] &&noBlockVertical(j,i,k,nums) && !hasCoflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];//相同数值叠加；
						nums[i][j]=0;
						score+=nums[k][j];
						updateScore(score);
						
						hasCoflicted[k][j]=true;
						break;
					}
				}
			}
		}
	}
	setTimeout('updateView()',500);
}