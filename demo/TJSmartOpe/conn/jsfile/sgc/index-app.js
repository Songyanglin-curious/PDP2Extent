/*v=1.21.223.1*/
var YshManager = {
    apps: {},
    configs: {
        common: [],
        groups: [
                {
                    name: "断面设置",
                    cfgs: [
                        {
                            id: "showSection", name: "显示断面数据", type: "onoff", value: "1",
                            refresh: function () {
                                userSettings.itemShowSectionType.value = this.value;
                                userSettings.changeShowSectionData();
                            }
                        },
                        {
                            id: "sectionLimit", name: "断面限值", type: "onoff", value: "1",
                            refresh: function () {
                                vMain.sendBusinessMsg("", { type: "sectionsettings", name: this.id, value: this.value });
                            }
                        },
                        {
                            id: "sectionValue", name: "断面实时值", type: "onoff", value: "1",
                            refresh: function () {
                                vMain.sendBusinessMsg("", { type: "sectionsettings", name: this.id, value: this.value });
                            }
                        },
                        {
                            id: "sectionYudu", name: "断面裕度", type: "onoff", value: "1",
                            refresh: function () {
                                vMain.sendBusinessMsg("", { type: "sectionsettings", name: this.id, value: this.value });
                            }
                        }
                    ]
                },
            {
                name: "潮流设置",
                cfgs: [
                    {
                        id: "chaoliuVoltage", name: "线路潮流", type: "checkbox", options: "1,直流,1001,1000kV,1002,750kV,1003,500kV,1004,330kV,1005,220kV", value: [],
                        refresh: function () {
                            stationFilter.bschaoliu = this.value;
                            stationFilter.changeBsChaoliu();
                        }
                    },
                    {
                        id: "chaoliu_dir", name: "潮流方向", type: "onoff", options: "", value: "0",
                        refresh: function () {
                            SGCChaoliu.showDirection = this.value == "1";
                            stationFilter.setChaoliuDataState();
                        }
                    },
                    {
                        id: "chaoliu_value", name: "潮流数值", type: "onoff", options: "", value: "0",
                        refresh: function () {
                            SGCChaoliu.showValue = this.value == "1";
                            stationFilter.setChaoliuDataState();
                        }
                    },
                    {
                        id: "chaoliu", name: "线路点击显示潮流", type: "onoff", options: "", value: "0",
                        refresh: function () {
                            stationFilter.isShowChaoLiu = this.value == "1";
                        }
                    }
                ]
            },
            {
                name: "地图设置",
                cfgs: [
                    {
                        id: "towerCount", name: "电网模式", type: "list", options: "0,地理图,1,直连图,2,系统图", value: "0",
                        refresh: function () {
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshYunTu', selstate: 1 });
                        }
                    },
                    {
                        id: "pickupCoordinate", name: "坐标拾取", type: "onoff", options: "", value: "0",
                        refresh: function () {
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'mapCoordinatePickup', selstate: this.itemShowPoint.value == "1", data: {} });
                        }
                    }
                ]
            },
            {
                name: "区域设置",
                cfgs: [
                    {
                        id: "innet", name: "区外电网", type: "onoff", options: "", value: "0",
                        refresh: function () {
                            userSettings.itemShowInNet.value = item.on;
                            if (item.on != "1") {
                                var arr = SelectCityInst.getLocateOwners(true);
                                if (arr) {
                                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 1, data: { property: "owner", station: arr, line: arr } });
                                }
                                if (!args)
                                    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showPwGridName", selstate: 1 });
                            } else {
                                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 0, data: { property: "owner", station: [], line: [] } });
                                MapOpeInst.postMessage({ eventType: "menuope", menuname: "showPwGridName", selstate: 0 });
                            }
                            menuData.tellBusiness(true);
                        }
                    },
                    {
                        id: "border", name: "显示边界", type: "", options: "", value: "1",
                        refresh: function () {
                            MapOpeInst.postMessage({ eventType: "menuope", menuname: "LocationArea", selstate: (item.on == "1"), data: { arrownerid: ["990101", "990102", "990103", "990104", "990105", "990106"], Level: 1001, isParentArea: true } });
                        }
                    }
                ]
            },
            {
                name: "显示设置",
                cfgs: [
                    {
                        id: "lineWidth", name: "线路粗细", type: "list", options: "1,细(1px),2,中(2px),4,粗(4px)", value: "1",
                        refresh: function () {
                            MapOpeInst.postMessage({ eventType: "menuope", menuname: "setLineWidth", selstate: 1, data: { lineWidth: parseInt(item.value, 10) } });
                        }
                    },
                    {
                        id: "shortName", name: "厂站名称", type: "list", options: "-1,不显示,0,全称,1,简称,2,带地名", value: "1",
                        refresh: function () {
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshStationFont', selstate: 1, data: { shortName: parseInt(item.value, 10) } });
                        }
                    },
                    {
                        id: "lineShortName", name: "线路名称", type: "list", options: "-1,不显示,0,显示", value: "1",
                        refresh: function () {
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshYunTu', selstate: 1 });
                        }
                    },
                    {
                        id: "showTip", name: "鼠标停留提示", type: "list", options: "0,不显示站线,1,显示站线", value: "1",
                        refresh: function () {
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshShowTip', selstate: 1, data: { showTip: parseInt(item.value, 10) } });
                        }
                    },
                    {
                        id: "glowSecond", name: "闪烁时间", type: "list", options: "10,10秒,20,20秒,30,30秒,60,一分钟,0,一直闪烁", value: "1",
                        refresh: function () {
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshGlowSecond', selstate: 1, data: { glowSecond: parseInt(item.value, 10) } });
                        }
                    }
                ]
            },
            {
                name: "其他设置",
                cfgs: [
                    { id: "Xizang", name: "阿里电网", type: "list", options: "0,默认不显示,1,默认显示", value: "1" },
                    { id: "topoDataSource", name: "拓扑数据来源", type: "list", options: "0,科东,1,南瑞", value: "1" }
                ]
            }
        ],
        init: function (data) {
            for (var i = 0; i < this.groups.length; i++) {
                var g = this.groups[i];
                for (var j = 0; j < g.cfgs.length; j++) {
                    var item = g.cfgs[j];
                    var o = data.find(function (d) { return d.id == item.id });
                    if (o)
                        item.value = o.value;
                    //if (item.needSave) //不管存不存，我都存
                    item.change = function () {
                        userSettings.setSetting(this.id, this.value);
                        var _this = this;
                        PDP.exec([{ type: "modify", sql: "sgc/configs:UpdateConfig", args: [login.userid, this.id, this.value] }], function () {
                            if (_this.refresh)
                                _this.refresh();
                        });
                    }
                }
            }
        }
    },
    createPageApp: function (name, url, options) {
        var app = {
            name: name, click: function () {
                vMain.changePage(this.id, this.name, url, this.args);
                if (options && options.legend) {
                    vMain.setLegend(options.legend, this.state != 0);
                }
            },
            clear: function () {
                vMain.setLegend(options.legend, false);
            }
        };
        if (options.argid)
            app.go = function (arg) {
                this.args = {};
                this.args[options.argid] = arg;
                this.click();
                this.args = {};
            }
        return app;
    },
    createRealApp: function (id) {
        var realbutton = {};
    },
    createTimeApp: function (app, options) {
        app.canPlay = false;
        app.display = function (time, force) {
            if (force || (time != this.time)) {
                this.time = time;
                options.display(time);
            }
        }
        app.click = function () {
            var id = this.id;
            var legend = this.legend;
            var name = this.caption || this.name;
            if (this.state != 0) {
                this.gridid = SelectCityInst.getLocateGrid();
                var __id = (this.__id || 0) + 1;
                this.__id = __id;
                var now = Ysh.Time.getTime(options.timeType, new Date(/*Ysh.Time.parseDate('2020-5-12 00:00:00')*/));
                var start = Ysh.Time.add('d', -1, now);
                var end = Ysh.Time.add('d', 1, now);
                if (vMain.showPlayer) {
                    start = new Date(Ysh.Time.parseDate(vMain.minSectionTime));
                    end = new Date(Ysh.Time.parseDate(vMain.maxSectionTime));
                }
                var player = {
                    id: id,
                    changeTime: function (time) { app.display(time); },
                    changeStartTime: function (time) {
                        if (time >= this.start)
                            return;
                        var _this = this;
                        Ysh.Delay.exec(id + "_times", 100, function () {
                            console.log(time);
                            AppHelper.readValidTimes(options, now, time, _this.start, function (times) {
                                for (var i = 0; i < times.length; i++)
                                    _this.times.addSkipSame(times[i]);
                                _this.start = time;
                                vMain.$refs.player.$forceUpdate();
                            });
                        });
                    }
                };
                var _this = this;
                AppHelper.readValidTimes(options, now, start, end, function (times) {
                    if ((_this.__id != __id) || (!_this.state)) return;//已经失效
                    if (!vMain.showPlayer)
                        vMain.sectiontime = AppHelper.getRecentTime(times, now);
                    vMain.setLegend(legend, true);
                    vMain.players.push(player);
                    vMain.boardcast.caption.push(name);
                    vMain.sectiontype = options.timeType;
                    vMain.minSectionTime = Ysh.Time.toString(start);
                    vMain.maxSectionTime = Ysh.Time.toString(end);//lastTime;
                    vMain.now = now;
                    player.start = vMain.minSectionTime;
                    player.end = vMain.maxSectionTime;
                    vMain.playerSpeed = options.speed || 5;
                    vMain.showPlayer = true;
                    player.times = times;
                    player.changeTime(vMain.sectiontime);
                });
            } else {
                this.gridid = "";
                vMain.boardcast.caption.erase(name);
                vMain.closePlayer(id);
                vMain.caption = "";
                vMain.assist = "";
                this.display(null);
                vMain.setLegend(legend, false);
            }
        }
        app.receive = function (msg) {
            if (msg.type != "mapchanged")
                return;
            if (this.gridid == SelectCityInst.getLocateGrid())
                return;
            this.gridid = SelectCityInst.getLocateGrid();
            this.display(this.time, true);
        }
        return app;
    },
    createWeatherApp: function (app, options) {
        var app = this.createTimeApp(app, options);
        app.isWeatherApp = true;
        return app;
    },
    createApp: function (id) {
        switch (id) {
            case "cross":
                return this.createPageApp("跨区供电", "sgc_cross_region");
            case "fault":
                return this.createPageApp("故障", "sgc_fault", { legend: "/i/sgc/legend/tingdian.png" });
            case "heavyload":
                return this.createPageApp("重载", "sgc_overload_heavy");
            case "overload":
                return this.createPageApp("越限", "sgc_overload");
            case "statistics":
                return this.createPageApp("统计列表", "sgc_statistics");
            case "weather":
                return this.createWeatherApp({ name: "天气", legend: "/i/sgc/legend/weather.png" }, {
                    timesSQL: "sgc/tq:GetWeatherTimes", timeType: "hh",
                    display: function (time) {
                        if (!time) {
                            MapOpeInst.menu("setWeatherHide", false, { warnType: "weather" });
                            return;
                        }
                        var now = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'h'));
                        MapOpeInst.menu("setWeatherHide", true, { time: time, warnType: "weather", timeFlag: (time <= now) ? "history" : "forecast" });
                    }
                });
            case "cloud":
                return this.createWeatherApp({ name: "卫星云图", legend: "" }, {
                    timesSQL: "sgc/tq:GetCloudTimes", timeType: "mi", speed: 1,
                    display: function (time) {
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: !!time, data: { type: "cloud", time: time } });
                    }
                });
            case "windmap":
                return this.createWeatherApp({ name: "风", legend: "/i/sgc/legend/wind.png?v=1.21.118.1" }, {
                    timesSQL: "sgc/tq:GetWeatherTimes", timeType: "hh",
                    display: function (time) {
                        if (!time) {
                            MapOpeInst.menu("showWindWeather", false, {});
                            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showWindParticle", selstate: false, data: {} });
                            return;
                        }
                        var now = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'h'));
                        MapOpeInst.menu("showWindWeather", true, { time: time, hideIcon: true, warnType: "wind", timeFlag: (time <= now) ? "history" : "forecast" });
                        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showWindParticle", selstate: true, data: { time: time } });
                    }
                });
            case "typhoon":
                return this.createPageApp("台风", "sgc_typhoon_list", { argid: "id" });
            case "mygrid":
                return {
                    name: "我的区内电网",
                    click: function () {
                        this.state = 0;
                        var citycode = SelectCityInst.getLocateGrid();
                        $("#selCityHotCityId").find("a[citycode=" + citycode + "]").click();
                        var item = null;
                        for (var i = 0; i < stationFilter.displayStates.length; i++) {
                            var ds = stationFilter.displayStates[i];
                            if (ds.id == "innet") {
                                item = ds;
                                break;
                            }
                        }
                        if (item != null) {
                            if (item.on == "1")
                                stationFilter.clickDisplayMenu(item);
                        }
                        return true;
                    }
                };
            case "qyz":
                return {
                    name: "牵引站",
                    click: function () {
                        if (this.state != 0)
                            showingMenu.selectStationTheme(Ysh.Array.first(showingMenu.stationTypes, function (item) { return item.value == 2003; }));
                        else
                            showingMenu.restoreMainTheme();
                        return true;
                    }
                };
            case "temperature":
                return this.createWeatherApp({ name: "温度", legend: "/i/sgc/legend/temperature.png" }, {
                    timesSQL: "sgc/tq:GetTemperatureTimes", timeType: "hh",
                    display: function (time) { MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: !!time, data: { type: "temperature", time: time } }); }
                });
            case "rain":
                return this.createWeatherApp({ name: "降水", legend: "/i/sgc/legend/rain.png?v=1.21.118.1" }, {
                    timesSQL: "sgc/tq:GetRainTimes", timeType: "hh",
                    display: function (time) { MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: !!time, data: { type: "rain", time: time } }); }
                });
            case "windflag":
                return {
                    name: "大风", click: function () {
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: "setWeatherHide", selstate: this.state, data: { warnType: "wind" } });
                    }
                };
            case "tuijian":
                return this.createPageApp("热点", "sgc_tj");
            case "jxp":
                return this.createPageApp("检修", "sgc_jxp", { legend: "/i/sgc/legend/tingdian.png" });
            case "icing":
                return this.extendApp(this.createPageApp("覆冰", "sgc_tq_fb"), { canPlay: true, speed: 5 });
            case "fire":
                return {
                    name: "山火",
                    click: function () {
                        var legend = "none";
                        if (this.state) {
                            var ver = "1.20.1026.1";
                            this.bar = vMain.floatPage("sgc_tq_fire_region", {}, ver);
                            this.stat = vMain.floatPage("sgc_tq_fire_stat", { bar: this.bar }, ver);
                            vMain.setLegend(legend, true);
                        } else {
                            vMain.destroyFloatPage(this.stat);
                            vMain.destroyFloatPage(this.bar);
                            vMain.setLegend(legend, false);
                        }
                    }
                }
            case "thunder":
                return {
                    name: "雷电", click: function () {
                        //vMain.changePage("unknown", "雷电", "sgc_tq_thunder");
                        var legend = "none";
                        if (this.state) {
                            var ver = "1.20.702.1";
                            this.bar = vMain.floatPage("sgc_tq_light_region", {}, ver);
                            this.stat = vMain.floatPage("sgc_tq_light_stat", { bar: this.bar }, ver);
                            vMain.setLegend(legend, true);
                        } else {
                            vMain.destroyFloatPage(this.stat);
                            vMain.destroyFloatPage(this.bar);
                            vMain.setLegend(legend, false);
                        }
                    }
                };
            case "mylicense":
                return {
                    name: "我的调度许可", click: function () {
                        vMain.showByGrid("licenseOrgID", this.state);
                    }
                };
            case "mydispatch":
                return {
                    name: "我的调度管辖", click: function () {
                        vMain.showByGrid("dispatchOrgID", this.state);
                    }
                };
            case "":
                return {};
        }
    },
    createGroupApp: function (id) {
        switch (id) {
            case "":
            default:
                return null;
        }
    },
    extendApp: function (app, obj) {
        Ysh.Object.extend(app, obj);
        return app;
    },
    getApp: function (id) {
        var app = this.apps[id];
        if (!app) {
            app = this.createApp(id);
            app.id = id;
            app.state = 0;
            this.apps[id] = app;
        }
        return app;
    }
}