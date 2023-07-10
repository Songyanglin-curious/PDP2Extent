// JScript File
function ReportPrintObj() {
    this.bPrintFilled = false;
    this.filename = "";
    this.content = null;
    this.fillContent = function(content) { }
    this.fillBegin = function(content) { }
    this.fillFinished = function(template) { }
    this.doFill = function(cellctrl) {
        if (!this.bPrintFilled) {
            var n = cellctrl.OpenFile(this.filename, "");
            if (n < 1) {
                alert("打开模板文件失败，错误码：" + n);
                return;
            }
        	
            var content = new C_FillContent();
            this.fillContent(content);
            this.fillBegin(content);
            
	        cellctrl.CloseFile();
            initCell(cellctrl);
            
            var template = content.fillCell(cellctrl,null);
            this.fillFinished(template);
            this.bPrintFilled = true;
            this.content = content;
        }
    }
    this.doPrint = function(cellctrl,prttype) {
    	this.doFill(cellctrl);
        switch (prttype) {
        case 0:
            cellctrl.PrintPreview(1,cellctrl.GetCurSheet());
            break;
        case 2:
            var bk = exportBackup(cellctrl);
            Ysh.CC2000.exportExcel(cellctrl);
            exportRestore(cellctrl,bk);
            break;
        default:
            cellctrl.PrintSheet(1,cellctrl.GetCurSheet());
            break;
        }
    }
    
    this.doFillEx = function(cellctrl,beginCol, colLength, curSheet)    // 添加列；beginCol 指定插入列的位, colLength 追加的长度, curSheet 页数
    {
        if (!this.bPrintFilled) {
            var n = cellctrl.OpenFile(this.filename, "");
            if (n < 1) {
                alert("打开模板文件失败，错误码：" + n);
                return;
            }
	        cellctrl.CloseFile();
	        
//	        if ((beginCol)&&(colLength)&&(curSheet))
                cellctrl.InsertCol(beginCol, colLength, curSheet);	        
            initCell(cellctrl);
        	
            var content = new C_FillContent();
            this.fillContent(content);
            var template = content.fillCell(cellctrl,null);
            this.fillFinished(template);
            this.bPrintFilled = true;
        }
    }
}
    