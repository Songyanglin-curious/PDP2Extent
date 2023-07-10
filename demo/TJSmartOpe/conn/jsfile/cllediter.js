/*
报表常量
*/
//报表标签格式索引
var FIELD_NAME = 0; //标签名称
var FIELD_TYPE = 1; //标签类型
var FIELD_STYLE = 2; //标签样式
var FIELD_FORMAT = 3; //标签格式化
var FIELD_GROUPNAME = 4; //标签分组名称
var FIELD_BLOCKNAME = 5; //标签块名称
var FIELD_PARENTBLOCKNAME = 6; //标签父级模块名称
var FIELD_SHOW = 7;

//报表标签样式类型
var FIELD_STYLE_INC = "INC";
var FIELD_STYLE_VINC = "VINC";
var FIELD_STYLE_H = "H";
var FIELD_STYLE_AUTOCR = "AUTOCR";
var FIELD_STYLE_AUTOMERGE = "AUTOMERGE";
var FIELD_STYLE_INSERTC = "INSERTC";
var FIELD_STYLE_INSERTR = "INSERTR";
var FIELD_STYLE_INSERTBYWHOLE = "INSERTBYWHOLE";
var FIELD_STYLE_VGROUP = "VGROUP";

var FIELD_LABEL_PREV = "<<<";
var FIELD_LABEL_LAST = ">>>";
var FIELD_LABEL_DATA = ",";
var FIELD_LABEL_STYLE = "@@@";
var FIELD_LABEL_NOTE_PREV = "{";
var FIELD_LABEL_NOTE_LAST = "}";
var FIELD_LABEL_EMPTY = FIELD_LABEL_PREV + "EMPTY" +FIELD_LABEL_LAST;

var FIELD_TYPE_STR = "STR";
var FIELD_TYPE_NUM = "NUM";
var FIELD_TYPE_NUMSTR = "NUMSTR";
var FIELD_TYPE_TIME = "TIME";
var FIELD_TYPE_SPAN = "SPAN";
var FIELD_TYPE_BMP = "BMP";
var FIELD_TYPE_PAGE = "PAGE";
var FIELD_TYPE_SAME = "SAME";
var FIELD_TYPE_JOIN = "JOIN";
var FIELD_TYPE_SUM = "SUM";
var FIELD_TYPE_FORMULA = "FORMULA";
var FIELD_TYPE_MAX = "MAX";
var FIELD_TYPE_MIN = "MIN";
var FIELD_TYPE_AVERAGE = "AVERAGE";
var FIELD_TYPE_URL = "URL";
var FIELD_TYPE_ENUM = "ENUM";
var FIELD_TYPE_INDEX = "INDEX";
var FIELD_TYPE_INDEXBY = "INDEXBY";
var FIELD_TYPE_MAXCELL = "MAXCELL";
var FIELD_TYPE_MINCELL = "MINCELL";
                      
