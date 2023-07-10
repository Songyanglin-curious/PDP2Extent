// JScript File -- Edit by Gud
function EditPageObj(name, tbl, colO, colC, btmrows) {
    this.objname = name;
    this.ctrl = tbl;
    this.colOperate = colO;
    this.colCount = colC;
    this.colIndex = null;
    this.curIndex = 0;
    this.pageCount = 0;
    this.bEditing = false;
    this.bPriv = true;
    this.arrBackupData = null;
    this.bottomrows = btmrows;
    this.titlerows = 1; //标题行数
    this.nModifyMode = 3;
    this.colSelect = null;
    this.showPageNo = false;
    this.getSingleHTML = function (id, func, name) {
        var strLink = "";
        if (typeof getLinkString != "undefined")
            strLink = getLinkString(name);
        return "<a href='#' onclick='" + this.objname + "." + func + "(" + id + ",this.parentElement.parentElement);return false;'>" + strLink + name + "</a>";
    }
    this.getOperateHTMLBase = function (id, op1func, op1name, op2func, op2name) {
        return this.getSingleHTML(id, op1func, op1name) + "&nbsp;&nbsp;" + this.getSingleHTML(id, op2func, op2name);
    }
    this.getOperateHTMLByMode = function (nMode, id, row) {
        switch (nMode.toString()) {
            case "0":
                return "&nbsp;";
            case "1":
                return this.getSingleHTML("\"" + id + "\"", "doModify", "修改");
            case "2":
                return this.getSingleHTML("\"" + id + "\"", "doDelete", "删除");
            case "4":
                return this.getOperateHTMLBase("\"" + id + "\"", "doMoveUp", "上移", "doMoveDown", "下移") + "&nbsp;&nbsp;" + this.getOperateHTMLBase("\"" + id + "\"", "doModify", "修改", "doDelete", "删除");
            default:
                return this.getOperateHTMLBase("\"" + id + "\"", "doModify", "修改", "doDelete", "删除");
        }
    }
    this.getOperateHTML = function (id, row) {
        if (row.cells[0].style.display == "none") {
            return this.getOperateHTMLByMode(row.cells[0].innerText, id, row);
        }
        return this.getOperateHTMLByMode(this.nModifyMode, id, row);
    }
    this.getModifyHTML = function (id) { return this.getOperateHTMLBase("\"" + id + "\"", "doUpdate", "更新", "doCancel", "取消"); }
    this.getCreateHTML = function () { return this.getOperateHTMLBase(-1, "doCreate", "保存", "doCancelCreate", "取消"); }
    this.onCreate = function (id, arrData, row) { alert("onCreate not implement"); return false; }
    this.onUpdate = function (id, arrData) { alert("onUpdate not implement"); return false; }
    this.onDelete = function (id, row) { alert("onDelete not implement"); return false; }
    this.onMove = function (id, row, bUp) { alert("onDelete not implement"); return false; }
    this.onEdit = function (row) { }
    this.onBeforeUpdate = function (id, arrUpdateData) { }
    this.onAfterUpdate = function (id, arrUpdateData) { }
    this.onBeforeCreate = function (id, arrInsertData) { }
    this.onAfterCreate = function (id, arrInsertData) { }
    this.onBeforeDelete = function (id, row) { }
    this.onAfterDelete = function (id, row) { }
    this.setShowState = function (row, c, v) { row.cells[c].innerHTML = this.getShowHTML(c, v, row); }
    this.setEditState = function (row, c, bInit) { alert("setEditState not implement"); }
    this.exitEdit = function (row) { }
    this.getEditData = function (row, c) { alert("getEditData not implement"); }
    this.setRowStyle = function (row) {
        row.style.backgroundColor = (row.rowIndex % 2 == 0) ? "#F5F6F5" : "#FFFFFF";
        SP_SetRowStyle(row);
    }
    this.cancelTime = function (row) { }
    this.setClickEvent = function (id, row) { }
    this.setCellStyle = function (c, cell) { cell.style.textAlign = "center"; }
    this.isValid = function (row, c) { return true; }
    this.getShowHTML = function (c, v) { return v; }
    this.getEditDataArray = function (row, noCheck) {
        var arrEditData = [];
        for (var c = 0; c < this.colCount; c++) {
            if (!noCheck) {
            if (!this.isValid(row, c))
                return null;
            }
            arrEditData.push(this.getEditData(row, c));
        }
        return arrEditData;
    }
    this.doModify = function (id, row) {
        if (this.bEditing) return;
        this.bEditing = true;
        if (null == this.arrBackupData)
            this.arrBackupData = new Array(this.colCount);
        for (var c = 0; c < this.colCount; c++) { this.arrBackupData[c] = row.cells[c].innerHTML; }
        row.cells[this.colOperate].innerHTML = this.getModifyHTML(id);
        this.setRowEditData(row, false);
    }
    this.getDeleteData = function (id, row) {
        return row;
    }
    this.doDelete = function (id, row) {
        if (this.bEditing)
            return;
        this.onBeforeDelete(id);
        var arrDeleteData = this.getDeleteData(id, row);
        if (!this.onDelete(id, arrDeleteData))
            return;
        if (this.colIndex != null) { //修改顺序列
            for (var r = row.rowIndex + 1; r < this.ctrl.rows.length - this.bottomrows; r++) {
                this.ctrl.rows[r].cells[this.colIndex].innerHTML = this.getShowHTML(this.colIndex, r - this.titlerows);
            }
        }
        this.ctrl.deleteRow(row.rowIndex);
        for (var i = 1; i < this.ctrl.rows.length; i++) {
            this.setRowStyle(this.ctrl.rows[i]);
        }
        this.onAfterDelete(id);
    }
    //Add by gud 20121018
    this.removeIndexData = function (arrData) {
        var arrSplice = [];
        if (this.colIndex != null)
            arrSplice.push(this.colIndex);
        if (this.colSelect != null)
            arrSplice.push(this.colSelect);
        arrSplice.sort();
        for (var i = arrSplice.length - 1; i >= 0; i--)
            arrData.splice(arrSplice[i], 1);
    }
    //Add end
    this.doUpdate = function (id, row) {
        var arrUpdateData = this.getEditDataArray(row);
        if (arrUpdateData == null) return;
        this.onBeforeUpdate(id, arrUpdateData);
        if (!this.onUpdate(id, arrUpdateData)) return;
        this.onAfterUpdate(id, arrUpdateData);
        arrUpdateData[this.colOperate] = id;
        this.removeIndexData(arrUpdateData); //Modify by gud 20121018:如果有索引列，那么保存之后得把索引列去掉，不然显示就不对了
        this.setRowShowData(row, arrUpdateData);
        row.cells[this.colOperate].innerHTML = this.getOperateHTML(id, row);
        this.bEditing = false;
        this.exitEdit(row);
    }
    this.doCancel = function (id, row) {
        this.bEditing = false;
        this.cancelTime(row); //还原时间控件
        for (var c = 0; c < this.colCount; c++) { row.cells[c].innerHTML = this.arrBackupData[c]; };
        this.exitEdit(row); 
    }
    this.doCreate = function (id, row) {//如果有索引列，那么保存之后得把索引列去掉，不然显示就不对了
        var arrInsertData = this.getEditDataArray(row);
        if (arrInsertData == null) return;
        this.onBeforeCreate(id, arrInsertData);
        var nId = this.onCreate(id, arrInsertData, row);
        if (nId == false) return;
        this.onAfterCreate(nId, arrInsertData);
        arrInsertData[this.colOperate] = nId;
        this.removeIndexData(arrInsertData); //Modify by gud 20121018:如果有索引列，那么保存之后得把索引列去掉，不然显示就不对了
        this.setRowShowData(row, arrInsertData);
        row.cells[this.colOperate].innerHTML = this.getOperateHTML(nId, row);
        this.bEditing = false;
        this.exitEdit(row);
    }
    this.doCancelCreate = function (id, row) {
        this.bEditing = false;
        this.cancelTime(row); //还原时间控件
        this.ctrl.deleteRow(row.rowIndex);
    }
    //Add by gud 2013-03-26
    this.swapRow = function (row0, row1) {
        for (var c = 0; c < row0.cells.length; c++) {
            if (c == this.colIndex)
                continue;
            var temp = row0.cells[c].innerHTML;
            var tempv = row0.cells[c]._v;
            row0.cells[c].innerHTML = row1.cells[c].innerHTML;
            row0.cells[c]._v = row1.cells[c]._v;
            row1.cells[c].innerHTML = temp;
            row1.cells[c]._v = tempv;
        }
        var tempid = row0._v;
        row0._v = row1._v;
        row1._v = tempid;
    }
    this.doMove = function (id, row, bUp) {//不支持分页
        var row0 = row, row1 = row;
        if (bUp) {
            if (row.rowIndex <= this.titlerows) //最上边一行了
                return;
            row0 = this.ctrl.rows[row.rowIndex - 1];
        } else {
            if (row.rowIndex >= this.ctrl.rows.length - this.bottomrows - 1) //最后一行
                return;
            row1 = this.ctrl.rows[row.rowIndex + 1];
        }
        if (!this.onMove(id, row, bUp))
            return;
        this.swapRow(row0, row1);
    }
    this.doMoveUp = function (id, row) { this.doMove(id, row, true); }
    this.doMoveDown = function (id, row) { this.doMove(id, row, false); }
    //Add end
    this.setRowShowData = function (row, arrData) {
        var iTemp = 0;
        var id = this.getIdFromData(arrData);
        row._v = id;
        for (var c = 0; c < this.colCount; c++) {
            if (this.colIndex != null && c == this.colIndex) {
                var idx = (row.rowIndex - this.titlerows + 1) + this.curIndex * this.pageCount;
                row.cells[c]._v = idx;
                this.setShowState(row, c, idx);
                continue;
            }
            if (this.colSelect != null && c == this.colSelect) {
                var td = row.cells[c];
                td._v = id;
                td.innerHTML = "<input type='checkbox' value='" + id + "' />";
                continue;
            }
            if (c != this.colOperate) {
                row.cells[c]._v = arrData[iTemp];
                this.setShowState(row, c, arrData[iTemp]);
            }
            iTemp++;
        }
    }
    this.setRowEditData = function (row, bInit) {
        for (var c = 0; c < this.colCount; c++) {
            if (c != this.colOperate) { this.setEditState(row, c, bInit); }
        };
        this.onEdit(row);
    }
    this.getIdFromData = function (arrData) {
        var aa = this.colOperate - ((this.colIndex != null) ? 1 : 0) - ((this.colSelect != null) ? 1 : 0);
        var id = "";
        if (aa == arrData.length)
            id = arrData[this.colOperate - 2];
        else
            id = arrData[aa];
        return id;
    }
    this.getIdFromRow = function (row) {
        return row._v;
    }
    this.addRow = function (arrData) {
        var row = this.ctrl.insertRow(-1);
        for (var c = 0; c < this.colCount; c++) {
            var cell = row.insertCell(-1);
            this.setCellStyle(c, cell);
            if (this.ctrl.rows[this.titlerows - 1].cells[c].style.display == "none")//update by linger 20121009 增加对隐藏列的处理
                cell.style.display = "none";
            if (!this.bPriv && c == this.colOperate)
                cell.style.display = "none"; //update end
        };
        var id = this.getIdFromData(arrData);
        //  var id = arrData[this.colOperate - ((this.colIndex != null) ? 1 : 0)];
        this.setRowShowData(row, arrData);
        row.cells[this.colOperate].innerHTML = (id == "") ? "&nbsp;" : this.getOperateHTML(id, row);
        this.setClickEvent(id, row);
        this.setRowStyle(row);
    }
    this.addNewRow = function (rowIndex) {
        if (this.bEditing) return;
        this.bEditing = true;
        if (typeof rowIndex == "undefined")
            rowIndex = this.ctrl.rows.length - this.bottomrows;
        //Add By ChenHui 新加一行的时候判断一下原来是不是有一条空行
        for (var i = 0; i < this.ctrl.rows.length; i++) {
            if (this.ctrl.rows[i].innerText == "没有任何记录") {
                this.ctrl.deleteRow(i);
                if (i <= rowIndex)
                    rowIndex--;
            }
        }
        //Add End
        var row = this.ctrl.insertRow(rowIndex);
        for (var c = 0; c < this.colCount; c++) {
            var cell = row.insertCell(-1);
            this.setCellStyle(c, cell);
            if (this.ctrl.rows[this.titlerows - 1].cells[c].style.display == "none")//update by linger 20121009 增加对隐藏列的处理
                cell.style.display = "none";
            if (!this.bPriv && c == this.colOperate)
                cell.style.display = "none"; //update end
        };
        this.setRowStyle(row);
        row.cells[this.colOperate].innerHTML = this.getCreateHTML();
        this.setRowEditData(row, true);
        this.setClickEvent("", row);
        var div = Ysh.Web.getParent(row, "DIV");
        if (div) {
            while (div) {
                var of = div.style.overflowY;
                if ((of == "auto") || (of == "yes"))
                    break;
                div = Ysh.Web.getParent(div, "DIV");
            }
        }
        if (div)
            div.scrollTop = div.scrollHeight;
    }
    this.addPageNoRow = function (nCount, nCurr, strJumpFunc, strAddFunc) {
        this.showPageNo = false;
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
            this.showPageNo = true;
            var row = this.ctrl.insertRow(-1);
            var cell = row.insertCell(-1);

            cell.colSpan = this.colCount;
            this.setCellStyle(-1, cell);
            cell.style.textAlign = "center";
            cell.innerHTML = strHTML;

            this.setRowStyle(row);
        }
    }
    this.UpdateList = function (titlerows, arrList, nIndex) {
        this.bEditing = false;
        if (nIndex)
            this.curIndex = nIndex - 1;

        var nRows = this.ctrl.rows.length;
        for (var i = nRows - 1; i >= titlerows; i--) { this.ctrl.deleteRow(i); }
        if (arrList.length == 0) {
            this.setRowStyle(SP_SetNoRecordPrompt(this.ctrl, this.colCount));
            return;
        }
        for (var r = 0; r < arrList.length; r++) { this.addRow(arrList[r]); }
    }
    //add by linger at 2012-10-23
    this.ChangeState = function (bFlag) {
        bPriv = bFlag;
        for (var i = 0; i < this.ctrl.rows.length - 1; i++) {
            if (this.ctrl.rows[i].cells.length > this.colOperate)
                this.ctrl.rows[i].cells[this.colOperate].style.display = bFlag ? "" : "none";
            if (this.colSelect != null)
                this.ctrl.rows[i].cells[this.colSelect].style.display = bFlag ? "" : "none";
        }
        if (this.showPageNo)
            this.ctrl.rows[this.ctrl.rows.length - 1].cells[0].style.display = bFlag ? "" : "none";
    }
    this.getSelected = function () {
        if (this.colSelect == null)
            return [];
        var rStart = this.titlerows;
        var rEnd = this.ctrl.rows.length - 1;
        if (this.showPageNo)
            rEnd--;
        var arrSelected = [];
        for (var r = rStart; r <= rEnd; r++) {
            var cell = this.ctrl.rows[r].cells[this.colSelect];
            if (!cell)
                continue;
            var cb = cell.children[0];
            if (cb.checked)
                arrSelected.push(cb.value);
        }
        return arrSelected;
    }
}