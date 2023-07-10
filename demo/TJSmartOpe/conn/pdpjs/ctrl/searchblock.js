/*v=1.22.613.1*/

var SearchBlock = {
    ALL: "_ALL_",
    Time: {
        toString: function (v, isFormat) {
            if (!v) return "";
            return Ysh.Time.toString(isFormat ? new Date(Ysh.Time.getTime(v)) : v);
        },
        combine: function (start, end, isFormat) {
            if ((!start) && (!end))
                return "";
            return this.toString(start, isFormat) + "," + this.toString(end, isFormat);
        }
    },
    find: function (conditions, id) {
        if (!conditions) return null;
        for (var i = 0; i < conditions.length; i++) {
            var c = conditions[i];
            if (c.id == id)
                return c;
            if (c.subs) {
                var f = this.find(c.subs, id);
                if (f)
                    return f;
            }
            if (c.types) {
                for (var k in c.types) {
                    var f = this.find(c.types[k], id);
                    if (f)
                        return f;
                }
            }
        }
        return null;
    },
    init: function (lst) {
        if (!lst) return [];
        for (var i = 0; i < lst.length; i++) {
            var item = lst[i];
            //对 multi进行bool转换
            item.multi = !!(item.multi && (item.multi != "0"));
            //检查是否有最初的赋值，有的话用,分割并且添加给该节点
            if (item.checked) {
                item.checked = item.checked.split(",");
            }
            //根据类型进行添加key ，时间格式进行处理，处理成，连接的字符串
            switch (item.type) {
                case "group":
                    item.key = item.id + i;
                    break;
                case "date":
                case "time":
                    item.value = this.Time.combine(item.start, item.end, true);
                    break;
                default:
                    item.key = item.id;
                    if (!item.checked)
                        item.checked = [SearchBlock.ALL];
                    break;
            }
            //判断是否有子节点，有的话递归处理
            if (item.subs)
                item.subs = this.init(item.subs);
            //判断是否有types类型，有的话递归处理
            if (item.types) {
                for (var key in item.types) {
                    item.types[key] = this.init(item.types[key]);
                }
            }
        }
        return lst;
    }
}
Vue.component('search-text', {
    props: {
        "text": { type: String, "default": "" },
        "keyword": { type: String, "default": "" },
        "color": { type: String, "default": "red" }
    },
    computed: {
        list: function () {
            var text = this.text;
            var key = Ysh.String.trim(this.keyword);
            if ((key == "") || (text == "")) return [{ text: text, isKey: false }];
            var keys = key.split(' ');
            keys.sort(function (k1, k2) { return k2.length - k1.length; })
            var ret = [];
            var idx = 0;
            while (true) {
                var key = "";
                var idx1 = -1;
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    var n = text.indexOf(k, idx);
                    if (n < 0)
                        continue;
                    if (n == idx) {
                        idx1 = n;
                        key = k;
                        break;
                    }
                    if (idx1 < 0) {
                        idx1 = n;
                        key = k;
                        continue;
                    }
                    if (n < idx1) {
                        idx1 = n;
                        key = k;
                        continue;
                    }
                }
                //var idx1 = text.indexOf(key, idx);
                if (idx1 < 0) {
                    ret.push({ text: text.substr(idx), isKey: false });
                    break;
                }
                if (idx1 > idx)
                    ret.push({ text: text.substr(idx, idx1 - idx), isKey: false });
                ret.push({ text: key, isKey: true })
                idx = idx1 + key.length;
            }
            return ret;
        }
    },
    template: `<span><template v-if="list.length<2">{{text}}</template>
        <template v-else><span v-for="item in list" :style="{ color:(item.isKey?color:'') }">{{item.text}}</span></template></span>`
});
Vue.component('search-item-list', {
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
        return { showAll: false, widths: null, needRows: false, expand: false };
    },
    methods: {
        isSelected: function (key) {
            return this.checked.indexOf(key) >= 0;
        },
        getOptionClass: function (option) {
            return {
                "selected": this.isSelected(option ? option[0] : SearchBlock.ALL)
            };
        },
        setValue: function (v) {
            this.$emit("change", v.length == 0 ? [SearchBlock.ALL] : v);
        },
        click: function (option) {
            this.$emit("change", this.resetSelected(option));
        },
        resize: function () {
            var wAll = $(this.$el).width();
            var m = $(this.$refs.main);
            var wMain = m.width();
            this.needRows = !(wMain < wAll - 101);
            //if (wMain > 0)
            //    console.log([this.item.name, wMain, wAll, this.needRows]);
        },
        resetSelected: function (option) {
            //选择的有数据，就赋值选中的，否则赋值SearchBlock.ALL
            var key = option ? option[0] : SearchBlock.ALL;
            var optAll = SearchBlock.ALL;
            if (key == optAll)
                return [key];//选择全部，返回_ALL_
            //不为空，将选中的数据赋给lst
            var lst = this.checked;
            //再次判断，选中的数组中是否有全部
            if (lst.indexOf(optAll) < 0) {
                //不是多选
                if (!this.multi) {
                    //判断选中的数组是否有点击传进来的值，有则返回，否则返回全部
                    return lst.indexOf(key) < 0 ? [key] : [optAll];
                }
                //多选
                if (lst.indexOf(key) < 0) {
                    return lst.concat([key]);
                }
                lst = lst.filter(function (item) {
                    return item != key
                });
                return lst.length > 0 ? lst : [optAll];
            } else
                return [key];
        },
        resetSelected2: function (curSelected) {/*选择其他选项时，取消‘全部’选项；选择‘全部’选项时，取消其他选项*/
            var optAll = SearchBlock.ALL;
            if (curSelected.length > 1) {
                if (curSelected[0] == optAll) {
                    return curSelected.filter(function (item) {
                        return item != optAll
                    });
                }
                if (curSelected[curSelected.length - 1] == optAll)
                    return [optAll];
            }
            return null;
        },
        onSelectChanged: function () {
        },
        changeMore: function () {
            //this.$emit('change', this.checked);
        },
        changeExpand: function () {
            this.expand = !this.expand;
            this.$emit('sizechanged');
        }
    },
    computed: {
        options: function () {
            return this.item.options || [];
        },
        max: function () { return Number(this.item.max || 0); },
        //multi: function () { return !!this.item.multi; },
        list: function () {
            //var lst = [[SearchBlock.ALL, "全部"]].concat(this.options);
            var lst = this.options;
            //限制最多数量，在xml的配置上有所体现
            if (this.max == 0)
                return lst;
            return lst.slice(0, this.max);
        },
        hasMore: function () {
            if (this.max == 0) return false;
            return this.max < this.options.length;
        },
        isMoreSelected: function () {
            for (var i = 0; i < this.checked.length; i++) {
                var key = this.checked[i];
                if (key === SearchBlock.ALL)//全选
                    return false;
                var bIsMore = true;
                for (var j = 0; j < this.list.length; j++) {
                    var item = this.list[j];
                    if (item[0] == key) {
                        bIsMore = false;
                        break;
                    }
                }
                if (bIsMore) return true;
            }
            return false;
        },
        moreSelected: {
            get: function () {
                if (this.multi)
                    return this.checked;
                return this.checked[0];
            },
            set: function (v) {
                //this.checked = this.multi ? v : [v];
                if (v)
                    this.setValue(this.multi ? v : [v]);
            }
        },
        rowsImg: function () {
            return this.expand ? "/i/uparrow.png" : "/i/downarrow.png";
        }
    },
    watch: {
        multi: function () {
            if (this.multi) return;
            if (this.checked.length > 1)
                this.$emit('change', [this.checked[0]]);
        },
        options: function () {
            this.$nextTick(function () { this.resize(); });
        }
    },
    created: function () {

    },
    updated: function () {
        this.$emit("sizechanged");
    },
    /**
     * img 多余的会折叠，用于展开和收缩的切换
     * div 上的title属性是光标放在上面会显示文字
     */
    template: `<div>
                <span @click="click(null)" class="buttonall" :class="getOptionClass(null)" style="position:relative;margin-left:10px;">
                全部
                </span>
                <img :src="rowsImg" @click.stop="changeExpand" style="cursor:pointer;position:relative;width:10px;height:10px;margin:0 5px;top:10px;" :style="{ 'visibility': needRows?'visible':'hidden'}" />
                <div ref="main" class="smain" :style="{ 'flex-wrap':(expand?'wrap':'') }">
                    <div v-for="option in list" :key="option[0]" class="buttonbox">
                        <div @click="click(option)" class="button" :class="getOptionClass(option)" :title="option[1]">{{option[1]}}</div>
                    </div>
                    <div class="buttonbox">
                        <span v-if="hasMore" class="button" :class ="{selected:isMoreSelected}">
                            <Poptip>更多
                                <Select slot="content" v-model="moreSelected" filterable :multiple="multi" :max-tag-count="10" @on-change="changeMore">
                                    <Option v-for="item in options" :value="item[1]" :key="item[0]">{{ item[1] }}</Option>
                                </Select>
                            </Poptip>
                        </span>
                    </div>
                 </div>
        </div>`
});
Vue.component('search-item-time', {
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
    template: `<div>
        <date-picker :type="item.type" :format="item.format" v-model="start"></date-picker>
        -
        <date-picker :type="item.type" :format="item.format" v-model="end"></date-picker>
        </div>`
});

