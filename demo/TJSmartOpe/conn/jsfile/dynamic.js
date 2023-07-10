var Class = (function () {
    function subclass() { }; 
    function create() {
        var parent = null,
        properties = $A(arguments); 
        if (Object.isFunction(properties[0]))
            parent = properties.shift();
        function klass() {
            this.initialize.apply(this, arguments);
        }
        Object.extend(klass, Class.Methods);
        klass.superclass = parent;
        klass.subclasses = [];
        if (parent) {
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass); 
        }
        for (var i = 0, length = properties.length; i < length; i++)
            klass.addMethods(properties[i]);
        if (!klass.prototype.initialize)
        {
            klass.prototype.initialize = function () { };
        }
        klass.prototype.constructor = klass;
        return klass;
    }
    function addMethods(source) {
        var ancestor = this.superclass && this.superclass.prototype, properties = Object.keys(source); 
        for (var i = 0, length = properties.length; i < length; i++) {
            var property = properties[i], value = source[property]; 
            this.prototype[property] = value;
        }
        return this;
    }
    return { create: create, Methods: { addMethods: addMethods} };
})(); 

(function () {
    var _toString = Object.prototype.toString, FUNCTION_CLASS = '[object Function]', NUMBER_CLASS = '[object Number]', STRING_CLASS = '[object String]';
    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property]; 
        return destination;
    }
    function keys(object) {
        var results = []; 
        for (var property in object) { 
            if (object.hasOwnProperty(property)) { results.push(property); } 
        }
        return results;
    }
    function isFunction(object) { return _toString.call(object) === FUNCTION_CLASS; }
    function isString(object) { return _toString.call(object) === STRING_CLASS; }
    function isNumber(object) { return _toString.call(object) === NUMBER_CLASS; }
    extend(Object, { 
        extend: extend, 
        keys: Object.keys || keys, 
        isFunction: isFunction, isString: isString, isNumber: isNumber
    });
})(); 

Object.extend(Function.prototype, (function () {
    var slice = Array.prototype.slice; 
    function update(array, args) { 
        var arrayLength = array.length, length = args.length; 
        while (length--) array[arrayLength + length] = args[length]; 
        return array; 
    }
    function merge(array, args) {
        array = slice.call(array, 0); 
        return update(array, args); 
    }
    function bind(context) { 
        var __method = this, args = slice.call(arguments, 1); 
        return function () { var a = merge(args, arguments); return __method.apply(context, a); } 
    }
    function bindAsEventListener(context) { 
        var __method = this, args = slice.call(arguments, 1); 
        return function (event) { var a = update([event || window.event], args); 
        return __method.apply(context, a); } 
    }
    function methodize() { 
        var __method = this; 
        return this._methodized = function () { 
            var a = update([this], arguments); 
            return __method.apply(null, a); 
        }; 
    }
    return { bind: bind, bindAsEventListener: bindAsEventListener, methodize: methodize }
})()); 
 
var $break = {}; 

var Enumerable = (function () {
    function each(iterator, context) {
        var index = 0; 
        try { this._each(function (value) { iterator.call(context, value, index++); }); } 
        catch (e) { if (e != $break) throw e; }
        return this;
    }
    function collect(iterator, context) { 
        iterator = iterator || function (x) { return x }; 
        var results = []; 
        this.each(function (value, index) { 
            results.push(iterator.call(context, value, index)); 
        }); 
        return results; 
    }
    function inject(memo, iterator, context) {
        this.each(function (value, index) {
            memo = iterator.call(context, memo, value, index);
        });
        return memo; 
    }
    return {
        each: each, 
        map: collect,
        inject: inject
    };
})(); 

function $A(iterable) {
    var length = iterable.length || 0, results = new Array(length); 
    while (length--) results[length] = iterable[length]; 
    return results; 
}

(function () {
    var arrayProto = Array.prototype, slice = arrayProto.slice, _each = arrayProto.forEach; 
    function each(iterator, context) { 
        for (var i = 0, length = this.length >>> 0; i < length; i++) { 
            if (i in this) iterator.call(context, this[i], i, this); 
        } 
    }
    if (!_each) _each = each; 
    Object.extend(arrayProto, Enumerable); 
    Object.extend(arrayProto, { _each: _each }); 
})(); 

var Hash = Class.create(Enumerable, (function () {
    function initialize(object) {
        this._object = {}; 
    }
    function set(key, value) {
        return this._object[key] = value; 
    }
    function get(key) {
        if (this._object[key] !== Object.prototype[key])
            return this._object[key];
    }

    return { initialize: initialize, set: set, get: get};
})()); 

