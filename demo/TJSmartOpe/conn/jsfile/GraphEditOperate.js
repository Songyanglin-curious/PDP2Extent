//图形编辑常用变量
var ismanygraph = false;//是多设备定义颜色还是全线定义颜色
var strLinkTextId = ""; //文本关联使用，记录关联文本
var strLinkGraphId = ""; //文本关联使用，记录关联图形
var EditCmdValue =
{
    BreakLine: 0xDFCF, UnBreakLine: 0xDFCE, SetColor: 0xDFCD, DropColor: 0xDFCC, AllSetColor: 0xDFCB,
    AllDropColor: 0xDFCA, AddTemplate: 0xDFC9, SetMainDev: 0xDFC8,
    GraphBringBack: 0xDFC7, GraphBringFore: 0xDFC6, SetMainText: 0xDFC5, SetKBS: 0xDFC4, DropKBS: 0xDFC3
}
var KeyValue = {
    BackSpace: 8, Akey: 65, Bkey: 66, Ckey: 67, Dkey: 68, Ekey: 69, Fkey: 70, Gkey: 71,
    Hkey: 72, IKey: 73, Jkey: 74, Kkey: 75, Lkey: 76, Mkey: 77, Nkey: 78, Okey: 79,
    Pkey: 80, Qkey: 81, Rkey: 82, Skey: 83, Tkey: 84, Ukey: 85, Vkey: 86, Wkey: 87,
    Xkey: 88, Ykey: 88, Zkey: 90, Delkey: 46, ShiftDelkey: 110
}
function SetBusKBS(kbstype) {//设置母线开闭所
    var arrBackInfo = GraphAjax.SetBusBarKBS(m_CurrentGraphItem.strDevName, kbstype).value;
    if (arrBackInfo[0] == "0")
        alert("设置失败");
    else
        alert("设置成功");
}

