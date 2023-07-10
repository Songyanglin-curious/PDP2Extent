
function GetLineGroupItemByBegin(lBegItem) {
    return GetLineNodeMsgList("GetLineItemFromBegNode", lBegItem);
}
function CLineNodeMsg() {
    this.m_lItemID = "";
    this.m_strLevel = "";
    this.m_nTypeValue = "";
    this.m_strDesc = "";
    this.m_strGroupName = "";
    this.m_strDeviceName = "";
    this.m_lParentItem = "";
}
function GetLineNodeMsgList(strSqlMark, lItemID) {
    var arr = [];
    var szKeyXml = m_pPsgpActive.GetServerDataTest("GetNormalMsg#~!" + strSqlMark + "#~!0#~!" + lItemID + "#~!itemID#~!lineLevel#~!typevalue#~!devicedescold#~!deviceName");
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc.loadXML(szKeyXml);
    var xmlNode = xmlDoc.selectSingleNode("d"); 
    try {
        for (var i = 0; i < xmlNode.childNodes.length; ++i) {
            var graphItemNode = xmlNode.childNodes[i];
            var msg = new CLineNodeMsg();
            msg.m_lItemID = graphItemNode.selectSingleNode("itemID").text;
            msg.m_strLevel = graphItemNode.selectSingleNode("lineLevel").text;
            msg.m_nTypeValue = graphItemNode.selectSingleNode("typevalue").text;
            msg.m_strDesc = graphItemNode.selectSingleNode("devicedescold").text;
            msg.m_strGroupName = graphItemNode.selectSingleNode("devicedescold").text;
            msg.m_strDeviceName = graphItemNode.selectSingleNode("deviceName").text;
            msg.m_lParentItem = lItemID;
            arr.push(msg);
        }
    }
    catch (e) {
    }
    return arr;
}
function GetAllJoinNode() {
    var vecRt = [];
    var szKeyXml = m_pPsgpActive.GetServerDataTest("GetNormalMsg#~!GetJoinNodeList#~!0#~!#~!itemID");
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc.loadXML(szKeyXml);
    var xmlNode = xmlDoc.selectSingleNode("d"); 
    try {
        for (var i = 0; i < xmlNode.childNodes.length; ++i)
            vecRt.push(xmlNode.childNodes[i].selectSingleNode("itemID").text);
    }
    catch (e) {
    }
    return vecRt;
}
function AddIntToList(vec, lValue) {
    for (var i = 0; i < vec.length; ++i) {
        if (vec[i] == lValue)
            return false;
    }
    vec.push(lValue);
    return true;
}
function IsIntInList(vec, lValue) {
    for (var i = 0; i < vec.length; ++i) {
        if (vec[i] == lValue)
            return true;
    }
    return false;
}
function GetJoinNodeList(vecAll, vecNode) {
    var vecJoinNode = [];
    for (var i = 0; i < vecNode.length; ++i) {
        if (IsIntInList(vecAll, vecNode[i].m_lItemID))
            AddIntToList(vecJoinNode, vecNode[i].m_lItemID);
    }
    return vecJoinNode;
}
function GetBranchOfJoinNode(lJoinNode) {
    return GetLineNodeMsgList("GetLineItemFromJoinNode", lJoinNode);
}
function AddItemToList(vec, msg) {
    for (var i = 0; i < vec.length; ++i) {
        if ((vec[i].m_lItemID == msg.m_lItemID) && (vec[i].m_strLevel == msg.m_strLevel))
            return;
    }
    vec.push(msg);
}
function GetLineGroupItem(lItemID) {
    var vecAllJoinNode = GetAllJoinNode();
    var vec = GetLineGroupItemByBegin(lItemID);
    var vecJoinNode = GetJoinNodeList(vecAllJoinNode, vec);
    var vecHavePass = [];
    while (vecJoinNode.length != 0) {
        var lTemp = vecJoinNode.pop();
        var vecTemp = GetBranchOfJoinNode(lTemp);
        for (var i = 0; i < vecTemp.length; ++i) {
            AddItemToList(vec, vecTemp[i]);
        }
        var vecTempJoin = GetJoinNodeList(vecAllJoinNode, vecTemp);
        vecHavePass.push(lTemp);
        for (var i = 0; i < vecTempJoin.length; ++i) {
            if (!IsIntInList(vecHavePass, vecTempJoin[i]))
                AddIntToList(vecJoinNode, vecTempJoin[i]);
        }
    }
    return vec;
}

