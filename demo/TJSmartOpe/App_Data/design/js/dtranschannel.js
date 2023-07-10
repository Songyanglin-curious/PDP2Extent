
this.starttime = Ysh.Time.toString(this.starttime);
this.endtime = Ysh.Time.toString(this.endtime);
this.year = new Date(Ysh.Time.parseDate(this.starttime)).getFullYear();

this.showStationLineByOpacity = function (lines, m) {
    if (!m) {
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showStationLineByOpacity", selstate: false, data: { lineIDs: [], stationIDs: [] } }, "channel");
        m = ProjectSGC.Global.getMainObject("ModelList");
    }
    if (lines.length == 0) return;
    m.require(["LINE"], function () {
        var stations = [];
        Ysh.Array.each(lines, function (l, n) {
            var ln = m.getLine(l);
            stations.addSkipSame(ln[ProjectSGC.LINE.START_ST]);
            stations.addSkipSame(ln[ProjectSGC.LINE.END_ST]);
        });
        if (stations.length == 0) stations = [""];
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showStationLineByOpacity", selstate: true, data: { lineIDs: lines, stationIDs: stations } }, "channel");
    });
}

//this.starttime = "2020-04-01 00:00:00";
//this.endtime = "2020-04-10 00:00:00";
this.onload = function (f) {
    var _this = this;
    //重载数据
    var dll = [];
    var ModelList = ProjectSGC.Global.getMainObject("ModelList");
    dll.push({ type: "dll", "dll": "SGCLib:SGCLib.Realtime.GetData", "args": ["LOAD_RATE", "LINE"] });

    /*var linedata =[];
    var ret= {"data":{"nma_line_load":{"grid_line_load_list":[{"over_load_list":[{"end_st_id":"01126500000090","start_pg_name":"新疆电网","end_st_name":"小草湖变","voltage_type_name":"220kV","start_pg_id":"0101650000","i":721.83344,"lineend_id":"121065000000000129","imax":630.0,"i_rate":114.57674,"start_owner":990105,"start_st_id":"01129901050022","end_owner":650000,"end_pg_name":"新疆吐鲁番电网","voltage_type":1005,"start_owner_name":"西北电网","name":"2798吐草二线","end_pg_id":"0101652100","start_st_name":"吐鲁番变","id":"120165000000000065","end_owner_name":"新疆电网"},{"end_st_id":"01126500000084","start_pg_name":"新疆吐鲁番电网","end_st_name":"交河变","voltage_type_name":"220kV","start_pg_id":"0101652100","i":733.8868,"lineend_id":"121065000000000133","imax":630.0,"i_rate":116.48997,"start_owner":650000,"start_st_id":"01126500000090","end_owner":650000,"end_pg_name":"新疆吐鲁番电网","voltage_type":1005,"start_owner_name":"新疆电网","name":"2712草河线","end_pg_id":"0101652100","start_st_name":"小草湖变","id":"120165000000000067","end_owner_name":"新疆电网"},{"end_st_id":"01126500000049","start_pg_name":"新疆电网","end_st_name":"老满城变","voltage_type_name":"220kV","start_pg_id":"0101650000","i":684.8545,"lineend_id":"121065010000000193","imax":630.0,"i_rate":108.70706,"start_owner":650000,"start_st_id":"01116500000040","end_owner":650000,"end_pg_name":"新疆乌鲁木齐电网","voltage_type":1005,"start_owner_name":"新疆电网","name":"2412红满二线","end_pg_id":"0101650100","start_st_name":"国电红雁池电厂","id":"120165010000000097","end_owner_name":"新疆电网"},{"end_st_id":"01126500000048","start_pg_name":"新疆乌鲁木齐电网","end_st_name":"宝钢变","voltage_type_name":"220kV","start_pg_id":"0101650100","i":642.3906,"lineend_id":"121065010000000195","imax":630.0,"i_rate":101.96677,"start_owner":650000,"start_st_id":"01126500000053","end_owner":650000,"end_pg_name":"新疆乌鲁木齐电网","voltage_type":1005,"start_owner_name":"新疆电网","name":"2431燕宝一线","end_pg_id":"0101650100","start_st_name":"燕南变","id":"120165010000000098","end_owner_name":"新疆电网"}],"pg_name":"国家电网","pg_id":"0101990100","heavy_load_list":[{"end_st_id":"01121200000084","start_pg_name":"天津电网","end_st_name":"中船东","voltage_type_name":"220kV","start_pg_id":"0101120000","i":977.40173,"lineend_id":"121012000000000349","imax":1210.0,"i_rate":80.777,"start_owner":120000,"start_st_id":"01111200000018","end_owner":120000,"end_pg_name":"天津电网","voltage_type":1005,"start_owner_name":"天津电网","name":"热中一线","end_pg_id":"0101120000","start_st_name":"临港燃气热电厂","id":"120112000000000245","end_owner_name":"天津电网"},{"end_st_id":"01121200000053","start_pg_name":"天津电网","end_st_name":"瑞江南","voltage_type_name":"220kV","start_pg_id":"0101120000","i":681.92206,"lineend_id":"121012000000000359","imax":851.0,"i_rate":80.13185,"start_owner":120000,"start_st_id":"01111200000017","end_owner":120000,"end_pg_name":"天津电网","voltage_type":1005,"start_owner_name":"天津电网","name":"热瑞二线","end_pg_id":"0101120000","start_st_name":"城南燃气热电厂","id":"120112000000000251","end_owner_name":"天津电网"},{"end_st_id":"01121400001116","start_pg_name":"山西电网","end_st_name":"仁和站","voltage_type_name":"220kV","start_pg_id":"0101140000","i":95.93358,"lineend_id":"121014000000000228","imax":118.0,"i_rate":81.299644,"start_owner":140000,"start_st_id":"01121400000031","end_owner":140000,"end_pg_name":"山西长治电网","voltage_type":1005,"start_owner_name":"山西电网","name":"潞和I线（和正线破口）","end_pg_id":"0101140400","start_st_name":"500kV潞城变电站","id":"120114000000007139","end_owner_name":"山西电网"},{"end_st_id":"01123600000055","start_pg_name":"江西电网","end_st_name":"王舍站","voltage_type_name":"220kV","start_pg_id":"0101360000","i":779.56116,"lineend_id":"121036000000000582","imax":960.0,"i_rate":81.20429,"start_owner":360000,"start_st_id":"01113600000015","end_owner":360000,"end_pg_name":"江西宜春电网","voltage_type":1005,"start_owner_name":"江西电网","name":"丰舍线","end_pg_id":"0101360900","start_st_name":"丰城厂","id":"120136000000000773","end_owner_name":"江西电网"},{"end_st_id":"01124300000002","start_pg_name":"湖南电网","end_st_name":"长阳铺站","voltage_type_name":"220kV","start_pg_id":"0101430000","i":1575.9209,"lineend_id":"121043000000000724","imax":1938.0,"i_rate":81.31687,"start_owner":430000,"start_st_id":"01114300000003","end_owner":430000,"end_pg_name":"湖南电网","voltage_type":1005,"start_owner_name":"湖南电网","name":"国长Ⅰ线","end_pg_id":"0101430000","start_st_name":"宝庆A2厂","id":"120143000000000371","end_owner_name":"湖南电网"},{"end_st_id":"01124300000084","start_pg_name":"湖南电网","end_st_name":"盘山站","voltage_type_name":"220kV","start_pg_id":"0101430000","i":649.8118,"lineend_id":"121043000000000981","imax":800.0,"i_rate":81.22648,"start_owner":430000,"start_st_id":"01114300000027","end_owner":430000,"end_pg_name":"湖南常德电网","voltage_type":1005,"start_owner_name":"湖南电网","name":"石盘Ⅱ线","end_pg_id":"0101430700","start_st_name":"大唐石门A2火电厂","id":"120143000000000500","end_owner_name":"湖南电网"},{"end_st_id":"01115100000052","start_pg_name":"四川省宜宾电网","end_st_name":"龚嘴上厂","voltage_type_name":"220kV","start_pg_id":"0101511500","i":549.30597,"lineend_id":"121051000000000365","imax":663.0,"i_rate":82.85158,"start_owner":510000,"start_st_id":"01125100000155","end_owner":510000,"end_pg_name":"四川电网","voltage_type":1005,"start_owner_name":"四川电网","name":"龚山线","end_pg_id":"0101510000","start_st_name":"屏山","id":"120151000000000161","end_owner_name":"四川电网"},{"end_st_id":"01129901050030","start_pg_name":"新疆哈密电网","end_st_name":"烟墩变","voltage_type_name":"220kV","start_pg_id":"0101652200","i":1573.8397,"lineend_id":"121065000000000417","imax":1869.0,"i_rate":84.20758,"start_owner":650000,"start_st_id":"01126500001910","end_owner":990105,"end_pg_name":"新疆电网","voltage_type":1005,"start_owner_name":"新疆电网","name":"2273烟景南线","end_pg_id":"0101650000","start_st_name":"国华景峡南风电汇集站","id":"120165000000000209","end_owner_name":"西北电网"},{"end_st_id":"01116529000043","start_pg_name":"新疆阿克苏电网","end_st_name":"亚曼苏水电站","voltage_type_name":"220kV","start_pg_id":"0101652900","i":1078.3872,"lineend_id":"121065000000001699","imax":1221.0,"i_rate":88.32,"start_owner":650000,"start_st_id":"01126500000001","end_owner":652900,"end_pg_name":"新疆电网","voltage_type":1005,"start_owner_name":"新疆电网","name":"22004曼白线","end_pg_id":"0101650000","start_st_name":"白水变","id":"120165000000000812","end_owner_name":"新疆阿克苏电网"},{"end_st_id":"01126500000049","start_pg_name":"新疆电网","end_st_name":"老满城变","voltage_type_name":"220kV","start_pg_id":"0101650000","i":602.236,"lineend_id":"121065010000000191","imax":630.0,"i_rate":95.59302,"start_owner":650000,"start_st_id":"01116500000040","end_owner":650000,"end_pg_name":"新疆乌鲁木齐电网","voltage_type":1005,"start_owner_name":"新疆电网","name":"2411红满一线","end_pg_id":"0101650100","start_st_name":"国电红雁池电厂","id":"120165010000000096","end_owner_name":"新疆电网"},{"end_st_id":"01126500000048","start_pg_name":"新疆乌鲁木齐电网","end_st_name":"宝钢变","voltage_type_name":"220kV","start_pg_id":"0101650100","i":613.09375,"lineend_id":"121065010000000197","imax":630.0,"i_rate":97.31647,"start_owner":650000,"start_st_id":"01126500000053","end_owner":650000,"end_pg_name":"新疆乌鲁木齐电网","voltage_type":1005,"start_owner_name":"新疆电网","name":"2432燕宝二线","end_pg_id":"0101650100","start_st_name":"燕南变","id":"120165010000000099","end_owner_name":"新疆电网"},{"end_st_id":"01126500001989","start_pg_name":"新疆电网","end_st_name":"华电大连湖风电汇集站","voltage_type_name":"220kV","start_pg_id":"0101650000","i":581.88794,"lineend_id":"121065010000000283","imax":630.0,"i_rate":92.36317,"start_owner":990105,"start_st_id":"01129901050032","end_owner":650000,"end_pg_name":"新疆乌鲁木齐电网","voltage_type":1005,"start_owner_name":"西北电网","name":"21502达连湖线","end_pg_id":"0101650100","start_st_name":"达坂城变","id":"120165010000000142","end_owner_name":"新疆电网"},{"end_st_id":"01126500000046","start_pg_name":"新疆电网","end_st_name":"化工园变","voltage_type_name":"220kV","start_pg_id":"0101650000","i":530.375,"lineend_id":"121065010000000287","imax":630.0,"i_rate":84.18651,"start_owner":650000,"start_st_id":"01116500000002","end_owner":650000,"end_pg_name":"新疆乌鲁木齐电网","voltage_type":1005,"start_owner_name":"新疆电网","name":"2505 矸化线","end_pg_id":"0101650100","start_st_name":"神华米东矸石电厂","id":"120165010000000144","end_owner_name":"新疆电网"}],"pg_abbr":"国家"}]},"header":{"is_success":true}},"state":1};
                  var linedata = ret.data.nma_line_load.grid_line_load_list[0];
                  var loads={};
                  for (var i = 0; i < linedata.over_load_list.length; i++) {
                      var row = linedata.over_load_list[i];
                      var id = row.id;
                      loads[id] = row;
                  }
                  for (var i = 0; i < linedata.heavy_load_list.length; i++) {
                      var row = linedata.heavy_load_list[i];
                      var id = row.id;
                      loads[id] = row;
                  }
                  _this.lineload=loads;*/
    ModelList.useAll(function () {
        //if (!btn.state) return;
        //btn.grid = ProjectSGC.Helper.getGrid(btn.pgid);
        PDP.exec(dll, function (ret1) {
            //if (!btn.state) return;
            if (ret1.check("获取重载数据", true)) {
                console.log(ret1.value);
                try {
                    var linedata = JSON.parse(ret1.value).data.nma_line_load.grid_line_load_list[0];
                    var loads = {};
                    if (linedata.over_load_list)
                        for (var i = 0; i < linedata.over_load_list.length; i++) {
                            var row = linedata.over_load_list[i];
                            var id = row.id;
                            loads[id] = row;
                        }
                    if (linedata.heavy_load_list)
                        for (var i = 0; i < linedata.heavy_load_list.length; i++) {
                            var row = linedata.heavy_load_list[i];
                            var id = row.id;
                            loads[id] = row;
                        }
                    _this.lineload = loads;
                } catch (err) {
                    console.log("获取重过载数据报错！");
                }
            }
        });
    });
    //潮流数据
    var dlls = [];
    //var linerate={};
    this.showAc = this.colaclinevol;//["1001","1003"];
    dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["getrealdatabydevmeas", "?devtype=1211&meastypes=00002005"] });
    for (var i = 0; i < this.showAc.length; i++) {
        dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["getrealdatabyvoldevmeas", "?voltype=" + this.showAc[i] + "&devtype=1210&meastypes=00002001"] });
    }
    PDP.exec(dlls, function (ret) {
        if (ret.check("获取潮流数据", true)) {
            SGCTranschannel.init(ret.value, function (data) {
                linerate = data;
                var ends = {};
                for (var i = 0; i < linerate.length; i++) {
                    var row = linerate[i];
                    var id = row.id;
                    ends[id] = row;
                }
                _this.linerate = ends;
                //_this.refresh2();
            });

        }
    });
} 
this.showChannelCard = function (r) {
    var cardUrlInst = ProjectSGC.Global.getMainObject("cardUrlInst");
    if (!cardUrlInst) return;
    cardUrlInst.show("gettranschannelcardcon", r.ID);
}

