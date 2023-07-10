
    var ID = 0, PLAN_START = 1, PLAN_END = 2, REAL_START = 3, REAL_END = 4, DEPT = 5, STATUS = 6, DEVICE_INFO = 7,DEVICE_GROUP = 8;
var DEV_ID = 0, DEV_NAME = 1, GRID_ID = 2, GRID_NAME = 3, VOLTAGE = 4, ST_ID = 5, ST_NAME = 6;
//this.filterByGrids();  
this.getLineStations = function(lst) {
    var arrS = [],arrL = [];
    for (var i = 0;i < lst.length;i++) {
        var devlist = lst[i].lst_7;
        for (var j = 0;j < devlist.length;j++) {
            var dev = devlist[j];
            var id = dev[DEV_ID];
            var t = ProjectSGC.Meta.getTypeById(id);
            var isLine = (t=="ACLINE"||t=="DCLINE");
            if (isLine) arrL.push(id);
            else arrS.push(dev[ST_ID]);
        }
    }
    return { l:arrL,s:arrS };
}
this.setHighLight = function() {
    var lst = this.selection;
    if (!lst) return;
    var o = this.getLineStations(lst);
    ProjectMap.highLight("repair",o.l,o.s,function(msg) {});
}
    
this.locate = function(row) {
    var o = this.getLineStations([row]);
    ProjectMap.twinkle("repair",o.l,o.s,function(msg) {});
}
    
this.getFirstId = function(row,s) {
    var devlist = row.lst_7;
    for (var j = 0;j < devlist.length;j++) {
        var dev = devlist[j];
        var id = dev[DEV_ID];
        var t = ProjectSGC.Meta.getTypeById(id);
        var isLine = (t=="ACLINE"||t=="DCLINE");
        if (isLine) {
            if (s) continue;
            return id;
        }
        return dev[ST_ID];
    }
    return "";
}
    
this.isShowRealLink = function(row) {
    var id = this.getFirstId(row,true);
    return id ? "":"none";
}
    
this.showRealLink = function(row) {
    var f = ProjectSGC.Global.getMainObject("ShowJxtOr3DIframe")
    var id = this.getFirstId(row,true);
    if (f&&id)
        f("d5000jxt", "", id, id);
}
    
this.showCurve = function(row) {
    var id = this.getFirstId(row);
    if (id) {
        var type = ProjectSGC.Meta.getTypeById(id);
        if ((type == "ACLINE")||(type=="DCLINE")) type = "SG_DEV_" + type + "_B";
        else type = "SG_CON_" + type + "_B";
        ProjectSGC.Global.getMainObject("cardUrlInst").display({ card: "meascard", args: { type: type, id: id } });
    }
}
    
this.selectVoltage = function (s) {
    this.vSelected = s ? s[0] : "";
    this.filterList();
}
this.filterList = function () {
    var v = this.vSelected;
    if (!v) {
        this.lst = this.lstAllFilterGrid;
    }
    else {
        this.lst = ProjectSGC.Array.pick(this.lstAllFilterGrid, function (row) {
            var devices = row[DEVICE_INFO];
            if (!devices) return false;
            for (var i = 0; i < devices.length; i++) {
                var d = devices[i];
                if (d[VOLTAGE] == v)
                    return true;
            }
            return false;
        });
    }
    this.showIcons();
}

this.setGridSelected = function (nodes) {
    var arr = [];
    for (var i = 0; i < nodes.length; i++) {
        arr.push(nodes[i].getId());
    }
    this.gridSelected = arr;
}

this.filterByGrids = function () {
    var grids = this.gridSelected;
    this.lstAllFilterGrid  = ProjectSGC.Array.pick(this.lstAll, function (row) {
        var devices = row[DEVICE_INFO];
        if (!devices) return false;
        for (var i = 0; i < devices.length; i++) {
            var d = devices[i];
            if (grids.indexOf(d[GRID_ID]) >= 0)
                return true;
        }
        return false;
    });
    this.refreshStatistics();
    this.vSelected = "";
    this.filterList();
}
this.refreshStatistics = function () {
    this.statistics = ProjectSGC.Statistics.countByVoltage(this.lstAllFilterGrid, function (row) {
        var devices = row[DEVICE_INFO];
        if (!devices) return [];
        var ret = [];
        for (var i = 0; i < devices.length; i++) {
            var d = devices[i];
            ret.addSkipSame(d[VOLTAGE]);
        }
        return ret;
    });        
    this.$nextTick(function() { this.resize(); });
}
this.locateRow = function (id, devid, stid) {
    var devtype = ProjectSGC.Meta.getTypeById(devid);
    if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
        ProjectSGC.Map.locate("LINE", devid);
    } else {
        ProjectSGC.Map.locate("STATION", stid);
    }
}
this.lstAll = [];
this.lst = [];
Ysh.Object.addHandle(this, "resize",
    function () {
        var h = $(this.$el).height();
        if (h == 0) return;
        this.height = h - 60 - 15 - $(this.$refs.divStat).height() - 4;
    });
