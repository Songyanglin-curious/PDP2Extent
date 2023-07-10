
function FT_IsArray(v) { return (v instanceof Array); } //是否为列表
function FT_IsField(v) { return typeof (v.length) == "undefined"; }
function FT_ArrayIndexOf(arr, v) { for (var i = 0; i < arr.length; i++) { if (arr[i] == v) return i; }; return -1; }
function FT_ArrayClone(v) { if (!FT_IsArray(v)) return v; var a = []; for (var i = 0; i < v.length; i++) { a.push(v[i]); }; return a; }
function FT_IsInArray(v, arr) { if (null == arr) return false; if (typeof (arr.length) == "undefined") return v == arr; for (var i = 0; i < arr.length; i++) { if (FT_IsInArray(v, arr[i])) return true; }; return false; }
function FT_ArrayResize(arr, sz, def) { if (typeof def == "undefined") def = ""; for (var i = arr.length; i < sz; i++) { arr.push(def); } }
function FT_ArrayResizeToArray(arr, sz) { var i = 0; for (; i < arr.length; i++) { var item = arr[i]; if (!FT_IsArray(item)) { var subarr = []; subarr.push(item); arr[i] = subarr; } }; for (; i < sz; i++) { arr.push([]); } }
function FT_ArrayGetTotalLength(valuearray, sidx, lngth) { if (valuearray == null) return 0; if (!FT_IsArray(valuearray)) { return (sidx <= 0) ? 1 : 0; }; var lng = 0; var eidx = valuearray.length; if (lngth >= 0) { eidx = Math.min(eidx, sidx + lngth); }; for (var i = sidx; i < eidx; i++) { lng += FT_ArrayGetTotalLength(valuearray[i], 0, -1); }; return lng; }
function FT_ParseNumber(v, f) { var db = parseFloat(v); if (isNaN(db)) return v; if (f.substr(f.length - 1, 1) == "%") { var ff = parseInt(f.substr(0, f.length - 1), 10); if (isNaN(ff) || ff < 0) return v; return (db * 100).toFixed(ff) + "%"; }; var ff = parseInt(f, 10); if (isNaN(ff) || ff < 0) return v; return db.toFixed(ff); }
function FT_ParseTime(v, f) {
    var ff = parseInt(f, 10);
    var sep1, sep2, sep3, sep4, sep5, len;
    var tt = [0, 0, 0, 0, 0, 0];
    len = v.length;
    sep1 = v.indexOf("-");
    if (sep1 < 0) return v;
    sep2 = v.indexOf("-", sep1 + 1);
    if (sep2 < 0) return v;
    sep3 = v.indexOf(" ", sep2 + 1);
    if (sep3 >= 0) {
        sep4 = v.indexOf(":", sep3 + 1);
        if (sep4 < 0) return v;
        sep5 = v.indexOf(":", sep4 + 1);
        if (sep5 < 0) return v;
        tt[3] = parseInt(v.substring(sep3 + 1, sep4), 10);
        tt[4] = parseInt(v.substring(sep4 + 1, sep5), 10);
        tt[5] = parseInt(v.substring(sep5 + 1, len), 10);
    } else {
        sep3 = len;
    }
    tt[0] = parseInt(v.substring(0, sep1), 10);
    tt[1] = parseInt(v.substring(sep1 + 1, sep2), 10);
    tt[2] = parseInt(v.substring(sep2 + 1, sep3), 10);
    var dt = new Date(tt[0], tt[1] - 1, tt[2], tt[3], tt[4], tt[5]);
    var arrWeek = ["日", "一", "二", "三", "四", "五", "六"]
    for (var i = 1; i < 6; i++) { if (tt[i] < 10) { tt[i] = "0" + tt[i]; } }
    if (isNaN(ff) || (ff < 0)) {
        var vv = f;
        vv = vv.replace("[yy]", ((tt[0] % 100) < 10) ? "0" + (tt[0] % 100) : (tt[0] % 100));
        vv = vv.replace("[y]", tt[0]);
        vv = vv.replace("[m]", tt[1]);
        vv = vv.replace("[d]", tt[2]);
        vv = vv.replace("[hh]", tt[3]);
        vv = vv.replace("[mm]", tt[4]);
        vv = vv.replace("[ss]", tt[5]);
        vv = vv.replace("[w]", arrWeek[dt.getDay()]);
        return vv;
    } else {
        var bFlag = [false, false, false, false, false, false, false];
        for (i = 0; i < 7; i++) { if (ff % 10 != 0) { bFlag[i] = true; }; ff = parseInt(ff / 10, 10); if (ff < 1) break; }
        var vv = "", uu = (bFlag[6]) ? "年月日时分秒" : "-- :: ";
        for (i = 5; i >= 0; i--) { if (bFlag[i]) { vv += tt[5 - i] + uu.substr(5 - i, 1); } }
        return bFlag[6] ? vv : vv.substring(0, vv.length - 1);
    }
}
function FT_ParseSpan(v, f) {
    var vv = parseInt(v, 10);
    if (isNaN(vv)) return v;
    var ff = parseInt(f, 10);
    if (isNaN(ff) || (ff < 0)) return v;
    var bFlag = [false, false, false, false, false];
    for (var i = 0; i < 5; i++) { if (ff % 10 != 0) { bFlag[i] = true; }; ff = parseInt(ff / 10, 10); if (ff < 1) break; }
    var bNextFlag = [false, false, false, false];
    for (i = 0; i < 4; i++) { for (var j = 0; j < i; j++) { if (bFlag[j]) { bNextFlag[i] = true; break; } } }
    var rr = [24, 60, 60, 1];
    var uu = (bFlag[4]) ? ["天", "小时", "分钟", "秒"] : [" ", ":", ":", ""];
    var str = "";
    var r = 86400;
    var bFill = [false, true, true, true];
    for (i = 0; i < 4; i++) {
        if (bFlag[3 - i]) {
            var m = parseInt(vv / r, 10);
            var bNext = bNextFlag[3 - i];
            if (bFlag[4]) {
                if (((bNext) && (m != 0)) || (!bNext)) { str += m + uu[i]; }
            } else {
                if (bFill[i] && (m < 10)) { str += "0"; }; str += m; if (bNext) { str += uu[i]; }
            }
            vv %= r;
        }
        r /= rr[i];
    }
    return str;
}
function FT_ZWByUnit(v, u, d) {
    var str = FT_ZhongWenNumber(parseInt(v / u, 10));
    str += d;
    var n = v % u;
    if (n == 0)
        return str;
    if (n < (u / 10))
        str += "零";
    if ((n < 20) && (n > 9))
        str += "一";
    return str + FT_ZhongWenNumber(n);
}
function FT_ZhongWenNumber(v) {
    if (v > 99999999)
        return FT_ZWByUnit(v, 100000000, "亿");
    if (v > 9999)
        return FT_ZWByUnit(v, 10000, "万");
    if (v > 999)
        return FT_ZWByUnit(v, 1000, "千");
    if (v > 99)
        return FT_ZWByUnit(v, 100, "百");
    if (v > 9) {
        var ten = parseInt(v / 10, 10);
        var str = (ten == 1) ? "" : "零一二三四五六七八九".substr(ten, 1);
        str += "十";
        var n = v % 10;
        if (n == 0)
            return str;
        return str + FT_ZhongWenNumber(n);
    }
    return "零一二三四五六七八九".substr(v, 1);
}
function FT_ToZhongWen(v, f) {
    var vv = parseInt(v, 10);
    if (isNaN(vv)) return v;
    if (vv < 0)
        return "负" + FT_ZhongWenNumber(-vv);
    if (vv == 0)
        return "零";
    return FT_ZhongWenNumber(vv);
}
/*辅助函数部分结束*/
function C_Rect() {
    return { c0: 0,
        r0: 0,
        c1: 0,
        r1: 0,
        cm: 1,
        rm: 1,
        getOffset: function (c, r) { var rect = C_Rect(); rect.c0 = c + this.c0; rect.c1 = c + this.c1; rect.r0 = r + this.r0; rect.r1 = r + this.r1; rect.cm = this.cm; rect.rm = this.rm; return rect; },
        getFillItems: function () { return parseInt((this.r1 - this.r0 + 1) / this.rm, 10) * parseInt((this.c1 - this.c0 + 1) / this.cm, 10); }
    };
}

function FT_AppendOffset(fieldarray, r) {
    if (FT_IsField(fieldarray)) {
        fieldarray._rects.push(fieldarray._rects[0].getOffset(0, r));
    } else {
        for (var i = 0; i < fieldarray.length; i++)
            FT_AppendOffset(fieldarray[i], r);
    }
}

function FT_NotifyInsertRow(fillobj, template, r, count, group, s, rIdx, bMerge, noeffect) {
    for (var i = 0; i < template.getFieldCount(); i++) {
        var f = template.field(i);
        if (FT_IsInArray(f, noeffect))
            continue;
        if (f.isInArray(group)) {
            if (f.isVGroup())
                FT_VGroupInsertRows(fillobj, f, count, group.length, s, bMerge);
            else {
                FT_InsertRows(fillobj, f, count, s, rIdx, bMerge);
            }
            continue;
        }
        for (var j = 0; j < f._rects.length; j++) {
            if (f._rects[j].r1 < r - 1)
                continue;
            if (f._rects[j].r0 < r) {
                FT_InsertRows(fillobj, f, count, s, j, bMerge);
                break;
            } else {
                f._rects[j].r0 += count;
                f._rects[j].r1 += count;
            }
        }
    }
}

function FT_NotifyInsertCol(fillobj, template, c, count, group, s, rIdx, bMerge, noeffect) {
    for (var i = 0; i < template.getFieldCount(); i++) {
        var f = template.field(i);
        if (FT_IsInArray(f, noeffect))
            continue;
        if (f.isInArray(group)) {
            FT_InsertCols(fillobj, f, count, s, rIdx, bMerge);
            continue;
        }
        for (var j = 0; j < f._rects.length; j++) {
            if (f._rects[j].c1 < c - 1)
                continue;
            if (f._rects[j].c0 < c) {
                FT_InsertCols(fillobj, f, count, s, j, bMerge);
                break;
            } else {
                f._rects[j].c0 += count;
                f._rects[j].c1 += count;
            }
        }
    }
}

function FT_VGroupInsertRows(fillobj, field, count, groupitems, s, bMerge) {
    var rect = field._rects[0];
    for (var i = 0; i < parseInt(count / groupitems, 10); i++) {
        var rectNew = new C_Rect();
        rectNew.c0 = rect.c0;
        rectNew.c1 = rect.c1;
        rectNew.rm = rect.rm;
        rectNew.cm = rect.cm;
        rectNew.r0 = rect.r0 + (1 + i) * groupitems;
        rectNew.r1 = rectNew.r0 + rect.r1 - rect.r0;
        field._rects.push(rectNew);
    }
}

function FT_InsertRows(fillobj, field, count, s, rectidx, bMerge) {
    var rect = field._rects[rectidx];
    var rLast = rect.r1 + count;
    rect.r1 = rLast;
    var rects = [rect];
    for (var i = rectidx + 1; i < field._rects.length; i++) {
        var rtTemp = field._rects[i];
        if (rtTemp.r0 > rect.r0)
            rtTemp.r0 += count;
        if (rtTemp.r0 == rect.r0)
            rects.push(rtTemp);
        rtTemp.r1 += count;
    }
    if (!field.isInc()) {
        if (field._rects.length < 2)
            bMerge = false;
    }
    if (!bMerge)
        return;
    for (var rr = 0; rr < rects.length; rr++) {
        rect = rects[rr];
        var c = rect.c0;
        if ((rect.rm <= 1) && (rect.cm <= 1))
            continue;
        for (var r = 0; r < count; r += rect.rm)
            fillobj.mergeCells(c, rLast - r - rect.rm + 1, c + rect.cm - 1, rLast - r, s);
    }
}

