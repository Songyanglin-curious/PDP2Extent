/*
    王磊友情提示：
    报表设计器扩展脚本文件
    您所使用的版本为: Version 1.0.0.0  请不要擅自修改,它会让开发人员清楚的了解当前程序中所使用的版本。
    这个文件会随着版本的升级而更新。
    如发现问题请发送邮件: mailto:wanglei@ysh.com
*/
var CONST_SOURCE_TYPE_SQL = "Single";
var CONST_SOURCE_TYPE_JOIN = "Join";
var CONST_SOURCE_TYPE_CUS = "Sql";

var CONST_FIELD_SRC_SEARCH = "Search";
var CONST_FIELD_SRC_DATABASE = "DataBase";

var CONST_FILL_DATE = "Day"
var CONST_FILL_MONTH = "Month"
var CONST_FILL_YEAR = "Year"
var CONST_FILL_NUMBER = "Number";
var CONST_FILL_CUS = "Cus";

var CONST_SEARCH_TEXTBOX = "TextBox";
var CONST_SEARCH_DROPDOWNLIST = "DropDownList";
var CONST_SEARCH_DATETIME = "DateTime";
var CONST_SEARCH_SESSION = "Session";
var CONST_SEARCH_URL = "Url";
var CONST_SEARCH_QUARTER = "Quarter";
var CONST_SEARCH_WEEK = "Week";

var inputReg = /^[A-Za-z]+$/;

var searchType = [
                    [CONST_SEARCH_TEXTBOX,"文本框","Val"],
                    [CONST_SEARCH_DROPDOWNLIST,"下拉列表","Val"],
                    [CONST_SEARCH_DATETIME,"日期时间","Val"],
                    [CONST_SEARCH_SESSION,"SESSION","Back"],
                    [CONST_SEARCH_URL,"网页参数","Back"],
                    [CONST_SEARCH_QUARTER,"季度控件","Val"],
                    [CONST_SEARCH_WEEK,"日期周控件","Val"]
                 ];
                 
var sqlType = [
                   [CONST_SOURCE_TYPE_SQL,"单条SQL"],
                   [CONST_SOURCE_TYPE_JOIN,"关联SQL"],
                   [CONST_SOURCE_TYPE_CUS,"自由SQL"]
              ];
              
var joinType = [
                    ["Left","左联"],
                    ["Right","右联"],
                    ["Inner","内联"]
               ];

var srcType = [
                   [CONST_FIELD_SRC_SEARCH,"查询条件"],
                   [CONST_FIELD_SRC_DATABASE,"数据源"]
              ];

var fillType = [
                   [CONST_FILL_DATE,"日单元"],
                   [CONST_FILL_MONTH,"月单元"],
                   [CONST_FILL_YEAR,"年单元"],
                   [CONST_FILL_NUMBER,"数字"],
                   [CONST_FILL_CUS,"自定义"]
               ];

var fieldFilter = ["{0}.","{1}."];//当查询条件设置数据源列的时候需要过滤掉这些

$.extend({
    FillType:function(data,id){
        for(var i=0; i<data.length; i++){
            $("<option value='"+ data[i][0] +"'>"+data[i][1]+"</option>").appendTo("#"+id+"");
        }  
    },
    GetTypeName:function(t,obj){
        for(var i=0; i< obj.length ; i++){
            if(t==obj[i][0]){
                return obj[i][1];
            }
        }
        return "";
    },
    Insert:function(str,obj){
        if(document.selection) { 
            obj.focus(); 
            var sel=document.selection.createRange(); 
            document.selection.empty(); 
            sel.text = str; 
        } 
        else { 
            var prefix, main, suffix; 
            prefix = obj.value.substring(0, obj.selectionStart); 
            main = obj.value.substring(obj.selectionStart, obj.selectionEnd); 
            suffix = obj.value.substring(obj.selectionEnd); 
            obj.value = prefix + str + suffix; 
        } 
        obj.focus(); 
    },    
    GetPropertyLabel:function(text){
         var reg = /{(.*?)}/gi;
         var labels = text.match(reg);
         return labels;
    },
    GetClientHeight:function(doc){
        if(doc.documentElement.clientHeight==0){
            return doc.body.clientHeight; 
        }else{
            return doc.documentElement.clientHeight; 
        }
    },
    GetClientWidth:function(doc){
        if(doc.documentElement.clientWidth==0){
            return doc.body.clientWidth; 
        }else{
            return doc.documentElement.clientWidth; 
        }
    },
    GetValueBySearch:function(id , type){
        var getType = "";
        for(var i=0;i<searchType.length;i++){
            if(type == searchType[i][0]){
                getType = searchType[i][2];
            }
        }
        var result = "";
        switch(getType){
            case "Val":
            result = $("#"+id).val();
            break;
            case "Back":
            result = $("#"+id).val();
            break;
            default:
            break;
        }   
        return result;
    },    
    SetSelectedByVal:function(obj , val){
        for(var i=0; i<obj.options.length; i++)
        {
            if(obj.options[i].value == val){
                obj.options[i].selected = true;
            }
        }
    },
    SetWindowPosition: function(divId,addW,addH){
        var clientHeight = $.GetClientHeight(document);
        var clientWidth = $.GetClientWidth(document);    
        var iLeft = clientWidth/2 - addW;
        var iTop = clientHeight/2 + addH;
        $("#"+divId).css('left',iLeft);
        $("#"+divId).css('top',iTop);            
    },
    GetUrlParam: function(paramName){    
        var url = location.href; 
        var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
        var j = "";
        for (var i=0; j=paraString[i]; i++){ 
            if(j.substring(0,j.indexOf("=")).toLowerCase() == paramName.toLowerCase()){
                return j.substring(j.indexOf("=")+1,j.length);
            } 
        } 
        return "";
    },
    CheckLogin: function(){
        //验证登录
        $.ajax({
            url: "/conn/ashx/LoginHandler.ashx",                    
            type: "post",
            cache: false,
            success: function (data) {    
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }              
                if(data.flag=="2"){
                    alert(data.msg);
                    window.location.href='/Default.aspx';
                    return false;
                }                     
            }
        });         
    }

})

setTimeout(function() { 
$("#selSouProperty option").attr("selected",true);
$("#selConOut option").attr("selected",true);
$("#selFieldSource option").attr("selected",true);
$("#selSheet option").attr("selected",true);
$("#selLabel option").attr("selected",true);
}, 1);