Number.prototype.round = function(){
    return Math.round(this);
}

function $E(element) {
    if (Object.isString(element))
        element = document.getElementById(element); 
    return Element.extend(element);
}

if (typeof Element == "undefined")
    Element = function () { };

Element.Methods = {
    setStyle: function (element, styles) {
        element = $E(element); 
        for (var property in styles)
            element.style[property] = styles[property]; 
        return element;
    }, 
    getStyle: function (element, style) {
        element = $E(element); 
        var value = element.style[style]; 
        if (!value && element.currentStyle) 
            value = element.currentStyle[style]; 
        if (value == 'auto')
            return null;
        return value;
    },
    makePositioned: function (element) {
        element = $E(element); 
        var pos = Element.getStyle(element, 'position'); 
        if (pos == 'static' || !pos) { 
            element._madePositioned = true; 
            element.style.position = 'relative'; 
        }
        return element;
    }
}; 

Element.extend = (function () {
    var extend = Object.extend(function (element) { 
        if (!element || element.nodeType != 1 || element == window) 
            return element; 
        return element; 
    }); 
    return extend;
})(); 

Element.addMethods = function (methods) {
    Object.extend(Element.Methods, methods || {});
    function copy(methods, destination) {
        for (var property in methods) {
            var value = methods[property];
            destination[property] = value.methodize();
        }
    }
    copy(Element.Methods, Element.prototype); 
    Object.extend(Element, Element.Methods); 
};

(function () {
    Element.Offset = Class.create({ 
        initialize: function (left, top) { 
            this.left = left.round(); 
            this.top = top.round(); 
            this[0] = this.left; 
            this[1] = this.top; 
        }
    }); 
    function cumulativeOffset(element) {
        element = $E(element); 
        var valueT = 0, valueL = 0; 
        if (element.parentNode) { 
            do { 
                valueT += element.offsetTop || 0; 
                valueL += element.offsetLeft || 0; 
                element = element.offsetParent; 
            } while (element); }
        return new Element.Offset(valueL, valueT);
    }

    Element.addMethods({ cumulativeOffset: cumulativeOffset }); 
})(); 
 
 (function () {
    var Event = { 
    }; 
    function element(event) {
        event = Event.extend(event); 
        var node = event.target; 
        return Element.extend(node);
    }
    function pointer(event) { 
        return { x: pointerX(event), y: pointerY(event) }; 
    }
    function pointerX(event) {
        var docElement = document.documentElement, body = document.body || { scrollLeft: 0 }; 
        return event.pageX || (event.clientX + (docElement.scrollLeft || body.scrollLeft) - (docElement.clientLeft || 0));
    }
    function pointerY(event) {
        var docElement = document.documentElement, body = document.body || { scrollTop: 0 }; 
        return event.pageY || (event.clientY + (docElement.scrollTop || body.scrollTop) - (docElement.clientTop || 0));
    }
    function stop(event) { 
        Event.extend(event); 
        event.preventDefault(); 
        event.stopPropagation(); 
        event.stopped = true; 
    }
    Event.Methods = { element: element, pointer: pointer, pointerX: pointerX, pointerY: pointerY, stop: stop }; 
    var methods = Object.keys(Event.Methods).inject({}, function (m, name) { 
        m[name] = Event.Methods[name].methodize(); 
        return m; 
    }); 
    var additionalMethods = { 
        stopPropagation: function () { this.cancelBubble = true }, 
        preventDefault: function () { this.returnValue = false }
    }; 
    Event.extend = function (event, element) { 
        if (!event) return false; 
        var pointer = Event.pointer(event); 
        Object.extend(event, { target: event.srcElement || element, pageX: pointer.x, pageY: pointer.y }); 
        Object.extend(event, methods); 
        Object.extend(event, additionalMethods); 
        return event; 
    };

    function observe(element, eventName, handler) {
        element = $E(element); 
        var responder = function (event) { 
            Event.extend(event, element); 
            handler.call(element, event); 
        }; 
        responder.handler = handler; 
        element.attachEvent("on" + eventName, responder);
        return element;
    }

    Object.extend(Event, Event.Methods); 
    Object.extend(Event, { observe: observe }); 
    Element.addMethods({ observe: observe }); 
    Object.extend(document, { observe: observe.methodize(), loaded: false }); 
    if (window.Event) 
        Object.extend(window.Event, Event); 
    else
        window.Event = Event;
})();

