function Linear() {
    var bgEl; //背景图元素
    var dragElLeft; //拖动元素左侧圆点
    var dragElRight; //拖动元素右侧圆点
    var resizeEl; //拖动元素中间的填充条

    var totalWidth = 255; //控件的总宽度
    var perWidth = 25; //每个坐标的间距
    var xMin = 5; //坐标轴的最小x坐标

    var lowerLimit; //下限极值
    var upperLimit; //上限极值
    var lowerValue;//左值
    var upperValue;//右值
    var dates = new Array();

    var dayType = "date"; //日期类型
    //设置数值
    this.SetValue = function (ds, dt) {
        dates = ds.split(';');
        lowerValue = lowerLimit = 0;
        upperValue = upperLimit = dates.length - 1;
        dayType = dt;

        var dif = upperLimit;
        perWidth = Math.floor(totalWidth / dif); //修正坐标间隔
    }
    //设置元素
    this.SetElement = function (el) {
        var id = el.selector;
        bgEl = $(id + '.background');
        dragElLeft = $(id + '.linear .pointLeft');
        dragElRight = $(id + '.linear .pointRight');
        resizeEl = $(id + '.resize .rectangle');
        this.SetDragLeft(dragElLeft); //为两个drag元素设置拖动事件
        this.SetDragRight(dragElRight);

        var initWidth = dragElRight[0].offsetLeft - dragElLeft[0].offsetLeft; //初始化填充条的宽度
        resizeEl.css({ "width": initWidth });
    }
    //计算坐标值，返回所有坐标点的数值
    this.CalculateValue = function () {
        var values = new Array();
        var dt = (dayType == "date") ? 2 : 1;

        for (var i = 0; i < dates.length; i++) {
            values.push(dates[i].split('-')[dt]);
        }
        return values;
    }
    //获取包含坐标值点在内的span元素
    this.GetXValue = function () {
        var str = "";
        var values = this.CalculateValue();
        for (var i = 0; i < values.length - 1; i++) {
            str += "<span style='width:" + perWidth + "px;font-size:0.8em;font-family:Arial,Verdana,Sans-serif'>";
            str += values[i];
            str += "</span>";
        }
        str += "<span style='width:20px;font-size:0.8em;font-family:Arial,Verdana,Sans-serif'>";
        str += values[values.length - 1];
        str += "</span>";
        return str;
    }
    //获取包含分隔符竖线在内的span元素
    this.GetSeparate = function () {
        var str = "";
        var values = this.CalculateValue();
        for (var i = 0; i < values.length - 1; i++) {
            str += "<span style='width:" + perWidth + "px;height:50%;'>";
            str += "|";
            str += "</span>";
        }
        str += "<span style='width:20px;height:50%;'>";
        str += "|";
        str += "</span>";
        return str;
    }
    //设置拖动事件左
    this.SetDragLeft = function (el) {
        var initX = xMin;
        el.css({ "left": initX }); //初始化左侧圆点的定位
        resizeEl.css({ "left": initX + 8 }); //初始化填充条的定位

        el.mousedown(function (e) {
            var disX = e.clientX - el[0].offsetLeft;
            var limitL = xMin; //左侧圆点移动下限

            var limitR = dragElRight[0].offsetLeft - dragElRight[0].clientWidth; //左侧圆点移动上限
            var xx;
            var newWidth;
            $(el).css("background-image", "url('/i/linear_point_down.png')");
            $(document).mousemove(function (e) {
                xx = e.clientX - disX;
                if (xx < limitL)
                    xx = limitL;
                else if (xx > limitR)
                    xx = limitR;
                el.css({ "left": xx });
                resizeEl.css({ "left": xx + 6 });
                newWidth = dragElRight[0].offsetLeft - dragElLeft[0].offsetLeft;
                resizeEl.css({ "width": newWidth });
            });
            $(document).mouseup(function () {
                var dis = xx - xMin;
                var result = Math.round(dis / perWidth) * perWidth;
                xx = result + xMin;

                if (xx >= limitR)
                    xx -= perWidth;
                el.css({ "left": xx });
                resizeEl.css({ "left": xx + 6 });
                newWidth = dragElRight[0].offsetLeft - dragElLeft[0].offsetLeft;
                resizeEl.css({ "width": newWidth });

                lowerValue = (xx - xMin) / perWidth;
                $(el).css("background-image", "url('/i/linear_point_up.png')"); //圆球css特效，如有bug宜注释掉
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
            });
        });
    }
    //设置拖动事件右
    this.SetDragRight = function (el) {
        var initX = xMin + upperLimit * perWidth;
        el.css({ "left": initX }); //初始化右侧圆点的定位

        el.mousedown(function (e) {
            var disX = e.clientX - el[0].offsetLeft;
            var limitL = dragElLeft[0].offsetLeft + dragElLeft[0].clientWidth;
            var limitR = xMin + upperLimit * perWidth;
            var xx;
            var newWidth;
            $(el).css("background-image", "url('/i/linear_point_down.png')");
            $(document).mousemove(function (e) {
                xx = e.clientX - disX;
                if (xx < limitL)
                    xx = limitL;
                else if (xx > limitR)
                    xx = limitR;
                el.css({ "left": xx });

                newWidth = dragElRight[0].offsetLeft - dragElLeft[0].offsetLeft;
                resizeEl.css({ "width": newWidth });
            });
            $(document).mouseup(function () {
                var dis = xx - xMin;
                var result = Math.round(dis / perWidth) * perWidth;
                xx = result + xMin;

                if (xx <= limitL)
                    xx += perWidth;

                el.css({ "left": xx });
                newWidth = dragElRight[0].offsetLeft - dragElLeft[0].offsetLeft;
                resizeEl.css({ "width": newWidth });

                upperValue = (xx - xMin) / perWidth;
                $(el).css("background-image", "url('/i/linear_point_up.png')"); //圆球css特效，如有bug宜注释掉
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
            });
        });
    }
    //获取开始和结束的日期
    this.GetDate = function () {
        var date = new Array(2);
        date[0] = dates[lowerValue];
        date[1] = dates[upperValue];
        return date;
    }
    //获取开始和结束的日期，并填充时间
    this.GetDateTime = function () {
        var date = new Array(2);
        date[0] = dates[lowerValue] + " 00:00:00";
        date[1] = dates[upperValue] + " 23:59:59";
        return date;
    }
    //根据dayType的不同返回不同的文字
    this.GetDayTypeText = function () {
        return (dayType == "date") ? "日期" : "月份";
    }
    //从"yyyy-mm-dd hh:mm:ss"格式的日期中去除时间
    this.RemoveTime = function (day) {
        if (day.indexOf(' ') != -1) {//如果不是yyyy-mm-dd格式，将多余内容剔除
            day = day.split(' ')[0];
        }
        return day;
    }
    this.ToDate = function (str) {
        var sd = str.split("-");
        return new Date(sd[0], sd[1], sd[2]);
    }

    this.SetDate = function (start, end) {//重设线性时间
        if (this.ToDate(start) >= this.ToDate(end)) {
            start = dates[lowerLimit];
            end = dates[upperLimit];
        }
        if (this.ToDate(start) < this.ToDate(dates[lowerLimit]))
            start = dates[lowerLimit];
        if (this.ToDate(end) > this.ToDate(dates[upperLimit]))
            end = dates[upperLimit];
        for (var i = 0; i < dates.length; i++) {
            if (this.ToDate(start) - this.ToDate(dates[i]) == 0)
                lowerValue = i;
            if (this.ToDate(end) - this.ToDate(dates[i]) == 0)
                upperValue = i;
        }

        var startX = xMin + lowerValue * perWidth;
        dragElLeft.css({ "left": startX }); //重设左侧圆点的定位

        var endX = xMin + upperValue * perWidth;
        dragElRight.css({ "left": endX }); //重设右侧圆点的定位

        newWidth = endX - startX;
        resizeEl.css({ "left": startX + 8 }); //重设填充条的定位
        resizeEl.css({ "width": newWidth }); //重设填充条宽度
    }
}
