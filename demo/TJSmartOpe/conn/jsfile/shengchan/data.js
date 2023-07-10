/*v=1.21.806.1*/
var ProjectShanxi = {
  getData: function (name, args, cbOk, cbFail) {
    PDP.read("SGC", "sgc/xny:" + name, args, function (data) {
      if (data.isOK) cbOk(data.value);
      else {
        console.log(data);
        if (cbFail) cbFail(data);
      }
    });
  },
  getDataEx: function (nameargs, cbOk, cbFail) {
    var dlls = [];
    for (var i = 0; i < nameargs.length; i++) {
      var namearg = nameargs[i];
      dlls.push({ type: "read", db: "SGC", sql: "sgc/xny:" + namearg.name, args: namearg.args });
    }
    PDP.exec(dlls, function (data) {
      if (data.isOK) cbOk(data.value);
      else {
        console.log(data);
        if (cbFail) cbFail(data);
      }
    });
  },
  getYearData: function (o, data, options) {
    var yearCol = options.yearCol;
    var f = options.fData;
    var min = options.min || 9999,
      max = options.max || 0;
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var year = parseInt(row[yearCol], 10);
      if (min > year) min = year;
      if (max < year) max = year;
      o[year] = f(o[year], row);
    }
    options.min = min;
    options.max = max;
  },
  getMonthString: function (y, m) {
    return y + "年" + (m < 10 ? "0" : "") + m + "月";
  },
  getMonthData: function (months, o, data, options) {
    var yearCol = options.yearCol;
    var monthCol = options.monthCol;
    var f = options.fData;
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var year = parseInt(row[yearCol], 10);
      var month = parseInt(row[monthCol], 10);
      var str = this.getMonthString(year, month);
      var item = f(o[str], row);
      item.y = year;
      item.m = month;
      o[str] = item;
      months.addSkipSame(str);
    }
  },
  toYearArray: function (o, options, f) {
    var min = options.min;
    var max = options.max;
    var years = [];
    var values = [];
    for (var i = min; i <= max; i++) {
      years.push(i);
      var d = o[i];
      if (f) d = f(d, o[i - 1]);
      values.push(d);
    }
    return [years, values];
  },
  yearTypeData: function (data, options) {
    //options : typeCol,yearCol,valueCol,types,fillEmpty
    var yearCol = options.yearCol;
    var typeCol = options.typeCol;
    var valueCol = options.valueCol;
    var types = [];
    var o = {};
    var min = 9999,
      max = 0;
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var type = row[typeCol];
      var year = parseInt(row[yearCol], 10);
      var value = row[valueCol];
      if (min > year) min = year;
      if (max < year) max = year;
      o[type + "_" + year] = value;
    }
    types = options.types || types;
    var years = [];
    var values = [];
    for (var i = min; i <= max; i++) {
      years.push(i);
      var row = [];
      for (var j = 0; j < types.length; j++) {
        var v = o[types[j] + "_" + i];
        if (typeof v == "undefined") {
          if (options.fillEmpty == "last") {
            if (values.length > 0) v = values[values.length - 1][j];
          } else {
            v = options.fillEmpty;
          }
        }
        row.push(v);
      }
      values.push(row);
    }
    return [years, values];
  },
  yearOnlyAdd: function (values, n) {
    var newValues = [];
    if (values.length > 0) {
      newValues.push(values[0]);
      for (var i = 1; i < values.length; i++) {
        var newRow = [];
        var row = values[i];
        var rowPrev = values[i - 1];
        for (var j = 0; j < n; j++) {
          newRow.push(parseFloat(row[j]) - parseFloat(rowPrev[j]));
        }
        newValues.push(newRow);
      }
    }
    return newValues;
  },
  partYears: function (years, values, s, e) {
    var newYears = [];
    var newValues = [];
    e = e || years[years.length - 1];
    var idx = years.indexOf(s);
    for (var i = s; i <= e; i++, idx++) {
      newYears.push(i);
      newValues.push(values[idx]);
    }
    return [newYears, newValues];
  },
  sumYear: function (values, idxGroups, f) {
    for (var r = 0; r < values.length; r++) {
      var row = values[r];
      for (var i = 0; i < idxGroups.length; i++) {
        var idxs = idxGroups[i];
        var v = 0;
        for (var j = 0; j < idxs.length; j++) v += parseFloat(row[idxs[j]]);
        row.push(f ? f(v) : v);
      }
    }
  },
  getCurveData: function (tmStart, tmEnd, data, f) {
    var ret = [];
    for (var i = 0; i < 1440; i++) ret.push("");
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var tm = new Date(Ysh.Time.parseDate(row[0]));
      var idx = Ysh.Time.diff("mi", tmStart, tm);
      for (var j = 0; j < 60; j++) {
        var v = row[j + 1];
        if (f) v = f(v);
        ret[idx + j] = v;
      }
    }
    return ret;
  },
  getGenType: function (gen) {
    var arrMgs = ["陕西华电瑶池发电有限公司", "黄陵矿业煤矸石发电有限公司(二期)", "神华神东电力有限责任公司郭家湾电厂", "陕西新元发电有限公司", ""];
    var arrRq = ["神木市久业发电有限公司", "陕西莱德集团华盛综合发电有限公司"];
    if (arrMgs.indexOf(gen) >= 0) return 1;
    if (arrRq.indexOf(gen) >= 0) return 2;
    return 0;
  },
  getGenCeo: function (gen, cap) {
    var type = this.getGenType(name);
    switch (type) {
      case 1: //煤矸石
        return 1.146;
      case 2: //燃气
        return 0.392;
      default: //燃煤
        if (cap >= 300) return 0.877;
        return 0.979;
    }
  },
  getCarbonQd: function (c, p) {
    return Ysh.Number.toFixed(c / p, 4);
  },
  setOptionTooltip: function (option) {
    option.tooltip = {
      show: true,
      trigger: "axis",
      formatter: function (params) {
        var str = "<div><p>" + params[0].name + "</p></div>";
        for (var i = 0; i < params.length; i++) {
          var p = params[i];
          var s = option.series[p.seriesIndex];
          var unit = option.yAxis[s.yAxisIndex || 0].name;
          str += p.marker + " " + p.seriesName + " : " + p.data + unit + "<br />";
        }
        return str;
      },
    };
    option.dataZoom = [{ type: "inside" }];
    return option;
  },
  getMax: function (lst, col) {
    var rMax = null;
    var vMax = 0;
    for (var i = 0; i < lst.length; i++) {
      var row = lst[i];
      var v = row[col];
      if (v === "") continue;
      v = parseFloat(v);
      if (!rMax) {
        rMax = row;
        vMax = v;
        continue;
      }
      if (v > vMax) {
        rMax = row;
        vMax = v;
      }
    }
    return rMax;
  },
  getMin: function (lst, col) {
    var rMin = null;
    var vMin = 0;
    for (var i = 0; i < lst.length; i++) {
      var row = lst[i];
      var v = row[col];
      if (v === "") continue;
      v = parseFloat(v);
      if (!rMin) {
        rMin = row;
        vMin = v;
        continue;
      }
      if (v < vMin) {
        rMin = row;
        vMin = v;
      }
    }
    return rMin;
  },
  textToArray: function (d) {
    d = d.split("\n");
    var data = [];
    for (var j = 0; j < d.length; j++) {
      data.push(d[j].split(","));
    }
    return data;
  },
  getLastValidInfo: function (meas) {
    for (var r = meas.length - 1; r >= 0; r--) {
      var row = meas[r];
      for (var c = 60; c > 0; c--) {
        var v = row[c];
        if (v === "") continue;
        return [v, row[0], c - 1];
      }
    }
    return ["", "", ""];
  },
  getLastValid: function (meas) {
    return this.getLastValidInfo(meas)[0];
  },
  Array: {
    sumCol: function (ds, vcol, fMeet) {
      var v = 0;
      for (var i = 0; i < ds.length; i++) {
        var row = ds[i];
        if (fMeet) if (!fMeet(row)) continue;
        var vv = row[vcol];
        if (vv) v += parseFloat(row[vcol]);
      }
      return v;
    },
    toDict: function (array2d, field) {
      var o = {};
      field = field || 0;
      for (var i = 0; i < array2d.length; i++) {
        var row = array2d[i];
        var key = row[field];
        o[key] = row;
      }
      return o;
    },
    getRate:function(data){
      var sum = 0;
      for(var i = 0;i < data.length ;i++){
        sum += data[i][1]
      }
      var tableData = [];
      for(var i =0 ;i < data.length ; i++){
        var item = data[i];
        item[2] = ((Number(item[1])/Number(sum))*100).toFixed(1) + '%'
        tableData.push(item)
      }
      return tableData
    },
    getDistinctArray:function(array){
      var arr = [];
      for(var i = 0; i < array.length; i++){
        if(!arr.includes(array[i]))
        arr.push(array[i]);
      }
      return arr;
    },
  },
  DicttoArray:function(value,colarr){
    var arr = [];
        for(var i = 0; i < value.length; i++){
          var r = value[i];
          var item = [];
          for(id in r){
            if(!colarr||colarr.includes(id))
            item.push(r[id]);
          }
          arr.push(item);
        }
        return arr;
  },
  Meas: {
    add: function (v1, v2) {
      if (v1 === "") return v2;
      if (v2 === "") return v1;
      return parseFloat(v1) + parseFloat(v2);
    },
  },
  Curve: {
    getLimit: function (curve, f) {
      var vLimit = "";
      var vTime = "";
      var vIndex = 0;
      for (var i = 0; i < curve.length; i++) {
        var row = curve[i];
        for (var j = 1; j < 61; j++) {
          var v = row[j];
          if (v === "") continue;
          v = parseFloat(v);
          if (vLimit === "" || f(vLimit, v)) {
            vLimit = v;
            vTime = row[0];
            vIndex = j - 1;
          }
        }
      }
      if (vLimit === "") return ["", "", "", ""];
      if (vIndex == 0) return [vLimit, vTime, vTime, vIndex];
      return [vLimit, Ysh.Time.add("mi", vIndex, new Date(Ysh.Time.parseDate(vTime))), vTime, vIndex];
    },
    getLast: function (curve) {
      return ProjectShanxi.getLastValid(curve);
    },
    add: function (tmStart, tmEnd, curves) {
      var o = {};
      for (var c = 0; c < curves.length; c++) {
        var curve = curves[c];
        for (var i = 0; i < curve.length; i++) {
          var row = curve[i];
          var tm = row[0];
          if (!o[tm]) {
            o[tm] = Ysh.Object.clone(row);
          } else {
            var oRow = o[tm];
            for (var j = 1; j < 61; j++) {
              oRow[j] = ProjectShanxi.Meas.add(oRow[j], row[j]);
            }
          }
        }
      }
      var ret = [];
      for (var tm = tmStart; tm < tmEnd; tm = Ysh.Time.add("hh", 1, tm)) {
        var str = Ysh.Time.toString(tm);
        if (o[str]) ret.push(o[str]);
        else {
          var row = Ysh.Array.initN(61, "");
          row[0] = str;
          ret.push(row);
        }
      }
      return ret;
    },
    getValue: function (curve, tm, index) {
      for (var i = 0; i < curve.length; i++) {
        var row = curve[i];
        if (row[0] == tm) return row[index + 1];
      }
      return "";
    },
    colors:['#e1727a', '#ffb66f', '#fff390', '#6ed7ac', '#5ac8dc', '#4b93dd', '#c792d9'],
    //3D条形
    getBar3DOption: function (data, xnames,isVertical) {
      return this.getBar2DOption(data, xnames,isVertical);
      var legends = [];
      var series = [];
      var colors = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var name = item[0];
        var color = item[2];
        /*var color1 = item[3];
                var color2 = item[4]||"transparent";
                var areaStyle;
                if (color1 && color2)
                    areaStyle = {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [{ offset: 0, color: color1 }, { offset: 1, color: color2 }]),
                    }*/
        legends.push(name);
        series.push({
          name: name,
          animation: false,
          //xAxis: i,
          title: name,
          data: item[1], //item[1].filter(function(data,index){return index<1441}),//只保留当日24小时加次日0点共24*60+1个数据
          //color: color,
          /*lineColor: color,
                    fillColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, color1],
                            [1, 'transparent']
                        ]
                    },
                    itemStyle: {
                        normal: {
                            areaStyle: areaStyle,
                            lineStyle: {  //线的颜色
                                color: color,
                                width: 3
                            },
                        },
                    },*/
        });
        colors.push(color);
      }
      var option = {
        chart: {
          type: "bar",
          //margin: 75,
          backgroundColor: "transparent",
          options3d: {
            enabled: true,
            alpha: 5,
            beta: 15,
            depth: 50,
            viewDistance: 100, // 视图距离，它对于计算角度影响在柱图和散列图非常重要。此值不能用于3D的饼图
            frame: {
              // Frame框架，3D图包含柱的面板，我们以X ,Y，Z的坐标系来理解，X轴与 Z轴所形成
              // 的面为bottom，Y轴与Z轴所形成的面为side，X轴与Y轴所形成的面为back，bottom、
              // side、back的属性一样，其中size为感官理解的厚度，color为面板颜色
              bottom: {
                size: 10,
              },
              side: {
                size: 1,
                color: "transparent",
              },
              back: {
                size: 1,
                color: "transparent",
              },
            },
          },
        },
        title: {
          text: "",
        },
        subtitle: {
          text: "",
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            depth: 50,
            //pointWidth:35,
            //groupZPadding:50,
            edgeWidth: 1,
          },
        },
        xAxis: {
          categories: xnames,
          //gridLineColor: '#266abf',
          labels: {
            style: { color: "#fff" },
            formatter: function (value) {
              var re= '';
              var length = value.value.length;
              var s = value.value.split('');
              for (var i = 0,j=1; i < length; i++,j++) {
                  if (j&&j % 8 == 0) {
                      re += '/n';
                  } else {
                      re += s[i];
                  }
              }
              return re;
            },
          },
        },
        yAxis: {
          title: {
            text: null,
          },
          labels: {
            style: { color: "#fff" },
          },
        },
        colors: colors,
        series: series,
      };
      return option;
    },
    //2D条形
    getBar2DOption: function (data, xnames, isVertical) {
      var legends = [];
      var series = [];
      var colors = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var name = item[0];
        var color = item[2]; /*new echarts.graphic.LinearGradient(
          0, 1, 1, 0,
          [
              {offset: 0, color: 'transparent'},
              {offset: 0.8, color: item[2]}
          ]
      );*/
       
        legends.push(name);
        series.push({
          type: "bar",
          barMaxWidth: "50%",
          name: name,
          data: item[1],
        });
        colors.push(color);
      }
      var axis1 = {
        type: "value",
        splitNumber: 6,
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: "#fff",
        },
        minInterval: 1,
        boundaryGap: [0, 0.01],
      };
      var axis2 = {
        type: "category",
        data: xnames,
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 1)",
          },
        },
        minInterval: 1,
        axisLabel: {
          color: "rgba(255, 255, 255, 1)",
          interval: 0,
          width: 70,
          overflow: "truncate",
          lineHeight:15,
          formatter: function (value, index) {
              var length = value.length;
              if(length<(isVertical?6:20)) return value;
              var re= '';
              var s = value.split('');
              var num = parseInt(length/2);
              for (var i = 0,j=1; i < length; i++,j++) {
                  if (j == num ) {
                      re += (s[i]+'\n');
                  } else {
                      re += s[i];
                  }
              }
              return re;
          }
        },
      };
      var xAxis = axis1;
      var yAxis = axis2;
      if (isVertical) {
       // axis2.axisLabel.rotate = data[0][1].length >5 ? 40 : 0,
        xAxis = axis2;
        yAxis = axis1;
      }
      var maxStringLength = 0;
      for(var i = 0 ; i < xnames.length ; i++){
        var xname  = xnames[i];
        if(maxStringLength < xname.length){
          maxStringLength = xname.length
        }
      }
      xAxis.axisLabel.rotate = maxStringLength >15 ? 40 : 0
      var option = {
        backgroundColor: "transparent",
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          show: data.length > 1,
          orient: "vertical",
          align: "left",
          right: "2%",
          textStyle: {
            color: "rgba(255, 255, 255, 1)",
          },
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          top: "5%",
          containLabel: true,
        },
        xAxis: xAxis,
        yAxis: yAxis,
        color: colors,
        series: series,
      };
      return option;
    },
    //3D饼图
    getPie3DOption: function (data) {
      var legends = [];
      var datalist = [];
      var colors = [];
      var xnames = [];
      var name = data[0];
      for (var i = 0; i < data[1].length; i++) {
        var item = data[1][i];
        var color = item[2]||this.colors[i]||Highcharts.getOptions().colors[i];
        legends.push(name);
        datalist.push([item[0], item[1]]);
        colors.push(color);
      }
      var option = {
        chart: {
          type: "pie",
          backgroundColor: "transparent",
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0,
          },
          spacing:[0,0,0,0]
        },
        title: {
          text: "",
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.y}</b>",
        },
        legend: {
          enabled: true,
          verticalAlign: "bottom",
          itemStyle: { color: "#fff" },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            depth: 25,
            borderWidth: 1,
            showInLegend: true,
            minSize:100,
            dataLabels: {
              enabled: true,
              padding: 0,
              connectorPadding:0,
              connectorColor: '#fff',
              distance:'20%',
              format: "<b>{point.percentage:.1f}%</b>",
              style: {
                //fontSize:'26px',
                textOutline: "none",
                color: "#fff",
              },
            },
          },
        },
        colors: colors,
        series: [
          {
            type: "pie",
            name: name,
            data: datalist,
          },
        ],
      };
      return option;
    },
    //3D柱图
    getColumn3DOption: function (data, xnames, is2D) {
      return this.getBar2DOption(data, xnames ,true);
      var legends = [];
      var series = [];
      var colors = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var name = item[0];
        var color = item[2]||Highcharts.getOptions().colors[i];
        legends.push(name);
        series.push({
          name: name,
          animation: false,
          title: name,
          data: item[1].map(function(value){return parseFloat(value)||0}),
        });
        colors.push(color);
      }
      var option = {
        chart: {
          type: "column",
          backgroundColor: "transparent",
          options3d: {
            enabled: !is2D,
            alpha: 5,
            beta: 15,
            depth: 100,
            viewDistance: 200, // 视图距离，它对于计算角度影响在柱图和散列图非常重要。此值不能用于3D的饼图
            frame: {
              // Frame框架，3D图包含柱的面板，我们以X ,Y，Z的坐标系来理解，X轴与 Z轴所形成
              // 的面为bottom，Y轴与Z轴所形成的面为side，X轴与Y轴所形成的面为back，bottom、
              // side、back的属性一样，其中size为感官理解的厚度，color为面板颜色
              bottom: {
                size: 1,
                color: "#dfe2e23b",
              },
              side: {
                size: 1,
                color: "transparent",
              },
              back: {
                size: 1,
                color: "transparent",
              },
            },
          },
          marginBottom: is2D?10:50,
        },
        title: {
          text: "",
        },
        subtitle: {
          text: "",
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          column: {
            depth: 50,
            pointWidth: 35,
            //groupZPadding:50,
            edgeWidth: 1,
            dataLabels: {
              enabled: true,
              align: "center",
              //borderRadius: 5,
              //backgroundColor: 'rgba(252, 255, 197, 0.7)',
              borderWidth: 1,
              borderColor: "#AAA",
              y: -30,
              x: 0,
              color: "#d4f8fd",
              style: { fontSize: "12px" },
            },
          },
        },
        xAxis: {
          categories: xnames,
          gridLineColor: "transparent",
          labels: {
            enabled: true,
            formatter: function (value) {
              var re= '';
              var length = value.value.length;
              var s = value.value.split('');
              for (var i = 0,j=1; i < length; i++,j++) {
                  if (j&&j % 10 == 0) {
                      re += '<br/>';
                  } else {
                      re += s[i];
                  }
              }
              return re;
            },
            align: "center",
            step: 1,
            y: 60,
            x: -30,
            rotation: -20,
            style: { color: "#fff", fontSize: "12px" },
          },
        },
        yAxis: {
          title: {
            text: null,
          },
          gridLineColor: "transparent", //y刻度线
          labels: {
            enabled: false,
          },
        },
        colors: colors,
        series: series,
      };
      return option;
    },

    getCountByVoltage: function (voltageCounts) {
      var res = {
        全部: 0,
        "1000kV": 0,
        "500kV": 0,
        直流: 0,
      };
      voltageCounts.forEach((item) => {
        res["全部"] += Number(item.Count);
        if (item.Voltage.includes("1000kV")) {
          res["1000kV"] += Number(item.Count);
        }
        if (item.Voltage.includes("500kV")) {
          res["500kV"] += Number(item.Count);
        }
        if (!item.Voltage.includes("交流")) {
          res["直流"] += Number(item.Count);
        }
      });
      return res;
    },
    //2D环形图
    getPie2DOption: function (title, data, color) {
      var option = {
        title: {
          text: title,
          textStyle: {
            color: "#fff",
            fontSize: 24,
          },
          left: "center",
          top: "center",
        },

        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "1%",
          left: "center",
          icon: "rect",
          textStyle: {
            color: "#fff",
          },
        },
        avoidLabelOverlap : true,
        color: color,
        series: [
          {
            type: "pie",
            radius: ["50%", "80%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "outside",
              formatter: "{b} , {c}\n{d}%",
              color: "#fff",
            },
            emphasis: {
              show: true,
              scaleSize: 20,
              focus: "self",
            },
            labelLine: {
              show: true,
            },
            data: data,
          },
        ],
      };
      return option;
    },
    //2D单轴点图
    getScatter2DOption: function (seriesName, xAxis, yAxis) {
      var yValue = Ysh.Array.col(yAxis,1);
      var maxValue = Math.max.apply(null,yValue);
      var option = {
        tooltip: {
          position: "top",
          trigger: "item",
        },
        grid: {
          left: '20px',
          right: '20px',
          top:'20px',
          bottom:'20px',
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: xAxis,
          splitLine: {
            show: true,

            lineStyle: {
              color: "#4D7A82",
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#507D85",
            },
          },
          axisLabel: {
            formatter: "{value}",
            textStyle: {
              color: "#ffffff",
            },
          },
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          splitLine: {
            show: true,
            lineStyle: {
              color: "#4D7A82",
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#507D85",
            },
          },
          axisLabel: {
            formatter: "{value}个",
            textStyle: {
              color: "#ffffff",
            },
          },
          boundaryGap: true,
          //   axisTick: {
          //     alignWithLabel: true,
          //   },
        },
        series: [
          {
            name: seriesName,
            type: "scatter",
            symbolSize: function (value) {
              if(maxValue >= 100){
                var lgv = Math.log(value[1]);
                if (value[1] < 100) {
                  return lgv * 4;
                }
                if (value[1] < 1000) {
                  return lgv * 4;
                }
                if (value[1] < 10000) {
                  return lgv * 6;
                }
              }
              if(maxValue > 10){
                var lgv = Math.log(value[1]);
                return lgv * 6;
              }
              if(maxValue <=10){
                return value[1] * 5;
              }

            },
            color: "#DE6F7A",
            data: yAxis,
            animationDelay: function (idx) {
              return idx * 4;
            },
          },
        ],
      };
      return option;
    },
    //2D饼图
    getFullPie2DOption:function(data,colors,title){
      if(!colors)
      colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
      var legends = [];
      var datalist = [];
      var xnames = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        datalist.push({name:item[0],value: item[1]});
      }
      var option = {
        title: {
          text: title,
          textStyle: {
            color: "#fff",
            fontSize: 24,
          },
          top: "center",
        },

        tooltip: {
          trigger: "item",
        },
        legend: {
          // bottom: "50%",
          // right: "3%",
          // icon: "rect",
          // orient: 'vertical',
          type: 'scroll',
          bottom: 10,
          textStyle: {
            color: "#fff",
          },
        },
        color: colors,
        avoidLabelOverlap : true,
        series: [
          {
            type: "pie",
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: "outside",
              formatter: "{b}\n{c},{d}%",
              color: "#fff",
              // borderWidth:1,
              // borderColor:'#fff',
              // padding:[5,5,5,5],
            },
            emphasis: {
              show: true,
              scaleSize: 20,
              focus: "self",
            },
            labelLine: {
              show: true,
            },
            data: datalist,
          },
        ],
      };
      return option;
    }
  },
  devtypes:['主变压器','断路器','电力电容器','电抗器','避雷器','电流互感器','电压互感器','隔离开关','母线','组合电器'],
  allDevtypes:['主变压器','断路器','母线','隔离开关','组合电器','电力电容器','电抗器','开关柜','放电线圈','低压隔离开关','低压开关','穿墙套管','所用变','直流避雷器','低压开关柜',
  '直流分压器','串联补偿装置','换流变压器','电流互感器','电压互感器','接地网','站内电缆终端','熔断器','耦合电容器','避雷器','直流接地刀闸','阻波器','绝缘子','站内电缆','低压母线','避雷针'],
  getDevdataBytype:function(type){
    return PDP.load("sc/sbzc:DeviceDetail/Breaker", {type:'断路器'}).value;
  }
};

