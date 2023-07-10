/*v=1.20.525.1*/
Vue.component('search-want', {
    props: { list: null }, template: `<div v-show="notEmpty">您是不是想搜<a v-for="item in list" href="#" v-on:click="doAsk(item)" style="padding-left:8px;padding-right:8px;padding-top:5px;color:#0396C5">{{ item }}</a></div>`,
    computed: {
        notEmpty: function () { if (null == this.list) return false; return this.list.length > 0; }
    },
    methods: {
        doAsk: function (text) { AskInst.askText(text); }
    }
});


Vue.component('search-result', {
    props: { result: null },
    template: `
        <div v-if="isSimple">
            {{resultMsg}}
            <search-want :list="result.wants"></search-want>
        </div>
        <dynfile v-else-if="isFile" :file="result.file" :args="result.args"></dynfile>
        <div class="search-result" v-else>
            <div style="padding:10px 0 4px 0">
                {{resultMsg}}
                <search-want :list="result.wants"></search-want>
                <span v-show="needPage&&false" style="padding-left:5px"><a href="#" v-on:click="doAll">全部</a></span>
            </div>
            <div class="filters" v-show="filters.length>0">
                <result-filter :text="result.filters" :func="doFilter"></result-filter>
            </div>
            <component :is="result.display" :result="result" v-show="(result.display)&&(result.total>0)"></component>
            <div style="text-align:center;padding-top:3px" v-show="needPage">
                <Page :total="result.total" :page-size="result.item" :current="pageIndex" simple v-on:on-change="changePage"></Page>
            </div>
            <div v-show="needAppend">
                相关搜索：<br />
                <input v-for="item in result.appends" type="button" class="append-ask" show="sAside" v-on:click="doSearch(item)" style="margin-left:10px;" :value="item.desc" />
            </div>
        </div>`,
    data: function () {
        return {
            hightLightRow: -1,
            curFilter: '',
            pageIndex:1
        };
    },
    computed: {
        resultMsg: function () {
            if (this.result.err)
                return this.result.err;
            if (this.isSimple) {
                var unit = this.result.cols[0].unit||"";
                return this.result.ask + "是" + this.result.data + unit;
            }
            if (this.result.total == 0)
                return this.result.ask + "没有数据！";
            return this.result.ask + "有" + this.result.total + "条记录";
        },
        needPage: function () { if (this.pageIndex == 0) return false; return this.result.total > this.result.item; },
        filterArg: function () { if (!this.result.filters) return ""; return this.result.filters.split('|||')[0] },
        filters: function () {
            if (!this.result.filters)
                return [];
            var arr = this.result.filters.split('|||');
            var groups = [];
            for (var g = 1; g < arr.length; g++) {
                var data = arr[g].split(',');
                var lst = [];
                for (var d = 0; d < data.length; d += 2)
                    lst.push([data[d], data[d + 1]]);
                groups.push({ selectedKey: "", list: lst });
            }
            return groups;
        }, needAppend: function () {
            return (this.result.total > 0) && (!!this.result.appends) && (this.result.appends.length > 0);
        }, isSimple: function () {
            return this.result.display == "HtmlReply";
        }, isFile: function () {
            return this.result.display == "FileReply";
        }
    },
    methods: {
        showText: function (item) {
            return (item instanceof Array) ? item[1] : item;
        }, clickData: function (item, r, c) {
            if (item instanceof Array) {
                var col = this.result.cols[c];
                this.$emit("dataclick", col, item, r, c);
            }
        }, cssClass: function (item, r, c) {
            var col = this.result.cols[c];
            return col.css;
        }, changePage: function (p) {
            //this.$emit("pagechanged", p);
            var vm = this;
            var info = "[page]" + this.result.id;
            if (this.curFilter) {
                info = this.curFilter;
            }
            AskInst.doAsk({ strInfo: info, nPage: (p - 1), nRows: AskInst.items }, function (res) {
                if (res.type == 2) {
                    vm.result.data = res.data.data;
                    vm.result.execJS = res.data.execJS;
                    vm.pageIndex = p;
                }
            });
        }, setHightLight: function (r) {
            this.hightLightRow = r;
        }, clearHightLight: function (r) {
            if (this.hightLightRow == r)
                this.hightLightRow = -1;
        }, doFilter: function (arg, values) {
            var vm = this;
            var info = "[part]" + this.result.id + arg + ',' + values.join(',')
            AskInst.doAsk({ strInfo: info, nPage: 0, nRows: AskInst.items }, function (res) {
                if (res.type == 2) {
                    vm.result.data = res.data.data;
                    vm.result.total = res.data.total;
                    vm.result.execJS = res.data.execJS;
                    vm.curFilter = info;
                    vm.pageIndex = 1;
                }
            })
        }, doAll: function () {
            this.changePage(0);
        }, doSearch: function (item) {
            AskInst.askText(item.desc + "呢");
        }, execExtra: function () {
            if (this.result.execJS) {
                this.result.execJS();
                return;
            }
            if (this.result.total != 1)
                return;
            var exec = false;
            var links = $(this.$el).find("a");
            links.each(function (idx) {
                if (exec)
                    return;
                if (links[idx].onclick) {
                    exec = true;
                    links[idx].click();
                }
            });
        }
    },
    mounted: function () {
        this.execExtra();
    },
    updated: function () {
        this.execExtra();
    }
});

