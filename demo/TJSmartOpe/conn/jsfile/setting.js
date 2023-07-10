
var curStep = 0;
var xmlFileName = '';
var condition;
var source;
var field;

var ConditionHandler = "conn/ashx/ConditionHandler.ashx";
var SourceHandler = "conn/ashx/SourceHandler.ashx";
var FieldHandler = "conn/ashx/FieldHandler.ashx";
var AdvancedHandler = "conn/ashx/AdvancedHandler.ashx";

var CONST_PROPERTY_PREV = "{";
var CONST_PROPERTY_LAST = "}";

$(function(){    

    $("#divReportBack").attr('width','500px');        
    
    $.FillType(searchType,'selConSearchType');
    $.FillType(sqlType,'selSouType');
    $.FillType(joinType,'selSourceJoin');
    $.FillType(srcType,'selFieldSource');    
    $.FillType(fillType,'selFillType');
    

    $("<option value='111111'>年-月-日 时:分:秒</option>").appendTo("#selDateFormat");
    $("<option value='111110'>年-月-日 时:分</option>").appendTo("#selDateFormat");    
    $("<option value='111100'>年-月-日 时</option>").appendTo("#selDateFormat");
    $("<option value='111000'>年-月-日</option>").appendTo("#selDateFormat");
    $("<option value='110000'>年-月</option>").appendTo("#selDateFormat");
    $("<option value='100000'>年</option>").appendTo("#selDateFormat");
    
    init_sheet();
    
    condition = new Condition(xmlFileName);        
    source = new Source(xmlFileName);
    condition.sourceObj = source;    
    field = new Field(xmlFileName);
    condition.ref_conditions();   
    source.ref_sources();
    source.ref_fills();

    checkStepStatus();  
    
    init_tables();
       
    $("input[class=step]").click(function(){
    
        var actionName = $(this).attr("value");
        switch(actionName){
            case "上一步":
            if(curStep > 0){curStep--;}
            break;
            case "下一步":
            if(curStep < 2){curStep++;}
            break;
            case "完 成":            
            curStep++;
            break;
            default:
            alert('未知的操作');
            return;
        }
        checkStepStatus();        
    });
    
    $.SetWindowPosition("divTempSetting",120,100);    
    $.SetWindowPosition("divSourceFillData",120,100);
    
    $.SetWindowPosition("divFillData",200,-100);
    $.SetWindowPosition("iframeFillData",200,-100);
    
    $.SetWindowPosition("divSelectTable",100,-100);
    $.SetWindowPosition("iframeSelectTable",100,-100);
    
    $.SetWindowPosition("divDataSource",120,-100);
    
    $.SetWindowPosition("divAdvancedSetting",400,-300);
    $.SetWindowPosition("iframeAdvancedSetting",400,-300);
    
    $.SetWindowPosition("divAddAttribute",200,-100);
    
    
    $("#btnConSave").click(function(){
        var id = $("#txtConId").val();
        var type = $("#selConSearchType").val();
        var name = $("#txtConName").val();
        var out = $("#selConOut").val();
        var def = $("#txtConDefault").val();        
        var format = $("#selDateFormat").val();
        if($.trim(id) == ''){ alert('条件编号不能为空！'); return false; }
        if($.trim(type) == ''){ alert('查询类型不能为空！'); return false; }
        if($.trim(name) == ''){ alert('条件描述不能为空！'); return false; }        
        $.ajax({
            url: ConditionHandler,                    
            type: "post",
            data:{ postType:"SaveCon" , pFile: xmlFileName , pId:id , pType:type, pName:name , pOut:out , pDef:def,pFormat:format,pSaveType:condition.saveType,pOld:$("#txtHidConId").val() },
            cache: false,
            success: function (data) {      
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }          
                clear_condition();    
                condition.ref_conditions(); 
                $("#btnConCancel").hide();                      
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });  
    });
    
    $("#selSouType").change(function(){
        $("#divSql").hide();
        $("#divJoin").hide();
        $("#divCus").hide();        
        var type = $("#selSouType").val();
        if( $.trim(type) == CONST_SOURCE_TYPE_SQL){
            $("#divSql").show();
        }
        else if($.trim(type) == CONST_SOURCE_TYPE_JOIN){
           $("#divJoin").show();
        }
        else if($.trim(type) == CONST_SOURCE_TYPE_CUS){
            $("#divCus").show();
        }
    })
    
    
    $("#btnSouSave").click(function(){
        var id = $("#txtSouId").val();
        var type = $("#selSouType").val();
        var name = $("#txtSouName").val();
        if($.trim(id) == ''){ alert('数据源关键字不能为空！'); return false; }
        if($.trim(type) == ''){ alert('数据源类型不能为空！'); return false; }
        if($.trim(name) == ''){ alert('数据源描述不能为空！'); return false; }          
        
        var table = '';
        var field = '';
        var where = '';
        var order = '';        
        var lsrc = '';
        var rsrc = '';
        var join = '';
        var on = '';        
        var sql = '';    
        var seq = $("#chkSeq").attr('checked') ? true : false;
        var temp = $("#selDataTemp").val();
        var labels = [];
        switch(type){
            case CONST_SOURCE_TYPE_SQL:
                table = $("#txtTableName").val();
                field = $("#txtTableField").val();
                where = $("#txtWhere").val();
                order = $("#txtOrderBy").val();
                if($.trim(table) == ''){ alert('数据表名称不能为空！'); return false; }
                if($.trim(field) == ''){ alert('数据表列不能为空！'); return false; }
                labels = $.GetPropertyLabel(where);
                if(labels!=null){
                    for(var i=0; i<labels.length; i++){
                        where = where.replace(labels[i], CONST_PROPERTY_PREV + getPropertyIDByName(labels[i]) + CONST_PROPERTY_LAST);                        
                    }  
                }
            break;
            case CONST_SOURCE_TYPE_JOIN:
                lsrc = $("#txtTable1").val();
                rsrc = $("#txtTable2").val();
                join = $("#selSourceJoin").val();
                on = $("#txtOn").val();
                field = $("#txtJoinField").val();
                where = $("#txtJoinWhere").val();
                order = $("#txtJoinOrderBy").val();   
                if($.trim(lsrc) == ''){ alert('数据表1不能为空！'); return false; }
                if($.trim(rsrc) == ''){ alert('数据表2不能为空！'); return false; }
                if($.trim(on) == ''){ alert('关联项不能为空！'); return false; }
                if($.trim(field) == ''){ alert('数据表列不能为空！'); return false; }      
                labels = $.GetPropertyLabel(where);
                if(labels!=null){
                    for(var i=0; i<labels.length; i++){
                        if(labels[i] != '{0}' && labels[i] !='{1}'){
                            where = where.replace(labels[i], CONST_PROPERTY_PREV + getPropertyIDByName(labels[i]) + CONST_PROPERTY_LAST); 
                        }                                               
                    }    
                }
            break;
            case CONST_SOURCE_TYPE_CUS:
                sql = $("#txtSouCusSQL").val();    
                if($.trim(sql) == ''){ alert('SQL语句不能为空！'); return false; }
                labels = $.GetPropertyLabel(sql);
                if(labels!=null){
                    for(var i=0; i<labels.length; i++){
                        sql = sql.replace(labels[i], CONST_PROPERTY_PREV + getPropertyIDByName(labels[i]) + CONST_PROPERTY_LAST);                        
                    }
                }
            break;
            default:
                alert('未知类型');
                return false;
        }        
        $.ajax({
            url: SourceHandler,                    
            type: "post",
            data:{ postType:"SaveSource" , pFile: xmlFileName , pId:id , pType:type, pName:name , pSql:sql , pTable:table, pField:field, pWhere:where, pOrder:order, 
                pLSrc: lsrc, pRSrc: rsrc, pJoin: join, pOn: on, pSaveType: source.saveType, pOldId: $("#hidSourceId").val(), pSeq: seq, pTemp: temp
            },
            cache: false,
            success: function (data) {      
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }         
                clear_source();     
                source.ref_sources();
                $("#btnSouCancel").hide();   
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });        
    })
    
    $("#selSouProperty").dblclick(function(){  
        var item= $("#selSouProperty option:selected");
        var id = item.attr("value");
        var text = item.text();
        var label = CONST_PROPERTY_PREV + text + CONST_PROPERTY_LAST;
        switch($("#selSouType").val()){
            case CONST_SOURCE_TYPE_SQL:
                $.Insert(label,$("#txtWhere"));
            break;
            case CONST_SOURCE_TYPE_JOIN:
                $.Insert(label,$("#txtJoinWhere"));
            break;
            case CONST_SOURCE_TYPE_CUS:
                $.Insert(label,$("#txtSouCusSQL"));
            break;
            default:
                alert('未知类型');
                return false;
        }            
    })
    
    $("#selSheet").change(function(){ 
        field.ref_labels($("#selSheet option:selected").val());
    })
    
    $("#btnSaveField").click(function(){
        var sheet = $("#selSheet").val();
        var id = $("#selLabel").val();
        var name = $("#txtFieldName").val();
        var type = $("#selFieldSource").val();
        var src = $("#txtFieldSrc").val();
        
        if(type == CONST_FIELD_SRC_SEARCH){        
            src = getPropertyIDByName(CONST_PROPERTY_PREV+src+CONST_PROPERTY_LAST);                  
        }
        else{
            src = getSourceIdByName(src);
        }
        var f = $("#txtFieldCol").val();
        var filter = $("#txtFilter").val();
        if($.trim(id) == ''){ alert('报表字段不能为空！'); return false; }
        if($.trim(type) == ''){ alert('数据来源不能为空！'); return false; }
        if($.trim(src) == ''){ alert('数据源不能为空！'); return false; }
        if($.trim(f) == ''){ alert('数据列表不能为空！'); return false; }      
        $.ajax({
            url: FieldHandler,                    
            type: "post",
            data:{ postType:"SaveField" , pFile: xmlFileName,pSaveType:field.saveType, pSheet:sheet, pId:id , pType:type, pName:name , pSrc:src , pField:f, pFilter:filter,pOldId:$("#hidOldLabel").val() },
            cache: false,
            success: function (data) {      
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }              
                clear_field();
                field.ref_fields();
                $("#btnFieldCancel").hide();   
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });                
    })
    
       
    $("#btnSetSource").click(function(){
        var src = $("#selConSource").val();
        var text = $("#txtTextFields").val();
        var val = $("#txtValueFields").val();
        condition.save_condition_datasource(src,text,val);        
    })
    
    $("#btnConCancel").click(function(){
        clear_condition();
        condition.saveType = 0;
        $("#btnConCancel").hide();        
    })    
    $("#btnSouCancel").click(function(){
        clear_source();
        source.saveType = 0;
        $("#btnSouCancel").hide();   
    })
    $("#btnFieldCancel").click(function(){
        clear_field();
        field.saveType = 0;
        $("#btnFieldCancel").hide();   
    })
    
    $("#btnFillData").click(function(){
        condition.fillConByFillOut();
        source.show_filldata('',null);
//        source.ref_fills();
    })
    
    $("#btnFillCancel").click(function(){
        clear_fill();
        field.fillSaveType = 0;
        $("#btnFillCancel").hide();  
    })
    
    //保存填充数据集
    $("#btnFillSave").click(function(){
        var fillId = $("#txtFillId").val();
        var fillName = $("#txtFillName").val();
        var fillType = $("#selFillType").val();
        var fillOffset = $("#txtOffset").val();
        var startValue = $("#txtStartValue").val();
        var maxValue = $("#txtMaxValue").val();
        var fillOut = getPropertyIDByOut($("#selFillOut").val());
        
        var fillCusData = $("#txtFillCusData").val();
        if($.trim(fillId) == ''){ alert('填充关键字不能为空！'); return false; }
        if($.trim(fillType) == ''){ alert('填充不能为空！'); return false; }
        if(fillType == CONST_FILL_CUS){
            if($.trim(fillCusData) == ''){ alert('自定义数据不能为空！'); return false; }
        }
        else{
            if($.trim(fillOffset) == ''){ alert('递增量不能为空！'); return false; }
        }
        $.ajax({
            url: SourceHandler,                    
            type: "post",
            data:{ postType:"SaveFill" , pFile: xmlFileName,pSaveType:source.fillSaveType, 
            pFillId:fillId, pFillName:fillName , pType:fillType, pOffset:fillOffset , pOut:fillOut , 
                pCusData: fillCusData, pOldId: $("#hidOldFillId").val(), pStart: startValue, pMax: maxValue
            },
            cache: false,
            success: function (data) {      
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }              
                clear_fill();                
                $("#btnFillCancel").hide();                  
                source.ref_fills();
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });           
    })
    
    $("#btnSaveSourceFill").click(function(){
        var fillId = $("#selFillData").val();
        var fillFied = $("#txtSourceField").val();
        var sid = $("#btnSaveSourceFill").attr("sid");
        $.ajax({
            url: SourceHandler,                    
            type: "post",
            data:{ postType:"SetFillSource" , pFile: xmlFileName, pId:sid, 
                pFillId: fillId, pField: fillFied
            },
            cache: false,
            success: function (data) {                  
                alert(data.msg);      
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    return false;
                }   
                source.ref_sources();      
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });           
    })
    
    $("#selConSearchType").change(function(){
        if($(this).val() != CONST_SEARCH_DATETIME){
            $("#selDateFormat").attr("disabled","disabled");
        }
        else{
            $("#selDateFormat").removeAttr("disabled");
        }
        if($(this).val() == CONST_SEARCH_SESSION || $(this).val() == CONST_SEARCH_URL ){
            $("#lbKeyName").text("关键字");
        }
        else{
            $("#lbKeyName").text("默认值");
        }
    })
    
    
    $("#selFieldSource").change(function(){
        $("#txtFieldSrc").val("");
        $("#txtFieldCol").val("");
        $("#txtFilter").val("");
        $("#txtFilter").attr("disabled","disabled");
        if($(this).val() == CONST_FIELD_SRC_SEARCH){
            $("#txtFieldCol").val("0");            
        }
        else{
            $("#txtFilter").removeAttr("disabled");
        }
    })
    
})
/**********************************************************************************************************************************************************************************************/
$(document).ready(function(){

    $("#divReportMenu").find('li').click(function(){    
        curStep = $(this).index();
        checkStepStatus();       
    })    
    
    $('a[class=selectTable]').live('click',function(){    
       
        
        $("#divSelectTable").attr('ref',$(this).attr('v'));
        $("#divSelectTable").show();    
        $("#iframeSelectTable").show();   
        
        $("#divSelectTableField").hide();
        $("#divSelectJoinTableField").hide();
           
    })
    
    $('a[class=tblist]').live('click',function(){
        var souType = $("#selSouType").val();
        $("#"+$("#divSelectTable").attr('ref')).val($(this).attr('id'));                   
        $("#divSelectTable").hide(); 
        $("#iframeSelectTable").hide();
        $("#divSelectTableField").hide();
        $("#divSelectJoinTableField").hide();
    })
    
    $("#txtTableField").live('click',function(){
        if($("#txtTableName").val() == ""){
            return false;
        }
        $.ajax({
            url: ConditionHandler,                    
            type: "post",
            data:{ postType:"GetTableColumns" , pFile: xmlFileName ,pTable1:$("#txtTableName").val(),pTable2:'' },
            cache: false,
            success: function (data) {    
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }    
                var sInnerHtml = "<p><a href='#' class=closeList><img src='/i/close.gif' /></a></p>";  
                sInnerHtml += "<ul>";
                $.each(data.columns1, function (i, n) {
                    sInnerHtml += "<li><a href='#' id='"+n.name+"' class=sqlField>"+n.memo+"</a></li>";
                })
                sInnerHtml += "</ul>";
                $("#divSelectTableField").html(sInnerHtml);
                $("#divSelectTableField").show();
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });   
    })
    
    $("a[class=closeList]").live('click',function(){
        $(this).parent().parent().hide();
    })
    
    $('a[class=sqlField]').live('click',function(){

        var id = $(this).attr("id");
        if($.trim($("#txtTableField").val()) != ""){
            id = ","+id;
        }
        $.Insert(id,$("#txtTableField"));      

    })    
    
    $("#txtJoinField").live('click',function(){
        if($("#txtTable1").val() == "" && $("#txtTable2").val() == ""){
            return false;
        }
        $.ajax({
            url: ConditionHandler,                    
            type: "post",
            data:{ postType:"GetTableColumns" , pFile: xmlFileName ,pTable1:$("#txtTable1").val(),pTable2:$("#txtTable2").val() },
            cache: false,
            success: function (data) {      
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }  
                var sInnerHtml = "<p><a href='#' class=closeList><img src='/i/close.gif' /></a></p>";  
                sInnerHtml += "<h3>" + data.table1 + "</h3>";
                sInnerHtml += "<ul>";
                $.each(data.columns1, function (i, n) {
                    sInnerHtml += "<li><a href='#' id='"+data.table1+"."+n.name+"' class=joinField>"+n.memo+"</a></li>";
                })
                sInnerHtml += "</ul>";
                sInnerHtml += "<h3>" + data.table2 + "</h3>";
                sInnerHtml += "<ul>";
                $.each(data.columns2, function (i, n) {
                    sInnerHtml += "<li><a href='#' id='"+data.table1+"."+n.name+"' class=joinField>"+n.memo+"</a></li>";
                })
                sInnerHtml += "</ul>";
                $("#divSelectJoinTableField").html(sInnerHtml);
                $("#divSelectJoinTableField").show();
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        }); 
    })    
    
    $('a[class=joinField]').live('click',function(){    
        var id = $(this).attr("id");
        if($.trim($("#txtJoinField").val()) != ""){
            id = ","+id;
        }
        $.Insert(id,$("#txtJoinField"));     
    })
    
    $("#txtFieldCol").live('click',function(){
        if($("#selFieldSource").val() == CONST_FIELD_SRC_DATABASE){ //数据库
            if($.trim($("#txtFieldSrc").val())=="") return;
            setSourceField("divSelectDataBindField",getSourceIdByName($("#txtFieldSrc").val()),"databind");
            $("#divSelectDataBindField").show();
        }
    })  
    
    $('a[class=databind]').live('click',function(){
        var id = $(this).attr("id");
        if($.trim($("#txtFieldCol").val()) != ""){
            id = ","+id;
        }
        $.Insert(id,$("#txtFieldCol"));        
    })
    
    $('a[class=step1Remove]').live('click',function(){
        if(confirm('真的要删除这个查询条件吗？')){
            var rowIndex = $(this).parent().parent().index();
            var id = $("#tbCondition tr:eq("+rowIndex+") td:nth-child(1)").html();    
            $.ajax({
                url: ConditionHandler,                    
                type: "post",
                data:{ postType:"RemoveCondition" , pFile: xmlFileName , pId: id },
                cache: false,
                success: function (data) { 
                    if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                        alert(data.msg);
                        return false;
                    }    
                    $("#btnConCancel").click();
                    condition.ref_conditions();
                }
            });  
        }        
    })
    
    $("a[class=step1setdata]").live('click',function(){
        condition.show_datasource($(this).attr("id"),$(this).attr("src"),$(this).attr("text"),$(this).attr("val"));
    })
    
    $("#txtTextFields").live('click',function(){    
        if($.trim($("#selConSource option:selected").val()) != ""){ 
            setSourceField("divSetTextDataSource",$.trim($("#selConSource option:selected").val()),"getTextSourceField");
            $("#divSetTextDataSource").show();
        }    
    })
    
    $("a[class=getTextSourceField]").live('click',function(){             
        $("#txtTextFields").val($(this).attr("id"));  
        $("#divSetTextDataSource").hide();     
    })
    
    $("#txtValueFields").live('click',function(){    
        if($.trim($("#selConSource option:selected").val()) != ""){ 
            setSourceField("divSetValueDataSource",$.trim($("#selConSource option:selected").val()),"getValueSourceField");
            $("#divSetValueDataSource").show();
        }    
    })
    
    $("a[class=getValueSourceField]").live('click',function(){             
        $("#txtValueFields").val($(this).attr("id"));  
        $("#divSetValueDataSource").hide();     
    })
    
    $('a.close-window').live('click',function(){
        $("#iframeFillData").hide();    
        $("#iframeSelectTable").hide();
        $("#iframeAdvancedSetting").hide();
        $('div.window').hide();
    })
    $('a.close-addattr').live('click',function(){
        $('#divAddAttribute').hide();
    })
    
    
    
    $('a.close').live('click',function(){
        clear_condition();
        clear_source();
        clear_field();
        curStep = 0;    
        $("#divReport").hide();        
        $("#divReportBack").hide();      
        $("div.window").hide();  
        $("#iframeFillData").hide();    
    })
    
    $('a[class=step1Edit]').live('click',function(){      
        clear_condition();  
        var con = condition.get_condition($(this).attr("key"));
        if(con!=null){
            $("#btnConCancel").show(); 
            condition.saveType = 1;
            $("#txtConId").val(con.id);
            $("#txtHidConId").val(con.id);
            $("#selConSearchType").val(con.type);
            $("#txtConName").val(con.name);
            $("#selDateFormat").val(con.format);
            $("#txtConDefault").val(con.def);
            $("#selConOut").val(con.out);            
            $("#selConSearchType").change(); 
        }
    })    
    
    $('a[class=step2Remove]').live('click',function(){
        if(confirm('真的要删除这个数据源吗？')){
            var rowIndex = $(this).parent().parent().index();
            var id = $("#tbSources tr:eq("+rowIndex+") td:nth-child(1)").html();    
            $.ajax({
                url: SourceHandler,                    
                type: "post",
                data:{ postType:"RemoveSource" , pFile: xmlFileName , pId: id },
                cache: false,
                success: function (data) { 
                    if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                        alert(data.msg);
                        return false;
                    }     
                    $("#btnSouCancel").click();
                    source.ref_sources();
                }
            });  
        }
    })
    
    $('a[class=step2Edit]').live('click',function(){
        clear_source();
        var s = source.get_source($(this).attr("key"));
        var labels = [];
        var sql = "";
        if(s!=null){
            $("#btnSouCancel").show(); 
            source.saveType = 1;     
            $("#hidSourceId").val(s.id);       
            $("#txtSouId").val(s.id);
            $("#txtSouName").val(s.name);
            $("#chkSeq").attr('checked',s.seq == 'false' ? false : true);
            $("#selSouType").val(s.type);
            $("#selSouType").change();
            $("#selDataTemp").val(s.temp);
            switch(s.type){
                case CONST_SOURCE_TYPE_SQL:                    
                    $("#txtTableName").val(s.src);
                    $("#txtTableField").val(s.field);
                    sql = s.where;
                    labels = $.GetPropertyLabel(sql);
                    if(labels!=null){
                        for(var i=0; i<labels.length; i++){
                            sql = sql.replace(labels[i], CONST_PROPERTY_PREV + getPropertyNameById(labels[i]) + CONST_PROPERTY_LAST);                        
                        }
                    }        
                    $("#txtWhere").val(sql);
                    $("#txtOrderBy").val(s.order);
                break;
                case CONST_SOURCE_TYPE_JOIN:
                    $("#txtTable1").val(s.lsrc);
                    $("#txtTable2").val(s.rsrc);
                    $("#selSourceJoin").val(s.join);
                    $("#txtOn").val(s.on);
                    $("#txtJoinField").val(s.field);
                    sql = s.where;
                    labels = $.GetPropertyLabel(sql);
                    if(labels!=null){
                        for(var i=0; i<labels.length; i++){
                            sql = sql.replace(labels[i], CONST_PROPERTY_PREV + getPropertyNameById(labels[i]) + CONST_PROPERTY_LAST);                        
                        }
                    }       
                    $("#txtJoinWhere").val(sql);
                    $("#txtJoinOrderBy").val(s.order);
                break;
                case CONST_SOURCE_TYPE_CUS:
                    sql = s.sql;
                    labels = $.GetPropertyLabel(s.sql);
                    if(labels!=null){
                        for(var i=0; i<labels.length; i++){
                            sql = sql.replace(labels[i], CONST_PROPERTY_PREV + getPropertyNameById(labels[i]) + CONST_PROPERTY_LAST);                        
                        }
                    }                   
                    $("#txtSouCusSQL").val(sql);
                break;
                default:
                    alert('未知类型');
                    return false;
            }         
        }
    })
    
    $("a[class=step3Remove]").live('click',function(){
        if(confirm('真的要删除这个数据绑定字段吗？')){
            var rowIndex = $(this).parent().parent().index();
            var id = $("#tbFields tr:eq("+rowIndex+") td:nth-child(1)").html();    
            $.ajax({
                url: FieldHandler,                    
                type: "post",
                data:{ postType:"RemoveField" , pFile: xmlFileName , pId: id },
                cache: false,
                success: function (data) {  
                    if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                        alert(data.msg);
                        return false;
                    }   
                    $("#btnFieldCancel").click();
                    field.ref_fields();
                }
            });  
        }
    })
    
    $('a[class=step3Edit]').live('click',function(){
        clear_field();
        var f = field.get_field($(this).attr("key"));
        if(f!=null){            
            $("#btnFieldCancel").show(); 
            field.saveType = 1;            
            $("#hidOldLabel").val(f.id);
            field.ref_labels(f.sheet);                      
            $("#txtFieldName").val(f.name);
            $("#selFieldSource").val(f.type);           
            $("#selFieldSource").change();
            if($("#selFieldSource").val() == CONST_FIELD_SRC_SEARCH){         
                $("#txtFieldSrc").val(getPropertyNameById(CONST_PROPERTY_PREV+f.src+CONST_PROPERTY_LAST));
            }
            else{
                $("#txtFieldSrc").val(getSourceNameById(f.src));
            }
            $("#txtFieldCol").val(f.col);
            $("#txtFilter").val(f.filter);

            $("#selSheet").val(f.sheet);
            //$("#selLabel").val(f.id);
            //语句经常报脚本错误,所以改为:
            //$.SetSelectedByVal(document.getElementById("selSheet"),f.sheet);  
            $.SetSelectedByVal(document.getElementById("selLabel"),f.id);
           
        }
    })
    
    $("a[class=stepFillRemove]").live('click',function(){
        if(confirm('真的要删除这个填充数据集吗？')){
            var rowIndex = $(this).parent().parent().index();
            var id = $("#tbFills tr:eq("+rowIndex+") td:nth-child(1)").html();    
            $.ajax({
                url: SourceHandler,                    
                type: "post",
                data:{ postType:"RemoveFill" , pFile: xmlFileName , pId: id },
                cache: false,
                success: function (data) {    
                    if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                        alert(data.msg);
                        return false;
                    }  
                    $("#btnFillCancel").click();
                    source.ref_fills();
                }
            });  
        }
    })
    
    $('a[class=stepFillEdit]').live('click',function(){
        clear_fill();
        var f = source.get_fill($(this).attr("key"));
        if(f!=null){            
            $("#btnFillCancel").show(); 
            source.fillSaveType = 1;         
            $("#hidOldFillId").val(f.id);
            $("#txtFillId").val(f.id);
            $("#txtFillName").val(f.name);
            $("#selFillType").val(f.type);
            $("#txtOffset").val(f.offset);
            $("#txtStartValue").val(f.start);
            $("#txtMaxValue").val(f.max);
            $("#selFillOut").val(getPropertyOutByID(f.out));
            $("#txtFillCusData").val(f.cus);        
        }
    })
    
    $("#close").live('click',function(){$("#divSelectDataSource").hide('fast');})
    
    $("#txtFieldSrc").live('focus',function(){
    
        $('#divSelectDataSource').html("");
        var sInnerHtml = "<p><a href='#' id=close><img src='/i/close.gif' /></a></p>";    
        if($("#selFieldSource").val() == CONST_FIELD_SRC_SEARCH){ 
                
            for(var i=0; i<source.propertys.length; i++){ 
                sInnerHtml += "<a href=javascript:void(0); class='field' text='" + source.propertys[i][0] + "'><span id='a"+i+"''>" + source.propertys[i][0] + "</span></a>";
            }
        }
        else{
            for(var i=0; i<source.sources.length; i++){
                sInnerHtml += "<a href=javascript:void(0); class='field' text='" + source.sources[i].name + "'><span id='a"+i+"''>" + source.sources[i].name + "</span></a>";
            }
        }
        $('#divSelectDataSource').html(sInnerHtml);
        $("#divSelectDataSource").show('fast');
    })
    
    $("a[class=field]").live('click',function(){ 
        $("#txtFieldSrc").val($(this).attr("text"));
        if($("#selFieldSource").val() == CONST_FIELD_SRC_SEARCH){
            $("#txtFieldCol").val("0");
        }
        else{
        
        }
        $("#divSelectDataSource").hide('fast');
    })

    $("a[class=stepfillsetdata]").live('click',function(){        
        $("#btnSaveSourceFill").attr("sid",$(this).attr("id"));
        $("#txtSourceField").attr("refSource",$(this).attr("id"));
        source.show_fillsource($(this).attr("fill"),$(this).attr("ref"));
    })
    
    $("#txtSourceField").live('click',function(){    
        if($.trim($("#selFillData option:selected").val()) != ""){
            setSourceField("divFillSourceField",$("#txtSourceField").attr("refSource"),"getFillSourceField");
            $("#divFillSourceField").show();
        }    
    })
    
    $("a[class=getFillSourceField]").live('click',function(){             
        $("#txtSourceField").val($(this).attr("id"));  
        $("#divFillSourceField").hide();     
    })
    

    $("a[class=settemp]").live('click',function(){
        $("#divTempSetting").show();           
        $("#selDataTemp").val($(this).attr("temp"));
        $("#txtTempField").val($(this).attr("tf"));
        $("#txtTempField").attr("refSource",$(this).attr("id"));
    })
    
    $("#txtTempField").live('click',function(){    
        if($.trim($("#selDataTemp option:selected").val()) != ""){
            setSourceField("divTempSourceField",$("#txtTempField").attr("refSource"),"getSourceField");
            $("#divTempSourceField").show();
        }    
    })
    
    $("a[class=getSourceField]").live('click',function(){             
        $("#txtTempField").val($(this).attr("id"));  
        $("#divTempSourceField").hide();     
    })
    
    $("#btnSaveTemp").live('click',function(){
        var temp = $("#selDataTemp").val();
        var tf = $("#txtTempField").val();
        var id = $("#txtTempField").attr("refSource");
        $.ajax({
            url: SourceHandler,                    
            type: "post",
            data:{ postType:"SaveTempSetting" , pFile: xmlFileName, pId:id,pTemp:temp, pTf:tf },
            cache: false,
            success: function (data) {      
                alert(data.msg);  
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){             
                    return false;
                }  
                source.ref_sources();          
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });           
    })
    

    
    
    
    //老报表的高级配置
    $("#btnAdvanced").live('click',function(){
          reloadOldSetting("divOldCondition",0);  
    })
    
    
    
    $('#btnSaveOldNode').live('click',function(){
        var d = $(this).attr("d");
        var top = $("#"+d).scrollTop();
        var params = "&postType=SaveNode&pFile="+xmlFileName+"&oid="+$(this).attr("ref")+"&node="+$(this).attr("node")+"";
        $.each($('#'+$(this).attr("ref")+' tr:not(:first,:last)'),function(i,n){        
            var id = $(n).find('td:nth-child(1)').attr('attrid');
            var type = $(n).attr("t");
            var value = "";
            if(type == "Attribute"){
                value = $(n).find('td:nth-child(2) input[id='+id+']').val();
            }
            else if(type == 'Text' || type == 'CData'){
                value = $(n).find('td:nth-child(2) textarea[id='+id+']').val();
            }
            else if(type == "ChildNode"){
                value = $(n).find('td:nth-child(2) textarea[id='+id+']').val();
            } 
            else{
                value = $(n).find('td:nth-child(2)').html();
            }                                   
            params += "&"+id+"="+value+"";
        })              
        $.ajax({
            url: AdvancedHandler,                    
            type: "post",
            data: params,
            cache: false,
            success: function (data) {      
                alert(data.msg);  
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){             
                    return false;
                }         
                reloadOldSetting(d,top);    
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });     
    
    })
    
    $("#btnCreateAttr").live('click',function(){
        $("#txtAttributeName").val('');
        $("#txtAttributeValue").val('');        
        $("#btnSaveAddAttribute").attr("d",$(this).attr("d"));
        $("#btnSaveAddAttribute").attr("ref",$(this).attr("ref"));
        $("#btnSaveAddAttribute").attr("node",$(this).attr("node"));
        $("#divAddAttribute").show();
    })
    
    $("#btnSaveAddAttribute").live('click',function(){    
    
        if(!inputReg.test($("#txtAttributeName").val())){
            alert('保存失败,属性名称请输入英文！');
            return false;
        }    
        var d = $(this).attr("d");
        var top = $("#"+d).scrollTop();
        var params = "&postType=AddAttr&pFile="+xmlFileName+"&id="+$(this).attr("ref")+"&node="+$(this).attr("node")+"";
        params += "&name="+$("#txtAttributeName").val()+"&value="+$("#txtAttributeValue").val()+"&type="+$("#selAttributeType").val()+"";
        $.ajax({
            url: AdvancedHandler,                    
            type: "post",
            data: params,
            cache: false,
            success: function (data) {      
                alert(data.msg);  
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){             
                    return false;
                }         
                reloadOldSetting(d,top);    
                $("#divAddAttribute").hide();
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });     
    })
    
    $("a[class=delAttribute]").live('click',function(){
    
        if(confirm('您确定要删除这个属性吗？')){
            var d = $(this).attr("d");
            var top = $("#"+d).scrollTop();
            var params = "&postType=DelAttr&pFile="+xmlFileName+"&id="+$(this).attr("ref")+"&node="+$(this).attr("node")+"&name="+$(this).attr("del")+"";
            $.ajax({
                url: AdvancedHandler,                    
                type: "post",
                data: params,
                cache: false,
                success: function (data) {      
                    alert(data.msg);  
                    if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){             
                        return false;
                    }         
                    reloadOldSetting(d,top);    
                },
                error: function (data, status, e) {
                    alert(e);                
                    return false;
                }
            });     
        }
    })
    
    $("#btnDeleteNode").live('click',function(){
        if(confirm('您确定要删除这个节点吗？')){
            var d = $(this).attr("d");
            var top = $("#"+d).scrollTop();
            var params = "&postType=DelNode&pFile="+xmlFileName+"&id="+$(this).attr("ref")+"&node="+$(this).attr("node")+"";
            $.ajax({
                url: AdvancedHandler,                    
                type: "post",
                data: params,
                cache: false,
                success: function (data) {      
                    alert(data.msg);  
                    if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){             
                        return false;
                    }         
                    reloadOldSetting(d,top);    
                },
                error: function (data, status, e) {
                    alert(e);                
                    return false;
                }
            });     
        }   
    })
    
});

