/*v=1.21.1019.1*/
Vue.component("realhisbutton", {
    data: function () {
        return {};
    },
    props: ["value", "show", "time"],
    methods: {
        changeType: function (n) {
            if (this.value == n) return;
            this.$emit("input", n);
            this.$emit("change", n);
        }
    },
    watch: {
        show: function () {
            if (!this.show)
                this.$emit("input", 0);
        }
    },
    template: `<div v-if="show" class="float-button">
                <img src="/i/sgc/chaoliu/btnbk.png" style="position:absolute;z-index:1;left:0px;top:0px;" />
                <div style="position:absolute;z-index:2;left:0px;top:0px;width:75px;height:40px;line-height:32px;text-align:center;" v-on:click="changeType(0)" :style="{ 'background-image':value?'':'url(/i/sgc/chaoliu/btnselect.png)'}">实时</div>
                <div style="position:absolute;z-index:2;left:67px;top:0px;width:75px;height:40px;line-height:32px;text-align:center;" v-on:click="changeType(1)" :style="{ 'background-image':value?'url(/i/sgc/chaoliu/btnselect.png)':''}">历史</div>
                <div v-if="value" style="position:absolute;z-index:2;left:142px;top:0px;width:142px;height:32px;line-height:32px;text-align:center;cursor:default;background-image:url(/i/sgc/chaoliu/timebk.png)">{{ Ysh.Time.formatString(time,"111111") }}</div>
            </div>`
});

Vue.component('htimeplayer', {
    data: function () {
        return {
            state: 0, timerId: 0, display: 0, width: 0, itemWidth: 40, perWidth: 0, perStep: 1, showTime: false, start: "", end: "", drag: false, startX: 0, isDragged: false, backup: null, timeSpan: 0, tempTime: "", nowTime: new Date()
        };
    },
    props: {
        //"now": {
        //    "default": ""
        //},
        "value": {
            "default": ""
        }, "step": {
            type: Number,
            "default": 1
        }, "type": {
            "default": "y"
        }, "min": {
            "default": ""
        }, "max": {
            "default": ""
        }, "autoplay": {
            type: Number,
            "default": 2
        }, "selectstart": {
            type: Boolean,
            "default": true
        }, "loop": {
            type: Boolean,
            "default": false
        }, "isvalid": {
            type: Function,
            "default": null
        }, "tsmode": {
            type: String,
            "default": ""
        }, "datemode": {
            type: String,
            "default": ""
        }
    },
    computed: {
        startTime: function () { if (!this.start) return null; return new Date(Ysh.Time.parseDate(this.start)); },
        endTime: function () { if (!this.end) return null; return new Date(Ysh.Time.parseDate(this.end)); },
        minTime: function () { if (!this.min) return null; return new Date(Ysh.Time.parseDate(this.min)); },
        maxTime: function () { if (!this.max) return null; return new Date(Ysh.Time.parseDate(this.max)); },
        //nowTime: function () { if (!this.now) return new Date(); return new Date(Ysh.Time.parseDate(this.now)); },
        valueTime: function () { if (!this.value) return null; return new Date(Ysh.Time.parseDate(this.value)); },
        canUse: function () { if (!this.startTime) return false; if (!this.endTime) return false; if (this.width < 1) return false; if (!this.itemWidth) return false; return true; },
        playImg: function () {
            return (this.state == 1) ? "/i/ctrl/pause.png" : "/i/ctrl/play.png";
        },
        picktype: function () {
            switch (this.type) {
                case 'y': return "year";
                case 'm': return 'month';
                case 'd': return 'date';
                default: return "datetime";
            }
        },
        disstyle: function () {
            if (this.tsmode) {
                switch (this.type) {
                    case 'y': return "yyyy年";
                    case 'm': return "yyyy年MM月";
                    case 'd': return "yyyy-MM-dd";
                    case 'mi': return "yyyy-MM-dd HH:mm";
                    default: return "yyyy-MM-dd HH时";
                }
            }
            if (this.datemode) {
                switch (this.type) {
                    case 'y': return "yyyy年";
                    case 'm': return "yyyy年MM月";
                    case 'd': return "yyyy-MM-dd";
                    case 'mi': return "yyyy-MM-dd HH:mm";
                    default: return "yyyy-MM-dd HH时";
                }
            }
            switch (this.type) {
                case 'y': return "100000";
                case 'm': return "110000";
                case 'd': return "111000";
                case 'mi': return "111110";
                default: return "111100";
            }
        },
        showstyle: function () {
            switch (this.type) {
                case 'y': return "100000";
                case 'm': return "010000";
                case 'd': return "001000";
                case 'hh': return "100";
                default: return "110";
            }
        },
        typename: function () {
            if (this.backup) return "返回";
            switch (this.type) {
                case 'y':
                    return "年份";
                case 'm':
                    return "月份";
                case 'd':
                    return "日期";
                default://h
                    return "时间";
            }
        },
        scaleList: function () {
            if (!this.canUse) {
                return [];
            }
            var maxCount = parseInt(this.width / this.itemWidth, 10);
            if (maxCount < 1)
                return [];
            var itemCount = this.getItemCount();
            if (itemCount == 0)
                return [];
            itemCount--;//前后都要显示一个时间，最多分成的份数少一
            var t = parseInt(itemCount / maxCount - 0.001, 10) + 1;
            var per = itemCount / t;
            var showCount = parseInt(per, 10);
            var w = this.width / per;
            this.perWidth = w;
            this.perStep = t;
            var ret = [];
            var format = this.showstyle;
            var tmPrev = null;
            for (var i = 0; i <= showCount; i++) {
                var tmThis = Ysh.Time.add(this.type, t * i * this.step, this.startTime);
                ret.push({ value: tmThis, time: Ysh.Time.formatString(tmThis, format), pos: (w * i) + "px", ext: this.getExtend(tmThis, tmPrev) });
                tmPrev = tmThis;
            }
            //if (ret.length > 0)
            //    ret[0].time = this.getTypeName();
            return ret;
        },
        curPosition: function () {
            var idx = 0;
            if (this.perWidth)
                idx = Ysh.Time.diff(this.type, this.startTime, this.valueTime) / this.perStep / this.step;
            return (idx * this.perWidth - 10) + "px";
        },
        showCurPosition: function () {
            if (this.valueTime < this.startTime) return false;
            if (this.valueTime > this.endTime) return false;
            return true;
        },
        nowPositionDiff: function () {
            return Ysh.Time.diff(this.type, this.startTime, this.nowTime);
        },
        nowPosition: function () {
            var idx = 0;
            if (this.perWidth)
                idx = this.nowPositionDiff / this.perStep / this.step;
            return (idx * this.perWidth - 10) + "px";
        },
        forePositionPx: function () {
            var idx = 0;
            if (this.perWidth)
                idx = Math.max(this.nowPositionDiff + 1, 0) / this.perStep / this.step;
            return idx * this.perWidth;
        }
    },
    methods: {
        disabledDate: function (dt) {
            return dt > this.maxTime;
        },
        onMouseWheel: function (event) {
            var offset = event.wheelDelta;
            var start = Ysh.Time.add(this.type, offset > 0 ? 1 : -1, Ysh.Time.parseDate(this.start));
            var end = Ysh.Time.add(this.type, offset > 0 ? -1 : 1, Ysh.Time.parseDate(this.end));
            if ((start >= this.maxTime) || (start >= end))
                return;
            if (offset > 0) {
                var diff = Ysh.Time.diff(this.type, start, end) / this.step;
                if (diff < 9)
                    return;
            }
            this.start = Ysh.Time.toString(start);
            if (end > this.maxTime)
                return;
            this.end = Ysh.Time.toString(end);
        },
        onMouseDown: function (event) {
            this.drag = true;
            this.startX = event.offsetX;
            this.isDragged = false;
        },
        onMouseUp: function (event) {
            this.drag = false;
        },
        onMouseOut: function () {
            this.drag = false;
        },
        onMouseMove: function (event) {
            if (!this.drag)
                return;
            var offset = event.offsetX - this.startX;
            if (Math.abs(offset) > this.itemWidth) {
                this.startX = event.offsetX;
                var start = Ysh.Time.add(this.type, offset > 0 ? -1 : 1, Ysh.Time.parseDate(this.start));
                var end = Ysh.Time.add(this.type, offset > 0 ? -1 : 1, Ysh.Time.parseDate(this.end));
                if (end > this.maxTime)
                    return;
                var sOld = this.start;
                this.start = Ysh.Time.toString(start);
                if (sOld != this.start)
                    this.changeStartTime(this.start);
                this.end = Ysh.Time.toString(end);
                this.isDragged = true;
            }
        },
        changeStartTime: function (v) {
            if (!v) return;
            //this.value = v;
            //if (this.value < v)
            //    this.value = v;

            if (Ysh.Type.isDate(this.start))//用v不行，v与格式有关系

                v = Ysh.Time.toString(this.start);

            else
                v = this.start;
            this.value = v;
            var end = Ysh.Time.add('ss', this.timeSpan, this.start);
            if (end > this.maxTime)
                end = this.maxTime;
            this.end = Ysh.Time.toString(end);
            this.backup = null;
            this.$emit("startchanged", v);
        },
        changeEndTime: function (v) {
            if (!v)
                v = Ysh.Time.toString(this.max);
            this.end = v;
        },
        getTypeName: function () {
            switch (this.type) {
                case 'y':
                    return "年份";
                case 'm':
                    return "月份";
                case 'd':
                    return "日期";
                default://h
                    return "时间";
            }
        },
        getExtend: function (tm, tmPrev) {
            switch (this.type) {
                case 'y':
                    if (tmPrev == null)
                        return "";
                    return "";
                case 'm':
                    if (tmPrev != null) {
                        if (tm.getFullYear() == tmPrev.getFullYear())
                            return "";
                    }
                    return Ysh.Time.formatString(tm, "1100000").substr(2);
                case 'd':
                    if (tmPrev != null) {
                        if ((tm.getFullYear() == tmPrev.getFullYear()) && (tm.getMonth() == tmPrev.getMonth()))
                            return "";
                    }
                    return Ysh.Time.formatString(tm, "1010000");
                default://h
                    if (tmPrev != null) {
                        if (tm.getDate() == tmPrev.getDate())
                            return "";
                    }
                    return Ysh.Time.formatString(tm, "[d]日");
            }
        },
        selectTime: function () {
            if (this.showTime) { this.showTime = false; return; }
            this.timeSpan = Ysh.Time.diff('ss', this.startTime, this.endTime);
            this.tempTime = this.start;
            this.showTime = true;
        },
        getItemCount: function () {
            if (!this.canUse) return 0;
            var diff = Ysh.Time.diff(this.type, this.startTime, this.endTime) / this.step;
            return diff + 1;
        },
        clickPlayer: function (e) {
            if (this.isDragged) return;
            var x = e.offsetX;
            if (x < 0) return;
            if (this.state == 1)
                this.play();
            var n = parseInt(this.getItemCount() * x / this.width, 10);
            var v = Ysh.Time.add(this.type, n * this.step, this.startTime);
            if (!this.isEnable(v))
                return;
            this.value = Ysh.Time.toString(v);
        },
        play: function () {
            //0 停止 1 - 播放中
            if (this.state == 1) {
                this.pause();
            } else {
                this.state = 1;
                this.doPlay(true);
            }
        },
        pause: function () {
            if (this.state == 1) {
                this.state = 0;
                window.clearTimeout(this.timerId);
            }
        },
        getNextValue: function (back, curTime, originTime) {
            var v = Ysh.Time.add(this.type, this.step, curTime);
            if ((!(v > originTime)) && (!(v < originTime))) return null;//两个时间不能直接相等
            if (v > this.maxTime) {
                if (back || this.loop) {
                    v = this.startTime;
                } else {
                    return null;
                }
            }
            if (this.isEnable(v))
                return v;
            return this.getNextValue(back, v, originTime);
        },
        doPlay: function (back) {
            var v = this.getNextValue(back, this.valueTime, this.valueTime);
            if (v === null) {
                //超出范围，停止播放
                this.state = 0;
                window.clearTimeout(this.timerId);
                this.$emit("end")
                return;
            }
            var vStr = Ysh.Time.formatString(v, "111111");
            if (vStr > this.end) {
                var timeSpan = Ysh.Time.diff(this.type, this.startTime, this.endTime);
                this.end = vStr;
                this.start = Ysh.Time.toString(Ysh.Time.add(this.type, -timeSpan, this.end));
            }
            this.$emit("input", vStr);
            vm = this;
            this.timerId = window.setTimeout(function () { vm.doPlay(); }, this.autoplay * 1000);
        },
        resetStartTime: function () {
            var s = (this.start ? new Date(Ysh.Time.parseDate(this.start)) : new Date());
            this.start = Ysh.Time.toString(Ysh.Time.getTimeStart(s, this.type));
        },
        redraw: function () {
            this.width = $(this.$el).width() - 50 - 40 - 40;
        },
        resize: function () {
            if (!this.$el)
                return;
            this.$nextTick(function () {
                this.redraw();
            });
        },
        getItemStyle: function (item) {
            var o = { color: this.isEnable(item.value) ? "white" : "gray" };
            //if (item.value < this.nowTime) {
            //    var next = Ysh.Time.add(this.type, this.step, item.value);
            //    if (next >= this.nowTime)
            //        o["background-image"] = "url(/i/ctrl/player_now_bk.png)";
            //}
            return o;
        },
        isEnable: function (tm) {
            if (!this.isvalid)
                return true;
            return this.isvalid(tm);
        },
        clickExt: function (item) {
            var t = "";
            switch (this.type) {
                case 'y':
                    break;
                case 'm':
                    t = "y";
                    break;
                case 'd':
                    t = "m";
                    break;
                default://h
                    t = "d";
                    break;
            }
            if (!t) return;
            var start = Ysh.Time.getTimeStart(item.value, t);
            if (start == this.maxTime) return;
            this.backup = [this.start, this.end];
            this.start = Ysh.Time.toString(start);
            var end = Ysh.Time.add(this.type, -1, Ysh.Time.add(t, 1, Ysh.Time.getTimeStart(item.value, t)));
            if (end > this.maxTime)
                end = this.maxTime;
            this.end = Ysh.Time.toString(end);
        },
        restoreBackup: function () {
            this.start = this.backup[0];
            this.end = this.backup[1];
            this.backup = null;
        },
        getItemExtTips: function (item) {
            switch (this.type) {
                case 'y':
                    return "";
                case 'm':
                    return "";
                case 'd':
                    return Ysh.Time.formatString(item.value, "110000");
                default://h
                    return Ysh.Time.formatString(item.value, "111000");
            }

        },
        onChangeTime: function () {
            if (this.disstyle == "yyyy年") {
                this.okTime();
            }
        },
        okTime: function () {
            this.start = this.tempTime;
            this.showTime = false;
            this.changeStartTime(this.start);
        },
        resetNowTime: function () {
            this.nowTime = new Date();
            var _this = this;
            window.setTimeout(function () { _this.resetNowTime(); }, 1000);
        }
    },
    watch: {
        type: function () { this.resetStartTime(); },
        min: function () {
            this.start = this.min; this.resetStartTime();
        },
        max: function () {
            this.end = Ysh.Time.toString(this.max);
        },
        value: function () {
            //this.changeValue();
            this.$emit('input', this.value);
            this.$emit('change', this.value, !this.isEnable(this.value));
        },
        start: function (newV, oldV) {
            if (!newV) {
                this.start = oldV;
                return;
            }
            if (Ysh.Type.isDate(this.start))
                this.start = Ysh.Time.toString(this.start);
        }
    },
    created: function () {
        this.start = this.min;
        this.end = Ysh.Time.toString(this.max);
        this.resetStartTime();
    },
    mounted: function () {
        //this.min = "1950-01-01";
        //this.max = "2020-01-01";
        this.resetNowTime();
        return;
        Ysh.Web.Event.attachEvent(document, "onkeydown", function () {
            if (!event) return;
            if (event.keyCode == Ysh.Key.LeftArrow) {
            } else if (event.keyCode == Ysh.Key.RightArrow) {
            }
        });
    },
    template: //'#htimeplayer_template'
        `<div class="player-border">
            <div class ="player-left">
                <div v-if="tsmode" style="display:inline-block;position:relative">
                    <img v-if="selectstart" style="width:26px;height:26px;" src="/i/ctrl/calendar.png" v-on:click="selectTime" />
                    <div v-if="showTime" class="ivu-poptip-popper" style="position: absolute; top: -64px; left: -8px;width:255px" x-placement="top-start">
                        <div class="ivu-poptip-content">
                            <div class="ivu-poptip-arrow"></div>
                            <div class="ivu-poptip-inner">
                                <div class="ivu-poptip-body">
                                    <div class="ivu-poptip-body-content" style="background-color:#6a6a6a">
                                        <div style="white-space: normal; display: flex; align-items: center;">
                                        <div style="display:inline-block;"><div>开始时间：</div></div>
                                        <div style="display:inline-block;"><DatePicker v-model="tempTime" :options="{ disabledDate:disabledDate }" :type="picktype" :format="disstyle" style="width:160px" v-on:on-change="onChangeTime" v-on:on-ok="okTime"></DatePicker></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Poptip v-else :value="showTime" trigger="click" placement="top-start" :disabled="showTime">
                    <img v-if="selectstart" style="width:26px;height:26px;" src="/i/ctrl/calendar.png" v-on:click="selectTime" />
                    <div slot="content" style="white-space:normal;display:flex;align-items:center;">
                    <template v-if="datemode">
                        <div style="display:inline-block;"><div>开始时间：</div></div>
                        <div style="display:inline-block;"><DatePicker v-model="start" :editable="false" :options="{ disabledDate:disabledDate }" :type="picktype" :format="disstyle" style="width:160px" v-on:on-change="changeStartTime"></DatePicker></div>
                    </template>
                    <template v-else>
                        开始时间：<date-time-ctrl v-model="start" img="none" :max="maxTime" :disstyle="disstyle" v-on:change="changeStartTime"></date-time-ctrl>
                    </template>
                    </div>
                </Poptip>
                <img style="width:26px;height:26px;" :src="playImg" v-on:click="play" />
            </div>
            <div class="player-space" :style="{ color:(backup?'#3C9DD1':''),cursor:(backup?'cursor':'') }" v-on:click="restoreBackup"> {{typename}} </div>
            <div class="player-right" v-on:mousewheel="onMouseWheel" v-on:mousedown.capture="onMouseDown" v-on:mouseout="onMouseOut" v-on:mouseup="onMouseUp" v-on:mousemove="onMouseMove">
                <div style="position:absolute;z-index:100;left:0;top:0;width:100%;height:100%" v-on:click.capture="clickPlayer"></div>
                <div class="player-right-top">
                    <div :style="{ left:forePositionPx + 'px',width:'calc(100% - '+forePositionPx+'px)',height:'100%' }" style="position:absolute;background-image:url(/i/ctrl/player_fore_bk.png)"></div>
                    <div v-for="item in scaleList" class="player-text" :style="{ left:item.pos }"> <span style="margin-left:-50%" :style="getItemStyle(item)">{{ item.time }}</span></div>
                </div>
                <div class="player-right-bottom">
                    <div v-for="item in scaleList" class="player-scale" :style="{ left:item.pos }">
                    </div>
                    <div v-for="item in scaleList" class="player-text" :style="{ left:item.pos }" style="z-index:101"> <span style="margin-left:-50%;cursor:pointer" v-on:click.stop="clickExt(item)" :title="getItemExtTips(item)">{{ item.ext }}</span></div>
                </div>
                <div v-show="showCurPosition" class="player-line" :style="{ left:curPosition }">
                    <img src="/i/ctrl/staff.png" />
                </div>
                <div class="player-line" style="height:100%" :style="{ left:nowPosition }">
                    <img src="/i/ctrl/player_now_line.png" style="height:100%" />
                </div>
            </div>
            <div class="player-space-end"></div>
        </div>`
});

