var YshRow = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tr";
        o.descr = "行";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.isDelDeny = true;
        o.isCopyDeny = true;
        o.GetHtml = function () {
            return "<tr" + this.GetAttributesHtml() + ">" + this.GetChildrenHtml() + "</tr>";
        }
        YshObject.AttachContainer(o, function (dom, i) { return dom.cells[i]; });
        o.DeleteRow = function (r) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var td = this.children[i];
                if (td.DeleteRow(r)) //列删了
                    this.children.erase(td);
            }
        }
        o.DeleteCol = function (c) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var td = this.children[i];
                if (td.DeleteCol(c)) //列删了
                    this.children.erase(td);
            }
        }
    }
}