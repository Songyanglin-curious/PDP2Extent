var onduty;
var o = ExecuteBack(function () { return YshGrid.Execute("~/Bin/SiChuanLib.dll:SiChuanLib.EventOther.IfOnDutyPer", []); });
if (o.check("", true)) {
    onduty = o.value;    
}
function SetRight(type) {
    var arrAll = document.all;
    var name = [];
    for (i = 0; i < arrAll.length; i++) {
        switch (arrAll[i].tagName) {
            case "INPUT":
                if (arrAll[i].className == "btnBack")
                    break;
                else if (arrAll[i].className == "btnSave") {
                    arrAll[i].className = "btnUnSave";
                }
                else if (arrAll[i].className == "btnDelete") {
                    arrAll[i].className = "btnUnDelete";
                }
                else if (arrAll[i].className == "btnAdd") {
                    arrAll[i].className = "btnUnAdd";
                }
                //add by wangbinbin 20130120
                if (arrAll[i].type == "text")
                    arrAll[i].disabled = "true";
                arrAll[i].onclick = function () { alert("您不是当值调度员，没有权限操作！"); return false; };
                break;
                //add end
            case "SELECT":
            case "TEXTAREA":
                arrAll[i].disabled = true;
                break;
            default:
                break;
        }        
    }
}
function CheckFinish(plcCtl, FishCtrl, eventid) {
    if (!plcCtl.checked) {
        if (!confirm("确定要取消终结吗？")) {
            plcCtl.checked = true;
            return false;
        }
    }
    else {
        if (FishCtrl.checked == true) {
            alert("该事件未完成!");
            plcCtl.checked = false;
            return false;
        }
        else {
            if (!confirm("确定要终结该事件吗？")) {
                plcCtl.checked = false;
                return false;
            }
        }
    }
    SaveEventInfo();
    SetRight();
}
function CheckNum(obj) {
    var num = obj.value.replace(/[ ]/g, "");
    if (isNaN(num)) {
        alert("需要输入数字！");
        obj.focus();
        return false;
    }
    if (num == "")
        obj.value = 0;
    return true;
}
function GetDateDiff(d1, d2) {
    var hour = 60 * 60 * 1000;
    try {
        var date1 = d1.split(" ");
        var date1Arr1 = date1[0].split("-");
        var date1Arr2 = date1[1].split(":");
        var checkDate = new Date(date1Arr1[0], date1Arr1[1] - 1, date1Arr1[2], date1Arr2[0], date1Arr2[1], date1Arr2[2]);
        var checkTime = checkDate.getTime();
        var date2 = d2.split(" ");
        var date2Arr1 = date2[0].split("-");
        var date2Arr2 = date2[1].split(":");
        var checkDate2 = new Date(date2Arr1[0], date2Arr1[1] - 1, date2Arr1[2], date2Arr2[0], date2Arr2[1], date2Arr2[2]);
        var checkTime2 = checkDate2.getTime();
        
        var cha = (checkTime - checkTime2) / hour;
        return cha;
    }
    catch (e) {
        return false;
    }
}
//end fun