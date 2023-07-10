/*v=1.19.1126.1*/
var SGCTime = {
    getYear: function (date) {
        if (!date)
            return 0;
        return Ysh.String.toInt(date.split('-')[0], 0);
    },
    createStateGroup: function () {
        return {
            runs: [],
            expirys: [],
            addRun: function (o) {
                this.runs.push(o);
            },
            addExpire: function () {
                this.expirys.push(o);
            }
        };
    },
    groupByYear: function (data, rcol, ecol) {
        var o = {};
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var ryear = this.getYear(row[rcol]);
            if (ryear < 1900)
                continue;
            if (!o[ryear])
                o[ryear] = this.createStateGroup();
            o[ryear].addRun(row);
            var eyear = this.getYear(row[ecol]);
            if (eyear >= ryear) {
                if (!o[eyear])
                    o[eyear] = this.createStateGroup();
                o[eyear].addExpire(row);
            }
        }
        var ret = [];
        for (var y in o) {
            ret.push([y, o[y]]);
        }
        ret.sort(function (i1, i2) { return i1 < i2 ? -1 : (i2 < i1 ? 1 : 0); });
        return {
            data: ret,
            getYearData: function (year) {
                var ret = [];
                for (var i = 0; i < this.data.length; i++) {
                    var d = this.data[i];
                    var y = d[0];
                    d = d[1];
                    if (y > year)
                        break;
                }
            }
        };
    },
    getCapGroupByYear: function (data, rcol, ecol, capcol) {
        var o = {};
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var ryear = this.getYear(row[rcol]);
            if (ryear < 1900)
                continue;
            var cap = Ysh.String.toFloat(row[capcol], 0);
            if (!o[ryear])
                o[ryear] = { r: 0, e: 0 };
            o[ryear].r += cap;
            var eyear = this.getYear(row[ecol]);
            if (eyear >= ryear) {
                if (!o[eyear])
                    o[eyear] = { r: 0, e: 0 };
                o[eyear].e += cap;
            }
        }
        var lst = [];
        for (var y in o) {
            lst.push([y, o[y]]);
        }
        lst.sort(function (i1, i2) { return i1 < i2 ? -1 : (i2 < i1 ? 1 : 0); });
        var ret = [];
        var r = 0, e = 0;
        var curYear = (new Date()).getFullYear();
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            var y = row[0];
            if (y < 1980)
                continue;
            if (y > curYear)
                break;
            var d = row[1];
            r += d.r;
            e += d.e;
            ret.push([y, parseInt(r - e, 10)]);//到这一年所有投运的，减去到上一年所有退运的
        }
        return ret;
    },
    getCapGroupByTime: function (data, rcol, ecol, capcol, fTime) {
        var o = {};
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var rtime = fTime(row[rcol]);
            if (!rtime)
                continue;
            var cap = Ysh.String.toFloat(row[capcol], 0);
            if (!o[rtime])
                o[rtime] = { r: 0, e: 0 };
            o[rtime].r += cap;
            var etime = fTime(row[ecol]);
            if (etime >= rtime) {
                if (!o[etime])
                    o[etime] = { r: 0, e: 0 };
                o[etime].e += cap;
            }
        }
        var lst = [];
        for (var y in o) {
            lst.push([y, o[y]]);
        }
        lst.sort(function (i1, i2) { i1 = i1[0]; i2 = i2[0]; return i1 < i2 ? -1 : (i2 < i1 ? 1 : 0); });
        var ret = [];
        var r = 0, e = 0;
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            var y = row[0];
            var d = row[1];
            r += d.r;
            e += d.e;
            ret.push([y, parseInt(r - e, 10)]);//到这一年所有投运的，减去到上一年所有退运的
        }
        return ret;
    }
}