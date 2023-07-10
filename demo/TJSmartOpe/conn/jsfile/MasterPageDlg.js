//母版配置编辑
function MastPageDlg() {
    //私有属性
    var thisC = this;
    var attrs;
    //公共方法
    //点击确定的提交事件
    this.OK = function () {
        thisC.SaveAttrs();
        window.returnValue = 1;
        window.close();
    };
    //从母版Xml文件中读取全部属性
    this.GetAll = function (xmlName) {
        return MasterPageSetDlg.GetAll(xmlName).value;
    };
    //从List中读取出指定种类的值[String type,String value1,String value2]
    this.Get = function (list, type) {
        var arr = new Array();
        for (var i = 0; i < list.length; i++) {
            if (list[i][0] == type) {
                var tmp = [list[i][1], list[i][2]];
                arr.push(tmp);
            }
        }
        return arr;
    };
    //根据数据类型获取下拉框的html，数据类型：string、int、decimal、date、session、request、dll、config，type为空的话默认为string
    this.GetDdl = function (type) {
        var html = "<select style='width:100%;height:30px;float:left;'>";
        html += StringPP.format("<option value='string'{0}>字符串</option>", (type == "string" || type == "" ? " selected" : ""));
        html += StringPP.format("<option{0} value='int'>整数</option>", (type == "int" ? " selected" : ""));
        html += StringPP.format("<option{0} value='decimal'>浮点数</option>", (type == "decimal" ? " selected" : ""));
        html += StringPP.format("<option{0} value='date'>时间</option>", (type == "date" ? " selected" : ""));
        html += StringPP.format("<option{0}>session</option>", (type == "session" ? " selected" : ""));
        html += StringPP.format("<option{0}>request</option>", (type == "request" ? " selected" : ""));
        html += StringPP.format("<option{0}>dll</option>", (type == "dll" ? " selected" : ""));
        html += StringPP.format("<option{0}>config</option>", (type == "config" ? " selected" : ""));
        html += "</select>";
        return html;
    }
    //根据属性的值以及类型，生成html并追加显示到页面上
    this.SetAttrs = function () {
        try {
            ctrl = window.dialogArguments;
            var html = "";
            for (var i = 0; i < attrs.length; i++) {
                var value = ctrl.attrs[attrs[i][0]] ? ctrl.attrs[attrs[i][0]] : "";
                var type = "";
                if (value.indexOf("@") != -1) {
                    type = value.split('@')[0];
                    value = value.split('@')[1];
                }
                html += StringPP.format("<tr><td>{0}</td><td>{1}</td><td><input type='text' style='border:0px;width:180px;height:100%;' value='{2}' ondblclick=\"mpd.ShowDialog(1,'{0}');\"></td><td>{3}</td></tr>", attrs[i][0], thisC.GetDdl(type), value, attrs[i][1]);
            }
            $("#table1").append(html);
            thisC.SetCss();
        } catch (err) { }
    };
    //设置样式属性，包括隔行变色以及行选中
    this.SetCss = function () {
        $(".bluetable tr").each(function (i) {
            if (i > 0) {
                $(this).find("input").css("background-color", i % 2 != 0 ? "#E0F0F5" : "white");
                $(this).css("background-color", i % 2 != 0 ? "#E0F0F5" : "white");
            }
        });

        $(".bluetable tr").click(function () {
            $(".bluetable .trSelected").removeClass("trSelected")
            $(this).addClass("trSelected");
        });
    };
    //保存属性值
    this.SaveAttrs = function () {
        try {
            ctrl = window.dialogArguments;
            $("#table1 tr").each(function (i) {
                if (i > 0) {
                    var attr = $(this).find("td").eq(0).text();//属性名
                    var type = $(this).find("td").eq(1).children().val();//数据类型
                    var value = $(this).find("td").eq(2).children().val();//值
                    ctrl.attrs[attr] = value != "" ? StringPP.format("{0}@{1}", type, value) : "";
                }
            });
            var mstpg_id = $("#mstpg_id").val();
            var mstpg_name = $("#mstpg_name").val();
            var mstpg_desc = $("#mstpg_desc").val();
            if (mstpg_id != "" && mstpg_id.indexOf('_temp_id_') == -1)
                ctrl.id = mstpg_id;
            else
                ctrl.id = "";
            ctrl.name = mstpg_name;
            ctrl.desc = mstpg_desc;
        } catch (err) { }
    };
    //载入完成后执行，初始化面板的值
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
        var result = thisC.GetAll(xmlName);
        attrs = thisC.Get(result, "attr");
        thisC.SetAttrs();
    });

    //文本编辑框
    this.ShowDialog = function (type, title) {
        var id = "dvDialog";
        el = event.srcElement;
        if (type == 1) {
            $.showPopLayer({
                target: id,
                title: title,
                value: el.value
            })
        } else {
            $.closePopLayer();
        }
        return false;
    };
    //更新文本值
    this.UpdateText = function () {
        $(el).val($("#txtDialog").text());
        thisC.ShowDialog(0);
    };
};
//初始化对象
var mpd = new MastPageDlg();

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
            title: "",
            value: ""
        }, options);
        showIt(options);
        SetValue(options.title, options.value);
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
    function SetValue(title, value) {
        $(".dvTitle span").text(title);
        $("#txtDialog").text(value);
    }
})(jQuery);