var Effect = {
    DefaultOptions: {
        duration: 1.0, from: 0.0, to: 1.0, queue: 'parallel'
    }
}; 

Effect.ScopedQueue = Class.create(Enumerable, {
    initialize: function () {
        this.effects = [];
        this.interval = null;
    },
    add: function (effect) {
        var timestamp = new Date().getTime();
        effect.startOn += timestamp;
        effect.finishOn += timestamp;
        this.effects.push(effect);
        if (!this.interval)
            this.interval = setInterval(this.loop.bind(this), 15);
    },
    loop: function () {
        var timePos = new Date().getTime();
        for (var i = 0, len = this.effects.length; i < len; i++)
            this.effects[i] && this.effects[i].loop(timePos);
    }
});

Effect.Queues = {
    instances: new Hash(), 
    get: function (queueName) {
        if (!Object.isString(queueName))
            return queueName;
        return this.instances.get(queueName) || this.instances.set(queueName, new Effect.ScopedQueue());
    }
};

Effect.Base = Class.create({
    position: null, 
    start: function (options) {
        this.options = Object.extend(Object.extend({}, Effect.DefaultOptions), options || {});
        this.currentFrame = 0;
        this.state = 'idle';
        this.startOn = 0;
        this.finishOn = this.startOn + (this.options.duration * 1000);
        this.fromToDelta = this.options.to - this.options.from;
        this.totalTime = this.finishOn - this.startOn;
        this.totalFrames = 100.0;
        this.render = (function () {
            function dispatch(effect, eventName) {
                if (effect.options[eventName])
                    effect.options[eventName](effect);
            }
        return function (pos) {
            if (this.state === "idle") {
                this.state = "running";
                dispatch(this, 'beforeSetup');
                if (this.setup) this.setup();
                dispatch(this, 'afterSetup'); 
            }
            if (this.state === "running") {
                pos = (((-Math.cos(pos * Math.PI) / 2) + .5) * this.fromToDelta) + this.options.from;
                this.position = pos; dispatch(this, 'beforeUpdate');
                if (this.update) this.update(pos);
                dispatch(this, 'afterUpdate'); 
            }
        };
    })(); 
    this.event('beforeStart'); 
    Effect.Queues.get(Object.isString(this.options.queue) ? 'global' : this.options.queue.scope).add(this);
    }, 
    loop: function (timePos) {
        if (timePos >= this.startOn) {
            if (timePos >= this.finishOn) { 
                this.render(1.0); 
                this.cancel(); 
                this.event('beforeFinish'); 
                if (this.finish) 
                    this.finish(); 
                this.event('afterFinish'); 
                return; 
            }
            var pos = (timePos - this.startOn) / this.totalTime, frame = (pos * this.totalFrames).round(); 
            if (frame > this.currentFrame) { 
                this.render(pos); 
                this.currentFrame = frame; 
            }
        }
    }, 
    cancel: function () {
        this.state = 'finished';
    }, 
    event: function (eventName) { 
        if (this.options[eventName]) 
            this.options[eventName](this); 
    }
});

Effect.Opacity = Class.create(Effect.Base, {
    initialize: function (element) {
        this.element = $E(element); 
        if ((!this.element.currentStyle.hasLayout))
            this.element.setStyle({ zoom: 1 }); 
        var options = Object.extend({ 
            to: 1.0 
        }, 
        arguments[1] || {}); 
        this.start(options);
    }
});

Effect.Move = Class.create(Effect.Base, { 
    initialize: function (element) { 
        this.element = $E(element); 
        var options = Object.extend({ x: 0, y: 0, mode: 'relative' }, arguments[1] || {}); 
        this.start(options); 
    }, 
    setup: function () { 
        this.element.makePositioned(); 
        this.originalLeft = parseFloat(this.element.getStyle('left') || '0'); 
        this.originalTop = parseFloat(this.element.getStyle('top') || '0'); 
    }, 
    update: function (position) { 
        this.element.setStyle({ 
            left: (this.options.x * position + this.originalLeft).round() + 'px', 
            top: (this.options.y * position + this.originalTop).round() + 'px' 
        }); 
    } 
}); 

