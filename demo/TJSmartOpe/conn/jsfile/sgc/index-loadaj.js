/*v=1.21.1104.1*/
new Vue({
    el: "#divCity"
});

var ProjectHuabei = {
    locate: function (arg) {
        console.log("invoke locate:" + arg);
        ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'hideStationLineByVol', selstate: false, data: { volCode: [1006, 1007, 1008] } });
        var list = arg.split(',');
        if (list.length == 1) {
            ProjectSGC.Map.locate("", arg);
            return;
        }
        var type = list[0];
        var h = Ysh.Request.get("h");
        if (h) h = parseInt(h, 10);
        if ((!h) || isNaN(h)) h = 5000;
        switch (type.toUpperCase()) {
            case "TOWER":
                {
                    var lineid = list[1];
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { lineid: lineid } });
                    if (list.length >= 3) {
                        //} else {
                        var msg = [];
                        var towerids = [];
                        for (var i = 2; i < list.length; i++) {
                            towerids.push(list[i]);
                            msg.push({ lineid: lineid, towerid: list[i] });
                        }
                        ProjectSGC.Map.postMessage({ locateType: 10, locateItem: { towerid: towerids, height: h } });
                        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { type: "locatetower", z_index: 6, paddingtop: -18, images: { width: 30, height: 37.5, imgUrl: "/textures/coin/Pin.png" }, locateData: msg } });
                    }
                }
                break;
            case "POSITION":
                {
                    var lon = list[1], lat = list[2];
                    //var height = list[3]
                    //if (height)
                    //    height = parseInt(height, 10);
                    ProjectSGC.Map.postMessage({ eventType: "fly", type: 1, data: { longitude: lon, latitude: lat, height: h } });
                    //ProjectSGC.Map.fly(lon, lat);
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { type: type, images: { imgCode: 0, imgUrl: "/i/sgc/index.png" }, locateData: [{ longitude: list[1], latitude: list[2] }] } });
                }
                break;
            case "DISTANCE":
                {
                    var data = [];
                    data.push({ lineid: list[1], stid: list[2], distance: parseInt(list[3], 10) });
                    //var height = list[4];
                    ProjectSGC.Map.postMessage({ locateType: 16, selstate: true, locateItem: { lineid: list[1], glowRadius: 30, stationID: list[2], distance: parseInt(list[3], 10), height: h } });
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { stopLight: true, time: 0, type: "daFault", images: { imgUrl: "/i/sgc/index.png" }, locateData: data } });
                    //if (height)
                    //    ProjectSGC.Map.postMessage({ eventType: "fly", type: 1, data: { height: parseInt(height, 10) } });
                }
                break;
            case "FAULT":
                {
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { lineid: list[1] } });
                    ProjectSGC.Map.postMessage({
                        eventType: 'menuope', menuname: 'showGuZhangTrack', selstate: true,
                        data: { end_distance: list[5] ? parseFloat(list[5]) / 1000.0 : "", end_stationid: list[4], lineid: list[1], start_distance: parseFloat(list[3]) / 1000.0, start_stationid: list[2], trackType: "guzhang", setScale: true, tipType: 1, height: h }
                    });
                }
                break;
            case "LINE":
                ProjectSGC.Map.postMessage({ locateType: 10, locateItem: { lineid: list[1], time: 0 } });
                break;
            case "STATION":
                ProjectSGC.Map.postMessage({ locateType: 10, locateItem: { stationid: list[1], time: 0 } });
                break;
            default:
                ProjectSGC.Map.locate(type, list[1]);
                break;
        }
    },
    showImages: function (type, data) {
        if (!data) return;
        var img = "";
        var size = "";
        switch (type) {
            case "fire":
                img = "/i/sgc/icon/fire/1.png";
                size = 100;
                break;
            case "light":
                img = "/textures/coin/weather/leigif.png";
                size = 75;
                break;
            default:
                return;
        }
        var pos = data.split(",");
        var msgs = [];//[{ longitude: list[1], latitude: list[2] }]
        for (var i = 0; i < pos.length; i += 2) {
            msgs.push({ longitude: pos[i], latitude: pos[i + 1] });
        }
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { type: type, images: { imgCode: 0, imgType: "Animated", imgUrl: img, width: size, height: size }, locateData: msgs } });
    }
}

var SGCDebug = {
    times: [],
    start: function (name) {
        this.times.push({ "name": name, time: new Date() });
    },
    show: function () {
        var msg = "";
        for (var i = 1; i < this.times.length; i++) {
            var prev = this.times[i - 1];
            var curr = this.times[i];
            msg += prev.name + Ysh.Time.toString(prev.time, false, true) + " - " + curr.name + Ysh.Time.toString(curr.time, false, true) + " 花费时间:" + (curr.time - prev.time) + "毫秒\r\n";
        }
        console.log(msg);
        this.times = [];
    }
};

var topMenuBar = new Vue({
    el: "#divTopMenu",
    data: {
        menus: [
            {
                id: "search", img: ["/i/sgcmenu/search.png", "/i/sgcmenu/search_focus.png"], state: 0, div: "noUse", title: "搜索", canClose: false, click: function () {
                    this.state = 1 - this.state;
                    vMain.showSearch = (this.state == 1);
                    if (this.state) {
                        vMain.$nextTick(function () {
                            $("#input_info").css("width", $("#divBottom")[0].clientWidth - 120);
                        });
                    }
                }
            },
            { isSplit: 3, s: { width: "10px", "margin-left": "10px" } },
            { img: "/i/sgcmenu/map.png", text: "", id: "map", title: "底图控制", isHide: false },
            {
                img: "/i/sgcmenu/gis.png", text: "", id: "gis", title: "地理图控制", isHide: false,
                getImg: function () {
                    return this.needFocus ? "/i/sgcmenu/gis_focus.png" : "/i/sgcmenu/gis.png";
                }
            },
            { isSplit: 3, s: { width: "10px", "margin-left": "10px" } },
            {
                id: "city", img: "/i/sgcmenu/guijiadianwang.png", div: "divCity", text: "", text1: "", title: "电网选择", click: function () {//text1，避免带上外圈
                    stationFilter.isNeed[2] = true;
                    stationFilter.isNeed[5] = true;
                    stationFilter.isNeed[6] = true;
                    stationFilter.isNeed[7] = false;
                    stationFilter.$forceUpdate();
                },
                beforeClick: function (isMore, isText) {
                    if (isText) {
                        cardUrlInst.show("getpwrgridcard", "0101" + SelectCityInst.locateid.substr(4));
                        return false;
                    }
                    return true;
                },
                assistTitle: "保存中心点"
                /*,
                    assistImg: "/i/sgcmenu/save.png",
                    clickAssist: function () {
                        MapOpeInst.postMessage({ eventType: "menuope", menuname: "saveDistrictRange", data: {} });
                    }*/
            },
            {
                img: ["/i/sgcmenu/unlock.png", "/i/sgcmenu/lock.png"], state: 0, text: "", id: "lock", title: "Block",
                hasMore: true,
                beforeClick: function (isMore) {
                    if (vMain.ystype) return false;
                    if (isMore)
                        return true;
                    /*
                    if ((menuData.selectPlantTypes.length > 0) || (menuData.selectStationTypes.length > 0)) {
                        alert("选择特定厂站时不允许解锁电压等级！");
                        return false;
                    }*/
                    return true;
                },
                click: function (x, y, isMore) {
                    if (isMore) {
                        //if (this.state == 0)
                        //    this.changeState(1 - this.state);
                    } else {
                        //if (this.state == 0)
                        this.changeState(1 - this.state);
                        if (this.state == 0) {
                            return true;
                        }
                    }
                },
                changeState: function (state) {
                    if (this.state == state)
                        return;
                    this.state = state;
                    this.needFocus = this.state;
                    if (this.state == 0) {
                        //menuData.lockType = 0;
                        menuData.changeLockState(0);
                        showingMenu.removeGridTheme();
                        //showingMenu.doUnlock();
                        showingMenu.unlock();
                    } else {
                        //menuData.lockType = 1;
                        menuData.changeLockState(1);
                        showingMenu.lock();
                        menuData.refreshMap("voltage");
                    }
                }
            },
            {
                img: "/i/sgcmenu/state.png", text: "", id: "state", title: "状态选择", getImg: function () {
                    return this.needFocus ? "/i/sgcmenu/state_focus.png" : "/i/sgcmenu/state.png";
                }
            },
            {
                img: "/i/sgcmenu/boundary.png", id: "grid_theme", div: "", text: "", title: "", hasMore: true, over: true,
                click: function (x, y, isMore) {
                    if (!isMore) {
                        if (this.text) { //解锁电压等级
                            showingMenu.unlock();
                            showingMenu.showLine(true);
                            this.text = "";
                            return true;
                        }
                    }
                }, getImg: function () { return this.text ? "/i/sgcmenu/boundary_focus.png" : "/i/sgcmenu/boundary.png"; }
            },
            {
                img: "/i/sgcmenu/substation.png", id: "station_theme", div: "", title: "", hasMore: true, over: true,
                beforeClick: function () { return true; },
                click: function (x, y, isMore) {
                    if (!isMore) {
                        if (this.text) { //全选
                            showingMenu.restoreMainTheme();
                            this.text = "";
                            return true;
                        }
                    }
                }, getImg: function () { return this.text ? "/i/sgcmenu/substation_focus.png" : "/i/sgcmenu/substation.png"; }
            },
            {
                img: "/i/sgcmenu/plant.png", id: "plant_theme", div: "", title: "", hasMore: true, over: true,
                beforeClick: function () { return true; },
                click: function (x, y, isMore) {
                    if (!isMore) {
                        if (this.text) { //全选
                            showingMenu.restoreMainTheme();
                            this.text = "";
                            return true;
                        }
                    }
                }, getImg: function () { return this.text ? "/i/sgcmenu/plant_focus.png" : "/i/sgcmenu/plant.png"; }
            },
            {
                img: "/i/sgcmenu/scene.png", text: "", id: "scene", title: "自定义场景", click: function (x, y) {
                    showingMenu.showNewScene = false;
                    showingMenu.editScene = false;
                }
            },
            {
                img: "/i/sgcmenu/kongzhi.png", div: "divStationFilter", title: "显示控制", click: function () {
                    stationFilter.isNeed[2] = true;
                    stationFilter.isNeed[5] = true;
                    stationFilter.isNeed[6] = true;
                    stationFilter.isNeed[7] = false;
                    stationFilter.$forceUpdate();
                }
            },
            /*{
                img: "/i/sgcmenu/mygrid.png", title: "我的电网", click: function () {
                    var citycode = SelectCityInst.rootid;
                    var tj = $("a[citycode=" + citycode + "]");
                    if ((tj) && (tj.length > 0))
                        SelectCityInst.setCityTitle(tj.attr("citycode"), tj.attr("name"));
                    SelectCityInst.locate(citycode);
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
            },*/
            { isSplit: 3, s: { width: "10px", "margin-left": "10px" } },
            {
                id: "play", img: ["/i/sgcmenu/play_dis.png", "/i/sgcmenu/play.png"], state: 0, div: "divPlayer", title: "播放器", canClose: false, click: function () {
                    vMain.openPlayer();
                    return;
                    stationFilter.isNeed[2] = false;
                    stationFilter.isNeed[5] = false;
                    stationFilter.isNeed[6] = false;
                    stationFilter.isNeed[7] = true;
                    stationFilter.$forceUpdate();
                },
                beforeClick: function (isMore, isText) {
                    return this.state;
                }
            },
            {
                img: "/i/sgcmenu/jxt.png", text: "", id: "jxt", div: "divNoUse", title: "生成全息接线图", click: function () {
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "getStationLineInScene" });
                }, isHide: false
            },
            {
                img: ["/i/sgcmenu/selectzone.png", "/i/sgcmenu/zoneselecting.png", "/i/sgcmenu/selectzoneex.png", "/i/sgcmenu/zoneselectingex.png", "/i/sgcmenu/selectzonecircle.png", "/i/sgcmenu/selectingzonecircle.png"], id: "selectzone", text: "", hasMore: true, div: "",
                title: "区域选择", state: 0, isHide: false,
                click: function (x, y, isMore) {
                    if (!isMore) {
                        this.state += (this.state % 2 == 0 ? 1 : -1);
                        this.deal();
                        return true;
                    }
                },
                deal: function () {
                    var data = {};
                    if (this.state > 3)
                        data = { type: "circle" };
                    else if (this.state > 1)
                        data = { type: "polygon" };
                    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: "DrawRectObject", selstate: this.state % 2, data: data });
                }
            },
            {
                img: "/i/sgcmenu/tools.png", text: "", id: "tools", title: "工具箱", click: function () {
                    // ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "GetMapImg", selstate: true, data: {} });
                }, isHide: true
            },
            {
                img: "/i/sgcmenu/ceju.png", text: "", id: "ceju", div: "divNoUse", title: "测距", click: function () {
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "measureSurface", selstate: true, data: { labelStyle: { fontSize: 30 } } });
                }, isHide: false
            },
            {
                img: "/i/sgcmenu/screenshot.png", text: "", id: "mapshot", div: "divNoUse", title: "地图截图", click: function () {
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "GetMapImg", selstate: true, data: {} });
                }, isHide: false
            },
            {
                img: "/i/sgcmenu/locate.png", text: "", id: "maplocate", div: "divNoUse", title: "地图定位", click: function () {
                    vMain.showPage("toolsdlg", "地图定位", "sgc_tools_locate", {}, null, "200px", "150px");
                }, isHide: false
            },
            {
                img: "/i/sgcmenu/screen-s.png", text: "", id: "screen", title: "多屏控制", isHide: false
                /*
                img: ["/i/sgcmenu/screen-s.png", "/i/sgcmenu/screen-m.png"], state: 0, text: "", div: "divScreen", title: "多屏控制",
                click: function (x, y) {
                    this.state = 1 - this.state;
                    ProjectSGC.Config.OpenMode = this.state;
                    if (vMain.changeOpenMode)
                        vMain.changeOpenMode(this.state);
                }*/
            },
            {
                img: "/i/sgcmenu/yonghushezhi.png", text: "", div: "divUserSettings", title: "地图设置", isHide: true
            },
            { isSplit: 3, s: { width: "10px", "margin-left": "10px" } },
            { img: ["/i/sgcmenu/substation.png", "/i/sgcmenu/boundary.png"], state: 0, id: "boundary", div: "", title: "域选择", isHide: true }
        ],
        disableTips: false,
        timerTips: -1,
        menuData: menuData,
        login: login,
        show: false,
        showSys: false
    },
    methods: {
        getMenu: function (id) {
            for (var i = 0; i < this.menus.length; i++) {
                var m = this.menus[i];
                if (m.id == id)
                    return m;
            }
            return null;
        },
        showTips: function (item) {
            var vm = this;
            this.timerTips = window.setTimeout(function () { vm.disableTips = true; }, 1000)
        },
        closeTips: function (item) {
            window.clearTimeout(this.timerTips);
            this.disableTips = false;
        },
        getMenuTop: function (jq) {
            while (true) {
                if (jq.attr("r") == "1")
                    return jq;
                var p = jq.parent();
                if ((p == jq) || (p == null) || (p.length == 0))
                    return null;
                jq = p;
            }
        },
        hideOther: function (item) {
            for (var i = 0; i < this.menus.length; i++) {
                var menu = this.menus[i];
                if ((menu == item) || (!menu.div))
                    continue;
                if (menu.canClose)
                    $("#" + menu.div).hide();
            }
        },
        click: function (item, e, isMore, isText) {
            this.show = true;
            if (!item.beforeClick(isMore, isText))
                return;
            var jq = this.getMenuTop($(e.srcElement));
            var x = jq.offset().left;
            var y = jq.height() + jq.offset().top;
            topMenuInst.hideAllContent();
            this.hideOther(item);
            if (item.click) {
                if (item.click(x, y, isMore))
                    return;
            }
            var div = null;
            if (item.div) {
                div = $("#" + item.div);
                div.css({ "left": 0, "right": "", "top": y }).show();
            } else {
                div = $("#divShowingMenu");
                showingMenu.current = item.id;
                showingMenu.show = true;
                showingMenu.item = item;
            }
            if (item.div) {
                if (x + div.width() > $("body").width())
                    div.css({ "right": 0, "left": "", "top": y });
                else
                    div.css({ "left": x, "right": "", "top": y });
            } else if (showingMenu.show) {
                showingMenu.$nextTick(function () {
                    if (x + div.width() > $("body").width())
                        div.css({ "right": 0, "left": "", "top": y });
                    else
                        div.css({ "left": x, "right": "", "top": y });
                });
            }
        },
        clickAssist: function (item, e) {
            if (item.clickAssist)
                item.clickAssist();
        },
        over: function (item, e) {
            if (item != showingMenu.item) {
                showingMenu.show = false;
            }
            if (!item.hasMore) return;
            if (!item.over) return;
            this.click(item, e, true);
        },
        hideAll: function () {
            if (this.show) return;
            showingMenu.show = false;
            for (var i = 0; i < this.menus.length; i++) {
                var m = this.menus[i];
                if (m.div)
                    $("#" + m.div).hide();
            }
        },
        out: function (item, e) {
            return;
            e = window.event || e;
            var s = e.toElement || e.relatedTarget;
            var reg = e.srcElement.compareDocumentPosition(s);
            if (reg == 20 || reg == 0)
                return;
            this.show = false;
            var vm = this;
            window.setTimeout(function () {
                vm.hideAll();
            }, 1010);
        },
        lock: function (b) {
            if (typeof b == "undefined")
                return this.getMenu("lock").state == 1;
            if (b) {
                this.getMenu("lock").changeState(1);
                return;
            }
            if ((menuData.selectPlantTypes.length > 0) || (menuData.selectStationTypes.length > 0)) {
                return;
            }
            this.getMenu("lock").changeState(0);
        },
        getTheme: function (name) {
            switch (name) {
                case "grid":
                    return this.getMenu("grid_theme");
                case "station":
                    return this.getMenu("station_theme");
                case "plant":
                    return this.getMenu("plant_theme");
                case "custom":
                    return this.getMenu("scene");
                case "running":
                    return this.getMenu("running_theme");
                default:
                    return null;

            }
        },
        getCity: function () {
            return this.getMenu("city");
        }
    },
    created: function () {
        for (var i = 0; i < this.menus.length; i++) {
            var menu = this.menus[i];
            if (!menu.beforeClick)
                menu.beforeClick = function () { return !vMain.ystype; }
            if (!menu.getImg)
                menu.getImg = function () {
                    if (typeof this.img === "string")
                        return this.img;
                    return this.img[this.state];
                }
            if (!menu.getImgClass)
                menu.getImgClass = function () { return "top-menu-img"; }
        }
    }
})

var player = new Vue({
    el: '#divPlayer',
    data: {
        sectiontype: 'y',
        sectiontypes: [{ type: 'y', text: '年' }, { type: 'm', text: '月' }, { type: 'd', text: '日' }],
        sectiontime: Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "d")),
        maxSectionTime: new Date()
    },
    computed: {
        selectDisplayState: function () {
            var arr = [];
            for (var i = 0; i < this.displayStates.length; i++) {
                if (this.displayStates[i].on == "1")
                    arr.push(this.displayStates[i]);
            }
            return arr;
        }
    },
    methods: {
        close: function () {
            vMain.closePlayer();
            $("#divPlayer").hide(); this.sectiontime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "d"));
        },
        getSectionTypeCss: function (item, index) {
            var css = { "background-color": (item.type == this.sectiontype ? "#369bc1" : "#e5e5e5") }
            if (index > 0)
                css["margin-left"] = "10px";
            return css;
        }, selectSectionType: function (item) {
            this.sectiontime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(Ysh.Time.parseDate(this.sectiontime)), item.type));
            this.sectiontype = item.type;

            vMain.changeSectionType(item.type);
        }, changeSectionTime: function (v) {
            //MessageInst.postMessage({ eventType: 'menuope', menuname: 'setShowDate', selstate: 1, data: { operatedate: v } });
        }
    }
});

var stationFilter = new Vue({
    el: '#divStationFilter',
    data: {
        stationStates: [],
        lineStates: [],
        isShowWeatherTime: false,
        startWeatherTime: Ysh.Time.add('h', -1, Ysh.Time.getTimeStart(new Date(), 'h')),
        weathertime: Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "h")),
        clickStateId: "",
        sectiontype: 'y',
        sectiontypes: [{ type: 'y', text: '年' }, { type: 'm', text: '月' }, { type: 'd', text: '日' }],
        sectiontime: Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "d")),
        maxSectionTime: new Date(),
        displayStates: [//{name: "站名", on: "1", imageUrl: "/i/sgc/on.png", menuName: "setFontShowHide", data: {} },
            //{name: "交流", on: "1", imageUrl: "/i/sgc/on.png", menuName: "setLineACShowHide", data: {lineType: 1 } },
            //{name: "直流", on: "1", imageUrl: "/i/sgc/on.png", menuName: "setLineDCShowHide", data: {lineType: 2 } },
            { isHide: true, group: "weather", id: "weather", name: "天气", on: "0", imageUrl: "/i/sgc/off.png", menuName: "setWeatherHide", data: { warnType: "weather" } }
            /*,,{id: "chaoliu", name: "潮流", on: "0", imageUrl: "/i/sgc/off.png", menuName: "OpenCloseChaoLiu", data: {} } //江苏版本需要显示潮流
*/
            , { id: "chaoliu_stationvol", name: "厂站电压", on: "0", imageUrl: "i/sgc/off.png" }
            , { id: "chaoliu_plantpower", name: "电厂有功", on: "0", imageUrl: "i/sgc/off.png" }
            , { id: "chaoliu_dir", name: "潮流方向", on: "0", imageUrl: "i/sgc/off.png" }
            , { id: "chaoliu_value", name: "线路有功", on: "0", imageUrl: "i/sgc/off.png" }
            , { slot: "bschaoliu" }
            , { id: "chaoliu", name: "线路点击显示潮流", on: "0", imageUrl: "i/sgc/off.png" }
            , { id: "border_3d", name: "边界3D", on: "0", imageUrl: "i/sgc/off.png" }
            , { isHide: true, id: "name", name: "厂站名称", on: "1", imageUrl: "i/sgc/on.png" }
            , { isHide: true, id: "linename", name: "线路名称", on: "1", imageUrl: "i/sgc/on.png" }
            //, {id: "linetower", name: "直连", on: "1", imageUrl: "i/sgc/on.png" }
            , { id: "innet", name: "区外电网", on: "1", imageUrl: "i/sgc/on.png" }
            , { isHide: true, id: "weatherstation", name: "气象站", on: "0", imageUrl: "i/sgc/off.png" }
            , { isHide: true, group: "weather", id: "wind", name: "大风预警", on: "0", imageUrl: "/i/sgc/off.png", menuName: "setWeatherHide", data: { warnType: "wind" } }
            , { isHide: true, group: "weather", id: "rain", name: "大雨预警", on: "0", imageUrl: "/i/sgc/off.png", menuName: "setWeatherHide", data: { warnType: "rain" } }
            , { isHide: true, id: "chaoliu", name: "潮流", on: "0", imageUrl: "/i/sgc/off.png", menuName: "OpenCloseChaoLiu", data: {} } //江苏版本需要显示潮流
            , { isHide: true, id: "jianxiu", name: "检修", on: "0", imageUrl: "/i/sgc/off.png", menuName: "OpenCloseRepair", data: {} }
            , { isHide: true, group: "glow", id: "plantpower", name: "电厂发电", on: "0", imageUrl: "i/sgc/off.png" }
            , { isHide: true, group: "glow", id: "transload", name: "主变负载", on: "0", imageUrl: "i/sgc/off.png" }
            , { isHide: true, group: "glow", id: "load", name: "负荷", on: "0", imageUrl: "i/sgc/off.png" }
            , { isHide: true, group: "glow", id: "newenergy", name: "新能源", on: "0", imageUrl: "i/sgc/off.png" }
            , { id: "border", name: "显示边界", on: "0", imageUrl: "i/sgc/off.png" }
            , { isHide: login.mode != "bigscreen", id: "blackbg", name: "黑色背景", on: "1", imageUrl: "i/sgc/on.png", menuName: "changeMapBlack", data: {} }
            , { id: "isShowByRegion", name: "按行政区划", on: "0", imageUrl: "i/sgc/off.png" }
            //, { id: "isOnlyTongxin", name: "只显示光缆", on: "0", imageUrl: "i/sgc/off.png" }
            //, { id: "specialPS", name: "特定厂站", on: "0", imageUrl: "i/sgc/off.png" }
        ],
        dclineVols: [],
        aclineVols: [],
        /*
                                plantTypes: [{value: 1001, text: "火电", checked: false }, {value: 1002, text: "水电", checked: false }, {value: 1003, text: "核电", checked: false }, {value: 1004, text: "风电", checked: false },
                                {value: 1005, text: "光伏", checked: false }, {value: 1006, text: "抽蓄", checked: false }, {value: 1007, text: "风光一体", checked: false }, {value: 1008, text: "光热一体", checked: false }],
                                stationTypes: [{value: 2001, text: "变电站", checked: false }, {value: 2002, text: "开关站", checked: false }, {value: 2003, text: "牵引站", checked: false }, {value: 2004, text: "串补站", checked: false },
                                    {value: 3001, text: "换流站", checked: false }, {value: 3002, text: "直流接地站", checked: false }, {value: 2005, text: "风电汇集站", checked: false }, {value: 2006, text: "光伏汇集站", checked: false }],
        */
        plantTypes: menuData.plantTypes,
        stationTypes: menuData.stationTypes,
        isShowStates: [false, false, true, false, false, true, true, true], //每一块是否显示
        isNeed: [false, false, true, false, false, true, true, true],//是否每块都需要
        selectDclineVols: [],
        selectAclineVols: [],
        //selectPlantTypes: [],
        //selectStationTypes: []
        userSettings: null,
        isShowChaoLiu: false,
        isShowRepair: false,
        bsaclinepng: "acline-lan",
        bschaoliu: []
    },
    computed: {
        lineTowerValue: {
            get: function () { if (this.userSettings && this.userSettings.lineTower) return this.userSettings.lineTower.value; },
            set: function (v) { if (this.userSettings && this.userSettings.lineTower) this.userSettings.lineTower.value = v; }
        },
        gridModes: function () {
            if (null == this.userSettings)
                return [];
            var lineTower = this.userSettings.lineTower;
            if (!lineTower) return [];
            if (!lineTower.options)
                return [];
            var options = lineTower.options.split(',');
            var arr = [];
            for (var i = 0; i < options.length; i += 2) {
                arr.push([options[i], options[i + 1]]);
            }
            return arr;
        },
        selectStationStats: function () {
            var arr = [];
            for (var i = 0; i < this.stationStates.length; i++) {
                if (this.stationStates[i].on == "1")
                    arr.push(this.stationStates[i]);
            }
            return arr;
        },
        selectLineStates: function () {
            var arr = [];
            for (var i = 0; i < this.lineStates.length; i++) {
                if (this.lineStates[i].on == "1")
                    arr.push(this.lineStates[i]);
            }
            return arr;
        },
        selectDisplayState: function () {
            var arr = [];
            for (var i = 0; i < this.displayStates.length; i++) {
                if (this.displayStates[i].on == "1")
                    arr.push(this.displayStates[i]);
            }
            return arr;
        },
        selectPlantTypes: function () {
            return menuData.selectPlantTypes;
        }, selectStationTypes: function () {
            return menuData.selectStationTypes
        }, userSettingAll: function () {
            if (!this.userSettings) return [];
            if (!this.userSettings.all) return [];
            return this.userSettings.all;
        }
    },
    methods: {
        setChaoliuStateByGridLevel: function () {
            var maxLevel = 0;
            var selected = SelectCityInst.locateid.split(",");
            for (var i = 0; i < selected.length; i++) {
                var id = selected[i];
                var level = SelectCityInst.getCityLevel(id);
                maxLevel = Math.max(maxLevel, level || 0);
            }
            if (maxLevel >= 1004) {//地、县
                this.bschaoliu = ["1", "1001", "1002", "1003", "1004", "1005"];
                return;
            }
            if (maxLevel >= 1003) {//省调
                this.bschaoliu = ["1", "1001", "1002", "1003", "1004"];
                return;
            }
            if (maxLevel >= 1002) {
                this.bschaoliu = ["1", "1001", "1002", "1003"];
                return;
            }
            this.bschaoliu = ["1", "1001"];
        },
        setChaoliuState: function (b) {
            if (vMain.showChaoliuBtn != b)
                vMain.changeChaoliuType(0);
            vMain.showChaoliuBtn = b;
            if (b) {
                //this.bschaoliu = ["1", "1001", "1002", "1003", "1004", "1005"];
                this.setChaoliuStateByGridLevel();
            } else {
                this.bschaoliu = [];
            }
            this.changeBsChaoliu();
        },
        setChaoliuDataState: function () {
            if (SGCChaoliu.showDirection || SGCChaoliu.showValue || SGCChaoliu.showPlantPower || SGCChaoliu.showStationVol) {
                if (this.bschaoliu.length == 0) {
                    this.setChaoliuState(true);
                    return;
                }
            } else {
                if (this.bschaoliu.length > 0) {
                    this.setChaoliuState(false);
                    return;
                }
            }
            SGCChaoliu.start();
        },
        changeBsChaoliu: function () {
            if (this.bschaoliu.length == 0) {
                this.setDisplayMenuState("chaoliu_dir", "0");
                this.setDisplayMenuState("chaoliu_value", "0");
                this.setDisplayMenuState("chaoliu_stationvol", "0");
                this.setDisplayMenuState("chaoliu_plantpower", "0");
                SGCChaoliu.showDc = SGCChaoliu.showDirection = SGCChaoliu.showValue = SGCChaoliu.showStationVol = SGCChaoliu.showPlantPower = false;
                SGCChaoliu.showAc = [];
            } else {
                if ((!SGCChaoliu.showDirection) && (!SGCChaoliu.showValue) && (!SGCChaoliu.showStationVol) && (!SGCChaoliu.showPlantPower)) {
                    SGCChaoliu.showDirection = SGCChaoliu.showValue = true;
                    this.getDisplayMenu("chaoliu_dir").on = "1";
                    this.getDisplayMenu("chaoliu_value").on = "1";
                }
                SGCChaoliu.showDc = (this.bschaoliu.indexOf("1") >= 0);
                var arrAc = Ysh.Object.clone(this.bschaoliu);
                arrAc.erase("1");
                SGCChaoliu.showAc = arrAc;
            }
            this.$forceUpdate();
            SGCChaoliu.start();
            this.setChaoliuBtnState();
        },
        setChaoliuBtnState: function () {
            var btn = vMain.getRealButton("chaoliu");
            if (btn)
                //btn.state = SGCChaoliu.showDc || (SGCChaoliu.showAc.length > 0) || SGCChaoliu.showPlantPower || SGCChaoliu.showStationVol;
                btn.state = SGCChaoliu.showDc || (SGCChaoliu.showAc.length > 0);
        },
        changeBsAclinePng: function () {
            vMain.getApp("uhvacmap").click();
        },
        changeGridMode: function () {
            this.userSettings.changeConfig(this.userSettings.lineTower);
        },
        selectPlantStationType: function (type) {
            for (var i = 0; i < this.plantTypes.length; i++) {
                var t = this.plantTypes[i];
                t.checked = (t.value == type);
            }
            for (var i = 0; i < this.stationTypes.length; i++) {
                var t = this.stationTypes[i];
                t.checked = (t.value == type);
            }
            this.$forceUpdate();
        },
        changeWeatherTime: function () {
            var now = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'h'));
            var tm = this.weathertime;
            var menuname = "showTowerWeather";
            var data = { time: this.weathertime, timeFlag: (tm < now) ? "history" : ((now < tm) ? "forecast" : "now") };
            data["warnType"] = this.clickStateId;
            console.log(data);
            MapOpeInst.postMessage({
                eventType: "menuope", menuname: menuname, selstate: true,
                data: data
            });
        },
        clickTitle: function (index) {
            this.isShowStates[index] = Vue.set(this.isShowStates, index, !this.isShowStates[index]);
        },
        clickStateMenu: function (item) {
            item.on = item.on == "1" ? "0" : "1";
            item.imageUrl = item.on == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png";
            topMenuInst.clickStationStateMenu(parseInt(item.stationState), parseInt(item.lineState), item.on == "1");
        },
        setDisplayMenuState: function (id, state) {
            var item = this.displayStates.find(function (d) { return d.id == id; });
            if (!item) return;
            item.on = state;
        },
        getDisplayMenu: function (id) {
            return this.displayStates.find(function (d) { return d.id == id; });
        },
        clickDisplayMenu: function (item, args) {
            item.on = item.on == "1" ? "0" : "1";
            if (item.group && (item.on == "1")) {
                for (var i = 0; i < this.displayStates.length; i++) {
                    var s = this.displayStates[i];
                    if (s == item)
                        continue;
                    if ((s.group == item.group) && (s.on != "0")) {
                        s.on = "0";
                        s.imageUrl = s.on == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png";
                    }
                }
            }
            item.imageUrl = item.on == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png";
            if (item.menuName)
                topMenuInst.clickDisplayStateMenu(item.menuName, item.on == "1", item.data);
            if ((item.id == "weather") || (item.id == "wind") || (item.id == "rain")) {
                this.clickStateId = item.id;
                this.isShowWeatherTime = (item.on == "1");
                if (this.isShowWeatherTime)
                    this.weathertime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "h"));
                return;
            }
            if (item.id == "weatherstation") {
                var menuName = "showImageIcon";
                if (item.on == "1") {
                    PDP.read("SGC", "sgc/weather:GetAllSource", [], function (data) {
                        if (!data.check("获取气象站", true))
                            return;
                        if (item.on != "1")
                            return;
                        data = data.value;
                        var info = [];
                        Ysh.Array.each(data, function (row, idx) {
                            var id = row[0];
                            var name = row[1];
                            var lon = row[2];
                            var lat = row[3];
                            info.push({ longitude: lon, latitude: lat, data: { id: id, name: name } });
                        });
                        MapOpeInst.menu(menuName, true, { type: "weathersource", images: { imgCode: 0, imgUrl: "/textures/coin/qixiangzhan/qixiangtai.png" }, locateData: info });
                    });
                } else {
                    MapOpeInst.menu(menuName, false, { type: "weathersource" });
                }
                return;
            }
            if (item.id == "innet") {
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
                return;
            }
            if (item.id == "linetower") {
                var s = userSettings.lineTower;
                if (s == null)
                    return;
                s.value = item.on;
                userSettings.changeConfig(s);
                return;
            }
            if (item.id == "name") {
                var s = Ysh.Array.first(userSettings.all, function (item) { return item.id == "shortName"; });
                s.value = item.on == "1" ? 1 : -1;
                userSettings.changeConfig(s);
                return;
            }
            if (item.id == "linename") {
                var s = Ysh.Array.first(userSettings.all, function (item) { return item.id == "lineShortName"; });
                s.value = item.on == "1" ? 0 : -1;
                userSettings.changeConfig(s);
                return;
            }
            if (item.id == "chaoliu") {
                this.isShowChaoLiu = item.on == "1";
                return;
            }
            if (item.id == "jianxiu") {
                this.isShowRepair = item.on == "1";
                floatDataInst.showRepairTrack(this.isShowRepair);
                return;
            }
            if (item.id == "border") {
                MapOpeInst.postMessage({ eventType: "menuope", menuname: "LocationArea", selstate: (item.on == "1"), data: { arrownerid: ["990101", "990102", "990103", "990104", "990105", "990106"], Level: 1001, isParentArea: true } });
                return;
            }
            if (item.id == "border_3d") {
                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showDistric3DShadow', selstate: (item.on == "1") });
                return;
            }
            if (item.id == "chaoliu_stationvol") {
                SGCChaoliu.showStationVol = item.on == "1";
                //SGCChaoliu.start();
                //this.setChaoliuBtnState();
                this.setChaoliuDataState();
                return;
            }
            if (item.id == "chaoliu_plantpower") {
                SGCChaoliu.showPlantPower = item.on == "1";
                //SGCChaoliu.start();
                //this.setChaoliuBtnState();
                this.setChaoliuDataState();
                return;
            }
            if (item.id == "chaoliu_dir") {
                SGCChaoliu.showDirection = item.on == "1";
                this.setChaoliuDataState();
                return;
            }
            if (item.id == "chaoliu_value") {
                SGCChaoliu.showValue = item.on == "1";
                this.setChaoliuDataState();
                return;
            }
            if (item.id == "isShowByRegion") {
                MapOpeInst.postMessage({ eventType: "menuope", menuname: "showStationLineByRegion", selstate: (item.on == "1"), data: {} });
                return;
            }
            if (item.id == "isOnlyTongxin") {
                if (item.on == "1") {
                    PDP.read("SGC", "sgc/tongxin:GetAllTongxinLines", [], function (data) {
                        if (!data.check("获取通信线路", true))
                            return;
                        ProjectSGC.Map.setMode("tongxin", "blend");
                        ProjectSGC.Map.showStationLines(Ysh.Array.to1d(data.value, 0), [], "tongxin");
                    });
                } else {
                    ProjectSGC.Map.setMode("tongxin", "");
                }
            }
            if (item.id == "specialPS") {
                userSettings.changeInNet(true);
            }
            if (vMain.showApp)
                vMain.showApp(item.id, item.on == "1");
        },
        clickDCVoltageMenu: function (item) { this.clickVoltageMenu(item, 0); },
        clickACVoltageMenu: function (item) { this.clickVoltageMenu(item, 1); },
        clickVoltageMenu: function (item, type) {
            item.checked = !item.checked;
            this.setSelectData(type == 0 ? this.selectDclineVols : this.selectAclineVols, item, ["value", "text"], item.checked);
            var vols = this.getSelectValue(this.selectDclineVols, this.selectAclineVols);
            if (vols.length > 0) {
                MapOpeInst.menu("ShowStationByVol", true, { code: vols });
            } else {
                MapOpeInst.menu("CancelShowStationByVol");
            }
        },
        clickPlantMenu: function (item) { this.clickStationMenu(item, 0); },
        clickSubStationMenu: function (item) { this.clickStationMenu(item, 1); },
        clickStationMenu: function (item, type) {
            if (item.checked) {
                item.checked = false;
                return true;
            }
            ModelList.getPlantStationList(item.value, function (items) {
                if (items.length > 10000) {
                    var bconfirm = true;
                    if (userSettings.itemShowInNet.value != "1") {
                        bconfirm = (SelectCityInst.locateid == "0021990100");
                    }
                    if (bconfirm) {
                        if (!confirm(item.text + "有" + items.length + "个，显示会导致系统变慢，是否继续？")) {
                            return;
                        }
                    }
                }
                item.checked = true;
            });
        },
        setSelectData: function (arr, item, props, isAdd) {
            var index = -1;
            for (var i = 0; i < arr.length; i++) {
                var bFind = true;
                for (var j = 0; j < props.length; j++) {
                    if (arr[i][props[j]] != item[props[j]]) {
                        bFind = false;
                        break;
                    }
                }
                if (bFind) {
                    index = i;
                    break;
                }
            }
            if (isAdd && index < 0) {
                item.checked = true;
                arr.push(item);
            }
            else if (!isAdd && index >= 0) {
                arr.splice(index, 1);
            }
        },
        getSelectValue: function (arr1, arr2) {
            var arrValue = [];
            for (var i = 0; i < arr1.length; i++) {
                arrValue.push(arr1[i].value);
            }
            for (var i = 0; i < arr2.length; i++) {
                arrValue.push(arr2[i].value);
            }
            return arrValue;
        },
        getSectionTypeCss: function (item, index) {
            var css = { "background-color": (item.type == this.sectiontype ? "#369bc1" : "#e5e5e5") }
            if (index > 0)
                css["margin-left"] = "10px";
            return css;
        },
        selectSectionType: function (item) {
            this.sectiontime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(Ysh.Time.parseDate(this.sectiontime)), item.type));
            this.sectiontype = item.type;
        },
        changeSectionTime: function (v) {
            if (!this.showPlayer)
                return;
            MessageInst.postMessage({ eventType: 'menuope', menuname: 'setShowDate', selstate: 1, data: { operatedate: v } });
        },
        changeInnet: function (bNoShowPwName) {
            for (var i = 0; i < this.displayStates.length; i++) {
                var ds = this.displayStates[i];
                if (ds.id == "innet") {
                    this.clickDisplayMenu(ds, bNoShowPwName);
                    return;
                }
            }
        }
    },
    watch: {
        stationStates: function () {
            for (var i = 0; i < this.stationStates.length; i++) {
                this.stationStates[i].imageUrl = this.stationStates[i].on == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png";
            }
        },
        lineStates: function () {
            for (var i = 0; i < this.lineStates.length; i++) {
                this.lineStates[i].imageUrl = this.lineStates[i].on == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png";
            }
        }
    }
});

