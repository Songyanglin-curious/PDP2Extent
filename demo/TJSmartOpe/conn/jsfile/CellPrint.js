//CellPrint.js -- edit by gud 20120727
function CellPrint(cell, cllfile) {
    this.cellctrl = cell;
    this.cellfile = cllfile;
    this.GetContentById = function (id) {
        return document.getElementById(id);
    }
    /////
    this.content = null;
    this.fillContent = function (content) {
    }
    this.fillBegin = function (content) { }
    this.fillFinished = function (template) { }
    this.doFill = function () {
        var n = this.cellctrl.OpenFile(this.cellfile, "");
        if (n < 1) {
            alert("打开模板文件失败，错误码：" + n);
            return;
        }

        var content = new C_FillContent();
        this.fillContent(content);
        this.fillBegin(content);

        this.cellctrl.CloseFile();
        initCell(this.cellctrl);

        var template = content.fillCell(this.cellctrl, null, this.GetContentById);
        this.fillFinished(template);
        this.content = content;
        return template;
    }
    this.doPrint = function (prttype) {
        this.doFill(this.cellctrl);
        switch (prttype) {
            case 0:
                this.cellctrl.PrintPreview(1, this.cellctrl.GetCurSheet());
                break;
            case 2:
                var bk = exportBackup(this.cellctrl);
                //this.cellctrl.ExportExcelDlg();
                Ysh.CC2000.exportExcel(this.cellctrl);
                exportRestore(this.cellctrl, bk);
                break;
            case 3:
                this.cellctrl.ExportCSVFile("test.csv", 0);
                break;
            default:
                this.cellctrl.PrintSheet(1, this.cellctrl.GetCurSheet());
                break;
        }
    }
}
