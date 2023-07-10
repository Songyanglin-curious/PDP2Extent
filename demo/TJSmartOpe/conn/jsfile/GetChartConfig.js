function menuInit() {

    var contents = document.getElementsByClassName('chartcontent');
    var toggles = document.getElementsByClassName('charttitle');
    var myAccordion = new fx.Accordion(
                    toggles, contents, { opacity: true, duration: 400 }
                );
    myAccordion.showThisHideOpen(contents[0]);
}
function LoadBase() {//方法入口
    var baseSel = document.getElementById("BaseSel");
    for (var t in Ysh_ChartBaseType) {
        var op = document.createElement("OPTION");
        op.innerText = Ysh_ChartBaseType[t].name;
        op.value = t;
        baseSel.appendChild(op);
    }
    baseSel.selectedIndex = 0;
}
function getSubSelect(def) {//得到副类型下拉框
    clrSub();
    var baseSel = document.getElementById("BaseSel");
    if (baseSel.selectedIndex == 0)
        return;
    var subtype = Ysh_ChartBaseType[baseSel.options[baseSel.selectedIndex].value].subtype;
    if (subtype.length > 1) {
        document.getElementById("SubSel").style.display = "";
    }
    for (var i = 0; i < subtype.length; i++) {
        var op = document.createElement("OPTION");
        op.innerText = Ysh_ChartType.getNameByValue(subtype[i]);
        op.value = subtype[i];
        document.getElementById("SubSel").appendChild(op);
    }
    if (def) {//默认值
        document.getElementById("SubSel").value = def;
    }
    getPropInputs();
}
function getPropInputs() {//生成对应类型的属性框
    var dvProp = document.getElementById("divProps");
    dvProp.innerHTML = "";
    var subType = document.getElementById("SubSel").value;
    if (Ysh_ChartProperty.GroupAble.indexOf(parseInt(subType)) >= 0) {//分组按钮的显示
        document.getElementById("chart_isgroup_span").style.display = "";
    }
    else {
        document.getElementById("chart_isgroup_span").style.display = "none";
    }
    if (Ysh_ChartProperty.GroupOnly.indexOf(parseInt(subType)) >= 0) {
        document.getElementById("chart_isgroup").checked = true;
    }

    var isgroup = document.getElementById("chart_isgroup").checked;

    for (var p in Ysh_ChartTitleTips) {
        if (Ysh_ChartTitleTips[p].iscommon == 0) {
            if ((isgroup && p == "DataSet") || (!isgroup && p == "SetProp")) {//处理数据设置框的特殊情况
                var t = new ysh_props_table(p); //用ysh_props_table来创建属性框
                t.element = "divProps";
                t.title = Ysh_ChartTitleTips[p].title;
                t.type = subType;
                t.tips = Ysh_ChartTitleTips[p].tips;
                t.columns = 2;
                t.create();
            }
            continue;
        }
        if ((!Ysh_ChartTitleTips[p].area || Ysh_ChartTitleTips[p].area.indexOf(parseInt(subType)) >= 0) && p != "UniqueProp") {//其他属性设置框
            var t = new ysh_props_table(p);
            t.element = "divProps";
            t.title = Ysh_ChartTitleTips[p].title;
            t.type = subType;
            t.tips = Ysh_ChartTitleTips[p].tips;
            t.create();
        }
        if (p == "UniqueProp") {//独有属性设置框的特殊情况
            for (var i = 0; i < Ysh_ChartProperty.UniqueProp.length; i++) {
                if (Ysh_ChartProperty.UniqueProp[i].Scope.split(",").indexOf(subType) >= 0) {
                    var t = new ysh_props_table(p);
                    t.element = "divProps";
                    t.title = Ysh_ChartProperty.UniqueProp[i].ChDesc + Ysh_ChartTitleTips[p].title;
                    t.subid = i;
                    t.tips = Ysh_ChartTitleTips[p].tips;
                    t.type = subType;
                    t.create();
                    break;
                }
            }
        }
    }
    getSwf();//得到当前类型的swf文件
    menuInit();//动画初始化
    ChartManage.refSource();//绑定数据选择框
    ChartManage.init(); //初始化ChartManage
}
function getSwf() {
    var subtype = parseInt(document.getElementById("SubSel").value);
    var chartswf = Ysh_ChartType[Ysh_ChartType.getNameByValue(subtype)][1];
    if (Ysh_ChartProperty.GroupAble.indexOf(subtype) >= 0 && document.getElementById("chart_isgroup").checked) {
        chartswf = "MS" + chartswf;
    }
    document.getElementById("chart_swf").value = chartswf;
}
function clrSub() {
    document.getElementById("SubSel").style.display = "none";
    document.getElementById("SubSel").innerHTML = "";
}
function getSingleInput(propobj) {
    var type = propobj.type.toLowerCase();
    var select=propobj.selectCtrl;
    var ipt;
    switch (type) {
        case "text":
            ipt = document.createElement("INPUT");
            ipt.type = "text";
            ipt.id = "txt" + propobj.name;
            ipt.propid = propobj.name;
            ipt.propreg = propobj.limit;
            ipt.onkeyup = checkInput;
            ipt.name = "ysh_chart_elements";
            ipt.style.width = "90%";
            break;
        case "checkbox":
            ipt = document.createElement("INPUT");
            ipt.type = "checkbox";
            ipt.id = "cb" + propobj.name;
            ipt.propid = propobj.name;
            ipt.checked = propobj.def;
            ipt.name = "ysh_chart_elements";
            ipt.style.width = "90%";
            break;
        case "color":
            ipt = document.createElement("SPAN");
            var mipt = document.createElement("INPUT");
            mipt.propid = propobj.name;
            mipt.id = "clr" + propobj.name;
            mipt.type = "text";
            mipt.style.width = "50%";
            mipt.name = "ysh_chart_elements";
            mipt.onblur = function () {
                if (this.value == "") {
                    this.style.backgroundColor = "";
                    return;
                }
                var newid = "hid" + this.id;
                var oldvalue = this.style.backgroundColor.replace("#", "").toUpperCase();
                try {
                    this.style.backgroundColor = this.value;
                    document.getElementById(newid).value = this.value;
                } catch (e) {
                    this.value = oldvalue;
                    return false;
                }
            };
            var hidipt = document.createElement("INPUT");
            hidipt.style.display = "none";
            hidipt.id = "hidclr" + propobj.name;
            hidipt.onchange = function () {
                var newid = this.id.substr(3);
                document.getElementById(newid).style.backgroundColor = this.style.backgroundColor;
                document.getElementById(newid).value = this.value;
            };
            var btn = document.createElement("INPUT");
            btn.className = "color {valueElement:'hidclr" + propobj.name + "',styleElement:'hidclr" + propobj.name + "'}";
            btn.style.cursor = "hand";
            btn.type = "image";
            btn.src = "../i/color.png";
            btn.alt = "选择颜色";
            btn.style.verticalAlign = "top";
            ipt.appendChild(mipt);
            ipt.appendChild(btn);
            ipt.appendChild(hidipt);
            ipt.style.width = "90%";
            break;
        case "select":
            ipt = document.createElement("SELECT");
            var options = propobj.limit.split(",");
            for (var i = 0; i < options.length; i++) {
                var op = document.createElement("OPTION");
                op.innerText = options[i].split("/").length > 1 ? options[i].split("/")[1] : options[i].split("/")[0];
                op.value = options[i].split("/")[0];
                ipt.appendChild(op);
            }
            ipt.id = "sel" + propobj.name;
            ipt.propid = propobj.name;
            ipt.name = "ysh_chart_elements";
            ipt.style.width = "90%";
            break;
        case "data":
            ipt = document.createElement("DIV");
            ipt.style.textAlign = "center";
            if (select == "0")
                ipt.innerHTML += "<table><tr><td><div name=\"div_txtSelect_elements\" id=\"div_txtSelect\" style=\"display:none\">"
                    + "<input type='text' id=\"seletext_" + propobj.name + "\" onclick='shrinkOnclick(\"" + propobj.name + "\")' onpropertychange='seletextOnchange(\"" + propobj.name + "\")' name='ysh_chart_seles' class='selectposition' propid=\"chart_seldatasource" + propobj.name + "\" />"
                    + "<span style='vertical-align:middle;border:0'><input type=\"button\" id='btn_seleRange' onclick='btn_seleRangeOnclick(\"" + propobj.name + "\")' /></span></div></td></tr></table>";
            ipt.innerHTML += "<div name=\"div_" + propobj.type + "\"><select id=\"chart_seldatasource" + propobj.name + "\" name=\"ysh_chart_elements\" propid=\"chart_seldatasource" + propobj.name + "\" class=\"control-w-157\" style=\"width:80px\" title=\"" + propobj.type + "\" ></select>&nbsp;"
                + "<input id=\"chart_datasource" + propobj.name + "\" name=\"ysh_chart_elements\" style=\"width:100px\" propid=\"" + propobj.name + "\" type=\"text\" />";
            ipt.innerHTML += "<div id=\"chart_dvdatasource" + propobj.name + "\" class=\"selectSourceField\" style=\"width: 200px; height: 300px; overflow-y: auto;\"></div></div>"
            ipt.style.width = "100%";
            break;
        default:
            break;
    }
    return ipt;
}
function changeSel() {
    if (Ysh_ChartProperty.GroupOnly.indexOf(parseInt(document.getElementById("SubSel").value)) >= 0) {
        document.getElementById("chart_isgroup").checked = true;
    }
    else {
        document.getElementById("chart_isgroup").checked = false;
    }
    ChartManage.refData(true);
   // getPropInputs();
}
function checkInput() {//正则匹配
    if (!event || !event.srcElement)
        return true;
    var e = event.srcElement;
    var reg = e.propreg;
    if (reg && reg != "" && e.value != "") {
        reg = new RegExp(reg, "ig");
        while (!e.value.match(reg) && e.value != "") {
            e.value = e.value.slice(0, -1);
        }
    }
}
var ysh_props_table = function (id) {//属性框的对象
    this.id = id;
    this.columns = 3;
    this.rows = 4;
    this.element = "divProps";
    this.title = "基础属性";
    this.tips = "";
    this.type = "-1";
    this.subid = -1;
    this.currentProps = [];
    this.create = function () {
        var tb = document.createElement("TABLE");
        tb.style.fontFamily = "Verdana";
        tb.style.fontSize = "8pt";
        tb.cellPadding = 0;
        tb.cellSpacing = 0;
        tb.style.borderCollapse = "collapse";
        tb.style.width = "100%";
        this.currentProps = Ysh_ChartProperty[this.id];
        if (this.subid != -1) {
            this.currentProps = Ysh_ChartProperty[this.id][this.subid].Properties;
        }
        if (this.id == "DataSet") {
            this.currentProps = Ysh_ChartProperty.Categories.concat(Ysh_ChartProperty.DataSet);
        }
        if (this.currentProps) {
            for (var i = 0; i < this.currentProps.length; i++) {
                var tr = document.createElement("TR");
                var c = this.columns;
                for (var j = 0; j < c && (i + j) < this.currentProps.length; j++) {
                    if (this.currentProps[i + j].scope == "-1" || this.currentProps[i + j].scope.split(",").indexOf(this.type) >= 0) {
                        var tc1 = document.createElement("TD");
                        tc1.innerText = this.currentProps[i + j].chname;
                        this.settdstyle(tc1);
                        var tc2 = document.createElement("TD");
                        tc2.style.height = "25px";
                        var ipt = getSingleInput(this.currentProps[i + j]);
                        tc2.appendChild(ipt);
                        this.settdstyle(tc2);
                        tc2.style.width = "auto";
                        tr.appendChild(tc1);
                        tr.appendChild(tc2);
                    }
                    else {
                        c++;
                        continue;
                    }
                }
                i += c - 1;
                var tbody = document.createElement("TBODY"); //ie6
                tbody.appendChild(tr);
                tb.appendChild(tbody);
            }
        }
        else {
            var tr = document.createElement("TR");
            var tc = document.createElement("TD");
            this.settdstyle(tc);
            tc.innerHTML = "<textarea id=\"txtChartOther\" cols='72'/>";
            tr.appendChild(tc);
            var tbody = document.createElement("TBODY"); //ie6
            tbody.appendChild(tr);
            tb.appendChild(tbody);
        }
        //document.getElementById(this.element).appendChild(tb);
        this.getmenu(tb);
        jscolor.init();
    };
    this.settdstyle = function (td) {
        td.style.border = "solid 1px lightsteelblue";
        td.style.textAlign = "center";
        td.style.verticalAlign = "middle";
        td.style.width = "100px";
    };
    this.getmenu = function (tb) {//创建标题栏和tips栏
        var h = document.createElement("H1");
        h.className = "charttitle";
        h.innerHTML = "<A href=\"javascript:void(0)\">" + this.title;
        var dv = document.createElement("DIV");
        dv.className = "chartcontent";
        var p = document.createElement("P");
        var dvtips = document.createElement("DIV");
        dvtips.className = "chartstyle1";
        dvtips.innerHTML = "<h5>Tips:</h5>" + this.tips;
        p.appendChild(dvtips);
        p.appendChild(tb);
        dv.appendChild(p);

        if (this.id == "SetProp" || this.id == "Categories" || this.id == "DataSet") {
            var set = document.createElement("p");
            set.innerHTML = "<input type=\"checkbox\" onClick=\"switchSetting()\" id=\"check_switchSetting\"/><span id=\"switchsSource\">从页面内容中选取数据源</span>";
            p.appendChild(set);
        }
        document.getElementById(this.element).appendChild(h);
        document.getElementById(this.element).appendChild(dv);
    }
}

