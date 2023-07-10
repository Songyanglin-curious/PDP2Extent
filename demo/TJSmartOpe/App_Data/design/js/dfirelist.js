
var vm = this;
Ysh.Web.Event.attachEvent(window, "unload", function () {
    vm.closePage();
});

Ysh.Object.addHandle(this, "resize", function () {
    this.height1 = $(this.$el).height() - 92 - 40;
    this.height2 = this.height1 - 25;
});
this.setGridSelected = function (nodes) {
    var arr = [];
    for (var i = 0; i < nodes.length; i++) {
        arr.push(nodes[i].getId());
    }
    this.gridSelected = arr;
}
//ProjectSGC.Global.getMainObject("vMain").setLegend("none", true);
this.closePage = function () {
    ProjectSGC.Map.highLight([], []);
    this.closeLine();
    var main = ProjectSGC.Global.getMainObject("vMain");
    if (!main) return;
    //main.setLegend("none", false);
    main.destroyFloatPage(this.bar);
}
this.renderHeader = function (h, o) {
    return h("span", {
        style: { color: "rgba(252, 186, 115, 0.8)" }
    }, [o.column.title]);
}
this.closeLine = function () {
    // this.bar.hide = false;
    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showStationLineByOpacity", selstate: false, data: { lineIDs: [], stationIDs: [] } }, "fire");
    this.showBar();
    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: false, data: { type: "firetower" } });
    var main = ProjectSGC.Global.getMainObject("vMain");
    if (!main) return;
    if (!this.linePage) return;
    main.destroyFloatPage(this.linePage);
}
this.locateRow = function (row) {
    //ProjectSGC.Map.locate("LINE", row.id);
    this.clickLine(row);
}
this.showLineLight = function (id, st, et) {
    var vMain = ProjectSGC.Global.getMainObject("vMain");
    if (!vMain) return;
    if (this.linePage)
        vMain.destroyFloatPage(this.linePage);
    var st = Ysh.Time.toString(st);
    var et = Ysh.Time.toString(et);
    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'showBillboardIcon', selstate: false, data: { type: "lei" } });
    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showStationLineByOpacity", selstate: true, data: { lineIDs: [id], stationIDs: ['1'] } }, "fire");
    (ProjectSGC.Global.getMainObject("bottomMenuInst") || {}).noMenu = id;
    ProjectSGC.Map.locate("", id);
    ProjectSGC.Map.hideIcon("fire");
    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: false, data: { type: "firetower" } });
    var args = {
        lineid: id, st: st, et: et
    };
    args.main = this;
    this.bar.hide = true;
    args.types = "fire";
    this.linePage = vMain.floatPage("sgc_env_line", args, "1.20.702.1");
    return;
    PDP.read("SGAPP", "sgc/fire:GetLineTower", [id, st, et], function (data) {
        if (!data.isOK) return;
        if (data.value.length == 0) return;
        var msg = [];//{ type: "firetower", image: { width: 30, height: 37.5, url: "/textures/coin/Pin.png" }, locateData: [{ lineid: "", towerid: "", data: {} }] };
        var towerids = [];
        for (var i = 0; i < data.value.length; i++) {
            var item = data.value[i];
            //var lon = item[0];
            //var lat = item[1];
            towerids.addSkipSame(item[0]);
            towerids.addSkipSame(item[1]);
        }
        for (var i = 0; i < towerids.length; i++) {
            msg.push({ lineid: id, towerid: towerids[i] });
        }
        ProjectSGC.Map.postMessage({
            eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { type: "firetower", paddingtop: -18, images: { width: 30, height: 37.5, imgUrl: "/textures/coin/Pin.png" }, locateData: msg }
        });

    });
}
this.clickLine = function (row) {
    this.showLineLight(row.id, this.st, this.et);
}
this.searchMoreTime = function (bOnlyBar) {
    var s = Math.min(this.startHour, this.endHour);
    var e = Math.max(this.startHour, this.endHour);
    var s = this.startHour;
    var e = this.endHour;
    //var st = Ysh.Time.add('mi', this.startMinute, Ysh.Time.add('h', s, this.moreTime));
    //var et = Ysh.Time.add('mi', this.endMinute + 1, Ysh.Time.add('h', e, this.moreTime1));
    var st = this.moreTime;
    var et = this.moreTime1;
    if (st >= et) {
        alert("开始时间必须小于结束时间！");
        return;
    }
    this.st = st;
    this.et = et;
    this.timeType = 3;
    this.type = '';
    this.showMore = false;
    this.ds0 = null;
    this.refreshByTime(bOnlyBar);
}
this.getTimeString = function () {
    if(parseInt(this.timeType)==-1||parseInt(this.timeType)==3){
        switch (parseInt(this.timeType)) {
            case -1:
                return Ysh.Time.formatString(this.st, "111111") + " ~ " + Ysh.Time.formatString(this.et, "111111");
            case 0:
            case 1:
                return Ysh.Time.formatString(this.st, "111000");
            case 2:
                return Ysh.Time.formatString(this.st, "1110000");
            case 3:
                return Ysh.Time.formatString(this.st, "111110") + " ~ " + Ysh.Time.formatString(this.et, "111110");
                //return Ysh.Time.formatString(this.moreTime, "1111000") + "" + this.startHour + "时" + this.startMinute + "分-" + Ysh.Time.formatString(this.moreTime1, "1111000") + "" + this.endHour + "时" + this.endMinute + "分";
            default:
                return Ysh.Time.formatString(this.st, "111000");
        }
    }else{
        switch (this.type) {
            case 'today':
            case 'tomorrow':
                return Ysh.Time.formatString(this.st, "111000");
            default:
                return Ysh.Time.formatString(this.st, "111110") + " ~ " + Ysh.Time.formatString(this.et, "111110");
        }
    }

}
this.refreshTimeRange = function () {
    switch (parseInt(this.timeType)) {
        case -1:
            this.st = new Date();
            this.et = Ysh.Time.add('h', 3, this.st);
            break;
        case 0:
            this.st = Ysh.Time.getTime("d");
            this.et = Ysh.Time.getTime("d,d,1");
            break;
        case 1:
            this.st = Ysh.Time.getTime("d,d,-1");
            this.et = Ysh.Time.getTime("d");
            break;
        case 2:
            this.st = Ysh.Time.getTime("m");
            this.et = Ysh.Time.getTime("m,m,1");
            break;
    }
    this.y = this.st.getFullYear();
}
//this.refreshTimeRange();
this.st = Ysh.Time.getTime("d");
this.et = Ysh.Time.getTime("d,d,1");
this.refreshByTime = function (onlyBar) {
    if (!onlyBar)
        this.refresh();
    if (!this.bar) return;
    if (!this.bar.$children) return;
    if (!this.bar.$children[0]) return;
    if (!this.bar.$children[0].setTime) return;
    this.bar.$children[0].setTime(Ysh.Time.toString(this.st), Ysh.Time.toString(this.et), onlyBar);
}
this.changeTime = function (timetype) {
    if (timetype != 3) {
        if (this.timeType == timetype) return;
        this.type = '';
        this.showMore = false;
    } else {
        this.showMore = !this.showMore;
        return;
    }
    this.ds0 = null;
    this.timeType = parseInt(timetype, 10);
    this.refreshTimeRange();
    this.refreshByTime();
}
this.doSearch = function(id,st,et,other) {
    this.timeType = '';
    this.showMore = false;
    this.ds0 = null;
    this.st = new Date(st);
    this.et = new Date(et);
    this.y = this.st.getFullYear();
    this.refreshByTime();
}
this.datalist = [
   // ["0", "雷电概况", "/i/ctrl/help.png"],
    ["1", "告警线路", "/i/ctrl/help.png"],
   // ["2", "关联故障", "/i/ctrl/help.png"]
];

