
var m_arrGraphItemRela = []; //图形跳转的保留值
var CommonCmdValue = {//公用POPMenu状态位
    Separator: 0xDFFF, SelectZoomIn: 0xDFFE, ZoomBack: 0xDFFD, DispAll: 0xDFFC, Move: 0xDFFB, GraphicPaperStyle: 0xDFFA,
    DevDefine: 0xDFF9, GraphStyle: 0xDFF8, Copy: 0xDFF7, Mirror: 0xDFF6, Rotate: 0xDFF5, Rotate90: 0xDFF4,
    Delete: 0xDFF3, NotValid: 0xDFF2, Valid: 0xDFF1, NotDefined: 0xDFF0, GridSnap: 0xDFEF, TypeManager: 0xDFEE,
    SetAllType: 0xDFED, SetViewType: 0xDFEC, HideGraph: 0xDFEB, GetLinkDev: 0xDFEA, OutUser: 0xDFE9, ChangeGraph: 0xDFE8,
    ChangeGraphStart: 0xDFD5, ChangeGraphEnd: 0xDFE5, //切换设备图形，需要一定数目的ID供使用，用一个范围，暂定16
    MenuDefineMulDevice: 0xDFBF, MenuShowLineGroup: 0xDFBE, ViewScheme: 0xDFBD, SetScheme: 0xDFBC, CancelScheme: 0xDFBB,
    SetDeviceColor: 0xDFBA, ChangeSchemeMode: 0xDFB9, SetAuthorityGraphItem: 0xDFB8
}
var m_GraphConfig = {
    IsNeedViewScheme: true,
    IsViewSchemeMode: false,     //add by wangbinbin 20130607 标记是否缩略图维护
    iViewGraphMode:0,             //add by wangbinbin 20130627 进入缩略图前的状态
    ViewDevColor:0              //add by wangbinbin 20130628 加入缩略图的设备在详细图中的颜色
};
var m_CurrentGraphItem = {//当前选择的图元
    iGraphItemID: -1,
    strDevName: "",
    strDevDesc: "",
    iDevType: 0,
    strDevType: ""
}

function AddGraphEvent(strEventName, funEvent) {
    if (m_pPsgpActive.addEventListener)
        m_pPsgpActive.addEventListener(strEventName, funEvent, false);
    else
        m_pPsgpActive.attachEvent(strEventName, funEvent);
}

function SetCurrentGraphItem(iGraphItemID) {
    m_CurrentGraphItem.iGraphItemID = iGraphItemID;;
    m_CurrentGraphItem.strDevName = m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, iGraphItemID, "key");
    m_CurrentGraphItem.strDevDesc = m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, iGraphItemID, "name").replace(/#%~/g, "");
    m_CurrentGraphItem.iDevType = parseInt(m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, iGraphItemID, "devType"));
    m_CurrentGraphItem.strDevType = m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, iGraphItemID, "templateTypeName");
}
var pointEvent = []; //事件触发地点

