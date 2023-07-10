var YshDynaTreeAscx = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "dtree";
        var t = new TreeFunc();
        SetAttr(t, o);
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<span>[Tree.ascx]</span>";
        }
        o.Edit = function () {
            var dialogURL = "ConfigTree.aspx";
            if (o.selfattr["id"] == "") {
                o.selfattr["id"] = o.id;
            }
            var dialog = window.showModalDialog(dialogURL, this, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
            if (typeof dialog != "undefined") {
                this.doc.Redraw();
            }
        }
        o.SetValue = function (v) {
            var ttt = eval(o.id);
            if (ttt != undefined && ttt != null) {
                ttt.selectbyvalue(v);
            }
        }
        o.GetValue = function () {
            var v = GetTreeValue(o.id);
            if (v != undefined && v != null) {
                return v;
            }
            else
                return "";
        }
    }
}