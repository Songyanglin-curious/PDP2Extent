YshObject = {
    Create: function () {
        return { doc: null, id: "", name: "", desc: "", descr: "", alwaysenable: "", selfattr: { lockable: "" }, attrs: {}, styles: {}, children: [], parent: null, tag: "Unknown", datasource: null, events: {}, checks: {}, ctrl: null, IsEditable: false, commonevents: {} };
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
            Ysh.Web.Event.attachEvent(this.ctrl, evt, act);
        };
        if (!o["ReAttachEvents"]) o.ReAttachEvents = function () {
            if (!this.attachevents)
                return;
            for (var k in this.attachevents) {
                var arrEvent = this.attachevents[k];
                for (var i = 0; i < arrEvent.length; i++)
                    Ysh.Web.Event.attachEvent(this.ctrl, k, arrEvent[i]);
            }
        }
        if (typeof o["isEnable"] == "undefined") o.isEnable = true;
        if (typeof o["isVisible"] == "undefined") o.isVisible = true;
    }
    , ApplyYsh: function (ysh) {
        this.VerifyData(ysh);
        ysh.LinkList = function (lst, f) {
            return Ysh.Array.link(lst, f, "");
        }
        ysh.LinkObject = function (o, fToStr, fSkip) {
            return Ysh.Object.link(o, fToStr, "", fSkip);
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
    },
    bindControls: function (arrYsh, arrId) {
        for (var i = 0; i < arrYsh.length; i++) {
            var ctrl = arrId[i];
            if (ctrl.indexOf("(") < 0) {
                ctrl = document.getElementById(ctrl);
            } else {
                eval("ctrl=" + ctrl)
            };
            $Y(arrYsh[i]).ctrl = ctrl;
        }
    }
}

