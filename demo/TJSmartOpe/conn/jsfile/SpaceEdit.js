Ysh.Css.add(".newbtnExport{background-image:url(../../Images/excNew.gif);width:98px;height:33px;border: 0;background-color: Transparent;}");
Ysh.Css.add(".trYXRowClass{text-align:center;height:30px;background-color:white;}");
Ysh.Css.add(".btnVol{width:100%;height:50px;border:#1a827c 1px solid;margin-right:10px;margin-top:2px;color:#1a827c;cursor:pointer;text-align:center;padding-top:15px;font-size:10pt;font-weight:bold;font-family:微软雅黑;}");
Ysh.Css.add(".btnVolHover{width:100%;height:50px;border:#1a827c 1px solid;margin-right:10px;margin-top:2px;background-color:#1a827c;color:#fff;cursor:pointer;text-align:center;padding-top:15px;font-size:10pt;font-weight:bold;font-family:微软雅黑;}");
Ysh.Css.add(".btnVolSelect{width:100%;height:50px;border:#1a827c 1px solid;margin-top:2px;background-color:#1a827c;color:#fff;text-align:center;padding-top:15px;font-size:10pt;font-weight:bold;font-family:微软雅黑;}");
Ysh.Css.add(".btnVolDone{width:100%;height:50px;border:#1a827c 3px solid;margin-right:10px;margin-top:2px;color:#1a827c;cursor:pointer;text-align:center;padding-top:10px;font-size:10pt;font-weight:bold;font-family:微软雅黑;}");
Ysh.Css.add(".button{width:100%;height:50px;border:#1a827c 1px solid;margin-right:10px;margin-top:2px;color:#1a827c;cursor:pointer;text-align:center;padding-top:15px;font-size:10pt;font-weight:bold;font-family:微软雅黑;}");
Ysh.Css.add(".buttonHover{width:100%;height:50px;border:#1a827c 1px solid;margin-right:10px;margin-top:2px;background-color:#1a827c;color:#fff;cursor:pointer;text-align:center;padding-top:15px;font-size:10pt;font-weight:bold;font-family:微软雅黑;}");

var spaceListInfo = {
    data: [], objs: [], canEditSpace: true, canEditDevice: true, canEditSpaceSignal: true, canEditDeviceSignal: true, canAddSpace: true, canEditAllSpace: true, canEditSpaceList: [], COL_TYPE: 1, COL_MAINVOL: 4, COL_LINE: 6, bSignal: true, bCarding: false, bLoaded: false, bCanEditSpaceDesc: true, bCanEditDeviceDesc: true, canSignDevice: true, arrCheckSpaceSignal: {}, canReplaceSpaceSignal: false,
    isSpaceCanEdit: function (spaceid) {
        if (!this.canEditSpace)
            return false;
        if (this.canEditAllSpace)
            return true;
        return this.canEditSpaceList.contains(spaceid);
    },
    isSpaceCanAdd: function () {
        if (!this.canEditSpace)
            return false;
        if (this.canEditAllSpace)
            return true;
        return this.canAddSpace;
    },
    itemid: (Ysh.Request.get("itemid") == "" ? "0" : Ysh.Request.get("itemid"))
};

