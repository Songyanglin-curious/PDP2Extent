// 方式操作时公用的变量
var m_iMaxOperateId = 0; //当前图形的最新操作ID
var m_oprateItemCurrent; //最新的操作
var m_arrGraphOperate = []; //记录所有当前页的操作
var m_bTzfsh = 0; //调整方式
var m_arrHeadTailDevice = ["", "", "", ""]; //设备相连的左右设备

var StateCmdValue =
{
    SetState: 2022, KGOpen: 2023, KGClose: 2024, KGTest: 2025, KGWork: 2026, KGRun: 2027, KGHot: 2028, KGCold: 2029,
    KGCheck: 2030, KGUpLoad: 2031, DZOpen: 2032, DZClose: 2033, RZRun: 2034, RZHot: 2035, RZCold: 2036, RZCheck: 2037,
    MXRun: 2038, MXHot: 2039, MXCold: 2040, MXCheck: 2041, MXUpLoad: 2042, MXStandard: 2043, XLRun: 2044, XLHot: 2045,
    XLCold: 2046, XLCheck: 2047, RDOpen: 2048, RDClose: 2049, YZOpen: 2050, YZClose: 2051, KGJianXiu: 2052, KGToTest: 2053, 
    DZTest: 2054, DZWork:2055, DZJianXiu:2056, DZToTest:2057, BYQRun:2058, BYQBY:2059, AddPai: 1050, DropPai: 1051,
    AddJianXiu: 1052, AddGongZuo: 1053, ChangeGraph: 1054, ELOperate: 1055, AddEL: 1056, AddOneEL: 1057, AddLeftEL: 1058,
    AddRightEL: 1059, AddTwoEL: 1060, DropEL: 1061, DropOneEL: 1062, DropLeftEL: 1063, DropRightEL: 1064, DropTwoEL: 1065
}

function imiOperate(opvalue, devname, operdesc)//操作的结构描述
{
    this.operatevalue = opvalue;
    this.device = devname;
    this.operatedesc = operdesc;
}

function FalChangeState(changtype, otherdevice, changeProcID) {//供重写，当方式操作失败时的操作
    m_oprateItemCurrent = null;
}

