/*v=1.21.224.1*/
Vue.component('date-time-ctrl-unit', {
    props: ["item", "index", "disabled", "fontsize", "unitWidth"],
    computed: {
        value: function () {
            return getfullvalue(this.item.value);
        },
        ctrlWidth: function () {
            var w = (this.item.length * 2 * this.unitWidth);
            if (this.item.hhPadding)
                w += 10;
            return w + 'px';
        },
        ctrlPaddingLeft: function() {
            return this.item.hhPadding ? '10px' : '0';
        },
        descWidth: function () {
            return this.item.descWidth + "px";
        }, fontSize: function () {
            return (this.fontsize || "13") + "px";
        }
    },
    methods: {
        onchange: function (event) {
            if (event.target.value == this.value)
                return;
            if (!this.$parent.setValue(this.index, event.target.value))
                event.target.value = this.value;
        }
    },
    template: '<span><input type="text" v-if="item.show" :disabled="!!disabled" :value="value" @blur="onchange($event)" @keydown="$parent.onkeydown(index,$event)" @mousewheel="$parent.onmousewheel(index,$event)" :style="{ width: ctrlWidth,fontSize:fontSize, paddingLeft: ctrlPaddingLeft }" autocomplete="off" style="border:none;ime-mode:disabled;FONT-WEIGHT:bold;text-align:right;" LANGUAGE="javascript" onpaste="return false;" /><input type="text" v-if="item.showUnit" :disabled="!!disabled" style="border: none;text-align:center;font-size:13px" onfocus="var s = this.previousSibling;s.focus();return false;" readonly :value = "item.desc" :style="{width:descWidth,fontSize:fontSize}" /></span> '
});

