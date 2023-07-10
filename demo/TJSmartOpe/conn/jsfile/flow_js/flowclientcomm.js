function changeCheckBox(divid1, divid2) {
    if (divid1.style.display == "") {
        divid1.style.display = "none";
        divid2.style.display = "";
    }
    else {
        divid1.style.display = "";
        divid2.style.display = "none";
    }
}

function selectUsers(flowid, nodeid, usernum, userdlgpath) {
    var retval = Ysh.Web.showDialog(userdlgpath + "_appointuserdlg.aspx?flowid=" + flowid + "&nodeid=" + nodeid
        + "&usernum=" + usernum, null, "dialogWidth:365px; dialogHeight:430px; center:yes; help:no; resizable:yes; status:no");
    if (typeof (retval) == "undefined") return "";
    return retval;
}

function selectNodes(arrNodes,arrNodeSelected) {
    var height = 40*arrNodes.length;
    var retval = Ysh.Web.showDialog("/workflow/_selectnodedlg.htm?a=" + new Date(), arrNodes, "dialogWidth:270px; dialogHeight:" + (height + 40) + "px; center:yes; help:no; resizable:yes; status:no");
    if (typeof (retval) == "undefined") return false;
    for (var i = 0;i < retval.length;i++) {
        arrNodeSelected[i] = (retval[i].toString() == "true");
    }
    return true;
}

function isUsefulBox(boxobj) {
    return boxobj.parentElement.style.display == "";
}

function getCheckBoxXML(boxobj) {
    if (!isUsefulBox(boxobj)) return "";
    return "<FlowItem id='" + boxobj.value + "' type='box' sel='" + (boxobj.checked ? "1" : "0") + "' /><FlowItem type='line' id='" 
        + boxobj.title + "'/>";
}
/*
function addButtonXML(xmlarray, flowid, actionid, nodeid, bSelUser, usernum, userdlgpath) {
    var users = getAppointUsers(nodeid);
    if (users == 'NULL') return true;
    if (bSelUser) {
        users = selectUsers(flowid, nodeid, usernum, userdlgpath);
        if (users == "") return false;
    };
    xmlarray.push("<FlowItem id='" + nodeid + "' type='btn' users='" + users + "' /><FlowItem type='line' id='" + actionid + "' />");
    return true;
}
*/
function addButtonXML(xmlarray, flowid, actionid, nodeid, bSelUser,needusernode) {
    var users = getAppointUsers(nodeid);
    if (users == 'NULL') return true;
    if (bSelUser) {
        needusernode.push(nodeid);
        xmlarray.push("<FlowItem type='line' id='" + actionid + "' />");
    } else {
        xmlarray.push("<FlowItem id='" + nodeid + "' type='btn' users='" + users + "' /><FlowItem type='line' id='" + actionid + "' />");
    }
    return true;
}

function addAppointUsersXML(xmlarray, flowid, usernum, nodeidarray, userdlgpath) {
    if (nodeidarray.length == 0)
        return true;
    var nodeusers = Ysh.Web.showDialog(userdlgpath + "_appointuserdlgex.aspx?flowid=" + flowid + "&nodeids=" + nodeidarray.join()
        + "&usernum=" + usernum + "&a=" + new Date(), null, "dialogWidth:365px; dialogHeight:430px; center:yes; help:no; resizable:yes; status:no");
    if (typeof (nodeusers) == "undefined") {
        stateFlowSubmit = false;
        return false;
    }

    for (var i = 0; i < nodeidarray.length; i++) {
        var nodeid = nodeidarray[i];
        var users = nodeusers[i];
        xmlarray.push("<FlowItem id='" + nodeid + "' type='btn' users='" + users + "' />");
    }
    return true;
}

function getXmlArrayStr(xmlarray) {
    var xml = "<FlowData>";
    for (var i = 0; i < xmlarray.length; i++) {
        xml += xmlarray[i];
    };
    xml += "</FlowData>";
    return xml;
}

