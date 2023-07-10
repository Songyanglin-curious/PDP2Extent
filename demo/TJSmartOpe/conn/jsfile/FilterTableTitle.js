/*
现在筛选没有缓存，而且不能筛选多列，这块功能需要完善
*/
var tableFilter = {
    divMsg: null,
    getMessage: function (tblname, colindex) {
        var strTable = "<div style='width:100%;height:16px;background-color:#D7D7D7;text-align: left;'>内容筛选</div><table cellpadding=\"0\" cellspacing=\"0\" border='0' style='position: relative; top: 0px; left: 6px; right: 6px; width: 95%'><tr><td style='background-color:#F8F7F7;'>"
        + "<input id='txtKey' value='搜索（所有）' onpropertychange='tableFilter.SearchTable(this)' onblur='tableFilter.Onblur()' onfocus='tableFilter.Onfocus()' style='width:180px'/></td>"
        + "<td style='background-color:#F8F7F7;width:20px' Align='left'><img id='imgSee' src='/i/toSee2.gif' onclick='tableFilter.SearchOrCancel()'/> </td></tr><tr><td colSpan=2>";
        strTable += "<div id='divFilTable' style='overflow:scroll;overflow-x:hidden;overflow-y:scroll; height:250px;width:100%;background-color:#FFF;border: 1px solid #000;'>";
        strTable += "</div></td></tr><tr><td colSpan=2 Align='left'><span id='spanShowSel' style='width:100%'>（全部显示）</span><hr/> <input type='button' id='btnOk' class='btnOk' onclick='tableFilter.okOnClick(\"" + tblname + "\",\"" + colindex + "\");'>&nbsp;&nbsp;&nbsp;<input type='button' id='btnCancel' class='btnCancel' onclick='jscript: tableFilter.DivHidden();'></td></tr></table>";
        return strTable;
    },
    DivHidden: function () {
        if (this.divMsg) {
            this.divMsg.style.display = "none";
        }
    },
    SelectCondition: function (obj) {
        var cb = document.getElementsByName('cbox');
        if (obj.id == "qx") {
            var sum = cb.length;
            for (var i = 0; i < sum; i++) {
                cb[i].checked = obj.checked ? true : false;
            }
            if (obj.checked) {
                document.getElementById("spanShowSel").innerText = "（全部显示）";
            }
        }
        else {
            if (obj.checked == false) {
                document.getElementById('qx').checked = false;
            }
            else {
                var sum = cb.length;
                var i = 0;
                for (i = 0; i < sum; i++) {
                    if (cb[i].checked == false) {
                        break;
                    }
                }
                if (i == sum) {
                    document.getElementById('qx').checked = true;
                    document.getElementById("spanShowSel").innerText = "（全部显示）";
                }
            }
        }
    },
    SearchTable: function (obj) {
        if ((!event) || (event.propertyName != "value"))
            return;
        var key = obj.value;
        var tbSelR = tbSel.rows;
        if ((key != "搜索（所有）") && (key != "")) {
            for (var i = tbSelR.length - 2; i > 0; i--) {
                if (tbSelR[i].cells[1].innerHTML.toString().indexOf(key) == -1) {
                    tbSelR[i].style.display = "none";
                }
                else {
                    tbSelR[i].style.display = "";
                }
            }
            document.getElementById("imgSee").src = "/i/close1.gif";
        }
        else {
            for (var i = tbSelR.length - 2; i > 0; i--) {
                tbSelR[i].style.display = "";
            }
            document.getElementById("imgSee").src = "/i/toSee2.gif";
        }
    },
    Onblur: function () {
        var key = document.getElementById("txtKey");
        if (key.value == "") {
            key.value = "搜索（所有）";
        }
    },

    SearchOrCancel: function () {
        var key = document.getElementById("txtKey");
        if (key.value != "搜索（所有）") {
            key.value = "搜索（所有）";
        }
    },

    Onfocus: function () {
        var key = document.getElementById("txtKey");
        if (key.value == "搜索（所有）") {
            key.value = "";
        }
    },
    okOnClick: function (goalTabName, colIndex) {
        var f = this.data[goalTabName];
        if (!f) {
            f = this.data[goalTabName] = this.createFilter();
        }
        var filterBy = [];
        var tbSelR = tbSel.rows;
        if (!document.getElementById('qx').checked) {
            for (var i = 1; i < tbSelR.length - 1; i++) {
                if (tbSelR[i].style.display != "none" && tbSelR[i].cells(0).firstChild.checked) {
                    filterBy.push(tbSelR[i].cells[1].innerText);
                }
            }
        }
        var goalTab = document.getElementById(goalTabName).rows;
        if (!f.cols)
            f.cols = []
        if (!f.cols.contains(colIndex)) {
            f.cols.push(colIndex);
            if (!f.colData[colIndex]) {
                //缓存数据，应该移到点的时候缓存
                f.cacheData(document.getElementById(goalTabName), colIndex);
            }
        }
        f.filterBy[colIndex] = filterBy;
        //开始过滤吧
        for (var i = f.titleRows; i < goalTab.length - f.bottomRows; i++) {
            goalTab[i].style.display = (f.isHidden(i - f.titleRows) ? "none" : "");
        }
        if (document.getElementById('qx').checked)
            document.getElementById(goalTabName + "sel" + colIndex).src = "/i/下拉.png";
        else
            document.getElementById(goalTabName + "sel" + colIndex).src = "/i/筛选.png";

        this.DivHidden();
    },
    data: {},
    clear: function (tblFlag) {
        this.data[tblFlag] = null;
    },
    createFilter: function () {
        function getTableRowColData(row, colIndex) {
            var cell = row.cells[colIndex];
            if (cell.children.length == 0)
                return cell.innerText;
            return cell.firstChild.value; //编辑框
        }
        return { filterBy: {}, colData: {}, titleRows: 1/*默认标题一行*/, bottomRows: 1, /*默认最后一行不用*/
            isHidden: function (idx) {
                for (var i = 0; i < this.cols.length; i++) {
                    var col = this.cols[i];
                    var filterBy = this.filterBy[col];
                    if (filterBy.length == 0)
                        continue;
                    var v = this.colData[col][idx];
                    if (v == "") v = "（空白）";
                    if (!filterBy.contains(v)) //有一列不在过滤条件里，隐藏
                        return true;
                }
            },
            cacheData: function (tbl, col) {
                var colData = [];
                for (var i = this.titleRows; i < tbl.rows.length - this.bottomRows; i++) {
                    var text = getTableRowColData(tbl.rows[i], col);
                    colData.push(text);
                }
                this.colData[col] = colData;
            }
        };
    },
    isIncludeColStr: function (goalTabName, colIndex, str) {
        if (this.isAllInclude(goalTabName, colIndex))
            return true;
        return this.data[goalTabName].filterBy[colIndex].contains(str);
    },
    isAllInclude: function (goalTabName, colIndex) {
        if (!this.data[goalTabName])
            return true;
        var f = this.data[goalTabName];
        if (!f.cols.contains(colIndex))
            return true;
        var filterBy = f.filterBy[colIndex];
        if (filterBy.length == 0)
            return true;
        return false;
    },
    getFilterStr: function (goalTabName, colIndex) {
        if (this.isAllInclude(goalTabName, colIndex))
            return "";
        return this.data[goalTabName].filterBy[colIndex].join(",");
    },
    showAlert: function (goalTable, colIndex) {
        if ((this.divMsg != null) && (this.divMsg.style.display == "")) {
            this.divMsg.style.display = "none";
            return;
        }
        var alertStr = new Array();
        var j = 0;
        var cinfo = "";
        for (var i = 1; i < goalTable.rows.length - 1; i++) {
            //if (goalTable.rows[i].style.display == "none")
            //    continue;
            var tdtext = goalTable.rows[i].cells[colIndex];
            var cl = tdtext.children.length;
            if (cl == 0)
                cinfo = tdtext.innerText;
            else
                cinfo = tdtext.firstChild.value;
            if (!alertStr.contains(cinfo))
                alertStr.push(cinfo);
        }
        var divMes = this.divMsg;
        if (divMes) {
            divMes.style.display = "";
            divMes.innerHTML = tableFilter.getMessage(goalTable.id, colIndex);
        }
        else {
            var strMsg = "<div onblur='tableFilter.DivHidden()' align=\"center\" style=\"position: absolute;overflow:scroll;overflow-x:hidden;overflow-y:hidden; z-index: 1111;height:350px;width:216px;background-color:#F8F7F7;" +
                        "filter: alpha(opacity=100); font-size: 14px;" +
                        "font-variant: small-caps; vertical-align: middle; padding: 0px\"></div>";
            var divMsg = document.createElement(strMsg);
            divMsg.innerHTML = tableFilter.getMessage(goalTable.id, colIndex);
            document.body.insertBefore(divMsg);
            divMes = divMsg;
            this.divMsg = divMes;
        }

        var aa = "<table id='tbSel' style=\"width: 100%; height: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">" +
     "<tr style='height:20px'><td style='background-color:#fff;width:16px'><input id='qx' onclick='tableFilter.SelectCondition(this)' type='checkbox' " +
     (tableFilter.isAllInclude(goalTable.id, colIndex) ? "checked" : "") + "/></td>" +
     "<td style='background-color:#fff;width:100%'>（全选）</td></tr>";
        var arrTheCol = alertStr;
        for (var i = 0; i < arrTheCol.length; i++) {
            var bb = arrTheCol[i] == "" ? "（空白）" : arrTheCol[i];
            var checked = tableFilter.isIncludeColStr(goalTable.id, colIndex, bb) ? "checked" : "";
            aa += "<tr style='height:20px'><td style='background-color:#fff'><input name='cbox' id='selAll'+" + i.toString() + " onclick='tableFilter.SelectCondition(this)'  type='checkbox' " + checked + "/></td>"
        + "<td style='background-color:#fff'>" + bb + "</td></tr>";
        }
        aa += "<tr style='height:90%'><td style='height:90%'></td><td></td></tr></table>";

        divFilTable.innerHTML = aa;

        var con = tableFilter.getFilterStr(goalTable.id, colIndex);
        if (con != "") {
            var showSpan = "";
            if (con.length > 15)
                showSpan = con.substr(0, 15) + "......";
            else
                showSpan = con;
            document.getElementById("spanShowSel").innerText = showSpan;
        }

        var divys = divMes.style;
        divys.width = Math.min(parseInt(divMes.offsetWidth, 10), 365) + "px";
        divys.textAlign = "left";
        divys.left = (parseInt(divys.width) + event.clientX - event.offsetX + 16) > document.body.clientWidth ? (event.clientX - event.offsetX - parseInt(divys.width)) : (event.clientX - event.offsetX + 16);
        divys.top = 0;
    }
};

function showAlert(goalTable, colIndex) {
    tableFilter.showAlert(goalTable, colIndex);
}