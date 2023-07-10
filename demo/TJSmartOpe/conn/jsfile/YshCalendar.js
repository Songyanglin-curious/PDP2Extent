/* SOURCE FILE: CalendarPopup.js */
// CONSTRUCTOR for the PopupWindow object// 
function PopupWindow() {
    if (!window.popupWindowIndex) { window.popupWindowIndex = 0; }
    if (!window.popupWindowObjects) { window.popupWindowObjects = new Array(); }
    if (!window.listenerAttached) {
        window.listenerAttached = true;
        PopupWindow_attachListener();
    }
    this.index = popupWindowIndex++;
    popupWindowObjects[this.index] = this;
    this.contents = "";
    // Method mappings
    this.populate = PopupWindow_populate;
    this.refresh = PopupWindow_refresh;
}
// Fill the window with contents
function PopupWindow_populate(contents) {
    this.contents = contents;
    this.refresh();
}
// Refresh the displayed contents of the popup
function PopupWindow_refresh() { document.getElementById(this.divID).innerHTML = this.contents; }
// Run this immediately to attach the event listener
function PopupWindow_attachListener() {
    if (document.layers) {
        document.captureEvents(Event.MOUSEUP);
    }
    window.popupWindowOldEventListener = document.onmouseup;
    if (window.popupWindowOldEventListener != null) {
        document.onmouseup = new Function("window.popupWindowOldEventListener();");
    }
}
// Quick fix for FF3
function CP_stop(e) { if (e && e.stopPropagation) { e.stopPropagation(); } }

// CONSTRUCTOR for the CalendarPopup Object
function CalendarPopup() {
    var c;
    if (arguments.length > 0) {
        c = new PopupWindow(arguments[0]);
        c.id = arguments[0];
        c.divID = arguments[0] + "calDiv"; // string
        c.inputID = arguments[0] + "calInput";
        c.dayListID = arguments[0] + "dayList";
    }
    // Calendar-specific properties  
    c.monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    c.monthAbbreviations = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"); //可设置month的缩写，暂不用
    c.dayHeaders = new Array("S", "M", "T", "W", "T", "F", "S");
    c.weekStartDay = 0;
    c.selectionMode = "SingleDate";
    c.isShowYearNavigation = false;
    c.isShowNavigationDropdowns = false;
    c.yearSelectStartOffset = 20;
    c.todayText = "今天";
    c.cssPrefix = "";
    c.dateFormat = "MM/dd/yyyy";
    c.returnFunction = "CP_tmpReturnFunction";
    c.currentDate = null;
    c.seletedTD = null;
    // Method mappings    
    c.setMonthNames = CP_setMonthNames;
    c.setDayHeaders = CP_setDayHeaders;
    c.setWeekStartDay = CP_setWeekStartDay;
    c.setSelectionMode = CP_setSelectionMode;
    c.setDisplayType = CP_setDisplayType; //??       
    c.showYearNavigation = CP_showYearNavigation;
    c.showNavigationDropdowns = CP_showNavigationDropdowns;
    c.setYearSelectStartOffset = CP_setYearSelectStartOffset;
    c.setTodayText = CP_setTodayText;
    c.setDateFormat = CP_setDateFormat;
    c.setReturnFunction = CP_setReturnFunction; //用户可自己定义返回函数，将函数名传给该方法即可。暂不用

    c.initial = CP_initial;
    c.showCalendar = CP_showCalendar;
    c.refreshCalendar = CP_refreshCalendar;
    c.getCalendar = CP_getCalendar;
    c.getStyles = getCalendarStyles;
    // Return the object
    return c;
}
// Over-ride the built-in month names
function CP_setMonthNames() { for (var i = 0; i < arguments.length; i++) { this.monthNames[i] = arguments[i]; } }
// Over-ride the built-in column headers for each day
function CP_setDayHeaders() { for (var i = 0; i < arguments.length; i++) { this.dayHeaders[i] = arguments[i]; } }
// Set the day of the week (0-7) that the calendar display starts on
function CP_setWeekStartDay(day) { this.weekStartDay = day; }
//set selection mode
function CP_setSelectionMode(name) { this.selectionMode = name; }
//set display type
function CP_setDisplayType(name) {
    switch (name) {
        case 1: this.showYearNavigation(); break
        case 2: this.showNavigationDropdowns(); break
        default: return;
    }
}
// Show next/last year navigation links
function CP_showYearNavigation() { this.isShowYearNavigation = (arguments.length > 0) ? arguments[0] : true; }
// Show the navigation as an dropdowns that can be manually changed
function CP_showNavigationDropdowns() { this.isShowNavigationDropdowns = (arguments.length > 0) ? arguments[0] : true; }
// How many years back to start by default for year display
function CP_setYearSelectStartOffset(num) { this.yearSelectStartOffset = num; }
// Set the text to use for the "Today" link
function CP_setTodayText(text) { this.todayText = text; }
//set date format
function CP_setDateFormat(name) { this.dateFormat = name; }
// Set the name of the functions to call to get the clicked item
function CP_setReturnFunction(name) { this.returnFunction = name; }
// Temporary default functions to be called when items clicked, so no error is thrown
function CP_tmpReturnFunction(c, y, m, d) {
    var id = c.id + "calInput";
    var targetInput = document.getElementById(id);
    var dt = new Date(y, m - 1, d, 0, 0, 0);
    targetInput.value = formatDate(dt, c.dateFormat);
}

