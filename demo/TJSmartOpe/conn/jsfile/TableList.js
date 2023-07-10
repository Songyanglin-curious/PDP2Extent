// JScript 文件
//由李世泽编写
function TableList() {
    var tb_list;
    this.GetTable = function () {
        this._tb_list = tb_list;
    }

    this._tb_list = this.GetTable;
    //var PageCount;

    this.RowContent = function (allCellContent) {
        this._editing = false;
        this._cellContentCollection = allCellContent;
    }

    this.CellType = function (title, width, type) {
        this._title = title;
        this._w = width;
        this._type = type;
    }

    this.arrCellType = new Array();
    this.arrRowContent = new Array();

    this.CreateEditTable = function (tableid) {
        document.write("<center><table width='100%' border='0' class='tablelist' cellspacing='0' cellpading='0' id='" + tableid + "'></table></center>");
        tb_list = document.getElementById(tableid);
    }


    this.CreateHeadRow = function (type) {
        if (!tb_list)
            return;
        var tr = tb_list.insertRow(-1);
        if (type == "blue")
            tr.className = "HeadRow_blue";
        else
            tr.className = "HeadRow_gray";
        for (var i = 0; i < this.arrCellType.length; i++) {
            var tc = tr.insertCell(-1);
            if (this.arrCellType[i]._w == 0)
                tc.style.display = "none";
            else
                tc.style.width = this.arrCellType[i]._w;
            tc.innerHTML = "<b>" + this.arrCellType[i]._title + "</b>";
            tc.align = "center";
            tc.className = "edittabletd";
        }
    }

    this.CreateContentRow = function () {
        var b = true;
        for (var i = 0; i < this.arrRowContent.length; i++) {
            var tr = tb_list.insertRow(-1);
            if (b)
                tr.className = "rowColor";
            for (var j = 0; j < this.arrCellType.length; j++) {
                var tc = tr.insertCell(-1);
                if (this.arrCellType[j]._w == 0)
                    tc.style.display = "none";
                else
                    tc.style.width = this.arrCellType[j]._w;
                if (this.arrCellType[j]._type == 1) {
                    tc.innerHTML = "<input class='checkboxcss' type='checkbox' />";
                    this.arrRowContent[i]._cellContentCollection[j] == "indeter" ? (tc.firstChild.indeterminate = true) : (this.arrRowContent[i]._cellContentCollection[j] == "checked" ? tc.firstChild.checked = true : tc.firstChild.checked = false);
                    tc.style.textAlign = "center";
                    tc.className = "edittabletd";
                }
                else if (this.arrCellType[j]._type == 2) {
                    tc.innerHTML = "<a />";
                    tc.firstChild.innerText = this.arrRowContent[i]._cellContentCollection[j];
                    tc.firstChild.href = "javascript:Set_link(" + tr.cells[0].innerText + ")";
                    tc.style.textAlign = "center";
                    tc.className = "edittabletd";
                }
                else {
                    tc.innerText = this.arrRowContent[i]._cellContentCollection[j];
                    tc.style.textAlign = "center";
                    tc.className = "edittabletd";
                    if (tc.innerText == "禁用")
                        tc.className = "extremityColor";
                }
            }
            if (b)
                b = false;
            else
                b = true;
        }
    }

    this.CreatePageIndex = function (strObj) {
        if (!tb_list)
            return;
        if (!this.pageCount)
            return;
        if (this.pageCount == 0)
            return;
        var pageage;
        if ((tb_list.rows.length - 1) % this.pageCount == 0)
            pageage = (tb_list.rows.length - 1) / this.pageCount;
        else
            pageage = parseInt((tb_list.rows.length - 1) / this.pageCount) + 1;
        if (pageage != 1) {
            document.write("<center><table width='100%' border='0' style='font-size:10pt;' cellspacing='0' cellpading='0' id='pageIndex'></table></center>");
            pageIndex_Table = document.getElementById("pageIndex");
            var tr = pageIndex_Table.insertRow(-1);
            var tc = tr.insertCell(-1);
            tc.align = "center";
            for (var i = 0; i < pageage; i++) {
                tc.innerHTML += "<a href='javascript:" + strObj + ".SelectPageIndex(" + i + ")' style='font-size:9pt;font-weight:bold'>" + (i + 1) + "</a>&nbsp;&nbsp;&nbsp;"
            }
        }
    }


    this.SelectPageIndex = function (pageindex) {
        if (!tb_list)
            return;
        if (!this.pageCount)
            return;
        if (this.pageCount == 0)
            return;
        for (var i = 1; i < tb_list.rows.length; i++) {
            if (i > pageindex * this.pageCount && i <= (pageindex + 1) * this.pageCount)
                tb_list.rows[i].style.display = "block";
            else
                tb_list.rows[i].style.display = "none";
        }
    }
}