
{//base开始
    Ysh.Object.addHandle(this, "resize", function () {
        var hAll = $(this.$el).height();
        var hIf = $(this.$refs.divIf).height();
        var hResult = $(this.$refs.divResult).height();
        console.log([hAll, hIf, hResult]);
        this.hTbl = Math.max(hAll - hIf - hResult - 20, 200);

    });
    this.search = function () {
        this.doSearch(this.$refs.search.results);
        this.$nextTick(function () {
            this.resize();
        });
    }
    this.changeExpand = function () {
        this.show = !this.show;
        //if (!this.show) return;
        this.$nextTick(function () {
            this.resize();
        });
    }
    this.n = 0;
    this.doSearch = function (s) {
        //return;
        var _this = this;
        this.n++;
        var n = this.n;
        this.loading = true;
        var searchkey = "";
        for (var k in s) {
            if (k == "name") {
                searchkey = s[k];
                break;
            }
        }
        this.searchkey = searchkey;
        PDP.exec([{ type: "search", xml: this.searchXml, search: s }], function (ret) {
            if (n != _this.n)
                return;
            _this.timerID = null;
            if (!ret.check("搜索", true)) return;
            _this.lst = ret.value[0];
            _this.loading = false;
        });
    }
    this.types = [];
    for (var i = 0; i < this.conditions.length; i++) {
        var c = this.conditions[i];
        if (c.types) {
            for (var t in c.types)
                this.types.push(t);
        }
    }
    this.addExtend = function (lst) {
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            row._disableExpand = (this.types.indexOf(row.lst_6) < 0);
        }
        return lst;
    }
    this.resetConditions = function () {
        this.initconditions();
    }
    this.getAge = function (time) {
        return (Ysh.Time.diff('m', new Date(Ysh.Time.parseDate(time)), new Date()) / 12.0).toFixed(1);
    }
    this.sortAge = function (x, y, t) {
        return -1;
    }
    this.lst = [];
    //this.init();
    if (this.filter) {
        for (var k in this.filter) {
            var c = SearchBlock.find(this.conditions, k);
            if (c)
                c.checked = this.filter[k].split(',');
        }
        //this.doSearch(this.filter);
    }
}//base结束