Vue.component('boardcast', {
    data: function () {
        return {
        };
    },
    props: ["caption", "assist", "content"],
    computed: {
        captionText: function () {
            if (Ysh.Type.isArray(this.caption))
                return this.caption.join(" ");
            return this.caption;
        }
    },
    methods: {
    },
    template: `<div class="boardcast-box">
            <div class="boardcast-caption">
                <div class="boardcast-caption-main">{{captionText}}</div>
                <div class="boardcast-caption-assist">{{assist}}</div>
            </div>
            <div class="boardcast-content" v-show="content">
                <img style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;" src="/i/ctrl/boardcast_text.png" />
                {{content}}
            </div>
        </div>`
});

Vue.component("app-module", {
    props: {
        top: {
            type: Number, "default": 380
        }
    },
    data: function () {
        return {
            modules: [],
            moduleGz: null,
            curModule: null,
            resetModule: false,
            moduleTop: 0,
            editGzing: false,
            caches: {},
            itemDrag: null
        };
    },
    methods: {
        drag: function (item) { this.itemDrag = item; },
        dragover: function (item) {
        },
        drop: function (item, parent) {
            if ((item == this.itemDrag) || (null == this.itemDrag) || (!this.itemDrag.id)) return;
            if ((item == null) || (!item.id)) {
                if (!PDP.exec([{ type: 'modify', db: 'ConnMain', sql: 'pdp:Module/MoveEnd', args: [this.itemDrag.id, parent.id] }]).check("移动模块", true)) {
                    return;
                }
                parent.subs.erase(this.itemDrag);
                parent.subs.push(this.itemDrag);
            } else {
                if (!PDP.exec([{ type: 'modify', db: 'ConnMain', sql: 'pdp:Module/MoveModule', args: [this.itemDrag.id, item.id, parent.id] }]).check("移动模块", true)) {
                    return;
                }
                parent.subs.erase(this.itemDrag);
                parent.subs.insert(parent.subs.indexOf(item), [this.itemDrag]);
            }
            this.$forceUpdate();
        },
        getRootModuleStyle: function (item, index) {
            /*if (index == this.modules.length - 1) {
                return { "margin-top":"4px"};
            }*/
            return null;
        },
        isLink: function (item) {
            if (!item.url) return true;
            return (item.url.left(4) != "app:") && (item.url.left(5) != "card:");
        },
        isSplit: function (item) {
            return item.url == "sep";
        },
        getSelectedSubs: function (item) {
            if (item == this.moduleGz) return [];
            var arr = [];
            if (!item.subs) {
                if (this.isShowing(item))
                    arr.push(item)
            }
            else {
                for (var i = 0; i < item.subs.length; i++) {
                    var sub = item.subs[i];
                    if (this.isShowing(sub))
                        arr.push(sub);
                }
            }
            return arr;
        },
        getRealArg: function (arg) {
            switch (arg) {
                case "{gridid}":
                    return SelectCityInst.getLocateGrid();
                case "{dccid}":
                    return SelectCityInst.getLocateDcc();
                default:
                    return arg;
            }
        },
        clickModuleButton: function (module, parent) {
            if (!module.url)
                return;
            if (module.url == "app:add") {
                var vm = this;
                var dlgModule = vMain.showPage("moduleedit", "添加 - " + module.parent.getText(), "sgc_module_edit", {
                    pid: module.parent.id, close: function (id, name, url, img) {
                        var mAdd = { id: id, text: name, url: url, img: img };
                        vm.fullModule(mAdd);
                        module.parent.subs.push(mAdd);
                        if (dlgModule)
                            dlgModule.show = false;
                    }
                }, null, "400px", "255px");
                return;
            }
            if (parent && parent.editing) //正在编辑，不让乱点
                return;
            if (module.url.left(4) == "app:") {
                var id = module.url.substr(4);
                this.$emit("click-app", module, id);
                if (!module.subs)
                    this.$nextTick(function () { this.$forceUpdate(); });
                return;
            } else if (module.url.left(5) == "card:") {
                var args = module.url.substr(5).split(',');
                cardUrlInst.show(args[0], this.getRealArg(args[1]));
                return;
            } else if (module.url.left(5) == "page:") {
                var page = module.url.substr(5);
                this.$emit("show-page", module, page);
            } else
                window.open(module.url, "_blank");
        },
        editModule: function (module) {
            var dlgModule = vMain.showPage("moduleedit", "修改 - " + module.getText(), "sgc_module_edit", {
                id: module.id, close: function (name, url, img) {
                    module.text = name;
                    module.url = url;
                    module.img = img;
                    if (dlgModule)
                        dlgModule.show = false;
                }
            }, null, "400px", "255px");
        },
        delModule: function (module, parent) {
            if (!confirm("您确定要删除模块：" + module.getText() + "吗？"))
                return;
            if (PDP.exec([{ type: 'modify', db: 'ConnMain', sql: 'pdp:Module/DelModule', args: [module.id] }]).check("删除模块")) {
                parent.subs.erase(module);
            }
        },
        showModule: function (module, evt) {
            if (!module.subs)
                return;
            this.resetModule = false;
            this.curModule = module;
            var top = ($(evt.srcElement).offset().top - 48);
            var height = (parseInt(module.subs.length / 3, 10) + ((module.subs.length % 3 == 0) ? 0 : 1)) * 70 + 48 + 50;
            if (top + height > window.innerHeight)
                top = window.innerHeight - height;
            this.moduleTop = top + "px";
            this.refreshOverload();
        },
        hideModule: function (module) {
            this.resetModule = true;
            var vm = this;
            window.setTimeout(function () {
                if (vm.resetModule)
                    vm.curModule = null;
            }, 100);
        },
        getModuleSplits: function (module) {
            var num = 3;
            var ret = [];
            var lngth = module.subs.length;
            var lngthex = lngth;
            if (module.canAdd && module.editing)
                lngthex++;
            for (var i = 0; i < lngthex; i += num) {
                var row = [];
                for (var j = 0; (j < num) && (j <= lngth); j++) {
                    if ((i + j == lngth) && module.canAdd && module.editing)
                        row.push({ parent: module, url: "app:add", img: "/i/sgc/add-hover.png", getText: function () { return "添加..."; } });
                    else
                        row.push(module.subs[i + j]);
                }
                for (; j < num; j++)
                    row.push(null);
                ret.push(row);
            }
            return ret;
        },
        getModuleStyle: function (item) {
            if (!item) return null;
            return this.isShowing(item) ? { backgroundColor: '#dddddd' } : null;
        },
        moduleCanEdit: function (item, parent) {
            if (item == null) return false;
            return parent.canAdd && parent.editing && item.url != "app:add";
        },
        moduleCanCheck: function (item) {
            if (!this.editGzing)
                return false;
            if ((!item) || (!this.moduleGz))
                return false;
            if (this.curModule.arg != "gz")
                return true;
            return typeof item.gz != "undefined";
        },
        moduleChecked: function (item) {
            return item.gz;
        },
        onModuleCheck: function (item) {
            var b = !item.gz;
            var sql = b ? "AddUserModule" : "DelUserModule";
            var vm = this;
            PDP.exec([{ type: 'modify', db: '', sql: 'pdp:Module/' + sql, args: [login.usernum, item.id] }], function (ret) {
                var info = b ? "关注" : "取消关注";
                if (ret.check(info, true)) {
                    vm.$Message.success({ content: info + "成功！" });
                    item.gz = b;
                    if (b) {
                        vm.moduleGz.subs.push(item);
                    } else {
                        vm.moduleGz.subs.erase(item);
                    }
                }
            });
        },
        getGzModule: function () {
            return Ysh.Array.first(this.modules, function (m) { return m.arg == "gz"; });
        },
        changeEditState: function (m) {
            m.editing = !m.editing;
            this.$forceUpdate();
        },
        findModule: function (arr, id) {
            for (var i = 0; i < arr.length; i++) {
                var module = arr[i];
                if (module.id == id)
                    return module;
                if (!module.subs)
                    continue;
                module = this.findModule(module.subs, id);
                if (null != module)
                    return module;
            }
            return null;
        },
        fullModule: function (m) {
            var vm = this;
            var f = function () {
                var flag = "{gridname}";
                if (this.text.indexOf(flag) >= 0) {
                    var gridname = SelectCityInst.selectText;
                    return this.text.replace(flag, gridname);
                }
                var c = vm.caches[this.url];
                if (!c)
                    return this.text;
                return this.text + "(" + c + ")";
            }
            m.getText = f;
        },
        getModuleImg: function (item) {
            if (item.subs)
                return item.img;
            if ((item.url == "") || (item.url == "app:") || item.disabled)
                return item.img.replace(".png", "_dis.png");
            return item.img;
        },
        refreshOverload: function () {
            if (!this.curModule)
                return;
            var item = this.curModule;
            if (!item.subs)
                return;
            var bNeedRefresh = false;
            for (var i = 0; i < item.subs.length; i++) {
                var sub = item.subs[i];
                if ((sub.url == "app:overload") || (sub.url == "app:heavyload")) {
                    bNeedRefresh = true;
                    break;
                }
            }
            if (!bNeedRefresh)
                return;
            var dlls = [];
            var types = [8, 9];
            var pgid = this.getRealArg("{gridid}");
            for (var i = 0; i < types.length; i++)
                dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["commongetdata", "?requesttype=" + types[i] + "&ids=" + pgid] });
            var vm = this;
            PDP.exec(dlls, function (ret) {
                if (!ret.isOK) return;
                try {
                    var trans = JSON.parse(ret.value[0]).data.nma_trans_load.grid_trans_load_list[0];
                    var line = JSON.parse(ret.value[1]).data.nma_line_load.grid_line_load_list[0];
                    vm.caches["app:overload"] = (trans.over_load_list || "").length + "/" + (line.over_load_list || "").length
                    vm.caches["app:heavyload"] = (trans.heavy_load_list || "").length + "/" + (line.heavy_load_list || "").length;
                    vm.$forceUpdate();
                } catch (err) {
                }
            });
        },
        sendBusinessMsg: function (msg) {
            Ysh.Array.each(this.modules, function (m) {
                if (m.app && m.app.state && m.app.receive)
                    m.app.receive(msg);
                if (m.subs)
                    Ysh.Array.each(m.subs, function (ms) {
                        if (ms.app && ms.app.state && ms.app.receive)
                            ms.app.receive(msg);
                    });
            });
        },
        init: function (modules, users, bIsAdmin) {
            var vm = this;
            vm.modules = JSON.parse(modules);
            var gz = vm.getGzModule();
            vm.moduleGz = gz;
            if ((users != "") && (gz != null)) {
                var arr = users.split(',');
                Ysh.Array.each(arr, function (id) {
                    var m = vm.findModule(vm.modules, id);
                    if (!m)
                        return;
                    m.gz = true;
                    gz.subs.push(m);
                });
            }
            Ysh.Array.each(vm.modules, function (m, i) {
                vm.fullModule(m);
                if (bIsAdmin)
                    m.canAdd = (i > vm.modules.length - 3);
                m.editing = false;
                if (m.subs)
                    Ysh.Array.each(m.subs, function (ms) { vm.fullModule(ms); });
            });
        },
        isShowing: function (m) {
            //if (!m.app) return false;return !!m.app.state;
            if (m.url.left(4) != "app:")
                return false;
            var id = m.url.substr(4);
            var app = vMain.getApp(id);
            if (!app) return false;
            return app.state;
        }
    },
    created: function () {
        return;
        var vm = this;
        PDP.dll("PDP2.0:PDP2.ModulePriv.GetModuleList", [login.usernum], function (ret) {
            if (!ret.check("获取应用列表", true))
                return;
            var modules = ret.value[0][0];
            var users = ret.value[0][1];
            var bIsAdmin = login.isAdmin;
            vm.init(modules, users, bIsAdmin);
        });
    },
    template: `<div>
        <div v-if="curModule != null" class="module-box" style="right:40px;" :style="{ top:moduleTop }" v-on:mouseover="resetModule=false;" v-on:mouseout="hideModule(curModule)">
            <div class="module-caption">
                <span>{{ curModule.getText() }}</span>
                <img v-if="curModule == moduleGz" :title="editGzing?'关注完成':'维护关注列表'" :src="editGzing?'/i/sgc/close_circle.png':'/i/edit.gif'" v-on:click="editGzing=!editGzing" style="float:right;width:16px;height:16px;margin-top:8px;cursor:pointer" />
                <span v-if="(curModule == moduleGz)&&editGzing" style="float:right;padding:0 5px;">请进各模块进行关注</span>
                <img v-if="curModule.canAdd" :title="curModule.editing?'取消编辑':'编辑列表'" :src="curModule.editing?'/i/sgc/operate/quitedit.png':'/i/sgc/operate/enteredit.png'" v-on:click="changeEditState(curModule)" style="float:right;width:16px;height:16px;margin-top:8px;cursor:pointer" />
            </div>
            <div class="module-container">
                <div v-for="row in getModuleSplits(curModule)" class="module-row">
                    <div v-for="item in row" class="module-item" :style="getModuleStyle(item)" v-on:click="clickModuleButton(item,curModule)" :draggable="!!curModule.editing" v-on:dragstart="drag(item)" v-on:drop="drop(item,curModule)" v-on:dragover.prevent="dragover(item)">
                        <img v-if="item" class="module-img" :src="getModuleImg(item)" :draggable="!!curModule.editing" /><span v-if="item" class="module-text">{{item.getText()}}</span>
                        <img v-if="item&&isLink(item)" style="position:absolute;right:16px;bottom:40px;" src="/i/sgc/module/link.png" />
                        <input v-if="moduleCanCheck(item)" :checked="moduleChecked(item)" v-on:click.stop="onModuleCheck(item)" type="checkbox" class="module-check" />
                        <div v-if="moduleCanEdit(item,curModule)" class="top-left">
                            <img src="/i/sgc/operate/edit.png" v-on:click.stop="editModule(item)" />
                            <img src="/i/sgc/operate/del.png" v-on:click.stop="delModule(item,curModule)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="float-button" style="right:10px" :style="{ top:top+'px' }">
            <div style="margin-top:-36px">
                <template v-for="(item,index) in modules">
                    <div v-if="false&&index == modules.length - 2" style="text-align:right;height:10px;position:relative;">
                        <div style="width:28px;position:absolute;right:0;height:100%;padding-top:5px;">
                            <hr style="width:18px;height:2px;position:absolute;right:5px;" />
                        </div>
                    </div>
                    <div v-if="isSplit(item)" style="height:5px">
                    </div>
                    <div v-else style="text-align:right;height:29px;">
                        <div style="display:inline-block;position:relative;height:28px;padding:0 5px;" v-bind:style="getRootModuleStyle(item,index)">
                            <img v-if="getSelectedSubs(item).length > 0" src="/i/sgc/module/bk.png" style="position:absolute;z-index:-1;width:100%;height:28px;left:0;top:0;" />
                            <span style="font-size:16px;margin:5px 0 5px 5px;">
                                <span v-for="sub in getSelectedSubs(item)" style="margin-right:5px" v-on:click="clickModuleButton(sub,null)">{{sub.getText()}}</span>
                            </span>
                        </div>
                        <div style="display:inline-block;padding:2px;background-color:white;border-bottom: solid 1px gray">
                            <img v-if="item.subs||isShowing(item)" :src="getModuleImg(item)" style="height:24px;width:24px;" v-on:click="clickModuleButton(item,null)" v-on:mouseover="showModule(item,$event)" v-on:mouseout="hideModule(item)" />
                            <Tooltip v-else :content="item.getText()" placement="left"><img :src="item.img" style="height:24px;width:24px;" v-on:click="clickModuleButton(item,null)" v-on:mouseover="showModule(item,$event)" v-on:mouseout="hideModule(item)" /></Tooltip>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>`
});

