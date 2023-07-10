/*v=1.21.1019.1*/
var ModelList = {
    psForType: {},
    psForId: {},
    psForTypeCallBack: {},
    worker: null,
    getPlantStationList: function (type, callback) {
        if (this.psForType[type]) {
            callback(this.psForType[type]);
            return;
        }
        if (this.psForTypeCallBack[type])
            this.psForTypeCallBack[type].push(callback);
        else
            this.psForTypeCallBack[type] = [callback]
        if (this.psForTypeCallBack[type].length > 1) {//原来有在取数据的操作
            return;
        }

        this.worker.postMessage(type);
    },
    getPlantStationListIndex: function (types, n, items, callback) {
        if (n >= types.length) {
            callback(items);
            return;
        }
        var o = this;
        this.getPlantStationList(types[n], function (data) {
            for (var i = 0; i < data.length; i++) {
                items.push(data[i]);
            }
            o.getPlantStationListIndex(types, n + 1, items, callback);
        });
    },
    getPlantStationListEx: function (types, callback) {
        var items = [];
        this.getPlantStationListIndex(types, 0, items, callback);
    },
    receiveOne: function (id, list, desc, data, f) {
        if (!this[id]) {
            this[list] = data.data;
            this[id] = f(data.data);
            this.checkRequires();
        }
        this.startLoadOther();
    },
    makeSure: function (item) {
        if (this[item.id]) return true;
        var data = PDP.read("SGC", item.xml, []);
        if (!data.check("获取" + item.desc, true))
            return false;
        data = data.value;
        this[item.id] = item.f(data);
        this.checkRequires();
    },
    toDict: function (data) {
        var dict = {};
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            dict[row[0]] = row;
        }
        return dict;

    },
    others: [
        {
            id: "lines", list: "lineList", desc: "线路信息", xml: "line", state: 0, f: function (data) {
                return ModelList.toDict(data);
            }
        },
        {
            id: "grids", list: "gridList", desc: "电网信息", xml: "sgc/main:GetPwrGrid", state: 0, f: function (data) {
                return {
                    dict: ModelList.toDict(data), tree: Ysh.Array.toTree(data, 0, 2)
                };
            }
        },
        {
            id: "dccs", list: "dccList", desc: "调度信息", xml: "sgc/main:GetDispatchOrg", state: 0, f: function (data) {
                return {
                    dict: ModelList.toDict(data), tree: Ysh.Array.toTree(data, 0, 2)
                };
            }
        }
    ],
    receive: function (data) {
        if (data.fail) {//失败了，重取
            this.worker.postMessage(data.type);
            return true;
        }
        var type = data.type;
        for (var i = 0; i < this.others.length; i++) {
            var item = this.others[i];
            if (item.xml == type) {
                this.receiveOne(item.id, item.list, item.desc, data, item.f);
                return true;
            }
        }
        return false;
    },
    createWorker: function () {
        var o = this;
        //this.worker = new Worker("/conn/jsfile/sgc/modelwork.js?v=1.19.1220.1");
        this.worker = SGCDB;
        this.worker.onmessage = function (event) {
            if (o.receive(event.data))
                return;
            var type = event.data.type;
            var items = event.data.items;
            o.psForType[type] = items;
            for (var a = 0; a < items.length; a++) {
                var row = items[a];
                o.psForId[row.ID] = row;
            }
            var cbs = o.psForTypeCallBack[type] || [];
            for (var i = 0; i < cbs.length; i++) {
                try {
                    var cb = cbs[i];
                    if (cb) cb(items);
                } catch (e) {
                }
            }
            o.psForTypeCallBack[type] = [];
            o.checkRequires();
        }
    },
    startLoad: function () {
        var codes = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 2001, 2002, 2003, 2004, 2005, 2006, 3001, 3002];
        var n = 0;
        var f = function () {
            if (n < codes.length)
                ModelList.getPlantStationList(codes[n++], f)
            else {
                ModelList.loaded = true;
                ModelList.doFinish();
                ModelList.startLoadOther();
            }
        }
        f();
    },
    startLoadOther: function () {
        for (var i = 0; i < this.others.length; i++) {
            var item = this.others[i];
            if (item.state == 0) {
                item.state = 1;
                this.worker.postMessage(item.xml);
                return;
            }
        }
    },
    getStation: function (id) {
        return this.psForId[id];
    },
    lines: null,
    getLine: function (id) {
        /*if (this.lines == null) {
            var data = PDP.read("SGC", "sgc/line:GetAllLineInfo", []);
            if (!data.check("获取线路数据", true))
                return null;
            data = data.value;
            var lines = {};
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                lines[row[0]] = row;
            }
            this.lines = lines;
            this.checkRequires();
        }*/
        return this.lines[id];
    },
    finishedCall: [],
    doFinish: function () {
        for (var i = 0; i < this.finishedCall.length; i++)
            this.finishedCall[i]();
    },
    loaded: false,
    useAll: function (f) {
        this.require(["station","line","grid"],f);
    },
    grids: null,
    getGrid: function (id) {
        if (!this.makeSure(this.others[1]))
            return null;
        return this.grids.dict[id];
    },
    dccs: null,
    getDcc: function (id) {
        if (!this.makeSure(this.others[2]))
            return null;
        return this.dccs.dict[id];
    },
    requiresCall: [],
    isMatch: function (types) {
        for (var i = 0; i < types.length; i++) {
            var t = types[i];
            if (t == "station") {
                if (!this.loaded)
                    return false;
                continue;
            }
            for (var j = 0; j < this.others.length; j++) {
                var item = this.others[j];
                if (item.id == t + "s") {
                    if (!this[item.id])
                        return false;
                    break;
                }
            }
        }
        return true;
    },
    require: function (types, f) {
        if (this.isMatch(types)) {
            f();
            return;
        }
        this.requiresCall.push({ types: types, func: f, state: false });
    },
    checkRequires: function () {
        //先不执行删除，只加上状态
        for (var i = 0; i < this.requiresCall.length; i++) {
            var c = this.requiresCall[i];
            if (c.state)//已经在执行了
                continue;
            if (!this.isMatch(c.types))
                continue;
            c.state = true;
            (c.func)();
        }
    },
    getShowStation: function (id) { },
    getShowLine: function (id) {
        var line = this.getLine(id);
        if (!line) return null;
        var st = this.getStation(line[9]);
        if (!st) return null;
        var et = this.getStation(line[10]);
        if (!et) return null;
        ProjectSGC.require("voltage");
        var vol = line[8];
        var v = ProjectSGC.Voltage[vol]
        volvalue = v ? v.value : "";
        return {
            END_ST: { LATITUDE: et.LATITUDE, LONGITUDE: et.LONGITUDE, VOLTAGE_TYPE: et.VOLTAGE_TYPE },
            START_ST: { LATITUDE: st.LATITUDE, LONGITUDE: st.LONGITUDE, VOLTAGE_TYPE: st.VOLTAGE_TYPE },
            code: vol, ID: line[0], NAME: line[1], VOLTAGE_TYPE: volvalue,
            data: { owner: [line[6], line[7]], operatedate: line[11] }
        };
    }
}

