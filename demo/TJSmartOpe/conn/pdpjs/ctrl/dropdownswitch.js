Vue.component("dropdownswitch", {
    template: `
            <div class="icon-tab" style="position:relative" @mouseenter="enters()" @mouseleave="leaver()" >
                <img :src="iconurl" ref="dropdownImg" style="cursor: pointer;">
                <div ref="dropdownWrap"  class="dropdown-wrap" :class="[isShow ? 'dropdownShow' : 'dropdownHidden']">
                    <div ref="dropdownTop"></div>
                    <div class="dropdown-content">
                        <div v-if="title" class="dropdown-title">
                            <span>{{title}}</span>
                            <Icon type="ios-close" @click="closeDropdown()" style="font-size:25px"/>
                        </div>
                        <template v-if="type === 'switch'">
                            <div v-for="(item, index) in menu" :key="item.text"  class="dropdown-item">
                                <span>{{item.text}}</span>
                                <i-switch v-model="item.value" @on-change="change(item)" size="small"/>
                            </div>
                        </template>
                        <template v-if="type === 'text'">
                            <div v-for="(item, index) in menu" :key="item.text"  class="dropdown-item" @click="change(item)">
                                <span>{{item.text}}</span>
                            </div>
                        </template>

                    </div>
                </div>
            </div>
    `
    , props: {
        "iconurl":{
            type: String,
            default: "",
        },
        "size": {
            type: Object,
            default: () => { }
        },
        "type":{
            type: String,
            default: "switch",
        },
        "title":{
            type: String,
            default: "",
        },
        "menu": {
            type: Array,
            default: () => []
        },
    },
    data(){
        return {
            //是否显下面的列表，
            isShow:false,
        }
    },
    computed: {

    },
    methods: {

        change(item){
            this.$emit('on-change',item,this.menu)
        },
        closeDropdown(){
            this.leaver();
        },
        enters(){
            this.isShow = true;
        },
        leaver(){
            this.isShow = false;
        }

    },
    created:function(){
    },
    mounted: function () {
        this.$refs.dropdownImg.style.width = this.size.iconWidth + 'px';
        this.$refs.dropdownImg.style.height = this.size.iconHeight + 'px';
        this.$refs.dropdownWrap.style.top = this.size.iconHeight + 'px';
        this.$refs.dropdownTop.style.height = this.size.dropdownTop + 'px';
    },
});