function PollingRoutine(options) {
    //私有属性
    var defaults = {//默认值，显示延迟和执行间隔
        delay: 0,
        interval: 5,
        dbName: ""
    };
    var options = $.extend(defaults, options);
    this.interval = 0;//循环计时器
    var times = 0;
    var thisP = this;
    //私有方法
    startTimer = function () {
        thisP.interval = window.setInterval(deal, defaults.interval * 1000);
    }
    var stopTimer = function () {
        window.clearInterval(thisP.interval);
    }
    //startTimer = function () {//已测，存在多个时还是会冲突
    //    thisP.interval = window.setTimeout(function () { deal(); startTimer(); }, defaults.interval * 1000);
    //}
    //var stopTimer = function () {
    //    window.clearTimeout(thisP.interval);
    //}
    deal = function () {
        if (check()) {
            times++;
            var sql = "";
            try {
                sql = thisP.GetSql();
            } catch (e) {
                alert("GetSql()方法存在错误。")
            }
            var result = UserControl_PollingRoutine.ExcuteSql(defaults.dbName, sql).value;
            if (result != "" && result != null) {
                stopTimer();
                try {
                    thisP.Result(result);
                } catch (e) {
                    alert("Result()方法存在错误。")
                }
                startTimer();
            }
        }
    }
    check = function () {//检测是否满足循环执行的条件
        var b = false;
        try {
            b = thisP.Check();
        } catch (e) {
            alert("Check()方法存在错误。")
        }
        return b;
    }
    // 公共方法
    this.Excute = function () {
        setTimeout(startTimer, defaults.delay * 1000);
    }
    this.Stop = function () {
        stopTimer();
    }
    this.GetTimes = function () {
        return times;
    }
};
