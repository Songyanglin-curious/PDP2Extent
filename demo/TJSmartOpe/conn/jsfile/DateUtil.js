/**
 *  DateUtil.js
 *  日期工具包
 *  时间:2011-02-12
 *  注：1天=86400000毫秒
 */
function DateUtil(){
 this.WeekDay;//星期几
 this.WeekDayStr;
 this.Day;//当天
 this.Year;//当年
 this.Month;//当月
 this.Hours;//当前小时
 this.Minutes;
 this.Seconds;
 this.Time;//当前事件

 var Nowdate=new Date();
 this.WeekDay=Nowdate.getDay();
 this.Month = Nowdate.getMonth();
 this.Day = Nowdate.getDate();
 this.Year = Nowdate.getFullYear();
 this.WeekDayStr = '星期'+'日一二三四五六'.charAt(this.WeekDay)
 this.Hours = Nowdate.getHours();
 this.Minutes = Nowdate.getMinutes();
 this.Seconds = Nowdate.getSeconds();
 this.Time = this.Year+"-"+(this.Month+1)+"-"+this.Day +" "+ this.Hours + ":" + this.Minutes + ":" + this.Seconds;
 
 //今天
 this.showCurrentDay=function(){
  return Nowdate;
 };
 //本周第一天
 this.showWeekFirstDay=function(){
  var WeekFirstDay=new Date(Nowdate-(this.WeekDay-1)*86400000);
  return WeekFirstDay;
 };
 //本周最后一天
 this.showWeekLastDay=function(){
  var WeekFirstDay=this.showWeekFirstDay();
  var WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);
  return WeekLastDay;
 };
 //本月第一天
 this.showMonthFirstDay = function () {
     var MonthFirstDay = new Date(this.Year, this.Month, 1);
     return MonthFirstDay;
 };
 //本月最后一天
 this.showMonthLastDay=function(){
  var MonthNextFirstDay=new Date(this.Year,this.Month+1,1);
  var MonthLastDay=new Date(MonthNextFirstDay-86400000);
  return MonthLastDay;
 };
 
 //当年第一天
 this.showYearFirstDay=function(){
  var YearFirstDay=new Date(this.Year,0,1);
  return YearFirstDay;
 };
 //当年最后一天
 this.showYearLastDay=function(){
  var YearNextFirstDay=new Date(this.Year+1,0,1);
  var YearLastDay = new Date(YearNextFirstDay-86400000);
  return YearLastDay;
 };
 
 //上年第一天
 this.showYearPreviousFirstDay=function(){
  var YearPreviousFirstDay=new Date(this.Year-1,0,1);
  return YearPreviousFirstDay;
 };
 //上年最后一天
 this.showYearPreviousLastDay=function(){
  var YearFirstDay = this.showYearFirstDay();
  var YearPreviousLastDay = new Date(YearFirstDay-86400000);
  return YearPreviousLastDay;
 };
 
 //下年第一天
 this.showYearNextFirstDay=function(){
  var YearNextFirstDay=new Date(this.Year+1,0,1);
  return YearNextFirstDay;
 };
 //下年最后一天
 this.showYearNextLastDay=function(){
  var step = new Date(this.Year+2,0,1);
  var YearNextLastDay = new Date(step-86400000);
  return YearNextLastDay;
 };
 
 //上月第一天
 this.showPreviousFirstDay=function(){
  var MonthFirstDay=this.showMonthFirstDay()
  return new Date(MonthFirstDay.getFullYear(),MonthFirstDay.getMonth()-1,1)
 };
 //上月最后一天
 this.showPreviousLastDay=function(){
  var MonthFirstDay=this.showMonthFirstDay();
  return new Date(MonthFirstDay-86400000);
 };
 //上周第一天
 this.showPreviousFirstWeekDay=function(){
  var WeekFirstDay=this.showWeekFirstDay()
  return new Date(WeekFirstDay-86400000*7)
 };
 //上周最后一天
 this.showPreviousLastWeekDay=function(){
  var WeekFirstDay=this.showWeekFirstDay()
  return new Date(WeekFirstDay-86400000)
 };
 //上一天
 this.showPreviousDay=function(){
  var MonthFirstDay=new Date();
  return new Date(MonthFirstDay-86400000);
 };
 //下一天
 this.showNextDay=function(){
  var MonthFirstDay=new Date();
  return new Date((MonthFirstDay/1000+86400)*1000);
 };
 //下周第一天
 this.showNextFirstWeekDay=function(){
  var MonthFirstDay=this.showWeekLastDay()
  return new Date((MonthFirstDay/1000+86400)*1000)
 };
 //下周最后一天
 this.showNextLastWeekDay=function(){
  var MonthFirstDay=this.showWeekLastDay()
  return new Date((MonthFirstDay/1000+7*86400)*1000)
 };
 //下月第一天
 this.showNextFirstDay=function(){
  var MonthFirstDay=this.showMonthFirstDay()
  return new Date(MonthFirstDay.getFullYear(),MonthFirstDay.getMonth()+1,1)
 };
 //下月最后一天
 this.showNextLastDay=function(){
  var MonthFirstDay=this.showMonthFirstDay()
  return new Date(new Date(MonthFirstDay.getFullYear(),MonthFirstDay.getMonth()+2,1)-86400000)
 };
 
 //返回json
 this.toObject=function(startTime,endTime){
  var obj ={start:startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate() 
     ,end:endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()};
  return obj;
 }
};
//上一年 {start:2010-01-01 00:00:00,end:2010-12-31 23:59:59}
DateUtil.prototype.PreviousYear=function(){
 return this.toObject(this.showYearPreviousFirstDay(),this.showYearPreviousLastDay());
};
//本年 {start:2011-01-01 00:00:00,end:2011-12-31 23:59:59}
DateUtil.prototype.CurrentYear=function(){
 return this.toObject(this.showYearFirstDay(),this.showYearLastDay());
};
//下一年 {start:2012-01-01 00:00:00,end:2012-12-31 23:59:59}
DateUtil.prototype.NextYear=function(){
 return this.toObject(this.showYearNextFirstDay(),this.showYearNextLastDay());
};
//上一月 {start:2011-01-01 00:00:00,end:2011-01-31 23:59:59}
DateUtil.prototype.PreviousMonth=function(){
 return this.toObject(this.showPreviousFirstDay(),this.showPreviousLastDay());
};
//本月 {start:2011-02-01 00:00:00,end:2011-02-28 23:59:59}
DateUtil.prototype.CurrentMonth=function(){
 return this.toObject(this.showMonthFirstDay(),this.showMonthLastDay());
};
//下一月 {start:2011-03-01 00:00:00,end:2011-03-31 23:59:59}
DateUtil.prototype.NextMonth=function(){
 return this.toObject(this.showNextFirstDay(),this.showNextLastDay());
};
//上一周
DateUtil.prototype.PreviousWeekDay=function(){
 return this.toObject(this.showPreviousFirstWeekDay(),this.showPreviousLastWeekDay());
};
//本周
DateUtil.prototype.CurrentWeekDay=function(){
 return this.toObject(this.showWeekFirstDay(),this.showWeekLastDay());
};
//下一周
DateUtil.prototype.NextWeekDay=function(){
 return this.toObject(this.showNextFirstWeekDay(),this.showNextLastWeekDay());
};
//上一天
DateUtil.prototype.PreviousDay=function(){
 return this.toObject(this.showPreviousDay(),this.showPreviousDay());
};
//今天
DateUtil.prototype.CurrentDay=function(){
 return this.toObject(this.showCurrentDay(),this.showCurrentDay());
};
//下一天
DateUtil.prototype.NextDay=function(){
 return this.toObject(this.showNextDay(),this.showNextDay());
};

