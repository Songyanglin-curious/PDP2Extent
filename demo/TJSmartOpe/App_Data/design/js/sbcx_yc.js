var vm = this;

//#region  选择时间类型
this.selectDateType = function () {
  //   vm.selStart = "";
  //   vm.selEnd = "";
  //   vm.dateSpan = 0;
  vm.selCompareStart = "";
  vm.selCompareEnd = "";
  vm.compareDateSpan = 0;
  vm.handeledData = [];
  vm.handeledCompareData = [];
  var start = "";
  var end = "";
  switch (vm.selDateType) {
    case "day":
      vm.show1 = true;
      vm.show2 = false;
      vm.show3 = false;
      vm.show4 = false;
      if (vm.selStart) {
        start = new Date();
      } else {
        start = new Date();
      }
      break;
    case "week":
      vm.show1 = false;
      vm.show2 = true;
      vm.show3 = false;
      vm.show4 = false;
      if (vm.selStart) {
        start = new Date();
      } else {
        start = new Date();
      }
      break;
    case "month":
      vm.show1 = false;
      vm.show2 = false;
      vm.show3 = true;
      vm.show4 = false;
      if (vm.selStart) {
        start = new Date();
      } else {
        start = new Date();
      }
      break;
    case "user_defined":
      vm.show1 = false;
      vm.show2 = false;
      vm.show3 = false;
      vm.show4 = true;
      if (vm.selStart && vm.selEnd) {
        start = new Date(vm.selStart);
        end = new Date(vm.selEnd);
      } else {
        start = new Date();
        end = new Date();
      }
      break;
    default:
      alert("异常时间类型");
      return false;
  }
  var resDate = vm.getDayAndSpan(vm.selDateType, start, end);
  vm.selStart = resDate.start;
  vm.selEnd = resDate.end;
  vm.dateSpan = resDate.span;
  vm.getDataByTime();
};
//#endregion

//#region 选择时间获取图表数据
this.getDataByTime = function () {
  var isContinue = this.setTimePickerValue();
  if (!isContinue) return;
  this.updateOption("current", this.id);
};
//#endregion

//#region 清空周类型的时间的方法
this.clearWeek = function () {
  this.selStart = "";
  this.selEnd = "";
};
//#endregion

//#region  选择时间间隔
this.selectSpantime = function () {
  this.getDataBySpan();
};

//#endregion

//#region 选择监测类型
this.selectMonitortype = function (value) {
  switch (value) {
    case "油色谱":
      vm.dsLine = [
        ["H2", "氢气"],
        ["CH4", "甲烷"],
        ["C2H2", "乙炔"],
        ["C2H4", "乙烯"],
        ["C2H6", "乙烷"],
        ["CO", "一氧化碳"],
        ["CO2", "二氧化碳"],
        // ["O2", "氧气"],
        // ["H2O", "水"],
        // ["N2", "氮气"],
        ["TOTHYD", "总烃"],
        // ["CMBUGAS", "总溶解可燃气体量"],
      ];
      break;
    default:
      vm.dsLine = [
        ["气体温度", "气体温度"],
        ["气体压力", "气体压力"],
        ["气室温度", "气室温度"],
        ["气室压力", "气室压力"],
      ];
      break;
  }
};
//#endregion

// 选择曲线展示在折线图
this.selectLineShow = function () {
  this.selectCurrentLien()
  if (this.selCompareModel[0] == "不同日期") {
    this.getCompareDataByTime();
  } 
  if (this.selCompareModel[0] == "不同对象") {
    this.getCompareDataByDevice();
  } 
};
this.selectCurrentLien = function(){
  var arr = [];
  var arrItem = "";
  if (this.selAllowMoreLine == "2") {
    this.selLine = [this.selLine[this.selLine.length - 1]];
  }
  this.selLine.forEach((item) => {
    arrItem = "";
    arrItem = this.dsLine.find((el) => {
      return el[0] == item;
    });
    if (arrItem) {
      arr.push(arrItem);
    }
  });
  this.dsFeatureBtn = [].concat(arr);
  this.dsCompareLine = this.dsFeatureBtn;
  this.getLineData();
}

//#region 打开比较功能
this.selectCompareLine = function () {
  if (this.selCompareModel.length == 0) {
    this.clearCompare();
  }
  if (this.selCompareModel.length > 1) {
    var temp = this.selCompareModel[this.selCompareModel.length - 1];
    this.selCompareModel = [];
    this.selCompareModel = [temp];
  }
  if (this.selCompareModel[0] == "不同日期") {
    this.d1 = false;
    this.selSameDevice = "";
  } else {
    this.d1 = true;
  }
  if (this.selCompareModel[0] == "不同对象") {
    this.d2 = false;
    this.clearCompareDate();
  } else {
    this.d2 = true;
  }
};
//#endregion

