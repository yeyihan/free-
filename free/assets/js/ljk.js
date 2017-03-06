var listFun = {
	/******************************
	 * 
	 * 数字输入框组件（包含加减运算，input可以输入）
	 * 
	 * 在输入框上，默认写有最小值（data-min）和最大值(data-max)，如果没有这两个属性，那么最小值默认为0，最大值为999999。
	 * *******************************/
	numbox:function(){
		var reg = /^[1-9]\d{0,5}$/;
		
		//点击减号
		$('.numbox > .numbox_minus').on("click",function(){
			var inpE = $(this).parent().find('input');
			var min = $(inpE).attr("data-min") || 0;
			var max = $(inpE).attr("data-max") || 999999;
			var inpNum = Number(inpE.val());
			
			if(inpNum > min){
				inpE.val(inpNum-1);
			}else{
				inpE.val(min);
			}
		})
		//点击加号
		$('.numbox > .numbox_plus').on("click",function(){
			var inpE = $(this).parent().find('input');
			var min = $(inpE).attr("data-min") || 0;
			var max = $(inpE).attr("data-max") || 999999;
			var inpNum = Number(inpE.val());

			if(inpNum < max){
				inpE.val(inpNum+1);
			}else{
				inpE.val(max);
			}
		})
		
		//输入框
		$('.numbox').each(function(i,e){
			var oldNum = 0;
			var inpNum = 0;
			$(this).find('input').on('keyup',function(){
				var min = $(this).attr("data-min") || 0;
				var max = $(this).attr("data-max") || 999999;
				inpNum = Number($(this).val());
				if($(this).val() == ""){
					$(this).val("");
				}else if(reg.test($(this).val())){
					if(inpNum < min){
						$(this).val(min);
					}
					if(inpNum > max){
						$(this).val(max);
					}
					oldNum = $(this).val();
				}else{
					$(this).val(oldNum);
				}
			});
			$(this).find('input').on('blur',function(){
				var min = $(this).attr("data-min") || 0;
				var max = $(this).attr("data-max") || 999999;
				inpNum = Number($(this).val());
				if($(this).val() == ""){
					$(this).val(1);
				}
				if(inpNum < min){
						$(this).val(min);
					}
				if(inpNum > max){
					$(this).val(max);
				}
			})
			
		})
	},
	/***********************************
		 * 
		 * 确认订单页面按钮点击切换样式
		 * 
		 **********************************/
		btnLine:function(){
			$('.btn_line').on('click',function(){
				$('.btn_line').removeClass('active');
				$(this).addClass('active');
				
				$('.input_num').val('1');
				$('.bubble_order').hide();
			})
		},
	/*****************************
	 * 
	 * 全选功能
	 * 
	 * ****************************/
	allChcek:function(parameter){
		/*******************************
		 * 参数说明：
		 * 
		 * 传入参数：
		 * parameter = {
		 * 		allcheck:点击选择全部的多选框元素
		 * 		itemcheck:单个的多选框列表的多选框的元素
		 * }
		 * **************************/
		
		var all = $(parameter.allcheck);
		var item = $(parameter.itemcheck);
		
		//初始化，能够进入到购物车中的商品，应该是用户选中的，所以，默认全选
		all.attr("checked",true);
		item.attr("checked",true);
		
		//点击单个多选框时，如果全部选中，那么具有全选标识的那个多选框也应该选中，只要有一个未选中，那么具有全选标识的多选框就不能够选中。
		function isChecked(){
			var len = item.length;
			item.on("click",function(){
				var num = 0;
				for(var i = 0;i < len;i ++){
					if(item.eq(i).is(":checked")){
						num ++;
					}
				}
				console.log(num);
				if(num == len){
					all.prop("checked",true);
				}else{
					all.prop("checked",false);
				}
			})
		};
		isChecked();
		//点击全选选中时，单个多选框应该是全部选中，否则全部不选中
		all.on("click",function(){
			console.log($(this).is(":checked"));
			if($(this).is(":checked")){
				item.prop("checked",true);
			}else{
				item.prop("checked",false);
			}
		});
		
		$('#allLabel').on('click',function(){
			all.click();
		})
	},
	
	/*********************************
	 * 
	 *购物车列表，计算总价
	 * 
	 * ****************************/
	
	shopPrice:function(parameter){
		/*******************************
		 * 参数说明：
		 * 
		 * 传入参数：
		 * parameter = {
		 * 		ele为列表的类;
		 * 		input_num为输入框的类;
		 * 		price_num为单价的类
		 * 		checkClass多选框的类
		 * }
		 * ***************************/

		var e = $(parameter.ele);
		var inp = parameter.input_num;
		var pr = parameter.price_num;
		var ch = parameter.checkClass;

		var reg = /^[1-9]\d{0,3}$/;
		var oldNum = 0;
		var result = 0;
		var inpNum = 0;
		
		e.each(function(i,item){
			if($(item).find(ch).eq(0).is(":checked")){
				result += Number($(item).find(pr).eq(0).text()) * Number($(item).find(inp).eq(0).val());
				inpNum += Number($(item).find(inp).eq(0).val());
			}
			
		})
		
		return {
			result:result.toFixed(2),
			num:inpNum
		}
	},
	
	/***********************************
	 * 
	 * 监听输入框，计算总价，并显示出数量和总价
	 * 
	 * **************************************/
		shopPriceInput:function(parameter){
		/*******************************
		 * 参数说明：
		 * 
		 * 传入参数：
		 * parameter = {
		 * 		ele为列表的类;
		 * 		input_num为输入框的类;
		 * 		price_num为单价的类
		 * 		checkClass多选框的类
		 * 		resultId:显示总价的id
		 * 		shop_num:显示总数量的id
		 * }
		 * ***************************/

		var e = parameter.ele;
		var inp = parameter.input_num;
		var pr = parameter.price_num;
		var ch = parameter.checkClass;
		var re = parameter.resultId;
		var sn = parameter.shop_num;

		var reg = /^[1-9]\d{0,3}$/;
		var oldNum = 1;
		var inpNum = 0;
	
		
		$(inp).on("keyup",function(){
			inpNum = Number($(this).val());
			var getRe = listFun.shopPrice({
				ele:e,
				input_num:inp,
				price_num:pr,
				checkClass:ch
			});

			if($(this).val() == ""){
				$(this).val("1");

			}else if(reg.test($(this).val())){
				oldNum = $(this).val();
				$(sn).text(getRe.num);
				$(re).text(getRe.result);
			}else{
				$(this).val(oldNum);
			}
		})
		
		$(inp).on("blur",function(){
			if($(this).val() == ""){
				$(this).val(1);
			}
			var getRe = listFun.shopPrice({
				ele:e,
				input_num:inp,
				price_num:pr,
				checkClass:ch
			});
			$(sn).text(getRe.num);
			$(re).text(getRe.result);
		})
		
	},
	
		/***********************************
	 * 
	 * 监听多选框，计算总价，并显示出数量和总价
	 * 
	 * **************************************/
		shopPriceCheck:function(parameter){
		/*******************************
		 * 参数说明：
		 * 
		 * 传入参数：
		 * parameter = {
		 * 		ele为列表的类;
		 * 		input_num为输入框的类;
		 * 		price_num为单价的类
		 * 		checkClass多选框的类
		 * 		resultId:显示总价的id
		 * 		shop_num:显示总数量的id
		 * }
		 * ***************************/

		var e = parameter.ele;
		var inp = parameter.input_num;
		var pr = parameter.price_num;
		var ch = parameter.checkClass;
		var re = parameter.resultId;
		var sn = parameter.shop_num;

		$(ch).on("click",function(){
			var getRe = listFun.shopPrice({
				ele:e,
				input_num:inp,
				price_num:pr,
				checkClass:ch
			});
			$(sn).text(getRe.num);
			$(re).text(getRe.result);
		})
	},
	
		
		/***********************************
	 * 
	 * 监听全选框，计算总价，并显示出数量和总价
	 * 
	 * **************************************/
		shopPriceAllCheck:function(parameter){
		/*******************************
		 * 参数说明：
		 * 
		 * 传入参数：
		 * parameter = {
		 * 		ele为列表的类;
		 * 		input_num为输入框的类;
		 * 		price_num为单价的类
		 * 		checkClass多选框的类
		 * 		allCheck全选框元素
		 * 		resultId:显示总价的id
		 * 		shop_num:显示总数量的id
		 * }
		 * ***************************/

		var e = parameter.ele;
		var inp = parameter.input_num;
		var pr = parameter.price_num;
		var ch = parameter.checkClass;
		var ach = parameter.allCheck;
		var re = parameter.resultId;
		var sn = parameter.shop_num;

		$(ach).on("click",function(){
			var getRe = listFun.shopPrice({
				ele:e,
				input_num:inp,
				price_num:pr,
				checkClass:ch
			});
			$(sn).text(getRe.num);
			$(re).text(getRe.result);
		})
	},
	
	/************************************
	 * 
	 * 点击删除，弹出提示框（包含取消和确认函数）
	 * 
	 * ********************************/
	deleteTishi:function(params,call){
		var def = {
			e:null,
			parentsClass:'.shop_item'
		}
		
		var option = $.extend(def,params);
		console.log(option);
		var parClass = option.parentsClass;
		var e = option.e;
		var ele = null;
		
		//点击删除，弹出提示框
		$(e).on('click',function(){
			ele = $(this).parents(parClass);
			$('#popup_box').show();
		})
		//点击取消按钮，取消删除操作
		$('#close_popup').on('click',function(){
			$('#popup_box').hide();
			ele = null;
		})
		//点击确认按钮，删除该商品
		$('#que_popup').on('click',function(){
			$('#popup_box').hide();
			ele.remove();
			ele = null;
			
			$('#info').text('删除成功').show();
			setTimeout(function(){
				$('#info').hide();
			},2000);
			
			if(typeof(call) == 'function'){
				call();
			}
		})
	},
		
	/*******************************
	 * 
	 * 点击支付方式列表，对应显示高亮状态
	 * 
	 * ******************************/
	listRadio:function(){
		$(".radio_list > .list_table_li").on("click",function(){
			$(".radio_list > .list_table_li").removeClass("active");
			$(this).addClass("active");
		})
	}
}
