function fPopUpTimeDlg(ctrlobj, format) {
    showx = event.screenX - event.offsetX;
    showy = event.screenY - event.offsetY + 20;
    var dlgheight;
    dlgheight = 120;
    if (showy + dlgheight > screen.height) showy = event.screenY - event.offsetY - dlgheight - 5;

    ctrlobj.select();
    retval = window.showModalDialog("/conn/jsfile/timectrl.htm", [ctrlobj.value, format], "dialogWidth:160px; dialogHeight:" + dlgheight + "px; dialogLeft:" + showx + "px; dialogTop:" + showy + "px; status:no; directories:yes;scrollbars:no;Resizable=no; ");
    if (retval != null)
        ctrlobj.value = retval;
}
/*
function checkTime(strTime,strName) {
	if (strTime.length==0)
		return true;
	var startindex,endindex,len;
	var hour,minute,second;
	len=strTime.length; 
	startindex=strTime.indexOf(":");
	endindex=strTime.indexOf(":",startindex+1);
	hour=strTime.substring(0,startindex);
	minute=strTime.substring(startindex+1,endindex); 
	second=strTime.substring(endindex+1,len);
	var sum=hour+minute+second;
	if (sum%1!=0)
	 { 
	     alert('only allowed numbers and :');
	     return false;
	  }
	var dstartdate=Date.parse("2000/1/1 " + hour +":"+minute+":"+second); 
	if ((!dstartdate)||(typeof(eval(sum)) == "undefined")) 
	{
	 alert('无效的输入！请按时：分：秒的格式输入');
	 return false;
	  } 
	hour=(hour.length < 3) ? eval(hour) : -1;
	minute=(minute.length < 3) ? eval(minute) : -1;
	second=(second.length < 3) ? eval(second) : -1;
	if ((typeof(hour)=="undefined")||(hour >= 24)||(hour < 0)) {
			alert('小时数无效！');
			return false;
	}
	if ((typeof(minute)=="undefined")||(minute >= 60)||(minute < 0)) {
	        alert('分钟数无效！');
			return false;
	}
	if ((typeof(second)=="undefined")||(second >= 60)||(second < 0)) {
		    alert('秒数无效！');
			return false;
	}
	return true;
}*/