var YshUIWebGrid = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "uiwebgrid";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "uiwebgrid";
            var ascxname = "uiwebgrid";
            return GetSpan(tagname, ascxname);
        }
    }
}