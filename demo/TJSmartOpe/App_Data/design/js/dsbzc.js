{//tobig开始
    this.m = null;
    this.maxBlock = function() {
    if (this.m) {
    this.m.restore();
    this.m = null;
    } else
    this.m = Ysh.Web.maxElement(this.$el);
    this.resize();
    }
}//tobig结束
{//lineleft开始
    var vm = this;
    this.contentstyle = {'display':'flex'};
    Ysh.Vue.addHandle(this, "resize", function () {
        var hAll = $(this.$el).height();
        var hIf = $(this.$refs.divbottom).height();
        this.hTbl = Math.max(hAll - hIf, 400);
        vm.$nextTick(function () {
            vm.$refs.hchart.resize();
            vm.$refs.hchart2.resize();
            });
        
    },true);
    
    this.showTimeData = function(value){
        ProjectSGC.Statistics.addUseTime(value,"time");
        var listold = value.sort(function(x,y){return y.age-x.age}).slice(0,5);
        var listnew = value.sort(function(x,y){return x.age-y.age}).slice(0,5);
        this.listnew = ProjectShanxi.DicttoArray(listnew);
        this.listold = ProjectShanxi.DicttoArray(listold);
        var o = ProjectSGC.Statistics.count(value,
            function(item) {
                 if (item.age < 5 & item.age > 0 ) return '小于五年';
                 if (item.age < 10) return '5-10年';
                 if (item.age < 20) return '10-20年';
                 return '大于20年'; 
        });
        o = ProjectShanxi.Array.toDict(o,0)
        this.names = ['小于五年','5-10年', '10-20年', '大于20年' ];
        var data = [];
        for(var i = 0; i < this.names.length; i++){
            data.push(o[this.names[i]][1]||0);
        }
        data.push(eval(data.join("+")));
        this.list = data;
        this.optionyunxingyear = ProjectShanxi.Curve.getBar2DOption( [['线路数量',this.list,'#4b93dd']] , this.names );
        
    }
    this.showCountData = function(value){
        var o1 = ProjectSGC.Statistics.count(value,function(item) {
            if (item.voltage.includes('±') || item.voltage.includes('直流') ) return '直流';
            if (item.voltage == '1000kV') return '1000kV';
            if (item.voltage == '500kV') return '500kV';
        });
        o1 = ProjectShanxi.Array.toDict(o1,0)
        var volnames = ['1000kV','500kV', '直流'];
        var colors = ['#fff390','#6ed7ac','#4b93dd'];
        var datalist = [];
        for(var i = 0; i < volnames.length; i++){
            if(o1[volnames[i]])
            var v = o1[volnames[i]][1];
            else
            var v = 0;
            datalist.push([ volnames[i], v , colors[i] ]);
        }
        
          var html = '<span class="nametext">线路总数量</span>'
          +'<span class="numtext">' + eval(Ysh.Array.col(datalist,1).join('+')) + '条</span><span class="nametext">, 其中</span>';
          for(var i = 0; i < datalist.length; i++){
             var r = datalist[i];
             html+=('<span class="nametext">'+r[0]+'</span><span class="numtext">'+r[1]+'条'+(i==datalist.length - 1?'。':'，')+'</span>')
          }
          this.$nextTick(function(){
            document.getElementById('divhtml').innerHTML=html;
          })
          
        this.optioncount = ProjectShanxi.Curve.getPie3DOption(['线路数量',datalist]);
    }
    this.refresh = function(){
        PDP.load("sc/sbzc:GetLines", {}, ret => {
            if (!ret.check("获取线路数据", true)) return;
            var arr = ret.value;
            vm.showTimeData(arr);
            vm.showCountData(arr);
            vm.$nextTick(function () {
                vm.resize();
                
            });
        });
        
       
    }
}//lineleft结束
{//lineright开始
    var vm = this;
    this.contentstyle = {'display':'flex'};
    Ysh.Vue.addHandle(this, "resize", function () {
        var hAll = $(this.$el).height();
        var hIf = $(this.$refs.divbottom).height();
        this.hTbl = Math.max(hAll - hIf , 400);
        /*vm.$nextTick(function () {
            vm.$refs.hchart.resize();
            });*/
    },true);
    
    this.showData = function(value){
        var listold = value.sort(function(x,y){return y.length-x.length}).slice(0,5);
        var listnew = value.sort(function(x,y){return x.length-y.length}).slice(0,5);
        this.listnew = ProjectShanxi.DicttoArray(listnew);
        this.listold = ProjectShanxi.DicttoArray(listold);
        this.names = ['小于50公里','50-100公里', '100-150公里', '150-200公里','大于200公里' ];
        var o = ProjectSGC.Statistics.count(value,
            function(item) {
                 if (item.length < 50 & item.length > 0 ) return vm.names[0];
                 if (item.length < 100) return vm.names[1];
                 if (item.length < 150) return vm.names[2];
                 if (item.length < 200) return vm.names[3];
                 return vm.names[4]; 
        });
        o = ProjectShanxi.Array.toDict(o,0)
        
        var data = [];
        for(var i = 0; i < this.names.length; i++){
            if(!o[this.names[i]])
            var num = 0;
            else 
            var num = o[this.names[i]][1];
            data.push(num);
        }
        data.push(eval(data.join("+")));
        this.list = data;
        this.optionlength = ProjectShanxi.Curve.getBar3DOption( [['线路数量',this.list.slice(0,this.list.length-1),'#6ed7ac']] , this.names );
        
    }
    
    this.refresh = function(){
        PDP.load("sc/sbzc:GetLines", {}, ret => {
            if (!ret.check("获取线路数据", true)) return;
            var arr = ret.value;
            vm.showData(arr);
            vm.$nextTick(function () {
                vm.resize();
                
            });
        });
       
    }
}//lineright结束
{//staywdw开始
    var vm = this;
    this.showData = function(value , value_sc){
        var stationlist = ProjectShanxi.DicttoArray(value_sc);
        var arr = [];
        var names_sc = Ysh.Array.col(stationlist,4);
        for(var i = 0; i < value.length; i++){
            var r = value[i];
            if(!names_sc.includes(r.id))
            continue;
            arr.push(r);
        }
        var list = ProjectSGC.Statistics.count(arr,"companyname");
        var names = Ysh.Array.col(list,0);
        var data = Ysh.Array.col(list,1);

        this.option = this.optionlength = ProjectShanxi.Curve.getColumn3DOption( [['数量',data,'#4b93dd']] , names );
     }
     this.refresh = function(){
        PDP.load("sc/sbzc:GetStationYwdw", {}, ret => {
            if (!ret.check("获取厂站单位数据", true)) return;
            PDP.load("sc/sbzc:GetStations", {}, ret1 => {
                if (!ret1.check("获取厂站数据", true)) return;
                    vm.showData(ret.value,ret1.value);
            });
        });
     }
}//staywdw结束
{//devcount开始
    var vm = this;
    Ysh.Vue.addHandle(this, "resize", function () {
        var hAll = $(this.$el).height();
        this.hchart = Math.max((hAll -this.hTbl - 52), 300);
        this.$nextTick(function () {
            //this.$refs.hchart.resize();
        });
    },true);

    
    this.contentstyle = {'display':'flex'};
    
    this.showData = function(value){
        var o = {
            '1000kV':{},
            '500kV':{},
            '直流':{},
            '总计':{},
        }
        this.types = [];
        for(var i = 0; i < value.length; i++){
            var r = value[i];
            if(!ProjectShanxi.devtypes.includes(r.type))
            continue;
            var volobject = {};
            if(r.voltage=='交流1000kV')
            volobject = o['1000kV'];
            else if(r.voltage=='交流500kV')
            volobject = o['500kV'];
            else if(r.voltage.indexOf('直流') != '-1')
            volobject = o['直流'];
            else
            continue;
            if(!this.types.includes(r.type)){
                this.types.push(r.type);
                o['总计'][r.type] = 1;
            }else{
                o['总计'][r.type]++;
            }
            if(volobject[r.type]>0)
            volobject[r.type]++;
            else
            volobject[r.type] = 1;
        }
        this.types = ProjectShanxi.devtypes;
        var list = [];
        for(v in o){
            var arr = [];
            arr.push(v);
            for(var j = 0; j < this.types.length; j++){
                var type = this.types[j];
                arr.push(o[v][type]||0);
            }
            arr.push(eval(arr.slice(1,arr.length).join('+')));
            list.push(arr);
        }
        this.list = list;
        var colors=['#fff390','#6ed7ac','#4b93dd'];
        var data = [];
        for(var i = 0; i < this.list.length-1; i++){
           var row = this.list[i];
           data.push([row[0],row.slice(1,row.length-1),colors[i]]);
        }
        this.option = ProjectShanxi.Curve.getBar2DOption( data , this.types );

        this.resize();
    }
    this.refresh = function(){
        PDP.load("sc/sbzc:GetDevices", {}, ret => {
            if (!ret.check("获取设备数据", true)) return;
                vm.showData(ret.value);
        });
     }
}//devcount结束
{//sbzctop开始
   /* Ysh.Vue.addHandle(this, "resize", function () {
        var hAll = this.$el.clientHeight;//$(this.$el).height();
        var hDiscribe = this.$refs.divtop.offsetHeight;//$(this.$refs.divtop).height()
        this.hc = (hAll - 280 - 52 - hDiscribe) + 'px';
        //this.$nextTick(function () {
        //    this.$refs.hchart.resize();
        //});
    },true);*/
    var vm = this;
    this.openmoredata = function () {
        var vmain = ProjectSGC.Global.getMainObject("vMain");
        var f = {  };
        if (this.seldevtype != "ALL")
            f.filter = { type: this.seldevtype };
            f.col = ['undue','due'].includes(this.selvaluetype)?'wctzy':this.selvaluetype;
            f.order = this.selvaluetype=='due'?(this.selsorttype=='asc'?'desc':'asc'):this.selsorttype;
        vMain.gotoApp("zichansearch", f );
    }
    this.refresh = function () {
        var type = [];
        var types = [['ALL', '全部']];
        var data = [];
        var list = [];
        if (this.dssbzc.length == 0)
            return;
        for (var i = 0; i < this.dssbzc.length; i++) {
            var row = this.dssbzc[i];
            var diff_day = Ysh.Time.diff('d', new Date(), Ysh.Time.add('m', 1, row.wctzy)) + 1;
            row['undue'] = diff_day;
            row['due'] = -diff_day;
            var t = row.devtype;
            if (!type.includes(t)) {
                type.push(t);
                types.push([t, t]);
            }
            if (this.seldevtype == 'ALL' || t == this.seldevtype) {
                if ((this.selvaluetype == 'undue' || this.selvaluetype == 'due') && row[this.selvaluetype] < 0)
                    continue;
                list.push(row);
                data.push([row.staname + row.devname, parseFloat(row[this.selvaluetype])]);
            }
        }
        if (this.selsorttype == 'desc') {
            data.sort(function (x, y) { return y[1] - x[1] });
            list.sort(function (x, y) { return y[vm.selvaluetype] - x[vm.selvaluetype] });
        } else {
            data.sort(function (x, y) { return x[1] - y[1] });
            list.sort(function (x, y) { return x[vm.selvaluetype] - y[vm.selvaluetype] });
        }
        var dssbzc = list.slice(0, 4);
        var data1 = data.slice(0, 4);
        this.devtypes = types;
        this.list = dssbzc.map(function (row) { return [row.devid, row.devname, row.staname, row.initAsset, row.netAsset, row.salvageAsset, row.accumulatedAepreciation, row.depreciableYear, row['wctzy'], row['undue'], row['due']]; })


        this.option = ProjectShanxi.Curve.getBar3DOption([['', Ysh.Array.col(data1, 1), '#c792d9']], Ysh.Array.col(data1, 0));
        //this.resize();
    }
}//sbzctop结束