function reloadOldSetting(showDiv,top)
{
    $.ajax({
        url: AdvancedHandler,                    
        type: "post",
        data:{ postType:"InitAdvanced" , pFile: xmlFileName},
        cache: false,
        success: function (data) {    
            if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                alert(data.msg);
                return false;
            } 
            $("#divAdvancedSetting").show();
            $("#iframeAdvancedSetting").show();               
            $("#tbAdvanced tr:not(:first)").remove();
            $("<tr class=th-title ref=divOldCondition><td>conditions 节点配置 <input id=btnCreateConditionNode type=button value='添加节点' pn='conditions' n='condition' ref='divOldCondition' /></td></tr>").insertAfter($("#tbAdvanced tr:eq(0)"));     
            $("<tr><td><div class='note-content' id='divOldCondition'></div></td></tr>").insertAfter($("#tbAdvanced tr:eq(1)"));     
            
            $("<tr class=th-title ref=divOldSource><td>sources 节点配置 <input id=btnCreateConditionNode class=addnode type=button value='添加节点' pn='sources' n='source' ref='divOldSource' /></td></tr>").insertAfter($("#tbAdvanced tr:eq(2)"));  
            $("<tr><td><div class='note-content' id='divOldSource'></div></td></tr>").insertAfter($("#tbAdvanced tr:eq(3)"));    
             
            $("<tr class=th-title ref=divOldField><td>fields 节点配置 <input id=btnCreateConditionNode class=addnode type=button value='添加节点' pn='fields' n='field' ref='divOldField' /></td></tr>").insertAfter($("#tbAdvanced tr:eq(4)"));     
            $("<tr><td><div class='note-content' id='divOldField'></div></td></tr>").insertAfter($("#tbAdvanced tr:eq(5)"));   
            
            
            var conditionHTML = "";
            for(var i=0; i < data.conditions.length; i++){
                conditionHTML += buildAttributeTable(data.conditions[i],"divOldCondition");                   
            }
            $("#divOldCondition").html(conditionHTML);        

            var sourceHTML = "";
            for(var i=0; i < data.sources.length; i++){
                sourceHTML += buildAttributeTable(data.sources[i],"divOldSource");                   
            }
            $("#divOldSource").html(sourceHTML);     
            
            var fieldHTML = "";
            for(var i=0; i < data.fields.length; i++){
                fieldHTML += buildAttributeTable(data.fields[i],"divOldField");                   
            }
            $("#divOldField").html(fieldHTML);    
            setNodeDiv(showDiv);
            $("#"+showDiv).scrollTop(top);
            $('#tbAdvanced tr[class=th-title]').bind('click',function(){
                $.each($('#tbAdvanced tr[class=th-title]'),function(i,n){
                    $("#"+$(this).attr("ref")).hide();
                })       
                $("#"+$(this).attr("ref")).show();                    
            })
            $("#tbAdvanced tr[class=th-title]").find("td input[type=button]").bind('click',function(){
                var d = $(this).attr("ref");
                var top = $("#"+d).scrollTop();
                var params = "&postType=AddNode&pFile="+xmlFileName+"&pn="+$(this).attr("pn")+"&n="+$(this).attr("n")+"";
                $.ajax({
                    url: AdvancedHandler,                    
                    type: "post",
                    data: params,
                    cache: false,
                    success: function (data) {      
                        alert(data.msg);  
                        if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){             
                            return false;
                        }         
                        reloadOldSetting(d,top);    
                    },
                    error: function (data, status, e) {
                        alert(e);                
                        return false;
                    }
                });                    
            })
        },
        error: function (data, status, e) {
            alert(e);                
            return false;
        }
    });  
}

