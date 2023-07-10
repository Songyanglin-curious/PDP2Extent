function TableFilter(tblObj, data, titleRowIndex, bottomRowCount) {
    this.tbl = tblObj;
    this._data = data;
    this.startRowIndex = titleRowIndex + 1;
    this.endRowIndex = this.tbl.rows.length - bottomRowCount - 1;
    this.conditions = {
        filterCondition: [],
        addCondition: function (colIndex, datas) {
            for (var i = 0; i < this.filterCondition.length; i++) {
                var filter = this.filterCondition[i];
                if (filter.c == colIndex) {
                    filter.d = datas;
                    return;
                }
            }
            this.filterCondition.push({ c: colIndex, d: datas });
        },
        isMeet: function (data, r) {
            for (var i = 0; i < this.filterCondition.length; i++) {
                var filter = this.filterCondition[i];
                if (filter.d == null) //全选
                    continue;
                if (filter.d.indexOf(data[filter.c].allData[r]) < 0)
                    return false;
            }
            return true;
        },
        getColumnData: function (colIndex) {
            for (var i = 0; i < this.filterCondition.length; i++) {
                var filter = this.filterCondition[i];
                if (filter.c == colIndex)
                    return filter.d;
            }
            return null;
        }
    };
    this.datas = [];
    var columns = tblObj.rows[titleRowIndex].cells.length;
    for (var i = 0; i < columns; i++)
        this.datas.push(null);
    this.startFilter = function (colIndex) {
        var arrDistinctData = [];
        if (this.datas[colIndex] == null) {
            var arrColumnData = [];
            for (var i = 0; i < this.startRowIndex; i++)
                arrColumnData.push("");
            for (var i = 0; i < this._data.length; i++) {
                var cell = this.tbl.rows[0].cells[colIndex];
                var v = "";
                if (cell.col)
                    v = this._data[i][cell.col];
                v = (v == "" ? "（空白）" : v);
                arrColumnData.push(v);
                if (arrDistinctData.indexOf(v) < 0)
                    arrDistinctData.push(v);
            }
            arrDistinctData.sort();
            this.datas[colIndex] = { allData: arrColumnData, distinctData: arrDistinctData };
        } else {
            arrDistinctData = this.datas[colIndex].distinctData;
        }

        function getContent() {
            return "<div style='width:100%;height:16px;background-color:#D7D7D7;text-align: left;'>内容筛选</div>"
                + "<table cellpadding=\"0\" cellspacing=\"0\" border='0' style='position: relative; top: 0px; left: 6px; right: 6px; width: 95%'>"
                    + "<tr>"
                        + "<td style='background-color:#F8F7F7;'><input id='txtKey' value='搜索（所有）' onpropertychange='TableFilter.searchTable(this.value)' onblur='if (this.value == \"\") this.value = \"搜索（所有）\";' onfocus='if (this.value == \"搜索（所有）\") { this.value = \"\"; }' style='width:180px'/></td>"
                        + "<td style='background-color:#F8F7F7;width:20px' Align='left'><img id='imgSee' src='/i/toSee2.gif' onclick='this.parentElement.parentElement.children[0].children[0].value = \"搜索（所有）\"'/></td>"
                    + "</tr>"
                    + "<tr>"
                        + "<td colSpan=2><div style='overflow:scroll;overflow-x:hidden;overflow-y:scroll; height:250px;width:100%;background-color:#FFF;border: 1px solid #000;'></div></td>"
                    + "</tr>"
                    + "<tr><td colSpan=2 Align='left'><span style='width:100%'>（全部显示）</span><hr/></td></tr>"
                    + "<tr><td colSpan=2 align=left><input type='button' value='确定' class='btnDefault'>&nbsp;&nbsp;&nbsp;<input type='button' value='取消' class='btnDefault' onclick='jscript: TableFilter.hideDiv();'></td></tr></table>";
            return strTable;
        }

        if (TableFilter.divMes) {
            TableFilter.divMes.style.display = "";
            TableFilter.divMes.innerHTML = getContent();
        }
        else {
            var strMsg = "<div onblur='TableFilter.hideDiv()' align=\"center\" style=\"position: absolute;overflow:scroll;overflow-x:hidden;overflow-y:hidden; z-index: 1111;height:350px;width:216px;background-color:#F8F7F7;" +
                        "filter: alpha(opacity=100); font-size: 14px;" +
                        "font-variant: small-caps; vertical-align: middle; padding: 0px\"></div>";
            TableFilter.divMes = document.createElement(strMsg);
            TableFilter.divMes.innerHTML = getContent();
            document.body.insertBefore(TableFilter.divMes);
        }

        var o = this;
        TableFilter.divMes.children[1].rows[3].cells[0].children[0].onclick = function () {
            var result = [];
            var tbSelR = TableFilter.tbSel.rows;
            var allSelected = true;
            for (var i = 1; i < tbSelR.length; i++) {
                if (tbSelR[i].style.display != "none" && tbSelR[i].cells(0).firstChild.checked) {
                    result.push(tbSelR[i].cells(1).innerText.trim());
                } else {
                    allSelected = false;
                }
            }
            o.ensureFilter(colIndex, allSelected ? null : result);
            o.doFilter();
            o.tbl.rows[titleRowIndex].cells[colIndex].lastChild.children[0].children[0].src = allSelected ? "Images/xiala.png" : "Images/shaixuan.png";
            TableFilter.hideDiv();
        };


        var selectedData = this.conditions.getColumnData(colIndex);
        var html = "<table style=\"width: 100%; \" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">"
            + "<tr style='height:20px'><td style='background-color:#fff;width:16px'><input onclick='TableFilter.clickConditionBox(this)' type='checkbox' " +
            (selectedData == null ? "checked" : "") + "/></td>"
            + "<td style='background-color:#fff;width:100%'>（全选）</td></tr>";
        for (var i = 0; i < arrDistinctData.length; i++) {
            var checked = "checked";
            if ((null != selectedData) && (selectedData.indexOf(arrDistinctData[i]) < 0))
                checked = "";
            html += "<tr style='height:20px'><td style='background-color:#fff'><input name='cbox'  type='checkbox' " + checked + "/></td>"
                + "<td style='background-color:#fff'>" + arrDistinctData[i].replace(/\r\n/g, "<br />") + "</td></tr>";
        }
        html += "</table>";

        var divMes = TableFilter.divMes;
        if (null != selectedData) {
            var selectedDataStr = selectedData.join();
            if (selectedDataStr.length > 15)
                selectedDataStr = selectedDataStr.substr(0, 15) + "......";
            divMes.children[1].rows[2].cells[0].children[0].innerText = selectedDataStr;
        }
        divMes.children[1].rows[1].cells[0].children[0].innerHTML = html;
        TableFilter.tbSel = divMes.children[1].rows[1].cells[0].children[0].children[0];

        divMes.style.width = Math.min(parseInt(divMes.offsetWidth, 10), 365) + "px";
        divMes.style.textAlign = "left";
        divMes.style.left = (parseInt(divMes.style.width) + event.clientX - event.offsetX + 16) > document.body.clientWidth ? (event.clientX - event.offsetX - parseInt(divMes.style.width)) : (event.clientX - event.offsetX + 16); 
        divMes.style.top = 0;
    }
    this.ensureFilter = function (colIndex, filterStringArray) {
        this.conditions.addCondition(colIndex, filterStringArray);
    }
    this.doFilter = function () {
        var arrData = [];
        for (var i = 0; i < this._data.length; i++) {
            if (this.conditions.isMeet(this.datas, i + 1))
                arrData.push(this._data[i]);
        }

        TableFilter.showData(arrData);
    }
}

