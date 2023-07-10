
function createTabPage(id, clickfunc, bReverseImg, beforeclickfunc, isSmall) {
    return {
        curpage: 0,
        isCanDel: false,
        widthOfOther: 2, //默认空白占2
        setSpace: function (width) { this.widthOfOther = width; },
        getClass: function (bActive) {
            return (isSmall ? "item_s ": "item ") + this.getCoreClass(bActive);
        },
        getCoreClass: function (bActive) {
            if (bReverseImg)
                return bActive ? "active_ver" : "normal_ver";
            if (isSmall) {
                return bActive ? "active_s" : "normal_s";
            }
            return bActive ? "active" : "normal";
        },
        getPage: function () {
            return this.allItems.length;
        },
        pageUp: function () {
            this.curpage--;
            this.showCurPage();
        },
        pageDown: function () {
            this.curpage++
            this.showCurPage();
        },
        getArrowHtml: function (bUp, bEnable) {
            if (bUp) {
                if (bEnable)
                    return "<span onclick='" + id + "TabPage.pageUp()' id='" + id + "pgUp' class='arrUp' title='上一页'></span>";
                return "<span id='" + id + "pgUp' class='arrUp_grey' title='上一页'></span>";
            } else {
                if (bEnable)
                    return "<span onclick='" + id + "TabPage.pageDown()' id='" + id + "pgDn' class='arrDown' title='下一页'></span>";
                return "<span id='" + id + "pgDn' class='arrDown_grey' title='下一页'></span>";
            }
        },
        createPageUp: function () {
            var sp = "<div id='" + id + "pageSp' style='vertical-align:top;'>" + this.getArrowHtml(true, true) + "</div>";
            return sp;
        },
        createPageDown: function () {
            var sp = "<div id='" + id + "pageSpDn' style='vertical-align:top;'>" + this.getArrowHtml(false, true) + "</div>";
            return sp;
        },
        enablePageUp: function (bEnable) {
            $("#" + id + "pageSp").html(this.getArrowHtml(true, bEnable));
        },
        enablePageDown: function (bEnable) {
            $("#" + id + "pageSpDn").html(this.getArrowHtml(false, bEnable));
        },
        showPageArrow: function (bShow) {
            if (bShow) {
                $("#" + id + "pageSp").show();
                $("#" + id + "pageSpDn").show();
            } else {
                $("#" + id + "pageSp").hide();
                $("#" + id + "pageSpDn").hide();
            }
        },
        getSingleLi: function (index, item, css) {
            return "<div class=\"" + css + "\" customvalue=\"" + item.value
                + "\" onclick=\""
                + id + "TabPage.nTabs(this," + index + ");\" title=\"" + item.title + "\">" + item.text// + "测试加长点"
                + (this.isCanDel ? "<div style='display:inline;padding-left:5px'><img style='vertical-align:middle;width:14px;height:14px' onclick='event.cancelBubble = true;"
                + id + "TabPage.delTab(" + index + ");' src='/i/delctrl.jpg'></div>" : "") + "</div>";
            /*
            return "<div class=\"" + css + "\" customvalue=\"" + item.value
            + "\"><div style=\"padding-top:5px;display:inline\" onclick=\""
            + id + "TabPage.nTabs(this," + index + ");\" title=\"" + item.text + "\">" + item.text + "测试加长点</div>"
            + (this.isCanDel ? "<img style='vertical-align:middle;width:14px;height:14px' src='/i/delctrl.jpg'>" : "") + "</div>";
            */
        },
        jqPanel: null,
        getJqPanel: function () {
            if (null == this.jqPanel)
                this.jqPanel = $("#dvTab" + id);
            return this.jqPanel;
        },
        addTabs: function (itemList) {
            var p = this.getJqPanel();
            var pd = p[0];
            p.html(this.createPageUp());
            $(pd.lastChild).hide();
            this.items = [];
            this.totalWidth = 0;
            for (var i = 0; i < itemList.length; i++) {
                var itemThis = itemList[i];
                var item = { value: itemThis[0], text: itemThis[1], width: 0 };
                item.title = (itemThis.length > 2) ? itemThis[2] : item.text;
                this.items.push(item);
                p.append(this.getSingleLi(i, item, this.getClass(false)));
                item.obj = $(pd.lastChild);
                item.width = item.obj.outerWidth() + 2; //padding 查看的时候发现差2
                this.totalWidth += item.width;
                item.obj.hide();
            }
            p.append(this.createPageDown());
            $(pd.lastChild).hide();
            this.curpage = 0;
            this.selectedIndex = -1;
            this.resize(true);
        },
        showCurPage: function () {
            if (this.curpage >= this.pages.length)
                return;
            var page = this.pages[this.curpage];
            for (var i = 0; i < this.items.length; i++) {
                if (((i >= page.start) && (i < page.start + page.size)) && (!this.items[i].isHide))
                    this.items[i].obj.show();
                else
                    this.items[i].obj.hide();
            }
            this.enablePageUp(this.curpage > 0);
            this.enablePageDown(this.curpage < this.pages.length - 1);
        },
        setSelectTab: function (idx, changePage, clickEvent) {
            this.clickTabIndex(idx, clickEvent);
        },
        clickTabIndex: function (idx, stopEvent) {
            if (this.selectedIndex == idx) return;
            if (this.selectedIndex >= 0) {
                var prevObj = this.items[this.selectedIndex].obj[0];
                if (!beforeclickfunc(prevObj.innerText, prevObj.getAttribute("customvalue")))
                    return;
                for (var i = 0; i < this.items.length; i++)
                    this.items[i].obj.attr("class", this.getClass(false));
            }
            if (idx >= this.items.length || idx < 0) return;
            this.items[idx].obj.attr("class", this.getClass(true));
            this.selectedIndex = idx;
            if (!stopEvent) {
                var thisObj = this.items[idx].obj[0];
                //eval("(function(text,value){ " + clickfunc + "})('" + thisObj.innerText + "','" + thisObj.getAttribute("customvalue") + "'); "); //Modify by Gud 20120420,thisObj.value不好使
                clickfunc(thisObj.innerText, thisObj.getAttribute("customvalue"));
            }
        },
        nTabs: function (thisObj, idx, stopEvent) {
            //不用idx，重新找，防止有删除的
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].obj[0] == thisObj) {
                    this.clickTabIndex(i, stopEvent);
                    return;
                }
            }
        },
        addTab: function (item) {
            var prev = null;
            if (this.items.length > 0)
                prev = this.items[this.items.length - 1];
            //先把前边的都藏起来，不然宽度算不准
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].obj.hide();
            }
            this.items.push(item);
            var p = this.getJqPanel();
            var pd = p[0];
            p.append(this.getSingleLi(this.items.length, item, this.getClass(false)));
            item.obj = $(pd.lastChild);
            item.width = item.obj.outerWidth(); //padding
            this.totalWidth += item.width;
            item.obj.hide();
            if (null != prev)
                prev.obj.after(item.obj);
            this.resize(true);
        },
        doDelete: function (idx) {
            return false;
        },
        delTab: function (idx) {
            if (!this.doDelete(idx)) return;
            var item = this.items[idx];
            this.totalWidth -= item.width;
            item.obj.hide();
            item.obj.attr("class", ""); //防止根据class取到
            this.items.splice(idx, 1);
            if (this.selectedIndex == idx)
                this.selectedIndex = -1;
            else if (this.selectedIndex > idx)
                this.selectedIndex--;
            this.resize(true);
        },
        SetHide: function (v, hide) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].value == v) {
                    this.SetItemHide(i, hide);
                    return;
                }
            }
        },
        SetItemHide: function (idx, hide) {
            hide = (hide ? true : false);
            var item = this.items[idx];
            item.isHide = (item.isHide ? true : false);
            if (item.isHide != hide) {
                if (hide)
                    this.totalWidth -= item.width;
                else
                    this.totalWidth += item.width;
            }
            item.isHide = hide;
            if (hide && (this.selectedIndex == idx))
                this.selectedIndex--;
            this.resize(true);
        },
        SetItemText: function (idx, text) {
            var item = this.items[idx];
            item.text = text;
            item.title = text;
            item.obj.attr("title", text);
            item.obj.html(text);
        },
        SetTab: function (v) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].value == v) {
                    this.setSelectTab(i, false);
                    return;
                }
            }
        },
        GetTab: function () {
            var modelObj = $("#dvTab" + id + " ." + this.getCoreClass(true));
            if (modelObj.length > 0) {
                return modelObj[0];
            }
            else {
                return $("#dvTab" + id + " ." + this.getCoreClass(false))[0];
            }
        },
        Select: function (idx) {
            this.curpage = this.getPageIdx(idx);
            this.showCurPage();
            this.setSelectTab(idx, true);
            return false;
        },
        GetAllTab: function () {
            var tabs = [];
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                var tab = { "index": i, "value": item.value, "text": item.text };
                tabs.push(tab);
            }
            return tabs;
        },
        resize: function (force) {
            var dvTab = this.getJqPanel()[0].parentNode;
            var dvTabFull = dvTab.parentNode;
            var dvContainer = dvTabFull.parentNode;
            var w = $(dvContainer).width(); //再减去其他子窗口的大小
            for (var i = 0; i < dvContainer.children.length; i++) {
                var child = dvContainer.children[i];
                if (child == dvTabFull)
                    continue;
                w -= $(child).outerWidth();
            }
            if (!force) {
                if (w == dvContainer.old_width)
                    return;
            }
            dvContainer.old_width = w;
            //dvTabFull.style.width = w;
            //dvTab.style.width = w;
            this.getJqPanel().width(w);
            this.redrawResetSize(w);
        },
        selectedIndex: -1,
        items: [],
        totalWidth: 0,
        pages: [],
        redrawResetSize: function (w) {
            if (this.selectedIndex >= this.items.length)
                this.selectedIndex = -1;
            this.resetPages(w - this.widthOfOther); //重新分页,留个20的宽度空间
            //得到选中条目所在的页数
            if (this.pages.length == 1) {//无需分页
                this.curpage = 0;
                this.showPageArrow(false);
                this.showCurPage();
            } else {
                this.curpage = this.getPageIdx(this.selectedIndex);
                this.showPageArrow(true);
                this.showCurPage();
            }
        },
        resetPages: function (w) {
            if (w >= this.totalWidth) { //足够放下，不用分页
                this.pages = [{ start: 0, size: this.items.length}];
                return;
            }
            //必须分页，所以要有两边的箭头
            w = w -= 50;
            var ww = 0;
            var idx = 0;
            this.pages = [];
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.isHide) //隐藏
                    continue;
                if (item.width > w) {
                    if (i == idx) {
                        this.pages.push({ start: idx, size: 1 });
                    } else {
                        this.pages.push({ start: idx, size: i - idx });
                        this.pages.push({ start: i, size: 1 });
                        w = 0;
                    }
                    idx = i + 1;
                    continue;
                }
                if (ww + item.width > w) {
                    this.pages.push({ start: idx, size: i - idx });
                    ww = item.width;
                    idx = i;
                    continue;
                }
                ww += item.width;
            }
            var lastPage = this.pages[this.pages.length - 1];
            if (lastPage.start + lastPage.size != this.items.length) {
                this.pages.push({ start: lastPage.start + lastPage.size, size: this.items.length - lastPage.start - lastPage.size });
            }
        },
        getPageIdx: function (tabIndex) {
            for (var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                if (page.start + page.size > tabIndex)
                    return i;
            }
            return 0;
        }
    };
}