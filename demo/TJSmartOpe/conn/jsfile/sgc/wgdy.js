var SGC = {
    FONTSIZE:16
};
var SGCWGDY = {
    colors: ["#FF0000", "#FF507B", "#FF823C", "#FF893C", "#FFFF3C", "#9AFF3C", "#00FFDE", "#00DEFF", "#4DB4FF", "#4D91FF", "#4D4DFF", "#9132FF"],
    border35: [40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30],
    border110: [120, 119, 117, 115, 114, 113, 112, 111, 110, 107, 100],
    border220: [240, 238, 234, 230, 228, 226, 224, 222, 220, 215, 200],
    border500: [550, 538, 534, 530, 528, 526, 524, 522, 520, 515, 500],
    border: {
        "35kV": [40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30],
        "110kV": [120, 119, 117, 115, 114, 113, 112, 111, 110, 107, 100],
        "220kV": [240, 238, 234, 230, 228, 226, 224, 222, 220, 215, 200],
        "500kV": [550, 538, 534, 530, 528, 526, 524, 522, 520, 515, 500]
    },
    vols: null,
    data: null,
    displayVoltages: function (show) {
        if (!show) {
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: false });
            return;
        }
        addNoQuestionHTML("<a target='_blank' href='http://graph.dcloud.sd.dc.sgcc.com.cn/osp/wgdyzhfx/VoltageAnalysis.html' style='color:blue;text-decoration:underline;'>打开无功详情</a>");
        var exes = [
            { type: 'read', db: 'SGC', sql: 'sgc/wgdy:GetRecentTime', args: [] }
            , { type: 'read', db: 'SGC', sql: 'sgc/wgdy:GetVoltageValues', args: [{ ref: 0, value: 0 }] }
        ];
        var data = PDP.exec(exes);
        if (!data.check("获取电压数据", true))
            return;
        data = data.value[1];
        var msg = [];
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var stavol = row[0];
            var staid = row[1];
            var v = row[2];
            var lon = row[3];
            var lat = row[4];
            var m = {
                stationid: "0" + staid, longitude: lon, latitude: lat, glowColor: this.getVoltageColor(stavol, v), data: { value: v }
            };
            msg.push(m);
        }
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: true, data: msg });
        //{ eventType: "menuope", menuname: "showGlowColor", data: [{ stationid: "1", glowColor: 0xff0000, data: {} }, ...] }
    },
    getVoltageMsg: function (stavol, staid, v) {
        return {
            stationid: "0" + staid, glowColor: this.getVoltageColor(stavol, v), data: { value: v }
        };
    },
    getVoltageColor: function (stavol, v) {
        if (!stavol) return "";
        stavol = stavol.toString();
        if (!stavol.endsWith("V")) stavol += "kV";
        if (this.vols) {
            if (this.vols.indexOf(stavol) < 0)
                return "";
        }
        var arr = null;
        arr = this.border[stavol];
        if (arr == null)
            return "";
        v = parseInt(v, 10);
        for (var i = 0; i < arr.length; i++) {
            if (v > arr[i])
                return this.colors[i];
        }
        return this.colors[arr.length];
    },
    getRongKangOption: function () {
        var option = {
            "title": { "show": false, "text": "容抗器容量", "textStyle": { "fontSize": 14 } },
            "legend": { "show": false, "selectedMode": false, "data": [{ "name": "电容器(F)" }, { "name": "电抗器(F)" }, { "name": "电容标准值" }, { "name": "电抗标准值" }], "left": "0", "top": "48", "orient": "vertical", "itemGap": 40, "itemWidth": 0 },
            "tooltip": { "trigger": "axis", "formatter": "电容器：{c0}<br/>电抗器：{c1}" },
            "grid": { "left": "60", "top": "20", "right": "40", "bottom": "20" },
            "xAxis": [{ "name": "时", "nameGap": "5", "type": "category", "scale": true, "axisLine": { "lineStyle": { "color": "#cccccc" } }, "axisLabel": { "color": "#000000" }, "axisTick": { "show": false }, "axisLabel": { "show": false } }],
            "yAxis": [{ "show": true, "nameLocation": "end", "type": "value", "axisTick": { "show": false }, "axisLine": { "show": false } }],
            "series": [{ "name": "电容器(F)", "type": "bar", "itemStyle": { "color": "rgba(45,140,240,1)" }, "z": "3" },
            { "name": "电抗器(F)", "type": "bar", "itemStyle": { "color": "rgba(237,64,20,1)" }, "z": "3" },
            { "name": "电容标准值", "type": "bar", "itemStyle": { "color": "rgba(222,222,222,1)" }, "barGap": "-100%" },
            { "name": "电抗标准值", "type": "bar", "itemStyle": { "color": "rgba(222,222,222,1)" }, "barGap": "-100%" },
            { "name": "电容标准值（隐藏）", "type": "bar", "itemStyle": { "color": "rgba(222,222,222,0)" }, "barGap": "-100%" },
            { "name": "电抗标准值（隐藏）", "type": "bar", "itemStyle": { "color": "rgba(222,222,222,0)" }, "barGap": "-100%" }]
        }
        return option;
    },
    setAxis: function (axis) {
        if (!axis)
            return;
        if (axis instanceof Array) {
            for (var i = 0; i < axis.length; i++) {
                this.setAxis(axis[i]);
            }
            return;
        }
        axis.axisLabel = { show: true, textStyle: { color: '#9e9e9e', "fontSize": SGC.FONTSIZE * 0.8 } };
        axis.nameTextStyle = axis.axisLabel.textStyle;
    },
    getTop5Option: function () {
        var option = {
            "grid": {
                "left": "20%",
                "right": "15%"
            },
            "xAxis": [{
                "type": "value",
                "splitNumber": "5",
                "axisTick": {
                    "length": "10"
                },
                "splitLine": {
                    "show": false
                },
                "name": "MW"
            }],
            "yAxis": [{
                "splitLine": {
                    "show": false
                },
                "axisLine": {
                    "show": false
                },
                "axisTick": {
                    "show": false
                },
                "type": "category"
            }],
            "series": [{
                "name": "电厂",
                "type": "bar",
                "barWidth": SGC.FONTSIZE * 0.6,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#C34145'
                    }, {
                        offset: 0.5,
                        color: '#DA5256'
                    }, {
                        offset: 1,
                        color: '#F5676B'
                    }]),
                    barBorderRadius: [SGC.FONTSIZE / 4, SGC.FONTSIZE / 4, SGC.FONTSIZE / 4, SGC.FONTSIZE / 4]
                },
                "label": {
                    "show": "true",
                    "color": "#F5676B",
                    "fontSize": SGC.FONTSIZE,
                    "fontWeight": "bold",
                    "position": "insideBottomRight",
                    "distance": -SGC.FONTSIZE
                }
            }]
        };

        if (option.dataZoom) {
            option.dataZoom = { fillerColor: "rgba(167,183,204,0.2)", textStyle: { color: "#9e9e9e" }, top: 'bottom', bottom: -SGC.FONTSIZE, handleSize: "50%", handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z' };
        }
        if (option.legend) {
            option.legend.textStyle = { "fontSize": SGC.FONTSIZE * 0.8, "color": "#9e9e9e" };
            option.legend.itemWidth = SGC.FONTSIZE;
            option.legend.itemHeight = SGC.FONTSIZE * 0.5;
            option.legend.data = [];
            for (var i = 0; i < option.series.length; i++) {
                option.legend.data.push({ icon: "roundRect", name: option.series[i].name });
            }
        }
        if (option.xAxis) {
            this.setAxis(option.xAxis);
        }
        if (option.yAxis) {
            this.setAxis(option.yAxis);
        }

        return option;
    }
    , test: function () {
        this.all = SGC.getData();
        this.selectKey = this.all.chart4.selectCode;
        this.const0 = [{
            type: 0,
            text: "电厂装机容量"
        }, {
            type: 1,
            text: "机组装机容量"
        }];
        this.selectedType = 0;
        this.selectedPlant = -1;
        this.const17 = [];
        //../i/sgc/huo_sel.png,火电,#F6676B,1,2rem,1
        for (var i = 0; i < this.typelist.length; i++) {
            var key = this.typelist[i];
            var t = SGC.getPlantType(key);
            this.const17.push(["../i/sgc/" + t.icon + ".png", t.alias, t.color, 1, "1.5rem", 1]);
        }
        this.alltypeidx = ["1001", "1002", "1003", "1006", "1004", "1005"]
        this.alltype = {
            "1001": "火电厂",
            "1002": "水电厂",
            "1003": "核电站",
            "1006": "抽蓄电站",
            "1004": "风电场",
            "1005": "光伏电站"
        };
        this.cap = "国家电网" + this.alltype[this.alltypeidx[0]] + "装机容量TOP5";
        this.echart55_option = {
            "grid": {
                "left": "20%",
                "right": "15%"
            },
            "xAxis": [{
                "type": "value",
                "splitNumber": "5",
                "axisTick": {
                    "length": "10"
                },
                "splitLine": {
                    "show": false
                },
                "name": "MW"
            }],
            "yAxis": [{
                "splitLine": {
                    "show": false
                },
                "axisLine": {
                    "show": false
                },
                "axisTick": {
                    "show": false
                },
                "type": "category"
            }],
            "series": [{
                "name": "电厂",
                "type": "bar",
                "barWidth": SGC.FONTSIZE * 0.6,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#C34145'
                    }, {
                        offset: 0.5,
                        color: '#DA5256'
                    }, {
                        offset: 1,
                        color: '#F5676B'
                    }]),
                    barBorderRadius: [SGC.FONTSIZE / 4, SGC.FONTSIZE / 4, SGC.FONTSIZE / 4, SGC.FONTSIZE / 4]
                },
                "label": {
                    "show": "true",
                    "color": "#F5676B",
                    "fontSize": SGC.FONTSIZE,
                    "fontWeight": "bold",
                    "position": "insideBottomRight",
                    "distance": -SGC.FONTSIZE
                }
            }]
        };

        SGC.setChartOption(this.echart55_option);
        var l = 4;
        this.echart55_option.yAxis[0].axisLabel.formatter = function (val) {
            var v = "";
            for (var i = 0; i < val.length; i += l) {
                v += val.substr(i, l) + "\n";
            }
            return v;
        }
        this.echart55_option.yAxis[0].axisLabel.margin = SGC.FONTSIZE * l;
        this.echart55_option.yAxis[0].axisLabel.textStyle.align = "left";
        this.echart55_option.yAxis[0].axisLabel.textStyle.baseline = "middle";

        this.showData = function () {
            var key = this.typelist[this.selectedPlant];
            if ((key == this.selectKey) && (this.selectedType == "0")) {
                //if (true) {
                var dataPlatCap = this.all.chart4.dataPlatCap;
                var data = dataPlatCap.data;
                var xData = dataPlatCap.xData;
                var allData = [];
                for (var i = 0; i < data[0].length; i++) {
                    allData.push([data[0][i].value, xData[i]]);
                }
                allData.sort(function (a, b) {
                    return a[0] - b[0];
                });
                data = [];
                xData = [];
                for (var i = 0; i < allData.length; i++) {
                    data.push(allData[i][0]);
                    xData.push(allData[i][1]);
                }
                this.const38 = data;
                this.const39 = xData;
            } else {
                this.const38 = [];
                this.const39 = [];
            }
            this.echart55_series[0]["barWidth"] = "10px";
            if (!this.echart55_series[0]["itemStyle"])
                this.echart55_series[0]["itemStyle"] = {};
            this.echart55_option.yAxis[0].data = this.const39;
            this.echart55_option.series[0].data = this.const38;

            var t = SGC.getPlantType(key);
            this.echart55_option.series[0].label.color = t.color;
            this.echart55_option.series[0].itemStyle.color
                = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: t.color1 }, { offset: 1, color: t.color }]);
        }

        this.selectPlantType = function (idx) {
            if (this.selectedPlant == idx)
                return false;
            this.selectedPlant = idx;
            for (var i = 0; i < this.const17.length; i++) {
                this.const17[i][0] = this.const17[i][0].replace("_sel", "");
                this.const17[i][4] = "1.5rem";
                this.const17[i][5] = "0.5";
            }
            this.const17[idx][4] = "2rem";
            this.const17[idx][5] = "1";
            Vue.set(this.const17[idx], 0, this.const17[idx][0].replace(".png", "_sel.png"));
            this.cap = "国家电网" + this.alltype[this.alltypeidx[idx]] + "装机容量TOP5";
            this.showData();
        }
        this.changeShow = function (item) {
            if (this.selectedType == item.type)
                return;
            this.selectedType = item.type;
            this.showData();
        }
    },
    showVoltageByStation: function (data, fGetStationId, cVol, cValue) {
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: false });
        var msg = [];
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var staid = fGetStationId(row);
            if (!staid)
                continue;
            var station = ModelList.getStation(staid);
            if (!station)
                continue;
            var v = row[cValue];
            var stavol = row[cVol];
            var clr = this.getVoltageColor(stavol, v);
            if (!clr)
                continue;
            var lon = station.LONGITUDE;
            var lat = station.LATITUDE;
            var m = {
                stationid: staid, longitude: lon, latitude: lat, glowColor: clr, data: { value: v }
            };
            msg.push(m);
        }
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: true, data: msg });
    },
    getItemLegend: function (i) {
        var text = [];
        var vols = this.vols || ["500kV","220kV","110kV","35kV"];
        for (var v = 0; v < vols.length; v++) {
            text.push(this.border[vols[v]][i]);
        }
        return text.join();
    },
    getLegendContent: function () {
        var arr = [];
        for (var i = 0; i < this.colors.length; i++) {
            var text = [];
            if (i == this.colors.length - 1) {
                text = "<=" + this.getItemLegend(i - 1);//this.border500[i - 1] + "kV," + this.border220[i - 1] + "kV," + this.border110[i - 1] + "kV," + this.border35[i - 1] + "kV";
            } else {
                text = ">" + this.getItemLegend(i); //this.border500[i] + "kV," + this.border220[i] + "kV," + this.border110[i] + "kV," + this.border35[i] + "kV";
            }
            var color = this.colors[i];
            arr.push({ color: color, status: 1, text: text });
        }
        return arr;
    },
    displayVoltages_Jibei: function (time) {
        if (!time)
            return;
        var o = this;
        ProjectSGC.Service.get("电压数据", "getbusvoltagemeas", "?gridid=&meas_type=00002202&voltagecode=&timepoint=" + time, function (data) {
            o.data = data;
            o.filterVoltages(o.vols);
        });
    },
    filterVoltages: function (vols) {
        this.vols = vols;
        if (!this.data) return;
        var o = this;
        ModelList.require(["station"], function () {
            o.showVoltageByStation(o.data, function (row) {
                return row.STID;
            }, "VOLTAGENAME", "MEAS");
        });
    }
}