function ShowExplainText(ids, bEdit) {
    var arrID = ids.split("@");
    if (arrID.length == 3) {//signalmainid,infoexplainid,infoid
        return "<a href='#' ids='" + ids + "' onclick='ShowExplainInfo();return false;' style='color:" + (IsNullID(arrID[2]) ? "red" : "") + ";' edit=" + (bEdit ? "1" : "0") + ">信号释义</a>";
    }
    else {
        return "";
    }
}


function ShowExplainInfo() {
    var obj = event.srcElement;
    var tr = Ysh.Web.getParent(obj, "TR");
    var sigid = tr.cells[0].innerText;
    var arrID = obj.ids.split("@");
    arrID[1] = arrID[1] == "" ? "0" : arrID[1];
    arrID[2] = Ysh.Web.showDialog("p.aspx?f=SignalExplainInfoEdit" + (!IsNullID(arrID[2]) ? "&infoid=" + arrID[2] : "") + "&signalmainid=" + arrID[0] + "&detailid=" + arrID[1] + (obj.edit == "0" ? "&e=0" : "") + "&a=" + Math.random(), "", "dialogWidth:800px; dialogHeight:430px; center:yes; help:no; resizable:no; status:no;scroll:no;");
    obj.ids = arrID.join("@");
    if (!IsNullID(arrID[2]))
        obj.style.color = "";
    else
        obj.style.color = "red";
    if(typeof(updateSignalData) == "function")
        updateSignalData(GetExplainData(), signalPos, iNum, sigid, { "Explain": arrID.join("@") });
}

function GetExplainData() {
    return signalData["YX"];
}

function IsNullID(id) {
    return id == "" || id == "0";
}