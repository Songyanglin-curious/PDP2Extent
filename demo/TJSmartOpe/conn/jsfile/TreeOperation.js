function delegate() {
    this.arr = new Array();
    this.add = function (func) { this.arr = [func]; };
    this.run = function (para) {
        for (var i = 0; i < this.arr.length; i++) {
            var func = this.arr[i];
            if (typeof func == "function")
                func(para);
        }
    }
    this.tostring = function () {
        var str = "";
        for (var i = 0; i < this.arr.length; i++) {
            var func = this.arr[i];
            if (typeof func == "function") {
                str += func.toString().substring(11, func.toString().length - 1);
                if (i != this.arr.length - 1) {
                    str += ",";
                }
            }
            else
                str += func.toString();
        }
        return str;
    }
}

var TreeFunction = {
    addGetPropByNameFunc: function (o) {
        if (o.getpropbyname)
            return;
        o.getpropbyname = function (name, v) {
            for (var s in this) {
                if (s == name) {
                    if (v == undefined)
                        return this[s];
                    else
                        this[s] = v;
                }
            }
        }
    }, createF: function (ip, db, pv, uid, pwd, tb, sql, nc, vc, pc, rc, tp, nd, cd, cr) {
        var f = new function () {
            this.ip = ip;
            this.db = db;
            this.pv = pv;
            this.uid = uid;
            this.pwd = pwd;
            this.tb = tb;
            this.sql = sql;
            this.nc = nc;
            this.vc = vc;
            this.pc = pc;
            this.rc = rc;
            this.tp = tp;
            this.nd = nd;
            this.cd = cd;
            this.cr = cr;
        };
        this.addGetPropByNameFunc(f);
        return f;
    }, createS: function (tb, sql, nc, vc, cd, cr) {
        var s = new function () {
            this.tb = tb;
            this.sql = sql;
            this.nc = nc;
            this.vc = vc;
            this.cd = cd;
            this.cr = cr;
        };
        this.addGetPropByNameFunc(s);
        return s;
    }
}

