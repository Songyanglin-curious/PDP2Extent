/*
王磊友情提示：
报表设计器配置脚本文件
您所使用的版本为: Version 1.0.0.0  请不要擅自修改,它会让开发人员清楚的了解当前程序中所使用的版本。
这个文件会随着版本的升级而更新。
如发现问题请发送邮件: mailto:wanglei@ysh.com
*/
var curS

var XmlFile = "";

$(document).ready(function () {

    var tabtype = { trigger: 'click', tabCurrentClass: 'newclass' };
    tabInit(tabtype, ['conditionManageTitle', 'conditionManageContent', 'o'],
                     ['sourceManageTitle', 'sourceManageContent'],
                     ['fieldManageTitle', 'fieldManageContent'],
                     ['viewManageTitle', 'viewManageContent'],
                     ['fillManageTitle', 'fillManageContent'],
                     ['dataManageTitle', 'dataManageContent'],
                     ['chartManageTitle', 'chartManageContent']);

    $('div[class=ysh-tab]').find('ul:first > li').live('click', function () {

        switch ($(this).attr("ref")) {
            case "condition":
                ConditionManage.clear();
                ConditionManage.ref_list();
                break;
            case "source":
                SourceManage.clear();
                $.GetDataBase($.Ref_Select, "selSouDB");
                SourceManage.ref_list();
                break;
            case "field":
                FieldManage.clear();
                FieldManage.ref_list();
                break;
            case "view":
                ViewManage.clear();
                $.GetDataBase($.Ref_Select, "selViewDB");
                ViewManage.ref_list();
                break;
            case "fill":
                FillManage.clear();
                FillManage.ref_list();
                break;
            case "data":
                DataConfigManage.clear();
                DataConfigManage.ref_list();
                break;
            case "chart":
                //ChartManage.refSource();
                ChartManage.refData();
                break;
            default:
                alert('没有可获取的选项卡');
                return false;
        }
    });

});



//初始化函数,报表配置必须调用
init = function (xmlFileName) {

    XmlFile = xmlFileName;

    ConditionManage.xmlFile = XmlFile;
    ConditionManage.init({ table: "tbCondition" });
    ConditionManage.ref_list();

    SourceManage.xmlFile = XmlFile;
    SourceManage.init({ table: "tbSources" });

    FieldManage.xmlFile = XmlFile;
    FieldManage.init({ table: "tbFields" });

    ViewManage.xmlFile = XmlFile;
    ViewManage.init({ table: "tbView" });

    FillManage.xmlFile = XmlFile;
    FillManage.init({ table: "tbFill" });

    DataConfigManage.xmlFile = XmlFile;
    DataConfigManage.init({ table: "tbTables" });

    ChartManage.xmlFile = XmlFile;
    //ChartManage.init();
}



/*********************************************************************************************************************************************************
查询条件管理对象
*********************************************************************************************************************************************************/
var ConditionManage = (function () {
    return {
        xmlFile: "",
        table: "",
        init: function (opt) {
            ConditionManage.table = opt.table || "";
            $.FillType(searchType, 'selConSearchType');
            $("<option value='111111'>年-月-日 时:分:秒</option>").appendTo("#selDateFormat");
            $("<option value='111110'>年-月-日 时:分</option>").appendTo("#selDateFormat");
            $("<option value='111100'>年-月-日 时</option>").appendTo("#selDateFormat");
            $("<option value='111000'>年-月-日</option>").appendTo("#selDateFormat");
            $("<option value='110000'>年-月</option>").appendTo("#selDateFormat");
            $("<option value='100000'>年</option>").appendTo("#selDateFormat");
            $("#btnConSave").bind('click', function () {
                var id = $("#txtConId").val();
                var type = $("#selConSearchType").val();
                var name = $("#txtConName").val();
                var out = $("#selConOut").val();
                var def = $("#txtConDefault").val();
                var format = $("#selDateFormat").val();
                var oid = $("#txtHidConId").val();
                if ($.trim(id) == '') { alert('条件编号不能为空！'); return false; }
                if ($.trim(type) == '') { alert('查询类型不能为空！'); return false; }
                if ($.trim(name) == '') { alert('条件描述不能为空！'); return false; }
                $.ajax({
                    url: ConditionHandler,
                    type: "post",
                    data: { postType: "SaveCon", pFile: ConditionManage.xmlFile, pId: id, pType: type, pName: name, pOut: out, pDef: def, pFormat: format, pOld: oid },
                    cache: false,
                    success: function (data) {
                        if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                            alert(data.msg);
                            return false;
                        }
                        alert(data.msg);
                        ConditionManage.clear();
                        ConditionManage.ref_list();
                    },
                    error: function (data, status, e) {
                        alert(e);
                        return false;
                    }
                });
            });
            $("#btnConCancel").bind('click', function () {
                ConditionManage.clear();
            });
            $("#selConSearchType").change(function () {
                if ($(this).val() != CONST_SEARCH_DATETIME) {
                    $("#selDateFormat").attr("disabled", "disabled");
                }
                else {
                    $("#selDateFormat").removeAttr("disabled");
                }
                if ($(this).val() == CONST_SEARCH_SESSION || $(this).val() == CONST_SEARCH_URL || $(this).val() == CONST_SEARCH_VIRTUAL) {
                    $("#lbKeyName").text("关键字");
                }
                else {
                    $("#lbKeyName").text("默认值");
                }
            });
        },
        ref_list: function () {
            $.GetData(ConditionHandler, "GetConditions", ConditionManage.xmlFile, "", function (data) {
                $("#" + ConditionManage.table + " tr:not(:first)").remove();
                $("#selConOut option:not(:first)").remove();
                $.each(data.condition, function (i, n) {
                    var content = "";
                    content += "<td>" + n.id + "</td>";
                    content += "<td>" + n.name + "</td>";
                    content += "<td>" + $.GetTypeName(n.type, searchType) + "</td>";
                    var opContent = "";
                    if (n.type == CONST_SEARCH_DROPDOWNLIST) {
                        opContent += "<a href='#' class=conditionSource id='" + n.id + "' ><img src='/i/Report/config.ico' alt='设置数据源'/></a>&nbsp;";
                    }
                    opContent += "<a href='#'class=conditionEdit key='" + n.id + "'><img src='/i/Report/edit.ico' alt='编辑' /></a>&nbsp;";
                    opContent += "<a href='#'class=conditionRemove key='" + n.id + "'><img src='/i/Report/delete.ico' alt='删除' /></a>";
                    content += "<td>" + opContent + "</td>";
                    $("<tr class='col'>" + content + "</tr>").insertAfter($("#" + ConditionManage.table + " tr:eq(" + i + ")"));
                    $("<option value='" + n.id + "'>" + n.name + "</option>").appendTo("#selConOut");
                })
                $("#" + ConditionManage.table + " tr td").find("[class=conditionEdit]").bind('click', function () {
                    $.GetData(ConditionHandler, "GetCondition", ViewManage.xmlFile, $(this).attr("key"), function (data) {
                        ConditionManage.clear();
                        $("#txtConId").val(data.info.id);
                        $("#txtHidConId").val(data.info.id);
                        $("#selConSearchType").val(data.info.type);
                        $("#txtConName").val(data.info.name);
                        $("#selDateFormat").val(data.info.format);
                        $("#txtConDefault").val(data.info.def);
                        $("#selConOut").val(data.info.out);
                        $("#selConSearchType").change();
                        $("#btnConCancel").show();
                        $("#txtConId").attr("disabled", "disabled");
                    });
                });
                $("#" + ConditionManage.table + " tr td").find("[class=conditionRemove]").bind('click', function () {
                    if (confirm('您确定要删除这个查询条件吗？')) {
                        $.RemoveData(ConditionHandler, "RemoveCondition", ConditionManage.xmlFile, $(this).attr("key"), function () {
                            ConditionManage.clear();
                            ConditionManage.ref_list();
                        });
                    }
                });
                $("#" + ConditionManage.table + " tr td").find("[class=conditionSource]").bind('click', function () {
                    $.OpenDialog('/report/_dialog_SetDataSource.aspx?id=' + $(this).attr("id") + '', window, 510, 480);
                });
            });
        },
        clear: function () {
            $("#txtConId").val("");
            $("#selConSearchType").val("");
            $("#txtConName").val("");
            $("#selDateFormat").val("");
            $("#txtConDefault").val("");
            $("#selConOut").val("");
            $("#txtHidConId").val("");
            $("#btnConCancel").hide();
            $("#txtConId").removeAttr("disabled");
        }
    }
})();



