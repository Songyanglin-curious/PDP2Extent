
var DialogShow = {
    tabsDictionary: {
        "健康评估": "ahealth",
        "基本信息": "aparameter",
        "运行信息": "arun",
        "负荷曲线": "afuhe",
        "历史有功": "ahisactive",
        "设备缺陷": "adefect",
        "告警历史": "aalarmhis",
        "检修记录": "amaintenance",
        "设备技改": "atechnicaltrans",
        "设备价值": "avalue",
    },

    dialogByDevice(o, data, callback) {
        var src = $(o).attr("osrc");
        var tabsText = o.innerText
        var sql = "";
        var id = "";
        var result = {};
        var argtype = DialogShow.tabsDictionary[tabsText]
        switch (src) {
            case "svg":
                sql = "sgc/c:GetDeviceIdByD5000Id";
                //变压器存在多个keyid,暂时先取一个
                id = data.deviceInfo[0].keyid;

                break;
            case "3d":
                sql = "sgc/c:GetDeviceIdByNo";
                var tempArr = data.data.id.split("-");
                if (tempArr.length === 1) {
                    id = tempArr[0];
                } else if (tempArr.length === 2) {
                    id = tempArr[1];
                }
                break;
        }
        PDP.load(sql, { id: id }, function (res) {
            if (res.check("获取设备信息", true)) {
                //判断value值是否存在
                if (res.value.length == 0) {
                    alert("未找到对应设备信息");
                    return;
                }
                result.id = res.value[0].Id
                result.argtype = argtype
                callback(result)
            }
        })
    },
    dialogByStation(o, data, callback) {
        var type = o ? $(o).attr("otype") : data.otype;
        var sql = "";
        var station = "";
        var result = {};
        switch (type) {
            case "cloud":
                sql = "sgc/c:GetStationIdByScStation";
                //变压器存在多个keyid,暂时先取一个
                station = data.data.name;
                break;
            case "sc":
                sql = "";
                station = data.data.name;
                break;
        }
        PDP.load(sql, { station, station }, function (res) {
            if (res.check("获取变电站信息", true)) {

                //判断value值是否存在
                if (res.value.length == 0) {
                    alert("找不到对应的变电站信息");
                    return;
                }
                callback(res.value[0])
            }
        })
    },
    dialogByYuntu(data, callback) {
        var result = {}
        if (data.id == "01129901010009") {
            result.id = 34;
        } else {
            result.id = '';
        }
        callback(result)
    }
}

var topMenuBar = {
    lock: function (b) {
        if (typeof b == "undefined")
            return menuData.lockType;
        menuData.changeLockState(b);
        if (b) {
        } else {
            MapOpeInst.menu("CancelShowStationByVol", true, { changeMain: menuData.getSelectedPlantStations().length == 0 });
            menuData.clearPrevVoltages();
        }
    }
}

var showingMenu = {
    state: { list: [] },
    restoreMainTheme: function () {
        MapOpeInst.postMessage({ eventType: 'menuope', menuname: 'SetYunTuMode', selstate: true, data: { modename: "main", modelevel: [] } });
    }
}

floatDataInst.setFloatPos = function (x, y, data, id) {
    // var vm = vLayout.floatPages[0];
    // vm.attrs = { x: x + 'px', y: y + 'px' };
    // return
    if (!id) id = "floatPage";
    if (this.getPositionDiv(id)) {
        var vm = this.getPositionDiv(id);
        vm.attrs = { x: x + 'px', y: y + 'px' };
        return;
    }
}
floatDataInst.positionDivObj = {};
floatDataInst.registerPositionDiv = function (id, divObj) {
    this.positionDivObj[id] = divObj;
    console.log(id + "已注册")
}
floatDataInst.getPositionDiv = function (id) {
    return this.positionDivObj[id];
}
floatDataInst.destroyPositionDiv = function (id) {
    delete this.positionDivObj[id];
    console.log(id + "已注销")
}



var vSelectZone = { s: "", l: "" };
if (MessageInst) {
    Ysh.Object.addHandle(MessageInst, "beforeNotify", function (event) {
        if ((!event) || (!event.data))
            return false;
        var data = eval(event.data);
        if (data.eventType == "setDivPosition") {
            data = data.data;
            floatDataInst.setFloatPos(data.x, data.y, data.locateData, data.locateData.id);
        }
    });
}
bottomMenuInst.getLinks = function (type, data, arrLink) {
    switch (type) {
        case "weathertrack":
            if (Ysh.Request.get("v") != "da")
                vMain.showPage("tianqi", "地区天气", "sgc_tq", { type: "src", tm: vMain.getShowTime(), srcid: data.data.WEATHER_SOURCE_ID });
            return false;
        case "sankuatrack":
            var isOpened = vMain.isAppOpened('sgc_3k_gt')
            if (isOpened) {
                vMain.sendBusinessMsg("", { eventSource: 'sankua_item', data: data.data });
            } else {
                vMain.gotoApp("sankua", { lineid: data.data.LINE_ID, id: data.data.ID });
                window.setTimeout(function () {
                    vMain.sendBusinessMsg("", { eventSource: 'sankua_item', data: data.data });
                }, 2000)
            }



            //vMain.showPage("sankua", "三跨点", "sgc_3k_gt", { lineid: data.data.LINE_ID, id: data.data.ID });
            return false;
        case "weathersource":
            vMain.showPage("tianqi", "地区天气", "sgc_tq", { type: "src", tm: vMain.getShowTime(), srcid: data.data.id });
            return false;
        case "emergency":
            if (Ysh.Request.get("v") == "da" || Ysh.Request.get("v") == "aj") {
                if (data.data.id)
                    owg.appEmergency.showfloatPage(data.data.num, data.data.name, data.data.id);
            }
            return false;
    }
    return true;
};