this.initConst = function () {
    this.moreTime = Ysh.Time.getTime("d");
    this.moreTime1 = Ysh.Time.getTime("mm");
    this.lstShowStationLine = [];
    this.hours = [];
    for (var i = 0; i < 24; i++) {
        this.hours.push([i, (i < 10 ? "0" + i : i) + "时"]);
    }
    this.minutes = [];
    for (var i = 0; i < 60; i++) {
        this.minutes.push([i, (i < 10 ? "0" + i : i) + "分"]);
    }
    this.ds0 = null;
    this.lstGridEffect = [];
    this.linePage = null;
}

this.initRequest = function (m) {
    if (!(this.inittime && this.initline))
        return false;
    var _this = this;
    _this.moreTime1 = Ysh.Time.getTimeStart(Ysh.Time.add('ss', 59, new Date(Ysh.Time.parseDate(this.inittime))), "mi");
    _this.moreTime = Ysh.Time.add('mi', -3, _this.moreTime1);
    _this.moreTime1 = Ysh.Time.add('mi', 3, _this.moreTime1);
    _this.timeType = 3;
    _this.curtype = 2;
    _this.statType = 2;
    _this.searchMoreTime(true);
    _this.refreshFault(m);
    _this.showLineLight(_this.initline, _this.st, _this.et);
    return true;
}