/*********************************************************************************************************************************************************
数据源管理对象
*********************************************************************************************************************************************************/
var SourceManage = (function () {
    return {
        xmlFile: "",
        table: "",
        init: function (opt) {
            SourceManage.table = opt.table || "";
            $.FillType(sqlType, 'selSouType');
            $.FillType(joinType, 'selSourceJoin');
            $.FillType(templateType, 'selModuleFun');
            $("#selSouType").bind('change', function () {
                $("#divSql").hide();
                $("#divJoin").hide();
                $("#divCus").hide();
                $("#divSouRef").hide();
                $("#divMemory").hide();
                $("#divModule").hide();
                var type = $("#selSouType").val();
                if ($.trim(type) == CONST_SOURCE_TYPE_SQL) {
                    $("#divSql").show();
                }
                else if ($.trim(type) == CONST_SOURCE_TYPE_JOIN) {
                    $("#divJoin").show();
                }
                else if ($.trim(type) == CONST_SOURCE_TYPE_CUS) {
                    $("#divCus").show();
                }
                else if ($.trim(type) == CONST_SOURCE_TYPE_REFSUR) {
                    $("#divSouRef").show();
                }
                else if ($.trim(type) == CONST_SOURCE_TYPE_MEMORY) {
                    $("#divMemory").show();
                }
                else if ($.trim(type) == CONST_SOURCE_TYPE_MODULE) {
                    $("#divModule").show();
                }
            });

            $("#txtMemorySource").live('focus', function () {
                $('#divSelectMemorySource').html("");
                var sInnerHtml = "<p><a href='#' id=close><img src='/i/close.gif' /></a></p>";
                $.GetData(SourceHandler, "GetSources", FieldManage.xmlFile, "", function (data) {
                    var h = "<ul o=all1>";
                    $.each(data, function (i, n) {
                        h += "<li><a href=#; class='field' id='" + n.id + "' text='" + n.id + "' class='sql'><span id='a" + i + "''>" + n.id + "</span></a></li>";
                    });
                    h += "</ul>";
                    $('#divSelectMemorySource').html(sInnerHtml + h);
                    $("#divSelectMemorySource").find("a[class=field]").bind('click', function () {
                        if ($.trim($("#txtMemorySource").val()) != "")
                            $("#txtMemorySource").val($("#txtMemorySource").val() + "," + $(this).attr("id"));
                        else
                            $("#txtMemorySource").val($(this).attr("id"));
                    });
                    $("#close").bind('click', function () { $('#divSelectMemorySource').hide('fast'); });
                });
                $("#divSelectMemorySource").show('fast');
            });


            $("#selModuleFun").bind('change', function () {
                if ($("#selModuleFun").val() == "DataChange") {
                    $("#txtSouModuleSQL").attr("title", "需要转置的数据源的SQL语句");
                }
                if ($("#selModuleFun").val() == "SpecialStyle") {
                    $("#txtSouModuleSQL").attr("title", "格式：标题显示字段,值字段|数据源SQL语句或视图|条件字段|标题1:标题对应字段1,标题2:标题对应字段2...[|标题1:标题对应字段1,标题2:标题对应字段2...](注：[]中为内容后面填充部分，选填)");
                }
            });

            $("#txtTableField").bind('click', function () {
                if ($.trim($("#txtTableName").val()) == "") return;
                $.getTableCoumns("divSelectTableField", SourceManage.xmlFile, $("#txtTableName").val(), "", $("#selSouDB").val(), "sql", "txtTableField", function () {
                    $("#divSelectTableField").show('fast');
                });
            });
            $("#txtOrderBy").bind('click', function () {
                if ($.trim($("#txtTableName").val()) == "") return;
                $.getTableCoumns("divSelectTableOrderField", SourceManage.xmlFile, $("#txtTableName").val(), "", $("#selSouDB").val(), "sql", "txtOrderBy", function () {
                    $("#divSelectTableOrderField").show('fast');
                });
            });

            $("#txtJoinOrderBy").bind('click', function () {
                if ($.trim($("#txtTable1").val()) == "" && $.trim($("#txtTable2").val()) == "") return;
                $.getTableCoumns("divSelectJoinOrderTableField", SourceManage.xmlFile, $("#txtTable1").val(), $("#txtTable2").val(), $("#selSouDB").val(), "join", "txtJoinOrderBy", function () {
                    $("#divSelectJoinOrderTableField").show('fast');
                });
            });

            $("#txtJoinField").bind('click', function () {
                if ($.trim($("#txtTable1").val()) == "" && $.trim($("#txtTable2").val()) == "") return;
                $.getTableCoumns("divSelectJoinTableField", SourceManage.xmlFile, $("#txtTable1").val(), $("#txtTable2").val(), $("#selSouDB").val(), "join", "txtJoinField", function () {
                    $("#divSelectJoinTableField").show('fast');
                });
            });

            $("a[class=selectTable]").bind('click', function () {
                var v = $(this).attr("v");
                $.OpenDialog('/report/_dialog_SelectTable.aspx?db=' + $("#selSouDB").val() + '', window, 450, 500, function (retValue) {
                    $("#" + v).val(retValue);
                });
            });

            $("#selSouProperty").dblclick(function () {
                var item = $("#selSouProperty option:selected");
                var id = item.attr("value");
                var text = item.text();
                var label = CONST_PROPERTY_PREV + text + CONST_PROPERTY_LAST;
                switch ($("#selSouType").val()) {
                    case CONST_SOURCE_TYPE_SQL:
                        $.Insert(label, $("#txtWhere"));
                        break;
                    case CONST_SOURCE_TYPE_JOIN:
                        $.Insert(label, $("#txtJoinWhere"));
                        break;
                    case CONST_SOURCE_TYPE_CUS:
                        $.Insert(label, $("#txtSouCusSQL"));
                        break;
                    case CONST_SOURCE_TYPE_REFSUR:
                        $.Insert(label, $("#txtSouRefSQL"));
                        break;
                    case CONST_SOURCE_TYPE_MEMORY:
                        $.Insert(label, $("#txtSouMemorySQL"));
                        break;
                    case CONST_SOURCE_TYPE_MODULE:
                        $.Insert(label, $("#txtSouModuleSQL"));
                        break;
                    default:
                        alert('未知类型');
                        return false;
                }
            });

            $("#btnSouSave").bind('click', function () {
                var id = $("#txtSouId").val();
                var type = $("#selSouType").val();
                var name = $("#txtSouName").val();
                var db = $("#selSouDB").val();
                if ($.trim(id) == '') { alert('数据源关键字不能为空！'); return false; }
                if ($.trim(type) == '') { alert('数据源类型不能为空！'); return false; }
                if ($.trim(name) == '') { alert('数据源描述不能为空！'); return false; }
                var table = '';
                var field = '';
                var where = '';
                var order = '';
                var lsrc = '';
                var rsrc = '';
                var join = '';
                var on = '';
                var sql = '';
                var memorysource = '';
                var modulefun = '';
                var moduletable = '';
                var seq = $("#chkSeq").attr('checked') ? true : false;
                var trans = $("#chkTrans").attr('checked') ? true : false;
                var temp = $("#selDataTemp").val();
                var labels = [];
                switch (type) {
                    case CONST_SOURCE_TYPE_SQL:
                        labels = $.GetPropertyLabel($("#txtTableName").val());
                        var val = $("#txtTableName").val();
                        if (labels != null) {
                            for (var i = 0; i < labels.length; i++) {
                                val = val.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getIdByName(labels[i]) + CONST_PROPERTY_LAST);
                            }
                        }
                        table = val;
                        field = $("#txtTableField").val();
                        where = $("#txtWhere").val();
                        order = $("#txtOrderBy").val();
                        if ($.trim(table) == '') { alert('数据表名称不能为空！'); return false; }
                        if ($.trim(field) == '') { alert('数据表列不能为空！'); return false; }
                        labels = $.GetPropertyLabel(where);
                        if (labels != null) {
                            for (var i = 0; i < labels.length; i++) {
                                where = where.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getIdByName(labels[i]) + CONST_PROPERTY_LAST);
                            }
                        }
                        break;
                    case CONST_SOURCE_TYPE_JOIN:
                        labels = $.GetPropertyLabel($("#txtTable1").val());
                        var val = $("#txtTable1").val();
                        if (labels != null) {
                            for (var i = 0; i < labels.length; i++) {
                                val = val.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getIdByName(labels[i]) + CONST_PROPERTY_LAST);
                            }
                        }
                        lsrc = val;
                        labels = $.GetPropertyLabel($("#txtTable2").val());
                        val = $("#txtTable2").val();
                        if (labels != null) {
                            for (var i = 0; i < labels.length; i++) {
                                val = val.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getIdByName(labels[i]) + CONST_PROPERTY_LAST);
                            }
                        }
                        rsrc = val;
                        //lsrc = $("#txtTable1").val();
                        //rsrc = $("#txtTable2").val();
                        join = $("#selSourceJoin").val();
                        on = $("#txtOn").val();
                        field = $("#txtJoinField").val();
                        where = $("#txtJoinWhere").val();
                        order = $("#txtJoinOrderBy").val();
                        if ($.trim(lsrc) == '') { alert('数据表1不能为空！'); return false; }
                        if ($.trim(rsrc) == '') { alert('数据表2不能为空！'); return false; }
                        if ($.trim(on) == '') { alert('关联项不能为空！'); return false; }
                        if ($.trim(field) == '') { alert('数据表列不能为空！'); return false; }
                        labels = $.GetPropertyLabel(where);
                        if (labels != null) {
                            for (var i = 0; i < labels.length; i++) {
                                if (labels[i] != '{0}' && labels[i] != '{1}') {
                                    where = where.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getIdByName(labels[i]) + CONST_PROPERTY_LAST);
                                }
                            }
                        }
                        break;
                    case CONST_SOURCE_TYPE_CUS:
                        sql = $("#txtSouCusSQL").val();
                        if ($.trim(sql) == '') { alert('SQL语句不能为空！'); return false; }
                        labels = $.GetPropertyLabel(sql);
                        if (labels != null) {
                            for (var i = 0; i < labels.length; i++) {
                                sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getIdByName(labels[i]) + CONST_PROPERTY_LAST);
                            }
                        }
                        break;
                    case CONST_SOURCE_TYPE_REFSUR:
                        sql = $("#txtSouRefSQL").val();
                        if ($.trim(sql) == '') { alert('SQL语句不能为空！'); return false; }
                        labels = $.GetPropertyLabel(sql);
                        if (labels != null) {
                            for (var i = 0; i < labels.length; i++) {
                                sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getIdByName(labels[i]) + CONST_PROPERTY_LAST);
                            }
                        }
                        break;
                    case CONST_SOURCE_TYPE_MEMORY:
                        memorysource = $("#txtMemorySource").val();
                        sql = $("#txtSouMemorySQL").val();
                        if ($.trim(sql) == '') { alert('SQL语句不能为空！'); return false; }
                        labels = $.GetPropertyLabel(sql);
                        if (labels != null) {
                            for (var i = 0; i < labels.length; i++) {
                                sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getIdByName(labels[i]) + CONST_PROPERTY_LAST);
                            }
                        }
                        break;
                    case CONST_SOURCE_TYPE_MODULE:
                        modulefun = $("#selModuleFun").val();
                        moduletable = $('#txtModuleTable').val();
                        sql = $("#txtSouModuleSQL").val();
                        if ($.trim(sql) == '') { alert('SQL语句不能为空！'); return false; }
                        labels = $.GetPropertyLabel(sql);
                        if (labels != null) {
                            for (var i = 0; i < labels.length; i++) {
                                sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getIdByName(labels[i]) + CONST_PROPERTY_LAST);
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
                    data: { postType: "SaveSource", pFile: SourceManage.xmlFile, pId: id, pType: type, pName: name, pSql: sql, pTable: table, pField: field, pWhere: where, pOrder: order,
                        pLSrc: lsrc, pRSrc: rsrc, pJoin: join, pOn: on, pOldId: $("#hidSourceId").val(), pSeq: seq, pTrans: trans, pTemp: temp, pDb: db, pModuleFun: modulefun, pModuleTable: moduletable, pMemorySource: memorysource
                    },
                    cache: false,
                    success: function (data) {
                        if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                            alert(data.msg);
                            return false;
                        }
                        alert(data.msg);
                        SourceManage.clear();
                        SourceManage.ref_list();
                    },
                    error: function (data, status, e) {
                        alert(e);
                        return false;
                    }
                });
            });
            $("#btnSouCancel").bind('click', function () {
                SourceManage.clear();
            });
            $("#txtWhere").bind('click', function () {
                if ($.trim($("#txtTableName").val()) == "") return;
                $.OpenDialog('/report/_dialog_SetDataFilter.aspx', window, 600, 530, function (retValue) {
                    $("#txtWhere").val(retValue);
                });
            });
            $("#txtJoinWhere").bind('click', function () {
                if ($.trim($("#txtTable1").val()) == "" && $.trim($("#txtTable2").val()) == "") return;
                $.OpenDialog('/report/_dialog_SetDataFilter.aspx', window, 600, 530, function (retValue) {
                    $("#txtJoinWhere").val(retValue);
                });
            });
        },
        getWhere: function () {
            var v = [];
            var type = $("#selSouType").val();
            switch (type) {
                case CONST_SOURCE_TYPE_SQL:
                    v.push(0);
                    v.push($("#txtTableName").val());
                    v.push($("#txtWhere").val());
                    v.push($("#selSouDB").val());
                    break;
                case CONST_SOURCE_TYPE_JOIN:
                    v.push(1);
                    v.push($("#txtTable1").val());
                    v.push($("#txtTable2").val());
                    v.push($("#txtJoinWhere").val());
                    v.push($("#selSouDB").val());
                    break;
                case CONST_SOURCE_TYPE_CUS:
                    break;
                case CONST_SOURCE_TYPE_REFSUR:
                    break;
                case CONST_SOURCE_TYPE_MEMORY:
                    break;
                case CONST_SOURCE_TYPE_MODULE:
                    break;
                default:
                    alert('未知类型');
                    return false;
            }
            return v;
        },
        getNameById: function (id) {
            var name = "";
            var idSplit = id.replace(CONST_PROPERTY_PREV, '').replace(CONST_PROPERTY_LAST, '').split('.');
            id = $.trim(idSplit[0]);
            $.each($("#selSouProperty option"), function (i, n) {
                if ($(n).attr("value") == id) {
                    if (idSplit.length == 1) { name = $(n).text(); }
                    else { name = $(n).text() + "." + idSplit[1]; }
                }
            });
            return name;
        },
        getIdByName: function (name) {
            var id = "";
            var nameSplit = name.replace(CONST_PROPERTY_PREV, '').replace(CONST_PROPERTY_LAST, '').split('.'); //解析是否存在特殊标识.0 .1
            name = $.trim(nameSplit[0]);
            $.each($("#selSouProperty option"), function (i, n) {
                if ($(n).text() == name) {
                    if (nameSplit.length == 1) { id = $(n).attr("value"); }
                    else { id = $(n).attr("value") + "." + nameSplit[1]; }
                }
            });
            return id;
        },
        ref_list: function () {

            $.GetData(SourceHandler, "GetPropertys", SourceManage.xmlFile, "", function (data) {
                $("#selSouProperty").empty();
                $.each(data, function (i, n) {
                    $("<option value='" + n.id + "'>" + n.name + "</option>").appendTo("#selSouProperty");
                });
            });

            $.GetData(SourceHandler, "GetSources", SourceManage.xmlFile, "", function (data) {
                $("#" + SourceManage.table + " tr:not(:first)").remove();
                $.each(data, function (i, n) {
                    var content = "";
                    content += "<td>" + n.id + "</td>";
                    content += "<td>" + n.name + "</td>";
                    content += "<td>" + $.GetTypeName(n.type, sqlType) + "</td>";
                    var opContent = "";
                    opContent += "<a href='#' class=sourceFill id='" + n.id + "' fill='" + n.fill + "' ref='" + n.ref + "' ><img src='/i/Report/fill.ico' alt='设置填充数据'/></a>&nbsp;";
                    opContent += "<a href='#' class=sourceTemp  id='" + n.id + "'><img src='/i/Report/temp.ico' alt='设置模板属性'/></a>&nbsp;";
                    opContent += "<a href='#' class=sourceEdit key='" + n.id + "'><img src='/i/Report/edit.ico' alt='编辑' /></a>&nbsp;";
                    opContent += "<a href='#' class=sourceRemove key='" + n.id + "'><img src='/i/Report/delete.ico' alt='删除' /></a>";
                    content += "<td>" + opContent + "</td>";
                    $("<tr class='col'>" + content + "</tr>").insertAfter($("#" + SourceManage.table + " tr:eq(" + i + ")"));
                })
                $("#" + SourceManage.table + " tr td").find("[class=sourceEdit]").bind('click', function () {
                    $.GetData(SourceHandler, "GetSource", SourceManage.xmlFile, $(this).attr("key"), function (data) {
                        SourceManage.clear();
                        var labels = [];
                        var sql = "";
                        $("#btnSouCancel").show();
                        $("#hidSourceId").val(data.id);
                        $("#txtSouId").val(data.id);
                        $("#txtSouName").val(data.name);
                        $("#chkSeq").attr('checked', data.seq == 'false' ? false : true);
                        $("#chkTrans").attr('checked', data.trans == 'true' ? true : false);
                        $("#selSouType").val(data.type);
                        $("#selSouType").change();
                        $("#selDataTemp").val(data.temp);
                        $("#selSouDB").val(data.db);
                        switch (data.type) {
                            case CONST_SOURCE_TYPE_SQL:
                                labels = $.GetPropertyLabel(data.src);
                                var val = data.src;
                                if (labels != null) {
                                    for (var i = 0; i < labels.length; i++) {
                                        val = val.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getNameById(labels[i]) + CONST_PROPERTY_LAST);
                                    }
                                }
                                $("#txtTableName").val(val);
                                $("#txtTableField").val(data.field);
                                sql = data.where;
                                labels = $.GetPropertyLabel(sql);
                                if (labels != null) {
                                    for (var i = 0; i < labels.length; i++) {
                                        sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getNameById(labels[i]) + CONST_PROPERTY_LAST);
                                    }
                                }
                                $("#txtWhere").val(sql);
                                $("#txtOrderBy").val(data.order);
                                break;
                            case CONST_SOURCE_TYPE_JOIN:
                                labels = $.GetPropertyLabel(data.lsrc);
                                var val = data.lsrc;
                                if (labels != null) {
                                    for (var i = 0; i < labels.length; i++) {
                                        val = val.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getNameById(labels[i]) + CONST_PROPERTY_LAST);
                                    }
                                }
                                $("#txtTable1").val(val);
                                labels = $.GetPropertyLabel(data.rsrc);
                                val = data.rsrc;
                                if (labels != null) {
                                    for (var i = 0; i < labels.length; i++) {
                                        val = val.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getNameById(labels[i]) + CONST_PROPERTY_LAST);
                                    }
                                }
                                $("#txtTable2").val(val);
                                //$("#txtTable1").val(data.lsrc);
                                //$("#txtTable2").val(data.rsrc);
                                $("#selSourceJoin").val(data.join);
                                $("#txtOn").val(data.on);
                                $("#txtJoinField").val(data.field);
                                sql = data.where;
                                labels = $.GetPropertyLabel(sql);
                                if (labels != null) {
                                    for (var i = 0; i < labels.length; i++) {
                                        sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getNameById(labels[i]) + CONST_PROPERTY_LAST);
                                    }
                                }
                                $("#txtJoinWhere").val(sql);
                                $("#txtJoinOrderBy").val(data.order);
                                break;
                            case CONST_SOURCE_TYPE_CUS:
                                sql = data.sql;
                                labels = $.GetPropertyLabel(data.sql);
                                if (labels != null) {
                                    for (var i = 0; i < labels.length; i++) {
                                        sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getNameById(labels[i]) + CONST_PROPERTY_LAST);
                                    }
                                }
                                $("#txtSouCusSQL").val(sql);
                                break;
                            case CONST_SOURCE_TYPE_REFSUR:
                                sql = data.sql;
                                labels = $.GetPropertyLabel(data.sql);
                                if (labels != null) {
                                    for (var i = 0; i < labels.length; i++) {
                                        sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getNameById(labels[i]) + CONST_PROPERTY_LAST);
                                    }
                                }
                                $("#txtSouRefSQL").val(sql);
                                break;
                            case CONST_SOURCE_TYPE_MEMORY:
                                $("#txtMemorySource").val(data.memorysource);
                                sql = data.sql;
                                labels = $.GetPropertyLabel(data.sql);
                                if (labels != null) {
                                    for (var i = 0; i < labels.length; i++) {
                                        sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getNameById(labels[i]) + CONST_PROPERTY_LAST);
                                    }
                                }
                                $("#txtSouMemorySQL").val(sql);
                                break;
                            case CONST_SOURCE_TYPE_MODULE:
                                $("#selModuleFun").val(data.modulefun);
                                if ($("#selModuleFun").val() == "DataChange") {
                                    $("#txtSouModuleSQL").attr("title", "需要转置的数据源的SQL语句");
                                }
                                if ($("#selModuleFun").val() == "SpecialStyle") {
                                    $("#txtSouModuleSQL").attr("title", "格式：标题显示字段,值字段|数据源SQL语句或视图|条件字段|标题1:标题对应字段1,标题2:标题对应字段2...[|标题1:标题对应字段1,标题2:标题对应字段2...](注：[]中为内容后面填充部分，选填)");
                                }
                                $("#txtModuleTable").val(data.moduletable);
                                sql = data.sql;
                                labels = $.GetPropertyLabel(data.sql);
                                if (labels != null) {
                                    for (var i = 0; i < labels.length; i++) {
                                        sql = sql.replace(labels[i], CONST_PROPERTY_PREV + SourceManage.getNameById(labels[i]) + CONST_PROPERTY_LAST);
                                    }
                                }
                                $("#txtSouModuleSQL").val(sql);
                                break;
                            default:
                                alert('未知类型');
                                return false;
                        }

                    });
                });
                $("#" + SourceManage.table + " tr td").find("[class=sourceRemove]").bind('click', function () {
                    if (confirm('您确定要删除此数据吗？')) {
                        $.RemoveData(SourceHandler, "RemoveSource", SourceManage.xmlFile, $(this).attr("key"), function () {
                            SourceManage.clear();
                            SourceManage.ref_list();
                        });
                    }
                });
                $("#" + SourceManage.table + " tr td").find("[class=sourceTemp]").bind('click', function () {
                    $.OpenDialog('/report/_dialog_SetSourceTemp.aspx?id=' + $(this).attr("id") + '', window, 400, 200);
                });
                $("#" + SourceManage.table + " tr td").find("[class=sourceFill]").bind('click', function () {
                    $.OpenDialog('/report/_dialog_SetSourceFill.aspx?id=' + $(this).attr("id") + '', window, 400, 200);
                });
            });
        },
        clear: function () {
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
            $("#chkTrans").attr('checked', false);
            $("#hidSourceId").val("");
            $("#selDataTemp").val("");
            $("#btnSouCancel").hide();
            $("#txtSouRefSQL").val("");
            $("#txtMemorySource").val("");
            $("#txtSouMemorySQL").val("");
            $("#txtSouModuleSQL").val("");
            $("#txtModuleTable").val("");
        }
    }
})();






