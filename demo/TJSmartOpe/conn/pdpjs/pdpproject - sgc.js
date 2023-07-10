var SGC = {
    COLOR: {
        WHITE_DARK: "rgb(164,152,139)",
        WHITE_LIGHT: "rgb(255,252,223)"
    },
    FONTSIZE: 16,
    setAxis: function (axis) {
        if (!axis)
            return;
        if (axis instanceof Array) {
            for (var i = 0; i < axis.length; i++) {
                this.setAxis(axis[i]);
            }
            return;
        }
        axis.axisLabel = { show: true, textStyle: { color: '#9e9e9e', "fontSize": SGC.FONTSIZE * 0.8} };
        axis.nameTextStyle = axis.axisLabel.textStyle;
    },
    setChartOption: function (option) {
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
        /*
        this.echart55_option = { "dataZoom": { fillerColor: "rgba(167,183,204,0.2)", textStyle: { color: "#9e9e9e" }, top: 'bottom', bottom: -SGC.FONTSIZE, handleSize: "50%", handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z' },
        "color": ['#F6676B', '#3EBBFB', '#1FBDA5', '#F49F5B', '#6894F8', '#FAD77A'],
        "grid": { top: SGC.FONTSIZE * 4, bottom: SGC.FONTSIZE * 3, "left": "20%", "right": "10%" },
        "legend": { "textStyle": { "fontSize": SGC.FONTSIZE * 0.8, "color": "#9e9e9e" }, "itemWidth": SGC.FONTSIZE, "itemHeight": SGC.FONTSIZE * 0.5,
        "data": [{ "name": "火电", "icon": "roundRect" }, { "name": "水电", "icon": "roundRect" }, { "name": "核电", "icon": "roundRect" }, { "name": "抽蓄", "icon": "roundRect" }, { "name": "风电", "icon": "roundRect" }, { "name": "光伏", "icon": "roundRect"}]
        },
        "xAxis": [{ axisLine: { show: false }, splitLine: { show: true, lineStyle: { color: '#383c4b'} }, axisLabel: { show: true, textStyle: { color: '#9e9e9e', "fontSize": SGC.FONTSIZE * 0.8} }, "type": "category"}],
        "yAxis": [{ splitLine: { show: false }, axisLabel: { show: true, textStyle: { color: '#9e9e9e', fontSize: SGC.FONTSIZE * 0.8} }, "type": "value", "name": "(万千瓦)", "nameTextStyle": { color: '#9e9e9e'}}],
        "series": [{ "name": "火电", "type": "bar", "stack": "变化" }, { "name": "水电", "type": "bar", "stack": "变化" }, { "name": "核电", "type": "bar", "stack": "变化" }, { "name": "抽蓄", "type": "bar", "stack": "变化" }, { "name": "风电", "type": "bar", "stack": "变化" }, { "name": "光伏", "type": "bar", "stack": "变化"}]
        }
        */
    },
    setBarOption: function (option) {
        for (var i = 0; i < option.series.length; i++) {
            var s = option.series[i];
            if (i == option.series.length - 1)
                s.itemStyle = { barBorderRadius: [5, 5, 0, 0] };
            s.barCategoryGap = "50%";
        }
    }, getData: function () {
        return JSON.parse(localStorage.data);
    }, planttypes: {
        "1001": { alias: "火电", name: "火电厂", color: "#F6676B", color1: "#c34145", icon: "huo" },
        "1002": { alias: "水电", name: "水电厂", color: "#3EBBFB", color1: "#1b4ab3", icon: "shui" },
        "1003": { alias: "核电", name: "核电站", color: "#F49F5B", color1: "#c96719", icon: "he" },
        "1006": { alias: "抽蓄", name: "抽蓄电站", color: "#6894F8", color1: "#0273ac", icon: "cx" },
        "1004": { alias: "风电", name: "风电场", color: "#1FBDA5", color1: "#12927f", icon: "fd" },
        "1005": { alias: "光伏", name: "光伏电站", color: "#FAD77A", color1: "#d29902", icon: "gf" }
    }, getPlantType: function (key) {
        return this.planttypes[key];
    }
}