$ = function (id) {
    return document.getElementById(id);
};

YshAssist = {
    CssPath: "/Conn/Cssfile/",
    //动态加载Css
    LoadCss: function (strCss) {
        var css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('type', 'text/css');
        css.setAttribute('href', this.CssPath + strCss);
        document.getElementsByTagName('head')[0].appendChild(css);
    },
    //取得当前对象指定的父对象
    GetParentObj: function (obj, tagname) {
        while (obj) {
            if (obj.tagName == tagname)
                return obj;
            obj = obj.parentElement;
        }
        return null;
    },
    //绑定数据列表，arrData:二维数据存放数据，style：一个对象进行样式控制，rowClick：行单击事件
    //viewData：行的双击事件，tblMain：操作的Table的对象，rownum：保留几行标题
    BindCells: function (arrData, style, rowClick, viewData, tblMain, rownum) {
        tblMain = (tblMain ? tblMain : $("tblMain"));

        while ((rownum ? rownum : 1) < tblMain.rows.length)
            tblMain.deleteRow();

        for (var i = 0; i < arrData.length; i++) {
            var tr = tblMain.insertRow(-1);
            tr.style.textAlign = "center";

            if (rowClick)
                tr.onclick = function () { rowClick(this); };
            if (viewData)
                Ysh.Web.Event.attachEvent(tr,"ondblclick", viewData);
            //tr.attachEvent("ondblclick", viewData);
            var trclassName = (tr.rowIndex % 2 == 1 ? "trFirst" : "trSecond");

            for (var j = 0; j < arrData[i].length; j++) {
                var tc = tr.insertCell(-1);

                if (j == 1 || j == arrData[i].length - 1)
                    tc.colSpan = 2;
                if (j == 0 || arrData[i][j] == "hidden")
                    tc.style.display = "none";
                if (style && style.Cols.indexOf('|' + j + '|') > -1) {
                    if (style.Align)
                        tc.style.textAlign = style.Align; //此处以后有需要可以再扩展
                    if (style.Padding)
                        tc.style.padding = style.Padding;
                }

                tc.innerHTML = ("" + arrData[i][j]).replace(/\r\n/g, "<br />");
                tc.className = "tbCellboth " + trclassName;
            }
        }
    },
    //将数据绑定到对应的下拉菜单
    BindSelect: function (objSelect, arrData) {
        while (1 < objSelect.options.length)
            objSelect.remove(1);

        if (arrData == null) return;
        try {
            for (var i = 0; i < arrData.length; i++)
                objSelect.options.add(new Option(arrData[i][0], arrData[i][1]));
        }
        catch (e) {
            alert(e.description);
        }
    },
    RowClick: function () {
        this.tempCss = "";
        this.tempTr = null;
        with (this) {
            this.rowClick = function (tr) {
                if (this.tempTr == tr) return;
                if (!this.tempTr) {
                    this.tempTr = tr;
                    this.tempCss = tr.firstChild.className;
                }
                for (var i = 1; i < tr.cells.length; i++) {
                    if (this.tempTr.cells(i))
                        this.tempTr.cells(i).className = this.tempCss;
                    tr.cells(i).className = "tempCell";
                }
                this.tempTr = tr;
                this.tempCss = tr.firstChild.className;
            };
        }
    },
    PageTable: function (tblMain, objData, tdPage, pageCount, pageIndex) {
        objData.value = (objData.value == null ? new Array() : objData.value);
        pageIndex = pageIndex ? pageIndex : 1;
        pageCount = pageCount ? pageCount : 10;
        var pageTotal = Math.ceil(objData.value.length / pageCount);
        if (pageIndex < 1) pageIndex = 1;
        if (pageIndex > pageTotal) pageIndex = pageTotal;
        window.pageIndex = pageIndex;

        while (1 < tblMain.rows.length)
            tblMain.deleteRow();

        for (i = pageCount * (pageIndex - 1); i < pageCount * pageIndex; i++) {
            if (i != objData.value.length && objData.value.length > 0)
                window.AddNewRow(objData.value, i);
            else
                break;
        }

        tdPage.innerHTML = "<a id=firstpage href='javascript:void(0)'>首页</a>&nbsp;<a id=prepage href='javascript:void(0)'>上一页</a>&nbsp;"
                          + "<a id=nextpage href='javascript:void(0)'>下一页</a>&nbsp;<a id=lastpage href='javascript:void(0)'>尾页</a>&nbsp;"
                          + "页次：<font color=red><b>" + pageIndex + "</b></font>/<b>" + pageTotal + "</b>页&nbsp;共<b>" + objData.value.length
                          + "</b>条记录&nbsp;<b>" + pageCount + "</b>条/页 <a href='javascript:void(0)' id=gotopage><font color=blue>转到</font></a> 第<input id=num type='text' value='1' style='width:30px'/>页";

        window.firstpage.disabled = pageIndex == 1;
        window.prepage.disabled = pageIndex == 1;
        window.nextpage.disabled = pageIndex == pageTotal;
        window.lastpage.disabled = pageIndex == pageTotal;

        if (pageIndex != 1) {
            Ysh.Web.Event.attachEvent(window.firstpage,"onclick", function () { YshAssist.PageTable(tblMain, objData, tdPage, pageCount, 1); });
            Ysh.Web.Event.attachEvent(window.prepage,"onclick", function () { YshAssist.PageTable(tblMain, objData, tdPage, pageCount, parseInt(window.pageIndex, 10) - 1); });
        }
        if (pageIndex != pageTotal) {
            Ysh.Web.Event.attachEvent(window.nextpage,"onclick", function () { YshAssist.PageTable(tblMain, objData, tdPage, pageCount, parseInt(window.pageIndex, 10) + 1); });
            Ysh.Web.Event.attachEvent(window.lastpage,"onclick", function () { YshAssist.PageTable(tblMain, objData, tdPage, pageCount, pageTotal); });
        }
        Ysh.Web.Event.attachEvent(window.gotopage,"onclick", function () { YshAssist.PageTable(tblMain, objData, tdPage, pageCount, $("num").value); });
    }
};

