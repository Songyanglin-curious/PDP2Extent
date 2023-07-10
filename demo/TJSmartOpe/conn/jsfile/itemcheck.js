/*流程节点检查验证插件
  wanglei 2011-10-28 add
*/

jQuery(document).ready(function () {
    Tip.Init();    
});

var Tip = (function ($, window, undefined) {
    
    return {
        Width:48,
        Height:48,
        RequestUrl:"",
        Title:"流程验证",
        ItemId:-99,
        NodeId:"",
        Count:0,
        Submit:true,
        NoCheck:false,
        HisCount:0,
        CheckResult:"",
        Group:null,
        GroupCheck:null,
        GroupCheckHTML:null,
        SingleCheckAry:null,//单选
        SingleGroupAry:null,
        HideTip: false,
        DelayHide: function () {
            if (Tip.HideTip)
                $("#oCheckListDiv").hide();
        },
        Init: function () {
            if (Tip.FlowId == "") {
                alert('未知的流程！');Tip.Submit = false; return false;
            }
            if (Tip.NodeId == "") {
                /*alert('未知的节点！');*/Tip.Submit = false; return false;
            }            
           
            Tip.CreateWindow(); 
            Tip.BindEvent(); 
            
            jQuery("form").submit(function(e){            
            
                if(Tip.NoCheck){
                    return true;
                }        
                
                if(Tip.Submit==false){
                    return false;
                }
                    
                return Tip.Submit;
            });           
        },        
        SaveResult:function(){        
            
            if(Tip.NoCheck){
                return true;
            }
        
            if (Tip.ItemId != -99 && Tip.ItemId != '') {
                Tip.Submit = false;                   
                $.ajax({
                    url: Tip.RequestUrl + 'ItemCheckHandler.ashx',                    
                    type: "post",
                    data:{ gType:"check" , gNode:Tip.NodeId , gFlow:Tip.FlowId , gItem:Tip.ItemId,gResult:Tip.CheckResult},
                    cache: false,
                    success: function (data) {                    
                        if (data.flag == "0") {
                            alert(data.msg);
                            Tip.Submit = false;
                            return false;
                        }
                        Tip.Submit = true;
                    },
                    error: function (data, status, e) {
                        alert(e);
                        Tip.Submit = false;
                        Tip.CheckResult = "";
                        return false;
                    }
                });  
            }       
        },        
        CreateWindow:function() {        
            
            Tip.Group = new Array();     
            Tip.GroupCheck = new Array();
            Tip.GroupCheckHTML = new Array();
            Tip.SingleCheckAry = new Array();
            Tip.SingleGroupAry = new Array();
            var strListHtml = "";                
            $.ajax({
                url: Tip.RequestUrl + 'ItemCheckHandler.ashx',                    
                type: "post",
                data:{ gType:"load" , gNode:Tip.NodeId , gFlow:Tip.FlowId , gItem: Tip.ItemId},
                cache: false,
                success: function (data) {                     
                     Tip.Count = 0;       
                     var iHeight = 0;
                     var checkStr = "";                     
                     var strListHtml = "";    
                     
                     if(data.flowHave == 0){
                        Tip.Count = 0;
                        Tip.NoCheck = true; //流程不包含验证设置，可以直接提交。
                        return false;
                     }                     
 
                    strListHtml += "<span id=chklist><b>流程检查信息：</b></span><br/>";
                    iHeight += 30;
                            
                     if(data.items.length == 0){
                        strListHtml += "<Br/>&nbsp;&nbsp;<img src='/i/nocheck.png' align=absmiddle />&nbsp;该检点没有检查项。";
                        iHeight += 35;
                        Tip.NoCheck = true; //流程不包含验证设置，可以直接提交。
                     }             
                     $.each(data.items, function (i, n) {
                 
                        Tip.Count++; 
                        var checkStr = "";
                        if(n.check == '1'){
                            checkStr = "checked='checked'";
                        }         
                        var cheId = 'chk'+Tip.Count;
                        if(n.type == 2){       
                            var have = false;          
                            for (var j = 0; j < Tip.Group.length; j++) {
                                if(n.group == Tip.Group[j]){
                                    have = true;
                                }
                            }      
                            if(!have){
                                 Tip.Group.push(n.group);    
                                 Tip.GroupCheck.push(new Array());                                   
                                 strListHtml += "<Br/><span group="+n.group+"></span>";
                                 iHeight += 40;
                                 
                            }  
                            for (var j = 0; j < Tip.Group.length; j++) {
                                if(n.group == Tip.Group[j]){
                                    Tip.GroupCheck[j].push(cheId);
                                }
                            }   
                            Tip.GroupCheckHTML.push(new Array(n.group,"<span><input class='c'  id="+cheId+" key='"+ n.id +"' valid='"+n.type+"' group='"+n.group+"'  type='checkbox'  "+checkStr+"  />&nbsp;"+ n.text +"</span>"));                  
                        }    
                        else if(n.type == 1 || n.type == 3){
                            var br = "";
                            if(i>0)br="<Br/>";
                            strListHtml += ""+br+"<span><input class='c' id="+cheId+" key='"+ n.id +"' valid='"+n.type+"' group='"+n.group+"'  type='checkbox'  "+checkStr+"  />&nbsp;"+ n.text +"</span>";
                            iHeight += 25;
                        }          
                        else if(n.type == 4){ //单选         
                            Tip.Count--;               
                            var have = false;       
                            for (var j = 0; j < Tip.SingleGroupAry.length; j++) {
                                if(n.group == Tip.SingleGroupAry[j]){
                                    have = true;
                                }
                            }  
                            if(!have){          
                                Tip.SingleGroupAry.push(n.group);                                             
                                iHeight += 40;
                                var gHtml = "<br/><span></span><fieldset >"; 
                                gHtml += "<legend>"+n.group+"</legend>";
                                for (var i = 0; i < data.items.length; i++) {
                                    if(data.items[i].group == n.group && n.type == 4){   
                                        var chkName = 'singleChk'+i;
                                        Tip.SingleCheckAry.push(new Array(n.group,chkName));      
                                        checkStr = "";
                                        if(data.items[i].check == '1'){
                                            checkStr = "checked='checked'";
                                        }                                   
                                        gHtml += "<span><input class='c'  id="+chkName+" key='"+ data.items[i].id +"' valid='"+data.items[i].type+"' group='"+data.items[i].group+"'  type='checkbox'  "+checkStr+"  />&nbsp;"+ data.items[i].text +"</span>";
                                    }                            
                                }
                                gHtml += " </fieldset>";  
                                strListHtml += gHtml;        
                            }    
                        }
                        
                     });
                     var iHisHeigth = 0;                     
                     if(data.his.length){
                        strListHtml += "<br/><Br/><span id=hislist><b>历史检查信息列表：</b></b></span>";
                        iHisHeigth += 30;
                        Tip.HisCount = data.his.length;
                     }                     
                     var hisAry = new Array();                     
                     //显示历史
                     $.each(data.his, function (i, n) {
                        var have = false;     
                        
                        for (var j = 0; j < hisAry.length; j++) {
                            if(n.node == hisAry[j]){
                                have = true;
                            }
                        } 
                        if(!have){
                            hisAry.push(n.node);    
                            var info = "";
                            var hisGroup = new Array();
                            $.each(data.his, function (j, c) {
                                
                                if(c.node == n.node){
                                    var imgUrl = "disable.gif";
                                    if(c.check == '1'){
                                        imgUrl = "correct.gif";
                                    } 
                                    if (c.type == 1) {                                                                                                                   
                                        info +=  escape("<p>&nbsp;&nbsp;"+c.text + "&nbsp;<img src='/i/"+imgUrl+"' align=absmiddle /></p>");                                        
                                    }   
                                    else if(c.type == 2 || c.type == 4){
                                        var groupHave = false;
                                        for (var j = 0; j < hisGroup.length; j++) {
                                            if(c.group == hisGroup[j]){
                                                groupHave = true;
                                            }
                                        } 
                                        if(!groupHave){
                                            hisGroup.push(c.group); 
                                            var gHtml = "<fieldset >"; 
                                            gHtml += "<legend>"+c.group+"</legend>";
                                            for (var i = 0; i < data.his.length; i++) {
                                                if((data.his[i].group == c.group)&&(data.his[i].node == c.node)) {
                                                    imgUrl = "disable.gif";
                                                     if(data.his[i].check == '1'){
                                                        imgUrl = "correct.gif";
                                                    }
                                                    gHtml += escape("<span>&nbsp;&nbsp;"+data.his[i].text + "&nbsp;<img src='/i/"+imgUrl+"' align=absmiddle /></span>"); 
                                                }                            
                                            }
                                            gHtml += " </fieldset>";  
                                            info += gHtml;        
                                        }
                                    }
                                    else if(c.type == 3){                                                                                
                                        info +=  escape("<p>&nbsp;&nbsp;"+c.text + "&nbsp;<img src='/i/"+imgUrl+"' align=absmiddle /></p>");                                        
                                    }     
                                                          
                                }
                            }); 
                               
                            strListHtml += "<Br/>&nbsp;&nbsp;<img src='/i/note.png' align=absmiddle>&nbsp;<a HintTitle="+n.node+" HintInfo='"+info+"' class='his' node="+n.node+" href='#'>"+n.node+"</a><Br/>";
                            iHisHeigth += 30;                                 
                        }  
                     });
                       
                     var oCheckListDiv = document.createElement("div");
                     oCheckListDiv.id = "oCheckListDiv";
                     oCheckListDiv.innerHTML = strListHtml;
                     oCheckListDiv.className = "checklist";
                     var iLeft = 8;
                     var iTop = document.body.clientHeight - Tip.Height - iHeight - iHisHeigth;            
                     oCheckListDiv.style.left = iLeft + "px";
                     //oCheckListDiv.style.top = iTop + "px";
                    oCheckListDiv.style.bottom = Tip.Height + "px";
                    var frmFilter = document.createElement("<iframe frameborder='0' src='' style=\"position:absolute;visibility:inherit;top:0;left:0; z-index: -1;filter='progid:dximagetransform.microsoft.alpha(style=0,opacity=0)';\"></iframe>");
                    oCheckListDiv.appendChild(frmFilter);
                     document.body.appendChild(oCheckListDiv);    
                    frmFilter.style.height = frmFilter.parentNode.offsetHeight;
                    frmFilter.style.width = frmFilter.parentNode.offsetWidth;                   
                     $("#oCheckListDiv").hide();             
                    for (var j = 0; j < Tip.Group.length; j++) {
                        var gHtml = "<fieldset >"; 
                        gHtml += "<legend>"+Tip.Group+"</legend>";
                        for (var i = 0; i < Tip.GroupCheckHTML.length; i++) {
                            if(Tip.GroupCheckHTML[i][0] == Tip.Group){
                                gHtml += Tip.GroupCheckHTML[i][1];
                            }                            
                        }
                        gHtml += " </fieldset>";  
                        $('span[group='+Tip.Group+']').html(gHtml);
                     }  
                                
                },
                error: function (data, status, e) {
                    alert(e);Tip.Submit = false;
                }
            });    
            if (Tip.Count > 0 || Tip.HisCount > 0) {
                var windowHtml = "<div id='window_tip' class='abs'>";            
                windowHtml += "<img src='/i/check.gif' class='tip-img' alt='"+ Tip.Title +"' />";
                windowHtml += "<div>";           
                var oDiv = document.createElement("div");
                oDiv.innerHTML = windowHtml;
                oDiv.style.width =  "100px";
                oDiv.style.height = "100px";
                oDiv.className = "abs";
                var iLeft = 0;
                var iTop = document.body.clientHeight - Tip.Height;            
                oDiv.style.left = iLeft + "px";
                oDiv.style.top = iTop + "px";
                document.body.appendChild(oDiv);     
            }               
        },
        BindEvent:function() {


            $("[HintTitle],[HintInfo]").focus(function (event) {              
                $("*").stop(); 
		        $("#HintMsg").remove(); 
                var HintHtml = "<ul id=\"HintMsg\"><li class=\"HintTop\"></li><li class=\"HintInfo\"><b>" + $(this).attr("HintTitle") + "</b>" + unescape($(this).attr("HintInfo")) + "</li><li class=\"HintFooter\"></li></ul>"; 
                var offset = $(this).offset();
                $("body").append(HintHtml); 
                $("#HintMsg").fadeTo(0, 0.95); 
                var HintHeight = $("#HintMsg").height(); 
                $("#HintMsg").css({ "top": offset.top - HintHeight + "px", "left": (offset.left - 30) + "px" }).fadeIn(500);
                }).blur(function(event) {
                    $("#HintMsg").remove(); 
            });               
            $('img.tip-img').live('click', function () {                
                $("#oCheckListDiv").show(); 
            }).live('mouseover', function () {
                $("#oCheckListDiv").show(); 
            }).live('mousedown', function () {
                $("#oCheckListDiv").show(); 
            }).live('mouseup', function () {
                $("#oCheckListDiv").show(); 
            }); 
            $('div#oCheckListDiv').live('mouseout', function () {                
                //$("#oCheckListDiv").hide();
                Tip.HideTip = true;
                setTimeout("Tip.DelayHide();", 300);
            }).live('mouseover', function () {
                //$("#oCheckListDiv").show();
                Tip.HideTip = false;
            }).live('mousemove', function () {
                Tip.HideTip = false;
            });
            $('input[class=c]').live('click',function(){   
                
                if($(this).attr("checked")){
                     $(this).parent().removeClass('error');                   
                     if($(this).attr("valid") == 2){  
                        $('input[group='+$(this).attr("group")+']').parent().removeClass('error');
                     }
                }                      
            });
            $('input[valid=4]').live('click',function(){   
               
                $('input[valid=4][group='+$(this).attr("group")+']').attr("checked",false);                
                $(this).attr("checked",true);
                $(this).parent().parent().removeClass('error');   
                
            });
            $('input.btnSave').live('click', function () {
                Tip.CheckResult = '';
                for (var i = 1; i <= Tip.Count; i++) {
                    var checkVal = 0;              
                    if ($("#chk" + i).attr("checked")) {
                        checkVal = 1;
                    }
                    Tip.CheckResult += "{"+$("#chk"+i).attr("key")+","+checkVal+"}";                    
                }
                for (var i = 0; i < Tip.SingleCheckAry.length; i++) {
                    var chkVal = 0;
                    var chk = $('#'+Tip.SingleCheckAry[i][1]);
                    if(chk.attr("checked")){                       
                        chkVal = 1;
                    }
                    Tip.CheckResult += "{"+chk.attr("key")+","+chkVal+"}";  
                } 
                Tip.Submit = Tip.SaveResult();                
            });
            $('input.flow_button').live('click', function () {    
                Tip.CheckItem();
            });

//            $('input.btnKick').live('click', function () {  
//                Tip.CheckItem();
//            }
	   
        },
        CheckItem : function(){
            Tip.Submit=false;
            var pass = true;
            Tip.CheckResult = '';       
            for (var i = 1; i <= Tip.Count; i++) {
                var chk = $("#chk"+i);
                var type = chk.attr("valid");
                var checkVal = chk.attr("checked") ? 1 : 0;
                if(type == 1){
                    if(!chk.attr("checked")){
                        chk.parent().addClass('error');
                        pass = false;
                        break;
                    }
                    Tip.CheckResult += "{"+chk.attr("key")+","+checkVal+"}";     
                }
                else if(type == 2){                        
                                                             
                }
                else if(type == 3){
                    Tip.CheckResult += "{"+chk.attr("key")+","+checkVal+"}";
                }
                else{
                    alert('未知的检查类别');
                    pass = false;
                }                                              
            }
            for (var i = 0; i < Tip.GroupCheck.length; i++) {
                var have = false;                   
                for (var j = 0; j < Tip.GroupCheck[i].length; j++) {
                    var chk = $("#"+Tip.GroupCheck[i][j]);
                    var group = chk.attr("group");
                    if(chk.attr("checked")){
                        have = true;                          
                    }                        
                    Tip.CheckResult += "{"+chk.attr("key")+",1}";         
                }
                if(!have){
                        pass = false;
                    for (var j = 0; j < Tip.GroupCheck[i].length; j++) {
                        $("#"+Tip.GroupCheck[i][j]).parent().addClass('error');
                        }
                        break;
                }
            } 
                
 
            for (var i = 0; i < Tip.SingleGroupAry.length; i++) {
                var singleChk = false;         
                var chk = null;           
                for (var j = 0; j < Tip.SingleCheckAry.length; j++) {
                    if(Tip.SingleGroupAry[i] == Tip.SingleCheckAry[j][0]){
                        var chkVal = 0;
                        chk = $('#'+Tip.SingleCheckAry[j][1]);
                        if(chk.attr("checked")){
                            singleChk = true;
                            chkVal = 1;
                        }
                        Tip.CheckResult += "{"+chk.attr("key")+","+chkVal+"}";  
                    }
                }
                if(!singleChk){
                    chk.parent().parent().addClass('error');
                    pass = false;
                    break;
                }  
            }                
               
            if(!pass){
                alert('您还没有完成流程检查操作,不能提交表单！');
                $("#oCheckListDiv").show();
                Tip.Submit = false;
                Tip.CheckResult = "";
                return false;
            }                
            Tip.Submit = Tip.SaveResult();
        }
    }  
    
})(jQuery, this);