function MenuStart(strXML) {
    var xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc.loadXML(strXML);
    var xmlNode = xmlDoc.selectSingleNode("d");
    var nodeGraph = xmlNode.selectSingleNode("r");
    var nodePoint = xmlNode.selectSingleNode("point");
    pointEvent = [nodePoint.childNodes[0].text, nodePoint.childNodes[1].text];
    if (nodeGraph == null) {//点击空处
        m_pPsgpActive.AddPopMenu(CommonCmdValue.SelectZoomIn, "<d>选取放大</d>");
        m_pPsgpActive.AddPopMenu(CommonCmdValue.ZoomBack, "<d>显示回退</d>");
        m_pPsgpActive.AddPopMenu(CommonCmdValue.DispAll, "<d>显示全图</d>");
        m_pPsgpActive.AddPopMenu(CommonCmdValue.Move, "<d>平移</d>");
        if (m_iGraphMode == "1") {//编辑态
            m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d>-</d>");
            m_pPsgpActive.AddPopMenu(CommonCmdValue.TypeManager, "<d>图元类别管理</d>");
            m_pPsgpActive.AddPopMenu(CommonCmdValue.SetAllType, "<d>设置所有选中图元类别</d>");
            m_pPsgpActive.AddPopMenu(CommonCmdValue.SetViewType, "<d>设置显示图元类别</d>");
            m_pPsgpActive.AddPopMenu(CommonCmdValue.GraphicPaperStyle, "<d>图形设置</d>");
            //m_pPsgpActive.AddPopMenu(CommonCmdValue.MenuShowLineGroup, "<d>分级显示线路组</d>");
            m_pPsgpActive.AddPopMenu(CommonCmdValue.GridSnap, "<d" + ((m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getgridsnap") == "0") ? "" : " _option=\"8\"") + ">网格定位</d>");
            //add by wangbinbin 20130607
            if (m_GraphConfig.IsNeedViewScheme)
                m_pPsgpActive.AddPopMenu(CommonCmdValue.ChangeSchemeMode,"<d>进入缩略图维护</d>");
        } 
        else {
            if (m_GraphConfig.IsNeedViewScheme) {
                m_pPsgpActive.AddPopMenu(CommonCmdValue.ViewScheme, "<d>" + ((m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getsketchcreatetype") == "1") ? "详细图" : "缩略图") + "</d>");
                if (!m_GraphConfig.IsViewSchemeMode)
                    m_pPsgpActive.AddPopMenu(CommonCmdValue.ChangeSchemeMode, "<d>进入缩略图维护</d>");
                else
                    m_pPsgpActive.AddPopMenu(CommonCmdValue.ChangeSchemeMode, "<d>退出缩略图维护</d>");
            }
        }
        //            else {
        //                m_pPsgpActive.AddPopMenu(CommonCmdValue.SetViewType, "<d>设置显示图元类别</d>");
        //                if (m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getusertypeavail") == "1")
        //                    m_pPsgpActive.AddPopMenu(CommonCmdValue.HideGraph, "<d>显示隐藏图元</d>");
        //                else
        //                    m_pPsgpActive.AddPopMenu(CommonCmdValue.HideGraph, "<d>隐藏图元</d>");
        //            }
        if (window.MenuStartNull)
            MenuStartNull(strXML);
    }
    else {
        SetCurrentGraphItem(parseInt(nodeGraph.childNodes[0].text));
        if (m_CurrentGraphItem.iGraphItemID != -1) {//选中单个元件
            var devGraph = GetDevGraph(m_pPsgpActive.GetCurrGraphId(), m_CurrentGraphItem.strDevName, m_pPsgpActive);
            if (devGraph.length > 1) {
                m_pPsgpActive.AddPopMenu(CommonCmdValue.ChangeGraph, "<d>切换设备所在图形</d>");
                var iCount = 0;
                m_arrGraphItemRela = [];
                for (var j = 0; j < devGraph.length; j++) {
                    if (devGraph[j][0] != m_pPsgpActive.GetCurrGraphId() || devGraph[j][1] != m_CurrentGraphItem.iGraphItemID) {
                        m_arrGraphItemRela.push(devGraph[j][0]);
                        m_arrGraphItemRela.push(devGraph[j][1]);
                        var devdesc = m_pPsgpActive.GetGraphItemProperty(devGraph[j][0], -1, devGraph[j][1], "name").split("#%~");
                        m_pPsgpActive.AddPopMenu(CommonCmdValue.ChangeGraphStart + iCount, "<d _mainmenu='" + CommonCmdValue.ChangeGraph + "'>" + m_pPsgpActive.GetGraphicProperty(devGraph[j][0], "graphicName") + (devdesc[0] == -1 ? "" : "(" + devdesc[devdesc.length - 1] + ")") + "</d>");
                        iCount++;
                    }
                }
            }
            if (m_iGraphMode == "1") { //编辑态
                m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d>-</d>");
                if (m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "isdevice") == "1" || m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "isdynrefreshgraph") == "1") {//is Device and not dyngraph
                    m_pPsgpActive.AddPopMenu(CommonCmdValue.DevDefine, "<d>定义</d>");
                    if (!window.m_iProcID || window.m_iProcID == 0) {
                        //m_pPsgpActive.AddPopMenu(CommonCmdValue.MenuDefineMulDevice, "<d>线路组定义</d>");
                        m_pPsgpActive.AddPopMenu(CommonCmdValue.MenuShowLineGroup, "<d>分级显示线路组</d>");
                    }
                }
                m_pPsgpActive.AddPopMenu(CommonCmdValue.GraphStyle, "<d>图元样式</d>");
                var b = GraphAjax.GetAuthorityGraphItem(m_CurrentGraphItem.iGraphItemID);
                if (b.value == 1)
                    m_pPsgpActive.AddPopMenu(CommonCmdValue.SetAuthorityGraphItem, "<d>设置权限</d>");
                m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d>-</d>");
                m_pPsgpActive.AddPopMenu(CommonCmdValue.Copy, "<d>拷贝</d>");
                m_pPsgpActive.AddPopMenu(CommonCmdValue.Mirror, "<d>镜像</d>");
                m_pPsgpActive.AddPopMenu(CommonCmdValue.Rotate, "<d>旋转</d>");
                m_pPsgpActive.AddPopMenu(CommonCmdValue.Rotate90, "<d>旋转90度</d>");
                if (b.value == 1)
                    m_pPsgpActive.AddPopMenu(CommonCmdValue.Delete, "<d>删除</d>");
                if (m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "isdevice") == "1" &&
	                m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "isdefined") == "1")//选中单个已定义元件
                {
                    m_pPsgpActive.AddPopMenu(CommonCmdValue.Separator, "<d>-</d>");
                    if (m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "isvalid") == "1")
                        m_pPsgpActive.AddPopMenu(CommonCmdValue.NotValid, "<d>无效</d>");
                    else
                        m_pPsgpActive.AddPopMenu(CommonCmdValue.Valid, "<d>有效</d>");

                    m_pPsgpActive.AddPopMenu(CommonCmdValue.NotDefined, "<d>取消定义</d>");

                }
            }
            else {
                if (m_CurrentGraphItem.iDevType != 0 && m_CurrentGraphItem.iDevType < eDeviceTypeName.直连线) {
                    m_pPsgpActive.AddPopMenu(CommonCmdValue.GetLinkDev, "<d>连通性分析</d>");
                }//Modify by gud 20121107
                //                if (devtype == eDeviceTypeName.线路 || devtype == eDeviceTypeName.线缆 || devtype == eDeviceTypeName.单端线路)//开关
                //                    m_pPsgpActive.AddPopMenu(CommonCmdValue.OutUser, "<d>导出线路用户列表</d>");
                //if (m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "isnormaltext") == "1"/*是文本*/) {
                if(m_GraphConfig.IsViewSchemeMode)
                    if (typeof (SetSchemeMenu) == "function")
                        SetSchemeMenu(strXML);
                //update by wangbinbin 20130113
                //m_pPsgpActive.AddPopMenu(CommonCmdValue.SetSchemeFontSize, "<d>设置缩略图字体</d>");
                //}
            }
        }
        else
            SetSchemeMenu(strXML);
        if (window.MenuStartExt)
            MenuStartExt(strXML);
    }
}
var DevDefineWindow = null; //定义窗口为了在父窗口显示定位设备，加到公共js中
var MainDeviceWindow = null; //设置主设备窗口为了在父窗口显示，加到公共js中
var MulDeviceWindow = null; //设置线路窗口为了在父窗口显示，加到公共js中
var bClickNeedOther = false; //设置主设备时使用
function SetMainDevice() {
    $(divWindow).show();
    windowName.innerText = "主从设置";
    $(divWindow).animate({ top: document.body.clientHeight / 2 - 50, left: document.body.clientWidth / 2 - 185, width: 370, height: 100 }, "slow");
    frmWindow.location = "/GraphModule/SetMainDevice.aspx";
    //    if (MainDeviceWindow && !MainDeviceWindow.closed) {
    //        MainDeviceWindow.SetMainDevice();
    //        MainDeviceWindow.focus();
    //    }
    //    else
    //        MainDeviceWindow = OpenWindow("/GraphModule/SetMainDevice.aspx?a=" + Math.random(), "设置主设备", "height=100, width=370, top=282, left=341, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no");
}
function DisPoseWindow() {
    frmWindow.location = "about:blank";
    $(divWindow).hide("slow");
    //    if (DevDefineWindow && !DevDefineWindow.closed)
    //        DevDefineWindow.close();
    //    if (MainDeviceWindow && !MainDeviceWindow.closed)
    //        MainDeviceWindow.close();
    //    if (MulDeviceWindow && !MulDeviceWindow.closed)
    //        MulDeviceWindow.close();
}
function CommonDevDefine() {
    $(divWindow).show();
    windowName.innerText = "设备定义";
    $(divWindow).animate({ top: document.body.clientHeight / 2 - 185, left: document.body.clientWidth / 2 - 260, width: 520, height: 370 }, "slow");
    frmWindow.location = "/GraphModule/GraphDevDefine.aspx";
    //    if (DevDefineWindow && !DevDefineWindow.closed) {
    //        DevDefineWindow.DefineDevice();
    //        DevDefineWindow.focus();
    //    }
    //    else
    //        DevDefineWindow = OpenWindow("/GraphModule/GraphDevDefine.aspx?a=" + Math.random(), "设备定义", "height=350, width=520, top=248, left=341, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
}
function SetMulDevice() {
    $(divWindow).show();
    windowName.innerText = "定义线路";
    $(divWindow).animate({ top: document.body.clientHeight / 2 - 150, left: document.body.clientWidth / 2 - 200, width: 400, height: 300 }, "slow");
    frmWindow.location = "p.aspx?f=SetMulDevice";
    //    if (MulDeviceWindow && !MulDeviceWindow.closed) {
    //        MulDeviceWindow.SetMulDevice();
    //        MulDeviceWindow.focus();
    //    }
    //    else
    //        MulDeviceWindow = OpenWindow("/GraphModule/SetMulDevice.aspx?a=" + Math.random(), "定义线路", "height=150, width=270, top=248, left=341, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
}
function MenuCommand(strXML, commandValue) {
    switch (commandValue) {
        case CommonCmdValue.SelectZoomIn:
            OnZoomView("zoomrect");
            break;
        case CommonCmdValue.ZoomBack:
            OnZoomView("zoomback");
            break;
        case CommonCmdValue.DispAll:
            OnZoomView("zoomall");
            break;
        case CommonCmdValue.Move:
            OnZoomView("TOOL_SCROLL");
            break;
        case CommonCmdValue.GraphicPaperStyle:
            m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "setstylepopdlg", "0");
            break;
        case CommonCmdValue.DevDefine: //定义
            CommonDevDefine();
            break;
        case CommonCmdValue.MenuDefineMulDevice: //线路组定义
            SetMulDevice();
            break;
        case CommonCmdValue.MenuShowLineGroup: //分级显示线路组
            $(divWindow).show();
            windowName.innerText = "分级显示线路";
            $(divWindow).animate({ top: document.body.clientHeight / 2 - 125, left: document.body.clientWidth / 2 - 110, width: 220, height: 250 }, "slow");
            frmWindow.location = "/GraphModule/ShowLineMsg.aspx";
            //ShowModalDialog("/GraphModule/ShowLineMsg.aspx?&a=" + Math.random(), [m_pPsgpActive,m_CurrentGraphItem], "dialogWidth:220px; dialogHeight:200px; center:yes; help:no; resizable:no; status:no;scroll:no;");
            break;
        case CommonCmdValue.GraphStyle: //图元样式
            m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "setstylepopdlg", "");
            break;
        case CommonCmdValue.SetAuthorityGraphItem://设置权限
            var userIds = ShowModalDialog("/_appointuserdlg.aspx?a=" + Math.random(), m_CurrentGraphItem.iGraphItemID, "dialogWidth:450px; dialogHeight:500px; center:yes; help:no; resizable:no; status:no;scroll:no;");
            if (userIds == undefined)
                break;
            if (userIds != "")
                userIds += ';';
            GraphAjax.SetAuthorityGraphItem(m_CurrentGraphItem.iGraphItemID, userIds.replace(/,/g, ';'));
            break;
        case CommonCmdValue.Copy: //拷贝
            OnEdit("CopyWaitManualPaste");
            break;
        case CommonCmdValue.Mirror: //镜像
            OnEdit("MirrorManual");
            break;
        case CommonCmdValue.Rotate: //旋转
            OnEdit("RotateManual");
            break;
        case CommonCmdValue.Rotate90: //旋转90
            m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "rotategraphitem", "90");
            break;
        case CommonCmdValue.Delete: //删除
            OnEdit("DeleteSelected");
            GraphAjax.DelAuthorityGraphItem(m_CurrentGraphItem.iGraphItemID);
            break;
        case CommonCmdValue.NotValid: //无效
            m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "setdefined", "1");
            break;
        case CommonCmdValue.Valid: //有效
            m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "setdefined", "2");
            break;
        case CommonCmdValue.NotDefined: //取消定义
            m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, m_CurrentGraphItem.iGraphItemID, "setdefined", "0");
            break;
        case CommonCmdValue.GridSnap: //网格定位
            m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "setgridsnap",
			    (m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getgridsnap") == "0") ? "1" : "0");
            break;
        case CommonCmdValue.TypeManager: //图元类别管理
            ShowModalDialog("/GraphModule/GraphTypeDef.aspx?dlgtype=0&a=" + Math.random(), m_pPsgpActive, "dialogWidth:520px; dialogHeight:213px; center:yes; help:no; resizable:no; status:no;scroll:no;");
            break;
        case CommonCmdValue.SetAllType: //设置所有选中图元类别
            ShowModalDialog("/GraphModule/GraphTypeDef.aspx?dlgtype=1&a=" + Math.random(), m_pPsgpActive, "dialogWidth:520px; dialogHeight:213px; center:yes; help:no; resizable:no; status:no;scroll:no;");
            break;
        case CommonCmdValue.SetViewType: //设置显示图元类别
            ShowModalDialog("/GraphModule/GraphTypeDef.aspx?dlgtype=2&a=" + Math.random(), m_pPsgpActive, "dialogWidth:520px; dialogHeight:213px; center:yes; help:no; resizable:no; status:no;scroll:no;");
            break;
        case CommonCmdValue.HideGraph: //显示隐藏图元
            m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "setusertypeavail", "");
            m_pPsgpActive.UpdateWndByData("<_d><_graphId>" + m_pPsgpActive.GetCurrGraphId() + "</_graphId><_fromDb>1</_fromDb><_updtype>1</_updtype></_d>");
            break;
        case CommonCmdValue.GetLinkDev: //连通性分析
            SetDevLinkColor(m_CurrentGraphItem.strDevName);
            break;
        case CommonCmdValue.ViewScheme: //显示详细图/缩略图
            SetGraphViewScheme();
            break;
        case CommonCmdValue.SetScheme:
            SetScheme();
            break;
        case CommonCmdValue.CancelScheme:
            CancelScheme();
            break;
        case CommonCmdValue.SetDeviceColor:
            SetFont("设置设备颜色", 1);
            break;
        case CommonCmdValue.ChangeSchemeMode:
            MainFrame.ChangeSchemeMode();
            break;
        default:
            break;
    }
    if (commandValue >= CommonCmdValue.ChangeGraphStart && commandValue < CommonCmdValue.ChangeGraphEnd) {
        var graphj = commandValue - CommonCmdValue.ChangeGraphStart;
        OpenOneGraphic(m_arrGraphItemRela[graphj * 2]);
        m_pPsgpActive.OpenDeviceGraphic("<_d><_OpenType>1</_OpenType><_graphItemId>" + m_arrGraphItemRela[graphj * 2 + 1] + "</_graphItemId><_graphId>" + m_arrGraphItemRela[graphj * 2] + "</_graphId><_Type>0</_Type></_d>");
    }
    if (window.MenuCommandExt)
        MenuCommandExt(strXML, commandValue);
}

