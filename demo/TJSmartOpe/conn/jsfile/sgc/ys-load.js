/*v=1.20.615.1*/

var userSettings = {
    itemShowInNet: {
        value:"0"
    }
}

function getMainData() {
    return {
        data: {
            caption: "",
            assist: "",
            models: [//["guanzhu", "关注", "sgc_gz"]
                //,
                ["tuijian", "推荐", "sgc_tj"],
                ["tianqi", "天气", "sgc_tq"]
                //, ["czp", "操作票", "sgc_czp"]
                , ["jxp", "检修申请票", "sgc_jxp"]
                //, ["baobiao", "报表", "sgc_bb"]
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
                , ["icing", "覆冰", "sgc_tq_fb"]
                , ["mjtd", "密集通道", "sgc_transchannel"]
                , ["topo", "拓扑着色", "sgc_topo"]
                , ["section", "电网断面", "sgc_section"]
                , ["unknown", "未知", ""]

                //, ["part", "分区平衡", "sgc_part"]
            ],
            legendImg: null,
            legendContent: [],
            legendBottom: '',
            ystype: '',
            legendFilter: null,
            legendShowState: Ysh.Cookie.get("legend-state") != "0"
        },
        computed: {
            timeFormat: function () {
                switch (this.sectiontype) {
                    case 'y': return "1100000";
                    case 'm': return "1110000";
                    case 'd': return "1111000";
                    default: return "111111";
                }
            }
        },
        methods: {
            onShowPlayer: function (b) {
                b ? this.openPlayer() : this.closePlayer();
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
            closePlayer: function () {
                if (!this.showPlayer)
                    return;
                this.showPlayer = false;
                this.players = [];//清空播放内容
                this.$refs.player.pause();
                //this.sectiontime = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "d"));
                this.changeSectionTime(Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "d")));
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
                    o.boardcast.content = o.playPage ? msg.content : "";
                }))
                    this.sendTimeChangedMsg();
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
                return {};
            },
            sendBusinessMsg: function (id, msg) {
                if (id) {
                    if (this.modelid != id)
                        return;
                }
                this.$refs.modules.sendBusinessMsg(msg);
                if (document.getElementById("iframeBusiness"))
                    document.getElementById("iframeBusiness").contentWindow.postMessage(msg, "*");
            }
        },
        watch: {
            ystype: function () {
                this.closePlayer();
            }
        },
        created: function () {
            this.changeSectionType(this.sectiontype);
            this.players = [];
        }
    };
}

var vMain = new Vue(Ysh.Object.combine({
    el: "#divMainContent", data: {
        loading: true,
        args: {},
        showPlayer: false,
        playPage: "",
        boardcast: { caption: [], assist: "", content: "" },
        playerStep: 1,
        playerSpeed: 2,
        sectiontype: 'y',
        sectiontime: Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), "y")),
        minSectionTime: Ysh.Time.toString(Ysh.Time.add('y', -10, Ysh.Time.getTimeStart(new Date(), "y"))),
        maxSectionTime: "",
        inited:false
    }
    , methods: {
        over: function (event) {
            event.target.style.backgroundColor = "white";
        },
        out: function (event) {
            event.target.style.backgroundColor = "#efefef";
        },
        showPage: function (catalog, name, page, args, icon, w, h) {
            //this.leftWidth = this.leftWidth0;
            return this.show(catalog, name, page, args, { icon: icon, w: w, h: h });
        },
        getRealPage: function (page) {
            return page;
        },
        show: function (catalog, name, page, args, options) {
            args = Ysh.Object.combine(this.getDefaultArgs(catalog, page), args);
            page = this.getRealPage(page);
            if (ProjectSGC.Config.OpenMode == ProjectSGC.Config.OpenModeType.MULTI_SCREEN) {
                //var wnd = window.open("/html/" + page + ".html" + Ysh.Vue.getPageParameter(args), "SGCOpen");
                var wnd = window.open(this.getFullPath(page, args), "SGCOpen");
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
                this.modelid = catalog;
                var m = Ysh.Array.first(this.models, function (model) { return model[0] == catalog; });
                if (m) m[1] = name;
                this.curfile = page;
                this.args = args;
            } else {
                return Ysh.Vue.Dialog.show(name, page, args, options.icon, options.w, options.h);
            }
        },
        closePage: function (catalog) {
            if (this.modelid != catalog)
                return;
            this.leftWidth0 = this.leftWidth;
            this.leftWidth = 1;
        },
        changePage: function (catalog, name, page, args, options) {
            if ((this.leftWidth == 1) || (this.modelid != catalog))
                return;
            this.show(catalog, name, page, args, options);
        },
        getDefaultArgs: function (catalog, page) {
            return {};
        },
        sendBusinessMsg: function () { },
        changeStartTime: function (v) {
            this.minSectionTime = v;
            if (this.sectiontime < v)
                this.sectiontime = v;
            this.sendTimeChangedMsg();
        },
        changeSectionTime: function (v) {
            this.boardcast.assist = Ysh.Time.formatString(v, this.timeFormat);
            var vv = Ysh.Time.toString(Ysh.Time.add('ss', -1, Ysh.Time.add(this.sectiontype, 1, new Date(Ysh.Time.parseDate(v)))));
            MessageInst.postMessage({ eventType: 'menuope', menuname: 'setShowDate', selstate: 1, data: { operatedate: vv } });
            var o = this;
            if (!SGCModel.refreshTime(v, function (msg) {
                o.sendTimeChangedMsg();
                if (!msg) return;
                o.boardcast.content = o.playPage ? msg.content : "";
            }))
                this.sendTimeChangedMsg();
            for (var i = 0; i < this.players.length; i++)
                this.players[i].changeTime(this.sectiontime);
        },
        playEnd: function () {
            if (this.ystype)
                this.boardcast.content = SGCModel.getSummary(this.minSectionTime, this.sectiontime);
        },
        sendTimeChangedMsg: function () {
            if (!this.showPlayer)
                return;
            var type = "timechanged";
            var data = { min: this.minSectionTime, time: this.sectiontime, type: this.sectiontype };
            if (document.getElementById("frmPlayer"))
                document.getElementById("frmPlayer").contentWindow.postMessage({ type: type, data: data }, "*");
            if (document.getElementById("iframeBusiness"))
                document.getElementById("iframeBusiness").contentWindow.postMessage({ type: type, data: data }, "*");
        },
        init: function () {
            if (this.inited) return;
            this.inited = true;
            ModelList.useAll(function () {
                SGCModel = vMain.$refs.psys.model;
                vMain.ystype = "plant";            
                MapOpeInst.postMessage({ eventType: "menuope", menuname: "SetBackgroundForMap", selstate: true, data: { saturate: 3, opacity: 0.7 } });
                MapOpeInst.postMessage({ eventType: "menuope", menuname: "LocationArea", selstate: true, data: { level: "country" } });
                vMain.$nextTick(function () {
                    this.$refs.psys.initPlay(function () { });
                });
            });
        }
    }
    , mounted: function () {
    }
}, getMainData()));

SGCDB.init();

$(document).ready(function () {
    vMain.resize();
    Ysh.Web.Event.attachEvent(window, "onresize", function () { vMain.resize(); })
});

window.addEventListener('message', function (event) {
    if (!event.data)
        return;
    if (MessageInst)
        MessageInst.receive(event);
});