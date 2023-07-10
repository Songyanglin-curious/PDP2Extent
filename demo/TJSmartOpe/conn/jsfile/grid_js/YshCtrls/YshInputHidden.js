var YshInputHidden = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "inputhidden";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            //return "<input type='hidden' " + this.GetAttributesHtml() + " />";
            return "<span>[隐藏" + this.desc + "]</span>"
        }
        o.SetValue = function (v) { if (this.ctrl) { this.ctrl.value = v; } }
        o.GetValue = function () { if (this.ctrl) return this.ctrl.value; };
    }
}