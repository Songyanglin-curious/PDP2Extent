var YshSearch = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "search";
        o.selfattr["TableID"] = o.id;
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "YshSearch";
            var ascxname = "搜索控件";
            return GetSpan(tagname, ascxname);
        }
        o.Edit = function () {
            var dialoagURL = "ConfigSearch.aspx";
            if (o.selfattr["TableID"] == undefined || o.selfattr["TableID"] == "") {
                o.selfattr["TableID"] = o.id;
            }
            var dialog = window.showModalDialog(dialoagURL, this, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
            if (typeof dialog != "undefined") {
                this.doc.Redraw();
            }
        }
    }
}