//YshEditPage.js -- lastest updated by gud 20130718
//function CreateEditPage(pageid, yshtableid, colOperate, colCount, filename, args, pCount) {
function CreateEditPage(pageid, yshtableid, colOperate, colCount, fullargs, itemsargs) {
    var t = g_yshFactory.GetYshById(yshtableid);
    var p = new EditPageObj(pageid, t.ctrl, colOperate, colCount, 1);
    p._yshCtrlRow = t.children[t.children.length - 1];
    p.titlerows = t.children.length; //   - 1;不应该减行，因为那行实际上存在
    p.arrDefault = [];
    p.GetFileName = function () { return fullargs[0]; }
    p.GetArgs = function () { return fullargs[1]; }
    p.deleteMsg = "你确定要删除此记录吗？";
    //p.pageCount = itemsargs[0];
    for (var c = 0; c < colOperate; c++) {
        var yshInTD = p._yshCtrlRow.children[c].children[0];
        if (yshInTD.ctrl.innerText == "[INDEX]")//update by linger 
            p.colIndex = c; //update end
        if (yshInTD.ctrl.innerText == "[SELECT]") {
            p.colSelect = c;
            Ysh.Web.Event.attachEvent(p.ctrl.rows[0].cells[c].children[0], "onclick", function () { Ysh.Web.Table.setCheckBoxState(Ysh.Web.getParent(event.srcElement, "TABLE"), p.titlerows, p.colSelect, event.srcElement.checked, 1, p.showPageNo ? 1 : 0); });
        }
        if (yshInTD.tag == "time") {
            yshInTD._html = yshInTD.parent.ctrl.innerHTML;
            p.arrDefault.push(""); //时间不要默认值
        } else {
            yshInTD._ctrl = yshInTD.ctrl; //备份控件
            p.arrDefault.push(yshInTD.GetValue());
        }
    }
    p.setCellStyle = function (c, cell) {
        var align = "center";
        if (c >= 0) {
            var ysh = this.GetYshByColumn(c, false);
            if (ysh) {
                align = ysh.styles["text-align"];
                if (typeof align == "undefined")
                    align = ysh.attrs["align"];
                if (typeof align == "undefined")
                    align = "center";
            }
        }
        cell.style.textAlign = align;
    }
    p.GetYshByColumn = function (c, bReset) {
        var ysh = this._yshCtrlRow.children[c].children[0];
        if (bReset && ysh) {
            if (ysh.tag == "time") {
            } else {
                ysh.ctrl = ysh._ctrl;
            }
        }
        return ysh;
    }
    p.getShowHTML = function (c, v, row) {
        var ysh = this.GetYshByColumn(c, false);
        if (ysh == null)
            return v;
        if ((ysh.tag == "time")||(ysh.tag == "ysh_ddlbox")) {
            if (row && $(row.cells[c]).children().length > 0)
                $(ysh.parent.ctrl).append($(row.cells[c]).children());
        }
        ysh.SetValue(v);
        var str = ysh.GetText();
        if (str === "")
            return "&nbsp;";
        return str.toString().replace(/\r\n/g, "<BR>");
    }
    p.cancelTime = function (row) {
        for (var c = 0; c < this.colCount; c++) {
            var ysh = this.GetYshByColumn(c, true);
            if (ysh == null || ((ysh.tag != "time")&&(ysh.tag != "ysh_ddlbox")))
                continue;
            if ($(row.cells[c]).children().length > 0)
                $(ysh.parent.ctrl).append($(row.cells[c]).children());
        }
    }
    p.getDefault = function (row, c) { if ((null != this.colIndex) && (this.colIndex == c)) { return (row.rowIndex - this.titlerows + 1) + this.curIndex * this.pageCount; }; if (null == this.arrDefault) return ""; return this.arrDefault[c]; }
    p.setEditState = function (row, c, bInit) {
        if ((this.colSelect != null) && (c == this.colSelect))
            return;
        var ysh = this.GetYshByColumn(c, true);
        //ysh.IsEditable = bInit ? true : this.GetEditable(c);
        //ysh.Display(row.cells[c]);
        if (ysh.tag == "time") {
            //ysh.parent.ctrl.innerHTML = "";
            //row.cells[c].innerHTML = ysh._html;
            $(row.cells[c]).empty().append($(ysh.parent.ctrl).children().not(":first")); //移动时间控件除<script>标签外的内容
            ysh.ctrl = row.cells[c].children[0]; //SetDateTimeCtrlReadOnly(ysh.ctrl, true, false);
        }
        if (ysh.tag == "ysh_ddlbox") {
            $(row.cells[c]).empty().append($(ysh.parent.ctrl).children());
            ysh.ctrl = row.cells[c].children[0]; 
        }
        if ((ysh.tag != "time")&&(ysh.tag != "ysh_ddlbox")) {
            //update by gaolan 20130403
            if (ysh.datasource.key != 1 || bInit) {
                row.cells[c].innerHTML = ysh.parent.ctrl.innerHTML;
                ysh.ctrl = row.cells[c].children[0];
                ysh.ReAttachEvents();
            }
            //update end
        }
        if (bInit) {
            ysh.SetValue(p.getDefault(row, c));
        } else {
            ysh.SetValue(row.cells[c]._v);
        }
        if (bInit)
            ysh.ctrl.disabled = false;
    }
    p.onAfterCreate = function (id, arrInsertData) {
    }
    p.exitEdit = function (row) {
    }
    p.getEditData = function (row, c) {
        if (c != colOperate)
            return this.GetYshByColumn(c, false).GetValue();
        return null;
    }
    p.isValid = function (row, c) {
        if (c == colOperate)
            return true;
        return this.GetYshByColumn(c, false).Check();
    }
    p.onCreate = function (id, arrData, row) {
        var o = this;
        var id = null;
        var idGoal = null;
        if (this.nModifyMode == 4) {
            var rowNext = row.nextSibling;
            if (rowNext) {
                idGoal = this.getIdFromRow(rowNext);
            }
        }
        if (idGoal) {
            id = ExecuteBack(function () { return ListEditPage.InsertTo(o.GetFileName(), o.GetArgs(), arrData, idGoal, true); });
        } else {
            id = ExecuteBack(function () { return ListEditPage.Insert(o.GetFileName(), o.GetArgs(), arrData); });
        }
        if (!id.check("创建")) return false;
        return id.value;
    }
    p.onUpdate = function (id, arrData) {
        var o = this;
        return ExecuteBack(function () { return ListEditPage.Update(o.GetFileName(), o.GetArgs(), id, arrData); }).check("保存");
    }
    p.getDeleteData = function (id, row) {
        //update by gaolan 20130403
        for (var c = 0; c < this.colCount; c++) {
            if (c != this.colOperate) {
                var ysh = this.GetYshByColumn(c, true);
                if (ysh.tag != "time")
                    ysh.SetValue(row.cells[c]._v);
            }
        }
        return this.getEditDataArray(row, true);
    }
    //update by gaolan 20130403
    p.onDelete = function (id, arrData) {
        if (!confirm(this.deleteMsg))
            return false;
        var o = this;
        return ExecuteBack(function () { return ListEditPage.Delete(o.GetFileName(), o.GetArgs(), id, arrData); }).check("删除");
    }
    //update end
    var fSetRowStyle = p.setRowStyle;
    p.setRowStyle = function (row) {
        fSetRowStyle(row);
        row.style.height = "25px";
    }
    p.onMove = function (id, row, bUp) {//不支持分页
        var o = this;
        return ExecuteBack(function () { return ListEditPage.Move(o.GetFileName(), o.GetArgs(), id, bUp); }).check("移动", true);
    }
    //Add by gud 20130705
    p.OnUpdateListEnd = function () {
        for (var i = 0; i < this.titlerows; i++) {
            var row = this.ctrl.rows[i];
            if (row.style.display != "none")
                row.style.backgroundColor = "#dae4ea";
        }
        this.ctrl.style.backgroundColor = "#a6c4d4";
        var lastRow = Ysh.Array.getLast(this.ctrl.rows);
        if (lastRow.cells.length == 1) {
            var html = Ysh.String.trim(lastRow.cells[0].innerHTML);
            if ((html.length == 0)||(html == "&nbsp;"))
                lastRow.style.display = "none";
        }
    }
    p.ClearCondition = function () {
        fullargs[1] = [];
    }
    p.AddCondition = function (id, value, oper) {
        var args = fullargs[1];
        for (var i = 0; i < args.length; i++) {
            var a = args[i];
            if (a.id == id) {
                a.value = value;
                a.oper = (!oper) ? 0 : oper;
                return;
            }
        }
        args.push({ "id": id, "value": value, "oper": oper });
    }
    p.pagenum = 1;
    p.GetListData = function (pageCount, pagenum) {
        var arrData = ExecuteBack(function () { return ListEditPage.GetList(fullargs, pageCount, pagenum); });
        if (!arrData.check())
            return false;
        return arrData.value;
    }
    p.Refresh = function (pagenum) {
        var o = this;
        var arrData = this.GetListData(o.pageCount, pagenum);
        if (!arrData)
            return;
        this.bEditing = false;
        this.pagenum = pagenum;
        for (var c = 0; c < this.colCount; c++) {
            this.GetYshByColumn(c, true);
        }
        this.UpdateList(this.titlerows, arrData[3], pagenum);
        this.addPageNoRow(arrData[1], arrData[2] - 1, pageid + ".Refresh", this.disabled ? undefined : pageid + ".addNewRow()");
        this.OnUpdateListEnd();
        if (this.disabled) {
            for (var r = 0; r < this.ctrl.rows.length; r++) {
                if (this.ctrl.rows[r].cells.length > 1)
                this.ctrl.rows[r].cells[this.colOperate].style.display = "none";
            }
        }
    }
    p.SortByCol = function (cc) {
        if (this.bEditing)
            return;
        var s = fullargs[2];
        if (!s) {
            fullargs[2] = [{ "c": cc, s: 0}];
        } else {
            s = s[0];
            if (s.c == cc) {
                s.s = 1 - s.s;
            } else {
                s.c = cc;
                s.s = 0;
            }
        };
        this.Refresh(1);
    }
    p.SortByCols = function (cs) {
        fullargs[2] = [{ "c": cs, s: 0}];
        this.Refresh(1);
    }
    //add end
    p.moveSelected = function (bUp) {
        if (this.colSelect == null)
            return;
        var rStart = this.titlerows;
        var rEnd = this.ctrl.rows.length - 1;
        if (this.showPageNo)
            rEnd--;
        var arrSelected = [];
        var arrSelectedRow = [];
        for (var r = rStart; r <= rEnd; r++) {
            var cb = this.ctrl.rows[r].cells[this.colSelect].children[0];
            if (cb.checked) {
                if (bUp) {
                    if (r == rStart) {
                        alert("选中第一行时不能继续往上移");
                        return;
                    }
                } else {
                    if (r == rEnd) {
                        alert("选中最后一行时不能继续往下移");
                        return;
                    }
                }
                arrSelected.push(cb.value);
                arrSelectedRow.push(r);
            }
        }
        if (arrSelected.length == 0) {
            alert("请先选择条目");
            return;
        }
        var o = this;
        if (!ExecuteBack(function () { return ListEditPage.BatchMove(o.GetFileName(), o.GetArgs(), arrSelected, bUp); }).check("移动", true))
            return;
        if (bUp) {
            for (var i = 0; i < arrSelectedRow.length; i++) {
                var r = arrSelectedRow[i];
                this.swapRow(this.ctrl.rows[r], this.ctrl.rows[r - 1]);
            }
        } else {
            for (var i = arrSelectedRow.length - 1; i >= 0; i--) {
                var r = arrSelectedRow[i];
                this.swapRow(this.ctrl.rows[r], this.ctrl.rows[r + 1]);
            }
        }
    }
    p.deleteSelected = function () {
        if (this.colSelect == null)
            return false;
        var rStart = this.titlerows;
        var rEnd = this.ctrl.rows.length - 1;
        if (this.showPageNo)
            rEnd--;
        var arrSelected = [];
        var arrSelectedRow = [];
        for (var r = rStart; r <= rEnd; r++) {
            var row = this.ctrl.rows[r];
            var cb = row.cells[this.colSelect].children[0];
            if (cb.checked) {
                arrSelected.push(cb.value);
                arrSelectedRow.push(r);
            }
        }
        if (arrSelected.length == 0) {
            alert("请先选择条目!");
            return false;
        }
        var o = this;
        if (!ExecuteBack(function () { return ListEditPage.BatchDelete(o.GetFileName(), o.GetArgs(), arrSelected); }).check("删除", true))
            return false;
        for (var i = arrSelected.length - 1; i >= 0; i--) {
            this.ctrl.deleteRow(arrSelectedRow[i]);
            this.onAfterDelete(arrSelected[i]);
        }
        if (this.colIndex != null) { //修改顺序列
            for (var r = this.titlerows + 1; r < this.ctrl.rows.length - this.bottomrows; r++) {
                this.ctrl.rows[r].cells[this.colIndex].innerHTML = this.getShowHTML(this.colIndex, r - this.titlerows);
            }
        }
        for (var i = 1; i < this.ctrl.rows.length; i++) {
            this.setRowStyle(this.ctrl.rows[i]);
        }
        return true;
    }
    return p;
}