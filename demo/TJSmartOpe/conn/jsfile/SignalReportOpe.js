var yxCols = createColsObject();
var ycCols = createColsObject();
var ykCols = createColsObject();
var gjCols = createColsObject();
var yshSignalTitle = null, yshScrollMainDiv = null, tdScroll = null;
var isShowSH = false;
var iNum;
var signalPos;
var signalData = { YX: [], YK: [], YC: [], GJ: [], YXCheck: [], YCCheck: [], YKCheck: [], GJCheck: [], AVCCheck: [] };

function canEditSignal() { return privs.bOpinion || privs.bPoint || privs.bRemark || privs.bSignalEdit; }

function createColsObject() {
    return { parse: function (row) {
        for (var c = 0; c < row.cells.length; c++) {
            var cell = row.cells[c];
            if ((cell.col != "") && (typeof cell.col != "undefined"))
                this[cell.col] = c;
        }
    }
    };
}

function initialYXTable(dll, args, div, node) {
    var fInitTitle = function (tr) {
        yxCols.parse(tr);
        if (!canEditSignal())
            tr.lastChild.style.display = "none";
    }
    initialScrollTable(dll, args, node, "获取遥信信号", div, null, "YX", fInitTitle);
}

function initialYKTable(dll, args, div) {
    var fInitTitle = function (tr) {
        ykCols.parse(tr);
        if (!canEditSignal())
            tr.lastChild.style.display = "none";
    }
    initialScrollTable(dll, args, "SignalReport/YKSignal", "获取遥控数据", div, null, "YK", fInitTitle);
}

function initialYCTable(dll, args, div, node) {
    var fInitTitle = function (tr) {
        ycCols.parse(tr);
        if (!canEditSignal())
            tr.lastChild.style.display = "none";
    }
    initialScrollTable(dll, args, node, "获取遥测数据", div, null, "YC", fInitTitle);
}

function initialGJTable(dll, args, div) {
    var fInitTitle = function (tr) {
        gjCols.parse(tr);
        if (!canEditSignal())
            tr.lastChild.style.display = "none";
    }
    initialScrollTable(dll, args, "SignalReport/GJSignal", "获取告警直传数据", div, null, "GJ", fInitTitle);
}
function SetEditHTML(tr, cellIndex, fSave, fDel) {
    /*if (canEditSignal() && !IsOnline) {
        tr.cells[cellIndex].innerHTML = "<a style='color:#6E9AC5;cursor:pointer' onclick='" + fSave + "'>保存</a>"; //<span style='width:6px'></span><a style='color:#6E9AC5;cursor:pointer' onclick='" + fDel + "'>删除</a>";
    }
    else {*/
        YshScrollbar.table.rows[0].cells[cellIndex].style.display = "none";
        tr.cells[cellIndex].style.display = "none";
    //}
}
function setColEditState(tc, col, fSave) {
    tc.innerHTML = "<input type='text' style='width:99%;border-bottom:solid 0px black;border-left:solid 0px black;border-right:solid 0px black;border-top:solid 0px black;' value='" + tc.innerText + "' col='" + col + "' " + (fSave ? "onpropertychange='if(this.unsave!=1)this.unsave=1;' onchange='" + fSave + "'" : "") + "/>";
}

function setColSelectEdit(tc, col, bEdit, fSave) {
    var sel = $("<select col=" + col + " style='width:100%' onchange='" + fSave + "'><option value=-1></option><option value=1>√</option><option value=0>×</option></select>");
    sel.val(tc.innerText);
    if (bEdit)
        tc.innerHTML = sel[0].outerHTML;
    else
        tc.innerText = sel.find("option:selected").text();
}

