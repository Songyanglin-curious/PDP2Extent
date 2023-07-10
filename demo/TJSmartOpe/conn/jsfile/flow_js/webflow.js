// JScript File -- Edit by Gud
function newFlow() {
    if (g_Flow != null) { if (!confirm('不保存旧流程，创建新流程吗？\n\nDon\'t save the old flow,and Create a new flow?')) return; delete g_Flow; }
    g_Flow = new f_Flow();
    redrawVML();
    workFlowDialog(null, 'Flow', function () { self.location.reload(); });
    
}
function newStep(stepType) { workFlowDialog(null, "Step" + stepType); }
function newStepCopy(stepId) { workFlowDialog(stepId, "StepCopy"); }
function newAction() { workFlowDialog(null, 'Action'); }
function editFlow() { workFlowDialog(g_Flow.id, 'Flow'); }
function editStep(stepId, stepType) { workFlowDialog(stepId, "Step" + stepType); }
function editAction(actionId) { workFlowDialog(actionId, 'Action'); }
function restoreStep(stepId) { g_Flow.getStep(stepId).show = "1"; redrawVML(); objFocusedOn(stepId, "Step"); }
function deleteStep(stepId) { if (!confirm("您确实要永久删除步骤" + stepId + "吗？")) return; g_Flow.delStep(g_Flow.getStep(stepId)); redrawVML(); }
function delStep(stepId) {
    if (!confirm("您确实要从图上删除步骤" + stepId + "吗？")) return;
    var Step = g_Flow.getStep(stepId);
    if (parseInt(Step.show, 10) > 1) { g_Flow.delStep(Step); } else { Step.show = "0"; g_Flow.delActions(Step); }
    redrawVML();
}
function delAction(actionId) { if (!confirm("您确实要删除动作" + actionId + "吗？")) return; g_Flow.delAction(g_Flow.getAction(actionId)); redrawVML(); }

var CONST_LAY_LOWEST = "0";
var CONST_LAY_LOWER = "10";
var CONST_LAY_MIDDLE = "20";
var CONST_LAY_TOPPER = "30";
var CONST_LAY_TOPPEST = "40";

var FOCUSEDOBJID = "", FOCUSEDOBJTYPE = "";
var LINKSTART = true, LINKSTARTSTEPID = "";

var CURRENTX = CURRENTY = 0;
var COORDX = COORDY = 2000;
var XRATE = YRATE = 0;
var MOVEOBJ = null;
var MOVEFLAG = false;
var MOVEFUNC = null;

var VML_LINKLINE = null;
var VML_FLOWOBJ = null;

function setObjZIndex(obj, drawIndex, zIndex) { if (null == obj) return; document.getElementById(obj.id).style.zIndex = drawIndex; obj.zIndex = zIndex; }

function objFocusedOn(objId, type) {
    if (null == g_Flow) return;
    var focusedOnColor = type == "Action" ? g_Flow.cfg.actionFocusClr : g_Flow.cfg.stepFocusClr;
    /*setObjZIndex((type == "Action") ? g_Flow.getAction(objId) : g_Flow.getStep(objId), parseInt(CONST_LAY_TOPPEST, 10) + 1, parseInt(CONST_LAY_TOPPEST, 10) + 1);
    document.getElementById(objId).StrokeColor = focusedOnColor;
    if (FOCUSEDOBJID == objId && MOVEFLAG)
        return;
    if (FOCUSEDOBJID != objId)
        objFocusedOff();
    FOCUSEDOBJID = objId;
    FOCUSEDOBJTYPE = type;
    */
}

function objFocusedOff() {
    if ((FOCUSEDOBJID == '') || (null == g_Flow))
        return;
    focusedOffColor = (FOCUSEDOBJTYPE == "Action") ? g_Flow.cfg.actionClr : g_Flow.getStep(FOCUSEDOBJID).getBorderClr(g_Flow.cfg);
    eval("document.all." + FOCUSEDOBJID + ".StrokeColor='" + focusedOffColor + "'");
    FOCUSEDOBJID = '';
    FOCUSEDOBJTYPE = '';
}