var userSettings = new Vue({
    el: '#divUserSettings',
    data: {
        displayStates: [{ name: "直连", on: "0", imageUrl: "/i/sgc/off.png", menuName: "", data: {} }],
        all: [],
        itemShowInNet: { name: "显示区外电网", type: "onoff", value: 1 },
        itemShowPoint: { name: "坐标拾取", type: "onoff", value: 0 },
        itemShowSectionType: { name: "显示断面数据", type: "onoff", value: 1 },
        itemTopoDataSrc: { name: "拓扑数据来源", type: "list", options: "0,科东,1,南瑞", value: "0" },
        login: {},
        itemShowSide: { name: '两侧数据', type: 'onoff', value: 1 }
    },
    computed: {
        lineTower: function () {
            for (var i = 0; i < this.all.length; i++) {
                var s = this.all[i];
                if (s.id == "towerCount") {
                    return s;
                }
            }
            return null;
        }
    },
    methods: {
        init: function (all) {
            this.all = all;
            //显示设置的厂站名称默认“简称”，线路名称默认“不显示”
            Ysh.Array.first(userSettings.all, function (item) { return item.id == "shortName"; }).value = 1;
            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshStationFont', selstate: 1, data: { shortName: 1 } });
            Ysh.Array.first(userSettings.all, function (item) { return item.id == "lineShortName"; }).value = -1;
            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshLineFont', selstate: true, data: { lineShortName: -1 } });
            for (var i = 0; i < stationFilter.displayStates.length; i++) {
                var s = stationFilter.displayStates[i];
                if (s.id == "linetower") {
                    s.on = this.lineTower.value;
                    s.imageUrl = (s.on == "1") ? "i/sgc/on.png" : "i/sgc/off.png";
                    continue;
                }
                if (s.id == "name") {
                    s.on = (Ysh.Array.first(userSettings.all, function (item) { return item.id == "shortName"; }).value != "-1" ? "1" : "0");
                    s.imageUrl = (s.on == "1") ? "i/sgc/on.png" : "i/sgc/off.png";
                    continue;
                }
                if (s.id == "linename") {
                    s.on = (Ysh.Array.first(userSettings.all, function (item) { return item.id == "lineShortName"; }).value != "-1" ? "1" : "0");
                    s.imageUrl = (s.on == "1") ? "i/sgc/on.png" : "i/sgc/off.png";
                    continue;
                }
            }
        },
        showItem: function (item) {
            return true;
            //return item.id != "towerCount";
        },
        clickDisplayMenu: function (item) {
            item.on = item.on == "1" ? "0" : "1";
            item.imageUrl = item.on == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png";
        },
        setSetting: function (id, v) {
            for (var i = 0; i < this.all.length; i++) {
                var c = this.all[i];
                if (c.id == id) {
                    c.value = v;
                    return;
                }
            }
        },
        getSetting: function (id, def) {
            for (var i = 0; i < this.all.length; i++) {
                var c = this.all[i];
                if (c.id == id)
                    return c.value;
            }
            return def;
        },
        getConfig: function (array, keys, values) {
            if (array instanceof Array) {
                for (var i = 0; i < array.length; i++)
                    this.getConfig(array[i], keys, values);
                return;
            }
            if (array.type == "group") {
                this.getConfig(array.children, keys, values);
                return;
            }
            keys.push(array.id);
            values.push(array.value);
        },
        saveConfig: function () {
            var keys = [];
            var values = [];
            this.getConfig(this.all, keys, values);
            $.ajax({
                url: "Search/SaveSettings",
                dataType: "json",
                type: "post",
                data: { userid: login.userid, keys: keys, values: values },
                success: function (data) {
                    if (!confirm("保存成功，刷新页面生效，是否现在刷新页面？"))
                        return false;
                    window.location.href = window.location.href.replace("s=1", "");
                },
                error: function (data) {
                    alert("保存设置失败！");
                    console.log(data.responseText);
                }
            });
            return;
            if (!confirm("是否保存当前配置？")) {
                return false;
            }
            var sqlNode = "SetShowTowerOff";
            if (this.displayStates[0].on == "0")
                sqlNode = "SetShowTowerOn";

            $.ajax({
                url: "Search/ExecuteSql",
                dataType: "json",
                type: "post",
                data: { conn: "ConnMain", node: sqlNode, args: [] },
                success: function (data) {
                    if (!confirm("保存成功，刷新页面生效，是否现在刷新页面？"))
                        return false;
                    window.location.reload();
                },
                error: function (data) {
                    alert("保存设置失败！");
                    console.log(data.responseText);
                }
            });
        },
        changeConfig: function (item) {
            var keys = [];
            var values = [];
            this.getConfig(this.all, keys, values);
            PDP.dll("SGCLib:SGCLib.Settings.SaveSettings", [login.userid, keys, values], function (data) {
                if (!data.check("设置", true)) return;
                switch (item.id) {
                    case "glowSecond":
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshGlowSecond', selstate: 1, data: { glowSecond: parseInt(item.value, 10) } });
                        break;
                    case "lineWidth":
                        MapOpeInst.postMessage({ eventType: "menuope", menuname: "setLineWidth", selstate: 1, data: { lineWidth: parseInt(item.value, 10) } });
                        break;
                    case "stationSize":
                        MapOpeInst.postMessage({ eventType: "menuope", menuname: "setStationSize", selstate: 1, data: { stationSize: parseFloat(item.value) } });
                        break;
                    case "shortName":
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshStationFont', selstate: 1, data: { shortName: parseInt(item.value, 10) } });
                        var ss = Ysh.Array.first(stationFilter.displayStates, function (s) { return s.id == "name"; });
                        ss.on = (item.value != "-1" ? "1" : "0");
                        ss.imageUrl = ss.on == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png";
                        stationFilter.$forceUpdate();
                        break;
                    case "showTip":
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshShowTip', selstate: 1, data: { showTip: parseInt(item.value, 10) } });
                        break;
                    case "sectionLimit":
                    case "sectionValue":
                    case "sectionYudu":
                        vMain.sendBusinessMsg("", { type: "sectionsettings", name: item.id, value: item.value });
                        break;
                    case "isShowByRegion":
                        MapOpeInst.postMessage({ eventType: "menuope", menuname: "showStationLineByRegion", selstate: (item.value == 1), data: {} });
                        break;
                    default:
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshYunTu', selstate: 1 });
                        break;
                }
            });
            return;
            $.ajax({
                url: "Search/SaveSettings",
                dataType: "json",
                type: "post",
                data: { userid: login.userid, keys: keys, values: values },
                success: function (data) {
                    //MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshYunTu', selstate: 1 });
                    switch (item.id) {
                        case "glowSecond":
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshGlowSecond', selstate: 1, data: { glowSecond: parseInt(item.value, 10) } });
                            break;
                        case "lineWidth":
                            MapOpeInst.postMessage({ eventType: "menuope", menuname: "setLineWidth", selstate: 1, data: { lineWidth: parseInt(item.value, 10) } });
                            break;
                        case "shortName":
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshStationFont', selstate: 1, data: { shortName: parseInt(item.value, 10) } });
                            var ss = Ysh.Array.first(stationFilter.displayStates, function (s) { return s.id == "name"; });
                            ss.on = (item.value != "-1" ? "1" : "0");
                            ss.imageUrl = ss.on == "1" ? "/i/sgc/on.png" : "/i/sgc/off.png";
                            stationFilter.$forceUpdate();
                            break;
                        case "showTip":
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshShowTip', selstate: 1, data: { showTip: parseInt(item.value, 10) } });
                            break;
                        default:
                            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshYunTu', selstate: 1 });
                            break;
                    }
                },
                error: function (data) {
                    alert("设置失败！");
                    console.log(data.responseText);
                }
            });
        },
        changeInNet: function () {
            if (this.itemShowInNet.value != "1") {
                var arr = SelectCityInst.getLocateOwners(true);
                if (arr) {
                    var sp = stationFilter.getDisplayMenu("specialPS");
                    var bJudgeSpecial = sp && (sp.on == "1");
                    if (bJudgeSpecial) {
                        //看看有没有西南电网
                        var bHasXinan = false;
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] == "990106") {
                                bHasXinan = true;
                                break;
                            }
                        }
                        if (bHasXinan)
                            arr.push("999999");
                    }
                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 1, data: { property: "owner", station: arr, line: arr } });
                }
                MapOpeInst.postMessage({ eventType: "menuope", menuname: "showPwGridName", selstate: 1 });
            } else {
                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 0, data: { property: "owner", station: [], line: [] } });
                MapOpeInst.postMessage({ eventType: "menuope", menuname: "showPwGridName", selstate: 0 });
            }
            menuData.tellBusiness();
        },
        changeShowPoint: function () {
            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'mapCoordinatePickup', selstate: this.itemShowPoint.value == "1", data: {} });
        },
        changeShowSectionData: function () {
            var v = this.itemShowSectionType.value;
            userSettings.setSetting("sectionLimit", v);//sectionValue sectionYudu
            userSettings.setSetting("sectionValue", v);
            userSettings.setSetting("sectionYudu", v);
            vMain.sendBusinessMsg("", { type: "sectionsettings", name: "showType", value: v });
        },
        changeTopoDataSrc: function () {
            vMain.sendBusinessMsg("", { type: "toposrcchanged", value: this.itemTopoDataSrc.value });
        },
        manualSync: function () {
            if (!confirm("此操作将全部杆塔数据重新加载到缓存中，将会影响所有使用的用户，\r\n请慎重！！！\r\n确定是否继续？"))
                return;
            PDP.dll('graphThree:graphThree.ThreadTask.GraphThreadTask.UpdateAllInfo', [], function (ret) {
                if (!ret.check('手动同步')) return;
            }, true);
        },
        showSideData: function () {
            var v = (this.itemShowSide.value == 1) ? "" : "none";
            document.getElementById("frmSideLeft").style.display = v;
            document.getElementById("frmSideRight").style.display = v;
        }
    },
    created: function () {
        stationFilter.userSettings = this;
        this.login = login;
    }
});