function initSpaceEdit() {
    if (!spaceListInfo.bLoaded) {
        InitVar();
        ReWrite();
    }
    if (!staid) {
        return false;
    }
    //InitPriv();
    InitButtonList(staid);
}
function setSpaceEditPriv(o) {
    for (var priv in o) {
        spaceListInfo[priv] = o[priv];
    }
}
//初始化权限
function InitPriv() {
    spaceListInfo.canEditSpace = GetSpaceEditPriv();
    spaceListInfo.canEditDevice = GetDeviceEditPriv();
}
//间隔编辑权限
function GetSpaceEditPriv() {
    return false;
}
//设备编辑权限
function GetDeviceEditPriv() {
    return true;
}
//获取电压等级完成列表
function GetStaVolList(staid) {
    var o = ExecuteReader("ConnMain", "GetStaVolList", [staid], "获取电压列表", true);
    if (o.length == 0)
        return false;
    return o;
}
function InitButtonList(staid) {
    var arrVol = GetStaVolList(staid);
    if (!arrVol)
        return false;
    var arrDiv = $("#" + strPrefix + "divLeft").find("div[name=vol]");
    arrDiv.show().each(function (i) {
        if (i > arrVol.length - 1) {
            $(this).hide();
            return true;
        }
        $(this).attr({ id: arrVol[i][0], isDone: 0, volValue: arrVol[i][1], staid: staid, lineid: arrVol[i][3] }).text(arrVol[i][1] == "其他" ? "其他及公用" : arrVol[i][1]);
        if (arrVol[i][2] == 1) {
            $(this).attr("class", "btnVolDone").attr("isDone", 1);
            SetVoltageDone($(this), true);
        }
    }); 
    $("#" + strPrefix + "btnTotalStation").hide();
    if (spaceListInfo.bCarding) {
        var o = ExecuteReader("ConnMain", "GetStationRunDone", [staid], "获取全站事故总状态", true);
        var bDone = o.length > 0 && o[0][0] == 1;
        if (bDone) {
            $("#" + strPrefix + "btnTotalStation").attr("class", "btnVolDone").attr("isDone", 1);
        }
        /*$("#" + strPrefix + "btnTotalStation").show().mouseover(function () {
            var oldClass = $(this).attr("class");
            if (oldClass == "btnVolSelect")
                return false;
            $(this).attr("_class", oldClass).attr("class", "btnVolHover");
        }).mouseout(function () {
            if ($(this).attr("class") == "btnVolSelect")
                return false;
            $(this).attr("class", $(this).attr("_class"));
        }).click(function () {
            if (!FullEditPageObj.saveAll())
                return;
            var oldClass = $(this).attr("_class");
            if (!oldClass)
                $(this).attr("_class", $(this).attr("class"));
            $(this).attr("class", "btnVolSelect")
                .siblings(".btnVolSelect").each(function () { $(this).attr("class", $(this).attr("_class")); });
            $("#" + strPrefix + "trMainTrans").hide();
            clearSpaceList();
            var isDone = $(this).attr("isDone");
            $("#" + strPrefix + "trNext").find(":checkbox").prop("checked", isDone == 1).attr({ staid: staid, volid: "-1" })
                .end().find("span[name='voltext']").text("事故总")
                .end().find(":submit").attr("volid", "-1").css("display", "none");
            var o = ExecuteReader("ConnMain", "GetTotalStationSpace", [staid], "获取全站事故总间隔ID", true);
            if (o.length > 0) {
                showSpaceSignal(o[0][0], "事故总");
            }
            if (typeof refreshDeviceList == "function")
                refreshDeviceList([]);
        });*/
    }
    if (!spaceListInfo.bLoaded) {
        arrDiv.mouseover(function () {
            var oldClass = $(this).attr("class");
            if (oldClass == "btnVolSelect")
                return false;
            $(this).attr("_class", oldClass).attr("class", "btnVolHover");
        }).mouseout(function () {
            if ($(this).attr("class") == "btnVolSelect")
                return false;
            $(this).attr("class", $(this).attr("_class"));
        }).click(function () {
            if (!FullEditPageObj.saveAll())
                return;
            var oldClass = $(this).attr("_class");
            if (!oldClass)
                $(this).attr("_class", $(this).attr("class"));
            $(this).attr("class", "btnVolSelect")
                .siblings(".btnVolSelect").each(function () { $(this).attr("class", $(this).attr("_class")); });
            showSpaceList($(this).attr("staid"), $(this).attr("id"), $(this).attr("volValue"), $(this), $(this).attr("lineid"));
            if (typeof refreshDeviceList == "function")
                refreshDeviceList([]);
            if (typeof VoltageDivClickEvent == "function")
                VoltageDivClickEvent();
        })
        .end().find(".button").mouseover(function () {
            $(this).attr("class", "buttonHover");
        }).mouseout(function () {
            $(this).attr("class", "button");
        });
    }
    prepareSelect();
    SelectFirst();
    spaceListInfo.bLoaded = true;
}
function prepareSelect() { }
//选中第一个未完成的
function SelectFirst() {
    var divLeft = $("#" + strPrefix + "divLeft");
    var divs = divLeft.find("div[isDone=0]");
    if (divs.length > 0)
        divs[0].click();
    else
        divLeft.find("div[isDone]")[0].click();
}
function ReWrite() {
    SpaceEditObj.initial();
    var colIndex = GetColIndex(SpaceEditObj.ctrl, "间隔名称");
    SpaceEditObj.colIndex = colIndex;
    SpaceEditObj.dataIndex = 0;
    SpaceEditObj.operateAlginCol = GetColIndex(SpaceEditObj.ctrl, "间隔名称");
    SpaceEditObj.getDeleteMsg = function (id, arrData, row) {
        var msg = "你确定要删除此间隔吗？";
        if (spaceListInfo.bCarding) {
            msg += "\r\n" + arrData[1] + "间隔下的信号重新加入未划归的信号中！"
            msg += "\r\n同时间隔下的标准信号处置也会被取消！";
        }
        else {
            msg += "\r\n" + arrData[1] + "间隔下的所有设备和信号也会被删除！"
        }
        return msg;
    }
    SpaceEditObj.getIdIndex = function (arrData) {
        return arrData.length - 1;
    }
    SpaceEditObj.GetListData = function (pageCount, pagenum) {
        return spaceListInfo.data[this.dataIndex][2];
    }
    SpaceEditObj.OnUpdateListEnd = function () { }
    Ysh.Object.addHandle(SpaceEditObj, "setRowStyles", function (rows) {
        var o = this;
        for (var r = 0; r < rows.length; r++) {
            var row = rows[r];
            if (row.cells.length < 2 || !this.hideColIndex || this.hideColIndex.length == 0)
                continue;
            $.each(this.hideColIndex, function (i, item) {
                row.cells[item].style.display = "none";
            });
        }
    });
    Ysh.Object.addHandle(SpaceEditObj, "setRowEditState", function (rows, bInit) {
        var sel = rows[0].cells[spaceListInfo.COL_TYPE].children[0];
        var table = Ysh.Web.getParent(sel, "TABLE");
        var obj = $(table).find("[stname]");
            if (bInit) {
                rows[0].cells[spaceListInfo.COL_LINE].children[0].value = this.lineid;
            }
        var arrCtrl = [rows[0].cells[spaceListInfo.COL_MAINVOL].children[0], rows[0].cells[spaceListInfo.COL_LINE].children[0]];
        if (obj.length == 0) {
            this.setCtrlDisabled(arrCtrl, false);
            return true;
        }
        var stname = obj.attr("stname");
        if (bInit) {
            sel.disabled = false;
            this.setSelectOption(sel, stname, obj.attr("volid"));
        }
        else {
            if (stname == "开关间隔") {
                sel.disabled = false;
                this.setSelectOption(sel, stname, obj.attr("volid"), sel.value);
            }
            else {
                sel.disabled = true;
            }
        }
        this.setCtrlDisabled(arrCtrl, false);
    });
    SpaceEditObj.setSelectOption = function (sel, stname, volid, value) {
        if (stname == "其他") {
            $(sel).html($("#" + strPrefix + "ddlOtherType").html());
            return true;
        }
        var sqlNode = "";
        if (stname == "串" || stname == "开关间隔")
            sqlNode = "GetBKGAndZKG";
        else if (stname == "主变") {
            sqlNode = "GetStVolRelation";
        }
        if (sqlNode == "")
            return true;
        var o = ExecuteReader("ConnMain", sqlNode, [volid], "获取间隔类型", true);
        if (!o || o.length == 0)
            return true;
        var optionHTML = "";
        for (var i = 0; i < o.length; i++) {
            optionHTML += "<option value=" + o[i][0] + ">" + o[i][1] + "</option>";
        }
        $(sel).empty().append(optionHTML).val(value);
    }
    Ysh.Object.addGetHandle(SpaceEditObj, "getHoverOperates", function (v, row) {
        var id = this.getIdFromRow(row);
        if (this.canModify(row)) {
            return v;
        }
        else if (!spaceListInfo.isSpaceCanEdit(id)) {
            return "";
        }
        else {
            var tips = [];
            tips.push({ text: "此间隔存在被其他未归档流程修改的信号。", event: function () { FullEditPageObj.hideOperatePanel(false); } });
            return tips;
        }
    });
    SpaceEditObj.setCtrlDisabled = function (arrCtrl, bDisabled) {
        for (var i = 0; i < arrCtrl.length; i++) {
            arrCtrl[i].disabled = bDisabled;
        }
    }
    SpaceEditObj.getOperateHTML = function (row) {
        //var html = this.getSingleHTML("doSignal", "信息表");
        var html = "";
        if (!spaceListInfo.bCarding) {
            if (spaceListInfo.bCanEditSpaceDesc) {
                html += this.getSingleHTML("doEditSpaceDesc", "<img style='width:18px;height:18px' src='/Images/Report/edit.ico'>", "编辑间隔名称");
            }
            html += this.getSingleHTML("doSignal", "<img style='width:18px;height:18px' src='/Images/list.png'>", "查阅间隔信息表");
            html += "&nbsp;";
            html += this.getSingleHTML("doShowDevice", "<img style='width:18px;height:18px' src='/Images/devlist.bmp'>", "查看修改间隔设备");
       }
        else{
            if (row.cells[GetColIndex(this.ctrl, "间隔名称")].innerText == "") {
                html += "&nbsp;" + this.getSingleHTML("doSetting", "<img style='width:18px;height:18px' src='/Images/edit_24.png'>", "设置间隔");
            }
            else {
                html += "&nbsp;<img style='width:18px;height:18px' src='/Images/edit_24_gray.png'>";
            }
        }
        if (!this.canModify(row))
            return html;
        if (row.cells[0].style.display == "none") {
            if (row.cells[0].innerText == "0")
                return html;
            //return html + this.getOperateHTMLByMode(row.cells[0].innerText, row);
        }
        //return html + this.getOperateHTMLByMode(this.nModifyMode, row);
        //html += "&nbsp;";
        //html += this.getSingleHTML("doRefreshDeviceSignal", "<img style='width:18px;height:18px' src='/Images/devlist.bmp'>", "刷新间隔设备和信号");
        return html + "&nbsp;" + this.getSingleHTML("doDelete", "<img style='width:18px;height:18px' src='/Images/delete_blue.png'>", "删除此间隔及相关设备");
    }
    SpaceEditObj.doEditSpaceDesc = function (row) {
        if (!FullEditPageObj.saveAll())
            return;
        var arrOldData = this.getDataFromRow(row);
        var str = Ysh.prompt("请输入间隔名称", "请输入间隔名称", arrOldData[1], 200, 100);
        if (!str)
            return false;
        var arrUpdateData = [];
        for (var i = 0; i < arrOldData.length; i++) {
            if (i == 1) {
                arrUpdateData.push(str);
            }
            else {
                arrUpdateData.push(arrOldData[i]);
            }
        }
        var id = this.getIdFromRow(row);
        this.onUpdate(id, arrOldData, arrUpdateData, row);
        refreshSpace();
    }
    SpaceEditObj.doSignal = function (row) {
        if (!FullEditPageObj.saveAll())
            return;
        var id = this.getIdFromRow(row);
        var bEdit = spaceListInfo.canEditSpaceSignal ? "1" : "0";
        var bReplace = spaceListInfo.canReplaceSpaceSignal ? "1" : "0";
        Ysh.Web.showDialog("/p.aspx?f=UpdateSpaceSignal&SpaceId=" + id + "&itemid=" + itemid + "&edit=" + bEdit + "&replace=" + bReplace + "&a=" + Math.random(), null, "dialogWidth:900px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no;scroll:no;");
    }                 //
    SpaceEditObj.doSetting = function (row) {
        if (!FullEditPageObj.saveAll())
            return;
        var id = this.getIdFromRow(row);
        var ret = Ysh.Web.showDialog("/p.aspx?f=CardingSpaceList&spaceid=" + id + "&staid=" + staid + "&itemid=" + itemid + "&a=" + Math.random(), null, "dialogWidth:720px; dialogHeight:600px; center:yes; help:no; resizable:no; status:no;scroll:no;");
        if (!ret)
            return;
        refreshSpace();
        Execute("dkLib:dkLib.SpaceEdit.RefreshYxStandardSignal", [id], "", true);//Modify by gud，修改了方法名称
    }
    SpaceEditObj.doShowDevice = function (row) {
        /*if (!FullEditPageObj.saveAll())
            return;
        var id = this.getIdFromRow(row);
        refreshDeviceList([{ id: "spaceid", value: id }]);*/
        ShowDevice();
    }
    SpaceEditObj.doRefreshDeviceSignal = function (row) {
        if (!FullEditPageObj.saveAll())
            return;
        var id = this.getIdFromRow(row);
        Execute("dkLib:dkLib.SpaceEdit.UpdateSpaceDeviceAndSignal", [itemid, id, spaceListInfo.bCarding], "", true);
    }
    SpaceEditObj.canModify = function (row) {
        var id = this.getIdFromRow(row);
        return (spaceListInfo.isSpaceCanEdit(id) && canModifySignalInSpace(id));
    }
    SpaceEditObj.onCreate = function (arrData, row) {
        var o = this;
        var id = Execute("dkLib:dkLib.SpaceEdit.InsertSpace", [itemid, o.GetFileName(), o.GetArgs(), arrData, spaceListInfo.bCarding], "创建", true);
        if (id > 0) {
            AddCanEditSpaceList(id);
            backExecute("dkLib:dkLib.SpaceBackEdit.Execute", [[id]]);
            return id;
        }
        return false;
    }
    SpaceEditObj.onUpdate = function (id, arrOldData, arrData, row) {
        var o = this;

        if (o.IsChange(arrData, arrOldData) && !confirm("清空" + arrData[1] + "下所有间隔、设备和信号；确认提交吗？"))
            return false;
        var id = Execute("dkLib:dkLib.SpaceEdit.UpdateSpace", [itemid, o.GetFileName(), o.GetArgs(), id, arrData, arrOldData, spaceListInfo.bCarding], "保存", true);
        if (id !== undefined) {
            id = this.getIdFromRow(row);
            //refreshDeviceList([{ id: "spaceid", value: id }]);
            refreshDeviceChange(id);
            backExecute("dkLib:dkLib.SpaceBackEdit.Execute", [[id]]);
            return true;
        }
        return false;
    }
    SpaceEditObj.IsChange = function(arrData, arrOldData){
        //0-间隔类型，1-间隔名称，2-间隔属性，3-高压侧电压等级，4-低压侧电压等级，5-接线形式
        return arrData[0] != arrOldData[0] || arrData[2] != arrOldData[2] || arrData[3] != arrOldData[3] || arrData[4] != arrOldData[4] || arrData[5] != arrOldData[5];
    }
    SpaceEditObj.onDelete = function (id, arrData, row) {
        if (!confirm(this.getDeleteMsg(id, arrData, row)))
            return false;
        var o = this; 
        id = Execute("dkLib:dkLib.SpaceEdit.DeleteSpace", [itemid, o.GetFileName(), o.GetArgs(), id, staid, arrData, spaceListInfo.bCarding], "删除", false);
        if (id === false)
            return false;
        DelCanEditSpaceList(id);
        if (id !== undefined)
            return true;
        return false;
    }    //
    SpaceEditObj.doDelete = function (row) {
        if (this.editInfo.row != null)
            return;
        var id = this.getIdFromRow(row);
        if (!this.onBeforeDelete(id, row)) return;
        var arrDeleteData = this.getDataFromRow(row); 
        var _this = this;
        executeBackSpace([id], function () {
            if (!_this.onDelete(id, arrDeleteData, row))
                return;
            _this.data.erase(arrDeleteData);
            var rowIndex = _this.deleteGroup(row);
            if (_this.posIndex != null) { //修改顺序列
                for (var r = rowIndex; r < _this.ctrl.rows.length - _this.bottomrows; r += _this.rowsPerGroup) {
                    _this.updateRowIndex(_this.ctrl.rows[r]);
                }
            }
            for (var i = rowIndex; i < _this.ctrl.rows.length - _this.bottomrows; i += _this.rowsPerGroup) {
                _this.setRowStyles(_this.getGroupRows(SpaceEditObj.ctrl.rows[i]));
            }
            _this.onAfterDelete(id);
        });
    }    
    SpaceEditObj.onBeforeCreate = function (arrInsertData, row) {//设置stid
        this.setStID(arrInsertData);
    }
    SpaceEditObj.onBeforeUpdate = function (id, arrUpdateData, arrOldData, row) {
        this.setStID(arrUpdateData);
    }
    SpaceEditObj.setStID = function (arrData) {
        var stid = this.GetArgs().getKeyValue("stid");
        if (stid)
            arrData[0] = stid;
    }
    SpaceEditObj.setRowShowData = function (rows, arrData) {
        for (var r = 0; r < rows.length; r++) {
            for (var c = 0; c < this.arrYshIndex[r].length; c++) {
                if (this.isIndexCell(r, c)) {
                    this.updateRowIndex(rows[r]);
                    continue;
                }
                if (this.isSelectCell(r, c)) {
                    rows[r].cells[c].innerHTML = "<input type='checkbox' value='" + this.getIdFromData(arrData) + "' />";
                    continue;
                }
                if (this.isOperateCell(r, c)) {
                    var id = this.getIdFromData(arrData);
                    rows[r].cells[c].innerHTML = (id == "") ? "&nbsp;" : this.getOperateHTML(rows[r]);
                    continue;
                }
                if (this.isLinkCell(c)) {
                    var text = arrData[this.arrYshIndex[r][c][0].idxData];
                    rows[r].cells[c].innerHTML = "<a href='#' title='查看" + text + "设备' onclick='ShowDevice();return false;'>" + text + "</a>";
                    continue;
                }
                rows[r].cells[c].innerHTML = this.getCellShowHtml(rows, arrData, r, c);
            }
        }
        if (spaceListInfo.canEditSpaceList.contains(this.getIdFromData(arrData)))
            rows[0].cells[0].style.backgroundColor = "red";
    }
    SpaceEditObj.isLinkCell = function (c) {
        return c == this.colIndex;
    }
    SpaceEditObj.isValid = function (row, ysh) {
        //检查mainvol和lineid
        if (ysh.desc == "ddlVol" && row.cells[spaceListInfo.COL_MAINVOL].style.display != "none" && ysh.GetValue() == "") {
            alert("请选择电压等级！");
            return false;
        }
        if (ysh.desc == "ddlLine" && row.cells[spaceListInfo.COL_LINE].style.display != "none" && ysh.GetValue() == "") {
            alert("请选择接线形式！");
            return false;
        }
        return true;
    }
}
//显示电压等级下间隔
function showSpaceList(sta, vol, volValue, obj, lineid) {
    cancelEditRow(spaceListInfo.objs);
    cancelEditRow(deviceEditInfo.objs);
    initOtherInfo(sta, vol, volValue, obj);
    refreshSpaceList(sta, vol, volValue, lineid);
    if (typeof deviceEditInfo != "undefined")
        deviceEditInfo.curVoltage = vol;
}

