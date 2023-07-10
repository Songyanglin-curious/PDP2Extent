var YshCheckBox = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "checkbox";
        o.descr = "复选框";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetValue = function () { if (this.ctrl) return this.ctrl.checked; return null; };
        o.GetHtml = function () {
            return "<input type='checkbox' " + this.GetAttributesHtml() + " />";
        }
        o.SetValue = function (v) { this.value = v; if (this.ctrl) { this.ctrl.checked = v; } }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                if (o.attrs["class"] == "styled")
                    obj.prev().addClass("disabled");
                obj.attr("disabled", "disabled");
            }
            else if (!b && !o.GetEditable()) {
                if (o.attrs["class"] == "styled")
                    obj.prev().removeClass("disabled");
                obj.removeAttr("disabled");
            }
        }
    }
}