/*
用户自定义控件（复合控件）
2013-3-19
*/

$(function () {
    InitButton();
    btnState();  //工具栏按钮状态
})

var selectedID = null;//当前选中控件标识
var TimeFn = null;    //区分单击与双击事件冲突
var beforedesc = null;//未改过的控件名
var afterdesc = null; //改过后的控件名

//初始化复合控件按钮
function InitButton() {
    var newLi = $("<div>");
    newLi.attr("id", "liAddCtrl");
    var newBtn = $("<a>");
    newBtn.text("添加新控件");
    newBtn.attr("id", "btnAddCtrl");
    newBtn.attr("class", "unsaved");
    newBtn.bind("click", function () {
        var locDate = new Date();
        var loctime = locDate.getTime();
        var newCtrlId = "uc" + loctime;
        if (exitNotice()) 
            var iscreated = AddUserCtrlXml(newCtrlId);
        if (iscreated == "True") {
            var newLiCtrl = $("<li>");
            newLiCtrl.attr("id", "li" + newCtrlId);

            var newCtrl = $("<a>");
            newCtrl.css("width", "80px");
            newCtrl.attr("id", "a_" + newCtrlId);
            newCtrl.text("新控件");
            newCtrl.click(function () { btn_click(newCtrlId); });
            newCtrl.dblclick(function () { btn_dblclick(newCtrlId); });
            
            var inputCtrl = $("<input>");
            inputCtrl.attr("class", "input");
            inputCtrl.attr("id", "input_" + newCtrlId);
            inputCtrl.blur(function () { btn_blur(newCtrlId); });
            inputCtrl.hide();

            newLiCtrl.append(newCtrl);
            newLiCtrl.append(inputCtrl);
            newBtn.before(newLiCtrl);

            loadEditList(newCtrlId); //添加新控件后直接进入编辑界面
            filedesc = newCtrl.text();
        }
    });
    newLi.append(newBtn);
    $("#ulCmplx").append(newLi);
}

//更改控件样式(focusID:当前选中 blurID:之前选中)
function ChangeStyle(focusID,blurID) {
    $("#" + focusID).removeAttr("class");
    $("#" + focusID).attr("class", "focus");
    $("#" + blurID).removeAttr("class");
    $("#" + blurID).attr("class", "lostfocus");
}


function btn_click(btnID) {
    clearTimeout(TimeFn);
    TimeFn = setTimeout(function () {
        if (selectedID == btnID) {  //只有双击选中后才可改名
            filedesc = $("#a_" + btnID).text();
            $("#a_" + btnID).hide();
            $("#input_" + btnID).show();
            $("#input_" + btnID).focus().val(filedesc);
            beforedesc = filedesc;
        }
    }, 300);
    AddField(btnID, 'UC'); //响应拖放
}

//复合控件命名后的操作
function btn_blur(btnID) {
    filedesc = $("#input_" + btnID).val();
    if (filedesc == "")
        filedesc = "未命名";
    $("#a_" + btnID).text(filedesc);
    $("#a_" + btnID).show();
    $("#input_" + btnID).hide();
    afterdesc = filedesc;
}

//复合控件进入编辑状态
function btn_dblclick(btnID) {
    clearTimeout(TimeFn);    
    if (exitNotice()) 
        loadEditList(btnID)
}

//加载编辑状态要做的操作
function loadEditList(btnID) {
    LoadPage(btnID);                                 //加载控件xml
    filedesc = $("#a_" + btnID).text();              //当前控件名描述
    afterdesc = null;
    beforedesc = null;
    ChangeStyle("a_" + btnID, "a_" + selectedID);    //更改控件样式
    selectedID = btnID;                              //当前选中控件
    $("#divMain").css("background-color", "#FFFFCC"); //编辑界面样式
    btnState(selectedID);                            //工具按钮状态
}


