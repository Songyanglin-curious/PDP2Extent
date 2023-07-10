/**
 * # 对数据统计的组件

> 传入原始参数可以统计一个纬度的数量并且截取最前面几个也可以是最后面的，并且以表格和柱状图展示

## 参数及其说明

### 必要参数

| 参数名          | 参数类型 | 默认值 | 参数说明                                   |
| --------------- | -------- | ------ | ------------------------------------------ |
| data            | object[] |        | 原始数据为对象数组                         |
| statistic_key   | String   |        | 被统计的字段的key                          |
| statistic_title | String   |        | 被统计字段的名字，也是表格上该字段的列标题 |

### 可选参数

| 参数名          | 参数类型 | 默认值 | 参数说明                                                     |
| --------------- | -------- | ------ | ------------------------------------------------------------ |
| title           | String   | ""     | 最上面标题框中间的标题，默认为 statistic_title + 排行top + top数，当传入参数时为传入的的值 |
| unit            | String   | ""     | 最上面标题框右边的的单位                                     |
| is_show_to_big  | Boolean  | true   | 是否展示最上面标题框左边的的放大按钮，点击改按钮可以将该组件放大至全屏 |
| count_title     | String   | "个数" | 表格显示被统计字段的列标题                                   |
| top_count       | Number   | 5      | 展示top几                                                    |
| is_reverse_top  | Boolean  | false  | 是否展示倒数top，默认为从大到小                              |
| is_show_table   | Boolean  | true   | 是否显示表格                                                 |
| is_show_rate    | Boolean  | true   | 是否显示表格比例列                                           |
| is_show_echarts | Boolean  | true   | 是否显示Echarts图                                            |
| echarts_color   | String   |  ""    | Echarts的颜色                                                |
| echarts_option_fun | Function |        | 自定义Echarts图的回调函数，传入统计结果后的参数，返回符合Echarts的options |
 */