this.initConst();

this.help = function (v) {
    return;
    var arr = [];
    this.helpString = arr.join("<br />");
    this.showHelp = true;
}
this.getItemStyle = function (n) {
    var s = {
    };
    if (n == 0) {
        s.left = "25px";
    } else {
        s.left = (n * 136 - 5) + 'px';
    }
    return s;
}
this.getVoltage = function (v, code) {
    var vol = v[code]; return (vol ? vol.name : "");
}
this.getGrid = function (id) {
    var g = this.tree.find(id); if (!g) return "";
    if (!g.data) {
        console.log(g);
        return "";
    }
    return g.data[1];
}
this.setGrid = function (grid) {
    this.city = grid; this.refresh();
}
this.showBar = function () {
    if (this.linePage) {
        ProjectSGC.Global.getMainObject("vMain").destroyFloatPage(this.linePage);
        this.linePage = null;
    }
    if (!this.bar) return;
    if (!this.bar.hide) return;
    this.bar.hide = false;
    if (!this.bar.$children) return;
    if (!this.bar.$children[0]) return;
    if (!this.bar.$children[0].showIcon) return;
    this.bar.$children[0].showIcon();
}
this.ChangeBarcity = function (cityid,cityname) {
    if (this.linePage) {
        ProjectSGC.Global.getMainObject("vMain").destroyFloatPage(this.linePage);
    }
    if (!this.bar) return;
    if (!this.bar.$children) return;
    if (!this.bar.$children[0]) return;
    if (!this.bar.$children[0].refreshcity) return;
    this.bar.$children[0].refreshcity(false,cityid,cityname);
}
this.changeType = function (t) {
    this.statType = t;
    if (this.statType == 0) {
        //this.showBar();
    }
    this.typeChanged();
}
this.refreshStatistics = function () {
    var o = {};
    var data = this.lstAll;
    for (var i = 0; i < data.length; i++) {
        var v = data[i][5];
        o[v] = (o[v] || 0) + 1;
    }
    var s = [];
    for (v in o) {
        s.push([v, o[v]]);
    }
    this.statistics = s;
}
this.refreshStatisticsFault = function () {
    var o = {};
    var data = this.lstAllFault;
    for (var i = 0; i < data.length; i++) {
        var v = data[i][5];
        o[v] = (o[v] || 0) + 1;
    }
    var s = [];
    for (v in o) {
        s.push([v, o[v]]);
    }
    this.statisticsFault = s;
}
this.filterList = function () {
    var v = this.vSelected;
    if (!v) {
        this.ds1 = this.lstAll;
    } else {
        var arr = [];
        for (var i = 0; i < this.lstAll.length; i++) {
            var row = this.lstAll[i];
            if (row[5] == v)
                arr.push(row);
        }
        this.ds1 = arr;
    }
}
this.filterListFault = function () {
    var v = this.vSelectedFault;
    if (!v) {
        this.ds2 = this.lstAllFault;
    } else {
        var arr = [];
        for (var i = 0; i < this.lstAllFault.length; i++) {
            var row = this.lstAllFault[i];
            if (row[5] == v)
                arr.push(row);
        }
        this.ds2 = arr;
    }
}
this.selectVoltage = function (s) {
    this.vSelected = s ? s[0] : "";
    this.filterList();
}
this.selectVoltageFault = function (s) {
    this.vSelectedFault = s ? s[0] : "";
    this.filterListFault();
}

