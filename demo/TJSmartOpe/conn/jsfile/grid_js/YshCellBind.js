
function CB_GetCellHAlign(a) {
    a = a % 8;
    if (a > 3)
        return "center";
    return (a == 1) ? "left" : "right";
}

function CB_GetCellVAlign(a) {
    if (a > 31)
        return "middle";
    if (a > 15)
        return "bottom";
    return "top";
}

function CB_IsHidden(c, arrHiddenCol) {
    for (var i = 0; i < arrHiddenCol.length; i++) {
        if (arrHiddenCol[i] == c)
            return true;
    }
    return false;
}

function CB_GetHiddenCols(c0, c1, arrHiddenCol) {
    var cols = 0;
    for (var i = 0; i < arrHiddenCol.length; i++) {
        if (arrHiddenCol[i] > c1)
            break;
        if (arrHiddenCol[i] < c0)
            continue;
        cols++;
    }
    return cols;
}

function CreateYshFromCell(cellctrl, pYsh, doc) {
    var s = cellctrl.GetCurSheet();
    //先查找有哪些列是隐藏的
    var arrHiddenCol = [];
    for (var c = 1; c < cellctrl.GetCols(s); c++) {
        if (cellctrl.GetColWidth(1, c, s) < 3) //宽度太小就认为是隐藏的
            arrHiddenCol.push(c);
    }
    var tbl = doc.CreateObject("table", pYsh);
    tbl.children = [];
    for (var r = 1; r < cellctrl.GetRows(s); r++) {
        var tr = doc.CreateObject("tr", tbl);
        for (var c = 1; c < cellctrl.GetCols(s); ) {
            var c0 = F_GetMergeRangeCol(cellctrl, c, r, s, 0);
            var r0 = F_GetMergeRangeRow(cellctrl, c, r, s, 1);
            var c1 = F_GetMergeRangeCol(cellctrl, c, r, s, 2);
            var r1 = F_GetMergeRangeRow(cellctrl, c, r, s, 3);
            if ((c0 == c) && (r0 == r)) {
                var td = doc.CreateObject("td", tr);
                td.selfattr["col"] = c0 - 1;
                td.selfattr["row"] = r0 - 1;
                if (CB_IsHidden(c, arrHiddenCol) && (c1 == c0)) {
                    td.styles.display = "none";
                }
                var v = cellctrl.GetCellString(c, r, s);
                var nAlign = cellctrl.GetCellAlign(c, r, s); //对齐方式
                td.styles["vertical-align"] = CB_GetCellVAlign(nAlign);
                td.styles["text-align"] = CB_GetCellHAlign(nAlign);
                var clrText = cellctrl.GetCellTextColor(c, r, s); //字体颜色
                td.styles.color = (clrText <= 0) ? "#666666" : CC_ToColor(cellctrl.GetColor(clrText));
                var clrBack = cellctrl.GetCellBackColor(c, r, s); //背景颜色
                td.styles["background-color"] = (clrBack <= 0) ? "#FFFFFF" : CC_ToColor(cellctrl.GetColor(clrBack));
                if (v != "") {
                    var w = 0;
                    for (var i = c0; i <= c1; i++)
                        w += cellctrl.GetColWidth(1, i, s);
                    var urlLink = cellctrl.GetCellHyperLink(c, r, s);
                    var lbl = doc.CreateObject("label", td);
                    lbl.styles["text-align"] = CB_GetCellHAlign(nAlign);
                    lbl.styles["width"] = w - 4;
                    lbl.styles["text-overflow"] = "clip";
                    lbl.styles["white-space"] = "nowrap";
                    lbl.styles["overflow"] = "hidden";
                    //lbl.selfattr["text"] = htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>");
                    lbl.selfattr["text"] = v.replace(/\r/g, "").replace(/\n/g, "<br>");
                    //var nFont = cellctrl.GetCellFont(c, r, s);
                    //var nFontSize = cellctrl.GetCellFontSize(c, r, s);
                    //td.styles.fontfamily = (nFont < 0) ? cellctrl.GetDefaultFontName() : cellctrl.GetFontName(nFont);
                    //td.styles.fontsize = (((nFontSize <= 0) ? cellctrl.GetDefaultFontSize() : nFontSize) * 1.4) + "px";
                }
                if (c1 != c0) {
                    td.attrs.colspan = c1 - c0 + 1; //  - CB_GetHiddenCols(c0, c1, arrHiddenCol);
                } else {
                    if (cellctrl.GetColWidth(1, c, s) <= 2)
                        td.styles.display = "none";
                    else
                        td.attrs.width = cellctrl.GetColWidth(1, c, s) - 2;
                }
                if (r1 != r0) {
                    td.attrs.rowspan = r1 - r0 + 1;
                } else {
                    if (cellctrl.GetRowHeight(1, r, s) <= 2)
                        tr.styles.display = "none";
                    else
                        tr.attrs.height = cellctrl.GetRowHeight(1, r, s) - 2;
                }
            }
            c = c1 + 1;
        }
    }
    return tbl;
}

function BindTableCellByCell(td, cellctrl, c, c0, c1, r, s, v, bSetWidth, bEncode, fResetLink) {
    var nAlign = cellctrl.GetCellAlign(c, r, s); //对齐方式
    td.style.verticalAlign = CB_GetCellVAlign(nAlign);
    td.style.textAlign = CB_GetCellHAlign(nAlign);
    var clrText = cellctrl.GetCellTextColor(c, r, s); //字体颜色
    td.style.color = (clrText < 0) ? "#666666" : CC_ToColor(cellctrl.GetColor(clrText));
    //if (v == "")
    //    return;
    var html = v;
    if (bEncode)
        html = htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>");
    var widthstr = "";
    if (bSetWidth) {
        var w = 0;
        for (var i = c0; i <= c1; i++)
            w += cellctrl.GetColWidth(1, i, s);
        widthstr = ";width:" + (w - 1);
    }
    html = "<span style=\"text-align:" + CB_GetCellHAlign(nAlign) + widthstr + ";word-break:break-all\"><span>" + html + "</span></span>";
    var urlLink = cellctrl.GetCellHyperLink(c, r, s);
    var nFontStyle = cellctrl.GetCellFontStyle(c, r, s);
    if (nFontStyle > 0) {
        if (nFontStyle % 4 > 1)
            html = "<B>" + html + "</B>";
    }
    if (urlLink != "") {
        urlLink = urlLink.split('\n');
        if (urlLink.length < 2) {
            urlLink.push("");
        }
        var linkurl = urlLink[0];
        if (fResetLink)
            linkurl = fResetLink(linkurl);
        html = "<A HREF='" + linkurl + "'>" + html + "</A>";
    }
    td.innerHTML = html;
    var nFont = cellctrl.GetCellFont(c, r, s);
    var nFontSize = cellctrl.GetCellFontSize(c, r, s);
    td.style.fontFamily = (nFont < 0) ? cellctrl.GetDefaultFontName() : cellctrl.GetFontName(nFont);
    td.style.fontSize = (((nFontSize <= 0) ? cellctrl.GetDefaultFontSize() : nFontSize) * 1.4) + "px";
}