var YanshiBase = {
    data: function () {
        return {
            statType: 1,
            kuangState: 1,
            showPlayer: false,
            sPage: 0,
            curStat: null,
            model: null,
            group: null,
            //sYearGenCount: { right: "460px", bottom: "10px", opacity: 0.8 },
            sYearGenCount: { right: "10px", bottom: "10px", opacity: 0.8 },
            sGenCount: { right: "10px", bottom: "10px", opacity: 0.8 },
            sMonthGenCount: { right: "10px", bottom: "320px", opacity: 0.8 },
            loaded: false
        };
    },
    props: {
        show: {
            type: Boolean, "default": false
        },
        title: {
            type: String, "default": ""
        }
    },
    computed: {
        playerBtnImage: function () {
            return this.showPlayer ? "/i/sgc/yanshi/backbutton.png" : "/i/sgc/yanshi/playbutton.png"
        },
        allShowStatistics: function () {
            var arr = [];
            for (var i = 0; i < this.allStatistics.length; i++) {
                var s = this.allStatistics[i];
                if (this.getGroupState(s.type))
                    arr.push(s);
            }
            return arr;
        },
        currShowStatistics: function () {
            var arr1 = this.allShowStatistics;
            return arr1;
            var arr = [];
            if (arr1.length <= 6)
                this.sPage = 0;
            for (var i = 0; i < 6; i++) {
                var idx = 6 * this.sPage + i;
                if (idx >= arr1.length)
                    break;
                var s = arr1[idx];
                arr.push(s);
            }
            return arr;
        },
        sumPlantCount: function () { return this.getSum(this.allStatistics, "count"); },
        sumGenCount: function () { return this.getSum(this.allStatistics, "gencount"); },
        sumCap: function () { return this.getSum(this.allStatistics, "cap"); },
    },
    methods: {
        getTypes: function () {
            var types = [];
            for (var i = 0; i < this.ystypes.length; i++) {
                var t = this.ystypes[i];
                if (t.state)
                    types.push(t.type);
            }
            return types;
        },
        changeTypeState: function (item) {
            item.state = 1 - item.state;
            this.refreshGroup(item);
            var types = this.getTypes();
            window.ys_types = types;
            this.model.types = types;
            this.model.filterTypes();
            if (this.showPlayer)
                this.changeSectionTime();
            MessageInst.postMessage({ type: "typechanged", types: types });
        },
        changeCurStat: function () {
            if (!this.curStat)
                return;
            var types = this.getAllTypes();
            for (var i = 0; i < types.length; i++) {
                var t = types[i];
                var r = Ysh.Array.first(this.curStat, function (row) { return row[0] == t; });
                if (!r)
                    continue;
                this.allStatistics[i].cap = parseInt(r[1], 10);
                this.allStatistics[i].gencount = r[2];
                this.allStatistics[i].count = r[3];
            }
        },
        getGroupState: function (type) {
            for (var i = 0; i < this.ystypes.length; i++) {
                var t = this.ystypes[i];
                if (t.type == type)
                    return t.state;
            }
            return 0;
        },
        clickPlayerButton: function () {
            this.showPlayer = !this.showPlayer;
            this.$emit("show-player", this.showPlayer);
        },
        getSum: function (lst, field) {
            var sum = 0;
            for (var i = 0; i < lst.length; i++) {
                var item = lst[i];
                if (!item.state)
                    continue;
                if (this.getGroupState(item.type))
                    sum += parseInt(item[field], 10);
            }
            return sum;
        }
    },
    created: function () {
        this.model = {
            tree: null,
            data: null,
            dataAll: null,
            dcol: 4,//调度单位列
            gcol: 3,//电网列
            rcol: 5,//投运时间列
            ecol: 8,//退运时间列
            capcol: 2,//容量列
            tcol: 10,//类型列
            pstype: "",
            types: null,
            init: function (callback) {
                if (this.tree) {
                    callback();
                    return;
                }
                if (ModelList.grids) {
                    this.tree = ModelList.grids.tree;
                    callback();
                    return;
                }
                var _this = this;
                window.setTimeout(function () { _this.init(callback) }, 500);
                /*
                PDP.read("SGC", "sgc/plant:GetPwrGrid", [], function (grid) {
                    if (!grid.check("获取电网结构", true))
                        return;
                    _this.tree = Ysh.Array.toTree(grid.value, 0, 2);
                    callback();
                });*/
            },
            getByGrid: function (lst, g) {
                if (!g)
                    return lst;
                var node = this.tree.find("0101" + g.substr(4));
                if (node != null) {
                    var ds = [];
                    var temp = {};
                    for (var i = 0; i < lst.length; i++) {
                        var row = lst[i];
                        var gridid = row[this.gcol];
                        if (!gridid)
                            continue;
                        if (node.contains(gridid))
                            ds.push(row);
                    }
                    return ds;
                }
            },
            getListByTime: function (lst, f) {
                var ds = [];
                for (var i = 0; i < lst.length; i++) {
                    var row = lst[i];
                    if (f(row))
                        ds.push(row);
                }
                return ds;
            },
            refreshStation: function (typename, f) {
                this.pstype = typename;
                var o = this;
                this.init(function () {
                    var main = vMain;
                    var args = main.getDefaultArgs("statistics");
                    var dccid = SelectCityInst.locateid;
                    var isOutZone = userSettings.itemShowInNet.value;
                    var d = (isOutZone == "1" ? "" : dccid);
                    var type = args.s;
                    var voltages = (args.v || []).join();
                    $.ajax({
                        url: "/conn/ashx/AskHandler.ashx?m=Read2&conn=SGC&xml=sgc/yanshi:GetAllStationList",
                        dataType: "json",
                        type: "post",
                        data: {},
                        async: true,
                        success: function (data) {
                            if (data.length != 2)
                                return;
                            if (!data[0])
                                return;
                            o.dataAll = o.getByGrid(data[1], d);
                            o.filterTypes();
                            f(o.dataAll);
                        },
                        error: function (data, status, err) {
                            console.log(data.responseText);
                        }
                    });
                });
            },
            refreshPlant: function (typename, f) {
                this.pstype = typename;
                var o = this;
                this.init(function () {
                    var main = vMain;
                    var args = main.getDefaultArgs("statistics");
                    var dccid = SelectCityInst.locateid;
                    var isOutZone = userSettings.itemShowInNet.value;
                    var d = (isOutZone == "1" ? "" : dccid);
                    var type = args.p;
                    var voltages = (args.v || []).join();
                    $.ajax({
                        url: "/conn/ashx/AskHandler.ashx?m=Read2&conn=SGC&xml=sgc/yanshi:GetAllPlantList",
                        dataType: "json",
                        type: "post",
                        data: {},
                        async: true,
                        success: function (data) {
                            if (data.length != 2)
                                return;
                            if (!data[0])
                                return;
                            o.dataAll = o.getByGrid(data[1], d);
                            o.filterTypes();
                            f(o.dataAll);
                        },
                        error: function (data, status, err) {
                            console.log(data.responseText);
                        }
                    });
                });
            },
            getCapacity: function (lst) {
                var cap = 0.0;
                for (var i = 0; i < lst.length; i++) {
                    var c = lst[i][this.capcol];
                    if (!c)
                        continue;
                    cap += parseFloat(c);
                }
                return parseInt(cap, 10);
            },
            refreshTime: function (tm, f) {
                var _this = this;
                this.init(function () {
                    if (!_this.data) return;
                    var main = vMain
                    var timetype = main.sectiontype;
                    var rcol = _this.rcol;
                    var tcol = _this.tcol;
                    var types = _this.types;
                    var data = _this.getListByTime(_this.data, function (row) {
                        var tmThis = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(Ysh.Time.parseDate(row[rcol])), timetype));
                        return tmThis == tm;
                    });
                    var str = Ysh.Time.formatString(tm, Ysh.Time.getTypeFormat(timetype, "1"));
                    if (data.length == 0)
                        str += "没有投运" + _this.pstype;
                    else
                        str += "投运了" + data.length + "座" + _this.pstype + "，总容量：" + _this.getCapacity(data) + "MW";
                    f({ content: str });
                });
            },
            getSummary: function (st, et) {
                //当前容量xxxMW，20xx年增长量最大（xxMW），20xx年增长最快（xx%）。
                var fGetTime = function (tm) { if (!tm) return ""; return tm.split('-')[0]; };
                st = fGetTime(st);
                et = fGetTime(et);
                var ydata = SGCTime.getCapGroupByTime(this.data, this.rcol, this.ecol, this.capcol, fGetTime);
                var curCap = "", maxAdd = null, maxAddRate = null;
                var prev = 0;
                for (var i = 0; i < ydata.length; i++) {
                    var d = ydata[i];
                    var tm = d[0];
                    var v = d[1];
                    if (!prev) {
                        prev = v;
                        continue;
                    }
                    if (tm > et)
                        break;
                    if (tm == et)
                        curCap = v;
                    if (tm < st) {
                        prev = v;
                        continue;
                    }
                    var add = v - prev;
                    if (maxAdd == null) {
                        maxAdd = [tm, add];
                    } else {
                        if (maxAdd[1] < add)
                            maxAdd = [tm, add];
                    }
                    var addrate = add / prev;
                    if (maxAddRate == null) {
                        maxAddRate = [tm, addrate];
                    } else {
                        if (maxAddRate[1] < addrate)
                            maxAddRate = [tm, addrate];
                    }
                    prev = v;
                }
                if ((null == maxAdd) || (null == maxAddRate))
                    return "";
                return "当前容量" + curCap + "MW," + maxAdd[0] + "年增长最多（" + maxAdd[1] + "MW）," + maxAddRate[0] + "年增长最快（" + parseInt(maxAddRate[1] * 100) + "%）";
            },
            filterTypes: function () {
                if (!this.types)
                    this.data = this.dataAll;
                else {
                    var data = [];
                    var types = this.types;
                    var tcol = this.tcol;
                    for (var r = 0; r < this.dataAll.length; r++) {
                        var row = this.dataAll[r];
                        if (types) {
                            var b = false;
                            var t = row[tcol];
                            for (var i = 0; i < types.length; i++) {
                                if (types[i] == t) {
                                    b = true;
                                    break;
                                }
                            }
                            if (!b)
                                continue;
                        }
                        data.push(row);
                    }
                    this.data = data;
                }
            }
        }
        var types = this.getTypes();
        window.ys_types = types;
        this.kuangState = !this.title;
    },
    watch: {
        show: function () {
            if (this.loaded) return;
            var vm = this;
            PDP.read("SGC", this.getCurTypeStatSQL(), [], function (data) {
                if (!data.check("获取统计数据", true))
                    return;
                data = data.value;
                vm.curStat = data;
                vm.changeCurStat();
                vm.loaded = true;
            });
        }
    }
}