var V = {
  tp: function (v) {
    if (!v) return v;
    return Ysh.Number.toFixed(v / 100000000.0, 4);
  },
  qd: function (c, p) {
    if (!p) return "";
    return Ysh.Number.toFixed(c / p, 4);
  },
  dl: function (v) {
    if (!v) return v;
    return parseInt(v / 10.0);
  },
  cap: function (v) {
    if (!v) return v;
    return parseInt(v);
  },
  //dl: function (v) { if (!v) return v; return parseInt(v / 100000.0 + 0.5); },
  zzl: function (v1, v2) {
    if (!v2) return "";
    return Ysh.Number.toFixed(((v1 - v2) * 100.0) / v2, 2);
  },
  bl: function (v1, v2) {
    if (!v2) return "";
    return Ysh.Number.toFixed((v1 * 100.0) / v2, 2);
  },
  percent: function (v) {
    if (v === "") return v;
    return Ysh.Number.toFixed(v * 100, 2) + "%";
  },
};

var CLR = {
  //水电1bdba0   风电ba42f3     光伏edc127     火电d04626    清洁能源00ffff
  //总量：667fff   清洁能源：00ffff    碳排放：a5e2fe
  HUO: "#d04626",
  SHUI: "#1bdba0",
  FENG: "#ba42f3",
  GUANG: "#edc127",
  QJNY: "#00ffff",
  ZDL: "#667fff",
  TPF: "#a5e2fe",
  AXIS: "#fcecc9",
};

var FONT = {
  LEGEND_SIZE2: 16,
};

var UNIT = {
  DIANLIANG: "万千瓦时",
  GONGLV: "万千瓦",
  TPF: "亿tCO₂",
  TPFQD: "tCO₂/MWh",
};
