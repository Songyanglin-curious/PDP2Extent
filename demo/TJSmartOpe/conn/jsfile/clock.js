var aycount;
var openflag = true;
var showflag = false;
var minH;
function showcontent(ary) {
    var thtml = "";
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].substr(2, 1) != "0") {
            thtml += ary[i] + "<br>";
        }
    }
    thtml += "<a href='javascript:void(0)' style='display:block; float:right;' onclick='chakanclick()'>查看</a>";
    $("#time").html(thtml);
}
function chakanclick() {
    TTT.MainFrame.location = "applyhandle.aspx";
    $("#title").click();
}
function show_pop(ary) {
    minH = 25;
    openflag = false;
    if (showflag == false)
        return false;
    ary = (Main.arrstr(usernum).value).split(",");
    aycount = ary.length;
    showcontent(ary);
    timer = setInterval("changeH(4)", 2);
    showflag = false;
}
function hid_pop(minHeight) {
    openflag = false;
    showflag = true;
    if (minHeight != null)
        minH = minHeight;
    timer = setInterval("changeH(-4)", 2);
}
var largeHeight;
function changeH(addH) {

    var MsgPop = $("#winpop");
    MsgPop.click(function () { });
    if (addH < 0)
        $("#close").hide();
    var popH = parseInt(MsgPop.currentStyle.height);
    if ((popH < largeHeight && addH > 0) || (popH > minH && addH < 0)) {
        $("#winpop").show();
        MsgPop.css("height", (popH + addH).toString() + "px");
    }
    else {
        clearInterval(timer);
        if (addH > 0) {
            clearInterval(timer);
            MsgPop.onclick = function () { }
            $("#close").hide();
            MsgPop.css("cursor", "default");
            MsgPop.show();
        }
        else if (addH < 0) {
            clearInterval(timer);
            MsgPop.css("cursor", "pointer");
            MsgPop.click(function () { aycount = (Main.arrstr(usernum).value).split(",").length; timer = setInterval("changeH(4)", 2); });
            $("#close").hide();
        }
    }
}
function makeDiv(titleword, arystr, allcount) {
    var windiv = document.createElement("DIV");
    windiv.style.width = 200;
    windiv.style.position = "absolute";
    windiv.id = "winpop";
    document.body.appendChild(windiv);


    var titdiv = document.createElement("<div class='title' id='title'>");
    windiv.appendChild(titdiv);
    titdiv.innerHTML = titleword;
    //给title添加toggle效果 by Fu 2011-04-15
    titdiv.attachEvent("onclick", (function () {
        var b = true;
        return function () {
            if (b) {
                b = false;
                hid_pop(25);
            }
            else {
                b = true;
            }
        };
    })());

    var countsp = document.createElement("span");
    countsp.id = "countsp"; countsp.style.color = "red";
    titdiv.appendChild(countsp)

    var clzspan = document.createElement("<span id='close' class='close'onclick='hid_pop(25)' style='color:#444444;display:none'>");
    clzspan.innerHTML = "×";
    titdiv.appendChild(clzspan);

    var tdiv = document.createElement("time");
    tdiv.id = "time";
    windiv.appendChild(tdiv);
    var frmFilter = document.createElement("<iframe frameborder='0' src='' style=\"position: absolute; visibility: inherit; top: 0px;" +
            "left: 0px; width: expression(this.parentNode.offsetWidth); height: expression(this.parentNode.offsetHeight);" +
            "z-index: -1; filter='progid:dximagetransform.microsoft.alpha(style=0,opacity=0)';\"></iframe>");
    windiv.appendChild(frmFilter);
    var ary = arystr.split(",");
    aycount = ary.length;

    {
        $("#winpop").show();
        if (openflag)
            setTimeout(function () { showflag = true; show_pop(ary); }, 800);
    }
}


function winpop() {
    return;
    if (usernum == '0')
        return;
    arstr = Main.arrstr(usernum).value;
    ttcount = Main.arrcount().value;
    var count = 0;
    var tempcount = ttcount;
    if (arstr != "" && !$("#winpop")) {

        makeDiv("待签收项提醒", arstr);
        $("#countsp").text("(" + ttcount + ")");
    }

    //10s更新一次
    setInterval(function () {
        arstr = Main.arrstr(usernum).value;
        ttcount = Main.arrcount().value;
        //待办工作签收完的情况
        if (arstr == "") {
            if ($("#winpop") && $("#winpop").css("display") == "block") {
                if ($("#winpop").css("height") != null)
                    hid_pop(1);
                $("#winpop").hide();
            }
        }
        else {
            if (!$("#winpop")) {//原来没有待办工作，新出现待办工作的情况
                makeDiv("待签收项提醒", arstr, ttcount);
                $("#countsp").innerText = "(" + ttcount + ")";
            }
            else {//原来存在代办工作，签收完了又出现新的代办工作
                if ($("#winpop").css("display") == "none") {
                    $("#winpop").show();
                    setTimeout(function () { show_pop(arstr.split(",")); }, 500);
                    $("#countsp").text("(" + ttcount + ")");
                }
                else {//原来存在代办工作，未签收完时出现新的
                    $("#countsp").text("(" + ttcount + ")");
                    if (tempcount < ttcount) {
                        if (parseInt($("#winpop").height()) <= 25) {
                            setTimeout(function () { show_pop(arstr.split(",")); }, 500);
                        }
                        else {
                            showcontent(arstr.split(","));
                            $("#winpop").css("height", ((arstr.split(",")).length * 25 + 50));
                        }
                    }
                    else if (tempcount > ttcount) {
                        if (parseInt($("#winpop").height()) <= 25) {
                            showcontent(arstr.split(","));
                        }
                        else {
                            showcontent(arstr.split(","));
                            $("#winpop").css("height", ((arstr.split(",")).length * 25 + 50));
                        }
                    }
                }
            }
        }
        tempcount = ttcount;
    }, 10000);

}