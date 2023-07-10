//将字符串转换成整数，空字符串转换为0
function Str2Int(Str) {
    if (Str == '') { return 0 }
    else { return parseInt(Str, 10) }
}
//转换时间为'00'格式:如'5'转换为'05'
function Trans00Format(time) {
    var timeStr = '' + time;
    if (timeStr.length == 1) {
        return '0' + timeStr;
    }
    else {
        return timeStr;
    }
}

//------------------------键盘输入时的辅助函数---------------------------------------------------------------------
//键盘输入时检查是否是数字0-9
function checkNumberHelp(obj, AlertTxt) {
    if (obj.value != '') {
        if (!validCharCheck(obj.value, '0123456789')) {
            if (AlertTxt != '') {
                alert(AlertTxt);
            }
            try { obj.focus() } catch (e) { }
            return false;
        }
    }
}
//键盘输入时检查数值范围
function checkIntRangeHelp(obj, DefaultValue, AlertTxt, MaxInt, MinInt) {
    if (obj.value == '' || isNaN(parseInt(obj.value, 10))) { obj.value = DefaultValue; return false }
    obj.value = parseInt(parseFloat(obj.value), 10) + ''
    if (MaxInt != null) {
        if (MaxInt < parseInt(obj.value, 10)) {
            if (AlertTxt != '') alert(AlertTxt)
            obj.value = DefaultValue
            try { obj.focus() } catch (e) { }
            return false
        }
    }
    if (MinInt != null) {
        if (MinInt > parseInt(obj.value, 10)) {
            if (AlertTxt != '') alert(AlertTxt)
            obj.value = DefaultValue
            try { obj.focus() } catch (e) { }
            return false
        }
    }
}
//----------------------有效性检查函数Check-----------------------------------------------------------------------------
//检查目标字串是否都使用合法字符集
function validCharCheck(objStr, Letters) {
    for (var i = 0; i < objStr.length; i++) {
        var CheckChar = objStr.charAt(i)
        if (Letters.indexOf(CheckChar) == -1) return false
    }
    return true
}
//检查目标字串是否使用了非法字符集
function novalidCharCheck(objStr, Letters) {
    for (var i = 0; i < objStr.length; i++) {
        var CheckChar = objStr.charAt(i)
        if (Letters.indexOf(CheckChar) >= 0) return false
    }
    return true
}
//-----------------------------------------------------table----------------------------------------------------  
//保留table的几行，其他删除。
function deleteRows(tbl, r) {
    while (tbl.rows.length > r) {
        tbl.deleteRow();
    }
}
//保留table的几列，其他删除。
function deleteCells(tbl, c) {
    if (tbl.rows.length == 0)
        return;
    while (tbl.rows(0).cells.length > c) {
        for (var i = 0; i < tbl.rows.length; i++) {
            tbl.rows(i).deleteCell();
        }
    }
}
function RemoveTrItem(tbl, tr) {
    if (tbl.rows.length == 0)
        return;
    if (typeof (tr) == "undefined")
        return;
    for (var i = 0; i < tbl.rows.length; i++) {
        if (tbl.rows(i) == tr)
            tbl.deleteRow(i);
    }
}
//---------------------------------------------------------检查输入是否正确------------------------------------------------------
function CheckIfFloat(s) {
    var f = parseFloat(s);
    if (isNaN(s))
        return false;
    return f == s;
}
function CheckIfInt(s) {
    var f = parseInt(s, 10);
    if (isNaN(s))
        return false;
    return f == s
}
//String对象添加trim方法
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    }
};

//StringPP类，add by subo 20130118
var StringPlusPlus = function () {
    //replaceAll：实现replace替换的完全版
    this.replaceAll = function (str, olds, news) {
        do {
            if (str.indexOf(olds) > -1)
                str = str.replace(olds, news);
            else {
                return str;
            }
        } while (true);
    }
    //format：实现类似于C#中的Format方法
    //示例：var test = StringPP.format("<input type='text' value='{0}' title='{0}'>", value);
    //等于：var test="<input type='text' value='"+value+"' title='"+value+"'>";
    this.format = function (str) {
        for (var i = 0; i < arguments.length - 1; i++) {
            str = this.replaceAll(str, "{" + i + "}", arguments[i + 1]);
        }
        return str;
    }
    //toInt：实现将合法字符串转换为整型数字，空转为0，非字符串返回null
    this.toInt = function (str) {
        if (str == '') {
            return 0;
        } else if (isNaN(str)) {
            return null;
        } else {
            return parseInt(str, 10);
        }
    }
    //toFloat：实现将合法字符串转换为浮点型数字，空转为0，非字符串返回null
    this.toFloat = function (str) {
        if (str == '') {
            return 0;
        } else if (isNaN(str)) {
            return null;
        } else {
            return parseFloat(str);
        }
    }
};
var StringPP = new StringPlusPlus();//实体化

