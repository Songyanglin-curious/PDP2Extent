var SGCZHB = {
    getMinuteData: function () {
        var arr = [];
        for (var i = 0; i <= 23; i++) {
            for (var j = 0; j <= 59; j++) {
                if (i == 23 && j > 46)
                    return arr;
                arr.push(this.getTimeStr(i) + ":" + this.getTimeStr(j));
            }
        }
        return arr;
    },

    getTimeStr: function (str) {
        str += "";
        if (str.length == 1)
            return "0" + str;
        return str;
    },

    getSunTime: function (dt, JD, WD) {
        //return ["08:00", "18:00"];
        JD = parseFloat(JD);
        //JD = 117.126974;
        WD = parseFloat(WD);
        //WD = 36.657017;
        var RQ = dt.split(" ")[0];
        var year = parseInt(RQ.split("-")[0]);
        var month = parseInt(RQ.split("-")[1]);
        var date = parseInt(RQ.split("-")[2]);

        var PYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var RYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let h = -0.833;//日出日落时太阳的位置
        let UTo = 180.0;//上次计算的日出日落时间,初始迭代值180.0

        //判断闰年平年
        function leap_year(year) {
            if ((year % 400 == 0 || year % 100 != 0) && (year % 4 == 0)) {
                return true;
            } else {
                return false;
            }
        }
        //计算时区
        function Zone(JD) {
            if (JD >= 0) return ((JD / 15.0) + 1);

            else return ((JD / 15.0) - 1);
        }

        function days(year, month, date) {
            var days = 0;//计算2000-01-01到当天的天数
            var i = 0;
            //先计算这几年的天数
            for (i = 2000; i < year; i++) {
                if (leap_year(i)) {
                    days = days + 366;
                } else {
                    days = days + 365;
                }
            }
            //在计算今年当天的天数
            if (leap_year(i)) {//闰年
                for (i = 0; i < month - 1; i++) {
                    days = days + RYear[i];
                }
            } else {
                for (i = 0; i < month - 1; i++) {
                    days = days + PYear[i];
                }
            }

            days = days + parseInt(date);

            return days;
        }


        //2000-01-01到当日的世纪数t
        function t_century(days, UTo) {
            return (days + UTo / 360) / 36525;
        }
        //var t_century = (days+UTo/360)/36525;
        //alert(t_center);

        //太阳的平黄径
        function L_sun(t_century) {
            return 280.460 + 36000.770 * t_century;
        }
        //var L_sun = 280.460+36000.770*t_century;
        //alert(L_sun);

        //太阳的平近点角
        function G_sun(t_century) {
            return 357.528 + 35999.050 * t_century;
        }
        //var G_sun = 357.528+35999.050*t_century;
        //alert(G_sun);

        //黄道经度
        function ecliptic_longitude(L_sun, G_sun) {
            return (L_sun + 1.915 * Math.sin(G_sun * Math.PI / 180) + 0.02 * Math.sin(2 * G_sun * Math.PI / 180));
        }
        //var ecliptic_longitude =  (L_sun+1.915*Math.sin(G_sun*Math.PI/180)+0.02*Math.sin(2*G_sun*Math.PI/180)); 
        //alert(ecliptic_longitude);

        //地球倾角
        function earth_tilt(t_century) {
            return 23.4393 - 0.0130 * t_century;
        }
        //var earth_tilt = 23.4393-0.0130*t_century;

        //太阳偏差
        function sun_deviation(earth_tilt, ecliptic_longitude) {
            return (180 / Math.PI * Math.asin(Math.sin(Math.PI / 180 * earth_tilt) * Math.sin(Math.PI / 180 * ecliptic_longitude)));
        }
        //var sun_deviation = (180/Math.PI*Math.asin(Math.sin(Math.PI/180*earth_tilt)*Math.sin(Math.PI/180*ecliptic_longitude)));

        //格林威治时间的太阳时间角GHA
        function GHA(UTo, G_sun, ecliptic_longitude) {
            return (UTo - 180 - 1.915 * Math.sin(G_sun * Math.PI / 180) - 0.02 * Math.sin(2 * G_sun * Math.PI / 180) + 2.466 * Math.sin(2 * ecliptic_longitude * Math.PI / 180) - 0.053 * Math.sin(4 * ecliptic_longitude * Math.PI / 180));
        }
        //var GHA =  (UTo-180-1.915*Math.sin(G_sun*Math.PI/180)-0.02*Math.sin(2*G_sun*Math.PI/180)+2.466*Math.sin(2*ecliptic_longitude*Math.PI/180)-0.053*Math.sin(4*ecliptic_longitude*Math.PI/180)); 

        //修正值e
        function e(h, WD, sun_deviation) {
            return 180 / Math.PI * Math.acos((Math.sin(h * Math.PI / 180) - Math.sin(WD * Math.PI / 180) * Math.sin(sun_deviation * Math.PI / 180)) / (Math.cos(WD * Math.PI / 180) * Math.cos(sun_deviation * Math.PI / 180)));
        }
        //var e = 180/Math.PI*Math.acos((Math.sin(h*Math.PI/180)-Math.sin(WD*Math.PI/180)*Math.sin(sun_deviation*Math.PI/180))/(Math.cos(WD*Math.PI/180)*Math.cos(sun_deviation*Math.PI/180)));

        //求日出时间
        function UT_rise(UTo, GHA, JD, e) {
            return (UTo - (GHA + JD + e));
        }
        // var UT_rise = 0;
        // UT_rise = (UTo-(GHA+JD+e));  
        //求日落时间
        function UT_set(UTo, GHA, JD, e) {
            return (UTo - (GHA + JD - e));
        }

        //日升时间迭代减少误差
        function result_rise(UT, UTo, JD, WD, year, month, date) {
            var d = 0;

            if (UT >= UTo) d = UT - UTo;

            else d = UTo - UT;

            if (d >= 0.1) {

                UTo = UT;

                UT = UT_rise(UTo,

                    GHA(UTo, G_sun(t_century(days(year, month, date), UTo)),

                        ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),

                            G_sun(t_century(days(year, month, date), UTo)))),

                    JD,

                    e(h, WD, sun_deviation(earth_tilt(t_century(days(year, month, date), UTo)),

                        ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),

                            G_sun(t_century(days(year, month, date), UTo))))));

                result_rise(UT, UTo, JD, WD, year, month, date);



            }

            return UT;
        }

        //日落时间迭代减小误差
        function result_set(UT, UTo, JD, WD, year, month, date) {

            var d = 0;

            if (UT >= UTo) d = UT - UTo;

            else d = UTo - UT;

            if (d >= 0.1) {

                UTo = UT;

                UT = UT_set(UTo,

                    GHA(UTo, G_sun(t_century(days(year, month, date), UTo)),

                        ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),

                            G_sun(t_century(days(year, month, date), UTo)))),

                    JD,

                    e(h, WD, sun_deviation(earth_tilt(t_century(days(year, month, date), UTo)),

                        ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),

                            G_sun(t_century(days(year, month, date), UTo))))));

                result_set(UT, UTo, JD, WD, year, month, date);

            }

            return UT;

        }
        //日升
        var sunrise = result_rise(UT_rise(UTo,

            GHA(UTo, G_sun(t_century(days(year, month, date), UTo)),

                ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),

                    G_sun(t_century(days(year, month, date), UTo)))),

            JD,

            e(h, WD, sun_deviation(earth_tilt(t_century(days(year, month, date), UTo)),

                ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),

                    G_sun(t_century(days(year, month, date), UTo)))))), UTo, JD, WD, year, month, date);

        //日落	
        var sunset = result_set(UT_rise(UTo,

            GHA(UTo, G_sun(t_century(days(year, month, date), UTo)),

                ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),

                    G_sun(t_century(days(year, month, date), UTo)))),

            JD,

            e(h, WD, sun_deviation(earth_tilt(t_century(days(year, month, date), UTo)),

                ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),

                    G_sun(t_century(days(year, month, date), UTo)))))), UTo, JD, WD, year, month, date);

        var arrTime = [];
        //日升时间	
        var a = (sunrise / 15 + Zone(JD));
        //这里算出的a会多出47~50分钟分误差,减去平均值48.5/60后再转为时间格式
        a = a - 48.5 / 60;
        //整数部分
        var hour = Math.trunc(a);
        //小数部分
        var minute = Math.trunc((a - hour) * 60);
        arrTime.push(this.getTimeStr(hour) + ":" + this.getTimeStr(minute));

        //日落时间
        var b = (sunset / 15 + Zone(JD));
        b = b - 48.5 / 60;
        var sethour = Math.trunc(b);
        var setminute = Math.trunc((b - sethour) * 60);
        arrTime.push(this.getTimeStr(sethour) + ":" + this.getTimeStr(setminute));
        return arrTime;
    },

    getSunSeries: function (option) {
        for (var i = 0; i < option.series.length; i++) {
            if (option.series[i].name == "日出日落") {
                return option.series[i];
            }
        }
        return null;
    },

    setSunData: function (option, data, dt) {
        return false;
        if (dt instanceof Date) {
            dt = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        }
        var sunTime = this.getSunTime(dt, 117.126974, 36.657017);
        if (sunTime.length < 2)
            return false;
        if (option.xAxis.length <= 1)
            return false;
        option.xAxis[1].data = this.getMinuteData();
        var sunSeries = this.getSunSeries(option);
        if (!sunSeries)
            return false;
        sunSeries.markLine.data[0][0].xAxis = sunTime[0];
        sunSeries.markLine.data[0][1].xAxis = sunTime[0];
        sunSeries.markLine.data[1][0].xAxis = sunTime[1];
        sunSeries.markLine.data[1][1].xAxis = sunTime[1];
        var min = option.yAxis[0].min;
        var max = option.yAxis[0].max;
        if (min === undefined) {
            if (option.yAxis[0].scale)
                min = Math.min.apply(null, data);
            else
                min = 0;
        }
        if (max === undefined) {
            max = Math.max.apply(null, data);
        }
        sunSeries.markLine.data[0][0].yAxis = min;
        sunSeries.markLine.data[0][1].yAxis = max;
        sunSeries.markLine.data[1][0].yAxis = min;
        sunSeries.markLine.data[1][1].yAxis = max;
    },

    setSunDataLegend: function (option, arr, selected, echart) {
        if (arr.length != 2)
            return false;
        var sunSeries = this.getSunSeries(option);
        sunSeries.markLine.data[0][0].yAxis = arr[0];
        sunSeries.markLine.data[0][1].yAxis = arr[1];
        sunSeries.markLine.data[1][0].yAxis = arr[0];
        sunSeries.markLine.data[1][1].yAxis = arr[1];
        for (var name in selected) {
            option.legend.selected[name] = selected[name];
        }
        echart.setOption(option, true);
    },

    getGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    setDataZoom: function (option, count, c) {
        var dataZoom = option.dataZoom[0];
        if (count <= c)
            return false;
        dataZoom.startValue = count - c - 1;
    }
}