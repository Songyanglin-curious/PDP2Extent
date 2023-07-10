{//line开始
    this.searchByTime = function () {
        if (!(this.startTime && this.endTime)) return;
        // 开始时间小于结束时间
        if (this.startTime.getTime() > this.endTime.getTime()) {
            var temp = this.startTime
            this.startTime = this.endTime;
            this.endTime = temp;
        }
        // 处理结束时间,>= s, < e
        var start = Ysh.Time.getTime("y", this.startTime);
        // end 取下一年初
        var end = Ysh.Time.getTime('y,y,1', this.endTime);
        PDP.load("sc/deviceDefect:getLineDefectStatistic", { startTime: this.startTime, endTime: this.endTime }, (res) => {
            if (res.check("获取线路缺陷数据", true)) {
                this.defectInfo = res.value;

                this.getDefectLevel();
                this.handelYWDW();
                this.$nextTick(function () {
                    this.resize();
                })
            }
        })
    }
    this.getDefectLevel = function () {
        var groupData = this.getGroupCount(this.defectInfo, "DEFECT_LEVEL");
        this.defectCount = [
            { value: 0, title: "缺陷总数量:", color: "#fff" },
            { value: 0, title: "危急缺陷数量:", color: "#DE6F7A" },
            { value: 0, title: "严重缺陷数量:", color: "#FDB474" },
            { value: 0, title: "一般缺陷数量:", color: "#76D7AE" }
        ]
        for (var key in groupData) {
            if (key.includes("危急")) {
                this.defectCount[1].value += groupData[key]
            } else if (key.includes("严重")) {
                this.defectCount[2].value += groupData[key]
            } else if (key.includes("一般")) {
                this.defectCount[3].value += groupData[key]
            }
            this.defectCount[0].value = groupData["_ALL_"];
        }
    }
    this.getGroupCount = function (toGroupData, groupKey) {
        var groupCount = {
            _ALL_: 0,
        }
        toGroupData.forEach(item => {
            if (!groupCount[item[groupKey]]) {
                groupCount[item[groupKey]] = 0;
            }
            groupCount._ALL_ += 1;
            groupCount[item[groupKey]] += 1;
        });
        return groupCount;
    }
    this.handelYWDW = function () {
        // 国网蒙东电力、国网天津电力、国网河北电力、国网山东电力、国网山西电力、国网冀北电力、京隆电力、内蒙古超高压
        var YWDWKEy = ["国网蒙东", "国网天津", "国网河北", "国网山东", "国网山西", "国网冀北", "京隆", "内蒙古"]
        var YWDWMap = {
            "国网蒙东": "国网蒙东电力",
            "国网天津": "国网天津电力",
            "国网河北": "国网河北电力",
            "国网山东": "国网山东电力",
            "国网山西": "国网山西电力",
            "国网冀北": "国网冀北电力",
            "京隆": "京隆电力",
            "内蒙古": "内蒙古超高压",
        }
        this.defectInfo.forEach(item => {
            var YWDW = item["YWDW"];
            var findKey = YWDWKEy.find(item => YWDW.includes(item));
            if (findKey) {
                handeledYWDW = YWDWMap[findKey]
                item.handeledYWDW = handeledYWDW;
            }
        })

    }
    this.showMore = function (statistic) {
        var vMain = ProjectSGC.Global.getMainObject("vMain")

        switch (statistic) {
            case "line":
                vMain.gotoApp("line_defect_more", { type: 'line' })
                break;
            case "bw":
                vMain.gotoApp("line_defect_more", { type: 'bw' })
                break;
            case "bj":
                vMain.gotoApp("line_defect_more", { type: 'bj' })
                break;
            case "ywdw":
                vMain.gotoApp("line_defect_more", { type: 'ywdw' })
                break;
        }
    }
    this.lineStatistic = {
        statistickeys: ["LINE_NAME", "DEFECT"],
        statistictype: "count",
        hidden: {
            groupButton: true,
            table: false,
            sort: false,
            chart: false,
            header: true,
        },
        top: -1,
        chart: {
            chart: "highchart",
            fun: (data) => {
                var xData = new Array(30).fill("");
                // 0:一般缺陷，1：严重缺陷
                var seriesName = ["危急缺陷", "严重缺陷", "一般缺陷"];
                // var haveOther = false;
                var zData = [new Array(30).fill(null), new Array(30).fill(null), new Array(30).fill(null)];
                var series = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    // if (item.text === "全部") continue;
                    if (i > 29) break;
                    var text = item.text;
                    xData[i] = text
                    // xData.push(text)
                    zData[0][i] = 0
                    zData[1][i] = 0
                    // zData[2][i] = 0
                    item.data.forEach(subItem => {
                        var index = seriesName.indexOf(subItem["DEFECT_LEVEL"]);
                        if (index !== -1) {
                            zData[index][i]++
                            // zData[2][i].push(item["COUNT"])
                        }
                    })
                }
                for (var i = 0; i < zData.length; i++) {
                    var row = zData[i];
                    // if (!haveOther && i === 2) continue;
                    series.push(
                        {
                            name: seriesName[i],
                            data: row,
                            stack: 'stack1'
                        }
                    )
                }
                return {
                    chart: {
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 5,
                            beta: 0,
                            depth: 50,
                            // alpha: 15,
                            // beta: 15,
                            // viewDistance: 25,
                            // depth: 40
                        },
                        backgroundColor: null
                        // marginTop: 80,
                        // marginRight: 40
                    },
                    title: {
                        text: null
                    },
                    colors: ['#DE6F7A', '#FDB474', '#76D7AE'],
                    legend: {
                        itemStyle: {
                            color: '#fff', // 选中的图例项的文字颜色,
                            fontSize: '14px',
                        },
                        itemHoverStyle: {
                            color: '#aaa', // 未选中的图例项的文字颜色
                            fontSize: '14px',
                        },
                        itemHiddenStyle: {
                            color: '#ccc', // 未选中的图例项的文字颜色
                            fontSize: '14px',
                        },
                    },
                    xAxis: {
                        categories: xData,
                        gridLineColor: '#21A4F1',
                        labels: {
                            style: {
                                color: '#fff', // 设置颜色
                                fontSize: '16px', // 设置字体大小
                                rotation: -45 // 设置倾斜角度
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: null
                        },
                        gridLineColor: '#21A4F1',
                        labels: {
                            style: {
                                color: '#fff', // 设置颜色
                                fontSize: '16px', // 设置字体大小
                                // rotation: -45 // 设置倾斜角度
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{point.key}</b><br>',
                        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}',
                        style: {
                            fontSize: '16px',
                            color: "#000"
                        }
                    },
                    // plotOptions: {
                    //     column: {
                    //         stacking: 'normal',
                    //         depth: 40
                    //     }
                    // },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            pointWidth: 20,
                            pointHeight: 20,
                            depth: 25
                        }
                    },
                    series: series
                }



            },
            args: {
                unit: ""
            }
        },
        table: {
            columns: (data) => {

                var columns = []
                columns.push({
                    title: '线路名称',
                    key: 'title'
                })
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.text === "全部") continue;
                    if (columns.length >= 31) break;
                    columns.push({
                        title: item.text,
                        key: item.text
                    })
                }
                return columns;
            },
            data: (data) => {


                // 0:一般缺陷，1：严重缺陷
                var rowName = ["危急缺陷", "严重缺陷", "一般缺陷"];
                var haveOther = false;
                var tableData = [{ title: "危急缺陷" }, { title: "严重缺陷" }, { title: "一般缺陷" }, { title: "缺陷总数" }];
                var series = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.text === "全部") continue;
                    var text = item.text;

                    tableData[0][text] = 0
                    tableData[1][text] = 0
                    tableData[2][text] = 0
                    tableData[3][text] = item.count
                    item.data.forEach(subItem => {
                        var index = rowName.indexOf(subItem["DEFECT_LEVEL"]);
                        if (index !== -1) {

                            tableData[index][text]++
                            // zData[2][i].push(item["COUNT"])
                        }
                    })
                }
                // if (!haveOther) { tableData.pop() }
                return tableData;
            },
        }
    }
    this.lineBWStatistic = {
        statistickeys: ["BW"],
        statistictype: "count",
        title: "线路缺陷部位统计",
        top: -1,
        hidden: {
            category: true,
            table: false,
            sort: true,
            chart: false,
            header: false,
        },
        position: {
            full: 'left'
        },

        chart: {
            chart: "highchart",
            type: "pie3d",

            args: {
                name: "缺陷部位",
                namekey: "text",
                valuekey: "count",
            }
        },
        table: {
            columns: [
                {
                    title: '缺陷部位',
                    key: 'title'
                },
                {
                    title: '危急缺陷',
                    key: 'danger'
                },
                {
                    title: '严重缺陷',
                    key: 'serious'
                },
                {
                    title: '一般缺陷',
                    key: 'normal'
                },

                {
                    title: '缺陷总数',
                    key: 'total'
                },
            ],
            data: (data) => {
                if (data.length == 0) return []
                var isReverse = false;
                var sCount = data[0].count
                var eCount = data[data.length - 1].count
                if (sCount < eCount) {
                    isReverse = true
                }


                var tableData = []
                data.forEach(item => {
                    var orwData = item.data;
                    var normal = 0
                    var serious = 0
                    var danger = 0
                    orwData.forEach(subItem => {
                        subItem.DEFECT_LEVEL == "一般缺陷" ? normal = normal + 1 : ''
                        subItem.DEFECT_LEVEL == "严重缺陷" ? serious = serious + 1 : ''
                        subItem.DEFECT_LEVEL == "危急缺陷" ? danger = danger + 1 : ''
                    })
                    tableData.push({ title: item.text, normal: normal, serious: serious, danger: danger, total: item.count })
                })
                var top5TableData = []
                if (isReverse) {
                    top5TableData = tableData.slice(tableData.length - 5, tableData.length)
                } else {
                    top5TableData = tableData.slice(0, 5)
                }
                return top5TableData

            },
        }

    }
    this.lineBJStatistic = {
        statistickeys: ["BJ"],
        statistictype: "count",
        title: "线路缺陷部件统计",
        top: -1,
        hidden: {
            category: true,
            table: false,
            sort: true,
            chart: false,
            header: false,
        },
        position: {
            full: 'left'
        },
        chart: {
            chart: "highchart",
            type: "pie3d",
            args: {
                name: "缺陷部件",
                namekey: "text",
                valuekey: "count",
            }
        },
        table: {
            columns: [
                {
                    title: '缺陷部件',
                    key: 'title'
                },
                {
                    title: '危急缺陷',
                    key: 'danger'
                },
                {
                    title: '严重缺陷',
                    key: 'serious'
                },
                {
                    title: '一般缺陷',
                    key: 'normal'
                },

                {
                    title: '缺陷总数',
                    key: 'total'
                },
            ],
            data: (data) => {

                if (data.length == 0) return []
                var isReverse = false;
                var sCount = data[0].count
                var eCount = data[data.length - 1].count
                if (sCount < eCount) {
                    isReverse = true
                }


                var tableData = []
                data.forEach(item => {
                    var orwData = item.data;
                    var normal = 0
                    var serious = 0
                    var danger = 0
                    orwData.forEach(subItem => {
                        subItem.DEFECT_LEVEL == "一般缺陷" ? normal = normal + 1 : ''
                        subItem.DEFECT_LEVEL == "严重缺陷" ? serious = serious + 1 : ''
                        subItem.DEFECT_LEVEL == "危急缺陷" ? danger = danger + 1 : ''
                    })
                    tableData.push({ title: item.text, normal: normal, serious: serious, danger: danger, total: item.count })
                })
                var top5TableData = []
                if (isReverse) {
                    top5TableData = tableData.slice(tableData.length - 5, tableData.length)
                } else {
                    top5TableData = tableData.slice(0, 5)
                }
                return top5TableData

            },
        }
    }
    this.lineDefectCountStatistic = {
        statistickeys: ["BJ", "handeledYWDW", "DEFECT_LEVEL"],
        statistictype: "category",
        title: "运维单位缺陷次数排行",
        // top: 5,
        hidden: {
            category: false,
            table: false,
            sort: false,
            chart: false,
            header: false,
            more: true,
        },
        position: {
            table: "left",
            full: "left"
        },
        chart: {
            chart: "highchart",
            fun: (data) => {
                if (data.length == 0) return {}
                var isReverse = false;
                var sCount = data[0].count
                var eCount = data[data.length - 1].count
                if (sCount < eCount) {
                    isReverse = true
                }
                var allYWDW = ["国网蒙东电力", "国网天津电力", "国网河北电力", "国网山东电力", "国网山西电力", "国网冀北电力", "京隆电力", "内蒙古超高压"]

                var xData = [];
                // 0:一般缺陷，1：严重缺陷
                var seriesName = ["危急缺陷", "严重缺陷", "一般缺陷", "缺陷总数"];
                var zData = [[], [], [], []];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.text === "全部") continue;
                    var text = item.text;
                    xData.push(text)

                    var find1 = item.statistic.find(row => row.text == "危急缺陷")
                    var find2 = item.statistic.find(row => row.text == "严重缺陷")
                    var find3 = item.statistic.find(row => row.text == "一般缺陷")
                    zData[0].push(find1 ? find1.count : 0)
                    zData[1].push(find2 ? find2.count : 0)
                    zData[2].push(find3 ? find3.count : 0)
                    zData[3].push(item.count)
                }
                // var haveOther = false;
                var noCountYWDW = allYWDW.filter(item => !xData.find(row => row == item))
                noCountYWDW ? noCountYWDW : []
                if (isReverse) {
                    noCountYWDW.forEach(item => {
                        xData.unshift(item)
                        zData[0].unshift(0)
                        zData[1].unshift(0)
                        zData[2].unshift(0)
                        zData[3].unshift(0)
                        // series.unshift({ name: item, normal: 0, serious: 0, danger: 0, total: 0 })
                    })
                } else {
                    noCountYWDW.forEach(item => {
                        xData.push(item)
                        zData[0].push(0)
                        zData[1].push(0)
                        zData[2].push(0)
                        zData[3].push(0)
                        // series.push({ name: item, normal: 0, serious: 0, danger: 0, total: 0 })
                    })
                }
                var series = [];

                for (var i = 0; i < zData.length; i++) {
                    var row = zData[i];
                    // if (!haveOther && i === 2) continue;
                    series.push(
                        {
                            name: seriesName[i],
                            data: row,
                            stack: 'stack' + i
                        }
                    )
                }

                return {
                    chart: {
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 18,
                            beta: 1,
                            depth: 50,
                            // alpha: 15,
                            // beta: 15,
                            // viewDistance: 25,
                            // depth: 40
                        },
                        backgroundColor: null
                        // marginTop: 80,
                        // marginRight: 40
                    },
                    title: {
                        text: null
                    },
                    colors: ['#e1727a', '#ffb66f', '#6ed7ac', '#4C95DA'],
                    legend: {
                        itemStyle: {
                            color: '#fff', // 选中的图例项的文字颜色,
                            fontSize: '14px',
                        },
                        itemHoverStyle: {
                            color: '#aaa', // 未选中的图例项的文字颜色
                            fontSize: '14px',
                        },
                        itemHiddenStyle: {
                            color: '#ccc', // 未选中的图例项的文字颜色
                            fontSize: '14px',
                        },

                    },
                    xAxis: {
                        categories: xData,
                        gridLineColor: '#21A4F1',
                        labels: {
                            style: {
                                color: '#fff', // 设置颜色
                                fontSize: '16px', // 设置字体大小
                                // rotation: -45 // 设置倾斜角度
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: null
                        },
                        gridLineColor: '#21A4F1',
                        labels: {
                            style: {
                                color: '#fff', // 设置颜色
                                fontSize: '16px', // 设置字体大小
                                // rotation: -45 // 设置倾斜角度
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{point.key}</b><br>',
                        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}',
                        style: {
                            fontSize: '16px',
                            color: "#000"
                        }
                    },
                    // plotOptions: {
                    //     column: {
                    //         stacking: 'normal',
                    //         depth: 40
                    //     }
                    // },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            // pointWidth: 20,
                            // pointHeight: 20,
                            // depth: 25
                        }
                    },
                    series: series
                }



            },
        },
        table: {
            columns: [
                {
                    title: '运维单位',
                    key: 'title'
                },
                {
                    title: '危急缺陷',
                    key: 'danger'
                },
                {
                    title: '严重缺陷',
                    key: 'serious'
                },
                {
                    title: '一般缺陷',
                    key: 'normal'
                },

                {
                    title: '缺陷总数',
                    key: 'total'
                },
            ],
            data: (data) => {

                if (data.length == 0) return []
                var isReverse = false;
                var sCount = data[0].count
                var eCount = data[data.length - 1].count
                if (sCount < eCount) {
                    isReverse = true
                }
                var allYWDW = ["国网蒙东电力", "国网天津电力", "国网河北电力", "国网山东电力", "国网山西电力", "国网冀北电力", "京隆电力", "内蒙古超高压"]

                var tableData = []
                data.forEach(item => {
                    var find1 = item.statistic.find(row => row.text == "一般缺陷")
                    var find2 = item.statistic.find(row => row.text == "严重缺陷")
                    var find3 = item.statistic.find(row => row.text == "危急缺陷")
                    var normal = find1 ? find1.count : 0
                    var serious = find2 ? find2.count : 0
                    var danger = find3 ? find3.count : 0
                    tableData.push({ title: item.text, normal: normal, serious: serious, danger: danger, total: item.count })
                })
                var noCountYWDW = allYWDW.filter(item => !tableData.find(row => row.title == item))
                noCountYWDW ? noCountYWDW : []
                if (isReverse) {
                    noCountYWDW.forEach(item => {
                        tableData.unshift({ title: item, normal: 0, serious: 0, danger: 0, total: 0 })
                    })
                } else {
                    noCountYWDW.forEach(item => {
                        tableData.push({ title: item, normal: 0, serious: 0, danger: 0, total: 0 })
                    })
                }
                return tableData

            },
        }
    }
    var ywdwMap = {
        "国网蒙东电力": "国网蒙东",
        "国网天津电力": "国网天津",
        "国网河北电力": "国网河北",
        "国网山东电力": "国网山东",
        "国网山西电力": "国网山西",
        "国网冀北电力": "国网冀北",
        "京隆电力": "京隆",
        "内蒙古超高压": "内蒙古",
    }
    this.lineDBClick = function (row, column, tab) {
        var defectLevel = (row.title === '缺陷总数') ? '_ALL_' : row.title
        var name = column.title
        vMain.gotoApp("line_defect_search", { filter: { defectLevel: defectLevel, name: name } })
    }
    this.bwDBClick = function (row, column, tab) {
        var defectLevel = (column.title === '缺陷总数' || column.title === '缺陷部位') ? '_ALL_' : column.title
        var bw = row.title
        vMain.gotoApp("line_defect_search", { filter: { defectLevel: defectLevel, bw: bw } })
    }
    this.bjDBClick = function (row, column, tab) {
        var defectLevel = (column.title === '缺陷总数' || column.title === '缺陷部件') ? '_ALL_' : column.title
        var bj = row.title
        vMain.gotoApp("line_defect_search", { filter: { defectLevel: defectLevel, bj: bj } })
    }
    this.ywdwDBClick = function (row, column, tab) {
        var ywdw = ywdwMap[row.title]
        var defectLevel = (column.title === '缺陷总数' || column.title === '运维单位') ? '_ALL_' : column.title
        var bj = tab == '全部' ? '_ALL_' : tab
        vMain.gotoApp("line_defect_search", { filter: { defectLevel: defectLevel, ywdw: ywdw, bj: bj } })
    }
    this.searchByTime();
}//line结束