function OnChangeState(changtype, otherdevice, changeProcID, operatedesc) {//方式操作
    m_oprateItemCurrent = new imiOperate(changtype + "#~!" + otherdevice, m_CurrentGraphItem.strDevName, operatedesc);
    if (!CheckMark(operatedesc)) return false; //add by wangbinbin 20130517 检查标志牌提示
    var devstate = GraphAjax.ChangeState(m_CurrentGraphItem.strDevName, "0", changtype + "#~!" + otherdevice, changeProcID.toString()).value;
    if (devstate[0] == "0") {
        alert(devstate[1]);
        FalChangeState(changtype, otherdevice, changeProcID);
    }
    else {
        if (devstate[1] == "") {
            alert("调整失败");
            FalChangeState(changtype, otherdevice, changeProcID);
        }
        var xmlDoc1 = new ActiveXObject("Msxml2.DOMDocument");
        xmlDoc1.loadXML(devstate[1]);
        var xmlNode = xmlDoc1.selectSingleNode("checkmsg");
        if (xmlNode == null)
            xmlNode = xmlDoc1.selectSingleNode("cmdmsg").selectSingleNode("checkmsg");
        if (xmlNode) {
            var msgNode = xmlNode.selectSingleNode("msglist");
            var errorStr = "";
            var errlevelText = "";
            var ftUser = ""; //对缺陷设备进行查找
            var othUser = "";
            for (var i = 0; i < msgNode.childNodes.length; i++) {
                if (msgNode.childNodes[i].selectSingleNode("errorlevel")) {
                    var errlevelNode = msgNode.childNodes[i].selectSingleNode("errorlevel").text;
                    if (errlevelNode == "1") errlevelText = "1";
                    if (errlevelNode == "2" && errlevelText != "1") errlevelText = "2";
                }
                var contentNode = msgNode.childNodes[i].selectSingleNode("content");
                if (contentNode) {
                    var Root = contentNode.selectSingleNode("ROOT");
                    if (Root) {
                        var ProtectList = Root.selectSingleNode("FaultList");
                        if (ProtectList != null)
                            for (var j = 0; j < ProtectList.childNodes.length; j++) {
                                if (ProtectList.childNodes[j].text != "") {
                                    if (ftUser == "")
                                        ftUser += "\r\n有缺陷存在：";
                                    ftUser += ProtectList.childNodes[j].text.split("#~!")[0] + "，";
                                }
                            }
                        var OtherDevice = Root.selectSingleNode("CardList");
                        if (OtherDevice != null && OtherDevice.text != "") {
                            othUser += OtherDevice.text + "，";
                        }
                    }
                    else {
                        if (errorStr != "") errorStr += "；";
                        errorStr += contentNode.text;
                    }
                }
            }
            errorStr += ftUser + othUser;
            var result = xmlNode.selectSingleNode("checkresult");
            if (result.text == "0") {
                errorStr = "调整失败；\r\n" + errorStr;
                if (errlevelText == "2") {
                    if (confirm(errorStr + "是否强制执行？")) {
                        devstate = GraphAjax.ChangeState(m_CurrentGraphItem.strDevName, "1", changtype + "#~!" + otherdevice, changeProcID.toString()).value;
                        if (devstate[0] == "0" || devstate[1] == "") {
                            alert("重新调整失败");
                            return FalChangeState(changtype, otherdevice, changeProcID);
                        }
                        GetFaultAndSaveOperate(changtype, otherdevice, changeProcID);
                        m_pPsgpActive.UpdateWndByData("<_d><_graphId>-1</_graphId><_fromDb>3</_fromDb><_updtype>2</_updtype></_d>");
                        return;
                    }
                    ViewRelaDevice(xmlNode);
                }
                else {
                    alert(errorStr);
                    ViewRelaDevice(xmlNode);
                }
                FalChangeState(changtype, otherdevice, changeProcID);
                return;
            }
            else {
                errorStr + GetFaultAndSaveOperate(changtype, otherdevice, changeProcID);
            }
            if (errorStr != "")
                alert(errorStr);
        }
        m_pPsgpActive.UpdateWndByData("<_d><_graphId>-1</_graphId><_fromDb>3</_fromDb><_updtype>2</_updtype></_d>");
    }
}
function ViewRelaDevice(xmlNode) {//跳转到失败关联的设备
    var errordevice = xmlNode.selectSingleNode("reladevice").text.split("#~!");
    if (errordevice.length > 0) {
        var devGraph = GetDevGraph(-1, errordevice[0], m_pPsgpActive);
        if (devGraph.length > 0) {
            var igraphid = devGraph[devGraph.length - 1][0];
            OpenOneGraphic(igraphid);
            m_pPsgpActive.OpenDeviceGraphic("<_d><_OpenType>1</_OpenType><_graphItemId>" + devGraph[devGraph.length - 1][1] + "</_graphItemId><_graphId>" + igraphid + "</_graphId><_Type>0</_Type></_d>");
        }
    }
}
//add by wangbinbin 20130517 检查标志牌提示
function CheckMark(opeDesc) {
    for (var i = 0; i < existGraphItem.length; i++) {
        if (existGraphItem[i][0] == m_pPsgpActive.GetCurrGraphId() && existGraphItem[i][1] == m_CurrentGraphItem.iGraphItemID && GetMarkDesc(existGraphItem[i][3]) != "") {
            if (!confirm("设备" + m_CurrentGraphItem.strDevDesc + "挂有" + GetMarkDesc(existGraphItem[i][3]) + "标志牌，确定要进行操作「" + opeDesc + "」吗？"))
                return false;
            else
                return true;
        }
    }
    return true;
}
function GetMarkDesc(strImg) {
    if (strImg.indexOf("faultmark.png")>=0)
        return "故障";
    if (strImg.indexOf("defectmark.png")>=0)
        return "缺陷";
    if (strImg.indexOf("keeppowermark.png")>=0)
        return "保电";
    return "";
}
//add end
function GetFaultAndSaveOperate(changtype, otherdevice, changeProcID) {
    m_arrGraphOperate.push(m_oprateItemCurrent);
    var bAddStateChange = GraphAjax.AddDeviceOperate(m_oprateItemCurrent.device, m_oprateItemCurrent.operatevalue, m_oprateItemCurrent.operatedesc).value;
    if (bAddStateChange[0] != "0")
        m_iMaxOperateId = bAddStateChange[1];
    return SucChangeState(changtype, otherdevice, changeProcID);
}
function GetHeadTailDevice(devkey) {//得到设备相连的左右设备
    var linkdevice = GraphAjax.GetLinkDevice(devkey).value;
    if (linkdevice)
        m_arrHeadTailDevice = linkdevice.split("#~!");
    else
        m_arrHeadTailDevice = ["", "", "", ""];
}
function MenuStartState(strXML) {
    var devname = m_CurrentGraphItem.strDevName;
    var devtype = m_CurrentGraphItem.iDevType;
    var lGraphItemId = m_CurrentGraphItem.iGraphItemID;
    if (lGraphItemId != -1) { //选中单个元件
        if (devtype == 0 || (parseInt(devtype) > eDeviceTypeName.用户信息 && parseInt(devtype) != eDeviceTypeName.标示牌)) {
            return false;
        }
        if (devname != "") {
            if (parseInt(devtype) == eDeviceTypeName.标示牌) {
                m_pPsgpActive.AddPopMenu(StateCmdValue.DropPai, "<d>手动拆牌</d>");
                return;
            }
            if (m_bTzfsh == 1) {
                m_pPsgpActive.AddPopMenu(StateCmdValue.AddPai, "<d>手动挂牌</d>");
                m_pPsgpActive.AddPopMenu(StateCmdValue.AddJianXiu, "<d _mainmenu='" + StateCmdValue.AddPai + "'>检修标志</d>");
                m_pPsgpActive.AddPopMenu(StateCmdValue.AddGongZuo, "<d _mainmenu='" + StateCmdValue.AddPai + "'>有人工作</d>");
                SetDeviceStateMenu();
                GetHeadTailDevice(devname);
                m_pPsgpActive.AddPopMenu(StateCmdValue.ELOperate, "<d>地线操作</d>");
                if (devtype == eDeviceTypeName.母线 || m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, lGraphItemId, "isWending") == "1") {//母线，变压器绕组
                    m_pPsgpActive.AddPopMenu(StateCmdValue.AddOneEL, "<d _mainmenu='" + StateCmdValue.ELOperate + "'>悬挂地线</d>");
                    m_pPsgpActive.AddPopMenu(StateCmdValue.DropOneEL, "<d _mainmenu='" + StateCmdValue.ELOperate + "'>悬挂地线</d>");
                }
                if (devtype == eDeviceTypeName.单端线路 || devtype == eDeviceTypeName.普通开关 || devtype == eDeviceTypeName.线路 || devtype == eDeviceTypeName.小车刀闸 || devtype == eDeviceTypeName.刀闸 || devtype == eDeviceTypeName.小车) {//开关，线路//刀闸
                    m_pPsgpActive.AddPopMenu(StateCmdValue.AddEL, "<d _mainmenu='" + StateCmdValue.ELOperate + "'>单端悬挂地线</d>");
                    if (m_arrHeadTailDevice[0])
                        m_pPsgpActive.AddPopMenu(StateCmdValue.AddLeftEL, "<d _mainmenu='" + StateCmdValue.AddEL + "'>" + m_arrHeadTailDevice[1] + "</d>");
                    if (m_arrHeadTailDevice[2])
                        m_pPsgpActive.AddPopMenu(StateCmdValue.AddRightEL, "<d _mainmenu='" + StateCmdValue.AddEL + "'>" + m_arrHeadTailDevice[3] + "</d>");
                    m_pPsgpActive.AddPopMenu(StateCmdValue.DropEL, "<d _mainmenu='" + StateCmdValue.ELOperate + "'>单端卸除地线</d>");
                    if (m_arrHeadTailDevice[0])
                        m_pPsgpActive.AddPopMenu(StateCmdValue.DropLeftEL, "<d _mainmenu='" + StateCmdValue.DropEL + "'>" + m_arrHeadTailDevice[1] + "</d>");
                    if (m_arrHeadTailDevice[2])
                        m_pPsgpActive.AddPopMenu(StateCmdValue.DropRightEL, "<d _mainmenu='" + StateCmdValue.DropEL + "'>" + m_arrHeadTailDevice[3] + "</d>");
                    m_pPsgpActive.AddPopMenu(StateCmdValue.AddTwoEL, "<d _mainmenu='" + StateCmdValue.ELOperate + "'>两端悬挂地线</d>");
                }
                if (devtype == eDeviceTypeName.单端线路 || devtype == eDeviceTypeName.普通开关 || devtype == eDeviceTypeName.线路 || devtype == eDeviceTypeName.小车刀闸 || devtype == eDeviceTypeName.刀闸 || devtype == eDeviceTypeName.小车) {//开关，线路//刀闸
                    m_pPsgpActive.AddPopMenu(StateCmdValue.DropTwoEL, "<d _mainmenu='" + StateCmdValue.ELOperate + "'>双端卸除地线</d>");
                }
            }
        }
    }
}

