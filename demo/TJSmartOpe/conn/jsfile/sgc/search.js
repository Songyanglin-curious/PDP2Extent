
function doAsk(questionInfo, rows, obj, bNext) {
    var bFuzzy = false;
    if (questionInfo.length > 2) {
        if (isAccur(questionInfo)) {
            questionInfo = questionInfo.substr(1, questionInfo.length - 2);
            bFuzzy = true;
        }
    }
    if (bFuzzy) {
        var arr = questionInfo.split(' ');
        arr[0] += "*";
        questionInfo = arr.join(' ');
    }
    var f = null;
    if (obj) {
        f = function () {
            var p = $(obj);
            if (bNext) {
                return p.parent().parent().find(".askTablePart:first")
            } else {
                do {
                    p = p.parent();
                    if (p.hasClass("RSayContent"))
                        return p;
                } while (p != null)
            }
            return p;
        }
    } else {
        f = function () { return $robotReply.find(".RSayContent"); }
    }
    var $robotReply = getRecentReply();
    AskInst.ask(questionInfo, f, function () {
        if (!obj)
            //$('#divContent').scrollTop($('#divContent')[0].scrollHeight);
            $('#divContent').scrollTop(0);
    });
    return;
}

function getRecentReply() {
    return $("#divContent").find(".divRobotSay:first");
}

function showAsk(questionInfo, rows, bOther) {
    if (!bOther) {
        var jq = emptyInputInfo();
        //获取robot回答
        //$("#divContent").append();
        jq.after($(".RDiv").children().clone());
    } else {
        console.log(questionInfo);
        var jq = emptyInputInfo(questionInfo);
        //获取robot回答
        //$("#divContent").append();
        jq.after($(".RDiv").children().clone());
    }
    var $robotReply = getRecentReply();
    $robotReply.find(".RSayContent").text("正在搜索");

    window.setTimeout(function () {
        doAsk(questionInfo, rows);
    }, 10);
}

var submitAskInfo = function () {
    if ($("#input_info").val() == "")
        return;
    var questionInfo = $("#input_info").val();
    if (questionInfo == "登录") {
        showPanel("/SubLogin.aspx");
        return;
    }
    if (questionInfo == "生成预案") {
        callbackData = null;
        sectionRelaType = "text";
        sectionRelaId = "";
        getAllSection();
        return;
    }
    if (questionInfo == "故障集设置") {
        showPanel("/p.aspx?f=DeviceFaultList&a=" + new Date());
        return;
    }
    if (questionInfo == "重要设备设置") {
        showPanel("/p.aspx?f=ImportantDevice&a=" + new Date());
        return;
    }
    if (questionInfo == "断面设置") {
        showPanel("/p.aspx?f=DeviceSectionList&a=" + new Date());
        return;
    }
    if (questionInfo == "工作断面") {
        showPanel("/p.aspx?f=showSection&a=" + new Date());
        return;
    }
    if (questionInfo == "高风险设备") {
        SearchCommon.SpecialLocation(null, 6);
        emptyInputInfo();
        return;
    }
    if (questionInfo == "正在检修的设备") {
        emptyInputInfo();
        SearchCommon.SpecialLocation(null, 5);
        return;
    }
    if (questionInfo == "负载") {
        addAnswerHTML("<a target='_blank' href='http://graph.dcloud.sd.dc.sgcc.com.cn/osp/datamining/loadrate/index.html' style='color:blue;text-decoration:underline;'>打开负载详情</a>");
        return;
    }
    if (questionInfo == "无功") {
        addAnswerHTML("<a target='_blank' href='http://graph.dcloud.sd.dc.sgcc.com.cn/osp/wgdyzhfx/VoltageAnalysis.html' style='color:blue;text-decoration:underline;'>打开无功详情</a>");
        return;
    }
    if (questionInfo == "大数据系统") {
        addAnswerHTML("<a target='_blank' href='http://10.37.8.40:8080/Default.aspx?login=5648468D778728E93A83E312998DC9BF&token=A66D911888DE6ABB6F366D9704F31CD0' style='color:blue;text-decoration:underline;'>打开大数据系统</a>");
        return;
    }

    showAsk(questionInfo, 10);
}

var emptyInputInfo = function (msg) {
    $("#divContent").show();
    //添加提问者文本
    var jq = $(".ADiv").children().clone();
    $("#divContent").prepend(jq);
    $("#divContent").find(".LSayContent:first").text(msg || $("#input_info").val());
    $("#input_info").val("");
    return jq;
}

var addAnswerHTML = function (html) {
    SearchCommon.CloseSearch();
    $("#divContent").show();
    var jq = emptyInputInfo();
    jq.after($(".RDiv").children().clone());
    var $robotReply = getRecentReply();
    $robotReply.find(".RSayContent").html(html);
    $('#divContent').scrollTop(0);
}

var addNoQuestionHTML = function (html) {
    SearchCommon.CloseSearch();
    $("#divContent").show();
    $("#divContentClose").show();
    SearchCommon.showContentCloseImage();
    var jq = $(".RDiv").children().clone();
    $("#divContent").prepend(jq);
    var $robotReply = getRecentReply();
    $robotReply.find(".RSayContent").html(html);
    $('#divContent').scrollTop(0);
}

//录音
$("#btnRadio").mousedown(function () {
    var noAudio = true;
    if (wndAudio != null)
        noAudio = wndAudio.closed;
    if (noAudio) {
        if (!confirm("因为浏览器安全限制，\n语音数据只能通过https方式加密传输，\n必须开启一个https页面"))
            return;
        wndAudio = window.open(urlConfig.audioUrl, "audio");
        return;
    }
    if ($(this).hasClass("protected")) {
    }
    $(this)[0].src = "/i/talking.gif";
    //$("#startAudio").trigger("click", []);
    wndAudio.postMessage('startRecording', '*');
}).mouseup(function () {
    wndAudio.postMessage('stopRecording', '*');
    wndAudio.postMessage('stopRecording', '*');
    wndAudio.postMessage('uploadAudio', '*');
    //$("#stopAudio").trigger("click", []);
    //$("#stopAudio").trigger("click", []);
    //$("#submitAudio").trigger("click", []);
    $(this)[0].src = "/img/u36.png";
    SearchCommon.CloseSearch();
});
//发送文字请求
$("#enterT").on("click", function () {
    submitAskInfo();
});
$("#input_info").keyup(function (event) {
    if (event.ctrlKey && event.keyCode == 13)
        $("#imgSearch").click();
    else if (event.keyCode == 13) {
        submitAskInfo();
        SearchCommon.CloseSearch();
    }
    else
        return true;
});
function doSearch(o) {
    $("#input_info").val((o.innerText || o.value) + "呢");
    submitAskInfo(false);
}
AskInst.askText = function (s) {
    $("#input_info").val(s);
    submitAskInfo(false);

}

function isAccur(str) {
    return (str.startsWith("'") || str.startsWith('"') || str.startsWith('‘') || str.startsWith('“'))
        && (str.endsWith("'") || str.endsWith('"') || str.endsWith('’') || str.endsWith('”'));
}
