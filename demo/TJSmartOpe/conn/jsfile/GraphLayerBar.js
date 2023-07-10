//图形工具条Layer组件
//by popduke 111109
var m_arrGraphLayer = []; //所有图形的layer信息
var mLayerClick = 1; //点开LayerDiv的次数

function LayerEditMouseOut() {
    TableRowMouseOut();
    var obj = getParentTag(event.srcElement, "TR");
    if (obj.cells(0).firstChild.nameProp == "layerview-1.bmp")
        obj.cells(0).firstChild.src = strGraphBarImageUrl + "layerview.jpg";
    if (obj.cells(0).firstChild.nameProp == "layerhidden-1.bmp")
        obj.cells(0).firstChild.src = strGraphBarImageUrl + "layerhidden.jpg";

    if (obj.cells(1).firstChild.nameProp == "layerlock-1.bmp")
        obj.cells(1).firstChild.src = strGraphBarImageUrl + "layerlock.jpg";
    if (obj.cells(1).firstChild.nameProp == "layerunlock-1.bmp")
        obj.cells(1).firstChild.src = strGraphBarImageUrl + "layerunlock.jpg";
}

function LayerEditMouseOver() {
    TableRowMoseOver();
    var obj = getParentTag(event.srcElement, "TR");
    if (obj.cells(0).firstChild.nameProp == "layerview.jpg")
        obj.cells(0).firstChild.src = strGraphBarImageUrl + "layerview-1.bmp";
    if (obj.cells(0).firstChild.nameProp == "layerhidden.jpg")
        obj.cells(0).firstChild.src = strGraphBarImageUrl + "layerhidden-1.bmp";

    if (obj.cells(1).firstChild.nameProp == "layerlock.jpg")
        obj.cells(1).firstChild.src = strGraphBarImageUrl + "layerlock-1.bmp";
    if (obj.cells(1).firstChild.nameProp == "layerunlock.jpg")
        obj.cells(1).firstChild.src = strGraphBarImageUrl + "layerunlock-1.bmp";
}

function changeView() {
    if (m_arrGraphLayer.length == 0)
        return;
    mLayerClick = 2;
    var obj = getParentTag(event.srcElement, "TR");
    var graphid = m_pPsgpActive.GetCurrGraphId();
    if (m_pPsgpActive.GetLayerProperty(graphid, m_arrGraphLayer[obj.rowIndex].id, "visible") == "1") {
        obj.cells(0).firstChild.src = strGraphBarImageUrl + "layerhidden-1.bmp";
        m_pPsgpActive.SetLayerProperty(graphid, m_arrGraphLayer[obj.rowIndex].id, "visible", "0");
        m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + graphid + "</_graphId><_fromDb>1</_fromDb><_updtype>1</_updtype></_d>");
    }
    else {
        obj.cells(0).firstChild.src = strGraphBarImageUrl + "layerview-1.bmp";
        m_pPsgpActive.SetLayerProperty(graphid, m_arrGraphLayer[obj.rowIndex].id, "visible", "1");
        m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + graphid + "</_graphId><_fromDb>1</_fromDb><_updtype>1</_updtype></_d>");
    }
    choseLayer();
}
function choseLayer() {
    var obj = getParentTag(event.srcElement, "TR");
    txtLayer.innerText = obj.cells(2).innerText;
    tblViewLayer.rows(0).cells(0).firstChild.src = strGraphBarImageUrl
            + obj.cells(0).firstChild.nameProp.split("-")[0] + ".jpg";
    tblViewLayer.rows(0).cells(1).firstChild.src = strGraphBarImageUrl
            + obj.cells(1).firstChild.nameProp.split("-")[0] + ".jpg";
    m_pPsgpActive.SetLayerProperty(m_pPsgpActive.GetCurrGraphId(), m_arrGraphLayer[obj.rowIndex].id, "currLayer", "1");//设置当前图层
}
function changeLock() {
    if (m_arrGraphLayer.length == 0)
        return;
    mLayerClick = 2;
    var obj = event.srcElement;
    while (obj.tagName != "TR") obj = obj.parentElement;
    var graphid = m_pPsgpActive.GetCurrGraphId();
    if (m_pPsgpActive.GetLayerProperty(graphid, m_arrGraphLayer[obj.rowIndex].id, "lock") == "0") {
        obj.cells(1).firstChild.src = strGraphBarImageUrl + "layerlock-1.bmp";
        m_pPsgpActive.SetLayerProperty(graphid, m_arrGraphLayer[obj.rowIndex].id, "lock", "1");
        m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + graphid + "</_graphId><_fromDb>1</_fromDb><_updtype>1</_updtype></_d>");
    }
    else {
        obj.cells(1).firstChild.src = strGraphBarImageUrl + "layerunlock-1.bmp";
        m_pPsgpActive.SetLayerProperty(graphid, m_arrGraphLayer[obj.rowIndex].id, "lock", "0");
        m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + graphid + "</_graphId><_fromDb>1</_fromDb><_updtype>1</_updtype></_d>");
    }
    choseLayer();
}
function ShowEditLayerTable() {
    divLayer.style.left = getIEAbsLeft(txtLayer.parentElement.parentElement);
    divLayer.style.top = getIEAbsTop(txtLayer) + txtLayer.offsetHeight;
    if (divLayer.style.display == "none") {
        divLayer.style.display = "block";
        mLayerClick = 2;
    }
    else
        divLayer.style.display = "none";
}
function bodyLayerClick() {
    if (mLayerClick == 2) {
        mLayerClick = 1;
        return;
    }
    if (!window.divLayer)
        return false;
    if (divLayer.style.display == "block")
        divLayer.style.display = "none";
}
window.document.attachEvent("onclick", bodyLayerClick);