function moveStep(moveId) {
    if (!LINKSTART)
        dragIt(moveId);
    else
        linkStart(moveId);
}

function redrawAction(Action) {
    var aId = Action.id;
    document.getElementById(aId).style.zIndex = CONST_LAY_TOPPEST;
    Action.zIndex = CONST_LAY_TOPPEST;
    var pts = Action.getActionPoints();
    document.getElementById(aId).points.value = getPointsStr(pts);
    if (Action.fromStep.type != "2") return;
    var textpts = getTextPoints(pts);
    if (textpts.length == 0) return;
    var judgetext = document.getElementById("judgeresult" + aId);
    judgetext.style.left = textpts[0];
    judgetext.style.top = textpts[1];
}

function innerMove(newLeft, newTop) {
    var Step = g_Flow.getStep(MOVEOBJ.id);
    if (null == Step) return;
    Step.x = newLeft;
    Step.y = newTop;
    for (var i = 0; i < Step.getEntryCount(); i++)
        redrawAction(Step.entry(i));
    for (var j = 0; j < Step.getExitCount(); j++)
        redrawAction(Step.exit(j));
}

function moveIt() {
    if (MOVEOBJ == null) return false;
    MOVEFLAG = true;
    var newX = (event.clientX + document.body.scrollLeft);
    var newY = (event.clientY + document.body.scrollTop);
    var distanceX = parseInt(XRATE * (newX - CURRENTX), 10); //X坐标换算
    var distanceY = parseInt(YRATE * (newY - CURRENTY), 10); //Y坐标换算	
    var newLeft = parseInt(MOVEOBJ.style.left, 10) + distanceX;
    var newTop = parseInt(MOVEOBJ.style.top, 10) + distanceY;
    // if (inRect(newLeft, newTop, 0, 0, COORDX - parseInt(MOVEOBJ.style.width, 10), COORDY - parseInt(MOVEOBJ.style.height, 10))) {
   if ((newLeft >= 0)&&(newTop >= 0)) {
        MOVEOBJ.style.left = newLeft;
        MOVEOBJ.style.top = newTop;
        MOVEOBJ.style.zIndez = CONST_LAY_TOPPEST;
        CURRENTX = newX;
        CURRENTY = newY;
        innerMove(newLeft, newTop);
    }
    event.returnValue = false;
    return false;
}

function innerDrop() {
    if (!MOVEFLAG) return;
    MOVEFLAG = false;
    if (MOVEOBJ == null) return;
    var Step = g_Flow.getStep(MOVEOBJ.id);
    if (null == Step) return;
    Step.x = MOVEOBJ.style.left;
    Step.y = MOVEOBJ.style.top;
    Step.zIndex = CONST_LAY_TOPPEST;
}

function dropIt() {
    innerDrop();
    MOVEOBJ = null;
    VML_FLOWOBJ.releaseCapture();
    return true;
}

function dragIt(obj) {
    MOVEFUNC = document.onmousemove;
    document.onmousemove = moveIt;
    document.onmouseup = dropIt;

    MOVEOBJ = obj;
    CURRENTX = (event.clientX + document.body.scrollLeft);
    CURRENTY = (event.clientY + document.body.scrollTop);

    var pt = new f_Point();
    pt.parse(VML_FLOWOBJ.coordsize.value);
    COORDX = pt.x;
    COORDY = pt.y;
    XRATE = COORDX / parseInt(VML_FLOWOBJ.style.width, 10);
    YRATE = COORDY / parseInt(VML_FLOWOBJ.style.height, 10);

    VML_FLOWOBJ.setCapture();
    return true;
}

function getPosition(obj) {
    var top = obj.offsetTop;
    var left = obj.offsetLeft;
    while (obj = obj.offsetParent) {
        top += obj.offsetTop;
        left += obj.offsetLeft;
    };
    return { "top": top, "left": left };
}
/*
function ScreenToClientX(obj, coord, x) { return parseInt((x - parseInt(obj.style.left, 10)) * coord.x / parseInt(obj.style.width, 10), 10); }

function ScreenToClientY(obj, coord, y) { return parseInt((y - parseInt(obj.style.top, 10)) * coord.y / parseInt(obj.style.height, 10), 10); }
*/
function ScreenToClientX(obj, coord, x) {
    var pos = getPosition(obj);
    return parseInt((x + parseInt(obj.parentElement.scrollLeft, 10) - pos.left) * coord.x / parseInt(obj.style.width, 10), 10); 
}