bottomMenuInst.showLinks = function (type, data) {
    var arrLink = [];
    var title = data.name;
    var v = data.voltage;
    switch (type) {
        case "maptrack":
            data = data.data;
            title = data.name;
        //break;
        case "station":
            if (data.id == this.noMenu) return;
            type = "station";//让前边过来的改成一样
            if (!v)
                v = data.topvoltage;
            arrLink.push({
                click: function () {
                    MapOpeInst.sanwei(null, { data: this.data });
                }, data: data, imgUrl: '/i/sgc/4.png', imgText: '变电站三维', txtClass: "divText"
            });
            arrLink.push({
                click: function () {
                    vMain.showPage("tianqi", "厂站天气", "sgc_tq", { type: "station", staid: this.data.id });
                }, data: data, imgUrl: '/i/sgc/tianqi.png', imgText: '天气', txtClass: "divText"
            });
            arrLink.push({
                click: function () {
                    var jxtid = "";//GetJxtId(this.data.id, this.data.name);
                    ShowJxtOr3DIframe("d5000jxt", jxtid, this.data.id, this.data.plantstationtype);
                }, data: data, imgUrl: /*'/i/sgc/jxt/' + data.id + '.png'*/'/i/sgc/3.png', imgDef: '/i/sgc/3.png', imgText: 'D5000实时接线图', txtClass: "divText"
            });
            arrLink.push({
                click: function () { cardUrlInst.show(cardUrlInst.getStationCard(data.plantstationtype, data.voltage), data.id); }, data: data, imgUrl: '/i/sgc/1.png', imgText: '模型卡片', txtClass: "divText"
            });
            arrLink.push({
                click: function () {
                    DialogShow.dialogByYuntu(data, function (result) {
                        vMain.gotoApp("jigai", { id: result.id });
                    })
                }, data: data, imgUrl: /*'/i/sgc/jxt/' + data.id + '.png'*/'/i/sgc/jigai.png', imgDef: '/i/sgc/jigai.png', imgText: '技改大修', txtClass: "divText"
            });
            break;
        case "extline":
            if (data.lineItemId == this.noMenu) return;
            title = data.lineName;
            var bIsTLine = (ProjectSGC.Meta.getTypeById(data.lineItemId) == "TLINE");
            arrLink.push({
                click: function () {
                    vMain.gotoApp("line3d", data);
                    //ProjectSGC.Map.postMessage({ eventType: "menuopeLine", menuname: 'ShowLine3D', selstate: true, data: { lineid: data.lineItemId } });
                }, data: data, imgUrl: '/i/sgc/Pin.png', imgText: '线路三维', txtClass: "divText"
            });
            arrLink.push({
                click: function () {
                    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { lineid: data.lineItemId } });
                    MapOpeInst.postMessage({ eventType: "menuope", menuname: "showTowerAcross", data: { lineid: data.lineItemId } });
                    //vMain.showPage("line", bIsTLine ? "T接线杆塔" : "线路杆塔", bIsTLine ? "sgc_tline_gt" : "sgc_line_gt", { lineid: data.lineItemId, linename: data.lineName });
                    vMain.gotoApp("line", { bIsTLine: bIsTLine, lineid: data.lineItemId, linename: data.lineName });
                }, data: data, imgUrl: '/i/sgc/4.png', imgText: '杆塔', txtClass: "divText"
            });
            if (!bIsTLine) {
                arrLink.push({ click: function () { cardUrlInst.show(cardUrlInst.getLineCard(data.lineType), data.lineItemId); }, data: data, imgUrl: '/i/sgc/1.png', imgText: '模型卡片', txtClass: "divText" });
                arrLink.push({
                    click: function () {
                        PDP.read("SGC", "sgc/gt:GetLineAcrossCount", [data.lineItemId], function (count) {
                            if (!count.check("获取杆塔数据", true)) return;
                            count = count.value;
                            if ((count.length == 0) || (count[0][0] == 0)) {
                                alert("此线路暂未匹配到三跨点数据");
                                return;
                            }

                            // vMain.gotoApp("sankua", { lineid: data.LINE_ID });
                            vMain.gotoApp("sankua", { lineid: data.lineItemId });
                            //vMain.showPage("sankua", "三跨", "sgc_3k_gt", { lineid: data.lineItemId });
                        });
                    }, data: data, imgUrl: '/i/sgc/3k.png', imgText: '三跨点', txtClass: "divText"
                });
            } else {//tconnection
                arrLink.push({ click: function () { cardUrlInst.show("tconnection", data.lineItemId); }, data: data, imgUrl: '/i/sgc/1.png', imgText: '模型卡片', txtClass: "divText" });
            }
            break;
        case "lineChaoliuTrack":
            /*title = data.name;
            arrLink.push({
                click: function () {
                    cardUrlInst.show(cardUrlInst.getLineCard(ProjectSGC.Meta.getTypeById(data.id) == "ACLINE" ? 1 : 2), data.id);
                }, data: data, imgUrl: '/i/sgc/1.png', imgText: '模型卡片', txtClass: "divText"
            });*/
            break;
        case "stationTipsTrack":
            break;
        case "ganTaTrack":
            //title = (data.data.TowerName || "") + " " + data.data.TowerNum;
            title = data.data.TowerName || data.data.TowerNum;
            arrLink.push({ click: function () { cardUrlInst.show(cardUrlInst.getGanTaCard(data.lineType), data.data.ID); }, data: data, imgUrl: '/i/sgc/1.png', imgText: '模型卡片', txtClass: "divText" });
            arrLink.push({
                click: function () {
                    vMain.showPage("tianqi", "杆塔天气", "sgc_tq", { type: "tower", towerid: data.data.ID });
                }, data: data, imgUrl: '/i/sgc/tianqi.png', imgText: '天气信息', txtClass: "divText"
            });
            break;
        case "Area":
            //arrLink.push({ click: function () { cardUrlInst.show(cardUrlInst.getAreaCard(), data.id); }, data: data, imgUrl: '/i/sgc/1.png', imgText: '电网卡片', txtClass: "divText" });
            //arrLink.push({ click: function () { cardUrlInst.show("getorgcard", "0021" + data.id.substr(4)); }, data: data, imgUrl: '/i/sgc/1.png', imgText: '调度卡片', txtClass: "divText" });
            break;
        case "Section":
            arrLink.push({ click: function () { cardUrlInst.show(cardUrlInst.getSectionCard(), data.id); }, data: data, imgUrl: '/i/sgc/1.png', imgText: '断面卡片', txtClass: "divText" });
            break;
        case "repair":
            title = data.data.data.data[0];
            arrLink.push({
                click: function () {
                    var item = data.data.data.data;
                    var id = item[0];
                    var dev = item[7];
                    if (Ysh.Type.isArray(dev)) {
                        dev = dev[0][0];
                    }
                    cardUrlInst.show("getsingledevoverhaulcard", id + "," + dev);
                }, data: data, imgUrl: '/i/sgc/5.png', imgText: '检修卡片', txtClass: "divText"
            });
            break;
        case "peiherepair":
            title = data.data.data.data[5];
            arrLink.push({
                click: function () {
                    var item = data.data.data.data;
                    var id = item[2];
                    var dev = item[1];
                    if (Ysh.Type.isArray(dev)) {
                        dev = dev[0][0];
                    }
                    cardUrlInst.show("getsingleyeardevoverhaulcard", id + "," + dev);
                }, data: data, imgUrl: '/i/sgc/5.png', imgText: '检修卡片', txtClass: "divText"
            });
            break;
        case "fault":
            title = data.data.data.name;
            arrLink.push({
                click: function () {
                    var devid = data.data.data.devid;
                    var type = ProjectSGC.Meta.getTypeById(devid);
                    cardUrlInst.showCardByPS({ card: "fault", args: { type: type, id: devid } }, this.getFaultCard, function () { });
                }, data: data, imgUrl: '/i/sgc/5.png', imgText: '故障卡片', txtClass: "divText"
            });
            arrLink.push({
                click: function () {
                    var tm = data.data.data.item[4];
                    if (tm) {
                        if (Ysh.Type.isInteger(tm))
                            tm = Ysh.Time.formatString(Ysh.Time.add('l', parseInt(tm, 10), new Date(1970, 0, 1, 8, 0, 0)), "111000");
                        else
                            tm = Ysh.Time.formatString(tm, "111000");
                    }
                    vMain.showPage("tianqi", "附近天气", "sgc_tq_point", { lon: data.data.longitude, lat: data.data.latitude, tm: tm });
                }, data: data, imgUrl: '/i/sgc/tianqi.png', imgText: '附近天气', txtClass: "divText"
            });
            /*
            arrLink.push({
                click: function () {
                    var devid = data.data.data.devid;
                    var type = ProjectSGC.Meta.getTypeById(devid);
                    vMain.showPage("faultdlg", "故障详情", "sgc_fault_item", { type: type, id: data.data.data.id });
                }, data: data, imgUrl: '/i/sgc/5.png', imgText: '故障详情', txtClass: "divText"
            });
            arrLink.push({
                click: function () {
                    var devid = data.data.data.devid;
                    var page = "";
                    switch (ProjectSGC.Meta.getTypeById(devid)) {
                        case "ACLINE": page = "sgc_acline_fault"; break;
                        case "DCLINE": page = "sgc_dcline_fault"; break;
                        case "BUSBAR": page = "sgc_bus_fault"; break;
                        case "PWRTRANSFM": page = "sgc_trans_fault"; break;
                        default:
                    }
                    vMain.showPage("faultdlg", "故障档案 - " + title, page, { id: devid });
                }, data: data, imgUrl: '/i/sgc/doc.png', imgText: '故障档案', txtClass: "divText"
            });*/
            break;
        case "miji":
            title = data.data.data[0];
            arrLink.push({
                click: function () {
                    var id = data.data.data[5];
                    cardUrlInst.show("gettranschannelcardcon", id);
                }, data: data, imgUrl: '/i/sgc/5.png', imgText: '通道卡片', txtClass: "divText"
            });
            break;
        case "guzhang":
            title = "定位点";
            arrLink.push({
                click: function () {
                    vMain.showPage("tianqi", "附近天气", "sgc_tq_point", { lon: data.data.longitude, lat: data.data.latitude });
                }, data: data, imgUrl: '/i/sgc/tianqi.png', imgText: '附近天气', txtClass: "divText"
            });
            break;
        case "maplocate":
            title = "定位点";
            arrLink.push({
                click: function () {
                    vMain.showPage("tianqi", "附近天气", "sgc_tq_point", { lon: data.data.longitude, lat: data.data.latitude });
                }, data: data, imgUrl: '/i/sgc/tianqi.png', imgText: '附近天气', txtClass: "divText"
            });
            break;
    }
    this.noMenu = "";
    if (!this.getLinks(type, data, arrLink))
        return;
    if (v)
        title = v + "kV" + title;
    if (arrLink.length > 0)
        this.setData(title, arrLink);
};

