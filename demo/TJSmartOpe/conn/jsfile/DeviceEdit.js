var deviceEditInfo = { all: [[]], objs: [], COL_TYPE: 0, COL_INFO: 1, COL_NAME: 2, COL_PRINCIPLE: 6, COL_ISDISCARD: 5, bLoaded: false,BASEINFOCTRLCOUNT: 2,
    curVoltage: 1, arrCheckDeviceSignal:{}, principle: {
        get: function (v, t, st) {
            var vd = this[v]; if (!vd) { this[v] = {}; vd = this[v]; };
            var vtd = vd[t]; if (!vtd) { vd[t] = {}; vtd = vd[t]; };
            var vtsd = vtd[st]; if (vtsd) return vtsd;
            var data = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DeviceEdit.GetPrincipleList", [v, t, st]); });
            if (!data.check("获取原理数据", true)) return null;
            data = data.value;
            this.set(v, t, st, data);
            return data;
        },
        set: function (v, t, st, d) {
            if (!this[v]) { this[v] = {}; };
            if (!this[v][t]) { this[v][t] = {}; };
            this[v][t][st] = d;
        }
    }, config: {
        get: function (t) {
            if (this["loaded"]) { return this[t]; };
            var data = ExecuteBack(function () { return YshGrid.ExecuteReader("ConnMain", "BaseDataSql:GetDeviceTypeNameConfig", []); });
            if (!data.check("获取编号配置", true)) return "";
            this.loaded = true;
            data = data.value;
            for (var i = 0; i < data.length; i++) {
                this[data[i][0]] = Ysh.getDBValue(data[i][1]);
            }
            return this[t];
        }
    }, args: [],
    itemid: (Ysh.Request.get("itemid") == "" ? "0" : Ysh.Request.get("itemid"))
};

function getAllDataBySpaces(args) {
    if (args.length == 1)
        args.push({ id: "carding", value: spaceListInfo.bCarding });
    var arrData = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DeviceEdit.GetDeviceList", [args, 1, 1]); });
    if (!arrData.check("获取数据", true))
        return false;
    deviceEditInfo.all = arrData.value;
    if(args.length > 0)
        initCheckDeviceSignal(args[0].value);
    return true;
}

function getDeviceDataBySpace(spaceid) {
    var arrData = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DeviceEdit.GetDeviceList", [[{ id: "spaceid", value: spaceid }, { id: "carding", value: spaceListInfo.bCarding}], 1, 1]); });
    if (!arrData.check("获取间隔数据", true))
        return false;
    return arrData.value[0];
}

function clearDeviceList() {    
    for (var i = 1;i < deviceEditInfo.objs.length;i++) {
      var obj = deviceEditInfo.objs[i];
      obj.ctrl.parentElement.removeChild(obj.ctrl);
      FullEditPageObj.objs.erase(obj);
    }
    deviceEditInfo.all = [];
    deviceEditInfo.objs = [DeviceEditObj];
}

function getTypePrincipleHtml(typeid, stid, volid, arrSelected) {//TODO:
    var data = deviceEditInfo.principle.get(volid, typeid, stid);
    if (data == null)
        return "";
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var optionHtml = "";
        for (var j = 0; j < item.length; j++) {
            var key = item[j][0];
            var text = item[j][1];
            var selected = "";
            if (arrSelected.indexOf(key) >= 0 || (arrSelected.length == 0 && item[j][2] == "1"))
                selected = "selected";
            optionHtml += "<OPTION value='" + key + "' title='" + text + "' " + selected + ">" + text + "</OPTION>";
        }
        html += "<SELECT style='width:30%;'><option value='' />" + optionHtml + "</SELECT>";
    }
    return html;
}

function getSelectedPrinciple(row) {
    var tdInfo = row.cells[deviceEditInfo.COL_INFO];
    if (tdInfo.children.length == deviceEditInfo.BASEINFOCTRLCOUNT) //没有原理
        return "";
    var arr = [];
    var spPrinciple = tdInfo.children[0];
    for (var i = 0; i < spPrinciple.children.length; i++) {
        var sel = spPrinciple.children[i].value;
        arr.push(sel);
    }
    return arr.join(",");
}

