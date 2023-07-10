    var strEditLink = "<a href='#' onclick='ToEdit(this)'><img src='../../i/toEdit.gif'/>&nbsp;&nbsp;编辑</a>";
    var strSaveLink = "<a href='#' onclick='ToSave(this)'><img src='../../i/toSave.gif'/>&nbsp;&nbsp;保存</a>";
    var strDeleteLink = "<a href='#' onclick='ToDelete(this)'>删除</a>";
    var strCancelLink = "<a href='#' onclick='ToCancel(this)'>取消</a>";
    var nCount = 0;
    var trHeight = "21px";
    var tdHeight = "8px";
    
  function FillTableRow(arrRow,rowId)
  {
        var tr = tblList.insertRow(-1);
        tr.attachEvent('onclick', onClick);
        tr.attachEvent('onmouseover', onSelect);
        tr.attachEvent('onmouseout', onLeave);
        tr.className = nCount%2 == 0 ? "TR_ALTERNATE_1" : "TR_ALTERNATE_2";
        tr.style.height = trHeight;
        nCount++;
        var td = tr.insertCell(-1);
        td.style.display = "none";
        td.innerHTML ="<input type='hidden' value="+rowId+" /><input type='hidden' value="+arrRow[0]+" />" ;
        for(var j=1;j<arrRow.length;j++)
        {
            td = tr.insertCell(-1);
            td.className = "tdClass";
            td.innerHTML = arrRow[j];
        }
  }
  /*画线条，arrUp为上面的一条 （线条的长度，颜色）只有一个线条时，设置arrDown为null */
  function FillLineRow(arrUp,arrDown)// arrUp(length,color)
  {
	  FillLine(arrUp);
	  if(arrDown == null)
	    return;
	  FillLine(arrDown);
  }
	
	function FillLine(arrLine)
	{
	   var tr = tblLine.insertRow(-1);
       tr.className = nCount%2 == 1 ? "TR_ALTERNATE_1" : "TR_ALTERNATE_2";
       tr.style.height = "10px";
	   var td = tr.insertCell(-1);
	   td.style.textAlign = "left";
	   td.innerHTML = GetCellLineHTML(arrLine);
	}
	
	function GetCellLineHTML(arrLine)
	{
       var strHTML =  "<table style='border-collapse:collapse; text-align:left;' cellpadding='0' cellspacing='0' border='0'><tr style='height:"+ trHeight +"'>";
	   for(var i =0;i<arrLine.length;i++)
	   {
			var arr = arrLine[i];
			strHTML += "<td style='width:"+ arr[0] +"px;height:"+ tdHeight +"; background-color:"+ arr[1] +"' title='"+ arr[2] +"'></td>";
	   }
	   strHTML += "</tr></table>";
	   return strHTML;
	}
	
	function ChangeLineLength(objtbl,newLength,title)
	{
        objtbl.innerHTML = GetCellLineHTML(new Array(new Array(newLength,"Red",title)));
	}
	
	//默认事件处理
    function onClick(obj)
    {
        return false;
    }
    function OnMouseUp(obj)
    {
        return false;
    }
    var trClassName = "";
    function onSelect()
    {
        var tr = event.srcElement;
        while(tr.tagName!="TR")
        {
            tr = tr.parentElement;
        }
        if(tr.className != "TR_SELECTED")
            trClassName = tr.className;
        tr.className = "TR_SELECTED" ;
    }
    function onLeave(obj)
    {
        var tr = event.srcElement;
        while(tr.tagName!="TR")
        {
            tr = tr.parentElement;
        }
        tr.className = trClassName ;
    }
    function EditCell(objCell)
	{
        objCell.innerHTML = "<input type='text' style='width:95%'  value='"+objCell.innerText+"' />";
	}
	function SaveCell(objCell)
	{
        objCell.innerText = objCell.firstChild.value;
	}