Vue.component('search-item', {
    props: {
        "item": { type: Object, "default": function () { return {} } },
        "multi": { type: Boolean, "default": false }
    },
    template: `<div class="search-item">
            <div class ="stitle">{{ item.name }}</div>
            <Input v-if="item.type=='text'" :placeholder="item.placeholder" v-model="item.value" style="padding:0 10px"></Input>
            <search-item-time v-else-if="item.type=='time'||item.type=='date'" :item="item" v-model="item.value" style="padding:0 10px">
            </search-item-time>
            <search-item-list v-else :item="item" :multi="multi" v-model="item.checked" class="scontent" @sizechanged="$emit('sizechanged')"></search-item-list>
        </div>`
});

Vue.component('search-row', {
    props: ["item"],
    template: `<div class="f sb search-row">
            <div v-if="item.subs&&item.subs.length" class="f sb" style="width:calc(100% - 60px)">
                                                                                                                                
                <search-item v-for="sub in item.subs" :key="sub.key" :style="{ width:(100/item.subs.length)+'%' }" :item="sub" :multi="item.multi" @sizechanged="$emit('sizechanged')"></search-item>
            </div>
            <search-item v-else :item="item" :multi="item.multi" style="width:calc(100% - 60px)" @sizechanged="$emit('sizechanged')"></search-item>
            <Checkbox v-if="!item.dismulti" v-model="item.multi" style="margin-right1:18px;color:#79e7ff;"> 多选 </Checkbox>
        </div>`
});
Vue.component('search-block', {
    props: {
        "conditions": {
            type: Array,
            "default": []
        }
    },
    data: function () {
        return { state: {} };
    },
    computed: {
        typeCondition: function () {
            return this.conditions.find(function (item) {
                return !!item.types
            });
        },
        typeConditions: function () {
            //找到空值即没有types，即并且将空值转为[]避免报错
            var t = this.typeCondition;
            if (!t)
                return [];
            var selected = t.checked;
            var lst = [];
            //对types的处理
            for (var key in t.types) {
                if (selected.indexOf(key) >= 0) {//全部时不选子条件
                    var option = t.options.find(function (item) {
                        return item[0] == key
                    });
                    lst.push({ name: option[1], list: t.types[key] });
                }
            }
            return lst;
        }
    },
    methods: {
        changeState: function (t) {
            this.state[t.name] = !this.state[t.name];
            this.$forceUpdate();
            this.$nextTick(function () {
                this.$emit("sizechanged");
            })
        },
        isFold: function (t) {
            return this.state[t.name];
        }
    },
    template: `<div>
            <search-row v-if="!item.hide" :key="item.key" :item="item" v-for="item in conditions" @sizechanged="$emit('sizechanged')"></search-row>
            <template v-if="typeConditions.length > 0">
                <div class="type-group-wrapper">
                    <template v-for="t in typeConditions">
                        <div class="type-group">
                            <span class="type-title" style="cursor:pointer" @click="changeState(t)"><img src="/i/arrDown.png" style="width: 10px;height:12px;" />{{t.name}}{{isFold(t)?'>>':'<<'}}</span>
                            <search-block v-if="!isFold(t)" :conditions="t.list"></search-block>
                        </div>
                    </template>
                </div>
            </template>
        </div>`
});
Vue.component('search-useful', {
    props: {
        "conditions": {
            type: Array,
            "default": []
        },
        "title": {
            type: String,
            "default": "查询>"
        }
    },
    data: function () {
        return { results: {} };
    },
    computed: {
        list: function () {
            var conditions = this.conditions;
            var results = {};
            var lst = this.getSelectedItems(conditions, results);
            this.results = results;
            return lst;
        }
    },
    methods: {
        getSelectedItems: function (conditions, results) {
            var lst = [];
            for (var i = 0; i < conditions.length; i++) {
                var c = conditions[i];
                this.getSelectedItem(lst, c, results);
            }
            return lst;
        },
        getTimeText: function (v, c) {
            if (!c.format)
                return v;
            return Ysh.Time.formatString(v, c.format.replace("yyyy", "[y]").replace("MM", "[m]").replace("dd", "[d]").replace("HH", "[hh]").replace("mm", "[mm]").replace("ss", "[ss]"));
        },
        getConditionText: function (c) {
            if (c.type == "text") return c.value;
            if ((c.type == "date") | (c.type == "time")) {
                var arr = c.value.split(',');
                if (!arr[0])
                    return this.getTimeText(arr[1], c) + "之前";
                if (!arr[1])
                    return this.getTimeText(arr[0], c) + "之后";
                return this.getTimeText(arr[0], c) + "-" + this.getTimeText(arr[1], c);
            }
            return "";
        },
        appendResult: function (lst, c, results) {
            if ((c.type == "text") || (c.type == "date") || (c.type == "time")) {
                if (!c.value)
                    return true;
                lst.push({ c: c, value: this.getConditionText(c) });
                results[c.id] = c.value;
                return true;
            }
            return false;
        },
        getSelectedItem: function (lst, c, results) {
            if (c.subs) {
                for (var i = 0; i < c.subs.length; i++)
                    this.getSelectedItem(lst, c.subs[i], results);
                return;
            }
            if (this.appendResult(lst, c, results))
                return;
            if (c.checked[0] == SearchBlock.ALL)
                return;
            results[c.id] = c.checked.join();
            var items = [];
            var options = c.options;
            for (var i = 0; i < c.checked.length; i++) {
                var key = c.checked[i];
                var option = options.find(function (o) {
                    return o[0] == key;
                });
                var o = { option: option }
                if (c.types && c.types[key]) {
                    o.details = this.getSelectedItems(c.types[key], results);
                }
                items.push(o);
            }
            if (!c.hide)
                lst.push({ c: c, selected: items });
        },
        remove: function (item, option) {
            if (item.value == option) {
                item.c.value = "";
                return;
            }
            var key = option[0];
            item.c.checked = item.c.checked.filter(function (v) {
                return v != key
            });
            if (item.c.checked.length == 0)
                item.c.checked = [SearchBlock.ALL];
        }
    },
    template: `<div v-if="list.length" class="search-useful" style="display:inline-flex;flex-wrap:wrap;align-items:center">
            {{title}}<template v-for="(item,index) in list">
                <div v-if="false&&index>0" style="display:inline-flex;margin:0 10px;">
                    /
                </div>
                <div style="border:1px solid gray;height:30px;display:flex;align-items:center;padding:0 5px;margin-left:5px;">
                {{item.c.name}}：
                <template v-if="item.value">
                <span style="color:#e4393c">{{item.value}}</span>
                <div @click="remove(item,item.value)" class="close"></div>
                </template>
                <template v-else v-for="option in item.selected">
                    <span style="color:#e4393c">{{option.option[1]}}</span>
                    <!--img @click="remove(item,option.option)" src="/i/sgc/shengchan/close.png" style="cursor:pointer;align-self:center;margin1: 0 10px 0 3px;" /-->
                                <div @click="remove(item,option.option)" class="close"></div>
                    <template v-if="option.details&&option.details.length">
                        <!--(-->
                        <template v-for="(detail,dindex) in option.details">
                            <template v-if="false&&dindex>0">
                                /
                            </template>
                            <div style="border:1px solid gray;height:26px;display:flex;align-items:center;padding:0 5px;margin-left:3px;">
                            {{detail.c.name}}：
                            <template v-for="doption in detail.selected">
                                <span style="color:#e4393c">{{doption.option[1]}}</span>
                                <div @click="remove(detail,doption.option)" class="close"></div>
                            </template>
                            </div>
                        </template>
                        <!--)-->
                    </template>
                </template>
                </div>
            </template>
        </div>`,
    watch: {
        results: {
            deep: true,
            handler: function () {
                this.$emit("change", this.results);
            }
        }
    }
});




