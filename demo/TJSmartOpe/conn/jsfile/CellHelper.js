// JScript File -- Edit by Gud 20120517
function createBkCell(id) {
	var obj = document.createElement("object");
	obj.setAttribute("id",id);
	obj.setAttribute("classid","clsid:3f166327-8030-4881-8bd2-ea25350e574a");
	return obj;
}

function initCell(cell) {
    if (!cell)
        return;
    with (cell) {
        login("用尚科技", "", "13100104542", "2120-1751-0203-0005");
        WndBkColor = 16777215; //RGB(255,255,255);//底色为白色
        ShowPageBreak(0); //不显示分页符
        AllowDragdrop = 0; //不许拖拽选定框
        AllowExtend = 0; //不允许拖动选定框的右下角
        WorkbookReadonly = 1;
        PrintSetAlign(1, 0);
        NumCellColor = cell.FindColorIndex(0, 1);
        FormulaCellColor = 0; //公式颜色为黑色
        AllowSizeColInGrid = 0;
        AllowSizeRowInGrid = 0;
        SetGridCursor(0, 1);
        Border = 0;
        var nSheet = GetCurSheet();
        ShowSheetLabel(0, nSheet); //不显示页号
        ShowTopLabel(0, nSheet); //不现实第0行
        ShowSideLabel(0, nSheet); //不显示第0列
        SetSelectMode(nSheet, 0); //不能选择
        EnableUndo(0);
        ShowGridLine(0, nSheet); //不显示表格
        ShowHScroll(1, nSheet);
        ShowVScroll(1, nSheet);
    }
}

function InitCell(cell) { initCell(cell); }

function openEditeBackup(cell) {    
    cell.AllowDragdrop = 1;
    cell.AllowExtend = 1;
    cell.WorkbookReadonly = 0;
    cell.AllowSizeColInGrid = 1;
    cell.AllowSizeRowInGrid = 1;
    cell.Border = 1;
    cell.ShowSheetLabel(0, cell.GetCurSheet());
    cell.ShowTopLabel(1, cell.GetCurSheet());
    cell.ShowSideLabel(1, cell.GetCurSheet());
    cell.SetSelectMode(1, cell.GetCurSheet());    
}

function exportBackup(cell) {
    var bk = {
        AllowDragdrop: cell.AllDragdrop
    , AllowExtend: cell.AllowExtend
    , WorkbookReadonly: cell.WorkbookReadonly
    , AllowSizeColInGrid: cell.AllowSizeColInGrid
    , AllowSizeRowInGrid: cell.AllowSizeRowInGrid
    , Border: cell.Border
    , ShowSheetLabel: cell.GetSheetLabelState(cell.GetCurSheet())
    , ShowTopLabel: cell.GetTopLabelState(cell.GetCurSheet())
    , ShowSideLabel: cell.GetSideLabelState(cell.GetCurSheet())
    , SetSelectMode: cell.GetSelectMode(cell.GetCurSheet())
    , ShowGridLine: cell.GetGridLineState(cell.GetCurSheet())
    };
    cell.AllowDragdrop = 1;
    cell.AllowExtend = 1;
    cell.WorkbookReadonly = 0;
    cell.AllowSizeColInGrid = 1;
    cell.AllowSizeRowInGrid = 1;
    cell.Border = 1;
    cell.ShowSheetLabel(1, cell.GetCurSheet());
    cell.ShowTopLabel(1, cell.GetCurSheet());
    cell.ShowSideLabel(1, cell.GetCurSheet());
    cell.SetSelectMode(1, cell.GetCurSheet());
    cell.ShowGridLine(1,cell.GetCurSheet());
    return bk;
}

