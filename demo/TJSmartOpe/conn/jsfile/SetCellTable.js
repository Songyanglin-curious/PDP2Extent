// JScript 文件
    function setWidth(div,table)
    {
        var argNum = arguments.length;
        var divId="divWidth";
        var tableId="tbl";
        if (argNum>=1)
            divId=div;
        if (argNum>=2)
            tableId=table;
        var div=document.getElementById(divId);
        var table=document.getElementById(tableId);
        var body=document.getElementsByTagName("body")[0];
        var ScreenWidth=window.screen.width;
        div.style.width=body.clientWidth-10;
        table.style.width=body.clientWidth-40;
    }
    function setTableColor(startRowIndex,tableID)
    {
        tableID.rows[0].cells[0].style.color="#012c6d"
        for(var i=startRowIndex;i<tableID.rows.length;i++)
        {
            for(var j=0;j<tableID.rows[i].cells.length;j++)
            {
                tableID.rows[i].cells[j].style.backgroundColor="";
                tableID.rows[i].cells[j].style.color="#012c6d";
            }
            tableID.rows[i].className =i%2==1?"TR_ALTERNATE_1":"TR_ALTERNATE_2" ;
        }
    }
    //前面有合并行的table染色
    function setTableSpecila(startRowIndex,colNum,tableID) //起始行，共几行染色，table
    {
        var rowSpecial=[];
        tableID.rows[0].cells[0].style.color="#012c6d";
        for(var i=0;i<tableID.rows.length;i++)
        {
            for(var j=0;j<tableID.rows[i].cells.length;j++)
            {
                tableID.rows[i].cells[j].style.color="#012c6d";
            }
        }
        for(var i=startRowIndex;i<tableID.rows.length;i++)
        {
            var col=tableID.rows[i].cells.length;
            if(col<colNum)
            {
                rowSpecial.push(i);
                continue;
            }for(var j=col;j>col-colNum;j--)
            {
                tableID.rows[i].cells[j-1].style.backgroundColor=i%2==1?"white":"#DDE4EA";
            }
        }
        return rowSpecial
    }
    function setCellTableStyle(cellName,tblName) {
        this.cell = cellName;
        this.table=tblName;
        this.alterRow1="white";
        this.alterRow2="#DDE4EA";
        this.alterRow3="#F0FFFF";
        this.alterRow4="#F0FFFF";
        this.commonStyle=function(){this.setFoot();this.setHead();this.setFont();this.setOtherStyle()}
        this.setFoot = function() { this.cell.PrintSetFoot("","第 &P 页",""); }                //设置页脚 
        this.setHead=function(){ this.cell.PrintSetHeaderFont(this.cell.FindFontIndex( "宋体",1),11,2,-1); }//设置页脚字体
        this.setFont=function(){ 
            for(var r=0;r<this.table.rows.length;r++){
                for(var c=0;c<this.table.rows[r].cells.length;c++){
                    this.table.rows[r].cells[c].style.color="#012c6d"; 
                }
            }
        }
        //cell字体大小 行高 自动换行
        this.setCell=function(){
            for(var r=0;r<this.cell.GetRows(0);r++){
                for(var c=0;c<this.cell.GetCols(0);c++){
                 this.cell.SetCellFontSize(c,r,0,9);
                 this.cell.SetCellTextStyle(c,r,0,2);  //自动换行
                }
                  this.cell.SetRowHeight(1,25,r+1,0); 
            } 
        }
        
        this.setAlterRow=function(beginRow,rowCount){                                             //设置隔行变色 默认又开始行到结尾；有两个参数时 开始行，行个数。
            var endRow=arguments.length==1?this.table.rows.length:beginRow+rowCount;
            for(var r=beginRow;r<endRow;r++){
                for(var i=0;i<this.table.rows[r].cells.length;i++){
                        this.table.rows[r].cells[i].style.backgroundColor=(r%2==1?this.alterRow1:this.alterRow2);
                }
            }
        }
        this.setAlterThreeRow=function(beginRow,rowCount){                                             
            var endRow=arguments.length==1?this.table.rows.length:beginRow+rowCount;
            for(var r=beginRow;r<endRow;r++){
                for(var i=0;i<this.table.rows[r].cells.length;i++){
                        this.table.rows[r].cells[i].style.backgroundColor=(r%3==1?this.alterRow3:(r%3==2?this.alterRow2:this.alterRow1));
                }
            }
        }
        this.setAlterNRow=function(beginRow,alterNum,arrColor){                                             
            var endRow=this.table.rows.length;
            for(var r=beginRow;r<endRow;r++){
                for(var i=0;i<this.table.rows[r].cells.length;i++){
                        var alterIndex=r%alterNum;
                        this.table.rows[r].cells[i].style.backgroundColor=arrColor[alterIndex];
                }
            }
        }
        this.setOtherStyle=function(){}
        this.tableTdWidth=function(){ 
            var div=document.getElementById("divWidth");
            var table=document.getElementById("tbl");
            var tdWidth="";
            for(var r=0;r<table.rows.length;r++){
               for(var c=0;c<table.rows[r].cells.length;c++){
                    tdWidth=div.clientWidth/table.rows[r].cells.length;
                    tbl.rows[r].cells[c].style.width=tdWidth;
               }
            }
        }
        this.setColWidth=function(pageWidth,arrSpec){
            var colNum=0;
            for(var i=1;i<this.cell.GetCols(0);i++)
            {
                colNum=this.cell.IsColHidden(i,0)==1?colNum:colNum+1;
            }
            var argNum = arguments.length;
            if(argNum>=2)
            {
                for(var i=0;i<arrSpec.length;i++)
                {
                    this.cell.SetColWidth(1,arrSpec[i][1],arrSpec[i][0],0);
                    colNum=colNum-1;
                    pageWidth=pageWidth-arrSpec[i][1];
                }
            }
            var colWidth=pageWidth/colNum;
            for(var i=1;i<this.cell.GetCols(0);i++)
            {
                if(argNum>=2&&this.isSpeiclCol(i,arrSpec))
                    continue;
                if(this.cell.IsColHidden(i,0)==0)
                {
                   this.cell.SetColWidth(1,colWidth,i,0);
                }
            }
       }
       this.isSpeiclCol=function(colNum,arrSpec){
            for(var i=0;i<arrSpec.length;i++)
            {
                if(colNum==arrSpec[i][0])
                    return true;
            }
            return false;
       }
    }
    function getFunctionScript(cellName)
    {
    var str="function PrintViewClick(){var page = example.GetCurSheet();example.PrintPreviewEx(0,page,false);}";
    str+="function PrintClick(){var page = example.GetCurSheet();example.PrintSheet(1,page);}";
    str+="function ExportToExcell(){var fanHui=example.ExportExcelDlg();if(fanHui==1)alert('导出成功');}";
    str=str.replace(/example/g,cellName);
    return str;
    }
    function addDanWei(myCell,col,row,strDanWei)
    {
        var cellstr=myCell.GetCellString(col,row,0);
        myCell.SetCellString(col,row,0,cellstr+"("+strDanWei+")");
    }