function setNodeDiv(divId)
{
    $("#divOldCondition").hide();
    $("#divOldSource").hide();
    $("#divOldField").hide();  
    $("#"+divId).show();
}

function buildAttributeTable(attrList , belongDiv)
{
    var tableHTML = "<table id='"+attrList.id+"' width=400px height:150px;cellpadding=1 cellspacing=1 style='background-color:Silver;float:left;margin-left:3px;margin-top:10px;'>";
    tableHTML += "<tr><td class=node-title colspan=3>"+attrList.id+"&nbsp;&nbsp;<a href='#' id=btnDeleteNode  d='"+belongDiv+"' ref='"+attrList.id+"' node='"+ attrList.node +"' style='color:red;' ><img src='/i/delete.gif' /> 删除节点</a></td></tr>";
    var pm = [];
    for(var i=0; i<attrList.attrs.length; i++){
        tableHTML += "<tr t='"+attrList.attrs[i].type+"'>";
        tableHTML += "<td style='background:#ffffff;text-align:center;' width='70px' attrid='"+attrList.attrs[i].name+"'>"+attrList.attrs[i].name+"</td>";
        var tdContent = "";
        if(attrList.attrs[i].type == 'Attribute'){
            tdContent = "<input type=text id="+attrList.attrs[i].name+" value='"+attrList.attrs[i].value+"' style='width:300px;' />";
        }
        else if(attrList.attrs[i].type == 'Text' || attrList.attrs[i].type == 'CData'){
            tdContent = "<textarea  id="+attrList.attrs[i].name+"  style='height:160px;width:300px;' >"+ attrList.attrs[i].value +"</textarea>";
        }
        else{
            tdContent = "<textarea  id="+attrList.attrs[i].name+"  style='height:160px;width:300px;' >"+ attrList.attrs[i].value +"</textarea>";
        }        
        tableHTML += "<td style='background:#ffffff;' width='300px'>"+tdContent+"</td>";        
        tableHTML += "<td style='background:#ffffff;'> ";        
        if(attrList.attrs[i].type == 'Attribute'){
            tableHTML += "<a href='#' class='delAttribute' title='点击删除属性' d='"+belongDiv+"' ref='"+attrList.id+"' node='"+ attrList.node +"' del='"+ attrList.attrs[i].name +"'><img border=0 src='/i/delete.png' /></a>";
        }
        tableHTML += "</td>";    
        tableHTML += "</tr>";
        pm.push([attrList.attrs[i].name,attrList.attrs[i].value]);
    }    
    tableHTML += "<tr><td colspan=3 style='text-align:right;padding-right:20px;background:#f8f8f8;'> ";
    tableHTML += "<input type=button id=btnCreateAttr value='添加属性'  d='"+belongDiv+"' ref='"+attrList.id+"' node='"+ attrList.node +"'  />&nbsp;";
    tableHTML += "<input type=button id=btnSaveOldNode value='保存配置' d='"+belongDiv+"' ref='"+attrList.id+"' node='"+ attrList.node +"'  /> ";
    tableHTML += " </td></tr>";
    tableHTML += "</table>"; 
    
    return tableHTML;
}

            
function clear_condition(){
    $("#txtConId").val("");
    $("#selConSearchType").val("");
    $("#txtConName").val("");
    $("#selDateFormat").val("");
    $("#txtConDefault").val("");
    $("#selConOut").val("");
    $("#txtHidConId").val("");
}