MapOpeInst.dev = function (o, data) {
    DialogShow.dialogByStation(o, data, function (result) {
        vMain.gotoApp("quanxidangan", { filter: { station: result.Name } });
    })
}

MapOpeInst.jxt = function (o, data) {
    var name = data.data.name;
    if (!name) return;
    vApp.openSVG(name);
}

MapOpeInst.dangan = function (o, data) {
    DialogShow.dialogByDevice(o, data, function (result) {
        vMain.gotoApp("devicearchives", { id: result.id, argtype: result.argtype })
    })
}

MapOpeInst.sanwei = function (o, data) {
    var name = "";
    if (data.data.id == "01129901010009") {
        name = "保定站";
    }
    vApp.open3D(name);
}

MapOpeInst.monitor_s = function (o, data) {
    DialogShow.dialogByStation(o, data, function (result) {
        vMain.gotoApp("station_monitor", { id: result.Id })
    })
}

MapOpeInst.monitor_d = function (o, data) {
    DialogShow.dialogByDevice(o, data, function (result) {
        vMain.gotoApp("device_monitor", { id: result.id })
    })
}

MapOpeInst.loadcurve = function (o, data) {
    DialogShow.dialogByDevice(o, data, function (result) {
        vMain.gotoApp("yaoce", { id: result.id })
        // Ysh.Vue.Dialog.show("遥测曲线","sc_sbcx_yc",{id: result.id},"","100%","100%")
    })

}