/*********************************************************************************************************************************************************
数据绑定管理对象
*********************************************************************************************************************************************************/
var FieldManage = (function () {
    return {
        xmlFile: "",
        table: "",
        init: function (opt) {

            FieldManage.table = opt.table || "";

            $.FillType(srcType, 'selFieldSource');

            $("#txtFieldCol").bind('click', function () {
                if ($("#selFieldSource").val() == CONST_FIELD_SRC_DATABASE) { //数据库
                    if ($.trim($("#txtFieldSrc").val()) == "") return;
                    $.setSourceField("divSelectDataBindField", $("#hidSrcId").val(), "databind", FieldManage.xmlFile, "txtFieldCol");
                    $("#divSelectDataBindField").show('fast');
                }
            });

            $("#btnSaveField").bind('click', function () {
                var sheet = $("#selSheet").val();
                var id = $("#selLabel").val();
                var name = $("#txtFieldName").val();
                var type = $("#selFieldSource").val();
                var src = $("#hidSrcId").val();
                var f = $("#txtFieldCol").val();
                var separator = $("#txtSeparator").val();
                var filter = $("#txtFilter").val();
                var st = $("#selStoreTable").val();
                var dt = $("#selStoreDataType").val();
                var def = $("#txtDefValue").val();
                var permission = $("#txtFieldPermission").val();
                if ($.trim(id) == '') { alert('报表字段不能为空！'); return false; }
                if ($.trim(type) == '') { alert('数据来源不能为空！'); return false; }
                if ($.trim(src) == '') { alert('数据源不能为空！'); return false; }
                if ($.trim(st) != '') {
                    if ($.trim(dt) == '') {
                        alert('当选择数据保存时,数据类型不能为空！'); return false;
                    }
                } else {
                    if ($.trim(f) == '') { alert('数据列表不能为空！'); return false; }
                }
                $.ajax({
                    url: FieldHandler,
                    type: "post",
                    data: { postType: "SaveField", pFile: FieldManage.xmlFile, pSheet: sheet, pId: id, pType: type, pName: name, pSrc: src, pField: f, pSeparator: separator, pFilter: filter, pOldId: $("#hidOldLabel").val(), pSt: st, pDt: dt, pDef: def, pPermission: permission },
                    cache: false,
                    success: function (data) {
                        if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                            alert(data.msg);
                            return false;
                        }
                        alert(data.msg);
                        FieldManage.clear();
                        FieldManage.ref_list();
                    },
                    error: function (data, status, e) {
                        alert(e);
                        return false;
                    }
                });
            });

            $("#btnFieldCancel").bind('click', function () {
                FieldManage.clear();
            });

            $("#selLabel").bind('change', function () {
                if ($.trim($("#hidOldLabel").val()) == '') {
                    $("#txtFieldName").val($("#selLabel option:selected").text().replace('{', '').replace('}', ''));
                }
            });

            $("#selSheet").empty();

            for (var i = 0; i < window.dialogArguments.CellObject.getCurrentTotalSheetCount(); i++) {
                $("<option value='" + window.dialogArguments.CellObject.getSheetLabel(i) + "' s=" + i + ">" + window.dialogArguments.CellObject.getSheetLabel(i) + "</option>").appendTo("#selSheet");
            }

            $("#selSheet").bind('change', function () {

                var sheet = $("#selSheet option:selected").val();
                $("#selLabel").empty();
                var sheetAry = window.dialogArguments.CellObject.getAllLabelBySheetName(sheet);
                for (var i = 0; i < sheetAry.length; i++) {
                    if (sheetAry[i].type != '') {
                    $("<option value='" + sheetAry[i].name + "'>" + sheetAry[i].text + "</option>").appendTo("#selLabel");
                }
                }
                FieldManage.filterLabel();
                if ($.trim($("#hidOldLabel").val()) == '') {
                    $("#txtFieldName").val($("#selLabel option:selected").text().replace('{', '').replace('}', ''));
                }
            });

            $("#selFieldSource").change(function () {
                $("#txtFieldSrc").val("");
                $("#txtFieldCol").val("");
                $("#txtSeparator").val("");
                $("#txtFilter").val("");
                $("#txtFilter").attr("disabled", "disabled");
                if ($(this).val() == CONST_FIELD_SRC_SEARCH) {
                    $("#txtFieldCol").val("0");
                }
                else {
                    $("#txtFilter").removeAttr("disabled");
                }
                $("#divSelectDataSource").hide('fast');
            });

            $("#txtFieldSrc").live('focus', function () {

                $("#divSelectDataBindField").hide();

                $('#divSelectDataSource').html("");
                var sInnerHtml = "<p><a href='#' id=close><img src='/i/close.gif' /></a></p>";

                if ($("#selFieldSource").val() == CONST_FIELD_SRC_SEARCH) {
                    $.GetData(SourceHandler, "GetPropertys", FieldManage.xmlFile, "", function (data) {
                        var h = "";
                        $.each(data, function (i, n) {
                            h += "<a href=#; class='field' id='" + n.id + "'  text='" + n.name + "'><span id='a" + i + "''>" + n.name + "</span></a>";
                        });
                        $('#divSelectDataSource').html(sInnerHtml + h);
                        $("#divSelectDataSource").find("a[class=field]").bind('click', function () {
                            $("#txtFieldSrc").val($(this).attr("text"));
                            $("#hidSrcId").val($(this).attr("id"));
                            $("#txtFieldCol").val("0");
                            $("#divSelectDataSource").hide('fast');
                        }); $("#close").bind('click', function () { $("#divSelectDataSource").hide('fast'); });
                    });
                }
                else {
                    $.GetData(SourceHandler, "GetSources", FieldManage.xmlFile, "", function (data) {
                        var h = "";
                        $.each(data, function (i, n) {
                            h += "<a href=#; class='field' id='" + n.id + "' text='" + n.name + "'><span id='a" + i + "''>" + n.name + "</span></a>";
                        });
                        $('#divSelectDataSource').html(sInnerHtml + h);
                        $("#divSelectDataSource").find("a[class=field]").bind('click', function () {
                            $("#txtFieldSrc").val($(this).attr("text"));
                            $("#hidSrcId").val($(this).attr("id"));
                            $("#divSelectDataSource").hide('fast');
                        }); $("#close").bind('click', function () { $("#divSelectDataSource").hide('fast'); });
                    });
                }
                $("#divSelectDataSource").show('fast');
            });

        },
        filterLabel: function () {
            $.each($("#" + FieldManage.table + " tr:not(:first)"), function (i, n) {
                $.each($("#selLabel option"), function (j, s) {
                    if ($(n).find('td').eq(0).html() == $(s).val()) {
                        if ($(s).val() != $.trim($("#hidOldLabel").val())) {
                            $("#selLabel option[index=" + j + "]").remove();
                        }
                    }
                });
            });
        },
        ref_list: function () {

            $.GetData(DBConfigHandler, "GetTables", FieldManage.xmlFile, "", function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                else {
                    $("#selStoreTable option:not(:first)").remove();
                    if (data.msg != 'unCreateMain') {
                        $.each(data, function (i, n) {
                            $("<option value='" + n.name + "'>" + ($.trim(n.desc) == '' ? n.name : n.desc) + "</option>").appendTo("#selStoreTable");
                        });
                    }
                }
            });

            $.GetData(FieldHandler, "GetFields", FieldManage.xmlFile, "", function (data) {
                $("#" + FieldManage.table + " tr:not(:first)").remove();
                $.each(data, function (i, n) {
                    var content = "";
                    content += "<td>" + n.id + "</td>";
                    content += "<td>" + n.name + "</td>";
                    content += "<td>" + $.GetTypeName(n.type, srcType) + "</td>";
                    content += "<td>" + ($.trim(n.st) == '' ? '否' : '<font color=green><b>是</b></font>') + "</td>";
                    var opContent = "";
                    opContent += "<a href='#'class=fieldInit key='" + n.id + "'><img src='/i/Report/get.ico' alt='数据召唤设置' /></a>&nbsp;";
                    opContent += "<a href='#'class=fieldEdit key='" + n.id + "'><img src='/i/Report/edit.ico' alt='编辑' /></a>&nbsp;";
                    opContent += "<a href='#'class=fieldRemove key='" + n.id + "'><img src='/i/Report/delete.ico' alt='删除' /></a>";
                    content += "<td>" + opContent + "</td>";
                    $("<tr class='col'>" + content + "</tr>").insertAfter($("#" + FieldManage.table + " tr:eq(" + i + ")"));
                });
                $("#" + FieldManage.table + " tr td").find("[class=fieldInit]").bind('click', function () {
                    $.OpenDialog('/report/_dialog_SetInitSource.aspx?id=' + $(this).attr("key") + '', window, 500, 300);
                });
                $("#" + FieldManage.table + " tr td").find("[class=fieldEdit]").bind('click', function () {
                    $.GetData(FieldHandler, "GetField", FieldManage.xmlFile, $(this).attr("key"), function (data) {
                        FieldManage.clear();
                        $("#btnFieldCancel").show();
                        $("#hidOldLabel").val(data.id);
                        $("#txtFieldName").val(data.name);
                        $("#selFieldSource").val(data.type);
                        $("#selSheet").val(data.sheet);
                        $("#selSheet").change();

                        $("#txtDefValue").val(data.def);
                        $("#txtFieldPermission").val(data.permission);
                        $("#txtFieldCol").val(data.col);
                        $("#txtSeparator").val(data.separator);
                        $("#txtFilter").val(data.filter);
                        if ($("#selLabel option").length > 1) {
                            $("#selLabel").val(data.id);
                        }
                        $("#hidSrcId").val(data.src);
                        $("#txtFilter").attr("disabled", "disabled");

                        $("#selStoreTable").val(data.st);
                        $("#selStoreDataType").val(data.dt);
                        //                        if ($.trim(data.st) != '') {
                        //                            $("#selStoreTable").attr("disabled", "disabled");
                        //                        }
                        if ($.trim(data.dt) != '') {
                            $("#selStoreDataType").attr("disabled", "disabled");
                        }
                        if (data.type == CONST_FIELD_SRC_SEARCH) {
                            $.GetData(SourceHandler, "GetPropertys", FieldManage.xmlFile, "", function (data) {
                                $.each(data, function (i, n) {
                                    if (n.id == $("#hidSrcId").val()) {
                                        $("#txtFieldSrc").val(n.name);
                                    }
                                });
                            });
                        }
                        else {
                            $("#txtFilter").removeAttr("disabled");
                            $.GetData(SourceHandler, "GetSources", FieldManage.xmlFile, "", function (data) {
                                $.each(data, function (i, n) {
                                    if (n.id == $("#hidSrcId").val()) {
                                        $("#txtFieldSrc").val(n.name);
                                    }
                                });
                            });
                        }

                    });
                });
                $("#selSheet").change();
                $("#" + FieldManage.table + " tr td").find("[class=fieldRemove]").bind('click', function () {
                    if (confirm('您确定要删除此数据吗？')) {
                        $.RemoveData(FieldHandler, "RemoveField", FieldManage.xmlFile, $(this).attr("key"), function () {
                            FieldManage.clear();
                            FieldManage.ref_list();
                        });
                    }
                });

            });
        },
        clear: function () {
            $("#txtFieldName").val("");
            $("#selFieldSource").val("");
            $("#txtFieldSrc").val("");
            $("#txtFieldCol").val("");
            $("#txtSeparator").val("");
            $("#txtFieldPermission").val("");
            $("#txtFilter").val("");
            $("#hidOldLabel").val("");
            $("#selStoreTable").val("");
            $("#selStoreDataType").val("");
            $("#btnFieldCancel").hide();
            $("#selStoreTable").removeAttr("disabled");
            $("#selStoreDataType").removeAttr("disabled");
            $("#selSheet").change();
            $("#divSelectDataBindField").hide();
        }
    }
})();



