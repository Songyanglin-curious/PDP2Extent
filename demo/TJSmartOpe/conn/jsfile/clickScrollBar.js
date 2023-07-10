var sig_old = '', sigrule = '', WarnLevel = '', devtype = '', iflocation = '', bIfLocation = false, itemid = '', staid = '', spaceid = '', deciid = '', sigid = "", listshowID = "";
var deciid, sigid,editcolname;
var layers = 0;
var tablecols = createColsObject();
/*
滚动数据增加双击上弹出对话框数据加载
*/
function LoadDialogInScrollBar(obj) {
    var tr = Ysh.Web.getParent(obj, "TR");
    var table = Ysh.Web.getParent(tr, "TABLE");
    var colname = table.rows[0].cells(obj.cellIndex + 1).col;//第一列是隐藏列的情况
    sigid = "";
    
    spaceid = tr.cells[tr.cells.length - 2].innerText;
    deciid = tr.lastChild.innerText;
    if (spaceid != "") {
        top["createSignalId"] = spaceid;
        top["SignalType"] = "Space";
    }
    if (deciid != "") {
        top["createSignalId"] = deciid;
        top["SignalType"] = "Device";
    }
    if (spaceid == "" && deciid == "") {
        top["createSignalId"] = "";
        top["SignalType"] = "Sta";
    }
    /*document.title = "编辑原始信号";
    layers = document.getElementById("hidLayers").value;
    if (layers == "") layers = 3;
    else layers = parseInt(layers, 10);
    if (layers == 3) {
        document.title = "编辑设备信号";
        document.getElementById("lblTitile").innerText = "编辑设备信号：";
        document.getElementById("labDescRule").innerText = "设备信号规则：";
        document.getElementById("labDescSignal").innerText = "设备信号：";
    }*/
    //var obj = window.dialogArguments;['update', deciid, sig_old, id, sigrule, iflocation, itemid]
    opertype = 'update';
    //deciid = obj[1];
    editcolname = colname;
    sig_old = GetReturnValue(tr, colname)[0];
    sigrule = GetReturnValue(tr, colname + "rulecontent")[0];
    var cbLocation = $("#cbLocation");
    if (cbLocation.length > 0)
        iflocation = GetReturnValue(tr, colname + "iflocation")[0];
    else
        iflocation = "-1";
    if(iflocation != "-1"){
        bIfLocation = true;
        cbLocation.prop("checked", iflocation == "1");
    }
    document.getElementById("labSignal").innerText = sig_old;

    if (sigrule && sigrule != '') {//点击修改而来            
        document.getElementById("txtOther").innerText = sigrule;
    }
    if (opertype == 'update') {
        sigid = tr.cells[0].innerText;
    }
    Ysh.Web.setTextFull(document.getElementById("txtOther"), "\{(.*?)\}");
    GetRuleCongig();
}
function GetRuleCongig(wnd) {
    var wndstr;
    if (!wnd) {
        wnd = window;
        wndstr = "window"
    }
    wndstr = "top";
    var ruleconfig = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.ConfigOfRuleReplace.GetRuleConfig", []); });
    if (!ruleconfig.check("查询配置的规则", true))
        return;

    ruleconfig = ruleconfig.value;

    var table = wnd.document.getElementById("tblcbx");
    while (table.rows.length > 1)
        table.deleteRow(1);
    var tr = table.insertRow();
    tr.style.textAlign = "center";
    tr.style.height = "25px";

    var rowC = 0;
    for (var i = 0; i < ruleconfig.length; i++) {
        if ((rowC % 4 == 0) && ruleconfig.length > 4) {
            var tr = table.insertRow();
            tr.style.textAlign = "center";
            tr.style.height = "25px";
        }
        var tc = tr.insertCell();
        tc.innerHTML = "<input type='checkbox' value='" + ruleconfig[i][0] + "' " + (wnd.document.getElementById("txtOther").value.indexOf(ruleconfig[i][0]) > -1 ? "checked" : "") + ">";
        tc.children[0].onclick = function () {
            SetRuleCon(this, wnd);
        }
        var tc = tr.insertCell();
        tc.innerText = ruleconfig[i][0];
        rowC++;
    }
    wnd.document.getElementById("tdDlgContent").height = "350px";
    wnd.document.getElementById("tdDlgContent").cursor = "default";
}
function SetRuleCon(obj, wnd) {
    var txt = wnd.document.getElementById("txtOther").value;
    if (obj.checked) {
        if (txt.indexOf(obj.value) == -1)
            Ysh.Web.Text.addText(wnd.document.getElementById("txtOther"), obj.value);
        //@@txtOther@@.SetValue(txt+obj.value);
    }
    else {
        wnd.document.getElementById("txtOther").innerText = txt.replace(obj.value, "");
    }
    ChangeRule(wnd);
}