function MouseDClick(iGraphItemId, iKeyCode) {
    ClearDevLinkColor();
    SetCurrentGraphItem(iGraphItemId);
    if (m_iGraphMode == "1")  //编辑态
    {
        if (frmWindow.docFlow_spSDevice && bClickNeedOther) {
            var sDeviceName = m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, iGraphItemId, "name").replace(/#%~/g, "");
            if (sDeviceName == "")
                sDeviceName = m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, iGraphItemId, "key").replace(/#%~/g, "");
            if (sDeviceName == "")
                sDeviceName = m_pPsgpActive.GetCurrGraphId() + "**" + m_CurrentGraphItem.iGraphItemID;
            frmWindow.docFlow_spSDevice.innerText = sDeviceName;
            frmWindow.form1.docFlow_txtSDevice.value = iGraphItemId;
        }
        else {
            if (m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, iGraphItemId, "isdevice") == "1") {// is Device
                CommonDevDefine();
            }
            else
                m_pPsgpActive.SetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, iGraphItemId, "setstylepopdlg", "");
        }
    }
    if (window.MouseDClickExt)
        MouseDClickExt(iGraphItemId, iKeyCode);
}
function OnActiveGraph(iActive, iGraphId) {
    ClearDevLinkColor();
    if (window.OnActiveGraphExt)
        OnActiveGraphExt(iActive, iGraphId);
}
function MouseRClick(iGraphId, iFlag, bDown) {
    if (window.MouseRClickExt)
        MouseRClickExt(iGraphId, iFlag, bDown);
}
function MouseLClick(iGraphId, iFlag, bDown) {
    if (window.MouseLClickExt)
        MouseLClickExt(iGraphId, iFlag, bDown);
}
function GraphicViewChged(iGraphId, iFactor, strXML) {
    if (window.GraphicViewChgedExt)
        GraphicViewChgedExt(iGraphId, iFactor, strXML);
}
//add by wangbinbin 20130113 设置缩略图
function SetSchemeMenu(strXML) {
    if (!m_GraphConfig.IsNeedViewScheme)
        return false;
    var allSelectedGraphItemLinkStr = m_pPsgpActive.GetSelectedGraphItem();
    var xmlDoc1 = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc1.loadXML(allSelectedGraphItemLinkStr);
    xmlNode = xmlDoc1.selectSingleNode("d");
    if (xmlNode) {
        if (m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getsketchcreatetype") != "0") {
                m_pPsgpActive.AddPopMenu(CommonCmdValue.CancelScheme, "<d>取消缩略图显示</d>");
        }
        else {
            if (xmlNode.childNodes.length > 1) {
                //            var iGraphId=xmlNode.selectSingleNode("r").childNodes[0].text;
                //            var o=GraphAjax.GetSelLinDev(iGraphId);
                //            var ret = o.value;
                //            var str = ret.join(",");
                //            o = GraphAjax.GetSchemeMenuLine(str); 
                //            if((parseInt(o.value,10)+1)==xmlNode.childNodes.length)
                //                m_pPsgpActive.AddPopMenu(CommonCmdValue.CancelScheme, "<d>取消缩略图显示</d>");
                //            else
                m_pPsgpActive.AddPopMenu(CommonCmdValue.SetScheme, "<d>加入缩略图显示</d>");
        }
        else {
            var nodeGraph = xmlNode.selectSingleNode("r");
            var graphItem = nodeGraph.childNodes[0].text;
            if (graphItem == "")
                return false;
                if (m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, graphItem, "isshownonsketch") != "1")
                m_pPsgpActive.AddPopMenu(CommonCmdValue.SetScheme, "<d>加入缩略图显示</d>");
            else
                m_pPsgpActive.AddPopMenu(CommonCmdValue.CancelScheme, "<d>取消缩略图显示</d>");
        }
        }
        //m_pPsgpActive.AddPopMenu(CommonCmdValue.SetDeviceColor, "<d>设置设备颜色</d>");
    }
}