/*    
单元格处理对象
wanglei 2011-12-19 add
*/
function CellInfo($, window, opt) {
    this.text = opt.text || "";
    this.col = opt.coll || [];
    this.row = opt.row || [];  
    this.labels = [];
    this.sheet = -1;
    this.index = -1;
    this.getLabel = function(index){
        var property = null;
        for (var i = 0; i < this.labels.length; i++) {
            if (this.labels[i].index == index) {
                property = this.labels[i];
            }
        }
        return property;
    }
    this.getBuildCellString = function () {
        //按规则建立标签
        var result = [];
        for (var i = 0; i < this.labels.length; i++) {
            var property = this.labels[i];
            var label = FIELD_LABEL_PREV;
            label += property.name;
            if (property.type.length > 0) {
                label += FIELD_LABEL_DATA;
                label += property.type;
                label += FIELD_LABEL_DATA;
                if (property.type == FIELD_TYPE_SAME || property.type == FIELD_TYPE_JOIN ||
                property.type == FIELD_TYPE_SUM || property.type == FIELD_TYPE_FORMULA ||
                property.type == FIELD_TYPE_MAX || property.type == FIELD_TYPE_MIN ||
                property.type == FIELD_TYPE_AVERAGE || property.type == FIELD_TYPE_INDEXBY || property.type == FIELD_TYPE_MAXCELL || property.type == FIELD_TYPE_MINCELL) {
                    label += property.data;
                }
                else {
                    var style = "";
                    if (property.inc != "") {
                        style += property.inc + FIELD_LABEL_STYLE;
                    }
                    if (property.vinc != "") {
                        style += property.vinc + FIELD_LABEL_STYLE;
                    }
                    if (property.h != "") {
                        style += property.h + FIELD_LABEL_STYLE;
                    }
                    if (property.autocr != "") {
                        style += property.autocr + FIELD_LABEL_STYLE;
                    }
                    if (property.automerge != "") {
                        style += property.automerge + FIELD_LABEL_STYLE;
                    }
                    if (property.insertc != "") {
                        style += property.insertc + FIELD_LABEL_STYLE;
                    }
                    if (property.insertr != "") {
                        style += property.insertr + FIELD_LABEL_STYLE;
                    }
                    if (property.insertbywhole != "") {
                        style += property.insertbywhole + FIELD_LABEL_STYLE;
                    }
                    if (property.vgroup != "") {
                        style += property.vgroup + FIELD_LABEL_STYLE;
                    }
                    if (style.length > 0) {
                        style = style.substring(0, style.length - FIELD_LABEL_STYLE.length);
                    }
                    label += style;
                }
                if (property.format.length > 0) {
                    label += FIELD_LABEL_DATA;
                    label += property.format;
                }
                if (property.groupname.length > 0) {
                    if (property.format.length == 0) { label += FIELD_LABEL_DATA; }
                    label += FIELD_LABEL_DATA;
                    label += property.groupname;
                }
                if (property.blockname.length > 0) {
                    if (property.groupname.length == 0) { if (property.format.length == 0) { label += FIELD_LABEL_DATA; }; label += FIELD_LABEL_DATA; }
                    label += FIELD_LABEL_DATA;
                    label += property.blockname;
                }
                if (property.parentblockname.length > 0) {
                    if (property.blockname.length == 0) { if (property.groupname.length == 0) { if (property.format.length == 0) { label += FIELD_LABEL_DATA; }; label += FIELD_LABEL_DATA; }; label += FIELD_LABEL_DATA; }
                    label += FIELD_LABEL_DATA;
                    label += property.parentblockname;
                }
                if (property.type == FIELD_TYPE_MAXCELL || property.type == FIELD_TYPE_MINCELL) {
                    if (property.parentblockname.length == 0) { if (property.blockname.length == 0) { if (property.groupname.length == 0) { if (property.format.length == 0) { label += FIELD_LABEL_DATA; }; label += FIELD_LABEL_DATA; }; label += FIELD_LABEL_DATA; }; label += FIELD_LABEL_DATA; }
                    label += FIELD_LABEL_DATA;
                    label += property.show;
                }
            }
            label += FIELD_LABEL_LAST;
            result.push(label);
        }
        return result;
    }
    this.parseCellByString = function (cellString, cellNote, c, r) {
        cellString = $.trim(cellString);
        var curPrev = cellString.substring(0, FIELD_LABEL_PREV.length);
        var curEnd = cellString.substring(cellString.length - FIELD_LABEL_LAST.length, cellString.length);
        this.row = r;
        this.col = c;
        this.text = cellNote;       
        //判断是否是标签
        if (FIELD_LABEL_PREV == curPrev && FIELD_LABEL_LAST == curEnd) {
            //计算是否存在多个标签
            var contents = cellString.substring(cellString.length - FIELD_LABEL_LAST.length, FIELD_LABEL_LAST.length).split(FIELD_LABEL_LAST + FIELD_LABEL_PREV);           
            for (var i = 0; i < contents.length; i++) {
                var property = {
                    text: "",
                    name: "",
                    type: "",
                    style: "",
                    data: "",
                    show: "",
                    format: "",
                    groupname: "",
                    blockname: "",
                    parentblockname: "",
                    h: "",
                    inc: "",
                    vinc: "",
                    autocr: "",
                    automerge: "",
                    insertc: "",
                    insertr: "",
                    insertbywhole: "",
                    vgroup: "",
                    end: false,
                    index: 0,
                    parse: function (cellStirng) {
                        var content = cellStirng.split(FIELD_LABEL_DATA);
                        this.name = content[FIELD_NAME];
                        if (content.length == 1) {
                            this.end = true;
                        } else {
                            this.type = content[FIELD_TYPE];
                            if (content.length >= 3) {
                                var styles = content[FIELD_STYLE].split(FIELD_LABEL_STYLE);
                                for (var i = 0; i < styles.length; i++) {
                                    if (styles[i] == FIELD_STYLE_H) {
                                        this.h = styles[i];
                                    }
                                    else if (styles[i] == FIELD_STYLE_INC) {
                                        this.inc = styles[i];
                                    }
                                    else if (styles[i] == FIELD_STYLE_VINC) {
                                        this.vinc = styles[i];
                                    }
                                    else if (styles[i] == FIELD_STYLE_AUTOCR) {
                                        this.autocr = styles[i];
                                    }
                                    else if (styles[i] == FIELD_STYLE_INSERTC) {
                                        this.insertc = styles[i];
                                    }
                                    else if (styles[i] == FIELD_STYLE_AUTOMERGE) {
                                        this.automerge = styles[i];
                                    }
                                    else if (styles[i] == FIELD_STYLE_INSERTR) {
                                        this.insertr = styles[i];
                                    }
                                    else if (styles[i] == FIELD_STYLE_INSERTBYWHOLE) {
                                        this.insertbywhole = styles[i];
                                    }
                                    else if (styles[i] == FIELD_STYLE_VGROUP) {
                                        this.vgroup = styles[i];
                                    }
                                }
                                if (this.type == FIELD_TYPE_SAME || this.type == FIELD_TYPE_JOIN ||
                                    this.type == FIELD_TYPE_SUM || this.type == FIELD_TYPE_FORMULA ||
                                    this.type == FIELD_TYPE_MAX || this.type == FIELD_TYPE_MIN ||
                                    this.type == FIELD_TYPE_AVERAGE || this.type == FIELD_TYPE_INDEXBY || this.type == FIELD_TYPE_MAXCELL || this.type == FIELD_TYPE_MINCELL) {
                                    this.data = content[FIELD_STYLE];
                                }
                            }
                            if (content.length >= 4) {
                                this.format = content[FIELD_FORMAT];
                            }
                            if (content.length >= 5) {
                                this.groupname = content[FIELD_GROUPNAME];
                            }
                            if (content.length >= 6) {
                                this.blockname = content[FIELD_BLOCKNAME];
                            }
                            if (content.length >= 7) {
                                this.parentblockname = content[FIELD_PARENTBLOCKNAME];
                            }
                            if (content.length >= 8) {
                                this.show = content[FIELD_SHOW];
                            }
                        }
                    }
                }
                this.labels.push(property);
                property.index = i;
                property.parse(contents[i]);
            }
        }
    }
};
/*
单元格管理对象
wanglei 2011-12-19 add
*/
var CellObject = (function ($, window, cllEditObject) {
    return {
        cllCurSheet: -1,
        cllOldSheet: -1,
        cllName: '',
        cllCopy: '',
        cllPath: '',
        cllUrl: '',
        curRow: 0,
        curCol: 0,
        cellAry: [],
        cellPrevChangeText: '',
        totalSheets: 0,
        note: {
            createText: function (text) {
                text = $.trim(text);
                var curPrev = text.substring(0, FIELD_LABEL_NOTE_PREV.length);
                var curEnd = text.substring(text.length - FIELD_LABEL_NOTE_LAST.length, text.length);
                if (curPrev != FIELD_LABEL_NOTE_PREV) {
                    text = FIELD_LABEL_NOTE_PREV + text;
                }
                if (curEnd != FIELD_LABEL_NOTE_LAST) {
                    text += FIELD_LABEL_NOTE_LAST;
                }
                return text;
            },
            getAry: function (text) {
                var regNote = /{(.*?)}/gi;
                var cellNoteAry = text.match(regNote);
                return cellNoteAry;
            },
            getValue: function (text) {
                text = $.trim(text);
                var curPrev = text.substring(0, FIELD_LABEL_NOTE_PREV.length);
                var curEnd = text.substring(text.length - FIELD_LABEL_NOTE_LAST.length, text.length);
                if (curPrev == FIELD_LABEL_NOTE_PREV) {
                    text = text.replace(FIELD_LABEL_NOTE_PREV, "");
                }
                if (curEnd == FIELD_LABEL_NOTE_LAST) {
                    text = text.replace(FIELD_LABEL_NOTE_LAST, "");
                }
                return text;
            },
            existText: function (text, etext) {
                var ary = CellObject.note.getAry(text);
                var isHave = false;
                if (ary != null) {
                    for (var i = 0; i < ary.length; i++) {
                        if (ary[i] == etext) {
                            isHave = true;
                            break;
                        }
                    }
                }
                return isHave;
            }
        },
        getCurCellText: function () {
            return cllEditObject.GetCellString(CellObject.curCol, CellObject.curRow, CellObject.cllCurSheet);
        },
        setCurCellText: function (text) {
            cllEditObject.SetCellString(CellObject.curCol, CellObject.curRow, CellObject.cllCurSheet, text);
        },
        getCurrentTotalSheetCount: function () {
            CellObject.totalSheets = cllEditObject.GetTotalSheets();
            return CellObject.totalSheets;
        },
        getSheetLabel: function (s) {
            return cllEditObject.GetSheetLabel(s);
        },
        getAryBySheet: function (sheet) {
            var sheetAry = [];
            for (var i = 0; i < CellObject.cellAry.length; i++) {
                var ary = CellObject.cellAry[i];
                if (ary[1].sheet == sheet) {
                    sheetAry.push(ary[1]);
                }
            }
            return sheetAry;
        },
        getAllLabelBySheet: function (sheet) {
            var sheetAry = [];
            for (var i = 0; i < CellObject.cellAry.length; i++) {
                var ary = CellObject.cellAry[i];
                if (ary[1].sheet == sheet) {
                    for (var j = 0; j < ary[1].labels.length; j++) {
                        sheetAry.push(ary[1].labels[j]);
                    }
                }
            }
            return sheetAry;
        },
        getAllLabelBySheetName: function (name) {
            return CellObject.getAllLabelBySheet(cllEditObject.GetSheetIndex(name));
        },
        notifyChangeText: function (index, text) {
            for (var i = 0; i < CellObject.cellAry.length; i++) {
                var ary = CellObject.cellAry[i];
                if (ary[1].index == index) {
                    ary[0] = text;
                }
            }
        },
        bindlabel: function () {
            $("#tbLabel tr:not(:first)").remove();
            var cellInfo = CellObject.findCellInfo();
            if (cellInfo != null) {
                for (var i = 0; i < cellInfo.labels.length; i++) {
                    var tdContent = "<td><a href='#' onclick='CellObject.showObject(" + cellInfo.labels[i].index + ");'>" + cellInfo.labels[i].text + "</a>&nbsp;&nbsp;<img src='/i/edit.gif' onclick='CellObject.showObject(" + cellInfo.labels[i].index + ");'>&nbsp;<img src='/i/delete.gif' onclick=CellObject.deleteObject(" + cellInfo.labels[i].index + ",'" + cellInfo.labels[i].text + "');></td>";
                    $("<tr>" + tdContent + "</tr>").insertAfter($("#tbLabel tr:eq(" + i + ")"));
                }
            }
        },
        deleteObject: function (index, text) {
            if (confirm('真的要删除此标记吗？')) {
                var cellInfo = CellObject.findCellInfo();
                if (cellInfo != null) {
                    var delText = "";
                    for (var i = 0; i < cellInfo.labels.length; i++) {
                        if (cellInfo.labels[i].index == index) {
                            delText = cellInfo.labels[i].text;
                            cellInfo.labels.splice(i, 1);
                        }
                    }
                    var cellString = CellObject.getCurCellText().replace(delText, '');
                    CellObject.setCurCellText(cellString);
                    cellInfo.text = cellString;
                    CellObject.notifyChangeText(cellInfo.index, cellString);
                    CellObject.clear();
                    CellObject.bindlabel();
                }
            }
        },
        showObject: function (index) {
            $("#tbLabel tr:not(:first)").remove();
            var cellInfo = CellObject.findCellInfo();
            if (cellInfo != null) {
                if (cellInfo.labels.length > 0) {
                    var property = cellInfo.getLabel(index);
                    if (index == 0 && property == null) {
                        property = cellInfo.getLabel(cellInfo.labels[0].index);
                    }
                    if (property == null) {
                        CellObject.clear();
                        return;
                    }
                    $("#txtText").val(CellObject.note.getValue(property.text));
                    $("#txtName").val(property.name);
                    $("#selType").val(property.type);
                    $("#txtGroupName").val(property.groupname);
                    $("#txtBlockName").val(property.blockname);
                    $("#txtParentBlockName").val(property.parentblockname);
                    $("#chkH").attr("checked", property.h != "");
                    $("#chkInc").attr("checked", property.inc != "");
                    $("#chkVinc").attr("checked", property.vinc != "");
                    $("#chkAutoCr").attr("checked", property.autocr != "");
                    $("#chkAutoMerge").attr("checked", property.automerge != "");
                    $("#chkInsertC").attr("checked", property.insertc != "");
                    $("#chkInsertR").attr("checked", property.insertr != "");
                    $("#chkInsertByWhole").attr("checked", property.insertbywhole != "");
                    $("#chkVGroup").attr("checked", property.vgroup != "");
                    $("#txtParams").val(property.format);
                    $("#txtData").val(property.data);
                    $("#txtShow").val(property.show);
                    $("#hidIndex").val(property.index);
                    CellObject.filterStatusByType(property.type);
                    CellObject.bindlabel();
                }
            }
            else {
                CellObject.clear();
            }
        },
        validCellInfo: function (opt) {
            //先验证必填
            if (opt.text == '') {
                alert('请输入单元格文本！');
                return false;
            }
        },
        clear: function () {
            $("#txtText").val("");
            $("#txtName").val("");
            $("#selType").val("");
            $("#txtGroupName").val("");
            $("#txtBlockName").val("");
            $("#txtParentBlockName").val("");
            $("#chkH").attr("checked", false);
            $("#chkInc").attr("checked", false);
            $("#chkVinc").attr("checked", false);
            $("#chkAutoCr").attr("checked", false);
            $("#chkAutoMerge").attr("checked", false);
            $("#chkInsertC").attr("checked", false);
            $("#chkInsertR").attr("checked", false);
            $("#chkInsertByWhole").attr("checked", false);
            $("#chkVGroup").attr("checked", false);
            $("#txtParams").val("");
            $("#txtData").val("");
            $("#txtShow").val("");
            $("#hidIndex").val("");
            CellObject.bindlabel(); //刷新标签列表
        },
        findCellInfo: function () {
            var cellNoteText = CellObject.getCurCellText();
            for (var i = 0; i < CellObject.cellAry.length; i++) {
                var ary = CellObject.cellAry[i];
                if (ary[0] == cellNoteText && ary[1].sheet == CellObject.cllCurSheet) {
                    return ary[1];
                }
            }
            return null;
        },
        findCellInfoByText: function (text) {
            for (var i = 0; i < CellObject.cellAry.length; i++) {
                var ary = CellObject.cellAry[i];
                if (ary[0] == text && ary[1].sheet == CellObject.cllCurSheet) {
                    return ary[1];
                }
            }
            return null;
        },
        bindings: function (opt) {
            // t: 事件类型  n: 绑定控件
            $.each(opt, function (t, n) {
                if (t == "save") {
                    $('#' + n).live('click', function () {
        
                        if (CellObject.curRow == 0 && CellObject.curCol == 0) {
                            return false;
                        }
                        var cellInfo = CellObject.findCellInfo();                      
                        var index = $("#hidIndex").val();
                        var text = CellObject.note.createText($("#txtText").val());
                        var name = $("#txtName").val();

                        if ($.trim(text) == '') { alert('单元格文本不能为空！'); return false; }
                        if ($.trim(name) == '') { alert('字段名称不能为空！'); return false; }

                        var type = $("#selType").val();
                        //验证是否唯一
                        var isSuccess = true;
                        var exLabel = null;
                        for (var i = 0; i < CellObject.cellAry.length; i++) {
                            var ary = CellObject.cellAry[i];
                            for (var j = 0; j < ary[1].labels.length; j++) {
                                if (ary[1].labels[j].name == name && ary[1].sheet == CellObject.cllCurSheet) {
                                    if (cellInfo == null) {
                                        isSuccess = false;

                                    } else {
                                        if (ary[1].index === cellInfo.index) {
                                            if (ary[1].labels[j].index != index) {
                                                isSuccess = false;
                                            }
                                        } else {
                                            isSuccess = false;
                                        }
                                    }
                                    exLabel = ary[1].labels[j];
                                }
                            }
                        }
                        if (!isSuccess) {
                            var isValid = false;
                            if (exLabel != null) {
                                if ($.trim(exLabel.type) != "" && $.trim(type) == "") {
                                    isValid = true;
                                }
                                else if ($.trim(exLabel.type) == "" && $.trim(type) != "") {
                                    isValid = true;
                                }
                            }
                            if (!isValid) {
                                alert("您所填写的字段名称在报表中已经存在,请更换后再进行保存操作！");
                                return false;
                            }
                        }

                        var groupname = $("#txtGroupName").val();
                        var blockname = $("#txtBlockName").val();
                        var parentblockname = $("#txtParentBlockName").val();
                        var format = $("#txtParams").val();
                        var data = $("#txtData").val();
                        var show = $("#txtShow").val();
                        var inc = $("#chkInc").attr("checked") ? FIELD_STYLE_INC : "";
                        var vinc = $("#chkVinc").attr("checked") ? FIELD_STYLE_VINC : "";
                        var h = $("#chkH").attr("checked") ? FIELD_STYLE_H : "";
                        var autocr = $("#chkAutoCr").attr("checked") ? FIELD_STYLE_AUTOCR : "";
                        var automerge = $("#chkAutoMerge").attr("checked") ? FIELD_STYLE_AUTOMERGE : "";
                        var insertc = $("#chkInsertC").attr("checked") ? FIELD_STYLE_INSERTC : "";
                        var insertr = $("#chkInsertR").attr("checked") ? FIELD_STYLE_INSERTR : "";
                        var insertbywhole = $("#chkInsertByWhole").attr("checked") ? FIELD_STYLE_INSERTBYWHOLE : "";
                        var vgroup = $("#chkVGroup").attr("checked") ? FIELD_STYLE_VGROUP : "";
                        var property;
                        if (cellInfo == null) { //创建新标签
                            cellInfo = new CellInfo($, window, "");
                            var initLabel = FIELD_LABEL_PREV + name;
                            if (type != "") {
                                initLabel += FIELD_LABEL_DATA + type;
                            }
                            initLabel += FIELD_LABEL_LAST;
                            cellInfo.parseCellByString(initLabel, text, CellObject.curCol, CellObject.curRow);
                            property = cellInfo.labels[0];
                            var cellString = CellObject.getCurCellText() + text;
                            CellObject.setCurCellText(cellString);
                            cellInfo.text = CellObject.getCurCellText();
                            var isHave = CellObject.note.existText(cellInfo.text, text);
                            if (!isHave) {
                                cellInfo.text += text;
                            }
                            cellInfo.sheet = CellObject.cllCurSheet;
                            cellInfo.index = CellObject.cellAry.length;
                            CellObject.cellAry.push([[CellObject.curCol, CellObject.curRow], cellInfo]);
                            CellObject.notifyChangeText(cellInfo.index, cellInfo.text);
                        }
                        else {
                            property = cellInfo.getLabel(index);
                        }
                        property.text = text;
                        property.name = name;
                        property.type = type;
                        property.groupname = groupname;
                        property.blockname = blockname;
                        property.parentblockname = parentblockname;
                        property.format = format;
                        property.data = data;
                        property.show = show;
                        property.inc = inc;
                        property.vinc = vinc;
                        property.h = h;
                        property.autocr = autocr;
                        property.automerge = automerge;
                        property.insertc = insertc;
                        property.insertr = insertr;
                        property.insertbywhole = insertbywhole;
                        property.vgroup = vgroup;
                        CellObject.bindlabel();
                        alert("单元格属性保存成功！");
                    });
                }
                else if (t == "clear") {
                    $('#' + n).live('click', function () {
                        if (confirm("确定要清空此单元格吗？")) {
                            for (var i = 0; i < CellObject.cellAry.length; i++) {
                                var ary = CellObject.cellAry[i];
                                if (ary[0] == CellObject.getCurCellText()) {
                                    CellObject.cellAry.splice(i, 1);
                                    CellObject.clear();
                                    CellObject.bindlabel(); ;
                                }
                            }
                            cllEditObject.SetCellString(CellObject.curCol, CellObject.curRow, CellObject.cllCurSheet, "");
                            cllEditObject.SetCellNote(CellObject.curCol, CellObject.curRow, CellObject.cllCurSheet, "");
                        }
                    });
                }
                else if (t == "addlabel") {
                    $('#' + n).live('click', function () {
                        if (CellObject.curRow < 1 && CellObject.curCol < 1) {
                            return;
                        }
                        var cellInfo = CellObject.findCellInfo();
                        if (cellInfo == null) { //创建新标签
                            alert('当前单元格还没有生成标记不能完成操作,请填写信息点击："保存单元格" 来生成标记！');
                        }
                        else {
                            if (confirm("您确定要创建新标记吗？")) {
                                CellObject.clear();
                                var maxIndex = 0;
                                for (var i = 0; i < cellInfo.labels.length; i++) {
                                    if (maxIndex < cellInfo.labels[i].index) {
                                        maxIndex = cellInfo.labels[i].index;
                                    }
                                }
                                maxIndex += 1;
                                $("#hidIndex").val(maxIndex);
                                var newLabel = "LABEL" + maxIndex;
                                var newLabelNote = CellObject.note.createText(newLabel);
                                $("#txtName").val(newLabel)
                                $("#txtText").val(CellObject.note.getValue(newLabelNote))
                                CellObject.setCurCellText(CellObject.getCurCellText() + newLabelNote);
                                cellInfo.text = CellObject.getCurCellText();
                                var isHave = CellObject.note.existText(cellInfo.text, newLabelNote);
                                if (!isHave) {
                                    cellInfo.text += newLabelNote;
                                }
                                CellObject.notifyChangeText(cellInfo.index, cellInfo.text);
                                var property = CellObject.clone(cellInfo.labels[0]);
                                property.text = newLabelNote;
                                property.name = newLabel;
                                property.type = "";
                                property.index = maxIndex;
                                property.groupname = "";
                                property.blockname = "";
                                property.parentblockname = "";
                                property.format = "";
                                property.data = "";
                                property.show = "";
                                property.inc = "";
                                property.vinc = "";
                                property.h = "";
                                property.autocr = "";
                                property.automerge = "";
                                property.insertc = "";
                                property.insertr = "";
                                property.insertbywhole = "";
                                property.vgroup = "";
                                cellInfo.labels.push(property);
                                CellObject.bindlabel();
                            }
                        }
                    });
                }
                else if (t == "upload") {
                    $('#' + n).live('click', function () {
                        if (confirm("您确定要向服务器提交当前的所有修改吗？")) {
                            CellObject.upload();
                        }
                    });
                }
            });

            $("#txtText").live('keyup', function () {
                if (CellObject.curCol > 0 && CellObject.curRow > 0) {
                    var cellInfo = CellObject.findCellInfo();
                    if (cellInfo != null) {
                        var index = $("#hidIndex").val();
                        var text = cellInfo.text;
                        var curtext = "";
                        var curindex = 0;
                        var labelText = [];
                        for (var i = 0; i < cellInfo.labels.length; i++) {
                            if (cellInfo.labels[i].index != index) {
                                var replaceText = "<<-&*&->>" + i + "<<-&*&->>";
                                text = text.replace(cellInfo.labels[i].text, replaceText);
                                labelText.push([replaceText, cellInfo.labels[i].text]);
                            }
                            else {
                                curindex = i;
                                curtext = cellInfo.labels[i].text;
                            }
                            //                            if(cellInfo.labels[i].index == index){
                            //                                var text = cellInfo.labels[i].text;
                            //                                alert(text);
                            ////                                var changetext = CellObject.note.createText($("#txtText").val());
                            ////                                cellInfo.text = cellInfo.text.replace(text,changetext);
                            ////                                cellInfo.labels[i].text = changetext;
                            ////                                CellObject.setCurCellText(cellInfo.text);   
                            ////                                CellObject.notifyChangeText(cellInfo.index , cellInfo.text);   
                            //                            }
                        }
                        var changetext = CellObject.note.createText($("#txtText").val());
                        text = text.replace(curtext, changetext);
                        for (var j = 0; j < labelText.length; j++) {
                            text = text.replace(labelText[j][0], labelText[j][1]);
                        }
                        cellInfo.text = text;
                        cellInfo.labels[curindex].text = changetext;
                        CellObject.setCurCellText(cellInfo.text);
                        CellObject.notifyChangeText(cellInfo.index, cellInfo.text);
                    }
                }
            });

        },
        changeNote: function (text, c, r) {
            if (c < 1 && r < 1) {
                return;
            }
            var cellInfo = CellObject.findCellInfoByText(CellObject.cellPrevChangeText);
            if (cellInfo != null) {
                var cellNoteAry = CellObject.note.getAry(text);
                if (cellNoteAry != null) {
                    for (var l = 0; l < cellInfo.labels.length; l++) {
                        var isHave = false;
                        for (var n = 0; n < cellNoteAry.length; n++) {
                            if (cellInfo.labels[l].text == cellNoteAry[n]) {
                                isHave = true;
                                break;
                            }
                        }
                        if (!isHave) {
                            alert('您所修改的文本已对标签发生了改变,不能完成此操作！');
                            cllEditObject.SetCellString(c, r, CellObject.cllCurSheet, CellObject.cellPrevChangeText);
                            return false;
                        }
                    }
                }
                cellInfo.text = text;
                CellObject.cellPrevChangeText = text;
                CellObject.notifyChangeText(cellInfo.index, cellInfo.text);
            }
        },
        format: function (searchText, setText, s, t) {
            var rs = cllEditObject.GetRows(s);
            var cs = cllEditObject.GetCols(s);
            for (var r = 1; r <= rs; r++) {
                for (var c = 1; c <= cs; c++) {
                    if (t == 0) {
                        if (cllEditObject.GetCellString(c, r, s) == searchText) {
                            cllEditObject.SetCellString(c, r, s, setText)
                        }
                    }
                    else if (t == 1) {
                        if (cllEditObject.GetCellString(c, r, s) == searchText) {
                            cllEditObject.SetCellNote(c, r, s, setText)
                        }
                    }
                    else if (t == 2) {
                        if (cllEditObject.GetCellNote(c, r, s) == searchText) {
                            cllEditObject.SetCellString(c, r, s, setText)
                        }
                    }
                }
            }
        },
        upload: function () {
            CellObject.totalSheets = cllEditObject.GetTotalSheets();
            for (var s = 0; s < CellObject.totalSheets; s++) {
                var sheetAry = CellObject.getAryBySheet(s);
                for (var c = 0; c < sheetAry.length; c++) {
                    var cell = sheetAry[c];
                    var labelAry = cell.getBuildCellString();
                    var noteText = cell.text;
                    CellObject.format(noteText, noteText, s, 1);
                    var labelText = noteText;
                    for (var j = 0; j < labelAry.length; j++) {
                        labelText = labelText.replace(cell.labels[j].text, labelAry[j]);
                    }
                    var cellNoteAry = CellObject.note.getAry(labelText);
                    if (cellNoteAry != null) {
                        for (var i = 0; i < cellNoteAry.length; i++) {
                            labelText = labelText.replace(cellNoteAry[i], FIELD_LABEL_EMPTY);
                        }
                    }
                    CellObject.format(noteText, labelText, s, 0);
                }
            }
            //获取模板HTML add by wangbinbin 20140212
            var templateHTML = "";
            try{//列表格式的保存HTML
                var oFiller = new CellBindFillerObj();
                var binder = oFiller.createBinder(cllEditObject);
                //oFiller.initBinder(binder);
                //重写这两个方法才能有表格的样式
                binder.setContentRow = function (tr, r, s) {
                    //Ysh.Array.each(tr.cells, function (td) { td.attr["class"] = "tbCellBoth trFirst"; });
                }
                binder.setTitleRow = function (tr, r, s) {
                    //Ysh.Array.each(tr.cells, function (td) { td.attr["class"] = "sTitle"; });
                }
                //取不到ListShow控件的ID rootcall.id
                binder.setTitleCol = function (td, c, r, s) {
                    if(td.titleCol)
                        Ysh.Object.add(td.attr, "onclick", "@@listshow@@.sort(\"" + td.titleCol + "\")");
                }
                templateHTML = escape(oFiller.getRowJsonArray(binder).replace(/\r\n/g, "<br>"));
            }
            catch(e){}
            $.ajax({
                url: CellObject.cllUrl + "conn/ashx/ProcessFileHandler.ashx",
                type: "post",
                data: { filename: CellObject.cllName, path: CellObject.cllPath, html: templateHTML },
                cache: false,
                success: function (data) {
                    if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                        alert(data.msg);
                        return false;
                    }
                    var retValue = -9;
                    if (data.flag == "1") {
                        retValue = cllEditObject.UploadFile(CellObject.cllUrl + "conn/ashx/UploadReportHandler.ashx?filename=" + CellObject.cllName + "&path=" + CellObject.cllPath + "");
                    }
                    else {
                        retValue = data.msg;
                    }
                    CellObject.restore();
                    if (retValue == 1) {
                        alert('报表提交成功！');
                    }
                    else {
                        alert(retValue);
                    }
                },
                error: function (data, status, e) {
                    CellObject.restore();
                    alert(e);
                    return false;
                }
            });

        },
        restore: function () {
            CellObject.totalSheets = cllEditObject.GetTotalSheets();
            for (var s = 0; s < CellObject.totalSheets; s++) {
                for (var i = 0; i < CellObject.cellAry.length; i++) {
                    var ary = CellObject.cellAry[i];
                    if (ary[1].sheet == s) {
                        CellObject.format(ary[1].text, ary[1].text, s, 2);
                    }
                }
            }
        },
        clone: function clone(obj) {
            if (typeof (obj) != 'object') return obj;
            if (obj == null) return obj;
            var cobj = new Object();
            for (var i in obj)
                cobj[i] = clone(obj[i]);
            return cobj;
        },
        openFile: function () {
            cllEditObject.OpenFile(CellObject.cllUrl + "/" + CellObject.cllPath + "/" + CellObject.cllName, "");
        },
        loadObject: function () {
            with (cllEditObject) {
                login("用尚科技", "", "13100104542", "2120-1751-0203-0005");
                WndBkColor = 16777215;
            }
            CellObject.cellAry = [];
            if (CellObject.cllCurSheet == -1) {
                CellObject.cllCurSheet = cllEditObject.GetCurSheet();
                CellObject.cllOldSheet = cllEditObject.GetCurSheet();
            }
            CellObject.totalSheets = cllEditObject.GetTotalSheets();
            for (var s = 0; s < CellObject.totalSheets; s++) {
                var rs = cllEditObject.GetRows(s); //行数
                var cs = cllEditObject.GetCols(s); //列数           
                for (var r = 1; r <= rs; r++) {
                    for (var c = 1; c <= cs; c++) {
                        var cellString = cllEditObject.GetCellString(c, r, s);
                        var cellNote = cllEditObject.GetCellNote(c, r, s);
                        if ($.trim(cellString) != "") {
                            var re = /<<<(.*?)>>>/gi;
                            var cellStringAry = cellString.match(re);
                            var cellContent = "";
                            if (cellStringAry != null) {
                                for (var i = 0; i < cellStringAry.length; i++) {
                                    cellContent += cellStringAry[i];
                                }
                            }
                            var cellInfo = new CellInfo($, window, "");
                            cellInfo.parseCellByString(cellContent, cellNote, c, r);
                            if (cellInfo.labels.length > 0) {
                                if (cellNote == "") {
                                    cellNote = cellString;
                                    for (var i = 0; i < cellInfo.labels.length; i++) {
                                        var note = CellObject.note.createText(cellInfo.labels[i].name);
                                        cellNote = cellNote.replace(cellStringAry[i], note);
                                        cellInfo.labels[i].text = note;
                                    }
                                }
                                else {
                                    var cellNoteAry = CellObject.note.getAry(cellNote);
                                    if (cellNoteAry != null) {
                                        for (var i = 0; i < cellInfo.labels.length; i++) {
                                            cellInfo.labels[i].text = cellNoteAry[i];
                                        }
                                    }
                                }
                                cellInfo.text = cellNote;
                                cellInfo.sheet = s;
                                cellInfo.index = CellObject.cellAry.length;
                                CellObject.cellAry.push([cellNote, cellInfo]);
                            }
                            else {
                                cllEditObject.SetCellString(c, r, s, cellString);
                                continue;
                            }
                        }
                        //填充单元格         
                        cllEditObject.SetCellString(c, r, s, cellNote);
                    }
                }
            }
            cllEditObject.CloseFile();

        },
        filterStatusByType: function (type) {

            switch (type) {
                case FIELD_TYPE_SAME:
                    $("#tbProperty tr[desckey=DATA]").show();
                    break;
                case FIELD_TYPE_JOIN:
                    $("#tbProperty tr[desckey=DATA]").show();
                    break;
                case FIELD_TYPE_SUM:
                    $("#tbProperty tr[desckey=DATA]").show();
                    break;
                case FIELD_TYPE_FORMULA:
                    $("#tbProperty tr[desckey=DATA]").show();
                    break;
                case FIELD_TYPE_MAX:
                    $("#tbProperty tr[desckey=DATA]").show();
                    break;
                case FIELD_TYPE_MIN:
                    $("#tbProperty tr[desckey=DATA]").show();
                    break;
                case FIELD_TYPE_AVERAGE:
                    $("#tbProperty tr[desckey=DATA]").show();
                    break;
                case FIELD_TYPE_MAXCELL:
                    $("#tbProperty tr[desckey=DATA]").show();
                    break;
                case FIELD_TYPE_MINCELL:
                    $("#tbProperty tr[desckey=DATA]").show();
                    break;
                default:
                    $("#tbProperty tr[desckey=DATA]").hide();
                    break;
            }

            switch (type) {
                case FIELD_TYPE_MAXCELL:
                    $("#tbProperty tr[desckey=SHOW]").show();
                    break;
                case FIELD_TYPE_MINCELL:
                    $("#tbProperty tr[desckey=SHOW]").show();
                    break;
                default:
                    $("#tbProperty tr[desckey=SHOW]").hide();
                    break;
            }
        }

    }
})(jQuery, this, CellWeb1);


