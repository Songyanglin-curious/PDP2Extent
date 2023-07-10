
//this.devtype = "主变压器";
this.lstFiles = [];
this.getDataArg = function () {
    switch (this.devtype) {
        case "变压器": return "Trans";
        case "断路器": return "Breaker";
        case "隔离开关": return "Switch";
        case "电容器": return "Capacitor";
        case "电流互感器": return "Current";
        case "电压互感器": return "pt";
        case "组合电器": return "Combined";
        case "电抗器": return "Reactor";
        case "避雷器": return "Lightning";
        case "母线": return "Generatrix";
    }
}
this.getFiles = function () {
    switch (this.devtype) {
        case "变压器":
            return [
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "lqfs", colname: "冷却方式" }, styles: { width:"50%" } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "capacity", colname: "额定容量",suf:"MVA" }, styles: { width: "50%",  } },
            ];
        case "断路器":
            return [
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "jgxs", colname: "结构形式" }, styles: { width: "34%", } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "czjg", colname: "操作机构型式" }, styles: { width: "33%",  } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "mhjz", colname: "灭弧介质" }, styles: { width: "34%",  } },
            ];
        case "隔离开关":
            return [
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "jgxs", colname: "机构型式" }, styles: { width: "50%", } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "czxs", colname: "操作形式" }, styles: { width: "50%",  } },
            ];
        case "电容器":
            return [
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "jyjz", colname: "绝缘介质" }, styles: { width: "50%", } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "nbbhfs", colname: "电容器组内部保护方式" }, styles: { width: "50%",  } },
            ];
        case "电流互感器":
            return [
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "jgxs", colname: "结构型式" }, styles: { width: "34%", } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "jylx", colname: "绝缘类型" }, styles: { width: "33%",  } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "mfxs", colname: "密封型式" }, styles: { width: "33%",  } },
            ];
        case "电压互感器":
            return [
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "jyjz", colname: "绝缘介质" }, styles: { width: "34%", } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "jgxs", colname: "机构型式" }, styles: { width: "33%",  } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "txjg", colname: "铁芯结构" }, styles: { width: "33%",  } },
            ];
        case "组合电器":
            return [
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "zhlx", colname: "类型" }, styles: { width: "50%", } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "jcxfs", colname: "进出线方式" }, styles: { width: "50%",  } },
            ];
        case "电抗器":
            return [
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "lqfs", colname: "冷却方式" }, styles: { width: "34%", } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "jyjz", colname: "绝缘介质" }, styles: { width: "33%",  } },
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "dcjg", colname: "导磁结构" }, styles: { width: "34%", } },
                
            ];
        case "避雷器": return [
            { file: "sc_sbzc_devdetail_column3d", args: { lst: this.lst, col: "mxjs", colname: "每项节数" }, styles: { width: "50%", } },
        ];
        case "母线":
            return [
                { file: "sc_sbzc_devdetail_pie3d", args: { lst: this.lst, col: "jgxs", colname: "机构型式" }, styles: { width: "50%", } },
                { file: "sc_sbzc_devdetail_pie2d", args: { lst: this.lst, col: "azfs", colname: "安装方式" }, styles: { width: "50%",  } },
            ];
    }
}
this.getModelSrc = function () {
    /*变压器：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000030722744&staid=baoding
断路器：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000030343200&staid=baoding
隔离开关：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000031839589&staid=baoding
电抗器：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000031838947&staid=baoding
电容器：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000030367076&staid=baoding
电流互感器：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000030726250&staid=baoding
电压互感器：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000030722776&staid=baoding
避雷器：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000030722740&staid=baoding
母线：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000031839716&staid=baoding
组合电器：http://10.15.5.101:6014/yuntuhtml/stadevshow.html?devid=04M72000030343203&staid=baoding
    */
    switch (this.devtype) {
        case "变压器": return "/yuntuhtml/stadevshow.html?devid=bianyaqi&staid=dev"; //return "/yuntuhtml/stadevshow.html?devid=04M72000030722744&staid=baoding";
        case "断路器": return "/yuntuhtml/stadevshow.html?devid=04M72000030343200&staid=baoding";
        case "隔离开关": return "/yuntuhtml/stadevshow.html?devid=04M72000031839589&staid=baoding";
        case "电容器": return "/yuntuhtml/stadevshow.html?devid=04M72000030367076&staid=baoding";
        case "电流互感器": return "/yuntuhtml/stadevshow.html?devid=04M72000030726250&staid=baoding";
        case "电压互感器": return "/yuntuhtml/stadevshow.html?devid=04M72000030722776&staid=baoding";
        case "组合电器": return "/yuntuhtml/stadevshow.html?devid=04M72000030343203&staid=baoding";
        case "电抗器": return "/yuntuhtml/stadevshow.html?devid=04M72000031838947&staid=baoding";
        case "避雷器": return "/yuntuhtml/stadevshow.html?devid=04M72000030722740&staid=baoding";
        case "母线": return "/yuntuhtml/stadevshow.html?devid=04M72000031839716&staid=baoding";
    }
}
this.hasCapacity = function () {
    if (this.devtype == "变压器")
        return true;
    if (this.devtype == "电抗器")
        return true;
    return false;
}
this.setData = function (lst) {
    var filterLst = []
    var ids = [];
    for(var i = 0 ; i < lst.length ; i++){
        var item = lst[i];
        if(ids.includes(item.id))continue;
        ids.push(item.id);
        filterLst.push(item);
    }
    this.lst = filterLst;        
    this.argsHeader = { lst: filterLst, devtype: this.devtype, havecapacity: this.hasCapacity(), modelsrc:this.getModelSrc() };
    this.argsDefault = { lst: filterLst, devtype: this.devtype ,ismainpage:false};
    var files = this.getFiles();
    var count = files.length;
    var w = parseInt(100 / count) + "%";
    for (var i = 0; i < count; i++) {
        if (i == 0)
            files[i].styles = { width: files[i].styles.width, };
        else
            files[i].styles = { width: w,  };
    }
    this.lstFiles = files;
}
this.setData([]);
this.loadData = function () {
    var vm = this;
    PDP.load("sc/sbzc:DeviceDetail/"+this.getDataArg(), { type: this.devtype }, function (ret) {
        if (!ret.check("获取设备数据", true)) return;
        vm.setData(ret.value);
    });
}
