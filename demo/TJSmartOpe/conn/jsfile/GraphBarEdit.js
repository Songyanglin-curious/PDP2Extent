//图形工具编辑组件
//by popduke 111109
if (!window.strGraphBarImageUrl)
    alert("没有找到图形工具列表，无法加载图形工具编辑组件");

function ChangeEditMode() {//复写图形工具列表中的状态变化方法
    if (parent.m_GraphConfig.IsViewSchemeMode)
        return false;
    if (m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getsketchcreatetype") != "0") {
        var viewGraphId = m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getidcorrespondence");
        if (viewGraphId != "0") {
            m_pPsgpActive.CloseGraphic("<_d><_graphId>" + m_pPsgpActive.GetCurrGraphId() + "</_graphId></_d>");
            m_pPsgpActive.OpenGraphic("<_d><_graphId>" + viewGraphId + "</_graphId></_d>");
        }
    }
    CloseSktGraph();
    OnRunMode(1 - m_iGraphMode);
    if (event&&event.srcElement)
    event.srcElement.src = event.srcElement.src.split("_")[0] + (m_iGraphMode == 0 ? "_2.bmp" : "_1.bmp");
    if (m_iGraphMode == 0)
        iEditRefeshed = 0;
//    if (m_bTzfsh == 1) {
//        m_bTzfsh = 0;
//        obj = getParentTag(event.srcElement, "TD").previousSibling.previousSibling.firstChild.firstChild;
//        obj.alt = "调整方式";
//        obj.src = obj.src.split("_")[0] + "_2.bmp";
//    }
    divGraphEditBarView.style.display = m_iGraphMode == 1 ? "block" : "none";
    if (window.GraphTreeSetOperateView)
        GraphTreeSetOperateView(m_iGraphMode == 1);
}
var divGraphEditBarView;
function GraphBarEditSetOperate(divOperate) {
    if (divOperate) divGraphEditBarView = divOperate;
    var tblOperate = document.createElement("<table style='width:100%; height:100%;margin:0' cellpadding='0' cellspacing='0'></table>");
    divGraphEditBarView.appendChild(tblOperate);
    var tr = tblOperate.insertRow(-1);
    tr.style.backgroundColor = "#eaeff2";
    GetGraphOperateSpater(tr);
    GetGraphBarOperateDiv(tr, "", "选择", "select_2.bmp");
    GetGraphOperateSpater(tr);
    GetGraphBarOperateDiv(tr, "OnEdit('DrawPointManual')", "画点", "point_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawCircleManual')", "画圆", "circle_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawArcManual')", "画弧", "arc_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawEllipseManual')", "画椭圆", "ellipse_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawRoundRectManual')", "画圆角矩形", "roundrect_2.bmp");
    GetGraphOperateSpater(tr);
    GetGraphBarOperateDiv(tr, "OnEdit('DrawLineManual')", "画直线", "line_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawTriAngleManual')", "画三角形", "triangle_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawRectangleManual')", "画矩形", "rect_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawPolylineManual')", "画开口折线", "polyline_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawPolylineClosedManual')", "画闭口折线", "polygon_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawPolygonManual')", "画正多边形", "regular_2.bmp");
    GetGraphOperateSpater(tr);
    GetGraphBarOperateDiv(tr, "OnEdit('DrawArrowManual')", "画箭头", "arraw_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawBezierManual')", "画贝塞尔曲线", "bezier_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawCurveManual')", "画自由曲线", "curver_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawImageManual')", "插入图片", "dynamic_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawCurveClosedManual')", "画闭口自由曲线", "closedcurver_2.bmp");
    GetGraphOperateSpater(tr);
    GetGraphBarOperateDiv(tr, "OnEdit('DrawTextManual')", "画文本", "text_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DrawCommandTextManual')", "画命令文本", "commandtext_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('CopyWaitManualPaste')", "复制", "copypic_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('RotateManual')", "旋转", "revolve_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('MirrorManual')", "镜像", "mirror_2.bmp");
    GetGraphBarOperateDiv(tr, "OnEdit('DeleteSelected')", "删除", "delete_2.bmp");
    GetGraphOperateSpater(tr);
    GetGraphBarOperateDiv(tr, "OnEdit('LockSelected', '1')", "锁定", "lock_2.bmp", 1);
    //GetGraphBarOperateDiv(tr, "OnEdit('LockSelected', '0')", "解除锁定", "unlock_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "GraphItemUnLock()", "解除锁定", "unlock_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "GraphBarClickEvent('_EnableContinue')", "连续作图模式", "continue_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "GraphBarClickEvent('_EditHandle')", "折点", "handle_1.bmp", 1);
    GetGraphBarOperateDiv(tr, "GraphBarClickEvent('_AutoTAndParallelConnect')", "移动图元时处理T接和平行连接", "tconn_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "GraphBarClickEvent('_MoveNodeMode')", "拖动图元端子保持连接", "gconn_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "GraphBarClickEvent('_MoveGraphWithHandleMode')", "拖动端子，端子保持连接", "nconn_2.bmp", 1);
    GetGraphBarOperateDiv(tr, "GraphBarClickEvent('_UpdCheckOtherChg','','您即将设置不监测其他客户端是否更改图形\\n\\n多人同时改图可能会引起拓扑不正确，请在确定画好图后重新生成一遍拓扑')", "不监测其他客户端是否改图", "checkother_1.bmp", 1);//Add by gud 20130331
    GetGraphBarOperateDiv(tr, "GraphBarClickEvent('_PasteGraphMode')", "强制复制图元的ID", "idcopy_2.bmp", 1);
    tr.insertCell(-1).style.width = "100%";
}

function GraphBarClickEvent(typeItem, msg0, msg1) {//Modify by gud 20130331
    var obj = event.srcElement;
    if (m_pPsgpActive.GetTypeItem(typeItem) == "1") {
        if (msg1) alert(msg1); //Modify by gud 20130331
        obj.src = obj.src.split("_")[0] + "_2.bmp";
        m_pPsgpActive.SetTypeItem(typeItem, "0");
    }
    else {
        if (msg0) alert(msg0); //Modify by gud 20130331
        obj.src = obj.src.split("_")[0] + "_1.bmp";
        m_pPsgpActive.SetTypeItem(typeItem, "1");
    }
}
//add by subo 20130614
function GraphItemUnLock() {
    //OnEdit('LockSelected', '0');

    var allSelectedGraphItemLinkStr = m_pPsgpActive.GetSelectedGraphItem();
    var xmlDoc1 = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc1.loadXML(allSelectedGraphItemLinkStr);
    xmlNode = xmlDoc1.selectSingleNode("d");
    var code = "";
    for (var i = 0; i < xmlNode.childNodes.length; i++) {
        var id = xmlNode.childNodes[i].childNodes[0].text;
        var b = GraphAjax.GetAuthorityGraphItem(id);
        if (b.value == 1) {
            code += "<d>" + id + "</d>";
        }
    }
    if (code != "") {
        code = "<t><bat locktype=\"0\">" + code + "</bat></t>";
        m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "setbatgraphlockornot", code);
    }
};
//add end