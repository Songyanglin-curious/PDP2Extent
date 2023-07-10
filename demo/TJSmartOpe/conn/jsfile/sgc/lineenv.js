/*v=1.20.823.1*/
var SGCEnv = {
    getTypeName_3k: function (t) {
        switch (t) {
            case 4: return "河流";
            case 2: return "高速";
            case 3: return "铁路";
                return '/i/sgc/3k/rail.png';
            case 1: return "线路";
            default:
                return "";
        }
    },
    getTypeImg_3k: function (t) {
        switch (t) {
            case 4:
                return '/i/sgc/3k/river.png';
            case 2:
                return '/i/sgc/3k/road.png';
            case 3:
                return '/i/sgc/3k/rail.png';
            case 1:
                return '/i/sgc/3k/line.png';
            default:
                return "";
        }
    },
    getBorderName: function (arr) {
        if (arr.length == 0)
            return "";
        if (arr.length == 1)
            return SGCEnv.getTowerNum(arr[0]);
        return SGCEnv.getTowerNum(arr[0]) + "-" + SGCEnv.getTowerNum(arr[arr.length - 1]);
    },
    getTowerNum: function (str) {
        var index = str.indexOf("线");
        if (index >= 0)
            str = str.substr(index + 1);
        return str.replace("杆塔", "").replace("号", "").replace("#", "");
    },
    getFindTowerFunc: function (idxId, idxTime, idxLon, idxLat, img) {
        return function (id) {
            var lst = this.lst;
            for (var i = 0; i < lst.length; i++) {
                var item = lst[i];
                if (item[idxId] == id) {
                    return { time: item[idxTime], towerid: id, longitude: item[idxLon], latitude: item[idxLat], img: img };
                }
            }
            return null;
        }
    },
    getFindTowerFunc2: function (idxId1, idxId2, idxTime, idxLon, idxLat, img) {
        return function (id) {
            var lst = this.lst;
            for (var i = 0; i < lst.length; i++) {
                var l = lst[i];
                var s = l[idxId1];
                var e = l[idxId2];
                if ((s == id) || (e == id))
                    return { time: l[idxTime], longitude: l[idxLon], latitude: l[idxLat], img: img }
            }
            return null;
        }
    },
    getFindTowerFunc3: function (idxId1, idxId2, idxTime, idxLon, idxLat, img) {
        return function (id,num) {
            num = parseInt(num,10).toString();
            var lst = this.lst;
            for (var i = 0; i < lst.length; i++) {
                var l = lst[i];
                var s = l[idxId1];
                if (s.split(',').indexOf(num) < 0)
                    continue;
                    return { time: l[idxTime], longitude: l[idxLon], latitude: l[idxLat], img: img }
            }
            return null;
        }
    },
    fullQiquObjectInfo: function (o, sqlTag, mapImg, towerImg) {
        o.imgInfo = { imgUrl: mapImg, width: 20, height: 20 };
        o.idxLon = 3;
        o.idxLat = 4;
        o.getTowerSQL = function (bAcLine, args) { return bAcLine ? "sgc/env:GetAcLineTower_" + sqlTag : "sgc/env:GetDcLineTower_" + sqlTag };
        o.find = this.getFindTowerFunc(0, 2, 3, 4, towerImg);
    },
    createEnvObject: function (type) {
        var o = {
            name: type, lst: [], setData: function (data) { this.lst = data || []; },
            getTips: function (row) {
                return row[this.idxLon - 1];
            }
        }
        switch (type) {
            case "light":
                o.imgInfo = { imgUrl: "/textures/coin/weather/leigif.png", imgType: "Animated", width: 75, height: 75 };
                o.idxLon = 3;
                o.idxLat = 4;
                o.getTowerSQL = function () { return "sgc/light:GetLineTower" };
                o.find = this.getFindTowerFunc3(0, 1, 2, 3, 4, "/i/sgc/typhoon/leidian2.png");
                o.getTips = function (row) {
                    return "时间：" + row[2] + "<br />区域：" + row[5];
                }
                break;
            case "fire":
                //o.imgInfo = { imgCode: 0, imgUrl: "/i/sgc/icon/fire/1.png", height: 24, width: 24 };
                o.imgInfo = { imgCode: 0, imgUrl: "/i/sgc/icon/fire/1.png", imgType: "Animated", width: 100, height: 100 };
                o.idxLon = 3;
                o.idxLat = 4;
                o.getTowerSQL = function () { return "sgc/fire:GetLineTower" };
                o.find = this.getFindTowerFunc3(0, 1, 2, 3, 4, "/i/sgc/typhoon/fire.png");
                o.getTips = function (row) {
                    //return "时间：" + row[1] + "<br />方位：" + row[4] + "<br />距离：" + row[5] + "m";
                    return "时间：" + row[2] + "<br />距离：" + (row[5] ? (row[5] + "m") : "") + "<br />区域：" + row[6];
                }
                break;
            case "t": //温度
                o.imgInfos = [{ imgUrl: "/i/sgc/env/gaowen-1.png" }, { imgUrl: "/i/sgc/env/gaowen-2.png" }];
                o.idxLon = 2;
                o.idxLat = 3;
                o.getTowerSQL = function (bAcLine) { return bAcLine ? "sgc/env:GetAcLineTowerT" : "sgc/env:GetDcLineTowerT" };
                o.find = this.getFindTowerFunc(0, 1, 2, 3, "/i/sgc/typhoon/gaowen.png");
                o.fGetIndex = function (row) { return parseInt(row[4], 10) - 1; }
                break;
            case "w": //大风
                o.imgInfos = [{ imgUrl: "/i/sgc/env/dafeng-1.png" }, { imgUrl: "/i/sgc/env/dafeng-2.png" }];
                o.idxLon = 2;
                o.idxLat = 3;
                o.getTowerSQL = function (bAcLine) { return bAcLine ? "sgc/env:GetAcLineTowerW" : "sgc/env:GetDcLineTowerW" };
                o.find = this.getFindTowerFunc(0, 1, 2, 3, "/i/sgc/typhoon/dafeng.png");
                o.fGetIndex = function (row) { return parseInt(row[4], 10) - 1; }
                break;
            case "r": //降雨
                o.imgInfos = [{ imgUrl: "/i/sgc/env/rain-1.png" }, { imgUrl: "/i/sgc/env/rain-2.png" }];
                o.idxLon = 2;
                o.idxLat = 3;
                o.getTowerSQL = function (bAcLine) { return bAcLine ? "sgc/env:GetAcLineTowerR" : "sgc/env:GetDcLineTowerR" };
                o.find = this.getFindTowerFunc(0, 1, 2, 3, "/i/sgc/typhoon/jiangyu.png");
                o.fGetIndex = function (row) { return parseInt(row[4], 10) - 1; }
                break;
            case "weather"://所有天气
                o.imgInfos = [{ imgUrl: "/i/sgc/env/dafeng-1.png" }, { imgUrl: "/i/sgc/env/dafeng-2.png" }, { imgUrl: "/i/sgc/env/gaowen-1.png" }, { imgUrl: "/i/sgc/env/gaowen-2.png" }, { imgUrl: "/i/sgc/env/rain-1.png" }, { imgUrl: "/i/sgc/env/rain-2.png" }];
                o.idxLon = 2;
                o.idxLat = 3;
                o.getTowerSQL = function (bAcLine) { return bAcLine ? "sgc/env:GetAcLineTowerWeather" : "sgc/env:GetDcLineTowerWeather" };
                o.find = function (id) {
                    var lst = this.lst;
                    var arr = [];
                    var arrKey = [];
                    for (var i = 0; i < lst.length; i++) {
                        var item = lst[i];
                        if (item[0] != id)
                            continue;
                        //var level = item[4];
                        var type = item[5];
                        if (arrKey.indexOf(type) >= 0)
                            continue;
                        arrKey.push(type);
                        var img = "";
                        switch (type) {
                            case "temperature": img = "/i/sgc/typhoon/gaowen.png"; break;
                            case "wind": img = "/i/sgc/typhoon/dafeng.png"; break;
                            case "rain": img = "/i/sgc/typhoon/jiangyu.png"; break;
                        }
                        if (!img)
                            continue;
                        arr.push({ time: item[1], towerid: id, longitude: item[2], latitude: item[3], img: img });
                    }
                    return arr;
                };
                o.fGetIndex = function (item) {
                    var idxStart = 0;
                    switch (item[5]) {
                        case "temperature": idxStart = 2; break;
                        case "wind": break;
                        case "rain": idxStart = 4; break;
                        default: return -1;
                    }
                    return idxStart + parseInt(item[4], 10) - 1;
                }
                break;
            case "niaohai":
            case "shuzhang":
            case "fanglei":
            case "waili":
                this.fullQiquObjectInfo(o, type, "/i/qiqu/" + type + ".png", "/i/sgc/env/" + type + ".png");
                break;
            default:
                return null;
        }
        return o;
    },
    getWarnLevel: function (type, v) {
        if (v==="") return -1;
        switch (type) {
            case "icing": return (v >= 5) ? 1 : (v >= 2 ? 2 : -1);
            //case "fire": return (v <= 1000) ? 1 : (v <= 3000 ? 2 : -1);
                //case "light": return (v > 5) ? 1 : (v > 2 ? 2 : -1);
            case "temperature":
            case "wind":
            case "rain":
                return v;
            default:
                if (isNaN(v)) {
                    return ["", "一级", "二级", "三级", "四级"].indexOf(v);
                } else
                    return parseInt(v);
                return -1;
        }
    },
    getLineEvaluate: function (warns) {
        var count = 0;
        for (var k in warns) {
            var o = warns[k];
            if (o.data)
                count += (3 - o.level) * o.data.length;
        }
        return count;
    },
    fullTowers: function (towers, type, st, et) {
        switch (type) {
            case "icing": return;
            case "fire":
                towers.push(parseFloat(st));
                return;
            case "light":
                towers.push(parseFloat(st));
                towers.push(parseFloat(st) + 1.0);
                return;
            default:
                towers.push(parseFloat(st));
                return;
        }
    },
    getTowersString: function (towers) {
        var arr = [];
        var prevTower = "";
        var prevRow = null;
        for (var i = 0; i < towers.length; i++) {
            var tower = towers[i];
            var cur = parseInt(tower, 10);
            if ((i > 0) && ((cur == prevTower + 1) || (cur == prevTower))) {
                prevRow[1] = tower;

            } else {
                prevRow = [tower, tower];
                arr.push(prevRow);
            }
            prevTower = cur;
        }
        for (var i = 0; i < arr.length; i++) {
            var row = arr[i];
            var s = row[0];
            var e = row[1];
            if (s == e)
                arr[i] = s;
            else
                arr[i] = s + "-" + e;
        }
        return arr.join("、");
    },
    combineLineTower1: function (lst, gridid) {
        var m = ProjectSGC.Global.getMainObject("ModelList");
        if (!m) return [];
        var grid = ProjectSGC.Helper.getGrid(gridid);
        var o = {}
        var data = [];
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            var type = row[0];
            var time = row[1];
            var id = row[2];
            if (!id) //可能线路id取不到
                continue;
            var stTowerId = row[3];
            var stTowerNo = row[4];
            if (!stTowerNo) //可能杆塔取不到
                continue;
            if (!grid.hasLine(id))
                continue;
            var line = m.getLine(id);
            if (!line) continue;
            var etTowerId = row[5];
            var etTowerNo = row[6];
            var value = row[7];
            var level = this.getWarnLevel(type, parseFloat(value));
            if (level < 0)
                continue;
            if (!o[id])
                o[id] = { obj: line, warns: {} };
            var warns = o[id].warns;
            var flag = type + level;
            if (!warns[flag])
                warns[flag] = { type: type, level: level, data: [] };
            warns[flag].data.push(row);
        }
        var ret = [];
        var idx = 0;
        for (var id in o) {
            var line = o[id].obj;
            var warns = o[id].warns;
            var name = line[ProjectSGC.LINE.NAME];
            var vol = ProjectSGC.Voltage.getName(line[ProjectSGC.LINE.VOLTAGE]);
            //var lineEval = this.getLineEvaluate(warns);
            var lineEval = 0;
            var rows = [];
            for (var w in warns) {
                var warn = warns[w];
                var type = warn.type;
                var level = warn.level;
                var data = warn.data;
                var tCount = 0;
                var tDetail = "";
                var towers = [];
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    this.fullTowers(towers, type, row[4], row[6]);
                }
                var towerEval = (3 - level) * towers.length;
                lineEval += towerEval;
                towers.sort(function (x, y) { return x - y });
                var row = [id, name, lineEval, towerEval, type, level, towers.length, this.getTowersString(towers), vol];
                rows.push(row);
                ret.push(row);
            }
            for (var i = 0; i < rows.length; i++)
                rows[i][2] = lineEval;
            idx++;
        }
        ret.sort(function (x, y) {
            var v = Ysh.Compare.compareVoltage(x[8], y[8]);
            if (v != 0) return -v;
            return Ysh.Compare.compare(x[1], y[1]);
        });
        var idx = 0;
        var id = "";
        for (var i = 0; i < ret.length; i++) {
            var row = ret[i];
            if (row[0] != id) {
                idx++;
                id = row[0];
            }
            row.push(idx);
        }
        return ret;
    },
    combineLineTower: function (lst, gridid) {
        var m = ProjectSGC.Global.getMainObject("ModelList");
        if (!m) return [];
        var grid = ProjectSGC.Helper.getGrid(gridid);
        var o = {}
        var data = [];
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            var type = row[0];
            var id = row[2];
            if (!id) //可能线路id取不到
                continue;
            if (!grid.hasLine(id))
                continue;
            var line = m.getLine(id);
            if (!line) continue;
            var value = row[7];
            var level = this.getWarnLevel(type, value);
            if (level < 0)
                continue;
            if (!o[id])
                o[id] = { obj: line, warns: {} };
            var warns = o[id].warns;
            var flag = type + level;
            if (!warns[flag])
                warns[flag] = { type: type, level: level, data: [] };
            warns[flag].data.push(row);
        }
        var ret = [];
        var idx = 0;
        for (var id in o) {
            var line = o[id].obj;
            var warns = o[id].warns;
            var name = line[ProjectSGC.LINE.NAME];
            var vol = ProjectSGC.Voltage.getName(line[ProjectSGC.LINE.VOLTAGE]);
            //var lineEval = this.getLineEvaluate(warns);
            var lineEval = 0;
            var rows = [];
            for (var w in warns) {
                var warn = warns[w];
                var type = warn.type;
                var level = warn.level;
                var data = warn.data;
                var tCount = 0;
                var tDetail = "";
                var towers = 0;
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    var scount = parseInt(row[8], 10);
                    if (scount > 0) {
                        towers += scount;
                    } else if (scount == 0) {
                        //var st = row[3];
                        //if (st)
                        towers++;//肯定有开始杆塔
                        var et = row[5];
                        if (et) towers++;
                    } else {
                        this.fullTowers(towers, type, row[4], row[6]);
                    }
                }
                var towerEval = (3 - level) * towers;
                lineEval += towerEval;
                //towers.sort(function (x, y) { return x - y });
                var row = [id, name, lineEval, towerEval, type, level, towers, "", vol];
                rows.push(row);
                ret.push(row);
            }
            for (var i = 0; i < rows.length; i++)
                rows[i][2] = lineEval;
            idx++;
        }
        ret.sort(function (x, y) {
            var v = Ysh.Compare.compareVoltage(x[8], y[8]);
            if (v != 0) return -v;
            return Ysh.Compare.compare(x[1], y[1]);
        });
        var idx = 0;
        var id = "";
        for (var i = 0; i < ret.length; i++) {
            var row = ret[i];
            if (row[0] != id) {
                idx++;
                id = row[0];
            }
            row.push(idx);
        }
        return ret;
    },
    getTypeImg: function (type, level) {
        switch (type) {
            case "icing": return "/i/sgc/env/fubing-" + level + ".png";
            case "fire": return "/i/sgc/env/fire-" + level + ".png";
            case "light": return "/i/sgc/env/leidian-" + level + ".png";
            case "temperature": return "/i/sgc/env/gaowen-" + level + ".png";
            case "wind": return "/i/sgc/env/dafeng-" + level + ".png";
            case "rain": return "/i/sgc/env/rain-" + level + ".png";
            default: return "";
        }
    },
    getDataMergeRows: function (d, data) {
        var m = d.column.merge;
        if (!m) return -1;
        var v = d.row[m];
        if (d.rowIndex > 0) {
            if (v == data[d.rowIndex - 1][m])
                return 0;
        }
        for (var i = d.rowIndex + 1; i < data.length; i++) {
            var row = data[i];
            if (row[m] == v)
                continue;
            return i - d.rowIndex;
        }
        return data.length - d.rowIndex;
    },
    mergeColumn: function (d, data) {
        var rows = SGCEnv.getDataMergeRows(d, data);
        if (rows < 0) return [1, 1];
        if (rows == 0) return [0, 0];
        return [rows, 1];
    }
}

