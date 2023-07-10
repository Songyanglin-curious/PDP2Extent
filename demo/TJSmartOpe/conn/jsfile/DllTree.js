
function dynatreeObject(treeid) {
    this.id = treeid;

    this.clipboardNode = null;
    this.pasteMode = null;

    this.selecttext = "";
    this.selectvalue = "";
    this.focustext = "";
    this.focusvalue = "";
    this.activetext = "";
    this.activevalue = "";


    this.getallvalue = function (bIncludeFolder, bSkipSon) {
        var allvalue = new Array();
        $("#" + this.id).dynatree("getTree").visit(function (node) {
            if (!node.isSelected())
                return;
            if (bSkipSon) {
                if (node.parent.isSelected())
                    return;
            }
            if (bIncludeFolder || (!node.data.isFolder && !node.hasChildren())) {
                allvalue.push(node.data.key);
            }
        });
        return allvalue;
    };
    this.getalltext = function (bIncludeFolder) {
        var alltext = new Array();
        $("#" + this.id).dynatree("getTree").visit(function (node) {
            if (!node.isSelected())
                return;
            if (bIncludeFolder || (!node.data.isFolder && !node.hasChildren())) {
                alltext.push(node.data.title);
            }
        });
        return alltext;
    };
    this.getNodeByValue = function (value) {
        return $("#" + this.id).dynatree("getTree").getNodeByKey(value);
    };
    this.getTree = function () {
        return $("#" + this.id).dynatree("getTree");
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

function createDynatree(treeid, treeObject, dll, defaultnode, autoExpand) {
    return {
        activeVisible: true,
        strings: { loading: "载入中…", loadError: "载入失败!" },
        onClick: function (node, event) {
            //if ($(".contextMenu:visible").length > 0) { $(".contextMenu").hide(); }
            if ($(node.span).find("input").length > 0) { return false; }

            treeObject.selecttext = node.data.title;
            treeObject.selectvalue = node.data.key;
            treeObject.focustext = node.data.title;
            treeObject.focusvalue = node.data.key;

            treeObject.onclick.run(node);
        },
        onKeydown: function (node, event) {
            if ($(".contextMenu:visible").length > 0)
                return false;
            switch (event.which) {
                case 32: // [Space] 
                    $(node.span).trigger("mousedown", { preventDefault: true, button: 2 })
                        .trigger("mouseup", { preventDefault: true, pageX: node.span.offsetLeft, pageY: node.span.offsetTop, button: 2 });
                    return false;
            }
        },
        onCreate: function (node, span) {
            treeObject.oncreate.run(node);
        },

        onSelect: function (flag, node) {
            treeObject.onselect.run();
        },
        onPostInit: function (isReloading, isError) {
            if (!isReloading) {
                if (defaultnode != "") {
                    treeObject.selectbyvalue(defaultnode);
                }
            }
            if (autoExpand) {
                $("#" + treeid).dynatree("getTree").visit(function (node) {
                    if (node.data.isFolder)
                        node.expand();
                });
            }
            treeObject.onpostinit.run();
        },

        onFocus: function (node) {
            treeObject.focustext = node.data.title;
            treeObject.focusvalue = node.data.key;
            treeObject.onfocus.run(node);
        },
        onDblClick: function (node) {
            treeObject.ondblclick.run(node);
        },
        onActivate: function (node) {
            treeObject.activetext = node.data.title;
            treeObject.activevalue = node.data.key;
            treeObject.currentNode = node;
            var frameId = node.data.frameId;
            if (!frameId)
                frameId = treeObject.FrameId;
            if (frameId != "") {
                var frame$ = $("#" + frame);
                if (frame$ && !(!node.data.isFolder && node.hasChildren())) {
                    if (node.data.isFolder && treeObject.FolderUrl != "") {
                        frame$.attr("src", treeObject.FolderUrl + "?&id=" + treeObject.FolderKey);
                    }
                    else if (FileUrl != "") {
                        frame$.attr("src", treeObject.FileUrl + "?&id=" + treeObject.FileKey);
                    }
                }
            }
            treeObject.onactive.run(node);
        },
        onExpand: function (flag, node) {
            treeObject.onexpand.run(node);
        },
        onDeactivate: function (node) {
            treeObject.ondeactive.run(node);
        },
        onLazyRead: function (node) {
            node.setLazyNodeStatus(DTNodeStatus_Loading);
            window.setTimeout(function () {
                node.setLazyNodeStatus(DTNodeStatus_Ok);
                node.removeChildren(); 
                var childNodes = ExecuteBack(function () { return YshGrid.Execute(treeObject.dll, [node.data.key]); });
                if (!childNodes.check("获取数据", true))
                    return;
                if (node.bSelected) {
                    for (var i = 0; i < childNodes.value.length; i++) {
                        childNodes.value[i].select = true;
                    }
                }
                node.addChild(childNodes.value);
                treeObject.onexpand.run(node);
            }, 10);
        },
        children: null
    };
}