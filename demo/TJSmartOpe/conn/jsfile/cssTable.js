// JScript 文件
function getTop(strTitle)
{
    var strTable = "<table style=\"width: 100%; height: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr class=\"topTitle\"><td><img alt=\"\" src=\"/i/toptitle0.jpg\" /></td>";
    strTable += "<td style=\"width:100%; padding-left:15px\" class=\"titleCss\">" + strTitle + "</td>";
    strTable += "<td><img alt=\"\" src=\"/i/toptitle2.jpg\" /></td></tr>";
    strTable += "</table>";
    document.write(strTable);
}
function getTitle()
{
    var strTable = "<table style=\"width: 100%; height: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr class=\"topCss\"><td><img alt=\"\" src=\"/i/top0.jpg\" /></td>";
    strTable += "<td style=\"width:100%\" ></td>";
    strTable += "<td><img alt=\"\" src=\"/i/top2.jpg\" /></td></tr>";
    strTable += "</table>";
    document.write(strTable);
}
function getBottom()
{
    var strTable = "<table style=\"width: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr class=\"bottomCss\"><td><img alt=\"\" src=\"/i/bottom0.jpg\" /></td>";
    strTable += "<td style=\"width:100%\"></td>";
    strTable += "<td><img alt=\"\" src=\"/i/bottom2.jpg\" /></td></tr>";
    strTable += "</table>";
    document.write(strTable);
}
function getSBottom()
{
    var strTable = "<table style=\"width: 100%;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">";
    strTable += "<tr class=\"sBottomCss\"><td><img alt=\"\" src=\"/i/sBottom0.jpg\" /></td>";
    strTable += "<td style=\"width:100%\"></td>";
    strTable += "<td><img alt=\"\" src=\"/i/sBottom2.jpg\" /></td></tr>";
    strTable += "</table>";
    document.write(strTable);
}
function getTopPage()
{
    var strTable = "<table id='tblPageBody' style=\"width: 100%; background-color: White; height: 800\" cellpadding=\"0\" cellspacing=\"0\">";
    strTable += "<tr style=\"height: 6px\"><td style=\"width: 6px\"></td><td style=\"width: 738px\"></td>";
    strTable += "<td style=\"width: 6px; background-color: #999999\"></td></tr><tr style=\"height: 788px\">";
    strTable += "<td colspan=\"2\" style=\"padding: 25 45 35 45\" valign='top'>";
    document.write(strTable);
}
function getBottomPage()
{
    var strTable = "</td><td style=\"background-color: #686868\"></td>";
    strTable += "</tr><tr style=\"height: 6px\"><td style=\"background-color: #999999\"></td><td style=\"background-color: #686868\"></td>";
    strTable += "<td style=\"background-color: #686868\"></td></tr></table>";
    document.write(strTable);
}
function getParentCtrl(obj, tagname)
{
    while (obj) {
        if (obj.tagName == tagname)
            return obj;
        obj = obj.parentElement;
    }
    return null;
}
var tempCss;
var tempTr;
function clickRowTemp(tr)
{
    if(tempTr == tr) return;
    if(!tempTr)
    {
        tempTr = tr;
        tempCss = tr.lastChild.className;
    }
    for(var i = 0; i < tr.cells.length; i++)
    {
        if(tempTr.cells(i))
            tempTr.cells(i).className = tempCss;
        tr.cells(i).className = "tempCell";
    }
	tempTr = tr;
}
function PageTable(tblMain, objData, tdPage, pageCount, pageIndex)
{
    objData.value = (objData.value == null ? new Array() : objData.value)
    pageIndex = pageIndex ? pageIndex : 1;
    pageCount = pageCount ? pageCount : 10;
    var pageTotal = Math.ceil(objData.value.length / pageCount);
    if (pageIndex < 1) pageIndex = 1;
    if (pageIndex > pageTotal) pageIndex = pageTotal;
    window.pageIndex = pageIndex;
    
    while(1 < tblMain.rows.length)
        tblMain.deleteRow();        

    for (i = pageCount * (pageIndex - 1); i < pageCount * pageIndex; i++)
    {
        if (i != objData.value.length && objData.value.length > 0)
            AddNewRow(objData.value, i);
        else
            break;
    }

    tdPage.innerHTML = "<a id=firstpage href='#'>首页</a>&nbsp;<a id=prepage href='#'>上一页</a>&nbsp;" 
                          + "<a id=nextpage href='#'>下一页</a>&nbsp;<a id=lastpage href='#'>尾页</a>&nbsp;"
                          + "页次：<font color=red><b>" + pageIndex + "</b></font>/<b>" + pageTotal + "</b>页&nbsp;共<b>" + objData.value.length 
                          + "</b>条记录&nbsp;<b>" + pageCount + "</b>条/页 <a href='#' id=gotopage><font color=blue>转到</font></a> 第<input id=num type='text' value='1' style='width:30px'/>页";
    
    firstpage.disabled = pageIndex == 1;                      
    prepage.disabled = pageIndex == 1;                      
    nextpage.disabled = pageIndex == pageTotal;                      
    lastpage.disabled = pageIndex == pageTotal;                      
    
    if(pageIndex != 1)
    {
        firstpage.attachEvent("onclick", function() { PageTable(tblMain, objData, tdPage, pageCount, 1); });
        prepage.attachEvent("onclick", function() { PageTable(tblMain, objData, tdPage, pageCount, window.pageIndex - 1); });
    }
    if(pageIndex != pageTotal)
    {
        nextpage.attachEvent("onclick", function() { PageTable(tblMain, objData, tdPage, pageCount, window.pageIndex + 1); });
        lastpage.attachEvent("onclick", function() { PageTable(tblMain, objData, tdPage, pageCount, pageTotal); });
    }
    gotopage.attachEvent("onclick", function() { PageTable(tblMain, objData, tdPage, pageCount, document.getElementById("num").value); });
}

function rowClick()
{
    var tr = getParentCtrl(event.srcElement, "TR");
    for(var i = 1; i < tblMain.rows.length; i++)
    {
        if(tblMain.rows(i).cells(0).innerText == tr.cells(0).innerText)
        {
            for(var j = 0; j < tblMain.rows(i).cells.length; j++)
            {
                tblMain.rows(i).cells(j).className = "tempCell";
            }
        }
        else
        {
            var trclassName = (tblMain.rows(i).rowIndex % 2 == 1 ? "trFirst" : "trSecond");
            for(var j = 0; j < tblMain.rows(i).cells.length; j++)
            {
                tblMain.rows(i).cells(j).className = "tbCellboth " + trclassName;
            }
        }
    }
}
//Add By Gud*********************************************************************************************************
function GotoList(url, items) {
    var frm = document.createElement("FORM");
    frm.action = url;
    document.body.appendChild(frm);
    var hdn = document.createElement("INPUT");
    hdn.name = "items";
    hdn.value = items;
    frm.appendChild(hdn);
    frm.submit();
}

function GetCountHTML(n,items,listurl,clr) {
    if (n == 0)
        return "0";
    var txt = "<font color='"+clr+"'>"+n+"</font>"
    if (listurl == "")
        return txt;
    return "<a href='#' onclick='GotoList(\"" + listurl + "\",\"" + items + "\");return true;'>" + txt + "</a>";
}

function ShowBar(args) {
    window.showModalDialog("/BarPaint.aspx?"+args+"&rnd=" + new Date(),"","dialogWidth:1000px;dialogHeight:500px; center:yes; help:no; resizable:no; status:no;scroll:no;");
}
//Add By Gud End *******************************************************************************************************