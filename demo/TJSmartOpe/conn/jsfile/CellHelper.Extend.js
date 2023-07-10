
$.extend({
    /*
        重置Cell报表Table各列的列宽格式。
        参数说明：
            tableId:需要调整的table ID
            tableWidth: 需要调整的table最大宽度
            tableCols: 该table的最大格式列
            tableColWidth: 该table最大格式列的列宽格式数据[10,20,30]
    */
    ReSizeCellTable:function(tableId,tableWidth,tableCols,tableColWidth){ 
        var $table = $("#"+tableId);
        $table.find("span").removeAttr("style");
        $table.width(tableWidth);
        var c = tableCols;        var colWh = tableColWidth;        if(c==colWh.length) {alert('数据表列与数据表列宽不一致,请核对参数！');return false;}             var r = null;        var si = 0;
        for(var i=0; i< $table.find("tr").length; i++){            if($table.find("tr").eq(i).find("td").length == c){                r=$table.find("tr").eq(i); si = i; break;            }        }        if(r==null) {alert('未获取摸板列！');return false;}                for(var i=0; i< r.find("td").length; i++){                        $table.eq(si).find("td").eq(i).width(colWh[i]);            $table.eq(si).find("td").eq(i).find("span").width(colWh[i]).css('word-break','break-all');        }
    }
})