Vue.component("ys-plant", {
    mixins: [YanshiBase],
    data: function () {
        return {
            ystypes: [
                { type: 1001, state: 1, img: "/i/sgc/yanshi/huo.png", text: "火电厂" },
                { type: 1002, state: 1, img: "/i/sgc/yanshi/shui.png", text: "水电厂" },
                { type: 1003, state: 1, img: "/i/sgc/yanshi/he.png", text: "核电厂" },
                { type: 1006, state: 1, img: "/i/sgc/yanshi/chou.png", text: "抽蓄电站" },
                { type: 1004, state: 1, img: "/i/sgc/yanshi/feng.png", text: "风电场" },
                { type: 1005, state: 1, img: "/i/sgc/yanshi/guang.png", text: "光伏电站" }
            ],
            allStatistics: [
                { type: 1001, name: "火电", state: 1, img: "/i/sgc/yanshi/huo-img1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1002, name: "水电", state: 1, img: "/i/sgc/yanshi/shui-img1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1003, name: "核电", state: 1, img: "/i/sgc/yanshi/he-img1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1006, name: "抽蓄", state: 1, img: "/i/sgc/yanshi/chou-img1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1004, name: "风电", state: 1, img: "/i/sgc/yanshi/feng-img1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1005, name: "光伏", state: 1, img: "/i/sgc/yanshi/guang-img1.png", count: 0, gencount: 0, cap: 0 }
            ]
        };
    },
    computed: {
        monthPage: function () { return ""; return "/html/sgc_stat_" + (this.statType ? "monthgen" : "monthgencap") + ".html?a=" + new Date(); },
        countPage: function () { return ""; return "/html/sgc_stat_" + (this.statType ? "gencount" : "gencap") + ".html?a=" + new Date(); },
        yearPage: function () { return "/html/sgc_stat_" + (this.statType ? "yeargen" : "yeargencap") + ".html?a=" + new Date(); },
    },
    methods: {
        refreshGroup: function (item) {
            if (item) {
                if (!item.state) {
                    MapOpeInst.postMessage({ plantstationtype: item.type, locateType: 11, selstate: false });
                    return;
                }
            }
            function getTypeUrl(type) {
                if (type == "1001")
                    return "/i/sgc/yanshi/huo1.png";
                if (type == "1002")
                    return "/i/sgc/yanshi/shui1.png";
                if (type == "1003")
                    return "/i/sgc/yanshi/he1.png";
                if (type == "1004")
                    return "/i/sgc/yanshi/feng1.png";
                if (type == "1005")
                    return "/i/sgc/yanshi/guang1.png";
                if (type == "1006")
                    return "/i/sgc/yanshi/chou1.png";
                return "/i/sgc/yanshi/huo1.png";
            }
            function getImgLevel(cap) {
                cap = parseInt(cap, 10);
                if (cap > 100)
                    return 2;
                if (cap > 10)
                    return 1;
                if (cap >= 1)
                    return 0;
                return -1;
            }
            for (var i = 0; i < this.group.length; i++) {
                var g = this.group[i];
                var type = g.name[0];
                if (item) {
                    if (item.type != type)
                        continue;
                } else {
                    if (!this.getGroupState(type))
                        continue;
                }
                var items = [];
                for (var j = 0; j < g.data.length; j++) {
                    var itemSta = g.data[j];
                    var level = getImgLevel(itemSta[2]);
                    if (level < 0)
                        continue;
                    var size = (level + 1) * 3;
                    items.push({ tips: itemSta[11], longitude: itemSta[6], latitude: itemSta[7], width: size, height: size, operatedate: itemSta[5], data: {} });
                }
                MapOpeInst.postMessage({ plantstationtype: type, url: getTypeUrl(type), locateType: 11, count: 100000, locateItem: items });
            }
        },
        initPlay: function (f) {
            ProjectSGC.Map.setMode("player", "other");
            vMain.minSectionTime = Ysh.Time.toString(Ysh.Time.add('y', -10, Ysh.Time.getTimeStart(new Date(), 'y')));
            vMain.sectiontime = vMain.maxSectionTime;;
            vMain.maxSectionTime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'y'));
            var THIS = this;
            this.model.refreshPlant("发电厂", function (lst) {
                if (lst) {
                    var group = Ysh.Array.groupBy(lst, [THIS.model.tcol]);
                    THIS.group = group;
                    THIS.refreshGroup();
                }
                f();
            });
        },
        getAllTypes: function () { return [1001, 1002, 1003, 1006, 1004, 1005]; },
        getCurTypeStatSQL: function () {
            return "sgc/yanshi:GetCurPlantTypeStat";
        }
    },
    template: `<div style="width:100%;height:100%;position:relative" v-show="show">
        <div class="ys ys-caption" :style="{ 'font-size':(title?'29px':''),'line-height':(title?'69px':'') }">{{title||'国家电网电源概况'}}</div>
        <div class="ys ys-sub" v-if="!title">发电厂地区分布</div>
        <div v-show="model.data&&(!title)" class="ys ys-player-button" :style="{'background-image':'url('+playerBtnImage+')'}" v-on:click="clickPlayerButton">
            <div class="ys-button-text"> {{ this.showPlayer?"当前概况":"发展历程" }} </div>
        </div>
        <div class="ys ys-legend-content">
            <div v-for="item in ystypes" v-on:click="changeTypeState(item)" :style="{ color:(item.state?'':'gray') }" style="cursor:pointer">
                <img :src="item.img" />{{item.text}}
            </div>
        </div>
        <div class="ys ys-statistics" v-show="(kuangState==1)&&(!title)">
            <span class="ys-statistics-caption" v-on:click="kuangState=0">发电规模统计</span>
            <div class="ys-statistics-box">
                <img class="ys-statistics-up" v-show="sPage==-1" src="/i/sgc/yanshi/up.png" v-on:click="sPage--" />
                <img class="ys-statistics-down" v-show="sPage==-1" src="/i/sgc/yanshi/down.png" v-on:click="sPage++" />
                <div v-for="item in currShowStatistics" class="ys-statistics-block">
                    <img class="ys-statistics-block-bkimg" :src="item.img" />
                    <img class="ys-statistics-block-select" :src="item.state?'/i/sgc/yanshi/selected.png':'/i/sgc/yanshi/noselected.png'" v-on:click="item.state=1-item.state" />
                    <span class="ys-statistics-block-name" v-if="false"> {{item.name}} </span>
                    <div class="ys-statistics-content">
                        <div class="ys-statistics-content-row"><div class="ys-statistics-content-name">电厂（座）</div><div class="ys-statistics-content-value">{{item.count}}</div></div>
                        <div class="ys-statistics-content-row"><div class="ys-statistics-content-name">机组（台）</div><div class="ys-statistics-content-value">{{item.gencount}}</div></div>
                        <div class="ys-statistics-content-row"><div class="ys-statistics-content-name"><div>装机容量</div><div>（万千瓦）</div></div><div class="ys-statistics-content-value">{{item.cap}}</div></div>
                    </div>
                </div>
            </div>
            <div class="ys-statistics-sum">
                <div class="ys-statistics-sum-item ys-statistics-sum-value" style="width:60px">合计</div>
                <div class="ys-statistics-sum-item" style="width:90px">
                    <div class="ys-statistics-sum-title">电厂（座）</div>
                    <div class="ys-statistics-sum-value">{{sumPlantCount}}</div>
                </div>
                <div class="ys-statistics-sum-item" style="width:110px">
                    <div class="ys-statistics-sum-title">机组（台）</div>
                    <div class="ys-statistics-sum-value">{{sumGenCount}}</div>
                </div>
                <div class="ys-statistics-sum-item" style="width:130px">
                    <div class="ys-statistics-sum-title">装机容量（万千瓦）</div>
                    <div class="ys-statistics-sum-value">{{sumCap}}</div>
                </div>
            </div>
        </div>
        <div class="ys ys-statistics-bar" v-show="(kuangState!=1)&&(!title)">
            <span class="ys-statistics-caption" v-on:click="kuangState=1">发电规模统计</span>
        </div>
        <div class="ys" :style="sMonthGenCount" v-show="!showPlayer" v-movable="2" v-if="false">
            <div class="ys-chart-box"><iframe msg="1" style="width:100%;height:100%" :src="monthPage"></iframe></div>
            <img class="ys-chart-circle1" src="/i/sgc/yanshi/yuanquan.png" />
        </div>
        <div class="ys" :style="sGenCount" v-show="!showPlayer" v-movable="2" v-if="false">
            <div class="ys-chart-box"><iframe msg="1" style="width:100%;height:100%" :src="countPage"></iframe></div>
            <img class="ys-chart-circle1" src="/i/sgc/yanshi/yuanquan.png" />
        </div>
        <div class="ys" :style="sYearGenCount" v-show="!showPlayer" v-if="show" v-movable="2">
            <div class="ys-chart-box"><iframe msg="1" style="width:100%;height:100%" :src="yearPage"></iframe></div>
            <img class="ys-chart-circle1" src="/i/sgc/yanshi/yuanquan.png" />
            <div class="ys ys-legend" style="background-image:url(/i/sgc/yanshi/legendbk-s.png);width:371px;top:-50px;left:50px">
                <span class="ys-legend-left" style="font-size:16px;width:120px;margin-left:15px;" :style="{ color:this.statType?'#2fdef6':''}" v-on:click="statType=1">机组台数（台）</span>
                <span class="ys-legend-right" style="font-size:16px;width:160px;margin-right:35px;" :style="{ color:this.statType?'':'#2fdef6'}" v-on:click="statType=0">机组容量（万千瓦）</span>
            </div>
        </div>
    </div>`
});

