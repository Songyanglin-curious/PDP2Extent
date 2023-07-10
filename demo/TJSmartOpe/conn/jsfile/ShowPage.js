// JScript File -- Edit by Gud
//The part of show page
function SP_PageIndexHTML(nPageIndex, nCurrPage, strShow, strJumpFunc) {
    if (nPageIndex == nCurrPage)
        return "<font color='#444444'>" + strShow + "</font>";
    return "<a href='#' onclick='" + strJumpFunc + "(" + (nPageIndex + 1) + ");return false;'>" + strShow + "</a>";
}
function SP_PageIndexsHTML(nCount, nCurr, nMaxIndexs, strJumpFunc) {
    if (nCount < 1)
        return "";
    var str = "";
    var iFirst = parseInt(nCurr / nMaxIndexs, 10) * nMaxIndexs;
    if (nCurr >= nMaxIndexs) { str += SP_PageIndexHTML(iFirst - 1, nCurr, "<<", strJumpFunc) + "&nbsp;&nbsp;"; }
    for (var i = iFirst; i < Math.min(iFirst + nMaxIndexs, nCount); i++) {
        str += SP_PageIndexHTML(i, nCurr, i + 1, strJumpFunc) + "&nbsp;&nbsp;";
    };
    if (iFirst + nMaxIndexs < nCount) { str += SP_PageIndexHTML(iFirst + nMaxIndexs, nCurr, ">>", strJumpFunc); };
    return str;
}
var ss = "";
function SP_SetRowStyle(row) {
    row.style.cursor = "hand";
    row.onmousemove = function () { if ((this._bkColor === null)||(typeof this._bkColor == "undefined")) this._bkColor = this.style.backgroundColor; this.style.backgroundColor = "#d7f5ff"; }
    row.onmouseout = function () {
        /*if (parseInt(row.firstChild.innerHTML) % 2 == 0) {
        row.style.backgroundColor = "#FFFFFF";
        ss = "#FFFFFF";
        }
        else if (parseInt(row.firstChild.innerHTML) % 2 == 1) {
        row.style.backgroundColor = "#F5F6F5";
        ss = "#F5F6F5";
        }
        else {
        if (ss == "#F5F6F5") {
        row.style.backgroundColor = "#FFFFFF";
        ss = "#FFFFFF";
        }
        else {
        row.style.backgroundColor = "#F5F6F5";
        ss = "#F5F6F5";
        }
        }*/
        // this.style.backgroundColor="#FFFFFF";
        //this.style.removeAttribute("backgroundColor");
        this.style.backgroundColor = this._bkColor;
        this._bkColor = null;
    }
}
function SP_SetNoRecordPrompt(tbl, columns) {
    var row = tbl.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.colSpan = columns;
    cell.style.textAlign = "center";
    cell.innerHTML = "<font color='red'>没有任何记录</font>";
    return row;
}
function SP_UpdateList(tbl, titlerows, columns, arrList) {
    var nRows = tbl.rows.length;
    for (var i = nRows - 1; i >= titlerows; i--) { tbl.deleteRow(i); }
    if (arrList.length == 0) {
        SP_SetNoRecordPrompt(tbl, columns);
        return;
    }
    for (var r = 0; r < arrList.length; r++) {
        var row = tbl.insertRow(-1);
        SP_SetRowStyle(row);
        for (var c = 0; c < columns; c++) { row.insertCell(-1).innerHTML = arrList[r][c]; }
    }
}
function SP_SelectOptionStr(nStart, nEnd, nSelected) {
    var strHTML = "";
    for (var i = nStart; i <= nEnd; i++) {
        strHTML += "<OPTION value='" + i + ((i == nSelected) ? "' SELECTED>" : "'>") + i + "</OPTION>";
    }
    return strHTML;
}
function SP_SetPageNoRow(tbl, columns, nCount, nCurr, strJumpFunc, strAddFunc) {
    var strHTML = "";
    if (nCount > 1) {
        strHTML += SP_PageIndexHTML(0, nCurr, "首页", strJumpFunc) + "&nbsp;" + SP_PageIndexHTML(Math.max(0, nCurr - 1), nCurr, "上一页", strJumpFunc) + "&nbsp;";
        strHTML += SP_PageIndexHTML(Math.min(nCurr + 1, nCount - 1), nCurr, "下一页", strJumpFunc) + "&nbsp;" + SP_PageIndexHTML(nCount - 1, nCurr, "尾页", strJumpFunc) + "&nbsp;";
        strHTML += "<font color='#000080'> 页次：</font><strong><font color=red>" + (nCurr + 1) + "</font>/<font color='#000080'>" + nCount + "</strong>页</font>&nbsp;";
        strHTML += "转到第<SELECT onchange='" + strJumpFunc + "(this.value)'>" + SP_SelectOptionStr(1, nCount, nCurr + 1) + "</SELECT>页";
    }
    if (typeof strAddFunc != "undefined")
        strHTML += "&nbsp;<a href='#' onclick='" + strAddFunc + ";return false;'>添加</a>";
    if (strHTML != "") {
        var cell = tbl.insertRow(-1).insertCell(-1);
        cell.colSpan = columns;
        cell.style.textAlign = "center";
        cell.style.backgroundColor = "white";
        cell.innerHTML = strHTML;
    }
}
function SP_GetPageNoHTML(nCount, nCurr, strJumpFunc) {
    if (nCount < 1) return "";
    var strHTML = "<table><tr><td style='vertical-align:middle'>";
    strHTML += SP_PageIndexHTML(0, nCurr, "<img style='border:0' src='../../i/begin_page.gif'>", strJumpFunc) + "</td><td  style='vertical-align:middle'>" + SP_PageIndexHTML(Math.max(0, nCurr - 1), nCurr, "<img style='border:0' src='../../i/last_page.gif'>", strJumpFunc) + "</td><td  style='vertical-align:middle'>";
    strHTML += SP_PageIndexHTML(Math.min(nCurr + 1, nCount - 1), nCurr, "<img style='border:0' src='../../i/next_page.gif'>", strJumpFunc) + "</td><td  style='vertical-align:middle'>" + SP_PageIndexHTML(nCount - 1, nCurr, "<img style='border:0'src='../../i/end_page.gif'>", strJumpFunc) + "</td><td  style='vertical-align:middle'>";
    strHTML += "<font color='#000080'> 页次：</font><strong><font color=red>" + (nCurr + 1) + "</font>/<font color='#000080'>" + nCount + "</strong>页</font>&nbsp;";
    strHTML += "转到第<SELECT onchange='" + strJumpFunc + "(this.value)'>" + SP_SelectOptionStr(1, nCount, nCurr + 1) + "</SELECT>页";
    strHTML += "</td></tr></table>"
    return strHTML;
}
function SP_GetPageNoHTML2(nCount, nCurr, strJumpFunc) {
    if (nCount < 1) return "";
    var strHTML = "<table><tr><td style='vertical-align:middle'>";
    strHTML += SP_PageIndexHTML(0, nCurr, "首页", strJumpFunc) + "&nbsp;" + SP_PageIndexHTML(Math.max(0, nCurr - 1), nCurr, "上一页", strJumpFunc) + "&nbsp;";
    strHTML += SP_PageIndexHTML(Math.min(nCurr + 1, nCount - 1), nCurr, "下一页", strJumpFunc) + "&nbsp;" + SP_PageIndexHTML(nCount - 1, nCurr, "尾页", strJumpFunc) + "&nbsp;";
    strHTML += "<font color='#000080'> 页次：</font><strong><font color=red>" + (nCurr + 1) + "</font>/<font color='#000080'>" + nCount + "</strong>页</font>&nbsp;";
    strHTML += "转到第<SELECT onchange='" + strJumpFunc + "(this.value)'>" + SP_SelectOptionStr(1, nCount, nCurr + 1) + "</SELECT>页";
    strHTML += "</td></tr></table>"
    return strHTML;
}
//function SP_GetButtonHTML(id,clickfunc,str) { return "<a href=\"#\" onclick=\""+clickfunc+"('"+id+"',this.parentElement.parentElement);return false;\">" + str + "</a>"; }

function SetTableSelectStyle(tbl,s) {
    for (var r = s; r < tbl.rows.length; r++) {
        var row = tbl.rows[r];
        row.style.backgroundColor = "#FFFFFF";
        row.style.cursor = "hand";
        row._selected = false;
        row.onmousemove = function () { if (this._selected) return; this.style.backgroundColor = "#d7f5ff"; }
        row.onmouseout = function () { if (this._selected) return; this.style.backgroundColor = "#FFFFFF"; }
        row._onclick = row.onclick;
        row.onclick = function () { if (this._onclick) this._onclick(); var p = this.parentElement; if (p._selectedRow) { p.rows[p._selectedRow].style.backgroundColor = "#FFFFFF"; p.rows[p._selectedRow]._selected = false; }; p._selectedRow = this.rowIndex; this.style.backgroundColor = "#CCCCCC"; this._selected = true; }
    }
}