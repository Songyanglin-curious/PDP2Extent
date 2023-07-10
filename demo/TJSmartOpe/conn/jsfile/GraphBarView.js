//图形工具条组件
//by popduke 111109
var divGraphBarView;//bar所在div
var strGraphBarImageUrl = "/i/toolbargraph/";//bar中图片来源
var m_imgGraphBar;//当前bar中选择的图片

function GetGraphZoomOperate() {
    var txtZoom = document.createElement("<input type='text' style='width:100px;' />");
    txtZoom.id = "txtGraphZoom";
    txtZoom.onkeydown = function () {
        if (event.keyCode == 13) { txtZoom_Blur(); return false };
    }
    txtZoom.onblur = function () {
        return txtZoom_Blur();
    }
    return txtZoom;
}
function SetFactorNum() {
    var fZoom = m_pPsgpActive.GetViewTypeItem(m_pPsgpActive.GetCurrGraphId(), "_ZoomFactor");
    if (fZoom && $("#txtGraphZoom"))
        $("#txtGraphZoom").val((parseFloat(fZoom) * 100.0).toFixed(2));
}
function txtZoom_Blur() {
    if (isNaN($("#txtGraphZoom").val()))
        SetFactorNum();
    else
        OnZoomfactor(parseFloat($("#txtGraphZoom").val()) / 100);
}

function GetGraphOperateSpater(tr) {
    tr.insertCell(-1).innerHTML = "&nbsp;|&nbsp;";
}
function GraphBarMousedown() {
    ClearGraphBarClick();
    m_imgGraphBar = event.srcElement;
    m_imgGraphBar.src = m_imgGraphBar.src.split("_")[0] + "_1.bmp";
}

function GetGraphBarOperateDiv(tr, strFunction, strTitle, strImageUrl, bClick) {
    var div = document.createElement("<div align='center' style='width: 23px; margin: 0'></div>");
    div.innerHTML = "<img alt='' onclick=\"return " + strFunction + "\" title='" + strTitle + "'" + (bClick ? "" : " onmousedown='GraphBarMousedown()'") + " onmouseout='this.border=0' onmouseover=\"this.border='1 solid black'\" src='" + strGraphBarImageUrl + strImageUrl + "' style='height: 21px' />";
    tr.insertCell(-1).appendChild(div);
}
function GraphBarSetOperate(divOperate) {
    if (divOperate) divGraphBarView = divOperate;
    var tblOperate = document.createElement("TABLE");
    tblOperate.style.width = "100%";
    tblOperate.style.height = "100%";
    tblOperate.style.margin = "0";
    tblOperate.cellSpacing = 0;
    tblOperate.cellPadding = 0;
    divGraphBarView.appendChild(tblOperate);
    var tr = tblOperate.insertRow(-1);
    tr.style.backgroundColor = "#eaeff2";
    tr.insertCell(-1).appendChild(GetGraphLayerOperate());
    GetGraphOperateSpater(tr);
    tr.insertCell(-1).appendChild(GetGraphZoomOperate());
    GetGraphBarOperateDiv(tr, "OnZoomView('zoomin')", "放大", "zoomin_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "OnZoomView('zoomout')", "缩小", "zoomout_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "OnZoomView('zoomall')", "显示全屏", "zoomall_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "OnZoomView('ZoomToFitPageWidth')", "等宽", "zoomwidth_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "OnZoomView('ZoomToFitPageHeight')", "等高", "zoomheight_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "OnZoomfactor('1')", "100%", "zoom_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "OnZoomView('ZoomToFitSelect')", "完全显示选中图元", "zoomfree_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "OnZoomView('ZoomRect')", "选区放大", "zoomrect_2.bmp");
    GetGraphBarOperateDiv(tr, "OnZoomView('TOOL_SCROLL')", "平移", "pingyi_2.bmp");
    GetGraphOperateSpater(tr);
    //GetGraphBarOperateDiv(tr, "ChangeStateMode()", "调整方式", "tzfs_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "RefreshState()", "刷新带电状态", "refresh_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "ChangeEditMode()", "编辑态运行态切换", "changemode_2.bmp", 1);
    GetGraphOperateSpater(tr);
    GetGraphBarOperateDiv(tr, "m_pPsgpActive.CatchScreen(1)", "截图（CTRL+ALT+X）", "save_2.bmp", 1);
    GetGraphOperateSpater(tr);
    GetGraphBarOperateDiv(tr, "OnEdit('EditCut')", "剪切（CTRL+X）", "cut_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "OnEdit('EditCopy')", "复制（CTRL+C）", "copy_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "OnEdit('EditPaste')", "粘贴（CTRL+V）", "paste_2.bmp", 1);
    tr.insertCell(-1).style.width = "100%";
}
var iEditRefeshed = 1;
function RefreshState() {
    parent.divLoading.style.display = '';
    setTimeout("doRefreshState();parent.divLoading.style.display = 'none';", 1);
}
function doRefreshState() {
    GraphAjax.GetWebServiceReturn("27");
    alert("刷新成功");
    m_pPsgpActive.UpdateWndByData("<_d><_graphId>-1</_graphId><_fromDb>3</_fromDb><_updtype>2</_updtype></_d>");
    iEditRefeshed = 1;
}
//function ChangeStateMode() {
//    var obj = event.srcElement;
//    if (m_bTzfsh == 1 || m_iGraphMode == 1) {
//        m_bTzfsh = 0;
//        obj.alt = "调整方式";
//        obj.src = obj.src.split("_")[0] + "_2.bmp";
//    }
//    else {
//        if (iEditRefeshed == 0)
//            RefreshState();
//        m_bTzfsh = 1;
//        obj.alt = "退出调整";
//        obj.src = obj.src.split("_")[0] + "_1.bmp";
//    }
//}
function ChangeEditMode() {
    OnRunMode(1 - m_iGraphMode);
    event.srcElement.src = event.srcElement.src.split("_")[0] + (m_iGraphMode == 0 ? "_2.bmp" : "_1.bmp");
    if (m_iGraphMode == 0)
        iEditRefeshed = 0;
//    if (m_bTzfsh == 1) {
//        m_bTzfsh = 0;
//        obj = getParentTag(event.srcElement, "TD").previousSibling.previousSibling.firstChild.firstChild;
//        obj.alt = "调整方式";
//        obj.src = obj.src.split("_")[0] + "_2.bmp";
//    }
}
function ClearGraphBarClick() {
    if (m_imgGraphBar) {
        m_imgGraphBar.src = m_imgGraphBar.src.split("_")[0] + "_2.bmp";
    }
    m_imgGraphBar = null;
}
function MouseRClickBar(iGraphId, iFlag, bDown) {//注意要主动绑定一下
    ClearGraphBarClick();
}
function GraphicViewChgedBar(iGraphId, iFactor, strXML) {
    if (iFactor == 1)
        SetFactorNum();
}