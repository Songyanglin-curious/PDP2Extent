Vue.component('htimeline', {
    data: function () {
        return {};
    },
    props: {
        "value": {
            "default": ""
        },
        "datalist": {
            type: Array,
            "default": function () { return []; }
        },
        "height": {
            type: String,
            "default": "60px"
        }, "stepwidth": {
            type: String,
            "default": "50px"
        }, "length": {
            type: Number,
            "default": 2
        }, "css": {
            default:""
        }
    },
    computed: {
        width: function () { return (this.stepWidthValue * (this.datalist.length - 1) + 60) + this.stepWidthUnit },
        lineWidth: function () { return this.stepWidthValue * (this.datalist.length - 1) + this.stepWidthUnit },
        stepWidthValue: function () { return parseInt(this.stepwidth, 10); },
        stepWidthUnit: function () { return this.stepwidth.substr((this.stepWidthValue + "").length); }
    },
    methods: {
        getItemLeft: function (item, index) {
            return (index * this.stepWidthValue) + this.stepWidthUnit;
        },
        getItemStyle: function (item, index,value) {
            var s = { left: this.getItemLeft(item, index) };
            if (this.css instanceof Function)
                this.css(s, item, index, value);
            return s
        },
        getItemClass: function (item, index) {
            return (item[0] == this.value) ? "order_item selected" : "order_item";
        },
        click: function (item, index) {
            this.$emit('input', item[0]);
            this.$emit('click', item, index);
        }
    },
    watch: {
        value: function() {
            this.$emit('change');
        }
    },
    created: function () {
    }, template: '<div style="text-align:center">'
        + '<div style="position: relative;" :style="{ height:height,width:width }">'
        + '<div class="htime_line" :style="{ width:width }"><ol style="list-style-type:none;"><li v-for="(item,index) in datalist" :class="getItemClass(item,index,value)" :style="getItemStyle(item,index,value)" @click="click(item,index)">'
        + '<div v-for="n in length" v-if="n!=0">{{item[n]}}</div>'
        + '</li></ol>'
        + '<span class="filling_line" :style=" { width: lineWidth }"></span></div></div></div>'
});