var showingMenu = new Vue({
    el: "#divShowingMenu",
    data: {
        show: false,
        item: null,
        current: "",
        map: Ysh.Dictionary.init("single", [1, 2, 0], ["卫星图", "矢量图", "不显示"], 1),
        gis: Ysh.Dictionary.init("multi", ["railway", "water"], ["铁路", "水系"], []),
        screen: Ysh.Dictionary.init("single", [0, 1, 2], ["单屏", "双屏", "无列表"], 0),
        boundary: Ysh.Dictionary.init("single", [0, 1], [{ text: "厂站主题" }, { text: "电网主题" }], 0),
        //voltages: Ysh.Dictionary.init("multi", [1, 2, 3, 4, 5, 6, 7], ["UHV", "EHV750", "EHV500", "HV220", "HV110", "HV35", "DS"], []),
        //voltages: Ysh.Dictionary.init("multi", [1, 2, 3, 4, 5, 6], ["UHV", "EHV750/500", "HV330/220", "HV110/66", "HV35", "DS"], []),
        voltages: Ysh.Dictionary.init("multi", [1, 2, 3, 4], ["DC", "UHV", "EHV", "HV220+"], []),
        running_theme: Ysh.Dictionary.init("multi", ["dispatch", "license", "connectionline", "section"], ["直调", "许可", "联络线", "断面"], []),
        runningThemes: [{ value: "dispatch", text: "直调", checked: false }, { value: "license", text: "许可", checked: false }, { value: "connectionline", text: "联络线", checked: false }, { value: "section", text: "断面", checked: false }],
        //ps: Ysh.Dictionary.init("multi", [1, 2, 3, 4, 5], ["发电厂", "变电站", "换流站", "交流线路", "直流线路"], [1, 2, 3, 4, 5]),
        ps: Ysh.Dictionary.init("multi", ["plant", "substation", "conver", "ac", "dc"], ["发电厂", "变电站", "换流站", "交流线路", "直流线路"], ["plant", "substation", "conver", "ac", "dc"]).list,
        grid: Ysh.Dictionary.init("multi", [1, 2, 3, 4, 5], ["全网", "区域", "省网", "地区网", "县级网"], []),
        shapetypes: [{ key: 0, text: "矩形", img: "/i/sgcmenu/selectzone.png" }
            , { disabled: false, key: 2, text: "自由选择", img: "/i/sgcmenu/selectzoneex.png" }
            , { disabled: false, key: 4, text: "圆形", img: "/i/sgcmenu/selectzonecircle.png" }],//Ysh.Dictionary.init("multi", [0, 2], ["矩形", "自由选择"], []),
        state: [],
        scenes_sys: [],
        scenes: [[]],//Ysh.Dictionary.init("single", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ["UHV", "EHV", "HV", "DC", "DG", "抽蓄", "风", "光", "核", "水", "牵引站"], 1)
        editScene: false,
        showNewScene: false,
        sceneName: "",
        menuData: menuData,
        bkSGCModel: SGCModel,
        tools: [{
            id: "ceju",
            img: "/i/sgc/ceju.png",
            text: "测距"
        }, {
            id: "cutimg",
            img: "/i/sgc/cutimg.png",
            text: "截屏"
        }],
        runningType: "",
        runningTypes: []
    },
    computed: {
        //showPlantTypes: function () { if (this.boundary.selected !== 0) return false; return this.ps.selected.indexOf(1) >= 0; },
        //showStationTypes: function () { if (this.boundary.selected !== 0) return false; return this.ps.selected.indexOf(2) >= 0; },
        showPlantTypes: function () { if (this.boundary.selected !== 0) return false; return this.ps[0].selected; },
        showStationTypes: function () { if (this.boundary.selected !== 0) return false; return this.ps[1].selected; },
        selectDcs: {
            get: function () { for (var i = 0; i < this.dcs.length; i++) { if (!this.dcs[i].selected) return false; }; return true; },
            set: function (b) {
                for (var i = 0; i < this.dcs.length; i++) this.dcs[i].selected = b;
            }
        },
        selectAcs: {
            get: function () { for (var i = 0; i < this.acs.length; i++) { if (!this.acs[i].selected) return false; }; return true; },
            set: function (b) {
                for (var i = 0; i < this.acs.length; i++) this.acs[i].selected = b;
            }
        }, plantTypes: function () {
            return this.menuData.getPlantStationByItems([1001, 1002, 1003, 1006, 1004, 1005]);
        }, stationTypes: function () {
            return this.menuData.getPlantStationByItems([3001, 2004, 2003]);
        }, allvoltages: function () { return this.menuData.voltages; },
        dcs: function () { return this.menuData.dcs; },
        acs: function () { return this.menuData.acs; }
    },
    methods: {
        clickTool: function (tool) {
            switch (tool.id) {
                case "cutimg":
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "GetMapImg", selstate: true, data: {} });
                    return;
                case "ceju":
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "measureSurface", selstate: true, data: { labelStyle: { fontSize: 30 } } });
                    return;
            }
        },
        showLine: function (show) {
            /*if (!show) {
                this.item.text = "无线路";
                showingMenu.unlock();
            }*/
            MapOpeInst.menu("setLineACShowHide", show, { lineType: 1 });
            MapOpeInst.menu("setLineDCShowHide", show, { lineType: 2 });
        },
        removeGridTheme: function () {
            var theme = topMenuBar.getTheme("grid");
            if (theme.text) {
                //this.$Message.warning("清除电网场景")
                //alert("本操作将切换电网场景!");
                theme.text = "";
            }
        },
        isInVoltageGroup: function (g, v) {
            switch (g.key) {
                case 1://DC
                    return v.isDc;
                case 2://UHV
                    if (v.isDc)
                        return (v.value == 1100) || (v.value == 800);
                    return v.value == 1000;
                case 3://EHV
                    if (v.isDc)
                        return true;
                    return v.value >= 500;
                case 4://220kV++
                    if (v.isDc)
                        return true;
                    return v.value >= 220;
            }
            return false;
        },
        selectGridTheme: function (item) {
            this.restoreMainTheme();
            this.$nextTick(function () {
                for (var i = 0; i < this.allvoltages.length; i++) {
                    var v = this.allvoltages[i];
                    v.selected = this.isInVoltageGroup(item, v);
                }
                for (var i = 0; i < this.voltages.list.length; i++) {
                    var v = this.voltages.list[i];
                    v.selected = (v == item);
                }
                this.changeVoltages(item)
                topMenuBar.lock(true);
                Vue.set(topMenuBar.getTheme("grid"), "text", item.data);
                this.showLine(true);
            });
        },
        refreshRunningTheme: function () {
            //if (this.runningType)
            //    this.selectRunningTheme({ key: this.runningType });
            //return;
            for (var i = 0; i < this.runningTypes.length; i++) {
                var t = this.runningTypes[i];
                this.selectRunningTheme({ value: t, checked: true });
            }
        },
        selectRunningTheme1: function (item) {
            item = item || { key: "" };
            if ((this.runningType == "license") && (this.runningType != item.key))
                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 0, data: { property: "licenseOrgID", station: [], line: [] } });
            if ((this.runningType == "dispatch") && (this.runningType != item.key))
                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 0, data: { property: "dispatchOrgID", station: [], line: [] } });
            this.runningType = item.key;
            switch (item.key) {
                case "dispatch":
                    var arr = [SelectCityInst.getLocateOwner()];
                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 1, data: { property: "dispatchOrgID", station: arr, line: arr } });
                    break;
                case "license":
                    var arr = [SelectCityInst.getLocateOwner()];
                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 1, data: { property: "licenseOrgID", station: arr, line: arr } });
                    break;
                case "connectionline":
                    vMain.showPage("connectionline", "联络线", "sgc_connectionline");
                    break;
                case "section":
                    vMain.showPage("section", "电网断面", "sgc_section");
                    break;
            }
            if (item.data)
                Vue.set(topMenuBar.getTheme("running"), "text", item.data);
        },
        checkRunningTheme: function (type, checked) {
            switch (type) {
                case "dispatch":
                    if (checked) {
                        var arr = [SelectCityInst.getLocateOwner()];
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 1, data: { property: "dispatchOrgID", station: arr, line: arr, isCommonControl: true } });
                    } else {
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 0, data: { property: "dispatchOrgID", station: [], line: [] } });
                    }
                    return;
                case "license":
                    if (checked) {
                        var arr = [SelectCityInst.getLocateOwner()];
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 1, data: { property: "licenseOrgID", station: arr, line: arr, isCommonControl: true } });
                    } else {
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 0, data: { property: "licenseOrgID", station: [], line: [] } });
                    }
                    return;
                case "connectionline":
                    if (checked)
                        vMain.showPage("connectionline", "联络线", "sgc_connectionline");
                    else
                        vMain.closePage("connectionline");
                    return;
                case "section":
                    if (checked)
                        vMain.showPage("section", "电网断面", "sgc_section");
                    else
                        vMain.closePage("section");
                    return;
            }
        },
        selectRunningTheme: function (item) {
            if (!item) {
                for (var i = this.runningTypes.length - 1; i >= 0; i--) {
                    this.checkRunningTheme(this.runningTypes[i], false);
                }
                this.runningTypes = [];
                for (var i = 0; i < this.runningThemes.length; i++)
                    this.runningThemes[i].checked = false;
                return;
            }
            //if ((this.runningType == "license") && (this.runningType != item.key))
            //    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 0, data: { property: "licenseOrgID", station: [], line: [] } });
            //if ((this.runningType == "dispatch") && (this.runningType != item.key))
            //    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 0, data: { property: "dispatchOrgID", station: [], line: [] } });
            //this.runningType = item.key;
            this.checkRunningTheme(item.value, item.checked);
            if (item.checked) this.runningTypes.addSkipSame(item.value);
            else this.runningTypes.erase(item.value);
            for (var i = 0; i < this.runningThemes.length; i++) {
                var rt = this.runningThemes[i];
                if (rt.value == item.value) {
                    if (rt.checked != item.checked)
                        rt.checked = item.checked;
                    break;
                }
            }

            //if (item.data)
            //    Vue.set(topMenuBar.getTheme("running"), "text", item.data);
        },
        removeStationTheme: function () {
            for (var i = 0; i < this.stationTypes.length; i++) {
                var t = this.stationTypes[i];
                t.selected = true;
            }
            this.ps[2].selected = true;
            this.refreshStation(false);
            Vue.set(topMenuBar.getTheme("station"), "text", "");
            this.showLine(true);
        },
        showPlantStationThemeContent: function (item) {
            topMenuBar.getTheme("grid").text = "";
        },
        exitYanshi: function () {
            if (!vMain.ystype)
                return;
            SGCModel = this.bkSGCModel;
            vMain.ystype = '';
            vMain.boardcast.caption.erase("发电规模");
            vMain.boardcast.caption.erase("变电规模");
            vMain.boardcast.content = "";
            vMain.playPage = "";
            MapOpeInst.postMessage({ locateType: 11, selstate: false });
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "SetBackgroundForMap", selstate: false });
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "LocationArea", selstate: false });
            ProjectSGC.Map.setMode("player", "");
        },
        selectAllStationTheme: function () {
            this.exitYanshi();
            this.selectRailway(false);
            this.selectWater(false);
            var item = { value: -1, text: "全部" };
            this.menuData.selectPlantStation(item.value);
            this.showPlantStationThemeContent(item);
            topMenuBar.getTheme("plant").text = "";
            Vue.set(topMenuBar.getTheme("station"), "text", item.text);
            topMenuBar.$forceUpdate();
        },
        doStationYanshi: function (args) {
            vMain.quitSelectZone();
            if (vMain.ystype == "station")
                return;
            if (vMain.ystype)
                MapOpeInst.postMessage({ locateType: 11, selstate: false });
            else
                this.bkSGCModel = SGCModel;
            menuData.prevTypes = [];
            menuData.selectedPs = [];
            SGCModel = vMain.$refs.ssys.model;
            topMenuBar.getTheme("plant").text = "";
            Vue.set(topMenuBar.getTheme("station"), "text", "");
            topMenuBar.$forceUpdate();
            vMain.ystype = 'station';
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "SetBackgroundForMap", selstate: true, data: { saturate: 3, opacity: 0.7 } });
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "LocationArea", selstate: true, data: { level: "country" } });
            vMain.$nextTick(function () {
                var o = this.$refs.ssys;
                o.initPlay(function () {
                    if (args) {
                        vMain.minSectionTime = Ysh.Time.toString(Ysh.Time.add('y', -30, Ysh.Time.getTimeStart(new Date(), 'y')));
                        vMain.sectiontime = vMain.minSectionTime;
                        vMain.maxSectionTime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'y'));
                        o.clickPlayerButton();
                        vMain.loopPlay = true;
                        vMain.$nextTick(function () {
                            vMain.$refs.player.play();
                        });
                    }
                });
            });
        },
        selectRailway: function (b) {
            if (b == this.gis.list[0].selected) return;
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "setSpecialMap", selstate: b, data: { type: "railway" } });
            this.gis.list[0].selected = b;
            Vue.set(topMenuBar.getMenu("gis"), "needFocus", this.gis.list[0].selected || this.gis.list[1].selected)
        },
        selectWater: function (b) {
            if (b == this.gis.list[1].selected) return;
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "setSpecialMap", selstate: b, data: { type: "water" } });
            this.gis.list[1].selected = b;
            Vue.set(topMenuBar.getMenu("gis"), "needFocus", this.gis.list[0].selected || this.gis.list[1].selected)
        },
        selectStationTheme: function (item) {
            this.exitYanshi();
            //this.showLine(false);
            this.menuData.selectPlantStation(item.value);
            this.showPlantStationThemeContent(item);
            topMenuBar.getTheme("plant").text = "";
            Vue.set(topMenuBar.getTheme("station"), "text", item.text);
            topMenuBar.$forceUpdate();
            this.selectWater(false);
            if (item.text && item.text.startsWith("牵引")) {
                this.selectRailway(true);
                //MapOpeInst.postMessage({ eventType: "menuope", menuname: "setSpecialMap", selstate: true, data: { type: "railway" } });
                //this.gis.list[0].selected = true;
                //Vue.set(topMenuBar.getMenu("gis"), "needFocus", true)
            } else {
                this.selectRailway(false);
            }
        },
        selectAllPlantTheme: function () {
            this.exitYanshi();
            this.selectRailway(false);
            this.selectWater(false);
            var item = { value: -2, text: "全部" };
            this.menuData.selectPlantStation(item.value);
            this.showPlantStationThemeContent(item);
            topMenuBar.getTheme("station").text = "";
            Vue.set(topMenuBar.getTheme("plant"), "text", item.text);
            topMenuBar.$forceUpdate();
        },
        doPlantYanshi: function (args) {
            vMain.quitSelectZone();
            if (vMain.ystype == "plant")
                return;
            if (vMain.ystype)
                MapOpeInst.postMessage({ locateType: 11, selstate: false });
            else
                this.bkSGCModel = SGCModel;
            menuData.prevTypes = [];
            menuData.selectedPs = [];
            SGCModel = vMain.$refs.psys.model;
            topMenuBar.getTheme("station").text = "";
            Vue.set(topMenuBar.getTheme("plant"), "text", "");
            topMenuBar.$forceUpdate();
            vMain.ystype = 'plant';
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "SetBackgroundForMap", selstate: true, data: { saturate: 3, opacity: 0.7 } });
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "LocationArea", selstate: true, data: { level: "country" } });
            vMain.$nextTick(function () {
                var o = this.$refs.psys;
                o.initPlay(function () {
                    if (args) {
                        vMain.minSectionTime = Ysh.Time.toString(Ysh.Time.add('y', -30, Ysh.Time.getTimeStart(new Date(), 'y')));
                        vMain.sectiontime = vMain.minSectionTime;
                        vMain.maxSectionTime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'y'));
                        o.clickPlayerButton();
                        vMain.loopPlay = true;
                        vMain.$nextTick(function () {
                            vMain.$refs.player.play();
                        });
                    }
                });
            });
        },
        selectPlantTheme: function (item) {
            this.exitYanshi();
            this.selectRailway(false);
            this.menuData.selectPlantStation(item.value);
            this.showPlantStationThemeContent(item);
            topMenuBar.getTheme("station").text = "";
            Vue.set(topMenuBar.getTheme("plant"), "text", item.text);
            topMenuBar.$forceUpdate();
            //vMain.showPage("plant", "发电主题", "sgc_plant_cx", { type: item.value });
            if (item.text && item.text.startsWith("水电")) {
                this.selectWater(true);
                //MapOpeInst.postMessage({ eventType: "menuope", menuname: "setSpecialMap", selstate: true, data: { type: "water" } });
                //this.gis.list[1].selected = true;
                //Vue.set(topMenuBar.getMenu("gis"), "needFocus", true)
            } else {
                this.selectWater(false);
            }
        },
        selectStationTheme1: function (item) {
            var arr = [], text = "";
            if (item) {
                arr = [item.key];
                text = item.text;
                this.selectPlantTheme(null);
                topMenuBar.getTheme("grid").text = "";
                this.showLine(false);
            }
            for (var i = 0; i < this.stationTypes.length; i++) {
                var t = this.stationTypes[i];
                t.selected = (arr.indexOf(t.key) >= 0);
            }
            this.ps[2].selected = (arr.indexOf("3001") >= 0);
            this.refreshStation(!!item);
            Vue.set(topMenuBar.getTheme("station"), "text", text);
        },
        removePlantTheme: function () {
            this.selectWater(false);
            for (var i = 0; i < this.plantTypes.length; i++) {
                var t = this.plantTypes[i];
                t.selected = true;
            }
            this.showLine(true);
            this.refreshStation(false);
            Vue.set(topMenuBar.getTheme("plant"), "text", "");
        },
        restoreMainTheme: function () {
            this.selectRailway(false);
            this.selectWater(false);
            this.exitYanshi();
            topMenuBar.getTheme("plant").text = "";
            topMenuBar.getTheme("station").text = "";
            topMenuBar.getTheme("custom").text = "";
            //MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'CancelShowStationLineByInfo', selstate: true, data: {} });
            ProjectSGC.Map.setMode("station", "");
            stationFilter.selectPlantStationType();
        },
        selectPlantTheme1: function (item) {
            var arr = [], text = "";
            if (item) {
                arr = [item.key];
                text = item.text;
                this.selectStationTheme(null);
                topMenuBar.getTheme("grid").text = "";
                this.showLine(false);
            }
            for (var i = 0; i < this.plantTypes.length; i++) {
                var t = this.plantTypes[i];
                t.selected = (arr.indexOf(t.key) >= 0);
            }
            this.refreshStation(!!item);
            Vue.set(topMenuBar.getTheme("plant"), "text", text);
        },
        changeMapType: function () {
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "setMapType", data: { type: this.map.selected } });
        },
        changeScreenType: function () {
            ProjectSGC.Config.OpenMode = this.screen.selected;
        },
        changeBoundaryType: function () {
            //this.item.text = (this.boundary.selected ? "电网主题" : "厂站主题");
            if (this.boundary.selected == 1) {
                alert("正在建设中...");
                this.$nextTick(function () {
                    this.boundary.selected = 0;
                    this.item.state = 0;
                });
                return;
            }
            this.item.state = this.boundary.selected ? 1 : 0;
            //切换主题，解锁
            topMenuBar.lock(false);
        },
        needFocusState: function () {
            var b = false;
            for (var i = 0; i < this.state.list.length; i++) {
                var item = this.state.list[i];
                if (item.key == 1) {
                    if (!item.selected) {
                        b = true;
                        break;
                    }
                    continue;
                }
                if (item.selected) {
                    b = true;
                    break;
                }
            }
            return b;
        },
        getSelectedStates: function (t) {
            var states = [];
            for (var s = 0; s < this.state.list.length; s++) {
                var item = this.state.list[s];
                if (item.selected) {
                    for (var i = 0; i < item.data.data.length; i++) {
                        var d = item.data.data[i];
                        if (d[0] == t) {
                            states.push(d[2]);
                            break;
                        }
                    }
                }
            }
            return states;
        },
        changeGis: function (item) {
            var b = false;
            var lst = this.gis.list;
            for (var i = 0; i < lst.length; i++) {
                if (lst[i].selected) {
                    if (!item) {
                        lst[i].selected = false;
                        MapOpeInst.postMessage({ eventType: "menuope", menuname: "setSpecialMap", selstate: false, data: { type: lst[i].key } });
                    } else {
                        b = true;
                    }
                }
            }
            if (item) {
                MapOpeInst.postMessage({ eventType: "menuope", menuname: "setSpecialMap", selstate: item.selected, data: { type: item.key } });
            }
            Vue.set(topMenuBar.getMenu("gis"), "needFocus", b)
        },
        changeState: function (item, onlyState) {
            var stationState = "";
            var lineState = "";
            for (var i = 0; i < item.data.data.length; i++) {
                var d = item.data.data[i];
                if (d[0] == "0")
                    stationState = d[2];
                else
                    lineState = d[2];
            }
            //Vue.set(this.item, "needFocus", this.needFocusState());          
            MapOpeInst.menu("setShowHideState", item.selected, { stationstate: stationState, linestate: lineState });
            if (!onlyState) {
                Vue.set(topMenuBar.getMenu("state"), "needFocus", this.needFocusState());
                menuData.tellBusiness();
            }
        },
        showSaveScene: function () {
            this.showNewScene = false;
            this.showAddNewScene();
        },
        getSceneSettings: function (type) {
            switch (type) {
                case "l":
                    var arr = [];
                    if (this.ps[3].selected)
                        arr.push(1);
                    if (this.ps[4].selected)
                        arr.push(2);
                    return arr.join();
                case "v":
                    var arr = [];
                    for (var i = 0; i < this.allvoltages.length; i++) {
                        var v = this.allvoltages[i];
                        if (v.selected)
                            arr.push(v.key);
                    }
                    return arr.join();
                case "s":
                    var arr = [];
                    for (var i = 0; i < this.menuData.selectPlantTypes.length; i++)
                        arr.push(this.menuData.selectPlantTypes[i].value);
                    for (var i = 0; i < this.menuData.selectStationTypes.length; i++)
                        arr.push(this.menuData.selectStationTypes[i].value);
                    return arr.join();
                default:
                    return "";
            }
        },
        deleteScene: function (item) {
            if (!confirm("确定删除场景：" + item[1] + "?"))
                return;
            if (PDP.exec([{ type: 'modify', db: "ConnMain", sql: "SearchCommonSql:DeleteScene", args: [item[0]] }]).check("删除场景", false)) {
                this.getMyScenes();
            }
        },
        saveScene: function (item) {
            var exes = [];
            var id = null;
            if (item != null) {
                if (!confirm("是否覆盖场景：" + item[1] + "?"))
                    return;
                id = item[0];
                exes.push({ type: 'modify', db: "ConnMain", sql: "SearchCommonSql:DeleteSceneConfig", args: [id] });
            } else {
                if (Ysh.String.trim(this.sceneName) == "") {
                    alert("请输入场景名称");
                    return;
                }
                var v = PDP.read("ConnMain", "SearchCommonSql:CheckScene", [this.sceneName, login.userid]);
                if (!v.check("检查场景名称有效性", true))
                    return;
                if (v.value.length > 0) {
                    alert("此场景名称已经被使用，请修改再试！");
                    return;
                }
                exes.push({ type: 'new', db: "ConnMain", sql: "SearchCommonSql:InsertScene", args: [login.userid, this.sceneName, ""] });
                id = { ref: "0", value: "-2" };
            }
            exes.push({ type: 'modify', db: "ConnMain", sql: "SearchCommonSql:InsertSceneConfig", args: [id, "l", this.getSceneSettings("l")] });
            exes.push({ type: 'modify', db: "ConnMain", sql: "SearchCommonSql:InsertSceneConfig", args: [id, "v", this.getSceneSettings("v")] });
            exes.push({ type: 'modify', db: "ConnMain", sql: "SearchCommonSql:InsertSceneConfig", args: [id, "s", this.getSceneSettings("s")] });
            if (PDP.exec(exes).check("保存场景", false)) {
                this.getMyScenes();
                this.editScene = false;
                this.showNewScene = false;
            }
        },
        showAddNewScene: function () {
            //alert("正在建设中...");
            //return;
            this.sceneName = "";
            this.showNewScene = true
        },
        changeScene: function (item) {
            var vm = this;
            PDP.read("ConnMain", "SearchCommonSql:GetSceneConfig", [item[0]], function (data) {
                if (!data.check("获取场景配置", true))
                    return;
                data = data.value;
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    var arr = d[1].split(',');
                    switch (d[0]) {
                        case "v":
                            //topMenuBar.getTheme("grid").text = "";
                            vm.removeGridTheme();
                            topMenuBar.lock(true);
                            vm.setVoltageSelected(arr);
                            vm.lockVoltages();
                            break;
                        case "s":
                            vm.setPSTypeSelected(arr, true);
                            break;
                        case "l":
                            /*
                            vm.ps[3].selected = (arr.indexOf("1") >= 0);
                            vm.ps[4].selected = (arr.indexOf("2") >= 0);
                            MapOpeInst.menu("setLineACShowHide", vm.ps[3].selected, { lineType: 1 });
                            MapOpeInst.menu("setLineDCShowHide", vm.ps[4].selected, { lineType: 2 });
                            */
                            break;
                    }
                }
                //topMenuBar.getTheme("custom").text = item.text;
                vm.refreshStation(true);
            });
        },
        changePlantType: function (item) {
            menuData.defineScene = true;
            stationFilter.clickPlantMenu(item);
            return;
            Ysh.Dictionary.setSelected(item, item.selected);
            this.refreshStation(true);
        },
        changeStationType: function (item) {
            menuData.defineScene = true;
            stationFilter.clickSubStationMenu(item);
            return;
            Ysh.Dictionary.setSelected(item, item.selected);
            this.refreshStation(true);
        },
        changePlantStationLine: function (item) {
            switch (item.key) {
                case "plant":
                    Ysh.Dictionary.setAllSelected(this.plantTypes, item.selected);
                    this.refreshStation(true);
                    break;
                case "substation":
                    Ysh.Dictionary.setAllSelected(this.stationTypes, item.selected);
                    this.refreshStation(true);
                    break;
                case "conver":
                    this.refreshStation(true);
                    break;
                case "ac":
                    MapOpeInst.menu("setLineACShowHide", item.selected, { lineType: 1 });
                    break;
                case "dc":
                    MapOpeInst.menu("setLineDCShowHide", item.selected, { lineType: 2 });
                    break;
            }
        },
        changeVoltages: function (item) {
            Ysh.Dictionary.setSelected(item, item.selected, true, true);
            this.lockVoltages();
        },
        changeVoltage: function (item) {
            this.removeGridTheme();
            topMenuBar.lock(true);
            Ysh.Dictionary.setSelected(item, item.selected, true, true);
            this.lockVoltages();
        },
        changeDcs: function () {
            this.removeGridTheme();
            topMenuBar.lock(true);
            this.lockVoltages();
            //this.selectDcs = !this.selectDcs;
        },
        changeAcs: function () {
            //this.selectDcs = !this.selectDcs;
            this.removeGridTheme();
            topMenuBar.lock(true);
            this.lockVoltages();
        },
        changeGrids: function () {
            alert(this.grid.selected);
        },
        lockVoltages: function () {
            MapOpeInst.lastVols = "";
            return;
            this.$nextTick(function () {
                var arr = [];
                for (var i = 0; i < this.allvoltages.length; i++) {
                    var v = this.allvoltages[i];
                    if (v.selected)
                        arr.push(v.key);
                }
                MapOpeInst.menu("ShowStationByVol", true, { code: arr });
            });
        },
        setVoltageSelected: function (arr) {
            for (var i = 0; i < this.allvoltages.length; i++) {
                var v = this.allvoltages[i];
                Ysh.Dictionary.setSelected(v, arr.indexOf(v.key.toString()) >= 0, true, true);
            }
        },
        setStateNameSelected: function (arr) {
            for (var i = 0; i < this.state.list.length; i++) {
                var v = this.state.list[i];
                var b = false;
                for (var j = 0; j < v.data.data.length; j++) {
                    var v1 = v.data.data[j][3].toString();
                    b = arr.indexOf(v1) >= 0;
                    if (b) {
                        break;
                    }
                }
                if (b != v.selected) {
                    v.selected = b;
                    this.changeState(v, true);
                }
            }
            Vue.set(topMenuBar.getMenu("state"), "needFocus", this.needFocusState());
            menuData.tellBusiness();
        },
        refreshStation: function (bLocate) {
            /*
            var arr = [];
            for (var i = 0; i < this.plantTypes.length; i++) {
                var t = this.plantTypes[i];
                if (t.selected)
                    arr.push(t.key);
            }
            for (var i = 0; i < this.stationTypes.length; i++) {
                var t = this.stationTypes[i];
                if (t.selected)
                    arr.push(t.key);
            }
            if (this.ps[2].selected)
                arr.push(3001);
            if (bLocate) {
                PDP.read("SGC", "SearchCommonSql:GetVoltageByPlantStationType", [arr.join()], function (data) {
                    if (!data.check("获取厂站电压等级", true))
                        return;
                    data = data.value;
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][0])
                            arr.push(data[i][0]);
                    }
                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'flyToVoltageLevelByCode', selstate: 1, data: { modelevel: arr } });
                });
            }
            MapOpeInst.menu("showHideStationByType", true, { plantstationtype: arr });
            */
        },
        setPSTypeSelected: function (arr, selected) {
            var hasPlant = false;
            for (var i = 0; i < this.plantTypes.length; i++) {
                var t = this.plantTypes[i];
                t.checked = (arr.indexOf(t.value.toString()) >= 0);
                if (t.checked)
                    hasPlant = true;
            }
            var hasStation = false;
            for (var i = 0; i < this.stationTypes.length; i++) {
                var t = this.stationTypes[i];
                t.checked = (arr.indexOf(t.value.toString()) >= 0);
                if (t.checked)
                    hasStation = true;
            }
            this.ps[0].selected = hasPlant;
            this.ps[1].selected = hasStation;
            this.ps[2].selected = (arr.indexOf("3001") >= 0);
        },
        lock: function () {
            if (this.boundary.selected)
                this.lockVoltages();
            else
                this.lockVoltages();

        },
        unlock: function () {
            topMenuBar.lock(false);
            this.show = false;
            this.doUnlock();
        },
        doUnlock: function () {
            //if (this.boundary.selected)
            //    MapOpeInst.menu("CancelShowStationByVol");
            //else
            MapOpeInst.menu("CancelShowStationByVol", true, { changeMain: menuData.getSelectedPlantStations().length == 0 });
        },
        setScenes: function (my, sys) {
            my = Ysh.Array.groupBy(my, [2])
            if (my.length == 0)
                my = [[]];
            this.scenes = my;
            sys = Ysh.Array.groupBy(sys, [2])
            this.scenes_sys = sys;
        },
        getMyScenes: function (bSys) {
            var vm = this;
            var lst = [{ type: "read", db: "ConnMain", sql: "SearchCommonSql:GetSceneList", args: [login.userid] }];
            if (bSys) {
                lst.push({ type: "read", db: "ConnMain", sql: "SearchCommonSql:GetSysSceneList", args: [] });
            }
            PDP.exec(lst, function (data) {
                if (!data.check("获取场景列表", true))
                    return;
                data = data.value;
                var my = data[0];
                var sys = [];
                if (bSys) sys = data[1];
                vm.setScenes(my, sys);
            });
        },
        setSelectedVoltages: function () {
            for (var i = 0; i < this.voltages.list.length; i++) {
                var v = this.voltages.list[i];
                Ysh.Dictionary.setSelected(v, this.voltages.selected.indexOf(v.key) >= 0, true, true);
            }
        }, isLock: function () {
            return topMenuBar.lock();
        }, getVoltageItem: function (code) {
            for (var i = 0; i < this.allvoltages.length; i++) {
                var item = this.allvoltages[i];
                if (item.key == code)
                    return item;
            }
            return null;
        }, selectShapeType: function (item) {
            if (item.disabled) return;
            var menu = topMenuBar.getMenu("selectzone");
            if (!menu) return;
            menu.state = item.key;
            menu.click(0, 0, false);
        }
    },
    created: function () {
        var vm = this;
        topMenuBar.getMenu("map").getImg = function () {
            switch (vm.map.selected) {
                case 1:
                    return "/i/sgcmenu/map_sat.png";
                case 2:
                    return "/i/sgcmenu/map_street.png";
                case 0:
                default:
                    return "/i/sgcmenu/map.png";
            }
        }
        topMenuBar.getMenu("screen").getImg = function () {
            switch (vm.screen.selected) {
                case 1:
                    return "/i/sgcmenu/screen-m.png";
                case 2:
                    return "/i/sgcmenu/screen-n.png";
                case 0:
                default:
                    return "/i/sgcmenu/screen-s.png";
            }
        }
        topMenuBar.$forceUpdate();
        MapOpeInst.showMenuOpe6 = function (data) {
            if (vm.isLock())
                return;
            if (!data.data.arrVolInfo)
                return;
            data.data.arrVolInfo.sort();
            var str = data.data.arrVolInfo.join();
            if (str == this.lastVols) return;
            this.lastVols = str;
            Ysh.Dictionary.setAllSelected(vm.allvoltages, false);
            var groups = [];
            for (var i = 0; i < data.data.arrVolInfo.length; i++) {
                var v = data.data.arrVolInfo[i];
                var item = vm.getVoltageItem(v);
                if (item == null)
                    continue;
                item.selected = true;
                if (item.parent)
                    groups.push(item.parent.key);
            }
            vm.voltages.selected = groups;
            //vm.setSelectedVoltages();
            vm.grid.selected = groups;
            /*
            vm.voltages.selected = data.data.arrVolLevel;
            vm.setSelectedVoltages();
            vm.grid.selected = data.data.arrVolLevel;
            */
        }
        MapOpeInst.showMenuOpe7 = function (data) {
            vm.map.selected = data.data.type;
        }
        MapOpeInst.showMenuOpe8 = function (data) {
            if (data.typeName == "setShiJiao") {
                if (data.data.type == 6) {//C1 视角
                    var citycode = SelectCityInst.getLocateGrid();//.getRootGrid();
                    MessageInst.eventSource = [];
                    //$("#selCityHotCityId").find("a[citycode=" + citycode + "]").click();
                    SelectCityInst.locate(citycode, true);
                }
            }
        }
    },
    mounted: function () {
        //var vm = this;
        //this.getMyScenes(true);
    },
    watch: {
        allvoltages: {
            deep: true,
            handler: function () {
                //alert(this.allvoltages);
            }
        }, "menuData.dictPs": {
            deep: true,
            handler: function () {
                var arrSelectedPlant = this.menuData.selectPlantTypes;
                var arrSelectedStation = this.menuData.selectStationTypes;
                var msg = "";
                var plantText = "", stationText = "";
                if (arrSelectedPlant.length == this.menuData.plantTypes.length) {
                    if (arrSelectedStation.length == 0) {
                        plantText = "全部";
                        msg = "全部发电";
                    }
                } else if (arrSelectedStation.length == this.menuData.stationTypes.length) {
                    if (arrSelectedPlant.length == 0) {
                        stationText = "全部";
                        msg = "全部变电";
                    }
                }
                if (!msg) {
                    if (arrSelectedPlant.length == 1) {
                        if (arrSelectedStation.length == 0) {
                            var plant = arrSelectedPlant[0];
                            if (this.plantTypes.indexOf(plant) >= 0) {
                                plantText = plant.text;
                                msg = plantText;
                            }
                        }
                    } else if (arrSelectedPlant.length == 0) {
                        if (arrSelectedStation.length == 1) {
                            var station = arrSelectedStation[0];
                            if (this.stationTypes.indexOf(station) >= 0) {
                                stationText = station.text;
                                msg = stationText;
                            }
                        }
                    }
                }
                if (!msg) {
                    /*var plantText_old = topMenuBar.getTheme("plant").text;
                    if (plantText_old)
                        msg = "切换发电场景";
                    else {
                        var stationText_old = topMenuBar.getTheme("station").text;
                        if (stationText_old)
                            msg = "切换变电场景";
                    }*/
                    msg = "已切换场景";
                } else {
                    msg = '切换到' + msg + '场景';
                }
                topMenuBar.getTheme("plant").text = plantText;
                topMenuBar.getTheme("station").text = stationText;
                //if (msg)
                //this.$Message.success(msg);
                topMenuBar.$forceUpdate();
            }
        }
    }
})

var vSelectZone = { s: "", l: "" };
if (MessageInst) {
    Ysh.Object.addHandle(MessageInst, "beforeNotify", function (event) {
        if ((!event) || (!event.data))
            return false;
        var data = eval(event.data);
        if (data.eventType == "PolyInfo") {
            switch (data.typeName) {
                case "DrawRectObject":
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "GetPolygonInsideInfo", selstate: true });
                    if (topMenuBar.getMenu("selectzone").state % 2)
                        topMenuBar.getMenu("selectzone").state--;
                    break;
                case "GetPolygonInsideInfo":
                    //if (topMenuBar.getMenu("selectzone").state % 2 == 0)
                    //    return;
                    if (data.data.close) {
                        if (vMain.curfile == "sgc_zonestatistics") {
                            vMain.closeBusiness();
                        }
                        return;
                    }
                    var stations = [];
                    var lines = [];
                    if (data.data.station) {
                        Ysh.Array.each(data.data.station, function (s) {
                            stations.addSkipSame(s.id);
                        })
                    }
                    if (data.data.line)
                        Ysh.Array.each(data.data.line, function (l) { lines.addSkipSame(l.lineItemId); });
                    if (vMain.selectzone) {
                        vMain.selectzone.img = "/i/sgc/module/selectzone.png";
                        vMain.getApp("selectzone").state = 0;
                    }
                    vSelectZone.s = stations.join();
                    vSelectZone.l = lines.join();
                    vMain.zoneData = data.data;
                    if (vMain.isShowing("zonestatistics")) {
                        vMain.sendBusinessMsg("", { type: "zonechanged" });
                    } else {
                        vMain.clearOtherButtons({ type: 2 });
                        vMain.showPage("zonestatistics", "区域选择", "sgc_zonestatistics", {});
                    }
                    break;
                default:
                    break;
            }
            return;
        }
        if (data.eventType == "getStationLineInScene") {
            ProjectInterface.Jxt.draw(data.data.lstLineId, data.data.lstStationId);
            return;
        }
        if (data.eventType == "mapImg") {
            return;
            $.ajax({
                url: "/conn/ashx/AskHandler.ashx", type: "post", dataType: "json", async: true,
                data: { m: "dll", dll: "SGCLib:SGCLib.PushMsg.SaveMapPicture", args: "data", "data": data.data },
                error: function (data, status, err) {
                    alert("截图失败，请重试");
                },
                success: function (data) {
                    if (!data[0]) {
                        alert("截图失败，请重试");
                        return;
                    }
                    document.getElementById("adownload").href = "GetFile.aspx?name=temp.png&path=" + data[1];
                    document.getElementById("adownload").click();
                }
            });
        }
        if (data.eventType == "setDivPosition") {
            data = data.data;
            floatDataInst.setFloatPos(data.x, data.y, data.locateData);
            return;
        }
        if (data.eventType == "changePageFinish") {
            if (data.data.app)
                owg[data.data.app](true, true);
        }
    });
}
$("#btnRadio").show();
$(".top").find(".top-menu-container").each(function () {
    var ope = $(this).attr("ope");
});
MapOpeInst.onDblClick = function (type, data) {
    switch (type) {
        case "station":
            ShowJxtOr3DIframe("d5000jxt", "", data.id, data.plantstationtype);
            break;
        case "extline":
            cardUrlInst.display({ card: "meascard", args: { type: "SG_DEV_" + ProjectSGC.Meta.getTypeById(data.lineItemId) + "_B", id: data.lineItemId } });
            break;
    }
}
/*
    if (type == "fault") {
        if (document.getElementById("iframeBusiness"))
            document.getElementById("iframeBusiness").contentWindow.postMessage({ type: "locateItem", id: data.data.data.id }, "*");
        MessageInst.eventSource = [];
        ProjectSGC.Map.locate("", data.data.data.devid);
        return;
    }
    if ((type == "repair") || (type == "overload")) {
        if (document.getElementById("iframeBusiness"))
            document.getElementById("iframeBusiness").contentWindow.postMessage({ type: "locateItem", data: data.data.data }, "*");
        return;
    }
}*/
Ysh.Object.addGetHandle(bottomMenuInst, "getLinks", function (v, type, data, arrLink) {
    if (!type) return v;
    var btns = vMain.buttons;
    for (var i = 0; i < btns.length; i++) {
        var btn = btns[i];
        if (!btn.state)
            continue;
        if (btn.getLinks)
            if (btn.getLinks(type, data, arrLink) === false)
                v = false;
    }
    if (data.id || data.ID)
        console.log(data.id || data.ID);
    return v;
});
Ysh.Object.addHandle(topMenuInst, "hideAllContent", function () {
    $("#divFloatTips").hide();
});
Ysh.Object.addHandle(floatDataInst, "showData", function (type, data, left, top, wnd) {
    if (type == "fault") {
        var arrHTML = [];
        var item = data.data.data.item;
        arrHTML.push("<p style='padding:0px 24px;margin-bottom:0;height:48px;line-height:48px'><span style='color:#1887b5'>故障时间：</span>" + item[4] + "</p>");
        arrHTML.push("<p style='margin-bottom:0;border-top:1px solid #cccccc;padding:14px 24px'><span style='color:#1887b5'>故障详情：</span>" + item[6] + "</p>");
        arrHTML.push("<p style='margin-bottom:0;border-top:1px solid #cccccc;padding:14px 24px'><span style='color:#1887b5'>故障原因：</span>" + item[14] + "</p>");
        var $div = $("#divFloatData").css({ top: top, left: left, width: 400 }).find("div");
        $div.html(arrHTML.join("")).end().show();
        $("#divFloatData").css({ top: top - $div.height() - 20, left: left - 200 - 15 });
        return;
    }
    if (type == "overload") {
        var arrHTML = [];
        var dtype = data.data.data.dtype;
        var item = data.data.data.item;
        if (dtype == "trans") {
            arrHTML.push("<p style='padding:0px 24px;margin-bottom:0;height:48px;line-height:48px'><span style='color:#1887b5'>设备名称：</span>" + item.st_name + item.name + "</p>");
            arrHTML.push("<p style='margin-bottom:0;border-top:1px solid #cccccc;padding:14px 24px'><span style='color:#1887b5'>视在功率：</span>" + item.s.toFixed(2));
            arrHTML.push("&nbsp;&nbsp;<span style='color:#1887b5'>额定功率：</span>" + item.mva_rate);
            arrHTML.push("&nbsp;&nbsp;<span style='color:#1887b5'>负载率：</span>" + item.p_rate.toFixed(2) + "%</p>");
        } else {
            arrHTML.push("<p style='padding:0px 24px;margin-bottom:0;height:48px;line-height:48px'><span style='color:#1887b5'>设备名称：</span>" + item.name + "</p>");
            arrHTML.push("<p style='margin-bottom:0;border-top:1px solid #cccccc;padding:14px 24px'><span style='color:#1887b5'>当前电流：</span>" + item.i.toFixed(2));
            arrHTML.push("&nbsp;&nbsp;<span style='color:#1887b5'>额定电流：</span>" + item.imax);
            arrHTML.push("&nbsp;&nbsp;<span style='color:#1887b5'>负载率：</span>" + item.i_rate.toFixed(2) + "%</p>");
        }
        if (arrHTML.length == 0)
            return;
        var $div = $("#divFloatData").css({ top: top, left: left, width: 400 }).find("div");
        $div.html(arrHTML.join("")).end().show();
        $("#divFloatData").css({ top: top - $div.height() - 20, left: left - 200 - 15 });
        return;
    }
});
floatDataInst.showData = function (type, data, left, top, wnd) {
    switch (type) {
        case "extline":
            if (!stationFilter.isShowChaoLiu)
                return;
            var linetype = ProjectSGC.Meta.getTypeById(data.lineItemId);
            var meastypes = (linetype == "ACLINE") ? "00002001,00002002,00002202,00002401" : "00002005,00002207,00002405";
            SGCDebug.start("开始获取线路实时数据");
            PDP.dll('SGCLib:SGCLib.Service.GetLineRealData', [data.lineItemId, "getrealdatawide", meastypes], function (ret) {
                if (!ret.check('获取线路实时数据', true))
                    return;
                var json = ret.value[0];
                if (json.startsWith("err info:")) {
                    alert("调用实时数据接口出现错误");
                    return;
                }
                if (json == "") {
                    alert("未获取到线路线端信息");
                    return;
                }
                var lst = ProjectSGC.Service.getResult(json, "data");
                if (!lst) return;
                var arrHTML = [];
                function getValue(lst, idx, count) {
                    var v = lst[idx];
                    if (!SGCChaoliu.isInvalid(v))
                        return v.floatValue;
                    if (lst.length < count)
                        return "";
                    v = lst[idx + count];
                    return SGCChaoliu.isInvalid(item) ? "" : v.floatValue;
                }
                var msg = data.lineName;
                if (linetype == "ACLINE") {
                    //msg += "　P：" + getValue(lst, 0, 4) + "+jQ：" + getValue(lst, 1, 4);// + "，V：" + getValue(lst, 2, 4) + "，I：" + getValue(lst, 3, 4); 
                    msg += "： " + Ysh.Number.toFixed(getValue(lst, 0, 4), 1);
                    var q = getValue(lst, 1, 4);
                    if (q) {
                        q = parseFloat(q);
                        if (q < 0)
                            msg += " - j " + (-q).toFixed(1);
                        else
                            msg += " + j " + q.toFixed(1);
                    } else
                        msg += " + j " + q;
                } else {
                    //msg += "　P：" + getValue(lst, 0, 3) + "，V：" + getValue(lst, 1, 3);// + "，I：" + getValue(lst, 2, 3);
                    msg += "：" + Ysh.Number.toFixed(getValue(lst, 0, 3), 1);
                }
                arrHTML.push("<span style='position:relative;padding:5px 10px;'><img src='/i/sgc/typhoon/time1.png' style='position:absolute;z-index:-1;left:0;top:0;width:100%;height:30px;' />"
                    + msg + "</span>");
                var jqTips = $("#divFloatTips");
                var jqTipsCotnent = jqTips.find("div");
                jqTips.css({ height: 30, top: top, width: 800, left: left }).show();
                jqTipsCotnent.html(arrHTML.join("<br/>"));
                jqTips.css({ width: jqTipsCotnent.children().width() + 21 });
                SGCDebug.start("显示线路实时数据结束");
                SGCDebug.show();
            });
            return;
        case "section":
        case "sectionicon":
        case "sectionTrack":
            if (this.floatPage)
                vMain.destroyFloatPage(this.floatPage);
            MessageInst.eventSource = [];
            this.setFloatPos = function (x, y, data) {
                if (!this.floatPage) return;
                if (!this.floatPage.$children) return;
                var vm = this.floatPage.$children[0];
                if (!vm) return;
                vm.left = x;
                vm.top = y;
            }
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "setDivPosition", selstate: true, data: { longitude: data.longitude, latitude: data.latitude, locateData: { id: data.id } } });
            this.floatPage = vMain.floatPage("sgc_section_card", {
                id: data.id, left: left, top: top, section: data.row, main: {
                    closeFloat: function () {
                        if (floatDataInst.floatPage)
                            vMain.destroyFloatPage(floatDataInst.floatPage);
                    }
                }
            }, "1.20.1110.1");
            break;
        case "stationTipsTrack":
        case "lineChaoliuTrack":
            if (data.data && data.data.length > 0) {
                var item = data.data[0];
                ProjectSGC.Card.showMeasCard(item.dtype, item.id);
            }
            break;
        default:
            $("#divFloatTips").hide();
            if (this.floatPage)
                vMain.destroyFloatPage(this.floatPage);
            break;
    }
    var time = "";
    for (var i = 0; i < vMain.buttons.length; i++) {
        var btn = vMain.buttons[i];
        if (!btn.isWeatherApp)
            continue;
        if (!btn.state)
            continue;
        time = btn.time;
        break;
    }
    if (!time) return;
    time = new Date(time);
    var exes = [];
    if (time >= new Date()) { //预测
        exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetNearestGridPoint", args: [data.longitude, data.latitude] });
        exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetDataByGridPoint", args: [{ ref: 0, value: 0 }, time, time.getFullYear()] });
    } else {
        exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetNearestWeatherStation", args: [data.longitude, data.latitude] });
        exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetDataByWeatherStation", args: [{ ref: 0, value: 0 }, time] });
    }
    PDP.exec(exes, function (ret) {
        if (!ret.isOK) return;
        ret = ret.value[1];
        if (ret.length == 0) return;
        ret = ret[0];
        var temperature = ret[0];
        var rain = parseFloat(ret[1]);
        if (isNaN(rain)) rain = "";
        var winddir = ProjectSGC.Weather.getWindDirection(parseFloat(ret[2] || 0, 10));
        var windlevel = ProjectSGC.Weather.getWindLevel(parseFloat(ret[3] || 0, 10));
        var arrHTML = [];
        arrHTML.push("<span style='position:relative;padding:5px 10px;'><img src='/i/sgc/typhoon/time1.png' style='position:absolute;z-index:-1;left:0;top:0;width:100%;height:30px;' />"
            + temperature + "℃," + (rain ? ("降水" + rain + "mm,") : "") + winddir + windlevel + "级</span>");
        var jqTips = $("#divFloatTips");
        var jqTipsCotnent = jqTips.find("div");
        jqTips.css({ height: 30, top: top, width: 800, left: left }).show();
        jqTipsCotnent.html(arrHTML.join("<br/>"));
        jqTips.css({ width: jqTipsCotnent.children().width() + 21 });
    });
};//去掉点击显示tip功能