function cancelEditRow(arrObj) {
    for (var i = 0; i < arrObj.length; i++) {
        if (arrObj[i].editInfo.row != null)
            arrObj[i].doCancel(arrObj[i].editInfo.row);
    }
}

//显示其他信息
function initOtherInfo(sta, vol, volValue, obj) {
    var isDone = $(obj).attr("isDone");
    $("#" + strPrefix + "trNext").find(":checkbox").prop("checked", isDone == 1).attr({ staid: sta, volid: vol })
        .end().find("span[name='voltext']").text(volValue)
        .end().find(":submit").attr("volid", vol).css("display", obj.next("div:visible[name='vol']").length > 0 ? "" : "none");
}
//显示间隔列表
function refreshSpaceList(sta, vol, volValue, lineid) {
    clearSpaceList();
    refreshSpaceType();
    GetSpaceList(sta, vol, volValue, lineid);
    InitMainConfig(sta, vol, volValue, lineid);
    if (spaceListInfo.data.length == 0)
        return;
    for (var i = 0; i < spaceListInfo.data.length; i++) {
        var contentDiv = GetContentDiv(i);
        var newSpaEdit = SpaceEditObj.clone("spaceListInfo.objs[" + i.toString() + "]", contentDiv);
        newSpaEdit.dataIndex = i;
        newSpaEdit.Refresh(1);
        SetListStyle(newSpaEdit);
        spaceListInfo.objs.push(newSpaEdit);
    }
    refreshSpaceArg(sta, vol, volValue,lineid);
}
function refreshSpaceArg(sta, vol, volValue, lineid) {
    for (var i = 0; i < spaceListInfo.objs.length; i++) {
        var obj = spaceListInfo.objs[i];
        obj.stid = spaceListInfo.data[i][0];
        var arrArg = [{ id: "staid", value: sta }, { id: "volid", value: vol }, { id: "lineid", value: lineid}];
        var arrInfo = spaceListInfo.data[i];
        var divButton = $(obj.ctrl).find("div[name='divButton']");
        if (arrInfo[3] == "串" || arrInfo[3] == "主变") {
            arrArg.push({ id: "parentsp", value: obj.stid });
            $(obj.ctrl).find("[name='stname']").attr({ stname: arrInfo[3], volid: vol });
            divButton.html(GetAddHtml("", 0, arrInfo[0], arrInfo[3], arrInfo[1]));
            if (spaceListInfo.isSpaceCanEdit(arrInfo[0])) {
                $(obj.ctrl).find("[name='stname']").parent().parent().append("<img src='Images/Report/edit.ico' style='height:15px;cursor:pointer;' title='修改" + arrInfo[3] + "名称' onclick='EditMainSpace(" + spaceListInfo.data[i][0] + ")'/>&nbsp;<img src='Images/Report/delete.ico' title='删除" + arrInfo[3] + "及其下间隔' style='height:15px;cursor:pointer;' onclick='DeleteMainSpace(" + spaceListInfo.data[i][0] + ")'/>");
            }
        }
        else if (arrInfo[3] == "开关间隔") {
            arrArg.push({ id: "parentsp", value: obj.stid });
            $(obj.ctrl).find("[name='stname']").attr({ stname: arrInfo[3] });
            divButton.html(GetAddHtml(arrInfo[4] == "" ? arrInfo[5] : arrInfo[4]));
        }
        else if (arrInfo[3] == "其他") {
            $(obj.ctrl).find("[name='stname']").attr({ stname: arrInfo[3] });
            divButton.html(GetAddHtml("", 3));
        }
        else {
            arrArg.push({ id: "stid", value: obj.stid });
            divButton.html(GetAddHtml(arrInfo[4] == "" ? arrInfo[5] : arrInfo[4]));
        }
        obj.lineid = lineid;
        obj.setArgs(arrArg);
        var text = spaceListInfo.data[i][1];
        $(obj.ctrl).find("[name='stname']").text(text).attr("index", i).click(function () {
            ShowSpace(this);
            return false;
        }).attr("title", "查看" + text + "设备");
    }
}
//显示主变添加选项
function InitMainConfig(sta, vol, volValue, lineid) {
    var trMainTrans = $("#" + strPrefix + "trMainTrans");
    var divBunch = $("#" + strPrefix + "divBunch");
    trMainTrans.hide();
    divBunch.hide();
    if (volValue == "主变") {//主变
        if (!spaceListInfo.isSpaceCanAdd())
            return false;
        var o = ExecuteReader("ConnMain", "GetMainConfig", [], "获取主变配置", true);//TODO:传入接线形式
        if (o && o.length > 0) {
            trMainTrans.find("[name='divButton']").attr("volid", vol).html(GetAddHtml(o[0][0], 2));
            trMainTrans.show();
        }
    }
    else {//串
        var o = Execute("dkLib:dkLib.SpaceEdit.IsBunch", [sta, vol], "获取串配置", true);
        if (!o) {
            return false;
        }
        divBunch.find("[name='divButton']").attr({ "volid": vol, "lineid": lineid }).html(GetAddHtml("串", 1));
        divBunch.show();
    }
}
//获取添加的html,
//type:0-添加，复制到按钮 
//     1-新增txt台
//     2-I母，II母
//     3-新增select
function GetAddHtml(str, type, spaceid, spacetypename, spacename) {
    if (!spacetypename)
        spacetypename = "间隔";
    /*if (!spaceListInfo.isSpaceCanEdit(spaceid)) {
    if ((type == 0) && (spaceListInfo.canEditSpace && spaceListInfo.canEditAllSpace))
    return GetButtonHtml("复制到其他" + spacetypename, "CopySpace(" + spaceid + ",\"" + escape(spacename) + "\")");
    return "";
    }*/
    if (!spaceListInfo.isSpaceCanAdd())
        return "";
    if (type == undefined) {
        if (str.indexOf(",") > 0)
            type = 2;
        else
            type = 1;
    }
    switch (type) {
        case 0:
            return GetButtonHtml("添加", "AddSpace(0)") + (spaceListInfo.bCarding ? "" : GetButtonHtml("复制到其他" + spacetypename, "CopySpace(" + spaceid + ",\"" + escape(spacename) + "\")"));
        case 1:
            return "新增<input type='text' style='width:30px' value='2'/>" + str + GetButtonHtml("添加", "AddSpace(1)");
        case 2:
            var arr = str.split(",");
            var html = "";
            for (var i = 0; i < arr.length; i++) {
                html += "<input type='checkbox'/>";
                if (arr[i] == "")
                    html += "<input type='text' style='width:30px'/>";
                else
                    html += "<span>" + arr[i] + "</span>";
            }
            if (html != "") html += "&nbsp;";
            return html + GetButtonHtml("确定", "AddSpace(2)"); ;
        case 3:
            return "新增<select style='width:150px'>" + $("#" + strPrefix + "ddlOtherType").html() + "</select>" + GetButtonHtml("确定", "AddSpace(3)");
    }
}
function GetButtonHtml(value, strFunc) {
    return "<input type='button' class='btnDefault' value='" + value + "' onclick='" + strFunc + "'/>";
}
//获取要插入的位置
function GetContentDiv(i) {
    var arrInfo = spaceListInfo.data[i];
    if (arrInfo[3] == "串") {
        return $("#" + strPrefix + "divBunch")[0];
    }
    return SpaceEditObj.ctrl.parentElement.parentElement;
}
//处理列表显示
function SetListStyle(listEdit) {
    HideListCol(listEdit, spaceListInfo.data[listEdit.dataIndex][3]);
}
//根据间隔类型隐藏列
function HideListCol(listEdit, stname) {
    var tbl = listEdit.ctrl;
    if (!tbl.rows || tbl.rows.length == 0)
        return false;
    var arrColIndex = [];
    var arrCol = GetHideListCol(stname);
    var colWidth = Math.round(85 / arrCol.length);
    var trFirst = tbl.rows[1];
    for (var i = 1; i < trFirst.cells.length - 1; i++) {
        var cell = trFirst.cells[i];
        var flag = arrCol.likeContains(cell.innerText);
        if (flag) {
            cell.style.width = colWidth + "%";
            if (flag !== true)
                cell.children[0].innerText = flag;
        }
        else {
            cell.style.display = "none";
            arrColIndex.push(i);
        }
    }
    if (arrColIndex.length == 0)
        return false;
    $(tbl).find("tr:gt(1)").each(function (i, tr) {
        if (tr.cells.length < 2)
            return true;
        $.each(arrColIndex, function (i, item) {
            tr.cells[item].style.display = "none";
        });
    });
    listEdit.hideColIndex = arrColIndex;
}
//根据间隔类型获取需要显示的列
function GetHideListCol(stname) {
    switch (stname) {
        case "串":
        case "开关间隔":
            return ["间隔类型", "间隔名称", "间隔属性", "关联设备1", "关联设备2", "开关编号", "预留点号"];
        case "母线间隔":
        case "母差间隔":
            return ["间隔名称", "间隔属性", "关联设备1", "关联设备2", "预留点号"];
        case "主变":
            return ["间隔类型", "间隔名称", "电压等级", "接线形式", "间隔属性", "关联设备1", "关联设备2", "开关编号", "预留点号"];
        /*case "所用变间隔":
        case "站用变":
            return ["间隔名称", "间隔属性", "电压等级,高压侧电压等级", "低压侧电压等级", "关联设备1,高压侧母线", "关联设备2,低压侧母线", "开关编号,高压侧开关编号", "低压侧开关编号", "预留点号"];*/
        case "接地变间隔":
        case "小电流接地选线装置":
            return ["间隔名称", "间隔属性", "关联设备1", "关联设备2", "开关编号", "消弧线圈接地", "预留点号"];
        case "其他":
            return ["间隔类型", "间隔名称"]; //, "包含设备数量(套)"
        default:
            return ["间隔名称", "间隔属性", "关联设备1", "关联设备2", "开关编号", "预留点号"];
    }
}
//间隔类型点击
function ShowSpace(obj) {
    var arr = new Array();
    var arrData = spaceListInfo.data[$(obj).attr("index")][2];
    if (arrData)
        arrData = arrData[3];
    for (var j = 0; j < arrData.length; j++) {
        arr.push(arrData[j][arrData[j].length - 1]);
    }
    if(typeof refreshDeviceList == "function")
        refreshDeviceList([{ id: "spaceid", value: arr.join(",")}]);
}
//间隔名称点击
function ShowDevice() {
    if (!FullEditPageObj.saveAll())
        return;
    var row = Ysh.Web.getParent(event.srcElement, "TR");
        var obj = FullEditPageObj.getObjByCtrl(Ysh.Web.getParent(row, "TABLE"));
    var id = obj.getIdFromRow(row);
    refreshDeviceList([{ id: "spaceid", value: id}]);
}
//根据标题返回第几列
function GetColIndex(table, name) {
    if (!table.rows || table.rows.length == 0)
        return false;
    var trFirst = table.rows[1];
    var td = $(trFirst).find("td:contains('" + name + "')");
    if (td.length == 0)
        return -1;
    return td.index();
}
function clearSpaceList() {
    for (var i = 0; i < spaceListInfo.objs.length; i++) {
        var obj = spaceListInfo.objs[i];
        obj.ctrl.parentElement.removeChild(obj.ctrl);
        FullEditPageObj.objs.erase(obj);
    }
    spaceListInfo.data = [];
    spaceListInfo.objs = [];
}
function GetSpaceList(sta, vol, volValue, lineid) {
    var o = Execute("dkLib:dkLib.SpaceEdit.GetSpaceList", [sta, vol, volValue, lineid], "获取间隔信息", true);
    if (!o)
        return false;
    spaceListInfo.data = o;
    initCheckSpaceSignal(sta, vol);
}
function GetSonSpaceList(spaceid) {
    var o = Execute("dkLib:dkLib.SpaceEdit.GetSonSpaceList", [spaceid], "获取间隔信息", true);
    if (o === false)
        return false;
    return o;
}
function GetSpaceInfo(sta, vol, stid, lineid) {
    var o = Execute("dkLib:dkLib.SpaceEdit.GetSpaceInfo", [sta, vol, stid, lineid], "获取间隔信息", true);
    if (o === false)
        return false;
    return o;
}
//下一步
function NextStep() {
    var obj = event.srcElement;
    $("#" + $(obj).attr("volid")).next("div[name='vol']").click();
}
//间隔编辑完成
function SetVoltageDone(jqobj, bDone) {
    if (bDone) {
        jqobj.html(jqobj.text() + "<br />(已完成)");
    } else {
        jqobj.text(jqobj.text().replace("(已完成)", ""));
    }
}

