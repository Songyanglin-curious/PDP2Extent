Vue.component("timeaxis", {
    template: `
            <div>
                    
                    <div  class="direction-right">
                        <div v-for="(child,childIndex) in timeAxis" :key="childIndex" class="time-line-ac">
                            <div v-if="child.type === 'year'" class="time-line-ac">
                                <div class="item-year">{{child.value}}</div>
                                <div class="time-link-line">
                                    <div class="time-line-point mr20"></div>
                                    <div class="time-line-point mr20"></div>
                                </div>
                            </div>
                            <div v-if="child.type === 'month'" class="time-line-ac">
                                <div class="item-month"><div class="month-conten">{{child.value}}</div></div>
                                <div class="time-link-line">
                                    <div class="time-line-point mr20"></div>
                                    <div class="time-line-point mr20"></div>
                                    <div class="time-line-point mr20"></div>
                                    <div class="time-line-point mr20"></div>
                                </div>
                            </div>
                            <div v-if="child.type === 'proj'" class="time-line-ac">
                                <div class="" :class="[child.value.isFinally ? 'item-proj-finally' : 'item-proj ']" @click="clickProj(child.value)"><div :class="[child.value.showUp ? 'proj-conten-up' : 'proj-conten-down']" >{{child.value.name}}</div></div>
                                <div class="time-link-line">
                                    <div class="time-line-point mr20"></div>
                                    <div class="time-line-point mr20"></div>
                                    <div class="time-line-point mr20"></div>
                                    <div class="time-line-point mr20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
    `
    , props: {
        "datasource": {
            type: Array,
            default: () => []
        },
    },
    data(){
        return {
            timeAxis : [],
        }
    },
    computed: {

    },
    methods: {
        clickProj:function(v){
            this.$emit("click",v)
        }

    },
    created:function(){
       
    },
    mounted: function () {
       
    },
    watch: {
        datasource: function (nv) {
            this.timeAxis = nv;
        }
    }
});