function FT_InsertCols(fillobj, field, count, s, rectidx, bMerge) {
    var rect = field._rects[rectidx];
    var cLast = rect.c1 + count;
    rect.c1 = cLast;
    var rects = [rect];
    for (var i = rectidx + 1; i < field._rects.length; i++) {
        var rtTemp = field._rects[i];
        if (rtTemp.c0 > rect.c0)
            rtTemp.c0 += count;
        if (rtTemp.c0 == rect.c0)
            rects.push(rtTemp);
        rtTemp.c1 += count;
    }
    if (!field.isVInc()) {
        if (field._rects.length < 2)
            bMerge = false;
    }
    if (!bMerge)
        return;
    for (var rr = 0; rr < rects.length; rr++) {
        rect = rects[rr];
        var r = rect.r0;
        if ((rect.rm <= 1) && (rect.cm <= 1))
            continue;
        for (var c = 0; c < count; c += rect.cm)
            fillobj.mergeCells(cLast - c - rect.cm + 1, r, cLast - c, r + rect.rm - 1,s);
    }
}

function FT_GetBorderRow(fieldarray, borders) {
    for (var i = 0; i < fieldarray.length; i++) {
        var tmp = fieldarray[i];
        if (FT_IsField(tmp)) {
            borders.mergeField(tmp);
        } else {
            for (var j = 0; j < tmp.length; j++)
                borders.mergeField(tmp[j]);
        }
    }
}