Vue.component('TableReply', {
    props: { result: null }, template: `<table style="background-color:#ffffff;font-family:微软雅黑;" cellpadding="0" cellspacing="0">
            <thead>
                <tr style="background:#DAE4EA">
                    <td v-for="item in result.cols">{{item.desc}}</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row,r) in result.data">
                    <td v-for="(item,c) in row" v-on:click="$parent.clickData(item,r,c)" :class="$parent.cssClass(item,r,c)" v-html="$parent.showText(item)"></td>
                </tr>
            </tbody>
        </table>`
});

Vue.component('CommonReply', {
    props: { result: null }, template: `<div>
            <div style="width:100%;padding:5px" :style="{ backgroundColor:bkClr(r) }" v-on:mouseover="$parent.setHightLight(r)" v-on:mouseout="$parent.clearHightLight(r)" v-for="(row,r) in result.data">
                <div class="search-wrapper">
                    <div class="search-index" style="width:16px;height:20px;font-size:12px">
                        <img :src="img(r)" />
                        <span :style="{ color:imgClr(r) }"> {{r + 1}}</span>
                    </div>
                    <span style="padding-left:4px">
                        {{result.cols[0].desc}}：<span v-on:click="$parent.clickData(row[0],r,0)" :class="$parent.cssClass(row[0],r,0)" v-html="$parent.showText(row[0])"></span>
                    </span>
                </div>
                <div style="margin-left:20px;padding-top:3px" v-for="(item,c) in row" v-show="c>0">
                    {{result.cols[c].desc}}：<span v-on:click="$parent.clickData(item,r,c)" :class="$parent.cssClass(item,r,c)" v-html="$parent.showText(item)"></span>
                </div>
            </div>
        </div>`,
    methods: {
        img: function (r) { return (this.$parent.hightLightRow == r) ? "/i/index_focus.png" : "/i/index.png" },
        imgClr: function (r) { return (this.$parent.hightLightRow == r) ? "rgb(0,162,216)" : "rgb(204,44,44)" },
        bkClr: function (r) { return (this.$parent.hightLightRow == r) ? "#e8e8e9" : "#efefef" }
    }
});

Vue.component('BaseReply', {
    props: { result: null }, template: `<div>
            <div style="width:100%;padding:5px" :style="{ backgroundColor:bkClr(r) }" v-on:mouseover="$parent.setHightLight(r)" v-on:mouseout="$parent.clearHightLight(r)" v-for="(row,r) in result.data">
                <div class="search-wrapper">
                    <div class="search-index" style="width:16px;height:20px;font-size:12px">
                        <img :src="img(r)" />
                        <span :style="{ color:imgClr(r) }"> {{r + 1}}</span>
                    </div>
                    <span style="padding-left:4px">
                        {{result.cols[0].desc}}：<span v-on:click="$parent.clickData(row[0],r,0)" :class="$parent.cssClass(row[0],r,0)" v-html="$parent.showText(row[0])"></span>
                    </span>
                </div>
                <div style="margin-left:20px;padding-top:3px" v-for="(item,c) in row" v-show="c>0">
                    {{result.cols[c].desc}}：<span v-on:click="$parent.clickData(item,r,c)" :class="$parent.cssClass(item,r,c)" v-html="$parent.showText(item)"></span>
                </div>
            </div>
        </div>`,
    methods: {
        img: function (r) { return (this.$parent.hightLightRow == r) ? "/i/index_focus.png" : "/i/index.png" },
        imgClr: function (r) { return (this.$parent.hightLightRow == r) ? "rgb(0,162,216)" : "rgb(204,44,44)" },
        bkClr: function (r) { return (this.$parent.hightLightRow == r) ? "#e8e8e9" : "#efefef" }
    }
});