function SetDeviceStateMenu() {
    m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d>-</d>");
    m_pPsgpActive.AddPopMenu(StateCmdValue.SetState, "<d>设置状态</d>");
    var cando = GraphAjax.GetDeviceState(m_iProcID.toString(), m_CurrentGraphItem.strDevName).value;
            if (cando.indexOf("1001") != -1)
                m_pPsgpActive.AddPopMenu(StateCmdValue.KGOpen, "<d _mainmenu='" + StateCmdValue.SetState + "'>拉开</d>");
            if (cando.indexOf("1002") != -1)
                m_pPsgpActive.AddPopMenu(StateCmdValue.KGClose, "<d _mainmenu='" + StateCmdValue.SetState + "'>闭合</d>");
            if (cando.indexOf("1015") != -1)
                m_pPsgpActive.AddPopMenu(StateCmdValue.YZOpen, "<d _mainmenu='" + StateCmdValue.SetState + "'>拉开</d>");
            if (cando.indexOf("1014") != -1)
                m_pPsgpActive.AddPopMenu(StateCmdValue.YZClose, "<d _mainmenu='" + StateCmdValue.SetState + "'>闭合</d>");
    if (cando.indexOf("2001") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.RDOpen, "<d _mainmenu='" + StateCmdValue.SetState + "'>断开</d>");
    if (cando.indexOf("2002") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.RDClose, "<d _mainmenu='" + StateCmdValue.SetState + "'>合上</d>");
    if (cando.indexOf("1101") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.DZOpen, "<d _mainmenu='" + StateCmdValue.SetState + "'>拉开</d>");
    if (cando.indexOf("1102") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.DZClose, "<d _mainmenu='" + StateCmdValue.SetState + "'>闭合</d>");
    if (cando.indexOf("1103") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.DZTest, "<d _mainmenu='" + StateCmdValue.SetState + "'>由工作位置拉至试验位置</d>");
    if (cando.indexOf("1104") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.DZWork, "<d _mainmenu='" + StateCmdValue.SetState + "'>由试验位置推至工作位置</d>");
    if (cando.indexOf("1105") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.DZJianXiu, "<d _mainmenu='" + StateCmdValue.SetState + "'>由试验位置拉至检修位置</d>");
    if (cando.indexOf("1106") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.DZToTest, "<d _mainmenu='" + StateCmdValue.SetState + "'>由检修位置推至试验位置</d>");
    if (cando.indexOf("2202") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.BYQRun, "<d _mainmenu='" + StateCmdValue.SetState + "'>转运行</d>");
    if (cando.indexOf("2201") != -1)
        m_pPsgpActive.AddPopMenu(StateCmdValue.BYQBY, "<d _mainmenu='" + StateCmdValue.SetState + "'>转备用</d>");
            if (cando.indexOf("1003") != -1)
                m_pPsgpActive.AddPopMenu(StateCmdValue.KGTest, "<d _mainmenu='" + StateCmdValue.SetState + "'>由工作位置拉至试验位置</d>");
            if (cando.indexOf("1004") != -1)
                m_pPsgpActive.AddPopMenu(StateCmdValue.KGWork, "<d _mainmenu='" + StateCmdValue.SetState + "'>由试验位置推至工作位置</d>");
            if (cando.indexOf("1005") != -1)
                m_pPsgpActive.AddPopMenu(StateCmdValue.KGJianXiu, "<d _mainmenu='" + StateCmdValue.SetState + "'>由试验位置拉至检修位置</d>");
            if (cando.indexOf("1006") != -1)
                m_pPsgpActive.AddPopMenu(StateCmdValue.KGToTest, "<d _mainmenu='" + StateCmdValue.SetState + "'>由检修位置推至试验位置</d>");
    switch (m_CurrentGraphItem.iDevType) {
        case eDeviceTypeName.普通开关:
            m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d _mainmenu='" + StateCmdValue.SetState + "'>-</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.KGRun, "<d _mainmenu='" + StateCmdValue.SetState + "'>转运行</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.KGHot, "<d _mainmenu='" + StateCmdValue.SetState + "'>转热备</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.KGCold, "<d _mainmenu='" + StateCmdValue.SetState + "'>转冷备</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.KGCheck, "<d _mainmenu='" + StateCmdValue.SetState + "'>转检修</d>");
            m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d _mainmenu='" + StateCmdValue.SetState + "'>-</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.KGUpload, "<d _mainmenu='" + StateCmdValue.SetState + "'>倒负荷</d>");
            break;
        case eDeviceTypeName.令克: //开关
            break;
        case eDeviceTypeName.小车开关:
            m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d _mainmenu='" + StateCmdValue.SetState + "'>-</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.KGRun, "<d _mainmenu='" + StateCmdValue.SetState + "'>转运行</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.KGHot, "<d _mainmenu='" + StateCmdValue.SetState + "'>转热备</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.KGCold, "<d _mainmenu='" + StateCmdValue.SetState + "'>转冷备</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.KGCheck, "<d _mainmenu='" + StateCmdValue.SetState + "'>转检修</d>");
            break;
        case eDeviceTypeName.熔断丝:
            break;
        case eDeviceTypeName.刀闸:
        case eDeviceTypeName.地刀: //地刀
            break;
        case eDeviceTypeName.小车刀闸:
        case eDeviceTypeName.小车: //刀闸
            break;
        case eDeviceTypeName.自藕可调绕组:
        case eDeviceTypeName.星型绕组:
        case eDeviceTypeName.三角绕组:
        case eDeviceTypeName.星型可调绕组:
        case eDeviceTypeName.自藕绕组:
        case eDeviceTypeName.星型接地绕组:
        case eDeviceTypeName.星型接地可调绕组: //绕组
            m_pPsgpActive.AddPopMenu(StateCmdValue.RZRun, "<d _mainmenu='" + StateCmdValue.SetState + "'>转运行</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.RZHot, "<d _mainmenu='" + StateCmdValue.SetState + "'>转热备</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.RZCold, "<d _mainmenu='" + StateCmdValue.SetState + "'>转冷备</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.RZCCheck, "<d _mainmenu='" + StateCmdValue.SetState + "'>转检修</d>");
            break;
        case eDeviceTypeName.母线: //母线
            m_pPsgpActive.AddPopMenu(StateCmdValue.MXRun, "<d _mainmenu='" + StateCmdValue.SetState + "'>转运行</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.MXHot, "<d _mainmenu='" + StateCmdValue.SetState + "'>转热备</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.MXCold, "<d _mainmenu='" + StateCmdValue.SetState + "'>转冷备</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.MXCheck, "<d _mainmenu='" + StateCmdValue.SetState + "'>转检修</d>");
            m_pPsgpActive.AddPopMenu(1005, "<d _mainmenu='" + StateCmdValue.SetState + "'>-</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.MXUpload, "<d _mainmenu='" + StateCmdValue.SetState + "'>倒负荷</d>");
            m_pPsgpActive.AddPopMenu(StateCmdValue.MXStandard, "<d _mainmenu='" + StateCmdValue.SetState + "'>恢复正常方式</d>");
            break;
        case eDeviceTypeName.线缆:
        case eDeviceTypeName.线路:
        case eDeviceTypeName.单端线路: //线路
//            m_pPsgpActive.AddPopMenu(StateCmdValue.XLRun, "<d _mainmenu='" + StateCmdValue.SetState + "'>转运行</d>");
//            m_pPsgpActive.AddPopMenu(StateCmdValue.XLHot, "<d _mainmenu='" + StateCmdValue.SetState + "'>转热备</d>");
//            m_pPsgpActive.AddPopMenu(StateCmdValue.XLCold, "<d _mainmenu='" + StateCmdValue.SetState + "'>转冷备</d>");
//            m_pPsgpActive.AddPopMenu(StateCmdValue.XLCheck, "<d _mainmenu='" + StateCmdValue.SetState + "'>转检修</d>");
            break;
        case eDeviceTypeName.变压器负荷:
            break;
        default:
            break;
    }
}
function EarthLineOperate(eltype, linkdevice) {
    var typeValue;
    var operdesc = "";
    switch (m_CurrentGraphItem.iDevType) {
        case eDeviceTypeName.普通开关:
        case eDeviceTypeName.小车开关:
        case eDeviceTypeName.令克: //开关
            typeValue = "101";
            operdesc = m_CurrentGraphItem.strDevDesc + "开关";
            break;
        case eDeviceTypeName.小车刀闸:
        case eDeviceTypeName.刀闸:
        case eDeviceTypeName.小车: //刀闸
        case eDeviceTypeName.地刀: //地刀
            typeValue = "111";
            operdesc = m_CurrentGraphItem.strDevDesc + "刀闸";
            break;
        case eDeviceTypeName.自藕可调绕组:
        case eDeviceTypeName.星型绕组:
        case eDeviceTypeName.三角绕组:
        case eDeviceTypeName.星型可调绕组:
        case eDeviceTypeName.自藕绕组:
        case eDeviceTypeName.星型接地绕组:
        case eDeviceTypeName.星型接地可调绕组: //绕组
            typeValue = "121";
            operdesc = m_CurrentGraphItem.strDevDesc + "变压器";
            break;
        case eDeviceTypeName.母线: //母线
            typeValue = "151";
            operdesc = m_CurrentGraphItem.strDevDesc + "母线";
            break;
        case eDeviceTypeName.线缆: //线路
        case eDeviceTypeName.线路: //线路
        case eDeviceTypeName.单端线路: //线路
            typeValue = "131";
            operdesc = m_CurrentGraphItem.strDevDesc + "线路";
            break;
        default:
            return;
    }
    if (eltype == "2" || eltype == "3") {
        if (typeValue == "151")
            return OnChangeState(typeValue + (eltype == "2" ? "0" : "1"), linkdevice, m_iProcID, operdesc + "单端" + (eltype == "2" ? "悬挂" : "拆除") + "地线");
        else
            return OnChangeState(typeValue + eltype, linkdevice, m_iProcID, operdesc + "单端" + (eltype == "2" ? "悬挂" : "拆除") + "地线");
    }
    else {
        return OnChangeState(typeValue + eltype, "", m_iProcID, operdesc + "两端" + (eltype == "0" ? "悬挂" : "拆除") + "地线");
    }
}
function JianXiuGuaPai() {
    GraphAjax.UpdateDevicePai(m_CurrentGraphItem.strDevName, "false", "禁止合闸");
    var devGraph = GetDevGraph(-1, m_CurrentGraphItem.strDevName, m_pPsgpActive);
    for (var i = 0; i < devGraph.length; i++) {
        var pRectPos = m_pPsgpActive.GetGraphItemProperty(devGraph[i][0], -1, devGraph[i][1], "graphRect");
        var rect = pRectPos.replace("<d><l>", "").replace("</l><t>", ",").replace("</t><r>", ",").replace("</r><b>", ",").replace("</b></d>", "").split(",");
        var w, h;
        if (rect.length != 4) {
            w = 0;
            h = 0;
        }
        else {
            w = (parseFloat(rect[2]) - parseFloat(rect[0], 10)) / 2;
            h = (parseFloat(rect[3]) - parseFloat(rect[1], 10)) / 2;
        }
        m_pPsgpActive.EditDrawGraph(devGraph[i][0], "DelPermanentDev", m_CurrentGraphItem.strDevName + "jx000");
        m_pPsgpActive.EditDrawGraph(devGraph[i][0], "AddPermanentDev", m_CurrentGraphItem.strDevName + "jx000#~!" + m_CurrentGraphItem.strDevName + "#~!" + (w - 5) + "," + (h + 5) + "#~!5#~!检修标示牌#~!检修#~!" + (w - 15) + "," + (h + 5) + "#~!宋体,9,0");
    }
}

function ZhanNeiDiXianPai() {
    GraphAjax.UpdateDevicePai(m_CurrentGraphItem.strDevName, "false", "有人工作");
    var devGraph = GetDevGraph(-1, m_CurrentGraphItem.strDevName, m_pPsgpActive);
    for (var i = 0; i < devGraph.length; i++) {
        var pRectPos = m_pPsgpActive.GetGraphItemProperty(devGraph[i][0], -1, devGraph[i][1], "graphRect");
        var rect = pRectPos.replace("<d><l>", "").replace("</l><t>", ",").replace("</t><r>", ",").replace("</r><b>", ",").replace("</b></d>", "").split(",");
        var w, h;
        if (rect.length != 4) {
            w = 0;
            h = 0;
        }
        else {
            w = (parseFloat(rect[2]) - parseFloat(rect[0], 10)) / 2;
            h = (parseFloat(rect[3]) - parseFloat(rect[1], 10)) / 2;
        }
        m_pPsgpActive.EditDrawGraph(devGraph[i][0], "DelPermanentDev", m_CurrentGraphItem.strDevName + "dx000");
        m_pPsgpActive.EditDrawGraph(devGraph[i][0], "AddPermanentDev", m_CurrentGraphItem.strDevName + "dx000#~!" + m_CurrentGraphItem.strDevName + "#~!" + (w + 3) + "," + (h - 5) + "#~!5#~!站内地线牌#~!人#~!" + (w - 3) + "," + (h - 10) + "#~!宋体,9,0");
    }
}

function ChaiPai(paiming) {
    if (paiming.replace("dx000", "") != paiming || paiming.replace("jx000", "") != paiming) {
        var devname = paiming.replace("dx000", "").replace("jx000", "");
        GraphAjax.UpdateDevicePai(devname, "true", "od");
    }
    m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), "DelPermanentDev", paiming);
}
function SucChangeState(changtype, otherdevice, changeProcID) { //调整成功，可重写,返回一个成功后的提示字符串
    switch (changtype) {
        case "4100":
        case "4101":
        case "4102":
        case "4000":
        case "4001":
        case "4002":
        case "4010":
        case "4011":
        case "4012":
        case "4020":
        case "4021":
        case "4022": //综合令拆检修牌
            ChaiPai(m_CurrentGraphItem.strDevName + "jx000");
            break;
        default:
            break;
    }
    return "";
}