function StaVolDone() {
    var obj = event.srcElement;
    var staid = $(obj).attr("staid");
    if (!staid)
        return false;
    var sqlNode = "";
    var oldClass = "";
    var bDone = false;
    if ($(obj).prop("checked")) {
        sqlNode = "InsertStaVolDone";
        oldClass = "btnVolDone";
        bDone = true;
    }
    else {
        sqlNode = "DeleteStaVolDone";
        oldClass = "btnVol";
        bDone = false;
    }
    ExecuteSQL("ConnMain", sqlNode, [staid, $(obj).attr("volid")], "完成设置", true);
    var jqobj = $("#" + $(obj).attr("volid"));
    jqobj.attr({ _class: oldClass, isDone: bDone ? "1" : "0" });
    SetVoltageDone(jqobj, bDone);
}
//添加间隔
//type:0-添加，复制到按钮 
//     1-新增txt台
//     2-I母，II母
//     3-新增select
function AddSpace(type) {
    var o = event.srcElement;
    GShowWorking("正在添加间隔");
    window.setTimeout(function () {
        try { doAddSpace(o, type); } catch (E) { }
        GHideWorking();
    }, 100);
}
function doAddSpace(o,type) {
    var stname = $(o).parent().attr("stname");
    var btnHide = $(o).parent().siblings().children("img[hide]"); //如果列表折叠则展开
    if (btnHide.attr("hide") == "1")
        btnHide.click();
    var obj = FullEditPageObj.getObjByCtrl(Ysh.Web.getParent(o, "TABLE"));
    switch (type) {
        case 0:
            var divCenter = $("#" + strPrefix + "divCenter");
            var scrollTop = divCenter.scrollTop();
            obj.addNewRow();
            divCenter.scrollTop(scrollTop);
            break;
        case 1:
            var txt = $(o).siblings("input:text");
            var iNum = parseInt(txt.val(), 10);
            if (isNaN(iNum))
                return false;
            if (stname == "串") {
                var parentObj = $(o).parent();
                var vol = parentObj.attr("volid");
                var lineid = parentObj.attr("lineid");
                var o = Execute("dkLib:dkLib.SpaceEdit.CreateBunchSpace", [itemid, iNum, staid, vol, -1, lineid, spaceListInfo.bCarding], "添加串", true);
                if (o !== false) {
                    AddCanEditSpaceList(o);
                    refreshSpace();
                    backExecute("dkLib:dkLib.SpaceBackEdit.Execute", [o]);
                }
                return false;
            }
            var arrSpaceNum = new Array();
            for (var i = 0; i < iNum; i++) {
                arrSpaceNum.push("");
            }
            CreateSpaces(arrSpaceNum, o);
            break;
        case 2:
            var sels = $(o).siblings(":checked");
            if (sels.length == 0)
                return false;
            var arrSpaceNum = new Array();
            sels.each(function (i, sel) {
                var spaceNum = $(sel).next().text();
                if (spaceNum == "")
                    spaceNum = $(sel).next().val();
                arrSpaceNum.push(spaceNum);
                $(sel).prop("checked", false);
            });
            $(o).siblings(":text").val("");
            if (stname == "主变") {
                var vol = $(o).parent().attr("volid");
                var o = Execute("dkLib:dkLib.SpaceEdit.CreateMainSpace", [itemid, arrSpaceNum, staid, vol, 0, spaceListInfo.bCarding], "添加主变", true);
                if (o !== false) {
                    AddCanEditSpaceList(o);
                    refreshSpace();
                    backExecute("dkLib:dkLib.SpaceBackEdit.Execute", [o]);
                }
                return false;
            } 
            CreateSpaces(arrSpaceNum, o);
            break;
        case 3:
            var type = $(o).siblings("select").val();
            var value = Ysh.Web.Select.getSelectedText($(o).siblings("select")[0]);
            obj.addNewRow();
            if (!obj.editInfo.row)
                return false;
            obj.editInfo.row.cells[1].children[0].value = type;
            obj.editInfo.row.cells[2].children[0].value = value;
            obj.editInfo.save();
            break;
        default:
            return false;
    }
}
//编辑串和主变
function EditMainSpace(spaceid) {
    var o = event.srcElement;
    var stname = $(o).parent().find("[name='stname']");
    var str = Ysh.prompt("请输入间隔名称", "请输入间隔名称", stname.text(), 200, 100);
    if (!str)
        return false;
    Ysh.Web.Loading(function () { doEditMainSpace(stname, spaceid, str); }, "正在修改串名称");
}
function doEditMainSpace(stname, spaceid, str) {
    var result = false;
    if (stname.attr("stname") == "串") {
        result = Execute("dkLib:dkLib.SpaceEdit.UpdateParentSpace", [itemid, spaceid, str, spaceListInfo.bCarding], "修改", true);
        for (var i = 0; i < spaceListInfo.objs.length; i++) {
            var objEI = spaceListInfo.objs[i];
            if (objEI.stid == spaceid) {
                var spaceList = GetSonSpaceList(objEI.stid);
                if (!spaceList) continue;
                spaceListInfo.data[i] = spaceList[0];
                objEI.Refresh(1);
            }
        }
    }
    else {
        result = ExecuteSQL("ConnMain", "UpdateParentSpace", [itemid, spaceid, str], "修改", true);
    }
    if (result === false)
        return false;
    stname.text(str);
}
//删除串和主变
function DeleteMainSpace(spaceid) {
    var o = event.srcElement;
    var stname = $(o).parent().find("[name='stname']");
    if (!confirm("将删除“" + stname.text() + "”下所有信息，确定删除吗？"))
        return false;
    var result = Execute("dkLib:dkLib.SpaceEdit.DeleteParentSpace", [itemid, spaceid, staid, spaceListInfo.bCarding], "删除", true);
    if (result === false)
        return false;
    refreshSpace();
    DelCanEditSpaceList(result);
}
//复制间隔
function CopySpace(spaceid, spacename) {
    var url = "p.aspx?f=SelectSpace&staid=" + staid + "&spaceid=" + spaceid + "&spacename=" + spacename + "&stid=" + 1 + "&volid=" + 2 + "&spacelist=" + GetCanEditSpaceList() + "&itemid=" + itemid + "&a=" + Math.random();
    var ret = Ysh.Web.showDialog(url, null, "dialogWidth:500px; dialogHeight:500px; center:yes; help:no; resizable:no; status:no;scroll:no;");
    if (!ret)
        return;
    if (!confirm("你确定要将间隔内的设备与信号复制到间隔" + ret[1] + "吗？\r\n此操作会先清空间隔" + ret[1] + "内的所有数据!"))
        return;
    GShowWorking("正在复制间隔");
    window.setTimeout(function () {
        try { doCopySpace(spaceid, ret[0]); } catch (E) { }
        GHideWorking();
    }, 100);
}

