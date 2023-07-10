var YshMasterPageItem = {
    Create: function () {
        var o = YshObject.Create();
        o.isCopyDeny = true;
        o.isDelDeny = true;
        o.IsEditable = true;
        o.tag = "yshmasterpageitem";
        return o;
    },
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "YshMasterPageItem";
            var ascxname = "母版页子控件";
            return StringPP.format("<span id='{0}' name='{1}'><span>[{2}]</span>{3}</span>", o.id, o.tag, ascxname, this.GetChildrenHtml());
        },
        YshObject.AttachContainer(o, function (dom, i) {
            if (dom.children[0].innerHTML == "[母版页子控件]")
                return dom.children[i + 1];
            else
                return dom.children[i];
        });
    }
}