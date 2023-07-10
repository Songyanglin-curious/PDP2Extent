//FullEditPage.js -- lastest updated by gud 20150127

function FullEditPageObj(name, tbl, colO, colC) {
    if (!FullEditPageObj.objs)
        FullEditPageObj.objs = [];
    FullEditPageObj.objs.push(this);
    this.objname = name;
    this.srcName = name;
    this.ctrl = tbl;
    this.colOperate = colO;
    this.colCount = colC;
    this.posIndex = null;
    this.posSelect = null;
    this.curIndex = 0;
    this.pageCount = 0;
    this.bPriv = true;
    this.arrBackupData = null;
    this.bottomrows = 0;
    this.titlerows = 1; //标题行数
    this.nModifyMode = 2;
    this.showPageNo = false;
    this.deleteMsg = "你确定要删除此记录吗？";
    this.data = [];
    this.yshTable = null;
    this.yshCtrlRows = [];
    this.arrYshIndex = [];
    this.pagenum = 1;
    this.rowsPerGroup = 1;
    this.operateAlginCol = -1;
    this.nCount = 0;
    this.bCreated = false;
    this.privs = {
        canEdit: function (id) {
            if (typeof this[id] == "undefined") return true; return this[id]; 
        } 
    };
    this.isIndexCell = function (r, c) {
        return (this.posIndex != null) && (c == this.posIndex.c) && (r == this.posIndex.r);
    }
    this.isSelectCell = function (r, c) {
        return (this.posSelect != null) && (c == this.posSelect.c) && (r == this.posSelect.r);
    }
    this.isOperateCell = function (r, c) {
        return (c == this.colOperate) && (r == 0);
    }
    this.editInfo = {
        obj: null, row: null,
        save: function () {
            if (!this.isEditing())
                return true;
            if (this.obj.getDataFromRow(this.row) == null)
                return this.obj.doCreate(this.row);
            return this.obj.doUpdate(this.row);
        }, cancel: function () {
            if (!this.isEditing())
                return true;
            if (this.obj.getDataFromRow(this.row) == null)
                return this.obj.doCancelCreate(this.row);
            return this.obj.doCancel(this.row);
        },
        isEditing: function () {
            return (this.obj != null) && (this.row != null);
        },
        isEdit: function (row) {
            if (!this.isEditing())
                return false;
            return this.obj.getGroupRows(this.row).contains(row);
        }
    };
    this.setEditRow = function (row) {
        if (row == null) {
            if (this.editInfo.obj == this)
                this.editInfo.row = null;
        } else {
            this.editInfo.obj = this;
            this.editInfo.row = row;
        }
    }
    this.getGroupIndex = function (rowIndex) {
        return parseInt((rowIndex - this.titlerows) / this.rowsPerGroup, 10);
    }
    this.getGroupRows = function (row) {
        var groupIndex = this.getGroupIndex(row.rowIndex);
        var indexStart = this.titlerows + groupIndex * this.rowsPerGroup;
        var rows = [];
        for (var i = 0; i < this.rowsPerGroup; i++) {
            rows.push(this.ctrl.rows[indexStart + i]);
        }
        return rows;
    }
    this.getSingleHTML = function (func, name, title) {
        if (!title)
            title = "";
        return "<a href='#' title='" + title + "' onclick='" + this.objname + "." + func + "(this.parentElement.parentElement);return false;'>" + name + "</a>";
    } //
    this.getOperateHTMLBase = function (op1func, op1name, op2func, op2name) {
        return this.getSingleHTML(op1func, op1name) + "&nbsp;&nbsp;" + this.getSingleHTML(op2func, op2name);
    } //
    this.getOperateHTMLByMode = function (nMode, row) {
        switch (nMode.toString()) {
            case "0":
                return "&nbsp;";
            //case "1":
            //    return this.getSingleHTML("doModify", "修改");
            //case "2":
            //    return this.getSingleHTML("doDelete", "删除");
            //case "4":
            //    return this.getOperateHTMLBase("doMoveUp", "上移", "doMoveDown", "下移") + "&nbsp;&nbsp;" + this.getOperateHTMLBase("doModify", "修改", "doDelete", "删除");
            default:
                return this.getSingleHTML("doDelete", "删除");
            //    return this.getOperateHTMLBase("doModify", "修改", "doDelete", "删除");
        }
    } //
    this.getOperateHTML = function (row) {
        if (row.cells[0].style.display == "none") {
            return this.getOperateHTMLByMode(row.cells[0].innerText, row);
        }
        return this.getOperateHTMLByMode(this.nModifyMode, row);
    } //
    this.getModifyHTML = function () { return this.getSingleHTML("doCancel", "取消"); }  //return this.getOperateHTMLBase("doUpdate", "更新", "doCancel", "取消"); } //
    this.getCreateHTML = function () { return this.getSingleHTML("doCancelCreate", "取消"); } //return this.getOperateHTMLBase("doCreate", "保存", "doCancelCreate", "取消"); } //
    this.onCreate = function (arrData, row) {
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
            id = ExecuteBack(function () { return FullEditPage.InsertTo(o.GetFileName(), o.GetArgs(), arrData, idGoal, true); });
        } else {
            id = ExecuteBack(function () { return FullEditPage.Insert(o.GetFileName(), o.GetArgs(), arrData); });
        }
        if (!id.check("创建",true)) return false;
        return id.value;
    } //
    this.onUpdate = function (id, arrOldData, arrData, row) {
        var o = this;
        return ExecuteBack(function () { return FullEditPage.Update(o.GetFileName(), o.GetArgs(), id, arrData, arrOldData); }).check("保存", true);
        return true;
    }     //
    this.getDeleteMsg = function (id, arrData, row) {
        return this.deleteMsg;
    }
    this.onDelete = function (id, arrData, row) {
        if (!confirm(this.getDeleteMsg(id, arrData, row)))
            return false;
        var o = this;
        return ExecuteBack(function () { return FullEditPage.Delete(o.GetFileName(), o.GetArgs(), id, arrData); }).check("删除");
    } //
    this.onMove = function (id, row, bUp) {//不支持分页
        var o = this;
        return ExecuteBack(function () { return FullEditPage.Move(o.GetFileName(), o.GetArgs(), id, bUp); }).check("移动", true);
    } //
    this.onBeforeUpdate = function (id, arrUpdateData, arrOldData, row) { }   //
    this.onAfterUpdate = function (id, arrUpdateData, arrOldData, row) { } //
    this.onBeforeCreate = function (arrInsertData, row) { }  //
    this.onAfterCreate = function (id, arrInsertData, row) { } //
    this.onBeforeDelete = function (id, row) { return true; }  //
    this.onAfterDelete = function (id) { } //
    this.exitEdit = function (row) {
    }  //
    this.setRowEvent = function (rows) {
        var o = this;
        for (var r = 0; r < rows.length; r++) {
            var row = rows[r];
            row.onclick = function () {
                event.cancelBubble = true;
                if (o.editInfo.isEdit(this))
                    return;
                if (o.editInfo.isEditing()) {
                    if (!o.editInfo.save())
                        return;
                }
                var el = event.srcElement ? event.srcElement : this;
                if ((el.tagName.toUpperCase() != "IMG") && (el.tagName.toUpperCase() != "A") && (!((el.tagName.toUpperCase() == "INPUT") && (el.type == "checkbox" || el.type == "button")))) {
                    FullEditPageObj.hideOperatePanel(false);
                    o.doModify(this);
            }
            }
            Ysh.Web.Event.attachEvent(row, "onmouseover", function () {
                if (o.editInfo.isEditing())
                    return;
                var arrOperate = o.getHoverOperates(row);
                if (arrOperate.length == 0)
                    return;
                //显示操作悬浮窗口
                var top = 0, left = 0, height = 0;
                for (var i = 0; i < rows.length; i++) {
                    var rect = rows[i].cells[o.operateAlginCol + 1].getBoundingClientRect();
                    if (i == 0)
                        top = rect.top;
                    height += (rect.bottom - rect.top);
                    left = rect.left;
                }
                top += (document.body.scrollTop | document.documentElement.scrollTop);
                o.divDlg.innerHTML = "";
                for (var i = 0; i < arrOperate.length; i++) {
                    if (i > 0) {
                        Ysh.Web.createElement(o.divDlg, "SPAN").innerHTML = "&nbsp;&nbsp;";
                    }
                    var a = Ysh.Web.createElement(o.divDlg, "A");
                    a.href = "#";
                    a.innerHTML = arrOperate[i].text;
                    a.onclick = arrOperate[i].event;
                }
                height = Math.max(2, height - 6) + "px";
                $(o.divDlg).css({ "left": Math.max(0, left + 2) + "px", "height": height, lineHeight: height, top: (top + 2) + "px" });
                $(o.divDlg).show();
                FullEditPageObj.hideOperatePanel(true);
            });
            Ysh.Web.Event.attachEvent(row, "onmouseout", function () { FullEditPageObj.hideOperatePanel(false); });
        }
    }
    this.getHoverOperates = function (row) {
        var ops = [];
        var o = this;
        switch (this.nModifyMode.toString()) {
            case "4":
                ops.push({ text: "上移", event: function () { event.cancelBubble = true; o.doMoveUp(row); FullEditPageObj.hideOperatePanel(false); } });
                ops.push({ text: "下移", event: function () { event.cancelBubble = true; o.doMoveDown(row); FullEditPageObj.hideOperatePanel(false); } });
                break;
            default:
                break;
        }
        return ops;
    }
    this.divDlg = null;
    this.setRowStyle = function (row) {
        row.style.backgroundColor = "#FFFFFF";
        row.cells[0].className = "tdEditCell";
        row.style.height = "30px";
    }                      //
    this.highlightRows = [];
    this.setHighlight = function (rows) {
        this.highlightRows = rows;
        for (var r = 0; r < rows.length; r++) {
            var row = rows[r];
            if (!row._bkColor)
                row._bkColor = row.style.backgroundColor;
            row.style.backgroundColor = "#d7f5ff";
        }
    }
    this.removeHighlight = function () {
        for (var i = 0; i < this.highlightRows.length; i++) {
            var row = this.highlightRows[i];
            row.style.backgroundColor = row._bkColor;
            row._bkColor = null;
        }
    }
    this.setRowStyles = function (rows) {
        var o = this;
        for (var r = 0; r < rows.length; r++) {
            var row = rows[r];
            row.style.backgroundColor = (this.getGroupIndex(row.rowIndex) % 2 == 0) ? "#F5F6F5" : "#FFFFFF";
            row.style.cursor = "hand";
            row.style.height = "30px";
            row.onmousemove = function () {
                o.setHighlight(rows);
            }
            row.onmouseout = function () {
                o.removeHighlight();
            }
        }
    }
    this.onBeforeCancel = function (row) {
    } //
    this.getDataYshIndex = function (ysh) {
        for (var r = 0; r < this.arrYshIndex.length; r++) {
            var arrRowIndex = this.arrYshIndex[r];
            for (var c = 0; c < arrRowIndex.length; c++) {
                var arrColIndex = arrRowIndex[c];
                for (var i = 0; i < arrColIndex.length; i++) {
                    if (arrColIndex[i].ysh == ysh)
                        return arrColIndex[i].idxData;
                }
            }
        }
        return -1;
    }
    this.doEachYshIndex = function (f) {
        for (var r = 0; r < this.arrYshIndex.length; r++) {
            var arrRowIndex = this.arrYshIndex[r];
            for (var c = 0; c < arrRowIndex.length; c++) {
                var arrColIndex = arrRowIndex[c];
                for (var i = 0; i < arrColIndex.length; i++) {
                    if (f(arrColIndex[i], r, c, i) === false)
                        return false;
                }
            }
        }
        return true;
    }
    this.isValid = function (row, c) { return true; }
    this.getEditDataArray = function (row, noCheck) {
        var arrEditData = [];
        var o = this;
        if (!this.doEachYshIndex(function (info) {
            var ysh = info.ysh;
            if (!o.privs.canEdit(ysh.doc.GetDesignID(ysh.parent.id))) {
                arrEditData.push(Ysh.Const.NOSAVE);
                return true;
            }
            if (!noCheck) {
                if (!ysh.Check())
                    return false;
                if (!o.isValid(row, ysh))
                    return false;
            }
            arrEditData.push(ysh.GetValue());
            return true;
        }))
            return null;
        arrEditData.push(this.getIdFromRow(row)); //id
        return arrEditData;
    }                  //
    this.canModify = function (row) {
        if (!this.bPriv)
            return false;
        if (row.cells[0].style.display == "none")
            return row.cells[0].innerText != "0";
        return true;
    }
    this.doModify = function (row) {
        if (this.editInfo.isEditing()) return;
        if (!this.canModify(row)) return;
        this.setEditRow(row);
        var rows = this.getGroupRows(row);
        rows[0].cells[this.colOperate].innerHTML = this.getModifyHTML(this.getIdFromRow(row));
        this.setRowEditState(rows, false);
    }    //
    this.doDelete = function (row) {
        if (this.editInfo.row != null)
            return;
        var id = this.getIdFromRow(row);
        if (!this.onBeforeDelete(id, row)) return;
        var arrDeleteData = this.getDataFromRow(row);
        if (!this.onDelete(id, arrDeleteData, row))
            return;
        this.data.erase(arrDeleteData);
        var rowIndex = this.deleteGroup(row);
        if (this.posIndex != null) { //修改顺序列
            for (var r = rowIndex; r < this.ctrl.rows.length - this.bottomrows; r+= this.rowsPerGroup) {
                this.updateRowIndex(this.ctrl.rows[r]);
            }
        }
        for (var i = rowIndex; i < this.ctrl.rows.length - this.bottomrows; i += this.rowsPerGroup) {
            this.setRowStyles(this.getGroupRows(this.ctrl.rows[i]));
        }
        this.onAfterDelete(id);
    }        //
    this.isChanged = function (row, c, oldValue, newValue) {
        if (newValue == Ysh.Const.NOSAVE)
            return false;
        if (oldValue instanceof Array)
            return oldValue[0] != newValue;
        return oldValue != newValue;
    }
    this.dealNoSave = function (oldData, newData) {
        for (var i = 0; i < newData.length; i++) {
            if (newData[i] == Ysh.Const.NOSAVE)
                newData[i] = (oldData.length > i) ? oldData[i] : "";
        }
    }
    this.doUpdate = function (row) {
        var id = this.getIdFromRow(row);
        var arrUpdateData = this.getEditDataArray(row);
        if (arrUpdateData == null) return false;
        //如果数据没变，那么直接取消
        var bChanged = false;
        var arrOldData = this.getDataFromRow(row);
        for (var i = 0; i < arrUpdateData.length; i++) {
            if (this.isChanged(row, i, arrOldData[i], arrUpdateData[i])) {
                bChanged = true;
                break;
            }
        }
        if (!bChanged) {
            this.doCancel(row);
            return true;
        }
        if (false === this.onBeforeUpdate(id, arrUpdateData, arrOldData, row)) return false;
        if (!this.onUpdate(id, arrOldData, arrUpdateData, row)) return false;
        this.dealNoSave(arrOldData, arrUpdateData);
        this.data[this.getIndexFromRow(row)] = arrUpdateData;
        this.onAfterUpdate(id, arrUpdateData, arrOldData, row);
        this.restoreYshControl(row);
        this.setRowShowData(this.getGroupRows(row), arrUpdateData);
        this.setEditRow(null);
        this.exitEdit(row);
        return true;
    }                 //
    this.doCancel = function (row) {
        this.onBeforeCancel(row); //还原时间控件等
        this.restoreYshControl(row);
        this.setRowShowData(this.getGroupRows(row), this.getDataFromRow(row));
        this.exitEdit(row);
        this.setEditRow(null);
    }   //
    this.doCreate = function (row) {
        var arrInsertData = this.getEditDataArray(row);
        if (arrInsertData == null) return false;
        if (false === this.onBeforeCreate(arrInsertData, row)) return false;
        var nId = this.onCreate(arrInsertData, row);
        if (nId == false) return false;
        arrInsertData[this.getIdIndex(arrInsertData)] = nId;
        //this.data.insert(this.getIndexFromRow(row), [arrInsertData]);
        this.dealNoSave([], arrInsertData);
        this.data[this.getIndexFromRow(row)] = arrInsertData;
        this.onAfterCreate(nId, arrInsertData, row);
        this.restoreYshControl(row);
        this.setRowShowData(this.getGroupRows(row), arrInsertData);
        this.setEditRow(null);
        this.exitEdit(row);
        return true;
    }    //
    this.deleteGroup = function (row) {
        var rows = this.getGroupRows(row);
        var rowIndex = -1;
        for (var r = rows.length - 1; r >= 0; r--) {
            rowIndex = rows[r].rowIndex;
            this.ctrl.deleteRow(rowIndex);
        }
        return rowIndex;
    }
    this.doCancelCreate = function (row) {
        this.onBeforeCancel(row); //还原时间控件等
        this.restoreYshControl(row);
        this.data.splice(this.getGroupIndex(row.rowIndex), 1);
        this.deleteGroup(row);
        this.setEditRow(null);
        this.exitEdit(null);
    }      //
    this.updateRowIndex = function (row) {
        var groupIndex = parseInt((row.rowIndex - this.titlerows) / this.rowsPerGroup, 10);
        var idx = (groupIndex + 1) + this.curIndex * this.pageCount;
        row.cells[this.posIndex.c].innerHTML = idx;
    }
    this.swapRows = function (rows0, rows1) {//修改行里边对应的内容
        this.data.swap(this.getIndexFromRow(rows0[0]), this.getIndexFromRow(rows1[0]));
        for (var i = 0; i < rows0.length; i++) {
            rows0[i].swapNode(rows1[i]); //IE独有
        }
        if (this.posIndex != null) {
            this.updateRowIndex(rows0[0]);
            this.updateRowIndex(rows1[0]);
        }
    }     //
    this.doMove = function (row, bUp) {//不支持分页
        var id = this.getIdFromRow(row);
        var rows0 = this.getGroupRows(row);
        var rows1 = this.getGroupRows(row);
        if (bUp) {
            if (rows0[0].rowIndex <= this.titlerows) //最上边一行了
                return;
            rows0 = this.getGroupRows(this.ctrl.rows[rows1[0].rowIndex - 1]);
        } else {
            if (rows0[rows0.length - 1].rowIndex >= this.ctrl.rows.length - this.bottomrows - 1) //最后一行
                return;
            rows1 = this.getGroupRows(this.ctrl.rows[rows0[rows0.length - 1].rowIndex + 1]);
        }
        if (!this.onMove(id, row, bUp))
            return;
        this.swapRows(rows0, rows1);
    }     //
    this.doMoveUp = function (row) { this.doMove(row, true); }
    this.doMoveDown = function (row) { this.doMove(row, false); }
    this.getShowHTML = function (ysh, v, row) {
        /*if ((ysh.tag == "time") || (ysh.tag == "ysh_ddlbox")) {
        if (row && $(row.cells[c]).children().length > 0)
        $(ysh.parent.ctrl).append($(row.cells[c]).children());
        }*/
        var str = "";
        if (v instanceof Array) {
            ysh.SetValue(v[0]);
            str = v[1];
        } else {
            ysh.SetValue(v);
            str = ysh.GetText();
        }
        if (str === "")
            return "&nbsp;";
        return str.toString().replace(/\r\n/g, "<BR>");
    }
    this.getDataSplitStr = function (r, c) {
        return "/";
    }
    this.combineCellShowHtml = function (r, c, split, htmlAll, html) {
        return htmlAll + split + html;
    }
    this.getCellShowHtml = function (rows, arrData, r, c) {
        var html = "";
        for (var i = 0; i < this.arrYshIndex[r][c].length; i++) {
            var yshInfo = this.arrYshIndex[r][c][i];
            var html0 = this.getShowHTML(yshInfo.ysh, arrData[yshInfo.idxData], rows[r]);
            if (i > 0)
                html = this.combineCellShowHtml(r, c, this.getDataSplitStr(r, c), html, html0);
            else
                html = html0;
        }
        return html;
    }
    this.setRowShowData = function (rows, arrData) {
        for (var r = 0; r < rows.length; r++) {
            for (var c = 0; c < this.arrYshIndex[r].length; c++) {
                if (this.isIndexCell(r, c)) {
                    this.updateRowIndex(rows[r]);
                    continue;
                }
                if (this.isSelectCell(r, c)) {
                    rows[r].cells[c].innerHTML = "<input type='checkbox' value='" + this.getIdFromData(arrData) + "' />";
                    continue;
                }
                if (this.isOperateCell(r, c)) {
                    var id = this.getIdFromData(arrData);
                    rows[r].cells[c].innerHTML = (id == "") ? "&nbsp;" : this.getOperateHTML(rows[r]);
                    continue;
                }
                rows[r].cells[c].innerHTML = this.getCellShowHtml(rows, arrData, r, c);
            }
        }
    }
    this.getRealRow = function (row, r) {
        var rows = this.getGroupRows(row);
        return rows[r];
    }
    this.resetYshControl = function (row) {
        for (var r = 0; r < this.rowsPerGroup; r++) {
            for (var i = 0; i < this.yshCtrlRows[r].children.length; i++) {
                if (this.isIndexCell(r, i) || this.isSelectCell(r, i) || this.isOperateCell(r, i))
                    continue;
                var ysh = this.yshCtrlRows[r].children[i];
                var b = this.privs.canEdit(ysh.doc.GetDesignID(ysh.id));
                if (!b) {
                    continue;
                }
                var $tdTemplate = $(ysh.ctrl);
                var $td = $(this.getRealRow(row, r).cells[i]);
                $td.empty();
                //var children = $tdTemplate.children().not("script");
                //children.appendTo($td);
                $td.append($tdTemplate.children().not("script"));
            }
        }
        var attachJs = "Attachdoc" + this.srcName.left(this.srcName.length - ("EditObj").length) + "Controls()";
        eval(attachJs);
    }
    this.clearCellExtraCtrl = function (td) {
    }
    this.restoreYshControl = function (row) {
        for (var r = 0; r < this.rowsPerGroup; r++) {
            for (var i = 0; i < this.yshCtrlRows[r].children.length; i++) {
                if (this.isIndexCell(r, i) || this.isSelectCell(r, i) || this.isOperateCell(r, i))
                    continue;
                var ysh = this.yshCtrlRows[r].children[i];
                var b = this.privs.canEdit(ysh.doc.GetDesignID(ysh.id));
                if (!b) {
                    continue;
                }
                var $tdTemplate = $(ysh.ctrl);
                var td = this.getRealRow(row, r).cells[i];
                this.clearCellExtraCtrl(td);
                var $td = $(td);
                $tdTemplate.empty();
                $tdTemplate.append($td.children());
            }
        }
        var attachJs = "Attachdoc" + this.srcName.left(this.srcName.length - ("EditObj").length) + "Controls()";
        eval(attachJs);
    }
    this.setEditState = function (row, c, bInit, rowIndexRelate) {
        if (this.isIndexCell(rowIndexRelate, c))
            return;
        if (this.isSelectCell(rowIndexRelate, c))
            return;
        if (bInit) {
            this.doEachYshIndex(function (info, r, c, i) {
                var ysh = info.ysh;
                ysh.SetValue(ysh._defValue);
            });
        } else {
            var arrData = this.getDataFromRow(row);

            this.doEachYshIndex(function (info, r, c, i) {
                var ysh = info.ysh;
                var v = arrData[info.idxData];
                if (v instanceof Array) {
                    v = v[0];
                }
                ysh.SetValue(v);
            });
        }
    }
    this.setEditValue = function (ysh, v) {
        if (ysh.tag == "select") {
            ysh.UpdateOption();
        }
    }
    this.setRowEditState = function (rows, bInit) {
        this.resetYshControl(rows[0]);
        //        for (var r = 0; r < rows.length; r++) {
        //            for (var c = 0; c < rows[r].cells.length; c++) {
        //                if (!this.isOperateCell(r, c))
        //                    this.setEditState(rows[r], c, bInit, r);
        //            }
        //        }
        var o = this;
        if (bInit) {
            this.doEachYshIndex(function (info, r, c, i) {
                var ysh = info.ysh;
                o.setEditValue(ysh, ysh._defValue);
                ysh.SetValue(ysh._defValue);
            });
        } else {
            var arrData = this.getDataFromRow(rows[0]);
            this.doEachYshIndex(function (info, r, c, i) {
                var ysh = info.ysh;
                var v = arrData[info.idxData];
                if (v instanceof Array)
                    v = v[0];
                o.setEditValue(ysh, v);
                ysh.SetValue(v);
            });
        }
    }               //
    this.getIdIndex = function (arrData) {
        return arrData.length - 1;
    }
    this.getIdFromData = function (arrData) {
        //return Ysh.Array.getLast(arrData);
        return arrData[this.getIdIndex(arrData)];
    } //
    this.getIdFromRow = function (row) {
        var data = this.getDataFromRow(row);
        if (data == null)
            return null;
        return this.getIdFromData(data);
    }  //
    this.getDataFromRow = function (row) {
        var idx = this.getIndexFromRow(row);
        if (idx >= this.data.length)
            return null;
        return this.data[idx];
    } //
    this.getIndexFromRow = function (row) {
        return parseInt((row.rowIndex - this.titlerows) / this.rowsPerGroup, 10);
    }  //
    this.setCellStyle = function (cell, r, c) {
    }
    this.createRowColumns = function (rows) {
        for (var r = 0; r < this.yshCtrlRows.length; r++) {
            var rowReal = rows[r];
            for (var c = 0; c < this.yshCtrlRows[r].children.length; c++) {
                var ysh = this.yshCtrlRows[r].children[c];
                var cell = rowReal.insertCell(-1);
                cell.className = "tdEditCell";
                var align = ysh.styles["text-align"];
                if (typeof align == "undefined")
                    align = ysh.attrs["align"];
                if (typeof align == "undefined")
                    align = "center";
                cell.style.textAlign = align;
                cell.colSpan = ysh.attrs.colspan;
                cell.rowSpan = ysh.attrs.rowspan;
                if (ysh.styles.display == "none")
                    cell.style.display = "none";
                this.setCellStyle(cell, r, c);
            }
        }
    }          //
    this.addRow = function (arrData) {
        var rows = [];
        for (var r = 0; r < this.rowsPerGroup; r++) {
            rows.push(this.ctrl.insertRow(-1));
        }
        this.createRowColumns(rows);
        this.setRowShowData(rows, arrData);
        this.setRowStyles(rows);
        this.setRowEvent(rows);
    }      //
    this.addNewRow = function (rowIndex) {        
        if (this.editInfo.isEditing()) return;
        if (event) event.cancelBubble = true;
        if (typeof rowIndex == "undefined")
            rowIndex = this.ctrl.rows.length - this.bottomrows;
        for (var i = 0; i < this.ctrl.rows.length; i++) {
            if (this.ctrl.rows[i].innerText == "没有任何记录") {
                this.ctrl.deleteRow(i);
                if (i < rowIndex)
                    rowIndex--;
            }
        }
        var rows = [];
        for (var r = 0; r < this.rowsPerGroup; r++) {
            rows.push(this.ctrl.insertRow(rowIndex));
        }
        this.data.insert(this.getGroupIndex(rowIndex), [null]);
        rows.sort(function (row0, row1) { return row0.rowIndex - row1.rowIndex; });
        this.setEditRow(rows[0]);
        this.createRowColumns(rows);
        this.setRowStyles(rows);
        rows[0].cells[this.colOperate].innerHTML = this.getCreateHTML();
        this.setRowEditState(rows, true);
        this.setRowEvent(rows);
//        var div = Ysh.Web.getParent(rows[0], "DIV");
//        if (div) {
//            while (div) {
//                var of = div.style.overflowY;
//                if ((of == "auto") || (of == "yes"))
//                    break;
//                div = Ysh.Web.getParent(div, "DIV");
//            }
//        }
//        if (div)
//            div.scrollTop = div.scrollHeight;
//这块有问题，如果滚动框不是只包含这一个listedit，那么不该滚的时候也会滚走
    }             //
    this.getPageNoHtml = function () {
        var strHTML = "";
        var nCurr = this.curIndex;
        if (this.nCount > 1) {
            var strJumpFunc = this.objname + ".Refresh";
            strHTML += SP_PageIndexHTML(0, nCurr, "首页", strJumpFunc) + "&nbsp;" + SP_PageIndexHTML(Math.max(0, nCurr - 1), nCurr, "上一页", strJumpFunc) + "&nbsp;";
            strHTML += SP_PageIndexHTML(Math.min(nCurr + 1, this.nCount - 1), nCurr, "下一页", strJumpFunc) + "&nbsp;" + SP_PageIndexHTML(this.nCount - 1, nCurr, "尾页", strJumpFunc) + "&nbsp;";
            strHTML += "<font color='#000080'> 页次：</font><strong><font color=red>" + (nCurr + 1) + "</font>/<font color='#000080'>" + this.nCount + "</strong>页</font>&nbsp;";
            strHTML += "转到第<SELECT onchange='" + this.objname + ".Refresh(this.value)'>" + SP_SelectOptionStr(1, this.nCount, nCurr + 1) + "</SELECT>页";
        }
        return strHTML;
        }
    this.UpdateList = function (titlerows, arrList, nIndex) {
        this.data = arrList;
        this.setEditRow(null);
        if (nIndex)
            this.curIndex = nIndex - 1;
        var nRows = this.ctrl.rows.length;
        for (var i = nRows - 1; i >= titlerows; i--) { this.ctrl.deleteRow(i); }
        if (arrList.length == 0) {
            if (arrList === "")
                this.data = [];//防止arrList==""
            this.setRowStyle(SP_SetNoRecordPrompt(this.ctrl, this.colCount));
            return;
        }
        for (var r = 0; r < arrList.length; r++) { this.addRow(arrList[r]); }
    }    //
    this.ChangeState = function (bFlag) {
        bPriv = bFlag;
        for (var i = 0; i < this.ctrl.rows.length - 1; i++) {
            if (this.ctrl.rows[i].cells.length > this.colOperate)
                this.ctrl.rows[i].cells[this.colOperate].style.display = bFlag ? "" : "none";
            if (this.posSelect != null)
                this.ctrl.rows[i].cells[this.posSelect.c].style.display = bFlag ? "" : "none";
        }
        if (this.showPageNo)
            this.ctrl.rows[this.ctrl.rows.length - 1].cells[0].style.display = bFlag ? "" : "none";
    } //
    this.getSelected = function () {
        if (this.posSelect == null)
            return [];
        var rStart = this.titlerows;
        var rEnd = this.ctrl.rows.length - 1;
        if (this.showPageNo)
            rEnd--;
        var arrSelected = [];
        for (var r = rStart; r <= rEnd; r += this.rowsPerGroup) {
            var cell = this.ctrl.rows[r + this.posSelect.r].cells[this.posSelect.c];
            if (!cell)
                continue;
            var cb = cell.children[0];
            if (cb.checked)
                arrSelected.push(cb.value);
        }
        return arrSelected;
    }  //
    this.showTable = function (parentElement) {
        //新建一个表格
        var tNew = this.yshTable.ctrl;
        var temp = document.createElement('div');
        var newHtml = tNew._outerHTML;
        if (!newHtml) {
            newHtml = tNew.outerHTML.replace(new RegExp("id=(.*?)([ >])", "g"), "$2");
            tNew._outerHTML = newHtml;
        }
        temp.innerHTML = newHtml;

        var tbl = Ysh.Web.createElement(parentElement, "TABLE");
        parentElement.replaceChild(temp.children[0], tbl);

        tNew = Ysh.Array.getLast(parentElement.children);
        tNew.style.display = "";
        this.ctrl = tNew;
        //把控件行对应的内容清空
        for (var r = 0; r < this.rowsPerGroup; r++) {
            for (var c = 0; c < this.yshCtrlRows[r].children.length; c++) {
                var row = this.ctrl.rows[this.titlerows - this.rowsPerGroup + r];
                row.cells[c].innerHTML = "";
            }
        }

        if (!FullEditPageObj.divDlg) {
            var divDlg = document.createElement("DIV");
            with (divDlg.style) { position = "absolute"; zIndex = 1; backgroundColor = "#FFFFFF"; display = "none"; border = "solid 1px red"; paddingLeft = "10px"; paddingRight = "10px"; }
            document.body.appendChild(divDlg);
            divDlg.onmouseover = function () { event.cancelBubble = true; $(this).show(); FullEditPageObj.hideOperatePanel(true); }
            divDlg.onmouseout = function () { FullEditPageObj.hideOperatePanel(false); }
            FullEditPageObj.divDlg = divDlg;
        }
        this.divDlg = FullEditPageObj.divDlg;
    }
    this.clone = function (objid, parentElement) {
        var o = {};
        for (var a in this) {
            o[a] = this[a];
            if (this[a] instanceof Array) {
                o[a] = [];
                for (var i = 0; i < this[a].length; i++)
                    o[a].push(this[a][i]);
            }
        };
        o.objname = objid;
        o.showTable(parentElement);
        FullEditPageObj.objs.push(o);
        return o;
    }
    this.GetFileName = function () { return this.filename; }
    this.GetArgs = function () { return this.args; }
    this.OnUpdateListEnd = function () {
        for (var i = 0; i < this.titlerows; i++) {
            var row = this.ctrl.rows[i];
            if (row.style.display != "none")
                row.style.backgroundColor = "#dae4ea";
        }
        this.ctrl.style.backgroundColor = "#dae4ea";
        var lastRow = Ysh.Array.getLast(this.ctrl.rows);
        if (lastRow.cells.length == 1) {
            var html = Ysh.String.trim(lastRow.cells[0].innerHTML);
            if ((html.length == 0) || (html == "&nbsp;"))
                lastRow.style.display = "none";
        }
    }
    this.AddCondition = function (id, value, oper) {
        var args = this.args;
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
    this.GetListData = function (pageCount, pagenum) {
        var args = [this.filename, this.args, this.sortArgs];
        var arrData = ExecuteBack(function () { return FullEditPage.GetList(args, pageCount, pagenum); });
        if (!arrData.check())
            return false;
        return arrData.value;
    }
    this.Refresh = function (pagenum) {
        if (!this.editInfo.save())
            return;
        var arrData = this.GetListData(this.pageCount, pagenum);
        if (!arrData)
            return;
        this.initial();
        this.pagenum = pagenum;
        this.nCount = arrData[1];
        this.UpdateList(this.titlerows, arrData[3], pagenum);
        this.OnUpdateListEnd();
    }
    this.SortByCol = function (cc) {
        if (this.editInfo.row != null)
            return;
        var s = this.sortArgs;
        if ((!s) || (s.length == 0)) {
            this.sortArgs = [{ "c": cc, s: 0}];
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
    this.SortByCols = function (cs) {
        this.sortArgs = [{ "c": cs, s: 0}];
        this.Refresh(1);
    }
    //add end
    this.moveSelected = function (bUp) {
        if (this.posSelect == null)
            return;
        var rStart = this.titlerows;
        var rEnd = this.ctrl.rows.length - 1;
        if (this.showPageNo)
            rEnd--;
        var arrSelected = [];
        var arrSelectedRow = [];
        for (var r = rStart; r <= rEnd; r += this.rowsPerGroup) {
            var cb = this.ctrl.rows[r + this.posSelect.r].cells[this.posSelect.c].children[0];
            if (cb.checked) {
                if (bUp) {
                    if (r == rStart) {
                        alert("选中第一行时不能继续往上移");
                        return;
                    }
                } else {
                    if (r + this.rowsPerGroup > rEnd) {
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
        if (!ExecuteBack(function () { return FullEditPage.BatchMove(o.GetFileName(), o.GetArgs(), arrSelected, bUp); }).check("移动", true))
            return;
        if (bUp) {
            for (var i = 0; i < arrSelectedRow.length; i++) {
                var r = arrSelectedRow[i];
                this.swapRows(this.getGroupRows(this.ctrl.rows[r]), this.getGroupRows(this.ctrl.rows[r - this.rowsPerGroup]));
            }
        } else {
            for (var i = arrSelectedRow.length - 1; i >= 0; i--) {
                var r = arrSelectedRow[i];
                this.swapRows(this.getGroupRows(this.ctrl.rows[r]), this.getGroupRows(this.ctrl.rows[r + this.rowsPerGroup]));
            }
        }
    }
    this.deleteSelected = function () {
        if (this.posSelect == null)
            return false;
        var rStart = this.titlerows;
        var rEnd = this.ctrl.rows.length - this.bottomrows - 1;
        if (this.showPageNo)
            rEnd--;
        var arrSelected = [];
        var arrSelectedRow = [];
        for (var r = rStart; r <= rEnd; r += this.rowsPerGroup) {
            var cb = this.ctrl.rows[r + this.posSelect.r].cells[this.posSelect.c].children[0];
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
        if (!ExecuteBack(function () { return FullEditPage.BatchDelete(o.GetFileName(), o.GetArgs(), arrSelected); }).check("删除", true))
            return false;
        for (var i = arrSelected.length - 1; i >= 0; i--) {
            this.deleteGroup(arrSelectedRow[i]);
            var id = arrSelected[i];
            this.data.splice(this.data.search(function (rowData) { return o.getIdFromData(rowData) == id; }), 1);
            this.onAfterDelete(id);
        }
        if (this.posIndex != null) { //修改顺序列
            for (var r = this.titlerows; r < this.ctrl.rows.length - this.bottomrows; r += this.rowsPerGroup) {
                this.updateRowIndex(this.ctrl.rows[r]);
                this.setRowStyles(this.getGroupRows(this.ctrl.rows[r]));
            }
        }
        return true;
    }
    this.setArgs = function (args) {
        this.args = args;
    }
    this.initial = function () {
        if (this.bCreated)
            return;
        this.bCreated = true;
        function initYsh(ep, t) {
            ep.yshTable = t;
            ep.yshCtrlRows = [];
            for (var i = ep.rowsPerGroup; i > 0; i--) {
                ep.yshCtrlRows.push(t.children[t.children.length - i]);
            }
            ep.titlerows = t.children.length;
            //保存需要数据的控件
            var arrYshIndex = [];
            var idx = 0;
            for (var r = 0; r < ep.rowsPerGroup; r++) {
                var arrRowIndex = [];
                for (var i = 0; i < ep.yshCtrlRows[r].children.length; i++) {
                    var td = ep.yshCtrlRows[r].children[i];
                    var arrColIndex = [];
                    for (var j = 0; j < td.children.length; j++) {
                        var o = td.children[j];
                        if ((o.datasource) && (o.datasource.col != "")) {
                            arrColIndex.push({ "idxData": idx, "idxCol": j, "ysh": o });
                            idx++;
                        }
                    }
                    arrRowIndex.push(arrColIndex);
                }
                arrYshIndex.push(arrRowIndex);
            }
            ep.arrYshIndex = arrYshIndex;

            Ysh.Web.Event.attachEvent(document.body, "onclick", function () {
                ep.editInfo.save();
            });
            Ysh.Web.Event.attachEvent(document.body, "onkeyup", function () {
                if (event.keyCode == Ysh.Key.Escape) {
                    ep.editInfo.cancel();
                }
            });
        }
        var p = this;
        var t = p.t;
        var rowsPerGroup = p.rowsPerGroup;
        initYsh(p, t);
        for (var r = 0; r < rowsPerGroup; r++) {
            var yshTR = t.children[t.children.length - rowsPerGroup + r];
            for (var c = 0; c < yshTR.children.length; c++) {
                var yshTD = yshTR.children[c];
                yshTD._html = yshTD.ctrl.innerHTML;
                for (var i = 0; i < yshTD.children.length; i++) {
                    var yshInTD = yshTD.children[i];
                    if (yshInTD.ctrl.innerText == "[INDEX]") {
                        p.posIndex = { "r": r, "c": c };
                    }
                    if (yshInTD.ctrl.innerText == "[SELECT]") {
                        p.posSelect = { "r": r, "c": c };
                        Ysh.Web.Event.attachEvent(p.ctrl.rows[0].cells[c].children[0], "onclick", function () { Ysh.Web.Table.setCheckBoxState(Ysh.Web.getParent(event.srcElement, "TABLE"), p.titlerows, p.colSelect, event.srcElement.checked, 1, p.showPageNo ? 1 : 0); });
                    }
                    yshInTD._defValue = yshInTD.GetValue();
                }
            }
        }
        p.showTable(p.yshTable.ctrl.parentElement);
    }
}

FullEditPageObj.getObjByCtrl = function (ctrl) {
    if (!this.objs)
        return null;
    for (var i = 0; i < this.objs.length; i++) {
        var o = this.objs[i];
        if (o.ctrl == ctrl)
            return o;
    }
    return null;
}

FullEditPageObj.saveAll = function () {
    if (!this.objs)
        return true;
    for (var i = 0; i < this.objs.length; i++) {
        var o = this.objs[i];
        if (!o.editInfo.save()) {
            if (event)
                event.cancelBubble = true;
            return false;
        }
    }
    return true;
}

FullEditPageObj.hideTimerId = null;
FullEditPageObj.hideOperatePanel = function (bDelay) {
    if (bDelay) {
        if (this.hideTimerId != null)
            window.clearTimeout(this.hideTimerId);
        var o = this;
        this.hideTimerId = window.setTimeout(function () { $(o.divDlg).hide(); o.hideTimerId = null; }, 3000);
    } else {
        $(this.divDlg).hide();
        if (this.hideTimerId != null) {
            window.clearTimeout(this.hideTimerId);
            this.hideTimerId = null;
        }
    }
}

function CreateFullEditPage(pageid, yshtableid, colCount, rowsPerGroup, fullargs) {

    var t = g_yshFactory.GetYshById(yshtableid);
    t.ctrl.style.display = "none";
    for (var i = 0; i < rowsPerGroup; i++) {
        var row = t.ctrl.rows[t.ctrl.rows.length - 1 - i];
        row.style.display = "none";
    }
    //var rowLast = Ysh.Array.getLast(t.ctrl.rows);
    //rowLast.style.display = "none";

    var colOperate = colCount - 1;
    var p = new FullEditPageObj(pageid, t.ctrl, colOperate, colCount);
    p.rowsPerGroup = rowsPerGroup;
    p.filename = fullargs[0];
    p.setArgs(fullargs[1]);
    p.sortArgs = fullargs[2];
    p.t = t;
    return p;
}