function isRelatedBox(btnobj, boxobj) {
    if (boxobj.isalwaysjudge == "1")
        return true;
    var curobj = btnobj;
    while (true) {
        var p = curobj.parentElement;
        if ((!p) || p.tagName.toUpperCase() != "SPAN")
            return false;
        if ((p.id == "flow_yes" + boxobj.title) || (p.id == "flow_no" + boxobj.title))
            return true;
        curobj = p;
    };
    return false;
}

//Add By linger At 2011-03-21 16:46
//增加流程跳转校验、打印、导出、流程图等相应功能函数
function Print(oCell, cs) {
    cs.BindData();
    oCell.PrintPreview(1, oCell.GetCurSheet());
    return false;
}

function Export(oCell, cs) {
    cs.BindData();
    Ysh.CC2000.exportExcel(oCell);
    return false;
}

function OpenFlow(strFlowMap, strFlow, strItem) {
    window.showModelessDialog(strFlowMap + "ItemChart.aspx?flowid=" + strFlow + "&itemid=" + strItem + "&a=" + Math.random(), null,
        "dialogWidth:900px;dialogHeight:700px; center:yes; help:no; resizable:yes; status:no;scroll:no;");
    return false;
}

var FLOW_SAVE = 2;
var FLOW_PASS = 3;
var FLOW_DELETE = 4;
var FLOW_KICKBACK = 5;
var FLOW_INVALID = 6;
var FLOW_GETBACK = 7;

function GetSelectCtrlText(sSrc) {
    var l = sSrc.options.length;
    for (var i = 0; i < l; i++) {
        var opt = sSrc.options[i];
        if (opt.selected)
            return opt.text;
    }
    return "";
}

var stateFlowSubmit = false;
function FlowSubmit(type, arrArgs) {
    if (stateFlowSubmit)
        return false;
    stateFlowSubmit = true;
    var b = DoFlowSubmit(type, arrArgs);
    if (!b)
        stateFlowSubmit = false;
    return b;
}

function DoFlowSubmit(type, arrArgs) {
    var msg = "";
    switch (type) {
        case FLOW_DELETE:
            msg = "删除";
            if (!confirm("你确定要删除单子吗？"))
                return false;
            break;
        case FLOW_KICKBACK:
            msg = "打回";
            var retval = ShowModalDialog(arrArgs[0] + "_kickbackdlg.aspx?flowid=" + arrArgs[1] + "&nodeid=" + arrArgs[2]
                + "&itemid=" + arrArgs[3] + "&a=" + new Date(), null, "dialogWidth:373px; dialogHeight:460px; center:yes; help:no; resizable:no; status:no");
            if (typeof (retval) == "undefined")
                return false;
            document.getElementById("flow_kicknode").value = retval[0];
            document.getElementById("flow_kicktype").value = retval[1];
            document.getElementById("flow_kickreason").value = retval[2];
            break;
        case FLOW_INVALID:
            msg = "作废";
            //if (!confirm("你确定要将单子作废吗？"))
            //    return false;
            var retval = window.showModalDialog("/workflow/_invaliddlg.htm?a=" + new Date(), null, "dialogWidth:373px; dialogHeight:220px; center:yes; help:no; resizable:no; status:no");
            if (typeof (retval) == "undefined")
                return false;
            document.getElementById("flow_invalidreason").value = retval;
            break;
        case FLOW_GETBACK:
            msg = "取回";
            if (!confirm("你确定要将单子取回吗？"))
                return false;
            break;
        case FLOW_PASS: //edit by popduke 不同意的意见提交时进行提示
            msg = "提交";
            if (document.getElementById("ddlOpinion") && document.getElementById("ddlOpinion").value == 0) {
                if (!confirm("处理意见为不同意，是否继续提交？"))
                    return false;
            }
        default:
            if (typeof FlowCheck != "undefined") {
                if (!FlowCheck(type))
                    return false;
            }
            break;
    }
    document.getElementById("flow_type").value = type;
    if (typeof SetSavePrompt != "undefined")
        SetSavePrompt(msg);
    return true;
}
