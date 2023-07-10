{//env开始
    this.gj = this.yj = [];
    var vm = this;
    this.loadData = function () {
        PDP.load("sc/jrsc:GetEnvWarn", { st: this.st, et: this.et, now: new Date() }, ret => {
            if (!ret.check("获取环境数据", true)) return;
            var m = ProjectSGC.Global.getMainObject("ModelList");
            m.require(["line"], function () {
                vm.showData(ret.value);
            });
        });
    }
    this.changeLevel = function (v) {
        if (v == "一级") return 1;
        if (v == "二级") return 2;
        //if (v == "三级") return 1;//3;三级先临时弄成1级
        if (v == 1) return 1;
        if (v == 2) return 2;
        return 1;
        return v;
    }
    this.groupLines = function (data, datatype) {
        var lst = Ysh.Array.pick(data, "datatype", datatype);
        var gs = Ysh.Array.groupBy(lst, ["lineid"]);
        var m = ProjectSGC.Global.getMainObject("ModelList");
        var ret = [];
        for (var i = 0; i < gs.length; i++) {
            var g = gs[i];
            var lineid = g.name[0];
            var line = m.getLine(lineid);
            if (!line) continue;
            var linename = line[ProjectSGC.LINE.NAME];
            var imgs = [];
            for (var j = 0; j < g.data.length; j++) {
                var item = g.data[j];
                imgs.push(SGCEnv.getTypeImg(item.warntype,item.warnlevel));
            }
            ret.push([lineid, linename, imgs]);
        }
        return ret;
    }
    this.showData = function (lst) {
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            row.warnlevel = this.changeLevel(row.warnlevel);
        }
        this.doStat(lst);
        this.gj = this.groupLines(lst, 0);
        this.yj = this.groupLines(lst, 1);
    }
    this.getDetails = function (s, k) {
        var details = [{ text: "一级告警", count: 0 }, { text: "二级告警", count: 0 }];
        var counts = s[k] || {};
        Object.keys(counts).forEach(key => {
            details[Number(key) - 1].count = counts[key];
        })
        return details;
    }
    this.doStat = function (lst) {
        var s = {}
        s = Ysh.Array.countBy2(lst, function (row) {
            return row.datatype;
        }, function (row) {
            return row.warnlevel;
        })

        var lstStat = [
          { img: "/i/sgc/shengchan/jrsc/gj.png", text: "", details: this.getDetails(s, 0), color: "#db9d2e" },
          { img: "/i/sgc/shengchan/jrsc/yj.png", text: "", details: this.getDetails(s, 1), color: "#479bd5" },
        ];
        this.lstStat = lstStat;

    }

}//env结束