if (!Array.prototype.erase) {
    Array.prototype.erase = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
                break;
        }
        if (i != this.length)
            this.splice(i, 1);
    }
};
if (!Array.prototype.hasvalue) {
    Array.prototype.hasvalue = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
                return true;
        }
        return false;
    }
};
//延迟多少毫秒
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
        return;
    }
}
//获得某个对象
//$ = function (id) {
//    return document.getElementById(id);
//}
//焦点自动到文本最后
function focusEnd() {
    var e = event.srcElement;
    var r = e.createTextRange();
    r.moveStart('character', e.value.length);
    r.collapse(true);
    r.select();
}
//设置时间菜单显示否
function SetDTReadOnly(obj, isreadonly) {
    var arrPart = new Array("year", "month", "day", "hour", "minute", "second");
    for (var i = 0; i < arrPart.length; i++) {
        var tempinput = document.getElementById(obj.id + "_input_" + arrPart[i]);
        tempinput.disabled = isreadonly;
    }
}
function getIEAbsTop(obj) {//得到网页上固定控件的y坐标
    var x, y;
    oRect = obj.getBoundingClientRect();
    x = oRect.left;
    y = oRect.top;
    return y;
}
function getIEAbsLeft(obj) {//得到网页上固定控件的x坐标
    var x, y;
    oRect = obj.getBoundingClientRect();
    x = oRect.left;
    y = oRect.top;
    return x;
}
function getParentTag(obj, tagName) {
    while (obj && obj.tagName != tagName)
        obj = obj.parentElement;
    return obj;
}
function SetDivActiveView(div) {
    var frmFilter = document.createElement("<iframe frameborder='0' src='' style=\"position: absolute; visibility: inherit; top: 0px; left: 0px; width: expression(this.parentNode.offsetWidth); height: expression(this.parentNode.offsetHeight); z-index: -1; filter='progid:dximagetransform.microsoft.alpha(style=0,opacity=0)';\"></iframe>");
    div.appendChild(frmFilter);
}
//弹出窗口
function ShowModalDialog(url, arg, filt) {
    var ua = navigator.userAgent.toLowerCase(); //客户端浏览器信息
    var size = "";
    if (window.ActiveXObject)//判断IE浏览器
        size = ua.match(/msie ([\d.]+)/)[1]; //得出IE的版本大小
    if (size == "6.0") {
        var filtarr = filt.split("dialogWidth:");
        if (filtarr.length == 2) {
            var iWidth = parseFloat(filtarr[1].substring(0, filtarr[1].indexOf(";")).replace("px", ""));
            filt = filtarr[0] + "dialogWidth:" + (iWidth + 20).toString() + "px" + filtarr[1].substring(filtarr[1].indexOf(";"));

            filtarr = filt.split("dialogHeight:");
            if (filtarr.length == 2) {
                var iWidth = parseFloat(filtarr[1].substring(0, filtarr[1].indexOf(";")).replace("px", ""));
                filt = filtarr[0] + "dialogHeight:" + (iWidth + 50).toString() + "px" + filtarr[1].substring(filtarr[1].indexOf(";"));
            }
        }
    }
    try{
    return window.showModalDialog(url, arg, filt);
    } catch (e) { alert("弹出窗口被阻止，无法获取对应信息"); return undefined; }
}
function OpenWindow(url, title, filt) {
    var ua = navigator.userAgent.toLowerCase(); //客户端浏览器信息
    var size = "";
    if (window.ActiveXObject)//判断IE浏览器
        size = ua.match(/msie ([\d.]+)/)[1]; //得出IE的版本大小
    if (size == "6.0") {
        var filtarr = filt.split("width=");
        if (filtarr.length == 2) {
            var iWidth = parseFloat(filtarr[1].substring(0, filtarr[1].indexOf(",")).replace("px", ""));
            filt = filtarr[0] + "width=" + (iWidth + 20).toString() + filtarr[1].substring(filtarr[1].indexOf(","));

            filtarr = filt.split("height=");
            if (filtarr.length == 2) {
                var iWidth = parseFloat(filtarr[1].substring(0, filtarr[1].indexOf(",")).replace("px", ""));
                filt = filtarr[0] + "height=" + (iWidth + 50).toString() + filtarr[1].substring(filtarr[1].indexOf(","));
            }
        }
    }
    try {
    return window.open(url, title, filt);
    } catch (e) {alert("弹出窗口被阻止，无法获取对应信息"); return undefined;}
}
var clrTableBack, clrTableFore;
function TableRowMoseOver() {
    var obj = getParentTag(event.srcElement, "TR");
    clrTableBack = obj.style.backgroundColor;
    clrTableFore = obj.style.color;
    obj.style.backgroundColor = "#dbdbdb";
    obj.style.color = "#444444";
}
function TableRowMouseOut() {
    var obj = getParentTag(event.srcElement, "TR");
    obj.style.backgroundColor = clrTableBack;
    obj.style.color = clrTableFore;
    var obj = event.srcElement;
}
function changeValue(val1, val2) {
    eval("var temp = " + val1 + ";" + val1 + "=" + val2 + ";" + val2 + "=temp;");
}
function ChangeUpper(iNum) {
    if (isNaN(iNum) || parseInt(iNum, 10) < 0)
        return "负数";
    var strAll = "";
    var iRank = 0;
    do {
        var iMod = iNum % 10;
        var strNum = ChangeNum(iMod);
        var strRank = ChangeRank(iRank);
        strAll = (strNum == "" && strRank != "" && strRank != "万" && strRank != "亿" ? "零" : (strNum + strRank)) + strAll;
        iNum = (iNum - iMod) / 10;
        iRank++;
    } //挨个向上一位一位的找转换
    while (iNum > 0);
    while (strAll.indexOf("零零") != -1)
        strAll = strAll.replace("零零", "零"); //多个0的时候合并
    strAll = strAll.replace(/零+$/, ""); //末位为0的舍去
    return strAll.replace(/^一十+/, "十"); //一十几开头的通俗读法为去掉一
}
function ChangeRank(iNum) {
    if (iNum < 0 || iNum > 10)
        return ""; //Int32的范围最高位数为百亿
    var arrRank = new Array("", "十", "百", "千", "万", "十", "百", "千", "亿", "十", "百");
    return arrRank[iNum];
}
function ChangeNum(iNum) {
    if (iNum < 0 || iNum > 9)
        return "";
    var arrNum = new Array("", "一", "二", "三", "四", "五", "六", "七", "八", "九");
    return arrNum[iNum];
}
function addStyle(content) {
    var style;
    if (document.all) {    //IE
        style = document.createStyleSheet();
        style.cssText = content;
    }
    else {
        style = document.createElement("style");
        style.type = "text/css";
        style.textContent = content;//Safari、Chrome 下innerHTML只读
    }
    try { document.getElementsByTagName("head")[0].appendChild(style); } catch (e) { } //IE Error:不支持此接口
}; 
//---------------------------------------------------------控件获取和操作------------------------------------------------------
function GetParentControl(obj, tagname) {
    while (obj) {
        if (obj.tagName == tagname) {
            return obj;
        }
        obj = obj.parentElement;
    }
    return null;
}
function DisplayNextTr(o) {
    if (!o)
        o = event.srcElement;
    var tr = GetParentControl(o, "TR");
    tr = tr.nextSibling;
    if (tr.style.display == "none") {
        o.src = "/i/todayworkd.gif";
        tr.style.display = "";
    }
    else {
        o.src = "/i/todayworku.gif";
        tr.style.display = "none";
    }
    return false;
}
function GetParentWidth(obj) {
    if (!obj)
        return 0;
    var p = this.parentNode;
    if (!p)
        return 0;
    return p.offsetWidth;
}
function GetParentHeight(obj) {
    if (!obj)
        return 0;
    var p = this.parentNode;
    if (!p)
        return 0;
    return p.offsetHeight;
}
function SetCtrlFitMinWidth(obj, w) {
    var nBodyClient = document.body.clientWidth;
    if (nBodyClient > w)
        obj.style.width = "100%";
    else
        obj.style.width = w + "px";
}
//----------------------------------------------------脚本操作---------------------------------------------
function addScript(strLink) {
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = strLink;
    try {
        oHead.appendChild(oScript);
    }
    catch (e) {
    }
}
function includeStyle(url) {
    var style = document.createElement("link");
    style.type = "text/css";
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", url);
    document.getElementsByTagName("head")[0].appendChild(style);
}
//添加页面样式
function addStyle(content) {
    var style;
    if (document.all)    //IE
    {
        style = document.createStyleSheet();
        style.cssText = content;
    }
    else {
        style = document.createElement("style");
        style.type = "text/css";
        //style.innerHTML = content;//Safari、Chrome 下innerHTML只读
        style.textContent = content;
    }
    try { document.getElementsByTagName("head")[0].appendChild(style); } catch (e) { } //IE Error:不支持此接口
}

//获取request
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