function initScrollBar(fSetTr, fSetTd, fOnBeforeScroll) {
    YshScrollbar.fillStart = function () {
        this.rowHeight = parseInt(($(yshScrollMainDiv.ctrl).height() - 30) / iNum) - 2;
        this.sTitle = yshSignalTitle.GetValue();
        this.isYx = this.sTitle == "遥信表";
        this.isYc = this.sTitle == "遥测表";
        this.isYk = this.sTitle == "遥控表";
    }
    YshScrollbar.SetTr = function (tr, i, data, pos) {
        tr.style.height = this.rowHeight;
        tr.style.textAlign = "center";

        //tr.lastChild.style.textAlign = "center";
        var sTitle = this.sTitle;
        tr.style.backgroundColor = "#FFFFFF";
        signalPos = pos ? pos : 0;

        tr.style.textDecoration = "";
        tr.style.color = "#000";
        tr.cells[0].disabled = false;
        switch (data.ModifyState) {
            case "0":
                tr.style.textDecoration = "line-through";
                break;
            case "1":
                tr.cells[0].disabled = true;
                break;
            case "3":
                tr.style.color = "blue";
                break;
            case "4":
                tr.style.color = "red";
                break;
            default:
                break;
        }

        if (typeof data.ShowState != "undefined" && data.ShowState != "") {
            var showstate = parseInt(data.ShowState, 10);
            if (showstate == 2)
                tr.style.backgroundColor = "#F08080";
        }

        if (this.isYx)
            SetEditHTML(tr, tr.cells.length - 1, "SaveOption()", "DelSpaStaSig()");
        else if (this.isYc)
            SetEditHTML(tr, tr.cells.length - 1, "SaveYaoCeOption()", "DeleteYaoCeSig()");
        else if (this.isYk)
            SetEditHTML(tr, tr.cells.length - 1, "SaveYaoKongOption()", "DeleteYaoKongSig()");
        /*else
        SetEditHTML(tr, tr.cells.length - 1, "SaveGaoJingOption()", "DeleteGaoJingSig()");*/
        else if (sTitle == "遥信验收" || sTitle == "告警直传验收") {
            tr.cells[0].innerHTML = "<input type='checkbox' " + (data.checkState ? "checked" : "") + " " + (isCanBatchCheck() ? "" : "disabled") + " onclick='chooseOne()'/>";
        }

        if (fSetTr)
            fSetTr(tr, i, data, pos);
    };
    YshScrollbar.SetTd = function (tc, j) {
        var sTitle = this.sTitle;
        var titleCol = this.table.rows[0].cells[j];
        var titleColName = titleCol.col;
        if (titleColName == "Remark" || titleColName == "Opinion")
            tc.style.textAlign = "left";
        setColEdit(tc, privs.bPoint && this.isYx && !IsOnline, ["YxPoint"], titleColName, "SaveOption()");
        setColEdit(tc, privs.bOpinion && this.isYx && !IsOnline, ["Opinion"], titleColName, "SaveOption()");


        setColEdit(tc, privs.bPoint && this.isYc && !IsOnline, ["YcPoint"], titleColName, "SaveYaoCeOption()");
        setColEdit(tc, privs.bOpinion && this.isYc && !IsOnline, ["Opinion"], titleColName, "SaveYaoCeOption()");
        setColEdit(tc, privs.bSignalEdit && this.isYc && !IsOnline, ["Coefficient", "SecondValue"], titleColName, "SaveYaoCeOption()");

        setColEdit(tc, privs.bPoint && this.isYk, ["YkPoint"], titleColName, "SaveYaoKongOption()");
        setColEdit(tc, privs.bOpinion && this.isYk, ["Opinion"], titleColName, "SaveYaoKongOption()");

        //setColEdit(tc, privs.bOpinion && sTitle == "告警直传表", ["Opinion"], titleColName);

        if (privs.bCheckShow || privs.bCheckEdit || privs.bCheckMonitorEdit || privs.bCheckAVC) {
            if (sTitle == "遥信验收" && titleColName == "CheckState") {
                setColSelectEdit(tc, titleColName, privs.bCheckEdit, "SetCheckRemark();SaveYXCheck()");
            }
            if (sTitle == "遥信验收" && privs.bCheckEdit && titleColName == "Remark") {
                setColEditState(tc, titleColName, "SaveYXCheck()");
            }
            else if (sTitle == "遥测验收" && privs.bCheckEdit && ["EndValue", "MainValue", "Remark"].indexOf(titleColName) >= 0) {
                setColEditState(tc, titleColName, "SaveYCCheck()");
            }
            else if (sTitle == "告警直传验收" && titleColName == "CheckState") {
                setColSelectEdit(tc, titleColName, privs.bCheckEdit, "SaveGJCheck()");
            }
        }
        if (titleColName == "Explain") {
            tc.innerHTML = ShowExplainText(tc.innerText, privs.bRemark);
        }
        if (fSetTd)
            fSetTd(tc, j);
    };
    YshScrollbar.onBeforeScroll = function (table) {
        var type = getSignalType(yshSignalTitle.GetValue());
        if (!type)
            return;
        var rows = table.rows;
        for (var i = 1; i < rows.length; i++) {
            if (rows[i].cells[ID_COL].innerText != signalData[type][signalPos + i - 1]["SignalID"])
                continue;
            $(rows[i]).find("input, select").each(function () {
                signalData[type][signalPos + i - 1][this.col] = $(this).val();
            });
            $(rows[i]).find("input[unsave=1]").each(function () {
                this.fireEvent("onchange");
                return false;
            }); //一行只需要保存一次
        }
        if (fOnBeforeScroll)
            fOnBeforeScroll(table);
    }
}