function clear_field(){
    $("#txtFieldName").val("");
    $("#selFieldSource").val("");
    $("#txtFieldSrc").val("");
    $("#txtFieldCol").val("");
    $("#txtFilter").val("");
    $("#hidOldLabel").val("");
}

function clear_source(){
    $("#txtSouId").val("");
    $("#txtSouName").val("");
    $("#txtTableName").val("");
    $("#txtTableField").val("");
    $("#txtWhere").val("");
    $("#txtOrderBy").val("");
    $("#txtTable1").val("");
    $("#txtTable2").val("");
    $("#txtOn").val("");
    $("#txtJoinField").val("");
    $("#txtJoinWhere").val("");
    $("#txtJoinOrderBy").val("");
    $("#txtSouCusSQL").val("");
    $("#chkSeq").attr('checked', false);
    $("#hidSourceId").val("");
    $("#selDataTemp").val("");
}

function clear_fill(){
    $("#txtFillId").val("");
    $("#txtFillName").val("");
    $("#txtOffset").val("");
    $("#txtStartValue").val("");
    $("#txtMaxValue").val("");
    $("#selFillOut").val("");
    $("#txtFillCusData").val("");
    $("#hidOldFillId").val("");
}

function getPropertyIDByName(name){    
    for(var i=0;i<source.propertys.length; i++){
        if( $.trim(name) ==  CONST_PROPERTY_PREV + $.trim(source.propertys[i][0]) +CONST_PROPERTY_LAST ){
            return source.propertys[i][1];
        }
    }
    return "";
}
function getPropertyNameById(id){
    for(var i=0;i<source.propertys.length; i++){
        if( $.trim(id) ==  CONST_PROPERTY_PREV + $.trim(source.propertys[i][1]) +CONST_PROPERTY_LAST ){
            return source.propertys[i][0];
        }
    }
    return "";
}

