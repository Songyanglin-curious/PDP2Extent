Vue.component('flow-item-operator', {
    data: function () {
        return {
            id:"",
            showInvalid: false, invalidReason: "",
            showKickBack: false, kickbackNode: "", kickbackType: 0, kickbackReason: ""
        };
    },
    props: {
        "flowid": {
            type: String
        }, "itemid": {
            type: String,
            "default": ""
        }, "nodeid": {
            type: String,
            "default": ""
        }, "fsave": {
            type: Function
        }, "fcheck": {
            type: Function
        }, "flowdata": {
            type: Array,
            "default":["",""]
        }, "privs": {
            type: Array,
            "default":[]
        }
    },
    computed: {
        showid: function () { return this.id || this.itemid; },
        needPrint: function () { return this.hasPriv("Print"); },
        needExport: function () { return this.hasPriv("Export"); },
        needSeeHis: function () { return this.hasPriv("SeeHistory"); },
        canSave: function () { return this.hasPriv("FLOW_SAVE"); },
        canDelete: function () { return this.hasPriv("FLOW_DELETE"); },
        canGetBack: function () { return this.hasPriv("FLOW_GETBACK"); },
        canKickBack: function () { return this.hasPriv("FLOW_KICKBACK"); },
        canInvalid: function () { return this.hasPriv("FLOW_INVALID"); },
        content: function () { return this.flowdata.length > 0 ? this.flowdata[0] : ""; },
        script: function () { return this.flowdata.length > 1 ? this.flowdata[1] : ""; }
    },
    methods: {
        refresh: function () {
            if (this.script != "") {
                var vmItem = this;
                eval(this.script);
            }
            //控制权限，怎么搞？
        }, hasPriv: function (p) {
            return this.privs.indexOf(p) >= 0;
        }, onPrint: function () {
            this.$emit("print");
        }, onExport: function () {
            this.$emit("export");
        }, onSeeHis: function () {
            Ysh.Vue.dialog(this, "/workflow/itemchart.aspx?flowid=" + this.flowid + "&itemid=" + this.showid + "&a=" + new Date(), { title: "流程审计", width: "80%", height: "700px" });
        }, onSave: function () {
            if (!this.fsave) {
                alert("没有保存操作，请联系开发商");
                return;
            }
            var dlls = [];
            this.fsave(dlls);//第一个dll必须返回单子id
            var itemid = this.showid;
            if (itemid == "") {
                itemid = { ref: "0", value: -1, type: "string" }; //第一个调用的返回值
            }
            dlls.push({ type: "dll", "dll": "PDP2.0:FlowServer.Deal.Save", "args": [this.flowid, itemid, this.nodeid, itemid != this.showid] });
            var ret = PDP.exec(dlls);
            if (ret.check("保存")) {
                if (this.showid == "") {
                    this.id = ret.value[0];
                    this.$emit("change", this.id);
                    window.location.href = window.location.href + (window.location.href.indexOf('?') > 0 ? '&' : '?') + "itemid=" + this.id;
                }
            }
        }, onDelete: function () {
            PDP.dll("PDP2.0:FlowServer.Deal.Delete", [this.flowid, this.showid, this.nodeid]).check("删除");
            //跳回上一个页面
        }, onGetBack: function () {
            if (PDP.dll("PDP2.0:FlowServer.Deal.GetBack", [this.flowid, this.showid, this.nodeid]).check("取回"))            
                window.location.reload();//重新加载
        }, onKickBack: function () {
            this.showKickBack = true;
        }, doKickBack: function () {
            //this.kickba
        }, onInvalid: function () {
            this.showInvalid = true;
        }, doInvalid: function () {
            if (this.invalidReason == "") {
                alert("请填写作废原因");
                return;
            }
            if (PDP.dll("PDP2.0:FlowServer.Deal.Invalid", [this.flowid, this.showid, this.nodeid, this.invalidReason]).check("作废")) {
                this.showInvalid = false;
                window.location.reload();//重新加载
            }
        },
        onPass: function (xml) {
            if (!this.fsave) {
                alert("没有保存操作，请联系开发商");
                return;
            }
            var dlls = [];
            this.fsave(dlls);
            var itemid = this.showid;
            if (itemid == "") {
                itemid = { ref: "0", value: -1, type: "string" };
                dlls.push({ type: "dll", "dll": "PDP2.0:FlowServer.Deal.Save", "args": [this.flowid, itemid, this.nodeid, true] });
            }
            dlls.push({ type: "dll", "dll": "PDP2.0:FlowServer.Deal.Pass", "args": [this.flowid, itemid, this.nodeid, escape(xml).replace(/%20/g, " ").replace(/\+/g, '%2B')] });
            var ret = PDP.exec(dlls);
            if (ret.check("提交")) {
                if (this.showid == "") {
                    this.id = ret.value[0];
                    this.$emit("change", this.id);
                    window.location.href = window.location.href + (window.location.href.indexOf('?') > 0 ? '&' : '?') + "itemid=" + this.id;
                } else {
                    window.location.reload();
                }
            }
        }
    },
    beforeMount: function () {
        this.getData();
    },
    mounted: function () {
        var o = this;
        window["flowClickPass" + this.flowid] = function (xml) {
            o.onPass(xml);
        }
        window["flowCheckPass" + this.flowid] = function () {
            return true;
        }
        this.refresh();
    },
    template: '#itemoperator_template'
});