function MenuCommondState(strXML, commandValue) {
    switch (commandValue) {
        case StateCmdValue.AddOneEL: //悬挂地线
            EarthLineOperate(2, "");
            break;
        case StateCmdValue.DropOneEL: //卸除地线
            EarthLineOperate(3, "");
            break;
        case StateCmdValue.AddLeftEL: //设备1端悬挂地线
            EarthLineOperate(2, m_arrHeadTailDevice[0]);
            break;
        case StateCmdValue.AddRightEL: //设备2端悬挂地线
            EarthLineOperate(2, m_arrHeadTailDevice[2]);
            break;
        case StateCmdValue.DropLeftEL: //设备1端卸除地线
            EarthLineOperate(3, m_arrHeadTailDevice[0]);
            break;
        case StateCmdValue.DropRightEL: //设备2端卸除地线
            EarthLineOperate(3, m_arrHeadTailDevice[2]);
            break;
        case StateCmdValue.AddTwoEL: //双端悬挂地线
            EarthLineOperate("0");
            break;
        case StateCmdValue.DropTwoEL: //双端卸除地线
            EarthLineOperate("1");
            break;
        case StateCmdValue.DropPai: //手动拆牌
            ChaiPai(m_CurrentGraphItem.strDevName);
            break;
        case StateCmdValue.AddJianXiu: //站内检修
            JianXiuGuaPai();
            break;
        case StateCmdValue.AddGongZuo: //有人工作
            ZhanNeiDiXianPai();
            break;
        case StateCmdValue.KGOpen: //开关拉开
            OnChangeState("1001", "", m_iProcID, "拉开" + m_CurrentGraphItem.strDevDesc + "开关");
            break;
        case StateCmdValue.KGClose: //开关闭合
            OnChangeState("1002", "", m_iProcID, "闭合" + m_CurrentGraphItem.strDevDesc + "开关");
            break;
        case StateCmdValue.KGTest: //小车至试验位置
            OnChangeState("1003", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "小车开关由工作位置拉至试验位置");
            break;
        case StateCmdValue.KGWork: //小车至工作位置
            OnChangeState("1004", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "小车开关由试验位置推至工作位置");
            break;
        case StateCmdValue.KGJianXiu: 
            OnChangeState("1005", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "小车开关由试验位置拉至检修位置");
            break;
        case StateCmdValue.KGToTest:
            OnChangeState("1006", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "小车开关由检修位置推至试验位置");
            break;
        case StateCmdValue.KGRun: //开关运行
            OnChangeState("4000", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "开关转运行");
            break;
        case StateCmdValue.KGHot: //开关热备
            OnChangeState("4001", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "开关转热备");
            break;
        case StateCmdValue.KGCold: //开关冷备
            OnChangeState("4002", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "开关转冷备");
            break;
        case StateCmdValue.KGCheck: //开关检修
            OnChangeState("4003", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "开关转检修");
            break;
        case StateCmdValue.KGUpload: //开关倒负荷
            OnChangeState("1080", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "开关倒负荷");
            break;
        case StateCmdValue.DZOpen: //刀闸拉开
            OnChangeState("1101", "", m_iProcID, "拉开" + m_CurrentGraphItem.strDevDesc + "刀闸");
            break;
        case StateCmdValue.DZClose: //刀闸闭合
            OnChangeState("1102", "", m_iProcID, "闭合" + m_CurrentGraphItem.strDevDesc + "刀闸");
            break;
        case StateCmdValue.DZTest: //小车至试验位置
            OnChangeState("1103", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "小车刀闸由工作位置拉至试验位置");
            break;
        case StateCmdValue.DZWork: //小车至工作位置
            OnChangeState("1104", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "小车刀闸由试验位置推至工作位置");
            break;
        case StateCmdValue.DZJianXiu:
            OnChangeState("1105", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "小车刀闸由试验位置拉至检修位置");
            break;
        case StateCmdValue.DZToTest:
            OnChangeState("1106", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "小车刀闸由检修位置推至试验位置");
            break;
        case StateCmdValue.RZRun: //变压器运行
            OnChangeState("4020", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "变压器转运行");
            break;
        case StateCmdValue.RZHot: //变压器热备
            OnChangeState("4021", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "变压器转热备");
            break;
        case StateCmdValue.RZCold: //变压器冷备
            OnChangeState("4022", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "变压器转冷备");
            break;
        case StateCmdValue.RZCCheck: //变压器检修
            OnChangeState("4023", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "变压器转检修");
            break;
        case StateCmdValue.MXRun: //母线运行
            OnChangeState("4010", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "母线转运行");
            break;
        case StateCmdValue.MXHot: //母线热备
            OnChangeState("4011", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "母线转热备");
            break;
        case StateCmdValue.MXCold: //母线冷备
            OnChangeState("4012", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "母线转冷备");
            break;
        case StateCmdValue.MXCheck: //母线检修
            OnChangeState("4013", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "母线转检修");
            break;
        case StateCmdValue.MXUpload: //母线倒负荷
            OnChangeState("1562", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "母线倒负荷");
            break;
        case StateCmdValue.MXStandard: //母线恢复正常方式
            OnChangeState("1564", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "母线恢复正常方式");
            break;
        case StateCmdValue.XLRun: //线路运行
            OnChangeState("4100", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "线路转运行");
            break;
        case StateCmdValue.XLHot: //线路热备
            OnChangeState("4101", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "线路转热备");
            break;
        case StateCmdValue.XLCold: //线路冷备
            OnChangeState("4102", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "线路转冷备");
            break;
        case StateCmdValue.XLCheck: //线路检修
            OnChangeState("4103", "", m_iProcID, "" + m_CurrentGraphItem.strDevDesc + "线路转检修");
            break;
        case StateCmdValue.RDOpen: //熔断丝拉开
            OnChangeState("2001", "", m_iProcID, "拉开" + m_CurrentGraphItem.strDevDesc + "熔断丝");
            break;
        case StateCmdValue.RDClose: //熔断丝合上
            OnChangeState("2002", "", m_iProcID, "合上" + m_CurrentGraphItem.strDevDesc + "熔断丝");
            break;
        case StateCmdValue.YZOpen: //令克拉开
            OnChangeState("1015", "", m_iProcID, "拉开" + m_CurrentGraphItem.strDevDesc + "油闸");
            break;
        case StateCmdValue.YZClose: //令克合上
            OnChangeState("1014", "", m_iProcID, "合上" + m_CurrentGraphItem.strDevDesc + "油闸");
            break;
        case StateCmdValue.BYQRun: 
            OnChangeState("2202", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "变压器负荷转运行");
            break;
        case StateCmdValue.BYQBY:
            OnChangeState("2201", "", m_iProcID, "将" + m_CurrentGraphItem.strDevDesc + "变压器负荷转备用");
            break;
        default:
            break;
    }
}