Vue.component("ys-station", {
    mixins: [YanshiBase],
    data: function () {
        return {
            ystypes: [
                { type: 1001, state: 1, img: "/i/sgc/yanshi/1000kv.png", text: "1000kV" },
                { type: 1002, state: 1, img: "/i/sgc/yanshi/750kv.png", text: "750kV" },
                { type: 1003, state: 1, img: "/i/sgc/yanshi/500kv.png", text: "500kV" },
                { type: 1004, state: 1, img: "/i/sgc/yanshi/330kv.png", text: "330kV" },
                { type: 1005, state: 1, img: "/i/sgc/yanshi/220kv.png", text: "220kV" },
                { type: 1006, state: 1, img: "/i/sgc/yanshi/110kv.png", text: "110kV" },
                { type: 1007, state: 1, img: "/i/sgc/yanshi/66kv.png", text: "66kV" },
                { type: 1008, state: 0, img: "/i/sgc/yanshi/35kv.png", text: "35kV" }
            ],
            allStatistics: [
                { type: 1001, name: "1000kV", state: 1, img: "/i/sgc/yanshi/station1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1002, name: "750kV", state: 1, img: "/i/sgc/yanshi/station1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1003, name: "500kV", state: 1, img: "/i/sgc/yanshi/station1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1004, name: "330kV", state: 1, img: "/i/sgc/yanshi/station1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1005, name: "220kV", state: 1, img: "/i/sgc/yanshi/station1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1006, name: "110kV", state: 1, img: "/i/sgc/yanshi/station1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1007, name: "66kV", state: 1, img: "/i/sgc/yanshi/station1.png", count: 0, gencount: 0, cap: 0 },
                { type: 1008, name: "35kV", state: 1, img: "/i/sgc/yanshi/station1.png", count: 0, gencount: 0, cap: 0 }
            ]
        };
    },
    computed: {
        monthPage: function () { return "/html/sgc_stat_" + (this.statType ? "monthtrans" : "monthtranscap") + ".html?a=" + new Date(); },
        countPage: function () { return "/html/sgc_stat_" + (this.statType ? "transcount" : "transcap") + ".html?a=" + new Date(); },
        yearPage: function () { return "/html/sgc_stat_" + (this.statType ? "yeartrans" : "yeartranscap") + ".html?a=" + new Date(); }
    },
    methods: {
        refreshGroup: function (item) {
            if (item) {
                if (!item.state) {
                    MapOpeInst.postMessage({ plantstationtype: item.type, locateType: 11, selstate: false });
                    return;
                }
            }
            function getTypeUrl(type) {
                if (type == "1001")
                    return "/i/sgc/yanshi/1000kvy.png";
                if (type == "1002")
                    return "/i/sgc/yanshi/750kvy.png";
                if (type == "1003")
                    return "/i/sgc/yanshi/500kvy.png";
                if (type == "1004")
                    return "/i/sgc/yanshi/330kvy.png";
                if (type == "1005")
                    return "/i/sgc/yanshi/220kvy.png";
                if (type == "1006")
                    return "/i/sgc/yanshi/110kvy.png";
                if (type == "1007")
                    return "/i/sgc/yanshi/66kvy.png";
                if (type == "1008")
                    return "/i/sgc/yanshi/35kvy.png";
                return "/i/sgc/yanshi/huo1.png";
            }
            function getImgLevel(cap) {
                cap = parseInt(cap, 10);
                if (cap > 100)
                    return 2;
                if (cap > 10)
                    return 1;
                return 0;
            }
            for (var i = 0; i < this.group.length; i++) {
                var g = this.group[i];
                var type = g.name[0];
                if (item) {
                    if (item.type != type)
                        continue;
                } else {
                    if (!this.getGroupState(type))
                        continue;
                }
                var items = [];
                for (var j = 0; j < g.data.length; j++) {
                    var itemSta = g.data[j];
                    var size = 6;//(getImgLevel(itemSta[2]) + 1) * 3;
                    items.push({ tips: itemSta[11], longitude: itemSta[6], latitude: itemSta[7], width: size, height: size, operatedate: itemSta[5], data: {} });
                }
                MapOpeInst.postMessage({ plantstationtype: type, url: getTypeUrl(type), locateType: 11, count: 100000, locateItem: items });
            }
        },
        initPlay: function (f) {
            ProjectSGC.Map.setMode("player", "other");
            vMain.minSectionTime = Ysh.Time.toString(Ysh.Time.add('y', -10, Ysh.Time.getTimeStart(new Date(), 'y')));
            vMain.maxSectionTime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'y'));
            vMain.sectiontime = vMain.maxSectionTime;
            var THIS = this;
            this.model.refreshStation("变电站", function (lst) {
                if (lst) {
                    var group = Ysh.Array.groupBy(lst, [THIS.model.tcol]);
                    THIS.group = group;
                    THIS.refreshGroup();
                }
                f();
            });
        },
        getAllTypes: function () { return [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008]; },
        getCurTypeStatSQL: function () {
            return "sgc/yanshi:GetCurStationTypeStat";
        }
    },
    template: `<div style="width:100%;height:100%;position:relative" v-show="show">
        <div class="ys ys-caption"> {{title||'国家电网变电概况'}}</div>
        <div class="ys ys-sub" v-if="!title">变电站地区分布</div>
        <div v-show="model.data&&(!title)" class="ys ys-player-button" :style="{'background-image':'url('+playerBtnImage+')'}" v-on:click="clickPlayerButton">
            <div class="ys-button-text"> {{ this.showPlayer?"当前概况":"发展历程" }} </div>
        </div>
        <div class="ys ys-legend-content">
            <div v-for="item in ystypes" v-on:click="changeTypeState(item)" :style="{ color:(item.state?'':'gray') }" style="cursor:pointer">
                <img :src="item.img" />{{item.text}}
            </div>
        </div>
        <div class="ys ys-statistics" v-show="(kuangState==1)&&(!title)">
            <span class="ys-statistics-caption" v-on:click="kuangState=0">变电规模统计</span>
            <div class="ys-statistics-box">
                <img class="ys-statistics-up" v-show="(allShowStatistics.length>6)&&(sPage==1)" src="/i/sgc/yanshi/up.png" v-on:click="sPage--" />
                <img class="ys-statistics-down" v-show="(allShowStatistics.length>6)&&(sPage==0)" src="/i/sgc/yanshi/down.png" v-on:click="sPage++" />
                <div v-for="item in currShowStatistics" class="ys-statistics-block-s">
                    <img class="ys-statistics-block-bkimg" :src="item.img" />
                    <img class="ys-statistics-block-select" :src="item.state?'/i/sgc/yanshi/selected.png':'/i/sgc/yanshi/noselected.png'" v-on:click="item.state=1-item.state" />
                    <span class="ys-statistics-block-name"> {{item.name}} </span>
                    <div class="ys-statistics-content">
                        <div class="ys-statistics-content-row"><div class="ys-statistics-content-name">变电站（座）</div><div class="ys-statistics-content-value">{{item.count}}</div></div>
                        <div class="ys-statistics-content-row"><div class="ys-statistics-content-name">变压器（台）</div><div class="ys-statistics-content-value">{{item.gencount}}</div></div>
                        <div class="ys-statistics-content-row"><div class="ys-statistics-content-name"><div>变电容量</div><div>（万千瓦）</div></div><div class="ys-statistics-content-value">{{item.cap}}</div></div>
                    </div>
                </div>
            </div>
            <div class="ys-statistics-sum">
                <div class="ys-statistics-sum-item ys-statistics-sum-value" style="width:60px">合计</div>
                <div class="ys-statistics-sum-item" style="width:90px">
                    <div class="ys-statistics-sum-title">变电站（座）</div>
                    <div class="ys-statistics-sum-value">{{sumPlantCount}}</div>
                </div>
                <div class="ys-statistics-sum-item" style="width:110px">
                    <div class="ys-statistics-sum-title">变压器（台）</div>
                    <div class="ys-statistics-sum-value">{{sumGenCount}}</div>
                </div>
                <div class="ys-statistics-sum-item" style="width:130px">
                    <div class="ys-statistics-sum-title">变电容量（万千瓦）</div>
                    <div class="ys-statistics-sum-value">{{sumCap}}</div>
                </div>
            </div>
        </div>
        <div class="ys ys-statistics-bar" v-show="(kuangState!=1)&&(!title)">
            <span class="ys-statistics-caption" v-on:click="kuangState=1">变电规模统计</span>
        </div>
        <div class="ys" :style="sMonthGenCount" v-show="!showPlayer" v-movable="2" v-if="false">
            <div class="ys-chart-box"><iframe msg="1" style="width:100%;height:100%" :src="monthPage"></iframe></div>
            <img class="ys-chart-circle1" src="/i/sgc/yanshi/yuanquan.png" />
        </div>
        <div class="ys" :style="sGenCount" v-show="!showPlayer" v-movable="2" v-if="false">
            <div class="ys-chart-box"><iframe msg="1" style="width:100%;height:100%" :src="countPage"></iframe></div>
            <img class="ys-chart-circle1" src="/i/sgc/yanshi/yuanquan.png" />
        </div>
        <div class="ys" :style="sYearGenCount" v-show="!showPlayer" v-if="show" v-movable="2">
            <div class="ys-chart-box"><iframe msg="1" style="width:100%;height:100%" :src="yearPage"></iframe></div>
            <img class="ys-chart-circle1" src="/i/sgc/yanshi/yuanquan.png" />
            <div class="ys ys-legend" style="background-image:url(/i/sgc/yanshi/legendbk-s.png);width:371px;top:-50px;left:50px">
                <span class="ys-legend-left" style="font-size:16px;width:120px;margin-left:15px;" :style="{ color:this.statType?'#2fdef6':''}" v-on:click="statType=1">变压器（台）</span>
                <span class="ys-legend-right" style="font-size:16px;width:160px;margin-right:35px;" :style="{ color:this.statType?'':'#2fdef6'}" v-on:click="statType=0">变电容量（万千瓦）</span>
            </div>
        </div>
    </div>`
});