Vue.component('htimeselect', {
    data: function () {
        return {
            starttime: new Date(), state: 0, timerId: 0, display: 0
        };
    },
    props: {
        "value": {
            "default": ""
        }, "step": {
            type: Number,
            "default": 1
        }, "type": {
            "default": "h"
        }, "length": {
            type: Number,
            "default": 6
        }, "min": {
            "default":""
        }, "max": {
            "default":""
        }, "autoplay": {
            type: Number,
            "default": 0
        }
    },
    computed: {
        timelist: function () {
            var ret = [];
            var tmPrev = null;
            for (var i = 0; i < this.length; i++) {
                var tm = Ysh.Time.add(this.type, i * this.step, this.starttime);
                var strKey = Ysh.Time.formatString(tm, "111111");
                var strText = "";
                var strExt = "";
                strExt = this.getExtend(tm, tmPrev);
                strText = this.getShowText(tm);
                ret.push([strKey, strExt, strText]);
                tmPrev = tm;
            }
            return ret;
        }, playImg: function () {
            return (this.state == 1) ? "/i/sgc/pause.png" : "/i/sgc/play.png";
        }, disstyle: function () {
            switch (this.type) {
                case 'y': return "100000";
                case 'm': return "110000";
                case 'd': return "111000";
                default: return "111100";
            }
        }, resetCss: function () {
            var f = null;
            switch (this.type) {
                case 'y':
                    f = function (v) { return v.substr(0, 4); }
                    break;
                case 'm':
                    f = function (v) { return v.substr(5, 2); } 
                    break;
                case 'd':
                    f = function (v) { return v.substr(8, 2); }
                    break;
                default:
                    f = function (v) { return v.substr(11, 2); }
                    break;
            }
            return function (s, item, index, value) {
                var n = parseInt(f(item[0]));
                s.color = (n % 2 == 0) ? "red" : "green";
            };
        }
    },
    methods: {
        getExtend: function (tm, tmPrev) {
            switch (this.type) {
                case 'y':
                    if (tmPrev == null)
                        return "年份";
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
        getShowText: function (tm) {
            switch (this.type) {
                case 'y':
                    return Ysh.Time.formatString(tm, "100000");
                case 'm':
                    return Ysh.Time.formatString(tm, "1010000");
                case 'd':
                    return Ysh.Time.formatString(tm, "1001000");
                default://h
                    return Ysh.Time.formatString(tm, "110");
            }
        }, getStartTime: function () {            
            var tm0 = Ysh.Time.add(this.type, -this.step, new Date(Ysh.Time.parseDate(this.value)));
            if (!this.max) {
                if (this.min) {
                    while (this.min > tm0) {
                        tm0 = Ysh.Time.add(this.type, this.step, tm0);
                    }
                }
                return tm0;
            }
            var tm1 = Ysh.Time.add(this.type, this.step * (this.length - 1), tm0);
            while (this.max < tm1) {
                tm1 = Ysh.Time.add(this.type, -this.step, tm1);
            }
            return Ysh.Time.add(this.type, this.step * (1 - this.length), tm1);
        },
        click: function (item, index) {
            this.$emit('input', item[0]);
            this.$emit('click', item, index);            
        },
        move: function (bLeft) {
            if (bLeft) {
                var tm = Ysh.Time.add(this.type, -this.step, this.starttime);
                if (this.min) {
                    if (tm < this.min)
                        return false;
                }
                this.starttime = tm;
            } else {
                var tm = Ysh.Time.add(this.type, this.step * this.length, this.starttime);
                if (this.max) {
                    if (tm > this.max)
                        return false;
                }
                this.starttime = Ysh.Time.add(this.type, this.step, this.starttime);
            }
            return true;
        },
        changeValue: function () {
            for (var i = 0; i < this.timelist.length; i++) {
                var tm = this.timelist[i][0];
                if (tm == this.value) {
                    if (i == 0) {
                        this.move(true);
                        return;
                    }
                    if (i == this.length - 1) {
                        this.move(false);
                        return;
                    }
                    return;
                }
            }
            this.starttime = this.getStartTime();
        }, play: function () {
            //0 停止 1 - 播放中
            if (this.state == 1) {
                this.state = 0;
                window.clearTimeout(this.timerId);
            } else {
                this.state = 1;
                this.doPlay();
            }
        }, doPlay: function () {
            var v = Ysh.Time.add(this.type, this.step, new Date(Ysh.Time.parseDate(this.value)));
            if (v > this.max) {
                //超出范围，停止播放
                this.state = 0;
                window.clearTimeout(this.timerId);
                return;
            }
            this.$emit("input", Ysh.Time.formatString(v, "111111"));
            vm = this;
            this.timerId = window.setTimeout(function () { vm.doPlay(); }, this.autoplay * 1000);
        }, changeDisplay: function () {
            var vm = this;
            vm.display = 1 - vm.display;
        }
    },
    watch: {
        start: function () {
            this.starttime = this.getStartTime();
        },/*
        starttime: function () {
            this.timelist = this.getTimeList();

        },*/
        value: function () {
            this.changeValue();
            this.$emit('input', this.value);
            this.$emit('change', this.value);
        }, type: function () {
            this.starttime = this.getStartTime();
        }
    },
    created: function () {
        this.starttime = this.getStartTime();
    },
    //template: '<div v-if="display==0" style="position:relative"><div class="htime_line_add"><img @click="play()" v-if="autoplay>0" :src="playImg" /><br /><img @click="changeDisplay()" src="/i/sgc/max.png" /></div><htimeline v-if="display==0" style="position:relative;left:20px;" v-model="value" @click="click" height="70px" :datalist="timelist" :length="3"></htimeline></div>'
    //    +'<div v-else style="position:relative"><img @click="changeDisplay()" src="/i/sgc/max.png" /><date-time-ctrl style="position:relative;left:20px;" v-model="value" img="none" :disstyle="disstyle"></date-time-ctrl></div>'
    template: '<div><div style="padding-bottom:5px;"><date-time-ctrl style="position:relative;left:20px;" v-model="value" img="none" :min="min" :max="max" :disstyle="disstyle"></date-time-ctrl></div><div style="position:relative"><div class="htime_line_add"><Tooltip content="自动展示" placement="top"><img @click="play()" v-if="autoplay>0" :src="playImg" /></Tooltip></div><htimeline style="position:relative;left:20px;" v-model="value" :css="resetCss" @click="click" height="70px" :datalist="timelist" :length="3"></htimeline></div></div>'
});
