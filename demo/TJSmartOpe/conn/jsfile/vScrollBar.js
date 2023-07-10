function VScrollBar(id, options) {
    //create by popduke 2008-08-14 version:1.0
    //edit by popduke 2011-05-16 version:2.0同一页面支持多个
    //update by subo 2013-01-22 version:3.0将控件PDP化，增加了接口用来获取和设定值以及设定是否启用
    //私有属性
    var defaults = {//参数
        minValue: 0,//最小值
        maxValue: 100,//最大值
        addValue: 1,//步增值
        enabled: true//默认是否启用
    };
    var options = $.extend(defaults, options);
    var thisP = this;
    var input = $("#" + id + " input")[0];
    var upArrow = $("#" + id + "up");
    var downArrow = $("#" + id + "down");
    var select = $("#" + id + " select")[0];
    //私有方法
    var GetTop = function (obj) {
        var offset = obj.offsetTop;
        if (obj.offsetParent != null) offset += GetTop(obj.offsetParent);
        return offset;
    };
    //公共方法
    //初始化
    this.Init = function () {
        input.onafterpaste = input.onkeyup = function () {
            event.srcElement.value = event.srcElement.value.replace(/[^\d\.\/]/ig, '');
            if (parseFloat(event.srcElement.value) > defaults.maxValue)
                event.srcElement.value = defaults.maxValue;
            if (parseFloat(event.srcElement.value) < defaults.minValue)
                event.srcElement.value = defaults.minValue;
        }
        input.onkeydown = function () {
            if (event.keyCode == 40)
                event.srcElement.value = parseFloat(event.srcElement.value) - defaults.addValue;
            if (event.keyCode == 38)
                event.srcElement.value = parseFloat(event.srcElement.value) + defaults.addValue;
        }
        input.onmousewheel = function () {
            if (event.wheelDelta < 0)
                event.srcElement.value = parseFloat(event.srcElement.value) - defaults.addValue;
            else
                event.srcElement.value = parseFloat(event.srcElement.value) + defaults.addValue;
        }
        input.onpropertychange = function () {
            if (event.srcElement.value.replace(/ /g, "") == "")
                event.srcElement.value = defaults.minValue;
            if (parseFloat(event.srcElement.value) > defaults.maxValue)
                event.srcElement.value = defaults.maxValue;
            if (parseFloat(event.srcElement.value) < defaults.minValue)
                event.srcElement.value = defaults.minValue;
        }
        upArrow.click(function () {
            input.value = parseFloat(input.value) + defaults.addValue;
            return false;
        });
        downArrow.click(function () {
            input.value = parseFloat(input.value) - defaults.addValue;
            return false;
        });
        upArrow.css("height", 10);
        downArrow.css("height", 10);
        this.SetEnabled(defaults.enabled);
    };
    //获取值
    this.GetValue = function () {
        return parseFloat(input.value);
    };
    //设定值
    this.SetValue = function (val) {
        input.value = val;
    }
    //设定是否启用
    this.SetEnabled = function (b) {
        if (b) {
            $(input).removeAttr("disabled");
            upArrow.removeAttr("disabled");
            downArrow.removeAttr("disabled");
        }
        else {
            $(input).attr("disabled", "disabled");
            upArrow.attr("disabled", "disabled");
            downArrow.attr("disabled", "disabled");
        }
    }
};