this.compareFromDiffTime = function () {
  var isContinue = this.setCompareTimePickerValue();
  if (!isContinue) return;
  this.updateOption("compare", this.id);
};

this.compareDifferentDevice = function () {
  if (!this.selSameDevice) {
    this.clearCompare();
    return;
  }
  this.updateOption("compare", this.selSameDevice);
};

this.clearCompareDate = function () {
  this.selCompareStart = "";
  this.selCompareEnd = "";
  this.handeledCompareData = [];
  this.getDataBySpan();
};

this.jumpTo = function (item) {
  var vMain = ProjectSGC.Global.getMainObject("vMain");
  vMain.gotoApp("yaoce", { id: item.Id });
};

this.selectFeatureData = function () {
  //获取数据
  var obj = vm.intervalData.find((item) => {
    return item.name == vm.selFeatureBtn;
  });
  var compare_obj = vm.intervalData.find((item) => {
    return item.name == this.compareNamePrefix + vm.selFeatureBtn;
  });
  var data = obj.data;
  if (compare_obj) {
    //有比较数据的最大值最小值
    var compare_data = compare_obj.data;
    var max1 = Math.max(...data);
    var max2 = Math.max(...compare_data);
    var maxIndex = 0;
    var minIndex = 0;
    if (max1 >= max2) {
      vm.maxFeatureBtn = max1;
      maxIndex = data.indexOf(max1);
      vm.maxFeatureDate = vm.x_label[maxIndex];
    } else {
      vm.maxFeatureBtn = max2;
      maxIndex = compare_data.indexOf(max2);
      vm.maxFeatureDate = vm.dayDic[vm.x_label[maxIndex].split(" ")[0]] + " " + vm.x_label[maxIndex].split(" ")[1];

    }
    var min1 = Math.min(...data);
    var min2 = Math.min(...compare_data);
    if (data.indexOf(min1) === -1) {
      min1 = vm.findSecondMinNum(data);
    }
    if (compare_data.indexOf(min2) === -1) {
      min2 = vm.findSecondMinNum(compare_data);
    }
    if (min1 <= min2) {
      vm.minFeatureBtn = min1;
      minIndex = data.indexOf(min1);
      vm.minFeatureDate = vm.x_label[minIndex];
    } else {
      vm.minFeatureBtn = min2;
      minIndex = compare_data.indexOf(min2);
      vm.minFeatureDate = vm.dayDic[vm.x_label[minIndex].split(" ")[0]] + " " + vm.x_label[minIndex].split(" ")[1];
    }
  } else {
    //一般情况的最大值最小值
    var max_value = Math.max(...data);
    var min_value = Math.min(...data);
    maxIndex = data.indexOf(max_value);
    minIndex = data.indexOf(min_value);
    if (minIndex === -1) {
      min_value = vm.findSecondMinNum(data);
      minIndex = data.indexOf(min_value);
    }
    vm.maxFeatureBtn = max_value;
    vm.minFeatureBtn = min_value;
    vm.maxFeatureDate = vm.x_label[maxIndex];
    vm.minFeatureDate = vm.x_label[minIndex];
  }
  vm.maxFeatureBtn = vm.maxFeatureBtn;
  vm.minFeatureBtn = vm.minFeatureBtn;
};

this.clearCompare = function () {
  this.selSameDevice = [];
  this.clearCompareDate();
};

this.setTimePickerValue = function () {
  var start = null;
  var end = null;
  switch (this.selDateType) {
    case "day":
      start = vm.selStart;
      end = vm.selStart;
      break;
    case "week":
      if (!vm.selStart && !vm.selEnd) return false;
      start = vm.selStart ? vm.selStart : vm.selEnd;
      break;
    case "month":
      start = vm.selStart;
      end = vm.selStart;
      break;
    case "user_defined":
      if (vm.selStart && vm.selEnd) {
        start = vm.selStart;
        end = vm.selEnd;
      } else {
        return false;
      }
      break;
    default:
      alert("异常时间类型");
      return false;
  }
  var resDate = vm.getDayAndSpan(vm.selDateType, start, end);
  vm.selStart = resDate.start;
  vm.selEnd = resDate.end;
  vm.dateSpan = resDate.span;
  return true;
};

