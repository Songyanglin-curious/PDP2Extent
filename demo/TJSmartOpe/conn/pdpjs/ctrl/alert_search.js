/*
 * @Author: songyanglin 1503464667@qq.com
 * @Date: 2022-07-29 16:15:24
 * @LastEditors: songyanglin 1503464667@qq.com
 * @LastEditTime: 2022-08-05 14:25:20
 * @FilePath: \新建地理信息导航\conn\pdpjs\ctrl\mytest.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


Vue.component('alert-search-item-time', {
    props: ["item", "value"],
    data: function () {
        return {};
    },
    computed: {
        start: {
            get: function () {
                if (!this.value) return "";
                var v = this.value.split(",")[0];
                if (!v) return "";
                return new Date(Ysh.Time.parseDate(v));
            },
            set: function (v) {
                this.$emit("input", SearchBlock.Time.combine(v, this.end));
            }
        },
        end: {
            get: function () {
                if (!this.value) return "";
                var v = this.value.split(",")[1];
                if (!v) return "";
                return new Date(Ysh.Time.parseDate(v));
            },
            set: function (v) {
                this.$emit("input", SearchBlock.Time.combine(this.start, v));
            }
        }
    },
    methods: {
        onChange: function () {
            this.$emit("input", this.getValue());
        },
        getValue: function () {
            return Ysh.Time.toString(this.start) + "," + Ysh.Time.toString(this.end);
        }
    },
    created: function () {
    },
    template: `<div style="display:flex">
        <date-picker :type="item.type" :format="item.format" v-model="start"></date-picker>
        <span>-</span>
        <date-picker :type="item.type" :format="item.format" v-model="end"></date-picker>
        </div>`
});
Vue.component('alert-search-item-list', {
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        'item': {
            type: Object,
            "default": function () { return {} }
        },
        "checked": {
            type: Array,
            "default": function () { return [] }
        },
        "multi": {
            type: Boolean,
            "default": false
        }
    },
    data: function () {
        return {
             showAll: false, widths: null, needRows: false, expand: false ,selModel:""
            };
    },
    methods: {
        click(subitem){
            console.log("点击select",subitem);
            //处理多选是时点击是否为全部
            if(this.multi){
                this.$emit("change", subitem);
            }else{
                this.$emit("change", [subitem]);
            }
            
        },
        IsSelectAll(item){
            //判断是否为多选状态
            if(this.multi){
                let isAll = item.includes(SearchBlock.ALL)
           
                if(item.length <=1 && isAll){
                    //多选情况下的全部
                    return 
                }
            }else{
                
            }
        }
    },
    computed: {
        selectOptions:function(){
            return [["_ALL_","全部"]].concat(this.item.options)
        },


    },
    watch: {

    },
    created: function () {
        if(this.multi){
            this.selModel = this.item.checked
        }else{
            this.selModel = this.item.checked[0]
        }
       
    },
    updated: function () {
      
    },
    template: `<div>
                <Select v-model="selModel" @on-change="click" :multiple="multi" style="width:200px">
                    <Option v-for="subitem in selectOptions" :value="subitem[0]" :key="subitem[0]">{{ subitem[1]}}</Option>
                </Select>
        </div>`
});
Vue.component('alert-search-item', {
    props: {
        "item": { type: Object, "default": function () { return {} } },
        "multi": { type: Boolean, "default": false }
    },

    template: `
        <div style="display:flex;justify-content: space-between;align-items: center;margin:0 10px 10px 10px">
            <div class ="stitle" >{{ item.name }}</div>
            <Input v-if="item.type=='text'" :placeholder="item.placeholder" v-model="item.value" style="padding:0 10px;width:210px"></Input>
            <alert-search-item-time v-else-if="item.type=='time'||item.type=='date'" :item="item" v-model="item.value" style="padding:0 10px">
            </alert-search-item-time>
            <alert-search-item-list v-else :item="item" :multi="multi" v-model="item.checked"  ></alert-search-item-list>
        </div>
    `
});
/**
 * `<div class="search-item">
            <div class ="stitle">{{ item.name }}</div>
            <Input v-if="item.type=='text'" :placeholder="item.placeholder" v-model="item.value" style="padding:0 10px"></Input>
            <alert-search-item-time v-else-if="item.type=='time'||item.type=='date'" :item="item" v-model="item.value" style="padding:0 10px">
            </alert-search-item-time>
            <alert-search-item-list v-else :item="item" :multi="multi" v-model="item.checked" class="scontent" ></alert-search-item-list>
        </div>`
 * 
 */
Vue.component('alert-search-row', {
    props: ["item"],
    mounted(){
        console.log('alert-search-row',this.item)
    },
    template:`
    <div>
        <alert-search-item :item="item" :multi="item.multi"></alert-search-item>
    </div>
    `
});
/*
    template: `<div class="f sb search-row">
            <div v-if="item.subs&&item.subs.length" class="f sb" style="width:calc(100% - 60px)">
            //判断是否有子元素                                                                                                                       //接受子组件的调用 = 将接受的传给自己的父组件search-row
                <alert-search-item v-for="sub in item.subs" :key="sub.key" :style="{ width:(100/item.subs.length)+'%' }" :item="sub" :multi="item.multi"></alert-search-item>
            </div>
            <alert-search-item v-else :item="item" :multi="item.multi" style="width:calc(100% - 60px)""></alert-search-item>
            
        </div>`
*/ 
Vue.component('alert-search-block', {
    props: {
        "conditions": {
            type: Array,
            "default": []
        }
    },
    data: function () {
        return { 

        };
    },

    methods: {

    },
    mounted(){
        console.log(this.conditions)
    },
    template: `<div>
           <alert-search-row v-for="item in conditions" :key="item.key" :item= "item"></alert-search-row>
        </div>`
});
// <alert-search-row  :key="item.key" :item="item" v-for="item in conditions" ">{{ item }}</div>