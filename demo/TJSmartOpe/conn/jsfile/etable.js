// JScript 文件
if (!Array.prototype.erase) {
	Array.prototype.erase = function(obj) {
        for (var i = 0;i < this.length;i++) {
            if (this[i] == obj)
                break;
        }
        if (i != this.length)
            this.splice(i,1);
    }
};
//结构对象
function RowContent(allCellContent)
{
    this._editing = false;
    this._cellContentCollection = allCellContent;
}

function CellType(title,width,type,objCtrl)
{
    this._title = title;
    this._w = width;
    this._type = type;
    this._ctrl = objCtrl;
}
//函数
function eTable_findTableById(tbl)
{
	for (var i = 0;i < e_AllTables.length;i++)
	{
	    if(tbl == e_AllTables[i]._table)
	        return e_AllTables[i];
	}
	return e_AllTables[i - 1];
}
function Table_Select_GetOpt(options,value)
{
    for(var i = 0; i < options.length; i++)
        if(options[i].value == value)
            return options[i];
}

var e_AllTables = new Array;
//控件对象
function etable(arrCellType,arrRowContent,privnoedit)
{
    e_AllTables.push(this);
    document.write("<center><table border='0' style='margin:0;font-size:10pt;border: #c7c7c7 1px solid;width:99%'"
        + "cellspacing='0' cellpading='0' id='etable" + e_AllTables.length + "'></table></center>");
    this._table = document.getElementById("etable" + e_AllTables.length);
    
    this._sort_check = false;
    this._sort_index = 0;
    this._rowDspIndex = 0;
    this._rowDspPrefix = "数据";
    this._privforedit = privnoedit ? false : true;
    this._headcolor ="#E0E0E0";
    this._rightDesc = "是";
    this._wrongDesc = "否";
    this._eventdesc = "onblur";
    this._CellTypes = arrCellType ? arrCellType : new Array;
    this._RowContents = arrRowContent ? arrRowContent : new Array;
    
    this.changepriv = function(priv)
    {
        if(priv)
        {
            this._privforedit = true;
            for(var i = 0; i < this._table.rows.length; i++)
                this._table.rows(i).lastChild.style.display = "block";
            this._table.rows(i-1).style.display = "block";
        }
        else
        {
            this._privforedit = false;
            this._table.rows(0).lastChild.style.display = "none";
            for(var i = 1; i < this._table.rows.length; i++)
            {
                if(!this._RowContents[i - 1])
                {
                    this._table.rows(i).style.display = "none";
                    return;
                }
                if(this._RowContents[i - 1]._editing)
                {
                    this.cancelRow(this._table.rows(i).lastChild.lastChild)
                }
                this._table.rows(i).lastChild.style.display = "none";
            }
        }
    }
    
    this.headRow = function(arrCellType)
    {
        this._CellTypes = arrCellType ? arrCellType : this._CellTypes;
        if(!this._table)
            return;
        var tr = this._table.insertRow(-1);
        tr.style.backgroundColor = this._headcolor;
        for(var i = 0; i < this._CellTypes.length; i++)
        {
            var tc = tr.insertCell(-1);
            if(this._CellTypes[i]._w == 0)
                tc.style.display = "none";
            else
                tc.style.width = this._CellTypes[i]._w;
            tc.innerHTML = "<a class='edittable_A' href='' onclick='return eTable_findTableById(" + this._table.id
                    + ").sort(" + i + ")'><b>&nbsp;" + this._CellTypes[i]._title + "&nbsp;</b></a>";
            tc.align = "center";
            tc.className="edittabletd";
        }
        var tc = tr.insertCell(-1);
        tc.style.width = "100px";
        tc.innerText = "操作";
        tc.align = "center";
        tc.className="edittabletd";
        if(!this._privforedit) tc.style.display = "none";
        return tr;
    }
    
    this.contentRow = function(arrRowContent)
    {
        if((!this._CellTypes) || (this._CellTypes.length == 0))
            return;
        this._RowContents = arrRowContent ? arrRowContent : this._RowContents;
        for(var i = 0; i < this._RowContents.length; i++)
        {
            var tr = this._table.insertRow(-1);
            for(var j = 0; j < this._CellTypes.length; j++)
            {
                var tc = tr.insertCell(-1);
                if(this._CellTypes[j]._w == 0)
                    tc.style.display = "none";
                else
                    tc.style.width = this._CellTypes[j]._w;
                tc.align = "center";
                tc.className="edittabletd";
                switch(this._CellTypes[j]._type)
                {
                    case 1:
                        tc.innerHTML = "<input type='text' " + (this._RowContents[i]._editing ? "" : "style='display:none'")
                            + " onkeydown='if(event.keyCode == 13){eTable_findTableById("
                            + this._table.id + ").updateRow(this); return false}' style='width:97%;height:99%' value='"
                            + this._RowContents[i]._cellContentCollection[j] + "' /><span "
                            + (this._RowContents[i]._editing ? "style='display:none'" : "") + ">&nbsp;"
                            + this._RowContents[i]._cellContentCollection[j] + "</span>";
                        break;
                    case 2:
                        tc.innerHTML = "<input class='checkboxcss' type='checkbox' "
                            + (this._RowContents[i]._editing ? "" : "style='display:none'") + " "
                            + ((this._RowContents[i]._cellContentCollection[j] != "0") ? "checked='checked'" : "")
                            + "/><span " + (this._RowContents[i]._editing ? "style='display:none'" : "") + ">"
                            + ((this._RowContents[i]._cellContentCollection[j] != "0") ? this._rightDesc : this._wrongDesc)
                            + "</span>";
                        break;
                    case 3:
                        tc.innerHTML = "";
                        var obj2 = tc.appendChild(this._CellTypes[j]._ctrl.cloneNode(true));
                        obj2.value = this._RowContents[i]._cellContentCollection[j];
                        obj2.style.width="97%";
                        if (!this._RowContents[i]._editing) obj2.style.display = "none";
                        if(obj2.selectedIndex >= 0)
                            tc.innerHTML += "<span " + (this._RowContents[i]._editing ? "style='display:none'" : "")
                            + ">&nbsp;" + obj2.options[obj2.selectedIndex].text + "</span>";
                        else
                            tc.innerHTML += "<span " + (this._RowContents[i]._editing ? "style='display:none'" : "")
                            + ">&nbsp;</span>";
                        break;
                    case 4:
                        tc.innerHTML = "<input class='checkboxcss' type='checkbox' "
                            + (this._RowContents[i]._editing ? "" : "disabled='disabled' ")
                            + ((this._RowContents[i]._cellContentCollection[j] != "0") ? "checked='checked'" : "") + "/>";
                        break;
                    case 5:
                        tc.innerHTML = "";
                        var obj2 = tc.appendChild(this._CellTypes[j]._ctrl.cloneNode(true));
                        var value_combox_temp = this._RowContents[i]._cellContentCollection[j].split(",");
                        var text_combox_temp = "";
                        for(var t = 0; t < obj2.options.length; t++)
                        {
                            for(var k = 0; k < value_combox_temp.length; k++)
                                if(obj2.options[t].value == value_combox_temp[k])
                                {
                                    obj2.options[t].selected = true;
                                    text_combox_temp += "，" + obj2.options[t].text;
                                }
                        }
                        obj2.style.width="97%";
                        if (!this._RowContents[i]._editing) obj2.style.display = "none";
                        tc.innerHTML += "<span " + (this._RowContents[i]._editing ? "style='display:none'" : "")
                            + ">&nbsp;" + (text_combox_temp == "" ? "": text_combox_temp.substr(1)) + "</span>";
                        break;
                    default:
                        tc.innerHTML = this._RowContents[i]._cellContentCollection[j] == "" ? "<span>&nbsp;</span>" : ("<span>" + this._RowContents[i]._cellContentCollection[j] + "</span>");
                        break;
                }
            }
            var tc = tr.insertCell(-1);
            tc.innerHTML = "<button style='width:52px;height:22px;border:0;' onclick='return eTable_findTableById("
                + this._table.id + ").editRow(this)' " + (this._RowContents[i]._editing ? "style='display:none'" : "")
                + "><div class='imgETBJ' /></button><button style='width:52px;height:22px;border:0;'"
                + " onclick='return eTable_findTableById(" + this._table.id + ").deleteRow(this)' "
                + (this._RowContents[i]._editing ? "style='display:none'" : "") + "><div class='imgETSC' /></button>"
                + "<button style='width:52px;height:22px;border:0;' onclick='return eTable_findTableById("
                + this._table.id + ").updateRow(this)' " + (this._RowContents[i]._editing ? "" : "style='display:none'")
                + "><div class='imgETGX' /></button><button style='width:52px;height:22px;border:0;'"
                + " onclick='return eTable_findTableById(" + this._table.id + ").cancelRow(this)' "
                + (this._RowContents[i]._editing ? "" : "style='display:none'") + "><div class='imgETQX' /></button>";
            tc.className="edittabletd";
            if(!this._privforedit) tc.style.display = "none";
        }
        this.insertRow(-1);
    }
    
    this.insertRow = function()
    {
        if(this._RowContents.length < this._table.rows.length - 1)
        {
            alert("请不要重复添加");
            return false;
        }
        var newtr = this._table.insertRow(-1);
        for(var i = 0; i < this._CellTypes.length; i++)
        {
            var tc = newtr.insertCell(-1);
            tc.className="edittabletd";
            if(this._CellTypes[i]._w == 0)
                tc.style.display = "none";
            else
                tc.style.width = this._CellTypes[i]._w;
            tc.align = "center";
            switch(this._CellTypes[i]._type)
            {
                case 1:
                    tc.innerHTML = "<input onkeydown='if(event.keyCode == 13){eTable_findTableById(" + this._table.id
                        + ").updateRow(this); return false}' style='width:97%;height:99%' value='' />"
                        + "<span  style='display:none'></span>";
                    break;
                case 2:
                    tc.innerHTML = "<input class='checkboxcss' type='checkbox' />"
                        + "<span  style='display:none'></span>";
                    break;
                case 3:
                    var obj2 = tc.appendChild(this._CellTypes[i]._ctrl.cloneNode(true));
                    obj2.style.width="97%";
                    tc.innerHTML += "<span  style='display:none'></span>";
                    break;
                case 4:
                    tc.innerHTML = "<input class='checkboxcss' type='checkbox' />";
                    break;
                case 5:
                    var obj2 = tc.appendChild(this._CellTypes[i]._ctrl.cloneNode(true));
                    obj2.style.width="97%";
                    tc.innerHTML += "<span  style='display:none'></span>";
                    break;
                default:
                    tc.innerHTML = "<span>&nbsp;</span>";
                    break;
            }
        }
        var tc = newtr.insertCell(-1);
        tc.innerHTML = "<button style='width:52px;height:22px;border:0;' onclick='return eTable_findTableById(" + this._table.id
                    + ").editRow(this)' style='display:none'><div class='imgETBJ' /></button><button style='width:52px;height:22px;border:0;' onclick='return "
                    + "eTable_findTableById(" + this._table.id + ").deleteRow(this)' style='display:none'><div class='imgETSC' /></button>"
                    + "<button style='width:52px;height:22px;border:0;' onclick='return eTable_findTableById(" + this._table.id
                    + ").updateRow(this)'><div class='imgETGX' /></button><button style='width:52px;height:22px;border:0;' onclick='return "
                    + "eTable_findTableById(" + this._table.id + ").cancelRow(this)'><div class='imgETQX' /></button>";
        if(!this._privforedit) newtr.style.display = "none";
    }
    
    this.deleteRow = function(obj)
    {
        var tr = obj.parentElement.parentElement;
        if(confirm("确定删除" + this._rowDspPrefix + "“" + tr.cells(this._rowDspIndex).lastChild.innerText + "”吗？"))
        {
            if(this.deleteEvent(tr))//删除数据是否成功
            {
                this._RowContents.erase(this._RowContents[tr.rowIndex - 1]);
                this._table.deleteRow(tr.rowIndex);
                return;
            }
            alert("删除失败");
        }
        var tc =  tr.lastChild;
        tc.children[0].style.display = "";
        tc.children[1].style.display = "";
        tc.children[2].style.display = "none";
        tc.children[3].style.display = "none";
    }
    
    this.deleteEvent = function(tr)
    {
        return true;
    }
    
    this.editRow = function(obj)
    {
        var tr = obj.parentElement.parentElement;
        var rowContent = this._RowContents[tr.rowIndex - 1];
        rowContent._editing = true;
        for(var i = 0; i < this._CellTypes.length; i++)
        {
            var tc = tr.cells(i);
            switch(this._CellTypes[i]._type)
            {
                case 1:
                    tc.firstChild.value = rowContent._cellContentCollection[i];
                    tc.firstChild.style.display = "block";
                    tc.firstChild.fireEvent("onchange");
                    tc.lastChild.style.display = "none";
                    break;
                case 2:
                    tc.firstChild.checked = (rowContent._cellContentCollection[i] != "0") ? true : false;
                    tc.firstChild.style.display = "block";
                    tc.lastChild.style.display = "none";
                    tc.firstChild.fireEvent("onclick");
                    break;
                case 3:
                    tc.firstChild.value = rowContent._cellContentCollection[i];
                    tc.firstChild.style.display = "block";
                    tc.firstChild.fireEvent(this._eventdesc);
                    tc.lastChild.style.display = "none";
                    break;
                case 4:
                    tc.firstChild.disabled = false;
                    tc.firstChild.fireEvent("onclick");
                    break;
                case 5:
                    var value_combox_temp = rowContent._cellContentCollection[i];
                    for(var t = 0; t < tc.firstChild.options.length; t++)
                    {
                        for(var k = 0; k < value_combox_temp.length; k++)
                            if(tc.firstChild.options[t].value == value_combox_temp[k])
                            {
                                tc.firstChild.options[t].selected = true;
                            }
                    }
                    tc.firstChild.style.display = "block";
                    tc.firstChild.fireEvent(this._eventdesc);
                    tc.lastChild.style.display = "none";
                    break;
                default:
                    tc.innerHTML = rowContent._cellContentCollection[i] == "" ? "<span>&nbsp;</span>" : ("<span>" + rowContent._cellContentCollection[i] + "</span>");
                    break;
            }
        }
        var tc =  tr.cells(i);
        tc.children[0].style.display = "none";
        tc.children[1].style.display = "none";
        tc.children[2].style.display = "";
        tc.children[3].style.display = "";
    }
    
    this.cancelRow = function(obj)
    {
        var tr = obj.parentElement.parentElement;
        if(this._RowContents.length == tr.rowIndex - 1)
            return;
        var rowContent = this._RowContents[tr.rowIndex - 1];
        rowContent._editing = false;
        for(var i = 0; i < this._CellTypes.length; i++)
        {
            var tc = tr.cells(i);
            switch(this._CellTypes[i]._type)
            {
                case 1:
                case 3:
                    tc.firstChild.value = rowContent._cellContentCollection[i];
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                case 2:
                    tc.firstChild.checked = (rowContent._cellContentCollection[i] != "0") ? true : false;
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                case 4:
                    tc.firstChild.checked = (rowContent._cellContentCollection[i] != "0") ? true : false;
                    tc.firstChild.disabled = true;
                    break;
                case 5:
                    var value_combox_temp = rowContent._cellContentCollection[i];
                    for(var t = 0; t < tc.firstChild.options.length; t++)
                    {
                        for(var k = 0; k < value_combox_temp.length; k++)
                            if(tc.firstChild.options[t].value == value_combox_temp[k])
                            {
                                tc.firstChild.options[t].selected = true;
                            }
                    }
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                default:
                    tc.innerHTML = rowContent._cellContentCollection[i] == "" ? "<span>&nbsp;</span>" : ("<span>" + rowContent._cellContentCollection[i] + "</span>");
                    break;
            }
        }
        var tc =  tr.cells(i);
        tc.children[0].style.display = "";
        tc.children[1].style.display = "";
        tc.children[2].style.display = "none";
        tc.children[3].style.display = "none";
    }
    
    this.updateEvent = function(tr)
    {
        return null;
    }
    
    this.updateRow = function(obj)
    {
        var tr = obj.parentElement.parentElement;
        if((tr.cells(this._rowDspIndex).firstChild)&&(tr.cells(this._rowDspIndex).firstChild.value.replace(/ /g,"") == "")&&(!confirm("确定插入空" + this._rowDspPrefix + "？")))
            return;
        var allTrText = this.updateEvent(tr);
        if(this._RowContents.length == tr.rowIndex - 1)
            if(!allTrText)
            {
                alert("更新失败");
                return false;
            }
            else
            {
                this._RowContents.push(new RowContent(allTrText));//得到更新后的数据,返回一个字符串数组
                this.insertRow(-1);
            }
        else
            if(!allTrText)
                alert("更新失败");
            else
                this._RowContents[tr.rowIndex - 1] = new RowContent(allTrText);//得到更新后的数据
        var rowContent = this._RowContents[tr.rowIndex - 1];
        rowContent._editing = false;
        for(var i = 0; i < this._CellTypes.length; i++)
        {
            var tc = tr.cells(i);
            switch(this._CellTypes[i]._type)
            {
                case 1:
                    tc.lastChild.innerText =  " " + rowContent._cellContentCollection[i];
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                case 3:
                    tc.lastChild.innerText =  " " + Table_Select_GetOpt(this._CellTypes[i]._ctrl.options,rowContent._cellContentCollection[i]).text;
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                case 2:
                    tc.lastChild.innerText =  rowContent._cellContentCollection[i] != "0" ? this._rightDesc : this._wrongDesc;
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                case 4:
                    tc.firstChild.checked = (rowContent._cellContentCollection[i] != "0") ? true : false;
                    tc.firstChild.disabled = true;
                    break;
                case 5:
                    var text_combox_temp = "";
                    for(var t = 0; t < this._CellTypes[i]._ctrl.options.length; t++)
                    {
                        if(this._CellTypes[i]._ctrl.options[t].selected)
                            text_combox_temp += "，" + this._CellTypes[i]._ctrl.options[t].text;
                    }
                    tc.lastChild.innerText = text_combox_temp == "" ? " " : text_combox_temp.substr(1);
                    tc.firstChild.style.display = "none";
                    tc.lastChild.style.display = "block";
                    break;
                default:
                    tc.innerHTML = rowContent._cellContentCollection[i] == "" ? "<span>&nbsp;</span>" : ("<span>" + rowContent._cellContentCollection[i] + "</span>");
                    break;
            }
        }
        var tc =  tr.cells(i);
        tc.children[0].style.display = "";
        tc.children[1].style.display = "";
        tc.children[2].style.display = "none";
        tc.children[3].style.display = "none";
    }
    
    this.initData = function()
    {
        while(1 < this._table.rows.length)
            this._table.deleteRow();
    }

    this.sort = function (cellIndex) {
        if (this._sort_index != cellIndex) {
            this._sort_index = cellIndex;
            this._sort_check = true;
        }
        else
            this._sort_check = !this._sort_check;
        if (window.jQuery) {
            ///用jquery排序速度更快
            var sortList = [];
            for (var j = 1; j < this._table.rows.length - 1; j++)
                sortList.push([j, this._table.rows[j].cells[this._sort_index].lastChild.innerText]);
            Table_Row_Compare(sortList, this._sort_check);
            for (var j = 0; j < sortList.length; j++) {
                jQuery(this._table.rows(sortList[j][0])).appendTo(jQuery(this._table)); //挨个往表后面排
                for (var k = j + 1; k < sortList.length; k++) {//碰到被排序行后面的行，因为被排序行被移走了，全部行id-1
                    if (sortList[k][0] > sortList[j][0])
                        sortList[k][0] -= 1;
                }
            }
            jQuery(this._table.rows(1)).appendTo(jQuery(this._table)); //将维护行排到最后
            ///排序完毕
        }
        else {
            Table_Row_Sort(this._RowContents, this._sort_index, this._sort_check);
            this.initData();
            this.contentRow();
        }
        return false;
    }
}
function Table_Row_Compare(sortList, b) {
    sortList.sort(function (value1, value2) {
        return Table_Value_Compare(value1[1], value2[1]) * (b ? 1 : -1);
    });
}
function Table_Row_Sort(arr,i,b)
{
    arr.sort(function(value1,value2)
    {
        return Table_Value_Compare(value1._cellContentCollection[i],value2._cellContentCollection[i]) * (b ? 1 : -1);
    });
}

function Table_Value_Compare(value1,value2) {
    return value1.localeCompare(value2);
}

