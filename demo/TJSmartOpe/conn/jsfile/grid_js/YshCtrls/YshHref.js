var YshHref = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "href";
        o.descr = "超链接";
        o.selfattr["text"] = "新链接"
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<a " + this.GetAttributesHtml() + ">" + this.selfattr["text"] + "</a>";
        }
    }
}