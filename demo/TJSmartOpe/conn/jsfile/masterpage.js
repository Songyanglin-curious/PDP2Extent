function OkOnClick() {
    SaveAttrs();
    window.returnValue = 1;
    window.close();
};
function GetAll(xmlName) {//从母版Xml文件中读取全部属性
    return MasterPageSetDlg.GetAll(xmlName).value;
};
function Get(list, type) {//从List中读取出指定种类的值[String type,String value1,String value2]
    var arr = new Array();
    for (var i = 0; i < list.length; i++) {
        if (list[i][0] == type) {
            var tmp = [list[i][1], list[i][2]];
            arr.push(tmp);
        }
    }
    return arr;
};
function SetAttrs() {
    try {
        ctrl = window.dialogArguments;
        var html = "";
        for (var i = 0; i < attrs.length; i++)
            html += StringPP.format("<tr><td>{0}</td><td><div contentEditable=true>{1}</div></td><td>{2}</td></tr>", attrs[i][0], ctrl.attrs[attrs[i][0]] ? ctrl.attrs[attrs[i][0]] : "", attrs[i][1]);
        $("#table1").append(html);
        SetCss();
    } catch (err) { }
};
function SetCss() {
    $(".mptbl").each(function (i) {
        $(this).find("tr").each(function (i) {
            if (i > 0)
                if (i % 2 == 0)
                    $(this).css("background-color", "#EEEFDF");
                else
                    $(this).css("background-color", "#FFFFFD");
        });
    });
};
function SaveAttrs() {
    try {
        ctrl = window.dialogArguments;
        $("#table1 tr").each(function (i) {
            if (i > 0) {
                ctrl.attrs[$(this).find("td")[0].innerHTML] = $($(this).find("td")[1].innerHTML).html();
            }
        });
    } catch (err) { }
};

$(document).ready(function () {
    try {
        ctrl = window.dialogArguments;
        var type = StringPP.format("母版页类型:{0}", ctrl.attrs["xmlName"]);
        $("#masterPageType").text(type);
        if (ctrl.id != "" && ctrl.id.indexOf('_temp_id_') == -1)
        $("#mstpg_id").val(ctrl.id);
        $("#mstpg_name").val(ctrl.name);
        $("#mstpg_desc").val(ctrl.desc);
        var xmlName = StringPP.format("{0}conn\\gridxml\\{1}.master.xml", xmlPath, ctrl.attrs["xmlName"]);
    } catch (err) { }
    var result = GetAll(xmlName);
    attrs = Get(result, "attr");
    SetAttrs();
});