//数据源选取方式切换
function switchSetting() {
    var checkboxValue = document.getElementById("check_switchSetting").checked;
    var div_txtSelects = document.getElementsByTagName("div");
   
    if (checkboxValue) {
        for (var i = 0; i < div_txtSelects.length; i++) {
            if (div_txtSelects[i].getAttribute("name") == "div_txtSelect_elements")
                div_txtSelects[i].style.display = "block";

            if (div_txtSelects[i].getAttribute("name") == "div_data" && div_txtSelects[i].parentNode.childNodes.length == 3)//包含3个子节点时说明此项已配鼠标页面选取控件，在切换选取方式时需要隐藏
                div_txtSelects[i].style.display = "none";
        }
    }
    else {
        for (var i = 0; i < div_txtSelects.length; i++) {
            if (div_txtSelects[i].getAttribute("name") == "div_txtSelect_elements")
                div_txtSelects[i].style.display = "none";
            if (div_txtSelects[i].getAttribute("name") == "div_data")
                div_txtSelects[i].style.display = "block";
        }
    }
}

//更新鼠标选取位置
var newPosition = "";
var handleCtrls = "";
var keyid = "";

function updatePosition() {
    var selectrl = document.getElementById(handleCtrls);
    selectrl.value = newPosition;
    document.getElementById("shinkseletext").value = newPosition;
}

