/*
王磊友情提示：
报表设计器扩展脚本文件
您所使用的版本为: Version 1.0.0.0  请不要擅自修改,它会让开发人员清楚的了解当前程序中所使用的版本。
这个文件会随着版本的升级而更新。
如发现问题请发送邮件: mailto:wanglei@ysh.com
*/

var CONST_PROPERTY_PREV = "{";
var CONST_PROPERTY_LAST = "}";

var CONST_SOURCE_TYPE_SQL = "Single";
var CONST_SOURCE_TYPE_JOIN = "Join";
var CONST_SOURCE_TYPE_CUS = "Sql";
var CONST_SOURCE_TYPE_REFSUR = "RefSource";
var CONST_SOURCE_TYPE_MEMORY = "Memory";
var CONST_SOURCE_TYPE_MODULE = "Module";

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
var CONST_SEARCH_VIRTUAL = "Virtual";

var CONST_TABLE_MAIN = "Main";
var CONST_TABLE_OTHER = "Other";

var CONST_COL_INT = "Int";
var CONST_COL_VARCHAR = "Varchar";
var CONST_COL_DECIMAL = "Decimal";

var inputReg = /^[A-Za-z]+$/;

var ServerUrl = "/";

var CommonHandler = ServerUrl + "conn/ashx/CommonHandler.ashx";

var ConditionHandler = ServerUrl + "conn/ashx/ConditionHandler.ashx"; //查询条件请求地址
var SourceHandler = ServerUrl + "conn/ashx/SourceHandler.ashx"; //数据源请求地址
var FieldHandler = ServerUrl + "conn/ashx/FieldHandler.ashx"; //数据绑定请求地址
var ViewHandler = ServerUrl + "conn/ashx/ViewHandler.ashx"; //视图管理请求地址
var AdvancedHandler = ServerUrl + "conn/ashx/AdvancedHandler.ashx";
var DBConfigHandler = ServerUrl + "conn/ashx/DBConfigHandler.ashx"; //数据配置
var ChartHandler = ServerUrl + "conn/ashx/ChartHandler.ashx"; //图表配置

var searchType = [
                    [CONST_SEARCH_TEXTBOX, "文本框", "Val"],
                    [CONST_SEARCH_DROPDOWNLIST, "下拉列表", "Sel"],
                    [CONST_SEARCH_DATETIME, "日期时间", "Val"],
                    [CONST_SEARCH_SESSION, "SESSION", "Back"],
                    [CONST_SEARCH_URL, "网页参数", "Back"],
                    [CONST_SEARCH_QUARTER, "季度控件", "Val"],
                    [CONST_SEARCH_WEEK, "日期周控件", "Val"],
                    [CONST_SEARCH_VIRTUAL, "自定义变量", "Back"]
                 ];

var sqlType = [
                   [CONST_SOURCE_TYPE_SQL, "单条SQL"],
                   [CONST_SOURCE_TYPE_JOIN, "关联SQL"],
                   [CONST_SOURCE_TYPE_CUS, "自由SQL"],
                   [CONST_SOURCE_TYPE_REFSUR, "数据关联"],
                   [CONST_SOURCE_TYPE_MEMORY, "内存数据"],
                   [CONST_SOURCE_TYPE_MODULE, "模板函数"]
              ];

var joinType = [
                    ["Left", "左联"],
                    ["Right", "右联"],
                    ["Inner", "内联"]
               ];

var srcType = [
                   [CONST_FIELD_SRC_SEARCH, "查询条件"],
                   [CONST_FIELD_SRC_DATABASE, "数据源"]
              ];

var fillType = [
                   [CONST_FILL_DATE, "日单元"],
                   [CONST_FILL_MONTH, "月单元"],
                   [CONST_FILL_YEAR, "年单元"],
                   [CONST_FILL_NUMBER, "数字"],
                   [CONST_FILL_CUS, "自定义"]
               ];

var tableType = [
                   [CONST_TABLE_MAIN, "主表"],
                   [CONST_TABLE_OTHER, "附属表"]
               ];

var colType = [
                   [CONST_COL_INT, "整数值"],
                   [CONST_COL_VARCHAR, "文本值"],
                   [CONST_COL_DECIMAL, "精确值"]
               ];

var templateType = [
                        ["DataChange", "数据行转列"],
                        ["SpecialStyle", "特殊表格式转换"]
                   ];

var fieldFilter = ["{0}.", "{1}."]; //当查询条件设置数据源列的时候需要过滤掉这些