function getPrincipleDesc(t, st, v, p) {
    if (p == "") return "";
    var data = deviceEditInfo.principle.get(v, t, st);
    if (data == null)
        return "";
    var arrP = p.split(',');
    var str = "";
    for (var pi = 0; pi < arrP.length; pi++) {
        if (pi > 0) str += "/";
        var find = false;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            for (var j = 0; j < item.length; j++) {
                var key = item[j][0];
                if (key == arrP[pi]) {
                    str += item[j][1];
                    find = true;
                    break;
                }
            }
            if (find)
                break;
        }
    }
    return str;
}

function getTypeValue(t) { if (t instanceof Array) return t[0]; return t; }

function doDeviceTypeChange(row, t, arrSelctedPrinciple) {
    var tdName = row.cells[deviceEditInfo.COL_NAME];
    var cfg = deviceEditInfo.config.get(t);
    var txt = tdName.children[0];
    if (cfg) {
        txt.onclick = function () {
            Ysh.Web.Text.setDropDownList(txt, cfg.split(","));
        };
    } else {
        txt.onclick = null;
    }
    /*if (spaceListInfo.bCarding) {
        var tdInfo = row.cells[deviceEditInfo.COL_INFO];
        for (var i = 0; i < tdInfo.children.length; i++) {
            tdInfo.children[i].style.display = "none";
        }
    }*/
    var obj = FullEditPageObj.getObjByCtrl(Ysh.Web.getParent(row, "TABLE"));
    var html = getTypePrincipleHtml(t, obj.stid, obj.volid, arrSelctedPrinciple);
    var tdInfo = row.cells[deviceEditInfo.COL_INFO];
    if (html != "") {
        tdInfo.insertBefore(document.createElement("SPAN"), tdInfo.children[0]).innerHTML = html;
    }
    var ddlFac = tdInfo.children[tdInfo.children.length - deviceEditInfo.BASEINFOCTRLCOUNT];
    if (!ddlFac.value) {
        ddlFac.value = 0;
        ddlFac.fireEvent("onchange");
        var ddlMod = tdInfo.children[tdInfo.children.length - 1];
        ddlMod.value = 0;
    }
}

function onDeviceTypeChange(o) {
    var row = Ysh.Web.getParent(o, "TR")
    var obj = FullEditPageObj.getObjByCtrl(Ysh.Web.getParent(o, "TABLE"));
    var tdInfo = row.cells[deviceEditInfo.COL_INFO];
    obj.clearCellExtraCtrl(tdInfo);
    doDeviceTypeChange(row, o.value, []);
}

function addNewDevice(o) {
    var obj = FullEditPageObj.getObjByCtrl(Ysh.Web.getParent(o, "TABLE"));
    obj.addNewRow();
}

