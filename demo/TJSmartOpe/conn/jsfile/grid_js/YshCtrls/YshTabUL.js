var YshTabUL = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab-ul";
        o.attrs["class"] = "tab-top";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
        o.GetHtml = function () {
            return "<div ref='ysh-tab'>" + this.GetChildrenHtml() + "</div>";
        }
        o.AddTab = function () { this.doc.CreateObject("tab-li", this); }
        o.RemoveTab = function (i) { var l = this.children[i]; g_yshFactory.Delete(l.id); }
    }
}