$.extend({
    FillType: function (data, id) {
        for (var i = 0; i < data.length; i++) {
            $("<option value='" + data[i][0] + "'>" + data[i][1] + "</option>").appendTo("#" + id + "");
        }
    },
    GetTypeName: function (t, obj) {
        for (var i = 0; i < obj.length; i++) {
            if (t == obj[i][0]) {
                return obj[i][1];
            }
        }
        return "";
    },
    Insert: function (str, obj) {
        if (document.selection) {
            obj.focus();
            var sel = document.selection.createRange();
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
    GetPropertyLabel: function (text) {
        var reg = /{(.*?)}/gi;
        var labels = text.match(reg);
        return labels;
    },
    GetCellLabels: function (text) {
        var reg = /\[(.*?)\]/gi;
        var labels = text.match(reg);
        return labels;
    },
    GetViewId: function (view) {
        var reg = /<%(.*?)%>/;
        var v = view.match(reg);
        if (v == null) {
            return view;
        }
        var vs = v[1];
        var preg = /\((.*?)\)/;
        var p = vs.match(preg);
        return vs.replace(p[0]);
    },
    GetClientHeight: function (doc) {
        if (doc.documentElement.clientHeight == 0) {
            return doc.body.clientHeight;
        } else {
            return doc.documentElement.clientHeight;
        }
    },
    GetClientWidth: function (doc) {
        if (doc.documentElement.clientWidth == 0) {
            return doc.body.clientWidth;
        } else {
            return doc.documentElement.clientWidth;
        }
    },
    GetValueBySearch: function (id, type) {
        var getType = "";
        for (var i = 0; i < searchType.length; i++) {
            if (type == searchType[i][0]) {
                getType = searchType[i][2];
            }
        }
        var result = "";
        switch (getType) {
            case "Val":
                result = $("#" + id).val();
                break;
            case "Back":
                result = $("#" + id).val();
                break;
            case "Sel":
                result = "{\"Val\":\"" + $("#" + id + " option:selected").attr("value") + "\",\"Text\":\"" + $("#" + id + " option:selected").text() + "\"}";
                break;
            default:
                break;
        }
        return result;
    },
    SetSelectedByVal: function (obj, val) {
        for (var i = 0; i < obj.options.length; i++) {
            if (obj.options[i].value == val) {
                obj.options[i].selected = true;
            }
        }
    },
    SetWindowPosition: function (divId, addW, addH) {
        var clientHeight = $.GetClientHeight(document);
        var clientWidth = $.GetClientWidth(document);
        var iLeft = clientWidth / 2 - addW;
        var iTop = clientHeight / 2 + addH;
        $("#" + divId).css('left', iLeft);
        $("#" + divId).css('top', iTop);
    },
    GetUrlParam: function (paramName) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var j = "";
        for (var i = 0; j = paraString[i]; i++) {
            if (j.substring(0, j.indexOf("=")).toLowerCase() == paramName.toLowerCase()) {
                return j.substring(j.indexOf("=") + 1, j.length);
            }
        }
        return "";
    },
    GetDataBase: function (f, selId) {
        $.ajax({
            url: CommonHandler,
            data: { postType: 'GetDataBase', pFile: "" },
            type: "post",
            cache: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                var dbData = [];
                $.each(data, function (i, n) {
                    dbData.push([n.name, n.key]);
                });
                if (typeof f != "undefined") {
                    f(selId, dbData);
                }
                return dbData;
            }
        });
    },
    Ref_Select: function (id, data) {
        $("#" + id).empty();
        for (var i = 0; i < data.length; i++) {
            $("<option value='" + data[i][1] + "'>" + data[i][0] + "</option>").appendTo("#" + id);
        }
    },
    RemoveData: function (url, postType, xmlFileName, id, f) { //删除数据
        $.ajax({
            url: url,
            type: "post",
            data: { postType: postType, pFile: xmlFileName, pId: id },
            cache: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                f();
            }
        });
    },
    GetData: function (url, postType, xmlFileName, id, f) { //获取数据
        $.ajax({
            url: url,
            type: "post",
            data: { postType: postType, pFile: xmlFileName, pId: id },
            cache: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                f(data);
            }
        });
    },
    GetSelectData: function (url, data, f) { //获取数据
        $.ajax({
            url: url,
            type: "post",
            data: data,
            cache: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                f(data);
            }
        });
    },
    OpenDialog: function (url, obj, w, h, f) {
        var m = Math.random();
        if (url.indexOf('?') > 0) {
            url += "&m=" + m;
        }
        else {
            url += "?m=" + m;
        }
        var retValue = showModalDialog(url, obj, 'dialogWidth:' + w + 'px;dialogHeight:' + h + 'px;center:yes;help:no;resizable:no;status:no;scroll:no');
        if (typeof retValue != "undefined") {
            f(retValue);
        }
    },
    setSourceField: function (divId, key, identity, file, txt, beforFunc) {
        $.ajax({
            url: SourceHandler,
            type: "post",
            data: { postType: "GetSourceColumns", pFile: file, pSourceName: key },
            cache: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                var sInnerHtml = "<p><a href='#' class=closeList><img src='/i/close.gif' /></a></p>";
                sInnerHtml += "<ul>";
                $.each(data, function (i, n) {
                    sInnerHtml += "<li><a href='#' id='" + n.name + "' class=" + identity + ">" + n.name + "</a> </li>";
                })
                sInnerHtml += "</ul>";
                $("#" + divId).html(sInnerHtml);
                $('a[class=' + identity + ']').bind('click', function () {
                    if (typeof (beforFunc) != 'undefined') {
                        beforFunc();
                    }
                    var id = $(this).attr("id");
                    if ($.trim($("#" + txt).val()) != "") {
                        id = "," + id;
                    }
                    $.Insert(id, $("#" + txt));
                })
                $(".closeList").bind('click', function () { $("#" + divId).hide('fast'); });
            },
            error: function (data, status, e) {
                alert(e);
                return false;
            }
        });
    },
    getTableCoumns: function (d, xmlFileName, t1, t2, db, cs, txt, f) {
        $.ajax({
            url: CommonHandler,
            type: "post",
            data: { postType: "GetTableColumns", pFile: xmlFileName, pTable1: t1, pTable2: t2, pDb: db },
            cache: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                var sInnerHtml = "<p><a href='#' class=closeList><img src='/i/close.gif' /></a></p>";
                if (t2 != "") { sInnerHtml += "<h3>" + data.table1 + " &nbsp;&nbsp;&nbsp;<a href=# o=selectTable1All>选取所有列</a></h3>"; }
                else { sInnerHtml += " &nbsp;&nbsp;&nbsp;<b><a href=# o=selectTable1All>选取所有列</a></b><br>"; }
                sInnerHtml += "<ul o=all1>";
                $.each(data.columns1, function (i, n) {
                    sInnerHtml += "<li><a href='#' id='" + data.table1 + "." + n.name + "' key=" + n.name + " class=" + cs + ">" + n.memo + "</a></li>";
                })
                sInnerHtml += "</ul>";
                if (t2 != "") {
                    sInnerHtml += "<h3>" + data.table2 + "&nbsp;&nbsp;&nbsp;<a href=# o=selectTable2All>选取所有列</a></h3>";
                    sInnerHtml += "<ul o=all2>";
                    $.each(data.columns2, function (i, n) {
                        sInnerHtml += "<li><a href='#' id='" + data.table2 + "." + n.name + "' class=" + cs + ">" + n.memo + "</a></li>";
                    })
                    sInnerHtml += "</ul>";
                }
                $("#" + d).html(sInnerHtml);
                $("a[class=closeList]").bind('click', function () {
                    $("#" + d).hide("fast");
                });
                $('a[class=' + cs + ']').bind('click', { t: t2, txt: txt }, function (event) {
                    var id = "";
                    if (event.data.t == "") {
                        id = $(this).attr("key");
                    }
                    else {
                        id = $(this).attr("id");
                    }
                    if ($.trim($("#" + event.data.txt).val()) != "") {
                        id = "," + id;
                    }
                    $.Insert(id, $("#" + event.data.txt));
                });
                $('a[o=selectTable1All]').bind('click', { t: t2 }, function (event) {
                    var allField = "";
                    $.each($("ul[o=all1]").find('li'), function (i, n) {
                        var id = "";
                        if (event.data.t == "") {
                            id = $(n).find('a').attr("key");
                        }
                        else {
                            id = $(n).find('a').attr("id");
                        }
                        if (allField != "") {
                            id = "," + id;
                        }
                        allField += id;
                    });
                    if ($.trim($("#" + txt).val()) != "") {
                        allField = "," + allField;
                    }
                    $.Insert(allField, $("#" + txt));
                });
                $('a[o=selectTable2All]').bind('click', function () {
                    var allField = "";
                    $.each($("ul[o=all2]").find('li'), function (i, n) {
                        var id = $(n).find('a').attr("id");
                        if (allField != "") {
                            id = "," + id;
                        }
                        allField += id;
                    });
                    if ($.trim($("#" + txt).val()) != "") {
                        allField = "," + allField;
                    }
                    $.Insert(allField, $("#" + txt));
                });

                f();
            },
            error: function (data, status, e) {
                alert(e);
                return false;
            }
        });
    },
    subString: function (text, char) {
        if (text.substring(text.length - 1, text.length) === char) {
            text = text.substring(0, text.length - 1);            
        }
        return text;
    }

})

setTimeout(function () {
    //$("#selSouProperty option").attr("selected",true);
    //$("#selConOut option").attr("selected",true);
    //$("#selFieldSource option").attr("selected",true);
    //$("#selSheet option").attr("selected",true);
    //$("#selLabel option").attr("selected",true);
    $("#selConSource option").attr("selected", "selected");
    $("#selConSource0 option").attr("selected", "selected");
    $("#selConSource1 option").attr("selected", "selected");

}, 1);