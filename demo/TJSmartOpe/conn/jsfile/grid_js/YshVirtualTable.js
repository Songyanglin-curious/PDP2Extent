
if (!Array.prototype.doEach) {
    Array.prototype.doEach = function (d, s, e) { if (typeof s == "undefined") s = 0; if (typeof e == "undefined") e = this.length - 1; if (s > e) return; for (var i = s; i <= e; i++) { d(this[i], i); } }
};

if (!Array.prototype.eachReverse) {
    Array.prototype.eachReverse = function (d, s, e) { if (typeof s == "undefined") s = 0; if (typeof e == "undefined") e = this.length - 1; if (s > e) return; for (var i = e; i >= s; i--) { d(this[i], i); } }
};

function YshVirtualCell() {
    this.state = "merge";
    this.obj = null;
    this.objMain = null;
    this.IsUsing = function () { return this.state == "use"; }
    this.IsDel = function() { return this.state == "del";}
}
function YshVirtualRow() {
    this.obj = null;
    this.cells = [];
    this.IsUsing = function () { return this.cells.find(function (cell) { return cell.IsUsing(); }) >= 0; }
}
function YshVirtualTable() {
    this.rows = [];
    this.ResetYsh = function (tbl) {
        //先对应td
        var vtbl = this;
        for (var r = 0; r < this.rows.length; r++) {
            var row = this.rows[r];
            if (row.obj == null) {
                if (!row.IsUsing())
                    continue;
                //新建一行
                var nPrevUsingRowIndex = this.rows.findLast(function (vr) { return vr.obj != null; }, 0, r - 1);
                var trPrev = (nPrevUsingRowIndex < 0) ? null : this.rows[nPrevUsingRowIndex].obj; //上一行对应的实体行
                var nIndex = (null == trPrev) ? -1 : tbl.children.indexOf(trPrev);
                row.obj = tbl.doc.CreateObject("tr", tbl, nIndex);
            }
            row.cells.doEach(function (cell, c) {
                if (cell.state == "use") {//重新设置colspan和rowspan，以及合并后边格子的子元素
                    if (cell.obj != null) {
                        if (cell.obj != cell.objMain) {
                            alert("表格设计错误"); //不应该出现，出现表明设置错误
                        }
                        var nFirstNoMergeRow = vtbl.rows.find(function (row0) { return row0.cells[c].objMain != cell.obj; }, r + 1);
                        var nFirstNoMergeCell = row.cells.find(function (cell0) { return cell0.objMain != cell.obj; }, c + 1);
                        if (nFirstNoMergeRow < 0) nFirstNoMergeRow = vtbl.rows.length;
                        if (nFirstNoMergeCell < 0) nFirstNoMergeCell = row.cells.length;
                        var rowspan = 0;
                        for (var rr = r; rr < nFirstNoMergeRow; rr++) {
                            var colspan = 0;
                            var bDel = false;
                            for (var cc = c; cc < nFirstNoMergeCell; cc++) {
                                if ((rr != r) || (cc != c)) {
                                    var cell1 = vtbl.rows[rr].cells[cc];
                                    if (cell1.IsDel()) {
                                        bDel = true; //要删除就是整行全删除
                                        continue;
                                    } else {
                                        if (null != cell1.obj) {
                                            cell.obj.children.insert(cell.obj.children.length, cell1.obj.children);
                                            cell1.obj.children = [];
                                        }
                                    }
                                }
                                colspan++;
                            }
                            cell.obj.attrs["colspan"] = Math.max(1, colspan);
                            if (!bDel)
                                rowspan++;
                        }
                        cell.obj.attrs["rowspan"] = Math.max(1, rowspan);
                    } else {
                        //新建一个格子
                        var nPrevUsingCellIndex = row.cells.findLast(function (vc) { return vc.obj != null; }, 0, c - 1);
                        var tdPrev = (nPrevUsingCellIndex < 0) ? null : row.cells[nPrevUsingCellIndex].obj;
                        var nIndex = (null == tdPrev) ? 0 : row.obj.children.indexOf(tdPrev) + 1;
                        cell.obj = tbl.doc.CreateObject("td", row.obj, nIndex);
                        cell.obj.selfattr["col"] = c;
                        cell.obj.selfattr["row"] = r;
                        cell.objMain = cell.obj;
                    }
                }
            });
        }
        //删除state=="delete"的
        this.rows.eachReverse(function (row) {
            var bRowShow = false;
            row.cells.eachReverse(function (cell) {
                if (cell.state == "use") {
                    bRowShow = true;
                    return;
                }
                if (null != cell.obj) {
                    g_yshFactory.DeleteObject(cell.obj); //不显示了就删掉
                    cell.obj = null;
                }
                if (cell.state == "delete") {
                    row.cells.erase(cell);
                }
            });
            if (!row.IsUsing()) {//整行都被删除或者被隐藏了
                if (null != row.obj) {
                    g_yshFactory.DeleteObject(row.obj);
                    row.obj = null;
                }
            }
            if (row.cells.length == 0)
                this.rows.erase(row);
        });
    }
    this.ReadFromYsh = function (tbl) {
        var vtbl = this;
        this.rows = [];
        var nRowCount = tbl.GetRows();
        var nColCount = tbl.GetCols();
        for (var r = 0; r < nRowCount; r++) {
            var vr = new YshVirtualRow();
            for (var c = 0; c < nColCount; c++) {
                var vc = new YshVirtualCell();
                vr.cells.push(vc);
            }
            this.rows.push(vr);
        }
        tbl.children.doEach(function (tr) {
            tr.children.doEach(function (td) {
                var cr = td.GetCellRange();
                var row = vtbl.rows[cr.r0];
                row.obj = tr;
                var cell = row.cells[cr.c0];
                cell.state = "use";
                cell.children = td.children;
                cell.obj = td;
                for (var rr = cr.r0; rr <= cr.r1; rr++) {
                    for (var cc = cr.c0; (cc <= cr.c1)&&(cc < nColCount); cc++) {
                        vtbl.rows[rr].cells[cc].objMain = td;
                    }
                }
            });
        });
    }
    this.MergeCells = function (c, r, cm, rm) {
        var nRowCount = this.rows.length;
        if (r + rm - 1 > nRowCount) {
            alert("行数超出");
            return false;
        }
        var objMain = this.rows[r].cells[c].obj;
        var nColCount = this.rows[0].cells.length;
        //看看合并中的objMain有哪些，并将合并列的状态设置成merge
        var arrObjInMerge = [];
        for (var rr = r; rr < nRowCount; rr++) {
            for (var cc = c; cc < nColCount; cc++) {
                var cell = this.rows[rr].cells[cc];
                if ((rr < r + rm) && (cc < c + cm)) {
                    if (cell.objMain != null)
                        arrObjInMerge.addSkipSame(cell.objMain);
                    if ((rr != r) || (cc != c)) {
                        if (!cell.IsDel()) {
                            cell.state = "merge";
                            cell.objMain = objMain;
                        }
                    }
                } else {
                    if (arrObjInMerge.indexOf(cell.objMain) < 0)
                        break;
                    if (!cell.IsDel()) {
                        cell.state = "use";
                        cell.objMain = null;
                    }
                }
            }
        }
    }
}