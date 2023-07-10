YshObject = {
    Create: function () {
        return { doc: null, id: "", name: "", desc: "", descr: "", alwaysenable: "", selfattr: { lockable: "" }, attrs: {}, styles: {}, children: [], parent: null, tag: "Unknown", datasource: null, events: {}, privs: {}, checks: {}, ctrl: null, IsEditable: false, isDelDeny: false, isCopyDeny: false, commonevents: {} };
    }
    , VerifyData: function (o) {
        if (!o["selfattr"]) o.selfattr = {};
        if (!o["attrs"]) o.attrs = {};
        if (!o["styles"]) o.styles = {};
        if (!o["children"]) o.children = [];
        if (!o["events"]) o.events = {};
        if (!o["privs"]) o.privs = {};
        if (!o["SetValue"]) o.SetValue = function (v) { };
        if (!o["GetValue"]) o.GetValue = function () {
            if (this.ctrl)
                return (this.IsEditable && (typeof this.ctrl.value != "undefined")) ? this.ctrl.value : this.ctrl.innerText;
            return null;
        };
        if (!o["checks"]) o.checks = {};
        if (!o["SetAttr"]) o.SetAttr = function (a, v) { this.attrs[a] = v; }
        if (!o["SetStyle"]) o.SetStyle = function (s, v) { this.styles[s] = v; }
        if (!o["SetEvent"]) o.SetEvent = function (e, v) { this.events[e] = v; }
        if (!o["SetPriv"]) o.SetPriv = function (p, v) { this.privs[p] = v; }
        if (!o["SetSelfAttr"]) o.SetSelfAttr = function (sa, v) { this.selfattr[sa] = v; }
        if (!o["GetText"]) o.GetText = function () { return this.GetValue(); }
        if (!o["SetDocument"]) o.SetDocument = function (doc) {
            this.doc = doc;
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].SetDocument(doc);
            }
        }
        if (!o["Set"]) o.Set = function (name, keys, values) {
            if (typeof keys == "undefined")
                this[name] = values;
            else if (isArray(keys)) {
                for (var i = 0; i < keys.length; i++)
                    this[name][keys[i]] = values[i];
            } else {
                this[name][keys] = values;
            }
        }
        if (!o["SetCtrlStyle"]) o.SetCtrlStyle = function (s, v) {
            if (!this.ctrl)
                return;
            this.ctrl.style[s] = v;
        }
        if (!o["commonevents"]) o.commonevents = {};
        if (!o["SetCommonEvent"]) o.SetCommonEvent = function (ce, v) { this.commonevents[ce] = v };
        if (!o["AttachEvent"]) o.AttachEvent = function (evt, act) {
            if (!this.attachevents) {
                this.attachevents = {};
            };
            if (!this.attachevents[evt])
                this.attachevents[evt] = [];
            this.attachevents[evt].push(act);
            this.ctrl.attachEvent(evt, act);
        };
        if (!o["ReAttachEvents"]) o.ReAttachEvents = function () {
            if (!this.attachevents)
                return;
            for (var k in this.attachevents) {
                var arrEvent = this.attachevents[k];
                for (var i = 0; i < arrEvent.length; i++)
                    this.ctrl.attachEvent(k, arrEvent[i]);
            }
        }
    }
    , ApplyYsh: function (ysh) {
        this.VerifyData(ysh);
        ysh.LinkList = function (lst, f) {
            return Ysh.Array.link(lst, f, "");
        }
        ysh.LinkObject = function (o, fToStr, fSkip) {
            return Ysh.Object.link(o, fToStr, "", fSkip);
        }
        ysh.LinkAttribute = function (lst, f) {
            return this.LinkObject(lst, f, function (k, v) { return (v === "") || (typeof v == "undefined"); });
        }
        ysh.GetDataXml = function () {
            if (!this.datasource)
                return "";
            var str = this.LinkAttribute(this.datasource, function (k, v) { return k + "=\"" + v + "\" "; });
            if (str != "")
                return "<d " + str + "></d>";
            return "";
        }
        ysh.GetXml = function () {
            var strSelf = this.LinkAttribute(this.selfattr, function (k, v) { if (v === "") return v; return "<" + k + "><![CDATA[" + v + "]]></" + k + ">" });
            var strAttrs = this.LinkAttribute(this.attrs, function (k, v) { if (v === "") return v; return "<" + k + "><![CDATA[" + v + "]]></" + k + ">" });
            var strStyles = this.LinkAttribute(this.styles, function (k, v) { if (v === "") return v; return "<" + k + ">" + v + "</" + k + ">" });
            var strChildren = this.LinkList(this.children, function (c) { return c.GetXml(); });
            var strEvent = this.LinkAttribute(this.events, function (k, v) { if (v === "") return v; return "<" + k + "><![CDATA[" + v + "]]></" + k + ">" });
            var strCommonEvent = this.LinkAttribute(this.commonevents, function (k, v) { if (v === "") return v; return "<" + k + "><![CDATA[" + v + "]]></" + k + ">" });
            var strChecks = this.LinkAttribute(this.checks, function (k, v) { if (v === "") return v; return "<chk type=\"" + k + "\"><![CDATA[" + v + "]]></chk>" });
            var strTRPri = this.LinkAttribute(this.privs, function (k, v) { if (v === "") return v; return "<" + k + "><![CDATA[" + v + "]]></" + k + ">" });
            var strXml = "<" + this.tag + ((this.id == "" || this.id.indexOf('_temp_id_') != -1) ? "" : " id=\"" + this.id + "\" ") + ((this.name == "") ? "" : " name=\"" + this.name + "\" ") + ((this.desc == "") ? "" : " desc=\"" + this.desc + "\" ") + (this.alwaysenable == "1" ? " alwaysenable=\"1\"" : "") + ">"
            + ((strSelf == "") ? "" : "<sa>" + strSelf + "</sa>")
            + ((strAttrs == "") ? "" : "<a>" + strAttrs + "</a>")
            + ((strStyles == "") ? "" : "<s>" + strStyles + "</s>")
            + ((strChildren == "") ? "" : "<c>" + strChildren + "</c>")
            + ((strEvent == "") ? "" : "<e>" + strEvent + "</e>")
            + ((strChecks == "") ? "" : "<dc>" + strChecks + "</dc>")
            + ((strTRPri == "") ? "" : "<p>" + strTRPri + "</p>")
            + ((strCommonEvent == "") ? "" : "<ce>" + strCommonEvent + "</ce>")
            + this.GetDataXml()
            + "</" + this.tag + ">";
            return strXml;
        }
        ysh.GetAttributesHtml = function () {
            var str = this.LinkAttribute(this.attrs, function (k, v) { return " " + k + "=\"" + v + "\"" });
            str += " style=\"";
            if (this.tag == "div") {
                str += " border:#b0aeae 1px dotted;";
            }
            if (this.tag == "span") {
                str += " border-width:1px;border-style:dotted;border-color:#b0aeae;";
            }
            var selfattr = this.selfattr;
            str += this.LinkAttribute(this.styles, function (k, v) {
                if (k == "display") //设计时都显示出来
                    return "";
                if ((k == "width") || (k == "height")) {
                    if ((typeof selfattr[k] != "undefined") && (selfattr[k] !== ""))
                        v = selfattr[k];
                }
                return " " + k + ":" + v + ";"
            });
            return str + "\"";
        }
        ysh.GetChildrenHtml = function () {
            return this.LinkList(this.children, function (obj) { return obj.GetHtml(); });
        }
        ysh.AddContentMenus = function (menulist) {
        }
        ysh.GetContextMenuList = function () {
            if (this.tag == "yshmasterpageitem" && currentMstPg == "id name") {
                this.isCopyDeny = true;
                this.isDelDeny = true;
            }
            var lst = [YSH_CreateContextMenu("selfinfo", this.desc + "(" + this.tag + ")", "", "")];
            lst.push(YSH_CreateContextMenu("edit", "编辑", "", "g_yshFactory.GetYshById(\"" + this.id + "\").Edit();"));
            if (!this.isDelDeny)
                lst.push(YSH_CreateContextMenu("del", "删除", "", "g_yshFactory.Delete(\"" + this.id + "\");"));
            if (!this.isCopyDeny)
                lst.push(YSH_CreateContextMenu("cut", "剪切", "", "g_yshFactory.Cut(\"" + this.id + "\");docDesign.Redraw();"));
            if (!this.isCopyDeny)
                lst.push(YSH_CreateContextMenu("copy", "复制", "", "g_yshFactory.Copy(\"" + this.id + "\");docDesign.Redraw();"));
            //表格配置
            if (this.tag == "table")
                lst.push(YSH_CreateContextMenu("setting", "配置表格", "", "g_yshFactory.TableSetting(\"" + this.id + "\");docDesign.Redraw();"));
            this.AddContentMenus(lst);
            return lst;
        }
        ysh.GetAttributesXml = function () {
            return "";
        }
        ysh.GetInnerXml = function () {
            return "";
        }
        ysh.GetHtml = function () {
            return "";
        }
        ysh.Edit = function () {
            var dialogURL = "PropSetDlg.aspx?tag=" + this.tag;
            var dialog = window.showModalDialog(dialogURL, this, "dialogWidth:800px; dialogHeight:700px; center:yes; help:no; resizable:no; status:no");

            if (typeof dialog != "undefined") {
                var name = this.name;
                var id = this.id;
                if ($("#floatButtons").length > 0) {
                    var position = new Object();
                    position.x = $("#floatButtons").css("left");
                    position.y = $("#floatButtons").css("top");
                }
                this.doc.Redraw();
                var ysh = id.indexOf("#") == -1 ? g_yshFactory.GetYshById(id) : g_yshFactory.GetYshByName(name)[0];
                if (position == undefined)
                    position = null;
                SelectThis(ysh.id, position);
            }
        }
        ysh.Display = function (domP) {
            var p = g_yshFactory.GetYsh(domP);
            if (p && (p.children.length == 1) && (p.children[0] == this)) {
                domP.innerHTML = "";
            }
            var n = domP.children.length;
            domP.innerHTML += this.GetHtml();
            if (p != null)
                p.AttachControl(domP);
            else
                this.AttachControl(domP.children[n]);
        }
        ysh.AttachControl = function (dom) {
            this.ctrl = dom;
        }
        ysh.Check = function (type) {
            if (!this.IsEditable)
                return true;
            var result = false;
            for (var k in this.checks) {
                if ((k == "def") || (k == type)) {
                    eval(this.checks[k]);
                    if (!result)
                        return false;
                }
            }
            return true;
        }
        ysh.GetEditable = function () {
            return ysh.IsEditable;
        }
        ysh.SetEditable = function (b) {
            ysh.SetReadOnly(!b);
            ysh.IsEditable = b;
        }
        ysh.SetReadOnly = function (b) {
        }
    }
    , AttachContainer: function (o, fGetChild) {
        if (!fGetChild)
            fGetChild = function (dom, i) { return dom.children[i]; };
        o.AttachControl = function (dom) {
            this.ctrl = dom;
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].AttachControl(fGetChild(dom, i));
            }
        }
    }
    , AttachDataSource: function (o) {
        if ((typeof o.datasource == "undefined") || (o.datasource == null))
            o.datasource = { db: "", src: "", col: "", def: "", deftype: "string", save: "1", key: "0" };
        else {
            YSH_Define(o.datasource, "db", "");
            YSH_Define(o.datasource, "src", "");
            YSH_Define(o.datasource, "col", "");
            YSH_Define(o.datasource, "def", "");
            YSH_Define(o.datasource, "deftype", "");
            YSH_Define(o.datasource, "save", "1");
            YSH_Define(o.datasource, "key", "0");
        }
    }
}

function YSH_CreateAscx(tagname, ascxname, bData, bContainer) {
    return {
        Create: function () {
            var o = YshObject.Create();
            o.tag = tagname;
            return o;
        }
        , ApplyYsh: function (o) {
            YshObject.ApplyYsh(o);
            if (bData)
                YshObject.AttachDataSource(o);
            if (bContainer)
                YshObject.AttachContainer(o);
            o.GetHtml = function () {
                if (bContainer)
                    return "<span>[" + ascxname + "]<br>" + this.GetChildrenHtml() + "</span>";
                return GetSpan(tagname, ascxname);
            }
        }
    };
}

function GetSpan(tagname, ascxname, others) {//根据参数返回一个span
    var imgUrl = "/i/PreviewControl/" + tagname + ".jpg";
    var errorUrl = "/i/PreviewControl/DefaultImg.jpg";
    if (others == undefined)
        return StringPP.format("<span>[{0}]<br /><img src={1} title='{0}' onerror=\"this.src='{2}'\"></img></span>", ascxname, imgUrl, errorUrl);
    else
        return StringPP.format("<span>{1}<br />[{0}]</span>", ascxname, others);
}
