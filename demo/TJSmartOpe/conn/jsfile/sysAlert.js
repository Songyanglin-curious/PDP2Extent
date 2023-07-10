var fillPrompt = {
    showAlert: function (type, stid) {
    var o = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.Class1.GetRemarkSpaceId", [type, stid]); });
    if (!o.isOK)
        return false;
        var alertStr = this.getAlertStr(type, o.value);
    if (alertStr == "")
        return false;

    if (document.getElementById("divMessage")) {
        document.getElementById("divMessage").style.display = "";
        document.getElementById("idAlert").innerHTML = alertStr;
    }
    else {
        var strMsg = "<div id=\"divMessage\" align=\"center\" style=\"position: absolute; z-index: 1111;" +
                        "filter: alpha(opacity=100); font-size: 14px;" +
                        "font-variant: small-caps; vertical-align: middle; padding: 0px\"></div>";

        var divMsg = document.createElement(strMsg);
       
            divMsg.innerHTML = this.getMessage(alertStr);
        document.body.insertBefore(divMsg);
    }
        this.OverTimeHiddenDiv();
    return true;
    },
    getAlertStr: function (type, arr) {
    switch (type) {
        case "bh":
            return arr[0];
        case "mx1":
            return arr[1];
        case "mx2":
            return arr[2];
        case "kg1":
            return arr[3];
        case "kg2":
            return arr[4];
        case "device":
            return arr[0];
        default:
            return "";
    }
    },
    getMessage: function (alertStr) {
    var strTable = "<table cellpadding=\"0\" cellspacing=\"0\"><tr><td>";
    strTable += "<table style=\"width: 100%; height: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr><td><img alt=\"\" src=\"/i/message/dmessage_2.gif\" /></td>";
    strTable += "<td style=\"width:100%;background-image: url(/i/message/dmessage_6.gif)\"></td>";
    strTable += "<td><img alt=\"\" src=\"/i/message/dmessage_1.gif\" /></td></tr>";
    strTable += "</table></td></tr>";

    strTable += "<tr><td><table id=\"tabAlert\" style=\"width: 100%; height: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr><td id='idAlert' style=\"padding:0px;border-left: solid 1px black; border-right: solid 1px black;font-weight:bold;background-color: #FFFFE3;text-align:left\">" + alertStr + "</td></tr></table></td></tr>";


    strTable += "<tr><td>";
    strTable += "<table style=\"width: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr><td><img alt=\"\" src=\"/i/message/dmessage_3.gif\" /></td>";
    strTable += "<td style=\"width:100%;background-image: url(/i/message/dmessage_5.gif)\"></td>";
    strTable += "<td><img alt=\"\" src=\"/i/message/dmessage_4.gif\" /></td></tr>";
    strTable += "</table></td></tr></table>";
    return strTable;
    },

    t: null,

    OverTimeHiddenDiv: function () {
        this.t = setTimeout("DivHidden()", 5000);
    },
    showAlertOffset: function (type, stid, leftOffset) {
        if (!this.showAlert(type, stid))
            return false;
        if (!document.getElementById("divMessage"))
            return false;
        var x = event.srcElement.getBoundingClientRect().left; //event.clientX
        document.getElementById("divMessage").style.width = Math.min(parseInt(document.getElementById("divMessage").offsetWidth, 10), 365) + "px";
        document.getElementById("divMessage").style.textAlign = "left";
        document.getElementById("divMessage").style.left = x; // -parseInt(document.getElementById("divMessage").offsetWidth, 10) + leftOffset;
        //需要处理，如果右边空间不够，移到左边
        document.getElementById("divMessage").style.top = event.clientY + 10;
}
};

function DivHidden() {
    if (document.getElementById("divMessage"))
        document.getElementById("divMessage").style.display = "none";
    clearTimeout(fillPrompt.t);
}
//选择常用语句
function SelectStatement(obj) {
    if (!obj)
        return false;
    $(obj).dblclick(function () {
        var o = ShowModalDialog("/p.aspx?f=userstatement&select=1&a=" + Math.random(), null, "dialogWidth:500px; dialogHeight:400px; center:yes; help:no; resizable:no; status:no;scroll:no;");
        if (!o)
            return false;
        $(this).val($(this).val() + o);
    });
}