function setColEdit(tc, bEdit, arrCol, col, fSave) {
    if (!bEdit)
        return;
    if(arrCol.contains(col))
        setColEditState(tc, col, fSave);
}

function getSignalType(title) {
    switch (title) {
        case "遥信表":
            return "YX";
        case "遥测表":
            return "YC";
        case "遥控表":
            return "YK";
        case "告警直传表":
            return "GJ";
        case "遥信验收":
            return "YXCheck";
        case "遥测验收":
            return "YCCheck";
        case "遥控验收":
            return "YKCheck";
        case "告警直传验收":
            return "GJCheck";
        case "AVC验收":
            return "AVCCheck";
        default:
            return "";
    }
}

function initialScrollTable(dll, args, tablecfg, desc, div, fGetData, type, fInitTitle) {
    Ysh.Web.Loading(function () { doInitialScrollTable(dll, args, tablecfg, desc, div, fGetData, type, fInitTitle); }, "正在加载信息表");
}

function doInitialScrollTable(dll, args, tablecfg, desc, div, fGetData, type, fInitTitle) {
    var dlls = [{ "dll": dll, "args": args }, { dll: "dkLib:dkLib.TableControl.GetConfig", args: [tablecfg]}];
    var info = ExecuteBack(function () { return YshGrid.Executes(dlls); }); //
    if (!info.check(desc, true))
        return null;
    div.innerHTML = info.value[1];
    var data = info.value[0];
    /*args.push("@return0");
    var dlls = [{ dll: "dkLib:dkLib.TableControl.GetConfig", args: [tablecfg] }, { "dll": dll, "args": args } ];
    var info = ExecuteBack(function () { return YshGrid.ExecutesEx(dlls); }); //
    if (!info.check(desc, true))
        return null;
    div.innerHTML = info.value[0];
    var data = info.value[1];*/
    if (null == data)
        return null;
    if (fGetData)
        data = fGetData(data);
    if (fInitTitle)
        fInitTitle(div.childNodes[0].rows[0]);
    YshScrollbar.Init(data, tdScroll, div.childNodes[0]);
    YshScrollbar.setOptions({ "itemNum": iNum, "itemSize": 30 });
    signalData[type] = data;
    return data;
}



