var topMenu = {
    current: null
    , all: []
    , AddMenu: function (menu) { this.all.push(menu); }
    , GetLast: function () { if (0 == this.all.length) return null; return this.all[this.all.length - 1]; }
    , RemoveLast: function () { if (0 == this.all.length) return; return this.all.splice(this.all.length - 1, 1); }
    , ShowTopMenu: function (menuid, menubar, x, y) {
        if (menubar == null)
            return;
        this.current = menuid;
        if (!this[menuid]) {
            menubar.CreateMenu();
            this[menuid] = menubar;
        }
        menubar.Show(x, y);
        this.all = [menubar];
    }
    , ShowContextMenu: function (menubar, x, y) {
        if (menubar == null)
            return;
        this.current = "context";
        menubar.CreateMenu();
        this[this.current] = menubar;
        menubar.Show(x, y);
        this.all = [menubar];
    }
    , DestroyMenu: function () {
        if (null != this.current) {
            this[this.current].Hide();
        }
        this.all = [];
    }
    , DedayDestory: function () {
        if (this.kill > 0)
            this.DestroyMenu();
    }
    , kill: 0
};

function cleanContextMenu() {
    topMenu.DestroyMenu();
}

function CMenuBar() {
    this.wnd = null;
    this.menus = [];
    this.CreateItem = function (text, click, img) {
        var item = { "text": text, "click": click, "image": img, subs: null, OnClick: function () { }, destroy: function () { if (null == this.subs) return; this.subs.destroy(); delete this.subs; } };
        this.menus.push(item);
        return item;
    }
    this.destroy = function () {
        for (var i = 0; i < this.menus.length; i++) {
            var menu = this.menus[i];
            menu.destroy();
            delete menu;
        }
        if (null != this.wnd)
            this.wnd.parentNode.removeChild(this.wnd);
        delete this.wnd;
    }
    this.Show = function (x, y) {
        this.wnd.style.display = "";
        this.wnd.style.left = x + "px";
        this.wnd.style.top = y + "px";
    }
    this.Hide = function () {
        for (var i = 0; i < this.menus.length; i++) {
            var menu = this.menus[i];
            if (menu.subs)
                menu.subs.Hide();
        }
        this.wnd.style.display = "none";
    }
    this.CreateMenu = function () {
        var menus = this.menus;
        var div = document.createElement("DIV");
        div.onselectstart = function () { return false; }
        div.ondragstart = function () { return false; }
        div.oncontextmenu = function () { return false; }
        div.className = "mBar";
        SetKillMenuEvent(div);
        var divMain = document.createElement("DIV");
        div.appendChild(divMain);
        var tblOut = document.createElement("TABLE");
        divMain.appendChild(tblOut);
        with (tblOut) { border = 0; cellSpacing = 0; cellPadding = 0; className = "mBorder"; }
        var tdOut = tblOut.insertRow(-1).insertCell(-1);
        var tblInner = document.createElement("TABLE");
        tdOut.appendChild(tblInner);
        var tblInner = tblOut;
        with (tblInner) { border = 0; cellSpacing = 0; cellPadding = 0; }
        for (var i = 0; i < menus.length; i++) {
            var menu = menus[i];
            var tr = tblInner.insertRow(-1);
            tr._menu = menu;
            if ((menu.click) && (menu.subs == null))
                Ysh.Web.Event.attachEvent(tr, "onclick", function () {
                    if (!event) return; var obj = Ysh.Web.getParent(event.srcElement, "TR"); if (!obj) return;
                    obj._menu.OnClick(); topMenu.DestroyMenu();
                });
            Ysh.Web.Event.attachEvent(tr, "onmouseover", HighlightMenu);
            Ysh.Web.Event.attachEvent(tr, "onmouseout", UnhighlightMenu);
            var tdImage = tr.insertCell(-1);
            tdImage.setAttribute("nowrap", "true");
            tdImage.className = "mImage";
            tdImage.innerHTML = menu.image ? '<IMG BORDER="0" HEIGHT="15px" WIDTH="15px" SRC="' + menu.image + '" />' : '<span STYLE="BORDER:0;HEIGHT:15px;WIDTH:15px;"></span>';
            //tdImage.innerHTML = '<span STYLE="BORDER:0;HEIGHT:15px;WIDTH:1px;"></span>';
            var tdText = tr.insertCell(-1);
            tdText.className = "mText";
            tdText.setAttribute("nowrap", "true");
            tdText.innerHTML = menu.text;
            var tdSub = tr.insertCell(-1);
            tdSub.setAttribute("nowrap", "true");
            tdSub.className = "mSub";
            tdSub.innerHTML = '<IMG BORDER="0" WIDTH="4" src="' + ((menu.subs != null) ? '/i/flow_image/opensub.gif' : '/i/flow_image/spacer.gif') + '" />';

        }
        document.body.appendChild(div);

        div.style.display = "none";
        this.wnd = div;
        for (var i = 0; i < this.menus.length; i++) {
            var submenubar = this.menus[i].subs;
            if (null != submenubar)
                submenubar.CreateMenu();
        }
    }
}

