var SGCLoadRate = {
    getRateColor: function (r, def) {
        if (r > 80.0)
            return "#FF0000";
        if (r > 60.0)
            return "#FFCD42";
        return def || "#00FF00";
    },
    displayLineLoadRate: function (show) {
        if (!show) {
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showLineBurden", selstate: false});
            return;
        }
        //PDP.exec([{ type: 'dll', dll: 'SGCLib:SGCLib.Model.ResetLinePoints', args: [] }]).check("test");
        //return;
        //{ eventType: "menuope", menuname: "showLineBurden", data: [{ longitude: "118.254", latitude: "38.254", voltagecode: 1002, burdenInfo: ["XXX线路：80%", "XXX线路70%"], data: {} }, ...] }
        addNoQuestionHTML("<a target='_blank' href='http://graph.dcloud.sd.dc.sgcc.com.cn/osp/xlzgzjs/index.html' style='color:blue;text-decoration:underline;'>打开线路负载率监视</a>");
        var bTower = true;
        for (var i = 0; i < userSettings.all.length; i++) {
            var cfg = userSettings.all[i];
            if (cfg.id == "towerCount") {
                bTower = cfg.value != "1";
                break;
            }
        }
        var exes = [
            { type: 'read', db: 'MONITORSIGNAL', sql: 'sgc/loadrate:GetLineLoadRate', args: [] },
            { type: 'dll', dll: 'SGCLib:SGCLib.Model.GetLineMidPoints', args: [bTower] }
        ];
        var data = PDP.exec(exes);
        if (!data.check("获取线路负载率", true))
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
            var rate = parseFloat(row[2]) / parseFloat(ln[5]) * 100.0;
            var st = ln[3];
            var et = ln[4];
            var lon = ln[6];
            var lat = ln[7];
            var name = ln[1];
            var voltage = ln[2];
            var bCombine = false;
            var loadrate = { text: name + ":" + rate.toFixed(2) + "%", color: this.getRateColor(rate,"#FFFFFF") };
            for (var j = 0; j < msg.length; j++) {
                var m = msg[j];
                if ((m.st == st) && (m.et == et)) {//合并
                    m.burdenInfo.push(loadrate);
                    m.rate = Math.max(m.rate, rate);
                    bCombine = true;
                    break;
                }
            }
            if (bCombine)
                continue;
            msg.push({ rate: rate, st: st, et: et, longitude: lon, latitude: lat, voltagecode: voltage, burdenInfo: [loadrate] });
        }
        if (msg.length > 0) {
            msg.sort(function (m1, m2) { return m2.rate - m1.rate; });
            var data = [];
            var count = {};
            for (var i = 0; i < msg.length; i++) {
                var m = msg[i];
                if (count[m.voltagecode] > 20)
                    continue;
                data.push(m);
                count[m.voltagecode] = (count[m.voltagecode] || 0) + 1;
            }
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showLineBurden", selstate: true, data: data });
        }
    },
    displayStationRate: function (show) {
        //{eventType:"menuope",menuname:"showStationBurden", data:[{longitude:"118.254", latitude:"38.254",voltagecode:1002,burdenInfo:[90,80],data:{}},...]} 
        addNoQuestionHTML("<a target='_blank' href='http://graph.dcloud.sd.dc.sgcc.com.cn/osp/transzgzjs/index.html' style='color:blue;text-decoration:underline;'>打开主变负载率监视</a>");
        if (!show) {
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showStationBurden", selstate: false });
            return;
        }
        var exes = [
            { type: 'read', db: 'MONITORSIGNAL', sql: 'sgc/loadrate:GetTransLoad', args: [] },
            { type: 'read', db: 'SGC', sql: 'sgc/loadrate:GetTransInfo', args: [] },
            { type: 'read', db: 'SGC', sql: 'sgc/main:GetStationCoordinate', args: [] }
        ];
        var data = PDP.exec(exes);
        if (!data.check("获取变电站负载率", true))
            return;
        var lstLoad = data.value[0];
        var lstTrans = data.value[1];
        var lstSta = data.value[2];
        lstSta.sort(function (r1, r2) {
            var v1 = r1[0];
            var v2 = r2[0];
            if (v1 < v2) return -1;
            return (v1 == v2) ? 0 : 1;
        });
        var msg = [];
        for (var i = 0; i < lstLoad.length; i++) {
            var load = lstLoad[i];
            var id = load[0];
            var idxTrans = Ysh.Array.findRowBinary(lstTrans, 0, id);
            if (idxTrans < 0)
                continue;
            var trans = lstTrans[idxTrans];
            var mvarate = parseFloat(trans[3]);
            if (mvarate == 0)
                continue;
            var staid = trans[2];
            var idxSta = Ysh.Array.findRowBinary(lstSta, 0, staid);
            if (idxSta < 0)
                continue;
            var sta = lstSta[idxSta];
            var time = load[1];
            var value = parseFloat(load[2]);
            var loadrate = value / mvarate * 100.0;
            var loadrate = { num: loadrate, color: this.getRateColor(loadrate) };
            var idxMsg = Ysh.Array.findRow(msg, "id", staid);
            var lat = sta[1];
            var lon = sta[2];
            var voltage = sta[6];
            if (idxMsg < 0)
                msg.push({ id: staid, longitude: lon, latitude: lat, voltagecode: voltage, burdenInfo: [loadrate] });
            else
                msg[idxMsg].burdenInfo.push(loadrate);
        }
        if (msg.length > 0)
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showStationBurden", selstate: true, data: msg });
    }
}