function GetGraphLayerTable() {
    var div = document.createElement("DIV");
    div.id = "divLayer";
    div.style.position = "absolute";
    div.style.width = "157px";
    div.style.margin = "0px";
    div.style.left = "10px";
    div.style.top = "10px";
    div.style.display = "none";
    div.style.backgroundColor = "White";
    div.style.zIndex = "1000";
    document.body.appendChild(div);
    var tbl = document.createElement("<table style='width:100%; height:100%; margin:0' cellpadding='0' cellspacing='0'></table>");
    tbl.id = "tblEditLayer";
    tbl.style.borderLeft = tbl.style.borderRight = tbl.style.borderBottom = "solid 1px Black";
    div.appendChild(tbl);
    //AddGraphLayerRow();
    for (var i = 0; i < 3; i++) {
        var tr = tbl.insertRow(-1);
        tr.onmouseout = LayerEditMouseOut;
        tr.onmouseover = LayerEditMouseOver;
        var td = tr.insertCell(-1);
        td.style.width = "16px";
        td.innerHTML = "<img onclick='return changeView()' alt='' src='" + strGraphBarImageUrl + "layerview.jpg' />";
        td = tr.insertCell(-1);
        td.style.width = "16px";
        td.innerHTML = "<img onclick='return changeLock()' alt='' src='" + strGraphBarImageUrl + "layerunlock.jpg' />";
        td = tr.insertCell(-1);
        td.onmouseup = choseLayer;
        td.innerText = i == 0 ? "普通图元层" : (i == 1 ? "复合图元层" : "拓扑设备层");
    }
    SetDivActiveView(div);
    return div;
}

function GetGraphLayerOperate() {
    var tblLayer = document.createElement("<table style='margin:0' cellpadding='0' cellspacing='0'></table>");
    tblLayer.id = "tblViewLayer";
    tblLayer.style.width = "157px";
    tblLayer.style.borderBottom = tblLayer.style.borderRight = tblLayer.style.borderLeft = "inset 1 #888888";
    var tr = tblLayer.insertRow(-1);
    tr.style.backgroundColor = "#FFFFFF";
    tr.insertCell(-1).innerHTML = "<img alt='' src='" + strGraphBarImageUrl + "layerview.JPG' />";
    tr.insertCell(-1).innerHTML = "<img alt='' src='" + strGraphBarImageUrl + "layerunlock.JPG' />";
    var tc = tr.insertCell(-1);
    tc.style.width = "100%";
    tc.innerHTML = "<span style='border: none; width: 100%' id='txtLayer'>普通图元层</span>";
    tr.insertCell(-1).innerHTML = "<img alt='' style='width: 16px' src='" + strGraphBarImageUrl + "showdown.gif' onclick='ShowEditLayerTable()' />";
    return tblLayer;
}

function ActiveGraphLayer(iActive, iGraphId) {
    if (iActive == 1)
        InsertLayerEditTable(iGraphId);
    if (iActive == 0)
        bodyLayerClick();
}
function InsertLayerEditTable(iGraphId) {
    if (!window.divLayer)
        return false;
    var strLayerInform = m_pPsgpActive.GetGraphicProperty(iGraphId, "LayerList");
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc.loadXML(strLayerInform);
    var xmlNode = xmlDoc.selectSingleNode("d");
    m_arrGraphLayer = [];
    for (var i = 0; i < xmlNode.childNodes.length; i++) {
        var layerid = xmlNode.childNodes[i].selectSingleNode("layerid").text;
        var layername = xmlNode.childNodes[i].selectSingleNode("layername").text;
        m_arrGraphLayer.push({ id: layerid, name: layername });
    }
    if (m_arrGraphLayer.length > 0) {
        tblViewLayer.rows(0).cells(0).childNodes[0].src = strGraphBarImageUrl + (m_pPsgpActive.GetLayerProperty(iGraphId, m_arrGraphLayer[0].id, "visible") == "1" ? "layerview.jpg" : "layerhidden.jpg");
        tblViewLayer.rows(0).cells(1).childNodes[0].src = strGraphBarImageUrl + (m_pPsgpActive.GetLayerProperty(iGraphId, m_arrGraphLayer[0].id, "lock") == "0" ? "layerunlock.jpg" : "layerlock.jpg");
        txtLayer.innerText = m_arrGraphLayer[0].name;
    }
    while (m_arrGraphLayer.length > tblEditLayer.rows.length) {
        tblEditLayer.tBodies(0).appendChild(tblEditLayer.rows(0).cloneNode(true));
    }
    deleteRows(tblEditLayer, m_arrGraphLayer.length);
    for (var i = 0; i < m_arrGraphLayer.length; i++) {
        tblEditLayer.rows(i).cells(0).childNodes[0].src = strGraphBarImageUrl + (m_pPsgpActive.GetLayerProperty(iGraphId, m_arrGraphLayer[i].id, "visible") == "1" ? "layerview.jpg" : "layerhidden.jpg");
        tblEditLayer.rows(i).cells(1).childNodes[0].src = strGraphBarImageUrl + (m_pPsgpActive.GetLayerProperty(iGraphId, m_arrGraphLayer[i].id, "lock") == "0" ? "layerunlock.jpg" : "layerlock.jpg");
        tblEditLayer.rows(i).cells(2).innerText = m_arrGraphLayer[i].name;
    }
}