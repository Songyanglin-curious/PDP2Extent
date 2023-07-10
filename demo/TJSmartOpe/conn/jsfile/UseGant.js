function ShowModalDialog(url, arg, filt) {
    var ua = navigator.userAgent.toLowerCase(); //客户端浏览器信息
    var size = "";
    if (window.ActiveXObject)//判断IE浏览器
        size = ua.match(/msie ([\d.]+)/)[1]; //得出IE的版本大小
    if (size == "6.0") {
        var filtarr = filt.split("dialogWidth:");
        if (filtarr.length == 2) {
            var iWidth = parseFloat(filtarr[1].substring(0, filtarr[1].indexOf(";")).replace("px", ""));
            filt = filtarr[0] + "dialogWidth:" + (iWidth + 20).toString() + filtarr[1].substring(filtarr[1].indexOf(";"));

            filtarr = filt.split("dialogHeight:");
            if (filtarr.length == 2) {
                var iWidth = parseFloat(filtarr[1].substring(0, filtarr[1].indexOf(";")).replace("px", ""));
                filt = filtarr[0] + "dialogHeight:" + (iWidth + 50).toString() + filtarr[1].substring(filtarr[1].indexOf(";"));
            }
        }
    }
    return window.showModalDialog(url, arg, filt);
}

function ClearGantte(objGantte) {
    objGantte.InitData();
}

//重写ActiveX.js中的parseCol
function parseCol(arrCols) {
    var act_Cols = new Array();
    var arrName = new Array();
    var actCol = null;

    for (var i = 0; i < arrCols.length; i++) {
        var arr = arrCols[i];
        if (arr._isShow == false)
            continue;
        if (arr == null)
            return null;
        arrName = new Array();
        arrName.push(arr._desc);
        actCol = new FillGantteCol(arr._width, arrName, (arr._align_t ? arr._align_t : "center"), (arr._align_v ? arr._align_v : "middle"));
        act_Cols.push(actCol);
    }
    return act_Cols;
}

//重写ActiveX.js中的menuGannte
function menuGannte(mCmd, mShow, mName, mFunction, bIsShow) {
    this._Cmd = mCmd;
    this._Show = mShow;
    this._Name = mName;
    this._Function = mFunction;
    this._IsShow = bIsShow;
}

//甘特图数据
function GantData(tid, times, GroupId, Desc, arrShow, Color, TreeExt, Rows, strSplit) {
    (arr = {
        _tid: tid, //记录id
        _time: times.split(strSplit), //时间数组(开始时间,结束时间)
        _groupID: GroupId, //组id
        _desc: Desc, //描述
        _arrShow: arrShow.split(strSplit), //显示数据数组（请根据表头长度传值）
        _color: Color, //字体颜色
        _treeExt: TreeExt, //纵树(一般没用)
        _rows: Rows
    })
    return arr;
}

//甘特图表头
function GantListTitle(Desc, strWidth, align_t, align_v) {
    (arr = {
        _desc: Desc, //描述
        _width: strWidth, //宽度
        _align_t: align_t, //横向布局
        _align_v: align_v, //纵向布局
        _isShow: true//是否显示该列
    })
    return arr;
}

//甘特图属性变更对象
function GantSetType(set, value) {
    (arr = {
        _setName: set,
        _value: value
    })
    return arr;
}

