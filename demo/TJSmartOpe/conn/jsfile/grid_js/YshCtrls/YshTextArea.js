var YshTextArea = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "textarea";
        o.descr = "多行文本框";
        o.attrs["value"] = "测试文本";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<textarea " + this.GetAttributesHtml() + ">" + this.attrs["value"] + "</textarea>";
        }
        o.SetValue = function (v) { if (this.ctrl) if (this.IsEditable) { this.ctrl.value = v; } else { this.ctrl.innerHTML = v.replace(/\r\n/g, "<BR>"); } }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                var span = StringPP.format("<span>{0}</span>", o.GetValue());
                o.ctrlback = o.ctrl;
                obj.after(span);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
            else if (!b && !o.GetEditable()) {
                obj.after(o.ctrlback.outerHTML);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
        }
        //o.GetText = function () { if (typeof this.value == "undefined") return this.GetValue(); return this.value; }
    }
}