
this.towerline = [];
this.initTypes = function () {
    var types = [];
    if (!Ysh.Type.isArray(this.types)) {
        if (!this.types) types = [];
        else types = this.types.split(',');
    } else {
        types = Ysh.Object.clone(this.types);
    }
    this.otypes = [];
    for (var i = 0; i < types.length; i++) {
        var t = types[i];
        this.otypes.push(SGCEnv.createEnvObject(t));
    }
}
this.initTypes();
this.linetype = ProjectSGC.Meta.getTypeById(this.lineid);
this.getStationSQL = function () { return this.linetype == "ACLINE" ? "sgc/env:GetAcLineStations" : "sgc/env:GetDcLineStations" }
this.getTowerSQL = function () { return this.linetype == "ACLINE" ? "sgc/env:GetAcLineTower" : "sgc/env:GetDcLineTower" }
this.getSameTowerSQL = function () {
    var sql = (this.linetype == "ACLINE" ? "sgc/env:GetAcLineSameTower" : "sgc/env:GetDcLineSameTower");
    if (this.noaudit)
        sql += "_YSDB";
    return sql;
}
this.locateItem = function (item, isText) {
    ProjectSGC.Map.locate("TOWER", { towerid: item.data[0] });
}
this.locateGroup = function () { }
this.locateEnv = function (env) {
    ProjectSGC.Map.fly(env.data.longitude, env.data.latitude);
}
this.ProjectSGC = ProjectSGC;
this.SGCEnv = SGCEnv;
//this.ds4 = SGCEnv.combineTower(this.dsTower, this.dsLineSeg, this.dsAcross);