/********************************************************************************************************************************************************
视图管理对象
*********************************************************************************************************************************************************/
var ViewManage = (function () {
    return {
        xmlFile: "",
        table: "",
        init: function (opt) {
            ViewManage.table = opt.table || "";
            $("#btnViewSave").bind('click', function () {
                var oid = $("#hidViewId").val()
                var id = $("#txtViewId").val();
                var db = $("#selViewDB").val();
                var name = $("#txtViewName").val();
                var data = $("#txtViewData").val();
                if ($.trim(id) == '') { alert('视图关键字不能为空！'); return false; }
                if ($.trim(db) == '') { alert('视图数据库不能为空！'); return false; }
                $.ajax({
                    url: ViewHandler,
                    type: "post",
                    data: { postType: "SaveView", pFile: ViewManage.xmlFile, pId: id, pName: name, pDb: db, pData: data, pOldId: oid },
                    cache: false,
                    success: function (data) {
                        if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                            alert(data.msg);
                            return false;
                        }
                        alert(data.msg);
                        ViewManage.clear();
                        ViewManage.ref_list();
                    },
                    error: function (data, status, e) {
                        alert(e);
                        return false;
                    }
                });
            });
            $("#btnViewCancel").bind('click', function () {
                ViewManage.clear();
            });
        },
        ref_list: function () {
            $.GetData(ViewHandler, "ViewList", ViewManage.xmlFile, "", function (data) {
                $("#" + ViewManage.table + " tr:not(:first)").remove();
                $.each(data, function (i, n) {
                    var content = "";
                    content += "<td>" + n.id + "</td>";
                    content += "<td>" + n.name + "</td>";
                    var opContent = "";
                    opContent += "<a href='#'class=viewEdit key='" + n.id + "'><img src='/i/Report/edit.ico' alt='编辑' /></a>&nbsp;";
                    opContent += "<a href='#'class=viewRemove key='" + n.id + "'><img src='/i/Report/delete.ico' alt='删除' /></a>";
                    content += "<td>" + opContent + "</td>";
                    $("<tr class='col'>" + content + "</tr>").insertAfter($("#" + ViewManage.table + " tr:eq(" + i + ")"));
                });
                $("#" + ViewManage.table + " tr td").find("[class=viewEdit]").bind('click', function () {
                    $.GetData(ViewHandler, "GetView", ViewManage.xmlFile, $(this).attr("key"), function (data) {
                        ViewManage.clear();
                        $("#hidViewId").val(data.id)
                        $("#txtViewId").val(data.id);
                        $("#selViewDB").val(data.db);
                        $("#txtViewName").val(data.name);
                        $("#txtViewData").val(data.data);
                        $("#btnViewCancel").show();
                    });
                });
                $("#" + ViewManage.table + " tr td").find("[class=viewRemove]").bind('click', function () {
                    if (confirm('您确定要删除这条视图数据吗？')) {
                        $.RemoveData(ViewHandler, "RemoveView", ViewManage.xmlFile, $(this).attr("key"), function () {
                            ViewManage.clear();
                            ViewManage.ref_list();
                        });
                    }
                });
            });
        },
        clear: function () {
            $("#hidViewId").val("")
            $("#txtViewId").val("");
            $("#selViewDB").val("");
            $("#txtViewName").val("");
            $("#txtViewData").val("");
            $("#btnViewCancel").hide();
        }
    }
})();