YshDesign = {
    ImagePath: "/i/LayOut/",
    DrawTitle: function (strTitle) {
        var strTable = "<table style=\"width: 100%; height: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
        strTable += "<tr class=\"topTitle\"><td><img alt=\"\" src=\"" + this.ImagePath + "toptitle0.jpg\" /></td>";
        strTable += "<td style=\"width:100%; padding-left:15px\" class=\"titleCss\">" + strTitle + "</td>";
        strTable += "<td><img alt=\"\" src=\"" + this.ImagePath + "toptitle2.jpg\" /></td></tr>";
        strTable += "</table>";
        document.write(strTable);
    },
    DrawBottom: function () {
        var strTable = "<table style=\"width: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
        strTable += "<tr class=\"bottomCss\"><td><img alt=\"\" src=\"" + this.ImagePath + "bottom0.jpg\" /></td>";
        strTable += "<td style=\"width:100%\"></td>";
        strTable += "<td><img alt=\"\" src=\"" + this.ImagePath + "bottom2.jpg\" /></td></tr>";
        strTable += "</table>";
        document.write(strTable);
    },
    DrawSBottom: function () {
        var strTable = "<table style=\"width: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
        strTable += "<tr class=\"sBottomCss\"><td><img alt=\"\" src=\"" + this.ImagePath + "sBottom0.jpg\" /></td>";
        strTable += "<td style=\"width:100%\"></td>";
        strTable += "<td><img alt=\"\" src=\"" + this.ImagePath + "sBottom2.jpg\" /></td></tr>";
        strTable += "</table>";
        document.write(strTable);
    },
    DrawPageTop: function () {
        var strTable = "<table style=\"width: 750px; background-color: White; height: 400\" cellpadding=\"0\" cellspacing=\"0\">";
        strTable += "<tr style=\"height: 6px\"><td style=\"width: 6px\"></td><td style=\"width: 738px\"></td>";
        strTable += "<td style=\"width: 6px; background-color: #999999\"></td></tr><tr style=\"height: 388px\">";
        strTable += "<td colspan=\"2\" style=\"padding: 25 45 35 45\" valign='top'>";
        document.write(strTable);
    },
    DrawPageBottom: function () {
        var strTable = "</td><td style=\"background-color: #686868\"></td>";
        strTable += "</tr><tr style=\"height: 6px\"><td style=\"background-color: #999999\"></td><td style=\"background-color: #686868\"></td>";
        strTable += "<td style=\"background-color: #686868\"></td></tr></table>";
        document.write(strTable);
    }
};