Vue.component('lineenv-head', {
    props: {
        id: { type: String, "default": "" },
        name: { type: String, "default": "" }
    },
    data: function () {
        return {
        }
    },
    methods: {
        click: function () {
            ProjectSGC.Card.showCard("line", this.id);
        },
        showCurve: function () {
            var cardUrlInst = ProjectSGC.Global.getMainObject("cardUrlInst");
            if (!cardUrlInst) return;
            cardUrlInst.display({ card: "meascard", args: { type: "SG_DEV_" + ProjectSGC.Meta.getTypeById(this.id) + "_B", id: this.id } });
        }
    },
    created: function () {
    },
    template: `<div style="position:relative">
        <img style="display:block" src="/i/sgc/typhoon/xiejiao1.png" />
        <img style="display:block" src="/i/sgc/typhoon/xiejiao2.png" />
        <img style="position:absolute;top:120px;left:20px;cursor:pointer" src="/i/sgc/typhoon/quxian.png" @click="showCurve" />
        <div style="position:absolute;top:0px;height:100px;width:90px;left:0px;padding:0 5px;display:flex;justify-content:center;align-items:center">
            <span style="font-size:20px;font-weight:700;text-align:center;vertical-align:middle;cursor:pointer" @click="click">{{name}}</span>
        </div>
    </div>`
});

