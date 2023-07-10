//引用
function Trim_(str) {
    return LTrim_(RTrim_(str));
}

function returnDOM_(domID) {
    return document.getElementById(domID);
}

function LTrim_(str) {
    var i;
    for (i = 0; i < str.length; i++) {
        if (str.charAt(i) != " " && str.charAt(i) != " ") break;
    }
    str = str.substring(i, str.length);
    return str;
}

function RTrim_(str) {
    var i;
    for (i = str.length - 1; i >= 0; i--) {
        if (str.charAt(i) != " " && str.charAt(i) != " ") break;
    }
    str = str.substring(0, i + 1);
    return str;
}



//文本框
//str 控件id
//txt 提示信息
//‘1’为不获取焦点
function r_txt(str, txt, type) {
    if (document.getElementById(str).value == "") {
        alert(txt);
        if (type != '1') {
            document.getElementById(str).focus();
        }
        return false;
    }
    return true;
}

//文本框正整数验证
function r_Num_txt(str, Messagestr, type) {
    if (!(/^[1-9]\d*$/.test(Trim_(document.getElementById(str).value)))) {
        alert(Messagestr)
        if (type != '1') {
            document.getElementById(str).focus();
        }
        return false;
    }
    return true;
}

//文本框非负整数且和数比较，文本框，比较值，1大于该数，0小于该数，报错信息
function r_Num2_txt(str, num, type, Messagestr) {
    if (/^[0-9]\d*$/.test(Trim_(document.getElementById(str).value))) {
        if (parseInt(type) == 0) {
            if (parseInt(document.getElementById(str).value) < parseInt(num)) {
                return true;
            }
        }
        else {
            if (parseInt(document.getElementById(str).value) > parseInt(num)) {
                return true;
            }
        }
    }

    alert(Messagestr)
    document.getElementById(str).focus();
    return false;

}

//文本框正实数验证
function r_float_txt(str, Messagestr, type) {
    if (/^[0-9]+(.[0-9]*)?$/.test(Trim_(document.getElementById(str).value))) {
    }
    else {
        alert(Messagestr)
        if (type != '1') {
            document.getElementById(str).focus();
            return false;
        }
    }
    return true;
}

//编辑器验证
function r_eWebEdit(str, txt) {
    if (str.getHTML() == "") {
        alert(txt);
        return false;
    }
    return true;
}

//服务器下拉列表验证
function r_ddl_u(str, txt) {
    if (document.getElementById(str).value == "") {
        alert(txt);
        document.getElementById(str).focus();
        return false;
    }
    return true;
}

//客户端下拉列表验证
function r_ddl_h(str, txt) {
    if (document.getElementById(str).value == "") {
        alert(txt);
        document.getElementById(str).focus();
        return false;
    }
    return true;
}

//密码验证
function r_pass(str, txt) {
    if (!/^[^ ]+$/.test(Trim_(document.getElementById(str).value))) {
        alert(txt);
        document.getElementById(str).focus();
        return false;
    }
    return true;
}

//密码两次是否相同
function r_pass2(str1, str2, txt) {
    var txt1;
    var txt2;
    txt1 = document.getElementById(str1).value;
    txt2 = document.getElementById(str2).value;
    if (txt1 != txt2) {
        alert(txt);
        document.getElementById(str2).focus();
        return false;
    }
    return true;
}

//隐藏层显示的时候，层内控件非空验证
function r_div_null(div_, str, txt) {
    if (document.getElementById(div_).style.display == "block") {
        if (document.getElementById(str).value == "") {
            alert(txt);
            document.getElementById(str).focus();
            return false;
        }
    }
    return true;
}

//复选框至少一个验证,需要把复选框放在同一个层中
function r_cbox(div_, txt) {
    var div_ = returnDOM_(div_); //层
    var obj = div_.getElementsByTagName("input"); //控件类型
    var Num = obj.length; //个数
    var i = 0;
    for (var i = 0; i < CbkLength; i++) {
        if (obj[i].checked) {
            i++;
        }
    }
    if (1 != 0) {
        alert(txt);
        return false;
    }
    return true;
}

