_app.weather = _app._weather({
    id: "weather", state: 0, type: 0, needClear: false, name: "天气",
    legend: "/i/sgc/legend/weather.png?v=1.21.409.1"
}, {
    timesSQL: "sgc/tq:GetWeatherTimes", timeType: "hh",
    min: Ysh.Time.add('d', -1, new Date()),
    max: Ysh.Time.add('d', 1, new Date()),
    display: function (time) {
        ProjectSGC.Map.postMessage({ "eventType": "menuope", "menuname": "showWeatherInfo", "selstate": false, data: { locateData: [], showDetail: true } });
        var now = Ysh.Time.toString(Ysh.Time.getTimeStart(new Date(), 'h'));
        PDP.load((time < now ? "sgc/tq:GetWeatherByTimePoint" : "sgc/tq:GetForeWeatherByTimePoint"), { time: time }, function (ret) {
            if (!ret.check("获取天气数据", true)) return;
            if (ret.value.length == 0)
                return;
            var data = [];
            for (var i = 0; i < ret.value.length; i++) {
                data.push(ret.value[i]);
            }
            //[{ LONGITUDE: 114.42, LATITUDE: 38.03, name: '石家庄', WEATHER_CONDITION_RESULT: '晴', paddingleft: 0, paddingtop: 0, HUMIDITY: 0, TEMPERATURE: 7, WIND_DIR_RESULT: "西南风", WIND_LEVEL_RESULT: 1 }]
            ProjectSGC.Map.postMessage({ "eventType": "menuope", "menuname": "showWeatherInfo", "selstate": true, data: { locateData: data, showDetail: true } });
        });
        //MapOpeInst.menu("setWeatherHide", true, { time: time, warnType: "weather", timeFlag: (time <= now) ? "history" : "forecast" });
    },
    close: function () {
        //MapOpeInst.menu("setWeatherHide", false, { warnType: "weather" });
        ProjectSGC.Map.postMessage({ "eventType": "menuope", "menuname": "showWeatherInfo", "selstate": false, data: { locateData: [], showDetail: true } });
    }
});