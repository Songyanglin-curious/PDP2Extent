function YSH_ExtendGetXml(o, tag) {
    if (o instanceof Array) {
        for (var i = 0; i < o.length; i++)
            YSH_ExtendGetXml(o[i], tag);
        return;
    }
    o.GetXml = function () {
        var xml = "<" + tag;
        for (var k in this) {
            if (k == "GetXml")
                continue;
            var v = this[k];
            if (v instanceof Function)
                continue;
            if (v == "") /*默认*/
                continue;
            xml += " " + k + "=\"" + v + "\"";
        }
        return xml + "></" + tag + ">";
    }
}

function YSH_CreateContextMenu(id, desc, icon, clickfunc, subs) { return { "id": id, "desc": desc, "icon": icon, "event": clickfunc, "subs": (typeof subs == "undefined") ? [] : subs }; }

function YSH_ExtendCtrlContainer(o) {
    o.ctrls = [];
    o.GetYsh = function (domctrl) { for (var i = 0; i < this.ctrls.length; i++) { if (this.ctrls[i].ctrl == domctrl) return this.ctrls[i]; } return null; }
    o.GetYshById = function (id) { for (var i = 0; i < this.ctrls.length; i++) { if (this.ctrls[i].id == id) { if (this.ctrls[i].descr != "") { var source = o.GetYshById(this.ctrls[i].descr); if (source != null) return source; else return this.ctrls[i]; } else return this.ctrls[i]; } } return null; }
    o.GetYshByName = function (name) { var array = new Array(); for (var i = 0; i < this.ctrls.length; i++) { if (this.ctrls[i].name == name) array.push(this.ctrls[i]); } return array; }
    o.GetRoot = function () { if (this.ctrls.length == 0) return null; return this.ctrls[0]; }
    o.ClearAll = function () { this.ctrls = []; }
}

function YSH_Define(o, a, v) {
    if (typeof o[a] == "undefined")
        o[a] = v;
}

