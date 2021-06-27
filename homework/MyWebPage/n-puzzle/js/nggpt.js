$(function() {
	const c1 = 21
	//choice dropdown
	for (var i = 3; i <= c1; i++) {
		$("<option value='" + i + "'>" + i + "</option>").appendTo($("#n1,#n2"));
	}
	var imgurl = "img/smile.jpg"; 
	$("#img").change(function() {
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
	var x = 3;
	var y = 3;
	$("#btn").click(function() {
		x = parseInt($("#n1").val());
		y = parseInt($("#n2").val());
		drawgame();
	})

	function drawgame() {
		drawbox(); 
		var arr = getarr();
		drawgrid(arr);
	}
	$(document).keydown(function(e) { 
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
	function iswin() { 
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
		the(i1).stop().animate(getpos(i2), 100);
		the(i1).attr("data-t2", i2);
	}

	function gett2() { 
		var t2 = -1;
		for (var i = 1; i <= x * y; i++) {
			if (the(i).length == 0) {
				t2 = i;
				break;
			}
		}
		return t2;
	}
	function the(e) {
		return $(".item[data-t2='" + e + "']");
	}

	function drawgrid(arr) {
		$("#box").find(".item").remove();
		for (var i = 0; i < arr.length; i++) {
			var t1 = arr[i]; 
			var t2 = i + 1; 
			var $item = $("<div class='item' data-t1='" + t1 + "' data-t2='" + t2 + "'></div>");
			$item.appendTo($("#box"));
			$item.css(getpos(t2)) 
			$item.css(setpic(t1)) 
		}
	}

	function setpic(e) {
		var x1 = e % x == 0 ? (x - 1) : e % x - 1; 
		var y1 = parseInt((e - 1) / x)
		var temp = {
			"background-position": "-" + x1 * 50 + "px -" + y1 * 50 + "px",
			"background-image": " url(" + imgurl + ")",
			"background-size": x * 50 + "px " + y * 50 + "px"
		}
		return temp;
	}

	function getpos(e) {
		var x1 = e % x == 0 ? (x - 1) : e % x - 1; 
		var y1 = parseInt((e - 1) / x) 
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

	function drawbg() {
		$("#bg").css("background-image", "url(" + imgurl + ")")
	}
	
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
