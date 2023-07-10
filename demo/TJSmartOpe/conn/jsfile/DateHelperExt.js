function fPopUpCalendarDlg(ctrlobj)
{
	showx = event.screenX - event.offsetX;
	showy = event.screenY - event.offsetY + 20;
	var dlgheight;
	dlgheight = 230;
	if(showy+dlgheight > screen.height) showy = event.screenY - event.offsetY - dlgheight - 5;

	ctrlobj.select();
	//window.open("calendar.htm");
	retval = window.showModalDialog("../conn/jsfile/calendarext.htm?a=" + new Date(), ctrlobj, "dialogWidth:197px; dialogHeight:"+dlgheight+"px; dialogLeft:"+showx+"px; dialogTop:"+showy+"px; status:no; directories:yes;scrollbars:no;Resizable=no; ");
	if( retval != null )
		ctrlobj.value = retval;
}
//function checkdate(strDate,strName)
//{
//	if (strDate.length==0)
//		return true;
//	//判断日期是否符合格式
//	//判断日起格式是否正确
//	var mday1=new Array(31,29,31,30,31,30,31,31,30,31,30,31); 
//	var mday2=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
//	var startindex,endindex,len;
//	var year,mon,day;
//	len=strDate.length; 
//	startindex=strDate.indexOf("-");
//	endindex=strDate.indexOf("-",startindex+1);
//	year=strDate.substring(0,startindex);
//	mon=strDate.substring(startindex+1,endindex); 
//	day=strDate.substring(endindex+1,len);
//	var sum=year+mon+day;
//	if (sum%1!=0) 
//	{
//	return false; 
//	}
//	var dstartdate=Date.parse(year+"/"+mon+"/"+day); 
//	if(!dstartdate)
//	{ 
//		//alert("无效的" + strName + "！请按照年－月－日的格式输入！");
//		return false;
//	} 
//	//判断月份是否正确
//	year=eval(year);
//	mon=eval(mon);
//	day=eval(day);
//	if(year < 1 || year > 9999)
//	{
//		alert(strName + "中年份无效！");
//		return false;
//	}
//	if(mon<=0 || mon>12)
//	{
//		alert(strName + "中月份无效！");
//		return false;
//	}  
//	//判断日是否正确
//	var mday=mday2;
//	if(year%100==0)
//	{
//		if(year%4==0)
//			mday=mday1;
//	}
//	else
//	{
//		if(year%4==0)
//			mday=mday1;
//	} 
//	if(day<=0||day>mday[mon-1])
//	{
//		alert(strName + "中日期无效！");
//		return false;
//	}
//	return true;
//}

function parsedate(strDate)
{
	var startindex,endindex,len;
	var year,mon,day;
	len=strDate.length; 
	startindex=strDate.indexOf("-");
	endindex=strDate.indexOf("-",startindex+1);
	year=strDate.substring(0,startindex);
	mon=strDate.substring(startindex+1,endindex); 
	day=strDate.substring(endindex+1,len);
	return year*10000.0 + mon*100 + day;
}

//function checkdaterange(strStartDate,strEndDate)
//{
//	if (parsedate(strStartDate) > parsedate(strEndDate))
//	{
//		alert('开始时间不能大于结束时间！');
//		return false;
//	}
//	return true;
//}

//function checkdaterangeex(name,strStartDate,strEndDate)
//{
//	if (parsedate(strStartDate) < parsedate(strEndDate))
//		return true;
//	alert(name + "开始日期必须小于结束日期!");
//	return false;
//}

//	由普通的“2006-11-30”日期格式转为“2006/11/30”格式
//function parsetojsdate(strDate)
//{
//	var startindex,endindex,len;
//	var year,mon,day;
//	len=strDate.length; 
//	startindex=strDate.indexOf("-");
//	endindex=strDate.indexOf("-",startindex+1);
//	year=strDate.substring(0,startindex);
//	mon=strDate.substring(startindex+1,endindex); 
//	day=strDate.substring(endindex+1,len);
//	return year + "/" + mon + "/" + day;
//}

//	得到两个日期之间的差值
//	s	秒
//	m	分
//	h	小时
//	d	天
//function datediff(dt1, dt2, diff)
//{
//	var date1 = Date.parse(dt1);
//	var date2 = Date.parse(dt2);
//	if (!isNaN(date1) && !isNaN(date2))
//	{
//		var rtnvalue;
//		var dtdiff = Math.ceil(date2 - date1);
//		switch (diff)
//		{
//			case "s":
//				rtnvalue = dtdiff / 1000;
//				break;
//			case "m":
//				rtnvalue = dtdiff / (1000 * 60);
//				break;
//			case "h":
//				rtnvalue = dtdiff / (1000 * 60 * 60);
//				break;
//			case "d":
//				rtnvalue = dtdiff / (1000 * 60 * 60 * 24);
//				break;
//			default:
//				rtnvalue = dtdiff / (1000 * 60 * 60 * 24);
//				break;
//		}
//		return rtnvalue;
//	}
//	else
//	{
//		return null;
//	}
//}

function DateEx(v) {
	this.v = v;
	this.isInvalid = function() {
		return !isNaN(Date.parse(this.v.replace("-","/").replace("-","/")));
	}
	this.split = function() {
		var tt = this.v.replace(" ","-").replace(":","-").replace(":","-");
		tt = tt.split("-");
		var arr = [parseInt(tt[0],10),parseInt(tt[1],10),parseInt(tt[2],10)];
		if (tt.length > 3) {
			arr.push(parseInt(tt[3],10));
			arr.push(parseInt(tt[4],10));
			arr.push(parseInt(tt[5],10));
		} else {
			arr.push(0);
			arr.push(0);
			arr.push(0);
		}
		return arr;
	}
	this.splitEx = function() {
		if (this.isInvalid())
			return this.split();
		var thisMoment = new Date();
		return [thisMoment.getFullYear(),thisMoment.getMonth() + 1,thisMoment.getDate(),thisMoment.getHours(),thisMoment.getMinutes(),thisMoment.getSeconds()];
	}
	this.getDateTime = function() {
		if (this.isInvalid())
			return this.v;
		var thisMoment = new Date();
		return thisMoment.getFullYear() + "-" + (thisMoment.getMonth() + 1) + "-" + thisMoment.getDate()
			+ " " + thisMoment.getHours() + ":" + thisMoment.getMinutes() + ":" + thisMoment.getSeconds();
	}
}
