 // JScript 文件

gtree.prototype.addSelectNode=function(text,linkurl,target,gifopen,gifclose,parent,data,bDraw)
{
    var newNode = this.addNode(text,linkurl,target,gifopen,gifclose,parent,data,bDraw);
    newNode._selectCtrl = document.createElement("<input type='checkbox' />");
    newNode._checked = (!parent) || (parent._checked != 2) ? 0 : 2;
	newNode.getHTML = function() {
		var str = "";
		for (var i = newNode._lvl - 1;i > 0;i--)
			str += newNode.getImgHTML(newNode.getAncestor(i)._b1 ? "vertline.gif" : "blank.gif",true);
		var treeicon = "node.gif";
		if (newNode._children.length == 0) {
			treeicon = newNode._b1 ? "node.gif" : "lastnode.gif";//待回要注意
		} else {
			if (newNode._fold) {
				treeicon = newNode._b1 ? "pnode.gif" : "plastnode.gif";
			} else {
				treeicon = newNode._b1 ? "mnode.gif" : "mlastnode.gif";
			}
		}
		var nodeicon = (newNode._fold) ? newNode._gifclose : newNode._gifopen;
		return str + "<a style='color:" + (newNode._selected ? "#ff0000" : g_TreeTextClr)
			+ "' onclick='if(gtree_ctrlSelect(this.parentElement)) return GTREE_clickNode(this.parentElement);return true' href='"+newNode._url+"' title='"+newNode._text+"' "+newNode._target+">"
			+ newNode.getImgHTML(treeicon,true) + newNode.getImgHTML(nodeicon,true) + newNode._text + "</a>";
	}
    newNode.redraw = function(bChildren) {
		newNode._r.cells[0].innerHTML = newNode.getHTML();
        newNode._r.cells[0].lastChild.lastChild.previousSibling.insertAdjacentElement("afterEnd",newNode._selectCtrl);
        newNode._selectCtrl.checked = (newNode._checked != 0);
        
		if (!bChildren)
			return;
		for (var i = 0;i < newNode._children.length;i++)
			newNode._children[i].redraw(bChildren);
	}
	newNode.redraw(false);
    return newNode;
}

function gtree_ctrlSelect(c)
{
    if(event.srcElement.tagName == "INPUT")
    {
	    var r = c.parentElement;
	    for (var i = 0;i < g_AllTrees.length;i++) {
		    var to = g_AllTrees[i];
	        var ro = to.getNodeByRow(r);
            if(ro){
                ChangeCtrl(ro,event.srcElement.checked);
                if(window.gtree_selectCtrlClicked)
                    gtree_selectCtrlClicked(ro);
                return false;
            }
        }
    }
    return true;
}

function ChangeCtrl(targetNode,bChecked)
{
    if(targetNode._selectCtrl)
    {
        targetNode._selectCtrl.checked = bChecked;
        targetNode._checked = bChecked ? 2 : 0;
    }
}