function Scrollbar() {
    this.options = {
        data: [], //数据总数 
        table: null, //要操作的table
        pos: 0, //当前滚动位置 
        itemSize: 20, //单项尺寸 
        itemNum: 20, //每页可展示的数据数量
        mergeCol: [], //需要合并的列
        scrollStep: 1 //滚动单次条数
    };
}
Ysh.Script.include("/conn/jsfile/DateTimeCtrl.js");

Scrollbar.prototype = (function () {
    function setOptions(options) {
        for (var attr in options) { this.options[attr] = options[attr]; }
        if (!options["itemNum"])
            return;
        Refresh(this);
        this.initData(this.options.data, this.options.table);
    }
    function Refresh(_this) {
        if (!_this.created) return;
        //设置内容高度 
        var ch = _this.options.data.length * _this.options.itemSize; _this.content.style.height = ch + "px";
    }
    function isEnd(_this) {
        return (_this.bar.scrollTop + _this.bar.clientHeight >= _this.bar.scrollHeight);
    }
    //获取滚动位置 
    function getPos() { if (isEnd(this)) { return Math.max(this.options.data.length - this.options.itemNum, 0); }; var top = this.bar.scrollTop; var pos = parseInt(top / this.options.itemSize, 10); return pos; }
    //每页可展示的数据数量 
    function getPageItems() { return this.options.itemNum; }
    //滚动事件响应 
    function OnScroll(_this) {
        var pos = _this.getPos();
        pos = (pos % _this.options.scrollStep != 0 ? (pos + _this.options.scrollStep - 1) : pos);
        if (pos == _this.options.pos) return;
        _this.options.pos = pos;
        _this.onScroll(pos, _this.options.mergeCol);
    }

    //滚动条创建 
    function CreateAt(dom) {
        var _this = this;
        var bar = document.createElement("div");
        var content = document.createElement("div");
        bar.appendChild(content);
        bar.style.width = "19px";
        bar.style.height = "100%";
        bar.style.overflowY = "scroll";
        bar.style.overflowX = "hidden";
        if (bar.attachEvent) {
            bar.attachEvent("onscroll", function () { OnScroll(_this); });
        } else {//firefox兼容 
            bar.addEventListener("scroll", function () { OnScroll(_this); }, false);
        }
        content.style.backgroundColor = "white";
        content.style.width = "1px";
        this.bar = bar;
        this.content = content;
        if (typeof (dom) == "string") { dom = document.getElementById(dom); }
        dom.innerHTML = "";
        dom.appendChild(this.bar);
        this.created = true;
        Refresh(this);
    }
    return { setOptions: setOptions, CreateAt: CreateAt, getPos: getPos, getPageItems: getPageItems, initData: null, onScroll: null, //模拟滚动条事件
        SetTr: null, SetTd: null, SetBr: null, onBeforeScroll: null, signalPos: 0, canEdit: null
    };
})();

var YshScrollbar = new Scrollbar();
var Cols = createColsObject();
function createColsObject() {
    return {
        parse: function (row) {
            for (var c = 0; c < row.cells.length; c++) {
                var cell = row.cells[c];
                if ((cell.col != "") && (typeof cell.col != "undefined"))
                    this[cell.col] = c;
            }
        }
    };
}
var fInitTitle = function (tr) {
    Cols.parse(tr);
}

