
Vue.component('cardVerticalSlide', {
    props: {
        list_data: {
            type: Array,
            default: () => []
        },


    },
    data() {
        return {
            //可视区域高度
            clientHeight: 0,
            //滚动条高度
            scrollHeight: 0,
            //滚动条距离顶部的高度
            scrollTop: 0,
            //储存每个元素的高度，top,bottom
            positions: [],
            //长按定时器
            setIntSustain:0,
            //是否点击的标识符
            timer: 1,
            //单击定时器
            setTimeClick: 0,
            //点击元素的id
            num:'',
            //num 和 cardItem对映表
            numMapItem:{

            }
        }
    },
    computed: {
        //上箭头是否显示
        arrowPrev() {
            if (this.scrollTop < 10) {
                
                return "hidden"
            } else {
                return "visible"
            }
        },
        //下箭头是否显示
        arrowNext() {
            if ((this.scrollTop + this.clientHeight +10) > this.scrollHeight) {
                return "hidden"
            } else {
                return "visible"
            }
        }
    },
    methods: {
        scrollEvent:function() {
            // //当前滚动位置
            this.scrollTop = this.$refs.content.scrollTop;
        },
        //查找index
        searchIndex:function(scrollTop = 0){
            for(item of this.positions){
                if( item.bottom >scrollTop+1){
                    return item.index
                }
            }
        },

        //上一页
        pagePrev:function() {
            var index = this.searchIndex(this.scrollTop)
            if (index > 0) {
               index--;
            } else {
               index = 0;
            }
            this.$refs.content.scrollTop = this.positions[index].top;
        },

        mousedownPrev:function() {
            this.setTimeClick = setTimeout(() => {
                this.time = 0;
                this.setIntSustain = setInterval(() => {
                    this.pagePrev()
                }, 100)
            }, 500)
        },
        mouseupPrev:function() {
            clearTimeout(this.setTimeClick);

            if (this.timer == 1) {
                    this.pagePrev()
            }
            clearInterval(this.setIntSustain);
            this.timer = 1;

        },
        //下一页
        pageNext:function() {
            var index = this.searchIndex(this.scrollTop)
            if (index < this.list_data.length - 1) {
                index++;
            } else {
                index = this.list_data.length - 1
            }
             this.$refs.content.scrollTop = this.positions[index].top;

        },
        mousedownNext:function() {
            this.setTimeClick = setTimeout(() => {
                this.timer = 0;
                this.setIntSustain = setInterval(() => {
                    this.pageNext()
                }, 100)
            }, 500)

        },
        mouseupNext:function() {
            clearTimeout(this.setTimeClick);
            if (this.timer == 1) {
                //单击
                this.pageNext();
            }
            //长按
            //清除长按定时器
            this.timer = 1;
            clearInterval(this.setIntSustain);

        },
        click:function(v) {
            this.num = v.num;
            this.$emit('input', v);
            this.$emit('click',v);
        },
        clickTitle:function(v) {
            this.num = v.num;
            this.$emit('input', v);
            this.$emit('clickTitle',v);
        },
        clickImg:function(v) {
            this.num = v.num;
            this.$emit('input', v);
            this.$emit('clickImg',v);
        },
        heightCard:function(num){
            if((typeof(num) === 'string' || typeof(num) === 'number') && num){
                this.num = num;
                //设置传入id的item展示在当前屏幕内
                var index =  this.numMapItem[num]
                var itemTop = this.positions[index].top;
                var itemBottom = this.positions[index].bottom;
                if(this.scrollTop > itemBottom ){
                    this.$refs.content.scrollTop = itemTop;
                }else if((this.scrollTop + this.clientHeight) < itemTop){
                    this.$refs.content.scrollTop = itemBottom - this.clientHeight;
                }
            }
            
            var clickItem = '';
            for(var i = 0; i< this.list_data.length ;i++){
                if(this.list_data[i].num == num){
                    clickItem = this.list_data[i];
                    break;
                }
            }
            if(clickItem){
                //this.click(clickItem)
                this.$emit('input', clickItem);
            }
        },
        showAlertColor:function(level) {
            var alertLevel = Number(level);
            switch (alertLevel) {
                case 0:
                    return 'Alert2';
                    break;
                case 1:
                    return 'Alert3';
                    break;
                default:
                    return '';
            }
        },
        initHeight:function(){
            this.positions = []
            var nodeList = this.$refs.content.children;
            var top = 0;
            for (var i = 0; i < nodeList.length; i++) {
                var node = nodeList[i].getBoundingClientRect()
                var arr = {};
                arr.index = i;
                arr.top = top ;
                arr.bottom = top+ node.height ;
                top +=node.height;
                arr.height = node.height;
                this.positions.push(arr)
            }
            this.clientHeight = this.$refs.content.clientHeight;
            this.scrollHeight = this.positions.at(-1).bottom;
        },
        intIdMapItem:function(){
            this.list_data.forEach((element,index) => {
                this.numMapItem[element.num] = index;
            });
        }
    },
    watch:{
        scrollTop(v){
                if (v < 10) {
                    clearTimeout(this.setTimeClick);
                    clearInterval(this.setIntSustain);
                }
                if ((v+ this.clientHeight+10) > this.scrollHeight) {
                    clearTimeout(this.setTimeClick);
                    clearInterval(this.setIntSustain);
                }
        }
    },
    mounted(){
        this.intIdMapItem();
            this.initHeight();
    },

    updated() {
           this.initHeight();
    },

    template: `<div  class="card-warp" >
           <div class="card-change-arrow" :style={visibility:arrowPrev}  ref="arrowPrev" @mousedown.prevent = "mousedownPrev" @mouseup.prevent = "mouseupPrev">
                <Icon type="ios-arrow-up" />
           </div>
           <div class="card-content" style="height:100%" ref="content" @scroll="scrollEvent($event)">
                    <div v-for="(item,index) in list_data" :key="index" >
                        <div  class="card-item " :class="num == item.num ?'card-height' : ''">
                            <div class="item-container">
                                <div class="item-title" @click.stop ="clickTitle(item)" >{{item.title}}</div>
                                <img :src="item.img" class="item-img" @click.stop ="clickImg(item)" >
                            </div>
                            <div class="item-msg" :class="showAlertColor(item.alertLevel)">{{item.msg}}</div>
                        </div>
                    </div>
           </div>
           <div class="card-change-arrow" :style={visibility:arrowNext}  @mousedown.prevent = "mousedownNext" @mouseup.prevent = "mouseupNext">
                <Icon type="ios-arrow-down" />
           </div>
        </div>`
});