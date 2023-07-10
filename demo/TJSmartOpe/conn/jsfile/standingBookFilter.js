var alertStr = new Array();//目标表格的目标列的内容
var filTab = new Array();//筛选的表名和列名：格式是表名+“！~！”+列名
var filCondition = new Array(); //筛选的条件：格式是表名+“！~！”+列名+筛选条件
function showAlert(tblname, colIndex) {
    alertStr = new Array();
    var goalTable = document.getElementById(tblname);

    for (var i = 1; i < goalTable.rows.length - 1; i++) {
        var j = 0;
        var cinfo = "";
        for (j = 0; j < alertStr.length; j++) {
            var cl = goalTable.rows[i].cells[colIndex].children.length;
            if (cl == 0)
                cinfo = goalTable.rows[i].cells[colIndex].innerText;
            else
                cinfo = goalTable.rows[i].cells[colIndex].firstChild.value;
            if (alertStr[j] == cinfo)
                break;
        }
        if (j == alertStr.length) {
            alertStr.push(cinfo);
        }
    }

    if (document.getElementById("divMessage")) {
        document.getElementById("divMessage").style.display = "";
        document.getElementById("divMessage").innerHTML = getMessage(tblname, colIndex);
    }
    else {
        var strMsg = "<div id=\"divMessage\" onblur='DivHidden()' align=\"center\" style=\"position: absolute;overflow:scroll;overflow-x:hidden;overflow-y:hidden; z-index: 1111;height:460px;width:216px;background-color:#F8F7F7;" +
                        "filter: alpha(opacity=100); font-size: 14px;" +
                        "font-variant: small-caps; vertical-align: middle; padding: 0px\"></div>";
        var divMsg = document.createElement(strMsg);
        divMsg.innerHTML = getMessage(tblname, colIndex);
        document.body.insertBefore(divMsg);
    }
    for (var i = tbSel.rows.length - 1; i >= 0; i--)
        tbSel.deleteRow(i);
    var tr = tbSel.insertRow();
    tr.style.height = "20px";

    tc = tr.insertCell();
    tc.style.backgroundColor = "#fff";
    tc.style.width = "16px";
    tc.innerHTML = "<input id='qx' onclick='SelectCondition(this)' type='checkbox' checked/>";

    tc = tr.insertCell();
    tc.style.backgroundColor = "#fff";
    tc.style.width = "100%";
    tc.innerHTML = "（全选）";

    for (var i = 0; i < alertStr.length; i++) {
        var tr = tbSel.insertRow();
        tr.style.height = "20px";

        tc = tr.insertCell();
        tc.style.backgroundColor = "#fff";
        tc.innerHTML = "<input name='cbox' id='selAll'+" + i.toString() + " onclick='SelectCondition(this)'  type='checkbox' checked/>";

        tc = tr.insertCell();
        tc.style.backgroundColor = "#fff";
        tc.innerHTML = alertStr[i] == "" ? "（空白）" : alertStr[i];
    }
    var tr = tbSel.insertRow();
    tr.style.height = "90%";
    tc = tr.insertCell();
    tc.style.height = "90%";

    if (filTab.join(",").indexOf(tblname + "!~!" + colIndex) != -1) {
        //说明有该列的筛选条件
        var con = ""; //colIndex列的筛选条件
        for (var i = 0; i < filCondition.length; i++) {
            if (filCondition[i].toString().indexOf(tblname + "!~!" + colIndex) != -1)
                con = filCondition[i].split("!~!")[2];
        }
        if (con.length > 15)
            document.getElementById("spanShowSel").innerText = con.substr(0, 15) + "......";
        else
            document.getElementById("spanShowSel").innerText = con;
        for (var i = tbSel.rows.length - 2; i > 0; i--) {
            if (con.indexOf(tbSel.rows[i].cells(1).innerText) == -1) {
                tbSel.rows[i].style.display = "none";
            }
            else {
                tbSel.rows[i].style.display = "";
            }
        }
    }
}

function getMessage(tblname, colindex) {
    var strTable = "<div style='width:100%;height:16px;background-color:#EAEDF0;color:#9ABF80;text-align: left;'>内容筛选</div><table cellpadding=\"0\" cellspacing=\"0\" border='0' style='position: absolute; top: 26px; left:6px;'><tr><td style='background-color:#F8F7F7;'>" 
        +"<input id='txtKey' value='搜索（所有）' onpropertychange='SearchTable()' onblur='Onblur()' onfocus='Onfocus()' style='width:180px'/></td>"
        +"<td style='background-color:#F8F7F7;width:20px' Align='left'><img id='imgSee' src='Images/toSee2.gif' onclick='SearchOrCancel()'/> </td></tr><tr><td colSpan=2>";
    strTable += "<div style='overflow:scroll;overflow-x:hidden;overflow-y:scroll; height:330px;width:100%;background-color:#FFF;border: 1px solid #000;'><table id='tbSel' style=\"width: 100%; height: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "</table></div></td></tr><tr><td colSpan=2 Align='left'><span id='spanShowSel' style='width:100%'>（全部显示）</span><hr/> <input type='button' id='btnOk' class='btnOk' onclick='okOnClick(\"" + tblname + "\",\"" + colindex + "\");'>&nbsp;&nbsp;&nbsp;<input type='button' id='btnCancel' class='btnCancel' onclick='jscript: DivHidden();'></td></tr></table>";
    return strTable;
}