function doCopySpace(spaceid, spaceIds) {
    var newSpaceIds = spaceIds.split(',');
    var o = Execute("dkLib:dkLib.SpaceEdit.CopyParentSpace", [itemid, spaceid, newSpaceIds, staid, false, true, spaceListInfo.bCarding], "复制间隔", false);
    if (o === false)
        return;
    for (var i = 0; i < spaceListInfo.objs.length; i++) {
        var objEI = spaceListInfo.objs[i];
        if (newSpaceIds.contains(objEI.stid)) {
            var spaceList = GetSonSpaceList(objEI.stid);
            if (!spaceList) continue;
            spaceListInfo.data[i] = spaceList[0];
            objEI.Refresh(1);
        }
    }
    backExecute("dkLib:dkLib.SpaceBackEdit.ExecuteParent", [newSpaceIds]);
}
function refreshSpace() {
    $("#" + strPrefix + "divLeft").find("div.btnVolSelect").click();
}
function CreateSpaces(arrSpaceNum, element) {
    var editObj = FullEditPageObj.getObjByCtrl(Ysh.Web.getParent(element, "TABLE"));
    var parentsp = GetArgValue("parentsp", editObj.GetArgs());
    var stid = 0;
    if (parentsp == "")
        stid = GetArgValue("stid", editObj.GetArgs());
    var lineid = GetArgValue("lineid", editObj.GetArgs());
    var staid = GetArgValue("staid", editObj.GetArgs());
    var volid = GetArgValue("volid", editObj.GetArgs()); 
    var o = Execute("dkLib:dkLib.SpaceEdit.CreateSpace", [itemid, arrSpaceNum, stid, "1", lineid, staid, volid, parentsp, spaceListInfo.bCarding], "添加间隔", true);
    if (o === false)
        return;
    AddCanEditSpaceList(o);
    for (var i = 0; i < spaceListInfo.objs.length; i++) {
        var objEI = spaceListInfo.objs[i];
        if (objEI == editObj) {
            var spaceList = GetSonSpaceList(objEI.stid);
            if (parentsp == "")
                spaceList = GetSpaceInfo(staid, volid, stid, lineid);
            if (!spaceList) continue;
            spaceListInfo.data[i] = spaceList[0];
            objEI.Refresh(1);
        }
    }
    backExecute("dkLib:dkLib.SpaceBackEdit.Execute", [o]);
}
//点击隐藏/显示列表
function HideList(obj, ext) {
    obj = $(obj);
    var hideObj;
    if (ext == "bunch")
        hideObj = $("#" + strPrefix + "divBunch").find("table");
    else
        hideObj = $(Ysh.Web.getParent(obj[0], "TABLE")).find("tr:gt(0)");
    if (obj.attr("hide") == "1") {
        hideObj.show();
        obj.attr("hide", "0").attr("src", "Images/uparrow2.png");
    }
    else {
        hideObj.hide();
        obj.attr("hide", "1").attr("src", "Images/downarrow2.png");
    }
}
//执行dll方法
function Execute(strFunc, args, strMsg, bAlert) {
    var o = ExecuteBack(function () { return YshGrid.Execute(strFunc, args); });
    if (o.check(strMsg, bAlert))
        return o.value;
    return false;
}
function ExecuteSQL(conn, sqlNode, args, strMsg, bAlert) {
    var o = ExecuteBack(function () { return YshGrid.ExecuteSQL(conn, "SpaceEditSql:" + sqlNode, args); });
    if (o.check(strMsg, bAlert))
        return o.value;
    return false;
}
function ExecuteReader(conn, sqlNode, args, strMsg, bAlert) {
    var o = ExecuteBack(function () { return YshGrid.ExecuteReader(conn, "SpaceEditSql:" + sqlNode, args); });
    if (o.check(strMsg, bAlert))
        return o.value;
    return false;
}
function GetEmptyValue(value) { return Ysh.getDBValue(value); }
//判断数组是否包含元素，包括,分隔的
Array.prototype.likeContains = function (obj) {
    for (var i = 0; i < this.length; i++) {
        var arr = this[i].split(",");
        if (arr[0] == obj) {
            if (arr.length > 1)
                return arr[1];
            return true;
        }
    }
    return false;
}
//判断数组是否包含元素，key-value格式
Array.prototype.getKeyValue = function (key) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id == key)
            return this[i].value;
    }
    return false;
}
function ShowSpacePrompt(type) {
    eve = arguments[0];
    element = window.event ? window.event.srcElement : eve.target;
    obj = element.parentNode;
    while (obj && obj.tagName != "TR") {
        obj = obj.parentNode;
    }
    rowIndex = obj.rowIndex;
    var editObj = FullEditPageObj.getObjByCtrl(Ysh.Web.getParent(element, "TABLE"));
    var stid = GetArgValue("stid", editObj.GetArgs());
    if (!stid) {
        stid = obj.cells[1].children[0].value;
        if (!stid)
            return false;
    }
    if (type == "bh") {
        fillPrompt.showAlertOffset(type, stid, 20);
    }
    else {
        fillPrompt.showAlertOffset(type, stid, 30);
    }
}