var Draggables = {
    drags: [],
    observers: [], 
    register: function (draggable) {
        if (this.drags.length == 0) {
            this.eventMouseUp = this.endDrag.bindAsEventListener(this);
            this.eventMouseMove = this.updateDrag.bindAsEventListener(this);
            Event.observe(document, "mouseup", this.eventMouseUp);
            Event.observe(document, "mousemove", this.eventMouseMove);
        }
        this.drags.push(draggable);
    },
    activate: function (draggable) {
        window.focus(); 
        this.activeDraggable = draggable; 
    }, 
    deactivate: function () { this.activeDraggable = null; }, 
    updateDrag: function (event) { 
        if (!this.activeDraggable) 
            return; 
        var pointer = [Event.pointerX(event), Event.pointerY(event)]; 
        this._lastPointer = pointer; 
        this.activeDraggable.updateDrag(event, pointer); 
    }, 
    endDrag: function (event) {
        if (this._timeout) { clearTimeout(this._timeout); this._timeout = null; }
        if (!this.activeDraggable) return; 
        this._lastPointer = null; 
        this.activeDraggable.endDrag(event); 
        this.activeDraggable = null;
    },
    notify: function (eventName, draggable, event) {
        if (this[eventName + 'Count'] > 0)
            this.observers.each(function (o) { if (o[eventName]) o[eventName](eventName, draggable, event); }); 
        if (draggable.options[eventName]) draggable.options[eventName](draggable, event);
    }, 
    _cacheObserverCallbacks: function () { 
        ['onStart', 'onEnd', 'onDrag'].each(function (eventName) { 
            Draggables[eventName + 'Count'] = Draggables.observers.select(function (o) { return o[eventName]; }).length; 
        }); 
    }
};

