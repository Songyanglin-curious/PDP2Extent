
Vue.component("statisticcard", {

    props: {
        data: {
            type: Object,
        },

        statistickeys: {
            type: String,
            default: () => { }
        },
        statistictype: {
            type: String,
            default: "count",//count,category
        },
        title: {
            type: String,
            default: ""
        },
        top: {
            type: Number,
            // default: 5,
        },
        defaultsorts: {
            type: Array,
            default: () => []
        },
        position: {
            type: Object,
            default: () => {
                return {
                    // button: "top",
                    table: "bottom",
                    // sort: "top",
                    full: "left",
                }
            }
        },
        hidden: {
            type: Object,
            default: () => {
                return {
                    groupButton: false,
                    table: false,
                    sort: false,
                    chart: false,
                    title: false,
                    unit: false,
                    full: false,
                    header: false,
                }
            }
        },
        chart: {
            type: Object,
            default: () => {
                return {
                    type: "",
                    unit: "个",
                    valueKey: "",
                    namekey: "",
                    chart: "echart"
                    // format: (value) => value,
                    // fun: () => { }优先级最高
                }
            }
        },
        table: {
            type: Object,
            default: () => {
                return {
                    columns: [],//[] || fun
                    // data: fun,// fun,为fun时参数为分组后原始数据，否则为top截取后的数据
                }
            }
        }


    },
    data() {
        return {
            allData: [],
            // groupData: {},
            gorupArray: [],
            tableColumns: [],
            tableData: [],
            isBigPage: false,
            m: null,
            selCategory: "",
            categoryButtons: [],
            isreserve: false,
            chartOption: {

            },
            hEarch: 0,
        };
    },
    computed: {

        fullIsLeft: function () {
            return this.position.full === "left";
        },
        isHiddenSort: function () {
            return this.hidden.sort
        },
        isHiddenHeader: function () {
            return this.hidden.header
        },
        isHiddenFull: function () {
            return this.hidden.full
        },
        isHiddenChart: function () {
            return this.hidden.chart
        },

        isShowButtonGroup: function () {
            // return true
            return this.statistictype === "category" && !this.hidden.groupButton
        },

        tablePosition: function () {
            return this.position.table ? this.position.table : "bottom"
        },
        isEchart: function () {
            return !this.chart.chart === "highchart"
        }
    },
    methods: {
        initData: function () {

            this.gorupArray = this.groupObjectArrayByKeys(this.allData, this.statistickeys)
            this.categoryButtons = this.gorupArray.map(item => [item.text, item.text])
            this.selCategory = "全部"
            this.linkSort()
        },
        groupObjectArrayByKeys: function (arr, keys, parent) {
            if (typeof keys === 'string') {
                keys = [keys];
            }
            if (keys.length === 0) {
                return [];
            }

            const result = [];
            for (let i = 0; i < arr.length; ++i) {
                const item = arr[i];

                const value = item[keys[0]];
                let statisticItem = null;
                for (let j = 0; j < result.length; ++j) {
                    if (result[j].text === value) {
                        statisticItem = result[j];
                        break;
                    }
                }

                if (!statisticItem) {
                    statisticItem = {
                        'text': value,
                        'count': 0,
                        'statistic': [],
                        'data': []
                    };
                    result.push(statisticItem);
                }

                statisticItem.count++;
                statisticItem.data.push(item);
            }
            result.unshift({
                'text': "全部",
                'count': arr.length,
                'statistic': [],
                'data': arr
            })
            const nextKeys = keys.slice(1);
            for (let i = 0; i < result.length; ++i) {
                const statisticItem = result[i];

                statisticItem.statistic = this.groupObjectArrayByKeys(statisticItem.data, nextKeys, true);

                statisticItem.statistic.sort((a, b) => b.count - a.count);
            }
            result.sort((a, b) => b.count - a.count);
            return result;
        },
        // groupObjectArrayByKeys: function (arr, keys, parent) {
        //     // 如果keys是字符串，则转换成数组
        //     if (typeof keys === 'string') {
        //         keys = [keys];
        //     }
        //     // 如果keys为空数组，则返回空数组
        //     if (keys.length === 0) {
        //         return [];
        //     }
        //     // 获取当前维度的统计key
        //     const key = keys[0];
        //     // 使用reduce函数对当前维度进行统计
        //     const result = arr.reduce((acc, obj) => {
        //         const value = obj[key];
        //         // 查找是否存在匹配的统计项
        //         let statisticItem = acc.find(item => item.text === value);
        //         // 如果不存在，则创建一个新的统计项
        //         if (!statisticItem) {
        //             statisticItem = {
        //                 'text': value,
        //                 'count': 0,
        //                 'statistic': [],
        //                 'data': []
        //             };
        //             acc.push(statisticItem);
        //         }
        //         // 维护count值和data数组
        //         statisticItem.count++;
        //         statisticItem.data.push(obj);
        //         // 递归对下一层进行统计

        //         statisticItem.statistic = this.groupObjectArrayByKeys(statisticItem.data, keys.slice(1));
        //         // 对子项的统计结果进行降序排列
        //         statisticItem.statistic.sort((a, b) => b.count - a.count);

        //         // 返回更新后的累计值
        //         return acc;
        //     }, []);
        //     return result;
        // }
        // ,




        getTableOption: function (data) {
            this.tableColumns = typeof this.table.columns === "function" ? this.table.columns(data) : this.table.columns
            this.tableData = typeof this.table.data === "function" ? this.table.data(data) : data
            // this.tableData = data;
        },

        changeCategory: function (item) {
            var data = item ? item.statistic : this.gorupArray;
            var top = this.top ? Number(this.top) : -1;
            var sortTopdata = []
            if (this.isreserve) {
                for (var i = data.length - 1; i > 0; i--) {
                    var item = data[i];
                    if ((top === -1 || sortTopdata.length < top) && item.text && item.text !== "全部") {
                        sortTopdata.push(item)
                    }
                    // if (this.statistictype === "category" && (top === -1 || sortTopdata.length < top)) {
                    //     sortTopdata.push(item)
                    // }
                }
            } else {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if ((top === -1 || sortTopdata.length < top) && item.text && item.text !== "全部") {
                        sortTopdata.push(item)
                    }
                    // if (this.statistictype === "category" && (top === -1 || sortTopdata.length < top)) {
                    //     sortTopdata.push(item)
                    // }
                }
                // sortTopdata = data.slice(1, top + 1)
            }


            this.getTableOption(sortTopdata);

            // var chartData = this.isreserve ? item.data.slice : this.groupTopData
            if (this.chart.fun) {
                this.chartOption = this.chart.fun(sortTopdata)

            } else {
                switch (this.chart.type) {
                    case "pie3d":
                        this.chartOption = topCardOption.get3DPie(sortTopdata, this.chart)
                        break;
                }
            }
            window.setTimeout(() => {
                this.resize()
            }, 100)
            // this.resize();
        },
        clickCategory: function () {
            // this.selCategory
            this.linkSort()
        },
        reserveChange: function () {
            this.linkSort()
        },
        linkSort: function () {
            if (this.statistictype === "count") {
                this.changeCategory()
            } else if (this.statistictype === "category") {
                // this.changeCategory(this.gorupArray[0])
                var find = this.gorupArray.find(item => item.text == this.selCategory)
                this.changeCategory(find)
                // this.changeButton(this.gorupArray[0])
            }
        },
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
    },
    created() {
        Ysh.Vue.addHandle(this, "resize", function () {
            var hAll = this.$el.clientHeight;
            var hSlotWrap = this.$refs.slotWrap ? this.$refs.slotWrap.offsetHeight : 0;
            var hTitle = this.$refs.title ? this.$refs.title.offsetHeight : 0;
            var htable = this.$refs.table ? this.$refs.table.offsetHeight : 0;
            this.hEarch = hAll - hSlotWrap - hTitle - htable - 20;
        }, true);
        // this.initData()

    },
    mounted() {
    },
    watch: {
        data: {
            deep: true,   // 开启深度监听
            immediate: true,
            handler: function (newVal, oldVal) {
                // if (newVal.length === 0) return

                this.allData = newVal;
                // console.log("更新top导出参数", newVal)
                this.initData()
            }
        },
    },
    /**
     * 
     *              
     */
    template: `<div class='card-mian-wrap' ref="wrap">
                <div v-if="!isHiddenHeader" class='card-title-wrap' :class="[fullIsLeft ? 'card-full-left' : 'card-full-right']" ref="title">
                    <div class="card-full-wrap">
                        <i @click="clickToBig" :class="[isBigPage ? 'ivu-icon-md-contract' : 'ivu-icon-md-expand']" class="ivu-icon card-full" :style="{'visibility' :isHiddenFull ? 'hidden' : 'visible'}"  ></i>
                    </div>
                
                    <div class="card-title-text"  >
                    {{title}}
                    </div>
                    <div class="card-title-unit">
                        <span v-if="chart.unit">单位:{{chart.unit}}</span>
                    </div>
                </div>
               <div ref='divContent'  class="card-content-wrap" >
                    <div class="card-sort-wrap" ref="slotWrap">
                        <div v-if="isShowButtonGroup" style="padding-top:10px">
                            <yshtab  tabstyle="nbTab aequilateTabs"  @click="clickCategory" v-model="selCategory" :tabs="categoryButtons"></yshtab>
                        </div>
                        <div class="card-top-sort-wrap" style="padding:10px">
                            <div>
                            <RadioGroup v-model="isreserve" v-if="!isHiddenSort" @on-change="reserveChange">
                                <Radio :label="false">
                                    <span>正序</span>
                                </Radio>
                                <Radio :label="true">
                                    <span>倒序</span>
                                </Radio>
                            </RadioGroup>
                            </div>
                            <span class="card-show-detail"></span>
                        </div>
                    </div>
                    <div class="card-content-main-wrap">
                            <div ref="chartRowRef" class="card-chart-row" :style="{  height: hEarch + 'px' }">
                                <div class="card-card-content-main-left" v-if="tablePosition === 'left'">
                                <Table   :columns="tableColumns" :data="tableData" border  stripe size="large"></Table>
                                </div>
                                <div class="card-card-content-main-middle" >
                                    <ecommonchart v-if="isEchart"  :option="chartOption"  style="width:100%;height:100%">
                                    </ecommonchart>
                                    <highchart v-else  :option="chartOption"  style="width:100%;height:100%">
                                </highchart>
                                </div>
                                <div class="card-card-content-main-right"  v-if="tablePosition === 'right'">
                                    
                                </div>
                            </div>
                            <div ref="table">
                            <Table v-if="tablePosition === 'bottom'"  :columns="tableColumns" :data="tableData" border  stripe size="large"></Table>
                            </div>
                            
                    </div>  
                </div>
  </div>`,
});

