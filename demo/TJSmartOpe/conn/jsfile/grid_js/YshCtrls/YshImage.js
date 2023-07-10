var YshImage = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "image";
        o.descr = "图片";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<img " + this.GetAttributesHtml() + " />";
        }
    }
}