Ysh.Web.Event.attachEvent(window, "unload", function () {
    ProjectSGC.Map.hideIcon("repair");
    ProjectMap.clear("repair");
});
this.getStatus = function(s) {
    return s == "1001" ? "待开工" : (s == "1002" ? "已开工" : (s=="1003" ? "已竣工":""));
}
this.changeResult = function (m) {
    var lst = [];
    var jxlist = this.dsJxp;
    if (!jxlist)
        return lst;
    //var jxlist = ProjectSGC.Service.getResult(this.jxlist, "data");
    //if (!jxlist)
    //    return lst;
    var typename = (this.curtype == 2) ? "待开工" : ((this.curtype == 3) ? "已开工" : ((this.curtype == 4) ? "已竣工" : ""));
    var o = {};
    for (var i = 0; i < jxlist.length; i++) {
        var item = jxlist[i];
        if (typename) {
            if (typename != item.STATUS)
                continue;
        }
        var item = {
            st_id:item.ST_ID,st_name:"",outage_dev_id:item.OUTAGE_DEV_ID,outage_dev_name:item.OUTAGE_DEV_NAME,plan_id_d:item.PLAN_ID_D,
            auth_start_date:item.auth_start_date,auth_end_date:item.auth_end_date,start_date:item.start_date,end_date:item.end_date,
            voltage:"",dept:item.DEPT,grid:"",status:item.STATUS,gridname:""
        };
        var jxpid = item.plan_id_d;
        if (!o[jxpid]) {
            o[jxpid] = [jxpid, item.auth_start_date, item.auth_end_date, item.start_date, item.end_date, item.dept, item.status,[]];
        }
        var devid = item.outage_dev_id;
        var stid = item.st_id;
        var devtype = ProjectSGC.Meta.getTypeById(devid);
        if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
            var line = m.getLine(devid);
            if (line) {
                item.voltage = ProjectSGC.Voltage.getName(line[ProjectSGC.LINE.VOLTAGE]);
                var gridid = line[ProjectSGC.LINE.GRID];
                item.grid = gridid;
            }
        } else {
            var station = m.getStation(stid);
            if (station) {
                item.voltage = ProjectSGC.Voltage.getName(station.code);
                item.st_name = station.NAME;
                item.grid = station.data.owner[1];
            }
        }
        var gridobj = m.getGrid(item.grid);
        if (gridobj)
            item.gridname = gridobj[1];
        var device = [item.outage_dev_id, item.outage_dev_name, item.grid, item.gridname, item.voltage, item.st_id, item.st_name];
        o[jxpid][DEVICE_INFO].push(device);
        o[jxpid][DEVICE_GROUP] = Ysh.Array.groupBy(o[jxpid][DEVICE_INFO],[ST_ID]);
    }
    for (var id in o) {
        lst.push(o[id]);
    }
    lst.sort(function(x,y) { if (x[1]<y[1]) return 1;return  (x[1]==y[1]) ? 0 : -1; });
    return lst;
}
this.clickTab = function () {
    this.search();
}
this.showIcons = function () {
    ProjectSGC.Map.hideIcon("repair");
    if (this.lst.length == 0)
        return;
    var arrIcon = [[], [], []];
    var arrMultiIcon = [[], [], []];
    //var arrIconImg = ["/i/sgc/icon/jianxiu/line_dzx200714.png", "/i/sgc/icon/jianxiu/line_zxz200714.png", "/i/sgc/icon/jianxiu/line_yzx200714.png"];
    var arrIconImg = ["/i/sgc/icon/jianxiu/line_dzx.png?v=1.20.729.1", "/i/sgc/icon/jianxiu/line_zxz.png?v=1.20.729.1", "/i/sgc/icon/jianxiu/line_yzx.png?v=1.20.729.1"];
    var arrMultiIconImg = ["/i/sgc/icon/jianxiu/station_dzx.png", "/i/sgc/icon/jianxiu/station_zxz.png", "/i/sgc/icon/jianxiu/station_yzx.png"];
    arrMultiIconImg = arrIconImg;
    for (var i = 0; i < this.lst.length; i++) {
        var row = this.lst[i];
        var flag = row[STATUS];
        var idx = 0;
        if (flag == "已竣工")
            idx = 2;
        else if (flag == "已开工")
            idx = 1;
        var devices = row[DEVICE_INFO];
        for (var j = 0; j < devices.length; j++) {
            var d = devices[j];
            var devid = d[DEV_ID];
            var stid = d[ST_ID];
            var devtype = ProjectSGC.Meta.getTypeById(devid);
            var objid = devid;
            if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
                arrIcon[idx].push({ objid: objid, id: objid, data: row });
            } else {
                objid = stid;
                arrMultiIcon[idx].push({ objid: objid, id: objid, data: row });
            }
        }
    }
    var fMsg = function (msg) {
        var data = msg.locateData;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var r = item.data.data.data;
            var arr =[];
            Ysh.Array.each(r[8],function(rrr) {
                Ysh.Array.each(rrr.data,function(rr) { arr.push(rr[1]); });
            });
            item.data.tips = r[0]+"("+arr.join("、")+")";
        }
    };
    for (var i = 0; i < arrIcon.length; i++) {
        if (arrIcon[i].length > 0)
            ProjectSGC.Map.showIcon("repair", arrIconImg[i], arrIcon[i], null, 19, "",fMsg);
    }
    for (var i = 0; i < arrMultiIcon.length; i++) {
        if (arrMultiIcon[i].length > 0)
            //ProjectSGC.Map.showMultipleIcon("repair", arrMultiIconImg[i], arrMultiIcon[i]);
            ProjectSGC.Map.showIcon("repair", arrMultiIconImg[i], arrMultiIcon[i], null, 19, "",fMsg);
    }
}
this.changeVoltages = function () {
    var ret = [];
    for (var i = 0; i < this.lstAll.length; i++) {
        var item = this.lstAll[i];
        if (this.vols.indexOf(item[10]) >= 0)
            ret.push(item);
    }
    this.lst = ret;
    this.lstAllVol = ret;
    this.statistics = ProjectSGC.Statistics.countByVoltage(this.lstAllVol, 10);
    this.filterList();
}
this.mapChanged = function() {
    if (this.gridid == ProjectSGC.Global.getGrid())
        return;
    this.search();
}
this.search = function () {
    this.gridid = ProjectSGC.Global.getGrid();
    ProjectSGC.require("voltage");
    var m = ProjectSGC.Global.getMainObject("ModelList");
    var _this = this;
    m.useAll(function () { _this.doSearch(m); });
}
this.doSearch = function (m) {
    ProjectMap.clear("repair");
    //this.getarg="?planstartstart="+this.init1+"&planstartend="+this.init2+"&dcc="+ProjectSGC.Global.getMainObject("SelectCityInst").getLocateDcc();  
    this.getarg = "?start=" + this.init1 + "&end=" + this.init2 + "&gridid=" + ProjectSGC.Global.getGrid();
    this.getData();
    this.lstAll = this.changeResult(m);
    var treeData = ProjectSGC.Global.getGridTreeData(ProjectSGC.Global.getGrid());
    this.options = treeData[0];
    this.tree = treeData[1];
    this.gridSelected = treeData[2];
    this.filterByGrids();
}


this.attachLocateMsg = function () {
    var vm = this;
    window.addEventListener('message', function (event) {
        if (!event.data)
            return;
        var data = event.data;
        if ((data.type == "repair") && (data.eventType == 5) && (data.operateType == "click")) {
            var item = data.data.data[0];
            if (!item) item = data.data.data.data[0];
            if (!item) item = data.data.data.data;
            var id = item.data[0];
            vm.$refs.tbl.locate(id);
            vm.hID = "#a" + id;
            vm.$nextTick(function () {
                vm.$refs.jump.click();
            });
            return;
        }
        switch (data.type) {
            case "locateItem1":
                var row = data.data[0].data;
                vm.locateRow(row[4], row[2], row[0]);
                break;
            case "mapchanged":
                vm.mapChanged();
                break;
        }
    });
}