function copyToSpace(o) {//TODO:
    var obj = FullEditPageObj.getObjByCtrl(Ysh.Web.getParent(o, "TABLE"));
    var spaceid = obj.spaceid;
    var url = "p.aspx?f=SelectSpace&staid=" + staid + "&spaceid=" + spaceid + "&spacename=" + escape(obj.spacename) + "&stid=" + 1 + "&volid=" + 2 + "&spacelist=" + GetCanEditSpaceList() + "&itemid=" + itemid + "&a=" + Math.random();
    var ret = Ysh.Web.showDialog(url, null, "dialogWidth:500px; dialogHeight:500px; center:yes; help:no; resizable:no; status:no;scroll:no;");
    if (!ret)
        return;
    if (!confirm("你确定要将间隔内的设备与信号复制到间隔" + ret[1] + "吗？\r\n此操作会先清空间隔" + ret[1] + "内的所有数据!"))
        return;
    Ysh.Web.Loading(function () { doCopyToSpace(ret, spaceid) }, "正在复制");
}
function doCopyToSpace(ret, spaceid) {
    var newSpaceIds = ret[0].split(',');
    if (!ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DeviceEdit.CopySpaceDevices", [itemid, spaceid, newSpaceIds, false, true, spaceListInfo.bCarding]); }).check("复制"))
        return;
    backExecute("dkLib:dkLib.SpaceBackEdit.Execute", [newSpaceIds]);
    for (var i = 0; i < deviceEditInfo.objs.length; i++) {
        var objEI = deviceEditInfo.objs[i];
        if (newSpaceIds.contains(objEI.spaceid)) {
            executeBackSpace([[objEI.spaceid]], function () {
                Execute("dkLib:dkLib.SpaceBackEdit.Execute", [[objEI.spaceid]]);
                var devices = getDeviceDataBySpace(objEI.spaceid);
                if (!devices) return;
                deviceEditInfo.all[i] = devices;
                objEI.Refresh(1);
            });
        }
    }
}
function refreshDeviceChange(spaceid) {
    var bInclude = false;
    for (var i = 0; i < deviceEditInfo.args.length; i++) {
        var arg = deviceEditInfo.args[i];
        if (arg.id == "spaceid") {
            if (arg.value.split(',').contains(spaceid)) {
                bInclude = true;
                break;
            }
        }
    }
    if (bInclude)
        refreshDeviceList(deviceEditInfo.args);
}

function refreshDeviceList(args) {
    initDeviceEdit();
    deviceEditInfo.args = args;
    if (!DeviceEditObj.editInfo.save()) {
        DeviceEditObj.doCancel(DeviceEditObj.editInfo.row);
    }
    clearDeviceList();

    if ($(DeviceEditObj.ctrl).find("img").attr("hide") == "1") {
        $(DeviceEditObj.ctrl).find("tr:gt(0)").show();
    }

    DeviceEditObj.ctrl.parentElement.style.display = "none";

    if (args.length == 0) {
        getAllDataBySpaces(args);
    }

    else if (args.length > 0 && args[0].id == "spaceid")
        executeBackSpace([args[0].value.split(",")], function () {
            Execute("dkLib:dkLib.SpaceBackEdit.Execute", [args[0].value.split(",")]);
            getAllDataBySpaces(args);

            if (deviceEditInfo.all.length == 0)
                return;

            DeviceEditObj.spaceid = deviceEditInfo.all[0][0];//必须先绑定spaceid,否则权限就会有问题
            DeviceEditObj.stid = deviceEditInfo.all[0][2];
            DeviceEditObj.volid = deviceEditInfo.all[0][3];
            DeviceEditObj.Refresh(1);

            for (var i = 1; i < deviceEditInfo.all.length; i++) {
                var newDevEdit = DeviceEditObj.clone("deviceEditInfo.objs[" + i.toString() + "]", DeviceEditObj.ctrl.parentElement);
                newDevEdit.dataIndex = i;
                newDevEdit.spaceid = deviceEditInfo.all[i][0]; //必须先绑定spaceid,否则权限就会有问题
                newDevEdit.stid = deviceEditInfo.all[0][2];
                newDevEdit.volid = deviceEditInfo.all[0][3];
                newDevEdit.Refresh(1);
                deviceEditInfo.objs.push(newDevEdit);
            }
            for (var i = 0; i < deviceEditInfo.objs.length; i++) {
                var obj = deviceEditInfo.objs[i];
                obj.spacename = deviceEditInfo.all[i][1];
                obj.setArgs([{ id: "spaceid", value: obj.spaceid }]);
                obj.ctrl.rows[0].cells[0].children[0].children[1].innerHTML = deviceEditInfo.all[i][1] + (deviceEditInfo.all[i][4].indexOf("主变") > -1 ? "-" + deviceEditInfo.all[i][4] : "");//主变间隔加上间隔类型
                var btnAdd = obj.ctrl.rows[0].cells[1].children[0];
                if ((spaceListInfo.canEditDevice) /*&& (!spaceListInfo.bCarding)*/) {
                    btnAdd.style.display = "";
                } else {
                    btnAdd.style.display = "none";
                }
                obj.ctrl.rows[0].cells[1].children[1].style.display = (spaceListInfo.canEditSpace ? "" : "none");
            }

            if ($(DeviceEditObj.ctrl).find("img").attr("hide") == "1") {
                $(DeviceEditObj.ctrl).find("tr:gt(0)").hide();
            }
            DeviceEditObj.ctrl.parentElement.style.display = "";
        });
}

function initDeviceEdit() {
    if (deviceEditInfo.bLoaded)
        return false;
    DeviceEditObj.initial();
    //DeviceEditObj.setArgs([{id:"spaceid",value:81}]);
    DeviceEditObj.dataIndex = 0;
    DeviceEditObj.operateAlginCol = 0;
    DeviceEditObj.getDeleteMsg = function (id, arrData, row) {
        return "你确定要删除此设备吗？\r\n" + arrData[3] + "设备下的所有信号也会被删除！";
    }
    DeviceEditObj.getIdIndex = function (arrData) {
        return arrData.length - 3;
    }
    Ysh.Object.addGetHandle(DeviceEditObj, "getEditDataArray", function (v, row, noCheck) {
        if (v == null) return null;
        var data = this.getDataFromRow(row);
        //v[3] = row.cells[2].children[0].value + v[3];
        
        if (data == null)
            v.push("");
        else
            v.push(data[deviceEditInfo.COL_ISDISCARD]);
        v.push(getSelectedPrinciple(row));
        return v;
    });
    Ysh.Object.addGetHandle(DeviceEditObj, "getHoverOperates", function (v, row) {
        if (this.canModify(row)) {
            return v;
        }
        if (!spaceListInfo.canEditDevice) {
            return "";
        }
        else {
            var tips = [];
            tips.push({ text: "此设备存在被其他未归档流程修改的信号。", event: function () { FullEditPageObj.hideOperatePanel(false); } });
            return tips;
        }
    });
    Ysh.Object.addGetHandle(DeviceEditObj, "getCellShowHtml", function (v, rows, arrData, r, c) {
        if (c != deviceEditInfo.COL_INFO && c != deviceEditInfo.COL_TYPE)
            return v;
        var obj = FullEditPageObj.getObjByCtrl(Ysh.Web.getParent(rows[0], "TABLE")); 
        var data = deviceEditInfo.principle.get(obj.volid, getTypeValue(arrData[deviceEditInfo.COL_TYPE]), obj.stid);
        if (c == deviceEditInfo.COL_TYPE) {
            if (data != null && data.length > 0)
                return "<span style = ' color:red; '>*</span>" + v;
            return v;
        }
        var principle = arrData[deviceEditInfo.COL_PRINCIPLE];
        if (principle == "")
            return /*spaceListInfo.bCarding ? "" :*/ v;        
        var prin = getPrincipleDesc(getTypeValue(arrData[deviceEditInfo.COL_TYPE]), obj.stid, obj.volid, principle);
        /*if (spaceListInfo.bCarding)
            return prin;*/
        return prin + "/" + v;
    });
    DeviceEditObj.clearCellExtraCtrl = function (td) {
        if (td.cellIndex == deviceEditInfo.COL_INFO) {//设备信息行，去掉原理的控件 
            var children = [];
            for (var i = 0; i < td.children.length - deviceEditInfo.BASEINFOCTRLCOUNT; i++) {
                children.push(td.children[i]);
            }
            for (var i = 0; i < children.length; i++) {
                td.removeChild(children[i]);
            }
        }
    }
    Ysh.Object.addHandle(DeviceEditObj, "setRowEditState", function (rows, bInit) {
        var type = "";
        var principle = [];
        if (bInit) {
            type = rows[0].cells[deviceEditInfo.COL_TYPE].children[0].value;
            rows[0].cells[deviceEditInfo.COL_TYPE].children[0].disabled = false;
        } else {
            var arrData = this.getDataFromRow(rows[0]);
            type = getTypeValue(arrData[deviceEditInfo.COL_TYPE]);
            principle = arrData[deviceEditInfo.COL_PRINCIPLE].split(",");
            rows[0].cells[deviceEditInfo.COL_TYPE].children[0].disabled = true;
        }
        doDeviceTypeChange(rows[0], type, principle);
    });
    DeviceEditObj.getOperateHTML = function (row) {
        if (spaceListInfo.bCarding) {
            var data = this.getDataFromRow(row);
            var bIsDiscard = data[deviceEditInfo.COL_ISDISCARD] == "1";
            return bIsDiscard ? this.getSingleHTML("doUndiscard", "<input type=checkbox " + (!spaceListInfo.canSignDevice ? "disabled=true" : "") + ">", "标记为有此设备") : this.getSingleHTML("doDiscard", "<input type=checkbox checked=true " + (!spaceListInfo.canSignDevice ? "disabled=true" : "") + ">", "标记为无此设备");
        }
        var html = "";
        if (spaceListInfo.bCanEditDeviceDesc) {
            html += this.getSingleHTML("doEditDeviceDesc", "<img style='width:18px;height:18px' src='/Images/Report/edit.ico'>", "编辑设备名称");
        }
        html += this.getSingleHTML("doSignal", "<img style='width:18px;height:18px' src='/Images/list.png'>", "查看设备信息表");
        if (!this.canModify(row))
            return html;
        if (row.cells[0].style.display == "none") {
            if (row.cells[0].innerText == "0")
                return html;
        }
        return html + "&nbsp;" + this.getSingleHTML("doDelete", "<img style='width:18px;height:18px' src='/Images/delete_blue.png'>", "删除此设备");
    }
    DeviceEditObj.doEditDeviceDesc = function (row) {
        var arrOldData = this.getDataFromRow(row);
        var str = Ysh.prompt("请输入设备名称", "请输入设备名称", arrOldData[3], 200, 100);
        if (!str)
            return false;
        var arrUpdateData = [];
        for (var i = 0; i < arrOldData.length; i++) {
            if (i == 0 || i == 1 || i == 2) {
                arrUpdateData.push(arrOldData[i][0]);
            }
            else if (i == 3) {
                arrUpdateData.push(str);
            }
            else {
                arrUpdateData.push(arrOldData[i]);
            }
        }
        var id = this.getIdFromRow(row);
        this.onUpdate(id, arrOldData, arrUpdateData, row);
        refreshDeviceList([{ id: "spaceid", value: this.spaceid}]);
    }
    DeviceEditObj.doUndiscard = function (row) {
        var id = this.getIdFromRow(row);
        var ret = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DeviceEdit.SetDeviceDiscard", [id, false]); });
        if (!ret.check("标记", true))
            return;
        this.getDataFromRow(row)[deviceEditInfo.COL_ISDISCARD] = "";
        row.cells[this.colOperate].innerHTML = this.getOperateHTML(row);
    }
    DeviceEditObj.doDiscard = function (row) {
        var id = this.getIdFromRow(row);
        var ret = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DeviceEdit.SetDeviceDiscard", [id, true]); });
        if (!ret.check("标记", true))
            return;
        this.getDataFromRow(row)[deviceEditInfo.COL_ISDISCARD] = "1";
        row.cells[this.colOperate].innerHTML = this.getOperateHTML(row);
    }
    DeviceEditObj.doSignal = function (row) {
        var id = this.getIdFromRow(row);
        var bEdit = spaceListInfo.canEditDeviceSignal ? "1" : "0";

        var devInfo = this.spacename + "/" + row.cells[deviceEditInfo.COL_TYPE].innerText + "/" + row.cells[deviceEditInfo.COL_INFO].innerText + "/" + row.cells[deviceEditInfo.COL_NAME].innerText;

        Ysh.Web.showDialog("/p.aspx?f=DeviceSignalEdit&DevId=" + id + "&itemid=" + itemid
            + "&edit=" + bEdit + "&devInfo=" + escape(devInfo) + "&a=" + Math.random(), null, "dialogWidth:720px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no;scroll:no;");

    }
    DeviceEditObj.GetListData = function (pageCount, pagenum) {
        return deviceEditInfo.all[this.dataIndex][5];
    }              //
    DeviceEditObj.canModify = function (row) {
        var id = this.getIdFromRow(row);
        return (spaceListInfo.canEditDevice && canModifySignalInDevice(id));
    }
    DeviceEditObj.OnUpdateListEnd = function () { }
    DeviceEditObj.onCreate = function (arrData, row) {
        var o = this;
        var id = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DeviceEdit.InsertDevice", [itemid, o.GetFileName(), o.GetArgs(), arrData, spaceListInfo.bCarding]); });
        if (!id.check("创建", true)) return false;
        return id.value;
    } //
    DeviceEditObj.onUpdate = function (id, arrOldData, arrData, row) {
        var o = this;
        return ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DeviceEdit.UpdateDevice", [itemid, o.GetFileName(), o.GetArgs(), id, arrData, arrOldData, spaceListInfo.bCarding]); }).check("保存", true);
        return true;
    }     //
    DeviceEditObj.onDelete = function (id, arrData, row) {
        if (!confirm(this.getDeleteMsg(id, arrData, row)))
            return false;
        var o = this;
        return ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DeviceEdit.DeleteDevice", [itemid, o.GetFileName(), o.GetArgs(), id, arrData, spaceListInfo.bCarding]); }).check("删除");
    } //

    //DeviceEditObj.ctrl.parentElement.style.display = "none";


    //根据变电站是否智能站来刷新设备类型
    DeviceEditObj.doEachYshIndex(function (info) {
        var ysh = info.ysh;
        var yshid = ysh.doc.GetDesignID(ysh.id);
        if (yshid == "selDeviceType") { //设备类型
            if (isSmart == 1) {
                ysh.datasource.options.sql = "DeviceEditSql:AllDeviceType";
                ysh.UpdateOption(true);
            }
            else {
                ysh.datasource.options.sql = "DeviceEditSql:DeviceType";
                ysh.UpdateOption(true);
            }
        }
    });
    deviceEditInfo.bLoaded = true;
}

function ShowDeviceNumRemark(t) {
    eve = arguments[0];
    element = window.event ? window.event.srcElement : eve.target;
    fillPrompt.showAlertOffset("device", t, 30);
}
function canModifySignalInDevice(id) {
    if (typeof (itemid) != "undefined") {
        var bSignalChanged = deviceEditInfo.arrCheckDeviceSignal[id];
        if (typeof (bSignalChanged) == "undefined") {
            var ret = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DbAssist.HasData", ["IfDeviceSignalChanged", [id, itemid]]); });
            if (!ret.check("获取间隔信号修改信息", true)) {
                return false;
            }
            else if (ret.value == 1) {
                bSignalChanged = false;
            }
            else if (ret.value == 0) {
                bSignalChanged = true;
            }
            deviceEditInfo.arrCheckDeviceSignal[id] = bSignalChanged;
        }
        return bSignalChanged;
    }
    else {
        return true;
    }
}

function initCheckDeviceSignal(spaceids) {
    if (!spaceids)
        return;
    var ret = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DbAssist.GetDataList", ["InitDeviceSignalChanged", [spaceids, itemid]]); });
    if (!ret.check("获取间隔信号修改信息", true)) {
        return false;
    }
    var arr = ret.value;
    for (var i = 0; i < arr.length; i++) {
        deviceEditInfo.arrCheckDeviceSignal[arr[i][0]] = arr[i][1] == 0;
    }
}
var tHandler = null;
function executeBackSpace(arrSpaceID, func) {
    if (tHandler != null) {
        clearTimeout(tHandler);
        GHideWorking();
    }
    GShowWorking("正在加载");
    if (!CheckExecuteSpace(arrSpaceID)) {
        tHandler = setTimeout(function () { try { func(); } catch (E) { } GHideWorking();  }, 100);
    }
    else
        tHandler = setTimeout(function () { executeBackSpace(arrSpaceID, func); }, 100);
}

function CheckExecuteSpace(arrSpaceID) {
    return Execute("dkLib:dkLib.SpaceBackEdit.CheckExecuteSpace", arrSpaceID, "获取执行状态", true);
}