ModelList.createWorker();

Ysh.Web.Event.attachEvent(window, "onload", function () { ModelList.startLoad() });

var SGCModel = {
    tree: null,
    data: null,
    dcol: -1,
    gcol: -1,
    rcol: -1,
    capcol:3,
    pstype:"",
    init: function () {
        if (this.tree)
            return;
        if (!ModelList.grids)
            return;
        this.tree = ModelList.grids.tree;//Ysh.Array.toTree(ModelList.gridList, 0, 2);
        /*
        var grid = PDP.read("SGC", "sgc/plant:GetPwrGrid", []);
        if (!grid.check("获取电网结构", true))
            return false;
        this.tree = Ysh.Array.toTree(grid.value, 0, 2);
        */

        return true;
    },
    getByGrid: function (lst, d) {
        if (!d)
            return lst;
        var node = this.tree.find("0101" + d.substr(4));
        if (node != null) {
            var ds = [];
            for (var i = 0; i < lst.length; i++) {
                var row = lst[i];
                var gridid = row[this.gcol];
                if (!gridid) continue;
                if (node.contains(gridid))
                    ds.push(row);
            }
            return ds;
        }
    },
    getListByTime: function (lst, f) {
        var ds = [];
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            if (f(row))
                ds.push(row);
        }
        return ds;
    },
    refreshStation: function (typename, tm) {
        this.pstype = typename;
        this.init();
        var main = vMain;
        var args = main.getDefaultArgs("statistics");
        var dccid = SelectCityInst.locateid;
        var isOutZone = userSettings.itemShowInNet.value;
        var d = (isOutZone == "1" ? "" : dccid);
        var type = args.s;
        var voltages = (args.v || []).join();
        var lst = PDP.read("SGC", "sgc/station:GetStationList", [type, voltages]);
        if (!lst.check("获取变电站容量", true))
            return null;
        this.dcol = 6;
        this.gcol = 4;
        this.rcol = 8;
        this.data = this.getByDcc(lst.value,d);
        return this.refreshTime(tm);
    },
    refreshPlant: function (typename, tm) {
        this.pstype = typename;
        this.init();
        var main = vMain;
        var args = main.getDefaultArgs("statistics");
        var dccid = SelectCityInst.locateid;
        var isOutZone = userSettings.itemShowInNet.value;
        var d = (isOutZone == "1" ? "" : dccid);
        var type = args.p;
        var voltages = (args.v || []).join();
        var lst = PDP.read("SGC", "sgc/plant:GetTingDianYa", [type, voltages]);
        if (!lst.check("获取发电厂容量", true))
            return null;
        this.dcol = 8;
        this.gcol = 4;
        this.rcol = 10;
        this.data = this.getByDcc(lst.value,d);
        return this.refreshTime(tm);
    },
    getCapacity: function (lst) {
        var cap = 0.0;
        for (var i = 0; i < lst.length; i++) {
            var c = lst[i][this.capcol];
            if (!c)
                continue;
            cap += parseFloat(c);
        }
        return parseInt(cap, 10);
    },
    refreshTime: function (tm, f) {
        this.init();
        if (!this.data) return;
        var main = vMain
        var timetype = main.sectiontype;
        var rcol = this.rcol;
        var data = this.getListByTime(this.data, function (row) {
            var tmThis = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(Ysh.Time.parseDate(row[rcol])), timetype));
            return tmThis == tm;
        });
        var lst = [];
        var words = 0;
        for (var i = 0; i < data.length; i++) {
            var w = data[i][1];
            if ((words + w.length > 15) && (words > 0))
                break;
            words += (w.length + 1);
            lst.push(w);
        }
        var str = Ysh.Time.formatString(tm, Ysh.Time.getTypeFormat(timetype, "1"));
        if (lst.length == 0)
            str += "没有投运" + this.pstype;
        else
            str += "投运了" + lst.join("、") + ((lst.length == data.length) ? "" : "等" + data.length + "座") + this.pstype + "，总容量：" + this.getCapacity(data) + "MW";
        if (f)
            f({ content: str });
        return { content: str }
    }
}

/*
items.push({
    PlantStationType: tp, LONGITUDE: itemSta[0], LATITUDE: itemSta[1], VOLTAGE_TYPE: vol, TOP_VOLTAGE_TYPE: vol, ID: id, NAME: nm, code: itemSta[7],
    data: { id: id, name: nm, plantstationtype: tp, voltage: volname, operatedate: itemSta[6], owner: [itemSta[8], itemSta[9]], state: itemSta[10] }
});
 */