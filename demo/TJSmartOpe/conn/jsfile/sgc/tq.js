var SGCWeather = {
    getImg: function (type, time) {
        var path = "/i/sgc/tq/";
        switch (type) {
            case '晴':
                return path + "qing.png";
            case '多云':
                return path + "duoyun.png";
            case '小雨':
                return path + "xiaoyu.png";
            case '雨':
            case '阵雨':
            case '雷阵雨':
            case '冻雨':
            case '中雨':
            case '大雨':
            case '暴雨':
            case '大暴雨':
            case '特大暴雨':
                return path + "yu.png";
            case '阴':
            case '冰雹':
            case '雨夹雪':
            case '雷暴':
            case '雪':
            case '阵雪':
            case '小雪':
            case '中雪':
            case '大雪':
            case '暴雪':
            case '雾霾':
            case '雾':
            case '霾':
            case '沙尘':
            case '沙尘暴':
            case '浮尘':
            case '扬沙':
            case '强沙尘暴':
            case '风':
            case '大风':
            case '狂风':
            case '龙卷风':
            case '台风':
            case '飙线风':
            default:
                return path + "yin.png";
        }
    },
    getOption24: function (xtime, arrTemperature, arrType, arrAir, arrWind, echart20width) {
        var arrZero = Ysh.Array.initN(xtime.length, 0);
        var timeData = xtime;

        return ProjectSGC.EChart.setCommonOption({
            axisPointer: {
                link: { xAxisIndex: 'all' },
                label: {
                    backgroundColor: '#777'
                }
            },
            // tooltip:{
            //     show: true,
            //     trigger: 'axis',
            //     axisPointer:{
            //         type: 'line'
            //     },
            //     formatter: function (params) {
            //         console.log(params);
            //         console.log(arrAir[params.dataIndex])
            //         // return  '{a0}:{c0}'+arrAir[params[2].dataIndex];
            //         return '{a0}:{c0}'
            //     },
            //     // formatter:'{a0}:{c0}'
            // },
            grid: [{//180
                left: 80,
                right: ProjectSGC.EChart.Size.MARGIN,
                top: 70,
                height: 70
            }, {
                left: 80,
                right: ProjectSGC.EChart.Size.MARGIN,
                top: 150,
                height: 30
            }, {
                left: 80,
                right: ProjectSGC.EChart.Size.MARGIN,
                top: 198,
                height: 30
            }],
            graphic:[
                {
                    type: 'image',
                    left: '0',
                    top: 0,
                    z: -10,
                    bounding: 'raw',
                    style: {
                        image: '../i/sgc/tq/bg24.png',
                        width: echart20width,
                        height:280,
    //                    opacity: 0.4
                        }
                },
            ],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: timeData,
                    show: false
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    show: true,
                    data: timeData,
                    boundaryGap: false,
                    name: '湿度(%)',
                    nameTextStyle:{
                        color: '#bbbbbb',
                    },
                    nameGap: 30,
                    nameLocation: 'start',
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false }
                },
                {
                    gridIndex: 2,
                    type: 'category',
                    boundaryGap: false,
                    data: timeData,
                    position: 'left',
                    name: '风力(级)',
                    nameTextStyle:{
                        color: '#bbbbbb',
                    },
                    nameGap: 30,
                    nameLocation: 'start',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { color: "#bbbbbb",margin : 15 }
                }
            ],
            yAxis: [
                {
                    name: '',
                    type: 'value',
                    show: false,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    scale:true
                },
                {
                    gridIndex: 1,
                    name: '湿度',
                    type: 'value',
                    min: 0,
                    max: 0.2,
                    show: false
                },
                {
                    gridIndex: 2,
                    name: '风力',
                    type: 'value',
                    min: 0,
                    max: 0.2,
                    show: false
                }
            ],
            series: [
                {
                    name: '温度',
                    type: 'line',
                    data: arrTemperature,
                    lineStyle:{
                        width: 1,
                    },
                    color: '#D7A75D',
                    symbolSize: 5,
                    smooth: true,
                    label: ProjectSGC.EChart.getTemperatureLabel()
                },
                {
                    name: '湿度',
                    color: '#a39374',
                    type: 'scatter',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    symbol: 'rect',
                    symbolOffset: [0, 6],
                    symbolSize: [(echart20width-40)/24 - 10, 3],
                    data: arrZero,
                    label: {
                        show: true,
                        position: ['30%',-20],
                        distance: 1,
                        color: ProjectSGC.EChart.Colors.TEXT,
                        formatter: function (params) {
                            return arrAir[params.dataIndex];
                        }
                    }
                },
                {
                    name: '风力',
                    color: '#6a9caf',
                    type: 'scatter',
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    symbol: 'rect',
                    symbolOffset: [0, 6],
                    symbolSize: function (value, params) {
                        //console.log(arrWind[params.dataIndex].toString())
                        //console.log(arrWind)
                        if (
                           params.dataIndex == 0 && arrWind[0] == arrWind[1] ||//判断第一个数据
                            //判断从第二个开始的数据
                            params.dataIndex > 0 && params.dataIndex < 23 && arrWind[params.dataIndex] == arrWind[params.dataIndex + 1] ||
                            //判断最后一个数据
                            params.dataIndex == 23 && arrWind[params.dataIndex] == arrWind[params.dataIndex - 1]
                            )
                            return [(echart20width - 40) / 24+1, 3]

                       
                        

                        return [(echart20width - 40) / 24 - 20, 3]
                        //return [(echart20width - 40) / 24 - 10, 3]
                    },
                    //function (value, params) {                            return [arrWind[params.dataIndex], 8];                        },
                    data: arrZero,
                    label: {
                        show: true,
                        position: ['30%',-20],
                        distance: 1,
                        color: ProjectSGC.EChart.Colors.TEXT,
                        formatter: function (params) {
                            var p = arrWind[params.dataIndex].toString();
                            //return  (p== "") ? p : p + "级";
                            return  (p== "") ? p : p;
                        }
                    }
                }
            ]
        });
    },
    getImageSymbol: function (t) {
        var img = ProjectSGC.Weather.getImg(t);
        return img ? "image://" + img : ""
    },
    appendFontSize:function(obj) { obj.fontSize = 12;return obj; },
    appendLablePosition:function(obj) { obj.fontSize = 12;obj.position = 'bottom';obj.distance = -15; /*obj.normal = {show: true,position: 'bottom'};*/ return obj; },
    getOption15: function (xtime, arrMaxTemp, arrMaxType, arrMinTemp, arrMinType, arrWindD, arrWindP, echart22width) {
        
        var arrMaxType1 = [];
        var arrMinType1 = [];
        for (var i = 0; i < xtime.length; i++) {
            arrMaxType1.push({ value: 0, symbol: this.getImageSymbol(arrMaxType[i]) });
            arrMinType1.push({ value: 0, symbol: this.getImageSymbol(arrMinType[i]) });
        }

        var timeData = xtime;

        return ProjectSGC.EChart.setCommonOption({
            axisPointer: {
                link: { xAxisIndex: 'all' },
                label: {
                    backgroundColor: '#777'
                }
            },
            grid: [{//180
                left: ProjectSGC.EChart.Size.MARGIN + echart22width/14 - 20,
                right: ProjectSGC.EChart.Size.MARGIN + echart22width/14 - 20,
                top: 130,
                height: 160
            }, {
                left: ProjectSGC.EChart.Size.MARGIN + echart22width/14 - 20,
                right: ProjectSGC.EChart.Size.MARGIN + echart22width/14 - 20,
                top: 10,
                height: 80
            }, {
                left: ProjectSGC.EChart.Size.MARGIN + echart22width/14 - 20,
                right: ProjectSGC.EChart.Size.MARGIN + echart22width/14 - 20,
                top: 260,
                height: 100
            }],
            graphic: [
                        {
                            type: 'image',
                            left: '0',
                            top: 0,
                            z: -10,
                            bounding: 'raw',
                            style: {
                                image: '../i/sgc/tq/bg.png',
                                width: echart22width,
                                height:340,
            //                    opacity: 0.4
                                }
                            },
                            {
                            type: 'image',
                            left: '14.29%',
                            top: 0,
                            z: -9,
                            bounding: 'raw',
                            style: {
                                image: '../i/sgc/tq/tiao.png',
                                width: echart22width/7,
                                height:340,
            //                    opacity: 0.4
                                }
                            },
                            {
                            type: 'image',
                            left: '42.86%',
                            top: 0,
                            z: -9,
                            bounding: 'raw',
                            style: {
                                image: '../i/sgc/tq/tiao.png',
                                width: echart22width/7,
                                height:340,
            //                    opacity: 0.4
                                }
                            },
                            {
                            type: 'image',
                            left: '71.43%',
                            top: 0,
                            z: -9,
                            bounding: 'raw',
                            style: {
                                image: '../i/sgc/tq/tiao.png',
                                width: echart22width/7,
                                height:340,
            //                    opacity: 0.4
                                }
                            }
                     ],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: timeData,
                    show: false
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    boundaryGap: false,
                    data: timeData,
                    show: false
                },
                {
                    gridIndex: 2,
                    type: 'category',
                    boundaryGap: false,
                    data: timeData,
                    show: false
                }
            ],
            yAxis: [
                {
                    name: '高',
                    type: 'value',
                    show: false,
                },
                {
                    gridIndex: 1,
                    name: '温度',
                    type: 'value',
                    min: 0,
                    max: 0.2,
                    
                    show: false
                },
                {
                    gridIndex: 2,
                    name: '低',
                    type: 'value',
                    min: 0,
                    max: 0.2,
                    show: false,
                    inverse: true
                }
            ],
            series: [
                {
                    name: '',
                    type: 'line',
                    symbolSize: 8,
                    data: arrMaxTemp,
                    color: '#D7A75D',
                    smooth: true,
                    label: this.appendFontSize(ProjectSGC.EChart.getTemperatureLabel())
                },
                {
                    name: '',
                    type: 'line',
                    symbolSize: 8,
                    data: arrMinTemp,
                    color: '#17b3ee',
                    smooth: true,
                    label: this.appendLablePosition(ProjectSGC.EChart.getTemperatureLabel([0,20]))
                },
                {
                    name: '高',
                    color: '#8C6A2A',
                    type: 'scatter',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    symbolSize: [25, 25],
                    symbolOffset: [0, 15],
                    data: arrMaxType1,
                    label: {
                        show: true,
                        position: [0, -68],
                        distance: 1,
                        color: 'white',
                        formatter: function (params) {
                            var n = params.dataIndex;
                            // return Ysh.Time.formatString(xtime[n], "周[w]\n[m]/[d]") + "\n" + '<div>(arrMaxType[n]||"晴")</div>';
                            return [
                                '{a|' + Ysh.Time.formatString(xtime[n], "周[w]\n\n[m]/[d]")+'}',
                                '{c|  }',
                                '{b|'+(arrMaxType[n]||'晴')+'}',
                            ].join('\n')
                        },
                        rich:{
                            b:{
                                fontSize: 14,
                                // color: '#bac0d1',
                                color: '#fff',
                                padding: [0,0,0,5]
                            },
                            a:{
                                // color: '#bac0d1',
                                color: '#fff',
                                align: 'center',
                                padding: [0,0,0,-4]
                            }
                        }
                    }
                },
                {
                    name: '低',
                    color: '#4A6A74',
                    type: 'scatter',
                    xAxisIndex: 2,
                    yAxisIndex: 2,
                    symbolSize: [25, 25],
                    symbolOffset: [0, -5],
                    data: arrMinType1,
                    label: {
                        show: true,
                        position: [0, 33],
                        distance: 1,
                        color: 'white',
                        formatter: function (params) {
                            var n = params.dataIndex;
                            var p = arrWindP[n].toString();
                            if (p != "") p += "级"
                            // return (arrMinType[n]||"晴") + "\n" + arrWindD[n] + "\n" + p;
                        return  [
                                '{b|'+(arrMinType[n]||'晴')+'}',
                                '{c|'+arrWindD[n]+'}',
                                '{a|'+p+'}',   
                            ].join('\n')
                        },
                        rich:{
                            b:{
                                fontSize: 14,
                                // color: '#bac0d1',
                                color: '#fff',
                                padding: [0,0,0,5],
                            },
                            a:{
                                fontSize: 14,
                                // color: '#bac0d1',
                                color: '#fff',
                                align: 'center',
                            }
                        }
                    }
                }
            ]
        });
    }
}
