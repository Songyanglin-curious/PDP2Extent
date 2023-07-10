_app.windmap = _app._weather({
    id: "windmap", state: 0, type: 0, needClear: false, name: "风",
    legend: "/i/sgc/legend/wind.png?v=1.21.118.1"
}, {
    timesSQL: "sgc/tq:GetWindTimes", timeType: "hh",
    min: Ysh.Time.add('d', -1, new Date()),
    max: Ysh.Time.add('d', 1, new Date()),
    display: function (time) {
        time = Ysh.Time.formatString(time, "111111");
        vMain.showPage("windmap", "风", "sgc_weather_effect", { tm: time, tp: "wind" });
        var now = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'h'));
        MapOpeInst.menu("showWindWeather", true, { time: time, hideIcon: true, warnType: "wind", timeFlag: (time <= now) ? "history" : "forecast" });
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showWindParticle", selstate: true, data: { type: "windfield", maxTime: true, time: time } });
    }, close: function () {
        vMain.closePage("windmap", true);
        MapOpeInst.menu("showWindWeather", false, {});
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showWindParticle", selstate: false, data: {} });
    }
});