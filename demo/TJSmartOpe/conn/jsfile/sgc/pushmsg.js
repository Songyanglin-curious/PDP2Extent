var PushMsg = null;
PushMsg = {
    map: null,
    setMap: function (map) {
        this.map = map;
        this.map.recv("mapImg", function (data) {
            $.ajax({
                url: "/conn/ashx/AskHandler.ashx", type: "post", dataType: "json", async: true,
                data: { m: "dll", dll: "SGCLib:SGCLib.PushMsg.SetMapMsgPicture", args: "id,type,data,arg", "id": data.cutImg.id, "data": data.data, "type": data.cutImg.type, "arg": data.cutImg.datatype + "," + data.cutImg.time },
                error: function (data, status, err) {
                    PushMsg.startSnapshot();
                },
                success: function (data) {
                    PushMsg.startSnapshot();
                }
            });
        });
    },
    startSnapshot: function () {
        window.setTimeout(function () { PushMsg.snapshotAll(); }, 10000);
    },
    snapshotAll: function () {
        if (!this.map) /*还没有关联地图，不需要执行截屏操作*/ {
            this.startSnapshot();
            return;
        }
        console.log("开始截屏...");
        try {
            PDP.exec([{ type: 'dll', dll: "SGCLib:SGCLib.PushMsg.GetMapMsg", args: [] }], function (data) {
                if (!PushMsg.snapshotList(data))
                    PushMsg.startSnapshot();
            });
        } catch (e) {
            PushMsg.startSnapshot();
        }
    },
    snapshotList: function (data) {
        if (!data.isOK) {
            console.warn(data.errMsg);
            return false;
        }
        data = data.value[0];
        if (data.length == 0) {
            return false;
        }
        var row = data[0];
        var id = row[0];
        var info = JSON.parse(row[1]);
        //根据推送截图
        switch (info.TYPE) {
            case "weather":
                //this.map.menu("setWeatherHide", true, { time: info.time, warnType: "weather" }, { cutImg: { id: id, state: true, width: 800, height: 800 } });
                PDP.read("MSG", "sgc/pushmsg:GetBadWeather", [info.TIME, info.DATA_TYPE || 1], function (data) {
                    if (!data.isOK) {
                        PushMsg.startSnapshot();
                        return;
                    }
                    data = data.value;
                    if (data.length == 0) {
                        PushMsg.startSnapshot();
                        return;
                    }
                    var infos = [];
                    var icons = [];
                    var fGetIcon = function (t) {
                        switch (t) {
                            case "1": return "/i/sgc/icon/weather/gaowen.png";
                            case "2": return "/i/sgc/icon/weather/diwen.png";
                            case "3": return "/i/sgc/icon/weather/dafeng.png";
                            case "4": return "/i/sgc/icon/weather/baoyu.png";
                        }
                    }
                    Ysh.Array.each(data, function (row) {
                        var lon = row[0];
                        var lat = row[1];
                        var icon = fGetIcon(row[2].toString());
                        var idx = icons.indexOf(icon);
                        if (idx < 0) {
                            icons.push(icon);
                            infos.push([]);
                            idx = icons.length - 1;
                        }
                        infos[idx].push({ longitude: lon, latitude: lat, data: { data: row } });
                    });
                    var type = "weather";
                    PushMsg.map.menu("showImageIcon", false, { type: type });
                    for (var i = 0; i < icons.length - 1; i++)
                        PushMsg.map.menu("showImageIcon", true, { type: type, images: { imgCode: 0, imgUrl: icons[i] }, locateData: infos[i] });
                    PushMsg.map.menu("showImageIcon", true, { type: type, images: { imgCode: 0, imgUrl: icons[icons.length - 1] }, locateData: infos[icons.length - 1] }
                        , { cutImg: { id: id, type: info.TYPE, time: info.TIME, datatype: info.DATA_TYPE, state: true, width: 640, height: 360 } });
                });
                return true;
            default:
                return false;
        }
    }
}