this.showLineCard = function (r) {
    var cardUrlInst = ProjectSGC.Global.getMainObject("cardUrlInst");
    if (!cardUrlInst) return;
    var devid = r.line_id;
    var type = ProjectSGC.Meta.getTypeById(devid);
    cardUrlInst.show(type == "ACLINE" ? "aclinecard" : "dclinecard", devid);
}

this.showLineTower = function (r) {
    var devid = r.line_id;
    ProjectSGC.Map.locate("LINE", r.line_id);
    //ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { lineid: devid } });
    //var id = row.line_id;
    var vMain = ProjectSGC.Global.getMainObject("vMain");
    var main = ProjectSGC.Global.getMainObject("bottomMenuInst");
    if (main.linePage)
        vMain.destroyFloatPage(main.linePage);
    var args = {
        lineid: devid, st: this.starttime, et: this.endtime, types: "light,fire", main: {
            showBar: function () {
                vMain.destroyFloatPage(main.linePage);
                vm.linePage = null;
            }
        }, closename: "关闭"
    };
    main.linePage = vMain.floatPage("sgc_env_line", args, "1.20.814.2");
}

this.LocateTower = function (r) {
    this.showLineTower(r);
    var id = r.towerid;
    ProjectSGC.Map.locate("TOWER", { towerid: id, tips: r.type + r.value + '级' });
    //this.postMessage({ locateType: 10, locateItem: { towerid: id.towerid, tips: id.tips }, flyType: (keepHeight ? 1 : 0) }, dest);
}

