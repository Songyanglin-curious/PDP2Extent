var YshLabel = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "label";
        o.descr = "文本";
        o.selfattr["text"] = "文本";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<span " + this.GetAttributesHtml() + ">" + this.selfattr["text"] + "</span>";
        }
        o.SetValue = function (v) { this.value = v; if (this.ctrl) { this.ctrl.innerText = v; } }
        o.GetText = function () { if (typeof this.value == "undefined") return this.GetValue(); return this.value; }
        o.GetValue = function () { if (typeof this.value != "undefined") return this.value; if (this.ctrl) return (this.IsEditable && (typeof this.ctrl.value != "undefined")) ? this.ctrl.value : this.ctrl.innerText; return null; }
    }
}