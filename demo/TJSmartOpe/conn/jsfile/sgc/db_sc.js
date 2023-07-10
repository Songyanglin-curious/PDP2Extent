/*v=1.21.910.1*/
var SGCDB = {
    db: null,
    version: 2,

    open: function (callback) {
        var request = window.indexedDB.open("yshmap_db", this.version);
        request.onsuccess = function (event) {
            SGCDB.db = event.target.result;
            console.log("数据库打开")
            if (callback)
                callback();
        };
        request.onupgradeneeded = function (event) {
            console.log('数据库升级');
            SGCDB.db = event.target.result;
            SGCDB.createTables();
        };
        request.onerror = function (event) {
            window.setTimeout(function () { SGCDB.open(callback); }, 100); //继续打开
        };
    },
    select: function (tbl, id, callback) {
        try {
            var transaction = this.db.transaction([tbl]);
            var objectStore = transaction.objectStore(tbl);
            var request = objectStore.get(id);
        }
        catch (e) {
            console.log("read exception:" + tbl + "," + id);
            return;
        }
        request.onsuccess = function (event) {
            var result = event.target.result;
            if (result) {
                callback(result.data);
            } else {
                callback(null);
            }
        }
        request.onerror = function (event) {
            console.log("read error:" + tbl);
            callback(null, true);
        }
    },
    modify: function (tbl, id, data, callback) {
        var trans = this.db.transaction([tbl], 'readwrite');
        var request = trans.objectStore(tbl).put({ id: id, data: data });
        request.onsuccess = function (event) { if (callback) callback(); };
        request.onerror = function (event) { if (callback) callback(true); };
    },
    delete: function (tbl, id, callback) {
        var trans = this.db.transaction([tbl], 'readwrite');
        var request = trans.objectStore(tbl).delete(id);
        request.onsuccess = function (event) { if (callback) callback(); };
        request.onerror = function (event) { if (callback) callback(true); };
    },    
    
    tasks: [],
    worker: null,
    STATE: "_table_state_",
    DATA: "_table_data_",
    tables: [],
    tableState: {},
    loadings: {},
    reads: [],
    datasets: {},
    last: new Date(),
    initStart:false,
    needCache: function (tbl) {
        for (var i = 0; i < this.tables.length; i++) {
            var t = this.tables[i];
            if (t.type == tbl)
                return t.cache;
        }
        return false;
    },
    cache: function (tbl, d) {
        if (d.data && (typeof d.data == "string")) {
            //var r = eval(d.data);
            var r = JSON.parse(d.data);
            d = { type: tbl, data: r[1] }
        }
        if (this.needCache(tbl))
            this.datasets[tbl] = d;
        return d;
    },
    doInit: function () {
        this.tables = [
        ];
        var codes = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 2001, 2002, 2003, 2004, 2005, 2006, 3001, /*3002,*/
            "line", "sgc/main:GetPwrGrid", "sgc/main:GetDispatchOrg"];
        for (var i = 0; i < codes.length; i++) {
            this.tables.push({ type: codes[i], span: 60, special: true });
        }
        var others = [{ type: "PLANTSTATIONVOLTAGE", span: 60 }, { type: "STATE", span: 60 }, { type: "GRID", span: 60 }
            //, { type: "HVDCSYS", span: 60 }
            , { type: "LINEENDS", span: 1440 }
            //, { type: "ZONEPLANT", span: 1440, cache: true }, { type: "ZONELINE", span: 1440, cache: true }, { type: "ZONESTATION", span: 1440, cache: true }
        ];
        for (var i = 0; i < others.length; i++) {
            this.tables.push(others[i]);
        }
        var request = window.indexedDB.open("yshmap_db", this.version);
        request.onsuccess = function (event) {
            SGCDB.db = event.target.result;
            console.log("数据库打开")
            SGCDB.initData();
            SGCDB.execReads();
        };
        request.onupgradeneeded = function (event) {
            console.log('数据库升级');
            SGCDB.db = event.target.result;
            SGCDB.createTables();
        };
        request.onerror = function (event) {
            console.log('数据库打开报错');
            SGCDB.doInit();//继续打开
        };
    },
    init: function () {
        if (this.initStart) return;
        this.initStart = true;
        this.doInit();
    },
    createTable: function (name, options) {
        if (!this.db.objectStoreNames.contains(name)) {
            this.db.createObjectStore(name, options);
            console.log("表" + name + "创建成功")
        }
    },
    createTables: function () {
        this.createTable(this.DATA, { keyPath: "name" });
        this.createTable(this.STATE, { keyPath: "name" });
        this.createTable("tower_edit", { keyPath: "id" });
    },
    read: function (tbl, callback) {
        this.reads.push([tbl, callback]);
        this.execReads();
    },
    read2: function (tbls, callback) {
        if (tbls.length == 0) return;
        if (tbls.length == 1) return this.read(tbls[0], callback);
        var tbl = tbls.splice(0, 1);
        var THIS = this;
        this.read(tbl[0], function () {
            THIS.read2(tbls, callback);
        });
    },
    execReads: function () {
        if (!this.db) return;
        if (this.reads.length == 0) return;
        var read = this.reads.splice(0, 1)[0];
        this.execRead(read[0], read[1]);
        this.execReads();
    },
    execRead: function (tbl, callback) {
        if (this.datasets[tbl]) {
            callback(this.datasets[tbl]);
            return;
        }
        var THIS = this;
        try {
            var transaction = this.db.transaction([this.DATA]);
            var objectStore = transaction.objectStore(this.DATA);
            var request = objectStore.get(tbl);
        request.onsuccess = function (event) {
            var result = event.target.result;
            if (result) {
                var d = result.data;
                    callback(THIS.cache(tbl, d));
            } else {
                    //console.log("start success empty:" + tbl);
                window.setTimeout(function () {
                    THIS.execRead(tbl, callback);
                }, 100);
            }
        }
        request.onerror = function (event) {
            console.log("read error:" + tbl);
            window.setTimeout(function () {
                THIS.execRead(tbl, callback);
            }, 100);
        }
        }
        catch (e) {
            console.log("read exception:" + tbl);
            window.setTimeout(function () {
                THIS.execRead(tbl, callback);
            }, 100);
            return;
        }
    },
    saveState: function () {
        var trans = this.db.transaction([this.STATE], 'readwrite');
        trans.objectStore(this.STATE).put({ name: "all", data: this.tableState });
    },
    update: function (tbl, data, callback) {
        if (typeof data == "undefined") return;
        var trans = this.db.transaction([this.DATA], 'readwrite');
        var request = trans.objectStore(this.DATA).put({ name: tbl, data: data });
        var THIS = this;
        request.onsuccess = function (event) { THIS.cache(tbl, data); if (callback) callback(); THIS.tableState[tbl] = new Date(); THIS.saveState(); THIS.setLoading(tbl, false); };
        request.onerror = function (event) { if (callback) callback(true); THIS.setLoading(tbl, false); };
    },
    setLoading: function (tbl, loading) { this.loadings[tbl] = loading; },
    syncTable: function (table) {
        var name = table.type;
        if (this.tableState[name]) {
            if (Ysh.Time.diff('mi', this.tableState[name], new Date()) < table.span)
                return false;
            if (Ysh.Time.diff("mi", this.last, new Date()) < 1) { //1分钟没操作才开始同步
                return false;
            }
        }
        console.log("sync:" + name);
        this.loadings[name] = true;
        if (table.special)
            this.worker.postMessage(name);
        else
            this.worker.postMessage({ type: "sync", name: name, time: "all" });
        return true;
    },
    time0: new Date(),
    syncMode: 1,//0 - 并行，1 - 串行
    syncTimer:0,
    startSync: function () {
        if (this.syncMode) {
            for (var i = 0; i < this.tables.length; i++) {
                var table = this.tables[i];
                if (this.loadings[table.type])
                    continue;
                if (this.syncTable(table))
                    return;
            }
        } else {
            //系统加载后30s再开始同步
            //if (Ysh.Time.diff('ss', this.time0, new Date()) >= 30) {
        try {
            for (var i = 0; i < this.tables.length; i++) {
                var table = this.tables[i];
                if (this.loadings[table.type])
                    continue;
                this.syncTable(table);
            }
        } catch (err) {
        }
            //}
        }
        var THIS = this;
        if (this.syncTimer)
            window.clearTimeout(this.syncTimer);
        this.syncTimer = window.setTimeout(function () { THIS.startSync(); }, 1000);
    },
    loadState: function () {
        var transaction = this.db.transaction([this.STATE]);
        var objectStore = transaction.objectStore(this.STATE);
        var request = objectStore.get("all");

        var THIS = this;
        request.onsuccess = function (event) {
            var result = event.target.result;
            if (result) {
                THIS.tableState = result.data;
            }
            THIS.startSync();
        }
        request.onerror = function (event) {
            THIS.startSync();
        }
    },
    initData: function () {
        this.worker = new Worker("/conn/jsfile/sgc/modelwork.js?v=1.22.818.1");
        this.worker.onmessage = function (event) {
            var data = event.data;
            if (SGCDB.syncMode)
                SGCDB.startSync();
            if (data.type == "sync") {
                if (data.fail) {
                    SGCDB.setLoading(data.name, false);
                } else {
                    var r;
                    try {
                        r = JSON.parse(data.data);
                        //eval("r = " + data.data);
                    }
                    catch (E) {
                        r = [false];
                    }
                    if (!r[0]) {
                        SGCDB.setLoading(data.name, false);
                    } else {
                        SGCDB.update(data.name, r[1]);
                    }
                }
            } else {
                if (data.fail) {
                    SGCDB.setLoading(data.type, false);
                } else {
                    if (["line", "sgc/main:GetPwrGrid", "sgc/main:GetDispatchOrg"].indexOf(data.type) < 0)
                        SGCDB.update(data.type, data);
                    else {
                        var r;
                        try {
                            //eval("r = " + data.data);
                            r = JSON.parse(data.data);
                        }
                        catch (E) {
                            r = [false];
                        }
                        if (!r[0]) {
                            SGCDB.setLoading(data.type, false);
                        } else {
                            SGCDB.update(data.type, data);
                        }
                    }
                }
            }
        }
        this.loadState();
    },
    postMessage: function (type) {
        var THIS = this;
        this.read(type, function (data) {
            if (THIS.onmessage) {
                THIS.onmessage({ type: type, data: data });
            }
        });
    }
};
//SGCDB.init();