// JScript File -- Edit by Gud
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

function CB_ShowModalDialog(url) {
    window.showModalDialog(url, null, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no;scroll:no;");
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

function CB_BindCell(cellctrl, tbl) {
    var s = cellctrl.GetCurSheet();
    //先查找有哪些列是隐藏的
    var arrHiddenCol = [];
    for (var c = 1; c < cellctrl.GetCols(s); c++) {
        if (cellctrl.GetColWidth(1, c, s) < 3) //宽度太小就认为是隐藏的
            arrHiddenCol.push(c);
    }
    for (var r = 1; r < cellctrl.GetRows(s); r++) {
        var tr = tbl.insertRow(-1);
        for (var c = 1; c < cellctrl.GetCols(s); ) {
            var c0 = F_GetMergeRangeCol(cellctrl, c, r, s, 0);
            var r0 = F_GetMergeRangeRow(cellctrl, c, r, s, 1);
            var c1 = F_GetMergeRangeCol(cellctrl, c, r, s, 2);
            var r1 = F_GetMergeRangeRow(cellctrl, c, r, s, 3);
            if ((c0 == c) && (r0 == r)) {
                if (CB_IsHidden(c, arrHiddenCol) && (c1 == c0)) {
                    c = c1 + 1;
                    continue;
                }
                var td = tr.insertCell(-1);
                var v = cellctrl.GetCellString(c, r, s);
                var nAlign = cellctrl.GetCellAlign(c, r, s); //对齐方式
                td.style.verticalAlign = CB_GetCellVAlign(nAlign);
                td.style.textAlign = CB_GetCellHAlign(nAlign);
                var clrText = cellctrl.GetCellTextColor(c, r, s); //字体颜色
                td.style.color = (clrText <= 0) ? "#000000" : CC_ToColor(cellctrl.GetColor(clrText));
                var clrBack = cellctrl.GetCellBackColor(c, r, s); //背景颜色
                td.style.backgroundColor = (clrBack <= 0) ? "#FFFFFF" : CC_ToColor(cellctrl.GetColor(clrBack));
                //add by ljj 设置自动折行
                var clrAlign = cellctrl.GetCellTextStyle(c, r, s);
                var wordbreak = "white-space:nowrap;";
                if (clrAlign == "2") {
                    wordbreak = "word-break: break-all;";                   
                }                
                if (v != "") {
                    var w = 0;
                    for (var i = c0; i <= c1; i++)
                        w += cellctrl.GetColWidth(1, i, s);
                    //+";width:"+(w-10) 090612hcc 为了调整美观　减少一点宽
                    var strSpan = "<span style=\"text-align:" + CB_GetCellHAlign(nAlign) + ";width:100%" + /*(w - 4) +*/ ";text-overflow:clip;overflow:hidden;" + wordbreak + "\"><span>";
                    var urlLink = cellctrl.GetCellHyperLink(c, r, s);
                    td.innerHTML = strSpan + htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>") + "</span></span>";
                    var nFontStyle = cellctrl.GetCellFontStyle(c, r, s);
                    if (nFontStyle > 0) {
                        if (nFontStyle % 4 > 1)
                            td.innerHTML = strSpan + "<B>" + htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>") + "</B></span></span>";
                    }
                    if (urlLink != "") {
                        urlLink = urlLink.split('\n');
                        if (urlLink.length < 2) {
                            urlLink.push("");
                        }
                        if (urlLink[1] == "")
                            td.innerHTML = "<A HREF='" + urlLink[0] + ">" + td.innerHTML + "</A>";
                        else if (urlLink[1].substr(0, 1) == '_')
                            td.innerHTML = "<A HREF='" + urlLink[0] + " target='" + urlLink[1] + "'>" + td.innerHTML + "</A>";
                        else
                            td.innerHTML = "<A onclick='return " + urlLink[1] + "(\"" + urlLink[0] + "\")' HREF='#'>" + td.innerHTML + "</A>";
                    }
                    var nFont = cellctrl.GetCellFont(c, r, s);
                    var nFontSize = cellctrl.GetCellFontSize(c, r, s);
                    td.style.fontFamily = (nFont < 0) ? cellctrl.GetDefaultFontName() : cellctrl.GetFontName(nFont);
                    td.style.fontSize = (((nFontSize <= 0) ? cellctrl.GetDefaultFontSize() : nFontSize) * 1.4) + "px";
                }
                if (c1 != c0 || cellctrl.GetColWidth(1, c, s) == 0) {
                    td.colSpan = c1 - c0 + 1 - CB_GetHiddenCols(c0, c1, arrHiddenCol);
                } else {
                    if (cellctrl.GetColWidth(1, c, s) <= 2)
                        td.style.display = "none";
                    else
                        td.width = cellctrl.GetColWidth(1, c, s) - 2;
                }
                if (r1 != r0 || cellctrl.GetRowHeight(1, r, s) == 0) {
                    td.rowSpan = r1 - r0 + 1;
                } else {
                    if (cellctrl.GetRowHeight(1, r, s) <= 2)
                        tr.style.display = "none";
                    else
                        tr.height = cellctrl.GetRowHeight(1, r, s) - 2;
                }
            }
            c = c1 + 1;
        }
    }
}

function CB_GetNextCol(cellctrl, c, r, s) {
    var c0 = F_GetMergeRangeCol(cellctrl, c, r, s, 0);
    var r0 = F_GetMergeRangeRow(cellctrl, c, r, s, 1);
    var c1 = F_GetMergeRangeCol(cellctrl, c, r, s, 2);
    var r1 = F_GetMergeRangeRow(cellctrl, c, r, s, 3);
    if ((c0 == c1) && (r0 == r1))
        return c;
    return CB_GetNextCol(cellctrl, c1 + 1, r, s);
}

function CB_BindTableBase(cellctrl, tbl, f) {
    var s = cellctrl.GetCurSheet();
    var rows = tbl.rows.length;
    if (rows == 0)
        return;
    var cols = 0;
    for (var c = 0; c < tbl.rows[0].cells.length; c++) {
        cols += tbl.rows[0].cells[c].colSpan;
    }
    cellctrl.SetRows(rows + 1, s);
    cellctrl.SetCols(cols + 1, s);
    var cCur = 1;
    var rCur = 1;
    for (var r = 0; r < rows; r++) {
        var row = tbl.rows[r];
        for (var c = 0; c < row.cells.length; c++) {
            var col = row.cells[c];
            if ((col.colSpan > 1) || (col.rowSpan > 1)) {
                cellctrl.MergeCells(cCur, rCur, cCur + col.colSpan - 1, rCur + col.rowSpan - 1);
            }
            var txt = col.innerText;
            if (f != null)
                txt = f(col);
            var ftxt = parseFloat(txt);
            if (isNaN(ftxt) || (txt != ftxt))
                cellctrl.S(cCur, rCur, s, txt);
            else
                cellctrl.D(cCur, rCur, s, txt);
            cellctrl.SetCellAlign(cCur, rCur, s, 36);
            cCur = CB_GetNextCol(cellctrl, cCur + 1, rCur, s);
        }
        rCur++;
        cCur = CB_GetNextCol(cellctrl, 1, rCur, s);
    }
}

function CB_BindTable(cellctrl, tbl) {
    var s = cellctrl.GetCurSheet();
    var rows = tbl.rows.length;
    if (rows == 0)
        return;
    var cols = 0;
    for (var c = 0; c < tbl.rows[0].cells.length; c++) {
        cols += tbl.rows[0].cells[c].colSpan;
    }
    cellctrl.SetRows(rows + 1, s);
    cellctrl.SetCols(cols + 1, s);
    var cCur = 1;
    var rCur = 1;
    for (var r = 0; r < rows; r++) {
        var row = tbl.rows[r];
        for (var c = 0; c < row.cells.length; c++) {
            var col = row.cells[c];
            if ((col.colSpan > 1) || (col.rowSpan > 1)) {
                cellctrl.MergeCells(cCur, rCur, cCur + col.colSpan - 1, rCur + col.rowSpan - 1);
            }
            var txt = col.innerText;
            if (txt == "")
                txt = col.children && col.children.length && col.firstChild.value ? col.firstChild.value : col.firstChild.innerText;
            
            cellctrl.S(cCur, rCur, s, txt);
            cCur = CB_GetNextCol(cellctrl, cCur + 1, rCur, s);
        }
        rCur++;
        cCur = CB_GetNextCol(cellctrl, 1, rCur, s);
    }
}

function CB_GetCellHtml(cellctrl, s, cols, rows) {
    var tbl = { rows: [], getHtml: function () {
        var html = "<table>";
        for (var r = 0; r < this.rows.length; r++) {
            html += this.rows[r].getHtml();
        }
        return html + "</table>";
    }, insertRow: function () {
        var tr = {
            style: {}, cells: [], getHtml: function () {
                var html = "<tr";
                var style = "";
                for (var k in this.style) {
                    var v = this.style[k];
                    if (v == "") /*默认*/
                        continue;
                    style += k + ":" + v + ";";
                }
                if (style != "") html += " style=\"" + style + "\"";
                html += ">";
                for (var c = 0; c < this.cells.length; c++)
                    html += this.cells[c].getHtml();
                return html + "</tr>";
            }, insertCell: function () {
                var td = { colSpan: 1, rowSpan: 1, style: {}, getHtml: function () {
                    var html = "<td";
                    var style = "";
                    for (var k in this.style) {
                        var v = this.style[k];
                        if (v == "") /*默认*/
                            continue;
                        style += k + ":" + v + ";";
                    }
                    if (style != "") html += " style=\"" + style + "\"";
                    if (this.colSpan != 1) html += " colspan=" + this.colSpan;
                    if (this.rowSpan != 1) html += " rowspan=" + this.rowSpan;
                    return html + ">" + this.innerHTML + "</td>";
                }, innerHTML: ""
                };
                this.cells.push(td); return td;
            }
        };
        this.rows.push(tr); return tr;
    }
    };
    //先查找有哪些列是隐藏的
    var arrHiddenCol = [];
    if (!cols)
        cols = 1000000;
    cols = Math.min(cols, cellctrl.GetCols(s));
    if (!rows)
        rows = 1000000;
    rows = Math.min(rows, cellctrl.GetRows(s));
    for (var c = 1; c < cols; c++) {
        if (cellctrl.GetColWidth(1, c, s) < 3) //宽度太小就认为是隐藏的
            arrHiddenCol.push(c);
    }
    for (var r = 1; r < rows; r++) {
        var tr = tbl.insertRow();
        for (var c = 1; c < cols; ) {
            var c0 = F_GetMergeRangeCol(cellctrl, c, r, s, 0);
            var r0 = F_GetMergeRangeRow(cellctrl, c, r, s, 1);
            var c1 = F_GetMergeRangeCol(cellctrl, c, r, s, 2);
            var r1 = F_GetMergeRangeRow(cellctrl, c, r, s, 3);
            if ((c0 == c) && (r0 == r)) {
                if (CB_IsHidden(c, arrHiddenCol) && (c1 == c0)) {
                    c = c1 + 1;
                    continue;
                }
                var td = tr.insertCell();
                var v = cellctrl.GetCellString(c, r, s);
                var nAlign = cellctrl.GetCellAlign(c, r, s); //对齐方式
                var vAlign = CB_GetCellVAlign(nAlign);
                if (vAlign != "middle")
                    td.style["vertical-align"] = vAlign;
                var hAlign = CB_GetCellHAlign(nAlign);
                if (hAlign != "center")
                    td.style["text-align"] = hAlign;
                var clrText = cellctrl.GetCellTextColor(c, r, s); //字体颜色
                clrText =(clrText <= 0) ? "#000000" : CC_ToColor(cellctrl.GetColor(clrText));
                if (clrText != "#000000")
                    td.style.color = clrText;
                var clrBack = cellctrl.GetCellBackColor(c, r, s); //背景颜色
                clrBack = (clrBack <= 0) ? "#FFFFFF" : CC_ToColor(cellctrl.GetColor(clrBack));
                if (clrBack != "#FFFFFF")
                    td.style["background-color"] = clrBack;
                //add by ljj 设置自动折行
                var clrAlign = cellctrl.GetCellTextStyle(c, r, s);
                var wordbreak = "white-space:nowrap;";
                if (clrAlign == "2") {
                    wordbreak = "word-break: break-all;";
                }
                if (v != "") {
                    var w = 0;
                    for (var i = c0; i <= c1; i++)
                        w += cellctrl.GetColWidth(1, i, s);
                    //+";width:"+(w-10) 090612hcc 为了调整美观　减少一点宽
                    var strSpan = "<span style=\"text-align:" + CB_GetCellHAlign(nAlign) + ";width:100%" + /*(w - 4) +*/";text-overflow:clip;overflow:hidden;" + wordbreak + "\"><span>";
                    var urlLink = cellctrl.GetCellHyperLink(c, r, s);
                    td.innerHTML = strSpan + htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>") + "</span></span>";
                    var nFontStyle = cellctrl.GetCellFontStyle(c, r, s);
                    if (nFontStyle > 0) {
                        if (nFontStyle % 4 > 1)
                            td.innerHTML = strSpan + "<B>" + htmlencode(v).replace(/\r/g, "").replace(/\n/g, "<br>") + "</B></span></span>";
                    }
                    if (urlLink != "") {
                        urlLink = urlLink.split('\n');
                        if (urlLink.length < 2) {
                            urlLink.push("");
                        }
                        if (urlLink[1] == "")
                            td.innerHTML = "<A HREF='" + urlLink[0] + ">" + td.innerHTML + "</A>";
                        else if (urlLink[1].substr(0, 1) == '_')
                            td.innerHTML = "<A HREF='" + urlLink[0] + " target='" + urlLink[1] + "'>" + td.innerHTML + "</A>";
                        else
                            td.innerHTML = "<A onclick='return " + urlLink[1] + "(\"" + urlLink[0] + "\")' HREF='#'>" + td.innerHTML + "</A>";
                    }
                    var nFont = cellctrl.GetCellFont(c, r, s);
                    var nFontSize = cellctrl.GetCellFontSize(c, r, s);
                    td.style["font-family"] = (nFont < 0) ? cellctrl.GetDefaultFontName() : cellctrl.GetFontName(nFont);
                    td.style["font-size"] = (((nFontSize <= 0) ? cellctrl.GetDefaultFontSize() : nFontSize) * 1.4) + "px";
                }
                if (c1 != c0 || cellctrl.GetColWidth(1, c, s) == 0) {
                    td.colSpan = c1 - c0 + 1 - CB_GetHiddenCols(c0, c1, arrHiddenCol);
                } else {
                    if (cellctrl.GetColWidth(1, c, s) <= 2)
                        td.style.display = "none";
                    else
                        td.style.width = cellctrl.GetColWidth(1, c, s) - 2;
                }
                if (r1 != r0 || cellctrl.GetRowHeight(1, r, s) == 0) {
                    td.rowSpan = r1 - r0 + 1;
                } else {
                    if (cellctrl.GetRowHeight(1, r, s) <= 2)
                        tr.style.display = "none";
                    else
                        tr.style.height = cellctrl.GetRowHeight(1, r, s) - 2;
                }
            }
            c = c1 + 1;
        }
    }
    return tbl.getHtml();
}