var Draggable = Class.create({
    initialize: function (element) {
        var defaults = {
            reverteffect: function (element, top_offset, left_offset) {
                var dur = Math.sqrt(Math.abs(top_offset ^ 2) + Math.abs(left_offset ^ 2)) * 0.02;
                new Effect.Move(element, {
                    x: -left_offset,
                    y: -top_offset,
                    duration: dur,
                    queue: { scope: '_draggable', position: 'end' }
                });
            },
            endeffect: function (element) {
                var toOpacity = Object.isNumber(element._opacity) ? element._opacity : 1.0;
                new Effect.Opacity(element, {
                    duration: 0.2,
                    from: 0.7,
                    to: toOpacity,
                    queue: { scope: '_draggable', position: 'end' },
                    afterFinish: function () { Draggable._dragging[element] = false }
                });
            },
            zindex: 500,
            revert: true,
            scroll: window,
            scrollSensitivity: 20,
            scrollSpeed: 15
        };
        Object.extend(defaults, {
            starteffect: function (element) {
                Draggable._dragging[element] = true;
                new Effect.Opacity(element, { duration: 0.2, from: element._opacity, to: 0.7 });
            }
        });
        var options = Object.extend(defaults, arguments[1] || {});
        this.element = $E(element);
        if (!this.handle)
            this.handle = $E(options.handle);
        if (!this.handle)
            this.handle = this.element;
        Element.makePositioned(this.element);
        this.options = options;
        this.dragging = false;
        this.eventMouseDown = this.initDrag.bindAsEventListener(this);
        Event.observe(this.handle, "mousedown", this.eventMouseDown);
        Draggables.register(this);
    },
    currentDelta: function () {
        return ([parseInt(Element.getStyle(this.element, 'left') || '0'), parseInt(Element.getStyle(this.element, 'top') || '0')]);
    },
    initDrag: function (event) {
        if (event.button === 1) {
            var src = Event.element(event);
            if ((tag_name = src.tagName.toUpperCase()) && (tag_name == 'INPUT' || tag_name == 'SELECT' || tag_name == 'OPTION' || tag_name == 'BUTTON' || tag_name == 'TEXTAREA')) return;
            var pointer = [Event.pointerX(event), Event.pointerY(event)];
            var pos = this.element.cumulativeOffset();
            this.offset = [0, 1].map(function (i) { return (pointer[i] - pos[i]) });
            Draggables.activate(this);
            Event.stop(event);
        }
    },
    startDrag: function (event) {
        this.dragging = true;
        if (!this.delta)
            this.delta = this.currentDelta();
        if (this.options.zindex) {
            this.originalZ = parseInt(Element.getStyle(this.element, 'z-index') || 0);
            this.element.style.zIndex = this.options.zindex;
        }
        if (this.options.scroll == window) {
            var where = this._getWindowScroll(this.options.scroll);
            this.originalScrollLeft = where.left;
            this.originalScrollTop = where.top;
        }
        Draggables.notify('onStart', this, event);
        if (this.options.starteffect)
            this.options.starteffect(this.element);
    },
    updateDrag: function (event, pointer) {
        if (!this.dragging)
            this.startDrag(event);
        Draggables.notify('onDrag', this, event);
        this.draw(pointer);
        if (this.options.scroll) {
            this.stopScrolling();
            var p;
            if (this.options.scroll == window) {
                with (this._getWindowScroll(this.options.scroll)) {
                    p = [left, top, left + width, top + height];
                }
            }
            var speed = [0, 0];
            if (pointer[0] < (p[0] + this.options.scrollSensitivity))
                speed[0] = pointer[0] - (p[0] + this.options.scrollSensitivity);
            if (pointer[1] < (p[1] + this.options.scrollSensitivity))
                speed[1] = pointer[1] - (p[1] + this.options.scrollSensitivity);
            if (pointer[0] > (p[2] - this.options.scrollSensitivity))
                speed[0] = pointer[0] - (p[2] - this.options.scrollSensitivity);
            if (pointer[1] > (p[3] - this.options.scrollSensitivity))
                speed[1] = pointer[1] - (p[3] - this.options.scrollSensitivity);
            this.startScrolling(speed);
        }
        Event.stop(event);
    },
    finishDrag: function (event, success) {
        this.dragging = false;
        var dropped = false;
        if (success) {
            if (!dropped) dropped = false;
        }
        if (dropped && this.options.onDropped)
            this.options.onDropped(this.element);
        Draggables.notify('onEnd', this, event);
        var revert = this.options.revert;
        if (revert && Object.isFunction(revert)) revert = revert(this.element);
        var d = this.currentDelta();
        if (revert && this.options.reverteffect) {
            if (dropped == 0 || revert != 'failure')
                this.options.reverteffect(this.element, d[1] - this.delta[1], d[0] - this.delta[0]);
        }
        if (this.options.zindex)
            this.element.style.zIndex = this.originalZ;
        if (this.options.endeffect)
            this.options.endeffect(this.element);
        Draggables.deactivate(this);
    },
    endDrag: function (event) {
        if (!this.dragging) return;
        this.stopScrolling();
        this.finishDrag(event, true);
        Event.stop(event);
    },
    draw: function (point) {
        var pos = this.element.cumulativeOffset();
        var d = this.currentDelta();
        pos[0] -= d[0];
        pos[1] -= d[1];

        var p = [0, 1].map(function (i) { return (point[i] - pos[i] - this.offset[i]) } .bind(this));

        var style = this.element.style;
        style.left = p[0] + "px";
        style.top = p[1] + "px";
        if (style.visibility == "hidden") style.visibility = "";
    },
    stopScrolling: function () {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
            Draggables._lastScrollPointer = null;
        }
    },
    startScrolling: function (speed) {
        if (!(speed[0] || speed[1])) return;
        this.scrollSpeed = [speed[0] * this.options.scrollSpeed, speed[1] * this.options.scrollSpeed];
        this.lastScrolled = new Date();
        this.scrollInterval = setInterval(this.scroll.bind(this), 10);
    }
    ,
    scroll: function () {
        var current = new Date();
        var delta = current - this.lastScrolled;
        this.lastScrolled = current;
        if (this.options.scroll == window) {
            with (this._getWindowScroll(this.options.scroll)) {
                if (this.scrollSpeed[0] || this.scrollSpeed[1]) {
                    var d = delta / 1000;
                    this.options.scroll.scrollTo(left + d * this.scrollSpeed[0], top + d * this.scrollSpeed[1]);
                }
            }
        }
        Draggables.notify('onDrag', this);
    },
    _getWindowScroll: function (w) {
        var T, L, W, H;
        with (w.document) {
            if (w.document.documentElement && documentElement.scrollTop) {
                T = documentElement.scrollTop;
                L = documentElement.scrollLeft;
            }
            else if (w.document.body) { T = body.scrollTop; L = body.scrollLeft; }
            if (w.innerWidth) {
                W = w.innerWidth; H = w.innerHeight;
            }
            else if (w.document.documentElement && documentElement.clientWidth) {
                W = documentElement.clientWidth;
                H = documentElement.clientHeight;
            }
            else { W = body.offsetWidth; H = body.offsetHeight; }
        }
        return { top: T, left: L, width: W, height: H };
    }
});
Draggable._dragging = {};

var Sortable = {
    create: function (element) {        
        element = $E(element);
        (Element.findChildren(element, 'LI') || []).each(function (e, i) {
            new Draggable(e, { handle: e });
        });
    }
};
Element.findChildren = function (element, tagName) {
    var elements = []; 
    $A(element.childNodes).each(function (e) {
        if (e.tagName && e.tagName.toUpperCase() == tagName)
            elements.push(e);
    }); 
    return elements;
};