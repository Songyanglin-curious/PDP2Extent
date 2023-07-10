/*
王磊友情提示：
报表设计器设计脚本文件
您所使用的版本为: Version 1.0.0.0  请不要擅自修改,它会让开发人员清楚的了解当前程序中所使用的版本。
这个文件会随着版本的升级而更新。
如发现问题请发送邮件: mailto:wanglei@ysh.com
*/

//update by subo 20130822，代码进行了完全的重构，改变了接口的调用方式，由原来的"ReportShow.ascx.function"变为了"控件id.function"，function目前包括：Search(cs,st),Print(),Export(),Save()；原接口进行了兼容处理，由"ReportShow.ascx.function"变为"控件id.ascx.function"，function仍为：search(cs,st),print(),exp(),save();

function ReportShow(ctrlId) {
    //私有属性
    var thisC = this;
    //公共属性
    thisC.url = '/';
    thisC.efile = '';
    thisC.cllfile = '';
    thisC.handler = '';
    thisC.searchObj = []; //查询
    thisC.fieldObj = []; //绑定字段
    thisC.cellObj = []; //单元格
    thisC.printSheet = 0;
    thisC.ashxHandler = "conn/ashx/ReportEditerHandler.ashx";
    thisC.storeData = []; //数据保存结果集
    thisC.searchData = [];
    thisC.CellObject = $("#CellWeb_" + ctrlId)[0];
    thisC.divId = "divReportControl_" + ctrlId;
    thisC.tableId = "tbControl_" + ctrlId;
    thisC.showtype = 'cell';
    thisC.showfunc = 'CB_BindCell(thisC.CellObject, $("#tbControl")[0]);';
    thisC.xmlfile = '';
    //公共方法
    thisC.init = function () {
        //thisC.showfunc = StringPP.format('CB_BindCell(thisC.CellObject, $("#{0}")[0]);', thisC.tableId);
        //Modify by gud 20131120
        var idx = thisC.showfunc.indexOf("(");
        if (idx < 0)
            thisC.showfunc += '(thisC.CellObject, $("#' + thisC.tableId + '")[0]);';
        else
            thisC.showfunc = thisC.showfunc.substr(0, idx) + '(thisC.CellObject, $("#' + thisC.tableId + '")[0]);';
        with (thisC.CellObject) {
            login("用尚科技", "", "13100104542", "2120-1751-0203-0005");
            WndBkColor = 16777215;
        }
        if (thisC.showtype == 'table') {
            $("#" + thisC.divId).hide();
        }
        else {
            $("#" + thisC.tableId).hide();
        }
        thisC.handler = thisC.url + thisC.ashxHandler;
        thisC.bindings();
        thisC.buildSearchBox();
    };
    thisC.ascx = {
        search: function (cs, st) { return thisC.Search(cs, st); },
        print: function () { return thisC.Print(); },
        exp: function () { return thisC.Export(); },
        save: function () { return thisC.Save(); }
    }
    thisC.Search = function (cs, st) {
        thisC.storeData = [];
        thisC.searchData = [];
        var postData = "&postType=Search&pFile=" + thisC.xmlfile + "&pSearchType=" + st + "";
        for (var i = 0; i < cs.length; i++) {
            var sn = cs[i];
            var result = "";
            var bAdd = false;
            switch (sn[1]) {
                case "Val":
                case "Back":
                    result = sn[0].GetValue();
                    break;
                case "Sel":
                    result = "{\"Val\":\"" + sn[0].GetValue() + "\",\"Text\":\"" + $("#" + sn[0].ctrl.id + " option:selected").text() + "\"}";
                    break;
                default:
                    bAdd = true;
                    postData += "&" + sn[0] + "=" + sn[1];
                    break;
            }
            if (!bAdd)
                postData += "&" + sn[0].doc.GetDesignID(sn[0].id) + "=" + result;
        }
        thisC.opts.search(postData);
        if (thisC.showtype == 'table') {
            $("#" + thisC.tableId + " tr").remove();
            eval(thisC.showfunc);
        }
        return false;
    };
    thisC.Print = function () {
            thisC.opts.print(); return false;
    };
    thisC.Export = function () {
            thisC.opts.exp(); return false;
    };
    thisC.Save = function () {
            thisC.opts.save(); return false;
    };
    thisC.buildSearchBox = function () {
        var postData = "&postType=GetSearchBox&pFile=" + thisC.xmlfile + "";
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&"); //URL所有参数
        var paraObj = {}
        for (i = 0; j = paraString[i]; i++) {
            postData += "&" + j.substring(0, j.indexOf("=")).toLowerCase() + "=" + j.substring(j.indexOf("=") + 1, j.length);
        }
        $.ajax({
            url: thisC.handler,
            type: "post",
            data: postData,
            cache: false,
            async: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                thisC.cllfile = data.cll;
                $("#" + thisC.searchBox).html(data.html);
                $.each(data.ids, function (i, n) {
                    thisC.searchObj.push(n);
                    if (n.type == CONST_SEARCH_DROPDOWNLIST) {
                        $('#' + n.id).live('change', function () {
                            var out = $(this).attr('out');
                            if (out != '') {
                                thisC.ref_option(out, $(this).val());
                            }
                        })
                        $('#' + n.id).change();
                    }
                });
                if (data.store) { $("#btnSaveData").show(); } //是否存在数据保存设置
                if (data.init) { $("#btnDataInit").show(); }
                if ($.trim(data.efile) != '') { $("#btnExpEFile").show(); thisC.efile = data.efile; }
                $("select[k=quarter]").bind('change', function () {
                    var year = $("#" + $(this).attr("y") + " option:selected").val();
                    var quarter = $("#" + $(this).attr("q") + " option:selected").val();
                    $("#" + $(this).attr("v")).val(year + "-" + quarter);
                });
                thisC.loadFile();
            },
            error: function (data, status, e) {
                //alert(e);
                //alert(1);
                alert(data.responseText);
                return false;
            }
        });
    };
    thisC.ref_option = function (out) {
        var postData = "&postType=GetOption&pFile=" + thisC.xmlfile + "&pOut=" + out + "";
        for (var i = 0; i < thisC.searchObj.length; i++) {
            var sn = thisC.searchObj[i];
            postData += "&" + sn.id + "=" + $.GetValueBySearch(sn.id, sn.type)
        }
        $('#' + out).empty();
        $.ajax({
            url: thisC.handler,
            data: postData,
            type: "post",
            cache: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                $.each(data, function (i, n) {
                    $("<option value='" + n.val + "'>" + n.text + "</option>").appendTo("#" + out);
                })
            },
            error: function (data, status, e) {
                //alert(e);
                //alert(2);
                alert(data.responseText);
                return false;
            }
        });
    };
    thisC.exec_report = function (postData) {
        $("#report").hide();
        $.ajax({
            url: thisC.handler,
            data: postData,
            type: "post",
            cache: false,
            async: false,
            success: function (data) {
                thisC.cellObj = []; //add by gud 20121006
                var n = thisC.CellObject.OpenFile(thisC.url + thisC.cllfile, "");
                if (n < 1) {
                    alert("打开模版文件失败：" + n);
                    return false;
                }
                var totalSheet = thisC.CellObject.GetTotalSheets();
                //for (var s = 0; s < totalSheet; s++) { //增加末尾的标识列与标识行
                //    var rs = thisC.CellObject.GetRows(s);
                //    var cs = thisC.CellObject.GetCols(s);
                //    thisC.CellObject.InsertRow(rs, 1, s); thisC.CellObject.SetRowHidden(rs, rs);
                //    thisC.CellObject.InsertCol(cs, 1, s); thisC.CellObject.SetColHidden(cs, cs);
                //}
                var content = new C_FillContent();
                var storeData = [];
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                //如果存在页签模板生成必要的附加页签
                for (var i = 0; i < data.sheets.length; i++) {
                    var si = thisC.CellObject.GetSheetIndex(data.sheets[i].temp); //模板页索引
                    if (si < 0) {
                        alert('您的报表配置出现了问题,请检查当前报表所配置的模板页签是否与Cell文件一致,页签名称:( ' + data.sheets[i].temp + ' )。');
                        return false;
                    }
                    var insertStart = si + 1;
                    for (var j = 0; j < data.sheets[i].value.length; j++) {
                        thisC.CellObject.InsertSheet(insertStart, 1); //插入页签
                        thisC.CellObject.SetSheetLabel(insertStart, data.sheets[i].value[j].sname); //修改页签名称
                        thisC.CellObject.CopySheet(insertStart, si); //拷贝模板
                    }
                    thisC.CellObject.DeleteSheet(si, 1);
                }
                //开始为模板赋值,在此先不处理PAGE
                var totalSheet = thisC.CellObject.GetTotalSheets();
                var pageLabel = []; //存储PAGE标签                   
                for (var s = 0; s < totalSheet; s++) {
                    var isFill = false;
                    var sname = thisC.CellObject.GetSheetLabel(s);
                    for (var f = 0; f < data.fields.length; f++) {
                        if (sname === data.fields[f].sheet && data.fields[f].stype == "Temp") {
                            if (!isFill) thisC.CellObject.SetCurSheet(s);
                            if (thisC.getLabelType(data.fields[f].id, s) != "PAGE") {
                                content.add(data.fields[f].id, data.fields[f].result, null);
                            } else {
                                pageLabel.push([s, data.fields[f].id, data.fields[f].result]);
                            }
                            isFill = true;
                        }
                    }
                    if (isFill) {
                        var template = content.loadTemplate(thisC.CellObject);
                        thisC.loadCellObj(template, thisC.CellObject, s);
                        template.defaultempty = true;
                        content.fillCell(thisC.CellObject, template, null, false, true);
                    }
                }
                for (var s = 0; s < totalSheet; s++) {
                    var isFill = false;
                    var sname = thisC.CellObject.GetSheetLabel(s);
                    for (var f = 0; f < data.fields.length; f++) {
                        if (sname === data.fields[f].sheet && data.fields[f].stype == "Normal") {
                            if (!isFill) thisC.CellObject.SetCurSheet(s);
                            if (thisC.getLabelType(data.fields[f].id, s) != "PAGE") {
                                thisC.setCellState(data.fields[f].permission, s, data.fields[f].id);
                                if (data.fields[f].store)
                                    storeData.push([data.fields[f].id, s, data.fields[f].result]);
                                content.add(data.fields[f].id, data.fields[f].result, null);
                            } else {
                                var sheetNames = thisC.filterSheet(data.fields[f].result);
                                content.add(data.fields[f].id, sheetNames, null);
                            }
                            isFill = true;
                        }
                    }
                    if (isFill) {
                        var template = content.loadTemplate(thisC.CellObject);
                        thisC.loadCellObj(template, thisC.CellObject, s);
                        template.defaultempty = true;
                        content.fillCell(thisC.CellObject, template, null, true, true);
                    }
                }
                thisC.CellObject.SetCurSheet(0);
                thisC.CellObject.CloseFile();
                thisC.storeData = storeData;
                openEditeBackup(thisC.CellObject);
                $("#report").show();
            },
            error: function (data, status, e) {
                //alert(e);
                //alert(3);
                alert(data.responseText);
                return false;
            }
        });
    };
    thisC.setCellState = function (p, s, id) {
        if (p == "1") {
            var rs = thisC.CellObject.GetRows(s); //行数
            var cs = thisC.CellObject.GetCols(s); //列数       
            for (var r = 1; r <= rs; r++) {
                for (var c = 1; c <= cs; c++) {
                    var cellString = thisC.CellObject.GetCellString(c, r, s);
                    if ($.trim(cellString) != "") {
                        var re = /<<<(.*?)>>>/gi;
                        var cellStringAry = cellString.match(re);
                        var cellContent = "";
                        if (cellStringAry != null) {
                            for (var i = 0; i < cellStringAry.length; i++) {
                                var curPrev = cellStringAry[i].substring(0, 3);
                                var curEnd = cellStringAry[i].substring(cellStringAry[i].length - 3, cellStringAry[i].length);
                                if ("<<<" == curPrev && ">>>" == curEnd) {
                                    var content = cellStringAry[i].substring(cellStringAry[i].length - 3, 3);
                                    var contentSplit = content.split(",");
                                    if ($.trim(contentSplit[0]) == $.trim(id)) {
                                        thisC.CellObject.SetCellInput(c, r, s, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    thisC.getValueByField = function (str, fieldobj) {
        if (fieldobj == null)
            return str;
        if (fieldobj._type != "LIST")
            return str;
        str = $.trim(str);
        var textarray = fieldobj._format[1];
        for (var i = 0; i < textarray.length; i++) {
            if (textarray[i] == str)
                return fieldobj._format[0][i];
        }
        return str;
    };
    thisC.convertResult = function (data) {
        //data 格式:          [字段名称，所在页签， 字段结果集]
        //ReportShow.cellObj :[字段名称，字段类型，所在页签，是否列表, 字段对象]
        for (var j = 0; j < data.length; j++) {
            for (var i = 0; i < thisC.cellObj.length; i++) {
                if (data[j][0] == thisC.cellObj[i][0] && data[j][1] == thisC.cellObj[i][2]) {
                    if (!thisC.cellObj[i][3]) {
                        if (typeof (data[j][2]) == "object") { data[j][2] = data[j][2][0]; }
                    }
                }
            }
        }
        //转换页面值到数据集
        for (var i = 0; i < data.length; i++) {
            //当前只考虑自增行数据
            var fieldname = data[i][0];
            var ps = thisC.store.getPosition(fieldname, data[i][1]);
            var fieldobj = null;
            for (var j = 0; j < thisC.cellObj.length; j++) {
                if (thisC.cellObj[j][0] == fieldname) {
                    fieldobj = thisC.cellObj[j][4];
                    break;
                }
            }
            //相等的定义为单值
            if (ps[0] === ps[2] && ps[1] == ps[3]) {
                var str = thisC.CellObject.GetCellString(ps[1], ps[0], data[i][1]);
                data[i][2] = this.getValueByField(str, fieldobj);
            }
            else {
                var cm = F_GetMergeRangeCol(thisC.CellObject, ps[1], ps[0], 0, 2) - ps[1];
                var rm = F_GetMergeRangeRow(thisC.CellObject, ps[1], ps[0], 0, 3) - ps[0];
                var ds = [];
                for (var j = ps[0]; j <= ps[2]; j = j + (rm == 0 ? 1 : rm)) {
                    var str = thisC.CellObject.GetCellString(ps[1], j, data[i][1]);
                    ds.push(this.getValueByField(str, fieldobj));
                }
                data[i][2] = ds;
            }
        }
        thisC.storeData = data;
    };
    thisC.store = {
        getPosition: function (labelName, s) {
            var t = -1, l = -1, b = -1, r = -1;
            var rs = thisC.CellObject.GetRows(s); //行数
            var cs = thisC.CellObject.GetCols(s); //列数
            for (var r = 1; r < rs; r++) {
                var labels = $.GetCellLabels(thisC.CellObject.GetCellNote(0, r, s));
                if (labels != null) {
                    for (var j = 0; j < labels.length; j++) {
                        if ("[" + labelName + "]" == labels[j]) {
                            if (t == -1) { t = r; }
                            if (b == -1 && t < r) { b = r; }
                        }
                    }
                }
            }
            r = -1
            for (var c = 0; c < cs; c++) {
                var labels = $.GetCellLabels(thisC.CellObject.GetCellNote(c, 0, s));
                if (labels != null) {
                    for (var j = 0; j < labels.length; j++) {
                        if ("[" + labelName + "]" == labels[j]) {
                            if (l == -1) { l = c; }
                            if (r == -1 && l < c) { r = c; }
                        }
                    }
                }
            }
            if (t < 0 && l < 0 && b < 0 && r < 0) {
                alert('获取单元格失败！');
            }
            return [t + 1, l + 1, b - 1, r - 1];
        }
    };
    thisC.opts = {
        search: function (p) {
            thisC.exec_report(p);
        },
        print: function () {
            thisC.CellObject.PrintPreview(true, thisC.CellObject.GetCurSheet());
        },
        exp: function () {
            $("#report").hide();
            exportBackup(thisC.CellObject);
            Ysh.CC2000.exportExcel(thisC.CellObject);
        },
        save: function () {
            //                if (confirm('如果保存数据会将上一次相同查询条件的数据覆盖掉，您确定要保存当前数据吗？')) {
            thisC.convertResult(thisC.storeData); //return false;
            if (thisC.storeData.length == 0) { alert('没有可保存的数据！'); return false; }
            $.ajax({
                url: thisC.url + "conn/ashx/BackUpCllHandler.ashx?postType=Process&filename=" + thisC.xmlfile + "",
                type: "post",
                cache: false,
                async: false,
                success: function (data) {
                    if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                        alert(data.msg);
                        return false;
                    }
                    var retValue = -9;
                    if (data.flag == "1") {
                        retValue = thisC.CellObject.UploadFile(thisC.url + "conn/ashx/BackUpCllHandler.ashx?postType=UpLoad&filename=" + data.file + "");
                    }
                    if (retValue != 1) {
                        alert('保存报表是发生了错误');
                        return false;
                    }
                    var postData = "[";
                    for (var i = 0; i < thisC.storeData.length; i++) {
                        postData += "{";
                        postData += "FieldName:'" + thisC.storeData[i][0] + "',";
                        postData += "Sheet:'" + thisC.storeData[i][1] + "',";
                        postData += "DataValue:[";
                        if (typeof (thisC.storeData[i][2]) == "object") {
                            for (var j = 0; j < thisC.storeData[i][2].length; j++) {
                                postData += "{Value:'" + thisC.storeData[i][2][j] + "'},";
                            }
                        }
                        else {
                            postData += "{Value:'" + thisC.storeData[i][2] + "'}";
                        }
                        postData = $.subString(postData, ',');
                        postData += "],";
                        postData += "SearchData:[";
                        for (var j = 0; j < thisC.searchData.length; j++) {
                            postData += "{ Id:'" + thisC.searchData[j][0] + "' ,Value:'" + thisC.searchData[j][1] + "'},";
                        }
                        postData = $.subString(postData, ',');
                        postData += "]";
                        postData += "},";
                    }
                    postData = $.subString(postData, ',');
                    postData += "]";
                    $.ajax({
                        url: thisC.handler,
                        data: { postType: 'SaveData', pFile: thisC.xmlfile, data: postData, pBackFileName: data.file },
                        type: "post",
                        cache: false,
                        success: function (d) {
                            if (typeof (d) != "undefined" && d != null && typeof (d.flag) != "undefined" && d.flag == '0') {
                                alert(d.msg);
                                return false;
                            }
                            alert(d.msg);
                            $("#btnSearch")[0].click();
                        },
                        error: function (d, status, e) {
                            //alert(e);
                            //alert(4);
                            alert(d.responseText);
                            return false;
                        }
                    });

                },
                error: function (data, status, e) {
                    //alert(e);
                    //alert(5);
                    alert(data.responseText);
                    return false;
                }
            });
        }
    };
    thisC.bindings = function () {
        $("#btnSearch").live('click', function () {
            thisC.storeData = [];
            thisC.searchData = [];
            var postData = "&postType=Search&pFile=" + thisC.xmlfile + "&pSearchType=0";
            for (var i = 0; i < thisC.searchObj.length; i++) {
                var sn = thisC.searchObj[i];
                var v = $.GetValueBySearch(sn.id, sn.type);
                postData += "&" + sn.id + "=" + v
                thisC.searchData.push([sn.id, v]);
            }
            thisC.opts.search(postData);
        });
        $("#btnDataInit").live('click', function () {
            thisC.storeData = [];
            thisC.searchData = [];
            var postData = "&postType=Search&pFile=" + thisC.xmlfile + "&pSearchType=1";
            for (var i = 0; i < thisC.searchObj.length; i++) {
                var sn = thisC.searchObj[i];
                var v = $.GetValueBySearch(sn.id, sn.type);
                postData += "&" + sn.id + "=" + v
                thisC.searchData.push([sn.id, v]);
            }
            thisC.opts.search(postData);
        })
        $("#btnPrint").live('click', function () {
            thisC.opts.print();
        });
        $("#btnExp").live('click', function () {
            thisC.opts.exp();
        });

        $("#Button1").live('click', function () {
            var startIndex = 0;
            var totalSheet = thisC.CellObject.GetTotalSheets();
            for (var s = 0; s < totalSheet; s++) {
                var rs = thisC.CellObject.GetRows(s); //行数
                var cs = thisC.CellObject.GetCols(s); //列数      
                for (var r = startIndex; r <= rs; r++) {
                    for (var c = startIndex; c <= cs; c++) {
                        var note = thisC.CellObject.GetCellNote(c, r, s);
                        thisC.CellObject.SetCellString(c, r, s, note);
                    }
                }
            }
        });

        $("#btnSaveData").live('click', function () {
            thisC.opts.save();
        });

        $("#btnExpEFile").live('click', function () {
            var postData = "pEFile=" + escape(thisC.efile) + "&pFile=" + thisC.xmlfile + "&pSearchType=1";
            for (var i = 0; i < thisC.searchObj.length; i++) {
                var sn = thisC.searchObj[i];
                var v = $.GetValueBySearch(sn.id, sn.type);
                postData += "&" + sn.id + "=" + v;
            }
            window.open('/EFileDown.aspx?' + postData);
        });
    };
    thisC.filterSheet = function (sheets) {
        var ss = [];
        for (var i = 0; i < sheets.length; i++) {
            var ishave = false;
            var sv = $.trim(sheets[i]);
            for (var j = 0; j < ss.length; j++) {
                if ($.trim(ss[j]) == $.trim(sv)) {
                    ishave = true;
                }
            }
            if (!ishave) {
                ss.push(sv);
            }
        }
        return ss;
    };
    thisC.getLabelType = function (labelId, s) {
        for (var i = 0; i < thisC.cellObj.length; i++) {
            if (labelId == thisC.cellObj[i][0] && s == thisC.cellObj[i][2]) {
                return thisC.cellObj[i][1];
            }
        }
        return "";
    };
    thisC.convertLabel = function () {
        var startIndex = 0;
        var totalSheet = thisC.CellObject.GetTotalSheets();
        for (var s = 0; s < totalSheet; s++) {
            var rs = thisC.CellObject.GetRows(s); //行数
            var cs = thisC.CellObject.GetCols(s); //列数      
            for (var r = startIndex; r <= rs; r++) {
                for (var c = startIndex; c <= cs; c++) {
                    var cellString = thisC.CellObject.GetCellString(c, r, s);
                    if ($.trim(cellString) != "") {
                        var re = /<<<(.*?)>>>/gi;
                        var cellStringAry = cellString.match(re);
                        var cellContent = "";
                        if (cellStringAry != null) {
                            var lbs = "";
                            for (var i = 0; i < cellStringAry.length; i++) {
                                var curPrev = cellStringAry[i].substring(0, 3);
                                var curEnd = cellStringAry[i].substring(cellStringAry[i].length - 3, cellStringAry[i].length);
                                if ("<<<" == curPrev && ">>>" == curEnd) {
                                    var content = cellStringAry[i].substring(cellStringAry[i].length - 3, 3);
                                    var contentSplit = content.split(",");
                                    lbs += "[" + contentSplit[0] + "]";
                                }
                            }
                            thisC.CellObject.SetCellNote(c, r, s, lbs);
                        }
                    }
                }
            }
        }
    };
    thisC.loadCellObj = function (template, CellObject, s) {
        var rs = CellObject.GetRows(s); //行数
        var cs = CellObject.GetCols(s); //列数   
        for (var r = 1; r <= rs; r++) {
            for (var c = 1; c <= cs; c++) {
                var cellString = CellObject.GetCellString(c, r, s);
                if ($.trim(cellString) != "") {
                    var re = /<<<(.*?)>>>/gi;
                    var cellStringAry = cellString.match(re);
                    var cellContent = "";
                    if (cellStringAry != null) {
                        for (var i = 0; i < cellStringAry.length; i++) {
                            var curPrev = cellStringAry[i].substring(0, 3);
                            var curEnd = cellStringAry[i].substring(cellStringAry[i].length - 3, cellStringAry[i].length);
                            if ("<<<" == curPrev && ">>>" == curEnd) {
                                var content = cellStringAry[i].substring(cellStringAry[i].length - 3, 3);
                                var contentSplit = content.split(",");
                                var idx = template.getFieldIndex(contentSplit[0]);
                                if (idx > -1) {
                                    var field = template.field(idx);
                                    thisC.cellObj.push([field._name, field._type, s, field.isInc(), field]); //LABEL,TYPE,SHEET, INC                                        
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    thisC.loadFile = function () {
        thisC.CellObject.OpenFile(thisC.url + thisC.cllfile, "");
        var totalSheet = thisC.CellObject.GetTotalSheets();
        for (var s = 0; s < totalSheet; s++) {
            var content = new C_FillContent();
            var template = content.loadTemplate(thisC.CellObject);
            thisC.loadCellObj(template, thisC.CellObject, s);
        }
        thisC.CellObject.CloseFile();
    };
}