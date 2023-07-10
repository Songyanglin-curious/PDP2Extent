var Ysh_ChartBaseType = {
    "Column": { "name": "柱状图", "subtype": [0, 1, 3] },
    "Pie": { "name": "饼图", "subtype": [4, 5, 30, 31] },
    "Line": { "name": "折线图", "subtype": [6] },
    "Area": { "name": "区域图", "subtype": [8, 10] },
    "Bar": { "name": "条形图", "subtype": [11, 12] },
    "Stack": { "name": "堆积图", "subtype": [13, 14, 15, 16, 17] },
    "Combi": { "name": "复合图", "subtype": [18, 19, 20, 21, 22] },
    "Pareto": { "name": "pareto图", "subtype": [26, 27] },
    "Scroll": { "name": "可滚动x轴图", "subtype": [25] },
    "Marimekko": { "name": "份额矩阵图", "subtype": [28] },
    "ZoomLine": { "name": "可缩放折线图", "subtype": [29] },
    "Plot": { "name": "散列图", "subtype": [23] },
    "Bubble": { "name": "气泡图", "subtype": [24] }
}
var Ysh_ChartType = { "柱状图2D": ["0", "Column2D.swf"], "柱状图3D": ["1", "Column3D.swf"], "柱状图动态3D": ["3", "MSCombi3D.swf"],
    "饼图2D": ["4", "Pie2D.swf"], "饼图3D": ["5", "Pie3D.swf"], "折线图2D": ["6", "Line.swf"], "区域图2D": ["8", "Area2D.swf"],
    "区域图动态3D": ["10", "MSCombi3D.swf"], "条形图2D": ["11", "Bar2D.swf"], "条形图3D": ["12", "MSBar3D.swf"], "堆积柱形图2D": ["13", "StackedColumn2D.swf"],
    "堆积柱形图3D": ["14", "StackedColumn3D.swf"], "堆积区域图2D": ["15", "StackedArea2D.swf"], "堆积条形图2D": ["16", "StackedBar2D.swf"],
    "堆积条形图3D": ["17", "StackedBar3D.swf"], "复合图2D": ["18", "MSCombi2D.swf"], "柱-线复合图3D": ["19", "MSColumnLine3D.swf"],
    "复合图动态3D": ["20", "MSCombi3D.swf"], "双y轴复合图2D": ["21", "MSCombiDY2D.swf"], "双y轴复合图3D": ["22", "MSCombiDY3D.swf"],
    "散列图": ["23", "Scatter.swf"], "气泡图": ["24", "Bubble.swf"], "可滚动x轴图": ["25", "ScrollColumn2D.swf"], "pareto图2D": ["26", "Pareto2D.swf"],
    "pareto图3D": ["27", "Pareto3D.swf"], "份额矩阵图": ["28", "Marimekko.swf"], "可缩放折线图": ["29", "ZoomLine.swf"], "圆环图2D": ["30", "Doughnut2D.swf"],
    "圆环图3D": ["31", "Doughnut3D.swf"],
    getNameByValue: function (value) {
        for (var p in this) {
            if (this[p][0] == value)
                return p;
        }
        return "";
    }
}

