/*v=1.20.1111.1*/
Vue.component("ecommonchart", {
    props: ["option"], template: "#esimplechart_template",
    data: function () { return { echart: null, bClickBind: false } },
    computed: {
        chartOption:function() { return this.option||{}; }
    },
    methods: {
        refresh: function () {
            //$(this.$el).removeAttr("_echarts_instance_").empty();
            var chart = echarts.init(this.$el);
            chart.clear();
            chart.setOption(this.chartOption, true);
            if (!this.bClickBind) {
                var vm = this;
                chart.on("click", function (params) {
                    vm.$emit("click", params);
                });
                this.bClickBind = true;
            }
            this.echart = chart;
            this.resize();
        },
        resize: function () {
            this.echart.resize();
        }
    },
    mounted: function () {
        this.refresh();
    },
    watch: {
        option: function () {
            this.refresh();
        }
    }
});
Vue.component("highchart", {
    props: ["option"], template: "#esimplechart_template",
    data: function () { return { echart: null, bClickBind: false } },
    computed: {
        chartOption:function() { return this.option||{}; }
    },
    methods: {
        refresh0: function () {
            var chart = echarts.init(this.$el);
            chart.setOption(this.chartOption, true);
            if (!this.bClickBind) {
                var vm = this;
                chart.on("click", function (params) {
                    vm.$emit("click", params);
                });
                this.bClickBind = true;
            }
            this.echart = chart;
        },
        refresh: function () {
            if (this.echart)
                this.echart.destroy();
            var chart = new Highcharts.chart(this.$el, this.chartOption);
            if (!this.bClickBind) {
                var vm = this;
                //chart.on("click", function (params) {
                //    vm.$emit("click", params);
                //});
                this.bClickBind = true;
            }
            this.echart = chart;
        },
        resize: function () {
            //this.echart.resize();
            this.echart.reflow();
        }
    },
    mounted: function () {
        if (this.echart)
            //this.echart.dispose();
            this.echart.destroy();
        this.refresh();
    },
    beforeDestroy: function () {
        if (this.echart)
            //this.echart.dispose();
            this.echart.destroy();
    },
    watch: {
        option: function () {
            this.refresh();
        }
    }
});
Vue.component("esimplechart", {
    props: ["xaxis", "series", "legend", "option", "extop","willhide"], template: "#esimplechart_template",
    data: function () { return { echart: null, bClickBind: false, chartOption: null } },
    computed: {},
    methods: {
        setDefaultFormatter: function (axis) {
            if (!axis)
                return;
            if (axis instanceof Array) {
                for (var i = 0; i < axis.length; i++) {
                    this.setDefaultFormatter(axis[i]);
                }
                return;
            }

            if (!axis.axisLabel) {
                axis.axisLabel = {}
            }
            if (axis.axisLabel.formatter)
                return;
            axis.axisLabel.formatter = function (value) { return value; };
        },
        refresh: function () {
            if (this.willhide) {
            this.chartOption = {};
            if (this.option) this.chartOption = Ysh.Object.clone(this.option);
            var option = this.chartOption;
            //if (!option.color)
            //    option.color = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
            if (!option.legend) {
                option.legend = {};
                option.legend.data = this.legend;
            }

            //if (!option.textStyle)
            //    option.textStyle = { fontSize: 40 };

            //处理系列
            var seriesType;
            if (option.series && option.series.length > 0 && this.series) {
                for (var i = 0; i < this.series.length; i++) {
                    for (j = option.series.length - 1; j >= 0; j--) {
                        if (option.series[j].name === this.series[i].name)
                            if (this.series[i].hide)
                                option.series.splice(j, 1);
                            else
                                option.series[j].data = this.series[i].data;
                    }
                }
            } else if (this.series) {
                option.series = this.series;
            }
            } else {
            var option = this.option || {};
            //if (!option.color)
            //    option.color = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
            if (!option.legend) {
                option.legend = {};
                option.legend.data = this.legend;
            }

            //if (!option.textStyle)
            //    option.textStyle = { fontSize: 40 };

            //处理系列
            var seriesType;
            if (option.series && option.series.length > 0 && this.series) {
                for (var i = 0; i < this.series.length; i++) {
                    for (var j = 0; j < option.series.length; j++) {
                        if (option.series[j].name === this.series[i].name)
                            option.series[j].data = this.series[i].data;
                    }
                }
            } else if (this.series) {
                option.series = this.series;
            }
            }
            if (Array.isArray(option.series)) {
                //检查系列类型，如果不是折线图或柱状图，保存类型
                for (var k = 0; k < option.series.length; k++) {
                    if (option.series[k].type !== "line" && option.series[k].type !== "bar" && option.series[k].type !== "scatter"  && option.series[k].type !== "k") {
                        seriesType = option.series[k].type;
                        break;
                    }
                }
            }
            //处理x轴
            if (!option.xAxis && !seriesType) {
                option.xAxis = {};
                option.xAxis.type = 'category';
            }

            if (option.xAxis && this.xaxis) {
                if (option.xAxis instanceof Array)
                    option.xAxis[0].data = this.xaxis;
                else
                    option.xAxis.data = this.xaxis;
            }
            if (seriesType && option.xAxis)
                delete option.xAxis;
            //处理y轴
            if (!option.yAxis && !seriesType) {
                option.yAxis = {};
                option.yAxis.type = 'value';
            }

            if (option.yAxis && this.yaxis) {
                if (option.yAxis instanceof Array)
                    option.yAxis[0].data = this.yaxis;
                else
                    option.yAxis.data = this.yaxis;
            }
            if (seriesType && option.yAxis)
                delete option.yAxis;
            if (option.series) {
                for (var l = 0; l < option.series.length; l++) {
                    var s = option.series[l];
                    if (s.label && s.label.formatter) {
                        s.label.formatter = s.label.formatter.replace('\\n', '\n');
                    }
                }
            }
            if (this.extop)
                this.extop(option);
            //option.series[0].label.formatter = option.series[0].label.formatter.replace('\\n', '\n');
            this.setDefaultFormatter(option.xAxis);
            this.setDefaultFormatter(option.yAxis);
            var chart = echarts.init(this.$el);
            chart.setOption(option, true);
            if (!this.bClickBind) {
                var vm = this;
                chart.on("click", function (params) {
                    vm.$emit("click", params);
                });
                this.bClickBind = true;
            }
            this.echart = chart;
        },
        refreshOption: function () {
            var chart = echarts.init(this.$el);
            chart.clear();
            chart.setOption(this.chartOption||this.option, true);
        },
        resize: function () {
            this.echart.resize();
        }
    },
    beforeUpdate: function () { alert("beforeUpdate"); },
    updated: function () { alert("updated"); },
    mounted: function () {
        this.refresh();
    },
    watch: {
        xaxis: function () { this.refresh(); },
        series: function () { this.refresh(); }
    }
});
