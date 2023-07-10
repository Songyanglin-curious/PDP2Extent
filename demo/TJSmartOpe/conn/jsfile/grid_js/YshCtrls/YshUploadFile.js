var YshUploadFile = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "uploadfile";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<input type='file' " + this.GetAttributesHtml() + " />";
        }
        o.GetValue = function () {
            if (!this.ctrl) return null;
            if (this.IsEditable) {
                if (this.ctrl.value != "")
                    return this.ctrl.value;
                var c = this.ctrl.nextSibling;
                if (c)
                    c = c.nextSibling;
                if (c)
                    c = c.children[0];
                return c ? c.value : null;
            } else {
                return this.ctrl.innerText;
            }
        };
        o.SetValue = function (v) {
            if ((!this.ctrl) || (!this.IsEditable)) return;
            var c = this.ctrl.nextSibling;
            if (c)
                c = c.nextSibling;
            if (c)
                c = c.children[0];
            if (c)
                c.value = v;
        }
    }
}