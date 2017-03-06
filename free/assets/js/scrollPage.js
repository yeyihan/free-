var page ={
	scrollPage:function(params,call) {
		var def = {
            ele : '#list',
            url : '',
            msg : '暂无相关内容',
            pageCurrent:'2',
            pageAmount:'3',
           
        }
        var option = $.extend(def,params);
        var appendEle = $(option.ele);
        var ajaxUrl = option.url;
        var emptyMsg = option.msg;
        var pageCurrent = option.pageCurrent;
        var pageAmount = option.pageAmount;        
        
        
        $('body').append('<span class="scroll_currt_page"></span>');
        appendEle.append('<div class="loading_box"><img src="/views/mobile/skin/default/assets/images/loading.gif" width="50px"></div>');
		var pageHtml = $(".scroll_currt_page");
		var loadHtml = $(".loading_box");
               
		 //获取数据
        getList();
        function getList(){        
            if( pageCurrent != pageAmount ){
                $.ajax({
                    dataType : 'json',
                    type : 'post',
                    url : ajaxUrl,
                    success : function(rs){
                        var datas = rs.datas;
                        
                        if( datas != '' && pageAmount != 0){
                        	
                        	//添加数据
                            appendEle.append(datas);
                            
                            //显示分页
                            if( pageCurrent > 1){
                                pageHtml.text(pageCurrent+'/'+pageAmount).animate({ opacity: 'show' },800
                                ,function(){pageHtml.fadeOut(500)});
                            }
                            
                            //回调
                            if( typeof(call) == 'function'){
                                call();
                            }                          
                        }else{
							//无数据
							
                        }
                        
                    
                    },
                    beforeSend: function(){

                     //滚动条滚到底部
                     $('body').scrollTop( $('body')[0].scrollHeight );
                     
                    },
                    complete: function(){
     
                    }
                });
                
            }           
        }
	}
}