function getPropertyIDByOut(out){
    for(var i=0;i<source.propertys.length; i++){
        if( $.trim(out) ==  $.trim(source.propertys[i][2])){
            return source.propertys[i][1];
        }
    }
    return "";
}

function getPropertyOutByID(id){
    for(var i=0;i<source.propertys.length; i++){
        if( $.trim(id) ==  $.trim(source.propertys[i][1])){
            return source.propertys[i][2];
        }
    }
    return "";
}

function getSourceNameById(id){
    for(var i=0;i<source.sources.length; i++){
        if( $.trim(id) ==  $.trim(source.sources[i].id) ){
            return source.sources[i].name;
        }
    }
    return "";
}
function getSourceIdByName(name){
    for(var i=0;i<source.sources.length; i++){
        if( $.trim(name) ==  $.trim(source.sources[i].name) ){
            return source.sources[i].id;
        }
    }
    return "";
}

//步骤状态
function checkStepStatus(){
    $("#btnPrev").hide();
    $("#btnNext").hide();
    $("#step1").hide();
    $("#step2").hide();
    $("#step3").hide();      
    $("#btnConCancel").hide(); 
    $("#btnSouCancel").hide(); 
    $("#btnFieldCancel").hide();   
    $("#btnFillData").hide();
    $('div.window').hide();
    $("#divReportMenu").find('li').removeClass('selectTab');   
        
    switch(curStep){
        case 0:
            $("#btnNext").show();
            $("#btnNext").attr('value','下一步');
            $("#step1").show();                     
            $("#divReportBack").attr('height','450px;');     
            $("#l1").addClass('selectTab');   clear_condition();    clear_source();  
        break;
        case 1:            
            $("#btnPrev").show();
            $("#btnNext").show();
            $("#btnNext").attr('value','下一步');
            $("#step2").show();
            $("#btnFillData").show();
            $("#divReportBack").attr('height','700px;');       
            source.ref_property();            
            $("#l2").addClass('selectTab');     clear_field();
        break;
        case 2:clear_source();  
            $("#btnPrev").show();
            $("#btnNext").show();
            $("#btnNext").attr('value','完 成');
            $("#step3").show();
            $("#divReportBack").attr('height','470px;');
            source.ref_property(); 
            $("#selSheet").empty();
            for(var i =0 ; i < CellObject.getCurrentTotalSheetCount() ; i++){
                $("<option value='"+ CellObject.getSheetLabel(i) +"' s="+i+">"+CellObject.getSheetLabel(i)+"</option>").appendTo("#selSheet");
            }
            field.ref_labels($("#selSheet option:selected").val());
            field.ref_fields();
            $("#l3").addClass('selectTab');     
        break;        
        default:
            init_window();             
        break;    
    }
    $("#divDataSource").hide();

}


