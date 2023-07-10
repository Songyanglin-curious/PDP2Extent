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