(function ($) {
    var openedLayer;
    var parentElement = "no";
    var options;
    $.showPopLayer = function (options) {
        options = jQuery.extend({
            target: "",
            screenLock: true,
            screenLockBackground: "#000",
            screenLockOpacity: "0.5",
            onClose: function () { },
            fixedPosition: true,
            animate: true,
            title: "选择文件",
            value: ""
        }, options);
        showIt(options);
        SetTitle(options.title);
        return this;
    }
    $.closePopLayer = function () {
        target = openedLayer.target;
        openedLayer.onClose();
        if (openedLayer.animate) {
            $("#" + target).fadeOut('normal');
            hideScreenLock(true);
        } else {
            $("#" + target).css("display", "none");
            hideScreenLock(false);
        }
        if (parentElement != "no") {
            $("#" + target).appendTo($("#" + parentElement));
        }
    }
    function setScreenLockSize() {
        $('#ScreenLockDiv').height($(document).height() + "px");
        $('#ScreenLockDiv').width($(document.body).outerWidth(true) + "px");
    }
    function showScreenLock(bg_color, bg_opacity, useAnimate) {
        if ($('#ScreenLockDiv').length) {
            setScreenLockSize();
            if (useAnimate) {
                $('#ScreenLockDiv').fadeIn('fast');
            } else {
                $('#ScreenLockDiv').css("display", "block");
            }
        } else {
            $("body").append("<div id='ScreenLockDiv'></div>");
            $('#ScreenLockDiv').css({
                position: "absolute",
                background: bg_color,
                left: "0",
                top: "0",
                opacity: bg_opacity,
                "z-index": "1000",
                display: "none"
            });
            showScreenLock(bg_color, bg_opacity, useAnimate);
        }
    }
    function hideScreenLock(useAnimate) {
        if (useAnimate) {
            $('#ScreenLockDiv').fadeOut('fast');
        } else {
            $('#ScreenLockDiv').css("display", "none");
        }
    }
    function setPopLayerPosition(obj) {
        var windowWidth = $(document).width();
        var windowHeight = $(document).height();
        var popupHeight = $(obj).height();
        var popupWidth = $(obj).width();
        $(obj).css({
            "position": "absolute",
            "z-index": "10000",
            "top": (windowHeight - popupHeight) / 2 + $(document).scrollTop() + "px",
            "left": (windowWidth - popupWidth) / 2 + "px"
        });
        if ($(obj).parent() != "body") {
            parentElement = $(obj).parent().attr("id");
            $(obj).appendTo("body");
        }
    }
    function showIt(popObject) {
        openedLayer = popObject;
        var _tDiv = $("#" + popObject.target);
        var _screenlock = popObject.screenLock;
        var _bgcolor = popObject.screenLockBackground;
        var _bgopacity = popObject.screenLockOpacity;
        var _animate = popObject.animate;
        var _isFixed = popObject.fixedPosition;
        if (_screenlock) {
            showScreenLock(_bgcolor, _bgopacity, _animate);
            $(window).resize(function () { setScreenLockSize(); });
        }
        setPopLayerPosition(_tDiv);
        if (_animate) {
            _tDiv.fadeIn();
        } else {
            _tDiv.css("display", "block");
        }
        if (_isFixed) {
            $(window).scroll(function () { setPopLayerPosition(_tDiv); });
            $(window).resize(function () { setPopLayerPosition(_tDiv); });
        }
    }
    function SetTitle(title) {
        $(".dvTitle span").text(title);
    }
})(jQuery);

function ChooseFile() {
    //私有属性
    var thisC = this;
    var pfoldid = new Array();
    var html = "<div id=\"dvDialog\" oncontextmenu=\"return false;\" onselectstart=\"return false;\"><div class=\"dvTitle\"><span>选择文件</span></div><div class=\"dvContent\"><div id=\"dvMain\"></div></div><div class=\"dvButtons\"><span>&nbsp;<select id=\"ddlOrderBy\">\<option value=\"1\">默认排序</option>\<option value=\"2\">按名称升序</option>\<option value=\"3\">按名称降序</option>\<option value=\"4\">按创建日期升序</option>\<option value=\"5\">按创建日期降序</option>\</select>&nbsp; &nbsp; &nbsp;<button class=\"btnOk\" title=\"确定\" onclick=\"return cf.ChooseFile();\"></button>&nbsp;<button class=\"btnCancel\" title=\"取消\" onclick=\"return cf.ShowDialog(0);\"></button></span</div></div>";
    //公共属性
    this.type = "";
    this.ctrl = "";//触发的控件，同时为返回值所输出到的控件
    //私有方法
    var CheckChoose = function () {
        return $(".selected").length > 0 ? true : false;
    }

    //公共方法
    //初始化
    this.Init = function (type) {
        //初始化内容
        if (type != undefined)
            thisC.type = type;
        $("body").append(html);
        $("#ddlOrderBy").val("1");
        $("#ddlOrderBy").change(function () {
            var fid = pfoldid[pfoldid.length - 1];
            thisC.SetContent(fid, true);
        });
    }
    //设置删选类型
    this.SetType = function (type) {
        thisC.type = type;
    }
    //设置文本
    this.SetContent = function (fid, bRefresh) {
        if (fid != -1) {
            if (!bRefresh)
                pfoldid.push(fid);
        }
        else {
            pfoldid.pop();
            fid = pfoldid[pfoldid.length - 1];
        }
        var orderby = $("#ddlOrderBy").val();
        var value = UC_ChooseFile.GetFolds(fid, thisC.type, orderby).value;
        $("#dvMain").html(value);
        $("#dvMain a").click(function () {
            var foldid = $(this).attr("foldid");
            if (foldid != undefined) {
                thisC.SetContent(foldid, false);
            } else {
                $(".selected").removeClass("selected");
                $(this).addClass("selected");
            }
        })
        return value;
    }
    //模板选择框
    this.ShowDialog = function (type, ctrl) {
        var id = "dvDialog";
        if (type == 1) {
            var value = thisC.SetContent("", false);
            $.showPopLayer({
                target: id,
                value: value
            })
            thisC.ctrl = ctrl;
        } else {
            $.closePopLayer();
        }
        return false;
    }
    //选择母版文件
    this.ChooseFile = function () {
        if (CheckChoose()) {
            var fileName = $(".selected label").text();
            var filePath = $(".selected").attr("filepath");
            $(thisC.ctrl).val(filePath);
            thisC.ShowDialog(0);
        } else {
            alert("请选择一个文件。");
        }
    }
};
//初始化对象
var cf = new ChooseFile();