function CTemplateContent() {
    this.contentFields = [];
    this.contentValues = [];
    this.contentRowRanges = [];
    this.noGroup = false;//需不需要分组功能

    this.getFieldIndex = function (fieldname) {
        for (var i = 0; i < this.contentFields.length; i++) {
            if (this.contentFields[i] == fieldname)
                return i;
        }
        return -1;
    }

    this.add = function (field, value, rrs) {
        var v = null;
        if (value == null) {
            v = [];
        } else {
            if (FT_IsArray(value)) {
                v = value;
            } else {
                v = [value];
            }
        }
        this.contentValues.push(v);
        this.contentFields.push(field);
        if (rrs == null) {
            rrs = [];
            if (FT_IsArray(v)) {
                for (var i = 0; i < v.length; i++)
                    rrs.push(1);
            }
        }
        else {//把字符串变成整数
            for (var i = 0; i < rrs.length; i++) {
                rrs[i] = parseInt(rrs[i]);
            }
        }
        this.contentRowRanges.push(rrs);
    }

    this.attachValue = function (template) {
        for (var i = 0; i < this.contentFields.length; i++) {
            var idx = template.getFieldIndex(this.contentFields[i]);
            if (idx < 0)
                continue;
            var field = template.field(idx);
            field._value = FT_ArrayClone(this.contentValues[i]);
            field._rrs = this.contentRowRanges[i];
            //wanglei add
            //判断是否是二维数据           
            if (field._value.length > 0 && FT_IsArray(field._value[0])) {
                field._isMore = true;
                field._vLength = field._value[0].length;
            }
        }
    }

    //wanglei 2011-12-14 add
    //创建PAGE类型的字段做需要的空间
    this.createPageTypeFieldsNeedSpace = function (template, fillobj, s) {
        for (var i = 0; i < template.getFieldCount(); i++) {
            var field = template.field(i);
            if (field._type == "PAGE") {
                if (field._value.length == 0) return;
                var rect = field._rects[0];
                var rSpace = rect.r1 - rect.r0 + 1; //当前已分配的行
                var cSpace = rect.c1 - rect.c0 + 1; //当前已分配的列
                var isH = field.isH(); //是否横向排列
                var insertR = 0; //要插入的行数
                var insertStartR = rect.r1 + 1; //插入起始行
                var insertC = 0; //要插入的列数
                var insertStartC = rect.c1 + 1; //插入起始列
                for (var j = 0; j < field._value.length; j++) {
                    var sheetIndex = fillobj.getSheetIndex(field._value[j]);
                    var sheetR = fillobj.getRows(sheetIndex) - 1;
                    var sheetC = fillobj.getCols(sheetIndex) - 1;
                    if (isH) {
                        if (insertR < sheetR) {
                            insertR = sheetR;
                        }
                        insertC += sheetC;
                    }
                    else {
                        insertR += sheetR;
                        if (insertC < sheetC) {
                            insertC = sheetC;
                        }
                    }
                }
                if (insertR > rSpace) {
                    insertR = insertR - rSpace;
                }
                else {
                    insertR = 0;
                }
                if (insertR > 0) {
                    fillobj.insertRow(insertStartR, insertR, s);
                    var h = fillobj.getRowHeight(rect.r0, s);
                    for (var r = insertStartR; r < insertStartR + insertR; r += rect.rm)
                        fillobj.setRowHeight(h, r, s);
                    FT_NotifyInsertRow(fillobj, template, insertStartR, insertR, field, s, 0, true, null);
                }
                if (insertC > cSpace) {
                    insertC = insertC - cSpace;
                }
                else {
                    insertC = 0;
                }

                if (insertC > 0) {
                    fillobj.insertCol(insertStartC, insertC, s);
                    var h = fillobj.getColWidth(rect.c0, s);
                    for (var c = insertStartC; c < insertStartC + insertC; c += rect.cm)
                        fillobj.setColWidth(h, c, s);
                    FT_NotifyInsertCol(fillobj, template, insertStartC, insertC, field, s, 0, true, null);
                }
            }
        }
    }

    this.createSameTypeFields = function (template, fillobj, s) {
        for (var i = 0; i < template.getFieldCount(); i++) {
            var field = template.field(i);
            if (field._type == "SAME") {
                var sameIndex = template.getFieldIndex(field._style[0]);
                if (sameIndex < 0)
                    continue;
                var sameField = template.field(sameIndex);
                field._type = sameField._type;
                if (sameField._value == null)
                    continue;
                field._value = FT_ArrayClone(sameField._value);
                field._rrs = sameField._rrs;
                field._style = sameField._style;
                continue;
            }
            if (field._type == "JOIN") {
                var joinField = field;
                do {
                    var joinIndex = template.getFieldIndex(joinField._style[0]);
                    if (joinIndex < 0) {
                        joinField = null;
                        break;
                    }
                    var joinField = template.field(joinIndex);
                } while (joinField._rects.length == 0);
                if (joinField == null)
                    continue;
                joinField._isJoint = true;
                for (var j = 0; j < field._rects.length; j++) {
                    var rect = field._rects[j];
                    joinField._rects.push(rect);
                    for (var c = rect.c0; c <= rect.c1; c += rect.cm) {
                        for (var r = rect.r0; r <= rect.r1; r += rect.rm)
                            fillobj.setCellString(c, r, s, "");
                    }
                }
                field._rects = [];
                continue;
            }
            if (field._type == "INDEXBY") {
                var byIndex = template.getFieldIndex(field._style[0]);
                if (byIndex < 0)
                    continue;
                var fBy = template.field(byIndex);
                field._type = "NUMSTR";
                if (fBy._value == null)
                    continue;
                field._value = [];
                for (var j = 0; j < fBy._value.length; j++) {
                    if (fBy._value[j] === "") {
                        field._value.push("");
                        continue;
                    }
                    var n = 0;
                    for (var k = 0; k < fBy._value.length; k++) {
                        if (fBy._value[k] === "")
                            continue;
                        if (parseFloat(fBy._value[k]) > parseFloat(fBy._value[j]))
                            n++;
                    }
                    field._value.push(n + 1);
                }
                field._rrs = fBy._rrs;
                field._style = fBy._style;
                continue;
            }
            //Add by gud 20121006
            if (field._type == "LIST") {
                if (field._format.substring(0, 2) == "o:") { // 直接是value和text，不用再关联field
                    var options = field._format.substring(2).split("&&&");
                    var valuearray = [];
                    var textarray = [];
                    for (var j = 0; j < options.length - 1; j += 2) {
                        valuearray.push(options[j]);
                        textarray.push(options[j + 1]);
                    }
                    field._format = [valuearray, textarray];
                } else {
                    var relatefields = field._format.split("&&&");
                    var valuefield = relatefields[0];
                    var textfield = valuefield;
                    if (relatefields.length > 1)
                        textfield = relatefields[1];
                    var valuefieldidx = this.getFieldIndex(valuefield);
                    var textfieldidx = this.getFieldIndex(textfield);
                    if ((valuefieldidx < 0) || (textfieldidx < 0)) {
                        field._format = [[], []];
                        continue;
                    }
                    field._format = [this.contentValues[valuefieldidx], this.contentValues[textfieldidx]];
                }
            }
        }
    }

    this.splitString = function (fillobj, c, r, s, v, w) {
        var array0 = [];
        if (v == "") {
            array0.push("");
        } else {
            if (v instanceof Array) {
                for (var i = 0; i < v.length; i++) {
                    array0.push(this.splitString(fillobj, c, r, s, v[i], w));
                }
            } else {
                fillobj.splitLines(array0, c, r, s, w, v, -1);
            }
        }
        return array0;
    }

    this.resetValues = function (field, fillobj, c, r, s) {
        if (field._value == null)
            field._value = [];
        value = field._value;
        field.getRealArray(value);
        if ((!field.isAutoCr()) || (value.length == 0))
            return;

        var array0 = [];
        var GetCellRectWidth = function (rect, fillobj, s) {
            var w = 0;
            for (var cc = 0; cc < rect.cm; cc++)
                w += fillobj.getColWidth(rect.c0 + cc, s);
            w = fillobj.changeWidth(w);
            return w;
        };
        if (field._isJoint) {
            for (var vi = 0; vi < value.length; vi++) {
                var v = value[vi];
                var arr = [];
                for (var i = 0; i < field._rects.length; i++) {
                    var rect = field._rects[i];
                    var format = fillobj.getCellFormat(rect.c0, rect.r0, s);
                    fillobj.setCellFormat(c, r, s, format);
                    var w = GetCellRectWidth(rect, fillobj, s);
                    v = fillobj.splitLines(arr, c, r, s, w, v, (i == field._rects.length - 1) ? -1 : rect.getFillItems());
                }
                array0.push(arr);
            }
        } else {
            var rect = field._rects[0];
            var format = fillobj.getCellFormat(rect.c0, rect.r0, s);
            fillobj.setCellFormat(c, r, s, format);
            var w = GetCellRectWidth(rect, fillobj, s);
            for (var i = 0; i < value.length; i++) {
                array0.push(this.splitString(fillobj, c, r, s, value[i], w));
            }
        }
        field._value = array0;
    }

    this.classifyGroup = function (field, grouparray, groupnames) {
        if (field._group == "") {
            grouparray.push([field]);
            groupnames.push("");
            return;
        }
        var idx = FT_ArrayIndexOf(groupnames, field._group);
        if (idx < 0) {
            groupnames.push(field._group);
            grouparray.push([]);
            idx = grouparray.length - 1;
        }
        grouparray[idx].push(field);
    }

    this.classify = function (template, blockarray, noblockarray) {
        var blocknames = [], groupnames = [], blockgroupnames = [];
        for (var i = 0; i < template.getFieldCount(); i++) {
            var field = template.field(i);
            if ((field._block == "")||(this.noGroup)) {
                this.classifyGroup(field, noblockarray, groupnames);
                continue;
            }
            var bFather = (field._pblock == "");
            var gidx = bFather ? 0 : 1;
            var blockname = bFather ? field._block : field._pblock;
            var idx = FT_ArrayIndexOf(blocknames, blockname);
            if (idx < 0) {
                blockarray.push([[], []]);
                blockgroupnames.push([[], []]);
                blocknames.push(blockname);
                idx = blocknames.length - 1;
            }
            this.classifyGroup(field, blockarray[idx][gidx], blockgroupnames[idx][gidx]);
        }
    }

    this.resizeGroupValues = function (group) {
        if (group.length <= 1)
            return;
        var maxsize1 = 0;
        for (var i = 0; i < group.length; i++)
            maxsize1 = Math.max(maxsize1, group[i]._value.length);
        for (i = 0; i < group.length; i++) {
            FT_ArrayResizeToArray(group[i]._value, maxsize1);
            var f = group[i];
            if (f._type == "INDEX") {
                for (var k = 0; k < maxsize1; k++) {
                    f._value[k] = [k + 1];
                }
            }
        }
        for (var j = 0; j < maxsize1; j++) {
            var maxsize2 = 0;
            for (i = 0; i < group.length; i++)
                maxsize2 = Math.max(maxsize2, group[i]._value[j].length);
            for (i = 0; i < group.length; i++) {
                FT_ArrayResize(group[i]._value[j], maxsize2, group[i]._formatNULL);
            }
        }
    }

    this.insertGroupRows = function (group, fillobj, template, s, rridx) {
        var bInc = false; for (var i = 0; i < group.length; i++) { if (group[i].isInc()) { bInc = true; break; } }; if (!bInc) return;
        var field = group[0];
        var rectidx = ((rridx < 0) || (rridx >= field._rects.length)) ? field._rects.length - 1 : rridx;
        var insertitems = field.getExtraItemCount(rridx);
        if (field._isMore) {
            var rt = field._rects[rectidx];
            //insertitems = (field._value.length - 1) - ((rt.r1 - rt.r0) == 0 ? 1 : (rt.r1 - rt.r0));         
            insertitems = (field._value.length - 1) - (rt.r1 - rt.r0) + (rt.rm == 1 ? 0 : rt.rm - 1);
        }
        if (insertitems <= 0)
            return;
        if (field.isVGroup()) {//先默认每个只有一行，组中的Field每行填的个数一致，所有Field中间没有空行，每个格子没有合并，左边是标题
            var rect = field._rects[rectidx];
            var rowstart = rect.r0;
            var rowinsert = rect.r1;
            for (var fIdx = 0; fIdx < group.length; fIdx++) {
                if (group[fIdx]._rects[rectidx].r1 > rowinsert)
                    rowinsert = group[fIdx]._rects[rectidx].r1;
                if (group[fIdx]._rects[rectidx].r0 < rowstart)
                    rowstart = group[fIdx]._rects[rectidx].r0;
            }
            var insertrows = insertitems;
            if (rect.c1 != rect.c0) {
                insertrows = parseInt(insertitems / (rect.c1 - rect.c0 + 1), 10);
                if (insertrows * (rect.c1 - rect.c0 + 1) != insertitems)
                    insertrows++;
            }
            rowinsert++;
            fillobj.insertRow(rowinsert, insertrows * group.length, s);
            for (var fIdx = 0; fIdx < group.length; fIdx++) {
                var h = fillobj.getRowHeight(group[fIdx]._rects[rectidx].r0, s);
                for (var ii = 0; ii < insertrows; ii++) {
                    fillobj.setRowHeight(h, rowinsert + ii * group.length + fIdx, s);
                }
            }
            if (rect.c0 > 1) {
                for (var ii = 0; ii < insertrows; ii++) {
                    fillobj.copy(s, 1, rowstart, rect.c0 - 1, rowinsert - 1, 1, rowinsert + ii * group.length);
                }
            }
            var h = fillobj.getRowHeight(rect.r0, s);
            for (var r = rowinsert; r < rowinsert + insertrows; r += rect.rm) {
                fillobj.setRowHeight(h, r, s);
                fillobj.addFormula(s, rect.r1, r);
            }
            FT_NotifyInsertRow(fillobj, template, rowinsert, insertrows * group.length, group, s, (field.isInsertByWhole() ? 0 : rectidx), true, null);
        } else {
            var valuesperrow = 1;
            if (field.isInsertByWhole()) {
                if (rridx < 0)
                    valuesperrow = field._rects.length; //默认有几块就有几组
                else {
                    var thisrect = field._rects[rridx];
                    valuesperrow = thisrect.c1 - thisrect.c0 + 1;
                }
            }
            var insertrows = insertitems;
            if (valuesperrow > 1) {
                insertrows = parseInt(insertitems / valuesperrow, 10);
                if (insertrows * valuesperrow < insertitems)
                    insertrows++;
            }
            var insertrows = insertrows * ((rridx < 0) ? field.getLastRect() : field._rects[rridx]).rm;
            var rect = field._rects[rectidx];
            var rowinsert = rect.r1 + 1;
            fillobj.insertRow(rowinsert, insertrows, s);
            var h = fillobj.getRowHeight(rect.r0, s);
            for (var r = rowinsert; r < rowinsert + insertrows; r += rect.rm) {
                fillobj.setRowHeight(h, r, s);
                fillobj.addFormula(s, rect.r1, r);
            }
            //FT_NotifyInsertRow(fillobj, template, rowinsert, insertrows, group, s, (field.isInsertByWhole() ? 0 : rectidx), true, null);
            FT_NotifyInsertRow(fillobj, template, rowinsert, insertrows, group, s, rectidx, true, null);
        }
    }
    this.insertGroupCols = function (group, fillobj, template, s, rridx) {
        var bInc = false; for (var i = 0; i < group.length; i++) { if (group[i].isVInc()) { bInc = true; break; } }; if (!bInc) return;
        var field = group[0];
        var insertitems = field.getExtraItemCount(rridx);
        if (insertitems <= 0)
            return;
        var rectidx = ((rridx < 0) || (rridx >= field._rects.length)) ? field._rects.length - 1 : rridx;
        var valuesperrow = 1;
        if (field.isInsertByWhole())
            valuesperrow = field._rects.length; //默认有几块就有几组
        var insertcols = insertitems;
        if (valuesperrow > 1) {
            insertrows = parseInt(insertitems / valuesperrow, 10);
            if (insertcols * valuesperrow < insertitems)
                insertcols++;
        }
        var insertcols = insertcols * ((rridx < 0) ? field.getLastRect() : field._rects[rridx]).cm;
        var rect = field._rects[rectidx];
        var colinsert = rect.c1 + 1;
        fillobj.insertCol(colinsert, insertcols, s);
        var h = fillobj.getColWidth(rect.c0, s);
        for (var c = colinsert; c < colinsert + insertcols; c += rect.cm)
            fillobj.setColWidth(h, c, s);
        FT_NotifyInsertCol(fillobj, template, colinsert, insertcols, group, s, (field.isInsertByWhole() ? 0 : rectidx), true, null);
    }

    // wanglei add 计算二维数据列
    this.insertDoubleCols = function (group, fillobj, template, s, rridx) {
        var field = group[0];
        var rectidx = ((rridx < 0) || (rridx >= field._rects.length)) ? field._rects.length - 1 : rridx;
        if (field._value.length == 0) return;
        if (field._isMore) {
            var rect = field._rects[rectidx];
            var insertcols = field._vLength - (rect.cm == 1 ? ((rect.c1 - rect.c0) <= 0 ? 1 : (rect.c1 - rect.c0 + 1)) : rect.cm - ((rect.c1 - rect.c0) <= 0 ? 1 : (rect.c1 - rect.c0 + 1)));      //((rect.c1 - rect.c0) <= 0 ? 1:(rect.c1 - rect.c0)) + (rect.cm == 1 ? 0 : rect.cm); 
            if (insertcols <= 0) return;
            var colinsert = rect.c1 + 1;
            fillobj.insertCol(colinsert, insertcols, s);
            var h = fillobj.getColWidth(rect.c0, s);
            for (var c = colinsert; c < colinsert + insertcols; c += rect.cm)
                fillobj.setColWidth(h, c, s);
            FT_NotifyInsertCol(fillobj, template, colinsert, insertcols, group, s, (field.isInsertByWhole() ? 0 : rectidx), true, null);
        }
    }

    this.insertSingle = function (groups, fillobj, template, s) {
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            this.resizeGroupValues(group);
            this.insertGroupRows(group, fillobj, template, s, -1);
            this.insertGroupCols(group, fillobj, template, s, -1);
            this.insertDoubleCols(group, fillobj, template, s, -1); // wanglei add 计算二维数据列
        }
    }

    this.getBlockNum = function (groups) {
        for (var i = 0; i < groups.length; i++) {
            for (var j = 0; j < groups[i].length; j++) {
                var rrsnum = groups[i][j]._rrs.length;
                if (rrsnum != 0)
                    return rrsnum;
            }
        }
        return 0;
    }

    this.insertBlock = function (parentgroups, subgroups, fillobj, template, s, cols) {
        function C_Border() {
            return { u: 0,
                l: 0,
                mergeBorder: function (uu, ll) { this.u = Math.max(this.u, uu); this.l = (this.l == 0) ? ll : Math.min(this.l, ll); },
                mergeField: function (f) { this.mergeBorder(f.getLastRect().r1, f._rects[0].r0); }
            };
        }

        for (var i = 0; i < parentgroups.length; i++) {
            this.resizeGroupValues(parentgroups[i]);
        }
        for (i = 0; i < subgroups.length; i++) {
            this.resizeGroupValues(subgroups[i]);
        }
        var blocknum = this.getBlockNum(parentgroups);
        if (blocknum == 0)
            blocknum = this.getBlockNum(subgroups);
        if (blocknum <= 1) {
            this.insertSingle(parentgroups, fillobj, template, s);
            this.insertSingle(subgroups, fillobj, template, s);
            return;
        }
        var nStartRow = 0, nEndRow = 0;
        var PBorder = C_Border(), SBorder = C_Border();
        FT_GetBorderRow(parentgroups, PBorder);
        FT_GetBorderRow(subgroups, SBorder);
        PBorder.mergeBorder(SBorder.u, SBorder.l);
        nStartRow = PBorder.l;
        nEndRow = PBorder.u;
        var rowsperblock = nEndRow - nStartRow + 1;
        var insertrows = rowsperblock * (blocknum - 1);
        fillobj.insertRow(nEndRow + 1, insertrows, s);
        FT_NotifyInsertRow(fillobj, template, nEndRow + 1, insertrows, null, s, 0, false, [parentgroups, subgroups]);
        for (var j = 0; j < blocknum - 1; j++) {
            fillobj.copy(s, 1, nStartRow, cols, nEndRow, 1, nEndRow + j * rowsperblock + 1);
            FT_AppendOffset(parentgroups, rowsperblock * (j + 1));
            FT_AppendOffset(subgroups, rowsperblock * (j + 1));
        }
        for (j = 0; j < blocknum; j++) {
            for (var k = 0; k < parentgroups.length; k++)
                this.insertGroupRows(parentgroups[k], fillobj, template, s, j);
            for (k = 0; k < subgroups.length; k++)
                this.insertGroupRows(subgroups[k], fillobj, template, s, j);
        }
    }

    this.loadTemplate = function (fillobj) {
        var template = { fieldarray: [],
            defaultempty: true,
            getFieldCount: function () { return this.fieldarray.length; },
            getFieldIndex: function (fieldname) { for (var i = 0; i < this.fieldarray.length; i++) { if (this.fieldarray[i]._name == fieldname) return i; }; return -1; },
            field: function (idx) { return this.fieldarray[idx]; },
            parseFlag: function (str) {  var ret = [];if (!str.indexOf) { debugger; return ret; }; for (var lPos = 0, rPos = 0; lPos >= 0; ) { lPos = str.indexOf(fillobj.leftFlag, rPos); if (lPos >= 0) { rPos = str.indexOf(fillobj.rightFlag, lPos); if (rPos >= 0) { ret.push(str.substring(lPos + 3, rPos)); } else { lPos = -1; } } }; return ret; },
            parseCell: function (fillobj, c, r, s) {
                if (fillobj.getFormula(c, r, s) != "")
                    return;
                var str = fillobj.getCellString(c, r, s);
                if (str == "")
                    return;
                var fieldstrlist = this.parseFlag(str);
                if (fieldstrlist.length == 0)
                    return;
                var cm = fillobj.getMergeEndCol(c, r, s) - c + 1;
                var rm = fillobj.getMergeEndRow(c, r, s) - r + 1;
                for (var i = 0; i < fieldstrlist.length; i++) {
                    var flaglist = fieldstrlist[i].split(",");
                    FT_ArrayResize(flaglist, 8);
                    var idx = this.getFieldIndex(flaglist[0]);
                    var field;
                    if (idx < 0) {
                        field = { _name: "",
                            _type: "",
                            _style: [""],
                            _format: "",
                            _formatAssist: "",
                            _formatNULL: "",
                            _group: "",
                            _block: "",
                            _pblock: "",
                            _rects: [],
                            _fieldStr: "",
                            _fieldText: "",
                            _value: null,
                            _rrs: [],
                            _isJoint: false,
                            _isMore: false, //wanglei add 是否二维数据
                            _vLength: 1, //wanglei add 二维数据长度
                            _show: "",
                            getRRStart: function (rridx) { if ((rridx >= this._rrs.length) || (rridx < 0)) return 0; var rr = 0; for (var i = 0; i < rridx; i++) { rr += this._rrs[i]; }; return rr; },
                            getRRLength: function (rridx) { return ((rridx >= this._rrs.length) || (rridx < 0)) ? -1 : this._rrs[rridx]; },
                            getLastRect: function () { var count = this._rects.length; return (count == 0) ? null : this._rects[count - 1]; },
                            addFieldPos: function (c, r, cm, rm) {
                                var rectLast = this.getLastRect();
                                var bAddNew = false;
                                if (rectLast == null)
                                    bAddNew = true;
                                else {
                                    if ((rectLast.c0 == c) && (rectLast.r0 == r)) //同一个格子，不处理
                                        return;
                                    if (rectLast.c1 > 0) {
                                        bAddNew = true;
                                    }
                                }
                                if (bAddNew) {
                                    var rect = C_Rect();
                                    rect.c0 = c;
                                    rect.r0 = r;
                                    rect.cm = cm;
                                    rect.rm = rm;
                                    this._rects.push(rect);
                                } else {
                                    rectLast.c1 = c + rectLast.cm - 1;
                                    rectLast.r1 = r + rectLast.rm - 1;
                                }
                            },
                            getTotalItemCount: function () { var items = 0; for (var i = 0; i < this._rects.length; i++) { items += this._rects[i].getFillItems(); }; return items; },
                            getExtraItemCount: function (rridx) { return FT_ArrayGetTotalLength(this._value, this.getRRStart(rridx), this.getRRLength(rridx)) - ((rridx < 0) ? this.getTotalItemCount() : this._rects[rridx].getFillItems()); },
                            readFrom: function (flaglist, fieldstr, fieldtext) {
                                this._name = flaglist[0];
                                this._type = flaglist[1];
                                this._style = flaglist[2].split("@@@");
                                if (this._style.length == 0) { this._style.push(""); };
                                var arrFmt = flaglist[3].split("@@@");
                                this._format = arrFmt[0];
                                if (arrFmt.length > 2) {
                                    this._formatAssist = arrFmt[1];
                                    this._formatNULL = arrFmt[2];
                                } else if (arrFmt.length > 1) {
                                    this._formatAssist = arrFmt[1];
                                }
                                this._fieldStr = fillobj.leftFlag + fieldstr + fillobj.rightFlag; this._fieldText = fieldtext; this._group = flaglist[4]; this._block = flaglist[5]; this._pblock = flaglist[6];
                                this._show = flaglist[7];
                            },
                            getRealValue: function (value) {
                                //    if (((this._type == "NUM") || (this._type == "ENUM")) && (value == 0))
                                //      return value;
                                if (value === "") {
                                    if (this._formatNULL != "")
                                        return this._formatNULL;
                                    if (this._formatAssist != "")
                                        return eval(this._formatAssist + "('','" + this._format + "')");
                                    return "";
                                }
                                if (this._formatAssist != "")
                                    return eval(this._formatAssist + "('" + value + "','" + this._format + "')");
                                switch (this._type) {
                                    case "NUMSTR": return FT_ParseNumber(value, this._format);
                                    case "TIME": return FT_ParseTime(value, this._format);
                                    case "SPAN": return FT_ParseSpan(value, this._format);
                                    case "ZHONGWEN": return FT_ToZhongWen(value, this._format);
                                    case "LIST": //Add by gud 20121006
                                        {
                                            for (var i = 0; i < this._format[0].length; i++) {
                                                if (this._format[0][i] == value) {
                                                    return this._format[1][i];
                                                }
                                            }
                                            return "";
                                        };
                                    default: return value;
                                }
                            },
                            getRealArray: function (valuearray) { for (var i = 0; i < valuearray.length; i++) { if (FT_IsArray(valuearray[i])) { this.getRealArray(valuearray[i]); } else { valuearray[i] = this.getRealValue(valuearray[i]); } } },
                            getFillValue: function (text, value) { if (text == "") return this._fieldText.replaceAll(this._fieldStr, value); return text.replaceAll(this._fieldStr, value); },
                            isInArray: function (fieldarray) { if (null == fieldarray) return false; return FT_IsField(fieldarray) ? (fieldarray == this) : (FT_ArrayIndexOf(fieldarray, this) >= 0); },
                            isInc: function () { if (this._style[0] == "INCAUTOCR") return true; return FT_ArrayIndexOf(this._style, "INC") >= 0; },
                            isVInc: function () { return FT_ArrayIndexOf(this._style, "VINC") >= 0; },
                            isAutoCr: function () { if (this._style[0] == "INCAUTOCR") return true; return FT_ArrayIndexOf(this._style, "AUTOCR") >= 0; },
                            isH: function () { return FT_ArrayIndexOf(this._style, "H") >= 0; },
                            isInsertByWhole: function () { return FT_ArrayIndexOf(this._style, "INSERTBYWHOLE") >= 0; },
                            isVGroup: function () { return FT_ArrayIndexOf(this._style, "VGROUP") >= 0; },
                            isAutoMerge: function () { return FT_ArrayIndexOf(this._style, "AUTOMERGE") >= 0; },
                            fillCellValue: function (fillobj, c, r, s, v) {
                                if (fillobj.encode)
                                    v = fillobj.encode(v);
                                if (fillobj.fillCell(this, c, r, s, v))
                                    return;
                                var str = fillobj.getCellString(c, r, s);
                                if (this._type == "ENUM") {
                                    var n = parseInt(v, 10);
                                    var arr = this._format.split("&&&");
                                    var vv = "";
                                    if ((n >= 0) && (n < arr.length))
                                        vv = arr[n];
                                    fillobj.setCellString(c, r, s, this.getFillValue(str, vv));
                                } else {
                                    fillobj.setCellString(c, r, s, this.getFillValue(str, v));
                                }
                            },
                            fillSingleValue: function (fillobj, s, v, arrCell, cIdx) {
                                if ((v === null) || (cIdx >= arrCell.length) || (cIdx < 0))
                                    return -1;
                                if (!FT_IsArray(v)) {
                                    this.fillCellValue(fillobj, arrCell[cIdx].col, arrCell[cIdx].row, s, v);
                                    return cIdx + 1;
                                } else {
                                    for (var i = 0; i < v.length; i++) {
                                        cIdx = this.fillSingleValue(fillobj, s, v[i], arrCell, cIdx);
                                    }
                                }
                                return cIdx;
                            },
                            fillCell: function (fillobj, s, bDefaultEmpty) {
                                if (this._rects.length == 0)
                                    return;
                                var arrCell = [];
                                if ((this._rrs.length > 1) && (this._rrs.length == this._rects.length) && (this.isH())) {
                                    for (var i = 0; i < this._rects.length; i++) {
                                        var rect = this._rects[i];
                                        var thisrrscount = 1;
                                        for (var r = rect.r0; r <= rect.r1; r += rect.rm) {
                                            for (var c = rect.c0; c <= rect.c1; c += rect.cm) {
                                                thisrrscount++;
                                                arrCell.push({ col: c, row: r });
                                                if (thisrrscount > this._rrs[i])
                                                    break;
                                            }
                                            if (thisrrscount > this._rrs[i])
                                                break;
                                        }
                                    }
                                } else {
                                    for (var i = 0; i < this._rects.length; i++) {
                                        var rect = this._rects[i];
                                        var c1 = rect.c1;
                                        if (this._isMore) { //wanglei add 如果是二维数据，那么计算是否结束标签超出了二维数据长度，如果超出了就以二维数据长度为准
                                            c1 = rect.c1 - ((c1 - rect.c0 + 1) - this._vLength) + (rect.cm == 1 ? 0 : rect.cm - 1);
                                        }
                                        for (var c = rect.c0; c <= c1; c += rect.cm) {
                                            for (var r = rect.r0; r <= rect.r1; r += rect.rm)
                                                arrCell.push({ col: c, row: r });
                                        }
                                    }
                                }
                                if (this.isH() && (this._type != "FORMULA"))
                                    arrCell.sort(function (cell1, cell2) { return (cell1.row < cell2.row) ? -1 : ((cell1.row > cell2.row) ? 1 : ((cell1.col < cell2.col) ? -1 : 1)); });
                                this.fillSingleValue(fillobj, s, (this._value.length == 0) ? (bDefaultEmpty ? [""] : null) : this._value, arrCell, 0);
                            },
                            mergeCell: function (fillobj, s) {
                                if ((!this.isAutoMerge()) || (!this._value == null))
                                    return;
                                for (var i = 0; i < this._rects.length; i++) {
                                    var rt = this._rects[i];
                                    var str = fillobj.getCellString(rt.c0, rt.r0, s);
                                    var strLeft = "";//要合并单元格的左边单元格
                                    if (rt.c0 > 1)
                                        strLeft = fillobj.getCellString(rt.c0 - 1, rt.r0, s);
                                    var rStart = rt.r0;
                                    for (var r = rt.r0 + rt.rm; r <= rt.r1; r += rt.rm) {
                                        var strThisCell = fillobj.getCellString(rt.c0, r, s);
                                        var strThisCellLeft = "";
                                        if (rt.c0 > 1)
                                            strThisCellLeft = fillobj.getCellString(rt.c0 - 1, r, s);
                                        if (str != strThisCell||(str==strThisCell&&strLeft!=strThisCellLeft)) {
                                            if (rStart < r - rt.rm)
                                                fillobj.mergeCells(rt.c0, rStart, rt.c1, r - 1, s);
                                            str = strThisCell;
                                            strLeft = strThisCellLeft;
                                            rStart = r;
                                        }
                                    }
                                    if (rStart < rt.r1 && str.replace(/(^\s*)|(\s*$)/g, "") != "")
                                        fillobj.mergeCells(rt.c0, rStart, rt.c1, rt.r1, s);
                                }
                            }
                        }
                        this.fieldarray.push(field);
                        field.readFrom(flaglist, fieldstrlist[i], str);
                    } else {
                        field = this.fieldarray[idx];
                        fillobj.setCellString(c, r, s, "");
                    }
                    field.addFieldPos(c, r, cm, rm);
                }
            },
            load: function (fillobj) { this.fieldarray = []; var c, r, s = fillobj.getCurSheet(); var cols = fillobj.getCols(s), rows = fillobj.getRows(s); for (c = 1; c < cols; c++) { for (r = 1; r < rows; r++) { this.parseCell(fillobj, c, r, s); } }; for (var f = 0; f < this.fieldarray.length; f++) { var field = this.fieldarray[f]; var rectLast = field.getLastRect(); if (rectLast.r1 <= 0) { rectLast.r1 = rectLast.r0 + rectLast.rm - 1; rectLast.c1 = rectLast.c0 + rectLast.cm - 1; } } }
        }
        template.load(fillobj);
        return template;
    }

    this.fillCell = function (fillobj, template, fGetObject, loadPage) {
        var bDefaultEmpty = false;
        if ((typeof template == "undefined") || (!template)) {
            template = this.loadTemplate(fillobj);
            bDefaultEmpty = true;
        } else {
            bDefaultEmpty = template.defaultempty;
        }
        if ((typeof template != "undefined") && (fGetObject))
            this.addFromPage(template, fGetObject);
        var s = fillobj.getCurSheet();
        var cols = fillobj.getCols(s);
        fillobj.ready(this, template, s);
        this.attachValue(template); //将值与对应的Field关联

        this.createSameTypeFields(template, fillobj, s); //创建类型是SAME的Field
        for (var i = 0; i < template.getFieldCount(); i++) { this.resetValues(template.field(i), fillobj, cols, 1, s); } //根据自动换行重新设置值
        //根据模板将Field分组
        var blockarray = [], noblockarray = [];
        this.classify(template, blockarray, noblockarray);
        //重新设置文件格式
        this.insertSingle(noblockarray, fillobj, template, s);
        if ((typeof loadPage == "undefined") || (loadPage)) {
            this.createPageTypeFieldsNeedSpace(template, fillobj, s); //创建PAGE类型的Field
        }
        for (i = 0; i < blockarray.length; i++)
            this.insertBlock(blockarray[i][0], blockarray[i][1], fillobj, template, s, cols);

        fillobj.dealWithFields(this, template, s);
        //填充
        for (i = 0; i < template.getFieldCount(); i++) {
            template.field(i).fillCell(fillobj, s, bDefaultEmpty);
        }
        fillobj.calculateSheet(s);
        //合并
        for (i = 0; i < template.getFieldCount(); i++) {
            template.field(i).mergeCell(fillobj, s);
        }
        fillobj.finish(this, template, s);


        return template;
    }

    this.addFromPage = function (template, fGetObject) {
        for (var i = 0; i < template.getFieldCount(); i++) {
            var field = template.field(i);
            var id = field._name;
            var args = null;
            var arrInfo = id.split(":");
            if (arrInfo.length > 1) {
                args = [];
                for (var j = 1; j < arrInfo.length; j++)
                    args.push(arrInfo[j]);
                id = arrInfo[0];
            }
            var obj = fGetObject(id);
            if (!obj)
                continue;
            if (typeof obj.tagName == "undefined") {
                this.add(field._name, obj, null);
                continue;
            }
            this.add(field._name, function (obj, args) {
                switch (obj.tagName.toUpperCase()) {
                    case "TEXTAREA":
                    case "INPUT":
                        return obj.value;
                    case "SELECT":
                        return (obj.value == "-1" || obj.value == "") ? "" : obj.options[obj.selectedIndex].text;
                    case "IMG":
                        return obj.src;
                    case "TABLE": //把表格的值全弄下来 
                        var table = obj;
                        var arrData = [];
                        var startrow = 0, endrow = -1, col = -1;
                        if ((null != args) && FT_IsArray(args)) {
                            startrow = parseInt(args[0], 10);
                            if (args.length > 1)
                                endrow = parseInt(args[1], 10);
                            if (args.length > 2)
                                col = parseInt(args[2], 10);
                        }
                        if (endrow < 0)
                            endrow = (table.rows.length + 1 + endrow);
                        if (col < 0) {
                            for (var r = startrow; r < endrow; r++) {
                                var row = table.rows[r];
                                if (row.style.display == "none")
                                    continue;
                                var arrItem = [];
                                for (var c = 0; c < row.cells.length; c++) {
                                    var cell = row.cells[c];
                                    arrItem.push(cell.innerText);
                                }
                                arrData.push(arrItem);
                            }
                        } else {
                            for (var r = startrow; r < endrow; r++) {
                                var row = table.rows[r];
                                if (row.style.display == "none")
                                    continue;
                                var cell = table.rows[r].cells[col];
                                if (typeof cell != "undefined")
                                    arrData.push(cell.innerText);
                            }
                        }
                        return arrData;
                    default:
                        return obj.innerText;
                }
            }, null);
        }
    }
    this.createFiller = function () {
        return new function TemplateFiller() {
            this.leftFlag = "<<<";
            this.rightFlag = ">>>";
            this.getCurSheet = function () { return 0; }
            this.getSheetIndex = function (sheetname) { return 0; }
            //注意：行列是从1开始的
            this.getCols = function (s) { return 1; }
            this.getRows = function (s) { return 1; }
            this.insertCol = function (colinsert, insertcols, s) { }
            this.insertRow = function (rowinsert, insertrows, s) { }
            this.calculateSheet = function (s) { }
            this.deleteCol = function (colStart, colCount, s) { }
            this.getFormula = function (c, r, s) { return ""; }
            this.getCellString = function (c, r, s) { return ""; }
            this.setCellString = function (c, r, s, str) { return ""; }
            this.setDroplistCell = function (c, r, s, list, option) { }
            this.getMergeEndCol = function (c, r, s) { return c; }
            this.getMergeEndRow = function (c, r, s) { return r; }
            this.mergeCells = function (c0, r0, c1, r1, s) { }
            this.getCellFormat = function (c, r, s) { return null; }
            this.setCellFormat = function (c, r, s, format) { }
            this.getColWidth = function (c, s) { return 0; }
            this.setColWidth = function (w, c, s) { }
            this.getRowHeight = function (r, s) { return 0; }
            this.setRowHeight = function (h, r, s) { }
            this.changeWidth = function (w) { }
            this.splitLines = function (array, c, r, s, w, str, lines) { array.push(str); return ""; }
            this.fillCell = function (field, c, r, s, v) { return false; }
            this.ready = function (content, template, s) { }
            this.dealWithFields = function (content, template, s) { }
            this.finish = function (content, template, s) { }
            this.addFormula = function (s, sr, er) { }
            this.copy = function (s, c1, r1, c2, r2, c0, r0) { }
        } ();
    }
}

