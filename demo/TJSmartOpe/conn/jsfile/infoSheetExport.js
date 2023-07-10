function ExpData(sumtable, yxData, ycData, ykData, gjData, yxolData, ycolData, avcData, staData, itemNum, bUpload, fSetStyle) {
    Ysh.Web.Loading(function () { doExpData(sumtable, yxData, ycData, ykData, gjData, yxolData, ycolData, avcData, staData, itemNum, bUpload, fSetStyle); }, "正在导出");
}
function doExpData(sumtable, yxData, ycData, ykData, gjData, yxolData, ycolData, avcData, staData, itemNum, bUpload, fSetStyle) {
    var myCell = document.getElementById("oCell");
    var bCheck = staData && staData.length > 0;
    var cllName = bCheck ? "SignalCheck.cll" : "newSigAll.cll";
    var path = "/conn/cllfile/" + cllName;
    var n = myCell.OpenFile(path, "");
    if (n < 1) {
        alert("打开模板文件失败，错误码：" + n);
        return;
    }
    //if (!bCheck)
        //bindTableToCellSheet(myCell, 0, sumtable);

    var content = new C_FillContent();
    FillYX(myCell, content, yxData, bCheck);
    FillYC(myCell, content, ycData, bCheck);
    FillYK(myCell, content, ykData, bCheck);
    FillGJ(myCell, content, gjData, bCheck);
    FillAVC(myCell, content, avcData, bCheck);
    FillSta(myCell, content, staData, bCheck);
    if (!bCheck) {
        FillYXOL(myCell, content, yxolData, bCheck);
        FillYCOL(myCell, content, ycolData, bCheck);
    }
    myCell.SetCurSheet(0);
    if (typeof fSetStyle == "function")
        fSetStyle(myCell, [yxData, ycData, ykData, gjData, yxolData, ycolData]);
    if (bUpload && itemNum != undefined)
        return ExportExcelFtp(myCell, itemNum);
    else
        Ysh.CC2000.exportExcel(myCell, null, staName + "监控信息表.xls");
    myCell.CloseFile();
    return false;
}
function ExportExcelFtp(myCell, itemNum) {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var tmppath = fso.GetSpecialFolder(2);
    if (tmppath != "") {
        var fileName = itemNum + ".xls";
        var strReturn = myCell.ExportExcelFile(tmppath + "\\" + fileName, -1);
        if (strReturn == "1") {
            return UploadFile(fso, tmppath, fileName);
        }
        else {
            return "";
        }
    }
    return "";
}

function UploadFile(fso, tmppath, fileName) {
    var o = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.CommonOpe.GetFtpConfig", []); });
    if (!o.check("获取FTP配置", true))
        return false;
    var ftpConfig = o.value;
    var batFile = CreateBat(fso, tmppath);
    var wsh = new ActiveXObject("WScript.Shell");
    var result = wsh.run(batFile + " " + ftpConfig.FtpIp + " " + ftpConfig.FtpUseId + " " + ftpConfig.FtpPassword + " " + tmppath + " " + ftpConfig.FtpRemotePath + " " + fileName, 0, true);
    DeleteFile(fso, tmppath, fileName);
    return ftpConfig.FtpIp + "/" + ftpConfig.FtpRemotePath + "/" + fileName;
}

function CreateBat(fso, tmppath) {
    if (!fso.FileExists(tmppath + "\\UploadFile.bat")) {
        var tf = fso.createtextfile(tmppath + "\\UploadFile.bat", true);
        tf.WriteLine("@echo off");
        tf.WriteLine("set ftpfilename=autoftp.cfg");
        tf.WriteLine("echo open %1>\"%ftpfilename%\"");
        tf.WriteLine("(echo %2)>>\"%ftpfilename%\"");
        tf.WriteLine("(echo %3)>>\"%ftpfilename%\"");
        tf.WriteLine("echo bin>>\"%ftpfilename%\"");
        tf.WriteLine("echo prompt>>\"%ftpfilename%\"");
        tf.WriteLine("echo lcd %4>>\"%ftpfilename%\"");
        tf.WriteLine("echo cd %5>>\"%ftpfilename%\"");
        tf.WriteLine("echo mput %6>>\"%ftpfilename%\"");
        tf.WriteLine("echo close>>\"%ftpfilename%\"");
        tf.WriteLine("echo quit>>\"%ftpfilename%\"");
        tf.WriteLine("ftp -s:\"%ftpfilename%\"");
        tf.WriteLine("del \"%ftpfilename%\"");
        tf.Close();
    }
    return tmppath + "\\UploadFile.bat";
}