Ysh.Object.addHandle(this, "resize",
function () {
    this.height = $(this.$el).height() - 50;
});

Ysh.Web.Event.attachEvent(window, "unload", function () {
    /*ProjectSGC.Map.hideIcon("miji");
ProjectSGC.Map.postMessage({
eventType:"menuope",
menuname:"showPartitions",selstate:false,data:[{type:"miji"}]});
ProjectSGC.Map.postMessage({eventType: 'menuope', menuname: 'drawCanvasTips',selstate:false,  data:{type:"da"}});*/
    ProjectSGC.Map.highLight([], [], "", "", false);
    ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showStationLineByOpacity", selstate: false, data: { lineIDs: [], stationIDs: [] } }, "channel");
    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'drawLineShadowByTowerNo', selstate: false, data: {} });
    //ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showTowerLine", data: { clear: true } });
    ProjectSGC.Map.postMessage({eventType:'menuope',menuname:'showPartialTowerLine',selstate:false,data:[] });
    var vMain = ProjectSGC.Global.getMainObject("vMain");
    vMain.destroyFloatPage(ProjectSGC.Global.getMainObject("bottomMenuInst").linePage);
});

/*  this.showLineDetail = function(id){
      this.isshowDetail = true;
      this.dynArgs = id;
    }  */
this.locateLinesgj = function (row) {
    ProjectSGC.Map.highLight([], [], "", "", false);
}
this.getTowerNo = function(dsTower ,id) {
    var idx = Ysh.Array.findRow(dsTower,0,id);
    if (idx < 0) return "";
    return dsTower[idx][2];
}
this.locateLines = function (row) {
    ProjectSGC.Map.highLight([], [], "", "", false);

    this.showRegions(row.ID, this.value1_sel == '0' ? this.ds10 : (this.value1_sel == '1' ? this.dsjs : trarr));
    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'changeLineShadowColor', data: { arrID: [row.ID], color: "#fff000" } });
    ProjectSGC.Map.postMessage({ locateType: 17, selstate: true, locateItem: { id: row.ID } });
    /*if (row.longitude1&&row.latitude1) {
      ProjectSGC.Map.postMessage({eventType:"menuope",menuname:"showPartitions",selstate:false,data:[{type:"miji"}]});
      
      ProjectSGC.Map.postMessage({
        eventType:"menuope",
        menuname:"showPartitions",selstate:true,
        data:[{type:"miji",boundaryData:[
          {Latitude:row.latitude1,Longitude:row.longitude1},
          {Latitude:row.latitude2,Longitude:row.longitude2},
          {Latitude:row.latitude3,Longitude:row.longitude3},
          {Latitude:row.latitude4,Longitude:row.longitude4},
          {Latitude:row.latitude1,Longitude:row.longitude1}
        ],color:"#86dcfd",opacity:0.5}]});
        var maxLong = Math.max(parseFloat(row.longitude1),parseFloat(row.longitude2),parseFloat(row.longitude3),parseFloat(row.longitude4));
        var minLong = Math.min(parseFloat(row.longitude1),parseFloat(row.longitude2),parseFloat(row.longitude3),parseFloat(row.longitude4));
        var maxLat = Math.max(parseFloat(row.latitude1),parseFloat(row.latitude2),parseFloat(row.latitude3),parseFloat(row.latitude4)); 
        var minLat = Math.min(parseFloat(row.latitude1),parseFloat(row.latitude2),parseFloat(row.latitude3),parseFloat(row.latitude4)); 
        ProjectSGC.Map.postMessage({
        locateType: 13,
        padding: [0, 0, 0, 0],
        range: {maxLng:maxLong,minLng:minLong,maxLat:maxLat,minLat:minLat}
        });
       //ProjectSGC.Map.fly((parseFloat(row.longitude1) + parseFloat(row.longitude2) + parseFloat(row.longitude3) + parseFloat(row.longitude4))/4.0,
       //(parseFloat(row.latitude1) + parseFloat(row.latitude2) + parseFloat(row.latitude3) + parseFloat(row.latitude4))/4.0);
     }*/
    //return;
    var chid = row.ID;
    var _this = this;
    this.showStationLineByOpacity([]);
    ProjectSGC.Map.postMessage({eventType:'menuope',menuname:'showPartialTowerLine',selstate:false,data:[] });
    PDP.read("SGC", "sgc/transchannel_mjtd:GetLines", [chid], function (ret) {
        if (!ret.check("获取密集通道信息", true)) return;
        var lines = Ysh.Array.to1d(ret.value, 0);
        if (lines.length > 0) {
            var lighttower = [];//告警详情雷电
            var ModelList = ProjectSGC.Global.getMainObject("ModelList");
            ProjectSGC.require("voltage");
            ModelList.require(["LINE"], function () {
                _this.showStationLineByOpacity(lines, ModelList);
                var line = null;
                Ysh.Array.each(lines, function (l, n) {
                    var gtids = [];
                    var ln = ModelList.getLine(l);
                    var v = ProjectSGC.Voltage[ln[8]];
                    if (null == line) {
                        line = { id: ln[0], vol: (v ? v.value : 100000) };
                        
                    }else{
                        if (!v)
                        return;
                        if (v.value < line.vol) {
                            line.id = ln[0];
                            line.vol = v.value;
                        }
                    }
                    if(!_this.showgj)return;
                    if(row.type!='雷电')return;
                    for(var i=0 ;i<_this.dsgj.length; i++){
                       if( ln[0] == _this.dsgj[i][2] ){ 
                            gtids = _this.dsgj[i][11].split(',');
                            break;
                       }
                    }
                    if(gtids.length==0)return;
                    var num = -1;
                    for(var i=0 ; i<_this.dsjsline.length ; i++){
                        var r = _this.dsjsline[i];
                        if(r[0].indexOf(chid)!=-1&&r[1].indexOf(ln[0])!=-1){
                            num = i;
                            break;
                        }
                    }
                    if(num<0)return;
                    var linetowereds = _this.dsjsline[num];//线路密集通道中的首末端杆塔信息 
                           var startno = linetowereds[2].toFixed(2)||'';
                           var endno = linetowereds[3].toFixed(2)||'';
                           lighttower.push({lineID:ln[0],startTower:startno,endTower:endno,scaleTowerNum:gtids})
                           
                        
                });
                var m = ProjectSGC.Global.getMainObject("MapOpeInst");
                m.postMessage({ eventType: "menuope", menuname: "GlowMeshLine", selstate: 0, data: {} });
                if (lighttower.length > 0)
                m.postMessage(
                    {eventType:'menuope',menuname:'showPartialTowerLine',selstate:true,
                    data:lighttower }
                );
                //ProjectSGC.Map.postMessage({ locateType: 10, locateItem: { lineid: line.id, volvalue: line.vol.toString(), time: 1 } });
                window.setTimeout(function () {
                    //ProjectSGC.Map.highLight(lines, [], null,false);
                    if (lines.length > 0)
                        m.postMessage({ eventType: "menuope", menuname: "GlowMeshLine", selstate: 1, data: { lineIDs: lines, stopDynamic: false } });
                }, 2000);
            });
            

        }
    });

}

