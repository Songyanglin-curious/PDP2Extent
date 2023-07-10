var YshInputPwd = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "inputpwd";
        o.descr = "密码框";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<input type='password' " + this.GetAttributesHtml() + " />";
        }
        o.SetValue = function (v) { if (o.GetEditable) o.ctrl.value = v; }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                var span = StringPP.format("<span>{0}</span>", "●●●●●●●●");
                o.valueback = o.GetValue();
                o.ctrlback = o.ctrl;
                obj.after(span);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
            else if (!b && !o.GetEditable()) {
                obj.after(o.ctrlback.outerHTML);
                o.ctrl = obj.next()[0];
                o.SetValue(o.valueback);
                obj.remove();
            }
        }
    }
}