TableFilter.filters = [];
TableFilter.divMes = null;

TableFilter.bindTable = function (tbl, data) {
    var filter = new TableFilter(tbl, data, 0, 0);
    TableFilter.filters.push(filter);
    var index = TableFilter.filters.length - 1;

    var row = tbl.rows[0];
    for (var c = 0; c < row.cells.length; c++) {
        var cell = row.cells[c];
        var html = "<div style='width:20px;float:right;'><a href='#' onclick='TableFilter.showFilter(" + index + "," + c + ")'><img src='/i/xiala.png'></a></div>";
        cell.innerHTML += html;
    }
}

TableFilter.bindTableColumns = function (tbl, data, columnIndexList) {
    var filter = new TableFilter(tbl, data, 0, 0);
    TableFilter.filters.push(filter);
    var index = TableFilter.filters.length - 1;

    var row = tbl.rows[0];
    for (var c = 0; c < columnIndexList.length; c++) {
        var cell = row.cells[columnIndexList[c]];
        var html = "<div style='width:20px;float:right;'><a href='#' onclick='return TableFilter.showFilter(" + index + "," + columnIndexList[c] + ")'><img src='/i/xiala.png'></a></div>";
        cell.innerHTML += html;
    }
}

TableFilter.showFilter = function (tableIndex, columnIndex) { 
    this.filters[tableIndex].startFilter(columnIndex);
    return false;
}

TableFilter.showData = function(data) {}

TableFilter.timerId = -1;
TableFilter.hideDiv = function () {
    if (this.divMes)
        this.divMes.style.display = "none";
    clearTimeout(TableFilter.timerId);
}

TableFilter.clickConditionBox = function (obj) { Ysh.Web.Table.setCheckBoxState(Ysh.Web.getParent(obj, "TABLE"), 1, 0, obj.checked); }

TableFilter.searchTable = function (key) {
    var tbSelR = this.tbSel.rows;
    if (key != "搜索（所有）") {
        for (var i = tbSelR.length - 1; i > 0; i--) {
            tbSelR[i].style.display = (tbSelR[i].cells(1).innerHTML.toString().indexOf(key) == -1) ? "none" : "";
        }
        document.getElementById("imgSee").src = "/i/close1.gif";
    }
    else {
        for (var i = tbSelR.length - 1; i > 0; i--) {
            tbSelR[i].style.display = "";
        }
        document.getElementById("imgSee").src = "/i/toSee2.gif";
    }
}
TableFilter.clearFilter = function (tbl) {
    var arrFilter = this.filters[0].conditions.filterCondition;
    for (var i = 0; i < arrFilter.length; i++)
        tbl.rows[0].cells[arrFilter[i].c].lastChild.children[0].children[0].src = "Images/xiala.png";
    TableFilter.filters[0].conditions.filterCondition = [];
}
