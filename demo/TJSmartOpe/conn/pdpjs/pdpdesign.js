Vue.directive("design", {
    bind: function (el, binding, vnode) {
        const id = binding.value.id;
        const tag = binding.value.tag;
        el.ondragenter = function (event) { }
        el.ondragleave = function (event) { }
        el.ondrop = function (event) {
            event.stopPropagation();
            event.preventDefault();
            PDPDesign.page.moveEnd({ id: id, tag: tag, e: event });
        }
        el.ondragover = function (event) {
            event.stopPropagation();
            if (PDPDesign.page.canMove({ id: id, tag: tag,e:event }))
                event.preventDefault();
            PDPDesign.Event.moveAt(id);
        }
        el.onmouseover = function (event) {
            event.stopPropagation(); PDPDesign.Event.moveAt(id);
        }
        el.onmouseout = function (event) {
            event.stopPropagation(); PDPDesign.Event.restoreMove(id);
        }
        el.onclick = function (event) {
            event.stopPropagation();
            PDPDesign.Event.click(id, true);
        }
        document.onkeydown = function (e) {
            e = window.event || e;
            e.stopPropagation();
            if (event.ctrlKey == 1) {
                switch (e.keyCode) {
                    case 37: //左
                        //var ctrl = PDPDesign.page.find(id);
                        var ctrl = vmProp.data;
                        PDPDesign.Assist.setUnit(ctrl, "a", "s_margin-left", -1, "px");
                        break;
                    case 38: //上
                        var ctrl = vmProp.data;
                        if (ctrl.a && ctrl.a.s_position) {
                            PDPDesign.Assist.setUnit(ctrl, "a", "s_top", -5, "px");
                        } else {
                            PDPDesign.Assist.set(ctrl, "a", "s_position", "relative");
                            PDPDesign.Assist.setUnit(ctrl, "a", "s_top", -5, "px");
                        }
                        break;
                    case 39: //右
                        var ctrl = vmProp.data;
                        PDPDesign.Assist.setUnit(ctrl, "a", "s_margin-left", 1, "px");
                        break;
                    case 40: //下
                        var ctrl = vmProp.data;
                        if (ctrl.a && ctrl.a.s_position) {
                            PDPDesign.Assist.setUnit(ctrl, "a", "s_top", 5, "px");
                        } else {
                            PDPDesign.Assist.set(ctrl, "a", "s_position", 'relative');
                            PDPDesign.Assist.setUnit(ctrl, "a", "s_top", 5, "px");
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
});

var PDPDesign = {
    file: '',
    editList: [],
    page: null,
    Assist: {
        containsXmlKey: function (s) { const keys = "<>\"\r\n&"; for (var i = 0; i < keys.length; i++) { const k = keys[i]; if (s.indexOf(k) >= 0) return true; }; return false; },
        clone: function (obj) {
            if (obj instanceof Array) {
                var o = [];
                var i = obj.length;
                while (i--)
                    o[i] = this.clone(obj[i]);
                return o;
            }
            if (obj instanceof Function)
                return obj;
            if (obj instanceof Object) {
                var o = {};
                for (var k in obj) {
                    if ((k == "id") && (obj.tag)) {
                        o[k] = PDPDesign.page.newId(obj.tag)
                        o.__id = o.id;
                    } else {
                        o[k] = this.clone(obj[k]);
                    }
                }
                return o;
            }
            return obj;
        },
        keys: function (o) {
            var ret = [];
            if (o instanceof Object) {
                for (var k in o) {
                    var v = o[k];
                    if (v instanceof Function)
                        continue;
                    ret.push(k);
                }
            }
            return ret;
        },
        appendKeys: function (arr, o) {
            if (o instanceof Object) {
                for (var k in o) {
                    if (arr.indexOf(k) >= 0)
                        continue;
                    var v = o[k];
                    if (v instanceof Function)
                        continue;
                    arr.push(k);
                }
            }
        },
        set: function (o, s, k, v) {
            if (!o)
                return;
            if (!o[s]) {
                Vue.set(o, s, {});
                //o[s] = {};
                this.defineXml(o[s], s);
            }
            if (o[s][k] == v)
                return;
            Vue.set(o[s], k, v);
            //o[s][k] = v;
            PDPDesign.Execute.refresh();
        },
        getUnit: function (o, s, k, u, d) {
            if (!o) return d;
            if (!o[s]) return d;
            var v = o[s][k];
            if (!v) return d;
            if (!u)
                return v;
            if (v.endsWith(u))
                return parseInt(v.left(v.length - u.length), 10);
            return d;
        },
        setUnit: function (o, s, k, v, u, d) {
            if (!o)
                return;
            if (!o[s]) {
                Vue.set(o, s, {});
                //o[s] = {};
                this.defineXml(o[s], s);
            }
            var _v = o[s][k];
            if (u) {
                if ((!_v) || (!_v.endsWith(u))) {
                    //o[s][k] = v + u;
                    Vue.set(o[s], k, v + u);
                } else {
                    Vue.set(o[s], k, (parseInt(_v.left(_v.length - u.length), 10) + v) + u);
                    //o[s][k] = (parseInt(_v.left(_v.length - u.length), 10) + v) + u;
                }
            } else {
                if (!_v)
                    _v = d;
                Vue.set(o[s], k, _v + v);
                //o[s][k] = _v + v;
            }
            PDPDesign.Execute.refresh();
        },
        defineXml: function (o, tag) {
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++)
                    this.defineXml(o[i], tag.length == 0 ? o[i].tag : (tag[tag.length - 1] == "s" ? tag.substr(0, tag.length - 1) : tag));
                return;
            }
            for (var k in o) {
                var v = o[k];
                if (v instanceof Object) {
                    if ((k == "ctrls") || (k == "c"))
                        this.defineXml(v, "");
                    else
                        this.defineXml(v, k);
                }
            }
            o.getXml = function () {
                if (this._isRef) //从别的文件引用过来的
                    return "";
                var attrs = "";
                var subs = "";
                for (var k in this) {
                    var v = this[k];
                    if (k == "tag")
                        continue;
                    if (v instanceof Function)
                        continue;
                    if (k == "id") {
                        if (this.__id == v)
                            continue;//自动生成的不保存
                    }
                    if (v instanceof Array) {
                        if ((k[k.length - 1] == "s") || (k == "c")) {
                            var xml = "";
                            for (var i = 0; i < v.length; i++) {
                                if (!v[i].getXml)
                                    debugger
                                xml += v[i].getXml();
                            }
                            if (xml != "")
                                subs += "<" + k + ">" + xml + "</" + k + ">";
                        } else {
                            for (var i = 0; i < v.length; i++) {
                                if (!v[i].getXml)
                                    debugger
                                subs += v[i].getXml();
                            }
                        }
                        continue;
                    }
                    if (v instanceof Object) {
                        if (!v.getXml)
                            debugger
                        subs += v.getXml(); //"<" + k + ">" + v.getXml() + "</" + k + ">";
                        continue;
                    }
                    if ((!v) && (v !== 0) && (v !== false))
                        continue;
                    v = v.toString();
                    if (PDPDesign.Assist.containsXmlKey(v))
                        subs += "<" + k + "><![CDATA[" + v + "]]></" + k + ">";
                    else
                        attrs += " " + k + "=\"" + v + "\"";
                }
                if ((attrs != "") || (subs != ""))
                    return "<" + tag + attrs + ">" + subs + "</" + tag + ">";
                return "";
            }
        },
        find: function (o, k, v) {
            if (!o)
                return null;
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++) {
                    var r = this.find(o[i], k, v);
                    if (r != null)
                        return r;
                }
            }
            if (o instanceof Object) {
                if (o[k] == v)
                    return o;
                return this.find(o.c, k, v);
            }
            return null;
        },
        setParent: function (s, p) { s.getParent = function () { return p; } }, /*为了生成xml，不直接用属性*/
        defineParent: function (ctrl, p) {
            if (!ctrl)
                return;
            if (ctrl instanceof Array) {
                for (var i = 0; i < ctrl.length; i++)
                    this.defineParent(ctrl[i], p);
                return;
            }
            this.setParent(ctrl, p);
            this.defineParent(ctrl.c, ctrl);
            this.defineParent(ctrl.cols, ctrl);
        },
        fillId: function (ctrl, page) {
            if (!ctrl.id) {
                ctrl.id = page.newId(ctrl.tag);
                ctrl.__id = ctrl.id;
            }
            if (!ctrl.c)
                return;
            for (var i = 0; i < ctrl.c.length; i++)
                this.fillId(ctrl.c[i], page);
        },
        initPage: function (page) {
            page.newId = function (tag) { this.maxid++; return tag + this.maxid; }
            this.defineXml(page, "root");
            this.defineParent(page.ctrls, null);
            this.defineParent(page.datasources, null);
            this.defineParent(page.dlls, null);
            var o = this;
            page.find = function (id) {
                if (!id) return null;
                var ctrl = o.find(this.ctrls, "id", id);
                if (ctrl != null) return ctrl;
                var init = o.find(this.inits, "id", id);
                if (init != null) { init.tag = "init"; return init; }
                var priv = o.find(this.privs, "id", id);
                if (priv != null) { priv.tag = "priv"; return priv; }
                var v = o.find(this.consts, "id", id);
                if (v != null) { v.tag = "const"; return v; }
                for (var i = 0; i < this.datasources.length; i++) {
                    var ds = this.datasources[i];
                    if (ds.id == id) {
                        ds.tag = "datasource";
                        return ds;
                    }
                    var col = o.find(ds.cols, "id", id);
                    if (col != null) { col.tag = "col"; return col; }
                }
                for (var i = 0; i < this.dlls.length; i++) {
                    var dll = this.dlls[i];
                    if (dll.id == id) {
                        dll.tag = "dll";
                        return dll;
                    }
                    var input = o.find(dll.inputs, "id", id);
                    if (input != null) { input.tag = "input"; return input; }
                    var output = o.find(dll.outputs, "id", id);
                    if (output != null) { output.tag = "output"; return output;  }
                }
                return null;
            }
            page.add = function (tag, obj, parent, index) {
                obj.id = this.newId(tag);
                obj.__id = obj.id;
                PDPDesign.Assist.defineXml(obj, tag);
                if (index)
                    parent.splice(index - 1, 0, obj);
                else
                    parent.push(obj);
                return obj;
            }
            page.log = function (msg) { document.getElementById("ta1").value = msg; }
            page.newInit = function (options) { return this.add("init", options || {}, this.inits); }
            page.newPriv = function (options) { return this.add("priv", options || {}, this.privs); }
            page.newConst = function (options) { return this.add("const", options || {}, this.consts); }
            page.newDataSource = function (options) { return this.add("datasource", options || {}, this.datasources); }
            page.newDLL = function (options) { return this.add("dll", options || {}, this.dlls); }
            page.newCtrl = function (options, parent, index) {
                if (!parent.c) parent.c = [];
                if (!options.c) options.c = []; if (!options.a) options.a = {}; if (!options.sa) options.sa = {};
                var ctrl = this.add(options.tag, options, parent.c, index);
                PDPDesign.Assist.fillId(ctrl, this);
                PDPDesign.Assist.defineParent(ctrl, parent);
                return ctrl;
            }
            page.moveObject = null;
            page.moveStart = function (src) { this.moveObject = src; }
            page.canMove = function (dest) {
                var src = this.moveObject;
                if (src == null)
                    return false;
                //src -- init,const,datasource,col,dll,ctrl
                //dest -- col,ctrl
                switch (dest.tag) {
                    case "col":
                        break;
                    default:
                        if (dest.field) { //绑定数据
                            return true;
                        } else { //拖拽控件
                            if (dest.e.ctrlKey)
                                return true;
                            var ctrlD = o.find(this.ctrls, "id", dest.id);
                            if (ctrlD == null)
                                return false;
                            var typeD = PDPObject.get(ctrlD.tag);
                            if (typeD == null)
                                return false;
                            var dReal = ctrlD;
                            while (typeD.isLogic) {
                                dReal = ctrlD.getParent();
                                typeD = PDPObject.get(dReal.tag);
                            }
                            if (!typeD.accept(src.tag))
                                return false;
                            var typeS = PDPObject.get(src.tag);
                            if (typeS == null)
                                return false;
                            if (!typeS.beAccept(dReal.tag))
                                return false;
                            if (!src.id) //新建
                                return true;
                            var ctrlS = o.find(this.ctrls, "id", src.id);
                            if (ctrlS != null) {//移动，检查是不是在路径上
                                //if (ctrlS.getParent() == ctrlD) //本来就在里边
                                //    return false;
                                var arrPath = PDPDesign.Assist.getCtrlPath(ctrlD);
                                return arrPath.indexOf(ctrlS) < 0;
                            }
                        }
                        break;
                }
                return true;
            }
            page.moveEnd = function (dest) {
                //src -- init,const,datasource,col,dll,ctrl
                //dest -- col,ctrl
                var src = this.moveObject;
                if (dest.field) {
                    //var ctrlD = this.find(dest.id);
                    ctrlD = dest.data;
                    Vue.set(ctrlD, dest.field, src.id);
                } else {
                    var ctrlD = o.find(this.ctrls, "id", dest.id);
                    if (src.id) {
                        var ctrlS = o.find(this.ctrls, "id", src.id);
                        if (dest.e.ctrlKey) {
                            ctrlS = PDPDesign.Assist.clone(ctrlS);
                        } else {
                            ctrlS.getParent().c.erase(ctrlS);
                        }
                        if (!ctrlD.c)
                            ctrlD.c = [];
                        if (dest.index)
                            ctrlD.c.splice(dest.index - 1, 0, ctrlS);
                        else
                            ctrlD.c.push(ctrlS);
                        PDPDesign.Assist.defineParent(ctrlS, ctrlD);
                    } else {
                        src = PDPDesign.page.newCtrl(src, ctrlD, dest.index);
                    }
                }
                this.moveObject = null;
                PDPDesign.Execute.refresh();
                if (!dest.field) {
                    PDPDesign.Event.click(dest.index ? dest.id : src.id, true);
                }
            }
            page.stopMove = function () { this.moveObject = null; }
            page.deleteBind = function (id) {
                var deleteBind = function (ctrl, id) {
                    if (ctrl.from == id)
                        ctrl.from = "";
                    if (ctrl.source == id)
                        ctrl.source = "";
                    for (var a in ctrl.sa) {
                        if (ctrl.sa[a] == id) {
                            ctrl.sa[a] = "";
                        }
                    }
                    if (!ctrl.c)
                        return;
                    for (var i = 0; i < ctrl.c.length; i++) {
                        deleteBind(ctrl.c[i], id);
                    }
                }
                for (var i = 0; i < this.ctrls.length; i++) {
                    deleteBind(this.ctrls[i], id);
                }
            }
        },
        getCtrlPath: function (ctrl) {
            var path = [];
            do {
                path.push(ctrl);
                ctrl = ctrl.getParent();
            }
            while (ctrl != null);
            path.reverse();
            return path;
        }
    },
    Event: {
        locateObject: null,
        locateBackup: null,
        moveObject: null,
        moveBackup: null,
        restoreMove: function (id) {
            if (null == this.moveObject)
                return;
            if (this.moveObject == this.locateObject) {
                this.moveObject.style.border = "solid 1px red";
            } else {
                this.moveObject.style.border = ((!this.moveBackup) ? "" : this.moveBackup);
            }
            this.moveObject = null;
        },
        restoreLocate: function (id) {
            if (null == this.locateObject)
                return;
            this.locateObject.style.border = ((!this.locateBackup) ? "" : this.locateBackup);
            this.locateObject = null;
        },
        moveAt: function (id) {
            var obj = document.getElementById(id);
            if (obj == this.moveObject)
                return;
            this.restoreMove();
            if (obj == null)
                return;
            this.moveObject = obj;
            this.moveBackup = obj.style.border;
            obj.style.border = "solid 1px blue";
            PDPDesign.page.log("\r\n move " + id);
        },
        located_id: "",
        locate: function (id) {
            this.located_id = id;
            var obj = document.getElementById(id);
            if (obj == this.locateObject)
                return;
            this.restoreLocate();
            if (obj == null)
                return;
            this.locateObject = obj;
            if (this.locateObject == this.moveObject)
                this.locateBackup = this.moveBackup;
            else
                this.locateBackup = obj.style.border;
            obj.style.border = "solid 1px red";
            PDPDesign.page.log("\r\n loacte " + id);
        }, click: function (id, bShowPath) {
            if (PDPDesign.page == null)
                return;
            var ctrl = PDPDesign.page.find(id);
            if ((null == ctrl) || (!ctrl.tag)) {
                return;
            }
            if (bShowPath) {
                vmSelected.ctrl = ctrl;
            }
            var type = PDPObject.get(ctrl.tag);
            vmProp.ctrlName = (type.prop || "base_ctrl") + "_prop";
            vmProp.data = ctrl;
            vmProp.args = type.args;
            vmMenu.data = ctrl;
            PDPDesign.Event.locate(id);
        }
    },
    Execute: {
        load: function () {
            if (PDPDesign.file == '') {
                alert("请选择文件");
                return;
            }
            var ret = PDP.dll("PDP2.0:PDP2.YshDocument.GetJson", [PDPDesign.file + ".xml"]);
            if (!ret.check("获取文件内容", true))
                return;
            eval("PDPDesign.page=" + ret.value[0] + ";");
            PDPDesign.Assist.initPage(PDPDesign.page);
        },
        viewobj: "",
        container: null,
        showobj: null,
        refresh: function () {
            this.preview(this.viewobj, this.container, this.showobj);
            PDPDesign.Event.locate(PDPDesign.Event.located_id);
        },
        urlFormat: function (str) {
            return escape(str).replace(/%20/g, " ").replace(/\+/g, '%2B');
            //return str.replace(/%/g, "%25").replace(/</g, "%3C").replace(/>/g, "%3E");
        },
        preview: function (ctrlid, parent, fullobj) {
            this.viewobj = ctrlid;
            if (!parent)
                parent = this.container;
            else
                this.container = parent;
            if (!fullobj)
                fullobj = this.showobj;
            else
                this.showobj = fullobj;
            if (PDPDesign.page == null) {
                alert("没有预览内容");
                return;
            }
            var xml = PDPDesign.page.getXml();
            xml = this.urlFormat(xml);
            var ret = PDP.exec({ noxss: 1, value: [{ type: "dll", "dll": "PDP2.0:PDP2.YshDocument.Preview", "args": [PDPDesign.file, xml, ctrlid] }] });
            if (!ret.check("预览", true))
                return;
            if (fullobj)
                fullobj.value = ret.value[0][0] + ret.value[0][1];
            var refs = ret.value[0][2];
            var fShow = function () {
                parent.innerHTML = ret.value[0][0];
                window.setTimeout(function () {
                    try {
                        eval(ret.value[0][1]);
                    } catch (E) {
                        alert(E.message);
                    }
                }, 300);
            }
            if (refs) {
                var arr = refs.split(",");
                Ysh.Refs.include(arr, function () {
                    fShow();
                });
            } else {
                fShow();
            }
        }, save: function () {
            var xml = PDPDesign.page.getXml();
            xml = this.urlFormat(xml);
            //PDP.exec({ noxss: 1, value: [{ type: "dll", "dll": "PDP2.0:PDP2.YshDocument.Save", "args": [PDPDesign.file, xml] }] }).check("保存");
            PDP.exec([{ type: "dll", "dll": "PDP2.0:PDP2.YshDocument.Save", "args": [PDPDesign.file, xml] }]).check("保存");
        }, public: function () {
            if (PDPDesign.file == '') {
                alert("请选择发布文件");
                return false;
            }
            var ret = PDP.dll("PDP2.0:PDP2.YshDocument.Public", [PDPDesign.file]);
            if (ret.check("发布")) {
                if (ret.value[0])
                    alert(ret.value[0]);
                return true;
            }
            return false;
        }
    }
}