var bSaveChangeAttached = false;
YshScrollbar.fillStart = function () { }
YshScrollbar.Init = function (data, objScroll, table) {
    this.titleRows = table.rows.length;
    this.table = table;
    if (!bSaveChangeAttached) {
        Ysh.Web.Event.attachEvent(document.body, "onclick", function () {
            SaveChange("time");
        });
        bSaveChangeAttached = true;
    }
    table.onmousewheel = function () {
        YshScrollbar.bar.scrollTop = YshScrollbar.bar.scrollTop - event.wheelDelta;
        return false;
    };
    this.initData = function (data, table) {
        Ysh.Web.Table.clearRows(table, this.titleRows);
        this.fillStart();

        var n = this.getPageItems();

        this.tempTr = null;
        for (var i = 0; i < data.length && i < n; i++) {
            this.bindData(data, table, i, 0);
        }
    }
    fInitTitle(table.rows[this.titleRows - 1]);

    this._curPos = 0;
    this.refresh = function () {
        this.onScroll(this._curPos);
    }

    this.onScroll = function (pos) {
        if (this.onBeforeScroll)
            this.onBeforeScroll(table);
        this._curPos = pos;
        var n = this.getPageItems();

        if (pos + n > data.length) {//显示的范围不对，这样会导致最后行的内容实际上是以前遗留的，我们把pos往前移
            pos = Math.max(0, data.length - n);
        }
        var iEnd = Math.min(data.length, n, table.rows.length - 1); //有行被删除了

        Ysh.Web.Table.clearRows(table, this.titleRows);
        this.fillStart();
        this.tempTr = null;
        for (var i = 0; i < iEnd; i++) {
            this.bindData(data, table, i, pos);
        }
        for (var i = iEnd; i < data.length && i < n; i++) {
            Ysh.BindTable(data, table, i, this.SetTd, this.SetTr, this.SetBr);
        }
        if (this.onAfterScroll)
            this.onAfterScroll(table);
    }

    this.CreateAt(objScroll);
    //this.setOptions({ data: data, table: table, itemNum: 15, itemSize: 30 });
    this.setOptions({ data: data, table: table });
}
var selectOptionInfo = {
    arrSelectOption: {}, arrDialogHTML: {}
};
YshScrollbar.bindData = function (data, table, i, pos) {
    var row = table.insertRow();
    var bMerge = false;
    if ((this.tempTr == null || data[i + pos]["MainSignal"] == "" || (this.tempTr.cells[(this.options.mergeCol.length > 0 ? this.options.mergeCol[0] : 0)].innerText != data[i + pos]["MainSignal"]))) {
        this.tempTr = row;
        bMerge = true;
    }
    else {
        for (var j = 0; j < this.options.mergeCol.length; j++)
            this.tempTr.cells[this.options.mergeCol[j]].rowSpan = this.tempTr.cells[this.options.mergeCol[j]].rowSpan + 1;
    }
    var titleRow = table.rows[this.titleRows - 1];
    for (var r = 0; r < titleRow.cells.length; r++) {
        var tdTitle = titleRow.cells[r];
        var tdTitlePrev = null;
        if (r > 0)
            tdTitlePrev = titleRow.cells[r - 1];
        var col = tdTitle.col;
        var saveType = tdTitle.saveType;

        if (!bMerge && (this.options.mergeCol.indexOf(r) > -1))
            continue;
        var tc = document.createElement("TD");
        if (tdTitle.style.display == "none" && (tdTitlePrev == null || tdTitlePrev.colSpan == 1))
            tc.style.display = "none";
        if (col) {
            if (col == "INDEX")
                tc.innerText = i + pos + 1;
            else if (i + pos >= data.length)
                return;
            else {
                if (this.SetBr)
                    this.SetBr(tc, data[i + pos][col], col);
                else {
                    if (data[i + pos][col] == null) {
                        tc.innerHTML = "";
                    }
                    else {
                        tc.innerHTML = Ysh.getDBValue(data[i + pos][col]);
                    }
                }
            }
        }
        row.appendChild(tc);
        //根据表头saveType属性增加对应单元格的双击事件（对话框保存是调用doSave，其他调用SaveChange）
        if (typeof (saveType) == "undefined" || (this.canEdit && !this.canEdit(data, table, i, r, pos))) {
        }
        else {
            tablecols.parse(table.rows[0]);
            switch (saveType) {
                case "text":
                    tc.ondblclick = function () {
                        if (typeof (canModifySignal) == "function") {
                            if (!canModifySignal(Ysh.Web.getParent(tc, "TABLE").id, Ysh.Web.getParent(tc, "TR").cells[0].innerText)) {
                                alert("该信号已被其他流转中的流程修改。");
                                return;
                            }
                        }
                        this.record = this.innerText;
                        this.innerHTML = "<input id='dblText' type='text' style='width:" + this.clientWidth + "' value='" + this.innerHTML + "' onBlur='SaveChange(\"text\")' onkeypress='return CancelEnter();'>";
                        Ysh.Web.focusEnd(this.children[0]);
                    };
                    break;
                case "select":
                    var datanode = table.rows[0].cells[r].data;

                    tc.ondblclick = function (node) {
                        this.record = this.innerText
                        return function () {
                            if (typeof (canModifySignal) == "function") {
                                if (!canModifySignal(Ysh.Web.getParent(tc, "TABLE").id, Ysh.Web.getParent(tc, "TR").cells[0].innerText)) {
                                    alert("该信号已被其他流转中的流程修改。");
                                    return;
                                }
                            }
                            var option = "";
                            option = selectOptionInfo.arrSelectOption[node];
                            var tempvalue = event.srcElement.innerHTML;
                            if (typeof (option) == "undefined") {
                                option = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DbAssist.GetDataListEx", ["SelectSql.xml", node], "获取可编辑下拉列表", true) });
                                if (option.check("获取可编辑下拉列表", true)) {
                                    option = option.value;
                                }
                                selectOptionInfo.arrSelectOption[node] = option;
                            }
                            var htmlFix = "<select id='dblSelect' style='width:" + this.clientWidth + "' onblur='SaveChange(\"select\");'>";
                            for (var i = 0; i < option.length; i++) {
                                htmlFix += "<option value ='" + option[i][0] + "'>" + option[i][1] + "</option>";
                            }
                            htmlFix += "</select>";
                            this.innerHTML = htmlFix;
                            Ysh.Web.Select.setSelectedByText(document.getElementById("dblSelect"), tempvalue);
                            document.getElementById("dblSelect").focus();
                        }
                    } (datanode);
                    break;
                case "dialog":
                    var datanode = table.rows[0].cells[r].data;
                    tc.ondblclick = function (node) {
                        this.record = this.innerText
                        return function () {
                            if (typeof (canModifySignal) == "function") {
                                if (!canModifySignal(Ysh.Web.getParent(tc, "TABLE").id, Ysh.Web.getParent(tc, "TR").cells[0].innerText)) {
                                    alert("该信号已被其他流转中的流程修改。");
                                    return;
                                }
                            }
                            var content = "";
                            content = selectOptionInfo.arrDialogHTML[node];
                            var temptc = event.srcElement;
                            if (typeof (content) == "undefined") {
                                content = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.ClickScrollBar.GetDialogHTML", [node], "获取弹窗内容", true) });
                                if (content.check("获取对话框模版", true)) {
                                    content = content.value;
                                }
                                selectOptionInfo.arrDialogHTML[node] = content;
                            }
                            Ysh.Web.dialog("信号修改", content, function () { return doSave(temptc) }, "200px", "50px");
                            LoadDialogInScrollBar(this);
                        }
                    } (datanode);
                    break;
                case "time":
                    tc.ondblclick = function () {
                        if (typeof (canModifySignal) == "function") {
                            if (!canModifySignal(Ysh.Web.getParent(tc, "TABLE").id, Ysh.Web.getParent(tc, "TR").cells[0].innerText)) {
                                alert("该信号已被其他流转中的流程修改。");
                                return;
                            }
                        }
                        var disstyle = Ysh.Web.getParent(this, "TABLE").rows[0].cells(this.cellIndex + 1).data;
                        this.innerHTML = show_input_datetime_base("dbltime", this.innerHTML, 2, disstyle, false, true);
                        if (typeof timePicker == 'function')
                            timePicker("#" + "dbltime", disstyle);
                        Ysh.Web.focusEnd(this.children[1].children[1]);

                        this.onclick = function () {
                            event.cancelBubble = true;
                            return false;
                        }
                    };
                    break;
                default:
                    break;
            }
        }
        if (this.SetTd)
            this.SetTd(tc, r);
    }
    this.signalPos = pos ? pos : 0;
    if (this.SetTr)
        this.SetTr(row, i, data[i + pos], pos);
}

