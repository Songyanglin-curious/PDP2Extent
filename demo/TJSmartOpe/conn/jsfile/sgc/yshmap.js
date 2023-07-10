/*v=1.21.514.1*/
window.addEventListener("message", function (event) {
    if ((!event) || (!event.data))
        return false;
    if (YshMap)
        YshMap.receive(event.source, event.data);
});
var YshMap = {
    ver: 10001,
    mapid: "",
    loaded: false,
    messages: [],
    events: {},
    recvs: {},
    extend: function (dest, src) {
        if (src) {
            for (var name in src) {
                dest[name] = src[name];
            }
        }
        return dest;
    },
    init: function (iframeId) {
        this.mapid = iframeId;
        return this;
    },
    getMap: function () {
        if (!this.mapid) return null;
        return document.getElementById(this.mapid);
    },
    setReady: function (source) {
        var map = this.getMap();
        if (map && (!this.loaded)) {
            this.loaded = (source == map.contentWindow);
            if (this.loaded) {
                for (var i = 0; i < this.messages.length; i++) {
                    map.contentWindow.postMessage(this.messages[i], "*");
                }
                this.messages = [];
            }
        }
    },
    setEvent: function (e, f) {
        if (!this.events[e]) { if (f) this.events[e] = [f]; } else { if (!f) { delete this.events[e]; } else { this.events[e].push(f); } }
    },
    fireEvent: function (e, type, id, data) {
        var events = this.events[e];
        if (!events) return;
        for (var i = 0; i < events.length; i++) {
            events[i](type, id, data);
        }
    },
    setReceive: function (t, f) {
        if (!this.recvs[t]) { if (f) this.recvs[t] = [f]; } else { if (!f) { delete this.recvs[t]; } else { this.recvs[t].push(f); } }
    },
    receiveEvent: function (t, data) {
        var recvs = this.recvs[t];
        if (!recvs) return;
        for (var i = 0; i < recvs.length; i++) {
            recvs[i](data);
        }
    },
    receive: function (source, data) {
        var b = (this.ver > 1) ? data.pwgridfinished : data.yuntufinished;
        if (b) {
            this.setReady(source);
            return;
        }
        var map = this.getMap();
        if (!map)
            return;
        if (source != map.contentWindow)
            return;
        //var data = eval(event.data);
        var data = event.data;
        if (!data.eventType)
            return;
        this.receiveEvent(data.eventType, data);
        switch (data.eventType.toString()) {
            case "5":
                if (data.data && (data.operateType == "click")) {
                    switch (data.data.type) {
                        case "extline":
                            this.fireEvent("click", "extline", data.data.lineItemId, data.data);
                            break;
                        case "station":
                            this.fireEvent("click", "station", data.data.id, data.data);
                            break;
                        default:
                            if (data.data.type) {
                                this.fireEvent("click", data.data.type, data.data.id, data.data);
                            }
                            break;
                    }
                }
                if (data.data)
                    this.fireEvent("reposition", data.data.longitude, data.data.latitude);
                break;
            case "6":
                if (data.data) {
                    this.vols = data.data.arrVolInfo;
                    this.zoomLayer = data.data.zoomLayer;
                    this.height = data.data.height;
                }
                break;
            case "10":
                this.fireEvent("hover", data.type, data.data);
                break;
            case "4":
                if (data.data) {
                    switch (data.data.type) {
                        case "extline":
                            this.fireEvent("rclick", "extline", data.data.lineItemId, data.data);
                            break;
                        case "station":
                            this.fireEvent("rclick", "station", data.data.id, data.data);
                            break;
                        default:
                            if (data.data.type) {
                                this.fireEvent("rclick", data.data.type, data.data.id, data.data);
                            }
                            break;
                    }
                }
                break;
            case "query":
                var id = data.id;
                if (this.querys[id])
                    this.querys[id](data.data);
                break;
            default:
                break;
        }
    },
    send: function (msg) {
        if (this.loaded) {
            var map = this.getMap();
            map.contentWindow.postMessage(msg, "*");
        } else {
            this.messages.push(msg);
        }
    },
    queryId: 1,
    querys: {},
    /*接口部分*/
    /*internal*/
    recv: function (t, f) { this.setReceive(t, f); },
    menu: function (menuname, state, data, options) {
        this.send({ operate: "menuope", menuname: menuname, state: state, data: data, options: options });
    },
    /*release*/
    locate: function (type, id, height) {
        this.send({ operate: "locate", type: type, id: id, height: height });
    },
    on: function (e, f) { this.setEvent(e, f); },
    draw: function (type, data, options) {
        this.send({ operate: "draw", type: type, data: data, options: options });
    },
    icon: function (type, state, data) {
        this.send({ operate: "icon", type: type, state: state, data: data });
    },
    lock: function (type, state, data) {
        this.send({ operate: "lock", type: type, state: state, data: data });
    },
    fly: function (height) {
        this.send({ operate: "fly", data: height });
    },
    mode: function (type, subtype) {
        if (type == 3) {
            this.menu("ChangeBenDiMapType", true, { type: 0, selChildTypeArr: [1] });
        } else
        this.menu("setMapType", true, { type: type, childtype: subtype });
    },
    grid: function (mode) {
        this.menu("SetYunTuMode", true, { modename: mode });
    },
    info: function (type, data) {
        switch (type) {
            case "lineweather":
                if (data === false)
                    this.menu("showTowerWeather", 0);
                else
                    this.menu("showTowerWeather", 1, { lineid: data });
                break;
        }
    },
    manual: function (type, data) {
        switch (type) {
            case "line":
                this.menu("DrawRectObject", !(data === false), { type: "polyline", color: data || "#ff0000" });
                return;
        }
    },
    show: function (lineids, stationids) {
        if (!lineids) {
            this.menu("SetYunTuMode", true, { modename: "main", modelevel: [] });
            return;
        }
        this.menu("SetYunTuMode", true, { modename: "other", modelevel: [] });
        var lines = [];
        for (var i = 0; i < lineids.length; i++) {
            lines.push({ ID: lineids[i] });
        }
        var stations = [];
        for (var i = 0; i < stationids.length; i++) {
            stations.push({ ID: stationids[i] });
        }
        this.menu("ShowStationLineById", true, { lstLineId: lines, lstStationId: stations });
    },
    highlight: function (lineids, stationids, clr, stopDynamic) {
        clr = clr || "#ffffff";
        if (!lineids) {
            this.menu("GlowMeshLine", false);
        } else {
        if (lineids.length > 0)
            this.menu("GlowMeshLine", true, { lineIDs: lineids, glowColor: clr, stopDynamic: stopDynamic });
        }
        if (!stationids) {
            this.menu("ShaderGlowMeshForStation", false);
        } else {
            if (stationids.length > 0)
                this.menu("ShaderGlowMeshForStation", true, { stopDynamic: stopDynamic, stationIDs: stationids, glowInfo: clr });
        }
    },
    zoom: function (type, pos) {
        if (!type)
            return this.zoomLayer;
        switch (type) {
            case "+":
                this.menu("MapZoomInOut", true, { type: 1 });
                return;
            case "-":
                this.menu("MapZoomInOut", true, { type: 0 });
                return;
            case "layer":
                this.menu("MapZoomInOut", true, { zoomLayerNum: pos });
                return;
        }
    },
    query: function (type, args, callback) {
        this.querys[this.queryId] = callback;
        var xml = type;
        switch (type) {
            case "station":
                xml = "sgc/info:Station"
                break;
        }
        this.send({ operate: "query", id: this.queryId, xml: xml, args: args });
        this.queryId++;
    },
    html: function (type, contents, options) {
        if (!contents) {
            this.menu("drawCanvasByHTML", false, { type: type });
            return;
        }
        var arrHTML = [];
        for (var i = 0; i < contents.length; i++) {
            var html = contents[i];
            arrHTML.push({
                divhtml: '<div id="' + type + i + '" style="width:' + html.width + ';">' + html.html + '</div>',
                divID: type + i,
                stationid: html.stationid,
                lineid: html.lineid,
                position: [html.longitude, html.latitude], z_index: html.zIndex || 99,
            });
        }
        this.menu("drawCanvasByHTML", true, this.extend({ type: type, locateData: arrHTML }, options));
    }
};