//切换页面前提示是否保存
function exitNotice() {
    var enter = true;
    if ((doctype == "userCtrl" || doctype == "del")&&(beforedesc==afterdesc)) {
        doctype = "";
        enter=true;
    }
    else if (beforedesc!=afterdesc) {
        if (!confirm(beforedesc + " 已改为 " + afterdesc + " 尚未保存，确定要离开吗?"))
            enter = false;
    }
    else{
        var currentXml = docDesign.GetXml();
        if (oldXml != currentXml) {
            if (!confirm(filedesc + " 尚未进行保存，确定要离开吗?"))
                enter = false;
        }
    }

    return enter;
}

//工具栏按钮状态
function btnState(focusCtrlID) {
    if (focusCtrlID!=null) {//ctrl
        $("#savectrl").removeAttr("disabled");
        $("#savectrl").attr("src", "/i/Defined/savectrl.png");
        $("#delctrl").removeAttr("disabled");
        $("#delctrl").attr("src", "/i/Defined/shchwj.gif");
        $("#imgSetEditable").removeAttr("disabled");
        $("#imgSetEditable").attr("src", "/i/Defined/unsetedit1.png");
        $("#savepage").removeAttr("disabled");
        $("#savepage").attr("src", "/i/Defined/unsave.png");
    }
    else//page
    {
        $("#savectrl").removeAttr("disabled");
        $("#savectrl").attr("src", "/i/Defined/unsavectrl.png");
        $("#delctrl").removeAttr("disabled");
        $("#delctrl").attr("src", "/i/Defined/unshchwj.gif");
        $("#imgSetEditable").removeAttr("disabled");
        $("#imgSetEditable").attr("src", "/i/Defined/setedit1.png");
        $("#savepage").removeAttr("disabled");
        $("#savepage").attr("src", "/i/Defined/save.png");
    }
}

//更新/创建复合控件的xml
function AddUserCtrlXml(newCtrlId) {
    var created = false;
    $.ajax({
        url: "/conn/ashx/UserCtrlHandler.ashx",
        type: "get",
        cache: false,
        data: newCtrlId,
        success: function (data) {
            created=data;
        }
    });
    return created;
}

//编辑新建的复合控件
function EditNewCtrl(CtrlId) {
    var editdivMain = $("<div>")
    editdivMain.attr("id", "divMain_edit");
    $("#divMain").prepend(editdivMain);
    LoadPage(CtrlId);
}

//加载控件编辑页面
function LoadPage(CtrlId) {
    var path = "";
    if (CtrlId) {
        filename = CtrlId;
        path = "conn/complexxml";
    }
    else {
        path = "conn/gridxml";
    }
    ParseXml(filename, path)
    oldXml = docDesign.GetXml();
}

//保存复合控件
function SaveUserCtrl(type) {
    if (type=="del"&&!confirm("确定要删除该控件吗？"))
        return false;
    if (selectedID == null) {
        if (type == "del")
            alert("请双击选中要删除的复合控件！");
        else if (type == "save")
            alert("请双击选中要保存的复合控件！");
        return false;
    }
    var strXml = docDesign.GetXml();
    oldXml = strXml; //更新oldXml
    frmSave.xmlid.value = filename;
    frmSave.xmlfold.value = filefold;
    frmSave.savexml.value = escape(strXml);
    frmSave.xmlname.value = filedesc;
    frmSave.doctype.value = "userCtrl";
    frmSave.operation.value = type;
    frmSave.submit();
}

//页面加载复合控件
function AddUserCtrl(pYsh, strType) {
    var str = window.YshGrid.LoadXml_path("", strType, true, "conn/complexxml").value;
    if (str == "")
        str = "{init:[],datakey:[],ctrls:{tag:'div',id:'div1',name:'div1',desc:'div1',descr:'容器',styles:{width:'100%',height:'100%'}}}";
    var doc = null;
    eval("doc = " + str);
    g_yshFactory.ExtendObjects(doc.ctrls, function (ysh) {
        docDesign.ctrls.push(ysh);
        ysh.doc = docDesign;
    });
    pYsh.children.push(doc.ctrls);
    return doc.ctrls;
}
