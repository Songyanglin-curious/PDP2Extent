var YshSpan = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "span";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<span " + this.GetAttributesHtml() + " >" + this.GetChildrenHtml() + "</span>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");"));
            if (g_yshFactory.clipboard.length > 0)
                menulist.push(YSH_CreateContextMenu("paste", "粘贴", "", "g_yshFactory.Paste(\"" + this.id + "\");"));
        }
    }
}