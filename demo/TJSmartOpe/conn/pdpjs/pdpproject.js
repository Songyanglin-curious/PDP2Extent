/*v=1.21.810.1*/
var MessageStack = {
    create: function (o) {
        var s = {
            isReady: false,
            lstWait: [],
            lstSend: [],
            enter: function () {
                this.isReady = true;
                for (var i = 0; i < this.lstWait.length; i++) {
                    this.doSend(this.lstWait[i]);
                }
                this.lstSend = this.lstWait;
                this.lstWait = [];
            },
            quit: function () {
                for (var i = this.lstSend.length - 1; i >= 0; i--) {
                    var msg = this.lstSend[i];
                    this.doClear(msg);
                }
                this.lstSend = [];
                this.isReady = false;
                this.lstWait = [];
            },
            doSend: function (msg) {
            },
            doClear: function (msg) {                
            },
            send: function (msg, appid) {
                msg.__appid = appid;
                if (this.isReady) {
                    this.doSend(msg);
                    this.lstSend.push(msg);
                    return;
                }
                this.lstWait.push(msg);
            },
            close: function (appid) {
                for (var i = this.lstSend.length - 1; i >= 0; i--) {
                    var msg = this.lstSend[i];
                    if (msg.__appid != appid)
                        continue;
                    this.doClear(msg);
                    this.lstSend.splice(i, 1);
                }
            }
        };
        Ysh.Object.extend(s, o);
        return s;
    }
}
var ProjectSGC = {
    LINE: { ID: 0, NAME: 1, DCC: 6, GRID: 7, VOLTAGE: 8, START_ST: 9, END_ST: 10, OPERATE_DATE: 11, STATE: 12, LENGTH: 13 },
    GRID: { ID: 0, NAME: 1, PID: 2, LEVEL: 3 },
    DCC: { ID: 0, NAME: 1, PID: 2, LEVEL: 3 },
    Array: {
        groupSum: function (array2d, gIdx, nameIdx, sIdx, order) {
            var o = {};
            for (var i = 0; i < array2d.length; i++) {
                var item = array2d[i];
                var g = item[gIdx];
                if (!o[g])
                    o[g] = { name: item[nameIdx], value: 0 };
                o[g].value += Ysh.String.toFloat(item[sIdx], 0);
            }
            var ret = [];
            for (var g in o) {
                var d = o[g];
                ret.push([d.name, d.value]);
            }
            switch (order) {
                case "asc":
                    ret.sort(function (x, y) { return x[1] - y[1]; });
                    break;
                case "desc":
                    ret.sort(function (x, y) { return y[1] - x[1]; });
                    break;
            }
            return ret;
        },
        top: function (array2d, valueIdx, count, cols) {
            var arrNew = Ysh.Object.clone(array2d);
            arrNew.sort(function (x1, x2) { return Ysh.String.toFloat(x2[valueIdx], 0) - Ysh.String.toFloat(x1[valueIdx], 0) });
            var ret = [];
            var length = Math.min(count, arrNew.length);
            for (var i = 0; i < length; i++) {
                var item = arrNew[i];
                var row = [];
                for (var j = 0; j < cols.length; j++) {
                    row.push(item[cols[j]]);
                }
                ret.push(row);
            }
            return ret;
        },
        sum: function (array2d, valueIdx, fSkip) {
            var s = 0;
            for (var i = 0; i < array2d.length; i++) {
                var item = array2d[i];
                if (fSkip)
                    if (fSkip(item, i))
                        continue;
                s += Ysh.String.toFloat(item[valueIdx], 0);
            }
            return s;
        },
        sumInt: function (array2d, valueIdx, fSkip) {
            var s = 0;
            for (var i = 0; i < array2d.length; i++) {
                var item = array2d[i];
                if (fSkip)
                    if (fSkip(item, i))
                        continue;
                s += Ysh.String.toInt(item[valueIdx], 0);
            }
            return s;
        },
        filter: function (array2d, vIdx, values) {
            var lst = [];
            for (var i = 0; i < array2d.length; i++) {
                var row = array2d[i];
                if (values.indexOf(row[vIdx]) < 0)
                    continue;
                lst.push(row);
            }
            return lst;
        },
        filterName: function (array2d, nameIdx, filterString) {
            if (!filterString) return array2d;
            var lst = [];
            for (var i = 0; i < array2d.length; i++) {
                var row = array2d[i];
                var name = row[nameIdx];
                if (name.indexOf(filterString) < 0)
                    continue;
                lst.push(row);
            }
            return lst;
        },
        pick: function (array2d, f) {
            var lst = [];
            for (var i = 0; i < array2d.length; i++) {
                var row = array2d[i];
                if (f(row))
                    lst.push(row);
            }
            return lst;
        },
        edit: function (array1, array2, f) {
            if (!array1)
                return [[], [], array2 || []];
            if (!array2)
                return [array1, [], []];
            var arrDelete = [];
            var arrModify = [];
            var temp = [];
            for (var i = 0; i < array2.length; i++) temp.push(array2[i]);
            for (var i = 0; i < array1.length; i++) {
                var o1 = array1[i];
                var bDeal = false;
                for (var j = 0; j < temp.length; j++) {
                    var o2 = temp[j];
                    var n = f(o1, o2);//0 不同 1 相同  2 状态不同
                    if (!n)
                        continue;
                    if (n == 2) {
                        arrModify.push([o1, o2]);
                    }
                    temp.splice(j, 1);
                    bDeal = true;
                    break;
                }
                if (!bDeal) {
                    arrDelete.push(o1);
                }
            }
            return [arrDelete, arrModify, temp];
        }
    },
    Const: {
        DCC_GD: "0021990100",
        GRID_GD: "0101990100",
        OWNER_GD: "990100"
    },
    Config: {
        OpenModeType: { GENERAL: 0, MULTI_SCREEN: 1, NO_LIST: 2 },
        OpenMode: 0 //0 - 默认，1 - window.open 
    },
    Data: {
        DateCurve: {
            Hour: {
                createArray: function (names) {
                    var result = [];
                    for (var i = 0; i < 24; i++) {
                        var row = [ProjectSGC.String.toHourStr(i, 0)];
                        for (var d = 0; d < names.length; d++)
                            row.push("");
                        result.push(row);
                    }
                    return { names: names, data: result };
                },
                fill: function (results, ds, idxDataStart) {
                    for (var i = 0; i < ds.length; i++) {
                        var row = ds[i];
                        for (var r = 0; r < results.length; r++) {
                            var result = results[r];
                            if (!result.getName)
                                continue;
                            var name = result.getName(row);
                            if (name === null)
                                continue;
                            var idx = result.names.indexOf(name);
                            if (idx < 0)
                                continue;
                            for (var c = 0; c < 24; c++) {
                                result.data[c][idx + 1] = row[idxDataStart + c];
                            }
                        }
                    }
                }
            },
            getDiff: function (v1, v0) {
                if (v0 === 0) return v1; if (!v0) return ""; v0 = parseFloat(v0); if (v1 === 0) return 0 - v0; if (!v1) return ""; return parseFloat(v1) - v0;
            },
            appendDiff: function (array2d, idx0, idx1, f) {
                for (var i = 0; i < array2d.length; i++) {
                    var row = array2d[i];
                    var v = (f || this.getDiff)(row[idx1], row[idx0]);
                    row.push(v);
                }
            }
        },
        createTimeCurve: function (dates) {
            var ret = {
                idxDate: 0,
                idxData: 1,
                dates: dates,
                result: [],
                fGetDate: function (row) { return null; },
                init: function (dates) {
                    var result = [];
                    var count = 24;
                    for (var i = 0; i < count; i++) {
                        var row = [ProjectSGC.String.toMinuteStr(i, 0)];
                        for (var d = 0; d < dates.length; d++)
                            row.push("");
                        result.push(row);
                    }
                    this.result = result;
                },
                read: function (ds) {
                    this.result = {};
                    for (var i = 0; i < ds.length; i++) {
                        var row = ds[i];
                        var dt = this.fGetDate(row);
                        if (dt === null)
                            continue;
                    }
                }
            };
            return ret;
        },
        loadYearData: function (sqls, args, yearIndex, startIndex, endIndex, f, sync, textn) {
            var lst = [];
            var start = args[startIndex];
            var end = new Date(args[endIndex]);
            var tm = new Date(Ysh.Time.parseDate(start));
            while (tm <= end) {
                var nextYear = Ysh.Time.getTimeStart(Ysh.Time.add('y', 1, tm), 'y');
                var newArgs = Ysh.Object.clone(args);
                newArgs[startIndex] = tm;
                newArgs[yearIndex] = tm.getFullYear();
                if (end <= nextYear) {
                    newArgs[endIndex] = end;
                    Ysh.Array.each(sqls, function (sql) { lst.push({ type: textn ? 'readtext' : 'read', db: 'SGC', sql: sql, args: newArgs, silent: true }); });
                    break;
                }
                newArgs[endIndex] = nextYear;
                Ysh.Array.each(sqls, function (sql) { lst.push({ type: textn ? 'readtext' : 'read', db: 'SGC', sql: sql, args: newArgs, silent: true }); });
                tm = nextYear;
            }
            if (lst.length == 0)
                return;
            PDP.exec(lst, function (ret) {
                var data = [];
                if (ret.check("获取数据", true)) {
                    ret = ret.value;
                    for (var i = 0; i < ret.length; i++) {
                        if (textn) {
                            var d = ret[i];
                            if (d) {
                                d = d.split("\n");
                                for (var j = 0; j < d.length; j++) {
                                    data.push(d[j].split(','));
                                }
                            }
                        } else {
                            var d = ret[i] || [];
                            for (var j = 0; j < d.length; j++)
                                data.push(d[j]);
                        }
                    }
                }
                f(data);
            }, sync);
        }
    },
    Dict: {
        create: function (desc, fGetOne, sql, args, idCol) {
            idCol = idCol || "id";
            return {
                all: [],
                state: 0,
                load: function () {
                    if (this.state == 1)
                        return;
                    var v = PDP.read("SGC", sql, args || []);
                    var o = this;
                    if (v.check("获取" + desc, true)) {
                        v = v.value;
                        o.state = 1;
                        var lst = [];
                        for (var i = 0; i < v.length; i++) {
                            var o = fGetOne(v[i]);
                            if (o == null)
                                continue;
                            lst.push(o);
                            this[o[idCol]] = o;
                        }
                        this.all = lst;
                    }
                }
            }
        }
    },
    getWarnImg: function (level) {
        return ["/i/sgc/tq/warn-red.png",
            "/i/sgc/tq/warn-orange.png",
            "/i/sgc/tq/warn-yellow.png",
            "/i/sgc/tq/warn-blue.png",
            "/i/sgc/tq/warn-white.png"][(level || 1) - 1];
    },
    getNumber: function (n) {
        if (n < 100) return n;
        return "99+";
    },
    toDictionary: function (arr, idxID) {
        var ret = {};
        for (var i = 0; i < arr.length; i++) {
            ret[arr[i][idxID]] = arr[i];
        }
        return ret;
    },
    timeLeftJoin: function (tmStart, tmEnd, interval, offset, array2d, colCount, timeIndex) {
        var arrRet = [];
        var idx = 0;
        for (var tm = tmStart; tm < tmEnd; tm = Ysh.Time.add(interval, offset, tm)) {
            var strCur = Ysh.Time.toString(tm);
            var bFind = false;
            var isObj = false;
            for (; idx < array2d.length; idx++) {
                var row = array2d[idx];
                isObj = Ysh.Type.isObject(row)
                var strTime = row[timeIndex];
                if (strCur < strTime)
                    break;
                if (strCur == strTime) {
                    bFind = true;
                    arrRet.push(row);
                    idx++;
                    break;
                }
            }
            if (!bFind) {
                if(isObj){
                    var objNew = {};
                    objNew[timeIndex] = strCur
                    arrRet.push(objNew);
                }else{
                    var arrNew = Ysh.Array.initN(colCount, "");
                    arrNew[timeIndex] = strCur;
                    arrRet.push(arrNew);
                }

            }
        }
        return arrRet;
    },
    timeInterpolation: function(tmStart, tmEnd, interval, offset, array2d,timeIndex,func,infill){
        //array2d必须排序
        if (new Date(tmStart).toString() === "Invalid Date") {
            alert("开始时间格式错误");
            return false;
        }
        if (new Date(tmEnd).toString() === "Invalid Date") {
            alert("结束时间格式错误");
            return false;
        }
        tmStart = new Date(tmStart);
        tmEnd = new Date(tmEnd);
        var arrRes = [];
        var idx = 0;
        var isFunc =  Ysh.Type.isFunction(func);
        for (var tm = tmStart; tm < tmEnd; tm = Ysh.Time.add(interval, offset, tm)) {
            var strCur = Ysh.Time.toString(tm);
            var nextTime = Ysh.Time.toString(Ysh.Time.add(interval, offset, tm));
            var values = [];
            for (; idx < array2d.length; idx++) {
                var row = array2d[idx];
                var strTime = row[timeIndex];
                if(strTime < strCur){
                    continue;
                }else if(strTime >= strCur && strTime < nextTime){
                    values.push(row);
                }else if(strTime >= nextTime){
                    break;
                }
            }
            arrRes.push(func(strCur,values))
        }
        return arrRes;
    },
    Number: {
        i: function (v) { if (v === "") return v; if (isNaN(v)) return v; return parseFloat(v).toFixed(); },
        f: function (v, n) { if (isNaN(v)) return v; return parseFloat(v).toFixed(n); },
        ff: function (n) { return function (v) { if (isNaN(v)) return v; return parseFloat(v).toFixed(n); } },
        percent: function (n1, n2) { if (!n2) return "-"; if (!n1) return 0; return (n1 / n2 * 100.0).toFixed(2); }
    },
    Map: {
        getDistance: function (lonA, latA, lonB, latB) {
            if ((lonA == lonB) && (latA == latB)) return 0;
            var k = Math.PI / 180;
            var x = latB * k;
            var y = latA * k;
            var z = Math.abs(lonA - lonB) * k;
            res = Math.sin(x) * Math.sin(y) + Math.cos(x) * Math.cos(y) * Math.cos(z);
            if (res >= 1) return 0;
            return 6371.393 * Math.acos(res)
        },
        inst: null,
        window: null,
        getMainObject: function (id, def) {
            return ProjectSGC.Global.getMainObject(id, def);
        },
        getInst: function () {
            if (this.inst) return this.inst;
            this.inst = {
                locate: function () { }, postMessage: function () { }
            }
            var p = (window.opener ? window.opener : window);
            if (window.location.pathname == "/")
                p = window;//防止是被别的窗口打开的
            try {
                p.location.href;
            } catch (err) {
                p = window;
            }
            while (true) {
                var map = p.MessageInst;
                if (map) {
                    this.inst = map;
                    this.window = p;
                    break;
                }
                if (p == p.parent) {
                    p = p.opener;
                } else {
                    p = p.parent;
                }
                if (p == null)
                    break;
            }
            return this.inst;
        },
        locate: function (type, id, dest, keepHeight, f) {
            if (!type)
                type = ProjectSGC.Meta.getTypeById(id);
            if (!type)
                return;
            this.getInst().locate(type, id, dest, keepHeight, f);
        },
        fly: function (lon, lat) {
            this.postMessage({ eventType: "fly", type: 1, data: { longitude: lon, latitude: lat } });
        },
        sanwei: MessageStack.create({
            doSend: function (msg) {
                ProjectSGC.Map.getInst().postMessage(msg);
            },
            doClear: function (msg) {
                msg.selstate = false;
                ProjectSGC.Map.getInst().postMessage(msg);
            }
        }),
        postMessage: function (data, appid) {
            if (data.eventType == "menuopeSW") {
                if ((data.menuname != "ShowStation")&&(data.selstate)) {
                    this.sanwei.send(data, appid);
                    return;
                }
            }
            if (data.selstate) {
                if (data.menuname == "ShowStationLineByInfo") {
                    if (!data.data._noData) {
                        var mapData = ProjectSGC.Global.getMainObject("MapData");
                        mapData._sData.add("station", data.data.lstStationInfo);
                        mapData._lData.add("station", data.data.lstLineInfo);
                    }

                }
            }
            if (data.menuname == "ShowStationByVol") {

            } else if (data.menuname == "CancelShowStationByVol") {

            }
            if (appid && data.menuname) {//需要区分状态
                var show = data.selstate;
                var name = data.menuname;
                var mapStates = ProjectSGC.Global.getMainObject("MessageInst");
                if (!mapStates.mapState) {
                    mapStates.mapState = {};
                }
                if (!mapStates.mapState[name])
                    mapStates.mapState[name] = ProjectSGC.Struct.createStates()
                if (!mapStates.mapState[name].setState(appid, show))
                    return;//继续保持当前状态
            }
            this.getInst().postMessage(data);
        },
        locatePlantStation: function (lst, keepHeight) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            m.postMessage({ locateType: 0 });
            m.postMessage({ locateType: 3, locateItem: lst, flyType: (keepHeight ? 1 : 0) });
        },
        isLineTower: function () {
            var bTower = true;
            var us = this.getMainObject("userSettings");
            if (us) {
                for (var i = 0; i < us.all.length; i++) {
                    var cfg = us.all[i];
                    if (cfg.id == "towerCount") {
                        bTower = cfg.value != "1";
                        break;
                    }
                }
            }
            return bTower;
        },
        locateLine: function (lst, keepHeight) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var model = this.getMainObject("ModelList");
            if (!model) return;
            var bTower = this.isLineTower();
            for (var i = 0; i < lst.length; i++) {
                var item = lst[i];
                var id = item.data.id;
                var line = model.getLine(id);
                if (!line)
                    continue;
                if (bTower) {
                    item.longitude = line[2];
                    item.latitude = line[3];
                } else {
                    item.longitude = line[4];
                    item.latitude = line[5];
                }
            }
            m.postMessage({ locateType: 0 });
            m.postMessage({ locateType: 3, locateItem: lst, flyType: (keepHeight ? 1 : 0) });
        },
        highLight: function (lines, stations, clr, stopDynamic, bAdd) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            clr = clr || "#ffffff";
            if (!bAdd) {
                m.postMessage({ eventType: "menuope", menuname: "GlowMeshLine", selstate: 0, data: {} });
                m.postMessage({ eventType: "menuope", menuname: "ShaderGlowMeshForStation", selstate: 0, data: {} }, "*");
            }
            if (stations.length > 0)
                m.postMessage({ eventType: "menuope", menuname: "ShaderGlowMeshForStation", selstate: 1, data: { stopDynamic: stopDynamic, stationIDs: stations, glowInfo: { glowColor: clr } } });
            if (lines.length > 0)
                m.postMessage({ eventType: "menuope", menuname: "GlowMeshLine"/*"ShaderGlowMeshForLine"*/, selstate: 1, data: { lineIDs: lines, glowColor: clr, stopDynamic: stopDynamic } });
        },
        locateLineStaRange: function (lineids, stationids, f) {
            if ((lineids.length < 1) && (stationids.length < 1)) return;
            var m = ProjectSGC.Map.getMainObject("ModelList");
            if (!m) return;
            m.require(["station", "line"], function () {
                var maxLon = 0, minLon = 9999999, maxLat = 0, minLat = 9999999;
                var vols = [];
                for (var i = 0; i < lineids.length; i++) {
                    var lineid = lineids[i];
                    var line = m.getLine(lineid);
                    if (!line) continue;
                    vols.push(line[ProjectSGC.LINE.VOLTAGE]);
                    var start_st_id = line[ProjectSGC.LINE.START_ST];
                    var end_st_id = line[ProjectSGC.LINE.END_ST];
                    var start_st_obj = m.getStation(start_st_id) || {};
                    var end_st_obj = m.getStation(end_st_id) || {};
                    if (start_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, start_st_obj.LONGITUDE); minLon = Math.min(minLon, start_st_obj.LONGITUDE); }
                    if (end_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, end_st_obj.LONGITUDE); minLon = Math.min(minLon, end_st_obj.LONGITUDE); }
                    if (start_st_obj.LATITUDE) { maxLat = Math.max(maxLat, start_st_obj.LATITUDE); minLat = Math.min(minLat, start_st_obj.LATITUDE); }
                    if (end_st_obj.LATITUDE) { maxLat = Math.max(maxLat, end_st_obj.LATITUDE); minLat = Math.min(minLat, end_st_obj.LATITUDE); }
                }
                for (var i = 0; i < stationids.length; i++) {
                    var start_st_obj = m.getStation(stationids[i]);
                    if (!start_st_obj) continue;
                    vols.push(start_st_obj.code);
                    if (start_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, start_st_obj.LONGITUDE); minLon = Math.min(minLon, start_st_obj.LONGITUDE); }
                    if (start_st_obj.LATITUDE) { maxLat = Math.max(maxLat, start_st_obj.LATITUDE); minLat = Math.min(minLat, start_st_obj.LATITUDE); }
                }
                var offset = 100;
                var msg = { locateType: 13, range: { maxLng: maxLon, minLng: minLon, maxLat: maxLat, minLat: minLat }, padding: [offset, offset, offset, offset], volcode: vols, isRangeInfo: true, stationIDs: stationids, lineIDs: lineids };
                if (f) f(msg);
                ProjectSGC.Map.postMessage(msg);
            });
        },
        locateRange: function (lineids, stationids, isRectInfo, isRangeInfo) {
            this.locateLineStaRange(lineids, stationids, function (msg) {
                msg.isRectInfo = isRectInfo;
                msg.isRangeInfo = isRangeInfo;
            });
            if ((lineids.length < 1) && (stationids.length < 1)) return;
            var m = ProjectSGC.Map.getMainObject("ModelList");
            if (!m) return;
            m.require(["station", "line"], function () {
                var maxLon = 0, minLon = 9999999, maxLat = 0, minLat = 9999999;
                var vols = [];
                for (var i = 0; i < lineids.length; i++) {
                    var lineid = lineids[i];
                    var line = m.getLine(lineid);
                    if (!line) continue;
                    vols.push(line[ProjectSGC.LINE.VOLTAGE]);
                    var start_st_id = line[ProjectSGC.LINE.START_ST];
                    var end_st_id = line[ProjectSGC.LINE.END_ST];
                    var start_st_obj = m.getStation(start_st_id);
                    var end_st_obj = m.getStation(end_st_id);
                    if (start_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, start_st_obj.LONGITUDE); minLon = Math.min(minLon, start_st_obj.LONGITUDE); }
                    if (end_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, end_st_obj.LONGITUDE); minLon = Math.min(minLon, end_st_obj.LONGITUDE); }
                    if (start_st_obj.LATITUDE) { maxLat = Math.max(maxLat, start_st_obj.LATITUDE); minLat = Math.min(minLat, start_st_obj.LATITUDE); }
                    if (end_st_obj.LATITUDE) { maxLat = Math.max(maxLat, end_st_obj.LATITUDE); minLat = Math.min(minLat, end_st_obj.LATITUDE); }
                }
                for (var i = 0; i < stationids.length; i++) {
                    var start_st_obj = m.getStation(stationids[i]);
                    if (start_st_obj.LONGITUDE) { maxLon = Math.max(maxLon, start_st_obj.LONGITUDE); minLon = Math.min(minLon, start_st_obj.LONGITUDE); }
                    if (start_st_obj.LATITUDE) { maxLat = Math.max(maxLat, start_st_obj.LATITUDE); minLat = Math.min(minLat, start_st_obj.LATITUDE); }
                }
                var offset = 100;
                ProjectSGC.Map.postMessage({ locateType: 13, range: { maxLng: maxLon, minLng: minLon, maxLat: maxLat, minLat: minLat }, padding: [offset, offset, offset, offset], isRectInfo: isRectInfo, isRangeInfo: isRangeInfo, volcode: vols });
            });
        },
        Icon: {
            states: {},
            hide: function (type) {
                var m = ProjectSGC.Global.getMainObject("MapOpeInst");
                if (!m) return;
                m.menu("showImageIcon", false, { type: type });
                m.menu("ShaderGlowMeshForStation", false, { type: type });
                this.states[type] = false;
            },
            initOptions: function (options) {
                if (!options.getIcon)
                    options.getIcon = function (row) { return this.icon; }
                if (!options.getWidth)
                    options.getWidth = function (row) { return this.width || this.size; }
                if (!options.getHeight)
                    options.getHeight = function (row) { return this.height || this.size; }
            },
            showIconsNoTip: function (type, map, data, options) {
                var infos = Ysh.Group.create();
                Ysh.Array.each(data, function (row, idx) {
                    var icon = options.getIcon(row);
                    if (!icon) return;
                    var info = options.fGetInfo(row);
                    if (!info) return;
                    infos.add(icon, info);
                });
                if (this.states[type]) {
                    Ysh.Array.each(infos.result, function (info, idx) {
                        //map.menu("ShowMutipleIcons", true, { type: type, url: info.name, locateData: info.data });
                        map.menu("showImageIcon", true, { stopLight: true, time: 0, type: type, images: { imgCode: idx, imgUrl: info.name, height: options.height, width: options.width }, isBeauty: 1, locateData: info.data });
                    });
                }
            },
            showIconsForTip: function (type, map, data, options) {
                var groups = {};
                var icons = [];
                Ysh.Array.each(data, function (row, idx) {
                    var icon = options.getIcon(row);
                    if (!icon) return;
                    var info = options.fGetInfo(row);
                    if (!info) return;
                    if (!groups[icon]) {
                        groups[icon] = Ysh.Group.create();
                        icons.push(icon);
                    }
                    groups[icon].add([info.longitude, info.latitude], info);
                });
                if (this.states[type]) {
                    Ysh.Array.each(icons, function (icon, idx) {
                        var infos = groups[icon];
                        Ysh.Array.each(infos.result, function (info) {
                            //map.menu("ShowMutipleIcons", true, { type: type, url: icon, locateData: info.data });
                            map.menu("showImageIcon", true, { stopLight: true, time: 0, type: type, images: { imgCode: idx, imgUrl: info.name }, isBeauty: 1, locateData: info.data });
                        });
                    });
                }
            },
            getStationInfo: function (model, options, row) {
                var id = options.getId(row);
                if (!id) return null;
                var ps = model.getStation(id);
                if (!ps) return null;
                var lon = ps.LONGITUDE;
                var lat = ps.LATITUDE;
                var vol = ps.VOLTAGE_TYPE;
                var pstype = ps.PlantStationType;
                var height = options.getHeight(row, ps);
                var width = options.getHeight(row, ps);
                return { height: height, width: width, stationid: id, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } };
            },
            showIconsByLonLat: function (type, map, model, data, x, y, options) {
                var infos = Ysh.Group.create();
                if (!options.showTips) {
                    Ysh.Array.each(data, function (row, idx) {
                        var icon = options.getIcon(row);
                        if (!icon) return;
                        infos.add(icon).push()
                        var info = this.getStationInfo(model, options, row);
                        if (!info) return;
                        info.push({ height: sz, width: sz, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        groups.add([lon, lat, vol, pstype], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                    });
                }
                if (this.states[type]) {
                    Ysh.Array.each(infos.result, function (info, idx) {
                        map.menu("ShowMutipleIcons", true, { type: type, url: info.name, locateData: info.data });
                    });
                }
            },
            showIconsByFunc: function (type, map, model, data, func, options) {
                var infos = Ysh.Group.create();
                if (!options.showTips) {
                    Ysh.Array.each(data, function (row, idx) {
                        var icon = options.getIcon(row);
                        if (!icon) return;
                        infos.add(icon).push()
                        var info = this.getStationInfo(model, options, row);
                        if (!info) return;
                        info.push({ height: sz, width: sz, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        groups.add([lon, lat, vol, pstype], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                    });
                }
                if (this.states[type]) {
                    Ysh.Array.each(infos.result, function (info, idx) {
                        map.menu("ShowMutipleIcons", true, { type: type, url: info.name, locateData: info.data });
                    });
                }
            },
            showStationsIcon: function (type, map, model, data, options) {
                options.fGetInfo = function (row) {
                    return ProjectSGC.Map.Icon.getStationInfo(model, options, row);
                }
                if (options.showTips)
                    this.showIconsForTip(type, map, data, options);
                else
                    this.showIconsNoTip(type, map, data, options);
                return;
                var infos = Ysh.Group.create();
                if (!options.showTips) {
                    Ysh.Array.each(data, function (row, idx) {
                        var icon = options.getIcon(row);
                        if (!icon) return;
                        infos.add(icon).push()
                        var info = this.getStationInfo(model, options, row);
                        if (!info) return;
                        info.push({ height: sz, width: sz, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = options.getId(row);
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        groups.add([lon, lat, vol, pstype], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                    });
                }
                if (this.states[type]) {
                    Ysh.Array.each(infos.result, function (info, idx) {
                        map.menu("ShowMutipleIcons", true, { type: type, url: info.name, locateData: info.data });
                    });
                }
            },
            /*
             * options 配置：
             * type:类型，目前支持file和其他
             * file:type="file"时有效，要展示的动态文件名称
             * showTips:其他类型时有效，根据每行数据展示点击图标时提示的数据
             * icon:要显示的图标文件路径，可被getIcon覆盖
             * getIcon:根据数据获取要显示的图标文件路径函数，默认取icon
             * size:图标要显示的大小，可被width和height覆盖
             * width:图标要显示的宽度，可被getWidth覆盖
             * getWidth:根据数据获取要显示的图标的宽度，默认取width
             * height:图标要显示的高度，可被getHeight覆盖
             * pos:坐标获取方式，ps(字符串) -- 厂站，[x,y](数组) -- 列索引，func(函数) -- 根据函数获取
             */
            showMultiple: function (type, data, options) {
                var m = ProjectSGC.Map.getMainObject("MapOpeInst");
                if (!m) return;
                var model = ProjectSGC.Map.getMainObject("ModelList");
                if (!model) return;
                this.initOptions(options);
                var float = ProjectSGC.Map.getMainObject("floatDataInst");
                if (float) {
                    if (options.type == "file")
                        float.registerShowFile(type, options.file);
                    else
                        float.registerShowData(type, options.showTips);
                }
                this.states[type] = true;

                if (Ysh.Type.isArray(options.pos)) {
                    this.showIconsByLonLat(type, m, model, float, data, options.pos[0], options.pos[1], options);
                } else if (Ysh.Type.isFunction(options.pos)) {
                    this.showIconsByFunc(type, m, model, float, data, options.pos, options);
                } else if (options.pos == "ps") {
                    var o = this;
                    model.useAll(function () {
                        o.showStationsIcon(type, m, model, data, options);
                        return;
                        var info = [];
                        if (!options.showTips) {
                            //应该能根据id进行合并
                            Ysh.Array.each(data, function (row, idx) {
                                var id = row.objid;
                                if (!id)
                                    return;
                                var otype = ProjectSGC.Meta.getTypeById(id);
                                if (!otype)
                                    return;
                                var name, lon, lat, vol, pstype;
                                var ps = model.getStation(id);
                                if (!ps)
                                    return;
                                name = ps.NAME;
                                lon = ps.LONGITUDE;
                                lat = ps.LATITUDE;
                                vol = ps.VOLTAGE_TYPE;
                                pstype = ps.PlantStationType;
                                info.push({ height: sz, width: sz, stationid: id, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { data: row } });
                            });
                        } else {
                            var groups = Ysh.Group.create();
                            Ysh.Array.each(data, function (row, idx) {
                                var id = row.objid;
                                if (!id)
                                    return;
                                var otype = ProjectSGC.Meta.getTypeById(id);
                                if (!otype)
                                    return;
                                var name, lon, lat, vol, pstype;
                                var ps = model.getStation(id);
                                if (!ps)
                                    return;
                                name = ps.NAME;
                                lon = ps.LONGITUDE;
                                lat = ps.LATITUDE;
                                vol = ps.VOLTAGE_TYPE;
                                pstype = ps.PlantStationType;
                                groups.add([lon, lat, vol, pstype], row);
                            });
                            groups = groups.result;
                            Ysh.Array.each(groups, function (g) {
                                info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                            });
                        }
                        if (o.showIconState[type]) {
                            m.menu("ShowMutipleIcons", true, { type: type, url: icon, locateData: info });
                        }
                    });
                } else {
                    return;
                }
            },
        },
        showIconState: {},
        showIcon: function (type, icon, data, fShowTip, sz, imgType, fMsg) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var model = this.getMainObject("ModelList");
            if (!model) return;
            var float = this.getMainObject("floatDataInst");
            if (float) float.registerShowData(type, fShowTip);
            var bTower = this.isLineTower();
            this.showIconState[type] = true;
            var o = this;
            model.useAll(function () {
                var info = [];
                if (!fShowTip) {
                    //应该能根据id进行合并
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, lineid, stationid;
                        switch (otype) {
                            case "CONVERSUBSTATION":
                            case "SUBSTATION":
                            case "PLANT":
                            case "HVDCGROUNDSTATIO":
                                stationid = id;
                                var ps = model.getStation(id);
                                if (!ps)
                                    return;
                                name = ps.NAME;
                                lon = ps.LONGITUDE;
                                lat = ps.LATITUDE;
                                break;
                            case "ACLINE":
                            case "DCLINE":
                                lineid = id;
                                /*
                                var line = model.getLine(id);
                                if (!line)
                                    return;
                                name = line[1];
                                if (bTower) {
                                    lon = line[2];
                                    lat = line[3];
                                } else {
                                    lon = line[4];
                                    lat = line[5];
                                }*/
                                break;
                        }
                        if (lineid)
                            info.push({ height: sz, width: sz, lineid: lineid, longitude: lon, latitude: lat, data: { data: row } });
                        else
                            info.push({ height: sz, width: sz, stationid: stationid, longitude: lon, latitude: lat, data: { data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, lineid;
                        switch (otype) {
                            case "CONVERSUBSTATION":
                            case "SUBSTATION":
                            case "PLANT":
                            case "HVDCGROUNDSTATIO":
                                var ps = model.getStation(id);
                                if (!ps)
                                    return;
                                name = ps.NAME;
                                lon = ps.LONGITUDE;
                                lat = ps.LATITUDE;
                                break;
                            case "ACLINE":
                            case "DCLINE":
                                /*var line = model.getLine(id);
                                if (!line)
                                    return;
                                name = line[1];
                                if (bTower) {
                                    lon = line[2];
                                    lat = line[3];
                                } else {
                                    lon = line[4];
                                    lat = line[5];
                                }*/
                                lineid = id;
                                break;
                        }
                        if (lineid)
                            groups.add([-1, lineid], row);
                        else
                            groups.add([lon, lat], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        var lon = g.name[0];
                        var lat = g.name[1];
                        if (lon == -1)
                            info.push({ height: sz, width: sz, lineid: lat, data: { data: g.data } });
                        else
                            info.push({ height: sz, width: sz, longitude: lon, latitude: lat, data: { data: g.data } });
                    });
                }
                if (o.showIconState[type]) {
                    var msg = { stopLight: true, time: 0, type: type, images: { height: sz, width: sz, imgCode: 0, imgUrl: icon, imgType: imgType }, locateData: info };
                    if (fMsg) fMsg(msg);
                    m.menu("showImageIcon", true, msg);
                }
            });
        },
        showMultipleIcon: function (type, icon, data, fShowTip, sz) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var model = this.getMainObject("ModelList");
            if (!model) return;
            var float = this.getMainObject("floatDataInst");
            if (float) float.registerShowData(type, fShowTip);
            var bTower = this.isLineTower();
            this.showIconState[type] = true;
            var o = this;
            model.useAll(function () {
                var info = [];
                if (!fShowTip) {
                    //应该能根据id进行合并
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        info.push({ height: sz, width: sz, longitude: lon, latitude: lat, voltage: vol, stationType: pstype, data: { id: id, data: row } });
                    });
                } else {
                    var groups = Ysh.Group.create();
                    Ysh.Array.each(data, function (row, idx) {
                        var id = row.objid;
                        if (!id)
                            return;
                        var otype = ProjectSGC.Meta.getTypeById(id);
                        if (!otype)
                            return;
                        var name, lon, lat, vol, pstype;
                        var ps = model.getStation(id);
                        if (!ps)
                            return;
                        name = ps.NAME;
                        lon = ps.LONGITUDE;
                        lat = ps.LATITUDE;
                        vol = ps.VOLTAGE_TYPE;
                        pstype = ps.PlantStationType;
                        groups.add([lon, lat, vol, pstype], row);
                    });
                    groups = groups.result;
                    Ysh.Array.each(groups, function (g) {
                        info.push({ height: sz, width: sz, longitude: g.name[0], latitude: g.name[1], voltage: g.name[2], stationType: g.name[3], data: { data: g.data } });
                    });
                }
                if (o.showIconState[type]) {
                    m.menu("ShowMutipleIcons", true, { type: type, url: icon, locateData: info });
                    //m.menu("ShaderGlowMeshForStation", true, { type: type, Info: info });
                }
            });
        },
        showPointIcon: function (type, icon, data, idxLon, idxLat, fShowTip, w, h) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var float = this.getMainObject("floatDataInst");
            if (float) float.registerShowData(type, fShowTip);
            var info = [];
            if (fShowTip) {
                var groups = Ysh.Array.groupBy(data, [idxLon, idxLat]);
                Ysh.Array.each(groups, function (g) {
                    info.push({ longitude: g.name[0], latitude: g.name[1], data: { data: g.data } });
                });
            } else {
                Ysh.Array.each(data, function (row) {
                    var lon = row[idxLon];
                    var lat = row[idxLat];
                    if (lon && lat)
                        info.push({ longitude: lon, latitude: lat, data: { data: row } });
                });
            }
            m.menu("showImageIcon", true, { stopLight: true, time: 0, type: type, images: { imgCode: 0, imgUrl: icon, height: h, width: w }, locateData: info });
        },
        showPointIcons: function (type, fIcon, data, idxLon, idxLat, fShowTip, sz, fPos) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            var float = this.getMainObject("floatDataInst");
            if (float) float.registerShowData(type, fShowTip);
            var infos = [];
            var icons = [];
            var arrows = [];
            var getDegree = function (row) { if (!fPos) return undefined; return ProjectSGC.Helper.getDegree(fPos(row)); }
            var getSize = function (sz, row) {
                if (Ysh.Type.isFunction(sz)) return sz(row);
                if (sz.width) return sz;
                return { width: sz, height: sz };
            }
            var arrow_icon = "/i/sgc/icon/fire/arrow.png";
            if (fShowTip) {
                var dataGroup = [];
                Ysh.Array.each(data, function (row) {
                    var icon = fIcon(row);
                    var idx = icons.indexOf(icon);
                    if (idx < 0) {
                        icons.push(icon);
                        infos.push([]);
                        dataGroup.push([]);
                        idx = icons.length - 1;
                    }
                    dataGroup[idx].push(row);
                });
                for (var i = 0; i < icons.length; i++) {
                    var d = dataGroup[i];
                    var groups = Ysh.Array.groupBy(d, [idxLon, idxLat]);
                    Ysh.Array.each(groups, function (g) {
                        var degree = getDegree(g.data[0]);
                        var sz1 = getSize(sz, g.data[0]);
                        infos[i].push({ height: sz1.height, width: sz1.width, longitude: g.name[0], latitude: g.name[1], data: { data: g.data }, extendImage: { rotation: degree, imgUrl: arrow_icon, width: 6, height: 6 } });
                        //if (typeof degree != "undefined")
                        //    arrows.push({ rotation: degree, longitude: g.name[0], latitude: g.name[1], data: {} });
                    });
                }
            } else {
                Ysh.Array.each(data, function (row) {
                    var lon = row[idxLon];
                    var lat = row[idxLat];
                    var icon = fIcon(row);
                    var idx = icons.indexOf(icon);
                    if (idx < 0) {
                        icons.push(icon);
                        infos.push([]);
                        idx = icons.length - 1;
                    }
                    var degree = getDegree(row);
                    var sz1 = getSize(sz, row);
                    infos[idx].push({ height: sz1.height, width: sz1.width, longitude: lon, latitude: lat, data: { data: row }, extendImage: { rotation: degree, imgUrl: arrow_icon, width: 6, height: 6 } });
                    //if (typeof degree != "undefined")
                    //    arrows.push({ rotation: degree, longitude: lon, latitude: lat, data: {} });
                });
            }
            for (var i = 0; i < icons.length; i++)
                m.menu("showImageIcon", true, { stopLight: true, time: 0, type: type, images: { imgCode: 0, imgUrl: icons[i] }, locateData: infos[i] });
            //if (arrows.length > 0)
            //    m.menu("showImageIcon", true, { type: type, images: { imgCode: 0, imgUrl: "/i/sgc/icon/fire/arrow.png", z_index: 1, height: 8, width: 8 }, locateData: arrows });
        },
        hideIcon: function (type) {
            var m = this.getMainObject("MapOpeInst");
            if (!m) return;
            m.menu("showImageIcon", false, { type: type });
            m.menu("ShaderGlowMeshForStation", false, { type: type });
            this.showIconState[type] = false;
        },
        getTipsHtml: function (type, id, head, contents) {
            var html = "<div class='map-tip-all'>";
            html += "<img src='/i/sgc/close.gif' class='u-icon-delete'>";
            html += "<div class='map-tip'";
            if (type)
                html += " onclick='ToPostStringMsg(\"" + type + "\",\"" + id + "\")'";
            html += "><div class='head'>" + head + "</div>";
            html += "<div class='sep'></div>"
            Ysh.Array.each(contents, function (content) {
                html += "<div class='" + (content.type || "") + "'>" + (content.html || "") + "</div>";
            });
            html += "</div>";
            html += '<div style = "position:relative;height:16px;" ><div class="map-tip-arrow"></div></div>';
            return html;
        },
        Glow: {
            state: false,
            getColorFunction: function (values, colors) {
                return function (v) {
                    for (var i = 0; i < values.length; i++) {
                        var v0 = values[i];
                        if (i == 0) {
                            if (v <= v0)
                                return colos[i];
                            continue;
                        }
                        if (v < v0)
                            return colos[i];
                    }
                    return colors[values.length];
                };
            },
            getMeasDataFunction: function (colCount, bRate) {
                return bRate ? function (data) {
                    var result = [];
                    colCount = colCount || 60;
                    for (var i = 0; i < data.length; i++) {
                        var row = data[i];
                        var mva = row[colCount + 3];
                        if (!mva) continue;
                        mva = parseFloat(mva);
                        if (!mva) continue;
                        for (var j = colCount - 1; j >= 0; j--) {
                            var v = row[j + 3];
                            if (v === "")//无数据
                                continue;
                            v = parseFloat(v) / mva;
                            result.push({ row: row, value: v });
                            break;
                        }
                    }
                    return result;
                } : function (data) {
                    var result = [];
                    colCount = colCount || 60;
                    for (var i = 0; i < data.length; i++) {
                        var row = data[i];
                        for (var j = colCount - 1; j >= 0; j--) {
                            var v = row[j + 3];
                            if (v === "")//无数据
                                continue;
                            v = parseFloat(v);
                            result.push({ row: row, value: v });
                            break;
                        }
                    }
                    return result;
                }
            },
            hide: function () {
                this.state = false;
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: false });
            },
            show: function (fGetMsg, info, f) {
                this.state = true;
                var msg = fGetMsg();
                if ((msg.length > 0) && this.state)//可能取完数据准备发消息的时候，已经离开了页面，或者关闭了
                    //ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: true, data: msg });
                {
                    var mapmsg = { eventType: "menuope", menuname: "showGlowColor", selstate: true, data: { locateInfo: msg, gradient: info } };
                    if (f)
                        f(mapmsg);
                    ProjectSGC.Map.postMessage(mapmsg);
                }
            },
            getRecentMsg: function (name, sql, fColor, bRate) {
                var data = PDP.read("SGC", sql, []);
                if (!data.check("获取" + name + "数据", true))
                    return [];
                data = data.value;
                var result = data;
                var msg = [];
                for (var i = 0; i < result.length; i++) {
                    var item = result[i];
                    var row = item;
                    var v = parseFloat(row[3]);
                    var id = row[0];
                    var lon = row[1];
                    var lat = row[2];
                    var clr = (Ysh.Type.isFunction(fColor) ? fColor(v, row) : fColor.getColor(v, row));
                    if (clr == "skip")
                        continue;
                    var m = { stationid: id, longitude: lon, latitude: lat, glowColor: clr, data: { value: v } };
                    msg.push(m);
                }
                return msg;
            },
            showRecent: function (name, sql, fColor, bRate, info, f) {
                this.show(function () { return ProjectSGC.Map.Glow.getRecentMsg(name, sql, fColor, bRate); }, info, f);
            },
            getMsgBySQL: function (name, maxTimeSQL, timeDataSQL, fGetData, fColor, bRate) {
                if (!fGetData)
                    fGetData = this.getMeasDataFunction(60, bRate);
                var year = (new Date()).getFullYear();
                var exes = [
                    { type: 'read', db: 'SGC', sql: maxTimeSQL, args: [year] }
                    , { type: 'read', db: 'SGC', sql: timeDataSQL, args: [{ ref: 0, value: 0 }, year] }
                ];
                var data = PDP.exec(exes);
                if (!data.check("获取" + name + "数据", true))
                    return [];
                data = data.value[1];
                var result = fGetData(data);
                var msg = [];
                for (var i = 0; i < result.length; i++) {
                    var item = result[i];
                    var row = item.row;
                    var v = item.value;
                    var id = row[0];
                    var lon = row[1];
                    var lat = row[2];
                    var clr = (Ysh.Type.isFunction(fColor) ? fColor(v, row) : fColor.getColor(v, row));
                    if (clr == "skip")
                        continue;
                    var m = { stationid: id, longitude: lon, latitude: lat, glowColor: clr, data: { value: v } };
                    msg.push(m);
                }
                return msg;
            },
            showBySQL: function (name, maxTimeSQL, timeDataSQL, fGetData, fColor, bRate, info) {
                this.show(function () { return ProjectSGC.Map.Glow.getMsgBySQL(name, maxTimeSQL, timeDataSQL, fGetData, fColor, bRate); }, info);
            },
            showBySQLs: function (name, sqls, fColor, bRate) {
                this.state = true;
                var fGetData = this.getMeasDataFunction(bRate);
                var year = (new Date()).getFullYear();
                var exes = [];
                for (var n = 0; n < sqls.length; n += 2) {
                    exes.push({ type: 'read', db: 'SGC', sql: sqls[n], args: [year] });
                    exes.push({ type: 'read', db: 'SGC', sql: sqls[n + 1], args: [{ ref: n, value: 0 }, year] });
                }
                var data = PDP.exec(exes);
                if (!data.check("获取" + name + "数据", true))
                    return;
                for (var n = 0; n < sqls.length; n += 2) {
                    var data_n = data.value[n + 1];
                    var result = fGetData(data_n);
                    var msg = [];
                    for (var i = 0; i < result.length; i++) {
                        var item = result[i];
                        var row = item.row;
                        var v = item.value;
                        var id = row[0];
                        var lon = row[1];
                        var lat = row[2];
                        var clr = (Ysh.Type.isFunction(fColor) ? fColor(v, row) : fColor.getColor(v, row));
                        if (clr == "skip")
                            continue;
                        var m = { stationid: id, longitude: lon, latitude: lat, glowColor: clr, data: { value: v } };
                        msg.push(m);
                    }
                }
                if (this.state)//可能取完数据准备发消息的时候，已经离开了页面，或者关闭了
                    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showGlowColor", selstate: true, data: msg });
            },
            showForData: function (name, vm, maxTimeSQL, timeDataSQL, fGetColor) {
                var ud = { d: null, getColor: function (v) { return this.d.getColor(v); } };
                this.showBySQL(name, maxTimeSQL, timeDataSQL, function (data) {
                    var unitRecentData = {
                        colors: ["#FF0000", "#FF507B", "#FF823C", "#FF893C", "#FFFF3C", "#9AFF3C", "#00FFDE", "#00DEFF", "#4DB4FF", "#4D91FF", "#4D4DFF", "#9132FF"],
                        result: null,
                        max: 0,
                        min: 0,
                        diff: 0,
                        setAllData: function (data) {
                            this.result = [];
                            var first = true;
                            for (var i = 0; i < data.length; i++) {
                                var row = data[i];
                                for (var j = 60 - 1; j >= 0; j--) {
                                    var v = row[j + 3];
                                    if (v === "")//无数据
                                        continue;
                                    v = parseFloat(v);
                                    if (first) {
                                        this.max = this.min = v;
                                        first = false;
                                    } else {
                                        if (v > this.max)
                                            this.max = v;
                                        else if (v < this.min)
                                            this.min = v;
                                    }
                                    this.result.push({ row: row, value: v });
                                    break;
                                }
                            }
                            this.diff = (this.max - this.min) / this.colors.length;
                        },
                        getColor: function (v) {
                            return this.colors[parseInt((v - this.min) / this.diff, 10)];
                        },
                        getLegendContent: function () {
                            var arr = [];
                            for (var i = 0; i < this.colors.length; i++) {
                                var start = this.min + i * this.diff;
                                var end = Ysh.Number.toFixed(start + this.diff, 2);
                                start = Ysh.Number.toFixed(start, 2);
                                var color = this.colors[i];
                                arr.push({ color: color, text: start + " - " + end });
                            }
                            return arr;
                        }
                    };
                    ud.d = unitRecentData;
                    unitRecentData.setAllData(data);
                    return unitRecentData.result;
                }, fGetColor || ud);
                if (ud.d)
                    vm.legendContent = ud.d.getLegendContent();
            }
        },
        getLineStationBorder: function (m, lineIds, stationIds) {
            var sMaxMin = {
                mmLon: null, mmLat: null,
                mm: function () {
                    return {
                        min: null, max: null, add: function (v) {
                            v = parseFloat(v);
                            if (this.min === null) { this.min = this.max = v; return; }
                            if (this.max < v) this.max = v;
                            else if (v < this.min) this.min = v;
                        }
                    }
                },
                add: function (s) {
                    if (!s) return;
                    if (s.LONGITUDE && s.LATITUDE) {
                        if (!this.mmLon) this.mmLon = this.mm();
                        this.mmLon.add(s.LONGITUDE);
                        if (!this.mmLat) this.mmLat = this.mm();
                        this.mmLat.add(s.LATITUDE);
                    }
                }, vols: []
            }
            for (var i = 0; i < lineIds.length; i++) {
                var line = m.getLine(lineIds[i]);
                if (!line) continue;
                sMaxMin.vols.push(line[ProjectSGC.LINE.VOLTAGE]);
                sMaxMin.add(m.getStation(line[ProjectSGC.LINE.START_ST]));
                sMaxMin.add(m.getStation(line[ProjectSGC.LINE.END_ST]));
            }
            for (var i = 0; i < stationIds.length; i++) {
                var s = m.getStation(stationIds[i]);
                if (!s) continue;
                sMaxMin.vols.push(s["code"]);
                sMaxMin.add(s);
            }
            if (sMaxMin.mmLon == null) return false;
            return { maxLng: sMaxMin.mmLon.max, minLng: sMaxMin.mmLon.min, maxLat: sMaxMin.mmLat.max, minLat: sMaxMin.mmLat.min, vols: sMaxMin.vols };
        },
        showStationLines: function (lineids, stationids, appName) {
            this.setAppName(appName);
            this.clearStationLines(appName);
            if ((lineids.length < 1) && (stationids.length < 1)) return;
            var m = ProjectSGC.Map.getMainObject("ModelList");
            if (!m) return;
            var stations = [];
            var lines = [];
            var lineobjs = [];
            for (var i = 0; i < lineids.length; i++) {
                var lineid = lineids[i];
                var line = m.getLine(lineid);
                if (!line) continue;
                var start_st_id = line[ProjectSGC.LINE.START_ST];
                var end_st_id = line[ProjectSGC.LINE.END_ST];
                var start_st_obj = m.getStation(start_st_id);
                if (start_st_obj) {
                    var start_st = Ysh.Object.clone(start_st_obj);
                    delete start_st.data.owner;
                    stations.push(start_st);
                }
                var end_st_obj = m.getStation(end_st_id);
                if (end_st_obj) {
                    var end_st = Ysh.Object.clone(end_st_obj);
                    delete end_st.data.owner;
                    stations.push(end_st);
                }
                var l = m.getShowLine(line[0]);
                if (l) {
                    l = Ysh.Object.clone(l);
                    delete l.data.owner;
                    lines.push(l);
                    lineobjs.push(line);
                }
            }
            for (var i = 0; i < stationids.length; i++) {
                var stid = stationids[i];
                var s = m.getStation(stid);
                if (!s) continue;
                var station = Ysh.Object.clone(s);
                delete station.data.owner;
                stations.push(station);
            }
            ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineById', selstate: true, data: { lstStationId: stations, lstLineId: lines } });
            var mapData = ProjectSGC.Global.getMainObject("MapData");
            mapData._sData.add(appName, stations);
            mapData._lData.add(appName, lines);
            return [lineobjs, stations];
        },
        clearStationLines: function (appName) {
            var mapData = ProjectSGC.Global.getMainObject("MapData");
            var stations = mapData._sData.remove(appName);
            var lines = mapData._lData.remove(appName);
            ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineById', selstate: false, data: { lstStationId: stations, lstLineId: lines } });
        },
        getModeList: function (modes) {
            var arr = [];
            for (var t in modes) {
                var v = modes[t];
                arr.addSkipSame(v.mode);
            }
            arr.sort();
            return arr.join(",");
        },
        setAppName: function (appName) {
            var mapData = ProjectSGC.Global.getMainObject("MapData");
            mapData.appName = appName;
        },
        defaultModeApps: [],
        isRunOtherModeApp: function () {
            var inst = this.getInst();
            if (!inst.modes) return false;
            for (var k in inst.modes) {
                if (this.defaultModeApps.indexOf(k) < 0)
                    return true;
            }
            return false;
        },
        removeModeApp: function (inst, type) {
            if (inst.modes[type])
                delete inst.modes[type];
            this.setAppName(type);
            this.clearStationLines(type);
        },
        returnDefaultMode: function () {
            this.getInst().postMessage({ eventType: 'menuope', menuname: 'SetYunTuMode', selstate: true, data: { modename: "main", modelevel: [] } });
        },
        setMode: function (type, mode, level) {
            level = level || [];
            var inst = this.getInst();
            if (!inst.modes) inst.modes = {};
            var old = this.getModeList(inst.modes);
            if (!mode) {
                if (inst.modes[type])
                    delete inst.modes[type];
                this.setAppName(type);
                this.clearStationLines(type);
            } else {
                if (this.defaultModeApps.indexOf(type) < 0) {//非默认界面模式，去掉默认界面设置的模式
                    for (var i = 0; i < this.defaultModeApps.length; i++)
                        this.removeModeApp(inst, this.defaultModeApps[i]);
                }
                var m = inst.modes[type];
                if (m) {
                    if ((m.mode == mode) && (m.level.join() == level.join())) return;
                }
                inst.modes[type] = { mode: mode, level: level };
            }
            if (old == this.getModeList(inst.modes))
                return;//已经有相应模式，不用重刷
            var data = [];
            for (var t in inst.modes) {
                var v = inst.modes[t];
                data.push({ modename: v.mode, modelevel: v.level });
            }
            if (data.length == 0) {
                if (this.defaultModeApps.indexOf(type)<0)
                    this.returnDefaultMode();
                else
                    inst.postMessage({ eventType: 'menuope', menuname: 'SetYunTuMode', selstate: true, data: { modename: "main", modelevel: [] } });
            } else {
                inst.postMessage({ eventType: 'menuope', menuname: 'SetYunTuMode', selstate: true, data: data });
                var mapData = ProjectSGC.Global.getMainObject("MapData");
                if (mapData._sData) {
                    inst.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineById', selstate: true, data: { _noData: true, lstStationId: mapData._sData.all(), lstLineId: [] } });
                }
                if (mapData._lData) {
                    inst.postMessage({ eventType: 'menuope', menuname: 'ShowStationLineById', selstate: true, data: { _noData: true, lstStationId: [], lstLineId: mapData._lData.all() } });
                }
            }
        }
    },
    EChart: {
        Colors: {
            BG: "#585858",
            AXIS_LABEL: "#BBBBBB",
            AXIS_NAME: "#BBBBBB",
            TEXT: "white"
        },
        Size: { MARGIN: 20 },
        setSingleAxisOption: function (axis) {
            if (axis.name) {
                if (!axis.nameTextStyle)
                    axis.nameTextStyle = {};
                axis.nameTextStyle.color = ProjectSGC.EChart.Colors.AXIS_NAME;
            }
            if (!axis.axisLabel)
                axis.axisLabel = {};
            if (axis.axisLabel.show !== false) {
                axis.axisLabel.color = ProjectSGC.EChart.Colors.AXIS_LABEL;
            }
        },
        doForArrayOrOne: function (o, f) {
            if (!o)
                return;
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++)
                    f(o[i]);
            } else {
                f(o);
            }
        },
        setCommonOption: function (option) {
            if (!option.backgroundColor)
                option.backgroundColor = this.Colors.BG;
            this.doForArrayOrOne(option.xAxis, this.setSingleAxisOption);
            this.doForArrayOrOne(option.yAxis, this.setSingleAxisOption);
            this.doForArrayOrOne(option.series, function (s) { s.hoverAnimation = false; });
            return option;
        },
        getTemperatureLabel: function (offset) {
            return {
                show: true, position: "top", offset: offset || [0, 0]
                , formatter: function (v) {
                    return v.value + "°";
                }
            };
        },
        getPieOption: function (title, name, data, typeIdx, valueIdx) {
            if (typeof typeIdx == "undefined") typeIdx = 0;
            if (typeof valueIdx == "undefined") valueIdx = typeIdx + 1;
            var types = [];
            var sData = [];
            for (var i = 0; i < data.length; i++) {
                var row = data;
                types.push(row[typeIdx]);
                sData.push({ value: row[valueIdx], name: row[typeIdx] });
            }
            var option = {
                "legend": { "show": false },
                "tooltip": {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                "grid": {}, "xAxis": [{ "type": "category" }], "yAxis": [{ "type": "value" }],
                "series": [{
                    "name": "所有厂站", "type": "pie", minAngle: 5, avoidLabelOverlap: true, "label": { "formatter": "{d}% {b}", "fontSize": SGC.FONTSIZE * 0.8 }
                    , "radius": ["48%", "71%"],
                    "itemStyle": {
                        normal: {

                            labelLine: {
                                show: true,
                                length: 0.1
                            }
                        }
                    }
                }]
            };
            return option;
        },
        hBarItemNeedCombine: function (arrData, index) {
            var p = arrData[index].toString();
            if (p == "") return 0;
            if (index == 0) {
                return 0;
            }
            var n = this.hBarItemNeedCombine(arrData, index - 1) || 0;
            if (arrData[index] == arrData[index - 1]) return (0 - n);
            return -2 - n;
            //if (arrData[index] == arrData[index + 1]) return -1;
            //return -2;
            var n = 0;
            if (arrData[index] == arrData[index - 1]) n++;
            if (arrData[index] == arrData[index + 1]) n++;
            return (n == 0) ? -2 : ((n == 1) ? -1 : 3);
        },
        getHBarLabel: function (arrData, index) {
            var p = arrData[index].toString();
            //return this.hBarItemNeedCombine(arrData, index)+"\n"+p;
            if (p == "") return p;
            var min = index, max = index;
            for (var i = index - 1; i >= 0; i--)            {
                if (arrData[i] == p) min = i;
                else break;
            }
            for (var i = index + 1; i < arrData.length; i++) {
                if (arrData[i] == p) max = i;
                else break;
            }
            return (index == parseInt((min + max) / 2)) ? p : "";
        },
        getHBarSize1: function (wAll, arrData, params) {
            if (arrData.length == 0)
                return [0, 0];
            var v = arrData[params.dataIndex];
            if (!v && (v !== 0))
                return [0, 0];
            var nCombine = this.hBarItemNeedCombine(arrData, params.dataIndex);
            var w = parseInt(wAll / arrData.length, 10);
            return [w + 2 * nCombine, 3];
        },
        getHBarSize: function (wAll, arrData, params) {
            if (arrData.length == 0)
                return [0, 0];
            var index = params.dataIndex;
            var p = arrData[index].toString();
            if (p == "") return p;
            var min = index, max = index;
            for (var i = index - 1; i >= 0; i--) {
                if (arrData[i] == p) min = i;
                else break;
            }
            for (var i = index + 1; i < arrData.length; i++) {
                if (arrData[i] == p) max = i;
                else break;
            }
            if (index != parseInt((min + max) / 2))
                return [0, 0];
            var size = (max - min + 1);
            return [size * parseInt(wAll / arrData.length, 10) - (size > 2 ? 10 : 4) , 3];
        }
    },
    Weather: {
        getImg: function (type, time) {
            var path = "/i/sgc/tq/";
            switch (type) {
                case '':
                case '晴':
                    return path + "qing.png";
                case '多云':
                    return path + "duoyun.png";
                case '小雨':
                    return path + "xiaoyu.png";
                case '雨':
                case '阵雨':
                case '雷阵雨':
                case '冻雨':
                case '中雨':
                case '大雨':
                case '暴雨':
                case '大暴雨':
                case '特大暴雨':
                    return path + "yu.png";
                case '阴':
                case '冰雹':
                case '雨夹雪':
                case '雷暴':
                case '雪':
                case '阵雪':
                case '小雪':
                case '中雪':
                case '大雪':
                case '暴雪':
                case '雾霾':
                case '雾':
                case '霾':
                case '沙尘':
                case '沙尘暴':
                case '浮尘':
                case '扬沙':
                case '强沙尘暴':
                case '风':
                case '大风':
                case '狂风':
                case '龙卷风':
                case '台风':
                case '飙线风':
                default:
                    return path + "yin.png";
            }
        },
        getOption24: function () {
            var xtime = [];
            var arrTemperature = [];
            var arrType = [];
            var arrAir = [];
            var arrWind = [];
            var arrZero = [];
            for (var i = 0; i < 24; i++) {
                xtime.push(((i < 10) ? "0" : "") + i);
                arrTemperature.push(parseInt(100 * Math.random(), 10) % 30);
                arrType.push(parseInt(100 * Math.random(), 10) % 10);
                arrAir.push(parseInt(100 * Math.random(), 10) % 100);
                arrWind.push(parseInt(100 * Math.random(), 10) % 12);
                arrZero.push(0);
            }

            var timeData = xtime;

            return ProjectSGC.EChart.setCommonOption({
                axisPointer: {
                    link: { xAxisIndex: 'all' },
                    label: {
                        backgroundColor: '#777'
                    }
                },
                grid: [{//180
                    left: 50,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    top: 10,
                    height: 80
                }, {
                    left: 50,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    bottom: 60,
                    height: 30
                }, {
                    left: 50,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    bottom: 30,
                    height: 30
                }],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        show: false
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        show: true,
                        data: timeData,
                        boundaryGap: false,
                        name: '空气',
                        nameLocation: 'start',
                        axisLabel: { show: false },
                        axisLine: { show: false },
                        axisTick: { show: false }
                    },
                    {
                        gridIndex: 2,
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        position: 'left',
                        name: '风力',
                        nameLocation: 'start',
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: { color: "white" }
                    }
                ],
                yAxis: [
                    {
                        name: '',
                        type: 'value',
                        axisLine: { show: false },
                        axisTick: { show: false },
                        splitLine: { show: false }
                    },
                    {
                        gridIndex: 1,
                        name: '空气',
                        type: 'value',
                        min: 0,
                        max: 0.2,
                        show: false
                    },
                    {
                        gridIndex: 2,
                        name: '风力',
                        type: 'value',
                        min: 0,
                        max: 0.2,
                        show: false
                    }
                ],
                series: [
                    {
                        name: '温度',
                        type: 'line',
                        symbolSize: 0,
                        data: arrTemperature,
                        color: '#D4D4D4',
                        smooth: true
                    },
                    {
                        name: '空气',
                        color: '#8C6A2A',
                        type: 'scatter',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        symbol: 'rect',
                        symbolSize: [20, 4],
                        data: arrZero,
                        label: {
                            show: true,
                            position: 'top',
                            distance: 1,
                            color: ProjectSGC.EChart.Colors.TEXT,
                            formatter: function (params) {
                                return arrAir[params.dataIndex];
                            }
                        }
                    },
                    {
                        name: '风力',
                        color: '#4A6A74',
                        type: 'scatter',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        symbol: 'rect',
                        symbolSize: [20, 4],//function (value, params) {                            return [arrWind[params.dataIndex], 8];                        },
                        data: arrZero,
                        label: {
                            show: true,
                            position: 'top',
                            distance: 1,
                            color: ProjectSGC.EChart.Colors.TEXT,
                            formatter: function (params) {
                                return arrWind[params.dataIndex] + "级";
                            }
                        }
                    }
                ]
            });
        },
        getOption15: function () {
            var xtime = [];
            var arrMaxTemp = [];
            var arrMaxType = [];
            var arrMinTemp = [];
            var arrMinType = [];
            var arrWindD = [];
            var arrWindP = [];
            var arrZero = [];
            var arrZero0 = [];
            arrMinType = arrMaxType = ["晴", "多云", "阴", "雨", "阵雨", "雷阵雨", "冰雹", "雨夹雪", "雨", "阵雨", "雷阵雨", "冰雹", "雨夹雪", "冻雨", "小雨"];
            arrMaxTemp = [14, 15, 13, 17, 29, 24, 30, 16, 18, 12, 34, 20, 11, 30, 20];
            arrMinTemp = [4, 5, 3, 7, 9, 4, 0, 6, 8, 2, 4, 2, 1, 3, 2];
            var arrMaxType1 = [];
            var arrMinType1 = [];
            for (var i = 0; i < 15; i++) {
                xtime.push("2019-05-" + ((i < 9) ? "0" : "") + (i + 1));
                arrWindD.push(["西南风", "东南风", "西北风"][i % 3]);
                arrWindP.push(["3", "5", "2"][i % 3]);
                arrZero.push(0);
                arrMaxType1.push({ value: 0, symbol: "image://" + ProjectSGC.Weather.getImg(arrMaxType[i]) });
                arrMinType1.push({ value: 0, symbol: "image://" + ProjectSGC.Weather.getImg(arrMinType[i]) });
            }

            var timeData = xtime;

            return ProjectSGC.EChart.setCommonOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                axisPointer: {
                    link: { xAxisIndex: 'all' },
                    label: {
                        backgroundColor: '#777'
                    }
                },
                grid: [{//180
                    left: ProjectSGC.EChart.Size.MARGIN,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    top: 130,
                    height: 100
                }, {
                    left: ProjectSGC.EChart.Size.MARGIN,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    top: 0,
                    height: 100
                }, {
                    left: ProjectSGC.EChart.Size.MARGIN,
                    right: ProjectSGC.EChart.Size.MARGIN,
                    top: 280,
                    height: 100
                }],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        show: false
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        show: false
                    },
                    {
                        gridIndex: 2,
                        type: 'category',
                        boundaryGap: false,
                        data: timeData,
                        show: false
                    }
                ],
                yAxis: [
                    {
                        name: '高',
                        type: 'value',
                        show: false
                    },
                    {
                        gridIndex: 1,
                        name: '温度',
                        type: 'value',
                        min: 0,
                        max: 0.2,
                        show: false
                    },
                    {
                        gridIndex: 2,
                        name: '低',
                        type: 'value',
                        min: 0,
                        max: 0.2,
                        show: false,
                        inverse: true
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        symbolSize: 4,
                        data: arrMaxTemp,
                        color: '#D7A75D',
                        smooth: true
                    },
                    {
                        name: '',
                        type: 'line',
                        symbolSize: 4,
                        data: arrMinTemp,
                        color: '#1B8DC4',
                        smooth: true
                    },
                    {
                        name: '高',
                        color: '#8C6A2A',
                        type: 'scatter',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        symbolSize: [20, 20],
                        data: arrMaxType1,
                        label: {
                            show: true,
                            position: 'top',
                            distance: 1,
                            color: 'white',
                            formatter: function (params) {
                                var n = params.dataIndex;
                                return Ysh.Time.formatString(xtime[n], "周[w]\n[m]/[d]") + "\n" + arrMaxType[n];
                            }
                        }
                    },
                    {
                        name: '低',
                        color: '#4A6A74',
                        type: 'scatter',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        symbolSize: [20, 20],
                        data: arrMinType1,
                        label: {
                            show: true,
                            position: 'bottom',
                            distance: 1,
                            color: 'white',
                            formatter: function (params) {
                                var n = params.dataIndex;
                                return arrMinType[n] + "\n" + arrWindD[n] + "\n" + arrWindP[n] + "级";
                            }
                        }
                    }
                ]
            });
        },
        test: function () {
            var xtime = [];
            var arrTemperature = [];
            var arrType = [];
            var arrAir = [];
            var arrWind = [];
            var arrZero = [];
            for (var i = 0; i < 24; i++) {
                xtime.push(((i < 10) ? "0" : "") + i);
                arrTemperature.push(parseInt(100 * Math.random(), 10) % 30);
                arrType.push(parseInt(100 * Math.random(), 10) % 10);
                arrAir.push(parseInt(100 * Math.random(), 10) % 100);
                arrWind.push(parseInt(100 * Math.random(), 10) % 12);
                arrZero.push(0);
            }
            /*
        {
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: true},
            data: timeData
        },
        {
            gridIndex: 1,
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: true},
            data: timeData,
            position: 'top'
        }
             */
            return {
                xAxis: [{
                    type: 'category', data: xtime, boundaryGap: false,
                    axisLine: { onZero: true }, axisTick: { show: true, inside: false, alignWithLabel: true }
                },
                //{ gridIndex: 1, name: "空气", boundaryGap: false, data: arrAir, axisTick: { show: false } },
                {
                    gridIndex: 1, name: "风力", boundaryGap: false,
                    axisLine: { onZero: true }, data: arrWind, axisTick: { show: false }
                }],
                axisPointer: {
                    link: { xAxisIndex: 'all' }
                },
                grid: [{
                    left: 50,
                    right: 50,
                    height: '35%'
                }, {
                    left: 50,
                    right: 50,
                    top: '55%',
                    height: '35%'
                }],
                yAxis: [{ name: "" }],
                series: [{
                    data: arrTemperature,
                    type: 'line',
                    //lineStyle: { opacity: 0 },
                    // }, {
                    //        data: arrZero,
                    //        type:'scatter'
                }, {
                    data: arrZero,
                    type: 'scatter'
                }]
            };
        },
        getWindDirection: function (WindDirection) {
            if (WindDirection == 0 || WindDirection >= 348.76 || WindDirection <= 11.25) {
                return "北风";
            }
            else if (WindDirection == 22.5 || WindDirection >= 11.26 && WindDirection <= 33.75) {
                return "北风";
            }
            else if (WindDirection == 45 || WindDirection >= 33.76 && WindDirection <= 56.25) {
                return "东北风";
            }
            else if (WindDirection == 67.5 || WindDirection >= 56.26 && WindDirection <= 78.75) {
                return "东北风";
            }
            else if (WindDirection == 90 || WindDirection >= 78.76 && WindDirection <= 101.25) {
                return "东风";
            }
            else if (WindDirection == 112.5 || WindDirection >= 101.26 && WindDirection <= 123.75) {
                return "东风";
            }
            else if (WindDirection == 135 || WindDirection >= 123.76 && WindDirection <= 146.25) {
                return "东南风";
            }
            else if (WindDirection == 157.5 || WindDirection >= 146.26 && WindDirection <= 168.75) {
                return "东南风";
            }
            else if (WindDirection == 180 || WindDirection >= 168.76 && WindDirection <= 191.25) {
                return "南风";
            }
            else if (WindDirection == 202.5 || WindDirection >= 191.26 && WindDirection <= 213.75) {
                return "南风";
            }
            else if (WindDirection == 225 || WindDirection >= 213.76 && WindDirection <= 236.25) {
                return "西南风";
            }
            else if (WindDirection == 247.5 || WindDirection >= 236.26 && WindDirection <= 258.75) {
                return "西南风";
            }
            else if (WindDirection == 270 || WindDirection >= 258.76 && WindDirection <= 281.25) {
                return "西风";
            }
            else if (WindDirection == 295.5 || WindDirection >= 281.26 && WindDirection <= 303.75) {
                return "西风";
            }
            else if (WindDirection == 315 || WindDirection >= 303.76 && WindDirection <= 326.25) {
                return "西北风";
            }
            else if (WindDirection == 337.5 || WindDirection >= 326.26 && WindDirection <= 348.75) {
                return "西北风";
            }
        },
        getWindLevel: function (WindSpeed) {
            if (WindSpeed < 0.2)
                return 0;
            if (WindSpeed >= 0.3 && WindSpeed < 1.5)
                return 1;
            if (WindSpeed >= 1.6 && WindSpeed < 3.3) 
                return 2;
            if (WindSpeed >= 3.4 && WindSpeed < 5.4)
                return 3;
            if (WindSpeed >= 5.5 && WindSpeed < 7.9) 
                return 4;
            if (WindSpeed >= 8.0 && WindSpeed < 10.7) 
                return  5;
            if (WindSpeed >= 10.8 && WindSpeed < 13.8) {
                return  6;
            }
            else if (WindSpeed >= 13.9 && WindSpeed < 17.1) {
                return  7;
            }
            else if (WindSpeed >= 17.2 && WindSpeed < 20.7) {
                return  8;
            }
            else if (WindSpeed >= 20.8 && WindSpeed < 24.4) {
                return  9;
            }
            else if (WindSpeed >= 24.5 && WindSpeed < 28.4) {
                return  10;
            }
            else if (WindSpeed >= 28.5 && WindSpeed < 32.6) {
                return  11;
            }
            else if (WindSpeed >= 32.7 && WindSpeed < 36.9) {
                return  12;
            }
            else if (WindSpeed >= 37.0 && WindSpeed < 41.4) {
                return  13;
            }
            else if (WindSpeed >= 41.5 && WindSpeed < 46.1) {
                return  14;
            }
            else if (WindSpeed >= 46.1 && WindSpeed < 50.9) {
                return  15;
            }
            else if (WindSpeed >= 51.0) {
                return  16;
            }
        }
    },
    Index: {
        showJxp: function (dts) {
            var lst = null;
            if (dts instanceof Array) {
                lst = PDP.read("SGC", "sgc/jx:GetRangeList", dts);
            } else {
                dts = [dts || Ysh.Time.formatString(new Date(), "111000")];
                lst = PDP.read("SGC", "sgc/jx:GetDayList", dts);
            }
            if (!lst.check("获取检修申请数据", true))
                return;
            lst = lst.value;
            var data = [];
            for (var i = 0; i < lst.length; i++) {
                var row = lst[i];
                var id = row[0];
                var stime = row[1];
                var etime = row[2];
                var content = row[3];
                var rstime = row[7];
                var retime = row[8];
                var devid = row[9];
                var devtype = row[10];
                var devname = row[11];
                var staid = row[12];
                var lat = parseFloat(row[13]);
                var lon = parseFloat(row[14]);
                var contents = [{ type: "time", html: "计划时间：" + Ysh.Time.getRangeString(stime, etime) }];
                if (rstime != "")
                    contents.push({ type: "time", html: "实际时间：" + Ysh.Time.getRangeString(rstime, retime) });
                var html = ProjectSGC.Map.getTipsHtml("showJxp", id, devname + ":" + content, contents);
                if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
                    data.push({ lineid: devid, html: html });
                } else {
                    data.push({ stationid: staid, longitude: lon, latitude: lat, html: html });
                }
            }
            ProjectSGC.Map.postMessage({
                eventType: "menuope"
                , menuname: "showWarnInfo"
                , data: data
            });
        },
        showYjNotice: function (dts) {
            var lst = null;
            if (dts instanceof Array) {
                lst = lst = PDP.dll("SGCLib:SGCLib.WarnNotice.GetRangeList", dts);
            } else {
                dts = [dts || Ysh.Time.formatString(new Date(), "111000")];
                lst = lst = PDP.dll("SGCLib:SGCLib.WarnNotice.GetDayList", dts);
            }
            if (!lst.check("获取风险预警通知单数据", true))
                return;
            lst = lst.value[0];
            var data = [];
            for (var i = 0; i < lst.length; i++) {
                var row = lst[i];
                var id = row[0];
                var stime = row[1];
                var etime = row[2];
                var zt = row[3];
                var type = row[4];
                var objid = row[5];
                var html = "<div class='map-tip-all'>";
                html += "<img src='/i/sgc/close.gif' class='u-icon-delete'>";
                html += "<div class='map-tip' onclick='ToPostStringMsg(\"showYjNotice\",\"" + id + "\")'><div class='head'>" + zt + "</div>";
                html += "<div class='sep'></div>"
                html += "<div class='time'>时间：" + Ysh.Time.getRangeString(stime, etime) + "</div>";
                html += "</div>";
                html += '<div style = "position:relative;height:16px;" ><div class="map-tip-arrow"></div></div>';
                if (type == "LINE") {
                    data.push({ lineid: objid, html: html });
                } else {
                    data.push({ stationid: objid, html: html });
                }
            }
            ProjectSGC.Map.postMessage({
                eventType: "menuope"
                , menuname: "showWarnInfo"
                , data: data
            });
        },
        showTingDian: function (show, t, v) {
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTingdianTrack", selstate: false, data: { trackType: "tingdian" } });
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "changeLineColor", selstate: false, data: { type: "tingdian", lineIDs: [] } });
            if (!t)
                SearchCommon.CloseSearch();
            if (!show) {
                return;
            }
            if (!t) {
                $("#divContent").show();
                $("#divContentClose").show();
                SearchCommon.showContentCloseImage();
                var jq = $(".RDiv").children().clone();
                $("#divContent").prepend(jq);
                var $robotReply = getRecentReply();
                $robotReply.find(".RSayContent").html("<a target='_blank' href='http://iesweb.dcloud.sd.dc.sgcc.com.cn:8081/tingdian.html' style='color:blue;text-decoration:underline;'>打开停电详情</a>");
                $('#divContent').scrollTop(0);
            }
            var dts = Ysh.Time.formatString(new Date(), "111000");
            var lst;
            switch (t) {
                case "vol":
                    lst = PDP.read("SGC", "sgc/tingdian:GetTingDianByVol", [dts, v]);
                    break;
                case "org":
                    lst = PDP.read("SGC", "sgc/tingdian:GetTingDianByOrg", [dts, v]);
                    break;
                default:
                    lst = PDP.read("SGC", "sgc/tingdian:GetTingDianData", [dts, dts + " 23:59:59"]);
                    break;
            }
            if (!lst.check("获取停电数据", true))
                return;
            var bTower = ProjectSGC.Map.isLineTower();
            lst = lst.value;
            var dataFault = [];
            var dataPlan = [];
            var lineids = [];
            for (var i = 0; i < lst.length; i++) {
                var data = lst[i];
                lineids.push(data[1]);
                this.getLinePosition(data, bTower);
                if (data[0] == "0" || data[0] == "3") {//计划
                    dataPlan.push({ longitude: parseFloat(data[2]), latitude: parseFloat(data[3]), volvalue: "500", data: { lineid: data[1], type: "showTingDian" } });
                }
                else if (data[0] == "1" || data[0] == "2") {//故障
                    dataFault.push({ longitude: parseFloat(data[2]), latitude: parseFloat(data[3]), volvalue: "500", data: { lineid: data[1], type: "showTingDian" } });
                }
            }

            if (dataFault.length > 0) {
                //ProjectSGC.Map.postMessage({locateType: 11, plantstationtype: "highrisk", locateItem: dataFault});
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTingdianTrack", selstate: true, data: { locateItem: dataFault, plantstationtype: "highrisk", trackType: "tingdian" } });
            }
            if (dataPlan.length > 0) {
                //ProjectSGC.Map.postMessage({locateType: 11, plantstationtype: "repair", locateItem: dataPlan});
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTingdianTrack", selstate: true, data: { locateItem: dataPlan, plantstationtype: "repair", trackType: "tingdian" } });
            }
            if (lineids.length > 0)
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "changeLineColor", selstate: true, data: { type: "tingdian", lineIDs: lineids } });
        },
        getLinePosition: function (data, bTower) {
            if (bTower) {
                data[2] = data[4];
                data[3] = data[5];
            }
        }
    },
    Service: {
        getResult: function (ret, field, bSilent) {
            //console.log("服务调用结果：")
            //console.log(ret)
            var v = {};
            eval("v = " + ret);
            //var v = JSON.parse(ret);
            if (v.code !== undefined) {
                if (v.code != 200) {
                    if (v.message == "暂无数据")
                        return [];
                    if (!bSilent)
                    alert(v.message);
                    return [];
                } else {
                    return v[field || "result"];
                }
            }
        },
        to2d: function (objList, fields) {
            var lst = [];
            if (!objList)
                return lst;
            if (!(fields instanceof Array))
                fields = fields.split(',');
            for (var i = 0; i < objList.length; i++) {
                var item = objList[i];
                var row = [];
                for (var j = 0; j < fields.length; j++) {
                    var field = fields[j];
                    if (field == "_index_")
                        row.push(i);
                    else if (field instanceof Function) {
                        row.push(field(item, i));
                    } else
                        row.push(item[fields[j]]);
                }
                lst.push(row);
            }
            return lst;
        },
        ret: function (desc, v) {
            if (v.check(desc, true)) {
                return this.getResult(v.value[0]);
            }
        },
        get: function (desc, type, query, f) {
            var dll = "SGCLib:SGCLib.Service.Get";
            if (f) {
                var o = this;
                PDP.dll(dll, [type, query], function (ret) {
                    var v = o.ret(desc, ret);
                    if (v !== undefined)
                        f(v);
                }, false);
            } else {
                return this.ret(desc, PDP.dll(dll, [type, query]));
            }
        }
    },
    String: {
        toHourStr: function (h) { return ((h < 10) ? '0' : '') + h; },
        toMinuteStr: function (h, m) { return ((h < 10) ? '0' : '') + h + ':' + ((m < 10) ? '0' : '') + m; }
    },
    Meta: {
        all: {
            "1405": { type: "ACFILTER" },
            "1201": { type: "ACLINE" },
            "1210": { type: "ACLINEEND" },
            "1202": { type: "ACLINESEG" },
            "1325": { type: "ARCSUPPRESSIONCO" },
            "1328": { type: "ARRESTER" },
            "0121": { type: "BAY" },
            "1321": { type: "BREAKER" },
            "1512": { type: "BRIDGEREACTOR" },
            "1301": { type: "BUSBAR" },
            "0411": { type: "BUSGROUP" },
            "1513": { type: "CHOPPER" },
            "0712": { type: "COMPCABINET" },
            "0711": { type: "COMPROOM" },
            "0403": { type: "CONNECTIONLINE" },
            "1315": { type: "CONTRANSFM" },
            "1316": { type: "CONTRANSFMWD" },
            "0402": { type: "CONTROLAREA" },
            "0113": { type: "CONVERSUBSTATION" },
            "0154": { type: "CONVERTER" },
            "1549": { type: "CONVERTER" },
            "1501": { type: "CONVVALVE" },
            "1313": { type: "CT" },
            "1514": { type: "DAMPER" },
            "0705": { type: "DATANET" },
            "0715": { type: "DATANETNODE" },
            "1506": { type: "DCBREAKER" },
            "1505": { type: "DCCT" },
            "1507": { type: "DCDIS" },
            "1511": { type: "DCFILTER" },
            "1530": { type: "DCGROUND" },
            "1508": { type: "DCGROUNDDIS" },
            "1208": { type: "DCGROUNDLINE" },
            "1206": { type: "DCLINE" },
            "1211": { type: "DCLINEEND" },
            "1207": { type: "DCLINESEG" },
            "0153": { type: "DCPOLE" },
            "1504": { type: "DCPT" },
            "1510": { type: "DCWAVETRAPPER" },
            "3403": { type: "DEV_VERSION" },
            "1322": { type: "DIS" },
            "0405": { type: "DISTRIBUTEDST" },
            "0412": { type: "ELECTRICALPROJECT" },
            "3402": { type: "EQUIP_DEV" },
            "1101": { type: "GENERATOR" },
            "0410": { type: "GENTRANGROUP" },
            "1323": { type: "GROUNDDIS" },
            "1324": { type: "GROUNDIMPEDANCE" },
            "1329": { type: "HANDCART" },
            "0114": { type: "HVDCGROUNDSTATION" },
            "0152": { type: "HVDCGROUNDSYS" },
            "0151": { type: "HVDCPOLESYS" },
            "0150": { type: "HVDCSYS" },
            "0155": { type: "INGROUDST" },
            "1104": { type: "INVERTER" },
            "2104": { type: "IRRADIATOR" },
            "0408": { type: "LOAD" },
            "3401": { type: "MAIN_AUX" },
            "0701": { type: "MASTERAS" },
            "0713": { type: "MSNODE" },
            "0111": { type: "PLANT" },
            "1520": { type: "POLEBUSBAR" },
            "1314": { type: "PT" },
            "0101": { type: "PWRGRID" },
            "1311": { type: "PWRTRANSFM" },
            "0409": { type: "RUNMODE" },
            "0406": { type: "SAMETOWERLINE" },
            "0401": { type: "SECTION" },
            "1327": { type: "SERIESCAPACITOR" },
            "1331": { type: "SERIESPWRTRANSFM" },
            "1326": { type: "SERIESREACTOR" },
            "1332": { type: "SERIESTRANSFMWD" },
            "1402": { type: "SHUNTCAPACITOR" },
            "1401": { type: "SHUNTREACTOR" },
            "0702": { type: "SLAVEAS" },
            "1503": { type: "SMOOTHREACTOR" },
            "0714": { type: "SSNODE" },
            "0112": { type: "SUBSTATION" },
            "1403": { type: "SVC" },
            "1404": { type: "SVG" },
            "1406": { type: "SYNCCONDENSER" },
            "1333": { type: "TBS" },
            "1204": { type: "TLINE" },
            "1212": { type: "TLINEEND" },
            "1203": { type: "TNODE" },
            "1209": { type: "TOWER" },
            "0404": { type: "TRANSCHANNEL" },
            "1312": { type: "TRANSFMWD" },
            "0407": { type: "UHVPROJECT" },
            "1334": { type: "UPFCACSWITCH" },
            "1521": { type: "UPFCBUSBAR" },
            "0158": { type: "UPFCCONVERTER" },
            "1509": { type: "UPFCDCSWITCH" },
            "0156": { type: "UPFCSYS" },
            "0157": { type: "UPFCUNIT" },
            "1502": { type: "VSCONVVALVE" },
            "2103": { type: "WINDTOWER" }
        },
        getTypeById: function (id) {
            var o = this.all[id.substring(0, 4)];
            if (o)
                return o.type;
            return "";
        }
    },
    Global: {
        main: {},
        isGridJudgeInNet:true,
        getMainObject: function (id, def) {
            if (!this.main[id]) {
                this.main[id] = def;
                var p = (window.opener ? window.opener : window);
                if (window.location.pathname == "/")
                    p = window;//防止是被别的窗口打开的
                try {
                    p.location.href;
                    p[id];
                } catch (err) {
                    p = window;
                }
                while (true) {
                    var o = p[id];
                    if (o) {
                        this.main[id] = o;
                        break;
                    }
                    if (p == p.parent) {
                        p = p.opener;
                    } else {
                        p = p.parent;
                    }
                    if (p == null)
                        break;
                }
            }
            return this.main[id];
        },
        getVoltages: function () {
            return this.getMainObject("menuData").getSelectedVoltageCodes();
        },
        getGrid: function () {
            var isGridJudgeInNet = true;
            var settings = this.getMainObject("_settings");
            if (settings)
                isGridJudgeInNet = settings.isGridJudgeInNet;
            if (isGridJudgeInNet) {
                var isOutZone = this.getMainObject("userSettings").itemShowInNet.value;
                if (isOutZone == "1") return ProjectSGC.Const.GRID_GD;
            }
            return this.getMainObject("SelectCityInst").getLocateGrid();
        },
        getDcc: function () {
            var isOutZone = this.getMainObject("userSettings").itemShowInNet.value;
            if (isOutZone == "1") return ProjectSGC.Const.DCC_GD;
            return this.getMainObject("SelectCityInst").getLocateDcc();
        },
        getOwner: function () {
            var isOutZone = this.getMainObject("userSettings").itemShowInNet.value;
            if (isOutZone == "1") return ProjectSGC.Const.OWNER_GD;
            return this.getMainObject("SelectCityInst").getLocateOwner();
        },
        getStates: function () {
        },
        getPSTypes: function () {
        },
        addTreeData: function (ids, tree, data, isRoot, bOwner) {
            if (!data) return;
            if (data.Level == "1005")
                return;
            if (data.Level != "1004") {
                if (!data.Children) return;
                if (data.Children.length == 0)
                    return;
            }
            ids.push(data.ID);
            tree.push([data.ID, data.Name, isRoot ? "" : data.ParentID, data.Level]);
            if ((!data.Children) || bOwner) return;
            for (var i = 0; i < data.Children.length; i++) {
                this.addTreeData(ids, tree, data.Children[i]);
            }
        },
        getGridTreeData: function (pgid) {
            var s = ProjectSGC.Global.getMainObject("SelectCityInst");
            var tree = [];
            var ids = [];
            var shows = [["华北", "北京", "天津", "冀北", "河北", "山西", "山东", "蒙西"]
                , ["华东", "上海", "江苏", "浙江", "安徽", "福建"]
                , ["华中", "湖北", "湖南", "河南", "江西"]
                , ["东北", "辽宁", "吉林", "黑龙江", "蒙东"]
                , ["西北", "陕西", "甘肃", "青海", "宁夏", "新疆"]
                , ["西南", "四川", "重庆", "西藏"]
            ];
            if (pgid == "0101990100") {
                var grids = s.data;
                ids = ["0101990100"];
                tree = [["0101990100", "国家电网", "", "1001"]];
                //for (var i = 0;i < grids.length;i++)
                //  this.addTreeData(ids,tree,grids[i]);
                for (var i = 0; i < shows.length; i++) {
                    var depts = shows[i];
                    for (var j = 0; j < depts.length; j++) {
                        var dept = depts[j];
                        this.addTreeData(ids, tree, s.getCityByName(dept), false, j == 0);
                    }
                }
            } else {
                var arrPgid = pgid.split(',');
                for (var p = 0; p < arrPgid.length; p++) {
                    var city = s.findCity(s.data, arrPgid[p]);
                    if (city.Level == "1002") {
                        for (var i = 0; i < shows.length; i++) {
                            var depts = shows[i];
                            var name = depts[0];
                            if (city.Name.substr(0, name.length) != name)
                                continue;
                            for (var j = 0; j < depts.length; j++) {
                                var dept = depts[j];
                                this.addTreeData(ids, tree, s.getCityByName(dept), j == 0, j == 0);
                            }
                        }
                    } else
                        this.addTreeData(ids, tree, city, true);
                }
            }
            var options = {
                expand: true, autoselect: false, fExpand: function (node) {
                    node.checked = true;
                    var level = "";
                    if (node.__data)
                        level = node.__data[3];
                    return (level == "1001") || (level == "1002");
                }
            };
            return [options, tree, ids];
        }
    },
    getVolValue: function (vol) {
        var v;
        if (vol.substr(0, 1) == "±") {
            v = -parseInt(vol.substr(1, vol.length - 3), 10);
        } else
            v = parseInt(vol.substr(0, vol.length - 2), 10);
        if (isNaN(v))
            return 0;
        return v;

    },
    require: function (type) {
        if (Ysh.Type.isArray(type)) {
            for (var i = 0; i < type.length; i++)
                this.require(type[i]);
            return;
        }
        var t = type.toLowerCase();
        if (this[t])
            return;
        this[t] = true;
        switch (t) {
            case "voltage":
                this.Voltage = Ysh.Object.combine(ProjectSGC.Dict.create("电压等级",
                    function (v) {
                        var vol = v[1];
                        if (!vol.endsWith("kV"))
                            return null;
                        var vv = ProjectSGC.getVolValue(vol);
                        if (vv == 0)
                            return null;
                        return { id: v[0], key: v[0], isDc: (vv < 0), value: Math.abs(vv), text: vol, name: vol };
                    }, "sgc/sgc:GetVoltage"),
                    {
                        isInGroup: function (v, g) {
                            switch (g) {
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
                                case 5://110kV-
                                    if (v.isDc)
                                        return false;
                                    return v.value <= 110;
                            }
                            return false;
                        },
                        getName: function (code) { var vol = this[code]; return (vol ? vol.name : ""); }
                    });
                this.Voltage.load();
                return;
            case "grid":
                this.Grid = Ysh.Object.combine(ProjectSGC.Dict.create("电网",
                    function (g) { return { id: g[0], key: g[0], text: g[1], name: g[1], pid: g[2], level: g[3] } }, "sgc/main:GetPwrGrid"),
                    {
                        getName: function (id) { var o = this[id]; return (o ? o.name : ""); }
                    });
                this.Grid.load();
                return;
            case "gridlevel":
                this.GridLevel = Ysh.Object.combine(ProjectSGC.Dict.create("电网等级",
                    function (l) { return { code: l[0], name: l[1] } }, "sgc/sgc:GetGridLevel", null, "code"),
                    {
                        getName: function (code) { var o = this[code]; return (o ? o.name : ""); }
                    });
                this.GridLevel.load();
        }
    },
    toSelectList: function (dict, idList, name, scol, dtype, stype) {
        name = name || "name";
        var ret = [];
        for (var i = 0; i < idList.length; i++) {
            var id = idList[i];
            var s = Ysh.Object.a(dict[id], name);
            if (!s)
                continue;
            ret.push([id, s]);
        }
        if (typeof scol != undefined) {
            var f = Ysh.Compare.getComparison(dtype);
            var n = (stype == "desc") ? -1 : 1;
            ret.sort(function (x, y) { return n * f(x[scol], y[scol]) });
        }
        return ret;
    },
    Assist: {
        Owner: {
            isEqual: function (o1, o2) {
                if (o1.length < 4) return false;
                if (o2.length < 4) return false;
                return o1.substr(4) == o2.substr(4);
            }
        },
        Station: {
            isOwner: function (station, owner) {
                if (!station) return false;
                for (var i = 0; i < station.data.owner.length; i++) {
                    var o = station.data.owner[i];
                    if (ProjectSGC.Assist.Owner.isEqual(o, owner)) return true;
                }
                return false;
            },
            fullList: function (m, list, idIndex, fields) {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    var id = row[idIndex];
                    var s = m.getStation(id);
                    if (!s)
                        continue;
                    var idxName = fields[0];
                    if (idxName >= 0)
                        row[idxName] = s.NAME;
                    var idxVol = fields[1];
                    if (idxVol >= 0)
                        row[idxVol] = ProjectSGC.Voltage.getName(s.code);
                    var idxGridId = fields[2];
                    if (idxGridId >= 0) {
                        row[idxGridId] = s.data.owner[1];
                    }
                    var idxGridName = fields[3];
                    if (idxGridName) {
                        row[idxGridName] = ProjectSGC.Grid.getName(s.data.owner[1]);
                    }
                }
            }
        },
        Line: {
            isOwner: function (m, line, owner) {
                var start_st_id = line[ProjectSGC.LINE.START_ST];
                if (start_st_id) {
                    if (ProjectSGC.Assist.Station.isOwner(m.getStation(start_st_id), owner))
                        return true;
                }
                var end_st_id = line[ProjectSGC.LINE.END_ST];
                if (!end_st_id) return false;
                return ProjectSGC.Assist.Station.isOwner(m.getStation(end_st_id), owner);
            },
            fullList: function (m, list, idIndex, fields) {//fields:名字，电压等级，电网id&电网name
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    var id = row[idIndex];
                    var line = m.getLine(id);
                    if (!line)
                        continue;
                    var idxName = fields[0];
                    if (idxName >= 0)
                        row[idxName] = line[ProjectSGC.LINE.NAME];
                    var idxVol = fields[1];
                    if (idxVol >= 0)
                        row[idxVol] = ProjectSGC.Voltage.getName(line[ProjectSGC.LINE.VOLTAGE]);
                    var idxGridId = fields[2];
                    if (idxGridId >= 0) {
                        row[idxGridId] = line[ProjectSGC.LINE.GRID];
                    }
                    var idxGridName = fields[3];
                    if (idxGridName) {
                        row[idxGridName] = ProjectSGC.Grid.getName(line[ProjectSGC.LINE.GRID]);
                    }
                }
            }
        },
        Ganta: {
            getNo: function (no) {
                if (!no) return no;
                no = no.toString();
                if (no.endsWith(".00")) return no.substr(0, no.length - 3);
                return no;
            }
        }
    },
    Helper: {
        getDegree: function (pos) {
            switch (pos) {
                case "东": return 90;
                case "南": return 180;
                case "西": return 270;
                case "北": return 0;
                case "东南": return 135;
                case "东北": return 45;
                case "西南": return 225;
                case "西北": return 315;
                default:
                    return -1;
            }
        },
        getGrid: function (gridid) {
            var m = ProjectSGC.Global.getMainObject("ModelList");
            if (!m.grids) return null;
            var nodes = [];
            var gridids = gridid.split(',');
            for (var i = 0; i < gridids.length; i++) {
                var n = m.grids.tree.find(gridids[i]);
                if (n)
                    nodes.push(n);
            }
            return {
                nodes:nodes,
                node: nodes[0],
                m: m,
                l: {},
                s: {},
                containsGrid: function (g) {
                    for (var i = 0; i < this.nodes.length; i++) {
                        if (this.nodes[i].contains(g))
                            return true;
                    }
                    return false;
                },
                hasLine: function (id) {
                    var b = this.l[id];
                    if (b === true) return true;
                    if (b === false) return false;
                    b = false;
                    var line = m.getLine(id);
                    if (line) {
                        var g = line[ProjectSGC.LINE.GRID];
                        b = this.containsGrid(g);
                    }
                    this.l[id] = b;
                    return b;
                },
                hasStation: function (id) {
                    var b = this.s[id];
                    if (b === true) return true;
                    if (b === false) return false;
                    b = false;
                    var station = m.getStation(id);
                    if (station) {
                        var g = station.data.owner[1];
                        b = this.containsGrid(g);
                    }
                    this.s[id] = b;
                    return b;
                },
                filter: function (lst, field) {
                },
                filterLine: function (lstLine, field) {
                    var lst = [];
                    if (!lstLine) return lst;
                    for (var i = 0; i < lstLine.length; i++) {
                        var row = lstLine[i];
                        if (this.hasLine(row[field]))
                            lst.push(row);
                    }
                    return lst;
                },
                filterStation: function (lstStation, field) {
                    var lst = [];
                    if (!lstStation) return lst;
                    for (var i = 0; i < lstStation.length; i++) {
                        var row = lstStation[i];
                        if (this.hasStation(row[field]))
                            lst.push(row);
                    }
                    return lst;
                }
            };
        }
    },
    Card: {
        getDeviceCard: function (id) {
            var type = ProjectSGC.Meta.getTypeById(id);
            switch (type) {
                case "DCLINE":
                    return "dclinecard";
                case "ACLINE":
                    return "aclinecard";
                case "PWRTRANSFM":
                    return "pwrtransfmcard";
                case "BREAKER":
                    return "breakercard";
                case "GENERATOR":
                    return "generatorcard";
                case "TOWER":
                    return "towercard";
                case "BUSBAR":
                    return "busbarcard";
                case "DIS":
                    return "disconnectcard";
                case "GROUNDDIS":
                    return "grounddiscard";
                default:
                    return "";
            }
        },
        getLineCard: function (lineid) {
            switch (ProjectSGC.Meta.getTypeById(lineid)) {
                case "HVDCSYS":
                    return "gethvdcsystemcardcon";
                case "DCLINE":
                    return "dclinecard";
                default:
                    return "aclinecard";
            }
        },
        getStationCard: function (staid) {
            switch (ProjectSGC.Meta.getTypeById(staid)) {
                case "SUBSTATION": return "getsubstationcard";
                case "CONVERSUBSTATION": return "getconstationcard";
                case "HVDCGROUNDSTATION": return "gethvdcgroudcard";
                default: return "getplantcard";
            }
        },
        getCardName: function (card, id) {
            if (Ysh.Type.isFunction(card))
                return card(id);
            switch (card) {
                case "line":
                    return this.getLineCard(id);
                case "station":
                    return this.getStationCard(id);
                case "device":
                    return this.getDeviceCard(id);
                default:
                    return card;
            }
        },
        getCardData: function (card, id) {
            switch (card) {
            	case "gridmaxload":
            		var arr = id.split(",");
            		var gridid = arr[0];
            		var meastype = arr[1];
            		var time = arr[2];
            	//http://operating-web.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/ShowPwgridCurveGfFrame.jsp?chain&0101990101@13022001@name#{%22time%22:%222021-06-17%22,%22endtime%22:%222021-06-17%22}&jurl=dcloud.display.card.PwrGridMeasCard&method=ActivePowerMeasGfP&objId=0101990101&from=server
                    var url = 'http://operating-web.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/ShowPwgridCurveGfFrame.jsp?chain&'+gridid+'@'+meastype+'@name#{"time":"' + time + '","endtime":"' + time +'"}&jurl=dcloud.display.card.PwrGridMeasCard&method=ActivePowerMeasGfP&objId='+gridid
                    var ret = { "message": "电网有功展示页面正常", "data": { "rankid": "990100010207001", "objectname": "电网", "title": { "icon": "", "text": "电网负荷曲线", "style": { "height": "28px", "color": "2A3F3E", "font-size": "14px", "background-color": "3A63B5", "font-family": "microsoft yahei", "font-weight": "bold" }, "button": "feedback,info,minBtn,maxBtn,icon,refresh,close", "infoUrl": "http://operating-web.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/pages/cardinfo.html?objId=01123700000040" }, "height": "630px", "appId": "990100010207", "objectCode": "0112", "objectId": "01123700000040", "width": "1200px", "servicename": "dcloud.display.card.PwrGridMeasCard", "objectid": "01123700000040", "url": url }, "code": 200 };
                    return ret.data;
                case "gridloadcurve":
                    var gridid = id;
                    var time = Ysh.Time.formatString(vMain.getShowTime(), "111000");
                    var url = 'http://operating-web.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/ShowPwgridCurveFrameGis.jsp?chain&' + gridid + '@11032001@name#{"time":"' + time + '","endtime":"' + time + '"}';//"http://10.10.16.24:8080/osp/TestCurveScale/ShowPwgridCurveFrameGis.jsp?chain&" + gridid + "@11032001@name"
                    var ret = { "message": "电网有功展示页面正常", "data": { "rankid": "990100010207001", "objectname": "电网", "title": { "icon": "", "text": "电网负荷曲线", "style": { "height": "28px", "color": "2A3F3E", "font-size": "14px", "background-color": "3A63B5", "font-family": "microsoft yahei", "font-weight": "bold" }, "button": "feedback,info,minBtn,maxBtn,icon,refresh,close", "infoUrl": "http://operating-web.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/pages/cardinfo.html?objId=01123700000040" }, "height": "630px", "appId": "990100010207", "objectCode": "0112", "objectId": "01123700000040", "width": "1200px", "servicename": "dcloud.display.card.PwrGridMeasCard", "objectid": "01123700000040", "url": url }, "code": 200 };
                    return ret.data;
                case "gridwindcurve":
                    var gridid = id;
                    if (id == "0101990100") return;
                    var time = Ysh.Time.formatString(vMain.getShowTime(), "111000");
                    var url = "http://10.10.16.54:8081/yc-energy-web/pwrgridLoadForecastCard.html?detailId=" + gridid + "&jurl=dcloud.display.card.LoadForecastCard&method=PwrgridLoadForecastCard&objId=" + gridid + "&startTime=" + time + "&measType=fd";
                    var ret = { "message": "风电展示页面正常", "data": { "rankid": "990100010207001", "objectname": "风电", "title": { "icon": "", "text": "风电预测曲线", "style": { "height": "28px", "color": "2A3F3E", "font-size": "14px", "background-color": "3A63B5", "font-family": "microsoft yahei", "font-weight": "bold" }, "button": "feedback,info,minBtn,maxBtn,icon,refresh,close", "infoUrl": "http://operating-web.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/pages/cardinfo.html?objId=01123700000040" }, "height": "630px", "appId": "990100010207", "objectCode": "0112", "objectId": "01123700000040", "width": "1200px", "servicename": "dcloud.display.card.PwrGridMeasCard", "objectid": "01123700000040", "url": url }, "code": 200 };
                    return ret.data;
                case "reservoir":
                    var url = "http://10.10.16.60:8082/index.html#/reservoir/" + id;
                    var ret = { "message": "水库曲线展示页面正常", "data": { "rankid": "990100010207001", "objectname": "水库", "title": { "icon": "", "text": "水库曲线", "style": { "height": "28px", "color": "2A3F3E", "font-size": "14px", "background-color": "3A63B5", "font-family": "microsoft yahei", "font-weight": "bold" }, "button": "minBtn,maxBtn,icon,refresh,close", "infoUrl": "http://operating-web.dcloud.gf.dc.sgcc.com.cn/osp/SGNewCurveServer/pages/cardinfo.html?objId=01123700000040" }, "height": "744px", "appId": "990100010207", "objectCode": "0112", "objectId": "01123700000040", "width": "1254px", "servicename": "dcloud.display.card.PwrGridMeasCard", "objectid": "01123700000040", "url": url }, "code": 200 };
                    return ret.data;
                default:
                    return "";
            }
        },
        showCard: function (card, id, fDealData) {
            var cardUrlInst = ProjectSGC.Global.getMainObject("cardUrlInst");
            if (!cardUrlInst) return;
            var data = this.getCardData(card, id);
            if (data) {
                renderCard(data);
                return;
            }
            cardUrlInst.showEx(this.getCardName(card, id), id, fDealData);
        },
        showMeasCard: function (type, id) {
            var card = "";
            switch (type) {
                case "linechaoliu":
                    card = (ProjectSGC.Meta.getTypeById(id) == "DCLINE") ? "dclinemeascard" : "aclinemeascard";
                    break;
                case "plantpower":
                    card = "plantmeascard";
                    break;
                case "busvol":
                    card = "busbarmeascard";
                    break;
            }
            if (!card) return;
            var time = vMain.getShowTime();
            if (!time)
                this.showCard(card, id);
            else {
                this.showCard(card, id, function (data) {
                    time = Ysh.Time.formatString(time,"111000");
                    data.url += '#{"time":"' + time + '","endtime":"' + time + '"}';
                });
            }
        }
    },
    Event: {
        Message: function (f) {
            Ysh.Web.Event.attachEvent(window, "message", function (event) {
                if (!event.data)
                    return;
                var data = event.data;
                f(data.type, data.data, data.eventType, data);
            });
        }
    },
    Statistics: {
        countByVoltage: function (data, vIdx) {
            var s = this.count(data, vIdx);
            s.sort(function (x, y) {
                return -Ysh.Compare.compareVoltage(x[0], y[0]);
            });
            return s;
        },
        count: function (data, vIdx) {
            var o = {};
            for (var i = 0; i < data.length; i++) {
                var v = Ysh.Type.isFunction(vIdx) ? vIdx(data[i]) : data[i][vIdx];
                if (Ysh.Type.isArray(v)) {
                    for (var j = 0; j < v.length; j++)
                        o[v[j]] = (o[v[j]] || 0) + 1;
                } else
                    o[v] = (o[v] || 0) + 1;
            }
            var s = [];
            for (v in o) {
                s.push([v, o[v]]);
            }
            return s;
        },
        addUseTime: function (data, timecol) {
            var now = new Date().getTime();
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var time = row[timecol];
                row.age = (now - Ysh.Time.parseDate(time)) / 31536000000;
            }
            return data;
        }
    },
    Struct: {
        createStates: function () {
            return {
                _data: {},
                _num: 0,
                getRealState: function () { },
                setState: function (key, state) {
                    if (this._data[key] == state) 
                        return false;
                    this._data[key] = state;
                    if (state) {
                        this._num++;
                        if (this._num > 1)//已显示
                            return false;
                    } else {
                        this._num--;
                        if (this._num > 0)//还不能隐藏
                            return false;
                    }
                    return true;
                }
            };
        }
    }
}