function SaveOption() {//保存遥信信息
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    if (tr.cells[yxCols.YxPoint].children.length > 0 && !Ysh.Web.Check.isNumber(tr.cells[yxCols.YxPoint].children[0], "点号", { empty: true, integer: true, min: 0, containMin: true }))
        return false;
    var op = Ysh.Web.getEditValue(tr.cells[yxCols.Opinion]);
    var ex = Ysh.Web.getEditValue(tr.cells[yxCols.Explain]);
    var po = Ysh.Web.getEditValue(tr.cells[yxCols.YxPoint]);
    var id = tr.cells[0].innerText;
    var arrSigID = id.split("_");
    if (arrSigID.length < 2)
        return false;
    var sigType = arrSigID[0];
    sigid = Ysh.Array.getLast(arrSigID);
    var o;
    switch (sigType) {
        case "sta":
            o = { type: "Station", msg: "保存" };
            break;
        case "space":
            o = { type: "Space", msg: "保存" };
            break;
        case "dev":
            o = { type: "Device", msg: "保存" };
            break;
        default:
            break;
    }
    if (!o)
        return false;
    var ss = ExecuteBack(function () {
        return YshGrid.Execute("dkLib:dkLib.Class1.AddOpinion", [staid, o.type, sigid, privs.bOpinion, op, privs.bRemark, ex, privs.bPoint, po]);
    });
    if (!ss.check(o.msg, true))
        return false;
    updateSignalData(signalData["YX"], signalPos, iNum, id, { "YxPoint": po, "Explain": ex, "Opinion": op });
    $(tr).find("input").each(function () { if (this.unsave != "0") this.unsave = "0"; });
}
function DelSpaStaSig() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    var tbl = Ysh.Web.getParent(tr, "TABLE");
    var id = tr.cells[0].innerText;
    var arrSigID = id.split("_");
    if (arrSigID.length <= 2)
        return false;
    var sigType = arrSigID[0];
    sigid = arrSigID[1];

    var o;
    switch (sigType) {
        case 'sta':
            o = { func: "dkLib:dkLib.DbAssist.ExecuteSql", sql: "DelStationSig", msg: "确定要删除这条信号吗？" };
            break;
        case 'space':
            o = { func: "dkLib:dkLib.DbAssist.ExecuteSql", sql: "DeleteSpaceSig", msg: "确定要删除这条信号吗？" };
            break;
        case 'dev':
            o = { func: "dkLib:dkLib.Class1.DeleteDevSig", sql: "", msg: "确定要删除这条信号吗？如果删除，将会删除关联的站端信号和主站信号" };
            break;
    }
    if (!o)
        return false;
    if (!confirm(o.msg))
        return false;
    var args = [];
    if (o.sql) {
        args.push(o.sql);
        args.push([sigid, itemid]);
    }
    else {
        args.push(sigid);
        args.push(itemid);
    }
    var ss = ExecuteBack(function () { return YshGrid.Execute(o.func, args); });
    if (!ss.check("删除", false))
        return false;
    tbl.deleteRow(tr.rowIndex);
    deleteSignalData(signalData["YX"], signalPos, iNum, id);
}

function SaveYaoCeOption() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    if (tr.cells[ycCols.YcPoint].children.length > 0 && !Ysh.Web.Check.isNumber(tr.cells[ycCols.YcPoint].children[0], "点号", { empty: true, integer: true, min: 0, containMin: true }))
        return false;
    var sigid = tr.cells[0].innerText.split("_")[1];
    var op = Ysh.Web.getEditValue(tr.cells[ycCols.Opinion]);
    var po = Ysh.Web.getEditValue(tr.cells[ycCols.YcPoint]);
    var co = Ysh.Web.getEditValue(tr.cells[ycCols.Coefficient]);
    var se = Ysh.Web.getEditValue(tr.cells[ycCols.SecondValue]);
    var o = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.Class1.AddYaoCeOpinion", [staid, sigid, privs.bOpinion, op, false, "", privs.bPoint, po, privs.bSignalEdit, co, se]); });
    if (!o.check("保存遥测", true))
        return;
    updateSignalData(signalData["YC"], signalPos, iNum, sigid, { "YcPoint": po, "Opinion": op });
    $(tr).find("input").each(function () { if (this.unsave != "0") this.unsave = "0"; });
    return false;
}