{//station开始
    Ysh.Object.addHandle(this, "resize", function () {
        var hAll = $(this.$el).height();
        var hIf = $(this.$refs.divIf).height();
        var hResult = $(this.$refs.divResult).height();
        console.log([hAll, hIf, hResult]);
        this.hTbl = Math.max(hAll - hIf - hResult - 20, 200);

    });
    this.search = function () {
        this.doSearch(this.$refs.search.results);
        this.$nextTick(function () {
            this.resize();
        });
    }
    this.changeExpand = function () {
        this.show = !this.show;
        //if (!this.show) return;
        this.$nextTick(function () {
            this.resize();
        });
    }
    this.dblclick = function (row, index) {
        vMain.gotoApp("devicearchives", { id: row.lst_0 })
    }
    this.n = 0;
    this.doSearch = function (s) {
        //return;
        var _this = this;
        this.n++;
        var n = this.n;
        this.loading = true;
        var searchkey = "";
        for (var k in s) {
            if (k == "name") {
                searchkey = s[k];
                break;
            }
        }
        this.searchkey = searchkey;
        PDP.exec([{ type: "search", xml: "shengchan/station_defect_search", search: s }], function (ret) {
            if (n != _this.n)
                return;
            _this.timerID = null;
            if (!ret.check("搜索", true)) return;
            _this.lst = ret.value[0];
            _this.loading = false;
        });
    }
    this.types = [];
    for (var i = 0; i < this.conditions.length; i++) {
        var c = this.conditions[i];
        if (c.types) {
            for (var t in c.types)
                this.types.push(t);
        }
    }

    this.resetConditions = function () {
        this.initconditions();
    }

    this.lst = [];
    //this.init();
    if (this.filter) {
        for (var k in this.filter) {
            var c = SearchBlock.find(this.conditions, k);
            if (c)
                c.checked = this.filter[k].split(',');
        }
        //this.doSearch(this.filter);
    }
}//station结束
{//line开始
    Ysh.Object.addHandle(this, "resize", function () {
        var hAll = $(this.$el).height();
        var hIf = $(this.$refs.divIf).height();
        var hResult = $(this.$refs.divResult).height();
        this.hTbl = Math.max(hAll - hIf - hResult - 20, 200);

    });
    this.search = function () {
        this.doSearch(this.$refs.search.results);
        this.$nextTick(function () {
            this.resize();
        });
    }
    this.changeExpand = function () {
        this.show = !this.show;
        //if (!this.show) return;
        this.$nextTick(function () {
            this.resize();
        });
    }
    this.dblclick = function (row, index) {
        vMain.gotoApp("devicearchives", { id: row.lst_0 })
    }
    this.n = 0;
    this.doSearch = function (s) {

        //return;
        var _this = this;
        this.n++;
        var n = this.n;
        this.loading = true;
        var searchkey = "";
        for (var k in s) {
            if (k == "name") {
                searchkey = s[k];
                break;
            }
        }
        this.searchkey = searchkey;
        PDP.exec([{ type: "search", xml: "shengchan/line_defect_search", search: s }], function (ret) {
            if (n != _this.n)
                return;
            _this.timerID = null;
            if (!ret.check("搜索", true)) return;
            _this.lst = ret.value[0];
            _this.loading = false;
        });
    }
    this.types = [];
    for (var i = 0; i < this.conditions.length; i++) {
        var c = this.conditions[i];
        if (c.types) {
            for (var t in c.types)
                this.types.push(t);
        }
    }

    this.resetConditions = function () {
        this.initconditions();
    }

    this.lst = [];
    //this.init();

    if (this.filter) {
        for (var k in this.filter) {
            var c = SearchBlock.find(this.conditions, k);
            if (c) {
                // 关键字
                if (c.hasOwnProperty('value')) {
                    c.value = this.filter[k]
                }
                c.checked = this.filter[k].split(',');
            }

        }
        // this.doSearch(this.filter);
    }
}//line结束
{//line_statistic开始
    var vm = this;

    this.groupKey = null
    this.tableTitle = "";
    this.tableCountTitle = "";
    switch (this.statisticType) {
        case 'line':
            this.groupKey = [1, 11];
            this.tableTitle = "线路名称";
            this.tableCountTitle = "线路缺陷数量";
            break;
        case 'bw':
            this.groupKey = [9, 11];
            this.tableTitle = "部位名称";
            this.tableCountTitle = "部位缺陷数量";
            break;
        case 'bj':
            this.groupKey = [7, 11];
            this.tableTitle = "部件名称";
            this.tableCountTitle = "部件缺陷数量";
            break;
        case 'ywdw':
            this.groupKey = [15, 11];
            this.tableTitle = "运维单位名称";
            this.tableCountTitle = "运维单位数量";
            break;
    }
    Ysh.Object.addHandle(this, "resize", function () {
        var hAll = $(this.$el).height();
        var hIf = $(this.$refs.divIf).height();
        var hResult = $(this.$refs.divResult).height();
        console.log([hAll, hIf, hResult]);
        this.hTbl = Math.max(hAll - hIf - hResult - 20, 200);

    });
    this.dblclick = function (row, index) {

        var defectLevel = row.defect;
        var filter = { defectLevel: defectLevel };

        var search = this.$refs.search.results;
        switch (this.statisticType) {
            case 'line':
                filter.name = row.statistic;
                break;
            case 'bw':
                filter.bw = row.statistic;
                break;
            case 'bj':
                filter.bj = row.statistic;
                break;
            case 'ywdw':
                filter.ywdw = row.statistic;
                break;
        }
        for (var key in search) {
            if (!filter[key]) {
                filter[key] = search[key]
            }
        }
        vMain.gotoApp("line_defect_search", { filter: filter })
        // vMain.gotoApp("devicearchives", { id: row.lst_0 })
    }
    this.search = function () {
        this.doSearch(this.$refs.search.results);
        this.$nextTick(function () {
            this.resize();
        });
    }
    this.changeExpand = function () {
        this.show = !this.show;
        //if (!this.show) return;
        this.$nextTick(function () {
            this.resize();
        });
    }

    this.n = 0;
    this.doSearch = function (s) {

        //return;
        var _this = this;
        this.n++;
        var n = this.n;
        this.loading = true;
        var searchkey = "";
        for (var k in s) {
            if (k == "name") {
                searchkey = s[k];
                break;
            }
        }
        this.searchkey = searchkey;
        PDP.exec([{ type: "search", xml: "shengchan/line_defect_more", search: s }], function (ret) {
            if (n != _this.n)
                return;
            _this.timerID = null;
            if (!ret.check("搜索", true)) return;
            _this.lst = ret.value[0];
            _this.loading = false;
            _this.groupAndSort(_this.lst, _this.groupKey);
        });
    }
    this.groupAndSort = function (list, groupKey) {
        if (groupKey == null) return;
        var groupData = []
        var groups = this.groupByKeys(list, groupKey);
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            var statistic = group.statistic;
            for (var j = 0; j < statistic.length; j++) {
                var item = statistic[j];
                groupData.push({ statistic: group.text, defect: item.text, count: item.count, data: item.data })
            }
        }
        var filterData = groupData.filter(item => !!item.statistic)
        filterData.sort(function (a, b) {
            return b.count - a.count;
        })
        this.tableData = filterData;
    }
    this.groupByKeys = function (arr, keys) {
        if (typeof keys === 'string') {
            keys = [keys];
        }
        if (keys.length === 0) {
            return [];
        }

        const result = [];
        for (let i = 0; i < arr.length; ++i) {
            const item = arr[i];

            const value = item[keys[0]];
            let statisticItem = null;
            for (let j = 0; j < result.length; ++j) {
                if (result[j].text === value) {
                    statisticItem = result[j];
                    break;
                }
            }

            if (!statisticItem) {
                statisticItem = {
                    'text': value,
                    'count': 0,
                    'statistic': [],
                    'data': []
                };
                result.push(statisticItem);
            }

            statisticItem.count++;
            statisticItem.data.push(item);
        }
        const nextKeys = keys.slice(1);
        for (let i = 0; i < result.length; ++i) {
            const statisticItem = result[i];

            statisticItem.statistic = this.groupByKeys(statisticItem.data, nextKeys, true);

            statisticItem.statistic.sort((a, b) => b.count - a.count);
        }
        result.sort((a, b) => b.count - a.count);
        return result;
    },
        this.types = [];
    for (var i = 0; i < this.conditions.length; i++) {
        var c = this.conditions[i];
        if (c.types) {
            for (var t in c.types)
                this.types.push(t);
        }
    }

    this.resetConditions = function () {
        this.initconditions();
    }

    this.lst = [];
    //this.init();
    if (this.filter) {
        for (var k in this.filter) {
            var c = SearchBlock.find(this.conditions, k);
            if (c)
                c.checked = this.filter[k].split(',');
        }
        //this.doSearch(this.filter);
    }
}//line_statistic结束