var Ysh_ChartProperty = {
    GroupAble: [0, 1, 6, 8, 11],
    GroupOnly: [3, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 28, 29],
    AxisRequired: [0, 1, 3, 6, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    IsReal3DChart: [3, 10, 20],
    BaseProp: [{ "name": "caption", "chname": "* 主标题", "type": "text", "scope": "-1", "limit": "" },
        { "name": "subCaption", "chname": "* 副标题", "type": "text", "scope": "-1", "limit": "" },
        { "name": "showToolTip", "chname": "显示提示", "type": "checkbox", "scope": "-1", "limit": "", "def": "true" },
        { "name": "showLegend", "chname": "显示图例", "type": "checkbox", "scope": "-1", "limit": "", "def": "true" },
        { "name": "legendCaption", "chname": "图例说明", "type": "text", "scope": "-1", "limit": "" },
        { "name": "legendPosition", "chname": "图例位置", "type": "select", "scope": "-1", "limit": "BOTTOM,RIGHT" },
        { "name": "legendAllowDrag", "chname": "允许拖动图例", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "numdivlines", "chname": "画布内部水平分区线条数", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "numVDivLines", "chname": "画布内部垂直分区线条数", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "clickURL", "chname": "点击图表跳转链接", "type": "text", "scope": "-1", "limit": "" },
        { "name": "showValues", "chname": "显示值", "type": "checkbox", "scope": "-1", "limit": "", "def": "true" },
        { "name": "rotateValues", "chname": "竖向显示值", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "valuePosition", "chname": "值的位置", "type": "select", "scope": "-1", "limit": "AUTO,ABOVE,BELOW", "def": "AUTO" }
    ],
    AxisProp: [
        { "name": "xAxisName", "chname": "* x轴名称", "type": "text", "scope": "0,1,3,6,8,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29", "limit": "" },
        { "name": "yAxisName", "chname": "* y轴名称", "type": "text", "scope": "0,1,3,6,8,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29", "limit": "" },
        { "name": "PYAxisName", "chname": "* 主y轴名称", "type": "text", "scope": "21,22", "limit": "" },
        { "name": "SYAxisName", "chname": "* 副y轴名称", "type": "text", "scope": "21,22", "limit": "" },
        { "name": "labelStep", "chname": "x轴显示间隔", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "labelPadding", "chname": "x轴标题离图间距", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "yAxisValuesPadding", "chname": "y轴标题离图间距", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "showLimits", "chname": "显示坐标轴极值", "type": "checkbox", "limit": "", "scope": "-1" }, //'0' 
        {"name": "yAxisMinValue", "chname": "y轴最小值", "type": "text", "scope": "0,1,3,6,8,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "yAxisMaxValue", "chname": "y轴最大值", "type": "text", "scope": "0,1,3,6,8,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "xAxisMaxValue", "chname": "x轴最大值", "type": "text", "limit": "", "scope": "0,1,3,6,8,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29" },
        { "name": "xAxisMinValue", "chname": "x轴最小值", "type": "text", "limit": "", "scope": "0,1,3,6,8,10,11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29" },
        { "name": "PYAxisMinValue", "chname": "主y轴最小值", "type": "text", "scope": "21,22", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "PYAxisMaxValue", "chname": "主y轴最大值", "type": "text", "scope": "21,22", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "SYAxisMinValue", "chname": "主y轴最小值", "type": "text", "scope": "21,22", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "SYAxisMaxValue", "chname": "主y轴最大值", "type": "text", "scope": "21,22", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "rotateYAxisName", "chname": "竖向显示y轴标题", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "showLabels", "chname": "显示x轴标题", "type": "checkbox", "scope": "-1", "limit": "", "def": "true" },
        { "name": "rotateNames", "chname": "竖向显示x轴标题", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "slantLabels", "chname": "斜向显示x轴标题", "type": "checkbox", "scope": "-1", "limit": "" }
    ],
    DataProp: [
        { "name": "numberPrefix", "chname": "值前缀", "type": "text", "scope": "-1", "limit": "" },
        { "name": "numberSuffix", "chname": "值后缀", "type": "text", "scope": "-1", "limit": "" },
        { "name": "Decimals", "chname": "保留n位小数，四舍五入", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "forceDecimals", "chname": "强制保留n位小数", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "formatNumberScale", "chname": "大数字缩写(1000缩写为1k)", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "formatNumber", "chname": "逗号分隔数字(1,000)", "type": "checkbox", "scope": "-1", "limit": "" }
    ],
    StyleProp: [
        { "name": "animation", "chname": "启用加载动画", "type": "checkbox", "scope": "-1", "limit": "", "def": "true" },
        { "name": "showBorder", "chname": "显示边框", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "showShadow", "chname": "显示阴影", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "useRoundEdges", "chname": "使用圆角", "type": "checkbox", "scope": "-1", "limit": "", "def": "true" },
        { "name": "baseFont", "chname": "整体字体", "type": "text", "scope": "-1", "limit": "" },
        { "name": "baseFontSize", "chname": "整体字体大小", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "toolTipBorderColor", "chname": "提示边框颜色", "type": "color", "limit": "", "scope": "-1" }, //'114B78'
        {"name": "toolTipBgColor", "chname": "提示背景颜色", "type": "color", "limit": "", "scope": "-1" },
        { "name": "divLineThickness", "chname": "水平分区线厚度", "type": "text", "scope": "-1", "limit": "^[1-5]\d$" },
        { "name": "divLineAlpha", "chname": "水平分区线透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
        { "name": "divLineColor", "chname": "水平分区线颜色", "type": "color", "scope": "-1", "limit": "" },
        { "name": "vdivLineThickness", "chname": "垂直分区线厚度", "type": "text", "scope": "-1", "limit": "^[1-5]\d$" },
        { "name": "vdivLineAlpha", "chname": "垂直分区线透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
        { "name": "vdivLineColor", "chname": "垂直分区线颜色", "type": "color", "scope": "-1", "limit": "" },
        { "name": "zeroPlaneMesh", "chname": "显示0线/盘", "type": "checkbox", "scope": "-1", "limit": "", "def": "true" },
        { "name": "zeroPlaneThickness", "chname": "0线/盘粗细", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
        { "name": "zeroPlaneAlpha", "chname": "0线/盘透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
        { "name": "zeroPlaneColor", "chname": "0线/盘颜色", "type": "color", "scope": "-1", "limit": "" },
        { "name": "bgAlpha", "chname": "图表背景透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
        { "name": "bgColor", "chname": "图表背景颜色(外区域,内区域)", "type": "text", "scope": "-1", "limit": "" },
        { "name": "bgAngle", "chname": "图表背景角度", "type": "text", "limit": "", "scope": "-1" },
        { "name": "showcanvasbg", "chname": "显示画布背景", "type": "checkbox", "limit": "", "scope": "-1", "def": "true" },
        { "name": "showcanvasbase", "chname": "显示画布底盘", "type": "checkbox", "limit": "", "scope": "-1", "def": "true" },
        { "name": "canvasBgAlpha", "chname": "画布透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
        { "name": "canvasBgRatio", "chname": "画布放大缩小比例", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
        { "name": "canvasBgColor", "chname": "画布背景色", "type": "color", "scope": "-1", "limit": "" },
        { "name": "toolTipBgColor", "chname": "提示框背景颜色", "type": "color", "scope": "-1", "limit": "" },
        { "name": "showalternatehgridcolor", "chname": "隔行显示不同颜色", "type": "checkbox", "limit": "", "scope": "-1", "def": "true" },
        { "name": "alternatehgridcolor", "chname": "横向网格带交替的颜色", "type": "color", "limit": "", "scope": "-1" },
        { "name": "showAlternateVGridColor", "chname": "纵向隔行显示不同颜色", "type": "checkbox", "limit": "", "scope": "-1" },
        { "name": "alternatehvgridcolor", "chname": "纵向网格带交替的颜色", "type": "color", "limit": "", "scope": "-1" }
    ],
    TrendProp: [
        { "name": "startValue", "chname": "开始的y轴值", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "endValue", "chname": "结束的y轴值", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "color", "chname": "颜色", "type": "color", "scope": "-1", "limit": "" },
        { "name": "alpha", "chname": "透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
        { "name": "showOnTop", "chname": "显示在顶层", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "displayValue", "chname": "显示文本", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "valueOnRight", "chname": "在右边显示", "type": "checkbox", "scope": "-1", "limit": "" }
    ],
    SetProp: [
        { "name": "value", "chname": "* 值", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "0" },
        { "name": "label", "chname": "* 标题", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "0" },
        { "name": "toolText", "chname": "提示", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "" },
        { "name": "color", "chname": "颜色", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "" },
        { "name": "link", "chname": "链接", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "" }
    ],
    Categories: [
        { "name": "label_cate", "chname": "* 分组标题数据源(显示在x轴)", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "0" },
        { "name": "toolText_cate", "chname": "分组提示数据源", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "0" }
    ],
    DataSet: [
        { "name": "seriesName", "chname": "* 图例名数据源", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "0" },
        { "name": "renderAs", "chname": "* 图例显示类型(column,line,area)", "type": "data", "scope": "18,19,20,21,22", "limit": "", "selectCtrl": "0" },
        { "name": "value", "chname": "* 数据源", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "0" },
        { "name": "parentYAxis", "chname": "指定组是参照主Y轴(P)还是副Y轴(S)(默认为主Y轴)", "type": "data", "scope": "21,22", "limit": "", "selectCtrl": "" },
        { "name": "toolText", "chname": "数据提示", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "0" },
        { "name": "color", "chname": "颜色", "type": "data", "scope": "-1", "limit": "", "selectCtrl": "" },
        { "name": "alpha", "chname": "透明度", "type": "data", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$", "selectCtrl": "" }
    ],
    Real3DProp: [
        { "name": "is2D", "chname": "显示成2D样式", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "chartOnTop", "chname": "将图表显示在顶层", "type": "checkbox", "scope": "-1", "limit": "", "def": "true" },
        { "name": "exeTime", "chname": "初始化动画时间", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "zGapPlot", "chname": "不同数据模型间距", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "zDepth", "chname": "3D数据模型的深度", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
        { "name": "clustered", "chname": "启用横向分组", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "showPlotBorder", "chname": "显示数据模型边框", "type": "checkbox", "scope": "-1", "limit": "" },
        { "name": "xLabelGap", "chname": "x轴文字和图表间距", "type": "text", "scope": "-1", "limit": "^?(0|[1-9][0-9]*)$" },
        { "name": "yLabelGap", "chname": "y轴文字和图表间距", "type": "text", "scope": "-1", "limit": "^?(0|[1-9][0-9]*)$" },
        { "name": "lightAngX", "chname": "光源向上偏移度(0-±360)", "type": "text", "scope": "-1", "limit": "^-?(0|[1-9][0-9]*)$" },
        { "name": "lightAngY", "chname": "光源向左偏移度(0-±360)", "type": "text", "scope": "-1", "limit": "^-?(0|[1-9][0-9]*)$" },
        { "name": "YZWallDepth", "chname": "YZ面墙壁的厚度", "type": "text", "scope": "-1", "limit": "^-?(0|[1-9][0-9]*)$" },
        { "name": "ZXWallDepth", "chname": "ZX面墙壁的厚度", "type": "text", "scope": "-1", "limit": "^-?(0|[1-9][0-9]*)$" },
        { "name": "XYWallDepth", "chname": "XY面墙壁的厚度", "type": "text", "scope": "-1", "limit": "^-?(0|[1-9][0-9]*)$" },
        { "name": "startAngX", "chname": "动画开始时的向下偏移度(0-±360)", "type": "text", "scope": "-1", "limit": "^-?(0|[1-9][0-9]*)$" },
        { "name": "endAngX", "chname": "动画结束时的向下偏移度(0-±360)", "type": "text", "scope": "-1", "limit": "^-?(0|[1-9][0-9]*)$" },
        { "name": "startAngY", "chname": "动画开始时的向右偏移度(0-±360)", "type": "text", "scope": "-1", "limit": "^-?(0|[1-9][0-9]*)$" },
        { "name": "endAngY", "chname": "动画结束时的向右偏移度(0-±360)", "type": "text", "scope": "-1", "limit": "^-?(0|[1-9][0-9]*)$" }
    ],
    UniqueProp: [
       { "BaseType": "Pie", "ChDesc": "饼图及圆环图", "Scope": Ysh_ChartBaseType.Pie.subtype.join(","), Properties: [
            { "name": "showPercentValues", "chname": "labels上是否显示百分数", "type": "checkbox", "scope": "-1", "limit": "" },
            { "name": "showPercentInToolTip", "chname": "tip上是否显示百分数", "type": "checkbox", "scope": "-1", "limit": "" },
            { "name": "showZeroPies", "chname": "是否显示0值的饼", "type": "checkbox", "scope": "-1", "limit": "" },
            { "name": "use3DLighting", "chname": "使用3d光效果", "type": "checkbox", "scope": "-1", "limit": "" },
            { "name": "enableRotation", "chname": "开启旋转", "type": "checkbox", "scope": "-1", "limit": "" },
            { "name": "labelSepChar", "chname": "label上的分隔符", "type": "text", "scope": "-1", "limit": "" },
            { "name": "slicingDistance", "chname": "当点击图表的时候这一片饼离开中心点的距离", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
            { "name": "pieRadius", "chname": "饼的外半径", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
            { "name": "startingAngle", "chname": "起始角度", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
            { "name": "paletteColors", "chname": "自定义图表元素颜色(用,隔开)", "type": "text", "scope": "-1", "limit": "" },
            { "name": "showPlotBorder", "chname": "显示每一片的边框", "type": "text", "scope": "-1", "limit": "" },
            { "name": "plotBorderColor", "chname": "每一片的边框颜色", "type": "color", "scope": "-1", "limit": "" },
            { "name": "plotBorderThickness", "chname": "每一片的边框粗细", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
            { "name": "plotBorderAlpha", "chname": "每一片的边框透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
            { "name": "plotFillAlpha", "chname": "每一片的边框填充透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
            { "name": "pieInnerFaceAlpha", "chname": "图表里面的透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
            { "name": "pieOuterFaceAlpha", "chname": "图表外面的透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
            { "name": "pieYScale", "chname": "角度越大看到的面积越大", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
            { "name": "pieSliceDepth", "chname": "图表的厚度", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$"}]
       },
       { "BaseType": "Column", "ChDesc": "柱状图", "Scope": Ysh_ChartBaseType.Column.subtype.join(","), Properties: [
            { "name": "placeValuesInside", "chname": "值显示在柱状图内", "type": "checkbox", "scope": "-1", "limit": "" },
            { "name": "maxColWidth", "chname": "最大允许列宽", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$"}]
       },
       { "BaseType": "Stack", "ChDesc": "堆积图", "Scope": Ysh_ChartBaseType.Stack.subtype.join(","), Properties: [
          { "name": "showSum", "chname": "显示数值和", "type": "checkbox", "scope": "-1", "limit": "" },
          { "name": "reverseLegend", "chname": "反转数值显示顺序", "type": "checkbox", "scope": "-1", "limit": ""}]
       },
       { "BaseType": "Line", "ChDesc": "折线图", "Scope": Ysh_ChartBaseType.Line.subtype.join(","), Properties: [
          { "name": "lineColor", "chname": "折线颜色", "type": "color", "scope": "-1", "limit": "" },
          { "name": "lineThickness", "chname": "折线粗细", "type": "text", "scope": "-1", "limit": "^(0|[1-9][0-9]*)$" },
          { "name": "lineAlpha", "chname": "折线透明度", "type": "text", "scope": "-1", "limit": "^([1-9]|[1-9][0-9]|100)$" },
          { "name": "showSum", "chname": "显示数值和", "type": "checkbox", "scope": "-1", "limit": "" },
          { "name": "lineColor", "chname": "折线颜色", "type": "color", "scope": "-1", "limit": ""}]
       },
       { "BaseType": "ZoomLine", "ChDesc": "缩放折线图", "Scope": Ysh_ChartBaseType.ZoomLine.subtype.join(","), Properties: [
          { "name": "dataSeparator", "chname": "数据分隔符", "type": "text", "limit": "", "scope": "29" },
          { "name": "allowPinMode", "chname": "允许Pin模式", "type": "checkbox", "limit": "", "scope": "29" },
          { "name": "enableIconMouseCursors", "chname": "开启鼠标指针图标", "type": "checkbox", "limit": "", "scope": "-1" },
          { "name": "paletteThemeColor", "chname": "自定义图表颜色", "type": "color", "limit": "", "scope": "-1" },
          { "name": "paletteThemeColor1", "chname": "自定义图表颜色1", "type": "color", "limit": "", "scope": "-1" },
          { "name": "pixelsPerPoint", "chname": "每点像素", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "29" },
          { "name": "axis", "chname": "坐标轴类型", "type": "select", "limit": "linear,log", "scope": "29" },
          { "name": "logBase", "chname": "log基数", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "29" },
          { "name": "numMinorLogDivLines", "chname": "相邻log值间插入的分曲线数量", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "29" },
          { "name": "anchorMinRenderDistance", "chname": "折点最小着色距离", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "29" },
          { "name": "connectNullData", "chname": "将不连续的数据用直线相连", "type": "checkbox", "limit": "", "scope": "29"}]
       },
       { "BaseType": "Pareto", "ChDesc": "Pareto图", "Scope": Ysh_ChartBaseType.Pareto.subtype.join(","), Properties: [
          { "name": "stack100percent", "chname": "柱状占据100%的长度", "type": "checkbox", "limit": "", "scope": "26，27" },
          { "name": "linethickness", "chname": "线厚度", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "-1" },
          { "name": "linedashed", "chname": "使用虚线", "type": "checkbox", "limit": "^(0|[1-9][0-9]*)$", "scope": "-1" },
          { "name": "linecolor", "chname": "线颜色", "type": "color", "limit": "", "scope": "26，27" },
          { "name": "linedashgap", "chname": "两个小虚线间距", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "-1" },
          { "name": "linedashlen", "chname": "每个小虚线长度", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "-1" },
          { "name": "showlinevalues", "chname": "显示线数据", "type": "checkbox", "limit": "", "scope": "-1" },
          { "name": "drawanchors", "chname": "绘制折点", "type": "checkbox", "limit": "", "scope": "-1" },
          { "name": "anchorradius", "chname": "折点半径", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "-1" },
          { "name": "anchorbgcolor", "chname": "折点背景颜色", "type": "color", "limit": "", "scope": "-1" },
          { "name": "anchorsides", "chname": "折点多边形边数", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "-1"}]
       },
       { "BaseType": "Scroll", "ChDesc": "滚动图", "Scope": Ysh_ChartBaseType.Scroll.subtype.join(","), Properties: [
          { "name": "numVisiblePlot", "chname": "x坐标轴向显示的单位数量", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "25" },
          { "name": "plotFillAlpha", "chname": "每一片的边框填充透明度", "type": "text", "limit": "^([1-9]|[1-9][0-9]|100)$", "scope": "-1" },
          { "name": "scrollBtnPadding", "chname": "滚动条和左右箭头的内边距", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "25" },
          { "name": "scrollHeight", "chname": "滚动条高度", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "25" },
          { "name": "scrollBtnWidth", "chname": "滚动条左右箭头的宽度", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "25" },
          { "name": "areaOverColumns", "chname": "面积图在柱状图之上", "type": "checkbox", "limit": "", "scope": "25" },
          { "name": "legendBorderAlpha", "chname": "图例边框透明度", "type": "text", "limit": "^([1-9]|[1-9][0-9]|100)$", "scope": "-1" },
          { "name": "PYAxisName", "chname": "左侧y坐标名字", "type": "text", "limit": "", "scope": "-1" },
          { "name": "limitsDecimalPrecision", "chname": "y轴最大、最小值的小数位数", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "-1" },
          { "name": "divLineDecimalPrecision", "chname": "水平等分曲线值的小数位数", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "-1" },
          { "name": "anchorBgAlpha", "chname": "折点背景透明度", "type": "text", "limit": "^([1-9]|[1-9][0-9]|100)$", "scope": "-1"}]
       },
       { "BaseType": "Bar", "ChDesc": "条形图", "Scope": Ysh_ChartBaseType.Bar.subtype.join(","), Properties: [
          { "name": "showColumnShadow", "chname": "是否显示各条形图间的阴影", "type": "checkbox", "limit": "", "scope": "-1"}]
       },
       { "BaseType": "Bubble", "ChDesc": "气泡图", "Scope": Ysh_ChartBaseType.Bubble.subtype.join(","), Properties: [
         { "name": "bubbleScale", "chname": "气泡缩放值", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "24" },
         { "name": "is3D", "chname": "绘制3D的气泡", "type": "checkbox", "limit": "", "scope": "24" },
         { "name": "clipBubbles", "chname": "超出范围时修剪气泡", "type": "checkbox", "limit": "", "scope": "24"}]
       },
       { "BaseType": "Plot", "ChDesc": "散列图", "Scope": Ysh_ChartBaseType.Plot.subtype.join(","), Properties: [
         { "name": "drawQuadrant", "chname": "绘制象限", "type": "checkbox", "limit": "", "scope": "23" },
         { "name": "quadrantLabelTL", "chname": "象限左上Label", "type": "text", "limit": "", "scope": "23" },
         { "name": "quadrantLabelTR", "chname": "象限右上Label", "type": "text", "limit": "", "scope": "23" },
         { "name": "quadrantLabelBR", "chname": "象限右下Label", "type": "text", "limit": "", "scope": "23" },
         { "name": "quadrantLabelBL", "chname": "象限左下Label", "type": "text", "limit": "", "scope": "23" },
         { "name": "quadrantLineThickness", "chname": "象限线厚度", "type": "text", "limit": "^(0|[1-9][0-9]*)$", "scope": "23" },
         { "name": "quadrantLineColor", "chname": "象限线颜色", "type": "color", "limit": "", "scope": "23" },
         { "name": "quadrantXVal", "chname": "象限y轴的x坐标", "type": "text", "limit": "", "scope": "23" },
         { "name": "quadrantYVal", "chname": "象限x轴的y坐标", "type": "text", "limit": "", "scope": "23"}]
       }
    ]
}
var Ysh_ChartTitleTips = {
    SetProp: { "title": "* 数据源设置", "tips": "这些设置中<span style='color:red'>值，标题和数据名</span>是<span style='color:red'>必须</span>的,用于设置图表的数据来源<br/>设置对应属性的数据列，<span style='color:red'>每个</span>属性对应的数据条数应该是<span style='color:red'>相同的</span><br/>其中链接的格式为：(本窗口打开[Url]，新窗口打开[n-Url]，调用JS函数[JavaScript:函数])", "iscommon": "0" },
    DataSet: { "title": "* 分组数据源设置", "tips": "这些设置中<span style='color:red'>值，标题和数据名</span>是<span style='color:red'>必须</span>的,用于设置图表的数据来源，分组将会显示在X轴的名称上<br/>有<span style='color:red'>几个</span>分组，图例名的数据源就应当有<span style='color:red'>几行</span>，数据源就应当有<span style='color:red'>图例个数*分组个数</span>行,同时和其他属性对应的数据源行数<span style='color:red'>必须要相同</span><br/>在<span style='color:red'>复合图</span>中,图例类型将会决定对应图例在图上显示柱形(column)线段(line)区域(area)", "iscommon": "0" },
    BaseProp: { "title": "基础属性", "tips": "设置图表的基本样式,这些是<span style='color:red'>不必须</span>的,<span style='color:red'>建议</span>您设置一下<span style='color:red'>标题相关</span>的设置,其他的即使您<span style='color:red'>不设置</span>也会有正常的显示效果", "iscommon": "1" },
    AxisProp: { "title": "坐标轴属性", "tips": "设置坐标轴的基本样式,也是<span style='color:red'>不必须</span>的,<span style='color:red'>建议</span>您设置一下<span style='color:red'>名称</span>", "iscommon": "1", "area": Ysh_ChartProperty.AxisRequired },
    DataProp: { "title": "数值属性", "tips": "可以自定义图表上数据的显示样式,是<span style='color:red'>不必须</span>的", "iscommon": "1" },
    StyleProp: { "title": "外观属性", "tips": "更改图表的显示细节,是<span style='color:red'>不必须</span>的,即使您<span style='color:red'>不设置</span>也会有较好看的显示效果<br/>颜色的设置如果您<span style='color:red'>放空</span>,则会自动分配颜色", "iscommon": "1" },
    TrendProp: { "title": "区域加深设置", "tips": "", "iscommon": "0" },
    Categories: { "title": "分组设置", "tips": "", "iscommon": "0" },
    Real3DProp: { "title": "动态3D相关设置", "tips": "动态3D的细节设置,是<span style='color:red'>不必须</span>的,即使您<span style='color:red'>不设置</span>也会有实现动态3D效果", "iscommon": "1", "area": Ysh_ChartProperty.IsReal3DChart },
    UniqueProp: { "title": "独有设置", "tips": "当前图表的特殊设置,是<span style='color:red'>不必须</span>的", "iscommon": "1" },
    OtherProp: { "title": "其他设置", "tips": "在这里您可以设置其他属性，属性可以通过查找Chart的API或者咨询相关人员来找到，添加的方式为：属性名1=\"值1\",属性名2=\"值2\" ", "iscommon": "1" }
}

