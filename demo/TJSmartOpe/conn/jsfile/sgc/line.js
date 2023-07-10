var SGCLineData = {
    displayLineData: function (desc, db, sql, args, fGetOne, fDealAll) {
        var bTower = true;
        for (var i = 0; i < userSettings.all.length; i++) {
            var cfg = userSettings.all[i];
            if (cfg.id == "towerCount") {
                bTower = cfg.value != "1";
                break;
            }
        }
        var exes = [
            { type: 'read', db: db, sql: sql, args: args },
            { type: 'dll', dll: 'SGCLib:SGCLib.Model.GetLineMidPoints', args: [bTower] }
        ];
        var data = PDP.exec(exes);
        if (!data.check("获取" + desc, true))
            return;
        var lr = data.value[0];
        var lines = data.value[1];
        var msg = [];
        for (var i = 0; i < lr.length; i++) {
            var row = lr[i];
            var id = row[0];
            var lineIdx = Ysh.Array.findRowBinary(lines, 0, id);
            if (lineIdx < 0)
                continue;
            var ln = lines[lineIdx];
            var st = ln[3];
            var et = ln[4];
            var lon = ln[6];
            var lat = ln[7];
            var name = ln[1];
            var voltage = ln[2];
            var bCombine = false;
            var info = fGetOne(row, ln); //{ text: name + ":" + rate.toFixed(2) + "%", color: this.getRateColor(rate,"#FFFFFF") };
            for (var j = 0; j < msg.length; j++) {
                var m = msg[j];
                if ((m.st == st) && (m.et == et)) {//合并
                    m.burdenInfo.push(info);
                    bCombine = true;
                    break;
                }
            }
            if (bCombine)
                continue;
            msg.push({ st: st, et: et, longitude: lon, latitude: lat, voltagecode: voltage, burdenInfo: [info] });
        }
        if (msg.length > 0) {
            if (!!fDealAll)
                msg = fDealAll(msg);
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showLineBurden", selstate: true, data: msg });
        }
    }
}