CTemplateContent.prototype.createArrayFiller1D = function (array1D) {
    var filler = this.createFiller();
    filler.array = array1D;

    filler.getCols = function (s) { return 2; }
    filler.getRows = function (s) { return this.array.length + 1; }
    filler.insertRow = function (rowinsert, insertrows, s) {
        rowinsert--;
        if (rowinsert > this.array.length)
            rowinsert = this.array.length;
        var offsets = this.array.length - rowinsert;
        var offset = insertrows;
        var length0 = this.array.length;
        var length1 = this.array.length + insertrows;
        for (var i = 0; i < offsets; i++) {
            this.array[length1 - i - 1] = this.array[length0 - i - 1];
        }
        for (var i = 0; i < offset; i++) {
            this.array[rowinsert + i] = this.getInitialValue();
        }
    }
    filler.getCellString = function (c, r, s) { return this.array[r - 1]; }
    filler.setCellString = function (c, r, s, str) { this.array[r - 1] = str; }
    filler.fillCell = function (field, c, r, s, v) { return false; }
    filler.copy = function (s, c1, r1, c2, r2, c0, r0) { /*this.setCellString(c2, r2, s, this.getCellString(c1, r1, s));*/ }
    filler.getInitialValue = function () { return ""; }
    filler.getResult = function () { return this.array; }
    return filler;
}

