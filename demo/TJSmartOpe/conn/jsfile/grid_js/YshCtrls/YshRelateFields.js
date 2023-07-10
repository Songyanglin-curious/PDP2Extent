var YshRelateFields = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "relatefields";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            var tagname = "YshRelateFields";
            var ascxname = "关联数据" + this.desc;
            return GetSpan(tagname, ascxname);
        }
        o.SetValue = function (v) { if (this.ctrl) { this.ctrl.value = v; } }
        o.GetValue = function () {
            if (this.ctrl) return this.ctrl.value;
        };
    }
}