function DeleteYaoCeSig() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    var tbl = Ysh.Web.getParent(tr, "TABLE");
    var sigid = tr.cells[0].innerText.split("_")[1];

    if (!confirm("你确定要删除这条信号吗？"))
        return false;
    var ss = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DbAssist.ExecuteSql", ["DelYaoCeSig", sigid, itemid]); });
    if (!ss.check("删除", false))
        return;
    tbl.deleteRow(tr.rowIndex);
    deleteSignalData(signalData["YC"], signalPos, iNum, sigid);
}

function SaveYaoKongOption() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    if (tr.cells[ykCols.YkdPoint].children.length > 0 && !Ysh.Web.Check.isNumber(tr.cells[ykCols.YkPoint].children[0], "点号", { empty: true, integer: true, min: 0, containMin: true }))
        return false;
    var op = Ysh.Web.getEditValue(tr.cells[ykCols.Opinion]);
    var po = Ysh.Web.getEditValue(tr.cells[ykCols.YkPoint]);
    var id = tr.cells[0].innerText;
    var arrSigID = id.split("_");
    if (arrSigID.length != 2)
        return false;
    var sigType = arrSigID[0];
    var sigid = arrSigID[1];
    var o;
    switch (sigType) {
        case "sta":
            o = { type: "Station", msg: "保存遥控变电站" };
            break;
        case "space":
            o = { type: "Space", msg: "保存遥控间隔" };
            break;
        default:
            break;
    }
    if (!o)
        return false;
    var ss = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.Class1.AddYaoKongOpinion", [staid, o.type, sigid, privs.bOpinion, op, false, "", privs.bPoint, po]); });
    if (!ss.check(o.msg, true))
        return;
    updateSignalData(signalData["YK"], signalPos, iNum, id, { "YkPoint": po, "Opinion": op });
    $(tr).find("input").each(function () { if (this.unsave != "0") this.unsave = "0"; });
    return false;
}

function DeleteYaoKongSig() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    var tbl = Ysh.Web.getParent(tr, "TABLE");
    var sigid = tr.cells[0].innerText;

    if (!confirm("你确定要删除这条信号吗？"))
        return false;
    var ss = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.Class1.DeleteYaoKongSig", [sigid, itemid]); });
    if (!ss.check("删除", false))
        return;
    tbl.deleteRow(tr.rowIndex);
    deleteSignalData(signalData["YK"], signalPos, iNum, sigid);
}

function SaveGaoJingOption() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    var sigid = tr.cells[0].innerText;
    var op = Ysh.Web.getEditValue(tr.cells[gjCols.Opinion]);
    var ex = Ysh.Web.getEditValue(tr.cells[gjCols.InfoExplain]);
    if (sigid == "0") {
        alert("请勿修改事故总信号！");
        return;
    }
    var ss = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.Class1..AddGaoJingOpinion", [sigid, op, ex]); });
    if (!ss.check("保存告警直传", false))
        return;
    updateSignalData(signalData["GJ"], signalPos, iNum, sigid, { "InfoExplain": ex, "Opinion": op });
    $(tr).find("input").each(function () { if (this.unsave != "0") this.unsave = "0"; });
    return false;
}

function DeleteGaoJingSig() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    var tbl = Ysh.Web.getParent(tr, "TABLE");
    var sigid = tr.cells[0].innerText;

    if (!confirm("你确定要删除这条信号吗？"))
        return false;
    var ss = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.Class1.DeleteGaoJingSig", [sigid]); });
    if (!ss.check("删除", false))
        return;
    tbl.deleteRow(tr.rowIndex);
    deleteSignalData(signalData["GJ"], signalPos, iNum, sigid);
}

