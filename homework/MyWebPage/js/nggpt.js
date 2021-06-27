$(function() {
	const c1 = 21
	//首先给选择的内容填充下拉框
	for (var i = 3; i <= c1; i++) {
		$("<option value='" + i + "'>" + i + "</option>").appendTo($("#n1,#n2"));
	}
	//选择了正确的图片之后，将其存入缓存之中，并且反映出效果
	var imgurl = "img/smile.jpg"; //这里存图片的base64格式的地址
	$("#img").change(function() {
		//然后假如这条数据有效，那么久进入替换背景图和拼图原图，并且在此期间禁止操作
		var file = $(this)[0].files[0];
		if (file) {
			$("#fimg").text(file.name);
			var reader = new FileReader();
			new Promise((resolve, reject) => {
				reader.readAsDataURL(file);
				reader.onload = function(res) {
					resolve(res);
				}
			}).then(res => {
				imgurl = res.target.result;
				drawbg();
			})
		}
	})
	//点击生成拼图的大概流程
	//生成乱序表，然后渲染正确的图块，帮上正确的方向事件
	var x = 3;
	var y = 3;
	$("#btn").click(function() {
		x = parseInt($("#n1").val());
		y = parseInt($("#n2").val());
		drawgame();
	})

	function drawgame() {
		drawbox(); //把容器绘制到对应大小
		var arr = getarr(); //获得有解的随机数组顺序
		drawgrid(arr); //给容器之中填充每个图块
	}
	$(document).keydown(function(e) { //鼠标动作
		var t2 = gett2();
		if ((e.keyCode == 87 || e.keyCode == 38) && t2 <= (x - 1) * y) { //上
			thechange(t2 + x, t2);
		}
		if ((e.keyCode == 65 || e.keyCode == 37) && t2 % x != 0) { //左
			thechange(t2 + 1, t2)
		}
		if ((e.keyCode == 83 || e.keyCode == 40) && t2 > x) { //下
			thechange(t2 - x, t2)
		}
		if ((e.keyCode == 39 || e.keyCode == 68) && (t2 - 1) % x != 0) { //右
			thechange(t2 - 1, t2);
		}
		if(iswin()){
			$(".item").addClass("win");
		}else{
			$(".item").removeClass("win");
		}
	})
	$("#zb").click(function(){
		var arr = $(".item").getarr();
		$(".item").getarr().forEach(item=>{
			var t1  =item.attr("data-t1");
			item.attr("data-t2",t1);
			item.css(getpos(t1));
		})
	})
	function iswin() { //判断是否完全拼好
		var arr = $(".item").getarr();
		var flag = true;
		for(var i = 0;i<arr.length;i++){
			var t1  =arr[i].attr("data-t1");
			var t2  =arr[i].attr("data-t2");
			if(t1!=t2){
				flag = false;
				break;
			}
		}
		return flag;
	}

	function thechange(i1, i2) {
		//将i1位置的图块移动到i2位置
		the(i1).stop().animate(getpos(i2), 100);
		the(i1).attr("data-t2", i2);
	}

	function gett2() { //获得空位置的t2
		var t2 = -1;
		for (var i = 1; i <= x * y; i++) {
			if (the(i).length == 0) {
				t2 = i;
				break;
			}
		}
		return t2;
	}
	//一个根据下标返回控制对象的方法
	function the(e) {
		return $(".item[data-t2='" + e + "']");
	}

	function drawgrid(arr) {
		$("#box").find(".item").remove();
		for (var i = 0; i < arr.length; i++) {
			var t1 = arr[i]; //这是这个图块本身位置
			var t2 = i + 1; //这个是当前的位置；
			var $item = $("<div class='item' data-t1='" + t1 + "' data-t2='" + t2 + "'></div>");
			$item.appendTo($("#box"));
			$item.css(getpos(t2)) //根据当前位置将图块定位到正确的地方
			$item.css(setpic(t1)) //这个这个图块里面具体是哪一部分
		}
	}

	function setpic(e) {
		var x1 = e % x == 0 ? (x - 1) : e % x - 1; //取余知道纵坐标
		var y1 = parseInt((e - 1) / x) //相除知道在第几行
		var temp = {
			"background-position": "-" + x1 * 50 + "px -" + y1 * 50 + "px",
			"background-image": " url(" + imgurl + ")",
			"background-size": x * 50 + "px " + y * 50 + "px"
		}
		return temp;
	}

	function getpos(e) {
		var x1 = e % x == 0 ? (x - 1) : e % x - 1; //取余知道纵坐标
		var y1 = parseInt((e - 1) / x) //相除知道在第几行
		return {
			top: y1 * 50,
			left: x1 * 50
		}
	}

	function drawbox() {
		$("#box").width(50 * x);
		$("#box").height(50 * y);
	}

	function getarr() {
		var index = x * y;
		var arr = [];
		for (var i = 1; i < index; i++) {
			arr.push(i);
		}
		var flag = true;
		while (flag) {
			var arr1 = Object.assign([], arr);
			var arr2 = [];
			while (arr1.length > 0) {
				var temp = Math.floor(Math.random() * arr1.length);
				arr2.push(arr1[temp]);
				arr1.splice(temp, 1);
			}
			var counts = 0;
			for (var a = 0; a < arr2.length; a++) {
				for (var b = a + 1; b < arr2.length; b++) {
					if (arr2[a] > arr2[b]) {
						counts++;
					}
				}
			}
			if (counts % 2 == 0) {
				arr = Object.assign([], arr2);
				flag = false;
			}
		}
		return arr;
	}

	function drawbg() { //更改背景的
		$("#bg").css("background-image", "url(" + imgurl + ")")
	}
	//一个将dom伪数组的对象转为jquerydom的数组对象
	$.prototype.getarr = function() {
		var that = this;
		var arr = [];
		for (var i = 0; i < that.length; i++) {
			var $dom = $(that[i]);
			arr.push($dom);
		}
		return arr;
	}
})
