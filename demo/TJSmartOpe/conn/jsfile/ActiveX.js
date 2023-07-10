//显示甘特图控件
function showGantte() {
    document.write("<object id=\"oGantte\" style=\"left: 0px; top: 0px\" codebase=\"/conn/cabfile/activet.cab#Version=1,1,9,114\" height=\"100%\" width=\"100%\" classid=\"clsid:DDD6DC67-8A23-447F-B354-BD8DD7676656\" viewastext>");
    document.write("<param name=\"_Version\" value=\"65536\" />");
    document.write("<param name=\"_ExtentX\" value=\"27781\" />");
    document.write("<param name=\"_ExtentY\" value=\"9260\" />");
    document.write("<param name=\"_StockProps\" value=\"0\" />");
    document.write("</object>");
}
//显示图形控件
function showGraph() {
    document.write("<object id=\"act_PsgpGraph\" style=\"left: 0px; top: 0px; margin: 0px\" codebase=\"/conn/cabfile/activepsgp.cab#version=3,1,14,228\" height=\"100%\" width=\"100%\" classid=\"clsid:B5E43C8C-B44D-43B7-BBCA-52E331EAD055\" viewastext>");
    document.write("<param name=\"_Version\" value=\"65536\" />");
    document.write("<param name=\"_ExtentX\" value=\"4577\" />");
    document.write("<param name=\"_ExtentY\" value=\"4577\" />");
    document.write("<param name=\"_StockProps\" value=\"0\" />");
    document.write("</object>");
}

//显示Cell控件
function showCell(id) {
    if (!id)
        id = "oCell";
    if (document.getElementById(id))
        return;
    document.write("<object id=\"" + id + "\" style=\"left: 0px; top: 0px\" codebase=\"/conn/cabfile/cellweb5.cab#Version=5,3,9,13\" height=\"100%\" width=\"100%\" classid=\"clsid:3F166327-8030-4881-8BD2-EA25350E574A\" name=\"oCell\">");
    document.write("<param name=\"_Version\" value=\"65536\" />");
    document.write("<param name=\"_ExtentX\" value=\"15875\" />");
    document.write("<param name=\"_ExtentY\" value=\"16933\" />");
    document.write("<param name=\"_StockProps\" value=\"0\" />");
    document.write("</object>");
}

//显示单点登录控件
function showDomain() {
    document.write("<object id=\"oDomain\" style=\"left: 0px; top: 0px\" codebase=\"/conn/cabfile/DomainControl.cab#version=1,0,0,2\" height=\"100%\" width=\"100%\" classid=\"clsid:9351C7DE-7867-4360-8EEC-9054C22734EF\" viewastext>");
    document.write("</object>");
}
//初始化甘特图
function initGantte(objGant, arrCols) {
    var act_Cols = parseCol(arrCols);

    objGant.SetTypeItem("_GrpBarType", "2");
    objGant.SetTypeItem("_GanttGridType", "1");
    objGant.SetTypeItem("_GanttGridAutoRelaSelect", "1");
    objGant.SetTypeItem("_GanttRowHeight", "40");
    objGant.SetTypeItem("_GanttGridGraphRate", "98");
    objGant.SetTypeItem("_GanttGridselectbgColor", "#ACAEB8");
    objGant.SetTypeItem("_GanttGridselectColor", "#acb9c1");
    objGant.SetTypeItem("_GraphicVisable", "1");
    objGant.SetTypeItem("_GanttGridFixedbdColor", "#EFF3F6");

    SetGantteTemplate(objGant, 1, 1, 40, 40, act_Cols);
}

function parseCol(arrCols) {
    var act_Cols = new Array();
    var arrName = new Array();
    var actCol = null;

    for (var i = 0; i < arrCols.length; i++) {
        var arr = arrCols[i];
        if (arr == null)
            return null;
        arrName = new Array();
        arrName.push(arr[0]);
        actCol = new FillGantteCol(arr[1], arrName, (arr[2] ? arr[2] : "center"), (arr[3] ? arr[3] : "middle"));
        act_Cols.push(actCol);
    }
    return act_Cols;
}

//甘特图右键菜单
function menuGannte(mOrder, mName, mShow, bFlag, mOrderExt, mNameExt) {
    this._Order = mOrder;
    this._Name = mName;
    this._Show = mShow;
    this._Flag = bFlag;
    this._OrderExt = mOrderExt;
    this._NameExt = mNameExt;
}