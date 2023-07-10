_app.rain = _app._weather({
    id: "rain", state: 0, type: 1, needClear: false, name: "降水",
    legend: "/i/sgc/legend/rain.png?v=1.21.118.1"
}, {
    timesSQL: "sgc/tq:GetRainTimes", timeType: "hh",
    min: Ysh.Time.add('d', -1, new Date()),
    max: Ysh.Time.add('d', 1, new Date()),
    display: function (time) {
        vMain.showPage("rain", "降水", "sgc_weather_effect", { tm: time, tp: "rain" });
        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: true, data: { type: "rain", time: time } });
    }, close: function () {
        vMain.closePage("rain", true);
        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'showWeatherContour', selstate: false, data: { type: "rain" } });
    }
});