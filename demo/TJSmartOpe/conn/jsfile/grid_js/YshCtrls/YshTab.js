var YshTab = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab";
        o.attrs["class"] = "tab";
        //初始化TAB内容
        var tabUl = g_yshFactory.CreateObject("tab-ul", o);
        var tabContent = g_yshFactory.CreateObject("tab-content", o);
        var fisrtLi = g_yshFactory.CreateObject("tab-li", tabUl);
        g_yshFactory.CreateObject("tab-content-div", tabContent).attrs["class"] = "show";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<div id='" + this.id + "' " + this.GetAttributesHtml() + " >" + this.GetChildrenHtml() + "</div>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加新页卡", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.CreateNewTab();docDesign.Redraw();"));
        }
        o.CreateNewTab = function () {
            o.children[0].AddTab();
            o.children[1].AddContent(false);
            this.doc.Redraw();
            TabEvent.change(this.id);
        }
        o.RemoveTab = function (id) {
            var ul = o.children[0];
            var cd = o.children[1];
            var index = -9;
            for (var i = 0; i < ul.children.length; i++) { if (id === ul.children[i].id) { index = i; } }
            if (index < 0) { alert('没有找到要删除的页签！'); return false; }
            ul.RemoveTab(index);
            cd.RemoveContent(index);
            this.doc.Redraw();
        }
    }
}