this.setCompareTimePickerValue = function () {
  var start = null;
  var end = null;
  switch (this.selDateType) {
    case "day":
      start = vm.selCompareStart;
      end = vm.selCompareStart;
      break;
    case "week":
      if (!vm.selCompareStart && !vm.selCompareEnd) return false;
      start = vm.selCompareStart ? vm.selCompareStart : vm.selCompareEnd;
      break;
    case "month":
      start = vm.selCompareStart;
      end = vm.selCompareStart;
      break;
    case "user_defined":
      if (vm.selCompareStart && vm.selCompareEnd) {
        start = vm.selCompareStart;
        end = vm.selCompareEnd;
      } else {
        return false;
      }
      break;
    default:
      alert("异常时间类型");
      return false;
  }
  var resDate = vm.getDayAndSpan(vm.selDateType, start, end);
  vm.selCompareStart = resDate.start;
  vm.selCompareEnd = resDate.end;
  vm.compareDateSpan = resDate.span;
  return true;
};

// 更新Ecgarts的options的函数 dataStatus = "current" || "compare"
this.updateOption = function (dataStatus, devid) {
  if (!vm.selStart || !vm.selEnd || !vm.dateSpan) return;
  if (!vm.selMonitorType) return;
  //从数据库获取初始数据
  this.getInitDataByMonitor(dataStatus, devid);
};

//#region 根据监测类型从数据库获取最初始的数据
this.getInitDataByMonitor = function (dataStatus, devid) {
  if (dataStatus === "current") {
    var startTime = Ysh.Time.formatString(Ysh.Time.toString(vm.selStart), "111000") + " 00:00:00";
    var endTime = Ysh.Time.formatString(Ysh.Time.toString(Ysh.Time.add("d", 1, vm.selEnd)), "111000") + " 00:00:00";
  } else if (dataStatus === "compare") {
    if (this.selCompareModel[0] == "不同日期") {
      var startTime = Ysh.Time.formatString(Ysh.Time.toString(vm.selCompareStart), "111000") + " 00:00:00";
      var endTime = Ysh.Time.formatString(Ysh.Time.toString(Ysh.Time.add("d", 1, vm.selCompareEnd)), "111000") + " 00:00:00";
    } else if (this.selCompareModel[0] == "不同对象") {
      var startTime = Ysh.Time.formatString(Ysh.Time.toString(vm.selStart), "111000") + " 00:00:00";
      var endTime = Ysh.Time.formatString(Ysh.Time.toString(Ysh.Time.add("d", 1, vm.selEnd)), "111000") + " 00:00:00";
    } else {
      return;
    }
  } else {
    alert("数据状态未标注清晰");
    return;
  }
  var span = vm.dateSpan;
  var resData = null; //接受从数据库取得的数据
  var resItemKey = [];
  switch (vm.selMonitorType) {
    case "油色谱":
      PDP.load("sc/sbcx_yc:GetYSPOption", {}, function (res) {
        vm.markAlertData = res.value;
        PDP.load("sc/sbcx_yc:GetOilChromatogram", { startTime: startTime, endTime: endTime, id: devid }, function (res) {
          if (res.check("获取油色谱在线监测数据", true)) {
            resData = res.value;
            if (resData.length === 0) {
              vm.showNoData = true;
              if (dataStatus === "current") {
                vm.noDataText = "暂无数据";
              } else if (dataStatus === "compare") {
                vm.noDataText = "该时间段内无比较数据,请重新选择比较时间";
              }

              vm.echartsOption = vm.getEchartsOption([], true);
              return;
            }
            resItemKey = Object.keys(resData[0]);
            vm.createMinuteData(resItemKey, resData, startTime, span, dataStatus);
          }
        });
      });
      break;
    default:
      alert("在线监测数据类别字段有误");
      vm.markAlertData = [];
      return;
      break;
  }
};
//#endregion
this.dataPreprocessing = function (num) {
  return Number(num) + 0.01;
};
this.dataReset = function (num) {
  return Number(num).toFixed(1);
};
//#region 对获取的初始数据处理成每分钟一条，没有数据部分进行线性插值
this.createMinuteData = function (resItemKey, resData, start, span, dataStatus) {
  //对数据进行处理，每分钟只保留一条数据
  var filterData = [];
  resData.forEach((item) => {
    if (filterData.length === 0) {
      filterData.push(item);
    }
    var r = filterData.find((el) => {
      return el.Time.slice(0, 16) === item.Time.slice(0, 16);
    });
    if (!r) {
      filterData.push(item);
    }
  });
  //对数据按时间插入
  var resObj = {};
  var dataLength = Number(span) * 1440;
  for (var i = 0; i < resItemKey.length; i++) {
    resObj[resItemKey[i]] = new Array(dataLength).fill(null);
  }
  var timeStr = "";
  for (var i = 0; i < dataLength; i++) {
    timeStr = Ysh.Time.formatString(Ysh.Time.toString(Ysh.Time.add("mm", i, Ysh.Time.parseDate(start))), "111110");
    if (filterData.length === 0) break;
    if (filterData[0].Time.slice(0, 16) == timeStr) {
      var item = filterData.shift();
      resItemKey.forEach((el) => {
        resObj[el][i] = Number(item[el]);
      });
    }
  }
  //对结果进行插值处理
  resItemKey.forEach((key) => {
    resObj[key] = vm.findNotNull(resObj[key]);
    // for(var i = 0 ; i < resObj[key].length ; i++){
    //   resObj[key][i] = vm.dataPreprocessing(resObj[key][i])
    //   // resObj[key][i] = (Number(resObj[key][i])+0.1)*10
    // }
  });

  if (dataStatus === "current") {
    this.initMinuteData = {};
    this.initMinuteData = resObj;
  } else if (dataStatus === "compare") {
    this.compareMinuteData = {};
    this.compareMinuteData = resObj;
  }
  
  if (dataStatus === "current") {
    this.getLineData();
  } else if (dataStatus === "compare") {
    if (this.selCompareModel[0] == "不同日期") {
      this.getCompareDataByTime();
    }
    if (this.selCompareModel[0] == "不同对象") {
      this.getCompareDataByDevice();
    }
  } else {
    alert("数据状态未标注清晰");
    return;
  }
  
};
//#endregion

