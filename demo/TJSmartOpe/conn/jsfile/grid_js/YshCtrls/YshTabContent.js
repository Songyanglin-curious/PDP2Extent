var YshTabContent = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab-content";
        o.attrs["class"] = "content";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
        o.GetHtml = function () {
            return "<div ref='ysh-tab' " + this.GetAttributesHtml() + ">" + this.GetChildrenHtml() + "</div>";
        }
        o.AddContent = function (show) {
            var d = this.doc.CreateObject("tab-content-div", this);
            if (show)
                d.attrs["class"] = "show";
        }
        o.RemoveContent = function (i) { var c = this.children[i]; g_yshFactory.Delete(c.id); }
    }
}