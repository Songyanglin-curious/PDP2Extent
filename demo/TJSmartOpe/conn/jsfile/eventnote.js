function AddNewRow(lstShow) {
    var tablenote = lstShow.tblobj;
    var tr = tablenote.insertRow(-1);
    tr.attachEvent("onclick", function () { rowClickNote("", lstShow); });
    //var trclassName = (tr.rowIndex % 2 == 1 ? "trFirst" : "trSecond");

    tc = tr.insertCell(-1);
    tc.colSpan = 2;
    tc.style.textAlign = "center";
   // tc.className = "tbCellboth " + trclassName;
    tc.innerText = "";

    tc = tr.insertCell(-1);
    tc.style.textAlign = "center";
    //tc.className = "tbCellboth " + trclassName;
    tc.innerText = "";

    tc = tr.insertCell(-1);
    tc.style.textAlign = "center";
    if (lstShow.id == "lstSingleOrder")
        tc.colSpan = 8;
    else
        tc.colSpan = 6;
    //tc.className = "tbCellboth " + trclassName;
    tc.innerText = "";
    tc.innerHTML = "<div style='font-family:黑体;font-size:20px;height:20;FILTER:shadow(color=gray,direction=225)'>单击可增加记录</div>";

    tc = tr.insertCell(-1);
    tc.style.textAlign = "center";
    tc.style.display = "none";
    //tc.className = "tbCellboth " + trclassName;
    tc.innerText = "";

    tc = tr.insertCell(-1);
    tc.style.textAlign = "center";
    tc.style.display = "none";
    //tc.className = "tbCellboth " + trclassName;
    tc.innerText = "";

    tc = tr.insertCell(-1);
    tc.style.textAlign = "center";
    tc.style.display = "none";
    //tc.className = "tbCellboth " + trclassName;
    tc.innerText = "";

    tc = tr.insertCell(-1);
    tc.style.textAlign = "center";
    tc.style.display = "none";
    //tc.className = "tbCellboth " + trclassName;
    tc.innerText = "";

    tc = tr.insertCell(-1);
    tc.style.textAlign = "center";
    tc.style.display = "none";
    //tc.className = "tbCellboth " + trclassName;
    tc.innerText = "";

    tc = tr.insertCell(-1);
    tc.style.textAlign = "center";
    tc.style.display = "none";
    //tc.className = "tbCellboth " + trclassName;
    tc.innerText = "-1";

    tc = tr.insertCell(-1);
    tc.style.textAlign = "center";
    tc.colSpan = 2;
    //tc.className = "tbCellboth " + trclassName;
    tc.innerText = "";
    moveRowTo(tablenote, tr.rowIndex, 1);
    SetTrClass(lstShow);
}
function moveRowTo(table, old, index) {
    table.moveRow(old, index);
}
function SetTrClass(lstShow) {
    for (var i = 1; i < lstShow.tblobj.rows.length; i++) {
        var trclassName = (lstShow.tblobj.rows(i).rowIndex % 2 == 1 ? "trFirst" : "trSecond");
        for (var j = 0; j < lstShow.tblobj.rows(i).cells.length; j++) {
            lstShow.tblobj.rows(i).cells(j).className = "tbCellboth " + trclassName;
        }
    }
}
function rowClickNote(hidID, lstShow) {
    var trblanknoteid = lstShow.id + "trnoteinfo";
    var strDisplay=document.getElementById(trblanknoteid).style.display;
    if (strDisplay == "none") {
        document.getElementById(trblanknoteid).style.display = "";
    }
    else {
        document.getElementById(trblanknoteid).style.display = "none";
        return;
    }
    var tr = getParentCtrl(event.srcElement, "TR");
    var inforow = document.getElementById(trblanknoteid).rowIndex;
    var index = tr.rowIndex;
    if (inforow > index)
        lstShow.tblobj.moveRow(inforow, index + 1);
    else
        lstShow.tblobj.moveRow(inforow, index);
    for (var i = 1; i < lstShow.tblobj.rows.length; i++) {
        if (lstShow.tblobj.rows(i).cells.length > 1) {
            if (lstShow.tblobj.rows(i).cells(lstShow.tblobj.rows(i).cells.length - 2).innerText == tr.cells(tr.cells.length - 2).innerText) {
                for (var j = 0; j < lstShow.tblobj.rows(i).cells.length; j++) {
                    lstShow.tblobj.rows(i).cells(j).className = "tempCell";
                }
                //设置隐藏的noteid的值；需要修改
                if(hidID!="")
                    hidID.value = tr.cells(tr.cells.length - 2).innerText;
            }
            else {
                var trclassName = (lstShow.tblobj.rows(i).rowIndex % 2 == 1 ? "trFirst" : "trSecond");
                for (var j = 0; j < lstShow.tblobj.rows(i).cells.length; j++) {
                    lstShow.tblobj.rows(i).cells(j).className = "tbCellboth " + trclassName;
                }
            }
        }
        else {
            var trclassName = (lstShow.tblobj.rows(i).rowIndex % 2 == 1 ? "trFirst" : "trSecond");
            lstShow.tblobj.rows(i).cells(0).className = "tbCellboth " + trclassName;
        }
    }
    if(lstShow.id.indexOf('note')>0)
        showNoteInfo(tr);
    else
        ShowCmdInfo(tr);
}
function AddInfoRow(divShow, lstShow) {
    var tablenote = lstShow.tblobj;
    var tr = tablenote.insertRow(-1);
    tr.id = lstShow.id + "trnoteinfo"; 

    var trclassName = (tr.rowIndex % 2 == 1 ? "trFirst" : "trSecond");

    tc = tr.insertCell(-1);
    tc.colSpan = 17;
    tc.style.textAlign = "center";
    tc.className = "tbCellboth " + trclassName;
    tc.appendChild(divShow);
    //tc.style.height = "200px";
    document.getElementById(lstShow.id + "trnoteinfo").style.display = "none";
}
