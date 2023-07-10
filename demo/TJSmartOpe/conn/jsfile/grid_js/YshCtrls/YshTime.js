var YshTime = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "time";
        o.datasource = { db: "", src: "", col: "" };
        o.selfattr["dtstyle"] = "1";
        o.selfattr["disstyle"] = "111000";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            var dtstyle = this.selfattr["dtstyle"];
            var disstyle = this.selfattr["disstyle"];
            var v = (typeof this.value == "undefined") ? new DateEx("").getDateTime() : this.value;
            return show_demo_datetime(this.id, v, dtstyle, disstyle);
        }
        o.SetValue = function (v) { this.value = v; if (this.ctrl) if (this.IsEditable) { SetCtrlDateTime(this.ctrl.form, this.ctrl.id, v); } else { this.ctrl.innerHtml = v + "<input type='hidden' id='" + this.id + "' name='" + this.id + "' value='" + v + "'>"; } }
        o.GetValue = function () { return this.IsEditable ? this.ctrl.value : ((typeof this.value == "undefined") ? "" : this.value); }
        o.GetText = function () {
            if ((this.value == "") || (typeof this.value == "undefined"))
                return "";
            var dtstyle = this.selfattr["dtstyle"];
            var disstyle = this.selfattr["disstyle"];
            return F_ParseTime(new DateEx(this.value).getDateTime(), (dtstyle == 2) ? disstyle : "1" + disstyle);
        }
        o.GetTextForce = function () {
            var text = o.GetText();
            if (text == "") {
                var dtstyle = this.selfattr["dtstyle"];
                var disstyle = this.selfattr["disstyle"];
                text = F_ParseTime(new DateEx(this.GetValue()).getDateTime(), (dtstyle == 2) ? disstyle : "1" + disstyle);
            }
            return text;
        }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                var span = StringPP.format("<span>{0}</span>", o.GetTextForce());
                o.ctrlback = o.ctrl;
                o.ctrlback2 = obj.next()[0];
                obj.next().remove();
                obj.after(span);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
            else if (!b && !o.GetEditable()) {
                obj.after(o.ctrlback2.outerHTML);
                obj.after(o.ctrlback.outerHTML);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
        }
    }
}