if (typeof vMain == "undefined")
    vMain = top.vMain;

Vue.component('ysh-card', {
    props: ["id", "text", "card"],
    methods: {
        showCard: function () {
            console.log("显示卡片：" + this.card + "," + this.id);
            ProjectSGC.Card.showCard(this.card, this.id);
        }
    },
    template: '<a> <span @click.stop="showCard"><slot> {{text}} </slot></span> </a>'
});

Vue.component('ysh-cards', {
    props: ["id", "text", "card", "idsplit", "textsplit"],
    computed: {
        all: function () {
            if (this.idsplit && this.id) {
                var ret = [];
                var arrId = this.id.split(this.idsplit);
                var arrText = this.text.split(this.textsplit);
                for (var i = 0; i < arrId.length; i++) {
                    ret.push({ id: arrId[i], text: arrText[i] || "" });
                }
                return ret;
            }
            return [{ id: this.id, text: this.text }];
        }
    },
    methods: {
        showCard: function (item) {
            ProjectSGC.Card.showCard(this.card, item.id);
        }
    },
    template: '<span><span v-for="(item,index) in all"><a><span @click.stop="showCard(item)">{{item.text}}</span></a><span v-if="index!=all.length-1">{{textsplit}}</span></span></span>'
});

var ProjectMap = {
    data: {
        highLights: { lines: [], stations: [] },
        twinkles: { lines: [], stations: [] },
        removeHighLight: function (type) {
            var o = { lines: this.highLights.lines, stations: this.highLights.stations };
            this.highLights = { lines: [], stations: [] };
            this.twinkles = { lines: [], stations: [] };
            return o;
        },
        removeTwinkle: function () {
            var o = { lines: this.twinkles.lines, stations: this.twinkles.stations };
            this.twinkles = { lines: [], stations: [] };
            return o;
        },
        setHighLight: function (type, lines, stations) {
            this.highLights.lines = lines;
            this.highLights.stations = stations;
        },
        setTwinkle: function (type, lines, stations) {
            this.twinkles.lines = lines;
            this.twinkles.stations = stations;
        }
    },
    locateRange: function (lineids, stationids, f) {
        return ProjectSGC.Map.locateLineStaRange(lineids, stationids, f);
    },
    highLight: function (type, lines, stations, f) {
        this.removeTwinkle(type);
        ProjectSGC.Map.highLight(lines, stations, "", true);
        if (f) this.locateRange(lines, stations, f);
        this.data.setHighLight(type, lines, stations);
    },
    twinkle: function (type, lines, stations, f) {
        this.removeTwinkle(type);
        ProjectSGC.Map.highLight(lines, stations, "", false, true);
        if (f) this.locateRange(lines, stations, f);
        this.data.setTwinkle(type, lines, stations);
    },
    removeHighLight: function (type) {
        var o = this.data.removeHighLight(type);
        if ((o.lines.length == 0) && (o.stations.length == 0)) return;
        ProjectSGC.Map.highLight([], []);
    },
    removeTwinkle: function (type) {
        var o = this.data.removeTwinkle(type);
        if ((o.lines.length == 0) && (o.stations.length == 0)) return;
        ProjectSGC.Map.highLight(o.lines, o.stations, "", true, true);//先高亮，再去掉高亮
        ProjectSGC.Map.highLight([], []);
    },
    clear: function (type) {
        this.removeTwinkle(type);
        ProjectSGC.Map.highLight([], []);
    },
    create: function () {
        return {
            _show: null,
            _hide: null,
            setShow: function (f) { },
            setHide: function (f) { },
        }
    }
}