function StateMouseDClick(iGraphItemId, iKeyCode) {
    if (m_bTzfsh == 0)
        return;
    if (iGraphItemId > 0) {
        if (m_CurrentGraphItem.strDevName) {
            m_CurrentGraphItem.strDevDesc = m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, iGraphItemId, "name").replace(/#%~/g, "");
            var cando = GraphAjax.GetDeviceState(m_iProcID.toString(), m_CurrentGraphItem.strDevName).value;
            if (cando.indexOf("1001") != -1) {
                if (!confirm("是否拉开" + m_CurrentGraphItem.strDevDesc + "开关"))
                    return false;
                OnChangeState("1001", "", m_iProcID, "拉开" + m_CurrentGraphItem.strDevDesc + "开关");
            }
            if (cando.indexOf("1002") != -1) {
                if (!confirm("是否闭合" + m_CurrentGraphItem.strDevDesc + "开关"))
                    return false;
                OnChangeState("1002", "", m_iProcID, "闭合" + m_CurrentGraphItem.strDevDesc + "开关");
            }
            if (cando.indexOf("1101") != -1) {
                if (!confirm("是否拉开" + m_CurrentGraphItem.strDevDesc + "刀闸"))
                    return false;
                OnChangeState("1101", "", m_iProcID, "拉开" + m_CurrentGraphItem.strDevDesc + "刀闸");
            }
            if (cando.indexOf("1102") != -1) {
                if (!confirm("是否闭合" + m_CurrentGraphItem.strDevDesc + "刀闸"))
                    return false;
                OnChangeState("1102", "", m_iProcID, "闭合" + m_CurrentGraphItem.strDevDesc + "刀闸");
            }
            if (cando.indexOf("2001") != -1) {
                if (!confirm("是否拉开" + m_CurrentGraphItem.strDevDesc + "熔断丝"))
                    return false;
                OnChangeState("2001", "", m_iProcID, "拉开" + m_CurrentGraphItem.strDevDesc + "熔断丝");
            }
            if (cando.indexOf("2002") != -1) {
                if (!confirm("是否闭合" + m_CurrentGraphItem.strDevDesc + "熔断丝"))
                    return false;
                OnChangeState("2002", "", m_iProcID, "闭合" + m_CurrentGraphItem.strDevDesc + "熔断丝");
            }
        }
        return false;
    }
}