/*v=1.20.815.1*/
Vue.component("timesearch", {
    props: {
        value: {
            type: String,
            default: "",
        },
        placement: {
            type: String,
            default: "bottom-end",
        },
        buttons: {
            type: Array,
            default: null,
        },
        fstartdate: {
            type: Function,
            default: null,
        },
        fenddate: {
            type: Function,
            default: null,
        },
        onlytoday: {
            type: Boolean,
            default: false,
        },
        needtomorrow: {
            type: Boolean,
            default: false,
        },
        timebuttons: {
            type: Array,
            default: null,
        },
        needmore: {
            type: Boolean,
            default: true,
        },
        morestyle: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            tab: "today",
            tabs_def: [
                ["today", "今日"],
                ["tomorrow", "明日"],
                ["yesterday", "昨日"],
                ["thisweek", "本周"],
                ["lastweek", "上周"],
                ["thismonth", "本月"],
                ["lastmonth", "上月"],
                ["thisyear", "今年"],
                ["lastyear", "去年"],
            ],
            tabs_def1: [
                ["today", "今日"],
                ["yesterday", "昨日"],
                ["thisweek", "本周"],
                ["lastweek", "上周"],
                ["thismonth", "本月"],
                ["lastmonth", "上月"],
                ["thisyear", "今年"],
                ["lastyear", "去年"],
            ],
            starttime: Ysh.Time.toString(Ysh.Time.getTime("d,d,0")),
            endtime: Ysh.Time.toString(Ysh.Time.getTime("d,d,1")),
            showMore: false,
        };
    },
    computed: {
        tabs: function () {
            var tabs = [];
            if (this.timebuttons) {
                tabs = this.timebuttons;
            } else {
                if (this.onlytoday) {
                    tabs = [["today", "今日"]];
                    if (this.needtomorrow) tabs.push(["tomorrow", "明日"]);
                } else {
                    if (this.needtomorrow) tabs = this.tabs_def;
                    else tabs = this.tabs_def1;
                }
            }
            if (!this.buttons) return tabs;
            return this.buttons.concat(tabs);
        },
    },
    methods: {
        clickTab: function (item) {
            var key = item[0];
            switch (key) {
                case "today":
                    this.starttime = Ysh.Time.toString(Ysh.Time.getTime("d"));
                    this.endtime = Ysh.Time.toString(Ysh.Time.getTime("d,d,1"));
                    break;
                case "yesterday":
                    this.starttime = Ysh.Time.toString(Ysh.Time.getTime("d,d,-1"));
                    this.endtime = Ysh.Time.toString(Ysh.Time.getTime("d"));
                    break;
                case "tomorrow":
                    this.starttime = Ysh.Time.toString(Ysh.Time.getTime("d,d,1"));
                    this.endtime = Ysh.Time.toString(Ysh.Time.getTime("d,d,2"));
                    break;
                case "thisweek":
                    this.starttime = Ysh.Time.toString(Ysh.Time.getTime("w"));
                    this.endtime = Ysh.Time.toString(Ysh.Time.getTime("w,w,1"));
                    break;
                case "lastweek":
                    this.starttime = Ysh.Time.toString(Ysh.Time.getTime("w,w,-1"));
                    this.endtime = Ysh.Time.toString(Ysh.Time.getTime("w"));
                    break;
                case "thismonth":
                    this.starttime = Ysh.Time.toString(Ysh.Time.getTime("m"));
                    this.endtime = Ysh.Time.toString(Ysh.Time.getTime("m,m,1"));
                    break;
                case "lastmonth":
                    this.starttime = Ysh.Time.toString(Ysh.Time.getTime("m,m,-1"));
                    this.endtime = Ysh.Time.toString(Ysh.Time.getTime("m"));
                    break;
                case "thisyear":
                    this.starttime = Ysh.Time.toString(Ysh.Time.getTime("y"));
                    this.endtime = Ysh.Time.toString(Ysh.Time.getTime("y,y,1"));
                    break;
                case "lastyear":
                    this.starttime = Ysh.Time.toString(Ysh.Time.getTime("y,y,-1"));
                    this.endtime = Ysh.Time.toString(Ysh.Time.getTime("y"));
                    break;
                default:
                    var arr = key.split(":");
                    if (arr.length == 2) {
                        this.starttime = Ysh.Time.toString(Ysh.Time.getTime(arr[0]));
                        this.endtime = Ysh.Time.toString(Ysh.Time.getTime(arr[1]));
                    }
                    break;
            }
            this.$emit("input", key);
            this.$nextTick(function () {
                this.doSearch(false);
            });
        },
        doSearch: function (bOther) {
            this.$emit("search", this.value, this.starttime, this.endtime, bOther);
        },
        clickSearch: function () {

            this.$emit("input", "more");
            this.$nextTick(function () {
                this.doSearch(true);
            });
            this.showMore = !this.showMore;
        },
        getItemStyle: function (id, index) {
            var css = { backgroundColor: "#424242", padding: "1px 10px", cursor: "pointer" };
            if (id == this.value) {
                css["color"] = "white";
                // css["border"] = "1px solid #2a8aae";
                css["background"] = "#369bc1";
            } else {
                css["color"] = "white";
                // css["border"] = "1px solid #666666";
                css["background"] = "#414141";
            }
            return css;
        },
    },
    template: `
    <div>
        <div style="display:inline-block;padding:0 5px 0 0" v-for="(item,index) in tabs">
            <div @click="clickTab(item)" :style="getItemStyle(item[0],index)">{{item[1]}}
            </div>
        </div>
        <Poptip v-model="showMore" trigger="click" :placement="placement">
            <div style="display:inline-block;padding:0 5px 0 0">
                <div :style="getItemStyle(\'more\',-1)" v-show="(!onlytoday)&&needmore">更多</div>
                </div>
                <div slot="content">
                    <div v-if="morestyle&&showMore" style="display:flex;align-items:center;">
                        <DatePicker type="date" placeholder="选择开始时间" style="width: 120px" v-model="starttime"></DatePicker>
                        <span> - </span>
                        <DatePicker type="date" placeholder="选择结束时间" style="width: 120px" v-model="endtime"></DatePicker>
                        <slot></slot>
                        <Icon type="ios-search" size="20" color="white" style="cursor: pointer; margin-left: 5px;" @click="clickSearch"></Icon>
                    </div>
                    <div v-else-if="showMore">
                        <date-time-ctrl :fshowdate="fstartdate" disstyle="111000" dtstyle="2" css="blacktime" img="/i/selectdate.png" style="border:0" v-model="starttime">
                        </date-time-ctrl>
                        <span>至</span>
                        <date-time-ctrl :fshowdate="fenddate" disstyle="111000" dtstyle="2" css="blacktime" img="/i/selectdate.png" style="border:0" v-model="endtime">
                        </date-time-ctrl>
                        <slot></slot>
                        <Icon type="ios-search" size="20" color="white" @click="clickSearch">
                        </Icon>
                    </div>                  
                </div>
        </Poptip>
    </div>`,
});
