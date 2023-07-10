// JScript 文件

function FillGantteCol(w, arrName, alignclass, valignclass, bSort, iType, iEdit)//列宽和标题对象
{
    this.ColWidth = w;
    this.ColName = arrName;
    this.ColAlign = alignclass;
    this.ColVAlign = valignclass;
    this.ColSort = bSort;
    this.iType = iType ? iType : 1;
    this.iEdit = iEdit ? iEdit : 1;
}

function RowTime(rowid, rowtime) {
    this.rid = rowid;
    this.rtime = rowtime;
}

var allRowTime = new Array();

function GetStartDate(rowid)//得到目标行的开始时间
{
    var reValue = "";
    for (var i = 0; i < allRowTime.length; i++) {
        if (allRowTime[i].rid == rowid) {
            if (allRowTime[i].rtime[0] != "")
                reValue = allRowTime[i].rtime[0];
            else
                if (allRowTime.length > 1 && allRowTime[i].rtime[1] != "" && CompareDate(reValue, allRowTime[i].rtime[1]))
                    reValue = allRowTime[i].rtime[1];
            break;
        }
    }
    if (reValue != "")
        return reValue;
    return "2100-12-30";
}
function GetStartDate_OneTime(rowid) {
    for (var i = 0; i < allRowTime.length; i++)
        if (allRowTime[i].rid == rowid)
            return allRowTime[i].rtime[0];
    return '2100-12-30';
}
function InitGantte(gantte, type) {
    with (gantte) {
    }
}
//甘特图右键菜单
function MenuList(mCmd, mName, mShow, mFunction) {
    this._Cmd = mCmd;
    this._Name = mName;
    this._Show = mShow;
    this._Func = mFunction;
}

