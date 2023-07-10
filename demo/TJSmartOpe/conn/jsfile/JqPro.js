(function (jQuery) {
    var $s = jQuery.fn.jquery.match(/^(\d+)\.(\d+)\.?(\d*)/);
    if ($s[1] == 1) {
        if (($s[2] > 4) ? false : (($s[2] < 4) ? true : (($s[3] >= 1) ? false : true))) {
            throw new Error('jQuery版本过低,请使用jQuery-1.4.1及以上版本!');
        };
    }
    jQuery.ajaxSetup({ type: 'POST', async: false });
})(jQuery);
(function (jQuery) { 
    jQuery.extend({ 
        "toJSON": function (o) { 
            if (o == null) 
                return "null"; 
            switch (o.constructor) { 
                case String: 
                    var s = o; 
                    s = '"' + s.replace(/(["\\])/g, '\\$1') + '"';
                    s = s.replace(/\n/g, "\\n");
                    s = s.replace(/\r/g, "\\r");
                    return s; 
                case Array: 
                    var v = []; 
                    for (var i = 0; i < o.length; i++) 
                    v.push(jQuery.toJSON(o[i])); 
                    return "[" + v.join(", ") + "]";
                case Number:
                    return isFinite(o) ? o.toString() : jQuery.toJSON(null); 
                case Boolean: 
                    return o.toString(); 
                case Date: 
                    var d = {}; 
                    d.__type = "System.DateTime";
                    d.Year = o.getUTCFullYear();
                    d.Month = o.getUTCMonth() + 1; 
                    d.Day = o.getUTCDate(); 
                    d.Hour = o.getUTCHours(); 
                    d.Minute = o.getUTCMinutes(); 
                    d.Second = o.getUTCSeconds();
                    d.Millisecond = o.getUTCMilliseconds();
                    d.TimezoneOffset = o.getTimezoneOffset();
                    return jQuery.toJSON(d); 
                default: 
                    if (o["toJSON"] != null && typeof o["toJSON"] == "function") 
                        return o.toJSON();
                    if (typeof o == "object") { 
                        var v = [];
                        for (attr in o) {
                            if (typeof o[attr] != "function")
                            v.push('"' + attr + '": ' + jQuery.toJSON(o[attr])); 
                        } 
                        if (v.length > 0) 
                            return "{" + v.join(", ") + "}"; 
                        else 
                            return "{}";
                    } 
                    return o.toString(); 
                } 
            } 
        }); 
} (jQuery));
window.Ajax = window.Ajax || {}; 
window.Ajax.Web = window.Ajax.Web || {}; 
Ajax.Web.NameValueCollection = function () { 
    this.__type = "System.Collections.Specialized.NameValueCollection"; 
    this.add = function (key, value) {
         if (this[key] == null) { this[key] = value; } 
    }; 
    this.getKeys = function () { 
        var keys = []; 
        for (key in this) { 
            if (typeof this[key] != "function") { keys.push(key); } 
        } 
        return keys; 
    }; 
    this.getValue = function (key) { return this[key]; }; 
    this.toJSON = function () { 
        var o = this; 
        o.toJSON = null; 
        delete o.toJSON; 
        return jQuery.toJSON(o); 
     };
 }; 
 Ajax.Web.DataTable = function (columns, rows) {     this.__type = "System.Data.DataTable, System.Data"; this.Columns = []; this.Rows = []; this.addColumn = function (name, type) { var c = {}; c.Name = name; c.__type = type; this.Columns.push(c); }; this.toJSON = function () { var dt = {}; dt.Columns = []; for (var i = 0; i < this.Columns.length; i++) { dt.Columns.push([this.Columns[i].Name, this.Columns[i].__type]); }; dt.Rows = []; for (var i = 0; i < this.Rows.length; i++) { var row = []; for (var j = 0; j < this.Columns.length; j++) { row.push(this.Rows[i][this.Columns[j].Name]); } dt.Rows.push(row); } return jQuery.toJSON(dt); }; this.addRow = function (row) { this.Rows.push(row); }; if (columns != null) { for (var i = 0; i < columns.length; i++) { this.addColumn(columns[i][0], columns[i][1]); } } if (rows != null) { for (var i = 0; i < rows.length; i++) { var row = {}; for (var c = 0; c < this.Columns.length && c < rows[i].length; c++) { row[this.Columns[c].Name] = rows[i][c]; } this.addRow(row); } } }; Ajax.Web.DataSet = function (tables) { this.__type = "System.Data.DataSet, System.Data"; this.Tables = []; this.addTable = function (table) { this.Tables.push(table); }; if (tables != null) { for (var i = 0; i < tables.length; i++) { this.addTable(tables[i]); } } };
(function ($, win, undefined) {
    var cur = new Date();
    eval(function (p, a, c, k, e, d) { e = function (c) { return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) d[e(c)] = k[c] || e(c); k = [function (e) { return d[e] }]; e = function () { return '\\w+' }; c = 1; }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p; }('6 3(0,c){0.d=2 4().5()-e.5();7 1=b.a.f(2 4(),j,k)+l.g();0[\'h\']=8(1);9 $.3(0)}6 i(0){7 1=3(0,2 4());9 1+","+8(1)}', 22, 22, 'da|s|new|toJSON|Date|getTime|function|var|hex_md5|return|Time|Ysh|tmStart|t_span|cur|toString|random|t_code|toSJosn|false|true|Math'.split('|'), 0, {}));
    var AsyncMethod = function (u, d, m, tm) {
        var cur = new Date();
        this.url = u;
        this.param = d;
        this.json = toSJosn(d);
        this.method = m;
    };
    AsyncMethod.prototype.start = function (callback) { 
        callback = callback || function () { }; 
        var t = this;
        $.ajax({
            url: Ajax.extendUrl ? Ajax.extendUrl(t.url) : t.url, 
            data: t.json, 
            beforeSend: function (xhr) { 
                xhr.setRequestHeader('Ajax-method', t.method); 
            }, 
            async: true, 
            success: function (s, ss) {
                var o = null; 
                //if (typeof s == 'string' && !s) 
                //    s = "''"; 
                //eval('o = ' + s + ';'); 
                if (typeof s == 'string' && !s)
                    o = '';
                else
                    o = JSON.parse(s);
                if (typeof callback === 'function')
                    callback.call(t, o, ss);
                else {
                    if (callback.success)
                        callback.success.call(t, o, ss);
                }
            }, 
            error: function (data, status, e) {
                console.log(data.responseText);
                if (callback.error)
                    callback.error.call(t, data, status, e);
            	return false;
            },
            context: t 
        }); 
    }; 
    win.JqPro = {}; 
    win.JqPro.AjaxMethod = function (u, d, m,t) {
        var func = function () { 
            var da = { 't_start':t,'t_span':cur,'notime':1 }, 
            res = { 'value': null, 'error': null }; 
            for (var i = 0; i < d.length; i++) { 
                da[d[i]] = arguments[i]; 
            }
            $.ajax({ 
                url: Ajax.extendUrl ? Ajax.extendUrl(u) : u, 
                data: toSJosn(da), 
                beforeSend: function (xhr) { xhr.setRequestHeader('Ajax-method', m); }, 
                success: function (s, ss) {
                    var o = null; 
                    //if (typeof s == 'string' && !s) 
                    //    s = "''"; 
                    //eval('o = ' + s + ';'); 
                    if (typeof s == 'string' && !s)
                        o = '';
                    else
                        o = JSON.parse(s);
                    this.value = o; 
                }, 
                error: function (data, status, e) {
                	alert(e);
                    console.log(data.responseText);
                	return false;
                },
                context: res 
            }); 
            return res; 
        }; 
        func.async = function () {
            var da = { 't_start': t, 't_span': cur, 'notime': 1 };
            for (var i = 0; i < d.length; i++) { da[d[i]] = arguments[i]; }
            return new AsyncMethod(u, da, m, t);
        }; 
        return func; 
    }; 
    win.JqPro.ajaxFac = function (u, d, m,t) { return new JqPro.AjaxMethod(u, d, m,t); }; 
    win.JqPro.regClass = function (url, methods, args,time) {
        var o = {}; 
        for (var i = 0; i < methods.length; i++) { 
            var n = methods[i]; 
            o[n] = win.JqPro.ajaxFac(url, args[i], n,time); 
        }; 
        return o; 
    } 
})(window.jQuery, window);