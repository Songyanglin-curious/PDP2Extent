function DataCurveEdit(id, options) {
    //私有属性
    var defaults = {//参数
        mode: 1,//模式
        interval: 15,//时间间隔
        units: "",//单位名称，可选
        decimalDigits: 3,//小数位数
        cols: 4,//每行数据条数
        isEditable: false,//可编辑
        showChangeTip: false,//显示数值变化提示
        dbName: "",//数据库节点名称
        tbName: "",//数据库表名
        idCol: "",//id列名，模式1、2
        id: "",
        dateCol: "",//日期列名，模式1、2
        date: "",
        valueCol: "",//数值列名，模式2
        valueColDesc: "值",//数值列的显示名
        startTime: "00:00"
    };
    var options = $.extend(defaults, options);
    var html = "";
    var thisP = this;
    //私有方法
    //返回一个td标签
    var GetTd = function (value, css) {
        if (!css)
            return StringPP.format("<td>{0}</td>", value);
        else
            return StringPP.format("<td class='{1}'>{0}</td>", value, css);
    }
    //返回一个th标签
    var GetTh = function (value, css) {
        if (!css)
            return StringPP.format("<th>{0}</th>", value);
        else
            return StringPP.format("<th class='{1}'>{0}</th>", value, css);
    }
    //返回下一个时间点的字符串
    var GetNextTimeStr = function (timeStr) {
        var str = "";
        var time = timeStr.split(":");
        var hour = StringPP.toInt(time[0]);
        var minute = StringPP.toInt(time[1]);

        minute += defaults.interval;
        if (minute >= 60) {
            minute -= 60;
            hour++;
            if (hour >= 24)
                hour -= 24;
        }
        str = StringPP.format("{0}:{1}", Trans00Format(hour), Trans00Format(minute));//function.js中方法
        return str;
    };
    //设置值变化提示
    var SetChangeTip = function () {
        $("#" + id + " table input").change(function () {
            var valueNew = StringPP.toFloat($(this).val());
            $(this).val(valueNew.toFixed(defaults.decimalDigits));//进行小数格式化
            if (defaults.showChangeTip) {
                switch (defaults.mode) {
                    case 1:
                        var valueOld = StringPP.toFloat($($(this).parent().prev().children().get(0)).text()); break;
                    case 2:
                        var valueOld = $(this).attr("record");
                        break;
                    default: break;
                }
                var d = (valueNew - valueOld).toFixed(defaults.decimalDigits);
                if (d > 0) {
                    $(this).attr("title", StringPP.format("上涨{0}", d));
                    $(this).addClass("dceHigher");
                }
                else if (d < 0) {
                    d = (-d).toFixed(defaults.decimalDigits);
                    $(this).attr("title", StringPP.format("下降{0}", d));
                    $(this).addClass("dceLower");
                }
                else {
                    $(this).removeAttr("title");
                    $(this).removeClass("dceHigher");
                    $(this).removeClass("dceLower");
                }
            }
        });
    }
    // 公共方法
    //初始化
    this.Init = function () {
        var totalMin = 24 * 60;
        var nodes = totalMin / defaults.interval;
        var rows = nodes / defaults.cols;
        var time = defaults.startTime;
        var html = "";
        html += "<table>";
        switch (defaults.mode) {
            case 1:
                html += "<tr>";
                for (var i = 0; i < defaults.cols; i++) {
                    html += GetTd("时间");
                    var colName = defaults.valueColDesc.split(',');
                    if (defaults.isEditable && colName.length == 2)
                        for (var j = 0; j < colName.length; j++)
                            html += GetTd(colName[j]);
                    else
                        html += GetTd(colName[0]);
                }
                html += "</tr>";
                for (var i = 0; i < rows; i++) {
                    html += "<tr>";
                    for (var j = 0; j < defaults.cols; j++) {
                        html += GetTd(time, "dceFirst");
                        html += GetTd("<span style='width:100%;'></span>");
                        if (defaults.isEditable) {
                            html += GetTd("<input type='text' style='width:100%;'>");
                        }
                        time = GetNextTimeStr(time);
                    }
                    html += "</tr>";
                }
                break;
            case 2:
                html += "<tr>";
                for (var i = 0; i < defaults.cols; i++) {
                    html += GetTd("时间");
                    var colName = defaults.valueColDesc.split(',');
                    if (defaults.isEditable && colName.length == 2)
                        for (var j = 0; j < colName.length; j++)
                            html += GetTd(colName[j]);
                    else
                        html += GetTd(colName[0]);
                }
                html += "</tr>";
                for (var i = 0; i < rows; i++) {
                    html += "<tr>";
                    for (var j = 0; j < defaults.cols; j++) {
                        html += GetTd(time, "dceFirst");
                        html += GetTd("<span style='width:100%;'></span>");
                        if (defaults.isEditable) {
                            html += GetTd("<input type='text' style='width:100%;'>");
                        }
                        time = GetNextTimeStr(time);
                    }
                    html += "</tr>";
                }
                break;
            default:
                break;
        }
        html += "</table>";
        $("#" + id).html(html);
        $("#" + id + " table tr:eq(0)").css({ "font-weight": "bold" });
        SetChangeTip();
    };
    //获取全部值
    this.GetAll = function (type) {
        var values = new Array();
        switch (defaults.mode) {
            case 1:
                if (type == 1) {
                    $("#" + id + " table span").each(function (i) {
                        values.push($(this).text());
                    });
                } else if (type == 2) {
                    $("#" + id + " table input").each(function (i) {
                        values.push($(this).val());
                    });
                }
                break;
            case 2:
                if (type == 1) {
                    $("#" + id + " table span").each(function (i) {
                        values.push($(this).text());
                    });
                } else if (type == 2) {
                    $("#" + id + " table input").each(function (i) {
                        values.push($(this).val());
                    });
                }
                break;
            default: break;
        }
        return values;
    };
    //重置数据
    this.GetData = function (_id, _date) {
        defaults.id = _id;
        defaults.date = _date;
        $(".dceHigher").each(function () {
            $(this).removeClass("dceHigher");
        });
        $(".dceLower").each(function () {
            $(this).removeClass("dceLower");
        });
        switch (defaults.mode) {
            case 1:
                var result = UserControl_DataCurveEdit.GetMode1(defaults.dbName, defaults.tbName, defaults.idCol, defaults.id, defaults.dateCol, defaults.date).value.split(';');
                $("#" + id + " table span").each(function (i) {
                    value = parseFloat(result[i]).toFixed(defaults.decimalDigits);
                    $(this).text(value);
                    $($("#" + id + " table input").get(i)).val(value);
                });
                break;
            case 2:
                var result = UserControl_DataCurveEdit.GetMode2(defaults.dbName, defaults.tbName, defaults.idCol, defaults.id, defaults.dateCol, defaults.date, defaults.valueCol).value.split(';');
                $("#" + id + " table span").each(function (i) {
                    value1 = parseFloat(result[i].split(',')[0]).toFixed(defaults.decimalDigits);
                    value2 = parseFloat(result[i].split(',')[1]).toFixed(defaults.decimalDigits);
                    $(this).text(value1);
                    $($("#" + id + " table input").get(i)).val(value2);
                    $($("#" + id + " table input").get(i)).attr("record", value2);
                });
                break;
            default: break;
        }
    };
    //保存
    this.Save = function () {
        if (defaults.isEditable) {
            switch (defaults.mode) {
                case 1:
                    var values = thisP.GetAll(2);
                    var b = UserControl_DataCurveEdit.SaveMode1(defaults.dbName, defaults.tbName, defaults.idCol, defaults.id, defaults.dateCol, defaults.date, values).value;
                    if (b) {
                        thisP.GetData(defaults.id, defaults.date);
                        alert("保存成功。");
                    } else {
                        alert("保存失败！");
                    }
                    break;
                case 2:
                    var values = thisP.GetAll(2);
                    var b = UserControl_DataCurveEdit.SaveMode2(defaults.dbName, defaults.tbName, defaults.idCol, defaults.id, defaults.dateCol, defaults.date, values, defaults.valueCol.split(',')[1], defaults.interval).value;
                    if (b) {
                        thisP.GetData(defaults.id, defaults.date);
                        alert("保存成功。");
                    } else {
                        alert("保存失败！");
                    }
                    break;
                default: break;
            }
        }
        else
            return null;
    }
};