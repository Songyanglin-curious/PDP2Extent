// JScript File -- Edit by Gud 20130807
/*自动分行部分开始*/
var F_COPY_CELLFORMAT = true;
function F_GetFirstLine(cellobj, c, r, s, w, str) { if (str.length < 2) return str; if (F_FitCell(cellobj, c, r, s, str, w)) return str; return F_GetFirstLineEx(cellobj, c, r, s, w, str, 1, str.length); }
function F_GetFirstLineEx(cellobj, c, r, s, w, str, p0, p1) { if (p1 - p0 < 2) return str.substr(0, p0); var p = parseInt((p0 + p1) / 2, 10); var str1 = str.substr(0, p); if (F_FitCell(cellobj, c, r, s, str1, w)) return F_GetFirstLineEx(cellobj, c, r, s, w, str, p, p1); return F_GetFirstLineEx(cellobj, c, r, s, w, str, p0, p); }
function F_FitCell(cellobj, c, r, s, str, w) { cellobj.S(c, r, s, str); return cellobj.GetColBestWidth(c) <= w; }
function F_GetLines(array, cellobj, c, r, s, w, str, lines) {
    var sep = "\r\n";
    var idxstart = 0, idxend = 0, lngth = array.length;
    var idxlast = 0;
    while ((idxstart >= 0) && ((lines < 0) || (lngth < lines))) {
        idxend = str.indexOf(sep, idxstart);
        if (idxend < 0) {
            idxlast = idxstart + F_AddLines(cellobj, array, c, r, s, w, str.substring(idxstart, str.length), lines);
            idxstart = -1;
        } else {
            idxlast = idxstart + F_AddLines(cellobj, array, c, r, s, w, str.substring(idxstart, idxend), lines);
            idxstart = idxend + sep.length;
        }
        lines -= (array.length - lngth);
        lngth = array.length;
    };
    return str.substring(idxlast, str.length);
}
function F_AddLines(cellobj, array, c, r, s, w, str, lines) {
    var l = 0, lc = str.length;
    var str0;
    for (var lngth = 0; (l != lc) && ((lines < 0) || (lngth < lines)); lngth++) {
        str0 = str.substring(l, lc);
        var str1 = F_GetFirstLine(cellobj, c, r, s, w, str0);
        array.push(str1);
        l += str1.length;
    }
    return l;
}
/*自动分行部分结束*/
/*辅助函数部分开始*/
function F_SortCell(cell1,cell2) {
	if (cell1[1] < cell2[1])
		return -1;
	if (cell1[1] > cell2[1])
		return 1;
	return (cell1[0] < cell2[0]) ? -1 : 1;
}
function F_IsArray(v) {if (v === null) return false;  return typeof (v) == "object"; }//是否为列表
function F_IsField(v) { return typeof (v.length) == "undefined"; }
function F_ArrayIndexOf(arr, v) { for (var i = 0; i < arr.length; i++) { if (arr[i] == v) return i; }; return -1; }
function F_ArrayClone(v) {if (v === null) return "";  if (!F_IsArray(v)) return v; var a = []; for (var i = 0; i < v.length; i++) { a.push(v[i] === null ? "" : v[i]); }; return a; }
function F_IsInArray(v, arr) { if (null == arr) return false; if (typeof (arr.length) == "undefined") return v == arr; for (var i = 0; i < arr.length; i++) { if (F_IsInArray(v, arr[i])) return true; }; return false; }
function F_ArrayResize(arr, sz ,def) {if (typeof def == "undefined") def = "";  for (var i = arr.length; i < sz; i++) { arr.push(def); } }
function F_ArrayResizeToArray(arr, sz) { var i = 0; for (; i < arr.length; i++) { var item = arr[i]; if (!F_IsArray(item)) { var subarr = []; subarr.push(item); arr[i] = subarr; } }; for (; i < sz; i++) { arr.push([]); } }
function F_ArrayGetTotalLength(valuearray, sidx, lngth) { if (valuearray == null) return 0; if (!F_IsArray(valuearray)) { return (sidx <= 0) ? 1 : 0; }; var lng = 0; var eidx = valuearray.length; if (lngth >= 0) { eidx = Math.min(eidx, sidx + lngth); }; for (var i = sidx; i < eidx; i++) { lng += F_ArrayGetTotalLength(valuearray[i], 0, -1); }; return lng; }
function F_ParseNumber(v, f) { var db = parseFloat(v); if (isNaN(db)) return v; if (f.substr(f.length - 1, 1) == "%") { var ff = parseInt(f.substr(0, f.length - 1), 10); if (isNaN(ff) || ff < 0) return v; return (db * 100).toFixed(ff) + "%"; }; var ff = parseInt(f, 10); if (isNaN(ff) || ff < 0) return v; return db.toFixed(ff); }
function F_ParseTime(v, f) {
    var ff = parseInt(f, 10);
    var sep1, sep2, sep3, sep4, sep5, len;
    var tt = [0, 0, 0, 0, 0, 0];
    len = v.length;
    sep1 = v.indexOf("-");
    if (sep1 < 0) return v;
    sep2 = v.indexOf("-", sep1 + 1);
    if (sep2 < 0) return v;
    sep3 = v.indexOf(" ", sep2 + 1);
    if (sep3 < 0) {
        sep3 = v.indexOf("T", sep2 + 1);
    }
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
function F_ParseSpan(v, f) {
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
function F_ZWByUnit(v, u, d) {
    var str = F_ZhongWenNumber(parseInt(v / u, 10));
    str += d;
    var n = v % u;
    if (n == 0)
        return str;
    if (n < (u / 10))
        str += "零";
    if ((n < 20) && (n > 9))
        str += "一";
    return str + F_ZhongWenNumber(n);
}
function F_ZhongWenNumber(v) {
    if (v > 99999999)
        return F_ZWByUnit(v, 100000000, "亿");
    if (v > 9999)
        return F_ZWByUnit(v, 10000, "万");
    if (v > 999)
        return F_ZWByUnit(v, 1000, "千");
    if (v > 99)
        return F_ZWByUnit(v, 100, "百");
    if (v > 9) {
        var ten = parseInt(v / 10, 10);
        var str = (ten == 1) ? "" : "零一二三四五六七八九".substr(ten, 1);
        str += "十";
        var n = v % 10;
        if (n == 0)
            return str;
        return str + F_ZhongWenNumber(n);
    }
    return "零一二三四五六七八九".substr(v, 1);
}
function F_ToZhongWen(v, f) {
    var vv = parseInt(v, 10);
    if (isNaN(vv)) return v;
    if (vv < 0)
        return "负" + F_ZhongWenNumber(-vv);
    if (vv == 0)
        return "零";
    return F_ZhongWenNumber(vv);
}
function F_SetCellNumFormat(cellobj, c, r, s, format) {
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
function F_ColToLabel(c) {
    c--;
    if (c > 25)
        return F_ColToLabel(parseInt(c / 26, 10)) + F_ColToLabel(c % 26 + 1);
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".substr(c, 1);
}
function F_SplitStringByCell(cellobj, c, r, s, v, w) {
    var array0 = [];
    if (v == "") {
        array0.push("");
    } else {
        if (F_IsArray(v)) {
            for (var i = 0; i < v.length; i++) {
                array0.push(F_SplitStringByCell(cellobj, c, r, s, v[i], w));
            }
        } else {
            F_GetLines(array0, cellobj, c, r, s, w, v, -1);
        }
    }
    return array0;
}
/*辅助函数部分结束*/
function C_Rect() {
    return {
        c0: 0
		, r0: 0
		, c1: 0
		, r1: 0
		, cm: 1
		, rm: 1
		, getOffset: function (c, r) { var rect = C_Rect(); rect.c0 = c + this.c0; rect.c1 = c + this.c1; rect.r0 = r + this.r0; rect.r1 = r + this.r1; rect.cm = this.cm; rect.rm = this.rm; return rect; }
		, getFillItems: function () { return parseInt((this.r1 - this.r0 + 1) / this.rm, 10) * parseInt((this.c1 - this.c0 + 1) / this.cm, 10); }
    };
}

function C_Value() {
    return {
        c: 0
		, r: 0
		, v: [[]]
		, getValue: function (c, r) { return v[c][r]; }
    };
}

function F_AppendOffset(fieldarray, r) {
    if (F_IsField(fieldarray)) {
        fieldarray._rects.push(fieldarray._rects[0].getOffset(0, r));
    } else {
        for (var i = 0; i < fieldarray.length; i++)
            F_AppendOffset(fieldarray[i], r);
    }
}

function F_NotifyInsertRow(cellobj, template, r, count, group, s, rIdx, bMerge, noeffect) {
    for (var i = 0; i < template.getFieldCount(); i++) {
        var f = template.field(i);
        if (F_IsInArray(f, noeffect))
            continue;
        if (f.isInArray(group)) {
            if (f.isVGroup())
                F_VGroupInsertRows(cellobj, f, count, group.length, s, bMerge);
            else {
                F_InsertRows(cellobj, f, count, s, rIdx, bMerge);
            }
            continue;
        }
        for (var j = 0; j < f._rects.length; j++) {
            if (f._rects[j].r1 < r - 1)
                continue;
            if (f._rects[j].r0 < r) {
                F_InsertRows(cellobj, f, count, s, j, bMerge);
                break;
            } else {
                f._rects[j].r0 += count;
                f._rects[j].r1 += count;
            }
        }
    }
}
//自增行时为每个列增加对应的公式
//2012-05-14 wanglei add
addFormula = function (cellobj, s, sr, er) {
    var cs = cellobj.GetCols(s);
    var colInfo = [];
    for (var c = 1; c < cs; c++) {
        colInfo.push([c, cellobj.CellToLabel(c, er - 1)]);
    }
    for (var i = 1; i < cs; i++) {
        var formula = cellobj.GetFormula(i, er - 1, s).replace(/^\s*/g, "").replace(/\s*$/g, "");
        if (formula != '') {
            for (var l = 0; l < colInfo.length; l++) {
                if (formula.indexOf(colInfo[l][1]) > -1) {
                    var nlb = cellobj.CellToLabel(colInfo[l][0], er);
                    formula = formula.replace(colInfo[l][1], nlb);                    
                }
            }
            cellobj.SetFormula(i,er,s,formula);
        }
    }
}

function F_NotifyInsertCol(cellobj, template, c, count, group, s, rIdx, bMerge, noeffect) {
    for (var i = 0; i < template.getFieldCount(); i++) {
        var f = template.field(i);
        if (F_IsInArray(f, noeffect))
            continue;
        if (f.isInArray(group)) {
            F_InsertCols(cellobj, f, count, s, rIdx, bMerge);
            continue;
        }
        for (var j = 0; j < f._rects.length; j++) {
            if (f._rects[j].c1 < c - 1)
                continue;
            if (f._rects[j].c0 < c) {
                F_InsertCols(cellobj, f, count, s, j, bMerge);
                break;
            } else {
                f._rects[j].c0 += count;
                f._rects[j].c1 += count;
            }
        }
    }
}

function F_VGroupInsertRows(cellobj, field, count, groupitems, s, bMerge) {
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

function F_InsertRows(cellobj, field, count, s, rectidx, bMerge) {
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
            cellobj.MergeCells(c, rLast - r - rect.rm + 1, c + rect.cm - 1, rLast - r);
    }
}

function F_InsertCols(cellobj, field, count, s, rectidx, bMerge) {
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
            cellobj.MergeCells(cLast - c - rect.cm + 1, r, cLast - c, r + rect.rm - 1);
    }
}

function C_Border() {
    return {
        u: 0
		, l: 0
		, mergeBorder: function (uu, ll) { this.u = Math.max(this.u, uu); this.l = (this.l == 0) ? ll : Math.min(this.l, ll); }
		, mergeField: function (f) { this.mergeBorder(f.getLastRect().r1, f._rects[0].r0); }
    }
}

function F_GetBorderRow(fieldarray, borders) {
    for (var i = 0; i < fieldarray.length; i++) {
        var tmp = fieldarray[i];
        if (F_IsField(tmp)) {
            borders.mergeField(tmp);
        } else {
            for (var j = 0; j < tmp.length; j++)
                borders.mergeField(tmp[j]);
        }
    }
}

function F_GetTextFromDOM(obj, args) {
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
            if ((null != args) && F_IsArray(args)) {
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
}

function C_FillContent() {
    this.contentFields = [];
    this.contentValues = [];
    this.contentRowRanges = [];

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
            if (F_IsArray(value)) {
                v = value;
            } else {
                v = [value];
            }
        }
        this.contentValues.push(v);
        this.contentFields.push(field);
        if (rrs == null) {
            rrs = [];
            if (F_IsArray(v)) {
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
            field._value = F_ArrayClone(this.contentValues[i]);
            field._rrs = this.contentRowRanges[i];
            //wanglei add
            //判断是否是二维数据           
            if(field._value.length > 0 && F_IsArray(field._value[0])){
                field._isMore = true;
                field._vLength = field._value[0].length;
            }
        }
    }
    /*
    计算标签位置范围
    wanglei add 
    */
    this.setLabelNode = function (template, cellobj, s) {
        var rows = cellobj.GetRows(s);
        cellobj.InsertRow(rows, 1, s);
        cellobj.SetRowHidden(rows, rows);
        for (var i = 0; i < this.contentFields.length; i++) {
            var idx = template.getFieldIndex(this.contentFields[i]);
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
    
    //wanglei 2011-12-14 add
    //创建PAGE类型的字段做需要的空间
    this.createPageTypeFieldsNeedSpace = function (template, cellobj, s) {
        for (var i = 0; i < template.getFieldCount(); i++) {
            var field = template.field(i);
            if (field._type == "PAGE") {
                if(field._value.length==0) return;            
                var rect = field._rects[0];
                var rSpace = rect.r1 - rect.r0 + 1; //当前已分配的行
                var cSpace = rect.c1 - rect.c0 + 1; //当前已分配的列
                var isH = field.isH(); //是否横向排列
                var insertR = 0; //要插入的行数
                var insertStartR = rect.r1 + 1; //插入起始行
                var insertC = 0; //要插入的列数
                var insertStartC = rect.c1 + 1; //插入起始列
                for (var j = 0; j < field._value.length; j++) {                    
                    var sheetIndex = cellobj.GetSheetIndex(field._value[j]);                    
                    var sheetR = cellobj.GetRows(sheetIndex) - 1;
                    var sheetC = cellobj.GetCols(sheetIndex) - 1;                    
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
                    cellobj.InsertRow(insertStartR, insertR, s);
                    var h = cellobj.GetRowHeight(1, rect.r0, s);
                    for (var r = insertStartR; r < insertStartR + insertR; r += rect.rm)
                        cellobj.SetRowHeight(1, h, r, s);
                    F_NotifyInsertRow(cellobj, template, insertStartR, insertR, field, s, 0, true, null);
                }
                if (insertC > cSpace) {
                    insertC = insertC - cSpace;
                }
                else {
                    insertC = 0;
                }
                
                if (insertC > 0) {
                    cellobj.InsertCol(insertStartC, insertC, s);
                    var h = cellobj.GetColWidth(1, rect.c0, s);
                    for (var c = insertStartC; c < insertStartC + insertC; c += rect.cm)
                        cellobj.SetColWidth(1, h, c, s);
                    F_NotifyInsertCol(cellobj, template, insertStartC, insertC, field, s, 0, true, null);
                }
            }
        }
    }

    this.createSameTypeFields = function (template, cellobj, s) {
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
                field._value = F_ArrayClone(sameField._value);
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
                            cellobj.S(c, r, s, "");
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
                                str = strTemp.replace("(" + relatefields[o]._name + ")", "Value(" + F_ColToLabel(relatefields[o]._rects[l].c0) + relatefieldspos[o] + ")");
                                str = str.replace("{" + relatefields[o]._name + "}", F_ColToLabel(relatefields[o]._rects[l].c0) + relatefieldspos[o]);
                                str = str.replace("@" + relatefields[o]._name + "@", F_ColToLabel(relatefields[o]._rects[l].c0) + relatefieldspos[o]);
                            }
                            relatefieldspos[o] += relatefields[o]._rects[l].rm;
                        }
                        for (var o = 0; o < relatesingles.length; o++) {
                            var strTemp = "";
                            while (str != strTemp) {
                                strTemp = str;
                                str = strTemp.replace("[" + relatesingles[o]._name + "]", "Value(" + F_ColToLabel(relatesingles[o]._rects[0].c0) + relatesingles[o]._rects[0].r0 + ")");
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
                field._value = [["SUM(" + F_ColToLabel(rects[0].c0) + rects[0].r0 + ":" + F_ColToLabel(rects[0].c1) + rects[0].r1 + ")"]];
                for (var j = 1; j < rects.length; j++)
                    field._value[0][0] += "+SUM(" + F_ColToLabel(rects[j].c0) + rects[j].r0 + ":" + F_ColToLabel(rects[j].c1) + rects[j].r1 + ")";
            } else if ((field._type == "MAX") || (field._type == "MIN") || (field._type == "AVERAGE")||(field._type == "COUNT")) {
                var stacIndex = template.getFieldIndex(field._style[0]);
                if (stacIndex < 0)
                    continue;
                var rects = template.field(stacIndex)._rects;
                var ifStr = ",Strlen(loopcell())>0";
                field._value = [[field._type + "(" + F_ColToLabel(rects[0].c0) + rects[0].r0 + ":" + F_ColToLabel(rects[0].c1) + rects[0].r1 + ifStr + ")"]];
//add from report 20121006
                var arrValue = new Array();
                if (field._rects[0].r0 == field._rects[0].r1 && field._rects[0].c0 != field._rects[0].c1) {
                    for (var k = field._rects[0].c0; k < field._rects[0].c1 + 1; k++) {
                        arrValue.push([field._type + "(" + F_ColToLabel(k) + rects[0].r0 + ":" + F_ColToLabel(k) + rects[0].r1 + ifStr + ")"]);
                    }
                    field._value = arrValue;
                }
                else if (field._rects[0].c0 == field._rects[0].c1 && field._rects[0].r0 != field._rects[0].r1) {
                    for (var k = field._rects[0].r0; k < field._rects[0].r1 + 1; k++) {
                        arrValue.push([field._type + "(" + F_ColToLabel(rects[0].c0) + k + ":" + F_ColToLabel(rects[0].c1) + k + ifStr + ")"]);
                    }
                    field._value = arrValue;
                }
//add end
            }
        }
    }

    this.resetValues = function (field, cellobj, c, r, s) {
        if (field._value == null)
            field._value = [];
        value = field._value;
        field.getRealArray(value);
        if ((!field.isAutoCr()) || (value.length == 0))
            return;
        var format = {
            _align: 0
			, _textStyle: 0
			, _textColor: 0
			, _backColor: 0
			, _font: 0
			, _fontStyle: 0
			, _fontSize: 0
			, _borderLeft: 0
			, _borderRight: 0
			, _borderTop: 0
			, _borderBottom: 0
			, _borderLeftColor: 0
			, _borderRightColor: 0
			, _borderTopColor: 0
			, _borderBottomColor: 0

			, getCellFormat: function (cellobj, c, r, s) {
			    if (!F_COPY_CELLFORMAT)
			        return;
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
			}

			, setCellFormat: function (cellobj, c, r, s) {
			    if (!F_COPY_CELLFORMAT)
			        return;
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
        }

        var array0 = [];
        var GetCellRectWidth = function (rect, cellobj, s) {
            var w = 0;
            for (var cc = 0; cc < rect.cm; cc++)
                w += cellobj.GetColWidth(1, rect.c0 + cc, s);
            if (w > 40)
                w = w * 19 / 20;
            else
                w = w - 2;
            return w;
        };
        if (field._isJoint) {
            for (var vi = 0; vi < value.length; vi++) {
                var v = value[vi];
                var arr = [];
                for (var i = 0; i < field._rects.length; i++) {
                    var rect = field._rects[i];
                    format.getCellFormat(cellobj, rect.c0, rect.r0);
                    format.setCellFormat(cellobj, c, r, s);
                    var w = GetCellRectWidth(rect, cellobj, s);
                    v = F_GetLines(arr, cellobj, c, r, s, w, v, (i == field._rects.length - 1) ? -1 : rect.getFillItems());
                }
                array0.push(arr);
            }
        } else {
            var rect = field._rects[0];
            format.getCellFormat(cellobj, rect.c0, rect.r0);
            format.setCellFormat(cellobj, c, r, s);
            var w = GetCellRectWidth(rect, cellobj, s);
            for (var i = 0; i < value.length; i++) {
                array0.push(F_SplitStringByCell(cellobj, c, r, s, value[i], w));
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
        var idx = F_ArrayIndexOf(groupnames, field._group);
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
            if (field._block == "") {
                this.classifyGroup(field, noblockarray, groupnames);
                continue;
            }
            var bFather = (field._pblock == "");
            var gidx = bFather ? 0 : 1;
            var blockname = bFather ? field._block : field._pblock;
            var idx = F_ArrayIndexOf(blocknames, blockname);
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
            F_ArrayResizeToArray(group[i]._value, maxsize1);
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
                F_ArrayResize(group[i]._value[j], maxsize2, group[i]._formatNULL);
            }
        }
    }

    this.insertGroupRows = function (group, cellobj, template, s, rridx) {
        var bInc = false; for (var i = 0; i < group.length; i++) { if (group[i].isInc()) { bInc = true; break; } }; if (!bInc) return;
        var field = group[0];        
        var rectidx = ((rridx < 0) || (rridx >= field._rects.length)) ? field._rects.length - 1 : rridx;
        var insertitems = field.getExtraItemCount(rridx);         
        if(field._isMore){
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
            cellobj.InsertRow(rowinsert, insertrows * group.length, s);
            for (var fIdx = 0; fIdx < group.length; fIdx++) {
                var h = cellobj.GetRowHeight(1, group[fIdx]._rects[rectidx].r0, s);
                for (var ii = 0; ii < insertrows; ii++) {
                    cellobj.SetRowHeight(1, h, rowinsert + ii * group.length + fIdx, s);
                }
            }
            if (rect.c0 > 1) {
                for (var ii = 0; ii < insertrows; ii++) {
                    F_Copy(cellobj, s, 1, rowstart, rect.c0 - 1, rowinsert - 1, 1, rowinsert + ii * group.length);
                }
            }
            var h = cellobj.GetRowHeight(1, rect.r0, s);
            for (var r = rowinsert; r < rowinsert + insertrows; r += rect.rm) {
                cellobj.SetRowHeight(1, h, r, s);
                addFormula(cellobj, s, rect.r1, r);
            }
            F_NotifyInsertRow(cellobj, template, rowinsert, insertrows * group.length, group, s, (field.isInsertByWhole() ? 0 : rectidx), true, null);
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
            cellobj.InsertRow(rowinsert, insertrows, s);
            var h = cellobj.GetRowHeight(1, rect.r0, s);
            for (var r = rowinsert; r < rowinsert + insertrows; r += rect.rm) {
                cellobj.SetRowHeight(1, h, r, s);
                addFormula(cellobj, s, rect.r1, r);
            }
            //F_NotifyInsertRow(cellobj, template, rowinsert, insertrows, group, s, (field.isInsertByWhole() ? 0 : rectidx), true, null);
            F_NotifyInsertRow(cellobj, template, rowinsert, insertrows, group, s, rectidx, true, null);
        }
    }
    this.insertGroupCols = function (group, cellobj, template, s, rridx) {
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
        cellobj.InsertCol(colinsert, insertcols, s);
        var h = cellobj.GetColWidth(1, rect.c0, s);
        for (var c = colinsert; c < colinsert + insertcols; c += rect.cm)
            cellobj.SetColWidth(1, h, c, s);
        F_NotifyInsertCol(cellobj, template, colinsert, insertcols, group, s, (field.isInsertByWhole() ? 0 : rectidx), true, null);
    }

    // wanglei add 计算二维数据列
    this.insertDoubleCols = function (group, cellobj, template, s, rridx) {
        var field = group[0];
        var rectidx = ((rridx < 0) || (rridx >= field._rects.length)) ? field._rects.length - 1 : rridx;
        if(field._value.length == 0) return;                    
        if(field._isMore){
            var rect = field._rects[rectidx];
            var insertcols = field._vLength - (rect.cm == 1 ? ((rect.c1 - rect.c0) <= 0 ? 1 : (rect.c1 - rect.c0 + 1)) : rect.cm - ((rect.c1 - rect.c0) <= 0 ? 1 : (rect.c1 - rect.c0 + 1)));      //((rect.c1 - rect.c0) <= 0 ? 1:(rect.c1 - rect.c0)) + (rect.cm == 1 ? 0 : rect.cm); 
            if(insertcols <= 0) return;            
            var colinsert = rect.c1 + 1;
            cellobj.InsertCol(colinsert, insertcols, s);
            var h = cellobj.GetColWidth(1, rect.c0, s);
            for (var c = colinsert; c < colinsert + insertcols; c += rect.cm)
                cellobj.SetColWidth(1, h, c, s);
            F_NotifyInsertCol(cellobj, template, colinsert, insertcols, group, s, (field.isInsertByWhole() ? 0 : rectidx), true, null);
        }
    }

    this.insertSingle = function (groups, cellobj, template, s) {
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            this.resizeGroupValues(group);
            this.insertGroupRows(group, cellobj, template, s, -1);
            this.insertGroupCols(group, cellobj, template, s, -1);
            this.insertDoubleCols(group, cellobj, template, s, -1); // wanglei add 计算二维数据列
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

    this.insertBlock = function (parentgroups, subgroups, cellobj, template, s, cols) {
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
            this.insertSingle(parentgroups, cellobj, template, s);
            this.insertSingle(subgroups, cellobj, template, s);
            return;
        }
        var nStartRow = 0, nEndRow = 0;
        var PBorder = C_Border(), SBorder = C_Border();
        F_GetBorderRow(parentgroups, PBorder);
        F_GetBorderRow(subgroups, SBorder);
        PBorder.mergeBorder(SBorder.u, SBorder.l);
        nStartRow = PBorder.l;
        nEndRow = PBorder.u;
        var rowsperblock = nEndRow - nStartRow + 1;
        var insertrows = rowsperblock * (blocknum - 1);
        cellobj.InsertRow(nEndRow + 1, insertrows, s);
        F_NotifyInsertRow(cellobj, template, nEndRow + 1, insertrows, null, s, 0, false, [parentgroups, subgroups]);
        for (var j = 0; j < blocknum - 1; j++) {
            F_Copy(cellobj, s, 1, nStartRow, cols, nEndRow, 1, nEndRow + j * rowsperblock + 1);
            F_AppendOffset(parentgroups, rowsperblock * (j + 1));
            F_AppendOffset(subgroups, rowsperblock * (j + 1));
        }
        for (j = 0; j < blocknum; j++) {
            for (var k = 0; k < parentgroups.length; k++)
                this.insertGroupRows(parentgroups[k], cellobj, template, s, j);
            for (k = 0; k < subgroups.length; k++)
                this.insertGroupRows(subgroups[k], cellobj, template, s, j);
        }
    }

    this.loadTemplate = function (cellobj) {
        var template = {
            fieldarray: []
                , defaultempty: true
				, getFieldCount: function () { return this.fieldarray.length; }
				, getFieldIndex: function (fieldname) { for (var i = 0; i < this.fieldarray.length; i++) { if (this.fieldarray[i]._name == fieldname) return i; }; return -1; }
				, field: function (idx) { return this.fieldarray[idx]; }
				, parseFlag: function (str) { var ret = []; for (var lPos = 0, rPos = 0; lPos >= 0; ) { lPos = str.indexOf("<<<", rPos); if (lPos >= 0) { rPos = str.indexOf(">>>", lPos); if (rPos >= 0) { ret.push(str.substring(lPos + 3, rPos)); } else { lPos = -1; } } }; return ret; }
				, parseCell: function (cellobj, c, r, s) {
				    if (cellobj.GetFormula(c, r, s) != "")
				        return;
				    var str = cellobj.GetCellString(c, r, s);
				    if (str == "")
				        return;
				    var fieldstrlist = this.parseFlag(str);
				    if (fieldstrlist.length == 0)
				        return;
				    var cm = F_GetMergeRangeCol(cellobj, c, r, s, 2) - c + 1;
				    var rm = F_GetMergeRangeRow(cellobj, c, r, s, 3) - r + 1;
				    for (var i = 0; i < fieldstrlist.length; i++) {
				        var flaglist = fieldstrlist[i].split(",");
				        F_ArrayResize(flaglist, 8);
				        var idx = this.getFieldIndex(flaglist[0]);
				        var field;
				        if (idx < 0) {
				            field = {
				                _name: ""
								, _type: ""
								, _style: [""]
								, _format: ""
								, _formatAssist: ""
								, _formatNULL: ""
								, _group: ""
								, _block: ""
								, _pblock: ""
								, _rects: []
								, _fieldStr: ""
								, _fieldText: ""
								, _value: null
								, _rrs: []
								, _isJoint: false
								, _isMore: false //wanglei add 是否二维数据
								, _vLength: 1 //wanglei add 二维数据长度
                                , _show: ""

								, getRRStart: function (rridx) { if ((rridx >= this._rrs.length) || (rridx < 0)) return 0; var rr = 0; for (var i = 0; i < rridx; i++) { rr += this._rrs[i]; }; return rr; }
								, getRRLength: function (rridx) { return ((rridx >= this._rrs.length) || (rridx < 0)) ? -1 : this._rrs[rridx]; }
								, getLastRect: function () { var count = this._rects.length; return (count == 0) ? null : this._rects[count - 1]; }
								, addFieldPos: function (c, r, cm, rm) { var rectLast = this.getLastRect(); if ((rectLast == null) || (rectLast.c1 > 0)) { var rect = C_Rect(); rect.c0 = c; rect.r0 = r; rect.cm = cm; rect.rm = rm; this._rects.push(rect); } else { rectLast.c1 = c + rectLast.cm - 1; rectLast.r1 = r + rectLast.rm - 1; } }
								, getTotalItemCount: function () { var items = 0; for (var i = 0; i < this._rects.length; i++) { items += this._rects[i].getFillItems(); }; return items; }
								, getExtraItemCount: function (rridx) { return F_ArrayGetTotalLength(this._value, this.getRRStart(rridx), this.getRRLength(rridx)) - ((rridx < 0) ? this.getTotalItemCount() : this._rects[rridx].getFillItems()); }
								, readFrom: function (flaglist, fieldstr, fieldtext) {
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
								    this._fieldStr = "<<<" + fieldstr + ">>>"; this._fieldText = fieldtext; this._group = flaglist[4]; this._block = flaglist[5]; this._pblock = flaglist[6];
								    this._show = flaglist[7];
								}
								, getRealValue: function (value) {
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
								        case "NUMSTR": return F_ParseNumber(value, this._format);
								        case "TIME": return F_ParseTime(value, this._format);
								        case "SPAN": return F_ParseSpan(value, this._format);
								        case "ZHONGWEN": return F_ToZhongWen(value, this._format);
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
								}
								, getRealArray: function (valuearray) { for (var i = 0; i < valuearray.length; i++) { if (F_IsArray(valuearray[i])) { this.getRealArray(valuearray[i]); } else { valuearray[i] = this.getRealValue(valuearray[i]); } } }
								, getFillValue: function (text, value) { if (text == "") return this._fieldText.replace(this._fieldStr, value); return text.replace(this._fieldStr, value); }
								, isInArray: function (fieldarray) { if (null == fieldarray) return false; return F_IsField(fieldarray) ? (fieldarray == this) : (F_ArrayIndexOf(fieldarray, this) >= 0); }
								, isInc: function () { if (this._style[0] == "INCAUTOCR") return true; return F_ArrayIndexOf(this._style, "INC") >= 0; }
								, isVInc: function () { return F_ArrayIndexOf(this._style, "VINC") >= 0; }
								, isAutoCr: function () { if (this._style[0] == "INCAUTOCR") return true; return F_ArrayIndexOf(this._style, "AUTOCR") >= 0; }
								, isH: function () { return F_ArrayIndexOf(this._style, "H") >= 0; }
								, isInsertByWhole: function () { return F_ArrayIndexOf(this._style, "INSERTBYWHOLE") >= 0; }
								, isVGroup: function () { return F_ArrayIndexOf(this._style, "VGROUP") >= 0; }
								, isAutoMerge: function () { return F_ArrayIndexOf(this._style, "AUTOMERGE") >= 0; }
								, fillCellValue: function (cellobj, c, r, s, v) {
								    if (v === null) v = "";
								    var str = cellobj.GetCellString(c, r, s);
								    if (this._type == "BMP") {
								        var v1 = v.split(",");
								        if (v1.length > 1) {
								            v = v1[0]; v1 = v1[1];
								        } else {
								            v1 = "";
								        };
								        cellobj.S(c, r, s, this.getFillValue(str, v1));
								        if (v.length != 0) {
								            var idx = cellobj.AddImage(v);
								            if (idx >= 0) {
								                var nStyle = parseInt(parseInt(this._format, 10) / 100, 10);
								                var hAlign = parseInt(parseInt(this._format, 10) / 10, 10) - nStyle * 10;
								                var vAlign = parseInt(this._format, 10) - 10 * hAlign - 100 * nStyle;
								                cellobj.SetCellImage(c, r, s, idx, nStyle, hAlign, vAlign);
								            }
								        }
								    } else if (this._type == "URL") {
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
								        cellobj.SetCellHyperLink(c, r, s, urlName, urlHost, urlTitle);
								    } else if ((this._type == "NUM") || (this._type == "INDEX")) {
								        var db = parseFloat(v);
								        if (isNaN(db)) {
								            cellobj.S(c, r, s, v);
								        } else {
								            F_SetCellNumFormat(cellobj, c, r, s, this._format);
								            cellobj.D(c, r, s, db);
								        }
								    } else if ((this._type == "SUM") || (this._type == "FORMULA") || (this._type == "MAX") || (this._type == "MIN") || (this._type == "AVERAGE") || (this._type == "MAXCELL") || (this._type == "MINCELL") || (this._type == "COUNT")) {
								        F_SetCellNumFormat(cellobj, c, r, s, this._format);
								        var strTemp = "";
								        while (v != strTemp) {
								            strTemp = v;
								            v = strTemp.replace("[comma]", ",");
								        }
								        cellobj.SetFormula(c, r, s, "IF(ISERROR(" + v + "),\"\"," + v + ")");
								    } else if (this._type == "ENUM") {
								        var n = parseInt(v, 10);
								        var arr = this._format.split("&&&");
								        var vv = "";
								        if ((n >= 0) && (n < arr.length))
								            vv = arr[n];
								        cellobj.S(c, r, s, this.getFillValue(str, vv));
								    } else if (this._type == "PAGE") {
								        //赋值SHEET页面 wanglei 2011-12-16 add
								        var cl = 0;
								        var rl = 0;
								        for (var j = 0; j < field._value.length; j++) {
								            var sheetIndex = cellobj.GetSheetIndex(field._value[j]);
								            var sheetR = cellobj.GetRows(sheetIndex) - 1;
								            var sheetC = cellobj.GetCols(sheetIndex) - 1;
								            F_CopyOtherSheet(cellobj, s, sheetIndex, this._rects[0].c0 + cl, this._rects[0].r0 + rl, 1, sheetC, 1, sheetR);
								            if (this.isH()) {
								                cl += sheetC;
								            }
								            else {
								                rl += sheetR;
								            }
								        }
								    } else if (this._type == "LIST") {
								        //下拉选项 add by gud 20121006
								        //format是两个数组，分别对应value和text
								        cellobj.SetDroplistCell(c, r, s, this._format[1].join("\r\n") + "\r\n------", 4);
								        cellobj.S(c, r, s, this.getFillValue(str, v));
								    } else {
								        cellobj.S(c, r, s, this.getFillValue(str, v));
								    }
								}
								, fillSingleValue: function (cellobj, s, v, arrCell, cIdx) {
								    if (v === null)
								        return -1;
								    if ((cIdx >= arrCell.length) || (cIdx < 0))
								        return -1;
								    if (!F_IsArray(v)) {
								        this.fillCellValue(cellobj, arrCell[cIdx][0], arrCell[cIdx][1], s, v);
								        return cIdx + 1;
								    } else {
								        for (var i = 0; i < v.length; i++) {
								            cIdx = this.fillSingleValue(cellobj, s, v[i], arrCell, cIdx);
								        }
								    }
								    return cIdx;
								}
								, fillCell: function (cellobj, s, bDefaultEmpty) {
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
								                    arrCell.push([c, r]);
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
								                    arrCell.push([c, r]);
								            }
								        }
								    }
								    if (this.isH() && (this._type != "FORMULA"))
								        arrCell.sort(F_SortCell);
								    this.fillSingleValue(cellobj, s, (this._value.length == 0) ? (bDefaultEmpty ? [""] : null) : this._value, arrCell, 0);
								    //this.mergeCell(cellobj,s);
								}
								, mergeCell: function (cellobj, s) {
								    if (!this.isAutoMerge())
								        return;
								    if (!this._value == null)
								        return;
								    for (var i = 0; i < this._rects.length; i++) {
								        var rt = this._rects[i];
								        var str = cellobj.GetCellString(rt.c0, rt.r0, s);
								        var rStart = rt.r0;
								        for (var r = rt.r0 + rt.rm; r <= rt.r1; r += rt.rm) {
								            var strThisCell = cellobj.GetCellString(rt.c0, r, s);
								            if (str != strThisCell) {
								                if (rStart < r - rt.rm)
								                    cellobj.MergeCells(rt.c0, rStart, rt.c1, r - 1);
								                str = cellobj.GetCellString(rt.c0, r, s);
								                rStart = r;
								            }
								        }
								        if (rStart < rt.r1 && str.replace(/(^\s*)|(\s*$)/g, "") != "")
								            cellobj.MergeCells(rt.c0, rStart, rt.c1, rt.r1);
								    }
								}
				            }
				            this.fieldarray.push(field);
				            field.readFrom(flaglist, fieldstrlist[i], str);
				        } else {
				            field = this.fieldarray[idx];
				            cellobj.S(c, r, s, "");
				        }
				        field.addFieldPos(c, r, cm, rm);
				    }
				}
				, load: function (cellobj) { this.fieldarray = []; var c, r, s = cellobj.GetCurSheet(); var cols = cellobj.GetCols(s), rows = cellobj.GetRows(s); for (c = 1; c < cols; c++) { for (r = 1; r < rows; r++) { this.parseCell(cellobj, c, r, s); } }; for (var f = 0; f < this.fieldarray.length; f++) { var field = this.fieldarray[f]; var rectLast = field.getLastRect(); if (rectLast.r1 <= 0) { rectLast.r1 = rectLast.r0 + rectLast.rm - 1; rectLast.c1 = rectLast.c0 + rectLast.cm - 1; } } }
        }
        template.load(cellobj);
        return template;
    }

    this.fillCell = function (cellobj, template, fGetObject, loadPage, saveFlag) {
        var bDefaultEmpty = false;
        if ((typeof template == "undefined") || (!template)) {
            template = this.loadTemplate(cellobj);
            bDefaultEmpty = true;
        } else {
            bDefaultEmpty = template.defaultempty;
        }
        if ((typeof template != "undefined") && (fGetObject))
            this.addFromPage(template, fGetObject);
        //add by gud 20130918 处理页脚内容
        this.addFooter(cellobj);
        //add end
        var s = cellobj.GetCurSheet();
        if (typeof saveFlag != 'undefined' && saveFlag)
            this.setLabelNode(template, cellobj, s);
        var cols = cellobj.GetCols(s);
        cellobj.InsertCol(cols, 1, s);
        cellobj.SetColHidden(cols, cols);
        this.attachValue(template); //将值与对应的Field关联

        this.createSameTypeFields(template, cellobj, s); //创建类型是SAME的Field
        for (var i = 0; i < template.getFieldCount(); i++) { this.resetValues(template.field(i), cellobj, cols, 1, s); } //根据自动换行重新设置值
        //根据模板将Field分组
        var blockarray = [], noblockarray = [];
        this.classify(template, blockarray, noblockarray);
        //重新设置文件格式
        this.insertSingle(noblockarray, cellobj, template, s);
        if ((typeof loadPage == "undefined") || (loadPage)) {
            this.createPageTypeFieldsNeedSpace(template, cellobj, s); //创建PAGE类型的Field
        }
        for (i = 0; i < blockarray.length; i++)
            this.insertBlock(blockarray[i][0], blockarray[i][1], cellobj, template, s, cols);

        this.createFormulaFields(template);

        this.createCellFields(template);
        //填充
        for (i = 0; i < template.getFieldCount(); i++) {
            template.field(i).fillCell(cellobj, s, bDefaultEmpty);
        }
        cellobj.CalculateSheet(s);
        //合并
        for (i = 0; i < template.getFieldCount(); i++) {
            template.field(i).mergeCell(cellobj, s);
        }
        cellobj.ReDraw();
        //cellobj.DeleteCol(cols, 1, s);
        cellobj.DeleteCol(cellobj.GetCols(s) - 1, 1, s); //删除最后一列 wanglei 2011-12-12 add

        if (typeof saveFlag != 'undefined' && saveFlag)
        this.setIncFlag(template, cellobj, s);

        return template;
    }

    //add by gud 20130918 处理页脚内容
    this.addFooter = function (cellobj) {
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
        for (var i = 0; i < this.contentFields.length; i++) {
            footerLeft = footerLeft.replace("<<<" + this.contentFields[i] + ">>>", this.contentValues[i].toString());
            footerMiddle = footerMiddle.replace("<<<" + this.contentFields[i] + ">>>", this.contentValues[i].toString());
            footerRight = footerRight.replace("<<<" + this.contentFields[i] + ">>>", this.contentValues[i].toString());
        }
        cellobj.PrintSetFoot(footerLeft, footerMiddle, footerRight);
    }
    //add end


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
            this.add(field._name, F_GetTextFromDOM(obj, args), null);
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
                    field._value = [["CELL(GetCol(FindCell(" + F_ColToLabel(rects[0].c0) + rects[0].r0 + ":" + F_ColToLabel(rects[0].c1) + rects[0].r1 + ",,1," + field._type.replace("CELL", "") + "(" + F_ColToLabel(rects[0].c0) + rects[0].r0 + ":" + F_ColToLabel(rects[0].c1) + rects[0].r1 + ifStr + ")))," + field._show + ",1)"]];
                if (rects[0].c0 == rects[0].c1)
                    field._value = [["CELL(" + field._show + ",GetRow(FindCell(" + F_ColToLabel(rects[0].c0) + rects[0].r0 + ":" + F_ColToLabel(rects[0].c1) + rects[0].r1 + ",,1," + field._type.replace("CELL", "") + "(" + F_ColToLabel(rects[0].c0) + rects[0].r0 + ":" + F_ColToLabel(rects[0].c1) + rects[0].r1 + ifStr + "))),1)"]];
                var arrValue = new Array();
                if (field._rects[0].r0 == field._rects[0].r1 && field._rects[0].c0 != field._rects[0].c1) {
                    for (var k = field._rects[0].c0; k < field._rects[0].c1 + 1; k++) {
                        arrValue.push(["CELL(" + field._show + ",GetRow(FindCell(" + F_ColToLabel(k) + rects[0].r0 + ":" + F_ColToLabel(k) + rects[0].r1 + ",,1," + field._type.replace("CELL", "") + "(" + F_ColToLabel(k) + rects[0].r0 + ":" + F_ColToLabel(k) + rects[0].r1 + ifStr + "))),1)"]);
                    }
                    field._value = arrValue;
                }
                else if (field._rects[0].c0 == field._rects[0].c1 && field._rects[0].r0 != field._rects[0].r1) {
                    for (var k = field._rects[0].r0; k < field._rects[0].r1 + 1; k++) {
                        arrValue.push(["CELL(GetCol(FindCell(" + F_ColToLabel(rects[0].c0) + k + ":" + F_ColToLabel(rects[0].c1) + k + ",,1," + field._type.replace("CELL", "") + "(" + F_ColToLabel(rects[0].c0) + k + ":" + F_ColToLabel(rects[0].c1) + k + ifStr + ")))," + field._show + ",1)"]);
                    }
                    field._value = arrValue;
                }
            } 
        }
    }
}