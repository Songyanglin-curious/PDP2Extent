//图形树列表编辑功能实现控件
//by popduke 111108
if (!window.m_iGraphTreeFolderId)
    alert("没有找到对应图形列表，无法加载图形列表编辑组件");
    
var trGraphTreeOperate; //树的操作行
function GraphTreeRenameFolder() {//重命名图形
    var targetNode = tree._selectedNode;
    if (!targetNode)
        return false;
    if (targetNode._data == c_strFolderPerfix + c_iFolderGraphData) {
        alert("不能重命名图形主目录");
        return false;
    }
    var foldname = ShowModalDialog("/GraphModule/graph_foldname.aspx?a=" + Math.random(), targetNode._text, "dialogWidth:268px; dialogHeight:82px; center:yes; help:no; resizable:no; status:no;scroll:no;");
    if (!foldname)
        return false;
    if (targetNode._children) {
        if (m_pPsgpActive.GetServerDataTest("UpdateGraphicFolder#~!" + m_iProcID + "#~!" + foldname + "#~!" + (targetNode._p == null ? c_iFolderRootData : targetNode._p._data.replace(c_strFolderPerfix, "")) + "#~!" + m_iGraphTreeFolderId) == "0") {
            alert("重命名失败");
            return false;
        }
        var dirTargetTemp = GraphTreeFindTargetDir(targetNode._data);
        if (dirTargetTemp) dirTargetTemp._folder = targetNode;
    }
    else {
        m_pPsgpActive.GetServerDataTest("UpdateGraphNameByID#~!" + m_iProcID + "#~!" + foldname + "#~!" + targetNode._data);
        var dirTargetTemp = targetNode._p ? GraphTreeFindTargetDir(targetNode._p._data) : null;
        if (dirTargetTemp)
            for (var i = 0; i < dirTargetTemp._children.length; i++)
                if (dirTargetTemp._children[i][1] == targetNode._data) {
                    dirTargetTemp._children[i][0] = targetNode._text;
                    break;
                }
    }
    targetNode._text = foldname;
    targetNode.redraw(false);
    return false;
}
//add by subo 20130613，为图形文件设置权限
function GraphTreeSetAuthorityGraph() {
    var targetNode = tree._selectedNode;
    if (!targetNode)
        return false;
    if (!targetNode._children) {
        var users = GraphAjax.GetAllAuthorityGraph(targetNode._data);
        var userIds = ShowModalDialog("/_appointuserdlg.aspx?a=" + Math.random() + "&users=" + users.value, targetNode._text, "dialogWidth:720px; dialogHeight:430px; center:yes; help:no; resizable:yes; status:no;scroll:no;");
        if (userIds == undefined)
            return false;
        if (userIds != "")
            userIds += ';';
        GraphAjax.SetAuthorityGraph(targetNode._data, userIds.replace(/,/g, ';'));
    }
}
//add end
function GraphTreeDeleteFolder() {//删除目录
    var targetNode = tree._selectedNode;
    if (!targetNode)
        return false;
    if (targetNode._data == c_strFolderPerfix + c_iFolderGraphData) {
        alert("不能删除图形主目录");
        return false;
    }
    if (targetNode._children) {
        if (targetNode._children.length > 0) {
            alert("文件夹不为空，无法删除");
            return false;
        }
        if (!confirm("您正在删除文件夹 '" + targetNode._text + "' 此操作将不可回退，确定删除？")) {
            return false;
        }
        var dirTargetTemp = GraphTreeFindTargetDir(targetNode._data);
        if (dirTargetTemp) m_arrGraphTreeDir.erase(dirTargetTemp);
        m_pPsgpActive.GetServerDataTest("DeleteGraphicFolder#~!" + m_iProcID + "#~!" + targetNode._data.replace(c_strFolderPerfix, "") + "#~!-1");
        tree.delNode(targetNode);
        m_iGraphTreeFolderId = c_iFolderRootData;
    }
    return false;
}