function init_tables(){
    
    $.ajax({
        url: ConditionHandler,                    
        type: "post",
        data:{ postType:"GetTables" , pFile: xmlFileName },
        cache: false,
        success: function (data) {     
            if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                alert(data.msg);
                return false;
            }   
            var sInnerHtml = "<ol>";      
            $.each(data, function (i, n) {
                sInnerHtml += "<li><a href='#' id='"+n.name+"' class=tblist>"+n.memo+"</a></li>";
            })
            sInnerHtml += "</ol>";
            $('#divSelectTableContent').html(sInnerHtml);  
        },
        error: function (data, status, e) {
            alert(e);                
            return false;
        }
    });   

}

function init_window(){
    clear_condition();
    clear_source();
    clear_field();
    curStep = 0; 
    checkStepStatus();
    $("#divReport").hide();        
    $("#divReportBack").hide();      
    $("div.window").hide();  
    $("#iframeFillData").hide();    
}

//查询条件类
function Condition(xmlFileName){
    this.filename = xmlFileName;    
    this.cursource_id = "";
    this.sourceObj = null;
    this.conditions = [];
    this.saveType = 0;
    this.course = false;
    this.ref_conditions = function(){
         this.saveType = 0;
         var conditions = [];       
         $("#tbCondition tr:not(:first)").remove();     
         $("#selConOut option:not(:first)").remove();   
                        
         $.ajax({
            url: ConditionHandler,                    
            type: "post",
            data:{ postType:"GetConditions" , pFile: this.filename },
            cache: false,
            success: function (data) {           
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }  
                var reportHTML = "报表路径："+data.file;
                this.course = data.course;  
                if(data.course == 'false' || data.course == false){                  
                    alert("当前系统不支持您目前的配置文件,它有可能是老版本的配置文件,如需编辑请点击报表配置中的\"高级配置\"进行老版本的配置操作.");
                    $("#btnAdvanced").show();
                    $("#btnConSave").hide();
                    $("#btnSouSave").hide();              
                    $("#btnSaveField").hide();     
                }                   

                $("#divReport-name").html(reportHTML);
                $.each(data.condition, function (i, n) {
                    conditions.push(n);
                    var content = ""; 
                    content += "<td>"+ n.id +"</td>";
                    content += "<td>"+ n.name +"</td>";
                    content += "<td>"+ $.GetTypeName(n.type,searchType) +"</td>";
                    var opContent = "";                    
                    if(n.type == CONST_SEARCH_DROPDOWNLIST){
                        opContent += "<a href='#' id='"+ n.id +"' src='"+n.src+"' text='"+n.text+"' val='"+n.val+"' class=step1setdata ><img src='i/source.png' alt='设置数据源'/></a>&nbsp;";
                    }                    
                    opContent += "<a href='#'class=step1Edit key='"+n.id+"'><img src='i/edit.png' alt='编辑' /></a>&nbsp;";
                    opContent += "<a href='#'class=step1Remove><img src='i/delete.png' alt='删除' /></a>";                   
                    content += "<td>"+ opContent +"</td>";
                    $("<tr class='col'>" + content + "</tr>").insertAfter($("#tbCondition tr:eq(" + i + ")"));                    
                    $("<option value='"+n.id+"'>"+n.name+"</option>").appendTo("#selConOut");          
                    
                })
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });    

        this.conditions = conditions;   
        
    }
    
    this.fillConByFillOut = function(){
        $("#selFillOut option:not(:first)").remove();     
        for(var i=0; i < this.conditions.length; i++){
            $("<option value='"+this.conditions[i].id+"'>"+this.conditions[i].name+"</option>").appendTo("#selFillOut");            
        }  
    }
    
    this.get_condition = function(id){
        var condition = null;
        for(var i=0; i < this.conditions.length; i++){
            if(id == this.conditions[i].id){
                condition =  this.conditions[i];
                break;
            }
        }
        return condition;
    }
    
    this.show_datasource = function(id , src , text , val){
        this.sourceObj.fillConSource();
        this.cursource_id = id;

        
        $("#divDataSource").show();             
        $("#selConSource").val(src); 
        $("#txtTextFields").val(text);
        $("#txtValueFields").val(val);        
    }

    this.save_condition_datasource = function(src,text,val){  
        $.ajax({
            url: ConditionHandler,                    
            type: "post",
            data:{ postType:"SaveConditionSource" , pFile: this.filename,pId:this.cursource_id,pSrc:src,pText:text,pVal:val },
            cache: false,
            success: function (data) {           
              alert(data.msg); 
              if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                return false;
              }  
              condition.ref_conditions();
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });         
    }
}

