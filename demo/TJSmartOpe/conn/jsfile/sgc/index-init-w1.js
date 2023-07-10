/*v=1.21.1101.1*/
Vue.component("bottom-menu", {
    data: function () {
        return {
            title: "",
            menus: [],
            startIndex: 0,
            menusWidth: [],
            rMoving: false,
            lMoving: false
        };
    },
    computed: {
        totalWidth: function () {
            var w = 0;
            for (var i = 0; i < this.menusWidth.length; i++)
                w += this.menusWidth[i];
            return w + 4;
        },
        title1: function () {
            return this.title.toString().split(" ")[0];
        },
        title2: function () {
            var arr = this.title.toString().split(" ");
            if (arr.length > 1)
                return arr[1];
            return "";
        }
    },
    methods: {
        clickMenu: function (item) {
            item.click();
            this.$el.style.display = "none";
        },
        mouseOver: function (item) {
            item.imgUrl = item.imgUrl.replace(".png", "_active.png");
            item.txtClass += " divText-active";
        },
        mouseOut: function (item) {
            item.imgUrl = item.imgUrl.replace("_active.png", ".png");
            item.txtClass = item.txtClass.replace(" divText-active", "");
        },
        moveLeft: function () {
            this.lMoving = true;
            this.doMove(true);
        },
        setOnError: function (item) {
            return "if (this.src.indexOf('" + item.imgDef + "') < 0);this.src='" + item.imgDef + "';";
        },
        doMove: function (lr) {
            if (lr) {
                if (!this.lMoving)
                    return;
            } else {
                if (!this.rMoving)
                    return;
            }
            var pos = Math.ceil(this.$el.children[2].scrollLeft);// += (lr ? -220 : 220);
            var nextPos = 0;
            var c = 0;
            for (var i = 0; i < this.menusWidth.length; i++) {
                var w = this.menusWidth[i];
                if (lr) {
                    if (c + w >= pos) {
                        break;
                    }
                } else {
                    if (c + w > pos) {
                        nextPos = c + w;
                        break;
                    }
                }
                c += w;
                nextPos = c;
            }
            this.$el.children[2].scrollLeft = nextPos;

            var vm = this;
            window.setTimeout(function () { vm.doMove(lr) }, 500);
        },
        moveRight: function () {
            this.rMoving = true;
            this.doMove(false);
        },
        stopMoveRight: function () {
            this.rMoving = false;
        },
        stopMoveLeft: function () {
            this.lMoving = false;
        }
    },
    watch: {
        menus: function () {
            var vm = this;
            var el = this.$el;
            this.$nextTick(function () {
                var p = el.children[2].children[0];
                var arrWidth = [];
                for (var i = 0; i < p.children.length; i++)
                    arrWidth.push(p.children[i].offsetWidth);
                vm.menusWidth = arrWidth;
            })
        }
    },
    template: `<div id="divBottomMenu">
            <div id="divBottomMenuTitle">
                {{ title1 }}
                <br />
                {{ title2 }}
            </div>
            <div class="leftArrow" v-on:mouseover="moveLeft" v-on:mouseout="stopMoveLeft"><</div>
            <div id="divContentScroll" class="contentScroll">
                <div id="divBottomMenuContent" :style="{ width:totalWidth + 'px' }" class="content">
                    <div v-for="item in menus" class='item' v-on:click="clickMenu(item)" v-on:mouseover="mouseOver(item)" v-on:mouseout="mouseOut(item)"><img :src='item.imgUrl' :onerror='setOnError(item)' /><div :class="item.txtClass"> {{ item.imgText }} </div></div>
                </div>
            </div>
            <div class="rightArrow" v-on:mouseover="moveRight" v-on:mouseout="stopMoveRight">></div>
        </div>`
});

Vue.component('rich-button', {
    props: {
        "img": {
            type: String,
            "default": ""
        },
        "text": {
            type: String,
            "default": ""
        },
        "hori": {
            type: Boolean,
            "default": false
        }
    },
    computed: {
        styles: function () {
            if (this.hori)
                return { "margin-right": "3px" };
            return { display: "block" };;
        }
    },
    methods: {
        click: function () { this.$emit("click"); },
        mouseenter: function (e) { this.$emit("mouseenter", e); },
        mouseleave: function (e) { this.$emit("mouseleave", e); },
    },
    template: '<div @mouseenter="mouseenter($event)" @mouseleave="mouseleave($event)" style="cursor:pointer"><img class="rich-button-img" :src="img" @click="click" :style="styles" /><span class="rich-button-text" @click="click">{{ text }}</span></div>'
});