Vue.component('group_voltage_statistics', {
    props: {
        list: {
            type: Array, "default": []
        },
        vcolumn: {
            type: Number, "default": 1
        },
        dcolumn: {
            type: Number, "default": 0
        },
        totalname: {
            type: String, "default": "总计"
        }
    },
    data: function () {
        return { vSelected: "", count: 0, statistics: [] };
    },
    methods: {
        click: function (s) {
            this.vSelected = s ? s[0] : "";
            var list = this.filter(this.vSelected);
            this.$emit("volchanged", list, this.vSelected, true);
        },
        filter: function (v) {
            if (!v)
                return this.list;
            var c = this.vcolumn;
            return ProjectSGC.Array.pick(this.list, function (row) {
                return row[c] == v;
            });
        },
        doStatistics: function () {
            var cVol = this.vcolumn;
            var cId = this.dcolumn;
            var ids = [];
            var bVolExist = false;
            var vSelected = this.vSelected;
            var s = ProjectSGC.Statistics.countByVoltage(this.list, function (row) {
                var id = row[cId];
                if (ids.indexOf(id) >= 0)
                    return [];
                ids.push(id);
                var vol = row[cVol]
                if (!bVolExist)
                    bVolExist = (vol == vSelected);
                return vol;
            });
            this.count = ids.length;
            if (!bVolExist)
                this.vSelected = "";
            this.statistics = s;
            var list = this.filter(this.vSelected);
            this.$emit("volchanged", list, this.vSelected, false);
        }
    },
    watch: {
        list: {
            immediate: true,
            handler: function () {
                this.doStatistics();
            }
        }
    },
    template: `<div style="background-color:#585858;padding:5px">
                <div style="width:100%">
                    <div style="display:inline-block;vertical-align:top;width:115px">
                        <span style="cursor:pointer" @click="click(null)">
                            {{totalname}}：<span style="color:#f77850;margin-right:5px">{{ count }}</span>
                        </span>
                    </div>
                    <div style="display:inline-block;width:calc(100% - 120px)">
                        <template v-for="(item_statistics,index) in statistics">
                            <span v-if="index">、</span>
                            <span style="cursor:pointer" @click="click(item_statistics)">
                                <span :style="{'color':(item_statistics[0]==vSelected)?'#46d4d2':'','font-size':(item_statistics[0]==vSelected)?'16px':''}">{{ item_statistics[0] }}</span>
                                (<span style="color:#f77850">{{ item_statistics[1] }}</span>)
                            </span>
                        </template>
                    </div>
                </div>
            </div>`
});