var t;
function DivHidden() {
    if (document.getElementById("divMessage"))
        document.getElementById("divMessage").style.display = "none";
    clearTimeout(t);
}

function OverTimeHiddenDiv() {
    t = setTimeout("DivHidden()", 1000);
}

function SelectCondition(obj) {
    if (obj.id == "qx") {
        var sum = document.getElementsByName('cbox').length;
        for (var i = 0; i < sum; i++) {
            document.getElementsByName('cbox')[i].checked = obj.checked ? true : false;
        }
        if (obj.checked)
            document.getElementById("spanShowSel").innerText = "（全部显示）";
    }
    else {
        if (obj.checked == false) {
            document.getElementById('qx').checked = false;
        }
        else {
            var sum = document.getElementsByName('cbox').length;
            var i = 0;
            for (i = 0; i < sum; i++) {
                if (document.getElementsByName('cbox')[i].checked == false)
                    break;
            }
            if (i == sum) {
                document.getElementById('qx').checked = true;
                document.getElementById("spanShowSel").innerText = "（全部显示）";
            }
        }
    }
}

function SearchTable() {
    var key = document.getElementById("txtKey").value
    if (key != "搜索（所有）") {
        for (var i = tbSel.rows.length - 2; i > 0; i--) {
            if (tbSel.rows[i].cells(1).innerHTML.toString().indexOf(key) == -1) {
                tbSel.rows[i].style.display = "none";
            }
            else {
                tbSel.rows[i].style.display = "";
            }
        }
        document.getElementById("imgSee").src = "Images/close1.gif";
    }
    else {
        for (var i = tbSel.rows.length - 2; i > 0; i--) {
            tbSel.rows[i].style.display = "";
        }
        document.getElementById("imgSee").src = "Images/toSee2.gif";
    } 
}


 function Onblur() {
     var key = document.getElementById("txtKey").value;
     if (key == "") {
         document.getElementById("txtKey").value = "搜索（所有）";
     }
 }

 function SearchOrCancel() { 
    var key = document.getElementById("txtKey").value;
    if (key != "搜索（所有）") {
        document.getElementById("txtKey").value = "搜索（所有）";
    }
 }

 function Onfocus() {
     var key = document.getElementById("txtKey").value;
     if (key == "搜索（所有）") {
         document.getElementById("txtKey").value = "";
     }
 }

 function okOnClick(goalTabName, colIndex) {
     var result = "";
     var filnum = 0;
     for (var i = 1; i < tbSel.rows.length - 1; i++) {
         if (tbSel.rows[i].style.display != "none" && tbSel.rows[i].cells(0).firstChild.checked) {
             result += tbSel.rows[i].cells(1).innerText + ",";
             filnum = filnum + 1;
         }
     }
     if (filnum == tbSel.rows.length - 2)
         result = "全部";
     else
         result = result.substr(0, result.length - 1);
     var goalTab = document.getElementById(goalTabName);
     if (result != "全部") {
         for (var i = 1; i < goalTab.rows.length - 1; i++) {
             var cl = goalTab.rows[i].cells[colIndex].children.length;
             if (cl == 0)
                 cinfo = goalTab.rows[i].cells[colIndex].innerText == "" ? "（空白）" : goalTab.rows[i].cells[colIndex].innerText;
             else
                 cinfo = goalTab.rows[i].cells[colIndex].firstChild.value == "" ? "（空白）" : goalTab.rows[i].cells[colIndex].firstChild.value;
             if (goalTab.rows[i].style.display != "none") {
                 if (result.indexOf(cinfo) == "-1")
                     goalTab.rows[i].style.display = "none";
                 else
                     goalTab.rows[i].style.display = "";
             } 
         }

         if (filTab.join(",").indexOf(goalTabName + "!~!" + colIndex) == -1) {
             filTab.push(goalTabName + "!~!" + colIndex);
             filCondition.push(goalTabName + "!~!" + colIndex + "!~!" + result);
         }
         else {
             for (var i = 0; i < filCondition.length; i++) {
                 if (filCondition[i].indexOf(goalTabName + "!~!" + colIndex) != -1) {
                     filCondition[i] = goalTabName + "!~!" + colIndex + "!~!" + result;
                 }
             }
         }
         document.getElementById(goalTabName + "sel" + colIndex).src = "/i/shaixuan.png";
     }
     else {
         if (filTab.join(",").indexOf(goalTabName + "!~!" + colIndex) != -1) {
             var i=0;   
             for (i = 0; i < filTab.length; i++) {
                 if (filTab[i].toString().indexOf(goalTabName + "!~!" + colIndex) != -1)
                     break;
             }
             filTab.splice(0, i);
             filCondition.splice(0, i);
         }
         document.getElementById(goalTabName + "sel" + colIndex).src = "/i/xiala.png";
     }
     DivHidden();
 }