this.setGrid = function (grid) {
    this.city = grid; this.filterGrid(); this.filterGridFault();
}
this.filterGrid = function () {
    //if (!this.city) { this.lstAllGrid = this.all; }
    //else {
        var ds1 = [];
        //var node = this.tree.find('0101' + this.city);
        //if (node) {
            var grids = {}
            for (var i = 0; i < this.all.length; i++) {
                var row = this.all[i];
                var gridid = row[6];
                if (!gridid) continue;
                var gridname = row[7];
                if (gridname) grids[gridid] = gridname;
                //if (node.find(gridid) != null)
                    ds1.push(row);
            }
        //}
        this.filterTree = function (tree) {
            tree.forEach(function (n) {
                n.isHasErrorTower = !!grids[n.getId()];
                n.hasErrorTowers = function () {
                    if (this.isHasErrorTower) return true;
                    if (!this.children) return false;
                    for (var i = 0; i < this.children.length; i++) {
                        var child = this.children[i];
                        if (child.hasErrorTowers()) return true;
                    }
                    return false;
                }
            });
            tree.forEach(function (n) {
                var children = n.children;
                if ((!children)||(children.length==0)) return;
                for (var i = children.length - 1;i>=0; i--) {
                    var child = children[i];
                    if (!child.hasErrorTowers())
                        children.splice(i, 1);
                }
            });
        }
        var gridList = [["全部", "全部"]];
        for (g in grids)
        gridList.push([g, grids[g]]);
        this.gridList = gridList;
        this.lstAllGrid = ds1;
    //}
    this.filterLine();
}
this.filterGridFault = function () {
    //if (!this.city) { this.lstAllGrid = this.all; }
    //else {
        var ds2 = [];
        //var node = this.tree.find('0101' + this.city);
        //if (node) {
            var grids = {}
            for (var i = 0; i < this.allFault.length; i++) {
                var row = this.allFault[i];
                var gridid = row[6];
                if (!gridid) continue;
                var gridname = row[7];
                if (gridname) grids[gridid] = gridname;
                //if (node.find(gridid) != null)
                    ds2.push(row);
            }
        //}
        this.filterTree = function (tree) {
            tree.forEach(function (n) {
                n.isHasErrorTower = !!grids[n.getId()];
                n.hasErrorTowers = function () {
                    if (this.isHasErrorTower) return true;
                    if (!this.children) return false;
                    for (var i = 0; i < this.children.length; i++) {
                        var child = this.children[i];
                        if (child.hasErrorTowers()) return true;
                    }
                    return false;
                }
            });
            tree.forEach(function (n) {
                var children = n.children;
                if ((!children)||(children.length==0)) return;
                for (var i = children.length - 1;i>=0; i--) {
                    var child = children[i];
                    if (!child.hasErrorTowers())
                        children.splice(i, 1);
                }
            });
        }
        this.lstAllGridFault = ds2;
    //}
    this.filterLineFault();
}
this.getGridId = function (id) {
    if (!id) return ""; return "0101" + id.substr(4);
}
this.refreshLineData = function (m) {
    var v = ProjectSGC.Voltage;
    //this.tree = Ysh.Array.toTree(m.gridList, 0, 2);
    var lineids = [];
    for (var i = 0; i < this.all.length; i++) {
        var row = this.all[i];
        var id = row[0];
        lineids.push(id);
        var l = m.getLine(id);
        if (!l) continue;
        //row[3] = this.getWarnLevel(row[3]);
        row[4] = l[ProjectSGC.LINE.NAME];
        row[5] = this.getVoltage(v, l[ProjectSGC.LINE.VOLTAGE]);
        row[6] = l[ProjectSGC.LINE.GRID];
        //row[7] = this.getGrid(row[6]);
        var grid = m.getGrid(row[6]) || [];
        row[7] = grid[4]||grid[1];
        row[8] = l[ProjectSGC.LINE.DCC];
    }
    if (this.type == "today")
        ProjectSGC.Map.highLight(lineids, [], "", true);
    this.all.sort(function (x, y) {
        return -Ysh.Compare.compareVoltage(x[5], y[5]);
    });
    this.getGridInfo();
    this.filterGrid();
}
this.refreshFaultData = function (m) {
    var v = ProjectSGC.Voltage;
    this.tree = Ysh.Array.toTree(m.gridList, 0, 2);
    for (var i = 0; i < this.allFault.length; i++) {
        var row = this.allFault[i];
        var id = row[0];
        var l = m.getLine(id);
        if (!l) continue;
        row[4] = l[ProjectSGC.LINE.NAME];
        row[5] = this.getVoltage(v, l[ProjectSGC.LINE.VOLTAGE]);
        row[6] = l[ProjectSGC.LINE.GRID];
        row[7] = this.getGrid(row[6]);
        row[8] = l[ProjectSGC.LINE.DCC];
    }
    this.allFault.sort(function (x, y) {
        return -Ysh.Compare.compareVoltage(x[5], y[5]);
    });
    this.filterGridFault();
}
this.filterByGrid = function (id) {
    if (!this.node) return false;
    return this.node.find(id) == null;
}
this.refreshGridData = function (m) {
    var tree = Ysh.Array.toTree(m.gridList, 0, 2);
    this.node = null;
    if (this.city) this.node = tree.find('0101' + this.city);
    var o = {
    };
    var vols = [];
    var times = [];
    for (var i = 0; i < this.ds0.length; i++) {
        var row = this.ds0[i];
        var id = row[0];
        var isFore = row[1];
        times.addSkipSame(row[2]);
        var vol = "";
        var t = "";
        var type = ProjectSGC.Meta.getTypeById(id);
        if ((type == "DCLINE") || (type == "ACLINE")) {
            var l = m.getLine(id);
            if (!l) continue;
            if (this.filterByGrid(l[ProjectSGC.LINE.GRID]))
                continue;
            vol = l[ProjectSGC.LINE.VOLTAGE];
            t = "l";
        } else {
            var s = m.getStation(id);
            if (!s) continue;
            if (this.filterByGrid(s.data.owner[1]))
                continue;
            vol = s.code;
            t = "s";
        }
        vol = ProjectSGC.Voltage[vol];
        if (!vol)
            continue;
        vol = vol.name;
        if (!o[vol]) {
            vols.push(vol);
            o[vol] = {
                l: [], s: [], fl: [], fs: []
            };
        }
        o[vol][(isFore ? "f" : "") + t].addSkipSame(id);
    }
    var ss = [], sl = [];
    var dcVols = ["±1100kV", "±1000kV", "±800kV", "±660kV", "±500kV", "±400kV", "±420kV"], acVols = ["1000kV", "750kV", "500kV"];
    this.lstGridEffect = this.changeVolObjToArray(o, function (v, d) {
        //ss += d.s;
        Ysh.Array.each(d.s, function (id) { ss.addSkipSame(id); })
        //sl += d.l;
        Ysh.Array.each(d.l, function (id) { sl.addSkipSame(id); })
        if ((dcVols.indexOf(v) >= 0) || (acVols.indexOf(v) >= 0))
            return [v, d.l.length + d.s.length, d.s.length, d.l.length, d.fl.length + d.fs.length, d.fs.length, d.fl.length, d.s, d.l];
        return [v, d.l.length + d.s.length, d.s.length, "-", d.fl.length + d.fs.length, d.fs.length, "-", d.s, d.l];
    });
    this.sLightTotal = times.length;
    this.sStationTotal = ss.length;
    this.sLineTotal = sl.length;
}
this.showStationDetail = function () {
    var lstStationId = this.params.row.lstGridEffect_7;
    var lst = [];
    var m = ProjectSGC.Map.getMainObject("ModelList");
    var v = ProjectSGC.Voltage;
    for (var i = 0; i < lstStationId.length; i++) {
        var id = lstStationId[i];
        var s = m.getStation(id);
        if (!s)
            continue;
        var gridid = s.data.owner[1];
        var gridname = this.getGrid(gridid);
        var vol = this.getVoltage(v, s.code);
        lst.push([gridid, gridname, vol, id, s.NAME]);
    }
    this.lstShowStationLine = lst;
    this.showStationLineList = true;
}
this.showLineDetail = function () {
    var lstLineId = this.params.row.lstGridEffect_8;
    var lst = [];
    var m = ProjectSGC.Map.getMainObject("ModelList");
    var v = ProjectSGC.Voltage;
    for (var i = 0; i < lstLineId.length; i++) {
        var id = lstLineId[i];
        var l = m.getLine(id);
        if (!l)
            continue;
        var gridid = l[ProjectSGC.LINE.GRID];
        var gridname = this.getGrid(gridid);
        var vol = this.getVoltage(v, l[ProjectSGC.LINE.VOLTAGE]);
        lst.push([gridid, gridname, vol, id, l[ProjectSGC.LINE.NAME]]);
    }
    this.lstShowStationLine = lst;
    this.showStationLineList = true;
}
this.changeStationLineListState = function (state) {
    if ((!state) && this.stationLineRowClicked) {
        this.closeLine();
        this.stationLineRowClicked = false;
    }
}
this.clickStationLineRow = function (row) {
    var id = row.lstShowStationLine_3;
    if (!id) return;
    var type = ProjectSGC.Meta.getTypeById(id);
    if ((type == "ACLINE") || (type == "DCLINE")) {
        this.stationLineRowClicked = true;
        this.showLineLight(id, this.st, this.et);
        return;
    }
    ProjectSGC.Map.locate("STATION", id);
}
this.getStationLineCard = function (id) {
    var type = ProjectSGC.Meta.getTypeById(id);
    return ((type == "ACLINE") || (type == "DCLINE")) ? "line" : "station";
}
this.getLinkStyle = function (v) {
    if (v == 0) return "";
    if (v == "-") return "";
    return "pointer";
}
this.changeVolObjToArray = function (o, f) {
    var vols = [];
    for (var v in o) vols.push(v);
    vols.sort(Ysh.Compare.getComparison("voltage"));
    vols.reverse();
    var arr = [];
    for (var i = 0; i < vols.length; i++) {
        var v = vols[i];
        var d = o[v];
        var item = f(v, d);
        if (!item) continue;
        arr.push(item);
    }
    return arr;
}
this.filterLine = function () {
    /*if ((!this.isMyDD) && (!this.lineName)) {
        this.lstAll = this.lstAllGrid;
    } else {
        var f = null;
        var lineName = this.lineName;
        if (!this.isMyDD) { f = function (row) { return row[4].indexOf(lineName) >= 0; } }
        else {
            var dd = "";
            var SelectCityInst = ProjectSGC.Global.getMainObject("SelectCityInst");
            if (SelectCityInst) dd = SelectCityInst.getLocateDcc();
            if (this.lineName) { f = function (row) { if (row[8] != dd) return false; return row[4].indexOf(lineName) >= 0; } }
            else {
                f = function (row) { return row[8] == dd; }
            }
        }
        var lst = [];
        for (var i = 0; i < this.lstAllGrid.length; i++) {
            var row = this.lstAllGrid[i];
            if (f(row))
                lst.push(row);
        }
        this.lstAll = lst;
    }*/
    var lst = [];
    var name = this.lineName;
    var grids = this.gridSelected || [];
    for (var i = 0; i < this.lstAllGrid.length; i++) {
        var row = this.lstAllGrid[i];
        if (name) {
            if (row[4].indexOf(name) < 0)
                continue;
        }
        //if (this.curGrid != "全部") {
            //if (row[COLS + 1] != this.curGrid)
            if (grids.indexOf(row[6]) < 0)
                continue;
        //}
        lst.push(row);
    }
    this.lstAll = lst;
    this.refreshStatistics();
    this.filterList();
}
this.filterLineFault = function () {
    /*if ((!this.isMyDDFault) && (!this.lineNameFault)) {
        this.lstAllFault = this.lstAllGridFault;
    } else {
        var f = null;
        var lineName = this.lineNameFault;
        if (!this.isMyDDFault) { f = function (row) { return row[4].indexOf(lineName) >= 0; } }
        else {
            var dd = "";
            var SelectCityInst = ProjectSGC.Global.getMainObject("SelectCityInst");
            if (SelectCityInst) dd = SelectCityInst.getLocateDcc();
            if (this.lineNameFault) { f = function (row) { if (row[8] != dd) return false; return row[4].indexOf(lineName) >= 0; } }
            else {
                f = function (row) { return row[8] == dd; }
            }
        }
        var lst = [];
        for (var i = 0; i < this.lstAllGridFault.length; i++) {
            var row = this.lstAllGridFault[i];
            if (f(row))
                lst.push(row);
        }
        this.lstAllFault = lst;
    }*/
    var lst = [];
    var name = this.lineNameFault;
    var grids = this.gridSelected || [];
    for (var i = 0; i < this.lstAllGridFault.length; i++) {
        var row = this.lstAllGridFault[i];
        if (name) {
            if (row[4].indexOf(name) < 0)
                continue;
        }
        //if (this.curGrid != "全部") {
            //if (row[COLS + 1] != this.curGrid)
            if (grids.indexOf(row[6]) < 0)
                continue;
        //}
        lst.push(row);
    }
    this.lstAllFault = lst;
    this.refreshStatisticsFault();
    this.filterListFault();
}
this.refreshLine = function (m) {
    var _this = this;
    PDP.read("SGAPP", "sgc/fire:GetLineStat",[this.st,this.et], function (ret) {
        if (!ret.check("获取山火数据", true)) return;
        _this.ds1 = ret.value;
        _this.all = _this.ds1; _this.refreshLineData(m);
    });
    //this.select_ds1(true, function () { _this.all = _this.ds1; _this.refreshLineData(m); });
}
this.refreshFault = function (m) {
    var _this = this;
    this.select_ds2(true, function () { _this.allFault = _this.ds2; _this.refreshFaultData(m); });
}
this.refreshGrid = function (m) {
    if (!this.ds0) {
        var _this = this;
        this.select_ds0(true, function () {
            _this.refreshGridData(m);
        });
    } else {
        this.refreshGridData(m);
    }
}
this.getWarnLevel = function (times) {
    times = parseInt(times, 10);
    return (times > 5) ? "一级" : ((times > 2) ? "二级" : "");
}
this.createBar = function () {
    if (this.bar) return;
    var vMain = ProjectSGC.Global.getMainObject("vMain");
    if (!vMain) return;
    this.bar = vMain.floatPage("sgc_tq_fire_region", { defaultlevel: this.defaultlevel, defaultcity: this.defaultcity, defaultname: this.defaultname, needrefresh: !(this.initline && this.inittime) ,main:this }, (new Date()).getTime());
}
this.typeChanged = function () {
    var m = ProjectSGC.Map.getMainObject("ModelList");
    if (!m) return;
    var _this = this;
    m.useAll(function () {
        if (_this.statType == 1)
            _this.refreshLine(m);
        else if (_this.statType == 2)
            _this.refreshFault(m);
        else
            _this.refreshGrid(m);
    });
}
this.refresh = function (bInit) {
    ProjectSGC.Map.highLight([], []);
    this.createBar();
    this.now = Ysh.Time.toString(new Date());
    var m = ProjectSGC.Map.getMainObject("ModelList");
    if (!m) return;
    var _this = this;
    m.useAll(function () {
        _this.tree = Ysh.Array.toTree(m.gridList, 0, 2);
        if (bInit) {
            if (_this.initRequest(m))
                return;
        } 
        if (_this.statType == 1)
            _this.refreshLine(m);
        else if (_this.statType == 2)
            _this.refreshFault(m);
        else
            _this.refreshGrid(m);
    });
}
this.showDetail = function (row) {
    this.dynArgs = {
        lineid: row.id, linename: row.name, starttime: Ysh.Time.toString(this.st), endtime: Ysh.Time.toString(this.et), main: this
    };
    this.isshowDetail = true;
}
this.showFaultCard = function (row) {
    var cardUrlInst = ProjectSGC.Global.getMainObject("cardUrlInst");
    if (!cardUrlInst) return;
    var devid = row.id
    var type = ProjectSGC.Meta.getTypeById(devid);
    cardUrlInst.showCardByPS({ card: "fault", args: { type: type, id: devid } }, this.getFaultCard, function () { });
}
this.getGridInfo = function () {
    var city = ProjectSGC.Global.getMainObject("SelectCityInst");
    var gridid = "";
    if (city) gridid = city.getLocateGrid();
    if (gridid == this.gridid)
        return;
    this.gridid = gridid;
    var treeData = ProjectSGC.Global.getGridTreeData(ProjectSGC.Global.getGrid());
    this.options = treeData[0];
    this.treeline = treeData[1];
    this.gridSelected = treeData[2];
    //this.node = this.tree.find(this.gridid);
}

this.mapChanged = function () {
    if (this.linePage)
        return;
    var city = ProjectSGC.Global.getMainObject("SelectCityInst").getLocateGrid();
    var cityname = ProjectSGC.Global.getMainObject('cityData').getCity(city).Name;
    if (city.substr(4) == (this.city || '990100'))
        return;
    this.city = city.substr(4);
    this.ChangeBarcity(this.city, cityname);
    var m = ProjectSGC.Map.getMainObject("ModelList");
    this.getGridInfo();
    if (this.statType == 1)
        this.filterGrid();
    else if (this.statType == 2)
        this.filterGridFault();
    else
        this.refreshGrid(m);
}

this.changeType(this.curtype);