Vue.component('group_statistics', {
    props: {
        list: {
            type: Array, "default": []
        },
        scolumn: {
            "default": 1
        },
        dcolumn: {
            type: Number | String, "default": 0
        },
        showtext: {
            type: Function, "default": function (v) { return v; }
        },
        link: {
            type: Boolean, "default": true
        }
    },
    data: function () {
        return { sSelected: "", count: 0, statistics: [] };
    },
    computed: {
        linkStyle: function () {
            if (this.link) return { cursor: "pointer" };
            return {};
        }
    },
    methods: {
        click: function (s) {
            if (!this.link) return;
            this.sSelected = s ? s[0] : "";
            var list = this.filter(this.sSelected);
            this.$emit("changed", list, this.sSelected);
        },
        filter: function (v) {
            if (!v)
                return this.list;
            var c = this.scolumn;
            return ProjectSGC.Array.pick(this.list, function (row) {
                return row[c] == v;
            });
        },
        doStatistics: function () {
            var cStat = this.scolumn;
            var cId = this.dcolumn;
            var ids = [];
            var bStatExist = false;
            var sSelected = this.sSelected;
            var s = ProjectSGC.Statistics.count(this.list, function (row) {
                var id = row[cId];
                if (ids.indexOf(id) >= 0)
                    return [];
                ids.push(id);
                var stat = Ysh.Type.isFunction(cStat) ? cStat(row) : row[cStat];
                if (!bStatExist)
                    bStatExist = (stat == sSelected);
                return stat;
            });
            this.count = ids.length;
            if (!bStatExist)
                this.sSelected = "";
            this.statistics = s;
            var list = this.filter(this.sSelected);
            this.$emit("changed", list, this.sSelected);
        }
    },
    watch: {
        list: function () {
            this.doStatistics();
        }
    },
    template: `<div style="background-color:#585858;padding:5px">
                <div style="width:100%">
                    <div style="display:inline-block;vertical-align:top;width:115px">
                        <span :style="linkStyle" @click="click(null)">
                            总计：<span style="color:#f77850;margin-right:5px">{{ count }}</span>
                        </span>
                    </div>
                    <div style="display:inline-block;width:calc(100% - 120px)">
                        <template v-for="(item_statistics,index) in statistics">
                            <span v-if="index">、</span>
                            <span :style="linkStyle" @click="click(item_statistics)">
                                <span :style="{'color':(item_statistics[0]==sSelected)?'#46d4d2':'','font-size':(item_statistics[0]==sSelected)?'16px':''}">{{ showtext(item_statistics[0]) }}</span>
                                (<span style="color:#f77850">{{ item_statistics[1] }}</span>)
                            </span>
                        </template>
                    </div>
                </div>
            </div>`
});

