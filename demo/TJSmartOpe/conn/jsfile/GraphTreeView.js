//图形树查看功能实现
//by popduke 111108
//使用:加载js后,并在页面实现var tree = new gtree即可
if (!window.gtree)
    alert("没有找到对应树控件，无法加载图形列表组件");

var m_iGraphTreeFolderId = 1;       //当前打开的目录id
var m_arrGraphTreeDir = new Array(); //当前所有的图形目录
var c_strFolderPerfix = "folder";   //树目录data前缀
var c_iFolderRootData = 1;          //树根目录id
var c_iFolderGraphData = 2;         //图形目录id

function addMenuFolderItem(text,parent,data) {
	return tree.addNode(text, null, null, "", "", parent, data, true);
}

function addMenuItem(text,parent,data) {
	return tree.addLeaf(text, null, null, "", parent, data, true);
}

function gtreeNodeClick(tagNode) {//复写树控件的点击方法
    if (!tagNode._children) {
        m_pPsgpActive.OpenGraphic("<_d><_graphId>" + tagNode._data + "</_graphId></_d>");
        var result = GraphAjax.GetGraphItemCode(m_pPsgpActive.GetCurrGraphId(), 0, 1);
        var code = result.value;
        m_pPsgpActive.SetGraphicProperty(m_pPsgpActive.GetCurrGraphId(), "setbatgraphlockornot", code);
	}
    else {
        m_iGraphTreeFolderId = tagNode._data.substr(c_strFolderPerfix.length);
        var dirTargetTemp = GraphTreeFindTargetDir(tagNode._data);
        if (!dirTargetTemp._Show) {
            if (tagNode._data == c_strFolderPerfix + c_iFolderGraphData) {
                var allgraphics = m_pPsgpActive.GetServerDataTest("GetSelectGraphicList#~!" + m_iProcID);
                if(allgraphics == "")
                    return false;
                var xmlDoc1 = new ActiveXObject("Msxml2.DOMDocument");
                xmlDoc1.loadXML(allgraphics);
                var xmlNode = xmlDoc1.selectSingleNode("d");
                for (var i = 0; i < xmlNode.childNodes.length; i++) {
                    var graphid = xmlNode.childNodes[i].selectSingleNode("id").text;
                    var graphname = xmlNode.childNodes[i].selectSingleNode("name").text;
                    addMenuItem(graphname, tagNode, graphid);
                }
                dirTargetTemp._Show = true;
                return false;
            }
            for (var i = 0; i < dirTargetTemp._children.length; i++) {
                addMenuItem(dirTargetTemp._children[i][0], dirTargetTemp._folder, dirTargetTemp._children[i][1]);
            }
            dirTargetTemp._Show = true;
        }
	}
}  

function GraphTreeDirClass(folder) {
  this._Show = false;
  this._folder = folder;
  this._children = new Array;
}

function GraphTreeFindTargetDir(data) {
    for (var i = 0; i < m_arrGraphTreeDir.length; i++)
        if (m_arrGraphTreeDir[i]._folder._data == data)
            return m_arrGraphTreeDir[i];
    return null;
}

function InitGraphTreeView() {
	while(tree._obj.rows.length > 1)
		tree._obj.deleteRow(1);
	tree._selectedNode = null;
	tree._children = new Array();
    m_arrGraphTreeDir = new Array();
}

function GetTreeView() {
    InitGraphTreeView();
    var dirTargetTemp = new GraphTreeDirClass(addMenuFolderItem("图形程序", null, c_strFolderPerfix + c_iFolderGraphData)); //加入全体图形目录
    m_arrGraphTreeDir.push(dirTargetTemp);
    var ProjectTreeFolders = m_pPsgpActive.GetServerDataTest("GetProjectTreeFolders#~!" + m_iProcID); //得到全体目录
    if (ProjectTreeFolders == "")
        return false;
	var xmlDoc1 = new ActiveXObject("Msxml2.DOMDocument");
	xmlDoc1.loadXML(ProjectTreeFolders);
	var xmlNode = xmlDoc1.selectSingleNode("root");
    for (var i = 0; i < xmlNode.childNodes.length; i++) {
		var arr = [xmlNode.childNodes[i].getAttribute("foldername"),xmlNode.childNodes[i].getAttribute("folderOwnerid"),xmlNode.childNodes[i].getAttribute("folderid")];
        var dirTargetTemp = new GraphTreeDirClass(addMenuFolderItem(arr[0], tree.getNodeByData(c_strFolderPerfix + arr[1]), c_strFolderPerfix + arr[2]));
        m_arrGraphTreeDir.push(dirTargetTemp);
	}
    ProjectTreeFolders = m_pPsgpActive.GetServerDataTest("GetProjectTreeGraphics_GraphicFolders#~!" + m_iProcID);//得到目录和文件的关系
	xmlDoc1.loadXML(ProjectTreeFolders);
	xmlNode = xmlDoc1.selectSingleNode("root");
    var iDirId = 0;
    for (var i = 0; i < xmlNode.childNodes.length; i++) {
        //add by subo 20130613，判断是否有权限，没有权限不显示
        var b = GraphAjax.GetAuthorityGraph(xmlNode.childNodes[i].attributes[1].nodeValue);
        if (b.value == 0)
            continue;
        //add end
		var arr = [xmlNode.childNodes[i].getAttribute("graphicname"),xmlNode.childNodes[i].getAttribute("folderid"),xmlNode.childNodes[i].getAttribute("graphicid")];
        if (arr[1] == c_iFolderRootData || arr[1] == c_iFolderGraphData || arr[1] == "0") {
            addMenuItem(arr[0], null, arr[2]);
            continue;
		}
        if (iDirId == arr[1]) {//储存上次的目录id，使之不用总是去搜索
            dirTargetTemp._children.push([arr[0], arr[2]]);
		}
        else {
            dirTargetTemp = GraphTreeFindTargetDir(c_strFolderPerfix + arr[1]);//搜索目标目录
            if (dirTargetTemp) {
                dirTargetTemp._children.push([arr[0], arr[2]]);
                iDirId = arr[1];
		    }
		    else
                iDirId = 0;
		}
	}
	return false;
}