MapOpeInst.showMenuOpeLocate1 = function (data) {//进入
    if (data.eventSource != "3dStation")
        return;
    if (!data.id) return;//这里进入的时候会发两个消息，一个带id，一个不带
    //打开没有杆塔的在线监测地图能打开三维模型，会造成在线监测和三维导航两个导航栏同时显示，所以在打开三维处关闭
    //vLayout.showZXJC = false;
    vLayout.apps.closeAll();
    //由于两个导航条都会进行尺寸计算同步运行会冲突，所以打开三维导航条进行延时处理，使得样式显示正常
    ProjectSGC.Map.sanwei.enter();
    window.setTimeout(function () {
        vLayout.showing3D = true;
        vMain.setMenuBar("top_nav_station", { stationName3D: data.name })
    }, 100)

    MessageInst.eventSource = [];
    var st = data.name;
    //给导航条设置标题
    vLayout.stationName3D = data.name;
    st = "保定";
    topMenuInst.hideAllContent();
    ProjectSGC.Map.postMessage({ eventType: 'menuopeSW', menuname: 'showImageIcon', selstate: true, data: { type: 'alarm', paddingtop: 0, paddingleft: 0, images: { imgUrl: '/textures/swstation/image/jiance/ysp_red.png', width: 30, height: 30 }, ids: ['04M72000030722746', '04M72000030722893', '04M72000030739771', '04M72000031839716', '04M72000030740059', '04M72000030741079', '04M72000030510763', '04M72000031838948'] } });
    /*
    ProjectSGC.Map.postMessage({ eventType: 'menuopeSW', menuname: 'showImageIcon', selstate: true, data: { type: 'alarm', paddingtop: 0, paddingleft: 0, images: { imgUrl: '/I/sgc/icon/jianxiu/alarm_red.png', width: 30, height: 30 }, ids: ['04M72000030722746', '04M72000030722893', '04M72000030739771', '04M72000031839716', '04M72000030740059', '04M72000030741079', '04M72000030510763', '04M72000031838948'] } });
    ProjectSGC.Map.postMessage({
        eventType: 'menuopeSW', menuname: 'showImageIcon', selstate: true, data: {
            type: 'alarm', paddingtop: 0, paddingleft: 0, locateData: [
        { longitude: 115.6046629202791, latitude: 39.13898419671927, height: 5, images: { imgUrl: '/I/sgc/icon/jianxiu/alarm_red.png', width: 30, height: 30 }, data: { importance: 1, tip: '油温过高（100°）' } },
        { longitude: 115.60459129168116, latitude: 39.13897606218545, height: 5, images: { imgUrl: '/I/sgc/icon/jianxiu/alarm_orange.png', width: 30, height: 30 }, data: {} },
        { longitude: 115.6045169698233, latitude: 39.138980483967245, height: 5, images: { imgUrl: '/I/sgc/icon/jianxiu/alarm_yellow.png', width: 30, height: 30 }, data: {} },
        { longitude: 115.60450847153987, latitude: 39.13901189390178, height: 5, images: { imgUrl: '/I/sgc/icon/jianxiu/station_dzx.png', width: 30, height: 30 }, data: {} },
        { longitude: 115.60462515594217, latitude: 39.139047152350614, height: 5, images: { imgUrl: '/I/sgc/icon/jianxiu/station_zxz.png', width: 30, height: 30 }, data: {} }]
        }
    });*/
    //ProjectSGC.Map.postMessage({ eventType: 'menuopeSW', menuname: 'setDeviceGlow', selstate: true, data: [{ pmsid: '04M72000030722746', color: 'rgba(255,0,0,1)' }] });
    //ProjectSGC.Map.postMessage({ eventType: 'menuopeSW', menuname: 'setDeviceColor', selstate: true, data: [{ pmsid: '04M72000030722893', color: 'rgba(255,0,0,1)' }, { pmsid: '04M72000031839716', color: 'rgba(255,0,0,1)' }, { pmsid: '04M72000030367076', color: 'rgba(255,0,0,1)' }] });
    PDP.read("SGAPP", "shengchan/device:GetStationDeviceNames", [st], function (ret) {
        if (!ret.check("获取设备信息", true)) return;
        ret = ret.value;
        var lstDevice = [];
        //{ pmsid: '06Mxxxxxxx', devicename: 'xxxxx' }, { pmsid: '06Mxxxxxxx', devicename: 'xxxxx' }
        for (var i = 0; i < ret.length; i++) {
            var row = ret[i];
            lstDevice.push({ pmsid: row[0], devicename: row[1] });
        }
        ProjectSGC.Map.postMessage({ eventType: 'menuopeSW', menuname: 'initDeviceInfo', selstate: true, data: lstDevice });
        // window.setTimeout(function(){
        //     vLayout.$refs.menubar.invoke('init3dNav',[])

        //     }, 2000);

    });
    vApp.locate3DDevice();
}

