/*v=1.21.610.1*/
Vue.component('commontable', {
    mixins: [Ysh.Vue.IView.table],
    props: {
        columns: {
            type: Array,
            "default": []
        },
        data: {
            type: Array,
            "default": []
        }
    },
    data: function () {
        return {
        };
    },
    computed: {
        showData: function () {
            var ret = this.filterData(this.data);
            /*
            if (this.curSort) {
                var k = this.curSort.key;
                var b = this.curSort.order == "asc";
                var t = this.curSort.column.dtype;
                ret = ret.sort(function (r1, r2) {
                    var v1 = r1[k];
                    var v2 = r2[k];
                    return (b ? 1 : -1) * Ysh.Compare.getComparison(t)(v1, v2);
                });
            }*/
            if (this.isFirstFilterRow) {
                ret.insert(0, [this.getFilterRowData()]);
                this.removeFilterCheckBox();
            }
            console.log("commontable showData");
            return ret;
        }
    },
    methods: {
        getColumn: function (key) {
            var columns = this.columns;
            debugger
            for (var i = 0; i < columns.length; i++) {
                var c = columns[i];
                if (c.key == key) return c;
            }
            return null;
        },
        locate: function (f) {
            var index = -1;//find Index
            for (var i = 0; i < this.data.length; i++) {
                var row = this.data[i];
                if (typeof f == 'function') { // 传入的是函数
                    if (f(row, i)) {
                        index = i;
                        break;
                    }
                } else { // 传入是数值
                    if (this.highlightField && this.highlightField != "index") {
                        if (f == row[this.highlightField]) {
                            index = i;
                            break;
                        }
                    } else {
                        if (f == i) {
                            index = i;
                            break;
                        }
                    }
                }
            }
            if (index < 0)
                return;
            // 跳到第几页
            if (this.highlightField && this.highlightField != "index")
                this.highlightId = this.data[index][this.highlightField];
            else
                this.highlightId = index;
        },
        onRowClick: function (row, index) {
            // 高亮
            if (this.clickHighlight) {
                if (this.highlightField && (this.highlightField != "index")) {
                    this.highlightId = row[this.highlightField];
                } else {
                    this.highlightId = index;
                }
            }
            this.$emit('on-row-click', row, index);
        },
        getClickClassName: function (row, index) {
            if (this.clickHighlight) {
                if (this.highlightField && (this.highlightField != "index")) {
                    return row[this.highlightField] == this.highlightId ? "itable-tr-highlight " : "";
                }
                return index === this.highlightId ? "itable-tr-highlight " : "";
            }
            return "";
        },
        finallyRowClassName: function (row, index) {
            return this.getClickClassName(row, index) + this.rowClassName(row, index);
        },
        resize: function () {
            //根据设置的宽度重置
            this.resetColumns($(this.$el).width());
            this.doResize();
        },
        doSpanMethod: function (d) {
            var ret;
            if (this.spanMethod)
                ret = this.spanMethod(d);
            if (ret) return ret;
            return this.mergeColumn(d, this.showData);
        }
    },
    watch: {
        data: function () {
            this.highlightId = "";
        }
    }, mounted: function () {
        console.log(this.columns)
        console.log(this.data)
    }, template: `<i-table :columns="showColumns" :data="showData" :stripe="stripe" :border="border" :show-header="showHeader" :height="height" :loading="loading" :disabled-hover="disabledHover" :highlight-row="highlightRow" :span-method="doSpanMethod"
                        :row-class-name="finallyRowClassName" :size="size" :no-data-text="noDataText" :no-filtered-data-text="noFilteredDataText" @on-current-change="onCurrentChange" @on-select="onSelect" @on-select-cancel="onSelectCancel"
                        @on-select-all="onSelectAll" @on-selection-change="onSelectionChange" @on-sort-change="onSortChange" @on-filter-change="onFilterChange" @on-row-click="onRowClick" @on-row-dblclick="onRowDblclick" @on-expand="onExpand">
          </i-table>`
});