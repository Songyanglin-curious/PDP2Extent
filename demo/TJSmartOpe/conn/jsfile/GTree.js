var g_AllTrees = new Array;
var g_TreeImgDir = "";
var g_TreeTextClr = "#000000";

if (!Array.prototype.erase) {
    Array.prototype.erase = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
                break;
        }
        if (i != this.length)
            this.splice(i, 1);
    }
}

function GTREE_findSubByRow(r) {
    for (var i = 0; i < this._children.length; i++) {
        var child = this._children[i];
        if (child._r == r)
            return child;
        if (child.getNodeByRow) {
            var f = child.getNodeByRow(r);
            if (f)
                return f;
        }
    }
    return null;
}

function GTREE_findSubByData(data) {
    for (var i = 0; i < this._children.length; i++) {
        var child = this._children[i];
        if (child._data == data)
            return child;
        if (child.getNodeByData) {
            var f = child.getNodeByData(data);
            if (f)
                return f;
        }
    }
    return null;
}

function GTREE_getLastNode() {
    var l = this._children.length;
    for (var i = l; i > 0; i--)
        if (this._children[i - 1]._children)
            return this._children[i - 1];
    return null;
}

function GTREE_getLastLeaf() {
    var l = this._children.length;
    for (var i = l; i > 0; i--)
        if (!this._children[i - 1]._children)
            return this._children[i - 1];
    return null;
}

function GTREE_getFirstLeaf() {
    var l = this._children.length;
    for (var i = 0; i < l; i++)
        if (!this._children[i]._children)
            return this._children[i];
    return null;
}

function GTREE_clickNode(c) {
    var r = c.parentElement;
    for (var i = 0; i < g_AllTrees.length; i++) {
        var to = g_AllTrees[i];
        var ro = to.getNodeByRow(r);
        if (ro) {
            to.setSelected(ro);
            if (to.clickNode)
                to.clickNode(ro);
            if (window.gtreeNodeClick)
                return gtreeNodeClick(ro);
            return;
        }
    }
}

function GTREE_InitNode(n, p, b0, b1, r, lvl, text, data, linkurl, target) {
    n._b0 = b0; if (b0) b0._b1 = n;
    n._b1 = b1; if (b1) b1._b0 = n;
    n._p = p;
    n._r = r;
    n._lvl = lvl;
    n._text = text;
    n._data = data;
    n._url = linkurl ? linkurl : "#";
    n._target = target ? ("target='" + target + "'") : "";
    n._selected = false;
    n.getAncestor = function (lvl) {
        var a = this;
        for (var i = 0; i < lvl; i++)
            a = a._p;
        return a;
    }
    n.getImgHTML = function (imgname, bSys) {
        return "<img style='border:0;width:18;height:18;text-align:center;vertical-align:middle' src='" + (bSys ? g_TreeImgDir : "") + imgname + "'>";
    }
}

function GTREE_click()
{
    if(window.gTree_click)
        return gTree_click();
    return false;
}

