/*v=1.20.415.1*/
Vue.component("spread", {
    template: "<div></div>",
    props: {
        "json": { type: [String, Array] },
        "type": { type: String, "default": "0" },//0 - 2维数组，1 - itable
        "content": { type: Array, "default": function () { return []; } },
        "fields": { type: Array, "default": function () { return []; } },
        "cols": { type: Array, "default": function () { return []; } },
        "head": {
            type: Function, "default": function (sheet) {
                return 0;  //0行代表不要表头
            }
        }, "finish": {
            type: Function, "default": function (sheet, template) {
            }
        }
    },
    computed: {},
    data: function () {
        return {
            spread: {}
        };
    },
    methods: {
        addCol: function (bind, sheet, r, col, i) {
            if (col.children && col.children.length > 0) {
                for (var c = 0; c < col.children.length; c++) {
                    i = this.addCol(bind, sheet, r, col.children[c], i);
                }
                return i;
            }
            if (col.type == "index") {
                bind.index = [];
                sheet.getCell(r, i).value("<<<index,NUM,INC>>>");
                sheet.getCell(r, i).wordWrap(true);
            } else if (col.key) {
                bind[col.key] = [];
                sheet.getCell(r, i).value("<<<" + col.key + ",STR,INC>>>");
                sheet.getCell(r, i).wordWrap(true);
            }
            return i + 1;
        },
        replaceHtml: function (html) {
            if (!html) return html;
            if (typeof html != "string") return html;
            if (html.length < 4) return html;
            return html.replaceAll("<br />", "\r\n");
        },
        initITable: function (sheet) {
            if (!this.content)
                return {};
            var data = this.content;
            var cols = this.cols;
            //先不支持表头合并
            var bind = {};
            var h = this.head(sheet);
            if (h == 0)
                sheet.setColumnCount(cols.length, GC.Spread.Sheets.SheetArea.viewport);
            var colStart = 0;
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                if (h == 0)
                    sheet.getCell(0, i).value(col.title);
                colStart = this.addCol(bind, sheet, Math.max(h, 1), col, colStart);
            }
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var bHasIndex = false;
                for (var k in row) {
                    if (bind[k])
                        bind[k].push(this.replaceHtml(row[k]));
                    if (k == "index")
                        bHasIndex = true;
                }
                if (!bHasIndex) {
                    if (bind.index)
                        bind.index.push(i + 1);
                }
            }
            return bind;
        },
        initArray2d: function (sheet) {
            sheet.setColumnCount(this.fields.length, GC.Spread.Sheets.SheetArea.viewport);
            var bind = {};
            var data = Ysh.Array.h2v(this.content);
            for (var i = 0; i < this.fields.length; i++) {
                sheet.getCell(0, i).value(this.fields[i]);
                sheet.getCell(1, i).value("<<<C" + i + ",STR,INC>>>");
                sheet.getCell(1, i).wordWrap(true);
                bind["C" + i] = data[this.cols[i]];
            }
            return bind;
        },
        refresh: function () {
            var spread = new GC.Spread.Sheets.Workbook(this.$el, {
                sheetCount: 1
            });
            this.spread = spread;
            if (this.json instanceof String) {
                spread.isPaintSuspended(true);
                spread.fromJSON(JSON.parse(this.json));
                spread.isPaintSuspended(false);
            }

            /*
            spread.options.allowCopyPasteExcelStyle = false;
            spread.options.allowExtendPasteRange = false;
            spread.options.showVerticalScrollbar = false;
            spread.options.showHorizontalScrollbar = false;
            spread.options.tabStripVisible = false;
            spread.options.newTabVisible = false;
            spread.options.tabEditable = false;
            spread.options.tabNavigationVisible = false;
            spread.options.allowUserDragDrop = false;
            spread.options.allowUserDragFill = false;
            spread.options.allowUserZoom = false;
            spread.sheets.forEach(function (sheet) {
                sheet.options.allowCellOverflow = false;
            });

            spread.options.scrollbarMaxAlign = true;
            spread.options.scrollbarShowMax = true;

            spread.options.allowUserDragMerge = false;
            spread.options.allowContextMenu = false;
            spread.options.showDragFillSmartTag = false
            */
            var sheet = spread.getActiveSheet();
            //sheet.options.gridline.showVerticalGridline = false;
            //sheet.options.gridline.showHorizontalGridline = false;

            /*
            sheet.options.rowHeaderVisible = false;
            sheet.options.colHeaderVisible = false;
            spread.options.hideSelection = true;
            sheet.showRowOutline(false);

            sheet.frozenRowCount(1);
            */
            var data = this.content;
            if (!this.json) {//没有模板，默认把数据按顺序填入
                sheet.setRowCount(2, GC.Spread.Sheets.SheetArea.viewport);
                switch (this.type) {
                    case "1":
                        data = this.initITable(sheet);
                        break;
                    default://data是简单二维数组，fields是要显示的列名, cols是要显示的列
                        data = this.initArray2d(sheet);
                        break;
                }
            }
            //sheet.frozenColumnCount(sheet.getActiveColumnIndex());

            if (data) {
                var content = new CTemplateContent();
                for (var k in data) {
                    var v = data[k];
                    if (v instanceof Function)
                        continue;
                    content.add(k, v);
                }
                var filler = content.createSpreadFiller(spread);
                var template = content.fillCell(filler, null);
            }
            this.finish(sheet, template);
            var h = 0;
            for (var r = 0; r < sheet.getRowCount(); r++) {
                h += sheet.getRowHeight(r);
            }
            this.$el.style.height = (h + 2) + "px";

            var w = 0;
            for (var c = 0; c < sheet.getColumnCount(); c++) {
                w += sheet.getColumnWidth(c);
            }
            this.$el.style.width = (w + 2) + "px";
        }
        , export: function (fileName) {
/*
            var sheet=this.spread.getSheet(0);
            var rowCount=sheet.getRowCount();
            var colCount=sheet.getColumnCount();
            sheet.getRange(-1, 0, -1, colCount).width(110);//设置所有列宽为110，刚好放下7个汉字
            var allRange=sheet.getRange(0, 0, rowCount, colCount);//所有范围
            allRange.wordWrap(true);//所有行自动换行
            allRange.font('11pt 宋体');
            allRange.setBorder(new GC.Spread.Sheets.LineBorder("black", GC.Spread.Sheets.LineStyle.thin), {all:true});//设置边框
            for (var r = 0; r < rowCount; r++) {
                for (var c = 0; c < colCount; c++) {
                    var cell=sheet.getCell(r,c);
                    //cell.wordWrap(true);//自动换行
                    cell.hAlign(GC.Spread.Sheets.HorizontalAlign.center);//水平居中
                    cell.vAlign(GC.Spread.Sheets.VerticalAlign.center);//垂直居中
                }
                sheet.autoFitRow(r);
            }
*/
            var json = this.spread.toJSON({ includeBindingSource: true, ignoreFormula: false });
            var excelIO = new GC.Spread.Excel.IO();
            excelIO.save(json, function (blob) {
                saveAs(blob, fileName + ".xlsx");
            }, function (e) {
                alert(e);
            });

        }
    },
    beforeUpdate: function () { alert("beforeUpdate"); },
    updated: function () { alert("updated"); },
    mounted: function () {
        this.refresh();
    },
    beforeDestroy: function () {
        if (this.spread)
            delete this.spread;
    }
});