var ProjectInterface = {
    Jxt: {
        addLines: function (m, ret, lines) {
            //{"dccLevel":"1001","dccName":"国调","endStationId":"01139901000052","isTLine":"否","lineId":"120699010000000049","lineIndex":"0,0","lineName":"锡泰直流极Ⅰ线路","startStationId":"01139901000051","virtualPoints":"","voltageType":"2002","voltageTypeName":"±800kV"}
            for (var i = 0; i < lines.length; i++) {
                var id = lines[i];
                var line = m.getLine(id);
                if (!line) continue;
                var name = line[ProjectSGC.LINE.NAME];
                var st = line[ProjectSGC.LINE.START_ST];
                var et = line[ProjectSGC.LINE.END_ST];
                var vol = line[ProjectSGC.LINE.VOLTAGE];
                var volname = ProjectSGC.Voltage.getName(vol);
                var dccid = line[ProjectSGC.LINE.DCC];
                var dcc = m.dccs.dict[dccid];
                ret.push({ "dccLevel": (dcc ? dcc[3] : dcc), "dccName": (dcc ? dcc[1] : dcc), "endStationId": et, "isTLine": "否", "lineId": id, "lineIndex": "0,0", "lineName": name, "startStationId": st, "virtualPoints": "", "voltageType": vol, "voltageTypeName": volname });
            }
        },
        addStation: function (m, ret, stations) {
            //{"dccLevel":"1003","dccName":"山西省调","isOtherProvince":"F","latitude":40.06,"layoutX":0.0,"layoutY":0.0,"longitude":113.2,"operatestateName":"在运","ownerRegion":"140200","ownerRegionName":"山西省大同市","stationId":"01111400000004","stationName":"恒北热电","stationType":"1001","stationTypeName":"火电","text_transform_x":"0","text_transform_y":"0","voltageType":"1003","voltageTypeName":"500kV"}
            for (var i = 0; i < stations.length; i++) {
                var id = stations[i];
                var s = m.getStation(id);
                if (!s) continue;
                var dccid = s.data.owner[0];
                var owner = s.data.owner[2];
                var dcc = m.dccs.dict[dccid];
                var volname = ProjectSGC.Voltage.getName(s.code);
                ret.push({
                    "dccLevel": (dcc ? dcc[3] : dcc), "dccName": (dcc ? dcc[1] : dcc), "isOtherProvince": "F", "latitude": s.LATITUDE, "layoutX": 0.0, "layoutY": 0.0,
                    "longitude": s.LONGITUDE, "operatestateName": "在运", "ownerRegion": owner, "ownerRegionName": "", "stationId": id, "stationName": s.NAME,
                    "stationType": s.PlantStationType, "stationTypeName": "", "text_transform_x": "0", "text_transform_y": "0", "voltageType": s.code, "voltageTypeName": volname
                });
            }
        },
        getJxtData: function (m, lineIds, stationIds) {
            var lines = [];
            var stations = [];
            this.addLines(m, lines, lineIds);
            this.addStation(m, stations, stationIds);
            return { "data": Ysh.Time.toString(new Date()), "line": lines, "station": stations };
        },
        draw: function (lineIds, stationIds) {
            ProjectSGC.require("voltage")
            var m = ProjectSGC.Map.getMainObject("ModelList");
            if (!m) return;
            var data = this.getJxtData(m, lineIds, stationIds);
            $.ajax({
                url: "http://10.10.16.146:8070/graphweb/api/autoLayout/interfaceAutoLayout",
                type: "post",
                data: JSON.stringify(data),
                async: true,
                contentType: "application/json",
			    dataType:'text',
                success: function (data) {
                    console.log(data);
                    if (data.message) {
                        alert("生成图形失败：" + data.message);
                        return;
                    }
                    window.open(data, "jxt");
                },
                error: function (data, status, err) {
                    alert("生成图形失败!");
                    console.log(data.responseText);
                }
            });
        }
    }
}