function gnode(p, b0, b1, r, lvl, text, gif, data, linkurl, gif2, target) {
    GTREE_InitNode(this, p, b0, b1, r, lvl, text, data, linkurl, target);
    this._gifclose = gif ? gif : "fclose.gif";
    this._gifopen = gif2 ? gif2 : "fopen.gif";
    this._gif = this._gifclose;
    this._fold = true;
    this._children = new Array;

    this.getNodeByRow = GTREE_findSubByRow;
    this.getNodeByData = GTREE_findSubByData;
    this.getLastNode = GTREE_getLastNode;
    this.getLastLeaf = GTREE_getLastLeaf;
    this.getFirstLeaf = GTREE_getFirstLeaf;
    this.redraw = function (bChildren) {
        this._r.cells[0].innerHTML = this.getHTML();
        if (!bChildren)
            return;
        for (var i = 0; i < this._children.length; i++) {
            this._children[i]._lvl = this._lvl + 1;
            this._children[i].redraw(bChildren);
    }
    }
    this.changeState = function () {
        this._fold = !this._fold;
        this.redraw(false);
        this.displaySons(!this._fold);
    }
    this.displaySons = function (show) {
        for (var i = 0; i < this._children.length; i++) {
            var child = this._children[i];
            child._r.style.display = show ? "" : "none";
            if (child.displaySons)
                child.displaySons(show ? (!child._fold) : false);
        }
    }
    //add by lin 2011-02-18
    //增加一个隐藏自身节点和所有子节点的功能，处理权限用
    this.hidden = function() {
        this._r.style.display = "none";
        this.displaySons(false);
    }
	this.getAncestor = function(lvl) {
		var a = this;
		for (var i = 0;i < lvl;i++)
			a = a._p;
		return a;
	}
	this.getImgHTML = function(imgname,bSys) {
        return "<img style='border:0;width:18;height:18;text-align:center;vertical-align:middle' src='" + (bSys ? g_TreeImgDir : "") + imgname + "'>";
	}
    this.getHTML = function () {
        var str = "";
        for (var i = this._lvl - 1; i > 0; i--)
            str += this.getImgHTML(this.getAncestor(i)._b1 ? "vertline.gif" : "blank.gif", true);
        var treeicon = "node.gif";
        if (this._children.length == 0) {
            treeicon = this._b1 ? "pnode.gif" : "plastnode.gif";
        } else {
            if (this._fold) {
                treeicon = this._b1 ? "pnode.gif" : "plastnode.gif";
            } else {
                treeicon = this._b1 ? "mnode.gif" : "mlastnode.gif";
            }
        }
        var nodeicon = (this._fold) ? this._gifclose : this._gifopen;
        if (nodeicon == "doc.gif") {
            treeicon = this._b1 ? "node.gif" : "lastnode.gif"; //待回要注意
        } return str + "<a style='color:" + (this._selected ? "#ff0000" : g_TreeTextClr)
			+ "'style='font-size:9pt;' onclick='return GTREE_clickNode(this.parentElement)' href='" + this._url + "' title='" + this._text + "' " + this._target + ">"
			+ this.getImgHTML(treeicon, true) + this.getImgHTML(nodeicon, true) + this._text + "</a>";
    }

    //add by popduke 2012-01-12
    //移动所在行到r之前
    this.changeRowPos = function (r) {
        if (!r) {
            this._r.parentNode.appendChild(this._r);
            return;
        }
        r.parentNode.insertBefore(this._r, r);
        if (this._children)
            for (var i = 0; i < this._children.length; i++)
                this._children[i].changeRowPos(r);
    }

    //add by popduke 2012-01-12
    //增加已有节点
    this.addExistNode = function (gnode) {
        gnode._b0 = this.getLastNode();
        gnode._b1 = this.getFirstLeaf();
        this.getLastNode()._b1 = gnode;
        this._children.push(gnode);

        if (gnode._b1)
            gnode.changeRowPos(gnode._b1._r);
        else if (this._b1)
            gnode.changeRowPos(this._b1._r);
        else
            gnode.changeRowPos();
        gnode._p = this;
        this.redraw(true);
        this.displaySons(true);
    }
}

function gleaf(p, b0, b1, r, lvl, text, gif, data, linkurl, target) {
    GTREE_InitNode(this, p, b0, b1, r, lvl, text, data, linkurl, target);
    this._gif = gif ? gif : "doc.gif";

    this.redraw = function (bChildren) {
        this._r.cells[0].innerHTML = this.getHTML();
    }
    this.changeState = function () {
        this.redraw(false);
    }
    this.getHTML = function () {
        var str = "";
        for (var i = this._lvl - 1; i > 0; i--)
            str += this.getImgHTML(this.getAncestor(i)._b1 ? "vertline.gif" : "blank.gif", true);

        var treeicon = this._b1 ? "node.gif" : "lastnode.gif";

        return str + "<a style='color:" + (this._selected ? "#ff0000" : g_TreeTextClr)
			+ "' onclick='return GTREE_clickNode(this.parentElement)'style='font-size:9pt;' href='" + this._url + "' title='" + this._text + "' " + this._target + ">"
			+ this.getImgHTML(treeicon, true) + this.getImgHTML(this._gif, true) + this._text + "</a>";
    }
    //add by lin 2011-02-18
    //增加一个隐藏自身节点的功能，处理权限用
    this.hidden = function() {
        this._r.style.display = "none";
    }
    //add by popduke 2012-01-12
    //移动所在行到r之前
    this.changeRowPos = function (r) {
        if (!r) {
            this._r.parentNode.appendChild(this._r);
            return;
        }
        r.parentNode.insertBefore(this._r, r);
    }
}