this.showRegions = function (ID, arrdara) {
    var arr = [];
    if (this.value1_sel != '2') {
        for (var i = 0; i < arrdara.length; i++) {
            var row = arrdara[i];
            if (row[6] == ID) continue;
            arr.push(row[6]);
        }
    } else {
        for (var i = 0; i < arrdara.length; i++) {
            if (arrdara[i] == ID) continue;
            arr.push(arrdara[i]);
        }
    }

    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'changeLineShadowColor', data: { arrID: arr, color: "#ea4040" } });
    /* var arr = [];
for (var i = 0;i < arrdara.length;i++) {
var row = arrdara[i];
if (row[5] == ID) continue;
var longitude1 = row[6];
if (!longitude1) continue;
var latitude1 = row[7];
if (!latitude1) continue;
var longitude2 = row[8];
var latitude2 = row[9];
var longitude3 = row[10];
var latitude3 = row[11];
var longitude4 = row[12];
var latitude4 = row[13];

arr.push({type:"miji",boundaryData:[
{Latitude:latitude1,Longitude:longitude1},
{Latitude:latitude2,Longitude:longitude2},
{Latitude:latitude3,Longitude:longitude3},
{Latitude:latitude4,Longitude:longitude4},
{Latitude:latitude1,Longitude:longitude1}
],color:"#ff0000",opacity:0.2});
}
ProjectSGC.Map.postMessage({
eventType:"menuope",
menuname:"showPartitions",selstate:true,
data:arr});*/
}

