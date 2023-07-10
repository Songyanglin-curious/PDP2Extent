//图形公共操作方法
//edit by popduke 1110

//以下为图形共有的属性
var m_pPsgpActive; //依附的图形对象
var m_iGraphMode = 0; //图形编辑运行态（1：编辑态，0：运行态）
var m_iProcID = 0;//当前图形断面

var eDeviceTypeName = {//公用设备类型位
    线缆: 1, 线路: 2, 空气间歇: 3, 避雷器: 4, 普通开关: 5, 母线: 6, 小车开关: 7, 小车刀闸: 8,
    接地电容: 9, 熔断丝: 10, 发电机: 11, 接地桩: 12, 固定接地: 13, 单端线路: 14, 跨接线: 15, T接: 16,
    负荷: 17, 变压器负荷: 18, 令克: 19, PT2: 20, PT3: 21, 接地电抗: 22, 串连电容: 23, 小电阻: 24,
    串连电抗: 25, 刀闸: 26, 小车: 27, 自藕可调绕组: 28, 星型绕组: 29, 三角绕组: 30, 星型可调绕组: 31, 自藕绕组: 32,
    星型接地绕组: 33, 星型接地可调绕组: 34, 挑火剪刀: 49, 直连线: 50, 地刀: 51, 用户信息: 56, 厂站信息: 57, 配电所: 58,
    标示牌: 61, 杆塔:79,压板: 100, 软地线: 101, Z型变: 102, 变压器: 150, 保护盘: 151
}

function GetDevGraph(iGraphID, strGraphItemName) {//通过图元key得到图元信息
    var arrDevGraph = [];
    var devGraph = m_pPsgpActive.GetGraphDevProperty(iGraphID, -1, strGraphItemName, "devgraph");
    if (devGraph == "")
        return arrDevGraph;
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc.loadXML(devGraph);
    var xmlNode = xmlDoc.selectSingleNode("d");
    var viewGraphId = m_pPsgpActive.GetGraphicProperty(iGraphID, "getidcorrespondence");
    for (var j = 0; j < xmlNode.childNodes.length; j++) {
        var nodeGraph = xmlNode.childNodes[j];
        if (nodeGraph.selectSingleNode("graphicid").text == viewGraphId)//add by wangbinbin 20130626 跳过缩略图
            continue;
        if (nodeGraph)
            arrDevGraph.push([nodeGraph.selectSingleNode("graphicid").text, nodeGraph.selectSingleNode("graphitemid").text]);
    }
    return arrDevGraph;
}
function OnZoomView(zoomType) {
    m_pPsgpActive.ZoomView("<_d><_graphId>" + m_pPsgpActive.GetCurrGraphId()
	+ "</_graphId><_pointX>0</_pointX><_pointY>0</_pointY><_zoomtype>" + zoomType + "</_zoomtype></_d>");
}
function OnEdit(editType, typeValue) {
    m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), editType, typeValue);
}
function OnZoomfactor(factorValue) {
    if (factorValue != "")
        m_pPsgpActive.ZoomView("<_d><_graphId>" + m_pPsgpActive.GetCurrGraphId()
	    + "</_graphId><_pointX>0</_pointX><_pointY>0</_pointY><_zoomtype>ZoomFactor</_zoomtype><_Value>"
	    + factorValue + "</_Value></_d>");
}

function OnRunMode(mode) {//切换编辑运行态
    if (mode == 1) {
        m_pPsgpActive.SetTypeItem("_RunEditMode", "1"); //编辑态
        m_pPsgpActive.SetTypeItem("_ShowEditDevBar", "1");
        m_iGraphMode = 1;
    }
    if (mode == 0) {
        m_iGraphMode = 0;
        m_pPsgpActive.SetTypeItem("_RunEditMode", "0");
        m_pPsgpActive.SetTypeItem("_ShowEditDevBar", "0");
    }
}

function OpenOneGraphic(igraphid) {//切换图形，保持比例不变
    var factorValue = "";
    if (m_pPsgpActive.GetCurrGraphId() != -1)
        factorValue = m_pPsgpActive.GetViewTypeItem(m_pPsgpActive.GetCurrGraphId(), "_ZoomFactor");
    m_pPsgpActive.OpenGraphic("<_d><_graphId>" + igraphid + "</_graphId></_d>");
    OnZoomfactor(factorValue);
}

function EditParam(url, cx, cy) {//在对应点处打开页面
    var szT = "<d><x>" + lGraphPoint[0] + "</x><y>" + lGraphPoint[1] +
        "</y><cx>" + cx + "</cx><cy>" + cy + "</cy><url><![CDATA[" + url + "]]></url><closetype>1</closetype></d>";
    /**/
    m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "popupWebDlg", szT);
}

function TestFuncTime() {
    var dt1 = new Date();
    for (var d = 0; d < 100000; d++) {
        var a = document.getElementById("mainDiv");
    }
    alert((new Date()) - dt1);
}