function YSH_CreateAscx(tagname, ascxname, bData, bContainer) {
    return {
        ApplyYsh: function (o) {
            YshObject.ApplyYsh(o);
            if (bData)
                YshObject.AttachDataSource(o);
            if (bContainer)
                YshObject.AttachContainer(o);
        }
    };
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
    }
}
var YshCell = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
    }
}
var YshCheckBox = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.GetValue = function () { if (this.ctrl) return this.ctrl.checked; return null; };
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
    }
}
var YshDragTreeAscx = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
    }
}
var YshDropDownList = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
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
            //if (v == "" || v == "''" || v == null)
            //    return;
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
var YshDllTreeAscx = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
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
var YshDynaTreeAscx = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        o.GetValue = function () {
            var g = eval("GantteTempData_" + o.id);
            if (g != undefined)
                return g;
            else
                return -1;
        }
    }
}
var YshFullListEditAscx = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
    }
}
var YshHiddenFile = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.SetValue = function (v) {
            if ((!this.ctrl) || (!this.IsEditable)) return;
            this.ctrl.children[0].value = "1";
            this.ctrl.children[2].value = v;
        }
    }
}
var YshHref = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
    }
}
var YshHtmlRadio = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.SetValue = function (v) { if (this.ctrl) { this.ctrl.checked = v; } }
    }
}
var YshIframe = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
    }
}
var YshInnerTable = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
    }
}
var YshInputHidden = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.SetValue = function (v) { if (this.ctrl) { this.ctrl.value = v; } }
        o.GetValue = function () { if (this.ctrl) return this.ctrl.value; };
    }
}
var YshInputPwd = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.SetValue = function (v) { this.value = v; if (this.ctrl) { this.ctrl.innerText = v; } }
        //o.GetText = function () { if (typeof this.value == "undefined") return this.GetValue(); return this.value; }
        o.GetValue = function () { if (typeof this.value != "undefined") return this.value; if (this.ctrl) return (this.IsEditable && (typeof this.ctrl.value != "undefined")) ? this.ctrl.value : this.ctrl.innerText; return null; }
    }
}
var YshListCtrl = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
    }
}
var YshListEditAscx = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
    }
}
var YshMasterPage = {    
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o, function (dom, i) {
            var itemsId = new Array(); //存放母版页中的原始itemId
            $(o.GetHtml()).find("[name='yshmasterpageitem']").each(function (i) {
                itemsId.push($(this).attr("id"));
            });
            return document.getElementById(itemsId[i]);
        });
    }
}
var YshMasterPageItem = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o, function (dom, i) {
            if (dom.children[0].innerHTML == "[母版页子控件]")
                return dom.children[i + 1];
            else
                return dom.children[i];
        });
    }
}
var YshRadio = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);        
        o.GetValue = function () { return this.ctrl.value; }
        o.SetValue = function (v) {
            this.ctrl.value = v;
            var radioGroup = $(':radio[t=ysh_radio][group=' + this.name + ']');
            $.each(radioGroup, function (i, n) {
                var _n = $(n);
                if (_n.val() == v)
                    _n.attr('checked', true);
                else
                    _n.attr('checked', false);
            });
        }
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        o.SetValue = function (v) { if (this.ctrl) { this.ctrl.value = v; } }
        o.GetValue = function () {
            if (this.ctrl) return this.ctrl.value;
        };
    }
}
var YshRow = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o, function (dom, i) { return dom.cells[i]; });
    }
}
var YshSearch = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
    }
}
var YshSelect = {
    ApplyOption: function (o) {
    }
    , ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        this.ApplyOption(o);
        o.SetValue = function (v, t) {
            this.value = v;
            if (this.ctrl)
                if (this.IsEditable) {
                    this.ctrl.value = v;
                }
                else {
                    if (typeof t == "undefined") t = v;
                    this.ctrl.innerHTML = StringPP.format("<input type=hidden value='{0}' />{1}", v, t);
                }
        }
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
            if (this.IsEditable) {
                //return getItemTextByValue(this.ctrl, this.ctrl.value);
                var selectedIndex = this.ctrl.selectedIndex;
                return (selectedIndex < 0) ? "" : this.ctrl.options[selectedIndex].text
            }
            //return this.ctrl.children[1].innerText;
            return this.ctrl.innerText;
        }
        o.relates = [];
        o.AddRelate = function (oR) { this.relates.push(oR); }
        o.relateValues = [];
        o.UpdateOption = function (bForce) {
            if (!this.IsEditable)
                return;
            var opts = this.datasource.options;
            var args = [];
            var relateValues = [];
            for (var i = 0; i < this.relates.length; i++) {
                var r = this.relates[i];
                if (r instanceof Array) {
                    var rv = r[1]();
                    args.push({ id: r[0], value: rv });
                    relateValues.push(rv);
                } else {
                    var rv = r.GetValue();
                    args.push({ id: r.doc.GetDesignID(r.id), value: rv });
                    relateValues.push(rv);
                }
            }
            if (!bForce) {
                var bChanged = false;
                if (relateValues.length == this.relateValues.length) {
                    for (var i = 0; i < relateValues.length; i++) {
                        if (relateValues[i] !== this.relateValues[i]) {
                            bChanged = true;
                            break;
                        }
                    }
                } else {
                    bChanged = true;
                }
                if (!bChanged)
                    return;
            }
            var v;
            switch (this.datasource.type) {
                case "sql":
                    v = GetBkData(YshGrid.GetSQLSelectOptions(opts.db, opts.sql.split("#@#")[0], args, false));
                    break;
                case "xmlsql":
                    v = GetBkData(YshGrid.GetSQLSelectOptions(opts.db, opts.sql.split("#@#")[0], args, true));
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
            if (typeof this.ctrl._delayValue != "undefined")
                selected = this.ctrl._delayValue;
            this.ctrl.innerHTML = "";
            for (var i = 0; i < v.length; i++) {
                var opt = new Option;
                opt.value = v[i][0];
                opt.text = v[i][1];
                opt.title = opt.text;
                this.ctrl.options.add(opt);
                delete opt;
            }
            this.ctrl.value = selected;
            this.relateValues = relateValues;
        }
        o.SetReadOnly = function (b) {
            var obj = $(o.ctrl);
            if (b && o.GetEditable()) {
                var span = StringPP.format("<span><input type=hidden value='{0}' />{0}</span>", o.GetText());
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
    }
}
var YshTab = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
        YshSelect.ApplyOption(o); //Gud 20120418修改，改成和YshSelect一样
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
        o.SetHide = function (value, bHide) {
            var tabId = o.id + "Tab";
            return eval(tabId).SetHide(value, bHide);
        }
        o.SetItemHide = function (idx, bHide) {
            var tabId = o.id + "Tab";
            return eval(tabId).SetItemHide(idx, bHide);
        }
        o.SetItemText = function (idx, text) {
            var tabId = o.id + "Tab";
            return eval(tabId).SetItemText(idx, text);
        }
    }
}
var YshTabContent = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
        o.AddContent = function (show) {
            var d = this.doc.CreateObject("tab-content-div", this);
            if (show)
                d.attrs["class"] = "show";
        }
        o.RemoveContent = function (i) { var c = this.children[i]; g_yshFactory.Delete(c.id); }
    }
}
var YshTabContentDiv = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
    }
}
var YshTable = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o, function (dom, i) { return dom.rows[i]; });
    }
}
var YshTabLI = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshSelect.ApplyOption(o); //Gud 20120418修改，改成和YshSelect一样
        YshObject.AttachContainer(o);
    }
}
var YshTabUL = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachContainer(o);
        o.AddTab = function () { this.doc.CreateObject("tab-li", this); }
        o.RemoveTab = function (i) { var l = this.children[i]; g_yshFactory.Delete(l.id); }
    }
}
var YshTextArea = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
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
        o.BindShowOptions = function () {
            if (this.IsEditable) {
                this.AttachEvent("onclick", function () {
                    if (o.ctrl.optionlist)
                    Ysh.Web.Text.setDropDownList(o.ctrl, o.ctrl.optionlist.split(","));
                });
            }
        }
    }
}
var YshTime = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
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
var YshUpdownCtrl = {
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
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
    ApplyYsh: function (o) {
        YshObject.ApplyYsh(o);
        YshObject.AttachDataSource(o);
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