//
var topCardOption = {
    colors: ['#e1727a', '#6ed7ac', '#ffb66f', '#5ac8dc', '#fff390', '#4b93dd', '#c792d9'],
    get3DPie: function (toChartData, args) {
        var datalist = [];
        var vk = args.valuekey;
        var nk = args.namekey;
        for (var i = 0; i < toChartData.length; i++) {
            var item = toChartData[i];
            datalist.push({ name: item[nk], y: item[vk] })
        }
        var option = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                backgroundColor: null
            },
            colors: topCardOption.colors,
            legend: {
                enabled: true, // 显示图例，这是默认的设置，一般情况下不需要特意设置
                layout: 'vertical',
                align: 'right', // 固定在右边
                verticalAlign: 'middle', // 垂直居中
                itemMarginBottom: 10,
                // 其他配置
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
            title: {
                text: null
            },
            tooltip: {
                headerFormat: "<span >{point.key}</span><br/>",
                pointFormat: '{series.name}: <b>{point.y}个({point.percentage:.1f}%)</b>',
                style: {
                    fontSize: '16px',
                    color: "#000"
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',

                        style: {
                            color: "#fff",
                            textOutline: 'none',
                            fontSize: '16px',
                        }

                    }
                },
                backgroundColor: null
            },
            series: [{

                // type: 'pie',
                name: args.name,
                data: datalist,
                showInLegend: true
            }]
        };
        return option

    },

}