MapOpeInst.showMenuOpe4 = function (data) {
    //右键点击地图上线路
    switch (data.data.type) {
        case "extline":
            this.showLineMenu(data);
            break;
    }
    this.showWeatherMenu(data);
}
Ysh.Object.addHandle(MapOpeInst, "showMenuOpe3", function (data) {
    this.showWeatherMenu(data);
});
Ysh.Object.addHandle(MapOpeInst, "showMenuOpe5", function (data) {
    Ysh.Array.each(vMain.realbuttons, function (b) {
        if (b.state && b.receive)
            b.receive(data);
    });
    if (data && data.type == "daIcon") {
        if (data.data.data.itype == "gym") {
            MessageInst.eventSource = [];
            owgMain.showPath(data.data.data);
        }
    }
});

MapOpeInst.showLineMenu = function (data) {
    return;
    var arrHTML =[
        '<a href="javascript:void(0);" ope="gzdn" class="aSituation">故障档案</a>'
        , '<a href="javascript:void(0);" ope="gzcj" class="aSituation">故障测距</a>'
        ];
    MapOpeInst.addMenu(data, arrHTML, this.clickCommonMenu);
}
MapOpeInst.getLineName = function (lineid, linename) {
    if (linename)
        return linename;
    var name = PDP.read("SGC", "sgc/line:GetLineName", [lineid]);
    if (!name.check("获取线路名称", true))
        return "";
    return name.value;
}
MapOpeInst.jxdn = function (o, data) {
    vMain.showPage("linedlg", "检修档案 - " + this.getLineName(data.data.lineItemId, data.data.lineName), "sgc_line_jx", { lineid: data.data.lineItemId });
}
MapOpeInst.gzdn = function (o, data) {
    var id = data.data.lineItemId;
    vMain.showPage("faultdlg", "故障档案 - " + this.getLineName(data.data.lineItemId, data.data.lineName), ProjectSGC.Meta.getTypeById(id) == "ACLINE" ? "sgc_acline_fault" : "sgc_dcline_fault", { id: id });
}
MapOpeInst.gzcj = function (o, data) {
    vMain.showPage("linedlg", "故障测距 - " + this.getLineName(data.data.lineItemId, data.data.lineName), "sgc_line_distance", { lineid: data.data.lineItemId }, null, "260px", "150px");
}
MapOpeInst.showWeatherMenu = function (data) {
    var time = "";
    var needWind = false;
    for (var i = 0; i < vMain.buttons.length; i++) {
        var btn = vMain.buttons[i];
        if (!btn.isWeatherApp)
            continue;
        if (!btn.state)
            continue;
        time = btn.time;
        if (btn.id == "windmap") {
            needWind = true;
        }
    }
    if (!time) return;
    time = new Date(time);
    data.time = time;
    var arrHTML = [
        '<a href="javascript:void(0);" ope="weather_curve" class="aSituation">天气曲线</a>'
    ];
    ModelList.useAll(function () {
        for (var i = 0; i < data.pwGrid.length; i++) {
            var gridid = "0101" + data.pwGrid[i];
            var grid = ModelList.grids.dict[gridid];
            if (!grid) continue;
            var gridname = grid[1];
            arrHTML.push('<a href="javascript:void(0);" grid="' + gridid + '" ope="load_curve" class="aSituation">' + gridname + '负荷温度曲线</a>');
            if (needWind) {
                var level = grid[3];
                if ((level == 1002) || (level == 1003))
                    arrHTML.push('<a href="javascript:void(0);" grid="' + gridid + '" ope="wind_curve" class="aSituation">' + gridname + '风电曲线</a>');
            }
        }
        MapOpeInst.addMenu(data, arrHTML, MapOpeInst.clickCommonMenu);
    });
}
MapOpeInst.weather_curve = function (o, data) {
    var lon = data.data.longitude, lat = data.data.latitude;
    var exes = [];
    exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetNearestWeatherStation", args: [lon, lat] });
    exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetNearestGridPoint", args: [lon, lat] });
    PDP.exec(exes, function (ret) {
        if (!ret.check("获取气象点信息", true)) return;
        Ysh.Vue.Dialog.show("天气", "sgc_tq_curve", { name: lon + "," + lat, srcid: ret.value[0].toString(), gridid: ret.value[1].toString(), time: data.time }, "", "800px", "367px");
    });
}
MapOpeInst.load_curve = function (o, data) {
    //ProjectSGC.Card.showCard("pwrgridmeascard", o.getAttribute("grid"));
    var gridid = o.getAttribute("grid");
    var time = Ysh.Time.formatString(vMain.getShowTime(), "111000");
    var url = 'http://operating-data.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/ShowPwgridCurveFrameGis.jsp?chain&' + gridid + '@11032001@name#{"time":"' + time + '","endtime":"' + time + '"}';//"http://10.10.16.24:8080/osp/TestCurveScale/ShowPwgridCurveFrameGis.jsp?chain&" + gridid + "@11032001@name"
    var ret = { "message": "电网有功展示页面正常", "data": { "rankid": "990100010207001", "objectname": "电网", "title": { "icon": "", "text": "电网负荷曲线", "style": { "height": "28px", "color": "2A3F3E", "font-size": "14px", "background-color": "3A63B5", "font-family": "microsoft yahei", "font-weight": "bold" }, "button": "feedback,info,minBtn,maxBtn,icon,refresh,close", "infoUrl": "http://operating-data.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/pages/cardinfo.html?objId=01123700000040" }, "height": "630px", "appId": "990100010207", "objectCode": "0112", "objectId": "01123700000040", "width": "1200px", "servicename": "dcloud.display.card.PwrGridMeasCard", "objectid": "01123700000040", "url": url }, "code": 200 };
    renderCard(ret.data);
}
MapOpeInst.wind_curve = function (o, data) {
    var gridid = o.getAttribute("grid");
    var time = Ysh.Time.formatString(vMain.getShowTime(), "111000");
    var url = "http://10.10.16.54:8081/yc-energy-web/pwrgridLoadForecastCard.html?detailId=" + gridid + "&jurl=dcloud.display.card.LoadForecastCard&method=PwrgridLoadForecastCard&objId=" + gridid + "&startTime=" + time + "&measType=fd";
    var ret = { "message": "风电展示页面正常", "data": { "rankid": "990100010207001", "objectname": "风电", "title": { "icon": "", "text": "风电预测曲线", "style": { "height": "28px", "color": "2A3F3E", "font-size": "14px", "background-color": "3A63B5", "font-family": "microsoft yahei", "font-weight": "bold" }, "button": "feedback,info,minBtn,maxBtn,icon,refresh,close", "infoUrl": "http://operating-data.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/pages/cardinfo.html?objId=01123700000040" }, "height": "630px", "appId": "990100010207", "objectCode": "0112", "objectId": "01123700000040", "width": "1200px", "servicename": "dcloud.display.card.PwrGridMeasCard", "objectid": "01123700000040", "url": url }, "code": 200 };
    renderCard(ret.data);
}
MapOpeInst.selectzone = function (o, data) {
    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: "GetRectObject", selstate: 1, data: {} });
}

function showPanel(url, w, h) {
    divFrmPanel.style.width = (w || "100%");
    divFrmPanel.style.height = (h || "100%");
    divPanel.style.display = "";
    if (frmPanel.src)
        frmPanel.src = url;
    else
        frmPanel.location.href = url;
}
function closePanel() {
    divPanel.style.display = "none";
}
var w_p, h_p;
function restorePanel() {
    divPanel.style.width = w_p;
    divPanel.style.height = h_p;
    document.getElementById("frmPanel").style.display = "";
    imgClose.style.display = "";
    imgBack.style.display = "none";
}
function minPanel() {
    w_p = divPanel.style.width;
    h_p = divPanel.style.height;
    document.getElementById("frmPanel").style.display = "none";
    imgClose.style.display = "none";
    imgBack.style.display = "";
    divPanel.style.width = "50px";
    divPanel.style.height = "50px";
}

