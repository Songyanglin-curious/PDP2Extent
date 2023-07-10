/*v=1.20.1211.1*/
var SGC = {
    FONTSIZE: 16
};
var SGCWGDY = {
    colors: ["#FF0000", "#FF507B", "#FF823C", "#FF893C", "#FFFF3C", "#9AFF3C", "#00FFDE", "#00DEFF", "#4DB4FF", "#4D91FF", "#4D4DFF", "#9132FF"],
    border: {
        "35kV": [40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30],
        "66kV": [70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60],
        "110kV": [120, 119, 117, 115, 114, 113, 112, 111, 110, 107, 100],
        "220kV": [240, 238, 234, 230, 228, 226, 224, 222, 220, 215, 200],
        "330kV": [350, 345, 340, 335, 330, 325, 320, 315, 310, 305, 300],
        "500kV": [550, 538, 534, 530, 528, 526, 524, 522, 520, 515, 500],
        "750kV": [800, 790, 780, 770, 760, 750, 740, 730, 720, 710, 700],
        "1000kV": [1100, 1070, 1050, 1030, 1000, 990, 980, 970, 960, 950, 940],
    },
    all: null,
    vols: null,
    data: null,
    timerId: 0,
    //rates_s: [1.10, 1.09, 1.08, 1.07, 1.05, 1.03, 0.97, 0.95, 0.93, 0.92, 0.91, 0.90],
    //rates_p: [1.20, 1.18, 1.16, 1.14, 1.12, 1.01, 1.00, 0.99, 0.98, 0.97, 0.96, 0.95],
    rates_s: [1.05, 1.04, 1.03, 1.02, 1.01, 0.99, 0.97, 0.95, 0.93, 0.92, 0.91, 0.90],
    rates_p: [1.05, 1.04, 1.03, 1.02, 1.01, 0.99, 0.97, 0.95, 0.93, 0.92, 0.91, 0.90],
    isBase: false,
    contourType: 0,
    getLevel: function (id, vBase, v) {
        if ((!v) || (!vBase)) return null;
        var isPlant = ProjectSGC.Meta.getTypeById(id) == "PLANT";
        var rate = v / vBase;/// 1.05;
        if (this.isBase) rate /= 1.05;
        var arr = isPlant ? this.rates_p : this.rates_s;
        for (var i = 0; i < arr.length; i++) {
            var r = arr[i];
            if (rate > r) return [11 - i, rate];
        }
        return null;
    },
    displayVoltages: function (gridid, callback, vDefault) {
        ProjectSGC.require("voltage");
        PDP.dll("SGCLib:SGCLib.Realtime.GetBusVoltage", [], function (data) {
            if (!data.check("获取实时电压", true)) return;
            data = JSON.parse(data.value[0]);
            var tree = ModelList.grids.tree;
            var node = tree.find(gridid);
            var arr = [];
            var vols = [];
            var allv = [];
            for (var g in data) {
                if (node) {
                    if (!node.contains(g))
                        continue;
                }
                var lst = data[g];
                for (var i = 0; i < lst.length; i++) {
                    var item = lst[i];
                    var vol = ProjectSGC.Voltage[item.voltageType];
                    allv.addSkipSame(vol);
                    if (item.status != 1) continue;
                    if (item.floatValue == 0.0) continue;
                    item.voltageName = vol.name;
                    item.voltageValue = vol.value;
                    vols.addSkipSame(item.voltageName);
                    arr.push(item);
                }
            }
            console.log(allv);
            vols.sort(function (x, y) { return -Ysh.Compare.compareVoltage(x, y); });
            arr.sort(function (x, y) { return x.floatValue - y.floatValue; })
            SGCWGDY.data = arr;
            SGCWGDY.all = vols;
            SGCWGDY.filterVoltages(SGCWGDY.vols ? SGCWGDY.vols : (vDefault ? vDefault.split(',') : vols));
            if (callback)
                callback();
        });
    },
    getVoltageColor: function (vBase, v) {
        if (!vBase) return "";
        vBase = vBase.toString();
        if (!vBase.endsWith("V")) vBase += "kV";
        if (this.vols) {
            if (this.vols.indexOf(vBase) < 0)
                return "";
        }
        var arr = null;
        arr = this.border[vBase];
        if (arr == null)
            return "";
        v = parseInt(v, 10);
        for (var i = 0; i < arr.length; i++) {
            if (v > arr[i])
                return this.colors[i];
        }
        return this.colors[arr.length];
    },
    showVoltageByStation: function (data, fGetStationId, cVol, cValue) {
        this.clear();
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showBusvol", selstate: false, data: { type: "busvol" } });
        var msg = [];
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            if (this.vols.indexOf(row.voltageName) < 0)
                continue;
            var staid = fGetStationId(row);
            if (!staid)
                continue;
            var station = ModelList.getStation(staid);
            if (!station)
                continue;
            var v = row[cValue];
            var vBase = row[cVol];
            var level = this.getLevel(staid, vBase, v);
            if (!level)
                continue;
            var clr = this.colors[11 - level[0]];
            var lon = station.LONGITUDE;
            var lat = station.LATITUDE;
            var m = {
                stationid: staid, longitude: lon, latitude: lat, glowColor: clr, data: { value: level[0] * 1.0 / this.colors.length, rate: level[1], voltage: v }
            };
            msg.push(m);
        }
        if (this.legend)
            vMain.setLegend(this.legend, false);
        if (msg.length > 0) {
            var info = {};
            var lngth = this.colors.length;
            for (var i = 0; i < lngth; i++) {
                info[(i * 1.0 / lngth).toString()] = this.colors[11 - i];
            }
            this.legend = "/WeatherData/busvol/colorbar/" + SelectCityInst.getLocateOwner() + "colorbar" + SGCWGDY.vols[0].replace("kV", "") + ".png?__e__=1&a="+(new Date().getTime());
            vMain.setLegend(this.legend, true);
            console.log("voltage:" + SGCWGDY.vols.join(","));
            var mapmsg = { eventType: "menuope", menuname: "showBusvol", selstate: true, data: { type: "busvol", busVolType: "contour", voltype: SGCWGDY.vols.join(","), dytype: SGCWGDY.isBase ? "base" : "nominal", contourType: this.contourType, locateInfo: msg, gradient: info } };
            ProjectSGC.Map.postMessage(mapmsg);
        }
    },
    getItemLegend: function (i) {
        var text = [];
        var vols = this.vols;
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
                text = "<=" + this.getItemLegend(i - 1);
            } else {
                text = ">" + this.getItemLegend(i);
            }
            var color = this.colors[i];
            arr.push({ color: color, status: 1, text: text });
        }
        return arr;
    },
    filterVoltages: function (vols) {
        this.vols = vols;
        //this.vols = ["500kV","330kV"]
        this.setBase(this.isBase);
    },
    setBase: function (b) {
        this.isBase = b;
        if (!this.data) return;
        var o = this;
        ModelList.require(["station"], function () {
            o.showVoltageByStation(o.data, function (row) {
                return row.stId;
            }, "voltageValue", "floatValue");
        });
    },
    setType: function (t) {
        this.contourType = t;
        this.setBase(this.isBase);
    },
    refreshMap: function () {
        this.timerId = 0;
        this.showVoltageByStation(this.data, function (row) {
            return row.stId;
        }, "voltageValue", "floatValue");
    },
    reseted: function (s) {
        if (Ysh.String.isNumber(s)) {
            alert("设置成功，" + s + "秒后刷新！");
            this.timerId = window.setTimeout(function () { SGCWGDY.refreshMap(); }, parseInt(s) * 1000);
        } else {
            alert(s);
        }
    },
    clear: function () {
        if (this.timerId)
            window.clearTimeout(this.timerId);
        this.timerId = 0;
    }
}