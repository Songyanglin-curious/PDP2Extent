/*v=1.21.1112.1*/
var ProjectLocal = {
    isDebug: true,
    debug: function (f) {
        if (!this.isDebug)
            return;
        f();
    },
    setDebugData: function (v, f) {
        if (!this.isDebug)
            return;
        f(v);
    },
    setDebugTime: function (timestr, f) {
        if (!this.isDebug)
            return;
        f(timestr ? new Date(Ysh.Time.parseDate(timestr)) : new Date());
    },
    year: function (timeformat, debugyear) {
        if (this.isDebug && debugyear) return debugyear;
        return { _type_: "y", value: timeformat }
    },
    time: function (timeformat, debugtime) {
        if (this.isDebug && debugtime) return debugtime;
        return { _type_: "t", value: timeformat }
    },
    getRealArgValue: function (args, v) {
        switch (v._type_) {
            case "y":
                return Ysh.Time.getTime(v.value).getFullYear();
            case 't':
                return Ysh.Time.getTime(v.value)
            default:
                return v;
        }
    },
    changeReadItemArgs: function (args) {
        if (!args) return args;
        var newArgs = [];
        for (var i = 0; i < args.length; i++) {
            var v = args[i];
            if (v instanceof Object) {
                newArgs.push(this.getRealArgValue(args, v));
            } else {
                newArgs.push(v);
            }
        }
        return newArgs;
    },
    changeReadArgs: function (args) {
        var newArgs = [];
        for (var i = 0; i < args.length; i++) {
            var newArg = Ysh.Object.clone(args[i]);
            newArg.args = this.changeReadItemArgs(newArg.args);
            newArgs.push(newArg);
        }
        return newArgs;
    },
    read: function (name, args, callback, loop) {
        console.log("获取 " + name + " 数据开始：");
        if (this.isDebug) loop = 0;
        PDP.exec(this.changeReadArgs(args), function (data) {
            try {
                if (data.isOK)
                    callback(data.value);
                else {
                    console.log("获取" + name + "数据失败:" + data.errMsg);
                }
            } catch (E) {
            }
            if (loop) {
                window.setTimeout(function () { ProjectLocal.read(name, args, callback, loop); }, loop);
            }
        });
    },
    url0: "/conn/ashx/GetData.ashx?url=http://10.10.12.216:8081/getdata&",
    url: "http://10.15.5.100:6114/getdata?",
    read1Item: function (args, n, results, callback, callbackFail) {
        if (n == args.length) {
            callback(results);
            return;
        }
        var arg = args[n];
        var url = this.url + "conn=" + (arg.db || "") + "&xml=" + arg.sql + "&args=" + (arg.args || []).join(",");
        $.ajax({
            url: url,
            dataType: "json",
            type: "get",
            data: {},
            success: function (data) {
                if (data[0] === true) {
                    results.push(data[1]);
                } else {
                    console.log(data[1]);
                    if (arg.def)
                        results.push(arg.def);
                    else {
                        callbackFail();
                        return;
                    }
                }
                ProjectLocal.read1Item(args, n + 1, results, callback);
            },
            error: function (data) {
                console.log(data.responseText);
                if (arg.def) {
                    results.push(arg.def);
                    ProjectLocal.read1Item(args, n + 1, results, callback);
                }
                callbackFail();
            }
        });
    },
    read1: function (name, args, callback, callbackFail, loop) {
        console.log("获取 " + name + " 数据开始：");
        if (this.isDebug) loop = 0;
        var results = [];
        if (!callbackFail) callbackFail = function () { }
        this.read1Item(args, 0, results, callback, callbackFail);
    },
    loop: function (f, ms) {
        try {
            f();
        } catch (E) {
        }
        if (!this.isDebug)
            window.setTimeout(function () { ProjectLocal.loop(f, ms); }, ms);
    },
    getYearData: function (o, data, options) {
        var yearCol = options.yearCol;
        var f = options.fData;
        var min = options.min || 9999, max = options.max || 0;
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var year = parseInt(row[yearCol], 10);
            if (min > year) min = year;
            if (max < year) max = year;
            o[year] = f(o[year], row);
        }
        options.min = min;
        options.max = max;
    },
    getMonthString: function (y, m) {
        return y + "年" + ((m < 10) ? "0" : "") + m + "月";
    },
    getMonthData: function (months, o, data, options) {
        var yearCol = options.yearCol;
        var monthCol = options.monthCol;
        var f = options.fData;
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var year = parseInt(row[yearCol], 10);
            var month = parseInt(row[monthCol], 10);
            var str = this.getMonthString(year, month);
            var item = f(o[str], row);
            item.y = year;
            item.m = month;
            o[str] = item;
            months.addSkipSame(str);
        }
    },
    toYearArray: function (o, options, f) {
        var min = options.min;
        var max = options.max;
        var years = [];
        var values = [];
        for (var i = min; i <= max; i++) {
            years.push(i);
            var d = o[i];
            if (f) d = f(d, o[i - 1]);
            values.push(d);
        }
        return [years, values];
    },
    yearTypeData: function (data, options) {
        //options : typeCol,yearCol,valueCol,types,fillEmpty
        var yearCol = options.yearCol;
        var typeCol = options.typeCol;
        var valueCol = options.valueCol;
        var types = [];
        var o = {};
        var min = 9999, max = 0;
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var type = row[typeCol];
            var year = parseInt(row[yearCol], 10);
            var value = row[valueCol];
            if (min > year) min = year;
            if (max < year) max = year;
            o[type + "_" + year] = value;
        }
        types = options.types || types;
        var years = [];
        var values = [];
        for (var i = min; i <= max; i++) {
            years.push(i);
            var row = [];
            for (var j = 0; j < types.length; j++) {
                var v = o[types[j] + "_" + i];
                if (typeof v == "undefined") {
                    if (options.fillEmpty == "last") {
                        if (values.length > 0)
                            v = values[values.length - 1][j];
                    } else {
                        v = options.fillEmpty;
                    }
                }
                row.push(v);
            }
            values.push(row);
        }
        return [years, values];
    },
    yearOnlyAdd: function (values, n) {
        var newValues = [];
        if (values.length > 0) {
            newValues.push(values[0]);
            for (var i = 1; i < values.length; i++) {
                var newRow = [];
                var row = values[i];
                var rowPrev = values[i - 1];
                for (var j = 0; j < n; j++) {
                    newRow.push(parseFloat(row[j]) - parseFloat(rowPrev[j]));
                }
                newValues.push(newRow);
            }
        }
        return newValues;
    },
    partYears: function (years, values, s, e) {
        var newYears = [];
        var newValues = [];
        e = e || years[years.length - 1];
        var idx = years.indexOf(s);
        for (var i = s; i <= e; i++, idx++) {
            newYears.push(i);
            newValues.push(values[idx]);
        }
        return [newYears, newValues];
    },
    sumYear: function (values, idxGroups, f) {
        for (var r = 0; r < values.length; r++) {
            var row = values[r];
            for (var i = 0; i < idxGroups.length; i++) {
                var idxs = idxGroups[i];
                var v = 0;
                for (var j = 0; j < idxs.length; j++)
                    v += parseFloat(row[idxs[j]]);
                row.push(f ? f(v) : v);
            }
        }
    },
    getCurveData: function (tmStart, tmEnd, data, f) {
        var ret = [];
        for (var i = 0; i < 1440; i++)
            ret.push("");
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var tm = Ysh.Time.getTimeStart(new Date(Ysh.Time.parseDate(row[0])), "h");
            var idx = Ysh.Time.diff('mi', tmStart, tm);
            for (var j = 0; j < 60; j++) {
                var v = row[j + 1];
                if (f) v = f(v);
                ret[idx + j] = v;
            }
        }
        return ret;
    },
    getCurveDataEx: function (count, data, idxStart, f) {
        var ret = [];
        var row = [];
        if (data && data.length > 0) row = data[0];
        else row = Ysh.Array.initN(count + idxStart, "");
        for (var i = 0; i < count; i++) {
            var v = row[i + idxStart];
            if (f) v = f(v);
            ret.push(v);
        }
        return ret;
    },
    getGenType: function (gen) {
        var arrMgs = [];
        var arrRq = []
        if (arrMgs.indexOf(gen) >= 0)
            return 1;
        if (arrRq.indexOf(gen) >= 0)
            return 2;
        return 0;
    },
    getGenCeo: function (gen, cap) {
        var type = this.getGenType(name);
        switch (type) {
            case 1://煤矸石
                return 1.146;
            case 2://燃气
                return 0.392;
            default://燃煤
                if (cap >= 300)
                    return 0.877;
                return 0.979;
        }
    },
    getCarbonQd: function (c, p) {
        return Ysh.Number.toFixed(c / p, 4);
    },
    setOptionTooltip: function (option) {
        option.tooltip = {
            show: true,
            trigger: 'axis',
            formatter: function (params) {
                var str = "<div><p>" + params[0].name + "</p></div>";
                for (var i = 0; i < params.length; i++) {
                    var p = params[i];
                    var s = option.series[p.seriesIndex];
                    var unit = option.yAxis[s.yAxisIndex || 0].name
                    str += p.marker + " " + p.seriesName + " : " + p.data + unit + "<br />"
                }
                return str;
            }
        }
        option.dataZoom = [{ type: 'inside' }];
        return option;
    },
    getMax: function (lst, col) {
        var rMax = null;
        var vMax = 0;
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            var v = row[col];
            if (v === "") continue;
            v = parseFloat(v);
            if (!rMax) {
                rMax = row;
                vMax = v;
                continue;
            }
            if (v > vMax) {
                rMax = row;
                vMax = v;
            }
        }
        return rMax;
    },
    getMin: function (lst, col) {
        var rMin = null;
        var vMin = 0;
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            var v = row[col];
            if (v === "") continue;
            v = parseFloat(v);
            if (!rMin) {
                rMin = row;
                vMin = v;
                continue;
            }
            if (v < vMin) {
                rMin = row;
                vMin = v;
            }
        }
        return rMin;
    },
    textToArray: function (d) {
        d = d.split("\n");
        var data = [];
        for (var j = 0; j < d.length; j++) {
            data.push(d[j].split(','));
        }
        return data;
    },
    getLastValidInfo: function (meas) {
        for (var r = meas.length - 1; r >= 0; r--) {
            var row = meas[r];
            for (var c = 60; c > 0 ; c--) {
                var v = row[c];
                if (v === "")
                    continue;
                return [v, row[0], c - 1];
            }
        }
        return ["", "", ""];
    },
    getLastValid: function (data) {
        if (!data) return "";
        for (var i = data.length - 1; i >= 0 ; i--) {
            var v = data[i];
            if (v === "")
                continue;
            return v;
        }
        return "";
    },
    Array: {
        sumCol: function (ds, vcol, fMeet) {
            var v = 0;
            for (var i = 0; i < ds.length; i++) {
                var row = ds[i];
                if (fMeet)
                    if (!fMeet(row))
                        continue;
                var vv = row[vcol];
                if (vv)
                    v += parseFloat(row[vcol]);
            }
            return v;
        },
        toDict: function (array2d, field) {
            var o = {};
            field = field || 0;
            for (var i = 0; i < array2d.length; i++) {
                var row = array2d[i];
                var key = row[field];
                o[key] = row;
            }
            return o;
        }
    },
    Meas: {
        add: function (v1, v2) {
            if (v1 === "") return v2;
            if (v2 === "") return v1;
            return parseFloat(v1) + parseFloat(v2);
        }
    },
    Curve: {
        getLimit: function (curve, f) {
            var vLimit = "";
            var vTime = "";
            var vIndex = 0;
            for (var i = 0; i < curve.length; i++) {
                var row = curve[i];
                for (var j = 1; j < 61; j++) {
                    var v = row[j];
                    if (v === "") continue;
                    v = parseFloat(v);
                    if ((vLimit === "") || f(vLimit, v)) { vLimit = v; vTime = row[0]; vIndex = j - 1; }
                }
            }
            if (vLimit === "") return ["", "", "", ""];
            if (vIndex == 0) return [vLimit, vTime, vTime, vIndex];
            return [vLimit, Ysh.Time.add('mi', vIndex, new Date(Ysh.Time.parseDate(vTime))), vTime, vIndex];
        },
        getLast: function (curve) { return ProjectLocal.getLastValid(curve); },
        add: function (curves, start, end) {
            if (curves.length == 0) return [];
            var firstCurve = curves[0];
            if (curves.length == 1) return firstCurve;
            start = start || 0;
            end = end || firstCurve.length - 1;
            var ret = Ysh.Object.clone(curves[0]);
            for (var c = 1; c < curves.length; c++) {
                var curve = curves[c];
                for (var i = start; i <= end; i++) {
                    var v = curve[i];
                    ret[i] = ProjectLocal.Meas.add(v, ret[i]);
                }
            }
            return ret;
        },
        getDayPowerOption: function (data, minutes) {//data格式，name,data,color,color1,color2
            minutes = minutes || 1;
            var points = 120 / minutes;
            var legends = [];
            var series = [];
            var colors = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var name = item[0];
                var color = item[2];
                var color1 = item[3];
                var color2 = item[4];
                var areaStyle;
                if (color1 && color2)
                    areaStyle = {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [{ offset: 0, color: color1 }, { offset: 1, color: color2 }]),
                    }
                legends.push(name);
                series.push({
                    name: name,
                    smooth: true,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            areaStyle: areaStyle,
                            lineStyle: {  //线的颜色
                                color: color,
                                width: 3
                            },
                        },
                    },
                    markLine: {},
                    data: item[1],
                    type: 'line',
                });
                colors.push(color);
            }
            var xtimes = this.getTimeLabels(minutes);
            var option = {
                grid: { top: 32, left: 60, right: 0, bottom: 25 },
                yAxis: [
                  {
                      name: UNIT.GONGLV,
                      nameLocation: "end",
                      type: 'value',
                      scale: true,
                      axisLabel: { show: true, showMaxLabel: true, },
                      axisTick: { show: false },
                      splitLine: { show: true, lineStyle: { type: "dashed", color: "#4ad1fb", } },
                      axisLine: { symbol: ["none"], lineStyle: { color: "#4ad1fb" }, },
                  }
                ],
                xAxis: {
                    name: '',
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#4ad1fb"//"#827258"
                        }
                    },
                    axisLabel: {
                        show: true,
                        interval: points - 1,
                        formatter: function (value, index) {
                            if (index % points != 0) return "";
                            return parseInt(value.split(":")[0], 10);
                        },
                        color: "#76c1d1",//"#827258",
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 12,
                    },
                    data: xtimes
                },
                color: colors,//['#2FB1EA', '#A38C4E'],
                legend: {
                    data: legends,
                    textStyle: {
                        color: '#c6f6fc',
                        fontSize: 14
                    },
                    icon: 'roundRect',
                },
                series: series
            }
            return ProjectLocal.setOptionTooltip(option);
        },
        getDayPowerOptionaj: function (data, minutes) {//data格式，name,data,color,color1,color2
            minutes = minutes || 1;
            var points = 120 / minutes;
            var legends = [];
            var series = [];
            var colors = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var name = item[0];
                var color = item[2];
                var color1 = item[3];
                var color2 = item[4];
                var areaStyle;
                if (color1 && color2)
                    areaStyle = {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [{ offset: 0, color: color1 }, { offset: 1, color: color2 }]),
                    }
                legends.push(name);
                series.push({
                    name: name,
                    smooth: true,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            areaStyle: areaStyle,
                            lineStyle: {  //线的颜色
                                color: color,
                                width: 3
                            },
                        },
                    },
                    markLine: {},
                    data: item[1],
                    type: 'line',
                });
                colors.push(color);
            }
            var xtimes = this.getTimeLabels(minutes);
            var option = {
                grid: { top: 28, left: 50, right: 0, bottom: 18 },
                yAxis: [
                  {
                      name: UNIT.GONGLV,
                      nameLocation: "end",
                      nameTextStyle: {
                        padding: [0, 30, 0, 0]
                      },
                      type: 'value',
                      scale: true,
                      axisLabel: { show: true, showMaxLabel: true, },
                      axisTick: { show: false },
                      splitLine: { show: true, lineStyle: { type: "dashed", color: "#4ad1fb", } },
                      axisLine: { symbol: ["none"], lineStyle: { color: "#4ad1fb" }, },
                  }
                ],
                xAxis: {
                    name: '',
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#4ad1fb"//"#827258"
                        }
                    },
                    axisLabel: {
                        show: true,
                        interval: points - 1,
                        formatter: function (value, index) {
                            if (index % points != 0) return "";
                            return parseInt(value.split(":")[0], 10);
                        },
                        color: "#76c1d1",//"#827258",
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 10,
                    },
                    data: xtimes
                },
                color: colors,//['#2FB1EA', '#A38C4E'],
                legend: {
                    data: legends,
                    textStyle: {
                        color: '#c6f6fc',
                        fontSize: 10
                    },
                    itemHeight: 4,
                    itemWidth: 10,
                    icon: 'roundRect',
                },
                series: series
            }
            return ProjectLocal.setOptionTooltip(option);
        },
        draw: function (echart, data, minutes) {
            echart.setOption(this.getDayPowerOption(data, minutes), true);
        },
        getTimeLabels: function (minutes) {
            var xtimes = [];
            for (var h = 0; h < 24; h++) {
                for (var m = 0; m < 60; m += minutes)
                    xtimes.push(((h < 10) ? "0" : "") + h + ":" + ((m < 10) ? "0" : "") + m);
            }
            return xtimes;
        },

    },
}