function ScreenToClientY(obj, coord, y) {
    var pos = getPosition(obj);
    return parseInt((y + parseInt(obj.parentElement.scrollTop, 10) - pos.top) * coord.y / parseInt(obj.style.height, 10), 10); 
}

function linkStart(startStep) {
    if (g_Flow.getStep(startStep.id).flowStep.type == "3")
        return;
    LINKSTARTSTEPID = startStep.id;
    MOVEFUNC = document.onmousemove;
    document.onmousemove = linkIt;
    document.onmouseup = linkEnd;

    var coord = new f_Point();
    coord.parse(VML_FLOWOBJ.coordsize.value);
    var x = ScreenToClientX(VML_FLOWOBJ, coord, event.clientX + document.body.scrollLeft);
    var y = ScreenToClientY(VML_FLOWOBJ, coord, event.clientY + document.body.scrollTop);
    VML_LINKLINE.from = x + "," + y;
    VML_LINKLINE.to = x + "," + y;

    VML_FLOWOBJ.setCapture();
    return true;
}

function inRect(x, y, left, top, width, height) {
    return !((x < left) || (y < top) || (x > left + width) || (y > top + height));
}

function linkIt() {
    var coord = new f_Point();
    coord.parse(VML_FLOWOBJ.coordsize.value);
    var xScreen = event.clientX + document.body.scrollLeft;
    var yScreen = event.clientY + document.body.scrollTop;
    var x = ScreenToClientX(VML_FLOWOBJ, coord, xScreen);
    var y = ScreenToClientY(VML_FLOWOBJ, coord, yScreen);
    //    if (inRect(x, y, 0, 0, coord.x, coord.y))
    //    VML_LINKLINE.to = x + "," + y;
    event.returnValue = false;
    //控制滚动条
    var div = VML_FLOWOBJ.parentElement;
    VML_LINKLINE.to = x + "," + y;
    var divPos = getPosition(div); //得到div的绝对位置
    if (xScreen <= divPos.left)
        div.scrollLeft = Math.max(0, div.scrollLeft - 100);
    if (yScreen <= divPos.top)
        div.scrollTop = Math.max(0, div.scrollTop - 100);
    if (xScreen >= divPos.left + parseInt(div.clientWidth, 10))
        div.scrollLeft = Math.min(div.scrollLeft + 100, divPos.left + parseInt(div.scrollWidth, 10) - parseInt(div.clientWidth, 10) - 50);  //div.scrollWidth
    if (yScreen >= divPos.top + parseInt(div.clientHeight, 10))
        div.scrollTop = Math.min(div.scrollTop + 100, divPos.top + parseInt(div.scrollHeight, 10) - parseInt(div.clientHeight, 10) - 50);
    return false;
}

function linking(x, y) {
    var linkEndStep = null;
    for (var i = 0; i < g_Flow.getStepCount(); i++) {
        var Step = g_Flow.step(i);
        if (Step.show < 1)
            continue;
        if (!inRect(x, y, parseInt(Step.x, 10), parseInt(Step.y, 10), parseInt(Step.width, 10), parseInt(Step.height, 10)))
            continue;
        if (null == linkEndStep) {
            linkEndStep = Step;
        } else {
            var newZ = parseInt(Step.zIndex, 10);
            if (isNaN(newZ))
                continue;
            if (parseInt(linkEndStep.zIndex, 10) < newZ)
                linkEndStep = Step;
        }
    }
    if (null == linkEndStep)
        return;
    if (linkEndStep.id == LINKSTARTSTEPID)
        return;
    /*if (linkEndStep.flowStep.type == "1") {
        alert("不许有回开始步骤的动作");
        return;
    }*/
    for (var j = 0; j < linkEndStep.getEntryCount(); j++) {
        var Action = linkEndStep.entry(j);
        if (Action.fromStep.id == LINKSTARTSTEPID) {
            alert("和已有动作重复，请重新选择！");
            return;
        }
    }
    workFlowDialog(LINKSTARTSTEPID + "," + linkEndStep.id, "Action");
}

