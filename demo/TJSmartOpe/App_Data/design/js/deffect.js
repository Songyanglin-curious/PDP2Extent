
this.lst = [];
this.showLevel = (this.tp != "temperature");
this.getLevelStr = function (l) { return ""; }
Ysh.Object.addHandle(this, "resize", function () {
    this.height = ($(this.$el).height() - 210) + "px";
}, true);
switch (this.tp) {
    case "rain":
        this.getLevelStr = function (l) { if (l == 11) return "≥16mm"; return "≥8mm"; }
        break;
    case "wind":
        this.getLevelStr = function (l) { if (l == 11) return "≥8级"; return "≥7级"; }
        break;
    default:
        break;
}
this.clickTab = function () {
    this.refresh();
}

this.locateRow = function (row) {
    var id = row.lst_0;
    ProjectSGC.Map.locate("", id);
}

this.showJxp = function (row) {
    var dev = row.lst_1;
    if (dev) {
        if (dev.endsWith("站") || dev.endsWith("线"))
            dev = dev.substr(0, dev.length - 1);
    }
    this.jxpUrl = "sgc_jxp_list_gd.html?timepoint=" + this.tm + "&dev=" + escape(dev);
    this.showDialog = true;
    //ProjectSGC.Global.getMainObject("vMain").showPage(this.tp, "", "sgc_jxp_list_gd",{ timepoint:this.tm,dev:row.lst_1 });
}

this.loadStation = function () {
    var _this = this;
    var m = ProjectSGC.Global.getMainObject("ModelList");
    if (!m) return;
    m.require(["station"],function() {
        PDP.read("SGAPP", "sgc/tq_md:GetEffectStation", [_this.tp, _this.tm], function (data) {
            if (data.check("获取影响厂站", true))
                _this.refreshStation(m, data.value);
        });
    });
}

this.loadLine = function () {
    var m = ProjectSGC.Global.getMainObject("ModelList");
    if (!m) return;
    var _this = this;
    m.require(["line"],function() {
        PDP.read("SGAPP", "sgc/tq_md:GetEffectLine", [_this.tp, _this.tm], function (data) {
            if (data.check("获取影响线路", true))
                _this.refreshLine(m,data.value);
        });
    });
}

this.refreshStation = function (m, dataAll) {
    this.showTower = false;
    var data = [];
    var grid = ProjectSGC.Helper.getGrid(ProjectSGC.Global.getMainObject("SelectCityInst").locateid);
    for (var i = 0; i < dataAll.length; i++) {
        var row = dataAll[i];
        var stid = row[0];
        if (!grid.hasStation(stid))
            continue;
        data.push([stid, "", "", "", "", "", this.getLevelStr(row[1])]);
    }
    ProjectSGC.Assist.Station.fullList(m, data, 0, [1, 2, 3, 4]);
    this.lst = data;
}

this.linkTowers = function (nums) {
    var arr = [];
    for (var i = 0;i < nums.length;i++)    {
        var row = nums[i];
        if (row.length == 1)
            arr.push(row[0]);
        else {
            var s = row[0];
            var e = row[1];
            arr.push(s == e ? s : s + "-" + e);
        }
    }
    return arr.join();
}

this.refreshLine = function (m, dataAll) {
    this.showTower = true;
    var data = [];
    var prevLine = "";
    var prevLevel = "";
    var prevNum = "";
    var nums = [];
    var grid = ProjectSGC.Helper.getGrid(ProjectSGC.Global.getMainObject("SelectCityInst").locateid);
    for (var i = 0; i < dataAll.length; i++) {
        var row = dataAll[i];
        var id = row[0];
        if (!grid.hasLine(id))
            continue;
        var num = row[1];
        var num_0 = parseInt(num, 10);
        var level = row[2];
        if ((id == prevLine)&&(level == prevLevel)) {
            if ((num_0 == prevNum) || (num_0 == prevNum + 1)) {
                nums[nums.length - 1][1] = num_0;
            } else {
                nums.push([num_0]);
            }
        } else if (prevLine) {
            data.push([prevLine, "", "", "", "", this.linkTowers(nums), this.getLevelStr(prevLevel)]);
            nums = [[num_0]];
        } else {
            nums = [[num_0]];
        }
        prevLine = id;
        prevNum = num_0;
        prevLevel = level;
    }
    if (prevLine) {
        data.push([prevLine, "", "", "", "", this.linkTowers(nums), this.getLevelStr(prevLevel)]);
    }
    ProjectSGC.Assist.Line.fullList(m, data, 0, [1, 2, 3, 4]);
    this.lst = data;
}

this.refresh = function () {
    switch (this.curtype) {
        case "s":
            this.loadStation();
            break;
        case "l":
            this.loadLine();
            break;
        default:
            this.lst = [];
            break;
    }
}

this.getCard = function () {
    switch (this.curtype) {
        case "s":
            return "station";
        case "l":
            return "line";
        default:
            return "";
    }
}