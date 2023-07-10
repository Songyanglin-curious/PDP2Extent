var YshHiddenFile = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "hiddenfile";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<span>[隐藏文件" + this.desc + "]</span>"
        }
        o.SetValue = function (v) {
            if ((!this.ctrl) || (!this.IsEditable)) return;
            this.ctrl.children[0].value = "1";
            this.ctrl.children[2].value = v;
        }
    }
}