//根据参数获取时间段对象,eg {start:2011-02-16 00:00:00,end:2011-02-16 23:59:59}，
//如果参数不存在，则返回{start:'',end:''}
DateUtil.getDateStr = function(op){
 var dateUtil = new DateUtil();
 var dateStr;
 
 //上一年 PreviousYear
 if('PreviousYear'==op) dateStr = dateUtil.PreviousYear();
 //今年 CurrentYear
 if('CurrentYear'==op) dateStr = dateUtil.CurrentYear();
 //下一年 NextYear
 if('NextYear'==op) dateStr = dateUtil.NextYear();
 //上一月 PreviousMonth
 if('PreviousMonth'==op) dateStr = dateUtil.PreviousMonth();
 //本月 CurrentMonth
 if('CurrentMonth'==op) dateStr = dateUtil.CurrentMonth();
 //下一月 NextMonth
 if('NextMonth'==op) dateStr = dateUtil.NextMonth();
 //上一周 PreviousWeekDay
 if('PreviousWeekDay'==op) dateStr = dateUtil.PreviousWeekDay();
 //本周 CurrentWeekDay
 if('CurrentWeekDay'==op) dateStr = dateUtil.CurrentWeekDay();
 //下一周 NextWeekDay
 if('NextWeekDay'==op) dateStr = dateUtil.NextWeekDay();
 //上一天 PreviousDay 
 if('PreviousDay'==op) dateStr = dateUtil.PreviousDay();
 //今天 CurrentDay
 if('CurrentDay'==op) dateStr = dateUtil.CurrentDay();
 //下一天 NextDay
 if('NextDay'==op) dateStr = dateUtil.NextDay();
 
 if(dateStr==null || dateStr=='undifined' ||dateStr==''){
  dateStr = {start:'',end:''};
 } 
 return dateStr;
}

