function OptionalCondition() {
    var thisCtrl = this; //当前对象，供内部方法调用
    var element; //控件ID
    var button;
    var div;
    var mask;
    var sql;
    var jsoncode; //从配置读入的全部json代码
    var menucode; //左侧菜单的html代码
    var conditions = new Array(); //Condition数组，对应着左侧菜单每一个子菜单
    var condition; //当前条件
    var currentConditionType = "null"; //当前条件的类型
    var firstconn = "<span>——</span>"; //首个连接字
    var blank = "<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>"; //空格占位
    var finalsql = "尚未配置条件。";
    this.SetBase = function (el) {//设置对应元素，button为按钮，div为弹出窗口，mask为遮罩层
        element = el;
        button = el + "btn";
        div = el + "div";
        mask = el + "mask";
        sql = el + "sql";
    }
    this.Init = function () {//初始化
        $('#' + button).click(function () {//弹出浮动层
            return thisCtrl.OpenSql();
        })
        $("#" + div + " .add").click(function () {//添加事件
            return thisCtrl.AddSql();
        });
        $("#" + div + " .delete").click(function () {//删除事件
            return thisCtrl.DeleteSql();
        })
        $("#" + div + " .swapup").click(function () {//上移事件
            return thisCtrl.SwapSql(-1);
        })
        $("#" + div + " .swapdown").click(function () {//下移事件
            return thisCtrl.SwapSql(1);
        })
        $("#" + div + " .mergeup").click(function () {//向上合并事件
            return thisCtrl.MergeSql(-1);
        })
        $("#" + div + " .mergedown").click(function () {//向下合并事件
            return thisCtrl.MergeSql(1);
        })
        $("#" + div + " .split").click(function () {//拆分事件
            return thisCtrl.SplitSql($("#" + sql + " .conditiondesc[selected]"));
        })
        $("#" + div + " .clear").click(function () {//清空事件
            return thisCtrl.ClearSql();
        })
        $("#" + div + " .search").click(function () {//确定事件
            return thisCtrl.SearchSql();
        })
        $("#" + div + " .close").click(function () {//关闭事件
            return thisCtrl.CloseSql();
        });
        this.SetMenuShow(); //设置左侧菜单显示功能
        //出于一些bug，暂时禁止掉拖动功能
        this.SetDrag(); //设置浮动层拖动功能
    }
    this.OpenSql = function () {//弹出浮动层
        var boxWidth = 800; //弹出框宽度
        var boxHeight = 600; //弹出框高度
        var th = (document.body.clientHeight - boxHeight) / 2; //弹出高度距离
        var rw = (document.body.clientWidth - boxWidth) / 2; //弹出宽度距离
        var h = document.body.clientHeight;
        if ($("#" + button).parent().attr("tagName") == "DIV" && $("#" + button).parent().css("position") == "absolute")//如果父元素是使用绝对定位的div，那么认为是在网格模式
            $("body").append($("#" + div));
        $("#" + div).animate({//浮动层动画效果
            top: th,
            opacity: 'show',
            width: boxWidth,
            height: boxHeight,
            right: rw
        }, 500);
        $("body").prepend("<div id='#'" + mask + " class='mask'></div>"); //加入遮罩层
        $("#" + mask).css({
            opacity: "0.5"
        }).css("height", h);
        return false;
    }
    this.AddSql = function () {//添加Sql
        if (currentConditionType != "null") {
            var value = "";
            var output = "";
            var out = true;
            switch (currentConditionType) {//检测当前条件类型
                case "date": //日期
                    var startTime = $("#" + element + "StartDate").val(); //开始时间
                    var endTime = $("#" + element + "EndDate").val(); //结束时间
                    var startDate = startTime.split(' ')[0]; //开始日期
                    var endDate = endTime.split(' ')[0]; //结束日期
                    var compareStart = Date.parse(startDate.replace("-", "/")); //开始日期的比较值
                    var compareEnd = Date.parse(endDate.replace("-", "/")); //结束日期的比较值
                    if (compareStart > compareEnd) {
                        alert("开始日期不能大于结束日期！");
                        out = false;
                    } else {
                        value = condition.code + ">='" + startTime + "' and " + condition.code + "<='" + endTime + "'";
                        output = condition.title + " " + startDate + " 至 " + endDate;
                    }
                    break;
                case "select": //下拉框
                    var val = $("#" + element + "Select").val();
                    var text = $("#" + element + "Select").find("option:selected").text();
                    value = condition.code + "='" + val + "'";
                    output = condition.title + " " + text;
                    break;
                case "value": //值域
                    var formerValue = $("#" + element + "FormerValue").val(); //左值
                    var latterValue = $("#" + element + "LatterValue").val(); //右值
                    if (formerValue == "" || isNaN(formerValue)) {//如果左值为空或者不是数字
                        if (formerValue == "") alert("左值不能为空！");
                        else alert("左值不能为非数字！");
                        $("#" + element + "FormerValue").select();
                        out = false;
                    } else if (latterValue == "" || isNaN(latterValue)) {//如果右值为空或者不是数字
                        if (latterValue == "") alert("右值不能为空！");
                        else alert("右值不能为非数字！");
                        $("#" + element + "LatterValue").select();
                        out = false;
                    }
                    if (out) {//如果确实是两个可操作的数值
                        formerValue = parseFloat(formerValue);
                        latterValue = parseFloat(latterValue);
                        if (formerValue > latterValue) {
                            alert("左值不能大于右值！");
                            out = false;
                        } else {
                            value = condition.code + ">='" + formerValue + "' and " + condition.code + "<='" + latterValue + "'";
                            output = condition.title + " " + formerValue + " " + condition.options + " 至 " + latterValue + " " + condition.options;
                        }
                    }
                    break;
                case "custom": //自定义
                    var options = condition.options.split(',');
                    value = customCondition(options[0], options[1], element, 1);
                    if (value != "") {//只有value不为空时才进行输出
                        output = condition.title + " ";
                        output += customCondition(options[0], options[1], element, 2);
                    } else out = false;
                    break;
                default:
                    break;
            }
            if (out) {//确定进行输出
                var outcode = "<div>";
                if ($("#" + sql).html() == "") {//如果是首次添加条件
                    outcode += firstconn;
                } else {//并非首次添加
                    outcode += "<span style='color:green;cursor:hand;' onclick='OnClickConn(this)' value=' and '>";
                    outcode += "并且";
                    outcode += "</span>";
                }
                outcode += "<span class='conditiondesc' value=\"" + value + "\" onclick='OnSelect(this)'  level='0'>  ";
                outcode += output;
                outcode += "</span></div>";
                $("#" + sql).append(outcode);
            }
        }
        return false;
    };
    this.DeleteSql = function () {//删除Sql
        var selectSql = $("#" + sql + " .conditiondesc[selected]");
        var level = parseFloat(selectSql.attr("level"));
        var nextSql = selectSql.parent().next().children().last(); //下一个邻接的Sql
        var hasNext = true;
        var nextSameLevelSql = selectSql; //下一个同level的Sql
        do {
            var currentSql = nextSameLevelSql.parent().next().children().last();
            var currentLevel = parseFloat(currentSql.attr("level"));
            if (currentLevel == level || currentSql.length == 0) hasNext = false;
            nextSameLevelSql = currentSql;
        } while (hasNext)
        var thisconn = selectSql.prev().html();
        var mark = selectSql.attr("mark");
        var rewrite = false;
        if (selectSql.attr("value") == "complex") {//将要删除的行是复合条件
            if (mark) {//该复合条件同时有mark属性
                if (mark == "start") {//将要删除的行是开始行
                    if (nextSameLevelSql.attr("mark")) {//删除开始行后，已不构成复合条件
                        thisCtrl.SplitSql(selectSql.parent().prev().children().last());
                        level = parseFloat(selectSql.attr("level"));
                        nextSameLevelSql.removeAttr("mark");
                    } else {//删除开始行后，仍构成复合条件
                        nextSameLevelSql.attr("mark", mark);
                        rewrite = true;
                    }
                }
                else {//将要删除的行是结束行
                    var goon = true;
                    var prevSql = selectSql;
                    do {
                        target = prevSql.parent().prev().children().last();
                        targetLevel = parseFloat(target.attr("level"));
                        if ((targetLevel == level) || (target.length == 0)) {
                            goon = false;
                        }
                        prevSql = target;
                    } while (goon);
                    if (prevSql.attr("mark")) {//删除结束行后，已不构成复合条件
                        thisCtrl.SplitSql(prevSql.parent().prev().children().last());
                        level = parseFloat(selectSql.attr("level"));
                        prevSql.removeAttr("mark");
                    } else {//删除结束行后，仍构成复合条件
                        prevSql.attr("mark", mark);
                        rewrite = true;
                    }
                }
            } else
                rewrite = true;
            var goon = true;
            do {
                var nextSelectSql = selectSql.parent().next().children().last();
                var nextLevel = parseFloat(nextSelectSql.attr("level"));
                selectSql.parent().remove();
                if (nextLevel == level || nextSelectSql.length == 0) goon = false;
                else selectSql = nextSelectSql;
            } while (goon)
        } else if (mark) {//将要删除的行是有mark属性的单条件
            if (mark == "start") {//将要删除的行是开始行
                if (nextSql.attr("mark")) {//删除开始行后，已不构成复合条件
                    thisCtrl.SplitSql(selectSql.parent().prev().children().last());
                    nextSql.removeAttr("mark");
                } else {//删除开始行后，仍构成复合条件
                    nextSql.attr("mark", mark);
                    rewrite = true;
                }
            }
            else {//将要删除的行是结束行
                var goon = true;
                var prevSql = selectSql;
                do {
                    target = prevSql.parent().prev().children().last();
                    targetLevel = parseFloat(target.attr("level"));
                    if ((targetLevel == level) || (target.length == 0)) goon = false;
                    prevSql = target;
                } while (goon);
                if (prevSql.attr("mark")) {//删除结束行后，已不构成复合条件
                    thisCtrl.SplitSql(prevSql.parent().prev().children().last());
                    prevSql.removeAttr("mark");
                } else {//删除结束行后，仍构成复合条件
                    prevSql.attr("mark", mark);
                    rewrite = true;
                }
            }
            selectSql.parent().remove(); //删除该行
        }
        else {//将要删除的行是普通的单条件
            selectSql.parent().remove(); //删除该行
            rewrite = true;
        }
        thisCtrl.Reset("");
        if ((thisconn == "——") && rewrite) {//如果被删除的是首行，且没有影响到复合条件，那么将下一行的连接字符重写为“——”
            nextSameLevelSql.prev().remove()
            nextSameLevelSql.before(firstconn);
        }
        return false;
    }
    this.SwapSql = function (target) {//交换Sql，target代表交换的目标，-1为向上交换，1为向下交换
        var level = parseFloat($("#" + sql + " .conditiondesc[selected]").attr("level"));
        var thisSql = $("#" + sql + " .conditiondesc[selected]");
        var thisValue = thisSql.attr("value");
        var targetSql = thisSql;
        var targetLevel;
        do {
            if (target < 0) {
                targetSql = targetSql.parent().prev().children().last();
            } else {
                targetSql = targetSql.parent().next().children().last();
            }
            targetLevel = parseFloat(targetSql.attr("level"));
        } while (targetLevel != level)
        targetValue = targetSql.attr("value");
        if ((targetValue != "complex") && (thisValue != "complex")) {//两个单条件进行交换
            thisCtrl.SwapValueAndHtml(targetSql, thisSql);
            this.Reset(targetSql);
        } else if ((targetValue == "complex") && (thisValue == "complex")) {//两个复合条件进行交换
            var thisConn = thisSql.prev().clone();
            var targetConn = targetSql.prev().clone();
            thisSql.prev().remove();
            thisSql.before(targetConn);
            targetSql.prev().remove();
            targetSql.before(thisConn);
            if (target < 0) {//向上交换
                var thisSqlAll = "";
                var goon = true;
                do {
                    thisSqlAll += thisSql.parent()[0].outerHTML;
                    var nextThisSql = thisSql.parent().next().children().last();
                    var thisLevel = parseFloat(nextThisSql.attr("level"));
                    thisSql.parent().remove();
                    if (thisLevel == level || nextThisSql.length == 0) goon = false;
                    else thisSql = nextThisSql;
                } while (goon)
                targetSql.parent().before(thisSqlAll);
                this.Reset("");
            } else {//向下交换
                var targetSqlAll = "";
                var goon = true;
                do {
                    targetSqlAll += targetSql.parent()[0].outerHTML;
                    var nexttargetSql = targetSql.parent().next().children().last();
                    var targetLevel = parseFloat(nexttargetSql.attr("level"));
                    targetSql.parent().remove();
                    if (targetLevel == level || nexttargetSql.length == 0) goon = false;
                    else targetSql = nexttargetSql;
                } while (goon)
                thisSql.parent().before(targetSqlAll);
                this.Reset("");
            }
        } else {//一个单条件和一个复合条件进行交换
            targetMark = targetSql.attr("mark") ? targetSql.attr("mark") : "";
            thisMark = thisSql.attr("mark") ? thisSql.attr("mark") : "";
            targetSql.attr("mark", thisMark);
            thisSql.attr("mark", targetMark);
            if (targetSql.attr("mark") == "")
                targetSql.removeAttr("mark");
            if (thisSql.attr("mark") == "")
                thisSql.removeAttr("mark");
            targetConn = targetSql.prev().clone();
            thisConn = thisSql.prev().clone();
            targetSql.prev().remove();
            targetSql.before(thisConn);
            thisSql.prev().remove();
            thisSql.before(targetConn);
            if ((targetValue == "complex") && (target < 0)) {//单条件上移
                targetSql.parent().before(thisSql.parent());
                this.Reset(thisSql);
            } else if ((thisValue == "complex") && (target > 0)) {//复合条件下移
                thisSql.parent().before(targetSql.parent());
                this.Reset(thisSql);
            } else if ((targetValue == "complex") && (target > 0)) {//单条件下移
                var goon = true;
                do {
                    nextTargetSql = targetSql.parent().next().children().last();
                    targetLevel = parseFloat(nextTargetSql.attr("level"));
                    if (targetLevel <= level || nextTargetSql.length == 0) goon = false;
                    else targetSql = nextTargetSql;
                } while (goon)
                targetSql.parent().after(thisSql.parent());
                this.Reset(thisSql);
            } else {//复合条件上移
                var goon = true;
                markThis = thisSql;
                do {
                    nextThisSql = thisSql.parent().next().children().last();
                    thisLevel = parseFloat(nextThisSql.attr("level"));
                    if (thisLevel <= level || nextThisSql.length == 0) goon = false;
                    else thisSql = nextThisSql;
                } while (goon)
                thisSql.parent().after(targetSql.parent());
                this.Reset(markThis);
            }
        }
        return false;
    };
    this.MergeSql = function (target) {//合并Sql，target代表合并的目标，-1为向上合并，1为向下合并
        var selectSql = $("#" + sql + " .conditiondesc[selected]"); //选中项的
        var over = false; //是否合并结束
        if (target == -1) {//向上合并
            var downSql = selectSql;
            var upSql = downSql;
            var level = parseFloat(downSql.attr("level"));
            var goon = true;
            do {
                var prevSql = upSql.parent().prev().children().last();
                var prevLevel = parseFloat(prevSql.attr("level"));
                if (prevLevel == level || prevSql.length == 0) goon = false;
                upSql = prevSql;
            } while (goon)
            if (upSql.attr("value") == "complex" && downSql.attr("value") == "complex") {//两个复合条件进行合并
                if (upSql.attr("mark") && downSql.attr("mark")) thisCtrl.SplitSql(upSql.parent().prev().children().last());
                else if (downSql.attr("mark")) upSql.attr("mark", downSql.attr("mark"));
                var downStart = downSql.parent().next().children().last();
                var upEnd = downSql;
                level = parseFloat(downStart.attr("level"));
                do {
                    prevSql = upEnd.parent().prev().children().last();
                    prevLevel = parseFloat(prevSql.attr("level"));
                    if (prevLevel == level || prevSql.length == 0) goon = false;
                    upEnd = prevSql;
                } while (goon)
                upEnd.removeAttr("mark");
                downStart.removeAttr("mark");
                thisCtrl.SwapPrevOuterHtml(downSql, downStart);
                downSql.parent().remove();
                over = true;
            }
            else if (upSql.attr("value") == "complex") {//上一个同level条件是复合条件
                if (upSql.attr("mark") && downSql.attr("mark")) thisCtrl.SplitSql(upSql.parent().prev().children().last());
                else if (downSql.attr("mark")) upSql.attr("mark", downSql.attr("mark"));
                level = parseFloat(downSql.attr("level"));
                downSql.parent().prev().children().last().removeAttr("mark");
                downSql.parent().prepend(blank);
                downSql.attr("mark", "end");
                downSql.attr("level", level + 1);
                over = true;
            } else if (downSql.attr("value") == "complex") {//下一个同level条件是复合条件
                if (upSql.attr("mark") && downSql.attr("mark")) thisCtrl.SplitSql(upSql.parent().prev().children().last());
                else if (upSql.attr("mark")) downSql.attr("mark", upSql.attr("mark"));
                level = parseFloat(upSql.attr("level"));
                thisCtrl.SwapPrevOuterHtml(upSql, downSql); //对upSql和downSql的prev()元素进行交换
                downSql = downSql.parent().next().children().last();
                thisCtrl.SwapPrevOuterHtml(upSql, downSql); //对upSql和downSql的prev()元素进行交换
                downSql.removeAttr("mark");
                upSql.parent().prepend(blank);
                upSql.attr("mark", "start");
                upSql.attr("level", level + 1);
                downSql.parent().before(upSql.parent());
                over = true;
            }
        } else if (target == 1) {//如果向下合并
            var upSql = selectSql;
            var downSql = upSql;
            var level = parseFloat(upSql.attr("level"));
            var goon = true;
            do {
                var nextSql = downSql.parent().next().children().last();
                var nextLevel = parseFloat(nextSql.attr("level"));
                if (nextLevel == level || nextSql.length == 0) goon = false;
                downSql = nextSql;
            } while (goon)
            if (upSql.attr("value") == "complex" && downSql.attr("value") == "complex") {
                //两个复合条件进行合并
                if (upSql.attr("mark") && downSql.attr("mark")) thisCtrl.SplitSql(upSql.parent().prev().children().last());
                else if (downSql.attr("mark")) upSql.attr("mark", downSql.attr("mark"));
                var downStart = downSql.parent().next().children().last();
                var upEnd = downSql;
                level = parseFloat(downStart.attr("level"));
                do {
                    prevSql = upEnd.parent().prev().children().last();
                    prevLevel = parseFloat(prevSql.attr("level"));
                    if (prevLevel == level || prevSql.length == 0) goon = false;
                    upEnd = prevSql;
                } while (goon)
                upEnd.removeAttr("mark");
                downStart.removeAttr("mark");
                thisCtrl.SwapPrevOuterHtml(downSql, downStart);
                downSql.parent().remove();
                over = true;
            }
            else if (downSql.attr("value") == "complex") {//如果下方是复合条件
                if (upSql.attr("mark") && downSql.attr("mark")) thisCtrl.SplitSql(upSql.parent().prev().children().last());
                else if (upSql.attr("mark")) downSql.attr("mark", upSql.attr("mark"));
                level = parseFloat(upSql.attr("level"));
                thisCtrl.SwapPrevOuterHtml(upSql, downSql); //对upSql和downSql的prev()元素进行交换
                downSql = downSql.parent().next().children().last();
                thisCtrl.SwapPrevOuterHtml(upSql, downSql); //对upSql和downSql的prev()元素进行交换
                downSql.removeAttr("mark");
                upSql.parent().prepend(blank);
                upSql.attr("mark", "start");
                upSql.attr("level", level + 1);
                downSql.parent().before(upSql.parent());
                over = true;
            }
            else if (upSql.attr("value") == "complex") {
                if (upSql.attr("mark") && downSql.attr("mark")) thisCtrl.SplitSql(upSql.parent().prev().children().last());
                else if (downSql.attr("mark")) upSql.attr("mark", downSql.attr("mark"));
                level = parseFloat(downSql.attr("level"));
                downSql.parent().prev().children().last().removeAttr("mark");
                downSql.parent().prepend(blank);
                downSql.attr("mark", "end");
                downSql.attr("level", level + 1);
                over = true;
            }
        }
        if (!over) {//如果合并没有结束
            if (upSql.attr("mark") && downSql.attr("mark")) thisCtrl.SplitSql(upSql.parent().prev().children().last());
            var level = parseFloat(downSql.attr("level"));
            var mark = "";
            if (upSql.attr("mark")) mark = "start";
            else if (downSql.attr("mark")) mark = "end";
            upSql.attr("mark", "start");
            upSql.attr("level", level + 1);
            downSql.attr("mark", "end")
            downSql.attr("level", level + 1);
            var blanks = downSql.parent().children().length - 1; //应该填充的占位符数量
            var upOuterHtml = upSql[0].outerHTML;
            var complexSql = "";
            complexSql += "<div>";
            for (var i = 0; i < blanks; i++) complexSql += blank;
            complexSql += firstconn;
            complexSql += upOuterHtml;
            complexSql += "</div>";
            downSql.parent().before(complexSql);
            downSql.parent().prepend(blank);
            upSql.html(" 复合条件");
            upSql.attr("value", "complex");
            upSql.removeAttr("mark");
            upSql.attr("level", level);
            if (mark != "") upSql.attr("mark", mark);
        }
        this.Reset(""); //重置
        return false;
    };
    this.SplitSql = function (selected) {//拆分Sql语句
        var level = parseFloat(selected.attr("level"));
        var current = selected.parent().next();
        var conn = selected.parent().children().last().prev();
        current.children().last().prev().remove();
        current.children().last().before(conn);
        current.prev().remove();
        var mark = "";
        if (selected.attr("mark")) mark = selected.attr("mark");
        do {
            target = current.children().last();
            targetLevel = parseFloat(target.attr("level"));
            target.attr("level", targetLevel - 1);
            if (target.attr("mark") && (targetLevel == (level + 1))) {
                var tarMark = target.attr("mark");
                if (mark != tarMark) target.removeAttr("mark");
            }
            target.prev().prev().remove();
            current = current.next();
            nextLevel = current.children().last().attr("level");
        } while (nextLevel > level)
        this.Reset(""); //重置
        return false;
    };
    this.ClearSql = function () {//清空全部条件
        if (confirm("确认要清空所有条件？")) {
            $("#" + sql).empty();
            finalsql = "尚未配置条件。";
        }
        return false;
    };
    this.SearchSql = function () {//提交当前Sql语句
        finalsql = "";
        var end = 0;
        $("#" + sql + " [value]").each(function (i) {
            if ($(this).attr("class") == "conditiondesc") {//如果是sql语句，则为其加上括号
                if ($(this).attr("mark") == "start") finalsql += " ( ";
                if ($(this).attr("value") != "complex") {
                    finalsql += " ( ";
                    finalsql += $(this).attr("value");
                    finalsql += " ) ";
                    if ($(this).attr("mark") == "end") finalsql += " ) ";
                } else if ($(this).attr("mark") == "end") end++;
                levelThis = parseFloat($(this).attr("level"));
                levelNext = parseFloat($(this).parent().next().children().last().attr("level"));
                if (i == ($("#" + sql + " [value]").length - 1) || (levelThis > levelNext)) {//当sql语句已终结，或者下一行的语句的level等级低于本行，则将积攒的右括号进行输出
                    for (var j = 0; j < end; j++) finalsql += " ) ";
                    end = 0;
                }
            } else finalsql += $(this).attr("value");
        });
        return thisCtrl.CloseSql();
    };
    this.CloseSql = function () {//关闭浮动层
        $("#" + div).animate({
            top: 0,
            opacity: 'hide',
            width: 0,
            height: 0,
            right: 0
        }, 500);
        $("#" + mask).fadeOut("fast");
        if (finalsql == "") finalsql = "尚未配置条件。";
        return false;
    };
    this.SwapValueAndHtml = function (a, b) {//a代表第一个dom元素，b代表第二个dom元素
        //对a元素和b元素的value和html进行交换
        var aHtml = a.html();
        var aValue = a.attr("value");
        var bHtml = b.html();
        var bValue = b.attr("value");
        a.html(bHtml);
        a.attr("value", bValue);
        b.html(aHtml);
        b.attr("value", aValue);
    };
    this.SwapPrevOuterHtml = function (a, b) {//a代表第一个dom元素，b代表第二个dom元素
        //对a元素和b元素的prev()的全部Html进行交换
        var aOuterHtml = $(a.prev()[0].outerHTML);
        var bOuterHtml = $(b.prev()[0].outerHTML);
        a.prev().remove();
        a.before(bOuterHtml);
        b.prev().remove();
        b.before(aOuterHtml);
    };
    this.SetMenuShow = function () {//设置左侧菜单显示功能
        $('#' + div + ' .optionlist ul li ul').hide();
        $('#' + div + ' .optionlist ul li a').click(function () {
            $(this).next().toggle();
        });
    };
    this.SetDrag = function () {//设置浮动层拖动
        $("#" + div + ' .optiondrag').mousedown(function (e) {//鼠标按下
            var disX = e.clientX - $("#" + div)[0].offsetLeft;
            var disY = e.clientY - $("#" + div)[0].offsetTop;
            $(document).mousemove(function (e) {//鼠标移动
                xx = e.clientX - disX;
                yy = e.clientY - disY;
                width = parseInt(document.body.scrollWidth);
                height = parseInt(document.body.scrollHeight);
                var divRight = width - xx - 800; //div距右侧距离
                if (divRight <= 18)
                    divRight = 18;
                else if (divRight >= (width - 800))
                    divRight = width - 800;
                var divTop = yy; //div距上端距离
                if (divTop <= 8)
                    divTop = 8;
                else if (divTop >= (height - 607))
                    divTop = height - 607;
                $("#" + div).css({ "right": divRight, "top": divTop });
            });
            $(document).mouseup(function () {//鼠标抬起
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
            });
        })
    };
    this.ChangeCondition = function (type) {//改变条件
        condition = conditions[parseFloat(type)];
        var output = "";
        switch (condition.type) {
            case "date": //日期
                var startTime = thisCtrl.GetDateTime("00:00:00");
                var endTime = thisCtrl.GetDateTime("23:59:59");
                output += condition.title;
                output += show_input_datetime(element + "StartDate", startTime, '1', '111000');
                output += "至";
                output += show_input_datetime(element + "EndDate", endTime, '1', '111000');
                break;
            case "select": //下拉框
                var option;
                var isSql = (condition.options.split(':').length == 2) ? true : false;
                if (isSql) {
                    var sql = condition.options.split(':')[1];
                    option = UserControl_OptionalConditionSearch.GetOptions(sql.split(';')[0], sql.split(';')[1]).value.split(';');
                } else option = condition.options.split(';');
                output += condition.title;
                output += "<select id='" + element + "Select'>";
                for (var i = 0; i < option.length; i++) {
                    output += "<option value='" + option[i].split(',')[1] + "'>";
                    output += option[i].split(',')[0];
                    output += "</option>"
                }
                output += "</select>";
                break;
            case "value": //值域
                output += condition.title;
                output += "<input id='" + element + "FormerValue' type='text' style='width:100px' />" + condition.options;
                output += " - ";
                output += "<input id='" + element + "LatterValue' type='text' style='width:100px' />" + condition.options;
                break;
            case "custom": //自定义
                output += condition.title;
                var options = condition.options.split(',');
                output += customCondition(options[0], options[1], element, 0);
                break;
            default:
                alert("该类型不被支持！请检查JSON文件中submenu中的type属性。");
                break;
        }
        currentConditionType = condition.type; //设置当前条件类型
        $("#" + div + " .mainwindow .currentcondition .conditon").empty();
        $("#" + div + " .mainwindow .currentcondition .conditon").append(output);
    };
    this.DealCode = function () {//处理Code，生成menucode
        var count = 0;
        menucode = "";
        menucode += "<ul>";
        for (var i = 0; i < jsoncode.menu.length; i++) {
            menucode += "<li>";
            menucode += "<a href='#'>" + jsoncode.menu[i].title + "</a>";
            menucode += "<ul>";
            for (var j = 0; j < jsoncode.menu[i].submenu.length; j++) {
                menucode += "<li>";
                menucode += "<a href='#' onclick=OnChange('" + count + "')>" + jsoncode.menu[i].submenu[j].title + "</a>";
                menucode += "</li>";
                count++;
                this.SetCondition(jsoncode.menu[i].submenu[j]);
            }
            menucode += "</ul>";
            menucode += "</li>";
        }
        menucode += "</ul>";
    };
    this.ChangeConnText = function (conn) {//改变条件连接字及其值
        var text = $(conn).text();
        var value = $(conn).attr("value");
        switch (text) {
            case "并且":
                value = " or ";
                text = "或者";
                break;
            case "或者":
                value = " and not ";
                text = "且不";
                break;
            case "且不":
                value = " and ";
                text = "并且";
                break;
            default:
                break;
        }
        $(conn).attr("value", value); //重新为value赋值
        $(conn).text(text); //重新为text赋值
    };
    this.ChangeSelectDesc = function (desc) {//sql描述选中状态改变
        this.Reset(desc); //重置
    };
    this.Reset = function (desc) {//重置，包括Button状态、选中文字
        $("#" + div + " .swapup").attr("disabled", "disabled"); //【上移】禁用
        $("#" + div + " .swapdown").attr("disabled", "disabled"); //【下移】禁用
        $("#" + div + " .mergeup").attr("disabled", "disabled"); //【向上合并】禁用
        $("#" + div + " .mergedown").attr("disabled", "disabled"); //【向下合并】禁用
        $("#" + div + " .delete").attr("disabled", "disabled"); //【删除】禁用
        $("#" + div + " .split").attr("disabled", "disabled"); //【拆分】禁用
        $("#" + sql + " .conditiondesc").each(function (i) {//遍历全部sql描述
            $(this).css({ color: "black" }); //重置sql描述文字颜色
            $(this).removeAttr("selected"); //重置selected属性
        });
        if (desc != "") {//当desc不为空时
            $("#" + div + " .delete").removeAttr("disabled"); //解除【删除】按钮的disabled状态
            $(desc).css({ color: "red" }); //设置选中的描述文字颜色为红色
            $(desc).attr("selected", "selected"); //为其分配selected属性
            var hasPrev = false;
            if ($(desc).parent().prev().children().last().attr("level")) hasPrev = true;
            if (hasPrev && $(desc).attr("mark") != "start") {//不是第一个、且不是复合条件的开始，上移、向上合并可用
                $("#" + div + " .swapup").removeAttr("disabled");
                $("#" + div + " .mergeup").removeAttr("disabled");
            }
            var current = $(desc);
            var goon = true;
            var hasNext = false;
            var level = parseFloat(current.attr("level"));
            do {
                target = current.parent().next().children().last();
                targetLevel = parseFloat(target.attr("level"));
                if ((targetLevel == level) || (target.length == 0)) {
                    goon = false;
                    if (targetLevel == level) hasNext = true;
                }
                current = target;
            } while (goon);
            if (hasNext && $(desc).attr("mark") != "end") {//不是最后一个、且不是复合条件的结束，下移、向下合并可用
                $("#" + div + " .swapdown").removeAttr("disabled");
                $("#" + div + " .mergedown").removeAttr("disabled");
            }
            if ($(desc).attr("value") == "complex") {//如果是复合条件
                $("#" + div + " .split").removeAttr("disabled");
            }
        }
    };
    this.SetCondition = function (submenu) {//设置Condition
        var item = new Object();
        item.title = submenu.title;
        item.code = submenu.code;
        item.type = submenu.type;
        item.options = submenu.options;
        conditions.push(item);
    };
    this.SetMenu = function (code) {//设置菜单的html
        $("#" + div + " .optionlist p").append(code); //附加代码
    };
    this.SetJsonCode = function (code) {//设置JsonCode
        jsoncode = eval("(" + code + ")");
    };
    this.GetMenuCode = function () {//返回menucode
        this.DealCode();
        return menucode;
    };
    this.GetDateTime = function (time) {//返回 yyyy-mm-dd hh:mm:ss格式的数据
        var now = new Date();
        y = now.getFullYear();
        m = now.getMonth() + 1;
        d = now.getDate();
        m = (m < 10) ? ("0" + m) : m;
        d = (d < 10) ? ("0" + d) : d;
        return y + "-" + m + "-" + d + " " + time;
    };
    this.GetSql = function () {//接口，返回SQL语句
        return finalsql;
    };
}