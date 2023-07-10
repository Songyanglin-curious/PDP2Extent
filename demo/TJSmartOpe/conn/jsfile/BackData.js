// JScript File -- Edit by Gud
function DoBkDataTimeOut() { top.location.href = "/ErrorPage.aspx?e=1"; }
function GetBkData(o) {
    var d0 = {
        isOK: true
	    , errCode: 0
	    , errMsg: ""
	    , value: null
	    , time: ""
	    , check: function (strOperate, silent) {
	        if (this.isOK) {
	            if ((typeof (silent) != "undefined") && (silent))
	                return true;
	            if (typeof (strOperate) != "undefined")
	            //alert(strOperate + "成功");
	                Ysh.Web.alerts(strOperate + "成功", 500);
	            return true;
	        }
	        if (this.errCode == 1) {
	            DoBkDataTimeOut();
	        } else {
	            alert((typeof (strOperate) == "undefined") ? this.errMsg : strOperate + "失败:" + this.errMsg);
	            if ((this.errCode == -2146823279) || (this.errCode == -2146827286)) { /* XXX 未定义,或者语法错误 */
	                top.location.href = "/ErrorPage.aspx?e=2&tm=" + this.time;
	            }
	        }
	        return false;
	    }
    }
    var d1 = o.value;
    d0.isOK = d1[0];
    if (d0.isOK) {
        d0.value = d1[1];
    } else {
        d0.errCode = d1[1];
        d0.errMsg = d1[2];
    }
    return d0;
}
/*
function ExecuteBack(f, tm) {
    var data = null;
    try {
        data = GetBkData(f());
    } catch (E) {
        data = GetBkData({ value: [false, E.number, E.message] });
    }
    if (typeof tm != "undefined")
        data.time = tm;
    return data;
}*/
