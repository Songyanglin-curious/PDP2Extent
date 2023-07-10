/*v=1.21.507.1*/
Vue.component("resize-box", {
    data: function () {
        return { sizing: false, width: "", height: "" }
    },
    props: {
        max: {
            type: Object,
            "default": function () {
                return {
                    width: 0,
                    height: 0
                }
            },
            validator: function (obj) {
                if (typeof obj.width === 'number' || typeof obj.height === 'number') {
                    if (obj.width >= 0 && obj.height >= 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            }
        },
        min: {
            type: Object,
            "default": function () {
                return {
                    width: 0,
                    height: 0
                }
            },
            validator: function (obj) {
                if (typeof obj.width === 'number' || typeof obj.height === 'number') {
                    if (obj.width >= 0 && obj.height >= 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            }
        },
        move: {
            type: Object,
            "default": function () {
                return {
                    t: true,
                    l: true,
                    r: true,
                    b: true,
                    tl: true,
                    tr: true,
                    bl: true,
                    br: true
                }
            },
            validator: function (obj) {
                if (
                    typeof obj.t === 'boolean'
                    || typeof obj.l === 'boolean'
                    || typeof obj.r === 'boolean'
                    || typeof obj.b === 'boolean'
                    || typeof obj.tl === 'boolean'
                    || typeof obj.tr === 'boolean'
                    || typeof obj.bl === 'boolean'
                    || typeof obj.br === 'boolean'
                ) {
                    return true
                } else {
                    return false
                }
            }
        },
        speed: {
            type: Number,
            "default": 1,
            validator: function (num) {
                return num >= 1
            }
        },
        disabled: {
            type: Boolean,
            "default": false
        },
        moveobj: {
            "default": 0
        },
        minimize: {
            type: Boolean,
            "default": false
        }
    },
    methods: {
        getStyle: function (element) {
            if (element.currentStyle) {
                return element.currentStyle
            } else {
                return getComputedStyle(element, false)
            }
        },
        mousedownHanlder: function (event) {
            var cursor = this.getStyle(event.target).cursor;
            this.dataType = event.target.getAttribute('data-type')
            this.event = event
            this.sizing = true;
            document.body.addEventListener('mousemove', this.mousemoveHandler)
            document.body.style.cursor = cursor
            document.body.addEventListener('mouseup', this.mouseupHanlder)
        },
        mouseupHanlder: function () {
            this.sizing = false;
            document.body.removeEventListener('mousemove', this.mousemoveHandler)
            document.body.removeEventListener('mouseup', this.mouseupHanlder)
            document.body.style.cursor = 'default'
        },
        mousemoveHandler: function (event) {
            if (this.disabled) {
                return
            }
            var s = this.getStyle(this.$refs.box);
            var width = s.width;
            var height = s.height;
            width = parseInt(width)
            height = parseInt(height)
            this[this.dataType](event, width, height)
            this.event = event
            if (this.resize)
                this.resize();
        },
        t: function (event, width, height) {
            if (event.y > this.event.y) {
                this.height = this.min.height
                    ? `${Math.max(this.min.height, height - (event.y - this.event.y) * this.speed)}px`
                    : `${height - (event.y - this.event.y) * this.speed}px`
            } else {
                this.height = this.max.height
                    ? `${Math.min(this.max.height, height + (this.event.y - event.y) * this.speed)}px`
                    : `${height + (this.event.y - event.y) * this.speed}px`
            }
        },
        l: function (event, width, height) {
            if (event.x > this.event.x) {
                this.width = this.min.width
                    ? `${Math.max(this.min.width, width - (event.x - this.event.x) * this.speed)}px`
                    : `${width - (event.x - this.event.x) * this.speed}px`
            } else {
                this.width = this.max.width
                    ? `${Math.min(this.max.width, width + (this.event.x - event.x) * this.speed)}px`
                    : `${width + (this.event.x - event.x) * this.speed}px`
            }
        },
        r: function (event, width, height) {
            if (event.x > this.event.x) {
                this.width = this.max.width
                    ? `${Math.min(this.max.width, width + (event.x - this.event.x) * this.speed)}px`
                    : `${width + (event.x - this.event.x) * this.speed}px`
            } else {
                this.width = this.min.width
                    ? `${Math.max(this.min.width, width - (this.event.x - event.x) * this.speed)}px`
                    : `${width - (this.event.x - event.x) * this.speed}px`
            }
        },
        b: function (event, width, height) {
            if (event.y > this.event.y) {
                this.height = this.max.height
                    ? `${Math.min(this.max.height, height + (event.y - this.event.y) * this.speed)}px`
                    : `${height + (event.y - this.event.y) * this.speed}px`
            } else {
                this.height = this.min.height
                    ? `${Math.max(this.min.height, height - (this.event.y - event.y) * this.speed)}px`
                    : `${height - (this.event.y - event.y) * this.speed}px`
            }
        },
        tl: function (event, width, height) {
            this.t(event, width, height)
            this.l(event, width, height)
        },
        tr: function (event, width, height) {
            this.t(event, width, height)
            this.r(event, width, height)
        },
        bl: function (event, width, height) {
            this.b(event, width, height)
            this.l(event, width, height)
        },
        br: function (event, width, height) {
            this.b(event, width, height)
            this.r(event, width, height)
        }
    },
    template: `<div><div v-show="sizing" style="width:100%;height:100%;z-index:99999;position:fixed"></div>
        <div ref="box" v-movable="1" :class ="['resize-box', {disresize: disabled}]" :style="{ border:minimize?'none':'', width:minimize?0:width,height:minimize?0:height }">
            <div style="width:100%;height:100%"><slot /></div>
            <div v-if="move.t&&false" class="resize-line resize-line-t" data-type="t" @mousedown.prevent.stop="mousedownHanlder" />
            <div v-if="move.l&&false" class ="resize-line resize-line-l" data-type="l" @mousedown.prevent.stop="mousedownHanlder" />
            <div v-if="move.r" class ="resize-line resize-line-r" data-type="r" @mousedown.prevent.stop="mousedownHanlder" />
            <div v-if="move.b" class ="resize-line resize-line-b" data-type="b" @mousedown.prevent.stop="mousedownHanlder" />
            <div v-if="move.tl&&false" class ="resize-block resize-block-tl" data-type="tl" @mousedown.prevent.stop="mousedownHanlder" />
            <div v-if="move.tr&&false" class ="resize-block resize-block-tr" data-type="tr" @mousedown.prevent.stop="mousedownHanlder" />
            <div v-if="move.bl&&false" class ="resize-block resize-block-bl" data-type="bl" @mousedown.prevent.stop="mousedownHanlder" />
            <div v-if="move.br" class ="resize-block resize-block-br" data-type="br" @mousedown.prevent.stop="mousedownHanlder" /></div></div>`
});

var vDynFile = {
    data: function () {
        return { /*isReady: false,*/ html: "", files: Ysh.Refs.loads, bLoading: false, forceReset: true, loaded: false };
    },
    props: {
        "file": String,
        "args": Object,
        "hackReset": { "default": true },
        "version": { "default": "" },
        "hide": { "default": false },
        "attrs": Object,
        "styles":Object,
        "resizable": { "default": true }
    },
    computed: {
        ctrlName: function () { if (!this.isReady) return ""; if (!this.file) return ""; return "ysh_" + this.file; },
        isReady: function () {
            if (!this.files)
                return false;
            return this.files[this.file];
        },
        ver: function () {
            if (!this.version)
                return (new Date()).getTime();
            return this.version;
        }
    },
    methods: {
        includeRefs: function (refs) {
            Ysh.Refs.include(refs);
        },
        show: function () {
            if (this.bLoading)
                return;
            if (!this.file)
                return;
            if (this.isReady) {
                this.loaded = true;
                return;
            }
            this.bLoading = true;
            var o = this;
            Ysh.Refs.include("../html/" + this.file + "_ref.js?v=" + this.ver, function () {
                var refs = Ysh.Refs["df_" + o.file];
                if (!refs) {
                    refs = [];
                }
                refs.push("../html/" + o.file + ".js?v=" + o.ver);
                o.includeRefs(refs);
                o.bLoading = false;
                o.loaded = true;
            });
        },
        invoke: function (m, args) {
            var p = this.getFileVueObject();
            if (!p) return;
            var f = p[m];
            if (!f) return;
            f.apply(p, args);
        },
        resetAttrs: function () {
            if (!this.attrs) return;
            var vm = this.getFileVueObject();
            if (!vm) return;
            for (var k in this.attrs) {
                vm[k] = this.attrs[k];
            }
        },
        receive: function (event) {
            var _vm = this.getFileVueObject();
            if (!_vm) return;
            if (!_vm.receive) return;
            _vm.receive(event);
        },
        getFileVueObject: function () {
            if (this.$children.length == 0) return null;
            return this.$children[0];
        }
    },
    created: function () { //有可能有问题，如果子文件里需要用到dom对象就会失败，但是mounted会导致控件内容里的props函数传递出问题
        this.show();
    },
    mounted: function () {
        if (this.$el && this.$el.children && this.$el.children.length > 0) {
            this.$emit("load");
            this.resetAttrs();
        }
        if (this.hide)
            this.$el.style.display = "none";
    },
    updated: function () {
        if (this.$el && this.$el.children && this.$el.children.length > 0) {
            this.$emit("load");
            this.resetAttrs();
        }
    },
    watch: {
        file: function () {
            this.show();
        },
        args: function () {
            //this.show();
            this.forceReset = false;
            this.$nextTick(function () {
                this.forceReset = true;
            });
        },
        attrs: function () {
            this.resetAttrs();
        }
    }
}

Vue.component('dynfile', {
    mixins: [vDynFile],
    template: `<component v-bind:is="ctrlName" :style="styles" v-bind="args" v-show="isReady&&(!hide)" v-if="hackReset&&forceReset&&loaded"></component>`
});

Vue.component('sizablefile', {
    data: function () { return { moveobj: 0 }; },
    props: ["css", "minimize", "min", "width", "height"],
    mixins: [vDynFile],
    methods: {
        getFileVueObject: function () {
            if (this.$children.length == 0) return null;
            var _vm = this.$children[0];
            if (!_vm) return null;
            return _vm.$children[0];
        }
    },
    mounted: function () {
        var vm = this.$children[0];
        if (!vm) return;
        if (this.height)
            vm.height = this.height;
        if (this.width)
            vm.width = this.width;
    },
    template: `<resize-box :style="css" :minimize="minimize" :min="min" :disabled="!resizable"><component ref="ctrl" v-bind:is="ctrlName" v-bind="args" v-show="isReady&&(!hide)" v-if="hackReset&&forceReset&&loaded"></resize-box>`
});