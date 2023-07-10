function Init() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var oldselEvent = null;
    var oldbordercolor = null;
    $("#calendar").fullCalendar({
        height: strHeight,
        width: strWidth,
        year: y,
        month: m,
        date: d,
        theme: false,
        editable: false,
        header: {
            left: 'prevYear,nextYear,prev, today, next ',
            center: 'title',
            right: 'month,agendaWeek,agendaDay' //right: 'month,agendaWeek,agendaDay,basicWeek,basicDay'     
        },
        defaultView: "month", //默认的显示图为按月显示
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        today: ["今天"],
        firstDay: 0, //一周的第一天是哪天，0是日，1是周一
        buttonText: {
            today: '本月',
            agendaWeek: '周',
            agendaDay: '日',
            month: '月',
            prev: '上一月',
            next: '下一月',
            prevYear: '上一年',
            nextYear: '下一年'
        },
        weekMode: 'liquid',
        //只对anenda起作用的属性
        allDayDefault: false,
        allDaySlot: false, //对于详细的周日视图最上面显示一行
        allDayText: '今日任务',
        axisFormat: 'H(:mm)tt',        
        editable: false,
        titleFormat: {
            month: 'yyyy年 MMMM',
            week: "MMMM d日{'—'[yyyy年][MMMM]d日}",
            day: 'yyyy-MM-d ddd'
        }, //格式化Title
        timeFormat: {
            month: 'HH:mm',
            week: "d日 H(:mm){'—'d日 H(:mm)}",
            day: "d日 H(:mm){'—'d日 H(:mm)}"
        },
        viewDisplay: function (view) {//切换视图的时候要做的操作                
            if (view.name == "month") {
                jQuery('.fc-button-prev').children().children(".fc-button-content").text("上一月");
                jQuery('.fc-button-next').children().children(".fc-button-content").text("下一月");
                jQuery('.fc-button-today').children().children(".fc-button-content").text("本月");

            }
            else if (view.name == "agendaWeek") {
                jQuery('.fc-button-prev').children().children(".fc-button-content").text("上周");
                jQuery('.fc-button-next').children().children(".fc-button-content").text("下周");
                jQuery('.fc-button-today').children().children(".fc-button-content").text("本周");
            }
            else if (view.name == "agendaDay") {
                jQuery('.fc-button-prev').children().children(".fc-button-content").text("昨天");
                jQuery('.fc-button-next').children().children(".fc-button-content").text("明天");
                jQuery('.fc-button-today').children().children(".fc-button-content").text("今天");
            }
        },
        eventRender: function (event, element) {
            element.bind('dblclick', function () {
                eval(funeventclick);
            });
        },
        dayRender: function (date, element, view) {
            if (date.isBefore(Date.today())) {
                $(element).css("background", "beige");
            }
        },
        eventClick: function (event) {
            if (oldselEvent != null) {
                oldselEvent.css('border-color', oldbordercolor);
            }
            oldselEvent = $(this);
            oldbordercolor = oldselEvent.css("border-color");
            $(this).css('border-color', 'red');

        },
        dayClick: function (date, allDay, jsEvent, view) {//单击某天的事件
            // eval(fundayclick);
        },
        eventMouseover: function (event) {
            $(this).css('background-color', 'red');
        },
        eventMouseout: function (event) {
            $("#eventInfo").hide();
            $(this).css('background-color', 'white');
        },
        editable: false, //事件是否可以移动
        events: function (start, end, callback) {
            var strConditions = [];
            strConditions.push(formatDate(start));
            strConditions.push(formatDate(end));
            var aaa = UserControl_CalendarControl.GetDataInfo(calId, strConditions);
            aaa = aaa.value.replace(/\r\n/g, "\\n");
            bbb = eval(aaa);
            callback(bbb);
        } //表示初始化时的数据，等前面的ajax请求返回后就会有新的数据在页面显示 
    });
}
function formatDate(v) {
    if (v instanceof Date) {
        var y = v.getFullYear();
        var m = v.getMonth() + 1;
        var d = v.getDate();
        var h = v.getHours();
        var i = v.getMinutes();
        var s = v.getSeconds();
        return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
    }
}