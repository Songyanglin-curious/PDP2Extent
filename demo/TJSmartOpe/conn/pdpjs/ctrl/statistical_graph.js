/**
 * # 对数据统计的组件

> 传入原始参数可以统计两个纬度的数量，并且以表格和柱状图展示，也可以自己编写echarts回调函数，展示不同的图

## 参数及其说明

### 必要参数

| 参数名          | 参数类型 | 默认值 | 参数说明                                                     |
| --------------- | -------- | ------ | ------------------------------------------------------------ |
| data            | object[] |        | 原始数据为对象数组                                           |
| row_callback    | Function |        | 行回调函数，传入对象数组的每个对象，根据条件返回表格的行名，柱状图的标签名，不符合要求的返回false |
| column_callback | Function |        | 列回调函数，传入对象数组的每个对象，根据条件返回表格的列名，柱状图的每组的种类，不符合要求的返回false |

### 可选参数

| 参数名             | 参数类型 | 默认值 | 参数说明                                                     |
| ------------------ | -------- | ------ | ------------------------------------------------------------ |
| title              | String   | ""     | 最上面标题框中间的标题                                       |
| unit               | String   | ""     | 最上面标题框右边的的单位                                     |
| is_show_to_big     | Boolean  | true   | 是否展示最上面标题框左边的的放大按钮，点击改按钮可以将该组件放大至全屏 |
| row_rank           | Array    | []     | 限制表格行及柱状图展示的顺序，及展示内容                     |
| column_rank        | Array    | []     | 限制表格列及柱状图展示的顺序，及展示内容                     |
| is_show_table      | Boolean  | true   | 是否显示表格                                                 |
| is_show_column_all | Boolean  | true   | 是否显示表格列总计                                           |
| is_show_row_all    | Boolean  | true   | 是否显示表格行总计                                           |
| row_title          | String   | ""     | 表格第一行表头被斜线分割，该参数为每一行表头标题             |
| column_title       | String   | ""     | 该参数为每一列表头标题                                       |
| is_show_echarts    | Boolean  | true   | 是否显示Echarts图                                            |
| echarts_vertical   | Boolean  | true   | 默认的柱状图是否为垂直，默认是垂直的                         |
| echarts_color      | Array    | []     | 默认柱状图的自定义颜色                                       |
| echarts_option_fun | Function |        | 自定义Echarts图的回调函数，传入统计结果后的参数，返回符合Echarts的options |
 */