function DeleteFile(fso, tmppath, fileName) {
    if (fso.FileExists(tmppath + "\\" + fileName)) {
        fso.DeleteFile(tmppath + "\\" + fileName)
    }
}

function bindTableToCellSheet(myCell, sheet, tbl) {
    myCell.SetCurSheet(sheet);
    if (tbl && tbl.tagName == "TABLE")
        CB_BindTable(myCell, tbl);
}

function FillYX(myCell, content, yxData, bCheck) {
    myCell.SetCurSheet(bCheck ? 1 : 0);
    content.add("staname", staName, null);
    for (var i = 0; i < yxData.length; i++) {
        content.add("col" + i, yxData[i], null);
    }
    content.fillCell(myCell, null);
}

function FillYXOL(myCell, content, yxolData, bCheck) {
    myCell.SetCurSheet(bCheck ? 5 : 4);
    content.add("staname", staName, null);
    for (var i = 0; i < yxolData.length; i++) {
        content.add("col" + i, yxolData[i], null);
    }
    content.fillCell(myCell, null);
}

function FillYC(myCell, content, ycData, bCheck) {
    myCell.SetCurSheet(bCheck ? 2 : 1);
    content.add("staname", staName, null);
    for (var i = 0; i < ycData.length; i++) {
        content.add("col" + i, ycData[i], null);
    }
    content.fillCell(myCell, null);
}

function FillYCOL(myCell, content, ycolData, bCheck) {
    myCell.SetCurSheet(bCheck ? 6 : 5);
    content.add("staname", staName, null);
    for (var i = 0; i < ycolData.length; i++) {
        content.add("col" + i, ycolData[i], null);
    }
    content.fillCell(myCell, null);
}

function FillYK(myCell, content, ykData, bCheck) {
    myCell.SetCurSheet(bCheck ? 3 : 2);
    content.add("staname", staName, null);
    for (var i = 0; i < ykData.length; i++) {
        content.add("col" + i, ykData[i], null);
    }
    content.fillCell(myCell, null);
}
function FillGJ(myCell, content, gjData, bCheck) {
    myCell.SetCurSheet(bCheck ? 4 : 3);
    content.add("staname", staName, null);
    for (var i = 0; i < gjData.length; i++) {
        content.add("col" + i, gjData[i], null);
    }
    content.fillCell(myCell, null);
}

function FillAVC(myCell, content, avcData, bCheck) {
    if (!bCheck)
        return false;
    myCell.SetCurSheet(5);
    for (var i = 0; i < avcData.length; i++) {
        content.add("col" + i, avcData[i], null);
    }
    content.fillCell(myCell, null);
}

function FillSta(myCell, content, staData, bCheck) {
    if (!bCheck)
        return false;
    myCell.SetCurSheet(0);
    content.add("voltage", staData[0], null);
    content.add("staname", staData[1], null);
    content.add("checkuser", staData[2], null);
    content.add("checktime", staData[3], null);
    content.fillCell(myCell, null);
}

function ExportExcel(staid, itemid, srctype, versionid, check, staName) {
    Ysh.Web.Loading(function () { doExportExcel(staid, itemid, srctype, versionid, check, staName) }, "正在导出");
}

function doExportExcel(staid, itemid, srctype, versionid, check, staName) {
    var fileName = staName + "监控信息表.xls";
    window.open("ExportExcel/ExportExcel.aspx?staid=" + staid + "&itemid=" + itemid + "&srctype=" + srctype + "&versionid=" + versionid + "&check=" + check + "&staname=" + escape(staName) + "&filename=" + escape(fileName));
}