/********************************************************************************************************************************************************
填充数据集管理对象
*********************************************************************************************************************************************************/
var FillManage = (function () {
    return {
        xmlFile: "",
        table: "",
        init: function (opt) {
            FillManage.table = opt.table || "";

            $.FillType(fillType, 'selFillType');

            $.GetData(SourceHandler, "GetPropertys", FillManage.xmlFile, "", function (data) {
                $("#selFillOut option:not(:first)").remove();
                $.each(data, function (i, n) {
                    $("<option value='" + n.id + "'>" + n.name + "</option>").appendTo("#selFillOut");
                });
            });
            $("#btnFillSave").bind('click', function () {
                var fillId = $("#txtFillId").val();
                var fillName = $("#txtFillName").val();
                var fillType = $("#selFillType").val();
                var fillOffset = $("#txtOffset").val();
                var startValue = $("#txtStartValue").val();
                var maxValue = $("#txtMaxValue").val();
                var fillOut = $("#selFillOut").val();
                var fillCusData = $("#txtFillCusData").val();
                if ($.trim(fillId) == '') { alert('填充关键字不能为空！'); return false; }
                if ($.trim(fillType) == '') { alert('填充不能为空！'); return false; }
                if (fillType == CONST_FILL_CUS) {
                    if (fillCusData == '') { alert('自定义数据不能为空！'); return false; }
                }
                else {
                    if ($.trim(fillOffset) == '') { alert('递增量不能为空！'); return false; }
                }
                $.ajax({
                    url: SourceHandler,
                    type: "post",
                    data: { postType: "SaveFill", pFile: FillManage.xmlFile,
                        pFillId: fillId, pFillName: fillName, pType: fillType, pOffset: fillOffset, pOut: fillOut,
                        pCusData: fillCusData, pOldId: $("#hidOldFillId").val(), pStart: startValue, pMax: maxValue
                    },
                    cache: false,
                    success: function (data) {
                        if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                            alert(data.msg);
                            return false;
                        }
                        alert(data.msg);
                        FillManage.clear();
                        FillManage.ref_list();
                    },
                    error: function (data, status, e) {
                        alert(e);
                        return false;
                    }
                });
            });
            $("#btnFillCancel").bind('click', function () {
                FillManage.clear();
            });
        },
        ref_list: function () {
            $.GetData(SourceHandler, "GetFills", FillManage.xmlFile, "", function (data) {
                $("#" + FillManage.table + " tr:not(:first)").remove();
                $.each(data, function (i, n) {
                    var content = "";
                    content += "<td>" + n.id + "</td>";
                    content += "<td>" + n.name + "</td>";
                    content += "<td>" + $.GetTypeName(n.type, fillType) + "</td>";
                    var opContent = "";
                    opContent += "<a href='#'class=fillEdit key='" + n.id + "'><img src='/i/Report/edit.ico' alt='编辑' /></a>&nbsp;";
                    opContent += "<a href='#'class=fillRemove key='" + n.id + "'><img src='/i/Report/delete.ico' alt='删除' /></a>";
                    content += "<td>" + opContent + "</td>";
                    $("<tr class='col'>" + content + "</tr>").insertAfter($("#" + FillManage.table + " tr:eq(" + i + ")"));
                });
                $("#" + FillManage.table + " tr td").find("[class=fillEdit]").bind('click', function () {
                    $.GetData(SourceHandler, "GetFill", FillManage.xmlFile, $(this).attr("key"), function (data) {
                        FillManage.clear();
                        $("#hidOldFillId").val(data.id);
                        $("#txtFillId").val(data.id);
                        $("#txtFillName").val(data.name);
                        $("#selFillType").val(data.type);
                        $("#txtOffset").val(data.offset);
                        $("#txtStartValue").val(data.start);
                        $("#txtMaxValue").val(data.max);
                        $("#txtFillCusData").val(data.cus);
                        $("#selFillOut").val(data.out);
                        $("#btnFillCancel").show();
                    });
                });
                $("#" + FillManage.table + " tr td").find("[class=fillRemove]").bind('click', function () {
                    if (confirm('您确定要删除此数据吗？')) {
                        $.RemoveData(SourceHandler, "RemoveFill", FillManage.xmlFile, $(this).attr("key"), function () {
                            FillManage.clear();
                            FillManage.ref_list();
                        });
                    }
                });
            });
        },
        clear: function () {
            $("#btnFillCancel").hide();
            $("#txtFillId").val("");
            $("#txtFillName").val("");
            $("#txtOffset").val("");
            $("#txtStartValue").val("");
            $("#txtMaxValue").val("");
            $("#selFillOut").val("");
            $("#txtFillCusData").val("");
            $("#hidOldFillId").val("");
        }
    }
})();