var V = {
    tp: function (v) { if (!v) return v; return Ysh.Number.toFixed(v / 100000000.0, 4); },
    qd: function (c, p) { if (!p) return ""; return Ysh.Number.toFixed(c / p, 4); },
    dl: function (v) { if (!v) return v; return parseInt(parseFloat(v) + 0.5, 10); },
    cap: function (v) { if (!v) return v; return parseInt(parseFloat(v) + 0.5, 10); },
    //dl: function (v) { if (!v) return v; return parseInt(v / 100000.0 + 0.5); },
    zzl: function (v1, v2) { if (!v2) return ""; return Ysh.Number.toFixed((v1 - v2) * 100.0 / v2, 2); },
    bl: function (v1, v2) { if (!v2) return ""; return Ysh.Number.toFixed(v1 * 100.0 / v2, 2); },
    percent: function (v) { if (v === "") return v; return Ysh.Number.toFixed(v * 100, 2) + "%"; }
}

var CLR = {
    HUO: "#d04626", SHUI: "#1bdba0", FENG: "#ba42f3", GUANG: "#edc127", QJNY: "#00ffff", ZDL: "#667fff", TPF: "#a5e2fe",
    AXIS: "#fcecc9"
}

var FONT = {
    LEGEND_SIZE2: 16
}

var UNIT = {
    DIANLIANG: "万千瓦时", GONGLV: "兆瓦", TPF: "亿tCO₂", TPFQD: "tCO₂/MWh"
}

