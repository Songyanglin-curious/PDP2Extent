jQuery.fn.extend({
  showTree:function(opt){
  	opt=opt||{};
  	var showDataObj=$(this).prev();
  	var fn,bindings,title,callbackAny,inputFlag;
  	var _self=this;
  	var dataList=opt.data||{};
  	opt.callback?fn=opt.callback:fn=function(t,o){
  		    showDataObj.val($(t).html());
  		    $.rmwin();
  	};
  	opt.bindings?bindings=opt.bindings:null;
  	opt.callbackAny?callbackAny=opt.callbackAny:callbackAny=false;
  	opt.inputFlag?inputFlag=opt.inputFlag:inputFlag=false;
  	opt.title?title=opt.title:title='目录';
  	var width=opt.width||210;
  	var height=opt.height||460;
  	var funcBefore=opt.before||function(){};
  	if(opt.alert=='alert'){
    	$(this).click(function(){
				var html='<div  style="height:450px;width:200px;overflow:auto"><ul class="treeview filetree" id="showTreeSelectParent">';
				$.each(dataList,function(i,n){
					if(n.pgid==0){
						html+='<li class="expandable"><div class="hitarea"></div><span class="folder" val="'+n.id+'" text="'+n.name+'" pid="'+n.pgid+'"  loaded="false">'+n.name+'</span></li>';
					}
				});
				html+='</ul></div>';
				html=$(html);
				var win=$.win({title:title,html:html,width:width,height:height});
				initTree($('#showTreeSelectParent'));
				funcBefore(html);
			});
		}
		else{
			$.each(dataList,function(i,n){
				if(n.pgid==0){
					$(_self).append('<li class="expandable"><div class="hitarea"></div><span class="folder" val="'+n.id+'" text="'+n.name+'" pid="'+n.pgid+'"  loaded="false">'+n.name+'</span></li>');
				}
			});
			initTree($(_self));
		}
		if(!inputFlag){
	  	showDataObj.focus(function(){
	  		$(this).next().click();
	  	});
  	}
  	function initTree(t){
			t.find('span[loaded=false]').each(function(){
								
				var id=$(this).attr('val');
				var flag=false;
			
				$.each(dataList,function(i,n){
					if(n.pgid==id){
						flag=true;
						return false;
					}
				});
				$(this).unbind('click').bind('click',function(){
					fn(this,_self);
			    });
				if(!flag){
					//.attr('loaded','true').removeClass('folder').addClass('file');
					if($(this).parent().next().html()){
						$(this).parent().removeClass();
					}
					else{
						$(this).parent().removeClass().addClass('last');
					}
					return true;
				}
				
				$(this).parent().find("[class=hitarea]").bind('click',this,addChindList).toggle(function(){ 
					var o=$(this).parent();
					o.find('>ul').show();
					if(o.hasClass('lastExpandable')){
						o.addClass('lastCollapsable').removeClass('lastExpandable');
					}
					else{
						o.addClass('collapsable').removeClass('expandable');
					}
					//不进行其他项的合并隐藏 editer:wanglei 
//					o.siblings().each(function(){
//						if($(this).hasClass('collapsable')||$(this).hasClass('lastCollapsable')){
//							$(this).find('>span:first').click();
//						}
//					});
				},function(){
					var o=$(this).parent();
					o.find('>ul').hide();
					if(o.hasClass('lastCollapsable')){
						o.addClass('lastExpandable').removeClass('lastCollapsable');
					}
					else{
						o.addClass('expandable').removeClass('collapsable');
					}
				});
				$(this).prev().bind('click',function(){
					$(this).next().click();
				});
				$(this).parent().find("[class=hitarea]").click(); //初始化全部展开
			});
			
			var o=t.find('>ul >li:last');
			(o.html()==null)?o=t.find('>li:last'):null;
			if(o.hasClass('expandable')){
				o.addClass('lastExpandable').removeClass('expandable');
			}
			else{
				o.addClass('lastCollapsable').removeClass('collapsable');
			}
			t.find('.last').removeClass().addClass('last');
		}
		function addChindList(evt){
			if(callbackAny) { 
				fn(evt.data,_self);
			}			
			if($(evt.data).attr('loaded') == "true") return; //wanglei add 加载后不再重新加载子节点。
			var id=$(evt.data).attr('val');
			var str='';
			$.each(dataList,function(i,n){
				if(n.pgid==id){
					str+='<li class="expandable"><div class="hitarea"></div><span class="folder" val="'+n.id+'" text="'+n.name+'" pid="'+n.pgid+'" loaded="false">'+n.name+'</span></li>';
				}
			});
			if(str){
				$(evt.data).parent().append('<ul>'+str+'</ul>');				
			}
			$(evt.data).attr('loaded','true');
			$(evt.data).unbind('click',addChindList);
			initTree($(evt.data).parent());
			
		}	
  }
});
