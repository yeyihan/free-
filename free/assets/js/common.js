function log(con){
    console.log(con);
}
var tools = {
    
    /*************************************
     * rootFont();
     * 动态计算根元素(HTML)的font-size
     * 
     *************************************/
    rootFont: function() {
        var doc = document;
        var win = window;
        var docEl = doc.documentElement,    
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',    
        recalc = function () {    
            var clientWidth = $('.warp').width(); 
            /*clientWidth = $(window).width();*/ 
            if (!clientWidth) return; 
            docEl.style.fontSize = 40 * (clientWidth / 750) + 'px'; 
            if ( typeof(page) != "undefined" && $.isFunction(page.show)) {
                page.show();
                $('.warp').fadeIn('fast');    
            } else{
                $('.warp').fadeIn('fast');    
            }
        };
          
        win.addEventListener(resizeEvt, recalc, false);    
        doc.addEventListener('DOMContentLoaded', recalc, false);  
    }(),
    
    /*************************************
     * swiper();
     * 幻灯效果
     * @param swiperEle //需幻灯的元素
     * 
     *************************************/
    swiper : function(swiperEle){
        var swiper = new Swiper(swiperEle, {
            pagination: '.swiper-pagination',
            autoplay:3000,
            autoplayDisableOnInteraction:false,
            loop : true
        });
    },
    
    /*************************************
     * scrollPage();
     * 滚动到底部分页
     * @param params = {
     *     ele, //需写入数据的元素
     *     url, //数据获取地址
     *     msg // 为空时的文字提示
     * }
     * @param call //回调函数
     *************************************/
    scrollPage:function(params,call) {
        var def = {
            ele : '#list',
            url : '',
            msg : '暂无相关内容'
        }
        var option = $.extend(def,params);
        //console.log(option);
        var appendEle = $(option.ele);
        var ajaxUrl = option.url;
        var emptyMsg = option.msg;
        
        //分页提示
        $('body').append('<span class="scroll_currt_page"></span>');
		$('.empty_mag').remove();
        appendEle.append('<div class="empty_mag" style="display:none;">'+emptyMsg+'</div>');
        appendEle.append('<div class="ajax_list"></div>');
        appendEle.append('<div class="loading_box"><img src="../assets/images/loading.gif" width="50px"></div>');
        var pageHtml = $(".scroll_currt_page");
        var emptyHtml = $(".empty_mag");
        var loadHtml = $(".loading_box");
        var ajaxHtml = $(".ajax_list");
        var pageCurrent = 1;
        var pageAmount = 0;
        var is_loading = false;
        isRun = true;
        $(window).scroll( tools.throttle(function() {
            //可视区域的高度+滚动条距顶部的高度=实际可滚动的高度 
            var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop())+30;     
            var pagecurrent = [];
            //当文档的高度小于或者等于实际可滚动的高度时，同时有上拉事件时才开始动态加载数据
            log(totalheight+'--'+$('body').height()+'---'+is_loading);
            if (totalheight >= $('body').height() && !is_loading && isRun) { 
				getList();
            }
        },200));
        
        //获取数据
        getList();
        function getList(){
            var msg = '';
            is_loading = true;
            
            if( pageCurrent != pageAmount ){
                $.ajax({
                    dataType : 'json',
                    type : 'post',
                    url : ajaxUrl,
                    success : function(rs){
                       //数据
                        var datas = rs.datas;
                        //分页
                        pageCurrent = rs.pageCurrent;
                        pageAmount = rs.pageAmount;
                        if( datas != '' && pageAmount != 0){
                            emptyHtml.hide();
                            ajaxHtml.append(datas); 
                            
                            if( typeof(call) == 'function'){
                                call();
                            }

                            if( pageCurrent > 1){
                                pageHtml.text(pageCurrent+'/'+pageAmount)
                                .animate({ opacity: 'show' }
                                    ,800
                                    ,function(){is_loading = false;pageHtml.fadeOut(500)}
                                );
                            }
                        }else{
                            emptyHtml.show();
                        }
                        
                    
                    },
                    beforeSend: function(){
                     loadHtml.show();
                     //滚动条滚到底部
                     $('body').scrollTop( $('body')[0].scrollHeight );
                     
                    },
                    complete: function(){
                     loadHtml.hide();
                     is_loading = false;
                    }
                });
                
            } 
            
        }
    },
    
    /*************************************
     * throttle();
     * 每隔一定时间间隔执行callback
     *************************************/
    throttle : function(fn, delay) {
        var timer = null;

        return function() {
            var context = this,
                args    = arguments;

            if(timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(function() {
                fn.apply(context, args);
                 
            }, delay);
        }
    },

	/****************************
	 * 
	 * 输入框在输入内容后，出现清除按钮，点击清空输入框中的内容
	 * 
	 * *****************************/
	inputClear:function(params){
		var iconName = params.iconName;
		var inputClass = params.inputClass;		
		$(iconName).hide();		
		//监听输入框，一旦输入内容，就显示清除按钮
		$(inputClass).on("keyup",function(){
			var val = $(this).val();	
			if (val == '') {
				$(this).siblings(iconName).hide();
			} else{
				$(this).siblings(iconName).show();
			}
		})
		//点击按钮，清除内容
		$(iconName).on('click',function(){
			$(this).siblings(inputClass).val("");
			$(this).hide();
		})
	},
	
	/******************************
	 * 
	 * 获取地址栏参数的值
	 * name为要获取的参数名
	 * 
	 * **************************/
	getQueryString: function (name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null){
	     	return  unescape(r[2]);
	     }
	     return null;
	},
	/***********************************
	 * 
	 * 获取验证码
	 * 
	 * *********************************/
	getCode:function(){
		//再次点击发送验证码的时间间隔
		var TIME = 60;
		var num = TIME;
		
		var code_btn = $("#code_btn");
		var setTime = null;
		
		code_btn.on("click",function(){
			var that = $(this);
			$(this).attr("disabled",true);
			setTime = setInterval(function(){
				num -- ;
				if(num < 0){
					that.text("获取验证码");
					that.attr("disabled",false);
					clearInterval(setTime);
					num = TIME;
				}else{
					that.text(num+"s");
				}
			},1000)
		})
	},
}