function SaveChange(type) {
    var saveValue;
    var tc = event.srcElement.parentElement;
    switch (type) {
        case "text":
            saveValue = event.srcElement.value;
            break;
        case "select":
            saveValue = Ysh.Web.Select.getSelectedValue(document.getElementById("dblSelect"));
            break;
        case "dialog":

            break;
        case "time":
            if (document.getElementById("dbltime") == null) {
                return false;
            }
            tc = Ysh.Web.getParent(document.getElementById("dbltime"), "TD");
            saveValue = document.getElementById("dbltime").value;
            break;
        default:
            break;
    }

    if (saveValue != tc.record) {
        var tr = Ysh.Web.getParent(tc, "TR");
        var table = Ysh.Web.getParent(tr, "TABLE");
        var sigid = tr.cells[0].innerText;
        var colname = table.rows[0].cells(tc.cellIndex + 1).col; //第一列是隐藏列的情况
        var obj = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.ClickScrollBar.UpdateSingleColumn", [table.id, sigid, colname, saveValue, itemid]); });
        if (obj.check("修改数据", true)) {
            if (obj.value == true) {
                var o = {};
                if (type != "select") {
                    tc.innerHTML = saveValue;
                    o[colname] = saveValue;
                }
                else {
                    var tempValue = Ysh.Web.Select.getSelectedText(document.getElementById("dblSelect"));
                    tc.innerHTML = tempValue;
                    o[colname] = tempValue;
                }
                updateSignalDataPlus(YshScrollbar.options.data, YshScrollbar.signalPos, YshScrollbar.options.itemNum, sigid, o);
            }
            else {
                alert("该值无法修改！");
                tc.innerHTML = tc.record == undefined ? "" : tc.record;
            }
        }
        else {
            tc.innerHTML = tc.record;
        }
    }
    else {
        tc.innerHTML = tc.record;
    }
    //当修改一个数据列同时修改关联列时调用，例如告警分级和告警分级描述，修改一个另一个跟着变化
    if (typeof ChangeRelationData == "function")
        ChangeRelationData(table, tr, tc, colname, sigid);
}
YshScrollbar.bindToCell = function (cellctrl, data, table) {
    CB_BindTable(cellctrl, table);
    if (data.length == 0)
        return;
    var s = cellctrl.GetCurSheet();
    var rows = cellctrl.GetRows(s);
    cellctrl.SetRows(rows + data.length, s);
    var cols = cellctrl.GetCols(s);
    var titlerow = table.rows[0];
    for (var r = 0; r < data.length; r++) {
        for (var c = 1; c < cols; c++) {
            var col = titlerow.cells[c - 1].col;
            if (col == "INDEX")
                cellctrl.S(c, rows + r, s, r + 1);
            else
                cellctrl.S(c, rows + r, s, data[r][col]);
        }
    }
}
function updateSignalDataPlus(arr, iStart, iLenght, id, attr) {
    var iIndex = getSignalDataIndexPlus(arr, iStart, iLenght, id);
    if (iIndex < 0)
        return false;
    for (var p in attr)
        arr[iIndex][p] = attr[p];
}
function getSignalDataIndexPlus(arr, iStart, iLength, id) {
    if (!arr)
        return -1;
    var iEnd = Math.min(iStart + iLength, arr.length - 1);
    for (var i = iStart; i <= iEnd; i++) {
        if (arr[i].SignalID == id)
            return i;
    }
    return -1;
}
function CancelEnter() {
    if (event.keyCode == 13) {
        return false;
    }
}