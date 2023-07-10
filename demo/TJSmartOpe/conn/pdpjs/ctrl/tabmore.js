

Vue.component('tabmore', {
    props: {
        "datasource": {
            type: Array,
            default: () => {}
        },
    },
    data() {
        return {
            // 当前循环的数据
            currentData: [],
            // 各个元素的长度
            widthArr: [],
            // widthWrap 容器的宽度
            widthWrap: 0,
            //更多按钮
            moreButton: false,
            //更多按钮的尺寸
            moreButtonWidth: 0,
            //
            widthAll: 0,
            //
            index: 0,
            //选中的数据
            selData: '全部',

            showMoreButton: false,
        }
    },
    /**
     * 核心为，判断元素宽度，将元素个数修剪到合适的个数显示，并且根据条件显示隐藏更多
     * 
     * 
     */
    methods: {
        click(v) {
            this.selData = v
            this.$emit('input', v);
            this.$emit('click');
        },
        //
        initWidth() {
            this.widthArr = []
            this.widthWrap = this.$el.offsetWidth
            var moreButton = this.$el.children[this.$el.children.length - 1];
            this.moreButtonWidth = moreButton.offsetWidth
            var childrens = this.$el.children;
            this.widthAll = 0;
            var toLeft = 0
            for (var i = 0; i < childrens.length - 1; i++) {
                var widthObj = {}
                widthObj.index = i;
                widthObj.width = childrens[i].offsetWidth
                toLeft += childrens[i].offsetWidth;
                widthObj.rightToLeft = toLeft;
                this.widthArr.push(widthObj)
                this.widthAll += childrens[i].offsetWidth
            }
        },
        trimData() {
            for (var i = this.widthArr.length - 1; i >= 0; i--) {
                if (this.widthArr[i].rightToLeft + this.moreButtonWidth < this.widthWrap) {
                    this.index = i;
                    break;
                }
            }
            this.currentData = this.datasource.slice(0, this.index)
        },
        showTab: function (v, o) {
            //获取容器宽度，tab总宽度，记录每个tab宽度到widthArr
            this.initWidth()
            //过长
            if (this.widthAll > this.widthWrap) {
                //tab长度过长，需要修剪显示数据
                this.showMoreButton = true
                this.trimData()
            } else {
                this.showMoreButton = false
            }

            //过短

        }
    },

    watch: {

        datasource: {
            handler: function (v, o) {
       
                this.currentData = this.datasource;
                this.$nextTick(function () {
                    this.showTab();
                })
            },
            deep:true,
        }

    },
    mounted: function () {
        this.showTab();
        //默认选中第一个
        if (this.selData === "") {
            var v = this.datasource.length > 0 ? this.datasource[0][0] : "";

            this.selData = v
            //this.$emit('input', v);
            this.click(v);
        }
    },
    template: `
    <div class="tabmore-wrap" ref="wrap" style="width:100%">
        <div v-for="(item, index) in currentData" :key="item[0]"  class="table-item-wrap">
            <div   @click="click(item[0])" :value="item[0]"  class="tabmore-item" :class="[item[0] === selData ? 'activeClass' : '']">{{item[1]}}</div>
            </div>
        <div class="table-item-wrap">
            <Poptip >
                <div class="btnMore tabmore-item" v-if="showMoreButton">更多</div>
                <div  slot="content">
                    <Select v-model="selData" @on-change="click" style="width:200px">
                        <Option v-for="item in datasource" :value="item[0]" :key="item[0]">{{ item[1] }}</Option>
                    </Select>
                </div>
             </Poptip>
        </div>
    </div>
    `,
})