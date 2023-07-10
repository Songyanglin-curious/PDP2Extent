
var vmCtrl = new Vue({
    el: '#divCtrl',
    data: {
        selected: "", opened: [], layout: layout, inits: [], privs: [], consts: [], datasources: [], dlls: []
        , page: null, searchstring: "", searchTag: "none"
    },
    computed: {
        ctrltree: function () {
            var tree = this.getTree(this.page, this.selectedNode);
            return tree;
        }, tags: function () {
            var tags = { "none": "未指定" }
            for (var i = 0; i < PDPObject.all.length; i++) {
                var group = PDPObject.all[i];
                for (var j = 0; j < group.list.length; j++) {
                    var t = group.list[j];
                    if (this.isUsed(this.page, t.tag))
                        tags[t.tag] = t.desc;
                }
            }
            return tags;
        }
    },
    methods: {
        SelectMenu: function (name) {
            var obj = PDPDesign.page.find(name);
            if (obj && obj.tag) {
                vmProp.ctrlName = obj.tag + "_prop";
                vmProp.data = obj;
            }
        }, locate: function (id) {
            this.selected = id;
            var o = this;
            this.$nextTick(function () {
                o.$refs.menu.updateOpened()
                o.$refs.menu.updateActiveName()
                o.SelectMenu(id);
            });
        },
        del: function (arr, id, type) {
            this.$Modal.confirm({
                title: "删除", content: "删除" + type + "会清空关联绑定的内容，是否继续？", onOk: function () {
                    /*先删除对应的绑定*/
                    PDPDesign.page.deleteBind(id);
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].id == id) {
                            arr.splice(i, 1);
                            return;
                        }
                    }
                }
            });
        },
        addPriv: function () {
            var priv = PDPDesign.page.newPriv({ desc: "新权限", arg: "" });
            this.locate(priv.id);
        },
        addInit: function () {
            var init = PDPDesign.page.newInit({ desc: "新参数", type: "request", arg: "" });
            this.locate(init.id);
        }, addConst: function () {
            var cc = PDPDesign.page.newConst({ desc: "新变量", type: "string", arg: "" });
            this.locate(cc.id);
        }, addDataSource: function () {
            vmDataSource.dataSource = {};
            vmDataSource.dataIndex = -1;
            vmDataSource.show();
        }, editDataSource: function (index) {
            vmDataSource.dataSource = JSON.parse(JSON.stringify(vmCtrl.datasources[index])); //深拷贝
            vmDataSource.dataIndex = index;
            vmDataSource.show();
        }, addDll: function () {
            vmDll.dll = {};
            vmDll.dataIndex = -1;
            vmDll.show();
        }, editDll: function (index) {
            vmDll.dll = JSON.parse(JSON.stringify(vmCtrl.dlls[index]));
            vmDll.dataIndex = index;
            vmDll.show();
        }, select: function (obj) {
            this.opened = this.$refs.menu.openedNames.splice(0);
            switch (obj.tag) {
                case "init":
                    this.opened.push("init");
                    break;
                case "const":
                    this.opened.push("const");
                    break;
                default:
                    break;
            }
            this.locate(obj.id);
        }, drag: function (id, tag, event) {
            event.stopPropagation();
            PDPDesign.page.moveStart({ id: id, tag: tag });
        }, getDragStr: function (id, tag) {
            return "vmCtrl.drag('" + id + "','" + tag + "',event)";
        }, getTree: function (o, fSel) {
            if (o == null)
                return [];
            var ctrl = PDPObject.get(o.tag);
            if (null == ctrl) {
                alert(o.tag + "未定义");
                return [];
            }
            var title = ctrl.desc + " " + (o.desc || "无名");
            var sel = false;
            if (fSel) sel = fSel(o);
            if (!o.c)
                return [{ title: title, id: o.id, selected: sel }];
            var children = [];
            for (var i = 0; i < o.c.length; i++) {
                children.push(this.getTree(o.c[i], fSel)[0]);
            }
            return [{ title: title, id: o.id, expand: true, children: children, selected: sel }];
        }, selectTree: function (o) {
            if (o.length == 0)
                return;
            if (!o[0]) {
                return;
            }
            PDPDesign.Event.click(o[0].id, true);
        }, selectedNode: function (o) {
            if (this.searchTag == "none") {
                if (this.searchstring == "")
                    return false;
            } else {
                if (o.tag != this.searchTag)
                    return false;
            }
            if (this.searchstring == "")
                return true;
            if (!o.desc)
                return false;
            return o.desc.indexOf(this.searchstring) >= 0;
        }, isUsed: function (o, tag) {
            if (!o)
                return false;
            if (o.tag == tag)
                return true;
            if (!o.c)
                return false;
            for (var i = 0; i < o.c.length; i++) {
                var used = this.isUsed(o.c[i], tag);
                if (used)
                    return true;
            }
            return false;
        }
    }
});