var nTableSelectMode = 0;//0 - 每个表格可以选一条，1 - 所有表格只能选一条

function SetTableSelectStyle(tbl, s, rownum) {
    function SetRowsSelect(tbl, rowstart, rownum) {
        tbl._selectedRow = rowstart + 1;
        tbl._selectedRows = rownum;
        for (var r = 0; r < rownum; r++) {
            var row = tbl.rows[r + rowstart];
            for (var c = 0; c < row.cells.length; c++) {
                row.cells[c].className = "tempCell";
            }
        }
    }
    function ClearOldSelect(tbl) {
        for (var i = 0; i < tbl._selectedRows; i++) {
            var rOld = tbl.rows[tbl._selectedRow - 1 + i];
            if (typeof rOld != "undefined") {
                for (var c = 0; c < rOld.cells.length; c++) {
                    rOld.cells[c].className = rOld._className;
                }
            }
        }
    }
    if (typeof rownum == "undefined") rownum = 1;
    for (var r = s; r < tbl.rows.length; r += rownum) {
        for (var rr = 0; rr < rownum; rr++) {
            var row = tbl.rows[r + rr];
            row._className = row.cells[0].className;
            row._onclick = row.onclick;
            row._selstart = r;
            row.onclick = function () {
                if (this._onclick)
                    this._onclick();
                var p = GetParentControl(this, "TABLE");
                if (nTableSelectMode == 1) {
                    var tbls = document.getElementsByTagName("TABLE");
                    for (var i = 0; i < tbls.length; i++) {
                        var tbl = tbls[i];
                        if (tbl._selectedRow) {
                            ClearOldSelect(tbl);
                        }
                        tbl._selectedRow = 0;
                    }
                } else {
                    if (p._selectedRow) {
                        ClearOldSelect(p);
                    };
                }
                SetRowsSelect(p, this._selstart, rownum);
            }
        }
    }
}

function BindTableRowByCell(cellctrl, s, r, cStart, tr, css, bSetWidth, fClickStr, fResetLink) {
    var spanIndex = cStart - 1; //需要设置colSpan的tdIndex
    if (css != "sTitle")
        spanIndex--;
    var totalSpan = 0;//内容需要跨的列数
    for (var c = cStart; c < cellctrl.GetCols(s); ) {
        var c0 = F_GetMergeRangeCol(cellctrl, c, r, s, 0);
        var r0 = F_GetMergeRangeRow(cellctrl, c, r, s, 1);
        var c1 = F_GetMergeRangeCol(cellctrl, c, r, s, 2);
        var r1 = F_GetMergeRangeRow(cellctrl, c, r, s, 3);
        if ((c0 == c) && (r0 == r)) {
            //var td = tr.insertCell(-1);
            var td = document.createElement("TD");
            tr.appendChild(td);
            td.className = css;
            if (fClickStr)
                eval("td.onclick=function() { " + fClickStr + "(this); }");
            var vv = cellctrl.GetCellString(c, r, s);
            var lstV = vv.split(':');
            var v = bSetWidth ? lstV[0] : vv;
            var nAlign = cellctrl.GetCellAlign(c, r, s); //对齐方式
            td.style.verticalAlign = CB_GetCellVAlign(nAlign);
            td.style.textAlign = CB_GetCellHAlign(nAlign);
            var clrText = cellctrl.GetCellTextColor(c, r, s); //字体颜色
            td.style.color = (clrText < 0) ? "#666666" : CC_ToColor(cellctrl.GetColor(clrText));
            if (v != "") {
                var w = 0;
                for (var i = c0; i <= c1; i++)
                    w += cellctrl.GetColWidth(1, i, s);
                var strSpan = "<span style=\"text-align:" + CB_GetCellHAlign(nAlign) /*+ ";width:" + (w - 10) */+ ";word-break:break-all\"><span>";
                td.innerHTML = strSpan + htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>") +"</span></span>";
                var urlLink = cellctrl.GetCellHyperLink(c, r, s);
                //td.innerHTML = htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>");
                var nFontStyle = cellctrl.GetCellFontStyle(c, r, s);
                if (nFontStyle > 0) {
                    if (nFontStyle % 4 > 1)
                        td.innerHTML = "<B>" + htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>") + "</B>";
                }
                if (urlLink != "") {
                    urlLink = urlLink.split('\n');
                    if (urlLink.length < 2) {
                        urlLink.push("");
                    }
                    var linkurl = urlLink[0];
                    if (fResetLink)
                        linkurl = fResetLink(linkurl);
                    td.innerHTML = "<A HREF='" + linkurl + "'>" + td.innerHTML + "</A>";
                }
                var nFont = cellctrl.GetCellFont(c, r, s);
                var nFontSize = cellctrl.GetCellFontSize(c, r, s);
                td.style.fontFamily = (nFont < 0) ? cellctrl.GetDefaultFontName() : cellctrl.GetFontName(nFont);
                td.style.fontSize = (((nFontSize <= 0) ? cellctrl.GetDefaultFontSize() : nFontSize) * 1.4) + "px";
            }
            if (c1 != c0) {
                td.colSpan = c1 - c0 + 1;
            } else {
                if (bSetWidth) {
                    if (lstV.length > 1) {
                        td.style.width = lstV[1];
                    }
                    else
                        td.style.width = cellctrl.GetColWidth(1, c, s) - 2;
                }
            }
            if (r1 != r0) {
                td.rowSpan = r1 - r0 + 1;
            }
        }
        c = c1 + 1;
        
        //Add By Wangbinbin 20120511 判断设置宽度0%时隐藏这一列
        var firstRowString = cellctrl.GetCellString(c-1, 1, s);
        var arrSetHdn = firstRowString.split(":");
        if (arrSetHdn.length > 1) {
            if (arrSetHdn[1] == "0%") {
                td.style.display = "none";
				if(Ysh.Const.CIRCLE_LIST){
                if (spanIndex - 1 >= 0) {
                    tr.cells[spanIndex - 1].colSpan += totalSpan;
                    tr.cells[spanIndex - 1].colSpan++;
                    totalSpan = 0;
                }
                else
                    totalSpan++;
            }
            }
            else {
                spanIndex = c - 1;
                if (css != "sTitle")
                    spanIndex--;
            }
        }
        //Add End
    }
}

