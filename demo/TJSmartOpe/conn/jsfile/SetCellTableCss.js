// JScript 文件
    function setWidth()
    {
        var div=document.getElementById("divWidth");
        var table=document.getElementById("tbl")
        var ScreenWidth=window.screen.width;
        if(ScreenWidth==1024)
        {
            div.style.width="690px";
            table.style.width="665px";
        }
        if(ScreenWidth==1280)
        {
            div.style.width="900px";
            table.style.width="875px";
        } 
    }
    function setTableColor(startRowIndex,tableID)
    {
        tableID.rows[0].cells[0].style.color="#012c6d"
        for(var i=startRowIndex;i<tableID.rows.length;i++)
        {
            for(var j=0;j<tableID.rows[i].cells.length;j++)
            {
                tableID.rows[i].cells[j].style.backgroundColor="";
                tableID.rows[i].cells[j].style.color="#012c6d";
            }
            tableID.rows[i].className =i%2==1?"TR_ALTERNATE_1":"TR_ALTERNATE_2" ;
        }
    }
