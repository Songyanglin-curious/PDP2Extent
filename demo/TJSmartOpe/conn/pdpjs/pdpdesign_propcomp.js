Vue.component("propertyfield", {
    props: ["obj", "fieldarr", "candisable","tag" ,"fieldname"], template: '#propertyfield_template',
    data: function () {
        return { value1: "" }
    },
    computed: {
        canSetValue: function () {
            if (!this.candisable)
                return true;
            return this.hasProperty(this.fieldarr);
        },
        value: {
            set: function (v) { this.value1 = v; },
            get: function () { return this.getProperty(this.fieldarr); }
        }, type: function () {
            if (!this.tag)
                return "1";
            var cfgs = PDPObject.getCtrlConfig(this.obj.tag, "a");
            if (cfgs == null)
                return "1";
            for (var i = 0; i < this.fieldarr.length; i++) {
                if (cfgs.has(this.fieldarr[i]))
                    return cfgs[this.fieldarr[i]].type;
            }
            return "1";
        }
    },
    methods: {
        setValue: function () {
            this.setProperty(this.fieldarr, this.value1);
        },
        setProperty: function (arr, v) {
            if (!this.fieldname) {
                Vue.set(this.obj, arr[0], v);
                return;
            }
            for (var i = 0; i < arr.length; i++) {
                if (this.hasProperty([arr[i]])) {
                    PDPDesign.Assist.set(this.obj, this.fieldname, arr[i], v);
                    return;
                }
            }
        },
        getProperty: function (arr) {
            if (!this.obj)
                return "";
            if (!this.fieldname)
                return this.obj[arr[0]];//只能一个
            if ((!this.obj) || (!this.obj[this.fieldname]))
                return "";
            for (var i = 0; i < arr.length; i++) {
                var v = this.obj[this.fieldname][arr[i]];
                if (typeof v == "undefined")
                    continue;
                return v;
            }
            return "";
        },
        hasProperty: function (arr) {
            if (!this.obj)
                return false;
            if (this.fieldname == "sf")
                return true;
            var cfg = PDPObject.getCtrlConfig(this.obj.tag, "a");
            if (null == cfg)
                return false;
            for (var i = 0; i < arr.length; i++) {
                if (cfg.has(arr[i]))
                    return true;
            }
            return false;
        }
    }, mounted: function () {
        this.value1 = this.value;
    }
});

Vue.component("dropfield", { props: ["id", "data", "field", "tag", "multiple"], template: "#dropfield_template",
    computed: {
        fromName: function () {
            if (!this.data) return "";
            return this.getFromName(this.data[this.field]);
        },
        isNoField: function () {
            if (!this.data)
                return true;
            return !this.data[this.field];
        }
    },
    methods: {
        getFromName: function (from) {
            if (from === undefined)
                return "";
            if (from == "index")
                return "序号";
            if (typeof from != "string")
                return from;
            var arr = from.split('_');
            if (arr.length == 2) {
                var obj = PDPDesign.page.find(arr[0]);
                if (obj == null)
                    return from;
                return obj.desc + "第" + (parseInt(arr[1], 10) + 1) + "列";
            } else {
                var obj = PDPDesign.page.find(from);
                if (obj == null)
                    return from;
                switch (obj.tag) {
                    case "col":
                        return obj.getParent().desc + "->" + obj.desc;
                    default:
                        return obj.desc;
                }
            }
        },
        locatefrom: function (id) {
            var obj = PDPDesign.page.find(id);
            if (null == obj)
                return;
            switch (obj.tag) {
                case "init":
                    break;
                case "const":
                    break;
                case "col":
                    break;
                case "datasource":
                    break;
                default:
                    PDPDesign.Event.locate(id);
                    return;
            }
            vmCtrl.select(obj);
        },
        dragover: function (id, tag, field, event) {
            if (PDPDesign.page.canMove({ id: id, tag: tag, field: field, data: this.data,e:event }))
                event.preventDefault();
        },
        drop: function (id, tag, field, event) {
            event.preventDefault();
            PDPDesign.page.moveEnd({ id: id, tag: tag, field: field, data: this.data,e:event });
        },
        stop: function () {
            PDPDesign.page.stopMove();
        }, clearField: function () {
            Vue.set(this.data, this.field, '');
        }
    }
});
Vue.component('page_prop', { props: ["data"], template: '#page_template',
    methods: {
        getDesc: function (key, a) {
            switch (key) {
                case "created":
                    return "创建时";
                case "mounted":
                    return "显示时";
                default:
                    return "";
            }
        },
        getEventString: function (e) {
            if (e.list.length == 0)
                return "没有操作";
            if (e.list.length > 2)
                return e.list.length + "个操作";
            var arr = []
            for (var i = 0; i < e.list.length; i++) {
                arr.push(vmAssist.getScriptString(e.list[i]));
            }
            return arr.join("；");
        }, editEvent: function (e,name) {
            vmAssist.showScriptListDlg = true;
            //vmAssist.scripts = e.list;
            vmAssist.setEvent(e);
        }
    }
});
Vue.component('init_prop', { props: ["data"], template: '#init_template' });
Vue.component('priv_prop', { props: ["data"], template: '#priv_template' });
Vue.component('const_prop', { props: ["data"], template: '#const_template' });
Vue.component('col_prop', { props: ["data"], template: '#col_template',
    methods: {
    }
});
Vue.component('input_prop', { props: ["data"], template: '#input_template' });
Vue.component('output_prop', { props: ["data"], template: '#output_template' });