CTemplateContent.prototype.createHtmlArrayFiller1D = function (array1D) {
    var filler = this.createArrayFiller1D(array1D);
    filler.getRealUrl = function (c, r, s, url) { return url; }
    filler.fillCell = function (field, c, r, s, v) {
        var str = this.getCellString(c, r, s);
        if (field._type == "URL") {
            var v1 = v.split(",");
            var urlHost, urlTitle;
            var urlName = v1[0];
            if (v1.length > 2) {
                urlHost = v1[1];
                urlTitle = v1[2];
            } else if (v1.length > 1) {
                urlHost = v1[1];
                urlTitle = urlName;
            } else {
                urlHost = urlName;
                urlTitle = urlName;
            }
            var urlHtml = "<a href='" + this.getRealUrl(c, r, s, urlHost) + "' title='" + urlTitle + "'>" + urlName + "</a>";
            this.setCellString(c, r, s, field.getFillValue(str, urlHtml));
            return true;
        }
        return false;
    }
    return filler;
}

CTemplateContent.prototype.createArrayFiller2D = function (array2D) {
    var filler = this.createArrayFiller1D(array2D);
    filler.getCols = function (s) { if (this.array.length == 0) return 1; return this.array[0].length + 1; }
    filler.getInitialValue = function () {
        var array = new Array(this.getCols() - 1);
        for (var i = 0; i < array.length; i++)
            array[i] = "";
        return array;
    }
    filler.getCellString = function (c, r, s) { return this.array[r - 1][c - 1]; }
    filler.setCellString = function (c, r, s, str) { this.array[r - 1][c - 1] = str; }
    return filler;
}

CTemplateContent.prototype.createSimpleTableFiller = function (tbl) {
    var filler = this.createFiller();
    filler.ctrl = tbl;

    filler.getCols = function (s) {
        if (this.ctrl.rows.length == 0)
            return 1;
        var row = this.ctrl.rows[0];
        return row.cells.length + 1;
    }
    filler.getRows = function (s) {
        return this.ctrl.rows.length + 1;
    }
    filler.insertRow = function (rowinsert, insertrows, s) {
        var cols = this.getCols(s) - 1;
        for (var i = 0; i < insertrows; i++) {
            var row = this.ctrl.insertRow(rowinsert - 1);
            for (var j = 0; j < cols; j++) {
                row.insertCell(-1);
            }
        }
    }
    filler.getCellString = function (c, r, s) { return this.ctrl.rows[r - 1].cells[c - 1].innerHTML; }
    filler.setCellString = function (c, r, s, str) { this.ctrl.rows[r - 1].cells[c - 1].innerHTML = (str == "") ? "&nbsp;" : str; }
    filler.fillCell = function (field, c, r, s, v) { return false; }
    filler.copy = function (s, c1, r1, c2, r2, c0, r0) { /*this.setCellString(c2, r2, s, this.getCellString(c1, r1, s));*/ }
    return filler;
}