this.locateLine = function () {
    ProjectSGC.Map.locate("LINE", this.lineid);
    ProjectSGC.Map.locate("LINEACROSS", this.lineid);
}
this.clickLink = function (item, index, link, linkIndex) {
    ProjectSGC.Map.fly(link.data[17], link.data[18]);
}
this.locateOther = function (o) {
    ProjectSGC.Map.postMessage({ eventType: "fly", type: "track", data: { trackData: { "data.ID": o.aid }, height: 5000, showtips: true } });
}
this.judge = function (e1, e2) {
    return e1.time == e2.time;
}
this.getBaseInfo = function (stations, m) {
    this.startTowerId = "";
    this.endTowerId = "";
    this.linename = "";
    this.start_st_id = "";
    this.start_st_name = "";
    this.end_st_id = "";
    this.end_st_name = "";
    if (stations.length == 0)
        return;
    var s = stations[0];
    this.startTowerId = s[2];
    this.endTowerId = s[3];
    this.linename = s[4];
}
this.showIcon = function (t, data, idxLon, idxLat, iconInfo) {
    var m = ProjectSGC.Global.getMainObject("MapOpeInst");
    if (!m) return;
    var type = "line" + t.name;
    var icons = [];
    var lngth = data.length;
    for (var i = 0; i < lngth; i++) {
        var row = data[i];
        icons.push({ longitude: row[idxLon], latitude: row[idxLat], data: { data: row, tips: t.getTips(row) } });
    }
    m.menu("showImageIcon", true, { type: type, z_index: 6, images: iconInfo, locateData: icons });
    //m.menu("showImageIcon", true,{ type: "light", images: {imgUrl:"/textures/coin/weather/leigif.png",imgType:"Animated",width:50,height:50}, locateData: iconsL })
}
this.showIconEx = function (t, data, idxLon, idxLat, iconInfos, fIndex) {
    var m = ProjectSGC.Global.getMainObject("MapOpeInst");
    if (!m) return;
    var type = "line" + t.name;
    var icons2d = [];
    for (var i = 0; i < iconInfos.length; i++)
        icons2d.push([]);
    var lngth = data.length;
    for (var i = 0; i < lngth; i++) {
        var row = data[i];
        var idx = fIndex(row);
        if (idx < 0) continue;
        icons2d[idx].push({ longitude: row[idxLon], latitude: row[idxLat], data: { data: row, tips: t.getTips(row) } });
    }
    for (var i = 0; i < iconInfos.length; i++) {
        var icons = icons2d[i];
        if (icons.length > 0)
            m.menu("showImageIcon", true, { type: type, images: iconInfos[i], locateData: icons })
    }
}
this.getTowerTNode = function (data, id) {
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row[0] == id)
            return row;
    }
    return null;
}
this.getSameTowerInfo = function (m, data, id) {
    var ret = [];
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row[0] == id) {
            var l = m.getLine(row[1]);
            if (!l) continue;
            ret.push([l[ProjectSGC.LINE.ID], l[ProjectSGC.LINE.NAME]]);
        }
    }
    //ret.sort();
    return ret;
}
this.getAcrossInfo = function (m, data, id) {
    var ret = [];
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row[0] != id)
            continue;
        var type = row[2];
        var oid = row[3];
        var name = row[4];
        if (type == 1) {
            var l = m.getLine(oid);
            if (!l) continue;
            name = l[ProjectSGC.LINE.NAME];
        }
        ret.push({ id: oid,aid:row[9], name: name, img: SGCEnv.getTypeImg_3k(type), longitude: row[5], latitude: row[6] });
    }
    return ret;
}
this.doRefresh = function (m, data) {
    var stations = data[0];
    this.getBaseInfo(stations, m);
    var towers = data[1];
    var length = towers.length;
    if (length == 0) {
        this.towerline = [];
        return;
    }
    var sameTowers = data[2];
    var tNodes = data[3];
    var across = data[4];
    Ysh.Array.sort("towers", towers, 1, "num");
    if ((this.startTowerId == towers[length - 1][0]) || (this.endTowerId == towers[0][0]))
        towers = Ysh.Array.reverse(towers);

    var lst = [];
    var citys = {};
    var types = this.otypes;
    for (var t = 0; t < types.length; t++)
        types[t].setData(data[t + 5]);
    var towerids = [];
    for (var i = 0; i < towers.length; i++) {
        var t = towers[i];
        var id = t[0];
        var num = t[1];
        var cityid = t[3];
        var cityname = t[4];
        var city = citys[cityid];
        if (!city) {
            citys[cityid] = city = { id: cityid, text: cityname };
        }
        var envs = [];
        for (var tt = 0; tt < types.length; tt++) {
            var o = types[tt].find(id, num);
            if (o == null)
                continue;
            towerids.addSkipSame(id);
            if (Ysh.Type.isArray(o)) {
                for (var temp = 0; temp < o.length; temp++)
                    envs.push(o[temp]);
            } else
                envs.push(o);
        }
        var tNode = this.getTowerTNode(tNodes, id);
        var sameTowerInfo = this.getSameTowerInfo(m, sameTowers, id);
        var sameTowerLines = sameTowerInfo.join();
        var acrossInfo = this.getAcrossInfo(m, across, id);
        lst.push({ id: id, text: t[2], isTNode: !!tNode, sameTowerInfo: sameTowerInfo, sameTowerLines: sameTowerLines, data: t, group: city, envs: envs, others: acrossInfo });
    }
    this.towerline = lst;
    ProjectSGC.Map.hideIcon("lineenv");
    for (var i = 0; i < types.length; i++) {
        var t = types[i];
        if (t.imgInfo)
            this.showIcon(t, t.lst, t.idxLon, t.idxLat, t.imgInfo);
        else
            this.showIconEx(t, t.lst, t.idxLon, t.idxLat, t.imgInfos, t.fGetIndex);
    }
    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { lineid: this.lineid } });
    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTowerAcross", data: { lineid: this.lineid } });

    var msg = [];//{ type: "lighttower", image: { width: 30, height: 37.5, url: "/textures/coin/Pin.png" }, locateData: [{ lineid: "", towerid: "", data: {} }] };
    
    for (var i = 0; i < towerids.length; i++) {
        msg.push({ lineid: this.lineid, towerid: towerids[i] });
    }
    ProjectSGC.Map.postMessage({
        eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { type: "lineenv", z_index:6, paddingtop: -18, images: { width: 30, height: 37.5, imgUrl: "/textures/coin/Pin.png" }, locateData: msg }
    });
}

this.refresh = function () {
    var m = ProjectSGC.Map.getMainObject("ModelList");
    if (!m) return;
    ProjectSGC.Global.getMainObject("vMain").legendBottom = "160px";
    var year = new Date(Ysh.Time.parseDate(this.st)).getFullYear();
    var dlls = [];
    dlls.push({ type: 'read', db: 'SGC', sql: this.getStationSQL(), args: [this.lineid] });
    dlls.push({ type: 'read', db: 'SGC', sql: this.getTowerSQL(), args: [this.lineid] });
    dlls.push({ type: 'read', db: 'SGC', sql: this.getSameTowerSQL(), args: [this.lineid] });
    dlls.push({ type: 'read', db: 'SGC', sql: "sgc/env:GetTNodes", args: [this.lineid] });
    dlls.push({ type: 'read', db: 'SGC', sql: "sgc/env:GetLineAcross0", args: [this.lineid] });
    var bIsAcline = this.linetype == "ACLINE";
    for (var i = 0; i < this.otypes.length; i++) {
        var t = this.otypes[i];
        dlls.push({ type: 'read', db: 'SGC', sql: t.getTowerSQL(bIsAcline), args: [this.lineid, this.st, this.et, year] });
    }
    var _this = this;
    this.loading = true;
    m.useAll(function () {
        PDP.exec(dlls, function (ret) {
            if (ret.check('操作', true))
                _this.doRefresh(m, ret.value);
            _this.loading = false;
        });
    });
}