var AppHelper = {
    readValidTimes: function (options, now, min, end, callback) {
        PDP.read("SGC", options.timesSQL, [now, now.getFullYear(), min, end], function (ret) {
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
    weather: function (app, options) {
        app.isWeatherApp = true;
        app.canPlay = false;
        app.display = function (time, force) {
            if (!force) {
                if (time == this.time) return;
            }
            this.time = time;
            options.display(time);
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
                start = AppHelper.resetBaseTime(start, options.timeType, options.step || 1);
                /*
                var min = Ysh.Time.add('d', -10, now); //看看最近10天有没有数据
                PDP.read("SGC", options.timesSQL, [now, now.getFullYear(), min, end], function (ret) {
                    if (!ret.check("获取" + name + "信息失败", true))
                        return;
                    ret = ret.value;
                    var times = [];
                    for (var i = 0; i < ret.length; i++) {
                        times.push(ret[i][0]);
                    }
                    times.sort();
                    //app.display(now);
                    vMain.setLegend(legend, true);
                    var player = {
                        id: id,
                        changeTime: function (time) { app.display(time); },
                        changeStartTime: function (time) {
                            Ysh.Delay.exec(id + "_times", 100, function () {
                            console.log(time);
                            });
                        }
                    };
                    vMain.players.push(player);
                    vMain.boardcast.caption.push(name);
                    vMain.sectiontype = options.timeType;
                    vMain.sectiontime = AppHelper.getRecentTime(times, now);
                    vMain.minSectionTime = Ysh.Time.toString(start);
                    vMain.maxSectionTime = Ysh.Time.toString(end);//lastTime;
                    vMain.isPlayerEnable = function (time) {
                        return times.indexOf(Ysh.Time.toString(time)) >= 0;
                    }
                    vMain.playerSpeed = 5;
                    vMain.showPlayer = true;
                    player.changeTime(vMain.sectiontime);
                });
                */
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
                    vMain.playerSpeed = options.speed || 2;
                    vMain.playerStep = options.step || 1;
                    vMain.showPlayer = true;
                    player.times = times;
                    //vMain.isPlayerEnable = function (time) {
                    //    return times.indexOf(Ysh.Time.toString(time)) >= 0;
                    //}

                    vMain.boardcast.assist = Ysh.Time.formatString(vMain.sectiontime, vMain.timeFormat);
                    player.changeTime(vMain.sectiontime);
                });
            } else {
                this.gridid = "";
                vMain.boardcast.caption.erase(name);
                vMain.closePlayer(id);
                vMain.caption = "";
                vMain.assist = "";
                //vMain.isPlayerEnable = null;
                this.display(null);
                vMain.setLegend(legend, false);
            }
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
        return app;
    }
}

var vMain = new Vue({
    el: "#divMainContent",
    data: {
        loading: true,
        leftWidth: 0.5,
        leftWidth0: 0.5,
        topHeight: 0.5,
        topLeftWidth: 0.5,
        modelid: "",
        curfile: "",
        args: {},
        splitting: false,
        visible: false, input: '', answers: [],
        noBaseBottomMenu: false,
        onlyHideBusiness: false,
        showPlayer: false,
        hidePlayer: false,
        hideTimeline: false,
        hidePlayPage: false,
        playPage: "",
        boardcast: { caption: [], assist: "", content: "" },
        playerStep: 1,
        playerSpeed: 2,
        sectiontype: 'y',
        sectiontime: Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "y")),
        minSectionTime: Ysh.Time.toString(Ysh.Time.add('y', -10, Ysh.Time.getTimeStart(new Date(), "y"))),
        maxSectionTime: "",
        now: new Date(),
        isPlayerEnable: null,
        loopPlay: false,
        inited: false,
        mapUrl: "about:blank",
        floatPages: [],
        floatUrl: "",
        floatCss: {},
        showSearch: false,
        leftWidth: 1,
        leftWidth0: parseFloat(Ysh.Cookie.get("map_size") || 0.65),
        modelid: "",
        curfile: "",
        min: "400px",
        max: "400px",
        caption: "",
        assist: "",
        models: [
            ["guanzhu", "关注", "sgc_gz"]
            , ["tuijian", "推荐", "sgc_tj"]
            , ["tianqi", "天气", "sgc_tq"]
            , ["czp", "操作票", "sgc_czp"]
            , ["jxp", "检修申请票", "sgc_jxp"]
            , ["baobiao", "报表", "sgc_bb"]
            , ["3k", "三跨点", "sgc_3k_xl"]
            , ["overload", "主变越限", "sgc_overload", { type: "trans" }]
            , ["overload_line", "线路越限", "sgc_overload", { type: "line" }]
            , ["heavyload", "主变重载", "sgc_overload_heavy", { type: "trans" }]
            , ["heavyload_line", "线路重载", "sgc_overload_heavy", { type: "line" }]
            , ["fault", "故障", "sgc_fault"]
            , ["statistics", "统计列表", "sgc_statistics"]
            , ["typhoon", "台风", "sgc_typhoon_list"]
            , ["cross", "跨区供电", "sgc_cross_region"]
            , ["line", "线路杆塔", "sgc_line_gt"]
            , ["fire", "山火", "sgc_tq_fire"]
            , ["thunder", "雷电", "sgc_tq_light_list"]
            , ["icing", "覆冰", "sgc_tq_fb"]
            , ["mjtd", "密集通道", "sgc_transchannel"]
            , ["topo", "拓扑着色", "sgc_topo"]
            , ["section", "电网断面", "sgc_section"]
            , ["realsection", "断面路况", "sgc_section_real"]
            , ["hissection", "断面历史", "sgc_section_his"]
            , ["unknown", "未知", ""]
            , ["part", "分区平衡", "sgc_part"]
            , ["connectionline", "联络线", "sgc_connectionline"]
            , ["push", "推送", "push/index.html"]
            , ["errortowers", "杆塔勘误表", "sgc_line_gtlist"]
            , ["zonestatistics", "区域选择", "sgc_zonestatistics"]
            , ["env", "综合环境告警", "sgc_env_stat_line"]
            , ["project", "重点工程", "sgc_project_all"]
        ],
        splitting: false,
        visible: false, input: '', answers: [],
        msgs: [false],
        buttonStates: {},
        Config: ProjectSGC.Config,
        buttons: [//type:0,1 - 图,2 - 页,3 - 其他
            {
                id: "cross", state: 0, type: 2, needClear: true, name: "跨区供电", click: function () {
                    vMain.changePage(this.id, "跨区供电", "sgc_cross_region");
                }
            },//cross
            {
                id: "overload", state: 0, type: 2, needClear: true, name: "越限", click: function () {
                    vMain.changePage(this.id, "主变越限", "sgc_overload");
                }
            },//overload
            {
                id: "heavyload", state: 0, type: 2, needClear: true, name: "重载", click: function () {
                    vMain.changePage("heavyload", "主变重载", "sgc_overload_heavy");
                }
            },//heavyload
            {
                id: "fault", state: 0, type: 2, needClear: true, name: "故障列表", click: function () {
                    vMain.changePage('fault', '故障', 'sgc_fault', {});
                    var legend = "/i/sgc/legend/tingdian.png?v=1.21.409.1";
                    if (this.state != 0) {
                        vMain.setLegend(legend, true);
                    } else {
                        vMain.setLegend(legend, false);
                    }
                }, getImage: function () { return "/i/sgc/warn.png"; }
            },//fault
            {
                id: "statistics", state: 0, type: 2, needClear: true, name: "统计列表", click: function () {
                    vMain.changePage(this.id, this.name, 'sgc_statistics', {});
                }
            },//statistics
            {
                id: "weather2", state: 0, type: 0, needClear: false, name: "天气", click: function () {
                    if (this.state != 0) {
                        var exes = [
                            { type: 'read', db: 'SGC', sql: "sgc/tq:GetRecentWeatherTime", args: [new Date()] }
                            , { type: 'read', db: 'SGC', sql: "sgc/tq:GetRecentWeatherInfo", args: [{ ref: 0, value: 0 }] }
                        ];
                        PDP.exec(exes, function (ret) {
                            if (!ret.check("获取天气信息失败", true))
                                return;
                            //vMain.caption = "天气";
                            //vMain.assist = ret.value[0][0][0];
                            ret = ret.value[1];
                            var option = {
                                type: "file",
                                file: "sgc_weather_info"
                            };
                            ProjectSGC.Map.Icon.showMultiple("weather", ret, option);
                        });
                    } else {
                        vMain.caption = "";
                        vMain.assist = "";
                        ProjectSGC.Map.Icon.hide("weather");
                    }
                }, getImage: function () { return this.state != 0 ? "/i/sgc/weather.png" : "/i/sgc/weather_dis.png"; }
            },//weather2
            AppHelper.weather({ id: "weather", state: 0, type: 0, needClear: false, name: "天气", legend: "/i/sgc/legend/weather.png?v=1.21.409.1" }, {
                timesSQL: "sgc/tq:GetWeatherTimes", timeType: "hh",
                display: function (time) {
                    if (!time) {
                        MapOpeInst.menu("setWeatherHide", false, { warnType: "weather" });
                        return;
                    }
                    var now = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'h'));
                    MapOpeInst.menu("setWeatherHide", true, { time: time, warnType: "weather", timeFlag: (time <= now) ? "history" : "forecast" });
                }
            }),//weather
            AppHelper.weather({ id: "cloud", state: 0, type: 0, needClear: false, name: "卫星云图", legend: "" }, {
                timesSQL: "sgc/tq:GetCloudTimes", timeType: "mi", speed: 1, step: 15,
                display: function (time) {
                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: !!time, data: { type: "cloud", time: time } });
                    return;
                    if (!time) {
                        MapOpeInst.menu("setWeatherHide", false, { warnType: "cloud" });
                        return;
                    }
                    var now = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'h'));
                    console.log(time);
                    MapOpeInst.menu("setWeatherHide", true, { time: time, warnType: "cloud", timeFlag: (time <= now) ? "history" : "forecast" });
                }
            }),//cloud
            AppHelper.weather({ id: "windmap", state: 0, type: 0, needClear: false, name: "风", legend: "/i/sgc/legend/wind.png?v=1.21.118.1" }, {
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
            }),//windmap
            {
                id: "typhoon", state: 0, type: 3, needClear: true, name: "台风", click: function () {
                    vMain.changePage("typhoon", "台风", "sgc_typhoon_list", this.args);
                }, getImage: function () { return this.state != 0 ? "/i/sgc/typhoon.png" : "/i/sgc/typhoon.png"; },
                go: function (arg) {
                    this.args = { id: arg };
                    this.click();
                    this.args = {};
                }
            },//typhoon
            {
                id: "mygrid", state: 0, type: 0, needClear: false, name: "我的区内电网",
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
            },//grid
            {
                id: "qyz", state: 0, type: 0, needClear: false, name: "牵引站",
                click: function () {
                    //this.state = 0;
                    if (this.state != 0)
                        showingMenu.selectStationTheme(Ysh.Array.first(showingMenu.stationTypes, function (item) { return item.value == 2003; }));
                    else
                        showingMenu.restoreMainTheme();
                    return true;
                }, getImage: function () {
                    return "/i/sgc/mygrid.png";
                }
            },//qyz
            AppHelper.weather({ id: "temperature", state: 0, type: 1, needClear: false, name: "温度", legend: "/i/sgc/legend/temperature.png?v=210709" }, {
                timesSQL: "sgc/tq:GetTemperatureTimes", timeType: "hh",
                display: function (time) {
                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: !!time, data: { type: "temperature", time: time } });
                    vMain.showForecast = !!time;
                    if (time) {
                        vMain.forecast1 = [{ value: 0, text: '历史', type: "temperature" }, { value: 11, text: '预测', type: "temperature" }]
                        vMain.forecast1v = 0;
                    } else {
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: false, data: { type: "forecast" } });
                        if (vMain.lastForeLegend)
                            vMain.setLegend(vMain.lastForeLegend, false);
                        vMain.lastForeLegend = "";
                    }
                }
            }),//temperature
            AppHelper.weather({ id: "rain", state: 0, type: 1, needClear: false, name: "降水", legend: "/i/sgc/legend/rain.png?v=1.21.118.1" }, {
                timesSQL: "sgc/tq:GetRainTimes", timeType: "hh",
                display: function (time) {
                    MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: !!time, data: { type: "rain", time: time } });
                    vMain.showForecast = !!time;
                    if (time) {
                        vMain.forecast1 = [{ value: 0, text: '历史', type: "rain" }, { value: 12, text: '预测', type: "rain" }]
                        vMain.forecast1v = 0;
                    } else {
                        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: false, data: { type: "forecast" } });
                        if (vMain.lastForeLegend)
                            vMain.setLegend(vMain.lastForeLegend, false);
                        vMain.lastForeLegend = "";
                    }
                }
            }),//rain
            {
                id: "wind", state: 0, type: 1, needClear: false, name: "大风", click: function () {
                    stationFilter.clickDisplayMenu(stationFilter.displayStates[1]);
                    stationFilter.isShowWeatherTime = false;
                }, getImage: function () { return this.state != 0 ? "/i/sgc/weather.png" : "/i/sgc/weather_dis.png"; }
            },//wind
            {
                id: "tuijian", state: 0, type: 2, needClear: true, name: "热点", click: function () {
                    vMain.changePage("tuijian", "热点", "sgc_tj");
                }, getImage: function () { return this.state != 0 ? "/i/sgc/typhoon.png" : "/i/sgc/typhoon.png"; }
            },//tuijian
            {
                id: "jxp", state: 0, type: 2, needClear: true, name: "检修", click: function () {
                    var legend = "/i/sgc/legend/tingdian.png?v=1.21.409.1";
                    vMain.changePage("jxp", "检修", "sgc_jxp");
                    if (this.state != 0) {
                        vMain.setLegend(legend, true);
                        //vMain.hideBusiness();
                    } else {
                        vMain.setLegend(legend, false);
                    }
                }, getImage: function () { return this.state != 0 ? "/i/sgc/jx.png" : "/i/sgc/jx.png"; }
            },//jxp
            {
                id: "icing", state: 0, type: 2, needClear: true, canPlay: true, speed: 5, name: "覆冰", click: function () {
                    vMain.changePage("icing", "覆冰", "sgc_tq_fb");
                }, getImage: function () { return this.state != 0 ? "/i/sgc/weather.png" : "/i/sgc/weather_dis.png"; }
            },//icing
            {
                id: "fire", state: 0, type: 3, needClear: true, name: "山火", click: function () {
                    //vMain.changePage("fire", "山火", "sgc_tq_fire");
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
                }, getImage: function () { return this.state != 0 ? "/i/sgc/weather.png" : "/i/sgc/weather_dis.png"; }
            },//fire
            {
                id: "thunder1", state: 0, type: 3, needClear: true, name: "雷电", click: function () {
                    //vMain.changePage("unknown", "雷电", "sgc_tq_thunder");
                    var legend = "none";
                    if (this.state) {
                        var ver = "1.21.620.1";
                        this.bar = vMain.floatPage("sgc_tq_light_region", {}, ver);
                        this.stat = vMain.floatPage("sgc_tq_light_stat", { bar: this.bar }, ver);
                        vMain.setLegend(legend, true);
                    } else {
                        vMain.destroyFloatPage(this.stat);
                        vMain.destroyFloatPage(this.bar);
                        vMain.setLegend(legend, false);
                    }
                }, getImage: function () { return this.state != 0 ? "/i/sgc/weather.png" : "/i/sgc/weather_dis.png"; }
            },//thunder1
            {
                id: "thunder", state: 0, type: 3, needClear: true, name: "雷电", click: function () {
                    vMain.changePage("thunder", "雷电", "sgc_tq_light_list", this.args);
                }, getImage: function () { return this.state != 0 ? "/i/sgc/weather.png" : "/i/sgc/weather_dis.png"; },
                go: function (arg) {
                    var args = JSON.parse(arg);
                    this.args = { lineid: args.lineid, time: args.time };
                    this.click();
                    this.args = {};
                }
            },//thunder
            {
                id: "mylicense", state: 0, type: 1, needClear: false, name: "我的调度许可", click: function () {
                    vMain.showByGrid("licenseOrgID", this.state);
                }, getImage: function () {
                    return "/i/sgc/mygrid.png";
                }
            },//mylicense
            {
                id: "mydispatch", state: 0, type: 1, needClear: false, name: "我的调度管辖", click: function () {
                    vMain.showByGrid("dispatchOrgID", this.state);
                }, getImage: function () {
                    return "/i/sgc/mygrid.png";
                }
            },//mydispatch
            {
                id: "topo", state: 0, type: 2, needClear: true, name: "拓扑着色", click: function () {
                    vMain.changePage("topo", "拓扑着色", "sgc_topo");
                    //if (this.state != 0)
                    //    vMain.hideBusiness();
                }, getImage: function () { return this.state != 0 ? "/i/sgc/overload.png" : "/i/sgc/overload.png"; }
            },//topo
            {
                id: "topo2", state: 0, type: 0, needClear: false, name: "拓扑着色", click: function () {
                    if (this.state == 0) {
                        MapOpeInst.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: false, data: { type: "state充电" } });
                        MapOpeInst.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: false, data: { type: "state停电" } });
                        return;
                    }
                    this.show();
                }, getImage: function () {
                    return "/i/sgc/mygrid.png";
                },
                show: function () {
                    var btn = this;
                    PDP.dll('SGCLib:SGCLib.Service.Get', ["commongetdata", "?requesttype=10&ids=" + "0101" + SelectCityInst.locateid.substr(4)], function (ret) {
                        if (!ret.isOK) return;
                        var list = ret.value[0];
                        var data = "";
                        eval("data=" + list);
                        var lst = data.data.nma_line_state.line_state_list;
                        if (!lst) {
                            alert("未获取到数据！");
                            return;
                        }
                        var o = {};
                        Ysh.Array.each(lst, function (row, idx) {
                            var state = row.state_name;
                            if (!o[state])
                                o[state] = [];
                            o[state].push(row.line_id);
                        });
                        function getStateUrl(state) {
                            if (state == "充电")
                                return "/i/sgc/icon/state/chongdian.png";
                            if (state == "停电")
                                return "/i/sgc/icon/state/tingdian.png";
                            return "";
                        };
                        for (var state in o) {
                            var lines = o[state];
                            var url = getStateUrl(state);
                            if (btn.state && url)
                                MapOpeInst.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: "state" + state, url: url, stationIDs: [], lineIDs: lines } });
                        }
                        //MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'refreshYunTu', selstate: 1 });
                    });
                },
                receive: function (msg) {
                    if (!msg) return;
                    if (msg.type != "mapchanged") return;
                    this.show();
                }
            },//topo2
            {
                id: "busvol", state: 0, type: 1, needClear: true, name: "母线电压", click: function () {
                    //alert("正在建设中，敬请期待...");
                    //return;
                    this.gridid = ProjectSGC.Global.getGrid();
                    this.show();
                }, getImage: function () { return "/i/sgc/module/dianya.png"; },
                show: function () {
                    vMain.showBusVoltage(this.state, this.gridid);
                },
                receive: function (msg) {
                    if (!msg) return;
                    if (msg.type != "mapchanged") return;
                    var gridid = ProjectSGC.Global.getGrid();
                    if (this.gridid == gridid)
                        return;
                    this.gridid = gridid;
                    this.show();
                }
            },//busvol
            {
                id: "mjtd", state: 0, type: 2, needClear: true, name: "密集通道", click: function () {
                    vMain.changePage("mjtd", "密集通道", "sgc_transchannel");
                }, getImage: function () { return "/i/sgc/warn.png"; }
            },//mjtd
            {
                id: "selectzone", state: 0, type: 0, needClear: false, name: "区域选择", click: function (module) {
                    vMain.selectzone = module;
                    module.img = (this.state ? "/i/sgc/module/zoneselecting.png" : "/i/sgc/module/selectzone.png");
                    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: "DrawRectObject", selstate: this.state, data: {} });
                }, getImage: function () { return "/i/sgc/warn.png"; }
            },//selectzone
            {
                id: "connectionline", state: 0, type: 2, needClear: true, name: "联络线", click: function () {
                    vMain.changePage(this.id, "联络线", "sgc_connectionline");
                }, getImage: function () { return "/i/sgc/warn.png"; }
            },//connectionline
            {
                id: "3k", state: 0, type: 2, needClear: true, name: "三跨点", click: function () {
                    vMain.changePage("3k", "三跨点", "sgc_3k_xl");
                }, getImage: function () { return this.state != 0 ? "/i/sgc/fx.png" : "/i/sgc/fx.png"; }
            },//3k
            {
                id: "pushmsg", state: 0, type: 2, needClear: true, name: "推送", click: function () {
                    vMain.changePage("push", "推送", "push/index.html");
                }, getImage: function () { return "/i/sgc/warn.png"; }
            },//pushmsg
            {
                id: "section", state: 0, type: 2, needClear: true, name: "电网断面", click: function () {
                    vMain.changePage("section", "电网断面", "sgc_section");
                }, getImage: function () { return "/i/sgc/warn.png"; }
            },//section
            {
                id: "hissection", state: 0, type: 2, needClear: true, name: "历史断面", click: function () {
                    vMain.changePage("hissection", "历史断面", "sgc_section_his");
                }, getImage: function () { return "/i/sgc/warn.png"; }
            },//hissection
            {
                id: "fdgk", state: 0, type: 2, needClear: true, name: "电源概况", click: function () {
                    if (this.state) {
                        showingMenu.doPlantYanshi();
                    } else {
                        showingMenu.exitYanshi();
                    }
                }, getImage: function () { return "/i/sgc/warn.png"; },
                go: function (args) {
                    showingMenu.doPlantYanshi(args);
                }
            },//fdgk
            {
                id: "bdgk", state: 0, type: 2, needClear: true, name: "变电概况", click: function () {
                    if (this.state) {
                        showingMenu.doStationYanshi();
                    } else {
                        showingMenu.exitYanshi();
                    }
                }, getImage: function () { return "/i/sgc/warn.png"; },
                go: function (args) {
                    showingMenu.doStationYanshi(args);
                }
            },//bdgk
            {
                id: "errortowers", state: 0, type: 2, needClear: true, name: "杆塔勘误表", click: function () {
                    vMain.changePage(this.id, "杆塔勘误表", "sgc_line_gtlist");
                }, getImage: function () { return this.state != 0 ? "/i/sgc/typhoon.png" : "/i/sgc/typhoon.png"; }
            },//errortowers
            {
                id: "env", state: 0, type: 2, needClear: true, name: "综合告警", click: function () {
                    /*var legend = "none";
                    if (this.state) {
                        var ver = new Date().getTime(); //"1.20.702.1";
                        this.brief = vMain.floatPage("sgc_env_brief", {}, ver);
                        vMain.setLegend(legend, true);
                    } else {
                        vMain.destroyFloatPage(this.brief);
                        vMain.setLegend(legend, false);
                    }*/
                    vMain.changePage("env", "综合环境告警", "sgc_env_stat_line");
                }, getImage: function () { return this.state != 0 ? "/i/sgc/weather.png" : "/i/sgc/weather_dis.png"; }
            },//env
            {
                id: "uhvdcmap", state: 0, type: 3, needClear: false, name: "特高压直流", click: function () {
                    var type = this.id;
                    if (!this.state) {
                        //ProjectSGC.Map.highLight([], []);
                        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: false, data: { type: type, stationIDs: [], lineIDs: this.lines } });
                        return;
                    }
                    var _this = this;
                    var m = ModelList;
                    ProjectSGC.require("voltage");
                    var vv = ProjectSGC.Voltage;
                    var url = "/i/sgc/icon/state/dcline.png?v=20.902.1";
                    m.require(["line"], function () {
                        var lines = [];
                        _this.lines = lines;
                        var stations = [];
                        for (var i = 0; i < m.lineList.length; i++) {
                            var l = m.lineList[i];
                            var v = vv[l[ProjectSGC.LINE.VOLTAGE]];
                            if (!v)
                                continue;
                            if (!v.isDc)
                                continue;
                            if (v.value >= 800) {
                                lines.push(l[ProjectSGC.LINE.ID]);
                                stations.addSkipSame(l[ProjectSGC.LINE.START_ST]);
                                stations.addSkipSame(l[ProjectSGC.LINE.END_ST]);
                            }
                        }
                        //ProjectSGC.Map.highLight(lines, [], "", true);
                        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: type, url: url, stationIDs: [], lineIDs: lines } });
                        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: type, url: "/i/sgc/icon/state/conversion.png", stationIDs: stations, lineIDs: [] } });
                    });
                }
            },
            {
                id: "uhvacmap", state: 0, type: 3, needClear: false, name: "特高压交流", click: function () {
                    var type = this.id;
                    if (!this.state) {
                        //ProjectSGC.Map.highLight([], []);
                        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: false, data: { type: type, stationIDs: this.stations, lineIDs: this.lines } });
                        return;
                    }
                    var m = ModelList;
                    ProjectSGC.require("voltage");
                    var vv = ProjectSGC.Voltage;
                    var url = "/i/sgc/icon/state/" + stationFilter.bsaclinepng + ".png";
                    var _this = this;
                    m.useAll(function () {
                        m.require(["line"], function () {
                            var lines = [];
                            _this.lines = lines;
                            var stations = {};
                            //_this.stations = stations;
                            for (var i = 0; i < m.lineList.length; i++) {
                                var l = m.lineList[i];
                                var v = vv[l[ProjectSGC.LINE.VOLTAGE]];
                                if (!v)
                                    continue;
                                if (v.isDc)
                                    continue;
                                if (v.value < 1000)
                                    continue;
                                lines.push(l[ProjectSGC.LINE.ID]);
                                var arrStation = [m.getStation(l[ProjectSGC.LINE.START_ST]), m.getStation(l[ProjectSGC.LINE.END_ST])];
                                for (var s = 0; s < arrStation.length; s++) {
                                    var ss = arrStation[s];
                                    if (!ss) continue;
                                    var vss = vv[ss.code];
                                    if (!vss) continue;
                                    if (vss.isDc) continue;
                                    if (vss.value < 1000)
                                        continue;
                                    var type = ss.PlantStationType;
                                    if (!stations[type])
                                        stations[type] = [ss.ID];
                                    else
                                        stations[type].push(ss.ID);
                                }
                            }
                            //ProjectSGC.Map.highLight(lines, [], "", true);
                            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: type, url: url, stationIDs: [], lineIDs: lines } });
                            for (var type in stations)
                                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: type, url: "/i/sgc/icon/state/" + stationFilter.bsaclinepng.replace("line", type) + ".png", stationIDs: stations[type], lineIDs: [] } });
                        });
                    });
                }
            },
            {
                id: "connlinemap", state: 0, type: 3, needClear: false, name: "联络线", click: function () {
                    var type = this.id;
                    if (!this.state) {
                        //ProjectSGC.Map.highLight([], []);
                        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: false, data: { type: type, stationIDs: this.stations, lineIDs: this.lines } });
                        return;
                    }
                    var _this = this;
                    PDP.read("SGC", "sgc/connectionline:GetAllList", [SelectCityInst.getLocateGrid()], function (ret) {
                        if (!ret.isOK) return;
                        var url = "/i/sgc/icon/state/connline.png";
                        var data = ret.value;
                        var lines = [];
                        var stations = [];
                        var hvdcsys = [];
                        _this.stations = stations;
                        _this.lines = lines;
                        Ysh.Array.each(data, function (row) {
                            var l = row[5];
                            if (ProjectSGC.Meta.getTypeById(l) == "HVDCSYS")
                                hvdcsys.push(l);
                            else
                                lines.push(l);
                        });
                        if (hvdcsys.length == 0) {
                            //ProjectSGC.Map.highLight(lines, stations, "", true);
                            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: type, url: url, stationIDs: stations, lineIDs: lines } });
                            return;
                        }
                        var db = SGCDB;
                        if (!db) {
                            //ProjectSGC.Map.highLight(lines, stations, "", true);
                            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: type, url: url, stationIDs: stations, lineIDs: lines } });
                            return;
                        }
                        db.read("HVDCSYS_MEMBERS", function (data) {
                            for (var i = 0; i < data.length; i++) {
                                var o = data[i];
                                if (hvdcsys.indexOf(o[1]) < 0)
                                    continue;
                                o = o[0];
                                if (ProjectSGC.Meta.getTypeById(o) == "DCLINE")
                                    lines.push(o);
                                else
                                    stations.push(o);
                            }
                            //ProjectSGC.Map.highLight(lines, stations, "", true);
                            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: type, url: url, stationIDs: [], lineIDs: lines } });
                            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: type, url: "/i/sgc/icon/state/conversion.png", stationIDs: stations, lineIDs: [] } });
                        });
                    });
                }
            },
            {
                id: "lockVoltage", state: 0, type: 0, name: "设置电压等级", click: function () {
                    var menu = topMenuBar.getMenu("lock");
                    menu.changeState(this.state);
                }, go: function (arg) {
                    arg = parseInt(arg, 10);
                    if (isNaN(arg)) return;
                    var voltages = menuData.voltages;
                    for (var i = 0; i < voltages.length; i++) {
                        var v = voltages[i];
                        if (arg > 0) {
                            if (v.value == arg)
                                v.selected = true;
                        } else {
                            if (v.value == -arg)
                                v.selected = false;
                        }
                        //v.selected = (v.value == arg);
                    }
                    topMenuBar.lock(true);
                }
            },
            {
                id: "locateGrid", state: 0, type: 0, name: "定位电网", click: function () {
                }, go: function (arg) {
                    if (arg == "国家电网") {
                        SelectCityInst.locate("0101990100", true);
                        return;
                    }
                    var city = SelectCityInst.findCityByName(SelectCityInst.data, arg);
                    if (null != city)
                        SelectCityInst.locate(city.ID, true);
                }
            },
            {
                id: "mapZoom", state: 0, type: 0, name: "地图缩放", click: function () {
                }, go: function (arg) {
                    switch (arg) {
                        case "+":
                            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "MapZoomInOut", selstate: true, data: { type: 1 } });
                            break;
                        case "-":
                            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "MapZoomInOut", selstate: true, data: { type: 0 } });
                            break;
                        default:
                            if (arg)
                                ProjectSGC.Map.postMessage({ eventType: "fly", type: 1, data: { voltage: arg.toString().replace("kV", "") } });
                            break;
                    }
                }
            },
            {
                id: "peihetingdian", state: 0, type: 0, name: "配合停电", click: function () {
                }, go: function (arg) {
                    if (bottomMenuInst.linePage)
                        vMain.destroyFloatPage(bottomMenuInst.linePage);
                    var arrArg = arg.split('_');
                    var id = arrArg[0];
                    if (!id) {
                        showingMenu.setStateNameSelected(["在运"]);
                        return;
                    }
                    var type = (arrArg.length > 1) ? arrArg[1] : "line";
                    var args = {
                        main: {
                            closeFloat: function () {
                                vMain.destroyFloatPage(bottomMenuInst.linePage);
                                bottomMenuInst.linePage = null;
                            },
                            minFloat: function (min) {
                                bottomMenuInst.linePage.minimize = min;
                            }
                        }, closename: "关闭"
                    };
                    args[type + "id"] = id;
                    bottomMenuInst.linePage = vMain.floatPage(type == "line" ? "sgc_line_peihetingdian" : "sgc_project_peihe", args, "", true, function (c) { c.min = { width: 571, height: 415 } });
                    function _tempSetState() {
                        if (showingMenu.state && showingMenu.state.list && showingMenu.state.list.length > 0) {
                            showingMenu.setStateNameSelected(["在运", "规划"]);
                            delete _tempSetState;
                            return;
                        }
                        window.setTimeout(_tempSetState, 1000);
                    }
                    _tempSetState();
                }
            },
            {
                id: "project", state: 0, type: 0, name: "重点工程", click: function () {
                    vMain.changePage("project", "重点工程", "sgc_project_all", this.args || "");
                }, go: function (args) {
                    this.args = { projectid: args || "" };
                    this.click();
                    this.args = {};
                }
            },
            {
                id: "test", state: 0, type: 0, name: "测试", value: 0, args: ["+", "-", 500, 220], click: function () {
                    var args = {};
                    args.main = this;
                    args.configs = YshManager.configs.groups;
                    vMain.floatPage("pdp_config", args);

                }, getLinks: function (type, data, arrLink) {
                }
            },
            {
                id: "forecast", state: 0, type: 0, name: "预报", click: function () {
                    vMain.showForecast = this.state;
                }
            }, {
                id: "locate", state: 0, type: 1, needClear: false, name: "定位", click: function () {
                }, go: function (arg) {
                    if (!arg) return;
                    ProjectHuabei.locate(arg);
                    var imgs = ["fire", "light"];
                    for (var i = 0; i < imgs.length; i++)
                        ProjectHuabei.showImages(imgs[i], Ysh.Request.get(imgs[i]));
                }
            }
        ],
        realbuttons_all: [
            {
                isHide: true, id: "chaoliu", state: 0, name: "潮流", stypes: [], ltypes: [], img: "/i/sgc/module/chaoliu210122_1.png", legend: "/i/sgc/legend/tingdian.png?v=1.21.409.1",
                hide: function () {
                    SGCChaoliu.showPlantPower = false; SGCChaoliu.showStationVol = false;
                    stationFilter.setDisplayMenuState("chaoliu_stationvol", "0");
                    stationFilter.setDisplayMenuState("chaoliu_plantpower", "0");
                    stationFilter.setChaoliuState(false);
                },
                show: function (args) { if (!args) stationFilter.setChaoliuState(true); }
            },
            {
                isHide: true, id: "topo", state: 0, name: "拓扑着色", page: "sgc_topo", stypes: [], ltypes: [], img: "/i/sgc/module/realtopo200724.png", legend: "/i/sgc/legend/tingdian.png?v=1.21.409.1",
                dealLineData: function (lst) {
                    var m = ProjectSGC.Global.getMainObject("ModelList");
                    var vols = ProjectSGC.Voltage;
                    for (var i = 0; i < lst.length; i++) {
                        var row = lst[i];
                        row.line_id = row.obj_id;
                        row.line_name = row.obj_name;
                        var line = m.getLine(row.line_id);
                        if (!line) continue;
                        row.grid_id = line[ProjectSGC.LINE.GRID];
                        var grid = m.getGrid(row.grid_id);
                        if (grid)
                            row.grid_name = grid[1];
                        row.voltage_type = line[ProjectSGC.LINE.VOLTAGE];
                        var v = vols[row.voltage_type];
                        if (v)
                            row.voltage_type_name = v.name;
                    }
                },
                dealStationData: function (lst) {
                    var m = ProjectSGC.Global.getMainObject("ModelList");
                    var vols = ProjectSGC.Voltage;
                    for (var i = 0; i < lst.length; i++) {
                        var row = lst[i];
                        row.line_id = row.obj_id;
                        row.line_name = row.obj_name;
                        row.pstype = "__";
                        var s = m.getStation(row.line_id);
                        if (!s) continue;
                        row.pstype = s.PlantStationType;
                        row.grid_id = s.data.owner[1];
                        var grid = m.getGrid(row.grid_id);
                        if (grid)
                            row.grid_name = grid[1];
                        row.voltage_type = s.code;
                        var v = vols[row.voltage_type];
                        if (v)
                            row.voltage_type_name = v.name;
                    }
                },
                getShowLines: function (data) {
                    var lst = data.data.uni_state.uni_state_list;
                    if (!lst)
                        return [];
                    var o = {};
                    Ysh.Array.each(lst, function (row, idx) {
                        var state = row.state_name;
                        var vol = row.voltage_type_name;
                        state += "," + vol;
                        if (!o[state])
                            o[state] = { lines: [], stations: [], objs: [], state_name: row.state_name, voltage: vol };
                        o[state].lines.push(row.line_id);
                        o[state].stations.push(row.charged_st_id);
                        o[state].objs.push([row.line_id, row.charged_st_id]);
                    });
                    function getStateUrl(state) {
                        var arr = state.split(',');
                        var vol = arr[1];
                        state = arr[0];
                        if ((state == "退出运行") || (state == "停电"))
                            return "/i/sgc/icon/state/tingdian.png";
                        if (state == "充电") {
                            switch (vol) {
                                case "6kV":
                                    return "/i/sgc/icon/state/v6.png";
                                case "10kV":
                                case "10.5kV":
                                    return "/i/sgc/icon/state/v10.png";
                                case "20kV":
                                    return "/i/sgc/icon/state/v20.png";
                                case "35kV":
                                    return "/i/sgc/icon/state/v35.png";
                                case "66kV":
                                    return "/i/sgc/icon/state/v66.png";
                                case "110kV":
                                    return "/i/sgc/icon/state/v110.png";
                                case "220kV":
                                case "±200kV":
                                case "±320kV":
                                case "±167kV":
                                    return "/i/sgc/icon/state/v220.png";
                                case "330kV":
                                    return "/i/sgc/icon/state/v330.png";
                                case "±500kV":
                                case "±420kV":
                                case "±400kV":
                                case "±125kV":
                                case "500kV":
                                    return "/i/sgc/icon/state/v500.png";
                                case "750kV":
                                case "±660kV":
                                    return "/i/sgc/icon/state/v750.png";
                                case "±1100kV":
                                case "±1000kV":
                                case "±800kV":
                                case "1000kV":
                                    return "/i/sgc/icon/state/v1000.png";
                            }
                        }
                        return "";
                    };
                    var types = [];
                    for (var state in o) {
                        var url = getStateUrl(state);
                        if (url) {
                            var oo = o[state];
                            var lines = oo.lines;
                            var stations = oo.stations;
                            state = "real" + state;
                            var bChongdian = oo.state_name == "充电";
                            if (bChongdian)
                                types.push({ type: state, url: url, lines: lines, stations: [], charge: stations, objs: oo.objs, isGradent: true, stateColor: "#ffffff", voltage: oo.voltage });
                            else
                                types.push({ type: state, url: url, lines: lines, stations: [], charge: stations, objs: oo.objs });
                        }
                    }
                    return types;
                },
                getShowStations: function (data) {
                    var lst = data.data.uni_state.uni_state_list;
                    if (!lst)
                        return [];
                    var o = {};
                    Ysh.Array.each(lst, function (row, idx) {
                        var id = row.line_id;
                        var type = row.pstype || "__";
                        if (type == "__") return;
                        if (!o[type])
                            o[type] = [];
                        o[type].push(id);
                    });
                    var types = [];
                    for (var type in o) {
                        var ids = o[type];
                        var url = "/i/sgc/icon/state/s" + type + ".png";
                        type = "real" + type;
                        types.push({ type: type, url: url, lines: [], stations: ids });
                        //this.stypes.push({ type: type, lines: [], stations: ids });
                        //ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: type, url: url, stationIDs: ids, lineIDs: [] } });
                    }
                    return types;
                },
                showLineOnMap: function (data) {
                    var lst = this.getShowLines(data);
                    var arr = ProjectSGC.Array.edit(this.ltypes, lst, function (l1, l2) {
                        return (l1.type == l2.type) ? 2 : 0;
                    });
                    this.ltypes = lst;
                    this.hideList(arr[0]);
                    this.showList(arr[2]);
                    var m = arr[1];
                    for (var i = 0; i < m.length; i++) {
                        var pair = m[i];
                        var t1 = pair[0];
                        var t2 = pair[1];
                        var diff = ProjectSGC.Array.edit(t1.objs, t2.objs, function (o1, o2) {
                            return (o1[0] != o2[0]) ? 0 : (o1[1] == o2[1] ? 1 : 2);
                        });
                        if (diff[0].length > 0)
                            this.hideList([{ type: t1.type, lines: Ysh.Array.to1d(diff[0], 0), stations: [] }]);
                        if (diff[1].length > 0) {
                            var arrCharge = diff[1];//[1];
                            var l = [], c = [];
                            for (var ii = 0; ii < arrCharge.length; ii++) {
                                l.push(arrCharge[ii][1][0]);
                                c.push(arrCharge[ii][1][1]);
                            }
                            this.showList([{ type: t1.type, lines: l, stations: [], charge: c }]);
                        }
                        if (diff[2].length > 0)
                            this.showList([{ type: t1.type, lines: Ysh.Array.to1d(diff[2], 0), stations: [], charge: Ysh.Array.to1d(diff[2], 1) }]);
                    }
                },
                showStationOnMap: function (data) {
                    var lst = this.getShowStations(data);
                    var arr = ProjectSGC.Array.edit(this.stypes, lst, function (l1, l2) {
                        return (l1.type == l2.type) ? 2 : 0;
                    });
                    this.stypes = lst;
                    this.hideList(arr[0]);
                    this.showList(arr[2]);
                    var m = arr[1];
                    for (var i = 0; i < m.length; i++) {
                        var pair = m[i];
                        var t1 = pair[0];
                        var t2 = pair[1];
                        var diff = ProjectSGC.Array.edit(t1.stations, t2.stations, function (o1, o2) {
                            return o1 == o2 ? 1 : 0;
                        });
                        if (diff[0].length > 0)
                            this.hideList([{ type: t1.type, lines: [], stations: diff[0] }]);
                        if (diff[2].length > 0)
                            this.showList([{ type: t1.type, lines: [], stations: diff[2] }]);
                    }
                },
                hideList: function (lst) {
                    for (var i = 0; i < lst.length; i++) {
                        var t = lst[i];
                        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: false, data: { type: t.type, lineIDs: t.lines, stationIDs: t.stations } });
                    }
                },
                hide: function () {
                    if (this.timerId) {
                        window.clearTimeout(this.timerId);
                        this.timerId = null;
                    }
                    this.hideList(this.stypes);
                    this.hideList(this.ltypes);
                    this.stypes = [];
                    this.ltypes = [];
                },
                showList: function (lst) {
                    if (!this.state) return;
                    for (var i = 0; i < lst.length; i++) {
                        var t = lst[i];
                        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "ChangeTextrueImages", selstate: true, data: { type: t.type, url: t.url, stationIDs: t.stations, lineIDs: t.lines, arrStartIds: t.charge, isGradent: t.isGradent, stateColor: t.stateColor, voltage: t.voltage } });
                    }
                },
                show: function () {
                    if (this.timerId) {
                        window.clearTimeout(this.timerId);
                        this.timerId = null;
                    }
                    var btn = this;
                    var dlls = [];
                    if (!MessageInst.caches["topo"])
                        MessageInst.caches["topo"] = {
                            data: {
                                data: { uni_state: { uni_state_list: [] } }
                            }, data1: {
                                data: { uni_state: { uni_state_list: [] } }
                            }
                        };
                    ProjectSGC.require("voltage");
                    this.pgid = ProjectSGC.Global.getGrid();
                    var desc = (new Date()).getTime();
                    var name = (userSettings.itemTopoDataSrc.value == "1") ? "南瑞" : "科东";
                    if (name == "南瑞") {
                        dlls.push({ type: 'dll', dll: 'SGCLib:SGCLib.Realtime.GetData', args: ["STA_LINE_STATUS_NR", "1201"] });
                        dlls.push({ type: 'dll', dll: 'SGCLib:SGCLib.Realtime.GetData', args: ["STA_LINE_STATUS_NR", "0112"] });
                        this.name = "拓扑着色";
                    } else {
                        dlls.push({ type: 'dll', dll: 'SGCLib:SGCLib.Realtime.GetData', args: ["STA_LINE_STATUS", "1201"] });
                        dlls.push({ type: 'dll', dll: 'SGCLib:SGCLib.Realtime.GetData', args: ["STA_LINE_STATUS", "0112"] });
                        this.name = "拓扑着色(K)";
                    }
                    ModelList.useAll(function () {
                        SGCDebug.start("开始获取" + name + "拓扑(" + desc + ")");
                        PDP.exec(dlls, function (ret) {
                            var times = 10000;
                            if (ret.check("获取拓扑信息", true)) {
                                var data = "";
                                var data1 = "";
                                var bOk = true;
                                try {
                                    eval("data = " + ret.value[0]);
                                    if (!data.data.uni_state.uni_state_list)
                                        data.data.uni_state.uni_state_list = [];
                                } catch (e) {
                                    alert("解析线路拓扑数据出现错误：" + ret.value[0]);
                                    bOk = false;
                                }
                                try {
                                    eval("data1 = " + ret.value[1]);
                                    if (!data1.data.uni_state.uni_state_list)
                                        data1.data.uni_state.uni_state_list = [];
                                } catch (e) {
                                    alert("解析变电站拓扑数据出现错误：" + ret.value[1]);
                                    bOk = false;
                                }
                                if (btn.state == 0) return;//已经取消了
                                if (bOk) {
                                    times = 1000;
                                    MessageInst.caches["topo"] = { data: data, data1: data1 };
                                    btn.dealLineData(data.data.uni_state.uni_state_list);
                                    btn.dealStationData(data1.data.uni_state.uni_state_list);
                                    btn.showLineOnMap(data);
                                    btn.showStationOnMap(data1);
                                    vMain.sendBusinessMsg("", { type: "topo" });
                                }
                            }
                            SGCDebug.start("显示" + name + "拓扑结束");
                            SGCDebug.show();
                            if (btn.state)
                                btn.timerId = window.setTimeout(function () { btn.show(); }, times);
                        });
                    });
                },
                receive: function (msg) { //无需管电网变动
                    if (msg.type != "toposrcchanged") return;
                    //MessageInst.caches["topo"] = null;
                    //this.show();
                }
            },
            {
                isHide: true, id: "jxp", state: 0, name: "检修", page: "sgc_jxp", img: "/i/sgc/module/realjianxiu.png", legend: "/i/sgc/legend/tingdian.png?v=1.21.409.1",
                showList: function (lst) {
                    if (this.state == 0) return;
                    var arrIcon = [[], [], []];
                    var arrMultiIcon = [[], [], []];
                    //var arrIconImg = ["/i/sgc/icon/jianxiu/line_dzx200714.png", "/i/sgc/icon/jianxiu/line_zxz200714.png", "/i/sgc/icon/jianxiu/line_yzx200714.png"];
                    var arrIconImg = ["/i/sgc/icon/jianxiu/line_dzx.png?v=1.20.729.1", "/i/sgc/icon/jianxiu/line_zxz.png?v=1.20.729.1", "/i/sgc/icon/jianxiu/line_yzx.png?v=1.20.729.1"];
                    var arrMultiIconImg = ["/i/sgc/icon/jianxiu/station_dzx.png", "/i/sgc/icon/jianxiu/station_zxz.png", "/i/sgc/icon/jianxiu/station_yzx.png"];
                    arrMultiIconImg = arrIconImg;

                    for (var i = 0; i < lst.length; i++) {
                        var row = lst[i];
                        var flag = row[6];
                        var idx = 0;
                        if ((flag == "1003") || (flag == "已竣工"))
                            idx = 2;
                        else if ((flag == "1002") || (flag == "已开工"))
                            idx = 1;
                        var devid = row[7];
                        var stid = row[9];
                        var devtype = ProjectSGC.Meta.getTypeById(devid);
                        var objid = devid;
                        if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
                            if (!this.grid.hasLine(devid))
                                continue;
                            arrIcon[idx].push({ objid: objid, id: objid, data: row });
                        } else {
                            if (!this.grid.hasStation(stid))
                                continue;
                            objid = stid;
                            arrMultiIcon[idx].push({ objid: objid, id: objid, data: row });
                        }
                    }
                    var fMsg = function (msg) {
                        var data = msg.locateData;
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            var r = item.data.data.data;
                            item.data.tips = r[0] + "(" + r[8] + ")";
                        }
                    };
                    for (var i = 0; i < arrIcon.length; i++) {
                        if (arrIcon[i].length > 0)
                            ProjectSGC.Map.showIcon("repair", arrIconImg[i], arrIcon[i], null, 19, "", fMsg);
                    }
                    for (var i = 0; i < arrMultiIcon.length; i++) {
                        if (arrMultiIcon[i].length > 0)
                            ProjectSGC.Map.showIcon("repair", arrMultiIconImg[i], arrMultiIcon[i], null, 19, "", fMsg);
                        //ProjectSGC.Map.showMultipleIcon("repair", arrMultiIconImg[i], arrMultiIcon[i]);
                    }
                },
                hide: function () {
                    ProjectSGC.Map.hideIcon("repair");
                },
                show1: function () {
                    var tmStart = Ysh.Time.getTimeStart(new Date(), "d");
                    var tmEnd = Ysh.Time.add("d", 1, tmStart);
                    var _this = this;
                    this.pgid = ProjectSGC.Global.getGrid();
                    ModelList.useAll(function () {
                        _this.grid = ProjectSGC.Helper.getGrid(_this.pgid);
                        SGCDebug.start("获取检修开始");
                        PDP.read("SGC", "sgc/jx:GetAllList", [tmStart, tmEnd], function (ret) {
                            if (!ret.check("获取检修数据", true))
                                return;
                            _this.hide();
                            _this.showList(ret.value);
                            SGCDebug.start("显示检修结束");
                            SGCDebug.show();
                        });
                    });
                },
                show: function () {
                    var tmStart = Ysh.Time.getTimeStart(new Date(), "d");
                    var tmEnd = Ysh.Time.add("d", 1, tmStart);
                    var _this = this;
                    this.pgid = ProjectSGC.Global.getGrid();
                    ModelList.useAll(function () {
                        _this.grid = ProjectSGC.Helper.getGrid(_this.pgid);
                        SGCDebug.start("获取检修开始");
                        var arg = "?gridid=0101990100&start=" + Ysh.Time.toString(tmStart) + "&end=" + Ysh.Time.toString(tmEnd);
                        PDP.dll('SGCLib:SGCLib.Service.Get', ["getoutagedaydata", arg], function (ret) {
                            if (!ret.check("获取检修数据", true))
                                return;
                            var result = ProjectSGC.Service.getResult(ret.value, "data");
                            if (!result) return;
                            //b.plan_id_d,b.auth_start_date,b.auth_end_date,b.start_date,b.end_date,b.dept,b.status,d.outage_dev_id,d.outage_dev_name,d.st_id
                            var fields = ["PLAN_ID_D", "auth_start_date", "auth_end_date", "start_date", "end_date", "DEPT", "STATUS", "OUTAGE_DEV_ID", "OUTAGE_DEV_NAME", "ST_ID"];
                            var array2d = Ysh.Array.fromObjectList(result, fields);
                            _this.hide();
                            _this.showList(array2d);
                            SGCDebug.start("显示检修结束");
                            SGCDebug.show();
                        });
                        return;
                        /*
                        PDP.read("SGC", "sgc/jx:GetAllList", [tmStart, tmEnd], function (ret) {
                            if (!ret.check("获取检修数据", true))
                                return;
                            _this.hide();
                            _this.showList(ret.value);
                            SGCDebug.start("显示检修结束");
                            SGCDebug.show();
                        });*/
                    });
                }
            },
            {
                isHide: true, id: "fault", state: 0, name: "故障", page: "sgc_fault", img: "/i/sgc/module/realfault.png", legend: "/i/sgc/legend/tingdian.png?v=1.21.409.1",
                showList: function (lst) {
                    if (this.state == 0) return;
                    var arr0 = [], arr1 = [], arr2 = [], arr3 = [];
                    for (var i = 0; i < lst.length; i++) {
                        var item = lst[i];
                        var resumetime = item[8];
                        var devid = item[2];
                        var stid = item[9];
                        var devtype = ProjectSGC.Meta.getTypeById(devid);
                        if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
                            if (!this.grid.hasLine(devid))
                                continue;
                            (resumetime ? arr1 : arr0).push({ objid: devid, id: item[0], devid: item[2], name: item[3], item: item });
                        } else {
                            if (!this.grid.hasStation(stid))
                                continue;
                            (resumetime ? arr3 : arr2).push({ objid: stid, id: item[0], devid: item[2], name: item[3], item: item });
                        }
                    }
                    var fMsg = function (msg) {
                        var data = msg.locateData;
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            var r = item.data.data.item;
                            item.data.tips = r[3];
                        }
                    };
                    if (arr0.length > 0) ProjectSGC.Map.showIcon("fault", "/i/sgc/icon/fault/line_ing.png?v=1.20.729.1", arr0, null, 19, "", fMsg);
                    if (arr1.length > 0) ProjectSGC.Map.showIcon("fault", "/i/sgc/icon/fault/line_ed.png?v=1.20.729.1", arr1, null, 19, "", fMsg);
                    if (arr2.length > 0) ProjectSGC.Map.showIcon("fault", "/i/sgc/icon/fault/line_ing.png?v=1.20.729.1", arr2, null, 19, "", fMsg);
                    if (arr3.length > 0) ProjectSGC.Map.showIcon("fault", "/i/sgc/icon/fault/line_ed.png?v=1.20.729.1", arr3, null, 19, "", fMsg);
                },
                hide: function () {
                    ProjectSGC.Map.hideIcon("fault");
                },
                show: function () {
                    var tmStart = Ysh.Time.getTimeStart(new Date(), "d");
                    var tmEnd = Ysh.Time.add("d", 1, tmStart);
                    var _this = this;
                    this.pgid = ProjectSGC.Global.getGrid();
                    ModelList.useAll(function () {
                        _this.grid = ProjectSGC.Helper.getGrid(_this.pgid);
                        SGCDebug.start("获取故障开始");
                        var arg = "?faulttimebegin=" + Ysh.Time.toString(tmStart) + "&faulttimeend=" + Ysh.Time.toString(tmEnd);
                        PDP.dll('SGCLib:SGCLib.Service.Get', ["getdevicefaultdata", arg], function (ret) {
                            if (!ret.check("获取故障数据", true))
                                return;
                            var result = ProjectSGC.Service.getResult(ret.value, "data");
                            if (!result) return;
                            var fields = ["FAULT_ID", "DEV_TYPE", "EQUIP_ID", "EQUIP_NAME", "FAULT_TIME", "FT_TYPE", "FAULT_DETAIL", "VOLNAME", "RESUME_TIME", "START_ST_ID"];
                            var array2d = Ysh.Array.fromObjectList(result, fields);
                            _this.hide();
                            _this.showList(array2d);
                            SGCDebug.start("显示故障结束");
                            SGCDebug.show();
                        });
                        return;
                        PDP.read("SGC", "sgc/fault:GetRealList", [tmStart, tmEnd], function (ret) {
                            if (!ret.check("获取故障数据", true))
                                return;
                            _this.hide();
                            _this.showList(ret.value);
                            SGCDebug.start("显示故障结束");
                            SGCDebug.show();
                        });
                    });
                }
            },
            {
                id: "realvol", state: 0, name: "母线电压", img: "/i/sgc/module/realvol.png",
                /*click: function () {
                    alert("正在优化调试中，敬请期待");
                },*/
                hide: function () {
                    vMain.showBusVoltage(false, this.pgid);
                },
                show: function () {
                    this.pgid = ProjectSGC.Global.getGrid();
                    vMain.showBusVoltage(true, this.pgid);
                }
            },
            {
                isHide: true, id: "overload", state: 0, name: "越限", trans: [], lines: [], page: "sgc_tabpages", img: "/i/sgc/module/realover.png", legend: "/i/sgc/legend/tingdian.png?v=1.21.409.1",
                args: { types: "变压器,线路", pages: "/html/sgc_overload.html?type=trans,/html/sgc_overload.html?type=line" },
                hide: function () {
                    if (this.timerId) {
                        window.clearTimeout(this.timerId);
                        this.timerId = null;
                    }
                    this.hideList(this.trans);
                    this.hideList(this.lines);
                    this.trans = this.lines = [];
                },
                hideList: function (lst) {
                    for (var i = 0; i < lst.length; i++)
                        ProjectSGC.Map.hideIcon(this.id + lst[i].id);
                },
                getMsgDeal: function () {
                    return function (msg) {
                        msg.paddingtop = -18; msg.images.height = 35; msg.images.width = 22;
                        var data = msg.locateData;
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            var r = item.data.data.item;
                            item.data.tips = (r.st_name || "") + r.name;
                        }
                    };
                },
                showLineIcon: function (lstLine) {
                    //先对比，再显示
                    var lst = this.grid.filterLine(lstLine, "id");
                    var arr = ProjectSGC.Array.edit(this.lines, lst, function (l1, l2) {
                        return l1.id == l2.id ? 1 : 0;
                    });
                    this.hideList(arr[0]);
                    this.lines = lst || [];
                    lst = arr[2];
                    var fMsg = this.getMsgDeal();
                    for (var i = 0; i < lst.length; i++) {
                        var item = lst[i];
                        var type = this.id + item.id;
                        ProjectSGC.Map.showIcon(type, "/i/sgc/overload-line.png?v=201118", [{ type: "1", index: i, objid: item.id, name: item.name, dtype: 'line', item: item }], null, "", "", fMsg);
                    }
                },
                showTransIcon: function (lstStation) {
                    //先对比，再显示
                    var lst = this.grid.filterStation(lstStation, "st_id");
                    var arr = ProjectSGC.Array.edit(this.trans, lst, function (o1, o2) {
                        return o1.id == o2.id ? 1 : 0;
                    });
                    this.hideList(arr[0]);
                    this.trans = lst || [];
                    lst = arr[2];
                    var fMsg = this.getMsgDeal();
                    for (var i = 0; i < lst.length; i++) {
                        var item = lst[i];
                        var type = this.id + item.id;
                        ProjectSGC.Map.showIcon(type, "/i/sgc/overload-trans.png?v=201118", [{ type: type, index: i, objid: item.st_id, name: item.st_name + item.name, dtype: 'trans', item: item }], null, "", "", fMsg);
                    }
                },
                //click: function () { }, receive: function () { },
                show: function (msg) {
                    if (this.timerId)
                        window.clearTimeout(this.timerId);
                    var dlls = [];
                    this.pgid = ProjectSGC.Global.getGrid();
                    var desc = (new Date()).getTime();
                    //var types = [8, 9];
                    //for (var i = 0; i < types.length; i++)
                    //    dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["commongetdata", "?requesttype=" + types[i] + "&ids=" + this.pgid + "&desc=" + desc] });

                    var types = ["TRANS", "LINE"];
                    for (var i = 0; i < types.length; i++)
                        dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Realtime.GetData", "args": ["LOAD_RATE", types[i]] });

                    var btn = this;
                    ModelList.useAll(function () {
                        if (!btn.state) return;
                        btn.grid = ProjectSGC.Helper.getGrid(btn.pgid);
                        SGCDebug.start("开始获取重过载数据(" + desc + ")");
                        PDP.exec(dlls, function (ret) {
                            if (!btn.state) return;
                            var times = 10000;
                            if (ret.check("获取越限数据", true)) {
                                try {
                                    var trans = JSON.parse(ret.value[0]).data.nma_trans_load.grid_trans_load_list[0];
                                    var line = JSON.parse(ret.value[1]).data.nma_line_load.grid_line_load_list[0];
                                    btn.showTransIcon(trans.over_load_list);
                                    btn.showLineIcon(line.over_load_list);
                                } catch (err) {
                                }
                            }
                            SGCDebug.start("显示越限结束");
                            SGCDebug.show();
                            if (btn.state)
                                btn.timerId = window.setTimeout(function () { btn.show(); }, times);
                        });
                    });
                }
            },
            {
                isHide: true, id: "heavyload", state: 0, name: "重载", trans: [], lines: [], page: "sgc_tabpages", img: "/i/sgc/module/realheavy.png", legend: "/i/sgc/legend/tingdian.png?v=1.21.409.1",
                args: { types: "变压器,线路", pages: "/html/sgc_overload_heavy.html?type=trans,/html/sgc_overload_heavy.html?type=line" },
                hide: function () {
                    if (this.timerId) {
                        window.clearTimeout(this.timerId);
                        this.timerId = null;
                    }
                    this.hideList(this.trans);
                    this.hideList(this.lines);
                    this.trans = this.lines = [];
                },
                hideList: function (lst) {
                    for (var i = 0; i < lst.length; i++)
                        ProjectSGC.Map.hideIcon(this.id + lst[i].id);
                },
                getMsgDeal: function () {
                    return function (msg) {
                        msg.paddingtop = -18; msg.images.height = 35; msg.images.width = 22;
                        var data = msg.locateData;
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            var r = item.data.data.item;
                            item.data.tips = (r.st_name || "") + r.name;
                        }
                    };
                },
                showLineIcon: function (lstLine) {
                    //先对比，再显示
                    var lst = this.grid.filterLine(lstLine, "id");
                    var arr = ProjectSGC.Array.edit(this.lines, lst, function (l1, l2) {
                        return l1.id == l2.id ? 1 : 0;
                    });
                    this.hideList(arr[0]);
                    this.lines = lst || [];
                    lst = arr[2];
                    var fMsg = this.getMsgDeal();
                    for (var i = 0; i < lst.length; i++) {
                        var item = lst[i];
                        var type = this.id + item.id;
                        ProjectSGC.Map.showIcon(type, "/i/sgc/heavyload-line.png?v=201118", [{ type: "1", index: i, objid: item.id, name: item.name, dtype: 'line', item: item }], null, "", "", fMsg);
                    }
                },
                showTransIcon: function (lstStation) {
                    //先对比，再显示
                    var lst = this.grid.filterStation(lstStation, "st_id");
                    var arr = ProjectSGC.Array.edit(this.trans, lst, function (o1, o2) {
                        return o1.id == o2.id ? 1 : 0;
                    });
                    this.hideList(arr[0]);
                    this.trans = lst || [];
                    lst = arr[2];
                    var fMsg = this.getMsgDeal();
                    for (var i = 0; i < lst.length; i++) {
                        var item = lst[i];
                        var type = this.id + item.id;
                        ProjectSGC.Map.showIcon(type, "/i/sgc/heavyload-trans.png?v=201118", [{ type: type, index: i, objid: item.st_id, name: item.st_name + item.name, dtype: 'trans', item: item }], null, "", "", fMsg);
                    }
                },
                //click: function () { }, receive: function () { },
                show: function (msg) {
                    if (this.timerId)
                        window.clearTimeout(this.timerId);
                    var dlls = [];
                    this.pgid = ProjectSGC.Global.getGrid();
                    var desc = (new Date()).getTime();
                    //var types = [8, 9];
                    //for (var i = 0; i < types.length; i++)
                    //    dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["commongetdata", "?requesttype=" + types[i] + "&ids=" + this.pgid + "&desc=" + desc] });

                    var types = ["TRANS", "LINE"];
                    for (var i = 0; i < types.length; i++)
                        dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Realtime.GetData", "args": ["LOAD_RATE", types[i]] });

                    var btn = this;
                    ModelList.useAll(function () {
                        if (!btn.state) return;
                        btn.grid = ProjectSGC.Helper.getGrid(btn.pgid);
                        SGCDebug.start("开始获取重过载数据(" + desc + ")");
                        PDP.exec(dlls, function (ret) {
                            if (!btn.state) return;
                            var times = 10000;
                            if (ret.check("获取重载数据", true)) {
                                try {
                                    var trans = JSON.parse(ret.value[0]).data.nma_trans_load.grid_trans_load_list[0];
                                    var line = JSON.parse(ret.value[1]).data.nma_line_load.grid_line_load_list[0];
                                    btn.showTransIcon(trans.heavy_load_list);
                                    btn.showLineIcon(line.heavy_load_list);
                                } catch (err) {
                                }
                            }
                            SGCDebug.start("显示重载结束");
                            SGCDebug.show();
                            if (btn.state)
                                btn.timerId = window.setTimeout(function () { btn.show(); }, times);
                        });
                    });
                }
            },
            {
                id: "realsection", state: 0, name: "断面路况", page: "sgc_section_real", img: "/i/sgc/module/section.png", isShowing: false, isRefreshing: false, legend: "/i/sgc/section/legend.png", showType: 1,
                hide: function () {
                    if (this.timerId) {
                        window.clearTimeout(this.timerId);
                        this.timerId = null;
                    }
                    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: "showSectionInfo", selstate: false, data: [] });
                    if (this.isShowing)
                        ProjectSGC.Map.setMode(this.id, "");
                    this.isShowing = false;
                    this.pgid = "";
                },
                getLimit: function (v, u, d) {
                    var dir = (v < 0) ? "-" : "+";
                    if ((u == 0) && (d == 0))
                        return { value: "", diff: "", ration: "", direction: dir, img: "" };
                    if (v < 0) {
                        if (d == 0)
                            return { value: u, diff: u + v, ratio: "", direction: dir, img: "" };
                        return {
                            value: d, diff: v - d, ratio: v / d, direction: dir
                        };
                    }
                    if (u == 0)
                        return { value: "", diff: "", ration: "", direction: dir, img: "" };
                    return {
                        value: u, diff: u - v, ratio: v / u, direction: dir, img: ""
                    };
                },
                getRatioImg: function (ratio) {
                    if (ratio > 0.9) return "/i/sgc/section/high-1.png";
                    if (ratio > 0.8) return "/i/sgc/section/normal-1.png";
                    if (ratio > 0.7) return "/i/sgc/section/lower-1.png";
                    return "/i/sgc/section/common-1.png";
                },
                fullSection: function (row) {
                    var id = row[0];
                    var name = row[1];
                    var pgid = row[2];
                    var time = row[3];
                    var pgname, limitimg, powervalue, limitvalue, limitdiff, limitratio, limitdir;
                    var value = row[4]; if (value) value = parseInt(value, 10);
                    var ulimit = row[5]; if (ulimit) ulimit = parseInt(ulimit, 10);
                    var dlimit = row[6]; if (dlimit) dlimit = parseInt(dlimit, 10);
                    var limit = this.getLimit(value, ulimit, dlimit);
                    if (limit.ratio) {
                        limit.img = this.getRatioImg(limit.ratio);
                        limit.ratio = Ysh.Number.toFixed(limit.ratio * 100, 0) + "%";
                    }
                    limitimg = limit.img;
                    powervalue = value;
                    limitvalue = limit.value;
                    limitdiff = Ysh.Number.toFixed(limit.diff, 0);
                    limitratio = limit.ratio;
                    limitdir = limit.direction;
                    return {
                        lst_0: id, lst_1: name, lst_2: pgid, lst_3: pgname, lst_4: limitimg, lst_5: powervalue, lst_6: limitvalue, lst_7: limitdiff, lst_8: limitratio, lst_9: limitdir, lst_10: time
                    };
                },
                showOnMap: function (data) {
                    //if (!this.isShowing)
                    //    ProjectSGC.Map.setMode(this.id, "other");
                    this.isShowing = true;
                    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: "showSectionInfo", selstate: false, data: [] });
                    var sectionids = [];
                    var sections = [];
                    var stationids = [];
                    var lineids = [];
                    var showItem = { name: true, limit: userSettings.getSetting("sectionLimit") == "1", value: userSettings.getSetting("sectionValue") == "1", yudu: userSettings.getSetting("sectionYudu") == "1" };
                    var mapInfo = {};
                    for (var i = 0; i < data.length; i++) {
                        var row = data[i];
                        var id = row[0];
                        if (sectionids.indexOf(id) < 0) {
                            var r = this.fullSection(data[i]);
                            sectionids.push(id);
                            var item = { s_name: showItem.name, s_limit: showItem.limit, s_value: showItem.value, s_yudu: showItem.yudu, id: r.lst_0, name: r.lst_1, value: r.lst_5, limit: r.lst_6, icon: r.lst_4, row: r };
                            if ((r.lst_4 != "/i/sgc/section/high-1.png") && (r.lst_4 != "/i/sgc/section/normal-1.png")) {
                                item.s_name = item.s_limit = item.s_value = item.s_yudu = false;
                            }
                            sections.push(item);
                            mapInfo[id] = { data: item, s: [], l: [] };
                        }
                        var devid = row[7];
                        var stid = row[9];
                        if (stid) {
                            stationids.push(stid);
                            mapInfo[id].s.push(stid);
                        } else {
                            lineids.push(devid);
                            mapInfo[id].l.push(devid);
                        }
                    }
                    this.sections = mapInfo;
                    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: "showSectionInfo", selstate: true, data: { info: sections, showType: this.showType, showItem: showItem } });
                    ProjectSGC.Map.showStationLines(lineids, stationids);
                },
                getSectionByMember: function (type, id) {
                    for (var s in this.sections) {
                        var v = this.sections[s];
                        if (!v) continue;
                        var lst = v[type];
                        if (!lst) continue;
                        if (lst.indexOf(id) < 0)
                            continue;
                        return s;
                    }
                    return null;
                },
                showSectionDataById: function (id) {
                    var item = this.sections[id];
                    if (!item)
                        return;
                    item = item.data;
                    var showItem = { name: true, limit: true, value: true, yudu: true };
                    item.s_name = showItem.name;
                    item.s_limit = showItem.limit;
                    item.s_value = showItem.value;
                    item.s_yudu = showItem.yudu;
                    MessageInst.eventSource = [];
                    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: "showSectionInfo", selstate: true, data: { info: [item], showType: this.showType, showItem: showItem } });
                },
                show: function (msg) {
                    if (this.isRefreshing) return;
                    this.isRefreshing = true;
                    if (this.timerId) {
                        window.clearTimeout(this.timerId);
                        this.timerId = null;
                    }
                    this.pgid = ProjectSGC.Global.getGrid();
                    var btn = this;
                    SGCDebug.start("开始获取断面路况数据...");
                    PDP.read("SGC", "sgc/section:GetSectionMembersList", [this.pgid], function (ret) {
                        if (!btn.state) return;
                        if (ret.check("获取断面数据", true)) {
                            btn.showOnMap(ret.value);
                            btn.isRefreshing = false;
                        }
                        SGCDebug.start("显示断面路况结束");
                        SGCDebug.show();
                        if (btn.state)
                            btn.timerId = window.setTimeout(function () { btn.show(); }, 60000);//1分钟1次
                    });
                },
                receive: function (msg) {
                    if (!msg) return;
                    if (msg.type == "mapchanged") {
                        if (this.pgid == ProjectSGC.Global.getGrid())
                            return;
                        this.show(msg);
                    } else if (msg.type == "page") {
                        if (msg.id != this.id)
                            return;
                        if (msg.event == "unload")
                            this.show(msg);
                    } else if (msg.type == "sectionsettings") {
                        if (msg.name == "showType")
                            this.showType = msg.value;
                        if (vMain.isShowing(this.id))
                            return;
                        this.show(msg);
                    } else if (msg.eventType == 5) {
                        switch (msg.type) {
                            case "extline": this.showSectionDataById(this.getSectionByMember("l", msg.data.lineItemId)); break;
                            case "station": this.showSectionDataById(this.getSectionByMember("s", msg.data.id)); break;
                            case "section":
                            case "sectionicon":
                            case "sectionTrack":
                                this.showSectionDataById(msg.data.id);
                                break;
                        }
                    }
                }
            }/*,
            {
                id: "yujing", state: 0, name: "预警", img: "/i/sgc/module/yujing-gray.png",
                click: function () { }, receive: function () { }
            }*/,
            {
                id: "plantpower", state: 0, name: "电厂出力", img: "/i/sgc/module/realpower.png", legend: "/i/sgc/legend/dianchangchuli.png",
                hide: function () {
                    vMain.setLegend(this.legend, false);
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: false });
                },
                getColor: function (v, type) {
                    var idx = parseInt(v / 150, 10);
                    if (idx < 0) idx = 0;
                    else if (idx > 5) idx = 5;
                    if (type == "1001") { //火电
                        if (v < 500) return "#FF6347";
                        if (v < 1000) return "#bb1f01";
                        if (v < 1500) return "#a31304";
                        if (v < 2000) return "#740d02";
                        if (v < 2500) return "#590901";
                        return "#3c0101";
                    } else {
                        if (v < 200) return "#7FFFAA";
                        if (v < 400) return "#00FF7F";
                        if (v < 600) return "#32CD32";
                        if (v < 800) return "#228B22";
                        return "#008000";
                    }//[5 - idx];
                    return;
                    var idx = parseInt(v / 200, 10);
                    if (idx < 0) idx = 0;
                    else if (idx > 5) idx = 5;
                    if (type == "1001")
                        return ["#f78b80", "#f37158", "#f85232", "#f8350e", "#e22a04", "#bb1f01"][idx];
                    return ["#03ae7f", "#04ce97", "#04f3b2", "#1fe7ba", "#6ef6da", "#a9f7e7"][5 - idx];
                },
                showPlantGlowColor: function (data, m) {
                    var gridid = SelectCityInst.getLocateGrid();
                    var tree = ProjectSGC.Helper.getGrid(gridid);
                    if (!tree) return;
                    var tree2;
                    if (gridid == "0101990101")
                        tree2 = ProjectSGC.Helper.getGrid("0101110000,0101120000,0101990901");//华北需要取北京天津冀北的
                    var msgs = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        if (SGCChaoliu.isInvalid(item))
                            continue;
                        var id = item.id;
                        var v = item.floatValue;
                        if ((!v) || isNaN(v))
                            continue;
                        v = parseFloat(v);
                        var plant = m.getStation(id);
                        if (!plant)
                            continue;
                        if (!tree.hasStation(id))
                            continue;
                        if (gridid == "0101990101") { //华北只要500kV及一下和京津冀220kV的，1001,1002,1003,1005
                            var vol = plant.code;
                            if (["1001", "1002", "1003", "1005"].indexOf(vol) < 0)
                                continue;
                            if (vol == "1005") {
                                if (!tree2.hasStation(id))
                                    continue;
                            }
                        }
                        var clr = this.getColor(v, plant.PlantStationType);
                        var tips = "出力：" + Ysh.Number.toFixed(v, 2) + "MW";
                        var msg = { Radius: 25, stationid: id, longitude: plant.LONGITUDE, latitude: plant.LATITUDE, glowColor: clr, data: { value: v }, tips: tips };
                        msgs.push(msg);
                    }
                    if (msgs.length > 0)
                        ProjectSGC.Map.postMessage(
                        //{ eventType: "menuope", menuname: "showGlowColor", selstate: true, data: msgs }
                            { eventType: 'menuope', menuname: 'showGlowColor', selstate: true, data: { blend: false, info: msgs } }
                        );
                },
                show: function (b) {
                    if (b) this.hide();
                    vMain.setLegend(this.legend, true);
                    var m = ModelList;
                    var _this = this;
                    m.require(["station"], function () {
                        var dlls = [];
                        dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["getrealdatabydevmeas", "?devtype=0111&meastypes=00002001"] });
                        PDP.exec(dlls, function (data) {
                            if (!data.check("获取电厂功率", true))
                                return;
                            _this.showPlantGlowColor(ProjectSGC.Service.getResult(data.value[0], "data"), m);
                        });
                    });
                }
            }
        ],
        legendImg: [],
        legendContent: [],
        legendBottom: '',
        ystype: '',
        legendFilter: null,
        legendTopRight: false,
        legendShowState: true,//Ysh.Cookie.get("legend-state") != "0"
        pages: [],
        windows: [],
        timers: {},
        forecast1: [{ value: 1, text: '气温预报' }, {
            value: 2, text: '降水预报'
        }],
        forecastupdate: false,
        forecast1v: 1,
        //forecast2: [],//[{ value:0,text:'最高气温' },{ value:1,text:'最低气温' }]
        forecast2v: "",
        //forecast3: [],//[{ value:0,text:'24小时' },{ value:1,text:'48小时' },{ value:1,text:'72小时' },{ value:1,text:'96小时' },{ value:1,text:'120小时' },{ value:1,text:'144小时' },{ value:1,text:'168小时' }]
        forecast3v: 24,
        showForecast: false,
        chaoliuTime: "",
        chaoliuType: 0,
        showChaoliuBtn: false
    },
    computed: {
        realbuttons: function () {
            return ProjectSGC.Array.pick(this.realbuttons_all, function (b) { return !b.isHide });
        },
        forecast2: function () {
            switch (this.forecast1v) {
                case 1:
                case 11:
                    this.forecast2v = "high";
                    return [{ value: "high", text: '最高气温' }, { value: "low", text: '最低气温' }];
                case 2:
                case 12:
                    this.forecast2v = "24";
                    return [{ value: "24", text: '24小时降水' }, { value: "6", text: '6小时降水' }];
                default:
                    this.forecast2v = "";
                    return [];
            }
        },
        forecast3: function () {
            switch (this.forecast2v) {
                case "high":
                case "low":
                case "24":
                    this.forecast3v = 24;
                    return [{ value: 24, text: '24小时' }, { value: 48, text: '48小时' }, { value: 72, text: '72小时' }, { value: 96, text: '96小时' }, { value: 120, text: '120小时' }, { value: 144, text: '144小时' }, { value: 168, text: '168小时' }];
                case "6":
                    this.forecast3v = 6;
                    return [{ value: 6, text: '6小时' }, { value: 12, text: '12小时' }, { value: 18, text: '18小时' }, { value: 24, text: '24小时' }];
                default:
                    this.forecast3v = 0;
                    return [];
            }
        },
        forecastMsg: function () {
            if ((!this.forecast2v) || (!this.forecast3v))
                return "";
            switch (this.forecast1v) {
                case 11:
                    return this.forecast2v + "_temperature_24_" + this.forecast3v + "";
                case 12:
                    return "rain" + this.forecast2v + "_" + this.forecast3v + "";
                default:
                    return "";
            }
        },
        forecastImg: function () {
            var dir = "/i/WeatherData/";
            switch (this.forecast1v) {
                case 1:
                    return dir + this.forecast2v + "_temperature_24_" + this.forecast3v + "/latest.jpg";
                case 2:
                    return dir + "rain" + this.forecast2v + "_" + this.forecast3v + "/latest.jpg";
                default:
                    return "";
            }
        },
        realButtonTop: function () {
            return 80; /*return (304 - this.realbuttons.length * 28) + 'px';*/
        },
        restoreButtonTop: function () {
            return 15 + 80 + this.realbuttons.length * 28;
        },
        buttonTop: function () {
            return this.restoreButtonTop + 60;
        },
        fullpath: function () {
            return this.getFullPath(this.curfile, this.args);
        },
        legendImageList: function () {
            var arr = [];
            if (this.legendImg.length == 0)
                return arr;
            var lst = this.legendImg;
            for (var i = 0; i < lst.length; i++) {
                arr.addSkipSame(lst[i]);
            }
            return arr;
        },
        showToolbar: function () {
            return this.modelid != "line";
        },
        timeFormat: function () {
            switch (this.sectiontype) {
                case 'y': return "1100000";
                case 'm': return "1110000";
                case 'd': return "1111000";
                default: return "111111";
            }
        },
        showLegend: function () {
            return (this.legendImg.indexOf("none") < 0) && this.legendImg.length;
        },
        needShowBusiness: function () {
            return (this.leftWidth == 1) && (this.Config.OpenMode == ProjectSGC.Config.OpenModeType.GENERAL) && this.onlyHideBusiness && (this.pages.length > 0);
        },
        showButtons: function () {
            return this.buttons;
        },
        legendStateImage: function () {
            return "/i/sgc/legendbtn.png";
            //return this.legendShowState ? "/i/sgc/typhoon/left.png" : "/i/sgc/typhoon/right.png"
        }
    },
    methods: {
        clickForecast1: function (item) {
            var app = vMain.getApp(item.type);
            switch (item.value) {
                case 11:
                case 12:
                    this.showPlayer = false;
                    if (app && app.legend)
                        vMain.setLegend(app.legend, false);
                    break;
            }
            if (item.value === 0) {
                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: false, data: { type: "forecast" } });
                if (vMain.lastForeLegend)
                    vMain.setLegend(vMain.lastForeLegend, false);
                vMain.lastForeLegend = "";
                if (app && app.legend)
                    vMain.setLegend(app.legend, true);
                this.showPlayer = true;
                if (app)
                    app.display(vMain.sectiontime, true);
            } else {
                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: false, data: { type: item.type } });
            }
        },
        getShowTime: function () {
            if (!this.showPlayer) return "";
            return this.sectiontime;
        },
        getRealButton: function (id) {
            var lst = this.realbuttons;
            for (var i = 0; i < lst.length; i++) {
                var btn = lst[i];
                if (btn.id == id)
                    return btn;
            }
            return null;
        },
        addOpenWindow: function (catalog, wnd) {
            for (var i = 0; i < this.windows.length; i++) {
                var w = this.windows[i];
                if (w[0] == catalog) {
                    w[1] = wnd;
                    return;
                }
            }
            this.windows.push([catalog, wnd]);
            if (this.windows.length == 1)
                this.watchOpenWindows();
        },
        changePage: function (catalog, name, page, args) {
            /*if (!this.isShowing(catalog))
                this.showPage(catalog, name, page, args);
            else {
                this.showBusiness(false);
            }*/
            for (var i = 0; i < this.pages.length; i++) {
                var p = this.pages[i];
                if (p[0] == catalog) {
                    this.closePage(catalog);
                    return false;
                }
            }
            for (var i = 0; i < this.windows.length; i++) {
                var w = this.windows[i];
                if (w[0] == catalog) {
                    w = w[1];
                    if (w && w.open && !w.closed)
                        w.close();
                    this.windows.splice(i, 1);
                    return false;
                }
            }
            this.showPage(catalog, name, page, args);
            return true;
        },
        changePageName: function (catalog, name) {
            for (var i = 0; i < this.pages.length; i++) {
                var p = this.pages[i];
                if (p[0] == catalog) {
                    p[1] = name;
                    Vue.set(this.pages, i, p);
                    break;
                }
            }
        },
        changeSectionTime: function (v, bInvalid) {
            if ((!this.showPlayer) || bInvalid)
                return;
            this.boardcast.assist = Ysh.Time.formatString(v, this.timeFormat);
            var vv = Ysh.Time.toString(Ysh.Time.add('ss', -1, Ysh.Time.add(this.sectiontype, 1, new Date(Ysh.Time.parseDate(v)))));
            MessageInst.postMessage({ eventType: 'menuope', menuname: 'setShowDate', selstate: 1, data: { operatedate: vv } });
            var o = this;
            if (!SGCModel.refreshTime(v, function (msg) {
                o.sendTimeChangedMsg();
                if (!msg) return;
                o.boardcast.content = o.playPage && (!o.hidePlayPage) ? msg.content : "";
            }))
                this.sendTimeChangedMsg();
            for (var i = 0; i < this.players.length; i++)
                this.players[i].changeTime(this.sectiontime);
        },
        changeStartTime: function (v) {
            this.minSectionTime = v;
            //if (this.sectiontime < v)
            //    this.sectiontime = v;
            for (var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                if (p.changeStartTime)
                    p.changeStartTime(v);
            }
            this.sendTimeChangedMsg();
        },
        clickAnswer: function (answer) {
            this.visible = false;
            showAsk((this.input == answer.type) ? answer.type : this.input + " " + answer.type, 10);
        },
        clickTab: function () {
        },
        closePage: function (catalog) {
            /*
            if (this.modelid != catalog)
                return;
            this.leftWidth0 = this.leftWidth;
            this.leftWidth = 1;*/
            if (catalog == "zonestatistics")
                this.quitSelectZone(true);
            var btn = this.getApp(catalog);
            if (btn != null) {
                btn.state = 0;
                if (btn.clear)
                    btn.clear();
            }
            for (var i = 0; i < this.pages.length; i++) {
                var p = this.pages[i];
                if (p[0] == catalog) {
                    this.pages.splice(i, 1);
                    if (this.pages.length == 0) {
                        this.modelid = "";
                        if (this.leftWidth != 1) {
                            this.leftWidth = 1;
                            this.endSplit();
                        }
                    } else {
                        if (this.modelid == catalog)
                            this.modelid = this.pages[Math.max(i - 1, 0)][0];
                    }
                    return i;
                }
            }
            return -1;
        },
        destroyFloatPage: function (c) {
            if (!c) return;
            $(c.$el).remove();
            c.$destroy();
            this.floatPages.erase(c);
        },
        endSplit: function () {
            this.splitting = false;
            if (this.$refs.player)
                this.$refs.player.resize();
            this.setMapSize();
            if (this.$refs.toolbar)
                this.$nextTick(function () {
                    this.$refs.toolbar.resize();
                });
        },
        floatPage: function (file, args, version, resizable, f) {
            var c = new (Vue.component(resizable ? "sizablefile" : "dynfile"))();
            c.file = file;
            args.dynfile = c;
            c.args = args;
            c.version = version;
            if (f) f(c);
            c.$mount();
            $(this.$refs.mapdiv).append(c.$el);
            this.floatPages.push(c);
            return c;
        },
        floatPageEx: function (jq, file, args, f) {
            var c = new (Vue.component("dynfile"))();
            c.file = file;
            args.dynfile = c;
            c.args = args;
            if (f) f(c);
            c.$mount();
            jq.append(c.$el);
            this.floatPages.push(c);
            return c;
        },
        getDefaultArgs: function (catalog, page) {
            if (catalog == "statistics") {
                if (this.ystype == "plant") {
                    var s = [];
                    var p = [];
                    p = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008];
                    var l = "";
                    return {
                        v: []
                        , s: s
                        , p: p, l: l
                    };
                }
                if (this.ystype == "station") {
                    var s = [];
                    var p = [];
                    s = [2001, 2002, 2003, 2004, 3001, 3002, 2005, 2006];
                    var l = "";
                    return {
                        v: []
                        , s: s
                        , p: p, l: l
                    };
                }
                var s = menuData.getSelectedPlantStations(1);
                var p = menuData.getSelectedPlantStations(2);
                var l = "";
                if ((s.length == 0) && (p.length == 0)) {
                    s = [2001, 2002, 2003, 2004, 3001, 3002, 2005, 2006];
                    p = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008];
                    l = "1";
                }
                return {
                    v: menuData.getSelectedVoltageCodes()
                    , s: s
                    , p: p, l: l
                };
            }
            return { _c: catalog };
        },
        getFullPath: function (page, args) {
            if (!page)
                return "about:blank";
            var a = args;
            if (page.indexOf(".") > 0) {
                return page;
            }
            if (typeof args !== "string")
                a = Ysh.Vue.getPageParameter(args);
            return 'html/' + this.getRealPage(page) + '.html' + a;
        },
        getRealPage: function (page) {
            switch (page) {
                case "sgc_jxp":
                    break;
                case "sgc_tq_thunder":
                    return "sgc_tq_thunder_hn";
                default:
                    return page;
            }
            return page + "_gd";
        },
        hideAnswer: function () {
            this.visible = false;
        },
        hideBusiness: function () {
            this.onlyHideBusiness = true;
            if (this.leftWidth != 1) {
                this.leftWidth = 1;
                this.endSplit();
            }
            this.topHeight = 1;
        },
        addModule: function (modules, parent, text, app, img) {
            var lst = modules.modules;
            for (var i = 0; i < lst.length; i++) {
                var p = lst[i];
                if (p.subs && p.subs.length > 0) {
                    if (p.text.startsWith(parent)) {
                        var newModule = { img: img, text: text, url: "app:" + app };
                        modules.fullModule(newModule);
                        p.subs.push(newModule);
                    }
                }
            }
        },
        init: function () {
            if (this.inited) return;
            SGCDB.init();
            this.inited = true;
            vMain.loading = false;
            //vMain.legendShowState = false;
            owg.init();
            return;
            ProjectSGC.Map.setMode("da", "other");
            ModelList.require(["station", "line"], function () {
                var lineids = daData.lines
                ProjectSGC.Map.showStationLines(lineids, daData.stations, "da");
                var acs = [];
                for (var i = 0; i < lineids.length; i++) {
                    var lineid = lineids[i];
                    var line = ModelList.getLine(lineid);
                    if (!line) continue;
                    acs.addSkipSame(line[ProjectSGC.LINE.VOLTAGE]);
                }
                var gyms = daData.gym;
                for (var i = 0; i < gyms.length; i++) {
                }
                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'mapCoordinatePickup', selstate: true, data: {} });
                return;
                SGCChaoliu.showDirection = SGCChaoliu.showValue = true;
                SGCChaoliu.showDc = true;
                SGCChaoliu.showAc = acs;
                SGCChaoliu.start();
            });
        },
        isShowing: function (catalog) {
            /*
            if (this.leftWidth == 1)
                return false;
            return (this.modelid == catalog);
            */
            return this.pages.findFirst(function (p) { return p[0] == catalog }) >= 0;
        },
        out: function (event) {
            event.target.style.backgroundColor = "#efefef";
        },
        over: function (event) {
            event.target.style.backgroundColor = "white";
        },
        playEnd: function () {
            if (this.ystype)
                this.boardcast.content = SGCModel.getSummary(this.minSectionTime, this.sectiontime);
        },
        sendBusinessMsg: function (id, msg) {
            if (id) {
                if (this.modelid != id)
                    return;
            }
            Ysh.Array.each(this.realbuttons, function (b) {
                if (b.state && b.receive)
                    b.receive(msg);
            });
            this.$refs.modules.sendBusinessMsg(msg);
            if (document.getElementById("iframeBusiness"))
                document.getElementById("iframeBusiness").contentWindow.postMessage(msg, "*");
            var pages = this.pages;
            for (var i = 0; i < pages.length; i++) {
                var p = pages[i];
                var frm = document.getElementById("iframeBusiness_" + p[0]);
                if (frm)
                    frm.contentWindow.postMessage(msg, "*");
            }
            var windows = this.windows;
            for (var i = 0; i < windows.length; i++) {
                var w = windows[i][0];
                w.postMessage(msg, "*");
            }
            Ysh.Array.each(this.floatPages, function (p) {
                if (p.receive) {
                    p.receive(msg);
                    return;
                }
                if (!p.$children) return;
                var _vm = p.$children[0];
                if (!_vm) return;
                if (!_vm.receive) return;
                _vm.receive(msg);
            });
        },
        sendTimeChangedMsg: function () {
            if (!this.showPlayer)
                return;
            var type = "timechanged";
            var data = { min: this.minSectionTime, time: this.sectiontime, type: this.sectiontype };
            if (document.getElementById("frmPlayer"))
                document.getElementById("frmPlayer").contentWindow.postMessage({ type: type, data: data }, "*");
            //if (document.getElementById("iframeBusiness"))
            //    document.getElementById("iframeBusiness").contentWindow.postMessage({ type: type, data: data }, "*");
            this.sendBusinessMsg("", { type: type, data: data });
        },
        showAnswer: function () {
            this.visible = (this.answers.length > 0);
        },
        showBusiness: function (bShow) {
            if (bShow) {
                this.onlyHideBusiness = false;
                if (this.leftWidth == 1) {
                    this.leftWidth = this.leftWidth0;
                    this.endSplit();
                } else {
                    this.setMapSize();
                }
            } else {
                this.leftWidth0 = this.leftWidth;
                this.leftWidth = 1;
                this.endSplit();
                MapOpeInst.postMessage({ locateType: 0 });
            }
        },
        showPage: function (catalog, name, page, args, icon, w, h) {
            //this.leftWidth = this.leftWidth0;
            var btn = this.getApp(catalog);
            if (btn != null) {
                btn.state = 1;
            }
            return this.show(catalog, name, page, args, { icon: icon, w: w, h: h });
        },
        startSplit: function () {
            this.splitting = true;
        },
        show: function (catalog, name, page, args, options) {
            args = Ysh.Object.combine(this.getDefaultArgs(catalog, page), args);
            page = this.getRealPage(page);
            if (ProjectSGC.Config.OpenMode == ProjectSGC.Config.OpenModeType.MULTI_SCREEN) {
                //var wnd = window.open("/html/" + page + ".html" + Ysh.Vue.getPageParameter(args), "SGCOpen");
                var wnd = window.open(this.getFullPath(page, args), catalog);
                this.addOpenWindow(catalog, wnd);
                return;
            }
            var bHasCatalog = false;
            for (var i = 0; i < this.models.length; i++) {
                m = this.models[i];
                if (m[0] == catalog) {
                    bHasCatalog = true;
                    break;
                }
            }
            if (bHasCatalog) {
                if (ProjectSGC.Config.OpenMode == ProjectSGC.Config.OpenModeType.NO_LIST) {
                    this.onlyHideBusiness = true;
                } else {
                    this.showBusiness(true);
                }
                var m = Ysh.Array.first(this.models, function (model) { return model[0] == catalog; });
                if (m) m[1] = name;
                this.curfile = page;
                this.args = args;
                for (var i = 0; i < this.pages.length; i++) {
                    var p = this.pages[i];
                    if (p[0] == catalog) {
                        p[1] = name;
                        p[2] = page;
                        p[3] = args;
                        p[4] = (new Date()).getTime();
                        this.$refs.pages.refresh();
                        return;
                    }
                }
                this.pages.push([catalog, name, page, args, (new Date()).getTime()]);
                this.modelid = catalog;
            } else {
                return Ysh.Vue.Dialog.show(name, page, args, options.icon, options.w, options.h);
            }
        },
        setLegend: function (url, show) {
            if (show) {
                this.legendImg.push(url);
                return;
                if (!this.legendShowState) {
                    this.legendShowState = true;
                    window.setTimeout(function () { vMain.legendShowState = false; }, 2000);
                }
            } else {
                this.legendImg.erase(url);
            }
        },
        editLegend: function (url) {
            var idx1 = url.lastIndexOf("/");
            var idx2 = url.lastIndexOf(".png");
            if ((idx1 < 0) || (idx2 < 0)) return;
            var arr = url.substring(idx1 + 1, idx2).split("colorbar");
            var c = topMenuBar.getCity();
            var left = "", top = "";
            if (window.event) {
                var $e = $(window.event.srcElement.parentElement);
                left = ($e.offset().left + $e.width()) + "px";
                top = $e.offset().top + "px"
            }
            //var dlg = vMain.showPage("legenddlg", "母线电压配置", "sgc_vol_limit", { gridid: arr[0], gridname: c.text || c.text1, vol: arr[1] }, null, "200px", "220px");            
            var dlg = Ysh.Vue.Dialog.showEx("sgc_vol_limit", {
                gridid: arr[0], gridname: c.text || c.text1, vol: arr[1], close: function () {
                    dlg.show = false;
                }
            }, {
                name: "母线电压配置", width: "200px", height: "150px", left: left, top: top
            });
        },
        getLegendBottom: function () {
            var ps = this.floatPages;
            var hMax = 0;
            for (var i = 0; i < ps.length; i++) {
                var p = ps[i];
                var el = p.$el;
                if ((!el) || (!el.style))
                    continue;
                if ((el.style.bottom != "0px") && (el.getAttribute("isbottom") != "1"))
                    continue;
                var h = parseInt(el.style.bottom) + parseInt(el.style.height, 10);
                if (h > hMax)
                    hMax = h;
            }
            if (hMax > 0) {
                if (this.showPlayer && (!this.hidePlayer)) return Math.max(hMax, 150) + "px";
                return hMax + "px";
            }
            //if (this.legendBottom) return this.legendBottom;
            if (this.showPlayer && (!this.hidePlayer)) return "150px"
            return "10px";
        },
        changeLegendState: function () {
            this.legendShowState = !this.legendShowState;
            Ysh.Cookie.set("legend-state", this.legendShowState ? 1 : 0);
        },
        resize: function () {
            this.endSplit();
        },
        setMapSize: function () {
            if (login.mode == "bigscreen") return;
            this.$nextTick(function () {
                var jq = $(this.$refs.mapdiv);
                //document.getElementById("iframeGraph").style.width = jq.width() + 'px';
                for (var i = 0; i < this.floatPages.length; i++) {
                    if (this.floatPages[i].resize)
                        this.floatPages[i].resize();
                }
            });
        },
        onShowPlayer: function (b) {
            b ? this.openPlayer() : this.closePlayer();
        },
        showByGrid: function (property, show) {
            if (show) {
                var arr = [SelectCityInst.rootid.substr(4)];
                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 1, data: { property: property, station: arr, line: arr } });
            } else {
                MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showStationLineByProperty', selstate: 0, data: { property: property, station: [], line: [] } });
            }
        },
        openPlayer: function () {
            this.showPlayer = true;
            this.changeSectionType(this.ystype ? 'y' : player.sectiontype);
            var vv = Ysh.Time.toString(Ysh.Time.add('ss', -1, Ysh.Time.add(this.sectiontype, 1, new Date(Ysh.Time.parseDate(this.sectiontime)))));
            MessageInst.postMessage({ eventType: 'menuope', menuname: 'setShowDate', selstate: 1, data: { operatedate: vv } });
            if (this.ystype) {
                var args = this.getDefaultArgs("statistics");
                this.changePlayerPage(args.s, args.p);
            } else {
                this.changePlayerPage(menuData.selectStationTypes, menuData.selectPlantTypes);
            }
            var caption = "";
            for (var i = 0; i < this.buttons.length; i++) {
                var btn = this.buttons[i];
                if (!btn.state)
                    continue;
                if (btn.canPlay) {
                    caption = btn.name;
                    this.playerSpeed = btn.speed || 2;
                }
            }
            if (caption) {
                this.boardcast.caption = [caption];
                this.players.push({ changeTime: function () { } });
            } else {
                this.playerSpeed = 2;
            }
        },
        closePlayer: function (id) {
            if (!id) {
                vMain.boardcast.caption.erase("电网规模");
            }
            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                if (player.id == id) {
                    this.players.splice(i, 1);
                    break;
                }
            }
            if (this.players.length > 0)
                return;
            if (!this.showPlayer)
                return;
            this.playerStep = 1;
            this.playerSpeed = 2;
            this.showPlayer = false;
            this.players = [];//清空播放内容
            this.$refs.player.pause();
            this.sectiontime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "d"));
            MessageInst.postMessage({ eventType: 'menuope', menuname: 'setShowDate', selstate: 0, data: {} });
            //this.changeSectionTime(Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "d")));
        },
        getPlayerInfo: function (s, p, info) {
            info.text = "电网规模";
            info.page = "";
            if (this.ystype) {
                if (s.length > 0) {
                    if (p.length > 0)
                        return;
                    if (s.length == 1)
                        info.text = s[0].text;
                    else
                        info.text = "变电规模";
                    info.page = "/html/sgc_play_station.html?bk=rgba(88,88,88,0.9)";
                    return;
                }
                if (p.length == 1)
                    info.text = p[0].text;
                else
                    info.text = "发电规模";
                info.page = "/html/sgc_play_plant.html?bk=rgba(88,88,88,0.9)";
                return;
            }
            if (s.length == 1) {
                if (p.length > 0)
                    return;
                info.text = s[0].text;
                info.page = "/html/sgc_play_station.html";
                return;
            }
            if (s > 0)
                return;
            if (p.length == 1) {
                info.text = p[0].text;
                info.page = "/html/sgc_play_plant.html";
            }
        },
        refreshPlayer_Boardcast: function (msg) {
            if (document.getElementById("frmPlayer"))
                document.getElementById("frmPlayer").contentWindow.postMessage({ type: "mapchanged", value: [this.minSectionTime, this.sectiontime] }, "*");
            if (!msg) {
                this.boardcast.content = "";
                return;
            }
            this.boardcast.content = msg.content;
        },
        changePlayerPage: function (s, p) {
            if (!this.showPlayer)
                return;
            if (this.players.length > 0) {//这个地方要改
                return;
            }
            var info = {};
            this.getPlayerInfo(s, p, info);
            this.boardcast.caption = [info.text];
            this.playPage = info.page;
            var msg = "";
            if (this.ystype) {
                SGCModel.refreshTime(this.sectiontime, this.refreshPlayer_Boardcast);
                return;
            }
            switch (info.page) {
                case "/html/sgc_play_station.html":
                    msg = SGCModel.refreshStation(info.text, this.sectiontime);
                    break;
                case "/html/sgc_play_plant.html":
                    msg = SGCModel.refreshPlant(info.text, this.sectiontime);
                    break;
            }
            if (document.getElementById("frmPlayer"))
                document.getElementById("frmPlayer").contentWindow.postMessage({ type: "mapchanged", value: [this.minSectionTime, this.sectiontime] }, "*");
            if (!msg) {
                this.boardcast.content = "";
                return;
            }
            this.boardcast.content = msg.content;
        },
        changeSectionType: function (t) {
            this.sectiontype = t;
            this.sectiontime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(Ysh.Time.parseDate(this.sectiontime)), t));
            this.maxSectionTime = Ysh.Time.toString(Ysh.Time.add(t, 0, Ysh.Time.getTimeStart(new Date(), t)));
            this.boardcast.assist = Ysh.Time.formatString(this.sectiontime, this.timeFormat);
            var o = this;
            if (!SGCModel.refreshTime(this.sectiontime, function (msg) {
                o.sendTimeChangedMsg();
                if (!msg) return;
                o.boardcast.content = o.playPage && (!o.hidePlayPage) ? msg.content : "";
            }))
                this.sendTimeChangedMsg();
        },
        quitSelectZone: function (force) {
            var state = topMenuBar.getMenu("selectzone").state;
            if ((state % 2 == 1) || force) {
                ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: "DrawRectObject", selstate: 0, data: { type: "polygon" } });
                if (state % 2 == 1)
                    topMenuBar.getMenu("selectzone").state = state - 1;
                //topMenuBar.lock(false);
            }
        },
        closeBusiness: function () {
            var idx = this.closePage(this.modelid);
            if (idx < 0) return;
            this.curfile = "";
            this.topHeight = 1;
            //this.showBusiness(false);
            $("#divBottomMenu").hide();
        },
        clearOtherButtons: function (item) {
            if (item.type != 2) {
                for (var i = 0; i < this.showButtons.length; i++) {
                    var btn = this.showButtons[i];
                    if ((btn == item) || (btn.id == item))
                        continue;
                    if (btn.state && btn.type && ((item == null) || (btn.type == item.type)/* || (item.type == 3)*/)) {
                        btn.state = 0;
                        btn.click();
                    }
                }
            }
            var canPlay = null;
            for (var i = 0; i < this.buttons.length; i++) {
                var btn = this.buttons[i];
                if (!btn.state)
                    continue;
                if (!btn.canPlay) {
                    canPlay = false;
                } else {
                    if (canPlay === null)
                        canPlay = true;
                    else
                        canPlay = false;
                }
            }
            topMenuBar.getMenu("play").state = canPlay ? 1 : 0;//注意更新时改回来
            if (!canPlay) {
                $("#divPlayer").hide();
                this.closePlayer();
            }
        },
        clickButton: function (item, module) {
            item.state = 1 - item.state;
            if (item.state) {
                //this.quitSelectZone();
                this.clearOtherButtons(item);
            }
            item.click(module);
            return;
            if ((item.state == 0) && (item.type == 2)) {
                if (this.leftWidth != 1) {
                    this.leftWidth = 1;
                    this.endSplit();
                }
                this.curfile = "";
                //this.topHeight = 1;
            }
        },
        changeButtonState: function (name) {
            var b = !this.buttonStates[name];
            Vue.set(this.buttonStates, name, b);
            return b;
        },
        showTingDian: function () {
            var b = this.changeButtonState("tingdian");
            ProjectSGC.Index.showTingDian(b);
            if (b) {
                vMain.showPage("tingdian", "停电监视", "sgc_tingdian");
            }
            else {
                this.showBusiness(false);
            }
        },
        showVoltageByTime: function (time) {
            Ysh.Refs.include(["/conn/jsfile/sgc/wgdy.js"], function () {
                vMain.legendContent = SGCWGDY.getLegendContent();
                vMain.legendBottom = "160px";
                SGCWGDY.displayVoltages_Jibei(time);
            });
        },
        showBusVoltageJibei: function (s) {
            if (s) {
                var player = {
                    id: "busvol",
                    _time: null,
                    _vols: "",
                    changeTime: function (time) {
                        if (this._time == time)
                            return;
                        this._time = time;
                        vMain.showVoltageByTime(time);
                    }
                };
                this.players.push(player);
                this.boardcast.caption = ["电压"];
                this.sectiontype = "mi";
                this.sectiontime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'mi'));
                this.minSectionTime = Ysh.Time.toString(Ysh.Time.add('d', -1, this.sectiontime));
                this.maxSectionTime = this.sectiontime;
                this.playerStep = 15;
                this.playerSpeed = 5;
                this.showPlayer = true;
                this.legendFilter = {
                    items: [{ selected: true, value: "500kV", text: "500" }, { selected: true, value: "220kV", text: "220" }, { selected: true, value: "110kV", text: "110" }, { selected: true, value: "35kV", text: "35" }],
                    click: function () {
                        var vols = [];
                        Ysh.Array.each(this.items, function (item) { if (item.selected) vols.push(item.value); });
                        SGCWGDY.filterVoltages(vols);
                        vMain.legendContent = SGCWGDY.getLegendContent();
                    }
                }
                player.changeTime(this.sectiontime);
            } else {
                this.closePlayer("busvol");
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: false });
                this.legendBottom = "";
                this.legendFilter = null;
                this.legendContent = [];
                SGCWGDY.vols = null;
            }
        },
        showBusVoltage: function (s, gridid) {
            //var legend = "/i/sgc/legend-busvol200820.png";
            if (s) {
                ModelList.require(["grid"], function () {
                    Ysh.Refs.include(["/conn/jsfile/sgc/wgdy_gd.js?v=1.20.1211.1"], function () {
                        SGCDebug.start("开始获取电压");
                        SGCWGDY.displayVoltages(gridid, function () {
                            //vMain.legendContent = SGCWGDY.getLegendContent();
                            //vMain.setLegend(legend, true);
                            var items = [];
                            for (var i = 0; i < SGCWGDY.all.length; i++) {
                                var v = SGCWGDY.all[i];
                                items.push({ selected: true, value: v, text: v.replace("kV", "") });
                            }
                            items = [{ selected: true, value: "750kV,500kV", text: "750-500" }, { selected: false, value: "500kV,330kV", text: "500-330" }, { selected: false, value: "220kV", text: "220" }]
                            if (SGCWGDY.selectedValue) {
                                Ysh.Array.each(items, function (item) { item.selected = (item.value == SGCWGDY.selectedValue); });
                            }
                            vMain.legendFilter = {
                                items: items,
                                needVoltage: true,
                                clickVoltageBase: function (item) {
                                    SGCWGDY.setBase(item.value);
                                },
                                clickVoltageType: function (item) {
                                    SGCWGDY.setType(item.value);
                                },
                                click: function (filter) {
                                    var vols = [];
                                    if (this.onlyone) {
                                        vols = filter.value.split(',');
                                        Ysh.Array.each(this.items, function (item) { if (item != filter) item.selected = false; });
                                    } else {
                                        Ysh.Array.each(this.items, function (item) { if (item.selected) vols.push(item.value); });
                                    }
                                    SGCWGDY.selectedValue = filter.value;
                                    SGCWGDY.filterVoltages(vols);
                                    //vMain.legendContent = SGCWGDY.getLegendContent();
                                }, onlyone: true
                            }
                            SGCDebug.start("显示电压结束");
                            SGCDebug.show();
                        }, "750kV,500kV");
                    });
                });
            } else {
                if (SGCWGDY)
                    SGCWGDY.clear();
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showBusvol", selstate: false, data: { type: "busvol" } });
                this.legendBottom = "";
                this.legendFilter = null;
                this.legendContent = [];
                SGCWGDY.selectedValue = "";
                SGCWGDY.vols = null;
                vMain.setLegend(SGCWGDY.legend, false);
            }
            this.legendTopRight = s;
        },
        showVoltage: function () {
            var b = this.changeButtonState("busvol");
            Ysh.Refs.include(["/conn/jsfile/sgc/wgdy.js"], function () {
                SGCWGDY.displayVoltages(b);
            });
            if (b) {
                //vMain.showPage("wgdy","无功电压","sgc_wgdy");
            }
        },
        showStationLoadRate: function () {
            var b = this.changeButtonState("stationlr");
            Ysh.Refs.include(["/conn/jsfile/sgc/loadrate.js"], function () {
                SGCLoadRate.displayStationRate(b);
            });
        },
        showLineLoadRate: function () {
            var b = this.changeButtonState("linelr");
            Ysh.Refs.include(["/conn/jsfile/sgc/loadrate.js"], function () {
                SGCLoadRate.displayLineLoadRate(b);
            });
        },
        clickApp: function (module, id, bClose) {
            for (var i = 0; i < this.buttons.length; i++) {
                var btn = this.buttons[i];
                if (btn.id == id) {
                    module.app = btn;
                    this.clickButton(btn, module, bClose);
                    this.$forceUpdate();
                }
            }
        },
        pageApp: function (module, page) {
            if (!module.app) {
                module.app = { state: 0 };
            }
            module.app.state = 1 - module.app.state;
            this.quitSelectZone();
            this.clearOtherButtons({ type: 2 });
            this.changePage("unknown", module.getText(), page);
            if (module.app.state == 0) {
                if (this.leftWidth != 1) {
                    this.leftWidth = 1;
                    this.endSplit();
                }
                this.topHeight = 1;
            }
        },
        getApp: function (id) {
            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i].id == id)
                    return this.buttons[i];
            }
            return null;

        },
        watchOpenWindows: function () {
            var ws = this.windows;
            if (ws.length == 0)
                return;
            try {
                for (var i = ws.length - 1; i >= 0; i--) {
                    var w = ws[i];
                    if (w[1].closed) {
                        var btn = this.getApp(w[0]);
                        if (btn) btn.state = 0;
                    }
                }
            } catch (e) {

            }
            window.setTimeout(vMain.watchOpenWindows, 500);
        },
        gotoApp: function (id, arg) {
            var app = this.getApp(id);
            if (app) {
                if (app.go) {
                    try {
                        app.go(arg);
                    } catch (E) {
                        alert(app.name + "参数错误");
                    }

                } else if (!arg) {
                    this.clickButton(app, null);
                }
            }
        },
        selectBsGrid: function (event) {
            var div = $("#divCity");
            div.css({ "left": $("#imgBsGrid").offset().left, "top": $("#imgBsBar").height() }).show();
        },
        selectBsVoltage: function (event) {
            //var div = $("#divVoltage");
            //div.css({ "left": $("#imgBsVoltage").offset().left, "top": $("#imgBsBar").height() }).show();
            var menu = topMenuBar.getMenu("lock");
            if (menu.click())
                return;
            var div = $("#divShowingMenu");
            showingMenu.current = "lock";
            showingMenu.show = true;
            showingMenu.item = menu;
            showingMenu.$nextTick(function () {
                div.css({ "left": $("#imgBsVoltage").offset().left, "top": $("#imgBsBar").height() });
            });
        },
        inBsVoltage: function () {
            this.stopTriggerBs();
            var menu = topMenuBar.getMenu("lock");
            //if (!menu.state) return;
            if (showingMenu.show && showingMenu.current == "lock")
                return;
            var div = $("#divShowingMenu");
            showingMenu.current = "lock";
            showingMenu.show = true;
            showingMenu.item = menu;
            showingMenu.$nextTick(function () {
                div.css({ "left": $("#imgBsVoltage").offset().left, "top": $("#imgBsBar").height() });
            });
        },
        stopTriggerBs: function () {
            this.hideBs = false;
        },
        triggerBs: function (b) {
            if (b === true) {
                this.hideBs = true;
                window.setTimeout(function () {
                    if (!vMain.hideBs) return;
                    $(".bsBtn").hide();
                    $("#divCity").hide();
                    showingMenu.show = false;
                    $("#divStationFilter").hide();
                    MapOpeInst.postMessage({ eventType: "menuope", menuname: "hideRightButtons", selstate: false });
                    $("#bsTrigger").show();
                }, 2000);
            } else {
                $(".bsBtn").show();
                MapOpeInst.postMessage({ eventType: "menuope", menuname: "hideRightButtons", selstate: true });
                $("#bsTrigger").hide();
            }
        },
        selectBsSettings: function () {
            stationFilter.isNeed[2] = true;
            stationFilter.isNeed[5] = true;
            stationFilter.isNeed[6] = true;
            stationFilter.isNeed[7] = false;
            stationFilter.$forceUpdate();
            var div = $("#divStationFilter");
            div.show();
            div.css({ "left": $("#imgBsSettings").offset().left, "top": $("#imgBsBar").height() }).show();

            return;
            var div = $("#divShowingMenu");
            showingMenu.current = "lock";
            showingMenu.show = true;
            showingMenu.item = menu;
            showingMenu.$nextTick(function () {
                div.css({ "left": $("#imgBsVoltage").offset().left, "top": $("#imgBsBar").height() });
            });
        },
        changeChaoliuType: function (n) {
            if (this.chaoliuType == n) return;
            this.chaoliuType = n;
            if (n == 0) {
                vMain.closePlayer("chaoliu");
                vMain.boardcast.caption.erase("潮流");
                vMain.caption = "";
                vMain.assist = "";
                SGCChaoliu._time = "";
                SGCChaoliu.start();
            } else {
                var player = {
                    id: "chaoliu",
                    changeTime: function (time) {
                        SGCChaoliu._time = time;
                        SGCChaoliu.start();
                    }
                }
                var now = new Date();
                vMain.players.push(player);
                vMain.boardcast.caption.push("潮流");
                vMain.sectiontype = "mi";
                var start = AppHelper.resetBaseTime(Ysh.Time.add("hh", -2, now), "mi", 1);
                vMain.minSectionTime = Ysh.Time.toString(start);
                vMain.maxSectionTime = Ysh.Time.toString(now)//lastTime;
                vMain.sectiontime = Ysh.Time.getTime("hh,hh,-1");
                vMain.now = now;
                vMain.playerSpeed = 2;
                vMain.playerStep = 1;
                vMain.showPlayer = true;
                player.changeTime(vMain.sectiontime);
            }
            SGCChaoliu.start();
        }
    },
    watch: {
        input: function () {
            var answers = [];
            if (this.input.length > 0) {
                if (this.input.endsWith(" "))
                    return;
                var vm = this;

                ajaxE("GetCountByText", "json", { "strInfo": this.input }, function (data) {
                    if (data == null)
                        return;
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var name = item.type;
                        answers.push({ name: name, type: item.type, count: item.count });
                    }
                    vm.answers = answers;
                    vm.showAnswer();
                });
            } else {
                this.answers = answers;
                this.showAnswer();
            }
        },
        leftWidth: function () {
            if ((this.leftWidth != 1) && (this.leftWidth != 0)) {
                this.leftWidth0 = this.leftWidth;
                Ysh.Cookie.set("map_size", this.leftWidth);
            }
            //this.endSplit();
        },
        ystype: function () {
            this.closePlayer();
        },
        forecastMsg: function () {
            if (!this.forecastMsg) return;
            if (this.lastForeLegend)
                this.setLegend(this.lastForeLegend, false);
            this.lastForeLegend = "/WeatherData/" + this.forecastMsg + "/legend.png?v=" + new Date().getTime();
            this.lastForeLegend = { url: this.lastForeLegend, styles: { height: "160px" } };
            this.setLegend(this.lastForeLegend, true);
            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: true, data: { type: "forecast", ctype: this.forecastMsg } });
        },
        forecastupdate: function () {
            if (!this.forecastMsg) return;
            MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: true, data: { type: "forecast", ctype: this.forecastMsg } });
        }
    },
    created: function () {
        var _this = this;
        this.isPlayerEnable = function (time) {
            if (_this.players.length == 0) return true;
            time = Ysh.Time.toString(time);
            for (var i = 0; i < _this.players.length; i++) {
                var times = _this.players[i].times;
                if (!times)
                    return true;
                if (times.indexOf(time) >= 0)
                    return true;
            }
            return false;
        }
        this.changeSectionType(this.sectiontype);
        this.players = [];
        for (var i = 0; i < this.realbuttons.length; i++) {
            var btn = this.realbuttons[i];
            btn.showBaobiao = false;
            btn.in = function () {
                if (!this.page) return;
                if (!this.showBaobiao) {
                    this.showBaobiao = true;
                    vMain.$forceUpdate();
                }
            }
            btn.out = function () {
                if (this.showBaobiao) {
                    this.showBaobiao = false;
                    vMain.$forceUpdate();
                }
            }
            if (!btn.click)
                btn.click = function () {
                    this.state = 1 - this.state;
                    if (this.state == 0) {
                        this.hide();
                        vMain.closePage(this.modelid || this.id);
                    } else {
                        this.show();
                    }
                    if (this.legend)
                        vMain.setLegend(this.legend, this.state != 0);
                }
            if (!btn.getImage)
                btn.getImage = function () {
                    return this.state ? this.img.replace(".png", "_selected.png") : this.img;
                };
            if (!btn.receive)
                btn.receive = function (msg) {
                    if (!msg) return;
                    if (msg.type != "mapchanged") return;
                    if (this.pgid == ProjectSGC.Global.getGrid())
                        return;
                    this.show(true);
                }
            if (!btn.showReport)
                btn.showReport = function () {
                    if (this.page) {
                        vMain.changePage(this.modelid || this.id, this.name, this.page, this.args || { real: 1 });
                    }
                }
        }
    },
    mounted: function () {
        this.clickTab();
        Ysh.Object.addHandle(menuData, "tellBusiness", function () {
            vMain.changePlayerPage(this.selectStationTypes, this.selectPlantTypes);
        });
        window.setTimeout(function () {
            SGCDB.init();
        }, 5000);
        window.setTimeout(function () {
            vMain.init();
        }, 10000);
    }
});

