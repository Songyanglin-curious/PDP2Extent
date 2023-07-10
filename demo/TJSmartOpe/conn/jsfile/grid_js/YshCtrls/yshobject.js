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
var TabEvent = {
    binding: function (tabObj) { TabEvent.change(tabObj.parentElement.parentElement.parentElement.id); },
    change: function (tabId) {
        var tabs = document.getElementById(tabId);
        var tablis = tabs.childNodes[0].getElementsByTagName("div");
        var tabcs = tabs.childNodes[1].getElementsByTagName("div");
        for (var i = 0, len = tablis.length; i < len; i++) {
            (function (a) {
                tablis[a].onclick = function () {
                    addClass(clearAllClass(tablis, 'on')[a], 'on');
                    addClass(clearAllClass(tabcs, 'show')[a], 'show');
                }
            })(i);
        }
        clearAllClass = function (arr, name) {
            var lens = arr.length, re = new RegExp(name, 'gi');
            for (var j = 0; j < lens; j++) {
                if (re.test(arr[j].className)) {
                    arr[j].className = arr[j].className.replace(re, '');
                }
            }
            return arr;
        },
        addClass = function (o, name) {
            var re = new RegExp(name, 'gi');
            if (!re.test(o.className)) o.className += " " + name;
            return o;
        };
    }
}
var YshButton = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "button";
        o.descr = "按钮";
        o.attrs["value"] = "按钮";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.AddContentMenus = function (menulist) {
        }
        o.GetHtml = function () {
            return "<input type='button' " + this.GetAttributesHtml() + " />";
        }
    }
}
var YshCell = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "td";
        o.descr = "单元格";
        return o;
    }
    , ApplyYsh: function (o) {
        o.isDelDeny = true;
        o.isCopyDeny = true;
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var inner = this.GetChildrenHtml();
            if (inner == "")
                inner = "&nbsp;";
            return "<td" + this.GetAttributesHtml() + ">" + inner + "</td>";
        }
        YshObject.AttachContainer(o);
        if (typeof o.attrs["colspan"] == "undefined") o.attrs["colspan"] = 1;
        if (typeof o.attrs["rowspan"] == "undefined") o.attrs["rowspan"] = 1;
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");docDesign.Redraw();"));
            menulist.push(YSH_CreateContextMenu("insrowb", "前边插入行", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.AddRow(true);o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("insrowa", "后边插入行", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.AddRow(false);o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("inscolb", "前边插入列", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.AddCol(true);o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("inscola", "后边插入列", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.AddCol(false);o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("inscola", "删除行", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.DelThisRow();o.doc.Redraw();"));
            menulist.push(YSH_CreateContextMenu("inscola", "删除列", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.DelThisCol();o.doc.Redraw();"));
            if (g_yshFactory.clipboard.length > 0) {
                menulist.push(YSH_CreateContextMenu("paste", "粘贴", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");g_yshFactory.Paste(\"" + this.id + "\");o.doc.Redraw();"));
            }
        }
        o.AddRow = function (bBefore) {
            var rg = this.GetCellRange();
            var row = this.parent;
            var tbl = row.parent;
            var insindex = bBefore ? rg.r0 : rg.r1 + 1;
            //对表格的所有格子进行判断有没有穿过，穿过的就不用加了
            var arrIn = [];
            var nMaxCol = tbl.GetCols() - 1;
            for (var r = 0; r < tbl.children.length; r++) {
                var tr = tbl.children[r];
                for (var c = 0; c < tr.children.length; c++) {
                    var td = tr.children[c];
                    if (td.InsertRow(insindex) == 0)
                        arrIn.push(td);
                }
            }
            var insrow = this.doc.CreateObject("tr", tbl, insindex);
            //加入没穿过的列
            for (var c = 0; c <= nMaxCol; c++) {
                var bIn = false;
                for (var i = 0; i < arrIn.length; i++) {
                    var rgIn = arrIn[i].GetCellRange();
                    if ((rgIn.c0 <= c) && (rgIn.c1 >= c)) {
                        bIn = true;
                        break;
                    }
                }
                if (!bIn) {
                    var inscol = this.doc.CreateObject("td", insrow);
                    inscol.selfattr["col"] = c;
                    inscol.selfattr["row"] = insindex;
                }
            }
        }
        o.AddCol = function (bBefore) {
            var rg = this.GetCellRange();
            var row = this.parent;
            var tbl = row.parent
            var insindex = bBefore ? rg.c0 : rg.c1 + 1;
            var nMaxCol = tbl.GetCols() - 1;
            if (insindex == nMaxCol + 1) {//往最后一列加
                for (var r = 0; r < tbl.children.length; r++) {
                    var tr = tbl.children[r];
                    var inscol = this.doc.CreateObject("td", tr);
                    inscol.selfattr["col"] = insindex;
                    inscol.selfattr["row"] = r;
                }
            } else {
                for (var r = 0; r < tbl.children.length; r++) {
                    var tr = tbl.children[r];
                    //看有没有穿过这行的某个格子，如果没有就插入一个
                    var bIn = false;
                    var colsOfTr = tr.children.length;
                    for (var c = colsOfTr - 1; c >= 0; c--) {
                        var td = tr.children[c];
                        var rgTd = td.GetCellRange();
                        if ((rgTd.c0 == insindex) || ((c == 0) && (rgTd.c0 > insindex) || ((c == colsOfTr - 1) && (rgTd.c1 < insindex)))) {//在这之前插入
                            var inscol = this.doc.CreateObject("td", tr, (rgTd.c1 < insindex) ? c + 1 : c);
                            inscol.selfattr["col"] = insindex;
                            inscol.selfattr["row"] = r;
                        }
                        td.InsertCol(insindex);
                    }
                }
            }
        }
        o.InsertRow = function (r) { //插行，如果在这中间，就返回true，否则false
            var rg = this.GetCellRange();
            if (rg.r1 < r)//在上边，不影响
                return -1;
            if (rg.r0 < r) {//穿过，合并行+1
                this.attrs["rowspan"] = this.GetRowSpan() + 1;
                return 0;
            } //在下边，往下移动
            this.selfattr["row"] = toInt(this.selfattr["row"], 0) + 1;
            return 1;
        }
        o.InsertCol = function (c) {
            var rg = this.GetCellRange();
            if (rg.c1 < c)//在左边，不影响
                return -1;
            if (rg.c0 < c) {//穿过，合并行+1
                this.attrs["colspan"] = this.GetColSpan() + 1;
                return 0;
            } //在右边，往下移动
            this.selfattr["col"] = toInt(this.selfattr["col"], 0) + 1;
            return 1;
        }
        o.DelThisRow = function () {
            var rg = this.GetCellRange();
            this.parent.parent.DeleteRows(rg.r0, rg.r1 - rg.r0 + 1);
        }
        o.DelThisCol = function () {
            var rg = this.GetCellRange();
            this.parent.parent.DeleteCols(rg.c0, rg.c1 - rg.c0 + 1);
        }
        o.DeleteRow = function (r) {
            var rg = this.GetCellRange();
            if ((rg.r1 == r) && (rg.r0 == r)) {
                return true; //把自己删了
            }
            if (rg.r1 >= r) {//否则在上边，无需改动
                if ((rg.r1 == r) || (rg.r0 <= r)) {//删除的行在范围里边，少合并一行了
                    this.attrs["rowspan"] = this.GetRowSpan() - 1;
                } else {
                    //在下边，把行上移
                    this.selfattr["row"] = toInt(this.selfattr["row"], 0) - 1;
                }
            }
            return false;
        }
        o.DeleteCol = function (c) {
            var rg = this.GetCellRange();
            if ((rg.c1 == c) && (rg.c0 == c)) {
                return true; //把自己删了
            }
            if (rg.c1 >= c) {//否则在上边，无需改动
                if ((rg.c1 == c) || (rg.c0 <= c)) {//删除的行在范围里边，少合并一行了
                    this.attrs["colspan"] = this.GetColSpan() - 1;
                } else {
                    //在右边，把列前移
                    this.selfattr["col"] = toInt(this.selfattr["col"], 0) - 1;
                }
            }
            return false;
        }
        o.GetColSpan = function () {
            //return Math.max(toInt(this.ctrl.colSpan, 1), 1);
            return Math.max(toInt(this.attrs["colspan"], 1), 1);
        }
        o.GetRowSpan = function () {
            //return Math.max(toInt(this.ctrl.rowSpan, 1), 1);
            return Math.max(toInt(this.attrs["rowspan"], 1), 1);
        }
        o.ChangeSpan = function (cm0, cm1, rm0, rm1) {
            if ((cm0 == cm1) && (rm0 == rm1))
                return true;
            var rg = this.GetCellRange();
            var tr = this.parent;
            var tbl = tr.parent;
            if (cm0 < cm1) {
                if (rg.c0 + cm1 > tbl.GetCols()) {
                    alert("表列不足，请重新设置合并的列数");
                    return false;
                }
                if (!confirm("合并列数增加，此操作会合并后边列的内容！\r\n是否确认设置？"))
                    return false;
            }
            if (rm0 < rm1) {
                if (rg.r0 + rm1 > tbl.GetRows()) {
                    alert("表行不足，请重新设置合并的行数");
                    return false;
                }
                if (!confirm("合并行数增加，此操作会合并后边列的内容！\r\n是否确认设置？"))
                    return false;
            }
            var vtbl = new YshVirtualTable();
            vtbl.ReadFromYsh(tbl);
            vtbl.MergeCells(rg.c0, rg.r0, cm1, rm1);
            vtbl.ResetYsh(tbl);
            return true;
        }
        o.SetAttr = function (k, v) {
            if (this.attrs[k] == v)
                return;
            if ((typeof this.attrs[k] == "undefined") && (v === ""))
                return;
            if (k == "colspan") {
                v = toInt(v, 1);
                if (!this.ChangeSpan(this.GetColSpan(), v, this.GetRowSpan(), this.GetRowSpan()))
                    return;
            }
            else if (k == "rowspan") {
                v = toInt(v, 1);
                if (!this.ChangeSpan(this.GetColSpan(), this.GetColSpan(), this.GetRowSpan(), v))
                    return;
            }
            this.attrs[k] = v;
        }
        o.GetCellRange = function () {
            var c0 = toInt(this.selfattr["col"], 0);
            var r0 = toInt(this.selfattr["row"], 0);
            var c1 = c0 + this.GetColSpan() - 1;
            var r1 = r0 + this.GetRowSpan() - 1;
            return { "c0": c0, "c1": c1, "r0": r0, "r1": r1 };
        }
    }
}
var YshCheckBox = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "checkbox";
        o.descr = "复选框";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetValue = function () { if (this.ctrl) return this.ctrl.checked; return null; };
        o.GetHtml = function () {
            return "<input type='checkbox' " + this.GetAttributesHtml() + " />";
        }
        o.SetValue = function (v) { this.value = v; if (this.ctrl) { this.ctrl.checked = v; } }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                if (o.attrs["class"] == "styled")
                    obj.prev().addClass("disabled");
                obj.attr("disabled", "disabled");
            }
            else if (!b && !o.GetEditable()) {
                if (o.attrs["class"] == "styled")
                    obj.prev().removeClass("disabled");
                obj.removeAttr("disabled");
            }
        }
    }
}
var YshDialog = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "ysh_dialog";
        o.attrs["class"] = "design-Dialog-box";
        o.attrs["width"] = "500";
        o.attrs["height"] = "500";
        o.attrs["title"] = "新建窗口";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
        o.GetHtml = function () {
            return "<div class='design-Dialog-box' style='width:" + o.attrs["width"] + "px;height:" + o.attrs["height"] + "px;'>" + this.GetChildrenHtml() + "</div>";
        }
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加控件", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");docDesign.Redraw();"));
        }/*
        o.Open = function () {
            $('#' + o.id).show();
        }
        o.Close = function () {
            $('#' + o.id).hide();
        }*/
        o.Open = function () {
            $('#' + o.id).yshdialog('open');
        }
        o.Close = function () {
            $('#' + o.id).yshdialog('close');
        }
        o.SetWidth = function (w) {
            $('#' + o.id).yshdialog('setWidth', w);
        }
        o.SetHeight = function (h) {
            $('#' + o.id).yshdialog('setHeight', h);
        }
        o.Size = function () {
            return $('#' + o.id).yshdialog('getSize');
        }
        o.HiddenHead = function (showHead) {
            $('#' + o.id).yshdialog('hiddenHead', showHead);
        }
        o.FullScreen = function (showHead) {
            $('#' + o.id).yshdialog('fullScreen', showHead);
        }
        o.MoveScreen = function (x, y) {
            $('#' + o.id).yshdialog('moveScreent', x, y);
        }
    }
}
var YshDiv = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "div";
        o.descr = "容器";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<div " + this.GetAttributesHtml() + " >" + this.GetChildrenHtml() + "</div>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");docDesign.Redraw();"));
            if (g_yshFactory.clipboard.length > 0)
                menulist.push(YSH_CreateContextMenu("paste", "粘贴", "", "g_yshFactory.Paste(\"" + this.id + "\");docDesign.Redraw();"));
        }
    }
}
var YshDragTreeAscx = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "dragtree";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "dragtree";
            var ascxname = "WebUI树";
            return GetSpan(tagname, ascxname);
        }
    }
}
var YshDropDownList = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "ysh_ddlbox";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            var tagname = "DropDownListControl";
            var ascxname = "下拉列表";
            return GetSpan(tagname, ascxname);
        }
        o.GetValue = function () {
            if (typeof (this.ctrl) == 'undefined') return '';
            var obj = $('#' + this.ctrl.id);
            if (obj.find('[t=true]').css('display') == 'block') {
                if (this.attrs['get-valuetype'].toLocaleLowerCase() == 'text') {
                    //return obj.find('[type=text]').val();
                    return $("#" + this.ctrl.id.replace("dvDropDownList", "txtText")).val()
                }
                else {
                    //return obj.find('[type=hidden]').val();
                    return $("#" + this.ctrl.id.replace("dvDropDownList", "txtValue")).val();
                }
            }
            else {
                return obj.find('[t=false]').text();
            }
        }
        o.GetText = function () {
            var obj = $('#' + this.ctrl.id);
            if (obj.find('[t=true]').css('display') == 'block') {
                return obj.find('[type=text]').val();
            }
            else {
                return obj.find('[t=false]').text();
            }
        }
        o.SetValue = function (v) {
            var obj = o.id;
            if (v == "" || v == "''" || v == null)
                return;
            eval(obj + ".setSelectedValue('" + v + "')");
        }
        o.Select = function (index) {
            var obj = o.id;
            if (index == "" || index == "''" || index == null)
                return;
            eval(obj + ".setSelected('" + index + "')");
        }
        o.AttachEvent = function (evt, act) {
            eval(o.id).evtchange.push(act);
        }
    }
}
var YshDynaTreeAscx = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "dtree";
        var t = new TreeFunc();
        SetAttr(t, o);
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<span>[Tree.ascx]</span>";
        }
        o.Edit = function () {
            var dialogURL = "ConfigTree.aspx";
            if (o.selfattr["id"] == "") {
                o.selfattr["id"] = o.id;
            }
            var dialog = window.showModalDialog(dialogURL, this, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
            if (typeof dialog != "undefined") {
                this.doc.Redraw();
            }
        }
        o.SetValue = function (v) {
            var ttt = eval(o.id);
            if (ttt != undefined && ttt != null) {
                ttt.selectbyvalue(v);
            }
        }
        o.GetValue = function () {
            var v = GetTreeValue(o.id);
            if (v != undefined && v != null) {
                return v;
            }
            else
                return "";
        }
    }
}
var YshGantteGraphAscx = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "gantte";
        o.selfattr["GantteID"] = o.id;
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return GetSpan("YshGantteGraph", "甘特图");
        }
        o.Edit = function () {
            var dialoagURL = "ConfigGantte.aspx";
            if (o.selfattr["GantteID"] == undefined || o.selfattr["GantteID"] == "") {
                o.selfattr["GantteID"] = o.id;
            }
            var dialog = window.showModalDialog(dialoagURL, this, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
            if (typeof dialog != "undefined") {
                this.doc.Redraw();
            }
        }
        o.GetValue = function () {
            var g = eval("GantteTempData_" + o.id);
            if (g != undefined)
                return g;
            else
                return -1;
        }
    }
}
var YshHiddenFile = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "hiddenfile";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<span>[隐藏文件" + this.desc + "]</span>"
        }
        o.SetValue = function (v) {
            if ((!this.ctrl) || (!this.IsEditable)) return;
            this.ctrl.children[0].value = "1";
            this.ctrl.children[2].value = v;
        }
    }
}
var YshHref = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "href";
        o.descr = "超链接";
        o.selfattr["text"] = "新链接"
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<a " + this.GetAttributesHtml() + ">" + this.selfattr["text"] + "</a>";
        }
    }
}
var YshHtmlRadio = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "radio";
        o.descr = "单选框";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<input type='radio' " + this.GetAttributesHtml() + " />";
        }
        o.SetValue = function (v) { if (this.ctrl) { this.ctrl.checked = v; } }
    }
}
var YshIframe = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "iframe";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "iframe";
            var ascxname = "iframe";
            return GetSpan(tagname, ascxname);
        }
        o.SetValue = function (v) {
            this.value = v;
            if (this.ctrl) {
                var url = this.attrs["src"];
                if (url.indexOf('?') < 0)
                    url += "?abc=1";
                var temp = {};
                var str = this.selfattr["urlarg"];
                if ((str != "") && (typeof str != "undefined")) {
                    var arr = str.split(',');
                    for (var j = 0; j < arr.length - 1; j += 2) {
                        temp[arr[j]] = arr[j + 1];
                    }
                }
                for (var i = 0; i < v.length; i++) {
                    var item = v[i];
                    temp[item.id] = item.value;
                }
                url += this.LinkObject(temp, function (k, v) { return "&" + k + "=" + v; });
                this.ctrl.src = url;
            }
        }
    }
}
var YshImage = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "image";
        o.descr = "图片";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<img " + this.GetAttributesHtml() + " />";
        }
    }
}
var YshInnerTable = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "innertable";
        o.selfattr["TableID"] = o.id;
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "YshInnerTable";
            var ascxname = "YshInnerTable";
            return GetSpan(tagname, ascxname);
        }
        o.Edit = function () {
            var dialoagURL = "ConfigInnerTable.aspx";
            if (o.selfattr["TableID"] == undefined || o.selfattr["TableID"] == "") {
                o.selfattr["TableID"] = o.id;
            }
            var dialog = window.showModalDialog(dialoagURL, this, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
            if (typeof dialog != "undefined") {
                this.doc.Redraw();
            }
        }
    }
}
var YshInputHidden = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "inputhidden";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            //return "<input type='hidden' " + this.GetAttributesHtml() + " />";
            return "<span>[隐藏" + this.desc + "]</span>"
        }
        o.SetValue = function (v) { if (this.ctrl) { this.ctrl.value = v; } }
        o.GetValue = function () { if (this.ctrl) return this.ctrl.value; };
    }
}
var YshInputPwd = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "inputpwd";
        o.descr = "密码框";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<input type='password' " + this.GetAttributesHtml() + " />";
        }
        o.SetValue = function (v) { if (o.GetEditable) o.ctrl.value = v; }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                var span = StringPP.format("<span>{0}</span>", "●●●●●●●●");
                o.valueback = o.GetValue();
                o.ctrlback = o.ctrl;
                obj.after(span);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
            else if (!b && !o.GetEditable()) {
                obj.after(o.ctrlback.outerHTML);
                o.ctrl = obj.next()[0];
                o.SetValue(o.valueback);
                obj.remove();
            }
        }
    }
}
var YshLabel = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "label";
        o.descr = "文本";
        o.selfattr["text"] = "文本";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<span " + this.GetAttributesHtml() + ">" + this.selfattr["text"] + "</span>";
        }
        o.SetValue = function (v) { this.value = v; if (this.ctrl) { this.ctrl.innerText = v; } }
        o.GetText = function () { if (typeof this.value == "undefined") return this.GetValue(); return this.value; }
        o.GetValue = function () { if (typeof this.value != "undefined") return this.value; if (this.ctrl) return (this.IsEditable && (typeof this.ctrl.value != "undefined")) ? this.ctrl.value : this.ctrl.innerText; return null; }
    }
}
var YshListEditAscx = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "listedit";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "ListEdit";
            var ascxname = "列表编辑";
            return GetSpan(tagname, ascxname);
        }
    }
}
var YshMasterPage = {
    Create: function (attrs) {
        var o = YshObject.Create();
        o.tag = "yshmasterpage";
        o.attrs["xmlName"] = attrs.xmlName;
        return o;
    },
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "YshMasterPage";
            var ascxname = "母版页";
            var html = LoadMstPgHTML(o.attrs["xmlName"]);
            var itemsId = new Array();//存放母版页中的原始itemId
            $(html).find("[name='yshmasterpageitem']").each(function (i) {
                itemsId.push($(this).attr("id"));
            });
            var itemsHtml = new Array();//存放用来进行替换的item的Html
            for (var i = 0; i < o.children.length; i++) {
                itemsHtml.push(o.children[i].GetHtml().replace(/id='.*?'/, StringPP.format("id='{0}_{1}'", o.id, itemsId[i])));
            }
            for (var i = 0; i < o.children.length; i++) {//进行Html替换
                html = html.replace(html.match(StringPP.format("<span id='{0}'.*?></span>", itemsId[i])), itemsHtml[i]);
            }
            return StringPP.format("<span title='{0}'>[{0}]{1}</span>", ascxname, html);
        },
        YshObject.AttachContainer(o, function (dom, i) {
            var itemsId = new Array();//存放母版页中的原始itemId
            $(o.GetHtml()).find("[name='yshmasterpageitem']").each(function (i) {
                itemsId.push($(this).attr("id"));
            });
            return document.getElementById(itemsId[i]);
        });
        o.Edit = function () {
            var dialoagURL = "MasterPageSetDlg.aspx";
            var dialog = window.showModalDialog(dialoagURL, this, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
            if (typeof dialog != "undefined") {
                this.doc.Redraw();
            }
        }
    }
}
var YshMasterPageItem = {
    Create: function () {
        var o = YshObject.Create();
        o.isCopyDeny = true;
        o.isDelDeny = true;
        o.IsEditable = true;
        o.tag = "yshmasterpageitem";
        return o;
    },
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "YshMasterPageItem";
            var ascxname = "母版页子控件";
            return StringPP.format("<span id='{0}' name='{1}'><span>[{2}]</span>{3}</span>", o.id, o.tag, ascxname, this.GetChildrenHtml());
        },
        YshObject.AttachContainer(o, function (dom, i) {
            if (dom.children[0].innerHTML == "[母版页子控件]")
                return dom.children[i + 1];
            else
                return dom.children[i];
        });
    }
}
var YshRadio = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "ysh_radio";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            if (this.attrs.text == undefined)
                return StringPP.format("<input type='radio' {0} />", this.GetAttributesHtml());
            else
                return StringPP.format("<span><input type='radio' {0} />{1}</span>", this.GetAttributesHtml(), this.attrs.text);
        }
        o.GetValue = function () { return this.ctrl.value; }
        o.GetText = function () {
            var radioGroup = $(':radio[t=ysh_radio][group=' + this.name + ']');
            var text = "";
            $.each(radioGroup, function (i, n) {
                if ($(n).attr('checked')) {
                    text = n.nextSibling.innerText;
                }
            });
            return text;
        }
        o.SetReadOnly = function (b) {
            var array = g_yshFactory.GetYshByName(o.name);
            if (b && o.GetEditable()) {
                for (var i = 0; i < array.length; i++) {
                    var obj = $(array[i].ctrl).next();
                    if (!obj.attr("checked")) {
                        obj.hide();
                        obj.next().hide();
                    }
                    array[i].IsEditable = !b;
                }
            }
            else if (!b && !o.GetEditable()) {
                for (var i = 0; i < array.length; i++) {
                    var obj = $(array[i].ctrl).next();
                    if (!obj.attr("checked")) {
                        obj.show();
                        obj.next().show();
                    }
                    array[i].IsEditable = !b;
                }
            }
        }
    }
};
var YshRelateFields = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "relatefields";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            var tagname = "YshRelateFields";
            var ascxname = "关联数据" + this.desc;
            return GetSpan(tagname, ascxname);
        }
        o.SetValue = function (v) { if (this.ctrl) { this.ctrl.value = v; } }
        o.GetValue = function () {
            if (this.ctrl) return this.ctrl.value;
        };
    }
}
var YshRow = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tr";
        o.descr = "行";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.isDelDeny = true;
        o.isCopyDeny = true;
        o.GetHtml = function () {
            return "<tr" + this.GetAttributesHtml() + ">" + this.GetChildrenHtml() + "</tr>";
        }
        YshObject.AttachContainer(o, function (dom, i) { return dom.cells[i]; });
        o.DeleteRow = function (r) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var td = this.children[i];
                if (td.DeleteRow(r)) //列删了
                    this.children.erase(td);
            }
        }
        o.DeleteCol = function (c) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var td = this.children[i];
                if (td.DeleteCol(c)) //列删了
                    this.children.erase(td);
            }
        }
    }
}
var YshSearch = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "search";
        o.selfattr["TableID"] = o.id;
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "YshSearch";
            var ascxname = "搜索控件";
            return GetSpan(tagname, ascxname);
        }
        o.Edit = function () {
            var dialoagURL = "ConfigSearch.aspx";
            if (o.selfattr["TableID"] == undefined || o.selfattr["TableID"] == "") {
                o.selfattr["TableID"] = o.id;
            }
            var dialog = window.showModalDialog(dialoagURL, this, "dialogWidth:800px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no");
            if (typeof dialog != "undefined") {
                this.doc.Redraw();
            }
        }
    }
}
var YshSelect = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "select";
        o.descr = "下拉框";
        o.datasource = { db: "", src: "", col: "", type: "sql", options: { db: "", sql: "" } };
        return o;
    }
    , ApplyOption: function (o) {
        o.GetDataXml = function () {
            var ds = this.datasource;
            if (!ds) return "";
            //var xml = '<d db="' + ds.db + '" src="' + ds.src + '" col="' + ds.col + '">';
            //var str = this.LinkAttribute(this.datasource, function (k, v) { return k + "=\"" + v + "\" "; });
            var xml = '<d ' + this.LinkAttribute(ds, function (k, v) { if ((typeof v == "object") || (typeof v == "undefined")) return ""; return k + "=\"" + v + "\" "; }) + ">";
            switch (ds.type) {
                case "sql":
                    xml += '<options type="' + ds.type + '" db="' + ds.options.db + '">';
                    xml += "<![CDATA[" + ds.options.sql + "]]>";
                    break;
                case "list":
                    xml += '<options type="' + ds.type + '">';
                    xml += this.LinkObject(ds.options, function (k, v) { return '<i key="' + k + '">' + ds.options[k] + '</i>'; }, null);
                    break;
                case "dll":
                    xml += '<options type="' + ds.type + '" m="' + ds.options.m + '">';
                    break;
                case "xml":
                    xml += '<options type="' + ds.type + '" xml="' + ds.options.xml + '">';
                    break;
                default:
                    xml += '<options type="' + ds.type + '">';
                    break;
            }
            return xml + "</options></d>";
        }
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        this.ApplyOption(o);
        o.GetHtml = function () {
            return "<select " + this.GetAttributesHtml() + "></select>";
        }
        o.SetValue = function (v) { this.value = v; if (this.ctrl) if (this.IsEditable) { this.ctrl.value = v; } else { this.ctrl.innerText = v; } }
        o.GetValue = function () {
            if (!this.ctrl)
                return null;
            if (this.IsEditable)
                return this.ctrl.value;
            return this.ctrl.children[0].value;
        }
        o.GetText = function () {
            if (!this.ctrl)
                return null;
            if (this.IsEditable)
                return getItemTextByValue(this.ctrl, this.ctrl.value);
            return this.ctrl.children[1].innerText;
        }
        o.relates = [];
        o.AddRelate = function (oR) { this.relates.push(oR); }
        o.UpdateOption = function () {
            if (!this.IsEditable)
                return;
            var opts = this.datasource.options;
            var args = [];
            for (var i = 0; i < this.relates.length; i++) {
                var r = this.relates[i];
                args.push({ id: r.doc.GetDesignID(r.id), value: r.GetValue() });
            }
            var v;
            switch (this.datasource.type) {
                case "sql":
                    v = GetBkData(YshGrid.GetSQLSelectOptions(opts.db, opts.sql.split("#@#")[0], args));
                    break;
                case "dll":
                    v = GetBkData(YshGrid.GetDLLSelectOptions(opts.m, args));
                    break;
                default:
                    return;
            }
            if (!v.check("获取" + this.desc, true))
                return;
            var v = v.value;
            var selected = this.GetValue();
            var l = this.ctrl.options.length;
            for (var i = l - 1; i >= 0; i--) {
                var opt = this.ctrl.options[i];
                this.ctrl.options[i] = null;
            }
            for (var i = 0; i < v.length; i++) {
                var opt = new Option;
                opt.value = v[i][0];
                opt.text = v[i][1];
                this.ctrl.options.add(opt);
                delete opt;
            }
            this.ctrl.value = selected;
        }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                var span = StringPP.format("<span>{0}</span>", o.GetText());
                o.ctrlback = o.ctrl;
                obj.after(span);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
            else if (!b && !o.GetEditable()) {
                obj.after(o.ctrlback.outerHTML);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
        }
    }
}
var YshSpan = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "span";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<span " + this.GetAttributesHtml() + " >" + this.GetChildrenHtml() + "</span>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");"));
            if (g_yshFactory.clipboard.length > 0)
                menulist.push(YSH_CreateContextMenu("paste", "粘贴", "", "g_yshFactory.Paste(\"" + this.id + "\");"));
        }
    }
}
var YshTab = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab";
        o.attrs["class"] = "tab";
        //初始化TAB内容
        var tabUl = g_yshFactory.CreateObject("tab-ul", o);
        var tabContent = g_yshFactory.CreateObject("tab-content", o);
        var fisrtLi = g_yshFactory.CreateObject("tab-li", tabUl);
        g_yshFactory.CreateObject("tab-content-div", tabContent).attrs["class"] = "show";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<div id='" + this.id + "' " + this.GetAttributesHtml() + " >" + this.GetChildrenHtml() + "</div>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加新页卡", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.CreateNewTab();docDesign.Redraw();"));
        }
        o.CreateNewTab = function () {
            o.children[0].AddTab();
            o.children[1].AddContent(false);
            this.doc.Redraw();
            TabEvent.change(this.id);
        }
        o.RemoveTab = function (id) {
            var ul = o.children[0];
            var cd = o.children[1];
            var index = -9;
            for (var i = 0; i < ul.children.length; i++) { if (id === ul.children[i].id) { index = i; } }
            if (index < 0) { alert('没有找到要删除的页签！'); return false; }
            ul.RemoveTab(index);
            cd.RemoveContent(index);
            this.doc.Redraw();
        }
    }
}
var YshTabBar = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tabbar";
        o.datasource = { db: "", src: "", col: "", type: "sql", options: { db: "", sql: "" } };
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        YshSelect.ApplyOption(o); //Gud 20120418修改，改成和YshSelect一样
        o.GetHtml = function () {
            var tagname = "YshTabBar";
            var ascxname = "标签卡";
            return GetSpan(tagname, ascxname);
        }
        o.SetValue = function (v) {
            var tabId = o.id + "Tab";
            eval(tabId + ".SetTab('" + v + "')");
        }
        o.GetValue = function () {
            var tabId = o.id + "Tab";
            return eval(tabId + ".GetTab('" + o.id + "').getAttribute('customvalue')");
        }
        o.Select = function (idx) {
            var tabId = o.id + "Tab";
            eval(tabId + ".Select(" + idx + ")");
        }
        o.GetAllTab = function () {
            var tabId = o.id + "Tab";
            return eval(tabId + ".GetAllTab('" + o.id + "')");
        }
    }
}
var YshTabContent = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab-content";
        o.attrs["class"] = "content";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
        o.GetHtml = function () {
            return "<div ref='ysh-tab' " + this.GetAttributesHtml() + ">" + this.GetChildrenHtml() + "</div>";
        }
        o.AddContent = function (show) {
            var d = this.doc.CreateObject("tab-content-div", this);
            if (show)
                d.attrs["class"] = "show";
        }
        o.RemoveContent = function (i) { var c = this.children[i]; g_yshFactory.Delete(c.id); }
    }
}
var YshTabContentDiv = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab-content-div";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<div " + this.GetAttributesHtml() + ">" + this.GetChildrenHtml() + "</div>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "添加子控件", "", "g_yshFactory.CreateNewCtrl(\"" + this.id + "\");docDesign.Redraw();"));
        }
    }
}
var YshTable = {
    Create: function (attrs) {
        var o = YshObject.Create();
        o.tag = "table";
        o.descr = "表格";
        var rows, cols, rowHeight, colWidth;
        if (attrs != null) {
            rows = attrs.rows;
            cols = attrs.cols;
            rowHeight = attrs.rowHeight;
            colWidth = attrs.colWidth;
        } else {
            rows = 3;
            cols = 3;
            rowHeight = 50;
            colWidth = 250;
        }
        for (var r = 0; r < rows; r++) {
            var tr = g_yshFactory.CreateObject("tr", o);
            for (var c = 0; c < cols; c++) {
                var td = g_yshFactory.CreateObject("td", tr);
                td.selfattr["col"] = c;
                td.selfattr["row"] = r;
            }
        }
        if (attrs != null) {
            o.styles["height"] = rows * rowHeight + "px";
            o.styles["width"] = cols * colWidth + "px";
        } else {
            o.styles["height"] = "100%";
            o.styles["width"] = "100%";
        }
        o.attrs["border"] = "1";
        o.attrs["cellpadding"] = "0";
        o.attrs["cellspacing"] = "0";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            return "<table" + this.GetAttributesHtml() + ">" + this.GetChildrenHtml() + "</table>";
        }
        YshObject.AttachContainer(o, function (dom, i) { return dom.rows[i]; });
        o.AddContentMenus = function (menulist) {
        }
        o.GetRows = function () { //最后一行的某个格子
            var trLast = this.children[this.children.length - 1];
            var tdLast = trLast.children[0];
            return tdLast.GetCellRange().r1 + 1;
        }
        o.GetCols = function () {
            var trFirst = this.children[0];
            var tdLast = trFirst.children[trFirst.children.length - 1];
            return tdLast.GetCellRange().c1 + 1;
        }
        o.DeleteRow = function (r) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var tr = this.children[i];
                tr.DeleteRow(r);
                if (tr.children.length == 0) //整行全删了
                    this.children.erase(tr);
            }
        }
        o.DeleteCol = function (c) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var tr = this.children[i];
                tr.DeleteCol(c);
                if (tr.children.length == 0) //整行全删了
                    this.children.erase(tr);
            }
        }
        o.DeleteRows = function (r, count) {
            for (var rr = 0; rr < count; rr++) {
                this.DeleteRow(r);
            }
            if (this.children.length == 0)
                this.parent.children.erase(this);
        }
        o.DeleteCols = function (c, count) {
            for (var cc = 0; cc < count; cc++) {
                this.DeleteCol(c);
            }
            if (this.children.length == 0)
                this.parent.children.erase(this);
        }
    }
}
var YshTabLI = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab-li";
        o.attrs["class"] = "tab-top-title";
        o.datasource = { db: "", src: "", col: "", type: "sql", options: { db: "", sql: "" } }; //Gud 20120413修改，改成和YshSelect一样
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshSelect.ApplyOption(o);//Gud 20120418修改，改成和YshSelect一样
        o.GetHtml = function () {
            return "<div " + this.GetAttributesHtml() + " onclick=TabEvent.change('" + this.parent.parent.id + "');>" + o.desc + "</div>";
        }
        YshObject.AttachContainer(o);
        o.AddContentMenus = function (menulist) {
            menulist.push(YSH_CreateContextMenu("add", "删除该页签", "", "var o = g_yshFactory.GetYshById(\"" + this.id + "\");o.parent.parent.RemoveTab(\"" + this.id + "\");docDesign.Redraw();"));
        }
    }
}
var YshTabUL = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "tab-ul";
        o.attrs["class"] = "tab-top";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
        o.GetHtml = function () {
            return "<div ref='ysh-tab'>" + this.GetChildrenHtml() + "</div>";
        }
        o.AddTab = function () { this.doc.CreateObject("tab-li", this); }
        o.RemoveTab = function (i) { var l = this.children[i]; g_yshFactory.Delete(l.id); }
    }
}
var YshTextArea = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "textarea";
        o.descr = "多行文本框";
        o.attrs["value"] = "测试文本";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<textarea " + this.GetAttributesHtml() + ">" + this.attrs["value"] + "</textarea>";
        }
        o.SetValue = function (v) { if (this.ctrl) if (this.IsEditable) { this.ctrl.value = v; } else { this.ctrl.innerHTML = v.replace(/\r\n/g, "<BR>"); } }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                var span = StringPP.format("<span>{0}</span>", o.GetValue());
                o.ctrlback = o.ctrl;
                obj.after(span);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
            else if (!b && !o.GetEditable()) {
                obj.after(o.ctrlback.outerHTML);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
        }
        //o.GetText = function () { if (typeof this.value == "undefined") return this.GetValue(); return this.value; }
    }
}
var YshTextBox = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "text";
        o.descr = "文本框";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<input type='text' readonly " + this.GetAttributesHtml() + " />";
        }
        o.SetValue = function (v) { this.value = v; if (this.ctrl) if (this.IsEditable) { this.ctrl.value = v; } else { this.ctrl.innerText = v; } }
        o.SetReadOnly = function (b) {
            var obj = $(this.ctrl);
            if (b && this.GetEditable()) {
                var span = StringPP.format("<span>{0}</span>", this.GetValue());
                this.ctrlback = this.ctrl;
                obj.after(span);
                this.ctrl = obj.next()[0];
                obj.remove();
            }
            else if (!b && !this.GetEditable()) {
                obj.after(this.ctrlback.outerHTML);
                this.ctrl = obj.next()[0];
                obj.remove();
            }
        }
        //o.GetText = function () { if (typeof this.value == "undefined") return this.GetValue(); return this.value; }
    }
}
var YshTime = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "time";
        o.datasource = { db: "", src: "", col: "" };
        o.selfattr["dtstyle"] = "1";
        o.selfattr["disstyle"] = "111000";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            var dtstyle = this.selfattr["dtstyle"];
            var disstyle = this.selfattr["disstyle"];
            var v = (typeof this.value == "undefined") ? new DateEx("").getDateTime() : this.value;
            return show_demo_datetime(this.id, v, dtstyle, disstyle);
        }
        o.SetValue = function (v) { this.value = v; if (this.ctrl) if (this.IsEditable) { SetCtrlDateTime(this.ctrl.form, this.ctrl.id, v); } else { this.ctrl.innerText = v; } }
        o.GetValue = function () { return this.IsEditable ? this.ctrl.value : ((typeof this.value == "undefined") ? "" : this.value); }
        o.GetText = function () {
            if ((this.value == "") || (typeof this.value == "undefined"))
                return "";
            var dtstyle = this.selfattr["dtstyle"];
            var disstyle = this.selfattr["disstyle"];
            return F_ParseTime(new DateEx(this.value).getDateTime(), (dtstyle == 2) ? disstyle : "1" + disstyle);
        }
        o.GetTextForce = function () {
            var text = o.GetText();
            if (text == "") {
                var dtstyle = this.selfattr["dtstyle"];
                var disstyle = this.selfattr["disstyle"];
                text = F_ParseTime(new DateEx(this.GetValue()).getDateTime(), (dtstyle == 2) ? disstyle : "1" + disstyle);
            }
            return text;
        }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                var span = StringPP.format("<span>{0}</span>", o.GetTextForce());
                o.ctrlback = o.ctrl;
                o.ctrlback2 = obj.next()[0];
                obj.next().remove();
                obj.after(span);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
            else if (!b && !o.GetEditable()) {
                obj.after(o.ctrlback2.outerHTML);
                obj.after(o.ctrlback.outerHTML);
                o.ctrl = obj.next()[0];
                obj.remove();
            }
        }
    }
}
var YshUISelect = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "uiselect";
        o.datasource = { src: "", col: "", type: "sql", options: "" };
        return o;
    }
    , ApplyYsh: function (o) {
        YshSelect.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetText = function () {
            return this.value;
        }
    }
}
var YshUIWebGrid = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "uiwebgrid";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetHtml = function () {
            var tagname = "uiwebgrid";
            var ascxname = "uiwebgrid";
            return GetSpan(tagname, ascxname);
        }
    }
}
var YshUpdownCtrl = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "updown";
        return o;
    },
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return GetSpan(this.tag, "上传下载控件");
        }
        o.GetValue = function () {
            return document.getElementById("YshUpHid" + this.id).value
        }
        o.SetValue = function (v) {
            var arrId;
            if (v instanceof Array)
                arrId = v;
            else
                arrId = v.toString().split(",");
            var strHTML = YshUploader.GetFileHTML(arrId, true).value;
            this.ctrl.nextSibling.firstChild.innerHTML = strHTML;
            document.getElementById("YshUpHid" + this.id).value = v;
        }
    }
}
var YshUploadFile = {
    Create: function () {
        var o = YshObject.Create();
        o.tag = "uploadfile";
        return o;
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetHtml = function () {
            return "<input type='file' " + this.GetAttributesHtml() + " />";
        }
        o.GetValue = function () {
            if (!this.ctrl) return null;
            if (this.IsEditable) {
                if (this.ctrl.value != "")
                    return this.ctrl.value;
                var c = this.ctrl.nextSibling;
                if (c)
                    c = c.nextSibling;
                if (c)
                    c = c.children[0];
                return c ? c.value : null;
            } else {
                return this.ctrl.innerText;
            }
        };
        o.SetValue = function (v) {
            if ((!this.ctrl) || (!this.IsEditable)) return;
            var c = this.ctrl.nextSibling;
            if (c)
                c = c.nextSibling;
            if (c)
                c = c.children[0];
            if (c)
                c.value = v;
        }
    }
}