//数据源类
function Source(xmlFileName){
    this.filename = xmlFileName;    
    this.propertys = [];
    this.sources = [];
    this.saveType = 0;    
    this.curfill_id  = '';
    this.fillSaveType = 0;
    this.fills = [];
    this.ref_sources = function(){
        this.saveType = 0;
        var sources = [];
           
        $("#tbSources tr:not(:first)").remove();        
         $.ajax({
            url: SourceHandler,                    
            type: "post",
            data:{ postType:"GetSources" , pFile: this.filename },
            cache: false,
            success: function (data) {          
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }               
                $.each(data, function (i, n) {
                    sources.push(n);
                    var content = ""; 
                    content += "<td>"+ n.id +"</td>";
                    content += "<td>"+ n.name +"</td>";
                    content += "<td>"+ $.GetTypeName(n.type,sqlType) +"</td>";
                    
                    var opContent = "";              

                    opContent += "<a href='#' id='"+ n.id +"' fill='"+ n.fill +"' ref='"+n.ref+"' class=stepfillsetdata ><img src='i/fill.png' alt='设置填充数据'/></a>&nbsp;";                        
                    opContent += "<a href='#' id='"+ n.id +"' temp='"+ n.temp +"' tf='"+n.tf+"' class=settemp ><img src='i/temp.png' alt='设置模板属性'/></a>&nbsp;";                      
                    opContent += "<a href='#'class=step2Edit key='"+n.id+"'><img src='i/edit.png' alt='编辑' /></a>&nbsp;";
                    opContent += "<a href='#'class=step2Remove><img src='i/delete.png' alt='删除' /></a>";                   
                    content += "<td>"+ opContent +"</td>";
                     
                    $("<tr class='col'>" + content + "</tr>").insertAfter($("#tbSources tr:eq(" + i + ")"));    
                    
                })
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });  
        this.sources = sources;              
    }
    this.get_source = function(id){
        var source = null;
        for(var i=0; i < this.sources.length; i++){
            if(id == this.sources[i].id){
                source =  this.sources[i];
                break;
            }
        }
        return source;
    }
    this.fillConSource = function(){
        $("#selConSource option").remove();     
        for(var i=0; i < this.sources.length; i++){
            $("<option value='"+this.sources[i].id+"'>"+this.sources[i].name+"</option>").appendTo("#selConSource");            
        }  
    }
    this.show_fillsource = function(fill,ref){       
        source.ref_selfill();  
        $("#divSourceFillData").show();   
        $("#selFillData").val(fill);
        $("#txtSourceField").val(ref);             
    }
    this.ref_property = function(){
        $("#selSouProperty").empty();      
        var propertys = new Array();
        $.ajax({
            url: SourceHandler,                    
            type: "post",
            data:{ postType:"GetPropertys" , pFile: this.filename },
            cache: false,
            success: function (data) {    
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }         
                $.each(data, function (i, n) {                   
                   $("<option value='"+ n.id +"' out='"+ n.out +"'>"+ n.name +"</option>").appendTo("#selSouProperty");
                })
                for(var i=0;i<data.length;i++){
                    propertys.push([data[i].name,data[i].id,data[i].out]);
                }
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });  
        this.propertys = propertys;
    }
    
    this.show_filldata = function(id , n){
        this.curfill_id = id;
        $("#divFillData").show();      
        $("#iframeFillData").show();       
        $("#iframeFillData").attr('height','360px'); 
        $("#iframeFillData").attr('width','400px'); 
        if(n!=null){
                   
       }
    }
    this.ref_selfill = function(){
    
        $("#selFillData option:not(:first)").remove();         
        for(var i=0; i < this.fills.length; i++){
             $("<option value='"+this.fills[i].id+"'>"+this.fills[i].name+"</option>").appendTo("#selFillData");
        }        
        
    }
    this.ref_fills = function(){
        var fills = [];
        this.fillSaveType = 0;   
         $("#tbFills tr:not(:first)").remove();                
         $.ajax({
            url: SourceHandler,                    
            type: "post",
            data:{ postType:"GetFills" , pFile: this.filename },
            cache: false,
            success: function (data) {       
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }      
                $.each(data, function (i, n) {
                    fills.push(n);
                    var content = ""; 
                    content += "<td>"+ n.id +"</td>";
                    content += "<td>"+ n.name +"</td>";
                    content += "<td>"+ $.GetTypeName(n.type,fillType) +"</td>";                    
                    var opContent = "";                             
                    opContent += "<a href='#'class=stepFillEdit key='"+n.id+"'><img src='i/edit.png' alt='编辑' /></a>&nbsp;";
                    opContent += "<a href='#'class=stepFillRemove><img src='i/delete.png' alt='删除' /></a>";                   
                    content += "<td>"+ opContent +"</td>"; 
                    $("<tr class='col'>" + content + "</tr>").insertAfter($("#tbFills tr:eq(" + i + ")"));                    
                })
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });  
        this.fills = fills;      
    }
    this.get_fill = function(id){
        var fill = null;
        for(var i=0; i < this.fills.length; i++){
            if(id == this.fills[i].id){
                fill =  this.fills[i];
                break;
            }
        }
        return fill;
    }
    
//    this.ref_source = function(sourceKey){
//        var fields = []; 
//        for(var i=0; i< this.sources.length;i++){
//            if(sourceKey == this.sources[i].id){
//                var f = this.sources[i].field.split(',');
//                for(var j=0; j<f.length; j++){
//                    fields.push(f[j]);
//                }
//            }
//        }
//        $("#selTextFields").empty();      
//        $("#selValueFields").empty();      
//        for(var i=0; i<fields.length; i++){
//            $("<option value='"+ fields[i] +"' >"+ fields[i] +"</option>").appendTo("#selTextFields");
//            $("<option value='"+ fields[i] +"' >"+ fields[i] +"</option>").appendTo("#selValueFields");
//        }
//    }   
    
}



