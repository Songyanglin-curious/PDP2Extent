var YshDragTreeAscx = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "dragtree";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "dragtree";
            var ascxname = "WebUI树";
            return GetSpan(tagname, ascxname);
        }
    }
}