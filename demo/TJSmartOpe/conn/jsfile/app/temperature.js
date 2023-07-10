_app.temperature = _app._weather({
    id: "temperature", state: 0, type: 1, needClear: false, name: "温度",
    legend: "/i/sgc/legend/temperature.png",
 
}, {
    timesSQL: "sgc/tq:GetTemperatureTimes", timeType: "hh",
    min: Ysh.Time.add('d', -1, new Date()),
    max: Ysh.Time.add('d', 1, new Date()),
    getInfo: function (time) {
        var md = time.substr(5, 5)
        if ((md >= "12-01") || (md < "04-21"))
            return {
                legend: "/i/sgc/legend/temperature-winter.png", name: "winter",
                rangeList: ["<-32", "-32", "-28", "-24", "-20", "-16", "-12", "-8", "-4", "0", "4", "8", "12", "16", "20", "24", "28", "32", ">32"],
                rangeColor: ["#80007C", "#002F86", "#1A5CA6", "#2075D2", "#3CA0F0", "#75CFFF", "#97E1F4", "#BDF9FF", "#F2FFFF", "#DFFFD9", "#C4FFB7", "#BAFE83", "#FCFE9C", "#FFF3C4", "#FFDCA8", "#FFAF75", "#FD8784", "#EC5B5F"],
                defRange: "0,18"
            };
        return {
            legend: "/i/sgc/legend/temperature.png", name: "summer",
            rangeList: ["<-12", "-12", "-8", "-4", "0", "4", "8", "12", "16", "20", "24", "28", "32", "35", "37", "40", ">40"],
            rangeColor: ['#083485', '#1a5ca7', '#2275d0', '#3db3da', '#3ba7e9', '#ace6f7', '#d3fbff', '#f3ffef', '#d1ffd1', '#bfff8b', '#fdff9d', '#fff3c3', '#ffd0a5', '#fb9589', '#ff5400', '#e70200'],
            defRange: "0,16"
        };
    },
    lastName: '',
    currentName: '',
    lastInfo: {},
    timer:null,
    lastLegend:'',
    V: function (v) {
        var rl = ["<-12", ">40"];
        if (this.lastInfo && this.lastInfo.rangeList)
            rl = this.lastInfo.rangeList;
        if (v == rl[0]) return -1000;
        if (v == rl[rl.length - 1]) return 1000;
        return v;
    }, minV: -1000, maxV: 1000,
    getCurrLegend: function () {
        if (this.lastInfo)
            return this.lastInfo.legend;
        return "";
    },

    display: function (time, app) {
        // vMain.setLegend(app.getLegend(), false);
        var vm = this;
        if (!time) {
            // vMain.setNeedRealHis("temperature", false);
            // vMain.showFilter(false);
            vMain.setLegend(app.getLegend(), false);
            this.lastInfo = {};
            this.minV = -1000;
            this.maxV = 1000;
            // MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: false, data: { type: "forecast" } });
            return;
        }
        time = Ysh.Time.toString(time);
        this.lastInfo = this.getInfo(time);
        if(this.lastInfo.legend !== app.getLegend()){
            vMain.setLegend(app.getLegend(), false);
            app.legend = this.lastInfo.legend
            vMain.setLegend(app.getLegend(), true);
        }
       
        this.currentName = this.lastInfo.name
        var delay = 3000;
        if(!this.timer){
            vMain.showPage("temperature", "高温", "sgc_weather_effect", { tm: time, tp: "temperature" });
            this.timer = 1;
        }else{
            window.clearTimeout(this.timer)
            this.timer = window.setTimeout(() => {vMain.showPage("temperature", "高温", "sgc_weather_effect", { tm: time, tp: "temperature" });},delay)
        }
        var vm = this
        function onchange(min, max) {
            vm.minV = vm.V(min)
            vm.maxV = vm.V(max)
        }
        if (this.currentName != this.lastName) {
            if(app.floatPages.length !== 0){
                for (var i = 0; i < app.floatPages.length; i++) {
                    vMain.destroyFloatPage(app.floatPages[i]);
                }
            }
            app.float("temperature_slide", { rangeList: this.lastInfo.rangeList, rangeColor: this.lastInfo.rangeColor, defRange: this.lastInfo.defRange, onchange }, false, function (c) {
                c.styles = {
                    width: "300px", height: "100px",
                    position: "absolute", "z-index": 100,
                    right: "100px", top: "20px",
                    "opacity": 1
                }
            });
        }
        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showContourGeojson', selstate: !!time, data: { type: "temperature", time: time, minV: this.minV, maxV: this.maxV } });
        // MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: true, data: { type: "temperature", time: time } });
        this.lastName = this.lastInfo.name
    }, close: function () {
        this.timer = null;
        vMain.closePage("temperature", true);
        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: false, data: { type: "temperature" } });
    }
},);