var SGCJxp = {
    showTips: function (lst) {
        var data = [];
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            var id = row[0];
            var stime = row[1];
            var etime = row[2];
            var content = row[3];
            var rstime = row[7];
            var retime = row[8];
            var devid = row[9];
            var devtype = row[10];
            var devname = row[11];
            var staid = row[12];
            var lat = parseFloat(row[13]);
            var lon = parseFloat(row[14]);
            var contents = [{ type: "time", html: "计划时间：" + Ysh.Time.getRangeString(stime, etime) }];
            if (rstime != "")
                contents.push({ type: "time", html: "实际时间：" + Ysh.Time.getRangeString(rstime, retime) });
            var html = ProjectSGC.Map.getTipsHtml("showJxp", id, devname + ":" + content, contents);
            if ((devtype == "ACLINE") || (devtype == "DCLINE")) {
                data.push({ lineid: devid, html: html });
            } else {
                data.push({ stationid: staid, longitude: lon, latitude: lat, html: html });
            }
        }
        ProjectSGC.Map.postMessage({
            eventType: "menuope"
            , menuname: "showWarnInfo"
            , data: data
        });
    }
}