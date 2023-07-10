var YshTabContentDiv = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab-content-div";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<div " + this.GetAttributesHtml() + ">" + this.GetChildrenHtml() + "</div>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加子控件", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");docDesign.Redraw();"));
        }
    }
}