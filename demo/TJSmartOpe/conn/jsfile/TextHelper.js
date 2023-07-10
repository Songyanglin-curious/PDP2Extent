// JScript File -- Edit by Gud
function htmlencode(str) { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function htmldecode(str) { return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot/g, "\"").replace(/&amp;/g, "&"); }
function trim(str) {if (typeof str == "undefined") return ""; return str.replace(/^\s*/g, "").replace(/\s*$/g, ""); }
function alertControl(o, m) { alert(m); o.focus(); o.select(); return false; }
function alertEmpty(obj, emptymsg) {
    var v = trim(obj.value);
    obj.value = v;
    if (v != "")
        return false;
    alert(emptymsg);
    obj.focus();
    return true;
}

function checkNumber(obj, name, bCanNULL, bIsInt, minValue, maxValue, unit, bEqualMin, bEqualMax) {
    var s = trim(obj.value);
    if (s == "") {
        if (!bCanNULL)
            return alertControl(obj, name + "不能为空！");
        return true;
    }
    if (isNaN(s))
        return alertControl(obj, name + "必须为数字！");
    var v = parseFloat(s, 10);
    if ((typeof (minValue) != "undefined") && (minValue != null)) {
        if ((typeof (bEqualMin) != "undefined") && (!bEqualMin)) {
            if (v <= minValue)
                return alertControl(obj, name + "必须大于" + minValue + (unit ? unit : ""));
        } else {
            if (v < minValue)
                return alertControl(obj, name + "必须大于或等于" + minValue + (unit ? unit : ""));
        }
    }
    if ((typeof (maxValue) != "undefined") && (maxValue != null)) {
        if ((typeof (bEqualMax) != "undefined") && (!bEqualMax)) {
            if (v >= maxValue)
                return alertControl(obj, name + "必须小于" + maxValue + (unit ? unit : ""));
        } else {
            if (v > maxValue)
                return alertControl(obj, name + "必须小于或等于" + maxValue + (unit ? unit : ""));
        }
    }
    if (bIsInt) {
        if (v != parseInt(v, 10))
            return alertControl(obj, name + "必须是整数！");
    }
    return true;
}
function toFloat(str, def) {
    if (isNaN(str) || (str === ""))
        return def;
    return parseFloat(str);
}
function toInt(str, def) {
    if (isNaN(str) || (str === ""))
        return def;
    return parseInt(str, 10);
}
// JScript File -- Add by ChenHui
function checkPhone(obj, name, bCanNULL) {
    var s = trim(obj.value);
    if (s == "") {
        if (!bCanNULL)
            return alertControl(obj, name + "不能为空！");
        return true;
    }
    var filter = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
    if(filter.test(s))
        return alertControl(obj, name + "格式不正确！");
    else 
        return true;
}
function checkEmail(obj, name, bCanNULL) {
    var s = trim(obj.value);
    if (s == "") {
        if (!bCanNULL)
            return alertControl(obj, name + "不能为空！");
        return true;
    }
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if (reg.test(s))
        return alertControl(obj, name + "格式不正确！");
    else
        return true;
}

function DateAdd(interval,number,date){
    switch(interval.toLowerCase()){
        case "y": return new Date(date.setFullYear(date.getFullYear()+number));
        case "m": return new Date(date.setMonth(date.getMonth()+number));
        case "d": return new Date(date.setDate(date.getDate()+number));
        case "w": return new Date(date.setDate(date.getDate()+7*number));
        case "h": return new Date(date.setHours(date.getHours()+number));
        case "n": return new Date(date.setMinutes(date.getMinutes()+number));
        case "s": return new Date(date.setSeconds(date.getSeconds()+number));
        case "l": return new Date(date.setMilliseconds(date.getMilliseconds()+number));
    }
}

function DateDiff(interval,date1,date2){
    var long = date2.getTime() - date1.getTime(); //相差毫秒
    switch(interval.toLowerCase()){
        case "y": return parseInt(date2.getFullYear() - date1.getFullYear());
        case "m": return parseInt((date2.getFullYear() - date1.getFullYear())*12 + (date2.getMonth()-date1.getMonth()));
        case "d": return parseInt(long/1000/60/60/24);
        case "w": return parseInt(long/1000/60/60/24/7);
        case "h": return parseInt(long/1000/60/60);
        case "n": return parseInt(long/1000/60);
        case "s": return parseInt(long/1000);
        case "l": return parseInt(long);
    }
}