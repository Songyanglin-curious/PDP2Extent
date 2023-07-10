/*v=1.19.1204.1*/
var SGCPart = {
    getWarnLevel: function (yd, load) {
        if (load <= 0)
            return 0;
        var p = yd / load;
        if (p < 0.05)
            return 3;
        if (p < 0.1)
            return 2;
        if (p < 0.2)
            return 1;
        return 0;
    },
    getLevelClr: function (v, clr) {
        switch (v) {//d92626     e4631c    e3a633
            case 1: return "#e3a633";//"#FFFF00";
            case 2: return "#e4631c";//"#d49a0f";
            case 3: return "#d92626";//"#FF0000";
            default: return "";
        }
    },
    getTime: function (s) {
        return Ysh.Time.add('ss', s, new Date(1970, 0, 1, 8, 0, 0));
    }, getTimeline: function (xtime, values) {
        return this.getTimelineF(xtime, values, function (v) {
            var clr = SGCPart.getLevelClr(v);
            return (clr !== "") ? { color: clr } : null;
        });
    },
    getTimelineF: function (xtime, values, f) {
        var data = [];
        var items = [];
        var data1 = [];
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            var item = f(v)
            data.push(item ? 0 : '-');
            data1.push(item ? '-': 0);
            items.push(item);
        }
        return {
            title: { show: false },
            legend: { show: false },
            tooltip: { show: false },
            xAxis: { type: 'category', data: xtime, axisTick: { show: true, inside: false, alignWithLabel: true } },
            yAxis: { show: false },
            series: [{
                data: data,
                type: 'effectScatter',
                rippleEffect: { period: 1, scale: 3.0 },
                symbolSize: 8,
                lineStyle: { opacity: 0 },
                itemStyle: {
                    color: function (params) {
                        var item = items[params.dataIndex];
                        return item ? item.color : "";
                    }
                }
            }, {
                    data: data1,
                    type: 'scatter',
                    symbolSize: 10,
                    lineStyle: { opacity: 0 },
                    itemStyle: { color: "white" }
                }]
        };
    },
    locate: function (name) {
        var ids = PDP.read("SGDISTRICT", "sgc/part:GetIdByName", [name.split("+").join(",")]);
        if (!ids.check("获取分区信息",true))
            return;
        ids = ids.value;
        var items = [];
        for (var i = 0; i < ids.length; i++) {
            items.push({ id: ids[i][0], data: {} });
        }
        ProjectSGC.Map.postMessage({
            locateType: 12,
            type: "partition",
            padding: [0, 0, 0, 0],
            locateItem: items
        });
    },
    showParts: function (ds) {
        var g = Ysh.Array.groupBy(ds, [0]);
        var data = [];
        for (var i = 0; i < g.length; i++) {
            var row = g[i];
            var id = row[0][0];
            var name = row[1][0];
            var maxLng = row[4][0];
            var maxLat = row[5][0];
            var minLng = row[6][0];
            var minLat = row[7][0];
            var cLng = row[8][0];
            var cLat = row[9][0];
            var color = row[10][0];
            var bd = [];
            for (var j = 0; j < row.data.length; j++) {
                var point = row.data[j];
                bd.push({ Latitude: point[3], Longitude: point[2] });
            }
            var d = {
                type: "partition", regionID: id, regionName: name, selstate:true
                , maxLng: maxLng, maxLat: maxLat, minLng: minLng, minLat: minLat
                , center: { longitude: cLng, latitude: cLat }
                , boundaryData: bd, colorCode: color, opacity: 1
            };
            data.push(d);
        }
        //[{ type: "partition", regionID: 1, regionName: "东龙分区", maxLng: 0, maxLat: 0, minLng: 0, minLat: 0, center: { longitude: 0, latitude: 0 }, boundaryData: [{ Latitude: 0, Longitude: 0 }], color: "#ffffff", opacity: 1 }, ...]        
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showPartitions",selstate:true, data: data });
    },
    setPartsColor: function (dsData, dsRegion,idxName,idxPMar,idxMaxLoadP) {
        function getIdByName(ds, name) {
            for (var i = 0; i < ds.length; i++) {
                var r = ds[i];
                if (r[1] == name)
                    return r[0];
            }
            return "";
        }
        function getIdsByName(ds, name) {
            var arr = name.split("+");
            var ret = [];
            for (var i = 0; i < arr.length; i++) {
                var id = getIdByName(ds, arr[i]);
                if (!id)
                    continue;
                ret.push(id);
            }
            return ret;
        }
        var arrRegionGroup = [[], [], [], []];
        for (var i = 0; i < dsData.length; i++) {
            var row = dsData[i];
            var name = row[idxName];
            var ids = getIdsByName(dsRegion, name);
            if (ids.length == 0)
                continue;
            var pmar = row[idxPMar];
            var maxloadP = row[idxMaxLoadP];
            var level = this.getWarnLevel(parseFloat(pmar), parseFloat(maxloadP));
            var g = arrRegionGroup[level];
            for (var j = 0; j < ids.length; j++)
                g.push(ids[j]);
            //arrRegionGroup[level].push({ type: "partition", regionID: ids, color: color, opacity: 1 });
        }
        var regiondata = [];
        for (var i = 0; i < arrRegionGroup.length; i++) {
            var g = arrRegionGroup[i];
            if (g.length == 0)
                continue;
            regiondata.push({ type: "partition", regionID: g, color: this.getLevelClr(i), opacity: 0.5 });
        }
        ProjectSGC.Map.postMessage({
            eventType: "menuope",
            menuname: "changeParitionsColor",
            data: regiondata
        });
    }
       ,findByCol : function (array2d, n, v) {
        for (var i = 0; i < array2d.length; i++) {
            var row = array2d[i];
            if (row[n] == v)
                return row;
        }
        return null;
    }
    , groupPartFuture: function (ds) {
        var groupdata = [];
        for (var i = 0; i < ds.length; i++) {
            var row = ds[i];
            var type = row[0];
            var name = row[1];
            for (var j = 2; j < 18; j++) {
                if (!groupdata[j - 2])
                    groupdata[j - 2] = [];
                var d2 = groupdata[j - 2];
                var d = this.findByCol(d2, 0, name);
                if (d == null) {
                    d = Ysh.Array.initN(6, "");
                    d[0] = name;
                    d2.push(d);
                }
                d[["FHYC", "ZDYD", "YD"].indexOf(type) + 1] = row[j];
            }
        }
        return groupdata;
    }
};