function SetCheckRemark() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    var checkState = Ysh.Web.getEditValue(tr.cells[tr.cells.length - 2]);
    var txtRemark = tr.cells[tr.cells.length - 1].children[0];
    var userName = $("#" + strPrefix + "hdnUserName").val();
    var remark = "";
    if (checkState == "1")
        remark = userName + "：通过。";
    else if (checkState == "0")
        remark = userName + "：；";
    txtRemark.value += remark;
}

function SaveYXCheck() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    var id = tr.cells[ID_COL].innerText;
    var arrSigID = id.split("_");
    if (arrSigID.length < 2)
        return false;
    var sigType = arrSigID[0];
    sigid = Ysh.Array.getLast(arrSigID);
    var sqlNode = GetYXCheckNode(sigType);
    if (sqlNode == "")
        return false;
    var checkState = Ysh.Web.getEditValue(tr.cells[tr.cells.length - 2]);
    var txtRemark = tr.cells[tr.cells.length - 1].children[0];
    var remark = txtRemark.value;
    txtRemark.unsave = "0";
    var o = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DbAssist.ExecuteSqlEx", ["SignalCheckSql.xml", sqlNode, sigid, checkState, remark]); });
    if (!o.check("更新遥信验收卡", true)) {
        txtRemark.unsave = "1";
    }
}

function GetYXCheckNode(sigType) {
    switch (sigType) {
        case "sta":
            return "UpdateYxStationCheck";
        case "space":
            return "UpdateYxSpaceCheck";
        case "dev":
            return "UpdateYxDeviceCheck";
        default:
            return "";
    }
}

function SaveYCCheck() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    var sigid = tr.cells[0].innerText.split("_")[1]; 
    var arrArg = [sigid];
    var inputs = $(tr).find("input")
    inputs.each(function () {
        arrArg.push($(this).val());
        if(this.unsave != "0")
            this.unsave = "0";
    });
    var o = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DbAssist.ExecuteSqlEx", ["SignalCheckSql.xml", "UpdateYcCheck", arrArg]); });
    if (!o.check("更新遥测验收卡", true)) {
        inputs.each(function () { if(this.unsave != "1") this.unsave = "1"; });
    }
}

function SaveGJCheck() {
    var tr = Ysh.Web.getParent(event.srcElement, "TR");
    var id = tr.cells[ID_COL].innerText;
    var arrSigID = id.split("_");
    if (arrSigID.length < 2)
        return false;
    var sigType = arrSigID[0];
    sigid = Ysh.Array.getLast(arrSigID);
    var sqlNode = GetGJCheckNode(sigType);
    if (sqlNode == "")
        return false;
    var checkState = Ysh.Web.getEditValue(tr.cells[tr.cells.length - 1]);
    var o = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DbAssist.ExecuteSqlEx", ["SignalCheckSql.xml", sqlNode, sigid, checkState]); });
    o.check("更新告警直传验收卡", true);
}

function GetGJCheckNode(sigType) {
    switch (sigType) {
        case "sta":
            return "UpdateGjStationCheck";
        case "space":
            return "UpdateGjSpaceCheck";
        case "dev":
            return "UpdateGjDeviceCheck";
        default:
            return "";
    }
}

function getSignalDataIndex(arr, iStart, iLength, id) {
    if (!arr)
        return -1;
    var iEnd = Math.min(iStart + iLength, arr.length - 1);
    for (var i = iStart; i <= iEnd; i++) {
        if (arr[i].SignalID == id)
            return i;
    }
    return -1;
}

function updateSignalData(arr, iStart, iLenght, id, attr) {
    var iIndex = getSignalDataIndex(arr, iStart, iLenght, id);
    if (iIndex < 0)
        return false;
    for (var p in attr)
        arr[iIndex][p] = attr[p];
}

function deleteSignalData(arr, iStart, iLength, id) {
    var iIndex = getSignalDataIndex(arr, iStart, iLength, id);
    if (iIndex < 0)
        return false;
    arr.splice(iIndex, 1);
}

//验收卡功能