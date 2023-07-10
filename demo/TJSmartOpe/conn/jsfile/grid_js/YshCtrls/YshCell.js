var YshCell = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "td";
        o.descr = "单元格";
        return o;
    }
    , ApplyYsh: function (o) {
        o.isDelDeny = true;
        o.isCopyDeny = true;
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var inner = this.GetChildrenHtml();
            if (inner == "")
                inner = "&nbsp;";
            return "<td" + this.GetAttributesHtml() + ">" + inner + "</td>";
        }
        YshObject.AttachContainer(o);
        if (typeof o.attrs["colspan"] == "undefined") o.attrs["colspan"] = 1;
        if (typeof o.attrs["rowspan"] == "undefined") o.attrs["rowspan"] = 1;
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");docDesign.Redraw();"));
            menulist.push(YSH_CreateContextMenu("insrowb", "前边插入行", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.AddRow(true);o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("insrowa", "后边插入行", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.AddRow(false);o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("inscolb", "前边插入列", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.AddCol(true);o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("inscola", "后边插入列", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.AddCol(false);o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("inscola", "删除行", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.DelThisRow();o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("inscola", "删除列", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.DelThisCol();o.doc.Redraw();"));
            if (g_yshFactory.clipboard.length > 0) {
                menulist.push(YSH_CreateContextMenu("paste", "粘贴", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");g_yshFactory.Paste(\"" + this.id + "\");o.doc.Redraw();"));
            }
        }
        o.AddRow = function (bBefore) {
            var rg = this.GetCellRange();
            var row = this.parent;
            var tbl = row.parent;
            var insindex = bBefore ? rg.r0 : rg.r1 + 1;
            //对表格的所有格子进行判断有没有穿过，穿过的就不用加了
            var arrIn = [];
            var nMaxCol = tbl.GetCols() - 1;
            for (var r = 0; r < tbl.children.length; r++) {
                var tr = tbl.children[r];
                for (var c = 0; c < tr.children.length; c++) {
                    var td = tr.children[c];
                    if (td.InsertRow(insindex) == 0)
                        arrIn.push(td);
                }
            }
            var insrow = this.doc.CreateObject("tr", tbl, insindex);
            //加入没穿过的列
            for (var c = 0; c <= nMaxCol; c++) {
                var bIn = false;
                for (var i = 0; i < arrIn.length; i++) {
                    var rgIn = arrIn[i].GetCellRange();
                    if ((rgIn.c0 <= c) && (rgIn.c1 >= c)) {
                        bIn = true;
                        break;
                    }
                }
                if (!bIn) {
                    var inscol = this.doc.CreateObject("td", insrow);
                    inscol.selfattr["col"] = c;
                    inscol.selfattr["row"] = insindex;
                }
            }
        }
        o.AddCol = function (bBefore) {
            var rg = this.GetCellRange();
            var row = this.parent;
            var tbl = row.parent
            var insindex = bBefore ? rg.c0 : rg.c1 + 1;
            var nMaxCol = tbl.GetCols() - 1;
            if (insindex == nMaxCol + 1) {//往最后一列加
                for (var r = 0; r < tbl.children.length; r++) {
                    var tr = tbl.children[r];
                    var inscol = this.doc.CreateObject("td", tr);
                    inscol.selfattr["col"] = insindex;
                    inscol.selfattr["row"] = r;
                }
            } else {
                for (var r = 0; r < tbl.children.length; r++) {
                    var tr = tbl.children[r];
                    //看有没有穿过这行的某个格子，如果没有就插入一个
                    var bIn = false;
                    var colsOfTr = tr.children.length;
                    for (var c = colsOfTr - 1; c >= 0; c--) {
                        var td = tr.children[c];
                        var rgTd = td.GetCellRange();
                        if ((rgTd.c0 == insindex) || ((c == 0) && (rgTd.c0 > insindex) || ((c == colsOfTr - 1) && (rgTd.c1 < insindex)))) {//在这之前插入
                            var inscol = this.doc.CreateObject("td", tr, (rgTd.c1 < insindex) ? c + 1 : c);
                            inscol.selfattr["col"] = insindex;
                            inscol.selfattr["row"] = r;
                        }
                        td.InsertCol(insindex);
                    }
                }
            }
        }
        o.InsertRow = function (r) { //插行，如果在这中间，就返回true，否则false
            var rg = this.GetCellRange();
            if (rg.r1 < r)//在上边，不影响
                return -1;
            if (rg.r0 < r) {//穿过，合并行+1
                this.attrs["rowspan"] = this.GetRowSpan() + 1;
                return 0;
            } //在下边，往下移动
            this.selfattr["row"] = toInt(this.selfattr["row"], 0) + 1;
            return 1;
        }
        o.InsertCol = function (c) {
            var rg = this.GetCellRange();
            if (rg.c1 < c)//在左边，不影响
                return -1;
            if (rg.c0 < c) {//穿过，合并行+1
                this.attrs["colspan"] = this.GetColSpan() + 1;
                return 0;
            } //在右边，往下移动
            this.selfattr["col"] = toInt(this.selfattr["col"], 0) + 1;
            return 1;
        }
        o.DelThisRow = function () {
            var rg = this.GetCellRange();
            this.parent.parent.DeleteRows(rg.r0, rg.r1 - rg.r0 + 1);
        }
        o.DelThisCol = function () {
            var rg = this.GetCellRange();
            this.parent.parent.DeleteCols(rg.c0, rg.c1 - rg.c0 + 1);
        }
        o.DeleteRow = function (r) {
            var rg = this.GetCellRange();
            if ((rg.r1 == r) && (rg.r0 == r)) {
                return true; //把自己删了
            }
            if (rg.r1 >= r) {//否则在上边，无需改动
                if ((rg.r1 == r) || (rg.r0 <= r)) {//删除的行在范围里边，少合并一行了
                    this.attrs["rowspan"] = this.GetRowSpan() - 1;
                } else {
                    //在下边，把行上移
                    this.selfattr["row"] = toInt(this.selfattr["row"], 0) - 1;
                }
            }
            return false;
        }
        o.DeleteCol = function (c) {
            var rg = this.GetCellRange();
            if ((rg.c1 == c) && (rg.c0 == c)) {
                return true; //把自己删了
            }
            if (rg.c1 >= c) {//否则在上边，无需改动
                if ((rg.c1 == c) || (rg.c0 <= c)) {//删除的行在范围里边，少合并一行了
                    this.attrs["colspan"] = this.GetColSpan() - 1;
                } else {
                    //在右边，把列前移
                    this.selfattr["col"] = toInt(this.selfattr["col"], 0) - 1;
                }
            }
            return false;
        }
        o.GetColSpan = function () {
            //return Math.max(toInt(this.ctrl.colSpan, 1), 1);
            return Math.max(toInt(this.attrs["colspan"], 1), 1);
        }
        o.GetRowSpan = function () {
            //return Math.max(toInt(this.ctrl.rowSpan, 1), 1);
            return Math.max(toInt(this.attrs["rowspan"], 1), 1);
        }
        o.ChangeSpan = function (cm0, cm1, rm0, rm1) {
            if ((cm0 == cm1) && (rm0 == rm1))
                return true;
            var rg = this.GetCellRange();
            var tr = this.parent;
            var tbl = tr.parent;
            if (cm0 < cm1) {
                if (rg.c0 + cm1 > tbl.GetCols()) {
                    alert("表列不足，请重新设置合并的列数");
                    return false;
                }
                if (!confirm("合并列数增加，此操作会合并后边列的内容！\r\n是否确认设置？"))
                    return false;
            }
            if (rm0 < rm1) {
                if (rg.r0 + rm1 > tbl.GetRows()) {
                    alert("表行不足，请重新设置合并的行数");
                    return false;
                }
                if (!confirm("合并行数增加，此操作会合并后边列的内容！\r\n是否确认设置？"))
                    return false;
            }
            var vtbl = new YshVirtualTable();
            vtbl.ReadFromYsh(tbl);
            vtbl.MergeCells(rg.c0, rg.r0, cm1, rm1);
            vtbl.ResetYsh(tbl);
            return true;
        }
        o.Set_Old = o.Set;
        o.Set = function (name, keys, values) {
            if (name == "attrs") {
                var nIndexColSpan = keys.indexOf("colspan");
                var nIndexRowSpan = keys.indexOf("rowspan");
                var nColSpan_old = this.GetColSpan();
                var nRowSpan_old = this.GetRowSpan();
                var nColSpan_new = nColSpan_old;
                var nRowSpan_new = nRowSpan_old;
                if (nIndexColSpan >= 0)
                    nColSpan_new = values[nIndexColSpan];
                if (nIndexRowSpan >= 0)
                    nRowSpan_new = values[nIndexRowSpan];
                if ((nRowSpan_new != nRowSpan_old) || (nColSpan_new != nColSpan_old)) {
                    if (!this.ChangeSpan(nColSpan_old, nRowSpan_old, nColSpan_new, nRowSpan_new)) {
                        if (nIndexColSpan >= 0)
                            values[nIndexColSpan] = nColSpan_old;
                        if (nIndexRowSpan >= 0)
                            values[nIndexRowSpan] = nRowSpan_old;
                    }
                }
            }
            this.Set_Old(name, keys, values);
        }
        o.SetAttr = function (k, v) {
            if (this.attrs[k] == v)
                return;
            if ((typeof this.attrs[k] == "undefined") && (v === ""))
                return;
            if (k == "colspan") {
                v = toInt(v, 1);
                if (!this.ChangeSpan(this.GetColSpan(), v, this.GetRowSpan(), this.GetRowSpan()))
                    return;
            }
            else if (k == "rowspan") {
                v = toInt(v, 1);
                if (!this.ChangeSpan(this.GetColSpan(), this.GetColSpan(), this.GetRowSpan(), v))
                    return;
            }
            this.attrs[k] = v;
        }
        o.GetCellRange = function () {
            var c0 = toInt(this.selfattr["col"], 0);
            var r0 = toInt(this.selfattr["row"], 0);
            var c1 = c0 + this.GetColSpan() - 1;
            var r1 = r0 + this.GetRowSpan() - 1;
            return { "c0": c0, "c1": c1, "r0": r0, "r1": r1 };
        }
    }
}