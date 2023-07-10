var YshHtmlRadio = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "radio";
        o.descr = "单选框";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<input type='radio' " + this.GetAttributesHtml() + " />";
        }
        o.SetValue = function (v) { if (this.ctrl) { this.ctrl.checked = v; } }
    }
}