//function window.confirm(str) {
//    execScript("n = (msgbox('" + str + "',vbYesNo, '提示')=vbYes)", "vbscript");
//    return (n);
//}
var xmlNode_Scheme, strDevType_Scheme, strSize_Scheme, isText_Scheme = false;
function SetGraphViewScheme() {
    var viewGraphId = m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getidcorrespondence");
    if (viewGraphId != "0") {
        if (m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getsketchcreatetype") != "0")
            m_pPsgpActive.CloseGraphic("<_d><_graphId>" + m_pPsgpActive.GetCurrGraphId() + "</_graphId></_d>");
        m_pPsgpActive.OpenGraphic("<_d><_graphId>" + viewGraphId + "</_graphId></_d>");
        if (m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getsketchcreatetype") == "0") {
            //MainFrame.SetViewColor();
            if (typeof (OpenGraphicEvtExt) == "function")
                ShowFaultDev();
        }
    }
    else
        alert("没有缩略图！");
}
function GetSchemeList(flag) {//0-取消 1-加入
    var allSelectedGraphItemLinkStr = m_pPsgpActive.GetSelectedGraphItem();
    var xmlDoc1 = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc1.loadXML(allSelectedGraphItemLinkStr);
    xmlNode = xmlDoc1.selectSingleNode("d");
    if (xmlNode) {
        var strScheme = "";
        if (flag == 1)
            strScheme += "<t><bat color=\""+m_GraphConfig.ViewDevColor+"\" forcetype=\"3\">";
        else
            strScheme += "<d>";
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var nodeGraph = xmlNode.childNodes[i];
                var graphItem = nodeGraph.childNodes[0].text;
            if (graphItem == "")
                continue;
            if (flag == 1)
                strScheme += ("<d>" + graphItem + "</d>");
            else
                strScheme += ("<graphid>" + graphItem + "</graphid>");
//            var textItem = GetDevText(graphItem);
//            if (textItem != "")
//                strScheme += ("<graphid>" + textItem + "</graphid>");
        }
        if (flag == 1)
            strScheme += "</bat></t>";
        else
            strScheme += "</d>";
        return strScheme;
                }
    return "";
            }
