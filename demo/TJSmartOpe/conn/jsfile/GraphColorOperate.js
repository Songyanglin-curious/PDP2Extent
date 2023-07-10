//和图元颜色相关的操作
var m_iColorProcID = "0"; //颜色读取的断面
var WhiteGraphItem = []; //已经变色的设备，防止切换图形时色彩存留

function ClearDevLinkColor() {
    var xmlstr = "";
    for (var i = 0; i < WhiteGraphItem.length; i++) {
        xmlstr += "<d>"+WhiteGraphItem[i]+"</d>";
        //m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, WhiteGraphItem[i], "isForceColor", "0");
        //m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + m_pPsgpActive.GetCurrGraphId() + "</_graphId><_fromDb>4</_fromDb><_updtype>1</_updtype><_Value>" + WhiteGraphItem[i] + "</_Value></_d>");
    }
    if (xmlstr != "") {
        m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "setbatgraphcolor", "<t><bat color=\"333\" forcetype=\"1\">" + xmlstr + "</bat></t>");
    }
    m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + m_pPsgpActive.GetCurrGraphId() + "</_graphId><_fromDb>1</_fromDb><_updtype>0</_updtype></_d>");
    WhiteGraphItem = [];
}

function GetAllGraphItemList(graphId) {
    var xml = m_pPsgpActive.GetGraphicProperty(graphId, 'GraphItemList');
    var _xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    _xmlDoc.async = "false";
    _xmlDoc.loadXML(xml);
    xml = _xmlDoc.documentElement;
    var ids = xml.selectNodes('//d/r/id');
    var res = [];
    for (var i = 0; i < ids.length; ++i) {
        res.push(ids[i].text);
    }
    return res;
}

function GetAllGraphItemObject(graphId) {
    return {
        gid: graphId,
        dict: {},
        allgraphitem: null,
        GetDevIdByGraphItemId: function (graphItemId) {
            return m_pPsgpActive.GetGraphItemProperty(this.gid, -1, graphItemId, "key");
        },
        GetGraphItemIdByDevId: function (devid) {
            if (null == this.allgraphitem)
                this.allgraphitem = GetAllGraphItemList(this.gid);
            var itemid = this.dict[devid];
            if (typeof itemid != "undefined")
                return itemid;
            for (var i = 0; i < this.allgraphitem.length; i++) {
                var thisitemid = this.allgraphitem[i];
                var devidtemp = this.GetDevIdByGraphItemId(thisitemid);
                if (devidtemp == "")
                    continue;
                this.dict[devidtemp] = thisitemid;
                if (devidtemp == devid)
                    return thisitemid;
            }
            return null;
        }
    };
}

function SetDevLinkColor(devicename) {//设置连通性分析变色
    var linkDevice = GraphAjax.GetDeviceLinked(devicename).value;
    if (linkDevice[0] == "0") {
        alert(linkDevice[1]);
    }
    else {
        if (linkDevice[1] == "")
            return false;
        var arr = linkDevice[1].split("#~!");
        ClearDevLinkColor();
        var xmlstr = "";
        var allgraphitem = GetAllGraphItemObject(m_pPsgpActive.GetCurrGraphId());
        for (var i = 0; i < arr.length; i++) {
            var devGraph = allgraphitem.GetGraphItemIdByDevId(arr[i]);  //GetDevGraph(m_pPsgpActive.GetCurrGraphId(), arr[i], m_pPsgpActive);
            devGraph = (devGraph == null) ? [] : [[m_pPsgpActive.GetCurrGraphId(),devGraph]];
            for (var j = 0; j < devGraph.length; j++) {
                if (devGraph[j][0] == m_pPsgpActive.GetCurrGraphId()) {
                    if (WhiteGraphItem.hasvalue(devGraph[j][1]))
                        break;
                    WhiteGraphItem.push(devGraph[j][1]);
                    xmlstr += "<d>"+devGraph[j][1]+"</d>";
                    //var red = 0, green = 255, blue = 0; //设置联通性分析颜色的地方
                    //m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, devGraph[j][1], "forcecolor", blue * 65536 + green * 256 + red);
                    //m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + m_pPsgpActive.GetCurrGraphId() + "</_graphId><_fromDb>4</_fromDb><_updtype>1</_updtype><_Value>" + devGraph[j][1] + "</_Value></_d>");
                    break;
                }
            }
        }
        if (xmlstr != "") {
            var red = 0, green = 255, blue = 0; //设置联通性分析颜色的地方
            m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "setbatgraphcolor", "<t><bat color=\"" + (blue * 65536 + green * 256 + red) + "\" forcetype=\"3\">" + xmlstr + "</bat></t>");
        }
        m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + m_pPsgpActive.GetCurrGraphId() + "</_graphId><_fromDb>1</_fromDb><_updtype>0</_updtype></_d>");
    }
}

function SetGraphItemColor(pgraphid, pProcID) {//得到设定的设备颜色
    var graphitemcolor = GraphAjax.GetItemColor(pgraphid, pProcID.toString()).value;
    if (graphitemcolor) {
        for (var j = 0; j < graphitemcolor.length - 1; j += 2) {
            m_pPsgpActive.SetGraphItemProperty(pgraphid, "-1", graphitemcolor[j], "halfforcecolorwithpower", graphitemcolor[j + 1]);
        }
    }
    m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + pgraphid + "</_graphId><_fromDb>3</_fromDb><_updtype>2</_updtype></_d>");
}

function ChooseColor(ecolor, del) {
    var allSelectedItems = ismanygraph ? m_pPsgpActive.GetSelectedGraphItem() : m_pPsgpActive.GetConnectDevListByGraphItem(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "联络开关");
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc.loadXML(allSelectedItems);
    var xmlNode = xmlDoc.selectSingleNode("d");
    var itemcolor = [];
    if (xmlNode) {
        var pgraphid = m_pPsgpActive.GetCurrGraphId();
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var graphItemNode = xmlNode.childNodes[i];
            if (graphItemNode.selectSingleNode("_type").text != "-1") {
                itemcolor.push(pgraphid);
                var pgraphitemid = graphItemNode.selectSingleNode("_graphItemId").text;
                itemcolor.push(pgraphitemid);
                if (del == "1") {
                    itemcolor.push(m_iColorProcID);
                    m_pPsgpActive.SetGraphItemProperty(pgraphid, "-1", pgraphitemid, "isForceColor", "0");
                }
                else {
                    var pcolor = parseInt("0x" + ecolor.substr(5, 2) + ecolor.substr(3, 2) + ecolor.substr(1, 2));
                    itemcolor.push(pcolor);
                    itemcolor.push(m_iColorProcID);
                    m_pPsgpActive.SetGraphItemProperty(pgraphid, "-1", pgraphitemid, "isForceColor", "0");
                    m_pPsgpActive.SetGraphItemProperty(pgraphid, "-1", pgraphitemid, "halfforcecolorwithpower", pcolor);
                }
            }
        }
        m_pPsgpActive.UpdateWndByData("<_d><_graphId>-1</_graphId><_fromDb>3</_fromDb><_updtype>2</_updtype></_d>");
    }
    var savecolorInform;
    if (del == "1") {
        savecolorInform = GraphAjax.DeleteItemColor(itemcolor).value;
    }
    else {
        savecolorInform = GraphAjax.SaveItemColor(itemcolor).value;
    }
    if (savecolorInform[0] == "0") {
        alert(savecolorInform[1] + "，颜色设置失败");
        return false;
    }
    if (savecolorInform[1] == "0")
        alert("颜色设置失败");
}

