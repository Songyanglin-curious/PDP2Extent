// JScript File
function ExcelFile(mainTitle,secTitleArr,dataArr)
{
    try
    {
        this._oxl = new ActiveXObject("Excel.Application");
        this._owb = this._oxl.Workbooks.Add();
        this._osheet = this._owb.ActiveSheet;
    } //创建excel应用程序对象
    catch(e)
    {
        alert("您的电脑没有安装Microsoft Excel软件，或禁用了ActiveX控件！")
        return null;
    }
    this._mainTitle = mainTitle;
    this._secTitleArr = secTitleArr;
    this._dataArr = dataArr;
    this._rowCount = 1;
    this.fInitSetting = function(){
        this._osheet.PageSetup.CenterHorizontally=true;//页面水平居中
        this._osheet.PageSetup.Orientation=2; //横向打印   1-纵向,2-横向;
        this._osheet.PageSetup.LeftMargin= 2/0.035;         //页边距 左
        this._osheet.PageSetup.RightMargin = 2/0.035;      //页边距 右
        this._osheet.PageSetup.TopMargin = 1/0.035;        //页边距 上
        this._osheet.PageSetup.BottomMargin = 2/0.035;   //页边距 下
        this._osheet.PageSetup.HeaderMargin = 0/0.035;   //页边距 页眉
        this._osheet.PageSetup.FooterMargin = 1/0.035;    //页边距 页脚
        this._osheet.PageSetup.CenterFooter = '&P/&N';  
    };
    this.fInitMainTitle = function(){
        if(this._mainTitle == "")
            return;
        this._osheet.Rows(this._rowCount).RowHeight = 22;
        this._osheet.Range(this._osheet.Cells(this._rowCount,1),this._osheet.Cells(this._rowCount,this._secTitleArr.length)).MergeCells = true;
        var mainTitle = this._osheet.Cells(1,1);
        mainTitle.Value=this._mainTitle;
        mainTitle.HorizontalAlignment = 3;
        mainTitle.VerticalAlignment = 2;
        mainTitle.Font.Size = 12;
        mainTitle.Font.Bold = true; 
        this._rowCount++;
    }
    this.fInitSecTitle = function(){
        var arr = this._secTitleArr;
        if(arr == null)
            return;
        for(var i=0;i<arr.length;i++)
        {
           var cell = this._osheet.Cells(this._rowCount,i+1);
           cell.Value = arr[i]; //设置标题的内容
           cell.Borders.Weight = 2;
           cell.HorizontalAlignment = 3;
           cell.VerticalAlignment = 2;
           cell.Font.Size = 10;
        }
        this._rowCount++;
    }
    this.fWriteData = function()
    {
        var arr = this._dataArr;
        if(arr == null)
            return;
        for(var i=0;i<arr.length;i++)
        {
            var arrRow = arr[i];
            for(var j=0;j<arrRow.length;j++)
            {
                var cell = this._osheet.Cells(i + this._rowCount,j+1);
                cell.Value = arrRow[j];
                cell.Borders.Weight = 2;
                cell.HorizontalAlignment = 3;
                cell.VerticalAlignment = 2;
                cell.Font.Size = 10;
            }
        }
        this._rowCount = this._rowCount + arr.length;
    }
    this.fInitSetting();
    this.fInitMainTitle();
    this.fInitSecTitle();
    this.fWriteData();
    this._oxl.Visible = true; //设置Excel的属性
    this._oxl.UserControl = true;
    return this;
}
/* 显示显示页内的数据，通过读table td的innerText得到
function GetExcelData() 
{
    var hang = tblDevList.rows.length;         //获取表格有多少行
    var lie = trListTitle.cells.length-3; //获取首行有多少列-多少标题
    var strTitle = "";
    for(var i=0;i<lie;i++)
    {
        strTitle += trListTitle.cells(i+1).innerText + ",";
    }
    document.getElementById("txtTitle").value = strTitle.substr(0,strTitle.length-1);
    var strData = "";
    for(i=0;i<hang;i++)
    {
        var arr = [];
        for(var j=0;j<lie;j++)
        {
            if(tblDevList.rows(i).cells(j+1))
                strData += tblDevList.rows(i).cells(j+1).innerText + ",";
        }
        strData = strData.substr(0,strData.length-1) + "|";
    }
    document.getElementById("txtData").value = strData.substr(0,strData.length-1);
}
*/

//
/*显示所有结果.通过GetDataOfExcel()函数得到 要显示数据的数组，然后转化为字符串型式
function GetExcelData()
{
    var lie = trListTitle.cells.length-3; //获取首行有多少列-多少标题
    var strTitle = "";
    for(var i=0;i<lie;i++)
    {
        strTitle += trListTitle.cells(i+1).innerText + ",";
    }
    document.getElementById("txtTitle").value = strTitle.substr(0,strTitle.length-1);
    var arrData = GetDataOfExcel();
    var strData = "";
    for(var i=0;i<arrData.length;i++)
    {
        var arr = arrData[i];
        for(var j=0;j<arr.length;j++)
            strData += arr[j] +",";
        strData = strData.substr(0,strData.length-1) + "|";
    }
    document.getElementById("txtData").value = strData.substr(0,strData.length-1);
}
*/
//显示所有结果.通过GetStrDataOfExcel()函数得到 要显示数据的字符串型式。从而减少对数组的访问。大量数据时，速度有明显改善
function GetExcelData()
{
    var lie = tblPlan.cells.length-3; //获取首行有多少列-多少标题
    var strTitle = "";
    for(var i=0;i<lie;i++)
    {
        strTitle += trListTitle.cells(i+1).innerText + ",";
    }
    document.getElementById("txtTitle").value = strTitle.substr(0,strTitle.length-1);
    document.getElementById("txtData").value = GetStrDataOfExcel();
}

function GetStrDevState(nStateIndex)
{
    return nStateIndex=="0" ? "正常" : "作废";
}
// 得到搜索到的结果中作废设备的总数
function GetFeiDevCount(nIndex)
{
    var nFeiCount = 0;
    for(var i=0;i<arrRe.length;i++)
    {
        var arr = arrRe[i];
        if(arr[nIndex]!="4" && arr[nIndex] != "作废")
            continue;
        nFeiCount++;
    }
    return nFeiCount;
}
//跳转到页面 nPageIndex 从0开始
function GoToPage(nPageIndex)
{
     try
     {
         divList.innerHTML = "<table id='tblDevList' cellspacing='1' cellpadding='0' border='0'>"+ GetDataHTMLByPageIndex(nPageIndex) + "</table>";;
         divPageNo.innerHTML = SP_GetPageNoHTML(nPageCount,nPageIndex,"GoToPage");
         loading.style.display="none";
     }
     catch(e)
     {
        GoToPage(0);
     }
}
function GetDataHTMLByPageIndex(nPageIndex)
{
    var strData = "";
    var nStartIndex = nPageIndex > (nPageCount-1) ? 0 : nPageIndex*nRowsCount;
    var nEndIndex = Math.min(nStartIndex + nRowsCount ,arrRe.length);
    
    for(var i=nStartIndex;i<nEndIndex;i++)
    {
        strData += GetDataRowHTML(arrRe[i]);
    }
    return strData;
}
