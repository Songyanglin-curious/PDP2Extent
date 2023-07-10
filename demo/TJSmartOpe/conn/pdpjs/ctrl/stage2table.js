/*v=1.20.1025.1*/
Vue.component('stage2table', {
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
        fullsub: {
            type: Function,
            "default": null
        }
    },
    template: "#stage2table_template",
    data: function () {
        return {
            highlightId: '',
            forceUpdateData: false,
            selection: [],
            groupState: {},
            members: {},
            mLoadStates: {},
            resizeTimer: 0,
            isLocate: false
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
            /*
            arr.push({
                type: 'expand',
                width: 30,
                render: (h, params) => {
                    return h(commontable, {
                        props: {
                            columns: columns2,
                            data: params.row.data,
                            showHeader: false
                        }
                    })
                }
            });
            */
            return arr;
        },
        groups: function () {
            var group = {};
            var gs = [];
            var data = this.data;
            var groupcol = this.group;
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var g = row[groupcol];
                if (group[g]) {
                    row.index = group[g].data.length;
                    group[g].data.push(row);
                } else {
                    var d = Ysh.Object.clone(row);
                    d.isGroup = true;
                    d.index = gs.length;
                    row.index = 0;
                    var gobj = { _self: d, data: [row] };
                    gobj._self.data = gobj.data;
                    group[g] = gobj;
                    gs.push(g);
                }
            }
            group.__all__ = gs;
            /*this.$nextTick(function () {
                this.onSelectionChange(null, true);
            });*/
            return group;
        },
        showData: function () {
            if (this.forceUpdateData && false)
                return [];
            var arr = [];
            if (this.isFirstFilterRow) {
                arr.push(this.getFilterRowData());
            }
            var groups = this.groups;
            var gs = groups.__all__;
            var gsShow;
            if (!this.skip) {
                gsShow = gs;
                for (var i = 0; i < gs.length; i++) {
                    var g = groups[gs[i]];
                    if (!this.matchFilter(g._self))
                        continue;
                    arr.push(g._self);
                    if (this.showall || this.groupState[gs[i]]) {
                        var data = g.data;
                        for (var j = 0; j < data.length; j++)
                            arr.push(data[j]);
                    }
                }
            } else {
                gsShow = [];
                for (var i = 0; i < gs.length; i++) {
                    var gid = gs[i];
                    var g = groups[gid];
                    if (this.isGroupSkip(g))
                        continue;
                    if (!this.matchFilter(g._self))
                        continue;
                    gsShow.push(gid);
                    arr.push(g._self);
                    if (this.showall || this.groupState[gid]) {
                        var data = g.data;
                        for (var j = 0; j < data.length; j++) {
                            if (!this.skip(data[j]))
                                arr.push(data[j]);
                        }
                    }
                }
            }
            this.removeFilterCheckBox();
            this.$emit("data-changed", this.data, gsShow);
            this.isLocate = false;
            return arr;
        }
    },
    methods: {
        isGroupSkip: function (g) {
            var f = this.skip;
            for (var i = 0; i < g.data.length; i++) {
                if (!f(g.data[i]))
                    return false;
            }
            return true;
        },
        isMatch: function (row, f) {
            var field = this.highlightField;
            if (typeof f == 'function') { // 传入的是函数
                if (f(row))
                    return true;
            } else { // 传入是数值                    
                if (f == row[field]) {
                    return true;
                }
            }
            return false;
        },
        findHighLightRow: function (f) {
            var data = this.data;
            var field = this.highlightField;
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                if (this.isMatch(row, f))
                    return row;
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
            var bSelectionChanged = false;
            if (!g._self._checked) {
                g._self._checked = true;
                bSelectionChanged = true;
            }
            for (var i = 0; i < g.data.length; i++) {
                var rs = g.data[i];
                if (!this.isMatch(rs, f))
                    continue;
                if (rs._checked)
                    continue;
                rs._checked = true;
                bSelectionChanged = true;
            }
            /*
            if (!g.data[row.index]._checked) {
                g.data[row.index]._checked = true;
                bRefresh = true;
                this.onSelectionChange(null);
            }*/
            if (bSelectionChanged) {
                this.isLocate = true;
                this.onSelectionChange(null, true);
            }
            if (bRefresh || bSelectionChanged)
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
        getRealIndex: function (cols, idx) {
            if (idx == 0) return 0;
            var total = 0;
            for (var i = 0; i < idx; i++) {
                total += (c.colspan || 1);
            }
            return total + 1;
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
        onSelectionChange: function (selection, isLocate) {
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
            this.$emit('on-selection-change', data, isLocate);
        },
        onRowClick: function (row, index) {
            if (this.isFirstFilterRow && (index == 0))
                return;
            if (row.isGroup) {
                var gid = row[this.group];
                var b = !this.groupState[gid];
                this.groupState[gid] = b;
                var g = this.findGroup(gid);
                if (b && g && this.fullsub && (!this.mLoadStates[gid]) && (!this.members[gid])) {
                    var _this = this;
                    this.mLoadStates[gid] = true;
                    this.fullsub(gid, g, row, function (success) {
                        if (!success) {
                            _this.mLoadStates[gid] = false;
                            return;
                        }
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
            if (this.resizeTimer)
                window.clearTimeout(this.resizeTimer);
            //根据设置的宽度重置
            var _this = this;
            this.resizeTimer = window.setTimeout(function () {
                _this.resetColumns($(_this.$el).width());
                _this.doResize();
            }, 100);
        },
        handleSpan: function (d) {
            if (this.isFirstFilterRow && d.row._index == 0) return [1, 1];
            var span = d.column.span || 1;
            if (d.row.isGroup) {
                if (span < 0) return [0, 0];
                if (span < 2) return [1, 1];
                var p = this.columns[d.column.pidx];
                var n = 0;
                for (var i = 0; i < p.children.length; i++) {
                    if (!p.children[i].isHide)
                        n++;
                }
                return [1, n];
            } else {
                if (d.column.merge) {
                    var idx = d.row._index;
                    var prev = this.showData[idx - 1];
                    if (prev.isGroup)
                        return [prev.data.length, span]
                    else
                        return [0, 0];
                }
                return [1,1]//{ rowspan: 1, colspan: 1 };
            }
        },
        onSortChange: function (column, key, order) {
            key = key || column.key;
            order = order || column.order;
            column = column.column || column;
            var groups = this.groups;
            var gs = groups.__all__;
            if (gs.length == 0)
                return;
            var compare = Ysh.Compare.getComparison(column.dtype);
            var b = (order == "asc");
            var f = function (g1, g2) {
                var v1 = groups[g1]._self[key];
                var v2 = groups[g2]._self[key];
                if (v1 === v2) return 0;
                if (column.dtype) {
                    if (typeof v1 == "undefined" || v1 === "") return 1;
                    if (typeof v2 == "undefined" || v2 === "") return -1;
                }
                return (b ? 1 : -1) * compare(v1, v2);
            }
            gs.sort(f);
            this.forceUpdateData = !this.forceUpdateData;
        }
    },
    watch: {
        data: function () {
            this.highlightId = "";
            this.groupState = {};
        }
    }
});