CTemplateContent.prototype.createTableFiller = function (tbl) {
    var filler = this.createSimpleTableFiller(tbl);
    filler.getCols = function (s) {
        if (this.ctrl.rows.length == 0)
            return 1;
        var row = this.ctrl.rows[0];
        var cols = 0;
        for (var i = 0; i < row.cells.length; i++) {
            cols += row.cells[i].colSpan;
        }
        return cols + 1;
    }
    function initTableFillerData(filler, tbl) {
        var cols = filler.getCols(0);
        var rows = filler.getRows(0);
        var tblData = new Array(rows - 1);
        for (var i = 0; i < rows - 1; i++) {
            tblData[i] = new Array(cols - 1);
        }
        function getFirstNotNullIndex(array) {
            for (var i = 0; i < array.length; i++) {
                if (!array[i])
                    return i;
            }
            return -1;
        }
        for (var r = 0; r < tbl.rows.length; r++) {
            var row = tbl.rows[r];
            var dataRow = tblData[r];
            for (var c = 0; c < row.cells.length; c++) {
                var cell = row.cells[c];
                var idx = getFirstNotNullIndex(dataRow);
                if (idx < 0)
                    continue;
                for (var i = 0; i < cell.rowSpan; i++) {
                    for (var j = 0; j < cell.colSpan; j++) {
                        tblData[r + i][idx + j] = { isMerged: (i > 0) || (j > 0), td: cell };
                    }
                }
            }
        }
        filler.data = tblData;
    }
    initTableFillerData(filler, tbl);
    filler.insertRow = function (rowinsert, insertrows, s) {
        for (var i = 0; i < insertrows; i++) {
            this.ctrl.insertRow(rowinsert);
        }
    }
    filler.getCellString = function (c, r, s) {
        var tdData = this.data[r - 1][c - 1];
        if (tdData.isMerged)
            return "";
        return tdData.td.innerHTML;
    }
    filler.setCellString = function (c, r, s, str) {
        var tdData = this.data[r - 1][c - 1];
        if (tdData.isMerged)
            return;
        tdData.td.innerHTML = str;
    }
    filler.getMergeEndCol = function (c, r, s) {
        var tdData = this.data[r - 1][c - 1];
        if (tdData.isMerged) {
            alert(0);
            return c;
        }
        return tdData.td.colSpan + c - 1;
    }
    filler.getMergeEndRow = function (c, r, s) {
        var tdData = this.data[r - 1][c - 1];
        if (tdData.isMerged) {
            alert(0);
            return r;
        }
        return tdData.td.rowSpan + r - 1;
    }
    filler.copy = function (s, c1, r1, c2, r2, c0, r0) { /*this.setCellString(c2, r2, s, this.getCellString(c1, r1, s));*/ }
    return filler;
}