$(document).ready(function () {
    $("#divReport").hide();

    $("#tbProperty tr[desckey=DATA]").hide();
    $("#tbProperty tr[desckey=SHOW]").hide();
    $('#divFields').hide();
    $("#tbProperty tr").hover(function () {
        $(this).children("td").addClass("hover")
    }, function () {
        $(this).children("td").removeClass("hover")
    })

    $("#tbProperty tr").live('click', function () {
        ShowFieldDescription($(this).attr("desckey"));
    }).live('mouseover', function () {
        ShowFieldDescription($(this).attr("desckey"));
    })

    $("#selType").change(function () {
        CellObject.filterStatusByType($("#selType").val());
    })

    $("#btnSelect").click(function () {
        $('#divFields').hide('fast');
        var type = $("#selType").val();
        $('#divFields').html("");
        var sInnerHtml = "<p><a href='#' id=close><img src='/i/close.gif' /></a></p>";
        if (type == FIELD_TYPE_FORMULA) {
            sInnerHtml += "<input id='btnJia' style='width: 30px' type='button' value='+' class=tool-gs />";
            sInnerHtml += "<input id='btnJian' style='width: 30px' type='button' value='-'  class=tool-gs />";
            sInnerHtml += "<input id='btnCheng' style='width: 30px' type='button' value='*'  class=tool-gs />";
            sInnerHtml += "<input id='btnChu' style='width: 30px' type='button' value='/'  class=tool-gs />";
        }
        sInnerHtml += "<div id='divFieldList' style='height:400px; overflow-y:auto;' >";
        for (var i = 0; i < CellObject.cellAry.length; i++) {
            var cell = CellObject.cellAry[i];
            for (var l = 0; l < cell[1].labels.length; l++) {
                if (cell[1].sheet == CellObject.cllCurSheet) {
                    sInnerHtml += "<a href=javascript:void(0); class='field' text='" + cell[1].labels[l].name + "' inc=" + cell[1].labels[l].inc + " vinc=" + cell[1].labels[l].vinc + " ><span id='a" + i + "''>" + cell[1].labels[l].text + "</span></a>";
                }
            }
        }
        sInnerHtml += "</div>";
        $('#divFields').html(sInnerHtml);
        $('#divFields').show('fast');
    });


    $("a[class=field]").live('click', function () {
        var name = $(this).attr("text");
        var inc = $(this).attr("inc");
        var vinc = $(this).attr("vinc");
        var type = $("#selType").val();
        if (type != FIELD_TYPE_FORMULA) {
            $("#txtData").val("");
        }
        var fieldContent = $("#txtData").val();
        if (inc == FIELD_STYLE_INC || vinc == FIELD_STYLE_VINC) {
            name = "(" + name + ")";
        }
        else {
            if (type != FIELD_TYPE_MAX && type != FIELD_TYPE_MIN && type != FIELD_TYPE_SAME && type != FIELD_TYPE_SUM) {
                name = "(" + name + ")";
            }
        }
        
        fieldContent += name;
        $("#txtData").val(fieldContent);
    });

    $("#close").live('click', function () {
        $('#divFields').hide('fast');
    })

    $("input[ class=tool-gs]").live('click', function () {
        var v = $(this).attr('value');
        var range = document.selection.createRange();
        var text = $("#txtData").val() + v;
        $("#txtData").val(text);
    })


})