this.showPoints = function () {
    ProjectSGC.Map.highLight([], [], "", "", false);
    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'drawLineShadowByTowerNo', selstate: false, data: {} });
    var locatedata = [];
    for (var i = 0; i < this.ds10.length; i++) {
        var row = this.ds10[i];
        row[2] = this.cutZero(row[2]);
        row[14] = this.cutZero(row[14]);
        for (var j = 0; j < this.dsjsline.length; j++) {
            var row1 = this.dsjsline[j];
            if (row[5] == row1[0]) {
                locatedata.push({ id: row[5], lineid: row1[1], name: row[0] });
            }
        }
    }
    ProjectSGC.Map.postMessage({
        eventType: 'menuope', menuname: 'drawLineShadowByTowerNo', selstate: true, data: {
            showIcon: true, showTips: false, locateData: locatedata
        }
    });
    /*ProjectSGC.Map.hideIcon("miji");
    ProjectSGC.Map.highLight([], [], "","",false);
    ProjectSGC.Map.postMessage({eventType:"menuope",menuname:"showPartitions",selstate:false,data:[{type:"miji"}]});
    ProjectSGC.Map.postMessage({eventType: 'menuope', menuname: 'drawCanvasTips',selstate:false,  data:{type:"da"}});
    var info = [];
    for (var i = 0;i < this.ds10.length;i++) {
    var row = this.ds10[i];
    var ponit=[[parseInt(row[6]),parseInt(row[7])],[parseInt(row[8]),parseInt(row[9])],[parseInt(row[10]),parseInt(row[11])],[parseInt(row[12]),parseInt(row[13])]];
    var locatponit = this.getPolygonAreaCenter(ponit);
    row[16] = locatponit[0];
    row[17] = locatponit[1];
    info.push({ longitude: row[16], latitude: row[17], data: { data: row, tips:row[0] } });
    }
     
    var m = ProjectSGC.Global.getMainObject("MapOpeInst");
    if(m)
    m.menu("showImageIcon", true, { stopLight: true, time: 0, type: "miji", images: { imgCode: 0, imgUrl: "/textures/coin/towerchannel/icon.png"}, locateData: info });
   
    //ProjectSGC.Map.showPointIcon("miji","/i/sgc/point.png",this.ds10,16,17,null);
    ProjectSGC.Map.showPointIcon("miji","/textures/coin/towerchannel/icon.png",this.ds10,16,17,null);
    //ProjectSGC.Map.postMessage({eventType:"menuope",menuname:"showPartitions",selstate:false,data:[{type:"miji"}]});
    this.showRegions('',this.ds10);
    return;
      ProjectSGC.Map.postMessage({ locateType: 0 });
      var lst = [];
      for (var i = 0;i < this.ds10.length;i++) {
        var row = this.ds10[i];
        var lon = row[6];
        var lat = row[7];
        if (lon&&lat)
        lst.push({ longitude:lon,latitude:lat  });
      }
      ProjectSGC.Map.postMessage({ locateType: 3, locateItem: lst, flyType: 1 });*/
}

