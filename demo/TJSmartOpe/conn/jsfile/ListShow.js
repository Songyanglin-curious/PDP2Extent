function ListShow() {
    this.ctrl = null; //对象本身
    this.conditions = ""; //传入条件
    this.pageIndex = 1; //当前页
    this.dataCount = ""; //数据条数
    this.returnSelect = new Array(); //保存选中内容
    this.cellctrl = null; //cell对象
    this.tblobj = null; //表
    this.filename = ""; //对应xml文件名
    this.filepath = ""; //对应cell的路径
    this.ifPage = "false"; //是否分页
    this.pageNum = 0; //每页个数
    this.ifSort = "false"; //是否排序
    this.selectType = "0"; //选择类型 0-不选，1-单选，2-多选
    this.trEvent = ""; //行事件
    this.buttonHTML = ""; //每行后面按钮HTML
    this.divPage = null; //分页内容所在区域
    this.extra = ""; //附加sql
    this.pageEvent = ""; //翻页执行的函数
    this.titleFixed = "false"; //是否固定表头 add by wangbinbin 20140211
    this.titleRows = 0;//表头行数
    this.data = null;
    //add by jjw//
    this.cbfilter = "";
    //add by gud//
    this.fResetLink = null;
    this.bindobj = CBT.defbind; //add by gud 20120923
    this.bindobj.Skip = function (id) { return id === ""; } //Add by gud 20121023
    var rootcall = this;
    this.colCheckBox = 0;
    this.template = null;

    this.BindCell = function (lstCondition, lstPage, pageIndex, returnSelect, flowConditions) {
        //alert(this == this.ctrl);
        rp = new ReportPrintObj();
        rp.cellctrl = this.cellctrl;
        rp.filename = this.filepath;
        rp.tblobj = this.tblobj;
        var ctrl = this.ctrl;
        var ifSort = this.ifSort;
        var xmlname = this.filename;
        var selectType = this.selectType;
        var trEvent = this.trEvent;
        var data = this.data;
        rp.fillContent = function (content) {
            if (data == null) {
                var v = ExecuteBack(function () {
                    return ctrl.returnValue(xmlname, lstCondition, lstPage, flowConditions, 0);
                });
                if (v.check("查询", true))
                    eval(v.value);
            }
            else
                eval(data);
        }
        rp.bindTable = function (pageIndex, returnSelect, template) {
            rootcall.template = template;
            //modify by gud 20120923
            rootcall.bindobj.rSpan = this.rect.rm;
            ctrl.titleRows = this.rect.r0 - 1;
            rootcall.bindobj.Bind(this.cellctrl, this.rect.r0 - 1, this.tblobj, this.rect.c0, this.rect.c1 + 1, function (tr, id) {
                var arrEvent = trEvent.split("#@#");
                for (var e = 0; e < arrEvent.length; e++) {
                    if (arrEvent[e] != "") {
                        var arrStr = arrEvent[e].split("**");
                        var str = "";
                        for (var s = 0; s < arrStr.length; s++) {
                            if (arrStr[s] != "") {
                                if (arrStr[s] != "id")
                                    str += arrStr[s];
                                else {
                                    str += id;
                                }
                            }
                        }
                        eval(str);
                    }
                }
            }, "rp.sort", rootcall.fResetLink);
            if (ctrl != undefined) {
                ctrl.SelectType(pageIndex, returnSelect, template, this.rect.r0 - 1);
                ctrl.FixTitle();
            }
        }
        rp.fillFinished = function (template) {
            //id必须是第一列，根据id对应的内容来找表头列
            var idField = template.field(template.getFieldIndex("id"));
            this.rect = idField._rects[0];
            this.bindTable(pageIndex, returnSelect, template);
        }
        rp.sort = function (td) {
            if (ifSort == "false")
                return false;
            var c = td.cellIndex;
            if (selectType == "1" || selectType == "2") {
                c = c - 1;
                var table = this.tblobj;
                var alreadyChecked = "";
                for (var i = 1; i < table.rows.length; i++) {
                    if (table.rows[i].cells[0].children[0].checked) {
                        if (table.rows[i].cells[table.rows[i].cells.length - 1].children[0])
                            alreadyChecked += table.rows[i].cells[table.rows[i].cells.length - 2].innerText + ",";
                        else
                            alreadyChecked += table.rows[i].cells[table.rows[i].cells.length - 1].innerText + ",";
                    }
                }
            }
            if (this.sortcol == c)
                this.sortorder = 1 - this.sortorder;
            else {
                this.sortcol = c;
                this.sortorder = 1;
            }
            this.cellctrl.SortCol(this.sortorder, this.rect.c1 + c, 1, this.rect.r0, this.cellctrl.GetCols(this.cellctrl.GetCurSheet()) - 1, this.rect.r1);
            this.bindTable(alreadyChecked);
        }
        rp.doFill(rp.cellctrl);
    }
    /*modify by jjw,添加根据数据默认勾选复选框/单选框的功能*/
    /*modify by gud 20130423,加入titlerows参数，有的标题不止一行*/
    this.SelectType = function (pageIndex, returnSelect, template, titlerows) {
        var table = this.tblobj;
        if (table.rows.length <= 1)
            return false;
        if ((this.selectType == "0" || (this.selectType != "1" && this.selectType != "2")) && this.buttonHTML == "")
            return false;
        else {
            //标题加一列
            if (this.selectType == "1" || this.selectType == "2") {
                //var tc = table.rows[0].insertCell(1 + this.colCheckBox);
                var trT = table.rows[0];
                var tc = document.createElement("TD");
                trT.insertBefore(tc, trT.cells[this.colCheckBox]);
                tc.className = "sTitle";
                if (this.selectType == "1")
                    tc.innerText = "选择";
                else if (this.selectType == "2")
                    tc.innerHTML = "<input type=\"checkbox\" value=\"\" onclick=\"" + this.ctrl.id + ".SelectAll()\" >";
                tc.style.textAlign = "center";
                tc.style.width = "3%";
                tc.rowSpan = titlerows;
            }
            if (this.buttonHTML != "") {
                tc = table.rows[0].insertCell(table.rows[0].cells.length - 1);
                tc.className = "sTitle";
                tc.innerText = "操作";
                tc.style.textAlign = "center";
                tc.style.width = "8%";
                tc.rowSpan = titlerows;
            }
            //找出被选中的ID的行
            var alreadyChecked = new Array;
            if ((pageIndex == undefined && returnSelect == undefined) || (returnSelect != undefined && returnSelect.length == 0))
                alreadyChecked = [];
            else if (pageIndex != undefined && returnSelect == undefined) {//排序传进来的已选中项目
                var alreadyChecked = pageIndex.split(",");
            }
            //            else {
            //                for (var i = 0; i < returnSelect.length; i++) {
            //                    if (returnSelect[i].id == pageIndex)
            //                        alreadyChecked = returnSelect[i].value;
            //                }
            //            }
            if (this.checkedID != undefined) {
                var alreadyChecked = this.checkedID.split(",");
            }
            //内容加一列
            var bSelectAll = false;
            if (this.selectType == "2")
                bSelectAll = true;
            var colNeedDec = -1;
            for (var i = titlerows; i < table.rows.length; i += this.bindobj.rSpan) {
                var tr = table.rows[i];
                var trclassName = (tr.rowIndex % 2 == 1 ? "trFirst" : "trSecond");
                if (this.selectType == "1" || this.selectType == "2") {
                    tc = document.createElement("TD");
                    // tr.insertCell(this.colCheckBox);
                    tr.insertBefore(tc, tr.cells[this.colCheckBox]);
                    tc.rowSpan = this.bindobj.rSpan;
                    if ((this.colCheckBox == 0) || Ysh.Web.Table.isLastVisible(tr,tc))
                    tc.colSpan = 2;
                    tc.className = "tbCellboth " + trclassName;
                    tc.style.textAlign = "center";
                    tc.style.width = "3%";
                    var rowid = tr.cells[tr.cells.length - 1].innerText;
                    var isChecked = "false";
                    for (var r = 0; r < alreadyChecked.length; r++) {
                        if (rowid == alreadyChecked[r])
                            isChecked = "true";
                        if (isChecked == "true")
                            break;
                    }
                    if (this.selectType == "1")
                        tc.innerHTML = "<input type=\"radio\" name=\"" + this.id + "rdUser\" value=\"" + tr.cells[tr.cells.length - 1].innerText + "\">";
                    else if (this.selectType == "2") {
                        var thisitem = tr.cells[tr.cells.length - 1].innerText;
                        tc.innerHTML = "<input type=\"checkbox\" value=\"" + thisitem + "\" onclick=\"" + this.ctrl.id + ".ItemSelected('" + thisitem + "',this.checked);\">";
                        bSelectAll = bSelectAll && (isChecked == "true");
                    } //Modify by gud 20121014
                    if (isChecked == "true")
                        tc.children[0].checked = true;
                    if (this.colCheckBox == 0)
                        tr.cells[1].colSpan--;
                    if ((colNeedDec == -1) && (this.colCheckBox > 0)) {
                        colNeedDec = -2;
                        var rowContent = tr;
                        var cTotal = 0;
                        for (var c = 0; c < rowContent.cells.length; c++) {
                            var colSpan = rowContent.cells[c].colSpan;
                            if (!colSpan) {
                                cTotal++;
                            } else {
                                cTotal += parseInt(colSpan, 10);
                            }
                            if (cTotal == this.colCheckBox + 1)
                                break;
                            if (cTotal > this.colCheckBox + 1) {
                                colNeedDec = c;
                                break;
                            }
                        }
                    }
                    if (colNeedDec >= 0)
                        tr.cells[colNeedDec].colSpan--;
                    /*add by jjw*/
                    if (template != undefined && this.cbfilter.split("@@").length >= 3) {
                        var filterField = this.cbfilter.split("@@")[0];
                        var compare = this.cbfilter.split("@@")[1];
                        if (compare == "=")
                            compare = "==";
                        var cvalue = this.cbfilter.split("@@")[2];
                        if (template.getFieldIndex(filterField) > 0) {
                            var idField = template.field(template.getFieldIndex("id"));
                            var fltField = template.field(template.getFieldIndex(filterField));
                            // template.field(template.getFieldIndex("id"))._value[i - 1].toString()
                            for (var m = 0; m < idField._value.length; m++) {
                                if (tr.cells[tr.cells.length - 2].innerText == idField._value[m].toString()) {
                                    if (eval("'" + fltField._value[m] + "'" + compare + "'" + cvalue + "'")) {
                                        tr.children[this.colCheckBox].children[0].checked = true;
                                        tr.children[this.colCheckBox].children[0].disabled = true;
                                    }
                                }
                            }
                        }
                    }
                    /*add end*/
                }
                if (this.buttonHTML != "") {
                    tc = tr.insertCell(tr.cells.length - 1);
                    tc.rowSpan = this.bindobj.rSpan;
                    tc.colSpan = 2;
                    tc.className = "tbCellboth " + trclassName;
                    tc.style.textAlign = "center";
                    tc.style.width = "8%";
                    var arrStr = this.buttonHTML.split("**");
                    var str = "";
                    for (var s = 0; s < arrStr.length; s++) {
                        if (arrStr[s] != "") {
                            if (arrStr[s] != "id")
                                str += arrStr[s];
                            else {
                                str += tr.cells[tr.cells.length - 2].innerText;
                            }
                        }
                    }
                    tc.innerHTML = str;
                    var lastCell = tr.cells.length - 3; //最后一个用于显示的td
                    while (tr.cells[lastCell].style.display == "none")
                        lastCell--;
                    if (tr.cells[lastCell].colSpan > 1)
                        tr.cells[lastCell].colSpan--;
                }
            }
            if (bSelectAll)
                table.rows[0].cells[1 + this.colCheckBox].children[0].checked = true;
        }
    }
    this.SetConditions = function (v, db, extra) {
        this.conditions = v;
        this.flowConditions = "";
        this.db = db;
        this.extra = extra;
        this.data = null;
        if (this.ifPage == "true") {
            var dataCount = this.returnValue(this.filename, v, [{ "id": "start", "value": [0] }, { "id": "length", "value": [this.pageNum]}], undefined, 1);
            this.dataCount = dataCount;
            this.Page(1, this.pageNum, dataCount, 1);
        }
        else
            this.BindCell(v);
    }
    this.SetFlowConditions = function (v, fv, db, extra) {
        this.extra = extra;
        this.db = db;
        this.conditions = v;
        this.flowConditions = fv;
        this.data = null;
        if (this.ifPage == "true") {
            var dataCount = this.returnValue(this.filename, v, [{ "id": "start", "value": [0] }, { "id": "length", "value": [this.pageNum]}], fv, 1);
            this.dataCount = dataCount;
            this.Page(1, this.pageNum, dataCount, 1);
        }
        else
            this.BindCell(v, undefined, undefined, undefined, fv);
    }

    this.SetAllConditions = function (arr) {
        //[{ "listshow": listshow1, "args": [v, fv, db, extra]}, { "listshow": listshow2, "args": args2} ]
        var arrArgs = [];
        for (var i = 0; i < arr.length; i++) {
            var oListShow = arr[i]["listshow"];
            if (!oListShow)
                continue;
            var args = arr[i]["args"];
            oListShow.conditions = this.getArrayValue(args, 0);
            oListShow.flowConditions = this.getArrayValue(args, 1);
            oListShow.db = this.getArrayValue(args, 2);
            oListShow.extra = this.getArrayValue(args, 3);
            oListShow.data = null;
            var lstPage;
            if (oListShow.ifPage == "true")
                lstPage = [{ "id": "start", "value": [0] }, { "id": "length", "value": [this.pageNum] }];
            arrArgs.push([oListShow.filename, oListShow.conditions, lstPage, oListShow.flowConditions, oListShow.extra, oListShow.db, oListShow.IsUseHTML]);
        }
        if (arrArgs.length == 0)
            return false;
        var arrData = this.returnAllValue(arrArgs);
        if (!arrData)
            return false;
        arrData = arrData.value;
        for (var i = 0; i < arr.length; i++) {
            var oListShow = arr[i]["listshow"];
            if (!oListShow)
                continue;
            var data = this.getArrayValue(arrData, i);
            if (!data)
                continue;
            if (!data[0])
                continue;
            data = data[1].split("@@@@");
            oListShow.data = data[0];
            if (oListShow.ifPage == "true") {
                oListShow.dataCount = data[1];
                oListShow.Page(1, oListShow.pageNum, oListShow.dataCount, 1);
            }
            else {                
                oListShow.BindCell(oListShow.conditions, undefined, undefined, undefined, oListShow.flowConditions);
            }
        }
    }
    this.SetCheckedID = function (returnSelect) {
        var arrCheckedID = [];
        for (var i = 0; i < returnSelect.length; i++) {
            var itemValue = returnSelect[i].value;
            for (var j = 0; j < itemValue.length; j++) {
                arrCheckedID.push(Ysh.Array.getLast(itemValue[j]));
            }
        }
        return arrCheckedID.join(",");
    }

    this.Page = function (pageIndex, pageCount, dataCount, toPageIndex) {
        toPageIndex = toPageIndex ? toPageIndex : 1;
        pageCount = (pageCount && pageCount > 0) ? pageCount : 10;
        var pageTotal = Math.ceil(dataCount / pageCount);
        if (toPageIndex < 1) toPageIndex = 1;
        if (toPageIndex > pageTotal) toPageIndex = pageTotal;
        //找到本页选中的项
        if (this.selectType == "2" || this.selectType == "1") {
            this.returnSelect = GetCheckedData(this.tblobj, this.selectType, this.returnSelect, pageIndex, this.colCheckBox, this.bindobj.rSpan);
        }
        if (this.returnSelect != undefined && this.returnSelect.length != 0)
            this.checkedID = this.SetCheckedID(this.returnSelect);
        if (this.pageEventBefore != "")//翻页前执行
            eval(this.pageEventBefore);
        this.pageIndex = toPageIndex;
        var divPage = this.divPage;
        this.BindCell(this.conditions == "" ? undefined : this.conditions, [{ "id": "start", "value": [pageCount * ((toPageIndex == 0 ? 1 : toPageIndex) - 1)] }, { "id": "length", "value": [pageCount]}], this.pageIndex, this.returnSelect, this.flowConditions == "" ? undefined : this.flowConditions)
        this.data = null;
        if (pageTotal > 1) {
            divPage.innerHTML = "<a id=" + this.ctrl.id + "firstpage onmouseover=\"this.style.cursor='hand'\">首页</a>&nbsp;<a id=" + this.ctrl.id + "prepage onmouseover=\"this.style.cursor='hand'\">上一页</a>&nbsp;"
                        + "<a id=" + this.ctrl.id + "nextpage onmouseover=\"this.style.cursor='hand'\">下一页</a>&nbsp;<a id=" + this.ctrl.id + "lastpage onmouseover=\"this.style.cursor='hand'\">尾页</a>&nbsp;"
                        + "页次：<font color=red><b>" + this.pageIndex + "</b></font>/<b>" + pageTotal + "</b>页&nbsp;共<b>" + dataCount
                        + "</b>条记录&nbsp;<b>" + pageCount + "</b>条/页 <a onmouseover=\"this.style.cursor='hand'\" id=" + this.ctrl.id + "gotopage><font color=blue>转到</font></a> 第<input id=" + this.ctrl.id + "num type='text' value='" + this.pageIndex + "' style='width:30px'/>页";

            document.getElementById(this.ctrl.id + "firstpage").disabled = this.pageIndex == 1;
            document.getElementById(this.ctrl.id + "prepage").disabled = this.pageIndex == 1;
            document.getElementById(this.ctrl.id + "nextpage").disabled = this.pageIndex == pageTotal;
            document.getElementById(this.ctrl.id + "lastpage").disabled = this.pageIndex == pageTotal;
            var ctrl = this.ctrl;
            if (this.pageIndex != 1) {
                document.getElementById(this.ctrl.id + "firstpage").attachEvent("onclick", function () { ctrl.Page(toPageIndex, pageCount, dataCount, 1); });
                document.getElementById(this.ctrl.id + "prepage").attachEvent("onclick", function () { ctrl.Page(toPageIndex, pageCount, dataCount, parseInt(toPageIndex) - 1); });
            }
            if (this.pageIndex != pageTotal) {
                document.getElementById(this.ctrl.id + "nextpage").attachEvent("onclick", function () { ctrl.Page(toPageIndex, pageCount, dataCount, parseInt(toPageIndex) + 1); });
                document.getElementById(this.ctrl.id + "lastpage").attachEvent("onclick", function () { ctrl.Page(toPageIndex, pageCount, dataCount, pageTotal); });
            }
            document.getElementById(this.ctrl.id + "gotopage").attachEvent("onclick", function () { ctrl.Page(toPageIndex, pageCount, dataCount, document.getElementById(ctrl.id + "num").value); });
            document.getElementById(this.ctrl.id + "num").attachEvent("onkeypress", function () {
                if (event.keyCode == 13)
                    document.getElementById(ctrl.id + "gotopage").click();
            });
        }
        else
            divPage.innerHTML = "";
        if (this.pageEventAfter != "")//翻页后执行
            eval(this.pageEventAfter);
    }
    this.SelectAll = function () {
        var table = this.tblobj;
        var bSelected = event.srcElement.checked; //Modify by gud 20121014
        for (var i = 1; i < table.rows.length; i++) {
            var cb = table.rows[i].cells[this.colCheckBox].children[0];
            if (cb && !cb.disabled)
                cb.checked = bSelected;
        }
        this.AllSelected(bSelected); //Add by gud 20121014
    }
    //Add by gud 20121014
    this.AllSelected = function (bSelected) {
    }
    this.ItemSelected = function (itemid, bSelected) {
    }
    //Add end
    this.GetReturnValue = function (v) {
        var table = this.tblobj;
        var reVal = new Array();
        this.returnSelect = GetCheckedData(table, this.selectType, this.returnSelect, this.pageIndex, this.colCheckBox, this.bindobj.rSpan);
        if (this.selectType == "0" || (this.selectType != "1" && this.selectType != "2") || table.rows.length <= 1)
            return reVal;
        var arrReturnIndex = new Array();
        if (v != undefined && v != "") {
            var arrReturnStr = v.split("**");
            for (var i = 0; i < arrReturnStr.length; i++) {
                if (arrReturnStr[i] != "") {
                    var bFlag = "false";
                    for (var j = 0; j < table.rows[0].cells.length; j++) {
                        if (table.rows[0].cells[j].innerText == arrReturnStr[i]) {
                            arrReturnIndex.push(j - 1);
                            bFlag = "true";
                            break;
                        }
                    }
                    if (bFlag == "false")
                        arrReturnIndex.push(arrReturnStr[i]);
                }
            }
        }
        if (arrReturnIndex.length == 0)
            arrReturnIndex.push("id");
        for (var i = 0; i < this.returnSelect.length; i++) {
            for (var x = 0; x < this.returnSelect[i].value.length; x++) {
                var strReturn = "";
                for (var j = 0; j < arrReturnIndex.length; j++) {
                    if (!isNaN(arrReturnIndex[j])) {
                        if (arrReturnIndex[j] < this.colCheckBox)
                            strReturn += this.returnSelect[i].value[x][arrReturnIndex[j]];
                        else
                            strReturn += this.returnSelect[i].value[x][arrReturnIndex[j] - 1]; //选择框之后的列要错一位，之前的不用错位,2015-01-27 by gud
                    }
                    else if (arrReturnIndex[j] == "id") {
                        strReturn += Ysh.Array.getLast(this.returnSelect[i].value[x]);
                    }
                    else
                        strReturn += arrReturnIndex[j];
                }
                reVal.push(strReturn);
                if (this.selectType == "1")
                    break;
            }
        }
        return reVal;
    }
    //add by wangbinbin 20140211 固定表头
    this.FixTitle = function () {
        if (this.titleFixed != "true")
            return;
        for (var i = 0; i < this.titleRows; i++) {
            for (var j = 0; j < this.tblobj.rows[i].cells.length; j++) {
                var td = this.tblobj.rows[i].cells[j];
                if (td.className)
                    td.className += " tdFixed" + this.id;
                else
                    td.className = "tdFixed" + this.id;
            }
        }
    }
    //add end
    this.GetFieldIndex = function (fieldid) {
        if (fieldid == "id") //id固定在最后一列
            return this.tblobj.rows[0].cells.length - 2; //标题行多了两个图片列
        var col = this.template.field(this.template.getFieldIndex(fieldid))._rects[0].c0;
        var col = col - 2;//cell从1开始排，而且id列是没有的
        return ((col < this.colCheckBox)||(this.selectType == "0")) ? col : col + 1;
    }
    this.GetFieldName = function (colindex) {
        if (typeof this.fields == "undefined")
            this.fields = {};
        if (typeof this.fields[colindex] != "undefined")
            return this.fields[colindex];
        for (var i = 0; i < this.template.getFieldCount(); i++) {
            var field = this.template.field(i);
            var col = field._rects[0].c0 - 2;
            col = ((col < this.colCheckBox) || (this.selectType == "0")) ? col : col + 1;
            if (col == colindex) {
                this.fields[colindex] = field._name;
                return field._name;
            }
        }
        return "";
    }
}