function linkEnd() {
    document.onmousemove = MOVEFUNC;
    document.onmouseup = null;
    if (LINKSTARTSTEPID != '') {
        var coord = new f_Point();
        coord.parse(VML_FLOWOBJ.coordsize.value);
        var x = ScreenToClientX(VML_FLOWOBJ, coord, event.clientX + document.body.scrollLeft);
        var y = ScreenToClientY(VML_FLOWOBJ, coord, event.clientY + document.body.scrollTop);
        linking(x, y);
    }
    LINKSTARTSTEPID = '';
    VML_LINKLINE.from = "0,0";
    VML_LINKLINE.to = "0,0";
    VML_FLOWOBJ.releaseCapture();
}

function setStepOffset(o, key) {
    var Step = g_Flow.getStep(o.id);
    if (null == Step)
        return;
    if (event.ctrlKey) {
        switch (key) {
            case 37: Step.width--; o.style.width = parseInt(o.style.width, 10) - 1; return;
            case 38: Step.height--; o.style.height = parseInt(o.style.height, 10) - 1; return;
            case 39: Step.width++; o.style.width = parseInt(o.style.width, 10) + 1; return;
            case 40: Step.height++; o.style.height = parseInt(o.style.height, 10) + 1; return;
            default: return;
        }
    }
    switch (key) {
        case 37: Step.x--; o.style.left = parseInt(o.style.left, 10) - 1; return;
        case 38: Step.y--; o.style.top = parseInt(o.style.top, 10) - 1; return;
        case 39: Step.x++; o.style.left = parseInt(o.style.left, 10) + 1; return;
        case 40: Step.y++; o.style.top = parseInt(o.style.top, 10) + 1; return;
        default: return;
    }
}

function getGnrFlowStepEvents(flowStep) {
    return (flowStep.type == "2") ? " onkeydown='setStepOffset(this,event.keyCode);if (event.keyCode==46) delStep(this.id);'" : " onkeydown='setStepOffset(this,event.keyCode);'";
}

function getJdgFlowStepEvents(flowStep) {
    return " onkeydown='setStepOffset(this,event.keyCode);if (event.keyCode==46) delStep(this.id);'";
}

function getStepEvents(Step) {
    var id = Step.id;
    var type = Step.type;
    var eventstr = 'onmouseover=\'this.style.cursor="hand";\' onmousedown=\'cleancontextMenu();objFocusedOn(this.id,"'
	+ type + '");moveStep(this);\' ondblclick="editStep(this.id,\'' + type + '\')" oncontextmenu=\'objFocusedOn(this.id,"'
	+ type + '");stepContextMenu(this.id,"' + type + '","' + (type == "1" ? Step.flowStep.type : "") + '");return false;\'';
    if (type == "1")
        return eventstr + getGnrFlowStepEvents(Step.flowStep);
    return eventstr + getJdgFlowStepEvents(Step.flowStep);
}

function getActionEvents(Action) {
    return 'onmousedown=\'cleancontextMenu();objFocusedOn(this.id,"Action");\' ondblclick=\'editAction(this.id,"Action")\'  oncontextmenu=\'objFocusedOn(this.id,"Action");actionContextMenu(this.id);return false;\''
}

function redrawVML() {
    var flowStepInfo = [];
    var flowActionInfo = [];
    for (var i = 0; i < g_Flow.getStepCount(); i++) {
        var Step = g_Flow.step(i);
        var nShowState = parseInt(Step.show);
        if (isNaN(nShowState) || (nShowState <= 0))
            continue;
        flowStepInfo.push(Step.getShape(g_Flow.cfg));
    }
    for (i = 0; i < g_Flow.getActionCount(); i++) {
        var Action = g_Flow.action(i);
        flowActionInfo.push(Action.getShape(g_Flow.cfg));
    }
    flowChart.redrawFlow(flowStepInfo, flowActionInfo);
    flowChart.updateCameraPos(flowStepInfo);
    drawTreeView();
    FOCUSEDOBJID = "";
    FOCUSEDOBJTYPE = "";
}