MapOpeInst.alaramInfo = function (o, data) {
    DialogShow.dialogByDevice(o, data, function (result) {
        vMain.gotoApp("device_monitor", { id: result.id })
    })
}

MapOpeInst.getDeviceMenu = function (data, title, src) {
    if (src == "3d") {
        if (data.data.type == "alarm")
            return ['<a href="javascript:void(0);" ope="alaramInfo" osrc="' + src + '" class="aSituation">显示详情</a>'];
    }
    return [
        '<a href="javascript:void(0);" ope="dangan" osrc="' + src + '" class="aSituation">基本信息</a>',
        '<a href="javascript:void(0);" ope="dangan" osrc="' + src + '" class="aSituation">负荷曲线</a>',
        '<a href="javascript:void(0);" ope="dangan" osrc="' + src + '" class="aSituation">设备缺陷</a>',
        '<a href="javascript:void(0);" ope="dangan" osrc="' + src + '" class="aSituation">检修记录</a>',
        '<a href="javascript:void(0);" ope="dangan" osrc="' + src + '" class="aSituation">设备技改</a>',
        '<a href="javascript:void(0);" ope="dangan" osrc="' + src + '" class="aSituation">设备价值</a>',
        '<a href="javascript:void(0);" ope="monitor_d" osrc="' + src + '" class="aSituation">在线监测设备告警</a>',
        '<a href="javascript:void(0);" ope="loadcurve" osrc="' + src + '" class="aSituation">在线监测遥测卡片</a>'
    ];
}

MapOpeInst.addDeviceMenu = function (data, title, src) {
    MapOpeInst.addMenu(data, this.getDeviceMenu(data, title, src), this.clickCommonMenu, title);
}

MapOpeInst.showMenuOpe0 = function (data) {
    if (data.eventSource != "3dStation")
        return;
    $("#divMenu").hide();
}

MapOpeInst.showMenuOpe1 = function (data) {//设备
    if (data.eventSource != "3dStation")
        return;
    this.addDeviceMenu(data, data.data.name || data.data.id, "3d");
}