this.showPoints2 = function () {
    ProjectSGC.Map.highLight([], [], "", "", false);
    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'drawLineShadowByTowerNo', selstate: false, data: {} });
    var locatedata = [];
    for (var i = 0; i < this.dsjs.length; i++) {
        var row = this.dsjs[i];
        var imgarr = [];
        if (row[2] != '0') { imgarr.push("/textures/coin/towerchannel/rain2.png"); }
        if (row[3] != '0') { imgarr.push("/textures/coin/towerchannel/temperature.png"); }
        for (var j = 0; j < this.dsjsline.length; j++) {
            var row1 = this.dsjsline[j];
            if (row[5] == row1[0]) {
                locatedata.push({ id: row[5], lineid: row1[1], name: row[0], font: row[1] + "MW", iconImgs: imgarr });
            }
        }
    }
    ProjectSGC.Map.postMessage({
        eventType: 'menuope', menuname: 'drawLineShadowByTowerNo', selstate: true, data: {
            showIcon: true, showTips: true, locateData: locatedata
        }
    });
    /*ProjectSGC.Map.hideIcon("miji");
    ProjectSGC.Map.highLight([], [], "","",false);
    ProjectSGC.Map.postMessage({eventType:"menuope",menuname:"showPartitions",selstate:false,data:[{type:"miji"}]});
    ProjectSGC.Map.postMessage({eventType: 'menuope', menuname: 'drawCanvasTips',selstate:false,  data:{type:"da"}});
    var locateData=[];
    for (var i = 0;i < this.dsjs.length;i++) {
      var row = this.dsjs[i];
      var ponit=[[parseInt(row[6]),parseInt(row[7])],[parseInt(row[8]),parseInt(row[9])],[parseInt(row[10]),parseInt(row[11])],[parseInt(row[12]),parseInt(row[13])]];
      var locatponit = this.getPolygonAreaCenter(ponit);
      row[18] = locatponit[0];
      row[19] = locatponit[1];
      var imgarr=[];
      if(row[2]!='0'){imgarr.push("/textures/coin/towerchannel/rain2.png");}
      if(row[3]!='0'){imgarr.push("/textures/coin/towerchannel/temperature.png");}
      locateData=[{type:"test",latitude:locatponit[1],longitude:locatponit[0],paddingleft:50,
      backImg:"/textures/coin/towerchannel/backImg.png",
      iconImgs:imgarr,
      font:row[1]+"MW",cssStyle:{width:80,height:50,fontWeight:50,fontSize:20,fontColor:"#8eecfe",marginTopFont:15,marginLeftFont:10,marginLeftImg:10,paddingTopImg:0,paddingLeftImg:15,marginTopImg:30,widthImg:15,heightImg:15}}];
      ProjectSGC.Map.postMessage({eventType: 'menuope', menuname: 'drawCanvasTips',selstate:true,  data:{type:"da",locateData:locateData}}
      );    
    }
   var info = [];
    var m = ProjectSGC.Global.getMainObject("MapOpeInst");
    Ysh.Array.each(this.dsjs, function (row) {
          var lon = row[18];
          var lat = row[19];
          if (lon&&lat)
          info.push({ longitude: lon, latitude: lat, data: { data: row, tips:row[0] } });
      });
      m.menu("showImageIcon", true, { stopLight: true, time: 0, type: "miji", images: { imgCode: 0, imgUrl: "/textures/coin/towerchannel/icon.png"}, locateData: info });
    //ProjectSGC.Map.showPointIcon("miji","/textures/coin/towerchannel/icon.png",this.dsjs,18,19,null);
    this.showRegions('',this.dsjs);
    */
    //ProjectSGC.Map.postMessage({eventType:"menuope",menuname:"showPartitions",selstate:false,data:[{type:"miji"}]});

}

