
Vue.component("statisticcard", {

    props: {
        data: {
            type: Object,
        },
        option: {
            type: Object,
            default: () => {
                return {
                    statistickeys: [],
                    statistictype: "count",//category 配合上边的分类按钮组使用，带有全部按钮,count，统计数字不带按钮
                    title: "",
                    top: -1,
                    unit: '',
                    defaultsorts: [],
                    position: {},
                    hidden: {},//header,sort,full,chart,table,category，more
                    chart: {},
                    table: {},
                }
            }
        },
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
            chartOption: {},
            hEarch: 0,
            lastTime: 0,
            dbTime: 300,
        };
    },
    computed: {

        fullIsLeft: function () {
            return this.option.position ? this.option.position.full === "left" : false;
        },
        isHiddenSort: function () {
            return this.option.hidden.sort
        },
        isHiddenHeader: function () {
            return this.option.hidden.header
        },
        isHiddenFull: function () {
            return this.option.hidden.full
        },
        isHiddenChart: function () {
            return this.option.hidden.chart
        },
        isHiddenTable: function () {
            return this.option.hidden.table
        },
        isHiddenCategory: function () {
            return this.option.hidden.category
        },
        isShowCategory: function () {
            // return true
            return this.statistictype === "category" && !this.isHiddenCategory
        },
        isShowMore: function () {
            return this.option.hidden.more ? false : true
        },
        statistickeys: function () {
            return this.option.statistickeys ? this.option.statistickeys : []
        },
        statistictype: function () {
            return this.option.statistictype ? this.option.statistictype : "count"
        },
        top: function () {
            return this.option.top ? Number(this.option.top) : -1
        },
        title: function () {
            return this.option.title ? this.option.title : ""
        },
        unit: function () {
            return this.option.unit ? this.option.unit : ""
        },
        tablePosition: function () {
            if (this.isHiddenTable) return
            return this.option?.position?.table ? this.option.position.table : "bottom"
        },


        optionTableColumns: function () {
            if (this.isHiddenTable) return
            return this.option.table.columns ? this.option.table.columns : (data) => data
        },
        optionTableData: function () {
            if (this.isHiddenTable) return
            return this.option.table.data ? this.option.table.data : (data) => data
        },

        isEchart: function () {
            return this.option.chart.chart === "echart"
        },
        chartFun: function () {
            return this.option.chart.fun ? this.option.chart.fun : false
        },
        chartType: function () {
            return this.option.chart.type ? this.option.chart.type : "line"
        },
        chartArgs: function () {
            return this.option.chart.args ? this.option.chart.args : {}
        },

    },
    methods: {
        initData: function () {

            var gorupArray = this.groupObjectArrayByKeys(this.allData, this.statistickeys)
            this.gorupArray = gorupArray.filter(item => !!item.text)
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


        getTableOption: function (data) {
            this.tableColumns = typeof this.optionTableColumns === "function" ? this.optionTableColumns(data) : this.optionTableColumns
            this.tableData = typeof this.optionTableData === "function" ? this.optionTableData(data) : data
        },

        changeCategory: function (item) {
            var data = item ? item.statistic : this.gorupArray;
            var top = this.top
            var sortTopdata = []
            if (this.isreserve) {//倒序
                for (var i = data.length - 1; i > 0; i--) {
                    var item = data[i];
                    if ((top === -1 || sortTopdata.length < top) && item.text && item.text !== "全部") {
                        sortTopdata.push(item)
                    }
                }
            } else {//正序
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if ((top === -1 || sortTopdata.length < top) && item.text && item.text !== "全部") {
                        sortTopdata.push(item)
                    }

                }
            }


            this.getTableOption(sortTopdata);
            if (this.chartFun) {
                this.chartOption = this.chartFun(sortTopdata)

            } else {
                switch (this.chartType) {
                    case "pie3d":
                        this.chartOption = topCardOption.get3DPie(sortTopdata, this.chartArgs)
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
                var find = this.gorupArray.find(item => item.text == this.selCategory)
                this.changeCategory(find)
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
        showMore: function () {
            this.$emit("showMore")
        },
        handleRowDBClick: function (row, column, data, event) {

            var currentTime = new Date().getTime();
            var span = currentTime - this.lastTime;
            this.lastTime = currentTime;
            console.log(span)
            if (span < this.dbTime) {
                this.$emit("celldbclick", row, column, this.selCategory)
            }

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
        // this.initData()

    },
    mounted() {
    },
    watch: {
        data: {
            deep: true,   // 开启深度监听
            immediate: true,
            handler: function (newVal, oldVal) {
                this.allData = newVal;
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
                        <span v-if="unit">单位:{{unit}}</span>
                    </div>
                </div>
               <div ref='divContent'  class="card-content-wrap" >
                    <div class="card-sort-wrap" ref="slotWrap">
                        <div v-if="isShowCategory" style="padding-top:10px">
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
                            <span v-if="isShowMore" class="card-show-detail" @click="showMore">查看更多</span>
                        </div>
                    </div>
                    <div class="card-content-main-wrap">
                            <div ref="chartRowRef" class="card-chart-row" :style="{  height: hEarch + 'px' }">
                                <div class="card-card-content-main-left" v-if="tablePosition === 'left'">
                                <Table   :columns="tableColumns" :data="tableData" border  stripe size="large" @on-cell-click="handleRowDBClick"></Table>
                                </div>
                                <div class="card-card-content-main-middle" >
                                <ecommonchart v-if="isEchart"  :option="chartOption"  style="width:100%;height:100%">
                                </ecommonchart>
                 
                                    <highchart v-else  :option="chartOption"  style="width:100%;height:100%">
                                    </highchart>
                                </div>
                                <div class="card-card-content-main-right"  v-if="tablePosition === 'right'">
                                <Table   :columns="tableColumns" :data="tableData" border  stripe size="large" @on-cell-click="handleRowDBClick"></Table>
                                </div>
                            </div>
                            <div ref="table">
                            <Table v-if="tablePosition === 'bottom'"  :columns="tableColumns" :data="tableData" border  stripe size="large" @on-cell-click="handleRowDBClick"></Table>
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