CTemplateContent.prototype.createSimpleCellFiller = function (cell, bSave) {
    return new function (cell, bSave) {
        function cellColToLabel(c) {
            c--;
            if (c > 25)
                return cellColToLabel(parseInt(c / 26, 10)) + cellColToLabel(c % 26 + 1);
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".substr(c, 1);
        }

        this.cellobj = cell;
        this.saveFlag = bSave;
        this.leftFlag = "<<<";
        this.rightFlag = ">>>";
        this.getCurSheet = function () { return this.cellobj.GetCurSheet(); }
        this.getSheetIndex = function (sheetname) { return this.cellobj.GetSheetIndex(sheetname); }
        this.getCols = function (s) { return this.cellobj.GetCols(s); }
        this.getRows = function (s) { return this.cellobj.GetRows(s); }
        this.insertCol = function (colinsert, insertcols, s) { this.cellobj.InsertCol(colinsert, insertcols, s); }
        this.insertRow = function (rowinsert, insertrows, s) { this.cellobj.InsertRow(rowinsert, insertrows, s); }
        this.setColHidden = function (colStart, colEnd) { this.cellobj.SetColHidden(colStart, colEnd); }
        this.calculateSheet = function (s) { this.cellobj.CalculateSheet(s); }
        this.deleteCol = function (colStart, colCount, s) { this.cellobj.DeleteCol(colStart, colCount, s); }
        this.getFormula = function (c, r, s) { return this.cellobj.GetFormula(c, r, s); }
        this.getCellString = function (c, r, s) { return this.cellobj.GetCellString(c, r, s); }
        this.setCellString = function (c, r, s, str) { this.cellobj.S(c, r, s, str); }
        this.setDroplistCell = function (c, r, s, list, option) { this.cellobj.SetDroplistCell(c, r, s, list, option); }
        this.getMergeEndCol = function (c, r, s) {
            return F_GetMergeRangeCol(this.cellobj, c, r, s, 2);
        }
        this.getMergeEndRow = function (c, r, s) {
            return F_GetMergeRangeRow(this.cellobj, c, r, s, 3);
        }
        this.getCellFormat = function (c, r, s) { return null; }
        this.setCellFormat = function (c, r, s, format) { }
        this.mergeCells = function (c0, r0, c1, r1, s) {
            this.cellobj.MergeCells(c0, r0, c1, r1);
        }
        this.getColWidth = function (c, s) {
            return this.cellobj.GetColWidth(1, c, s);
        }
        this.setColWidth = function (w, c, s) {
            this.cellobj.SetColWidth(1, w, c, s);
        }
        this.getRowHeight = function (r, s) {
            return this.cellobj.GetRowHeight(1, r, s);
        }
        this.setRowHeight = function (h, r, s) {
            this.cellobj.SetRowHeight(1, h, r, s);
        }
        this.changeWidth = function (w) {
            if (w > 40)
                return w * 19 / 20;
            return w - 2;
        }
        this.splitLines = function (array, c, r, s, w, str, lines) {
            function getFirstLineByCell(cellobj, c, r, s, w, str) { if (str.length < 2) return str; if (isFitCell(cellobj, c, r, s, str, w)) return str; return getFirstLineByCellEx(cellobj, c, r, s, w, str, 1, str.length); }
            function getFirstLineByCellEx(cellobj, c, r, s, w, str, p0, p1) { if (p1 - p0 < 2) return str.substr(0, p0); var p = parseInt((p0 + p1) / 2, 10); var str1 = str.substr(0, p); if (isFitCell(cellobj, c, r, s, str1, w)) return getFirstLineByCellEx(cellobj, c, r, s, w, str, p, p1); return getFirstLineByCellEx(cellobj, c, r, s, w, str, p0, p); }
            function isFitCell(cellobj, c, r, s, str, w) { cellobj.S(c, r, s, str); return cellobj.GetColBestWidth(c) <= w; }
            function getLinesByCell(array, cellobj, c, r, s, w, str, lines) {
                var sep = "\r\n";
                var idxstart = 0, idxend = 0, lngth = array.length;
                var idxlast = 0;
                while ((idxstart >= 0) && ((lines < 0) || (lngth < lines))) {
                    idxend = str.indexOf(sep, idxstart);
                    if (idxend < 0) {
                        idxlast = idxstart + addLinesByCell(cellobj, array, c, r, s, w, str.substring(idxstart, str.length), lines);
                        idxstart = -1;
                    } else {
                        idxlast = idxstart + addLinesByCell(cellobj, array, c, r, s, w, str.substring(idxstart, idxend), lines);
                        idxstart = idxend + sep.length;
                    }
                    lines -= (array.length - lngth);
                    lngth = array.length;
                };
                return str.substring(idxlast, str.length);
            }
            function addLinesByCell(cellobj, array, c, r, s, w, str, lines) {
                var l = 0, lc = str.length;
                var str0;
                for (var lngth = 0; (l != lc) && ((lines < 0) || (lngth < lines)); lngth++) {
                    str0 = str.substring(l, lc);
                    var str1 = getFirstLineByCell(cellobj, c, r, s, w, str0);
                    array.push(str1);
                    l += str1.length;
                }
                return l;
            }
            return getLinesByCell(array, this.cellobj, c, r, s, w, str, lines);
        }
        this.fillCell = function (field, c, r, s, v) {
            function setCellNumFormat(cellobj, c, r, s, format) {
                if (format === "")
                    return;
                if (format.substr(format.length - 1, 1) == "%") {
                    cellobj.SetCellNumType(c, r, s, 5);
                    cellobj.SetCellDigital(c, r, s, parseInt(format.substr(0, format.length - 1), 10));
                } else {
                    cellobj.SetCellNumType(c, r, s, 1);
                    cellobj.SetCellDigital(c, r, s, parseInt(format));
                };
            }
            var str = this.getCellString(c, r, s);
            if (field._type == "BMP") {
                var v1 = v.split(",");
                if (v1.length > 1) {
                    v = v1[0]; v1 = v1[1];
                } else {
                    v1 = "";
                };
                this.setCellString(c, r, s, field.getFillValue(str, v1));
                if (v.length != 0) {
                    var idx = this.cellobj.AddImage(v);
                    if (idx >= 0) {
                        var nStyle = parseInt(parseInt(field._format, 10) / 100, 10);
                        var hAlign = parseInt(parseInt(field._format, 10) / 10, 10) - nStyle * 10;
                        var vAlign = parseInt(field._format, 10) - 10 * hAlign - 100 * nStyle;
                        this.cellobj.SetCellImage(c, r, s, idx, nStyle, hAlign, vAlign);
                    }
                }
                return true;
            }
            if (field._type == "URL") {
                var v1 = v.split(",");
                var urlHost, urlTitle;
                var urlName = v1[0];
                if (v1.length > 2) {
                    urlHost = v1[1];
                    urlTitle = v1[2];
                } else if (v1.length > 1) {
                    urlHost = v1[1];
                    urlTitle = urlName;
                } else {
                    urlHost = urlName;
                    urlTitle = urlName;
                }
                if (urlHost.substring(0, 7).toLowerCase() != "http://")
                    urlHost = "http://" + window.location.host + "/" + urlHost;
                this.cellobj.SetCellHyperLink(c, r, s, urlName, urlHost, urlTitle);
                return true;
            }
            if (field._type == "NUM") {
                var db = parseFloat(v);
                if (isNaN(db)) {
                    this.setCellString(c, r, s, v);
                } else {
                    setCellNumFormat(this.cellobj, c, r, s, field._format);
                    this.cellobj.D(c, r, s, db);
                }
                return true;
            }
            if ((field._type == "SUM") || (field._type == "FORMULA") || (field._type == "MAX") || (field._type == "MIN") || (field._type == "AVERAGE") || (field._type == "MAXCELL") || (field._type == "MINCELL") || (field._type == "COUNT")) {
                setCellNumFormat(this.cellobj, c, r, s, field._format);
                var strTemp = "";
                while (v != strTemp) {
                    strTemp = v;
                    v = strTemp.replace("[comma]", ",");
                }
                this.cellobj.SetFormula(c, r, s, "IF(ISERROR(" + v + "),\"\"," + v + ")");
                return true;
            }
            if (field._type == "PAGE") {
                //赋值SHEET页面 wanglei 2011-12-16 add
                var cl = 0;
                var rl = 0;
                for (var j = 0; j < field._value.length; j++) {
                    var sheetIndex = this.getSheetIndex(field._value[j]);
                    var sheetR = this.getRows(sheetIndex) - 1;
                    var sheetC = this.getCols(sheetIndex) - 1;
                    FT_CopyOtherSheet(this.cellobj, s, sheetIndex, field._rects[0].c0 + cl, field._rects[0].r0 + rl, 1, sheetC, 1, sheetR);
                    if (this.isH()) {
                        cl += sheetC;
                    }
                    else {
                        rl += sheetR;
                    }
                }
                return true;
            }
            if (field._type == "LIST") {
                //下拉选项 add by gud 20121006
                //format是两个数组，分别对应value和text
                this.cellobj.SetDroplistCell(c, r, s, field._format[1].join("\r\n") + "\r\n------", 4);
                this.setCellString(c, r, s, field.getFillValue(str, v));
                return true;
            }
            return false;
        }
        this.ready = function (content, template, s) {
            var cols = this.cellobj.GetCols(s);
            this.cellobj.InsertCol(cols, 1, s);
            this.cellobj.SetColHidden(cols, cols);
            if (typeof this.saveFlag != 'undefined' && this.saveFlag)
                this.setLabelNode(content, template, this.cellobj, s);
        }
        this.dealWithFields = function (content, template, s) {
            this.createFormulaFields(template);
            this.createCellFields(template);
        }
        this.finish = function (content, template, s) {
            //add by gud 20130918 处理页脚内容
            this.addFooter(content, this.cellobj);
            //add end
            this.cellobj.ReDraw();
            this.cellobj.DeleteCol(this.cellobj.GetCols(s) - 1, 1, s);
            this.setIncFlag(template, this.cellobj, s);
        }
        /*
        计算标签位置范围
        wanglei add 
        */
        this.setLabelNode = function (content, template, cellobj, s) {
            var rows = cellobj.GetRows(s);
            cellobj.InsertRow(rows, 1, s);
            cellobj.SetRowHidden(rows, rows);
            for (var i = 0; i < content.contentFields.length; i++) {
                var idx = template.getFieldIndex(content.contentFields[i]);
                if (idx < 0)
                    continue;
                var field = template.field(idx);
                var rs = cellobj.GetRows(s) - 1;
                var cs = cellobj.GetCols(s) - 1;
                var t = field._rects[0].r0 - 1;
                var l = field._rects[0].c0 - 1;
                var b = field._rects[0].r1 + 1;
                var r = field._rects[0].c1 + 1;
                var left = cellobj.GetCellNote(l, 0, s);
                var top = cellobj.GetCellNote(0, t, s);
                var bottom = cellobj.GetCellNote(0, b, s);
                var right = cellobj.GetCellNote(r, 0, s);
                cellobj.SetCellNote(l, 0, s, left + "[" + field._name + "]");
                cellobj.SetCellNote(0, t, s, top + "[" + field._name + "]");
                cellobj.SetCellNote(0, b, s, bottom + "[" + field._name + "]");
                cellobj.SetCellNote(r, 0, s, right + "[" + field._name + "]");
            }
        }
        //add by gud 20130918 处理页脚内容
        this.addFooter = function (content, cellobj) {
            var footer = cellobj.PrintGetFooter();
            if (footer == "")
                return;
            var footers = footer.split('|');
            if (footers.length != 3)
                return;
            var footerLeft = footers[0];
            var footerMiddle = footers[1];
            var footerRight = footers[2];
            //this.contentFields = [];
            //this.contentValues = [];
            for (var i = 0; i < content.contentFields.length; i++) {
                footerLeft = footerLeft.replace("<<<" + content.contentFields[i] + ">>>", content.contentValues[i].toString());
                footerMiddle = footerMiddle.replace("<<<" + content.contentFields[i] + ">>>", content.contentValues[i].toString());
                footerRight = footerRight.replace("<<<" + content.contentFields[i] + ">>>", content.contentValues[i].toString());
            }
            cellobj.PrintSetFoot(footerLeft, footerMiddle, footerRight);
        }
        //add end

        //Add  by gud 20121007
        this.setIncFlag = function (template, cellobj, s) {
            for (var i = 0; i < template.fieldarray.length; i++) {
                var field = template.fieldarray[i];
                if (!field.isInc())
                    continue;
                for (var j = 0; j < field._rects.length; j++) {
                    var rect = field._rects[j];
                    for (var k = rect.r0; k <= rect.r1; k++) {
                        var incflag = cellobj.GetCellNote(0, k, s);
                        if ((incflag.length > 0) && (incflag[0] == "1"))
                            continue;
                        cellobj.SetCellNote(0, k, s, "1" + incflag);
                    }
                }
            }
        }
        //Add by gud end

        this.createFormulaFields = function (template) {
            for (var i = 0; i < template.getFieldCount(); i++) {
                var field = template.field(i);
                if (field._type == "FORMULA") {
                    var relatefields = [];
                    for (var j = 0; j < template.getFieldCount(); j++) {
                        var f = template.field(j);
                        if (field._style[0].indexOf("(" + f._name + ")") >= 0)
                            relatefields.push(f);
                        else if (field._style[0].indexOf("{" + f._name + "}") >= 0)
                            relatefields.push(f);
                        else if (field._style[0].indexOf("@" + f._name + "@") >= 0)
                            relatefields.push(f);
                    }
                    var relatesingles = [];
                    for (var j = 0; j < template.getFieldCount(); j++) {
                        var f = template.field(j);
                        if (field._style[0].indexOf("[" + f._name + "]") >= 0)
                            relatesingles.push(f);
                    }
                    if (relatefields.length == 0)
                        continue;
                    var fRelate = relatefields[0];
                    for (var k = field._rects.length; k < fRelate._rects.length; k++) {
                        var rect = new C_Rect();
                        rect.c0 = field._rects[0].c0;
                        rect.c1 = field._rects[0].c1;
                        rect.cm = field._rects[0].cm;
                        rect.r0 = fRelate._rects[k].r0;
                        rect.r1 = fRelate._rects[k].r1;
                        rect.rm = fRelate._rects[k].rm;
                        field._rects.push(rect);
                    }
                    field._value = [[]];
                    for (var l = 0; l < field._rects.length; l++) {
                        var relatefieldspos = [];
                        for (var m = 0; m < relatefields.length; m++)
                            relatefieldspos.push(relatefields[m]._rects[l].r0);
                        var rt = field._rects[l];
                        for (var n = rt.r0; n <= rt.r1; n += rt.rm) {
                            var str = field._style[0];
                            for (var o = 0; o < relatefields.length; o++) {
                                var strTemp = "";
                                while (str != strTemp) {
                                    strTemp = str;
                                    str = strTemp.replace("(" + relatefields[o]._name + ")", "Value(" + cellColToLabel(relatefields[o]._rects[l].c0) + relatefieldspos[o] + ")");
                                    str = str.replace("{" + relatefields[o]._name + "}", cellColToLabel(relatefields[o]._rects[l].c0) + relatefieldspos[o]);
                                    str = str.replace("@" + relatefields[o]._name + "@", cellColToLabel(relatefields[o]._rects[l].c0) + relatefieldspos[o]);
                                }
                                relatefieldspos[o] += relatefields[o]._rects[l].rm;
                            }
                            for (var o = 0; o < relatesingles.length; o++) {
                                var strTemp = "";
                                while (str != strTemp) {
                                    strTemp = str;
                                    str = strTemp.replace("[" + relatesingles[o]._name + "]", "Value(" + cellColToLabel(relatesingles[o]._rects[0].c0) + relatesingles[o]._rects[0].r0 + ")");
                                }
                            }
                            field._value[0].push(str);
                        }
                    }
                    field._style = fRelate._style;
                } else if (field._type == "SUM") {
                    var sumIndex = template.getFieldIndex(field._style[0]);
                    if (sumIndex < 0)
                        continue;
                    var rects = template.field(sumIndex)._rects;
                    field._value = [["SUM(" + cellColToLabel(rects[0].c0) + rects[0].r0 + ":" + cellColToLabel(rects[0].c1) + rects[0].r1 + ")"]];
                    for (var j = 1; j < rects.length; j++)
                        field._value[0][0] += "+SUM(" + cellColToLabel(rects[j].c0) + rects[j].r0 + ":" + cellColToLabel(rects[j].c1) + rects[j].r1 + ")";
                } else if ((field._type == "MAX") || (field._type == "MIN") || (field._type == "AVERAGE") || (field._type == "COUNT")) {
                    var stacIndex = template.getFieldIndex(field._style[0]);
                    if (stacIndex < 0)
                        continue;
                    var rects = template.field(stacIndex)._rects;
                    var ifStr = ",Strlen(loopcell())>0";
                    field._value = [[field._type + "(" + cellColToLabel(rects[0].c0) + rects[0].r0 + ":" + cellColToLabel(rects[0].c1) + rects[0].r1 + ifStr + ")"]];
                    //add from report 20121006
                    var arrValue = new Array();
                    if (field._rects[0].r0 == field._rects[0].r1 && field._rects[0].c0 != field._rects[0].c1) {
                        for (var k = field._rects[0].c0; k < field._rects[0].c1 + 1; k++) {
                            arrValue.push([field._type + "(" + cellColToLabel(k) + rects[0].r0 + ":" + cellColToLabel(k) + rects[0].r1 + ifStr + ")"]);
                        }
                        field._value = arrValue;
                    }
                    else if (field._rects[0].c0 == field._rects[0].c1 && field._rects[0].r0 != field._rects[0].r1) {
                        for (var k = field._rects[0].r0; k < field._rects[0].r1 + 1; k++) {
                            arrValue.push([field._type + "(" + cellColToLabel(rects[0].c0) + k + ":" + cellColToLabel(rects[0].c1) + k + ifStr + ")"]);
                        }
                        field._value = arrValue;
                    }
                    //add end
                }
            }
        }
        this.createCellFields = function (template) {
            for (var i = 0; i < template.getFieldCount(); i++) {
                var field = template.field(i);
                if (field._type == "MAXCELL" || field._type == "MINCELL") {
                    var stacIndex = template.getFieldIndex(field._style[0]);
                    if (stacIndex < 0)
                        continue;
                    var rects = template.field(stacIndex)._rects;
                    var ifStr = ",Strlen(loopcell())>0";
                    if (rects[0].r0 == rects[0].r1)
                        field._value = [["CELL(GetCol(FindCell(" + cellColToLabel(rects[0].c0) + rects[0].r0 + ":" + cellColToLabel(rects[0].c1) + rects[0].r1 + ",,1," + field._type.replace("CELL", "") + "(" + cellColToLabel(rects[0].c0) + rects[0].r0 + ":" + cellColToLabel(rects[0].c1) + rects[0].r1 + ifStr + ")))," + field._show + ",1)"]];
                    if (rects[0].c0 == rects[0].c1)
                        field._value = [["CELL(" + field._show + ",GetRow(FindCell(" + cellColToLabel(rects[0].c0) + rects[0].r0 + ":" + cellColToLabel(rects[0].c1) + rects[0].r1 + ",,1," + field._type.replace("CELL", "") + "(" + cellColToLabel(rects[0].c0) + rects[0].r0 + ":" + cellColToLabel(rects[0].c1) + rects[0].r1 + ifStr + "))),1)"]];
                    var arrValue = new Array();
                    if (field._rects[0].r0 == field._rects[0].r1 && field._rects[0].c0 != field._rects[0].c1) {
                        for (var k = field._rects[0].c0; k < field._rects[0].c1 + 1; k++) {
                            arrValue.push(["CELL(" + field._show + ",GetRow(FindCell(" + cellColToLabel(k) + rects[0].r0 + ":" + cellColToLabel(k) + rects[0].r1 + ",,1," + field._type.replace("CELL", "") + "(" + cellColToLabel(k) + rects[0].r0 + ":" + cellColToLabel(k) + rects[0].r1 + ifStr + "))),1)"]);
                        }
                        field._value = arrValue;
                    }
                    else if (field._rects[0].c0 == field._rects[0].c1 && field._rects[0].r0 != field._rects[0].r1) {
                        for (var k = field._rects[0].r0; k < field._rects[0].r1 + 1; k++) {
                            arrValue.push(["CELL(GetCol(FindCell(" + cellColToLabel(rects[0].c0) + k + ":" + cellColToLabel(rects[0].c1) + k + ",,1," + field._type.replace("CELL", "") + "(" + cellColToLabel(rects[0].c0) + k + ":" + cellColToLabel(rects[0].c1) + k + ifStr + ")))," + field._show + ",1)"]);
                        }
                        field._value = arrValue;
                    }
                }
            }
        }
        //自增行时为每个列增加对应的公式
        //2012-05-14 wanglei add
        this.addFormula = function (s, sr, er) {
            var cs = this.cellobj.GetCols(s);
            var colInfo = [];
            for (var c = 1; c < cs; c++) {
                colInfo.push([c, this.cellobj.CellToLabel(c, er - 1)]);
            }
            for (var i = 1; i < cs; i++) {
                var formula = this.cellobj.GetFormula(i, er - 1, s).replace(/^\s*/g, "").replace(/\s*$/g, "");
                if (formula != '') {
                    for (var l = 0; l < colInfo.length; l++) {
                        if (formula.indexOf(colInfo[l][1]) > -1) {
                            var nlb = this.cellobj.CellToLabel(colInfo[l][0], er);
                            formula = formula.replace(colInfo[l][1], nlb);
                        }
                    }
                    this.cellobj.SetFormula(i, er, s, formula);
                }
            }
        }
        this.copy = function (s, c1, r1, c2, r2, c0, r0) {
            if ((c1 == c0) && (r1 == r0)) return;
            for (var r = 0; r <= r2 - r1; r++) {
                for (var c = 0; c <= c2 - c1; c++)
                    this.cellobj.S(c0 + c, r0 + r, s, this.cellobj.GetCurSheet(c1 + c, r1 + r, s));
            }
        }
    } (cell, bSave);
};