function GetArgValue(id, args) {
    for (var i = 0; i < args.length; i++) {
        if (args[i].id == id)
            return args[i].value;
    }
    return "";
}
function AddCanEditSpaceList(spaceid) {
    if (spaceListInfo.canEditAllSpace)
        return;
    spaceListInfo.canEditSpaceList = spaceListInfo.canEditSpaceList.concat(spaceid);
    if (typeof canEditSpaceListChanged != "undefined")
        canEditSpaceListChanged();
}
function DelCanEditSpaceList(arrSpaceID) {
    if (spaceListInfo.canEditAllSpace)
        return;
    for (var i = 0; i < arrSpaceID.length; i++)
        spaceListInfo.canEditSpaceList.erase(arrSpaceID[i]);
    if (typeof canEditSpaceListChanged != "undefined")
        canEditSpaceListChanged();
}
function GetCanEditSpaceList() {
    if (!spaceListInfo.canEditSpace)
        return "0";
    if (spaceListInfo.canEditAllSpace)
        return "";
    return spaceListInfo.canEditSpaceList.join(",");
}

function refreshSpaceType() {
    $(SpaceEditObj.yshCtrlRows[0].children[1].children[0].ctrl).html($("#" + strPrefix + "ddlAllType").html());
}
function canModifySignalInSpace(id) {
    if (typeof (itemid) != "undefined") {
        var bSignalChanged = spaceListInfo.arrCheckSpaceSignal[id];
        if (typeof (bSignalChanged) == "undefined") {
            var ret = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DbAssist.HasData", ["IfSpaceSignalChanged", [id, itemid]]); });
            if (!ret.check("获取间隔信号修改信息", true)) {
                return false;
            }
            else if (ret.value == 1) {
                bSignalChanged = false;
            }
            else if (ret.value == 0) {
                bSignalChanged = true;
            }
            spaceListInfo.arrCheckSpaceSignal[id] = bSignalChanged;
        }
        return bSignalChanged;
    }
    else {
        return true;
    }
}

function initCheckSpaceSignal(sta, vol) {
    var ret = ExecuteBack(function () { return YshGrid.Execute("dkLib:dkLib.DbAssist.GetDataList", ["InitSpaceSignalChanged", [sta, vol, itemid]]); });
    if (!ret.check("获取间隔信号修改信息", true)) {
        return false;
    }
    var arr = ret.value;
    for (var i = 0; i < arr.length; i++) {
        spaceListInfo.arrCheckSpaceSignal[arr[i][0]] = arr[i][1] == 0;
    }
}