function TreeFunc() {
    this.fsource = TreeFunction.createF("127.0.0.1", "", "0", "", "", "", "", "", "", "", "", "DataBase", "", "", "");
    this.ssource = TreeFunction.createS("", "", "", "", "", "");
    this.rela = "";
    this.id = "";

    this.ae = "false";
    this.st = "1";
    this.dn = "";
    this.scb = "false";
    this.csm = "false";
    this.csf = "false";
    this.ll = "true";
    this.fou = "";
    this.fiu = "";
    this.frm = "";
    this.gc = "";
    this.gf = "";
    this.gi = "";
    this.cmd = "1";
    this.showtop = "全部";
    this.addf = "";
    this.addpf = "";

    this.selecttext = "";
    this.selectvalue = "";
    this.focustext = "";
    this.focusvalue = "";
    this.activetext = "";
    this.activevalue = "";

    this.getpropbyname = function (name, v) {
        var s = name;
        if (typeof (this[s]) != "function") {
            if (typeof (this[s]) == "object") {
                if (this[s].add != undefined) {
                    if (v == undefined)
                        return this[s].tostring();
                    else {
                        this[s].add(v);
                    }
                }
                else {
                    return this[s];
                }
            }
            else {
                if (v == undefined)
                    return this[s];
                else
                    this[s] = v;
            }
        }
    }

    this.getallvalue = function () {
        var allvalue = new Array();
        $("#" + this.id).dynatree("getTree").visit(function (node) {
            if (node.isSelected() && !node.data.isFolder && !node.hasChildren()) {
                allvalue.push(node.data.key);
            }
        });
        return allvalue;
    };
    this.getalltext = function () {
        var alltext = new Array();
        $("#" + this.id).dynatree("getTree").visit(function (node) {
            if (node.isSelected() && !node.data.isFolder && !node.hasChildren()) {
                alltext.push(node.data.title);
            }
        });
        return alltext;
    };
    this.getallfolder = function () {
        var allfolder = new Array();
        $("#" + this.id).dynatree("getTree").visit(function (node) {
            if (node.isSelected() && node.data.isFolder) {
                allfolder.push(node.data.key);
            }
        });
        return allfolder;
    };
    this.selectbyvalue = function (nodekey) {
        if ($("#" + this.id).dynatree("getTree").activateKey(nodekey) == null) {
            alert("选项不存在！");
        }
        else {
            if ($("#" + this.id).dynatree("getTree").activateKey(nodekey).data.isFolder) {
                $("#" + this.id).dynatree("getTree").activateKey(nodekey).expand(true);
            }
            $("#" + this.id).dynatree("getTree").activateKey(nodekey).select(true);
        }
    };
    this.selectbytext = function (nodevalue) {
        var f = false;
        $("#" + this.id).dynatree("getTree").visit(function (node) {
            if (node.data.title == nodevalue) {
                node.activate();
                node.focus();
                node.select(true);
                if (node.data.isFolder)
                    node.expand(true);
                f = true;
            }
        });
        if (!f)
            alert("选项不存在！");
    };
    this.addnode = function (key, text, isfolder, pkey) {
        var tree = $("#" + this.id).dynatree("getTree");
        var node = tree.getNodeByKey(pkey);
        node.addChild({ title: text, key: key, isFolder: (isfolder == true).toString() });
    };

    this.delnode = function (key) {
        var tree = $("#" + this.id).dynatree("getTree");
        var node = tree.getNodeByKey(key);
        node.remove();
    };
    this.editnode = function (key, newtext) {
        var tree = $("#" + this.id).dynatree("getTree");
        var node = tree.getNodeByKey(key);
        node.setTitle(newtext);
    };

    this.refreshnode = function (key) {
        var tree = $("#" + this.id).dynatree("getTree");
        if (key != 'null') {
            var node = tree.getNodeByKey(key);
            RefreshNode(node);
        }
        else {
            tree.reload();
        }
    };
    this.getnodeparent = function (key) {
        var tree = $("#" + this.id).dynatree("getTree");
        var node = tree.getNodeByKey(key);
        var p = { text: node.parent.data.title, value: node.parent.data.key };
        return p;
    };

    this.getnodechildren = function (key) {
        var tree = $("#" + this.id).dynatree("getTree");
        var node = tree.getNodeByKey(key);
        var lst = [];
        for (var i = 0; i < node.childList.length; i++) {
            lst.push({ text: node.childList[i].data.title, value: node.childList[i].data.key });
        }
        return lst;
    }

    this.locateNode = function (node) {
        node.activate();
        node.focus();
        node.select(true);
    }

    this.locateChild = function (node, text) {
        var children = node.getChildren();
        if (children === null)
            return false;
        if (typeof children == "undefined") {
            if (!node.data.isFolder)
                return false;
            this.loadNodeData(node);
            //node.expand(true);
            children = node.getChildren();
        }
        if (typeof children == "undefined")
            return false;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.data.title.toLowerCase().indexOf(text) >= 0) {
                this.locateNode(child);
                return true;
            }
            if (this.locateChild(child, text))
                return true;
        }
        return false;
    }

    this.locateNext = function (text) {
        text = Ysh.String.trim(text);
        if (Ysh.String.isEmpty(text))
            return;
        text = text.toLowerCase();
        var tree = $("#" + this.id).dynatree("getTree");
        var node = tree.getActiveNode();
        if (node == null)
            node = tree.getRoot();
        if (node == null)
            return;
        if (this.locateChild(node, text))
            return;
        var list = [];
        while (node != null) {
            list.push(node);
            node = node.parent;
        } //找兄弟节点
        for (var i = 0; i < list.length; i++) {
            var nd = list[i];
            while (nd != null) {
                nd = nd.getNextSibling();
                if (!nd)
                    break;
                if (nd.data.title.toLowerCase().indexOf(text) >= 0) {
                    this.locateNode(nd);
                    return;
                }
                if (this.locateChild(nd, text))
                    return;
            }
        }
        alert("未找到相关数据!");
    }

    this.getxml = function () {
        var str = "";
        str += "<ftb><![CDATA[" + this.fsource.tb + "]]></ftb>" + "<fnc>" + this.fsource.nc + "</fnc>" + "<fvc>" + this.fsource.vc + "</fvc>" + "<fpc>" + this.fsource.pc + "</fpc>" + "<frc>" + this.fsource.rc + "</frc>" + "<ftp>" + this.fsource.tp + "</ftp><fnd>" + this.fsource.nd + "</fnd><fcd>" + escape(this.fsource.cd) + "</fcd>";
        str += "<ip>" + this.fsource.ip + "</ip><db>" + this.fsource.db + "</db><pv>" + this.fsource.pv + "</pv><uid>" + this.fsource.uid + "</uid><pwd>" + this.fsource.pwd + "</pwd>";
        str += "<stb><![CDATA[" + this.ssource.tb + "]]></stb>" + "<snc>" + this.ssource.nc + "</snc>" + "<svc>" + this.ssource.vc + "</svc><scd>" + escape(this.ssource.cd) + "</scd>";
        str += "<rela>" + this.rela + "</rela><id>" + this.id + "</id>";
        str += "<fcr>" + this.fsource.cr + "</fcr><scr>" + this.ssource.cr + "</scr>";
        str += "<ae>" + this.ae + "</ae>";
        str += "<st>" + this.st + "</st>";
        str += "<dn>" + this.dn + "</dn>";
        str += "<scb>" + this.scb + "</scb>";
        str += "<csm>" + this.csm + "</csm>";
        str += "<csf>" + this.csf + "</csf>";
        str += "<ll>" + this.ll + "</ll>";
        str += "<fou>" + this.fou + "</fou>";
        str += "<fiu>" + this.fiu + "</fiu>";
        str += "<frm>" + this.frm + "</frm>";
        str += "<gc>" + this.gc + "</gc>";
        str += "<gf>" + this.gf + "</gf>";
        str += "<cmd>" + this.cmd + "</cmd>";
        str += "<gi>" + this.gi + "</gi><showtop>" + this.showtop + "</showtop>";
        str += "<addf>" + escape(this.addf) + "</addf>";
        str += "<addpf>" + escape(this.addpf) + "</addpf>";
        str += "<oncreate>" + escape(this.oncreate.tostring()) + "</oncreate>";
        str += "<onactive>" + escape(this.onactive.tostring()) + "</onactive>";
        str += "<onclick>" + escape(this.onclick.tostring()) + "</onclick>";
        str += "<onfocus>" + escape(this.onfocus.tostring()) + "</onfocus>";
        str += "<ondblclick>" + escape(this.ondblclick.tostring()) + "</ondblclick>";
        str += "<onpostinit>" + escape(this.onpostinit.tostring()) + "</onpostinit>";
        str += "<ondeactive>" + escape(this.ondeactive.tostring()) + "</ondeactive>";
        str += "<onselect>" + escape(this.onselect.tostring()) + "</onselect>";
        str += "<onexpand>" + escape(this.onexpand.tostring()) + "</onexpand>";
        return str;
    };

    this.onactive = new delegate();
    this.onclick = new delegate();
    this.onfocus = new delegate();
    this.ondblclick = new delegate();

    this.onpostinit = new delegate();
    this.ondeactive = new delegate();
    this.onselect = new delegate();
    this.onexpand = new delegate();
    this.oncreate = new delegate();
}
function copyPaste(action, node) {
    switch (action) {
        case "cut":
        case "copy":
            clipboardNode = node;
            pasteMode = action;
            break;
        case "paste":
            if (!clipboardNode) {
                alert("粘贴板没有东西！");
                break;
            }
            if (pasteMode == "cut") {
                var cb = clipboardNode.toDict(true, function (dict) { });
                if (clipboardNode.data.isFolder && !CheckChildren(clipboardNode, node.data.key)) {
                    alert("不能移动到子目录！");
                    return;
                }
                if (MoveNodeInfo(clipboardNode, node, "over")) {
                    node.addChild(cb);
                    clipboardNode.remove();
                }
                else {
                    alert("粘贴失败！");
                }
            }
            else {
                var cb = clipboardNode.toDict(false, function (dict) {
                    dict.title = "复件 " + dict.title;
                    delete dict.key;
                });
                if (CopyNode(clipboardNode, node) > 0) {
                    if (!node.data.isFolder) {
                        node.parent.addChild(cb);
                    }
                    else {
                        node.addChild(cb);
                    }
                }
                else {
                    alert("复制失败！");
                }
            }
            clipboardNode = pasteMode = null;
            break;
        default:
            alert("Unhandled clipboard action '" + action + "'");
    }
}
function RefreshNode(pnode) {
    if (pnode.data.key != "null") {
        if (pnode.data.isLazy) {
            pnode.reloadChildren(function (pnode, isOk) {
            });
        }
        else {
            var tt = pnode.tree;
            tt.reload();
            var p = tt.getNodeByKey(pnode.data.key);
            p.expand(true);
            while (p.parent != undefined) {
                p = p.parent;
                p.expand(true);
            }
        }
    }
}
function bindContextMenu(span, addfunction, addpfunction) {
    $(span).bind("mousedown", function () {
        var mnode = $.ui.dynatree.getNode($(span)[0]);
        if (event.button == 2) {
            var bShowAdd = false;
            if (mnode.data.isFolder) {
                if (typeof mnode.getChildren() != "undefined")
                    bShowAdd = true;
            }
            if (bShowAdd) {
                $("#myMenu_addf").show();
                $("#myMenu_addp").show();
            }
            else {
                $("#myMenu_addf").hide();
                $("#myMenu_addp").hide();
            }
        }
    });
    $(span).contextMenu({ menu: "myMenu" }, function (action, el, pos) {
        var node = $.ui.dynatree.getNode(el);
        //        node.tree.activateKey(10);
        switch (action) {
            case "cut":
            case "copy":
            case "paste":
                copyPaste(action, node);
                break;
            case "edit":
                BeginEdit(node);
                break;
            case "delete":
                if (DeleteNode(node) > 0) {
                    var pnode = node.parent;
                    node.removeChildren();
                    node.remove();
                    RefreshNode(pnode);
                    $("ul:empty").height(0);
                    $("ul:empty").css({ fontSize: "0pt" });
                    //                    pnode.render(false, false);
                    //                    $("ul:empty").height(0);
                    //                    $("ul:empty").remove();
                    //                    pnode.activate();
                    //                    pnode.expand(true);
                    //                    while (pnode.parent != undefined)
                    //                    {
                    //                        pnode = pnode.parent;
                    //                        pnode.expand(true);
                    //                    }
                }
                break;
            case "quit":
                $(".contextMenu").hide();
                break;
            case "add":
                {
                    if (addfunction != "" && addfunction != undefined) {
                        eval(addfunction);
                    }
                    else {
                        if (!node.data.isFolder)
                            return;
                        node.expand();
                        node.addChild({ title: "新文件", key: "-1", isFolder: false });
                        var newnode = node.tree.getNodeByKey("-1");
                        BeginEdit(newnode);
                    }
                }
                break;
            case "addp":
                {
                    if (addpfunction != "" && addpfunction != undefined) {
                        eval(addpfunction);
                    }
                    else {
                        if (!node.data.isFolder)
                            return;
                        node.expand();
                        node.addChild({ title: "新节点", key: "-1", isFolder: true });
                        var newnode = node.tree.getNodeByKey("-1");
                        BeginEdit(newnode);
                    }
                }
                break;
            default:
                alert("Todo: appply action '" + action + "' to node " + node);
        }
    });
}
var editTemp = null;
var vTemp = null;
function BeginEdit(node) {
    var v = $(node.span).text();
    vTemp = v;
    editTemp = $(node.span).find("a")[0].outerHTML;
    $(node.span).find("a").replaceWith("<input style='width:120px' type='text' onkeydown='KeyDownFunc()' onfocus='FocusEnd(this)'  />");
    $(node.span).find("input").blur(function () { EndEdit(node); }).focus().val(v);
}
function EndEdit(node) {
    var v = $(node.span).find("input").val();
    $(node.span).find("input").replaceWith(editTemp);
    $(node.span).find("a").text(v);
    node.data.title = v;
    if (node.data.key != "-1") {
        var up = UpdateNode(node);
        if (up[0] < 0) {
            alert("更新失败！错误信息：" + up[1]);
            $(node.span).find("a").text(vTemp);
            node.data.title = vTemp;
        }
        else {
            if (node.parent.data.isLazy) {
                node.parent.reloadChildren(function (node, isOk) {
                });
            }
        }
    }
    else {
        var newId = AddNode(node);
        if (newId[0] < 0) {
            alert("添加失败！错误信息：" + newId[1]);
            node.remove();
        }
        else {
            if (node.parent.data.isLazy) {
                node.parent.reloadChildren(function (node, isOk) {
                });
            }
        }
    }

}
function FocusEnd(e) {
    var r = e.createTextRange();
    r.moveStart('character', e.value.length);
    r.collapse(true);
    r.select();
}
function KeyDownFunc() {
    event.cancelBubble = true;
    var e = event.srcElement;
    if (event.keyCode == 13) {
        event.keyCode = 9;
    }
    else if(event.keyCode == 27)
    {
        event.returnValue = false;
        $(e).replaceWith(editTemp);
    }
}
function CheckChildren(node, checkid) {
    if (node.childList == null)
        return true;
    for (var i = 0; i < node.childList.length; i++) {
        if (node.childList[i].data.isFolder) {
            if (node.childList[i].data.key == checkid) {
                return false;
            }
            else {
                if (!CheckChildren(node.childList[i], checkid)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function DeleteNode(node) {
    var thisTree = eval(node.tree.divTree.id + "Prop");
    var r = null;
    if (!confirm("确定要删除 " + node.data.title + " 吗？"))
        return -1;
    if (node.data.isFolder) {
        if (node.hasChildren()) {
            alert(node.data.title + " 文件夹下还有文件，无法删除！");
            return -1;
        }
        r = thisTree.DeleteAjax(node.data.key, thisTree.FolderKey, thisTree.FolderTable);
    }
    else {
        r = thisTree.DeleteAjax(node.data.key, thisTree.FileKey, thisTree.FileTable);
    }
    if (r[0] < 0)
        alert("删除失败！错误信息：" + r[1]);
    return r[0];
}
function UpdateNode(node) {
    var thisTree = eval(node.tree.divTree.id + "Prop");
    var r = null;
    if (node.data.isFolder) {
        r = thisTree.UpdateAjax($(node.span).find("a").text(), node.data.key, thisTree.FolderValue, thisTree.FolderKey, thisTree.FolderTable);
    }
    else {
        r = thisTree.UpdateAjax($(node.span).find("a").text(), node.data.key, thisTree.FileValue, thisTree.FileKey, thisTree.FileTable);
    }
    return r;
}
function CopyNode(node, pnode) {
    var thisTree = eval(node.tree.divTree.id + "Prop");
    var r = null;
    if (!pnode.data.isFolder)
        pnode = pnode.parent;
    if (node.data.isFolder) {
        r = thisTree.CopyAjax(node.data.key, thisTree.FolderKey, thisTree.FolderRela, pnode.data.key, thisTree.FolderValue, thisTree.FolderTable);
    }
    else {
        r = thisTree.CopyAjax(node.data.key, thisTree.FileKey, thisTree.FileRela, pnode.data.key, thisTree.FileValue, thisTree.FileTable);
    }
    return r;
}
function AddNode(node) {
    var thisTree = eval(node.tree.divTree.id + "Prop");
    var r = ["-1", ""];

    if (node.data.isFolder) {
        r = thisTree.AddAjax(node.data.title, node.parent.data.key, thisTree.FolderValue, thisTree.FolderRela, thisTree.FolderTable);
    }
    else {
        r = thisTree.AddAjax(node.data.title, node.parent.data.key, thisTree.FileValue, thisTree.FileRela, thisTree.FileTable);
    }
    return r;
}
function SetAttr(t, o) {
    for (var s in t) {
        if ((typeof t[s]).toLowerCase() != "function") {
            if ((typeof t[s]).toLowerCase() == "string" && s.indexOf("value") < 0 && s.indexOf("text") < 0) {
                o.selfattr[s] = t[s].replace(/"/g, '\\"');
            }
            else {
                if (t[s].tostring != undefined) {
                    o.selfattr[s] = t[s].tostring().replace(/"/g, '\\"');
                }
                else {
                    for (var fs in t[s]) {
                        if ((typeof t[s][fs]).toLowerCase() == "string") {
                            o.selfattr[(s == "fsource" ? "f" : "s") + fs] = t[s][fs].replace(/"/g, '\\"');
                        }
                    }
                }
            }
        }
    }
}
function GetTreeValue(treeid) {
    var ttt = eval(treeid);
    if (ttt.scb.toLowerCase() != "true")
        return ttt.activevalue;
    if (ttt.csm.toLowerCase() != "true")
        return ttt.selectvalue;
    if (ttt.csf.toLowerCase() != "true")
        return ttt.getallvalue();
    var ar = new Array();
    ar.push(ttt.getallfolder());
    ar.push(ttt.getallvalue());
    return ar;
}

var DTreeProc = {};
DTreeProc.setTreeEditable = function (tree, treeid) {
    tree.MoveNodeInfo = function (sourceNode, targetNode, hitMode) {
        var r = null;
        if (hitMode == "over") {
            if (!targetNode.data.isFolder)
                return false;
        } else {
            if (targetNode.data.key == "null") {
                alert("不能移动到根节点以上");
                return false;
            }
            targetNode = targetNode.parent;
        }
        if (sourceNode.data.isFolder) {
            r = this.UpdateAjax(targetNode.data.key, sourceNode.data.key, this.FolderRela, this.FolderKey, this.FolderTable, treeid);
        } else {
            r = this.UpdateAjax(targetNode.data.key, sourceNode.data.key, this.FileRela, this.FileKey, this.FileTable, treeid);
        }
        if (r[0] < 0) {
            alert("移动失败！错误信息：" + r[1]);
        }
        return r[0];
    }
    tree.UpdateAjax = function (newvalue, key, valuecol, keycol, tablename) {
        var r = Tree.UpdateNode(newvalue, key, valuecol, keycol, tablename, treeid).value;
        return r;
    }
    tree.DeleteAjax = function (key, keycol, tablename) {
        var r = Tree.DeleteNode(key, keycol, tablename, treeid).value;
        return r;
    }
    tree.CopyAjax = function (sourceid, keycol, relacol, targetid, namecol, tablename) {
        var r = Tree.CopyNode(sourceid, keycol, relacol, targetid, namecol, tablename, treeid).value;
        return r;
    }
    tree.AddAjax = function (value, pkey, valuecol, keycol, tablename) {
        var r = Tree.AddNode(value, pkey, valuecol, keycol, tablename, treeid).value;
        return r;
    }
}

DTreeProc.loadNode = function (treeid, node, tData) {
    node.setLazyNodeStatus(DTNodeStatus_Ok);
    node.removeChildren();
    if (Tree.GetLazyScript != undefined) {
        var c = Tree.GetLazyScript(node.data.key, tData.dt.OtherAry, treeid).value;
        try {
            c = "[" + c + "]";
            c = eval(c);
            node.addChild(c);
            if (tData.t != null)
                tData.t.onexpand.run(node);
        } catch (e) {
            alert("出现错误，错误信息：" + c);
        }
    }
}

function createTreeOptions(tData, treeid, fCreateTree, defaultnode, autoExpand, bEditable) {
    return {
        activeVisible: true,
        strings: { loading: "载入中…", loadError: "载入失败!" },
        onClick: function (node, event) {
            if ($(".contextMenu:visible").length > 0) {
                $(".contextMenu").hide();
            }
            if ($(node.span).find("input").length > 0)
                return false;

            tData.t.selecttext = node.data.title;
            tData.t.selectvalue = node.data.key;
            tData.t.focustext = node.data.title;
            tData.t.focusvalue = node.data.key;

            tData.t.onclick.run(node);
        },
        onKeydown: function (node, event) {
            if ($(".contextMenu:visible").length > 0)
                return false;
            switch (event.which) {
                case 32: // [Space] 
                    $(node.span).trigger("mousedown", { preventDefault: true, button: 2 })
                    .trigger("mouseup", { preventDefault: true, pageX: node.span.offsetLeft, pageY: node.span.offsetTop, button: 2 });
                    return false;
                    //                        case 67:
                    //                            if (event.ctrlKey)
                    //                            { // Ctrl-C 
                    //                                copyPaste("copy", node);
                    //                                return false;
                    //                            }
                    //                            break;
                    //                        case 86:
                    //                            if (event.ctrlKey)
                    //                            { // Ctrl-V 
                    //                                copyPaste("paste", node);
                    //                                return false;
                    //                            }
                    //                            break;
                    //                        case 88:
                    //                            if (event.ctrlKey)
                    //                            { // Ctrl-X 
                    //                                copyPaste("cut", node);
                    //                                return false;
                    //                            }
                    //                            break;
            }
        },

        onCreate: function (node, span) {
            if (!(!node.data.isFolder && node.hasChildren() && node.data.key != "null")) {
                if (bEditable) {
                if (tData.t != null && tData.t.addFunction != "")
                    bindContextMenu(span, tData.t.addf, tData.t.addpf);
                else
                    bindContextMenu(span);
            }
            }
            if (tData.t != null)
                tData.t.oncreate.run(node);
        },

        onSelect: function (flag, node) {
            tData.t.onselect.run();
        },
        onPostInit: function (isReloading, isError) {
            if (!isReloading) {
                if (tData.t == null) {
                    tData.dt = fCreateTree();
                    tData.t = tData.dt.ThisTreeFunc;
                }
                if (defaultnode != "") {
                    tData.t.selectbyvalue(defaultnode);
                }
            }
            if (autoExpand) {
                $("#" + treeid).dynatree("getTree").visit(function (node) {
                    if (node.data.isFolder)
                        node.expand();
                });
            }
            tData.t.onpostinit.run();
        },

        onFocus: function (node) {
            tData.t.focustext = node.data.title;
            tData.t.focusvalue = node.data.key;
            tData.t.onfocus.run(node);
        },
        onDblClick: function (node) {
            tData.t.ondblclick.run(node);
        },
        onActivate: function (node) {
            tData.t.activetext = node.data.title;
            tData.t.activevalue = node.data.key;
            tData.t.currentNode = node;
            if (tData.dt.FrameId != "") {
                if ($("#" + tData.dt.FrameId) && !(!node.data.isFolder && node.hasChildren())) {
                    if (node.data.isFolder && tData.dt.FolderUrl != "") {
                        $("#" + tData.dt.FrameId).attr("src", tData.dt.FolderUrl + "?&id=" + tData.dt.FolderKey);
                    }
                    else if (FileUrl != "") {
                        $("#" + tData.dt.FrameId).attr("src", tData.dt.FileUrl + "?&id=" + tData.dt.FileKey);
                    }
                }
            }
            tData.t.onactive.run(node);
        },
        onExpand: function (flag, node) {
            tData.t.onexpand.run(node);
        },
        onDeactivate: function (node) {
            tData.t.ondeactive.run(node);
        },
        onLazyRead: function (node) {
            node.setLazyNodeStatus(DTNodeStatus_Loading);
            window.setTimeout(function () {
                DTreeProc.loadNode(treeid, node, tData);
            }, 10);
        },
        onRead: function (node) {
            DTreeProc.loadNode(treeid, node, tData);
        },
        dnd: {
            onDragStart: function (node) {
                if (!bEditable)
                    return false;
                if (node.data.key.toLowerCase() == 'null')
                    return false;
                if (!node.data.isFolder && node.hasChildren())
                    return false;
                return true;
            },
            onDragStop: function (node) {
                if (!node.data.isFolder)
                    return false;
            },
            autoExpandMS: 1000,
            preventVoidMoves: true,
            onDragEnter: function (node, sourceNode) {
                return true;
            },
            onDragOver: function (node, sourceNode, hitMode) {
                if (node.isDescendantOf(sourceNode))
                    return false;
                if (!node.data.isFolder && node.hasChildren())
                    return false;
                if (!node.data.isFolder && hitMode == "over")
                    return false;
                if (!node.parent.data.isFolder && node.parent.hasChildren())
                    return false;
            },
            onDrop: function (node, sourceNode, hitMode, ui, draggable) {
                if (sourceNode.data.isFolder && !CheckChildren(sourceNode, node.data.key))
                    return false;
                if (!sourceNode.data.isFolder && sourceNode.hasChildren())
                    return false;
                if (!node.parent.data.isFolder && node.parent.hasChildren())
                    return false;
                if (tData.dt.MoveNodeInfo(sourceNode, node, hitMode) > 0) {
                    var ps = sourceNode.parent;
                    var pn = node.parent;
                    if (hitMode == "over") {
                        pn = node;
                    }
                    sourceNode.move(node, hitMode);
                    $("ul:empty").height(0);
                    $("ul:empty").css({ fontSize: "0pt" });
                    if (pn.data.key != "_1")
                        RefreshNode(pn);
                    if (ps.data.key != "_1")
                        RefreshNode(ps);
                }
                else {
                    return;
                }
            },
            onDragLeave: function (node, sourceNode) { }
        }
    };
}