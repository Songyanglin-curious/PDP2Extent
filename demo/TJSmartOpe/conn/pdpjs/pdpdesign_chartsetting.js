/// <reference path="../jsfile/vue.js" />
/*
    echarts4.1.0配置
*/
//图表配置
var chartSetting = {
    //图例名称，有多少个图例就有多少个系列
    //图例的名称可以写成数组里包含json
    legend: [],
    //保存并返回echarts的option
    save: function () {
        var optionRet = new Object();
        var list = vChartSetting.formList;
        var collapse = vChartSetting.collapseTitle;
        //解析base
        for (var b in list.base) {
            var keys = b.split("_");
            var optionTemp = optionRet;
            for (var i = 0; i < keys.length; i++) {
                if (i === keys.length - 1) {
                    this.analysisOtherSettingSave(keys[i], list.base[b], optionRet[keys[0]]);
                    continue;
                }

                if (optionTemp[keys[i]] === undefined)
                    optionTemp[keys[i]] = {}
                optionTemp = optionTemp[keys[i]];
            }
        }
        //解析其它节点
        for (var optionKey in list) {
            if (optionKey === "base" || !vChartSetting.tabs[optionKey].isShowTabs) {
                if (optionKey !== "base" && optionKey !== "grid")
                    if (optionRet[optionKey] && !optionRet[optionKey].hasOwnProperty)
                        delete optionRet[optionKey];
                continue;
            }
            if (optionKey === "dataZoom")
                optionRet[optionKey] = [];
            this.analysisOtherSettingSave(optionKey, list[optionKey], optionRet, collapse[optionKey]);
        }
        //删除空节点和数组

        //解析完节点的操作
        if (vChartSetting.tabs["radar"].isShowTabs) {
            if (!optionRet.radar) optionRet.radar = {};
            delete optionRet.xAxis;
            delete optionRet.yAxis;
        }
        return optionRet;
    },
    //递归分析保存的成echarts的option
    analysisOtherSettingSave: function (key, value, optionRet, collapse) {
        if (value.hasOwnProperty("myValue")) {
            //等于默认值，或者禁用的，都不返回
            //save属性是强制保存
            //如果有valueFunc，则改变value值
            if (!value.save && (value.myValue == undefined || value.myValue === value.defaultValue || value.disabled || (value.isShow && value.isShow === false))) return;
            optionRet[key] = value.valueFunc ? this.valueFunc[value.valueFunc + "_save"](value.myValue) : value.myValue;
        } else {
            if (collapse && collapse[key] && collapse[key].isShow === false) return;//如果折叠框是隐藏的，不保存折叠框里面的内容
            var isArrayJson = Array.isArray(value) && value.length > 0 && isJson(value[0]);
            if (isArrayJson) {
                for (var j = 0; j < value.length; j++) {
                    if (optionRet[key] == undefined)
                        optionRet[key] = [];
                    this.analysisOtherSettingSave(j, value[j], optionRet[key]);
                }
            } else {
                for (var tempOptionKey in value) {
                    if (optionRet[key] == undefined)
                        optionRet[key] = {};
                    this.analysisOtherSettingSave(tempOptionKey, value[tempOptionKey], optionRet[key]);
                }
            }
            //空数据不保存
            if (JSON.stringify(optionRet[key]) === "{}" || (isArrayJson && optionRet[key].length === 0))
                delete optionRet[key];
            else if (isArrayJson) {
                var i = optionRet[key].length;
                while (i--) {
                    if (optionRet[key][i] == undefined) {
                        optionRet[key].splice(i, 1);
                    }
                }
                if (optionRet[key].length === 0) {
                    delete optionRet[key];
                }
            }
        }
    },
    //保存和读取的时候，对数据进行特殊处理的方法
    valueFunc: {
        changeArray_save: function (value) {
            return value.replace("，", ",").split(",");
        },
        changeArray_load: function (value) {
            return value.replace("，", ",").join(",");
        },
        changeBool_save: function (value) {
            switch (value) {
                case "true": return true;
                case "false": return false;
            }
            return value;
        },
        changeBool_load: function (value) {
            switch (value) {
                case true: return "true";
                case false: return "false";
            }
            return value;
        }
    },
    //是否是重新加载
    isFirstWatch: false,
    //第一次加载才会赋值
    chartSettingConfigureConst: undefined,
    //所有系列的配置
    seriesSettingAll: undefined,
    initialConstSetting: function () {
        //给下拉菜单中的选项赋值
        this.chartSettingConfigureConst = this.chartSettingConfigure;
        this.defaultType.seriesDefaultType.base.type.option = this.defaultOption.seriesType;
        this.defaultType.seriesDefaultType.base.label.position.option = this.defaultOption.labelPosition;
        this.defaultType.seriesDefaultType.line.symbol.option = this.defaultOption.icon;
        this.defaultType.seriesDefaultType.scatter.symbol.option = this.defaultOption.icon;
        this.defaultType.seriesDefaultType.effectScatter.symbol.option = this.defaultOption.icon;
        this.defaultType.seriesDefaultType.radar.symbol.option = this.defaultOption.icon;
        this.defaultType.textStyle.fontStyle.option = this.defaultOption.fontStyle;
        this.defaultType.textStyle.fontWeight.option = this.defaultOption.fontWeight;
        this.defaultType.textStyle.fontFamily.option = this.defaultOption.fontFamily;
        this.defaultType.axisDefault.type.option = this.defaultOption.axisType;
        //给各种textStyle赋值,然后改默认值
        this.defaultType.axisDefault.nameTextStyle = JSON.parse(JSON.stringify(this.defaultType.textStyle));
        this.chartSettingConfigureConst.title.textStyle = JSON.parse(JSON.stringify(this.defaultType.textStyle));
        this.chartSettingConfigureConst.title.textStyle.color.myValue = "#333";
        this.chartSettingConfigureConst.title.textStyle.color.defaultValue = "#333";
        this.chartSettingConfigureConst.title.textStyle.fontSize.myValue = "18";
        this.chartSettingConfigureConst.title.textStyle.fontSize.defaultValue = "18";
        this.chartSettingConfigureConst.title.subTextStyle = JSON.parse(JSON.stringify(this.defaultType.textStyle));
        this.chartSettingConfigureConst.title.subTextStyle.color.myValue = "#aaa";
        this.chartSettingConfigureConst.title.subTextStyle.color.defaultValue = "#aaa";
        this.chartSettingConfigureConst.textStyle = JSON.parse(JSON.stringify(this.defaultType.textStyle));
        this.chartSettingConfigureConst.textStyle.color.myValue = "#fff";
        this.chartSettingConfigureConst.textStyle.color.defaultValue = "#fff";
        this.chartSettingConfigureConst.tooltip.textStyle = JSON.parse(JSON.stringify(this.defaultType.textStyle));
        this.chartSettingConfigureConst.tooltip.textStyle.color.myValue = "#fff";
        this.chartSettingConfigureConst.tooltip.textStyle.color.defaultValue = "#fff";
        this.chartSettingConfigureConst.tooltip.textStyle.fontSize.myValue = "14";
        this.chartSettingConfigureConst.tooltip.textStyle.fontSize.defaultValue = "14";
        for (var style in this.defaultType.textStyle) {
            this.defaultType.seriesDefaultType.base.label[style] = JSON.parse(JSON.stringify(this.defaultType.textStyle[style]));
            this.chartSettingConfigureConst.radar.name[style] = JSON.parse(JSON.stringify(this.defaultType.textStyle[style]));
            this.defaultType.axisDefault.axisLabel[style] = JSON.parse(JSON.stringify(this.defaultType.textStyle[style]));
        }
        this.defaultType.seriesDefaultType.base.label.color.myValue = "#fff";
        this.defaultType.seriesDefaultType.base.label.color.defaultValue = "#fff";

        this.chartSettingConfigureConst.radar.name.color.myValue = "#fff";
        this.chartSettingConfigureConst.radar.name.color.defaultValue = "#fff";
        //默认系列高亮样式赋值
        this.defaultType.seriesDefaultType.base.emphasis.label = JSON.parse(JSON.stringify(this.defaultType.seriesDefaultType.base.label));
        this.defaultType.seriesDefaultType.base.emphasis.itemStyle = JSON.parse(JSON.stringify(this.defaultType.seriesDefaultType.base.itemStyle));
        this.defaultType.seriesDefaultType.base.emphasis.lineStyle = JSON.parse(JSON.stringify(this.defaultType.seriesDefaultType.base.lineStyle));
        this.defaultType.seriesDefaultType.base.emphasis.areaStyle = JSON.parse(JSON.stringify(this.defaultType.seriesDefaultType.base.areaStyle));
        //创建一个所有系列内容的集合
        this.seriesSettingAll = this.defaultType.seriesDefaultType.base;
        for (var seriesType in this.defaultType.seriesDefaultType) {
            if (seriesType === "base") continue;
            for (var seriesSetting in this.defaultType.seriesDefaultType[seriesType]) {
                if (!this.seriesSettingAll[seriesSetting])
                    this.seriesSettingAll[seriesSetting] = this.defaultType.seriesDefaultType[seriesType][seriesSetting];
            }
        }

        //加载横纵坐标轴
        this.chartSettingConfigureConst.xAxis.push(JSON.parse(JSON.stringify(this.defaultType.axisDefault)));
        this.chartSettingConfigureConst.xAxis.push(JSON.parse(JSON.stringify(this.defaultType.axisDefault)));
        this.chartSettingConfigureConst.xAxis[0].type.save = true;
        this.chartSettingConfigureConst.xAxis[0].type.defaultValue = "category";
        this.chartSettingConfigureConst.xAxis[0].type.myValue = "category";
        this.chartSettingConfigureConst.xAxis[1].type.defaultValue = "category";
        this.chartSettingConfigureConst.xAxis[1].type.myValue = "category";

        this.chartSettingConfigureConst.yAxis.push(JSON.parse(JSON.stringify(this.defaultType.axisDefault)));
        this.chartSettingConfigureConst.yAxis.push(JSON.parse(JSON.stringify(this.defaultType.axisDefault)));
        this.chartSettingConfigureConst.yAxis[0].type.save = true;

        //次坐标轴默认不显示
        this.chartSettingConfigureConst.xAxis[1].show.myValue = false;
        this.chartSettingConfigureConst.xAxis[1].show.defaultValue = false;
        this.chartSettingConfigureConst.yAxis[1].show.myValue = false;
        this.chartSettingConfigureConst.yAxis[1].show.defaultValue = false;

        //加载数据缩放
        this.chartSettingConfigureConst.dataZoom.push(JSON.parse(JSON.stringify(this.defaultType.dataZoomDefault.inside)));
        this.chartSettingConfigureConst.dataZoom.push(JSON.parse(JSON.stringify(this.defaultType.dataZoomDefault.slider)));
        delete this.chartSettingConfigureConst.dataZoom[0].yAxisIndex;
        delete this.chartSettingConfigureConst.dataZoom[1].yAxisIndex;
        this.chartSettingConfigureConst.dataZoom.push(JSON.parse(JSON.stringify(this.defaultType.dataZoomDefault.inside)));
        this.chartSettingConfigureConst.dataZoom.push(JSON.parse(JSON.stringify(this.defaultType.dataZoomDefault.slider)));
        delete this.chartSettingConfigureConst.dataZoom[2].xAxisIndex;
        delete this.chartSettingConfigureConst.dataZoom[3].xAxisIndex;
    },
    //初始化配置
    initialSetting: function (arrLegend, optionEcharts) {
        var optionEchartsTemp;
        if (optionEcharts)
            optionEchartsTemp = JSON.parse(JSON.stringify(optionEcharts));
        if (!this.chartSettingConfigureConst) {
            this.initialConstSetting();
        }
        //根据传入的option加载内容
        this.chartSettingConfigureCopy = JSON.parse(JSON.stringify(this.chartSettingConfigureConst));
        this.chartSettingTabsCopy = JSON.parse(JSON.stringify(this.chartSettingTabs));
        this.chartSettingCollapseTitleCopy = JSON.parse(JSON.stringify(this.chartSettingCollapseTitle));
        this.menuActiveNameCopy = JSON.parse(JSON.stringify(this.menuActiveNameDefault));
        this.isFirstWatch = true;

        //设置缩放控件显示
        if (optionEchartsTemp && optionEchartsTemp.dataZoom) {
            this.chartSettingTabsCopy.dataZoom.isShowTabs = true;
            this.chartSettingConfigureCopy.base.dataZoom.myValue = true;
        }
        //若图例不为空，初始化图例和系列（图例为空，图例和系列配置不可用，保存后，也不返回这两个）
        if (!Array.isArray(arrLegend))
            this.legend = [];
        else {
            if (arrLegend.length > 0) {
                //初始化图例和系列
                this.legend = arrLegend;
                for (var i = 0; i < this.legend.length; i++) {
                    var tempLegend = JSON.parse(JSON.stringify(this.defaultType.legendDataDefault));
                    tempLegend.name.desc = tempLegend.name.desc + (i + 1);
                    tempLegend.name.myValue = this.legend[i];
                    tempLegend.icon.desc = tempLegend.icon.desc + (i + 1);
                    //初始化图例图标的下拉菜单
                    tempLegend.icon.option = JSON.parse(JSON.stringify(this.defaultOption.icon));
                    this.chartSettingConfigureCopy.legend.data.push(tempLegend);
                }
                //如果有系列，先检查系列和图例的数量是否一致，和检查图例和系列的名称是否一致，如果两项检查有1项不匹配，则按照没有系列创建新系列
                var checkSeriesTrue; //检查系列是否通过
                if (this.legend.length > 0 && optionEchartsTemp && optionEchartsTemp.series && optionEchartsTemp.series.length > 0) {
                    if (this.legend.length === optionEchartsTemp.series.length) {
                        for (var l = 0; l < this.legend.length; l++) {
                            if (this.legend[l] !== optionEchartsTemp.series[l].name) {
                                checkSeriesTrue = false;
                                optionEchartsTemp.series = []; //不通过，则将传入的系列清空
                                break;
                            }
                            checkSeriesTrue = true;
                        }
                    }
                }
                //如果没有系列，则按照图例创建系列，系列均为折线图
                //有系列，并且上面检查合格，则改成对应系列类型
                for (var j = 0; j < this.legend.length; j++) {
                    var tempSeries = JSON.parse(JSON.stringify(this.seriesSettingAll));
                    tempSeries.name.myValue = this.legend[j];
                    tempSeries.type.myValue = checkSeriesTrue ? optionEchartsTemp.series[j].type : "line";
                    this.chartSettingConfigureCopy.series.push(tempSeries);
                }
                //系列的左边标签初始化，同事初始化每个系列内容的折叠框
                for (var k = 0; k < this.legend.length; k++) {
                    if (k === 0)
                        this.chartSettingTabsCopy.series.subTabs.push({ text: this.legend[k], isShowTabs: true, isShowContent: true });
                    else
                        this.chartSettingTabsCopy.series.subTabs.push({ text: this.legend[k], isShowTabs: true, isShowContent: false });
                    //折叠框
                    this.chartSettingCollapseTitleCopy.series.push(JSON.parse(JSON.stringify(this.seriesCollapseTitle)));
                }
            }
        }
        //不解析传入图例的名称，因为在上面已经赋值了
        if (optionEchartsTemp&&optionEchartsTemp.legend && optionEchartsTemp.legend.data && optionEchartsTemp.legend.data.length > 0 && isJson(optionEchartsTemp.legend.data[0])) {
            for (var m = 0; m < optionEchartsTemp.legend.data.length; m++) {
                if (optionEchartsTemp.legend.data[m].name)
                    delete optionEchartsTemp.legend.data[m].name;
            }
        }
        //加载传入的图表配置
        this.loadOption(optionEchartsTemp);

        //图例为空时，禁用图例和系列页签
        if (this.legend.length === 0) {
            this.chartSettingConfigureCopy.base.legend_show.myValue = false;
            this.chartSettingConfigureCopy.base.legend_show.disabled = true;
            //this.chartSettingTabsCopy.legend.isShowTabs = false;
            this.chartSettingTabsCopy.series.isShowTabs = false;
        }

        //其它显示
        this.chartSettingTabsCopy.legend.isShowTabs = this.chartSettingConfigureCopy.base.legend_show.myValue;
        this.chartSettingTabsCopy.grid.isShowTabs = this.chartSettingConfigureCopy.base.grid_show.myValue;
        this.chartSettingTabsCopy.tooltip.isShowTabs = this.chartSettingConfigureCopy.base.tooltip_show.myValue;
        this.chartSettingTabsCopy.title.isShowTabs = this.chartSettingConfigureCopy.base.title_show.myValue;
        if (vChartSetting) {
            refreshChartMenu();
            vChartSetting.collapseTitle = this.chartSettingCollapseTitleCopy;
            vChartSetting.formList = this.chartSettingConfigureCopy;
            vChartSetting.tabs = this.chartSettingTabsCopy;
        }
    },
    //加载传入的echarts的option
    loadOption: function (optionEchartsTemp) {
        if (optionEchartsTemp) {
            //先解析base的配置
            for (var b in this.chartSettingConfigureCopy.base) {
                var keys = b.split("_");
                var optionTemp = optionEchartsTemp;
                var tempValue;
                for (var i = 0; i < keys.length; i++) {
                    tempValue = optionTemp[keys[i]];
                    if (tempValue == undefined) continue;
                    if (i === keys.length - 1 && keys[0] !== "dataZoom") {
                        this.chartSettingConfigureCopy.base[b].myValue = tempValue;
                        break;
                    }
                    optionTemp = tempValue;
                }
            }
            //解析其它的配置
            for (var optionKey in optionEchartsTemp) {
                this.analysisOtherSettingLoad(optionKey, optionEchartsTemp[optionKey], this.chartSettingConfigureCopy[optionKey]);
            }
        }
    },
    //递归分析加载的option
    analysisOtherSettingLoad: function (key, value, configureValue) {
        var isArray = Array.isArray(value);
        if (isJson(value)) {
            for (var optionKey in value) {
                if (!configureValue[optionKey]) continue;
                this.analysisOtherSettingLoad(optionKey, value[optionKey], configureValue[optionKey]);
            }
        } else if (isArray) {
            for (var i = 0; i < value.length; i++) {
                if (!configureValue[i]) continue;
                this.analysisOtherSettingLoad(i, value[i], configureValue[i]);
            }
        }
        else {
            //不是Object就赋值
            if (configureValue)
                configureValue.myValue = configureValue.valueFunc ? this.valueFunc[configureValue.valueFunc + "_load"](value) : value;
        }
    },
    //标签名称
    chartSettingTabs: {
        base: { text: "基本配置", isShowTabs: true, isShowContent: true },
        title: { text: "标题", isShowTabs: true, isShowContent: false },
        legend: { text: "图例", isShowTabs: true, isShowContent: false },
        series: { text: "系列", isShowTabs: true, isShowContent: false, subTabs: [] },
        tooltip: { text: "提示框", isShowTabs: true, isShowContent: false },
        grid: { text: "网格", isShowTabs: false, isShowContent: false },
        xAxis: {
            text: "X轴", isShowTabs: true, isShowContent: false, subTabs: [
                { text: "主坐标轴", isShowTabs: true, isShowContent: true },
                { text: "次坐标轴", isShowTabs: true, isShowContent: false }
            ]
        },
        yAxis: {
            text: "Y轴", isShowTabs: true, isShowContent: false, subTabs: [
                { text: "主坐标轴", isShowTabs: true, isShowContent: true },
                { text: "次坐标轴", isShowTabs: true, isShowContent: false }
            ]
        },
        dataZoom: {
            text: "区域缩放", isShowTabs: false, isShowContent: false, subTabs: [
                { text: "x轴内缩放", isShowTabs: true, isShowContent: true },
                { text: "x轴外滑动缩放", isShowTabs: true, isShowContent: false },
                { text: "y轴内缩放", isShowTabs: true, isShowContent: false },
                { text: "y轴外滑动缩放", isShowTabs: true, isShowContent: false }
            ]
        },
        toolbox: { text: "工具栏", isShowTabs: false, isShowContent: false },
        textStyle: { text: "全局样式", isShowTabs: true, isShowContent: false },
        radar: { text: "雷达图配置", isShowTabs: false, isShowContent: false }
    },
    seriesCollapseTitle: {
        label: { title: "数据标签", isShow: true },
        rippleEffect: { title: "涟漪特效配置", isShow: false },
        itemStyle: { title: "折线拐点标志的样式", isShow: true },
        lineStyle: { title: "线条样式", isShow: true },
        areaStyle: { title: "区域填充样式", isShow: true },
        emphasis: {
            title: "图形的高亮样式", isShow: true,
            label: { title: "数据标签", isShow: true },
            itemStyle: { title: "折线拐点标志的样式", isShow: true },
            lineStyle: { title: "线条样式", isShow: true },
            areaStyle: { title: "区域填充样式", isShow: true }
        }
    },
    //折叠框标题
    chartSettingCollapseTitle: {
        base: {
            textStyle: { title: "全局文本样式", isShow: true }
        },
        title: {
            textStyle: { title: "主标题文本样式", isShow: true },
            subTextStyle: { title: "副标题文本样式", isShow: true }
        },
        legend: {
            data: { title: "图例名称和图标", isShow: true }
        },
        tooltip: {
            axisPointer: {
                title: "坐标轴指示器配置项", isShow: true,
                lineStyle: { title: "直线指示器配置", isShow: true },
                shadowStyle: { title: "阴影指示器配置", isShow: true },
                crossStyle: { title: "十字准星指示器配置", isShow: true }
            },
            textStyle: { title: "提示框文本样式", isShow: true }
        },
        series: [],
        xAxis: [{
            axisTick: { title: "坐标轴刻度", isShow: true },
            axisLine: { title: "坐标轴线", isShow: true },
            axisLabel: { title: "坐标轴刻度文字标签", isShow: true },
            nameTextStyle: { title: "坐标轴名称的文字样式", isShow: true }
        }, {
            axisTick: { title: "坐标轴刻度", isShow: true },
            axisLine: { title: "坐标轴线", isShow: true },
            axisLabel: { title: "坐标轴刻度文字标签", isShow: true },
            nameTextStyle: { title: "坐标轴名称的文字样式", isShow: true }
        }],
        yAxis: [{
            axisTick: { title: "坐标轴刻度", isShow: true },
            axisLine: { title: "坐标轴线", isShow: true },
            axisLabel: { title: "坐标轴刻度文字标签", isShow: true },
            nameTextStyle: { title: "坐标轴名称的文字样式", isShow: true }
        }, {
            axisTick: { title: "坐标轴刻度", isShow: true },
            axisLine: { title: "坐标轴线", isShow: true },
            axisLabel: { title: "坐标轴刻度文字标签", isShow: true },
            nameTextStyle: { title: "坐标轴名称的文字样式", isShow: true }
        }],
        radar: {
            name: { title: "顶点指示器名称配置", isShow: true },
            axisLine: {
                title: "坐标轴线配置", isShow: true, lineStyle: {
                    title: "坐标轴线样式", isShow: true
                }
            },
            axisTick: { title: "坐标轴刻度配置", isShow: true },
            splitLine: {
                title: "分隔线配置", isShow: true, lineStyle: {
                    title: "分隔线样式", isShow: true
                }
            },
            splitArea: {
                title: "分隔区域配置", isShow: true, areaStyle: {
                    title: "分隔区域样式", isShow: true
                }
            }
        }
    },
    //所有图表配置
    chartSettingConfigure: {
        base: {
            title_show: { desc: "显示标题", myValue: true, defaultValue: true, controlType: "checkbox", event: "controlDisabled", args: [{ control: ["tabs", "title", "isShowTabs"], turn: true }] },
            legend_show: { desc: "图例显示", myValue: true, defaultValue: true, controlType: "checkbox", event: "controlDisabled", args: [{ control: ["tabs", "legend", "isShowTabs"], turn: true }] },
            tooltip_show: { desc: "显示提示框", myValue: true, defaultValue: true, controlType: "checkbox", detail: "tooltip，鼠标悬浮显示的系列详细信息", event: "controlDisabled", args: [{ control: ["tabs", "tooltip", "isShowTabs"], turn: true }] },
            grid_show: { desc: "显示网格", myValue: false, defaultValue: false, controlType: "checkbox", detail: "", event: "controlDisabled", args: [{ control: ["tabs", "grid", "isShowTabs"], turn: true }] },
            dataZoom: { desc: "显示缩放区域", myValue: false, defaultValue: false, isShow: false, controlType: "checkbox", detail: "", event: "controlDisabled", args: [{ control: ["tabs", "dataZoom", "isShowTabs"], turn: true }] },
            animation: { desc: "开启动画", myValue: true, defaultValue: true, controlType: "checkbox" },
            backgroundColor: { desc: "背景色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: true },
            grid_left: { desc: "图表距离容器左侧距离", myValue: "10%", defaultValue: "10%", controlType: "input", detail: "可输入数值、百分数、left、center、right" },
            grid_top: { desc: "图表距离容器上侧距离", myValue: "60", defaultValue: "60", controlType: "input", detail: "可输入数值、百分数、top、middle、bottom" },
            grid_right: { desc: "图表距离容器右侧距离", myValue: "10%", defaultValue: "10%", controlType: "input", detail: "可输入数值、百分数" },
            grid_bottom: { desc: "图表距离容器下侧距离", myValue: "60", defaultValue: "60", controlType: "input", detail: "可输入数值、百分数" },
            grid_width: { desc: "图表宽度", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认为auto自适应，也可输入数值" },
            grid_height: { desc: "图表高度", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认为auto自适应，也可输入数值" }
        },
        title: {
            text: { desc: "主标题", myValue: "", defaultValue: "", controlType: "input", disabled: false, detail: "图表最上方的主标题" },
            link: { desc: "主标题跳转链接", myValue: "", defaultValue: "", controlType: "input", detail: "填写跳转地址后，点击后跳转到相应网址" },
            target: { desc: "主标题跳转方式", myValue: "blank", defaultValue: "blank", controlType: "select", option: [{ label: "新窗口", value: "blank" }, { label: "当前窗口", value: "self" }], clearable: false },
            textStyle: {},
            subtext: { desc: "副标题", myValue: "", defaultValue: "", controlType: "input", disabled: false, detail: "主标题下面的标题，可单独使用" },
            subLink: { desc: "副标题跳转", myValue: "", defaultValue: "", controlType: "input", detail: "填写跳转地址后，点击后跳转到相应网址" },
            subTarget: { desc: "副标题跳转方式", myValue: "blank", defaultValue: "blank", controlType: "select", option: [{ label: "新窗口", value: "blank" }, { label: "当前窗口", value: "self" }], clearable: false },
            subTextStyle: {},
            itemGap: { desc: "主副标题间距", myValue: "10", defaultValue: "10", controlType: "input", disabled: false },
            left: { desc: "距离容器左侧距离", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认是auto，还输入数值、百分数、left、center、right" },
            top: { desc: "距离容器上侧距离", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认是auto，还输入数值、百分数、top、middle、bottom" },
            right: { desc: "距离容器右侧距离", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认是auto，还输入数值、百分数" },
            bottom: { desc: "距离容器下侧距离", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认是auto，还输入数值、百分数" },
            backgroundColor: { desc: "标题背景色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "空是透明色" },
            borderColor: { desc: "标题的边框颜色", myValue: "#ccc", defaultValue: "#ccc", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
            borderWidth: { desc: "标题的边框线宽", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
            borderRadius: { desc: "标题的边框圆角半径", myValue: "0", defaultValue: "0", controlType: "input", detail: "绘制圆角矩形用" },
            shadowBlur: { desc: "图形阴影的模糊大小", myValue: "0", defaultValue: "0", controlType: "input", detail: "数值越大越模糊，一般设置为10" },
            shadowColor: { desc: "阴影颜色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
            shadowOffsetX: { desc: "阴影水平方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
            shadowOffsetY: { desc: "阴影垂直方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" }
        },
        legend: {
            data: [],
            selectedMode: { desc: "选择模式", myValue: "true", defaultValue: "true", controlType: "select", valueFunc: "changeBool", option: [{ label: "可选", value: "true" }, { label: "不可选", value: "false" }, { label: "单选", value: "single" }, { label: "多选", value: "multiple" }], clearable: false },
            left: { desc: "距离容器左侧距离", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认是auto，还输入数值、百分数、left、center、right" },
            top: { desc: "距离容器上侧距离", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认是auto，还输入数值、百分数、top、middle、bottom" },
            right: { desc: "距离容器右侧距离", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认是auto，还输入数值、百分数" },
            bottom: { desc: "距离容器下侧距离", myValue: "auto", defaultValue: "auto", controlType: "input", detail: "默认是auto，还输入数值、百分数" },
            orient: { desc: "图例列表的布局朝向", myValue: "horizontal", defaultValue: "horizontal", controlType: "select", option: [{ label: "水平", value: "horizontal" }, { label: "垂直", value: "vertical" }], clearable: false },
            itemGap: { desc: "图例之间的间隔", myValue: "10", defaultValue: "10", controlType: "input", disabled: false },
            itemWidth: { desc: "图例标记的图形宽度", myValue: "25", defaultValue: "25", controlType: "input", disabled: false },
            itemHeight: { desc: "图例标记的图形高度", myValue: "14", defaultValue: "14", controlType: "input", disabled: false },
            inactiveColor: { desc: "图例关闭时的颜色", myValue: "#ccc", defaultValue: "#ccc", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
            backgroundColor: { desc: "图例背景色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "空是透明色" },
            borderColor: { desc: "图例的边框颜色", myValue: "#ccc", defaultValue: "#ccc", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
            borderWidth: { desc: "图例的边框线宽", myValue: "1", defaultValue: "1", controlType: "input", detail: "" },
            borderRadius: { desc: "图例的边框圆角半径", myValue: "0", defaultValue: "0", controlType: "input", detail: "绘制圆角矩形用" },
            shadowBlur: { desc: "图形阴影的模糊大小", myValue: "0", defaultValue: "0", controlType: "input", detail: "数值越大越模糊，一般设置为10" },
            shadowColor: { desc: "阴影颜色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
            shadowOffsetX: { desc: "阴影水平方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
            shadowOffsetY: { desc: "阴影垂直方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" }
        },
        tooltip: {
            trigger: { desc: "触发类型", myValue: "item", defaultValue: "item", controlType: "select", option: [{ label: "数据项", value: "item" }, { label: "坐标轴", value: "axis" }, { label: "不提示", value: "none" }], clearable: false, detail: "数据项:鼠标移动到数据点上提示；坐标轴：鼠标移动在坐标轴上提示" },
            axisPointer: {
                type: { desc: "指示器类型", myValue: "line", defaultValue: "line", controlType: "select", option: [{ label: "直线指示器", value: "line" }, { label: "阴影指示器", value: "shadow" }, { label: "十字准星指示器", value: "cross" }], clearable: false, detail: "" },
                lineStyle: {
                    color: { desc: "线的颜色", myValue: "#555", defaultValue: "#555", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                    width: { desc: "线宽", myValue: "1", defaultValue: "1", controlType: "input", detail: "可输入数值" },
                    type: { desc: "线的类型", myValue: "solid", defaultValue: "solid", controlType: "select", option: [{ label: "直线", value: "solid" }, { label: "虚线", value: "dashed" }, { label: "点虚线", value: "dotted" }], clearable: false }
                },
                shadowStyle: {
                    color: { desc: "阴影的颜色", myValue: "rgba(150,150,150,0.3)", defaultValue: "rgba(150,150,150,0.3)", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" }
                },
                crossStyle: {
                    color: { desc: "线的颜色", myValue: "#555", defaultValue: "#555", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                    width: { desc: "线宽", myValue: "1", defaultValue: "1", controlType: "input", detail: "可输入数值" },
                    type: { desc: "线的类型", myValue: "dashed", defaultValue: "dashed", controlType: "select", option: [{ label: "直线", value: "solid" }, { label: "虚线", value: "dashed" }, { label: "点虚线", value: "dotted" }], clearable: false }
                }
            },
            showContent: { desc: "是否显示提示内容", myValue: true, defaultValue: true, controlType: "checkbox", detail: "取消此选项，不会提示数据内容。但若配置指示器，则只显示指示器" },
            alwaysShowContent: { desc: "总是显示提示内容", myValue: false, defaultValue: false, controlType: "checkbox", detail: "鼠标移出图表，数据提示依然在" },
            triggerOn: { desc: "提示框触发的条件", myValue: "line", defaultValue: "line", controlType: "select", option: [{ label: "默认", value: "" }, { label: "鼠标移动时提示", value: "mousemove" }, { label: "鼠标点击时提示", value: "click" }], clearable: false, detail: "" },
            confine: { desc: "限制提示区域", myValue: false, defaultValue: false, controlType: "checkbox", detail: "选中后，若提示框内容超出图表区域，则会被截断" },
            position: { desc: "提示框浮层的位置", myValue: "", defaultValue: "", controlType: "select", option: [{ label: "默认", value: "" }, { label: "图形内部", value: "inside" }, { label: "图形上侧", value: "top" }, { label: "图形左侧", value: "left" }, { label: "图形右侧", value: "right" }, { label: "图形底恻", value: "bottom" }], clearable: false, detail: "默认不设置时位置会跟随鼠标的位置。设置后只在触发类型为“数据项”有效" },
            backgroundColor: { desc: "提示框背景色", myValue: "rgba(50,50,50,0.7)", defaultValue: "rgba(50,50,50,0.7)", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
            borderColor: { desc: "提示框边框颜色", myValue: "#333", defaultValue: "#333", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
            borderWidth: { desc: "提示框边框宽", myValue: "0", defaultValue: "0", controlType: "input", detail: "可输入数值" },
            textStyle: {}
        },
        grid: {
            backgroundColor: { desc: "网格背景色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "默认是透明的" },
            borderColor: { desc: "网格边框颜色", myValue: "#ccc", defaultValue: "#ccc", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
            borderWidth: { desc: "网格边线宽度", myValue: "1", defaultValue: "1", controlType: "input", detail: "可输入数值" }
        },
        xAxis: [],
        yAxis: [],
        series: [],
        dataZoom: [],
        toolbox: {

        },
        textStyle: {

        },
        radar: {
            name: {
                show: { desc: "显示指示器名称", myValue: true, defaultValue: true, controlType: "checkbox" }
            },
            nameGap: { desc: "指示器名称和指示器轴的距离", myValue: "15", defaultValue: "15", controlType: "input", detail: "" },
            splitNumber: { desc: "指示器轴的分割段数", myValue: "5", defaultValue: "5", controlType: "input", detail: "雷达图上内部轴线的数量" },
            shape: { desc: "雷达图轴的绘制形状", myValue: "polygon", defaultValue: "polygon", controlType: "select", option: [{ label: "多边形", value: "polygon" }, { label: "圆形", value: "circle" }], clearable: false },
            axisLine: {
                show: { desc: "显示坐标轴线", myValue: true, defaultValue: true, controlType: "checkbox" },
                symbol: { desc: "轴线两边的箭头", myValue: "none,none", defaultValue: "none,none", valueFunc: "changeArray", controlType: "select", option: [{ label: "无", value: "none,none" }, { label: "指向末端", value: "none,arrow" }, { label: "指向初端", value: "arrow,none" }, { label: "两边都显示", value: "arrow,arrow" }], clearable: false },
                lineStyle: {
                    color: { desc: "坐标轴线颜色", myValue: "#333", defaultValue: "#333", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                    width: { desc: "坐标轴线宽度", myValue: "1", defaultValue: "1", controlType: "input" },
                    type: { desc: "线的类型", myValue: "solid", defaultValue: "solid", controlType: "select", option: [{ label: "直线", value: "solid" }, { label: "虚线", value: "dashed" }, { label: "点虚线", value: "dotted" }], clearable: false }
                }
            },
            axisTick: {
                show: { desc: "显示坐标轴刻度", myValue: false, defaultValue: false, controlType: "checkbox" },
                inside: { desc: "坐标轴刻度朝内", myValue: false, defaultValue: false, controlType: "checkbox", detail: "不选中，刻度朝外" },
                length: { desc: "坐标轴刻度的长度", myValue: "5", defaultValue: "5", controlType: "input", disabled: false }
            },
            splitLine: {
                show: { desc: "显示分隔线", myValue: true, defaultValue: true, controlType: "checkbox" },
                lineStyle: {
                    color: { desc: "分隔线颜色", myValue: "#ccc", defaultValue: "#ccc", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                    width: { desc: "分隔线宽度", myValue: "1", defaultValue: "1", controlType: "input" },
                    type: { desc: "分隔线的类型", myValue: "solid", defaultValue: "solid", controlType: "select", option: [{ label: "直线", value: "solid" }, { label: "虚线", value: "dashed" }, { label: "点虚线", value: "dotted" }], clearable: false }
                }
            },
            splitArea: {
                show: { desc: "显示分隔区域", myValue: true, defaultValue: true, controlType: "checkbox" },
                areaStyle: {
                    color: { desc: "分隔线区域颜色", myValue: "#ccc", defaultValue: "#ccc", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                }
            }
        }
    },
    //图表默认类型配置
    defaultType: {
        //系列默认配置
        seriesDefaultType: {
            base: {
                name: { desc: "系列名称", myValue: "", defaultValue: "", controlType: "input", disabled: true, save: true, isShow: false, detail: "" },
                type: { desc: "系列类型", myValue: "", defaultValue: "", controlType: "select", option: [], save: true, clearable: false, detail: "当前系列显示类型，每个系列都有自己的配置项" },
                animation: { desc: "开启动画", myValue: true, defaultValue: true, controlType: "checkbox" },
                label: {
                    show: { desc: "显示标签", myValue: false, defaultValue: false, controlType: "checkbox", detail: "该系列是否在图表上显示具体数字" },
                    position: { desc: "标签位置", myValue: "top", defaultValue: "top", controlType: "select", option: [], clearable: false },
                    distance: { desc: "距离图形元素的距离", myValue: "5", defaultValue: "5", controlType: "input", detail: "" },
                    rotate: { desc: "标签旋转", myValue: "0", defaultValue: "0", controlType: "input", detail: "从 -90 度到 90 度。正值是逆时针" }
                },
                itemStyle: {
                    color: { desc: "图形颜色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "空时为自适应颜色" },
                    borderColor: { desc: "图形描边颜色", myValue: "#000", defaultValue: "#000", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
                    borderWidth: { desc: "图形描边线宽度", myValue: "0", defaultValue: "0", controlType: "input", detail: "可输入数值" },
                    borderType: { desc: "图形描边类型", myValue: "solid", defaultValue: "solid", controlType: "select", option: [{ label: "直线", value: "solid" }, { label: "虚线", value: "dashed" }, { label: "点虚线", value: "dotted" }], clearable: false },
                    shadowBlur: { desc: "图形阴影的模糊大小", myValue: "0", defaultValue: "0", controlType: "input", detail: "数值越大越模糊，一般设置为10" },
                    shadowColor: { desc: "阴影颜色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
                    shadowOffsetX: { desc: "阴影水平方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
                    shadowOffsetY: { desc: "阴影垂直方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
                    opacity: { desc: "图形透明度", myValue: "1", defaultValue: "1", controlType: "input", detail: "支持从0到1的数字，为0时不绘制该图形。" }
                },
                lineStyle: {
                    color: { desc: "线条颜色", myValue: "#000", defaultValue: "#000", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                    width: { desc: "线宽度", myValue: "2", defaultValue: "2", controlType: "input", detail: "可输入数值" },
                    type: { desc: "线类型", myValue: "solid", defaultValue: "solid", controlType: "select", option: [{ label: "直线", value: "solid" }, { label: "虚线", value: "dashed" }, { label: "点虚线", value: "dotted" }], clearable: false },
                    shadowBlur: { desc: "图形阴影的模糊大小", myValue: "0", defaultValue: "0", controlType: "input", detail: "数值越大越模糊，一般设置为10" },
                    shadowColor: { desc: "阴影颜色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
                    shadowOffsetX: { desc: "阴影水平方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
                    shadowOffsetY: { desc: "阴影垂直方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
                    opacity: { desc: "图形透明度", myValue: "1", defaultValue: "1", controlType: "input", detail: "支持从0到1的数字，为0时不绘制该图形。" }
                },
                areaStyle: {
                    color: { desc: "填充颜色", myValue: "#000", defaultValue: "#000", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                    type: { desc: "线类型", myValue: "solid", defaultValue: "solid", controlType: "select", option: [{ label: "直线", value: "solid" }, { label: "虚线", value: "dashed" }, { label: "点虚线", value: "dotted" }], clearable: false },
                    shadowBlur: { desc: "图形阴影的模糊大小", myValue: "0", defaultValue: "0", controlType: "input", detail: "数值越大越模糊，一般设置为10" },
                    shadowColor: { desc: "阴影颜色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
                    shadowOffsetX: { desc: "阴影水平方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
                    shadowOffsetY: { desc: "阴影垂直方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
                    opacity: { desc: "图形透明度", myValue: "1", defaultValue: "1", controlType: "input", detail: "支持从0到1的数字，为0时不绘制该图形。" }
                },
                emphasis: {
                    //高亮配置和非高亮配置项一样，初始化赋值
                    label: {},
                    itemStyle: {},
                    lineStyle: {},
                    areaStyle: {}
                }
            },
            //初始化时显示line，其余都是不显示
            line: {
                z: { desc: "图形的前后顺序", myValue: "2", defaultValue: "2", controlType: "input", detail: "", isShow: false },
                xAxisIndex: { desc: "系列使用的x轴", myValue: "0", defaultValue: "0", controlType: "select", isShow: false, option: [{ label: "x主坐标轴", value: "0" }, { label: "x次坐标轴", value: "1" }], clearable: false },
                yAxisIndex: { desc: "系列使用的y轴", myValue: "0", defaultValue: "0", controlType: "select", isShow: false, option: [{ label: "y主坐标轴", value: "0" }, { label: "y次坐标轴", value: "1" }], clearable: false },
                showSymbol: { desc: "是否显示标记", myValue: true, defaultValue: true, controlType: "checkbox", detail: "", isShow: false },
                symbol: { desc: "标记的图形", myValue: "", defaultValue: "", controlType: "select", option: [], clearable: true, isShow: false, detail: "折线上数据点标记的图形" },
                symbolSize: { desc: "标记的大小", myValue: "4", defaultValue: "4", controlType: "input", isShow: false, detail: "" },
                stack: { desc: "堆叠组名", myValue: "", defaultValue: "", controlType: "input", isShow: false, detail: "系列中，相同的堆叠组名会按堆叠显示" },
                connectNulls: { desc: "是否连接空数据", myValue: false, defaultValue: false, isShow: false, controlType: "checkbox", detail: "" },
                step: { desc: "是否为阶梯图", myValue: '', defaultValue: '', controlType: "select", clearable: false, isShow: false, option: [{ label: "否", value: "" }, { label: "当前点拐弯", value: "start" }, { label: "两点之间拐弯", value: "middle" }, { label: "接近下一个点拐弯", value: "end" }], detail: "可设置阶梯图的拐弯点" },
                smooth: { desc: "是否平滑曲线显示", myValue: false, defaultValue: false, controlType: "checkbox", detail: "", isShow: false }
            },
            bar: {
                xAxisIndex: { desc: "系列使用的x轴", myValue: "0", defaultValue: "0", controlType: "select", isShow: false, option: [{ label: "x主坐标轴", value: "0" }, { label: "x次坐标轴", value: "1" }], clearable: false },
                yAxisIndex: { desc: "系列使用的y轴", myValue: "0", defaultValue: "0", controlType: "select", isShow: false, option: [{ label: "y主坐标轴", value: "0" }, { label: "y次坐标轴", value: "1" }], clearable: false },
                stack: { desc: "堆叠组名", myValue: "", defaultValue: "", controlType: "input", isShow: false, detail: "系列中，相同的堆叠组名会按堆叠显示" },
                barWidth: { desc: "柱条的宽度", myValue: "", defaultValue: "", controlType: "input", isShow: false, detail: "空为自适应，需要设置在最后一个系列上才有效。可填写数字和百分比数" },
                barGap: { desc: "不同系列柱条间的距离", myValue: "30%", defaultValue: "30%", controlType: "input", isShow: false, detail: "需要设置在最后一个系列上才有效。可填写数字和百分比数" },
                barCategoryGap: { desc: "相同系列柱条间的距离", myValue: "20%", defaultValue: "20%", controlType: "input", isShow: false, detail: "需要设置在最后一个系列上才有效。可填写数字和百分比数" }
            },
            pie: {
                center: { desc: "饼图的中心（圆心）坐标", myValue: "50%,50%", defaultValue: "50%,50%", valueFunc: "changeArray", controlType: "input", isShow: false, detail: "第一项是横坐标，第二项是纵坐标，支持数字和百分比数" },
                radius: { desc: "饼图的半径", myValue: "0,75%", defaultValue: "0,75%", valueFunc: "changeArray", controlType: "input", isShow: false, detail: "第一项是内半径，第二项是外半径，支持数字和百分比数" },
                hoverOffset: { desc: "高亮扇区的偏移距离", myValue: "10", defaultValue: "10", controlType: "input", isShow: false, detail: "" },
                selectedMode: { desc: "选中模式", myValue: 'single', defaultValue: 'single', controlType: "select", clearable: false, isShow: false, option: [{ label: "单选", value: "single" }, { label: "多选", value: "multiple" }], detail: "可选中多个模块" },
                selectedOffset: { desc: "选中扇区的偏移距离", myValue: "10", defaultValue: "10", controlType: "input", isShow: false, detail: "" },
                clockwise: { desc: "扇区是否是顺时针排布", myValue: true, defaultValue: true, controlType: "checkbox", detail: "", isShow: false },
                startAngle: { desc: "起始角度", myValue: "90", defaultValue: "90", controlType: "input", isShow: false, detail: "填写范围在0-360" },
                roseType: { desc: "通过半径区分数据大小", myValue: '', defaultValue: '', controlType: "select", clearable: false, isShow: false, option: [{ label: "否", value: "" }, { label: "是", value: "radius" }, { label: "仅半径", value: "area" }], detail: "是：扇区圆心角展现数据的百分比，半径展现数据的大小；仅半径：所有扇区圆心角相同，仅通过半径展现数据大小" },
                animationType: { desc: "初始动画效果", myValue: 'expansion', defaultValue: 'expansion', controlType: "select", clearable: false, isShow: false, option: [{ label: "圆弧展开", value: "expansion" }, { label: "圆弧缩放", value: "scale" }] }
            },
            scatter: {
                xAxisIndex: { desc: "系列使用的x轴", myValue: "0", defaultValue: "0", controlType: "select", isShow: false, option: [{ label: "x主坐标轴", value: "0" }, { label: "x次坐标轴", value: "1" }], clearable: false },
                yAxisIndex: { desc: "系列使用的y轴", myValue: "0", defaultValue: "0", controlType: "select", isShow: false, option: [{ label: "y主坐标轴", value: "0" }, { label: "y次坐标轴", value: "1" }], clearable: false },
                symbol: { desc: "标记的图形", myValue: "circle", defaultValue: "circle", controlType: "select", option: [], clearable: true, isShow: false, detail: "坐标轴上数据点标记的图形" },
                symbolSize: { desc: "标记的大小", myValue: "10", defaultValue: "10", controlType: "input", isShow: false, detail: "" }
            },
            effectScatter: {
                xAxisIndex: { desc: "系列使用的x轴", myValue: "0", defaultValue: "0", controlType: "select", isShow: false, option: [{ label: "x主坐标轴", value: "0" }, { label: "x次坐标轴", value: "1" }], clearable: false },
                yAxisIndex: { desc: "系列使用的y轴", myValue: "0", defaultValue: "0", controlType: "select", isShow: false, option: [{ label: "y主坐标轴", value: "0" }, { label: "y次坐标轴", value: "1" }], clearable: false },
                symbol: { desc: "标记的图形", myValue: "circle", defaultValue: "circle", controlType: "select", option: [], clearable: true, isShow: false, detail: "坐标轴上数据点标记的图形" },
                symbolSize: { desc: "标记的大小", myValue: "10", defaultValue: "10", controlType: "input", isShow: false, detail: "" },
                rippleEffect: {
                    period: { desc: "动画时间", myValue: "4", defaultValue: "4", controlType: "input", isShow: true, detail: "" },
                    scale: { desc: "动画中波纹缩放比例", myValue: "2.5", defaultValue: "2.5", controlType: "input", isShow: true, detail: "" },
                    brushType: { desc: "波纹绘制方式", myValue: "fill", defaultValue: "fill", controlType: "select", isShow: true, option: [{ label: "填充颜色水波纹", value: "fill" }, { label: "普通水波纹", value: "stroke" }], clearable: false }
                }
            },
            radar: {
                symbol: { desc: "标记的图形", myValue: "circle", defaultValue: "circle", controlType: "select", option: [], clearable: true, isShow: false, detail: "坐标轴上数据点标记的图形" },
                symbolSize: { desc: "标记的大小", myValue: "4", defaultValue: "4", controlType: "input", isShow: false, detail: "" }
            }
        },
        //默认坐标轴配置 横纵坐标轴，主次坐标轴都使用它
        axisDefault: {
            show: { desc: "显示坐标轴", myValue: true, defaultValue: true, controlType: "checkbox" },
            name: { desc: "坐标轴名称", myValue: "", defaultValue: "", controlType: "input", disabled: false },
            nameLocation: { desc: "坐标轴名称显示位置", myValue: "end", defaultValue: "end", controlType: "select", option: [{ label: "顶端", value: "start" }, { label: "中部", value: "middle" }, { label: "末端", value: "end" }], clearable: false },
            type: { desc: "坐标轴类型", myValue: "value", defaultValue: "value", controlType: "select", option: [], clearable: false },
            min: { desc: "坐标轴最小刻度", myValue: "", defaultValue: "", controlType: "input", disabled: false, detail: "坐标轴为值类型有效" },
            max: { desc: "坐标轴最大刻度", myValue: "", defaultValue: "", controlType: "input", disabled: false, detail: "坐标轴为值类型有效" },
            scale: { desc: "是否是脱离 0 值比例", myValue: false, defaultValue: false, controlType: "checkbox", disabled: false, detail: "选择后坐标刻度不会强制包含零刻度，设置最大最小刻度后，此选项无效" },
            inverse: { desc: "反向坐标轴", myValue: false, defaultValue: false, controlType: "checkbox", disabled: false, detail: "" },
            splitNumber: { desc: "坐标轴的分割段数", myValue: "", defaultValue: "", controlType: "input", disabled: false, detail: "在类目轴中无效" },
            axisTick: {
                show: { desc: "是否显示坐标轴刻度", myValue: true, defaultValue: true, controlType: "checkbox" },
                inside: { desc: "坐标轴刻度朝内", myValue: false, defaultValue: false, controlType: "checkbox", detail: "不选中，刻度朝外" },
                length: { desc: "坐标轴刻度的长度", myValue: "5", defaultValue: "5", controlType: "input", disabled: false }
            },
            axisLine: {
                show: { desc: "显示坐标轴线", myValue: true, defaultValue: true, controlType: "checkbox" },
                onZero: { desc: "坐标轴线在0刻度上", myValue: true, defaultValue: true, controlType: "checkbox", detail: "取消此选项，坐标轴会以最小值为轴线" },
                symbol: { desc: "轴线两边的箭头", myValue: "none,none", defaultValue: "none,none", valueFunc: "changeArray", controlType: "select", option: [{ label: "无", value: "none,none" }, { label: "指向末端", value: "none,arrow" }, { label: "指向初端", value: "arrow,none" }, { label: "两边都显示", value: "arrow,arrow" }], clearable: false }
            },
            axisLabel: {
                show: { desc: "是否显示刻度标签", myValue: true, defaultValue: true, controlType: "checkbox" },
                inside: { desc: "刻度标签是否朝内", myValue: false, defaultValue: false, controlType: "checkbox", detail: "未选中未朝外" },
                rotate: { desc: "刻度标签旋转的角度", myValue: "0", defaultValue: "0", controlType: "input", detail: "旋转的角度从 -90 度到 90 度" },
                margin: { desc: "刻度标签与轴线之间的距离", myValue: "8", defaultValue: "8", controlType: "input" },
                backgroundColor: { desc: "文字背景色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "空是透明色" },
                borderColor: { desc: "文字的边框颜色", myValue: "#ccc", defaultValue: "#ccc", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                borderWidth: { desc: "文字的边框线宽", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
                borderRadius: { desc: "文字的边框圆角半径", myValue: "0", defaultValue: "0", controlType: "input", detail: "绘制圆角矩形用" },
                shadowBlur: { desc: "文字阴影的模糊大小", myValue: "0", defaultValue: "0", controlType: "input", detail: "数值越大越模糊，一般设置为10" },
                shadowColor: { desc: "文字阴影颜色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
                shadowOffsetX: { desc: "文字阴影水平方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" },
                shadowOffsetY: { desc: "文字阴影垂直方向上的偏移距离", myValue: "0", defaultValue: "0", controlType: "input", detail: "" }
            },
            nameTextStyle: {}
        },
        //图例数据默认配置
        legendDataDefault: {
            name: { desc: "图例名称", myValue: "", defaultValue: "", controlType: "input", disabled: true, save: true },
            icon: { desc: "图例图标", myValue: "", defaultValue: "", controlType: "select", option: [], clearable: true }
        },
        textStyle: {
            color: { desc: "文字颜色", myValue: "", defaultValue: "", controlType: "color", disabled: false, recommend: true, alpha: false },
            fontStyle: { desc: "文字的风格", myValue: "normal", defaultValue: "normal", controlType: "select", option: [], detail: "若存在不能倾斜的字体，清选择强制倾斜" },
            fontWeight: { desc: "文字的粗细", myValue: "normal", defaultValue: "normal", controlType: "select", option: [] },
            fontFamily: { desc: "字体", myValue: "sans-serif", defaultValue: "sans-serif", controlType: "select", option: [], clearable: false },
            fontSize: { desc: "字号", myValue: "12", defaultValue: "12", controlType: "input" }
            //lineHeight: {},
            //textBorderColor: {},
            //textBorderWidth: {},
            //textShadowColor: {},
            //textShadowBlur: {},
            //textShadowOffsetX: {},
            //textShadowOffsetY: {}
        },
        dataZoomDefault: {
            inside: {
                type: { desc: "缩放组件类型", myValue: "inside", defaultValue: "inside", controlType: "input", isShow: false, save: true },
                xAxisIndex: { desc: "x轴索引", myValue: "0", defaultValue: "0", controlType: "input", isShow: false, save: true, detail: "不再前台控制" },
                yAxisIndex: { desc: "y轴索引", myValue: "0", defaultValue: "0", controlType: "input", isShow: false, save: true, detail: "不再前台控制" },
                disabled: { desc: "停用此功能", myValue: false, defaultValue: false, controlType: "checkbox" },
                start: { desc: "数据起始百分比", myValue: "0", defaultValue: "0", controlType: "input", detail: "数据范围的起始百分比" },
                end: { desc: "数据结束百分比", myValue: "100", defaultValue: "100", controlType: "input", detail: "数据范围的结束百分比" },
                startValue: { desc: "数据起始具体数值", myValue: "", defaultValue: "", controlType: "input", detail: "如果设置了“数据起始百分比”，此配置无效" },
                endValue: { desc: "数据结束具体数值", myValue: "", defaultValue: "", controlType: "input", detail: "如果设置了“数据结束百分比”，此配置无效" },
                zoomLock: { desc: "锁定选择区域", myValue: false, defaultValue: false, controlType: "checkbox", detail: "选中后，只能平移不能缩放" },
                zoomOnMouseWheel: { desc: "数据缩放方式", myValue: "true", defaultValue: "true", valueFunc: "changeBool", controlType: "select", option: [{ label: "只用鼠标滚轮缩放", value: "true" }, { label: "禁止缩放", value: "false" }, { label: "按住shift缩放", value: "shift" }, { label: "按住ctrl缩放", value: "ctrl" }, { label: "按住alt缩放", value: "alt" }], detail: "不加任意键，只动鼠标滚轮可缩放" },
                moveOnMouseMove: { desc: "数据平移方式", myValue: "true", defaultValue: "true", valueFunc: "changeBool", controlType: "select", option: [{ label: "只按住鼠标左键移动", value: "true" }, { label: "禁止移动", value: "false" }, { label: "按住shift移动", value: "shift" }, { label: "按住ctrl移动", value: "ctrl" }, { label: "按住alt移动", value: "alt" }], detail: "不加任意键，只按鼠标左键可移动" }
            },
            slider: {
                type: { desc: "缩放组件类型", myValue: "slider", defaultValue: "slider", controlType: "input", isShow: false, save: true },
                xAxisIndex: { desc: "x轴索引", myValue: "0", defaultValue: "0", controlType: "input", isShow: false, save: true, detail: "不再前台控制" },
                yAxisIndex: { desc: "y轴索引", myValue: "0", defaultValue: "0", controlType: "input", isShow: false, save: true, detail: "不再前台控制" },
                show: { desc: "显示滚动条", myValue: true, defaultValue: true, controlType: "checkbox" },
                backgroundColor: { desc: "组件背景色", myValue: "rgba(47,69,84,0)", defaultValue: "rgba(47,69,84,0)", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                fillerColor: { desc: "组件滚动条颜色", myValue: "rgba(167,183,204,0.4)", defaultValue: "rgba(167,183,204,0.4)", controlType: "color", disabled: false, recommend: true, alpha: true, detail: "" },
                borderColor: { desc: "组件边框颜色", myValue: "#ddd", defaultValue: "#ddd", controlType: "color", disabled: false, recommend: true, alpha: false, detail: "" },
                realtime: { desc: "拖动更新数据", myValue: true, defaultValue: true, controlType: "checkbox", isShow: false, detail: "若未选中，则在拖动结束后更新数据" },
                start: { desc: "数据起始百分比", myValue: "0", defaultValue: "0", controlType: "input", detail: "数据范围的起始百分比" },
                end: { desc: "数据结束百分比", myValue: "100", defaultValue: "100", controlType: "input", detail: "数据范围的结束百分比" },
                startValue: { desc: "数据起始具体数值", myValue: "", defaultValue: "", controlType: "input", detail: "如果设置了“数据起始百分比”，此配置无效" },
                endValue: { desc: "数据结束具体数值", myValue: "", defaultValue: "", controlType: "input", detail: "如果设置了“数据结束百分比”，此配置无效" },
                zoomLock: { desc: "锁定选择区域", myValue: false, defaultValue: false, controlType: "checkbox", detail: "选中后，只能平移不能缩放" }
            }
        }
    },
    //默认下拉菜单选项
    defaultOption: {
        icon: [{ label: "默认", value: "" }, { label: "实心圆", value: "circle" }, { label: "矩形", value: "rect" }, { label: "圆角矩形", value: "roundRect" }, { label: "三角形", value: "triangle" }, { label: "菱形", value: "diamond" }, { label: "箭头", value: "arrow" }],
        labelPosition: [{ label: "上边", value: "top" }, { label: "左边", value: "left" }, { label: "右边", value: "right" }, { label: "下边", value: "bottom" }, { label: "内部", value: "inside" }, { label: "内部靠左", value: "insideLeft" }, { label: "内部靠右", value: "insideRight" }, { label: "内部靠上", value: "insideTop" }, { label: "内部靠下", value: "insideBottom" }, { label: "内部左上", value: "insideTopLeft" }, { label: "内部右下", value: "insideBottomLeft" }, { label: "内部右上", value: "insideTopRight" }, { label: "内部右下", value: "insideBottomRight" }],
        seriesType: [{ label: "折线/面积图", value: "line" }, { label: "柱状/条形图", value: "bar" }, { label: "饼图", value: "pie" }, { label: "气泡（散点）图", value: "scatter" }, { label: "涟漪特效动气泡（散点）图", value: "effectScatter" }, { label: "雷达图", value: "radar" }, { label: "箱形图", value: "boxplot" }, { label: "热力图", value: "heatmap" }, { label: "关系图", value: "graph" }, { label: "桑基图", value: "sankey" }, { label: "漏斗图", value: "funnel" }, { label: "仪表盘", value: "gauge" }],
        fontStyle: [{ label: "普通", value: "normal" }, { label: "文字倾斜", value: "italic" }, { label: "强制文字倾斜", value: "oblique" }],
        fontWeight: [{ label: "100", value: "100" }, { label: "200", value: "200" }, { label: "300", value: "300" }, { label: "普通", value: "normal" }, { label: "500", value: "500" }, { label: "600", value: "600" }, { label: "加粗", value: "700" }, { label: "800", value: "800" }, { label: "900", value: "900" }],
        fontFamily: [{ label: "默认", value: "sans-serif" }, { label: "宋体", value: "SimSun" }, { label: "仿宋", value: "FangSong" }, { label: "楷体", value: "KaiTi" }, { label: "黑体", value: "SimHei" }, { label: "微软雅黑", value: "Microsoft YaHei" }],
        axisType: [{ label: "类目轴", value: "category" }, { label: "数值轴", value: "value" }, { label: "时间轴", value: "time" }, { label: "对数轴", value: "log" }]
    },
    chartSettingConfigureCopy: undefined,
    chartSettingTabsCopy: undefined,
    chartSettingCollapseTitleCopy: undefined,
    menuActiveNameCopy: undefined,
    menuActiveNameDefault: { base: "base", series: 0, xAxis: 0, yAxis: 0, dataZoom: 0 }
}

//自定义组件，根据配置项，生成对应控件
Vue.component('chart-control', {
    props: ['control'],
    methods: {
        doTopEvent: function (eventName, currentValue, args) {
            this.$root.doEvent(eventName, currentValue, args);
        }
    },
    template: "#chart-control"
});
//自定义组件，递归加载所有配置
var myComponent = {
    name: 'echarts-setting',
    props: ['setting', 'ctitle'],
    methods: {
        doTopEvent: function (eventName, currentValue, args) {
            this.$root.doEvent(eventName, currentValue, args);
        }
    },
    template: "#echarts-setting"
}
chartSetting.initialSetting();
//图表配置绑定的数据和事件
var vChartSetting = new Vue({
    el: "#divChartSetting",
    data: {
        tabs: chartSetting.chartSettingTabsCopy,
        formList: chartSetting.chartSettingConfigureCopy,
        collapseTitle: chartSetting.chartSettingCollapseTitleCopy,
        chartSettingModal: false,
        menuActiveName: chartSetting.menuActiveNameDefault,
        fOk: null
    },
    methods: {
        doEvent: function (eventName, value, args) {
            if (eventName)
                this[eventName](value, args);
        },
        controlDisabled: function (value, args) {
            for (var i = 0; i < args.length; i++) {
                var changeControl = this;
                var argControl = args[i].control;
                for (var j = 0; j < argControl.length - 1; j++) {
                    changeControl = changeControl[argControl[j]];
                }
                changeControl[argControl[argControl.length - 1]] = args[i].turn ? value : !value;
            }
        },
        //选择所有菜单的事件
        onchartMenuSelect: function (allTabs) {
            for (var tab in allTabs) {
                allTabs[tab].isShowContent = false;
            }
            allTabs[$(event.target).attr("contentName")].isShowContent = true;
            if ($(event.target).attr("forActiveName") === "base")
                this.menuActiveName[$(event.target).attr("forActiveName")] = $(event.target).attr("contentName");
            else
                this.menuActiveName[$(event.target).attr("forActiveName")] = parseInt($(event.target).attr("contentName"));

        },
        isJsonCopy: function (obj) {
            return isJson(obj);
        },
        onOk: function () {
            if (this.fOk)
                this.fOk(chartSetting.save());
            refreshChartMenu();
        },
        onCancel: function () {
            refreshChartMenu();
        }
    },
    computed: {
        seriesType: function () {
            var seriesTypeAll = [];
            for (var i = 0; i < this.formList.series.length; i++) {
                seriesTypeAll.push(JSON.parse(JSON.stringify(this.formList.series[i].type)));
            }
            return seriesTypeAll;
        }
    },
    watch: {
        //监视系列类型修改，改变显示内容为对应系列的配置
        seriesType: {
            handler: function (val, oldVal) {
                if (!val) return;
                var isShowRadar = false;
                var _this = this;
                //控制特殊配置的显示，雷达图、地图等
                for (var j = 0; j < val.length; j++) {
                    if (val[j].myValue === "radar") isShowRadar = true;
                }
                this.tabs.radar.isShowTabs = isShowRadar;
                //isFirstWatch=true 所有系列的初始系列都显示  newType和oldType都为空
                //其他正常加载newType oldType
                var newType, oldType, index;
                if (!chartSetting.isFirstWatch && oldVal) {
                    for (var i = 0; i < val.length; i++) {
                        if (val[i].myValue !== oldVal[i].myValue) {
                            oldType = oldVal[i].myValue;
                            index = i;
                            break;
                        }
                    }
                }
                for (var k = 0; k < (oldType ? 1 : val.length) ; k++) {
                    if (oldType) k = index;
                    var seriesOne = this.formList.series[k];
                    if (oldType) {
                        for (var oldSeriesSetting in chartSetting.defaultType.seriesDefaultType[oldType]) {
                            if (seriesOne[oldSeriesSetting].controlType === undefined) {
                                this.collapseTitle["series"][oldSeriesSetting].isShow = false;
                            } else {
                                seriesOne[oldSeriesSetting].isShow = false;
                            }
                        }
                    }
                    newType = val[k].myValue;
                    for (var seriesSetting in chartSetting.defaultType.seriesDefaultType[newType]) {
                        var defaultType = chartSetting.defaultType.seriesDefaultType[newType][seriesSetting];
                        if (seriesOne[seriesSetting].controlType === undefined) {
                            this.collapseTitle["series"][seriesSetting].isShow = true;
                        } else {
                            seriesOne[seriesSetting].isShow = true;
                            seriesOne[seriesSetting].defaultValue = defaultType.defaultValue;
                            if (oldType)
                                seriesOne[seriesSetting].myValue = defaultType.myValue;
                        }
                    }
                    switch (newType) {
                        case "line": setStyleShow(k, true, true, true, true, false, false); break;
                        case "bar":
                        case "pie":
                        case "scatter":
                        case "effectScatter": setStyleShow(k, false, false, true, true, false, false); break;
                        case "radar": setStyleShow(k, true, true, true, true, true, true); break;
                    }
                }
                chartSetting.isFirstWatch = false;
                function setStyleShow(sIndex, lineStyle, areaStyle, emphasis_lable, emphasis_itemStyle, emphasis_lineStyle, emphasis_areaStyle) {
                    _this.collapseTitle.series[sIndex].lineStyle.isShow = lineStyle;
                    _this.collapseTitle.series[sIndex].areaStyle.isShow = areaStyle;
                    _this.collapseTitle.series[sIndex].emphasis.label.isShow = emphasis_lable;
                    _this.collapseTitle.series[sIndex].emphasis.itemStyle.isShow = emphasis_itemStyle;
                    _this.collapseTitle.series[sIndex].emphasis.lineStyle.isShow = emphasis_lineStyle;
                    _this.collapseTitle.series[sIndex].emphasis.areaStyle.isShow = emphasis_areaStyle;
                }
            },
            deep: true,
            immediate: true
        }
    },
    components: {
        'echarts-setting': myComponent
    }
});
function refreshChartMenu() {
    vChartSetting.menuActiveName = chartSetting.menuActiveNameCopy;
    vChartSetting.$nextTick(function () {
        for (var m in this.menuActiveName) {
            var imenu = this.$refs[m];
            if (Array.isArray(imenu)) {
                imenu[0].updateActiveName();
            } else {
                imenu.updateActiveName();
            }
        }
    });
}

//判断obj是否为json对象
function isJson(obj) {
    var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
}