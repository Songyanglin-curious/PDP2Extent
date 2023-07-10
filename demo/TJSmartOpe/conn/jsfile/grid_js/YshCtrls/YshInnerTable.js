var YshInnerTable = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "innertable";
        o.selfattr["TableID"] = o.id;
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "YshInnerTable";
            var ascxname = "YshInnerTable";
            return GetSpan(tagname, ascxname);
        }
        o.Edit = function () {
            var dialoagURL = "ConfigInnerTable.aspx";
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