Vue.component('ctrl_prop_tab', { props: ["ctrl", "args","cfg","desc"], template: '#ctrl_prop_tab_template',
    methods: {
        getDesc: function (key, a) {
            var cfg = PDPObject.getCtrlConfig(this.ctrl.tag, a);
            if (cfg == null)
                return key;
            if (cfg.has(key))
                return cfg[key].desc;
            return key;
        },
        keys: function (o) {
            return PDPDesign.Assist.keys(o);
        },
        enlarge: function (id) {
            PDPDesign.Execute.preview(id);
            vmMenu.isMain = false;
        },
        locate: function (id) {
            PDPDesign.Event.click(id, true);
        },
        add: function (type) {
            vmAssist.ctrlofconfig = this.ctrl;
            vmAssist.cfgname = type;
            vmAssist.showpdpctrlDlg = true;
            vmAssist.showpdpctrlconfig = true;
        }
    }
});

Vue.component('ctrl_prop', { props: ["ctrl", "args"], template: '#ctrl_prop_template',
    computed: {
        canDelete: function () { return PDPDesign.page.ctrls.indexOf(this.ctrl) < 0; }
    },
    methods: {
        getDesc: function (key, a) {
            var cfg = PDPObject.getCtrlConfig(this.ctrl.tag, a);
            if (cfg == null)
                return key;
            if (cfg.has(key))
                return cfg[key].desc;
            return key;
        },
        keys: function (o) {
            return PDPDesign.Assist.keys(o);
        },
        enlarge: function (id) {
            PDPDesign.Execute.preview(id);
            vmMenu.isMain = false;
        },
        locate: function (id) {
            PDPDesign.Event.click(id, true);
        },
        add: function (type) {
            vmAssist.ctrlofconfig = this.ctrl;
            vmAssist.cfgname = type;
            vmAssist.showpdpctrlDlg = true;
            vmAssist.showpdpctrlconfig = true;
        },
        del: function () {
            var p = this.ctrl.getParent();
            p.c.erase(this.ctrl);
            PDPDesign.Execute.refresh();
            PDPDesign.Event.click(p.id, true);
        },
        getEventString: function (e) {
            if (e.list.length == 0)
                return "没有操作";
            if (e.list.length > 2)
                return e.list.length + "个操作";
            var arr = []
            for (var i = 0; i < e.list.length; i++) {
                arr.push(vmAssist.getScriptString(e.list[i]));
            }
            return arr.join("；");
        }, editEvent: function (e, name) {
            vmAssist.showScriptListDlg = true;
            vmAssist.setEvent(e, this.ctrl.tag, name);
            //vmAssist.scripts = e.list;
        }
    }
});

Vue.component('base_ctrl_prop', { props: ["data", "args"], template: '#base_ctrl_template',
    computed: {
        aKeys: function () { return this.keys(this.data.a); },
        saKeys: function () { return this.keys(this.data.sa); },
        allKeys: function () { var arr = this.keys(this.data.a); PDPDesign.Assist.appendKeys(arr, this.data.sa); return arr; }
    },
    methods: {
        getDesc: function (key, a) {
            var cfg = PDPObject.getCtrlConfig(this.data.tag, a);
            if (cfg == null)
                return key;
            if (cfg.has(key))
                return cfg[key].desc;
            return key;
        },
        keys: function (o) { return PDPDesign.Assist.keys(o); },
        getUnit:function(o,a,k) { return PDPDesign.Assist.getUnit(o,a,k); },
        add: function (type) {
            vmAssist.ctrlofconfig = this.data;
            vmAssist.cfgname = type;
            vmAssist.showpdpctrlDlg = true;
            vmAssist.showpdpctrlconfig = true;
        }
    }
});

Vue.component('echart_prop', { props: ["data", "args"], template: '#echart_prop_template',
    computed: {
        aKeys: function () { return this.keys(this.data.a); },
        saKeys: function () { return this.keys(this.data.sa); },
        noChildren: function () {
            if (!this.data.c)
                return true;
            return this.data.c.length == 0;
        }
    },
    methods: {
        locate: function (id) {
            PDPDesign.Event.click(id, true);
        },
        getUnit: function (o, a, k) { return PDPDesign.Assist.getUnit(o, a, k); },
        setOption: function () {
            vChartSetting.chartSettingModal = true;
            var data = this.data;
            vChartSetting.fOk = function (v) {
                if (v.series) {
                    for (var i = 0; i < v.series.length; i++) {
                        data.c[i].a.type = v.series[i].type;
                    }
                }
                PDPDesign.Assist.set(data, "a", "option", JSON.stringify(v));
            }
            var v = data.a ? data.a.option : null;
            var legend = [];
            if (data.c) {
                for (var i = 0; i < data.c.length; i++) {
                    legend.push(data.c[i].desc);
                }
            }
            var option = {};
            if (v)
                option = JSON.parse(v);
            chartSetting.initialSetting(legend, option);
        },
        dragover: function (id, tag, field, event) {
            if (PDPDesign.page.canMove({ id: id, tag: tag, field: field, data: this.data, e: event }))
                event.preventDefault();
        },
        drop: function (id, tag, field, event) {
            event.preventDefault();
            if (field != 'c')
                return;
            var src = PDPDesign.page.moveObject;
            var ctrl = PDPDesign.page.newCtrl(PDPObject.get("yaxis").create(), this.data);
            ctrl.from = src.id;
            //ctrl.desc = PDPDesign.page.find(src.id).desc;
            PDPDesign.page.moveObject = null;
            PDPDesign.Execute.refresh();
            PDPDesign.Event.click(this.data.id, true);
        }, delSub: function (id) {
            for (var i = 0; i < this.data.c.length; i++) {
                var ctrl = this.data.c[i];
                if (ctrl.id == id) {
                    this.data.c.erase(ctrl);
                    PDPDesign.Execute.refresh();
                    PDPDesign.Event.click(this.data.id, true);
                    return;
                }
            }
        }
    }
});