var YshDiv = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "div";
        o.descr = "容器";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<div " + this.GetAttributesHtml() + " >" + this.GetChildrenHtml() + "</div>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");docDesign.Redraw();"));
            if (g_yshFactory.clipboard.length > 0)
                menulist.push(YSH_CreateContextMenu("paste", "粘贴", "", "g_yshFactory.Paste(\"" + this.id + "\");docDesign.Redraw();"));
        }
    }
}