//设置模板，参数分别为（目标图，预设列数，预设行数，预设行高，行高，列宽和标题对象）
function SetGantteTemplate(gantte, fCol, fRow, fixHeight, dHeight, arrCol, bLeftRow) {
    var strtitle = "<_type>";
    strtitle += "<_fixedrowcount>" + fCol + "</_fixedrowcount>";
    strtitle += "<_fixedcolcount>" + fRow + "</_fixedcolcount>";
    strtitle += "<_row defaultheight='" + dHeight + "'>";
    for (var i = 0; i < fRow; i++)
        strtitle += "<r" + i + " height='" + fixHeight + "' />";
    strtitle += "</_row><_col align='left' valign='top' multiline='1' font-family='宋体' color='0' borderColor='#acb9c1' marginLeft='1' marginRight='1' marginTop='1' marginBottom='0'>";
    var wid = 15;
    if (!bLeftRow)
        wid = 0;
    for (var i = 0; i < fCol; i++)
        strtitle += "<c0 id='_Fix_GantteCol" + i + "' width='" + wid + "'  bgcolor='#444444'><fixed><d align='center' valign='middle' multiline='0'></d></fixed></c0>";
    for (var i = 0; i < arrCol.length; i++) {
        strtitle += "<c1 id='_Fill_GantteCol" + i + "'" + (i == 0 ? " selectbgcolor='#ACAEB8'" : "") + " width='" + arrCol[i].ColWidth + "'  minwidth='5' multiline='1' vAlign='" + (arrCol[i].ColVAlign ? arrCol[i].ColVAlign : "middle") + "' align='" + (arrCol[i].ColAlign ? arrCol[i].ColAlign : "left") + "'>";
        for (var j = 0; j < fRow; j++)
            strtitle += "<fixed><d align='center' valign='middle' multiline='1' bold='1' bgcolor='#EFF3F6' color='#444444'>" + arrCol[i].ColName[j] + "</d></fixed>";
        strtitle += "</c1>";
    }
    strtitle += "</_col><_mergecell class='colspan'>";

    for (var i = 0; i < arrCol.length; i++)
        strtitle += "<d>_Fill_GantteCol" + i + "</d>";
    strtitle += "</_mergecell><_sortcol>";

    for (var i = 0; i < arrCol.length; i++) {
        if (arrCol[i].ColSort)
            strtitle += "<d asc='2'>_Fill_GantteCol" + i + " </d>";
    }
    strtitle += "</_sortcol></_type>";
    gantte.SetTypeItem("_GanttGridTemplate", strtitle);
    gantte.SetTypeItem("_GanttGridFixedbdColor", "#c0c0c0");
}
//加入行，参数分别为(目标图，行id，时间条（双条为四个点），组id（限菱形和网络图），描述（限网络图），左侧行字符串组,字体颜色,树纵深)rownum:行号
function FillGatteRow(gantte, rowid, arrTime, groupid, netdscrptn, FillContent, strColor, treel, rownum) {//组是把表绑定组
    var strRow = "<_type>";
    if (arrTime == null || FillContent.length == 1)
        strRow += "<_mergeclass>colspan</_mergeclass>";
    if (rowid != null)
        strRow += "<_RowID>" + rowid + "</_RowID>";
    if ((arrTime != null) && (arrTime.length != 0)) {
        allRowTime.push(new RowTime(rowid, arrTime));
        if (gantte.GetTypeItem("_GrpBarType") == "2")
            arrTime[1] = arrTime[0];
        strRow += "<_pDt0>" + arrTime[0] + "</_pDt0><_pDt1>" + arrTime[1] + "</_pDt1>";
        if (gantte.GetTypeItem("_GrpBarType") == "1" && arrTime.length == 2) {
            arrTime.push(arrTime[0]);
            arrTime.push(arrTime[1]);
        }
        if (arrTime.length == 4)
            strRow += "<_rDt0>" + arrTime[2] + "</_rDt0><_rDt1>" + arrTime[3] + "</_rDt1>";
    }
    if (groupid != null)
        strRow += "<_RowGroup>" + groupid + "</_RowGroup>";
    if (netdscrptn != null)
        strRow += "<_RowNetDscrptn>" + netdscrptn + "</_RowNetDscrptn>";

    strRow += "<_GrpBarTopClr>1675436</_GrpBarTopClr>";

    if (strColor == null)
        strColor = "0";
    var dbgColor;

    if (rownum != null)
        dbgColor = rownum % 2 == 0 ? "#d1dee6" : "#e6ebee";
    for (var i = 0; i < FillContent.length; i++) {
        strRow += "<_Fill_GantteCol" + i + "><d " + (dbgColor == null ? "" : ("bgcolor='" + dbgColor + "'")) + " color='" + strColor + "'><![CDATA[" + FillContent[i] + "]]></d></_Fill_GantteCol" + i + ">";
    }
    if (treel != null)
        strRow += "<_TreeL>" + treel + "</_TreeL>";
    strRow += "</_type>";
    gantte.AddRowPrimary(strRow);
}
function AddGantteMinor(gantte, minorid, arrTime, arrColor) {
    var strRow = "<_type><_MinorId>" + minorid + "</_MinorId>";
    strRow += "<_pDt0>" + arrTime[0] + "</_pDt0><_pDt1>" + arrTime[1] + "</_pDt1>";
    if (arrTime.length == 4)
        strRow += "<_rDt0>" + arrTime[2] + "</_rDt0><_rDt1>" + arrTime[3] + "</_rDt1>";
    if (arrColor != null)
        strRow += "<_GrpBarTopClr>" + arrColor[0] + "</_GrpBarTopClr>";
    if (arrColor.length == 2)
        strRow += "<_GrpBarBtmClr>" + arrColor[1] + "</_GrpBarBtmClr>";
    strRow += "</_type>";
    gantte.AddRowMinor(strRow);
}
function AddTopGantteMinor(gantte, minorid, starttime, endtime, color) {
    var strRow = "<_type><_MinorId>" + minorid + "</_MinorId>";
    strRow += "<_pDt0>" + starttime + "</_pDt0><_pDt1>" + endtime + "</_pDt1>";
    strRow += "<_GrpBarTopClr>" + GetRGBColor(color) + "</_GrpBarTopClr>";
    strRow += "</_type>";
    gantte.AddRowMinor(strRow);
}

function AddBottomGantteMinor(gantte, minorid, starttime, endtime, color) {
    var strRow = "<_type><_MinorId>" + minorid + "</_MinorId>";
    strRow += "<_rDt0>" + starttime + "</_rDt0><_rDt1>" + endtime + "</_rDt1>";
    strRow += "<_GrpBarBtmClr>" + GetRGBColor(color) + "</_GrpBarBtmClr>";
    strRow += "</_type>";
    gantte.AddRowMinor(strRow);
}

function AddGantteGroup(gantte, groupid, netdscrptn) {
    gantte.AddRowGroup("<_type><_RowGroup>" + groupid + "</_RowGroup><_GroupNetDscrptn>" + netdscrptn + "</_GroupNetDscrptn></_type>");
}
function GetRGBColor(color) {
    var colorTemp = color.substr(1);
    while (colorTemp.length < 6) {
        colorTemp = "0" + colorTemp;
    }
    var r = parseInt(colorTemp.substr(0, 2), 16);
    var g = parseInt(colorTemp.substr(2, 2), 16);
    var b = parseInt(colorTemp.substr(4), 16);
    return (b << 16) + (g << 8) + r;
}