MapOpeInst.showMenuOpe3 = function (data) {//3维是点击图标，平面是右键
    if (data.eventSource != "3dStation") {
        $("#divMenu").hide();
        return;
    }
    this.addDeviceMenu(data, data.data.name || data.data.id, "3d");
}

MapOpeInst.showMenuOpe4 = function (data) {
    //右键点击地图上线路
    switch (data.data.type) {
        case "station":
            var arrHTML = [
                '<a href="javascript:void(0);" ope="dev" otype="cloud" class="aSituation">设备清单</a>'
                , '<a href="javascript:void(0);" ope="jxt" otype="cloud" class="aSituation">一次接线图</a>'
                , '<a href="javascript:void(0);" ope="sanwei" otype="cloud" class="aSituation">全景三维模型</a>'
                , '<a href="javascript:void(0);" ope="monitor_s" otype="cloud" class="aSituation">在线监测设备告警</a>'
            ];
            MapOpeInst.addMenu(data, arrHTML, this.clickCommonMenu, data.data.name);
            break;
    }
}

Ysh.Object.addHandle(MapOpeInst, "showMenuOpe5", function (data) {
});

MapOpeInst.showMenuOpe13 = function (data) {//进入
    if (data.eventSource != "3dStation")
        return;
}

MapOpeInst.showMenuOpe15 = function (data) {//退出
    if (data.eventSource != "3dStation")
        return;
    $("#divStationInfo").hide();
    vLayout.showing3D = false;
    vMain.setMenuBar("", {})
    MessageInst.eventSource = [];
    ProjectSGC.Map.sanwei.quit();
    //ProjectSGC.Map.postMessage({ eventType: 'menuopeSW', menuname: 'showImageIcon', selstate: false, data: { type: 'alarm' } });
}