function exportRestore(cell, bk) {
    cell.AllowDragdrop = bk.AllowDragdrop;
    cell.AllowExtend = bk.AllowExtend;
    cell.WorkbookReadonly = bk.WorkbookReadonly;
    cell.AllowSizeColInGrid = bk.AllowSizeColInGrid;
    cell.AllowSizeRowInGrid = bk.AllowSizeRowInGrid;
    cell.Border = bk.Border;
    cell.ShowSheetLabel(bk.ShowSheetLabel, cell.GetCurSheet());
    cell.ShowTopLabel(bk.ShowTopLabel, cell.GetCurSheet());
    cell.ShowSideLabel(bk.ShowSideLabel, cell.GetCurSheet());
    cell.SetSelectMode(bk.SetSelectMode, cell.GetCurSheet());
    cell.ShowGridLine(bk.ShowGridLine, cell.GetCurSheet());
}

function setCellBestWidth(cell, bscroll) {
    var c = 0, w = 0;
    var s = cell.GetCurSheet();
    for (c = 1; c < cell.GetCols(s); c++) {
        w += cell.GetColWidth(1, c, s);
    }
    cell.width = (bscroll ? (w + 17) : (w + 1)) + "px";
}

function setCellBestHeight(cell, bscroll) {
    var r = 0, h = 0;
    var s = cell.GetCurSheet();
    for (r = 1; r < cell.GetRows(s); r++) {
        h += cell.GetRowHeight(1, r, s);
    }
    cell.height = (bscroll ? (h + 17) : (h + 1)) + "px";
}

function F_GetMergeRangeCol(cellobj, c, r, s, b) {
    var n = cellobj.GetMergeRangeJ(c, r, s, b);
    if (n <= 0)
        return c;
    return n;
}

function F_GetMergeRangeRow(cellobj, c, r, s, b) {
    var n = cellobj.GetMergeRangeJ(c, r, s, b);
    if (n <= 0)
        return r;
    return n;
}

function F_CopyCell(cellobj, s, c1, r1, c2, r2) {
    if ((c1 == c2) && (r1 == r2)) return true;
    var nC0 = F_GetMergeRangeCol(cellobj, c1, r1, s, 0);
    var nR0 = F_GetMergeRangeRow(cellobj, c1, r1, s, 1);
    var nC1 = F_GetMergeRangeCol(cellobj, c1, r1, s, 2);
    var nR1 = F_GetMergeRangeRow(cellobj, c1, r1, s, 3);
    if ((nC0 != c1) || (nR0 != r1)) return false;
    cellobj.SetCellAlign(c2, r2, s, cellobj.GetCellAlign(c1, r1, s));
    cellobj.SetCellBackColor(c2, r2, s, cellobj.GetCellBackColor(c1, r1, s));
    cellobj.SetCellTextStyle(c2, r2, s, cellobj.GetCellTextStyle(c1, r1, s));
    cellobj.SetCellTextColor(c2, r2, s, cellobj.GetCellTextColor(c1, r1, s));
    cellobj.SetCellTextOrientation(c2, r2, s, cellobj.GetCellTextOrientation(c1, r1, s));
    cellobj.SetCellFont(c2, r2, s, cellobj.GetCellFont(c1, r1, s));
    cellobj.SetCellFontStyle(c2, r2, s, cellobj.GetCellFontStyle(c1, r1, s));
    cellobj.SetCellFontSize(c2, r2, s, cellobj.GetCellFontSize(c1, r1, s));
    cellobj.SetCellInput(c2, r2, s, cellobj.GetCellInput(c1, r1, s));
    cellobj.S(c2, r2, s, cellobj.GetCellString(c1, r1, s));
    cellobj.SetCellImage(c2, r2, s, cellobj.GetCellImageIndex(c1, r1, s), 2, 1, 1) /*有问题，后边这些格式没法复制*/
    for (var c = 0; c <= nC1 - nC0; c++) {
        for (var r = 0; r <= nR1 - nR0; r++) {
            for (var i = 0; i <= 3; i++) {
                cellobj.SetCellBorder(c2 + c, r2 + r, s, i, cellobj.GetCellBorder(c1 + c, r1 + r, s, i));
                cellobj.SetCellBorderClr(c2 + c, r2 + r, s, i, cellobj.GetCellBorderClr(c1 + c, r1 + r, s, i));
            }
        }
    }
    if ((nC1 != nC0) || (nR1 != nR0)) {
        cellobj.MergeCells(c2 - c1 + nC0, r2 - r1 + nR0, c2 - c1 + nC1, r2 - r1 + nR1);
    }
    return true;
}

