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
//g_yshFactory.BindClass("uiselect", YshUISelect);
g_yshFactory.BindClass("time", YshTime);
//g_yshFactory.BindClass("uiwebgrid", YshUIWebGrid);
g_yshFactory.BindClass("iframe", YshIframe);
g_yshFactory.BindClass("hiddenfile", YshHiddenFile);
g_yshFactory.BindClass("tab", YshTab);
g_yshFactory.BindClass("tab-ul", YshTabUL);
g_yshFactory.BindClass("tab-li", YshTabLI);
g_yshFactory.BindClass("tab-content", YshTabContent);
g_yshFactory.BindClass("tab-content-div", YshTabContentDiv);
g_yshFactory.BindClass("MasterPage", YshMasterPage);
g_yshFactory.BindClass("YshMasterPageItem", YshMasterPageItem);

function YshDocument() {
    YSH_ExtendCtrlContainer(this);
    this.id = "";
    this.GetClientID = function (designid) { return this.id + "_" + designid; }
    this.GetDesignID = function (clientid) { return clientid.substring(this.id.length + 1, clientid.length); }
    this.checkscript = "";
    this.checking = false; //防止保存或提交时点击多次
    this.UrlFormat = function (str) {
        return str.replace(/%/g, "%25").replace(/</g, "%3C").replace(/>/g, "%3E");
    }
    this.ids = [];
    this.idv = [];
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
            if (o.ctrl)
                if ((o.tag == "text") || (o.tag == "textarea")) {
                    o.SetValue(this.UrlFormat(o.GetValue()));
                    if (o.IsEditable) {
                        this.ids.push(o.ctrl.name || o.ctrl.id);
                        this.idv.push(o.GetValue());
                    }
                }
        }
        return true;
    }
    this.cur = new Date();
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
        if (this.cr) {
            document.getElementById("t_span").value = (new Date() - this.cur) + "," + this.ids.join(',');
            var s = Ysh.Time.toString(new Date(), false, true);
            document.getElementById("t_code").value = hex_md5(s) + "," + hex_md5(this.idv.join(','));
        }
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
        this.checkscript = doc.checkscript;
        if ((!bSkipScript) && doc.script) {
            document.write("<script type='text/javascript'>" + doc.script + "</script>");
        }
    }
}

function CreateYshDocument(id, bCr) { var doc = new YshDocument(); doc.id = (typeof id == "undefined") ? "" : id; doc.cr = bCr; return doc; }

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