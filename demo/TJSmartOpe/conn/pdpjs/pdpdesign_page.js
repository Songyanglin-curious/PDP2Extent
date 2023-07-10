
var vmSelected = new Vue({ el: '#divSelected', data: { layout: layout, ctrl: null },
    computed: {
        path: function () { if (!this.ctrl) return []; return PDPDesign.Assist.getCtrlPath(this.ctrl); },
        children: function () { if (!this.ctrl) return []; return this.ctrl.c || []; }
    },
    methods: {
        drag: function (id, tag, event) {
            PDPDesign.page.moveStart({ id: id, tag: tag });
        },
        dragover: function (id, tag, event) {
            if (PDPDesign.page.canMove({ id: id, tag: tag,e:event }))
                event.preventDefault();
        },
        drop: function (id, tag, event, idx) {
            event.preventDefault();
            PDPDesign.page.moveEnd({ id: id, tag: tag, index: idx + 1,e:event });
        },
        stop: function () {
            PDPDesign.page.stopMove();
        },
        click: function (id) { PDPDesign.Event.click(id); }
    }
});

var vmMain = new Vue({ el: '#divMain',
    data: { layout: layout,page:PDPDesign.page },
    computed: {
        
    },
    methods: {}
});

var vmAssist = new Vue({ el: '#divAssist',
    data: {
        showScriptListDlg: false,
        showAddScript: false,
        showpdpctrlDlg: false,
        showpdpctrlconfig: false,
        scripts: [],
        group: null,
        script: { type: 'select', ds: '', dll: '', value: '' },
        ctrlcfgarr: [],
        ctrlofconfig: null,
        cfgname: 'a',
        title:''
    },
    computed: {
        configdata: function () {
            this.ctrlcfgarr = [];
            var cfgname = this.cfgname;
            var bArray = false;
            if (cfgname instanceof Array) {
                cfgname = cfgname[0];
                bArray = true;
            }
            var cfgs = PDPObject.getCtrlConfig(this.ctrlofconfig.tag, cfgname);
            if (cfgs) {
                var a = this.ctrlofconfig[cfgname] || {};
                for (var i = 0; i < cfgs.__keys.length; i++) {
                    var ifcheck = false;
                    var key = cfgs.__keys[i];
                    if (bArray) {
                        for (var c = 0; c < this.cfgname.length; c++) {
                            var aa = this.ctrlofconfig[this.cfgname[c]] || {};
                            if (typeof aa[key] != "undefined") {
                                ifcheck = true;
                                break;
                            }
                        }
                    } else {
                        if (typeof (a[key]) != "undefined")
                            ifcheck = true;
                    }
                    var cfg = cfgs[key];
                    this.ctrlcfgarr.push({ enname: key, cnname: cfg.desc, cndetail: cfg.text, dfvalue: cfg.defvalue, ifcheck: ifcheck });
                }
            }
            return this.ctrlcfgarr;
        }
    },
    methods: {
        setEvent: function (e,tag,name) {
            this.group = e;
            this.scripts = PDPDesign.Assist.clone(e.list);
            this.title = "";
            if (tag && name) {
                var cfgs = PDPObject.getCtrlConfig(tag, "e");
                if (cfgs) {
                    this.title = cfgs[name].text;
                }
            }
        },
        getScriptString: function (script) {
            switch (script.type) {
                case "select":
                    return "获取" + PDPDesign.page.find(script.ds).desc + "(" + script.ds + ")" + "数据";
                case "invoke":
                    return "调用" + PDPDesign.page.find(script.dll).desc + "(" + script.dll + ")" + "接口";
                case "script":
                    return "运行脚本：" + script.value;
                case "redirect":
                    return "跳转到页面：" + script.value;
                case "update":
                    return "保存" + PDPDesign.page.find(script.ds).desc + "(" + script.ds + ")" + "数据";
                default:
                    return "";
            }
        },
        getDataSourceList: function () {
        },
        delScript: function (index) {
            this.scripts.splice(index, 1);
        },
        moveScript: function (index, bUp) {
            var idx = index + (bUp ? -1 : 1);
            var tmp = this.scripts[index];
            //this.$set(this.scripts, index, this.scripts[idx]);
            this.scripts[index] = this.scripts[idx];
            Vue.set(this.scripts, idx, tmp);
            //this.scripts[idx] = tmp;
        },
        addScript: function () {
            var script = this.script;
            var scriptAdd = null;
            if (script.type == "select")
                scriptAdd = { type: script.type, ds: script.ds };
            else if (script.type == "update")
                scriptAdd = { type: script.type, ds: script.ds };
            else if (script.type == "invoke")
                scriptAdd = { type: script.type, dll: script.dll };
            else //if (script.type == "script")
                scriptAdd = { type: script.type, value: script.value };
            if (scriptAdd != null) {
                PDPDesign.Assist.defineXml(scriptAdd, "list");
                this.scripts.push(scriptAdd);
            }
            this.showAddScript = false;
        },
        selectExecuteList: function () {
            return PDPDesign.page.datasources;
        },
        saveExecuteList: function () {
            var arr = [];
            for (var i = 0; i < PDPDesign.page.datasources.length; i++) {
                if (PDPDesign.page.datasources[i].type == "single")
                    arr.push(PDPDesign.page.datasources[i]);
            }
            return arr;
        },
        invokeExecuteList: function () {

            return PDPDesign.page.dlls;
        },
        confirmScript: function () {
            this.group.list = this.scripts;
            PDPDesign.Execute.refresh();
        },
        cancelScript: function () {
        },
        confirmcfgchoose: function () {
            var cfgname = this.cfgname;
            if (cfgname instanceof Array)
                cfgname = cfgname[0];
            if (!this.ctrlofconfig[cfgname]) {
                Vue.set(this.ctrlofconfig, cfgname, {});
                PDPDesign.Assist.defineXml(this.ctrlofconfig[cfgname], cfgname);
            }
            var a = this.ctrlofconfig[cfgname];
            for (var i = 0; i < this.ctrlcfgarr.length; i++) {
                var cfg = this.ctrlcfgarr[i];
                if (cfg.ifcheck) {
                    if (a[cfg.enname]) {
                        if (a[cfg.enname] == "")
                            Vue.set(a, cfg.enname, cfg.dfvalue);
                    }
                    else {
                        if (cfgname == "e") {
                            var e = { list: [] };
                            PDPDesign.Assist.defineXml(e, cfg.enname);
                            Vue.set(a, cfg.enname, e);
                        } else
                            Vue.set(a, cfg.enname, cfg.dfvalue);
                    }
                }
                else
                    Vue["delete"](a, cfg.enname);
            }
            PDPDesign.Execute.refresh();
        }
    }
});