function flowContextMenu() {
    menuArray = {
        f: [
            { img: "/i/flow_image/add_step.gif", text: "添加新步骤", url: "", click: function () { newStep("1"); } },
            { img: "/i/flow_image/add_step.gif", text: "添加新条件", url: "", click: function () { newStep("2"); } },
            { img: "/i/flow_image/add_action.gif", text: "添加新动作", url: "", click: function () { newAction(); } },
            { img: "/i/flow_image/refresh_vml.gif", text: "刷新流程图", url: "", click: function () { redrawVML(); } },
            { img: "/i/flow_image/del_obj.gif", text: "设置负责人", url: "", click: function () { setStepPriv("-1"); } },
            { img: "/i/flow_image/del_obj.gif", text: "设置安全员", url: "", click: function () { setStepPriv("-2"); } },
            { img: "/i/flow_image/yaodian.gif", text: "设置检查要点", url: "", click: function () { setFlowInfo(3); } },
            { img: "/i/flow_image/yaodian.gif", text: "设置打回类型", url: "", click: function () { setFlowInfo(4); } },
        ]
    };
    //ShowMenu("f", window.event.x, window.event.y);
    ShowContextMenu(menuArray.f, window.event.x, window.event.y);
    return 
    var menuSrc = '<menu><entity id="c0"><description>添加新步骤</description><image>/i/flow_image/add_step.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();newStep("1");</onClick><contents></contents></entity>';
    menuSrc += '<entity id="c1"><description>添加新条件</description><image>/i/flow_image/add_step.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();newStep("2");</onClick><contents></contents></entity>';
    menuSrc += '<entity id="c2"><description>添加新动作</description><image>/i/flow_image/add_action.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();newAction();</onClick><contents></contents></entity>';
    menuSrc += '<entity id="c3"><description>刷新流程图</description><image>/i/flow_image/refresh_vml.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();redrawVML();</onClick><contents></contents></entity>';
    menuSrc += '<entity id="c4"><description>设置负责人</description><image>/i/flow_image/del_obj.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();setStepPriv("-1");</onClick><contents></contents></entity>';
    menuSrc += '<entity id="c5"><description>设置安全员</description><image>/i/flow_image/del_obj.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();setStepPriv("-2");</onClick><contents></contents></entity>';
    menuSrc += '<entity id="c6"><description>设置检查要点</description><image>/i/flow_image/yaodian.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();setFlowInfo(3);</onClick><contents></contents></entity>';
    menuSrc += '<entity id="c7"><description>设置打回类型</description><image>/i/flow_image/yaodian.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();setFlowInfo(4);</onClick><contents></contents></entity>';
    menuSrc += '</menu>';
    showContextMenu(menuSrc);
}

