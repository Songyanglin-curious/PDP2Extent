
Vue.component('htimeplayer', {
    data: function () {
        return {
            state: 0, timerId: 0, display: 0, width: 0, itemWidth: 40, perWidth: 0, perStep: 1, showTime: false, start: "", drag: false, startX: 0, isDragged: false
        };
    },
    props: {
        "now": {
            "default": ""
        },
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
        }
    },
    computed: {
        startTime: function () { if (!this.start) return null; return new Date(Ysh.Time.parseDate(this.start)); },
        minTime: function () { if (!this.min) return null; return new Date(Ysh.Time.parseDate(this.min)); },
        maxTime: function () { if (!this.max) return null; return new Date(Ysh.Time.parseDate(this.max)); },
        nowTime: function () { if (!this.now) return new Date(); return new Date(Ysh.Time.parseDate(this.now)); },
        valueTime: function () { if (!this.value) return null; return new Date(Ysh.Time.parseDate(this.value)); },
        canUse: function () { if (!this.startTime) return false; if (!this.maxTime) return false; if (this.width < 1) return false; if (!this.itemWidth) return false; return true; },
        playImg: function () {
            return (this.state == 1) ? "/i/ctrl/pause.png" : "/i/ctrl/play.png";
        },
        disstyle: function () {
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
                default: return "110";
            }
        },
        typename: function () {
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
        nowPosition: function () {
            var idx = 0;
            if (this.perWidth)
                idx = Ysh.Time.diff(this.type, this.startTime, this.nowTime) / this.perStep / this.step;
            return (idx * this.perWidth - 10) + "px";
        },
        forePositionPx: function () {
            var idx = 0;
            if (this.perWidth)
                idx = Math.max(Ysh.Time.diff(this.type, this.startTime, Ysh.Time.add(this.type, 1, this.nowTime)), 0) / this.perStep / this.step;
            return idx * this.perWidth;
        }
    },
    methods: {
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
                if (start >= this.maxTime)
                    return;
                this.start = Ysh.Time.toString(start);
                this.isDragged = true;
            }
        },
        changeStartTime: function (v) {
            //this.value = v;
            if (this.value < v)
                this.value = v;
            this.$emit("startchanged", v);
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
        selectTime: function () { },
        getItemCount: function () {
            if (!this.canUse) return 0;
            var diff = Ysh.Time.diff(this.type, this.startTime, this.maxTime) / this.step;
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
        getNextValue: function (back, curTime) {
            var v = Ysh.Time.add(this.type, this.step, curTime);
            if (v > this.maxTime) {
                if (back || this.loop) {
                    v = this.startTime;
                } else {
                    return null;
                }
            }
            if (this.isEnable(v))
                return v;
            return this.getNextValue(back, v);
        },
        doPlay: function (back) {
            var v = this.getNextValue(back, this.valueTime);
            if (v === null) {
                //超出范围，停止播放
                this.state = 0;
                window.clearTimeout(this.timerId);
                this.$emit("end")
                return;
            }
            this.$emit("input", Ysh.Time.formatString(v, "111111"));
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
            if (item.value > this.nowTime) {
                //o["background-image"] = "url(/i/ctrl/player_fore_bk.png)";
            } else {
                var next = Ysh.Time.add(this.type, this.step, item.value);
                if (next > this.nowTime)
                    o["background-image"] = "url(/i/ctrl/player_now_bk.png)";
            }
            return o;
        },
        isEnable: function (tm) {
            if (!this.isvalid)
                return true;
            return this.isvalid(tm);
        }
    },
    watch: {
        type: function () { this.resetStartTime(); },
        min: function () { this.start = this.min; this.resetStartTime(); },
        value: function () {
            //this.changeValue();
            this.$emit('input', this.value);
            this.$emit('change', this.value);
        }
    },
    created: function () {
        this.start = this.min;
        this.resetStartTime();
    },
    mounted: function () {
        //this.min = "1950-01-01";
        //this.max = "2020-01-01";
        Ysh.Web.Event.attachEvent(document, "onkeydown", function () {
            if (!event) return;
            if (event.keyCode == Ysh.Key.LeftArrow) {
            } else if (event.keyCode == Ysh.Key.RightArrow) {
            }
        });
    },
    template: //'#htimeplayer_template'
        `<div class="player-border">
            <div class="player-left">
                <Poptip v-model="showTime" trigger="click" placement="top-start">
                    <img v-if="selectstart" style="width:26px;height:26px;" src="/i/ctrl/calendar.png" v-on:click="selectTime" />
                    <div slot="content" style="white-space:normal;">
                        开始时间：<date-time-ctrl v-model="start" img="none" :max="maxTime" :disstyle="disstyle" v-on:change="changeStartTime"></date-time-ctrl>
                    </div>
                </Poptip>
                <img style="width:26px;height:26px;" :src="playImg" v-on:click="play" />
            </div>
            <div class="player-space"> {{typename}} </div>
            <div class="player-right" v-on:mousedown.capture="onMouseDown" v-on:mouseout="onMouseOut" v-on:mouseup="onMouseUp" v-on:mousemove="onMouseMove">
                <div style="position:absolute;z-index:100;left:0;top:0;width:100%;height:100%" v-on:click.capture="clickPlayer"></div>
                <div class="player-right-top">
                    <div :style="{ left:forePositionPx + 'px',width:'calc(100% - '+forePositionPx+'px)',height:'100%' }" style="position:absolute;background-image:url(/i/ctrl/player_fore_bk.png)"></div>
                    <div v-for="item in scaleList" class="player-text" :style="{ left:item.pos }"> <span style="margin-left:-50%" :style="getItemStyle(item)">{{ item.time }}</span></div>
                </div>
                <div class="player-right-bottom">
                    <div v-for="item in scaleList" class="player-scale" :style="{ left:item.pos }">
                    </div>
                    <div v-for="item in scaleList" class="player-text" :style="{ left:item.pos }"> <span style="margin-left:-50%">{{ item.ext }}</span></div>
                </div>
                <div class="player-line" :style="{ left:curPosition }">
                    <img src="/i/ctrl/staff.png" />
                </div>
                <div class="player-line" style="height:100%" :style="{ left:nowPosition }">
                    <img src="/i/ctrl/player_now_line.png" style="height:100%" />
                </div>
            </div>
            <div class="player-space-end"></div>
        </div>`
});