function F_Copy(cellobj, s, c1, r1, c2, r2, c0, r0) {
    if ((c1 == c0) && (r1 == r0)) return;
    for (var r = 0; r <= r2 - r1; r++) {
        cellobj.SetRowHeight(1, cellobj.GetRowHeight(1, r1 + r, s), r0 + r, s);
        for (var c = 0; c <= c2 - c1; c++)
            F_CopyCell(cellobj, s, c1 + c, r1 + r, c0 + c, r0 + r);
    }
}

/*
    整页拷贝功能
    wanglei 2011-12-15 add
    cellobj:   cll对象
    cIndex:    拷贝到何处 sheet索引
    gIndex：   从哪里拷贝 sheet索引
    c0:        当前标签所在列位置
    r0:        当前标签所在行位置
*/
function F_CopyOtherSheet(cellobj, cIndex, gIndex, c0, r0, startC, endC, startR, endR) {
    for (var r = 0; r < endR; r++) {
        for (var c = 0; c < endC; c++) {
            F_CopyCell(cellobj, cIndex, startC + c, startR + r, c0 + c, r0 + r, gIndex);
        }
    }
}

function F_CopyCell(cellobj, s, c1, r1, c2, r2 , g) {
    if (typeof g == "undefined")
        g = s;
    if ((c1 == c2) && (r1 == r2) && (g == s)) return true;
    var nC0 = F_GetMergeRangeCol(cellobj, c1, r1, g, 0);
    var nR0 = F_GetMergeRangeRow(cellobj, c1, r1, g, 1);
    var nC1 = F_GetMergeRangeCol(cellobj, c1, r1, g, 2);
    var nR1 = F_GetMergeRangeRow(cellobj, c1, r1, g, 3);
    if ((nC0 != c1) || (nR0 != r1)) return false;
    cellobj.SetCellAlign(c2, r2, s, cellobj.GetCellAlign(c1, r1, g));
    cellobj.SetCellBackColor(c2, r2, s, cellobj.GetCellBackColor(c1, r1, g));
    cellobj.SetCellTextStyle(c2, r2, s, cellobj.GetCellTextStyle(c1, r1, g));
    cellobj.SetCellTextColor(c2, r2, s, cellobj.GetCellTextColor(c1, r1, g));
    cellobj.SetCellTextOrientation(c2, r2, s, cellobj.GetCellTextOrientation(c1, r1, g));
    cellobj.SetCellFont(c2, r2, s, cellobj.GetCellFont(c1, r1, g));
    cellobj.SetCellFontStyle(c2, r2, s, cellobj.GetCellFontStyle(c1, r1, g));
    cellobj.SetCellFontSize(c2, r2, s, cellobj.GetCellFontSize(c1, r1, g));
    cellobj.SetCellInput(c2, r2, s, cellobj.GetCellInput(c1, r1, g));
    cellobj.S(c2, r2, s, cellobj.GetCellString(c1, r1, g));
    cellobj.SetCellImage(c2, r2, s, cellobj.GetCellImageIndex(c1, r1, g), 2, 1, 1) /*有问题，后边这些格式没法复制*/
    for (var c = 0; c <= nC1 - nC0; c++) {
        for (var r = 0; r <= nR1 - nR0; r++) {
            for (var i = 0; i <= 3; i++) {
                cellobj.SetCellBorder(c2 + c, r2 + r, s, i, cellobj.GetCellBorder(c1 + c, r1 + r, g, i));
                cellobj.SetCellBorderClr(c2 + c, r2 + r, s, i, cellobj.GetCellBorderClr(c1 + c, r1 + r, g, i));
            }
        }
    }
    if ((nC1 != nC0) || (nR1 != nR0)) {
        cellobj.MergeCells(c2 - c1 + nC0, r2 - r1 + nR0, c2 - c1 + nC1, r2 - r1 + nR1);
    }
    return true;
}