Vue.component('SubStationReply', {
    props: { result: null }, template: `<div>
            <div style="width:100%;padding:5px" :style="{ backgroundColor:bkClr(r) }" v-on:mouseover="$parent.setHightLight(r)" v-on:mouseout="$parent.clearHightLight(r)" v-for="(row,r) in result.data">
                <div class="search-wrapper">
                    <div class="search-index" style="width:16px;height:20px;font-size:12px">
                        <img :src="img(r)" />
                        <span :style="{ color:imgClr(r) }"> {{r + 1}}</span>
                    </div>
                    <span class="search_sta"><span style="padding-left:4px" v-html="$parent.showText(row[0])"></span>({{$parent.showText(row[1])}})</span>
                </div>
                <div style="margin-left:20px;padding-top:3px">
                    {{result.cols[2].desc}}：<span v-on:click="$parent.clickData(row[2],r,2)" :class="$parent.cssClass(row[2],r,2)" v-html="$parent.showText(row[2])"></span>
                </div>
                <div style="margin-left:20px;padding-top:3px">
                    {{result.cols[3].desc}}<span>{{row[3]}}</span>&nbsp;|&nbsp;{{result.cols[4].desc}}<span>{{row[4]}}</span>
                </div>
                <div style="margin-left:20px;padding-top:3px" v-for="(item,c) in row" v-show="c>4">
                    {{result.cols[c].desc}}：<span v-on:click="$parent.clickData(item,r,c)" :class="$parent.cssClass(item,r,c)" v-html="$parent.showText(item)"></span>
                </div>
            </div>
        </div>`,
    methods: {
        img: function (r) { return (this.$parent.hightLightRow == r) ? "/i/index_focus.png" : "/i/index.png" },
        imgClr: function (r) { return (this.$parent.hightLightRow == r) ? "rgb(0,162,216)" : "rgb(204,44,44)" },
        bkClr: function (r) { return (this.$parent.hightLightRow == r) ? "#e8e8e9" : "#efefef" }
    }
});

Vue.component('result-filter', {
    props: ["text","func"],
    data: function () {
        return { filters: [], filterArg: "" };
    },
    computed: {
        values: function () {
            var v = [];
            for (var i = 0; i < this.filters.length; i++) {
                v.push(this.filters[i].selectedKey);
            }
            return v;
        }
    },
    methods: {
        isSelected: function (index, key) {
            if (index < this.filters.length) {
                var filter = this.filters[index];
                return key == filter.selectedKey;
            }
            return false;
        }, clickMenu: function (name) {
            name = name.split('|||');
            Vue.set(this.filters[name[0]], "selectedKey", name[1]);
        }, getSelectedText: function (filter) {
            for (var i = 0; i < filter.list.length; i++) {
                var item = filter.list[i];
                if (item[0] == filter.selectedKey)
                    return item[1];
            }
            return "";
        }, menuStyle: function (filter) {
            if (filter.list.length > 10)
                return { height: "300px", "overflow-y": "scroll" };
            return {};
        },
        resetFilters: function () {
            if (!this.text) return;
            var arr = this.text.split('|||');
            this.filterArg = arr[0];
            var groups = [];
            for (var g = 1; g < arr.length; g++) {
                var data = arr[g].split(',');
                var lst = [];
                for (var d = 0; d < data.length; d += 2)
                    lst.push([data[d], data[d + 1]]);
                groups.push({ selectedKey: "", list: lst });
            }
            this.filters = groups;
        }
    },
    watch: {
        text: function () {
            this.resetFilters();
        },
        values: function (val, oldVal) {
            if ((!oldVal) || (oldVal.length == 0) || (val.length == 0))
                return;
            this.func(this.filterArg, this.values);
        }
    },
    created: function () {
        this.resetFilters();
    },
    mounted: function () {
    },
    template: `<div style="width:100%">
            <Dropdown trigger="click" v-for="(filter,index) in filters" v-on:on-click="clickMenu">
                <div style="display:inline-block;height:32px;line-height:32px;padding:0 2px 0 2px; border:1px solid #cdcdcd">
                    {{ getSelectedText(filter) }}
                    <Icon type="ios-arrow-down"></Icon>
                </div>
                <DropdownMenu slot="list">
                    <div :style="menuStyle(filter)">
                        <div>
                            <DropdownItem v-for="item in filter.list" :name="(index +'|||' + item[0])" :selected="isSelected(index,item[0])"> {{ item[1] }}</DropdownItem>
                        </div>
                    </div>
                </DropdownMenu>
            </Dropdown>
        </div>`
});