var vApp = {
    showDevice: function (s) {
        vMain.gotoApp("quanxidangan", { filter: { station: s } });
    },
    openSVG: function (name, width) {
        name = name || this.chart3d;
        if (name.substr(name.length - 1, 1) == "站")
            name = name.substr(0, name.length - 1);
        mapStation = name;
        if (!this.svg) {
            YshGraph.initGraphic("");
            var svg = new YshGraph.Graph("#divSVG");
            svg.eventList.mouseClicked.add(function (eventMsg) {
                $("#divMenu").hide();
                if (eventMsg.button == 2) {
                    if ((!eventMsg.deviceInfo) || (eventMsg.deviceInfo.length == 0))
                        return;
                    console.log(eventMsg.deviceInfo[0].keyid);
                    var arrHTML = [
                        '<a href="javascript:void(0);" ope="dangan" class="aSituation">设备档案</a>'
                    ];
                    var name = eventMsg.deviceInfo[0].keyname || eventMsg.deviceInfo[0].keyid;
                    MapOpeInst.addDeviceMenu(eventMsg, name, "svg");
                    //MapOpeInst.addMenu(eventMsg, arrHTML, MapOpeInst.clickCommonMenu, name);
                }
            });
            svg.eventList.mouseDblClicked.add(function (eventMsg) {
                $("#divMenu").hide();
                if ((!eventMsg.deviceInfo) || (eventMsg.deviceInfo.length == 0))
                    return;
                vApp.zoomSVG();
                vApp.locate3DDevice(eventMsg.deviceInfo[0].keyid);
                return;
                //var sql = "";
                //for (var i = 0; i < eventMsg.deviceInfo.length; i++) {
                //    sql += sql ? "\n" : "";
                //    sql += String.format("INSERT INTO PSGRAPH_HBSC.TMANAGEDEVICE VALUES ('{0}', '{1}', 1, 1);", eventMsg.deviceInfo[i].keyid, eventMsg.deviceInfo[i].keyname);
                //}
                //$.post("/GraphPower/datareq", { command: "ExecuteSqlCommand", sql: sql }, function (data) {
                //    console.log(data);
                //});
                var sql = "";
                var devstate = svg.viewport2d.deviceStateList[eventMsg.deviceInfo[0].keyid];
                var hasPower = devstate.getHaspower();
                if (devstate) {
                    for (var i = 0; i < eventMsg.deviceInfo.length; i++) {
                        var keyid = eventMsg.deviceInfo[i].keyid;
                        var keyname = eventMsg.deviceInfo[i].keyname;

                        sql += sql ? "\n" : "";
                        if (hasPower == 0)
                            sql += String.format("INSERT INTO YS_DB.TMANAGEDEVICE (DEVICESTRID, DEVICENAME, STATE, HASPOWER) VALUES ('{0}', '{1}', 1, 1);", keyid, keyname);
                        else
                            sql += String.format("DELETE FROM YS_DB.TMANAGEDEVICE WHERE DEVICESTRID='{0}';", keyid);
                        var haspower = hasPower ? 0 : 1;
                        svg.viewport2d.deviceStateList[keyid].setHaspower(haspower);
                        svg.setDeviceState([{ id: keyid, hasPower: haspower }]);
                    }
                }
                $.post("/GraphPower/datareq", { command: "ExecuteSqlCommand", sql: sql }, function (data) {
                    console.log(data);
                });
            });
            this.svg = svg;
        }
        if (width)
            $("#divSVG").css("width", width);
        this.svg.openGraphic(name);
        this.chart3d = name;
        vLayout.showLogo = false;
        vLayout.panel = "";
        vApp.iconSVG();
    },
    isMaxSVG: true,
    maxSVGIn3D: function () {
        this.isMaxSVG = true;
        $("#divSVG").css({ "width": "50%", "top": "75px", "height": "calc(100% - 75px)", "z-index": 3999 });
    },
    zoomSVG: function () {
        this.isMaxSVG = !this.isMaxSVG;
        if (this.isMaxSVG) {
            if (vLayout.showing3D)
                this.maxSVGIn3D();
            else
                $("#divSVG").css({ "width": "100%", "top": "", "bottom": "0px", "height": "100%" });
            $("#iconSquareSVG").css({ "display": "none" });
            $("#iconConnectSVG").css({ "display": "" });
        } else {
            $("#divSVG").css({ "width": "500px", "top": "", "bottom": "0px", "height": "300px" });
            $("#iconConnectSVG").css({ "display": "none" });
            $("#iconSquareSVG").css({ "display": "" });
        }
        vApp.iconSVG();
    },
    iconSVG: function () {
        var contentWithPadding = $("#divSVG").width();
        var font_size = '24px';
        if (contentWithPadding > 1000) {
            font_size = contentWithPadding / 60;
        } else {
            font_size = contentWithPadding / 30;
        }
        console.log(window.document.getElementById('iconConnectSVG'))
        document.getElementById('iconConnectSVG').style.fontSize = font_size + 'px';
        document.getElementById('iconSquareSVG').style.fontSize = font_size + 'px';
        document.getElementById('iconCloseSVG').style.fontSize = font_size + 'px';
    },
    open3D: function (name) {
        this.chart3d = name;
        if ((name == "保定站") || (name == "保定")) {
            this.page = "";
            $("#divStationInfo").show();
            vLayout.station_3d = "baoding";
            ProjectSGC.Map.postMessage({ eventType: 'menuopeSW', menuname: 'ShowStation', selstate: true, data: { filename: 'baoding' } });
            //        window.setTimeout(function () {
            //  ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'locationDevice', selstate: true, data: { id: '04M72000030722746' } });
            //        }, 10000);
        } else {
            alert("此厂站没有全景三维");
        }
    },
    locate3DDevice: function (devid) {
        if (devid) {
            this.locateDeviceId = devid;
            if (!vLayout.showing3D) {
                this.open3D(this.chart3d)
                return;
            }
        } else
            devid = this.locateDeviceId;
        if (!devid) return;
        var _this = this;
        PDP.read("SGAPP", "shengchan/device:Get3DFromJxt", [devid], function (ret) {
            if (!ret.check("获取三维设备", true)) return;
            _this.locateDeviceId = "";
            ret = ret.value;
            if (ret.length == 0) {
                alert("没有找到对应的三维设备");
                return;
            }
            devid = ret[0][0];
            ProjectSGC.Map.postMessage({ eventType: 'menuopeSW', menuname: 'locationDevice', selstate: true, data: { id: devid } });
        });
        //devid = '04M72000030722746'
    }
}

window.showNavigation = function () {
    vLayout.changeMode(1);
}

window.showConnection = function () {
    vApp.openSVG();
}

window.connectionZoom = function () {
    vApp.zoomSVG();

}

window.clickSCStation = function (e) {
    var s = e.innerText.split('.')[1];
    if (vLayout.showing3D) {
        vApp.open3D(s);
    } else {
        vApp.openSVG(s);
    }
}