/********************************************************************************************************************************************************
数据配置管理对象
*********************************************************************************************************************************************************/
var DataConfigManage = (function () {
    return {
        xmlFile: "",
        table: "",
        init: function (opt) {
            DataConfigManage.table = opt.table || "";
            $.FillType(colType, "selStoreDataType");
            $("#btnSave").bind('click', function () {
                var name = $("#txtDBTableName").val();
                var desc = $("#txtDBTableMemo").val();
                if ($.trim(name) == '') { alert('数据表名称不能为空！'); return false; }
                if ($.trim(desc) == '') { alert('数据表的描述不能为空！'); return false; }
                $.ajax({
                    url: DBConfigHandler,
                    type: "post",
                    data: { postType: "SaveTable", pFile: DataConfigManage.xmlFile, pFillName: name, pDesc: desc },
                    cache: false,
                    success: function (data) {
                        if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                            alert(data.msg);
                            return false;
                        }
                        alert(data.msg);
                        DataConfigManage.clear();
                        DataConfigManage.ref_list();
                    },
                    error: function (data, status, e) {
                        alert(e);
                        return false;
                    }
                });

            });
        },
        ref_list: function () {
            $.GetData(DBConfigHandler, "GetTables", DataConfigManage.xmlFile, "", function (data) {
                $("#" + DataConfigManage.table + " tr:not(:first)").remove();
                if (data.msg == "unCreateMain") {
                    if (!confirm('当前的报表还没有创建对应的数据表,是否现在创建？')) {
                        return false;
                    }
                    $.ajax({
                        url: DBConfigHandler,
                        type: "post",
                        data: { postType: "CreateMain", pFile: DataConfigManage.xmlFile },
                        cache: false,
                        success: function (data) {
                            if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                                alert(data.msg);
                                return false;
                            }
                            DataConfigManage.ref_list();
                        },
                        error: function (data, status, e) {
                            alert(e);
                            return false;
                        }
                    });
                } else {
                    $.each(data, function (i, n) {
                        var content = "";
                        content += "<td>" + n.name + "</td>";
                        content += "<td>" + n.desc + "</td>";
                        content += "<td>" + $.GetTypeName(n.type, tableType) + "</td>";
                        $("<tr class='col'>" + content + "</tr>").insertAfter($("#" + DataConfigManage.table + " tr:eq(" + i + ")"));
                    });
                }
            });
        },
        clear: function () {
            $("#txtDBTableName").val("");
        }
    }
})();




