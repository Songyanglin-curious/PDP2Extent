//配置编辑
function PropSetDlg() {
    //私有属性
    var thisC = this;
    var tag;
    //文本编辑框的源el对象
    var el;
    //刷新数据源的记录
    var refreshed = "";
    //私有方法
    //根据值类型获取值
    var GetValueByValueType = function (type, td) {
        var value = "";
        switch (type) {
            case "0"://复选框
                value = td.find("input").attr("checked") ? "true" : "false";
                break;
            case "4"://选项
                value = td.find("select").val();
                break;
            case "1"://文本
            case "2"://整型
            case "3"://浮点数
            case "5"://颜色
            case "6"://图片
                value = td.find("input").val();
                break;
            default: break;
        }
        return value;
    };
    //对值的合法性进行检测
    var CheckKey = function (key, type) {
        var b = false;
        switch (type) {
            case "2"://整型
                if ((key >= 48 && key <= 57) || (key >= 37 && key <= 40) || (key >= 96 && key <= 105) || key == 46 || key == 8)
                    b = true;
                break;
            case "3"://浮点数
                if ((key >= 48 && key <= 57) || (key >= 37 && key <= 40) || (key >= 96 && key <= 105) || key == 46 || key == 8 || key == 110)
                    b = true;
                break;
            default: break;
        }
        return b;
    };
    //检查值是否所属于下拉列表
    var CheckDdlValue = function (ddlId, value) {
        var ddl = $("#" + ddlId + " option");
        var b = false;
        ddl.each(function () {
            var val = $(this).val();
            if (val == value)
                b = true;
        })
        return b;
    };
    //设置dll和txt的值
    var SetDdlValue = function (id, value) {
        var ddlId = "ddl" + id;
        var txtId = "txt" + id;
        if (CheckDdlValue(ddlId, value)) {
            $("#" + ddlId).val(value);
            var dataNode = $("#" + ddlId).find('option:selected');
            $("#" + txtId).val(dataNode.text());
            $("#" + txtId).attr("val", dataNode.val());
        } else {
            $("#" + txtId).val(value);
            $("#" + txtId).attr("val", value);
        }
    };

    //公共方法
    //初始化
    this.Init = function (ctrl) {
        tag = ctrl.tag;
        //初始化内容
        thisC.SetContent("dvAttrs", ctrl.attrs, 'a');
        thisC.SetContent("dvStyles", ctrl.styles, 's');
        thisC.SetContent("dvSelfAttr", ctrl.selfattr, 'sa');
        thisC.SetColorPicker();

        //DataNode Begin
        $("#txtDataNode").keyup(function () {
            $(this).attr("val", $(this).val());
            psd.SetDataTable($(this).val(), "");
            psd.SetDataCol($(this).val(), "", "");
        })
        $("#ddlDataNode").click(function () {
            var dataNode = $(this).find('option:selected');
            $("#txtDataNode").val(dataNode.text());
            $("#txtDataNode").attr("val", dataNode.val());
            psd.SetDataTable(dataNode.val(), "");
            psd.SetDataCol(dataNode.val(), "", "");
        })
        $("#ddlDataNode").change(function () {
            var val = $(this).find('option:selected').val();
            if (refreshed.indexOf(val) == -1) {
                refreshed += val + ";";
                PropSetDlg.RefreshDataLink(val);
            }
        })

        //DataNode End
        //DataTable Begin
        $("#txtDataTable").keyup(function () {
            $(this).attr("val", $(this).val());
            var dataNode = $("#txtDataNode");
            psd.SetDataCol(dataNode.attr("val"), $(this).val(), "");
        })
        $("#ddlDataTable").click(function () {
            var dataTable = $(this).find('option:selected');
            var dataNode = $("#txtDataNode");
            $("#txtDataTable").val(dataTable.text());
            $("#txtDataTable").attr("val", dataTable.val());
            psd.SetDataCol(dataNode.attr("val"), dataTable.val(), "");
        })
        //DataTable End
        //DataCol Begin
        $("#txtDataCol").keyup(function () {
            $(this).attr("val", $(this).val());
        })
        $("#ddlDataCol").click(function () {
            var dataCol = $(this).find('option:selected');
            $("#txtDataCol").val(dataCol.text());
            $("#txtDataCol").attr("val", dataCol.val());
        })
        //DataCol End
    };
    //设置Table内容
    this.SetContent = function (id, values, type) {
        var str = PropSetDlg.GetTableByValues(tag, values, type).value;
        $("#" + id).html(str);
        thisC.ChangeDisplay(id, false);
        thisC.SetColor(id);
        thisC.SetTrClick(id);
    };
    //获取Table内容
    this.GetContent = function (id, type) {
        var values = new Object();
        $("#" + id + " tr").each(function (i) {
            if (i != 0) {
                var type = $(this).attr("keytype");
                var key = $(this).find("td:eq(0)").html();
                var td = $(this).find("td:eq(1)");
                var value = GetValueByValueType(type, td);
                if (typeof value != "undefined")
                    values[key] = value;
            }
        });
        return values;
    };
    //设置隔行变色
    this.SetColor = function (id) {
        $("#" + id + " tr:[isshow='1']").each(function (i) {
            $(this).find("input:[text]").css("background-color", i % 2 != 0 ? "#E0F0F5" : "white");
            $(this).css("background-color", i % 2 != 0 ? "#E0F0F5" : "white");
        })
    };
    //设置行点击事件
    this.SetTrClick = function (id) {
        $("#" + id + " tr").click(function () {
            var b = $(this).attr("iscommon");
            if (b) {
                $("#" + id + " .trSelected").removeClass("trSelected")
                $(this).addClass("trSelected");
            }
        });
    };
    //设置值文本框的背景色
    this.SetValueColor = function (id) {
        var color = $("#" + id).val()
        $("#" + id).css("background-color", color);
    };
    //改变单元格的显示状态
    this.ChangeDisplay = function (id, bShow) {
        $("#" + id + " [iscommon='0']").css("display", bShow ? "inline" : "none").attr("isshow", bShow ? "1" : "0");
        var html = StringPP.format("<a href=\"#\" onclick=\"psd.ChangeDisplay('{0}',{1})\">{2}</a>", id, !bShow, bShow ? "↑↑只显示基本属性↑↑" : "↓↓显示全部↓↓");
        var a = event.srcElement;
        $(a).parent().html(html);
        thisC.SetColor(id);
    };
    //保存
    this.Save = function (ctrl) {
        //ctrl.attrs = thisC.GetContent("dvAttrs", 'a');
        //ctrl.styles = thisC.GetContent("dvStyles", 's');
        //ctrl.selfattr = thisC.GetContent("dvSelfAttr", 'sa');
        //Modify by gud 20131009
        var attrs = thisC.GetContent("dvAttrs", 'a');
        for (var a in attrs)
            ctrl.SetAttr(a, attrs[a]);
        var styles = thisC.GetContent("dvStyles", 's');
        for (var s in styles)
            ctrl.SetStyle(s, styles[s]);
        var selfattrs = thisC.GetContent("dvSelfAttr", 'sa');
        for (var sa in selfattrs)
            ctrl.SetSelfAttr(sa, selfattrs[sa]);
        return false;
    };
    //关联调色板和颜色
    this.SetColorPicker = function () {
        $("img:[flag]").each(function (i) {
            var id = $(this).attr("flag");
            var cid = "c" + id;
            var vid = "v" + id;
            thisC.SetValueColor(vid);
            new baidu.ui.ColorPicker({
                element: cid, autoRender: true, onchosen: function (data) {
                    baidu.dom.setAttr(vid, "value", data.color)
                }, more: true
            });
        });
    };
    //检查输入值的合法性
    this.CheckValue = function (type) {
        var ipt = event.srcElement;
        switch (type) {
            case "2"://整型
                if (!CheckKey(event.keyCode, type))
                    return false;
                break;
            case "3"://浮点数
                if (!CheckKey(event.keyCode, type)) {
                    event.returnValue = false;
                }
                else {
                    if (ipt.value.indexOf(".") != -1) {
                        if (event.keyCode == 46) { event.returnValue = false; }
                        if (ipt.value.split(".").length > 2) { event.returnValue = false; }
                    } else {
                        if (ipt.value == "") { if (event.keyCode == 46) { event.returnValue = false; } }
                    }
                }
                break;
            default: break;
        }
    };
    //打开图片选择器
    this.OpenPic = function () {
        var ret = window.showModalDialog("SelPic.aspx?path=" + escape("/Images"), null, "dialogWidth:770px; dialogHeight:640px;scroll:no; center:yes; help:no; resizable:no; status:no");
        if (ret) {
            var e = event.srcElement;
            $(e).parent().prev().val("/Images" + ret);
        }
    };
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
    //设置DataNode的值
    this.SetDataNode = function (dataNode) {
        var html = PropSetDlg.GetDataNodeHtml().value;
        $("#ddlDataNode").html(html);
        SetDdlValue("DataNode", dataNode);
    };
    //设置DataTable的值
    this.SetDataTable = function (dataNode, dataTable) {
        var html = PropSetDlg.GetDataTableHtml(dataNode).value;
        $("#ddlDataTable").html(html);
        SetDdlValue("DataTable", dataTable);
    };
    //设置DataCol的值
    this.SetDataCol = function (dataNode, dataTable, dataCol) {
        var html = PropSetDlg.GetDataColHtml(dataNode, dataTable).value;
        $("#ddlDataCol").html(html);
        SetDdlValue("DataCol", dataCol);
    };
    
};
//初始化对象
var psd = new PropSetDlg();

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