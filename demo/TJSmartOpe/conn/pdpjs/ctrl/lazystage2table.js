/*v=1.20.906.5*/
Vue.component('lazystage2table', {
    mixins: [Ysh.Vue.IView.table],
    props: {
        columngroup: {
            type: Array,
            "default": []
        },
        data: {
            type: Array,
            "default": []
        },
        cols: {
            type: Number,
            "default": 0
        },
        fields: {
            type: Array,
            "default": []
        },
        group: {
            type: String,
            "default": ""
        },
        showall: {
            type: Boolean,
            "default": false
        },
        skip: {
            type: Function,
            "default": null
        },
        getsub: {
            type: Function,
            "default": null
        },
        mainlength: {
            type: Number,
            "default": 2
        }
    },
    template: `<i-table :columns="showColumns" :span-method="handleSpan" :data="showData" :stripe="stripe" :border="border" :show-header="showHeader" :height="height" :loading="loading" :disabled-hover="disabledHover" :highlight-row="highlightRow"
                        :row-class-name="finallyRowClassName" :size="size" :no-data-text="noDataText" :no-filtered-data-text="noFilteredDataText" @on-current-change="onCurrentChange" @on-select="onSelect" @on-select-cancel="onSelectCancel"
                        @on-select-all="onSelectAll" @on-select-all-cancel="onSelectAllCancel" @on-selection-change="onSelectionChange" @on-sort-change="onSortChange" @on-filter-change="onFilterChange" @on-row-click="onRowClick" @on-row-dblclick="onRowDblclick" @on-expand="onExpand">
          </i-table>`,
    data: function () {
        return {
            highlightId: '',
            forceUpdateData: false,
            selection: [],
            groupState: {},
            members: {},
            mLoadStates: {}
        };
    },
    computed: {
        columns: function () {
            var arr = [];
            if (this.cols == 0) {
                var cols = this.columngroup.length / 2;
                for (var i = 0; i < cols; i++) {
                    var c1 = this.columngroup[i];
                    var c2 = this.columngroup[cols + i];
                    var c = Ysh.Object.clone(c1);
                    this.setRender(c, c1, c2);
                    arr.push(c);
                }
            } else {
                return this.resetLevel2Columns(this.columngroup, this.cols);
            }
            return arr;
        },
        groups: function () {
            var group = {};
            var gs = [];
            var lst = this.data;
            var fields = this.fields;
            var fGroup = this.group;
            for (var i = 0; i < lst.length; i++) {
                var row = Ysh.Array.toObject(lst[i], fields);
                var g = row[fGroup];
                var d = Ysh.Object.clone(row);
                d.isGroup = true;
                d.index = gs.length;
                row.index = 0;
                var gobj = { _self: d, data: [] };
                gobj._self.data = gobj.data;
                group[g] = gobj;
                gs.push(g);
            }
            group.__all__ = gs;
            return group;
        },
        showData: function () {
            if (this.forceUpdateData && false)
                return this.data;
            var arr = [];
            var gs = this.groups.__all__;
            var gsShow;
            if (!this.skip) {
                gsShow = gs;
                for (var i = 0; i < gs.length; i++) {
                    var gid = gs[i];
                    var g = this.groups[gid];
                    arr.push(g._self);
                    if (this.showall || this.groupState[gid]) {
                        var data = this.members[gid] || { length: 0 };
                        for (var j = 0; j < data.length; j++)
                            arr.push(data[j]);
                    }
                }
            } else {
                gsShow = [];
                for (var i = 0; i < gs.length; i++) {
                    var gid = gs[i];
                    var g = this.groups[gid];
                    if (this.isGroupSkip(g))
                        continue;
                    gsShow.push(g);
                    arr.push(g._self);
                    if (this.showall || this.groupState[gid]) {
                        var data = this.members[gid] || { length: 0 };
                        for (var j = 0; j < data.length; j++) {
                            if (!this.skip(data[j]))
                                arr.push(data[j]);
                        }
                    }
                }
            }
            this.$emit("data-changed", arr, gsShow);
            this.onSelectionChange();
            return arr;
        }
    },
    methods: {
        isGroupSkip: function (g) {
            for (var i = 0; i < g.data.length; i++) {
                if (!this.skip(g.data[i]))
                    return false;
            }
            return true;
        },
        findHighLightRow: function (f) {
            for (var i = 0; i < this.data.length; i++) {
                var row = this.data[i];
                if (typeof f == 'function') { // 传入的是函数
                    if (f(row, i))
                        return row;
                } else { // 传入是数值                    
                    if (f == row[this.highlightField]) {
                        return row;
                    }
                }
            }
            return null;
        },
        locate: function (f) {
            var row = this.findHighLightRow(f);
            if (row == null)
                return;
            var gid = row[this.group];
            var g = this.findGroup(gid);
            var bRefresh = false;
            if (!this.groupState[gid]) {
                this.groupState[gid] = true;
                bRefresh = true;
            }
            if (!g.data[row.index]._checked) {
                g.data[row.index]._checked = true;
                bRefresh = true;
                this.onSelectionChange(null);
            }
            if (bRefresh)
                this.forceUpdateData = !this.forceUpdateData;
        },
        setRender: function (c, o1, o2) {
            c.o1 = o1;
            c.o2 = o2;
            c.render = function (h, params) {
                if (params.row.isGroup)
                    return params.column.o1.render(h, params);
                return params.column.o2.render(h, params);
            }
        },
        getParentIndex: function (cols, length, idx) {
            var total = length;
            for (var i = 0; i < length; i++) {
                var c = cols[i];
                var end = total + (c.colspan || 1);
                if (idx < end)
                    return i;
                total = end;
            }
            console.log("error!!!!!!!");
            return length - 1;
        },
        setPSPair: function (ret, cols, pidx, sidx) {
            //{ title: c.title, children: [] };
            var c = cols[sidx];
            var p = ret[pidx];
            if (p == null) {
                var pp = cols[pidx];
                ret[pidx] = p = { title: pp.title, children: [] };
                var cc = Ysh.Object.clone(c);
                cc.span = pp.colspan;
                cc.pidx = pidx;
                this.setRender(cc, pp, c);
                p.children.push(cc);
            } else {
                c.span = -1;
                p.children.push(c);
            }
        },
        resetLevel2Columns: function (cols, length) {
            var ret = [];
            for (var i = 0; i < length; i++) {
                ret.push(null);
            }
            for (var i = length; i < cols.length; i++) {
                var c = cols[i];
                var pidx = this.getParentIndex(cols, length, i);
                var p = cols[pidx];
                if (p.colspan > 1) {
                    this.setPSPair(ret, cols, pidx, i);
                } else {
                    if (p.title == c.title) {//名字一样，合并
                        var column = Ysh.Object.clone(c);
                        this.setRender(column, p, c);
                        ret[pidx] = column;
                    } else {
                        this.setPSPair(ret, cols, pidx, i);
                    }
                }
            }
            return ret;
        },
        findGroup: function (gid) {
            var gs = this.groups.__all__;
            for (var i = 0; i < gs.length; i++) {
                var g = this.groups[gs[i]];
                if (g._self[this.group] == gid)
                    return g;
            }
            return null;
        },
        isAllChecked: function (data) {
            for (var i = 0; i < data.length; i++) {
                if (!data[i]._checked)
                    return false;
            }
            return true;
        },
        setAllChecked: function (b) {
            var gs = this.groups.__all__;
            for (var i = 0; i < gs.length; i++) {
                var g = this.groups[gs[i]];
                g._self._checked = b;
                for (var j = 0; j < g.data.length; j++)
                    g.data[j]._checked = b;
            }
            this.forceUpdateData = !this.forceUpdateData;
        },
        onSelect: function (selection, row) {
            var gid = row[this.group];
            var g = this.findGroup(gid);
            if (g == null) return;
            if (row.isGroup) {
                g._self._checked = true;
                var data = g.data;
                for (var j = 0; j < data.length; j++)
                    data[j]._checked = true;
            } else {
                g.data[row.index]._checked = true;
                g._self._checked = this.isAllChecked(g.data);
            }
            this.forceUpdateData = !this.forceUpdateData;

            this.$emit('on-select', selection, row);
        },
        onSelectCancel: function (selection, row) {
            var gid = row[this.group];
            var g = this.findGroup(gid);
            if (g == null) return;
            if (row.isGroup) {
                g._self._checked = false;
                var data = g.data;
                for (var j = 0; j < data.length; j++)
                    data[j]._checked = false;
            } else {
                g.data[row.index]._checked = false;
                g._self._checked = false;
            }
            this.forceUpdateData = !this.forceUpdateData;
            this.$emit('on-select-cancel', selection, row);
        },
        onSelectAll: function (selection) {
            this.setAllChecked(true);
            this.$emit('on-select-all', selection);
        },
        onSelectAllCancel: function (selection) {
            this.setAllChecked(false);
            this.$emit('on-select-all-cancel', selection);
        },
        onSelectionChange: function (selection) {
            var data = [];
            if (!this.skip) {
                for (var i = 0; i < this.data.length; i++) {
                    var row = this.data[i];
                    if (row._checked)
                        data.push(row);
                }
            } else {
                for (var i = 0; i < this.data.length; i++) {
                    var row = this.data[i];
                    if (row._checked && !this.skip(row))
                        data.push(row);
                }
            }
            this.$emit('on-selection-change', data);
        },
        onRowClick: function (row, index) {
            if (row.isGroup) {
                var gid = row[this.group];
                var b = !this.groupState[gid];
                this.groupState[gid] = b;
                var g = this.findGroup(gid);
                if (b && g && this.getsub && (!this.mLoadStates[gid]) && (!this.members[gid])) {
                    var _this = this;
                    this.mLoadStates[gid] = true;
                    this.getsub(gid, row, function (data) {
                        if (data === false) {
                            _this.mLoadStates[gid] = false;
                            return;
                        }
                        var ol = Ysh.Array.toObjectList(data, _this.fields, _this.mainlength);
                        _this.members[gid] = ol;
                        g.data = ol;
                        _this.forceUpdateData = !_this.forceUpdateData;
                    });
                }
                this.forceUpdateData = !this.forceUpdateData;
            }
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
            return this.getClickClassName(row, index) + this.rowClassName(row, index) + (row.isGroup ? " table-content-row2" : " table-content-row1");
        },
        resize: function () {
            //根据设置的宽度重置
            this.resetColumns($(this.$el).width());
            this.doResize();
        },
        handleSpan: function (d) {
            if (d.row.isGroup) {
                if (d.column.span < 0) return [0, 0];
                if ((d.column.span || 0) < 2) return [1, 1];
                var p = this.columns[d.column.pidx];
                var n = 0;
                for (var i = 0; i < p.children.length; i++) {
                    if (!p.children[i].isHide)
                        n++;
                }
                return [1, n];
            }
            return { rowspan: 1, colspan: 1 };
        }
    },
    watch: {
        data: function () {
            this.highlightId = "";
            this.groupState = {};
        }
    }
});