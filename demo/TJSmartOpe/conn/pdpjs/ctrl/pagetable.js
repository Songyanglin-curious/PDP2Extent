/*v=1.20.922.1*/
Vue.component('pagetable', {
    mixins: [Ysh.Vue.IView.table],
    props: {
        columns: {
            type: Array,
            "default": []
        },
        data: {
            type: Array,
            "default": []
        },
        items: {
            type: Number,
            "default": 10
        },
        showSummary: {
            type: Boolean,
            "default": false
        },
        summaryMethod: {
            type: Function,
            "default": function (row) {
                return false;
            }
        },
        //设置复选框默认选中的方法
        fSetChecked: {
            type: Function,
            "default": function (row) {
                return false;
            }
        },
        spanMethod: {
            type: Function,
            "default": null
        }
    },
    template: `<i-table :columns="currColumns" :data="currData" :stripe="stripe" :border="border" :show-summary="showSummary" :summary-method="summaryMethod" :show-header="showHeader" :height="height" :loading="loading" :disabled-hover="disabledHover" :highlight-row="highlightRow" :span-method="doSpanMethod"
                        :row-class-name="finallyRowClassName" :size="size" :no-data-text="noDataText" :no-filtered-data-text="noFilteredDataText" @on-current-change="onCurrentChange" @on-select="onSelect" @on-select-cancel="onSelectCancel"
                        @on-select-all="onSelectAll" @on-select-all-cancel="onSelectAllCancel" @on-selection-change="onSelectionChange" @on-sort-change="onSortChange" @on-filter-change="onFilterChange" @on-row-click="onRowClick" @on-row-dblclick="onRowDblclick" @on-expand="onExpand">
              <div slot="footer" style="display:flex;justify-content:center;align-items:center;" v-if="needShowPage">
                <Page show-elevator show-total style="text-align:center" :total="total" :page-size="showItems" :current="pageIndex" v-on:on-change="changePage"></Page>
                &nbsp;&nbsp;每页条数:&nbsp;<InputNumber v-model="showItems" :min="1" style="width:60px;"></InputNumber>
              </div>
          </i-table>`,
    data: function () {
        return {
            highlightId: '',
            filters: [],
            curSort: null,
            selection: [],
            pageIndex: 1,
            vShowItems: 10,
            bMounted:false,
            forceChanged: false
        };
    },
    computed: {
        showData: function () {
            return this.filterData(this.data);
        },
        total: function () {
            return this.showData.length;
        },
        currData: function () {
            var start = (this.pageIndex - 1) * this.showItems;
            var ret = [];
            if (this.isFirstFilterRow) {
                ret.push(this.getFilterRowData());
            } else if (this.isFirstTotalRow) {
                ret.push(this.totals);
            }
            for (var i = 0; i < this.showItems; i++) {
                var idx = start + i;
                if (idx >= this.showData.length)
                    break;
                ret.push(this.showData[idx]);
            }
            if (this.forceChanged || true)//forceChanged强制刷新
            this.removeFilterCheckBox();
            return ret;
        }, currColumns: function () {
            return this.showColumns;
            //return this.changeIndexColumn(this.showColumns);
        }, needShowPage: function () {
            if (!this.bMounted) return true;
            if (this.showData.length > this.showItems)
                return true;
            return false;
        },
        showItems: {
            get: function () { return this.vShowItems; },
            set: function (v) { this.vShowItems = (v || 1); }
        }
    },
    methods: {
        locate: function (f) {
            var index = -1;//find Index
            for (var i = 0; i < this.showData.length; i++) {
                var row = this.showData[i];
                if (typeof f == 'function') { // 传入的是函数
                    if (f(row)) {
                        index = i;
                        break;
                    }
                } else { // 传入是数值
                    if (f == row[this.highlightField]) {
                        index = i;
                        break;
                    }
                }

            }
            if (index < 0)
                return;
            // 跳到第几页
            this.highlightId = this.showData[index][this.highlightField];
            this.changePage(parseInt(index / this.showItems) + 1);
        },
        initLogicColumn: function (c) {
            if (c.type != "index")
                return;
            if (c.indexMethod)
                return;
            var vm = this;
            c.indexMethod = function (row) {
                return row._index + 1 + (vm.pageIndex - 1) * vm.showItems;
            }
        },
        filterEnd: function () {
            this.pageIndex = 1;
        },
        getDataIndex: function (row, arrData) {
            var index = row["_dataIndex"];
            if (index === undefined)
                return -1;
            if (arrData === undefined)
                return parseInt(index);
            for (var i = 0; i < arrData.length; i++) {
                if (arrData[i]["_dataIndex"] == row["_dataIndex"])
                    return i;
            }
            return -1;
        },
        setSelection: function (row, checked) {
            var index = this.getDataIndex(row, this.selection);
            if (checked && index < 0) {
                this.selection.push(row);
                this.selection.sort(function (row1, row2) {
                    if (row1["_dataIndex"] === undefined)
                        return 1;
                    if (row2["_dataIndex"] === undefined)
                        return -1;
                    return parseInt(row1["_dataIndex"]) - parseInt(row2["_dataIndex"]);
                });
            }
            else if (!checked && index >= 0) {
                this.selection.splice(index, 1);
            }
        },
        setChecked: function () {
            for (var i = 0; i < this.showData.length; i++) {
                //this.showData[i]["index"] = i + 1 + this.indexdiff;
                this.showData[i]["_dataIndex"] = i;
                this.showData[i]["_checked"] = this.fSetChecked(this.showData[i]);
                if (this.showData[i]["_checked"])
                    this.setSelection(this.showData[i], true);
            }
        },
        onSelect: function (selection, row) {
            var index = this.getDataIndex(row);
            if (index >= 0)
                this.showData[index]["_checked"] = true;
            this.setSelection(row, true);
            this.$emit('on-select', selection, row);
        },
        onSelectCancel: function (selection, row) {
            var index = this.getDataIndex(row);
            if (index >= 0)
                this.showData[index]["_checked"] = false;
            this.setSelection(row, false);
            this.$emit('on-select-cancel', selection, row);
        },
        onSelectAll: function (selection) {
            for (var i = 0; i < this.showData.length; i++) {
                this.showData[i]["_checked"] = true;
                this.setSelection(this.showData[i], true);
            }
            this.$emit('on-select-all', selection);
        },
        onSelectAllCancel: function (selection) {
            for (var i = 0; i < this.showData.length; i++) {
                this.showData[i]["_checked"] = false;
                this.setSelection(this.showData[i], false);
            }
            this.$emit('on-select-all-cancel', this.selection);
        },
        onRowClick: function (row, index) {
            // 高亮
            if (this.highlightField) {
                this.highlightId = row[this.highlightField];
            }
            this.$emit('on-row-click', row, index);
        },
        getClickClassName: function (row, index) {
            if (this.clickHighlight) {
                if (this.highlightField) {
                    return row[this.highlightField] == this.highlightId ? "itable-tr-highlight " : ""
                }
                return "";
            }
            return "";
        },
        finallyRowClassName: function (row, index) {
            return this.getClickClassName(row, index) + this.rowClassName(row, index);
        },
        changePage: function (p) {
            this.pageIndex = p;
        },
        doSpanMethod: function (d) {
            var ret;
            if (this.spanMethod)
                ret = this.spanMethod(d);
            if (ret) return ret;
            return this.mergeColumn(d, this.currData);
        },
        setRowData: function (rIdx, cIdx, v) {
            this.data[rIdx][cIdx] = v;
            this.forceChanged = !this.forceChanged;
        }
    },
    watch: {
        showData: function (oldData, newData) {
            this.setChecked();
        }, data: function () {
            this.pageIndex = 1;
            this.filters = [];
            this.selection = [];
            this.highlightId = "";
        }, currData: {
            immediate: true,
            handler: function () {
                this.$emit("data-changed", this.currData);
            }
        },
        resize: function () {
            //根据设置的宽度重置
            this.resetColumns($(this.$el).width());
            this.doResize();
        },
        columns: {
            immediate:true,
            handler:function() {
                var columns = this.columns;
                for (var i = 0; i < columns.length; i++) {
                    this.setFilterColumn(columns[i]);
                }
            }
        },
        items: function () {
            this.showItems = this.items;
        }
    },
    created: function () {
        this.showItems = this.items;
    },
    mounted: function () {
        this.bMounted = true;
        this.setChecked();
        this.resize();
    }
});