var MenuTextColor_enable = '#3C4885';
var MenuTextColor_disable = '#BABED3';
var appState = new applicationState();

function applicationState() {
    this.contextMenu = null;
}

function loadContextMenuXY(xmlpath, xslpath, x, y, up) {
    if (xmlpath == "")
        return false;
    var xmlDoc = new ActiveXObject('MSXML2.DOMDocument');
    xmlDoc.async = false;
    var xslDoc = new ActiveXObject('MSXML2.DOMDocument');
    xslDoc.async = false;
    xmlDoc.loadXML(xmlpath);
    xslDoc.load(xslpath);

    if (appState.contextMenu != null)
        appState.contextMenu.removeNode(true);

    document.body.insertAdjacentHTML("beforeEnd", xmlDoc.documentElement.transformNode(xslDoc));
    var contextMenu = document.body.childNodes[document.body.childNodes.length - 1];
    //edit by subo 20130320，判断了下右键菜单距离屏幕右侧距离，以对菜单的显示位置进行调整
    var alignD = document.body.clientWidth - x - contextMenu.scrollWidth;
    if (alignD <= 0)
        x -= contextMenu.scrollWidth - 3;
    //edit end
    contextMenu.style.left = x + document.body.scrollLeft - 3;

    if (!up) {
        var MenuHeight = xmlDoc.documentElement.childNodes.length * 25;
        var ValignD = document.body.clientHeight - y;
        up = ValignD >= MenuHeight;
    }

    if (up) {
        contextMenu.style.top = y + document.body.scrollTop - 5;
    } else {
        contextMenu.style.top = y < MenuHeight ? document.body.scrollTop + 5 : document.body.scrollTop + y - MenuHeight + 10;
    }

    appState.contextMenu = contextMenu;
    return true;
}

function loadContextMenu(xmlpath, xslpath) {
    if (loadContextMenuXY(xmlpath, xslpath, window.event.x, window.event.y, false))
        window.event.cancelBubble = true;
}

function loadContextMenuSub(obj) {
    var parentMenu = returnContainer(obj);
    var contextMenu = document.all[obj.id + "Sub"];
    contextMenu.style.display = "block";
    contextMenu.style.top = obj.offsetTop + parentMenu.style.pixelTop;
    contextMenu.style.left = obj.offsetWidth + parentMenu.style.pixelLeft;
    contextMenu.style.zIndex = '100';
    parentMenu.subMenu = contextMenu;
}

function contextHighlightRow(obj) {
    var parentMenu = returnContainer(obj);
    if (obj.selected == "false") {
        for (var i = 0; i < obj.childNodes.length; i++) {
            obj.childNodes[i].style.borderTop = "1px solid #919CD0";
            obj.childNodes[i].style.borderBottom = "1px solid #919CD0";

            if (obj.childNodes[i].cellIndex == 0) {
                obj.childNodes[i].style.borderLeft = "1px solid #919CD0";
            }
            else if (obj.childNodes[i].cellIndex == obj.cells.length - 1) {
                obj.childNodes[i].style.borderRight = "1px solid #919CD0";
            }
        }
        if (parentMenu.subMenu != null && parentMenu != parentMenu.subMenu) {
            var subMenu = parentMenu.subMenu;
            while (subMenu != null) {
                subMenu.style.display = "none";
                subMenu = subMenu.subMenu;
            }
        }
        obj.selected = "true";
    }
    else {
        for (var i = 0; i < obj.childNodes.length; i++) {
            if (i == 0) {
                obj.childNodes[i].style.borderTop = "1px solid " + obj.titlebar;
                obj.childNodes[i].style.borderBottom = "1px solid " + obj.titlebar;
            }
            else {
                obj.childNodes[i].style.borderTop = "1px solid " + obj.background;
                obj.childNodes[i].style.borderBottom = "1px solid " + obj.background;
            }

            if (obj.childNodes[i].cellIndex == 0) {
                obj.childNodes[i].style.borderLeft = "1px solid " + obj.titlebar;
            }
            else if (obj.childNodes[i].cellIndex == obj.cells.length - 1) {
                obj.childNodes[i].style.borderRight = "1px solid " + obj.background;
            }
        }
        obj.selected = "false";
    }
}

function cleancontextMenu() {
    // remove and destroy context menu
    if (appState.contextMenu != null) {
        var contextMenu = appState.contextMenu.removeNode(true);
        contextMenu = null;
    }
}

function returnContainer(container) {
    while (container.tagName != "DIV") {
        container = container.parentNode;
    }
    return container;
}

///////////附加功能函数///////////

//此函数修改菜单节点的图片、颜色、onclick事件
function contextmenu_nodechange(root, nodeid, menuText, imgURL, color, onclickTxt) {
    var Node = root.childNodes.item(nodeid);
    if (menuText != '') { Node.childNodes.item(0).text = menuText; }
    if (imgURL != '') { Node.childNodes.item(1).text = imgURL; }
    if (color != '') { Node.childNodes.item(2).text = color; }
    Node.childNodes.item(3).text = onclickTxt;
    return root;
}
