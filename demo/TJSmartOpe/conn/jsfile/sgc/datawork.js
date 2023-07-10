(function () {
    function ajax(paramer) {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open(paramer.type, paramer.url, paramer.async);

        if (paramer.type == "get") {
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    console.log(this.responseText);
                }
            }
        } else {
            xmlhttp.setRequestHeader('Content-Type', paramer.dataType);
            if (paramer.beforeSend)
                paramer.beforeSend(xmlhttp);
            xmlhttp.send(paramer.data);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    paramer.success(xmlhttp.responseText);
                };
            }
        }
        return xmlhttp;
    }

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
        ajax({
            url: t.url,
            data: t.json,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Ajax-method', t.method);
            },
            async: true,
            success: function (s, ss) {
                var o = null;
                if (typeof s == 'string' && !s)
                    s = "''";
                eval('o = ' + s + ';');
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
    var JqPro = {};
    JqPro.AjaxMethod = function (u, d, m, t) {
        var func = function () {
            var da = { 't_start': t, 't_span': cur, 'notime': 1 },
            res = { 'value': null, 'error': null };
            for (var i = 0; i < d.length; i++) {
                da[d[i]] = arguments[i];
            }
            ajax({
                url: u,
                data: toSJosn(da),
                beforeSend: function (xhr) { xhr.setRequestHeader('Ajax-method', m); },
                success: function (s, ss) {
                    var o = null;
                    if (typeof s == 'string' && !s)
                        s = "''";
                    eval('o = ' + s + ';');
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
    JqPro.ajaxFac = function (u, d, m, t) { return new JqPro.AjaxMethod(u, d, m, t); };
    JqPro.regClass = function (url, methods, args, time) {
        var o = {};
        for (var i = 0; i < methods.length; i++) {
            var n = methods[i];
            o[n] = JqPro.ajaxFac(url, args[i], n, time);
        };
        return o;
    }

    PDP = JqPro.regClass('/conn/ashx/PDP,PDP2.0.ashx', ['Read', 'Execute'], [['strConn', 'strXml', 'arrArgs'], ['args']], '2018-06-14 20:50:00'); 
    PDP.GetBkData = function (o) {
        var d0 = {
            isOK: true
            , errCode: 0
            , errMsg: ""
            , value: null
            , time: ""
            , check: function (strOperate, silent) {
                if (this.isOK) {
                    if ((typeof (silent) != "undefined") && (silent))
                        return true;
                    if (typeof (strOperate) != "undefined")
                        alert(strOperate + "成功");
                    //Ysh.Web.alerts(strOperate + "成功", 500);
                    return true;
                }
                if (this.errCode == 1) {
                    top.location.href = "/ErrorPage.aspx?e=1";
                } else {
                    alert((typeof (strOperate) == "undefined") ? this.errMsg : strOperate + "失败:" + this.errMsg);
                    if ((this.errCode == -2146823279) || (this.errCode == -2146827286)) { /* XXX 未定义,或者语法错误 */
                        top.location.href = "/ErrorPage.aspx?e=2&tm=" + this.time;
                    }
                }
                return false;
            }
        }
        var d1 = o.value;
        d0.isOK = d1[0];
        if (d0.isOK) {
            d0.value = d1[1];
        } else {
            d0.errCode = d1[1];
            d0.errMsg = d1[2];
        }
        return d0;
    }
    PDP.changeArgs = function (args) {
        for (var i = 0; i < args.length; i++) {
            var v = args[i];
            if (typeof v == "undefined") {
                args[i] = null;
                continue;
            }
            if (v instanceof Date) {
                args[i] = v.getFullYear() + "-" + (v.getMonth() + 1) + "-" + v.getDate() + " " + v.getHours() + ":" + v.getMinutes() + ":" + v.getSeconds();
                continue;
            }
            if (v instanceof String)
                args[i] = escape(v);
            else if (v instanceof Array)
                this.changeArgs(v);
            else if (v instanceof Object) {
                if (v.args)
                    this.changeArgs(v.args);
            }
        }
        return args;
    }
    PDP.ExecuteBack = function (f) { var data; try { data = this.GetBkData(f()); } catch (E) { data = this.GetBkData({ value: [false, E.number, E.message] }); }; data.time = new Date(); return data; }
    PDP.exec = function (args, callback, sync) {
        if (!callback)
            return this.ExecuteBack(function () { return PDP.Execute(PDP.changeArgs(args)); });
        if (sync) {
            callback(this.ExecuteBack(function () { return PDP.Execute(PDP.changeArgs(args)); }));
            return;
        }
        PDP.Execute.async(PDP.changeArgs(args)).start(function (data) {
            var ret = PDP.ExecuteBack(function () { return { value: data }; });
            callback(ret);
        });
    }
   
    onmessage = function (event) {
        var msg = event.data;
        if (!msg) return;
        PDP.exec(msg.args, function (data) {
            postMessage({ key: msg.key, result: data });
            msg = null;
        })
    };
})();