function GraphTreeDeleteGraph() {//删除图形
    var targetNode = tree._selectedNode;
    if (!targetNode)
        return false;
    if (!targetNode._children) {
        if (!confirm("您正在删除图形文件 '" + targetNode._text + "' 此操作将不可回退，确定删除？")) {
            return false;
        }
        GraphAjax.DelAuthorityGraph(targetNode._data);
        m_pPsgpActive.CloseGraphic("<_d><_graphId>" + targetNode._data + "</_graphId></_d>");
        m_pPsgpActive.GetServerDataTest("DeleteGraphic#~!" + m_iProcID + "#~!" + targetNode._data);
        var dirTargetTemp = GraphTreeFindTargetDir(c_strFolderPerfix + m_iGraphTreeFolderId);
        if (dirTargetTemp) {
            for (var i = 0; i < dirTargetTemp._children.length; i++) {
                if (dirTargetTemp._children[i][1] == targetNode._data)
                    dirTargetTemp._children.splice(i, 1);
            }
        }
        m_pPsgpActive.GetServerDataTest("DeleteGraphicFolder#~!" + m_iProcID + "#~!-1#~!" + targetNode._data);
        tree.delNode(targetNode);
    }
    return false;
}

function GraphTreeAddFolder() {//文件夹插入
    var foldname = ShowModalDialog("/GraphModule/graph_foldname.aspx?a=" + Math.random(), "", "dialogWidth:268px; dialogHeight:82px; center:yes; help:no; resizable:no; status:no;scroll:no;");
    if (!foldname)
        return false;
    if (m_iGraphTreeFolderId == c_iFolderGraphData)
        m_iGraphTreeFolderId = c_iFolderRootData;
    var parentNode = tree.getNodeByData(c_strFolderPerfix + m_iGraphTreeFolderId);
    var addFolderId = m_pPsgpActive.GetServerDataTest("UpdateGraphicFolder#~!" + m_iProcID + "#~!" + foldname + "#~!" + m_iGraphTreeFolderId + "#~!-1");
    if (addFolderId == "0") {
        alert("文件夹插入失败");
        return false;
    }
    var node = tree.addNode(foldname, null, null, "", "", parentNode, c_strFolderPerfix + addFolderId, true);
    m_arrGraphTreeDir.push(new GraphTreeDirClass(node));
    tree.setSelected(node);
    m_iGraphTreeFolderId = GraphTreeAddFolder;
    return false;
}

function GraphTreeAddGraph() {//增加图形
    var graphname = ShowModalDialog("/GraphModule/graphname.aspx?a=" + Math.random(), "", "dialogWidth:358px; dialogHeight:222px; center:yes; help:no; resizable:no; status:no;scroll:no;");
    if (!graphname) {
        return false;
    }
    var graphtype = 3;
    var parentNode = tree.getNodeByData(c_strFolderPerfix + m_iGraphTreeFolderId);
    var str = "CreateNewGraphic#~!" + m_iProcID + "#~!" + graphname + "#~!" + graphtype + "#~!1#~!1#~!255#~!10#~!10#~!2000#~!1800#~!0#~!-1#~!0";
    var iGraphId = m_pPsgpActive.GetServerDataTest(str);
    m_pPsgpActive.GetServerDataTest("AddGraphic_GraphicFolder#~!" + m_iProcID + "#~!" + m_iGraphTreeFolderId + "#~!" + iGraphId);
    var dirTargetTemp = GraphTreeFindTargetDir(c_strFolderPerfix + m_iGraphTreeFolderId);
    if (dirTargetTemp) dirTargetTemp._children.push([graphname.split("#~!")[0], iGraphId]);
    var node = tree.addLeaf(graphname.split("#~!")[0], null, null, "", parentNode, iGraphId, true);
    tree.setSelected(node);
    //add by subo 20130613，为图形文件设置默认权限
    GraphAjax.SetAuthorityGraph(iGraphId, "");
    //add end
    m_pPsgpActive.OpenGraphic("<_d><_graphId>" + iGraphId + "</_graphId></_d>");
    return false;
}

