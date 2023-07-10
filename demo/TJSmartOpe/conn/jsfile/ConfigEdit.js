//配置编辑
function ConfigEdit(db) {
    //私有属性
    var _text = 1, _number = 2, _bool = 3, _color = 4, _option = 5, _time = 6;
    var thisC = this;

    //私有方法
    //根据值类型获取html
    var GetHtmlByValueType = function (type) {
        var html = "";
        switch (type) {
            case _text:
                html = "<input id=\"txtValue\" type=\"text\" style=\"width: 560px\" />";
                break;
            case _number:
                html = "<input id=\"txtValue\" type=\"text\" style=\"width: 560px\"  title=\"该值应为合法数字。\"/>";
                break;
            case _bool:
                html = "<select id=\"ddlValue\"><option value=\"1\">是</option><option value=\"0\">否</option></select>";
                break;
            case _color:
                html = "<input id=\"txtValue\" type=\"text\" style=\"width:100px;\" onpropertychange=\"ce.SetValueColor();\"/><a id=\"cColor\"><img src=\"/i/Defined/color.png\" title=\"颜色\" alt=\"颜色\" /></a>";
                break;
            case _option:
                var name = $("#lblName").text();
                html = ConfigEdit.GetOpitionsByName(db,name).value;
                break;
            case _time:
                html = show_input_datetime_base("dtValue", "", "1", "111111");
                break;
            default: break;
        }
        return html;
    }
    //根据值类型设置值
    var SetValueByValueType = function (value, type) {
        if (type == 0)
            type = parseInt($("#lblValueType").val(), 10);
        else
            type = parseInt($("#ddlValueType").val(), 10);
        switch (type) {
            case _text:
                if (value != "")
                    $("#txtValue").val(value);
                break;
            case _number:
                if (value != "")
                    $("#txtValue").val(value);
                break;
            case _bool:
                if (value != "")
                    $("#ddlValue").val(value);
                break;
            case _color:
                if (value != "")
                    $("#txtValue").val(value);
                new baidu.ui.ColorPicker({
                    element: "cColor", autoRender: true, onchosen: function (data) {
                        baidu.dom.setAttr("txtValue", "value", data.color)
                    }, more: true
                });
                break;
            case _option:
                if (value != "")
                    $("#ddlValue").val(value);
                break;
            case _time:
                SetCtrlDateTime(frmMain, "dtValue", value);
                $(".time_unit").css("height", "14px");
                break;
            default: break;
        }
    }
    //根据值类型获取值
    var GetValueByValueType = function (type) {
        if (type == 0)
            type = parseInt($("#lblValueType").val(), 10);
        else
            type = parseInt($("#ddlValueType").val(), 10);
        var value = "";
        switch (type) {
            case _text:
                value = $("#txtValue").val();
                break;
            case _number:
                value = $("#txtValue").val();
                break;
            case _bool:
                value = $("#ddlValue").val();
                break;
            case _color:
                value = $("#txtValue").val();
                break;
            case _option:
                value = $("#ddlValue").val();
                break;
            case _time:
                value = $("#dtValue").val();
                break;
            default: break;
        }
        return value;
    }
    //对值的合法性进行检测
    var CheckValue = function (cfg) {
        var b = true;
        if (cfg.CfgValueType == _number) {
            if (isNaN(cfg.CfgValue)) {
                b = false;
                document.all.txtValue.select();
                document.all.txtValue.focus();
                alert("请检查该值是否符合数字类型。");
            }
        }
        return b;
    }
    //显示动画
    var ShowAnimate = function () {
        if ($("#dvAnimate").length < 1) {
            var animate = "<div id='dvAnimate' style='position:absolute;left:101px;top:502px;width:848px;height:249px;border:1px solid black;z-index:99;filter:alpha(opacity=50);background-color:#E0F7FC;'></div>"
            $("#dvEdit").after(animate);
            $("#dvAnimate").animate({ left: '201px', top: '602px', width: '748px', height: '149px' }, 'normal', function () {
                $(this).remove();
            });
        }
    }
    var DdlChange = function (value) {
        var type = parseInt(value, 10);
        if (type != 5) {
            $("#dvValue").html(GetHtmlByValueType(type));
            SetValueByValueType("", 1);
        } else {
            $("#dvValue").html(GetHtmlByValueType(_text));
            $("#txtValue").val("value1:desc1,value2:desc2,value3:desc3");
        }
    }
    //公共方法
    //初始化
    this.Init = function () {
        //初始化菜单
        thisC.SetMenu();
        //初始化内容
        thisC.SetContent();
    }
    //设置Menu内容
    this.SetMenu = function (menu) {
        var html = ConfigEdit.GetGroupMenu(db).value;
        $("#dvMenu").html(html);
        //点击事件
        $("#dvMenu .menu li a").click(function () {
            $(".liSelected").removeClass("liSelected")
            $(this).addClass("liSelected");
            thisC.SetContent();
        });
        if (menu != undefined) {
            $("#dvMenu .menu li a").each(function (i) {
                if ($(this).text() == menu) {
                    $(this).click();
                    return;
                }
            })
        }
    }
    //设置Table内容
    this.SetContent = function () {
        var groupName = $(".liSelected").text();
        var str = ConfigEdit.GetConfigsByGroup(db,groupName).value;
        $("#dvContent").html(str);
        thisC.SetColor();
        thisC.SetTrClick();
    }
    //设置隔行变色
    this.SetColor = function () {
        $("#tbContent tr").each(function (i) {
            if (i != 0)
                if (i % 2 == 0)
                    $(this).css("background-color", "#E0F0F5");
        })
    }
    //设置行点击事件
    this.SetTrClick = function () {
        $("#tbContent tr").click(function () {
            if ($(this).attr("class") == "last") {
                thisC.Add();
            }
            else if ($(this).attr("cfgid") != -1) {
                $("#tbContent .trSelected").removeClass("trSelected")
                $(this).addClass("trSelected");
                thisC.SetEdit($(this).attr("cfgid"));
            }
        });
    }
    //设置编辑区内容
    this.SetEdit = function (id) {
        thisC.SetEditArea(0);
        var strValueType = ["文本", "数字", "布尔", "颜色", "选项", "时间"];
        var cfg = ConfigEdit.GetConfigById(db,id).value;
        $("#imgSave").attr("cfgid", cfg.CfgId);
        $("#lblName").text(cfg.CfgName);
        $("#lblCName").text(cfg.CfgCName);
        var valueType = parseInt(cfg.CfgValueType, 10);
        var html = GetHtmlByValueType(valueType);
        $("#dvValue").html(html);
        $("#lblValueType").val(valueType);
        $("#lblValueType").text(strValueType[valueType - 1]);
        SetValueByValueType(cfg.CfgValue, 0);
        $("#txtDesc").val(cfg.CfgDesc == "" ? cfg.CfgCName : cfg.CfgDesc);
    }
    //获取编辑区内容
    this.GetEdit = function () {
        var cfg = {
            CfgId: $("#imgSave").attr("cfgid"),
            CfgName: "",
            CfgCName: "",
            CfgGroup: "",
            CfgValueType: $("#lblValueType").val(),
            CfgValue: GetValueByValueType(0),
            CfgDesc: ""
        };
        return cfg;
    }
    //设置值文本框的背景色
    this.SetValueColor = function () {
        var color = $("#txtValue").val()
        $("#txtValue").css("background-color", color);
    }
    //添加
    this.Add = function () {
        $(".trSelected").removeClass("trSelected");
        ShowAnimate();
        thisC.SetEditArea(1);
    }
    //设置新增区
    this.SetEditArea = function (type) {
        if (type == 0) {
            if ($("#txtName").length > 0) {
                $("#lblName").show();
                $("#lblCName").show();
                $("#lblValueType").show();
                $("#txtDesc").attr("disabled", "disabled");
                $("#txtDesc").animate({ height: '70px' });

                $("#txtName").remove();
                $("#txtCName").remove();
                $("#ddlValueType").remove();
                $("#dvGroup").remove();
            }
        }
        else if ($("#txtName").length == 0) {
            $("#lblName").hide();
            $("#lblName").after("<input type='text' id='txtName'>");
            $("#lblCName").hide();
            $("#lblCName").after("<input type='text' id='txtCName'>");
            $("#lblValueType").hide();
            $("#lblValueType").after("<select id='ddlValueType'><option value=1>文本</option><option value=2>数字</option><option value=3>布尔</option><option value=4>颜色</option><option value=5>选项</option><option value=6>时间</option></select>");
            $("#ddlValueType").change(function () {
                DdlChange($(this).val());
            })
            $("#dvValue").html(GetHtmlByValueType(_text));

            $("#txtDesc").val("");
            $("#txtDesc").removeAttr("disabled");
            $("#txtDesc").animate({ height: '40px' });
            $("#imgSave").attr("cfgid", "-1");

            $("#dvEdit").append("<div id='dvGroup' style='position: absolute; left: 5px; top: 120px; width: 730px; height: 25px;display:none;'><label>分组:</label><input type='text' id='txtGroup' style='left:53px;position:absolute;' value='Config'></div>")
            $("#dvGroup").show(500);
        } else {
            $("#txtName").val("");
            $("#txtCName").val("");
            $("#ddlValueType").val(1);
            DdlChange(1);
        }
    }
    //保存
    this.Save = function () {
        var cfg = thisC.GetEdit();
        if (cfg.CfgId != "-1" && CheckValue(cfg)) {
            var b = ConfigEdit.UpdateConfigById(db,cfg).value;
            if (b == "true") {
                thisC.SetContent();
            }
        } else {
            var strDdl = "";
            cfg.CfgValueType = parseInt($("#ddlValueType").val(), 10);
            if (cfg.CfgValueType != 5) {
                cfg.CfgValue = GetValueByValueType(1);
            } else {
                var ddl = $("#txtValue").val().split(',');
                if (ddl.length > 1) {
                    for (var i = 0; i < ddl.length; i++) {
                        if (ddl[i].indexOf(':') != -1) {
                            var value = ddl[i].split(':')[0];
                            var desc = ddl[i].split(':')[1];
                            strDdl += StringPP.format("{0}:{1},", value, desc);
                        } else {
                            strDdl += StringPP.format("{0}:{0},", ddl[i], ddl[i]);
                        }
                    }
                    if (strDdl != "")
                        strDdl = strDdl.substring(0, strDdl.length - 1);
                    cfg.CfgValue = ddl[0].split(':')[0];
                } else {
                    alert("请检查选项输入是否合法！");
                    return false;
                }
            }
            if (CheckValue(cfg)) {
                cfg.CfgName = $("#txtName").val();
                if (cfg.CfgName == "") {
                    alert("配置名不能为空！");
                    return false;
                }
                cfg.CfgCName = $("#txtCName").val();
                cfg.CfgDesc = $("#txtDesc").text();
                cfg.CfgGroup = $("#txtGroup").val();
                var b = ConfigEdit.AddConfig(db,cfg, strDdl).value;
                if (b == "true") {
                    alert("添加成功！");
                    thisC.SetMenu(cfg.CfgGroup);
                    thisC.SetContent();
                } else {
                    alert(b);
                }
            }
        }
        return false;
    }
};