{//station_defect开始
    var vm = this;

    this.doSearch = function (key, starttime, endtime, needOther) {
        vm.startTime = starttime;
        vm.endTime = endtime;
        vm.getDefect();
    }
    this.getDefect = function () {
        //var start = Ysh.Time.toString(vm.startTime,'111000')+ " 00:00:00";
        //var end = Ysh.Time.toString(vm.endTime,'111000')+ " 00:00:00";
        PDP.load("sc/deviceDefect:getDefectInfo", { startTime: vm.startTime, endTime: vm.endTime }, function (res) {
            if (res.check("获取设备缺陷数据", true)) {
                var resData = res.value
                vm.dsDefect = resData;
                vm.dsShowDefect = resData;
                //获取设备类型
                vm.getFilterData();
                vm.showIcons();
                vm.filterTable();
                // 
                // vm.showDefecIcon()
            }
        })
    }
    this.getDefectBySeverity = function () {
        vm.filterTable();
    }
    this.getDefectByRemoveDefect = function () {
        vm.filterTable();
    }
    this.sortByKey = function (arr, key, order) {
        // 处理无效参数情况
        if (!Array.isArray(arr) || key == undefined || !Array.isArray(order)) {
            return arr;
        }

        // 排序
        arr.sort((a, b) => {
            const indexA = order.indexOf(a[key]);
            const indexB = order.indexOf(b[key]);

            // 处理不在 order 中的情况
            if (indexA === -1) {
                return 1;
            }
            if (indexB === -1) {
                return -1;
            }

            // 处理在 order 中的情况
            return indexA - indexB;
        });

        return arr;
    }
    this.getFilterData = function () {
        var deviceTypeObj = {};//设备类型
        var dsSeverityObj = {};//严重程度
        var removeDefectObj = {};//消缺
        vm.dsDeviceType = [["_ALL_", "全部"]];
        vm.dsSeverity = [["_ALL_", "全部"]];
        vm.dsRemoveDefect = [["_ALL_", "全部"]];
        vm.dsDefect.forEach(item => {
            if (item.DeviceType && !deviceTypeObj[item.DeviceType]) {
                deviceTypeObj[item.DeviceType] = true
                vm.dsDeviceType.push([item.DeviceType, item.DeviceType])
            }
            if (item.DefectLevel && !dsSeverityObj[item.DefectLevel]) {
                dsSeverityObj[item.DefectLevel] = true
                vm.dsSeverity.push([item.DefectLevel, item.DefectLevel])
            }
            if (item.RemoveDefectState && !removeDefectObj[item.RemoveDefectState]) {
                removeDefectObj[item.RemoveDefectState] = true
                vm.dsRemoveDefect.push([item.RemoveDefectState, item.RemoveDefectState])
            }
        })
        vm.dsSeverity = this.sortByKey(vm.dsSeverity, 0, ["_ALL_", "危急", "严重", "一般",])

    }
    // this.getDeviceType = function () {
    //     var deviceType = [];
    //     vm.dsDefect.forEach(item => {
    //         if (!deviceType.includes(item.DeviceType)) {
    //             deviceType.push(item.DeviceType)
    //         }
    //     })
    //     vm.dsDeviceType = [["_ALL_", "全部"]];
    //     deviceType.forEach(item => {
    //         vm.dsDeviceType.push([item, item])
    //     })
    // }
    this.showAllDeviceType = function () {
        if (!vm.isShowAllDevice) {
            vm.hiddenTabs = "hidden-part-tabs";
        } else {
            vm.hiddenTabs = "";
        }
        vm.resize();
    }
    this.getDefectByDeviceType = function () {
        vm.filterTable();
    }
    this.doShowIcons = function (lst) {

        var defectLevel = ["已消缺", "一般", "严重", "危急"]
        // 获取每个变电站的最高缺陷等级
        var stationLevel = {}
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            var index = defectLevel.indexOf(row.DefectLevel);
            if (row.RemoveDefectState == "是") {
                index = 0;
            }
            var id = row.DCloudId;
            if (!stationLevel[id]) {
                stationLevel[id] = index;
            } else if (index > stationLevel[id]) {
                stationLevel[id] = index;
            }
        }
        var iconByLevel = {
            '3': "/i/sgc/icon/defect/station_danger.png",
            '2': "/i/sgc/icon/defect/station_serious.png",
            '1': "/i/sgc/icon/defect/station_normal.png",
            '0': "/i/sgc/icon/defect/safe.png",
        }
        // 分组
        var arr = [[], [], [], []];
        for (var key in stationLevel) {
            var index = stationLevel[key];
            arr[index].push({ stationid: key })
        }
        // 显示图标
        arr.forEach((item, index) => {
            if (item.length > 0) {
                ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { type: "defect", paddingtop: -10, width: 20, height: 20, images: { imgUrl: iconByLevel[index], width: 20, height: 20 }, locateData: item } });
            }
        })
        return
        var arr1 = [];
        var arr2 = [];
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            ((row.RemoveDefectState == "是") ? arr2 : arr1).addSkipSame({ defid: row.DefectNum, stationid: row.DCloudId });
        }
        if (arr1.length > 0)
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { type: "defect", paddingtop: -10, width: 20, height: 20, images: { imgUrl: "/i/sgc/icon/defect/defect1.png" }, locateData: arr1 } });
        if (arr2.length > 0)
            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "showImageIcon", selstate: true, data: { type: "defect", paddingtop: -10, width: 20, height: 20, images: { imgUrl: "/i/sgc/icon/defect/defect2.png" }, locateData: arr2 } });
    }
    this.showIcons = function () {
        ProjectSGC.Map.hideIcon("defect");
        var lst = this.dsShowDefect;
        this.doShowIcons(lst);
    }
    this.filterTable = function () {
        TableHandel.filterData(vm, "dsShowDefect", vm.dsDefect,
            [{ dataName: 'selSeverity', allSignal: '_ALL_', col: "Severity" },
            { dataName: 'selRemoveDefect', allSignal: '_ALL_', col: "RemoveDefectState" },
            { dataName: 'selDeviceType', allSignal: '_ALL_', col: "DeviceType" }]);
        var result = [];
        vm.dsShowDefect.forEach(item => {
            var keyWordString = vm.getKeyWordString(item)
            if (keyWordString.includes(vm.searchKeyWord)) {
                result.push(item)
            }
        })
        vm.dsShowDefect = result;
        this.showIcons();
    }
    this.searchByKeyWord = function () {
        vm.filterTable();
    }
    this.getKeyWordString = function (item) {
        var keyWordColumn = ["StationLine", "DefectDeviceName", "DefectState", "DefectDescribe", "SpanDeadline"];
        var keyWordString = "";
        keyWordColumn.forEach(key => {
            keyWordString += item[key] + '|'
        })
        return keyWordString;
    }

    this.showDefectDetail = function (row) {
        // var vMain = ProjectSGC.Global.getMainObject("vMain")
        // vMain.gotoApp("device_defect_deatil",{ id: row.DefectNum })
        vm.dynArgs = { id: row.DefectNum };

        vm.modalTitle = row.DefectDeviceName;
        var title = `${row.StationLine}-${row.DefectDeviceName}`;
        // vm.isShowModal = true;
        var vMain = ProjectSGC.Global.getMainObject("vMain");
        vm.modal = vMain.gotoApp("station_defect_detail", { id: row.DefectNum, name: title });
    }
    this.locateDefect = function (row) {
        var sl = row.StationLine;
        if (!sl) return;
        //this.doShowIcons([row]);
        this.locateIndex = (this.locateIndex || 100) + 1;
        ProjectSGC.Map.postMessage({ "eventType": "menuope", "menuname": "UpdateImageTrackData", "selstate": 1, "data": { "selData": { "type": "defect", "defid": row.DefectNum }, "newInfo": { "z-index": this.locateIndex } } });
        if (sl.indexOf("线") > 0) {
            PDP.load("sgc/c:cloud/line/GetIdByName", { name: sl }, function (ret) {
                if (!ret.check("获取线路id", true)) return;
                if (ret.value.length == 0) { alert("未找到对应的调控云ID"); return; }
                ProjectSGC.Map.locate("LINE", ret.value[0].id);
            });
        } else {
            var idx = sl.indexOf("kV");
            if (idx > 0) sl = sl.substr(idx + 2);
            if (sl.endsWith("站")) sl = sl.substr(0, sl.length - 1);
            PDP.load("sgc/c:cloud/station/GetIdByName", { name: sl }, function (ret) {
                if (!ret.check("获取厂站id", true)) return;
                if (ret.value.length == 0) { alert("未找到对应的调控云ID"); return; }
                ProjectSGC.Map.locate("STATION", ret.value[0].id);
            });
        }
    }
    this.rangeText = function (v) {
        if (v == "是") return "已消缺";
        if (v == "否") return "未消缺";
        return "未知状态";
    }
    this.initPage = function () {
        this.timebuttons = [["thisyear", "今年"], ["lastyear", "去年"]];
        // this.startTime = new Date();
        // this.endTime = Ysh.Time.add("d", 1, new Date());
        this.getDefect();
        this.showAllDeviceType();
    }
    this.initPage();
    this.$watch("dsDeviceType", function (nv, ov) {
        this.$nextTick(function () {
            var tabWidth = vm.$refs.divDeviceTypeWrap.clientWidth;
            var allWidth = 0;
            var childrens = this.$refs.divDeviceType.children;
            for (var i = 0; i < childrens.length; i++) {
                allWidth += childrens[i].offsetWidth;
            }
            if (allWidth > tabWidth) {
                vm.showArrow = true;
            } else {
                vm.showArrow = false;
            }
        });
    });
}//station_defect结束