//gant对象
function GetObjGant(GantId) {
    (objGant = {
        obj_: document.getElementById(GantId), //甘特图对象
        allEvent: new Array(), //显示字段数组
        ListFontSize: 12, //列表字号         
        TipFontSize: 12, //tip字号      
        arrMenus: new Array(), //右键数组
        DataArr: new Array(), //数据源
        RelationURL: "#", //添加关联地址
        SetTypeStr: new Array(), //变更属性数组
        strSplit: ",", //分隔符
        _Name: "", //名字（ajax需要使用）
        bIsIndex: true, //是否首列序号

        SetAllEvent: function (arr) {//填充表头数组
            this.allEvent = new Array();
            if (this.bIsIndex)
                this.allEvent.push(GantListTitle("序号", SysDesc.NumWidth, "center", "middle"));

            if (arr != []) {
                for (var i = 0; i < arr.length; i++) {
                    this.allEvent.push(GantListTitle(arr[i][1], arr[i][0], arr[i][2], arr[i][3]));
                }
            }
        },

        SetArrMenus: function (arr) {//填充右键数组            
            this.arrMenus = new Array();
            this.arrMenus.push(new menuGannte('1000', 'lPrimaryID != -1', SysDesc.Locate, 'objGant.GotoDate("<_type><_Dt>" + GetStartDate(lPrimaryID) + "</_Dt></_type>");', true));
            this.arrMenus.push(new menuGannte('1001', 'lPrimaryID != -1', SysDesc.Edit, ' GantId.AddAndEdit(eval(strURL), EditParam, lPrimaryID, groupID);', true));
            this.arrMenus.push(new menuGannte('1001', 'lPrimaryID == -1', SysDesc.Add, ' GantId.AddAndEdit(eval(strURL), EditParam, lPrimaryID, groupID);', true));
            if (arr != null) {
                for (var i = 0; i < arr.length; i++) {
                    this.arrMenus.push(new menuGannte(arr[i][0], arr[i][2], arr[i][1], arr[i][3], true));
                }
            }
        },

        SetDataArr: function (arr) {//填充内容数组
            this.DataArr = new Array();
            if (arr != null) {
                for (var i = 0; i < arr.length; i++) {
                    var arrRow = ((this.bIsIndex ? (i + 1) + this.strSplit : "") + arr[i][4]).toString().split(this.strSplit);
                    var strRow = '';
                    for (var j = 0; j < arrRow.length; j++) {
                        if (this.allEvent[j]._isShow) strRow += arrRow[j] + this.strSplit;
                    }
                    strRow = strRow.length == 0 ? '' : strRow.substring(0, strRow.length - this.strSplit.length);
                    this.DataArr.push(GantData(arr[i][1], arr[i][3], arr[i][0], arr[i][2], strRow, arr[i][5], arr[i][6], i, this.strSplit));
                }
            }
        },

        Show: function () {//显示
            this.SetTypeFunction();
            ClearGantte(this.obj_);
            if (this.DataArr != null)
                for (var i = 0; i < this.DataArr.length; i++) {
                    FillGatteRow(this.obj_, this.DataArr[i]._tid, this.DataArr[i]._time, this.DataArr[i]._groupID, this.DataArr[i]._desc, this.DataArr[i]._arrShow, this.DataArr[i]._color, this.DataArr[i]._treeExt, this.DataArr[i]._rows);
                }
            this.obj_.UpdateWndByData();
            return false;
        },

        AddAndEdit: function (strURL, EditParam, lPrimaryID, groupID) {//添加和编辑
            if (strURL + "" == "") {
                alert("未设定编辑地址");
                return;
            }
            var param = "";
            for (var i = 0; i < EditParam.length; i++) {
                if (eval(EditParam[i][1]) != undefined)
                    param += EditParam[i][0] + "=" + eval(EditParam[i][1]);
                else
                    param += EditParam[i][0] + "=" + EditParam[i][1];
                if (param != "")
                    param += "&";
            }
            param += "1=1";
            var bretval = ShowModalDialog(strURL + "?" + param, null, "dialogWidth:500px; dialogHeight:" + 650 + "px; dialogLeft:" + 300 + "px; dialogTop:" + 200 + "px; status:no; directories:yes;scrollbars:no;Resizable=no; ");
            if (bretval)
                GantId.Show();
            else
                alert('操作失败');
            return;
        },

        Del: function (tid) {//删除
            alert(UserControl_GantteGraph.Del(tid, this._Name).value);
        },

        Relation: function (title) {//添加修改关联
            window.open(this.RelationURL, title, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,copyhistory=yes,width=600,height=400,left=" + (screen.width / 2 - 300) + ",top=" + (screen.height / 2 - 200));
        },

        DropRelation: function (tid, groupID) {//解除关联（分离单条）
            alert(UserControl_GantteGraph.DropRelation(tid, groupID, this._Name).value);
        },

        DropRelationAll: function (groupID) {//解除关联（解散整组）
            alert(UserControl_GantteGraph.DropRelationAll(groupID, this._Name).value);
        },

        ShowTime: function (lPrimaryID) {//定位甘特图

        },

        SetTypeFunction: function () {//甘特图属性变更
            var act_Cols = parseCol(this.allEvent);
            for (var i = 0; i < this.SetTypeStr.length; i++) {
                this.obj_.SetTypeItem(this.SetTypeStr[i]._setName, this.SetTypeStr[i]._value);
            }
            SetGantteTemplate(this.obj_, 1, 1, 40, 40, act_Cols);
        },

        HidMenus: function (num) {//要隐藏的右键ID，逗号分隔
            var arrHid = num.toString().split(',');
            for (var i = 0; i < this.arrMenus.length; i++) {
                for (var j = 0; j < arrHid.length; j++) {
                    if (arrHid[j] == this.arrMenus[i]._Cmd) this.arrMenus[i]._IsShow = false;
                }
            }
        },

        SetNumWidth: function (strWidth, arr) {//重置序号列宽度
            SysDesc.NumWidth = strWidth;
            this.SetAllEvent(arr);
        },

        SetGantWidth: function (strWidth) { //甘特图左侧列表显示百分比
            this.SetTypeStr.push(GantSetType("_GanttGridGraphRate", strWidth));
        }
    })
    return objGant;
}

var SysDesc = {
    Locate: '定位甘特图', //定位甘特图描述文字
    Edit: '编辑数据', //编辑数据描述文字
    Add: '新建数据', //新建数据描述文字
    NumWidth: '5%' //序号列宽
}

//MenuStart
//GantId：gant对象 
function MenuStartFunction(groupID, lPrimaryID, lMinorID, szP, szExtData, GantId) {
    var objGant = GantId.obj_;

    for (var i = 0; i < GantId.arrMenus.length; i++) {
        if (eval(GantId.arrMenus[i]._IsShow) && eval(GantId.arrMenus[i]._Show))
            objGant.AddPopMenu(GantId.arrMenus[i]._Cmd, "<d>" + GantId.arrMenus[i]._Name + "</d>");
    }
}

//MenuCommand
//GantId：gant对象 
//strURL：编辑页面地址
//EditParam：参数数组
//groupID, lPrimaryID：组ID，记录ID
function MenuCommandFunction(groupID, lPrimaryID, lMinorID, szP, szExtData, itemid, GantId, strURL, EditParam) {
    var objGant = GantId.obj_;
        for (var i = 0; i < GantId.arrMenus.length; i++) {
            if (GantId.arrMenus[i]._Cmd == itemid.toString()) {
                try {
                    eval(GantId.arrMenus[i]._Function);
                    return;
                } catch (e) {
                    alert('操作异常');
                }
            }
        }
    }

//MouseDClick
//strIsDbl：执行条件
//strFunction：执行语句
function MouseDClickFunction(groupID, lPrimaryID, lMinorID, szP, szExtData, GantId, strFunction, strIsDbl) {
    if (eval(strIsDbl)) {
        eval(strFunction);
    }
}