//#region 处理曲线数据
//位于这个数组中的字段在图表右侧
var yLabelArr = ["CO", "CO2", "O2", "H2O", "N2", "CMBUGAS"];
// var yLabelArr = [];
//根据所选曲线类型获取曲线数据 
this.getLineData = function () {
  this.handeledData = [];
  var select_line = [];
  select_line = [].concat(this.selLine);
  var lineItem = "";
  //   var colors = ["#F0C47C", "#59EDF0", "#DA0001", "#0096F6",];
  var colors = ["#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#42d4f4", "#f032e6", "#fabed4", "#469990"];
  if (select_line.length > 0) {
    for (var index = 0; index < select_line.length; index++) {
      this.handeledData[index] = {};
      lineItem = select_line[index];
      var findItem = "";
      var findItemIndex = 0;
      for (var j = 0; j < this.dsLine.length; j++) {
        if (this.dsLine[j][0] === lineItem) {
          findItem = this.dsLine[j];
          findItemIndex = j;
        }
      }
      if (!findItem) continue;

      this.handeledData[index].name = findItem[1];
      this.handeledData[index].data = this.initMinuteData[lineItem];
      this.handeledData[index].color = colors[findItemIndex % colors.length];
      this.handeledData[index].lineId = lineItem;
      if (yLabelArr.includes(lineItem)) {
        this.handeledData[index].yLabel = 1;
      } else {
        this.handeledData[index].yLabel = 0;
      }
    }
  }
  this.getDataBySpan();
};

// 根据不同时间比较 
this.getCompareDataByTime = function () {
  this.handeledCompareData = [];
  var select_line = [];
  select_line = [].concat(this.selLine);
  var lineItem = "";
  //   var colors = ["#59EDF0", "#DA0001", "#0096F6","#F0C47C", ];
  var colors = ["#dcbeff", "#9A6324", "#fffac8", "#800000", "#aaffc3", "#000075", "#a9a9a9", "#ffffff", "#000000"];
  if (select_line.length > 0) {
    for (var index = 0; index < select_line.length; index++) {
      this.handeledCompareData[index] = {};
      lineItem = select_line[index];
      var findItem = "";
      var findItemIndex = 0;
      for (var j = 0; j < this.dsLine.length; j++) {
        if (this.dsLine[j][0] === lineItem) {
          findItem = this.dsLine[j];
          findItemIndex = j;
        }
      }
      if (!findItem) continue;
      this.compareNamePrefix = "比较-";
      this.handeledCompareData[index].name = this.compareNamePrefix + findItem[1];
      this.handeledCompareData[index].data = this.compareMinuteData[lineItem];
      this.handeledCompareData[index].color = colors[findItemIndex % colors.length];
      this.handeledCompareData[index].lineId = lineItem;
      if (yLabelArr.includes(lineItem)) {
        this.handeledCompareData[index].yLabel = 1;
      } else {
        this.handeledCompareData[index].yLabel = 0;
      }
    }
  }
  this.getDataBySpan();
};