ListShow.prototype.getArrayValue = function (arr, index) {
    if (!arr || arr.length <= index)
        return "";
    return arr[index];
}

function GetCheckedData(tbl, selectType, returnSelect, pageIndex, colIndex, rSpan, rStart) {
    if (typeof rSpan == "undefined")
        rSpan = 1;
    if (typeof rStart == "undefined")
        rStart = 1;
    var arrData = new Array();
    for (var i = rStart; i < tbl.rows.length; i += rSpan) {
        var row = tbl.rows[i];
        var td = row.cells[colIndex];
        if (td.children.length == 0)
            continue;
        if (td.children[0].checked && !td.children[0].disabled) {
            var strReturn = new Array();
            if (row.cells[row.cells.length - 1].children[0]) {
                for (var j = 0; j < row.cells.length - 1; j++) {
                    if (j != colIndex)
                        strReturn.push(row.cells[j].innerText);
                }
            }
            else {
                for (var j = 0; j < row.cells.length; j++) {
                    if (j != colIndex)
                        strReturn.push(row.cells[j].innerText);
                }
            }
            arrData.push(strReturn);
            if (selectType == "1")
                break;
        }
    }
    if (returnSelect.length != 0) {
        var bflag = "false";
        for (var i = 0; i < returnSelect.length; i++) {
            if (returnSelect[i].id == pageIndex) {
                returnSelect[i].value = arrData;
                bflag = "true";
                break;
            }
        }
        if (bflag == "false") {
            if (selectType == "1" && arrData.length != 0)
                returnSelect.length = 0;
            if ((selectType == "1" && arrData.length != 0) || selectType == "2")
                returnSelect.push({ "id": pageIndex, "value": arrData });
        }
    }
    else {
        if (selectType == "1" && arrData.length != 0)
            returnSelect.length = 0;
        if ((selectType == "1" && arrData.length != 0) || selectType == "2")
            returnSelect.push({ "id": pageIndex, "value": arrData });
    }
    return returnSelect;
}