floatDataInst.showData = function (type, data, left, top, wnd) {
    switch (type) {
        case "extline":
            return;
        default:
            $("#divFloatTips").hide();
            break;
    }
    var time = "";
    for (var i = 0; i < _app._shows.length; i++) {
        var btn = _app._shows[i];
        if (!btn.isWeatherApp)
            continue;
        time = btn.time;
        break;
    }
    if (!time) return;
    time = new Date(time);
    var exes = [];
    if (time >= new Date()) { //预测
        //exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetNearestGridPoint", args: [data.longitude, data.latitude] });
        //exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetDataByGridPoint", args: [{ ref: 0, value: 0 }, time, time.getFullYear()] });
    } else {
        //exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetNearestWeatherStation", args: [data.longitude, data.latitude] });
        //exes.push({ type: 'read', db: 'SGC', sql: "sgc/tq:GetDataByWeatherStation", args: [{ ref: 0, value: 0 }, time] });
    }
    exes.push({ type: 'read', db: 'SGAPP', sql: "sgc/tq:GetDataByPos", args: [data.longitude, data.latitude, time, time.getFullYear()] });
    $.ajax({
        url: "/MapCommon/GetInfo", type: "post", dataType: "json", async: true,
        data: {
            lstInfo: [{
                "type": "read", "db": "SGPGSql", "sql": "sgc/tq:IsInGrid", "args": ['990101', data.longitude + ' ' + data.latitude]
            }]
        },
        success: function (d) {
            if (d && d.isOk && d.info.length > 0)
                if (d.info[0].length > 0)
                    if (d.info[0][0][0]) {
                        PDP.exec(exes, function (ret) {
                            if (!ret.isOK) return;
                            ret = ret.value[0];
                            if (ret.length == 0) return;
                            ret = ret[0];
                            var temperature = ret[0];
                            var rain = parseFloat(ret[1]);
                            if (isNaN(rain)) rain = "";
                            var winddir = ProjectSGC.Weather.getWindDirection(parseFloat(ret[2] || 0, 10));
                            var windlevel = ProjectSGC.Weather.getWindLevel(parseFloat(ret[3] || 0, 10));
                            var arrHTML = [];
                            arrHTML.push("<span style='position:relative;padding:5px 10px;'><img src='/i/sgc/typhoon/time1.png' style='position:absolute;z-index:-1;left:0;top:0;width:100%;height:30px;' />"
                                + temperature + "℃," + (rain ? ("降水" + rain + "mm,") : "") + winddir + windlevel + "级</span>");
                            var jqTips = $("#divFloatTips");
                            var jqTipsCotnent = jqTips.find("div");
                            jqTips.css({ height: 30, top: top, width: 800, left: left }).show();
                            jqTipsCotnent.html(arrHTML.join("<br/>"));
                            jqTips.css({ width: jqTipsCotnent.children().width() + 21 });
                            if (floatDataInst.weatherTimer) window.clearTimeout(floatDataInst.weatherTimer);
                            floatDataInst.weatherTimer = window.setTimeout(function () { $("#divFloatTips").hide(); }, 5000);
                        });
                    }
        },
        error: function (data) {
            console.log(data.responseText);
        }
    });
};//去掉点击显示tip功能


var D5000Jxt = {
    dict: null,
    doShow: function (d5000id, dcloudid) {
        var graph = this.dict[d5000id];
        if (!graph) {
            alert("没有对应的D5000接线图");
            return;
        }
        var url = "http://10.118.66.131:9000/web/Graph/Navigator.html?graph=" + encodeURI(graph);
        var data = {
            "rankid": "990101010207001", "objectname": "D5000接线图",
            "title": {
                "icon": "", "text": "D5000接线图", "style": { "height": "28px", "color": "2A3F3E", "font-size": "14px", "background-color": "3A63B5", "font-family": "microsoft yahei", "font-weight": "bold" },
                "button": "minBtn,maxBtn,icon,refresh,close",
                "infoUrl": ""
            }, "height": "784px", "appId": "990101010207", "objectCode": "0112", "objectId": dcloudid, "width": "1536px",
            "servicename": "", "objectid": dcloudid, "url": url
        };
        renderCard(data);
    },
    show: function (id) {
        PDP.load("sgc/c:GetStationD5000Id", { id: id }, function (ret) {
            if (!ret.check("获取厂站D5000 ID", true)) return;
            if (ret.value.length == 0) {
                alert("未找到对应的D5000 ID！");
                return;
            }
            var d5000id = ret.value[0].d5000_id;
            if (D5000Jxt.dict) {
                D5000Jxt.doShow(d5000id);
            } else {
                var url = "http://10.118.68.35:10034/huabeimanage/baseInterfaceToken/custom/substation?token=a5e4ff88-368c-4a80-baf3-0994d162935e&subscriber=%E7%94%A8%E5%B0%9A%E5%8E%82%E7%AB%99"
                url = "/d5000.json";
                $.ajax({
                    url: url,
                    dataType: "json",
                    type: "get",
                    data: {},
                    success: function (data) {
                        if (data.code != 200) {
                            alert(data.msg);
                            return;
                        }
                        var arr = data.data;
                        var dict = {};
                        for (var i = 0; i < arr.length; i++) {
                            var item = arr[i];
                            var itemid = item.ID;
                            if (!itemid) continue;
                            dict[itemid.toString()] = item.GRAPH_NAME;
                        }
                        D5000Jxt.dict = dict;
                        D5000Jxt.doShow(d5000id);
                    },
                    error: function (data) {
                        console.log(data.responseText);
                        alert("获取d5000图形失败");
                    }
                });
            }
        })
    }
}
ShowJxtOr3DIframe = function (type, jxtid, staid, staType, target) {
    if (type == "d5000jxt")
        D5000Jxt.show(staid);
}

if (MessageInst) {
    Ysh.Object.addHandle(MessageInst, "beforeNotify", function (event) {
        if ((!event) || (!event.data))
            return false;
        var data = eval(event.data);
        if (data.eventType == "opeline") {
            if (data.typeName == "ShowLine3D") {
                if (data.data.has) {
                    vMain.gotoApp("line3d", { lineItemId: data.data.lineid, lineName: data.data.linename, showPage: true });
                } else {
                    vMain.gotoApp("line", data.data);
                }
            }
        }
    });
}