// 根据不同对象比较
this.getCompareDataByDevice = function () {
  this.handeledCompareData = [];
  var select_line = [];
  select_line = [].concat(this.selLine);
  var lineItem = "";
  //   var colors = ["#59EDF0", "#DA0001", "#0096F6","#F0C47C", ];
  var colors = ["#dcbeff", "#9A6324", "#fffac8", "#800000", "#aaffc3", "#000075", "#a9a9a9", "#ffffff", "#000000"];
  if (select_line.length > 0) {
    for (var index = 0; index < select_line.length; index++) {
      this.handeledCompareData[index] = {};
      lineItem = select_line[index];
      var findItem = "";
      var findItemIndex = 0;
      for (var j = 0; j < this.dsLine.length; j++) {
        if (this.dsLine[j][0] === lineItem) {
          findItem = this.dsLine[j];
          findItemIndex = j;
        }
      }
      if (!findItem) continue;
      var name = "比较-";
      var find = this.dsSameDevice.find((item) => item[0] == this.selSameDevice);
      this.compareNamePrefix = find ? find[1] + "-" : name;
      this.handeledCompareData[index].name = this.compareNamePrefix + findItem[1];
      this.handeledCompareData[index].data = this.compareMinuteData[lineItem];
      this.handeledCompareData[index].color = colors[findItemIndex % colors.length];
      this.handeledCompareData[index].lineId = lineItem;
      if (yLabelArr.includes(lineItem)) {
        this.handeledCompareData[index].yLabel = 1;
      } else {
        this.handeledCompareData[index].yLabel = 0;
      }
    }
  }
  this.getDataBySpan();
};

//#endregion


//根据间隔获取数据
this.getDataBySpan = function () {
  this.allData = this.handeledData.concat(this.handeledCompareData);
  if (this.dateSpan >= this.compareDateSpan) {
    this.resultSpan = this.dateSpan;
  } else {
    this.resultSpan = this.compareDateSpan;
  }
  this.intervalData = [];
  this.allData.forEach((element, index) => {
    var keys = Object.keys(element);
    var arr = {};
    keys.forEach((key) => {
      if (!Array.isArray(element[key])) {
        arr[key] = element[key];
      }
    });
    arr.data = [];

    for (var i = 0; i < element.data.length; i++) {
      if (i % this.selTimeSpan === 0) {
        arr.data.push(element.data[i]);
      }
    }
    this.intervalData.push(arr);
  });
  //获取时间对照字典
  this.getDayDic();
  if (this.intervalData.length > 0) {
    this.showNoData = false;
  } else {
    this.showNoData = true;
  }
  this.echartsOption = this.getEchartsOption(this.intervalData);
  this.updateFeatureData();
};

var maxAlertValue = {
  H2: 150,
  C2H2: 3,
  TOTHYD: 150,
};
//#region 根据数据获取echarts配置
//获取echarts图表配置的方法
/**
 *
 * @param {Array[Object]} data //对象数组包含name，data，color
 * @returns //返回ercharts的配置
 */