function SetScheme() {
    var strScheme = GetSchemeList(1);
    if (strScheme == "")
                    return false;
    var isDone = m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "addgraphtoshowonsketch", strScheme);
    if (isDone == 1) {
//        if (MainFrame.SetViewColor())
//            MainFrame.SetViewColor();
        alert("设置成功！");
                }
            }
function CancelScheme() {
    var isDone = 1;
    if (m_pPsgpActive.GetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "getsketchcreatetype") == "0") {
        var strScheme = GetSchemeList(0);
        if (strScheme == "")
                return false;
        isDone = m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "cancelgraphtoshowonsketch", strScheme);
            }
    else
        m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), "DeleteSelected","");
    if (isDone == 1) {
//        MainFrame.CancelViewColor(strScheme);
        alert("取消成功！");
    }
}
function SetGraphScheme(strColor) {
    var arr = new Array();
    var strScheme = "<d>";
    if (strColor == undefined)
        strColor = -1;
    for (var i = 0; i < xmlNode_Scheme.childNodes.length; i++) {
        var nodeGraph = xmlNode_Scheme.childNodes[i];
        var graphItem = nodeGraph.childNodes[0].text;
        if (graphItem == "")
            return false;
        var arrAdd = new Array();
        if (isText_Scheme) {
            arrAdd.push(graphItem);
            arrAdd.push(strSize_Scheme);
            arrAdd.push(strColor);
            arr.push(arrAdd);
        }
        else {
            if (m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, graphItem, "isnormaltext") == "1")
                continue;
            strScheme += ("<a><graphid>" + graphItem + "</graphid>");
            var graphType = nodeGraph.childNodes[1].text;
            arrAdd.push(graphItem);
            arrAdd.push("0");
            arrAdd.push("-1");
            arr.push(arrAdd);
            graphItem = GetDevText(graphItem);
            if (strSize_Scheme == "")
                strSize_Scheme = GetFontSize(strDevType_Scheme, graphType);
            if (graphItem == "" || graphType == "" || graphType == 0) {
                strScheme += ("<fontsize>" + strSize_Scheme + "</fontsize>");
                strScheme += ("<fontcolor>" + strColor + "</fontcolor></a>");
                continue;
            }
            arrAdd = new Array();
            arrAdd.push(graphItem);
            if (strSize_Scheme != "") {
                arrAdd.push(strSize_Scheme);
                strScheme += ("<fontsize>" + strSize_Scheme + "</fontsize>");
            }
            else {
                arrAdd.push(graphType);
                strScheme += ("<fontsize>" + graphType + "</fontsize>");
            }
            arrAdd.push(strColor);
            strScheme += ("<fontcolor>" + strColor + "</fontcolor></a>");
            arr.push(arrAdd);
        }
    }
    var o = GraphAjax.SetScheme(arr);
    strScheme += "</d>";
    m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "AddGraphToShowOnSketch", strScheme);
    alert("设置成功！");
}
function SetFont(title, type) {
    $(divWindow).show();
    windowName.innerText = (title == undefined ? "设置字体颜色" : title);
    $(divWindow).animate({ top: document.body.clientHeight / 2 - 150, left: document.body.clientWidth / 2 - 200, width: 400, height: 300 }, "slow");
    frmWindow.location = "p.aspx?f=setfont" + (type == undefined ? "" : "&type=" + type);
}
function GetDevText(strItem) {
    var strItemID = m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, strItem, "relachildgraphitem");
    if (strItemID == "")
        return "";
    var arrItems = strItemID.split("***");
    for (var i = 0; i < arrItems.length; i++) {
        if (m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, arrItems[i], "isnormaltext") == "1"/*是文本*/)
        return strItemID;
    }
        return "";
}
function GetFontSize(arr, value) {
    if (value == "")
        return "";
    for (var i = 1; i < arr.length; i++) {
        if (arr[i][0] == value)
            return arr[i][1];
    }
    return arr[0][1];
}
function SetSize(strMsg, strSize) {
    var fontSize = ""
    while (true) {
        fontSize = prompt(strMsg, strSize); //GraphAjax.GetSchemeFontSize(m_CurrentGraphItem.iGraphItemID).value
        if (fontSize == null)
            return "";
        fontSize = parseInt(fontSize, 10);
        if (isNaN(fontSize)) {
            alert("请输入正确的整数!");
        } else {
            if (fontSize < 0) {
                alert("请输入非负整数!");
            } else {
                break;
            }
        }
    }
    return fontSize;
}
function SetDeviceColor(strColor) {
    if (strColor == undefined)
        strColor = -1;
    var allSelectedGraphItemLinkStr = m_pPsgpActive.GetSelectedGraphItem();
    var xmlDoc1 = new ActiveXObject("Msxml2.DOMDocument");
    xmlDoc1.loadXML(allSelectedGraphItemLinkStr);
    xmlNode = xmlDoc1.selectSingleNode("d");
    if (xmlNode) {
        var strGraphItem = "<d>";
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var nodeGraph = xmlNode.childNodes[i];
            var graphItem = nodeGraph.childNodes[0].text;
            if (graphItem == "" || m_pPsgpActive.GetGraphItemProperty(m_pPsgpActive.GetCurrGraphId(), -1, graphItem, "isnormaltext") == "1")
                continue;
            strGraphItem += ("<id>" + graphItem + "</id>");
        }
        //strGraphItem += ("<id>4172469</id>");
        strGraphItem += "</d>";
        //m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "unselectall", "");
        //m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "selectgraphitems",strGraphItem);
        m_pPsgpActive.EditDrawGraph(m_pPsgpActive.GetCurrGraphId(), "setlinecolor", strColor);
    }
    alert("设置成功！");
}
function GetWebServiceReturn(str) {
    return GraphAjax.GetWebServiceReturn(str);
}
//add end///Add by gud 20130221
function ActiveXInited(obj, addr) {
    //obj.SetTypeItem("_WebServerAddr", addr);
    //update by wangbinbin 20130423
    var arr = addr.split(":");
    if (arr.length != 2) {
        alert("图形NetServer连接设置错误，请重新设置！");
        return false;
    }
    obj.SetTypeItem("_ServerDataType", "1");
    obj.SetTypeItem("_SocketServerIP", arr[0]);
    obj.SetTypeItem("_SocketPort", arr[1]);
    obj.SetTypeItem("_AutoCrossNode", "1");
    obj.SetTypeItem("_DrawWithNatureColor", "<d><a>配电所</a><a>厂站资料</a><a>人员资料</a><a>标示牌</a><a>检修标示牌</a><a>站内地线牌</a><a>分接箱</a><a>环网柜</a><a>箱体</a></d>");
    obj.SetTypeItem("_AutoAddTextDevList", "<d><a>杆塔</a><a>配变</a><a>负荷</a><a>负荷开关</a><a>刀闸</a><a>接地刀闸</a><a>开关</a><a>熔断器</a><a>小车</a><a>小车刀闸</a><a>小车开关</a><a>方杆</a><a>分接箱</a><a>公变</a><a>公用箱变</a><a>环网柜</a><a>看门狗开关</a><a>联络开关</a><a>普通开关</a><a>铁塔</a><a>圆杆</a><a>柱上刀闸</a><a>柱上开关</a><a>专变</a><a>专用箱变</a><a>单端线路</a><a>发电机</a><a>母线</a><a>三角绕组</a><a>箱体</a><a>星型接地可调绕组</a><a>星型接地绕组</a><a>星型可调绕组</a><a>星型绕组</a><a>自备电源</a><a>绝缘子</a><a>环网柜刀闸</a><a>环网柜地刀</a><a>环网柜开关</a><a>环网柜小车</a><a>环网柜小车刀闸</a><a>环网柜小车开关</a><a>PT2</a><a>PT3</a><a>避雷器</a><a>串联电抗</a><a>电容器</a><a>放电间隙</a><a>固定接地</a><a>接地电抗</a><a>绝缘子</a><a>跨接线</a><a>串联电抗</a></d>");
    obj.SetTypeItem("_AutoTextStyle", "<d><a><devtype>开关</devtype><config><color>255,255,0</color><fontsize>,20</fontsize></config></a><a><devtype>负荷开关</devtype><config><color>255,255,0</color><fontsize>,14</fontsize></config></a><a><devtype>刀闸</devtype><config><color>255,255,0</color><fontsize>,18</fontsize></config></a><a><devtype>接地刀闸</devtype><config><color>255,255,0</color><fontsize>,18</fontsize></config></a><a><devtype>熔断器</devtype><config><color>255,255,0</color><fontsize>,18</fontsize></config></a><a><devtype>小车</devtype><config><color>255,255,0</color><fontsize>,20</fontsize></config></a><a><devtype>小车刀闸</devtype><config><color>255,255,0</color><fontsize>,20</fontsize></config></a><a><devtype>小车开关</devtype><config><color>255,255,0</color><fontsize>,20</fontsize></config></a><a><devtype>环网柜刀闸</devtype><config><color>255,255,0</color><fontsize>,14</fontsize></config></a><a><devtype>环网柜地刀</devtype><config><color>255,255,0</color><fontsize>,14</fontsize></config></a><a><devtype>环网柜开关</devtype><config><color>255,255,0</color><fontsize>,14</fontsize></config></a><a><devtype>环网柜小车</devtype><config><color>255,255,0</color><fontsize>,14</fontsize></config></a><a><devtype>环网柜小车刀闸</devtype><config><color>255,255,0</color><fontsize>,14</fontsize></config></a><a><devtype>环网柜小车开关</devtype><config><color>255,255,0</color><fontsize>,14</fontsize></config></a><a><devtype>杆塔</devtype><config><color>255,255,255</color><fontsize>,14</fontsize></config></a><a><devtype>配变</devtype><config><color>255,255,255</color><fontsize>,12</fontsize></config></a><a><devtype>负荷</devtype><config><color>255,255,255</color><fontsize>,12</fontsize></config></a><a><devtype>电容器</devtype><config><color>255,255,0</color><fontsize>,16</fontsize></config></a><a><devtype>分接箱</devtype><config><color>106,90,205</color><fontsize>,22</fontsize></config></a><a><devtype>环网柜</devtype><config><color>106,90,205</color><fontsize>,22</fontsize></config></a><a><devtype>箱体</devtype><config><color>128,42,42</color><fontsize>,24</fontsize></config></a><a><devtype>架空线</devtype><config><color>255,0,0</color><fontsize>,20</fontsize></config></a></d>");
    obj.SetTypeItem("_AddNameToChildNameDevList", "<d><a>分接箱</a><a>环网柜</a><a>箱体</a><a>开关</a><a>刀闸</a></d>");
    obj.SetTypeItem("_AutoHideChildDevList", "<d><a>分接箱</a><a>环网柜</a><a>箱体</a></d>");
    obj.SetTypeItem("_InnerDevTotallyFilledDevList", "<d><a>分接箱</a><a>环网柜</a><a>箱体</a><a>杆塔</a><a>圆杆</a><a>方杆</a></d>");
    obj.SetTypeItem("_OneSideDragDevList", "<d><a>分接箱</a><a>环网柜</a><a>箱体</a></d>");
    obj.SetTypeItem("_SelectWithinRectText", "0");
    obj.SetTypeItem("_IsSelectForceColor", "0");
    obj.SetTypeItem("_DynTextBeEditable", "1"); //设置文本可以编辑
    obj.SetTypeItem("_HiddenInRightTabGroupList", "<d><a>废弃设备</a><a>导入设备</a><a>Dynamic_临时生成</a></d>"); //隐藏抽屉
    obj.SetTypeItem("_SetDefaultVolidx", "kv10");//设备定义默认电压等级
}
///Add end