Vue.component('flow-item-operator', {
    data: function () {
        return {
            id:"",node:"",
            content: "", script: "", privs: [],
            showInvalid: false, invalidReason: "",
            showKickBack: false, kickbackNode: "", kickbackType: 0, kickbackReason: "",
            arrBackNodes: [], arrBackTypes: [], oTypeObj: {}
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
        }, "fdelete": {
            type: Function
        }, "fcheck": {
            type: Function
        }
    },
    computed: {
        showid: function () { return this.id || this.itemid; },
        shownode: function () { return this.node || this.nodeid; },
        needPrint: function () { return this.hasPriv("Print"); },
        needExport: function () { return this.hasPriv("Export"); },
        needSeeHis: function () { return this.hasPriv("SeeHistory"); },
        canSave: function () { return this.hasPriv("FLOW_SAVE"); },
        canDelete: function () { return this.hasPriv("FLOW_DELETE"); },
        canGetBack: function () { return this.hasPriv("FLOW_GETBACK"); },
        canKickBack: function () { return this.hasPriv("FLOW_KICKBACK"); },
        canInvalid: function () { return this.hasPriv("FLOW_INVALID"); }
    },
    methods: {
        getData: function () {
            /*
             * 根据单子节点信息获取数据：
             * 1. 流转操作HTML
             * 2. 流转操作脚本
             * 3. 页面权限
             */
            var ret = PDP.dll("PDP2.0:FlowServer.Deal.Get", [this.flowid, this.showid, this.shownode]);
            if (!ret.check("获取单子流转信息", true))
                return;
            ret = ret.value[0];
            this.content = ret[0];
            this.script = ret[1];
            this.privs = ret[2];
            this.node = ret[3];
        }, refresh: function () {
            if (this.script != "") {
                var vmItem = this;
                eval(this.script);
            }
            for (var i = 0; i < this.privs.length; i++) {
                this.$parent[this.privs[i] + "_disabled"] = false;
            }
        }, hasPriv: function (p) {
            return this.privs.indexOf(p) >= 0;
        }, onPrint: function () {
            this.$emit("print");
        }, onExport: function () {
            this.$emit("export");
        }, onSeeHis: function () {
            Ysh.Vue.dialog(this, "/w/itemchart.aspx?flowid=" + this.flowid + "&itemid=" + this.showid + "&a=" + new Date(), { title: "流程审计", width: "80%", height: "700px" });
        }, onSave: function () {
            if (this.fcheck instanceof Function) {
                if (!this.fcheck())
                    return;
            }
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
            dlls.push({ type: "dll", "dll": "PDP2.0:FlowServer.Deal.Save", "args": [this.flowid, itemid, this.shownode, itemid != this.showid] });
            var ret = PDP.exec(dlls);
            if (ret.check("保存")) {
                if (this.showid == "") {
                    this.id = ret.value[0];
                    //this.$emit("change", this.id);
                    window.location.href = window.location.href + (window.location.href.indexOf('?') > 0 ? '&' : '?') + "itemid=" + this.id;
                } else {
                    window.location.reload();
                }
            }
        }, onDelete: function () {
            if (!confirm("确定删除此单子？"))
                return;
            var dlls = [];
            if (this.fdelete) {
                this.fdelete(dlls);
            }
            dlls.push({ type: "dll", "dll": "PDP2.0:FlowServer.Deal.Delete", "args": [this.flowid, this.showid, this.shownode] });
            PDP.exec(dlls).check("删除");
            //跳回上一个页面
            window.history.back(-1);
        }, onGetBack: function () {
            if (PDP.dll("PDP2.0:FlowServer.Deal.GetBack", [this.flowid, this.showid, this.shownode]).check("取回"))
                window.location.reload();//重新加载
        }, onKickBack: function () {
            var ret = PDP.dll("PDP2.0:FlowServer.Deal.GetKickBackInfo", [this.flowid, this.showid, this.shownode]);
            if (!ret.check("获取打回信息", true))
                return;
            ret = ret.value[0];
            this.arrBackNodes = ret[0];
            this.arrBackTypes = ret[1];
            var arr = ret[2];
            var o = {}
            for (var i = 0; i < arr.length; i++)
                o[arr[0]] = arr[1];
            this.oTypeObj = o;
            this.kickbackNode = ret[3];
            this.showKickBack = true;
        }, changeKickBackNode: function () {
            var strBackNode = this.kickbackNode;
            var arrBackNode = strBackNode.split(",");
            var trPrevNodes = this.$refs.prevnodes;
            if (arrBackNode.length < 2) {
                trPrevNodes.style.display = "none";
                trPrevNodes.cells[1].innerHTML = "";
            } else {
                trPrevNodes.style.display = "";
                var html = [];
                for (var i = 0; i < arrBackNode.length; i += 2)
                    html.push("<input type='checkbox' checked value='" + arrBackNode[i] + "' />" + arrBackNode[i + 1]);
                trPrevNodes.cells[1].innerHTML = html.join("<br>");
            } 
        }, doKickBack: function () {
            if (this.kickbackReason == "") {
                alert("请填写详细原因");
                return;
            }
            var strBackNode = this.kickbackNode;
            var arrBackNode = strBackNode.split(",");
            var trPrevNodes = this.$refs.prevnodes;
            if (arrBackNode.length > 1) {
                var selected = [];
                for (var i = 0; i < trPrevNodes.cells[1].children.length; i++) {
                    var o = trPrevNodes.cells[1].children[i];
                    if (o.checked)
                        selected.push(o.value);
                }
                strBackNode = selected.join(",");
            }
            if (strBackNode == "") {
                alert("请选择打回步骤！");
                return;
            }
            var strBackType = this.kickbackType;
            if ((strBackType == "") || (strBackType == "0")) {
                alert("请选择原因类型！");
                return;
            }
            if (PDP.dll("PDP2.0:FlowServer.Deal.KickBack", [this.flowid, this.showid, this.shownode, strBackNode, strBackType, this.kickbackReason]).check("打回")) {
                this.showKickBack = false;
                window.location.reload();//重新加载
            }
        }, onInvalid: function () {
            this.showInvalid = true;
        }, doInvalid: function () {
            if (this.invalidReason == "") {
                alert("请填写作废原因");
                return;
            }
            if (PDP.dll("PDP2.0:FlowServer.Deal.Invalid", [this.flowid, this.showid, this.shownode, this.invalidReason]).check("作废")) {
                this.showInvalid = false;
                window.location.reload();//重新加载
            }
        },
        onPass: function (xml) {
            if (this.fcheck instanceof Function) {
                if (!this.fcheck())
                    return;
            }
            if (!this.fsave) {
                alert("没有保存操作，请联系开发商");
                return;
            }
            var dlls = [];
            this.fsave(dlls);
            var itemid = this.showid;
            if (itemid == "") {
                itemid = { ref: "0", value: -1, type: "string" };
                dlls.push({ type: "dll", "dll": "PDP2.0:FlowServer.Deal.Save", "args": [this.flowid, itemid, this.shownode, true] });
            }
            dlls.push({ type: "dll", "dll": "PDP2.0:FlowServer.Deal.Pass", "args": [this.flowid, itemid, this.shownode, escape(xml).replace(/%20/g, " ").replace(/\+/g, '%2B')] });
            var ret = PDP.exec(dlls);
            if (ret.check("提交")) {
                if (this.showid == "") {
                    this.id = ret.value[0];
                    //this.$emit("change", this.id);
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