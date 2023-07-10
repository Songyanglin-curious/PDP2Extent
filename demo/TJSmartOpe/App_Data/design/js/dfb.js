
this.ProjectSGC = ProjectSGC;
this.highLightLines = [];
this.selectedGroup = null;
this.selectedGroupId = "";
this.twinkleLineId = "";
var vm = this;
this.setHighLight = function (lineids) {
    ProjectSGC.Map.highLight(lineids, [], "", true);
    this.highLightLines = lineids;
}

this.doSetHighLight = function (selection) {
    this.setHighLight(Ysh.Array.to1d(selection, "lst_0"), []);
}
this.locate = function (row) {
    this.gotoLine(row);
}
this.gotoLine = function (row) {
    //if (row.isGroup) return;
    ProjectSGC.Map.locate("LINE", row.lst_0, null, true, function (msg) { msg.locateType = 14; msg.padding = [10, 10, 10, 10]; msg.rangeType = "rect"; });  
}
this.getRowClass = function (row) {
    if (!row._checked) return "";
    return row.isGroup ? "cg_selected" : "cl_selected";
}

this.highlight = (Ysh.Cookie.get("sgc_icing_highlight") == "1");
this.changeHighLight = function () {
    Ysh.Cookie.set("sgc_icing_highlight", this.highlight ? "1" : "");
    this.doHighLight();
}
this.ProjectSGC = ProjectSGC;
this.starttime = Ysh.Time.getTime("d", new Date());
this.endtime = Ysh.Time.getTime("d,d,1", new Date());
Ysh.Object.addHandle(this, "resize", function () {
    this.height = $(this.$el).height() - 80;
});