this.getEchartsOption = function (data, isEmpty) {
  //data格式，name,data,color,color1,color2
  var legends = [];
  var series = [];
  var colors = [];
  var markLineData = [];
  var alertLineID = [];

  if (vm.markAlertData && vm.markAlertData.length > 0) {
    vm.markAlertData.forEach((item) => {
      alertLineID.push(item.id);
    });
  }
  var y_max0 = 0;
  var y_max1 = 0;
  //对传入的数据进行遍历设置每条曲线的参数和数据
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var name = item.name;
    legends.push(name);
    var color = item.color;
    var compare = !!item.compare;
    colors.push(color);
    var y_index = 0;

    var max1 = maxAlertValue[item.lineId] ? maxAlertValue[item.lineId] : 0;
    var max2 = Math.max.apply(null, item.data);
    var max = Math.max(max1, max2);
    if (item.yLabel && item.yLabel === 1) {
      y_index = 1;
      y_max1 = Math.max(max, y_max1);
    } else {
      y_index = 0;
      y_max0 = Math.max(max, y_max0);
    }

    if (item.lineId && alertLineID.includes(item.lineId)) {
      var alertItem = vm.markAlertData.find((el) => el.id == item.lineId);
      alertItem.value.forEach((al) => {
        markLineData.push({
          silent: false, //鼠标悬停事件  true没有，false有
          lineStyle: {
            //警戒线的样式  ，虚实  颜色
            type: "solid",
            color: al.color,
          },
          yAxisIndex: 0,
          yAxis: al.value, // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
          label: {
            formatter: al.label + "为" + al.value,
            position: alertItem.position,
            fontSize: 16,
          },
        });
      });
    }
    //#region 设置曲线配置
    series.push({
      name: name,
      smooth: true,
      symbol: "none",
      yAxisIndex: y_index,
      connectNulls: true,
      //   unit: "℃",
      compare: compare,
      itemStyle: {
        normal: {
          areaStyle: {
            color: {
              //线性渐变
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: `${color}50`, // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: `${color}00`, // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      },
      markLine:
        y_index == 0
          ? {
              symbol: "none", //去掉警戒线最后面的箭头
              data: markLineData,
            }
          : "",
      lineStyle: {
        //线的颜色
        color: color,
        width: 3,
        // type: y_index == 1 ? "dashed" : "solid",
      },
      data: item.data,
      type: "line",
      connectNulls: true,
      //   stack: "Total",
      //   symbol: "circle",
    });
    //#endregion
  }

  y_max0 = Math.ceil(y_max0 * 1.1);
  y_max1 = Math.ceil(y_max1 * 1.1);
  var xtimes = [];
  var label_interval = "";
  //#region 根据条件来设置x轴及其间隔间隔
  for (var i = 0; i < vm.resultSpan; i++) {
    var day = Ysh.Time.toString(Ysh.Time.add("d", i, Ysh.Time.parseDate(vm.selStart))).split(" ")[0];
    for (var h = 0; h < 24; h++) {
      for (var m = 0; m < 60; m++) {
        if (m % vm.selTimeSpan === 0) {
          xtimes.push(day + " " + (+(h < 10) ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m);
        }
      }
    }
  }
  if (vm.resultSpan === 1) {
    label_interval = 60 / vm.selTimeSpan - 1;
  } else if (vm.resultSpan <= 7 && vm.resultSpan > 1) {
    label_interval = (60 / vm.selTimeSpan) * 24 - 1;
  } else {
    label_interval = "auto";
  }
  //#endregion
  //获取x轴坐标
  vm.x_label = xtimes;
  //#region 设置option
  var option = {
    grid: { top: 70, left: 65, right: 65, bottom: 60 },
    yAxis: [
      {
        nameLocation: "end",
        alignTicks: true,
        type: "value",
        splitNumber: 5,
        scale: true,
        nameTextStyle: { fontSize: 18 },
        axisLabel: { show: true, showMaxLabel: true, fontSize: 18 },
        axisTick: { show: false },
        splitLine: { show: false, lineStyle: { type: "dashed", color: "#4ad1fb" } }, //分割线
        axisLine: { symbol: ["none"], lineStyle: { color: "#4ad1fb" } },
        max: y_max0 ? y_max0 : null,
        filterMode: "none",
      },
      {
        nameLocation: "end",
        alignTicks: true,
        type: "value",
        splitNumber: 5,
        max: y_max1 ? y_max1 : null,
        nameTextStyle: { fontSize: 18 },
        axisLabel: { show: true, showMaxLabel: true, fontSize: 18 },
        axisTick: { show: false },
        splitLine: { show: false, lineStyle: { type: "dashed", color: "#EFBC31" } }, //分割线
        axisLine: { symbol: ["none"], lineStyle: { color: "#EFBC31" } },
      },
    ],
    xAxis: {
      name: "",
      type: "category",
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#4ad1fb", //"#827258"
        },
      },
      yAxisIndex: y_index,
      axisLabel: {
        show: true,
        color: "#4ad1fb",
        interval: label_interval,
        formatter: function (value, index) {
          var str = value;
          if (vm.dateSpan == 1) {
            str = value.split(" ")[1];
          } else {
            str = value.split(" ")[0];
          }
          return str;
        },
      },

      data: isEmpty ? [] : xtimes,
    },

    color: colors,
    legend: {
      data: legends,
      textStyle: {
        color: "#c6f6fc",
        fontSize: 18,
      },
      icon: "roundRect",
    },
    series: series,
    tooltip: {
      show: true,
      trigger: "axis",
      //#region 格式化tooltip
      formatter: (params) => {
        var lineArr = [];
        var compareLineArr = [];
        if (this.selCompareModel[0] == "不同对象") {
          lineArr = params;
        } else {
          for (var item of params) {
            if (item.seriesName.includes(this.compareNamePrefix)) {
              compareLineArr.push(item);
            } else {
              lineArr.push(item);
            }
          }
        }
        var dataStr = "";
        //过滤出来最初的曲线数据有就显示这个时间标记
        if (lineArr.length > 0) {
          dataStr = `<div><p style="font-weight:bold;margin:0 8px 5px;">${params[0].name}</p></div>`;
          lineArr.forEach((item) => {
            dataStr += `<div>
						<div style="margin: 0 8px;">
						  <span style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:${item.color};"></span>
						  <span>${item.seriesName}</span>
						  <span style="float:right;color:#000000;margin-left:20px;color:${item.color}">${item.data === null ? "-" : item.data}</span>
						</div>
					  </div>`;
          });
        }
        var date_name = vm.dayDic[params[0].name.split(" ")[0]];
        var date_h = params[0].name.split(" ")[1];
        if (compareLineArr.length > 0) {
          dataStr += `<div><p style="font-weight:bold;margin:10px 8px 5px;">${date_name + " " + date_h}</p></div>`;
          compareLineArr.forEach((item) => {
            dataStr += `<div>
						<div style="margin: 0 8px;">
						  <span style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:${item.color};"></span>
						  <span>${item.seriesName}</span>
						  <span style="float:right;color:#000000;margin-left:20px;color:${item.color}">${item.data === null ? "-" : item.data}</span>
						</div>
					  </div>`;
          });
        }
        return dataStr;
      },
      //#endregion
    },
  };
  //#endregion
  return option;
};
//#endregion

// 当前时间和比较时间对应的字典，用于格式化比较时间和特征数据时间
this.getDayDic = function () {
  this.dayDic = {};
  for (var i = 0; i < this.resultSpan; i++) {
    var t = Ysh.Time.formatString(Ysh.Time.add("d", i, this.selStart), "111000");
    var ct = Ysh.Time.formatString(Ysh.Time.add("d", i, this.selStart), "111000");
    if(this.selCompareModel.length > 0){
      if (this.selCompareModel[0] == "不同日期") {
        ct = Ysh.Time.formatString(Ysh.Time.add("d", i, this.selCompareStart), "111000");
      }
      if (this.selCompareModel[0] == "不同对象") {
        ct = Ysh.Time.formatString(Ysh.Time.add("d", i, this.selStart), "111000");
      }
    }
    this.dayDic[t] = ct;
  }
};

// 更新特征按钮选中状态和数据
this.updateFeatureData = function () {
  if (vm.dsFeatureBtn.length === 0) return;
  var findFeatureItem = vm.dsFeatureBtn.find((item) => {
    return item[1] == vm.selFeatureBtn;
  });
  if (!findFeatureItem) {
    vm.selFeatureBtn = vm.dsFeatureBtn[0][1];
  }
  vm.selectFeatureData();
};

this.resetOption = function () {
  vm.selLine = [vm.dsLine[0][0]];
  vm.dsFeatureBtn = [].concat([vm.dsLine[0]]);

  vm.maxFeatureBtn = 0;
  vm.minFeatureBtn = 0;
  vm.maxFeatureDate = "-";
  vm.minFeatureDate = "-";
};

// 初始化程序配置的方法
this.initOption = function () {
  vm.dsJumpTo = [{ Name: "无同站,同电压,同类型的设备", Id: -1 }];
  vm.ycDay = Ysh.Time.formatString(new Date(), "111000");
  vm.selStart = new Date();
  // vm.selStart = new Date("2022-08-26 00:00:00");
  vm.dateSpan = 1;
  vm.allData = [];
  vm.handeledData = [];
  vm.handeledCompareData = [];
  vm.selMonitorType = vm.monitorType[1][0];
  vm.selectMonitortype(vm.selMonitorType);
  vm.selLine = [vm.dsLine[0][0]];
  vm.dsFeatureBtn = [].concat([vm.dsLine[0]]);
  vm.selFeatureBtn = vm.dsLine[0][1];
  vm.selectDateType();
  vm.getTitle();
  vm.getSimilarDevice();
};

//获取在线监测 标题
this.getTitle = function () {
  PDP.load("sc/sbcx_yc:GetDeviceTitle", { id: vm.id }, function (res) {
    if (res.check("获取在线监测设备名称", true)) {
      vm.ycTitle = res.value[0].Name;
    }
  });
};

// 获取同站，同电压，同类型设备
this.getSimilarDevice = function () {
  PDP.load("sc/sbcx_yc:GetSimilarDevice", { id: vm.id }, function (res) {
    if (res.check("获取同站,同电压,同类型的设备", true)) {
      var resData = res.value;
      if (resData.length > 0) {
        vm.dsJumpTo = [];
        vm.dsSameDevice = [];
        resData.forEach(item => {
          if(item.Id != vm.id){
            vm.dsJumpTo.push(item);
            vm.dsSameDevice.push([item.Id, item.Name]);
          }
        })
      }
    }
  });
};

//#region 方法
//#region 获取时间和时间间隔的方法
/**
 * 根据给定的时间和类型返回选择时间所处时间段的开始时间，结束时间，时间段相隔天数的函数
 * @param {string} format //天、周、月、年等类型
 * @param {time} select_date 开始时间一个时间参数就传这一个就好
 * @param {time} select_date_end //结束时间
 * @returns {start: start,end: end,span: span,} 返回一个对象包含起始时间，结束时间，时间间隔
 */
this.getDayAndSpan = function (dateType, select_date, select_date_end) {
  if (new Date(select_date).toString() === "Invalid Date") {
    return false;
  }
  select_date = new Date(select_date);
  if (select_date_end) {
    if (new Date(select_date_end).toString() === "Invalid Date") {
      return false;
    }
    select_date_end = new Date(select_date_end);
  }

  var start = "";
  var end = "";
  var span = "";
  var result = {};
  switch (dateType) {
    case "day":
      start = Ysh.Time.formatString(Ysh.Time.toString(select_date), "111000");
      end = Ysh.Time.formatString(Ysh.Time.toString(select_date), "111000");
      span = 1;
      break;
    case "week":
      var num = select_date.getDate() - select_date.getDay() + 1;
      var firstDay = new Date(select_date.setDate(num));
      var endDay = Ysh.Time.add("d", 6, firstDay);
      start = Ysh.Time.formatString(Ysh.Time.toString(firstDay), "111000");
      end = Ysh.Time.formatString(Ysh.Time.toString(endDay), "111000");
      span = 7;
      break;
    case "month":
      var str = Ysh.Time.toString(select_date);
      var arr = str.split("-");
      var year = arr[0];
      var month = arr[1];
      start = Ysh.Time.formatString(Ysh.Time.toString(new Date(year, Number(month) - 1, 1)), "111000");
      //获取月份天数
      span = Ysh.Time.getMonthMaxDays(year, month);
      end = Ysh.Time.formatString(Ysh.Time.toString(new Date(year, Number(month) - 1, span)), "111000");
      break;
    case "user_defined":
      if (!select_date || !select_date_end) {
        return false;
      }
      var sDate = new Date(select_date).getTime();
      var eDate = new Date(select_date_end).getTime();
      if (sDate > eDate) {
        var m = eDate;
        eDate = sDate;
        sDate = m;
      }
      span = (eDate - sDate) / (1 * 24 * 60 * 60 * 1000) + 1;
      start = Ysh.Time.formatString(Ysh.Time.toString(new Date(sDate)), "111000");
      end = Ysh.Time.formatString(Ysh.Time.toString(new Date(eDate)), "111000");
      break;
    default:
      return false;
  }
  result.start = start;
  result.end = end;
  result.span = span;
  return result;
};
//#endregion

//#region 获取数组第二小数据的方法
this.findSecondMinNum = function (arr) {
  var min = Number.MAX_VALUE;
  var second = Number.MAX_VALUE;
  for (var i = 0; i < arr.length; i++) {
    if (min > arr[i]) {
      second = min;
      min = arr[i];
    } else if (arr[i] < second && arr[i] != min) {
      //更新比最小值小，比第二小值大的
      second = arr[i];
    }
  }
  return second;
};
//#endregion

/**
 * @function 对数字数组进行线性插值
 * @param {Number} arr
 * @returns 插值后的数组
 */
this.findNotNull = function (arr) {
  var notNullArr = [];
  var notNullItem = {};
  arr.forEach((item, index) => {
    if (item !== null) {
      notNullItem = {};
      notNullItem.index = index;
      notNullItem.value = item;
      notNullArr.push(notNullItem);
    }
  });
  if (notNullArr.length <= 1) return;
  for (var i = 0; i < notNullArr.length - 1; i++) {
    var currentPoint = notNullArr[i];
    var nextPoint = notNullArr[i + 1];
    var span = nextPoint.index - currentPoint.index;
    var valueSpan = nextPoint.value - currentPoint.value;
    var unitValue = 0;
    if (valueSpan == 0) {
      unitValue = 0;
    } else {
      unitValue = valueSpan / span;
    }

    for (var j = 1; j <= span - 1; j++) {
      arr[currentPoint.index + j] = Number((currentPoint.value + j * unitValue).toFixed(3));
    }
  }
  return arr;
};
//#endregion

//#region 维持所选曲线至少有一条
this.$watch(
  "selLine",
  function (nv, ov) {
    if (nv.length === 0) {
      this.$nextTick(function () {
        this.selLine = [].concat(ov);
        vm.selectLineShow();
      });
    }
  },
  { deep: true }
);

//#endregion

this.$watch(
  "dsJumpTo",
  function (nv, ov) {
    this.$nextTick(function () {
      var h = this.$refs.divJumpto.clientHeight;
      if (h > 100) {
        this.isShowMore = true;
        this.jumpMoreClass = "shrink-more";
      } else {
        this.isShowMore = false;
      }
    });
  },
  { deep: true }
);
this.showMoreJumpto = function () {
  if (this.jumpMoreClass) {
    this.jumpMoreClass = "";
  } else {
    this.jumpMoreClass = "shrink-more";
  }
};
this.isAllowSelectMoreLine = function () {
  this.selectLineShow();
};
//启动初始化程序配置
this.initOption();
