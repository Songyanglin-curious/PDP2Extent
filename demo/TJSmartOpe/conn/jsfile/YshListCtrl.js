function CreateListCtrl(pageid, yshtableid, colOperate, colCount, fullargs, itemsargs) {
    var t = g_yshFactory.GetYshById(yshtableid);
    var p = new EditPageObj(pageid, t.ctrl, colOperate, colCount, 1);
    p._yshCtrlRow = t.children[t.children.length - 1];
    p.titlerows = t.children.length; //   - 1;不应该减行，因为那行实际上存在
    p.arrDefault = [];
    p.GetFileName = function () { return fullargs[0]; }
    p.GetArgs = function () { return fullargs[1]; }
    p.Data = "";
    p.DataSource = "";
    //p.pageCount = itemsargs[0];
    for (var c = 0; c < colOperate; c++) {
        var childrens = p._yshCtrlRow.children[c].children;
        for (var i = 0; i < childrens.length; i++) {
            var yshInTD = childrens[i];
            if (yshInTD.ctrl.innerText == "[INDEX]")//update by linger 
                p.colIndex = c; //update end
            if (yshInTD.tag == "time") {
                //yshInTD._html = yshInTD.parent.ctrl.innerHTML;
                yshInTD._html = yshInTD.parent.ctrl.children[i].outerHTML + yshInTD.parent.ctrl.children[i + 1].outerHTML + yshInTD.parent.ctrl.children[i + 2].outerHTML;
                p.arrDefault.push(""); //时间不要默认值
            } else {
                yshInTD._ctrl = yshInTD.ctrl; //备份控件
                p.arrDefault.push(yshInTD.GetValue());
            }
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
    p.GetYshsByColumn = function (c, bReset) {
        var ctrls = this._yshCtrlRow.children[c].children;
        var yshs = new Array();
        for (i = 0; i < ctrls.length; i++) {
            if (bReset && ctrls[i]) {
                if (ctrls[i].tag == "time") {
                } else {
                    ctrls[i].ctrl = ctrls[i]._ctrl;
                }
            }
            yshs.push(ctrls[i]);
        }
        return yshs;
    }
    p.GetChildrenLength = function (c) {
        try {
            return this._yshCtrlRow.children[c].children.length;
        } catch (e) {
            return null;
        }
    }
    p.getShowHTML = function (c, v) {
        var ysh = this.GetYshByColumn(c, true);
        if (ysh == null)
            return v;
        ysh.SetValue(v);
        var str = ysh.GetText();
        if (str === "")
            return "&nbsp;";
        return str.toString().replace(/\r\n/g, "<BR>");
    }
    p.getShowHTMLNew = function (c, v, i) {
        var yshs = this.GetYshsByColumn(c, true);
        var result = "";
        for (j = 0; j < yshs.length; j++) {
            if (yshs[j] == null)
                return v[i + j];
            yshs[j].SetValue(v[i + j]);
            var str = yshs[j].GetText();
            if (str === "")
                result += "&nbsp;";
            else
                result += str.toString().replace(/\r\n/g, "<BR>");
        }
        return result;
    }
    p.getEditDataArray = function (row) {
        var arrEditData = [];
        for (var c = 0; c < this.colCount; c++) {
            if (!this.isValid(row, c))
                return null;
            var arrValue = this.getEditData(row, c);
            if (arrValue != null)
                for (var i = 0; i < arrValue.length; i++) {
                    arrEditData.push(arrValue[i]);
                }
        }
        return arrEditData;
    }
    p.setShowStateNew = function (row, c, v, i) { row.cells[c].innerHTML = this.getShowHTMLNew(c, v, i); }
    p.setRowShowData = function (row, arrData) {
        var iTemp = 0;
        for (var c = 0; c < this.colCount; c++) {
            if (this.colIndex != null && c == this.colIndex) {
                var idx = (row.rowIndex - this.titlerows + 1) + this.curIndex * this.pageCount;
                row.cells[c]._v = idx;
                this.setShowState(row, c, idx);
                continue;
            }
            else
                if (c != this.colOperate) {
                    var length = this.GetChildrenLength(c);
                    row.cells[c]._v = "";
                    for (var i = 0; i < length; i++) {
                        row.cells[c]._v += arrData[iTemp + i] + "||||";
                    }
                    row.cells[c]._v = row.cells[c]._v.substring(0, row.cells[c]._v.length - 4)
                    this.setShowStateNew(row, c, arrData, iTemp);
                    iTemp += length;
                }
        }
    }
    p.setRowEditData = function (row, bInit) {
        for (var c = 0; c < this.colCount; c++) {
            if (c != this.colOperate) {
                var length = this.GetChildrenLength(c);
                if (length == 1)
                    this.setEditState(row, c, 0, bInit);
                else {
                    for (var i = 0; i < length; i++)
                        this.setEditState(row, c, i, bInit);
                }
            }
        };
        this.onEdit(row);
    }
    p.doModify = function (id, row) {
        if (this.bEditing) return;
        this.bEditing = true;
        if (null == this.arrBackupData)
            this.arrBackupData = new Array(this.colCount);
        for (var c = 0; c < this.colCount; c++) { this.arrBackupData[c] = row.cells[c].innerHTML; }
        row.cells[this.colOperate].innerHTML = this.getModifyHTML(id);
        this.setRowEditData(row, false);
    }
    p.doCreate = function (id, row) {//如果有索引列，那么保存之后得把索引列去掉，不然显示就不对了
        var arrInsertData = this.getEditDataArray(row);
        if (arrInsertData == null) return;
        this.onBeforeCreate(id, arrInsertData);
        var nId = this.onCreate(id, arrInsertData);
        if (nId == false) return;
        this.onAfterCreate(nId, arrInsertData);
        arrInsertData.push(id);
        this.removeIndexData(arrInsertData); //Modify by gud 20121018:如果有索引列，那么保存之后得把索引列去掉，不然显示就不对了
        this.setRowShowData(row, arrInsertData);
        row.cells[this.colOperate].innerHTML = this.getOperateHTML(nId, row);
        this.bEditing = false;
        this.exitEdit(row);
    }
    p.doUpdate = function (id, row) {
        var arrUpdateData = this.getEditDataArray(row);
        if (arrUpdateData == null) return;
        this.onBeforeUpdate(id, arrUpdateData);
        if (!this.onUpdate(id, arrUpdateData)) return;
        this.onAfterUpdate(id, arrUpdateData);
        arrUpdateData.push(id);
        this.removeIndexData(arrUpdateData); //Modify by gud 20121018:如果有索引列，那么保存之后得把索引列去掉，不然显示就不对了
        this.setRowShowData(row, arrUpdateData);
        row.cells[this.colOperate].innerHTML = this.getOperateHTML(id, row);
        this.bEditing = false;
        this.exitEdit(row);
    }
    p.getDefault = function (row, c) { if ((null != this.colIndex) && (this.colIndex == c)) { return (row.rowIndex - this.titlerows + 1) + this.curIndex * this.pageCount; }; if (null == this.arrDefault) return ""; return this.arrDefault[c]; }
    p.setEditState = function (row, c, i, bInit) {
        var yshs = this.GetYshsByColumn(c, true);
        var length = yshs.length - 1;
        if (i == length)//如果该控件是单元格内的最后一个控件
        {
            for (var j = 0; j <= length; j++) {
                if (j == 0)
                    row.cells[c].innerHTML = "";
                var ysh = yshs[j];
                if (ysh.tag == "time") {
                    row.cells[c].innerHTML += ysh._html;
                    ysh.ctrl = row.cells[c].children[j];
                }
                if (bInit) {
                    ysh.SetValue(p.getDefault(row, c));
                } else {
                    if (row.cells[c]._v.toString().indexOf("||||") == -1)
                        ysh.SetValue(row.cells[c]._v);
                    else {
                        var values = row.cells[c]._v.toString().split("||||");
                        ysh.SetValue(values[j]);
                    }
                }
                if (ysh.tag != "time")
                    if (ysh.datasource.key != 1 || bInit)
                        row.cells[c].innerHTML += ysh.parent.ctrl.children[j].outerHTML;
            }

            for (var j = 0; j <= length; j++) {
                var ysh = yshs[j];
                if (ysh.datasource.key != 1 || bInit) {
                    if (ysh.tag != "time") {
                        ysh.ctrl = row.cells[c].children[j];
                        ysh.ReAttachEvents();
                    }
                }
                if (bInit)
                    ysh.ctrl.disabled = false;
            }
        }
    }
    p.exitEdit = function (row) {
    }
    p.addRow = function (arrData) {
        var row = this.ctrl.insertRow(-1);
        for (var c = 0; c < this.colCount; c++) {
            var cell = row.insertCell(-1);
            this.setCellStyle(c, cell);
            if (this.ctrl.rows[0].cells[c].style.display == "none")//update by linger 20121009 增加对隐藏列的处理
                cell.style.display = "none";
            if (!this.bPriv && c == this.colOperate)
                cell.style.display = "none"; //update end
        };

        var aa = this.colOperate - ((this.colIndex != null) ? 1 : 0);
        var id = arrData[arrData.length - 1];
        this.setRowShowData(row, arrData);
        row.cells[this.colOperate].innerHTML = (id == "") ? "&nbsp;" : this.getOperateHTML(id, row);
        this.setClickEvent(id, row);
        this.setRowStyle(row);
    }
    p.getEditData = function (row, c) {
        if (c != colOperate) {
            var yshs = this.GetYshsByColumn(c, false);
            var arrValue = new Array();
            for (var i = 0; i < yshs.length; i++) {
                arrValue.push(yshs[i].GetValue());
            }
            return arrValue;
        }
        return null;
    }
    p.isValid = function (row, c) {
        if (c == colOperate)
            return true;
        return this.GetYshByColumn(c, false).Check();
    }
    p.onCreate = function (id, arrData) {
        var o = this;
        var id = ExecuteBack(function () { return ListCtrl.Insert(o.GetFileName(), o.GetArgs(), arrData); });
        if (!id.check("创建")) return false;
        return id.value;
    }
    p.onUpdate = function (id, arrData) {
        var o = this;
        return ExecuteBack(function () { return ListCtrl.Update(o.GetFileName(), o.GetArgs(), id, arrData); }).check("保存");
    }
    p.getDeleteData = function (id, row) {
        //update by gaolan 20130403
        for (var c = 0; c < this.colCount; c++) {
            if (c != this.colOperate) {
                var ysh = this.GetYshByColumn(c, true);
                ysh.SetValue(row.cells[c]._v);
            }
        }
        return this.getEditDataArray(row);
    }
    //update by gaolan 20130403
    p.onDelete = function (id, arrData) {
        if (!confirm("你确定要删除此记录吗？"))
            return false;
        var o = this;
        return ExecuteBack(function () { return ListCtrl.Delete(o.GetFileName(), o.GetArgs(), id, arrData); }).check("删除");
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
    }
    p.AddCondition = function (id, value) {
        var args = fullargs[1];
        for (var i = 0; i < args.length; i++) {
            var a = args[i];
            if (a.id == id) {
                a.value = value;
                return;
            }
        }
        args.push({ "id": id, "value": value });
    }
    p.Refresh = function (pagenum) {
        var o = this;
        var arrData = ExecuteBack(function () { return ListEditPage.GetListCtrl(fullargs, p.DataSource, p.Data, o.pageCount, pagenum); });
        if (!arrData.check())
            return;
        arrData = arrData.value;
        this.UpdateList(this.titlerows, arrData[3], pagenum);
        this.addPageNoRow(arrData[1], arrData[2] - 1, pageid + ".Refresh", pageid + ".addNewRow()");
        this.OnUpdateListEnd();
    }
    p.SortByCol = function (cc) {
        var s = fullargs[2];
        if (!s) {
            fullargs[2] = [{ "c": cc, s: 0 }];
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
    //add end
    return p;
}