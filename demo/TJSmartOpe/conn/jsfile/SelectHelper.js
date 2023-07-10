// JScript File -- Edit by Gud
function moveTo(sSrc, sObj) {
    var c = sSrc.options.length;
    var i = c - 1;
    for (; i >= 0; i--) {
        var opt = sSrc.options[i];
        if (opt.selected) {
            var opt2 = new Option;
            opt2.value = opt.value;
            opt2.text = opt.text;
            sObj.options.add(opt2);
            sSrc.options[i] = null;
            delete opt2;
        }
    }
}

function addOpt(sObj, v, t) {
    var l = sObj.options.length;
    for (var i = 0; i < l; i++) {
        var opt = sObj.options[i];
        if (opt.value == v)
            return;
    }
    var opt = new Option;
    opt.value = v;
    opt.text = t;
    sObj.options.add(opt);
    delete opt;
}

function delSelectOpts(sSrc) {
    var l = sSrc.options.length;
    for (var i = l - 1; i >= 0; i--) {
        var opt = sSrc.options[i];
        if (opt.selected)
            sSrc.options[i] = null;
    }
}

function getSelectItems(sSrc) {
    var txt = "";
    var l = sSrc.options.length;
    for (var i = 0; i < l; i++) {
        var opt = sSrc.options[i];
        if (txt == "")
            txt = opt.value + "," + opt.text;
        else
            txt += "," + opt.value + "," + opt.text;
    }
    return txt;
}

function getSelectItemValues(sSrc) {
    var txt = "";
    var l = sSrc.options.length;
    for (var i = 0; i < l; i++) {
        var opt = sSrc.options[i];
        if (txt == "")
            txt = opt.value;
        else
            txt += "," + opt.value;
    }
    return txt;
}

function getSelectItemTexts(sSrc) {
    var txt = "";
    var l = sSrc.options.length;
    for (var i = 0; i < l; i++) {
        var opt = sSrc.options[i];
        if (txt == "")
            txt = opt.text;
        else
            txt += "," + opt.text;
    }
    return txt;
}

function delItemByValue(sObj, v) {
    var l = sObj.options.length;
    for (var i = 0; i < l; i++) {
        if (sObj.options[i].value == v) {
            sObj.options[i] = null;
            return;
        }
    }
}

function selectIndex(s, v) {
    for (var i = 0; i < s.options.length; i++)
        if (s.options[i].value == v) {
            s.selectedIndex = i;
            return;
        }
}

function selectValue(s, v) {
    for (var i = 0; i < s.options.length; i++)
        if (s.options[i].innerText == v) {
            s.selectedIndex = i;
            break;
        }
}

function findIndexB(s, i0, i1, v) {
    if (i1 < i0 + 4) {
        for (var i = i0; i < i1; i++) {
            if (s.options[i].value == v)
                return i;
        }
        return -1;
    }
    var im = parseInt((i0 + i1) / 2, 10);
    var vv = s.options[im].value;
    if (vv == v)
        return im;
    if (vv > v)
        return findIndexB(s, i0, im, v);
    return findIndexB(s, im + 1, i1, v);
}
function getSelectItemText(sObj) {
    var selectedIdx = sObj.selectedIndex;
    if (selectedIdx == -1)
        return "";
    return sObj.options[selectedIdx].text;
}
function getItemTextByValue(sSrc, v) {
    var l = sSrc.options.length;
    for (var i = 0; i < l; i++) {
        var opt = sSrc.options[i];
        if (opt.value != v)
            continue;
        return opt.text;
    }
    return "";
}
function getSelItemValue(sobj) {
    var selectedIdx = sObj.selectedIndex;
    if (selectedIdx == -1)
        return "";
    return sObj.options[selectedIdx].value;
}

function getSelectOptionsHTML(arrKey, arrName, name) {
    var str = "";
    for (var i = 0; i < arrKey.length; i++) {
        if (arrName[i] == name)
            str += "<OPTION selected value='" + arrKey[i] + "'>" + arrName[i] + "</OPTION>";
        else
            str += "<OPTION value='" + arrKey[i] + "'>" + arrName[i] + "</OPTION>";
    }
    return str;
}

function addSelectOptions(sObj, arrKey, arrName) {
    for (var i = 0; i < arrKey.length; i++) {
        var opt = new Option;
        opt.value = arrKey[i];
        opt.text = arrName[i];
        sObj.options.add(opt);
        delete opt;
    }
}

function getSelectHTML(arrKey, arrName, name) {
    return "<SELECT STYLE='width:100%'>" + getSelectOptionsHTML(arrKey, arrName, name) + "</SELECT>";
}

function getSelectText(arrKey, arrName, v) {
    for (var i = 0; i < arrKey.length; i++) {
        if (arrKey[i] == v)
            return arrName[i];
    }
    return v;
}
