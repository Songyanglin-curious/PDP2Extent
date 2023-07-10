var YshTextBox = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "text";
        o.descr = "文本框";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<input type='text' readonly " + this.GetAttributesHtml() + " />";
        }
        o.SetValue = function (v) { this.value = v; if (this.ctrl) if (this.IsEditable) { this.ctrl.value = v; } else { this.ctrl.innerText = v; } }
        o.SetReadOnly = function (b) {
            var obj = $(this.ctrl);
            if (b && this.GetEditable()) {
                var span = StringPP.format("<span>{0}</span>", this.GetValue());
                this.ctrlback = this.ctrl;
                obj.after(span);
                this.ctrl = obj.next()[0];
                obj.remove();
            }
            else if (!b && !this.GetEditable()) {
                obj.after(this.ctrlback.outerHTML);
                this.ctrl = obj.next()[0];
                obj.remove();
            }
        }
        //o.GetText = function () { if (typeof this.value == "undefined") return this.GetValue(); return this.value; }
    }
}