var YshListEditAscx = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "listedit";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "ListEdit";
            var ascxname = "列表编辑";
            return GetSpan(tagname, ascxname);
        }
    }
}