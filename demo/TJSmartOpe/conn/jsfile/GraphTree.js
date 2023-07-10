//Created by gud 20120907

function GraphTreeView() {
    this.m_iGraphTreeFolderId = 1;       //当前打开的目录id
    this.m_arrGraphTreeDir = new Array(); //当前所有的图形目录
    this.c_strFolderPerfix = "folder";   //树目录data前缀
    this.c_iFolderRootData = 1;          //树根目录id
    this.c_iFolderGraphData = 2;         //图形目录id
    this.tree = new gtree("图形系统", "top.gif");

    this.m_pPsgpActive = null;
    this.m_iProcID = 0;

    var pt = this;
    this.tree.clickNode = function (n) {//复写树控件的点击方法
        if (!n._children) {
            pt.m_pPsgpActive.OpenGraphic("<_d><_graphId>" + n._data + "</_graphId></_d>");
            return;
        }
        pt.m_iGraphTreeFolderId = n._data.substr(pt.c_strFolderPerfix.length);
        var dirTargetTemp = pt.GraphTreeFindTargetDir(n._data);
        if (dirTargetTemp._Show)
            return;
        if (n._data == pt.c_strFolderPerfix + pt.c_iFolderGraphData) {
            var allgraphics = pt.m_pPsgpActive.GetServerDataTest("GetSelectGraphicList#~!" + pt.m_iProcID);
            if (allgraphics == "")
                return false;
            pt.addGraphMenuItemFromXml(allgraphics, n);
            dirTargetTemp._Show = true;
            return false;
        }
        for (var i = 0; i < dirTargetTemp._children.length; i++) {
            pt.addMenuItem(dirTargetTemp._children[i][0], dirTargetTemp._folder, dirTargetTemp._children[i][1]);
        }
        dirTargetTemp._Show = true;
    }

    this.addMenuFolderItem = function (text, parent, data) { return this.tree.addNode(text, null, null, "", "", parent, data, true); }

    this.addMenuItem = function (text, parent, data) { return this.tree.addLeaf(text, null, null, "", parent, data, true); }

    this.addGraphMenuItemFromXml = function (xml, tagNode) {
        var xmlDoc1 = new ActiveXObject("Msxml2.DOMDocument");
        xmlDoc1.loadXML(xml);
        var xmlNode = xmlDoc1.selectSingleNode("d");
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var graphid = xmlNode.childNodes[i].selectSingleNode("id").text;
            var graphname = xmlNode.childNodes[i].selectSingleNode("name").text;
            this.addMenuItem(graphname, tagNode, graphid);
        }
    }

    this.GraphTreeFindTargetDir = function (data) {
        for (var i = 0; i < this.m_arrGraphTreeDir.length; i++)
            if (this.m_arrGraphTreeDir[i]._folder._data == data)
                return this.m_arrGraphTreeDir[i];
        return null;
    }

    this.Init = function (objPsgp) { this.m_pPsgpActive = objPsgp; }
    this.SetProcID = function (iProcID) { this.m_iProcID = iProcID; }

    this.Refresh = function () {
        //Clear tree and reset
        while (this.tree._obj.rows.length > 1)
            this.tree._obj.deleteRow(1);
        this.tree._selectedNode = null;
        this.tree._children = [];
        this.m_arrGraphTreeDir = [];
        //Reset end
        var dirTargetTemp = { _Show: false, _folder: this.addMenuFolderItem("图形程序", null, this.c_strFolderPerfix + this.c_iFolderGraphData), _children: [] }; //加入全体图形目录
        this.m_arrGraphTreeDir.push(dirTargetTemp);
        var ProjectTreeFolders = this.m_pPsgpActive.GetServerDataTest("GetProjectTreeFolders#~!" + this.m_iProcID); //得到全体目录
        if (ProjectTreeFolders == "")
            return false;
        var xmlDoc1 = new ActiveXObject("Msxml2.DOMDocument");
        xmlDoc1.loadXML(ProjectTreeFolders);
        var xmlNode = xmlDoc1.selectSingleNode("root");
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var nd = xmlNode.childNodes[i];
            var dirTargetTemp = { _Show: false, _folder: this.addMenuFolderItem(nd.getAttribute("foldername"), this.tree.getNodeByData(this.c_strFolderPerfix + nd.getAttribute("folderOwnerid")), this.c_strFolderPerfix + nd.getAttribute("folderid")), _children: [] };
            this.m_arrGraphTreeDir.push(dirTargetTemp);
        }
        ProjectTreeFolders = this.m_pPsgpActive.GetServerDataTest("GetProjectTreeGraphics_GraphicFolders#~!" + this.m_iProcID); //得到目录和文件的关系
        xmlDoc1.loadXML(ProjectTreeFolders);
        xmlNode = xmlDoc1.selectSingleNode("root");
        var iDirId = 0;
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var nd = xmlNode.childNodes[i];
            var graphicname = nd.getAttribute("graphicname");
            var folderid = nd.getAttribute("folderid");
            var graphicid = nd.getAttribute("graphicid");
            //var arr = [nd.getAttribute("graphicname"), nd.getAttribute("folderid"), nd.getAttribute("graphicid")];
            if (folderid == this.c_iFolderRootData || folderid == this.c_iFolderGraphData || folderid == "0") {
                this.addMenuItem(graphicname, null, graphicid);
                continue;
            }
            if (iDirId == folderid) {//储存上次的目录id，使之不用总是去搜索
                dirTargetTemp._children.push([graphicname, graphicid]);
            }
            else {
                dirTargetTemp = this.GraphTreeFindTargetDir(this.c_strFolderPerfix + folderid); //搜索目标目录
                if (dirTargetTemp) {
                    dirTargetTemp._children.push([graphicname, graphicid]);
                    iDirId = folderid;
                }
                else
                    iDirId = 0;
            }
        }
        return false;
    }
}