function BindTableByCell(cellctrl, titlerows, tbl, idCol, cStart, fRow, fSortStr,fResetLink,bAddCheckBox) {
    for (var i = tbl.rows.length - 1; i >= 0; i--) { tbl.deleteRow(i); }
    var s = cellctrl.GetCurSheet();
    //先绑标题
    var r = 1;
    for (; r <= titlerows; r++) {
        var tr = tbl.insertRow(-1);
        if (r == 1) {
            var tdLeftImg = tr.insertCell(-1);
                if (Ysh.Const.CIRCLE_LIST) {
            tdLeftImg.style.width = "16px";
            tdLeftImg.innerHTML = '<img alt="" src="/i/sTitle0.jpg" />';
                }
            tdLeftImg.rowSpan = titlerows;
            if (bAddCheckBox) {
                var tdCb = tr.insertCell(-1);
                tdCb.className = "sTitle";
                tdCb.style.textAlign = "right";
                tdCb.innerHTML = "<input type='checkbox' />";
                tdCb.children[0].onclick = function () {
                    var checked = this.checked;
                    for (var i = 1; i < tbl.rows.length; i++) {
                        var tdItemCheckBox = tbl.rows[i].cells[0];
                        if (tdItemCheckBox.children.length > 0) {
                            tdItemCheckBox.children[0].checked = checked;
                        }
                    }
                }
                tdCb.rowSpan = titlerows;
                //if (!Ysh.Const.CIRCLE_LIST)
                    //tdCb.colSpan = 2;
            }
            BindTableRowByCell(cellctrl, s, r, cStart, tr, "sTitle", true, fSortStr);
            //if ((!Ysh.Const.CIRCLE_LIST) && (!bAddCheckBox)) {
                //var bFirstCol = true;
                //Ysh.Array.first(tr.cells, function (c) { if (bFirstCol) { bFirstCol = false; return false; }; return !Ysh.Web.isHidden(c); }).colSpan++;
            //}
            if (Ysh.Const.CIRCLE_LIST) {
            //            var tdRightImg = tr.insertCell(-1);
            var tdRightImg = document.createElement("TD");
            tr.appendChild(tdRightImg);
            tdRightImg.style.width = "14px";
            tdRightImg.innerHTML = '<img alt="" src="/i/sTitle2.jpg" />';
            tdRightImg.rowSpan = titlerows;
            } else {
                tdLeftImg.style.display = "none";
            }
            //Add
        } else {
            BindTableRowByCell(cellctrl, s, r, cStart, tr, "sTitle", true, fSortStr);
        }
    }
    //再绑内容
    var n = 0;
    var rr = 0;
    for (; r < cellctrl.GetRows(s); r++) {
        var id = cellctrl.GetCellString(idCol, r, s);
        if (this.Skip) {
            if (this.Skip(id))
            continue;
        }
        rr++;
        var tr = tbl.insertRow(-1);
        n++;
        fRow(tr, id);
        if (bAddCheckBox) {
            var tdCb = tr.insertCell(-1);
            tdCb.className = "tbCellboth " + ((rr % 2 == 1) ? "trFirst" : "trSecond");
            tdCb.style.textAlign = "right";
            tdCb.innerHTML = "<input type='checkbox' itemid='" + id + "' />";
        }
        BindTableRowByCell(cellctrl, s, r, cStart, tr, "tbCellboth " + ((rr % 2 == 1) ? "trFirst" : "trSecond"), false, null, fResetLink);
        //tr.cells[0].colSpan ++;
		if(Ysh.Const.CIRCLE_LIST){
        var firstCell = 0; //第一个需要显示的td
        while (tr.cells[firstCell].style.display == "none")
            firstCell++;
        tr.cells[firstCell].colSpan++;
        var lastCell = tr.cells.length - 1;
        while (tr.cells[lastCell].style.display == "none")
            lastCell--;
        tr.cells[lastCell].colSpan++;
		}
        //Add By Wangbinbin 20120508
        //tr.cells[tr.cells.length - 1].colSpan = (tr.cells.length - 1==0)?3:2;
        var tc = document.createElement("TD");
        tr.appendChild(tc);
        tc.style.display = "none";
        tc.innerText = id;
        //Add end
    }
    SetTableSelectStyle(tbl, titlerows);
    return n;
}
function Skip(id) { return id === ""; } //Add by gud 20121023
//---------------------------------------cell绑定table类------------------------------------
var CBT = {};
CBT.GetBaseSet = function () {
    return {
        changeable: []
        , firstcol: 0
        , ClearTable: function (tbl) {
            for (var i = tbl.rows.length - 1; i >= 0; i--)
                tbl.deleteRow(i);
        }
        , SetRowStyle: function (r, tr) {
        }
        , SetColStyle: function (c, td) {
        }
        , SetRowHeight: function (tr, h) {
            tr.style.height = h;
        }
        , SetColWidth: function (tbl, widths) {
            var row = tbl.rows[tbl.rows.length - 1]; //设置最后一行，肯定是数据
            for (var i = 0; i < widths.length; i++) {
                if (this.changeable.indexOf(i) < 0) {
                    row.cells[this.firstcol + i].style.width = widths[i];
                }
            }
        }
        , BindCell: function (cellctrl, c, r, s, tr, td) {
            td.innerHTML = cellctrl.GetCellString(c, r, s);
            var nAlign = cellctrl.GetCellAlign(c, r, s); //对齐方式
            td.style.verticalAlign = CB_GetCellVAlign(nAlign);
            td.style.textAlign = CB_GetCellHAlign(nAlign);
        }
        , BindCol: function (cellctrl, c, r, s, tr, td) {
            this.BindCell(cellctrl, c, r, s, tr, td);
        }
        , BeforeBindRow: function (cellctrl, tr, r, c0, c1) {
        }
        , AfterBindRow: function (cellctrl, tr, r, c0, c1) {
        }
        , BindRow: function (cellctrl, tr, r, c0, c1) {
            this.BeforeBindRow(cellctrl, tr, r, c0, c1);
            for (var c = c0; c <= c1; c++) {
                var td = tr.insertCell(-1);
                this.BindCol(cellctrl, c, r, this.s, tr, td);
                this.SetColStyle(c - c0, td);
            }
            this.AfterBindRow(cellctrl, tr, r, c0, c1);
        }
    }
}