function GetConnDevList(lGraphID, lBegItemID, lEndItemID, vecLine, vecAll) {
    var vecPass = [];
    var vecConnLine = GetConnLineList(lGraphID);
    GetConnDevList2(lGraphID, -1, lBegItemID, 0, lEndItemID, vecLine, vecAll, vecPass, vecConnLine);//从第一个设备0端口开始获取两个设备间的连接
    GetConnDevList2(lGraphID, -1, lBegItemID, 1, lEndItemID, vecLine, vecAll, vecPass, vecConnLine);//从第一个设备1端口开始获取两个设备间的连接
}
function GetConnLineList(lGraphID) {
    return GetItemList(lGraphID, "GetConnLineMsg");
}
function GetItemList(lGraphID, strSQLMark) {
    var vec = [];
    var szKeyXml = m_pPsgpActive.GetServerDataTest("GetNormalMsg#~!" + strSQLMark + "#~!0#~!" + lGraphID + "#~!itemID");
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc.loadXML(szKeyXml);
    var xmlNode = xmlDoc.selectSingleNode("d"); 
    try {
        for (var i = 0; i < xmlNode.childNodes.length; ++i)
            vec.push(xmlNode.childNodes[i].selectSingleNode("itemID").text);
    }
    catch (e) {
    }
    return vec;
}
var m_vecKBS = [];
function InitKBSItem() {
    if (m_vecKBS.length != 0)
        return;
    var szKeyXml = m_pPsgpActive.GetServerDataTest("GetNormalMsg#~!GetAllKBS#~!0#~!#~!itemID");
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc.loadXML(szKeyXml);
    var xmlNode = xmlDoc.selectSingleNode("d"); 
    try {
        for (var i = 0; i < xmlNode.childNodes.length; ++i)
            m_vecKBS.push(xmlNode.childNodes[i].selectSingleNode("itemID").text);
    }
    catch (e) {
    }
    if (m_vecKBS.length == 0)
        m_vecKBS.push(-1);
}
function IsLineEnd(lItemID, nTypeValue) {
    if (nTypeValue == eDeviceTypeName.母线) {
        for (var i = 0; i < m_vecKBS.length; ++i) {
            if (m_vecKBS[i] == lItemID)
                return false;
        }
        return true;
    }
    return false;
}
function GetItemListByConnDirect(strXML, nPos) {
    var vecRt = [];
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc.loadXML(strXML);
    var xmlNode = xmlDoc.selectSingleNode("d");
    try {
        for (var i = 0; i < xmlNode.childNodes.length; ++i) {
            if ((i < nPos) && (nPos >= 0))
                continue;
            var graphItemNode = xmlNode.childNodes[i];
            for (var j = 0; j < graphItemNode.childNodes.length; ++j) {
                vecRt.push(graphItemNode.childNodes[j].text);
            }
            if (nPos >= 0)
                break;
        }
    }
    catch (e) {
    }
    return vecRt;
}
function GetConnDevList2(lGraphID, lLastItemID, lBegItemID, nPos, lEndItemID, vecLine, vecAll, vecPass, vecConn) {
    var nTypeValue = m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, lBegItemID, "devtype");
    if (lBegItemID == lEndItemID) {//如果首末端设备一致，直接获取末端设备（首端在其他地方加入）
        vecAll.push(lEndItemID);
        if (nTypeValue == eDeviceTypeName.线缆 || nTypeValue == eDeviceTypeName.线路)
            AddIntToList(vecLine, lEndItemID);
        return true;
    }
    InitKBSItem();//获取开闭所母线，
    if (IsLineEnd(lBegItemID, nTypeValue))//搜到非开闭所母线截止
        return false;
    if (IsIntInList(vecConn, lBegItemID))//搜到已经定义好的线路，直接跳出
        return false;
    var strXML = m_pPsgpActive.GetGraphItemProperty(lGraphID, -1, lBegItemID, "conndirectdev");//获取首端设备连接设备
    var vecTemp = GetItemListByConnDirect(strXML, nPos);
    if (nTypeValue == eDeviceTypeName.母线) {//Add by gud
        vecTemp.erase(lLastItemID);
    }
    if (IsIntInList(vecTemp, lLastItemID))//往回找了，直接返回
        return false;
    var bFind = false;
    var vecGanta = [];
    for (var i = 0; i < vecTemp.length; ++i) {//对所有连接设备，进一步查找下一个连接
        if (!AddIntToList(vecPass, vecTemp[i]))//判断该连接设备是否已经搜过，搜过则跳过，否则加入已搜列表
            continue;
        if (m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, vecTemp[i], "devtype") == eDeviceTypeName.杆塔)
            vecGanta.push(vecTemp[i]);
        if (GetConnDevList2(lGraphID, lBegItemID, vecTemp[i], 0, lEndItemID, vecLine, vecAll, vecPass, vecConn) || GetConnDevList2(lGraphID, lBegItemID, vecTemp[i], 1, lEndItemID, vecLine, vecAll, vecPass, vecConn))//进一步查找下一个连接
            bFind = true;
    }
    if (bFind) {//找到了首末端的连接链路
        for (var i = 0; i < vecGanta.length; ++i)
            AddIntToList(vecAll, vecGanta[i]);
        AddIntToList(vecAll, lBegItemID);//将首端加入即可（末端在上面相等处已经加入）
        if (nTypeValue == eDeviceTypeName.线缆 || nTypeValue == eDeviceTypeName.线路)
            AddIntToList(vecLine, lBegItemID);
    }
    return bFind;
}
function GetLineLevel(nLevel) {
    switch (nLevel) {
        case 1:
            return "一级";
        case 2:
            return "二级";
        case 3:
            return "三级";
        case 4:
            return "四级";
        case 5:
            return "五级";
        case 6:
            return "六级";
        case 7:
            return "七级";
        case 8:
            return "八级";
        case 9:
            return "联络线";
    }
    return "";
}