function MenuCommandEdit(strXML, commandValue) {
    switch (commandValue) {
        case EditCmdValue.DefineStation: //定义厂站
            break;
        case EditCmdValue.BreakLine: //线路挑火
            m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), "BreakLine", pointEvent[0] + "#~!" + pointEvent[1]);
            break;
        case EditCmdValue.UnBreakLine: //搭火
            m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), "UnBreakLine", m_CurrentGraphItem.iGraphItemID);
            break;
        case EditCmdValue.SetKBS: //设为开闭所
            SetBusKBS("1");
            break;
        case EditCmdValue.DropKBS: //取消开闭所
            SetBusKBS("0");
            break;
        case EditCmdValue.AddTemplate: //添加到模板
            var classandname = ShowModalDialog("/GraphModule/definetemplate.aspx", "", "dialogWidth:300px; dialogHeight:150px; center:yes; help:no; resizable:no; status:no;scroll:no;");
            if (classandname)
                m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), "AddToTemplate", classandname);
            break;
        case EditCmdValue.SetMainDev: //设置主设备
            SetMainDevice();
            break;
        case EditCmdValue.GraphBringBack: //放到最下
            m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), "setgraphback", m_CurrentGraphItem.iGraphItemID);
            break;
        case EditCmdValue.GraphBringFore: //放到最上
            m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), "setgraphfore", m_CurrentGraphItem.iGraphItemID);
            break;
        case EditCmdValue.SetColor://定义颜色
            ismanygraph = true;
            parent.colordialog();
            break;
        case EditCmdValue.DropColor://撤销颜色定义
            ismanygraph = true;
            ChooseColor("", 1);
            break;
        case EditCmdValue.AllSetColor://全线路定义颜色
            ismanygraph = false;
            parent.colordialog();
            break;
        case EditCmdValue.AllDropColor://全线路撤销颜色定义
            ismanygraph = false;
            ChooseColor("", 1);
            break;
        case EditCmdValue.SetMainText: //文本关联
            if (strLinkGraphId == "" || strLinkTextId == "") {
                break;
            }
            var szManName = "DYNTEXT_" + m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, strLinkGraphId, "name");
            m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, strLinkTextId, "edittext", szManName);
            m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, strLinkTextId, "textfitcontent", "");
            m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), "SetMainGraph", strLinkGraphId + "#~!" + strLinkTextId);
            break;
        default:
            break;
    }
}
function DocumentKeyDown() {
    var CtrlCode = 0;
    if (event.ctrlKey)
        CtrlCode |= 4;
    if (event.altKey)
        CtrlCode |= 2;
    if (event.shiftKey)
        CtrlCode |= 1;
    var keyCode = event.keyCode;
    switch (CtrlCode) {
        case 6:
            if (keyCode == KeyValue.Xkey)
                m_pPsgpActive.CatchScreen(1);
            break;
        case 4:
            if (keyCode == KeyValue.Ckey)
                OnEdit('EditCopy');
            if (keyCode == KeyValue.Vkey)
                OnEdit('EditPaste');
            if (keyCode == KeyValue.Xkey)
                OnEdit('EditCut');
            break;
        case 1:
            if (keyCode == KeyValue.ShiftDelkey)
                OnEdit('DeleteSelected');
            break;
        case 0:
            if (keyCode == KeyValue.Delkey)
                OnEdit('DeleteSelected');
            break;
        default: //多键混合
            break;
    }
}
function MenuStartEdit(strXML) {
    var devtype = m_CurrentGraphItem.iDevType;
    if (devtype == eDeviceTypeName.线路 || devtype == eDeviceTypeName.单端线路)
        m_pPsgpActive.AddPopMenu(EditCmdValue.BreakLine, "<d>线路挑火</d>");
    if (devtype == eDeviceTypeName.线缆)
        m_pPsgpActive.AddPopMenu(EditCmdValue.UnBreakLine, "<d>搭火</d>");
    if (devtype == eDeviceTypeName.母线) {
        m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d>-</d>");
        if (GraphAjax.GetBusBarKBS(m_CurrentGraphItem.strDevName).value == "1")
            m_pPsgpActive.AddPopMenu(EditCmdValue.DropKBS, "<d>取消环网柜母线</d>");
        else
            m_pPsgpActive.AddPopMenu(EditCmdValue.SetKBS, "<d>设为环网柜母线</d>");
    }
    if (m_pPsgpActive.GetSelectedGraphItem()) {
//        m_pPsgpActive.AddPopMenu(EditCmdValue.SetColor, "<d>定义颜色</d>");
//        m_pPsgpActive.AddPopMenu(EditCmdValue.DropColor, "<d>撤销颜色定义</d>");
        var allSelectedGraphItemLinkStr = m_pPsgpActive.GetSelectedGraphItem();
        var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
        xmlDoc.loadXML(allSelectedGraphItemLinkStr);
        xmlNode = xmlDoc.selectSingleNode("d");
        if (xmlNode && xmlNode.childNodes.length > 1) {
            if (xmlNode.childNodes.length == 2) {
                strLinkTextId = "";
                strLinkGraphId = "";
                if (xmlNode.childNodes[0].selectSingleNode("_type").text == "-1")
                    strLinkTextId = xmlNode.childNodes[0].selectSingleNode("_graphItemId").text;
                else
                    strLinkGraphId = xmlNode.childNodes[0].selectSingleNode("_graphItemId").text;
                if (xmlNode.childNodes[1].selectSingleNode("_type").text == "-1")
                    strLinkTextId = xmlNode.childNodes[1].selectSingleNode("_graphItemId").text;
                else
                    strLinkGraphId = xmlNode.childNodes[1].selectSingleNode("_graphItemId").text;
                m_pPsgpActive.AddPopMenu(EditCmdValue.SetMainText, "<d>快速文本关联</d>");
            }
        }
    }
    if (m_iGraphMode == "1") {
        m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d>-</d>");
        m_pPsgpActive.AddPopMenu(EditCmdValue.AddTemplate, "<d>添加到模板</d>");
        m_pPsgpActive.AddPopMenu(EditCmdValue.SetMainDev, "<d>设置主设备</d>");

        m_pPsgpActive.AddPopMenu(EditCmdValue.GraphBringBack, "<d>放到最下</d>");
        m_pPsgpActive.AddPopMenu(EditCmdValue.GraphBringFore, "<d>放到最上</d>");
    }
}