Vue.component("bottom-menu", {
    data: function () {
        return {
            title: "",
            menus: [],
            startIndex: 0,
            menusWidth: [],
            rMoving: false,
            lMoving: false
        };
    },
    computed: {
        totalWidth: function () {
            var w = 0;
            for (var i = 0; i < this.menusWidth.length; i++)
                w += this.menusWidth[i];
            return w + 4;
        },
        title1: function () {
            return this.title.toString().split(" ")[0];
        },
        title2: function () {
            var arr = this.title.toString().split(" ");
            if (arr.length > 1)
                return arr[1];
            return "";
        }
    },
    methods: {
        clickMenu: function (item) {
            item.click();
            this.$el.style.display = "none";
        },
        mouseOver: function (item) {
            item.imgUrl = item.imgUrl.replace(".png", "_active.png");
            item.txtClass += " divText-active";
        },
        mouseOut: function (item) {
            item.imgUrl = item.imgUrl.replace("_active.png", ".png");
            item.txtClass = item.txtClass.replace(" divText-active", "");
        },
        moveLeft: function () {
            this.lMoving = true;
            this.doMove(true);
        },
        setOnError: function (item) {
            return "if (this.src.indexOf('" + item.imgDef + "') < 0);this.src='" + item.imgDef + "';";
        },
        doMove: function (lr) {
            if (lr) {
                if (!this.lMoving)
                    return;
            } else {
                if (!this.rMoving)
                    return;
            }
            var pos = Math.ceil(this.$el.children[2].scrollLeft);// += (lr ? -220 : 220);
            var nextPos = 0;
            var c = 0;
            for (var i = 0; i < this.menusWidth.length; i++) {
                var w = this.menusWidth[i];
                if (lr) {
                    if (c + w >= pos) {
                        break;
                    }
                } else {
                    if (c + w > pos) {
                        nextPos = c + w;
                        break;
                    }
                }
                c += w;
                nextPos = c;
            }
            this.$el.children[2].scrollLeft = nextPos;

            var vm = this;
            window.setTimeout(function () { vm.doMove(lr) }, 500);
        },
        moveRight: function () {
            this.rMoving = true;
            this.doMove(false);
        },
        stopMoveRight: function () {
            this.rMoving = false;
        },
        stopMoveLeft: function () {
            this.lMoving = false;
        }
    },
    watch: {
        menus: function () {
            var vm = this;
            var el = this.$el;
            this.$nextTick(function () {
                var p = el.children[2].children[0];
                var arrWidth = [];
                for (var i = 0; i < p.children.length; i++)
                    arrWidth.push(p.children[i].offsetWidth);
                vm.menusWidth = arrWidth;
            })
        }
    },
    template: `<div id="divBottomMenu">
            <div id="divBottomMenuTitle">
                {{ title1 }}
                <br />
                {{ title2 }}
            </div>
            <div class="leftArrow" v-on:mouseover="moveLeft" v-on:mouseout="stopMoveLeft"><</div>
            <div id="divContentScroll" class="contentScroll">
                <div id="divBottomMenuContent" :style="{ width:totalWidth + 'px' }" class="content">
                    <div v-for="item in menus" class='item' v-on:click="clickMenu(item)" v-on:mouseover="mouseOver(item)" v-on:mouseout="mouseOut(item)"><img :src='item.imgUrl' :onerror='setOnError(item)' /><div :class="item.txtClass"> {{ item.imgText }} </div></div>
                </div>
            </div>
            <div class="rightArrow" v-on:mouseover="moveRight" v-on:mouseout="stopMoveRight">></div>
        </div>`
});

Vue.component("foldtitlebar", {
    props: { "value": { type: Boolean, "default": false }, "name": { type: String, "default": "" }, "stop": { type: Boolean, "default": false }, "more": { type: Boolean, "default": false } },
    methods: { click: function () { if (this.stop) return; this.$emit('input', !this.value); }, showMore: function () { this.$emit('show-more'); } },
    template: `<div :class="value ? 'title-active' : 'title'" v-on:click="click">
        <span class="titleText">{{name}}</span>
        <img class="titleImg" :src="value ? '/i/sgc/up.png' : '/i/sgc/down.png'" v-if="!stop" />
        <a v-if="more" style="position:absolute;right:6px;top:6px;" v-on:click="showMore">更多</a>
    </div>`
});

