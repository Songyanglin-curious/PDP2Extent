var vmMenu = new Vue({ el: '#divMenu',
    data: { layout: layout,
        bShowCtrl: false,
        ctrlWndLeft: 0,
        ctrlWndTop: 0,
        ctrls: PDPObject.all,
        isMain: true,
        test: '2011-11-11',
        button4: [],
        data: null,
        filename:"",
        tempWidth:"",
        tempHeight :"",
    }, computed: {
        width: {
            set: function (v) { this.tempWidth = v;  },
            get: function () { return this.getProperty(["s_width", "width"]); }
        },
        height: {
            set: function (v) { this.tempHeight = v; },
            get: function () { return this.getProperty(["s_height", "height"]); }
        }, canSetWidth: function () {
            return this.hasProperty(["s_width", "width"]);
        }, canSetHeight: function () {
            return this.hasProperty(["s_height", "height"]);
        }
    },
    methods: {
        setWidth: function () {
            this.setProperty(["s_width", "width"], this.tempWidth);
        },
        setHeight:function() {
            this.setProperty(["s_height", "height"], this.tempHeight);
        },
        setProperty: function (arr, v) {
            for (var i = 0; i < arr.length; i++) {
                if (this.hasProperty([arr[i]])) {
                    PDPDesign.Assist.set(this.data, "a", arr[i], v);
                    return;
                }
            }
        },
        getProperty: function (arr) {
            if ((!this.data) || (!this.data.a))
                return "";
            for (var i = 0; i < arr.length; i++) {
                var v = this.data.a[arr[i]];
                if (typeof v == "undefined")
                    continue;
                return v;
            }
            return "";
        },
        hasProperty: function (arr) {
            if (!this.data)
                return false;
            var cfg = PDPObject.getCtrlConfig(this.data.tag, "a");
            if (null == cfg)
                return false;
            for (var i = 0; i < arr.length; i++) {
                if (cfg.has(arr[i]))
                    return true;
            }
            return false;
        },
        drag: function (ctrl, event) {
            PDPDesign.page.moveStart(ctrl);
        },
        displayImg: function (ctrl, event) {
            var left = event.pageX + 15;
            var top = event.pageY + 15;
            var html = ctrl.html ? ctrl.html : "";
            var imgWrapper = "<div class='imgWrapper' style='left: " + left + "px;" + "top:" + top + "px'>" + html + "</div>"
            $(".imgWrapper").css({ "left": left + "px", "top": top + "px" })
            $(event.target).parent().append(imgWrapper);
        },
        gotoMain: function () {
            PDPDesign.Execute.preview("");
            this.isMain = true;
        },
        left: function () {
            var ctrl = vmProp.data;
            PDPDesign.Assist.set(ctrl, "a", "s_text-align", "left");
        },
        center: function () {
            var ctrl = vmProp.data;
            PDPDesign.Assist.set(ctrl, "a", "s_text-align", "center");
        },
        right: function () {
            var ctrl = vmProp.data;
            PDPDesign.Assist.set(ctrl, "a", "s_text-align", "right");
        },
        top: function () {
            var ctrl = vmProp.data;
            PDPDesign.Assist.set(ctrl, "a", "s_vertical-align", "top");
        },
        middle: function () {
            var ctrl = vmProp.data;
            PDPDesign.Assist.set(ctrl, "a", "s_vertical-align", "middle");
        },
        bottom: function () {
            var ctrl = vmProp.data;
            PDPDesign.Assist.set(ctrl, "a", "s_vertical-align", "bottom");
        }, toLeft: function () {
            var ctrl = vmProp.data;
            PDPDesign.Assist.setUnit(ctrl, "a", "s_margin-left", -5, "px");
        }, toRight: function () {
            var ctrl = vmProp.data;
            PDPDesign.Assist.setUnit(ctrl, "a", "s_margin-left", 5, "px");
        }, toTop: function () {
            var ctrl = vmProp.data;
            if (ctrl.a && ctrl.a.s_position) {
                PDPDesign.Assist.setUnit(ctrl, "a", "s_top", -5, "px");
            } else {
                PDPDesign.Assist.set(ctrl, "a", "s_position", "relative");
                PDPDesign.Assist.setUnit(ctrl, "a", "s_top", -5, "px");
            }
        }, toBottom: function () {
            var ctrl = vmProp.data;
            if (ctrl.a && ctrl.a.s_position) {
                PDPDesign.Assist.setUnit(ctrl, "a", "s_top", 5, "px");
            } else {
                PDPDesign.Assist.set(ctrl, "a", "s_position", 'relative');
                PDPDesign.Assist.setUnit(ctrl, "a", "s_top", 5, "px");
            }
        }, setFontSize: function (offset) {
            var ctrl = vmProp.data;
            var d = PDPDesign.Assist.getUnit(ctrl, "a", "s_font-size", "px", 12);
            PDPDesign.Assist.setUnit(ctrl, "a", "s_font-size", offset, "px", 12);
        }, set1in2: function (sname, s1, s2) {
            var ctrl = vmProp.data;
            var v = PDPDesign.Assist.getUnit(ctrl, "a", sname);
            PDPDesign.Assist.set(ctrl, "a", sname, v == s2 ? s1 : s2);
        }, setHasOrNo: function (sname, s) {
            var ctrl = vmProp.data;
            var v = PDPDesign.Assist.getUnit(ctrl, "a", sname);
            if (!v) {
                PDPDesign.Assist.set(ctrl, "a", sname, s);
                return;
            }
            var idx = v.indexOf(s);
            if (idx < 0) {
                PDPDesign.Assist.set(ctrl, "a", sname, v + " " + s);
            } else {
            }
        }
    }
});