function GraphTreeSetOperate(trOperate) {
    if (trOperate) trGraphTreeOperate = trOperate;
    var tblOperate = document.createElement("<table style='width:100%; height:100%;margin:0' cellpadding='0' cellspacing='0'></table>");
    var tr = tblOperate.insertRow(-1);
    tr.insertCell(-1).appendChild(GetGraphOperateDiv("GraphTreeAddFolder()", "添加目录", "/i/addfolder.jpg"));
    tr.insertCell(-1).appendChild(GetGraphOperateDiv("GraphTreeAddGraph()", "添加图形", "/i/addgraph.jpg"));
    tr.insertCell(-1).appendChild(GetGraphOperateDiv("GraphTreeRenameFolder()", "重命名", "/i/chmmwjj.gif"));
    //add by subo 20130613，设置权限的按钮
    tr.insertCell(-1).appendChild(GetGraphOperateDiv("GraphTreeSetAuthorityGraph()", "设置权限", "/i/closeRole.gif"));
    //add end
    tr.insertCell(-1).appendChild(GetGraphOperateDiv("GraphTreeDeleteFolder()", "删除目录", "/i/shchwjj.gif"));
    tr.insertCell(-1).appendChild(GetGraphOperateDiv("GraphTreeDeleteGraph()", "删除文件", "/i/shchwj.gif"));
    tr.insertCell(-1).style.width = "100%";
    trGraphTreeOperate.cells(0).appendChild(tblOperate);
    getParentTag(trGraphTreeOperate, "DIV").attachEvent("onmousedown", GraphTreeMouseDown);
    window.document.body.attachEvent("onmouseup", GraphTreeNodeMouseUp);
    window.document.body.attachEvent("onmousemove", GraphTreeNodeMouseMove);
}

function GetGraphOperateDiv(strFunction, strTitle, strImageUrl) {
    var div = document.createElement("<div align='center' style='width: 19px; margin: 0'></div>");
    div.innerHTML = "<img alt='' onclick=\"return " + strFunction + "\" title='" + strTitle + "' onmouseout='this.border=0' onmouseover=\"this.border='1 solid black'\" src='" + strImageUrl + "' />";
    return div;
}

function GraphTreeSetOperateView(bShow) {
    if (bShow)
        trGraphTreeOperate.style.display = "block";
    else
        trGraphTreeOperate.style.display = "none";
}
var divGraphNode;
var m_nodeGraphTreeMove;
function GraphTreeNodeRelease() {
    if (divGraphNode) {
        divGraphNode.parentElement.removeChild(divGraphNode);
        divGraphNode = null;
    }
    m_nodeGraphTreeMove = null;
}
function GraphTreeNodeMouseUp() {
    if (!divGraphNode)
        return;
    return GraphTreeNodeRelease();
}

function GraphTreeNodeMouseMove() {
    if (!divGraphNode)
        return;
    divGraphNode.style.display = "";
    divGraphNode.style.top = event.y + 10;
    divGraphNode.style.left = event.x;
}
function GraphTreeMouseDown() {
    if (trGraphTreeOperate.style.display == "none")
        return GraphTreeNodeRelease();
    var obj = event.srcElement;
    if (obj.tagName != "A" && obj.tagName != "IMG")
        return GraphTreeNodeRelease();
    while (obj.tagName != "TR") obj = obj.parentElement;
    var kickNode = tree.getNodeByRow(obj);
    if (!kickNode)
        return GraphTreeNodeRelease();
    if (m_nodeGraphTreeMove) {
        if (kickNode._children == null)
            kickNode = kickNode._p;
        if (!kickNode || kickNode == m_nodeGraphTreeMove._p)
            return GraphTreeNodeRelease();
        if (kickNode._data == "folder2") {//删除快捷方式
            m_pPsgpActive.GetServerDataTest("DeleteGraphicFolder#~!" + m_iProcID + "#~!-1#~!" + m_nodeGraphTreeMove._data);
            tree.delNode(m_nodeGraphTreeMove);
        }
        else {
            //add by wangbinbin 20130407 移动后删除原有关系
            m_pPsgpActive.GetServerDataTest("DeleteGraphicFolder#~!0#~!" + m_nodeGraphTreeMove._p._data.replace("folder", "") + "#~!" + m_nodeGraphTreeMove._data);
            if(m_nodeGraphTreeMove._p._data!=c_strFolderPerfix + c_iFolderGraphData)
                tree.delNode(m_nodeGraphTreeMove);
            //add end
            m_pPsgpActive.GetServerDataTest("AddGraphic_GraphicFolder#~!" + m_iProcID + "#~!" + kickNode._data.replace("folder", "") + "#~!" + m_nodeGraphTreeMove._data);
            var node = tree.addLeaf(m_nodeGraphTreeMove._text, null, null, "", kickNode, m_nodeGraphTreeMove._data, true);
            tree.setSelected(node);
        }
        return GraphTreeNodeRelease();
    }
    else {
        if (kickNode._children) return;
        m_nodeGraphTreeMove = kickNode;
        divGraphNode = document.createElement("<div style='z-index: 1000;  position: absolute; left: 0px; top: 0px; display: none'></div>");
        document.body.appendChild(divGraphNode);
        divGraphNode.innerText = m_nodeGraphTreeMove._text;
    }
}