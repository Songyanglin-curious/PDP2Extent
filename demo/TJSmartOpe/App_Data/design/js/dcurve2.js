
var minutes = this.minutes || 1;
var points = 120 / minutes;
var xtimes = ProjectLocal.Curve.getTimeLabels(minutes);
this.option = ProjectLocal.setOptionTooltip({
    grid: {
        top: 32,
        left: 40,
        right: 0,
        bottom: 25
    },
    yAxis: [
      {
          name: "",//UNIT.GONGLV,
          nameLocation: "end",
          type: 'value',
          scale: true,
          axisLabel: {
              show: true,
              showMaxLabel: true,
          },
          axisTick: {
              show: false
          },
          splitLine: {
              show: true,
              lineStyle: {
                  type: "dashed",
                  color: "#827258",
              }
          },
          axisLine: {
              symbol: ["none"],
              lineStyle: {
                  color: "#4ad1fb"
              },
          },
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
                color: "#4ad1fb"
            }
        },
        axisLabel: {
            show: true,
            interval: points - 1,
            formatter: function (value, index) {
                if (index % points != 0) return "";
                return parseInt(value.split(":")[0], 10);
            },
            color: "#76c1d1",
            fontFamily: 'Microsoft YaHei',
            fontSize: 12,
        },
        data: xtimes
    },
    color: ['#2FB1EA', '#A38C4E'],
    legend: {
        data: ['预测', '实际'],
        textStyle: {
            color: '#c6f6fc',
            fontSize: 14
        },
        icon: 'roundRect',
    },
    series: [{
        name: '预测',
        smooth: true,
        symbol: 'none',
        itemStyle: {
            normal: {
                areaStyle1: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                        [{
                            offset: 0,
                            color: 'rgba(47,177,234, 0.7)'
                        }, {
                            offset: 1,
                            color: 'rgba(47,177,234, 0)'
                        }]),
                },
                lineStyle: {  //线的颜色
                    color: '#2FB1EA',
                    width: 3
                },

            },
        },
        markLine: {//标记线
        },
        data: this.pred,
        type: 'line',

    },
    {
        name: '实际',
        smooth: true,
        symbol: 'none',
        itemStyle: {
            normal: {
                areaStyle1: {
                    type: 'default',
                    //渐变色实现
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,//变化度
                                        //三种由深及浅的颜色
                          [{
                              offset: 0,
                              color: 'rgba(163,140,78, 0.7)'
                          }, {
                              offset: 1,
                              color: 'rgba(163,140,78, 0)'
                          }]),
                },
                lineStyle: {  //线的颜色
                    color: '#A38C4E',
                    width: 3
                },

            },
        },
        markLine: {//标记线
        },
        data: this.real,
        type: 'line',
    }]
});