Vue.component("statistical_graph", {
  props: {
    data: {
      type: Array,
      require: true,
      default() {
        return []
      },
    },
    row_callback: {
      type: Function,
      require: true,
      // function(row){}
    },
    row_rank: {
      type: Array,
      default() {
        return []
      },
    },
    column_callback: {
      type: Function,
      require: true,
      // function(row){}
    },
    column_rank: {
      type: Array,
      default() {
        return []
      },
    },
    title: {
      type: String,
      default: "",
    },
    unit: {
      type: String,
      default: ""
    },
    is_show_to_big: {
      type: Boolean,
      default: true
    },
    is_show_table: {
      type: Boolean,
      default: true
    },
    is_show_column_all: {
      type: Boolean,
      default: true
    },
    is_show_row_all: {
      type: Boolean,
      default: true
    },
    row_title: {
      type: String,
      default: ""
    },
    column_title: {
      type: String,
      default: ""
    },
    is_show_echarts: {
      type: Boolean,
      default: true,
    },
    echarts_option_fun: {
      type: Function,
    },
    echarts_vertical: {
      type: Boolean,
      default: true,
    },
    echarts_color: {
      type: Array,
      default: function () {
        return []
      }
    },

  },
  data() {
    return {
      isBigPage: false,
      option: {},
      columns: [],
      rows: [],
      tableData: [],
      hEarch: 500,
      m: null,
    };
  },
  methods: {
    maxBlock: function () {
      if (this.m) {
        this.m.restore();
        this.m = null;
      } else
        this.m = Ysh.Web.maxElement(this.$refs.wrap);
      this.resize();
    },
    clickToBig: function () {
      this.isBigPage = !this.isBigPage
      this.maxBlock()
    },

    getInitData() {
      if (!this.data || this.data.length == 0) return;
      //初始化排序数组
      var haveRowRank = false;
      var haveColumnRank = false;
      var rowRank = []
      var columnRank = []
      if (this.row_rank && Array.isArray(this.row_rank) && this.row_rank.length > 0) {
        rowRank = this.row_rank
        haveRowRank = true
      }
      if (this.column_rank && Array.isArray(this.column_rank) && this.column_rank.length > 0) {
        columnRank = this.column_rank
        haveColumnRank = true
      }
      //对数据个数统计
      var countObj = { '总计': {} };
      for (var i = 0; i < this.data.length; i++) {
        var item = this.data[i];
        var rowKey = this.row_callback(item);
        if (rowKey) {
          if (!haveRowRank) {
            if (!rowRank.includes(rowKey)) rowRank.push(rowKey)
          }
          countObj[rowKey] ? "" : (countObj[rowKey] = {});
        } else {
          continue;
        }
        var columnKey = this.column_callback(item);
        if (columnKey) {
          if (!haveColumnRank) {
            if (!columnRank.includes(columnKey)) columnRank.push(columnKey)
          }
          countObj[rowKey][columnKey] ? countObj[rowKey][columnKey]++ : (countObj[rowKey][columnKey] = 1);
          countObj["总计"][columnKey] ? countObj["总计"][columnKey]++ : (countObj["总计"][columnKey] = 1);
        } else {
          continue;
        }
      }
      //转成二维数组
      var list = [];
      for (v in countObj) {
        var arr = [];
        arr.push(v);
        for (var j = 0; j < columnRank.length; j++) {
          var type = columnRank[j];
          arr.push(countObj[v][type] || 0);
        }
        var sum = 0;
        arr.slice(1, arr.length).forEach((item) => (sum += item));
        arr.push(sum);
        list.push(arr);
      }
      var statisticalData = [];
      //根据行排序
      rowRank.push('总计')
      rowRank.forEach((key) => {
        var find = list.find((item) => item[0] == key);
        if (find) {
          statisticalData.push(find);
        }
      });
      if(this.is_show_echarts){
        this.getEchartsOption(columnRank,statisticalData,countObj)
      }
      if(this.is_show_table){
        this.getTableData(columnRank, statisticalData)
      }
    },
    getEchartsOption:function(columnRank,statisticalData,countObj){
          //获取echarts数据
          var echartsData = [];
          for (var i = 0; i < statisticalData.length - 1; i++) {
            var row = statisticalData[i];
            echartsData.push([row[0], row.slice(1, row.length - 1)]);
          }
          if (this.echarts_option_fun) {
            this.option = this.echarts_option_fun(countObj);
          } else {
            this.option = this.getBar2DOption(echartsData, columnRank, this.echarts_color, this.echarts_vertical,);
          }
    },
    getTableData: function (columnRank, tableData) {
      //获取表格数据
      this.columns = columnRank;
      this.tableData = tableData;
      if (!this.is_show_row_all) {
        this.tableData.pop();
      }
      if (!this.is_show_column_all) {
        for (var i = 0; i < this.tableData.length; i++) {
          var item = this.tableData[i]
          item.pop();
        }
      }
    },

    //2D条形
    getBar2DOption: function (data, xnames, color, isVertical) {
      var legends = [];
      var series = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var name = item[0];
        legends.push(name);
        series.push({
          type: "bar",
          barMaxWidth: "50%",
          name: name,
          data: item[1],
        });

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
          lineHeight: 15,
          formatter: function (value, index) {
            var length = value.length;
            if (length < (isVertical ? 6 : 20)) return value;
            var re = "";
            var s = value.split("");
            var num = parseInt(length / 2);
            for (var i = 0, j = 1; i < length; i++, j++) {
              if (j == num) {
                re += s[i] + "\n";
              } else {
                re += s[i];
              }
            }
            return re;
          },
        },
      };
      var xAxis = axis1;
      var yAxis = axis2;
      if (isVertical) {
        xAxis = axis2;
        yAxis = axis1;
      }
      var maxStringLength = 0;
      for (var i = 0; i < xnames.length; i++) {
        var xname = xnames[i];
        if (maxStringLength < xname.length) {
          maxStringLength = xname.length;
        }
      }
      xAxis.axisLabel.rotate = maxStringLength > 15 ? 40 : 0;

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
        //color:undefined,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
      };
      if (color && color.length > 0) {
        option.color = color
      }
      return option;
    },
  },
  created() {
    Ysh.Vue.addHandle(this, "resize", function () {
      var hAll = this.$el.clientHeight;
      var hTitle = this.$refs.title ? this.$refs.title.offsetHeight : 0;
      var htable = this.$refs.table? this.$refs.table.offsetHeight : 0;
      this.hEarch = hAll - hTitle - htable - 20;
    }, true);
  },
  mounted() {
  },
  watch: {
    //正确给 cData 赋值的 方法
    data: function (newVal, oldVal) {
      if (newVal) {
        //当newVal 数据发生改变时
        this.getInitData();
        this.$nextTick(function () {
          this.resize();
        })

      }
    },
  },

  template: `<div class='f dc title-div' ref="wrap">
    <div class='wrapper-title' ref="title">
        <i @click="clickToBig" :class="[isBigPage ? 'ivu-icon-md-contract' : 'ivu-icon-md-expand']" class="ivu-icon" :style="{'visibility' :is_show_to_big ? 'visible' : 'hidden'}" style="cursor:pointer;font-size:24px" ></i>
        <span >{{title}}</span>
        <span >{{unit}}</span>
    </div>
    <div ref='divContent'  class="wrapper-content" >
        <ecommonchart :style="{  height: hEarch + 'px' }" :option="option" v-if="is_show_echarts">
        </ecommonchart>
        <div  v-if="is_show_table" style="overflow: auto;">
          <table ref="table" class="common-table" width="100%">
              <tr>
                  <td class="tab-twotitle">
                      <span>{{column_title}}</span>
                      <span>{{row_title}}</span>
                  </td>
                  <td v-for="column in columns" style="text-align:center">
                      <span>{{column}}</span>
                  </td>
                  <td style="text-align:center" v-if="is_show_column_all">
                      <label > 总计</label>
                  </td>
              </tr>
              <tr v-for="row in tableData">
                <td v-for="subColumn in row" style="text-align:center">
                    <span>{{subColumn}}</span>
                </td>
              </tr>
            </table>
        </div>
    </div>
</div>`,
});