this.datelist = [];
var vm = this;
this.fSetDay = function (date) {
    var dt = Ysh.Time.toString(date, true);
    var dates = vm.datelist;
    for (var i = 0; i < dates.length; i++) {
        if (dates[i] == dt) {
            return [true, 'highlight', dates[i]];
        }
    }
    return [true, ''];
}
this.getGroupState = function (idx) {
    return this.$refs.tbl.groupState[this.groups[idx]] ? "/i/sgc/foldrow.png" : "/i/sgc/expandrow.png";
}
Ysh.Web.Event.attachEvent(window, "unload", function () {
    //ProjectSGC.Map.postMessage({eventType: 'menuope', menuname: 'ShaderGlowMeshForLine',selstate:false, data:{lineIDs:[],lineInfoArr:[],glowColor:""}});
    var MapOpeInst = ProjectSGC.Global.getMainObject("MapOpeInst");
    if (!MapOpeInst) return;
    ProjectSGC.Map.highLight([], [], "");
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { clear: true } });
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "ShowGlowForIceLine", selstate: false });
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showPartialTowerLine", selstate: false });
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: false, data: { type: "icingtower" } });
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showStationLineByOpacity", selstate: false, data: { lineIDs: [], stationIDs: [] } },"icing");
       
    //MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'SetYunTuMode', selstate: true, data: { modename: "main", modelevel: [] } });
});
this.loadCalendar = function () {
    var start = Ysh.Time.getTime("y,y,-3", new Date());
    var end = Ysh.Time.getTime("d", new Date());
    var args = [0, start, end];
    var vm = this;
    ProjectSGC.Data.loadYearData(["sgc/" + this.sqlfile + ":GetAllDays"], args, 0, 1, 2, function (data) {
        if (data.length == 0)
            return;
        var datelist = [];
        for (var i = 0; i < data.length; i++) {
            datelist.push(data[i][0]);
        }
        vm.datelist = datelist;
        return;
        function toCalendarList(data, timeIndex) {
            if (data.length == 0)
                return [];
            var start = Ysh.Time.getTime("y", new Date(data[0][timeIndex]));
            var end = Ysh.Time.getTime("y,y,1", new Date(data[data.length - 1][timeIndex]));
            var count = Ysh.Time.diff('d', start, end);
            var lst = [];
            for (var i = 0; i < count; i++) {
                lst.push("");
            }
            for (var r = 0; r < data.length; r++) {
                var time = data[r][timeIndex];
                lst[Ysh.Time.diff('d', start, new Date(time))] = 1;
            }
            return [start.getFullYear(), lst];
        }
        var ret = toCalendarList(data, 0);
        vm.year = ret[0];
        vm.load = ret[1];
    }, false);
}
this.search = function (sync) {
    var args = [0, this.starttime, this.endtime];
    this.loadingPDP = true;
    var vm = this;
    ProjectSGC.Data.loadYearData(["sgc/" + this.sqlfile + ":GetAcList", "sgc/" + this.sqlfile + ":GetDcList"], args, 0, 1, 2, function (data) {
        vm.lst = data;
        vm.highLight();
    }, sync);
}
this.doHighLight = function () {
    return;
    if (this.highlight) {
        ProjectSGC.Map.highLight(this.groups, [], "yellow");
    } else {
        ProjectSGC.Map.highLight([], [], "yellow");
    }
}
this.highLight = function () {
    var MapOpeInst = ProjectSGC.Global.getMainObject("MapOpeInst");
    this.doHighLight();
    var vm = this;
    var fdi = ProjectSGC.Global.getMainObject("floatDataInst");
    if (fdi)
        fdi.registerShowData("extline", function (item, f) {
            var content = {
                caption: "覆冰信息", list: [
                    { name: "线路名称", value: item[1] }
                    , { name: "杆塔区间", value: item[2] + "-" + item[3] }
                    , { name: "上报人", value: item[4] }
                    , { name: "电压等级", value: item[5] }
                    , { name: "覆冰类型", value: vm.getTypeName(item[6]) }
                    , { name: "设计冰厚", value: item[7] + "毫米" }
                    , { name: "覆冰厚度", value: item[8] + "毫米" }
                    , { name: "省份", value: item[9] }
                    , { name: "检测时间", value: item[10] }
                ]
            };
            f(content);
        });
    if (MapOpeInst) {
        MapOpeInst.postMessage({ eventType: "menuope", menuname: "showPartialTowerLine", selstate: false });
        MapOpeInst.postMessage({ eventType: "menuope", menuname: "ShowGlowForIceLine", selstate: false });
        MapOpeInst.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { clear: true } });
        MapOpeInst.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: false, data: { type: "icingtower" } });
        MapOpeInst.postMessage({ eventType: "menuope", menuname: "showStationLineByOpacity", selstate: false, data: { lineIDs: [], stationIDs: [] } },"icing");
        //MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'SetYunTuMode', selstate: true, data: { modename: "other", modelevel: [] } });
    }
    var stations = [];
    var lines = [];
    var groups = {};
    var ices = [];
    if ((this.lst.length > 0) && MapOpeInst) {
        var m = ProjectSGC.Global.getMainObject("ModelList");
        m.require(["station", "line", "grid", "dcc"], function () {
            Ysh.Array.each(vm.lst, function (row) {
                var id = row[0];
                var stower = row[2];
                var etower = row[3];
                if (stower && etower)
                    ices.push({ lineID: id, startTower: stower, endTower: etower });

                if (groups[id]) {
                    groups[id].data.floatData.push(row);
                    return;
                }
                var line = m.getLine(id);
                if (!line) return;
                var start_st_id = line[ProjectSGC.LINE.START_ST];
                var end_st_id = line[ProjectSGC.LINE.END_ST];
                var start_st_obj = m.getStation(start_st_id);
                if (start_st_obj) {
                    //var start_grid_id = start_st_obj.data.owner[1];
                    var start_st = Ysh.Object.clone(start_st_obj);
                    delete start_st.data.owner;
                    stations.push(start_st);
                } else {
                    console.warn(id);
                }
                var end_st_obj = m.getStation(end_st_id);
                if (end_st_obj) {
                    //var end_grid_id = end_st_obj.data.owner[1];
                    var end_st = Ysh.Object.clone(end_st_obj);
                    delete end_st.data.owner;
                    stations.push(end_st);
                } else {
                    console.warn(id);
                }
                var l = Ysh.Object.clone(m.getShowLine(line[0]));
                if (l != null) {
                    delete l.data.owner;
                    l.data.floatData = [row];
                    lines.push(l);
                    groups[id] = l;
                } else {
                    console.warn(id);
                }
            });
            MapOpeInst.postMessage({ eventType: "menuope", menuname: "ShowGlowForIceLine", selstate: true, data: ices });
            //MapOpeInst.postMessage({ eventType: "menuope", menuname: "showPartialTowerLine", selstate: true, data: ices });
            vm.loadingPDP = false;
        });

    } else {
        this.loadingPDP = false;
    }
}
this.locate = function (row) {
    var MapOpeInst = ProjectSGC.Global.getMainObject("MapOpeInst");
    if (!MapOpeInst) return; 
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: false, data: { type: "icingtower" } });
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { clear: true } });
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showPartialTowerLine", selstate: false });
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "ShowGlowForIceLine", selstate: false });
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showStationLineByOpacity", selstate: false, data: { lineIDs: [], stationIDs: [] } },"icing");
    //MapOpeInst.postMessage({ eventType: "menuope", menuname: "ShowGlowForIceLine", selstate: false });
    var v = row.lst_0;
    if (!v) return;
    var stower = row.lst_2;
    var etower = row.lst_3;
    if (stower && etower)
        MapOpeInst.postMessage({ eventType: "menuope", menuname: "ShowGlowForIceLine", selstate: true, data: [{ lineID: v, startTower: stower, endTower: etower }] });
    else
        ProjectSGC.Map.locate("LINE", v);
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { lineid: v, clear: false } });
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showStationLineByOpacity", selstate: true, data: { lineIDs: [v], stationIDs: ['1']} },"icing");          
    var year = new Date(Ysh.Time.parseDate(this.starttime)).getFullYear();
    PDP.read("SGC", "sgc/icing:GetLineTower", [v, this.starttime, this.endtime,year ], function (data) {
        if (!data.isOK) return;
        if (data.value.length == 0) return;
        var msg = []; var towerids = [];
        for (var i = 0; i < data.value.length; i++) {
            var item = data.value[i];
            towerids.addSkipSame(item[0]);
            towerids.addSkipSame(item[1]);
        }
        for (var i = 0; i < towerids.length; i++) {
            msg.push({ lineid: v, towerid: towerids[i] });
        }
        ProjectSGC.Map.postMessage({
            eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { type: "icingtower",z_index:6, paddingtop: -18, images: { width: 30, height: 37.5, imgUrl: "/textures/coin/Pin.png" }, locateData: msg }
        });

    });
}
this.locateRow = function (arr) {
    return;
    var MapOpeInst = ProjectSGC.Global.getMainObject("MapOpeInst");
    if (!MapOpeInst) return;
    //MapOpeInst.postMessage({ eventType: "menuope", menuname: "ShowGlowForIceLine", selstate: false });
    var v = arr[0] || arr.lst_0;
    if (!v) return;
    var stower = arr[2] || arr.lst_2;
    var etower = arr[3] || arr.lst_3;
    if (stower && etower)
        MapOpeInst.postMessage({ eventType: "menuope", menuname: "ShowGlowForIceLine", selstate: true, data: [{ lineID: v, startTower: stower, endTower: etower }] });
    else
        ProjectSGC.Map.locate("LINE", v);
    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { lineid: v, clear: false } });
}
this.changeResult = function () {
    var arr = "DCLOUD_ID,XLMC,QSGTH,ZZGTH,SBR,DYDJ,FBLX,XLSJBH,DXFBHD,SF,JCSJ".split(',');
    var lst = [];
    if (!this.datalist)
        return lst;
    var datalist = ProjectSGC.Service.getResult(this.datalist);
    if (!datalist)
        return lst;
    for (var i = 0; i < datalist.length; i++) {
        var item = datalist[i];
        var row = [];
        for (var j = 0; j < arr.length; j++) {
            row.push(item[arr[j]]);
        }
        var diff = parseFloat(row[8]) - parseFloat(row[7]);
        row.push((diff >= 0) ? "text_red" : ((diff >= -10) ? "text_orange" : ""));
        lst.push(row);
    }
    return lst;
}
this.doSearch = function (id, st, et, other) {
    if (id == "calendar") {
        this.showCalendar = true;
        this.$nextTick(function () {
            this.$refs.chart.resize();
        });
        return;
    }
    this.starttime = st;
    this.endtime = et;
    this.search();
}
this.getThickness = function (t) {
    if (!t) return t; return t + "";
}
this.getTypeName = function (t) {
    switch (t.toString()) {
        case "0": return "雾凇";
        case "1": return "混合凇";
        case "2": return "雨凇";
        case "3": return "覆雪";
        default: return "";
    }
}
this.lst = [];

this.init = function () {
    this.loadCalendar();
    this.resize();
    ProjectSGC.require(["voltage", "gridlevel"]);
    this.$nextTick(function () { this.search(); });
    var vm = this;
    window.addEventListener('message', function (event) {
        if (!event.data)
            return;
        var data = event.data;
        if (data.type == "timechanged") {
            vm.starttime = data.data.time;
            vm.endtime = Ysh.Time.toString(Ysh.Time.add(data.data.type, 1, data.data.time));
            vm.search();
        }
    });
    ProjectSGC.Event.Message(function (type, data, eventType) {
        //if (type == "mapchanged")
        //    vm.search();
        if ((type == "extline") && (eventType == 5)) {
            vm.$refs.tbl.locate(data.lineItemId);
            vm.hID = "#a" + data.lineItemId;
            vm.$nextTick(function () {
                this.$refs.jump.click();
            });
        }
    });
}