CBT.defbind = {
    widths: {}
    , bContentEncode: true
    , rSpan: 1
    , HideZeroWidth: function (spans, c, tr, td, bTitle) {
        //Add By Wangbinbin 20120511 判断设置宽度0%时隐藏这一列
        var width = this.widths["w" + c];
        if (typeof width == "undefined")
            return;
        if (width == "0%") {
            td.style.display = "none";
            if (td.cellIndex != spans.index)
                return;
            if (Ysh.Const.CIRCLE_LIST) {
            if (spans.index - 1 >= 0) {
                tr.cells[spans.index - 1].colSpan += spans.total;
                tr.cells[spans.index - 1].colSpan++;
                spans.total = 0;
            }
            else
                spans.total++;
        }
        }
        else {
            if (Ysh.Const.CIRCLE_LIST) {
            spans.index = c - spans.colSpans;
            if (!bTitle)
                spans.index--;
        }
        }
        //Add End
    }
    , BindTitleRow: function (cellctrl, s, r, cStart, tr, css, fClickStr) {
        var spans = { index: cStart - 1, total: 0, colSpans: 0 }; //需要设置colSpan的tdIndex,内容需要跨的列数
        for (var c = cStart; c < cellctrl.GetCols(s); ) {
            var c0 = F_GetMergeRangeCol(cellctrl, c, r, s, 0);
            var r0 = F_GetMergeRangeRow(cellctrl, c, r, s, 1);
            var c1 = F_GetMergeRangeCol(cellctrl, c, r, s, 2);
            var r1 = F_GetMergeRangeRow(cellctrl, c, r, s, 3);
            if ((c0 == c) && (r0 == r)) {
                var td = document.createElement("TD");
                tr.appendChild(td);
                td.className = css;
                if (fClickStr)
                    eval("td.onclick=function() { " + fClickStr + "(this); }");
                var vv = cellctrl.GetCellString(c, r, s);
                var lstV = vv.split(':');
                var v = lstV[0];
                var bNeedSetWidth = false;
                if (lstV.length > 1) {
                    bNeedSetWidth = (lstV[1] == "fix");
                }
                BindTableCellByCell(td, cellctrl, c, c0, c1, r, s, v.replace(/\r\n/g, "<BR>"), bNeedSetWidth, false);
                if (c1 != c0) {
                    td.colSpan = c1 - c0 + 1;
                    spans.colSpans += (c1 - c0);
                } else {
                    var thiswidth = "";
                    if (lstV.length > 1) {
                        var w = lstV[1];
                        if ((w != "auto") && (w != "fix")) {
                            td.style.width = w;
                        }
                        thiswidth = w;
                        this.widths["w" + c] = w;
                    }
                    if (thiswidth == "") {
                        td.style.width = cellctrl.GetColWidth(1, c, s) - 2;
                    }
                }
                if (r1 != r0) {
                    td.rowSpan = r1 - r0 + 1;
                }
            }
            this.HideZeroWidth(spans, c, tr, td, true);
            c = c1 + 1;
        }
    }
    , BindContentRow: function (cellctrl, s, r, cStart, tr, css, fClickStr, fResetLink) {
        var spans = { index: cStart - 2, total: 0, colSpans: 0 }; //需要设置colSpan的tdIndex,内容需要跨的列数
        for (var c = cStart; c < cellctrl.GetCols(s); ) {
            var c0 = F_GetMergeRangeCol(cellctrl, c, r, s, 0);
            var r0 = F_GetMergeRangeRow(cellctrl, c, r, s, 1);
            var c1 = F_GetMergeRangeCol(cellctrl, c, r, s, 2);
            var r1 = F_GetMergeRangeRow(cellctrl, c, r, s, 3);
            if ((c0 == c) && (r0 == r)) {
                var td = document.createElement("TD");
                tr.appendChild(td);
                td.className = css;
                if (fClickStr) {
                    eval("td.onclick=function() { " + fClickStr + "(this); }");
                }
                var v = cellctrl.GetCellString(c, r, s);
                BindTableCellByCell(td, cellctrl, c, c0, c1, r, s, v, (this.widths["w" + c] == "fix"), this.bContentEncode, fResetLink);
                if (c1 != c0) {
                    td.colSpan = c1 - c0 + 1;
                    spans.colSpans += (c1 - c0);
                }
                if (r1 != r0) {
                    td.rowSpan = r1 - r0 + 1;
                }
            }
            this.HideZeroWidth(spans, c, tr, td, false);
            c = c1 + 1;
        }
    }
    , BindContentRow2: function (cellctrl, s, r, cStart, arrTr, css, fClickStr, fResetLink) {
        var spans = { index: cStart - 2, total: 0, colSpans: 0 }; //需要设置colSpan的tdIndex,内容需要跨的列数
        for (var rLoop = 0; rLoop < this.rSpan; rLoop++) {
            var tr = arrTr[rLoop];
            for (var c = cStart; c < cellctrl.GetCols(s); ) {
                var c0 = F_GetMergeRangeCol(cellctrl, c, r + rLoop, s, 0);
                var r0 = F_GetMergeRangeRow(cellctrl, c, r + rLoop, s, 1);
                var c1 = F_GetMergeRangeCol(cellctrl, c, r + rLoop, s, 2);
                var r1 = F_GetMergeRangeRow(cellctrl, c, r + rLoop, s, 3);
                if ((c0 == c) && (r0 == r + rLoop)) {
                    var td = document.createElement("TD");
                    tr.appendChild(td);
                    td.className = css;
                    if (fClickStr) {
                        eval("td.onclick=function() { " + fClickStr + "(this); }");
                    }
                    var v = cellctrl.GetCellString(c, r + rLoop, s);
                    BindTableCellByCell(td, cellctrl, c, c0, c1, r + rLoop, s, v, (this.widths["w" + c] == "fix"), this.bContentEncode, fResetLink);
                    if (c1 != c0) {
                        td.colSpan = c1 - c0 + 1;
                        spans.colSpans += (c1 - c0);
                    }
                    if (r1 != r0) {
                        td.rowSpan = r1 - r0 + 1;
                    }
                }
                this.HideZeroWidth(spans, c, tr, td, false);
                c = c1 + 1;
            }
        }
    }
    , Bind1: BindTableByCell
    , Bind: function (cellctrl, titlerows, tbl, idCol, cStart, fRow, fSortStr, fResetLink) {
        for (var i = tbl.rows.length - 1; i >= 0; i--) { tbl.deleteRow(i); }
        var s = cellctrl.GetCurSheet();
        //先绑标题
        var r = 1;
        for (; r <= titlerows; r++) {
            var tr = tbl.insertRow(-1);
            if (r == 1) {
                var tdLeftImg = tr.insertCell(-1);
                if (Ysh.Const.CIRCLE_LIST) {
                tdLeftImg.style.width = "16px";
                tdLeftImg.innerHTML = '<img alt="" src="/i/sTitle0.jpg" />';
                }
                tdLeftImg.rowSpan = titlerows;
                this.BindTitleRow(cellctrl, s, r, cStart, tr, "sTitle", fSortStr);
                //if (!Ysh.Const.CIRCLE_LIST) {
                //var bFirstCol = true;
                //Ysh.Array.first(tr.cells, function (c) { if (bFirstCol) { bFirstCol = false; return false; }; return !Ysh.Web.isHidden(c); }).colSpan++;
                //}
                if (Ysh.Const.CIRCLE_LIST) {
                //            var tdRightImg = tr.insertCell(-1);
                var tdRightImg = document.createElement("TD");
                tr.appendChild(tdRightImg);
                tdRightImg.style.width = "14px";
                tdRightImg.innerHTML = '<img alt="" src="/i/sTitle2.jpg" />';
                tdRightImg.rowSpan = titlerows;
                } else {
                    tdLeftImg.style.display = "none"; //Left add a hidden column
                }
                //Add
            } else {
                this.BindTitleRow(cellctrl, s, r, cStart, tr, "sTitle", fSortStr);
            }
        }
        //再绑内容
        var n = 0;
        var rr = 0;
        for (; r < cellctrl.GetRows(s); r += this.rSpan) {
            var id = cellctrl.GetCellString(idCol, r, s);
            if (this.Skip) {
                if (this.Skip(id))
                    continue;
            }
            rr++;
            var arrTr = [];
            for (var i = 0; i < this.rSpan; i++)
                arrTr.push(tbl.insertRow(-1));
            var tr = arrTr[0];
            n++;
            fRow(tr, id);
            if (this.rSpan > 1) {
                this.BindContentRow2(cellctrl, s, r, cStart, arrTr, "tbCellboth " + ((rr % 2 == 1) ? "trFirst" : "trSecond"), null, fResetLink);
            } else {
                this.BindContentRow(cellctrl, s, r, cStart, tr, "tbCellboth " + ((rr % 2 == 1) ? "trFirst" : "trSecond"), null, fResetLink);
            }
            //tr.cells[0].colSpan ++;
            var firstCell = 0; //第一个需要显示的td
            var lastCell = tr.cells.length - 1;
            tr.cells[firstCell].rowSpan = this.rSpan;
            tr.cells[lastCell].rowSpan = this.rSpan;
            if (Ysh.Const.CIRCLE_LIST) {
            while (tr.cells[firstCell].style.display == "none")
                firstCell++;
            tr.cells[firstCell].colSpan++;
            while (tr.cells[lastCell].style.display == "none")
                lastCell--;
            tr.cells[lastCell].colSpan++;
            }
            //Add By Wangbinbin 20120508
            //tr.cells[tr.cells.length - 1].colSpan = (tr.cells.length - 1==0)?3:2;
            var tc = document.createElement("TD");
            tr.appendChild(tc);
            tc.style.display = "none";
            tc.innerText = id;
            //Add end
        }
        SetTableSelectStyle(tbl, titlerows, this.rSpan);
        return n;
    }
};

