
Ysh.Web.Event.attachEvent(window, "unload", function () {
    ProjectSGC.Map.hideIcon("fault");
    ProjectMap.clear("fault");
});
this.getCardType = function (id) {
    if (this.sgCard) return this.sgCard;
    var type = ProjectSGC.Meta.getTypeById(id);
    return (type == "PWRGRID") ? "getpwrgridcard" : "station";
}
this.setHighLight = function () {
    var lst = this.selection;
    if (!lst) return;
    var arrLine = [], arrStation = [];
    for (var i = 0; i < lst.length; i++) {
        var row = lst[i];
        var devid = row.DEV_ID;
        var type = ProjectSGC.Meta.getTypeById(devid);
        if ((type == "ACLINE") || (type == "DCLINE"))
            arrLine.push(devid);
        else
            arrStation.push(row.ST_ID);
    }
    ProjectSGC.Map.highLight(arrLine, arrStation, "", true);
    ProjectSGC.Map.locateRange(arrLine, arrStation, false, true);
}
this.showCard = function (r) {
    var cardUrlInst = ProjectSGC.Global.getMainObject("cardUrlInst");
    if (!cardUrlInst) return;
    var devid = r.DEV_ID;
    var type = ProjectSGC.Meta.getTypeById(devid);
    cardUrlInst.showCardByPS({ card: "fault", args: { type: type, id: devid } }, this.getFaultCard, function () { });
}
this.locateRow = function (r) {
    var devid = r.DEV_ID;
    var devtype = ProjectSGC.Meta.getTypeById(devid);
    var faultid = r.FAULT_ID;
    if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
        ProjectSGC.Map.locate(devtype, devid, "", "", function (msg) { if (msg.locateItem) msg.locateItem.iconid = [faultid] });
    } else {
        ProjectSGC.Map.locate("STATION", r.ST_ID);
    }
    //ProjectSGC.Map.locate(r.DEV_TYPE, r.DEV_ID);
}
Ysh.Object.addHandle(this, "resize",
function () {
    this.height = $(this.$el).height() - 50 - $(this.$refs.vs).height();
});
var GRID = 15, VOLTAGE = 7;
this.setGridSelected = function (nodes) {
    var arr = [];
    for (var i = 0; i < nodes.length; i++) {
        arr.push(nodes[i].getId());
    }
    this.gridSelected = arr;
}
this.filterByGrids = function () {
    var lst = ProjectSGC.Array.filter(this.lstAll, GRID, this.gridSelected);
    this.lstAllFilterGrid = lst;
    this.refreshStatistics();
    this.vSelected = "";
    this.filterList();
}
this.selectVoltage = function (s) {
    this.vSelected = s ? s[0] : "";
    this.filterList();
}
this.refreshStatistics = function () {
    this.statistics = ProjectSGC.Statistics.countByVoltage(this.lstAllFilterGrid, VOLTAGE);
    this.$nextTick(function () { this.resize(); });
}
this.filterList = function () {
    var v = this.vSelected;
    if (!v) {
        this.ds7 = this.lstAllFilterGrid;
    } else {
        this.ds7 = Ysh.Array.pick(this.lstAllFilterGrid, VOLTAGE, v);
    }
}
this.showDetail = function (type, id) { vMain.showPage("faultdlg", "故障详情", "sgc_fault_item", { type: type, id: id }); }
this.needResumeTime = (this.init3 != "1");
this.condition = (this.init3 == "1") ? "xml:sgc/fault:WhereNoResume:" + this.init4 : "xml:sgc/fault:WhereTimeKey:" + this.init0 + "," + this.init1 + "," + this.init2 + "," + this.init4;
this.receive = function (event) {
    if (!event.data)
        return;
    var data = event.data;
    if ((data.type == "fault") && (data.eventType == 5) && (data.operateType == "click")) {
        var item = data.data.data.item;
        if (!item) item = data.data.data.data.item;
        var id = item[0];
        this.$refs.tbl.locate(id);
    }
    if (data.type != "locateItem1")
        return;
    this.$refs.tbl.locate(data.id);
}
this.getIconDataList = function () {
    var arr0 = [], arr1 = [];
    for (var i = 0; i < this.ds7.length; i++) {
        var item = this.ds7[i];
        var resumetime = item[8];
        var staid = item[9];
        (resumetime ? arr1 : arr0).push({ objid: staid, id: item[0], devid: item[2], name: item[3], item: item });
    }
    return [arr0, arr1];
}
this.getIconDataListL = function () {
    var arr0 = [], arr1 = [];
    for (var i = 0; i < this.ds7.length; i++) {
        var item = this.ds7[i];
        var resumetime = item[8];
        var devid = item[2];
        (resumetime ? arr1 : arr0).push({ objid: devid, id: item[0], devid: item[2], name: item[3], item: item });
    }
    return [arr0, arr1];
}
this.getIconDataListHvdcSys = function () {
    return [[],[]];
}
this.getIconDataListAll = function () {
    var arr0 = [], arr1 = [], arr2 = [], arr3 = [];
    for (var i = 0; i < this.ds7.length; i++) {
        var item = this.ds7[i];
        var resumetime = item[8];
        var devid = item[2];
        var devtype = ProjectSGC.Meta.getTypeById(devid);
        if ((devtype == "ACLINE") || (devtype == "DCLINE"))
            (resumetime ? arr1 : arr0).push({ objid: devid, id: item[0], devid: item[2], name: item[3], item: item });
        else if (devtype == "HVDCSYS") {
        } else {
            var staid = item[9];
            (resumetime ? arr3 : arr2).push({ objid: staid, id: item[0], devid: item[2], name: item[3], item: item });
        }
    }
    return [arr0, arr1, arr2, arr3];
}
this.getVoltage = function (v, code) { var vol = v[code]; return (vol ? vol.name : ""); }
this.getGridName = function (m, id) {
    var grid = m.grids.dict[id];
    if (!grid)
        return "";
    return grid[1];
}
this.doRefresh = function (m, hvdcsys) {
    if (this.ds7) {
        var list = this.ds7; //ProjectSGC.Service.getResult(this.faultlist, "data");
        if (list) {
            var v = ProjectSGC.Voltage;
            for (var i = 0; i < list.length; i++) {
                var row = list[i];
                var time = row["FAULT_TIME"];
                if (time)
                    //row["FAULT_TIME"] = Ysh.Time.formatString(Ysh.Time.add('l', parseInt(row["FAULT_TIME"], 10), new Date(1970, 0, 1, 0, 0, 0)), "111111");
                {
                    var dt = new Date();
                    dt.setTime(parseInt(row["FAULT_TIME"], 10));
                    row["FAULT_TIME"] = Ysh.Time.formatString(dt, "111111");
                }
                var devid = row["EQUIP_ID"];
                var devtype = ProjectSGC.Meta.getTypeById(devid);
                if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
                    var l = m.getLine(devid);
                    if (l) {
                        row["VOLNAME"] = this.getVoltage(v, l[ProjectSGC.LINE.VOLTAGE]);
                        row["GRID_ID"] = l[ProjectSGC.LINE.GRID];
                        row["ST_NAME"] = this.getGridName(m, l[ProjectSGC.LINE.GRID]);
                        row["DIS_ST"] = l[ProjectSGC.LINE.START_ST];
                        //if (l[ProjectSGC.LINE.LENGTH])
                        //    row["DISTANCE"] = Math.max(parseInt(Math.random() * parseFloat(l[ProjectSGC.LINE.LENGTH]) * 500, 10), 1000);
                        //else
                        //    row["DISTANCE"] = Math.max(parseInt(Math.random() * 10000, 10), 1000);
                        row["DISTANCE"] = parseFloat(row["FAULT_DIS"]) * 1000;
                        var s = m.getStation(l[ProjectSGC.LINE.START_ST]);
                        if (s)
                            row["DIS_ST_NAME"] = s.NAME;
                    }
                } else if (devtype == "HVDCSYS") {
                    for (var h = 0; h < hvdcsys.length; h++) {
                        var hvdc = hvdcsys[h];
                        if (devid == hvdc[0]) {
                            row["VOLNAME"] = this.getVoltage(v, hvdc[3]);
                            row["GRID_ID"] = hvdc[2];
                            row["START_ST_ID"] = hvdc[2];
                            row["ST_NAME"] = this.getGridName(m, hvdc[2]);
                            break;
                        }
                    }
                } else {
                    var stid = row["START_ST_ID"];
                    var s = m.getStation(stid);
                    if (s) {
                        row["VOLNAME"] = this.getVoltage(v, s.code);
                        row["GRID_ID"] = s.data.owner[1];
                        row["ST_NAME"] = s.NAME;
                    }
                }
            }
            var fields = ["FAULT_ID", "DEV_TYPE", "EQUIP_ID", "EQUIP_NAME", "FAULT_TIME", "FT_TYPE", "FAULT_DETAIL", "VOLNAME", "RESUME_TIME", "START_ST_ID", "FAULT_PHASE", "FAULT_RESULT", "FAULT_TYPE", "REASON_CLASS_NAME", "REASON_DESC", "GRID_ID", "ST_NAME", "DIS_ST", "DIS_ST_NAME","DISTANCE"];
            this.ds7 = Ysh.Array.fromObjectList(list, fields);
        }
    }
    this.lstAll = this.ds7;
    var treeData = ProjectSGC.Global.getGridTreeData(this.init4);
    this.options = treeData[0];
    this.tree = treeData[1];
    this.gridSelected = treeData[2];
    this.filterByGrids();
    ProjectSGC.Map.hideIcon("fault");
    var fMsg = function (msg) {
        var data = msg.locateData;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var r = item.data.data.item;
            item.iconid = r[0];
            item.data.tips = r[3];
            if (r[17] && r[19]) {
                item.stid = r[17];
                item.distance = r[19];
                item.data.tips = "故障点距" + r[18] + (r[19] / 1000) + "km";
            } else {
                var type = ProjectSGC.Meta.getTypeById(r[2]);
                if ((type == "ACLINE")||(type == "DCLINE"))
                    item.iconid = "";
            }
        }
    };
    var imgs = ["/i/sgc/icon/fault/line_ing.png?v=1.20.729.1", "/i/sgc/icon/fault/line_ed.png?v=1.20.729.1", "/i/sgc/icon/fault/line_ing.png?v=1.20.729.1", "/i/sgc/icon/fault/line_ed.png?v=1.20.729.1"];
    var arrIcon = this.getIconDataList();
    for (var i = 0; i < arrIcon.length; i++) {
        var arr = arrIcon[i];
        if (arr.length > 0)
            ProjectSGC.Map.showIcon("fault", imgs[i], arr, null, 19, "", fMsg);
    }
}
this.refresh = function () {
    ProjectSGC.require("voltage");
    var m = ProjectSGC.Map.getMainObject("ModelList");
    var db = ProjectSGC.Global.getMainObject("SGCDB");
    if ((!m)||(!db)) return;
    var _this = this;
    m.require(["station", "line", "grid", "dcc"], function () {
        //db.read("HVDCSYS", function (data) {
        var data = [];
            _this.doRefresh(m, data);
        //});
    });
}
this.getDistanceString = function (row) {
    if (row.DIS_ST_NAME && row.DISTANCE) {
        if (row.DISTANCE > 10000)
            return "距" + row.DIS_ST_NAME + parseInt(row.DISTANCE / 1000, 10) + "km";
        return "距" + row.DIS_ST_NAME + row.DISTANCE + "m";
    }
    return "";
}
this.init = function () {
    this.getarg = "?faulttimebegin=" + this.init1 + "&faulttimeend=" + this.init2 + "&objectcode=" + this.code;
    switch (this.code) {
        case "1311"://变压器
            this.sql = "sgc/fault:GetTransFault";
            break;
        case "1301"://母线
            this.sql = "sgc/fault:GetBusFault";
            break;
        case "1201"://交流线路
            this.sgTitle = "电网";
            this.sgCard = "getpwrgridcard";
            this.sql = "sgc/fault:GetAcLineFault";
            this.getIconDataList = this.getIconDataListL;
            this.showPos = true;
            break;
        case "1206"://直流线路
            this.sgTitle = "电网";
            this.sgCard = "getpwrgridcard";
            this.sql = "sgc/fault:GetDcLineFault";
            this.getIconDataList = this.getIconDataListL;
            this.showPos = true;
            break;
        case "1101"://发电机
            this.sgTitle = "电厂";
            this.sql = "sgc/fault:GetGeneratorFault";
            break;
        case "0150"://直流系统
            this.sgTitle = "电网";
            this.sgCard = "getpwrgridcard";
            this.sql = "sgc/fault:GetHvdcsysFault";
            this.getIconDataList = this.getIconDataListHvdcSys;
            break;
        case "0154"://换流器
            this.sgTitle = "换流站";
            this.sql = "sgc/fault:GetConverterFault";
            break;
        case ""://全部
            this.sgTitle = "厂站/电网";
            this.sgCard = "";
            this.sql = "sgc/fault:GetAllFault";
            this.getIconDataList = this.getIconDataListAll;
            this.showPos = true;
            break;
    }
}

this.init();
/*需要复写的方法*/
/*end*/