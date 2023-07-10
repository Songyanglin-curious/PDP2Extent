var YshButton = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "button";
        o.descr = "按钮";
        o.attrs["value"] = "按钮";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.AddContentMenus = function (menulist) {
        }
        o.GetHtml = function () {
            return "<input type='button' " + this.GetAttributesHtml() + " />";
        }
    }
}