var g_yshFactory = new function () {
    YSH_ExtendCtrlContainer(this);
    this.types = {};
    this.clipboard = [];
    this.maxid = 0;
    this.BindClass = function (tag, typeclass) { this.types[tag] = typeclass; }
    var CheckCtrlNeedId = function (tag) {//add by subo 20130711
        var ctrls = ["uploadfile", "yshmasterpageitem"]; //update by subo 20130912
        for (var i = 0; i < ctrls.length; i++) {
            if (tag == ctrls[i])
                return true;
        }
        return false;
    }
    this.GetNewId = function (tag) {
        var o = null;
        var newid = "";
        do {
            this.maxid++;
            //update by subo 20130711
            newid = "_temp_id_" + tag + this.maxid;
            //update end
            o = this.GetYshById(newid);
        } while (o);
        return newid;
    }
    this.ExtendObjects = function (ysh, f) {
        var t = this.types[ysh.tag];
        if (!t) { alert("类型" + ysh.tag + "没有注册！"); return; }
        this.ctrls.push(ysh);
        t.ApplyYsh(ysh);
        if (f)
            f(ysh);
        for (var i = 0; i < ysh.children.length; i++) {
            //update by subo 20130711
            var el = ysh.children[i];
            if (el.id == "")
                el.id = this.GetNewId(el.tag);
            //update end
            this.ExtendObjects(ysh.children[i], f);
            ysh.children[i].parent = ysh;
        }
    }
    this.CreateObject = function (tag, pYsh, iPos) {
        var t = this.types[tag];
        if (!t) {
            alert("类型" + tag + "没有注册！");
            return null;
        }
        var ysh = t.Create();
        this.ctrls.push(ysh);
        t.ApplyYsh(ysh);
        //update by subo 20130711
        ysh.id = this.GetNewId(tag);
        ysh.name = ysh.desc = ""; //ysh.id.replace('_temp_id_', '');//默认不要名字和描述，减少文件大小
        if (CheckCtrlNeedId(tag))
            ysh.id = ysh.id.replace('_temp_id_', '');
        //ysh.name = ysh.desc = ysh.id = this.GetNewId(tag);
        //update end
        if (pYsh) {
            if ((typeof iPos == "undefined") || (iPos < 0))
                pYsh.children.push(ysh);
            else
                pYsh.children.insert(iPos, [ysh]);
            ysh.parent = pYsh;
        }
        return ysh;
    }
    this.CreateCustomObject = function (tag, pYsh, attrs) {
        var t = this.types[tag];
        if (!t) {
            alert("类型" + tag + "没有注册！");
            return null;
        }
        var ysh = t.Create(attrs);
        this.ctrls.push(ysh);
        t.ApplyYsh(ysh);
        //update by subo 20130711
        ysh.id = this.GetNewId(tag);
        ysh.name = ysh.desc = ysh.id.replace('_temp_id_', '');
        if (CheckCtrlNeedId(tag))
            ysh.id = ysh.id.replace('_temp_id_', '');
        //ysh.name = ysh.desc = ysh.id = this.GetNewId(tag);
        //update end
        if (pYsh) {
            if ((typeof iPos == "undefined") || (iPos < 0))
                pYsh.children.push(ysh);
            else
                pYsh.children.insert(iPos, [ysh]);
            ysh.parent = pYsh;
        }
        return ysh;
    }
    this.DeleteObject = function (obj) {
        //删除所有子元素
        for (var c = 0; c < obj.children.length; c++) {
            this.DeleteObject(obj.children[c]);
        }
        if (obj.parent) {
            obj.parent.children.erase(obj);
        }
        if (obj.doc)
            obj.doc.ctrls.erase(obj);
        this.ctrls.erase(obj);
        if (obj.doc)
            obj.doc.Redraw();
    }
    this.Delete = function (id) {
        var o = this.GetYshById(id);
        if (!o)
            return null;
        if (gL.editMode == 1 && o.parent.tag == "div" && o.parent.id != "divDefRoot")
            this.DeleteObject(o.parent); //如果是网格编辑模式，直接删掉包裹的div框
        else
            this.DeleteObject(o);
        return o;
    }
    this.LastOp = 0;
    this.Cut = function (id) {
        this.clipboard = [this.GetYshById(id)];
        var bePaste = this.clipboard[0];
        bePaste.parent.children.erase(bePaste);
        this.LastOp = 1;
    }
    this.Copy = function (id) {
        this.clipboard = [this.GetYshById(id)];
        this.LastOp = 2;
    }
    this.Paste = function (id) {//剪切、复制、粘贴功能，目前只支持单个控件
        var pYsh = this.GetYshById(id);
        try {
            if (pYsh.children[0].tag == "yshmasterpageitem") {
                pYsh = this.GetYshById(pYsh.children[0].descr);
            } else if (pYsh.tag == "yshmasterpageitem") {
                pYsh = this.GetYshById(pYsh.descr);
            }
        } catch (e) { }
        var bePaste;
        if (this.LastOp == 1) {//如果之前进行的剪切
            bePaste = this.clipboard[0];
            bePaste.parent.children.erase(bePaste);
            pYsh.children.push(bePaste);
            bePaste.parent = pYsh;
            bePaste.SetDocument(pYsh.doc);
        }
        else if (this.LastOp == 2) {//如果之前进行的复制
            bePaste = DeepClone(this.clipboard[0]);
            pYsh.children.push(bePaste);
            //update by subo 20130711
            bePaste.id = this.GetNewId(bePaste.tag);
            bePaste.name = bePaste.desc = bePaste.id.replace('_temp_id_', '');
            if (CheckCtrlNeedId(bePaste.tag))
                bePaste.id = bePaste.id.replace('_temp_id_', '');
            //bePaste.name = bePaste.desc = bePaste.id = this.GetNewId(bePaste.tag); //重设name、desc、id
            //update end
            bePaste.datasource = { db: "", src: "", col: "", def: "", deftype: "", type: "sql", options: { db: "", sql: ""} }; //重设datasource
            bePaste.parent = pYsh;
            bePaste.SetDocument(pYsh.doc);
            this.ctrls.push(bePaste);
        }
        if (gL.editMode == 1 && rightClick[0] != 0 && rightClick[1] != 0) {
            bePaste.styles["left"] = rightClick[0] + "px";
            bePaste.styles["top"] = rightClick[1] + "px";
            bePaste.styles["position"] = "absolute";
        }
    }
    this.CreateNewCtrl = function (id) {
        var pYsh = this.GetYshById(id);
        var dialogURL = "selectctrldlg.aspx";
        var type = window.showModalDialog(dialogURL, window, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
        if (!type)
            return;
        if ((type.length == 2) && (type[0] == "cell")) {
            cellctrl.OpenFile("", "");
            var newCtrl = CreateYshFromCell(cellctrl, pYsh, pYsh.doc);
            newCtrl.Display(pYsh.ctrl);
        } else {
            var newCtrl = pYsh.doc.CreateObject(type, pYsh);
            newCtrl.Display(pYsh.ctrl);
        }
    }
    this.TableSetting = function (id) {
        var obj = this.GetYshById(id);
        window.showModalDialog("/TableSetting.aspx", [this, obj], "dialogWidth:860px; dialogHeight:610px; center:yes; help:no; scroll:yes; resizable:yes; status:no");
    }
};
var $Y = function (id) { return g_yshFactory.GetYshById(id); }
g_yshFactory.BindClass("table", YshTable);
g_yshFactory.BindClass("tr", YshRow);
g_yshFactory.BindClass("td", YshCell);
g_yshFactory.BindClass("button", YshButton);
g_yshFactory.BindClass("div", YshDiv);
g_yshFactory.BindClass("span", YshSpan);
g_yshFactory.BindClass("text", YshTextBox);
g_yshFactory.BindClass("uploadfile", YshUploadFile);
g_yshFactory.BindClass("inputpwd", YshInputPwd);
g_yshFactory.BindClass("checkbox", YshCheckBox);
g_yshFactory.BindClass("radio", YshHtmlRadio);
g_yshFactory.BindClass("inputhidden", YshInputHidden);
g_yshFactory.BindClass("textarea", YshTextArea);
g_yshFactory.BindClass("image", YshImage);
g_yshFactory.BindClass("href", YshHref);
g_yshFactory.BindClass("label", YshLabel);
g_yshFactory.BindClass("select", YshSelect);
g_yshFactory.BindClass("uiselect", YshUISelect);
g_yshFactory.BindClass("time", YshTime);
g_yshFactory.BindClass("uiwebgrid", YshUIWebGrid);
g_yshFactory.BindClass("iframe", YshIframe);
g_yshFactory.BindClass("hiddenfile", YshHiddenFile);
g_yshFactory.BindClass("tab", YshTab);
g_yshFactory.BindClass("tab-ul", YshTabUL);
g_yshFactory.BindClass("tab-li", YshTabLI);
g_yshFactory.BindClass("tab-content", YshTabContent);
g_yshFactory.BindClass("tab-content-div", YshTabContentDiv);
g_yshFactory.BindClass("MasterPage", YshMasterPage);
g_yshFactory.BindClass("YshMasterPageItem", YshMasterPageItem);

/*
g_yshFactory.BindClass("dragtree", YshDragTreeAscx);
g_yshFactory.BindClass("listedit", YshListEditAscx);
g_yshFactory.BindClass("dtree", YshDynaTreeAscx);
g_yshFactory.BindClass("gantte", YshGantteGraphAscx);
g_yshFactory.BindClass("graph", YSH_CreateAscx("graph", "图形控件", true));
g_yshFactory.BindClass("docviewer", YSH_CreateAscx("docviewer", "文档查看器", true));
g_yshFactory.BindClass("codebox", YSH_CreateAscx("codebox", "编号控件", true));
g_yshFactory.BindClass("seldiag", YSH_CreateAscx("seldiag", "选择控件", true));
g_yshFactory.BindClass("tabbar", YshTabBar);
*/

function YshDocument() {
    YSH_ExtendCtrlContainer(this);
    this.id = "";
    this.GetClientID = function (designid) { return this.id + "_" + designid; }
    this.GetDesignID = function (clientid) { return clientid.substring(this.id.length + 1, clientid.length); }
    this.inits = [];
    this.datakeys = [];
    this.selectsources = [];
    this.colrelations = [];
    this.checkscript = "";
    this.script = "";
    this.loadstart = "";
    this.loadend = "";
    this.savestart = "";
    this.saveend = "";
    this.deletestart = "";
    this.deleteend = "";
    this.pagepriv = "";
    this.checking = false; //防止保存或提交时点击多次
    this.UrlFormat = function (str) {
        return str.replace(/%/g, "%25").replace(/</g, "%3C").replace(/>/g, "%3E");
    }
    this.CheckDesignMsg = function () {
        var ids = {};
        for (var i = 0; i < this.ctrls.length; i++) {
            var id = this.ctrls[i].id;
            if (typeof ids[id] == "undefined")
                ids[id] = 1;
            else
                ids[id]++;
        }
        for (var id in ids) {
            if (ids[id] > 1) {
                return "id:" + id + "出现了" + ids[id] + "次重复";
            }
        }
        return "";
    }
    this.DoCheck = function (type) {
        if (this.checkscript != "") {
            var result = false;
            eval(this.checkscript);
            if (!result) {
                return false;
            }
        }
        for (var i = 0; i < this.ctrls.length; i++) {
            var o = this.ctrls[i];
		if(o.ctrl)
            if ((o.tag == "text") || (o.tag == "textarea")) {
                o.SetValue(this.UrlFormat(o.GetValue()));
            }
        }
        return true;
    }
    this.Check = function (type) {
        if (this.checking)
            return false;
        this.checking = true;
        var ret = false;
        try {
            ret = this.DoCheck(type);
        } catch (E) {
            ret = false;
        }
            this.checking = false;
        return ret;
    }
    this.BindClass = function (tag, typeclass) { this.types[tag] = typeclass; }
    this.Parse = function (json, bSkipScript) {
        this.ctrls = [];
        if (!json) return;
        var doc = null;
        eval("doc = " + json);
        var temp = this;
        g_yshFactory.ExtendObjects(doc.ctrls, function (ysh) { temp.ctrls.push(ysh); ysh.doc = temp; });
        this.inits = doc.init;
        this.datakeys = doc.datakey;
        this.selectsources = doc.selectsource;
        this.colrelations = doc.colrelations;
        this.checkscript = doc.checkscript;
        this.script = doc.script;
        this.loadstart = doc.loadstart;
        this.loadend = doc.loadend;
        this.savestart = doc.savestart;
        this.saveend = doc.saveend;
        this.deletestart = doc.deletestart;
        this.deleteend = doc.deleteend;
        this.pagepriv = doc.pagepriv;
        this.includes = doc.includes;
        if ((!bSkipScript) && this.script) {
            document.write("<script type='text/javascript'>" + this.script + "</script>");
        }
    }
    this.Redraw = function () { };
    this.CreateObject = function (tag, pYsh, iPos) {
        var ysh = g_yshFactory.CreateObject(tag, pYsh, iPos);
        if (null != ysh) {
            this.ctrls.push(ysh);
            ysh.SetDocument(this);
        }
        return ysh;
    }
    this.CreateCustomObject = function (tag, pYsh, attrs) {
        var ysh = g_yshFactory.CreateCustomObject(tag, pYsh, attrs);
        if (null != ysh) {
            this.ctrls.push(ysh);
            ysh.SetDocument(this);
        }
        return ysh;
    }
    this.GetXml = function () {
        var xml = "<root>";
        xml += "<init>";
        for (var i = 0; i < this.inits.length; i++) {
            var o = this.inits[i];
            if (typeof o.GetXml == "undefined")
                YSH_ExtendGetXml(o, "i");
            xml += o.GetXml();
        }
        xml += "</init>";
        xml += "<selectsource>";
        for (var i = 0; i < this.selectsources.length; i++) {
            var o = this.selectsources[i];
            if (typeof o.GetXml == "undefined")
                YSH_ExtendGetXml(o, "d");
            xml += o.GetXml();
        }
        xml += "</selectsource>";
        xml += "<datakey>"
        for (var i = 0; i < this.datakeys.length; i++) {
            var o = this.datakeys[i];
            if (typeof o.GetXml == "undefined")
                YSH_ExtendGetXml(o, "d");
            xml += o.GetXml();
        }
        xml += "</datakey>";
        xml += "<colrel>";
        try {
            for (var i = 0; i < this.colrelations.length; i++) {
                var o = this.colrelations[i];
                if (typeof o.GetXml == "undefined")
                    YSH_ExtendGetXml(o, "c");
                xml += o.GetXml();
            }
        } catch (err) { }
        xml += "</colrel>";
        xml += "<show>" + this.GetRoot().GetXml() + "</show>";
        if (this.checkscript != "")
            xml += "<check><![CDATA[" + this.checkscript + "]]></check>";
        if (this.script != "")
            xml += "<script><![CDATA[" + this.script + "]]></script>";
        if (this.loadstart != "")
            xml += "<loadstart><![CDATA[" + this.loadstart + "]]></loadstart>";
        if (this.loadend != "")
            xml += "<loadend><![CDATA[" + this.loadstart + "]]></loadend>";
        if (this.savestart != "")
            xml += "<savestart><![CDATA[" + this.savestart + "]]></savestart>";
        if (this.saveend != "")
            xml += "<saveend><![CDATA[" + this.saveend + "]]></saveend>";
        if (this.deletestart != "")
            xml += "<deletestart><![CDATA[" + this.deletestart + "]]></deletestart>";
        if (this.deleteend != "")
            xml += "<deleteend><![CDATA[" + this.deleteend + "]]></deleteend>";
        if (this.pagepriv != "")
            xml += "<pagepriv><![CDATA[" + this.pagepriv + "]]></pagepriv>";
        if (this.includes != "")
            xml += "<includes><![CDATA[" + this.includes + "]]></includes>";
        return xml + "</root>";
    }
}

function CreateYshDocument(id) { var doc = new YshDocument(); doc.id = (typeof id == "undefined") ? "" : id; return doc; }

function DeepClone(obj) {//深度复制
    var objClone;
    if (obj.constructor == Object) {
        objClone = new obj.constructor();
    } else {
        objClone = new obj.constructor(obj.valueOf());
    }
    for (var key in obj) {
        if (objClone[key] != obj[key]) {
            if (typeof (obj[key]) == "object" && key != "doc" && key != "parent" && key != "ctrl" && key != "children") {
                objClone[key] = DeepClone(obj[key]);
            } else {
                objClone[key] = obj[key];
            }
        }
    }
    return objClone;
}

function AjaxSave(alertInfo) {
    var arrData = new Array();
    for (var i = 0; i < docFlow.ctrls.length; i++) {
        var ctrl = docFlow.ctrls[i];
        var id = docFlow.GetDesignID(ctrl.id);
        var datasource = ctrl.datasource;
        if (id != "" && datasource != undefined) {
            var value = ctrl.GetValue();
            arrData.push({ id: id, value: value });
        }
    }
    var b = window.YshGrid.Save(arrRequest, arrData).value;

    if (b == "true") {
        if (alertInfo == undefined) {
        alert("保存成功！！");
        } else if (alertInfo != "") {
            alert(alertInfo);
        }
    }
    else {
        alert("保存失败。");
    }
    return false;
}

function SetEditable(b) {
    for (var i = 0; i < docFlow.ctrls.length; i++) {
        var ctrl = docFlow.ctrls[i];
        var ysh = docFlow.GetYshById(ctrl.id);
        ysh.SetEditable(b);
    }
}