Vue.component("rightmenu", {
    props: {
        menus: {
            type: Array,
            "default": []
        },
        top: {
            type: Number, "default": 380
        },
        fold: {
            type: String, "default": "/"
        },
        apps: {
            type: Object
        }
    },
    data: function () {
        return {
            curModule: null,
            resetModule: false,
            moduleTop: 0,
            moduleLeft: 0
        };
    },
    methods: {
        getRootModuleStyle: function (item, index) {
            return null;
        },
        isSplit: function (item) {
            return item.type == "sep";
        },
        getSelectedSubs: function (item) {
            var arr = [];
            if (!item.subs) {
                if (this.isShowing(item))
                    arr.push(item)
            }
            else {
                for (var i = 0; i < item.subs.length; i++) {
                    var sub = item.subs[i];
                    if (this.isShowing(sub))
                        arr.push(sub);
                }
            }
            return arr;
        },
        getRealArg: function (arg) {
            switch (arg) {
                case "{gridid}":
                    return SelectCityInst.getLocateGrid();
                case "{dccid}":
                    return SelectCityInst.getLocateDcc();
                default:
                    return arg;
            }
        },
        clickModuleButton: function (module, parent) {
            if (module.disabled) return;
            if (module.subs) return;
            var id = module.id;
            var _this = this;
            (this.apps || _app).click(id, function () {
                module.state = _app[id].state
                _this.$forceUpdate();
            });
        },
        showModule: function (module, evt) {
            if (!module.subs)
                return;
            this.resetModule = false;
            this.curModule = module;
            var offset = $(evt.srcElement).offset();
            var top = offset.top;
            var left = $(this.$el).parent().width() - offset.left;
            var height = (parseInt(module.subs.length / 3, 10) + ((module.subs.length % 3 == 0) ? 0 : 1)) * 70 + 48 + 50;
            if (top + height > window.innerHeight)
                top = window.innerHeight - height;
            this.moduleTop = top + "px";
            this.moduleLeft = left + 'px';
        },
        hideModule: function (module) {
            this.resetModule = true;
            var vm = this;
            window.setTimeout(function () {
                if (vm.resetModule)
                    vm.curModule = null;
            }, 100);
        },
        getModuleSplits: function (module) {
            var num = 3;
            var ret = [];
            var lngth = module.subs.length;
            var lngthex = lngth;
            for (var i = 0; i < lngthex; i += num) {
                var row = [];
                for (var j = 0; (j < num) && (j <= lngth); j++) {
                    row.push(module.subs[i + j]);
                }
                for (; j < num; j++)
                    row.push(null);
                ret.push(row);
            }
            return ret;
        },
        getModuleStyle: function (item) {
            if (!item) return null;
            return this.isShowing(item) ? { background: '#19668d', "border-radius": "4px" } : null;
            //return this.isShowing(item) ? { border: '1px solid #dddddd' } : null;
        },
        findModule: function (arr, id) {
            for (var i = 0; i < arr.length; i++) {
                var module = arr[i];
                if (module.id == id)
                    return module;
                if (!module.subs)
                    continue;
                module = this.findModule(module.subs, id);
                if (null != module)
                    return module;
            }
            return null;
        },
        getModuleImg: function (item, bCur) {
            return this.fold + this.getModuleImgName(item, bCur) + ".png";
        },
        getModuleImgName: function (item, bNoFocus) {
            var img = item.img || item.id;
            if (item.disabled)
                return img + "_dis";
            if (item.subs)
                return img;
            var state = item.state;
            if (this.apps) {
                var app = this.apps[item.id];
                if (app)
                    state = app.state;
            }
            if (state && (!bNoFocus))
                return img + "_focus";
            return img;
        },
        getModuleText: function (item) {
            return item.name;
        },
        isShowing: function (m) {
            var id = m.id;
            var apps = this.apps || _app;
            return !!apps.getState(id);
        }
    },
    created: function () {

    },
    template: `<div>
            <div v-if="curModule != null" class="module-box" :style="{ top:moduleTop,right:moduleLeft }" v-on:mouseover="resetModule=false;" v-on:mouseout="hideModule(curModule)">
                <div class="module-caption">
                    <span>{{ getModuleText(curModule) }}</span>
                </div>
                <div class="module-container">
                    <div v-for="row in getModuleSplits(curModule)" class="module-row">
                        <div v-for="item in row" class="module-item" :style="getModuleStyle(item)" v-on:click="clickModuleButton(item,curModule)">
                            <img v-if="item" class="module-img" :src="getModuleImg(item,true)" /><span v-if="item" class="module-text">{{ getModuleText(item)}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <template v-for="(item,index) in menus">
                    <img v-if="isSplit(item)" src="/i/sgc/shengchan/menu/sep.png" />
                    <rich-button v-else :text="getModuleText(item)" :img="getModuleImg(item)" style="text-align:center;padding:5px;" :style="{ color:(item.disabled?'gray':'') }" v-on:click="clickModuleButton(item)" v-on:mouseenter="showModule(item,$event)" v-on:mouseleave="hideModule(item)"></rich-button>
                    <div v-if="false" style="text-align:right;height:29px;">
                        <div style="display:inline-block;position:relative;height:28px;padding:0 5px;" v-bind:style="getRootModuleStyle(item,index)">
                            <img v-if="getSelectedSubs(item).length > 0" src="/i/sgc/module/bk.png" style="position:absolute;z-index:-1;width:100%;height:28px;left:0;top:0;" />
                            <span style="font-size:16px;margin:5px 0 5px 5px;">
                                <span v-for="sub in getSelectedSubs(item)" style="margin-right:5px" v-on:click="clickModuleButton(sub,null)">{{getModuleText(sub)}}</span>
                            </span>
                        </div>
                        <div style="display:inline-block;padding:2px;background-color:white;border-bottom: solid 1px gray">
                            <img v-if="item.subs||isShowing(item)" :src="getModuleImg(item)" style="height:24px;width:24px;" v-on:click="clickModuleButton(item,null)" v-on:mouseover="showModule(item,$event)" v-on:mouseout="hideModule(item)" />
                            <Tooltip v-else :content="getModuleText(item)" placement="left"><img :src="getModuleImg(item)" style="height:24px;width:24px;" v-on:click="clickModuleButton(item,null)" v-on:mouseover="showModule(item,$event)" v-on:mouseout="hideModule(item)" /></Tooltip>
                        </div>
                    </div>
                </template>
            </div>
        </div>`
});


