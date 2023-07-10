var YshListCtrl = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "listctrl";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "ListCtrl";
            var ascxname = "列表控件";
            return GetSpan(tagname, ascxname);
        }
    }
}