//绑定字段类
function Field(xmlFileName){
    this.filename = xmlFileName;    
    this.fields = [];
    this.saveType = 0;
    this.ref_fields = function(){        
        this.saveType = 0;
        var fields = [];
        $("#tbFields tr:not(:first)").remove();        
         $.ajax({
            url: FieldHandler,                    
            type: "post",
            data:{ postType:"GetFields" , pFile: this.filename },
            cache: false,
            success: function (data) {        
                if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                    alert(data.msg);
                    return false;
                }    
                $.each(data, function (i, n) {
                    fields.push(n);
                    var content = ""; 
                    content += "<td>"+ n.id +"</td>";
                    content += "<td>"+ n.name +"</td>";
                    content += "<td>"+ $.GetTypeName(n.type,srcType) +"</td>";                    
                    var opContent = "";                                       
                    opContent += "<a href='#'class=step3Edit key='"+n.id+"'><img src='i/edit.png' alt='编辑' /></a>&nbsp;";
                    opContent += "<a href='#'class=step3Remove><img src='i/delete.png' alt='删除' /></a>";                   
                    content += "<td>"+ opContent +"</td>";                    
                    $("<tr class='col'>" + content + "</tr>").insertAfter($("#tbFields tr:eq(" + i + ")"));
                })
            },
            error: function (data, status, e) {
                alert(e);                
                return false;
            }
        });  
        this.fields = fields;
    }
    
    this.get_field = function(id){
        var field = null;
        for(var i=0; i < this.fields.length; i++){
            if(id == this.fields[i].id){
                field =  this.fields[i];
                break;
            }
        }
        return field;
    }
    
    this.ref_labels = function(sheet){
        $("#selLabel").empty();        
        var sheetAry = CellObject.getAllLabelBySheetName(sheet); 
        for(var i=0; i<sheetAry.length; i++){
            $("<option value='"+ sheetAry[i].name +"'>"+sheetAry[i].text+"</option>").appendTo("#selLabel");
        }
    }
}

function init_sheet(){ 
    $("#selDataTemp option:not(:first)").remove();        
    for(var i=0 ; i < CellObject.getCurrentTotalSheetCount(); i++){
        $("<option value='"+ CellObject.getSheetLabel(i) +"'>"+CellObject.getSheetLabel(i)+"</option>").appendTo("#selDataTemp");
    }
}

function setSourceField(divId , key , identity){
     $.ajax({
        url: SourceHandler,                    
        type: "post",
        data:{ postType:"GetSourceColumns" , pFile: xmlFileName ,pSourceName:key },
        cache: false,
        success: function (data) {    
            if(typeof(data) != "undefined" && data!=null && typeof(data.flag) != "undefined" && data.flag == '0'){
                alert(data.msg);
                return false;
            }   
            var sInnerHtml = "<p><a href='#' class=closeList><img src='/i/close.gif' /></a></p>";                     
            sInnerHtml += "<ul>";
            $.each(data, function (i, n) {
                sInnerHtml += "<li><a href='#' id='"+n.name+"' class="+identity+">"+n.name+"</a></li>";
            })
            sInnerHtml += "</ul>";           
            $("#"+divId).html(sInnerHtml);            
        },
        error: function (data, status, e) {
            alert(e);                
            return false;
        }
    }); 
}