var vmSearchInput = vMain;

bottomMemu = vMain.$refs.bottomMenu;

var vFloat = new Vue({
    el: "#divFloatData1",
    data: {
        top: 0,
        left: 0,
        content: [],
        fGetConent: null,
        floatCss: {},
        index: 0,
        show: false,
        backWnd: null,
        caption: "",
        list: [],
        type: "",
        file: ""
    },
    computed: {
        tabs: function () {
            var arr = [];
            for (var i = 0; i < this.content.length; i++)
                arr.push([i, i + 1]);
            return arr;
        },
        isFile: function () {
            return this.type == "file";
        }
    },
    methods: {
        clickTab: function () {
            this.refresh();
        },
        resetPosition: function () {
            var $wnd = $(this.$el);
            //if (!this.backWnd) {
            this.floatCss = { top: (this.top - $wnd.height()) + "px", left: (this.left - $wnd.width() / 2) + "px", bottom: "" };
            //} else {
            //    var h = $(this.backWnd).height();
            //    this.floatCss = { bottom: (h - this.top) + "px", left: (this.left - $wnd.width() / 2) + "px", top: "" };
            //}
        },
        refresh: function () {
            if (this.index >= this.content.length) return;
            if (this.isFile) {
                this.args = { args: this.content[this.index] };
                return;
            }
            var vm = this;
            this.fGetConent(this.content[this.index], function (content) {
                vm.caption = content.caption;
                vm.list = content.list;
                vm.$nextTick(function () {
                    this.resize();
                    this.resetPosition();
                });
            });
        }
    }
});