Vue.component('date-time-ctrl', {
    props: ["value", "dtstyle", "disstyle", "disabled", "img", "imgclass", "min", "max", "fontsize", "css", "fshowdate"],
    data: function () { return { init: "" } },
    computed: {
        show: function () {
            if (this.value == "")
                this.value = this.init;
            var dtObj = new DateEx(this.value);
            var dtstyle = this.dtstyle || 1;
            var disstyle = this.disstyle || "111111";
            var arr_part = dtObj.splitEx();
            var temp_datetime = dtObj.getDateTime();
            var str_dtstyle = "年|月|日|时|分|秒"; // "年|月|日|时|分|秒";
            if (dtstyle == 2) str_dtstyle = "-|-||:|:|";
            var arr_dtstyle = str_dtstyle.split("|");
            var arr_bit = [true, true, true, true, true, true];
            var i;
            for (i = 0; i < 6; i++)
                arr_bit[i] = (disstyle.substr(i, 1) == "1");
            var arr_display0 = ["", "", "", "", "", ""];
            var arr_display1 = ["", "", "", "", "", ""];
            var w = 0;
            for (i = 0; i < 6; i++) {
                if (!arr_bit[i]) {
                    arr_display0[i] = "none";
                    arr_display1[i] = "none";
                } else {
                    w += (2 * this.unitWidth);
                }
            }
            if (arr_bit[0]) w += (2 * this.unitWidth);
            //	年
            if (arr_bit[0] && (arr_bit[1] || arr_bit[2]) && dtstyle == 2) arr_display1[0] = "";
            if (dtstyle == 1 && arr_bit[0]) arr_display1[0] = "";

            //	月
            if (arr_bit[1] && arr_bit[2] && dtstyle == 2) arr_display1[1] = "";
            if (dtstyle == 1 && arr_bit[1]) arr_display1[1] = "";
            if (dtstyle == 2 && (!arr_bit[2])) arr_display1[1] = "none";

            //	日
            if (dtstyle == 2) arr_display1[2] = "none";

            //	时
            if (arr_bit[3] && (arr_bit[4] || arr_bit[5]) && dtstyle == 2) arr_display1[3] = "";
            if (dtstyle == 1 && arr_bit[3]) arr_display1[3] = "";
            var hhPadding = dtstyle == 2 && arr_display0[2] == "" && arr_display0[3] == "";
            //	分
            if (arr_bit[4] && (arr_bit[5]) && dtstyle == 2) arr_display1[4] = "";
            if (dtstyle == 1 && arr_bit[4]) arr_display1[4] = "";
            if (dtstyle == 2 && (!arr_bit[5])) arr_display1[4] = "none";

            //	秒
            var wU = ((dtstyle == 2) ? this.unitWidth : 2 * this.unitWidth);
            if (dtstyle == 2) arr_display1[5] = "none";
            for (i = 0; i < 6; i++) {
                if (arr_display1[i] == "")
                    w += wU;
            }
            if (hhPadding)
                w += 10;
            var ret = {
                list: [
                    { part: 'y', show: arr_display0[0] == "", length: 2, value: arr_part[0], showUnit: arr_display1[0] == "", desc: arr_dtstyle[0], descWidth: wU, hhPadding: false }
                    , { part: 'm', show: arr_display0[1] == "", length: 1, value: arr_part[1], showUnit: arr_display1[1] == "", desc: arr_dtstyle[1], descWidth: wU, hhPadding: false }
                    , { part: 'd', show: arr_display0[2] == "", length: 1, value: arr_part[2], showUnit: arr_display1[2] == "", desc: arr_dtstyle[2], descWidth: wU, hhPadding: false }
                    , { part: 'hh', show: arr_display0[3] == "", length: 1, value: arr_part[3], showUnit: arr_display1[3] == "", desc: arr_dtstyle[3], descWidth: wU, hhPadding: hhPadding }
                    , { part: 'mi', show: arr_display0[4] == "", length: 1, value: arr_part[4], showUnit: arr_display1[4] == "", desc: arr_dtstyle[4], descWidth: wU, hhPadding: false }
                    , { part: 'ss', show: arr_display0[5] == "", length: 1, value: arr_part[5], showUnit: arr_display1[5] == "", desc: arr_dtstyle[5], descWidth: wU, hhPadding: false }
                ], width: (w + 2 + ((this.img == "none" || this.disabled) ? 0 : 2 * this.unitWidth)) + "px",
                toString: function () {
                    var list = this.list;
                    return list[0].value + "-" + getfullvalue(list[1].value) + "-" + getfullvalue(list[2].value) + " " + getfullvalue(list[3].value) + ":" + getfullvalue(list[4].value) + ":" + getfullvalue(list[5].value);
                }
            };
            if (this.init == "") {
                this.init = ret.toString();
            }
            if (this.value == "")
                this.$emit("input", ret.toString());
            return ret;
        },
        unitWidth: function () {
            var fontSize = (this.fontsize || "13").toString();
            switch (fontSize) {
                case "22":
                    return 13;
                default:
                    return 8;
            }
        }
    },
    methods: {
        getValue: function (p) {
            return this.show.list[p].value;
            //return list[0].value + "-" + list[1].value + "-" + list[2].value + " " + list[3].value + ":" + list[4].value + ":" + list[5].value;
        },
        setValue: function (p, v) {
            var dtval = parseInt(v, 10);
            if (isNaN(dtval))
                return false;
            var backup = [];
            for (var i = 0; i < this.show.list.length; i++)
                backup[i] = this.show.list[i].value;
            switch (p) {
                case 0:
                    if (parseInt(this.show.list[1].value, 10) == 2) {
                        var maxDay = isLeapYear(dtval) ? 29 : 28;
                        if (parseInt(this.show.list[2].value, 10) > maxDay)
                            this.show.list[2].value = maxDay;
                    }
                    break;
                case 1:
                    if ((dtval <= 0) || (dtval > 12))
                        return false;
                    var maxDays = getMonthMaxDays(parseInt(this.show.list[0].value, 10), dtval);
                    if (parseInt(this.show.list[2].value, 10) > maxDays)
                        this.show.list[2].value = maxDays;
                    break;
                case 2:
                    var maxDays = getMonthMaxDays(parseInt(this.show.list[0].value, 10), parseInt(this.show.list[1].value, 10));
                    if (!(dtval > 0 && dtval <= maxDays))
                        return false;
                    break;
                case 3:
                    if ((dtval < 0) || (dtval > 23))
                        return false;
                    break;
                default:
                    if ((dtval < 0) || (dtval > 59))
                        return false;
                    break;
            }
            var list = [];
            for (var i = 0; i < this.show.list.length; i++)
                list[i] = this.show.list[i];
            list[p].value = v;
            v = list[0].value + "-" + getfullvalue(list[1].value) + "-" + getfullvalue(list[2].value) + " " + getfullvalue(list[3].value) + ":" + getfullvalue(list[4].value) + ":" + getfullvalue(list[5].value);
            var bOut = false;
            if (this.min || this.max) {
                var v0 = new Date(Ysh.Time.parseDate(v));
                if (this.min)
                if (this.min > v0)
                        bOut = true;
                if (this.max)
                if (this.max < v0)
                    bOut = true;
            }
            if (bOut) {
                for (var i = 0; i < this.show.list.length; i++)
                    this.show.list[i].value = backup[i];
                return false;
            }
            this.$emit('input', v);
            this.$emit("change", v);
            return true;
        },
        onpartchange: function (p, v) {
            var list = this.show.list;
            var idx = ["y", "m", "d", "hh", "mi", "ss"].indexOf(p);
            if (idx < 0)
                return;
            list[idx].value = v;
            v = this.getValue();
            var d = new DateEx(v);
            if (!d.isInvalid())
                this.$emit('input', this.value);
            else
                this.$emit('input', v);
        },
        onmousewheel: function (p, event) {
            if (this.disabled) return;
            var keycode = event.wheelDelta;
            if (keycode == 120) {
                this.setValue(p, parseInt(this.getValue(p), 10) + 1);
                return;
            }
            //obj.value = parseInt(obj.value, 10) + 1;
            if (keycode == -120) {
                this.setValue(p, parseInt(this.getValue(p), 10) - 1);
                return;
            }
            //obj.value = parseInt(obj.value, 10) - 1; 
        },
        onkeydown: function (p, event) {
            var keycode = event.keyCode;
            if (keycode == 38) {
                this.setValue(p, parseInt(this.getValue(p), 10) + 1);
                return;
            }
            if (keycode == 40) {
                this.setValue(p, parseInt(this.getValue(p), 10) - 1);
                return;
            }
        }
    },
    mounted: function () {
        var dtname = $(this.$el.children[this.$el.children.length - 2]);
        var disstyle = this.disstyle || "111111";
        var arr_date = ["yy", "mm", "dd"];
        var arr_time = ["HH", "mm", "ss"];
        var arr_bit = [true, true, true, true, true, true];
        for (var i = 0; i < 6; i++)
            arr_bit[i] = (disstyle.substr(i, 1) == "1");
        if (this.img == "none")
            return;
        var vm = this;
        var options = {
            //controlType: 'select',
            dateFormat: "yy-mm-dd",
            timeFormat: "HH:mm:ss",
            showOn: 'button',
            buttonImage: vm.img || '/i/Calendar.png',
            buttonText: '选择时间',
            buttonImageOnly: true,
            changeMonth: arr_bit[1],
            changeYear: arr_bit[0],
            showOtherMonths: arr_bit[1],
            selectOtherMonths: arr_bit[1],
            triggerClass: vm.imgclass,
            showHour: arr_bit[3],
            showMinute: arr_bit[4],
            showSecond: arr_bit[5],
            datetimeFormat: arr_bit,
            //stepMinute: 5,
            onClose: function (dateText, inst) {
                if (arr_bit[0] && arr_bit[1] && !arr_bit[2] && !arr_bit[3] && !arr_bit[4] && !arr_bit[5]) {
                    //只有年月
                    dateText = inst.selectedYear + "-" + (inst.selectedMonth + 1) + "-01 00:00:00";
                }
                vm.$emit('input', dateText);
                vm.$emit("change", dateText);
                //vm.value = dateText;
               // SetCtrlDateTime(null, dtname.substr(1), dateText);
            }
        };
        if (this.fshowdate)
            options.beforeShowDay = this.fshowdate;
        if (arr_bit[0] || arr_bit[1] || arr_bit[2]) {
            if (arr_bit[3] || arr_bit[4] || arr_bit[5]) {
                dtname.datetimepicker(options);
            }
            else {
                dtname.datepicker(options);
            }
        }
        else {
            dtname.timepicker(options);
        }
        $(".ui-datepicker-year").click(function () {
            var els = $(".ui-datepicker-year > option");
            var now = new Date().getFullYear() + 1;
                for (var i = 0; i < els.length; i++) {
                    if (+(els.eq(i).get(0).value) === now) {
                        $(".ui-datepicker-year > option:gt(" + i + ")").hide()
                    }
                }
        });
    },
    watch: {
        value: function () {
            //this.$emit("change", this.value);
        }
    },
    template: '<div style="display:inline-flex;align-items:center;border: solid 1px #acb9c1;" :class="css" :style="{ width: show.width}"><date-time-ctrl-unit v-for="(item,index) in show.list" :fontsize="fontsize" :unitWidth="unitWidth" :item="item" :index="index" :key="item.part" :disabled="disabled"></date-time-ctrl-unit><input type="hidden" :value="show.toString()" /><span v-show="!disabled" style="display:inline-flex;align-items:center;"></span></div>'
});

Vue.component('date-time-ctrl2', {
    props: ["value", "dtstyle", "disstyle", "disabled", "img", "imgclass", "min", "max", "fontsize", "css", "fshowdate"],
    data: function () { return { v:"" } },
    computed: {
        picktype: function () {
            switch (this.disstyle) {
                case 'y': return "year";
                case 'm': return 'month';
                case 'd': return 'date';
                default: return "datetime";
            }
        },
        disstyle0: function () {
                switch (this.disstyle) {
                    case 'y': return "yyyy年";
                    case 'm': return "yyyy年MM月";
                    case 'd': return "yyyy-MM-dd";
                    case 'mi': return "yyyy-MM-dd HH:mm";
                    default: return "yyyy-MM-dd HH时";
                }
        }
    },
    methods: {
        disabledDate: function () { return false; },
        onChange: function () {
            this.$emit("input", this.v);
            this.$emit("change");
        }
    },
    created: function () {
        this.v = this.value;
    },
    mounted: function () {
    },
    template: '<DatePicker v-model="v" :options="{ disabledDate:disabledDate }" :type="picktype" :format="disstyle0" style="width:160px" v-on:on-change="onChange"></DatePicker>'
});