function stepContextMenu(stepId, stepType, flowType) {
    var arr = [];
    arr.push({ img: "/i/flow_image/edit_obj.gif", text: '修改步骤[' + stepId + ']', url: "", click: function () { editStep(stepId, stepType); } });
    if (flowType != '1' && flowType != '3') {
        arr.push({ img: "/i/flow_image/del_obj.gif", text: '删除步骤[' + stepId + ']', url: "", click: function () { delStep(stepId); } });
        arr.push({ img: "/i/flow_image/del_obj.gif", text: '永久删除[' + stepId + ']', url: "", click: function () { deleteStep(stepId); } });
    }
    if ((stepType == '1') && (flowType != "3")) {
        arr.push({ img: "/i/flow_image/add_step.gif", text: '为模板创建[' + stepId + ']', url: "", click: function () { newStepCopy(stepId); } });
        var thisStep = g_Flow.getStep(stepId);
        if (thisStep.flowStep.subFlowId != "")
            arr.push({ img: "/i/flow_image/del_obj.gif", text: '查看子流程[' + stepId + ']', url: "", click: function () { editFlowDetail(thisStep.flowStep.subFlowId); } });
        else
            arr.push({ img: "/i/flow_image/del_obj.gif", text: '设置权限[' + stepId + ']', url: "", click: function () { setStepPriv(stepId); } });
        arr.push({ img: "/i/flow_image/yaodian.gif", text: '设置工作职责[' + stepId + ']', url: "", click: function () { setStepDuty(stepId); } });
        if (flowType != "1") {
            arr.push({ img: "/i/flow_image/yaodian.gif", text: '设置检查要点[' + stepId + ']', url: "", click: function () { setStepInfo(3,stepId); } });
            arr.push({ img: "/i/flow_image/yaodian.gif", text: '设置打回类型[' + stepId + ']', url: "", click: function () { setStepInfo(4,stepId); } });
        }
    }
    arr.push({ img: "/i/flow_image/refresh_vml.gif", text: '刷新流程图', url: "", click: function () { redrawVML(); } });

    menuArray = { s: arr };
    //ShowMenu("s", window.event.x, window.event.y);
    ShowContextMenu(menuArray.s, window.event.x, window.event.y);
    return;
    var menuSrc = '<menu><entity id="c0"><description>修改步骤[' + stepId + ']</description><image>/i/flow_image/edit_obj.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();editStep("' + stepId + '","' + stepType + '");</onClick><contents></contents></entity>';
    if (flowType != '1' && flowType != '3') {
        menuSrc += '<entity id="c1"><description>删除步骤[' + stepId + ']</description><image>/i/flow_image/del_obj.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();delStep("' + stepId + '");</onClick><contents></contents></entity>';
        menuSrc += '<entity id="c2"><description>永久删除[' + stepId + ']</description><image>/i/flow_image/del_obj.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();deleteStep("' + stepId + '");</onClick><contents></contents></entity>';
    }
    if ((stepType == '1') && (flowType != "3")) {
        menuSrc += '<entity id="c4"><description>为模板创建[' + stepId + ']</description><image>/i/flow_image/add_step.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();newStepCopy("' + stepId + '");</onClick><contents></contents></entity>';
        var thisStep = g_Flow.getStep(stepId);
        if (thisStep.flowStep.subFlowId != "")
            menuSrc += '<entity id="c5"><description>查看子流程[' + stepId + ']</description><image>/i/flow_image/del_obj.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();editFlowDetail("' + thisStep.flowStep.subFlowId + '");</onClick><contents></contents></entity>';
        else
            menuSrc += '<entity id="c3"><description>设置权限[' + stepId + ']</description><image>/i/flow_image/del_obj.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();setStepPriv("' + stepId + '");</onClick><contents></contents></entity>';
        menuSrc += '<entity id="c6"><description>设置工作职责[' + stepId + ']</description><image>/i/flow_image/yaodian.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();setStepDuty("' + stepId + '");</onClick><contents></contents></entity>';
        if (flowType != "1"){
            menuSrc += '<entity id="c7"><description>设置检查要点[' + stepId + ']</description><image>/i/flow_image/yaodian.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();setStepInfo(3,"' + stepId + '");</onClick><contents></contents></entity>';
            menuSrc += '<entity id="c8"><description>设置打回类型[' + stepId + ']</description><image>/i/flow_image/yaodian.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();setStepInfo(4,"' + stepId + '");</onClick><contents></contents></entity>';
        }
    }
    menuSrc += '<entity id="c4"><description>刷新流程图</description><image>/i/flow_image/refresh_vml.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();redrawVML();</onClick><contents></contents></entity></menu>';
    showContextMenu(menuSrc);
}

function actionContextMenu(actionId) {
    menuArray = {
        a: [
            { img: "/i/flow_image/add_step.gif", text: "修改动作[" + actionId + "]", url: "", click: function () { editAction(actionId); } },
            { img: "/i/flow_image/add_step.gif", text: '删除动作[' + actionId + ']', url: "", click: function () { delAction(actionId); } },
            { img: "/i/flow_image/add_step.gif", text: "刷新流程图", url: "", click: function () { redrawVML(); } }
        ]
    };
    //ShowMenu("a", window.event.x, window.event.y);
    ShowContextMenu(menuArray.a, window.event.x, window.event.y);
    return;
    var menuSrc = '<menu><entity id="c0"><description>修改动作[' + actionId + ']</description><image>/i/flow_image/edit_obj.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();editAction("' + actionId + '");</onClick><contents></contents></entity>';
    menuSrc += '<entity id="c1"><description>删除动作[' + actionId + ']</description><image>/i/flow_image/del_obj.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();delAction("' + actionId + '");</onClick><contents></contents></entity>';
    menuSrc += '<entity id="c2"><description>刷新流程图</description><image>/i/flow_image/refresh_vml.gif</image><fontcolor>' + MenuTextColor_enable + '</fontcolor><onClick>cleancontextMenu();redrawVML();</onClick><contents></contents></entity></menu>';
    showContextMenu(menuSrc);
}