// Simple method to interface popup calendar with a text-entry box
function CP_initial() {
    var selectedDate = (arguments.length > 2) ? arguments[2] : null;
    this.currentDate = null;
    var time = 0;
    if (selectedDate != null) {
        time = getDateFromFormat(selectedDate, this.dateformat)
    }
    else if (this.inputID.value != "") {
        time = getDateFromFormat(this.inputID.value, this.dateformat);
    }
    if (selectedDate != null || this.inputID.value != "") {
        if (time == 0) { this.currentDate = null; }
        else { this.currentDate = new Date(time); }
    }
    this.showCalendar();
}
// Refresh the contents of the calendar display
function CP_refreshCalendar(index) {
    var calObject = window.popupWindowObjects[index];
    if (arguments.length > 1) {
        calObject.populate(calObject.getCalendar(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]));
    }
    else {
        calObject.populate(calObject.getCalendar());
    }
    calObject.refresh();
}
// Populate the calendar and display it
function CP_showCalendar() {
    if (arguments.length > 1) {
        if (arguments[1] == null || arguments[1] == "") {
            this.currentDate = new Date();
        }
        else {
            this.currentDate = new Date(parseDate(arguments[1]));
        }
    }
    this.populate(this.getCalendar());
}
// Get style block needed to display the calendar correctly
function getCalendarStyles() {
    var result = "";
    var p = "";
    if (this != null && typeof (this.cssPrefix) != "undefined" && this.cssPrefix != null && this.cssPrefix != "") { p = this.cssPrefix; }
    result += "<STYLE>\n";
    result += "." + p + "cpYearNavigation,." + p + "cpMonthNavigation { background-color:#C0C0C0; text-align:center; vertical-align:center; text-decoration:none; color:#000000; font-weight:bold; }\n";
    result += "." + p + "cpDayColumnHeader, ." + p + "cpYearNavigation,." + p + "cpMonthNavigation,." + p + "cpCurrentMonthDate,." + p + "cpCurrentMonthDateDisabled,." + p + "cpOtherMonthDate,." + p + "cpOtherMonthDateDisabled,." + p + "cpCurrentDate,." + p + "cpCurrentDateDisabled,." + p + "cpTodayText,." + p + "cpTodayTextDisabled,." + p + "cpText { font-family:arial; font-size:8pt; }\n";
    result += "TD." + p + "cpDayColumnHeader { text-align:right; border:solid thin #C0C0C0;border-width:0px 0px 1px 0px; }\n";
    result += "." + p + "cpCurrentMonthDate, ." + p + "cpOtherMonthDate, ." + p + "cpCurrentDate  { text-align:right; text-decoration:none; }\n";
    result += "." + p + "cpCurrentMonthDateDisabled, ." + p + "cpOtherMonthDateDisabled, ." + p + "cpCurrentDateDisabled { color:#D0D0D0; text-align:right; text-decoration:line-through; }\n";
    result += "." + p + "cpCurrentMonthDate, .cpCurrentDate { color:#000000; }\n";
    result += "." + p + "cpOtherMonthDate { color:#808080; }\n";
    result += "TD." + p + "cpCurrentDate { background-color: #00CC33; border-width:1px; border:solid thin #800000; }\n";
    result += "TD." + p + "cpCurrentDateDisabled { border-width:1px; border:solid thin #FFAAAA; }\n";
    result += "TD." + p + "cpTodayText, TD." + p + "cpTodayTextDisabled { border:solid thin #C0C0C0; border-width:1px 0px 0px 0px;}\n";
    result += "A." + p + "cpTodayText, SPAN." + p + "cpTodayTextDisabled { height:20px; }\n";
    result += "A." + p + "cpTodayText { color:black; }\n";
    result += "." + p + "cpTodayTextDisabled { color:#D0D0D0; }\n";
    result += "." + p + "cpBorder { border:solid thin #808080; }\n";
    result += "</STYLE>\n";
    return result;
}
// Return a string containing all the calendar code to be displayed
function CP_getCalendar() {
    var now = new Date();
    var result = "";
    result += '<TABLE CLASS="' + this.cssPrefix + 'cpBorder" WIDTH=160 BORDER=1 BORDERWIDTH=1 CELLSPACING=0 CELLPADDING=1>\n';
    result += '<TR><TD ALIGN=CENTER>\n';
    result += '<CENTER>\n';
    // Code for DATE display (default)  
    {
        if (this.currentDate == null) { this.currentDate = now; }
        if (arguments.length > 0) { var month = arguments[0]; }
        else { var month = this.currentDate.getMonth() + 1; }
        if (arguments.length > 1 && arguments[1] > 0 && arguments[1] - 0 == arguments[1]) { var year = arguments[1]; }
        else { var year = this.currentDate.getFullYear(); }
        var daysinmonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
            daysinmonth[2] = 29;
        }
        var current_month = new Date(year, month - 1, 1);
        var display_year = year;
        var display_month = month;
        var display_date = 1;
        var weekday = current_month.getDay();
        var offset = 0;

        offset = (weekday >= this.weekStartDay) ? weekday - this.weekStartDay : 7 - this.weekStartDay + weekday;
        if (offset > 0) {
            display_month--;
            if (display_month < 1) { display_month = 12; display_year--; }
            display_date = daysinmonth[display_month] - offset + 1;
        }
        var next_month = month + 1;
        var next_month_year = year;
        if (next_month > 12) { next_month = 1; next_month_year++; }
        var last_month = month - 1;
        var last_month_year = year;
        if (last_month < 1) { last_month = 12; last_month_year--; }
        var date_class;
        {
            result += "<TABLE WIDTH=160 BORDER=0 BORDERWIDTH=0 CELLSPACING=0 CELLPADDING=0>";
        }
        result += '<TR>\n';
        var refresh = 'CP_refreshCalendar';
        var refreshLink = 'javascript:' + refresh;
        if (this.isShowNavigationDropdowns) {
            result += '<TD CLASS="' + this.cssPrefix + 'cpMonthNavigation" WIDTH="78" COLSPAN="3"><select CLASS="' + this.cssPrefix + 'cpMonthNavigation" name="cpMonth" onmouseup="CP_stop(event)" onChange="' + refresh + '(' + this.index + ',this.options[this.selectedIndex].value-0,' + (year - 0) + ');">';
            for (var monthCounter = 1; monthCounter <= 12; monthCounter++) {
                var selected = (monthCounter == month) ? 'SELECTED' : '';
                result += '<option value="' + monthCounter + '" ' + selected + '>' + this.monthNames[monthCounter - 1] + '</option>';
            }
            result += '</select></TD>';
            result += '<TD CLASS="' + this.cssPrefix + 'cpMonthNavigation" WIDTH="10">&nbsp;</TD>';

            result += '<TD CLASS="' + this.cssPrefix + 'cpYearNavigation" WIDTH="56" COLSPAN="3"><select CLASS="' + this.cssPrefix + 'cpYearNavigation" name="cpYear" onmouseup="CP_stop(event)" onChange="' + refresh + '(' + this.index + ',' + month + ',this.options[this.selectedIndex].value-0);">';
            for (var yearCounter = year - this.yearSelectStartOffset; yearCounter <= year + this.yearSelectStartOffset; yearCounter++) {
                var selected = (yearCounter == year) ? 'SELECTED' : '';
                result += '<option value="' + yearCounter + '" ' + selected + '>' + yearCounter + '</option>';
            }
            result += '</select></TD>';
        }
        else {
            if (this.isShowYearNavigation) {
                result += '<TD CLASS="' + this.cssPrefix + 'cpMonthNavigation" WIDTH="10"><A CLASS="' + this.cssPrefix + 'cpMonthNavigation" HREF="' + refreshLink + '(' + this.index + ',' + last_month + ',' + last_month_year + ');">&lt;</A></TD>';
                result += '<TD CLASS="' + this.cssPrefix + 'cpMonthNavigation" WIDTH="58"><SPAN CLASS="' + this.cssPrefix + 'cpMonthNavigation">' + this.monthNames[month - 1] + '</SPAN></TD>';
                result += '<TD CLASS="' + this.cssPrefix + 'cpMonthNavigation" WIDTH="10"><A CLASS="' + this.cssPrefix + 'cpMonthNavigation" HREF="' + refreshLink + '(' + this.index + ',' + next_month + ',' + next_month_year + ');">&gt;</A></TD>';
                result += '<TD CLASS="' + this.cssPrefix + 'cpMonthNavigation" WIDTH="10">&nbsp;</TD>';

                result += '<TD CLASS="' + this.cssPrefix + 'cpYearNavigation" WIDTH="10"><A CLASS="' + this.cssPrefix + 'cpYearNavigation" HREF="' + refreshLink + '(' + this.index + ',' + month + ',' + (year - 1) + ');">&lt;</A></TD>';
                result += '<TD CLASS="' + this.cssPrefix + 'cpYearNavigation" WIDTH="36"><SPAN CLASS="' + this.cssPrefix + 'cpYearNavigation">' + year + '</SPAN></TD>';
                result += '<TD CLASS="' + this.cssPrefix + 'cpYearNavigation" WIDTH="10"><A CLASS="' + this.cssPrefix + 'cpYearNavigation" HREF="' + refreshLink + '(' + this.index + ',' + month + ',' + (year + 1) + ');">&gt;</A></TD>';
            }
            else {
                result += '<TD CLASS="' + this.cssPrefix + 'cpMonthNavigation" WIDTH="22"><A CLASS="' + this.cssPrefix + 'cpMonthNavigation" HREF="' + refreshLink + '(' + this.index + ',' + last_month + ',' + last_month_year + ');">&lt;&lt;</A></TD>\n';
                result += '<TD CLASS="' + this.cssPrefix + 'cpMonthNavigation" WIDTH="100"><SPAN CLASS="' + this.cssPrefix + 'cpMonthNavigation">' + this.monthNames[month - 1] + ' ' + year + '</SPAN></TD>\n';
                result += '<TD CLASS="' + this.cssPrefix + 'cpMonthNavigation" WIDTH="22"><A CLASS="' + this.cssPrefix + 'cpMonthNavigation" HREF="' + refreshLink + '(' + this.index + ',' + next_month + ',' + next_month_year + ');">&gt;&gt;</A></TD>\n';
            }
        }
        result += '</TR></TABLE>\n';
        result += '<TABLE ID="' + this.id + 'dayList" name="' + this.id + 'dayList" WIDTH=136 BORDER=0 CELLSPACING=0 CELLPADDING=1 ALIGN=CENTER ';
        result += (this.selectionMode == "SingleRange") ? 'onmousedown="preReselect(' + this.dayListID + ');" onmouseup="afterSelect(' + this.inputID + ',' + this.id +','+this.dayListID+');">\n' : '>\n';
        result += '<TR>\n';
        for (var j = 0; j < 7; j++) {

            result += '<TD CLASS="' + this.cssPrefix + 'cpDayColumnHeader" WIDTH="14%"><SPAN CLASS="' + this.cssPrefix + 'cpDayColumnHeader">' + this.dayHeaders[(this.weekStartDay + j) % 7] + '</TD>\n';
        }
        result += '</TR>\n';
        for (var row = 1; row <= 6; row++) {
            result += '<TR>\n';
            for (var col = 1; col <= 7; col++) {
                var dateClass = "";
                if ((display_month == this.currentDate.getMonth() + 1) && (display_date == this.currentDate.getDate()) && (display_year == this.currentDate.getFullYear())) {
                    dateClass = "cpCurrentDate";
                }
                else if (display_month == month) {
                    dateClass = "cpCurrentMonthDate";
                }
                else {
                    dateClass = "cpOtherMonthDate";
                }
                {
                    var selected_date = display_date;
                    var selected_month = display_month;
                    var selected_year = display_year;
                    result += '	<TD  CLASS="' + this.cssPrefix + dateClass + '" selectDate={' + selected_year + '-' + selected_month + '-' + selected_date + '}';
                    result += (this.selectionMode == "SingleDate") ? ' onmouseover="MouseOver(' + this.id + ');" onmouseout="MouseOut(' + this.id + ',' + selected_year + ',' + selected_month + ',' + selected_date + ');" onclick="MouseClick(' + this.id + ',' + this.inputID + ',' + selected_year + ',' + selected_month + ',' + selected_date + ');" >' : ' >';
                    result += display_date + '</TD>\n';
                }
                display_date++;
                if (display_date > daysinmonth[display_month]) {
                    display_date = 1;
                    display_month++;
                }
                if (display_month > 12) {
                    display_month = 1;
                    display_year++;
                }
            }
            result += '</TR>';
        }
        var current_weekday = now.getDay() - this.weekStartDay;
        if (current_weekday < 0) {
            current_weekday += 7;
        }
        result += '<TR>\n';
        result += '	<TD COLSPAN=7 ALIGN=CENTER CLASS="' + this.cssPrefix + 'cpTodayText">\n';
        result += '		<A CLASS="' + this.cssPrefix + 'cpTodayText" HREF="javascript:' + refreshLink + '(' + this.index + ');" onclick ="' + this.returnFunction + '(' + this.id + ',' + now.getFullYear() + ',' + (now.getMonth() + 1) + ',' + now.getDate() + ');" >' + this.todayText + '</A>\n';
        result += '		<BR>\n';
        result += '	</TD></TR></TABLE></CENTER></TD></TR></TABLE>\n';
    }
    return result;
}
// mouse event while selectionMode="SingleRange"
function preReselect(dayList) {
    for (var i = 0; i < dayList.rows.length; i++) {
        for (var j = 0; j < dayList.rows[i].cells.length; j++) {
            var d = dayList.rows[i].cells[j];
            if (typeof (d.attributes['selectDate'] != 'undefined') && d.attributes['selectDate'] != null) {
                if (d.attributes['class'].value == 'cpCurrentDate') d.style.backgroundColor = "#00CC33";
                else d.style.backgroundColor = "white";
            }
        }
    }
}
function afterSelect(targetInput, c, dayList) {
    // get selected dates and add into the input text.
    var range = document.selection.createRange();
    if (range.htmlText == '') return false;
    var reg = /{(.*?)}/gi;
    var ds = range.htmlText.match(reg);
    if (ds == null) {targetInput.value = ""; return false;}
    else {
        var strStart = ds[0].substring(1, ds[0].length - 1);
        var strEnd = ds[ds.length - 1].substring(1, ds[ds.length - 1].length - 1);
        var startTime = getDateFromFormat(strStart, 'yyyy-M-d');
        var endTime = getDateFromFormat(strEnd, 'yyyy-M-d');
        var startDate = new Date(startTime);
        var endDate = new Date(endTime);
        if (typeof ds != 'undefined' && ds.length > 1) {
            targetInput.value = formatDate(startDate, c.dateFormat) + "至" + formatDate(endDate, c.dateFormat);
        }
        //set different bgcolor for selected dates   
        for (var i = 0; i < dayList.rows.length; i++) {
            for (var j = 0; j < dayList.rows[i].cells.length; j++) {
                var d = dayList.rows[i].cells[j];
                if (typeof (d.attributes['selectDate'] != 'undefined') && d.attributes['selectDate'] != null) {
                    for (var k = 0; k < ds.length; k++) {
                        if (ds[k] == d.attributes['selectDate'].value) {
                            d.style.backgroundColor = "#1874CD"; // "#FFCC00";
                        }
                    }
                }
            }
        }
    }
}
// mouse event while selectionMode="SingleDate"
function MouseOver(c) {
    var tdcur = event.srcElement;
    tdcur.style.cursor = "hand";
    if (c.seletedTD == tdcur) tdcur.style.backgroundColor = "red"; //bg_click
    else tdcur.style.backgroundColor = "#FFCC00"; //bg_over

}
function MouseOut(c, y, m, d) {
    var date = new Date();
    nowY = date.getFullYear();
    nowM = date.getMonth() + 1;
    nowD = date.getDate();
    var tdcur = event.srcElement;
    if ((m == nowM) && (d == nowD) && (y == nowY)) {
        tdcur.style.backgroundColor = "#00CC33"; //bg_cur_day
    }
    else if (c.seletedTD != tdcur) {
        tdcur.style.backgroundColor = "white"; //bg_out
    }
}
function MouseClick(c, targetInput, y, m, d) {
    var tdcur = event.srcElement;
    if (c.seletedTD == null) { c.seletedTD = tdcur; c.seletedTD.style.backgroundColor = "red"; }
    else if (c.seletedTD != tdcur) { c.seletedTD.style.backgroundColor = "white"; c.seletedTD = tdcur; c.seletedTD.style.backgroundColor = "red"; }
    var dt = new Date(y, m - 1, d, 0, 0, 0);
    targetInput.value = formatDate(dt, c.dateFormat);
}