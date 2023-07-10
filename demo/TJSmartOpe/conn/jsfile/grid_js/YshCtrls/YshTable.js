var YshTable = {
    Create: function (attrs) {
        var o = YshObject.Create();
        o.tag = "table";
        o.descr = "表格";
        var rows, cols, rowHeight, colWidth;
        if (attrs != null) {
            rows = attrs.rows;
            cols = attrs.cols;
            rowHeight = attrs.rowHeight;
            colWidth = attrs.colWidth;
        } else {
            rows = 3;
            cols = 3;
            rowHeight = 50;
            colWidth = 250;
        }
        for (var r = 0; r < rows; r++) {
            var tr = g_yshFactory.CreateObject("tr", o);
            for (var c = 0; c < cols; c++) {
                var td = g_yshFactory.CreateObject("td", tr);
                td.selfattr["col"] = c;
                td.selfattr["row"] = r;
            }
        }
        if (attrs != null) {
            o.styles["height"] = rows * rowHeight + "px";
            o.styles["width"] = cols * colWidth + "px";
        } else {
            o.styles["height"] = "100%";
            o.styles["width"] = "100%";
        }
        o.attrs["border"] = "1";
        o.attrs["cellpadding"] = "0";
        o.attrs["cellspacing"] = "0";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<table" + this.GetAttributesHtml() + ">" + this.GetChildrenHtml() + "</table>";
        }
        YshObject.AttachContainer(o, function (dom, i) { return dom.rows[i]; });
        o.AddContentMenus = function (menulist) {
        }
        o.GetRows = function () { //最后一行的某个格子
            var trLast = this.children[this.children.length - 1];
            var tdLast = trLast.children[0];
            return tdLast.GetCellRange().r1 + 1;
        }
        o.GetCols = function () {
            var trFirst = this.children[0];
            var tdLast = trFirst.children[trFirst.children.length - 1];
            return tdLast.GetCellRange().c1 + 1;
        }
        o.DeleteRow = function (r) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var tr = this.children[i];
                tr.DeleteRow(r);
                if (tr.children.length == 0) //整行全删了
                    this.children.erase(tr);
            }
        }
        o.DeleteCol = function (c) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var tr = this.children[i];
                tr.DeleteCol(c);
                if (tr.children.length == 0) //整行全删了
                    this.children.erase(tr);
            }
        }
        o.DeleteRows = function (r, count) {
            for (var rr = 0; rr < count; rr++) {
                this.DeleteRow(r);
            }
            if (this.children.length == 0)
                this.parent.children.erase(this);
        }
        o.DeleteCols = function (c, count) {
            for (var cc = 0; cc < count; cc++) {
                this.DeleteCol(c);
            }
            if (this.children.length == 0)
                this.parent.children.erase(this);
        }
        o.ReArrange = function () {
            function getInRowSpans(tbl, r, rIn) {
                var spans = 0;
                for (var i = 0; i < tbl.children[r].length; i++) {
                    var cell = tbl.children[r].children[i];
                    if (cell.selfattr["row"] + cell.GetRowSpan() > rIn)
                        spans += cell.GetColSpan();
                }
                return spans;
            }
            for (var i = 0; i < this.children.length; i++) {
                var row = this.children[i];
                for (var j = 0; j < row.children.length; j++) {
                    var cell = row.children[j];
                    cell.selfattr["row"] = i;
                    var spans = 0;
                    for (var k = 0; k < i; k++) {
                        spans += getInRowSpans(this, k, i);
                    }
                    cell.selfattr["col"] = j + spans;
                }
            }
        }
    }
}