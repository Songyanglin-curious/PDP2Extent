﻿
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
        var c = tableCols;
        for(var i=0; i< $table.find("tr").length; i++){
    }
})