function showContextMenu(menuSrc) {
    var root = createXMLRoot(menuSrc);
    var menuText = '' + root.xml + ''
    loadContextMenu(menuText, '/XML/contextmenu.xsl')
}

function setStepPriv(stepId) { workFlowDialog(stepId, "Priv"); }

function setStepDuty(stepId) { workFlowDialog(stepId, "Duty"); }

function setFlowInfo(info) {
    switch (info) {
        case 3:
            Ysh.Web.showModalDialog("_setFlowYaodian.aspx?flowid=" + g_Flow.id + "&a=" + new Date(), window, 390, 480);
            break;
        case 4:
            Ysh.Web.showModalDialog("_setFlowBackType.aspx?flowid=" + g_Flow.id + "&a=" + new Date(), window, 390, 480);
            break;
        default:
            break;
    }
}

function setStepInfo(info, stepId) {
    switch (info) {
        case 3:
            Ysh.Web.showModalDialog("_setStepYaodian.aspx?flowid=" + g_Flow.id + "&nodeid=" + stepId + "&a=" + new Date(), window, 390, 480);
            break;
        case 4:
            Ysh.Web.showModalDialog("_setStepBackType.aspx?flowid=" + g_Flow.id + "&nodeid=" + stepId + "&a=" + new Date(), window, 390, 480);
            break;
        default:
            break;
    }
}

function editFlowDetail(flowId) {
    Ysh.Web.showModalDialog(location.pathname + "?s=1&flowid=" + flowId + "&a" + new Date(), "", 900, 700);
}

var dialogURL = "";
function workFlowDialog(id, type,f) {
    switch (type) {
        case 'Step1': dialogURL = id == null ? '_stepdialog.aspx' : '_stepdialog.aspx?stepid=' + id; break;
        case 'Step2': dialogURL = id == null ? '_judgedialog.htm' : '_judgedialog.htm?stepid=' + id; break;
        case 'Action': dialogURL = id == null ? '_actiondialog.htm' : '_actiondialog.htm?actionid=' + id; break;
        case 'Flow': dialogURL = id == null ? '_flowdialog.aspx' : '_flowdialog.aspx?flowid=' + id; break;
        case 'Priv': dialogURL = id == null ? '_privdialog.htm' : '_privdialog.htm?stepid=' + id; break;
        case 'Duty': dialogURL = "nodedutydlg.aspx?flowid=" + g_Flow.id + "&nodeid=" + id + "&a=" + new Date(); break;
        case 'StepCopy': dialogURL = id == null ? '_stepdialog.aspx' : '_stepdialog.aspx?copystepid=' + id; break;
        default:
            alert(type + "类型没有实现");
            return;
    }
    //var dialog = window.showModalDialog(dialogURL, window, "dialogWidth:373px; dialogHeight:460px; center:yes; help:no; resizable:no; status:no");
    Ysh.Web.showModalDialog(dialogURL, window, 390, 480, function (dialog) {
        if ((typeof (dialog) == "undefined") || (dialog == ""))
            return true;
        id = dialog;
        switch (type) {
            case 'Action': redrawVML(); objFocusedOn(id, "Action"); break;
            case 'Flow': redrawVML(); break;
            case 'Priv': if ((id != "-1") && (id != "-2")) objFocusedOn(id, "Step"); break;
            case 'Duty': objFocusedOn(id, "Step"); break;
            default: redrawVML(); objFocusedOn(id, "Step"); break;
        }
        if (f)
            f();
        return true;
    });
}
function drawTreeView() {
    document.all.treeview.src = "_flowtree.htm";
}
