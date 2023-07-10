/*v=1.19.1117.1*/
var SGCMgd = {
    loadPrevMaxMgd: function (dt, pbflag, f) {
        PDP.read("MGD", "sgc/mgd:GetPrevDayMaxMgd", [dt, pbflag], function (ds) {
            if (!ds.isOK) {//不要弹错
                console.warn("获取昨日最大值失败：" + ds.errMsg);
                return;
            }
            var areas = ["全网", "雄安新区", "石家庄", "邯郸", "保定", "沧州", "邢台", "衡水"];
            f(SGCMgd.Array.reset2d(ds.value, areas, 0));
        });
    },
    loadCurves: function (jz, dt1, dt2, pbflag, f) {
        PDP.exec([{ type: 'read', db: 'MGD', sql: 'sgc/mgd:GetBaseData', args: [jz, pbflag] }
            , { type: 'read', db: 'MGD', sql: 'sgc/mgd:GetData', args: [dt1, pbflag] }
            , { type: 'read', db: 'MGD', sql: 'sgc/mgd:GetData', args: [dt2, pbflag] }],
            function (ds) {
                //if (!ds.check("获取煤改电数据", true))
                //    return;
                if (!ds.isOK) {//不要弹错
                    console.warn("获取日曲线失败：" + ds.errMsg);
                    return;
                }
                ds = ds.value;
                var areas = ["全网", "雄安新区", "石家庄", "邯郸", "保定", "沧州", "邢台", "衡水"];
                var curves = [];
                for (var i = 0; i < areas.length; i++) {
                    var area = areas[i];
                    var curve = ProjectSGC.Data.DateCurve.Hour.createArray([jz, dt1, dt2]);
                    curve.name = area;
                    curve.getName = function (row) { if (row[1] != this.name) return null; return row[0].split(' ')[0] + " 00:00:00"; };
                    curves.push(curve);
                }
                ProjectSGC.Data.DateCurve.Hour.fill(curves, ds[0], 2);
                ProjectSGC.Data.DateCurve.Hour.fill(curves, ds[1], 2);
                ProjectSGC.Data.DateCurve.Hour.fill(curves, ds[2], 2);

                var ff = function (v1, v0) {
                    var v = ProjectSGC.Data.DateCurve.getDiff(v1, v0);
                    if (!v) return v;
                    if (v < 0) return 0;
                    return v.toFixed(2);
                };
                for (var i = 0; i < curves.length; i++) {
                    ProjectSGC.Data.DateCurve.appendDiff(curves[i].data, 1, 2, ff);
                    ProjectSGC.Data.DateCurve.appendDiff(curves[i].data, 1, 3, ff);
                }
                f(curves);
            }
        );
    },
    loadStatistics: function (f) {
        PDP.exec([
            { type: 'read', db: 'MGD', sql: 'sgc/mgd:GetCNumberStat', args: [] },
            { type: 'read', db: 'MGD', sql: 'sgc/mgd:GetHNumberStat', args: [] },
            { type: 'read', db: 'MGD', sql: 'sgc/mgd:GetDwNumberStat', args: [] },
            { type: 'read', db: 'MGD', sql: 'sgc/mgd:GetPbStat', args: [] },
            { type: 'read', db: 'MGD', sql: 'sgc/mgd:GetPathStat', args: [] },
        ], function (ds) {
            if (!ds.isOK) {//不要弹错
                console.warn("获取柱状图数据失败：" + ds.errMsg);
                return;
            }
            ds = ds.value;
            var areas = ["雄安新区", "石家庄", "邯郸", "保定", "沧州", "邢台", "衡水"];
            var s0 = SGCMgd.Array.reset2d(ds[0], areas, 1);
            var s1 = SGCMgd.Array.reset2d(ds[1], areas, 1);
            var s2 = SGCMgd.Array.reset2d(ds[2], areas, 1);
            var s3 = SGCMgd.Array.reset2d(ds[3], areas, 1);
            var s4 = SGCMgd.Array.reset2d(ds[4], areas, 1);
            var s = SGCMgd.Array.combine2d(SGCMgd.Array.combine2d(SGCMgd.Array.combine2d(SGCMgd.Array.combine2d(s0, s1, 1), s2, 1), s3, 1), s4, 6);
            f(s);
        });
    },
    loadYearCurves: function (jz, dt2, f) {
        PDP.exec([{ type: 'read', db: 'MGD', sql: 'sgc/mgd:GetYearData', args: [jz, dt2] },
            { type: 'read', db: 'MGD', sql: 'sgc/mgd:GetYearDataQW', args: [jz, dt2] },],
            function (ds) {
                if (!ds.isOK) {//不要弹错
                    console.warn("获取年数据失败：" + ds.errMsg);
                    return;
                }
                var ds1 = ds.value[0];
                var ds2 = ds.value[1];
                var areas = ["全网", "雄安新区", "石家庄", "邯郸", "保定", "沧州", "邢台", "衡水"];
                var curves = [[], [], [], [], [], [], [], [],[]];
                for (var i = 0; i < ds1.length; i++) {
                        switch (ds1[i][1]) {
                            case "全网":
                                curves[0].push(ds1[i]);
                                break;
                            case "雄安新区":
                                curves[1].push(ds1[i]);
                                break;
                            case "石家庄":
                                curves[2].push(ds1[i]);
                                break;
                            case "邯郸":
                                curves[3].push(ds1[i]);
                                break;
                            case "保定":
                                curves[4].push(ds1[i]);
                                break;
                            case "沧州":
                                curves[5].push(ds1[i]);
                                break;
                            case "邢台":
                                curves[6].push(ds1[i]);
                                break;
                            case "衡水":
                                curves[7].push(ds1[i]);
                                break;
                        }
                }
                for (var i = 0; i < ds2.length; i++) {
                    curves[8].push(ds2[i]);
                }
                var maxLength = 0;
                var maxIndex = -1;
                for (var i = 0; i < curves.length; i++) {
                    if (curves[i].length > 0) {
                        maxLength = curves[i].length;
                        maxIndex = i;
                    }
                }
                if (maxIndex >= 0) {
                    for (var i = 0; i < curves.length; i++) {
                        if (curves[i].length == maxLength)
                            continue;
                        var arrMax = curves[maxIndex];
                        var arr = curves[i];
                        for (var m = 0; m < arrMax.length; m++) {
                            if (arrMax[m][0] == arr[m][0])
                                continue;
                            if (m >= arr.length) {
                                arr.push([arrMax[m][0], areas[i], "0", "0"]);
                                continue;
                            }
                            arr.splice(m, 0, [arrMax[m][0], areas[i], "0", "0"]);
                        }
                    }
                }
                f(curves);
            }
        );
    },
    colors: [
        ["#5BDF71", "#427E5A"],
        ["#d0d0d0", "#828282"],
        ["#53b8bc", "#01666a"],
        ["#59b268", "#396a41"]],
    getCurveSeries: function (name, clr1, clr2,data) {
        return {
            name: name,
            type: 'line', smooth: true,
            itemStyle: {
                normal: {
                    color: clr1,
                    "areaStyle": {
                        "color": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: clr1 }, { offset: 0.3, color: clr2 }, { offset: 1, color: "#072E4d" }]),
                    }
                }
            },
            data: data
        };
    },
    getOption: function (names, datalist, indexes) {
        var options = {
            legend: {
                show: true,
                right: '5%',
                itemGap: 30,
                itemWidth: 30,
                itemHeight: 20,
                textStyle: { color: 'rgba(202,202,202,1)', fontSize: 30 },
                data: [],
            },
            grid: { width: '84%', y2: '17%', x: '11%', y: '6%', borderWidth: 0, },
            tooltip: {
                trigger: 'axis',
                textStyle: { fontSize: 30 },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: ' rgba(73,73,73,1)',
                        width: 2,
                        type: 'solid'
                    }
                },
                formatter: function (params) {
                    var str = params[0].name;
                    for (var i = 0; i < params.length; i++)
                        str += "<br/>" + params[i].seriesName + ":" + params[i].value;
                    return str;
                },
            },
            calculable: true,
            xAxis: [
                {
                    splitLine: { show: false }, splitArea: { show: false },
                    type: 'category',
                    boundaryGap: false,
                    axisLine: { show: true, lineStyle: { color: '#58ccff', } },
                    axisTick: { show: false },
                    axisLabel: { interval: 1, margin: 10, textStyle: { color: '#58ccff', fontSize: 32 } },
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                }
            ],
            yAxis: [
                {
                    scale: false,
                    boundaryGap: [0, 0.1],
                    splitLine: { show: true, lineStyle: { color: 'rgba(170,170,170,0.3)' } },
                    splitArea: { show: false },
                    type: 'value',
                    axisLabel: { margin: 10, textStyle: { color: '#58ccff', fontSize: 32 } },
                    axisLine: { show: true, lineStyle: { color: '#58ccff', } },
                }
            ],
            series: [
                {
                    name: '差值',
                    type: 'line', smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#5BDF71',
                            "areaStyle": {
                                "color": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: '#5BDF71'
                                }, {
                                    offset: 0.3, color: '#427E5A'
                                }, {
                                    offset: 1, color: '#072E4d'
                                }]
                                ),
                            }
                        }
                    },
                    data: [110, 120, 110, 100, 90, 80, 70, 60, 10, 20, 30]
                },
                {
                    name: '分析日期2',
                    type: 'line', smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#d0d0d0',
                            "areaStyle": {
                                "color": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: '#d0d0d0'
                                }, {
                                    offset: 0.3, color: '#828282'
                                }, {
                                    offset: 1, color: '#072E4d'
                                }]
                                ),
                            }
                        }
                    },
                    data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
                },
                {
                    name: '分析日期1',
                    type: 'line', smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#53b8bc',
                            "areaStyle": {
                                "color": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: '#53b8bc'
                                }, {
                                    offset: 0.3, color: '#01666a'
                                }, {
                                    offset: 1, color: '#072E4d'
                                }]
                                ),
                            }
                        }
                    },
                    data: [110, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
                },
                {
                    name: '基准日期',
                    type: 'line', smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#59b268',
                            "areaStyle": {
                                "color": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: '#59b268'
                                }, {
                                    offset: 0.3, color: '#396a41'
                                }, {
                                    offset: 1, color: '#072E4d'
                                }]
                                ),
                            }
                        }
                    },
                    data: [110, 120, 110, 100, 90, 80, 70, 60, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 50, 40, 30, 20, 10]
                }
            ]
        };
        var series = [];
        for (var i = 0; i < indexes.length; i++) {
            var idx = indexes[i];
            var name = names[i];
            options.legend.data.push({ "name": name, "icon": "rect" });
            var clrs = this.colors[i];
            series.push(this.getCurveSeries(name, clrs[0], clrs[1], Ysh.Array.to1d(datalist, idx)));
        }
        options.series = series;
        return options;
    },
    getOption2: function (datalist, indexes) {
        var options = this.getOption(["负荷"], datalist, indexes);
        options.legend.show = false; 
        options.xAxis[0].axisLabel.formatter = function (v) {
            var arr = v.split('-');
            return arr[arr.length - 2] + "-" + arr[arr.length - 1];
        };
        options.xAxis[0].axisLabel.interval = Math.ceil(datalist.length / 7) - 1;
        return options;
    },
    getLast: function (array2d, idx) {
        for (var i = array2d.length - 1; i >= 0; i--) {
            var row = array2d[i];
            var v = row[idx];
            if (!v) {
                if (v === 0)
                    return v;
                continue;
            }
            return v;
        }
    },
    Array: {
        reset2d: function (array2d, array1d,cols) {
            var ret = [];
            var idx = 0;
            for (var i = 0; i < array1d.length; i++) {
                var v = array1d[i];
                var row = null;
                for (var j = 0; j < array2d.length; j++) {
                    if (array2d[j][idx] == v) {
                        row = array2d[j];
                        break;
                    }
                }
                if (!row) {
                    row = Ysh.Array.initN(cols + 1, "");
                    row[idx] = v;
                }
                ret.push(row);
            }
            return ret;
        },
        combine2d: function (array1, array2, cols) {
            var ret = [];
            var idx1 = 0;
            var idx2 = 0;
            for (var i = 0; i < array1.length; i++) {
                var row = Ysh.Object.clone(array1[i]);
                var v = row[idx1];
                var append = false;
                for (var j = 0; j < array2.length; j++) {
                    var row2 = array2[j];
                    if (row2[idx2] == v) {
                        append = true;
                        for (var k = 0; k < cols + 1; k++) {
                            if (k == idx2)
                                continue;
                            row.push(row2[k]);
                        }
                        break;
                    }
                }
                if (!append) {
                    for (var k = 0; k < cols; k++)
                        row.push("");
                }
                ret.push(row);
            }
            return ret;
        },
        sum: function (array2d, cols) {
            var ret = Ysh.Array.initN(cols, 0);
            for (var i = 0; i < array2d.length; i++) {
                var row = array2d[i];
                for (var j = 0; j < cols; j++) {
                    var v = row[j + 1];
                    if (!v)
                        continue;
                    ret[j] += parseInt(v);
                }
            }
            return ret;
        }
    }
}