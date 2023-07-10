/*v=1.21.416.1*/
var SGCTranschannel = {
    _endsAc: {},
    _endsDc: {},
    _inited: false,
    _lstData: [],
    _lstTail: [],
    _lstStationData: [],
    _prev: "",
    _cur: "",
    getShowTime: function () {
        return vMain.getShowTime();
    },
    readEnds: function (data, ends) {
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var id = row[1];
            ends[id] = row;
        }
    },
    init: function (retdata, callback) {
        var ModelList = ProjectSGC.Global.getMainObject("ModelList");
        ModelList.require("station", function () {
            var exes = [];
            exes.push({ type: 'read', db: 'SGC', sql: "sgc/chaoliu:GetAllAcLineEnds", args: [] });
            exes.push({ type: 'read', db: 'SGC', sql: "sgc/chaoliu:GetAllDcLineEnds", args: [] });
            PDP.exec(exes, function (ret) {
                if (!ret.isOK) {
                    window.setTimeout(function () { SGCTranschannel.init(); }, 1000);
                    return;
                }
                SGCTranschannel._inited = true;
                SGCTranschannel.readEnds(ret.value[0], SGCTranschannel._endsAc);
                SGCTranschannel.readEnds(ret.value[1], SGCTranschannel._endsDc);
                var returndata =SGCTranschannel.readData(retdata);
                callback(returndata);
                //return returndata;
            });
        });
    },
    getLineMeasTailItem: function (combines, id, value, lst, lstTail, ends, bCombine, skipByVol) {
        if (isNaN(value)||(value === ""))
            return;
        var end = ends[id];
        if (!end)
            return;
        if (end[2] != end[3]) //取首站（进线为正）
            return;//value = -value;
        var lineid = end[0];
        if (skipByVol && ModelList) {
            var m = ModelList;
            var line = m.getLine(lineid);
            if (!line)
                return;
            var vol = line[ProjectSGC.LINE.VOLTAGE];
            var bSkip = true;
            for (var i = 0; i < this.showAc.length; i++) {
                if (this.showAc[i] == vol) {
                    bSkip = false;
                    break;
                }
            }
            if (bSkip) return;
        }
        value = parseFloat(value);
        var o = { datetime: "", V00: value, color: "#ffffff", id: lineid, dtype: "linechaoliu" };
        var b = false;
        if (bCombine) {
            var g = end[5];
            if (g) {
                b = true;
                var c = combines[g];
                if (c)
                    c.V00 += value;
                else {
                    o.name = end[6];
                    combines[g] = o;
                }
            }
        }
        if (!b) {
            lst.push(o);
        }
        lstTail.push({ datetime: "", V00: value, color: "#ffffff", id: end[0], dtype: "linechaoliu" });
    },
    getLineMeasTail: function (lst, lstTail, meas, ends, bCombine) {
        var combines = {};
        if (this.getShowTime()) {
            for (var i = 0; i < meas.length; i++) {
                var row = meas[i];
                var id = row[0];
                var value = row[1];
                this.getLineMeasTailItem(combines, id, value, lst, lstTail, ends, bCombine, !bCombine);
            }
        } else {
            var data = ProjectSGC.Service.getResult(meas, "data");
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item.status == -1)
                    continue;
                var id = item.id;
                var value = item.floatValue;
                this.getLineMeasTailItem(combines, id, value, lst, lstTail, ends, bCombine);
            }
        }
        if (bCombine) {
            for (var g in combines)
                lst.push(combines[g]);
        }

    },
    isSkipByVol: function (m, staid) {
        var s = m.getStation(staid);
        if (!s) return true;
        var vol = s.code;
        if (!vol) return true;
        var code = parseInt(vol);
        if (this.showDc) {
            if ((code > 1999) && (code < 2099))
                return false;
        }
        return this.showAc.indexOf(vol) < 0;
    },//电压值色值：0、255、127（RGB）  有功出力色值：255、255、0（RGB）  线路有功色值：0、255、255（RGB）
    getPlantPowerData: function (meas) {
        var lst = [];
        if (this.getShowTime()) {
            for (var i = 0; i < meas.length; i++) {
                var row = meas[i];
                var id = row[0];
                var value = row[1];
                if (this.isSkipByVol(ModelList, id))
                    continue;
                lst.push({ data: [{ datetime: "", V00: value, color: "#FFFF00", unit: "MW", dtype: "plantpower", id: id }], id: id });
            }
        } else {
            var data = ProjectSGC.Service.getResult(meas, "data");
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item.status == -1)
                    continue;
                var id = item.id;
                var value = item.floatValue;
                if (!value)
                    continue;
                if (this.isSkipByVol(ModelList, id))
                    continue;
                lst.push({ data: [{ datetime: "", V00: value, color: "#FFFF00", unit: "MW", dtype: "plantpower", id: id }], id: id });
            }
        }
        return lst;
    },
    getStationVolData: function (meas) {
        var sInfo = {};
        if (this.getShowTime()) {
            for (var i = 0; i < meas.length; i++) {
                var row = meas[i];
                var id = row[0];
                var value = parseFloat(row[1]);
                var staid = row[2];
                if (this.isSkipByVol(ModelList, staid))
                    continue;
                if (sInfo[staid]) {
                    if (value > sInfo[staid].value)
                        sInfo[staid] = { id: id, value: value };
                } else {
                    sInfo[staid] = { id: id, value: value };
                }
            }
        } else {
            meas = JSON.parse(meas);
            for (var g in meas) {
                var lst = meas[g];
                for (var i = 0; i < lst.length; i++) {
                    var item = lst[i];
                    if (item.status == -1) continue;
                    if (item.floatValue == 0.0) continue;
                    var staid = item.stId;
                    if (this.isSkipByVol(ModelList, staid))
                        continue;
                    if (sInfo[staid]) {
                        if (item.floatValue > sInfo[staid].value)
                            sInfo[staid] = { id: item.id, value: item.floatValue };
                    } else {
                        sInfo[staid] = { id: item.id, value: item.floatValue };
                    }
                }
            }
        }
        var lst = [];
        for (var s in sInfo) {
            lst.push({ data: [{ datetime: "", V00: sInfo[s].value, color: "#00FF7F", unit: "kV", dtype: "busvol", id: sInfo[s].id }], id: s });
        }
        return lst;
    },
    showDirection: false,
    showValue: false,
    showDc: false,
    showAc: [],
    showPlantPower: false,
    showStationVol: false,
    showAc1000: true,
    showAc750: true,
    showAc500: true,
    hide: function () {
        //ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'showLineTail', selstate: false });
        //ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'showLineChaoliuData', selstate: false });
        this.showTail([]);
        this.showData([]);
        this._lstStationData = [];
        ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'showStationData', selstate: false });
        this._prev = "";
    },
    getModify: function (arr) {
        var ret = [];
        for (var i = 0; i < arr.length; i++)
            ret.push(arr[i][1]);
        return ret;
    },
    combine2Data: function (lst1, lst2) {
        if (lst2.length == 0) return lst1;
        if (lst1.length == 0) return lst2;
        var o = {};
        var ids = [];
        for (var i = 0; i < lst1.length; i++) {
            var item = lst1[i];
            var id = item.id;
            o[id] = item;
            ids.push(id);
        }
        for (var i = 0; i < lst2.length; i++) {
            var item = lst2[i];
            var id = item.id;
            if (o[id]) {
                o[id].data = o[id].data.concat(item.data);
            } else {
                o[id] = item;
                ids.push(id);
            }
        }
        var lst = [];
        for (var i = 0; i < ids.length; i++) {
            lst.push(o[ids[i]]);
        }
        return lst;
    },
    changeColor: function (lst, clr) {
        if (!clr)
            return lst;
        for (var i = 0; i < lst.length; i++) {
            lst[i].color = clr;
        }
        return lst;
    },
    showDiff: function (field, lst, menuname, clr, fCompare, needDelete) {
        if (lst.length == 0) {
            ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: menuname, selstate: false });
        } else {
            var arr = ProjectSGC.Array.edit(this[field], lst, fCompare || function (l1, l2) {
                if (l1.id != l2.id) return 0; return (Math.round(l1.V00, 10) == Math.round(l2.V00, 10)) ? 1 : 2;
            });
            if ((arr[0].length > 0) && ((this._cur != this._prev) || (needDelete)))
                ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: menuname, selstate: false, data: arr[0] });
            if (arr[1].length > 0)
                ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: menuname, selstate: true, data: { type: 1, info: this.changeColor(this.getModify(arr[1]), clr) } });
            if (arr[2].length > 0)
                ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: menuname, selstate: true, data: { type: 2, info: this.changeColor(arr[2], clr) } });
        }
        this[field] = lst;
    },
    showData: function (lst) {
        this.showDiff("_lstData", lst, "showLineChaoliuData", "#00FFFF");
    },
    showTail: function (lst) {
        this.showDiff("_lstTail", lst, "showLineTail");
    },
    showStationData: function (lst) {
        this.showDiff("_lstStationData", lst, "showStationData", "", function (l1, l2) {
            if (l1.id != l2.id) return 0;
            if (l1.data.length != l2.data.length) return 2;
            for (var i = 0; i < l1.data.length; i++) {
                if (l1.data[i].V00 != l2.data[i].V00)
                    return 2;
            }
            return 1;
        }, true);
    },
    readData: function (ret,endsDc,endsAc) {
        //this.hide();
        var lst = [], lstTail = [];
        var nDc = -1, nPlantPower = -1, nStationVol = -1;
        if (this.showDc && (this.showDirection || this.showData))
            nDc = 0;
        if (this.showPlantPower)
            nPlantPower = nDc + 1;
        if (this.showStationVol)
            if (this.showPlantPower)
                nStationVol = nPlantPower + 1;
            else
                nStationVol = nDc + 1;
        var lstPlantPower = [], lstStationVol = [];
        for (var i = 0; i < ret.length; i++) {
            if (i == 0) {
                this.getLineMeasTail(lst, lstTail, ret[i], this._endsDc, false);
                continue;
            }
            if (i == nPlantPower) {
                lstPlantPower = this.getPlantPowerData(ret[i]);
                continue;
            }
            if (i == nStationVol) {
                lstStationVol = this.getStationVolData(ret[i]);
                continue;
            }
            this.getLineMeasTail(lst, lstTail, ret[i], this._endsAc);
        }
        return lst;
        //if (this.showDirection)
        //    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'showLineTail', selstate: lst.length > 0, data: lstTail });
        //if (this.showValue)
        //    ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'showLineChaoliuData', selstate: lst.length > 0, data: lst });
        //vMain.chaoliuTime = Ysh.Time.formatString(this.getShowTime(), "111111");

        //this.showTail(this.showDirection ? lstTail : []);
        //this.showData(this.showValue ? lst : []);
        //this.showStationData(this.combine2Data(lstPlantPower, lstStationVol));
        //this._prev = this._cur;
    },
    _reading: false,
    getTimeSQLCommand: function (node, measType) {
        var time = new Date(Ysh.Time.parseDate(this.getShowTime()));
        var year = time.getFullYear();
        var mi = time.getMinutes();
        return {
            type: 'read', db: 'SGC', sql: "sgc/chaoliu:" + node, args: [year, "V" + (mi < 10 ? "0" : "") + mi, Ysh.Time.formatString(time,"111100")+":00:00", measType]
        };
    },
    read: function (id) {
        console.log("开始获取潮流：" + this.getShowTime())
        var dlls = [];
        if (this.showDc&&(this.showDirection||this.showData)) {
            if (this.getShowTime())
                dlls.push(this.getTimeSQLCommand("GetDcLineMeas", "00002005"));
            else
                dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["getrealdatabydevmeas", "?devtype=1211&meastypes=00002005"] });
        }
        if (this.showPlantPower) {
            if (this.getShowTime())
                dlls.push(this.getTimeSQLCommand("GetPlantMeas", "30022001"));
            else
                dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["getrealdatabydevmeas", "?devtype=0111&meastypes=00002001"] });
        }
        if (this.showStationVol) {
            if (this.getShowTime())
                dlls.push(this.getTimeSQLCommand("GetBusBarMeas", "00002202"));
            else
                dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Realtime.GetBusVoltage", "args": [] });
        }
        /*
        if (this.showAc1000)
            dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["getrealdatabyvoldevmeas", "?voltype=1001&devtype=1210&meastypes=00002001"] });
        if (this.showAc750)
            dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["getrealdatabyvoldevmeas", "?voltype=1002&devtype=1210&meastypes=00002001"] });
        if (this.showAc500)
            dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["getrealdatabyvoldevmeas", "?voltype=1003&devtype=1210&meastypes=00002001"] });
        */
        if ((this.showAc.length > 0) && (this.showDirection || this.showData)) {
            if (this.getShowTime()) {
                dlls.push(this.getTimeSQLCommand("GetAcLineMeas", "00002001"));
            } else {
                for (var i = 0; i < this.showAc.length; i++) {
                    dlls.push({ type: "dll", "dll": "SGCLib:SGCLib.Service.Get", "args": ["getrealdatabyvoldevmeas", "?voltype=" + this.showAc[i] + "&devtype=1210&meastypes=00002001"] });
                }
            }
        }
        if (dlls.length == 0) {
            this.hide();
            return;
        }
        this._cur = (this.showDc ? "1," : "") + this.showAc.join(",");
        try {
            PDP.exec(dlls, function (ret) {
                if (SGCTranschannel.isAbandon(id))
                    return;
                if (ret.isOK)
                    SGCTranschannel.readData(ret.value);
                SGCTranschannel.start(10000);
            });
        } catch (err) {
            if (SGCTranschannel.isAbandon(id))
                return;
            SGCTranschannel.start(1000);
        }
    },
    refresh: function (id) {
        if (!this._inited) {
            if (this.isAbandon(id))//已经开始新的了
                return;
            this.start(1000);
            return;
        }
        this.read(id);
    },
    __id: 0,
    isAbandon: function (id) {
        return id != this.__id;
    },
    start: function (n) {
        this.__id++;
        if (!this.needShow()) {
            this.hide();
            return;
        }
        var id = this.__id;
        window.setTimeout(function () {
            SGCTranschannel.refresh(id);
        }, n || 1);
    },
    needShow: function () {
        return this.showDirection || this.showValue || this.showPlantPower || this.showStationVol;
    }
};
var SGC = {
     modalToBig: function(e,vm){
        var dh = document.documentElement.clientHeight,dw = document.documentElement.clientWidth;
        var cMC,tc,ec=[],dc
       for(k in vm.$refs){
            if(vm.$refs[k]){
                if(vm.$refs[k].$el == e.path[4]){
                    cMC = vm.$refs[k];
                }
            }            
       }
       if(!cMC) return;       
       cMC.draggable = false;
       vm.modalfullscreen = true;
       $(".modalreduction").show();
       $(".modalsobig").hide();
       if(!cMC.$children.length){
        var iframe = $(cMC.$el).find("iframe");
        vm.h1 = dh-59 - 32 - 40;
       
       }
       cMC.$children.forEach(function(value){
            var tag = Ysh.Vue.getTag(value);
            if(tag == "scrolltable"||tag == "i-table"||tag == "pagetable"||tag == "iframe"){
                tc = value;
            }
            if(tag == "esimplechart"){
                if(!vm.viewshow||vm.viewshow&&vm.viewshow!=="none")
                ec.push(value);
            }
            if(tag == "dynfile"){
                dc = value;
            }
       })
       if(tc){
            if(ec.length){
                vm.h1 = dh - 59 - 32 - 700;
                vm.w1 = dw - 32;
                vm.$nextTick(function(){
                    ec.forEach(function(value){
                        value.echart.resize();
                    })                    
                    tc.resize();
                })
            }else{
                if(vm.$refs["tableHeader0"]){
                    var th1 = vm.$refs["tableHeader1"]? vm.$refs["tableHeader1"].clientHeight : 0;
                    vm.h1 = dh - 59 - 32 -vm.$refs["tableHeader0"].clientHeight-th1;
                }else{
                     vm.h1 = dh - 59 - 32;
                }
                vm.$nextTick(function(){
                    tc.resize();
                })
            }
       }else if(dc){
            dc.args.subfileTableHeight = dh - 59 - 32 - 40;
            vm.$nextTick(function(){
                    dc.$children[0].$children[0].resize();
            })
       }else{
            return false;
       }
          
    }, modalToSmall: function(e,vm,v){
        var dh = document.documentElement.clientHeight,dw = document.documentElement.clientWidth;
        var cMC,tc,ec=[],dc
        if(v){
            for(k in vm.$refs){
                if(vm.$refs[k]){
                    if(vm.$refs[k].$el == e.path[5]){
                        cMC = vm.$refs[k];
                    }
                }
           }
        }else{
           for(k in vm.$refs){
                if(vm.$refs[k]){
                    if(vm.$refs[k].$el == e.path[4]){
                        cMC = vm.$refs[k];
                    }
                }
           }
       }
       if(!cMC) return;    
       cMC.draggable = true;   
       vm.modalfullscreen = false;
       $(".modalreduction").hide();
       $(".modalsobig").show();
       if(!cMC.$children.length){
        var iframe = $(cMC.$el).find("iframe");
        vm.h1 = 700;
       
       }
       cMC.$children.forEach(function(value){
            var tag = Ysh.Vue.getTag(value);
            if(tag == "scrolltable"||tag == "i-table"||tag == "pagetable"){
                tc = value;
            }
            if(tag == "esimplechart"){
                if(!vm.viewshow||vm.viewshow&&vm.viewshow!=="none")
                ec.push(value);
            }
            if(tag == "dynfile"){
                dc = value;
            }
       })
       if(tc){
            if(ec.length){
                vm.h1 = 700;
                vm.w1 = 965;
                vm.$nextTick(function(){
                    ec.forEach(function(value){
                        value.echart.resize();
                    })                    
                    tc.resize();
                })
            }else{
                vm.h1 = 700;
                vm.$nextTick(function(){
                    tc.resize();
                })
            }
       }else if(dc){
            dc.args.subfileTableHeight = 700;
            vm.$nextTick(function(){
                    dc.$children[0].$children[0].resize();
            })
       }else{
            return false;
       }            
    }
}
$(document).ready(function(){
    $(".ivu-modal-content").prepend("<img class='modalsobig' src='../../i/sgc/channel/tobig.png' onclick='SGC.modalToBig(event,pdp)'>");
    $(".ivu-modal-content").append("<img class='modalreduction' src='../../i/sgc/channel/tosmall.png' onclick='SGC.modalToSmall(event,pdp)'>");
    
})

//SGCTranschannel.init();