var AppHelper = {
    readValidTimes: function (options, now, min, end, callback) {
        //PDP.read("SGC", options.timesSQL, [now, now.getFullYear(), min, end], function (ret) {
        PDP.load(options.timesSQL, { now: now, start: min, end: end }, function (ret) {
            if (!ret.check("获取" + name + "信息失败", true))
                return;
            ret = ret.value;
            var times = [];
            for (var i = 0; i < ret.length; i++) {
                times.push(ret[i][0]);
            }
            times.sort();
            callback(times);
        });
    },
    getRecentTime: function (times, time) {
        var s = Ysh.Time.toString(time);
        if (times.length == 0) return s;
        for (var i = times.length - 1; i >= 0; i--) {
            var t = times[i];
            if (t > s)
                continue;
            if (t == s)
                return time;
            return t
        }
        return times[0];
    },
    resetBaseTime: function (tm, timeType, step) {
        if (step == 1) return tm;
        if ((timeType != "mi") && (timeType != "mm")) return tm;
        var mi = tm.getMinutes();
        return new Date(tm.getFullYear(), tm.getMonth(), tm.getDate(), tm.getHours(), mi - (mi % step), 0);
    },
}


var _app = {
    _shows: [],
    _loadState: {
    },
    _load: function (id, callback) {
        if (this._loadState[id])
            return;
        this._loadState[id] = true;
        Ysh.Refs.include(["/conn/jsfile/app/" + id + ".js"], function () {
            _app._loadState[id] = false;
            var app = _app[id];
            if (app) {
                app.id = id;
                if (!app.close)
                    app.close = function () { };
                app.floatPages = [];
                app.float = function (file, args, resizable, f) {
                    var p = vMain.floatPage(file, args, null, resizable, f);
                    this.floatPages.push(p);
                    return p;
                }
                callback();
                return;
                if (!app.click) {
                    app.click = function () {
                        if (this.state) {
                            if (this.close)
                                this.close();
                        } else {
                            this.open();
                        }
                        this.state = this.state ? 0 : 1;
                    }
                }
                _app.click(id, callback);
            }
        });
    },
    _isCompatible: function (app1, app2) {
        if (app1.compatible) {
            if (!app1.compatible(app2))
                return false;
            if (app2.compatible)
                return app2.compatible(app1);
            return true;
        } else {
            if (app2.compatible)
                return app2.compatible(app1);
            return false;
        }
    },
    _close: function (app) {
        app.state = 0;
        app.close();
        for (var i = 0; i < app.floatPages.length; i++) {
            vMain.destroyFloatPage(app.floatPages[i]);
        }
        this._shows.erase(app);
    },
    click: function (id, callback) {
        if (!callback) callback = function () { };
        var app = this[id];
        if (!app) {
            this._load(id, function () { /*if (!o) return; _app[id] = o;*/ _app.click(id, callback); });
            return;
        }
        if (app.state) {
            this._close(app);
            callback();
            return;
        }
        this.show(id);
        callback();
    },
    show: function (id, args) {
        var app = this[id];
        if (!app) {
            this._load(id, function () { _app.show(id, args); });
            return;
        }
        //去掉不兼容的app
        var items = this._shows;
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item == app) {
                app.open(args);
                return;
            }
            if (this._isCompatible(app, item))
                continue;
            this._close(item);
        }
        app.open(args);
        if (app.state)
            this._shows.push(app);
    },
    close: function (id) {
        var app = this[id];
        if (app)
            this._close(app);
    },
    closeAll: function () {
        for (var i = 0; i < this._shows.length; i++) {
            var app = this._shows[i];
            app.state = 0;
            app.close();
        }
        this.shows = [];
    },
    getState: function (id) {
        var app = this[id];
        if (!app) return 0;
        return app.state;
    },
    _dlg: function (options) {
        var app = {
            state: 0,
            dlg: null,
            compatible: function () { return true; },
            open: function (data) {
                this.state = 1;
                if (this.dlg) {
                    this.dlg.close();
                    //this.dlg.args = data;
                    //if (Ysh.Type.isFunction(options.name))
                    //    this.dlg.name = options.name(data);
                    //this.dlg.refresh(options.file);
                    //this.dlg.show = true;
                    //return;
                }
                //var dlg = Ysh.Vue.Dialog.show(options.name, options.file, data || {}, options.icon, options.width, options.height);
                options.isSingle = true;
                options.canMove = 0;
                var dlg = Ysh.Vue.Dialog.showEx(options.file, data || {}, options);
                var _this = this;
                dlg.fclose = function () {
                    _this.close();
                }
                this.dlg = dlg;
            },
            close: function () {
                this.state = 0;
                if (this.dlg && this.dlg.show)
                    this.dlg.close();
            }
        }
        return app;
    },
    _page: function (options) {
        var app = {
            state: 0,
            open: function (data) {
                var name = options.name;
                if (options.getName)
                    name = options.getName(data);
                var page = options.page;
                if (options.getPage)
                    page = options.getPage(data);
                var args = data || options.args;
                if (options.getArgs)
                    args = options.getArgs(data);
                vMain.showPage(this.id, name, page, args);
                if (options.legend)
                    vMain.setLegend(options.legend, true);
                this.state = 1;
                if (options.width) {
                    vLayout.$nextTick(function () { this.leftWidth = options.width; });
                }
            },
            close: function () {
                this.state = 0;
                vMain.closePage(this.id, true);
                if (options.legend)
                    vMain.setLegend(options.legend, false);
            }
        }
        return app;
    },
    _weather: function (app, options) {
        app.isWeatherApp = true;
        app.canPlay = false;
        app.getLegend = function () { return this.legend; },
            app.display = function (time, force) {
                if (!force) {
                    if (time == this.time) return;
                }
                this.time = time;
                options.display(time, app);
            }
        app.open = function () {
            if (this.player) //还打开着
                return;
            var id = this.id;
            var player = {
                id: id,
                caption: this.name,
                min: options.min,
                max: options.max,
                timeType: options.timeType,
                times: [],
                changeTime: function (time) { app.display(time); },
                changeStartTime: function (time) {
                    if (time >= this.start)
                        return;
                    var _this = this;
                    Ysh.Delay.exec(id + "_times", 100, function () {
                        AppHelper.readValidTimes(options, new Date(), time, _this.start, function (times) {
                            for (var i = 0; i < times.length; i++)
                                _this.times.addSkipSame(times[i]);
                            _this.start = time;
                            vLayout.$refs.player.$forceUpdate();
                        });
                    });
                },
                setShowTime: function () {
                    var tm = Ysh.Time.formatString(new Date(), "111100") + ":00:00";
                    vMain.setShowTime(tm);
                    this.changeTime(tm);
                }
            };
            player.start = player.max;
            this.player = player;
            vMain.setLegend(this.getLegend(), true);
            vMain.addPlayer(this.player);
            vLayout.showPlayer = true;
            vLayout.$nextTick(function () {
                player.changeStartTime(vLayout.minSectionTime);
            });
            this.state = 1;
        },
            app.close = function () {
                var id = this.id;
                this.state = 0;
                vMain.closePlayer(this.id);
                if (options.close)
                    options.close();
                else
                    this.display(null);
                vMain.setLegend(this.getLegend(), false);
                this.player = null;
                this.time = "";
            }
        app.receive = function (msg) {
            if (msg.type != "mapchanged")
                return;
            if (this.gridid == SelectCityInst.getLocateGrid())
                return;
            if (!vMain.showPlayer) { vMain.forecastupdate = !vMain.forecastupdate; return; }
            this.gridid = SelectCityInst.getLocateGrid();
            this.display(this.time, true);
        }
        if (!app.caption) app.caption = app.name;
        return app;
    }
}