Vue.component("onoffgroup", {
    template1: `
    <div class="content" style="font-size: 0;" v-if="value">
        <slot></slot>
        <div v-for="item in all" class="item" style="text-align:left;padding-left:10px;" v-if="!item.isHide">
            <img alt="" :src="getImageUrl(item)" :on="item.on" v-on:click="click(item)" />{{item.name}}
        </div>
    </div>
    <div class="contentSelect" v-else-if="selected.length > 0">
        <slot></slot>
        <div v-for="item in selected" class="item" style="text-align:left;padding-left:10px;" v-if="!item.isHide">
            <img alt="" :src="getImageUrl(item)" :on="item.on" v-on:click="click(item)" />{{item.name}}
        </div>
    </div>`,
    template: `<div><div v-for="item in all" v-if="!item.isHide">
        <slot v-if="item.slot" :name="item.slot"></slot>
         <div class="content" v-else>
            <div class="optionText">{{ item.name }}</div>
            <div class="options">
                <img alt="" :src="getImageUrl(item)" :on="item.on" v-on:click="click(item)" />
            </div>
        </div>
        </div></div>`,
    props: { "value": { type: Boolean, "default": false }, "all": { type: Array }, "selected": { type: Array } },
    methods: {
        getImageUrl: function (item) { return item.on == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png"; },
        click: function (item) { this.$emit('click', item); }
    }
});

Vue.component("cbgroup", {
    template: `
    <div class="content" v-if="value">
        <div class="itemCheckbox" v-for="item in all" v-on:click="click(item)" style="position:relative">
            <div style="width:100%;height:100%;z-index:99999;position:absolute"></div>
            <input type="checkbox" name="vol" value="item.value" v-model="item.checked" />&nbsp;{{item.text}}
        </div>
    </div>
    <div class="contentSelect" v-else-if="selected.length > 0">
        <div class="itemCheckbox" v-for="item in selected" v-on:click="click(item)">
            <input type="checkbox" name="vol" value="item.value" v-model="item.checked" />&nbsp;{{item.text}}
        </div>
    </div>`,
    props: { "value": { type: Boolean, "default": false }, "all": { type: Array }, "selected": { type: Array } },
    methods: { click: function (item) { this.$emit('click', item); } }
});

Vue.component("setting-item", {
    template: `
    <setting-group v-if="item.type=='group'" :item="item" v-on:on-change="$emit('on-change')"></setting-group>
    <div v-else class="content">
        <div class="optionText">{{ item.name }}</div>
        <div class="options">
            <img v-if="item.type=='onoff'" alt="" :src="img" v-on:click="click" />
            <div v-else-if="item.type=='input'"><input-number v-on:on-change="$emit('on-change')" v-model="item.value" size="small" :disabled="item.disabled" style="height:25px;width:60px;text-align:right" :min="item.min" :max="item.max"></input-number>{{item.unit}}</div>
            <div v-else-if="item.type=='percent'">
                <input type="button" value="-" style="width:30px" v-on:click="changePercent(item,false)" />
                <span style="padding:0 10px">{{getPercent(item.value) }}</span>
                <input type="button" value="+" style="width:30px"  v-on:click="changePercent(item,true)" />
            </div>
            <div v-else-if="item.type=='pixel'">
                <input-number v-on:on-change="$emit('on-change')" v-model="item.value" size="small" :disabled="item.disabled" style="height:25px;width:45px;text-align:right" :min="item.min" :max="item.max"></input-number>{{item.unit}}
                <div style="display:inline-block;background-color:black;width:20px" :style="{height:item.value+'px'}"></div>
            </div>
            <select v-else-if="item.type=='list'" v-model="item.value" :disabled="item.disabled" v-on:change="$emit('on-change')">
                <option v-for="(value, key) in getOptions()" :value="key">{{ value }}</option>
            </select>
            <i-switch v-else-if="item.type=='switch1'" v-on:on-change="$emit('on-change')" v-model="item.value" :disabled="item.disabled" :true-value="getOn()" :false-value="getOff()" style="width:100px">
                <span slot="open">{{getOnName()}}</span>
                <span slot="close">{{getOffName()}}</span>
            </i-switch>
            <span v-else-if="item.type=='switch'">
            </span>
        </div>
    </div>`
    , props: ["item"]
    , computed: {
        img: function () { return this.item.value == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png"; }
    }
    , methods: {
        click: function () {
            if (this.item.disabled) return; this.item.value = (this.item.value == "1") ? "0" : "1";
            this.$emit("on-change");
        }
        , getOptions: function () {
            var options = {};
            var arr = this.item.options.split(',');
            for (var i = 0; i < arr.length; i += 2)
                options[arr[i]] = arr[i + 1];
            return options;
        }, getOn: function () { return this.item.options.split(',')[2]; }
        , getOff: function () { return this.item.options.split(',')[0]; }
        , getOnName: function () { return this.item.options.split(',')[3]; }
        , getOffName: function () { return this.item.options.split(',')[1]; }
        , changePercent: function (item, isAdd) {
            var v = parseFloat(item.value);
            v = (isAdd ? v + 0.1 : v - 0.1);
            if ((v < 0.49) || (v > 2.01)) return;
            item.value = v;
            this.$emit("on-change");
        }
        , getPercent: function (v) {
            return parseInt(parseFloat(v) * 100, 10) + "%";
        }
    }
});

Vue.component("setting-group", {
    template: `
    <div style="position:relative">
        <div :class="css" v-on:click="click">
            <span class="titleText"> {{ item.name }} </span>
            <img class="titleImg" :src="img" />
        </div>
        <setting-item v-show="showSub" v-for="child in item.children" :item="child" v-on:on-change="$emit('on-change')"></setting-item>
    </div>`
    , props: ["item"]
    , data: function () {
        return { showSub: false };
    }, computed: {
        img: function () { return this.showSub ? '/i/sgc/up.png' : '/i/sgc/down.png' }
        , css: function () { return this.showSub ? 'title-active' : 'title' }
    }, methods: {
        click: function () {
            this.showSub = !this.showSub;
        }
    }
});

var menuData = new Vue({
    data: {
        voltages: [],
        dcs: [],
        acs: [],
        plantTypes: [{ value: 1001, text: "火电", checked: false }, { value: 1002, text: "水电", checked: false }, { value: 1003, text: "核电", checked: false }, { value: 1004, text: "风电", checked: false },
        { value: 1005, text: "光伏", checked: false }, { value: 1006, text: "抽蓄", checked: false }, { value: 1007, text: "风光一体", checked: false }, { value: 1008, text: "光热一体", checked: false }],
        stationTypes: [{ value: 2001, text: "变电站", checked: false }, { value: 2002, text: "开关站", checked: false }, { value: 2003, text: "牵引站", checked: false }, { value: 2004, text: "串补站", checked: false },
        { value: 3001, text: "换流站", checked: false }, { value: 3002, text: "直流接地站", checked: false }, { value: 2005, text: "风电汇集站", checked: false }, { value: 2006, text: "光伏汇集站", checked: false }],
        dictPs: {},
        selectedPs: [],
        selectedVols: [],
        lockType: 0,
        prevTypes: [],
        prevVoltages: [],
        lastSettings: {
            voltage: "",
            stations: "",
            plants: "",
            states: "",
            grid: "",
            changed: false,
            backup: function (f, v) {
                if (this[f] == v)
                    return;
                this[f] = v;
                this.changed = true;
            }
        },
        changeMode: 0//0 - 换场景时全选电压等级，1 - 换场景时电压等级不变, 2 - 换场景类型时全选电压等级，类型不变时不变
    },
    computed: {
        selectPlantTypes: function () {
            return Ysh.Array.pick(this.plantTypes, "checked", true);
        },
        selectStationTypes: function () {
            return Ysh.Array.pick(this.stationTypes, "checked", true);
        }
    },
    methods: {
        changeLockState: function (s) {
            this.lockType = s;
        },
        getPlantStationByItem: function (code) { return this.dictPs[code]; },
        getPlantStationByItems: function (arr) {
            var ret = [];
            for (var i = 0; i < arr.length; i++) {
                ret.push(this.dictPs[arr[i]]);
            }
            return ret;
        },
        getSelectedPlantStations: function (type) {
            var arr = [];
            if (type != 1)
                for (var i = 0; i < this.selectPlantTypes.length; i++)
                    arr.push(this.selectPlantTypes[i].value);
            if (type != 2)
                for (var i = 0; i < this.selectStationTypes.length; i++)
                    arr.push(this.selectStationTypes[i].value);
            return arr;
        },
        getSelectedVoltageCodes: function () {
            var vols = [];
            for (var i = 0; i < this.voltages.length; i++) {
                var v = this.voltages[i];
                if (v.selected)
                    vols.push(v.key.toString());
            }
            return vols;
        },
        filterByVoltages: function (items, vols) {
            var ret = [];
            if (!vols) {
                vols = this.getSelectedVoltageCodes();
                if (vols.length == 0)
                    return ret;
            }
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (vols.indexOf(item.code) >= 0)
                    ret.push(item);
            }
            return ret;
        },
        appendInDict: function (dict, lst, field) {
            for (var i = 0; i < lst.length; i++) {
                var item = lst[i];
                dict[item[field]] = item;
            }
        }, selectPlantStation: function (code) {
            if (code == -1) {
                for (var i = 0; i < this.plantTypes.length; i++)
                    this.plantTypes[i].checked = false;
                for (var i = 0; i < this.stationTypes.length; i++)
                    this.stationTypes[i].checked = true;

            } else if (code == -2) {
                for (var i = 0; i < this.plantTypes.length; i++)
                    this.plantTypes[i].checked = true;
                for (var i = 0; i < this.stationTypes.length; i++)
                    this.stationTypes[i].checked = false;
            } else {
                for (var i = 0; i < this.plantTypes.length; i++)
                    this.plantTypes[i].checked = false;
                for (var i = 0; i < this.stationTypes.length; i++)
                    this.stationTypes[i].checked = false;
                (this.dictPs[code] || {}).checked = true;
            }
        },
        setOtherModeVoltage: function (voltages) {
            //比较两个不同，是加还是减
            for (var i = 0; i < this.prevVoltages.length; i++) {
                var v = this.prevVoltages[i];
                if (voltages.indexOf(v) < 0) {
                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'RemoveStationLineByProperty', selstate: true, data: { code: v } });
                }
            }
            var arrAdded = [];
            for (var i = 0; i < voltages.length; i++) {
                var v = voltages[i];
                if (this.prevVoltages.indexOf(v) < 0) {
                    arrAdded.push(v);
                }
            }
            if (arrAdded.length > 0) {
                var vm = this;
                ModelList.getPlantStationListEx(this.prevTypes, function (items) {
                    items = vm.filterByVoltages(items, arrAdded);
                    ProjectSGC.Map.setAppName("station");
                    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineByInfo', selstate: true, data: { lstStationInfo: items, lstLineInfo: [] } });
                    vm.tellBusiness();
                });
            } else {
                this.tellBusiness();
            }
        },
        setMapOtherMode: function (types) {
            //如果选择了厂站，那么切换到对应模式
            if (types.length == 0) {
                this.selectedPs = types;
                showingMenu.restoreMainTheme();//回主模式
                this.tellBusiness();
                return;
            }
            if (this.prevTypes.length == 0) {
                ProjectSGC.Map.setMode("station", "other");
                var vm = this;
                ModelList.getPlantStationListEx(types, function (items) {
                    items = vm.filterByVoltages(items);
                    ProjectSGC.Map.setAppName("station");
                    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineByInfo', selstate: true, data: { lstStationInfo: items, lstLineInfo: [] } });
                    vm.tellBusiness();
                });
                return;
            }
            //比较两个不同，是加还是减
            for (var i = 0; i < this.prevTypes.length; i++) {
                var t = this.prevTypes[i];
                if (types.indexOf(t) < 0) {
                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'RemoveStationLineByProperty', selstate: true, data: { plantstationtype: t } });
                }
            }
            var arrAdded = [];
            for (var i = 0; i < types.length; i++) {
                var t = types[i];
                if (this.prevTypes.indexOf(t) < 0) {
                    arrAdded.push(t);
                }
            }
            if (arrAdded.length > 0) {
                var vm = this;
                ModelList.getPlantStationListEx(arrAdded, function (items) {
                    items = vm.filterByVoltages(items);
                    ProjectSGC.Map.setAppName("station");
                    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineByInfo', selstate: true, data: { lstStationInfo: items, lstLineInfo: [] } });
                    vm.tellBusiness();
                });
            } else {
                this.tellBusiness();
            }
        },
        refreshMap: function (reason) {
            var types = this.getSelectedPlantStations();
            this.refreshMapByTypesReason(types, reason);
            if (reason != "voltage")
                this.prevTypes = types;
        },
        refreshMapByTypesReason: function (types, reason) {
            if (reason == "voltage") {//换电压等级
                //看看有没有选厂站，如果没有，那么进入普通电压锁定模式
                var arr = this.getSelectedVoltageCodes();
                if (topMenuBar && topMenuBar.lock())
                    MapOpeInst.menu("ShowStationByVol", true, { code: arr });
                if (types.length == 0) {
                    this.selectedPs = types;
                    //ProjectSGC.Map.setMode("voltage", "voltage", arr);
                    this.prevVoltages = arr;
                    this.tellBusiness();
                    return;
                }
                //this.prevTypes = [];//必须全部重刷
                //this.setMapOtherMode(types);
                this.setOtherModeVoltage(arr);
                this.prevVoltages = arr;
                return;
            }
            if (types.length == 0) {
                this.selectedPs = types;
                topMenuBar.lock(false);
                showingMenu.restoreMainTheme();//回主模式
                this.tellBusiness();
                /*
                if (this.lockType == 0) {
                } else {
                    var arr = this.getSelectedVoltageCodes();
                    MapOpeInst.menu("ShowStationByVol", true, { code: arr });
                }*/
                return;
            }
            //换厂站
            /*
            if (this.lockType == 0) {//没锁的时候，取所有点数据展示
                topMenuBar.lock(true);
                for (var i = 0; i < this.voltages.length; i++)
                    this.voltages[i].selected = true;
                this.setMapOtherMode(types);
                return;
            }
            if (this.lockType == 1) { //按电压等级锁定
                showingMenu.removeGridTheme();
                this.setMapOtherMode(types);
            }*/
            if (this.selectedPs.length == 0) {
                //2020-06-22 topMenuBar.lock(true);
                /*if (!this.defineScene) {
                    for (var i = 0; i < this.voltages.length; i++)
                        this.voltages[i].selected = true;
                }*/
                this.defineScene = false;
                this.setMapOtherMode(types);
            } else {
                this.setMapOtherMode(types);
            }
            this.selectedPs = types;
        },
        restore: function () {
            for (var i = 0; i < this.plantTypes.length; i++) {
                var t = this.plantTypes[i];
                t.checked = (this.selectedPs.indexOf(t.value.toString()) >= 0);
            }
            for (var i = 0; i < this.stationTypes.length; i++) {
                var t = this.stationTypes[i];
                t.checked = (this.selectedPs.indexOf(t.value.toString()) >= 0);
            }
        },
        backup: function () {
            this.selectedPs = this.getSelectedPlantStations();
        },
        getSelecedText: function () {
            if (this.selectStationTypes.length == 1) {
                if (this.selectPlantTypes.length > 0)
                    return "电网规模";
                return this.selectStationTypes[0].text;
            }
            if (this.selectStationTypes.length > 0)
                return "电网规模";
            if (this.selectPlantTypes.length == 1)
                return this.selectPlantTypes[0].text;
            return "电网规模";
        },
        backupItem: function (f, v) {
        },
        backupSettings: function () {
            this.lastSettings.changed = false;
            this.lastSettings.backup("voltage", this.getSelectedVoltageCodes().join());
            this.lastSettings.backup("stations", this.getSelectedPlantStations(1).join());
            this.lastSettings.backup("plants", this.getSelectedPlantStations(2).join());
            var states = [];
            if (typeof showingMenu != "undefined") {
                if (showingMenu.state.list) {
                    for (var i = 0; i < showingMenu.state.list.length; i++) {
                        var item = showingMenu.state.list[i];
                        if (item && item.selected)
                            states.push(item.key);
                    }
                }
            }
            this.lastSettings.backup("states", states.join());
            this.lastSettings.backup("grid", SelectCityInst.locateid);
            return this.lastSettings.changed;
        },
        tellBusiness: function (force) {
            var b = this.backupSettings();
            if (!force) {
                if (!b)
                    return;
            }
            Ysh.Delay.exec("mapchanged", 1000, function () {/*
                    var s = menuData.getSelectedPlantStations(1);
                    var p = menuData.getSelectedPlantStations(2);
                    if ((s.length == 0) && (p.length == 0)) {
                        s = [2001, 2002, 2003, 2004, 3001, 3002, 2005, 2006];
                        p = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008];
                    }
                    var states = [];
                    for (var i = 0;i < showingMenu.state.list.length; i++) {
                        var item = showingMenu.state.list[i];
                        if (item&&item.selected)
                            states.push(item.key);
                    }
                    //showingMenu.state
                    var msg = {
                        type:"mapchanged",
                        v: menuData.getSelectedVoltageCodes()
                        , s: s
                        , p: p
                        , l: []
                        , states: states
                    };*/
                vMain.sendBusinessMsg("", { type: "mapchanged" });
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "GetPolygonInsideInfo", selstate: true });
            });
        }
    },
    created: function () {
        this.appendInDict(this.dictPs, this.plantTypes, "value");
        this.appendInDict(this.dictPs, this.stationTypes, "value");
        var vm = this;
        //PDP.read("SGC", "SearchCommonSql:GetPlantStationVoltage", [], function (data) {
        SGCDB.read("PLANTSTATIONVOLTAGE", function (data) {
            //if (!data.check("获取电压等级信息", true))
            //    return;
            function getVolValue(vol) {
                var v;
                if (vol.substr(0, 1) == "±") {
                    v = -parseInt(vol.substr(1, vol.length - 3), 10);
                } else
                    v = parseInt(vol.substr(0, vol.length - 2), 10);
                if (isNaN(v))
                    return 0;
                return v;
            }
            //data = data.value;
            var vols = [], dcs = [], acs = [];
            for (var i = 0; i < data.length; i++) {
                var vol = data[i][1];
                if (!vol.endsWith("kV"))
                    continue;
                var vv = getVolValue(vol);
                if (vv == 0)
                    continue;
                var v = { key: data[i][0], isDc: (vv < 0), value: Math.abs(vv), text: vol, selected: false };
                vols.push(v);
                ((vv < 0) ? dcs : acs).push(v);
            }
            vols.sort(function (v1, v2) { return v2.value - v1.value; });
            dcs.sort(function (v1, v2) { return v2.value - v1.value; });
            acs.sort(function (v1, v2) { return v2.value - v1.value; });
            vm.voltages = vols;
            vm.dcs = dcs;
            vm.acs = acs;
        });
        this.$watch("dictPs", function () {
            var arr = this.getSelectedPlantStations();
            if (arr.join(',') == this.selectedPs.join(','))//没变化
                return;
            var vm = this;
            this.refreshMap("plantstation", function (items) {
                if (items.length > 1000) {
                    if (!confirm("此操作将要显示" + items.length + "个厂站，显示出来可能会导致系统变慢，是否继续？")) {
                        vm.restore();
                        return false;
                    }
                }
                return true;
            });
        }, { deep: true })
    },
    watch: {
        voltages: {
            deep: true,
            handler: function () {
                if (this.lockType != 0)
                    this.refreshMap("voltage");
                else {
                    //如果不是厂站模式，那么不进行任何处理
                    if (this.getSelectedPlantStations().length > 0)
                        this.refreshMap("voltage");
                    this.tellBusiness();
                }
            }
        }
    }
});

