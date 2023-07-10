
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

{//dev开始
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
        vMain.gotoApp("devicearchives",{ id: row.lst_0 })
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
        PDP.exec([{ type: "search", xml: "shengchan/device_search", search: s }], function (ret) {
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
        return (Ysh.Time.diff('m', new Date(Ysh.Time.parseDate(time)), new Date())/12.0).toFixed(1);
    }
    this.sortAge = function (x, y, t) {
        return -1;
    }
    this.renderType = function (h, o) {
        switch (o.row.lst_6) {
            case "断路器":
                break;
            case "主变压器":
                break;
        }
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
}//dev结束

{//zc开始
    var arrSortCols = ["initAsset", "netAsset", "salvageAsset", "accumulatedAepreciation", "depreciableYear", "wctzy"];
    for (var i = 0; i < arrSortCols.length; i++) {
        var sc = arrSortCols[i];
        if (sc == this.col) {
            this[sc] = this.order;
        }
    }
    ProjectLocal.V.wan = function (v) {
        if (isNaN(v)) return v;
        if (!v) return v; return Ysh.Number.toFixed(Number(v)/10000, 2);
    }
    this.searchXml = "shengchan/zc_search";
    this.getDays = function (dt, isDq) {
        var days = Ysh.Time.diff('d', Ysh.Time.getTime("d,m,1,d,-1", new Date(Ysh.Time.parseDate(dt))), new Date());
        return (isDq ? -days : days);
    }
    this.sortDq = function (r1, r2, type) {
        var v = Ysh.Compare.compare(r1, r2);
        if (type == "asc") return v;
        return -v;
    }
    this.sortCq = function (r1, r2, type) {
        return -this.sortDq(r1, r2, type);
    }
}//zc结束

{//factory开始
    this.searchXml = "shengchan/factory_search";
}//factory结束

{//model开始
    this.searchXml = "shengchan/model_search";
}//model结束
