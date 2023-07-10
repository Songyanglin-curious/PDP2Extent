function Sortable(options, fnLoad) {
    if (!options || !options.selectContent) {
        alert("请设置选择内容！");
        return false;
    }
    if (!options.replaceDivID) {
        alert("请设置要配置的div的ID！");
        return false;
    }
    var defaults = {
        selectImgUrl: 'Images/Menu5/CommonConfig.png', //选择图片路径
        selectTitle: '选择内容', //选择按钮提示
        selectClass: 'sortable', //选择图片样式
        selectContentClass: 'selectContent', //选择内容整体样式
        selectContentTitle: '选择要显示的内容：', //选择内容标题
        selectTitleClass: 'selectTitle', //选择标题样式
        selectContentSingle: 'selectContentSingle', //单个选择项样式
        columnClass: 'column', //分列div样式
        placeholderClass: 'placeholder', //拖动占位框样式
        selectContent: [], //选择内容，json数组
        replaceDivID: "" //配置内容所在的div的id
    };
    var options = $.extend(defaults, options);
    var savedOption = {}; //读取到的配置信息
    var arrContent = []; //页面上显示的块集合
    var _this = this;
    this.init = function () {
        addStyle(".sortable{position: absolute;top: 0;right: 0;z-index=1002;}");
        addStyle(".selectContent{position: absolute;top: 0px;right: 0px;border: 4px solid #F0F0F0;width: 300px; display: none;background: #fff;}");
        addStyle(".column { width: 50%; float: left; padding-bottom: 100px; padding-left: 5px; padding-right: 5px;}");
        addStyle(".placeholder { border: 1px dotted black; visibility: visible !important; background:#eaf5fe; }");
        this.initPage();
        this.addSelect();
        if (typeof fnLoad == "function")
            fnLoad(arrContent);
    };
    //添加选择按钮以及选择项
    this.addSelect = function () {
        $("body").append("<div class='" + options.selectClass + "' title='" + options.selectTitle + "'><img src='" + options.selectImgUrl + "' />"
            + "<div class='" + options.selectContentClass + "' >" + _this.getContentHTML() + "</div></div>");
        var selectDiv = $("." + options.selectClass);
        //if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
        var timer = 0;
        $(window).on("scroll resize", function () {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }
            timer = setTimeout(function () {
                selectDiv.css("top", $(window).scrollTop());
                selectDiv.css("left", $(window).scrollLeft() + $(window).width() - selectDiv.width());
                timer = null;
            }, 1);
        });
        //}
        //else { //不支持fixed  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 4.0 Transitional//EN">
        //  selectDiv.css("position", "fixed");
        //}
        selectDiv.find("img").css("cursor", "hand")
        .click(function (e) {
            var selectContent = $(this).next();
            if (selectContent.is(":visible")) {
                closeSelect(selectContent);
            }
            else {
                arrContent = new Array();
                selectContent.css("top", selectContent.css("top") + "px").css("right", $(this).width() + "px").show(1000).click(function (e) { e.stopPropagation(); });
                e.stopPropagation();
                $(document).on("click", function () {
                    closeSelect(selectContent);
                });
                $("body").append("<div id='divMask' style='background:black;position:absolute;top:0px;left:0px;width:" + $(document).width()
                    + ";height:" + $(document).height() + ";z-index=500;opacity: 0.5;filter:alpha(opacity=50);'></div>");
            }
        });
        function closeSelect(selectContent) {
            selectContent.hide(1000);
            $("#divMask").remove();
            $(document).off("click");
            if (typeof fnLoad == "function")
                fnLoad(arrContent);
        };
        selectDiv.find("." + options.selectContentClass).find(":checkbox").on("click", function () {
            var divID = $(this).val();
            if ($(this).prop("checked")) {
                if ($("#divContentLeft").height() > $("#divContentRight").height())
                    _this.addContentDiv(divID, "Right");
                else
                    _this.addContentDiv(divID, "Left");
            }
            else {
                $("#" + options.replaceDivID).append($("#" + divID));
                arrContent.erase(divID);
            }
        });
    };
    //生成选择项页面
    this.getContentHTML = function () {
        var html = "<p class='" + options.selectTitleClass + "'>" + options.selectContentTitle + "</p>";
        for (var i = 0; i < options.selectContent.length; i++) {
            html += "<p class='" + options.selectContentSingle + "'><input type='checkbox' value='" + options.selectContent[i].id + "' " + (arrContent.indexOf(options.selectContent[i].id) >= 0 ? "checked" : "") + "/>" + options.selectContent[i].desc + "</p>";
        }
        return html;
    };
    //初始化页面布局
    this.initPage = function () {
        var replaceDiv = $("#" + options.replaceDivID);
        replaceDiv.hide();
        replaceDiv.parent().css("verticalAlign", "top").css("width", "100%").append("<div id='divContentLeft' class='column ui-sortable'></div><div id='divContentRight' class='column ui-sortable'></div>");
        this.read();
        for (var p in savedOption) {
            var arr = savedOption[p];
            for (var i = 0; i < arr.length; i++) {
                this.addContentDiv(arr[i], p);
            }
        }
        $(".column").sortable({
            connectWith: ".column",
            placeholder: "placeholder"
        });
    }
    //id:加入块的id，position:left,right
    this.addContentDiv = function (id, position) {
        $("#" + id).find("script").remove();
        //var div = $("#divContent" + position).append("<div></div>");
        //div.append($("#" + id));
        $("#divContent" + position).append($("#" + id));
        arrContent.push(id);
    };
    //保存配置
    this.save = function () {
        var strData = "{ \"Left\":[";
        var arr = new Array();
        $("#divContentLeft").children().each(function () { arr.push("\"" + this.id + "\""); });
        strData += arr.join() + "], \"Right\": [";
        arr = new Array();
        $("#divContentRight").children().each(function () { arr.push("\"" + this.id + "\""); });
        strData += arr.join() + "] }";
        this.ajaxOpe({ type: "set", content: strData });
    };
    //读取之前的配置
    this.read = function () {
        //return { Left: ["docFlow_tblNeedsDeal"], Right: [] };
        this.ajaxOpe({ type: "get" });
    }
    this.ajaxOpe = function (opeData) {
        $.ajax({
            url: "conn/ashx/SortableHandler.ashx",
            type: "post",
            data: opeData,
            cache: false,
            success: function (data) {
                if (typeof (data) != "undefined" && data != null && typeof (data.flag) != "undefined" && data.flag == '0') {
                    alert(data.msg);
                    return false;
                }
                if (opeData.type == "get")
                    savedOption = $.parseJSON(data.text);
            },
            error: function (data, status, e) {
                alert(e);
                return false;
            }
        });
    }
    this.init();
    $(window).unload(function () {
        _this.save();
    });
}