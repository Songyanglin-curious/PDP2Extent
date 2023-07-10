/*v=1.20.323.1*/
Vue.component("ecalendarchart", {
    props: ["startyear", "datalist", "horizontal", "notipdata", "nomap", "size"],
    template: '<div :style="styleObject"></div>',
    data: function () {
        return {
            echart: null, styleObject: { width: "100%", height: "100%" }
        }
    },
    methods: {
        refresh: function () {
            var chart = echarts.init(this.$el);
            chart.setOption(this.getOption(), true);
            var vm = this;
            chart.on("click", function (params) {
                vm.$emit("click", params);
            });
            this.echart = chart;
            //this.resize();
        },
        resize: function () {
            this.echart.resize();
        },
        getTooltip: function () {
            if (this.notipdata)
                return {
                    position: 'top',
                    formatter: function (p) {
                        return echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
                    }
                };
            return {
                position: 'top',
                formatter: function (p) {
                    var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
                    return format + ': ' + p.data[1];
                }
            }
        },
        getCalendar: function (years, i) {
            if (this.horizontal) {
                return {
                    orient: 'horizontal',
                    range: years[i],
                    monthLabel: { nameMap: 'cn' },
                    dayLabel: { firstDay: 1, nameMap: 'cn' },
                    cellSize: this.size || ['auto', 20],
                    right: 10,
                    top: 30 + i * 180
                }
            }
            return {
                orient: 'vertical',
                range: years[i],
                monthLabel: { nameMap: 'cn' },
                dayLabel: { firstDay: 1, nameMap: 'cn' },
                cellSize: this.size || [20, 'auto'],
                bottom: 10,
                left: 80 + i * 220
            }
        },
        getOption: function () {
            var start = +echarts.number.parseDate(this.startyear + '-01-01');
            var newyear = +echarts.number.parseDate((+this.startyear + 1) + '-01-01');
            var min, max, time;
            var years = [this.startyear];
            var data = [[]];
            time = start;
            var dayTime = 3600 * 24 * 1000;
            for (var i = 0; i < this.datalist.length; i++) {
                var date = echarts.format.formatTime('yyyy-MM-dd', time);
                var d = this.datalist[i];
                if (d !== "") {
                    data[years.length - 1].push([date, d]);
                    if (typeof min == "undefined")
                        min = d;
                    else if (min > d) min = d;
                    if (typeof max == "undefined")
                        max = d;
                    else if (max < d) max = d;
                }
                if (i == this.datalist.length - 1)
                    continue;
                time += dayTime;
                if (time == newyear) {
                    years.push(this.startyear + years.length);
                    newyear = +echarts.number.parseDate((+this.startyear + years.length) + '-01-01');
                    data.push([]);
                }
            }
            var calendars = [];
            var series = [];
            for (var i = 0; i < years.length; i++) {
                calendars.push(this.getCalendar(years, i));
                series.push({
                    type: 'heatmap', coordinateSystem: 'calendar', calendarIndex: i, data: data[i],color:'red',
                    label: {
                        show:true,
                        formatter: function (params) {
                            var d = echarts.number.parseDate(params.value[0]);
                            return d.getDate();
                        },color:"#000"
                    }
                });
            }
            var virualMap = null;
            if (!this.nomap) {
                virualMap = { min: min, max: max, calculable: true };
                if (this.horizontal) {
                    virualMap.orient = 'horizontal';
                    virualMap.top = years.length * 180 + 30;
                    virualMap.left = 'center';
                } else {
                    virualMap.orient = 'vertical';
                    virualMap.left = years.length * 220 + 10;
                    virualMap.top = 'center';
                }
            }
            if (this.horizontal) {
                this.styleObject.width = "1200px";
                this.styleObject.height = (180 * years.length + 30) + "px";
            }
            return {
                tooltip: this.getTooltip(),
                visualMap: virualMap,
                calendar: calendars,
                series: series
            };
        }
    },
    mounted: function () {
        this.refresh();
    }, watch: {
        datalist: function () {
            this.refresh();
        },
        startyear: function () {
            this.refresh();
        }
    }
});
