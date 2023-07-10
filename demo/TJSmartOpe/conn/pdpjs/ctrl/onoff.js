Vue.component('onoff', {
    props: {
        "value": {
            type: Boolean,
            "default": false
        },
        "text": {
            type: String,
            "default":""
        },
        "imgs": {
            type: Array,
            "default":["../i/sgc/on.png" , "../i/sgc/off.png"]
        }
    },
    computed: {
        img: function () { return this.value ? this.imgs[0] : this.imgs[1]; }
    },
    methods: {
        click: function() {
            this.$emit("input", !this.value);
            this.$emit("click");
        }
    },
    template: '<div style="display:inline-flex;align-items: center;"><img alt="" :src="img" @click="click">{{text}}</div>'
});

Vue.component("config-item", {
    template: `
    <div class="config-item">
        <div class="config-text">{{ item.name }}</div>
        <div class="config-option">
            <img v-if="item.type=='onoff'" alt="" :src="img" v-on:click="click" />
            <div v-else-if="item.type=='number'"><input-number v-on:on-change="$emit('on-change')" v-model="item.value" size="small" :disabled="item.disabled" style="height:25px;width:60px;text-align:right" :min="item.min" :max="item.max"></input-number>{{item.unit}}</div>
            <div v-else-if="item.type=='percent'">
                <input type="button" value="-" style="width:30px" v-on:click="changePercent(item,false)" />
                <span style="padding:0 10px">{{getPercent(item.value) }}</span>
                <input type="button" value="+" style="width:30px"  v-on:click="changePercent(item,true)" />
            </div>
            <div v-else-if="item.type=='pixel'" style="display:inline-flex;align-items:center">
                <input-number v-on:on-change="$emit('on-change')" v-model="item.value" size="small" :disabled="item.disabled" style="height:25px;width:60px;text-align:right" :min="item.min" :max="item.max"></input-number>{{item.unit}}
                <div style="display:inline-block;background-color:black;width:20px" :style="{height:item.value+'px'}"></div>
            </div>
            <select v-else-if="item.type=='list'" v-model="item.value" :disabled="item.disabled" v-on:change="$emit('on-change')">
                <option v-for="(value, key) in getOptions()" :value="key">{{ value }}</option>
            </select>
            <i-switch v-else-if="item.type=='switch'" v-on:on-change="$emit('on-change')" v-model="item.value" :disabled="item.disabled" :true-value="getOn()" size="large" :false-value="getOff()" style="width:100px">
                <span slot="open">{{getOnName()}}</span>
                <span slot="close">{{getOffName()}}</span>
            </i-switch>
            <button-group v-else-if="item.type=='buttons'" :datalist="getButtonGroups()" v-model="item.value" v-on:click="$emit('on-change')">
            </button-group>
            <checkbox-group v-else-if="item.type=='checkbox'" v-model="item.value" v-on:on-change="$emit('on-change')">
                <Checkbox v-for="(value,key) in getOptions()" :label='key' :key='key' style="padding:0;margin-right:1px;">{{value}}</Checkbox>
            </checkbox-group>
        </div>
    </div>`
    , props: ["item"]
    , computed: {
        img: function () { return this.item.value == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png"; }
    }
    , methods: {
        click: function () {
            if (this.item.disabled) return;
            this.item.value = (this.item.value == "1") ? "0" : "1";
            this.$emit("on-change");
        },
        getOptions: function () {
            var options = {};
            var arr = this.item.options.split(',');
            for (var i = 0; i < arr.length; i += 2)
                options[arr[i]] = arr[i + 1];
            return options;
        },
        getButtonGroups: function () {
            var arr = this.item.options.split(',');
            var ret = [];
            for (var i = 0; i < arr.length; i += 2) {
                ret.push({ key: arr[i], text: arr[i + 1] });
            }
            return ret;
        },
        getOn: function () { return this.item.options.split(',')[2]; },
        getOff: function () { return this.item.options.split(',')[0]; },
        getOnName: function () { return this.item.options.split(',')[3]; },
        getOffName: function () { return this.item.options.split(',')[1]; }
        , changePercent: function (item, isAdd) {
            var v = parseFloat(item.value);
            item.value = (isAdd ? v + 0.1 : v - 0.1);
            this.$emit("on-change");
        }
        , getPercent: function (v) {
            return parseInt(parseFloat(v) * 100, 10) + "%";
        }
    }
});