function onAudioing() {
    //$("#divContent").append($(".RDiv").children().clone()).show();
    $("#divContent").prepend($(".RDiv").children().clone()).show();
    var $robotReply = getRecentReply();
    $robotReply.find(".RSayContent").html("正在查询...");
}
function onAudioReset() {
    wndAudio.postMessage('reload', '*');
}
function onAudioOk(data) {
    var $robotReply = getRecentReply();
    $robotReply.find(".RSayContent").html(data);
    $('#divContent').scrollTop($('#divContent')[0].scrollHeight).show();
    //frmAudio.location.reload();
}
$(document).ready(function () {
    var dwidth = window.innerHeight;
    $(".bottom").height(dwidth - 87);
    $("#divContent").css({ "height": dwidth - 178 });
    $("#input_info").css("width", $("#divBottom")[0].clientWidth - 120);
    $("#divSearchInput").show();
    vMain.resize();
    Ysh.Web.Event.attachEvent(window, "onresize", function () { vMain.resize(); })
    Ysh.Web.Event.attachEvent(document, "onkeydown", function () {
        if (!event) return;
        if (parent)
            parent.contentWindow.postMessage({ type: "keydown", keyCode: event.keyCode }, '*');
    });
});
$(window).on("resize", function () {
    var dwidth = window.innerHeight;
    $(".bottom").height(dwidth - 87);
    $("#divContent").css({ "height": dwidth - 178 });
    $("#input_info").css("width", $("#divBottom")[0].clientWidth - 120);
});
function addQueryResult() {
    var html = event.data.result.replace(/(^\s*)|(\s*$)/g, "");
    if (html != "") {
        var jqContent = $("#divContent");
        jqContent.append($(".RDiv").children().clone()).show();
        var $last = jqContent.find(".divRobotSay:last");
        $last.find(".RSayContent").html(html);
        jqContent.scrollTop(jqContent[0].scrollHeight)
    }
}
var sectionid = "";