{//station_defect_detail开始
    var vm = this;

    var titles = [
        "缺陷设备", "设备类型", "变电站",
        "缺陷编号", "缺陷性质", "缺陷所在单位",
        "缺陷状态", "缺陷描述", "缺陷发现时间",
        "是否延期消缺", "距超期时间", "消缺时间",
        "设备编号", "电压等级", "设备型号",
        "设备种类", "生产厂家", "部件",
        "部件种类", "是否家族性缺陷", "站线类型",
        "登记时间", "投运时间", "登记人",
        "发现人", "发现人单位", "发现班组",
        "发现方式", "所属地市", "当前处理人",
        "技术原因", "责任原因", "消缺单位",
        "消缺班组", "消缺人", "遗留问题",
        "验收单位", "验收班组", "验收人",
        "验收时间", "验收意见", "是否已转隐患",
    ];

    var keys = ["DEFECT_DEV", 'DEV_TYPE', 'STATION_LINE',
        'DEFECT_NUM', 'DEFECT_LEVEL', 'DEFECT_BELONG_DEPT',
        'DEFECT_TYPE', 'DEFECT_DESCRIBE', 'DEFECT_FIND_TIME',
        'IS_DEFERRAL_XIAOQUE', 'SPAN_EXPIRE', 'XIAOQUE_TIME',
        'DEV_NUM', 'VOLTAGE_CLASS', 'DEV_MODEL',
        'DEV_CATEGORY', 'MANUFACTURER', 'PART',
        'PART_TYPE', 'IS_FAMILY_DEFECT', 'STATION_OR_LINE',
        'REGISTRANT_TIME', 'START_USE_DAY', 'REGISTRANTER',
        'FINDER', 'FINDER_DEPT', 'FIND_TEAM',
        'FIND_WAY', 'BELONGS_CITY', 'CURRENT_HANDELER',
        'TECHNOLOGY_CAUSE', 'RESPONSIBLE_CAUSE', 'XIAOQUE_DEPT',
        'XIAOQUE_TEAM', 'XIAOQUE_PERSON', 'LEFTOVER_PROBLEM',
        'ACCEPTANCE_DEPT', 'ACCEPTANCE_TEAM', 'ACCEPTANCE_PERSON',
        'ACCEPTANCE_TIME', 'ACCEPTANCE_OPINION', 'IS_HIDDEN_DANGER',
    ];
    this.layoutTitle = {
        0: { title: "设备信息区", rowspan: 5, },
        5: { title: "巡视信息区", rowspan: 4, },
        9: { title: "消缺情况", rowspan: 7, },
        16: { title: "设备信息区", rowspan: 2, },
    }
    this.detailLayout = [
        [{ title: "变电站名称", key: "STATION_LINE", rowspan: 1, colspan: 1 }, { title: "缺陷设备", key: "DEFECT_DEV", rowspan: 1, colspan: 1 }, { title: "缺陷编号", key: "DEFECT_NUM", rowspan: 1, colspan: 1 }],
        [{ title: "设备单位", key: "DEFECT_BELONG_DEPT", rowspan: 1, colspan: 1 }, { title: "电压等级", key: "VOLTAGE_CLASS", rowspan: 1, colspan: 1 }, { title: "设备类型", key: "DEV_TYPE", rowspan: 1, colspan: 1 }],
        [{ title: "生产厂家", key: "MANUFACTURER", rowspan: 1, colspan: 3 }, { title: "设备编码", key: "DEV_NUM", rowspan: 1, colspan: 1 },],
        [{ title: "设备型号", key: "DEV_MODEL", rowspan: 1, colspan: 3 }, { title: "设备种类", key: "DEV_CATEGORY", rowspan: 1, colspan: 1 },],
        [{ title: "投运时间", key: "START_USE_DAY", rowspan: 1, colspan: 1, format: formatTime }, { title: "部件", key: "PART", rowspan: 1, colspan: 1 }, { title: "部件种类", key: "PART_TYPE", rowspan: 1, colspan: 1 }],
        [{ title: "发现人", key: "FINDER", rowspan: 1, colspan: 1 }, { title: "发现人单位", key: "FINDER_DEPT", rowspan: 1, colspan: 1 }, { title: "发现班组", key: "FIND_TEAM", rowspan: 1, colspan: 1 }],
        [{ title: "所属地市", key: "BELONGS_CITY", rowspan: 1, colspan: 1 }, { title: "发现方式", key: "FIND_WAY", rowspan: 1, colspan: 1 }, { title: "缺陷性质", key: "DEFECT_LEVEL", rowspan: 1, colspan: 1 }],
        [{ title: "登记人", key: "REGISTRANTER", rowspan: 1, colspan: 1 }, { title: "登记时间", key: "REGISTRANT_TIME", rowspan: 1, colspan: 1, format: formatTime }, { title: "缺陷描述", key: "DEFECT_DESCRIBE", rowspan: 1, colspan: 1 }],
        [{ title: "是否家族性缺陷", key: "IS_FAMILY_DEFECT", rowspan: 1, colspan: 1 }, { title: "技术原因", key: "TECHNOLOGY_CAUSE", rowspan: 1, colspan: 1 }, { title: "责任原因", key: "RESPONSIBLE_CAUSE", rowspan: 1, colspan: 1 }],
        [{ title: "消缺人", key: "XIAOQUE_PERSON", rowspan: 1, colspan: 5, contentClass: "left-text" }],
        [{ title: "消缺单位", key: "XIAOQUE_DEPT", rowspan: 1, colspan: 1 }, { title: "消缺班组", key: "XIAOQUE_TEAM", rowspan: 1, colspan: 1 }, { title: "当前处理人", key: "CURRENT_HANDELER", rowspan: 1, colspan: 1 }],
        [{ title: "缺陷状态", key: "DEFECT_TYPE", rowspan: 1, colspan: 1, titleClass: "serious-text" }, { title: "消缺时间", key: "XIAOQUE_TIME", rowspan: 1, colspan: 1, format: formatTime }, { title: "是否延期消缺", key: "IS_DEFERRAL_XIAOQUE", rowspan: 1, colspan: 1 }],
        [{ title: "距超期时间", key: "SPAN_EXPIRE", rowspan: 1, colspan: 1, format: formatTime }, { title: "遗留问题", key: "LEFTOVER_PROBLEM", rowspan: 1, colspan: 1 }, { title: "是否已转隐患", key: "IS_HIDDEN_DANGER", rowspan: 1, colspan: 1 }],
        [{ title: "缺陷内容", key: "DEFECT_CONTENT", rowspan: 1, colspan: 5, contentClass: "left-text" },],
        [{ title: "处理结果", key: "HANDEL_RESULT", rowspan: 1, colspan: 5, contentClass: "left-text" },],
        [{ title: "完成情况", key: "COMPLETE_STATE", rowspan: 1, colspan: 5, contentClass: "left-text" },],
        [{ title: "验收单位", key: "ACCEPTANCE_DEPT", rowspan: 1, colspan: 1 }, { title: "验收班组", key: "ACCEPTANCE_TEAM", rowspan: 1, colspan: 1 }, { title: "验收人", key: "ACCEPTANCE_PERSON", rowspan: 1, colspan: 1 }],
        [{ title: "验收时间", key: "ACCEPTANCE_TIME", rowspan: 1, colspan: 1, format: formatTime }, { title: "验收意见", key: "ACCEPTANCE_OPINION", rowspan: 1, colspan: 1 }, { title: "验收结果", key: "ACCEPTANCE_RESULT", rowspan: 1, colspan: 1 },],
    ];
    var contentKeys = ['DEFECT_CONTENT', 'HANDEL_RESULT', 'COMPLETE_STATE'];
    this.getFefectDetail = function () {
        PDP.load("sc/deviceDefect:GetDefectDetail", { defectNum: vm.id }, function (res) {
            if (res.check("获取设备缺陷详细数据", true)) {
                if (res.value.length === 0) return;
                var resData = res.value[0];

                vm.dsInitDefect = resData;
                // vm.getTableData();

            }
        })
    }
    this.getTableData = function () {
        var tableData = [];
        var item = [];
        for (var i = 0; i < titles.length; i++) {

            item.push(titles[i]);
            item.push(vm.dsInitDefect[keys[i]]);
            if ((i + 1) % 3 === 0) {
                tableData.push(item);
                item = [];
            }
        }
        vm.dsDefect = tableData;
    }
    this.initPage = function () {
        vm.getFefectDetail();
    }
    this.initPage();

}//station_defect_detail结束
{//line_defect开始
    var vm = this;
    ProjectSGC.Map.postMessage({ eventType: 'fly', type: 4, data: { position: { "x": -2271381.202004402, "y": 5854620.277088229, "z": 5227676.751797043 }, heading: 0.0041078912920848865, pitch: -1.5700033059638083, roll: 0, duration: 1 } });

    this.doSearch = function (key, starttime, endtime, needOther) {
        vm.startTime = starttime;
        vm.endTime = endtime;
        vm.getDefect();
    }
    this.getDefect = function () {
        PDP.load("sc/deviceDefect:getLineDefectInfo", { startTime: vm.startTime, endTime: vm.endTime }, function (res) {
            if (res.check("获取线路缺陷数据", true)) {
                var resData = res.value
                vm.dsDefect = resData;
                vm.dsShowDefect = resData;
                //获取设备类型
                vm.getFilterData();
                // 过滤数据
                vm.filterTable();
                // 
                vm.getTowerInfo(resData);
            }
        })
    }
    this.getTowerInfo = function (lineInfo) {
        var defectLevel = ['严重缺陷', '危急缺陷']
        // 获取每个变电站的最高缺陷等级
        var acLine = {}
        var dcLine = {}
        var normalLine = []
        var defectLine = []
        var sqls = []
        for (var i = 0; i < lineInfo.length; i++) {
            var row = lineInfo[i];
            var index = defectLevel.indexOf(row.DEFECT_LEVEL);
            if (index === -1) {
                normalLine.push(row)
                continue;
            }
            defectLine.push(row)

            var lineID = row.D_CLOUD_ID
            var towerNo = Number(row.START_TOWER_NAME.slice(1));
            if (isNaN(towerNo)) continue;
            if (row.LINE_NAME.includes("直流")) {
                if (dcLine[lineID] === undefined) {
                    dcLine[lineID] = "";
                }
                dcLine[lineID] += `${towerNo},`
            } else {
                if (acLine[lineID] === undefined) {
                    acLine[lineID] = "";
                }
                acLine[lineID] += `${towerNo},`
            }
        }
        for (var key in acLine) {
            acLine[key] = acLine[key].slice(0, -1);
            sqls.push({ type: "load", xml: "sc/deviceDefect:GetACTowerByLineIDAndNO", args: { lineID: key, towerNo: acLine[key] } })
        }
        for (var key in dcLine) {
            dcLine[key] = dcLine[key].slice(0, -1);
            sqls.push({ type: "load", xml: "sc/deviceDefect:GetACTowerByLineIDAndNO", args: { lineID: key, towerNo: dcLine[key] } })
        }
        PDP.exec(sqls, (res) => {
            if (!res.check("获取杆塔id列表", true)) return
            if (res.value.length === 0) return
            var towerList = [];
            for (var i = 0; i < res.value.length; i++) {
                var row = res.value[i];
                for (var j = 0; j < row.length; j++) {
                    var item = row[j];
                    towerList.push(item)
                }
            }
            function isEquie(a, b) {
                var towerNo = Number(a.START_TOWER_NAME.slice(1));
                if (isNaN(towerNo)) return false
                return a.D_CLOUD_ID == b.lineID && towerNo == b.towerNo
            }

            defectLine = this.matchObjects(defectLine, towerList, isEquie, "towerId", "id")
            vm.dsDefect = normalLine.concat(defectLine);
            vm.dsShowDefect = vm.dsDefect;
            // 过滤数据
            vm.filterTable();
        })

    }
    this.matchObjects = function (aObjects, bObjects, matchKey, akey, bkey) {
        var isFn = typeof matchKey === "function"
        for (var i = 0; i < bObjects.length; i++) {
            var bObj = bObjects[i];
            for (var j = 0; j < aObjects.length; j++) {
                var aObj = aObjects[j];
                if (isFn) {
                    if (matchKey(aObj, bObj)) {
                        aObj[akey] = bObj[bkey];
                        break;
                    }
                } else if (aObj[matchKey] === bObj[matchKey]) {
                    aObj[akey] = bObj[bkey];
                    break;
                }

            }
        }
        return aObjects;
    }
    this.getDefectBySeverity = function () {
        vm.filterTable();
    }
    this.getDefectByRemoveDefect = function () {
        vm.filterTable();
    }
    this.getFilterData = function () {
        var deviceTypeObj = {};
        var dsSeverityObj = {};
        vm.dsDeviceType = [["_ALL_", "全部"]];
        vm.dsSeverity = [["_ALL_", "全部"]];
        vm.dsDefect.forEach(item => {
            if (item.BJZL && !deviceTypeObj[item.BJZL]) {
                deviceTypeObj[item.BJZL] = true
                vm.dsDeviceType.push([item.BJZL, item.BJZL])
            }
            if (item.DEFECT_LEVEL && !dsSeverityObj[item.DEFECT_LEVEL]) {
                dsSeverityObj[item.DEFECT_LEVEL] = true
                vm.dsSeverity.push([item.DEFECT_LEVEL, item.DEFECT_LEVEL])
            }
        })
        this.sortBySeverity(vm.dsSeverity)
    }
    this.sortBySeverity = function (arr) {
        // 定义危急缺陷、严重缺陷、一般缺陷的权重
        const levelRank = { '_ALL_': 4, '危急缺陷': 3, '严重缺陷': 2, '一般缺陷': 1 };
        // 调用数组的sort()方法进行排序
        arr.sort(function (a, b) {
            var bn = levelRank[b[0]] ? levelRank[b[0]] : 0
            var an = levelRank[a[0]] ? levelRank[a[0]] : 0
            return bn - an;
        });
        return arr;
    }
    this.showAllDeviceType = function () {
        if (!vm.isShowAllDevice) {
            vm.hiddenTabs = "hidden-part-tabs";
        } else {
            vm.hiddenTabs = "";
        }
        vm.resize();
    }
    this.getDefectByDeviceType = function () {
        vm.filterTable();
    }
    this.doShowIcons = function (lst) {
        var defectLevel = ['严重缺陷', '危急缺陷']
        // 获取每个变电站的最高缺陷等级
        /**
         * {
         * "严重缺陷":{}
         * }
         */
        var lineLevel = {
            "严重缺陷": {},
            "危急缺陷": {}
        }
        for (var i = 0; i < lst.length; i++) {
            var row = lst[i];
            var index = defectLevel.indexOf(row.DEFECT_LEVEL);
            if (index === -1) continue
            if (!row.towerId) continue
            var key = row.DEFECT_LEVEL;
            var lineId = row.D_CLOUD_ID;
            var id = row.ID
            if (!lineLevel[key][lineId]) {
                lineLevel[key][lineId] = []
            }
            lineLevel[key][lineId] ? lineLevel[key][lineId].push({ lineid: row.D_CLOUD_ID, towerid: row.towerId, data: { tableDefectId: id } }) : console.log("没有lineLevel[key][lineId]", key, lineId)
        }
        var iconByLevel = ["/i/sgc/icon/defect/line_serious.png", "/i/sgc/icon/defect/line_danger.png"]
        // '2': "/i/sgc/icon/defect/line_danger.png",
        // '1': "/i/sgc/icon/defect/line_serious.png",
        // '0': "/i/sgc/icon/defect/line_normal.png",
        // // '-1': "/i/sgc/icon/defect/safe.png",

        // 分组
        var arr = [];
        for (var key in lineLevel) {
            var index = defectLevel.indexOf(key);
            arr[index] = lineLevel[key]
        }

        // 显示图标
        arr.forEach((item, index) => {
            var level = 5 + index
            for (var lineKey in item) {
                var line = item[lineKey];
                if (!line) continue
                ProjectSGC.Map.postMessage({
                    eventType: "menuope", menuname: "showImageIcon", selstate: true, data: {
                        type: "defect", paddingtop: -10, width: 20, height: 20, z_index: level,
                        images: { imgUrl: iconByLevel[index], width: 20, height: 20, }, locateData: line
                    }
                });
            }


        })
    }
    this.showIcons = function () {
        //清除杆塔
        ProjectSGC.Map.hideIcon("defect");
        var lst = this.dsShowDefect;
        this.doShowIcons(lst);
    }

    this.filterTable = function () {
        TableHandel.filterData(vm, "dsShowDefect", vm.dsDefect,
            [{ dataName: 'selSeverity', allSignal: '_ALL_', col: "DEFECT_LEVEL" },
            { dataName: 'selDeviceType', allSignal: '_ALL_', col: "BJZL" }]);
        var result = [];
        vm.dsShowDefect.forEach(item => {
            var keyWordString = vm.getKeyWordString(item)
            if (keyWordString.includes(vm.searchKeyWord)) {
                result.push(item)
            }
        })
        vm.dsShowDefect = result;
        window.setTimeout(function () { vm.showIcons() }, 100)
        // this.showIcons();
    }
    this.searchByKeyWord = function () {
        vm.filterTable();
    }
    this.getKeyWordString = function (item) {
        var keyWordColumn = ['FIND_DAY', 'LINE_NAME', 'START_TOWER_NAME', 'DEFECT_LEVEL', 'BJ', 'DEFECT_DESCRIBE', 'BJZL', 'DCloudId'];
        var keyWordString = "";
        keyWordColumn.forEach(key => {
            keyWordString += item[key] + '|'
        })
        return keyWordString;
    }

    this.showDefectDetail = function (row) {
        // var vMain = ProjectSGC.Global.getMainObject("vMain")
        // vMain.gotoApp("device_defect_deatil",{ id: row.DefectNum })
        var lineID = row.D_CLOUD_ID
        var towerNo = Number(row.START_TOWER_NAME.slice(1));
        var towerName = row.START_TOWER_NAME
        vm.dynArgs = { id: row.ID, lineid: lineID, towername: towerName };

        vm.modalTitle = row.LINE_NAME;
        // vm.isShowModal = true;
        var vMain = ProjectSGC.Global.getMainObject("vMain");
        // vMain.destroyFloatPage(owg.matchPage);
        // var top = owg.top;
        var title = `${row.LINE_NAME}-${row.START_TOWER_NAME}-${row.BJ} `
        vm.modal = vMain.gotoApp("line_defect_detail", { id: row.ID, name: title })
        return
        if (vm.modal) {
            vMain.destroyFloatPage(vm.modal)
            vm.modal = null;
        } else {
            // vm.modal = vMain.floatPage("sc_device_defect_line_deatil", {
            //     x: '370px', y: '50px', id: row.ID,
            // });
            vm.modal = vMain.gotoApp("line_defect_more", { id: row.ID, })
        }

    }
    this.locateDefect = function (row) {
        var lineName = row.LINE_NAME;
        // if (!lineName) return;
        var lineID = row.D_CLOUD_ID
        var towerName = row.START_TOWER_NAME
        var towerNo = Number(row.START_TOWER_NAME.slice(1));
        //this.doShowIcons([row]);
        this.showTower(lineID)
        this.getMapDefectImg(lineID, towerName, towerNo, lineName, row)



        // ProjectSGC.Map.postMessage({ "eventType": "menuope", "menuname": "UpdateImageTrackData", "selstate": 1, "data": { "selData": { "type": "defect", "defid": row.DefectNum }, "newInfo": { "z-index": this.locateIndex } } });

    }
    this.showTower = function (lineID) {
        ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'showTowerLine', data: { clear: true } });
        ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'showTowerLine', data: { lineid: lineID } });
    }

    this.checkImgExist = function (src, successCallback, errorCallback) {
        var img = new Image()
        img.src = src
        img.onload = function () {
            successCallback(src);
        }
        img.onerror = function () {
            errorCallback();
        }

    }
    this.getMapDefectImg = function (lineID, towerName, towerNo, lineName, row) {
        var imgName = row.VOL + "kV" + row.LINE_NAME + row.START_TOWER_NAME + "塔" + row.DEFECT_DETAIL + ".jpg";
        var imgArr = [{ url: "/i/sgc/shengchan/linedefect/" + encodeURIComponent(imgName) }]
        this.checkImgExist(imgArr[0].url, () => { vm.showImgAndLocateTower(lineID, towerNo, lineName, imgArr) }, () => {
            vm.locateTowerAndClearImg(lineID, towerNo, lineName, imgArr)
        })
        // vm.showImgAndLocateTower(lineID, towerNo, lineName, imgArr)
        // PDP.load("sc/deviceDefect:GetLineDefectImg", { lineID: lineID, towerName: towerName }, function (res) {
        //     if (!res.check("获取线路缺陷详细数据图片", true)) return
        //     var imgArr = res.value;
        //     vm.showImgAndLocateTower(lineID, towerNo, lineName, imgArr)
        //     // vm.defectImgs = resData;
        //     // vm.dsInitDefect = resData;
        //     // vm.getTableData();
        // })
    }
    this.showImgAndLocateTower = function (lineID, towerNo, lineName, imgArr) {
        var sql = ""
        if (lineName.indexOf("直流") > 0) {
            //直流
            sql = "sgc/c:GetDCTowerByLineIDAndNO"
        } else {
            //交流
            sql = "sgc/c:GetACTowerByLineIDAndNO"
        }

        PDP.load(sql, { lineID: lineID, towerNo: towerNo }, function (ret) {
            if (!ret.check("获取杆塔id", true)) return;
            if (ret.value.length == 0) { alert("未找到对应的调控云ID"); return; }
            var data = ret.value[0]
            // 定位
            ProjectSGC.Map.postMessage({ locateType: 10, locateItem: { towerid: data.id } });
            // 
            var pageID = "sc_device_defect_imgs_0"
            if (window.parent.floatDataInst.getPositionDiv(pageID)) {
                window.parent.floatDataInst.getPositionDiv(pageID).attrs = { imgs: imgArr }
            } else {
                var floatImg = vMain.floatPage("sc_device_defect_imgs", { x: 100, y: 100, imgs: imgArr })
                window.parent.floatDataInst.registerPositionDiv(pageID, floatImg)
            }

            ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "setDivPosition", selstate: true, data: { longitude: data.longitude, latitude: data.latitude, locateData: { id: pageID } } });

        });
    }
    this.locateTowerAndClearImg = function (lineID, towerNo, lineName, imgArr) {
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "setDivPosition", selstate: false, data: {} });
        vMain.destroyFloatPage(window.parent.floatDataInst.getPositionDiv("sc_device_defect_imgs_0"));
        window.parent.floatDataInst.destroyPositionDiv("sc_device_defect_imgs_0");
        var sql = ""
        if (lineName.indexOf("直流") > 0) {
            //直流
            sql = "sgc/c:GetDCTowerByLineIDAndNO"
        } else {
            //交流
            sql = "sgc/c:GetACTowerByLineIDAndNO"
        }

        PDP.load(sql, { lineID: lineID, towerNo: towerNo }, function (ret) {
            if (!ret.check("获取杆塔id", true)) return;
            if (ret.value.length == 0) { alert("未找到对应的调控云ID"); return; }
            var data = ret.value[0]
            // 定位
            ProjectSGC.Map.postMessage({ locateType: 10, locateItem: { towerid: data.id } });
        });
    }
    this.rangeText = function (v) {
        return v;
        // if (v == "是") return "已消缺";
        // if (v == "否") return "未消缺";
        // return "未知状态";
    }
    this.initPage = function () {
        this.timebuttons = [["thisyear", "今年"], ["lastyear", "去年"]];
        // this.startTime = new Date();
        // this.endTime = Ysh.Time.add("d", 1, new Date());
        this.getDefect();
        this.showAllDeviceType();
    }

    this.initPage();
    this.$watch("dsDeviceType", function (nv, ov) {
        this.$nextTick(function () {
            var tabWidth = vm.$refs.divDeviceTypeWrap.clientWidth;
            var allWidth = 0;
            var childrens = this.$refs.divDeviceType.children;
            for (var i = 0; i < childrens.length; i++) {
                allWidth += childrens[i].offsetWidth;
            }
            if (allWidth > tabWidth) {
                vm.showArrow = true;
            } else {
                vm.showArrow = false;
            }
        });
    });
    this.clearMapTower = function () {
        //清除杆塔
        ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'showTowerLine', data: { clear: true } });
        //清除图片
        ProjectSGC.Map.postMessage({ eventType: 'menuope', menuname: 'drawCanvasByHTML', selstate: false, data: { type: "mapImg", locateData: [] } });
        //地图复位
        ProjectSGC.Map.postMessage({ "eventType": "menuope", "menuname": "setDefaultRegion", "data": { "regionID": "990101", "Level": 1002, "padding": [52, 0, 0, 0] } });
        //清除divPosition
        ProjectSGC.Map.postMessage({ eventType: "menuope", menuname: "setDivPosition", selstate: false, data: {} });
        vMain.destroyFloatPage(window.parent.floatDataInst.getPositionDiv("sc_device_defect_imgs_0"));
        //注销地图上图片
        window.parent.floatDataInst.destroyPositionDiv("sc_device_defect_imgs_0");
        //关闭缺陷详情
        vMain.closeApp("line_defect_detail");
        vMain.closeApp("station_defect_detail");
    }

    window.removeEventListener("message", window.defectMessage);
    window.defectMessage = null;
    window.defectMessage = function (event) {
        if (!event.data)
            return;
        var data = event.data;
        if ((data.type == "defect") && (data.eventType == 5) && (data.operateType == "click")) {
            var id = data.data.data.tableDefectId;
            vm.$refs.tbl.locate(id);
            var find = vm.dsShowDefect.find(item => item.ID == id);
            vm.showDefectDetail(find);
        }
        if ((data.data.type == 6) && (data.eventType == 8) && (data.typeName == "setShiJiao")) {
            console.log("c1触发")
            vm.clearMapTower();

        }
    }
    window.addEventListener("message", defectMessage);

}//line_defect结束
{//line_defect_detail开始
    var vm = this;

    var titles = [
        "线路名称", "起始杆塔名", "终点杆塔名",
        "年度", "电压等级", "交直流",
        "业务标签", "任务类型", "巡视伦次",
        "出资单位", "资产单位", "运维单位",
        "缺陷发现时间", "缺陷等级", "缺陷描述",
        "部件种类", "部件", "部位",
    ];

    var keys = ['LINE_NAME', 'START_TOWER_NAME', 'END_TOWER_NAME', 'LINE_YEAR', 'VOL', 'AC_DC', 'YWBQ', 'RWLX', 'XSLC', 'CZDW', 'ZCDW', 'YWDW', 'FIND_DAY', 'DEFECT_LEVEL', 'DEFECT_DESCRIBE', 'BJZL', 'BJ', 'BW',
    ];

    var contentKeys = ['DEFECT_DETAIL'];
    this.getFefectDetail = function () {
        if (!vm.id) return;
        PDP.load("sc/deviceDefect:GetLineDefectDetail", { ID: vm.id }, function (res) {
            if (res.check("获取线路缺陷详细数据", true)) {
                if (res.value.length === 0) return;
                var resData = res.value[0];

                vm.dsInitDefect = resData;
                vm.getTableData();
                var imgUrl = resData.VOL + "kV" + resData.LINE_NAME + resData.START_TOWER_NAME + "塔" + resData.DEFECT_DETAIL + ".jpg";
                vm.defectImgs = [{ url: "/i/sgc/shengchan/linedefect/" + encodeURIComponent(imgUrl) }]
            }
            if (this.resize) {
                this.resize();
            }
        })
        // PDP.load("sc/deviceDefect:GetLineDefectImg", { ID: vm.id }, function (res) {
        //     if (res.check("获取线路缺陷详细数据图片", true)) {

        //         if (res.value.length === 0) return;
        //         var resData = res.value;
        //         vm.defectImgs = resData;
        //         // vm.dsInitDefect = resData;
        //         // vm.getTableData();

        //     }
        // })
    }
    this.getTableData = function () {
        var tableData = [];
        var item = [];
        for (var i = 0; i < titles.length; i++) {

            item.push(titles[i]);
            item.push(vm.dsInitDefect[keys[i]]);
            if ((i + 1) % 3 === 0) {
                tableData.push(item);
                item = [];
            }
        }
        vm.dsDefect = tableData;
    }
    this.switchDefectImg = function (index, item) {
        this.currentImgIndex = index;
    }
    this.initPage = function () {
        vm.getFefectDetail();
    }
    this.initPage();

}//line_defect_detail结束