Vue.component('grids_tree', {
    data: function () { return { deepCheck:true } },
    props: ["options", "tree"],
    computed: {
        treeData: function () {
            return Ysh.Tree.toData(this.tree, ['tree_0', 'tree_1', 'tree_2'], '0', '2', '1', [], this.options);
        }
    },
    methods: {
        onCheckChange: function (nodes, node) {
            this.$emit('on-check-change', nodes, node);
        }
    },
    template: `<a onclick="return false">
                <Poptip placement="bottom-start">
                    电网筛选
                    <div slot="content" style="background-color:white">
                        <div style="padding-left:10px;border-bottom:solid 1px gray;height:25px;display:flex;align-items:center;">
                            <input type="checkbox" v-model="deepCheck" style="margin-right:5px;" @click="deepCheck=!deepCheck" /><span @click="deepCheck=!deepCheck">级联选择</span>
                        </div>
                        <div style="max-height:500px;text-align:left">
                            <Tree :options="options" :check-strictly="!deepCheck" :show-checkbox="true" style="background-color:white" @on-check-change="onCheckChange" :data="treeData"></Tree>
                        </div>
                    </div>
                </Poptip>
            </a>`
});

var ProjectLocal = {
    V: {
        getRender: function (f) {
            return function (h, params) {
                var format = params.column.format;
                var v = params.row[params.column.key];
                switch (format) {
                    case "e": return h("span", {}, V.elec(v));
                    case "p": return h("span", {}, V.price(v));
                    case "c": return h("span", {}, V.cost(v));
                    case "%": return h("span", {}, V.percent(v));
                    case "%%": return h("span", {}, V.percent(v, true));
                    default:
                        if (format[0] == "n")
                            return h("span", {}, V.n(v, parseInt(format.substr(1), 10)));
                        if (ProjectLocal.V[format])
                            return h("span", {}, ProjectLocal.V[format](v));
                        return h("span", {}, Ysh.Time.formatString(v, format));
                }
            };
        }
    }
};

var V = {
    n: function (v, n) { if (isNaN(v)) return ""; if (!v) return v; return Ysh.Number.toFixed(Number(v), n); },
    elec: function (v) { if (isNaN(v)) return ""; if (!v) return v; return Ysh.Number.toFixed(Number(v), 3); },
    price: function (v) { if (isNaN(v)) return ""; if (!v) return v; return Ysh.Number.toFixed(Number(v), 2); },
    avgPrice: function (elec, cost) {
        return this.price(ProjectLocal.Calc.div(cost, elec));
    },
    cost: function (v) { if (isNaN(v)) return ""; if (!v) return v; return Ysh.Number.toFixed(Number(v), 0); },
    percent: function (v, b) { if (isNaN(v)) return ""; if (!v) return v; var s = Ysh.Number.toFixed(Number(v) * 100, 2); if (b) return s; return s + "%"; },
    incRate: function (v1, v2) { return this.percent(ProjectLocal.Calc.incRate(v1, v2)); },
}