function ajaxE(method, dt, qData, fDo) {
    $.ajax({
        url: "/Common/" + method,
        type: "post",
        dataType: dt,
        data: qData,
        error: function (data) {
            alert("网络超时，请稍后再试");
        },
        success: function (data) {
            fDo(data);
        }
    });
}
var callbackData = null;
var sectionRelaType = "text";
var sectionRelaId = "";
function onCallBack(id) {
    closePanel();
    if (callbackData == null)
        callbackData = { type: "YuAn", inputtype: "text", "id": "" };
    callbackData.sectionid = id;
    workerCzp.postMessage(callbackData);
}
function getAllSection() {
    ajaxE("GetAllSectionList", "html", null, function (data) {
        //Ysh.Web.dialog("获取全部断面", data);
        var $robotReply = getRecentReply();
        $robotReply.find(".RSayContent").text("正在搜索");
        if (data) {
            $robotReply.find(".RSayContent").html(data);
        }
        else {
            $robotReply.find(".RSayContent").html("未搜索到相关信息！");
        }
        $('#divContent').scrollTop($('#divContent')[0].scrollHeight).show();
    });
}
function sectionSetting(sectionid) {//设置断面
    var type = "";
    if (callbackData != null)
        type = callbackData.type;
    if (document.getElementById("iframeGraph"))
        document.getElementById("iframeGraph").contentWindow.postMessage(sectionid, '*');
    if (document.getElementById("iframeStationGraph"))
        document.getElementById("iframeStationGraph").contentWindow.postMessage(sectionid, '*');
    showPanel("/p.aspx?f=TableDataShow&sectionid=" + sectionid + "&type=" + type + "&a=" + new Date());
}
function doCreateSection(obj, bIsTime, id) {//根据选择创建断面
    /*if (bIsTime) {
        ajaxE("CreateSectionByTime","json", { time: id }, function (data) { Ysh.Web.getParent(obj, "DIV").style.display = "none"; sectionSetting(data.id); });
    } else {
        ajaxE("CreateSection", "json", { templateid: id }, function (data) { Ysh.Web.getParent(obj, "DIV").style.display = "none"; sectionSetting(data.id); });
    }*/
    if (bIsTime)
        id = id.value + ":00";
    ajaxE("CreateSection", "json", { istime: bIsTime, data: id, relatype: sectionRelaType, relaid: sectionRelaId }, function (data) {
        Ysh.Web.getParent(obj, "DIV").innerHTML = "已创建断面，<a href='#' onclick='sectionSetting(\"" + data.id + "\");return false;'>继续调整</a>";
        sectionSetting(data.id);
    });
}
function createOrFixSection(d) {
    callbackData = d;
    sectionRelaType = d.inputtype;
    sectionRelaId = d.id;
    ajaxE("GetSectionId", "json", { "type": d.inputtype, "id": d.id }, function (data) {
        if (data == null) {
            alert("获取信息失败");
            return;
        }
        if (data.id == 0) {//还没有断面
            getAllSection();
        } else {
            //callback({ sectionid: data.id });
            sectionSetting(data.id);
        }
    });
    return false;
}

function showSection() {
    var bFlag = document.getElementById('rdoSection').checked;
    var tab = document.getElementById("tabSection");
    var dt = document.getElementById("trTime");
    var a = document.getElementById("trA");
    if (tab) {
        if (bFlag) {
            tab.style.display = "";
            dt.style.display = "none";
            a.style.display = "none";
        }
        else {
            tab.style.display = "none";
            dt.style.display = "";
            a.style.display = "";
        }
    }
}
window.addEventListener('message', function (event) {
    if (!event.data)
        return;
    if (MessageInst)
        MessageInst.receive(event);
    if (vMain) {
        Ysh.Array.each(vMain.floatPages, function (p) {
            if (p.receive) {
                p.receive(event);
                return;
            }
            if (!p.$children) return;
            var _vm = p.$children[0];
            if (!_vm) return;
            if (!_vm.receive) return;
            _vm.receive(event);
        });
    }
    if (event.data.funName)
        vMain.gotoApp(event.data.funName, event.data.arg);
});
var wndAudio = null;
window.onload = function () {
    //获取robot回答
    $("#divContent").append($(".RDiv").children().clone());
    var $robotReply = $("#divContent").find(".divRobotSay:last");
    $robotReply.find(".RSayContent").html($(".robotSayCase>.typeOne").html());

    if (login.mode != "bigscreen")
        return;
    var w = window.innerWidth;
    var h = 4 * w * 56 / 6213.0;
    var jq = $("#bsSelectedCity");
    jq.css({ "height": h * 0.8, "font-size": Math.max(w * 0.0125, 14) + "px" });
    vMain.triggerBs(true);
    //jq.css({ "top": ((h - jq.height()) / 2) + "px" });
}
window.onunload = function () {
    topMenuInst.closeAudio();
}
//录音
$("#btnRadio").mousedown(function () {
    var noAudio = true;
    if (wndAudio != null)
        noAudio = wndAudio.closed;
    if (noAudio) {
        if (!confirm("因为浏览器安全限制，\n语音数据只能通过https方式加密传输，\n必须开启一个https页面"))
            return;
        wndAudio = window.open(urlConfig.audioUrl, "audio");
        return;
    }
    if ($(this).hasClass("protected")) {
    }
    $(this)[0].src = "/i/talking.gif";
    //$("#startAudio").trigger("click", []);
    wndAudio.postMessage('startRecording', '*');
}).mouseup(function () {
    wndAudio.postMessage('stopRecording', '*');
    wndAudio.postMessage('stopRecording', '*');
    wndAudio.postMessage('uploadAudio', '*');
    //$("#stopAudio").trigger("click", []);
    //$("#stopAudio").trigger("click", []);
    //$("#submitAudio").trigger("click", []);
    $(this)[0].src = "/img/u36.png";
    SearchCommon.CloseSearch();
});
//发送文字请求
$("#enterT").on("click", function () {
    submitAskInfo();
});
$("#input_info").keyup(function (event) {
    if (event.ctrlKey && event.keyCode == 13)
        $("#imgSearch").click();
    else if (event.keyCode == 13) {
        submitAskInfo();
        SearchCommon.CloseSearch();
    }
    else
        return true;
});
function doSearch(o) {
    $("#input_info").val((o.innerText || o.value) + "呢");
    submitAskInfo(false);
}
AskInst.askText = function (s) {
    $("#input_info").val(s);
    submitAskInfo(false);

}
function isAccur(str) {
    return (str.startsWith("'") || str.startsWith('"') || str.startsWith('‘') || str.startsWith('“'))
        && (str.endsWith("'") || str.endsWith('"') || str.endsWith('’') || str.endsWith('”'));
}

function doAsk(questionInfo, rows, obj, bNext) {
    var bFuzzy = false;
    if (questionInfo.length > 2) {
        if (isAccur(questionInfo)) {
            questionInfo = questionInfo.substr(1, questionInfo.length - 2);
            bFuzzy = true;
        }
    }
    if (bFuzzy) {
        var arr = questionInfo.split(' ');
        arr[0] += "*";
        questionInfo = arr.join(' ');
    }
    var f = null;
    if (obj) {
        f = function () {
            var p = $(obj);
            if (bNext) {
                return p.parent().parent().find(".askTablePart:first")
            } else {
                do {
                    p = p.parent();
                    if (p.hasClass("RSayContent"))
                        return p;
                } while (p != null)
            }
            return p;
        }
    } else {
        f = function () { return $robotReply.find(".RSayContent"); }
    }
    var $robotReply = getRecentReply();
    AskInst.ask(questionInfo, f, function () {
        if (!obj)
            //$('#divContent').scrollTop($('#divContent')[0].scrollHeight);
            $('#divContent').scrollTop(0);
    });
    return;
}

function getRecentReply() {
    return $("#divContent").find(".divRobotSay:first");
}

function showAsk(questionInfo, rows, bOther) {
    if (!bOther) {
        var jq = emptyInputInfo();
        //获取robot回答
        //$("#divContent").append();
        jq.after($(".RDiv").children().clone());
    } else {
        console.log(questionInfo);
        var jq = emptyInputInfo(questionInfo);
        //获取robot回答
        //$("#divContent").append();
        jq.after($(".RDiv").children().clone());
    }
    var $robotReply = getRecentReply();
    $robotReply.find(".RSayContent").text("正在搜索");

    window.setTimeout(function () {
        doAsk(questionInfo, rows);
    }, 10);
}

var submitAskInfo = function () {
    if ($("#input_info").val() == "")
        return;
    var questionInfo = $("#input_info").val();
    if (questionInfo == "登录") {
        showPanel("/SubLogin.aspx");
        return;
    }
    if (questionInfo == "生成预案") {
        callbackData = null;
        sectionRelaType = "text";
        sectionRelaId = "";
        getAllSection();
        return;
    }
    if (questionInfo == "故障集设置") {
        showPanel("/p.aspx?f=DeviceFaultList&a=" + new Date());
        return;
    }
    if (questionInfo == "重要设备设置") {
        showPanel("/p.aspx?f=ImportantDevice&a=" + new Date());
        return;
    }
    if (questionInfo == "断面设置") {
        showPanel("/p.aspx?f=DeviceSectionList&a=" + new Date());
        return;
    }
    if (questionInfo == "工作断面") {
        showPanel("/p.aspx?f=showSection&a=" + new Date());
        return;
    }
    if (questionInfo == "高风险设备") {
        SearchCommon.SpecialLocation(null, 6);
        emptyInputInfo();
        return;
    }
    if (questionInfo == "正在检修的设备") {
        emptyInputInfo();
        SearchCommon.SpecialLocation(null, 5);
        return;
    }
    if (questionInfo == "负载") {
        addAnswerHTML("<a target='_blank' href='http://graph.dcloud.sd.dc.sgcc.com.cn/osp/datamining/loadrate/index.html' style='color:blue;text-decoration:underline;'>打开负载详情</a>");
        return;
    }
    if (questionInfo == "无功") {
        addAnswerHTML("<a target='_blank' href='http://graph.dcloud.sd.dc.sgcc.com.cn/osp/wgdyzhfx/VoltageAnalysis.html' style='color:blue;text-decoration:underline;'>打开无功详情</a>");
        return;
    }
    if (questionInfo == "大数据系统") {
        addAnswerHTML("<a target='_blank' href='http://10.37.8.40:8080/Default.aspx?login=5648468D778728E93A83E312998DC9BF&token=A66D911888DE6ABB6F366D9704F31CD0' style='color:blue;text-decoration:underline;'>打开大数据系统</a>");
        return;
    }

    showAsk(questionInfo, 10);
}

var emptyInputInfo = function (msg) {
    $("#divContent").show();
    //添加提问者文本
    var jq = $(".ADiv").children().clone();
    $("#divContent").prepend(jq);
    $("#divContent").find(".LSayContent:first").text(msg || $("#input_info").val());
    $("#input_info").val("");
    return jq;
}

var addAnswerHTML = function (html) {
    SearchCommon.CloseSearch();
    $("#divContent").show();
    var jq = emptyInputInfo();
    jq.after($(".RDiv").children().clone());
    var $robotReply = getRecentReply();
    $robotReply.find(".RSayContent").html(html);
    $('#divContent').scrollTop(0);
}

var addNoQuestionHTML = function (html) {
    SearchCommon.CloseSearch();
    $("#divContent").show();
    $("#divContentClose").show();
    SearchCommon.showContentCloseImage();
    var jq = $(".RDiv").children().clone();
    $("#divContent").prepend(jq);
    var $robotReply = getRecentReply();
    $robotReply.find(".RSayContent").html(html);
    $('#divContent').scrollTop(0);
}

var timeKey = function (val) {
    return 'fibonacci(' + val + ')';
};

var OpenLocationStation = function (command, name, text) {
    if (command == "定位") {
        var jq = emptyInputInfo("定位" + text);
        jq.after($(".RDiv").children().clone());
        MessageInst.locate(ProjectSGC.Meta.getTypeById(name), name);
        window.setTimeout(function () {
            onAudioOk("<div>定位成功</div>");
        }, 500);
    } //测试打开厂站图
    else if (command == "打开") {
        var jq = emptyInputInfo("打开" + text);
        jq.after($(".RDiv").children().clone());
        //console.log(name);
        //$("#iframeGraph").hide();
        //console.log($("#iframeGraph").length);
        //$("#iframeStationGraph").show().prop("src", stationUrl + name);
        window.setTimeout(function () {
            onAudioOk("<div>打开成功</div>");
        }, 500);
        cardUrlInst.display({ card: "jxtcard", args: { type: "SG_CON_" + ProjectSGC.Meta.getTypeById(name) + "_B", id: name } });
    }
}
var time = 0;
var operateChaoliutu = function (command, name) {
    var id = parseInt(Math.random() * 10);
    time++;
    if (time % 2 == 0) {
        id = 10;
    }
    $("#iframeGraph")[0].contentWindow.operateChaoliu(id);
    //alert(name);
}

function showCzp(id) {
    showPanel("/p.aspx?f=tickinfo&tickid=" + id, "600px", "500px");
}
function showJianxiu(id) {
    showPanel("/p.aspx?f=ShowJXData&jxid=" + id, "600px", "500px");
}
function showYuan(id) {
    showPanel("/p.aspx?f=TableDataShow&yaid=" + id);
}
function doAudio(w) {
    if (w == "") return;
    //document.getElementById("bgss").src = "audio.aspx?w=" + escape(w);
    //document.getElementById("pBg").innerHTML = '<embed src="audio.aspx?w=' + escape(w) + '" autostart="true"></embed>';
    //document.getElementById("pBg").innerHTML = '<audio id="bgss" src="audio.aspx?w=' + escape(w) + '" autoplay="true"></audio>';
    //"audio.aspx?w=" + escape(w);
}
function GoBackChaoLiu() {
    document.getElementById("iframeStationGraph").style.display = "none";
    document.getElementById("iframeGraph").style.display = "";
}

Ysh.Object.addHandle(SelectCityInst, "tellYuntu", function () {
    vMain.loading = false;
    var msgid = Ysh.Request.get("msgid");
    if (!msgid)
        return;
    PDP.read("MSG", "sgc/pushmsg:GetMapMsgById", [msgid], function (data) {
        if (!data.isOK)
            return;
        data = data.value;
        if (data.length == 0)
            return;
        var info = JSON.parse(data[0][0]);
        //根据推送截图
        switch (info.TYPE) {
            case "weather":
                //this.map.menu("setWeatherHide", true, { time: info.time, warnType: "weather" }, { cutImg: { id: id, state: true, width: 800, height: 800 } });
                PDP.read("MSG", "sgc/pushmsg:GetBadWeather", [info.TIME, info.DATA_TYPE || 1], function (data) {
                    if (!data.isOK) {
                        return;
                    }
                    data = data.value;
                    if (data.length == 0) {
                        return;
                    }
                    var infos = [];
                    var icons = [];
                    var fGetIcon = function (t) {
                        switch (t) {
                            case "1": return "/i/sgc/icon/weather/gaowen.png";
                            case "2": return "/i/sgc/icon/weather/diwen.png";
                            case "3": return "/i/sgc/icon/weather/dafeng.png";
                            case "4": return "/i/sgc/icon/weather/baoyu.png";
                        }
                    }
                    Ysh.Array.each(data, function (row) {
                        var lon = row[0];
                        var lat = row[1];
                        var icon = fGetIcon(row[2].toString());
                        var idx = icons.indexOf(icon);
                        if (idx < 0) {
                            icons.push(icon);
                            infos.push([]);
                            idx = icons.length - 1;
                        }
                        infos[idx].push({ longitude: lon, latitude: lat, data: { data: row } });
                    });
                    var type = "weather";
                    MapOpeInst.menu("showImageIcon", false, { type: type });
                    for (var i = 0; i < icons.length; i++)
                        MapOpeInst.menu("showImageIcon", true, { type: type, images: { imgCode: 0, imgUrl: icons[i] }, locateData: infos[i] });
                });
                return true;
            default:
                return false;
        }
    });
});

var vSelectZone = new Vue({
    el: "#divSelectZoneButtons",
    data: {
        show: false,
        pos: [0, 0],
        info: null,
        s: "",
        l: "",
        buttons: [{ id: "stat", name: "统计", img: "/i/sgc/mapstat.png", click: function (vm) { vm.doStatistics() } }]
    },
    computed: {
        styleObject: function () {
            return {
                top: (this.pos[1] + 48) + "px",
                left: (this.pos[0] - 30) + "px"
            }
        }
    },
    methods: {
        doStatistics: function () {
            var data = this.info;
            var stations = [];
            var lines = [];
            if (data.station) {
                Ysh.Array.each(data.station, function (s) { stations.push(s.id); })
            }
            if (data.line)
                Ysh.Array.each(data.line, function (l) { lines.push(l.lineItemId); });
            if (vMain.selectzone) {
                vMain.selectzone.img = "/i/sgc/module/selectzone.png";
                vMain.getApp("selectzone").state = 0;
            }
            topMenuBar.getMenu("selectzone").state = 0;
            this.s = stations.join();
            this.l = lines.join();
            vMain.showPage("zonestatistics", "区域选择", "sgc_zonestatistics", { s: stations.join(), l: lines.join() });
        },
        receive: function (data) {
            this.show = (data.show == 1);
            if (this.show) {
                this.info = data;
                this.pos = [data.mousePosition.x, data.mousePosition.y];
            }
        },
        reset: function (data) {
            this.pos = [data.mousePosition.x, data.mousePosition.y];
        },
        click: function (button) {
            if (button.click)
                button.click(this);
        }
    }
});

var vSelectedGrid = new Vue({
    el: "#divSelectedGrid",
    data: {
        grids: [{ ID: "0101990100", Name: "国家电网" }],
        lastSelected: null,
        show: false,
        stopHide: false
    },
    computed: {
        boxStyle: function () {
            return { width: (96 * this.grids.length + 40) + 'px' };
        },
        showSelected: function () {
            return this.show;// this.grids.length > 0;
        }
    },
    methods: {
        getItemStyle: function (grid) {
            var selected = grid.ID == SelectCityInst.locateid;
            return { 'color': (selected ? '#66d7f8' : '#2791a1'), 'background-image': 'url(/i/sgc/bs/' + (selected ? 'btn_selected' : 'btn') + '.png?v=1.21.315.1)', width: '86px', height: '36px', 'line-height': '36px' };
        },
        addGrid: function (city) {
            this.grids.push(city);
            this.$forceUpdate();
        },
        delGrid: function (city) {
            this.grids.erase(city);
            this.$forceUpdate();
        },
        clickStateGrid: function () {
            SelectCityInst.setCityTitle(ProjectSGC.Const.GRID_GD, "国家电网");
            SelectCityInst.locate(ProjectSGC.Const.GRID_GD);
        },
        clickGrid: function (grid) {
            if (grid.ID == SelectCityInst.locateid) return;
            SelectCityInst.setCityTitle(grid.ID, grid.Name);
            SelectCityInst.locate(grid.ID);
            this.$forceUpdate();
        },
        hide: function () {
            if (this.stopHide)
                return;
            this.show = false;
        },
        showSelect: function (bDelayHide) {
            this.show = true;
            if (bDelayHide)
                this.hideSelect(5000);
        },
        hideSelect: function (n) {
            var _this = this;
            this.stopHide = false;
            window.setTimeout(function () { _this.hide(); }, n || 2000);
        }
    },
});

Vue.component("owgsports", {
    data: function () {
        return {};
    },
    props: ["sports"],
    computed: {
        datalist: function () {
            var sports = this.sports;
            var o = {};
            for (var i = 0; i < sports.length; i++) {
                var row = sports[i];
                var sport = row[1];
                if (!o[sport])
                    o[sport] = { url: this.getImgUrl(sport), rows: [], css: { } };
                o[sport].rows.push(row);
            }
            var ret = [];
            for (var k in o)
                ret.push(o[k]);
            if (ret.length == 1) {
                ret[0].css.height = "20px";
                return ret;
            }
            for (var i = 0; i < ret.length; i++) {
                ret[i].css.width = "10px"
            }
            return ret;
        }
    },
    methods: {
        getImg: function (name) {
            switch (name) {
                case "冰壶":
                    return "match/binghu2.png";
                case "轮椅冰壶":
                    return "camatch/binghu2.png";
                case "冬季两项":
                    return "match/dongjiliangxiang2.png";
                case "残奥冬季两项":
                    return "camatch/dongjiliangxiang2.png";
                case "冰球":
                    return "match/bingqiu2.png";
                case "残奥冰球":
                    return "camatch/bingqiu2.png";
                case "北欧两项":
                    return "match/beiouliangxiang2.png";
                case "单板滑雪":
                    return "match/danbanhuaxue2.png";
                case "残奥单板滑雪":
                    return "camatch/danbanhuaxue2.png";
                case "短道速滑":
                    return "match/duandaosuhua2.png";
                case "自由式滑雪":
                    return "match/ziyoushihuaxue2.png";
                case "花样滑冰":
                    return "match/huayanghuabing2.png";
                case "越野滑雪":
                    return "match/yueyehuaxue2.png";
                case "残奥越野滑雪":
                    return "camatch/yueyehuaxue2.png";
                case "跳台滑雪":
                    return "match/tiaotaihuaxue2.png";
                case "速度滑冰":
                    return "match/suduhuabing2.png";
                case "钢架雪车":
                    return "match/gangjiaxueche2.png";
                case "雪橇":
                    return "match/xueqiao2.png";
                case "雪车":
                    return "match/xueche2.png";
                case "高山滑雪":
                    return "match/gaoshanhuaxue2.png";
                case "残奥高山滑雪":
                    return "camatch/gaoshanhuaxue2.png";
                case "开幕式":
                case "闭幕式":
                    return "match/start_end.png";
            }
        },
        getImgUrl: function (name) {
            var img = this.getImg(name);
            return owg.imgPath + img;
        },
        getTime: function (time) {
            if (!time) return "";
            var arr = time.split(' ');
            return arr[1] || "";
        }
    },
    template: "#template_match_item"
});

var hideMenu = Ysh.Request.get("hidemenu");
var owgMain = new Vue({
    el: "#divOwgMain",
    data: {
        menus: [
            { id: "main",img:"mainaj", name: "主界面", w: 170, css: {"margin-right":"-20px","margin-left":"50px"} },
            { id: "path", name: "供电场馆路径", w: 170, css: { "margin-right": "-20px" } },
            { id: "green", name: "绿色电力供应", w: 170, css: { "margin-right": "-20px" } },
            { id: "emergency", name: "应急保障", w: 170, css: { "margin-right": "-20px" } },
            //{ id: "match", name: "赛程", w: 170, css: { "margin-right": "-20px" } },
            { id: "weather", name: "天气", w: 170, css: { "margin-right": "0" } },
            { id: "scene", img:"sceneaj", isBtn: false, name: "保电主题", w: 93, css: { position: "absolute", right: "50px", top: "50px" } },
            { id: "back", name: "返回", w: 40, css: { position: "absolute", right: "10px", top: "10px" } }
        ],
        mid: "",
        strGym: `[
            { pos: [112.515025, 40.125487], pos0: [109.695275, 41.891029], pos1: [138, 38], name: "国家高山滑雪中心", img: "gaoshanhuaxue" },
            { pos: [112.515025, 40.125487], pos0: [109.695275, 41.891029], pos1: [138, 38], name: "国家速滑馆", img: "guojiasuhua" },
            { pos: [112.515025, 40.125487], pos0: [109.695275, 41.891029], pos1: [138, 38], name: "国家体育馆", img: "guojiatiyu" },
            { pos: [112.515025, 40.125487], pos0: [109.695275, 41.891029], pos1: [138, 38], name: "国家游泳中心", img: "guojiayouyong" },
            { pos: [112.515025, 40.125487], pos0: [109.695275, 41.891029], pos1: [138, 38], name: "首都体育馆", img: "shoudu" },
            { pos: [112.515025, 40.125487], pos0: [109.695275, 41.891029], pos1: [138, 38], name: "首钢滑雪大跳台", img: "shougang" },
            { pos: [112.515025, 40.125487], pos0: [109.695275, 41.891029], pos1: [138, 38], name: "五棵松体育馆", img: "wukesong" },
            { pos: [112.515025, 40.125487], pos0: [109.695275, 41.891029], pos1: [138, 38], name: "国家雪车雪橇中心", img: "xuechexueqiao" },
        ]`,
        strCity: `[
                { pos: [112.515025, 40.125487], pos_c: [112.515025, 40.125487], pos0: [107.508341, 42.690565], pos1: [107.508341, 42.690565], img: "yanqing", name: "延庆赛区", isSmall: true },
                { pos: [112.515025, 40.125487], pos_c: [112.515025, 40.125487], pos0: [107.508341, 42.690565], pos1: [107.508341, 42.690565], img: "beijing", name: "北京赛区" },
              ]  `,
        resetPos: owg.resetPos,
        leftPath1: [0, 1, 2, 3],
        leftPath2: [4, 5],
        rightPath: [-6, -7, -8, -9, -10, -11, -12],
        curPath: "",
        pathCityCss: { width: 165  + 'px',display:"none" },
        pathImgCss: { width: 150  + 'px' },
        leftPage: "",
        argLeftPage: null,
        rightPage: "",
        argRightPage:null
    },
    methods: {
        refresh: function () {
            var testData;
            try {
                testData = eval(this.strGym);
            } catch (E) {
                alert("内容有误!" + E.message);
                return;
            }
            owg.testData = testData;
            owg.test(false);
            owg.test(true);
        },
        getPathImg: function (n) {
            var gym = owg.bk_gyms0[Math.abs(n)];
            var img = gym.img;
            //if (gym.name == this.curPath) img = "m" + img;
            img += (n < 0 ? "-l" : "-r");
            return "/i/sgc/hbowg/gym/" + img + ".png";
    },
        showPath: function (item) {
            if (Ysh.Type.isInteger(item)) item = owg.gyms[Math.abs(item)];
            if (owg.pathid != item.name) owg.pathid = "";
            owg.defPath = item.name;
            this.setCurMenu("path", true);
            //owg.showPath(item.id || item.name);
        },
            getMenuImg: function (m) {
            return "/i/sgc/hbowg/menu/" + (m.img||m.id) + ((m.id == this.mid) ? "_focus" : "") + ".png";
        },
            isMenuShow: function (m) {
                if (hideMenu) return false;
            if (this.mid) {
                return (m.id != "scene");
            }
            return m.id == "scene";
        },
            getMenuStyle: function (m) {
                var css = m.css || {};
                if (m.w) css.width = m.w + "px";
                return css;
            },
            setCurMenu: function (id,force) {
            if ((this.mid == id)&&(!force))
                    return;
            owg[this.mid || "home"](false);
            this.mid = id;
            owg[this.mid || "home"](true);
        },
            clickMenu: function (m) {
            var id = "";
            if (m.id != "back") {
                id = (m.id == "scene") ? "main" : m.id;
            }
            this.setCurMenu(id);
        }
    },
    created: function () {
        this.strGym = JSON.stringify(owg.testData);
    },
    mounted: function () {
    }
});