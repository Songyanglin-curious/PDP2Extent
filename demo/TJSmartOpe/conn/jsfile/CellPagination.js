// JScript File -- Edit by Gud
function C_RowMerge() {
    var _mergecols;
    this.GetMerge = function (cellobj, s, r) {
        var c0, c1;
        this._mergecols = new Array;
        for (var c = 1; c < cellobj.GetCols(cellobj.GetCurSheet()); ) {
            c0 = F_GetMergeRangeCol(cellobj, c, r, s, 0);
            c1 = F_GetMergeRangeCol(cellobj, c, r, s, 2);
            c = c1 + 1;
            this._mergecols.push(c0);
            this._mergecols.push(c1);
        }
    }
    this.SetMerge = function (cellobj, s, r) {
        for (var i = 0; i < this._mergecols.length; i += 2) {
            var c0 = this._mergecols[i];
            var c1 = this._mergecols[i + 1];
            if (c1 != c0) {
                cellobj.MergeCells(c0, r, c1, r);
            }
        }
    }
}

function C_CellPagination(cellobj) {
    this._cell = cellobj;
    this._tops = 0;
    this._bottoms = 0;
    this._s = cellobj.GetCurSheet();
    this._cols = cellobj.GetCols(this._s);
    this._hOfIns = 0;
    this._pagerows = [];
    this._tails = 0;
    this._invalidrows = 0;

    this.setFixRows = function (tops, bottoms) { this._tops = tops; this._bottoms = bottoms; }
    this.setInsertRowHeight = function (h) { this._hOfIns = h; }
    this.setInvalidRows = function (invalids) { this._invalidrows = invalids; }
    this.setTailRows = function (tails) { this._tails = tails; }

    this.getValidRows = function () { return this._cell.GetRows(this._s) - this._invalidrows; }
    this.getRowHeight = function (r) { return this._cell.GetRowHeight(0, r, this._s); }
    this.setRowHeight = function (r, h) { this._cell.SetRowHeight(0, h - 10, r, this._s); }
    this.getRowHeightEx = function (r1, r2) { var h = 0; for (var r = r1; r <= r2; r++) { h += this.getRowHeight(r); }; return h; }
    this.insertRows = function (startrow, count) { if (count > 0) { this._cell.InsertRow(startrow, count, this._s); } }
    this.setDummyRow = function (r) {
        var borders = [], clrs = [];
        for (var c = 1; c < this._cols; c++) {
            borders.push(this._cell.GetCellBorder(c, r, this._s, 1));
            clrs.push(this._cell.GetCellBorderClr(c, r, this._s, 1));
        }
        this.insertRows(r, 1);
        for (c = 1; c < this._cols; c++) {
            this._cell.SetCellBorder(c, r, this._s, 1, borders[c - 1]);
            this._cell.SetCellBorderClr(c, r, this._s, 1, clrs[c - 1]);
        }
        //this._cell.S(1,r,this._s,"dummy row");
        this._cell.SetRowHidden(r, r);
    }
    this.copyTopPart = function (r) {
        if (this._tops == 0) return 0;
        this.setDummyRow(r);
        this.insertRows(r, this._tops);
        F_Copy(this._cell, this._s, 1, 1, this._cols - 1, this._tops, 1, r);
        return this._tops + 1;
    }
    this.copyBottomPart = function (r) {
        if (this._bottoms == 0) return 0;
        this.setDummyRow(r);
        this.insertRows(r, this._bottoms);
        var rows = this.getValidRows();
        F_Copy(this._cell, this._s, 1, rows - this._bottoms, this._cols - 1, rows - 1, 1, r);
        return this._bottoms + 1;
    }
    this.restoreTitle = function () {
        this._cell.PrintSetBottomTitle(0, 0);
        this._cell.PrintSetTopTitle(0, 0);
    }
    this.insertAdjRows = function (r, h) {
        if (h < 10) return 0;
        if ((this._hOfIns == 0) || (h < this._hOfIns)) {
            if (h + 10 < this._hOfIns) return 0;
            var bClear = true;
            if (r != this.getValidRows()) {
                for (var c = 1; c < this._cols; c++) {
                    if (this._cell.GetCellBorder(c, r, this._s, 1) > 1) { bClear = false; break; }
                }
            }
            this.insertRows(r, 1);
            if (true) {//if (bClear) {
                this._cell.ClearGridLine(1, r, this._cols - 1, r, 2);
                this._cell.ClearGridLine(1, r, this._cols - 1, r, 3);
                this._cell.ClearGridLine(1, r, this._cols - 1, r, 5);
            }
            var rm = new C_RowMerge();
            rm.GetMerge(this._cell, this._s, r - 1);
            rm.SetMerge(this._cell, this._s, r);
            delete rm._mergecols;
            delete rm;
            this.setRowHeight(r, h);
            return 1;
        }
        var insertrows = Math.floor(h / this._hOfIns);
        this.insertRows(r, insertrows);
        var rm = new C_RowMerge();
        rm.GetMerge(this._cell, this._s, r - 1);
        for (var rr = 0; rr < insertrows; rr++) {
            this.setRowHeight(rr + r, this._hOfIns + 10);
            rm.SetMerge(this._cell, this._s, rr + r);
        }
        delete rm._mergecols;
        delete rm;
        return insertrows;
    }
    this.insertLastAdjRows = function (r, h, pageheight) {
        if (this._tails == 0)
            return this.insertAdjRows(r, h);
        var endrow = this.getValidRows() - 1 - this._bottoms, tailHeight = 0;
        for (var rr = this.getValidRows() - this._tails; rr <= endrow; rr++)
            tailHeight += this.getRowHeight(rr);
        if (h > tailHeight)
            return this.insertAdjRows(r, h - tailHeight);
        var r0 = this.insertAdjRows(r, h);
        return r0 + this.insertAdjRows(r + r0, pageheight - tailHeight);
    }
    this.insertGnrAdjRows = function (r, h) {
        this.setDummyRow(r);
        return 1 + this.insertAdjRows(r, h);
    }
    this.getValidHeight = function () {
        var h = this._cell.PrintGetPaperHeight(this._s);
        h -= this._cell.PrintGetMargin(1);
        h -= this._cell.PrintGetMargin(3);
        if (this._tops != 0)
            h -= this.getRowHeightEx(1, this._tops);
        if (this._bottoms != 0) {
            var rows = this.getValidRows();
            h -= this.getRowHeightEx(rows - this._bottoms, rows - 1);
        }
        return h;
    }
    this.paginate = function () {
        var bottomstart = this.getValidRows() - ((this._tails == 0) ? this._bottoms : this._tails);
        var pageheight = this.getValidHeight();
        var h = 0;
        for (var r = this._tops + 1; r < bottomstart; ) {
            var rowheight = this.getRowHeight(r);
            if (h + rowheight <= pageheight) {
                h += rowheight;
                r++;
            } else {
                var r0 = r;
                r += this.copyTopPart(r0);
                r += this.copyBottomPart(r0);
                r += this.insertGnrAdjRows(r0, pageheight - h);
                bottomstart += (r - r0);
                h = 0;
                this._pagerows.push(r0 - 1);
            }
        }
        if (h != 0) {
            var insertrows = this.insertLastAdjRows(bottomstart, pageheight - h, pageheight);
            this._pagerows.push(bottomstart + insertrows - 1);
        }
        this.restoreTitle();
    }
    //Add by gud 20130607
    this.byTemplate = function (template) {
        //找TOPROW,BOTTOMROW,CONTENTROW,TAILROW,INVALIDROW 的位置来自动设置，如果都没有就不用分页了
        var idxTopRow = template.getFieldIndex("TOPENDROW");
        var idxBottomRow = template.getFieldIndex("BOTTOMSTARTROW");
        var idxContentRow = template.getFieldIndex("CONTENTROW");
        var idxTailRow = template.getFieldIndex("TAILROW");
        var idxInvalidRow = template.getFieldIndex("INVALIDROW");
        if ((idxTopRow < 0) && (idxBottomRow < 0) && (idxContentRow < 0) && (idxTailRow < 0) && (idxInvalidRow < 0))
            return;
        var toprow = -1;
        var bottomrow = -1;
        if (idxTopRow >= 0)
            toprow = template.field(idxTopRow)._rects[0].r1;
        if (idxBottomRow >= 0)
            bottomrow = this._cell.GetRows(this._s) - template.field(idxBottomRow)._rects[0].r0;
        if ((toprow >= 0) || (bottomrow >= 0))
            this.setFixRows(Math.max(0, toprow), Math.max(0, bottomrow));
        if (idxContentRow >= 0)
            this.setInsertRowHeight(this.getRowHeight(template.field(idxContentRow)._rects[0].r0));
        if (idxTailRow >= 0)
            this.setTailRows(this._cell.GetRows(this._s) - template.field(idxTailRow)._rects[0].r0);
        if (idxInvalidRow >= 0)
            this.setInvalidRows(this._cell.GetRows(this._s) - template.field(idxInvalidRow)._rects[0].r0);
        this.paginate();
    }
}