function shrinkOnclick(ctrlname) {
    handleCtrls = "seletext_" + ctrlname;
    document.getElementById("shinkseletext").value = document.getElementById(handleCtrls).value;
}

function btn_seleRangeOnclick(ctrlname) {
    handleCtrls = "seletext_" + ctrlname;
    document.getElementById("shinkseletext").value = document.getElementById(handleCtrls).value;
}

//更新数据源选取值
function seletextOnchange(ctrlid) {//参数：被更新的控件id
    var cellValue = document.getElementById("seletext_" + ctrlid).value;
    var datasourceID = "";
    var cd = window.dialogArguments.CellObject.cellAry;

    //提示
    var textobj = document.getElementById("shinknote");
    if (cellValue == "" || cellValue == null)
        content = "提示：未选择任何数据源！";
    else if (cellValue.indexOf("}") < 0)
        content = "提示：您选择的不是标准数据源格式。<br>请选择带有{ }的单元格！";
    else
        content = "";
    textobj.innerHTML = content;

    if (cellValue.indexOf("}") < 0) return false;

    for (var i = 0; i < cd.length; i++) {
        if (cd[i][0] == cellValue) {
            datasourceID = cd[i][1].labels[0].name;
            break;
        }
    }

    $.GetData(FieldHandler, "GetField", FieldManage.xmlFile, datasourceID, function (data) {
        $("#" + "chart_datasource" + ctrlid).val(data.col);
        $("#" + "chart_seldatasource" + ctrlid).val(data.src);
    })
}