function ChangeRule(wnd) {
    if (!wnd) wnd = window;
    var text = wnd.document.getElementById("txtOther").value;
    if (createSignalId == "" && SignalType == "Sta") {
        wnd.document.getElementById("labSignal").innerText = (typeof GetSigPrefix == "function" ? GetSigPrefix(SignalType, createSignalId) : "") + text;
    }
    else {
        var replacevalue = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.ConfigOfRuleReplace.Replace", [text, createSignalId, SignalType]); });
        wnd.document.getElementById("labSignal").innerText = (typeof GetSigPrefix == "function" ? GetSigPrefix(SignalType, createSignalId) : "") + replacevalue.value;
    }
}

function doSave(tc) {
    var table = Ysh.Web.getParent(tc, "TABLE");
    var tr = Ysh.Web.getParent(tc, "TR");
    var sig_new = document.getElementById("txtOther").value;
    if (sig_new == "") {
        alert("请把信息填写完整！");
        return false;
    }
    var obj;
    if (opertype == 'update') {
        var cbLocation = $("#cbLocation");
        var iflocation = (cbLocation.length == 0 || !bIfLocation) ? "-1" : (cbLocation.prop("checked") ? "1" : "0");
        obj = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.ClickScrollBar.UpdateDevSignal", [table.id,sigid,sig_new,document.getElementById("labSignal").innerText, itemid, editcolname, iflocation]); });
        if (obj.check("修改信号", true)) {
            Ysh.Web.alerts("保存成功！");
            var o = {};
            o[editcolname] = document.getElementById("labSignal").innerText;
            updateSignalDataPlus(YshScrollbar.options.data, YshScrollbar.signalPos, YshScrollbar.options.itemNum, sigid, o);
            tc.innerHTML = document.getElementById("labSignal").innerText;
            //当修改一个数据列同时修改关联列时调用，例如告警分级和告警分级描述，修改一个另一个跟着变化
            if(typeof ChangeRelationData == "function")
                ChangeRelationData(table, tr, tc, editcolname, sigid);
        }
    }
    return true;
}
function GetReturnValue(tr, colname) {
    var table = Ysh.Web.getParent(tr, "TABLE");

    var reVal = new Array();

    if (colname != "") {
        var colindex = tablecols[colname];
        if (typeof (colindex) != "undefined") {
            reVal.push(tr.cells[colindex].innerText);
            return reVal;
        }
        else{
            //表中未查出需要的信息列，其他方式取数据。
            var dll = "dkLib:dkLib.ClickScrollBar.";
            if(colname.indexOf("rulecontent") > -1)
                dll += "GetRuleContent";
            else if(colname.indexOf("iflocation") > -1)
                dll += "GetIfLocation";
            else{
                reVal.push("");
                return reVal;
            }
            var dataNotInTable = ExecuteBack(function () { return YshGrid.Execute(dll, [table.id, colname, tr.children[0].innerText]); });
            if (dataNotInTable.check("",true)) {
                reVal.push(dataNotInTable.value);
                return reVal;
            }
        }
    }
    else {
        reVal.push("");
        return reVal;
    }
}
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
var arrCheckSignal = {};
function canModifySignal(page,id) {
    if (typeof (itemid) != "undefined") {
        var bSignalChanged = arrCheckSignal[id];
        if (typeof (bSignalChanged) == "undefined") {
            var ret = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.ClickScrollBar.CheckSignal", [page,id, itemid]); });
            if (!ret.check("获取信号修改信息", true)) {
                return false;
            }
            else if (ret.value == 1) {
                bSignalChanged = false;
            }
            else if (ret.value == 0) {
                bSignalChanged = true;
            }
            arrCheckSignal[id] = bSignalChanged;
        }
        return bSignalChanged;
    }
    else {
        return true;
    }
}
function LoadDialogInListShow(obj, listshowidinpage, wnd) {
    if (!wnd) wnd = window;
    var tr = Ysh.Web.getParent(obj, "TR");
    var table = Ysh.Web.getParent(tr, "TABLE");
    listshowID = listshowidinpage;
    deciid = Ysh.Request.get("deciid");
    //var colname = table.rows[0].cells(obj.cellIndex + 1).col;//第一列是隐藏列的情况
    //tablecols.parse(table.rows[0]);
    //sigid = "";
    //spaceid = tr.cells[tr.cells.length - 2].innerText;
    //deciid = tr.lastChild.innerText;
    wnd.document.title = "编辑原始信号";
    layers = wnd.document.getElementById("hidLayers").value;
    if (layers == "") layers = 3;
    else layers = parseInt(layers, 10);
    if (layers == 3) {
        wnd.document.title = "编辑信号";
        wnd.document.getElementById("lblTitile").innerText = "编辑设备信号：";
        wnd.document.getElementById("labDescRule").innerText = "设备信号规则：";
        wnd.document.getElementById("labDescSignal").innerText = "设备信号：";
    }
    opertype = 'update';

    //editcolname = colname;
    //sig_old = GetReturnValue(tr, colname)[0];
    if (opertype == 'update') {
        //sigid = tr.children[tr.children.length - 1].innerText;
        sigid = tr.children[ListShowInfo.currentListShow.GetFieldIndex("id")].innerText;
    }
    var i;
    for (i = 0; i < tr.children.length; i++) {
        if (tr.children[i] == obj) {
            break;
        }
    }
    sigrule = GetListShowReturnValue(tr, ListShowInfo.currentListShow.GetFieldName(i)+"rulecontent")[0];
    deciid = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.ClickScrollBar.GetDeciid", [Ysh.Request.get("f"), listshowID + "/" + ListShowInfo.currentListShow.GetFieldName(i), sigid]); });
    if (deciid.check("", true)) {
        deciid = deciid.value;
    }
    wnd.document.getElementById("labSignal").innerText = obj.innerText;

    if (sigrule && sigrule != '') {//点击修改而来
        wnd.document.getElementById("txtOther").innerText = sigrule;
    }
    Ysh.Web.setTextFull(wnd.document.getElementById("txtOther"), "\{(.*?)\}");
    GetRuleCongig(wnd);
}
function GetListShowReturnValue(tr, colname) {
    var table = Ysh.Web.getParent(tr, "TABLE");
    var listshowID = table.id.split('_');
    if (listshowID.length == 3) {
        listshowID = listshowID[1];
    }

    var reVal = new Array();

    if (colname != "") {
        var colindex = ListShowInfo.currentListShow.GetFieldIndex(colname);
        if (typeof (colindex) != "undefined" && colindex != -1) {
            reVal.push(tr.cells[colindex].innerText);
            return reVal;
        }
        else {
            //表中未查出需要的信息列，其他方式取数据。
            var dataNotInTable = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.ClickScrollBar.GetRuleContent", [Ysh.Request.get("f"), listshowID + "/" + colname, sigid]); });
            if (dataNotInTable.check("", true)) {
                reVal.push(dataNotInTable.value);
                return reVal;
            }
        }
    }
    else {
        reVal.push("");
        return reVal;
    }
}
function doSaveInListShow(tc, wnd) {
    if (!wnd) {
        wnd = window;
    }
    var table = Ysh.Web.getParent(tc, "TABLE");
    var tr = Ysh.Web.getParent(tc, "TR");
    var sig_new = wnd.document.getElementById("txtOther").value;
    if (sig_new == "") {
        alert("请把信息填写完整！");
        return false;
    }
    var obj;
    if (opertype == 'update') {
        var i;
        for (i = 0; i < tr.children.length; i++) {
            if (tr.children[i] == tc) {
                break;
            }
        }
        var colname = ListShowInfo.currentListShow.GetFieldName(i);
        obj = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.ClickScrollBar.UpdateDevSignal", [Ysh.Request.get("f"), sigid, sig_new, wnd.document.getElementById("labSignal").innerText, itemid, listshowID+"/"+colname, "-1"]); });
        if (obj.check("修改信号", true)) {
            alert("保存成功！");
            var o = {};
            o[editcolname] = wnd.document.getElementById("labSignal").innerText;
            tc.innerHTML = wnd.document.getElementById("labSignal").innerText;
        }
    }
    return true;
}