Vue.component("top_graph", {

  props: {
    title: {
      type: String,
      default: ""
    },
    unit: {
      type: String,
      default: ""
    },
    is_show_to_big: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      require: true,
      default() {
        return []
      },
    },
    statistic_key: {
      type: String,
      require: true,
    },
    statistic_title: {
      type: String,
      require: true,
    },
    count_title: {
      type: String,
      default: '个数'
    },
    top_count: {
      type: Number,
      default: 5
    },
    is_reverse_top: {
      type: Boolean,
      default: false,
    },

    is_show_table: {
      type: Boolean,
      default: true
    },
    is_show_rate: {
      type: Boolean,
      default: true,
    },
    is_show_echarts: {
      type: Boolean,
      default: true,
    },
    echarts_vertical: {
      type: Boolean,
      default: true,
    },
    echarts_color: {
      type: String,
    },
    echarts_option_fun: {
      type: Function,
    },

  },
  data() {
    return {
      isBigPage: false,
      option: {},
      columns: [],
      tableData: [],
      hEarch: 100,
      m: null,
      boxTitle: "",
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
      var key = this.statistic_key
      var keyTtitle = this.statistic_title
      var countTitle = this.count_title
      var counts = this.getCount(this.data, function (item) {
        return item[key]
      });
      var title = ""
      if (this.is_reverse_top) {
        title = `${keyTtitle}排行倒数top${this.top_count}`
        var sortCounts = counts.sort(function (x, y) { return Ysh.Compare.compareNumber(x[1], y[1]); });
      } else {
        title = `${keyTtitle}排行top${this.top_count}`
        var sortCounts = counts.sort(function (x, y) { return -Ysh.Compare.compareNumber(x[1], y[1]); });
      }
      this.title ? this.boxTitle = this.title : this.boxTitle = title

      var rateData = this.getRate(sortCounts)
      var topNum = Number(this.top_count)
      var topData = rateData.slice(0, topNum);
      this.getEchartsOption(topData, keyTtitle)
      this.getTableData(topData, keyTtitle, countTitle)

    },
    getEchartsOption: function (topData, keyTtitle) {
      var color = [this.echarts_color]
      if (this.echarts_option_fun) {
        this.option = this.echarts_option_fun(topData);
      } else {
      this.option = this.getBar2DOption([[keyTtitle, Ysh.Array.col(topData, 1)]], Ysh.Array.col(topData, 0), color, this.echarts_vertical);
      }
    },
    getTableData: function (topData, keyTtitle, countTitle) {
      var columnKey = ['col0', 'col1', 'col2']
      var columnTitle = [keyTtitle, countTitle, '比例']
      if (!this.is_show_rate) { columnTitle.pop() }
      var columns = []
      for (var i = 0; i < columnTitle.length; i++) {
        var key = columnKey[i]
        var title = columnTitle[i]
        var item = {}
        item.title = title;
        item.key = key;
        columns.push(item)
      }
      var tableData = []
      for (var i = 0; i < topData.length; i++) {
        var row = topData[i]
        var item = {}
        for (var j = 0; j < row.length; j++) {
          item[columnKey[j]] = row[j]
        }
        tableData.push(item)
      }
      this.columns = columns
      this.tableData = tableData
    },
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
    getRate: function (data) {
      var sum = 0;
      for (var i = 0; i < data.length; i++) {
        sum += data[i][1]
      }
      var tableData = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        item[2] = ((Number(item[1]) / Number(sum)) * 100).toFixed(1) + '%'
        tableData.push(item)
      }
      return tableData
    },
    getCount: function (data, vIdx) {
      var o = {};
      for (var i = 0; i < data.length; i++) {
        var v = Ysh.Type.isFunction(vIdx) ? vIdx(data[i]) : data[i][vIdx];
        if (Ysh.Type.isArray(v)) {
          for (var j = 0; j < v.length; j++)
            o[v[j]] = (o[v[j]] || 0) + 1;
        } else
          o[v] = (o[v] || 0) + 1;
      }
      var s = [];
      for (v in o) {
        s.push([v, o[v]]);
      }
      return s;
    },
    updateValue: function () {
      this.getInitData();
      this.$nextTick(function () {
        this.resize();
      })
    }
  },
  created() {
    Ysh.Vue.addHandle(this, "resize", function () {
      var hAll = this.$el.clientHeight;
      var hSlotWrap = this.$refs.slotWrap ? this.$refs.slotWrap.offsetHeight : 0;
      var hTitle = this.$refs.title ? this.$refs.title.offsetHeight : 0;
      var htable = this.$refs.table ? this.$refs.table.offsetHeight : 0;
      this.hEarch = hAll - hSlotWrap - hTitle - htable - 20;
    }, true);
  },
  mounted() {
  },
  watch: {
    //正确给 cData 赋值的 方法
    data: function (newVal, oldVal) {
      if (newVal) {
        //当newVal 数据发生改变时
        this.updateValue();

      }
    },
  },

  template: `<div class='f dc title-div' ref="wrap">
    <div class='wrapper-title' ref="title">
        <i @click="clickToBig" :class="[isBigPage ? 'ivu-icon-md-contract' : 'ivu-icon-md-expand']" class="ivu-icon" :style="{'visibility' :is_show_to_big ? 'visible' : 'hidden'}" style="cursor:pointer;font-size:24px" ></i>
        <span >{{boxTitle}}</span>
        <span >{{unit}}</span>
    </div>
    <div ref='divContent'  class="wrapper-content" >
        <div ref="slotWrap">
          <slot ></slot>
        </div>
        <ecommonchart :style="{  height: hEarch + 'px' }" :option="option" v-if="is_show_echarts">
        </ecommonchart>
        <div id="container" ref="table"  v-if="is_show_table">
          <i-table   :columns="columns" :data="tableData"  ></i-table>
        </div>
    </div>
</div>`,
});
