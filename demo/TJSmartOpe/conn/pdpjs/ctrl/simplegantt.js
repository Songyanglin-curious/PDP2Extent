/*v=1.20.728.1*/
Vue.component('simplegantt', {
    props: {
        "planstart": {
            type: String,
            "default": ""
        }, "planend": {
            type: String,
            "default": ""
        }, "realstart": {
            type: String,
            "default": ""
        }, "realend": {
            type: String,
            "default": ""
        }, "plancolor": {
            type: String,
            "default": "#4dabbf"
        }, "realcolor": {
            type: String,
            "default": "#e9a749"
        }, "planname": {
            type: String,
            "default": "计划时间"
        }, "realname": {
            type: String,
            "default": "实际时间"
        }, "notext": {
            type: String,
            "default": ""
        }
    },
    data: function () {
        return {
        }
    },
    computed: {
        tmPlanStart: function () { return this.toTime(this.planstart); },
        tmPlanEnd: function () { return this.toTime(this.planend); },
        showPlan: function () { return this.tmPlanEnd && this.tmPlanStart },
        tmRealStart: function () { return this.toTime(this.realstart); },
        tmRealEnd: function () { return this.toTime(this.realend); },
        showReal: function () { return this.tmRealStart && this.tmRealEnd; },
        realColor: function () { if (this.tmRealEnd <= this.tmPlanEnd) return this.plancolor; return this.realcolor; },
        gap: function () { return 3; },
        planStyle: function () {
            if (!this.showPlan)
                return { visibility: "hidden" };
            var width = "100%";
            var left = "0";
            if (this.showReal) {
                var min = this.getMin(this.tmPlanStart, this.tmRealStart);
                var max = this.getMax(this.tmPlanEnd, this.tmRealEnd);
                var offset = max - min;
                //left = (((this.tmPlanStart - min) / offset) * this.width) + "px";
                //width = ((this.tmPlanEnd - this.tmPlanStart) / offset * this.width) + "px";
                left = (100.0 * (this.tmPlanStart - min) / offset) + "%";
                width = (100.0 * (this.tmPlanEnd - this.tmPlanStart) / offset) + "%";
            }
            return { visibility: "visible", width: width, left: left, "background-color": this.plancolor, "bottom": this.gap + "px", height: this.gap*2 + "px" };
        },
        realStyle: function () {
            if (!this.showReal)
                return { visibility: "hidden" };
            var width = "100%";
            var left = "0";
            if (this.showReal) {
                var min = this.getMin(this.tmPlanStart, this.tmRealStart);
                var max = this.getMax(this.tmPlanEnd, this.tmRealEnd);
                var offset = max - min;
                //left = (((this.tmRealStart - min) / offset) * this.width) + "px";
                //width = ((this.tmRealEnd - this.tmRealStart) / offset * this.width) + "px";
                left = (100.0 * (this.tmRealStart - min) / offset) + "%";
                width = (100.0 * (this.tmRealEnd - this.tmRealStart) / offset) + "%";
            }
            return { visibility: "visible", width: width, left: left, "background-color": this.realColor, "top": this.gap + "px", height: this.gap * 2 + "px" };
        }
    },
    methods: {
        toTime: function (str) { if (!str) return null; return Ysh.Time.parseDate(str); },
        getMin: function () {
            var min = null;
            for (var i = 0; i < arguments.length; i++) {
                var tm = arguments[i];
                if (!tm)
                    continue;
                if (!min) {
                    min = tm;
                    continue;
                }
                if (tm < min)
                    min = tm;
            }
            return min;
        },
        getMax: function () {
            var max = null;
            for (var i = 0; i < arguments.length; i++) {
                var tm = arguments[i];
                if (!tm)
                    continue;
                if (!max) {
                    max = tm;
                    continue;
                }
                if (max < tm)
                    max = tm;
            }
            return max;
        }
    },
    mounted: function () {
    },
    //template: '<Tooltip><div class="sgantt_box" :style="{ height:height+\'px\' }"><div class="sgantt_bar"><div :style="planStyle" class="sgantt_item"></div></div><div class="sgantt_bar"><div :style="realStyle" class="sgantt_item"></div></div></div><div slot="content"><div>{{planname}}：{{Ysh.Time.getRangeString(planstart,planend)}}</div><div>{{realname}}：{{Ysh.Time.getRangeString(realstart,realend)}}</div></div></Tooltip>'
    template: `<div style="padding: 0 5px;">
        <div style="position: relative;width: 100%;height: 50%;">
        <div style="font-size:12px;text-align:left" :style="{ 'color':plancolor }">{{ notext==1 ? "": Ysh.Time.getRangeString(planstart,planend,null,' 至 ')}}</div>
        <div style="position: relative;width: 100%;height: 50%;">
            <div :style="planStyle" style="position: absolute;height: 100%;border-radius: 4px;"></div>
        </div>
        </div>
<div style="position: relative;width: 100%;height: 50%;">
        <div style="position: relative;width: 100%;height: 50%;">
            <div :style="realStyle" style="position: absolute;height: 100%;border-radius: 4px;"></div>
        </div>
        <div style="font-size:12px;text-align:right" :style="{ 'color':realColor }">{{notext==1 ? "": Ysh.Time.getRangeString(realstart,realend,null,' 至 ')}}</div>
</div>
    </div>`
});