var ChartManage = (function () {
    return {
        xmlFile: "",
        init: function (opt) {//初始化
            $('#btnChartSave').live('click', function () {//给保存按钮绑定保存事件
                var allEles = document.getElementsByName("ysh_chart_elements");
                for (var i = 0; i < allEles.length; i++) {
                    //判断必填的input是否为空
                    if (allEles[i].value == "" && allEles[i].parentNode && allEles[i].parentNode.previousSibling && allEles[i].parentNode.previousSibling.innerText.indexOf("*") >= 0) {
                        var title = allEles[i].parentNode;
                        while (title && title.className != "chartcontent") {
                            title = title.parentNode;
                        }
                        alert(title.previousSibling.innerText + " 中的" + allEles[i].parentNode.previousSibling.innerText.replace("*", "") + " 不能为空!");
                        return false;
                    }
                    //判断数据设置是否为空
                    if (allEles[i].value == "" && allEles[i].id.indexOf("chart_datasource") >= 0 && allEles[i].parentNode.parentNode.previousSibling.innerText.indexOf("*") >= 0) {
                        alert("数据源配置 中的" + allEles[i].parentNode.parentNode.previousSibling.innerText.replace("*", "") + " 不能为空!");
                        return false;
                    }
                }
                ChartManage.save();
            });
            $("input").each(function () {
                if (this.id.indexOf("chart_datasource") >= 0) {//把数据类型的input转成选择数据源的
                    var selId = this.id.replace("chart_datasource", "chart_seldatasource");
                    var dvId = this.id.replace("chart_datasource", "chart_dvdatasource");
                    var txtId = this.id;
                    $(this).bind("click", function () {//点击事件，点击打开选择数据源的div
                        if ($.trim($("#" + selId).val()) == "") return;
                        $.setSourceField(dvId, $.trim($("#" + selId).val()), $(this).propid, ChartManage.xmlFile, this.id, function () {
                            $('#' + txtId).val("");
                        });
                        $("#" + dvId).show('fast');
                    });
                }
            });

            //收缩选取窗口
            $("#btn_seleRange").live('click', function () {
                $("#dlg").hide();
                $("#shinkinput").show();
                dialogWidth = "210px";
                dialogHeight = "30px";
            });

            //展开选取窗口
            $("#shinkbtn_seleRange").live('click', function () {
                $("#dlg").show();
                $("#shinkinput").hide();
                dialogHeight = "750px";
                dialogWidth = "650px";
            });

        },
        refData: function (isLoaded) {//得到已保存的数据
            var sourceFields = {}; 
            $.ajax({
                url: ChartHandler,
                type: "post",
                data: { postType: "GetChartAttrs", pFile: DataConfigManage.xmlFile, pId: "" },
                cache: false,
                async: false,
                success: function (data) {
                    if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                        alert(data.msg);
                        return false;
                    }
                    if (data.BaseType && data.SubType && !isLoaded) {
                        document.getElementById("BaseSel").value = data.BaseType;
                        document.getElementById("chart_isgroup").checked = data.isUseGroup == "1";
                        getSubSelect(data.SubType);
                    }
                    else {
                        getSubSelect(document.getElementById("SubSel").value); //在这里初始化整个界面
                    }

                    var allEles = document.getElementsByName("ysh_chart_elements");
                    var PropObj;

                    for (var p in data) {//赋值
                        if (isLoaded && (p == "BaseType" || p == "SubType" || p == "isUseGroup" || p == "chartSwf"))
                            continue;

                        for (var i = 0; i < allEles.length; i++) {
                            if (allEles[i].propid == p || allEles[i].getAttribute("propid") == p) {
                                if (allEles[i].tagName.toUpperCase() == "INPUT" && allEles[i].type.toUpperCase() == "CHECKBOX") {
                                    allEles[i].checked = data[p] == "1";
                                }
                                else {
                                    allEles[i].value = data[p];
                                }
                            }
                        }

                        for (var c in Ysh_ChartProperty) {//鼠标选取控件
                            if (c == "SetProp" || c == "Categories" || c == "DataSet") {
                                PropObj = Ysh_ChartProperty[c];
                                for (var n in PropObj) {
                                    if (PropObj[n].selectCtrl == "0" && PropObj[n].name == p)
                                        sourceFields[PropObj[n].name] = data[p];
                                }
                            }
                        }

                    }
                }
            });

            //显示鼠标选择框内容
            $.GetData(FieldHandler, "GetFields", FieldManage.xmlFile, "", function (data1) {
                for (var s in sourceFields) {
                    $.each(data1, function (i, n) {
                        if (sourceFields[s] == n.col) {
                            $("#" + "seletext_" + s).val(n.name);
                            return false;
                    }
                    });
                }
            });

        },
        save: function () {//保存
            var attrs = [];
            var allEles = document.getElementsByName("ysh_chart_elements");
            var allSeles = document.getElementsByName("ysh_chart_seles");
            for (var i = 0; i < allEles.length; i++) {//拼成json串
                var eleJson;
                if (allEles[i].tagName.toUpperCase() == "INPUT" && allEles[i].type.toUpperCase() == "CHECKBOX") {
                    eleJson = "{ \"Key\": \"" + allEles[i].getAttribute("propid") + "\", \"Value\": \"" + (allEles[i].checked ? "1" : "0") + "\" }";
                }
                else {
                    if (allEles[i].value != "") {
                        eleJson = "{ \"Key\": \"" + allEles[i].getAttribute("propid") + "\", \"Value\": \"" + allEles[i].value + "\" }";
                    }
                }
                attrs.push(eleJson);
            }
            /*pAttrs:[{Key:aa,Value:11},*/
            var postData = { postType: "SetChart", pFile: ChartManage.xmlFile, pAttrs: "[" + attrs.join(",") + "]"
            };
            $.ajax({
                url: ChartHandler,
                type: "post",
                data: postData,
                cache: false,
                success: function (data) {
                    if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                        alert(data.msg);
                        return false;
                    }
                    alert(data.msg);
                },
                error: function (data, status, e) {
                    alert(e);
                    return false;
                }
            });
        },
        refSource: function () {//附加数据源下拉列表的下拉框
            $.ajax({
                url: SourceHandler,
                type: "post",
                data: { postType: "GetSources", pFile: ChartManage.xmlFile, pId: "" },
                cache: false,
                async: false,
                success: function (data) {
                    $("select").each(function () {
                        if (this.id.indexOf("chart_seldatasource") >= 0) {
                            $(this).empty();
                            $("<option value=''></option>").appendTo($(this));
                            var ele = $(this);
                            $.each(data, function (i, n) {
                                $("<option value='" + n.id + "'>" + n.name + "</option>").appendTo(ele);
                            });
                        }
                    });
                }
            });
        }
    }
})();