var trarr = [];
this.showPoints3 = function () {
    ProjectSGC.Map.highLight([], [], "", "", false);
    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'drawLineShadowByTowerNo', selstate: false, data: {} });
    var locatedata = [];
    trarr = [];
    for (var i = 0; i < this.dsgj.length; i++) {
        var row = this.dsgj[i];
        if (trarr.indexOf(row[0]) < 0) {
            trarr.push(row[0]);
            for (var j = 0; j < this.dsjsline.length; j++) {
                var row1 = this.dsjsline[j];
                if (row[0] == row1[0]) {
                    locatedata.push({ id: row[0], lineid: row1[1], name: row[1] });
                }
            }
        }
    }
    ProjectSGC.Map.postMessage({
        eventType: 'menuope', menuname: 'drawLineShadowByTowerNo', selstate: true, data: {
            showIcon: true, showTips: false, locateData: locatedata
        }
    });
}

this.setChannelsHighlight = function (selection) {
    ProjectSGC.Map.highLight([], []);
    var lst = [];
    var all = this.dsjsline;
    for (var i = 0; i < selection.length; i++) {
        var s = selection[i];
        var id = s.ID;
        for (var j = 0; j < all.length; j++) {
            var row = all[j];
            if (row[0] == id)
                lst.push(row[1]);
        }
    }
    this.showStationLineByOpacity(lst);
    if (lst.length == 0) return;
    ProjectSGC.Map.highLight(lst, []);
}
this.setChannelHighlight = function (selection) {
    //debugger
}