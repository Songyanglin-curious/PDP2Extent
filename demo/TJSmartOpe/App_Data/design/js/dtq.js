
this.getGridName = function (m, id) { var grid = m.grids.dict[id]; if (!grid) return ""; return grid[1]; }
this.getDccName = function (m, id) { var dcc = m.dccs.dict[id]; if (!dcc) return ""; return dcc[1]; }
this.getVoltage = function (v, code) { var vol = v[code]; return (vol ? vol.name : ""); }
this.fullLine = function (m) {
    var lst = this.dsEffectLine || [];
    var v = ProjectSGC.Voltage;
    for (var i = 0; i < lst.length; i++) {
        var row = lst[i];
        var id = row[0];
        var l = m.getLine(id);
        if (!l) continue;
        var gridid = l[ProjectSGC.LINE.GRID];
        var dccid = l[ProjectSGC.LINE.DCC];
        row[1] = gridid;
        row[2] = dccid;
        row[3] = this.getVoltage(v, l[ProjectSGC.LINE.VOLTAGE]);
        row[4] = l[ProjectSGC.LINE.NAME];
        row[5] = this.getGridName(m, gridid);
        row[6] = this.getDccName(m, dccid);
    }
    lst.sort(function (x, y) {
        var v = Ysh.Compare.compareVoltage(x[3], y[3]);
        if (v) return -v;
        return Ysh.Compare.compare(x[4], y[4]);
    });
    this.dsEffectLine = lst;
}