//显示字段标签的描述
ShowFieldDescription = function(fieldPropertyType,itemType){
    var desc = "<font color=red>*</font>&nbsp;";
    switch(fieldPropertyType){
        case "TEXT":
            desc += "您所设置的报表标记的名称。";
        break;
        case "NAME":
            desc += "您所设置的报表标记的关键字,这个关键字是与程序有密切关系的,<font color=red>建议您不要修改。</font>";
        break;
        case "GROUP":
            desc += "在同一个格子中的Field,如果是多行的则最好写上GROUPNAME且一致,否则如果两个Field的值个数不一样时可能会导致一个Field的标志会出现在最终显示结果中";
            desc += "在分块填充中,一块的rrs必须一致,最终结果将只取其中一个的来分块。";
        break;
        case "BLOCK":
            desc += "设置分块显示时候的块名称。";
        break;
        case "PARENTBLOCK":
            desc += "设置分块显示时候父级的块名称。";
        break;
        case "TYPE":
            desc += "设置当前标记的数据显示类型。";
        break;
        case "PARAM":
            desc += "设置当前标记所需要的参数,比如:日期格式化,小数位,百分比,统计字段等。<br/>";                
        break;
        case "INC":
            desc += "行自动增长：当给定的值所占位置大于模板中的填充区域时，自动在后边插入行来补足。";
        break;
        case "VINC":
            desc += "列自动增长：当给定的值所占位置大于模板中的填充区域时，自动在后边插入列来补足。";
        break;
        case "H":
            desc += "横向填充：默认填充时是上下左右方向填充，此属性代表左右上下填充。";
        break;
        case "AUTOCR":
            desc += "自动换行：当给定的值在一个格子中填充不下时，将这个值截断，剩下的部分填入下一行。";
        break;
        case "AUTOMERGE":
            desc += "自动合并：当上一行的值和下一行的值相等时，自动将这些行合并成一个格子（空格子默认和上一行数据一样）";
        break;
        case "INSERTC":
            desc += "自动补充列。";
        break;
        case "INSERTR":
            desc += "自动补充行。";
        break;
        case "INSERTBYWHOLE":
            desc += "这个不能与AUTOCR一起使用，需要插的行数是总条数/每行条数，如果没设置，则默认在最后一个Field处插入，当GROUP使用这个STYLE时，最好每个field都写上，不过要确保每个Field填充风格一致。";
        break;
        case "VGROUP":
            desc += "竖着分组。";
        break;
        default:
        desc = "";        
    }
    $("#divFieldMemo").html(desc);
}


$(function () {
    $("#setDatabase").click(function () {
        $.ajax({
            url: "/conn/ashx/CommonHandler.ashx",
            type: "post",
            data: { postType: "GetReportCourse", pFile: CellObject.cllName, pCopy: CellObject.cllCopy },
            cache: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                if (data.Course || data.Course == "true") {
                    ReportConfigObj = showModelessDialog('/report/ReportConfig.aspx?m=' + Math.random() + '', window, 'dialogWidth:650px;dialogHeight:750px;center:yes;help:no;resizable:yes;status:no;location:no');
                }
                else {
                    ReportConfigObj = showModelessDialog('/report/ReportAdvancedConfig.aspx?m=' + Math.random() + '', window, 'dialogWidth:850px;dialogHeight:700px;center:yes;help:no;resizable:yes;status:no;location:no');
                }
            },
            error: function (data, status, e) {
                alert(e);
                return false;
            }
        });
    });

})