function SetKillMenuEvent(obj) {
    if (!obj)
        return;
    //obj.onmousemove = function () { topMenu.kill = 0; }
    //obj.onmouseout = function () { topMenu.kill = 1; setTimeout("topMenu.DedayDestory()", 500); }
}

function UnhighlightMenu() {
    if (!event) return;
    var obj = Ysh.Web.getParent(event.srcElement, "TR");
    if (!obj) return;
    for (var i = 0; i < obj.childNodes.length; i++) {
        if (i == 0) {
            obj.childNodes[i].style.borderTop = "1px solid #FFFFFF";
            obj.childNodes[i].style.borderBottom = "1px solid #FFFFFF";
            //obj.childNodes[i].style.borderTop = "1px solid #96A5CC";
            //obj.childNodes[i].style.borderBottom = "1px solid #96A5CC";
        }
        else {
            obj.childNodes[i].style.borderTop = "1px solid #FFFFFF";
            obj.childNodes[i].style.borderBottom = "1px solid #FFFFFF";
        }

        if (obj.childNodes[i].cellIndex == 0) {
            obj.childNodes[i].style.borderLeft = "1px solid #FFFFFF";
            //obj.childNodes[i].style.borderLeft = "1px solid #96A5CC";
        }
        else if (obj.childNodes[i].cellIndex == obj.cells.length - 1) {
            obj.childNodes[i].style.borderRight = "1px solid #FFFFFF";
        }
    }
}

function HighlightMenu() {//只显示现在这个菜单、子菜单以及上层菜单
    if (!event) return;
    var obj = Ysh.Web.getParent(event.srcElement, "TR");
    if (!obj) return;
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
    //看最后那个菜单是不是当前菜单或者子菜单，如果不是，换掉
    var menuLast = topMenu.GetLast();
    if (menuLast == obj._menu.subs) //鼠标移回到父菜单
        return;
    if (menuLast.menus.indexOf(obj._menu) < 0) {
        menuLast.Hide();
        topMenu.RemoveLast();
    }
    var menu = obj._menu;
    if (!menu.subs)
        return;
    menu.subs.Show(getIEAbsLeft(obj) + obj.offsetWidth, getIEAbsTop(obj));
    topMenu.AddMenu(menu.subs);
}

var menuArray = { menu: [] }

function ShowMenu(mid, x, y) {
    if (top.current == mid)
        return false;
    topMenu.DestroyMenu();
    if ((!mid) || (!menuArray[mid]))
        return false;
    var obj = event.srcElement;
    var menu = null;
    if (topMenu[mid]) {
        menu = topMenu[mid];
    } else {
        menu = GetMenuFromData(topMenu, menuArray[mid]);
    }
    topMenu.text = obj.innerText;
    topMenu.ShowTopMenu(mid, menu, x, y);

    SetKillMenuEvent(obj);
    return false;
}

function ShowContextMenu(menus, x, y) {
    topMenu.DestroyMenu();
    var obj = event.srcElement;
    var menu = GetMenuFromData(topMenu, menus);
    topMenu.ShowContextMenu(menu, x, y);

    SetKillMenuEvent(obj);
    return false;
}

function GetMenuFromData(pmenu, arr) {
    if ((!arr) || (arr.length == 0))
        return null;
    var menu = new CMenuBar();
    for (var i = 0; i < arr.length; i++) {
        var child = arr[i];
        var menuitem = menu.CreateItem(child.text, child.click, child.img);
        menuitem.parent = pmenu;
        menuitem.subs = GetMenuFromData(menuitem, child.subs);
        menuitem.OnClick = function () {
            this.click();
        };
    }
    return menu;
}