function gtree(text, gif) {
    g_AllTrees.push(this);
    document.write("<table id=GTREE_" + g_AllTrees.length
		+ " cellspacing=0 cellpadding=0><tr align='left'><td nowrap><a href='#' onclick='return GTREE_click();' style='font-size:9pt;'><img src='" + g_TreeImgDir + (gif ? gif : "top.gif")
		+ "' style='border:0;width:18px;height:18px;text-align:center;vertical-align:middle'>"
		+ (text ? text : "") + "</a></td></tr></table>");
    this._obj = document.getElementById("GTREE_" + g_AllTrees.length);
    this._children = new Array;
    this._selectedNode = null;
    this._selectType = 0; //0 - All 1 - Leaf

    this.addNode = function (text, linkurl, target, gifopen, gifclose, parent, data, bDraw) {
        var lastSub = parent;
        var nextrow = null;
        if (parent) {
            nextrow = parent.getFirstLeaf();
            if (!nextrow) {
                while (lastSub) {
                    if (lastSub._b1) {
                        nextrow = lastSub._b1;
                        break;
                    }
                    lastSub = lastSub._p;
                }
            }
        }
        else {
            nextrow = this.getFirstLeaf();
        }
        var r = (null == nextrow) ? this._obj.insertRow(this._obj.rows.length) : this._obj.insertRow(nextrow._r.rowIndex);
        r.insertCell(-1).setAttribute("noWrap", true);
        var node;
        if (parent) {
            var lvl = parent._lvl;
            if (parent._fold)
                r.style.display = "none";
            node = new gnode(parent, parent.getLastNode(), parent.getFirstLeaf(), r, lvl + 1, text, gifclose, data, linkurl, gifopen, target);
            parent._children.push(node);
        } else {
            node = new gnode(null, this.getLastNode(), this.getFirstLeaf(), r, 1, text, gifclose, data, linkurl, gifopen, target);
            this._children.push(node);
        }
        if (bDraw) {
            node.redraw(false);
            if (node._b0) node._b0.redraw(true);
            if (node._p) node._p.redraw(false);
        }
        return node;
    }

    this.delNode = function (targetNode) {
        if (targetNode._children)
            while (0 < targetNode._children.length)
                this.delNode(targetNode._children[0]);
        if (targetNode._b0) targetNode._b0._b1 = targetNode._b1;
        if (targetNode._b1) targetNode._b1._b0 = targetNode._b0;
        if(this._selectedNode == targetNode)
            this._selectedNode = targetNode._p;
        if (targetNode._p)
            targetNode._p._children.erase(targetNode);
        else
            this._children.erase(targetNode);
        this._obj.deleteRow(targetNode._r.rowIndex);
        if (targetNode._p)
            targetNode._p.redraw(true);
        else
            this.redraw();
        delete targetNode._children;
        delete targetNode;
        targetNode = targetNode._p;
    }

    this.addLeaf = function (text, linkurl, target, gif, parent, data, bDraw) {
        var lastSub = parent;
        var nextrow = null;
        while (lastSub) {
            if (lastSub._b1) {
                nextrow = lastSub._b1;
                break;
            }
            lastSub = lastSub._p;
        }

        var r = (null == nextrow) ? this._obj.insertRow(this._obj.rows.length) : this._obj.insertRow(nextrow._r.rowIndex);
        r.insertCell(-1).setAttribute("noWrap", true);
        var node;
        if (parent) {
            var lvl = parent._lvl;
            if (parent._fold)
                r.style.display = "none";
            node = new gleaf(parent, parent.getLastLeaf() ? parent.getLastLeaf() : parent.getLastNode(), null, r, lvl + 1, text, gif, data, linkurl, target);
            parent._children.push(node);
        } else {
            node = new gleaf(null, this.getLastLeaf() ? this.getLastLeaf() : this.getLastNode(), null, r, 1, text, gif, data, linkurl, target);
            this._children.push(node);
        }
        if (bDraw) {
            node.redraw(false);
            if (node._b0) node._b0.redraw(true);
            if (node._p) node._p.redraw(false);
        }
        return node;
    }

    this.setSelected = function (n) {
        var bClearP = ((this._selectType != 1) || (!n._children) || (n._children.length == 0));
        if (this._selectedNode && bClearP) {
            this._selectedNode._selected = false;
            this._selectedNode.redraw(false);
        }
        if (!n) return;
        if (bClearP) {
            n._selected = true;
            this._selectedNode = n;
        }
        this.changeFond(n);
    }
    this.changeFond = function (n) {
        for (var i = n._lvl - 1; i > 0; i--) {
            var a = n.getAncestor(i);
            if (!a._fold) continue;
            a.changeState();
        }
        n.changeState();
    }
    this.redraw = function () {
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].redraw(true);
        }
    }
    this.getNodeByData = GTREE_findSubByData;
    this.getNodeByRow = GTREE_findSubByRow;
    this.getLastNode = GTREE_getLastNode;
    this.getLastLeaf = GTREE_getLastLeaf;
    this.getFirstLeaf = GTREE_getFirstLeaf;

    //add by popduke 2012-01-12,更改节点的归属
    this.addExistNode = function (gnode) {
        gnode._b0 = this.getLastNode();
        gnode._b1 = this.getFirstLeaf();
        gnode._lvl = 1;
        this.getLastNode()._b1 = gnode;
        this._children.push(gnode);

        if (gnode._b1)
            gnode.changeRowPos(gnode._b1._r);
        else
            gnode.changeRowPos();
        gnode._p = null;
        gnode.redraw(true);
        if (gnode._b0) gnode._b0.redraw(true);
    }
    this.changeNodePos = function (gnode, pnode) {
        if (gnode._p == pnode)
            return;
        var tempP = pnode;
        while (tempP) {
            if (tempP == gnode) {
                alert("不允许节点父节点嵌套");
                return;
            }
            tempP = tempP._p;
        }
        if (gnode._b0) gnode._b0._b1 = gnode._b1;
        if (gnode._b1) gnode._b1._b0 = gnode._b0;
        if (gnode._p)
            gnode._p._children.erase(gnode);
        else
            this._children.erase(gnode);
        if (pnode)
            pnode.addExistNode(gnode);
        else
            tree.addExistNode(gnode);
    }
}