CBT.GetSimpleBind = function () {
    return {
        s: 0
        , rSpan: 1
        , settings: CBT.GetBaseSet()
        , GetBindRange: function (cellctrl) { return { l: 1, t: 1, r: cellctrl.GetCols(this.s) - 1, b: cellctrl.GetRows(this.s) - 1 }; }
        , Bind: function (cellctrl, tbl) {
            this.s = cellctrl.GetCurSheet();
            var range = this.GetBindRange(cellctrl);
            this.settings.ClearTable(tbl);
            if (range.t > range.b)
                return;
            for (var r = range.t; r <= range.b; r++) {
                var tr = tbl.insertRow(-1);
                this.settings.BindRow(cellctrl, tr, r, range.l, range.r);
                this.settings.SetRowHeight(tr, cellctrl.GetRowHeight(1, r, this.s));
                this.settings.SetRowStyle(r - range.t, tr);
            }
            var arrColWidth = [];
            for (var c = range.l; c <= range.r; c++) {
                arrColWidth.push(cellctrl.GetColWidth(1, c, this.s));
            }
            this.settings.SetColWidth(tbl, arrColWidth);
        }
    }
}

CBT.GetBaseBind = function () {
    return {//限定，最基本的表格，不会有隐藏列，隐藏行等
        settings: CBT.GetBaseSet()
        , rSpan: 1
        , Bind: function (cellctrl, titlerows, tbl, idCol, cStart, fRow, fSortStr, fResetLink) {
            var obj = CBT.GetSimpleBind();
            obj.settings = this.settings;
            obj.GetBindRange = function (cellctrl) {
                return { l: idCol + 1, t: 1, r: cellctrl.GetCols(this.s) - 1, b: cellctrl.GetRows(this.s) - 1 };
            }
            obj.Bind(cellctrl, tbl);
        }
    }
}


function MiniBindTableByCell(cellctrl, tbl, options) {
    // titlerows, tbl, idCol, cStart, fRow, fSortStr, fResetLink, bAddCheckBox
    function GetTableRowByCell(cellctrl, s, r, cStart, css, bSetWidth, fClickStr,bLeftNoMerge) {
        var html = "";
        var cEnd = cellctrl.GetCols(s) - 1;
        for (var c = cStart; c <= cEnd; ) {
            var c0 = c;//F_GetMergeRangeCol(cellctrl, c, r, s, 0);
            var r0 = r;//F_GetMergeRangeRow(cellctrl, c, r, s, 1);
            var c1 = c;//F_GetMergeRangeCol(cellctrl, c, r, s, 2);
            var r1 = r; //F_GetMergeRangeRow(cellctrl, c, r, s, 3);
            if ((c0 == c) && (r0 == r)) {
                var attrs = {colspan:1};
                var styleHtml = "";
                var innerHtml = "";
                if (css)
                    attrs["class"] = css;
                if (fClickStr)
                    attrs.onclick = fClickStr + "(this)";
                var vv = cellctrl.GetCellString(c, r, s);
                var lstV = vv.split(':');
                var v = bSetWidth ? lstV[0] : vv;
                var nAlign = cellctrl.GetCellAlign(c, r, s); //对齐方式
                var clrText = cellctrl.GetCellTextColor(c, r, s); //字体颜色
                styleHtml += "vertical-align:" + CB_GetCellVAlign(nAlign) + ";text-align:" + CB_GetCellHAlign(nAlign) + ";color:" + ((clrText < 0) ? "#666666" : CC_ToColor(cellctrl.GetColor(clrText)));
                if (v != "") {
                    var w = 0;
                    for (var i = c0; i <= c1; i++)
                        w += cellctrl.GetColWidth(1, i, s);
                    var strSpan = "<span style=\"text-align:" + CB_GetCellHAlign(nAlign) /*+ ";width:" + (w - 10) */ + ";word-break:break-all\"><span>";
                    innerHtml = strSpan + htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>") + "</span></span>";
                }
                if (c1 != c0) {
                    attrs.colspan = c1 - c0 + 1;
                } else {
                    if (bSetWidth) {
                        if (lstV.length > 1) {
                            styleHtml += ";width:" + lstV[1];
                        }
                        else
                            styleHtml += ";width:" + (cellctrl.GetColWidth(1, c, s) - 2);
                    }
                }
                if (r1 != r0) {
                    attrs.rowspan = (r1 - r0 + 1);
                }
                if (!bSetWidth) {
                    if (c1 == cEnd)
                        attrs.colspan++;
                    if (!bLeftNoMerge) {
                        if (c0 == cStart)
                            attrs.colspan++;
                    }
                }
                html += "<td " + Ysh.Object.link(attrs, function (k, v) { return k + "='" + v + "'"; }, " ") + " style='" + styleHtml + "'>" + innerHtml + "</td>";
            }
            c = c1 + 1;
        }
        return html;
    }
    var html = "";
    var s = cellctrl.GetCurSheet();
    var r = 1;
    for (; r <= options.titlerows; r++) {
        html += "<tr>";
        if (r == 1) {
            if (Ysh.Const.CIRCLE_LIST)
            html += "<td style='width:16px' rowspan='" + options.titlerows + "'><img src='/i/sTitle0.jpg' /></td>";
            else
                html += "<td style='display:none' rowspan='" + options.titlerows + "'></td>";
            if (options.bAddCheckBox) {
                html += "<td " + (Ysh.Const.CIRCLE_LIST ? "" : "colspan='2'") + " class='sTitle' style='text-align:right'><input type='checkbox' onclick='Ysh.Web.Table.setCheckBoxState(Ysh.Web.getParent(this,\"TABLE\")," + options.titlerows + ",0,this.checked)' /></td>";
            }
            html += GetTableRowByCell(cellctrl, s, r, options.cStart, "sTitle", true, options.fSortStr, (!Ysh.Const.CIRCLE_LIST) && (!options.bAddCheckBox));
            if (Ysh.Const.CIRCLE_LIST)
            html += "<td style='width:14px' rowspan='" + options.titlerows + "'><img src='/i/sTitle2.jpg' /></td>";
        } else {
            html += GetTableRowByCell(cellctrl, s, r, options.cStart, "sTitle", true, options.fSortStr, !Ysh.Const.CIRCLE_LIST);
        }
        html += "</tr>";
    }
    //再绑内容
    var n = 0;
    var rr = 0;
    var rows = cellctrl.GetRows(s);
    for (; r < rows; r++) {
        var id = cellctrl.GetCellString(options.idCol, r, s);
        if (this.Skip) {
            if (this.Skip(id))
                continue;
        }
        rr++;
        n++;
        //fRow(tr, id);
        html += "<tr " + options.getRowSettings(id) + ">";
        if (options.bAddCheckBox) {
            html += "<td class='tbCellboth " + ((rr % 2 == 1) ? "trFirst" : "trSecond") + "' style='text-align:right' colspan='2'><input type='checkbox' itemid='" + id + "' /></td>";
        }
        html += GetTableRowByCell(cellctrl, s, r, options.cStart, "tbCellboth " + ((rr % 2 == 1) ? "trFirst" : "trSecond"), false, null, options.bAddCheckBox);
        html += "</tr>";
    }
    Ysh.Web.Table.setInnerHTML(tbl, html);
    SetTableSelectStyle(tbl, options.titlerows);
    return n;
}