Vue.component("iframe-group", {
    props: {
        "pages": { type: Array, "default": [] },
        "furl": {
            type: Function, "default": null
        }, "cur": {
            type: String, "default": ""
        }
    },
    data: function () {
        return {
            active: "",
            shows: []
        }
    },
    methods: {
        getFrmId: function (id) {
            return "iframeBusiness_" + id;
        },
        exists: function (id) {
            for (var i = 0; i < this.shows.length; i++) {
                if (this.shows[i][0] == id)
                    return true;
            }
            return false;
        }, create: function (m) {
            var frm = document.createElement("iframe");
            frm.id = this.getFrmId(m[0]);
            frm.style.width = "100%";
            frm.style.height = "100%";
            frm.src = this.furl(m[2], m[3]);
            frm.setAttribute("msg", "1");
            document.getElementById("divBusiness").appendChild(frm);
        }, delete: function (m) {
            var frm = document.getElementById(this.getFrmId(m[0]));
            if (!frm) return;
            $(frm).remove();
            //document.removeChild(frm);
        }, modify: function (m) {
            m = m[1];
            var frm = document.getElementById(this.getFrmId(m[0]));
            if (!frm) return;
            frm.src = this.furl(m[2], m[3]);
        }, refresh: function () {
            var arr = ProjectSGC.Array.edit(this.shows, this.pages, function (p1, p2) {
                if (p1[0] != p2[0])
                    return 0;
                return p1[4] == p2[4] ? 1 : 2;
            });
            for (var i = 0; i < arr[0].length; i++) {
                this.delete(arr[0][i]);
            }
            for (var i = 0; i < arr[1].length; i++) {
                this.modify(arr[1][i]);
            }
            for (var i = 0; i < arr[2].length; i++) {
                this.create(arr[2][i]);
            }
            /*for (var i = 0; i < this.pages.length; i++) {
                var p = this.pages[i];
                if (this.exists(p[0]))
                    continue;
                this.create(p);
            }*/
            this.shows = Ysh.Object.clone(this.pages);
        }
    },
    watch: {
        cur: {
            handler: function () {
                if (this.active)
                    $("#" + this.getFrmId(this.active)).hide();
                this.active = this.cur;
                if (this.active)
                    $("#" + this.getFrmId(this.active)).show();
            }
        },
        pages: {
            deep: true,
            handler: function () {
                this.refresh();
            }
        }
    }
});

var cityData = new Vue({
    data: {
        root: { ID: ProjectSGC.Const.GRID_GD, Name: "国家电网" },
        selected: [],
        jjt: { ID: "0101110000,0101120000,0101990901,0101999999", Name: "京津唐" },
        multi: false,
        isReady: false
    },
    computed: {
        idString: function () { return this.selected.join(); },
        textString: function () {
            var arr = [];
            for (var i = 0; i < this.selected.length; i++) {
                var id = this.selected[i];
                if (id == this.jjt.ID) {
                    arr.push(this.jjt.Name);
                    continue;
                }
                var city = this.getCity(id);
                if (null != city)
                    arr.push(this.getCityText(city));
            }
            return arr.join("、");
        }
    },
    methods: {
        init: function (data) {
            this.root.Children = data;
        },
        ready: function () {
            this.isReady = true;
        },
        getCityText: function (city) {
            if ((city.Level == 1004) || (city.Level == 1005)) {
                return this.getCityText(this.getCity(city.ParentID)) + city.Name;
            }
            return city.Name;
        },
        getTextString: function (n) {
            var str = this.textString;
            return (str.length > n) ? str.substr(0, n) : str;
        },
        findCity: function (city, id) {
            if (city.ID == id)
                return city;
            if (city == this.jjt) {
                var ids = city.ID.split(',');
                for (var c = 0; c < ids.length; c++) {
                    var scity = this.getCity(ids[c]);
                    if (scity) {
                        var fcity = this.findCity(scity, id);
                        if (fcity) return fcity;
                    }
                }
                return null;
            }
            var children = city.Children;
            if (!children) return null;
            for (var i = 0; i < children.length; i++) {
                var c = this.findCity(children[i], id);
                if (c)
                    return c;
            }
            return null;
        },
        getCity: function (id) {
            if (id == this.jjt.ID) return this.jjt;
            return this.findCity(this.root, id);
        },
        setMode: function (multi) {
            this.multi = multi;
            if (!this.multi)
                if (this.selected.length > 1)
                    this.selected = [Ysh.Array.getLast(this.selected)];
        },
        selectCity: function (id) {
            if (!this.multi) {
                if ((this.selected.length == 1) && (this.selected[0] == id))
                    return;
                this.selected = [id];
                return;
            }
            var thisCity = this.getCity(id);
            var needErase = [];
            for (var i = 0; i < this.selected.length; i++) {
                var sid = this.selected[i];
                var city = this.getCity(sid);
                if (this.findCity(city, id)) {
                    needErase.push(sid);
                    continue;
                };
                if (this.findCity(thisCity, sid)) {
                    needErase.push(sid);
                    continue;
                }
            }
            for (var i = 0; i < needErase.length; i++)
                this.selected.erase(needErase[i]);
            this.selected.addSkipSame(id);
        },
        unselectCity: function (id) {
            this.selected.erase(id);
            if (this.selected.length == 0)
                return;
            //找到上一个省级单位，然后定位它
            var id = this.selected[this.selected.length - 1];
            var city = this.getCity(id);
            if (!city)
                return;
            while (city.Level > 1003) {
                city = this.getCity(city.ParentID);
            }
            var jq = $("#selCityHotCityId").find("table").find("a[citycode=" + city.ID + "]");
            $("#tblCityPlaceListIdDD").empty();
            SelectCityInst.pID = city.ID;
            SelectCityInst.searchCity();
            $("#selCityHotCityId").find("a").attr("class", "normal");
            jq.attr("class", "selected");
        },
        locateMap: function () {
            var arr1 = this.selected;
            var arr = [];
            for (var i = 0; i < arr1.length; i++) {
                var arr2 = arr1[i].split(',');
                for (var j = 0; j < arr2.length; j++)
                    arr.addSkipSame(arr2[j]);
            }
            if (arr.length > 1) {
                var arrOwner = [];
                for (var i = 0; i < arr.length; i++)
                    arrOwner.push(arr[i].substr(4));
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "LocationArea", selstate: true, data: { arrownerid: arrOwner, Level: SelectCityInst.getCityLevel(arr[0]), padding: [0, 0, 0, 0] } });
            } else {
                var cityCode = arr[0];
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "LocationArea", selstate: true, data: { arrownerid: [cityCode.substr(4)], Level: SelectCityInst.getCityLevel(cityCode), padding: [0, 0, 0, 0] } });
                var city = SelectCityInst.findCity(SelectCityInst.data, cityCode) || { ID: "0101990100", Name: "国家电网" };
                bottomMenuInst.showLinks("Area", { id: "0101" + cityCode.substr(4), name: city.Name });
            }
            if (typeof showingMenu != "undefined")
                if (showingMenu.refreshRunningTheme)
                    showingMenu.refreshRunningTheme();
            if (typeof userSettings != "undefined")
                if (userSettings.changeInNet)
                    userSettings.changeInNet();
            if (typeof menuData != "undefined")
                if (menuData.tellBusiness)
                    menuData.tellBusiness();
            if (typeof vSelectedGrid != "undefined")
                vSelectedGrid.$forceUpdate();
        },
        getSelectedCityHtml: function () {
            if (!this.multi)
                return this.textString;
            if (this.selected.length == 1)
                return this.textString;
            var html = [];
            for (var i = 0; i < this.selected.length; i++) {
                var id = this.selected[i];
                var city = this.getCity(id);
                if (!city)
                    continue;
                html.push(this.getCityText(city) + "<img citycode='" + id + "' src='/i/sgc/close_circle.png' />");
            }
            return html.join("");
        },
        getMaxLevel: function () {
            var maxLevel = 0;
            var selected = this.selected;
            for (var i = 0; i < selected.length; i++) {
                var id = selected[i];
                var level = SelectCityInst.getCityLevel(id);
                maxLevel = Math.max(maxLevel, level || 0);
            }
            return maxLevel;
        },
        selectedChanged: function () {
            this.onGridChanged();
            if (typeof stationFilter == "undefined")
                return;
            var level = this.getMaxLevel();
            if (stationFilter.getDisplayMenu) {
                var item = stationFilter.getDisplayMenu("isShowByRegion");
                if (item) {
                    var on = "0";
                    if (level >= 1004) {
                        on = "1";
                    }
                    if (item.on != on)
                        stationFilter.clickDisplayMenu(item);
                }
            }
            if (stationFilter.bschaoliu) {
                if (stationFilter.bschaoliu.length == 0) return;
                stationFilter.setChaoliuState(true);
            }
        },
        onGridChanged: function () { }
    },
    watch: {
        selected: {
            deep: true,
            handler: function () {
                SelectCityInst.locateid = this.selected.join(",");
                this.selectedChanged();
                this.$nextTick(function () {
                    $("#SetDefCity").html(this.getSelectedCityHtml()).find("img").click(function () {
                        var jq = $(this);
                        cityData.unselectCity(jq.attr("citycode"));
                    });
                    if (topMenuBar && topMenuBar.getCity)
                        topMenuBar.getCity().text1 = this.textString;
                    if (this.isReady)
                        this.locateMap();
                    else
                        this.isReady = true;
                });
            }
        }
    },
    created: function () {
    }
});
