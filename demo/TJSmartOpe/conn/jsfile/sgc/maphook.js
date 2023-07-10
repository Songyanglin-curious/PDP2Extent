/*v=1.20.616.1*/
var MapHook = {
    extend: function (dest, src) {
        if (src) {
            for (var name in src) {
                dest[name] = src[name];
            }
        }
        return dest;
    },
    query: function (xml, args, callback) {
        var o = PDP.load(xml, args, function (ret) {
            if (ret.isOK) {
                callback({ success: true, data: ret.value });
            } else {
                callback({ success: false, message: ret.errMsg });
            }
        });
        /*if (o) {
            o.onreadystatechange = function () { }
            o.abort();
        }*/
    },
    deal: function (data) {
        if (!data.operate)
            return false;
        switch (data.operate) {
            case "locate":
                this.locate(data.type, data.id, data.height);
                break;
            case "draw":
                this.draw(data.type, data.data, data.options);
                break;
            case "fly":
                this.fly(data.data);
                break;
            case "menuope":
                this.menu(data.menuname, data.state, data.data);
                break;
            case "icon":
                this.icon(data.type, data.state, data.data);
                break;
            case "lock":
                this.lock(data.type, data.state, data.data);
                break;
            case "query":
                this.query(data.xml, data.args, function (ret) {
                    var wnd = window.parent;
                    if (!wnd) return;
                    wnd.postMessage({ eventType: "query", id: data.id, data: ret }, "*");
                });
                break;
        }
    },
    getLocateSQL: function (type, id) {
        if (id.length < 4) return "";
        switch (type) {
            case "grid":
            case "region":
                return "sgc/locate:Grid";
            case "station":
                switch (id.substr(0, 4)) {
                    case "0111":
                        return "sgc/locate:Plant";
                    case "0112":
                        return "sgc/locate:Substation";
                    case "0113":
                        return "sgc/locate:Converstation";
                    default:
                        return "sgc/locate:Station";
                }
            case "line":
                switch (id.substr(0, 4)) {
                    case "1201":
                        return "sgc/locate:AcLine";
                    case "1206":
                        return "sgc/locate:DcLine";
                    default:
                        return "sgc/locate:Line";
                }
            case "tower":
                return "sgc/locate:Tower";
            default:
                return "";
        }
    },
    getVolValue: function (v) {
        if (!v) return v;
        return v.replace("±", "");
    },
    getLocateMsg: function (type, id, row, height) {
        switch (type) {
            case "region":
                return { eventType: "menuope", menuname: "LocationArea", selstate: true, data: { height: height, arrownerid: [id.substr(4)], Level: row[0], isParentArea: false, padding: [52, 0, 0, 0] } };
            case "grid":
                return { eventType: "menuope", menuname: "LocationArea", selstate: true, data: { height: height, arrownerid: [id.substr(4)], Level: row[0], padding: [52, 0, 0, 0] } };
            case "station":
                return { locateType: 10, locateItem: { stationid: row[0], height: height, volvalue: this.getVolValue(row[4]), longitude: row[2], latitude: row[1], time: 5 } };
            case "line":
                return { locateType: 10, locateItem: { lineid: row[0], height: height, volvalue: this.getVolValue(row[1]), time: 5 } };
            case "tower":
                return { locateType: 10, locateItem: { towerid: id, height: height } };
        }
    },
    locate: function (type, id, height) {
        if (!id) return;
        if (!interfaceMap) return;
        var sql = this.getLocateSQL(type, id);
        if (!sql) 
            return;
        if (type == "region")
            id = "0101" + id;
        var oa = null;
        oa = $.ajax({
            url: "/conn/ashx/AskHandler.ashx?m=Read&conn=SGC&xml=" + sql + "&args=" + id,
            dataType: "json",
            type: "post",
            data: {},
            success: function (data) {
                if (data.length != 2)
                    return;
                if (!data[0])
                    return;
                if (type == "tower") {
                    interfaceMap.testInfo({ eventType: "menuope", menuname: "showTowerLine", data: { lineid: data[1][0][0] } });
                    interfaceMap.testInfo({ locateType: 10, locateItem: { towerid: id } });
                    return;
                }
                var msg = MapHook.getLocateMsg(type, id, data[1][0], height);
                if (msg)
                    interfaceMap.testInfo(msg);
            },
            error: function (data, status, err) {
                console.log(data.responseText);
            }
        });
        //oa.onreadystatechange = function () { }
        //oa.abort();
    },
    getEncircleMsg: function (data, options) {
        var points = [];
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var lon = row[2];
            var lat = row[1];
            if ((!lon) || (!lat))
                continue;
            points.push([parseFloat(lon), parseFloat(lat)]);
        }
        var pts = getEncircle(points, 50);
        var lst = [];
        for (var i = 0; i < pts.length; i++) {
            var pt = pts[i];
            lst.push({ Longitude: pt[0], Latitude: pt[1] });
        }
        return {
            eventType: "menuope", menuname: "showPartitions", selstate: true, data: [
            	{ type: "encircle", regionID: 0, regionName: "", center: { longitude: 0, latitude: 0 }, boundaryData: lst, colorCode: 1, opacity: 0.3 }]
        };
    },
    drawEncircle: function (stations, options) {
    	  if (stations===false) {
    	  	interfaceMap.testInfo({eventType: "menuope", menuname: "showPartitions", selstate: false,data:[{type: "encircle"}]});
    	  	return;
    	  }
    	  if (!stations)
    	  		return;
        if (stations.length == 0)
            return;
        $.ajax({
            url: "/conn/ashx/AskHandler.ashx?m=Read&conn=SGC&xml=sgc/locate:StationsLocation&sep=_&args=" + stations.join(),
            dataType: "json",
            type: "post",
            data: {},
            success: function (data) {
                if (data.length != 2)
                    return;
                if (!data[0])
                    return;
                var msg = MapHook.getEncircleMsg(data[1], options);
                if (msg)
                    interfaceMap.testInfo(msg);
            },
            error: function (data, status, err) {
                console.log(data.responseText);
            }
        });
    },
    drawPolygon: function (data, options) {
        if (data === false) {
            interfaceMap.testInfo({ eventType: "menuope", menuname: "drawPolygonByInfo", selstate: 0, data: MapHook.extend({ type: "polygon", arrPoints: [] }) });
            return;
        }
        if (options && options.style) {
            if (!options.style.fill) {
                options.style.fill = false;
                options.style.outline = true;
                options.style.outlineColor = options.style.color;
                options.style.outlineWidth = options.style.width;
            }
        }
        if (options && options.style && (options.style.fill === false))
            options.style.outline = true;
        interfaceMap.testInfo({ eventType: "menuope", menuname: "drawPolygonByInfo", selstate: 1, data: MapHook.extend({ type: "polygon", arrPoints: data }, options) });
    },
    drawCircle: function (data, options) {
        if (data === false) {
            interfaceMap.testInfo({ eventType: "menuope", menuname: "drawCircleByInfo", selstate: 0, data: MapHook.extend({ type: "circle", arrPoints: [] }, options) });
            return;
        }
        if (options && options.style) {
            if (!options.style.fill) {
                options.style.fill = false;
                options.style.outline = true;
                options.style.outlineColor = options.style.color;
                options.style.outlineWidth = options.style.width;
            }
        }
        if (options && options.style && (options.style.fill === false))
            options.style.outline = true;
        interfaceMap.testInfo({ eventType: "menuope", menuname: "drawCircleByInfo", selstate: 1, data: MapHook.extend({ type: "circle", arrPoints: data }, options) });
    },
    drawLine: function (data, options) {
        if (data === false) {
            interfaceMap.testInfo({ eventType: "menuope", menuname: "drawPolygonByInfo", selstate: 0, data: MapHook.extend({ type: "polyline", arrPoints: [] }, options) });
            return;
        }
        interfaceMap.testInfo({ eventType: "menuope", menuname: "drawPolygonByInfo", selstate: 1, data: MapHook.extend({ type: "polyline", arrPoints: data }, options) });
    },
    draw: function (type, data, options) {
        if (!interfaceMap) return;
        options = options || {};
        switch (type) {
            case "encircle":
                this.drawEncircle(data, options);
                break;
            case "circle":
                this.drawCircle(data, options);
                break;
            case "line":
                this.drawLine(data, options);
                break;
            case "polygon":
                this.drawPolygon(data, options);
                break;
        }
    },
    getIconData: function (type, data) {
        return { type: type, images: { imgUrl: data.icon, height: data.height, width: data.width }, locateData: data.data };
    },
    icon: function (type, state, data) {
        if (!interfaceMap) return;
        if (state) {
            interfaceMap.testInfo({ eventType: "menuope", menuname: "showImageIcon", selstate: true, data: this.getIconData(type, data) });
        } else {
            interfaceMap.testInfo({ eventType: "menuope", menuname: "showImageIcon", selstate: false, data: { type: type } });
        }
    },
    fly: function (data) {
        if (!data) return;
        if (!interfaceMap) return;
        interfaceMap.testInfo({ eventType: "fly", type: 1, data: data });
    },
    menu: function (menuname, state, data, options) {
        if (!interfaceMap) return;
        var msg = { eventType: "menuope", menuname: menuname, selstate: state, data: data };
        if (options)
            for (var key in options)
                msg[key] = options[key];
        interfaceMap.testInfo(msg);
    },
    lock: function (type, state, data) {
        if (type == "voltage") {
            if (state) {
                var dic = { '1000kV': 1001, '750kV': 1002, '500kV': 1003, '330kV': 1004, '220kV': 1005, '110kV': 1006, '66kV': 1007, '35kV': 1008, '20kV': 1009, '10kV': 1010, '6kV': 1011, '±1100kV': 2000, '±800kV': 2002, '±660kV': 2003, '±500kV': 2004, '±400kV': 2005, '±167kV': 2006, '±125kV': 2007, '±200kV': 2009, '10.5kV': 3007, '±420kV': 2011, '±320kV': 2016 };
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    var code = dic[data[i]];
                    if (!code) continue;
                    arr.push(code);
                }
                this.menu("ShowStationByVol", true, { code: arr });
            } else {
                this.menu("CancelShowStationByVol", true, {});
                //this.menu("SetYunTuMode", true, { modename: "main", modelevel: [] });
            }
        }
    }
};
window.addEventListener("message", function (event) {
    if ((!event) || (!event.data))
        return false;
    var data = event.data;
    if (!MapHook)
        return;
    return MapHook.deal(data);
});