var fillSys = {
    getMessage: function (alertStr, bUp) {
        var strTable = "<table cellpadding=\"0\" cellspacing=\"0\"><tr><td>";
        strTable += "<table style=\"width: 100%; height: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
        if (bUp) {
            strTable += "<tr><td><img alt=\"\" src=\"/i/message/message_1.gif\" /></td>";
            strTable += "<td style=\"width:100%;background-image: url(/i/message/message_6.gif)\"></td>";
            strTable += "<td><img alt=\"\" src=\"/i/message/message_2.gif\" /></td></tr>";
        } else {
            strTable += "<tr><td><img alt=\"\" src=\"/i/message/dmessage_2.gif\" /></td>";
            strTable += "<td style=\"width:100%;background-image: url(/i/message/dmessage_6.gif)\"></td>";
            strTable += "<td><img alt=\"\" src=\"/i/message/dmessage_1.gif\" /></td></tr>";
        }
        strTable += "</table></td></tr>";

        strTable += "<tr><td><table id=\"tabAlert\" style=\"width: 100%; height: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
        strTable += "<tr><td id='idAlert' style=\"padding:0px;border-left: solid 1px black; border-right: solid 1px black;font-weight:bold;background-color: #FFFFE3;text-align:left\">" + alertStr + "</td></tr></table></td></tr>";


        strTable += "<tr><td>";
        strTable += "<table style=\"width: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
        if (bUp) {
            strTable += "<tr><td><img alt=\"\" src=\"/i/message/message_3.gif\" /></td>";
            strTable += "<td style=\"width:100%;background-image: url(/i/message/message_5.gif)\"></td>";
            strTable += "<td><img alt=\"\" src=\"/i/message/message_4.gif\" /></td></tr>";
        } else {
            strTable += "<tr><td><img alt=\"\" src=\"/i/message/dmessage_3.gif\" /></td>";
            strTable += "<td style=\"width:100%;background-image: url(/i/message/dmessage_5.gif)\"></td>";
            strTable += "<td><img alt=\"\" src=\"/i/message/dmessage_4.gif\" /></td></tr>";
        }
        strTable += "</table></td></tr></table>";
        return strTable;
    },

    t: null,

    OverTimeHiddenDiv: function () {
        this.t = setTimeout("DivHidden()", 5000);
    },
    showAlertOffset: function (alertStr, leftOffset, bUp) {
        var divMsg = null;
        if (document.getElementById("divMessage")) {
            divMsg = document.getElementById("divMessage");
            divMsg.style.width = "";
            divMsg.style.display = "";
            //document.getElementById("idAlert").innerHTML = alertStr;
        }
        else {
            var strMsg = "<div id=\"divMessage\" align=\"center\" style=\"position: absolute; z-index: 1111;" +
                        "filter: alpha(opacity=100); font-size: 14px;" +
                        "font-variant: small-caps; vertical-align: middle; padding: 0px\"></div>";

            divMsg = document.createElement(strMsg);

            document.body.insertBefore(divMsg);
        }
        divMsg.innerHTML = this.getMessage(alertStr, bUp);
        this.OverTimeHiddenDiv();
        if (!document.getElementById("divMessage"))
            return false;
        //需要处理，如果右边空间不够，移到左边
        if (bUp) {
            var r = event.srcElement.getBoundingClientRect();
            var x = r.left; //event.clientX
            var w = Math.min(parseInt(document.getElementById("divMessage").offsetWidth, 10), 365);
            document.getElementById("divMessage").style.width = w + "px";
            document.getElementById("divMessage").style.textAlign = "left";
            document.getElementById("divMessage").style.left = r.right - w;
            document.getElementById("divMessage").style.top = event.clientY - document.getElementById("divMessage").offsetHeight - 10;
        } else {
            var x = event.srcElement.getBoundingClientRect().left; //event.clientX
            document.getElementById("divMessage").style.width = Math.min(parseInt(document.getElementById("divMessage").offsetWidth, 10), 365) + "px";
            document.getElementById("divMessage").style.textAlign = "left";
            document.getElementById("divMessage").style.left = x; // -parseInt(document.getElementById("divMessage").offsetWidth, 10) + leftOffset;
            document.getElementById("divMessage").style.top = event.clientY + 10;
        }
    }
};

function DivHidden() {
    if (document.getElementById("divMessage"))
        document.getElementById("divMessage").style.display = "none";
    clearTimeout(fillSys.t);
}