function ListShow2() {
    this.conditions = ""; //传入条件
    this.pageIndex = 1; //当前页
    this.dataCount = ""; //数据条数
    this.returnSelect = new Array(); //保存选中内容
    this.cellctrl = null; //cell对象
    this.tblobj = null; //表
    this.filename = ""; //对应xml文件名
    this.filepath = ""; //对应cell的路径
    this.ifPage = "false"; //是否分页
    this.pageNum = 0; //每页个数
    this.ifSort = "false"; //是否排序
    this.selectType = "0"; //选择类型 0-不选，1-单选，2-多选
    this.trEvent = ""; //行事件
    this.buttonHTML = ""; //每行后面按钮HTML
    this.divPage = null; //分页内容所在区域
    this.extra = ""; //附加sql
    this.pageEvent = ""; //翻页执行的函数
    this.titleFixed = "false"; //是否固定表头 add by wangbinbin 20140211
    this.templateHTML = ""; //模板HTML
    this.data = null;
    //add by jjw//
    this.cbfilter = "";
    //add by gud//
    this.fResetLink = null;
    this.bindobj = CBT.defbind; //add by gud 20120923
    this.bindobj.Skip = function (id) { return id === ""; } //Add by gud 20121023
    var rootcall = this;
    this.titleRows = 1;
    this.colCheckBox = 0;
    this.checkedID = "";

    this.BindCell = function (lstCondition, lstPage, pageIndex, returnSelect, flowConditions) {
        //判断如果没有模板HTML则提示
        if (!this.templateHTML || this.templateHTML.length == 0) {
            alert("模板HTML为空，请返回重新保存cell！");
            return;
        }
        rp = CellBindFillerObj.createFiller();
        //rp = new ReportPrintObj();
        rp.cellctrl = this.cellctrl;
        rp.filename = this.filepath;
        rp.tblobj = this.tblobj;
        rp.templateHTML = this.templateHTML;
        var ifSort = this.ifSort;
        var xmlname = this.filename;
        var selectType = this.selectType;
        var trEvent = this.trEvent;
        var data = this.data;
        var ctrl = this.ctrl;
        rp.linkurl = "";
        if (rootcall.fResetLink) {
            rp.fillBegin = function () {
                this.filler.getRealUrl = function (c, r, s, url) { return rootcall.fResetLink(url); }
            }
        }
        rp.fillContent = function (content) {
            if (data == null) {
                if (typeof ExecuteBack != "undefined") {
                    var v = ExecuteBack(function () {
                        return rootcall.returnValue(xmlname, lstCondition, lstPage, flowConditions, 0);
                    });
                    if (v.check("查询", true))
                        eval(v.value);
                } else {
                    var v = rootcall.returnValue(xmlname, lstCondition, lstPage, flowConditions, 0);
                    if (v) eval(v);
                }
            }
            else
                eval(data);
            if (rootcall.selectType != 0) {
                var selected = [];
                if (rootcall.checkedID != "")
                    selected = rootcall.checkedID.split(',');
                var idIdx = content.contentFields.indexOf("id");
                if (idIdx >= 0) {
                    var checkedList = [];
                    var idArray = content.contentValues[idIdx];
                    for (var i = 0; i < idArray.length; i++) {
                        checkedList.push(selected.contains(idArray[i]) ? "checked" : "");
                    }
                    content.add("id_checked", checkedList);
                }
            }
        }
        rp.showEnd = function (tableobj, html, template) {
            rootcall.bindobj.rSpan = this.rSpan;
            ctrl.titleRows = rp.binder.titleRows;
            ctrl.FixTitle();
        }
        var arrEvent = this.trEvent.split("#@#");
        rp.initBinder = function (binder) {
            binder.selectType = rootcall.selectType;
            binder.selectColumn = rootcall.colCheckBox;
            binder.allSelectedHandle = rootcall.id + ".AllSelected(this.checked);";
            binder.itemSelectedHandle = rootcall.id + ".ItemSelected(Ysh.Web.getParent(this,\"TR\").itemid,this.checked);";
            binder.setTitleCol = function (td, c, r, s) {
                Ysh.Object.add(td.attr, "onclick", rootcall.id + ".sort(\"" + td.text + "\")");
            }
            if (rootcall.initBinder)
                rootcall.initBinder(binder);
            Ysh.Object.addHandle(binder, "setContentRow", function (tr, r, s) {
                for (var e = 0; e < arrEvent.length; e++) {
                    var evt = arrEvent[e];
                    if (evt == "")
                        continue;
                    var temp = Ysh.String.split2(evt, "=");
                    var name = Ysh.String.trim(temp[0].replace("tr.", ""));
                    var handle = Ysh.String.trim(temp[1])
                    handle = handle.replaceAll("**id**", "<<<id_same,SAME,id>>>");
                    if (handle.startsWith("function"))
                        handle = "(" + Ysh.String.trimEnd(handle, ";") + ")();";
                    Ysh.Object.add(tr.attr, name, handle);
                }
            });
            Ysh.Object.addHandle(binder, "endGetRow", function (tr, r, s) {
                if (rootcall.buttonHTML == "")
                    return;
                if (r == 1 && this.titleRows > 0) {
                    var td = TableCellBind.createCell();
                    td.text = "操作";
                    td.style.width = "8%";
                    td.style["text-align"] = "center";
                    td.attr["rowspan"] = this.titleRows;
                    tr.cells.push(td);
                }
                if (r == this.titleRows + 1) {
                    var td = TableCellBind.createCell();
                    td.style.width = "8%";
                    td.style["text-align"] = "center";
                    td.text = rootcall.buttonHTML.replaceAll("**id**", "<<<id_same,SAME,id>>>");
                    td.attr["rowspan"] = this.rm;
                    tr.cells.push(td);
                }
            }, true);
        }
        rp.FormatHTML = function (lstTr, binder) {
            binder.titleRows = GetTitleRows(lstTr);
            binder.rm = lstTr.length - binder.titleRows;
                binder.rootcall = rootcall;
            for (var i = 0; i < lstTr.length; i++) {
                binder.startGetRow(lstTr[i], i + 1, 0);
                binder.endGetRow(lstTr[i], i + 1, 0);
            }
            binder.endBind(lstTr);
            function GetTitleRows(lstTr) {
                for (var i = 0; i < lstTr.length; i++) {
                    for (var j = 0; j < lstTr[i].cells.length; j++) {
                        if (lstTr[i].cells[j].text.indexOf("<<<id") >= 0)
                            return i;
                        if (lstTr[i].cells[j].attr.onclick)
                            lstTr[i].cells[j].attr.onclick = lstTr[i].cells[j].attr.onclick.replace(/@@listshow@@/g, rootcall.id);
                    }
                }
                return 1;
            }
            return lstTr;
        }
        rp.doFill(this.cellctrl, this.tblobj);
        this.titleRows = rp.binder.titleRows;
    }
    this.SetConditions = function (v, db, extra,bSort) {
        this.conditions = v;
        this.flowConditions = "";
        this.db = db;
        this.extra = extra;
        this.getTemplateHTML();
        if (!bSort && this.orderCol)
            this.SetOrderCondition(this.orderCol);
        if (this.ifPage == "true") {
            var dataCount = this.returnValue(this.filename, v, [{ "id": "start", "value": [0] }, { "id": "length", "value": [this.pageNum]}], undefined, 1);
            this.Page(1, this.pageNum, dataCount, 1);
        }
        else
            this.BindCell(v);
    }
    this.SetFlowConditions = function (v, fv, db, extra,bSort) {
        this.extra = extra;
        this.db = db;
        this.conditions = v;
        this.flowConditions = fv;
        this.getTemplateHTML();
        if(!bSort&&this.orderCol)
            this.SetOrderCondition(this.orderCol);
        if (this.ifPage == "true") {
            var dataCount = this.returnValue(this.filename, v, [{ "id": "start", "value": [0] }, { "id": "length", "value": [this.pageNum]}], fv, 1);
            this.Page(1, this.pageNum, dataCount, 1);
        }
        else
            this.BindCell(v, undefined, undefined, undefined, fv);
    }
    this.SetOrderCondition=function(order){
        var bFlag = false;
        if (!this.conditions)
            this.conditions = new Array();
        for (var i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i].id == "order") {
                this.conditions[i].value = [order];
                bFlag = true;
            }
        }
        if (!bFlag)
            this.conditions.push({ "id": "order", "value": [order] });
    }
    this.setColWidth = function (o) {
        if (Object.prototype.toString.call(o) != "[object Object]")
            return false;
        if (!this.templateHTML || this.templateHTML.length == 0)
            this.getTemplateHTML();
        var cells = this.templateHTML.length >= this.titleRows ? this.templateHTML[this.titleRows - 1].cells : [];
        for (var colText in o) {
            var width = o[colText] || "0%";
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].text != colText)
                    continue;
                cells[i].style.width = width;
                var display = width == "0%" ? "none" : "";
                cells[i].style.display = display;
                this.templateHTML[this.titleRows].cells[i].style.display = display;
                break;
            }
        }
    }
    this.sort = function (text) {
        if (this.ifSort != "true")
            return;
        var td = event.srcElement;
        if (td.parentElement.rowIndex + td.rowSpan != this.titleRows)
            return;
        var tr = td.parentElement;
        var tdIndex = -1;
        for (var i = 0; i < tr.children.length; i++) {
            var html = tr.children[i].outerHTML;
            if ((html.indexOf("sort(\"" + text + "\")") >= 0) || (html.indexOf("sort(&quot;" + text + "&quot;)") >= 0)) {
                tdIndex = i;
                break;
            }
        }
        if (tdIndex < 0)
            return;
        var pos = { row: tr.rowIndex, col: tdIndex };
        var order = "";
        if (td.children.length > 0 && td.children[0].src.indexOf("uparrow.gif") >= 0)
            order = " desc";
        this.SetOrderCondition(text + order);
        if (this.flowConditions)
            this.SetFlowConditions(this.conditions, this.flowConditions, this.db, this.extra, true);
        else
            this.SetConditions(this.conditions, this.db, this.extra, true);
        //加排序箭头
        this.tblobj.rows[pos.row].cells[pos.col].innerHTML += "<img src='/i/" + (order == "" ? "up" : "down") + "arrow.gif'/>";
        if (typeof AddAuditLog == "function")
            AddAuditLog(text);
    }

    this.SetCheckedID = function (returnSelect) {
        var arrCheckedID = [];
        for (var i = 0; i < returnSelect.length; i++) {
            for (var j = 0; j < returnSelect[i].value.length; j++) {
                arrCheckedID.push(returnSelect[i].value[j][0]);
            }
        }
        return arrCheckedID.join(",");
    }

    this.Page = function (pageIndex, pageCount, dataCount, toPageIndex) {
        toPageIndex = toPageIndex ? toPageIndex : 1;
        pageCount = (pageCount && pageCount > 0) ? pageCount : 10;
        var pageTotal = Math.ceil(dataCount / pageCount);
        if (toPageIndex < 1) toPageIndex = 1;
        if (toPageIndex > pageTotal) toPageIndex = pageTotal;
        //找到本页选中的项
        if (this.selectType == "2" || this.selectType == "1") {
            this.returnSelect = GetCheckedData(this.tblobj, this.selectType, this.returnSelect, pageIndex, this.colCheckBox, this.bindobj.rSpan);
        }
        if (this.returnSelect != undefined && this.returnSelect.length != 0)
            this.checkedID = this.SetCheckedID(this.returnSelect);
        if (this.pageEventBefore != "")//翻页前执行
            eval(this.pageEventBefore);
        this.pageIndex = toPageIndex;
        var divPage = this.divPage;
        this.BindCell(this.conditions == "" ? undefined : this.conditions, [{ "id": "start", "value": [pageCount * ((toPageIndex == 0 ? 1 : toPageIndex) - 1)] }, { "id": "length", "value": [pageCount]}], this.pageIndex, this.returnSelect, this.flowConditions == "" ? undefined : this.flowConditions)
        this.data = null;
        if (pageTotal > 1) {
            divPage.innerHTML = "<a id=" + this.id + "firstpage onmouseover=\"this.style.cursor='hand'\">首页</a>&nbsp;<a id=" + this.id + "prepage onmouseover=\"this.style.cursor='hand'\">上一页</a>&nbsp;"
                        + "<a id=" + this.id + "nextpage onmouseover=\"this.style.cursor='hand'\">下一页</a>&nbsp;<a id=" + this.id + "lastpage onmouseover=\"this.style.cursor='hand'\">尾页</a>&nbsp;"
                        + "页次：<font color=red><b>" + this.pageIndex + "</b></font>/<b>" + pageTotal + "</b>页&nbsp;共<b>" + dataCount
                        + "</b>条记录&nbsp;<b>" + pageCount + "</b>条/页 <a onmouseover=\"this.style.cursor='hand'\" id=" + this.id + "gotopage><font color=blue>转到</font></a> 第<input id=" + this.id + "num type='text' value='" + this.pageIndex + "' style='width:30px'/>页";

            document.getElementById(this.id + "firstpage").disabled = this.pageIndex == 1;
            document.getElementById(this.id + "prepage").disabled = this.pageIndex == 1;
            document.getElementById(this.id + "nextpage").disabled = this.pageIndex == pageTotal;
            document.getElementById(this.id + "lastpage").disabled = this.pageIndex == pageTotal;
            var ctrl = this;
            //if (this.pageIndex != 1) {
            Ysh.Web.Event.attachEvent(document.getElementById(this.id + "firstpage"),"onclick", function () { rootcall.Page(toPageIndex, pageCount, dataCount, 1); });
            Ysh.Web.Event.attachEvent(document.getElementById(this.id + "prepage"),"onclick", function () { rootcall.Page(toPageIndex, pageCount, dataCount, parseInt(toPageIndex) - 1); });
            //}
            //if (this.pageIndex != pageTotal) {
            Ysh.Web.Event.attachEvent(document.getElementById(this.id + "nextpage"),"onclick", function () { rootcall.Page(toPageIndex, pageCount, dataCount, parseInt(toPageIndex) + 1); });
            Ysh.Web.Event.attachEvent(document.getElementById(this.id + "lastpage"),"onclick", function () { rootcall.Page(toPageIndex, pageCount, dataCount, pageTotal); });
            //}
            Ysh.Web.Event.attachEvent(document.getElementById(this.id + "gotopage"),"onclick", function () { rootcall.Page(toPageIndex, pageCount, dataCount, document.getElementById(ctrl.id + "num").value); });
            Ysh.Web.Event.attachEvent(document.getElementById(this.id + "num"),"onkeypress", function () {
                if (event.keyCode == 13)
                    document.getElementById(rootcall.id + "gotopage").click();
            });
        }
        else
            divPage.innerHTML = "";
        if (this.pageEventAfter != "")//翻页后执行
            eval(this.pageEventAfter);
    }
    this.SelectAll = function () {
        var table = this.tblobj;
        var bSelected = event.srcElement.checked; //Modify by gud 20121014
        for (var i = 1; i < table.rows.length; i++) {
            if (bSelected) {
                if (table.rows[i].cells[0].children[0] && !table.rows[i].cells[0].children[0].disabled)
                    table.rows[i].cells[0].children[0].checked = true;
            }
            else {
                if (table.rows[i].cells[0].children[0] && !table.rows[i].cells[0].children[0].disabled)
                    table.rows[i].cells[0].children[0].checked = false;
            }
        }
        this.AllSelected(bSelected); //Add by gud 20121014
    }
    //Add by gud 20121014
    this.AllSelected = function (bSelected) {
    }
    this.ItemSelected = function (itemid, bSelected) {
    }
    //Add end
    this.GetReturnValue = function (v) {
        var table = this.tblobj;
        var reVal = new Array();
        this.returnSelect = GetCheckedData(table, this.selectType, this.returnSelect, this.pageIndex, this.colCheckBox, this.bindobj.rSpan, this.titleRows);
        if (this.selectType == "0" || (this.selectType != "1" && this.selectType != "2") || table.rows.length <= 1)
            return reVal;
        var arrReturnIndex = new Array();
        if (!v)
            v = "id";
        //if (v != undefined && v != "") {
        var arrReturnStr = v.split("**");
        for (var i = 0; i < arrReturnStr.length; i++) {
            if (arrReturnStr[i] != "") {
                var bFlag = "false";
                for (var j = 0; j < table.rows[0].cells.length; j++) {
                    if (table.rows[0].cells[j].innerText == arrReturnStr[i]) {
                        arrReturnIndex.push(j);
                        bFlag = "true";
                        break;
                    }
                }
                if (bFlag == "false")
                    arrReturnIndex.push(arrReturnStr[i]);
            }
        }
        //}
        if (arrReturnIndex.length == 0)
            arrReturnIndex.push("id");
        for (var i = 0; i < this.returnSelect.length; i++) {
            for (var x = 0; x < this.returnSelect[i].value.length; x++) {
                var strReturn = "";
                for (var j = 0; j < arrReturnIndex.length; j++) {
                    if (!isNaN(arrReturnIndex[j])) {
                        if (arrReturnIndex[j] < this.colCheckBox)
                            strReturn += this.returnSelect[i].value[x][arrReturnIndex[j]];
                        else
                        strReturn += this.returnSelect[i].value[x][arrReturnIndex[j] - 1];
                    } else if (arrReturnIndex[j] == "id") {
                        strReturn += this.returnSelect[i].value[x][0]; //id值修改为第一列 [this.returnSelect[i].value[x].length - 1];
                    }
                    else
                        strReturn += arrReturnIndex[j];
                }
                reVal.push(strReturn);
                if (this.selectType == "1")
                    break;
            }
        }
        return reVal;
    }
    //add by wangbinbin 20140211 固定表头
    this.FixTitle = function () {
        if (this.titleFixed != "true")
            return;
        if (this.titleRows==undefined)
            this.titleRows = 1;
        for (var i = 0; i < this.titleRows; i++) {
            for (var j = 0; j < this.tblobj.rows[i].cells.length; j++) {
                var td = this.tblobj.rows[i].cells[j];
                if (td.className)
                    td.className += " tdFixed" + this.id;
                else
                    td.className = "tdFixed" + this.id;
            }
        }
    }
    this.GetFieldIndex = function (fieldid) {
        var cells = this.templateHTML[this.templateHTML.length - 1].cells;
        var idx = -1;
        for (var i = 0; i < cells.length; i++) {
            var text = cells[i].text;
            if (text.indexOf("<<<" + fieldid + ",")>=0) {
                idx = i;
                break;
            }
        }
        if (idx < 0)
            return idx;
        return ((idx < this.colCheckBox) || (this.selectType == "0")) ? idx : idx + 1;
    }
    this.GetFieldName = function (colindex) {
        if (typeof this.fields == "undefined")
            this.fields = {};
        if (typeof this.fields[colindex] != "undefined")
            return this.fields[colindex];

        var cells = this.templateHTML[this.templateHTML.length - 1].cells;
        var idx = ((colindex < this.colCheckBox) || (this.selectType == "0")) ? colindex : colindex - 1;
        var str = cells[idx].text;
        var flagIndex = str.indexOf("<<<");

        if (flagIndex >= 0) {
            var commaIndex = str.indexOf(",", flagIndex);
            if (commaIndex > flagIndex) {
                this.fields[colindex] = str.substr(flagIndex + 3, commaIndex - flagIndex - 3);
                return this.fields[colindex];
            }
        }
        return "";
    }
    this.getTemplateHTML = function () {
        if (this._filename != this.filename) {
            this.templateHTML = eval(this.getSaveTemplate(this.filename));
            this._filename = this.filename;
        }
    }
    //add end
}