var AskInst = {
    items: 10,
    Events: {
        dataclick: function (col, item, r, c) { },
    },
    askText: function (text) {  },
    doAsk: function (info, callback) {
        $.ajax({
            url: "/conn/ashx/AskHandler.ashx",
            type: "post",
            dataType: "text",
            data: info,
            error: function (data) {
                alert("网络超时，请稍后再试");
            },
            success: function (data) {
                eval("data = " + data);
                callback(data);
            }
        });
    },
    ask: function (questionInfo, f, fDisplayEnd) {
        var items = this.items;
        this.doAsk({ strInfo: questionInfo, nPage: 0, nRows: items }, function (data) {
            if (data) {
                AskInst.displayAnswer(data, f());
            }
            else {
                f().empty().html("未搜索到相关信息！");
            }
            if (fDisplayEnd)
                fDisplayEnd();
        })
    },
    displayAnswer: function (res, jq) {
        switch (res.type) {
            case 0://eError = 0,
                jq.html(res.data);
                if (res.cmd) {
                    var c = new (Vue.component("search-want"))();
                    c.list = res.cmd.split(',');
                    c.$mount();
                    jq.append(c.$el);
                }
                break;
            case 1://eOpenApp = 1,
                if (res.args && res.args.length > 1) {
                    jq.html("成功" + res.args[0]);
                    OpenLocationStation(res.args[0], res.args[1]);
                }
                break;
            case 2: //eShowResult = 2,
                jq.empty()
                var list = res.data;
                var lngth = list.length;
                for (var i = 0; i < lngth; i++) {
                    this.displayResult(list[i], jq, lngth);
                }
                break;
            case 3://eGenerateYuan = 3,
                break;
            case 4://eGenerateCzp = 4,
                jq("正在生成操作票：" + res.data + "，请稍等");
                makeCzpByText(res.data);
                break;
            case 5://eOpenUrl = 5,
                jq("执行成功");
                var url = res.data;
                if (url.indexOf("dlg:") == 0) {
                    var arrInfo = url.split(":");
                    var href = arrInfo[1];
                    var desc = arrInfo[2];
                    var width = arrInfo[3];
                    var height = arrInfo[4];
                    var start = arrInfo[5];
                    var end = arrInfo[6];
                    Ysh.Web.showModalDialog(href + "&start=" + start + "&end=" + end, null, desc, width, height, false);
                }
                else
                    window.open(url);
                break;
            case 6://eSendMsg = 6,
                jq.html(res.cmd + (res.success ? "成功！" : "失败！"));
                break;
            case 7://eAskQuestion = 7
                break;
            case 8://eDynFile
                break;
            default:
                break;
        }
    },
    displayResult: function (res, jq, resCount) {
        if (res.display == "CardReply") {//显示卡片
            console.log("打开卡片:" + [res.card, res.args.type, res.args.id]);
            jq.append("打开卡片");
            if (res.args.type)
                res.args.type = res.args.type.replace(":", ".");
            cardUrlInst.display(res);
            return;
        }
        var c = new (Vue.component("search-result"))();
        c.result = res;
        c.$on("dataclick", function (col, item, r, c) {
            AskInst.Events.dataclick(col, item, r, c);
        })
        c.$mount();
        jq.append(c.$el);
    }
}