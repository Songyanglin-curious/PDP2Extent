var YshGantteGraphAscx = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "gantte";
        o.selfattr["GantteID"] = o.id;
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return GetSpan("YshGantteGraph", "甘特图");
        }
        o.Edit = function () {
            var dialoagURL = "ConfigGantte.aspx";
            if (o.selfattr["GantteID"] == undefined || o.selfattr["GantteID"] == "") {
                o.selfattr["GantteID"] = o.id;
            }
            var dialog = window.showModalDialog(dialoagURL, this, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
            if (typeof dialog != "undefined") {
                this.doc.Redraw();
            }
        }
        o.GetValue = function () {
            var g = eval("GantteTempData_" + o.id);
            if (g != undefined)
                return g;
            else
                return -1;
        }
    }
}