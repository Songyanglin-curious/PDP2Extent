/*v=1.20.709.2*/
Ysh.Tree = {
    create: function (options) {
        var tree = options;
        tree.setTreeNode = function (node) {
            if (node.expand === undefined)
                node.expand = options.expand;
            node.getId = function () { var id = this.__id; return (typeof id == "undefined") ? "" : id; }
            node.find = function (id) {
                var thisid = this.getId();
                if (thisid == id)
                    return this;
                if (!this.children)
                    return null;
                for (var i = 0; i < this.children.length; i++) {
                    var o = this.children[i].find(id);
                    if (o != null)
                        return o;
                }
                return null;
            };
            node.forEach = function (f) {
                if (f(this))
                    return true;
                if (!this.children)
                    return;
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].forEach(f))
                        return true;
                }
            };
            node.search = function (f) {
                if (f(this))
                    return this;
                if (!this.children)
                    return null;
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    var item = child.search(f);
                    if (item != null)
                        return item;
                }
                return null;
            }
        };
        tree.add1 = function (data, columns, idcol, pcol, titlecol, fExtend) {
            var length = data.length;
            do {
                length = data.length;
                var notmatch = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var pid = item[pcol]
                    var node = this.find(pid);
                    if (node != null) {
                        if (!node.children)
                            node.children = [];
                        var obj = Ysh.Array.toObject(item, columns);
                        this.setTreeNode(obj);
                        obj.title = item[titlecol];
                        obj.label = obj.title;
                        obj.iconSkin = "icon1";
                        obj.__id = item[idcol];
                        obj.__data = item;
                        if (fExtend)
                            fExtend(obj);
                        node.children.push(obj);
                    } else {
                        notmatch.push(item);
                    }
                }
                data = notmatch;
            } while (data.length > 0 && data.length != length);
        }
        tree.add = function (data, columns, idcol, pcol, titlecol, fExtend) {
            var length = data.length;
            var pNodes = [this];
            do {
                length = data.length;
                var notmatch = [];
                var newNodes = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var pid = item[pcol]
                    var node = this.find(pid);
                    if ((node != null)&&(pNodes.indexOf(node)>=0)) {
                        if (!node.children)
                            node.children = [];
                        var obj = Ysh.Array.toObject(item, columns);
                        this.setTreeNode(obj);
                        obj.title = item[titlecol];
                        obj.label = obj.title;
                        obj.iconSkin = "icon1";
                        obj.__id = item[idcol];
                        obj.__data = item;
                        if (fExtend)
                            fExtend(obj);
                        node.children.push(obj);
                        newNodes.push(obj);
                    } else {
                        notmatch.push(item);
                    }
                }
                data = notmatch;
                pNodes = newNodes;
            } while (data.length > 0 && data.length != length && pNodes.length > 0);
        };
        tree.setTreeNode(tree);
        return tree;
    },
    toData: function (array2d, columns, idcol, pcol, titlecol, groupcols, options) {
        options = options || { expand: false, autoselect: false };
        var fExpand = options.fExpand;
        var tree = this.create(options);
        if (pcol < 0) {
            tree.children = [];
            for (var i = 0; i < array2d.length; i++) {
                var item = array2d[i];
                var obj = Ysh.Array.toObject(item, columns);
                tree.setTreeNode(obj);
                obj.title = item[titlecol];
                obj.label = obj.title;
                obj.__id = item[idcol];
                tree.children.push(obj);
            }
        } else {
            tree.add(array2d, columns, idcol, pcol, titlecol, fExpand);
        }
        if (groupcols && (groupcols.length > 0)) {
            function groupChildren(node, groupcol) {
                if (node.__id == "__group__") {
                    if (node.__group == groupcol)
                        return;
                }
                var newChildren = [];
                var temp = {};
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    if (child.__id == "__group__") { //是分组的内容，不必再分组
                        newChildren.push(child);
                        continue;
                    }
                    var group = child[groupcol];
                    if ((group === undefined) || (group === "")) {
                        newChildren.push(child);
                        continue;
                    }
                    if (!temp[group]) {
                        var groupnode = { __id: "__group__", __group: groupcol, label: group, title: group, children: [] };
                        tree.setTreeNode(groupnode);
                        newChildren.push(groupnode);
                        temp[group] = groupnode;
                    }
                    temp[group].children.push(child);
                }
                node.children = newChildren;
            }
            for (var i = 0; i < groupcols.length; i++) {
                tree.forEach(function (node) {//对所有子节点按groupcols进行分组
                    if (!node.children)
                        return;
                    groupChildren(node, groupcols[i]);
                });
            }
        }
        if (!tree.children) return [];
        if (tree.children.length == 0) return [];
        tree.getParent = function () { return null; }
        tree.forEach(function (node) {
            if (!node.children) return;
            for (var i = 0; i < node.children.length; i++) {
                node.children[i].getParent = function () { return node; }
            }
        });
        if (typeof fExpand == "function") {
            tree.forEach(function (node) {
                node.expand = fExpand(node);
                if (node.expand) {
                    node = node.getParent();
                    while (node) {
                        node.expand = true;
                        node = node.getParent();
                    }
                }
            });
        }
        if (options.autoselect) {
            tree.forEach(function (node) {
                var selected = false;
                if (typeof tree.autoselect == "function") {
                    selected = tree.autoselect(node);
                }
                else {
                    selected = !node.children;
                }
                if (selected) {
                    node.selected = true;
                    node = node.getParent();
                    while (node) {
                        node.expand = true;
                        node = node.getParent();
                    }
                    return true;
                }
            });
        }
        return tree.children;
    }
}

Vue.component('lazytree', {
    props: ["data","selected","deep"],
    data: function () {
        return { data1:[] };
    },
    methods: {
        loadData: function (item, callback) {
            //window.setTimeout(function() {
            callback(item.children1);
            //}, 100);
        },
        on_select_change: function (nodes) {
            this.$emit("on-select-change", nodes);
        },
        clone_dump: function (obj) {
            var o = {};
            for (var k in obj) {
                var v = obj[k];
                if (k != "children") {
                    o[k] = v;
                    continue;
                }
                if (!v) continue;
                var arr = [];
                for (var i = 0; i < v.length; i++) {
                    arr.push(this.clone(v[i]));
                }
                o.expand = true;
                o.loading = false;
                o.children = [];
                o.children1 = arr;
            }
            return o;
        },
        resetData: function () {
            var d = this.data;
            if ((!d) || (d.length == 0)) return [];
            var tree = d[0].getParent();
            var nodeSelected = null;
            if (this.selected)
                nodeSelected = tree.find(this.selected);
            tree.getDeep = function () { return 0; }
            tree.forEach(function (node) {
                node.selected = false;
                if (!node.getDeep)
                    node.getDeep = function () { return this.getParent().getDeep() + 1; }
            });
            var deep = parseInt(this.deep || 0);
            tree.forEach(function (node) {
                if (node.getDeep() >= deep) {
                    node.children1 = node.children;
                    node.children = [];
                    node.loading = false;
                } else {
                    node.expand = true;
                }
            });
            var node = nodeSelected;
            if (node) {
                node.selected = true;
                node = node.getParent();
                while (node) {
                    node.expand = true;
                    if (node.children1)
                        node.children = node.children1;
                    if (node.loading === false)
                        delete node.loading;
                    node = node.getParent();
                }
            }
            return tree.children;
        }
    },
    created: function () {
        this.data1 = this.resetData();
    },
    watch: {
        data: function () {
            this.data1 = this.resetData();
        }
    },
    template: `<Tree @on-select-change="on_select_change" :load-data="loadData" :data="data1">
        </Tree>`
});