Vue.component('lineenv', {
    data: function () { return { groupList: [], wLeft: 60, wRight: 60, widthBox: 0, groupSelected: "", isLeft: true, isRight: false }; },
    props: {
        "datalist": { type: Array, "default": function () { return []; } },
        name: { type: String, "default": "" },
        itemwidth: { type: Number, "default": 120 },
        judge: { type: Function }
    },
    computed: {
        realList: function () { return this.arrangeList(this.datalist); },
        width: function () { return this.itemwidth; },
        needScroll: function () { return this.widthBox < this.widthAll; },
        groups: function () {
            return this.groupList;
            var ret = [];
            var gLast = null;
            var idx = 0;
            for (var i = 0; i < this.realList.length; i++) {
                var o = this.realList[i];
                if (o.group && o.group.text) {
                    if (gLast == null) {
                        gLast = { text: o.group.text, data: o.group, start: idx, end: idx };
                        ret.push(gLast);
                    } else {
                        if (gLast.text == o.group.text) {
                            gLast.end = idx;
                        } else {
                            gLast = { text: o.group.text, data: o.group, start: idx, end: idx };
                            ret.push(gLast);
                        }
                    }
                } else {
                    gLast = null;
                }
                var showItem = true;
                if (this.groupSelected) {
                    if (o.group.text != this.groupSelected)
                        showItem = false;
                }
                if (showItem)
                    idx++;
            }
            for (var i = 0; i < ret.length; i++) {
                var g = ret[i];
                this.extendGroup(g, i, ret[i - 1]);
                if (this.groupSelected) {
                    if (g.text == this.groupSelected)
                        return [g];
                }
            }
            return ret;
        },
        widthAll: function () {
            var w = 0;
            if (this.showList.length == 0) {
                w = this.wLeft + this.width;
            } else {
                var o = this.showList[this.showList.length - 1];
                w = o.left + o.width + this.width;
            }
            return w;
        },
        lineWidth: function () { return (this.widthAll - 60) + 'px'; },
        boxStyle: function () { return { width: Math.max(this.widthBox, this.widthAll) + 'px' }; },
        showCount: function () {
            if (!this.groupSelected)
                return this.realList.length;
            var ret = 0;
            for (var i = 0; i < this.realList.length; i++) {
                var item = this.realList[i];
                if (item.group.text != this.groupSelected)
                    continue;
                ret++;
            }
            return ret;
        },
        showList: function () {
            return this.realList;
        },
        leftImg: function () {
            return this.isLeft ? "/i/sgc/typhoon/left0613.png" : "/i/sgc/typhoon/left200613.png";
        },
        rightImg: function () {
            return this.isRight ? "/i/sgc/typhoon/right0613.png" : "/i/sgc/typhoon/right200613.png";
        },
        endLeft: function () {
            return (this.widthAll - 36) + 'px';
        }
    },
    methods: {
        canCombine: function (item1, item2) {
            if (item1.isTNode) return false;//T接点
            if (item2.isTNode) return false;//T接点
            if (item1.sameTowerLines != item2.sameTowerLines) return false;
            if (item1.others && item1.others.length > 0) //有三跨之类的
                return false;
            if (item1.envs.length != item2.envs.length) return false;
            var f = this.judge;
            if (!f) f = function (e1, e2) { return e1 == e2; }
            for (var i = 0; i < item1.envs.length; i++) {
                if (!f(item1.envs[i], item2.envs[i]))
                    return false;
            }
            return true;
        },
        isSameGroup: function (g1, g2) {
            if (!g1) return false;
            return g1.text == g2.text;
        },
        clone: function (item) { var o = {}; for (var k in item) { o[k] = item[k]; } return o; },
        arrangeList: function () {
            //{ id,name,group,data,envs,others }
            //根据数据属性重新分组
            var ret = [];
            var groups = [];
            var gLastData = null;
            var gLast = null;
            var oLast = null;
            for (var i = 0; i < this.datalist.length; i++) {
                var item = this.datalist[i];
                if (!this.isSameGroup(gLastData, item.group)) {
                    var o = this.clone(item);
                    o._items = [item];
                    o._index = ret.length;
                    this.extendItem(o, ret[ret.length - 1]);
                    ret.push(o);
                    var g = { data: item.group, items: [o] };
                    this.extendGroup(g, groups.length);
                    groups.push(g);
                    gLastData = g.data;
                    gLast = g;
                    oLast = o;
                    continue;
                }
                if (this.canCombine(oLast, item)) {
                    oLast._items.push(item);
                                oLast.others = item.others;
                } else {
                    var o = this.clone(item);
                    o._items = [item];
                    o._index = ret.length;
                    ret.push(o);
                    oLast = o;
                    gLast.items.push(o);
                }
                this.extendItem(oLast, ret[oLast._index - 1]);
            }
            this.groupList = groups;
            return ret;
        },
        getItemEnvs: function (item, index) {
            var arr = [];
            var lngth = item.envs.length;
            for (var i = 0; i < lngth; i++) {
                var env = item.envs[i];
                var o = { img: env.img, title: env.time, data: env };
                if (lngth > 2) {
                    var sz = parseInt(120 / lngth, 10);
                    var margin = 55 - sz;
                    o.styles = { width: sz + "px", height: sz + "px", "margin-top": margin + "px" };
                }
                arr.push(o);
            }
            return arr;
        },
        getItemText: function (item) {
            var items = item._items;
            if (items.length < 2) return SGCEnv.getTowerNum(item.text);
            return SGCEnv.getTowerNum(items[0].text) + "-" + SGCEnv.getTowerNum(items[items.length - 1].text);
        },
        locateNow: function () {
            this.$refs.jump.click();
        },
        getItemLeft: function (index, sz) {
            //var w = this.width * index + this.wLeft - sz;
            var w = this.width * (index + 1) + this.wLeft - sz;
            return w;
        },
        extendItem: function (item, itemPrev) {
            item.styles = {};
            var pos = 95;
            item.img = item.isTNode ? "/i/sgc/typhoon/t.png" : "/i/sgc/typhoon/tower.png";
            if (!itemPrev) {
                item.left = this.getItemLeft(item._index, this.width / 2);//(this.width * (index + 1) + this.wLeft - this.width / 2);
            } else {
                item.left = itemPrev.left + itemPrev.width;
            }
            item.styles.left = item.left + 'px'; //this.getItemLeft(index, 16);
            item.width = this.width * (item._items.length > 1 ? 1 : 1);
            item.styles.width = item.width + 'px';
            //item.styles.top = (pos - 10) + 'px';
        },
        extendGroup: function (g, index) {
            g.imgLeft = "/i/sgc/typhoon/group-left" + (index % 4) + ".png";
            g.imgMiddle = "/i/sgc/typhoon/g" + (index % 4) + ".png";
            g.imgRight = "/i/sgc/typhoon/group-right" + (index % 4) + ".png";
            g.imgHead = "/i/sgc/typhoon/head" + (index % 4) + ".png";
            var o = this;
            g.getStyles = function (index) {
                var items = this.items;
                var left = items[0].left;
                //if (index > 0)
                //    left -= o.width / 2;
                var width = 0;
                //if (index == 0)
                //    width = o.width / 2;
                for (var i = 0; i < items.length; i++)
                    width += items[i].width;
                return { width: width + 'px', left: left + 'px' };
            }
        },
        clickLink: function (item, index, link, linkIndex) {
            this.$emit('clicklink', item, index, link, linkIndex);
        },
        clickEnv: function (env) {
            this.$emit('clickenv', env);
        },
        click: function (item, bText) {
            //this.selectedIndex = index;
            //this.$emit('input', item.key);
            this.$emit('click', item, bText);
        },
                    clickOther: function (o) {
                        if (o.longitude && o.latitude) {
                            ProjectSGC.Map.fly(o.longitude, o.latitude);
                        }
                        this.$emit('clickother', o);
                    },
        refreshArrowImg: function () {
            var left = this.$refs.box.scrollLeft;
            this.isLeft = left == 0;
            this.isRight = (left + $(this.$refs.box).width()) == this.$refs.box.scrollWidth;

        },
        scroll: function (toLeft) {
            if (toLeft) { if (this.isLeft) return; }
            else { if (this.isRight) return; }
            this.$refs.box.scrollLeft += (toLeft ? -this.widthBox / 2.0 : this.widthBox / 2.0);
            this.refreshArrowImg();
        },
        selectGroup: function (g) {
            //if (this.groupSelected) this.groupSelected = "";
            //else this.groupSelected = g.text;
            //this.$emit("clickgroup", this.groupSelected ? g : null);
            this.$emit("clickgroup", g);
            //this.$refs.box.scrollLeft = 0;
            //this.isLeft = true;
            //this.isRight = false;
        },
        resize: function () {
            this.widthBox = $(this.$el).width();
        },
        onmousewheel: function (e) {
            this.scroll(e.wheelDelta > 0);
        }
    },
    created: function () {
        //this.curTime = new Date(Ysh.Time.parseDate("2019-08-12 00:00:00"));
    }, mounted: function () {
        this.widthBox = $(this.$el).width();
    }, template: `
            <div style="width:100%;height:100%" @mousewheel="onmousewheel($event)">
                <a ref="jump" style="display:none" href="#now"></a>
                <div ref="box" class="typhoon" :style="{width: (false?'calc(100% - 55px)':'100%') }">
                    <div class="typhoon-box" :style="boxStyle">
                        <img src="/i/sgc/typhoon/bk.png" class="typhoon-bk" />
                        <img src="/i/sgc/typhoon/line.png" class="typhoon-path" :style="{ width:lineWidth }" />
                        <img class="typhoon-item-img" style="left:42px;top:82px" src="/i/sgc/typhoon/biandianzhan.png" />
                        <template v-for="(item,index) in showList">
                            <div :id="item.domid" class="typhoon-item-img" :style="item.styles" style="text-align:center;height:113px;top:48px;">
                                <div style="position:absolute;bottom:78px;width:100%;">
                                    <div>
                                        <img v-for="(env) in getItemEnvs(item,index)" :title="env.title" :src="env.img" :style="env.styles" @click.stop="clickEnv(env)" />
                                    </div>
                                    <div v-for="line in item.sameTowerInfo" :title="line[1]" style="width:20px;height:3px;background-color:#4FC3EA;margin:auto;margin-bottom:2px;"></div>
                                </div>
                                <div style="position:absolute;width:100%;top:36px;"><img :src="item.img" style="cursor:pointer;" @click.stop="click(item)" /></div>
                                <div v-html="getItemText(item)" style="height:25px;width:100%;position:absolute;top:75px;"></div>
                            </div>
                            <div class="typhoon-item-time" :style="item.stylesAssist">{{ item.assist }}</div>
                            <div v-if="item.others" style="position:absolute;z-index:5;top:83px;width:84px;text-align:center" :style="{left:(item.left + 76)+'px'}">
                                <img v-for="o in item.others" :title="o.name" :src="o.img" style="vertical-align:middle;cursor:pointer" @click.stop="clickOther(o)" />
                            </div>
                        </template>
                        <img class="typhoon-item-img" style="top:82px" :style="{ left:endLeft }" src="/i/sgc/typhoon/biandianzhan.png" />
                        <div v-for="(g,index) in groups" :style="g.getStyles(index)" style="position:absolute;height:100%;font-size:0">
                            <div class="typhoon-group-img">
                                <img :src="g.imgMiddle" style="width:100%;height:100%;" />
                            </div>
                            <img :src="g.imgHead" class="typhoon-group-img-head" style="cursor:pointer;left:10px;" @click.stop="selectGroup(g)" />
                            <span class="typhoon-group-text-head" style="cursor:pointer;left:40px;" @click.stop="selectGroup(g)">{{ g.data.text }}</span>
                            <span style="position:absolute;left:237px;z-index:7;top:8px;cursor:pointer" v-if="groupSelected" @click.stop="selectGroup(g)"> 返回全路径</span>
                        </div>
                    </div>
                </div>
                <div class="typhoon-scroll" v-if="needScroll">
                    <img :src="leftImg" @click="scroll(true)" />
                    <img :src="rightImg" @click="scroll()" style="margin-left:2px;" />
                </div>
            </div>`
});
