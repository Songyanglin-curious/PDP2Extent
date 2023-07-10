// JScript 文件

function page_etable(arrCellType, arrRowContent, privnoedit) {
    this._etable = new etable(arrCellType, arrRowContent, privnoedit);
    document.write("<center><table border='0' style='margin:0;font-size:10pt;width:99%'"
        + " cellspacing='0' cellpading='0' id='operatetable" + e_AllTables.length
        + "'><tr><td background='/i/z.gif' height='30px'>&nbsp;</td><td align='right' style='border-bottom: 1px solid #c7c7c7' background='/i/zh.gif' width='99%'><a href='javascript:void(0)' onclick='return eTable_findTableById("
        + this._etable._table.id + ").upstairOnePage()'>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;"
        + "<a href='javascript:void(0)' onclick='return eTable_findTableById("
        + this._etable._table.id + ").downstairOnePage()'>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;"
        + "一共<span id='pageNum" + e_AllTables.length
        + "'></span>页<input id='txtNum" + e_AllTables.length
        + "' type='text' style='width:20px' value='1' /><a href='javascript:void(0)' onclick='return eTable_findTableById("
        + this._etable._table.id + ").turntoPage()'>跳转</a></td><td height='32px' background='/i/y.gif' width='1%'>&nbsp;</td></tr></table></center>");
    this._operatetable = document.getElementById("operatetable" + e_AllTables.length);
    this._etable._pageNumSpan = document.getElementById("pageNum" + e_AllTables.length);
    this._etable._pageNumText = document.getElementById("txtNum" + e_AllTables.length);

    this._etable._pagerow = 10;
    this._etable._pagenum = 0;

    this.changepriv = function (priv) {
        this._etable.changepriv(priv);
        this._operatetable.style.width = this._etable._table.style.width;
    }

    this._etable.contentPageRow = function (arrRowContent) {
        var arrTempRow = new Array();
        for (var i = 0; i < this._pagerow; i++) {
            if (this._pagenum * this._pagerow + i >= arrRowContent.length) break;
            arrTempRow.push(arrRowContent[this._pagenum * this._pagerow + i]);
        }
        this._pageNumSpan.innerText = parseInt(arrRowContent.length / this._pagerow, 10) + 1;
        this.contentRow(arrTempRow);
        this._RowContents = arrRowContent;
    }

    this._etable.pageChange = function (pageNum) {
        this._pagenum = pageNum;
        this._pageNumText.value = pageNum + 1;
        this.initData();
        this.contentPageRow(this._RowContents);
    }

    this._etable.upstairOnePage = function () {
        if (this._pagenum == 0) return false;
        this.pageChange(this._pagenum - 1);
        return false;
    }

    this._etable.downstairOnePage = function () {
        if ((this._pagenum + 1) * this._pagerow > this._RowContents.length) return false;
        this.pageChange(this._pagenum + 1);
        return false;
    }

    this._etable.turntoPage = function () {
        var numToTurn = parseInt(this._pageNumText.value, 10);
        if (!numToTurn || numToTurn < 1 || (numToTurn - 1) * this._pagerow > this._RowContents.length) {
            alert("超出范围");
            return false;
        }
        this.pageChange(numToTurn - 1);
        return false;
    }

    this._etable.deleteRow = function (obj) {
        var tr = obj.parentElement.parentElement;
        if (tr.cells(this._rowDspIndex).children(0).tagName == "SELECT") {
        if (confirm("确定删除" + this._rowDspPrefix + "“" + tr.cells(this._rowDspIndex).children(0).options[tr.cells(this._rowDspIndex).children(0).selectedIndex].text + "”关联的数据吗？")) {
                if (this.deleteEvent(tr))//删除数据是否成功
                {
                    this._RowContents.erase(this._RowContents[this._pagenum * this._pagerow + tr.rowIndex - 1]);
                    this.initData();
                    this.contentPageRow(this._RowContents);
                    if (this._table.rows.length == 0 && this._pagenum > 0)
                        this.pageChange(this._pagenum - 1);
                    return;
                }
                alert("删除失败");
            }
        }
        else {
            if (confirm("确定删除" + this._rowDspPrefix + "“" + tr.cells(this._rowDspIndex).innerText + "”吗？")) {
                if (this.deleteEvent(tr))//删除数据是否成功
                {
                    this._RowContents.erase(this._RowContents[this._pagenum * this._pagerow + tr.rowIndex - 1]);
                    this.initData();
                    this.contentPageRow(this._RowContents);
                    if (this._table.rows.length == 0 && this._pagenum > 0)
                        this.pageChange(this._pagenum - 1);
                    return;
                }
                alert("删除失败");
            }
        }
        var tc = tr.lastChild;
        tc.children[0].style.display = "";
        tc.children[1].style.display = "";
        tc.children[2].style.display = "none";
        tc.children[3].style.display = "none";
    }

    this._etable.editRow = function (obj) {
        var tr = obj.parentElement.parentElement;
        var rowContent = this._RowContents[this._pagenum * this._pagerow + tr.rowIndex - 1];
        rowContent._editing = true;
        for (var i = 0; i < this._CellTypes.length; i++) {
            var tc = tr.cells(i);
            switch (this._CellTypes[i]._type) {
                case 1:
                    tc.firstChild.value = rowContent._cellContentCollection[i];
                    tc.firstChild.style.display = "block";
                    tc.firstChild.fireEvent("onchange");
                    tc.lastChild.style.display = "none";
                    break;
                case 2:
                    tc.firstChild.checked = (rowContent._cellContentCollection[i] != "0") ? true : false;
                    tc.firstChild.style.display = "block";
                    tc.lastChild.style.display = "none";
                    tc.firstChild.fireEvent("onclick");
                    break;
                case 3:
                    tc.firstChild.value = rowContent._cellContentCollection[i];
                    tc.firstChild.style.display = "block";
                    tc.firstChild.fireEvent(this._eventdesc);
                    tc.lastChild.style.display = "none";
                    break;
                case 4:
                    tc.firstChild.disabled = false;
                    tc.firstChild.fireEvent("onclick");
                    break;
                case 5:
                    var value_combox_temp = rowContent._cellContentCollection[i];
                    for (var t = 0; t < tc.firstChild.options.length; t++) {
                        for (var k = 0; k < value_combox_temp.length; k++)
                            if (tc.firstChild.options[t].value == value_combox_temp[k]) {
                                tc.firstChild.options[t].selected = true;
                            }
                    }
                    tc.firstChild.style.display = "block";
                    tc.firstChild.fireEvent(this._eventdesc);
                    tc.lastChild.style.display = "none";
                    break;
                case 0:
                    break;
                default:
                    tc.innerText = rowContent._cellContentCollection[i] == "" ? " " : rowContent._cellContentCollection[i];
                    break;
            }
        }
        var tc = tr.cells(i);
        tc.children[0].style.display = "none";
        tc.children[1].style.display = "none";
        tc.children[2].style.display = "";
        tc.children[3].style.display = "";
    }

    this._etable.cancelRow = function (obj) {
        var tr = obj.parentElement.parentElement;
        if (this._RowContents.length == this._pagenum * this._pagerow + tr.rowIndex - 1)
            return;
        var rowContent = this._RowContents[this._pagenum * this._pagerow + tr.rowIndex - 1];
        rowContent._editing = false;
        for (var i = 0; i < this._CellTypes.length; i++) {
            var tc = tr.cells(i);
            switch (this._CellTypes[i]._type) {
                case 1:
                case 3:
                    tc.firstChild.value = rowContent._cellContentCollection[i];
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                case 2:
                    tc.firstChild.checked = (rowContent._cellContentCollection[i] != "0") ? true : false;
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                case 4:
                    tc.firstChild.checked = (rowContent._cellContentCollection[i] != "0") ? true : false;
                    tc.firstChild.disabled = true;
                    break;
                case 5:
                    var value_combox_temp = rowContent._cellContentCollection[i];
                    for (var t = 0; t < tc.firstChild.options.length; t++) {
                        for (var k = 0; k < value_combox_temp.length; k++)
                            if (tc.firstChild.options[t].value == value_combox_temp[k]) {
                                tc.firstChild.options[t].selected = true;
                            }
                    }
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                case 0:
                    break;
                default:
                    tc.innerText = rowContent._cellContentCollection[i] == "" ? " " : rowContent._cellContentCollection[i];
                    break;
            }
        }
        var tc = tr.cells(i);
        tc.children[0].style.display = "";
        tc.children[1].style.display = "";
        tc.children[2].style.display = "none";
        tc.children[3].style.display = "none";
    }

    this._etable.updateRow = function (obj) {
        var tr = obj.parentElement.parentElement;
        if ((tr.cells(this._rowDspIndex).firstChild) && (tr.cells(this._rowDspIndex).firstChild.value.replace(/ /g, "") == "") && (!confirm("确定插入空数据？")))
            return;
        var allTrText = this.updateEvent(tr);
        if (this._RowContents.length == this._pagenum * this._pagerow + tr.rowIndex - 1) {
            if (!allTrText) {
                alert("更新失败");
                return false;
            }
            else {
                if (!allTrText[0]) {
                    alert(allTrText);
                    return false;
                }
                this._RowContents.push(new RowContent(allTrText)); //得到更新后的数据,返回一个字符串数组
            }
        }
        else {
            if (!allTrText)
                alert("更新失败");
            else {
                if (!allTrText[0])
                    alert(allTrText);
                else
                    this._RowContents[this._pagenum * this._pagerow + tr.rowIndex - 1] = new RowContent(allTrText); //得到更新后的数据
            }
        }
        var rowContent = this._RowContents[this._pagenum * this._pagerow + tr.rowIndex - 1];
        rowContent._editing = false;

        this.initData();
        this.contentPageRow(this._RowContents);
    }

    this._etable.sort = function (cellIndex) {
        if (this._sort_index != cellIndex) {
            this._sort_index = cellIndex;
            this._sort_check = true;
        }
        else
            this._sort_check = !this._sort_check;
        if (window.jQuery) {
            ///用jquery排序速度更快
            var sortList = [];
            for (var j = 1; j < this._table.rows.length - 1; j++)
                sortList.push([j, this._table.rows[j].cells[this._sort_index].lastChild.innerText]);
            Table_Row_Compare(sortList, this._sort_check);
            for (var j = 0; j < sortList.length; j++) {
                jQuery(this._table.rows(sortList[j][0])).appendTo(jQuery(this._table)); //挨个往表后面排
                for (var k = j + 1; k < sortList.length; k++) {//碰到被排序行后面的行，因为被排序行被移走了，全部行id-1
                    if (sortList[k][0] > sortList[j][0])
                        sortList[k][0] -= 1;
                }
            }
            jQuery(this._table.rows(1)).appendTo(jQuery(this._table)); //将维护行排到最后
            ///排序完毕
        }
        else {
            Table_Row_Sort(this._RowContents, this._sort_index, this._sort_check);
            this.initData();
            this.contentPageRow(this._RowContents);
        }
        return false;
    }
}