CTemplateContent.prototype.createCellFiller = function (cell, bSave) {
    var filler = this.createSimpleCellFiller(cell, bSave);
    filler.getCellFormat = function (c, r, s) {
        var format = {
            _align: 0,
            _textStyle: 0,
            _textColor: 0,
            _backColor: 0,
            _font: 0,
            _fontStyle: 0,
            _fontSize: 0,
            _borderLeft: 0,
            _borderRight: 0,
            _borderTop: 0,
            _borderBottom: 0,
            _borderLeftColor: 0,
            _borderRightColor: 0,
            _borderTopColor: 0,
            _borderBottomColor: 0,
            getCellFormat: function (cellobj, c, r, s) {
                this._align = cellobj.GetCellAlign(c, r, s);
                this._textStyle = cellobj.GetCellTextStyle(c, r, s);
                this._textColor = cellobj.GetCellTextColor(c, r, s);
                this._backColor = cellobj.GetCellBackColor(c, r, s);
                this._font = cellobj.GetCellFont(c, r, s);
                this._fontSize = cellobj.GetCellFontSize(c, r, s);
                this._fontStyle = cellobj.GetCellFontStyle(c, r, s);
                this._borderLeft = cellobj.GetCellBorder(c, r, s, 0);
                this._borderLeftColor = cellobj.GetCellBorderClr(c, r, s, 0);
                this._borderRight = cellobj.GetCellBorder(c, r, s, 2);
                this._borderRightColor = cellobj.GetCellBorderClr(c, r, s, 2);
                this._borderTop = cellobj.GetCellBorder(c, r, s, 1);
                this._borderTopColor = cellobj.GetCellBorderClr(c, r, s, 1);
                this._borderBottom = cellobj.GetCellBorder(c, r, s, 3);
                this._borderBottomColor = cellobj.GetCellBorderClr(c, r, s, 3);
            },
            setCellFormat: function (cellobj, c, r, s) {
                cellobj.SetCellAlign(c, r, s, this._align);
                cellobj.SetCellTextStyle(c, r, s, this._textStyle);
                cellobj.SetCellTextColor(c, r, s, this._textColor);
                cellobj.SetCellBackColor(c, r, s, this._backColor);
                cellobj.SetCellFont(c, r, s, this._font);
                cellobj.SetCellFontSize(c, r, s, this._fontSize);
                cellobj.SetCellFontStyle(c, r, s, this._fontStyle);
                cellobj.SetCellBorder(c, r, s, 0, this._borderLeft);
                cellobj.SetCellBorderClr(c, r, s, 0, this._borderLeftColor);
                cellobj.SetCellBorder(c, r, s, 2, this._borderRight);
                cellobj.SetCellBorderClr(c, r, s, 2, this._borderRightColor);
                cellobj.SetCellBorder(c, r, s, 1, this._borderTop);
                cellobj.SetCellBorderClr(c, r, s, 1, this._borderTopColor);
                cellobj.SetCellBorder(c, r, s, 3, this._borderBottom);
                cellobj.SetCellBorderClr(c, r, s, 3, this._borderBottomColor);
            }
        };
        format.getCellFormat(this.cellobj, c, r, s);
        return format;
    }
    filler.setCellFormat = function (c, r, s, format) {
        format.setCellFormat(this.cellobj, c, r, s);
    }
    filler.copy = function (s, c1, r1, c2, r2, c0, r0) {
        FT_Copy(this.cellobj, s, c1, r1, c2, r2, c0, r0);
    }
    return filler;
}

function CellDataGetter() {
    this.getDataRange = function () {
        return { left: 0, top: 0, right: -1, bottom: -1 };
    }
    this.Load = function (cellctrl) {
        var range = this.getDataRange();
        for (var r = range.top; r <= range.bottom; r++) {
            for (var c = range.left; c <= range.right; c++) {
            }
        }
    }
}

CTemplateContent.prototype.createSpreadFiller = function (spread) {
    var filler = this.createFiller();
    filler.spread = spread;
    filler.sheet = function (s) { return this.spread.getSheet(s); }
    filler.getCurSheet = function () { return this.spread.getSheetIndex(this.spread.getActiveSheet().name()); }
    filler.getCols = function (s) {
        return this.sheet(s).getColumnCount() + 1;
    }
    filler.getRows = function (s) { return this.sheet(s).getRowCount() + 1; }
    filler.insertRow = function (rowinsert, insertrows, s) {
        rowinsert--;
        var sheet = this.sheet(s);
        sheet.addRows(rowinsert, insertrows);
    }
    filler.getCellString = function (c, r, s) {
        var v = this.sheet(s).getCell(r - 1, c - 1).value();
        if (v instanceof Date)
            return v.getFullYear() + "-" + (v.getMonth() + 1) + "-" + v.getDate() + " " + v.getHours() + ":" + v.getMinutes() + ":" + v.getSeconds();
        if (v === undefined || v === null)
            return "";
        return v.toString();
    }
    filler.setCellString = function (c, r, s, str) { this.sheet(s).setValue(r - 1, c - 1, str); }
    filler.fillCell = function (field, c, r, s, v) {
        var str = this.getCellString(c, r, s);
        if (field._type == "BMP") {
            var v1 = v.split(",");
            if (v1.length > 1) {
                v = v1[0]; v1 = v1[1];
            } else {
                v1 = "";
            };
            this.setCellString(c, r, s, field.getFillValue(str, v1));
            if (v.length != 0) {
                var idx = this.cellobj.AddImage(v);
                if (idx >= 0) {
                    var nStyle = parseInt(parseInt(field._format, 10) / 100, 10);
                    var hAlign = parseInt(parseInt(field._format, 10) / 10, 10) - nStyle * 10;
                    var vAlign = parseInt(field._format, 10) - 10 * hAlign - 100 * nStyle;
                    this.cellobj.SetCellImage(c, r, s, idx, nStyle, hAlign, vAlign);
                }
            }
            return true;
        }
        if (field._type == "URL") {
            var v1 = v.split(",");
            var urlHost, urlTitle;
            var urlName = v1[0];
            if (v1.length > 2) {
                urlHost = v1[1];
                urlTitle = v1[2];
            } else if (v1.length > 1) {
                urlHost = v1[1];
                urlTitle = urlName;
            } else {
                urlHost = urlName;
                urlTitle = urlName;
            }
            if (urlHost.substring(0, 7).toLowerCase() != "http://")
                urlHost = "http://" + window.location.host + "/" + urlHost;

            var cellType = new GC.Spread.Sheets.CellTypes.HyperLink();
            cellType.linkColor("blue");
            cellType.visitedLinkColor("red");
            cellType.text(urlName);
            cellType.linkToolTip(urlTitle);
            this.sheet(s).getCell(r - 1, c - 1).cellType(cellType).value(urlHost);
            return true;
        }
        if (field._type == "NUM") {
            var db = parseFloat(v);
            if (isNaN(db)) {
                this.setCellString(c, r, s, v);
            } else {
                //setCellNumFormat(this.cellobj, c, r, s, field._format);
                //this.cellobj.D(c, r, s, db);
                this.setCellString(c, r, s, v);
            }
            return true;
        }
        if ((field._type == "SUM") || (field._type == "FORMULA") || (field._type == "MAX") || (field._type == "MIN") || (field._type == "AVERAGE") || (field._type == "MAXCELL") || (field._type == "MINCELL") || (field._type == "COUNT")) {
            setCellNumFormat(this.cellobj, c, r, s, field._format);
            var strTemp = "";
            while (v != strTemp) {
                strTemp = v;
                v = strTemp.replace("[comma]", ",");
            }
            this.cellobj.SetFormula(c, r, s, "IF(ISERROR(" + v + "),\"\"," + v + ")");
            return true;
        }
        if (field._type == "PAGE") {
            //赋值SHEET页面 wanglei 2011-12-16 add
            var cl = 0;
            var rl = 0;
            for (var j = 0; j < field._value.length; j++) {
                var sheetIndex = this.getSheetIndex(field._value[j]);
                var sheetR = this.getRows(sheetIndex) - 1;
                var sheetC = this.getCols(sheetIndex) - 1;
                FT_CopyOtherSheet(this.cellobj, s, sheetIndex, field._rects[0].c0 + cl, field._rects[0].r0 + rl, 1, sheetC, 1, sheetR);
                if (this.isH()) {
                    cl += sheetC;
                }
                else {
                    rl += sheetR;
                }
            }
            return true;
        }
        if (field._type == "LIST") {
            //下拉选项 add by gud 20121006
            //format是两个数组，分别对应value和text
            this.cellobj.SetDroplistCell(c, r, s, field._format[1].join("\r\n") + "\r\n------", 4);
            this.setCellString(c, r, s, field.getFillValue(str, v));
            return true;
        }
        return false;
    }

    filler.copy = function (s, c1, r1, c2, r2, c0, r0) { /*this.setCellString(c2, r2, s, this.getCellString(c1, r1, s));*/ }
    filler.getInitialValue = function () { return ""; }
    filler.mergeCells = function (c0, r0, c1, r1, s) {
        this.sheet(s).addSpan(r0-1, c0-1, r1 - r0 + 1, c1 - c0 + 1);
    }
    return filler;
}