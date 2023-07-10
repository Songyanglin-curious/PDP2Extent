var T,
baidu = T = baidu || {
    version: "1.5.2"
};
baidu.guid = "$BAIDU$";
baidu.$$ = window[baidu.guid] = window[baidu.guid] || {
    global: {}
};
baidu.ui = baidu.ui || {
    version: "1.3.9"
};
baidu.ui.getUI = function (c) {
    var c = c.split("-"),
	b = baidu.ui,
	a = c.length,
	d = 0;
    for (; d < a; d++) {
        b = b[c[d].charAt(0).toUpperCase() + c[d].slice(1)]
    }
    return b
};
baidu.lang = baidu.lang || {};
baidu.lang.isString = function (a) {
    return "[object String]" == Object.prototype.toString.call(a)
};
baidu.isString = baidu.lang.isString;
baidu.ui.create = function (b, a) {
    if (baidu.lang.isString(b)) {
        b = baidu.ui.getUI(b)
    }
    return new b(a)
};
baidu.dom = baidu.dom || {};
baidu.dom.g = function (a) {
    if (!a) {
        return null
    }
    if ("string" == typeof a || a instanceof String) {
        return document.getElementById(a)
    } else {
        if (a.nodeName && (a.nodeType == 1 || a.nodeType == 9)) {
            return a
        }
    }
    return null
};
baidu.g = baidu.G = baidu.dom.g;
baidu.lang.guid = function () {
    return "TANGRAM$" + baidu.$$._counter++
};
baidu.$$._counter = baidu.$$._counter || 1;
baidu.lang.Class = function () {
    this.guid = baidu.lang.guid(); !this.__decontrolled && (baidu.$$._instances[this.guid] = this)
};
baidu.$$._instances = baidu.$$._instances || {};
baidu.lang.Class.prototype.dispose = function () {
    delete baidu.$$._instances[this.guid];
    for (var a in this) {
        typeof this[a] != "function" && delete this[a]
    }
    this.disposed = true
};
baidu.lang.Class.prototype.toString = function () {
    return "[object " + (this.__type || this._className || "Object") + "]"
};
window.baiduInstance = function (a) {
    return baidu.$$._instances[a]
};
baidu.lang.Event = function (a, b) {
    this.type = a;
    this.returnValue = true;
    this.target = b || null;
    this.currentTarget = null
};
baidu.lang.Class.prototype.fire = baidu.lang.Class.prototype.dispatchEvent = function (e, a) {
    baidu.lang.isString(e) && (e = new baidu.lang.Event(e)); !this.__listeners && (this.__listeners = {});
    a = a || {};
    for (var c in a) {
        e[c] = a[c]
    }
    var c,
	g,
	d = this,
	b = d.__listeners,
	f = e.type;
    e.target = e.target || (e.currentTarget = d);
    f.indexOf("on") && (f = "on" + f);
    typeof d[f] == "function" && d[f].apply(d, arguments);
    if (typeof b[f] == "object") {
        for (c = 0, g = b[f].length; c < g; c++) {
            b[f][c] && b[f][c].apply(d, arguments)
        }
    }
    return e.returnValue
};
baidu.lang.Class.prototype.on = baidu.lang.Class.prototype.addEventListener = function (e, d, c) {
    if (typeof d != "function") {
        return
    } !this.__listeners && (this.__listeners = {});
    var b,
	a = this.__listeners;
    e.indexOf("on") && (e = "on" + e);
    typeof a[e] != "object" && (a[e] = []);
    for (b = a[e].length - 1; b >= 0; b--) {
        if (a[e][b] === d) {
            return d
        }
    }
    a[e].push(d);
    c && typeof c == "string" && (a[e][c] = d);
    return d
};
baidu.event = baidu.event || {};
baidu.event._listeners = baidu.event._listeners || [];
baidu.dom._g = function (a) {
    if (baidu.lang.isString(a)) {
        return document.getElementById(a)
    }
    return a
};
baidu._g = baidu.dom._g;
baidu.event.on = function (b, e, g) {
    e = e.replace(/^on/i, "");
    b = baidu.dom._g(b);
    var f = function (j) {
        g.call(b, j)
    },
	a = baidu.event._listeners,
	d = baidu.event._eventFilter,
	h,
	c = e;
    e = e.toLowerCase();
    if (d && d[e]) {
        h = d[e](b, e, f);
        c = h.type;
        f = h.listener
    }
    if (b.addEventListener) {
        b.addEventListener(c, f, false)
    } else {
        if (b.attachEvent) {
            b.attachEvent("on" + c, f)
        }
    }
    a[a.length] = [b, e, g, f, c];
    return b
};
baidu.on = baidu.event.on;
baidu.event.un = function (c, f, b) {
    c = baidu.dom._g(c);
    f = f.replace(/^on/i, "").toLowerCase();
    var j = baidu.event._listeners,
	d = j.length,
	e = !b,
	h,
	g,
	a;
    while (d--) {
        h = j[d];
        if (h[1] === f && h[0] === c && (e || h[2] === b)) {
            g = h[4];
            a = h[3];
            if (c.removeEventListener) {
                c.removeEventListener(g, a, false)
            } else {
                if (c.detachEvent) {
                    c.detachEvent("on" + g, a)
                }
            }
            j.splice(d, 1)
        }
    }
    return c
};
baidu.un = baidu.event.un;
baidu.ui.Base = {
    id: "",
    getId: function (a) {
        var c = this,
		b;
        b = "tangram-" + c.uiType + "--" + (c.id ? c.id : c.guid);
        return a ? b + "-" + a : b
    },
    getClass: function (b) {
        var d = this,
		c = d.classPrefix,
		a = d.skin;
        if (b) {
            c += "-" + b;
            a += "-" + b
        }
        if (d.skin) {
            c += " " + a
        }
        return c
    },
    getMain: function () {
        return baidu.g(this.mainId)
    },
    getBody: function () {
        return baidu.g(this.getId())
    },
    uiType: "",
    getCallRef: function () {
        return "window['$BAIDU$']._instances['" + this.guid + "']"
    },
    getCallString: function (d) {
        var c = 0,
		b = Array.prototype.slice.call(arguments, 1),
		a = b.length;
        for (; c < a; c++) {
            if (typeof b[c] == "string") {
                b[c] = "'" + b[c] + "'"
            }
        }
        return this.getCallRef() + "." + d + "(" + b.join(",") + ");"
    },
    on: function (a, b, c) {
        baidu.on(a, b, c);
        this.addEventListener("ondispose",
		function () {
		    baidu.un(a, b, c)
		})
    },
    renderMain: function (b) {
        var d = this,
		c = 0,
		a;
        if (d.getMain()) {
            return
        }
        b = baidu.g(b);
        if (!b) {
            b = document.createElement("div");
            document.body.appendChild(b);
            b.style.position = "absolute";
            b.className = d.getClass("main")
        }
        if (!b.id) {
            b.id = d.getId("main")
        }
        d.mainId = b.id;
        b.setAttribute("data-guid", d.guid);
        return b
    },
    dispose: function () {
        this.dispatchEvent("dispose");
        baidu.lang.Class.prototype.dispose.call(this)
    }
};
baidu.object = baidu.object || {};
baidu.extend = baidu.object.extend = function (c, a) {
    for (var b in a) {
        if (a.hasOwnProperty(b)) {
            c[b] = a[b]
        }
    }
    return c
};
baidu.lang.isFunction = function (a) {
    return "[object Function]" == Object.prototype.toString.call(a)
};
baidu.ui.createUI = function (c, j) {
    j = j || {};
    var g = j.superClass || baidu.lang.Class,
	f = g == baidu.lang.Class ? 1 : 0,
	d,
	b,
	h = function (l, k) {
	    var m = this;
	    l = l || {};
	    g.call(m, !f ? l : (l.guid || ""), true);
	    baidu.object.extend(m, h.options);
	    baidu.object.extend(m, l);
	    m.classPrefix = m.classPrefix || "tangram-" + m.uiType.toLowerCase();
	    for (d in baidu.ui.behavior) {
	        if (typeof m[d] != "undefined" && m[d]) {
	            baidu.object.extend(m, baidu.ui.behavior[d]);
	            if (baidu.lang.isFunction(m[d])) {
	                m.addEventListener("onload",
					function () {
					    baidu.ui.behavior[d].call(m[d].apply(m))
					})
	            } else {
	                baidu.ui.behavior[d].call(m)
	            }
	        }
	    }
	    c.apply(m, arguments);
	    for (d = 0, b = h._addons.length; d < b; d++) {
	        h._addons[d](m)
	    }
	    if (l.parent && m.setParent) {
	        m.setParent(l.parent)
	    }
	    if (!k && l.autoRender) {
	        m.render(l.element)
	    }
	},
	a = function () { };
    a.prototype = g.prototype;
    var e = h.prototype = new a();
    for (d in baidu.ui.Base) {
        e[d] = baidu.ui.Base[d]
    }
    h.extend = function (k) {
        for (d in k) {
            h.prototype[d] = k[d]
        }
        return h
    };
    h._addons = [];
    h.register = function (k) {
        if (typeof k == "function") {
            h._addons.push(k)
        }
    };
    h.options = {};
    return h
};
baidu.ui.behavior = baidu.ui.behavior || {};
baidu.string = baidu.string || {}; (function () {
    var a = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
    baidu.string.trim = function (b) {
        return String(b).replace(a, "")
    }
})();
baidu.trim = baidu.string.trim;
baidu.dom.addClass = function (f, g) {
    f = baidu.dom.g(f);
    var b = g.split(/\s+/),
	a = f.className,
	e = " " + a + " ",
	d = 0,
	c = b.length;
    for (; d < c; d++) {
        if (e.indexOf(" " + b[d] + " ") < 0) {
            a += (a ? " " : "") + b[d]
        }
    }
    f.className = a;
    return f
};
baidu.addClass = baidu.dom.addClass;
baidu.dom.removeClass = function (f, g) {
    f = baidu.dom.g(f);
    var d = f.className.split(/\s+/),
	h = g.split(/\s+/),
	b,
	a = h.length,
	c,
	e = 0;
    for (; e < a; ++e) {
        for (c = 0, b = d.length; c < b; ++c) {
            if (d[c] == h[e]) {
                d.splice(c, 1);
                break
            }
        }
    }
    f.className = d.join(" ");
    return f
};
baidu.removeClass = baidu.dom.removeClass;
baidu.dom.hasClass = function (c, d) {
    c = baidu.dom.g(c);
    if (!c || !c.className) {
        return false
    }
    var b = baidu.string.trim(d).split(/\s+/),
	a = b.length;
    d = c.className.split(/\s+/).join(" ");
    while (a--) {
        if (!(new RegExp("(^| )" + b[a] + "( |\x24)")).test(d)) {
            return false
        }
    }
    return true
};
baidu.event.getTarget = function (a) {
    return a.target || a.srcElement
};
baidu.array = baidu.array || {};
baidu.each = baidu.array.forEach = baidu.array.each = function (g, e, b) {
    var d,
	f,
	c,
	a = g.length;
    if ("function" == typeof e) {
        for (c = 0; c < a; c++) {
            f = g[c];
            d = e.call(b || g, f, c);
            if (d === false) {
                break
            }
        }
    }
    return g
};
baidu.object.each = function (e, c) {
    var b,
	a,
	d;
    if ("function" == typeof c) {
        for (a in e) {
            if (e.hasOwnProperty(a)) {
                d = e[a];
                b = c.call(e, d, a);
                if (b === false) {
                    break
                }
            }
        }
    }
    return e
};
baidu.fn = baidu.fn || {};
baidu.fn.bind = function (b, a) {
    var c = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
    return function () {
        var e = baidu.lang.isString(b) ? a[b] : b,
		d = (c) ? c.concat([].slice.call(arguments, 0)) : arguments;
        return e.apply(a || e, d)
    }
};
baidu.lang.Class.prototype.addEventListeners = function (c, d) {
    if (typeof d == "undefined") {
        for (var b in c) {
            this.addEventListener(b, c[b])
        }
    } else {
        c = c.split(",");
        var b = 0,
		a = c.length,
		e;
        for (; b < a; b++) {
            this.addEventListener(baidu.trim(c[b]), d)
        }
    }
}; (function () {
    var a = baidu.ui.behavior.statable = function () {
        var b = this;
        b.addEventListeners("ondisable,onenable",
		function (e, c) {
		    var d,
			f;
		    c = c || {};
		    elementId = (c.element || b.getMain()).id;
		    f = c.group;
		    if (e.type == "ondisable" && !b.getState(elementId, f)["disabled"]) {
		        b.removeState("press", elementId, f);
		        b.removeState("hover", elementId, f);
		        b.setState("disabled", elementId, f)
		    } else {
		        if (e.type == "onenable" && b.getState(elementId, f)["disabled"]) {
		            b.removeState("disabled", elementId, f)
		        }
		    }
		})
    };
    a._states = {};
    a._allStates = ["hover", "press", "disabled"];
    a._allEventsName = ["mouseover", "mouseout", "mousedown", "mouseup"];
    a._eventsHandler = {
        mouseover: function (d, c) {
            var b = this;
            if (!b.getState(d, c)["disabled"]) {
                b.setState("hover", d, c);
                return true
            }
        },
        mouseout: function (d, c) {
            var b = this;
            if (!b.getState(d, c)["disabled"]) {
                b.removeState("hover", d, c);
                b.removeState("press", d, c);
                return true
            }
        },
        mousedown: function (d, c) {
            var b = this;
            if (!b.getState(d, c)["disabled"]) {
                b.setState("press", d, c);
                return true
            }
        },
        mouseup: function (d, c) {
            var b = this;
            if (!b.getState(d, c)["disabled"]) {
                b.removeState("press", d, c);
                return true
            }
        }
    };
    a._getStateHandlerString = function (h, f) {
        var g = this,
		e = 0,
		b = g._allEventsName.length,
		c = [],
		d;
        if (typeof h == "undefined") {
            h = f = ""
        }
        for (; e < b; e++) {
            d = g._allEventsName[e];
            c[e] = "on" + d + '="' + g.getCallRef() + "._fireEvent('" + d + "', '" + h + "', '" + f + "', event)\""
        }
        return c.join(" ")
    };
    a._fireEvent = function (c, g, b, f) {
        var d = this,
		h = d.getId(g + b);
        if (d._eventsHandler[c].call(d, h, g)) {
            d.dispatchEvent(c, {
                element: h,
                group: g,
                key: b,
                DOMEvent: f
            })
        }
    };
    a.addState = function (e, b, c) {
        var d = this;
        d._allStates.push(e);
        if (b) {
            d._allEventsName.push(b);
            if (!c) {
                c = function () {
                    return true
                }
            }
            d._eventsHandler[b] = c
        }
    };
    a.getState = function (b, e) {
        var d = this,
		c;
        e = e ? e + "-" : "";
        b = b ? b : d.getId();
        c = d._states[e + b];
        return c ? c : {}
    };
    a.setState = function (e, b, f) {
        var d = this,
		g,
		c;
        f = f ? f + "-" : "";
        b = b ? b : d.getId();
        g = f + b;
        d._states[g] = d._states[g] || {};
        c = d._states[g][e];
        if (!c) {
            d._states[g][e] = 1;
            baidu.addClass(b, d.getClass(f + e))
        }
    };
    a.removeState = function (d, b, e) {
        var c = this,
		f;
        e = e ? e + "-" : "";
        b = b ? b : c.getId();
        f = e + b;
        if (c._states[f]) {
            c._states[f][d] = 0;
            baidu.removeClass(b, c.getClass(e + d))
        }
    }
})();
baidu.dom.getDocument = function (a) {
    a = baidu.dom.g(a);
    return a.nodeType == 9 ? a : a.ownerDocument || a.document
};
baidu.dom.getWindow = function (a) {
    a = baidu.dom.g(a);
    var b = baidu.dom.getDocument(a);
    return b.parentWindow || b.defaultView || null
};
baidu.dom.getComputedStyle = function (b, a) {
    b = baidu.dom._g(b);
    var d = baidu.dom.getDocument(b),
	c;
    if (d.defaultView && d.defaultView.getComputedStyle) {
        c = d.defaultView.getComputedStyle(b, null);
        if (c) {
            return c[a] || c.getPropertyValue(a)
        }
    }
    return ""
};
baidu.dom._styleFixer = baidu.dom._styleFixer || {};
baidu.dom._styleFilter = baidu.dom._styleFilter || [];
baidu.dom._styleFilter.filter = function (b, e, f) {
    for (var a = 0, d = baidu.dom._styleFilter, c; c = d[a]; a++) {
        if (c = c[f]) {
            e = c(b, e)
        }
    }
    return e
};
baidu.string.toCamelCase = function (a) {
    if (a.indexOf("-") < 0 && a.indexOf("_") < 0) {
        return a
    }
    return a.replace(/[-_][^-_]/g,
	function (b) {
	    return b.charAt(1).toUpperCase()
	})
};
baidu.dom.getStyle = function (c, b) {
    var e = baidu.dom;
    c = e.g(c);
    b = baidu.string.toCamelCase(b);
    var d = c.style[b] || (c.currentStyle ? c.currentStyle[b] : "") || e.getComputedStyle(c, b);
    if (!d) {
        var a = e._styleFixer[b];
        if (a) {
            d = a.get ? a.get(c) : baidu.dom.getStyle(c, a)
        }
    }
    if (a = e._styleFilter) {
        d = a.filter(b, d, "get")
    }
    return d
};
baidu.getStyle = baidu.dom.getStyle;
baidu.browser = baidu.browser || {};
baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || +RegExp["\x241"]) : undefined;
baidu.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ? +(RegExp["\x246"] || RegExp["\x242"]) : undefined;
baidu.browser.isWebkit = /webkit/i.test(navigator.userAgent);
baidu.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
baidu.browser.isStrict = document.compatMode == "CSS1Compat";
baidu.dom.getPosition = function (a) {
    a = baidu.dom.g(a);
    var k = baidu.dom.getDocument(a),
	d = baidu.browser,
	g = baidu.dom.getStyle,
	c = d.isGecko > 0 && k.getBoxObjectFor && g(a, "position") == "absolute" && (a.style.top === "" || a.style.left === ""),
	h = {
	    left: 0,
	    top: 0
	},
	f = (d.ie && !d.isStrict) ? k.body : k.documentElement,
	l,
	b;
    if (a == f) {
        return h
    }
    if (a.getBoundingClientRect) {
        b = a.getBoundingClientRect();
        h.left = Math.floor(b.left) + Math.max(k.documentElement.scrollLeft, k.body.scrollLeft);
        h.top = Math.floor(b.top) + Math.max(k.documentElement.scrollTop, k.body.scrollTop);
        h.left -= k.documentElement.clientLeft;
        h.top -= k.documentElement.clientTop;
        var j = k.body,
		m = parseInt(g(j, "borderLeftWidth")),
		e = parseInt(g(j, "borderTopWidth"));
        if (d.ie && !d.isStrict) {
            h.left -= isNaN(m) ? 2 : m;
            h.top -= isNaN(e) ? 2 : e
        }
    } else {
        l = a;
        do {
            h.left += l.offsetLeft;
            h.top += l.offsetTop;
            if (d.isWebkit > 0 && g(l, "position") == "fixed") {
                h.left += k.body.scrollLeft;
                h.top += k.body.scrollTop;
                break
            }
            l = l.offsetParent
        }
        while (l && l != a);
        if (d.opera > 0 || (d.isWebkit > 0 && g(a, "position") == "absolute")) {
            h.top -= k.body.offsetTop
        }
        l = a.offsetParent;
        while (l && l != k.body) {
            h.left -= l.scrollLeft;
            if (!d.opera || l.tagName != "TR") {
                h.top -= l.scrollTop
            }
            l = l.offsetParent
        }
    }
    return h
};
baidu.dom.setStyle = function (c, b, d) {
    var e = baidu.dom,
	a;
    c = e.g(c);
    b = baidu.string.toCamelCase(b);
    if (a = e._styleFilter) {
        d = a.filter(b, d, "set")
    }
    a = e._styleFixer[b]; (a && a.set) ? a.set(c, d) : (c.style[a || b] = d);
    return c
};
baidu.setStyle = baidu.dom.setStyle;
baidu.dom.setStyles = function (b, c) {
    b = baidu.dom.g(b);
    for (var a in c) {
        baidu.dom.setStyle(b, a, c[a])
    }
    return b
};
baidu.setStyles = baidu.dom.setStyles;
baidu.dom._styleFilter[baidu.dom._styleFilter.length] = {
    set: function (a, b) {
        if (b.constructor == Number && !/zIndex|fontWeight|opacity|zoom|lineHeight/i.test(a)) {
            b = b + "px"
        }
        return b
    }
};
baidu.dom.setPosition = function (b, a) {
	var fix=20;
	var x=a.left - (parseFloat(baidu.dom.getStyle(b, "margin-left")) || 0);
	var y=a.top - (parseFloat(baidu.dom.getStyle(b, "margin-top")) || 0);
	var totalX=parseInt(document.body.offsetWidth)-124-fix;
	var totalY=parseInt(document.body.offsetHeight)-100-fix;
	if(x>=totalX)
		x-=124;
	if(y>=totalY)
	    y-=(100+fix);
    return baidu.dom.setStyles(b, {
        left: x,top: y
    })
};
baidu.page = baidu.page || {};
baidu.page.getViewWidth = function () {
    var b = document,
	a = b.compatMode == "BackCompat" ? b.body : b.documentElement;
    return a.clientWidth
};
baidu.page.getViewHeight = function () {
    var b = document,
	a = b.compatMode == "BackCompat" ? b.body : b.documentElement;
    return a.clientHeight
};
baidu.page.getScrollTop = function () {
    var a = document;
    return window.pageYOffset || a.documentElement.scrollTop || a.body.scrollTop
};
baidu.page.getScrollLeft = function () {
    var a = document;
    return window.pageXOffset || a.documentElement.scrollLeft || a.body.scrollLeft
}; (function () {
    var b = baidu.ui.behavior.posable = function () { };
    b.setPosition = function (g, e, d) {
        e = baidu.g(e) || this.getMain();
        d = d || {};
        var f = this,
		c = [e, g, d];
        f.__execPosFn(e, "_positionByCoordinate", d.once, c)
    };
    b._positionByCoordinate = function (c, r, s, e) {
        r = r || [0, 0];
        s = s || {};
        var o = this,
		p = {},
		m = baidu.page.getViewHeight(),
		q = baidu.page.getViewWidth(),
		j = baidu.page.getScrollLeft(),
		g = baidu.page.getScrollTop(),
		f = c.offsetWidth,
		h = c.offsetHeight,
		d = c.offsetParent,
		n = (!d || d == document.body) ? {
		    left: 0,
		    top: 0
		} : baidu.dom.getPosition(d);
        s.position = (typeof s.position !== "undefined") ? s.position.toLowerCase() : "bottomright";
        r = a(r || [0, 0]);
        s.offset = a(s.offset || [0, 0]);
        r.x += (s.position.indexOf("right") >= 0 ? (r.width || 0) : 0);
        r.y += (s.position.indexOf("bottom") >= 0 ? (r.height || 0) : 0);
        p.left = r.x + s.offset.x - n.left;
        p.top = r.y + s.offset.y - n.top;
        switch (s.insideScreen) {
            case "surround":
                p.left += p.left < j ? f + (r.width || 0) : ((p.left + f) > (j + q) ? -f - (r.width || 0) : 0);
                p.top += p.top < g ? h + (r.height || 0) : ((p.top + h) > (g + m) ? -h - (r.height || 0) : 0);
                break;
            case "fix":
                p.left = Math.max(0 - parseFloat(baidu.dom.getStyle(c, "marginLeft")) || 0, Math.min(p.left, baidu.page.getViewWidth() - f - n.left));
                p.top = Math.max(0 - parseFloat(baidu.dom.getStyle(c, "marginTop")) || 0, Math.min(p.top, baidu.page.getViewHeight() - h - n.top));
                break;
            case "verge":
                var l = {
                    width: (s.position.indexOf("right") > -1 ? r.width : 0),
                    height: (s.position.indexOf("bottom") > -1 ? r.height : 0)
                },
			k = {
			    width: (s.position.indexOf("bottom") > -1 ? r.width : 0),
			    height: (s.position.indexOf("right") > -1 ? r.height : 0)
			};
                p.left -= (s.position.indexOf("right") >= 0 ? (r.width || 0) : 0);
                p.top -= (s.position.indexOf("bottom") >= 0 ? (r.height || 0) : 0);
                p.left += p.left + l.width + f - j > q - n.left ? k.width - f : l.width;
                p.top += p.top + l.height + h - g > m - n.top ? k.height - h : l.height;
                break
        }
        baidu.dom.setPosition(c, p);
        if (!e && (m != baidu.page.getViewHeight() || q != baidu.page.getViewWidth())) {
            o._positionByCoordinate(c, r, {},
			true)
        }
        e || o.dispatchEvent("onpositionupdate")
    };
    b.__execPosFn = function (d, g, e, c) {
        var f = this;
        if (typeof e == "undefined" || !e) {
            baidu.event.on(baidu.dom.getWindow(d), "resize", baidu.fn.bind.apply(f, [g, f].concat([].slice.call(c))))
        }
        f[g].apply(f, c)
    };
    function a(c) {
        c.x = c[0] || c.x || c.left || 0;
        c.y = c[1] || c.y || c.top || 0;
        return c
    }
})();
baidu.ui.behavior.posable.setPositionByElement = function (c, b, a) {
    c = baidu.g(c);
    b = baidu.g(b) || this.getMain();
    a = a || {};
    this.__execPosFn(b, "_setPositionByElement", a.once, arguments)
};
baidu.ui.behavior.posable._setPositionByElement = function (d, b, a) {
    var c = baidu.dom.getPosition(d);
    a.once = false;
    a.insideScreen = a.insideScreen || "verge";
    c.width = d.offsetWidth;
    c.height = d.offsetHeight;
    this._positionByCoordinate(b, c, a, true)
};
baidu.string.format = function (c, a) {
    c = String(c);
    var b = Array.prototype.slice.call(arguments, 1),
	d = Object.prototype.toString;
    if (b.length) {
        b = b.length == 1 ? (a !== null && (/\[object Array\]|\[object Object\]/.test(d.call(a))) ? a : b) : b;
        return c.replace(/#\{(.+?)\}/g,
		function (e, g) {
		    var f = b[g];
		    if ("[object Function]" == d.call(f)) {
		        f = f(g)
		    }
		    return ("undefined" == typeof f ? "" : f)
		})
    }
    return c
};
baidu.format = baidu.string.format;
baidu.dom.insertHTML = function (d, a, c) {
    d = baidu.dom.g(d);
    var b,
	e;
    if (d.insertAdjacentHTML && !baidu.browser.opera) {
        d.insertAdjacentHTML(a, c)
    } else {
        b = d.ownerDocument.createRange();
        a = a.toUpperCase();
        if (a == "AFTERBEGIN" || a == "BEFOREEND") {
            b.selectNodeContents(d);
            b.collapse(a == "AFTERBEGIN")
        } else {
            e = a == "BEFOREBEGIN";
            b[e ? "setStartBefore" : "setEndAfter"](d);
            b.collapse(e)
        }
        b.insertNode(b.createContextualFragment(c))
    }
    return d
};
baidu.insertHTML = baidu.dom.insertHTML;
baidu.dom.show = function (a) {
    a = baidu.dom.g(a);
    a.style.display = "";
    return a
};
baidu.show = baidu.dom.show;
baidu.dom.hide = function (a) {
    a = baidu.dom.g(a);
    a.style.display = "none";
    return a
};
baidu.hide = baidu.dom.hide;
baidu.dom.remove = function (a) {
    a = baidu.dom._g(a);
    var b = a.parentNode;
    b && b.removeChild(a)
};
baidu.ui.ColorPicker = baidu.ui.createUI(function (a) {
    var b = this;
    b._initialized = false
}).extend({
    uiType: "colorpicker",
    colors: ("000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF").split(","),
    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplColor: '<a href="javascript:;" id="#{colorId}" style="#{colorStyle}" class="#{colorClass}" onclick="javascript:#{choose};return false;" #{stateHandler}></a>',
    gridSize: 8,
    position: "bottomCenter",
    statable: true,
    posable: true,
    getString: function () {
        var e = this,
		a = ["<table>"],
		d = 0,
		c = e.colors.length;
        while (d < c) {
            a.push("<tr>");
            for (var b = 0; b < e.gridSize; b++) {
                a.push("<td>", e._getColorString(e.colors[d]), "</td>");
                d++
            }
            a.push("</tr>")
        }
        a.push("</table>");
        return baidu.string.format(e.tplBody, {
            id: e.getId(),
            "class": e.getClass(),
            content: a.join("")
        })
    },
    _getColorString: function (a) {
        var b = this;
        return baidu.string.format(b.tplColor, {
            colorId: b.getId(a),
            colorStyle: "background-color:#" + a,
            colorClass: b.getClass("color"),
            choose: b.getCallString("_choose", a),
            stateHandler: b._getStateHandlerString("", a)
        })
    },
    render: function (b) {
        var a = this;
        b = baidu.g(b);
        if (a.getMain() || !b) {
            return
        }
        a.targetId = b.id || a.getId("target");
        a.renderMain();
        a.dispatchEvent("onload")
    },
    update: function (b) {
        var c = this,
		a = c.getMain(),
		d = c.getTarget();
        b = b || {};
        baidu.object.extend(c, b);
        a.innerHTML = c.getString();
        c.setPositionByElement(d, a, {
            position: c.position,
            once: true
        });
        c.dispatchEvent("onupdate")
    },
    _choose: function (a) {
        var b = this;
        b.close();
        b.dispatchEvent("onchosen", {
            color: "#" + a
        })
    },
    open: function () {
        var a = this;
//        if (!a._initialized) {
//            a.update();
//            a._initialized = true
//        }
		a.update();
        baidu.dom.show(a.getMain());
        baidu.ui.ColorPicker.showing = a;
        a.dispatchEvent("onopen")
    },
    close: function () {
        var a = this;
        baidu.dom.hide(a.getMain());
        a.dispatchEvent("onclose")
    },
    getTarget: function () {
        return baidu.g(this.targetId)
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("ondispose");
        if (a.getMain()) {
            baidu.dom.remove(a.getMain())
        }
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
window[baidu.guid]._instances = window[baidu.guid]._instances || {};
baidu.lang.instance = function (a) {
    return window[baidu.guid]._instances[a] || null
};
baidu.dom._NAME_ATTRS = (function () {
    var a = {
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        colspan: "colSpan",
        rowspan: "rowSpan",
        valign: "vAlign",
        usemap: "useMap",
        frameborder: "frameBorder"
    };
    if (baidu.browser.ie < 8) {
        a["for"] = "htmlFor";
        a["class"] = "className"
    } else {
        a.htmlFor = "for";
        a.className = "class"
    }
    return a
})();
baidu.dom.getAttr = function (b, a) {
    b = baidu.dom.g(b);
    if ("style" == a) {
        return b.style.cssText
    }
    a = baidu.dom._NAME_ATTRS[a] || a;
    return b.getAttribute(a)
};
baidu.getAttr = baidu.dom.getAttr;
baidu.ui.get = function (a) {
    var b;
    if (baidu.lang.isString(a)) {
        return baidu.lang.instance(a)
    } else {
        do {
            if (!a || a.nodeType == 9) {
                return null
            }
            if (b = baidu.dom.getAttr(a, "data-guid")) {
                return baidu.lang.instance(b)
            }
        }
        while ((a = a.parentNode) != document.body)
    }
};
baidu.dom.getAncestorBy = function (a, b) {
    a = baidu.dom.g(a);
    while ((a = a.parentNode) && a.nodeType == 1) {
        if (b(a)) {
            return a
        }
    }
    return null
};
baidu.ui.ColorPicker.extend({
    type: "click",
    bodyClick: function (d) {
        var b = this,
		c = baidu.event.getTarget(d || window.event),
		a = function (e) {
		    return e == b.getTarget()
		};
        if (!c || a(c) || baidu.dom.getAncestorBy(c, a) || baidu.ui.get(c) == b) {
            return
        }
        b.close()
    }
});
baidu.ui.ColorPicker.register(function (a) {
    if (a.type != "click") {
        return
    }
    a._targetOpenHandler = baidu.fn.bind("open", a);
    a._bodyClickHandler = baidu.fn.bind("bodyClick", a);
    a.addEventListener("onload",
	function () {
	    var b = a.getTarget();
	    if (b) {
	        baidu.on(b, "click", a._targetOpenHandler);
	        baidu.on(document, "click", a._bodyClickHandler)
	    }
	});
    a.addEventListener("ondispose",
	function () {
	    var b = a.getTarget();
	    if (b) {
	        baidu.un(b, "click", a._targetOpenHandler);
	        baidu.un(document, "click", a._bodyClickHandler)
	    }
	})
}); (function () {
    baidu.page.getMousePosition = function () {
        return {
            x: baidu.page.getScrollLeft() + a.x,
            y: baidu.page.getScrollTop() + a.y
        }
    };
    var a = {
        x: 0,
        y: 0
    };
    baidu.event.on(document, "onmousemove",
	function (b) {
	    b = window.event || b;
	    a.x = b.clientX;
	    a.y = b.clientY
	})
})();
baidu.dom.contains = function (a, b) {
    var c = baidu.dom._g;
    a = c(a);
    b = c(b);
    return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16)
};
baidu.event.preventDefault = function (a) {
    if (a.preventDefault) {
        a.preventDefault()
    } else {
        a.returnValue = false
    }
}; (function () {
    var q,
	h,
	d,
	c,
	l,
	b,
	p,
	o,
	s,
	e,
	a = baidu.lang.isFunction,
	j,
	n,
	f;
    baidu.dom.drag = function (u, t) {
        s = o = null;
        if (!(q = baidu.dom.g(u))) {
            return false
        }
        h = baidu.object.extend({
            autoStop: true,
            capture: true,
            interval: 16,
            handler: q
        },
		t);
        n = baidu.dom.getPosition(q.offsetParent);
        f = baidu.dom.getPosition(q);
        if (baidu.getStyle(q, "position") == "absolute") {
            l = f.top - (q.offsetParent == document.body ? 0 : n.top);
            b = f.left - (q.offsetParent == document.body ? 0 : n.left)
        } else {
            l = parseFloat(baidu.getStyle(q, "top")) || -parseFloat(baidu.getStyle(q, "bottom")) || 0;
            b = parseFloat(baidu.getStyle(q, "left")) || -parseFloat(baidu.getStyle(q, "right")) || 0
        }
        if (h.mouseEvent) {
            d = baidu.page.getScrollLeft() + h.mouseEvent.clientX;
            c = baidu.page.getScrollTop() + h.mouseEvent.clientY
        } else {
            var v = baidu.page.getMousePosition();
            d = v.x;
            c = v.y
        }
        h.autoStop && baidu.event.on(h.handler, "mouseup", m);
        h.autoStop && baidu.event.on(window, "mouseup", m);
        baidu.event.on(document, "selectstart", k);
        if (h.capture && h.handler.setCapture) {
            h.handler.setCapture()
        } else {
            if (h.capture && window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
            }
        }
        p = document.body.style.MozUserSelect;
        document.body.style.MozUserSelect = "none";
        if (a(h.ondragstart)) {
            h.ondragstart(q, h)
        }
        j = setInterval(r, h.interval);
        return {
            stop: m,
            update: g
        }
    };
    function g(t) {
        baidu.extend(h, t)
    }
    function m() {
        clearInterval(j);
        e = false;
        if (h.capture && h.handler.releaseCapture) {
            h.handler.releaseCapture()
        } else {
            if (h.capture && window.releaseEvents) {
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP)
            }
        }
        document.body.style.MozUserSelect = p;
        baidu.event.un(document, "selectstart", k);
        h.autoStop && baidu.event.un(h.handler, "mouseup", m);
        h.autoStop && baidu.event.un(window, "mouseup", m);
        if (a(h.ondragend)) {
            h.ondragend(q, h)
        }
    }
    function r(x) {
        var t = h.range,
		w = baidu.page.getMousePosition(),
		u = b + w.x - d,
		v = l + w.y - c;
        if (typeof t == "object" && t && t.length == 4) {
            u = Math.max(t[3], u);
            u = Math.min(t[1] - q.offsetWidth, u);
            v = Math.max(t[0], v);
            v = Math.min(t[2] - q.offsetHeight, v)
        }
        if (!e) {
            baidu.setStyle(q, "marginTop", 0);
            baidu.setStyle(q, "marginLeft", 0);
            e = true
        }
        q.style.top = v + "px";
        q.style.left = u + "px";
        if ((o !== u || s !== v) && (o !== null || s !== null)) {
            if (a(h.ondrag)) {
                h.ondrag(q, h)
            }
        }
        o = u;
        s = v
    }
    function k(t) {
        return baidu.event.preventDefault(t, false)
    }
})();
baidu.dom.draggable = function (b, k) {
    k = baidu.object.extend({
        toggle: function () {
            return true
        }
    },
	k || {});
    k.autoStop = true;
    b = baidu.dom.g(b);
    k.handler = k.handler || b;
    var a,
	h = ["ondragstart", "ondrag", "ondragend"],
	c = h.length - 1,
	d,
	j,
	f = {
	    dispose: function () {
	        j && j.stop();
	        baidu.event.un(k.handler, "onmousedown", g);
	        baidu.lang.Class.prototype.dispose.call(f)
	    }
	},
	e = this;
    if (a = baidu.dom.ddManager) {
        for (; c >= 0; c--) {
            d = h[c];
            k[d] = (function (l) {
                var m = k[l];
                return function () {
                    baidu.lang.isFunction(m) && m.apply(e, arguments);
                    a.dispatchEvent(l, {
                        DOM: b
                    })
                }
            })(d)
        }
    }
    if (b) {
        function g(m) {
            var l = k.mouseEvent = window.event || m;
            if (l.button > 1 || (baidu.lang.isFunction(k.toggle) && !k.toggle())) {
                return
            }
            if (baidu.dom.getStyle(b, "position") == "static") {
                baidu.dom.setStyle(b, "position", "relative")
            }
            if (baidu.lang.isFunction(k.onbeforedragstart)) {
                k.onbeforedragstart(b)
            }
            j = baidu.dom.drag(b, k);
            f.stop = j.stop;
            f.update = j.update;
            baidu.event.preventDefault(l)
        }
        baidu.event.on(k.handler, "onmousedown", g)
    }
    return {
        cancel: function () {
            f.dispose()
        }
    }
};
baidu.ui.Slider = baidu.ui.createUI(function (a) {
    var b = this;
    b.range = b.range || [b.min, b.max]
}).extend({
    layout: "horizontal",
    uiType: "slider",
    tplBody: '<div id="#{id}" class="#{class}" onmousedown="#{mousedown}" style="position:relative;">#{thumb}</div>',
    tplThumb: '<div id="#{thumbId}" class="#{thumbClass}" style="position:absolute;"></div>',
    value: 0,
    min: 0,
    max: 100,
    disabled: false,
    _dragOpt: {},
    _axis: {
        horizontal: {
            mousePos: "x",
            pos: "left",
            size: "width",
            clientSize: "clientWidth",
            offsetSize: "offsetWidth"
        },
        vertical: {
            mousePos: "y",
            pos: "top",
            size: "height",
            clientSize: "clientHeight",
            offsetSize: "offsetHeight"
        }
    },
    getString: function () {
        var a = this;
        return baidu.format(a.tplBody, {
            id: a.getId(),
            "class": a.getClass(),
            mousedown: a.getCallRef() + "._mouseDown(event)",
            thumb: baidu.format(a.tplThumb, {
                thumbId: a.getId("thumb"),
                thumbClass: a.getClass("thumb")
            })
        })
    },
    _mouseDown: function (h) {
        var f = this,
		d = f._axis[f.layout],
		a = baidu.page.getMousePosition(),
		c = baidu.dom.getPosition(f.getBody()),
		b = f.getThumb(),
		g = baidu.event.getTarget(h);
        if (g == b || baidu.dom.contains(b, g) || f.disabled) {
            return
        }
        f._calcValue(a[d.mousePos] - c[d.pos] - b[d.offsetSize] / 2);
        f.update();
        f.dispatchEvent("slideclick")
    },
    render: function (b) {
        var a = this;
        if (!b) {
            return
        }
        baidu.dom.insertHTML(a.renderMain(b), "beforeEnd", a.getString());
        a._createThumb();
        a.update();
        a.dispatchEvent("onload")
    },
    _createThumb: function () {
        var b = this,
		a;
        b._dragOpt = {
            ondragend: function () {
                b.dispatchEvent("slidestop")
            },
            ondragstart: function () {
                b.dispatchEvent("slidestart")
            },
            ondrag: function () {
                var d = b._axis[b.layout],
				c = b.getThumb().style[d.pos];
                b._calcValue(parseInt(c));
                b.dispatchEvent("slide")
            },
            range: [0, 0, 0, 0]
        };
        b._updateDragRange();
        a = baidu.dom.draggable(b.getThumb(), b._dragOpt);
        b.addEventListener("dispose",
		function () {
		    a.cancel()
		})
    },
    _updateDragRange: function (f) {
        var e = this,
		d = e._axis[e.layout],
		b = f || e.range,
		c = e._dragOpt.range,
		a = e.getThumb();
        b = [Math.max(Math.min(b[0], e.max), e.min), Math.max(Math.min(b[1], e.max), e.min)];
        if (e.layout.toLowerCase() == "horizontal") {
            c[1] = e._parseValue(b[1], "fix") + a[d.offsetSize];
            c[3] = e._parseValue(b[0], "fix");
            c[2] = a.clientHeight
        } else {
            c[0] = e._parseValue(b[0], "fix");
            c[2] = e._parseValue(b[1], "fix") + a[d.offsetSize];
            c[1] = a.clientWidth
        }
    },
    update: function (b) {
        var d = this,
		c = d._axis[d.layout],
		a = d.getBody();
        b = b || {};
        baidu.object.extend(d, b);
        d._updateDragRange();
        d._adjustValue();
        if (d.dispatchEvent("beforesliderto", {
            drop: b.drop
        })) {
            d.getThumb().style[c.pos] = d._parseValue(d.value, "pix") + "px";
            d.dispatchEvent("update")
        }
    },
    _adjustValue: function () {
        var b = this,
		a = b.range;
        b.value = Math.max(Math.min(b.value, a[1]), a[0])
    },
    _calcValue: function (b) {
        var a = this;
        a.value = a._parseValue(b, "value");
        a._adjustValue()
    },
    _parseValue: function (d, b) {
        var c = this,
		a = c._axis[c.layout];
        len = c.getBody()[a.clientSize] - c.getThumb()[a.offsetSize];
        if (b == "value") {
            d = (c.max - c.min) / len * d + c.min
        } else {
            d = Math.round(len / (c.max - c.min) * (d - c.min))
        }
        return d
    },
    getValue: function () {
        return this.value
    },
    getTarget: function () {
        return baidu.g(this.targetId)
    },
    getThumb: function () {
        return baidu.g(this.getId("thumb"))
    },
    disable: function () {
        var a = this;
        a.disabled = true;
        a._updateDragRange([a.value, a.value])
    },
    enable: function () {
        var a = this;
        a.disabled = false;
        a._updateDragRange(a.range)
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("dispose");
        baidu.dom.remove(a.getId());
        a.dispatchEvent("ondispose");
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.event.getPageX = function (b) {
    var a = b.pageX,
	c = document;
    if (!a && a !== 0) {
        a = (b.clientX || 0) + (c.documentElement.scrollLeft || c.body.scrollLeft)
    }
    return a
};
baidu.event.getPageY = function (b) {
    var a = b.pageY,
	c = document;
    if (!a && a !== 0) {
        a = (b.clientY || 0) + (c.documentElement.scrollTop || c.body.scrollTop)
    }
    return a
};
baidu.ui.ColorPalette = baidu.ui.createUI(function (a) {
    var b = this;
    b.hue = 360;
    b.saturation = 100;
    b.brightness = 100;
    b.sliderDotY = 0;
    b.padDotY = 0;
    b.padDotX = b.sliderLength
}).extend({
    uiType: "colorpalette",
    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplPad: '<div id="#{padId}" class="#{padClass}"><div id="#{coverId}" class="#{coverClass}"></div>#{padDot}</div>',
    tplSlider: '<div id="#{sliderId}" class="#{sliderClass}"></div>',
    tplPadDot: '<div id="#{padDotId}" class="#{padDotClass}" onmousedown="#{mousedown}"></div>',
    tplShow: '<div id="#{newColorId}" class="#{newColorClass}" onclick="#{showClick}"></div><div id="#{savedColorId}" class="#{savedColorClass}" onclick="#{savedColorClick}"></div><div id="#{hexId}" class="#{hexClass}"></div><div id="#{saveId}" class="#{saveClass}" onclick="#{saveClick}"></div>',
    sliderLength: 150,
    coverImgSrc: "",
    sliderImgSrc: "",
    getString: function () {
        var b = this,
		a = [];
        a.push(b._getPadString(), b._getSliderString(), b._getShowString());
        return baidu.string.format(b.tplBody, {
            id: b.getId(),
            "class": b.getClass(),
            content: a.join("")
        })
    },
    render: function (b) {
        var a = this;
        if (a.getMain()) {
            return
        }
        baidu.dom.insertHTML(a.renderMain(b), "beforeEnd", a.getString());
        a._createSlider();
        a._padClickHandler = baidu.fn.bind("_onPadClick", a);
        a.on(a.getPad(), "click", a._padClickHandler);
        a._setColorImgs();
        a.setSliderDot(a.sliderDotY);
        a.setPadDot(a.padDotY, a.padDotX);
        a._saveColor();
        a.dispatchEvent("onload")
    },
    _setColorImgs: function () {
        var b = this,
		c = b._getCover(),
		a = b.getSliderBody();
        if (baidu.browser.ie) {
            b._setFilterImg(c, b.coverImgSrc)
        } else {
            b._setBackgroundImg(c, b.coverImgSrc)
        }
        b._setBackgroundImg(a, b.sliderImgSrc)
    },
    _setBackgroundImg: function (a, b) {
        if (!b) {
            return
        }
        baidu.dom.setStyle(a, "background", "url(" + b + ")")
    },
    _setFilterImg: function (a, b) {
        if (!b) {
            return
        }
        baidu.dom.setStyle(a, "filter", 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")')
    },
    _getPadString: function () {
        var a = this;
        return baidu.string.format(a.tplPad, {
            padId: a.getId("pad"),
            padClass: a.getClass("pad"),
            coverId: a.getId("cover"),
            coverClass: a.getClass("cover"),
            padDot: a._getPadDotString()
        })
    },
    _getPadDotString: function () {
        var a = this;
        return baidu.string.format(a.tplPadDot, {
            padDotId: a.getId("padDot"),
            padDotClass: a.getClass("padDot"),
            mousedown: a.getCallString("_onPadDotMouseDown")
        })
    },
    _getSliderString: function () {
        var a = this;
        return baidu.string.format(a.tplSlider, {
            sliderId: a.getId("slider"),
            sliderClass: a.getClass("sliderMain")
        })
    },
    _createSlider: function () {
        var a = this,
		b = a._getSliderMain();
        a.slider = baidu.ui.create(baidu.ui.Slider, {
            autoRender: true,
            element: b,
            layout: "vertical",
            max: a.sliderLength,
            classPrefix: a.getClass("slider"),
            onslide: function () {
                a.setSliderDot(this.value)
            },
            onslideclick: function () {
                a.setSliderDot(this.value)
            }
        })
    },
    _getShowString: function () {
        var a = this;
        return baidu.string.format(a.tplShow, {
            newColorId: a.getId("newColor"),
            newColorClass: a.getClass("newColor"),
            savedColorId: a.getId("savedColor"),
            savedColorClass: a.getClass("savedColor"),
            savedColorClick: a.getCallString("_onSavedColorClick"),
            hexId: a.getId("hex"),
            hexClass: a.getClass("hex"),
            saveId: a.getId("save"),
            saveClass: a.getClass("save"),
            saveClick: a.getCallString("_saveColor")
        })
    },
    _onPadDotMouseDown: function () {
        var b = this,
		c = b.getPad(),
		a = baidu.dom.getPosition(c);
        b.padTop = a.top;
        b.padLeft = a.left;
        b._movePadDotHandler = baidu.fn.bind("_onPadDotMouseMove", b);
        b._upPadDotHandler = baidu.fn.bind("_onPadDotMouseUp", b);
        baidu.event.on(document, "mousemove", b._movePadDotHandler);
        baidu.event.on(document, "mouseup", b._upPadDotHandler)
    },
    _onPadDotMouseMove: function (d) {
        d = d || event;
        var c = this,
		b = baidu.event.getPageX(d),
		a = baidu.event.getPageY(d);
        c.padDotY = c._adjustValue(c.sliderLength, a - c.padTop);
        c.padDotX = c._adjustValue(c.sliderLength, b - c.padLeft);
        c.setPadDot(c.padDotY, c.padDotX)
    },
    _adjustValue: function (a, b) {
        return Math.max(0, Math.min(a, b))
    },
    _onPadDotMouseUp: function () {
        var a = this;
        if (!a._movePadDotHandler) {
            return
        }
        baidu.event.un(document, "mousemove", a._movePadDotHandler);
        baidu.event.un(document, "mouseup", a._upPadDotHandler)
    },
    _onPadClick: function (d) {
        var b = this,
		c = b.getPad(),
		a = baidu.dom.getPosition(c);
        b.padTop = a.top;
        b.padLeft = a.left;
        b._onPadDotMouseMove(d)
    },
    _onSavedColorClick: function () {
        var c = this,
		b = c.getSliderDot(),
		a = c.savedColorPosition;
        c.setSliderDot(a.sliderDotY);
        baidu.dom.setStyle(b, "top", a.sliderDotY);
        c.setPadDot(a.padDotY, a.padDotX)
    },
    _getSliderMain: function () {
        return baidu.dom.g(this.getId("slider"))
    },
    getSliderBody: function () {
        return this.slider.getBody()
    },
    getSliderDot: function () {
        return this.slider.getThumb()
    },
    getPad: function () {
        return baidu.dom.g(this.getId("pad"))
    },
    getPadDot: function () {
        return baidu.dom.g(this.getId("padDot"))
    },
    _getCover: function () {
        return baidu.dom.g(this.getId("cover"))
    },
    setSliderDot: function (b) {
        var a = this,
		c = a.getPad();
        a.sliderDotY = b;
        a.hue = parseInt(360 * (a.sliderLength - b) / a.sliderLength, 10);
        baidu.dom.setStyle(c, "background-color", "#" + a._HSBToHex({
            h: a.hue,
            s: 100,
            b: 100
        }));
        a._setNewColor()
    },
    setPadDot: function (d, c) {
        var b = this,
		a = b.getPadDot();
        b.saturation = parseInt(100 * c / 150, 10);
        b.brightness = parseInt(100 * (150 - d) / 150, 10);
        baidu.dom.setStyles(a, {
            top: d,
            left: c
        });
        b._setNewColor()
    },
    _setNewColor: function () {
        var b = this,
		c = baidu.dom.g(this.getId("newColor")),
		a = baidu.dom.g(this.getId("hex"));
        b.hex = "#" + b._HSBToHex({
            h: b.hue,
            s: b.saturation,
            b: b.brightness
        });
        baidu.dom.setStyle(c, "background-color", b.hex);
        a.innerHTML = b.hex
    },
    _saveColor: function () {
        var b = this,
		a = baidu.dom.g(this.getId("savedColor"));
        baidu.dom.setStyle(a, "background-color", b.hex);
        b.savedColorHex = b.hex;
        b.savedColorPosition = {
            sliderDotY: b.sliderDotY,
            padDotY: b.padDotY,
            padDotX: b.padDotX
        }
    },
    getColor: function () {
        return this.hex
    },
    _HSBToRGB: function (a) {
        var c = {},
		g = Math.round(a.h),
		f = Math.round(a.s * 255 / 100),
		b = Math.round(a.b * 255 / 100);
        if (f == 0) {
            c.r = c.g = c.b = b
        } else {
            var j = b,
			e = (255 - f) * b / 255,
			d = (j - e) * (g % 60) / 60;
            if (g == 360) {
                g = 0
            }
            if (g < 60) {
                c.r = j;
                c.b = e;
                c.g = e + d
            } else {
                if (g < 120) {
                    c.g = j;
                    c.b = e;
                    c.r = j - d
                } else {
                    if (g < 180) {
                        c.g = j;
                        c.r = e;
                        c.b = e + d
                    } else {
                        if (g < 240) {
                            c.b = j;
                            c.r = e;
                            c.g = j - d
                        } else {
                            if (g < 300) {
                                c.b = j;
                                c.g = e;
                                c.r = e + d
                            } else {
                                if (g < 360) {
                                    c.r = j;
                                    c.g = e;
                                    c.b = j - d
                                } else {
                                    c.r = 0;
                                    c.g = 0;
                                    c.b = 0
                                }
                            }
                        }
                    }
                }
            }
        }
        return {
            r: Math.round(c.r),
            g: Math.round(c.g),
            b: Math.round(c.b)
        }
    },
    _RGBToHex: function (a) {
        var b = [a.r.toString(16), a.g.toString(16), a.b.toString(16)];
        baidu.array.each(b,
		function (d, c) {
		    if (d.length == 1) {
		        b[c] = "0" + d
		    }
		});
        return b.join("")
    },
    _HSBToHex: function (a) {
        var b = this;
        return b._RGBToHex(b._HSBToRGB(a))
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("ondispose");
        a.slider.dispose();
        if (a.getMain()) {
            baidu.dom.remove(a.getMain())
        }
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Base.setParent = function (b) {
    var c = this,
	a = c._parent;
    a && a.dispatchEvent("removechild");
    if (b.dispatchEvent("appendchild", {
        child: c
    })) {
        c._parent = b
    }
};
baidu.ui.Base.getParent = function () {
    return this._parent || null
};
baidu.ui.Button = baidu.ui.createUI(new Function).extend({
    uiType: "button",
    tplBody: '<div id="#{id}" #{statable} class="#{class}">#{content}</div>',
    disabled: false,
    statable: true,
    _getString: function () {
        var a = this;
        return baidu.format(a.tplBody, {
            id: a.getId(),
            statable: a._getStateHandlerString(),
            "class": a.getClass(),
            content: a.content
        })
    },
    render: function (c) {
        var b = this,
		a;
        b.addState("click", "click",
		function (f, e) {
		    var d = this;
		    if (!d.getState(f, e)["disabled"]) {
		        return true
		    }
		});
        baidu.dom.insertHTML(b.renderMain(c), "beforeEnd", b._getString());
        a = baidu.g(c).lastChild;
        if (b.title) {
            a.title = b.title
        }
        b.disabled && b.setState("disabled");
        b.dispatchEvent("onload")
    },
    isDisabled: function () {
        var a = this,
		b = a.getId();
        return a.getState()["disabled"]
    },
    dispose: function () {
        var b = this,
		a = b.getBody();
        b.dispatchEvent("dispose");
        baidu.each(b._allEventsName,
		function (d, c) {
		    a["on" + d] = null
		});
        baidu.dom.remove(a);
        b.dispatchEvent("ondispose");
        baidu.lang.Class.prototype.dispose.call(b)
    },
    disable: function () {
        var b = this,
		a = b.getBody();
        b.dispatchEvent("ondisable", {
            element: a
        })
    },
    enable: function () {
        var a = this;
        body = a.getBody();
        a.dispatchEvent("onenable", {
            element: body
        })
    },
    fire: function (a, c) {
        var b = this,
		a = a.toLowerCase();
        if (b.getState()["disabled"]) {
            return
        }
        b._fireEvent(a, null, null, c)
    },
    update: function (a) {
        var b = this;
        baidu.extend(b, a);
        a.content && (b.getBody().innerHTML = a.content);
        b.dispatchEvent("onupdate")
    }
});
baidu.dom.children = function (b) {
    b = baidu.dom.g(b);
    for (var a = [], c = b.firstChild; c; c = c.nextSibling) {
        if (c.nodeType == 1) {
            a.push(c)
        }
    }
    return a
};
baidu.lang.isNumber = function (a) {
    return "[object Number]" == Object.prototype.toString.call(a) && isFinite(a)
};
baidu.dom.setBorderBoxSize = function (c, b) {
    var a = {};
    b.width && (a.width = parseFloat(b.width));
    b.height && (a.height = parseFloat(b.height));
    function d(f, e) {
        return parseFloat(baidu.getStyle(f, e)) || 0
    }
    if (baidu.browser.isStrict) {
        if (b.width) {
            a.width = parseFloat(b.width) - d(c, "paddingLeft") - d(c, "paddingRight") - d(c, "borderLeftWidth") - d(c, "borderRightWidth");
            a.width < 0 && (a.width = 0)
        }
        if (b.height) {
            a.height = parseFloat(b.height) - d(c, "paddingTop") - d(c, "paddingBottom") - d(c, "borderTopWidth") - d(c, "borderBottomWidth");
            a.height < 0 && (a.height = 0)
        }
    }
    return baidu.dom.setStyles(c, a)
};
baidu.dom.setOuterHeight = baidu.dom.setBorderBoxHeight = function (b, a) {
    return baidu.dom.setBorderBoxSize(b, {
        height: a
    })
};
baidu.dom.setOuterWidth = baidu.dom.setBorderBoxWidth = function (a, b) {
    return baidu.dom.setBorderBoxSize(a, {
        width: b
    })
};
baidu.ui.Dialog = baidu.ui.createUI(function (a) {
    var b = this;
    b._content = "initElement";
    b.content = b.content || null;
    b._contentText = "initText";
    b.contentText = b.contentText || "";
    b._titleText = "initText";
    b.titleText = b.titleText || ""
}).extend({
    uiType: "dialog",
    width: "",
    height: "",
    top: "auto",
    left: "auto",
    zIndex: 1000,
    tplDOM: "<div id='#{id}' class='#{class}' style='position:relative'>#{title}#{content}#{footer}</div>",
    tplTitle: "<div id='#{id}' class='#{class}'><span id='#{inner-id}' class='#{inner-class}'>#{content}</span></div>",
    tplContent: "<div id='#{id}' class='#{class}' style='overflow:hidden; position:relative'>#{content}</div>",
    tplFooter: "<div id='#{id}' class='#{class}'></div>",
    isShown: function () {
        return baidu.ui.Dialog.instances[this.guid] == "show"
    },
    getString: function () {
        var c = this,
		a,
		e = "title",
		d = "title-inner",
		b = "content",
		f = "footer";
        return baidu.format(c.tplDOM, {
            id: c.getId(),
            "class": c.getClass(),
            title: baidu.format(c.tplTitle, {
                id: c.getId(e),
                "class": c.getClass(e),
                "inner-id": c.getId(d),
                "inner-class": c.getClass(d),
                content: c.titleText || ""
            }),
            content: baidu.format(c.tplContent, {
                id: c.getId(b),
                "class": c.getClass(b),
                content: c.contentText || ""
            }),
            footer: baidu.format(c.tplFooter, {
                id: c.getId(f),
                "class": c.getClass(f)
            })
        })
    },
    render: function () {
        var b = this,
		a;
        if (b.getMain()) {
            return
        }
        a = b.renderMain();
        a.innerHTML = b.getString();
        b._update();
        b._updatePosition();
        baidu.dom.setStyles(b.getMain(), {
            position: "absolute",
            zIndex: b.zIndex,
            marginLeft: "-100000px"
        });
        b.windowResizeHandler = b.getWindowResizeHandler();
        b.on(window, "resize", b.windowResizeHandler);
        b.dispatchEvent("onload");
        return a
    },
    _update: function (b) {
        var d = this,
		c = d.getContent(),
		b = b || {},
		e = d.getTitleInner(),
		a = false;
        if (typeof b.titleText != "undefined") {
            e.innerHTML = b.titleText;
            d.titleText = d._titleText = b.titleText
        } else {
            if (d.titleText != d._titleText) {
                e.innerHTML = d.titleText;
                d._titleText = d.titleText
            }
        }
        if (typeof b.content != "undefined") {
            c.innerHTML = "";
            d.content = b.content;
            if (b.content !== null) {
                c.appendChild(b.content);
                d.content = d._content = c.firstChild;
                d.contentText = d._contentText = c.innerHTML;
                return
            }
            a = true
        } else {
            if (d.content !== d._content) {
                c.innerHTML = "";
                if (d.content !== null) {
                    c.appendChild(d.content);
                    d.content = d._content = c.firstChild;
                    d.contentText = d._contentText = c.innerHTML;
                    return
                }
                a = true
            }
        }
        if (typeof b.contentText != "undefined") {
            c.innerHTML = b.contentText;
            d.contentText = d._contentText = b.contentText;
            d.content = d._content = c.firstChild
        } else {
            if ((d.contentText != d._contentText) || a) {
                c.innerHTML = d.contentText;
                d._contentText = d.contentText;
                d.content = d._content = c.firstChild
            }
        }
        delete (b.content);
        delete (b.contentText);
        delete (b.titleText);
        baidu.extend(d, b)
    },
    getWindowResizeHandler: function () {
        var a = this;
        return function () {
            a._updatePosition()
        }
    },
    open: function () {
        var a = this;
        a._updatePosition();
        a.getMain().style.marginLeft = "auto";
        baidu.ui.Dialog.instances[a.guid] = "show";
        a.dispatchEvent("onopen")
    },
    close: function () {
        var a = this;
        if (a.dispatchEvent("onbeforeclose")) {
            a.getMain().style.marginLeft = "-100000px";
            baidu.ui.Dialog.instances[a.guid] = "hide";
            a.dispatchEvent("onclose")
        }
    },
    update: function (a) {
        var b = this;
        b._update(a);
        b._updatePosition();
        b.dispatchEvent("onupdate")
    },
    _getBodyOffset: function () {
        var f = this,
		b,
		c = f.getBody(),
		e = f.getContent(),
		h = f.getTitle(),
		j = f.getFooter();
        b = {
            width: 0,
            height: 0
        };
        function d(m, l) {
            var k = parseFloat(baidu.getStyle(m, l));
            k = isNaN(k) ? 0 : k;
            k = baidu.lang.isNumber(k) ? k : 0;
            return k
        }
        baidu.each(["marginLeft", "marginRight"],
		function (l, k) {
		    b.width += d(e, l)
		});
        b.height += h.offsetHeight + d(h, "marginTop");
        b.height += j.offsetHeight + d(j, "marginBottom");
        var a = d(e, "marginTop"),
		g = d(h, "marginBottom");
        b.height += a >= g ? a : g;
        a = d(j, "marginTop"),
		g = d(e, "marginBottom");
        b.height += a >= g ? a : g;
        return b
    },
    _updatePosition: function () {
        var g = this,
		d,
		h = "",
		j = "",
		a = "",
		c = "",
		f = g.getContent(),
		e = g.getBody(),
		b,
		k;
        b = parseFloat(g.width);
        k = parseFloat(g.height);
        d = g._getBodyOffset();
        baidu.lang.isNumber(b) && baidu.dom.setOuterWidth(f, b);
        baidu.lang.isNumber(k) && baidu.dom.setOuterHeight(f, k);
        d.width += f.offsetWidth;
        d.height += f.offsetHeight;
        g.width && baidu.setStyle(e, "width", d.width);
        g.height && baidu.setStyle(e, "height", d.height);
        if ((g.left && g.left != "auto") || (g.right && g.right != "auto")) {
            c = g.left || "";
            j = g.right || ""
        } else {
            c = Math.max((baidu.page.getViewWidth() - parseFloat(g.getMain().offsetWidth)) / 2 + baidu.page.getScrollLeft(), 0)
        }
        if ((g.top && g.top != "auto") || (g.bottom && g.bottom != "auto")) {
            h = g.top || "";
            a = g.bottom || ""
        } else {
            h = Math.max((baidu.page.getViewHeight() - parseFloat(g.getMain().offsetHeight)) / 2 + baidu.page.getScrollTop(), 0)
        }
        baidu.dom.setStyles(g.getMain(), {
            top: h,
            right: j,
            bottom: a,
            left: c
        })
    },
    getTitle: function () {
        return baidu.g(this.getId("title"))
    },
    getTitleInner: function () {
        return baidu.g(this.getId("title-inner"))
    },
    getContent: function () {
        return baidu.g(this.getId("content"))
    },
    getFooter: function () {
        return baidu.g(this.getId("footer"))
    },
    dispose: function () {
        var a = this;
        delete baidu.ui.Dialog.instances[a.guid];
        a.dispatchEvent("dispose");
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Dialog.instances = baidu.ui.Dialog.instances || {};
baidu.extend(baidu.ui.Dialog.prototype, {
    autoDispose: true
});
baidu.ui.Dialog.register(function (a) {
    if (a.autoDispose) {
        a.addEventListener("onload",
		function () {
		    if (typeof a.autoDispose == "undefined" || a.autoDispose) {
		        a.addEventListener("onclose",
				function () {
				    a.dispose()
				})
		    }
		})
    }
});
baidu.i18n = baidu.i18n || {};
baidu.i18n.string = baidu.i18n.string || {
    trim: function (c, a) {
        var b = baidu.i18n.cultures[a || baidu.i18n.currentLocale].whitespace;
        return String(c).replace(b, "")
    },
    translation: function (c, a) {
        var b = baidu.i18n.cultures[a || baidu.i18n.currentLocale].language;
        return b[c] || ""
    }
};
baidu.i18n.cultures = baidu.i18n.cultures || {};
baidu.i18n.cultures["zh-CN"] = baidu.object.extend(baidu.i18n.cultures["zh-CN"] || {},
{
    calendar: {
        dateFormat: "yyyy-MM-dd",
        titleNames: "#{yyyy}年&nbsp;#{MM}月",
        monthNames: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
        dayNames: {
            mon: "一",
            tue: "二",
            wed: "三",
            thu: "四",
            fri: "五",
            sat: "六",
            sun: "日"
        }
    },
    timeZone: 8,
    whitespace: new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g"),
    number: {
        group: ",",
        groupLength: 3,
        decimal: ".",
        positive: "",
        negative: "-",
        _format: function (b, a) {
            return baidu.i18n.number._format(b, {
                group: this.group,
                groupLength: this.groupLength,
                decimal: this.decimal,
                symbol: a ? this.negative : this.positive
            })
        }
    },
    currency: {
        symbol: "￥"
    },
    language: {
        ok: "确定",
        cancel: "取消",
        signin: "注册",
        signup: "登录"
    }
});
baidu.i18n.currentLocale = baidu.i18n.currentLocale || "zh-CN";
baidu.extend(baidu.ui.Dialog.prototype, {
    createButton: function (c, a) {
        var d = this;
        baidu.extend(c, {
            classPrefix: d.classPrefix + "-" + a,
            skin: d.skin ? d.skin + "-" + a : "",
            element: d.getFooter(),
            autoRender: true,
            parent: d
        });
        var b = new baidu.ui.Button(c);
        d.buttonInstances[a] = b
    },
    removeButton: function (a) {
        var c = this,
		b = c.buttonInstances[a];
        if (b) {
            b.dispose();
            delete (c.buttonInstances[a]);
            delete (c.buttons[a])
        }
    }
});
baidu.ui.Dialog.register(function (d) {
    d.buttonInstances = {};
    d.language = d.language || "zh-CN";
    var b,
	c,
	a = {},
	e = baidu.i18n.cultures[d.language].language;
    b = {
        content: e.ok,
        onclick: function () {
            var g = this,
			f = g.getParent();
            f.dispatchEvent("onaccept") && f.close()
        }
    };
    c = {
        content: e.cancel,
        onclick: function () {
            var g = this,
			f = g.getParent();
            f.dispatchEvent("oncancel") && f.close()
        }
    };
    d.addEventListener("onload",
	function () {
	    switch (d.type) {
	        case "alert":
	            d.submitOnEnter = d.submitOnEnter || true;
	            a = {
	                accept: b
	            };
	            break;
	        case "confirm":
	            d.submitOnEnter = d.submitOnEnter || true;
	            a = {
	                accept: b,
	                cancel: c
	            };
	            break;
	        default:
	    }
	    d.buttons = baidu.extend(a, d.buttons || {});
	    baidu.object.each(d.buttons,
		function (g, f) {
		    d.createButton(g, f)
		});
	    d.submitOnEnter && d.addEventListener("onenter",
		function (f) {
		    d.buttonInstances.accept.fire("click", f)
		})
	});
    d.addEventListener("ondispose",
	function () {
	    baidu.object.each(d.buttons,
		function (g, f) {
		    d.removeButton(f)
		})
	});
    d.addEventListener("onupdate",
	function () {
	    baidu.object.each(d.buttons,
		function (g, f) {
		    d.buttonInstances[f] ? d.buttonInstances[f].update(g) : d.createButton(g, f)
		})
	})
});
baidu.ui.ColorPicker.extend({
    sliderLength: 150,
    coverImgSrc: "",
    sliderImgSrc: "",
    titleText: "More Colors",
    dialogOption: {},
    more: true,
    _createColorPaletteDialog: function () {
        var a = this;
        a.colorPaletteDialog = new baidu.ui.Dialog(baidu.object.extend({
            titleText: a.titleText,
            height: 180,
            width: 360,
            modal: true,
            type: "confirm",
            onaccept: function () {
                a.dispatchEvent("onchosen", {
                    color: a.colorPalette.hex
                })
            },
            onclose: function () {
                a.colorPalette._onPadDotMouseUp()
            },
            draggable: true,
            autoDispose: false,
            autoOpen: false,
            autoRender: true
        },
		a.dialongOption || {}))
    },
    _createColorPalette: function () {
        var a = this;
        a.colorPalette = baidu.ui.create(baidu.ui.ColorPalette, {
            autoRender: true,
            sliderLength: a.sliderLength,
            coverImgSrc: a.coverImgSrc,
            sliderImgSrc: a.sliderImgSrc,
            element: a.colorPaletteDialog.getContent()
        })
    }
});
baidu.ui.ColorPicker.register(function (a) {
    if (!a.more) {
        return
    }
    a.addEventListener("onupdate",
	function () {
	    var c = [],
		b = a.getBody();
	    baidu.ui.create(baidu.ui.Button, {
	        content: a.titleText,
	        classPrefix: a.getClass("morecolorbutton"),
	        autoRender: true,
	        element: b,
	        onclick: function () {
	            a.colorPaletteDialog.open()
	        }
	    });
	    a._createColorPaletteDialog();
	    a._createColorPalette()
	})
});
baidu.array.indexOf = function (e, b, d) {
    var a = e.length,
	c = b;
    d = d | 0;
    if (d < 0) {
        d = Math.max(0, a + d)
    }
    for (; d < a; d++) {
        if (d in e && e[d] === b) {
            return d
        }
    }
    return -1
};
baidu.array.removeAt = function (b, a) {
    return b.splice(a, 1)[0]
};
baidu.ui.ItemSet = baidu.ui.createUI(function (a) {
    var b = this;
    b._headIds = [];
    b._bodyIds = []
}).extend({
    currentClass: "current",
    tplHead: "",
    tplBody: "",
    switchType: "click",
    defaultIndex: 0,
    _getHeadString: function (e, b) {
        var d = this,
		c = d._headIds,
		a = d.getId("head" + baidu.lang.guid()),
		b = c[b] ? b : c.length;
        c.splice(b, 0, a);
        return baidu.string.format(d.tplHead, {
            id: a,
            "class": d.getClass("head"),
            head: e.head
        })
    },
    _getBodyString: function (d, a) {
        var c = this,
		b = c._bodyIds,
		e = c.getId("body" + baidu.lang.guid()),
		a = b[a] ? a : b.length;
        b.splice(a, 0, e);
        return baidu.string.format(c.tplBody, {
            id: e,
            "class": c.getClass("body"),
            body: d.body,
            display: "none"
        })
    },
    _getSwitchHandler: function (a) {
        var b = this;
        if (b.dispatchEvent("onbeforeswitch", {
            element: a
        })) {
            b.switchByHead(a);
            b.dispatchEvent("onswitch")
        }
    },
    _addSwitchEvent: function (a) {
        var b = this;
        a["on" + b.switchType] = baidu.fn.bind("_getSwitchHandler", b, a)
    },
    render: function (b) {
        var a = this;
        baidu.dom.insertHTML(a.renderMain(b), "beforeEnd", a.getString());
        baidu.array.each(a._headIds,
		function (e, c) {
		    var d = baidu.dom.g(e);
		    a._addSwitchEvent(d);
		    if (c == a.defaultIndex) {
		        a.setCurrentHead(d);
		        baidu.dom.addClass(d, a.getClass(a.currentClass));
		        a.getBodyByHead(d).style.display = ""
		    }
		    d = null
		});
        a.dispatchEvent("onload")
    },
    getHeads: function () {
        var a = this,
		b = [];
        baidu.array.each(a._headIds,
		function (c) {
		    b.push(baidu.dom.g(c))
		});
        return b
    },
    getBodies: function () {
        var a = this,
		b = [];
        baidu.array.each(a._bodyIds,
		function (c) {
		    b.push(baidu.dom.g(c))
		});
        return b
    },
    getCurrentHead: function () {
        return this.currentHead
    },
    setCurrentHead: function (a) {
        this.currentHead = a
    },
    getBodyByHead: function (b) {
        var c = this,
		a = baidu.array.indexOf(c._headIds, b.id);
        return baidu.dom.g(c._bodyIds[a])
    },
    getBodyByIndex: function (a) {
        return baidu.dom.g(this._bodyIds[a])
    },
    addItem: function (c) {
        var b = this,
		a = b._headIds.length;
        b.insertItemHTML(c)
    },
    removeItem: function (b) {
        var d = this,
		c = baidu.dom.g(d._headIds[b]),
		a = baidu.dom.g(d._bodyIds[b]),
		e = d.getCurrentHead();
        e && e.id == c.id && d.setCurrentHead(null);
        baidu.dom.remove(c);
        baidu.dom.remove(a);
        baidu.array.removeAt(d._headIds, b);
        baidu.array.removeAt(d._bodyIds, b)
    },
    _switch: function (a) {
        var c = this,
		b = c.getCurrentHead();
        if (b) {
            c.getBodyByHead(b).style.display = "none";
            baidu.dom.removeClass(b, c.getClass(c.currentClass))
        }
        if (a) {
            c.setCurrentHead(a);
            c.getBodyByHead(a).style.display = "block";
            baidu.dom.addClass(a, c.getClass(c.currentClass))
        }
    },
    switchByHead: function (a) {
        var b = this;
        if (b.dispatchEvent("beforeswitchbyhead", {
            element: a
        })) {
            b._switch(a)
        }
    },
    switchByIndex: function (a) {
        this.switchByHead(this.getHeads()[a])
    },
    dispose: function () {
        this.dispatchEvent("ondispose")
    }
});
baidu.ui.Accordion = baidu.ui.createUI(function (a) {
    var b = this;
    b.items = b.items || []
},
{
    superClass: baidu.ui.ItemSet
}).extend({
    uiType: "accordion",
    target: document.body,
    tplDOM: "<div id='#{id}' class='#{class}'>#{items}</div>",
    tplHead: '<div id="#{id}" bodyId="#{bodyId}" class="#{class}" >#{head}</div>',
    tplBody: "<div id='#{id}' class='#{class}' style='display:#{display};'>#{body}</div>",
    getString: function () {
        var b = this,
		a = this.items,
		c = [];
        baidu.each(a,
		function (e, d) {
		    c.push(b._getHeadString(e) + b._getBodyString(e))
		});
        return baidu.format(this.tplDOM, {
            id: b.getId(),
            "class": b.getClass(),
            items: c.join("")
        })
    },
    insertItemHTML: function (c, a) {
        var b = this;
        ids = b._headIds,
		a = ids[a] ? a : ids.length,
		container = baidu.dom.g(ids[a]) || b.getBody(),
		pos = ids[a] ? "beforeBegin" : "beforeEnd";
        baidu.dom.insertHTML(container, pos, b._getHeadString(c, a));
        baidu.dom.insertHTML(container, pos, b._getBodyString(c, a));
        b._addSwitchEvent(baidu.dom.g(ids[a]))
    },
    collapse: function () {
        var a = this;
        if (a.dispatchEvent("beforecollapse")) {
            if (a.getCurrentHead()) {
                a._switch(null);
                a.setCurrentHead(null)
            }
        }
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("ondispose");
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.fx = baidu.fx || {};
baidu.fx.current = function (d) {
    if (!(d = baidu.dom.g(d))) {
        return null
    }
    var b,
	f,
	e = /\|([^\|]+)\|/g;
    do {
        if (f = d.getAttribute("baidu_current_effect")) {
            break
        }
    }
    while ((d = d.parentNode) && d.nodeType == 1);
    if (!f) {
        return null
    }
    if ((b = f.match(e))) {
        e = /\|([^\|]+)\|/;
        for (var c = 0; c < b.length; c++) {
            e.test(b[c]);
            b[c] = window[baidu.guid]._instances[RegExp["\x241"]]
        }
    }
    return b
};
baidu.lang.inherits = function (g, e, d) {
    var c,
	f,
	a = g.prototype,
	b = new Function();
    b.prototype = e.prototype;
    f = g.prototype = new b();
    for (c in a) {
        f[c] = a[c]
    }
    g.prototype.constructor = g;
    g.superClass = e.prototype;
    typeof d == "string" && (f.__type = d);
    g.extend = function (j) {
        for (var h in j) {
            f[h] = j[h]
        }
        return g
    };
    return g
};
baidu.inherits = baidu.lang.inherits;
baidu.fx.Timeline = function (a) {
    baidu.lang.Class.call(this);
    this.interval = 16;
    this.duration = 500;
    this.dynamic = true;
    baidu.object.extend(this, a)
};
baidu.lang.inherits(baidu.fx.Timeline, baidu.lang.Class, "baidu.fx.Timeline").extend({
    launch: function () {
        var a = this;
        a.dispatchEvent("onbeforestart");
        typeof a.initialize == "function" && a.initialize();
        a["\x06btime"] = new Date().getTime();
        a["\x06etime"] = a["\x06btime"] + (a.dynamic ? a.duration : 0);
        a["\x06pulsed"]();
        return a
    },
    "\x06pulsed": function () {
        var b = this;
        var a = new Date().getTime();
        b.percent = (a - b["\x06btime"]) / b.duration;
        b.dispatchEvent("onbeforeupdate");
        if (a >= b["\x06etime"]) {
            typeof b.render == "function" && b.render(b.transition(b.percent = 1));
            typeof b.finish == "function" && b.finish();
            b.dispatchEvent("onafterfinish");
            b.dispose();
            return
        }
        typeof b.render == "function" && b.render(b.transition(b.percent));
        b.dispatchEvent("onafterupdate");
        b["\x06timer"] = setTimeout(function () {
            b["\x06pulsed"]()
        },
		b.interval)
    },
    transition: function (a) {
        return a
    },
    cancel: function () {
        this["\x06timer"] && clearTimeout(this["\x06timer"]);
        this["\x06etime"] = this["\x06btime"];
        typeof this.restore == "function" && this.restore();
        this.dispatchEvent("oncancel");
        this.dispose()
    },
    end: function () {
        this["\x06timer"] && clearTimeout(this["\x06timer"]);
        this["\x06etime"] = this["\x06btime"];
        this["\x06pulsed"]()
    }
});
baidu.fx.create = function (d, b, c) {
    var e = new baidu.fx.Timeline(b);
    e.element = d;
    e.__type = c || e.__type;
    e["\x06original"] = {};
    var a = "baidu_current_effect";
    e.addEventListener("onbeforestart",
	function () {
	    var g = this,
		f;
	    g.attribName = "att_" + g.__type.replace(/\W/g, "_");
	    f = g.element.getAttribute(a);
	    g.element.setAttribute(a, (f || "") + "|" + g.guid + "|", 0);
	    if (!g.overlapping) {
	        (f = g.element.getAttribute(g.attribName)) && window[baidu.guid]._instances[f].cancel();
	        g.element.setAttribute(g.attribName, g.guid, 0)
	    }
	});
    e["\x06clean"] = function (h) {
        var g = this,
		f;
        if (h = g.element) {
            h.removeAttribute(g.attribName);
            f = h.getAttribute(a);
            f = f.replace("|" + g.guid + "|", "");
            if (!f) {
                h.removeAttribute(a)
            } else {
                h.setAttribute(a, f, 0)
            }
        }
    };
    e.addEventListener("oncancel",
	function () {
	    this["\x06clean"]();
	    this["\x06restore"]()
	});
    e.addEventListener("onafterfinish",
	function () {
	    this["\x06clean"]();
	    this.restoreAfterFinish && this["\x06restore"]()
	});
    e.protect = function (f) {
        this["\x06original"][f] = this.element.style[f]
    };
    e["\x06restore"] = function () {
        var j = this["\x06original"],
		h = this.element.style,
		f;
        for (var g in j) {
            f = j[g];
            if (typeof f == "undefined") {
                continue
            }
            h[g] = f;
            if (!f && h.removeAttribute) {
                h.removeAttribute(g)
            } else {
                if (!f && h.removeProperty) {
                    h.removeProperty(g)
                }
            }
        }
    };
    return e
};
baidu.fx.expand = function (c, b) {
    if (!(c = baidu.dom.g(c))) {
        return null
    }
    var h = c,
	f,
	a,
	g = {
	    vertical: {
	        value: "height",
	        offset: "offsetHeight",
	        stylesValue: ["paddingBottom", "paddingTop", "borderTopWidth", "borderBottomWidth"]
	    },
	    horizontal: {
	        value: "width",
	        offset: "offsetWidth",
	        stylesValue: ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"]
	    }
	};
    var d = baidu.fx.create(h, baidu.object.extend({
        orientation: "vertical",
        initialize: function () {
            a = g[this.orientation];
            baidu.dom.show(h);
            this.protect(a.value);
            this.protect("overflow");
            this.restoreAfterFinish = true;
            f = h[a.offset];
            function e(l, k) {
                var j = parseInt(baidu.getStyle(l, k));
                j = isNaN(j) ? 0 : j;
                j = baidu.lang.isNumber(j) ? j : 0;
                return j
            }
            baidu.each(a.stylesValue,
			function (j) {
			    f -= e(h, j)
			});
            h.style.overflow = "hidden";
            h.style[a.value] = "1px"
        },
        transition: function (e) {
            return Math.sqrt(e)
        },
        render: function (e) {
            h.style[a.value] = Math.floor(e * f) + "px"
        }
    },
	b || {}), "baidu.fx.expand_collapse");
    return d.launch()
};
baidu.fx.collapse = function (c, b) {
    if (!(c = baidu.dom.g(c))) {
        return null
    }
    var h = c,
	f,
	a,
	g = {
	    vertical: {
	        value: "height",
	        offset: "offsetHeight",
	        stylesValue: ["paddingBottom", "paddingTop", "borderTopWidth", "borderBottomWidth"]
	    },
	    horizontal: {
	        value: "width",
	        offset: "offsetWidth",
	        stylesValue: ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"]
	    }
	};
    var d = baidu.fx.create(h, baidu.object.extend({
        orientation: "vertical",
        initialize: function () {
            a = g[this.orientation];
            this.protect(a.value);
            this.protect("overflow");
            this.restoreAfterFinish = true;
            f = h[a.offset];
            h.style.overflow = "hidden"
        },
        transition: function (e) {
            return Math.pow(1 - e, 2)
        },
        render: function (e) {
            h.style[a.value] = Math.floor(e * f) + "px"
        },
        finish: function () {
            baidu.dom.hide(h)
        }
    },
	b || {}), "baidu.fx.expand_collapse");
    return d.launch()
};
baidu.ui.Accordion.register(function (a) {
    a.addEventListeners({
        beforeswitchbyhead: function (d) {
            var g = a.getCurrentHead(),
			e = g && a.getBodyByHead(g),
			h = a.getBodyByHead(d.element),
			c = g && g.id,
			f,
			b;
            if (!baidu.fx.current(a._fxElement) && c != d.element.id) {
                a._fxElement = h;
                baidu.fx.expand(h, baidu.object.extend({
                    onafterfinish: function () {
                        a._switch(d.element);
                        if (e) {
                            e.style.height = h.style.height;
                            e.style.overflow = "auto"
                        }
                    }
                },
				e ? {
				    onbeforestart: function () {
				        baidu.dom.removeClass(g, a.getClass(a.currentClass));
				        baidu.dom.addClass(d.element, a.getClass(a.currentClass));
				        e.style.overflow = "hidden";
				        e.style.height = parseInt(baidu.dom.getStyle(e, "height")) - 1 + "px"
				    },
				    onbeforeupdate: function () {
				        b = parseInt(baidu.dom.getStyle(h, "height"))
				    },
				    onafterupdate: function () {
				        e.style.height = parseInt(baidu.dom.getStyle(e, "height")) - parseInt(baidu.dom.getStyle(h, "height")) + b + "px"
				    }
				} : {}))
            }
            d.returnValue = false
        },
        beforecollapse: function (c) {
            c.returnValue = false;
            var d = a.getCurrentHead(),
			b = d && a.getBodyByHead(d);
            if (baidu.fx.current(a._fxElement) || !b) {
                return
            }
            baidu.fx.collapse(b, {
                onafterfinish: function () {
                    a.setCurrentHead(null)
                }
            })
        }
    })
});
baidu.ui.Button.register(function (a) {
    if (!a.capture) {
        return
    }
    a.addEventListener("load",
	function () {
	    var b = a.getBody(),
		c = baidu.fn.bind(function (e) {
		    var f = baidu.event.getTarget(e);
		    if (f != b && !baidu.dom.contains(b, f) && a.getState()["press"]) {
		        a.fire("mouseout", e)
		    }
		}),
		d = function (e) {
		    if (!a.getState()["press"]) {
		        a.fire("mouseout", e)
		    }
		};
	    b.onmouseout = null;
	    a.on(b, "mouseout", d);
	    a.on(document, "mouseup", c)
	})
});
baidu.lang.isBoolean = function (a) {
    return typeof a === "boolean"
};
baidu.ui.Button.register(function (a) {
    if (!a.poll) {
        return
    }
    baidu.lang.isBoolean(a.poll) && (a.poll = {});
    a.addEventListener("mousedown",
	function (b) {
	    var d = 0,
		c = a.poll.interval || 100,
		e = a.poll.time || 0; (function () {
		    if (a.getState()["press"]) {
		        d++ > e && a.onmousedown && a.onmousedown();
		        a.poll.timeOut = setTimeout(arguments.callee, c)
		    }
		})()
	});
    a.addEventListener("dispose",
	function () {
	    if (a.poll.timeOut) {
	        a.disable();
	        window.clearTimeout(a.poll.timeOut)
	    }
	})
});
baidu.date = baidu.date || {};
baidu.number = baidu.number || {};
baidu.number.pad = function (d, c) {
    var e = "",
	b = (d < 0),
	a = String(Math.abs(d));
    if (a.length < c) {
        e = (new Array(c - a.length + 1)).join("0")
    }
    return (b ? "-" : "") + e + a
};
baidu.date.format = function (a, f) {
    if ("string" != typeof f) {
        return a.toString()
    }
    function d(m, l) {
        f = f.replace(m, l)
    }
    var b = baidu.number.pad,
	g = a.getFullYear(),
	e = a.getMonth() + 1,
	k = a.getDate(),
	h = a.getHours(),
	c = a.getMinutes(),
	j = a.getSeconds();
    d(/yyyy/g, b(g, 4));
    d(/yy/g, b(parseInt(g.toString().slice(2), 10), 2));
    d(/MM/g, b(e, 2));
    d(/M/g, e);
    d(/dd/g, b(k, 2));
    d(/d/g, k);
    d(/HH/g, b(h, 2));
    d(/H/g, h);
    d(/hh/g, b(h % 12, 2));
    d(/h/g, h % 12);
    d(/mm/g, b(c, 2));
    d(/m/g, c);
    d(/ss/g, b(j, 2));
    d(/s/g, j);
    return f
};
baidu.array.some = function (e, d, b) {
    var c = 0,
	a = e.length;
    for (; c < a; c++) {
        if (c in e && d.call(b || e, e[c], c)) {
            return true
        }
    }
    return false
};
baidu.lang.isDate = function (a) {
    return {}.toString.call(a) === "[object Date]" && a.toString() !== "Invalid Date" && !isNaN(a)
};
baidu.i18n.date = baidu.i18n.date || {
    getDaysInMonth: function (a, b) {
        var c = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (b == 1 && baidu.i18n.date.isLeapYear(a)) {
            return 29
        }
        return c[b]
    },
    isLeapYear: function (a) {
        return !(a % 400) || (!(a % 4) && !!(a % 100))
    },
    toLocaleDate: function (b, a, c) {
        return this._basicDate(b, a, c || baidu.i18n.currentLocale)
    },
    _basicDate: function (f, c, h) {
        var a = baidu.i18n.cultures[h || baidu.i18n.currentLocale].timeZone,
		g = a * 60,
		b,
		d,
		e = f.getTime();
        if (c) {
            b = baidu.i18n.cultures[c].timeZone;
            d = b * 60
        } else {
            d = -1 * f.getTimezoneOffset();
            b = b / 60
        }
        return new Date(b != a ? (e + (g - d) * 60000) : e)
    }
};
baidu.ui.Calendar = baidu.ui.createUI(function (a) {
    var b = this;
    b.flipContent = baidu.object.extend({
        prev: "&lt;",
        next: "&gt;"
    },
	b.flipContent);
    b.addEventListener("mouseup",
	function (c) {
	    var f = c.element,
		d = b._dates[f],
		e = baidu.dom.g(b._currElementId);
	    e && baidu.dom.removeClass(e, b.getClass("date-current"));
	    b._currElementId = f;
	    b._initDate = d;
	    baidu.dom.addClass(baidu.dom.g(f), b.getClass("date-current"));
	    b.dispatchEvent("clickdate", {
	        date: d
	    })
	})
}).extend({
    uiType: "calendar",
    weekStart: "Sun",
    statable: true,
    language: "zh-CN",
    tplDOM: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplTable: '<table border="0" cellpadding="0" cellspacing="1" class="#{class}"><thead class="#{headClass}">#{head}</thead><tbody class="#{bodyClass}">#{body}</tbody></table>',
    tplDateCell: '<td id="#{id}" class="#{class}" #{handler}>#{content}</td>',
    tplTitle: '<div id="#{id}" class="#{class}"><div id="#{labelId}" class="#{labelClass}">#{text}</div><div id="#{prevId}" class="#{prevClass}"></div><div id="#{nextId}" class="#{nextClass}"></div></div>',
    _initialize: function () {
        var a = this;
        function b(d) {
            var c = [];
            baidu.array.each(d,
			function (e) {
			    c.push(baidu.lang.isDate(e) ? a._toLocalDate(e) : {
			        start: a._toLocalDate(e.start),
			        end: a._toLocalDate(e.end)
			    })
			});
            return c
        }
        a._highlightDates = b(a.highlightDates || []);
        a._disableDates = b(a.disableDates || []);
        a._initDate = a._toLocalDate(a.initDate || new Date());
        a._currDate = new Date(a._initDate.getTime());
        a.weekStart = a.weekStart.toLowerCase()
    },
    _getDateJson: function (b) {
        var f = this,
		a = baidu.lang.guid(),
		h = f._currDate,
		d = [],
		e;
        function g(k, j) {
            return k.getDate() == j.getDate() && Math.abs(k.getTime() - j.getTime()) < 24 * 60 * 60 * 1000
        }
        function c(l, j) {
            var k = j.getTime();
            return baidu.array.some(l,
			function (m) {
			    if (baidu.lang.isDate(m)) {
			        return g(m, j)
			    } else {
			        return g(m.start, j) || k > m.start.getTime() && k <= m.end.getTime()
			    }
			})
        }
        b.getMonth() != h.getMonth() && d.push(f.getClass("date-other"));
        c(f._highlightDates, b) && d.push(f.getClass("date-highlight"));
        if (g(f._initDate, b)) {
            d.push(f.getClass("date-current"));
            f._currElementId = f.getId(a)
        }
        g(f._toLocalDate(new Date()), b) && d.push(f.getClass("date-today"));
        e = c(f._disableDates, b) && (d = []);
        return {
            id: f.getId(a),
            "class": d.join("\x20"),
            handler: f._getStateHandlerString("", a),
            date: b,
            disabled: e
        }
    },
    _getMonthCount: function (c, e) {
        var a = baidu.i18n.date.getDaysInMonth,
		b = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		d;
        a && (d = a(c, e));
        if (!baidu.lang.isNumber(d)) {
            d = 1 == e && (c % 4) && (c % 100 != 0 || c % 400 == 0) ? 29 : b[e]
        }
        return d
    },
    _getDateTableString: function () {
        var o = this,
		f = baidu.i18n.cultures[o.language].calendar,
		a = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
		s = o._currDate,
		p = s.getFullYear(),
		n = s.getMonth(),
		q = new Date(p, n, 1).getDay(),
		g = 0,
		e = [],
		m = [],
		h = [],
		r = o._disabledIds = [],
		d = 0,
		c = 0,
		l = a.length,
		k,
		b;
        for (; d < l; d++) {
            a[d] == o.weekStart && (g = d); (g > 0 ? e : h).push("<td>", f.dayNames[a[d]], "</td>")
        }
        e = e.concat(h);
        e.unshift("<tr>");
        e.push("</tr>");
        q = (q < g ? q + 7 : q) - g;
        k = Math.ceil((o._getMonthCount(p, n) + q) / l);
        o._dates = {};
        for (d = 0; d < k; d++) {
            m.push("<tr>");
            for (c = 0; c < l; c++) {
                b = o._getDateJson(new Date(p, n, d * l + c + 1 - q));
                o._dates[b.id] = b.date;
                b.disabled && r.push(b.id);
                m.push(baidu.string.format(o.tplDateCell, {
                    id: b.id,
                    "class": b["class"],
                    handler: b.handler,
                    content: b.date.getDate()
                }))
            }
            m.push("</tr>")
        }
        return baidu.string.format(o.tplTable, {
            "class": o.getClass("table"),
            headClass: o.getClass("week"),
            bodyClass: o.getClass("date"),
            head: e.join(""),
            body: m.join("")
        })
    },
    getString: function () {
        var a = this;
        return baidu.string.format(a.tplDOM, {
            id: a.getId(),
            "class": a.getClass(),
            content: baidu.string.format(a.tplDOM, {
                id: a.getId("content"),
                "class": a.getClass("content")
            })
        })
    },
    _toLocalDate: function (a) {
        return a ? baidu.i18n.date.toLocaleDate(a, null, this.language) : a
    },
    _renderDate: function () {
        var a = this;
        baidu.dom.g(a.getId("content")).innerHTML = a._getDateTableString();
        baidu.array.each(a._disabledIds,
		function (b) {
		    a.setState("disabled", b)
		})
    },
    _basicFlipMonth: function (e) {
        var b = this,
		d = b._currDate,
		c = d.getMonth() + (e == "prev" ? -1 : 1),
		a = d.getFullYear() + (c < 0 ? -1 : (c > 11 ? 1 : 0));
        c = c < 0 ? 12 : (c > 11 ? 0 : c);
        d.setYear(a);
        b.gotoMonth(c);
        b.dispatchEvent(e + "month", {
            date: new Date(d.getTime())
        })
    },
    renderTitle: function () {
        var e = this,
		d,
		c,
		h = e._currDate,
		g = baidu.i18n.cultures[e.language].calendar,
		f = baidu.dom.g(e.getId("label")),
		a = baidu.string.format(g.titleNames, {
		    yyyy: h.getFullYear(),
		    MM: g.monthNames[h.getMonth()],
		    dd: h.getDate()
		});
        if (f) {
            f.innerHTML = a;
            return
        }
        baidu.dom.insertHTML(e.getBody(), "afterBegin", baidu.string.format(e.tplTitle, {
            id: e.getId("title"),
            "class": e.getClass("title"),
            labelId: e.getId("label"),
            labelClass: e.getClass("label"),
            text: a,
            prevId: e.getId("prev"),
            prevClass: e.getClass("prev"),
            nextId: e.getId("next"),
            nextClass: e.getClass("next")
        }));
        function b(j) {
            return {
                classPrefix: e.classPrefix + "-" + j + "btn",
                skin: e.skin ? e.skin + "-" + j : "",
                content: e.flipContent[j],
                poll: {
                    time: 4
                },
                element: e.getId(j),
                autoRender: true,
                onmousedown: function () {
                    e._basicFlipMonth(j)
                }
            }
        }
        d = new baidu.ui.Button(b("prev"));
        c = new baidu.ui.Button(b("next"));
        e.addEventListener("ondispose",
		function () {
		    d.dispose();
		    c.dispose()
		})
    },
    render: function (c) {
        var a = this,
		b = a.skin;
        if (!c || a.getMain()) {
            return
        }
        baidu.dom.insertHTML(a.renderMain(c), "beforeEnd", a.getString());
        a._initialize();
        a.renderTitle();
        a._renderDate();
        baidu.dom.g(a.getId("content")).style.height = (a.getBody().clientHeight || a.getBody().offsetHeight) - baidu.dom.g(a.getId("title")).offsetHeight + "px";
        a.dispatchEvent("onload")
    },
    update: function (a) {
        var b = this;
        baidu.object.extend(b, a || {});
        b._initialize();
        b.renderTitle();
        b._renderDate();
        b.dispatchEvent("onupdate")
    },
    gotoDate: function (a) {
        var b = this;
        b._currDate = b._toLocalDate(a);
        b._initDate = b._toLocalDate(a);
        b.renderTitle();
        b._renderDate();
        b.dispatchEvent("ongotodate")
    },
    gotoYear: function (b) {
        var d = this,
		f = d._currDate,
		e = f.getMonth(),
		a = f.getDate(),
		c;
        if (1 == e) {
            c = d._getMonthCount(b, e);
            a > c && f.setDate(c)
        }
        f.setFullYear(b);
        d.renderTitle();
        d._renderDate();
        d.dispatchEvent("ongotoyear")
    },
    gotoMonth: function (e) {
        var c = this,
		d = c._currDate,
		e = Math.min(Math.max(e, 0), 11),
		a = d.getDate(),
		b = c._getMonthCount(d.getFullYear(), e);
        a > b && d.setDate(b);
        d.setMonth(e);
        c.renderTitle();
        c._renderDate();
        c.dispatchEvent("ongotomonth")
    },
    getToday: function () {
        return this._toLocalDate(new Date())
    },
    getDate: function () {
        return new Date(this._initDate.getTime())
    },
    setDate: function (a) {
        if (baidu.lang.isDate(a)) {
            var b = this;
            b._initDate = a;
            b._currDate = a
        }
    },
    prevMonth: function () {
        this._basicFlipMonth("prev")
    },
    nextMonth: function () {
        this._basicFlipMonth("next")
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("dispose");
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.array.find = function (e, c) {
    var d,
	b,
	a = e.length;
    if ("function" == typeof c) {
        for (b = 0; b < a; b++) {
            d = e[b];
            if (true === c.call(e, d, b)) {
                return d
            }
        }
    }
    return null
};
baidu.dom.setAttr = function (b, a, c) {
    b = baidu.dom.g(b);
    if ("style" == a) {
        b.style.cssText = c
    } else {
        a = baidu.dom._NAME_ATTRS[a] || a;
        b.setAttribute(a, c)
    }
    return b
};
baidu.setAttr = baidu.dom.setAttr;
baidu.dom.setAttrs = function (c, a) {
    c = baidu.dom.g(c);
    for (var b in a) {
        baidu.dom.setAttr(c, b, a[b])
    }
    return c
};
baidu.setAttrs = baidu.dom.setAttrs;
baidu.dom.create = function (c, a) {
    var d = document.createElement(c),
	b = a || {};
    return baidu.dom.setAttrs(d, b)
};
baidu.lang.Class.prototype.un = baidu.lang.Class.prototype.removeEventListener = function (d, c) {
    var b,
	a = this.__listeners;
    if (!a) {
        return
    }
    if (typeof d == "undefined") {
        for (b in a) {
            delete a[b]
        }
        return
    }
    d.indexOf("on") && (d = "on" + d);
    if (typeof c == "undefined") {
        delete a[d]
    } else {
        if (a[d]) {
            typeof c == "string" && (c = a[d][c]) && delete a[d][c];
            for (b = a[d].length - 1; b >= 0; b--) {
                if (a[d][b] === c) {
                    a[d].splice(b, 1)
                }
            }
        }
    }
};
baidu.ui.Carousel = baidu.ui.createUI(function (a) {
    var b = this,
	c = b.contentText || [];
    b._dataList = c.slice(0, c.length);
    b._itemIds = [];
    b._items = {};
    b.flip = b.flip.toLowerCase();
    b.orientation = b.orientation.toLowerCase()
}).extend({
    uiType: "carousel",
    orientation: "horizontal",
    flip: "item",
    pageSize: 3,
    scrollIndex: 0,
    _axis: {
        horizontal: {
            vector: "_boundX",
            pos: "left",
            size: "width",
            offset: "offsetWidth",
            client: "clientWidth",
            scrollPos: "scrollLeft"
        },
        vertical: {
            vector: "_boundY",
            pos: "top",
            size: "height",
            offset: "offsetHeight",
            client: "clientHeight",
            scrollPos: "scrollTop"
        }
    },
    getString: function () {
        var b = this,
		a = '<div id="#{id}" class="#{class}">#{content}</div>',
		c = baidu.string.format(a, {
		    id: b.getId("scroll"),
		    "class": b.getClass("scroll")
		});
        return baidu.string.format(a, {
            id: b.getId(),
            "class": b.getClass(),
            content: c
        })
    },
    render: function (b) {
        var a = this;
        if (!b || a.getMain()) {
            return
        }
        baidu.array.each(a._dataList,
		function (c) {
		    a._itemIds.push(baidu.lang.guid())
		});
        baidu.dom.insertHTML(a.renderMain(b), "beforeEnd", a.getString());
        a._renderItems();
        a._resizeView();
        a._moveToMiddle();
        a.focus(a.scrollIndex);
        a.addEventListener("onbeforeendscroll",
		function (d) {
		    var c = a.orientation == "horizontal",
			e = a._axis[a.orientation],
			f = a.getScrollContainer();
		    a._renderItems(d.index, d.scrollOffset);
		    f.style[e.size] = parseInt(f.style[e.size]) - a["_bound" + (c ? "X" : "Y")].offset * d.scrollUnit + "px";
		    a._moveToMiddle();
		    a._scrolling = false
		});
        a.dispatchEvent("onload")
    },
    _renderItems: function (a, g) {
        var e = this,
		f = e.getScrollContainer(),
		a = Math.min(Math.max(a | 0, 0), e._dataList.length - 1),
		g = Math.min(Math.max(g | 0, 0), e.pageSize - 1),
		d = e.pageSize,
		b = 0,
		c;
        while (f.firstChild) {
            baidu.dom.remove(f.firstChild)
        }
        for (; b < d; b++) {
            c = e._getItemElement(a - g + b);
            f.appendChild(c.element);
            c.setContent()
        }
    },
    _moveToMiddle: function () {
        if (!this._boundX) {
            return
        }
        var b = this,
		a = b._axis[b.orientation];
        b.getBody()[a.scrollPos] = b.orientation == "horizontal" && baidu.browser.ie == 6 ? b._boundX.marginX : 0
    },
    _resizeView: function () {
        if (this._dataList.length <= 0) {
            return
        }
        var e = this,
		d = e._axis[e.orientation],
		b = e.orientation == "horizontal",
		f = e.getScrollContainer(),
		h = baidu.dom.children(f),
		a,
		g;
        function c(n, m) {
            var m = m == "x",
			l = n[m ? "offsetWidth" : "offsetHeight"],
			k = parseInt(baidu.dom.getStyle(n, m ? "marginLeft" : "marginTop")),
			j = parseInt(baidu.dom.getStyle(n, m ? "marginRight" : "marginBottom"));
            isNaN(k) && (k = 0);
            isNaN(j) && (j = 0);
            return {
                offset: l + (b ? k + j : Math.max(k, j)),
                marginX: k,
                marginY: j
            }
        }
        e._boundX = a = c(h[0], "x");
        e._boundY = g = c(h[0], "y");
        f.style.width = a.offset * (b ? h.length : 1) + (baidu.browser.ie == 6 ? a.marginX : 0) + "px";
        f.style.height = g.offset * (b ? 1 : h.length) + (b ? 0 : g.marginX) + "px";
        e.getBody().style[d.size] = e[d.vector].offset * e.pageSize + (b ? 0 : Math.min(e[d.vector].marginX, e[d.vector].marginY)) + "px"
    },
    _baseItemElement: function (b) {
        var e = this,
		f = e._itemIds[b],
		d = e._items[f] || {},
		a = e._dataList[b],
		c;
        if (!d.element) {
            d.element = c = baidu.dom.create("div", {
                id: f || "",
                "class": e.getClass("item")
            }); !f && baidu.dom.addClass(c, e.getClass("item-empty"));
            d.content = a ? a.content : "";
            if (f) {
                d.handler = [{
                    evtName: "click",
                    handler: baidu.fn.bind("_onItemClickHandler", e, c)
                },
				{
				    evtName: "mouseover",
				    handler: baidu.fn.bind("_onMouseHandler", e, "mouseover")
				},
				{
				    evtName: "mouseout",
				    handler: baidu.fn.bind("_onMouseHandler", e, "mouseout")
				}];
                baidu.array.each(d.handler,
				function (g) {
				    e.on(c, g.evtName, g.handler)
				});
                e._items[f] = d
            }
            d.setContent = function () {
                this.content && (this.element.innerHTML = this.content);
                this.content && (delete this.content)
            }
        }
        return d
    },
    _getItemElement: function (a) {
        return this._baseItemElement(a)
    },
    _onItemClickHandler: function (c, a) {
        var b = this;
        b.focus(baidu.array.indexOf(b._itemIds, c.id));
        b.dispatchEvent("onitemclick")
    },
    _onMouseHandler: function (b, a) {
        this.dispatchEvent("on" + b)
    },
    getCurrentIndex: function () {
        return this.scrollIndex
    },
    getTotalCount: function () {
        return this._dataList.length
    },
    getItem: function (a) {
        return baidu.dom.g(this._itemIds[a])
    },
    scrollTo: function (j, f, n) {
        var m = this,
		d = m._axis[m.orientation],
		f = Math.min(Math.max(f | 0, 0), m.pageSize - 1),
		l = m.getScrollContainer(),
		b = baidu.dom.children(l),
		r = m.getItem(j),
		q = n,
		a = baidu.array.indexOf(b, r) - f,
		h = Math.abs(a),
		g = m._dataList.length,
		e = 0,
		k,
		p,
		c,
		o;
        if ((r && a == 0) || m._dataList.length <= 0 || j < 0 || j > m._dataList.length - 1 || m._scrolling) {
            return
        }
        if (!q) {
            q = r ? (a < 0 ? "prev" : (a > 0 ? "next" : "keep")) : baidu.array.indexOf(m._itemIds, baidu.array.find(b,
			function (s) {
			    return !!s.id
			}).id) > j ? "prev" : "next"
        }
        c = q == "prev";
        if (!r) {
            p = baidu.array.indexOf(m._itemIds, b[c ? 0 : b.length - 1].id);
            h = Math.abs(f - (c ? 0 : m.pageSize - 1)) + ((c ? p : j) + g - (c ? j : p)) % g;
            h > m.pageSize && (h = m.pageSize)
        }
        k = h > 0 && document.createDocumentFragment();
        for (; e < h; e++) {
            o = m._getItemElement(c ? j - f + e : m.pageSize + j + e - (r && !n ? baidu.array.indexOf(b, r) : f + h));
            k.appendChild(o.element);
            o.setContent()
        }
        c ? l.insertBefore(k, b[0]) : l.appendChild(k);
        a = m[d.vector].offset * h;
        l.style[d.size] = parseInt(l.style[d.size]) + a + "px";
        c && (m.getBody()[d.scrollPos] += a);
        m._scrolling = true;
        if (m.dispatchEvent("onbeforescroll", {
            index: j,
            scrollOffset: f,
            direction: q,
            scrollUnit: h
        })) {
            m.getBody()[d.scrollPos] += h * m[d.vector].offset * (c ? -1 : 1);
            m.dispatchEvent("onbeforeendscroll", {
                index: j,
                scrollOffset: f,
                direction: q,
                scrollUnit: h
            });
            m.dispatchEvent("onafterscroll", {
                index: j,
                scrollOffset: f,
                direction: q,
                scrollUnit: h
            })
        }
    },
    _getFlipIndex: function (c) {
        var d = this,
		a = d.flip == "item",
		c = c == "prev",
		f = d.scrollIndex,
		b = f + (a ? 1 : d.pageSize) * (c ? -1 : 1),
		e = a ? (c ? 0 : d.pageSize - 1) : baidu.array.indexOf(baidu.dom.children(d.getScrollContainer()), d.getItem(f));
        if (!a && (b < 0 || b > d._dataList.length - 1)) {
            b = f - e + (c ? -1 : d.pageSize);
            e = c ? d.pageSize - 1 : 0
        }
        return {
            index: b,
            scrollOffset: e
        }
    },
    _baseSlide: function (b) {
        if (!this.getItem(this.scrollIndex)) {
            return
        }
        var c = this,
		e = c.getScrollContainer(),
		d = c._getFlipIndex(b);
        if (d.index < 0 || d.index > c._dataList.length - 1) {
            return
        }
        function a(f, h, g) {
            c.addEventListener("onbeforeendscroll",
			function (j) {
			    var k = j.target;
			    k.focus(j.index);
			    k.removeEventListener("onbeforeendscroll", arguments.callee)
			});
            c.scrollTo(f, h, g)
        }
        if (c.flip == "item") {
            c.getItem(d.index) ? c.focus(d.index) : a(d.index, d.scrollOffset, b)
        } else {
            c._itemIds[d.index] && a(d.index, d.scrollOffset, b)
        }
    },
    prev: function () {
        var a = this;
        a._baseSlide("prev");
        a.dispatchEvent("onprev")
    },
    next: function () {
        var a = this;
        a._baseSlide("next");
        a.dispatchEvent("onnext")
    },
    isFirst: function () {
        var a = this._getFlipIndex("prev");
        return a.index < 0
    },
    isLast: function () {
        var a = this._getFlipIndex("next");
        return a.index >= this._dataList.length
    },
    _blur: function () {
        var a = this,
		b = a._itemIds[a.scrollIndex];
        if (b) {
            baidu.dom.removeClass(a._baseItemElement(a.scrollIndex).element, a.getClass("item-focus"));
            a.scrollIndex = -1
        }
    },
    focus: function (a) {
        var c = this,
		d = c._itemIds[a],
		b = d && c._baseItemElement(a);
        if (d) {
            c._blur();
            baidu.dom.addClass(b.element, c.getClass("item-focus"));
            c.scrollIndex = a;
            c.dispatchEvent("onfocus", {
                index: a
            })
        }
    },
    getScrollContainer: function () {
        return baidu.dom.g(this.getId("scroll"))
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("ondispose");
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Carousel.register(function (a) {
    if (!a.isCycle) {
        return
    }
    a._itemsPool = {};
    a._getItemElement = function (b) {
        var e = this,
		d = e._dataList.length,
		b = (b + d) % d,
		f = e._itemIds[b],
		c = baidu.dom.g(f) ? e._itemsPool[f + "-buff"] : e._baseItemElement(b);
        if (!c) {
            c = e._itemsPool[f + "-buff"] = {
                element: baidu.dom.create("div", {
                    id: f + "-buff",
                    "class": e.getClass("item")
                }),
                content: e._dataList[b].content,
                setContent: function () {
                    this.content && (this.element.innerHTML = this.content);
                    this.content && (delete this.content)
                }
            }
        }
        return c
    };
    a._getFlipIndex = function (c) {
        var f = this,
		e = f.flip == "item",
		c = c == "prev",
		h = f.scrollIndex,
		b = h + (e ? 1 : f.pageSize) * (c ? -1 : 1),
		g = e ? (c ? 0 : f.pageSize - 1) : baidu.array.indexOf(baidu.dom.children(f.getScrollContainer()), f.getItem(h)),
		d = f._dataList.length;
        return {
            index: (b + d) % d,
            scrollOffset: g
        }
    };
    a.addEventListener("onremoveitem",
	function (b) {
	    delete this._itemsPool[b.id + "-buff"]
	})
});
baidu.ui.Carousel.prototype.isCycle = true;
baidu.ui.Carousel.register(function (b) {
    if (!b.isAutoScroll) {
        return
    }
    var a = b._getAutoScrollDirection();
    b.addEventListeners("onprev,onnext",
	function () {
	    clearTimeout(b._autoScrollTimeout);
	    b._autoScrollTimeout = setTimeout(function () {
	        if (b._autoScrolling) {
	            b[a]();
	            b.dispatchEvent("onautoscroll", {
	                direction: a
	            })
	        }
	    },
		b.scrollInterval)
	});
    b.addEventListener("onload",
	function (c) {
	    var d = c.target;
	    setTimeout(function () {
	        d.startAutoScroll()
	    },
		d.scrollInterval)
	});
    b.addEventListener("ondispose",
	function (c) {
	    clearTimeout(c.target._autoScrollTimeout)
	})
});
baidu.ui.Carousel.extend({
    isAutoScroll: true,
    scrollInterval: 1000,
    direction: "right",
    _autoScrolling: true,
    _getAutoScrollDirection: function () {
        var b = this,
		a = {
		    up: "prev",
		    right: "next",
		    down: "next",
		    left: "prev"
		};
        return a[b.direction.toLowerCase()] || a[b.orientation == "horizontal" ? "right" : "down"]
    },
    startAutoScroll: function () {
        var a = this,
		b = a._getAutoScrollDirection();
        a._autoScrolling = true;
        a[b]();
        a.dispatchEvent("onautoscroll", {
            direction: b
        })
    },
    stopAutoScroll: function () {
        var a = this;
        clearTimeout(a._autoScrollTimeout);
        a._autoScrolling = false
    }
});
baidu.ui.Carousel.register(function (a) {
    if (!a.showButton) {
        return
    }
    a.btnLabel = baidu.object.extend({
        prev: "&lt;",
        next: "&gt;"
    },
	a.btnLabel);
    a.addEventListener("onload",
	function () {
	    baidu.dom.insertHTML(a.getMain(), "afterBegin", baidu.string.format(a.tplBtn, {
	        "class": a.getClass("btn-base") + " " + a.getClass("btn-prev"),
	        handler: a.getCallString("prev"),
	        content: a.btnLabel.prev
	    }));
	    baidu.dom.insertHTML(a.getMain(), "beforeEnd", baidu.string.format(a.tplBtn, {
	        "class": a.getClass("btn-base") + " " + a.getClass("btn-next"),
	        handler: a.getCallString("next"),
	        content: a.btnLabel.next
	    }))
	})
});
baidu.object.extend(baidu.ui.Carousel.prototype, {
    showButton: true,
    tplBtn: '<a class="#{class}" onclick="#{handler}" href="javascript:void(0);">#{content}</a>'
});
baidu.fx.scrollBy = function (b, g, a) {
    if (!(b = baidu.dom.g(b)) || typeof g != "object") {
        return null
    }
    var f = {},
	e = {};
    f.x = g[0] || g.x || 0;
    f.y = g[1] || g.y || 0;
    var c = baidu.fx.create(b, baidu.object.extend({
        initialize: function () {
            var h = e.sTop = b.scrollTop;
            var d = e.sLeft = b.scrollLeft;
            e.sx = Math.min(b.scrollWidth - b.clientWidth - d, f.x);
            e.sy = Math.min(b.scrollHeight - b.clientHeight - h, f.y)
        },
        transition: function (d) {
            return 1 - Math.pow(1 - d, 2)
        },
        render: function (d) {
            b.scrollTop = (e.sy * d + e.sTop);
            b.scrollLeft = (e.sx * d + e.sLeft)
        },
        restore: function () {
            b.scrollTop = e.sTop;
            b.scrollLeft = e.sLeft
        }
    },
	a), "baidu.fx.scroll");
    return c.launch()
};
baidu.fx.scrollTo = function (c, a, b) {
    if (!(c = baidu.dom.g(c)) || typeof a != "object") {
        return null
    }
    var e = {};
    e.x = (a[0] || a.x || 0) - c.scrollLeft;
    e.y = (a[1] || a.y || 0) - c.scrollTop;
    return baidu.fx.scrollBy(c, e, b)
};
baidu.ui.Carousel.register(function (a) {
    if (!a.enableFx) {
        return
    }
    a.addEventListener("onbeforescroll",
	function (c) {
	    if (baidu.fx.current(a.getBody())) {
	        return
	    }
	    var e = c.direction == "prev",
		d = a._axis[a.orientation],
		b = a.orientation == "horizontal",
		f = a.getBody()[d.scrollPos] + c.scrollUnit * a[d.vector].offset * (e ? -1 : 1);
	    a.scrollFxOptions = baidu.object.extend(a.scrollFxOptions, {
	        carousel: a,
	        index: c.index,
	        scrollOffset: c.scrollOffset,
	        direction: c.direction,
	        scrollUnit: c.scrollUnit
	    });
	    baidu.lang.isFunction(a.scrollFx) && a.scrollFx(a.getBody(), {
	        x: b ? f : 0,
	        y: b ? 0 : f
	    },
		a.scrollFxOptions);
	    c.returnValue = false
	})
});
baidu.ui.Carousel.extend({
    enableFx: true,
    scrollFx: baidu.fx.scrollTo,
    scrollFxOptions: {
        duration: 500,
        onbeforestart: function (a) {
            var b = a.target;
            a.target.carousel.dispatchEvent("onbeforestartscroll", {
                index: b.index,
                scrollOffset: b.scrollOffset,
                direction: b.direction,
                scrollUnit: b.scrollUnit
            })
        },
        onafterfinish: function (a) {
            var b = a.target;
            b.carousel.dispatchEvent("onbeforeendscroll", {
                index: b.index,
                scrollOffset: b.scrollOffset,
                direction: b.direction,
                scrollUnit: b.scrollUnit
            });
            b.carousel.dispatchEvent("onafterscroll", {
                index: b.index,
                scrollOffset: b.scrollOffset,
                direction: b.direction,
                scrollUnit: b.scrollUnit
            })
        }
    }
});
baidu.ui.Carousel.extend({
    _addText: function (f, b) {
        var e = this,
		g = baidu.dom.children(e.getScrollContainer()),
		b = Math.min(Math.max(baidu.lang.isNumber(b) ? b : e._dataList.length, 0), e._dataList.length),
		d = e.getItem(e.scrollIndex),
		a = baidu.array.indexOf(e._itemIds, g[0].id),
		c;
        e._dataList.splice(b, 0, {
            content: f
        });
        e._itemIds.splice(b, 0, baidu.lang.guid());
        b <= e.scrollIndex && e.scrollIndex++;
        c = d ? e.scrollIndex : baidu.array.indexOf(e._itemIds, g[0].id);
        b >= a && b <= a + e.pageSize - 1 && e._renderItems(c, baidu.array.indexOf(g, e.getItem(c)))
    },
    _removeItem: function (e) {
        if (!baidu.lang.isNumber(e) || e < 0 || e > this._dataList.length - 1) {
            return
        }
        var f = this,
		j = f.getItem(e),
		b = f.getItem(f.scrollIndex),
		g = f._itemIds[e],
		k = f._items[g],
		c = baidu.dom.children(f.getScrollContainer()),
		a = f.scrollIndex,
		h,
		d;
        k && baidu.array.each(k.handler,
		function (l) {
		    baidu.event.un(k.element, l.evtName, l.handler)
		});
        delete f._items[g];
        f._dataList.splice(e, 1);
        f._itemIds.splice(e, 1); (f.scrollIndex > f._dataList.length - 1 || f.scrollIndex > e) && f.scrollIndex--;
        if (j) {
            e == a && f.focus(f.scrollIndex);
            h = b ? f.scrollIndex : baidu.array.indexOf(f._itemIds, baidu.array.find(c,
			function (l) {
			    return l.id != g
			}).id);
            d = baidu.array.indexOf(c, f.getItem(h));
            e <= h && h < f.pageSize && d--;
            f._renderItems(h, d)
        }
        return j
    },
    addText: function (c, a) {
        var b = this;
        b._addText(c, a);
        b.dispatchEvent("onaddtext", {
            index: a
        })
    },
    addItem: function (b, a) {
        var c = this;
        c._addText(b.innerHTML, a);
        c.dispatchEvent("onadditem", {
            index: a
        })
    },
    removeItem: function (a) {
        var c = this,
		b = c._removeItem(a);
        c.dispatchEvent("onremoveitem", {
            index: a
        });
        return b
    }
});
baidu.array.hash = function (e, b) {
    var f = {},
	d = b && b.length,
	c = 0,
	a = e.length;
    for (; c < a; c++) {
        f[e[c]] = (d && d > c) ? b[c] : true
    }
    return f
};
baidu.extend(baidu.ui.behavior.statable, {
    _statableMouseHandler: function (b, c, a, d) {
        this._fireEvent(b, c, a, d)
    },
    setStateHandler: function (b, e, a) {
        var d = this,
		c = {};
        if (typeof a == "undefined") {
            e = a = ""
        }
        baidu.array.each(d._allEventsName,
		function (f) {
		    c[f] = baidu.fn.bind("_statableMouseHandler", d, f, e, a);
		    baidu.event.on(b, f, c[f])
		});
        d.addEventListener("dispose",
		function () {
		    baidu.object.each(c,
			function (g, f) {
			    baidu.event.un(b, f, g)
			})
		})
    }
});
baidu.ui.Table = baidu.ui.createUI(function (a) {
    var b = this;
    b.data = b.data || [];
    b._rows = []
});
baidu.ui.Table.extend({
    uiType: "table",
    tplBody: '<div><table cellpadding="0" cellspacing="0" border="0" id="#{id}" class="#{class}" #{stateHandler}>#{rows}</table></div>',
    getString: function () {
        var a = this;
        return baidu.format(a.tplBody, {
            id: a.getId(),
            "class": a.getClass(),
            rows: a._getRowsString()
        })
    },
    _getRowsString: function () {
        var d = this,
		b = 0,
		a = d.data.length,
		c = [],
		e;
        for (; b < a; b++) {
            e = d.getRow(b);
            if (!e) {
                e = d._rows[b] = d._createRow(d.data[b])
            } else {
                e.update(d.data[b])
            }
            c.push(e.getString())
        }
        while (d._rows.length > d.data.length) {
            d._rows.pop()
        }
        return c.join("")
    },
    render: function (b) {
        var a = this;
        if (!b) {
            return
        }
        baidu.dom.insertHTML(a.renderMain(b), "beforeEnd", a.getString());
        a.resizeColumn();
        a.dispatchEvent("onload")
    },
    update: function (a) {
        var b = this;
        a = a || {};
        baidu.object.extend(b, a);
        b.dispatchEvent("beforeupdate");
        b.getMain().innerHTML = b.getString();
        b.resizeColumn();
        b.dispatchEvent("update")
    },
    resizeColumn: function () {
        var a = this,
		c = [],
		b = a.getBody().rows[0];
        if (b && a.columns) {
            baidu.array.each(a.columns,
			function (d) {
			    if (d.hasOwnProperty("width")) {
			        baidu.dom.setStyles(b.cells[d.index], {
			            width: d.width
			        })
			    }
			})
        }
    },
    _createRow: function (a) {
        a.parent = this;
        return new baidu.ui.Table.Row(a)
    },
    getRow: function (a) {
        var b = this._rows[a];
        if (b && !b.disposed) {
            return b
        }
        return null
    },
    getRowCount: function () {
        return this._rows.length
    },
    _addRow: function (b, a) {
        var c = this,
		a = baidu.lang.isNumber(a) ? a : c.getBody().rows.length,
		d = c._createRow(b);
        c.data.splice(a, 0, b);
        c._rows.splice(a, 0, d);
        d.insertTo(a);
        return d.getId()
    },
    addRow: function (b, a) {
        var c = this;
        c.dispatchEvent("addrow", {
            rowId: c._addRow(b, a)
        })
    },
    _removeRow: function (a) {
        var b = this,
		d = b._rows[a],
		c;
        if (d) {
            c = d.getId();
            b.data.splice(a, 1);
            d.remove();
            b._rows.splice(a, 1);
            0 == a && b.resizeColumn()
        }
        return c
    },
    removeRow: function (a) {
        var b = this,
		c = b._removeRow(a);
        if (c) {
            b.dispatchEvent("removerow", {
                rowId: c
            })
        }
    },
    getTarget: function () {
        var a = this;
        return baidu.g(a.targetId) || a.getMain()
    },
    dispose: function () {
        var a = this;
        baidu.dom.remove(a.getId())
    }
});
baidu.ui.Table.Row = baidu.ui.createUI(function (a) {
    this._cells = {};
    this.addState("selected")
}).extend({
    uiType: "table-row",
    statable: true,
    getMain: function () {
        return baidu.g(this.getId())
    },
    getString: function () {
        var c = this,
		d = [],
		a = c.getClass("col"),
		b = {};
        d.push("<tr id='", c.getId(), "' class='", c.getClass(), "' data-guid='", c.guid, "' ", c._getStateHandlerString(), ">");
        baidu.array.each(c.content,
		function (f, e) {
		    d.push("<td>", f, "</td>")
		});
        d.push("</tr>");
        return d.join("")
    },
    update: function (a) {
        var b = this,
		c = baidu.dom.children(b.getMain());
        a = a || {};
        baidu.object.extend(b, a);
        baidu.array.each(c,
		function (e, d) {
		    e.innerHTML = b.content[d]
		});
        b.dispatchEvent("update")
    },
    insertTo: function (b) {
        var c = this,
		d,
		a;
        if (!c.getMain()) {
            d = c.getParent().getBody().insertRow(b);
            baidu.dom.setAttrs(d, {
                id: c.getId(),
                "class": c.getClass(),
                "data-guid": c.guid
            });
            c.setStateHandler(d);
            baidu.array.each(c.content,
			function (f, e) {
			    a = d.insertCell(e);
			    a.innerHTML = f
			})
        }
    },
    _getCols: function () {
        return baidu.dom.children(this.getId())
    },
    _getColsString: function (b, a) {
        return colsArr.join("")
    },
    select: function () {
        var a = this,
		b = a.getMain().id;
        if (!a.getState(b)["disabled"]) {
            a.setState("selected", b)
        }
    },
    unselect: function () {
        var a = this;
        a.removeState("selected", a.getMain().id)
    },
    remove: function () {
        var a = this;
        a.getParent().getBody().deleteRow(a.getBody().rowIndex);
        a.dispose()
    },
    toggle: function () {
        var a = this;
        if (a.getState(a.getMain().id)["selected"]) {
            a.unselect()
        } else {
            a.select()
        }
    },
    getCell: function (b) {
        var c = this,
		d = c._getCols()[b],
		a;
        if (d) {
            if (d.id) {
                a = c._cells[d.id]
            } else {
                a = new baidu.ui.Table.Cell({
                    target: d
                });
                a._initialize(c);
                c._cells[a.getId()] = a
            }
        }
        d = null;
        return a
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("dispose");
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Table.Cell = baidu.ui.createUI(function (a) { }).extend({
    uiType: "table-cell",
    _initialize: function (b) {
        var a = this;
        a.setParent(b);
        baidu.dom.setAttrs(a.target, {
            id: a.getId(),
            "data-guid": a.guid
        })
    },
    getMain: function () {
        return baidu.dom.g(this.getId())
    },
    getParent: function () {
        return this._parent
    },
    setParent: function (a) {
        this._parent = a
    },
    getHTML: function () {
        return this.getMain().innerHTML
    },
    setHTML: function (c) {
        var b = this,
		a = b.getParent();
        a.getParent().data[a.getMain().rowIndex].content[b.getMain().cellIndex] = c;
        b.getMain().innerHTML = c
    }
});
baidu.lang.isArray = function (a) {
    return "[object Array]" == Object.prototype.toString.call(a)
};
baidu.ui.Carousel.register(function (a) {
    if (!a.supportTable) {
        return
    }
    a.gridLayout = baidu.object.extend({
        row: 3,
        col: 3
    },
	baidu.lang.isArray(a.gridLayout) ? baidu.array.hash(["row", "col"], a.gridLayout) : a.gridLayout);
    a._dataList = a._formatTableData(a._dataList);
    a._tables = [];
    baidu.array.each(a._dataList,
	function (c, b) {
	    a._tables.push(new baidu.ui.Table({
	        data: c
	    }));
	    a._dataList[b] = {
	        content: a._tables[b].getString()
	    }
	})
});
baidu.ui.Carousel.extend({
    supportTable: true,
    _formatTableData: function (f) {
        var e = this,
		d = e.gridLayout,
		c = f.length,
		g = [],
		a = 0,
		b;
        for (; a < c; a++) {
            a % (d.row * d.col) == 0 && g.push([]);
            b = g[g.length - 1];
            a % d.col == 0 && b.push({
                content: []
            });
            b[b.length - 1].content.push(f[a].content)
        }
        return g
    },
    addTableItem: function (c, a) {
        var b = this,
		c = b._formatTableData(c),
		a = Math.min(Math.max(baidu.lang.isNumber(a) ? a : b._dataList.length, 0), b._dataList.length);
        b._tables.splice(a, 0, new baidu.ui.Table({
            data: c[0]
        }));
        b._addText(b._tables[a].getString(), a)
    },
    removeTableItem: function (a) {
        if (!baidu.lang.isNumber(a) || a < 0 || a > this._dataList.length - 1) {
            return
        }
        var b = this;
        b._tables.splice(a, 1);
        return b._removeItem(a)
    },
    getTable: function (a) {
        return this._tables[a]
    }
});
baidu.dom.getAncestorByTag = function (b, a) {
    b = baidu.dom.g(b);
    a = a.toUpperCase();
    while ((b = b.parentNode) && b.nodeType == 1) {
        if (b.tagName == a) {
            return b
        }
    }
    return null
};
baidu.ui.Menubar = baidu.ui.createUI(function (a) {
    var b = this;
    b.items = {};
    b.data = a.data || [];
    b._initialized = false;
    b.dispatchEvent("oninit")
}).extend({
    uiType: "menubar",
    width: 200,
    height: "",
    zIndex: 1200,
    hideDelay: 300,
    position: "bottomCenter",
    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplBranch: '<ul id="#{ulId}">#{subitems}</ul>',
    tplItem: '<li onmouseover="#{onmouseover}" onmouseout="#{onmouseout}"><a href="#" id="#{id}" class="#{class}" onclick="#{onclick}" title="#{title}">#{content}</a>#{branch}</li>',
    tplContent: '<span class="#{contentClass}">#{content}</span>',
    tplArrow: '<span class="#{arrow}"></span>',
    toggle: function () {
        return true
    },
    posable: true,
    getString: function () {
        var a = this;
        return baidu.string.format(a.tplBody, {
            id: a.getId(),
            "class": a.getClass(),
            guid: a.guid,
            content: a.getItemsString(a.data, 0)
        })
    },
    getItemsString: function (b, c) {
        var d = this,
		a = [];
        baidu.array.each(b,
		function (f, e) {
		    var g = [],
			h = c + "-" + e;
		    d.items[h] = f;
		    g.push(baidu.string.format(d.tplContent, {
		        contentClass: d.getClass("content"),
		        content: f.content || f.label
		    }));
		    if (f.items) {
		        g.push(baidu.string.format(d.tplArrow, {
		            arrow: d.getClass("arrow")
		        }))
		    }
		    a.push(baidu.string.format(d.tplItem, {
		        id: d.getItemId(h),
		        "class": (f.disabled ? (d.getClass("item") + " " + d.getClass("item-disabled")) : d.getClass("item")),
		        onclick: d.getCallRef() + ".itemClick('" + h + "', event);",
		        onmouseover: f.disabled || d.getCallRef() + ".itemMouseOver(event, '" + h + "')",
		        onmouseout: f.disabled || d.getCallRef() + ".itemMouseOut(event, '" + h + "')",
		        content: g.join(""),
		        branch: f.items ? d.getItemsString(f.items, h) : "",
		        title: f.title
		    }))
		});
        return baidu.string.format(d.tplBranch, {
            ulId: d.getBranchId(c),
            subitems: a.join("")
        })
    },
    render: function (b) {
        var a = this;
        b = baidu.g(b);
        if (b) {
            a.targetId = b.id || a.getId("target")
        }
        a.renderMain();
        a.dispatchEvent("onload")
    },
    itemClick: function (a, b) {
        var c = this;
        baidu.event.preventDefault(b || window.event);
        c._close();
        c.dispatchEvent("onitemclick", c.getItemEventData(a))
    },
    getItemEventData: function (a) {
        return {
            value: this.getItemData(a),
            index: a
        }
    },
    itemMouseOver: function (c, b) {
        var e = this,
		f = baidu.event.getTarget(c),
		a = e.getItemData(b),
		d = e.getItem(b),
		g;
        baidu.dom.addClass(d, e.getClass("item-hover"));
        if (a.items) {
            g = baidu.dom.g(e.getBranchId(b));
            if (g.style.display == "none") {
                baidu.dom.show(g);
                f.tagName.toUpperCase() != "LI" && (f = baidu.dom.getAncestorByTag(f, "LI"));
                e.setPositionByElement(f, g, {
                    position: "rightCenter",
                    once: true
                })
            }
        }
        a.showing = true;
        e.dispatchEvent("onitemmouseover", e.getItemEventData(b))
    },
    itemMouseOut: function (c, b) {
        var e = this,
		f = baidu.event.getTarget(c),
		a = e.getItemData(b),
		d = e.getItem(b);
        baidu.dom.removeClass(e.getItem(b), e.getClass("item-hover"));
        a.showing = false;
        clearTimeout(a.outListener);
        a.outListener = setTimeout(function () {
            if (!a.showing) {
                a.items && baidu.dom.hide(e.getBranchId(b));
                e.dispatchEvent("onitemmouseout", e.getItemEventData(b))
            }
        },
		e.hideDelay)
    },
    update: function (c) {
        var d = this,
		b = d.getMain(),
		e = d.getTarget();
        c && baidu.object.extend(d, c);
        b.innerHTML = d.getString();
        d.dispatchEvent("onupdate");
        baidu.dom.setStyle(b, "z-index", d.zIndex);
        var a = d.getBody();
        baidu.dom.setStyles(a, {
            height: d.height,
            width: d.width
        });
        baidu.dom.setStyle(d.getBranchId(0), "width", d.width);
        baidu.dom.addClass(d.getBranchId(0), d.getClass("root"));
        baidu.object.each(d.items,
		function (g, f) {
		    if (g.items) {
		        baidu.dom.setStyles(d.getBranchId(f), {
		            width: d.width,
		            position: "absolute",
		            display: "none"
		        })
		    }
		});
        if (e) {
            d.setPositionByElement(e, d.getMain(), {
                position: d.position,
                once: true
            })
        }
    },
    getItemId: function (a) {
        return this.getId("item-" + a)
    },
    getBranchId: function (a) {
        return this.getId("branch-" + a)
    },
    getItem: function (a) {
        return baidu.g(this.getItemId(a))
    },
    getItemData: function (a) {
        return this.items[a]
    },
    open: function () {
        var b = this,
		d = b.getTarget(),
		a = b.getBody(),
		c;
        if (baidu.lang.isFunction(b.toggle) && !b.toggle()) {
            return
        }
        if (!b.dispatchEvent("onbeforeopen")) {
            return
        }
        if (c = baidu.ui.Menubar.showing) {
            c.close()
        }
        a && (a.style.display = "");
        if (!b._initialized) {
            b.update();
            b._initialized = true
        } else {
            if (d) {
                b.setPositionByElement(d, b.getMain(), {
                    position: b.position,
                    once: true
                })
            }
        }
        b.dispatchEvent("onopen");
        baidu.ui.Menubar.showing = b
    },
    close: function () {
        var b = this,
		a = b.getBody();
        if (!a) {
            return
        }
        if (b.dispatchEvent("onbeforeclose")) {
            b._close();
            b.dispatchEvent("onclose")
        }
    },
    _close: function () {
        var b = this,
		a = b.getBody();
        baidu.ui.Menubar.showing = null;
        a.style.display = "none"
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("ondispose");
        a.getMain() && baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    },
    getTarget: function () {
        return baidu.g(this.targetId)
    }
});

baidu.ui.Menubar.register(function (me) {
    if (me.type == 'click') {
        me.targetOpenHandler = baidu.fn.bind("open", me);
        me.bodyClickHandler = baidu.fn.bind("bodyClick", me);

        me.addEventListener('onload', function () {
            var target = me.getTarget();
            if (target) {
                baidu.on(target, 'click', me.targetOpenHandler);
                baidu.on(document, 'click', me.bodyClickHandler);
            }
        });

        me.addEventListener("ondispose", function () {
            var target = me.getTarget();
            if (target) {
                baidu.un(target, 'click', me.targetOpenHandler);
                baidu.un(document, 'click', me.bodyClickHandler);
            }
        });
    }
});
baidu.ui.Menubar.extend({
    type: "click",
    bodyClick: function (d) {
        var b = this;
        var c = baidu.event.getTarget(d || window.event),
		a = function (e) {
		    return e == b.getTarget()
		};
        if (!c || a(c) || baidu.dom.getAncestorBy(c, a) || baidu.ui.get(c) == b) {
            return
        }
        b.close()
    }
});

baidu.ui.Combox = baidu.ui.createUI(function (options) {
    var me = this;
    me.data = me.data || [];
    me.menu = me.menu || false; //下拉menu,用于判断menu是否已存在
}).extend(

{
    uiType: "combox",
    editable: true,
    width: '',
    height: '',
    zIndex: 1200,
    statable: true,
    posable: true,


    filter: function (filterStr, data) {
        var ret = [];
        baidu.array.each(data || this.data, function (dataItem) {
            var strIndex = String(dataItem.value || dataItem.content).indexOf(filterStr);
            if (strIndex >= 0) {
                ret.push(dataItem);
            }
        });
        return ret;
    },

    tplBody: ['<div id="#{id}" class="#{class}" #{stateHandler}>',
                    '<input id="#{inputid}" class="#{inputClass}" autocomplete="off" readOnly="readOnly"/>',
                    '<span id="#{arrowid}" class="#{arrowClass}"></span>',
               '</div>'].join(''),


    getString: function () {
        var me = this;
        return baidu.format(me.tplBody, {
            id: me.getId(),
            "class": me.getClass(),
            inputClass: me.getClass('input'),
            arrowClass: me.getClass('arrow'),
            inputid: me.getId("input"),
            arrowid: me.getId("arrow"),
            stateHandler: me._getStateHandlerString()
        });
    },


    render: function (target) {
        var me = this;
        if (me.getMain()) {
            return;
        }

        me.dispatchEvent("onbeforerender");
        baidu.dom.insertHTML(me.renderMain(target || me.target), "beforeEnd", me.getString());
        me._createMenu(); //创建下拉menu
        me._enterTipMode();
        me.position && me.setPosition(me.position, target);
        me.dispatchEvent("onload");
    },


    _enterTipMode: function () {
        var me = this,
            input = me.getInput();
        me._showMenuHandler = baidu.fn.bind(function () {
            var me = this;
            var input = me.getInput();
            me.menu.open();
            me.menu.update({//如果开启input可编辑模式，则智能筛选数据
                data: me.editable ? me.filter(input.value, me.data) : me.data
            });
        }, me);

        me.on(input, "focus", me._showMenuHandler);
        if (me.editable) {
            input.readOnly = '';
            me.on(input, "keyup", me._showMenuHandler);
        }
    },


    _createMenu: function () {
        var me = this,
            body = me.getBody(),
            arrow = me.getArrow(),
            menuOptions = {
                width: me.width || body.offsetWidth,
                onitemclick: function (data) {
                    me.chooseItem(data);
                },
                element: body,
                autoRender: true,
                data: me.data,
                onbeforeclose: me.onbeforeclose,
                onclose: me.onclose,
                onbeforeopen: me.onbeforeopen,
                onopen: me.onopen,
                onitemmouseover: me.onitemmouseover,
                onitemmouseout: me.onitemmouseout,
                hideDelay: 0
            };

        me.menu = baidu.ui.create(baidu.ui.Menubar, menuOptions);
        me.menu.close(true);

        me._showAllMenuHandler = baidu.fn.bind(function () {
            var me = this;
            me.menu.open();
            me.menu.update({
                data: me.data
            });
        }, me);
        me.on(arrow, 'click', me._showAllMenuHandler);
        return me.menu;
    },


    getInput: function () {
        return baidu.g(this.getId("input"));
    },


    getArrow: function () {
        return baidu.g(this.getId("arrow"));
    },


    chooseItem: function (data) {
        var me = this;
        me.getInput().value = data.value.content;
        me.dispatchEvent('onitemclick', data);
    },

    chooseItemByValue: function (field, value) {
        var me = this;
        for (var i = 0; i < me.data.length; i++) {
            if (eval("me.data[" + i + "]." + field) == value) {
                me.getInput().value = me.data[i].content;
            }
        }
    }
    ,

    setValue: function (value) {
        this.getInput().value = value;
    },


    dispose: function () {
        var me = this;
        me.menu && me.menu.dispose();
        me.getMain() && baidu.dom.remove(me.getMain());
        me.dispatchEvent('ondispose');
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

baidu.lang.isObject = function (a) {
    return "function" == typeof a || !!(a && "object" == typeof a)
};
baidu.isObject = baidu.lang.isObject; (function () {
    var b = function (c) {
        return baidu.lang.isObject(c) && !baidu.lang.isFunction(c)
    };
    function a(g, f, e, d, c) {
        if (f.hasOwnProperty(e)) {
            if (c && b(g[e])) {
                baidu.object.merge(g[e], f[e], {
                    overwrite: d,
                    recursive: c
                })
            } else {
                if (d || !(e in g)) {
                    g[e] = f[e]
                }
            }
        }
    }
    baidu.object.merge = function (h, c, k) {
        var e = 0,
		l = k || {},
		g = l.overwrite,
		j = l.whiteList,
		d = l.recursive,
		f;
        if (j && j.length) {
            f = j.length;
            for (; e < f; ++e) {
                a(h, c, j[e], g, d)
            }
        } else {
            for (e in c) {
                a(h, c, e, g, d)
            }
        }
        return h
    }
})();
baidu.ui.Popup = baidu.ui.createUI(function (a) { }).extend({
    uiType: "popup",
    width: "",
    height: "",
    top: "auto",
    left: "auto",
    zIndex: 1200,
    contentText: "",
    onbeforeclose: function () {
        return true
    },
    tplBody: "<div id='#{id}' class='#{class}' style='position:relative; top:0px; left:0px;'></div>",
    isShown: function () {
        return baidu.ui.Popup.instances[this.guid] == "show"
    },
    getString: function () {
        var a = this;
        return baidu.format(a.tplBody, {
            id: a.getId(),
            "class": a.getClass()
        })
    },
    render: function () {
        var b = this,
		a;
        if (b.getMain()) {
            return
        }
        a = b.renderMain();
        a.innerHTML = b.getString();
        b._update(b);
        baidu.dom.setStyles(b.getMain(), {
            position: "absolute",
            zIndex: b.zIndex,
            marginLeft: "-100000px"
        });
        b.dispatchEvent("onload");
        return a
    },
    open: function (a) {
        var b = this;
        b._update(a);
        b.getMain().style.marginLeft = "auto";
        baidu.ui.Popup.instances[b.guid] = "show";
        b.dispatchEvent("onopen")
    },
    close: function () {
        var a = this;
        if (a.dispatchEvent("onbeforeclose")) {
            a.getMain().style.marginLeft = "-100000px";
            baidu.ui.Popup.instances[a.guid] = "hide";
            a.dispatchEvent("onclose")
        }
    },
    update: function (a) {
        var b = this;
        b._update(a);
        b.dispatchEvent("onupdate")
    },
    _update: function (b) {
        b = b || {};
        var c = this,
		a = c.getBody();
        baidu.object.extend(c, b);
        if (b.content) {
            if (a.firstChild != b.content) {
                a.innerHTML = "";
                a.appendChild(b.content)
            }
        } else {
            if (b.contentText) {
                a.innerHTML = b.contentText
            }
        }
        c._updateSize();
        c._updatePosition()
    },
    _updateSize: function () {
        var a = this;
        baidu.dom.setStyles(a.getMain(), {
            width: a.width,
            height: a.height
        })
    },
    _updatePosition: function () {
        var a = this;
        baidu.dom.setStyles(a.getMain(), {
            top: a.top,
            left: a.left
        })
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("ondispose");
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Popup.instances = baidu.ui.Popup.instances || [];
baidu.dom.insertBefore = function (d, c) {
    var b,
	a;
    b = baidu.dom._g;
    d = b(d);
    c = b(c);
    a = c.parentNode;
    if (a) {
        a.insertBefore(d, c)
    }
    return d
}; (function () {
    var a = baidu.ui.behavior.coverable = function () { };
    a.Coverable_isShowing = false;
    a.Coverable_iframe;
    a.Coverable_container;
    a.Coverable_iframeContainer;
    a.Coverable_show = function () {
        var h = this;
        if (h.Coverable_iframe) {
            h.Coverable_update();
            baidu.setStyle(h.Coverable_iframe, "display", "block");
            return
        }
        var f = h.coverableOptions || {},
		c = h.Coverable_container = f.container || h.getMain(),
		e = f.opacity || "0",
		d = f.color || "",
		g = h.Coverable_iframe = document.createElement("iframe"),
		b = h.Coverable_iframeContainer = document.createElement("div");
        baidu.dom.children(c).length > 0 ? baidu.dom.insertBefore(b, c.firstChild) : c.appendChild(b);
        baidu.setStyles(b, {
            position: "absolute",
            top: "0px",
            left: "0px"
        });
        baidu.dom.setBorderBoxSize(b, {
            width: c.offsetWidth,
            height: c.offsetHeight
        });
        baidu.dom.setBorderBoxSize(g, {
            width: b.offsetWidth
        });
        baidu.dom.setStyles(g, {
            zIndex: -1,
            display: "block",
            border: 0,
            backgroundColor: d,
            filter: "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=" + e + ")"
        });
        b.appendChild(g);
        g.src = "javascript:void(0)";
        g.frameBorder = "0";
        g.scrolling = "no";
        g.height = "97%";
        h.Coverable_isShowing = true
    };
    a.Coverable_hide = function () {
        var c = this,
		b = c.Coverable_iframe;
        if (!c.Coverable_isShowing) {
            return
        }
        baidu.setStyle(b, "display", "none");
        c.Coverable_isShowing = false
    };
    a.Coverable_update = function (d) {
        var f = this,
		d = d || {},
		c = f.Coverable_container,
		b = f.Coverable_iframeContainer,
		e = f.Coverable_iframe;
        baidu.dom.setBorderBoxSize(b, {
            width: c.offsetWidth,
            height: c.offsetHeight
        });
        baidu.dom.setBorderBoxSize(e, baidu.extend({
            width: baidu.getStyle(b, "width")
        },
		d))
    }
})();
baidu.extend(baidu.ui.Popup.prototype, {
    coverable: true,
    coverableOptions: {}
});
baidu.ui.Popup.register(function (a) {
    if (a.coverable) {
        a.addEventListeners("onopen,onload",
		function () {
		    a.Coverable_show()
		});
        a.addEventListener("onclose",
		function () {
		    a.Coverable_hide()
		});
        a.addEventListener("onupdate",
		function () {
		    a.Coverable_update()
		})
    }
});
baidu.ui.DatePicker = baidu.ui.createUI(function (a) {
    var b = this;
    b.format = b.format || baidu.i18n.cultures[b.language].calendar.dateFormat || "yyyy-MM-dd";
    b.popupOptions = baidu.object.merge(b.popupOptions || {},
	a, {
	    overwrite: true,
	    whiteList: ["width", "height"]
	});
    b.calendarOptions = baidu.object.merge(b.calendarOptions || {},
	a, {
	    overwrite: true,
	    whiteList: ["weekStart"]
	});
    b._popup = new baidu.ui.Popup(b.popupOptions);
    b._calendar = new baidu.ui.Calendar(b.calendarOptions);
    b._calendar.addEventListener("clickdate",
	function (c) {
	    b.pick(c.date)
	})
}).extend({
    uiType: "datePicker",
    language: "zh-CN",
    _getInputDate: function () {
        var f = this,
		a = [/yyyy|yy/, /M{1,2}/, /d{1,2}/],
		d = [],
		g = {},
		e = a.length,
		c = 0,
		b;
        for (; c < e; c++) {
            b = a[c].exec(f.format);
            d[c] = b ? b.index : null
        }
        f.input.value.replace(/\d{1,4}/g,
		function (j, h) {
		    g[h] = j
		});
        for (c = 0; c < d.length; c++) {
            d[c] = g[d[c]];
            if (!d[c]) {
                return
            }
        }
        return new Date(d[0], d[1] - 1, d[2])
    },
    _onMouseDown: function (b) {
        var c = this,
		a = c._popup,
		d = baidu.event.getTarget(b);
        if (d.id != c.input.id && !baidu.dom.contains(a.getBody(), d)) {
            c.hide()
        }
    },
    render: function (g) {
        var d = this,
		c = baidu.fn.bind("show", d),
		f = baidu.fn.bind("_onMouseDown", d),
		e = baidu.fn.bind("hide", d),
		b = d.input = baidu.dom.g(g),
		a = d._popup;
        if (d.getMain() || !b) {
            return
        }
        a.render();
        d._calendar.render(a.getBody());
        d.on(b, "focus", c);
        d.on(b, "keyup", e);
        d.on(document, "click", f)
    },
    pick: function (a) {
        var b = this;
        b.input.value = baidu.date.format(a, b.format);
        b.hide();
        b.dispatchEvent("pick")
    },
    show: function () {
        var c = this,
		g = c.input && baidu.dom.getPosition(c.input),
		a = c._popup,
		e = c._calendar,
		d = document[baidu.browser.isStrict ? "documentElement" : "body"],
		b = c.input.offsetHeight,
		f = c._popup.getBody().offsetHeight;
        c._calendar.setDate(c._getInputDate() || e._toLocalDate(new Date()));
        c._calendar.renderTitle();
        c._calendar._renderDate();
        g.top += (g.top + b + f - d.scrollTop > d.clientHeight) ? -f : b;
        c._popup.open(g)
    },
    hide: function () {
        this._popup.close()
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("dispose");
        a._calendar.dispose();
        a._popup.dispose();
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Decorator = baidu.ui.createUI(function (a) { }).extend({
    uiType: "decorator",
    type: "box",
    tpl: {
        box: "<table cellspacing='0' cellpadding='0' border='0' id='#{id}'><tr><td #{class}></td><td #{class}></td><td #{class}></td></tr><tr><td #{class}><i style='visibility:hidden'>&nbsp;</i></td><td #{class} id='#{innerWrapId}' valign='top'></td><td #{class}><i style='visibility:hidden'>&nbsp;</i></td></tr><tr><td #{class}></td><td #{class}></td><td #{class}></td></tr></table>"
    },
    tplClass: {
        box: ["lt", "ct", "rt", "lc", "cc", "rc", "lb", "cb", "rb"]
    },
    getInner: function () {
        return baidu.g(this.innerId)
    },
    getBox: function () {
        return baidu.g(this.getId("table"))
    },
    _getBodyWrap: function () {
        return baidu.g(this.getId("body-wrap"))
    },
    render: function () {
        var d = this,
		c = document.createElement("div"),
		b = d.ui.getMain(),
		a = b.style,
		e = 0;
        document.body.appendChild(c);
        d.renderMain(c),
		c.className = d.getClass(d.type + "-main");
        c.innerHTML = baidu.format(d.tpl[d.type], {
            id: d.getId("table"),
            "class": function (f) {
                return "class='" + d.getClass(d.type + "-" + d.tplClass[d.type][e++]) + "'"
            },
            innerWrapId: d.getId("body-wrap")
        });
        baidu.each(baidu.dom.children(b),
		function (f) {
		    d._getBodyWrap().appendChild(f)
		});
        b.appendChild(c);
        d.innerId = b.id;
        b.getBodyHolder = d._getBodyWrap()
    }
});
baidu.event.stopPropagation = function (a) {
    if (a.stopPropagation) {
        a.stopPropagation()
    } else {
        a.cancelBubble = true
    }
};
baidu.extend(baidu.ui.Dialog.prototype, {
    closeText: "",
    closeButton: true
});
baidu.ui.Dialog.register(function (a) {
    a.closeButton && a.addEventListener("onload",
	function () {
	    var b = new baidu.ui.Button({
	        parent: a,
	        classPrefix: a.classPrefix + "-close",
	        skin: a.skin ? a.skin + "-close" : "",
	        onclick: function () {
	            a.close()
	        },
	        onmousedown: function (c) {
	            baidu.event.stopPropagation(c.DOMEvent)
	        },
	        element: a.getTitle(),
	        autoRender: true
	    });
	    a.closeButtonInstance = b;
	    a.addEventListener("ondispose",
		function () {
		    b.dispose()
		})
	})
});
baidu.extend(baidu.ui.Dialog.prototype, {
    coverable: true,
    coverableOptions: {}
});
baidu.ui.Dialog.register(function (a) {
    if (a.coverable) {
        a.addEventListeners("onopen,onload",
		function () {
		    a.Coverable_show()
		});
        a.addEventListener("onclose",
		function () {
		    a.Coverable_hide()
		});
        a.addEventListener("onupdate",
		function () {
		    a.Coverable_update()
		})
    }
});
baidu.page.getWidth = function () {
    var d = document,
	a = d.body,
	c = d.documentElement,
	b = d.compatMode == "BackCompat" ? a : d.documentElement;
    return Math.max(c.scrollWidth, a.scrollWidth, b.clientWidth)
};
baidu.page.getHeight = function () {
    var d = document,
	a = d.body,
	c = d.documentElement,
	b = d.compatMode == "BackCompat" ? a : d.documentElement;
    return Math.max(c.scrollHeight, a.scrollHeight, b.clientHeight)
}; (function () {
    var a = baidu.ui.behavior.draggable = function () {
        this.addEventListener("onload",
		function () {
		    var b = this;
		    b.dragUpdate()
		});
        this.addEventListener("ondispose",
		function () {
		    var b = this;
		    baidu.un(b._dragOption.handler, "mousedown", b._dragFn);
		    b._dragOption.handler = b.dragHandler = b._lastDragHandler = null
		})
    };
    a.dragUpdate = function (b) {
        var c = this;
        b = b || {};
        if (!c.draggable) {
            return
        }
        if (c._lastDragHandler && c._dragFn) {
            baidu.event.un(c._lastDragHandler, "onmousedown", c._dragFn)
        }
        baidu.object.extend(c, b);
        c._dragOption = {
            ondragstart: function () {
                c.dispatchEvent("ondragstart")
            },
            ondrag: function () {
                c.dispatchEvent("ondrag")
            },
            ondragend: function () {
                c.dispatchEvent("ondragend")
            },
            autoStop: true
        };
        c._dragOption.range = c.dragRange || [];
        c._dragOption.handler = c._lastDragHandler = c.dragHandler || c.getMain();
        if (c._dragOption.handler) {
            baidu.event.on(c._dragOption.handler, "onmousedown", c._dragFn = function () {
                baidu.dom.drag(c.dragTarget || c.getMain(), c._dragOption)
            })
        }
    }
})();
baidu.ui.Dialog.prototype.draggable = true;
baidu.ui.Dialog.register(function (b) {
    if (b.draggable) {
        function a() {
            b.dragRange = [0, baidu.page.getWidth(), baidu.page.getHeight(), 0];
            b.dragUpdate()
        }
        b.addEventListener("onload",
		function () {
		    b.dragHandler = b.dragHandler || b.getTitle();
		    if (!b.dragRange) {
		        a();
		        b.on(window, "resize", a)
		    } else {
		        b.dragUpdate()
		    }
		});
        b.addEventListener("ondragend",
		function () {
		    b.left = baidu.dom.getStyle(b.getMain(), "left");
		    b.top = baidu.dom.getStyle(b.getMain(), "top")
		})
    }
});
baidu.ui.Dialog.register(function (c) {
    if (c.type == "iframe") {
        baidu.extend(c, {
            autoRender: true,
            tplIframe: "<iframe width='100%' height='97%' frameborder='0' scrolling='no' name='#{name}' id='#{id}' class='#{class}'></iframe>",
            getIframe: function () {
                return baidu.g(this.getId("iframe"))
            },
            updateIframe: function (g) {
                baidu.setStyles(this.getId("iframe"), g);
                c._updatePosition();
                c.dispatchEvent("onupdate")
            }
        });
        var b,
		f = c.getId("iframe"),
		d = c.iframeName || f,
		e,
		a,
		b = baidu.format(c.tplIframe, {
		    name: d,
		    id: f,
		    "class": c.getClass("iframe")
		});
        c.addEventListener("onload",
		function () {
		    c._update({
		        contentText: b
		    });
		    c._updatePosition();
		    e = baidu.g(f);
		    c.on(e, "onload",
			function () {
			    c._updatePosition();
			    c.dispatchEvent("onupdate")
			});
		    e.src = c.iframeSrc
		})
    }
});
baidu.extend(baidu.ui.Dialog.prototype, {
    enableKeyboard: true,
    closeOnEscape: true
});
baidu.ui.Dialog.register(function (a) {
    baidu.ui.Dialog.keyboardHandler = baidu.ui.Dialog.keyboardHandler ||
	function (d) {
	    d = window.event || d;
	    var c = d.keyCode || d.which,
		f,
		b;
	    baidu.object.each(baidu.ui.Dialog.instances,
		function (g, e) {
		    if (g == "show") {
		        b = baidu.lang.instance(e);
		        if (!f || b.zIndex > f.zIndex) {
		            f = b
		        }
		    }
		});
	    if (f) {
	        switch (c) {
	            case 27:
	                f.closeOnEscape && f.close();
	                break;
	            case 13:
	                f.dispatchEvent("onenter");
	                break;
	            default:
	        }
	    }
	};
    if (a.enableKeyboard && !baidu.ui.Dialog.keyboardEventReady) {
        baidu.on(document, "keyup", baidu.ui.Dialog.keyboardHandler);
        baidu.ui.Dialog.keyboardEventReady = true
    }
    a.addEventListener("ondispose",
	function () {
	    var b = true;
	    baidu.object.each(baidu.ui.Dialog.instances,
		function (d, c) {
		    b = false;
		    return false
		});
	    if (b) {
	        baidu.event.un(document, "keyup", baidu.ui.Dialog.keyboardHandler);
	        baidu.ui.Dialog.keyboardEventReady = false
	    }
	})
});
baidu.dom._styleFixer.opacity = baidu.browser.ie ? {
    get: function (a) {
        var b = a.style.filter;
        return b && b.indexOf("opacity=") >= 0 ? (parseFloat(b.match(/opacity=([^)]*)/)[1]) / 100) + "" : "1"
    },
    set: function (a, c) {
        var b = a.style;
        b.filter = (b.filter || "").replace(/alpha\([^\)]*\)/gi, "") + (c == 1 ? "" : "alpha(opacity=" + c * 100 + ")");
        b.zoom = 1
    }
} : null;
baidu.dom.fixable = function (a, b) {
    var u = baidu.g(a),
	p = baidu.browser.ie && baidu.browser.ie <= 7 ? true : false,
	k = b.vertival || "top",
	s = b.horizontal || "left",
	r = typeof b.autofix != "undefined" ? b.autofix : true,
	j,
	d,
	h = false,
	m = b.onrender || new Function(),
	c = b.onupdate || new Function(),
	l = b.onrelease || new Function();
    if (!u) {
        return
    }
    j = g();
    d = {
        y: p ? (j.position == "static" ? baidu.dom.getPosition(u).top : baidu.dom.getPosition(u).top - baidu.dom.getPosition(u.parentNode).top) : u.offsetTop,
        x: p ? (j.position == "static" ? baidu.dom.getPosition(u).left : baidu.dom.getPosition(u).left - baidu.dom.getPosition(u.parentNode).left) : u.offsetLeft
    };
    baidu.extend(d, b.offset || {});
    r && t();
    function q() {
        return {
            top: k == "top" ? d.y : baidu.page.getViewHeight() - d.y - j.height,
            left: s == "left" ? d.x : baidu.page.getViewWidth() - d.x - j.width
        }
    }
    function n() {
        var v = q();
        u.style.setExpression("left", "eval((document.body.scrollLeft || document.documentElement.scrollLeft) + " + v.left + ") + 'px'");
        u.style.setExpression("top", "eval((document.body.scrollTop || document.documentElement.scrollTop) + " + v.top + ") + 'px'")
    }
    function g() {
        var v = {
            position: baidu.getStyle(u, "position"),
            height: function () {
                var w = baidu.getStyle(u, "height");
                return (w != "auto") ? (/\d+/.exec(w)[0]) : u.offsetHeight
            } (),
            width: function () {
                var x = baidu.getStyle(u, "width");
                return (x != "auto") ? (/\d+/.exec(x)[0]) : u.offsetWidth
            } ()
        };
        e("top", v);
        e("left", v);
        e("bottom", v);
        e("right", v);
        return v
    }
    function e(w, x) {
        var v;
        if (x.position == "static") {
            x[w] = ""
        } else {
            v = baidu.getStyle(u, w);
            if (v == "auto" || v == "0px") {
                x[w] = ""
            } else {
                x[w] = v
            }
        }
    }
    function t() {
        if (h) {
            return
        }
        baidu.setStyles(u, {
            top: "",
            left: "",
            bottom: "",
            right: ""
        });
        if (!p) {
            var v = {
                position: "fixed"
            };
            v[k == "top" ? "top" : "bottom"] = d.y + "px";
            v[s == "left" ? "left" : "right"] = d.x + "px";
            baidu.setStyles(u, v)
        } else {
            baidu.setStyle(u, "position", "absolute");
            n()
        }
        m();
        h = true
    }
    function o() {
        if (!h) {
            return
        }
        var v = {
            position: j.position,
            left: j.left == "" ? "auto" : j.left,
            top: j.top == "" ? "auto" : j.top,
            bottom: j.bottom == "" ? "auto" : j.bottom,
            right: j.right == "" ? "auto" : j.right
        };
        if (p) {
            u.style.removeExpression("left");
            u.style.removeExpression("top")
        }
        baidu.setStyles(u, v);
        l();
        h = false
    }
    function f(v) {
        if (!v) {
            return
        }
        m = v.onrender || m;
        c = v.onupdate || c;
        l = v.onrelease || l;
        k = v.vertival || "top";
        s = v.horizontal || "left";
        baidu.extend(d, v.offset || {});
        c()
    }
    return {
        render: t,
        update: f,
        release: o
    }
};
baidu.ui.Modal = baidu.ui.createUI(function (b) {
    var c = this,
	a = (b && b.container) ? baidu.g(b.container) : null; !a && (a = document.body);
    if (!a.id) {
        a.id = c.getId("container")
    }
    c.containerId = a.id;
    c.styles = {
        color: "#000000",
        opacity: 0.6,
        zIndex: 1000
    }
}).extend({
    uiType: "modal",
    _showing: false,
    getContainer: function () {
        var a = this;
        return baidu.g(a.containerId)
    },
    render: function () {
        var f = this,
		b,
		d,
		e,
		a,
		g = f.containerId,
		c = baidu.g(f.containerId);
        if (b = baidu.ui.Modal.collection[g]) {
            f.mainId = b.mainId;
            a = f.getMain()
        } else {
            a = f.renderMain();
            if (c !== document.body) {
                c.appendChild(a)
            } else {
                d = baidu.dom.fixable(a, {
                    autofix: false,
                    vertival: "top",
                    horizontal: "left",
                    offset: {
                        x: 0,
                        y: 0
                    }
                })
            }
            baidu.ui.Modal.collection[g] = {
                mainId: f.mainId,
                instance: [],
                flash: {},
                fixableInstance: d
            }
        }
        f.dispatchEvent("onload")
    },
    show: function (j) {
        var g = this,
		b = g.getContainer(),
		e = g.getMain(),
		f = g.containerId,
		c = baidu.ui.Modal.collection[f],
		a = c.fixableInstance,
		d = c.instance.length,
		h;
        if (g._showing) {
            return
        }
        if (d > 0) {
            h = baidu.lang.instance(c.instance[d - 1]);
            h && h._removeHandler()
        }
        j = j || {};
        g._show(j.styles || {});
        if (a) {
            a.render()
        }
        e.style.display = "block";
        c.flash[g.guid] = g._hideFlash();
        c.instance.push(g.guid);
        g._showing = true;
        g.dispatchEvent("onshow")
    },
    _show: function (b) {
        var a = this;
        a._getModalStyles(b || {});
        a._update();
        if (a.getContainer() === document.body && baidu.browser.ie && baidu.browser.ie <= 7) {
            a.windowHandler = a.getWindowHandle();
            baidu.on(window, "resize", a.windowHandler)
        }
    },
    hide: function () {
        var a = this;
        a._hide();
        a.dispatchEvent("onhide")
    },
    _hide: function () {
        var g = this,
		b = g.containerId,
		h = baidu.ui.Modal.collection[b],
		c = h.flash[g.guid],
		a = g.getMain(),
		f = h.instance.length,
		e;
        if (!g._showing) {
            return
        }
        for (var d = 0; d < f; d++) {
            if (h.instance[d] == g.guid) {
                h.instance.splice(d, 1);
                break
            }
        }
        f = h.instance.length;
        if (d == f) {
            g._removeHandler();
            if (f > 0) {
                e = baidu.lang.instance(h.instance[f - 1]);
                e && e._show()
            } else {
                a.style.display = "none"
            }
            g._restoreFlash(c)
        } else {
            e = baidu.lang.instance(h.instance[f - 1]);
            h.flash[e.guid] = h.flash[e.guid].concat(c)
        }
        h.flash[g.guid] = [];
        g._showing = false
    },
    _removeHandler: function () {
        var a = this;
        if (a.getContainer() === document.body && baidu.browser.ie && baidu.browser.ie <= 7) {
            baidu.un(window, "resize", a.windowHandler)
        }
    },
    getWindowHandle: function () {
        var b = this,
		a = b.getMain();
        return function () {
            baidu.setStyles(a, {
                width: baidu.page.getViewWidth(),
                height: baidu.page.getViewHeight()
            });
            if (b.getContainer() === document.body && baidu.browser.ie && baidu.browser.ie <= 7) {
                window.top !== window.self && setTimeout(function () {
                    b._getModalStyles({});
                    b._update()
                },
				16)
            }
        }
    },
    update: function (b) {
        b = b || {};
        var c = this,
		a = c.getMain(),
		d = baidu.ui.Modal.collection[c.containerId];
        b = b || {};
        baidu.extend(c, b);
        c._getModalStyles(b.styles || {});
        c._update();
        delete (b.styles);
        baidu.extend(c, b);
        c.dispatchEvent("onupdate")
    },
    _update: function () {
        var b = this,
		a = b.getMain();
        baidu.dom.setStyles(a, b.styles)
    },
    _getModalStyles: function (f) {
        var e = this,
		a = e.getMain(),
		b = e.getContainer(),
		c,
		h,
		d;
        function g(l, k) {
            var j = parseInt(baidu.getStyle(l, k));
            j = isNaN(j) ? 0 : j;
            j = baidu.lang.isNumber(j) ? j : 0;
            return j
        }
        if (b !== document.body) {
            f.width = b.offsetWidth;
            f.height = b.offsetHeight;
            if (baidu.getStyle(b, "position") == "static") {
                d = a.offsetParent || document.body;
                c = baidu.dom.getPosition(d);
                h = baidu.dom.getPosition(b);
                f.top = h.top - c.top + g(d, "marginTop");
                f.left = h.left - c.left + g(d, "marginLeft")
            }
        } else {
            if (baidu.browser.ie > 7 || !baidu.browser.ie) {
                f.width = "100%";
                f.height = "100%"
            } else {
                f.width = baidu.page.getViewWidth();
                f.height = baidu.page.getViewHeight()
            }
        }
        baidu.extend(e.styles, f);
        e.styles.backgroundColor = e.styles.color || e.styles.backgroundColor;
        delete (e.styles.color)
    },
    _hideFlash: function () {
        var c = this,
		b = c.getContainer(),
		d = b.getElementsByTagName("object"),
		a = [];
        baidu.each(d,
		function (f) {
		    var e = true;
		    if (baidu.dom.getAncestorBy(f,
			function (g) {
			    if (baidu.getStyle(g, "zIndex") > c.styles.zIndex) {
			        return true
			    }
			    return false
			})) {
		        return
		    }
		    baidu.each(baidu.dom.children(f),
			function (g) {
			    if (baidu.getAttr(g, "name") == "wmode" && baidu.getAttr(g, "value") != "window") {
			        e = false
			    }
			});
		    if (e) {
		        a.push([f, baidu.getStyle(f, "visibility")]);
		        f.style.visibility = "hidden"
		    }
		});
        return a
    },
    _restoreFlash: function (a) {
        baidu.each(a,
		function (b) {
		    if (b[0] != null) {
		        b[0].style.visibility = b[1]
		    }
		})
    },
    dispose: function () {
        var a = this;
        a._hide();
        a.dispatchEvent("ondispose");
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Modal.collection = {};
baidu.extend(baidu.ui.Modal.prototype, {
    coverable: true,
    coverableOptions: {}
});
baidu.ui.Modal.register(function (a) {
    if (a.coverable) {
        if (!baidu.browser.isWebkit && !baidu.browser.isGecko) {
            a.addEventListener("onload",
			function () {
			    a.Coverable_show()
			});
            a.addEventListeners("onshow,onupdate",
			function () {
			    a.Coverable_update()
			});
            a.addEventListener("onhide",
			function () {
			    a.Coverable_hide()
			})
        }
    }
});
baidu.extend(baidu.ui.Dialog.prototype, {
    modal: true,
    modalColor: "#000000",
    modalOpacity: 0.4,
    hideModal: function () {
        var a = this; (a.modal && a.modalInstance) && a.modalInstance.hide()
    }
});
baidu.ui.Dialog.register(function (a) {
    if (a.modal) {
        a.addEventListener("onopen",
		function () {
		    if (!a.modalInstance) {
		        a.modalInstance = new baidu.ui.Modal({
		            autoRender: true
		        })
		    }
		    a.modalInstance.show({
		        targetUI: a,
		        styles: {
		            color: a.modalColor,
		            opacity: a.modalOpacity,
		            zIndex: a.modalZIndex ? a.modalZIndex : a.zIndex - 1
		        }
		    })
		});
        a.addEventListener("onclose", a.hideModal);
        a.addEventListener("ondispose", a.hideModal)
    }
});
baidu.dom.resizable = function (d, g) {
    var A,
	n,
	j = {},
	c,
	a = {},
	s,
	y,
	v,
	b,
	e,
	l,
	p,
	t = false,
	k = false,
	w = {
	    direction: ["e", "s", "se"],
	    minWidth: 16,
	    minHeight: 16,
	    classPrefix: "tangram",
	    directionHandlePosition: {}
	};
    if (!(A = baidu.dom.g(d)) && baidu.getStyle(A, "position") == "static") {
        return false
    }
    b = A.offsetParent;
    var o = baidu.getStyle(A, "position");
    n = baidu.extend(w, g);
    baidu.each(["minHeight", "minWidth", "maxHeight", "maxWidth"],
	function (B) {
	    n[B] && (n[B] = parseFloat(n[B]))
	});
    s = [n.minWidth || 0, n.maxWidth || Number.MAX_VALUE, n.minHeight || 0, n.maxHeight || Number.MAX_VALUE];
    z();
    function z() {
        l = baidu.extend({
            e: {
                right: "-5px",
                top: "0px",
                width: "7px",
                height: A.offsetHeight
            },
            s: {
                left: "0px",
                bottom: "-5px",
                height: "7px",
                width: A.offsetWidth
            },
            n: {
                left: "0px",
                top: "-5px",
                height: "7px",
                width: A.offsetWidth
            },
            w: {
                left: "-5px",
                top: "0px",
                height: A.offsetHeight,
                width: "7px"
            },
            se: {
                right: "1px",
                bottom: "1px",
                height: "16px",
                width: "16px"
            },
            sw: {
                left: "1px",
                bottom: "1px",
                height: "16px",
                width: "16px"
            },
            ne: {
                right: "1px",
                top: "1px",
                height: "16px",
                width: "16px"
            },
            nw: {
                left: "1px",
                top: "1px",
                height: "16px",
                width: "16px"
            }
        },
		n.directionHandlePosition);
        baidu.each(n.direction,
		function (B) {
		    var C = n.classPrefix.split(" ");
		    C[0] = C[0] + "-resizable-" + B;
		    var E = baidu.dom.create("div", {
		        className: C.join(" ")
		    }),
			D = l[B];
		    D.cursor = B + "-resize";
		    D.position = "absolute";
		    baidu.setStyles(E, D);
		    E.key = B;
		    E.style.MozUserSelect = "none";
		    A.appendChild(E);
		    j[B] = E;
		    baidu.on(E, "mousedown", h)
		});
        t = false
    }
    function f() {
        e && u();
        baidu.object.each(j,
		function (B) {
		    baidu.un(B, "mousedown", h);
		    baidu.dom.remove(B)
		});
        t = true
    }
    function m(B) {
        if (!t) {
            n = baidu.extend(n, B || {});
            f();
            z()
        }
    }
    function h(D) {
        k && u();
        var C = baidu.event.getTarget(D),
		B = C.key;
        e = C;
        k = true;
        if (C.setCapture) {
            C.setCapture()
        } else {
            if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
            }
        }
        v = baidu.getStyle(document.body, "cursor");
        baidu.setStyle(document.body, "cursor", B + "-resize");
        baidu.on(document.body, "mouseup", u);
        baidu.on(document.body, "selectstart", q);
        y = document.body.style.MozUserSelect;
        document.body.style.MozUserSelect = "none";
        var E = baidu.page.getMousePosition();
        a = r();
        p = setInterval(function () {
            x(B, E)
        },
		20);
        baidu.lang.isFunction(n.onresizestart) && n.onresizestart();
        baidu.event.preventDefault(D)
    }
    function u() {
        if (e && e.releaseCapture) {
            e.releaseCapture()
        } else {
            if (window.releaseEvents) {
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP)
            }
        }
        baidu.un(document.body, "mouseup", u);
        baidu.un(document, "selectstart", q);
        document.body.style.MozUserSelect = y;
        baidu.un(document.body, "selectstart", q);
        clearInterval(p);
        baidu.setStyle(document.body, "cursor", v);
        e = null;
        k = false;
        baidu.lang.isFunction(n.onresizeend) && n.onresizeend()
    }
    function x(C, I) {
        var H = baidu.page.getMousePosition(),
		D = a.width,
		B = a.height,
		G = a.top,
		F = a.left,
		E;
        if (C.indexOf("e") >= 0) {
            D = Math.max(H.x - I.x + a.width, s[0]);
            D = Math.min(D, s[1])
        } else {
            if (C.indexOf("w") >= 0) {
                D = Math.max(I.x - H.x + a.width, s[0]);
                D = Math.min(D, s[1]);
                F -= D - a.width
            }
        }
        if (C.indexOf("s") >= 0) {
            B = Math.max(H.y - I.y + a.height, s[2]);
            B = Math.min(B, s[3])
        } else {
            if (C.indexOf("n") >= 0) {
                B = Math.max(I.y - H.y + a.height, s[2]);
                B = Math.min(B, s[3]);
                G -= B - a.height
            }
        }
        E = {
            width: D,
            height: B,
            top: G,
            left: F
        };
        baidu.dom.setOuterHeight(A, B);
        baidu.dom.setOuterWidth(A, D);
        baidu.setStyles(A, {
            top: G,
            left: F
        });
        j.n && baidu.setStyle(j.n, "width", D);
        j.s && baidu.setStyle(j.s, "width", D);
        j.e && baidu.setStyle(j.e, "height", B);
        j.w && baidu.setStyle(j.w, "height", B);
        baidu.lang.isFunction(n.onresize) && n.onresize({
            current: E,
            original: a
        })
    }
    function q(B) {
        return baidu.event.preventDefault(B, false)
    }
    function r() {
        var B = baidu.dom.getPosition(A.offsetParent),
		C = baidu.dom.getPosition(A),
		E,
		D;
        if (o == "absolute") {
            E = C.top - (A.offsetParent == document.body ? 0 : B.top);
            D = C.left - (A.offsetParent == document.body ? 0 : B.left)
        } else {
            E = parseFloat(baidu.getStyle(A, "top")) || -parseFloat(baidu.getStyle(A, "bottom")) || 0;
            D = parseFloat(baidu.getStyle(A, "left")) || -parseFloat(baidu.getStyle(A, "right")) || 0
        }
        baidu.setStyles(A, {
            top: E,
            left: D
        });
        return {
            width: A.offsetWidth,
            height: A.offsetHeight,
            top: E,
            left: D
        }
    }
    return {
        cancel: f,
        update: m,
        enable: z
    }
}; (function () {
    var a = baidu.ui.behavior.resizable = function () { };
    a.resizeableHandle = null;
    a.resizeCreate = function (b) {
        var c = this,
		d;
        b = b || {};
        if (!c.resizable) {
            return
        }
        baidu.object.extend(c, b);
        c._resizeOption = {
            onresizestart: function () {
                c.dispatchEvent("onresizestart")
            },
            onresize: function (e) {
                c.dispatchEvent("onresize", e)
            },
            onresizeend: function () {
                c.dispatchEvent("onresizeend")
            }
        };
        baidu.each(["minWidth", "minHeight", "maxWidth", "maxHeight"],
		function (f, e) {
		    c[f] && (c._resizeOption[f] = c[f])
		});
        c._resizeOption.classPrefix = b.classPrefix || c.classPrefix;
        d = b.target || c.getBody();
        c.direction && (c._resizeOption.direction = c.direction);
        c.resizeableHandle = baidu.dom.resizable(d, c._resizeOption)
    };
    a.resizeUpdate = function (b) {
        this.resizeableHandle.update(b)
    };
    a.resizeCancel = function () {
        this.resizeableHandle.cancel()
    };
    a.resizeEnable = function () {
        this.resizeableHandle.enable()
    }
})();
baidu.extend(baidu.ui.Dialog.prototype, {
    resizable: true,
    minWidth: 100,
    minHeight: 100,
    direction: ["s", "e", "se"]
});
baidu.ui.Dialog.register(function (f) {
    if (f.resizable) {
        var d,
		e,
		b,
		a,
		h,
		g,
		j;
        function c() {
            g = d.offsetWidth;
            j = d.offsetHeight;
            a = e.offsetWidth;
            h = e.offsetHeight
        }
        f.addEventListener("onload",
		function () {
		    d = f.getBody();
		    b = f.getMain();
		    e = f.getContent();
		    c();
		    f.resizeCreate({
		        target: b,
		        classPrefix: f.classPrefix
		    })
		});
        f.addEventListener("onresize",
		function (k) {
		    baidu.dom.setOuterWidth(e, a + k.current.width - k.original.width);
		    baidu.dom.setOuterHeight(e, h + k.current.height - k.original.height);
		    baidu.dom.setOuterWidth(d, g + k.current.width - k.original.width);
		    baidu.dom.setOuterHeight(d, j + k.current.height - k.original.height);
		    f.coverable && f.Coverable_update()
		});
        f.addEventListener("onresizeend",
		function () {
		    c();
		    f.width = a;
		    f.height = h;
		    baidu.setStyles(b, {
		        height: "",
		        width: ""
		    })
		});
        f.addEventListener("onupdate",
		function () {
		    c();
		    f.resizeUpdate()
		});
        f.addEventListener("onopen",
		function () {
		    c();
		    f.resizeUpdate()
		})
    }
});
baidu.ui.Input = baidu.ui.createUI(new Function).extend({
    uiType: "input",
    tplBody: '<input id="#{id}" class="#{class}" value="#{text}" onfocus="#{onfocus}" onblur="#{onblur}" onchange="#{onchange}" onkeydown="#{onkeydown}" onkeyup="#{onkeyup}" onmouseover="#{onmouseover}" onmouseout="#{onmouseout}" />',
    disabled: false,
    getString: function () {
        var a = this;
        return baidu.format(a.tplBody, {
            id: a.getId(),
            onfocus: a.getCallRef() + "._onEventHandle('onfocus', 'focus', event);",
            onblur: a.getCallRef() + "._onEventHandle('onblur', null, event);",
            onchange: a.getCallRef() + "._onEventHandle('onchange', null, event);",
            onkeydown: a.getCallRef() + "._onEventHandle('onkeydown', 'focus', event);",
            onkeyup: a.getCallRef() + "._onEventHandle('onkeyup', 'focus', event);",
            onmouseover: a.getCallRef() + "._onEventHandle('onmouseover', 'hover', event);",
            onmouseout: a.getCallRef() + "._onEventHandle('onmouseout', null, event);",
            text: a.text,
            "class": a.getClass(a.isDisabled() ? "disable" : "")
        })
    },
    render: function (b) {
        if (!baidu.g(b)) {
            return
        }
        var a = this;
        baidu.dom.insertHTML(a.renderMain(b), "beforeEnd", a.getString());
        a.getBody().disabled = a.disabled
    },
    _onEventHandle: function (c, d, a) {
        var b = this;
        if (b.isDisabled()) {
            return
        }
        b._changeStyle(d);
        b.dispatchEvent(c, {
            DOMEvent: a
        })
    },
    _changeStyle: function (c) {
        var b = this,
		a = b.getBody();
        baidu.dom.removeClass(a, b.getClass("hover") + " " + b.getClass("focus") + " " + b.getClass("disable"));
        baidu.addClass(a, b.getClass(c))
    },
    isDisabled: function () {
        return this.disabled
    },
    getText: function () {
        var a = this.getBody().value;
        return a
    },
    _able: function (c, a, d) {
        var b = this;
        b._changeStyle(d);
        b.getBody().disabled = a;
        b.disabled = a;
        b.dispatchEvent(c)
    },
    enable: function () {
        this._able("onenable", false)
    },
    disable: function () {
        this._able("ondisable", true, "disable")
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("ondispose");
        baidu.dom.remove(a.getBody());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.sio = baidu.sio || {};
baidu.sio._createScriptTag = function (b, a, c) {
    b.setAttribute("type", "text/javascript");
    c && b.setAttribute("charset", c);
    b.setAttribute("src", a);
    document.getElementsByTagName("head")[0].appendChild(b)
};
baidu.sio._removeScriptTag = function (b) {
    if (b.clearAttributes) {
        b.clearAttributes()
    } else {
        for (var a in b) {
            if (b.hasOwnProperty(a)) {
                delete b[a]
            }
        }
    }
    if (b && b.parentNode) {
        b.parentNode.removeChild(b)
    }
    b = null
};
baidu.sio.callByBrowser = function (a, g, j) {
    var d = document.createElement("SCRIPT"),
	e = 0,
	k = j || {},
	c = k.charset,
	h = g ||
	function () { },
	f = k.timeOut || 0,
	b;
    d.onload = d.onreadystatechange = function () {
        if (e) {
            return
        }
        var l = d.readyState;
        if ("undefined" == typeof l || l == "loaded" || l == "complete") {
            e = 1;
            try {
                h();
                clearTimeout(b)
            } finally {
                d.onload = d.onreadystatechange = null;
                baidu.sio._removeScriptTag(d)
            }
        }
    };
    if (f) {
        b = setTimeout(function () {
            d.onload = d.onreadystatechange = null;
            baidu.sio._removeScriptTag(d);
            k.onfailure && k.onfailure()
        },
		f)
    }
    baidu.sio._createScriptTag(d, a, c)
};
baidu.sio.callByServer = function (a, n, o) {
    var j = document.createElement("SCRIPT"),
	h = "bd__cbs__",
	l,
	e,
	p = o || {},
	d = p.charset,
	f = p.queryField || "callback",
	m = p.timeOut || 0,
	b,
	c = new RegExp("(\\?|&)" + f + "=([^&]*)"),
	g;
    if (baidu.lang.isFunction(n)) {
        l = h + Math.floor(Math.random() * 2147483648).toString(36);
        window[l] = k(0)
    } else {
        if (baidu.lang.isString(n)) {
            l = n
        } else {
            if (g = c.exec(a)) {
                l = g[2]
            }
        }
    }
    if (m) {
        b = setTimeout(k(1), m)
    }
    a = a.replace(c, "\x241" + f + "=" + l);
    if (a.search(c) < 0) {
        a += (a.indexOf("?") < 0 ? "?" : "&") + f + "=" + l
    }
    baidu.sio._createScriptTag(j, a, d);
    function k(q) {
        return function () {
            try {
                if (q) {
                    p.onfailure && p.onfailure()
                } else {
                    n.apply(window, arguments);
                    clearTimeout(b)
                }
                window[l] = null;
                delete window[l]
            } catch (r) { } finally {
                baidu.sio._removeScriptTag(j)
            }
        }
    }
};
baidu.ui.Login = baidu.ui.createUI(function (a) { },
{
    superClass: baidu.ui.Dialog
}).extend({
    uiType: "login",
    classPrefix: "tangram-dialog",
    loginURL: "http://passport.baidu.com/api/?login&time=&token=&tpl=pp",
    loginJumpURL: window.location.href,
    onLoginSuccess: function (b, a) { },
    onLoginFailure: function (b, a) { },
    loginContainerId: "loginContainer",
    loginPanelId: "loginPanel",
    tplContainer: '        <div id="content" class="passport-content">            <div id="#{idLoginPanel}" class="passport-login-panel">             <div id="#{idLoginContainer}"></div>             <div id="regDiv">                    <hr size="0" style="border-top:1px solid #AAAAAA">                    <div class="reg">没有百度账号？<a href="https://passport.baidu.com/?reg&tpl=mn" target="_self">立即注册百度账号</a></div>                </div>            </div>        </div>           ',
    getString: function () {
        var c = this,
		a,
		e = "title",
		d = "title-inner",
		b = "content",
		f = "footer";
        c.contentText = c.contentText || baidu.string.format(c.tplContainer, {
            idLoginContainer: c.loginContainerId,
            idLoginPanel: c.loginPanelId
        });
        return baidu.format(c.tplDOM, {
            id: c.getId(),
            "class": c.getClass(),
            title: baidu.format(c.tplTitle, {
                id: c.getId(e),
                "class": c.getClass(e),
                "inner-id": c.getId(d),
                "inner-class": c.getClass(d),
                content: c.titleText || ""
            }),
            content: baidu.format(c.tplContent, {
                id: c.getId(b),
                "class": c.getClass(b),
                content: c.contentText || ""
            }),
            footer: baidu.format(c.tplFooter, {
                id: c.getId(f),
                "class": c.getClass(f)
            })
        })
    },
    open: function () {
        var a = this;
        a.renderLogin();
        a.dispatchEvent("onopen")
    },
    close: function () {
        var a = this;
        a.loginJson = a.regJson = null;
        if (a.dispatchEvent("onbeforeclose")) {
            a.getMain().style.marginLeft = "-100000px";
            baidu.ui.Login.instances[a.guid] = "hide";
            a.dispatchEvent("onclose")
        }
    },
    renderLogin: function () {
        var me = this;
        if (me.loginJson) {
            return
        }
        baidu.sio.callByServer(me.loginURL,
		function (value) {
		    var json = me.loginJson = eval(value);
		    baidu.sio.callByBrowser(json.jslink,
			function (value) {
			    baidu.ui.Dialog.prototype.open.call(me);
			    me.loginDom = bdPass.LoginTemplate.render(json, me.loginContainerId, {
			        renderSafeflg: true,
			        onSuccess: me.onLoginSuccess,
			        jumpUrl: me.loginJumpURL,
			        onFailure: me.onLoginFailure
			    });
			    me.update()
			})
		})
    },
    dispose: function () {
        var a = this;
        delete baidu.ui.Login.instances[a.guid];
        a.dispatchEvent("dispose");
        baidu.un(window, "resize", a.windowResizeHandler);
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Login.instances = baidu.ui.Login.instances || {};
baidu.extend(baidu.ui.Login.prototype, {
    regPanelId: "regPanel",
    regContainerId: "regContainer",
    defaultStatus: "login",
    tabId: "navTab",
    currentTabClass: "act",
    registerText: "",
    register: true,
    regURL: "http://passport.baidu.com/api/?reg&time=&token=&tpl=pp",
    regJumpURL: window.location.href,
    tplContainer: '  <div id="nav" class="passport-nav">   <ul id="#{tabId}" class="passport-nav-tab">    <li class="#{currentTabClass}" ><a href="##{idLoginPanel}" onclick="#{clickTabLogin};return false;" hidefocus="true" >登录</a></li>    <li><a href="##{idRegPanel}" onclick="#{clickTabReg};return false;" hidefocus="true" >注册</a></li>   </ul>    <p class="clear"></p>  </div>   <div id="content" class="passport-content">   <div id="#{idLoginPanel}" class="passport-login-panel">    <div id="#{idLoginContainer}"></div>    <div id="regDiv">     <hr size="0" style="border-top:1px solid #AAAAAA">     <div class="reg">没有百度账号？<a href="##{idRegPanel}" onclick="#{clickTabReg};return false;">立即注册百度账号</a></div>    </div>   </div>  <div id="#{idRegPanel}" class="passport-reg-panel" style="display:none">   <div id="#{idRegContainer}" class="passport-reg-container"></div>  </div>  </div>',
    onRegisterSuccess: function (b, a) { },
    onRegisterFailure: function (b, a) { },
    getString: function () {
        var c = this,
		a,
		e = "title",
		d = "title-inner",
		b = "content",
		f = "footer";
        c.contentText = c.contentText || baidu.string.format(c.tplContainer, {
            clickTabLogin: c.getCallRef() + ".changeTab('login')",
            clickTabReg: c.getCallRef() + ".changeTab('reg')",
            idLoginContainer: c.loginContainerId,
            idRegContainer: c.regContainerId,
            idLoginPanel: c.loginPanelId,
            idRegPanel: c.regPanelId,
            tabId: c.tabId,
            currentTabClass: c.currentTabClass
        });
        return baidu.format(c.tplDOM, {
            id: c.getId(),
            "class": c.getClass(),
            title: baidu.format(c.tplTitle, {
                id: c.getId(e),
                "class": c.getClass(e),
                "inner-id": c.getId(d),
                "inner-class": c.getClass(d),
                content: c.titleText || ""
            }),
            content: baidu.format(c.tplContent, {
                id: c.getId(b),
                "class": c.getClass(b),
                content: c.contentText || ""
            }),
            footer: baidu.format(c.tplFooter, {
                id: c.getId(f),
                "class": c.getClass(f)
            })
        })
    },
    open: function () {
        var a = this; (a.defaultStatus == "login") ? a.renderLogin() : a.changeTab("reg");
        a.dispatchEvent("onopen")
    },
    changeTab: function (f) {
        var g = this,
		a = [g.loginPanelId, g.regPanelId],
		d = baidu.dom.children(g.tabId),
		e = g.currentTabClass,
		c = (f == "login") ? 0 : 1;
        for (var b = 0; b < a.length; ++b) {
            baidu.dom.removeClass(d[b], e);
            baidu.g(a[b]).style.display = "none"
        }
        baidu.dom.addClass(d[c], e);
        baidu.g(a[c]).style.display = ""; (f == "reg") ? g.renderReg() : g.renderLogin()
    },
    renderReg: function () {
        var me = this;
        if (me.regJson) {
            return
        }
        baidu.sio.callByServer(me.regURL,
		function (value) {
		    var json = me.regJson = eval(value);
		    baidu.sio.callByBrowser(json.jslink,
			function (value) {
			    baidu.ui.Dialog.prototype.open.call(me);
			    me.registerDom = bdPass.RegTemplate.render(json, me.regContainerId, {
			        renderSafeflg: true,
			        onSuccess: me.onRegisterSuccess,
			        jumpUrl: me.regJumpURL,
			        onFailure: me.onRegisterFailure
			    });
			    me.update()
			})
		})
    }
});
//baidu.ui.Menubar.extend({
//    enableFx: true,
//    showFx: baidu.fx.expand,
//    showFxOptions: {
//        duration: 200
//    },
//    hideFx: baidu.fx.collapse,
//    hideFxOptions: {
//        duration: 500,
//        restoreAfterFinish: true
//    }
//});
baidu.ui.Menubar.register(function (a) {
    if (a.enableFx) {
        var b = null;
        a.addEventListener("onopen",
		function () {
		    !baidu.ui.Menubar.showing && "function" == typeof a.showFx && a.showFx(baidu.g(a.getId()), a.showFxOptions)
		});
        a.addEventListener("onbeforeclose",
		function (c) {
		    a.dispatchEvent("onclose");
		    b = a.hideFx(baidu.g(a.getId()), a.hideFxOptions);
		    b.addEventListener("onafterfinish",
			function () {
			    a._close()
			});
		    c.returnValue = false
		});
        a.addEventListener("ondispose",
		function () {
		    b && b.end()
		})
    }
});
baidu.ui.Menubar.extend({
//    type: "hover",
//    showDelay: 100,
//    hideDelay: 500,
//    targetHover: function () {
//        var a = this;
//        clearTimeout(a.hideHandler);
//        a.showHandler = setTimeout(function () {
//            a.open()
//        },
//		a.showDelay)
//    },
//    targetMouseOut: function () {
//        var a = this;
//        clearTimeout(a.showHandler);
//        clearTimeout(a.hideHandler);
//        a.hideHandler = setTimeout(function () {
//            a.close()
//        },
//		a.hideDelay)
//    },
//    clearHideHandler: function () {
//        clearTimeout(this.hideHandler)
//    }
});
baidu.ui.Menubar.register(function (a) {
    //    a.targetHoverHandler = baidu.fn.bind("targetHover", a);
    //    a.targetMouseOutHandler = baidu.fn.bind("targetMouseOut", a);
    //    a.clearHandler = baidu.fn.bind("clearHideHandler", a);
    //    if (a.type == "hover") {
    //        a.addEventListener("onload",
    //		function () {
    //		    var b = a.getTarget();
    //		    if (b) {
    //		        baidu.on(b, "mouseover", a.targetHoverHandler);
    //		        baidu.on(document, "click", a.targetMouseOutHandler)
    //		    }
    //		});
    //        a.addEventListener("onopen",
    //		function () {
    //		    var c = a.getTarget(),
    //			b = a.getBody();
    //		    if (c) {
    //		        baidu.on(b, "mouseover", a.clearHandler);
    //		        baidu.on(c, "mouseout", a.targetMouseOutHandler);
    //		        baidu.on(b, "mouseout", a.targetMouseOutHandler)
    //		    }
    //		});
    //        a.addEventListener("ondispose",
    //		function () {
    //		    var c = a.getTarget(),
    //			b = a.getBody();
    //		    if (c) {
    //		        baidu.un(c, "mouseover", a.targetHoverHandler);
    //		        baidu.un(c, "mouseout", a.targetMouseOutHandler);
    //		        baidu.un(document, "click", a.targetMouseOutHandler)
    //		    }
    //		    if (b) {
    //		        baidu.un(b, "mouseover", a.clearHandler);
    //		        baidu.un(b, "mouseout", a.targetMouseOutHandler)
    //		    }
    //		})
    //    }
});
baidu.ui.Menubar.extend({
    tplIcon: '<span class="#{icon}" style="#{iconStyle};"></span>',
    updateIcons: function () {
        var a = this;
        baidu.object.each(a.items,
		function (c, b) {
		    if (a.getItem(b)) {
		        baidu.dom.insertHTML(a.getItem(b), "afterBegin", baidu.string.format(a.tplIcon, {
		            icon: a.getClass("icon"),
		            iconStyle: c.icon ? ("background-position:" + c.icon) : "background-image:none"
		        }))
		    }
		})
    }
});
baidu.ui.Menubar.register(function (a) {
    a.addEventListener("onupdate", a.updateIcons)
});
baidu.event.EventArg = function (c, e) {
    e = e || window;
    c = c || e.event;
    var d = e.document;
    this.target = (c.target) || c.srcElement;
    this.keyCode = c.which || c.keyCode;
    for (var a in c) {
        var b = c[a];
        if ("function" != typeof b) {
            this[a] = b
        }
    }
    if (!this.pageX && this.pageX !== 0) {
        this.pageX = (c.clientX || 0) + (d.documentElement.scrollLeft || d.body.scrollLeft);
        this.pageY = (c.clientY || 0) + (d.documentElement.scrollTop || d.body.scrollTop)
    }
    this._event = c
};
baidu.event.EventArg.prototype.preventDefault = function () {
    if (this._event.preventDefault) {
        this._event.preventDefault()
    } else {
        this._event.returnValue = false
    }
    return this
};
baidu.event.EventArg.prototype.stopPropagation = function () {
    if (this._event.stopPropagation) {
        this._event.stopPropagation()
    } else {
        this._event.cancelBubble = true
    }
    return this
};
baidu.event.EventArg.prototype.stop = function () {
    return this.stopPropagation().preventDefault()
};
baidu.event.get = function (a, b) {
    return new baidu.event.EventArg(a, b)
};
baidu.ui.Pager = baidu.ui.createUI(function (a) {
    this._init.apply(this, arguments)
}).extend({
    uiType: "pager",
    id: "pager",
    tplHref: "##{page}",
    tplLabel: "[#{page}]",
    specialLabelMap: {
        first: "首页",
        last: "尾页",
        previous: "上一页",
        next: "下一页"
    },
    tplCurrentLabel: "#{page}",
    tplItem: '<a class="#{class}" page="#{page}" target="_self" href="#{href}">#{label}</a>',
    tplBody: '<div onclick="#{onclick}" id="#{id}" class="#{class}">#{items}</div>',
    beginPage: 1,
    endPage: 100,
    itemCount: 10,
    leftItemCount: 4,
    _init: function (a) {
        var b = this;
        b.update()
    },
    update: function (a) {
        var b = this;
        a = a || {};
        if (b.checkOptions(a)) {
            if (a.hasOwnProperty("currentPage") && a.currentPage != b.currentPage) {
                if (!b._notifyGotoPage(a.currentPage, false)) {
                    delete a.currentPage
                }
            }
            b._updateNoCheck(a);
            return true
        }
        return false
    },
    _updateNoCheck: function (a) {
        var b = this;
        baidu.object.extend(b, a);
        if (b.getMain()) {
            b._refresh()
        }
    },
    checkOptions: function (b) {
        var d = this;
        var c = b.beginPage || d.beginPage;
        var a = b.endPage || d.endPage;
        if (a <= c) {
            return false
        }
        if (b.hasOwnProperty("beginPage") && d.currentPage < c) {
            d.currentPage = c
        }
        if (b.hasOwnProperty("endPage") && d.currentPage >= a) {
            d.currentPage = a - 1
        }
        var e = b.currentPage || d.currentPage;
        if (e < c || e >= a) {
            return false
        }
        return true
    },
    _genItem: function (c, a) {
        var b = this;
        return baidu.string.format(b.tplItem, {
            "class": a ? b.getClass(a) : "",
            page: c,
            href: baidu.string.format(b.tplHref, {
                page: c
            }),
            label: function () {
                return (a ? (a == "current" ? baidu.string.format(b.tplCurrentLabel, {
                    page: c
                }) : b.specialLabelMap[a]) : baidu.string.format(b.tplLabel, {
                    page: c
                }))
            }
        })
    },
    _genBody: function () {
        var h = this,
		a = h.beginPage,
		c = h.endPage,
		f = h.currentPage,
		k = Math.min(Math.max(c - a + 1, 1), h.itemCount),
		j = Math.min(f - a, h.leftItemCount),
		j = Math.max(k - (c + 1 - f), j),
		e = f - j,
		b = {
		    first: a,
		    last: c,
		    previous: f - 1,
		    next: f + 1
		},
		l = {};
        baidu.object.each(b,
		function (o, n) {
		    l[n] = h._genItem(o, n)
		});
        l.previous = b.previous < a ? "" : l.previous;
        l.next = b.next > c ? "" : l.next;
        l.first = e == a ? "" : l.first;
        l.last = e + k > c ? "" : l.last;
        var m = [];
        for (var d = 0; d < k; d++) {
            var g = e + d;
            m[d] = h._genItem(g, g == f ? "current" : null)
        }
        return baidu.string.format(h.tplBody, {
            id: h.getId(),
            "class": h.getClass(),
            items: l.first + l.previous + m.join("") + l.next + l.last,
            onclick: h.getCallRef() + "._handleOnClick(event, this);"
        })
    },
    _refresh: function () {
        var a = this;
        a.getMain().innerHTML = a.getString()
    },
    _handleOnClick: function (a) {
        a = baidu.event.get(a);
        var c = this,
		b = a.target,
		d = Number(b.getAttribute("page"));
        if (d && c._notifyGotoPage(d, true)) {
            c._updateNoCheck({
                currentPage: d
            })
        } else {
            a.preventDefault()
        }
    },
    _notifyGotoPage: function (a, b) {
        return this.dispatchEvent("ongotopage", {
            page: a,
            fromClick: b
        })
    },
    ongotopage: function (a) { },
    getString: function () {
        var a = this;
        if (a.currentPage === undefined) {
            a.currentPage = a.beginPage
        }
        return a._genBody()
    },
    render: function (a) {
        var b = this;
        b.renderMain(a);
        b.getMain().innerHTML = b.getString();
        b.update();
        b.dispatchEvent("onload")
    },
    dispose: function () {
        var c = this;
        c.dispatchEvent("ondispose");
        if (c.getMain()) {
            var a = c.getMain();
            baidu.event.un(a, "click", c._handleOnClick);
            if (a.parentNode && a.parentNode.nodeType == 1) {
                a.parentNode.removeChild(a)
            }
            c.dispose = null;
            a = null;
            baidu.lang.Class.prototype.dispose.call(c)
        } else {
            c.addEventListener("onload",
			function b() {
			    c.removeEventListener("onload", b);
			    c.dispose()
			})
        }
    }
});
baidu.ui.ProgressBar = baidu.ui.createUI(function (a) { }).extend({
    uiType: "progressBar",
    tplBody: '<div id="#{id}" class="#{class}">#{bar}</div>',
    tplBar: '<div id="#{barId}" class="#{barClass}"></div>',
    value: 0,
    layout: "horizontal",
    _min: 0,
    _max: 100,
    axis: {
        horizontal: {
            offsetSize: "offsetWidth",
            size: "width"
        },
        vertical: {
            offsetSize: "offsetHeight",
            size: "height"
        }
    },
    getString: function () {
        var a = this;
        return baidu.format(a.tplBody, {
            id: a.getId(),
            "class": a.getClass(),
            bar: baidu.format(a.tplBar, {
                barId: a.getId("bar"),
                barClass: a.getClass("bar")
            })
        })
    },
    render: function (c) {
        var b = this,
		a;
        if (!c) {
            return
        }
        baidu.dom.insertHTML(b.renderMain(c), "beforeEnd", b.getString());
        b.dispatchEvent("onload");
        b.update()
    },
    update: function (b) {
        var c = this;
        b = b || {};
        baidu.object.extend(c, b);
        c.value = Math.max(Math.min(c.value, c._max), c._min);
        if (c.value == c._lastValue) {
            return
        }
        var a = c.axis[c.layout].size;
        baidu.dom.setStyle(c.getBar(), a, c._calcPos(c.value));
        c._lastValue = c.value;
        c.dispatchEvent("update")
    },
    getValue: function () {
        var a = this;
        return a.value
    },
    _calcPos: function (c) {
        var b = this;
        var a = b.getBody()[b.axis[b.layout].offsetSize];
        return c * (a) / (b._max - b._min)
    },
    disable: function () {
        this.disabled = true
    },
    enable: function () {
        this.disabled = false
    },
    getTarget: function () {
        return baidu.g(this.targetId)
    },
    getBar: function () {
        return baidu.g(this.getId("bar"))
    },
    dispose: function () {
        var a = this;
        baidu.dom.remove(a.getId())
    }
});
baidu.ui.ScrollBar = baidu.ui.createUI(function (a) {
    var b = this;
    b._scrollBarSize = {
        width: 0,
        height: 0
    }
}).extend({
    uiType: "scrollbar",
    tplDOM: '<div id="#{id}" class="#{class}"></div>',
    tplThumb: '<div class="#{prev}"></div><div class="#{track}"></div><div class="#{next}"></div>',
    value: 0,
    dimension: 10,
    orientation: "vertical",
    step: 5,
    _axis: {
        horizontal: {
            size: "width",
            unSize: "height",
            offsetSize: "offsetWidth",
            unOffsetSize: "offsetHeight",
            clientSize: "clientWidth",
            scrollPos: "scrollLeft",
            scrollSize: "scrollWidth"
        },
        vertical: {
            size: "height",
            unSize: "width",
            offsetSize: "offsetHeight",
            unOffsetSize: "offsetWidth",
            clientSize: "clientHeight",
            scrollPos: "scrollTop",
            scrollSize: "scrollHeight"
        }
    },
    getThumbString: function () {
        var a = this;
        return baidu.string.format(a.tplThumb, {
            prev: a.getClass("thumb-prev"),
            track: a.getClass("thumb-track"),
            next: a.getClass("thumb-next")
        })
    },
    render: function (b) {
        var a = this;
        if (!b || a.getMain()) {
            return
        }
        baidu.dom.insertHTML(a.renderMain(b), "beforeEnd", baidu.string.format(a.tplDOM, {
            id: a.getId(),
            "class": a.getClass()
        }));
        a._renderUI();
        a.dispatchEvent("load")
    },
    _renderUI: function () {
        var h = this,
		e = h._axis[h.orientation],
		a = h.getBody(),
		g,
		f,
		d;
        function b(j) {
            return {
                classPrefix: h.classPrefix + "-" + j,
                skin: h.skin ? h.skin + "-" + j : "",
                poll: {
                    time: 4
                },
                onmousedown: function () {
                    h._basicScroll(j)
                },
                element: a,
                autoRender: true
            }
        }
        g = h._prev = new baidu.ui.Button(b("prev"));
        baidu.dom.insertHTML(a, "beforeEnd", baidu.string.format(h.tplDOM, {
            id: h.getId("track"),
            "class": h.getClass("track")
        }));
        d = h._next = new baidu.ui.Button(b("next"));
        function c(j) {
            h.dispatchEvent("scroll", {
                value: Math.round(j.target.getValue())
            })
        }
        f = h._slider = new baidu.ui.Slider({
            classPrefix: h.classPrefix + "-slider",
            skin: h.skin ? h.skin + "-slider" : "",
            layout: h.orientation,
            onslide: c,
            onslideclick: c,
            element: baidu.dom.g(h.getId("track")),
            autoRender: true
        });
        h._scrollBarSize[e.unSize] = d.getBody()[e.unOffsetSize];
        h._thumbButton = new baidu.ui.Button({
            classPrefix: h.classPrefix + "-thumb-btn",
            skin: h.skin ? h.skin + "-thumb-btn" : "",
            content: h.getThumbString(),
            capture: true,
            element: f.getThumb(),
            autoRender: true
        });
        h.flushUI(h.value, h.dimension);
        h._registMouseWheelEvt(h.getMain())
    },
    flushUI: function (j, e) {
        var h = this,
		d = h._axis[h.orientation],
		g = h._prev.getBody()[d.offsetSize] + h._next.getBody()[d.offsetSize],
		f = h.getBody(),
		b = h._slider,
		a = b.getThumb(),
		c;
        baidu.dom.hide(f);
        c = h.getMain()[d.clientSize];
        h._scrollBarSize[d.size] = (c <= 0) ? g : c;
        b.getMain().style[d.size] = (c <= 0 ? 0 : c - g) + "px";
        a.style[d.size] = Math.max(Math.min(e, 100), 0) + "%";
        baidu.dom.show(f);
        h._scrollTo(j)
    },
    _scrollTo: function (a) {
        this._slider.update({
            value: a
        })
    },
    scrollTo: function (b) {
        var a = this;
        a._scrollTo(b);
        a.dispatchEvent("scroll", {
            value: b
        })
    },
    _basicScroll: function (b) {
        var a = this;
        a.scrollTo(Math.round(a._slider.getValue()) + (b == "prev" ? -a.step : a.step))
    },
    _onMouseWheelHandler: function (a) {
        var c = this,
		d = c.target,
		a = a || window.event,
		b = a.detail || -a.wheelDelta;
        baidu.event.preventDefault(a);
        c._basicScroll(b > 0 ? "next" : "prev")
    },
    _registMouseWheelEvt: function (c) {
        var b = this,
		d = function () {
		    var e = navigator.userAgent.toLowerCase(),
			f = /(webkit)/.exec(e) || /(opera)/.exec(e) || /(msie)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)/.exec(e) || [];
		    return f[1] == "mozilla" ? "DOMMouseScroll" : "mousewheel"
		},
		a = b._mouseWheelEvent = {
		    target: c,
		    evtName: d(),
		    handler: baidu.fn.bind("_onMouseWheelHandler", b)
		};
        baidu.event.on(a.target, a.evtName, a.handler)
    },
    _cancelMouseWheelEvt: function () {
        var a = this._mouseWheelEvent;
        if (!a) {
            return
        }
        baidu.event.un(a.target, a.evtName, a.handler);
        this._mouseWheelEvent = null
    },
    setVisible: function (a) {
        this.getMain().style.display = a ? "" : "none"
    },
    isVisible: function () {
        return this.getMain().style.display != "none"
    },
    getSize: function () {
        return this._scrollBarSize
    },
    update: function (a) {
        var b = this;
        b.dispatchEvent("beforeupdate");
        baidu.object.extend(b, a);
        b.flushUI(b.value, b.dimension);
        b.dispatchEvent("update")
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("dispose");
        a._cancelMouseWheelEvt();
        a._prev.dispose();
        a._thumbButton.dispose();
        a._slider.dispose();
        a._next.dispose();
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.ScrollBar.register(function (a) {
    if (!a.container) {
        return
    }
    a.addEventListeners({
        load: function () {
            a.update();
            if (a.orientation == "vertical") {
                a._registMouseWheelEvt(a.getContainer())
            }
        },
        beforeupdate: function () {
            var b = this;
            axis = b._axis[b.orientation],
			container = b.getContainer();
            if (!container) {
                return
            }
            b.dimension = Math.round(container[axis.clientSize] / container[axis.scrollSize] * 100);
            b.value = container[axis.scrollSize] - container[axis.clientSize];
            b.value > 0 && (b.value = Math.round(container[axis.scrollPos] / (container[axis.scrollSize] - container[axis.clientSize]) * 100))
        },
        scroll: function (c) {
            var b = a.getContainer(),
			d = a._axis[a.orientation];
            b[d.scrollPos] = c.value / 100 * (b[d.scrollSize] - b[d.clientSize])
        }
    })
});
baidu.object.extend(baidu.ui.ScrollBar.prototype, {
    getContainer: function () {
        return baidu.dom.g(this.container)
    }
});
baidu.dom._styleFixer["float"] = baidu.browser.ie ? "styleFloat" : "cssFloat";
baidu.ui.ScrollPanel = baidu.ui.createUI(function (a) { }).extend({
    uiType: "scrollpanel",
    tplDOM: '<div id="#{id}" class="#{class}">#{body}</div>',
    overflow: "auto",
    _scrollBarSize: 0,
    _yVisible: false,
    _xVisible: false,
    _axis: {
        y: {
            size: "height",
            unSize: "width",
            unScrollSize: "scrollWidth",
            unClientSize: "clientWidth",
            offsetSize: "offsetHeight",
            unOffsetSize: "offsetWidth"
        },
        x: {
            size: "width",
            unSize: "height",
            unScrollSize: "scrollHeight",
            unClientSize: "clientHeight",
            offsetSize: "offsetWidth",
            unOffsetSize: "offsetHeight"
        }
    },
    getString: function () {
        var a = this,
		b = baidu.string.format(a.tplDOM, {
		    id: a.getId("panel"),
		    "class": a.getClass("panel")
		});
        b = baidu.string.format(a.tplDOM, {
            id: a.getId(),
            "class": a.getClass(),
            body: b
        });
        return baidu.string.format(a.tplDOM, {
            id: a.getId("main"),
            "class": a.getClass("main"),
            body: b
        })
    },
    render: function (b) {
        var a = this;
        a.target = b;
        if (!b || a.getMain()) {
            return
        }
        baidu.dom.insertHTML(a.getTarget(), "afterEnd", a.getString());
        a.renderMain(a.getId("main"));
        a._renderUI();
        a.dispatchEvent("onload")
    },
    _renderUI: function () {
        var c = this,
		a = c.getMain(),
		b = c.getPanel(),
		f = c.getTarget(),
		e = c.skin || "";
        a.style.width = f.offsetWidth + "px";
        a.style.height = f.offsetHeight + "px";
        b.appendChild(f);
        function d(l) {
            var h = c.getId("overflow-" + l),
			j = c._axis[l],
			g = c.getPanel(),
			k;
            baidu.dom.insertHTML(g, (l == "y" ? "afterEnd" : "beforeEnd"), baidu.string.format(c.tplDOM, {
                id: h,
                "class": c.getClass("overflow-" + l)
            }));
            h = baidu.dom.g(h);
            if ("y" == l) {
                baidu.dom.setStyle(g, "float", "left");
                baidu.dom.setStyle(h, "float", "left")
            }
            c["_" + l + "Visible"] = true;
            k = c["_" + l + "Scrollbar"] = new baidu.ui.ScrollBar({
                skin: e + "scrollbar-" + l,
                orientation: l == "y" ? "vertical" : "horizontal",
                container: c.container,
                element: h,
                autoRender: true
            });
            h.style[j.unSize] = k.getSize()[j.unSize] + "px";
            c._scrollBarSize = k.getSize()[j.unSize];
            k.setVisible(false)
        }
        if (c.overflow == "overflow-y" || c.overflow == "auto") {
            d("y")
        }
        if (c.overflow == "overflow-x" || c.overflow == "auto") {
            d("x")
        }
        c._smartVisible()
    },
    _smartVisible: function () {
        var b = this,
		a = {
		    yshow: false,
		    xshow: false
		};
        if (!b.getContainer()) {
            return
        }
        function c(g) {
            var j = b._axis[g],
			k = b["_" + g + "Scrollbar"],
			f = b.getContainer(),
			h = {};
            if (!k || !k.isVisible()) {
                f.style[j.unSize] = f[j.unClientSize] - b._scrollBarSize + "px"
            }
            h[j.unSize] = f[j.unClientSize];
            h["scroll" + j.unSize] = f[j.unScrollSize];
            return h
        }
        function e(g, h) {
            var j = b._axis[g],
			f = b.getContainer();
            if (!b["_" + g + "Visible"] || !h[g + "show"] || !b["_" + g + "Scrollbar"]) {
                f.style[j.unSize] = f[j.unClientSize] + b._scrollBarSize + "px"
            }
        }
        function d(g, j) {
            var k = b._axis[g],
			f = b.getContainer(),
			l = b["_" + g + "Scrollbar"],
			h = j[g + "show"];
            if (l) {
                l.getMain().style[k.size] = f[k.offsetSize] + "px";
                l.setVisible(b["_" + g + "Visible"] ? h : false);
                l.update()
            }
        }
        baidu.object.extend(a, c("y"));
        baidu.object.extend(a, c("x"));
        if (a.scrollwidth <= a.width + b._scrollBarSize && a.scrollheight <= a.height + b._scrollBarSize) {
            a.yshow = a.xshow = false
        } else {
            if (a.scrollwidth <= a.width && a.scrollheight > a.height + b._scrollBarSize) {
                a.yshow = true;
                a.xshow = false
            } else {
                if (a.scrollwidth > a.width + b._scrollBarSize && a.scrollheight <= a.height) {
                    a.yshow = false;
                    a.xshow = true
                } else {
                    a.yshow = a.xshow = true
                }
            }
        }
        e("y", a);
        e("x", a);
        d("y", a);
        d("x", a)
    },
    setVisible: function (b, c) {
        var a = this;
        if (c) {
            a["_" + c + "Visible"] = b
        } else {
            a._yVisible = a._xVisible = b
        }
        a._smartVisible()
    },
    isVisible: function (b) {
        var a = this;
        return a["_" + b + "Visible"]
    },
    getScrollBar: function (c) {
        var b = this,
		a = c ? b["_" + c + "Scrollbar"] : null;
        if (!a) {
            a = (b._yScrollbar && b._xScrollbar) ? [b._yScrollbar, b._xScrollbar] : (b._yScrollbar || b._xScrollbar)
        }
        return a
    },
    update: function (a) {
        var b = this;
        baidu.object.extend(b, a);
        b._smartVisible()
    },
    getPanel: function () {
        return baidu.dom.g(this.getId("panel"))
    },
    getTarget: function () {
        return baidu.dom.g(this.target)
    },
    getContainer: function () {
        return baidu.dom.g(this.container)
    },
    dispose: function () {
        var b = this,
		a = b._yScrollbar,
		c = b._xScrollbar;
        b.dispatchEvent("dispose");
        b.setVisible(false);
        b.getMain().parentNode.insertBefore(b.getTarget(), b.getMain());
        if (a) {
            a.dispose()
        }
        if (c) {
            c.dispose()
        }
        baidu.dom.remove(b.getMain());
        baidu.lang.Class.prototype.dispose.call(b)
    }
});
baidu.ui.ScrollPanel.register(function (a) {
    if (!a.adaptive) {
        return
    }
    a.addEventListener("onload",
	function () {
	    var c = 20,
		b = a.getContainer(),
		d = {
		    w: b.clientWidth,
		    h: b.clientHeight
		},
		e = setInterval(function () {
		    var f = a.getContainer(),
			j = d,
			h;
		    if (j.w == f.clientWidth && j.h == f.clientHeight) {
		        return
		    }
		    h = d = {
		        w: f.clientWidth,
		        h: f.clientHeight
		    };
		    function g(k) {
		        var m = a["_" + k + "Scrollbar"],
				l = a._axis[k],
				o = m ? m.isVisible() : false,
				n = a.getMain()[l.unClientSize] - a.getContainer()[l.unOffsetSize];
		        return (o && n == a._scrollBarSize) || (!o && n == 0)
		    }
		    if (g("y") && g("x")) {
		        return
		    }
		    a.flushBounds()
		},
		c);
	    a.addEventListener("dispose",
		function () {
		    clearInterval(e)
		})
	})
});
baidu.ui.ScrollPanel.extend({
    adaptive: true,
    flushBounds: function (d) {
        var c = this,
		a = c.getMain(),
		b = c.getContainer(),
		e = {
		    y: c._yVisible,
		    x: c._xVisible
		},
		f = {
		    w: d && baidu.lang.isNumber(d.width) ? d.width : b.clientWidth,
		    h: d && baidu.lang.isNumber(d.height) ? d.height : b.clientHeight
		};
        c.setVisible(false);
        b.style.width = f.w + "px";
        b.style.height = f.h + "px";
        a.style.width = b.offsetWidth + "px";
        a.style.height = b.offsetHeight + "px";
        c._yVisible = e.y;
        c._xVisible = e.x;
        c._smartVisible()
    }
});
baidu.ui.Slider.register(function (a) {
    a.addEventListener("load",
	function () {
	    baidu.dom.insertHTML(a.getThumb(), "beforeBegin", a.getProgressBarString());
	    a.progressBar = new baidu.ui.ProgressBar({
	        layout: a.layout,
	        skin: a.skin ? a.skin + "-followProgressbar" : null
	    });
	    a.progressBar.render(a.getId("progressbar"));
	    a._adjustProgressbar();
	    a.addEventListener("dispose",
		function () {
		    a.progressBar.dispose()
		})
	});
    a.addEventListeners("slide, slideclick, update",
	function () {
	    a._adjustProgressbar()
	})
});
baidu.ui.Slider.extend({
    tplProgressbar: "<div id='#{rsid}' class='#{class}' style='position:absolute; left:0px; top:0px;'></div>",
    getProgressBarString: function () {
        var a = this;
        return baidu.string.format(a.tplProgressbar, {
            rsid: a.getId("progressbar"),
            "class": a.getClass("progressbar")
        })
    },
    _adjustProgressbar: function () {
        var e = this,
		d = e.layout,
		b = e._axis[d],
		a = e.getThumb(),
		c = parseInt(a.style[b.pos], 10);
        if (!e.progressBar) {
            return
        }
        e.progressBar.getBar().style[e.progressBar.axis[d].size] = (isNaN(c) ? 0 : c) + a[b.offsetSize] / 2 + "px"
    }
});
baidu.ui.StarRate = baidu.ui.createUI(function (a) {
    var b = this;
    b.element = null
}).extend({
    uiType: "starRate",
    total: 5,
    current: 0,
    tplStar: '<span id="#{id}" class="#{className}" onmouseover="#{onmouseover}" onclick="#{onclick}"></span>',
    classOn: "on",
    classOff: "off",
    isDisable: false,
    getString: function () {
        var c = this,
		a = [],
		b;
        for (b = 0; b < c.total; ++b) {
            a.push(baidu.string.format(c.tplStar, {
                id: c.getId(b),
                className: b < c.current ? c.getClass(c.classOn) : c.getClass(c.classOff),
                onmouseover: c.getCallString("hoverAt", b + 1),
                onclick: c.getCallString("clickAt", b + 1)
            }))
        }
        return a.join("")
    },
    render: function (a) {
        var b = this;
        b.element = baidu.g(a);
        baidu.dom.insertHTML(b.element, "beforeEnd", b.getString());
        b._mouseOutHandle = baidu.fn.bind(function () {
            var c = this;
            c.starAt(c.current);
            c.dispatchEvent("onleave")
        },
		b);
        b.on(b.element, "mouseout", b._mouseOutHandle)
    },
    starAt: function (a) {
        var c = this,
		b;
        for (b = 0; b < c.total; ++b) {
            baidu.g(c.getId(b)).className = b < a ? c.getClass(c.classOn) : c.getClass(c.classOff)
        }
    },
    hoverAt: function (a) {
        if (!this.isDisable) {
            this.starAt(a);
            this.dispatchEvent("onhover", {
                data: {
                    index: a
                }
            })
        }
    },
    clickAt: function (a) {
        if (!this.isDisable) {
            this.current = a;
            this.dispatchEvent("onclick", {
                data: {
                    index: a
                }
            })
        }
    },
    disable: function () {
        var a = this;
        a.isDisable = true
    },
    enable: function () {
        var a = this;
        a.isDisable = false
    },
    dispose: function () {
        var a = this;
        for (i = 0; i < a.total; ++i) {
            baidu.dom.remove(a.getId(i))
        }
        a.dispatchEvent("ondispose");
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.event.stop = function (a) {
    var b = baidu.event;
    b.stopPropagation(a);
    b.preventDefault(a)
};
baidu.array.contains = function (a, b) {
    return (baidu.array.indexOf(a, b) >= 0)
};
baidu.ui.Suggestion = baidu.ui.createUI(function (a) {
    var b = this;
    b.addEventListener("onload",
	function () {
	    b.on(document, "mousedown", b.documentMousedownHandler);
	    b.on(window, "blur", b.windowBlurHandler)
	});
    b.documentMousedownHandler = b._getDocumentMousedownHandler();
    b.windowBlurHandler = b._getWindowBlurHandler();
    b.enableIndex = [];
    b.currentIndex = -1
}).extend({
    uiType: "suggestion",
    onbeforepick: new Function,
    onpick: new Function,
    onconfirm: new Function,
    onhighlight: new Function,
    onshow: new Function,
    onhide: new Function,
    getData: function () {
        return []
    },
    prependHTML: "",
    appendHTML: "",
    currentData: {},
    tplDOM: "<div id='#{0}' class='#{1}' style='position:relative; top:0px; left:0px;'></div>",
    tplPrependAppend: "<div id='#{0}' class='#{1}'>#{2}</div>",
    tplBody: '<table cellspacing="0" cellpadding="2"><tbody>#{0}</tbody></table>',
    tplRow: '<tr><td id="#{0}" onmouseover="#{2}" onmouseout="#{3}" onmousedown="#{4}" onclick="#{5}" class="#{6}">#{1}</td></tr>',
    getString: function () {
        var a = this;
        return baidu.format(a.tplDOM, a.getId(), a.getClass(), a.guid)
    },
    render: function (c) {
        var b = this,
		a,
		c = baidu.g(c);
        if (b.getMain() || !c) {
            return
        }
        if (c.id) {
            b.targetId = c.id
        } else {
            b.targetId = c.id = b.getId("input")
        }
        a = b.renderMain();
        a.style.display = "none";
        a.innerHTML = b.getString();
        this.dispatchEvent("onload")
    },
    _isShowing: function () {
        var b = this,
		a = b.getMain();
        return a && a.style.display != "none"
    },
    pick: function (a) {
        var d = this,
		b = d.currentData,
		e = b && typeof a == "number" && typeof b[a] != "undefined" ? b[a].value : a,
		c = {
		    data: {
		        item: e == a ? {
		            value: a,
		            content: a
		        } : b[a],
		        index: a
		    }
		};
        if (d.dispatchEvent("onbeforepick", c)) {
            d.dispatchEvent("onpick", c)
        }
    },
    show: function (f, e, c) {
        var b = 0,
		a = e.length,
		d = this;
        d.enableIndex = [];
        d.currentIndex = -1;
        if (a == 0 && !c) {
            d.hide()
        } else {
            d.currentData = [];
            for (; b < a; b++) {
                if (typeof e[b].value != "undefined") {
                    d.currentData.push(e[b])
                } else {
                    d.currentData.push({
                        value: e[b],
                        content: e[b]
                    })
                }
                if (typeof e[b]["disable"] == "undefined" || e[b]["disable"] == false) {
                    d.enableIndex.push(b)
                }
            }
            d.getBody().innerHTML = d._getBodyString();
            d.getMain().style.display = "block";
            d.dispatchEvent("onshow")
        }
    },
    hide: function () {
        var e = this;
        if (!e._isShowing()) {
            return
        }
        if (e.currentIndex >= 0 && e.holdHighLight) {
            var d = e.currentData,
			b = -1;
            for (var c = 0, a = d.length; c < a; c++) {
                if (typeof d[c].disable == "undefined" || d[c].disable == false) {
                    b++;
                    if (b == e.currentIndex) {
                        e.pick(c)
                    }
                }
            }
        }
        e.getMain().style.display = "none";
        e.dispatchEvent("onhide")
    },
    highLight: function (a) {
        var c = this,
		d = c.enableIndex,
		b = null;
        if (!c._isEnable(a)) {
            return
        }
        c.currentIndex >= 0 && c._clearHighLight();
        b = c._getItem(a);
        baidu.addClass(b, c.getClass("current"));
        c.currentIndex = baidu.array.indexOf(d, a);
        c.dispatchEvent("onhighlight", {
            index: a,
            data: c.getDataByIndex(a)
        })
        b.style.backgroundColor = b.innerText;
    },
    clearHighLight: function () {
        var c = this,
		a = c.currentIndex,
		b = c.enableIndex[a];
        var item = c._getItem(a);
        if (item != null)
            item.style.backgroundColor = "";
        c._clearHighLight() && c.dispatchEvent("onclearhighlight", {
            index: b,
            data: c.getDataByIndex(b)
        })
    },
    _clearHighLight: function () {
        var c = this,
		a = c.currentIndex,
		d = c.enableIndex,
		b = null;
        if (a >= 0) {
            b = c._getItem(d[a]);
            baidu.removeClass(b, c.getClass("current"));
            c.currentIndex = -1;
            return true
        }
        return false
    },
    confirm: function (a, c) {
        var b = this;
        if (c != "keyboard") {
            if (!b._isEnable(a)) {
                return
            }
        }
        b.pick(a);
        b.dispatchEvent("onconfirm", {
            data: b.getDataByIndex(a) || a,
            source: c
        });
        b.currentIndex = -1;
        b.hide()
    },
    getDataByIndex: function (a) {
        return {
            item: this.currentData[a],
            index: a
        }
    },
    getTargetValue: function () {
        return this.getTarget().value
    },
    getTarget: function () {
        return baidu.g(this.targetId)
    },
    _getItem: function (a) {
        return baidu.g(this.getId("item" + a))
    },
    _getBodyString: function () {
        var f = this,
		e = "",
		d = [],
		g = f.currentData,
		a = g.length,
		c = 0;
        function b(h) {
            return baidu.format(f.tplPrependAppend, f.getId(h), f.getClass(h), f[h + "HTML"])
        }
        e += b("prepend");
        for (; c < a; c++) {
            d.push(baidu.format(f.tplRow, f.getId("item" + c), g[c].content, f.getCallRef() + "._itemOver(event, " + c + ")", f.getCallRef() + "._itemOut(event, " + c + ")", f.getCallRef() + "._itemDown(event, " + c + ")", f.getCallRef() + "._itemClick(event, " + c + ")", (typeof g[c]["disable"] == "undefined" || g[c]["disable"] == false) ? "" : f.getClass("disable")))
        }
        e += baidu.format(f.tplBody, d.join(""));
        e += b("append");
        return e
    },
    _itemOver: function (c, a) {
        var b = this;
        baidu.event.stop(c || window.event);
        b._isEnable(a) && b.highLight(a);
        b.dispatchEvent("onmouseoveritem", {
            index: a,
            data: b.getDataByIndex(a)
        })
    },
    _itemOut: function (c, a) {
        var b = this;
        baidu.event.stop(c || window.event);
        if (!b.holdHighLight) {
            b._isEnable(a) && b.clearHighLight()
        }
        b.dispatchEvent("onmouseoutitem", {
            index: a,
            data: b.getDataByIndex(a)
        })
    },
    _itemDown: function (c, a) {
        var b = this;
        baidu.event.stop(c || window.event);
        b.dispatchEvent("onmousedownitem", {
            index: a,
            data: b.getDataByIndex(a)
        })
    },
    _itemClick: function (c, a) {
        var b = this;
        baidu.event.stop(c || window.event);
        b.dispatchEvent("onitemclick", {
            index: a,
            data: b.getDataByIndex(a)
        });
        b._isEnable(a) && b.confirm(a, "mouse")
    },
    _isEnable: function (a) {
        var b = this;
        return baidu.array.contains(b.enableIndex, a)
    },
    _getDocumentMousedownHandler: function () {
        var a = this;
        return function (d) {
            d = d || window.event;
            var b = d.target || d.srcElement,
			c = baidu.ui.get(b);
            if (b == a.getTarget() || (c && c.uiType == a.uiType)) {
                return
            }
            a.hide()
        }
    },
    _getWindowBlurHandler: function () {
        var a = this;
        return function () {
            a.hide()
        }
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("dispose");
        baidu.dom.remove(a.mainId);
        baidu.lang.Class.prototype.dispose.call(this)
    }
});
baidu.extend(baidu.ui.Suggestion.prototype, {
    coverable: true,
    coverableOptions: {}
});
baidu.ui.Suggestion.register(function (a) {
    if (a.coverable) {
        a.addEventListener("onshow",
		function () {
		    a.Coverable_show()
		});
        a.addEventListener("onhide",
		function () {
		    a.Coverable_hide()
		})
    }
});
baidu.ui.Suggestion.extend({
    setData: function (d, c, b) {
        var a = this;
        a.dataCache[d] = c;
        if (!b) {
            a.show(d, a.dataCache[d])
        }
    }
});
baidu.ui.Suggestion.register(function (a) {
    a.dataCache = {},
	a.addEventListener("onneeddata",
	function (c, d) {
	    var b = a.dataCache;
	    if (typeof b[d] == "undefined") {
	        a.getData(d)
	    } else {
	        a.show(d, b[d])
	    }
	})
});
baidu.ui.Suggestion.extend({
    posable: true,
    fixWidth: true,
    getWindowResizeHandler: function () {
        var a = this;
        return function () {
            a.adjustPosition(true)
        }
    },
    adjustPosition: function (b) {
        var d = this,
		e = d.getTarget(),
		c,
		a = d.getMain(),
		f;
        if (!d._isShowing() && b) {
            return
        }
        c = baidu.dom.getPosition(e),
		f = {
		    top: (c.top + e.offsetHeight - 1),
		    left: c.left,
		    width: e.offsetWidth
		};
        f = typeof d.view == "function" ? d.view(f) : f;
        d.setPosition([f.left, f.top], null, {
            once: true
        });
        baidu.dom.setOuterWidth(a, f.width)
    }
});
baidu.ui.Suggestion.register(function (a) {
    a.windowResizeHandler = a.getWindowResizeHandler();
    a.addEventListener("onload",
	function () {
	    a.adjustPosition();
	    if (a.fixWidth) {
	        a.fixWidthTimer = setInterval(function () {
	            var b = a.getMain(),
				c = a.getTarget();
	            if (b.offsetWidth != 0 && c && c.offsetWidth != b.offsetWidth) {
	                a.adjustPosition();
	                b.style.display = "block"
	            }
	        },
			100)
	    }
	    a.on(window, "resize", a.windowResizeHandler)
	});
    a.addEventListener("onshow",
	function () {
	    a.adjustPosition()
	});
    a.addEventListener("ondispose",
	function () {
	    clearInterval(a.fixWidthTimer)
	})
});
baidu.ui.Suggestion.register(function (e) {
    var h,
	c = "",
	g,
	d,
	b = false,
	f = false;
    function a() {
        setTimeout(function () {
            if (e.getTarget() != null)
                g = e.getTarget().value
        },
		20)
    }
    e.addEventListener("onload",
	function () {
	    h = this.getTarget();
	    a();
	    e.on(window, "onload", a);
	    e.targetKeydownHandler = e.getTargetKeydownHandler();
	    e.on(h, "keydown", e.targetKeydownHandler);
	    h.setAttribute("autocomplete", "off");
	    e.circleTimer = setInterval(function () {
	        if (f) {
	            return
	        }
	        if (baidu.g(h) == null) {
	            e.dispose()
	        }
	        var j = h.value;
	        if (j == c && j != "" && j != g && j != d) {
	            if (e.requestTimer == 0) {
	                e.requestTimer = setTimeout(function () {
	                    e.dispatchEvent("onneeddata", j)
	                },
					100)
	            }
	        } else {
	            clearTimeout(e.requestTimer);
	            e.requestTimer = 0;
	            if (j == "" && c != "") {
	                d = "";
	                e.hide()
	            }
	            c = j;
	            if (j != d) {
	                e.defaultIptValue = j
	            }
	            if (g != h.value) {
	                g = ""
	            }
	        }
	    },
		10);
	    e.on(h, "beforedeactivate", e.beforedeactivateHandler)
	});
    e.addEventListener("onitemclick",
	function () {
	    f = false;
	    e.defaultIptValue = c = e.getTargetValue()
	});
    e.addEventListener("onpick",
	function (j) {
	    if (b) {
	        h.blur()
	    }
	    h.value = d = j.data.item.value;
	    if (b) {
	        h.focus()
	    }
	});
    e.addEventListener("onmousedownitem",
	function (j) {
	    b = true;
	    f = true;
	    setTimeout(function () {
	        f = false;
	        b = false
	    },
		500)
	});
    e.addEventListener("ondispose",
	function () {
	    clearInterval(e.circleTimer)
	})
});
baidu.ui.Suggestion.extend({
    beforedeactivateHandler: function () {
        return function () {
            if (mousedownView) {
                window.event.cancelBubble = true;
                window.event.returnValue = false
            }
        }
    },
    getTargetKeydownHandler: function () {
        var b = this;
        function a(c) {
            if (!b._isShowing()) {
                b.dispatchEvent("onneeddata", b.getTargetValue());
                return
            }
            var e = b.enableIndex,
			d = b.currentIndex;
            if (e.length == 0) {
                return
            }
            if (c) {
                switch (d) {
                    case -1: d = e.length - 1;
                        b.pick(e[d]);
                        b.highLight(e[d]);
                        break;
                    case 0:
                        d = -1;
                        b.pick(b.defaultIptValue);
                        b.clearHighLight();
                        break;
                    default:
                        d--;
                        b.pick(e[d]);
                        b.highLight(e[d]);
                        break
                }
            } else {
                switch (d) {
                    case -1: d = 0;
                        b.pick(e[d]);
                        b.highLight(e[d]);
                        break;
                    case e.length - 1: d = -1;
                        b.pick(b.defaultIptValue);
                        b.clearHighLight();
                        break;
                    default:
                        d++;
                        b.pick(e[d]);
                        b.highLight(e[d]);
                        break
                }
            }
            b.currentIndex = d
        }
        return function (f) {
            var c = false,
			d;
            f = f || window.event;
            switch (f.keyCode) {
                case 9:
                case 27:
                    b.hide();
                    break;
                case 13:
                    baidu.event.stop(f);
                    b.confirm(b.currentIndex == -1 ? b.getTarget().value : b.enableIndex[b.currentIndex], "keyboard");
                    break;
                case 38:
                    c = true;
                case 40:
                    baidu.event.stop(f);
                    a(c);
                    break;
                default:
                    b.currentIndex = -1
            }
        }
    },
    defaultIptValue: ""
});
baidu.ui.Tab = baidu.ui.createUI(function (a) {
    var b = this;
    b.items = b.items || []
},
{
    superClass: baidu.ui.ItemSet
}).extend({
    uiType: "tab",
    tplDOM: "<div id='#{id}' class='#{class}'>#{heads}#{bodies}</div>",
    tplHeads: "<ul id='#{id}' class='#{class}'>#{heads}</ul>",
    tplBodies: "<div id='#{id}' class='#{class}'>#{bodies}</div>",
    tplHead: "<li id='#{id}' bodyId='#{bodyId}' class='#{class}' ><a href='#' onclick='return false'>#{head}</a></li>",
    tplBody: "<div id='#{id}' class='#{class}' style='display : #{display};'>#{body}</div>",
    getString: function () {
        var d = this,
		b = this.items,
		a = [],
		c = [];
        baidu.each(b,
		function (f, e) {
		    a.push(d._getBodyString(f, e));
		    c.push(d._getHeadString(f, e))
		});
        return baidu.format(d.tplDOM, {
            id: d.getId(),
            "class": d.getClass(),
            heads: baidu.format(d.tplHeads, {
                id: d.getId("head-container"),
                "class": d.getClass("head-container"),
                heads: c.join("")
            }),
            bodies: baidu.format(d.tplBodies, {
                id: d.getId("body-container"),
                "class": d.getClass("body-container"),
                bodies: a.join("")
            })
        })
    },
    insertItemHTML: function (f, b) {
        var e = this,
		d = e._headIds,
		a = e._bodyIds,
		b = d[b] ? b : d.length,
		c = baidu.dom.g(d[b] || e.getId("head-container")),
		h = baidu.dom.g(a[b] || e.getId("body-container")),
		g = d[b] ? "beforeBegin" : "beforeEnd";
        baidu.dom.insertHTML(c, g, e._getHeadString(f, b));
        baidu.dom.insertHTML(h, g, e._getBodyString(f, b));
        e._addSwitchEvent(baidu.dom.g(d[b]))
    },
    insertContentHTML: function (c, a) {
        var b = this;
        baidu.dom.insertHTML(b.getBodies()[a], "beforeEnd", c)
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("ondispose");
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Table.register(function (a) {
    a._createPage();
    a.addEventListener("beforeupdate",
	function () {
	    a._createPage()
	})
});
baidu.object.extend(baidu.ui.Table.prototype, {
    currentPage: 1,
    _createPage: function () {
        var a = this;
        a.dataSet = a.data || [];
        if (a.pageSize) {
            a.data = a.data.slice(0, a.pageSize)
        }
    },
    gotoPage: function (a) {
        var c = this,
		a = a <= 0 ? 1 : Math.min(a, c.getTotalPage()),
		f = (a - 1) * c.pageSize,
		d = c.dataSet.slice(f, f + c.pageSize),
		b = 0,
		e;
        for (; b < c.pageSize; b++) {
            e = c.getRow(b);
            if (d[b]) {
                if (e) {
                    e.update(d[b])
                } else {
                    c.dispatchEvent("addrow", {
                        rowId: c._addRow(d[b])
                    })
                }
            } else {
                if (e) {
                    c.dispatchEvent("removerow", {
                        rowId: c._removeRow(b--)
                    })
                }
            }
        }
        c.data = d;
        c.currentPage = a;
        c.dispatchEvent("gotopage")
    },
    prevPage: function () {
        var a = this;
        a.gotoPage(--a.currentPage)
    },
    nextPage: function () {
        var a = this;
        a.gotoPage(++a.currentPage)
    },
    getTotalCount: function () {
        return this.dataSet.length
    },
    getTotalPage: function () {
        var a = this;
        return baidu.lang.isNumber(a.pageSize) ? Math.ceil(a.dataSet.length / a.pageSize) : a.currentPage
    },
    getCurrentPage: function () {
        return this.currentPage
    },
    addRow: function (d, c) {
        var e = this,
		c = baidu.lang.isNumber(c) ? c : e.getTotalCount(),
		b = e.getCurrentPage(),
		a = Math.ceil((c + 1) / e.pageSize),
		f = d,
		g;
        if (e.pageSize) {
            e.dataSet.splice(c, 0, f);
            if (b >= a) {
                c %= e.pageSize;
                if (b != a) {
                    f = e.dataSet[(b - 1) * e.pageSize];
                    c = 0
                }
                g = e._addRow(f, c);
                if (e.getRowCount() > e.pageSize) {
                    e.dispatchEvent("removerow", {
                        rowId: e._removeRow(e.getRowCount() - 1)
                    })
                }
            }
            e.dispatchEvent("addrow", {
                rowId: g
            })
        } else {
            e.dispatchEvent("addrow", {
                rowId: e._addRow(d, c)
            })
        }
    },
    removeRow: function (b) {
        var d = this,
		a = d.getCurrentPage(),
		c = Math.ceil((b + 1) / d.pageSize),
		f,
		e;
        if (d.pageSize) {
            d.dataSet.splice(b, 1);
            if (a >= c) {
                b = a != c ? 0 : b % d.pageSize;
                f = d._removeRow(b);
                e = d.dataSet[a * d.pageSize - 1];
                if (e) {
                    d.dispatchEvent("addrow", {
                        rowId: d._addRow(e)
                    })
                }
            }
            d.dispatchEvent("removerow", {
                rowId: f
            })
        } else {
            d.dispatchEvent("removerow", {
                rowId: d._removeRow(b)
            })
        }
    }
});
baidu.ui.Table.register(function (a) {
    a.addEventListeners("load, update",
	function () {
	    if (a.withPager) {
	        baidu.dom.insertHTML(a.getTarget(), "beforeEnd", "<div id='" + a.getId("-pager") + "' align='right'></div>");
	        a.pager = new baidu.ui.Pager({
	            endPage: a.getTotalPage() + 1,
	            ongotopage: function (b) {
	                a.gotoPage(b.page)
	            }
	        });
	        a.pager.render(a.getPagerContainer());
	        a.addEventListeners("addrow, removerow",
			function () {
			    a.pager.update({
			        endPage: a.getTotalPage() + 1
			    })
			});
	        a.resize();
	        baidu.event.on(window, "resize",
			function () {
			    a.resize()
			})
	    }
	})
});
baidu.object.extend(baidu.ui.Table.prototype, {
    getPagerContainer: function () {
        return baidu.g(this.getId("-pager"))
    },
    resize: function () {
        var a = this;
        baidu.dom.setStyle(a.getPagerContainer(), "width", a.getBody().offsetWidth + "px")
    }
});
baidu.ui.Table.register(function (a) {
    if (!a.columns) {
        return
    }
    a.addEventListeners("load, update",
	function () {
	    var c = 0,
		b = a.getRowCount(),
		d = a._editArray = [],
		e = a._textField = new baidu.ui.Input({
		    element: a.getMain(),
		    autoRender: true
		});
	    e.getBody().onblur = baidu.fn.bind("_cellBlur", a);
	    baidu.dom.hide(e.getBody());
	    baidu.array.each(a.columns,
		function (f) {
		    if (f.hasOwnProperty("enableEdit")) {
		        d.push(f)
		    }
		});
	    for (; c < b; c++) {
	        a.attachEdit(a.getRow(c))
	    }
	})
});
baidu.object.extend(baidu.ui.Table.prototype, {
    attachEdit: function (b) {
        var a = this;
        baidu.array.each(a._editArray,
		function (d) {
		    var c = b.getBody().cells[d.index];
		    c.ondblclick = d.enableEdit ? baidu.fn.bind("_cellFocus", a, c) : null
		})
    },
    _cellFocus: function (a, b) {
        var e = this,
		c = e._textField.getBody(),
		d = a.clientWidth;
        if (baidu.event.getTarget(b || window.event).id == c.id) {
            return
        }
        c.value = a.innerHTML;
        a.innerHTML = "";
        a.appendChild(c);
        baidu.dom.show(c);
        c.style.width = d - c.offsetWidth + c.clientWidth + "px";
        c.focus();
        c.select()
    },
    _cellBlur: function (b) {
        var c = this,
		d = baidu.event.getTarget(b || window.event),
		a = baidu.dom.getAncestorByTag(d, "td");
        baidu.dom.hide(d);
        c.getTarget().appendChild(d);
        a.innerHTML = d.value
    }
});
baidu.object.values = function (d) {
    var a = [],
	c = 0,
	b;
    for (b in d) {
        if (d.hasOwnProperty(b)) {
            a[c++] = d[b]
        }
    }
    return a
};
baidu.object.keys = function (d) {
    var a = [],
	c = 0,
	b;
    for (b in d) {
        if (d.hasOwnProperty(b)) {
            a[c++] = b
        }
    }
    return a
};
baidu.ui.Table.register(function (a) {
    if (a.columns) {
        a.addEventListeners("load, update",
		function () {
		    a._selectedItems = {};
		    a._checkboxList = {};
		    a._checkboxDomList = {};
		    a._createSelect()
		});
        a.addEventListeners({
            addrow: function (b) {
                a.addCheckbox(b.rowId, a._selectIndex)
            },
            removerow: function (b) {
                a.removeCheckbox(b.rowId)
            },
            gotopage: function () {
                a.unselectAll()
            }
        })
    }
});
baidu.object.extend(baidu.ui.Table.prototype, {
    tplSelect: '<input id="#{id}" type="checkbox" value="#{value}" onclick="#{handler}"/>',
    _createTitleScelect: function (a) {
        var b = this;
        b.titleCheckboxId = b.titleCheckboxId || b.getId("checkboxAll");
        baidu.dom.insertHTML(b.getTitleBody().rows[0].cells[a], "beforeEnd", baidu.string.format(b.tplSelect, {
            id: b.titleCheckboxId,
            value: "all",
            handler: b.getCallString("toggleAll")
        }))
    },
    _createSelect: function () {
        var d = this,
		a = d.getRowCount(),
		c = 0,
		b;
        baidu.array.each(d.columns,
		function (e) {
		    if (e.hasOwnProperty("type") && e.type.toLowerCase() == "checkbox") {
		        d._selectIndex = b = e.index;
		        return false
		    }
		});
        if (d.title && baidu.lang.isNumber(b)) {
            if (d.getTitleBody && d.getTitleBody()) {
                d._createTitleScelect(b)
            } else {
                d.addEventListener("titleload",
				function () {
				    d._createTitleScelect(b);
				    d.removeEventListener("titleload", arguments.callee)
				})
            }
        }
        if (baidu.lang.isNumber(b)) {
            for (; c < a; c++) {
                d.addCheckbox(d.getRow(c).getId(), b)
            }
        }
    },
    _getSelectString: function (c) {
        var b = this,
		a = c.getId("checkbox");
        b._checkboxList[c.getId()] = a;
        b._checkboxDomList[c.getId()] = a;
        return baidu.string.format(b.tplSelect, {
            id: a,
            value: c.id ? c.id : c.guid,
            handler: b.getCallString("toggle", a)
        })
    },
    addCheckbox: function (e, c) {
        var d = this,
		f,
		b,
		a;
        if (baidu.lang.isNumber(c)) {
            f = baidu.ui.get(baidu.g(e)),
			b = f.getBody().cells[c],
			a = d._getSelectString(f);
            baidu.dom.insertHTML(b, "beforeEnd", a);
            baidu.dom.setAttr(b, "align", "center");
            f.addEventListener("update",
			function () {
			    baidu.dom.insertHTML(b, "beforeEnd", a)
			});
            d._checkboxDomList[e] = baidu.dom.g(d._checkboxDomList[e])
        }
    },
    removeCheckbox: function (b) {
        var a = this;
        delete a._selectedItems[a._checkboxList[b]];
        delete a._checkboxList[b];
        delete a._checkboxDomList[b]
    },
    getTitleCheckbox: function () {
        return baidu.dom.g(this.titleCheckboxId)
    },
    setTitleCheckbox: function (a) {
        this.titleCheckboxId = a.id || a
    },
    _setSelectItems: function (d) {
        var a = this,
		b = baidu.g(d),
		c;
        if (b.checked) {
            c = baidu.ui.get(baidu.dom.getAncestorByTag(d, "TR"));
            a._selectedItems[b.id] = c.id || c
        } else {
            delete a._selectedItems[b.id]
        }
    },
    _setCheckboxState: function (e, d) {
        var b = this,
		e = baidu.lang.isNumber(e) ? [e] : e,
		a = [],
		c;
        if (e) {
            baidu.array.each(e,
			function (f) {
			    a.push(b._checkboxDomList[b.getRow(f).getId()])
			})
        } else {
            a = baidu.object.values(b._checkboxDomList)
        }
        baidu.array.each(a,
		function (f) {
		    if (d && !f.checked) {
		        f.checked = true
		    } else {
		        if (!d && f.checked) {
		            f.checked = false
		        }
		    }
		    if (e) {
		        b.toggle(f)
		    } else {
		        b._setSelectItems(f)
		    }
		})
    },
    select: function (a) {
        this._setCheckboxState(a, true)
    },
    unselect: function (a) {
        this._setCheckboxState(a, false)
    },
    toggle: function (b) {
        var c = this,
		e = c.getTitleCheckbox(),
		d = baidu.g(b),
		a;
        c._setSelectItems(b);
        if (d.checked) {
            a = baidu.object.keys(c._selectedItems).length;
            if (e && !e.checked && a == baidu.object.keys(c._checkboxList).length) {
                e.checked = true
            }
        } else {
            if (e && e.checked) {
                e.checked = false
            }
        }
    },
    selectAll: function () {
        this._setCheckboxState(null, true)
    },
    unselectAll: function () {
        this._setCheckboxState(null, false)
    },
    toggleAll: function () {
        var a = this,
		b = a.getTitleCheckbox();
        if (b) {
            this._setCheckboxState(null, b.checked)
        }
    },
    getSelected: function () {
        return baidu.object.values(this._selectedItems)
    }
});
baidu.ui.Table.register(function (a) {
    if (a.title) {
        a.addEventListeners("load, update",
		function () {
		    if (!a.getTitleBody()) {
		        baidu.dom.insertHTML(a.getTarget(), "afterBegin", a._getTitleString());
		        a.dispatchEvent("titleload");
		        baidu.dom.setStyles(a.getBody(), {
		            tableLayout: "fixed"
		        });
		        baidu.dom.setStyles(a.getTitleBody(), {
		            width: a.getBody().offsetWidth + "px",
		            tableLayout: "fixed"
		        })
		    }
		    if (a.getTitleBody() && a.columns) {
		        baidu.array.each(a.columns,
				function (b) {
				    if (b.hasOwnProperty("width")) {
				        baidu.dom.setStyles(a.getTitleBody().rows[0].cells[b.index], {
				            width: b.width
				        })
				    }
				})
		    }
		});
        a.addEventListener("addrow",
		function () {
		    if (a.getRowCount() == 1) {
		        baidu.dom.setStyles(a.getTitleBody(), {
		            width: a.getBody().offsetWidth + "px"
		        })
		    }
		})
    }
});
baidu.object.extend(baidu.ui.Table.prototype, {
    tplTitle: '<div><table id="#{rsid}" class="#{tabClass}" cellspacing="0" cellpadding="0" border="0"><tr class="#{trClass}">#{col}</tr></table></div>',
    _getTitleString: function () {
        var c = this,
		b = [],
		a = "";
        baidu.array.each(c.title,
		function (d) {
		    b.push("<td>", d, "</td>")
		});
        return baidu.string.format(c.tplTitle, {
            rsid: c.getId("title"),
            tabClass: c.getClass("title"),
            trClass: c.getClass("title-row"),
            col: b.join("")
        })
    },
    getTitleBody: function () {
        return baidu.g(this.getId("title"))
    }
});
baidu.ui.Toolbar = baidu.ui.createUI(function (c) {
    var d = this,
	b = false,
	a = 'align="';
    d._itemObject = {};
    d.items = d.items || {};
    if (d.direction != "horizontal") {
        d.direction = "vertical"; !baidu.array.contains(["top", "middle", "bottom", "baseline"], d.position) && (d.position = "top")
    }
    d._positionStr = a + d.position + '"'
}).extend({
    title: "",
    direction: "horizontal",
    position: "left",
    cellIndex: 0,
    tplMain: '<div id="#{bodyId}" class="#{bodyClass}" onmousedown="javascript:return false;">#{title}<div id="#{bodyInner}" class="#{bodyInnerClass}"><table cellpadding="0" cellspacing="0" style="width:100%; height:100%" id="#{tableId}"><tr><td style="width:100%; height:100%; overflow:hidden;" valign="top"><table cellpadding="0" cellspacing="0" id="#{tableInnerId}">#{content}</table></td></tr></table></div></div>',
    tplTitle: '<div id="#{titleId}" class="#{titleClass}"><div id="#{titleInnerId}" class="#{titleInnerClass}">#{title}</div></div>',
    tplHorizontalCell: '<td id="#{id}" valign="middle" style="overflow:hidden;"></td>',
    tplVerticalCell: '<tr><td id="#{id}" valign="middle" style="overflow:hidden;"></td></tr>',
    uiType: "toolbar",
    getString: function () {
        var a = this;
        return baidu.format(a.tplMain, {
            bodyId: a.getId(),
            bodyClass: a.getClass(),
            bodyInner: a.getId("bodyInner"),
            bodyInnerClass: a.getClass("body-inner"),
            title: a.title === "" ? "" : baidu.format(a.tplTitle, {
                titleId: a.getId("title"),
                titleClass: a.getClass("title"),
                titleInnerId: a.getId("titleInner"),
                titleInnerClass: a.getClass("title-inner"),
                title: a.title
            }),
            tableId: a.getId("table"),
            position: a._positionStr,
            tableInnerId: a.getId("tableInner"),
            content: a.direction == "horizontal" ? "<tr>" + a._createCell(a.items.length, "str") + "</tr>" : a._createCell(a.items.length, "str")
        })
    },
    render: function (b) {
        var c = this,
		a;
        c.container = b = baidu.g(b || c.container);
        baidu.insertHTML(c.renderMain(b), "beforeEnd", c.getString());
        a = baidu.g(c.getId());
        c.width && baidu.setStyle(a, "width", c.width);
        c.height && baidu.setStyle(a, "height", c.height);
        c._createItems()
    },
    _createItems: function () {
        var c = this,
		b = baidu.g(c.getId("tableInner")),
		a = [];
        baidu.each(b.rows,
		function (e, d) {
		    baidu.each(e.cells,
			function (g, f) {
			    a.push(g)
			})
		});
        baidu.each(c.items,
		function (e, d) {
		    c.add(e, a[d])
		})
    },
    add: function (d, b) {
        var g = this,
		c = null,
		a = {
		    type: "button",
		    config: {}
		},
		f = null,
		e;
        if (!d) {
            return
        }
        baidu.object.merge(d, a);
        delete (d.config.statable);
        d.type = d.type.toLowerCase();
        f = baidu.ui.getUI(d.type);
        if (f) {
            baidu.object.merge(f, {
                statable: true
            },
			{
			    whiteList: ["statable"]
			});
            c = new f(d.config);
            g.addRaw(c, b)
        }
        return c
    },
    addRaw: function (b, a) {
        var c = this;
        if (!b) {
            return
        }
        baidu.extend(b, baidu.ui.Toolbar._itemBehavior);
        b.setName(b.name);
        if (!a) {
            a = c._createCell(1, "html")[0]
        }
        b.render(a);
        c._itemObject[b.getName()] = [b, a.id]
    },
    _createCell: function (c, e) {
        var f = this,
		g,
		b = [],
		a,
		d;
        e == "str" || (e = "html");
        if (e == "str") {
            if (f.direction == "horizontal") {
                for (d = 0; d < c; d++) {
                    b.push(baidu.format(f.tplHorizontalCell, {
                        id: f.getId("cell-" + f.cellIndex++)
                    }))
                }
            } else {
                for (d = 0; d < c; d++) {
                    b.push(baidu.format(f.tplVerticalCell, {
                        id: f.getId("cell-" + f.cellIndex++)
                    }))
                }
            }
            b = b.join("")
        } else {
            a = baidu.g(f.getId("tableInner"));
            containerTR = a.rows[0];
            if (f.direction == "horizontal") {
                for (d = 0; d < c; d++) {
                    g = containerTR.insertCell(containerTR.cells.length);
                    g.id = f.getId("cell-" + f.cellIndex++);
                    g.valign = "middle";
                    b.push(g)
                }
            } else {
                for (d = 0; d < c; d++) {
                    g = a.insertRow(a.rows.length);
                    g = g.insertCell(0);
                    g.id = f.getId("cell-" + f.cellIndex++);
                    g.valign = "middle";
                    b.push(g)
                }
            }
        }
        return b
    },
    remove: function (a) {
        var c = this,
		b;
        if (!a) {
            return
        }
        if (b = c._itemObject[a]) {
            b[0].dispose();
            baidu.dom.remove(b[1]);
            delete (c._itemObject[a])
        } else {
            baidu.object.each(c._itemObject,
			function (e, d) {
			    e[0].remove && e[0].remove(a)
			})
        }
    },
    removeAll: function () {
        var a = this;
        baidu.object.each(a._itemObject,
		function (c, b) {
		    c[0].dispose();
		    baidu.dom.remove(c[1])
		});
        a._itemObject = {}
    },
    enable: function (a) {
        var c = this,
		b;
        if (!a) {
            c.enableAll()
        } else {
            if (b = c._itemObject[a]) {
                b[0].enable()
            }
        }
    },
    disable: function (a) {
        var c = this,
		b;
        if (!a) {
            c.disableAll()
        } else {
            if (b = c._itemObject[a]) {
                b[0].disable()
            }
        }
    },
    enableAll: function () {
        var a = this;
        baidu.object.each(a._itemObject,
		function (c, b) {
		    c[0].enable()
		})
    },
    disableAll: function () {
        var a = this;
        baidu.object.each(a._itemObject,
		function (c, b) {
		    c[0].disable()
		})
    },
    getItemByName: function (a) {
        var c = this,
		b = c._itemObject[a];
        if (!b) {
            baidu.object.each(c._itemObject,
			function (e, d) {
			    e.getItemByName && (b = e.getItemByName(a));
			    if (b) {
			        return false
			    }
			})
        }
        return (b ? b[0] : null)
    },
    dispose: function () {
        var a = this;
        a.removeAll();
        a.dispatchEvent("dispose");
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
});
baidu.ui.Toolbar._itemIndex = 0;
baidu.ui.Toolbar._itemBehavior = {
    _toolbar_item_name: "",
    setName: function (a) {
        var b = this;
        if (baidu.lang.isString(a)) {
            b._toolbar_item_name = a
        } else {
            b._toolbar_item_name = "tangram_toolbar_item_" + baidu.ui.Toolbar._itemIndex++
        }
    },
    getName: function () {
        var a = this;
        return a._toolbar_item_name
    },
    setHighLight: function () {
        var a = this;
        a.setState("highlight");
        a.dispatchEvent("onhighlight")
    },
    cancelHighLight: function () {
        var a = this;
        a.removeState("highlight");
        a.dispatchEvent("oncancelhighlight")
    }
};
baidu.ui.Toolbar.Separator = baidu.ui.createUI(function (a) { }).extend({
    statable: false,
    uiType: "toolbar-separator",
    tplMain: '<span id="#{id}" class="#{class}" style="display:block"></span>',
    getString: function () {
        var a = this;
        return baidu.format(a.tplMain, {
            id: a.getId(),
            "class": a.getClass()
        })
    },
    render: function (a) {
        var b = this;
        baidu.dom.insertHTML(b.renderMain(a), "beforeEnd", b.getString())
    }
});
baidu.ui.Toolbar.Spacer = baidu.ui.createUI(function (a) { }).extend({
    statable: false,
    uiType: "toolbar-spacer",
    width: "10px",
    tplBody: '<div #{style} id="#{id}" class="#{class}"></div>',
    getString: function () {
        var a = this;
        return baidu.format(a.tplBody, {
            style: 'style="' + (a.height ? "height:" + a.height : "width:" + a.width) + '"',
            id: a.getId(),
            "class": a.getClass()
        })
    },
    render: function (a) {
        var b = this;
        baidu.dom.insertHTML(b.renderMain(a), "beforeEnd", b.getString())
    }
});
baidu.ui.behavior.posable.setPositionByMouse = function (b, a) {
    var c = this;
    b = baidu.g(b) || c.getMain();
    c._positionByCoordinate(b, baidu.page.getMousePosition(), a)
};
baidu.lang.toArray = function (b) {
    if (b === null || b === undefined) {
        return []
    }
    if (baidu.lang.isArray(b)) {
        return b
    }
    if (typeof b.length !== "number" || typeof b === "string" || baidu.lang.isFunction(b)) {
        return [b]
    }
    if (b.item) {
        var a = b.length,
		c = new Array(a);
        while (a--) {
            c[a] = b[a]
        }
        return c
    }
    return [].slice.call(b)
};
baidu.ui.Tooltip = baidu.ui.createUI(function (a) {
    var b = this;
    b.target = b.getTarget();
    b.offset = a.offset || [0, 0];
    b.positionElement = null;
    baidu.ui.Tooltip.showing[b.guid] = b
}).extend({
    uiType: "tooltip",
    width: "",
    height: "",
    zIndex: 3000,
    currentTarget: null,
    type: "click",
    posable: true,
    positionBy: "element",
    offsetPosition: "bottomright",
    isShowing: false,
    tplBody: '<div id="#{id}" class="#{class}"></div>',
    getString: function () {
        var a = this;
        return baidu.format(a.tplBody, {
            id: a.getId(),
            "class": a.getClass()
        })
    },
    toggle: function () {
        return true
    },
    render: function () {
        var b = this,
		a,
		c;
        a = b.renderMain();
        baidu.each(b.target,
		function (e, d) {
		    if ((c = baidu.getAttr(e, "title")) && c != "") {
		        baidu.setAttr(e, "tangram-tooltip-title", c);
		        baidu.setAttr(e, "title", "")
		    }
		});
        baidu.dom.insertHTML(a, "beforeend", b.getString());
        b._update();
        b._close();
        b.dispatchEvent("onload")
    },
    open: function (d) {
        var b = this,
		f = baidu.ui.Tooltip.showing,
		e = baidu.ui.Tooltip.isSingleton,
		d = d || b.target[0],
		c = b.currentTarget,
		a = b.getBody();
        if (c === d) {
            return
        }
        b.isShowing && b.close(c);
        if (e) {
            baidu.object.each(f,
			function (h, g) {
			    if (g != b.guid && h.isShowing) {
			        h.close()
			    }
			})
        }
        if (typeof b.toggle == "function" && !b.toggle()) {
            return
        }
        b.currentTarget = d;
        b._updateBodyByTitle();
        b._setPosition();
        b.isShowing = true;
        if (b.dispatchEvent("onbeforeopen")) {
            b.dispatchEvent("open");
            return
        }
    },
    _updateBody: function (b) {
        var c = this,
		b = b || {},
		a = c.getBody(),
		d;
        if (c.contentElement && c.contentElement !== a.firstChild) {
            a.innerHTML = "";
            a.appendChild(c.contentElement);
            c.contentElement = a.firstChild
        } else {
            if (typeof b.contentElement != "undefined") {
                a.innerHTML = "";
                b.contentElement != null && a.appendChild(b.contentElement)
            }
        }
        if (!b.contentElement) {
            if (typeof b.content == "string") {
                a.innerHTML = "";
                a.innerHTML = b.content
            } else {
                if (typeof c.content == "string" && baidu.dom.children(a).length == 0) {
                    a.innerHTML = c.content
                }
            }
        }
    },
    _updateBodyByTitle: function () {
        var b = this,
		a = b.getBody();
        if (!b.contentElement && !b.content && b.currentTarget) {
            if ((title = baidu.getAttr(b.currentTarget, "tangram-tooltip-title")) && title != "") {
                a.innerHTML = title
            } else {
                a.innerHTML = ""
            }
        }
    },
    _update: function (c) {
        var d = this,
		c = c || {},
		b = d.getMain(),
		a = d.getBody();
        d._updateBody(c);
        baidu.object.extend(d, c);
        d.contentElement = baidu.dom.children(a).length > 0 ? a.firstChild : null;
        d._updateBodyByTitle();
        baidu.dom.setStyles(b, {
            zIndex: d.zIndex,
            width: d.width,
            height: d.height,
            display: ""
        })
    },
    update: function (a) {
        var b = this;
        b._update(a);
        b._setPosition();
        b.dispatchEvent("onupdate")
    },
    _setPosition: function () {
        var c = this,
		a = typeof c.insideScreen == "string" ? c.insideScreen : "surround",
		b = {
		    once: true,
		    offset: c.offset,
		    position: c.offsetPosition,
		    insideScreen: a
		};
        switch (c.positionBy) {
            case "element":
                c.setPositionByElement(c.positionElement || c.currentTarget, c.getMain(), b);
                break;
            case "mouse":
                c.setPositionByMouse(c.getMain(), b);
                break;
            default:
                break
        }
    },
    close: function () {
        var a = this;
        if (!a.isShowing) {
            return
        }
        a.isShowing = false;
        if (a.dispatchEvent("onbeforeclose")) {
            a._close();
            a.dispatchEvent("onclose")
        }
        a.currentTarget = null
    },
    _close: function () {
        var a = this;
        a.getMain().style.left = "-100000px"
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("ondispose");
        if (a.getMain()) {
            baidu.dom.remove(a.getMain())
        }
        delete (baidu.ui.Tooltip.showing[a.guid]);
        baidu.lang.Class.prototype.dispose.call(a)
    },
    getTarget: function () {
        var a = this,
		b = [];
        baidu.each(baidu.lang.toArray(a.target),
		function (c) {
		    b.push(baidu.G(c))
		});
        return b
    }
});
baidu.ui.Tooltip.isSingleton = false;
baidu.ui.Tooltip.showing = {};
baidu.ui.Tooltip.register(function (b) {
    if (b.type == "click") {
        b.addEventListener("onload",
		function () {
		    baidu.each(b.target,
			function (d) {
			    baidu.on(d, "click", a)
			})
		});
        b.addEventListener("ondispose",
		function () {
		    baidu.each(b.target,
			function (d) {
			    baidu.un(d, "click", a)
			});
		    baidu.un(document, "click", c)
		});
        b.addEventListener("onopen",
		function () {
		    baidu.un(b.currentTarget, "click", a);
		    baidu.on(b.currentTarget, "click", c);
		    baidu.on(document, "click", c)
		});
        b.addEventListener("onclose",
		function () {
		    baidu.on(b.currentTarget, "click", a);
		    baidu.un(b.currentTarget, "click", c);
		    baidu.un(document, "click", c)
		});
        function a(d) {
            b.open(this);
            baidu.event.stop(d || window.event)
        }
        function c(g) {
            var f = baidu.event.getTarget(g || window.event),
			d = function (e) {
			    return b.getBody() == e
			};
            if (d(f) || baidu.dom.getAncestorBy(f, d) || baidu.ui.get(f) == b) {
                return
            }
            b.close();
            baidu.event.stop(g || window.event)
        }
    }
});
baidu.ui.Tooltip.extend({
    headContent: "",
    tplhead: '<div class="#{headClass}" id="#{id}">#{headContent}</div>'
});
baidu.ui.Tooltip.register(function (a) {
    a.addEventListener("onload",
	function () {
	    var c = this,
		b;
	    baidu.dom.insertHTML(c.getBody(), "afterBegin", baidu.format(c.tplhead, {
	        headClass: c.getClass("head"),
	        id: c.getId("head")
	    }));
	    b = new baidu.ui.Button({
	        content: c.headContent,
	        onclick: function () {
	            c.close()
	        }
	    });
	    b.render(c.getId("head"))
	})
});
baidu.fx.opacity = function (b, a) {
    if (!(b = baidu.dom.g(b))) {
        return null
    }
    a = baidu.object.extend({
        from: 0,
        to: 1
    },
	a || {});
    var d = b;
    var c = baidu.fx.create(d, baidu.object.extend({
        initialize: function () {
            baidu.dom.show(b);
            if (baidu.browser.ie) {
                this.protect("filter")
            } else {
                this.protect("opacity");
                this.protect("KHTMLOpacity")
            }
            this.distance = this.to - this.from
        },
        render: function (e) {
            var f = this.distance * e + this.from;
            if (!baidu.browser.ie) {
                d.style.opacity = f;
                d.style.KHTMLOpacity = f
            } else {
                d.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity:" + Math.floor(f * 100) + ")"
            }
        }
    },
	a), "baidu.fx.opacity");
    return c.launch()
};
baidu.fx.fadeIn = function (b, a) {
    if (!(b = baidu.dom.g(b))) {
        return null
    }
    var c = baidu.fx.opacity(b, baidu.object.extend({
        from: 0,
        to: 1,
        restoreAfterFinish: true
    },
	a || {}));
    c.__type = "baidu.fx.fadeIn";
    return c
};
baidu.fx.fadeOut = function (b, a) {
    if (!(b = baidu.dom.g(b))) {
        return null
    }
    var c = baidu.fx.opacity(b, baidu.object.extend({
        from: 1,
        to: 0,
        restoreAfterFinish: true
    },
	a || {}));
    c.addEventListener("onafterfinish",
	function () {
	    baidu.dom.hide(this.element)
	});
    c.__type = "baidu.fx.fadeOut";
    return c
};
baidu.ui.Tooltip.extend({
    enableFx: true,
    showFx: baidu.fx.fadeIn,
    showFxOptions: {
        duration: 500
    },
    hideFx: baidu.fx.fadeOut,
    hideFxOptions: {
        duration: 500
    }
});
baidu.ui.Tooltip.register(function (a) {
    if (a.enableFx) {
        var b = null;
        a.addEventListener("beforeopen",
		function (c) {
		    a.dispatchEvent("onopen");
		    "function" == typeof a.showFx && a.showFx(a.getMain(), a.showFxOptions);
		    c.returnValue = false
		});
        a.addEventListener("beforeclose",
		function (c) {
		    a.dispatchEvent("onclose");
		    b = a.hideFx(a.getMain(), a.hideFxOptions);
		    b.addEventListener("onafterfinish",
			function () {
			    a._close()
			});
		    c.returnValue = false
		});
        a.addEventListener("ondispose",
		function () {
		    b && b.end()
		})
    }
});
baidu.event._eventFilter = baidu.event._eventFilter || {};
baidu.event._eventFilter._crossElementBoundary = function (a, d) {
    var c = d.relatedTarget,
	b = d.currentTarget;
    if (c === false || b == c || (c && (c.prefix == "xul" || baidu.dom.contains(b, c)))) {
        return
    }
    return a.call(b, d)
};
baidu.event._eventFilter.mouseenter = window.attachEvent ? null : function (a, b, c) {
    return {
        type: "mouseover",
        listener: baidu.fn.bind(baidu.event._eventFilter._crossElementBoundary, this, c)
    }
};
baidu.event._eventFilter.mouseleave = window.attachEvent ? null : function (a, b, c) {
    return {
        type: "mouseout",
        listener: baidu.fn.bind(baidu.event._eventFilter._crossElementBoundary, this, c)
    }
};
baidu.ui.Tooltip.extend({
    hideDelay: 500
});
baidu.ui.Tooltip.register(function (c) {
    if (c.type != "hover") {
        return
    }
    var a = null,
	e = false;
    c.addEventListener("onload",
	function () {
	    baidu.each(c.target,
		function (g) {
		    c.on(g, "mouseenter", b);
		    c.on(g, "mouseleave", d)
		});
	    c.on(c.getBody(), "mouseover", f);
	    c.on(c.getBody(), "mouseout", f)
	});
    function f(g) {
        e = (g.type.toLowerCase() == "mouseover"); !e && d(g)
    }
    function b(g) {
        a && clearTimeout(a);
        c.open(this)
    }
    function d(g) {
        a = setTimeout(function () {
            !e && c.close()
        },
		c.hideDelay)
    }
});
baidu.array.remove = function (c, b) {
    var a = c.length;
    while (a--) {
        if (a in c && c[a] === b) {
            c.splice(a, 1)
        }
    }
    return c
};
baidu.dom.insertAfter = function (d, c) {
    var b,
	a;
    b = baidu.dom._g;
    d = b(d);
    c = b(c);
    a = c.parentNode;
    if (a) {
        a.insertBefore(d, c.nextSibling)
    }
    return d
};
baidu.string.encodeHTML = function (a) {
    return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
};
baidu.encodeHTML = baidu.string.encodeHTML;
baidu.ui.Tree = baidu.ui.createUI(function (a) {
    this._treeNodes = {}
});
baidu.ui.Tree.TreeNode = function (a) {
    var b = this;
    baidu.object.extend(b, a);
    b.id = b.id || baidu.lang.guid();
    b.childNodes = [];
    b._children = [];
    window["$BAIDU$"]._instances[b.id] = b;
    b._tree = {};
    b._stringArray = []
};
baidu.ui.Tree.TreeNode.prototype = {
    uiType: "tree-node",
    text: "",
    type: "leaf",
    isToggle: true,
    _getId: function (a) {
        return this.id + "-" + a
    },
    _getClass: function (a) {
        var c = this,
		b = "tangram-tree-node-" + a;
        if (c.skin) {
            b += " " + c.skin + "-" + a
        }
        return b
    },
    _getCallRef: function () {
        return "window['$BAIDU$']._instances['" + this.id + "']"
    },
    getString: function () {
        var c = this,
		a = c._stringArray,
		b = "";
        a.push('<dl id="', c.id, '">');
        c._createBodyStringArray();
        b = c.isExpand ? "display:''" : "display:none";
        a.push('<dd  style="' + b + '" id="', c.id, '-subNodeId"></dd></dl>');
        return a.join("")
    },
    getParentNode: function () {
        return this.parentNode
    },
    setParentNode: function (a) {
        var b = this;
        b.parentNode = a;
        b._level = a._level + 1
    },
    getChildNodes: function () {
        return this.childNodes
    },
    setTree: function (a) {
        var b = this;
        b._tree = a;
        b._tree._treeNodes[b.id] = b
    },
    getTree: function () {
        return this._tree
    },
    appendData: function (b) {
        var a = this;
        baidu.dom.insertHTML(a._getSubNodesContainer(), "beforeEnd", a._getSubNodeString(b));
        a._isRenderChildren = true
    },
    _getSubNodeString: function (g) {
        var e = this,
		f,
		a,
		b = [],
		c = 0,
		d,
		a = g.length;
        for (; c < a; c++) {
            d = g[c];
            f = new baidu.ui.Tree.TreeNode(d);
            if (c == (a - 1)) {
                f._isLast = true
            }
            e._appendChildData(f, a - 1);
            b.push(f.getString())
        }
        return b.join("")
    },
    isParent: function (c) {
        var b = this,
		a = c;
        while (!a.isRoot && (a = a.getParentNode())) {
            if (a == b) {
                return true
            }
        }
        return false
    },
    appendTo: function (a) {
        var b = this;
        b.getParentNode()._removeChildData(b);
        a.appendChild(b);
        b.dispatchEvent("appendto")
    },
    moveTo: function (e) {
        var d = this,
		b = d.getParentNode(),
		c,
		a;
        if (b == null) {
            return false
        }
        if (e.isExpand && e.getChildNodes().length > 0) {
            c = e
        } else {
            c = e.getParentNode()
        }
        b._removeChildData(d);
        a = (c == e) ? -1 : e.getIndex();
        c.appendChild(d, a);
        d.dispatchEvent("moveto")
    },
    _appendChildData: function (e, c, a) {
        var d = this,
		b = d.getChildNodes();
        e.parentNode = d;
        e.setTree(d.getTree());
        if (a) {
            b.splice(c + 1, 0, e);
            d._children.splice(c + 1, 0, e.json)
        } else {
            b.push(e);
            d._children.push(e.json)
        }
    },
    appendChild: function (g, d) {
        var f = this,
		e,
		c,
		h,
		a = g._getContainer(),
		b = f._getSubNodesContainer();
        if (d == null) {
            d = f.getChildNodes().length - 1
        }
        f._appendChildData(g, d, true);
        h = f.getChildNodes();
        e = g.getParentNode();
        c = g.getString();
        if (a) {
            if (d == -1) {
                if (h.length == 1) {
                    b.appendChild(a)
                } else {
                    baidu.dom.insertBefore(a, h[1]._getContainer())
                }
            } else {
                baidu.dom.insertAfter(a, h[d]._getContainer())
            }
        } else {
            if (d == -1) {
                if (h.length == 1) {
                    baidu.dom.insertHTML(b, "beforeEnd", c)
                } else {
                    baidu.dom.insertHTML(h[1]._getContainer(), "beforeBegin", c)
                }
            } else {
                baidu.dom.insertHTML(h[d]._getContainer(), "afterEnd", c)
            }
        }
        g._updateAll();
        g._updateOldParent(e);
        if (f.type == "leaf") {
            f.type = "trunk";
            f._getIconElement().className = f._getClass("trunk")
        }
        f._getSpanElement().innerHTML = f._getImagesString();
        return g
    },
    _updateOldParent: function (a) {
        var b = this;
        if (!a) {
            return false
        }
        if (a.getLastChild()) {
            a.getLastChild()._update()
        } else {
            if (b.getTree().expandable) {
                a._getIconElement().className = b._getClass("leaf");
                a.type = "leaf"
            }
            a._update()
        }
    },
    _removeChildData: function (c, a) {
        var b = this;
        baidu.array.remove(b._children, c.json);
        baidu.array.remove(b.childNodes, c);
        delete b.getTree().getTreeNodes()[c.id];
        if (a) {
            while (c.childNodes[0]) {
                c._removeChildData(c.childNodes[0])
            }
        }
    },
    removeAllChildren: function () {
        var a = this,
		b = a.getChildNodes();
        while (b[0]) {
            a.removeChild(b[0], true)
        }
    },
    removeChild: function (c) {
        if (c.getParentNode() == null) {
            return false
        }
        var b = this,
		a = b.getChildNodes();
        b._removeChildData(c, true);
        delete b.getTree().getTreeNodes()[c.id];
        baidu.dom.remove(c._getContainer());
        b.getTree().setCurrentNode(null);
        if (a.length <= 0 && !b.isRoot) {
            b._getSubNodesContainer().style.display = "none";
            if (b.getTree().expandable) {
                b._getIconElement().className = b._getClass("leaf");
                b.type = "leaf"
            }
        }
        b._updateAll()
    },
    _updateAll: function () {
        var b = this,
		a = b.getPrevious();
        a && a._update();
        b._update()
    },
    _update: function () {
        var a = this;
        a._getSpanElement().innerHTML = a._getImagesString();
        baidu.array.each(a.childNodes,
		function (b) {
		    b._update()
		})
    },
    update: function (c) {
        var d = this,
		b = d._getHrefElement(),
		a = d._getTextElement();
        baidu.extend(d, c); (b ? b : a).innerHTML = d.text
    },
    _switchToggleState: function (f, c, d, a) {
        var e = this,
		b = e._getToggleElement();
        if (e.type == "leaf") {
            return false
        }
        e.isExpand = a;
        if (b) {
            b.className = e._getClass(e.isLastNode() ? c : d)
        }
        if (e.getChildNodes() && e.getChildNodes().length > 0) {
            e._getSubNodesContainer().style.display = f
        }
    },
    expand: function () {
        var a = this;
        if (!a._isRenderChildren) {
            a.appendData(a.children)
        }
        a._switchToggleState("block", "Lminus", "Tminus", true)
    },
    collapse: function () {
        this._switchToggleState("none", "Lplus", "Tplus", false)
    },
    toggle: function () {
        var a = this;
        if (a.type == "leaf") {
            return false
        }
        a.isExpand ? a.collapse() : a.expand()
    },
    _switchFocusState: function (c, a, b) {
        var d = this;
        baidu.dom[b](d._getNodeElement(), d._getClass("current"));
        if (d.type != "leaf") {
            d._getIconElement().className = d._getClass(c);
            d.isOpen = a
        }
    },
    blur: function () {
        var a = this;
        a._switchFocusState("trunk", false, "removeClass");
        a.getTree().setCurrentNode(null)
    },
    focus: function () {
        var a = this,
		b = a.getTree().getCurrentNode();
        if (b != null) {
            b.blur()
        }
        a._switchFocusState("open-trunk", true, "addClass");
        a.getTree().setCurrentNode(a);
        baidu.dom.removeClass(a._getNodeElement(), a._getClass("over"))
    },
    _onMouseOver: function (b) {
        var a = this;
        if (a != a.getTree().getCurrentNode()) {
            baidu.dom.addClass(a._getNodeElement(), a._getClass("over"))
        }
        a.dispatchEvent("draghover", {
            event: b
        });
        a.dispatchEvent("sorthover", {
            event: b
        })
    },
    _onMouseOut: function () {
        var a = this;
        baidu.dom.removeClass(a._getNodeElement(), a._getClass("over"));
        a.getTree().dispatchEvent("mouseout", {
            treeNode: a
        })
    },
    _onClick: function (a) {
        var b = this;
        b.focus();
        b.getTree().dispatchEvent("click", {
            treeNode: b
        })
    },
    _onMouseDown: function (b) {
        var a = this;
        a.dispatchEvent("dragdown", {
            event: b
        })
    },
    _onDblClick: function (b) {
        var a = this;
        a.focus();
        a.isToggle && a.toggle();
        a.getTree().dispatchEvent("dblclick", {
            treeNode: a,
            event: b
        })
    },
    _onContextmenu: function (b) {
        var a = this;
        return a.getTree().dispatchEvent("contextmenu", {
            treeNode: a,
            event: b
        })
    },
    _onToggleClick: function (b) {
        var a = this;
        a.isToggle && a.toggle();
        a.getTree().dispatchEvent("toggle", {
            treeNode: a
        });
        baidu.event.stopPropagation(b)
    },
    _createBodyStringArray: function () {
        var b = this,
		a = b._stringArray;
        a.push('<dt id="', b.id, '-node" class="tangram-tree-node-node"');
        if (b.skin) {
            a.push(" ", b.skin, "-node")
        }
        a.push(' onclick="', b._getCallRef() + ("._onClick(event)"), '"> <span id="', b.id, '-span">', b._getImagesString(true), "</span>");
        b._createIconStringArray();
        b._createTextStringArray();
        a.push("</dt>")
    },
    _getImagesString: function (c) {
        var b = this,
		a = "";
        a += b._getIdentString(c);
        if (b.type == "leaf") {
            a += b._getTLString(c)
        } else {
            if (b.type == "trunk") {
                if (b.children && b.children.length > 0) {
                    a += b._getToggleString(c)
                } else {
                    a += b._getTLString(c)
                }
            }
        }
        return a
    },
    _getIdentString: function (d) {
        var c = this,
		a = "",
		b;
        while (c.getParentNode() && c.getParentNode().type != "root") {
            c = c.getParentNode();
            b = (c.isLastNode(d) ? "blank" : "I");
            className = "tangram-tree-node-" + b;
            if (c.skin) {
                className += " " + c.skin + "-" + b
            }
            a = '<span   class="' + className + '"></span>' + a
        }
        return a
    },
    _getTLString: function (c) {
        var b = this,
		a = (b.isLastNode(c) ? "L" : "T");
        className = "tangram-tree-node-" + a;
        if (b.skin) {
            className += " " + b.skin + "-" + a
        }
        return '<span   class="' + className + '" ></span>'
    },
    _getToggleString: function (e) {
        var d = this,
		b = d.isExpand ? "minus" : "plus",
		c = (d.isLastNode(e) ? "L" : "T") + b,
		a = "tangram-tree-node-" + c;
        if (d.skin) {
            a += " " + d.skin + "-" + c
        }
        return ['<span onclick="', d._getCallRef(), '._onToggleClick(event)" class="', a, '" id="', d.id, '-toggle"></span>'].join("")
    },
    _createIconStringArray: function () {
        var c = this,
		b = (c.type == "leaf" ? "leaf" : "trunk"),
		a = c._stringArray;
        if (c.isOpen) {
            b = "open-trunk"
        }
        a.push('<span  class="tangram-tree-node-', b);
        if (c.skin) {
            a.push(" ", c.skin, "-", b)
        }
        a.push('" style="', c.icon ? "background-image:url(" + c.icon + ")" : "", '" id="', c.id, '-icon"></span>')
    },
    _createTextStringArray: function () {
        var b = this,
		c = (b.href ? b._createHrefStringArray() : b.text),
		a = b._stringArray;
        a.push('<span title="', b.title || b.text, '" id="', b.id, '-text" >', c, "</span></span>")
    },
    _createHrefStringArray: function () {
        var b = this,
		a = b._stringArray;
        a.push('<a id="', b.id, "-link", (b.target ? "target='" + b.target + "'" : ""), ' hidefocus="on" " href="', b.href, '" >', b.text, "</a>")
    },
    _getSpanElement: function () {
        return baidu.g(this._getId("span"))
    },
    _getIconElement: function () {
        return baidu.g(this._getId("icon"))
    },
    _getTextContainer: function () {
        return baidu.g(this._getId("textContainer"))
    },
    _getTextElement: function () {
        return baidu.g(this._getId("text"))
    },
    _getToggleElement: function () {
        return baidu.g(this._getId("toggle"))
    },
    _getSubNodesContainer: function () {
        return baidu.g(this._getId("subNodeId"))
    },
    _getHrefElement: function () {
        return baidu.g(this._getId("link"))
    },
    _getNodeElement: function () {
        return baidu.g(this._getId("node"))
    },
    _getContainer: function () {
        return baidu.g(this.id)
    },
    hide: function () {
        baidu.dom.hide(this._getNodeElement())
    },
    show: function () {
        baidu.dom.show(this._getNodeElement())
    },
    expandAll: function () {
        var a = this;
        if (a.children) {
            a.expand()
        }
        baidu.array.each(a.getChildNodes(),
		function (b) {
		    b.expandAll()
		})
    },
    collapseAll: function () {
        var a = this;
        if (a.getChildNodes().length > 0) {
            a.collapse()
        }
        baidu.array.each(a.getChildNodes(),
		function (b) {
		    b.collapseAll()
		})
    },
    getIndex: function () {
        var e = this,
		b = e.isRoot ? [] : e.getParentNode().getChildNodes(),
		c = -1;
        for (var d = 0, a = b.length; d < a; d++) {
            if (b[d] == e) {
                return d
            }
        }
        return c
    },
    getNext: function () {
        var c = this,
		b = c.getIndex(),
		a;
        if (c.isRoot) {
            return c
        }
        a = c.getParentNode().getChildNodes();
        return (b + 1 >= a.length) ? c : a[b + 1]
    },
    getPrevious: function () {
        var c = this,
		b = c.getIndex(),
		a;
        if (c.isRoot) {
            return c
        }
        a = c.getParentNode().getChildNodes();
        return (b - 1 < 0) ? c : a[b - 1]
    },
    getFirstChild: function () {
        var b = this,
		a = b.getChildNodes();
        return (a.length <= 0) ? null : a[0]
    },
    getLastChild: function () {
        var b = this,
		a = b.getChildNodes();
        return a.length <= 0 ? null : a[a.length - 1]
    },
    isLastNode: function (b) {
        var a = this;
        if (b) {
            return a._isLast
        }
        if (a.isRoot) {
            return true
        }
        return a.getIndex() == (a.parentNode.childNodes.length - 1)
    }
};
baidu.object.extend(baidu.ui.Tree.TreeNode.prototype, baidu.lang.Class.prototype);
baidu.ui.Tree.extend({
    uiType: "tree",
    tplDOM: "<div class='#{class}'>#{body}</div>",
    getString: function () {
        var a = this;
        return baidu.format(a.tplDOM, {
            "class": a.getClass(),
            body: a._getBodyString()
        })
    },
    render: function (a) {
        var b = this;
        b.renderMain(a).innerHTML = b.getString();
        b.dispatchEvent("onload")
    },
    _getBodyString: function () {
        var a = "",
		b = this;
        if (b.data) {
            b._rootNode = new baidu.ui.Tree.TreeNode(b.data);
            b._rootNode.isRoot = true;
            b._rootNode.type = "root";
            b._rootNode._level = 0;
            b._rootNode.setTree(b);
            a = b._rootNode.getString()
        }
        return a
    },
    getTreeNodes: function () {
        return this._treeNodes
    },
    getRootNode: function () {
        return this._rootNode
    },
    getTreeNodeById: function (a) {
        return this.getTreeNodes()[a]
    },
    getCurrentNode: function () {
        return this._currentNode
    },
    setCurrentNode: function (a) {
        this._currentNode = a
    },
    dispose: function () {
        var a = this;
        a.dispatchEvent("dispose");
        baidu.dom.remove(a.getMain());
        baidu.lang.Class.prototype.dispose.call(a)
    }
}); (function () {
    var a = baidu.ui.behavior.decorator = function () {
        this.addEventListener("onload",
		function () {
		    var c = this,
			b;
		    baidu.each(c.decorator,
			function (e, d) {
			    b = {
			        ui: c,
			        skin: c.skin
			    };
			    if (baidu.lang.isString(e)) {
			        b.type = e
			    } else {
			        baidu.extend(b, e)
			    }
			    c._decoratorInstance[d] = new baidu.ui.Decorator(b);
			    c._decoratorInstance[d].render()
			})
		});
        this.addEventListener("ondispose",
		function () {
		    this._decoratorInstance = [];
		    baidu.each(this._decoratorInstance,
			function (b) {
			    b.dispose()
			})
		})
    };
    a._decoratorInstance = [];
    a.getDecorator = function () {
        var b = this._decoratorInstance;
        return b.length > 0 ? b : b[0]
    }
})();
baidu.lang.createSingle = function (b) {
    var d = new baidu.lang.Class();
    for (var a in b) {
        d[a] = b[a]
    }
    return d
};
baidu.dom.ddManager = baidu.lang.createSingle({
    _targetsDroppingOver: {}
});
baidu.dom.intersect = function (j, h) {
    var f = baidu.dom.g,
	e = baidu.dom.getPosition,
	a = Math.max,
	c = Math.min;
    j = f(j);
    h = f(h);
    var d = e(j),
	b = e(h);
    return a(d.left, b.left) <= c(d.left + j.offsetWidth, b.left + h.offsetWidth) && a(d.top, b.top) <= c(d.top + j.offsetHeight, b.top + h.offsetHeight)
};
baidu.dom.droppable = function (e, c) {
    c = c || {};
    var d = baidu.dom.ddManager,
	g = baidu.dom.g(e),
	b = baidu.lang.guid(),
	f = function (k) {
	    var j = d._targetsDroppingOver,
		h = {
		    trigger: k.DOM,
		    reciever: g
		};
	    if (baidu.dom.intersect(g, k.DOM)) {
	        if (!j[b]) {
	            (typeof c.ondropover == "function") && c.ondropover.call(g, h);
	            d.dispatchEvent("ondropover", h);
	            j[b] = true
	        }
	    } else {
	        if (j[b]) {
	            (typeof c.ondropout == "function") && c.ondropout.call(g, h);
	            d.dispatchEvent("ondropout", h)
	        }
	        delete j[b]
	    }
	},
	a = function (j) {
	    var h = {
	        trigger: j.DOM,
	        reciever: g
	    };
	    if (baidu.dom.intersect(g, j.DOM)) {
	        typeof c.ondrop == "function" && c.ondrop.call(g, h);
	        d.dispatchEvent("ondrop", h)
	    }
	    delete d._targetsDroppingOver[b]
	};
    d.addEventListener("ondrag", f);
    d.addEventListener("ondragend", a);
    return {
        cancel: function () {
            d.removeEventListener("ondrag", f);
            d.removeEventListener("ondragend", a)
        }
    }
}; (function () {
    var a = baidu.ui.behavior.droppable = function () {
        var b = this;
        b.dropOptions = baidu.extend({
            ondropover: function (c) {
                b.dispatchEvent("ondropover", c)
            },
            ondropout: function (c) {
                b.dispatchEvent("ondropout", c)
            },
            ondrop: function (c) {
                b.dispatchEvent("ondrop", c)
            }
        },
		b.dropOptions);
        b.addEventListener("onload",
		function () {
		    b.dropHandler = b.dropHandler || b.getBody();
		    b.dropUpdate(b)
		})
    };
    a.dropUpdate = function (b) {
        var c = this;
        b && baidu.extend(c, b);
        c._theDroppable && c._theDroppable.cancel();
        if (!(c.droppable)) {
            return
        }
        c._theDroppable = baidu.dom.droppable(c.dropHandler, c.dropOptions)
    }
})(); (function () {
    var b = baidu.ui.behavior.sortable = function () {
        this.addEventListener("dispose",
		function () {
		    baidu.event.un(me.element, "onmousedown", handlerMouseDown)
		})
    };
    b.sortUpdate = function (p, j, k) {
        var h,
		l,
		m,
		n = this,
		o,
		k = k || {};
        if (n.sortDisabled) {
            return false
        }
        k.sortElements = p;
        baidu.object.extend(n, k);
        n.sortHandlers = n.sortHandlers || n.sortElements;
        n.element = j;
        n.sortRangeElement = baidu.g(n.sortRangeElement) || document.body;
        o = baidu.dom.getPosition(n.sortRangeElement);
        if (n.sortElements) {
            n._sortPosition = baidu.dom.getStyle(n.sortElements[0], "position")
        }
        if (!n.sortRange) {
            n.sortRange = [o.top, o.left + n.sortRangeElement.offsetWidth, o.top + n.sortRangeElement.offsetHeight, o.left]
        }
        baidu.event.on(n.element, "onmousedown", a)
    };
    function f(l, k) {
        var h = l.length,
		j = 0;
        for (; j < h; j++) {
            if (l[j] == k) {
                return true
            }
        }
    }
    function a(l) {
        var j = baidu.event.getTarget(l),
		h = baidu.dom.getPosition(j),
		k = j.offsetParent,
		m = (k.tagName == "BODY") ? {
		    left: 0,
		    top: 0
		} : baidu.dom.getPosition(k);
        if (!f(me.sortElements, j)) {
            return false
        }
        baidu.dom.setStyles(j, {
            left: (h.left - m.left) + "px",
            top: (h.top - m.top) + "px",
            position: "absolute"
        });
        me._sortBlankDivId = me._sortBlankDivId || c(j, me).id;
        baidu.dom.drag(j, {
            range: me.sortRange,
            ondragstart: function (n) {
                me.sortElementsMap = d(me.sortHandlers);
                me.dispatchEvent("sortstart", {
                    trigger: n
                })
            },
            ondrag: function (p) {
                var r = me.sortHandlers,
				q = 0,
				o = r.length,
				s,
				n = baidu.dom.getPosition(p);
                s = g(n.left, n.top, p.offsetWidth, p.offsetHeight, me.sortElementsMap);
                if (s != null) {
                    me._sortTarget = s;
                    baidu.dom.insertAfter(e(me), s)
                }
                me.dispatchEvent("sort", {
                    trigger: p
                })
            },
            ondragend: function (n) {
                if (me._sortTarget) {
                    baidu.dom.insertAfter(n, me._sortTarget);
                    me.dispatchEvent("sortend", {
                        trigger: n,
                        reciever: me._sortTarget
                    })
                }
                baidu.dom.remove(e(me));
                me._sortBlankDivId = null;
                baidu.dom.setStyles(n, {
                    position: me._sortPosition,
                    left: "0px",
                    top: "0px"
                })
            }
        })
    }
    function g(k, r, j, s, h) {
        var o,
		n,
		l,
		u,
		t,
		p,
		q = Math.max,
		m = Math.min;
        for (o in h) {
            p = o.split("-");
            u = +p[0];
            t = +p[1];
            l = +p[2];
            n = +p[3];
            if (q(u, k) <= m(u + l, k + j) && q(t, r) <= m(t + n, r + s)) {
                return h[o]
            }
        }
        return null
    }
    function d(j) {
        var k = {},
		h;
        baidu.each(j,
		function (l) {
		    h = baidu.dom.getPosition(l);
		    k[h.left + "-" + h.top + "-" + l.offsetWidth + "-" + l.offsetHeight] = l
		});
        return k
    }
    function e(h) {
        return baidu.g(h.getId("sortBlankDiv"))
    }
    function c(h, j) {
        var k = baidu.dom.create("div", {
            id: j.getId("sortBlankDiv"),
            className: h.className
        });
        baidu.dom.setStyles(k, {
            width: h.offsetWidth + "px",
            height: h.offsetHeight + "px",
            borderWidth: "0px"
        });
        baidu.dom.insertBefore(k, h);
        return k
    }
})();
baidu.browser.firefox = /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? +RegExp["\x241"] : undefined;
baidu.page.createStyleSheet = function (a) {
    var f = a || {},
	d = f.document || document,
	c;
    if (baidu.browser.ie) {
        if (!f.url) {
            f.url = ""
        }
        return d.createStyleSheet(f.url, f.index)
    } else {
        c = "<style type='text/css'></style>";
        f.url && (c = "<link type='text/css' rel='stylesheet' href='" + f.url + "'/>");
        baidu.dom.insertHTML(d.getElementsByTagName("HEAD")[0], "beforeEnd", c);
        if (f.url) {
            return null
        }
        var b = d.styleSheets[d.styleSheets.length - 1],
		e = b.rules || b.cssRules;
        return {
            self: b,
            rules: b.rules || b.cssRules,
            addRule: function (g, j, h) {
                if (b.addRule) {
                    return b.addRule(g, j, h)
                } else {
                    if (b.insertRule) {
                        isNaN(h) && (h = e.length);
                        return b.insertRule(g + "{" + j + "}", h)
                    }
                }
            },
            removeRule: function (g) {
                if (b.removeRule) {
                    b.removeRule(g)
                } else {
                    if (b.deleteRule) {
                        isNaN(g) && (g = 0);
                        b.deleteRule(g)
                    }
                }
            }
        }
    }
};
baidu.ui.createPopup = function (d) {
    var c = baidu.lang.createSingle({
        isOpen: false
    });
    c.eid = "baidupopup_" + c.guid;
    var b,
	g,
	a = "font-size:12px; margin:0;";
    try {
        baidu.browser.ie && (b = window.createPopup())
    } catch (f) { }
    if (!b) {
        var h = "<iframe id='" + c.eid + "' scrolling='no' frameborder='0' style='position:absolute; z-index:1001;  width:0px; height:0px; background-color:#0FFFFF'></iframe>";
        if (!document.body) {
            document.write(h)
        } else {
            baidu.dom.insertHTML(document.body, "afterbegin", h)
        }
    }
    c.render = function () {
        var k = this;
        if (b) {
            k.window = b;
            k.document = b.document;
            var j = k.styleSheet = k.createStyleSheet();
            j.addRule("body", a);
            k.dispatchEvent("onready")
        } else {
            e()
        }
        baidu.event.on(window, "onblur",
		function () {
		    k.focusme = false;
		    if (!k.isOpen) {
		        return
		    }
		    setTimeout(function () {
		        if (!k.focusme) {
		            k.hide()
		        }
		    },
			100)
		});
        baidu.event.on(window, "onresize",
		function () {
		    k.hide()
		});
        baidu.event.on(document, "onmousedown",
		function () {
		    k.hide()
		})
    };
    function e(j) {
        g = baidu.dom.g(c.eid);
        if ((!j && baidu.browser.firefox) || !g) {
            setTimeout(function () {
                e(true)
            },
			10);
            return
        }
        c.window = g.contentWindow;
        var l = c.document = c.window.document;
        var k = "<html><head><style type='text/css'>body{" + a + " background-color:#FFFFFF;}\n</style></head><body onfocus='parent[\"" + baidu.guid + '"]._instances["' + c.guid + "\"].focusme=true'></body></html>";
        l.open();
        l.write(k);
        l.close();
        c.styleSheet = c.createStyleSheet();
        c.dispatchEvent("onready")
    }
    c.createStyleSheet = function (j) {
        j = j || {};
        j.document = this.document;
        return baidu.page.createStyleSheet(j)
    };
    c.show = function (p, o, n, k, l, j) {
        if (b) {
            if (j == "top") {
                o = -k
            } else {
                o = l.offsetHeight
            }
            b.show(0, o, n, k, l || document.body);
            this.isOpen = b.isOpen
        } else {
            if (g) {
                baidu.dom.show(this.eid);
                if (j == "top") {
                    o -= k
                } else {
                    o = o + l.offsetHeight
                }
                this.isOpen = true;
                var m = g.style;
                m.width = n + "px";
                m.height = k + "px";
                m.top = o + "px";
                m.left = p + "px"
            }
        }
        this.dispatchEvent("onshow")
    };
    c.bind = function (l, m, k, j) {
        var n = baidu.dom.getPosition(l);
        this.show(n.left, n.top, m, k, l, j)
    };
    c.hide = function () {
        if (this.isOpen) {
            if (b) {
                b.hide();
                this.isOpen = b.isOpen
            } else {
                if (g) {
                    this.isOpen = false;
                    var j = g.style;
                    j.width = "0px";
                    j.height = "0px";
                    baidu.dom.hide(this.eid)
                }
            }
            this.dispatchEvent("onhide")
        }
    };
    c.write = function (k) {
        var j = this;
        this.document.body.innerHTML = k
    };
    return c
};
baidu.ui.getAttribute = function (d) {
    var f = "data-tangram",
	j = d.getAttribute(f),
	c = {},
	e,
	b = baidu.string.trim;
    if (j) {
        j = j.split(";");
        e = j.length;
        for (; e--; ) {
            var k = j[e],
			g = k.indexOf(":"),
			a = b(g >= 0 ? k.substring(0, g) : k),
			h = g >= 0 ? b(k.substring(g + 1)) || "true" : "true";
            c[baidu.string.toCamelCase(b(a))] = /^\d+(\.\d+)?$/.test(h) ? h - 0 : h == "true" ? true : h == "false" ? false : h
        }
    }
    return c
};
T.undope = true;
var FullColorArray = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'];